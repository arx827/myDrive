import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';
import exportUtil from '@/plugins/util/exportUtil';
import moment from 'moment';

declare module 'vue/types/vue' {
	interface Vue {
		$actCommon: ActCommonService;
	}
}

export class ActCommonService extends Vue {
	/**
	 * @summary 取得會計科目資料
	*/
	public async getAccountCodeData() {
		let accountCodeData = {};
		await Vue.prototype.$commonApi.searchAccountCodeDataUsingGET()
			.then((res) => {
				accountCodeData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return accountCodeData;
	}

	/**
	 * @summary 取得會計科目代碼下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getAccountCodeList(isEnabled: boolean) {
		let accountCodeList = [];
		await Vue.prototype.$commonApi.searchAccountCodeUsingGET(isEnabled)
			.then((res) => {
				accountCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return accountCodeList;
	}

	/**
	 * @summary 取得銀行代碼下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getBankCodeList(isEnabled: boolean) {
		let bankCodeList = [];
		await Vue.prototype.$commonApi.searchBankCodeUsingGET(isEnabled)
			.then((res) => {
				bankCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return bankCodeList;
	}

	/**
	 * @summary 取得狀態下拉選單
	*/
	public async getCaseStatusList() {
		let caseStatusList = [];
		await Vue.prototype.$commonApi.searchCaseStatusUsingGET()
			.then((res) => {
				caseStatusList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});

		return caseStatusList;
	}

	/**
	 * @summary 取得投確受款銀行代碼資料
	*/
	public async getCfBfBankCodeData() {
		let cfBfBankCodeData = {};
		await Vue.prototype.$commonApi.searchCfBfBankCodeDataUsingGET()
			.then((res) => {
				cfBfBankCodeData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return cfBfBankCodeData;
	}

	/**
	 * @summary 取得金融商品分類資料
	*/
	public async getFinancialAssetData() {
		let financialAssetData = {};
		await Vue.prototype.$commonApi.searchFinancialAssetDataUsingGET()
			.then((res) => {
				financialAssetData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return financialAssetData;
	}

	/**
	 * @summary 取得金融商品分類代碼下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getFaCodeList(isEnabled: boolean) {
		let faCodeList = [];
		await Vue.prototype.$commonApi.searchFinancialAssetUsingGET(isEnabled)
			.then((res) => {
				faCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return faCodeList;
	}

	/**
	 * @summary 取得ICS分類資料
	*/
	public async getIcsCodeData() {
		let icsCodeData = {};
		await Vue.prototype.$commonApi.searchIcsCodeDataUsingGET()
			.then((res) => {
				icsCodeData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return icsCodeData;
	}

	/**
	 * @summary 取得ICS代號下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getIcsCodeList(isEnabled: boolean) {
		let icsCodeList = [];
		await Vue.prototype.$commonApi.searchIcsCodeUsingGET(isEnabled)
			.then((res) => {
				icsCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return icsCodeList;
	}

	/**
	 * @summary 取得帳本別下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getKbCodeList(isEnabled: boolean) {
		let kbCodeList = [];
		await Vue.prototype.$commonApi.searchKeepBookCodeUsingGET(isEnabled)
			.then((res) => {
				kbCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return kbCodeList;
	}

	/**
	 * @summary 取得NII分類資料
	*/
	public async getNiiCodeData() {
		let niiCodeData = {};
		await Vue.prototype.$commonApi.searchNiiCodeDataUsingGET()
			.then((res) => {
				niiCodeData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return niiCodeData;
	}

	/**
	 * @summary 取得NII代號下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getNiiCodeList(isEnabled: boolean) {
		let niiCodeList = [];
		await Vue.prototype.$commonApi.searchNiiCodeUsingGET(isEnabled)
			.then((res) => {
				niiCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return niiCodeList;
	}

	/**
	 * @summary 取得自操/委外下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getOutsourcingCodeList(isEnabled: boolean) {
		let outsourcingCodeList = [];
		await Vue.prototype.$commonApi.searchOutsourcingCodeUsingGET(isEnabled)
			.then((res) => {
				outsourcingCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return outsourcingCodeList;
	}

	/**
	 * @summary 取得資產區隔代碼下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getPortfolioCodeList(isEnabled: boolean) {
		let portfolioCodeList = [];
		await Vue.prototype.$commonApi.searchPortfolioCodeUsingGET(isEnabled)
			.then((res) => {
				portfolioCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return portfolioCodeList;
	}

	/**
	 * @summary 取得專案編號下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getProjectCodeList(isEnabled: boolean) {
		let projectCodeList = [];
		await Vue.prototype.$commonApi.searchProjectCodeUsingGET(isEnabled)
			.then((res) => {
				projectCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return projectCodeList;
	}

	/**
	 * @summary 取得調節項目下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getRcCodeList(isEnabled: boolean) {
		let rcCodeList = [];
		await Vue.prototype.$commonApi.searchReconciliationCodeUsingGET(isEnabled)
			.then((res) => {
				rcCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return rcCodeList;
	}

	/**
	 * @summary 取得費用單位代號資料
	*/
	public async getSecCodeData() {
		let secCodeData = {};
		await Vue.prototype.$commonApi.searchSecCodeDataUsingGET()
			.then((res) => {
				secCodeData = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return secCodeData;
	}

	/**
	 * @summary 取得費用單位代號下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getSecCodeList(isEnabled: boolean) {
		let secCodeList = [];
		await Vue.prototype.$commonApi.searchSegmentExpenseCodeUsingGET(isEnabled)
			.then((res) => {
				secCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return secCodeList;
	}

	/**
	 * @summary 取得分類代碼下拉選單
	 * @param {boolean} isEnabled:查詢適用中的資料
	*/
	public async getTranInvestCodeList(isEnabled: boolean) {
		let tranInvestCodeList = [];
		await Vue.prototype.$commonApi.searchTranIcMappingUsingGET(isEnabled)
			.then((res) => {
				tranInvestCodeList = res.data.content;
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
		return tranInvestCodeList;
	}

	/**
	 * @summary 下載錯誤excel
	 * @param {string} serialNo:流水號
	 * @param {string} fileName:檔名
	*/
	public async downloadErrorExcelUsingPOST(serialNo: string, fileName: string) {
		await Vue.prototype.$commonApi.downloadErrorExcelUsingPOST(serialNo, { responseType: 'blob' })
			.then((res) => {
				const content = res.data;
				exportUtil.dealDownloadData(content, `${fileName}__${moment(new Date()).format('YYYYMMDDHHmmss')}`, 'xlsx');
			})
			.catch(() => {
				// API失敗
				InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
			});
	}

	public install(Vue) {
		Vue.prototype.$actCommon = this;
	}
}

export default new ActCommonService();
