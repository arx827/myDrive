import { ValidateFormComponent } from "@/assets/config/CommonUtil";
/**
* @description 遊寄主表轉件表單驗證物件
*/
export default interface MailLetterEditFromValidationForm {
    mailByPostDate?: ValidateFormComponent,
    custName?: ValidateFormComponent,
    zipCode?: ValidateFormComponent,
    address?: ValidateFormComponent,
    addressType?: ValidateFormComponent
}

export interface FileGrid extends File {
    rowkey?: number,
    fileId?: string,
    fileName?: string,
    fileRemark?: string,
    uploadData?: object,
    fileExtension?: string
}
