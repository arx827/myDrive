import axios from 'axios';
import { Configuration, AuthApiFactory, AuthApi, ProductApi, ProductSpecApi, ProductApiFactory, ProductSpecApiFactory, AccountDto, AccountApi } from '@fubonlife/<%= code %>-api-axios-sdk'
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginState } from './model';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { message } from 'ant-design-vue';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $user: UserService
    }
}

export const LOGIN_STATE = 'login_state';

export interface UserSerivceOption {
    message: Message,
    router: VueRouter,
}

export class UserService implements PluginObject<UserSerivceOption> {
    private vue: Vue;

    private _loginState$ = new BehaviorSubject<LoginState>(null);

    public get loginState$(): Observable<LoginState> {
        return this._loginState$;
    }

    public get loginState(): LoginState {
        const memLoginState = this._loginState$.getValue()
        if (memLoginState) {
            return memLoginState;
        }
        const loginStateStr = localStorage.getItem(LOGIN_STATE);
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

    init(): boolean {
        if (this.hasValidToken()) {
            this.signIn(this.token);
            return true;
        } else {
            this.signOut();
            return false;
        }
    }

    hasValidToken(): boolean {
        const jwtStr = this.token;
        // console.log(jwtStr);
        if (jwtStr) {
            return !this.isTokenExpired(jwtStr);
        }
        return false;
    }

    signIn(value: string) {
        const loginState = {
            accessToken: null,
            me: null
        }
        loginState.accessToken = value
        // localStorage.setItem(LOCAL_TOKEN_KEY, value);
        axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${value}`
            }
        })
            .then(resp => {
                loginState.me = resp.data as AccountDto;
                localStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
                this._loginState$.next(loginState);
            });

    }

    signOut() {
        localStorage.removeItem(LOGIN_STATE);
        this._loginState$.next(null);
    }

    public getMe(): AccountDto {
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
        // this.vue = vue;
        Vue.prototype.$user = this;
        this.init();

        // intercept jwt token
        axios.interceptors.request.use((config) => {
            if (this.hasValidToken() && !('Authorization' in config.headers.common)) {
                const token = this.token;
                config.headers.common['Authorization'] = 'Bearer ' + token;
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        // logout on 401/403
        axios.interceptors.response.use((response) => {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            if (response && response.data) {
                if (response.data.success === false) {
                    alert(response.data.message);
                    return Promise.reject(response);
                }
            }
            return response;
        }, (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error && error.response) {
                switch (error.response.status) {
                  case 401:
                    alert("權限不足");
                    this.signOut();
                    options.router.replace({ path: '/login' });
                    // options.message.error('權限不足');
                    break;
                  case 403:
                    alert("未登入或登入階段已過期，請重新登入");
                    this.signOut();
                    options.router.replace({ path: '/login' });
                    break;
                  case 404:
                    alert("找不到該頁面");
                    break;
                  case 500:
                    alert("伺服器出錯");
                    break;
                  case 503:
                    alert("服務失效");
                    break;
                  default:
                    alert(`連接錯誤:${error}};}`);
                }
            }
            else {
                alert(`未知錯誤:${error}};}`);
            }
            return Promise.reject(error);
        });

    }

}
export default new UserService();