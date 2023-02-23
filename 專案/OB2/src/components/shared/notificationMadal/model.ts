import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { NotiBasicInfoDto, NotiAddInfoDto, NotiQuestTableDto } from "@fubonlife/obd-api-axios-sdk";

export interface NotiformValidateForm {
    notiType?: ValidateFormComponent
    notiSubType?: ValidateFormComponent
    additional?: ValidateFormComponent
    expireDate?: ValidateFormComponent
}
export interface NotificationAgentSearchForm {
    agentId?: string,
    agentName?: string,
    agentUnitId?: string,
}

/**
 * 照會發送資料
 */
export interface NotificationSubmitData {
    basicInfoData?: NotiBasicInfoDto,
    itemInfoData?: Array<NotiAddInfoDto>
    interivewData? : Array<NotiQuestTableDto>
}

/**
 * @description 問卷類型
 * 
 * @author B1529
 * @version 2022/07/06
 */
export enum AnswerType {
    rightLetter = 'rightLetter',    // 問卷
    checkId = 'checkId',            // 核身
    end = 'end',                    // 結束語
    open = 'open'                   // 開場白
}

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

/**
 * @description 欄位驗證提示工具
 */
 export interface FeildValidation {
    feedback?: boolean,
    state?: string,
    hover?: string,
    msg?: string
}

/**
 * @description 照會聯絡業務員-聯絡對象
 */
export interface NotificationCallUpAgentContactPersonForm{
    packNo?:string,
    agent?:string,
    agentId?:string,
    agentName?:string,
    agentMob?:string;
    agentOfficeTel?:string;
    agentOfficeTelExt?:string;
    callUpResultType?:string;
}

/**
 * @description 照會聯絡業務員-聯絡結果
 */
export interface NotificationCallUpAgentContactResultForm{
    contactResultType?:string;
    contactResultDetail?:string;
    contactContent?:string;
}

/**
* @description 照會聯絡業務員-聯絡結果驗證物件
*/
export interface NotificationCallUpAgentContactResultValidateForm {
    contactResultType?: ValidateFormComponent,
    contactResultDetail?: ValidateFormComponent,
    contactContent?: ValidateFormComponent,
}

/**
 * @description 照會聯絡業務員-發送訊息
 */
export interface NotificationCallUpAgentInfoForm{
    visitDate?:string;
    email?:string;
    custName?:string;
    custMobChang?:string;
    casePolicy?:string;
    custAppeal?:string;
    emailSubject?:string;
    emailContent?:string;
}

/**
* @description 照會聯絡業務員-發送訊息驗證物件
*/
export interface NotificationCallUpAgentInfoValidateForm {
    checkSend?: ValidateFormComponent,
    visitDate?: ValidateFormComponent,
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,
    email?: ValidateFormComponent,
    custName?: ValidateFormComponent,
    custMobChang?: ValidateFormComponent,
    casePolicy?: ValidateFormComponent,
    custAppeal?: ValidateFormComponent,
    emailSubject?: ValidateFormComponent,
    emailContent?: ValidateFormComponent,
}

/**
* @description Email範本 mapping 表
*/
export interface EmailTemplateMap{
    [key:string]:EmailTemplateObj;
}

/**
* @description Email範本 mapping 表 物件
*/
export interface EmailTemplateObj{
    codeName?:string;
    content?:string;
}

/**
* @description 照會回覆驗證物件
* 
* @author B1529
* @version 2022/08/22
*/
export interface NotiReplyValidateForm {
    content?: ValidateFormComponent,
    contactDate?: ValidateFormComponent,
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,
    notiExpireDate?: ValidateFormComponent,
    handleStatus?: ValidateFormComponent
}

/**
 * @description 照會結案驗證物件
 * 
 * @author B1529
 * @version 2022/08/29
 */
 export interface CloseValidateForm {
    //結案備註
    caseClosedRemark?: ValidateFormComponent,
    //方便連絡日期
    contactDate?: ValidateFormComponent,
    // 方便聯絡時段
    notiContactStartTime?: ValidateFormComponent,
    notiContactEndTime?: ValidateFormComponent,
}

/**
 * @description 處理狀態
 * 
 * @author B1529
 * @version 2022/08/22
 */
export enum HandleStatus {
    NOT_PROCESS = '00',
    PROCESSING = '01',
    ALREADY_PROCESS = '02',
    SKIP_PROCESS = '03',
    NOT_TO_PROCESS = '04'
}

/**
 * @description 會辦覆核檢核
 * 
 * @author B0845
 * @version 2022/08/30
 */
 export interface ReviewValidateForm {
    reviewProcess?: ValidateFormComponent
}
/**
 * @description 撥號結果
 * 
 * @author B1529
 * @version 2022/09/27
 */
export enum CallupResult {
    NO_IN_PERSON = 'NO_IN_PERSON',      // 非本人接聽
    NO_PERSON = 'NO_PERSON',            // 無此人
    IN_PERSON = 'IN_PERSON',            // 本人接聽
    IN_PERSON_BUSY = 'IN_PERSON_BUSY'   // 本人接聽-忙碌
}



