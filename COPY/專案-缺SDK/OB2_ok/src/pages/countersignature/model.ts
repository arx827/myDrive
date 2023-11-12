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
* @description 會辦查詢驗證物件
*/
export interface InfSearchValidateForm {
    sendStart?: ValidateFormComponent,
    sendEnd?: ValidateFormComponent,
    expiryStart?: ValidateFormComponent,
    expiryEnd?: ValidateFormComponent,
    policyNo01?: ValidateFormComponent,
    policyNo02?: ValidateFormComponent,
    policyNo03?: ValidateFormComponent,
    custId?: ValidateFormComponent,
}

/**
* @description 驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}