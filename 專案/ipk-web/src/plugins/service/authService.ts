import Vue from 'vue';
import validateUtil from '@/plugins/util/validateUtil';
import store from '@/store/index';
import InfoModal from '@/plugins/notification/infoModal';

declare module 'vue/types/vue' {
  interface Vue {
      $authService: AuthService;
  }
}

export class AuthService extends Vue {
	// 子頁籤對應key值
	// public childrenTab = {
	// 	DATA_INFO_TAB: { key: '資料明細', val: 'dataInfoTab' },
	// 	PENDING_INFO_TAB: { key: '待放行清單', val: 'pendingInfoTab' },
	// 	EXPORT_TAB: { key: '匯入傳票', val: 'exportTab' },
	// 	BATCH_SETTING_TAB: { key: '批次設定', val: 'batchSettingTab' },
	// 	BATCH_LOG_TAB: { key: '批次紀錄', val: 'batchLogTab' },
	// }

  /** 彈窗頁籤資訊 */
	mainTab = { label: '前台成交資訊', key: 'main' };

	otherTab = { label: '其他成交資訊', key: 'other' };

	ssiTab = { label: '收付款資訊', key: 'ssi' };

	attachmentTab = { label: '上傳附件', key: 'attachment' };

	// 按鈕對應key值
	public buttonKey = {}

	// 訊息通知頁籤設定(因為不在menu中，因此設定於此)
	public myNoticeTabSetting = {
		breadCrumb: '首頁/訊息通知',
		children: null,
		data: {},
		disabled: null,
		icon: '',
		key: '1',
		level: 2,
		route: 'my-notice',
		title: '訊息通知',
		uri: null,
	}

	/**
	 * @summary 依照功能權限判斷子頁籤顯示邏輯
	 * @param {string} routerName: 路徑名稱
	*/
	public getAuthInfo(routerName: string): any {
		if (!this.isEmpty(store.getters) && !this.isEmpty(store.getters.getMenuItem)) {
			return this.toMenuItem(store.getters.getMenuItem, routerName);
		}
	}

	/**
	 * @summary 判斷各個功能頁面按鈕權限
	 * @param {string} routerName: 路徑名稱
	 * @param {any} activeChildrenTab: 目前指向哪個子頁籤(有些頁面無子頁籤)
	 * @param {string} buttonKey: 點擊按鈕的key值
	*/
	public getButtonsAuthInfo(routerName: string, activeChildrenTab: any, buttonKey: string): any {
		let validate = { byPass: false, message: '無此按鈕權限。' };

		if (!this.isEmpty(store.getters) && !this.isEmpty(store.getters.getMenuItem)) {
			// 取得頁籤or按鈕群
			const tabOrButtons = this.toMenuItem(store.getters.getMenuItem, routerName);
			if (!this.isEmpty(tabOrButtons)) {
				const buttons = Array.isArray(tabOrButtons) ? tabOrButtons : tabOrButtons[activeChildrenTab];
				if (!this.isEmpty(buttons)) {
					for (let i = 0; i < buttons.length; i++) {
						if (buttons[i].actionCode === buttonKey) {
							validate = { byPass: true, message: '' };
							break;
						}
					}
				}
			}
		}
		return validate;
	}

	/**
	 * @summary 取得對應路徑名稱的頁籤及按鈕權限
	 * @param {any} menuNode: menu API回傳的選單資訊
	 * @param {string} routerName: 路徑名稱
	*/
	toMenuItem(menuNode: any, routerName: string): any {
		const item = menuNode.item;

		if (item && routerName === item.route) {
			// 因有些功能無子頁籤，故直接取得按鈕
			return item.tab ? item.tab : item.action;
		}
		for (let i = 0; i < menuNode.children.length; i++) {
			let menuItem = this.toMenuItem(menuNode.children[i], routerName);
			if (!this.isEmpty(menuItem)) {
				return menuItem;
			}
		}
	}

	/**
	 * @summary 取得初始顯示的子頁籤
	 * @param {Array<string>} currentPageTabList 當前頁面的頁籤清單
	 * @param {Array<string>} authInfoTabKeys 權限資訊中的頁籤名稱清單
	 * @returns {string} 預設選擇的頁籤Key值
	 */
	getDefaultActiveTabKey(currentPageTabList: Array<string>, authInfoTabKeys: Array<string>): string {
		// 若有預設選定的頁籤則優先取用，取用後清空
		const specifyTab = store.getters.getActiveSubTab;
		if (specifyTab && currentPageTabList.includes(specifyTab)) {
			const subTabKey = specifyTab;
			store.dispatch('setActiveSubTab', '');
			return subTabKey;
		}
		const tabIndexList = authInfoTabKeys.map((tab) => currentPageTabList.indexOf(tab)).filter((index) => index > -1);
		return currentPageTabList[Math.min(...tabIndexList)];
	}

	/**
	 * @summary 判斷空值
	*/
	isEmpty(data: any) {
		return validateUtil.isEmpty(data);
	}

	public install(Vue) {
		Vue.prototype.$authService = this;
	}
}

export default new AuthService();
