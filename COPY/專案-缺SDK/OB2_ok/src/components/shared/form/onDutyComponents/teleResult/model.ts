import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
* @description 電訪結果區表單驗證物件
*/
export interface TeleResultAreaValidateForm {
    //方便連絡日期
    contactDate?: ValidateFormComponent,
    // 方便聯絡時段
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,
}

/**
 * @description 驗證有結案原因之案件的問卷物件
 */
export interface ReturnValidCloseCaseSave{
    success:boolean; 
    errorMsg:String[];
}