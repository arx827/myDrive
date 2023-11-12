/**
 * 搜尋條件欄位表單
 */
 export interface CommonCodeSearchForm {
    typeDesc?: string,
    commonCodeId?: string,
    commonCodeName?: string,
}

/**
* @description 下拉式選單資料格式
*/
export interface SelectOption {
    label: string,
    value: string,
}

/**
* @description 新增/修改表單物件
*/
export interface EditDataDto {
    uuid?: string,
    typeId?: string,
    typeDesc?: string,
    code?: string,
    codeName?: string,
    sMemo1?: string,
    sMemo2?: string,
    sMemo3?: string,
    status?: string,
    codeSort?: number,
    createId?: string,
    createName?: string,
    createTime?: string,
    updateId?: string,
    updateName?: string,
    updateTime?: string,
}
