import { isArray } from 'xe-utils';

export default class validateUtil {
  // 全形偵測
  static fullWidthAcd(str) {
    let checkVal = false;
    for (let i = 0, len = str.length; i < len; i++) {
      const strCode = str.charCodeAt(i);
      if (strCode > 65248 || strCode == 12288) {
        checkVal = true; // str 有全形回報
        break;
      }
    }
    return checkVal;
  }

  /*
   * 驗證傳入參數是否為空(null、空字串、空陣列)
   * true: empty
   * false: not empty
   */
  static isEmpty(data: any) {
    let result = true;
    if (data !== null && data !== undefined) {
      // 字串
      if (typeof data === 'string' && data.trim() !== '') {
        result = false;
      }
      // 數字
      if (typeof data === 'number' && String(data).trim() !== '') {
        result = false;
      }
      // 物件
      if (data instanceof Object && Object.keys(data).length > 0) {
        result = false;
      }
      // 陣列
      if (Array.isArray(data) && data.length > 0) {
        result = false;
      }
    }
    return result;
  }

  /*
   * 驗證身分證
   * 通過: true
   * 不通過: false
   */
  static validateRocId(rocId) {
    let result = {
      byPass: true,
      errorMsg: '',
    };
    rocId = rocId.trim();

    if (rocId.length !== 10) {
      result.byPass = false;
      result.errorMsg = '格式錯誤：長度不正確';
      return result;
    }

    let countyCode = rocId.charCodeAt(0);
    if (countyCode < 65 || countyCode > 90) {
      result.byPass = false;
      result.errorMsg = '格式錯誤：字首英文代號不正確';
      return result;
    }

    let sexCode = rocId.charCodeAt(1);
    if (sexCode != 49 && sexCode != 50) {
      result.byPass = false;
      result.errorMsg = '格式錯誤：性別代碼不正確';
      return result;
    }

    let serialCode = rocId.slice(2);
    for (let i = 0; i < serialCode.length; i++) {
        let c = serialCode.charCodeAt(i);
        if (c < 48 || c > 57) {
          result.byPass = false;
          result.errorMsg = '格式錯誤：數字區出現非數字字元';
          return result;
        }
    }

    let conver = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
    let weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    rocId = String(conver.indexOf(rocId[0]) + 10) + rocId.slice(1);

    let checkSum = 0;
    for (let i = 0; i < rocId.length; i++) {
      let c = parseInt(rocId[i]);
      let w = weights[i];
      checkSum += c * w;
    }

    let verification = checkSum % 10 == 0;

    if (!verification) {
      result.byPass = false;
      result.errorMsg = '格式錯誤：檢核碼不正確';
      return result;
    }
    return result;
  }

  /*
   * 統一編號
   * 通過: true
   * 不通過: false
   */
  static validateTaxId(taxId) {
    let result = {
      byPass: true,
      errorMsg: '',
    };

    let sum = 0;
    let multarr = ['1', '2', '1', '2', '1', '2', '4', '1'];
    let pattern = /^[0-9]{8}$/;
    let taxIdstr = String(taxId);

    // 是否為8碼數字字串
    if (!pattern.test(taxIdstr)) {
      result.byPass = false;
      result.errorMsg = '格式錯誤：要有8個數字';
      return result;
    }

    // 取得檢查碼
    for (let i = 0; i < 8; i++) {
      let cal = parseInt(taxIdstr.charAt(i)) * parseInt(multarr[i]);
      let ones = cal % 10;
      let tens = Math.floor(cal / 10);
      sum += (ones + tens);
    }

    // 驗證檢查碼是否合格
    // 考慮倒數第二位為7，總和 + 1 後再檢查
    // 檢查碼 / 10 餘數為0 即合格
    if (sum % 10 === 0 || (taxIdstr.charAt(6) === '7' && (sum + 1) % 10 === 0)) {
      return result;
    }
    result.byPass = false;
    result.errorMsg = '格式錯誤：檢查碼不正確';
    return result;
  }

  /**
	 * @summary 表單輸入規則
   * @param {number} type: 規則
   * @param {any} value: 輸入資訊
	*/
  static validateFormData(type: number, value: any): any {
    switch (type) {
      case 1: // 不允許輸入中文/空白
        value = value.replace(/\s+/g, '').replace(/[\u4E00-\u9FA5]/g, '');
        break;
      case 2: // 不允許輸入中文
        value = value.replace(/[\u4E00-\u9FA5]/g, '');
        break;
      case 3: // 只允許輸入英文數字(不可輸入中文/符號/空白)
        value = value.replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 4: // 只允許輸入英文
        value = value.replace(/[^a-zA-Z]/g, '');
        break;
      case 5: // 只允許輸入數字
        value = value.replace(/[^0-9]/g, '');
        break;
      case 6: // 只允許輸入中文
        value = value.replace(/[^\u4E00-\u9FA5]/g, '');
        break;
      case 7: // 只允許輸入英符(不可輸入中文/數字)
        value = value.replace(/[^\u4E00-\u9FA50-9]/g, '');
        break;
      case 8: // 只允許輸入英符中數
        value = value.replace(/[^\u4E00-\u9FA5a-zA-Z0-9\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/g, '');
        break;
      default:
        break;
    }
    return value;
  }
}
