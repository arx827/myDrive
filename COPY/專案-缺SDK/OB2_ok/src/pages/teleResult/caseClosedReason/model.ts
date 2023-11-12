/**
 * 搜尋條件欄位表單
 */
 export interface CaseClosedReasonSearchForm {
    caseClosedReasonId?: string,
    caseClosedReasonName?: string,
    status?: string,
}

/**
* @description 新增/修改表單物件
*/
export interface EditDataDto {
    caseClosedReasonId?: string,
    caseClosedReasonName?: string,
    status?: string,
    createId?: string,
    createName?: string,
    createDate?: string,
    updateId?: string,
    updateName?: string,
    updateDate?: string,
}