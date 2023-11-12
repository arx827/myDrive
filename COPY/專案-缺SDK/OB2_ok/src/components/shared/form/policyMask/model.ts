import { Moment } from "moment";

/**
 * 案件註記表單
 */
export interface policyMaskFormDto {
    //案件重啟
    isReboot?: boolean,
    //部門
    departmentId?: string,
    //科別
    divisionId?: string,
    //電訪員
    tmrId?: string,

    //案件等級
    caseLevelId?: string,

    //方便連絡日期
    contactDate?: Moment,
    contactString?: string,

    // 方便聯絡時段
    convenientContactStartTime?: Moment,
    convenientContactEndTime?: Moment,
    convenientContactStartString?: string,
    convenientContactEndString?: string

    //案件註記
    custMark?: string,
    //註記原因
    markReason?: string,
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
* @description 案件註記驗證物件
*/
export interface policyMaskValidateForm {
    //案件重啟
    isReboot?: ValidateFormComponent,
    //部門
    departmentId?: ValidateFormComponent,
    //科別
    divisionId?: ValidateFormComponent,
    //電訪員
    tmrId?: ValidateFormComponent,

    //案件等級
    caseLevelId?: ValidateFormComponent,

    //方便連絡日期
    contactDate?: ValidateFormComponent,

    // 方便聯絡時段
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,

    //案件註記
    custMark?: ValidateFormComponent,
    //註記原因
    markReason?: ValidateFormComponent,
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
