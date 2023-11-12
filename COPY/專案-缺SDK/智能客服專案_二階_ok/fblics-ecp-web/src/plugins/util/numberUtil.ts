import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $numberUtil: NumberService
  }
}

export class NumberService {
  private $enumData
  private $validateUtil

  // 小數點轉換成百分比表示
  /**
   *
   * @param {number} num 輸入口
   * @param {number} decimal 小數第幾位
   * @returns {number}
   */
  public numToPercent(num: number, decimal: number = 2): number {
    return this.round(num * 100, decimal)
  }

  // 百分比轉數字
  /**
   * @param {number} num 輸入口
   * @param {number} decimal 小數第幾位
   * @returns {number}
   */
  public percentToNum(num: number, decimal: number = 2): number {
    return this.round(num / 100, decimal)
  }

  // 將數字四捨五入到小數點後n位
  /**
   * @description 處理多餘的小數點位數
   * @param {number | string} num 輸入口
   * @param {number} n 設定小數點位數
   * @returns {number}
   */
  public round(num: number | string = 0, n: number = 0): number {
    return Math.round((Number(num) + Number.EPSILON) * 10 ** n) / 10 ** n || undefined
  }

  // 數字 增加千分位
  /**
   * @description 金額轉換成千分位表示，未超過不補零
   * @param {number | string} data: 欲轉換的資料
   * @returns {string}
   */
  public transferPrice(data: number | string): string {
    if (this.$validateUtil.isEmpty(data)) {
      return data.toString()
    }
    if (typeof data === 'number') {
      data = data.toString()
    }
    const str = data.split('.')
    const rgx = /(\d)(?=(?:\d{3})+$)/g
    const c = str[0].replace(rgx, '$1,')
    if (str && str.length > 1) {
      return `${c}.${str[1]}`
    }
    return `${c}`
  }

  // 數字 移除千分位
  /**
   * @param {number | string} data 輸入口
   * @returns {number}
   */
  public priceTransfer(data: number | string): number {
    if (!this.$validateUtil.isEmpty(data) || typeof data === 'number') {
      return Number(data)
    }
    return Number(data.toString().replace(/,/gi, ''))
  }

  // 數字轉中文
  /**
   * @description 將數字 轉為 中文數字
   * @param {number | string} int 輸入口
   * @returns {string} 中文數字
   */
  public intNumToCh(int: string | number): string {
    if (this.$validateUtil.isEmpty(int)) {
      if (typeof int === 'number') {
        return int.toString()
      }
      return int
    }
    if (typeof int === 'number') {
      int = this.priceTransfer(int).toString()
    }
    const str = int.split('.')
    const $enumData = this.$enumData

    function change(num) {
      let origin
      let returnStr = ''
      // 處理例外
      if (typeof int === 'string') {
        if (num === '') return ''
        if (isNaN(parseFloat(num))) {
          console.log('引數有誤，無法轉數字')
        }
        // 去掉千分符(,)
        num = (num as string).replace(/,/g, '')
        origin = parseFloat(num)
      } else if (typeof num === 'number') {
        origin = num
      } else if (typeof num !== 'number') {
        console.log('引數有誤，非中文、數字')
        return
      }
      // 處理 0 => 直接回傳 '零'
      if (origin === 0) {
        return $enumData.chNums[origin]
      }
      let zeroCount = 0
      const intStr = origin.toString()
      const IntLen = intStr.length
      if (origin >= 10) {
        for (let i = 0; i < IntLen; i++) {
          const currentStr = intStr.substr(i, 1)
          // 剩餘待處理的數量
          const surplus = IntLen - i - 1
          // 擴充單位
          const expandUnit = surplus / 4
          // 基本單位
          const baseUnit = surplus % 4
          // 零遇到零時，累加，如：100000 => 十萬
          if (currentStr === '0') {
            zeroCount++
          } else {
            if (zeroCount > 0) {
              returnStr += $enumData.chNums[0]
            }
            // 歸零
            zeroCount = 0
            if (i === 0 && currentStr === '1' && baseUnit == 1) {
              // 如：將 一十萬 => 十萬
              returnStr += $enumData.chIntRadice[baseUnit]
            } else {
              returnStr += $enumData.chNums[parseInt(currentStr)] + $enumData.chIntRadice[baseUnit]
            }
          }
          // + 擴充單位
          if (baseUnit === 0 && zeroCount < 4) {
            returnStr += $enumData.chIntUnits[expandUnit]
          }
        }
      } else {
        returnStr += $enumData.chNums[parseInt(intStr)]
      }
      return returnStr
    }
    function point(num) {
      let origin
      let returnStr = ''
      // 處理例外
      if (typeof int === 'string') {
        if (num === '') return ''
        if (isNaN(parseFloat(num))) {
          console.log('引數有誤，無法轉數字')
        }
        // 去掉千分符(,)
        num = (num as string).replace(/,/g, '')
        origin = parseFloat(num)
      } else if (typeof num === 'number') {
        origin = num
      } else if (typeof num !== 'number') {
        console.log('引數有誤，非中文、數字')
        return
      }
      // 處理 0 => 直接回傳 '零'
      if (origin === 0) {
        return $enumData.chNums[origin]
      }
      const zeroCount = 0
      const intStr = origin.toString()
      const IntLen = intStr.length
      if (origin >= 10) {
        for (let i = 0; i < IntLen; i++) {
          const currentStr = intStr.substr(i, 1)
          returnStr += $enumData.chNums[parseInt(currentStr)]
        }
      } else {
        returnStr += $enumData.chNums[parseInt(intStr)]
      }
      return returnStr
    }

    if (str && str.length > 1) {
      return `${change(str[0])}點${point(str[1])}`
    }
    return change(str[0])
  }

  // 數字補零
  /**
   * @description 將數字或文字 轉為 特定位數
   * @param {number | string} data 輸入口
   * @param {number} ad 欲補充幾位數
   * @returns {string}
   */
  public padStart(data: number | string, ad: number): string {
    if (typeof data === 'number') {
      data = data.toString()
    }
    // ES8 字串補全 語法 padStart() 補頭部， padEnd() 補尾部
    return data.padStart(ad, '0')
  }

  public install(app: App, options: any) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$numberUtil = this
    this.$enumData = options.EnumData
    this.$validateUtil = options.ValidateUtil
  }
}
export default new NumberService()
