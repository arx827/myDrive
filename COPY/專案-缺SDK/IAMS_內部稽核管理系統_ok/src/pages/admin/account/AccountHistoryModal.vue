<template>
  <a-modal
    v-model="visibleSync"
    :mask-closable="false"
    :width="'90%'"
    :footer="null"
    class="common__modal fubon-backStage_modal"
    :after-close="onClose"
  >
    <div class="event__block">
      <div class="page__title m-0">
        歷史異動紀錄
      </div>
    </div>
    <div class="userMaintain__wrap">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="formRules"
        :layout="'vertical'"
      >
        <div class="userMaintain__block bg__light">
          <div class="row">
            <div class="col-md-6">
              <div class="d-flex">
                <div class="input__title">
                  申請日期
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="applyDate"
              >
                <date-picker
                  v-model="form.applyDate"
                  type="date"
                  :range="true"
                  :formatter="dateFormatter"
                  placeholder="e.g. 111/01/01~111/02/01"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </div>
            <div class="col-md-6">
              <div class="d-flex">
                <div class="input__title">
                  覆核狀態
                </div>
              </div>
              <a-form-model-item
                prop="approveStatus"
              >
                <a-radio-group
                  v-model="form.approveStatus"
                  class="row"
                >
                  <div
                    v-for="item in statusOptions"
                    :key="item.value"
                    class="col-12 col-md"
                  >
                    <a-radio
                      :value="item.value"
                      class="query__wrap mb-2"
                    >
                      {{ item.label }}
                    </a-radio>
                  </div>
                </a-radio-group>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="d-flex">
                <div class="input__title">
                  AD帳號
                </div>
              </div>
              <a-form-model-item
                prop="domainId"
              >
                <a-input
                  v-model="form.domainId"
                  placeholder="e.g. A1234"
                />
              </a-form-model-item>
            </div>
            <div class="col-md-6">
              <div class="d-flex">
                <div class="input__title">
                  姓名
                </div>
              </div>
              <a-form-model-item
                prop="name"
              >
                <a-input
                  v-model="form.name"
                  vue="true"
                  alt="webfont"
                  placeholder="e.g. 林曉春"
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline me-1"
              @click="onClose"
            >
              取消
            </button>
            <button
              class="btn__radius--primary ms-1"
              @click="onSearch"
            >
              查詢
            </button>
          </div>
        </div>
      </a-form-model>
    </div>
    <div
      v-if="grid.data"
      class="content__wrap"
    >
      <div class="content__title d-flex justify-content-between align-items-center">
        查詢結果
        <IconTextButton
          v-if="grid.data && grid.data.length > 0"
          class="me-2"
          text="下載"
          type="download"
          @click="downloadList"
        />
      </div>
    </div>
    <div
      v-if="grid.data"
      class="table__wrap"
    >
      <a-table
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data-source="grid.data"
        :pagination="grid.pagination"
        @change="onPageChange($event)"
      >
        <a-table
          slot="expandedRowRender"
          slot-scope="slotProps"
          :row-key="innerGrid.rowKey"
          :columns="innerGrid.columns"
          :data-source="innerGrid.data[slotProps.id]"
          :pagination="false"
        />
      </a-table>
    </div>
    <div class="btn__wrap d-flex justify-content-center">
      <button
        class="btn__radius--primary"
        @click="onClose"
      >
        返回
      </button>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
// import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import { SearchLogRequest, DownloadLogRequest } from '@fubonlife/iams-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import { Action, namespace } from 'vuex-class';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import { uuid } from 'vue-uuid';

const modalModule = namespace('modalControl');

// @Component({ components: { FblDataGrid } })
@Component({ components: { IconTextButton } })
export default class AccountHistoryModal extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  h = this.$createElement;

  @PropSync('visible')
  visibleSync!: boolean

  @Watch('visible')
  onVisibleChanged(val) {
  	if (val) return this.clearForm();
  }

  // 覆核狀態 選項
  statusOptions = [
  	{ value: '*', label: '全部' },
  	{ value: 'pass', label: '同意' },
  	{ value: 'reject', label: '退回' },
  ]

  dateFormatter = this.$twDateFormatter;

  // 表單
  form = {
  	applyDate: null,
  	approveStatus: '*', // 預設全部
  	domainId: null,
  	name: null,
  };

  // 檢核規則 (皆非必填)
  formRules: { [key: string]: ValidationRule[] } = {
  	applyDate: [
  		{ required: true, message: '請選擇申請日期', trigger: 'change' },
  		{ trigger: 'change', validator: this.appltDateValidator },
  	],
  	domainId: [{ pattern: /^[a-zA-Z0-9]*$/, message: '只能填入英文、數字', trigger: 'change' }],
  };

  grid = {
  	rowKey: 'id',
  	data: null,
  	pagination: {
  		size: 'small',
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '15', '25'],
  		showSizeChanger: true,
  		showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  	},
  	columns: [
  		{
  			title: 'AD帳號',
  			dataIndex: 'domainId',
  			key: 'domainId',
  			width: 90,
  		},
  		{
  			title: '姓名',
  			dataIndex: 'name',
  			key: 'name',
  			width: 100,
  		},
  		{
  			title: '申請人員',
  			dataIndex: 'applyUser',
  			key: 'applyUser',
  			width: 100,
  		},
  		{
  			title: '申請日期',
  			dataIndex: 'applyDatetime',
  			key: 'applyDatetime',
  			width: 120,
  			// customRender: (data) => (data ? this.h('div', [this.h('div', moment(data).format('YYYY/MM/DD')), this.h('div', moment(data).format('HH:mm:ss'))]) : ''),
  		},
  		{
  			title: '覆核人員',
  			dataIndex: 'approveUser',
  			key: 'approveUser',
  			width: 100,
  		},
  		{
  			title: '覆核日期',
  			dataIndex: 'approveDatetime',
  			key: 'approveDatetime',
  			width: 120,
  		},
  		{
  			title: '覆核狀態',
  			dataIndex: 'approveStatus',
  			key: 'approveStatus',
  			width: 100,
  		},
  		{
  			title: '退回原因',
  			dataIndex: 'remark',
  			key: 'remark',
  			width: 130,
  			customRender: (data) => (data === null ? '- -' : data),
  		},
  	],
  };

  public innerGrid = {
  	rowKey: 'id',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			title: '角色名稱', // roleName + remark，多筆一起呈現
  			dataIndex: 'roleUnit',
  			key: 'roleUnit',
  			customRender: (data) => this.h('div', data?.join('、')),
  		},
  	],
  };

  public appltDateValidator(rule, value, callback) {
  	if (!value) return callback('請選擇申請日期');
  	if (value?.[0] && value?.[1]) {
  		const startYear = value[0].getTime();
  		const endYear = value[1].getTime();
  		// (1000 milliseconds _ (60 minutes _ 60 seconds) * 24 hours);
  		const diffDays = (endYear - startYear) / (1000 * 3600 * 24);
  		console.log('diffYear', diffDays);
  		if (diffDays > 365) return callback('申請日期區間，最多以1年為限，請重新選擇區間');
  		return callback();
  	}
  		return callback('請選擇申請日期');
  }

  // 下載
  downloadList() {
  	this.setLoading(true);
  	const request: DownloadLogRequest = {
  		name: this.form.name,
  		startDatetime: this.form.applyDate?.[0] ? moment(this.form.applyDate[0]).format('YYYY-MM-DD') : null,
  		endDatetime: this.form.applyDate?.[1] ? moment(this.form.applyDate[1]).format('YYYY-MM-DD') : null,
  		domainId: this.form.domainId,
  		approveStatus: this.form.approveStatus,
  	};
  	this.$accountApi.downloadListLogInAccountUsingPOST(request, { responseType: 'blob' })
  		.then((resp) => {
  			this.$blobUtils.download(resp.data as unknown as Blob, `使用者維護歷史異動紀錄_${moment().format('YYYYMMDD_hhmmss')}.xlsx`);
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '下載使用者維護歷史異動紀錄失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 查詢
  onSearch() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			console.log('this.form', this.form);
  			this.grid.pagination.current = 1;
  	    this.searchUserHistory();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 取消
  onClose() {
  	this.visibleSync = false;
  	this.grid.pagination.current = 1;
  	this.grid.pagination.pageSize = 10;
  }

  // 清除表單
  clearForm() {
  	this.form = {
  		applyDate: null,
  		approveStatus: '*', // 預設全部
  		domainId: null,
  		name: null,
  	};
  	this.setDefaultApplyDate();
  	this.grid.data = null;
  	this.innerGrid.data = [];
  	(this.$refs.ruleForm as any)?.resetFields();
  }

  // API: 查詢使用者歷史異動紀錄
  searchUserHistory() {
  	this.setLoading(true);
  	const NewRangeDate = this.form.applyDate;
  	const request: SearchLogRequest = {
  		name: this.form.name,
  		startDatetime: this.form.applyDate?.[0] ? moment(this.form.applyDate[0]).format('YYYY-MM-DD') : null,
  		endDatetime: this.form.applyDate?.[1] ? moment(this.form.applyDate[1]).format('YYYY-MM-DD') : null,
  		domainId: this.form.domainId,
  		approveStatus: this.form.approveStatus,
  		pageIndex: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	this.$accountApi.searchListLogInAccountUsingPOST(request)
  		.then((resp) => {
  			console.log(resp);
  			this.grid.pagination.total = parseInt(resp.data.totalElements);
  			this.grid.data = resp.data.content.map((log) => ({
  				...log,
  				id: uuid.v4(),
  			}));
  			this.grid.data.forEach((item) => {
  				this.innerGrid.data[item.id] = [
  					{
  						roleUnit: item.roleUnit,
  						id: item.id,
  					},
  				];
  			});
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '查詢歷史異動紀錄失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // tabel點擊分頁
  onPageChange($event) {
  	console.log($event);
  	this.grid.pagination.current = $event.current;
  	this.grid.pagination.pageSize = $event.pageSize;
  	this.searchUserHistory();
  }

  setDefaultApplyDate() {
  	const today = new Date();
  	const tomorrow = new Date();
  	tomorrow.setDate(today.getDate() + 1);
  	this.form.applyDate = [today, tomorrow];
  }
}
</script>

<style lang="scss" scoped>
  .input__title {
    font-size: 16px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 8px;
  }
  .userMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include bs-rwd-sm {
      padding: 20px 70px;
    }
  }
  .content__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
	.table__wrap {
		overflow-x: scroll;
	}
  .query__wrap {
    background-color: #fff;
    padding: 8px 10px;
    width: 100%;
    border-radius: 4px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  ::v-deep {
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
    .ant-form-item-required::before {
      display: none;
    }
    .ant-input, .mx-input {
      height: 40px;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
    .ant-table-expanded-row, .ant-table-expanded-row th, .ant-table-expanded-row:hover {
      background: #F5F8FC;
    }
  }
</style>
