import axios from 'axios';
import {
	Configuration, 	UserInfoDto, FgppolrJoin,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { Modal } from 'ant-design-vue';
import { Action } from 'vuex-class';
import infoModal from '@/plugins/info/infoModal';
import router from '@/router';
import { LoginState } from './model';
import store from '../../store/index';
// eslint-disable-next-line import/no-cycle

// import router from '../../router';
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
}

export class UserService implements PluginObject<UserSerivceOption> {
		h = (Vue as any).$createElement;

    private vue: Vue;

		private options: UserSerivceOption;

    private _loginState$ = new BehaviorSubject<LoginState>(null);

		private isChangingToken = false;

		private isSignOut = false;

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
    		this.signIn(this.token, this.getMe(), this.getPolicyDetail());
    		return true;
    	}
    	this.signOut(false);
    	return false;
		}

		hasValidToken(): boolean {
    	const jwtStr = this.token;
    	// console.log(jwtStr);
    	if (jwtStr) {
    		return !this.isTokenExpired(jwtStr);
    	}
    	return false;
		}

		signIn(value: string, userInfo: UserInfoDto, policyDetail: FgppolrJoin) {
    	const loginState = {
    		accessToken: null,
    		me: null,
    		policyDetail: null,
    	};
    	loginState.accessToken = value;

    	loginState.me = userInfo as UserInfoDto;
    	loginState.policyDetail = policyDetail as FgppolrJoin;
    	sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    	this._loginState$.next(loginState);
    	this.setIntervalCheckItem = setInterval(() => {
    		this.checkTokenExp();
    	}, 5000);

    	// console.log(sessionStorage.getItem(LOGIN_STATE));
    	// axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {
    	// 	headers: {
    	// 		Authorization: `Bearer ${value}`,
    	// 	},
    	// })
    	// 	.then((resp) => {
    	// 		loginState.me = resp.data as AccountDto;
    	// 		sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    	// 		this._loginState$.next(loginState);
    	// 	});
		}

		async signOut(clearToken) {
			if (clearToken) {
				this.isSignOut = true;
				await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/co-auth/logout`, {
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then((resp) => {
						console.log(resp);
						this.clearLoginInfo();
					})
					.catch((err) => {
						// console.log(err);
					})
					.finally(() => {
						this.isSignOut = false;
					});
			} else {
				this.clearLoginInfo();
			}
		}

		clearLoginInfo() {
			sessionStorage.removeItem(LOGIN_STATE);
			sessionStorage.clear();
			this._loginState$.next(null);
			clearInterval(this.setIntervalCheckItem);
		}

		public getMe(): UserInfoDto {
    	if (!this.loginState) {
    		return null;
    	}
    	return this.loginState.me;
		}

		public getPolicyDetail(): FgppolrJoin {
    	if (!this.loginState) {
    		return null;
    	}
    	return this.loginState.policyDetail;
		}

		public async changeToken() {
    	// 避免頻繁換token，小於5分鐘才換
			// console.log(this.getTokenExp() < 28);
			const _this = this;
    	if (this.hasValidToken() && this.getTokenExp() < 28 && !this.isChangingToken) {
				this.isChangingToken = true;
    		await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/auth/current/account`, {
    			headers: {
    				Authorization: `Bearer ${this.token}`,
    			},
    		})
    			.then((resp) => {
						console.log(resp);
    				if (resp.data.status == 200) {
    					const getData = resp.data.data;
    					const loginStateObj = JSON.parse(sessionStorage.getItem(LOGIN_STATE));
    					loginStateObj.accessToken = getData.accessToken;
    					this.loginState.accessToken = getData.accessToken;
    					sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginStateObj));
    				} else {
    					// 失敗訊息
							console.log(resp.data.apiError);
    					const errorMsg = [];
    					Object.values(resp.data.apiError).map((i) => {
    						(i as any).map((j) => {
    							errorMsg.push(j);
    						});
    					});
							infoModal.alertForSingleError(
								{
									title: '錯誤訊息',
									content: errorMsg.toString(),
									onCallback() {
										_this.signOut(false);
									},
								},
							);
    				}
    			})
    			.catch((err) => {
    				// console.log(err);
    			})
					.finally(() => {
						this.isChangingToken = false;
					});
    	}
		}

		isTokenExpired(token: string): boolean {
    	const decoded = jwt.decode(token);
    	const now = Date.now();
    	return Math.floor(now / 1000) > decoded.exp;
		}

		private getTokenExp(): number {
    	const tokenExp = jwt.decode(this.token).exp;
    	const now = Date.now();
    	// Token 剩餘時效 (分鐘)
    	const lessTime = Math.floor((tokenExp - Math.floor(now / 1000)) / 60);
    	// TEST:
    	console.log(lessTime);
    	return lessTime;
		}

		// 確認Token時效
		private checkTokenExp() {
    	if (!Vue.prototype.$user.hasValidToken() && !this.isChangingToken) {
    		Vue.prototype.$user.signOut(false);
    		// 彈出視窗
				infoModal.alertForSingleError(
					{
						title: '閒置超過30分鐘',
						content: '請重新登入系統',
						onCallback() { router.replace({ path: '/login' }); },
					},
				);
    	}
		}

		// 讓LoginState.accessToken賦值
		public changeLoginStateAccessToken(value: string) {
			this.loginState.accessToken = value;
		}

		// 讓isChangingToken賦值
		public changeisChangingToken(value: boolean) {
			this.isChangingToken = value;
		}

		public install(Vue, options: UserSerivceOption) {
    	console.log('user installed');
    	// this.vue = vue;
    	Vue.prototype.$user = this;
    	this.init();

    	// intercept jwt token
    	axios.interceptors.request.use(
				(config) => {
    		if (this.hasValidToken() && !('Authorization' in config.headers.common)) {
    			const token = this.token;
    			config.headers.common.Authorization = `Bearer ${token}`;
    		}
    		return config;
    	}, (error) => Promise.reject(error),
			);

    	// logout on 401/403
    	axios.interceptors.response.use(
    	// Any status code that lie within the range of 2xx cause this function to trigger
    	// Do something with response data
    		async (response) => {
					if (this.token && this.hasValidToken() && !this.isSignOut) {
    				await this.changeToken();
					}
					if (response.data.status === 401 && !this.isChangingToken) {
						console.log('401');
						// this.signOut();
						Modal.error({
							title: 'TOKEN失效',
							content: '請重新登入系統。',
							okType: 'confrim',
							okText: '確定',
							onOk: () => {
								this.signOut(false);
								router.replace({ path: '/login' });
							},
						});
					}

					// 判斷是否被WFA阻擋：status 200且包含 html 字串
					if (response.status === 200 && response.data?.includes?.('text/html; charset=utf-8')) {
						// console.log('response.data WAF 進入', response.data);
						store.dispatch('setWAFModal', {
							visible: true,
							htmlContent: response.data,
						});
					}
					return response;
    		},
    	(error) => {
    		// Any status codes that falls outside the range of 2xx cause this function to trigger
    		// Do something with response error
					console.log(error);
    		if (error.response.status === 401 || error.response.status === 403) {
    			this.signOut(false);
    			options.router.replace({ path: '/login' });
    			options.message.error('權限不足');
    		}
    		return Promise.reject(error);
    	},
    	);
		}
}
export default new UserService();
