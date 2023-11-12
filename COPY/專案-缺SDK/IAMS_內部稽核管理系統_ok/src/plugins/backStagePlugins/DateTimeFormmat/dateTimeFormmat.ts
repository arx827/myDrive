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

	static transformMinguoDateTime(datetime: string): string {
		// 民國年轉換西元年
		// 以「非數字」做為分隔符號，將日期資訊抓出來。
		const datetimeNumber: string[] = datetime.split(/\D/g);
		const date = `${Number.parseInt(datetimeNumber[0]) + 1911}/${datetimeNumber[1]}/${datetimeNumber[2].length === 0 ? '**' : datetimeNumber[2]}`;
		const time = `${Number.parseInt(datetimeNumber[3] ? datetimeNumber[3] : '00')}:${datetimeNumber[4] ? datetimeNumber[4] : '00'}:${datetimeNumber[5] ? datetimeNumber[5] : '00'}`;
		return `${date} ${time}`;
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

	// 日期轉「ISO8601字符串」(預設:YYYY-MM-DDTHH:mm:ss.SSS + Z)
	static formatStringDateDault(date: string): string {
		return `${moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`;
	}

	// date 只取 HH:mm
	static formatStringHourAndMinute(date: string): string {
		return moment(date).format('HH:mm');
	}

	// 避免 new Date(null) => 1970/01/01
	static isValidDate(date: string): any {
		return (moment(date).isValid()) ? new Date(date) : date;
	}
}
