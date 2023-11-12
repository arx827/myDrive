import { CasePackDto } from "@fubonlife/obd-api-axios-sdk/dist/api";

/**
 * @description 頁籤跟案件資訊
 * @author B0845
 * @version 2022/11/02 
 */
export interface eventData{
    tabKey: string,
    currentPack: CasePackDto
}