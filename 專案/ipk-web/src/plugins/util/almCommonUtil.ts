import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';

declare module 'vue/types/vue' {
  interface Vue {
    $almCommon: AlmCommonService;
  }
}

export class AlmCommonService extends Vue {
  /**
   * @summary 取得金融資產細項表資料
  */
  public async getAlmMonetaryAssetsData() {
    let almMonetaryAssetsData = {};
    await Vue.prototype.$commonApi.searchAlmMonetaryAssetsDataUsingGET()
      .then((res) => {
        almMonetaryAssetsData = res.data.content;
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return almMonetaryAssetsData;
  }

  /**
   * @summary 取得總帳系統細項表資料
  */
  public async getAlmGeneralLedgerData() {
    let almGeneralLedgerData = {};
    await Vue.prototype.$commonApi.searchAlmGeneralLedgerDataUsingGET()
      .then((res) => {
        almGeneralLedgerData = res.data.content;
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return almGeneralLedgerData;
  }

  public install(Vue) {
    Vue.prototype.$almCommon = this;
  }
}

export default new AlmCommonService();
