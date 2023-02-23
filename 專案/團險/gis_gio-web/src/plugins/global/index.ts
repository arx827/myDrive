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

  private pageEnum: {key: string; page: string}[] = [
    { key: 'A', page: '10' },
    { key: 'B', page: '25' },
    { key: 'C', page: '50' },
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
    this.opt.router.push({ name: toRouter, params });
  }

  public clearParam() {
    // 比 remove 更快
    sessionStorage.param = null;
  }

  public getParam() {
    const $route: any = this.opt.router;
    const $currentName = $route.history.current.name;
    if (sessionStorage.param && sessionStorage.param !== '') {
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

  public getQuery() {
    if (this.getParam()) {
      return this.getParam().query;
    }
    return null;
  }

  public setParam({ routerName, query }) {
    this.ifParamIsNullCreateEmpty();
    // 先檢查有無 param key
    if (sessionStorage.param !== '') {
      const $storage = JSON.parse(sessionStorage.param);
      const $object = {};
      $object[routerName] = {
        query,
      };
      sessionStorage.param = JSON.stringify(Object.assign($storage, $object));
      // console.log(sessionStorage.param[routerName]);
    }
  }

  public getAllParamKey() {
    return Object.keys(JSON.parse(sessionStorage.param));
  }

  // 身分證號碼隱藏中間數字
  public autoHideMidIdNo(val) {
    if (!val) return val;
    return val.replace(/^(.{3})(\d+)(.{1})$/, '$1******$3');
  }

  // 輸入框自動加「-」(保單號碼)
  public autoAddDash(val, rgx) {
    if (val) {
      const valArr = val.split('');
      const str = valArr.join('');
      return str.replace(new RegExp(rgx), '$1-$2');
    }
    return null;
  }

  // 移除「-」(保單號碼)
  public formatPolicyNum(str) {
    if (str) {
      return str.replace(/-/g, '');
    }
    return null;
  }

  // 輸入框自動加「千分位」(金額共用)
  public autoAddComdify(val) {
    if (!val) return val;
    const str = val.toString().split('.');
    const rgx = /(\d)(?=(?:\d{3})+$)/g;
    const c = str[0].toString().replace(rgx, '$1,');
    if (str && str.length > 1) {
      return `${c}.${str[1]}`;
    }
    return `${c}`;
  }

  // 移除「千分位」(金額共用)
  public delComdify(val) {
    if (!val) return val;
    return val.toString().replace(/,/gi, '');
  }

  // 全形偵測
  fullWidthAcd(str) {
    let checkVal = false;
    for (let i = 0, len = str.length; i < len; i++) {
      const strCode = str.charCodeAt(i);
      if (strCode > 65248 || strCode == 12288) {
        checkVal = true; // str 有全形回報
        break;
      }
    }
    return checkVal;
  }

  // 自動轉半形
  public toSBC(str) {
    let result = '';
    for (let i = 0, len = str.length; i < len; i++) {
      let strCode = str.charCodeAt(i);
      // 全形與半形相差（除空格外）：65248（十進位制）
      strCode = (strCode >= 0xFF01 && strCode <= 0xFF5E) ? (strCode - 65248) : strCode;
      // 處理空格
      strCode = (strCode == 0x03000) ? 0x0020 : strCode;
      result += String.fromCharCode(strCode);
    }
    return result;
  }

  // grid Table 打API時 pageSize轉換為後端代號
  public getPageKey(pageNum: number): ('A' | 'B' | 'C') {
    return this.pageEnum.filter((i) => i.page === pageNum.toString())[0].key as ('A' | 'B' | 'C');
  }

  // 依保單號碼判斷 RC/CB
  public getPolicyType(policy) {
    // 保單號碼開頭 1 => RC, 8 => CB
    const policyStr = policy.toString();
    if (policyStr.startsWith('1')) {
      return 'RC';
    } if (policyStr.startsWith('8')) {
      return 'CB';
    }
      return null;
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

  // API錯誤訊息 統一格式
  // public createErrorMsg({ errorApi, errorTitle }) {
  //   const errorMsg = [];
  //   Object.values(errorApi).map((i) => {
  //     (i as any).map((j) => {
  //       errorMsg.push(j);
  //     });
  //   });
  //   Modal.error({
  //     title: (this as any).$createElement('div', {}, errorTitle),
  //     content: (this as any).$createElement('ul', {
  //       attrs: { class: 'list-with-border' },
  //     }, errorMsg.map((x) => (this as any).$createElement('li', x))),
  //     okType: 'confrim',
  //     okText: '確定',
  //     icon: () =>
  //       (this as any).$createElement('i', { attrs: { class: 'icon__custom icon__error' } }),
  //   });
  // }

  public install(Vue, options: GlobalSerivceOption) {
    Vue.prototype.$global = this;
    this.opt = options;
    this.createWebRoot();
  }
}
export default new GlobalService();
