import { ValidateFormComponent } from "@/assets/config/CommonUtil";
/**
* @description 會辦轉件表單驗證物件
*/
export default interface teleRecordEditValidationForm {
    //電訪項目
    taskId?: ValidateFormComponent,
    //聯絡結果
    contactResultId?: ValidateFormComponent,
    // 電訪結果
    teleResultId?: ValidateFormComponent,
    
}