import Vue from 'vue';
import validateUtil from '@/plugins/util/validateUtil';

declare module 'vue/types/vue' {
	interface Vue {
		$cfButtonKey: GlobalCfButtonKey;
	}
}

// 按鈕權限對應key值
export class GlobalCfButtonKey extends Vue {
	public buttonKey = {
		SEARCH: { key: '查詢', val: 'search' },
		UPLOAD: { key: '上傳', val: 'upload' },
		ADD: { key: '新增', val: 'add' },
		MODIFY: { key: '修改', val: 'modify' },
		// COPY: { key: '複製新增', val: 'copy' },
		REMOVE: { key: '刪除', val: 'remove' },
		DOWNLOAD: { key: '下載', val: 'download' },
		REVIEW: { key: '覆核', val: 'review' },
		SAVE: { key: '儲存', val: 'save' },
		GENERATE: { key: '產檔、列印', val: 'generate' },
	}

  // ---------------------func-------------------------------

	/**
	 * @summary 判斷空值
	*/
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

	public install(Vue) {
		Vue.prototype.$cfButtonKey = this;
	}
}

export default new GlobalCfButtonKey();
