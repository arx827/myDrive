import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

/**
 * @description 簡訊發送相關輸入參數物件
 */
export interface TextMessageForm{
    custName?: string,
    custId?: string,
    phoneNum?: string,
    msgContent?: string,
}

/**
 * @description 驗證簡訊寄送欄位
 */
export interface TextMessageValidateForm {
    phoneNum? :ValidateFormComponent
    msgContent? :ValidateFormComponent
}

/**
 * @description 欄位驗證提示工具
 */
 export interface FeildValidation {
    feedback?: boolean,
    state?: string,
    hover?: string,
    msg?: string
}


/**
 * @description 簡訊範本 mapping 表
 */
export interface MessageTemplateMap{
    [key:string]:MessageTemplateObj;
}

/**
 * @description 簡訊範本 mapping 表 物件
 */
export interface MessageTemplateObj{
    codeName?: string;
    content?: string;
}