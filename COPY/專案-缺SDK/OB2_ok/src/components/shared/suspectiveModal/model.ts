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

export interface ReviewValidateForm {
    reviewProcess?: ValidateFormComponent
}

export enum manulLetterStatusEnum {
    M="人工",
    B="批次",
    A="異常"
}

