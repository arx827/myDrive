import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';

@Module({ namespaced: true })
class ModalControl extends VuexModule {
	// ----------------- modal ----------------- //
	modalState = {
		// 結果_彈窗
		resultModal: {
			visible: false,
			type: '',
			title: '',
			content: '',
			contentHtml: '',
			autoClose: null,
			width: 'md',
		},
	}

	// 初始化參數
	initState = {
		// 結果_彈窗
		resultModal: {
			visible: false,
			type: '',
			title: '',
			content: '',
			contentHtml: '',
			autoClose: null,
			width: 'md',
		},
	}

	// 取得 結果_彈窗 資料
	get getResultModal() {
		return this.modalState.resultModal;
	}

	@Mutation
	SET_MODALSTATE(payload) {
		Object.keys(payload).map((i) => {
			Object.keys(this.modalState[i]).map((j) => {
				if (payload[i][j] !== undefined) {
					this.modalState[i][j] = payload[i][j];
				}
			});
		});
	}

	/**
	 * 設定彈窗參數
	 * @param payload 傳送參數 Object
	 * payload 參數說明
	 * 	{
				resultModal: {								// 要更改的彈窗名稱 (keyName)
					visible: true,							// 彈窗顯示/隱藏
					type: 'error',							// icon type
					title: '設定認列組別失敗',		 // 標題名稱
					autoClose: 3								// 自動關閉秒數，若不自動關閉，可用不傳送
				},
			};
	 */
	@Action
	setModalState(payload) {
		this.context.commit('SET_MODALSTATE', payload);
	}

	@Mutation
	CLOSEMODAL(payload) {
		// 初始化 所有props 資料
		Object.keys(this.modalState[payload]).map((i) => {
			this.modalState[payload][i] = this.initState[payload][i];
		});
	}

	@Action
	closeModal(payload) {
		this.context.commit('CLOSEMODAL', payload);
	}
}

export default ModalControl;
