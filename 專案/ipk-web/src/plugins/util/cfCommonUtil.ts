import Vue from 'vue';
import InfoModal from '@/plugins/notification/infoModal';
import store from '@/store/index';
import exportUtil from '@/plugins/util/exportUtil';
import { PrintDropDownDto, TxCodeDto } from '@fubonlife/ipk-api-axios-sdk';

declare module 'vue/types/vue' {
  interface Vue {
      $cfCommon: CfCommonService;
  }
}

export class CfCommonService extends Vue {
	/**
	 * @summary 取得待放行筆數
   * @param {string} functionName: 功能名稱
   * @param {boolean} completed: 是否完成(false: 只顯示未放行筆數)
	*/
	public async getCountApplyInfo(functionName: string, completed: boolean) {
    let pendingCount = 0;
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.countApplyInfoUsingPOST({ functionName, completed })
		.then((res) => {
			store.dispatch('setLoading', false);
			pendingCount = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return pendingCount;
	}

	/**
	 * @summary 取得交易確認放行頁籤筆數
   * @param {string} type: 功能名稱
	*/
	public async getCountTxApplyInfo(type: string) {
    let countList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.countTxApplyInfoUsingGET(type)
		.then((res) => {
			store.dispatch('setLoading', false);
			countList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return countList;
	}

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
			data = res.data;
		})
		.catch((error) => {
			// API失敗
			// InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      store.dispatch('setLoading', false);
		});
		return data;
	}

	/**
	 * @summary 下載附件
	 * @param {string} fileId: 流水號
	 * @param {string} fileName: 檔名
	 * @param {string} fileType: 檔案格式
	*/
	public async downloadAttachment(fileId: string, fileName: string, fileType: string) {
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.downloadAttachmentUsingGET(fileId, { responseType: 'blob' })
		.then((res) => {
			store.dispatch('setLoading', false);
			const content = res.data;
      exportUtil.dealDownloadData(content, fileName, fileType);
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
	}

	// --------------------------------------------------下拉選單 start ---------------------------------------------------

	/**
	 * @summary 取得保管機構下拉選單
	*/
	public async getCustodianBankCodeOption() {
    let custodianBankCodeList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchCustodianBankCodeUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			custodianBankCodeList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return custodianBankCodeList;
	}

	/**
	 * @summary 取得幣別下拉選單
	 * @param {Array} excludeList: 要排除的幣別
	*/
	public async getCurrencyOption(excludeList: Array<any>) {
    let currencyList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchCurrencyUsingPOST(excludeList)
		.then((res) => {
			store.dispatch('setLoading', false);
			currencyList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return currencyList;
	}

	/**
	 * @summary 取得銀行下拉選單
	*/
	public async getBankNoOption() {
    let bankNoList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchBankNoUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			bankNoList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return bankNoList;
	}

	/**
	 * @summary 取得市場別下拉選單
	*/
	public async getPsetCodeOption() {
    let psetCodeList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchPsetCodeUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			psetCodeList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return psetCodeList;
	}

	/**
	 * @summary 取得PSET Code下拉選單
	 * @param {string} market
	*/
	public async getPsetByMarketOption(market: string) {
    let psetCodeList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchPsetByMarketUsingGET(market)
		.then((res) => {
			store.dispatch('setLoading', false);
			psetCodeList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return psetCodeList;
	}

	/**
	 * @summary 取得Settlement Location下拉選單
	*/
	public async getLocationOption() {
    let locationList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchLocationUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			locationList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return locationList;
	}

	/**
	 * @summary 取得商品代碼下拉選單
	*/
	public async getProductCodeOption() {
    let productCodeList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchProductCodeUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			productCodeList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return productCodeList;
	}

	/**
	 * @summary 取得國家下拉選單
	*/
	public async getNationOption() {
    let nationList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchNationUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			nationList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return nationList;
	}

	/**
	 * @summary 取得產品別下拉選單
	*/
	public async getProductClassOption() {
    let nationList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchProductClassUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			nationList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return nationList;
	}

	/**
	 * @summary 取得機構編號下拉選單
	*/
	public async getCounterpartyIdOption() {
    let nationList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchCounterpartyIdUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			nationList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return nationList;
	}

	/**
	 * @summary 取得Broker下拉選單
	*/
	public async getBrokerOption() {
    let nationList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchBrokerUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			nationList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return nationList;
	}

	/**
	 * @summary 取得受款人名稱
	*/
	public async getBfAccountName(dto) {
    let accountName = '';
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchBfAccountNameUsingGET(dto)
		.then((res) => {
			store.dispatch('setLoading', false);
			accountName = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return accountName;
	}

	/**
	 * @summary 取得受款銀行名稱
	*/
	public async getBfBankName(dto) {
    let bfBankName = '';
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchBankNameUsingGET(dto)
		.then((res) => {
			store.dispatch('setLoading', false);
			bfBankName = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return bfBankName;
	}

	/**
	 * @summary 依照(券)Market取得cycd
	 * @param {string} market
	*/
	public async getCycdByMarket(market: string) {
    let cycd = '';
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchCycdByMarketUsingGET(market)
		.then((res) => {
			store.dispatch('setLoading', false);
			cycd = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return cycd;
	}

	/**
	 * @summary 取得買賣類別下拉選單
	*/
	public async getBuySellType() {
    let buySellTypeList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchBuySellTypeUsingPOST()
		.then((res) => {
			store.dispatch('setLoading', false);
			buySellTypeList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return buySellTypeList;
	}

	/**
	 * @summary 取得列印下拉選單
	*/
	public async getSearchFile(dto: PrintDropDownDto) {
    let searchFileList = [];
		store.dispatch('setLoading', true);
		await	Vue.prototype.$commonApi.searchFileUsingPOST(dto)
		.then((res) => {
			store.dispatch('setLoading', false);
			searchFileList = res.data.content;
		})
		.catch((error) => {
			store.dispatch('setLoading', false);
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return searchFileList;
	}

	/**
	 * @summary 取得商品群組下拉選單
	*/
	public async getProductGroupOption() {
    let productGroupList = [];
		await	Vue.prototype.$commonApi.searchProductGroupUsingPOST()
		.then((res) => {
			productGroupList = res.data.content;
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return productGroupList;
	}

	/**
	 * @summary 查詢資產類別下拉選單
	 * @param string bondType
	*/
	public async getInvestmentCategoryOption(bondType: string) {
		let searchList = [];
		await	Vue.prototype.$commonApi.searchInvestmentCategoryUsingPOST(bondType)
		.then((res) => {
			searchList = res.data.content;
		})
		.catch((error) => {
			// API失敗
			InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
		});
		return searchList;
	}

	/**
	 * @summary 取得交易對象下拉選單
	*/
  public async getCounterpartyOption() {
		let searchList = [];
    await	Vue.prototype.$commonApi.searchCounterpartyIdUsingPOST()
    .then((res) => {
      searchList = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	/**
	 * @summary 取得債券標的(ISIN)下拉選單
	 * @param string bondType
	*/
  public async getBondIsinOption(bondType?: string) {
		let searchList = [];
    await	Vue.prototype.$commonApi.searchBondIsinUsingPOST(bondType)
    .then((res) => {
      searchList = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	/**
	 * @summary 取得債券保管下拉選單
	*/
  public async getCustodianOption() {
		let searchList = [];
    await	Vue.prototype.$commonApi.searchCustodianUsingPOST()
    .then((res) => {
      searchList = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	/**
	 * @summary 查詢交易對手受款銀行下拉選單
	*/
  public async getCpBfBankOption(dto) {
		let searchList = [];
		store.dispatch('setLoading', true);
    await	Vue.prototype.$commonApi.searchCpBfBankUsingPOST(dto)
    .then((res) => {
			searchList = res.data.content;
			store.dispatch('setLoading', false);
    })
    .catch((error) => {
			store.dispatch('setLoading', false);
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	/**
	 * @summary 查詢交易對手聯絡人下拉選單
	*/
  public async getCounterPartyLicenser(counterpartyId: string) {
		let searchList = [];
		store.dispatch('setLoading', true);
    await	Vue.prototype.$commonApi.searchCounterPartyLicenserUsingPOST(counterpartyId)
    .then((res) => {
      searchList = res.data.content;
			store.dispatch('setLoading', false);
    })
    .catch((error) => {
			store.dispatch('setLoading', false);
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	/**
	 * @summary 查詢出借方式下拉選單
	*/
  public async getSearchLoanMethod() {
		let searchList = [];
		store.dispatch('setLoading', true);
    await	Vue.prototype.$commonApi.searchLoanMethodUsingPOST()
    .then((res) => {
      searchList = res.data.content;
			store.dispatch('setLoading', false);
    })
    .catch((error) => {
			store.dispatch('setLoading', false);
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
		return searchList;
  }

	// --------------------------------------------------下拉選單 end ---------------------------------------------------

	public install(Vue) {
  	Vue.prototype.$cfCommon = this;
	}
}

export default new CfCommonService();
