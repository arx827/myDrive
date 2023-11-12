import { ValidateFormComponent } from "@/assets/config/CommonUtil";
/**
* @description 會辦轉件表單驗證物件
*/
export default interface infSendTargetSettingValidationForm {
    //會辦類型
    tmrIdList?: ValidateFormComponent,
    //方便連絡日期
    contactEmail?: ValidateFormComponent,
    // 方便聯絡時段
    tmrIdcopyList?: ValidateFormComponent,
    carbonCopyEmail?: ValidateFormComponent,
    emailTemplateId?: ValidateFormComponent,
}