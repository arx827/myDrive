import { notification, Pagination } from "ant-design-vue";

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
* @description 驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}

/**
* @description 覆核查詢驗證物件
*/
export interface ReviewSearchValidateForm {
    policyNo01?: ValidateFormComponent,
    policyNo02?: ValidateFormComponent,
    policyNo03?: ValidateFormComponent,
    custId?: ValidateFormComponent,
    reviewStart?: ValidateFormComponent, //送核日期
    reviewEnd?: ValidateFormComponent,
}
/**
 * @descirption 覆核列舉
 */
export enum reviewTypeEnum {
    // 照會
    NOTI = "NOTI",
    // 會辦
    INF = "INF",
    // 電話變更
    PC = "PC",
    // 憂質
    SUSPECTIVE = "SUSPECTIVE",
    //聽語障
    IMPAIRMENT = "IMPAIRMENT"
}

export interface ReviewInfData {
    caseNo?: string,
    infStep?: number,
    infInfoId?: string,
    infTypeId?: string,
    // 是否能覆核
    isReview?: boolean,
    packNo?: string,
    caseLogId?: string
}
export enum reviewStatusEnum {

    // 待覆核
    pending = "S",
    // 覆核通過
    reviewPass = "Y",
    // 覆核退回
    reivewReturn = "R",
    // 覆核不通過
    reviewNotPass = "F"
}