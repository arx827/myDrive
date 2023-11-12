import { Moment } from "moment";

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
 * @description 新增/編輯表單
 */
 export interface CommonCodeValidateForm {
    typeId?: ValidateFormComponent
    code?: ValidateFormComponent
    codeName?: ValidateFormComponent
    status?: ValidateFormComponent
    codeSort?: ValidateFormComponent
}

/**
* @description 新增/編輯表單驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

export interface CommonCodeChangeFormDto {
    uuid?: string,
    typeId?: string,
    typeDesc?: string,
    code?: string,
    codeName?: string,
    sMemo1?: string,
    sMemo2?: string,
    sMemo3?: string,
    status?: string,
    codeSort?: number,
}
