<template>
  <div class="main-contain crawlerindex-container container">
    <!-- 查詢 -->
    <div class="search-form form d-flex">
      <a-form-model
        ref="formRef"
        :rules="rules"
        class="row flex-grow-1"
        :model="searchForm"
        :hide-required-mark="true"
      >
        <div class="col-6 col-lg-3 col-xl-2">
          <div class="search-form__label">
            年度
          </div>
          <a-form-model-item prop="year">
            <date-picker
              v-model="searchForm.year"
              :formatter="yearFormatter"
              :disabled="searchForm.checkStatus"
              type="year"
              :allow-clear="true"
              class="w-100"
            />
          </a-form-model-item>
        </div>
        <div class="col-6 col-lg-3 col-xl-2">
          <div class="search-form__label">
            季
          </div>
          <a-form-model-item prop="quarter">
            <a-select
              v-model="searchForm.quarter"
              show-search
              :options="$enum.quarter"
              :disabled="searchForm.checkStatus"
              :allow-clear="true"
              :filter-option="$global.filterOption"
              class="w-100"
            />
          </a-form-model-item>
        </div>
        <div class="col-6 col-lg-3 col-xl-2">
          <div class="search-form__label">
            查核性質
          </div>
          <a-select
            v-model="searchForm.auditType"
            :disabled="searchForm.checkStatus"
            show-search
            :options="selectorOption.auditType"
            :dropdown-match-select-width="false"
            :filter-option="$global.filterOption"
            :allow-clear="true"
            class="w-100"
          />
        </div>
        <div class="col-6 col-lg-3 col-xl-2">
          <div class="search-form__label">
            查核期間
          </div>
          <date-picker
            v-model="searchForm.range"
            :disabled="searchForm.checkStatus"
            placeholder="請選擇資料期間"
            :formatter="formatter"
            :range="true"
            type="date"
            :allow-clear="true"
            class="w-100"
          />
        </div>
        <div class="col-6 col-lg-6 col-xl-2">
          <div class="search-form__label">
            查核項目
          </div>
          <a-select
            v-model="searchForm.auditItem"
            show-search
            :disabled="searchForm.checkStatus"
            :options="selectorOption.auditItem"
            :dropdown-match-select-width="false"
            :filter-option="$global.filterOption"
            :allow-clear="true"
            class="w-100"
          />
        </div>
        <div class="col-6 col-lg-auto col-xl-2 d-flex align-items-center pt-3">
          <div class="d-flex align-items-center w-auto">
            <a-checkbox
              v-model="searchForm.checkStatus"
              :disabled="todoDisabled"
              @change="todoChange"
            >
              待辦
            </a-checkbox>
          </div>
          <div class="">
            <button
              class="btn--search"
              @click="onSearch"
            >
              查詢
            </button>
          </div>
        </div>
      </a-form-model>
    </div>
    <!-- title bar-->
    <div class="search-header d-flex flex-wrap-reverse align-items-center">
      <div class="titleBar d-flex flex-wrap">
        <div class="search-header__title">
          季工作規劃
        </div>
        <StatusBar />
      </div>
      <div class="btnGroup ms-auto">
        <ActionBar
          :role="currentRole.id"
          @openModal="openModal"
        />
      </div>
    </div>
    <fbl-data-grid
      class="preparation-table"
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      :scroll="{ x: true }"
      @tableChange="handleTableChange"
    >
      <!-- 月份 -->
      <template v-slot:month="slotData">
        <span>{{ slotData.data.startMoth }} ~ {{ slotData.data.endMoth }}</span>
      </template>
      <!-- 查核期間 -->
      <template v-slot:ckData="slotData">
        <span>
          {{ slotData.data.ckStartDate }}
          <span v-if="slotData.data.ckStartDate && slotData.data.ckEndDate">
            ~
          </span>
          {{ slotData.data.ckEndDate }}
        </span>
      </template>
      <template v-slot:edit="slotData">
        <button
          class="acion-icon btn__icon--edit-acion"
          :disabled="!isEdit(slotData.data)"
          @click="onGridActionClick('edit', slotData.data)"
        />
      </template>
      <template v-slot:delete="slotData">
        <CustomPopConfirm
          v-if="isEdit(slotData.data) && !sit_hideDelete"
          :disabled="sit_hideDelete"
          @confirm="onGridActionClick('delete', slotData.data)"
        >
          <button
            class="acion-icon btn__icon--delete-action"
          />
        </CustomPopConfirm>
        <button
          v-else
          class="acion-icon btn__icon--delete-action"
          disabled
        />
      </template>
      <!-- <template v-slot:history="slotData">
        <button
          class="acion-icon btn__icon--course-action"
          :disabled="(!slotData.data.history)"
          @click="onGridActionClick('history', slotData.data)"
        />
      </template> -->
      <!-- 通知書、問卷、調閱、工作規劃 燈號 -->
      <template v-slot:status="slotData">
        <div
          :class="handleFlagStatus(slotData.data[slotData.property])"
          class="status-bar__item__circle"
          @click="handleChangeRoute(slotData)"
        />
      </template>
    </fbl-data-grid>
    <!-- <ResultModal
      :visible="resultModalSetting.visible"
      :title="resultModalSetting.title"
      :content="resultModalSetting.content"
      :type="resultModalSetting.type"
      :auto-close="resultModalSetting.autoClose"
      @closeModal="resultModalSetting.visible = false"
    /> -->
    <!-- <SidePlan
      :visible="sidePlanModal.visible"
      :init-data="sidePlanModal.initData"
      @closeModal="sidePlanModal.visible = false"
    /> -->
    <AddOutsidePlan
      :visible="sidePlanModal.visible === 'outSide'"
      :init-data="sidePlanModal.initData"
      @closeModal="sidePlanModal.visible = ''"
    />
    <AddInsidePlan
      :visible="sidePlanModal.visible === 'inSide'"
      :init-data="sidePlanModal.initData"
      @closeModal="sidePlanModal.visible = ''"
      @reload="onGridActionClick('reload')"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
// import DataConfirmSearchForm from '@/components/crawlerData/crawlerIndex/DataConfirmSearchForm.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
// import ConfirmForm from '@/components/crawlerData/crawlerIndex/ClaimForm.vue';
// import ConfirmGroupForm from '@/components/crawlerData/crawlerIndex/ConfirmGroupForm.vue';
import ActionBar from '@/components/preparation/preparationIndex/Action.vue';
import StatusBar from '@/components/preparation/preparationIndex/StatusBar.vue';
import AddOutsidePlan from '@/components/preparation/preparationIndex/AddOutsidePlan.vue';
import AddInsidePlan from '@/components/preparation/preparationIndex/AddInsidePlan.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	RoleDto,
	QuarterPlanRequestDto,
	DataCollectDetailDto,
} from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import moment from 'moment';
import { uuid } from 'vue-uuid';

const modalModule = namespace('modalControl');

export interface ResultModel{
  visible: boolean;
  title: string;
	content?: string;
  type: 'success' | 'error';
	autoClose?: string;
}

@Component({
	components: {
		// DataConfirmSearchForm,
		IconTextButton,
		// ConfirmForm,
		// ConfirmGroupForm,
		ActionBar,
		FblDataGrid,
		StatusBar,
		AddOutsidePlan,
		AddInsidePlan,
		CustomPopConfirm,
	},
})
export default class PreparationIndex extends Vue {
	@Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

	@Getter getWindowSize!: string;

	// 時間format格式
  formatter = this.$twDateFormatter;

	yearFormatter = this.$twYearFormatter;

  isLoading: boolean = false;

	currentRole: RoleDto = null;

	isAddOutsidePlan: boolean = false;

	isAddInsidePlan: boolean = false;

	// TODO: 測試階段 避免誤刪 暫時隱藏 #IAMSSIT-94
	sit_hideDelete: boolean = true;

	get todoDisabled() {
		return ['ROLE_Audit_Office_Boss_Vice', 'ROLE_Audit_Office_Boss'].includes(this.$global.getCurrentRoleId());
	}

	// 下拉選項
	selectorOption = {
		auditType: [],		// 查核性質
		auditItem: [],		// 查核項目
	}

	sidePlanModal = {
		visible: '',
		initData: {}, // planclass => 01:計劃內; 02:計劃外; 03:計劃外轉內(增)
	}

	// 結果彈窗設定
	resultModalSetting: ResultModel = {
		visible: false,
		title: 'title',
		content: '',
		type: 'error',
		autoClose: null,
	}

	// 查詢輸入框 暫存資料
	searchForm: {
		year: Date;
  	quarter: string;
  	auditType: string;
  	range: Date[];
  	auditItem: string;
		checkStatus: boolean;
	} = {
		year: undefined,
  	quarter: undefined,
  	auditType: undefined,
  	range: [],
  	auditItem: undefined,
		checkStatus: false,
	}

	// 查核欄位檢核
	rules = {
  	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  	quarter: [{ required: true, message: '請選擇季', trigger: 'change' }],
	}

	// FblPDataGridHolder<>
  grid = {
  	rowKey: 'rowKey',
  	data: [],
  	pagination: {
  		size: 'small',
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '15', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  		showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'year',
  			title: '年度',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'month',
  			title: '月份',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'auditType',
  			title: '查核性質',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'ckData',
  			title: '查核期間',
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'auditItemName',
  			title: '查核項目',
  			ellipsisNum: 8,
  			pendingEdit: (data) => this.isEdit(data),					// 沒資料時 顯示 '待編輯'
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'incharge',
  			title: '領隊人員',
  			ellipsisNum: 8,
  			pendingEdit: (data) => this.isEdit(data),
  			formatter: (data) => (Array.isArray(data.incharge) && data.incharge.length > 0 && data.incharge.map((i) => i.name).join('、')) || '',
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'checkMan',
  			title: '查核人員',
  			ellipsisNum: 8,
  			pendingEdit: (data) => this.isEdit(data),
  			formatter: (data) => (Array.isArray(data.checkMan) && data.checkMan.length > 0 && data.checkMan.map((i) => i.name).join('、')) || '',
  		},
   		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'checkedUnit',
  			title: '受查單位',
  			ellipsisNum: 8,
  			pendingEdit: (data) => this.isEdit(data),
  			formatter: (data) => data.checkedUnit.map((i) => i.departmentName).join('、'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'mainAucitorTeam',
  			title: '主辦組',
  			pendingEdit: (data) => this.isEdit(data),
  			formatter: (data) => data.mainAucitorTeam.auditorName,
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'coAucitorTeam',
  			title: '協辦組',
  			ellipsisNum: 8,
  			pendingEdit: (data) => this.isEdit(data),
  			formatter: (data) => data.coAucitorTeam.map((i) => i.auditorName).join('、'),
  		},
   		{
  			type: FblColumnType.PLAIN,
  			property: 'planClass',
  			title: '計畫',
  			formatter: (data) => data.planClass.valueName,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'edit',
  			template: 'edit',
  			title: '編輯',
  			fixed: 'right',
  		},
   		{
  			type: FblColumnType.TEMPLATE,
  			property: 'delete',
  			template: 'delete',
  			title: '刪除',
  			fixed: 'right',
  		},
   		// {
  		// 	type: FblColumnType.TEMPLATE,
  		// 	property: 'history',
  		// 	template: 'history',
  		// 	title: '編制歷程',
  		// 	fixed: 'right',
  		// },
   		// {
  		// 	type: FblColumnType.TEMPLATE,
  		// 	property: 'notice',
  		// 	title: '通知書',
  		// 	template: 'status',
  		// 	fixed: 'right',
  		// 	width: '50px',
  		// },
  		// {
  		// 	type: FblColumnType.TEMPLATE,
  		// 	property: 'questionnaire',
  		// 	title: '問卷',
  		// 	template: 'status',
  		// 	fixed: 'right',
  		// 	width: '50px',
  		// },
  		// {
  		// 	type: FblColumnType.TEMPLATE,
  		// 	property: 'documentTetrieval',
  		// 	title: '調閱',
  		// 	template: 'status',
  		// 	fixed: 'right',
  		// 	width: '50px',
  		// },
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'workPlanFlag',
  			title: '工作規劃',
  			template: 'status',
  			fixed: 'right',
  			width: '50px',
  		},
  	],
  };

	 // action開啟彈窗
  openModal(item) {
   	switch (item) {
  	case 'humanResourcePlanning':
  		this.$emit('openModal', 'humanResourcePlanning');
  		break;
  	case 'addInsidePlan':
   		this.isAddInsidePlan = true;
  		break;
  	case 'addOutsidePlan':
   		this.isAddOutsidePlan = true;
  		break;
  	}
  }

  toPage(routerName: string): void {
  	this.$router.push({ name: routerName });
  }

  // 切換燈號
  handleFlagStatus(flag) {
  	switch (flag) {
  	case '01':
  		return 'status-bar__item__circle--none';
  	case '02':
  		return 'status-bar__item__circle--undo';
  	case '03':
  		return 'status-bar__item__circle--done';
  	case '04':
  		return 'status-bar__item__circle--delay';
  	}
  }

  // API: 點選燈號
  handleChangeRoute({ property, text: status, data }) {
  	let goPage = '';
  	switch (property) {
  	case 'workPlanFlag':
  		goPage = 'WorkPlanning';
  		break;
  	}
  	// 尚未進行 不可點擊
  	if (status !== '01') {
  		const routerPath = goPage.slice(0, 1).toUpperCase() + goPage.slice(1); // 首字大寫
  		this.setLoading(true);
  		this.$preparationApi.searchWorkPlanUsingGET(data.quarterPlanMId)
  			.then((resp) => {
  				// API 有資料才跳轉
  				if (resp.data.result) {
  					this.$global.changeRouterAndaddParam({
  						toRouter: routerPath,
  						query: {
  							year: data.year,
  							startMoth: data.startMoth,
  							endMoth: data.endMoth,
  							quarterPlanMId: data.quarterPlanMId,
  							mainAucitorTeam: data.mainAucitorTeam.auditorTeam,
  							coAucitorTeam: data.coAucitorTeam?.map((i) => i.auditorTeam),
  						},
  					});
  				} else {
  					this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '查無資料',
  					},
  				});
  				}
  			})
  			.catch((err) => {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: '查無資料',
  					},
  				});
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	}
  }

  // 初始化搜尋條件
  initSearchForm() {
  	this.searchForm.year = undefined;
  	this.searchForm.quarter = undefined;
  	this.searchForm.auditType = undefined;
  	this.searchForm.range = [];
  	this.searchForm.auditItem = undefined;
  }

  // 判斷是否 編輯/刪除 disabled
  isEdit(slotData) {
  	const nowDate = moment(new Date());
  	const isTeamHead = this.$global.getCurrentRoleId() === 'ROLE_Audit_Team_Head';	// 主辦組 組長 才可編輯
  	let inTime: boolean = false;
  	// 排錯，非時間格式
  	if (moment(slotData.ckStartDate).isValid()) {
  		// 查核期間之起日 10日前 ，才可編輯
  		const ckStartDate = moment(slotData.ckStartDate).add(1911, 'year');
  		const diffDay = nowDate.diff(ckStartDate, 'day');				// nowDate 經過 ckStartDate 幾天
  		inTime = (diffDay < -10);
  	} else {
  		// 例外處理 排程產生的資料
  		inTime = (slotData.ckStartDate === '');
  	}
  	return (inTime && isTeamHead);			// 回傳是否 可編輯
  }

  /**
	 * API
	 */
  // API: 查核性質 下拉選項
  getApi_quarterPlanAuditType() {
  	this.$preparationApi.searchQuarterPlanAuditTypeInPreparationUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.auditType = getData;
  			// console.log(getData);
  			// this.selectorOption.item.unshift(
  			// 	{
  			// 		label: '全選',
  			// 		value: undefined,
  			// 	},
  			// );
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查核項目 下拉選項
  getApi_quarterPlanAuditItem() {
  	this.$preparationApi.searchQuarterPlanAuditItemInPreparationUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.auditItem = getData;
  			// console.log(this.selectorOption.item);
  			// this.selectorOption.item.unshift(
  			// 	{
  			// 		label: '全選',
  			// 		value: undefined,
  			// 	},
  			// );
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢 季工作規劃
  getApi_searchQuarterPlan() {
  	this.setLoading(true);
  	this.grid.data = [];
  	this.grid.pagination.total = 0;
  	const submitData: QuarterPlanRequestDto = {};

  	submitData.checkStatus = this.searchForm.checkStatus;
  	submitData.pageIndex = this.grid.pagination.current - 1;
  	submitData.pageSize = this.grid.pagination.pageSize;
  	if (this.searchForm.checkStatus) {
  		submitData.year = null;
  		submitData.auditType = null;
  		submitData.auditItem = null;
  		submitData.startMonth = null;
  		submitData.end_MONTH = null;
  		submitData.ckStartDate = null;
  		submitData.ckEndDate = null;
  	} else {
  		submitData.year = (moment(this.searchForm.year).year() - 1911).toString();
  		submitData.startMonth = moment().quarter(Number(this.searchForm.quarter)).startOf('quarter').format('MM');		// 季度 開始時間
  		submitData.end_MONTH = moment().quarter(Number(this.searchForm.quarter)).endOf('quarter').format('MM');				// 季度 結束時間
  		submitData.ckStartDate = (this.searchForm.range[0]) ? moment(this.searchForm.range[0]).format('YYYY-MM-DD') : null;		// 季度 開始時間
  		submitData.ckEndDate = (this.searchForm.range[1]) ? moment(this.searchForm.range[1]).format('YYYY-MM-DD') : null;				// 季度 結束時間
  		submitData.auditType = this.searchForm.auditType || null;
  		submitData.auditItem = this.searchForm.auditItem || null;
  	}

  	this.$preparationApi.searchQuarterPlanInPreparationUsingPOST(submitData)
  		.then((resp) => {
  			const getData = this.$global.deepCopyData(resp.data.result).content;
  			getData.map((i) => {
  				i.rowKey = uuid.v4();
  			});
  			this.grid.data = getData;
  			this.grid.pagination.total = parseInt(resp.data.result.totalElements);
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 刪除 季工作規劃
  getApi_deleteQuarterPlan({ quarterPlanMId }) {
  	// console.log(quarterPlanMId);
  	this.setLoading(true);
  	this.$preparationApi.deleteQuarterPlanInPreparationUsingPOST(quarterPlanMId)
  		.then((resp) => {
  			// console.log(resp);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '刪除成功',
  					autoClose: 3,
  				},
  			});
  			this.getApi_searchQuarterPlan();
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

  /**
	 * Event
	 */
  // table pagination改變
  handleTableChange(e) {
  	this.grid.pagination.current = e.pagination.current;
  	this.grid.pagination.pageSize = e.pagination.pageSize;
  	this.getApi_searchQuarterPlan();
  }

  onGridActionClick(type, slotData = null) {
  	const data = slotData;
  	// console.log(data);
  	switch (type) {
  	case 'edit':
  		// console.log('編輯');
  		this.sidePlanModal.visible = (slotData.planClass?.keyId === '02') ? 'outSide' : 'inSide';
  		this.sidePlanModal.initData = { ...slotData };
  		break;
  	case 'delete':
  		// console.log('刪除');
  		this.getApi_deleteQuarterPlan(slotData);
  		break;
  	case 'history':
  		console.log('編制歷程');
  		break;
  	case 'reload':
  		this.getApi_searchQuarterPlan();
  		break;
  	}
  }

  onSearch() {
  	if (this.searchForm.checkStatus) {
  		// 不須檢核 直接查詢 待辦事項
  		this.getApi_searchQuarterPlan();
  	} else {
  		(this.$refs.formRef as any).validate((valid) => {
  			if (valid) {
  				this.getApi_searchQuarterPlan();
  			}
  		});
  	}
  }

  todoChange() {
  	// 檢核 重置
  	(this.$refs.formRef as any).clearValidate();
  }

  /**
	 * Hook
	 */
  created() {
  	this.currentRole = this.$global.getCurrentRole();
   	// this.currentRole.id = 'ROLE_Audit_Team_Head';
  	// 取得下拉選單
  	this.getApi_quarterPlanAuditType(); // 查核性質
  	this.getApi_quarterPlanAuditItem(); // 查核項目
  }

  mounted() {
  	this.initSearchForm();
  	// 部主管以上 不需要 代辦checkbox，disabled掉
  	if (!this.todoDisabled) {
  		this.searchForm.checkStatus = (this.$route.params.type === 'todo');
  	}
  	// console.log(this.searchForm.checkStatus);
  	if (!this.searchForm.checkStatus) {
  		// 非待辦 預設自動填入 年度 季度
  		this.searchForm.year = new Date();
  		this.searchForm.quarter = `${(moment().quarter() + 1) % 4}`;		// 下一個季度
  	}
  	this.onSearch();
  }

  /**
	 * 監聽
	 */
	@Watch('searchForm', { deep: true })
  watchDeep(nV) {
  	// console.log(nV);
  }
}
</script>

<style lang="scss" scoped>
.search-header {
	padding: 16px 0px 8px;
}

.titleBar {
	padding-top: 10px;
	padding-bottom: 10px;
}

.search-header__title {
  font-size: 18px;
  font-weight: bold;
  color: $FONT-NORMAL;
	align-self: center;
}

.acion-icon{
	width: 23px;
	height: 23px;
	border: 0;
	padding: 0;
	background-color: transparent;
}
::v-deep .form{
	.ant-input-group{
			display: flex;
	}
	.ant-input-group.ant-input-group-compact::after,.ant-input-group.ant-input-group-compact::before{
		content: none;
	}
	.ant-select.search__result__month {
    width: 80px;
  }
	.search__result__month--right .ant-select-selection{
		border-left: none;
	}
}
::v-deep .todo__radio.ant-radio-group{
	display: flex;
	align-items: center;
	.ant-radio-wrapper{
		display: flex;
		.ant-radio-inner{
			width: 24px;
			height: 24px;
			border-color:$COLOR-MAIN1
		}
		.ant-radio-inner::after{
			width: 14px;
			height: 14px;
			top:4px;
			left: 4px;
			background-color:$COLOR-MAIN1
		}
	}
}

// 狀態
::v-deep .status-bar__item__circle {
	width: 18px;
	height: 18px;
	border-radius: 50%;
}

$status:
	"undo" #2185D0 #2185D0,
	"delay" #FAAB40 #000000,
	"none" #C7C7C7 #000000,
	"done" #009583 #009583;
@each $name, $circle, $text in $status {
	::v-deep .status-bar__item__circle--#{$name}{
		background-color: $circle;
		// @if($name != "none"){
		// 	cursor: pointer;
		// }@else{
    //   pointer-events: none;
    // }
    + .status-bar__item__text {
      color: $text;
    }
	}
}

// 表格內的狀態 可點擊樣式
.preparation-table {
	.status-bar__item__circle {
		&:not(.status-bar__item__circle--none) {
			cursor: pointer;
		}
	}
}

.btn--search {
	padding: 10px;
	width: 88px;
}

// 待編輯
::v-deep {
	.pendingEdit {
		color: $COLOR-MAIN19;
	}
}
</style>
