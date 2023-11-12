import { Moment } from "moment";

export interface eventInsert {
    eventName: string,
    eventDate: Moment,
    eventDateString?: string,
    startTime: string,
    startTimeMoment: Moment,
    endTime: string,
    endTimeMoment: Moment,
    selectUserNameOptions: string,
    selectUnitIdOptions: string,
    shiftWorkCode: string,
    remark?: string,
    userId: string,
}