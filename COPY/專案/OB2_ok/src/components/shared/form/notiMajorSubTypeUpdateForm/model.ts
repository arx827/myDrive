import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 表單驗證物件
*/
export default interface NotiMajorSubTypeValidateForm {
    description?: ValidateFormComponent,

    //使用者設定主類別代碼
    userMajorSubTypeId?: ValidateFormComponent,
}