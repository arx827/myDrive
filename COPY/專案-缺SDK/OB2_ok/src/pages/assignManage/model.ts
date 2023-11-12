export default interface CaseEstimatedTableDto {
    key?:string,
    averageCasesLastThreeDays?: string,
    newCasesLastDay?: string,
    unContactCasesLastDay?: string,
    callBackRatio?: string,
    pendingLaborNumber?: string,
    estimatedDepartmentTotalPendingCases?: string,
    estimatedPersonalPendingCases?: string,
}

