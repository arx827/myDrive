import Vue, { PluginFunction, PluginObject } from 'vue';
import VueRouter from 'vue-router';
import moment from 'moment';
import { Modal } from 'ant-design-vue';

declare module 'vue/types/vue' {
  interface Vue {
    $global: GlobalService;
  }
}

export interface GlobalSerivceOption {
  router: VueRouter;
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

  /**
   * @summary 深拷貝資料
   * 請用變數 接 return
   */
  public deepCopyData(inputObj) {
    if (
      typeof inputObj !== 'object'
      || inputObj === null
      || Object.prototype.toString.call(inputObj) === '[object Date]'
    ) {
      return inputObj
    }
    const outputObj = Array.isArray(inputObj) ? [] : {}

    Object.keys(inputObj).forEach((key) => {
      const value = inputObj[key]
      outputObj[key] = this.deepCopyData(value)
    })
    return outputObj
  }

  public install(Vue, options: GlobalSerivceOption) {
    Vue.prototype.$global = this;
    this.opt = options;
  }
}

export default new GlobalService();
