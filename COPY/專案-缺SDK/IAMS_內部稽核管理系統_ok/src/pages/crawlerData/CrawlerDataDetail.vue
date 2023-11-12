<template>
  <div class="crawlerDetail-container container">
    <AccordionArea>
      <CrawlerDataTypeChange
        v-if="crawlerDataId"
        ref="crawlerDataDetail"
        :prop-data="getDetailData"
        :crawler-data-id="crawlerDataId"
      />
    </AccordionArea>
    <div class="controlBar d-flex flex-wrap-reverse">
      <div class="tabGroup d-flex flex-wrap">
        <button
          v-for="(item, index) in getTabsArr"
          :key="index"
          class="tabGroup__item"
          :class="{'tabGroup__item--active': activeTab == item.id}"
          @click="tabChange(item.id)"
        >
          {{ item.title }}
        </button>
      </div>
      <div class="btnGroup ms-auto">
        <ActionBar
          @click="emitClick"
        />
      </div>
    </div>
    <div class="controlMain__container">
      <ControlCurrentViewChange
        v-if="crawlerDataId"
        :data-type-str="dataTypeStr"
        :crawler-data-id="crawlerDataId"
        :active-tab="activeTab"
      />
    </div>
    <!-- 設定認列組別 彈窗 -->
    <ConfirmGroupForm
      :default-select="getDetailData.claimGroup"
      :crawler-data-id="crawlerDataId"
    />
    <!-- 審核通過/退回 彈窗 -->
    <ReviewCommitModal />

    <!-- 資料蒐集(認列)/(非本組認列) -->
    <ClaimForm
      ref="claimFormRef"
      :visible="getClaimFormModal.visible"
      :is-claim="getClaimFormModal.isClaim"
      @closeModal="closeClaimFormModal"
      @claim="getApi_SendClaimInData"
      @notClaim="getApi_NotClaimInData"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import AccordionArea from '@shared/AccordionArea.vue';
import CrawlerDataTypeChange from '@shared/form/formDataType/FormDataType_change.vue';
import ControlCurrentViewChange from '@components/crawlerData/crawlerDetail/controlCurrentView/ControlCurrentView_change.vue';
import ActionBar from '@components/crawlerData/crawlerDetail/ActionBar.vue';
import { Action, Getter, namespace } from 'vuex-class';
import {
	RoleDto,
	DataCollectResultVO,
	SendClaimRequest,
	NotClaimRequest,
	DataSubmitRequest,
	SaveTempRequest,
	DataCollectDetailDto,
} from '@fubonlife/iams-api-axios-sdk';
import ConfirmGroupForm from '@components/crawlerData/crawlerDetail/ConfirmGroupForm.vue';
import ReviewCommitModal from '@components/crawlerData/crawlerDetail/ReviewCommitModal.vue';
import ClaimForm from '@components/crawlerData/crawlerDetail/ClaimForm.vue';

const detailModule = namespace('crawlerDataDetailVuex');
const modalControl = namespace('modalControl');

@Component({
	components: {
		AccordionArea,
		CrawlerDataTypeChange,
		ControlCurrentViewChange,
		ActionBar,
		ConfirmGroupForm,
		ReviewCommitModal,
		ClaimForm,
	},
})
export default class CrawlerDataDetail extends Vue {
	h = this.$createElement;

  @Action('setLoading') setLoading;

	@detailModule.Action('setDetailData') setDetailData;

	@detailModule.Getter('getGroupOptions') getGroupOptions;

	@detailModule.Getter('getDetailData') getDetailData;

	@detailModule.Getter('getConfirmGroupFormShow') getConfirmGroupFormShow;

	@modalControl.Action('setModalState') setModalState;

	// Detail 彈窗
	@detailModule.Action('setDetailModalState') setDetailModalState;

	// 認列/非本組認列 彈窗資訊
	@detailModule.Getter('getClaimFormModal') getClaimFormModal;

	@detailModule.Getter('getDataTypeEnum') getDataTypeEnum; // 取得資料類型Options

	@detailModule.Action('setEnumData') setEnumData;

	// 取得 送出覆核 vuex
	@detailModule.Getter('getSubmitData') getSubmitData;

	// 取得 暫存資料 vuex
	@detailModule.Getter('getSaveData') getSaveData;

	// 設定 tabs驗證 vuex
	@detailModule.Action('setCheckValidation') setCheckValidation;

	@detailModule.Getter('getCheckValidation') getCheckValidation;

	// 設定 代理人列表
	@detailModule.Action('setAccountAgentList') setAccountAgentList;

	// 權限
	currentRole: RoleDto;

  tabsArr: {id: string; title: string}[] = [
  	{
  		id: '1',
  		title: '年度稽核計畫',
  	},
  	{
  		id: '2',
  		title: '查核行前規劃',
  	},
  	{
  		id: '3',
  		title: '工作底稿',
  	},
  	{
  		id: '4',
  		title: '資料檔案',
  	},
  	{
  		id: '5',
  		title: '歷程',
  	},
  ]

  confirmGroup: string = '';

	crawlerDataId: string = '';

	/**
   * 1.年度稽核計畫
   * 2.查核行前規劃
   * 3.工作底稿
   * 4.歷程
	 * 5.資料檔案
   */
	activeTab: string = '1';

	/**
   * Func
   */
	// 顯示/隱藏 權限對應 tabs
	get getTabsArr() {
  	// 只顯示 歷程、資料檔案 的 權限
  	const groupFilter = ['ROLE_Audit_Department_Head', 'ROLE_Audit_Office_Boss_Vice', 'ROLE_Audit_Office_Boss'];
  	if (groupFilter.includes(this.$global.getCurrentRole().id)) {
  		this.activeTab = '4';
  		return this.tabsArr.filter((i) => i.id === '4' || i.id === '5');
  	}
  	return this.tabsArr;
	}

	get dataTypeStr() {
  	if (this.getDetailData.caseType) {
  		return Object.keys(this.getDetailData.caseType)[0];
  	}
  	return '';
	}

	// 取得 Query 並帶入資料
	setParam() {
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.crawlerDataId = $query.crawlerDataId;
  	}
	}

	/**
   * API
   */
	// API: 取得資料類型 enum
	getApi_getDataTypeInData() {
  	this.setLoading(true);
  	this.$dataCollectApi.getDataTypeInDataCollectUsingGET()
  		.then((resp) => {
  			const getData = resp.data;
  			this.setEnumData({
  				dataTypeEnum: getData.result,
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 查詢資料明細API
	getApi_GetAttachment() {
  	this.setLoading(true);
  	this.$dataCollectApi.getDataCollectDetailInDataCollectUsingGET(this.crawlerDataId)
  		.then((resp) => {
  			const getData = resp.data;
				// TEST:
				// console.log('查詢資料明細API =>', getData.result);
  			this.setDetailData({ crawlerData: getData.result });
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 認列送出
	getApi_SendClaimInData(confirmUser) {
  	this.setLoading(true);
  	const formData: SendClaimRequest = {
  		confirmUser,
  		crawlerDataId: [this.crawlerDataId],
  		group: this.currentRole.roleUnits[0].auditorTeamCode,
  	};
  	this.$dataCollectApi.sendClaimInDataCollectUsingPOST(formData)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '資料蒐集(認列)成功',
  					autoClose: 3,
  				},
  			});
  			(this.$refs.claimFormRef as any).clearForm();
  			this.emitBack();
  			this.closeClaimFormModal();
  			this.setModalState({
  				resultModal: {
  					visible: false,
  				},
  			});
  		})
  		.catch((error) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '資料蒐集(認列)失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 非本組認列
	getApi_NotClaimInData(applyRemark) {
  	this.setLoading(true);
  	const formData: NotClaimRequest = {
  		applyRemark,
  		crawlerDataId: [this.crawlerDataId],
  		group: this.currentRole.roleUnits[0].auditorTeamCode,
  	};
  	this.$dataCollectApi.notClaimInDataCollectUsingPOST(formData)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '資料蒐集(非本組認列)成功',
  					autoClose: 3,
  				},
  			});
  			(this.$refs.claimFormRef as any).clearForm();
  			this.emitBack();
  			this.closeClaimFormModal();
  			this.setModalState({
  				resultModal: {
  					visible: false,
  				},
  			});
  		})
  		.catch((error) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '資料蒐集(非本組認列)失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 送出覆核 資料確認覆核API
	async getApi_DataSubmitInData() {
  	this.setCheckValidation();
  	const dataRelVO_1_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '1' && i.relContent.content.trim() === '');
  	const dataRelVO_2_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '2' && i.relContent.content.trim() === '');
  	const dataRelVO_3_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '3' && i.relContent.content.trim() === '');
  	if ([...this.getCheckValidation.view1, ...this.getCheckValidation.view2, ...this.getCheckValidation.view3].length > 0) {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'error',
  				title: '資料蒐集送出失敗',
  				contentHtml: ((dataRelVO_1_emptyArr.length > 0) || (dataRelVO_2_emptyArr.length > 0)) ? `<ul style="list-style:disc; white-space: initial; color:red;">
  					${(dataRelVO_1_emptyArr.length > 0) ? '<li>年度稽核計畫，已勾選的查核項目，內容必填</li>' : ''}
  					${(dataRelVO_2_emptyArr.length > 0) ? '<li>查核行前規劃，已勾選的查核項目，內容必填</li>' : ''}
  					${(dataRelVO_3_emptyArr.length > 0) ? '<li>工作底稿，已勾選的Section內的查核程式，內容必填</li>' : ''}
  				</ul>` : null,
  			},
  		});
  		return false;
  	}
		// TEST:
  	// console.log('送出覆核=>', this.getSubmitData);
  	this.setLoading(true);
  	const formData: DataSubmitRequest = await this.getSubmitData;
  	this.$dataCollectApi.dataSubmitInDataCollectUsingPOST(formData)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '資料蒐集送出成功',
  					autoClose: 3,
  				},
  			});
  			this.emitBack();
  		})
  		.catch((error) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '資料蒐集送出失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 暫存
	async getApi_SaveTemp() {
  	this.setCheckValidation();
  	const dataRelVO_1_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '1' && i.relContent.content.trim() === '');
  	const dataRelVO_2_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '2' && i.relContent.content.trim() === '');
  	const dataRelVO_3_emptyArr = this.getSubmitData.dataRelVO.filter((i) => i.relProcess === '3' && i.relContent.content.trim() === '');
  	if ([...this.getCheckValidation.view1, ...this.getCheckValidation.view2, ...this.getCheckValidation.view3].length > 0) {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'error',
  				title: '資料蒐集暫存失敗',
  				contentHtml: ((dataRelVO_1_emptyArr.length > 0) || (dataRelVO_2_emptyArr.length > 0) || (dataRelVO_3_emptyArr.length > 0)) ? `<ul style="list-style:disc; white-space: initial; color:red;">
  					${(dataRelVO_1_emptyArr.length > 0) ? '<li>年度稽核計畫，已勾選的查核項目，內容必填</li>' : ''}
  					${(dataRelVO_2_emptyArr.length > 0) ? '<li>查核行前規劃，已勾選的查核項目，內容必填</li>' : ''}
						${(dataRelVO_3_emptyArr.length > 0) ? '<li>工作底稿，已勾選的Section內的查核程式，內容必填</li>' : ''}
  				</ul>` : null,
  			},
  		});
  		return false;
  	}

  	this.setLoading(true);
  	const formData: SaveTempRequest = await this.getSaveData;
  	this.$dataCollectApi.saveTempInDataCollectUsingPOST(formData)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '資料蒐集暫存成功',
  					autoClose: 3,
  				},
  			});
  		})
  		.catch((error) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '資料蒐集暫存失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 取得代理人資料
	getApi_accountAgent() {
		this.setLoading(true);
		this.$accountAgentApi.searchPrincipalUsingPOST()
  		.then((resp) => {
  			this.setAccountAgentList(resp.data.result);
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	/**
   * Event
   */
	emitClick(type) {
  	switch (type) {
  	case 'sussess':
  		// 通過
  		this.setDetailModalState({
  			reviewCommitModal: {
  				visible: true,
  				type: 'confirm',
  			},
  		});
  		break;
  	case 'reject':
  		// 退回
  		this.setDetailModalState({
  			reviewCommitModal: {
  				visible: true,
  				type: 'reject',
  			},
  		});
  		break;
  	case 'submitReview':
  		// 送出覆核
  		this.getApi_DataSubmitInData();
  		break;
  	case 'save':
  		// 暫存
  		this.getApi_SaveTemp();
  		break;
  	case 'inGroup':
  		// 認列送出
  		this.setDetailModalState({
  			claimFormModal: {
  				visible: true,
  				isClaim: true,
  			},
  		});
  		break;
  	case 'notInGroup':
  		// 非本組認列
  		this.setDetailModalState({
  			claimFormModal: {
  				visible: true,
  				isClaim: false,
  			},
  		});
  		break;
  	case 'back':
  		// 上一頁
  		this.emitBack();
  		break;
  	}
	}

	// 上一頁
	emitBack() {
  	this.$router.go(-1);
	}

	// 關閉 認列/非本組認列 彈窗
	closeClaimFormModal() {
  	this.setDetailModalState({
  		claimFormModal: {
  			visible: false,
  		},
  	});
	}

	// 切換 tabs
	tabChange(key) {
  	this.activeTab = key;
	}

	/**
   * Hook
   */
	async created() {
  	this.currentRole = await this.$global.getCurrentRole();
  	this.setParam();
		// 取得代理人角色
		this.getApi_accountAgent();
  	await this.getApi_GetAttachment();	// 取得資料明細
	}

	destroyed() {
  	// 清除 Storage 資料
  	if (this.$route.name !== 'CrawlerDataDetail') {
  		this.$global.clearParam();
  	}
	}

	/**
   * 監聽
   */
	@Watch('getDataTypeEnum', { immediate: true })
	watchGetDataTypeEnum(val) {
  	if (!val) {
  		this.getApi_getDataTypeInData(); // 取得 組別列表
  	}
	}
}
</script>

<style lang="scss" scoped>
.crawlerDetail-container {
  padding-bottom: 20px;
}
.controlBar {
  margin-top: 22px;
}

.tabGroup {
  // width: 975px;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 16px;
}
.tabGroup__item {
  flex: 1;
  border-radius: 0;
  background: $COLOR-LIGHT;
  border: 1px solid #DEDFDF;
  color: $COLOR-DARK;
  padding: 10px;
  min-width: 170px;
	text-align: center;
  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
	&.disabled {
		background: $COLOR-GRAY2;
	}
  &.tabGroup__item--active {
    border-color: $COLOR-MAIN1;
    color: $COLOR-MAIN1;
  }
  &:not(.tabGroup__item--active) {
		&:not(.disabled) {
			cursor: pointer;
			&:hover {
				background: darken($COLOR-LIGHT, 2%)
			}
		}
  }
}

.btnGroup {
  align-self: center;
	display: flex;
	flex-wrap: wrap;
	justify-content: right;
}
</style>
