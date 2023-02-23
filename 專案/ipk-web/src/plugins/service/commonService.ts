import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';
import store from '@/store/index';
import { TxCodeDto } from '@fubonlife/ipk-api-axios-sdk';

declare module 'vue/types/vue' {
  interface Vue {
      $commonService: CommonService;
  }
}

export class CommonService extends Vue {
		/**
	 * @summary 查詢成交資訊明細比較前後差異
   * @param {TxCodeArrayDto} dto
   * @param {string} apiController: API名稱
	*/
	public async searchDetailDifferent(dto: TxCodeDto, apiController: string) {
		let data: any = {};
    store.dispatch('setLoading', true);
		await	Vue.prototype[apiController].searchDetailDifferentUsingPOST(dto)
		.then((res) => {
      store.dispatch('setLoading', false);
			data = res.data.content;
		})
		.catch((error) => {
			// API失敗
			// InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      store.dispatch('setLoading', false);
		});
		return data;
	}

	// -----------------------------------------------------------------------------------------------------

	public install(Vue) {
  	Vue.prototype.$commonService = this;
	}
}

export default new CommonService();
