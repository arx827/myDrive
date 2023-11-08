export interface UnitUser {
    name: string,
    userId: string,
    unitId: string,
    unitName: string
}

export interface AgentSearchForm {
    userDeptId?: string[],
    userDiviId?: string[],
    userAccount?: string[],
    agentDeptId?: string[],
    agentDiviId?: string[],
    agentAccount?: string[],
    isStaffNoAgentOnly?: boolean,
    isAgentActivate?: boolean
}