import { ComponentState } from "@fubonlife/obd-api-axios-sdk";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { CasePolicyLogDto } from '@fubonlife/obd-api-axios-sdk';
import ValidationUtil from "@/assets/config/ValidationUtil";

/**
 * 共用工具
 */
export default class CommonUtil {
    /**
     * 
     * @param acc 
     * @returns 
     */
    static parseCookie(): Map<string, string> {
        let cookiesRaw = document.cookie.split(";");
        let m = new Map();
        for (var i = 0; i < cookiesRaw.length; i++) {
            let item = cookiesRaw[i].trim().split("=");
            m.set(item[0], item[1]);
        }
        return m;
    }

    /**
     * 判斷是否為超集
     * @param supSet
     * @param subSet 
     * @returns 
     */
    static isSuperset(supSet: Set<Object>, subSet: Set<Object>) {
        for (var elem of subSet) {
            if (!supSet.has(elem)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 計算欄位寬度要顯示幾個字(全形中文)
     * @param number
     * @returns
     */
    static countColumnWidth(number) {
        return (Number(number + 1)) * 14 + 22;
    }

    /**
     * 驗證共用物件(舊版 須逐步移除)
     */
    static feildValidate(fv: ValidateFormComponent, feedback: boolean, state: string, hover: string, msg: string, hoverVisible?:boolean) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
        fv.hoverVisible = hoverVisible == null? fv.hoverVisible : hoverVisible;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用物件內容異動
     * ValidateFormComponent: 驗證物件
     * feedback 是否有誤
     * msg 錯誤訊息
     * hoverVisible 錯誤訊息的hover是否顯示
     * 
     * 使用方法請參考 RoleSettingPage 相關頁面
     */
    static feildValidateWithVisible(fv: ValidateFormComponent, feedback: boolean, msg: string, hoverVisible?:boolean) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.hoverVisible = hoverVisible == null? fv.hoverVisible : hoverVisible;
        fv.msg = msg == null ? fv.msg : msg;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 判斷欄位驗證狀態
     * 
     */
    static getFeildValidateStatus(fv: ValidateFormComponent){
        let status = '';
        if(fv.feedback){
            status = 'error';
        }else{
            status ='success';
        }
        return status;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 回傳欄位feedback
     * 
     */
    static getFeildValidateFeedback(fv: ValidateFormComponent){
        return fv.feedback;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 回傳hover msg
     * 
     */
    static getFeildValidateHoverMsg(fv: ValidateFormComponent){
        return fv.msg;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 變更hover是否隱藏
     * 
     */
    static getFeildValidateVisibleChange(fv: ValidateFormComponent){
        fv.hoverVisible = ! fv.hoverVisible;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 回傳hover msg
     * 
     */
    static getFeildVaildateTrigger(fv: ValidateFormComponent){
        let trigger = '';
        if(fv.feedback){
            trigger = 'hover';
        }
        return trigger;
    }

    /**
     * B1683 (2022/03/30)
     * 
     * 驗證共用方法
     * 判斷hover 是否隱藏
     * 
     */
    static getFeildVaildateHoverVisible(fv: ValidateFormComponent){
        let visible = false;
        if(fv.feedback){
            visible =  fv.hoverVisible
        }
        return visible;
    }

    /**
     * @description 取得驗證後參數
     * @param fv 
     */
    static getFeildValid(fv: ValidateFormComponent){

        this.getFeildValidateFeedback(fv);
        fv.state = this.getFeildValidateStatus(fv);
        this.getFeildValidateHoverMsg(fv);
        fv.hover = this.getFeildVaildateTrigger(fv);
        fv.hoverVisible = this.getFeildVaildateHoverVisible(fv);

        return fv;
    }

    /**
     * @description 取得案件歷程代碼
     * @param caseNo 
     * 
     * @author B1529
     * @version 2022/07/05
     */
    static getCaseLogId(caseNo:string){
        
        let caseLog : CasePolicyLogDto;
        let caseLogId:string = '';
        let pickupResult = PackMatchModule.pickupResult;

        if(!ValidationUtil.isEmpty(pickupResult) && !ValidationUtil.isEmpty(pickupResult.firstCasePack)
            && !ValidationUtil.isEmpty(pickupResult.firstCasePack.casePolicyLogInfoList)){
            caseLog = pickupResult.firstCasePack.casePolicyLogInfoList.find((element : CasePolicyLogDto) => element.caseNo == caseNo);
        }

        if(!ValidationUtil.isEmpty(caseLog)){
            caseLogId = caseLog.guid;
        }

        return caseLogId;
    }
}

/**
 * 畫面元件權限
 */
export interface AuthComonent { [key: string]: ComponentState; }

/**
* @description 驗證物件
*/
export interface ValidateFormComponent {
    hover?: string;
    feedback?: boolean;
    state?: string;
    msg?: string;
    hoverVisible?: boolean;
}
