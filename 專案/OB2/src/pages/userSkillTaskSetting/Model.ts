
export interface UserTaskDto{
    id?:string,
    superiorUnitId?: string,
    superiorUnitName?: string,
    unitId?: string,
    unitName?:string,
    userId?: string,
    userName?:string,
    taskId?: string,
    taskName?:string,
    skillGetDate?: string,
    effectiveDate?: string,
    updateId?: string,
    updateName?:string,
    updateDate?: string,
}


export default interface UserSkillsDto{
    superiorUnitId?: string,
    superiorUnitName?: string,
    unitId?: string,
    unitName?:string,
    userId?: string,
    userName?:string,
    languageIds?: Array<string>,//此在後端為TSCOMMONCODE中的code，為英文組成的陣列
    languagesNameString?:string,//此在後端TSCOMMONCODE中的中文名稱組成的字串
    tagIds?: Array<string>,
    tagNamesString?: string,
    updateId?: string,
    updateName?:string,
    updateDate?: string,
}