import { Moment } from "moment";

/**
 * 初始化使用 flag
 */
export enum InitFlag{
    CREATED, RESET
}

export interface CaseHistorySearchForm {
    // 匯入日期
    contactStartDate?: Moment,
    contactEndDate?: Moment,
    datePickerContactStartDate?: Date,
    datePickerContactEndDate?: Date,
    contactStartString?: string,
    contactEndString?: string,
    // 保單號碼
    policyNo01?: string,
    policyNo02?: string,
    policyNo03?: string,
    //受訪者id
    custId?: string,
    caseNo?:string
}



export interface CaseHistorySearchValidateForm{
    // 匯入日期
    contactStartDate?:ValidateFormComponent,
    contactEndDate?:ValidateFormComponent,
    contactStartString?:ValidateFormComponent,
    contactEndString?:ValidateFormComponent,
    // 保單號碼
    policyNo01?:ValidateFormComponent,
    policyNo02?:ValidateFormComponent,
    policyNo03?:ValidateFormComponent,
    //受訪者id
    custId?:ValidateFormComponent,
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

/**
 * 欄位驗證提示工具
 */
 export interface FeildValidation {
    feedback?: boolean,
    state?: string,
    hover?: string,
    msg?: string
}
