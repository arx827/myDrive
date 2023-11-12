import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 表單驗證物件
*/
export default interface NotiMajorTypeValidateForm {
    //會辦類型
    description?: ValidateFormComponent,
    //方便連絡日期

    //使用者設定主類別代碼
    userMajorTypeId?: ValidateFormComponent,
  
}