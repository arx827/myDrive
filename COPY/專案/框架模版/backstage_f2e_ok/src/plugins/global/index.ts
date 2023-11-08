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
	 * @summary 取得當前角色資料（名稱、單位）RoleDto
	 */
  public getCurrentRole() {
  	if (sessionStorage.getItem('currentRoleData')) {
  		const role = JSON.parse(sessionStorage.getItem('currentRoleData'));
  		return role;
  	}
  }

  /**
	 * @summary 取得當前角色ID
	 */
  public getCurrentRoleId(): string {
  	if (sessionStorage.getItem('currentRoleData')) {
  		return JSON.parse(sessionStorage.getItem('currentRoleData')).id;
  	}
  }

  /**
	 * @summary 取得當前角色組別代號
	 */
  public getCurrentRoleTeamCode(): string {
  	if (sessionStorage.getItem('currentRoleData')) {
  		return JSON.parse(sessionStorage.getItem('currentRoleData')).roleUnits[0]?.auditorTeamCode;
  	}
  }

  /**
	 * @summary ant design 單選下拉選單模糊搜尋 function
	 */
  public filterOption(input, option) {
  	return (
  		option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  	);
  }

  // 難字啟用
  // public createWebRoot() {
  // 	window.WebRootPath = process.env.VUE_APP_WEB_ROOT_PATH;
  // 	console.log('window.WebRootPath', window.WebRootPath);
  // 	window.imeServer = process.env.VUE_APP_FNTWS_URL;
  // 	const jscript = document.createElement('script');
  // 	jscript.setAttribute('lang', 'text/javascript');
  // 	jscript.setAttribute('src', `${window.WebRootPath}hanlinks/wf_links.js`);
  // 	document.getElementsByTagName('head').item(0).appendChild(jscript);
  // 	window.parseWord = function (log) {
  // 		if (log) {
  // 			console.log(log);
  // 		}
  // 		if (typeof (window.parseEUDC) === 'function') {
  // 			window.parseEUDC('ap');
  // 		}
  // 	};
  // }

  /**
	 * @summary 清除非動線 Storage
	 * 此function 變體為 扁平式router 處理方式 2022/08/11
	 */
  public autoClearParamFlat(route) {
  	if (sessionStorage.param) {
  		if (JSON.parse(sessionStorage.param) !== null && sessionStorage.param !== '{}') {
  			// 取得 所有 Storage 內的 param key
  			const paramAllKey = this.getAllParamKey();
  			// console.log(paramAllKey);
  			// 取得 所有route
  			const routeMatched = route.matched.filter((i) => i.name != undefined).map((i) => i.name);
  			// console.log(routeMatched);

  			// 遞迴取得 所有同層route 再取得同流程route
  			let routeSibling;
  			const loopGetSibling = function (routes) {
  				// 先儲存此次遞迴 層級所有 name
  				const routeNameArray = routes.filter((i) => i.name !== null).map((i) => i.name);
  				// console.log(routeNameArray);

  				// 用自己 name 先找到該層級
  				if (routeNameArray.includes(route.name)) {
  					// console.log(routes);
  					// console.log(route);

  					// 已找到該層級，取得 同流程的功能頁 並儲存name陣列
  					routeSibling = routes.filter((i) => i.name !== null && new RegExp(route.path.split('/')[1]).test(i.path)).map((i) => i.name);
  					// console.log(routeSibling);
  				} else {
  					// 將子層再丟進來跑迴圈
  					routes.filter((i) => i.children != undefined).map((i) => loopGetSibling(i.children));
  					// console.log(routeSibling);
  				}
  			};

  			// 遞迴
  			loopGetSibling(this.opt.router.options.routes);

  			// 將該流程的父層 及 同層 合併，且排除重複
  			const matchedAndSibling = routeSibling && routeSibling.length > 0 ? [...new Set([...routeMatched, ...routeSibling])] : [...new Set([...routeMatched])];

  			// 清除非 當前頁 流程中的 param資料，
  			// note: 當route name 為 undefined 時，不算在流程中
  			paramAllKey.map((i) => {
  				if (!matchedAndSibling.includes(i)) {
  					const $param = JSON.parse(sessionStorage.param);
  					delete $param[i];
  					sessionStorage.param = JSON.stringify($param);
  				}
  			});
  		}
  	}
  }

  /**
	 * @summary 深拷貝資料
	 * 請用變數 接 return
	 */
  public deepCopyData(inputObj) {
  	if (typeof inputObj !== 'object' || inputObj === null || Object.prototype.toString.call(inputObj) === '[object Date]') {
  		return inputObj;
  	}
  	const outputObj = Array.isArray(inputObj) ? [] : {};
  	for (const key in inputObj) {
  		const value = inputObj[key];
  		outputObj[key] = this.deepCopyData(value);
  	}
  	return outputObj;
  }

  public install(Vue, options: GlobalSerivceOption) {
  	Vue.prototype.$global = this;
  	this.opt = options;
  	// this.createWebRoot();
  }
}
export default new GlobalService();
