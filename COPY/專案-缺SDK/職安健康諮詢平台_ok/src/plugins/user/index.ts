import axios from 'axios';
import {
	Configuration, UserInfoDto, RoleDto,
} from '@fubonlife/oss-api-axios-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import infoModal from '@/plugins/notification/infoModal';
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
    router: VueRouter;
}

export class UserService implements PluginObject<UserSerivceOption> {
    private vue: Vue;

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

		setIntervalCheckItem = null;

		init(): boolean {
    	if (this.hasValidToken()) {
    		this.signIn(this.token, this.getMe(), this.getRoles());
    		console.log('登入');
    		return true;
    	}
    	// this.signIn(this.token, this.getMe(), this.getRoles());
    	this.signOut();
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

		signIn(token: string, userInfo: UserInfoDto, roles: RoleDto[]) {
    	const loginState = {
    		accessToken: null,
    		me: null,
    		roles: null,
    		selectedRole: null,
    	};
    	const selectedRole = JSON.parse(sessionStorage.getItem(LOGIN_STATE)) ? JSON.parse(sessionStorage.getItem(LOGIN_STATE)).selectedRole : '1';
    	loginState.accessToken = token;
    	loginState.me = userInfo as UserInfoDto;
    	loginState.roles = roles;
    	loginState.selectedRole = selectedRole;
    	sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    	this._loginState$.next(loginState);
			this.setIntervalCheckItem = setInterval(() => {
    		this.checkTokenExp();
    	}, 5000);
		}

		async signOut(clearToken?) {
			if (clearToken) {
				await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/oss-auth/logout`, {
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
						// this.isSignOut = false;
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

		public changeSelectedRole(roleId) {
    	const loginStateObj = JSON.parse(sessionStorage.getItem(LOGIN_STATE));
    	loginStateObj.selectedRole = roleId;
    	this.loginState.selectedRole = roleId;
    	sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginStateObj));
		}

		public changeToken(newToken) {
    	const loginStateObj = JSON.parse(sessionStorage.getItem(LOGIN_STATE));
    	loginStateObj.accessToken = newToken;
    	this.loginState.accessToken = newToken;
    	sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginStateObj));
		}

		// 確認Token時效
		private checkTokenExp() {
    	if (!Vue.prototype.$user.hasValidToken()) {
    		// 彈出視窗
				infoModal.alertError(
					{
						title: '閒置超過30分鐘',
						content: '請重新登入系統',
						onCallback() {
							router.replace({ path: '/login' });
						},
					},
				);
				Vue.prototype.$user.signOut();
    	}
		}

		public getMe(): UserInfoDto {
    	if (!this.loginState) {
    		return null;
    	}
    	return this.loginState.me;
		}

		public getRoles(): RoleDto[] {
    	if (!this.loginState) {
    		return null;
    	}
    	return this.loginState.roles;
		}

		public getSelectedRole() {
    	if (!this.loginState) {
    		return null;
    	}
    	return this.loginState.selectedRole;
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
    			if (response.data.tokenPair) {
    				await this.changeToken(response.data.tokenPair.accessToken);
    			}
    			if (response.data.status === 401) {
    				console.log('401');
    				// this.signOut();
    				infoModal.alertError({
    					title: 'TOKEN失效',
    					content: '請重新登入系統。',
    					onCallback: () => {
    						this.signOut();
    						router.replace({ path: '/login' });
    					},
    				});
    			}
    			return response;
    		},
    		(error) => {
    			// Any status codes that falls outside the range of 2xx cause this function to trigger
    			// Do something with response error
    			console.log(error);
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
