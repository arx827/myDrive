import {
	VuexModule, Module, Mutation, Action,
} from 'vuex-module-decorators';

import $global from '@/plugins/global';

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
		relProcess_3: [],			// 工作底稿
	}

	// 代理人列表
	accountAgentList: string[] = [];

	// 備份原始資料
	backup = {
		relProcess_1: [],
		relProcess_2: [],
		relProcess_3: [],
	}

	// 工作底稿 原始資料
	relProcess_3 = {
		origin: [],
		privateOptions: [],
		flat: [],
	}

	update = {
		relProcess: false,
	}

	checkValidation = {
		view1: [],
		view2: [],
		view3: [],
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
			dataRelVO: [
				...this.detailData.relProcess_1.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_2.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_3.filter((j) => j.operate === 'add' || j.operate === 'delete'),
			],
			remark: '',		// 傋註 (退回id)
			roleId: '',		// 申請角色 (登入者角色id)}
		};
	}

	// 組成送出覆核格式
	get getSubmitData() {
		return {
			caseType: Object.keys(this.detailData.crawlerData.caseType)[0],	// 案件類型
			crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
			dataGroupId: this.detailData.crawlerData.dataGroupId,	// 資料認列組別主鍵
			dataRelVO: [
				...this.detailData.relProcess_1.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_2.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_3.filter((j) => j.operate === 'add' || j.operate === 'delete'),
			],
		};
	}

	// 組成暫存格式
	get getSaveData() {
		return {
			caseType: Object.keys(this.detailData.crawlerData.caseType)[0],	// 案件類型
			crawlerDataId: this.detailData.crawlerData.crawlerDataId,	// crawler ID (查詢資料明細API)
			dataGroupId: this.detailData.crawlerData.dataGroupId,	// 資料認列組別主鍵
			dataRelVO: [
				...this.detailData.relProcess_1.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_2.filter((j) => j.operate === 'add'),
				...this.detailData.relProcess_3.filter((j) => j.operate === 'add' || j.operate === 'delete'),
			],
		};
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

	get getRelProcess_3() {
		return this.detailData.relProcess_3;
	}

	get getRelProcess_3Data() {
		return this.relProcess_3;
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
	}

	@Action
	setDetailData(payload) {
		this.context.commit('SET_DETAILDATA', payload);
	}

	@Mutation
	SET_RELPROCESS(payload) {
		Object.keys(payload).map((i) => { // relProcess_1 / relProcess_2 / relProcess_3
			// 目前有的資料 auditItem Arr
			switch (i) {
			case 'relProcess_1':
			case 'relProcess_2':
				const oldAuditItemArr = this.detailData[i].map((j) => j.auditItem);

				payload[i].map((k) => {
					// 若不在原始資料中，則新增
					if (!oldAuditItemArr.includes(k.auditItem)) {
						this.detailData[i].push(k);
						this.backup[i].push($global.deepCopyData(k));
					}
				});
				break;
			case 'relProcess_3_origin':
				this.relProcess_3.origin = $global.deepCopyData(payload[i]);

				const privateProgramType = $global.deepCopyData(payload[i]).privateProgramType;
  			this.relProcess_3.privateOptions = [...new Set(privateProgramType.map((i) => i.auditItem))].map((i) => {
  				const $find = privateProgramType.find((j) => j.auditItem === i);
  				return {
  					label: $find.auditItemName,
  					value: $find.auditItem,
  				};
  			});
				// 排序 => 公版先 專屬後
				this.relProcess_3.flat = [...(this.relProcess_3.origin as any).publicProgramType, ...(this.relProcess_3.origin as any).privateProgramType];
				break;
			}
		});
		// console.log(this.detailData.relProcess_3);
	}

	@Action
	setrelProcess(payload) {
		this.context.commit('SET_RELPROCESS', payload);
	}

	@Mutation
	SETRELPROCESS3(payload) {
		const oldAuditItemRelProcess3Arr = this.detailData.relProcess_3.map((i) => i.dataRelId);
		// console.log('原始資料 =>', oldAuditItemRelProcess3Arr);
		// console.log('input資料 =>', payload);

		// payload.map((k) => {
		// 若不在原始資料中，則新增
		// if (!oldAuditItemRelProcess3Arr.includes(k.relId)) {
		this.detailData.relProcess_3.push(payload);
		// this.backup.relProcess_3.push($global.deepCopyData(k));
		// }
		// });
	}

	@Action
	setrelProcess3(payload) {
		this.context.commit('SETRELPROCESS3', payload);
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
	DEL_RELPROCESS3(relprocessId) {
		const focus = this.detailData.relProcess_3.filter((i) => i.relItem === relprocessId);
		focus.map((i) => {
			this.detailData.relProcess_3.splice(this.detailData.relProcess_3.indexOf(i), 1);
		});
	}

	@Action
	delRelProcess3(payload) {
		this.context.commit('DEL_RELPROCESS3', payload);
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
		this.detailData.relProcess_3 = [];
	}

	@Action
	delAllRelProcess(payload) {
		this.context.commit('DEL_ALLRELPROCESS');
	}

	@Mutation
	SETCHECKVALIDATION() {
		for (let i = 1; i < 4; i++) {
			const currentView = this.detailData[`relProcess_${i}`].filter((j) => j.operate === 'add' && j.relProcess === i.toString() && j.relContent.content.trim() === '');
			if (i === 3) {
				this.checkValidation[`view${i}`] = currentView.map((i) => i.dataRelId);
			} else {
				this.checkValidation[`view${i}`] = currentView.map((i) => i.auditItem);
			}
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

	@Mutation
	SETACCOUNTAGENTLIST(payload) {
		this.accountAgentList = payload;
	}

	@Action
	setAccountAgentList(payload) {
		this.context.commit('SETACCOUNTAGENTLIST', payload);
	}

	get getAccountAgentList() {
		return this.accountAgentList;
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
