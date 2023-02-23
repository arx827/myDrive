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

export interface NationalityList{
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

  public changeRouterAndaddParam({ toRouter, query }, blank?: boolean) {
  	const $route: any = this.opt.router;
  	if (!sessionStorage.param || JSON.parse(sessionStorage.param) === null) {
  		sessionStorage.param = JSON.stringify({});
  	}
  	const $storage = JSON.parse(sessionStorage.param);
  	const $object = {};
  	let routerName;
  	if (toRouter === 'self') {
  		routerName = $route.history.current.name;
  	} else {
  		routerName = toRouter;
  	}
  	$object[routerName] = {
  		query,
  		fromPage: $route.history.current.name,
  	};
  	sessionStorage.param = JSON.stringify(Object.assign($storage, $object));
  	if (blank) {
  		const routeData = this.opt.router.resolve({ name: toRouter });
  		const tabID = new Date().getMilliseconds().toString();
  		window.open(routeData.href, tabID).focus();
  	} else {
  		if (toRouter === 'self') return;
  		this.opt.router.push({ name: routerName });
  	}
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

  public getParam(): {fromPage: string; query: any} | null {
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
  	const apiErrorMsg = [];
  	(Object.values(apiError)).forEach((value) => apiErrorMsg.push(...value));
  	return apiErrorMsg;
  }

  /**
	 * @summary 取得國籍列表
	 */
  async getNationalityData(): Promise<NationalityList[]> {
  	const nationalityList: NationalityList[] = [];
  	await Vue.prototype.$coUtilityApi
  		.nationalitiesUsingPOST()
  		.then((resp) => {
  			if (resp.status === 200) {
  				Object.entries(resp.data.data).forEach(([key, value]) => {
  					nationalityList.push({
  						key: value as string,
  						value: key as string,
  					});
  				});
  				nationalityList.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  			}
  		});
  	return nationalityList;
  }

  // 難字啟用
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
  }
}
export default new GlobalService();
