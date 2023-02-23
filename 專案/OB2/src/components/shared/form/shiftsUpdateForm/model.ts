import { SubTaskUpdateGrid } from "@fubonlife/obd-api-axios-sdk";

export interface eventUpdate {
    key: string,
    eventDate: string,
    shiftWorkCode: string,
    shiftWork: string,
    user: string,
    userId: string,
    subTask: SubTaskUpdateGrid[],
    deleteId: string[],
    modifyTask: SubTaskUpdateGrid[],
    originalTask: SubTaskUpdateGrid[],
    updateDate: string,
    updateName: string,
}

export interface resultMessage {
    index: number,
    title: string;
    context: string;
}


// 驗證班表設定時的回傳
export interface validShiftsWorkUpdateResult{
    success: boolean,
    message: string
}