import validateUtil from '@/plugins/util/validateUtil';

export default class transferUtil {
  /**
  * @description 小數點轉換成百分比表示
  * @param {any} data: 欲轉換的資料
  * @param {number} length 取小數點幾位
  */
  static toPercent(data: any, length: number) {
    let str = Number(data * 100).toFixed(length);
    str += '%';
    return str;
  }

  // 將數字四捨五入到小數點後n位
  static round(num, n) {
    // return Math.round((num + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n);
    // Math.pow 調整成 exponentiation operator (指數運算子) 寫法
    return Math.round((num + Number.EPSILON) * (10 ** n)) / (10 ** n);
  }

  /**
  * @description 金額轉換成千分位表示，並依照傳入位數判斷四捨五入到第幾位，未超過不補零
  * @param {number} data: 欲轉換的資料
  * @param {number} decimal 取小數點第幾位
  */
  static transferPrice(data: number | string, decimal?: number) {
    if (validateUtil.isEmpty(data)) {
      return '';
    }
    let newData = data;
    // 去除千分位，避免後端給的是有千分位的字串
    if (typeof newData === 'string') {
      newData = newData.replace(',', '');
    }
    // 去掉小數點後的零
    const dataNum = Number(newData);

    // 處理千分位
    const moneyString = dataNum.toString();
    const stringPart = moneyString.split('.');
    const integerPart = stringPart[0]?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 小數點後四捨五入
    // return Math.round((num + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n);
    // Math.pow 調整成 exponentiation operator (指數運算子) 寫法
    let decimalPart = '';
    if (stringPart[1]) {
      if (decimal && stringPart[1].length > decimal) {
        decimalPart = `.${Math.round(parseInt(stringPart[1]) / (10 ** (stringPart[1].length - decimal)))}`;
      } else {
        decimalPart = `.${stringPart[1]}`;
      }
    }

    return `${integerPart}${decimalPart}`;
  }

  // 日期補上0
  static add0(m) {
    return m < 10 ? `0${m}` : m;
  }

  // excel下載檔名
  static getExcelName(name) {
    let time = new Date();
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();

    return name + y + this.add0(m) + this.add0(d) + this.add0(h) + this.add0(mm) + this.add0(s);
  }

  /**
  * @description 深拷貝方法
  */
  static deepCopyData(inputObj) {
    if (typeof inputObj !== 'object' || validateUtil.isEmpty(inputObj) || Object.prototype.toString.call(inputObj) === '[object Date]') {
        return inputObj;
      }
    let outputObj = Array.isArray(inputObj) ? [] : {};
    // outputObj = Object.keys(inputObj).map((i) => {
    //   const value = inputObj[i];
    //   return this.deepCopyData(value);
    // });
    const keyList = Object.keys(inputObj);
    for (let i = 0; i < keyList.length; i++) {
        const value = inputObj[keyList[i]];
        outputObj[keyList[i]] = this.deepCopyData(value);
    }
    return outputObj;
  }

  /**
	 * @summary 用value來對應選到的選項
   * @param {Array} options: 下拉選單
   * @param {any} value
	*/
	static getSelectOption(options: Array<any>, value: any) {
		let selectOption: any = null;
		if (!validateUtil.isEmpty(options)) {
			for (let i = 0; i < options.length; i++) {
				let option = options[i];
				if (option.value === value) {
					selectOption = option;
				}
			}
		}
		return selectOption;
	}

  /**
	 * @summary 取得附檔名
   * @param {string} fileName: 檔案名稱
	*/
  static getFileExt(fileName: string) {
    if (validateUtil.isEmpty(fileName)) {
      return;
    }
    let ext = fileName.split('.');
    return ext[ext.length - 1];
  }

  /**
	 * @summary 模糊搜尋：a-select選項超過300筆會有效能問題，故改成輸入4位以上時，再顯示選項
	 * @param {string} value: 輸入的值
	 * @param {Array} options: 要從那個選單篩選
	*/
  static filterOption(value: string, options: Array<any>) {
    if (validateUtil.isEmpty(value) || validateUtil.isEmpty(options)) {
      return;
    }
    const upperValue = value.toUpperCase();
    // 1. 設定模糊查詢規則
    // const reg = new RegExp(`^.*${upperValue}.*$`);
    // 2. 篩選
    const targetData = options.filter((option) => option.label.toUpperCase().indexOf(upperValue) > -1);
    // 3. 排序
    targetData.sort((a, b) =>
      (a.label.toUpperCase().indexOf(upperValue) < b.label.toUpperCase().indexOf(upperValue) ? -1
      : a.label.toUpperCase().indexOf(upperValue) === b.label.toUpperCase().indexOf(upperValue) ? 0 : 1));

    return targetData;
  }

  // 全形轉半形
  static fullCharToHalfChar(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      // 獲取當前字元的unicode編碼
      let code = str.charCodeAt(i);
      // 在這個unicode編碼範圍中的是所有的英文字母已經各種字元
      if (code >= 65281 && code <= 65373) {
        // 把全形字元的unicode編碼轉換為對應半形字元的unicode碼
        result += String.fromCharCode(str.charCodeAt(i) - 65248);
      } else if (code == 12288) {
        // 空格
        result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }
}
