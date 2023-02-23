import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 會辦轉件表單驗證物件
*/
export default interface InfItemValidateForm {
    itemFirst?: ValidateFormComponent,
    description?: ValidateFormComponent,
    content?: ValidateFormComponent,
}