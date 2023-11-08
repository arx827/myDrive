import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $validateUtil: ValidateUtilService
  }
}

export class ValidateUtilService {
  private $global
  private $enumData

  /*
   * 驗證傳入參數是否為空(null、空字串、空陣列)
   * true: empty
   * flase: not empty
   */
  public isEmpty(data: any) {
    let result = true
    if (data !== null && data !== undefined) {
      // 字串
      if (typeof data === 'string' && data.trim() !== '') {
        result = false
      }
      // 數字
      if (typeof data === 'number' && String(data).trim() !== '') {
        result = false
      }
      // 物件
      if (data instanceof Object && Object.keys(data).length !== 0) {
        result = false
      }
      // 陣列
      if (Array.isArray(data) && data.length > 0) {
        result = false
      }
    }
    return result
  }

  /**
   * ant design vue 驗證參數
   * enum	列舉	string
   * len	字段長度	number
   * max	最大長度	number
   * message	校驗文案	string
   * min	最小長度	number
   * pattern	正規表達式校驗	RegExp
   * required	是否必填	boolean	預設值：false
   * transform	校驗前轉換字段值	function(value) => transformedValue:any
   * trigger	校驗觸發的時機	'blur' | 'change' | ['change', 'blur']
   * type	內建校驗類型，可選項	string	預設值：'string'
   * validator	自定義校驗（注意，callback 必須被調用）	function(rule, value, callback)
   * whitespace  必選時，空格是否會被視為錯誤	boolean	預設值：false
   */

  public pattern = {
    idNumber(): RegExp {
      return /^[a-zA-Z](1|2)\d{8}$/
    },
    phoneNumber(): RegExp {
      return /^09\d{2}-?\d{6}$/
    },
    email(): RegExp {
      return /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    },
    num(): RegExp {
      return /^\d+$/
    },
    en(): RegExp {
      return /^[a-zA-Z]+$/
    },
    enAndNum(): RegExp {
      return /^[a-zA-Z0-9]+$/
    },
    ch(): RegExp {
      return /^[\u4E00-\u9FA5]+$/
    },
  }

  public validator = {
    length: (value: string, len: number) => {
      return value.length === len
    },
    fullWidthAcd: (value: string) => {
      let checkVal = false
      for (let i = 0, len = value.length; i < len; i++) {
        const strCode = value.charCodeAt(i)
        if (strCode > 65248 || strCode == 12288) {
          checkVal = true // str 有全形回報
          break
        }
      }
      return checkVal
    },
  }

  public install(app: App, options: any) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$validateUtil = this
    this.$global = options.Global
    this.$enumData = options.EnumData
  }
}
export default new ValidateUtilService()
