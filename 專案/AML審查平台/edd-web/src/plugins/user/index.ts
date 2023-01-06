import axios from 'axios';
import { Configuration, AuthApiFactory, AuthApi, ProductApi, ProductSpecApi, ProductApiFactory, ProductSpecApiFactory, AccountVO, AccountApi } from '@fubonlife/edd-api-axios-sdk'
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginState } from './model';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $user: UserService
    }
}

export const LOGIN_STATE = 'login_state';
export const REVIEW_ASSIGNMENT_PAGE = 'review_assignment_page';

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
            //this.signIn(this.token);
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
            loginState.me = resp.data as AccountVO;
            localStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
            this._loginState$.next(loginState);
        })
        .catch(err => {
            console.log(err);
        })
    }

    callUpdateSoftLockApi() {
        const efileNo = sessionStorage.getItem("review_assignment_page")
            ? sessionStorage.getItem("review_assignment_page")
            : (localStorage.getItem("review_assignment_page") ? localStorage.getItem("review_assignment_page") : "");
        if(efileNo){   
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/review/update-soft-lock`, {
                "efileNo": efileNo.replaceAll("@",""),
                "softLock": 'N'
            })
        }
    }

    async callLogoutApi() {
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/logout`);
    }

    async signOut() {
        //登出時拋解softlock api
        await this.callUpdateSoftLockApi();
        localStorage.removeItem(LOGIN_STATE);
        this._loginState$.next(null);
    }

    public getMe(): AccountVO {
        if (!this.loginState) {
            return null;
        }
        return this.loginState.me;
    }
    isTokenExpired(token: string): boolean {
        const decoded = jwt.decode(token);
        const now = Date.now();
        return decoded ? Math.floor(now / 1000) > decoded.exp : false;

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
            return response;
        }, (error) => {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            if (error.response.status === 401 || error.response.status === 403) {
                this.signOut();
                window.location.href = process.env.VUE_APP_LOGIN_URL;
                options.message.error('權限不足');
            }

            // 帳號已在其他裝置登入
            if (error.response.data.apiErrorCode.includes("ANOTHER_DEVICE_LOGIN")) {
                this.signOut();
                this.callLogoutApi();
                window.location.href = process.env.VUE_APP_LOGIN_URL;
            }

            // 登入逾期
            if (error.response.data.apiErrorCode.includes("TOKEN_EXPIRED")) {
                this.signOut();
                this.callLogoutApi();
                window.location.href = process.env.VUE_APP_LOGIN_URL;
            }

            return Promise.reject(error);
        });

    }

}
export default new UserService();