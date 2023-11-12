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