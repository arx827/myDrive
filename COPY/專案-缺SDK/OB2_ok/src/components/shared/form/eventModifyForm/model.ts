import { Moment } from "moment";

export interface eventModify {
    id: string,
    eventName: string,
    dateString: string,
    eventCode: string,
    eventDate: string,
    startTime: string,
    endTime: string,
    startTimeDate: Moment,
    endTimeDate: Moment,
    shiftWorkCode: string,
    shiftWork: string,
    remark?: string,
    user: string,
    userId: string,
    isConflic?: boolean
    isTimeDulplicated?:boolean
}