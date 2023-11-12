import { Moment } from "moment";

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
 * @description 新增/編輯表單
 */
 export interface CustMarkValidateForm {
    nationality?: ValidateFormComponent
    custId?: ValidateFormComponent
    name?: ValidateFormComponent
    effectiveStartDate?: ValidateFormComponent
    effectiveEndDate?: ValidateFormComponent
    content?: ValidateFormComponent
    tagIdList?: ValidateFormComponent
    languageIdList?: ValidateFormComponent
}

/**
* @description 新增/編輯表單驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
}

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

export interface CustMarkChangeFormDto {
    custMarkId?: string,
    nationality?: string,
    custId?: string,
    name?: string,
    languageIdList?: string[],
    tagIdList?: string[],
    content?: string,
    handled?: string,
    isAffective?: string,
    createId?: string,
    createName?: string,
    createTime?: string,
    updateId?: string,
    updateName?: string,
    updateTime?: string,
    effectiveStartDate?: Moment,
    effectiveEndDate?: Moment,
    effectiveStartString?: string,
    effectiveEndString?: string,
    datePickerEffectiveStartDate?: Date,
    datePickerEffectiveEndDate?: Date
}

/**
 * 畫面元件權限 範例
 */
// export const AuthComonent: { [key: string]: Component; } = {

//     USER_MAINTAIN_CLEAR: {
//         show: true,
//         disable: false
//     }

// }