<template>
  <div class="main-contain crawlerindex-container container">
    <!-- 查詢 -->
    <div class="search-form form d-flex">
      <a-form-model
        ref="formRef"
        class="row flex-grow-1"
        :model="searchForm"
        :hide-required-mark="true"
      >
        <div class="col-6 col-lg-6 col-xl">
          <div class="search-form__label">
            年度
          </div>
          <a-form-model-item prop="year">
            <a-select
              v-model="searchForm.year"
              placeholder="請選擇年度"
              class="w-100"
              :disabled="searchForm.toDo"
              :filter-option="$global.filterOption"
              :options="selectorOption.year"
              :dropdown-match-select-width="false"
              :allow-clear="true"
              @change="handleYearChange"
            />
          </a-form-model-item>
        </div>
        <div class="col-6 col-lg-6 col-xl">
          <div class="search-form__label">
            月份
          </div>
          <a-form-model-item
            ref="startMonth"
            prop="startMonth"
          >
            <a-input-group
              compact
              class="d-flex"
            >
              <a-select
                v-model="searchForm.startMonth"
                class="col search__result__month search__result__month--left"
                show-search
                placeholder="起"
                :disabled="searchForm.toDo"
                :options="$enum.monthOption"
                :filter-option="$global.filterOption"
                :allow-clear="true"
                :dropdown-match-select-width="false"
              />
              <a-input
                class="search__result__range"
                placeholder="~"
                disabled
              />
              <a-select
                v-model="searchForm.endMonth"
                class="col search__result__month search__result__month--right"
                show-search
                placeholder="迄"
                :disabled="searchForm.toDo"
                :options="$enum.monthOption"
                :allow-clear="true"
                :filter-option="$global.filterOption"
                :dropdown-match-select-width="false"
              />
            </a-input-group>
          </a-form-model-item>
        </div>
        <div class="col-6 col-lg-6 col-xl">
          <div class="search-form__label">
            查核項目
          </div>
          <a-select
            v-model="searchForm.auditItem"
            show-search
            :disabled="searchForm.toDo || selectorOption.auditItem.length <= 0"
            :options="selectorOption.auditItem"
            :dropdown-match-select-width="false"
            :filter-option="$global.filterOption"
            :allow-clear="true"
            :placeholder="(searchForm.toDo || selectorOption.auditItem.length <= 0) ? null: '請選擇查核項目'"
            class="w-100"
          />
        </div>
        <div class="col-6 col-lg-6 col-xl">
          <div class="search-form__label">
            受查單位
          </div>
          <a-select
            v-model="searchForm.unit"
            show-search
            :disabled="searchForm.toDo || [...selectorOption.checkedUnit] <= 0"
            :dropdown-match-select-width="false"
            :filter-option="$global.filterOption"
            :allow-clear="true"
            :placeholder="(searchForm.toDo || [...selectorOption.checkedUnit] <= 0) ? null: '請選擇受查單位'"
            class="w-100"
          >
            <a-select-option
              v-for="item in selectorOption.checkedUnit"
              :key="item.departmentId"
              :value="item.departmentName"
            >
              {{ item.departmentName }}
            </a-select-option>
          </a-select>
        </div>
        <!-- 組長 / 查核人員 預設沒有此欄位 -->
        <div
          v-if="isGroupShow"
          class="col-6 col-lg-6 col-xl"
        >
          <div class="search-form__label">
            組別
          </div>
          <a-select
            v-model="searchForm.auditorTeam"
            show-search
            :disabled="searchForm.toDo || !(selectorOption.groups && selectorOption.groups.length > 0)"
            :options="selectorOption.groups"
            :dropdown-match-select-width="false"
            :filter-option="$global.filterOption"
            :allow-clear="true"
            :placeholder="(searchForm.toDo || !(selectorOption.groups && selectorOption.groups.length > 0)) ? null: '請選擇組別'"
            class="w-100"
          />
        </div>
        <div class="col-6 col-lg-auto d-flex align-items-start pt-3">
          <div class="d-flex align-items-center w-auto mt-2">
            <a-checkbox
              v-model="searchForm.toDo"
              :disabled="todoDisabled"
              @change="todoChange"
            >
              待辦
            </a-checkbox>
          </div>
          <div class="d-flex align-items-center w-auto mt-2">
            <a-checkbox
              v-model="searchForm.hasOpinion"
            >
              有查核意見
            </a-checkbox>
          </div>
          <div class="mt-1">
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
          查核項目
        </div>
      </div>
      <div class="btnGroup ms-auto">
        <ActionBar
          :role="currentRole.id"
          @openModal="openModal"
        />
      </div>
    </div>
    <fbl-data-grid
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      :scroll="{ x: true }"
      @tableChange="handleTableChange"
    >
      <template v-slot:month="slotData">
        <span>{{ slotData.data.startMoth }} ~ {{ slotData.data.endMoth }}</span>
      </template>
      <template v-slot:auditItemName="slotData">
        <a
          href="javascript:void(0)"
          @click="auditItemDetail(slotData.data)"
        >{{ slotData.data.auditItemName }}</a>
      </template>
      <template v-slot:ckData="slotData">
        <span>{{ getRangeDate(slotData.data.ckStartDate, slotData.data.ckEndDate) }}</span>
      </template>
      <template v-slot:ckRangeDateArr="slotData">
        <span>{{ getRangeDate(slotData.data.ckRangeStrDate, slotData.data.ckRangeEndDate) }}</span>
      </template>
    </fbl-data-grid>
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
import ActionBar from '@/components/auditing/auditingIndex/ActionBar.vue';
// import StatusBar from '@/components/preparation/preparationIndex/StatusBar.vue';
// import AddOutsidePlan from '@/components/preparation/preparationIndex/AddOutsidePlan.vue';
// import AddInsidePlan from '@/components/preparation/preparationIndex/AddInsidePlan.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	RoleDto,
} from '@fubonlife/iams-api-axios-sdk';
// import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import moment from 'moment';
import {
	auditingIndexSearchForm,
	SelectOptionDtoGroup,
} from './models';

const modalModule = namespace('modalControl');

@Component({
	components: {
		// DataConfirmSearchForm,
		IconTextButton,
		// ConfirmForm,
		// ConfirmGroupForm,
		ActionBar,
		FblDataGrid,
		// StatusBar,
		// AddOutsidePlan,
		// AddInsidePlan,
		// CustomPopConfirm,
	},
})
export default class PreparationIndex extends Vue {
	@Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

	@Getter getWindowSize!: string;

	// 時間format格式
  dateFormatter = this.$twDateFormatter;

	yearFormatter = this.$twYearFormatter;

  isLoading: boolean = false;

	currentRole: RoleDto = null;

	get todoDisabled() {
		return ['ROLE_Audit_Office_Boss'].includes(this.$global.getCurrentRoleId());
	}

	// 若角色為 組長/查核人員，則不顯示
	get isGroupShow() {
		return !['ROLE_Audit_Team_Head', 'ROLE_Auditor'].includes(this.$global.getCurrentRoleId());
	}

	// 下拉選項
	selectorOption: SelectOptionDtoGroup = {
		year: [],
		auditItem: [],		// 查核項目
		checkedUnit: [],		 // 受查單位,
		groups: [],		// 組別
	}

	// 查詢輸入框 暫存資料
	searchForm: auditingIndexSearchForm = {
		year: undefined,
  	startMonth: undefined,
  	endMonth: undefined,
  	auditItem: undefined,
		auditorTeam: undefined,
  	unit: undefined,
		toDo: false,
		hasOpinion: false,
	}

	cacheSearch = {
		toDo: false,
		hasOpinion: false,
	}

	// 查核欄位檢核
	// rules = {
  	// year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  	// month: [{ required: true, message: '請選擇月份', trigger: 'change' }],
	// }

	// FblPDataGridHolder<>
  grid = {
  	rowKey: 'auditDraftId',
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
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'month',
  			title: '月份',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'auditItemName',
  			title: '查核項目',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'units',
  			title: '受查單位',
  			ellipsisNum: 6,
  			formatter: (data) => data.units.map((i) => i.departmentName).join('、'),
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'inChargeMan',
  			title: '領隊',
  			ellipsisNum: 5,
  			formatter: (data) => data.inChargeMan.name,
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'checkMan',
  			title: '查核人員',
  			ellipsisNum: 5,
  			formatter: (data) => data.checkMan.map((i) => i.name).join('、'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'mainAucitorTeam',
  			title: '主辦組',
  			formatter: (data) => data.mainAucitorTeam.auditorName,
  		},
  		{
  			type: FblColumnType.ELLIPSIS,
  			property: 'coAucitorTeam',
  			title: '協辦組',
  			ellipsisNum: 6,
  			formatter: (data) => data.coAucitorTeam.map((i) => i.auditorName).join('、'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'ckBaseDate',
  			title: '查核基準日',
  			formatter: (data) => this.dateFormatter.stringify(data.ckBaseDate),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'ckData',
  			title: '查核期間',
  		},
   		{
  			type: FblColumnType.TEMPLATE,
  			template: 'ckRangeDateArr',
  			title: '受查範圍期間',
  		},
   		{
  			type: FblColumnType.PLAIN,
  			property: 'status',
  			title: '查核狀態',
  			formatter: (data) => data.status.valueName,
  		},
  	],
  };

  // action開啟彈窗
  openModal(item) {
   	switch (item) {
  	case 'checkProgram':
  		console.log('公版查核程式');
  		break;
  	}
  }

  // 初始化搜尋條件
  initSearchForm() {
  	this.searchForm.year = undefined;
  	this.searchForm.startMonth = undefined;
  	this.searchForm.endMonth = undefined;
  	this.searchForm.auditItem = undefined;
  	this.searchForm.auditorTeam = undefined;
  	this.searchForm.unit = undefined;
  }

  getRangeDate(start, end) {
  	return `${this.dateFormatter.stringify(start)}-${this.dateFormatter.stringify(end)}`;
  }

  /**
	 * API
	 */
  // API: 年度 下拉選項
  getApi_year() {
  	this.setLoading(true);
  	this.$workPaperApi.searchYearInWorkPaperUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.year = getData;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查核項目 下拉選項
  getApi_auditItem(year) {
  	this.setLoading(true);
  	this.$workPaperApi.searchAuditItemInWorkPaperUsingGET(year)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.auditItem = getData;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 受查單位 下拉選項
  getApi_checkedUnit(year) {
  	this.setLoading(true);
  	this.$workPaperApi.searchUnitInWorkPaperUsingGET(year)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.checkedUnit = getData;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 組別 下拉選項
  getApi_groups() {
  	this.setLoading(true);
  	this.$auditPlanApi.searchAuditorTeamInAuditPlanUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.selectorOption.groups = getData;
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 查詢 工作底稿
  getApi_auditingList() {
  	this.setLoading(true);
  	this.grid.data = [];
  	this.grid.pagination.total = 0;
  	const submitData = {
  		toDo: this.searchForm.toDo,
  		hasOpinion: this.searchForm.hasOpinion,
  		year: null,
  		startMonth: null,
  		endMonth: null,
  		auditItem: null,
  		auditorTeam: null,
  		unit: null,
  		pageIndex: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	if (!this.searchForm.toDo) {
  		submitData.year = this.searchForm.year ? (moment(this.searchForm.year).year() + 1911) : null;
  		submitData.startMonth = this.searchForm.startMonth || null;
  		submitData.endMonth = this.searchForm.endMonth || null;
  		submitData.auditItem = this.searchForm.auditItem || null;
  		submitData.auditorTeam = this.searchForm.auditorTeam || null;
  		submitData.unit = this.searchForm.unit || null;
  	}

  	this.$workPaperApi.searchWorkPaperDataInWorkPaperUsingPOST(submitData)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.grid.data = getData.content;
  			this.grid.pagination.total = parseInt(getData.totalElements);
  			// TEST:
  			// console.log('查詢 工作底稿 =>', getData.content);
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});

  	// cache 待辦/有查核意見
  	this.cacheSearch.toDo = this.searchForm.toDo;
  	this.cacheSearch.hasOpinion = this.searchForm.hasOpinion;
  }

  /**
	 * Event
	 */
  // table pagination改變
  handleTableChange(e) {
  	this.grid.pagination.current = e.pagination.current;
  	this.grid.pagination.pageSize = e.pagination.pageSize;
  	this.getApi_auditingList();
  }

  // 前往 查核項目 明細
  auditItemDetail(data) {
  	// 傳送 待辦 / 有無查核意見 / 該筆資料
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'AuditingDetail',
  		query: {
  			...data,
  			cacheData: {
  				toDo: this.cacheSearch.toDo,
  				hasOpinion: this.cacheSearch.hasOpinion,
  				auditDraftId: data.auditDraftId,
  				quarterPlanMId: data.quarterPlanMId,
  				inCharge: data.inCharge,
  				status: data.status,
  			},
  		},
  	});
  }

  // 切換年度
  handleYearChange() {
  	if (this.searchForm.year) {
  		this.getApi_auditItem(this.searchForm.year); // 查核項目
  		this.getApi_checkedUnit(this.searchForm.year); // 受查單位
  	}
  }

  onSearch() {
  	// 不需檢核
  	this.getApi_auditingList();
  	// if (this.searchForm.toDo) {
  	// 	// 不須檢核 直接查詢 待辦事項
  	// 	this.getApi_auditingList();
  	// } else {
  	// 	(this.$refs.formRef as any).validate((valid) => {
  	// 		if (valid) {
  	// 			this.getApi_auditingList();
  	// 		}
  	// 	});
  	// }
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
  	// 取得 年度 下拉選單
  	this.getApi_year();
  }

  async mounted() {
  	this.initSearchForm();
  	await this.getApi_groups(); // 組別
  	// 若角色為 組長/查核人員，則鎖定為該自己組別
  	if (['ROLE_Audit_Team_Head', 'ROLE_Auditor'].includes(this.$global.getCurrentRoleId())) {
  		this.searchForm.auditorTeam = this.$global.getCurrentRoleTeamCode();
  	}
  	// 部主管以上 不需要 代辦checkbox，disabled掉
  	if (!this.todoDisabled) {
  		this.searchForm.toDo = (this.$route.params.type === 'todo');
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
.search__result__range {
	width: 2em;
}
.crawlerindex-container {
	::v-deep .ant-form-item-control {
		line-height: 1;
	}
}
</style>
