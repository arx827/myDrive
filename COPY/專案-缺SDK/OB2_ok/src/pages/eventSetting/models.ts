import { Moment } from "moment";

export interface TaskInterface{
    name?: string,
    label?: string,
    start: number,
    duration: number,
    percent: number,
    type: string,
    style: any
}

export enum TaskColor {
    colorGreen = '#98CF60',
    colorCyan = '#63CAB6',
    colorPink = '#FC4F65',
    colorOrange = '#FD8300',
    colorDarkBlue = '#6352FF',
    colorPurple = '#8289C9',
    colorGray = '#808080',
}

export interface FblEventSettingForm {
    startDate?: Moment,
    endDate?: Moment,
    startString : string,
    endString : string,
    eventCode?: string
    departmentIdList: Array<string>, //部門
    divisionIdList: Array<string>, //科別
    tmrIdList: Array<string>, //電訪員
}

export interface SelectOptions {
    label: string,
    value: string
}

export interface UnitUser {
    name: string,
    userId: string,
    unitId: string
}