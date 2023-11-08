import dayjs from 'dayjs'
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
   * @description 文字Date 轉 Date格式
   * @param { string } date
   * @returns { string }
   */
  public transformRocDate(date: string): string {
    // 以「非數字」做為分隔符號，將日期資訊抓出來。
    const dateNumber: string[] = date.split(/\D/g)
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

  public install(app: App, options: any) {
    const $appGlobal = app.config.globalProperties
    $appGlobal.$dateTimeUtil = this
    this.$global = options.Global
    this.$enumData = options.EnumData
  }
}
export default new DateTimeService()
