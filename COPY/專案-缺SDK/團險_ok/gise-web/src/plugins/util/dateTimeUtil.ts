import dayjs from 'dayjs'
import moment from 'moment'
import type { App } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dateTimeUtil: DateTimeService
  }
}

export class DateTimeService {
  private $global
  private $enumData

  /**
   * @description date-string 轉 民國年 YYY/MM/DD HH:MM
   * @param { string } date
   * @returns { string }
   */
  public transformRocDate(date: string): string {
    // 以「非數字」做為分隔符號，將日期資訊抓出來。
    const dateNumber: string[] = date.split(/\D/g)
    // console.log('dateNumber', dateNumber)
    return `${Number.parseInt(dateNumber?.[0]) - 1911}/${dateNumber?.[1]}/${dateNumber?.[2]}   ${dateNumber?.[3]}:${
      dateNumber?.[4]
    }`
  }

  /**
   * @description date-string 轉 西元年 YYYY/MM/DD HH:MM
   * @param { string } date
   * @returns { string }
   */
  public transformADDate(date: string): string {
    // 以「非數字」做為分隔符號，將日期資訊抓出來。
    const dateNumber: string[] = date.split(/\D/g)
    // console.log('dateNumber', dateNumber)
    let str = ''
    if (dateNumber[0]) str += dateNumber[0]
    if (dateNumber[1]) str += `/${dateNumber[1]}`
    // 整個月 以 /** 表示
    if (dateNumber[2]) {
      str += `/${dateNumber[2]}`
    } else {
      str += `/**`
    }
    if (dateNumber[3] && dateNumber[4]) str += ` ${dateNumber[3]}:${dateNumber[4]}`
    return str
  }

  public filterRangeDate(date: Array<Date>): any {
    // 拷貝成新的陣列
    const oriRange = this.$global.deepCopyData(date)
    const newRange = []
    if (!oriRange[0] && !oriRange[1]) {
      // clear 時，回傳 null
      return null
    }
    // 結束日期的時間改為 23(時):59(分):59(秒)並轉成後端要的時間字串格式(ISO8601)
    newRange[0] = dayjs(oriRange[0]).format('YYYY-MM-DDTHH:mm:ss.sssZ')
    newRange[1] = dayjs(oriRange[1]).hour(23).minute(59).second(59).format('YYYY-MM-DDTHH:mm:ss.999Z')
    return newRange
  }

  static isValidDate(date: string): any {
    return dayjs.isDayjs(date) ? new Date(date) : date
  }

  /**
   * @summary 生日字串加上斜線
   */
  public dateStringAddSlash(date: string): string | null {
    if (!date) return null
    return `${date.slice(0, -4)}/${date.slice(-4, -2)}/${date.slice(-2)}`
  }

  /**
   * @summary YYY/MM/DD -> YYYMMDD
   */
  public dateStringRemoveSlash(date: any): string | null {
    if (!date) return null
    return date.replaceAll('/', '')
  }

  /**
   * @summary 民國生日字串轉成西元date
   */
  public dateStringAddSlashAndToAD(date: string): Date {
    if (!date) return null
    return new Date(`${parseInt(date.slice(0, -4)) + 1911}/${date.slice(-4, -2)}/${date.slice(-2)}`)
  }

  /**
   * @summary 西元date轉成YYY/MM/DD
   */
  public dateToRocDateString(date: Date) {
    if (!date) return ''
    const dateStr = moment(date).format('YYYY/MM/DD').split('/')
    const year = `${parseInt(dateStr[0]) - 1911}`
    return `${year.length > 2 ? year : '0' + year}/${dateStr[1]}/${dateStr[2]}`
  }

  /**
   * @summary 西元date轉成YYYMMDD
   */
  public dateToRocDateWithoutSlashString(date: Date) {
    if (!date) return ''
    const dateStr = moment(date).format('YYYY/MM/DD').split('/')
    const year = `${parseInt(dateStr[0]) - 1911}`
    return `${year.length > 2 ? year : '0' + year}${dateStr[1]}${dateStr[2]}`
  }

  public install(app: App, options: any) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$dateTimeUtil = this
    this.$global = options.Global
    this.$enumData = options.EnumData
  }
}
export default new DateTimeService()
