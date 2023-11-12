import { ValidateFormComponent } from "@/assets/config/CommonUtil";
/**
* @description 會辦轉件表單驗證物件
*/
export default interface infSendTargetSettingValidationForm {
    //驗證第一層項目
    selectedInfItemId?: ValidateFormComponent,
    //驗證第二層項目
    selectedInfSettingId?: ValidateFormComponent,
    //驗證會辦部門
    selectedDep?: ValidateFormComponent,

  
    tmrIdList?: ValidateFormComponent,
   
    contactEmail?: ValidateFormComponent,
   
    tmrIdcopyList?: ValidateFormComponent,
    carbonCopyEmail?: ValidateFormComponent,
    //驗證email範本id
    emailTemplateId?: ValidateFormComponent,
    
}