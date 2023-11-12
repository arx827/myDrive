import { Moment } from "moment";

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}


//查詢條件
export interface CaseResultPageSearchForm{
    taskIds?: string[], //電訪項目

    policyNo01?:string,   //保單號碼(保單有三個欄位)
    policyNo02?:string,   //保單號碼
    policyNo03?:string,   //保單號碼

    packNo?:string,       //名單序號
    changeNo?:string,   //受理案號
    custId?:string,   //受訪者id
    custName?:string, //受訪者姓名
    pherId?:string,    //要保人id
    pherName?:string,   // 要保人姓名
    agentId?:string,  //業務員id
    agentName?:string,  //業務員姓名
    importStartDate?:Moment ,      //匯入日期1
    importEndDate?:Moment,        //匯入日期2
    importStartString?:string,      //匯入日期1
    importEndString?:string,        //匯入日期2
    dueContactStartDate?:Moment, //應電訪日1
    dueContactEndDate?:Moment,    //應電訪日2
    dueContactStartString?:string,  //應電訪日1
    dueContactEndString?:string,    //應電訪日2
    closeStartDate?:Moment ,      //結案日期1
    closeEndDate?:Moment,        //結案日期2
    closeStartString?:string,      //結案日期
    closeEndString?:string,        //結案日期
    processUnit?:string,  //承辦窗口
    processId?:string, //承辦人員ID
    agentUnitNo?:string, //業務員單位代號
    caseCloseReasonCode?:string //結案狀態代碼
    insuId?:string //被保險人ID
    insuName?:string //被保險人姓名
    
}

export interface CaseResultPageSearchValidateForm{  //caseResultPageSearchValidateForm
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
    // 承辦人員
    processId?: ValidateFormComponent,
    // 承辦人員單位ID
    processUnit?: ValidateFormComponent
    
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
