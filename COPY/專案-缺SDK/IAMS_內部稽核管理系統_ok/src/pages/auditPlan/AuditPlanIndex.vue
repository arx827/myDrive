<template>
  <div class="container auditPlanIndexPage">
    <AccordionArea>
      <div class="search-form mt-2 w-100">
        <a-form-model
          ref="formRef"
          class="d-flex align-items-start flex-wrap w-100"
          :model="searchForm"
          :rules="formRules"
          :hide-required-mark="true"
        >
          <div class="d-flex col w-100">
            <div class="search-form__item col">
              <div class="search-form__label">
                年度
              </div>
              <a-form-model-item prop="year">
                <a-select
                  v-model="searchForm.year"
                  :filter-option="$global.filterOption"
                  :options="yearOptions"
                  :dropdown-match-select-width="false"
                  show-search
                  placeholder="請選擇年度"
                  class="search-form__input--select"
                  @change="getAuditItem"
                />
              </a-form-model-item>
            </div>
            <div class="search-form__item col">
              <div class="search-form__label">
                月份
              </div>
              <a-form-model-item>
                <a-select
                  v-model="searchForm.month"
                  :filter-option="$global.filterOption"
                  :allow-clear="true"
                  :options="$enum.monthOption"
                  :dropdown-match-select-width="false"
                  show-search
                  placeholder="請選擇月份"
                  class="search-form__input--select"
                />
              </a-form-model-item>
            </div>
            <div class="search-form__item col">
              <div class="search-form__label">
                查核性質
              </div>
              <a-form-model-item>
                <a-select
                  v-model="searchForm.auditType"
                  :filter-option="$global.filterOption"
                  :allow-clear="true"
                  :options="typeOption"
                  :dropdown-match-select-width="false"
                  placeholder="請選擇查核性質"
                  show-search
                  class="search-form__input--select"
                />
              </a-form-model-item>
            </div>
            <div class="search-form__item col">
              <div class="search-form__label">
                查核項目
              </div>
              <a-form-model-item>
                <a-select
                  v-model="searchForm.auditItems"
                  placeholder="請選擇查核項目"
                  show-search
                  class="search-form__input--select"
                  :allow-clear="true"
                  :filter-option="$global.filterOption"
                  :options="itemOption"
                  :dropdown-match-select-width="false"
                />
              </a-form-model-item>
            </div>
            <div class="search-form__item col">
              <div class="search-form__label">
                組別
              </div>
              <a-form-model-item>
                <a-select
                  v-model="searchForm.auditorTeam"
                  class="search-form__input--select"
                  show-search
                  placeholder="請選擇查核組別"
                  :filter-option="$global.filterOption"
                  :allow-clear="true"
                  :options="teamOption"
                  :dropdown-match-select-width="false"
                />
              </a-form-model-item>
            </div>
          </div>
          <button
            class="btn--search align-self-start"
            @click="onHandleSearch"
          >
            查詢
          </button>
        </a-form-model>
      </div>
    </AccordionArea>
    <div
      v-if="yapFrontEndArr.length > 0"
      class="controlBar d-flex flex-wrap-reverse"
    >
      <div class="search__result__info d-inline-flex align-items-center">
        <div class="result__info__year">
          {{ infoData.year }}年
        </div>
        <div class="result__info__state d-flex align-items-center">
          <img
            class="result__info__state__img"
            src="~@assets/images/icon/icon_declare.svg"
          >
          <span class="result__info__state__txt">狀態：{{ infoData.status.label }}</span>
        </div>
      </div>
      <div class="btnGroup ms-auto">
        <a-select
          v-model="searchItem"
          placeholder="請選擇查核項目"
          class="search__result__select my-1"
          :options="searchItemOption"
        >
          <a-select-option
            v-for="item in searchItemOption"
            :key="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <ActionBar
          :role="currentRole"
          :yap-status="infoData.status.value"
          :is-confirm-user="isConfirmUser"
          :is-supervisor="isSupervisor"
          :is-setting-audit-items="isSettingAuditItems"
          :is-been-rejected-audit-item="isBeenRejectedAuditItem"
          :review-flag="yapReviewFlag"
          @click="actionBarEmitEvent"
        />
      </div>
    </div>

    <!-- 年度查核項目 -->
    <template v-if="filterYapFrontEndArr && filterYapFrontEndArr.length > 0">
      <YapComp
        v-for="(item,index) in showYapFrontEndArr"
        :id="item.yapId"
        ref="yapComp"
        :key="item.yapId"
        v-observe-visibility="index === showYapFrontEndArr.length - 1 ? handleScrolledToBottom : false"
        :role="currentRole"
        :yap-id="item.yapId"
        :yap-status="infoData.status.value"
        :yap-front-end-arr.sync="filterYapFrontEndArr[index]"
        :type-option="typeOption"
        :item-option="itemOptionCom"
        :team-option="teamOption"
        :unit-list="unitList"
        :yap-point-audit-item-list="yapPointAuditItemList"
        :is-confirm-user="isConfirmUser"
        :current-year="infoData.year"
        :review-flag="yapReviewFlag"
        @click="emitEvent"
        @slideclick="slideClickEvent"
      />
    </template>
    <div
      v-if="filterYapFrontEndArr.length === 0"
      class="comp__empty"
    >
      <img
        src="@/assets/images/icon/icon-no-found.svg"
        alt=""
      >
      <div class="comp__empty--text">
        查無資料
      </div>
    </div>

    <!-- 暫存 -->
    <TemporaryStoreButton
      v-if="(currentRoleId === 'ROLE_Auditor' || currentRoleId === 'ROLE_Audit_Team_Head')
        && (infoData.status.value === 'A' || infoData.status.value === 'B' || (infoData.status.value === 'C' && isBeenRejectedAuditItem))"
      @click="saveYap"
    />

    <!-- 查核項目設定 彈窗 -->
    <SetAuditItemsModal
      :visible="setAuditItemsModal.visiable"
      :audit-items-option="itemOptionCom"
      :year="infoData.year"
      @closeModal="setAuditItemsModal.visiable = false"
      @save="modifyAuditItem"
    />

    <!-- 組長退回意見 彈窗 -->
    <LeaderOpinionModal
      :visible="leaderOpinionModal.visible"
      :message="leaderOpinionModal.message"
      @closeModal="leaderOpinionModal.visible = false"
    />

    <!-- 比對資料 彈窗 -->
    <CompareDataModal
      :visible="compareModal.visible"
      :now-data="compareModal.nowData"
      :old-data="compareModal.oldData"
      @closeModal="compareModal.visible = false"
    />

    <!-- 匯出資料 彈窗 -->
    <ExportModal
      :visible="exportModalShow"
      @closeModal="exportModalShow = false"
      @click="handleExport"
    />

    <!-- 連結資料 彈窗 -->
    <ConnectDataModal
      :visible="connectDataModal.visible"
      :content-data="connectDataModal.data"
      :data-id="dataId"
      @closeModal="connectDataModal.visible = false"
    />

    <!-- 匯入舊資料 彈窗 -->
    <ImportDataModal
      :type-option="typeOption"
      :item-option="itemOptionCom"
      :yap-point-audit-item-list="yapPointAuditItemList"
      :yap="importModal.yap"
      :yap-year="importModal.yapYear"
      :visible="importModal.visiable"
      @closeModal="importModal.visiable = false"
      @importData="importYapPointAuditItem"
    />

    <!-- 回覆提問 彈窗 -->
    <QAModal
      :visible="QAModal.visiable"
      :q-a-status="QAModal.QAStatus"
      :yap-id="QAModal.yapId"
      :q-a-data="QAModal.QAData"
      :yap-status="QAModal.yapStatus"
      :yap-point-audit-item-id="QAModal.yapPointAuditItemId"
      :is-supervisor="isSupervisor"
      :review-level="QAModal.reviewLevel"
      :reject-flag="QAModal.rejectFlag"
      :role-id="currentRoleId"
      @closeModal="QAModal.visiable = false"
      @getYapProjectScopeQA="getYapProjectScopeQA"
      @getYapItemScopeQA="getYapItemScopeQA"
      @changeYapProjectScopeQAStatus="changeYapProjectScopeQAStatus"
      @changeYapItemScopeQAStatus="changeYapItemScopeQAStatus"
    />

    <!-- 計畫受檢單位 顯示全部 彈窗 -->
    <InspectedUnitModal
      :units-list="inspectedUnitModal.unitsList"
      :visible="inspectedUnitModal.visiable"
      @closeModal="inspectedUnitModal.visiable = false"
    />

    <!-- 組長審核提交 (通過 / 退回)、刪除  行政組組長退回 -->
    <ReviewCommitModal
      :year="infoData.year"
      :yap-id="reviewCommitModal.yapId"
      :visible="reviewCommitModal.visible"
      :type="reviewCommitModal.type"
      :title="reviewCommitModal.title"
      :label="reviewCommitModal.label"
      :audit-item-list="reviewCommitModal.auditItemList"
      @closeModal="reviewCommitModal.visible = false"
      @click="reviewModalClickEvent"
      @getSupervisorReturnAuditItem="getSupervisorReturnAuditItem"
    />

    <!-- 編制歷程-->
    <HistoryModal
      :visible="historyshow"
      :init-search-form="searchForm"
      :init-options="{
        teamOption,
        typeOption,
        yearOptions
      }"
      @closeModal="historyshow = false"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
import CompareDataModal from '@components/auditPlan/auditPlanIndex/CompareDataModal.vue';
import ExportModal from '@components/auditPlan/auditPlanIndex/ExportModal.vue';
import LeaderOpinionModal from '@components/auditPlan/auditPlanIndex/LeaderOpinionModal.vue';
import ConnectDataModal from '@components/auditPlan/auditPlanIndex/ConnectDataModal.vue';
import TemporaryStoreButton from '@shared/button/TemporaryStoreButton.vue';
import ActionBar from '@components/auditPlan/auditPlanIndex/ActionBar.vue';
import ImportDataModal from '@components/auditPlan/auditPlanIndex/ImportDataModal.vue';
import YapComp from '@/components/auditPlan/auditPlanIndex/YapComp.vue';
import AccordionArea from '@shared/AccordionArea.vue';
import QAModal from '@components/auditPlan/auditPlanIndex/QAModal.vue';
import InspectedUnitModal from '@components/auditPlan/auditPlanIndex/InspectedUnitModal.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	SearchAuditPlan,
	SearchAuditPlanAuditorTeamEnum,
	SelectOptionDto,
	YapDto,
	YapUnitVO,
	ModifyYap,
	YapPointAuditItemDto,
	RoleDto,
	DataCollectDetailDto,
	ModifyYapPointAuditItem,
	ApproveYap,
	SearchAuditPlanAuditTypeEnum,
	SearchAuditPlanMonthEnum,
	ModifyYapAuditItemAndName,
} from '@fubonlife/iams-api-axios-sdk';
import { uuid } from 'vue-uuid';
import ReviewCommitModal from '@/components/auditPlan/auditPlanIndex/ReviewCommitModal.vue';
import HistoryModal from '@/components/auditPlan/auditPlanIndex/HistoryModal.vue';
import AdminReturnModal from '@/components/auditPlan/auditPlanIndex/AdminReturnModal.vue';
import SetAuditItemsModal from '@/components/auditPlan/auditPlanIndex/SetAuditItemsModal.vue';
import {
	YapFrontEndDto, yapFrontEndPointAuditItem, SearchAuditPlanFrontEnd, YapPointAuditItemData, YapPointAuditItemFrontEndDto,
} from './models';

const modalModule = namespace('modalControl');

@Component({
	components: {
		AccordionArea,
		FblDataGrid,
		CompareDataModal,
		ExportModal,
		ImportDataModal,
		TemporaryStoreButton,
		LeaderOpinionModal,
		ConnectDataModal,
		QAModal,
		InspectedUnitModal,
		ReviewCommitModal,
		ActionBar,
		YapComp,
		HistoryModal,
		AdminReturnModal,
		SetAuditItemsModal,
	},
})
export default class AuditPlanIndex extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  renderKey: number = 0;

  // ---------------------------------- 彈窗控制 ----------------------------------//
  // 比對資料 彈窗
  compareModal = {
  	visible: false,
  	nowData: {},
  	oldData: [],
  };

  // 組長退回意見 彈窗
	leaderOpinionModal = {
		visible: false,
		message: '',
	}

  // 連結資料 彈窗
  connectDataModal: {visible: boolean; data: DataCollectDetailDto[]} = {
  	visible: false,
  	data: [],
  };

  // 匯出 彈窗
  exportModalShow: boolean = false;

  // 匯入 彈窗
  importModal = {
  	visiable: false,
  	yap: null,
  	yapYear: '',
  }

  // 查核項目設定 彈窗
	setAuditItemsModal = {
  	visiable: false,
		auditItemsOption: null,
	}

  // 回覆提問 彈窗
  QAModal = {
  	visiable: false,
  	QAStatus: null,
  	yapId: null,
  	yapPointAuditItemId: null,
  	yapStatus: '',
  	QAData: [],
  	reviewLevel: '',
  	rejectFlag: false,
  };

	// 計畫受檢單位 顯示全部 彈窗
	inspectedUnitModal = {
		visiable: false,
		unitsList: [],
	}

	// 審核通過/退回 彈窗
	reviewCommitModal = {
		yapId: '',
		type: 'approval',
  	visible: false,
		title: '審核通過',
		label: '通過意見',
		auditItemList: null,
	};

	// 編制歷程 彈窗
	historyshow = false;

	// ---------------------------------- 當前資料 ----------------------------------//
	// 當前角色
	currentRole: RoleDto = null;

	currentRoleId: string = null;

	// 當前要操作的查核項目
	currentYapId: string = null;

	// 當前要操作的重點查核項目
	currentYapPointAuditItem: YapPointAuditItemData = {
		yapId: null,
		yapPointAuditItemMapId: null,
		yapPointAuditItemId: null,
		yapPointAuditItem: null,
	};

	isConfirmUser: boolean = false;

	// 當前主管能不能進行審畢
	yapReviewFlag: boolean = false;

	// 年度稽核計畫查詢後狀態
	infoData = {
		year: '',
		status: {
			value: '',
			label: '',
		},
	}

	// ---------------------------------- 年度稽核計畫查詢 ----------------------------------//
  searchForm: SearchAuditPlanFrontEnd = {
  	year: undefined,
  	month: undefined,
  	auditType: undefined,
  	auditItems: undefined,
  	auditorTeam: undefined,
  }

	formRules: { [key: string]: ValidationRule[] } = {
  	year: [{ required: true, message: '請選擇查詢年份', trigger: 'change' }],
	};

	// ---------------------------------- 選單 ----------------------------------//
  // 年度 選單
  yearOptions: SelectOptionDto[] = null;

  // 查核項目 選單
	itemOption: SelectOptionDto[] = null;

	// yapComp 的 查核項目 （不會隨上面查詢年份改變）
	itemOptionCom: SelectOptionDto[] = null;

	// 查核性質 選單
	typeOption: SelectOptionDto[] = null;

  // 計畫受檢單位 選單 (有效、非有效單位)
  unitList: YapUnitVO = null;

	// 計畫受檢單位-非有效單位 選單
	unitInValidOption: SelectOptionDto[] = null;

  // 組別 選單
  teamOption: SelectOptionDto[] = null;

  // 主管清單(部主管、總稽核、副總稽核)
  supervisorList: string[] = [
  	'ROLE_Audit_Department_Head',
  	'ROLE_Audit_Office_Boss_Vice',
  	'ROLE_Audit_Office_Boss',
  ]

  // 是否是主管(部主管、總稽核、副總稽核)
  isSupervisor: boolean = false;

	// 待確認查核項目 value
	searchItem: string = 'todo';

	// ---------------------------------- 年度查核項目 ----------------------------------//
	yapOriArr: YapDto[] = []; // API 取得資料

	yapOriFrontEndArr: YapFrontEndDto[] = []; // 前端轉完格式後備份：用來比較是否有modify

  yapFrontEndArr: YapFrontEndDto[] = []; // 前端編輯所使用資料格式

  filterYapFrontEndArr: YapFrontEndDto[] = [];

	yapSumbitArr: ModifyYap = null;

	isYapModify: boolean = false; // 畫面上顯示的年度稽核項目是否有被變更

	isYapVaild: boolean = false; // 檢核欄位

	showYapFrontEndArr: YapFrontEndDto[] = []; // 項目顯示陣列

	showYapArrCount = 3 // 項目顯示總數

	// ---------------------------------- 重點查核項目 ----------------------------------//

	yapPointAuditItemList = [];

	dataId: string = ''

	// 受查單位顯示全部資料
  inspectedUnitList = [];

  /**
   * Watch
   */
	@Watch('searchItem')
  onSearchItemChanged() { // 當待確認、未審畢、全部選單 切換時
  	// console.log('searchItem', this.searchItem);
  	this.setLoading(true);
  	this.showYapFrontEndArr = []; // lazyLoad 認列清空
  	this.showYapArrCount = 3;	// lazyLoad 預設從３個數量開始渲染
  	this.forceNextTick(() => {
  		this.getFilterYapFrontEndArr();
  		this.setLoading(false);
  	});
  }

	@Watch('yapFrontEndArr', { immediate: true, deep: true })
	onYapFrontEndArrChanged(val) {
		console.log('@watch => yapFrontEndArr =>', val);
  	this.getFilterYapFrontEndArr();
	}

	/**
   * get
   */
	// 年度稽核查核項目 篩選 下拉選單
	get searchItemOption() {
  	const options = [ // 查核人員、組長
  		{ value: 'todo', label: '待確認查核項目' },
  		{ value: 'doing', label: '進行中查核項目' },
  		{ value: 'all', label: '全查核項目' },
  	];
		const supervisorOptions = [
			{ value: 'todo', label: '待確認查核項目' },
  		{ value: 'toReview', label: '未審畢查核項目' },
  		{ value: 'all', label: '全查核項目' },
		];
  	return this.isSupervisor ? supervisorOptions : options;
	}

	// 篩選 當前要顯示的查核項目
	getFilterYapFrontEndArr() {
		this.filterYapFrontEndArr = this.yapFrontEndArr.filter((e) => this.isShowYapCom(e));
	}

	// 目前查詢是否看以設定查核項目
	get isSettingAuditItems() {
		if ((this.infoData.status.value === 'A' || this.infoData.status.value === 'B' || this.infoData.status.value === 'C')
		  && ((this.currentRoleId === 'ROLE_Audit_Team_Head' || (this.currentRoleId === 'ROLE_Auditor' && this.isConfirmUser)))) return true;
		return false;
	}

	// 主管審閱階段：filterYaps是否有被退回的項目
	get isBeenRejectedAuditItem(): boolean {
		if (this.infoData.status.value !== 'C') return false;
		if (this.filterYapFrontEndArr.find((yap) => yap.rejectFlag)) return true;
		return false;
	}

	/**
   * Hook
   */
	async created() {
  	await this.searchOptionInit();
	}

	mounted() {
  	this.currentRole = this.$global.getCurrentRole();
  	this.currentRoleId = this.$global.getCurrentRoleId();
  	this.isSupervisor = this.supervisorList.find((e) => e === this.currentRole.id) !== undefined;
	}

	/**
	 * Event－API
	 */

	// API:取得查詢列-初始選單列表
	searchOptionInit() {
  	this.setLoading(true);
  	this.$auditPlanApi.initInAuditPlanUsingGET()
  		.then((resp) => {
  			const data = resp.data.result;
  			this.yearOptions = data.auditYearOptions;
  			this.itemOption = data.auditItemOptions;
  			this.itemOptionCom = data.auditItemOptions;
  			this.typeOption = data.auditTypeOptions;
  			this.teamOption = data.auditorTeamOptions;
  			this.searchForm.year = parseInt(this.yearOptions[0].value);
  			this.searchForm.auditorTeam = this.currentRole?.roleUnits[0]?.auditorTeamCode as SearchAuditPlanAuditorTeamEnum;
  			this.yapPointAuditItemList = data.pointAuditItemOptions.map((e) => ({
  				key: e.value,
  				headerTitle: e.label,
  				yapPointAuditItems: [],
  			}));
  			this.onHandleSearch();
  			this.getYapUnit();
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
	}

	// API:查詢年度稽核計畫
	onHandleSearch() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.itemOptionCom = this.itemOption; // 查詢後，重新更新元件裡的 查核項目的下拉選單
  			// console.log('form', this.searchForm);
				this.getYapUnit(); // 重新查詢受查單位下拉選單
  			this.setLoading(true);
				const request: SearchAuditPlan = {
					...this.searchForm,
					auditItems: [],
				};
				this.searchForm.auditItems ? request.auditItems.push(this.searchForm.auditItems) : request.auditItems = undefined;
  			this.$auditPlanApi.searchYapInAuditPlanUsingPOST(request)
  				.then((resp) => {
  					const data = resp.data.result;
  					this.infoData.year = data.year.toString();
  					this.infoData.status.label = data.status;
  					this.infoData.status.value = this.$enum.getValue('yapStatusEnum', data.status);
  					this.isConfirmUser = data.confirmUser;
						this.yapReviewFlag = data.reviewFlag;
  					this.yapFrontEndArr = this.convertYapToFrontEndYap(data.values); // 轉成前端需要的格式
						// 複製一份舊資料 比對用 由於 JSON轉換時 undefined 會被轉成 null
						this.yapFrontEndArr = this.$global.deepCopyData(this.yapFrontEndArr);
						this.yapOriFrontEndArr = this.$global.deepCopyData(this.yapFrontEndArr);
						// 主管級＋審閱狀態需要判斷 是否可以審畢
						if (this.isSupervisor) {
							this.yapFrontEndArr = this.yapFrontEndArr.map((yapItem) => ({
								...yapItem,
								isReviewDone: this.checkIsReviewDone(yapItem),
							}));
						}

						this.showYapFrontEndArr = [];
  					this.showYapArrCount = 3;
  				})
  				.catch((error) => {
  					console.error();
						if (error.response?.data?.total == 0) {
							this.yapOriArr = [];
							this.yapFrontEndArr = [];
							this.yapFrontEndArr = [];
						} else {
							this.setModalState({
								resultModal: {
									visible: true,
									type: 'error',
									title: error.response?.data?.message,
								},
							});
						}
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  	});
	}

	// API:切換查詢列表年度 => 取得 查詢列表－查核項目
	async getAuditItem() {
  	this.setLoading(true);
  	const requestYear = this.searchForm.year.toString();
  	return this.$auditPlanApi.searchAuditItemInAuditPlanUsingGET(requestYear, false)
  		.then((resp) => {
  			const data = resp.data.result;
				this.itemOption = data;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API:取得計畫受檢單位下拉選單
	getYapUnit() {
  	this.setLoading(true);
  	const requestYear = this.searchForm.year.toString();
  	this.$auditPlanApi.searchYapUnitByYearInAuditPlanUsingGET(requestYear)
  		.then((resp) => {
  			this.unitList = resp.data.result;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 新增/編輯 查核項目
	modifyAuditItem(request: ModifyYapAuditItemAndName) {
		this.setLoading(true);
		// console.log(request);
		this.$auditPlanApi.modifyAuditItemInAuditPlanUsingPOST(request)
			.then(async (resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: `${request.auditItem ? '編輯' : '新增'}查核項目成功`,
  					autoClose: 3,
  				},
  			});
				await this.getAuditItem();
				this.itemOptionCom = this.itemOption;
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: `${request.auditItem ? '編輯' : '新增'}查核項目失敗`,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 組長 刪除 查核項目
	deleteYap(reamrk) {
  	this.setLoading(true);
  	this.$auditPlanApi.removeYapInAuditPlanUsingGET(reamrk, this.currentYapId)
  		.then((resp) => {
  			// 如果成功刪除，前端不重新載入所有查核項目，直接刪除刪除的項目
  			this.yapFrontEndArr.splice(this.yapFrontEndArr.findIndex((e) => e.yapId === this.currentYapId), 1);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '刪除成功',
  					autoClose: 3,
  				},
  			});
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 主管審畢(稽核室部主管/副總稽核/總稽核)
	reviewYaps({ yapId }) {
		this.setLoading(true);
		const request: ApproveYap = {
			year: parseInt(this.infoData.year),
			yapIds: [],
		};

		// 點擊審畢按鈕 上方所有 查核項目審畢按鈕 都必須要一起審畢
		const yapIndex = this.filterYapFrontEndArr.findIndex((e) => e.yapId === yapId);
		const upperYaps = this.filterYapFrontEndArr.filter((e, index) => {
			if (e.isReviewDone === 'toReview' && index <= yapIndex) {
				request.yapIds.push(e.yapId);
				return true;
			}
		});

		this.$auditPlanApi.approveYapByBossInAuditPlanUsingPOST(request)
  		.then((resp) => {
				let message = '審畢成功';
  			// 如果成功刪除，前端不重新載入所有查核項目，調整成 已審畢狀態
				upperYaps.forEach((e) => { e.isReviewDone = 'done'; });
				this.renderKey++;
				// 若回傳的已全部審閱完畢,額外提示訊息:‘已全部審閱完畢’, 並用回傳的資料(如查詢畫面的資料)更新畫面資料
				if (resp.data.message === '已全部審閱完畢') {
					this.onHandleSearch();
					message = '已全部審閱完畢';
				}
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: message,
  					autoClose: 3,
  				},
  			});
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '審畢失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 暫存
	async saveYap() {
		this.setLoading(true);
		await this.forceNextTick(async () => {
			if (await this.vaildateAllyapComp(true)) {
				if (this.filterYapFrontEndArr && this.filterYapFrontEndArr.length > 0) {
					this.checkHasModify(this.filterYapFrontEndArr);
					this.convertFrontEndYapToYap(this.filterYapFrontEndArr);
					this.$auditPlanApi.modifyYapInAuditPlanUsingPOST(this.yapSumbitArr)
						.then((resp) => {
							// console.log('resp', resp);
							this.setModalState({
								resultModal: {
									visible: true,
									type: 'success',
									title: '暫存成功',
									autoClose: 3,
								},
							});
							this.onHandleSearch();
						})
						.catch(() => {
							console.error();
							this.setModalState({
								resultModal: {
									visible: true,
									type: 'error',
									title: '暫存失敗',
								},
							});
						})
						.finally(() => {
							this.setLoading(false);
						});
				} else {
					this.setLoading(false);
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'warning',
							title: '無可暫存的資料',
						},
					});
				}
			} else {
				this.setLoading(false);
			}
		});
	}

	// API: 匯出
	handleExport(include) {
  	this.setLoading(true);
  	this.searchForm.includeAuditTeam = include;
  	const fileName = `${this.searchForm.year}年度富邦人壽稽核計畫一覽表${include ? '(有組別)' : '(無組別)'}.docx`;
		const request: SearchAuditPlan = {
			...this.searchForm,
			auditItems: undefined,
		};
  	this.$auditPlanApi.exportWordOfYapReportInAuditPlanUsingPOST(request, { responseType: 'blob' })
  		.then((resp) => {
  			this.$blobUtils.download(
					resp.data as unknown as Blob,
					fileName,
  			);
  			console.log(resp);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '下載成功',
  					autoClose: 3,
  				},
  			});
  		})
			.catch(async (err) => {
				console.log('匯出err', err.response.data);
				this.setModalState({
					resultModal: {
						title: '匯出失敗',
						visible: true,
						type: 'error',
					},
				});
  		})
			.finally(() => {
  			this.setLoading(false);
  		});
  	this.exportModalShow = false;
	}

	// API: 行政組組長結案
	closeYapByTeamHead() {
  	this.setLoading(true);
  	this.$auditPlanApi.closeYapByTeamHeadInAuditPlanUsingGET(String(this.infoData.year)).then((resp) => {
  		this.$router.push({ name: 'AuditPlanResult' });
  	}).catch((err) => {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				title: '結案失敗',
  				content: err.response.data.message,
  				type: 'error',
  			},
  		});
  	}).finally(() => {
  		this.setLoading(false);
  	});
	}

	// API: 行政組組長退回
	rejectByAdminHead(payload) {
  	this.setLoading(true);
  	const request = {
  		auditItems: payload.auditItems,
			remark: payload.applyRemark,
  		year: Number(this.infoData.year),
  	};
  	this.$auditPlanApi.rejectYapByTeamHeadInAuditPlanUsingPOST(request).then((resp) => {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'success',
  				title: '審核退回成功',
  				autoClose: 3,
  			},
  		});
			this.onHandleSearch();
  	}).catch((err) => {
  		console.log(err.response.data);
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				content: err.response.data.message,
  				title: '審核退回失敗',
  				type: 'error',
  			},
  		});
  	}).finally(() => {
  		this.setLoading(false);
  	});
	}

	// API: 取得 主管級 在審閱狀態可以退回的查核項目
	getSupervisorReturnAuditItem() {
		this.setLoading(true);
		const vm = this;
  	const request: SearchAuditPlan = {
  		year: parseInt(this.infoData.year),
  	};
		this.$auditPlanApi.searchYapInAuditPlanUsingPOST(request)
			.then((resp) => {
				const data = resp.data.result;
				console.log('data', data);
				const auditItemList = [];
				const frontEndYaps = this.convertYapToFrontEndYap(data.values);
				frontEndYaps.forEach((yap) => {
					yap.isReviewDone = this.checkIsReviewDone(yap);
					console.log(yap);
					if (yap.isReviewDone === 'toReview') {
						console.log('yap.isReviewDone', yap.isReviewDone);
						// 判斷是否有重複的查核項目
						if (auditItemList.find((auditItem) => auditItem.value === yap.auditItem) === undefined) {
							auditItemList.push({
								label: yap.auditItem,
								value: yap.auditItem,
							});
						}
					}
				});
				vm.reviewCommitModal.auditItemList = auditItemList.map((auditItem) => vm.itemOptionCom.find((itemOption) => auditItem.value === itemOption.value));
				console.log('vm.reviewCommitModal.auditItemList', vm.reviewCommitModal.auditItemList);
			})
			.catch((error) => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: error.response?.data?.message,
						autoClose: 3,
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// ---------------------------------- 專案查核範圍 ----------------------------------//
	// API: 確認修改專案查核範圍(組長/稽核室部主管/副總稽核/總稽核)
	 projectScopeContentModify({ request }) {
		this.setLoading(true);
		this.$auditPlanApi.modifyYapProjectScopeContentInAuditPlanUsingPOST(request)
			.then(async (resp) => {
				// console.log('resp', resp);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '確認修改專案查核範圍成功',
						autoClose: 3,
					},
				});

				// 送出修改成功後，重新更新這一項 yap
				const editYap = this.findYap(this.yapFrontEndArr, request.yapId);
				const updatedValue = await this.findYapFromDatabase(editYap);
				updatedValue.isReviewDone = this.checkIsReviewDone(updatedValue);
				this.updateYapArr({
					yapArr: this.yapFrontEndArr,
					yapId: editYap.yapId,
					updatedValue,
				});
			})
			.catch(() => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '確認修改專案查核範圍失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 取得組長退回意見
	getRejectReason({ yapPointAuditItemId }) {
		this.setLoading(true);
		this.$auditPlanApi.searchRejectOfYapPointAuditItemInAuditPlanUsingGET(yapPointAuditItemId)
			.then((resp) => {
				this.leaderOpinionModal.message = (resp.data.result as any).remark;
				this.leaderOpinionModal.visible = true;
			})
			.catch((error) => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: error.response.data.message,
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 專案查核範圍 比對資料
	getYapProjectScopeLog({ yapId, isEdit }) {
		this.setLoading(true);
		// 初始化
		this.compareModal.nowData = {};
		this.compareModal.oldData = [];
		this.$auditPlanApi.searchYapProjectScopeLogInAuditPlanUsingGET(yapId)
			.then((resp) => {
				this.compareModal.oldData = resp.data.result.map((i) => ({
					dateTime: i.updateDatetime,
					title: i.updateRole,
					staffname: i.updateUser,
					text: i.yapProjectScopeContent || '',
				}));
			})
			.catch((error) => {
				console.error();
				if (error.response?.data?.total === 0) {
					this.compareModal.visible = true;
				} else {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: error.response.data.message,
						},
					});
				}
			})
			.finally(() => {
				// 可編輯 才將目前資料納入比對
				if (isEdit) {
					// 取得目前 專案查核範圍
					const yapProject = this.yapFrontEndArr.find((i) => i.yapId === yapId);
					// 目前輸入框中 新的內容 (沒有輸入資料不比對)
					if (yapProject.yapProjectScopeContent) {
						this.compareModal.nowData = {
							// dateTime: this.$twDateTimeFormatter.stringify(new Date()),
							dateTime: '當前編輯項目',
							title: JSON.parse(sessionStorage.currentRoleData).name || '',
							staffname: this.$user.getMe().employee.name,
							text: yapProject.yapProjectScopeContent,
						};
					}
				}
				if (this.compareModal.oldData.length > 0 || Object.keys(this.compareModal.nowData).length > 0) {
					this.compareModal.visible = true;
				}
				this.setLoading(false);
			});
	}

	// API: 專案查核範圍 取得 提問/回覆提問
	getYapProjectScopeQA({
		yapId, QAStatus, yapStatus, reviewLevel, rejectFlag,
	}) {
		this.QAModal.QAData = [];
		this.QAModal.yapId = yapId;
		this.QAModal.yapPointAuditItemId = null;
		this.QAModal.QAStatus = QAStatus;
		this.QAModal.yapStatus = yapStatus;
		this.QAModal.reviewLevel = reviewLevel;
		this.QAModal.rejectFlag = rejectFlag;
		console.log('this.QAModal', this.QAModal);
		this.$auditPlanApi.searchQAOfYapProjectScopeInAuditPlanUsingGET(yapId)
  		.then((resp) => {
  			this.QAModal.QAData = resp.data.result;
  		})
  		.catch((error) => {
  			console.error();
  		})
  		.finally(() => {
				this.QAModal.visiable = true;
				this.setLoading(false);
  		});
	}

	// API: 更新年度稽核計畫提問狀態 => 用主管將待回覆狀態改為 null
	changeQAStatusToNull({ yapId, id, type }) {
		this.setLoading(true);
		return this.$auditPlanApi.modifyYapQaStatusInAuditPlanUsingGET(id, type)
			.then((resp) => {
  			this.changeYapProjectScopeQAStatus(yapId);
  		})
  		.catch((error) => {
  			console.error();
  		})
  		.finally(() => {
				this.setLoading(false);
  		});
	}

	// 修改專案查核範圍 QA 狀態
	async changeYapProjectScopeQAStatus(yapId) {
		// 送出修改成功後，重新更新這一項 yap，重新更新彈窗 QAStatus
		const editYap = this.findYap(this.yapFrontEndArr, yapId);
		const updatedValue = await this.findYapFromDatabase(editYap);
		this.QAModal.QAStatus = updatedValue.yapProjectScopeQaStatus;
		updatedValue.isReviewDone = this.checkIsReviewDone(updatedValue);
		this.updateYapArr({
			yapArr: this.yapFrontEndArr,
			yapId: editYap.yapId,
			updatedValue,
		});
	}

	// ---------------------------------- 重點查核項目 ----------------------------------//
	// API: 組長／查核人員 刪除查核項目
	deletePointAuditItem({ yapPointAuditItemId, yapId }) {
		this.setLoading(true);
		this.$auditPlanApi.removeYapPointAuditItemInAuditPlanUsingGET(yapPointAuditItemId)
			.then(async (resp) => {
				// console.log('resp', resp);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '刪除重點查核項目成功',
						autoClose: 3,
					},
				});

				// 送出修改成功後，重新更新這一項 yap
				const editYap = this.findYap(this.yapFrontEndArr, yapId);
				const updatedValue = await this.findYapFromDatabase(editYap);
				this.updateYapArr({
					yapArr: this.yapFrontEndArr,
					yapId: editYap.yapId,
					updatedValue,
				});
			})
			.catch(() => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '刪除重點查核項目失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 重點查核項目 比對資料
	getYapPointAuditItemLog({ isEdit }) {
		this.setLoading(true);
		// 初始化
		this.compareModal.nowData = {};
		this.compareModal.oldData = [];
		this.$auditPlanApi.searchYapPointAuditItemLogInAuditPlanUsingGET(this.currentYapPointAuditItem.yapPointAuditItemId)
			.then((resp) => {
				this.compareModal.oldData = resp.data.result.map((i) => ({
					dateTime: i.applyDatetime,
					title: i.applyRole,
					staffname: i.applyUser,
					text: i.itemContent || '',
				}));
			})
			.catch((error) => {
				console.error();
				if (error.response?.data?.total === 0) {
					this.compareModal.visible = true;
				} else {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: error.response.data.message,
						},
					});
				}
			})
			.finally(() => {
				// 目前資料不用比對，只要帶出資料庫資料即可
				if (isEdit) {
					// 目前輸入框中 新的內容 (沒有輸入資料不比對)
					if (this.currentYapPointAuditItem.yapPointAuditItem.itemContent) {
						this.compareModal.nowData = {
							dateTime: '當前編輯項目',
							title: JSON.parse(sessionStorage.currentRoleData).name || '',
							staffname: this.$user.getMe().employee.name,
							text: this.currentYapPointAuditItem.yapPointAuditItem.itemContent || '',
						};
					}
				}
				if (this.compareModal.oldData.length > 0) {
					this.compareModal.visible = true;
				}
				this.setLoading(false);
			});
	}

	// API: 重點查核項目 資料關聯
	getDataCollectDetail({ yapPointAuditItemId, copyYapPointAuditItemId }) {
		this.setLoading(true);
		// 初始化
		this.connectDataModal.data = [];
		const request = yapPointAuditItemId.includes('copy') ? copyYapPointAuditItemId : yapPointAuditItemId;
		this.$auditPlanApi.searchDataCollectDetailInAuditPlanUsingGET(request)
			.then((resp) => {
				this.connectDataModal.data = resp.data.result;
				this.connectDataModal.visible = true;
			})
			.catch((error) => {
				if (error?.response?.data?.total === 0) {
					this.connectDataModal.visible = true;
				} else {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: error?.response?.data?.message,
						},
					});
				}
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 重點查核項目 取得 提問/回覆提問
	getYapItemScopeQA({
		yapId, yapPointAuditItemId, QAStatus, yapStatus, reviewLevel, rejectFlag,
	}) {
		this.QAModal.QAData = [];
		this.QAModal.yapId = yapId;
		this.QAModal.yapPointAuditItemId = yapPointAuditItemId;
		this.QAModal.QAStatus = QAStatus;
		this.QAModal.yapStatus = yapStatus;
		this.QAModal.reviewLevel = reviewLevel;
		this.QAModal.rejectFlag = rejectFlag;
		this.$auditPlanApi.searchQAOfYapPointAuditItemInAuditPlanUsingGET(yapPointAuditItemId)
  		.then((resp) => {
  			this.QAModal.QAData = resp.data.result;
  		})
  		.catch((error) => {
  			console.error();
  		})
  		.finally(() => {
				this.QAModal.visiable = true;
  			this.setLoading(false);
  		});
	}

	// API: 組長 通過/退回 重點查核項目
	confirmPointAuditItem({ agree, remark, yapId }) {
		this.setLoading(true);
		const request: ModifyYapPointAuditItem = {
			agree,
			remark,
			yapPointAuditItemId: this.currentYapPointAuditItem.yapPointAuditItemId,
			itemContent: this.currentYapPointAuditItem.yapPointAuditItem.itemContent,
		};
		this.$auditPlanApi.modifyYapPointAuditItemInAuditPlanUsingPOST(request)
			.then(async (resp) => {
				// console.log('resp', resp);
				// console.log('this.currentYapPointAuditItem', this.currentYapPointAuditItem);

				// 送出修改成功後，重新更新這一項 yap
				const editYap = this.findYap(this.yapFrontEndArr, yapId);
				const updatedValue = await this.findYapFromDatabase(editYap);
				updatedValue.isReviewDone = this.checkIsReviewDone(updatedValue);
				this.updateYapArr({
					yapArr: this.yapFrontEndArr,
					yapId: editYap.yapId,
					updatedValue,
				});

				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '組長覆核重點查核項目成功',
						autoClose: 3,
					},
				});
			})
			.catch(() => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '組長覆核重點查核項目失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 確認修改重點查核項目(組長/稽核室部主管/副總稽核/總稽核)
	yapPointAuditItemModify({ request, yapId }) {
		this.setLoading(true);
		this.$auditPlanApi.modifyContentOfYapPointAuditItemInAuditPlanUsingPOST(request)
			.then(async (resp) => {
				// console.log('resp', resp);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '確認修改重點查核項目成功',
						autoClose: 3,
					},
				});

				// 送出修改成功後，重新更新這一項 yap
				const editYap = this.findYap(this.yapFrontEndArr, yapId);
				const updatedValue = await this.findYapFromDatabase(editYap);
				updatedValue.isReviewDone = this.checkIsReviewDone(updatedValue);
				this.updateYapArr({
					yapArr: this.yapFrontEndArr,
					yapId: editYap.yapId,
					updatedValue,
				});
			})
			.catch(() => {
				console.error();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '確認修改重點查核項目失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 修改重點查核項目 QA 狀態
	async changeYapItemScopeQAStatus(yapId) {
		// 送出修改成功後，重新更新這一項 yap，重新更新彈窗 QAStatus
		const editYap = this.findYap(this.yapFrontEndArr, yapId);
		const updatedValue = await this.findYapFromDatabase(editYap);
		this.QAModal.QAStatus = updatedValue.yapProjectScopeQaStatus;
		updatedValue.isReviewDone = this.checkIsReviewDone(updatedValue);
		this.updateYapArr({
			yapArr: this.yapFrontEndArr,
			yapId: editYap.yapId,
			updatedValue,
		});
	}

	// ---------------------------------- 送出覆核 ----------------------------------//

	// API: 查核人員 送出覆核
	async auditorApplyYaps() {
		this.setLoading(true);
		await this.forceNextTick(async () => {
			if (await this.vaildateAllyapComp()) {
				this.checkHasModify(this.filterYapFrontEndArr);
				this.convertFrontEndYapToYap(this.filterYapFrontEndArr);
				this.$auditPlanApi.applyYapByAuditorInAuditPlanUsingPOST(this.yapSumbitArr)
					.then((resp) => {
						this.onHandleSearch();
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'success',
								title: '送出覆核成功',
								autoClose: 3,
							},
						});
					})
					.catch((error) => {
						const errMsg = error.response.data.message;
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'error',
								title: '送出覆核失敗',
								content: errMsg,
							},
						});
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else {
				this.setLoading(false);
			}
		});
	}

	// API: 組長 送出覆核
	async teamHeadApplyYaps() {
		this.setLoading(true);
		// this.forceNextTick(() => {
		// 	this.showYapArrCount = this.filterYapFrontEndArr.length;
		// 	this.handleShowYapArr();
		// });
		this.forceNextTick(async () => {
			if (await this.vaildateAllyapComp()) {
				this.checkHasModify(this.filterYapFrontEndArr);
				this.convertFrontEndYapToYap(this.filterYapFrontEndArr);
				this.$auditPlanApi.applyYapByTeamHeadInAuditPlanUsingPOST(this.yapSumbitArr)
					.then((resp) => {
						this.onHandleSearch();
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'success',
								title: '送出覆核成功',
								autoClose: 3,
							},
						});
					})
					.catch((error) => {
						const errMsg = error.response.data.message;
						this.setModalState({
							resultModal: {
								visible: true,
								type: 'error',
								title: '送出覆核失敗',
								content: errMsg,
							},
						});
					})
					.finally(() => {
						this.setLoading(false);
					});
				this.setLoading(false);
			} else {
				this.setLoading(false);
			}
		});
	}

	/**
	 * Event
	 */

	// action 按鈕事件
	actionBarEmitEvent({ type, payload }) {
  	// console.log(type);
  	// console.log(type, payload);
  	switch (type) {
		case 'setAuditItems': // 查核項目設定
			this.setAuditItemsModal.visiable = true;
			break;

  	case 'export': // 匯出
  		this.exportModalShow = true;
  		break;

  	case 'submitReview':	// 送出覆核
			if (!this.filterYapFrontEndArr || this.filterYapFrontEndArr.length === 0) {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'warning',
						title: '無可送出的資料',
					},
				});
			} else {
				// 判斷哪些 yap 有調整過的
				if (this.currentRoleId === 'ROLE_Audit_Team_Head') {
					this.teamHeadApplyYaps();
				}
				if (this.currentRoleId === 'ROLE_Auditor') {
					this.auditorApplyYaps();
				}
			}
  		break;

  	case 'save': // 暫存
  		console.log('暫存');
  		this.saveYap();
  		break;

  	case 'return': // 行政組組長、部主管、副總稽核、總稽核 退回
  		// console.log('行政組組長退回');
  		this.reviewCommitModal = {
				yapId: null,
  			visible: true,
  			type: this.isSupervisor ? 'supervisorReturn' : 'adminReturn',
  			title: '審核退回',
  			label: '退回意見',
				auditItemList: null,
  		};
  		break;

  	case 'caseClose': // 行政組組長結案
  		console.log('結案');
  		this.closeYapByTeamHead();
  		break;

  	case 'history': // 編制歷程
  		console.log('編制歷程');
  		this.historyshow = true;
  		break;
  	}
	}

	// 側邊按鈕事件－複製、刪除、審畢、匯入
	slideClickEvent({ type, payload }) {
  	switch (type) {
  	case 'inspectedUnit': // 顯示	計畫受檢單位 清單
  		this.showInspectedUnit(payload.validUnits, payload.inValidUnits);
  		break;

  	case 'import': // 匯入舊資料 (整份查核資料)
			this.importModal = {
				yap: payload.yap,
				yapYear: this.infoData.year,
				visiable: true,
			};
  		break;

  	case 'delete': // 刪除
			console.log('payload.yapId', payload.yapId);
			this.currentYapId = payload.yapId;
			if (payload.yapId.includes('copy')) { // 如果是複製的項目且未被暫存到資料庫則直接刪除
				this.deleteYapOnFrontEnd(payload.yapId);
			} else {
				// 已記在資料庫，呼叫API刪除
				this.reviewCommitModal = {
					yapId: null,
					type: 'leaderDelete',
					visible: true,
					title: '刪除查核項目',
					label: '刪除意見',
					auditItemList: null,
				};
  	}
  		break;
		case 'copy': // 複製 (整份查核資料)
			this.addCopyYap({ yapId: payload.yapId, copyContent: payload.copyContent });
			break;
  	case 'review': // 主管審畢
			this.reviewYaps({ yapId: payload.yapId });
  		break;
  	}
	}

	// textarea 小按鈕事件
	async emitEvent({ type, payload }) {
  	// console.log(type, payload);
  	switch (type) {
		// ------------------ 專案查核範圍 ------------------ //
		case 'project-comparison':		// 比對 專案查核範圍
			this.getYapProjectScopeLog(payload);
			break;
		case 'project-questionItem':		// 回覆提問 專案查核範圍
			if (payload.isSupervisorReaded) {
				await this.changeQAStatusToNull({
					yapId: payload.yapId,
					id: payload.yapId,
					type: 'yap',
				});
			}
			this.getYapProjectScopeQA(payload);
  		break;

		// ------------------ 重點查核項目 ------------------ //
  	case 'comparison':		// 比對 重點查核項目
			this.currentYapPointAuditItem = {
				yapId: payload.yapId,
				yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
				yapPointAuditItemId: payload.yapPointAuditItemId,
				yapPointAuditItem: this.findYapPointAuditItem({
					frontEndYapArr: this.filterYapFrontEndArr,
					yapId: payload.yapId,
					yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
					yapPointAuditItemId: payload.yapPointAuditItemId,
				}),
			};
  		this.getYapPointAuditItemLog({ isEdit: payload.isEdit });
  		break;
		case 'linkItem':		// 連結 重點查核項目
			this.getDataCollectDetail(payload);
  		break;

  	case 'project-confirmItem':		// 確認修改 專案查核範圍
			this.projectScopeContentModify(payload);
			break;

  	case 'questionItem':	// 回覆提問 重點查核項目
			this.currentYapPointAuditItem = {
				yapId: payload.yapId,
				yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
				yapPointAuditItemId: payload.yapPointAuditItemId,
				yapPointAuditItem: this.findYapPointAuditItem({
					frontEndYapArr: this.filterYapFrontEndArr,
					yapId: payload.yapId,
					yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
					yapPointAuditItemId: payload.yapPointAuditItemId,
				}),
			};
			if (payload.isSupervisorReaded) {
				await this.changeQAStatusToNull({
					yapId: payload.yapId,
					id: payload.yapPointAuditItemId,
					type: 'yapPointAuditItem',
				});
			}
  		this.getYapItemScopeQA(payload);
  		break;

  	case 'confirmItem':		// 確認修改 重點查核項目
			this.yapPointAuditItemModify(payload);
  		break;

  	case 'reviewItem':		// 組長 審核通過/退回 重點查核項目
  		this.currentYapPointAuditItem = {
				yapId: payload.yapId,
				yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
				yapPointAuditItemId: payload.yapPointAuditItemId,
				yapPointAuditItem: this.findYapPointAuditItem({
					frontEndYapArr: this.filterYapFrontEndArr,
					yapId: payload.yapId,
					yapPointAuditItemMapId: payload.yapPointAuditItemMapId,
					yapPointAuditItemId: payload.yapPointAuditItemId,
				}),
			};
			this.reviewCommitModal = {
				yapId: payload.yapId,
  			type: payload.type,
  			visible: true,
  			title: payload.title,
  			label: payload.label,
				auditItemList: null,
  		};
			// console.log('this.currentYapPointAuditItem', this.currentYapPointAuditItem);
  		break;

  	case 'LeaderOpinion':		// 組長退回意見 重點查核項目
  		this.getRejectReason(payload);
  		break;

  	case 'deletePointAuditItem': // 查核人員／組長刪除 重點查核項目
  		this.deletePointAuditItem({ yapPointAuditItemId: payload.yapPointAuditItemId, yapId: payload.yapId });
  		break;
  	}
	}

	// 審核退回彈窗- 審核、退回、刪除、行政組長退回
	reviewModalClickEvent({ type, payload }) {
  	switch (type) {
		case 'return': // 行政組組長、部主管、副總稽核、總稽核 退回
			this.rejectByAdminHead(payload);
			break;

  	case 'leaderDelete': // 組長 刪除查核項目
  		this.deleteYap(payload);
  		break;

  	case 'leaderApproval': // 組長通過 查核人員 重點查核項目 刪除或變更
			this.confirmPointAuditItem({
				agree: true,
				remark: payload.remark,
				yapId: payload.yapId,
			});
  		break;

  	case 'leaderReturn': // 組長退回 查核人員 重點查核項目 刪除或變更
			this.confirmPointAuditItem({
				agree: false,
				yapId: payload.yapId,
				remark: payload.remark,
			});
  		break;
  	}
	}

	// 取得年度稽核計畫資料必須先轉成前端需要的格式
	convertYapToFrontEndYap(YapArray: YapDto[]): YapFrontEndDto[] {
		console.log(YapArray);
		return YapArray.map((e) => {
			const yapPointAuditItemMaps: yapFrontEndPointAuditItem[] = this.$global.deepCopyData(this.yapPointAuditItemList).map((i) =>
				// console.log('e.yapPointAuditItemMap[i.key]', e.yapPointAuditItemMap[i.key]);
				({
					...i,
					yapPointAuditItems: e.yapPointAuditItemMap[i.key] || [],
				}));
			yapPointAuditItemMaps.forEach((yapPointAuditItemMap) => {
				// 重點查核項目：確認修改、待確認功能 比對有無修改使用 originalItemContent
				yapPointAuditItemMap.yapPointAuditItems.forEach((item) => { item.originalItemContent = item.itemContent; });
			});
			return {
				...e,
				yapPointAuditItemMap: yapPointAuditItemMaps,
				isReviewDone: 'N', // 確認查核案件審畢狀態 'N' 為不能審畢
				originalYapProjectScopeContent: e.yapProjectScopeContent, // 專案查核範圍：確認修改、待確認比對有無修改使用
				isShow: false,
			};
		});
		// console.log('整理完yapFrontEndArr', this.yapFrontEndArr);
	}

	// 將前端編輯過轉成 覆核、暫存所需的modifyYaps格式
	convertFrontEndYapToYap(YapFrontEndArray: YapFrontEndDto[]) {
		// console.log('轉換', YapFrontEndArray);
		this.yapSumbitArr = {
			year: parseInt(this.infoData.year),
			values: null,
		};
		this.yapSumbitArr.values = YapFrontEndArray.map((e) => {
			// 刪除前端使用參數isReviewDone、isShow、originalYapProjectScopeContent、originalItemContent
			delete e.isReviewDone;
			delete e.isShow;
			delete e.originalYapProjectScopeContent;
			e.yapPointAuditItemMap.forEach((yapPointAuditItemMap) => {
				yapPointAuditItemMap.yapPointAuditItems.forEach((item) => { delete item.originalItemContent; });
			});

			const yapPointAuditItemMap = e.yapPointAuditItemMap.reduce((a, v) => {
				if (v.yapPointAuditItems.length >= 1) {
					return { ...a, [v.key]: v.yapPointAuditItems };
				}
				return a;
			}, {});
			return {
				...e,
				yapPointAuditItemMap,
			};
		});
	}

	// 比對哪些是修改過後的項目
	checkHasModify(filterYapFrontEndArr: YapFrontEndDto[]) {
		this.isYapModify = false;
  	filterYapFrontEndArr.forEach((e) => {
  		// console.log('e.modify', e.modify);
			let oriYapData = null;
			if (e.modify) this.isYapModify = true;
  		if (!e.modify) { // 有修改過的不用比對
  			oriYapData = this.yapOriFrontEndArr.find((ori) => ori.yapId === e.yapId);
  			// console.log('yapOriFrontEndArr', this.yapOriFrontEndArr);
  			// console.log('oriYapData', oriYapData);

  			if (oriYapData == undefined) return; 	// 舊資料沒有存在的查核項目 不用比對
  			// 比較非重點查核項目部分
  			const oriYapItems = { ...oriYapData };
  			delete oriYapItems.yapPointAuditItemMap; // 不用比重點查核項目
				delete oriYapItems.isShow; // 不用比顯示參數
  			const editYapItems = { ...e };
  			delete editYapItems.yapPointAuditItemMap; // 不用比重點查核項目
				delete editYapItems.isShow; // 不用比顯示參數
  			// console.log('JSON.stringify(oriYapItems)', JSON.stringify(oriYapItems));
  			// console.log('JSON.stringify(editYapItems)', JSON.stringify(editYapItems));
  			// TEST: 哪個效能好？
  			e.modify = JSON.stringify(oriYapItems) !== JSON.stringify(editYapItems);
				// console.log('e.modify', e.modify);
				if (e.modify === true) this.isYapModify = true;
  		}
  		// 比較重點查核項目
			// console.log('比較重點查核項目', e.yapPointAuditItemMap);
  		e.yapPointAuditItemMap?.forEach((yapPoint, index) => {
  			if (yapPoint.yapPointAuditItems.length === 0) return;
  			yapPoint.yapPointAuditItems.forEach((auditItem) => {
  				// console.log('auditItem.modify', auditItem.modify);
  				if (auditItem.modify) { this.isYapModify = true; return; } // 有修改過得不用比對
  				const oriData = oriYapData?.yapPointAuditItemMap[index].yapPointAuditItems.find((ori) => ori.yapPointAuditItemId === auditItem.yapPointAuditItemId);
  				// console.log('oriData重點', oriData);
  				// console.log('重點', auditItem);

  				if (oriData == undefined) return; 	// 舊資料沒有存在的重點查核項目 不用比對
  				auditItem.modify = auditItem.itemContent !== oriData.itemContent;
  				if (auditItem.modify === true) this.isYapModify = true;
  			});
  		});
  	});
  	console.log('checkHasModify後的yapFrontEndArr', this.yapFrontEndArr);
	}

	// TEST: object 比較效能？
	shallowEqual(object1, object2) {
  	const keys1 = Object.keys(object1);
  	const keys2 = Object.keys(object2);

  	// cannot simply compare key-array lengths as lengths could be same while the keys themselves differ
  	// cannot skip this check either and just check the values of all keys concatenated
  	// because { "key": undefined }["key"] and {}["key"] would equal incorrectly
  	for (const k of keys1) if (!keys2.includes(k)) return false;
  	for (const k of keys2) if (!keys1.includes(k)) return false;

  	for (const key of keys1) if (object1[key] !== object2[key]) return false;

  	return true;
	}

	// 依照全查核、待確認、未審畢，判斷是否要顯示哪些查核項目
	isShowYapCom(item: YapFrontEndDto): boolean {
		// console.log('判斷是否要顯示哪些查核項目');
  	const roleTeam = this.currentRole.roleUnits[0]?.auditorTeamCode;
		const isInMainTeam = roleTeam === item.originalMainAuditorTeam; // 是否有在主辦組
		const isInCoTeam = (item.coAuditorTeam.find((e) => e === roleTeam) !== undefined); // 是否有在協辦組
		// 全部的重點查核項目
		const yapPointAuditItem: YapPointAuditItemDto[] = item.yapPointAuditItemMap.map((e) => [...e.yapPointAuditItems]).reduce((prev, curr) => prev.concat(curr));

  	switch (this.currentRole.id) {
  	case 'ROLE_Auditor': // 查核人員
  		if (this.searchItem === 'all') return true; // 全查核項目
  		if (this.searchItem === 'toReview') return false; // 未審畢查核項目
  	 	// 待確認查核項目
  		if (this.searchItem === 'todo'
				&& (item.yapStatus === 'A' || item.yapStatus === 'B')
				&& (isInMainTeam || isInCoTeam)
				&& (yapPointAuditItem.find((e) => e.checkAuditor === this.$user.getMe().employee.domainId) !== undefined)) {
  			return true;
  		}

			// 進行中查核項目
			if (this.searchItem === 'doing') {
				if (item.yapStatus === 'B') return true;
				if (item.yapStatus === 'C' && item.rejectFlag) return true;
			}

  		return false;

  	case 'ROLE_Audit_Team_Head': // 組長
  		if (this.searchItem === 'all') return true; // 全查核項目
  		if (this.searchItem === 'toReview') return false; // 未審畢查核項目
  		// 待確認查核項目
  		if (this.searchItem === 'todo'
					&& (isInMainTeam || isInCoTeam)
					&& (item.yapProjectScopeQaStatus === 'Q'
							|| item.yapProjectScopeCheckStatus === 'LEADER'
							|| yapPointAuditItem.find((e) => e.itemCheckStatus === 'LEADER')
							|| yapPointAuditItem.find((e) => e.itemQAStatus === 'Q')
							|| yapPointAuditItem.find((e) => e.hasReviewFlag === true))
  		) {
  			return true;
  		}
			// 進行中查核項目
			if (this.searchItem === 'doing') {
				if (item.yapStatus === 'B') return true;
				if (item.yapStatus === 'C' && item.rejectFlag) return true;
			}
  		return false;

  	case 'ROLE_Audit_Department_Head': // 部主管
  		if (this.searchItem === 'all') return true; // 全查核項目
  		// 未審畢查核項目
  		if (this.searchItem === 'toReview' && item.yapStatus === 'C' && item.reviewLevel === '1' && item.isReviewDone !== 'done') return true;
  		// 待確認查核項目
  		if (this.searchItem === 'todo') {
				if (item.rejectFlag) return false;
				if ((item.reviewLevel === '1' && item.yapStatus === 'C')
					&& (item.yapProjectScopeCheckStatus === 'MASTER'
							|| item.yapProjectScopeQaStatus === 'A'
							|| yapPointAuditItem.find((e) => e.itemCheckStatus === 'MASTER')
							|| yapPointAuditItem.find((e) => e.itemQAStatus === 'A')
							|| item.isReviewDone === 'toReview')) return true;
  		}

  		return false;

  	case 'ROLE_Audit_Office_Boss_Vice': // 副總稽核
  		if (this.searchItem === 'all') return true; // 全查核項目
  		// 未審畢查核項目
			if (this.searchItem === 'toReview' && item.yapStatus === 'C' && item.reviewLevel === '2' && item.isReviewDone !== 'done') return true;
  		// 待確認查核項目
  		if (this.searchItem === 'todo') {
				if (item.rejectFlag) return false;
				if ((item.reviewLevel === '2' && item.yapStatus === 'C')
					&& (item.yapProjectScopeCheckStatus === 'MASTER'
							|| item.yapProjectScopeQaStatus === 'A'
							|| yapPointAuditItem.find((e) => e.itemCheckStatus === 'MASTER')
							|| yapPointAuditItem.find((e) => e.itemQAStatus === 'A')
							|| item.isReviewDone === 'toReview')) return true;
  		}
  		return false;

  	case 'ROLE_Audit_Office_Boss': // 總稽核
  		if (this.searchItem === 'all') return true; // 全查核項目
  		// 未審畢查核項目
			if (this.searchItem === 'toReview' && item.yapStatus === 'C' && item.reviewLevel === '3' && item.isReviewDone !== 'done') return true;
  		// 待確認查核項目
   		if (this.searchItem === 'todo') {
				if (item.rejectFlag) return false;
				if ((item.reviewLevel === '3' && item.yapStatus === 'C')
					&& (item.yapProjectScopeCheckStatus === 'MASTER'
							|| item.yapProjectScopeQaStatus === 'A'
							|| yapPointAuditItem.find((e) => e.itemCheckStatus === 'MASTER')
							|| yapPointAuditItem.find((e) => e.itemQAStatus === 'A')
							|| item.isReviewDone === 'toReview')) return true;
  		}
  		return false;
  	}
	}

	// 檢核是否所有的yapComp都有通過欄位驗證檢核
	async vaildateAllyapComp(isSave?: boolean): Promise<boolean> {
  	this.setLoading(true);
		const prmiseArr = [];
		const yapCompArr = this.$refs.yapComp as any;
		let isValid = true;
		if ((yapCompArr && yapCompArr.length > 0)) {
			(this.$refs.yapComp as any).forEach((element) => {
				isSave ? prmiseArr.push(element.validate(isSave)) : prmiseArr.push(element.validate());
				// prmiseArr.push(element.validate());
			});
			await Promise.all(prmiseArr)
				.then((resp) => {
					// console.log('resp', resp);
					isValid = (resp.find((e) => e === false) === undefined);
					if (!isValid) {
						// setTimeout(() => {
						// 	const getErrorEle = this.$el.querySelector('.has-error');
						// 	console.log('getErrorEle', getErrorEle);
						// 	if (getErrorEle) {
						// 		getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
						// 	}
						// 	this.setLoading(false);
						// }, 500);
						const getErrorEle = this.$el.querySelector('.has-error');
						console.log('getErrorEle', getErrorEle);
						if (getErrorEle) {
							getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
						}
						this.setLoading(false);
					} else {
						this.setLoading(false);
					}
				})
				.catch(() => {
					isValid = false;
					this.setLoading(false);
				});
			// .finally(() => {
			// });
		} else {
			this.setLoading(false);
			isValid = true;
		}
		return isValid;
  	// console.log('result', result);
	}

	// 顯示受查單位全部清單＋彈窗
	showInspectedUnit(validUnits, inValidUnits) {
  	// 加上有效／無效 狀態
  	const validUnitsList = validUnits ? validUnits.map((e) => ({ ...e, isValid: true })) : [];
  	const inValidUnitsList = inValidUnits ? inValidUnits.map((e) => ({ ...e, isValid: false })) : [];
  	this.inspectedUnitModal.unitsList = validUnitsList.concat(inValidUnitsList);
  	this.inspectedUnitModal.visiable = true;
	}

	// 複製 整份查核項目
	addCopyYap({ yapId, copyContent }) {
		// console.log('copyContent', copyContent);
		const index = this.yapFrontEndArr.findIndex((e) => e.yapId === yapId) + 1;
		const $copyItem = {
			...copyContent,
			yapId: `copy${uuid.v4()}`,
			modify: true,
			startMonth: '0',
			endMonth: '0',
		};
		// console.log('$copyItem', $copyItem);
		$copyItem.yapPointAuditItemMap.map((i) => {
  		i.yapPointAuditItems.map((j) => {
				j.copyYapPointAuditItemId = j.yapPointAuditItemId;
  			j.yapPointAuditItemId = `copy${uuid.v4()}`;
  			j.modify = true;
  		});
  	});
		this.yapFrontEndArr.splice(index, 0, $copyItem);
	}

	// 刪除 只存在前端的查核項目
	deleteYapOnFrontEnd(yapId) {
		const index = this.yapFrontEndArr.findIndex((yapItem) => yapItem.yapId === yapId);
		this.yapFrontEndArr.splice(index, 1);
		this.setModalState({
			resultModal: {
				visible: true,
				type: 'success',
				title: '刪除成功',
				autoClose: 3,
			},
		});
	}

	// 匯入舊資料 => 將選擇的重點查核項目寫回資料
	importYapPointAuditItem({ yapId, importItems }: { yapId: string; importItems: yapFrontEndPointAuditItem }) {
		// console.log('匯入舊資料 => 將選擇的重點查核項目寫回資料');
		// console.log('匯入舊資料importItems', { yapId, importItems });
		const index = this.yapFrontEndArr.findIndex((e) => e.yapId === yapId);
		// console.log('index', index, this.yapFrontEndArr[index]);
		this.yapFrontEndArr[index].yapPointAuditItemMap.forEach((e, index) => {
			const pushItem = importItems[index].checked.map((e) => ({
				...e,
				copyYapPointAuditItemId: e.yapPointAuditItemId,
				yapPointAuditItemId: `copy${uuid.v4()}`,
				itemQAStatus: 'N',
  			modify: true,
			}));
			e.yapPointAuditItems = [...e.yapPointAuditItems, ...pushItem];
		});
	}

	// 判斷查核項目是否為審畢狀態 // N：還未能審畢, toReview：審畢(待主管審畢), done：已審畢
	checkIsReviewDone(yap: YapFrontEndDto): string {
		const yapPointAuditItems: YapPointAuditItemDto[] = yap.yapPointAuditItemMap.reduce((prev, curr) => prev.concat(curr.yapPointAuditItems), []);
		// console.log('yapPointAuditItems', yapPointAuditItems);

		if (this.currentRoleId === 'ROLE_Audit_Department_Head') { // 部主管
			if (yap.reviewLevel === '1' && this.infoData.status.value == 'C') {
				if (!this.yapReviewFlag) return 'N';
				if (yap.rejectFlag) return 'N';
				if ((yap.yapProjectScopeCheckStatus !== null) && (yap.yapProjectScopeCheckStatus !== 'FINISH')) return 'N';
				if ((yap.yapProjectScopeQaStatus !== null) && (yap.yapProjectScopeQaStatus !== 'N')) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemCheckStatus !== null && e.itemCheckStatus !== 'FINISH' && e.itemCheckStatus !== 'N'))) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemQAStatus !== null && e.itemQAStatus !== 'N'))) return 'N';
				return 'toReview';
			}
			if ((yap.reviewLevel === '2') || (yap.reviewLevel === '3')) return 'done';
			return 'N';
		}
		if (this.currentRoleId === 'ROLE_Audit_Office_Boss_Vice') { // 副稽核
			if (yap.reviewLevel === '2' && this.infoData.status.value == 'C') {
				if (!this.yapReviewFlag) return 'N';
				if (yap.rejectFlag) return 'N';
				if ((yap.yapProjectScopeCheckStatus !== null) && (yap.yapProjectScopeCheckStatus !== 'FINISH')) return 'N';
				if ((yap.yapProjectScopeQaStatus !== null) && (yap.yapProjectScopeQaStatus !== 'N')) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemCheckStatus !== null && e.itemCheckStatus !== 'FINISH' && e.itemCheckStatus !== 'N'))) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemQAStatus !== null && e.itemQAStatus !== 'N'))) return 'N';
				return 'toReview';
			}
			if (yap.reviewLevel === '3') return 'done';
			return 'N';
		}
		if (this.currentRoleId === 'ROLE_Audit_Office_Boss') { // 總稽核
			if (yap.reviewLevel === '3' && this.infoData.status.value == 'C') {
				if (!this.yapReviewFlag) return 'N';
				if (yap.rejectFlag) return 'N';
				if ((yap.yapProjectScopeCheckStatus !== null) && (yap.yapProjectScopeCheckStatus !== 'FINISH')) return 'N';
				if ((yap.yapProjectScopeQaStatus !== null) && (yap.yapProjectScopeQaStatus !== 'N')) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemCheckStatus !== null && e.itemCheckStatus !== 'FINISH' && e.itemCheckStatus !== 'N'))) return 'N';
				if (yapPointAuditItems.find((e) => (e.itemQAStatus !== null && e.itemQAStatus !== 'N'))) return 'N';
				return 'toReview';
			}
  		if (this.currentRole === 'ROLE_Audit_Office_Boss' && yap.yapStatus === 'D') return 'done';
			return 'N';
		}
		return 'N';
	}

	// 找到 yap
	findYap(yapArr: YapFrontEndDto[], yapId: string): YapFrontEndDto {
		return this.yapFrontEndArr.find((yapItem) => yapItem.yapId === yapId);
	}

	// 找到 重點查核項目
	findYapPointAuditItem({
		frontEndYapArr, yapId, yapPointAuditItemMapId, yapPointAuditItemId,
	}): YapPointAuditItemFrontEndDto {
		// console.log('yapId', yapId, 'yapPointAuditItemMapId', yapPointAuditItemMapId, 'yapPointAuditItemId', yapPointAuditItemId);
		return frontEndYapArr.find((e) => { console.log(e); return e.yapId === yapId; }).yapPointAuditItemMap.find((e) => e.key === yapPointAuditItemMapId)?.yapPointAuditItems.find((e) => e.yapPointAuditItemId === yapPointAuditItemId);
	}

	// 刪除 重點查核項目
	deleteYapPointAuditItem({ yapId, yapPointAuditItemMapId, yapPointAuditItemId }) {
		const yapPointAuditItemMap = this.yapFrontEndArr.find((e) => e.yapId === yapId).yapPointAuditItemMap.find((e) => e.key === yapPointAuditItemMapId);
		const deleteIndex = yapPointAuditItemMap.yapPointAuditItems.findIndex(((e) => e.yapPointAuditItemId === yapPointAuditItemId));
		yapPointAuditItemMap.yapPointAuditItems.splice(deleteIndex, 1);
	}

	// API:從資料庫找單筆yap
	async findYapFromDatabase(yap: YapFrontEndDto): Promise<YapFrontEndDto> {
		let findedYap = null;
		const request: SearchAuditPlan = {
			year: parseInt(this.infoData.year),
			month: yap.startMonth as SearchAuditPlanMonthEnum,
			auditType: yap.auditType as SearchAuditPlanAuditTypeEnum,
			auditItems: [yap.auditItem],
			auditorTeam: yap.mainAuditorTeam as SearchAuditPlanAuditorTeamEnum,
		};
		await this.$auditPlanApi.searchYapInAuditPlanUsingPOST(request)
			.then((resp) => {
				const yapData = resp.data.result.values.find((yapItem) => yapItem.yapId === yap.yapId);
				findedYap = this.convertYapToFrontEndYap([yapData]); // 轉成前端需要的格式
			})
			.catch((error) => {
				console.error();
			})
			.finally(() => {
				this.setLoading(false);
			});

		return findedYap[0];
	}

	// 更新 yapArr 項目
	updateYapArr({ yapArr, yapId, updatedValue }: {yapArr: YapFrontEndDto[]; yapId: string; updatedValue: YapFrontEndDto}) {
		const index = yapArr.findIndex((yapItem) => yapItem.yapId === yapId);
		Vue.set(yapArr, index, updatedValue);
	}

	// 確認yaps是否有填寫至少一個重點查核項目，少填則返回第一筆少填的yapId
	checkYapNeedsYapPointAuditItem(yapArr: YapFrontEndDto[]): string | null {
		let yapId = null;
		for (let i = 0; i < yapArr.length; i++) {
			const yapPointAuditItemCount = yapArr[i].yapPointAuditItemMap.reduce((accumulator,
				currentValue) => accumulator + currentValue.yapPointAuditItems.length, 0);
			if (yapPointAuditItemCount === 0) {
				yapId = yapArr[i].yapId;
				break;
			}
		}
		return yapId;
	}

	renderToYap(yapArr: YapFrontEndDto[], yapId: string) {
		const index = yapArr.findIndex((yap) => yap.yapId === yapId);
		// const index = this.filterYapFrontEndArr.length;
		if (this.showYapArrCount < index) this.showYapArrCount = index + 2;
	}

	scrollToYap(yapId) {
		console.log('yapId', yapId);
		const getErrorEle = document.getElementById(yapId);
		console.log('getErrorEle', getErrorEle);
		console.log('getErrorEle offsetTop', getErrorEle.offsetTop);
		if (getErrorEle) {
			getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
		}
	}

	/**
   * forceNextTick 強制先更新畫面，再往下執行
   */
	doubleRequestAnimationFrame(callback) {
  	requestAnimationFrame(() => {
  		requestAnimationFrame(callback);
  	});
	}

	forceNextTick(callback) {
  	if (callback && typeof callback === 'function') {
  		this.doubleRequestAnimationFrame(callback);
  	} else {
  		return new Promise((resolve) => {
  			this.doubleRequestAnimationFrame(resolve);
  		});
  	}
	}

	/**
   * 監聽
   */

	// 判斷從 代辦事項 還是從 meun 點進來
	@Watch('$route.params.type', { immediate: true })
	watchRouterParamsType(val) {
		this.searchItem = val === 'todo' ? 'todo' : 'all';
	}

	@Watch('form', { deep: true })
	watchForm(val) {
  	console.log('@watch => form =>', val);
	}

	@Watch('filterYapFrontEndArr', { deep: true })
	watchfilterYapFrontEndArr(val) {
		console.log('@watch => filterYapFrontEndArr =>', val);
		this.handleShowYapArr();
	}

	// @Watch('showYapFrontEndArr', { deep: true })
	// watchsShowYapFrontEndArr(val) {
	// 	console.log('@watch => showYapFrontEndArr =>', val);
	// }

	// 滑至底部
	handleScrolledToBottom(isVisible) {
		if (!isVisible) { return; }
		// 底部是否為最後的filterYapFrontEndArr的item
		if (this.filterYapFrontEndArr.length != 0) {
			if (this.filterYapFrontEndArr.length > this.showYapArrCount) {
				this.showYapArrCount += 3;
				this.handleShowYapArr();
			}
		}
	}

	// filterYap陣列 轉到showYap陣列
	async handleShowYapArr() {
		this.filterYapFrontEndArr.forEach((item, index) => {
			if (index <= this.showYapArrCount - 1) {
				item.isShow = true;
			} else {
				item.isShow = false;
			}
		});
		this.showYapFrontEndArr = await this.filterYapFrontEndArr.filter((e) => e.isShow == true);
	}
}
</script>

<style lang="scss" scoped>
.search-form {
  .btn--search {
    margin-top: 1.6em;
		margin-left: 0;
  }
	.search-form__item {
		max-width: calc(100% / 5);
	}
	.search-form__input--select {
		width: 100%;
	}
  .search__result__select {
    min-width: 100%;
    height: 34px;
    margin-left: 1rem;
    margin-right: 1rem;
    ::v-deep {
      .ant-select-selection--single {
        .ant-select-selection__rendered {
          height: inherit;
        }
      }
    }
  }
}
.controlBar {
  margin-top: 22px;
  .search__result__select {
    min-width: 165px;
    height: 34px;
    // margin-left: 1rem;
    margin-right: 1rem;
    ::v-deep {
      .ant-select-selection--single {
        height: inherit;
        .ant-select-selection__rendered {
          height: inherit;
        }
      }
    }
  }
}
.result__info__year {
  margin-left: 17px;
  margin-right: 30px;
}
.result__info__state__img {
  width: 19px;
}
.result__info__state__txt {
  white-space: nowrap;
  margin-left: 6px;
  color: $COLOR-MAIN1;
  font-weight: 600;
}

.btnGroup {
  display: flex;
  align-items: center;
	flex-wrap: wrap;
}

.comp__empty{
	text-align: left;
	margin: auto auto;
	width: 106px;
	padding-top: 10%;
	@include rwd-xll{
		padding-top: 205px;
	}
	.comp__empty--text{
		margin-left:12px;
		color: #000000A6;
		margin-top: 5px;
	}
}

</style>
