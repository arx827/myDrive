import { Moment } from "moment";

/**
 * 搜尋條件欄位表單
 */
export interface CustMarkSearchForm {
    nationality?: string,
    custId?: string,
    skillLanguage?: string[],
    skillTag?: string[],
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

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

/**
* @description 新增/修改表單物件
*/
export interface EditDataDto {
    custMarkId?: string,
    nationality?: string,
    custId?: string,
    name?: string,
    languageIdList?: string[],
    tagIdList?: string[],
    content?: string,
    handled?: string,
    isAffective?: string,
    createId?: string,
    createName?: string,
    createTime?: string,
    updateId?: string,
    updateName?: string,
    updateTime?: string,
    effectiveStartDate?: Moment,
    effectiveEndDate?: Moment,
    effectiveStartString?: string,
    effectiveEndString?: string
}