import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 會辦轉件表單驗證物件
*/
export default interface NotiSettingUpdateFormValidateForm {
    notiMajorTypeId?: ValidateFormComponent, //照會主類別id
    notiMajorSubTypeId?: ValidateFormComponent, //照會次類別id
    notiDescription?: ValidateFormComponent,//電訪照會說明
    addtional?: ValidateFormComponent,//電訪照會補字內容
    notiBancassurance?: ValidateFormComponent,//銀保照會碼
    status?: ValidateFormComponent,//狀態
}