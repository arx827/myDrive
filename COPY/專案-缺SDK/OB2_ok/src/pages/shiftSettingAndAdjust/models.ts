import { ComponentState } from "@fubonlife/obd-api-axios-sdk";

/**
 * 畫面元件權限 範例
 */
export const AuthComonent: { [key: string]: ComponentState; } = {

    TAB_EVENT: {
        show: true,
        enable: false
    },
    
    TAB_SHIFT: {
        show: true,
        enable: false
    }
}