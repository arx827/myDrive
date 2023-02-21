import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';

@Module({ namespaced: true })
class crawlerDataDetail extends VuexModule {
	// ----------------- detailData ----------------- //
	detailData = {
		crawlerData: {
			caseType: {},
			confirmStatusVO: {},
			confrimUser: '',
			content: '',
			crawlerDataId: '',
			dataGroupId: '',
			fileName: '',
			groupStatus: '',
			pageUrl: '',
			releaseDate: '',
			subject: '',
			updateDatetime: '',
		},
		claimGroup: [],
		dataRelVOS: [],
		relProcess_1: [],			// 年度稽核計畫
		relProcess_2: [],			// 查核行前規劃
	}

	// 備份原始資料
	backup = {
		relProcess_1: [],
		relProcess_2: [],
	}

	update = {
		relProcess: false,
	}

	checkValidation = {
		view1: [],
		view2: [],
		view3: false,
		view4: false,
		view5: false,
	}

	get getDetailData() {
		return this.detailData.crawlerData;
	}

	// 組成通過/退回格式
	get getConfirmData() {
		return {
			agree: true,				// 通過/退回	(依按鈕)
			crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
			dataRelVO: [...this.detailData.relProcess_1.filter((j) => j.operate === 'add'), ...this.detailData.relProcess_2.filter((j) => j.operate === 'add')],
			remark: '',		// 傋註 (退回id)
			roleId: '',		// 申請角色 (登入者角色id)}
		};
		// return {
		// 	agree: true,				// 通過/退回	(依按鈕)
		// 	crawlerDataId: 'f3a19276-b36d-4409-8a59-0b5956307547',	// crawler ID (查詢資料明細API)
		// 	dataRelVOS: [
		// 		{
		// 			auditItem: '1378b776-2c86-4a6b-9c03-e94883345d07',		// 查核項目代碼	(查核項目API)
		// 			dataGroupId: 'efc86903-f41a-4563-9d24-cf958a58375c',	// DATA_GROUP主鍵 (查核項目子項API)
		// 			dataGroupLogId: '4d08a8d7-5576-4430-9e4d-e38a45aad97c',	// DATA_GROUP_LOG主鍵 (查核項目子項API)
		// 			dataRelId: '',	// DATA_REL主鍵
		// 			operate: 'modify',	// 操作 add, delete, modify
		// 			relContent: {
		// 				article: '1',	// 條
		// 				content: '2',	// 內容
		// 				item: '3',	// 目
		// 				paragraph: '4',	// 項
		// 				subparagraph: '5',	// 款
		// 			},
		// 			relId: '',	// 關聯主鍵 (查核項目子項API)
		// 			relItem: '',	// 關聯項目 (查核項目子項API)
		// 			relProcess: '1',	// 關聯流程 (1:年度稽核計畫、2:查核行前規劃、3:工作底稿)
		// 		},
		// 	],
		// 	remark: '',		// 傋註 (退回id)
		// 	roleId: '',		// 申請角色 (登入者角色id)}
		// };
		// return {
		// 	agree: true,				// 通過/退回	(依按鈕)
		// 	crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
		// 	dataRelVOS: [
		// 		{
		// 			auditItem: 'string',		// 查核項目代碼	(查核項目API)
		// 			dataGroupId: 'string',	// DATA_GROUP主鍵 (查核項目子項API)
		// 			dataGroupLogId: 'string',	// DATA_GROUP_LOG主鍵 (查核項目子項API)
		// 			dataRelId: 'string',	// DATA_REL主鍵
		// 			operate: 'add',	// 操作 add, delete, modify
		// 			relContent: {
		// 				article: 'string',	// 條
		// 				content: 'string',	// 內容
		// 				item: 'string',	// 目
		// 				paragraph: 'string',	// 項
		// 				subparagraph: 'string',	// 款
		// 			},
		// 			relId: 'string',	// 關聯主鍵 (查核項目子項API)
		// 			relItem: 'string',	// 關聯項目 (查核項目子項API)
		// 			relProcess: '1',	// 關聯流程 (1:年度稽核計畫、2:查核行前規劃、3:工作底稿)
		// 		},
		// 	],
		// 	remark: 'string',		// 傋註 (退回id)
		// 	roleId: 'string',		// 申請角色 (登入者角色id)}
		// };
	}

	// 組成送出覆核格式
	get getSubmitData() {
		return {
			caseType: Object.keys(this.detailData.crawlerData.caseType)[0],	// 案件類型
			crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
			dataGroupId: this.detailData.crawlerData.dataGroupId,	// 資料認列組別主鍵
			dataRelVO: [...this.detailData.relProcess_1.filter((j) => j.operate === 'add'), ...this.detailData.relProcess_2.filter((j) => j.operate === 'add')],
		};
		// return {
		// 	caseType: 'A',
		// 	crawlerDataId: 'f3a19276-b36d-4409-8a59-0b5956307547',
		// 	dataGroupId: 'efc86903-f41a-4563-9d24-cf958a58375c',
		// 	dataRelVO: [
		// 		{
		// 			auditItem: 'D',
		// 			dataGroupId: 'efc86903-f41a-4563-9d24-cf958a58375c',
		// 			dataGroupLogId: '4d08a8d7-5576-4430-9e4d-e38a45aad97c',
		// 			dataRelId: '',
		// 			operate: 'add',
		// 			relContent: {
		// 				article: '1',
		// 				content: '2',
		// 				item: '3',
		// 				paragraph: '4',
		// 				subparagraph: '5',
		// 			},
		// 			relId: '',
		// 			relItem: '1378b776-2c86-4a6b-9c03-e94883345d07',
		// 			relProcess: '1',
		// 		},
		// 	],
		// };
	}

	// 組成暫存格式
	get getSaveData() {
		return {
			caseType: Object.keys(this.detailData.crawlerData.caseType)[0],	// 案件類型
			crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
			dataGroupId: this.detailData.crawlerData.dataGroupId,	// 資料認列組別主鍵
			dataRelVO: [...this.detailData.relProcess_1.filter((j) => j.operate === 'add'), ...this.detailData.relProcess_2.filter((j) => j.operate === 'add')],
		};
		// return {
		// 	caseType: 'A',
		// 	crawlerDataId: 'f3a19276-b36d-4409-8a59-0b5956307547',
		// 	dataGroupId: 'efc86903-f41a-4563-9d24-cf958a58375c',
		// 	dataRelVO: [
		// 		{
		// 			auditItem: 'D',
		// 			dataGroupId: 'efc86903-f41a-4563-9d24-cf958a58375c',
		// 			dataGroupLogId: '4d08a8d7-5576-4430-9e4d-e38a45aad97c',
		// 			dataRelId: '',
		// 			operate: 'add',
		// 			relContent: {
		// 				article: '1',
		// 				content: '2',
		// 				item: '3',
		// 				paragraph: '4',
		// 				subparagraph: '5',
		// 			},
		// 			relId: '',
		// 			relItem: '1378b776-2c86-4a6b-9c03-e94883345d07',
		// 			relProcess: '1',
		// 		},
		// 	],
		// };
	}

	// 取得更新狀態
	get getUpdate() {
		return this.update;
	}

	get getRelProcess_1() {
		return this.detailData.relProcess_1;
	}

	get getRelProcess_2() {
		return this.detailData.relProcess_2;
	}

	get getCheckValidation() {
		return this.checkValidation;
	}

	@Mutation
	SET_DETAILDATA(payload) {
		Object.keys(payload).map((i) => {
			Object.keys(this.detailData).map((j) => {
				if (payload[j] !== undefined && i === j) {
					// TODO: 先略過，新增儲存項目，就清空刷新， 雙向綁定會跑掉
					// // 查核項目內容另外處理
					// if (new RegExp('relProcess*').test(j)) {
					// 	// 已經在Vuex中的項目 不覆蓋
					// 	const oldAuditItem = this.detailData[j].map((i) => i.auditItem);
					// 	payload[j].map((k, kindx) => {
					// 		if (!oldAuditItem.includes(k.auditItem)) {
					// 			// this.detailData[j][kindx] = payload[i][kindx];
					// 			this.detailData[j].assign(payload[j]);
					// 		}
					// 	});
					// } else {
					this.detailData[j] = payload[j];
					// }
				}
			});
		});
		// TEST:
		// console.log('detailData', this.detailData);
	}

	@Action
	setDetailData(payload) {
		this.context.commit('SET_DETAILDATA', payload);
	}

	@Mutation
	SET_RELPROCESS(payload) {
		Object.keys(payload).map((i) => { // relProcess_1 / relProcess_2
			// 目前有的資料 auditItem Arr
			const oldAuditItemArr = this.detailData[i].map((j) => j.auditItem);
			payload[i].map((k) => {
				// 若不在原始資料中，則新增
				if (!oldAuditItemArr.includes(k.auditItem)) {
					this.detailData[i].push(k);
					this.backup[i].push(JSON.parse(JSON.stringify(k)));
				}
			});
			// console.log(this.backup[i]);
		});
		// TEST:
		// console.log('detailData', this.detailData);
	}

	@Action
	setrelProcess(payload) {
		this.context.commit('SET_RELPROCESS', payload);
	}

	@Mutation
	DEL_RELPROCESS({ auditItem, relprocessId }) {
		// 刪除則將原始備份資料 取代
		// 找到備份資料
		const backupData = this.backup[relprocessId].find((i) => i.auditItem === auditItem);
		// 要被取代的資料
		const replaceData = this.detailData[relprocessId].find((i) => i.auditItem === auditItem);

		// console.log(backupData, replaceData);
		// 只取代relContent部分
		Object.keys(replaceData.relContent).map((i) => {
			replaceData.relContent[i] = backupData.relContent[i];
		});
	}

	@Action
	delRelProcess(payload) {
		this.context.commit('DEL_RELPROCESS', payload);
	}

	@Mutation
	UPDATED(payload) {
		Object.keys(payload).map((i) => {
			Object.keys(this.update).map((j) => {
				if (payload[j] !== undefined && i === j) {
					this.update[j] = payload[i];
				}
			});
		});
	}

	@Action
	updated(payload) {
		this.context.commit('UPDATED', payload);
	}

	@Mutation
	DEL_ALLRELPROCESS() {
		this.detailData.relProcess_1 = [];
		this.detailData.relProcess_2 = [];
	}

	@Action
	delAllRelProcess(payload) {
		this.context.commit('DEL_ALLRELPROCESS');
	}

	@Mutation
	SETCHECKVALIDATION() {
		for (let i = 1; i < 3; i++) {
			const currentView = this.detailData[`relProcess_${i}`].filter((j) => j.operate === 'add' && j.relProcess === i.toString() && j.relContent.content.trim() === '');
			this.checkValidation[`view${i}`] = currentView.map((i) => i.auditItem);
		}
	}

	@Action
	setCheckValidation(payload) {
		this.context.commit('SETCHECKVALIDATION');
	}

	@Mutation
	CLEARCHECKVALIDATION(payload) {
		this.checkValidation[`view${payload.key}`] = this.checkValidation[`view${payload.key}`].filter((i) => i !== payload.auditItem);
	}

	@Action
	clearCheckValidation(payload) {
		this.context.commit('CLEARCHECKVALIDATION', payload);
	}

	@Mutation
	SETCHECKVALIDATIONVIEW({ viewNum, validation }) {
		this.checkValidation[`view${viewNum}`] = validation;
	}

	@Action
	setCheckValidationView(payload) {
		this.context.commit('SETCHECKVALIDATIONVIEW', payload);
	}

	// ----------------- enumData ----------------- //
	enumData = {
		groupOptions: {},
		dataTypeEnum: {},
	}

	get getGroupOptions() {
		return this.enumData.groupOptions;
	}

	get getDataTypeEnum() {
		return this.enumData.dataTypeEnum;
	}

	@Mutation
	SET_ENUMDATA(payload) {
		Object.keys(payload).map((i) => {
			Object.keys(this.enumData).map((j) => {
				if (payload[j] !== undefined) {
					this.detailData[j] = payload[i];
				}
			});
		});
		this.enumData = { ...this.enumData, ...payload };
	}

	@Action
	setEnumData(payload) {
		this.context.commit('SET_ENUMDATA', payload);
	}

	// ----------------- modal ----------------- //
	modalState = {
		confirmGroupModal: {
			visible: false,
		},
		reviewCommitModal: {
			visible: false,
			type: 'confirm',
		},
		claimFormModal: {
			visible: false,
			isClaim: false,
		},
	}

	get getConfirmGroupModal() {
		return this.modalState.confirmGroupModal;
	}

	get getReviewCommitModal() {
		return this.modalState.reviewCommitModal;
	}

	get getClaimFormModal() {
		return this.modalState.claimFormModal;
	}

	@Mutation
	SET_DETAILMODALSTATE(payload) {
		Object.keys(payload).map((i) => {
			Object.keys(this.modalState[i]).map((j) => {
				if (payload[i][j] !== undefined) {
					this.modalState[i][j] = payload[i][j];
				}
			});
		});
	}

	@Action
	setDetailModalState(payload) {
		this.context.commit('SET_DETAILMODALSTATE', payload);
	}

	// ----------------- 通過/退回 data-confirm 資料確認覆核API ----------------- //
	confirmData = {
		agree: true,				// 通過/退回	(依按鈕)
		crawlerDataId: 'string',	// crawler ID (查詢資料明細API)
		dataRelVOS: [
			{
				auditItem: 'string',		// 查核項目代碼	(查核項目API)
				dataGroupId: 'string',	// DATA_GROUP主鍵 (查核項目子項API)
				dataGroupLogId: 'string',	// DATA_GROUP_LOG主鍵 (查核項目子項API)
				dataRelId: 'string',	// DATA_REL主鍵
				operate: 'add',	// 操作 add, delete, modify
				relContent: {
					article: 'string',	// 條
					content: 'string',	// 內容
					item: 'string',	// 目
					paragraph: 'string',	// 項
					subparagraph: 'string',	// 款
				},
				relId: 'string',	// 關聯主鍵 (查核項目子項API)
				relItem: 'string',	// 關聯項目 (查核項目子項API)
				relProcess: '1',	// 關聯流程 (1:年度稽核計畫、2:查核行前規劃、3:工作底稿)
			},
		],
		remark: 'string',		// 傋註 (退回id)
		roleId: 'string',		// 申請角色 (登入者角色id)
	}

	// ----------------- 送出覆核 data-submit 資料確認送出API ----------------- //
	// submitData = {
	// 	caseType: 'string',	// 案件類型
	// 	crawlerDataId: 'string',	// crawler ID (查詢資料明細API)
	// 	dataGroupId: 'string',	// 資料認列組別主鍵
	// 	dataRelVO: [
	// 		{
	// 			auditItem: 'string',	// 查核項目代碼	(查核項目API)
	// 			dataGroupId: 'string',	// DATA_GROUP主鍵
	// 			dataGroupLogId: 'string',	// DATA_GROUP_LOG主鍵
	// 			dataRelId: 'string',	// DATA_REL主鍵
	// 			operate: 'add',	// 操作 add, delete, modify
	// 			relContent: {
	// 				article: 'string',	// 條
	// 				content: 'string',	// 內容
	// 				item: 'string',	// 目
	// 				paragraph: 'string',	// 項
	// 				subparagraph: 'string',	// 款
	// 			},
	// 			relId: 'string',	// 關聯主鍵
	// 			relItem: 'string',	// 關聯項目
	// 			relProcess: '1',	// 關聯流程(1:年度稽核計畫、2:查核行前規劃、3:工作底稿)
	// 		},
	// 	],
	// }

	// ----------------- 暫存 save-temp 資料確認送出API ----------------- //
	// saveData = {
	// 	caseType: 'string',	// 案件類型
	// 	crawlerDataId: 'string',	// crawler ID (查詢資料明細API)
	// 	dataGroupId: 'string',	// 資料認列組別主鍵
	// 	dataRelVO: [
	// 		{
	// 			auditItem: 'string',	// 查核項目代碼	(查核項目API)
	// 			dataGroupId: 'string',	// DATA_GROUP主鍵
	// 			dataGroupLogId: 'string',	// DATA_GROUP_LOG主鍵
	// 			dataRelId: 'string',	// DATA_REL主鍵
	// 			operate: 'add',	// 操作 add, delete, modify
	// 			relContent: {
	// 				article: 'string',	// 條
	// 				content: 'string',	// 內容
	// 				item: 'string',	// 目
	// 				paragraph: 'string',	// 項
	// 				subparagraph: 'string',	// 款
	// 			},
	// 			relId: 'string',	// 關聯主鍵
	// 			relItem: 'string',	// 關聯項目
	// 			relProcess: '1',	// 關聯流程(1:年度稽核計畫、2:查核行前規劃、3:工作底稿)
	// 		},
	// 	],
	// }
}

export default crawlerDataDetail;
