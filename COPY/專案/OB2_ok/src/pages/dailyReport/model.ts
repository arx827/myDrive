import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Moment } from "moment";

/**
 * 搜尋條件欄位表單
 */
 export interface DailyReportSearchForm {
    // 部門
    departmentIdList?:string[],
    // 科別
    divisionIdList?:string[],
    // 電訪員
    tmrIdList?:string[],
    // 資料日期
    dataStartDate?: Moment,
    dataPickerStartDate?: Date,
    dataEndDate?: Moment,
    dataPickerEndDate?: Date,
    dataStartString?: string,
    dataEndString?: string,
}

/**
 * 欄位驗證提示工具
 */
 export interface DailyReportSearchValidateForm {
    // 部門
    departmentIdList?:ValidateFormComponent,
    // 科別
    divisionIdList?:ValidateFormComponent,
    // 電訪員
    tmrIdList?:ValidateFormComponent,
    //匯入日期
    dataStartDate?: ValidateFormComponent,
    dataEndDate?: ValidateFormComponent,
}

/**
 * @description 日期選擇器類別
 */
 export enum DatePickerEnum {
    // 應電訪日(起)
    dataStartString = "dueContactStartString",
    dataStartDate = "dueContactStartDate",
    // 應電訪日(迄)
    dataEndString = "dueContactEndString",
    dataEndDate = "dueContactEndDate",
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

