import { store } from '@/plugins/store';
import { getModule, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators';
import VlidationUtil from "@/assets/config/ValidationUtil";
import { CallupResult } from "@/components/shared/notificationMadal/model"

@Module({ dynamic: true, namespaced: true, store, name: 'CallUpAgentCantactPersonModule' })
export default class CallUpAgentCantactPersonModule extends VuexModule {

    // 聯絡對象資訊
    _agentPersonInfo = [];

    // 有撥號資訊
    _allAgentCallupInfo = [];

    // 該儲存有儲存
    _shouldSaveIsSave: boolean = true;

    // 該發送有發送
    _shouldSendIsSend: boolean = true;

    get agentPersonInfo() {
        return this._agentPersonInfo;
    }

    get allAgentCallupInfo() {
        return this._allAgentCallupInfo;
    }

    get isShouldSaveIsSave() {
        return this._shouldSaveIsSave;
    }

    get isShouldSendIsSend() {
        return this._shouldSendIsSend;
    }

    /**
     * @description 驗證有撥號是否有選取聯絡結果與細項
     * 
     * @author B1529
     * @version 2022/10/04
     */
    get validateContactInfo() {

        const result = {
            success: true,
            errMsg: []
        };
        const callupInfo = this.agentPersonInfo;

        if (!VlidationUtil.isEmpty(callupInfo)) {
            callupInfo.forEach(callup => {

                // 有撥號
                if (!VlidationUtil.isEmpty(callup.codingNo)) {

                    // 撥號結果必填
                    if (VlidationUtil.isEmpty(callup.callUpResult)) {
                        result.errMsg.push(callup.phoneNo + ' : 撥號結果必填!'); //  : 撥號結果必填!
                    }
                    // 非本人接聽、無此人、本人接聽、本人接聽-忙碌 聯絡結果必填
                    else if (Object.values(CallupResult).includes(callup.callUpResult)
                        && (VlidationUtil.isEmpty(callup.contactResult) || VlidationUtil.isEmpty(callup.contactDetail))) {
                        result.errMsg.push(callup.phoneNo + ' : 聯絡結果與聯絡細項必填!'); //  : 聯絡結果與聯絡細項必填!
                    }
                }
            });

            if (!VlidationUtil.isEmpty(result.errMsg)) {
                result.success = false;
            }
        }

        return result;
    }

    @Mutation
    setShouldSaveIsSave(isSave: boolean) {
        this._shouldSaveIsSave = isSave;
    }

    @Mutation
    setShouldSendIsSend(isSend: boolean) {
        this._shouldSendIsSend = isSend;
    }

    /**
     * @description 更新聯繫業務員-聯絡對象資訊
     * @param data 
     * 
     * @author B1529
     * @version 2022/10/04
     */
    @Mutation
    putAgentPerInfo(data: Array<any>) {
        this._agentPersonInfo = data;
    }

    /**
     * @description 暫存已撥號結果資訊
     * @param data 
     * 
     * @author B1529
     * @version 2022/10/04
     */
    @Mutation
    putAgentCallUpInfo(data) {

        let agentCallup = this._allAgentCallupInfo.find(callupInfo => callupInfo.codingNo == data.codingNo);

        if (!VlidationUtil.isEmpty(agentCallup)) {

            agentCallup.callUpResult = data.callUpResult;
            agentCallup.contactResult = data.contactResult;
            agentCallup.contactDetail = data.contactDetail;
            agentCallup.callUpRemark = data.callUpRemark;

        } else {
            this._allAgentCallupInfo.push(data);
        }

    }

    /**
     * 重置撥號狀態
     */
    @Mutation
    resetAll() {
        // 聯絡對象資訊
        this._agentPersonInfo = [];

        // 有撥號資訊
        this._allAgentCallupInfo = [];

        // 該儲存有儲存
        this._shouldSaveIsSave = true;

        // 該發送有發送
        this._shouldSendIsSend = true;
    }
}

export const AgentPersonModule = getModule(CallUpAgentCantactPersonModule);