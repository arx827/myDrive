import { store } from '@/plugins/store';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import {CasePackTelephoneListDto} from '@fubonlife/obd-api-axios-sdk';

export interface CallUpModel {
    codingNo: string,
    sessionId: string,
    previousCodingNoList: string[] //本次撥號的流水號清單 續訪驗證用
}

@Module({ dynamic: true, namespaced: true, store, name: 'CallUpInfoModule' })
export default class CallUpInfoModule extends VuexModule {

    _callUpInfo: CallUpModel = {
        codingNo: "",
        sessionId: "",
        previousCodingNoList: []
    }
    // VL903-1114 
    _currentCallUpData = [];

    // 從local Storage取得codingNo和sessionId
    get callUpInfo() {
        return this._callUpInfo;
    }

    /**
     * 取得 vuex 撥號面板當前撥號資訊
     * VL903-1114 
     */
    get currCallUpData(){
        return this._currentCallUpData;
    }

    // 設定codingNo和sessionId到local Storage
    @Mutation
    setCallUpInfo(callUpInfoSet: CallUpModel) {
        this._callUpInfo.codingNo = callUpInfoSet.codingNo;
        this._callUpInfo.sessionId = callUpInfoSet.sessionId;
        this._callUpInfo.previousCodingNoList = callUpInfoSet.previousCodingNoList;
        localStorage.setItem("callUpInfo", JSON.stringify(this._callUpInfo));
    }

    /**
     * 帶入撥號面板當前撥號資訊給到 vuex
     * @param currCasePackTelePhoneList 
     * VL903-1114
     */
    @Mutation
    putCurrentCallUpData(currCasePackTelePhoneList:CasePackTelephoneListDto[]){
        this._currentCallUpData = Object.assign(currCasePackTelePhoneList);
    }
    /**
     * 清除 撥號面板當前撥號資訊
     */
    @Mutation
    clearCurrentCallUpData(){
        this._currentCallUpData = [];
    }

}

export const callUpInfoModule = getModule(CallUpInfoModule);