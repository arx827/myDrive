import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 發送範本驗證物件
*/
export default interface SendTemplateSettingUpdateFormValidateForm {
    sendTarget?: ValidateFormComponent, //發送對象
    templateId?: ValidateFormComponent, //範本id
    subject?: ValidateFormComponent,//主旨
    content?: ValidateFormComponent,//範本內文
    crud?:ValidateFormComponent,//限制條件
    codeName?:ValidateFormComponent,//範本名稱
}