import axios from 'axios';
import {
 Configuration, AuthApiFactory, AuthApi, UserDto, UserApi,
} from '@fubonlife/ifap-api-axios-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import { Modal } from 'ant-design-vue/types/modal';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
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
    router: VueRouter;
    Modal: Modal;
}

export class UserService implements PluginObject<UserSerivceOption> {
    private $modal;

    private $router;

    private vue: Vue;

    private eventListener;

    private _loginState$ = new BehaviorSubject<LoginState>(null);

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

    timeOutInterval; // 倒數器容器，刪除用

    timeOutSize = 30; // 時間到，自動登出時間 (分)

    timeOutSizeSeconds = 0;

    initTimeOutSecond() {
        Vue.prototype.$user.timeOutSizeSeconds = Vue.prototype.$user.timeOutSize * 60; // 重新換算秒
    }

    init(): boolean {
        if (this.hasValidToken()) {
            this.signIn(this.token);
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

    signIn(value: string) {
        const loginState = {
            accessToken: null,
            me: null,
        };
        loginState.accessToken = value;
        // localStorage.setItem(LOCAL_TOKEN_KEY, value);
        axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {}, {
            headers: {
                Authorization: `Bearer ${value}`,
            },
        })
        .then((resp) => {
            loginState.me = resp.data as UserDto;
            sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
            this._loginState$.next(loginState);
            this.timeOutCreate();
        });
    }

    timeOutCreate() {
        this.timeOutInterval = setInterval(() => {
            if (this.timeOutSizeSeconds > 0) {
                this.timeOutSizeSeconds--;
                // console.log(this.timeOutSizeSeconds)
            } else {
                // 清除倒數計時器
                clearInterval(this.timeOutInterval)
                // 登出使用者
                this.signOut()
                // 彈窗 => 時間到
                this.$modal.warning({
                    title: '系統已登出',
                    content: '系統閒置超過30分鐘，請重新登入',
                    okText: '確定',
                    onOk: () => {
                        this.$router.push({ name: 'Login' })
                    },
                })
            }
        }, 1000)
        // 綁定事件 點擊滑鼠 就重置
        window.addEventListener('click', this.initTimeOutSecond, false);
    }

    signOut() {
        const jwtStr = this.token;
        sessionStorage.removeItem(LOGIN_STATE);
        axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/logout`, {}, {
            headers: {
                Authorization: `Bearer ${jwtStr}`,
            },
        });
        this._loginState$.next(null);

        // 移除 滑鼠事件
        window.removeEventListener('click', this.initTimeOutSecond, false);
    }

    public getMe(): UserDto {
        if (!this.loginState) {
            return null;
        }
        return this.loginState.me;
    }

    isTokenExpired(token: string): boolean {
        const decoded = jwt.decode(token);
        const now = Date.now();
        return Math.floor(now / 1000) > decoded.exp;
    }

    public install(Vue, options: UserSerivceOption) {
        console.log('user installed');
        Vue.prototype.$user = this;
        this.init();

        this.$modal = options.Modal;
        this.$router = options.router;

        // intercept jwt token
        axios.interceptors.request.use((config) => {
            if (this.hasValidToken() && !('Authorization' in config.headers.common)) {
                const token = this.token;
                config.headers.common.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));

        // logout on 401/403
        axios.interceptors.response.use((response) =>
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
             response,
         (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === 401 || error.response.status === 401) {
                this.signOut();
                options.router.replace({ path: '/login' });
                options.message.error('權限不足');
            }
            return Promise.reject(error);
        });
    }
}
export default new UserService();
