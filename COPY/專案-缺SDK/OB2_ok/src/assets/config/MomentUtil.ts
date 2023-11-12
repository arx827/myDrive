import moment from 'moment';
import { Timestamp } from 'rxjs';
import VlidationUtil from './ValidationUtil';

export default class MomentUtil {

    /**
     * 日期轉 moment
     * @param date 
     * @returns 
     */
    static transferMoment(date: Date): moment.Moment {
        return moment(date);
    }

    /**
     * 日期轉字串(預設 : YYYY/MM/DD)
     * @param date 
     * @returns 
     */
    static default(date: Date): string {
        return moment(date).format('YYYY/MM/DD');
    }

    /**
     * 日期轉字串(預設 : YYYY/MM/DD HH:mm:ss)
     * @param date 
     * @returns 
     */
    static transferDate(date: Date): string {
        return moment(date).format('YYYY/MM/DD HH:mm:ss');
    }

    /**
     * 日期轉字串
     * @param date 
     * @param format 
     * @returns 
     */
    static format(date: Date, format: string): string {
        return moment(date).format(format);
    }

    /**
     * 日期轉字串(預設:YYYY/MM/DD HH:mm:ss)
     * @param date 
     * @param format 
     * @returns 
     */
    static formatStringDateDault(date: string): string {
        return moment(date).format("YYYY/MM/DD HH:mm:ss");
    }

    /**
     * 日期轉字串
     * @param date 
     * @param format 
     * @returns 
     */
    static formatStringDate(date: string, format: string): string {
        return moment(date).format(format);
    }

    /**
     * 日期比大小
     * endDate是否大於startDate
     * @param startDate
     * @param endDate 
     * @returns 
     */
    static compare(startDate: Date, endDate: Date): boolean {
        if (moment(startDate).isBefore(endDate)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 日期區間
     * startDate與endDate區間是否超過指定天數
     * @param startDate
     * @param endDate 
     * @param duration 
     * @returns 
     */
    static between(startDate: Date, endDate: Date, duration: number): boolean {
        if (this.compare(startDate, endDate)
            && ((endDate.valueOf() - startDate.valueOf()) / (1000 * 60 * 60 * 24) >= duration)) {
            //區間大於所需天數
            return true;
        } else {
            //區間小於所需天數
            return false;
        }
    }

    /**
     * 日期區間 是否 超過指定時間
     * @param startDate 起 
     * @param endDate 迄
     * @param duration moment.unitOfTime ex: years, months, days
     * @param overTiime 超過的時間
     * @returns 
     */
    static betweenStartAndEndOverTime(startDate:moment.Moment, endDate:moment.Moment, duration:moment.unitOfTime.Diff, overTiime: number): boolean{
    
        var result:boolean = false;
    
        if(startDate != null && endDate != null && duration != null){
            // 取絕對值，避免 起 迄放錯邊 算出 負號
           var between:number = Math.abs(endDate.diff(startDate, duration, true));
           if(between >= overTiime){
              result = true;
           }
        }
        return result;
      }

    /**
     * 時間+指定月數 推導時間
     * 以 startTime 為基準往後計算時間
     * @param startTime
     * @param hours 
     * @returns 
     */
    static addMonth(startTime: Date, months: number): string {
        return moment(startTime).add(months, 'months').format('YYYY/MM/DD HH:mm');
    }

    /**
     * 時間+指定天數 推導時間
     * 以 startTime 為基準往後計算時間
     * @param startTime
     * @param days 
     * @returns 
     */
    static addDay(startTime: Date, days: number): string {
        return moment(startTime).add(days, 'days').format('YYYY/MM/DD HH:mm');
    }

    /**
     * 時間+指定小時 推導時間
     * 以 startTime 為基準往後計算時間
     * @param startTime
     * @param hours 
     * @returns 
     */
    static addHour(startTime: Date, hours: number): string {
        return moment(startTime).add(hours, 'hours').format('YYYY/MM/DD HH:mm');
    }

    /**
     * 將字串轉為ISO 8601標準Datetime格式或民國年月日時分秒
     * @param date 日期字串
     * @returns 日期字串
     */
    static transformRoc(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        
        var dateNumber: string[] = date.split(/\D/g);

        // 年份小於1000即被認為是民國年
        if (parseInt(dateNumber[0]) < 1000) {
            // 此格式轉成在JSON物件時可被後端接收
            return `${Number.parseInt(dateNumber[0]) + 1911}-${dateNumber[1]}-${dateNumber[2]}T${dateNumber[3]}:${dateNumber[4]}:${dateNumber[5]}`;
        } else {
            return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${dateNumber[2]} ${dateNumber[3]}:${dateNumber[4]}:${dateNumber[5]}`;
        }
    }


    /**
     * 將字串轉為西元或民國年月日
     * @param date 日期字串
     * @returns 日期字串
     */
    static transformRocYearMonthDay(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        if(date){  //新增如果date不為Null才進行切轉
            var dateNumber: string[] = date.split(/\D/g); // " \D "代表正規表達式中非數字字符," g "代表全域
            // 年份小於1000即被認為是民國年
        if (parseInt(dateNumber[0]) < 1000) {
            // 此格式轉成在JSON物件時可被後端接收
            return `${Number.parseInt(dateNumber[0]) + 1911}-${dateNumber[1]}-${dateNumber[2]}`;
        } else {
            return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${dateNumber[2]}`;
        }
        }
    }

    /**
     * 將 民國年月日 時分秒 字串 擷取 民國年月日
     * @param timeStr : "111/01/01 01:01:01"
     * @returns "111/01/01"
     * @author B1842
     */
    static getOnlyRocDate(timeStr: string): string{
        var result = "";
        // REGEX 擷取民國年月日
        var visitStartAndEndDateRocRegex:RegExp = /^[0-1]?\d{1,2}[/][0-9]?\d{1,2}[/][0-9]?\d{1,2}/g;
        if(!VlidationUtil.isEmpty(timeStr)){
            result = timeStr.match(visitStartAndEndDateRocRegex) != null ? timeStr.match(visitStartAndEndDateRocRegex)[0] : "";
        }
        return result;
    }

    /**
     * vue2 date-time-picker 時間選擇器標題 日期格式轉民國年
     * @param date 日期字串
     * @returns  格式字串：{傳入日期的民國年}年M月DD日
     */
     static transTimePickerTitle(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        var dateNumber: string[] = date.split(/\D/g);
        // 年份小於1000即被認為是民國年
        if (parseInt(dateNumber[0]) < 1000) {
            // 此格式轉成在JSON物件時可被後端接收
            return `${Number.parseInt(dateNumber[0]) + 1911}年M月DD日`;
        } else {
            return `${Number.parseInt(dateNumber[0]) - 1911}年M月DD日`;
        }
    }

          /**
     * 將日期字串轉為DateTime中的只顯示小時和分鐘
     * @param date 日期字串
     * @returns Time字串
     */
           static transformHourAndMinute(date: string): string {
            // 以「非數字」做為分隔符號，將日期資訊抓出來。
            var dateNumber: string[] = date.split(/\D/g);

            return `${dateNumber[3]}:${dateNumber[4]}`;
        }

    /**
     * 將字串轉為西元或民國年月日時分秒
     * @param date 日期字串
     * @returns 日期字串
     */
     static transformRocYearMonthDayHHMMSS(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        var dateNumber: string[] = date.split(/\D/g);
        
        // 年份小於1000即被認為是民國年
        if (parseInt(dateNumber[0]) < 1000) {
            // 此格式轉成在JSON物件時可被後端接收
            return `${Number.parseInt(dateNumber[0]) + 1911}-${dateNumber[1]}-${dateNumber[2]} ${dateNumber[3]}:${dateNumber[4]}:${dateNumber[5]}`;
        } else {
            return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${dateNumber[2]} ${dateNumber[3]}:${dateNumber[4]}:${dateNumber[5]}`;
        }
    }

    /**
     * 將字串轉為西元或民國年月
     * @param date 日期字串
     * @returns 日期字串
     */
    static transformRocYearMonth(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        var dateNumber: string[] = date.split(/\D/g);

        // 年份小於1000即被認為是民國年
        if (parseInt(dateNumber[0]) < 1000) {
            // 此格式轉成在JSON物件時可被後端接收
            return `${Number.parseInt(dateNumber[0]) + 1911}-${dateNumber[1]}`;
        } else {
            return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}`;
        }
    }

     /**
     * 將字串轉為西元yyyy-MM-dd
     * @param date 日期字串
     * @returns 日期字串
     */
      static transformAddDate(date: string): string {
        // 以「非數字」做為分隔符號，將日期資訊抓出來。
        var dateNumber: string[] = date.split(/\D/g);

            // 此格式轉成在JSON物件時可被後端接收
        return `${Number.parseInt(dateNumber[0])}-${dateNumber[1]}-${dateNumber[2]}`;
        
    }

    /**
     * 將moment轉成timestamp 可用於與後端Date比較
     * @param moment
     * @returns Timestamp 
     */
    static transferMomentToTimestamp(moment: moment.Moment): number {
        return moment.valueOf();
    }

    /**
     * 將字串轉為ISO 8601標準Datetime格式或民國年月日時分
     * @param date 日期字串
     * @returns 日期字串
     */
         static transformRocWithoutSec(date: string): string {
            // 以「非數字」做為分隔符號，將日期資訊抓出來。
            
            var dateNumber: string[] = date.split(/\D/g);
    
            // 年份小於1000即被認為是民國年
            if (parseInt(dateNumber[0]) < 1000) {
                // 此格式轉成在JSON物件時可被後端接收
                return `${Number.parseInt(dateNumber[0]) + 1911}-${dateNumber[1]}-${dateNumber[2]}T${dateNumber[3]}:${dateNumber[4]}`;
            } else {
                return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${dateNumber[2]} ${dateNumber[3]}:${dateNumber[4]}`;
            }
        }
}