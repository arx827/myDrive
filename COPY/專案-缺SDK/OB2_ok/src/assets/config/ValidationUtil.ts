/**
 * 共用格式驗證
 * 例如 : 身分證字號、Email 等等...
 */
export default class VlidationUtil {

    /**
     * 角色代號 僅可輸入英數字與底線
     * @param acc
     * @returns 
     */
    static idValidation(acc: string): boolean {
        if (!/^[A-Za-z0-9_]+$/.test(acc)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 使用者帳號 僅可輸入英數字
     * @param acc
     * @returns 
     */
    static accountValidation(acc: string): boolean {
        if (acc && /^[A-Za-z0-9]+$/.test(acc)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 身分證字號 僅可輸入英數字
     * @param idNo
     * @returns 
     */
    static idNoValidation(idNo: string): boolean {
        if (idNo && /^[A-Za-z0-9]+$/.test(idNo)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * "本國人"身分證字號 法定格式
     * @param idNo
     * @returns 
     */
    static idNoNativeValidation(idNo: string): boolean {
        if (idNo && /^[A-Z]{1}[1-2]{1}[0-9]{8}$/.test(idNo)) {
            return VlidationUtil.verifyTaiwanIdIntermediateString(idNo);
        } else {
            return false;
        }
    } 

    //"本國人" 身份證字號 檢核碼驗證
    static verifyTaiwanIdIntermediateString(input: string): boolean {
        const intRadix = 10
        /**
         *  A=10 台北市     J=18 新竹縣     S=26 高雄縣
         *  B=11 台中市     K=19 苗栗縣     T=27 屏東縣
         *  C=12 基隆市     L=20 台中縣     U=28 花蓮縣
         *  D=13 台南市     M=21 南投縣     V=29 台東縣
         *  E=14 高雄市     N=22 彰化縣     W=32 金門縣*
         *  F=15 台北縣     O=35 新竹市*    X=30 澎湖縣
         *  G=16 宜蘭縣     P=23 雲林縣     Y=31 陽明山
         *  H=17 桃園縣     Q=24 嘉義縣     Z=33 連江縣*
         *  I=34 嘉義市*    R=25 台南縣
         *
         *  Step 1: 英文字母按照上表轉換為數字之後，十位數 * 1 + 個位數 * 9 相加
         */
        const TAIWAN_ID_LOCALE_CODE_LIST = [
            1, // A -> 10 -> 1 * 1 + 9 * 0 = 1
            10, // B -> 11 -> 1 * 1 + 9 * 1 = 10
            19, // C -> 12 -> 1 * 1 + 9 * 2 = 19
            28, // D
            37, // E
            46, // F
            55, // G
            64, // H
            39, // I -> 34 -> 1 * 3 + 9 * 4 = 39
            73, // J
            82, // K
            2, // L
            11, // M
            20, // N
            48, // O -> 35 -> 1 * 3 + 9 * 5 = 48
            29, // P
            38, // Q
            47, // R
            56, // S
            65, // T
            74, // U
            83, // V
            21, // W -> 32 -> 1 * 3 + 9 * 2 = 21
            3, // X
            12, // Y
            30 // Z -> 33 -> 1 * 3 + 9 * 3 = 30
        ]
        
        const RESIDENT_CERTIFICATE_NUMBER_LIST = [
            0, // A
            1, // B
            2, // C
            3, // D
            4, // E
            5, // F
            6, // G
            7, // H
            4, // I
            8, // J
            9, // K
            0, // L
            1, // M
            2, // N
            5, // O
            3, // P
            4, // Q
            5, // R
            6, // S
            7, // T
            8, // U
            9, // V
            2, // W
            0, // X
            1, // Y
            3 // Z
        ]
        
        const getCharOrder = (s: string, i: number) =>
            s.charCodeAt(i) - 'A'.charCodeAt(0)
        
        const firstDigit = TAIWAN_ID_LOCALE_CODE_LIST[getCharOrder(input, 0)]
        
        const secondDigit = isNaN(parseInt(input[1], intRadix)) // if is not a number (舊版居留證編號)
            ? RESIDENT_CERTIFICATE_NUMBER_LIST[getCharOrder(input, 1)]
            : parseInt(input[1], intRadix)
        
        const rest = input
            .substr(2)
            .split('')
            .map(n => parseInt(n, intRadix))
        
        const idInDigits = [firstDigit, secondDigit, ...rest]
        
        // Step 2: 第 1 位數字 (只能為 1 or 2) 至第 8 位數字分別乘上 8, 7, 6, 5, 4, 3, 2, 1 後相加，再加上第 9 位數字
        
        const ID_COEFFICIENTS = [1, 8, 7, 6, 5, 4, 3, 2, 1, 1]
        const sum = VlidationUtil.zipWith(idInDigits, ID_COEFFICIENTS, VlidationUtil.multiply).reduce(VlidationUtil.add, 0)
        
        // Step 3: 如果該數字為 10 的倍數，則為正確身分證字號
        
        return sum % 10 === 0
    }

    //相乘("本國人" 身份證字號 檢核碼驗證用)
    static multiply(a: number, b: number) {
        return a * b
    }

    //相加("本國人" 身份證字號 檢核碼驗證用)
    static add(a: number, b: number) {
        return a + b
    }

    //第 1 位數字 至第 8 位數字分別乘上 8, 7, 6, 5, 4, 3, 2, 1 處理邏輯("本國人" 身份證字號 檢核碼驗證用)
    static zipWith<T, R>(a1: T[], a2: T[], f: (v1: T, v2: T) => R): R[] {
        const length = Math.min(a1.length, a2.length)
        const result: R[] = []
        
        for (let i = 0; i < length; i++) result[i] = f(a1[i], a2[i])
        
        return result
    }

    /**
     * 使用者姓名 不可輸入符號
     * @param name
     * @returns 
     */
    static nameValidation(name: string): boolean {
        if (name && /^[\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9FFF\uAC00-\uF848_a-zA-Z0-9]+$/.test(name)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 電子郵件格式
     * @param email
     * @returns 
     */
    static emailValidation(email: string): boolean {
        
        // ^\w+：@ 之前必須以一個以上的文字&數字開頭，例如 abc
        // ((-\w+)：@ 之前可以出現 1 個以上的文字、數字或「-」的組合，例如 -abc-
        // (\.\w+))：@ 之前可以出現 1 個以上的文字、數字或「.」的組合，例如 .abc.
        // ((-\w+)|(\.\w+))*：以上兩個規則以 or 的關係出現，並且出現 0 次以上 (所以不能 –. 同時出現)
        // @：中間一定要出現一個 @
        // [A-Za-z0-9]+：@ 之後出現 1 個以上的大小寫英文及數字的組合
        // (\.|-)：@ 之後只能出現「.」或是「-」，但這兩個字元不能連續時出現
        // ((\.|-)[A-Za-z0-9]+)*：@ 之後出現 0 個以上的「.」或是「-」配上大小寫英文及數字的組合
        // \.[A-Za-z]+$/：@ 之後出現 1 個以上的「.」配上大小寫英文及數字的組合，結尾需為大小寫英文

        let pattern = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

        if(email && pattern.test(email)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 分機號碼 僅可輸入數字
     * @param extensionNo
     * @returns 
     */
    static extensionNoValidation(extensionNo: string): boolean {
        if (extensionNo && /^[0-9]+$/.test(extensionNo)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 員工編號 僅可輸入數字
     * @param staffNo
     * @returns 
     */
    static staffNoValidation(staffNo: string): boolean {
        if (staffNo && /^[0-9]+$/.test(staffNo)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description 判斷是否為空
     * @param value 
     * @returns 
     * @version 2021/05/31
     * @author B1529
     */
    static isEmpty(value): boolean {

        let result = false;

        if (value == null) {
            result = true;
        } else if (typeof value == 'undefined') {
            result = true;
        } else if (typeof value == 'string') {
            if (value.trim() == '') {
                result = true;
            }
        } else if (typeof value == 'object') {
            if(!(value instanceof Date) && Object.keys(value).length <= 0){
                result = true;
            }
        }

        return result;
    }

    /**
     * 選單路徑 僅可輸入英數字與/,-
     * @param url
     * @returns 
     */
    static urlValidation(url: string): boolean {
        if (!/^[A-Za-z0-9/_-]+$/.test(url)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 英文驗證 僅可輸入英文大小寫字母
     * @param url
     * @returns 
     */
    static alphabetValidation(alphabet: string): boolean {
        if (!/^[A-Za-z]+$/.test(alphabet)) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * 單位代碼 僅可輸入英數字
     * @param unitId
     * @returns 
     */
    static unitValidation(unitId: string): boolean {
        if (unitId && /^[A-Za-z0-9]+$/.test(unitId)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 答案選項代碼 僅可輸入英數字
     * @param answerOptionId
     * @returns 
     */
    static answerOptionValidation(answerOptionId: string): boolean {
        if (answerOptionId && /^[A-Za-z0-9]+$/.test(answerOptionId)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 題目編號 僅可輸入英數字
     * @param itemCode
     * @returns 
     */
    static itemCodeValidation(itemCode: string): boolean {
        if (itemCode && /^[A-Za-z0-9]+$/.test(itemCode)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 電訪項目代碼 僅可輸入英數字
     * @param taskId
     * @returns 
     */
    static taskIdValidation(taskId: string): boolean {
        if (taskId && /^[A-Za-z0-9-]+$/.test(taskId)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 主機對應代碼 僅可輸入英數字
     * @param coreSystemCode
     * @returns 
     */
    static coreSystemCodeValidation(coreSystemCode: string): boolean {
        if (coreSystemCode && /^[A-Za-z0-9]+$/.test(coreSystemCode)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 問卷代碼 僅可輸入英數字
     * @param questCode
     * @returns 
     */
    static questCodeValidation(questCode: string): boolean {
        if (questCode && /^[A-Za-z0-9]+$/.test(questCode)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 電訪項目優先序 僅可輸入數字
     * @param priority
     * @returns 
     */
    static priorityValidation(priority: string): boolean {
        if (priority && /^[0-9]+$/.test(priority)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 最後匯入時間 僅可輸入數字
     * @param priority
     * @returns 
     */
    static lastImportTimeValidation(priority: string): boolean {
        if (priority && /^[0-9]+$/.test(priority)) {
            return true;
        } else {
            return false;
        }
    }

    /** 通用 僅可輸入數字 */
    static numberValidation(data: string): boolean {
        if (data && /^[0-9]+$/.test(data)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 西元年月日格式驗證
     * @param matches 
     * @returns 
     */
    static checkDateFormat(year: number, month: number, day: number): boolean {
        const isLeapYear = this.checkLeapYear(year);
        // 月份不能超過12月
        if (month > 12) {
            return false;
        }
        // 各月份的日期檢查
        switch (month) {
            case 2:
                if (isLeapYear) {
                    if (day > 29) {
                        return false;
                    }
                } else {
                    if (day > 28) {
                        return false;
                    }
                }
                return true;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                if (day > 31) {
                    return false;
                }
                return true;
            case 4:
            case 6:
            case 9:
            case 11:
                if (day > 30) {
                    return false;
                }
                return true;
            default:
                return false;
        }
    }

    /**
     * 西元年閏年判斷
     * @param yyyy
     * @returns 
     */
    static checkLeapYear(yyyy: number) {
        if ((yyyy % 4 == 0 && yyyy % 100 != 0) || (yyyy % 400 == 0)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否為純數字
     * @param value
     * @returns 
     */
    static numberOnlyValidation(value: string): boolean {
        if (value && /^[0-9]+$/.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 僅可輸入英文或數字
     * @param target 
     * @returns 
     */
    static alphabetAndNumberValidation(target: string): boolean {
        if (target && /^[A-Za-z0-9]+$/.test(target)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 僅可輸入英文或數字或符號
     * @param target:string
     * @returns :boolean
     */
    static alphabetAndNumberAndSymbolValidation(target: string): boolean{
        if (target && /^[A-Za-z0-9\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]+$/.test(target)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 僅可輸入數字或符號
     * @param value
     * @returns 
     */
    static numberOrSymbolValidation(value: string): boolean {
        if (value && /[\uFF41-\uFF5A\uFF21-\uFF3A\u4e00-\u9FFF_a-zA-Z]/.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 僅可輸入半形 或 全形數字
     * (表示相反為 僅可輸入中文、全形英文或全形符號	)
     * @param value 
     * @returns 
     */
    static onlyHalfwidthOrFullWithNum(value: string): boolean{
        if(value && /[\u0000-\u00ff]|[\uff10-\uff19]/.test(value)){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * 僅可輸入 半型英數字及中文
     * @param value 
     * @returns 
     */
    static onlyHalfEngChnNum(value: string): boolean{
        if(value && /^[0-9A-Za-z\u4e00-\u9fa5]+$/.test(value)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 僅可輸入 半型英文、數字、中文、符號
     * \s 空白及換行
     * 0-9A-Za-z\u4e00-\u9fa5 : 半型英文、數字、中文
     * \u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E : 英文符號
     * 中文標點符號 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥ 如下
     * \u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5 
     *  
     * @param value 
     * @returns boolean
     */
     static onlyHalfEngChnNumSymbol(value: string): boolean{
        if(value && /^[\s0-9A-Za-z\u4e00-\u9fa5\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5]+$/.test(value)){
            return true;
        }
        else{
            return false;
        }
    }

     
    
    /**
     * 共用代碼 代碼Id僅可輸入英數字及符號 ,_.–
     * @param data
     * @returns 
     */
     static codeIdValidation(data: string): boolean {
        if (!/^[A-Za-z0-9,_.-]+$/.test(data)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 共用代碼 排列順序檢查不可為0或第一位不可輸入0
     * @param data
     * @returns 
     */
    static codeSortValidation(data: string): boolean {
        if (data && /^[0]+[0-9]*$/.test(data)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否包含中文
     * @param value
     * @returns 
     */
    static isAnyChinese(s:string):boolean{
        var stringList = s.split('');
        let chineseReg = new RegExp('^[\u4E00-\u9FFF]+$');
        let ans = false;
        stringList.forEach(char=>{
            if(chineseReg.test(char)){
                ans = true;
            }
        })
        return ans;
    }

    /**
     * 檔案類型是否為 『WORD、EXCEL、PDF、JPG、TIF、TXT、MSG』
     * @param value
     * @returns 
     */
    static fileTypeValidate(file: File):boolean{
        let result = true;

        const isExcel = (file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || file.type.includes("application/vnd.ms-excel"));
        const isWord = (file.type.includes("application/msword") || file.type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
        const isJpg = (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".jpe") || file.name.endsWith(".jfif"));
        const isPDF = file.type.includes("application/pdf");
        const isTif = file.type.includes("image/tiff");
        const isMsg = file.name.endsWith(".msg");
        const isTxt = file.name.endsWith(".txt");

        if (!(isExcel || isWord || isJpg || isPDF || isTif || isMsg || isTxt)) {
            result = false;
        }

        return result;
    }
}

/** 欄位檢核物件 */
export class validation {
    msg: string = "";
    state: string = "";
    hover: string = "";
    feedback: boolean = false;
    hoverShow: boolean = false;

    reset() {
        this.msg = "";
        this.state = "";
        this.hover = "";
        this.feedback = false;
        this.hoverShow = false;
    }

    setError() {
        this.feedback = true;
        this.state = "error";
        this.hover = "hover";
    }
}