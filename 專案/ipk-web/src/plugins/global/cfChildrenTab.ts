import Vue from 'vue';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
	interface Vue {
		$cfChildrenTab: GlobalCfChildrenTab;
	}
}

// 子頁籤對應key值
export class GlobalCfChildrenTab extends Vue {
	public childrenTab = {
		DATA_INFO_TAB: { key: '資料明細', val: 'dataInfoTab' },
		PENDING_INFO_TAB: { key: '待放行清單', val: 'pendingInfoTab' },
		FOREIGN_EQUITY_TAB: { key: '國外股票', val: 'foreignEquityTab' },
		DOMESTIC_EQUITY_TAB: { key: '國內股票', val: 'domesticEquityTab' },
		FOREIGN_FUND_TAB: { key: '國外基金', val: 'foreignFundTab' },
		DOMESTIC_FUND_TAB: { key: '國內基金', val: 'domesticFunfTab' },
		NON_STRUCTURE_TAB: { key: '國外債_非結構債', val: 'nonstructuredTab' },
		STRUCTURE_TAB: { key: '國外債_結構債', val: 'structuredTab' },
		EXCHANGE_TENDER_OFFER_TAB: { key: '國外債_換券、Tender Offer', val: 'exchangeTenderOfferTab' },
		DOMESTIC_BOND_TAB: { key: '國內債', val: 'domesticBondTab' },

	}

	// ---------------------func-------------------------------

	/**
	 * @summary 判斷空值
	*/
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

	public install(Vue) {
		Vue.prototype.$cfChildrenTab = this;
	}
}

export default new GlobalCfChildrenTab();
