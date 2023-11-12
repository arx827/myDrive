import { Module, VuexModule, Mutation, Action, MutationAction, getModule } from 'vuex-module-decorators';
import { AccountDto, EmployeeDto } from '@fubonlife/obd-api-axios-sdk';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Message } from 'ant-design-vue/types/message';
import VueRouter from 'vue-router';
import router from '@/router';
import { store } from '@/plugins/store';
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from 'ant-design-vue';
import MessageUtil from '@/assets/config/MessageUtil';
import CommonUtil from '@/assets/config/CommonUtil';

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $user1: UserServiceModule
    }
}

interface LoginState {
    accessToken: string,
    me: AccountDto
}

interface UserSerivceOption {
    message: Message,
    router: VueRouter,
}

const LOGIN_STATE = 'login_state';
const TOKEN_ISSUER = "success_from_sso";

//jwt audience enum
export enum JwtAud {
    SVC = "svc",
    AUD_INFREPLY = "aud_infReply",
}
// request header enum
export enum HeaderObdLoginFromEnum {
    INFROM_LOGIN = "informLogin",
}

@Module({ dynamic: true, namespaced: true, store, name: 'UserServiceModule' })
export default class UserServiceModule extends VuexModule {

    _isTokenVerify;

    _isCrowdTokenVerify;

    _loginState$: LoginState = {
        accessToken: '',
        me: null
    };

    get loginState$(): LoginState {
        return this._loginState$;
    }

    get loginState(): LoginState {
        const memLoginState = this._loginState$;
        if (memLoginState.accessToken) {
            return memLoginState;
        }
        const loginStateStr = localStorage.getItem(LOGIN_STATE);
        if (loginStateStr) {
            return JSON.parse(loginStateStr);
        }
        return null;
    }

    get token(): string {
        if (this.loginState) {
            return this.loginState.accessToken;
        }
        return null;
    }

    get hasValidToken(): boolean {
        let jwtStr = this.token;
        // 檢查storage token，如果有效就放行，無效則繼續檢查。
        if (jwtStr) {
            const decoded = jwt.decode(jwtStr);
            const now = Date.now();
            if (decoded) {
                let isValid = !(Math.floor(now / 1000) > decoded.exp);
                if (isValid){
                    return isValid;
                }
            }
        }

        // // 檢查SSO驗證成功cookie token，如果有效就放行，無效就無效了。
        //     let dtwFblCookies = localStorage.getItem("success_from_sso");
        //     if (dtwFblCookies) {
        //         const decoded = jwt.decode(dtwFblCookies);
        //         const now = Date.now();
        //         if (decoded) {
        //             let isValid = !(Math.floor(now / 1000) > decoded.exp);
        //             // if (isValid) {
        //             //     // SSO驗證成功cookie token有效的話就登入
        //             //     // 登入後SSO驗證成功cookie token會變成storage token
        //             //     LoginModule.signIn(dtwFblCookies);
        //             // }
        //             return isValid;
        //         }
        //     }
        return false;
    }

    get adAccountFromToken(): string {
        if (this.hasValidToken) {
            const decoded = jwt.decode(this.token);
            if (decoded.sub) {
                return decoded.sub;
            }
        }
        return null;
    }

    get tokenVerify(): boolean {
        return this.showSignOutModal;
    }

    showSignOutModal: boolean = false;

    @Mutation
    async init(): Promise<boolean> {
        if (this.hasValidToken) {
            await this.signIn(this.token);
            return true;
        } else {
            this.signOut;
            return false;
        }
    }

    /**
     * 監聽token是否失效，失效及登出(前端登出)
     */
    @Mutation
    isTokenVerify() {
        this.showSignOutModal = false;
        let checkTokenTimer = () => {
            const isValid = getTokenExp();
            // // 判斷token是否失效，失效做登出
            if (!isValid) {
                // this.showSignOutModal = true;
                // 失效時須關閉比對token
                clearInterval(this._isTokenVerify);
            }
        }
        // 抓取token時間並比對去後端換token時間
        let getTokenExp = async () => {
            const jwtStr = LoginModule.token;
            // console.log(jwtStr);
            if (jwtStr) {
                const decoded = jwt.decode(jwtStr);
                const now = Date.now();
                //    console.log("time: ", decoded.exp - Math.floor(now / 1000));
                // token剩五分鐘時後端檢查token
                if ((decoded.exp - Math.floor(now / 1000)) <= (60 * 5)) {
                    // 後端驗證token，如還未失效換新的token
                    await validateToken();
                }
                return !(Math.floor(now / 1000) > decoded.exp);
            }
            return false;
        }
        /**
        * 檢查token時效，如果有效則更新，無效則清除
        */
        let validateToken = async () => {
            if (LoginModule.hasValidToken) {
                // 後端確認token前先關掉比對token機制
                clearInterval(this._isTokenVerify);
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/checkToken`, {
                    token: LoginModule.loginState.accessToken
                }, {
                    headers: {
                        'Authorization': `Bearer ${LoginModule.loginState.accessToken}`
                    }
                }).then((resp) => {
                    if (resp.data) {
                        LoginModule.signIn(resp.data.token);
                    } else {
                        // 關閉登出彈跳視窗 
                        // this.showSignOutModal = true;
                        //  LoginModule.signOut();
                    }
                }).catch(err => {
                    // api異常需登出
                    //彈跳視窗先關閉，並且不清除localStorage的登入資訊
                    // this.showSignOutModal = true;
                    // localStorage.removeItem("login_state");
                });
            } else {
                this.showSignOutModal = true;
                //    LoginModule.signOut();
            }
        }
        this._isTokenVerify = setInterval(() => checkTokenTimer(), 1000);
    }

    /**
     * 
     * @param fromLogin : 判斷從哪個登入的 做相對應的登出
     */
    @Mutation
    async signOut(fromLogin?: HeaderObdLoginFromEnum) {
        // 登出刪除token監控
        clearInterval(this._isTokenVerify);
        // 登出 透過從哪邊登入的資訊做後端登出刪除相關DB 資訊
        if (fromLogin === HeaderObdLoginFromEnum.INFROM_LOGIN) {
            if (router.currentRoute.path !== '/infNotiReplyLogin') {
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/inform/informLogout`);
            }

        } else {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/logout`, {
                headers: {
                    'Authorization': `Bearer ${this._loginState$.accessToken}`
                }
            });
        }

        // 暫存登入者資訊
        let userName = localStorage.getItem("username");
        let isAccountSaved = localStorage.getItem("isAccountSaved");
        // 清空所有local storage資訊
        localStorage.clear();
        // 塞回登入者資訊
        localStorage.setItem("username", userName);
        localStorage.setItem("isAccountSaved", isAccountSaved);
        this._loginState$ = {
            accessToken: '',
            me: null
        };


        // 登出 透過從哪邊登入的資訊做導頁到原本的登入口
        if (fromLogin === HeaderObdLoginFromEnum.INFROM_LOGIN) {
            if (router.currentRoute.path !== '/infNotiReplyLogin') {
                router.push({ path: '/infNotiReplyLogin' });
            }
        } else {
            if (router.currentRoute.path !== '/login') {
                router.push({ path: '/login' });
            }
        }

        // 登出 需清除展延一次crowd token
        // clearInterval(this._isCrowdTokenVerify);

    }

    /**
     * 沒有轉到登入頁面的登出
     */
    @Mutation
    async signOutWithoutToLogin() {
        // 登出刪除token監控
        clearInterval(this._isTokenVerify);
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/logout`, {
            headers: {
                'Authorization': `Bearer ${this._loginState$.accessToken}`
            }
        });

        // 暫存登入者資訊
        let userName = localStorage.getItem("username");
        let isAccountSaved = localStorage.getItem("isAccountSaved");
        // 清空所有local storage資訊
        localStorage.clear();
        // 塞回登入者資訊
        localStorage.setItem("username", userName);
        localStorage.setItem("isAccountSaved", isAccountSaved);
        this._loginState$ = {
            accessToken: '',
            me: null
        };
    }

    @Mutation
    public getMe(): AccountDto {
        if (!this.loginState) {
            return null;
        }
        return this.loginState.me;
    }

    @MutationAction({ mutate: ['_loginState$'] })
    async signIn(value: string) {
        const loginState = {
            accessToken: null,
            me: null
        }

        loginState.accessToken = value;
        // 解析 jwt
        var jwtObj: any = jwt.decode(value);
        // console.log(jwtObj); // 輔助顯示用 註解
        // 判斷 jwt 欄位 audience 來區別往哪邊登入
        if (jwtObj != null && !ValidationUtil.isEmpty(jwtObj.aud)) {
            if (jwtObj.aud == JwtAud.AUD_INFREPLY) {
                var meObj: AccountDto = {};
                var meEmployeeObj: EmployeeDto = {};
                meObj.id = jwtObj.sub;
                meEmployeeObj.id = jwtObj.sub;
                meEmployeeObj.name = jwtObj.name;
                meObj.employee = meEmployeeObj;
                loginState.me = meObj;
                LoginModule.isTokenVerify();
            } else {
                // localStorage.setItem(LOCAL_TOKEN_KEY, value);
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${value}`
                    }
                });
                // 去認取得Authorization後再啟動比對token
                LoginModule.isTokenVerify();
                loginState.me = response.data as AccountDto;
                // 啟動每十五分鐘展延crowdtoken
                // this._isCrowdTokenVerify = setInterval(LoginModule.crowdValidateToken, 1000 * 60 * 15);
            }
        }

        localStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
        // this._loginState$ = loginState;
        return {
            _loginState$: loginState
        };
    }

    /**
     * @param 每十五分鐘展延一次crowd token
     */
    @Mutation
    async crowdValidateToken() {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/checkCrowdToken`, {
            token: ""
        }).catch(err => {
            console.info("crowdValidateToken failed.");
        });
    }

}

export const LoginModule = getModule(UserServiceModule);