export interface FileGrid extends File {
    rowkey?: number,
    fileId?: string,
    fileName?: string,
    fileRemark?: string,
    uploadData?: object,
    fileExtension?: string
}

/**
* @description 案件註記驗證物件
*/
export interface SingleFileUploadValidate {
    fileName?: ValidateFormComponent,
    remark?: ValidateFormComponent,
}

/**
* @description 驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}

/**
 * 欄位驗證提示工具
 */
export interface FeildValidation {
    feedback?: boolean,
    state?: string,
    hover?: string,
    msg?: string
}