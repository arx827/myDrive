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
 export interface CaseClosedReasonValidateForm {
    caseClosedReasonId?: ValidateFormComponent
    caseClosedReasonName?: ValidateFormComponent
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

export interface CaseClosedReasonChangeFormDto {
    caseClosedReasonId?: string,
    caseClosedReasonName?: string,
    status?: string,
    createId?: string,
    createName?: string,
    createDate?: string,
    updateId?: string,
    updateName?: string,
    updateDate?: string,
}