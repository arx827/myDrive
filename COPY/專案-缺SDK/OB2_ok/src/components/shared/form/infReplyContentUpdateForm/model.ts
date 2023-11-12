import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 會辦轉件表單驗證物件
*/
export default interface InfReplyContentValidateForm {
    //會辦類型
    infType?: ValidateFormComponent,
    //方便連絡日期
    content?: ValidateFormComponent,
    // 方便聯絡時段
    sort?: ValidateFormComponent,
    status?: ValidateFormComponent,
}