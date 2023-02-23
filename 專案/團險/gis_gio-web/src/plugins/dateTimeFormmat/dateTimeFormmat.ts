import Vue, { PluginFunction, PluginObject } from 'vue';
import moment from 'moment';

declare module 'vue/types/vue' {
  interface Vue {
    $dateTime: DateTimeFormmat;
  }
}

export class DateTimeFormmat extends Vue {
  /**
  * 將「西元日期」轉換為「民國日期」
  * @param {string} adDate 西元日期 e.g.2021/12/13
  * @returns {string} 民國日期 e.g. 110/12/13
  */
  public TWDateFormatter(adDate) {
    if (adDate) {
      const arr = adDate.split('/');
      const [yyyy, mm, dd] = arr;
      const twYear = parseInt(yyyy) - 1911;
      return `${twYear}/${mm}/${dd}`;
    }
    return '';
  }

  /**
  * 將「ISO8601的字符串」傳換為「西元日期」
  * @param {string} str 日期字符串 e.g.2021-12-11T15:49:12.000+0800
  * @returns {string} 西元日期 e.g. 2021/12/11
  */
   public ADDateFormatter(str) {
    if (str) {
      return moment(new Date(str)).format('YYYY/MM/DD');
    }
    return '';
  }

  /**
  * 將「日期」轉換為「ISO8601的字符串」
  * @param {Date} date 日期 e.g.Sat Dec 11 2021 15:49:12 GMT+0800 (台北標準時間)
  * @returns {string} ISO8601的字符串 e.g. 2021-12-11T15:49:12.000+0800
  */
  public ISO8601DateFormatter(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    }
    return '';
  }

  /**
  * 將「ISO8601的字符串」傳換為「民國日期」 (自定義格式)
  * @param {string} date ISO8601的字符串 e.g.2021-12-11T15:49:12.000+0800
  * @param {string} formatter e.g.YYYY/MM/DD HH:mm
  * @returns {string} 民國日期 e.g. 110/11/17 13:19
  */
  // ISO860格式 轉 民國年 (自定義格式)  e.g. 110/11/17 13:19
  // 使用方式 ： this.$dateTime.customTWDateFormatter(<來源>, 'YYYY/MM/DD HH:mm')
  // 年為強制轉，可傳可不傳
  public customTWDateFormatter(date, formatter) {
    if (date) {
      const twYear = moment(date).year() - 1911; // 轉民國年
      const lessYear = formatter.replace(/^(Y*\/)/, '');
      return `${twYear}/${moment(date).format(lessYear)}`;
    }
    return '';
  }

  public install(Vue) {
    Vue.prototype.$dateTime = this;
  }
}

export default new DateTimeFormmat();
