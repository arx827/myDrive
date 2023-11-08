<template>
  <div class="container">
    <!-- 查詢 -->
    <div
      v-show="!isTodoShow"
      key="queryForm"
      class="search-form"
    >
      <a-form-model
        ref="formRef"
        class="d-flex align-items-start flex-wrap"
        :model="searchForm"
        :rules="searchRules"
        :hide-required-mark="true"
      >
        <div class="d-flex col">
          <div class="search-form__item col">
            <div class="search-form__label">
              用途
            </div>
            <a-form-model-item prop="sysCodeMainId">
              <a-select
                v-model="searchForm.sysCodeMainId"
                show-search
                placeholder="請選擇"
                class="search-form__input--select"
                :allow-clear="true"
                :dropdown-match-select-width="true"
                @change="getSysCodeDetailIdOptions"
              >
                <a-select-option
                  v-for="item in sysCodeMainIdOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.value + ' ' + item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="search-form__item col">
            <div class="search-form__label">
              大分類
            </div>
            <a-form-model-item>
              <a-select
                v-model="searchForm.sysCodeDetailId"
                show-search
                placeholder="請選擇"
                class="search-form__input--select"
                :allow-clear="true"
                :dropdown-match-select-width="true"
                @change="getSysCodeGroupIdOptions"
              >
                <a-select-option
                  v-for="item in sysCodeDetailIdOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.value + ' ' + item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="search-form__item col">
            <div class="search-form__label">
              小分類
            </div>
            <a-form-model-item>
              <a-select
                v-model="searchForm.sysCodeGroupId"
                show-search
                placeholder="請選擇"
                class="search-form__input--select"
                :allow-clear="true"
                :dropdown-match-select-width="true"
              >
                <a-select-option
                  v-for="item in sysCodeGroupIdOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
        </div>
        <a-button
          class="btn--search"
          style="margin-top: 22px"
          @click="onSearch"
        >
          查詢
        </a-button>
      </a-form-model>
    </div>

    <!-- title bar -->
    <div class="d-flex justify-content-between search-header">
      <div
        v-show="!isTodoShow"
        key="titleBar"
        class="title"
      >
        系統代碼
        <a-badge
          v-show="todoGrid.data.length > 0"
          key="todoBadge"
          :count="todoGrid.pagination.total"
          :offset="['-5px', '0px']"
        >
          <a-tag
            color="red"
            class="ms-3"
          >
            <a
              @click="
                (todoGrid.pagination.current = 1),
                getTodo(),
                (isTodoShow = true)
              "
            >
              待辦
            </a>
          </a-tag>
        </a-badge>
      </div>
      <div
        v-show="isTodoShow"
        key="todoTitle"
        class="title"
      >
        待辦清單
      </div>
      <ActionBar
        :select-row-ids="rowSelection.selectedRowKeys"
        :is-todo-show="isTodoShow"
        @click="handleClick"
      />
    </div>

    <!-- table -->
    <fbl-data-grid
      v-show="!isTodoShow"
      key="searchResultGrid"
      :row-key="
        (record, index) => {
          return index;
        }
      "
      :columns="listGrid.columns"
      :data="listGrid.data"
      :pagination="listGrid.pagination"
      :expanded-row-keys="[]"
      :scroll="{ x: 'max-content' }"
      @tableChange="onPageChange($event, 'listGrid')"
    >
      <template v-slot:ellipsis="{ data, property }">
        <a-popover
          overlay-class-name="popover--summary"
          placement="top"
          :trigger="
            data[property] &&
              (getWindowSize == 'xxl'
                ? data[property].length < 60
                : data[property].length < 22)
              ? ''
              : 'hover'
          "
        >
          <template slot="content">
            <span>
              {{ data[property] }}
            </span>
          </template>
          {{ ellipsisString(data[property]) }}
        </a-popover>
      </template>
      <template v-slot:edit="slotProps">
        <div
          class="action-icon btn__icon--edit-acion"
          @click="
            (modifyVisible = true),
            (modifyType = 'edit'),
            (modifyData = slotProps.data)
          "
        />
      </template>
    </fbl-data-grid>

    <fbl-data-grid
      v-show="isTodoShow"
      key="todoGrid"
      :row-key="todoGrid.rowKey"
      :columns="todoGrid.columns"
      :data="todoGrid.data"
      :pagination="todoGrid.pagination"
      :expanded-row-keys="[]"
      :scroll="{ x: 'max-content' }"
      :row-selection="rowSelection"
      @tableChange="onPageChange($event, 'todoGrid')"
    >
      <template v-slot:ellipsis="{ data, property }">
        <a-popover
          overlay-class-name="popover--summary"
          placement="top"
          :trigger="
            data[property] &&
              (getWindowSize == 'xxl'
                ? data[property].length < 60
                : data[property].length < 22)
              ? ''
              : 'hover'
          "
        >
          <template slot="content">
            <span>
              {{ data[property] }}
            </span>
          </template>
          {{ ellipsisString(data[property]) }}
        </a-popover>
      </template>
      <template v-slot:queryNotice="slotProps">
        <div
          class="action-icon btn--action"
          type="primary"
          @click="
            (modifyVisible = true),
            (modifyType = 'readonly'),
            (modifyData = slotProps.data)
          "
        >
          <a-icon type="eye" />
        </div>
      </template>
    </fbl-data-grid>

    <!-- Modal -->
    <ModifyModal
      :visible="modifyVisible"
      :type="modifyType"
      :init-data="modifyData"
      @closeModal="onModifyModalClose"
    />
    <InfoModal
      title="匯入"
      :visible="importVisible"
      :width="470"
      padding-size="normal"
      :footer="true"
      @closeModal="importVisible = false"
      @confirmModal="onImport"
    />
    <ExportModal
      :visible="exportVisible"
      @closeModal="exportVisible = false"
      @click="exportExcel"
    />
    <InfoModal
      :title="confirmTitle"
      :visible="confirmVisible"
      :width="470"
      :footer="true"
      @closeModal="confirmVisible = false"
      @confirmModal="onConfirm(confirmType)"
    >
      <template slot="content">
        <fragment>
          <div
            v-show="confirmType == 'reject'"
            key="todoRejectForm"
          >
            <a-form-model
              ref="rejectRef"
              class="mt-4 form--light"
              :model="rejectForm"
              :rules="rejectRules"
              :hide-required-mark="true"
            >
              <a-form-model-item
                prop="remark"
                :label-col="{ span: 24 }"
                :wrapper-col="{ span: 24 }"
              >
                <span slot="label">退回意見：</span>
                <div class="confirm-message">
                  <img
                    class="confirm-message__img"
                    :src="require(`@/assets/images/icon_not_recogniz.svg`)"
                    alt=""
                  >
                  <a-textarea
                    v-model="rejectForm.remark"
                    :auto-size="{ minRows: 4 }"
                  />
                </div>
              </a-form-model-item>
            </a-form-model>
          </div>
        </fragment>
      </template>
    </InfoModal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Getter, Action, namespace } from 'vuex-class';
import { SelectOptionDto } from '@fubonlife/iams-api-axios-sdk';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import ModifyModal from '@components/admin/parameter/ModifyModal.vue';
import ExportModal from '@components/admin/parameter/ExportModal.vue';
import ActionBar from '@components/admin/parameter/ActionBar.vue';
import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';
import moment from 'moment';
import fileDownload from 'js-file-download';

export interface ResultModel {
	visible: boolean;
	title: string;
	content?: string;
	type: 'success' | 'error';
	autoClose?: string;
}
const modalModule = namespace('modalControl');

@Component({
	components: {
		IconTextButton,
		InfoModal,
		FblDataGrid,
		ModifyModal,
		ActionBar,
		ExportModal,
	},
})
export default class ParameterIndex extends Vue {
	@modalModule.Action('setModalState') setModalState;

	@Getter getWindowSize!: string;

	@Action('setLoading') setLoading;

	modifyVisible: boolean = false;

	modifyType: string = '';

	modifyData = [];

	importVisible: boolean = false;

	confirmVisible: boolean = false;

	confirmTitle: string = '';

	confirmType: string = '';

	isTodoShow: boolean = this.$route.params.type === 'todo';

	exportVisible: boolean = false;

	// 當前角色
	currentRoleId: string = this.$global.getCurrentRoleId();

	// 查詢表單
	searchForm = {
		sysCodeMainId: undefined,
		sysCodeDetailId: undefined,
		sysCodeGroupId: undefined,
	};

	rejectForm = {
		remark: '',
	};

	// 查詢條件
	searchCatch = {
		sysCodeMainId: undefined,
		sysCodeDetailId: undefined,
		sysCodeGroupId: undefined,
	};

	// 查詢驗證規則
	searchRules: { [key: string]: ValidationRule[] } = {
		sysCodeMainId: [
			{ required: true, message: '請選擇用途', trigger: 'change' },
		],
	};

	rejectRules: { [key: string]: ValidationRule[] } = {
		remark: [{ required: true, message: '請輸入退回原因', trigger: 'blur' }],
	};

	// MainId 選單
	sysCodeMainIdOptions: SelectOptionDto[] = null;

	// DetailId 選單
	sysCodeDetailIdOptions: SelectOptionDto[] = null;

	// GroupId 選單
	sysCodeGroupIdOptions: SelectOptionDto[] = null;

	// FblPDataGridHolder<script>
	listGrid = {
		rowKey: 'sysCodeMainId',
		data: [],
		pagination: {
			size: 'small',
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['10', '15', '25', '50'],
			showSizeChanger: true,
			showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
		},
		columns: [
			{
				key: 'sysCodeMainId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeMainId',
				title: '用途（代碼）',
			},
			{
				key: 'defaultTextInSysCodeMain',
				type: FblColumnType.PLAIN,
				property: 'defaultTextInSysCodeMain',
				title: '用途（名稱）',
			},
			{
				key: 'doubleCheck',
				type: FblColumnType.PLAIN,
				property: 'doubleCheck',
				title: 'doubleCheck',
				hidden: true,
			},
			{
				key: 'editableInSysCodeMain',
				type: FblColumnType.PLAIN,
				property: 'editableInSysCodeMain',
				title: 'editableInSysCodeMain',
				hidden: true,
			},
			{
				key: 'remarkInSysCodeMain',
				type: FblColumnType.PLAIN,
				property: 'remarkInSysCodeMain',
				title: 'remarkInSysCodeMain',
				hidden: true,
			},
			{
				key: 'sysCodeDetailId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeDetailId',
				title: '大分類（代碼）',
			},
			{
				key: 'defaultTextInSysCodeDetail',
				type: FblColumnType.TEMPLATE,
				template: 'ellipsis',
				property: 'defaultTextInSysCodeDetail',
				title: '大分類（名稱）',
			},
			{
				key: 'enabledInDetail',
				type: FblColumnType.PLAIN,
				property: 'enabledInDetail',
				title: 'enabledInDetail',
				hidden: true,
			},
			{
				key: 'editableInSysCodeDetail',
				type: FblColumnType.PLAIN,
				property: 'editableInSysCodeDetail',
				title: 'editableInSysCodeDetail',
				hidden: true,
			},
			{
				key: 'sequenceInSysCodeDetail',
				type: FblColumnType.PLAIN,
				property: 'sequenceInSysCodeDetail',
				title: 'sequenceInSysCodeDetail',
				hidden: true,
			},
			{
				key: 'remarkInSysCodeDetail',
				type: FblColumnType.PLAIN,
				property: 'remarkInSysCodeDetail',
				title: 'remarkInSysCodeDetail',
				hidden: true,
			},
			{
				key: 'sysCodeGroupId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeGroupId',
				title: '小分類（代碼）',
			},
			{
				key: 'defaultTextInSysCodeGroup',
				type: FblColumnType.TEMPLATE,
				template: 'ellipsis',
				property: 'defaultTextInSysCodeGroup',
				title: '小分類（名稱）',
			},
			{
				key: 'enabledInGroup',
				type: FblColumnType.PLAIN,
				property: 'enabledInGroup',
				title: 'enabledInGroup',
				hidden: true,
			},
			{
				key: 'sequenceInSysCodeGroup',
				type: FblColumnType.PLAIN,
				property: 'sequenceInSysCodeGroup',
				title: 'sequenceInSysCodeGroup',
				hidden: true,
			},
			{
				key: 'remarkInSysCodeGroup',
				type: FblColumnType.PLAIN,
				property: 'remarkInSysCodeGroup',
				title: 'remarkInSysCodeGroup',
				hidden: true,
			},
			{
				key: 'edit',
				type: FblColumnType.TEMPLATE,
				property: 'edit',
				title: '編輯',
				template: 'edit',
				width: '100px',
				fixed: 'right',
			},
		],
	};

	todoGrid = {
		rowKey: 'sysCodeLogId',
		data: [],
		pagination: {
			size: 'small',
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['10', '15', '25', '50'],
			showSizeChanger: true,
			showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
		},
		columns: [
			{
				key: 'sysCodeLogId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeLogId',
				title: 'sysCodeLogId',
				hidden: true,
			},
			{
				key: 'sysCodeMainId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeMainId',
				title: '用途（代碼）',
			},
			{
				key: 'defaultMainText',
				type: FblColumnType.PLAIN,
				property: 'defaultMainText',
				title: '用途（名稱）',
			},
			{
				key: 'sysCodeDetailId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeDetailId',
				title: '大分類（代碼）',
			},
			{
				key: 'defaultDetailText',
				type: FblColumnType.TEMPLATE,
				template: 'ellipsis',
				property: 'defaultDetailText',
				title: '大分類（名稱）',
			},
			{
				key: 'sysCodeGroupId',
				type: FblColumnType.PLAIN,
				property: 'sysCodeGroupId',
				title: '小分類（代碼）',
			},
			{
				key: 'defaultGroupText',
				type: FblColumnType.TEMPLATE,
				template: 'ellipsis',
				property: 'defaultGroupText',
				title: '小分類（名稱）',
			},
			{
				key: 'status',
				type: FblColumnType.PLAIN,
				property: 'status',
				title: '狀態',
				hidden: true,
			},
			// {
			// 	key: 'jsonString',
			// 	type: FblColumnType.PLAIN,
			// 	property: 'jsonString',
			// 	title: 'jsonString',
			// 	formatter: (data) => JSON.parse(data.jsonString),
			// },
			// {
			// 	key: 'operate',
			// 	type: FblColumnType.PLAIN,
			// 	property: 'operate',
			// 	title: '操作',
			// 	width: 80,
			// },
			{
				key: 'applyUser',
				type: FblColumnType.PLAIN,
				property: 'applyUser',
				title: '申請人',
			},
			{
				key: 'applyDatetime',
				type: FblColumnType.PLAIN,
				property: 'applyDatetime',
				title: '申請日期',
				formatter: (data) =>
					DateTimeFormmat.transformRocDate(data.applyDatetime),
			},
			{
				key: 'query',
				type: FblColumnType.TEMPLATE,
				property: 'query',
				title: '預覽',
				template: 'queryNotice',
				width: '100px',
				fixed: 'right',
			},
		],
	};

	async created() {
		await this.init();
		console.log('currentRoleId', this.currentRoleId);
	}

	init() {
		return Promise.all([this.getSysCodeMainIdOptions(), this.getTodo()]);
	}

	ellipsisString(string: string): string {
		const length = this.getWindowSize !== 'xxl' ? 21 : 59;
		if (string && string.length > length) {
			return `${string.slice(0, length)}...`;
		}
		return string;
	}

	// 取得查詢－MainId 選單
	getSysCodeMainIdOptions() {
		return this.$parameterApi
			.searchMainInParameterUsingGET()
			.then((resp) => {
				this.sysCodeMainIdOptions = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// 取得查詢－DetailId 選單
	getSysCodeDetailIdOptions() {
		this.searchForm.sysCodeDetailId = undefined;
		this.searchForm.sysCodeGroupId = undefined;
		return this.$parameterApi
			.searchDetailInParameterUsingGET(this.searchForm.sysCodeMainId)
			.then((resp) => {
				this.sysCodeDetailIdOptions = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	// 取得查詢－GroupId 選單
	getSysCodeGroupIdOptions() {
		this.searchForm.sysCodeGroupId = undefined;
		if (this.searchForm.sysCodeDetailId == null) {
			return;
		}
		return this.$parameterApi
			.searchGroupInParameterUsingGET(
				this.searchForm.sysCodeDetailId,
				this.searchForm.sysCodeMainId,
			)
			.then((resp) => {
				this.sysCodeGroupIdOptions = resp.data.result;
			})
			.catch((error) => {
				console.log('error', error);
			});
	}

	onSearch() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.listGrid.pagination.current = 1;
				this.searchCatch = this.searchForm;
				this.queryData(this.searchCatch);
			}
		});
	}

	queryData(form) {
		console.log('form', form);
		this.setLoading(true);
		const request = {
			...form,
			pageIndex: this.listGrid.pagination.current - 1,
			pageSize: this.listGrid.pagination.pageSize,
		};
		this.$parameterApi
			.searchInParameterUsingPOST(request)
			.then((resp) => {
				const data = resp.data.result.using;
				(this.listGrid.data as any) = data.content;
				this.listGrid.pagination.total = parseInt(data.totalElements);
			})
			.catch(console.error)
			.finally(() => {
				this.setLoading(false);
			});
	}

	// table點擊分頁
	async onPageChange($event: FblPageEvent, girdName) {
		this[girdName].pagination.current = $event.pagination.current;
		this[girdName].pagination.pageSize = $event.pagination.pageSize;
		(await girdName) == 'listGrid'
			? this.queryData(this.searchCatch)
			: this.getTodo();
	}

	onImport() {
		console.log('onImport');
	}

	onConfirm(type) {
		let rejectValid = false;
		if (type == 'reject') {
			(this.$refs.rejectRef as any).validate((valid) => {
				rejectValid = valid;
				this.confirmVisible = false;
			});
		}
		if (type == 'pass' || (type == 'reject' && rejectValid)) {
			this.setLoading(true);
			this.$parameterApi
				.reviewLogInParameterUsingPOST({
					remark: this.rejectForm.remark,
					status: type,
					sysCodeLogId: this.rowSelection.selectedRowKeys,
				})
				.then((resp) => {
					this.rowSelection.selectedRowKeys = [];
					this.init();
				})
				.catch((error) => {
					const title = type == 'pass' ? '通過' : '退回';
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: `${title}失敗`,
							content: error.response.data.message,
						},
					});
				})
				.finally(() => {
					this.confirmVisible = false;
					this.setLoading(false);
				});
		}
	}

	onModifyModalClose(modifyForm) {
		if (modifyForm) {
			this.searchForm.sysCodeMainId = modifyForm.sysCodeMainId;
			this.queryData(this.searchForm);
		}

		this.init().then(() => {
			this.getSysCodeDetailIdOptions();
			this.getSysCodeGroupIdOptions();
		});
		this.modifyVisible = false;
	}

	// table勾選項目
	rowSelection = {
		onChange: this.rowSelectionChange,
		selectedRowKeys: [],
	};

	rowSelectionChange(selectedRowKeys, selectedRows) {
		this.rowSelection.selectedRowKeys = selectedRowKeys;
	}

	getTodo() {
		this.$parameterApi
			.searchLogInParameterUsingPOST({
				status: 'ready',
				pageIndex: this.todoGrid.pagination.current - 1,
				pageSize: this.todoGrid.pagination.pageSize,
			})
			.then((resp) => {
				const data = resp.data.result;
				(this.todoGrid.data as any) = data.content;
				this.todoGrid.pagination.total = parseInt(data.totalElements);
			})
			.catch((error) => console.log(error));
	}

	goback() {
		this.isTodoShow = false;
		if (this.searchForm.sysCodeMainId) {
			this.queryData(this.searchForm);
		}
	}

	handleClick(action) {
		switch (action) {
		case 'add':
			this.modifyVisible = true;
			this.modifyType = 'add';
			this.modifyData = undefined;
			break;
		case 'import':
			this.importVisible = true;
			break;
		case 'export':
			this.onExport();
			break;
		case 'goback':
			this.goback();
			break;
		case 'pass':
			this.confirmVisible = true;
			this.confirmTitle = '確定要通過?';
			this.confirmType = 'pass';
			this.rejectForm.remark = '';
			break;
		case 'reject':
			this.confirmVisible = true;
			this.confirmTitle = '確定要退回?';
			this.confirmType = 'reject';
			this.rejectForm.remark = '';
			break;
		}
	}

	onExport() {
		this.exportVisible = true;
	}

	exportExcel(flag) {
		this.setLoading(true);
		const current = moment(new Date()).format('YYYY/MM/DD_HHmmss').split('/');
		if (flag) {
			// 匯出清單
			this.$parameterApi
				.exportResultInParameterUsingPOST(this.searchForm, {
					responseType: 'blob',
				})
				.then((resp) => {
					const fileName = `系統代碼清單_${current[0]}${current[1]}${current[2]}.xlsx`;
					fileDownload(resp.data as unknown as Blob, fileName);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		} else {
			// 匯出歷史清單
			this.$parameterApi
				.exportLogInParameterUsingPOST(this.searchForm, {
					responseType: 'blob',
				})
				.then((resp) => {
					const fileName = `系統代碼歷史清單_${current[0]}${current[1]}${current[2]}.xlsx`;
					fileDownload(resp.data as unknown as Blob, fileName);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		}
	}
}
</script>

<style lang="scss" scoped>
.title {
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: bold;
	color: $FONT-NORMAL;
	align-self: center;
	margin-left: 6px;
}
.search-form {
	padding: 14px 20px;
	margin: 0;
}
.search-form__item {
	display: inline-block;
	padding: 0px 6px;
}
.search-header {
	padding: 16px 0px 8px 0px;
}
.search-form__label {
	line-height: 22px;
}
.ant-form-item {
	margin-bottom: 0;
}
::v-deep .ant-form-item-control {
	line-height: 38px;
}
::v-deep .ant-tag {
	line-height: 18px;
	a {
		color: inherit;
		font-size: inherit;
	}
}
::v-deep .ant-badge-count {
	height: 20px;
	line-height: 20px;
	min-width: 20px;
	padding: 0 4px;
	font-size: 12px !important;
}
::v-deep .ant-scroll-number-only > p.ant-scroll-number-only-unit {
	font-size: 12px !important;
}
.confirm-message__img {
	position: absolute;
	top: -45px;
	right: 8px;
	width: 70px;
}
.action-icon {
	width: 23px;
	height: 23px;
	border: 0;
	padding: 0;
	background-color: transparent;
	vertical-align: middle;
	::v-deep svg {
		font-size: 23px;
	}
	&:hover {
		color: #35b69e;
	}
}
</style>
