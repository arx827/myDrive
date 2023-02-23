import axios from 'axios';
import { AdmUserDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { Modal } from 'ant-design-vue';
import router from '@/router';
import { LoginState } from './model';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    $user: UserService;
  }
}

export const LOGIN_STATE = 'login_state';

export interface UserSerivceOption {
  message: Message;
  // Modal: modald;
  router: VueRouter;
}

export class UserService implements PluginObject<UserSerivceOption> {
  h = (Vue as any).$createElement;

  private vue: Vue;

  private _loginState$ = new BehaviorSubject<LoginState>(null);

  private isChangingToken = false;

  public get loginState$(): Observable<LoginState> {
    return this._loginState$;
  }

  public get loginState(): LoginState {
    const memLoginState = this._loginState$.getValue();
    if (memLoginState) {
      return memLoginState;
    }
    const loginStateStr = sessionStorage.getItem(LOGIN_STATE);
    if (loginStateStr) {
      return JSON.parse(loginStateStr);
    }
    return null;
  }

  public get token(): string {
    if (this.loginState) {
      return this.loginState.accessToken;
    }
    return null;
  }

  setIntervalCheckItem = null;

  init(): boolean {
    if (this.hasValidToken()) {
      this.signIn(this.token, this.getMe());
      return true;
    }
    this.signOut();
    return false;
  }

  hasValidToken(): boolean {
    const jwtStr = this.token;
    if (jwtStr) {
      return !this.isTokenExpired(jwtStr);
    }
    return false;
  }

  signIn(value: string, userInfo: AdmUserDto) {
    const loginState = {
      accessToken: value,
      me: null,
    };
    loginState.accessToken = value;

    loginState.me = userInfo;
    sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    this._loginState$.next(loginState);
    this.setIntervalCheckItem = setInterval(() => {
      this.checkTokenExp();
    }, 1000);
  }

  signOut() {
    sessionStorage.removeItem(LOGIN_STATE);
    sessionStorage.clear();
    this._loginState$.next(null);
    clearInterval(this.setIntervalCheckItem);
  }

  public getMe(): AdmUserDto {
    if (!this.loginState) {
      return null;
    }
    return this.loginState.me;
  }

  public getAdmCbRc() {
    if (!this.loginState) {
      return null;
    }
    return this.loginState.me.admCbrc;
  }

  private async changeToken() {
    const $this = this;
    // 避免頻繁換token，小於28分鐘才換
    if ($this.getTokenExp() < 28 && !$this.isChangingToken) {
      $this.isChangingToken = true;
      await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/current/account`, {
        headers: {
          Authorization: `Bearer ${$this.token}`,
        },
      })
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          const loginStateObj = JSON.parse(sessionStorage.getItem(LOGIN_STATE));
          loginStateObj.accessToken = getData.accessToken;
          this.loginState.accessToken = getData.accessToken;
          sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginStateObj));
        } else {
          // 失敗訊息
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((err) => {
        // console.log(err);
      })
      .finally(() => {
        $this.isChangingToken = false;
      });
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = jwt.decode(token);
    const now = Date.now();
    return Math.floor(now / 1000) > decoded.exp;
  }

  private getTokenExp(): number {
    const tokenExp = jwt.decode(Vue.prototype.$user.token).exp;
    const now = Date.now();
    // Token 剩餘時效 (分鐘)
    const lessTime = Math.floor((tokenExp - Math.floor(now / 1000)) / 60);
    // TEST:
    // console.log(lessTime);
    return lessTime;
  }

  // 確認Token時效
  private checkTokenExp() {
    if (!Vue.prototype.$user.hasValidToken()) {
      Vue.prototype.$user.signOut();
      // 彈出視窗
      Modal.error({
        title: '閒置超過30分鐘',
        content: '請重新登入系統。',
        okType: 'confrim',
        okText: '確定',
        onOk: () => {
          router.replace({ path: '/login' });
        },
      });
    }
  }

  public install(Vue, options: UserSerivceOption) {
    // console.log('user installed');
    // this.vue = vue;
    Vue.prototype.$user = this;
    this.init();

    // intercept jwt token
    axios.interceptors.request.use((config) => {
      if (this.hasValidToken() && !('Authorization' in config.headers.common)) {
        const { token } = this;
        config.headers.common.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => Promise.reject(error));

    // logout on 401/403
    axios.interceptors.response.use(
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      async (response) => {
        const $resp = null;
        if (this.hasValidToken()) {
          await this.changeToken();
        }

        if (response.data.status === 401) {
          clearInterval(this.setIntervalCheckItem);
          this.signOut();
          Modal.error({
            title: '閒置超過30分鐘',
            content: '請重新登入系統。',
            okType: 'confrim',
            okText: '確定',
            onOk: () => {
              router.replace({ path: '/login' });
            },
          });
        }
        return response;
      },
      (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
        if (error.response.status === 401 || error.response.status === 403) {
          this.signOut();
          options.router.replace({ path: '/login' });
          options.message.error('權限不足');
        }
        return Promise.reject(error);
      },
    );
  }
}
export default new UserService();
