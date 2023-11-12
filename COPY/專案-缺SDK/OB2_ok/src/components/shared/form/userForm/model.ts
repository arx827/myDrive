import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
 * @description 使用者新增/編輯表單
 * @version 2021/08/05
 * @author B1531
 */
export interface UserValidateForm {
    account?: ValidateFormComponent
    name?: ValidateFormComponent
    idNo?: ValidateFormComponent
    email?: ValidateFormComponent
    extensionNo?: ValidateFormComponent
    staffNo?: ValidateFormComponent
    unitId?: ValidateFormComponent
    unit?: ValidateFormComponent
}

/**
* @description 下拉式選單資料格式
*/
export interface Option {
    label: string,
    value: string,
}