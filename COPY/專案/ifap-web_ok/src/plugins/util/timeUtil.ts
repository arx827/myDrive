import moment from 'moment';

export default class timeUtil {
    /**
     * 日期轉字串(預設:YYYY/MM/DD HH:mm:ss)
     * @param date
     * @param format
     * @returns
     */
     static formatStringDateDault(date: string): string {
      return moment(date).format("YYYY/MM/DD HH:mm:ss");
  }
}
