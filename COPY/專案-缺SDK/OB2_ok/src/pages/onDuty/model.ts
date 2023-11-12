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

/**
 * @description 照會階段
 */
 export enum NotiStep {
    open = 1,
    reply = 2,
    close = 3,
    review = 4
}