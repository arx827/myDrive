import Vue from 'vue';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
	interface Vue {
		$buttonKey: GlobalButtonKey;
	}
}

// 按鈕對應key值
export class GlobalButtonKey extends Vue {
	public buttonKey = {
		SEARCH: { key: '查詢', val: 'search' },
		UPLOAD: { key: '上傳', val: 'upload' },
		ADD: { key: '新增', val: 'add' },
		MODIFY: { key: '修改', val: 'modify' },
		STOP: { key: '停用', val: 'stop' },
		COPY: { key: '複製新增', val: 'copy' },
		REMOVE: { key: '刪除', val: 'remove' },
		DOWNLOAD: { key: '下載', val: 'download' },
		REVIEW: { key: '覆核', val: 'review' },
		EXECUTE: { key: '執行批次', val: 'execute' },
		REPORT_SETUP: { key: '產檔', val: 'reportSetup' },
		SEND: { key: '發送全體通知', val: 'send' },
		ENABLE: { key: '啟用', val: 'enable' },
		DISABLE: { key: '停用', val: 'disable' },
		CANCEL: { key: '取消排程下載區資料', val: 'cancel' },
	}

  // ---------------------func-------------------------------

	/**
	 * @summary 判斷空值
	*/
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

	public install(Vue) {
		Vue.prototype.$buttonKey = this;
	}
}

export default new GlobalButtonKey();
