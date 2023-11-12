import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

/**
* @description 發送Email相關輸入參數
*/
export interface EmailForm{
    custName?:string;
    custId?:string;
    receiverAddress?:string;
    emailSubject?:string;
    emailContent?:string;
}

/**
* @description 驗證寄送Email欄位
*/
export interface EmailValidateForm{
    receiverAddress?:ValidateFormComponent;
    emailSubject?:ValidateFormComponent;
    emailContent?:ValidateFormComponent;
    emailUploadFileDes?:ValidateFormComponent;
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
* @description Email範本 mapping 表
*/
export interface EmailTemplateMap{
    [key:string]:EmailTemplateObj;
}

/**
* @description Email範本 mapping 表 物件
*/
export interface EmailTemplateObj{
    codeName?:string;
    content?:string;
}

/**
* @description 附檔列表
*/
export interface AttachmentGrid{
    pk:string;
    fileRemark:string;
    fileName:string;
}