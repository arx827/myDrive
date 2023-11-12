import VlidationUtil from '@/assets/config/ValidationUtil';
import { store } from '@/plugins/store';
import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators';


export interface ContinuePackInfoModel {
    detailInfo: ContinuePackDetail[];
}

export interface ContinuePackDetail {
    //名單編號
    packNo: string,
    //是否在本次儲存過方便連絡時段 true:是 / false:否
    isSavedVisitData: boolean
}

/**
 * @description 所有跟件否有儲存方便連絡時段資訊
 * @param packNoList 所有名單(主名單+所有跟件)編號清單 
 * @version 2022/05/25
 * @author B1683
 */
@Module({ dynamic: true, namespaced: true, store, name: 'ContinuePackMoudle' })
export default class ContinuePackStoreMoudle extends VuexModule {
    
    continuePackInfo$ : ContinuePackInfoModel = {
        detailInfo : []
    };

    //初始化
    @MutationAction({ mutate: ['continuePackInfo$'] })
    async initContinuePackInfo() {
        //存放至localStorage
        localStorage.setItem("continuePackInfo", JSON.stringify({detailInfo: []}));
        return {
            continuePackInfo$: {detailInfo: []}
        }
    }

    //更新
    @MutationAction({ mutate: ['continuePackInfo$'] })
    async updateContinuePackInfo(continuePackInfo) {
        //存放至localStorage
        localStorage.setItem("continuePackInfo", JSON.stringify(continuePackInfo));
        return {
            continuePackInfo$: continuePackInfo
        }
    }

    //取得
    get continuePackInfo(): ContinuePackInfoModel {
        const targetContinuePackInfo = this.continuePackInfo$;
        if (targetContinuePackInfo) {
            return targetContinuePackInfo;
        }
        const matched = localStorage.getItem("continuePackInfo");
        if (matched) {
            return JSON.parse(matched);
        }
        return null;
    }
}

export const ContinuePackMoudle = getModule(ContinuePackStoreMoudle);