import { ValidateFormComponent } from "@/assets/config/CommonUtil";


/**
* @description 驗證物件
*/
export default interface InfItemValidateForm {
    
    majorSubTypeId?: ValidateFormComponent,//第一層項目id驗證
    description?: ValidateFormComponent,//第二層項目id驗證
    content?: ValidateFormComponent,//罐頭語驗證
}