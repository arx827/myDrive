import type { App } from 'vue'
import type { Router } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $global: GlobalService
  }
}

interface options {
  Router: Router
}

interface Param<T> {
  fromPage: string
  query: T
}

export enum ErrorType {
  ColumnErrorException = 'ColumnErrorException',
  NormalErrorException = 'NormalErrorException',
}

// declare global {
//   interface Window {
//     WebRootPath: any
//     imeServer: any
//     parseWord: any
//     parseEUDC: any
//   }

export class GlobalService {
  private $router

  /**
   * 轉跳至目標router並且夾帶資料存放至sessionStorage
   * @param {string} toRouter: 要轉跳過去的路由名稱
   * @param {any} query: 欲夾帶的query資料
   * @param {any} params: 欲夾帶的動態路由參數
   */
  public changeRouterAndaddParam(
    { toRouter, query, params }: { toRouter: string; query?: any; params?: any },
    blank?: boolean,
  ): void {
    if (!sessionStorage.param || JSON.parse(sessionStorage.param) === null) {
      sessionStorage.param = JSON.stringify({})
    }
    const $storage = JSON.parse(sessionStorage.param)
    const $object = {}
    let routerName
    if (toRouter === 'self') {
      routerName = this.$router.currentRoute.value.name
    } else {
      routerName = toRouter
    }
    $object[routerName] = {
      query: query,
      fromPage: this.$router.currentRoute.value.name,
    }
    sessionStorage.param = JSON.stringify(Object.assign($storage, $object))
    if (blank) {
      const routeData = this.$router.resolve({ name: toRouter })
      const tabID = new Date().getMilliseconds().toString()
      window.open(routeData.href, tabID).focus()
    } else {
      if (toRouter === 'self') return
      this.$router.push({ name: routerName, params })
    }
  }

  // 清空sessionStorage param
  public clearParam() {
    sessionStorage.param = null
  }

  /**
   * 取得當前路由所存的資料
   * @return { fromPage: string; query: any } fromPage: 前一頁router名稱; query: 夾帶的query資料。無資料回null
   */
  public getParam(): Param<any> | null {
    if (!sessionStorage.param) return null
    const $param = JSON.parse(sessionStorage.param)
    if (!$param) return null
    const $currentName = this.$router.currentRoute.value.name
    return Object.keys($param).includes($currentName) ? $param[$currentName] : null
  }

  /**
   * 取得當前路由所存query資料
   * @return {any} query: 夾帶的query資料
   */
  public getQuery<T extends Param<any>>(): T {
    return this.getParam() === null ? null : this.getParam().query
  }

  // 查看所有 目前緩存的頁面
  public getAllParamKey() {
    if (sessionStorage.param) {
      return Object.keys(JSON.parse(sessionStorage.param))
    }
  }

  /**
   * @summary ant design 單選下拉選單模糊搜尋 function
   */
  public filterOption(input, option) {
    return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 難字啟用
  // private createWebRoot() {
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
   * @summary 深拷貝資料
   * 請用變數 接 return
   */
  public deepCopyData(inputObj) {
    if (
      typeof inputObj !== 'object' ||
      inputObj === null ||
      Object.prototype.toString.call(inputObj) === '[object Date]'
    ) {
      return inputObj
    }
    const outputObj = Array.isArray(inputObj) ? [] : {}
    for (const key in inputObj) {
      const value = inputObj[key]
      outputObj[key] = this.deepCopyData(value)
    }
    return outputObj
  }

  /**
   * @summary ApiError錯誤訊息轉陣列
   */
  public getApiErrorMsg(apiError: object, errors?: string[]): string[] | null {
    if (!apiError) return null
    const apiErrorMsg = []
    if (errors) {
      const errorType = this.getApiErrorType(errors)
      if (errorType === ErrorType.ColumnErrorException) {
        Object.values(apiError).forEach(value => value && apiErrorMsg.push(...value.message))
      } else {
        Object.values(apiError).forEach(value => value && apiErrorMsg.push(...value))
      }
    } else {
      Object.values(apiError).forEach(value => value && apiErrorMsg.push(...value))
    }

    return apiErrorMsg
  }

  /**
   * @summary 判斷ApiError錯誤類型: 一般錯誤 or 欄位錯誤
   */
  public getApiErrorType(errors: string[]): ErrorType {
    return errors && /ColumnErrorException/.test(errors[0])
      ? ErrorType.ColumnErrorException
      : ErrorType.NormalErrorException
  }

  /**
   * @summary 存取applyId
   * @param {'Get' | 'Set' | 'Delete'} action
   * @param {string} value?
   */
  public handleApplyId(action: 'Get' | 'Set' | 'Delete', value?: string) {
    switch (action) {
      case 'Get':
        return sessionStorage.getItem('applyId')

      case 'Delete':
        sessionStorage.removeItem('applyId')
        break
      case 'Set':
        sessionStorage.setItem('applyId', value)
        break
    }
  }

  public install(app: App, options?: options) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$global = this
    this.$router = options.Router
  }
}
export default new GlobalService()
