import moment from 'moment';

export default class DateTimeFormmat {
	static transformRocDate(date: string): string {
		// 以「非數字」做為分隔符號，將日期資訊抓出來。
		const dateNumber: string[] = date.split(/\D/g);
		return `${Number.parseInt(dateNumber[0]) - 1911}/${dateNumber[1]}/${dateNumber[2].length === 0 ? '**' : dateNumber[2]}`;
	}

	static transformDate(date: string): string {
		// 民國年轉換西元年
		// 以「非數字」做為分隔符號，將日期資訊抓出來。
		const dateNumber: string[] = date.split(/\D/g);
		return `${Number.parseInt(dateNumber[0]) + 1911}/${dateNumber[1]}/${dateNumber[2].length === 0 ? '**' : dateNumber[2]}`;
	}

	static filterRangeDate(date: Array<Date>): any {
		// 拷貝成新的陣列
		const oriRange = [...date];
		const newRange = [];
		if (!oriRange[0] && !oriRange[1]) {
			// clear 時，回傳 null
			return null;
		}
		// 結束日期的時間改為 23(時):59(分):59(秒)並轉成後端要的時間字串格式(ISO8601)
		newRange[0] = moment(oriRange[0]).format('YYYY-MM-DDTHH:mm:ss.sssZ');
		newRange[1] = moment(oriRange[1].setHours(23, 59, 59)).format(
			'YYYY-MM-DDTHH:mm:ss.999Z',
		);
		return newRange;
	}
}
