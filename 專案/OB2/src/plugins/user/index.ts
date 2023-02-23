import axios from 'axios';
import { Configuration, AuthApiFactory, AuthApi, 
    // ProductApi, ProductSpecApi, ProductApiFactory, ProductSpecApiFactory, 
 } from '@fubonlife/obd-api-axios-sdk'
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginState } from './model';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { LoginModule, HeaderObdLoginFromEnum } from '@/plugins/store/LoginModule';
import { ErrorMessageModule } from '@/plugins/store/ErrorMessageModule';

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

// header key
export const header_obdLoginFrom = "obd-login-from";


export class UserService implements PluginObject<UserSerivceOption> {
    private vue: Vue;

    // private _loginState$ = new BehaviorSubject<LoginState>(null);

    // public get loginState$(): Observable<LoginState> {
    //     return this._loginState$;
    // }

    // public get loginState(): LoginState {
    //     const memLoginState = this._loginState$.getValue()
    //     if (memLoginState) {
    //         return memLoginState;
    //     }
    //     const loginStateStr = localStorage.getItem(LOGIN_STATE);
    //     if (loginStateStr) {
    //         return JSON.parse(loginStateStr);
    //     }
    //     return null;

    // }

    // public get token(): string {
    //     if (this.loginState) {
    //         return this.loginState.accessToken;
    //     }
    //     return null;
    // }

    // init(): boolean {
    //     if (this.hasValidToken()) {
    //         this.signIn(this.token);
    //         return true;
    //     } else {
    //         this.signOut();
    //         return false;
    //     }
    // }

    // hasValidToken(): boolean {
    //     const jwtStr = this.token;
    //     // console.log(jwtStr);
    //     if (jwtStr) {
    //         return !this.isTokenExpired(jwtStr);
    //     }
    //     return false;
    // }

    // signIn(value: string) {
    //     const loginState = {
    //         accessToken: null,
    //         me: null
    //     }
    //     loginState.accessToken = value
    //     // localStorage.setItem(LOCAL_TOKEN_KEY, value);
    //     axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {
    //         headers: {
    //             'Authorization': `Bearer ${value}`
    //         }
    //     })
    //         .then(resp => {
    //             loginState.me = resp.data as AccountDto;
    //             localStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    //             this._loginState$.next(loginState);
    //         });

    // }

    // signOut() {
    //     localStorage.removeItem(LOGIN_STATE);
    //     this._loginState$.next(null);
    // }

    // public getMe(): AccountDto {
    //     if (!this.loginState) {
    //         return null;
    //     }
    //     return this.loginState.me;
    // }
    // isTokenExpired(token: string): boolean {
    //     const decoded = jwt.decode(token);
    //     const now = Date.now();
    //     return Math.floor(now / 1000) > decoded.exp;

    // }
    public install(Vue, options: UserSerivceOption) {
        console.log('user installed');
        // this.vue = vue;
        Vue.prototype.$user = this;
        LoginModule.init();

        // intercept jwt token
        axios.interceptors.request.use((config) => {
            if (LoginModule.hasValidToken && !('Authorization' in config.headers.common)) {
                const token = LoginModule.token;
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
                
                // LoginModule.signOut();
                // options.router.replace({ path: '/login' });
                // options.message.error('權限不足');
                
                /**
                 *  取 錯誤時回傳的 request header 資訊(從哪邊登入發生權限不足錯誤)
                 *  沒取到 給 null -> 照原本的 logout 
                 **/
                var obdLoginFrom:HeaderObdLoginFromEnum = 
                    header_obdLoginFrom in error.response.headers ? error.response.headers[header_obdLoginFrom] : null;
                LoginModule.signOut(obdLoginFrom);
               
            }else if (error.response.status === 423){
                // 後端傳回 423:lock 表示 帳號已登入，目前僅 會辦回覆 security 有做此回覆
                // 僅 console 由外層去 catch 做顯示處理
                console.log("423:LOCK..account has been login");
            }else if (error.response.status === 500) {
                // 後端會傳500表示系統異常或無權限，將由mainPage統一處理錯誤訊息
                ErrorMessageModule.setErrorState(error.response.status);
            }


            return Promise.reject(error);
        });

    }

}
export default new UserService();