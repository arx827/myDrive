import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 會辦轉件表單驗證物件
*/
export default interface NotiReplyContentValidateForm {
    
    content?: ValidateFormComponent,
    //方便連絡日期
    sort?: ValidateFormComponent,

}