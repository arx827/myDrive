/* eslint-disable no-mixed-spaces-and-tabs */
import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';

declare module 'vue/types/vue' {
	interface Vue {
		$global: GlobalService;
	}
}
export interface GlobalSerivceOption {
	router: VueRouter;
}

export interface NationalityList {
	key: string;
	value: string;
}

declare global {
	interface Window {
		WebRootPath: any;
		imeServer: any;
		parseWord: any;
		parseEUDC: any;
	}
}

export class GlobalService implements PluginObject<GlobalSerivceOption> {
	private opt: GlobalSerivceOption;

	private pageEnum: {key: string; page: string}[] = [
		{ key: 'A', page: '5' },
		{ key: 'B', page: '10' },
		{ key: 'C', page: '25' },
	];

	ifParamIsNullCreateEmpty() {
		if (!sessionStorage.param || JSON.parse(sessionStorage.param) === null) {
			sessionStorage.param = JSON.stringify({});
		}
	}

	public getPageArray() {
		return Array.from(this.pageEnum.map((i) => i.page));
	}

	public changeRouterAndaddParam({ toRouter, params, query }: {toRouter: string; params?: any; query?: any}) {
		const $route: any = this.opt.router;
		this.ifParamIsNullCreateEmpty();
		const $storage = JSON.parse(sessionStorage.param);
		const $object = {};
		$object[toRouter] = {
			query,
			fromPage: $route.history.current.name,
		};
		sessionStorage.param = JSON.stringify(Object.assign($storage, $object));
		let routerOpts = {};
		if (params) {
			routerOpts = { name: toRouter, params };
		} else {
			routerOpts = { name: toRouter };
		}
		this.opt.router.push(routerOpts);
	}

	public addParam({ toRouter, query }) {
		const $route: any = this.opt.router;
		if (!sessionStorage.param || JSON.parse(sessionStorage.param) === null) {
			sessionStorage.param = JSON.stringify({});
		}
		const $storage = JSON.parse(sessionStorage.param);
		const $object = {};
		$object[toRouter] = {
			query,
			fromPage: $route.history.current.name,
		};
		sessionStorage.param = JSON.stringify(Object.assign($storage, $object));
	}

	public clearParam() {
		// 比 remove 更快
		sessionStorage.param = null;
	}

	public getParam(): { fromPage: string; query: any } | null {
		const $route: any = this.opt.router;
		const $currentName = $route.history.current.name;
		if (sessionStorage.param) {
			if (sessionStorage.param !== '') {
				if (JSON.parse(sessionStorage.param) && JSON.parse(sessionStorage.param) !== null) {
					const $param = JSON.parse(sessionStorage.param);
					if (Object.keys($param).includes($currentName)) {
						return $param[$currentName];
					}
					return null;
				}
				return null;
			}
			return null;
		}
		return null;
	}

	public getQuery(): any {
		return this.getParam() === null ? null : this.getParam().query;
	}

	public getAllParamKey() {
		return Object.keys(JSON.parse(sessionStorage.param));
	}

	/**
	 * @summary ApiError錯誤訊息轉陣列
	 */
	public getApiErrorMsg(apiError: object): string[] {
		if (apiError) {
			const apiErrorMsg = [];
			(Object.values(apiError)).forEach((value) => apiErrorMsg.push(...value));
			return apiErrorMsg;
		}
	}

	/**
	 * @summary 取得公務信箱
	 */
	 fetchPublicEmail() {
		const mail = '';
		Vue.prototype.$UtilityApi.officialEmailUsingPOST()
			.then((resp) => {
				if (resp.status === 200) {
					sessionStorage.setItem('publicMail', resp.data.data[0]);
				}
			});
	}

	async getPublicEmail() {
		const encryptMail = sessionStorage.getItem('publicMail');
		let mail = '';
		await Vue.prototype.$UtilityApi.decryptBase64UsingPOST(encryptMail)
			.then((resp) => {
				mail = resp.data.data;
			})
			.catch((error) => {
				console.log('error status = ', error);
			})
			.finally(() => {
				//
			});
		return mail;
	}

	/**
	 * @summary 難字啟用
	 */
	public createWebRoot() {
  	window.WebRootPath = process.env.VUE_APP_WEB_ROOT_PATH;
  	console.log('window.WebRootPath', window.WebRootPath);
  	window.imeServer = process.env.VUE_APP_FNTWS_URL;
  	const jscript = document.createElement('script');
  	jscript.setAttribute('lang', 'text/javascript');
  	jscript.setAttribute('src', `${window.WebRootPath}hanlinks/wf_links.js`);
  	document.getElementsByTagName('head').item(0).appendChild(jscript);
  	window.parseWord = function (log) {
  		if (log) {
  			console.log(log);
  		}
  		if (typeof (window.parseEUDC) === 'function') {
  			window.parseEUDC('ap');
  		}
  	};
	}

	public install(Vue, options: GlobalSerivceOption) {
		Vue.prototype.$global = this;
		this.opt = options;
  	this.createWebRoot();
		this.fetchPublicEmail();
	}
}
export default new GlobalService();
