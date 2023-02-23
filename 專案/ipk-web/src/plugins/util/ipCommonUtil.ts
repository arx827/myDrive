import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';

declare module 'vue/types/vue' {
	interface Vue {
		$ipCommon: IpCommonService;
	}
}

export class IpCommonService extends Vue {
	/**
	* @summary 取得ipIaNewFwdTran_衍商到期損益報表資料
	*/
	public async getIpIaNewFwdTranReportData() {
		let ipIaNewFwdTranData = {};
		await Vue.prototype.$commonApi.searchIpIaNewFwdTranReportDataUsingGET()
			.then((res) => {
				ipIaNewFwdTranData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return ipIaNewFwdTranData;
	}

	/**
	* @summary 取得ipTrans_交易報表資料
	*/
	public async getIpTransReportData() {
		let ipTransReportData = {};
		await Vue.prototype.$commonApi.searchIpTransReportDataUsingGET()
			.then((res) => {
				ipTransReportData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return ipTransReportData;
	}

	/**
	* @summary 取得ipDetail_庫存報表資料
	*/
	public async getIpDetailReportData() {
		let ipDetailReportData = {};
		await Vue.prototype.$commonApi.searchIpDetailReportDataUsingGET()
			.then((res) => {
				ipDetailReportData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return ipDetailReportData;
	}

	public install(Vue) {
		Vue.prototype.$ipCommon = this;
	}
}

export default new IpCommonService();
