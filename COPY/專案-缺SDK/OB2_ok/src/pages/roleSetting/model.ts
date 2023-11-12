import { ValidateFormComponent } from "@/assets/config/CommonUtil";

/**
 * @description 角色群組維護 查詢條件
 * @version 2021/07/06
 * @author B1529
 */
export interface RoleSearchForm {
    id?: string,
    name?: string,
    roleDesc?: string,
    status?: string,
    group?: string
}

/**
* @description 驗證物件
*/
export interface RoleSettingValidateObject {
    id?: ValidateFormComponent,
    name?: ValidateFormComponent,
}