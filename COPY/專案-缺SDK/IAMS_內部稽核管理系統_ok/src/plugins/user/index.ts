import axios from 'axios';
import {
	Configuration, AuthApiFactory, AuthApi, AccountDto, AccountApi,
} from '@fubonlife/iams-api-axios-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import { Message } from 'ant-design-vue/types/message';
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import { LoginState } from './model';
import router from '../../router';
import store from '../../store';
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

    init(): boolean {
    	if (this.hasValidToken() && localStorage.getItem('sign-out-time') !== 'timeUp') {
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
    	store.dispatch('setLoading', true);
    	const loginState = {
    		accessToken: null,
    		me: null,
    	};
    	loginState.accessToken = value;
    	// localStorage.setItem(LOCAL_TOKEN_KEY, value);
    	axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/auth/me`, {
    		headers: {
    			Authorization: `Bearer ${value}`,
    		},
    	})
    		.then((resp) => {
    			if ((resp.data as AccountDto).roles && (resp.data as AccountDto).roles.length === 0) {
    				return router.replace({ path: '/no-authorization' });
    			}
    			loginState.me = resp.data as AccountDto;
    			sessionStorage.setItem(LOGIN_STATE, JSON.stringify(loginState));
    			this._loginState$.next(loginState);
    		})
    		.finally(() => {
    			store.dispatch('setLoading', false);
    		});
    }

    signOut() {
    	sessionStorage.removeItem(LOGIN_STATE);
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
    	// this.vue = vue;
    	Vue.prototype.$user = this;
    	this.init();

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
    		// 如果為 401 代表權限不足，導頁

    		if (error.response.status === 401) {
    			this.signOut();
    			options.router.replace({ path: '/no-authorization' });
    			// options.message.error('權限不足');
    		}
    		// 如果為 403 且角色清單不為空，則跳出重新設定
    		if (error.response.status === 403 && this.loginState?.me?.roles.length !== 0) {
    			store.dispatch('setIs403ChangingRole', true);
    		}
    		return Promise.reject(error);
    	});
    }
}
export default new UserService();
