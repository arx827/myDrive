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
 export interface ContactResultValidateForm {
    contactResultId?: ValidateFormComponent
    contactResultName?: ValidateFormComponent
    sendMplus?: ValidateFormComponent
    status?: ValidateFormComponent
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

export interface ContactResultChangeFormDto {
    contactResultId?: string,
    contactResultName?: string,
    sendMplus?: string,
    status?: string,
    createId?: string,
    createName?: string,
    createDate?: string,
    updateId?: string,
    updateName?: string,
    updateDate?: string,
}
