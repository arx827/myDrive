import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

/**
 * 查詢條件
 */
export interface RecordPageSearchForm {
    dialStart?: Moment, // 錄音時間區間(開始)
    dialEnd?: Moment, // 錄音時間區間(結束)
    dialStartString?: string, // 錄音時間區間(開始)字串
    dialEndString?: string, // 錄音時間區間(結束)字串
    datePickerDialStart?: Date, // 錄音時間區間(結束)日期
    datePickerDialEnd?: Date, // 錄音時間區間(結束)日期
    userId?: string, // 電訪員帳號
    extNo?: string, // 電話號碼(來電)
    telNo?: string, // 電話號碼(外撥)
    casePolicy?: string, // 保單號碼(全)
    policyNo?: string, // 保單號碼
    policySeq?: string, // 保單號碼序號
    policyIdDup?: string, // 保單號碼重複碼
    specifyContactStartTime?: Moment,
    specifyContactEndTime?: Moment,
    specifyContactStartString?: string,
    specifyContactEndString?: string
}

/**
 * 欄位驗證提示工具
 */
export interface RecordPageSearchValidateForm {
    dialStart?: ValidateFormComponent, // 錄音時間區間(開始)
    dialEnd?: ValidateFormComponent, // 錄音時間區間(結束)
    userId?: ValidateFormComponent, // 電訪員帳號
    extNo?: ValidateFormComponent, // 電話號碼(來電)
    telNo?: ValidateFormComponent, // 電話號碼(外撥)
    casePolicy?: ValidateFormComponent, // 保單號碼(全)
    policyNo?: ValidateFormComponent, // 保單號碼
    policySeq?: ValidateFormComponent, // 保單號碼序號
    policyIdDup?: ValidateFormComponent, // 保單號碼重複碼
    specifyContactStartTime?: ValidateFormComponent,
    specifyContactEndTime?: ValidateFormComponent,
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

/**
 * 日期選擇器類別
 */
export enum DatePickerEnum {
    // 錄音時間區間 (起)
    dialStartString = "dialStartString",
    dialStart = "dialStart",
    // 錄音時間區間 (迄)
    dialEndString = "dialEndString",
    dialEnd = "dialEnd",
}

/**
 *  驗證date picker類別
 */
export enum DatePickerTypeEnum {
    StartDate = "StartDate",
    EndDate = "EndDate"
}