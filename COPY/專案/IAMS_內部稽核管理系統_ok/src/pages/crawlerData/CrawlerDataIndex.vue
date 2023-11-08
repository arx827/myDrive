<template>
  <div class="main-contain crawlerindex-container container">
    <ClaimForm
      ref="claimFormRef"
      :visible="claimModalSetting.visible"
      :is-claim="claimModalSetting.isClaim"
      :crawler-data-id="rowSelection.selectedRowKeys"
      @closeModal="claimModalSetting.visible = false"
      @claim="sendClaim"
      @notClaim="notClaim"
    />
    <DataConfirmSearchForm
      :role="currentRoleId"
      :data-type-list="dataTypeList"
      :data-status-list="dataStatusList"
      :get-group-list="getGroupList"
      :group-status-list="groupStatusList"
      @search="search"
    />
    <div class="d-flex justify-content-between search-header">
      <div class="title">
        資料蒐集
      </div>
      <ActionBar
        :select-items="rowSelection.selectedRowKeys"
        :role="currentRoleId"
        @confirm="openConfirmModal"
      />
    </div>
    <fbl-data-grid
      v-if="isShowGrid"
      class="select-table"
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      :custom-row="grid.customRow"
      :scroll="{ x: true }"
      :row-selection="currentRoleId === 'ROLE_Auditor' || currentRoleId === 'ROLE_Audit_Team_Head'? rowSelection : null"
      @tableChange="onPageChange($event)"
    >
      <template
        slot="summary"
        slot-scope="grid"
      >
        <a-popover
          overlay-class-name="popover--summary"
          placement="top"
          :trigger="(getWindowSize == 'xxl'? grid.data.summary.length < 60 : grid.data.summary.length < 22) ? '': 'hover'"
        >
          <template slot="content">
            <span>
              {{ grid.data.summary }}
            </span>
          </template>
          <div
            class="datalink"
            @click="onPageDetail(grid.data)"
          >
            {{ ellipsisString(grid.data.summary) }}
          </div>
        </a-popover>
      </template>
      <template
        slot="dataClaimStatus"
        slot-scope="grid"
      >
        <span
          :class="{'text--warning': (grid.data.dataClaimStatus && Object.keys(grid.data.dataClaimStatus)[0]) ==='A'}"
        >
          {{ grid.data.dataClaimStatus && Object.values(grid.data.dataClaimStatus)[0] }}
        </span>
      </template>
    </fbl-data-grid>
  </div>
</template>

<script lang="ts" >
import {
	Vue, Component, Watch,
} from 'vue-property-decorator';
import DataConfirmSearchForm from '@/components/crawlerData/crawlerIndex/DataConfirmSearchForm.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import ClaimForm from '@/components/crawlerData/crawlerIndex/ClaimForm.vue';
import ActionBar from '@/components/crawlerData/crawlerIndex/ActionBar.vue';
import { Getter, Action, namespace } from 'vuex-class';
import {
	SelectOptionDto, QueryDataCollectRequest, DataCollectResultVO, SendClaimRequest, RoleDto, NotClaimRequest,
} from '@fubonlife/iams-api-axios-sdk';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';

export interface ResultModel{
visible: boolean;
title: string;
content?: string;
type: 'success' | 'error';
autoClose?: string;
}

const detailModule = namespace('crawlerDataDetailVuex');
const modalModule = namespace('modalControl');

@Component({
	components: {
		DataConfirmSearchForm, IconTextButton, ClaimForm, ActionBar, FblDataGrid,
	},
})
export default class CrawlerDataIndex extends Vue {
	@modalModule.Action('setModalState') setModalState;

	@detailModule.Action('setDetailData') setDetailData;

	@Getter getWindowSize!: string;

	@Action('setLoading') setLoading;

	isLoading: boolean = false;

	ConfirmedForm = {};

	claimModalSetting = {
		visible: false,
		isClaim: false,
	}

	// 當前角色
	currentRole: RoleDto = this.$global.getCurrentRole();

	currentRoleId: string = null;

	// 資料類型清單
	dataTypeList: SelectOptionDto[] = null;

	// 資料狀態清單
	dataStatusList: SelectOptionDto[] = null;

	// 認列狀態清單
	groupStatusList: SelectOptionDto[] = null;

	// 已認列組別清單
	getGroupList: SelectOptionDto[] = null;

	// 查詢列表
	searchForm: QueryDataCollectRequest = null;

	isShowGrid: boolean = false;

	isSupervisor: boolean = false;

	teamColumns = [
		{
			type: FblColumnType.PLAIN,
			property: 'caseType',
			title: '資料類型',
		},
		{
			type: FblColumnType.TEMPLATE,
			template: 'summary',
			property: 'summary',
			title: '資料摘要',
		},
		{
			type: FblColumnType.PLAIN,
			property: 'confirmUser',
			title: '資料確認人員',
			formatter: (data: DataCollectResultVO) => data.confirmUser && Object.values(data.confirmUser)[0],
		},
		{
			type: FblColumnType.TEMPLATE,
			property: 'dataClaimStatus',
			template: 'dataClaimStatus',
			title: '認列狀態',
		},
		{
			type: FblColumnType.PLAIN,
			property: 'createDatetime',
			title: '取得日期',
			formatter: (data: DataCollectResultVO) => (data.createDatetime ? DateTimeFormmat.transformRocDate(data.createDatetime) : ''),
		},
		{
			type: FblColumnType.PLAIN,
			property: 'releaseDate',
			title: '發布日期',
			formatter: (data: DataCollectResultVO) => (data.releaseDate ? DateTimeFormmat.transformRocDate(data.releaseDate) : ''),
		},
	]

	supervisorColumns=[
		{
			type: FblColumnType.PLAIN,
			property: 'caseType',
			title: '資料類型',
		},
		{
			type: FblColumnType.TEMPLATE,
			template: 'summary',
			property: 'summary',
			title: '資料摘要',
		},
		{
			type: FblColumnType.PLAIN,
			property: 'claimGroup',
			title: '已認列組別',
		},
		{
			type: FblColumnType.PLAIN,
			property: 'dataConfirmStatus',
			title: '資料確認狀態',
			formatter: (data: DataCollectResultVO) => data.dataConfirmStatus && Object.values(data.dataConfirmStatus)[0],
		},
		{
			type: FblColumnType.PLAIN,
			property: 'createDatetime',
			title: '取得日期',
			formatter: (data: DataCollectResultVO) => (data.createDatetime ? DateTimeFormmat.transformRocDate(data.createDatetime) : ''),
		},
		{
			type: FblColumnType.PLAIN,
			property: 'releaseDate',
			title: '發布日期',
			formatter: (data: DataCollectResultVO) => (data.releaseDate ? DateTimeFormmat.transformRocDate(data.releaseDate) : ''),
		},
	]

	grid: FblPDataGridHolder<DataCollectResultVO> = {
		rowKey: 'crawlerDataId',
		data: [],
		pagination: {
			size: 'small',
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['10', '15', '25'],
			showSizeChanger: true,
			showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
		},
		columns: [],
	};

	UAOGrid = {
		columns: [
			{
				title: '資料類型',
				dataIndex: 'type',
				key: 'type',
			},
			{
				title: '資料摘要',
				dataIndex: 'summary',
				key: 'summary',
				scopedSlots: { customRender: 'summary' },
			},
			{
				title: '上傳日期',
				dataIndex: 'getDate',
				key: 'checked',
			},
		],
	}

	// table勾選項目
	rowSelection = {
		onChange: this.rowSelectionChange,
		selectedRowKeys: [],
		getCheckboxProps: this.getCheckboxProps,
	// onSelect: (record, selected, selectedRows) => {
	// 	console.log(record, selected, selectedRows);
	// },
	// onSelectAll: (selected, selectedRows, changeRows) => {
	// 	console.log(selected, selectedRows, changeRows);
	// },
	};

	rowSelectionChange(selectedRowKeys, selectedRows) {
		this.rowSelection.selectedRowKeys = selectedRowKeys;
		// console.log('selectedRows', selectedRows);
	}

	getCheckboxProps(record) {
		return {
			props: { disabled: record.dataClaimStatus.A === undefined },
		};
	}

	async created() {
		// this.queryData() 改由 component DataConfirmSearchForm 觸發
		await Promise.all([this.getDataType(), this.getDataStatus(), this.getGroup(), this.getDataGroupStatus()]);
		this.currentRoleId = await this.$global.getCurrentRoleId();
		this.grid.columns = (this.currentRoleId === 'ROLE_Audit_Team_Head' || this.currentRoleId === 'ROLE_Auditor') ? this.teamColumns : this.supervisorColumns;
	}

	mounted() {
		this.isShowGrid = true;
	}

	openConfirmModal(isClaim) {
		this.claimModalSetting.visible = true;
		this.claimModalSetting.isClaim = isClaim;
	}

	ellipsisString(string: string): string {
		const length = this.getWindowSize !== 'xxl' ? 21 : 59;
		if (string.length > length) {
			return `${string.slice(0, length)}...`;
		}
		return string;
	}

	// 取得查詢－資料類型選單
	getDataType() {
		return this.$dataCollectApi.getDataTypeInDataCollectUsingGET()
			.then((resp) => {
				this.dataTypeList = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// 取得查詢－資料狀態
	getDataStatus() {
		return this.$dataCollectApi.getDataStatusInDataCollectUsingGET()
			.then((resp) => {
				this.dataStatusList = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// 取得查詢－認列狀態
	getDataGroupStatus() {
		return this.$dataCollectApi.getDataGroupStatusInDataCollectUsingGET()
			.then((resp) => {
				this.groupStatusList = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// 取得查詢－已認列組別
	getGroup() {
		return this.$dataCollectApi.getGroupInDataCollectUsingGET()
			.then((resp) => {
				this.getGroupList = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// search emit
	search(form) {
		form.toDo ? this.searchForm = { toDo: true } : this.searchForm = form;
		this.grid.pagination.current = 1;
		this.queryData();
	}

	// 查詢資料蒐集確認列表
	queryData(form?: QueryDataCollectRequest) {
		this.rowSelection.selectedRowKeys = [];
		this.setLoading(true);
		const request: QueryDataCollectRequest = {
			...this.searchForm,
			pageIndex: this.grid.pagination.current - 1,
			pageSize: this.grid.pagination.pageSize,
		};
		return this.$dataCollectApi.queryInDataCollectUsingPOST(request)
			.then((resp) => {
				this.grid.data = resp.data.result.content;
				this.grid.pagination.total = parseInt(resp.data.result.totalElements);
			})
			.catch((error) => {
				console.log('error', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// tabel點擊分頁
	async onPageChange($event: FblPageEvent) {
		this.grid.pagination.current = $event.pagination.current;
		this.grid.pagination.pageSize = $event.pagination.pageSize;
		this.setLoading(true);
		await this.queryData();
		this.setLoading(false);
	}

	// 認列送出
	sendClaim(confirmUser) {
		this.setLoading(true);
		const request: SendClaimRequest = {
			confirmUser,
			crawlerDataId: this.rowSelection.selectedRowKeys,
			group: this.currentRole.roleUnits[0].auditorTeamCode,
		};
		this.$dataCollectApi.sendClaimInDataCollectUsingPOST(request)
			.then((resp) => {
				this.queryData();
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '資料蒐集(認列)成功',
						autoClose: 3,
					},
				});
				this.claimModalSetting.visible = false;
				(this.$refs.claimFormRef as any).clearForm();
			})
			.catch((error) => {
				console.log('error', error);
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

	// 非本組認列
	notClaim(applyRemark) {
		this.setLoading(true);
		const request: NotClaimRequest = {
			applyRemark,
			crawlerDataId: this.rowSelection.selectedRowKeys,
			group: this.currentRole.roleUnits[0].auditorTeamCode,
		};
		this.$dataCollectApi.notClaimInDataCollectUsingPOST(request)
			.then((resp) => {
				this.queryData();
				this.claimModalSetting.visible = false;
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '資料蒐集(非本組認列)成功',
						autoClose: 3,
					},
				});
				(this.$refs.claimFormRef as any).clearForm();
			})
			.catch((error) => {
				console.log('error', error);
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

	/**
	* Event
	*/
	async onPageDetail({ crawlerDataId }) {
		this.setLoading(true);
		// API: 查詢資料明細API
		this.$dataCollectApi.getDataCollectDetailInDataCollectUsingGET(crawlerDataId)
			.then((resp) => {
				const getData = resp.data;
				this.setDetailData({ crawlerData: getData.result });
				this.$global.changeRouterAndaddParam({
					toRouter: 'CrawlerDataDetail',
					query: {
						crawlerDataId,
					},
				});
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}
}
</script>

<style lang="scss" scoped >
	.title{
		font-size: 18px;
		font-weight: bold;
		color: $FONT-NORMAL;
		align-self: center;
	}
	.search-header{
		padding: 16px 0px 8px 0px;
	}
	.summary{
		max-width: 250px;
	}
	.crawlerindex-container{
		::v-deep{
			.ant-form-item-required{
				color: $FONT-LIGHT;
			}
		}
	}
	.datalink{
		color: #4CAAF5;
		text-decoration: none;
		background-color: transparent;
		outline: none;
		cursor: pointer;
		transition: color 0.3s;
		&:hover{
		color: #78c7ff;
		}
	}
	.text--warning{
		color: #E03E57;
	}
	::v-deep{
		.ant-checkbox-checked .ant-checkbox-inner::after{
			border-width: 3px;
		}
	}
</style>
