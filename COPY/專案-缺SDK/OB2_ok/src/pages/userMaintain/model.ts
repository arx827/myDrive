import { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { UserDtoStaffTypeEnum, UserDtoStatusEnum } from "@fubonlife/obd-api-axios-sdk";

/**
 * 搜尋條件欄位表單
 */
export interface UserSearchForm {
    userId?: string,
    name?: string,
    deptId?: string,
    diviId?: string,
    unitId?: string,
    staffNo?: string,
    extensionNo?: string,
    superiorUnitId?: string,
    roles?: string[],
    staffType?: UserDtoStaffTypeEnum|string,
    status?: UserDtoStatusEnum|string,
}

/**
* @description 驗證物件
*/
export interface UserMaintainValidateObject {
    name?: ValidateFormComponent,
    userId?: ValidateFormComponent,
    staffNo?: ValidateFormComponent,
    extensionNo?: ValidateFormComponent
}