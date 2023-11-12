import { ValidateFormComponent } from "@/assets/config/CommonUtil";
/**
* @description 遊寄主表轉件表單驗證物件
*/
export default interface MailLetterEditFromValidationForm {
    mailByPostDate?: ValidateFormComponent,
    receiver?: ValidateFormComponent,
    zipCode?: ValidateFormComponent,
    address?: ValidateFormComponent,
    addressType?: ValidateFormComponent
}