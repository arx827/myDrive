import { Module, VuexModule, MutationAction, getModule, Mutation } from 'vuex-module-decorators';
import { store } from '@/plugins/store';
import { CasePackDto, MatchCasePackReturnDto, Option, CasePolicyLogDto } from '@fubonlife/obd-api-axios-sdk';
import ValidationUtil from "@/assets/config/ValidationUtil";

const MTACHED_CASE_PACK = "matched_case_pack"
const PICK_UP_RESULT = "pickup_result"
const TRANSITION_PACK = "transition_pack"
const TRANSITION_PACK_OPTION = "transition_pack_option"

/**
 *  VL903-1114
 *  VL903-1291 M+ 儲存後需顯示，不管結不結案
 */
export interface TeleResultAreaEachSelectAns{
    caseNo?:string; selectedContRes?:string; selectedTeleRes?:string; selectedCaseClosedReason?:string;
    mplusChecked?:boolean; mplusShow?:boolean; mplusMsg?:string;
}

/**
 * VL903-1129
 ************************************************************************************************/
export interface TeleResultAreaContactAns{
    [key:string]:TeleResultAreaContactAnsObj
}
export interface TeleResultAreaContactAnsObj{
    contactDate?: any;contactString?: string;
    convenientContactStartTime?: any;convenientContactEndTime?: any;
    convenientContactStartString?: string;convenientContactEndString?: string;
}
/************************************************************************************************/

@Module({ dynamic: true, namespaced: true, store, name: 'PackMatchStoreModule' })
export default class PackMatchStoreModule extends VuexModule {
    //取件後的CASE_PACK
    matchedCasePack$ : CasePackDto = null;

    pickupResult$: MatchCasePackReturnDto = null;

    
    /**
     * VL903-1114 電訪結果資訊 初始 START
     *********************************************************************/
    TELE_RESULT_AREA_ANS:string = "teleResultAreaAns";
    teleResultAreaSelectAns:Array<TeleResultAreaEachSelectAns> = [];
    teleResultAreaEachSelectAns:TeleResultAreaEachSelectAns = {};
    /*********************************************************************/

    /**
     * VL903-1129
     ************************************************************************************************/
    TELE_RESULT_AREA_CONTACT_ANS:string = "teleResultAreaContactAns";
    teleResultAreaContactAns:TeleResultAreaContactAns = {};
    teleResultAreaContactAnsObj:TeleResultAreaContactAnsObj = {};
    /************************************************************************************************/
    
    // 續訪下拉選單
    followContactOption:Array<Option> = [];

    // 歸戶提示訊息名單
    trasitionPackNos = {};


    //更新取件後的CASE_PACK
    @MutationAction({ mutate: ['matchedCasePack$'] })
    async updateMatchedCasePack(casePack) {
        //存放至localStorage
        localStorage.setItem(MTACHED_CASE_PACK, JSON.stringify(casePack));
        return {
            matchedCasePack$: casePack
        }
    }

    //取得取件後的CASE_PACK
    get matchedCasePack(): CasePackDto {
        const targetCasePack = this.matchedCasePack$;
        if (targetCasePack) {
            return targetCasePack;
        }
        const matched = localStorage.getItem(MTACHED_CASE_PACK);
        if (matched) {
            return JSON.parse(matched);
        }
        return null;
    }

    //更新取件後的資訊
    @MutationAction({ mutate: ['pickupResult$'] })
    async updatePickpResult(pickupResult) {
        //存放至localStorage
        localStorage.setItem(PICK_UP_RESULT, JSON.stringify(pickupResult));
        return {
            pickupResult$: pickupResult
        }
    }

    //取得取件後的資訊
    get pickupResult(): MatchCasePackReturnDto {
        const targetPickupResult = this.pickupResult$;
        if (targetPickupResult) {
            return targetPickupResult;
        }
        const matched = localStorage.getItem(PICK_UP_RESULT);
        if (matched) {
            return JSON.parse(matched);
        }
        return null;
    }

    // 取得歸戶提示訊息下拉選單
    get transitionOption() {
        const targetTransitionOption = this.followContactOption;
        if (targetTransitionOption && targetTransitionOption.length > 0) {
            return targetTransitionOption;
        }
        const Option = localStorage.getItem(TRANSITION_PACK_OPTION);
        if (Option) {
            return JSON.parse(Option);
        }
        return null;
    }

    // 取得歸戶提示訊息勾選名單
    get transitionResult() {
        const targetTransitionResult = this.trasitionPackNos;
        if (targetTransitionResult && this.pickupResult$ && this.pickupResult$.mainCasePack && targetTransitionResult[this.pickupResult$.mainCasePack.packNo]) {
            return targetTransitionResult;
        }
        const transition = localStorage.getItem(TRANSITION_PACK);
        if (transition) {
            return JSON.parse(transition);
        }
        return null;
    }

    /**
     * @description 存放續訪下拉選單資訊
     * @param packOption 
     * @version 2022/05/05
     * @author B1529
     */
    @Mutation
    putfollowContactOption(packOption : Array<Option>) {
        //存放至localStorage
        localStorage.setItem(TRANSITION_PACK_OPTION, JSON.stringify(packOption));
        this.followContactOption = Object.assign(packOption);
    }

    /**
     * @description 紀錄歸戶提示訊息勾選
     * @param checkedObject 
     * @version 2022/05/30
     * @author B1529
     */
    @Mutation
    putTrasitionPackNos(checkedObject) {
        //存放至localStorage
        localStorage.setItem(TRANSITION_PACK, JSON.stringify(checkedObject));
        this.trasitionPackNos = Object.assign(checkedObject);
    }

    /**
     * @description 清除歸戶提示訊息紀錄
     * @param checkedObject 
     * @version 2022/05/30
     * @author B1529
     */
     @Mutation
     clearTrasitionResult() {
        //清除至localStorage
        localStorage.removeItem(TRANSITION_PACK_OPTION);
        localStorage.removeItem(TRANSITION_PACK);
        this.followContactOption = [];
        this.trasitionPackNos = {};
     }

     /** VL903-1114 START *********************************************************************************************************************************************************************/
    
    /**
     * 將 電訪結果值 放入 localstorage
     * @param teleResultAreaSelectAnsObj 
     * VL903-1114
     */
    @Mutation
    putTeleResultAreaSelectAns(teleResultAreaSelectAnsObj:any){
        if(teleResultAreaSelectAnsObj != null && teleResultAreaSelectAnsObj != undefined && teleResultAreaSelectAnsObj != ""){
            this.teleResultAreaSelectAns = [];
            teleResultAreaSelectAnsObj.forEach((each:any)=>{
                this.teleResultAreaEachSelectAns = {
                    caseNo:each.caseNo,
                    selectedContRes: !ValidationUtil.isEmpty(each.selectedContRes) && each.selectedContRes !== "0" ?  each.selectedContRes :  null,
                    selectedTeleRes: !ValidationUtil.isEmpty(each.selectedTeleRes) && each.selectedTeleRes !== "0" ?  each.selectedTeleRes :  null,
                    selectedCaseClosedReason: !ValidationUtil.isEmpty(each.selectedCaseClosedReason) && each.selectedCaseClosedReason !== "0" ?  each.selectedCaseClosedReason :  null,
                    // VL903-1291 M+ 儲存後需顯示
                    mplusShow: !ValidationUtil.isEmpty(each.mplusShow) ? each.mplusShow : false,
                    mplusChecked: !ValidationUtil.isEmpty(each.mplusChecked) ? each.mplusChecked : false,
                    mplusMsg: !ValidationUtil.isEmpty(each.mplusMsg) ? each.mplusMsg : null,
                    
                };
                
                this.teleResultAreaSelectAns.push(this.teleResultAreaEachSelectAns);
            });
            localStorage.setItem(this.TELE_RESULT_AREA_ANS, JSON.stringify(this.teleResultAreaSelectAns));
        }else{
            localStorage.setItem(this.TELE_RESULT_AREA_ANS, null);
        }
    }
    
    /**
     * 更新 電訪結果值 localstorage
     * @param teleResultAreaSelectAnsObj 
     * VL903-1114
     */
    @Mutation
    updateTeleResultAreaSelectAns(teleResultAreaSelectAnsObj:any){
        teleResultAreaSelectAnsObj.forEach((each:any)=>{

            this.teleResultAreaSelectAns.some((eachTeleResultAreaSelectAns)=>{
                if(eachTeleResultAreaSelectAns.caseNo == each.caseNo){
                    eachTeleResultAreaSelectAns.selectedContRes = each.selectedContRes;
                    eachTeleResultAreaSelectAns.selectedTeleRes = each.selectedTeleRes;
                    eachTeleResultAreaSelectAns.selectedCaseClosedReason = each.selectedCaseClosedReason;
                    // VL903-1291 M+ 儲存後需顯示
                    eachTeleResultAreaSelectAns.mplusShow = each.mplusShow;
                    eachTeleResultAreaSelectAns.mplusChecked = each.mplusChecked;
                    eachTeleResultAreaSelectAns.mplusMsg = each.mplusMsg;
                }
            });

            localStorage.setItem(this.TELE_RESULT_AREA_ANS, JSON.stringify(this.teleResultAreaSelectAns));
        });
    }
    
    /**
     * 清除 電訪結果值 vuex & localStorage
     * VL903-1114
     */
    @Mutation
    clearTeleResultAreaSelectAns(){
        localStorage.removeItem(this.TELE_RESULT_AREA_ANS);
        this.teleResultAreaSelectAns = [];
        this.teleResultAreaEachSelectAns = {};
    }
    /** VL903-1114 END *********************************************************************************************************************************************************************/

    /**
     * 儲存電訪結果方便聯絡時間 畫面暫存
     * VL903-1129 STRAT
     ************************************************************************************************/
    /**
     * 將電訪結果方便聯絡時間儲存至 localStorage
     * @param teleResultAreaContactAns 
     */
    @Mutation
    putTeleResultAreaContactAns(teleResultAreaContactAns:any){
        this.teleResultAreaContactAns = teleResultAreaContactAns;
        localStorage.setItem(this.TELE_RESULT_AREA_CONTACT_ANS, JSON.stringify(teleResultAreaContactAns));
    }

    /**
     * 清除 電訪結果之方便聯絡時間 vuex & localStorage
     */
    @Mutation
    clearTeleResultAreaContactAns(){
        localStorage.removeItem(this.TELE_RESULT_AREA_CONTACT_ANS);
        this.teleResultAreaContactAns = {};
        this.teleResultAreaContactAnsObj = {};
    }
    /* VL903-1129 END***********************************************************************************************/

}

export const PackMatchModule = getModule(PackMatchStoreModule);