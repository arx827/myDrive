import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

/**
* @description 會辦轉件表單驗證物件
*/
export default interface ImpairmentMarkForm {
    packNo?:String,
    isNonHearing?:String,
    isAddNonHearing?: String,
    isAddNonLanguage?:String,
    cancelDisabledReason?:String,
    packLogId?:String,
}

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

export interface FileGrid extends File {
    rowkey?: number,
    fileId?: string,
    fileName?: string,
    fileRemark?: string,
    uploadData?: object,
    fileExtension?: string
}

export interface ReviewValidateForm {
    reviewProcess?: ValidateFormComponent
}

export enum manulLetterStatusEnum {
    M="人工",
    B="批次",
    A="異常"
}
