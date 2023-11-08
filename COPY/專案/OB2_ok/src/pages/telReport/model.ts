import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

/**
 * 搜尋條件欄位表單
 */
export interface TelReportPageSearchForm {
    // 部門
    departmentIdList?: string[],
    // 科別
    divisionIdList?: string[],
    // 電訪員
    userIdList?: string[],
    // 電話變更受理日期
    startDate?: Moment,
    telChangePickerStartDate?: Date,
    endDate?: Moment,
    telChangePickerEndDate?: Date,
    telChangeStartString?: string,
    telChangeEndString?: string,
}

/**
 * 欄位驗證提示工具
 */
export interface TelReportPageSearchValidateForm {
    // 部門
    departmentIdList?: ValidateFormComponent,
    // 科別
    divisionIdList?: ValidateFormComponent,
    // 電訪員
    userIdList?: ValidateFormComponent,
    // 電話變更受理日期
    startDate?: ValidateFormComponent,
    endDate?: ValidateFormComponent,
}


/**
 * @description 驗證date picker類別
 */
export enum DatePickerTypeEnum {
    StartDate = "StartDate",
    EndDate = "EndDate"
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

