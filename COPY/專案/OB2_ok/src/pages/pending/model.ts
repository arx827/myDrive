import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

/**
 * 搜尋條件欄位表單
 */
export interface PeddingSearchForm {
    // 匯入日期
    importStartDate?: Moment,
    importEndDate?: Moment,
    importStartString?: string,
    importEndString?: string
    //方便連絡時段
    contactDates?: Moment[],
    // 保單號碼
    policyNo01?:string,
    policyNo02?:string,
    policyNo03?:string,
    // 受理案號
    changeNo?:string,
    // 應電訪日
    dueContactStartDate?: Moment,
    datePickerDueContactStartDate?: Date,
    dueContactEndDate?: Moment,
    datePickerDueCountactEndDate?: Date,
    dueContactStartString?: string,
    dueContactEndString?: string,
    // 受訪者ID
    respondentsId?:string,
    // 電訪項目
    contactItemIdList?:string[],
    // 案件階段
    caseStageId?:string,
    // 類型
    typeIdList?:string[],
    // 案件狀態
    caseStatusId?:string,
    // 案件等級
    caseLevelId?:string,
    // 優先
    priorityId?:string,
    // 部門別
    departmentIdList?:string[],
    // 科別
    divisionIdList?:string[],
    // 指定聯絡時段
    specifyContactStartTime?: Moment,
    specifyContactEndTime?: Moment,
    specifyContactStartString?: string,
    specifyContactEndString?: string
    // 電訪員
    tmrIdList?:string[],
    // 業務員單位代號
    agentUnitId?:string,
    // 業務員ID
    agentId?:string,
    // 業務員姓名
    agentName?:string,
    // 法定代理人/監護人
    isLegal?:string,
    // 結案日期
    caseCloseStartDate?: Moment,
    datePickerCaseCloseStartDate?: Date,
    caseCloseEndDate?: Moment,
    datePickerCaseCloseEndDate?: Date,
    caseCloseStartDateString?: string,
    caseCloseEndDateString?: string
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
* @description 待電訪驗證物件
*/
export interface PeddingSearchValidateForm {
    //匯入日期
    importStartDate?: ValidateFormComponent,
    importEndDate?: ValidateFormComponent,
    //方便連絡時段
    contactDates?: ValidateFormComponent,
    // 保單號碼
    policyNo01?:ValidateFormComponent,
    policyNo02?:ValidateFormComponent,
    policyNo03?:ValidateFormComponent,
    // 受理案號
    changeNo?:ValidateFormComponent,
    // 應電訪日
    dueContactStartDate?: ValidateFormComponent,
    dueContactEndDate?: ValidateFormComponent,
    // 受訪者ID
    respondentsId?:ValidateFormComponent,
    // 電訪項目
    contactItemIdList?:ValidateFormComponent,
    // 案件階段
    caseStageId?:ValidateFormComponent,
    // 類型
    typeIdList?:ValidateFormComponent,
    // 案件狀態
    caseStatusId?:ValidateFormComponent
    // 案件等級
    caseLevelId?:ValidateFormComponent,
    // 優先
    priorityId?:ValidateFormComponent,
    // 部門別
    departmentIdList?:ValidateFormComponent,
    // 科別
    divisionIdList?:ValidateFormComponent,
    // 指定聯絡時段
    specifyContactStartTime?: ValidateFormComponent,
    specifyContactEndTime?: ValidateFormComponent,
    // 電訪員
    tmrIdList?:ValidateFormComponent,
    // 單位代號
    agentUnitId?:ValidateFormComponent,
    // 業務員ID
    agentId?:ValidateFormComponent,
    // 業務員姓名
    agentName?:ValidateFormComponent,
    // 法定代理人/監護人
    isLegal?:ValidateFormComponent,
    // 結案日
    caseCloseStartDate?: ValidateFormComponent,
    caseCloseEndDate?: ValidateFormComponent,
}

/**
 * @description 日期選擇器類別
 */
export enum DatePickerEnum {
    // 應電訪日(起)
    dueContactStartString = "dueContactStartString",
    dueContactStartDate = "dueContactStartDate",
    // 應電訪日(迄)
    dueContactEndString = "dueContactEndString",
    dueContactEndDate = "dueContactEndDate",
    // 匯入日期(起)
    importStartString = "importStartString",
    importStartDate = "importStartDate",
    // 匯入日期(迄)
    importEndString = "importEndString",
    importEndDate = "importEndDate",
    // 結案日(起)
    caseCloseStartDateString = "caseCloseStartDateString",
    caseCloseStartDate = "caseCloseStartDate",
    // 結案日(迄)
    caseCloseEndDateString = "caseCloseEndDateString",
    caseCloseEndDate = "caseCloseEndDate",
}
/**
 * @description 驗證date picker類別
 */
export enum DatePickerTypeEnum {
    StartDate = "StartDate",
    EndDate = "EndDate"
}


export interface QuestAllData {
    custHisAnswer?: CustHisAnswer,
    custAnswer?: CustAnswer,
    answer?: Answer,
    commonData?: CommonData
}

/** 各區塊保戶回答歷程 */
export interface CustHisAnswer {
    open: string,
    checkId: string,
    quest: object, //{caseNo:{ itemCode:answer,... },...}
    end: object    //{caseNo:{ itemCode:answer,... },...}
}

/** 各區塊保戶回答 */
export interface CustAnswer {
    open: string,
    checkId: string,
    quest: object, //{caseNo:{ itemCode:answer,... },...}
    end: object    //{caseNo:{ itemCode:answer,... },...}
}

/** 各區塊答案 */
export interface Answer {
    open: string,
    checkId: string,
    policy: object,  //{caseNo:{ itemCode:answer,... },...}
    quest: object,   //{caseNo:{ itemCode:{value, remark:{value, option, cont}},... },...}
    reSendLetter: object, //{caseNo:{ type:寄送方式(0:原地址, 1:改寄地址), addr:改寄地址 },...}
    questCheck: object //{caseNo:{doChecked:value(Y or N), pass:value(Y or N), refuseCheck:value(Y or N)},...}
}

/** 共用資料 */
export interface CommonData {
    questModify: string //供結果區判斷問卷整個區塊是否有異動，Y：有異動
}

