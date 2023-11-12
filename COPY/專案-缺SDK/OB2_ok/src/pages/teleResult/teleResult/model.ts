/**
 * 搜尋條件欄位表單
 */
 export interface TeleResultSearchForm {
    teleResultId?: string,
    teleResultName?: string,
    notSuspective?: string,
    status?: string,
}

/**
* @description 新增/修改表單物件
*/
export interface EditDataDto {
    teleResultId?: string,
    teleResultName?: string,
    notSuspective?: string,
    status?: string,
    createId?: string,
    createName?: string,
    createDate?: string,
    updateId?: string,
    updateName?: string,
    updateDate?: string,
}

/**
 * 欄位驗證提示工具
 */
 export interface FeildValidation {
    feedback?: boolean,
    state?: string,
    hover?: string,
    msg?: string
}