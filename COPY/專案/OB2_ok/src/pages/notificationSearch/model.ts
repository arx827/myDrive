import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
* @description 照會查詢驗證物件
*/
export interface notiSearchValidateForm {
    sendStart?: ValidateFormComponent,
    sendEnd?: ValidateFormComponent,
    expiryStart?: ValidateFormComponent,
    expiryEnd?: ValidateFormComponent,
    policyNo01?: ValidateFormComponent,
    policyNo02?: ValidateFormComponent,
    policyNo03?: ValidateFormComponent,
    custId?: ValidateFormComponent,
    replyDateStart?: ValidateFormComponent,
    replyDateEnd?: ValidateFormComponent
}

/**
 * @description 照會查詢進入點
 * 
 * @author B1529
 * @version 2022/08/24
 */
export enum NotificationProcess {
    notiProgress = 'notiProgress',  // 照會中
    notiReply = 'notiReply'         // 照會回覆
}

/**
 * @description 照會查詢進入點
 * 
 * @author B1529
 * @version 2022/08/24
 */
 export enum CloseStatus {
    N = 'N',            // 未結案
    W = 'W',            // 待結案
    Y = 'Y'             // 已結案
}

