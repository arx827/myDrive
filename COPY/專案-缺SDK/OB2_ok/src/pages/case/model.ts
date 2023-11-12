import { Moment } from "moment";

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

export interface CasePageSearchForm{
    taskItems?: string[], //電訪項目
    pherId?:string,    //要保人id
    pherName?:string,   // 要保人姓名
    dueContactStartDate?:Moment, //應電訪日
    dueContactEndDate?:Moment,    //應電訪日
    dueContactStartString?:string,  //應電訪日
    dueContactEndString?:string,    //應電訪日
    importStartDate?:Moment ,      //匯入日期
    importEndDate?:Moment,        //匯入日期
    importStartString?:string,      //匯入日期
    importEndString?:string,        //匯入日期
    closeStartDate?:Moment ,      //結案日期
    closeEndDate?:Moment,        //結案日期
    closeStartString?:string,      //結案日期
    closeEndString?:string,        //結案日期
    policyNo01?:string,   //保單號碼
    policyNo02?:string,   //保單號碼
    policyNo03?:string,   //保單號碼
    packNo?:string,       //名單序號
    insuredId?:string,    //被保人id
    insuredName?:string,  //被保人姓名
    departmentIdList?:string[], //部門
    divisionIdList?:string[],   //科別
    changeNo?:string,   //受理案號
    custId?:string,   //受訪者id
    custName?:string, //受訪者姓名
    agentId?:string,  //業務員id
    agentName?:string,  //業務員姓名
    tmrIdList?:string[], //電訪員
}

export interface CasePageSearchValidateForm{
    // 電訪項目
    taskItems?:ValidateFormComponent,
    //要保人
    pherId?:ValidateFormComponent,
    pherName?:ValidateFormComponent,
    // 應電訪日
    dueContactStartDate?: ValidateFormComponent,
    dueContactEndDate?: ValidateFormComponent,
    //匯入日期
    importStartDate?: ValidateFormComponent,
    importEndDate?: ValidateFormComponent,
    //結案日期
    closeStartDate?: ValidateFormComponent,
    closeEndDate?: ValidateFormComponent,
    // 保單號碼
    policyNo01?:ValidateFormComponent,
    policyNo02?:ValidateFormComponent,
    policyNo03?:ValidateFormComponent,
    //名單序號
    packNo?:ValidateFormComponent,
    //被保人
    insuredId?:ValidateFormComponent,
    insuredName?:ValidateFormComponent,
    // 部門別
    departmentIdList?:ValidateFormComponent,
    // 科別
    divisionIdList?:ValidateFormComponent,
    // 受理案號
    changeNo?:ValidateFormComponent,
    // 受訪者
    custId?:ValidateFormComponent,
    custName?:ValidateFormComponent,
    // 業務員
    agentId?:ValidateFormComponent,
    agentName?:ValidateFormComponent,
    // 電訪員
    tmrIdList?:ValidateFormComponent, 
    
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
