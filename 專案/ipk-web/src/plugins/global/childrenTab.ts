import Vue from 'vue';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
	interface Vue {
		$childrenTab: GlobalChildrenTab;
	}
}

// 子頁籤對應key值
export class GlobalChildrenTab extends Vue {
  // 子頁籤對應key值
	public childrenTab = {
		DATA_INFO_TAB: { key: '資料明細', val: 'dataInfoTab' },
		PENDING_INFO_TAB: { key: '待放行清單', val: 'pendingInfoTab' },
    IMPORT_TAB: { key: '匯入傳票', val: 'importTab' },
		EXPORT_TAB: { key: '匯出傳票', val: 'exportTab' },
		BATCH_SETTING_TAB: { key: '批次設定', val: 'batchSettingTab' },
		BATCH_LOG_TAB: { key: '批次紀錄', val: 'batchLogTab' },
		NOTICE: { key: '訊息通知', val: 'notice' },
		TO_DO_LIST: { key: '待辦事項', val: 'todoList' },
		REPORT_SETUP_TAB: { key: '報表產檔', val: 'reportSetupTab' },
		REPORT_DOWNLOAD_TAB: { key: '報表下載', val: 'reportDownloadTab' },
		DAILY_DATA_INFO_TAB: { key: '日結資料明細', val: 'dailyDataInfoTab' },
		MONTH_DATA_INFO_TAB: { key: '月結資料明細', val: 'monthDataInfoTab' },
	}

	// ---------------------func-------------------------------

	/**
	 * @summary 判斷空值
	*/
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

	public install(Vue) {
		Vue.prototype.$childrenTab = this;
	}
}

export default new GlobalChildrenTab();
