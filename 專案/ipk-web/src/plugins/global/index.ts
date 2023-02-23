import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
  interface Vue {
    $global: GlobalService;
  }
}
export interface GlobalServiceOption {
  router: VueRouter;
}
export class GlobalService implements PluginObject<GlobalServiceOption> {
  private opt: GlobalServiceOption;

  public ifParamIsNullCreateEmpty() {
    if (this.isEmpty(sessionStorage.param) || this.isEmpty(JSON.parse(sessionStorage.param))) {
      sessionStorage.param = JSON.stringify({});
    }
  }

  /**
	 * @summary 將Tab值存入 sessionStorage
	 * @param {string} tabName: 主頁籤名稱
	 * @param {any} tabOrButtonsValue: 子頁籤or按鈕權限
	*/
  public setTabParam(tabName: string, tabOrButtonsValue: any) {
    // 先檢查有無 param key
    this.ifParamIsNullCreateEmpty();
    // set value
    const $storage = JSON.parse(sessionStorage.param);
    const $object = {};
    $object[tabName] = tabOrButtonsValue;
    sessionStorage.param = JSON.stringify(Object.assign($storage, $object));
  }

  /**
	 * @summary 將Tab值存入 sessionStorage
	 * @param {string} tabName: 主頁籤名稱
	 * @param {any} tabOrButtonsValue: 子頁籤or按鈕權限
	*/
  public getTabParam(key) {
    if (this.isEmpty(sessionStorage.param) || this.isEmpty(JSON.parse(sessionStorage.param))) {
      return null;
    }
    const $param = JSON.parse(sessionStorage.param);
    return $param[key];
  }

  public clearParam() {
    // 比 remove 更快
    sessionStorage.param = null;
  }

  public getAllParamKey() {
    return Object.keys(JSON.parse(sessionStorage.param));
  }

  /**
	 * @summary 判斷空值
	*/
	isEmpty(data) {
		return validateUtil.isEmpty(data);
	}

  public install(Vue, options: GlobalServiceOption) {
    Vue.prototype.$global = this;
    this.opt = options;
  }
}
export default new GlobalService();
