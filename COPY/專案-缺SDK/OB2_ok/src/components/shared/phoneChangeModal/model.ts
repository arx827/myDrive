import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

export interface FileGrid extends File {
    rowkey?: number,
    fileId?: string,
    fileName?: string,
    fileRemark?: string,
    uploadData?: object,
    fileExtension?: string
}

export interface FileReplyAndClose{
    fileId?: string,
    fileName?: string,
    fileRemark?: string,
    uploadData?: object
}

export interface InfInformValidateForm {
    infType?: ValidateFormComponent,
    infItemList?: ValidateFormComponent,
    infSecondType?:ValidateFormComponent,
    content?:ValidateFormComponent,
    infDepartment?:ValidateFormComponent,
    targetEmail?:ValidateFormComponent,
    carbonCopyEmail?: ValidateFormComponent,
    expireDate?: ValidateFormComponent,
    adjunctDesc?: ValidateFormComponent,
}

/**
* @description 會辦回覆表單驗證物件
*/
export interface InfReplyValidateForm {
    //處理狀態
    handleStatus?: ValidateFormComponent,
    //回覆內容
    content?: ValidateFormComponent,
    //方便連絡日期
    contactDate?: ValidateFormComponent,
    // 方便聯絡時段
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,
}

/**
* @description 會辦轉件表單驗證物件
*/
export interface InfTransferValidateForm {
    //姓名
    name?: ValidateFormComponent,
    //分機
    ext?: ValidateFormComponent,
}

/**
* @description 會辦轉件表單驗證物件
*/
export interface InfCloseValidateForm {
    //結案備註
    caseClosedRemark?: ValidateFormComponent,
    //方便連絡日期
    contactDate?: ValidateFormComponent,
    // 方便聯絡時段
    convenientContactStartTime?: ValidateFormComponent,
    convenientContactEndTime?: ValidateFormComponent,
}

/**
 * @description 會辦回覆表單
 * 
 * @author B1683
 * @version 2022/07/07
 */
export interface InfReplyForm {
    handleStatus: string,
    contentId: string,
    content: string,
    contactDate: Moment,
    contactString: string,
    datePickerContactDate: Date,
    convenientContactStartTime: Moment,
    convenientContactEndTime: Moment,
    convenientContactStartString: string,
    convenientContactEndString: string,
    fileIds: string[],
    fileNames: string[],
    deletedFileIds: string[]
}
/**
 * @description 會辦覆核檢核
 * 
 * @author B0845
 * @version 2022/08/30
 */
export interface ReviewValidateForm {
    reviewProcess?: ValidateFormComponent
}