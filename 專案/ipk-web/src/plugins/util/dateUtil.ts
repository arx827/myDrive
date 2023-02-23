import moment from 'moment';

export default class DateUtil {
	static transform(date: string, hasTime?: boolean, splitToken?: string): string {
		// 以「非數字」做為分隔符號，將日期資訊抓出來。
		const dateNumber: string[] = date.split(/\D/g);
		if (!splitToken) {
			splitToken = '/';
		}
		if (hasTime) {
			return `${Number.parseInt(dateNumber[0])}${splitToken}${dateNumber[1]}${splitToken}${dateNumber[2]} ${dateNumber[3]}:${dateNumber[4]}:${dateNumber[5]}`;
		}
			return `${Number.parseInt(dateNumber[0])}${splitToken}${dateNumber[1]}${splitToken}${dateNumber[2]}`;
	}

  /**
  * @description 計算日期起迄日相差天數
  * @param {Array<any>} dateRange: 日期區間
  */
	static diffDateRange(dateRange: Array<any>): number {
		const startDate = moment(dateRange[0]);
		const endDate = moment(dateRange[1]);
		const diffDate = endDate.diff(startDate, 'day');

		return diffDate;
	}
}
