<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        使用者維護
      </div>
      <div class="d-flex align-items-center">
        <!-- <IconTextButton
          class="me-3"
          text="新增使用者"
          type="add"
          @click="accountEditModal.visible = true"
        /> -->
        <IconTextButton
          class="me-3"
          text="歷史異動紀錄"
          type="record"
          @click="historyModal.visible = true"
        />
        <IconTextButton
          class="me-3"
          text="待覆核名單"
          type="list"
          @click="reviewModal.visible = true"
        />
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
          <div class="userMaintain__block__title">
            使用者查詢
          </div>

          <div class="row">
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
          <div class="row">
            <div class="col-sm">
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
            <div class="col-sm">
              <div class="d-flex">
                <div class="input__title">
                  使用者單位
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="department"
              >
                <a-select
                  v-model="form.department"
                  :allow-clear="true"
                  :filter-option="$global.filterOption"
                  :show-search="true"
                >
                  <a-select-option
                    v-for="dept in deptOptions"
                    :key="dept.value"
                    :value="dept.value"
                  >
                    {{ dept.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
          </div>
        </div>
      </a-form-model>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary--outline me-1"
          @click="onReset"
        >
          重設
        </button>
        <button
          class="btn__radius--primary"
          @click="onSearch"
        >
          查詢
        </button>
      </div>
      <div
        v-if="gridData.data"
        class="result__block"
      >
        <div class="result__block__header d-flex justify-content-between">
          <div class="result__block__title ms-2">
            使用者維護查詢結果
          </div>
          <div>
            <IconTextButton
              v-if="gridData.data && gridData.data.length > 0"
              class="me-2"
              text="下載"
              type="download"
              @click="downloadList"
            />
          </div>
        </div>
        <div class="table">
          <FblDataGrid
            :row-key="gridData.rowKey"
            :columns="gridData.columns"
            :data="gridData.data"
            :pagination="gridData.pagination"
            :empty-data="gridData.data.length <= 0"
            :scroll="{ x: true }"
            @tableChange="onPageChange($event)"
          >
            <template v-slot:roleUnit="slotProps">
              <div>{{ slotProps.data.roleUnit && slotProps.data.roleUnit.join('、') }}</div>
            </template>
            <template v-slot:edit="slotProps">
              <div
                class="d-flex justify-content-center edit__block"
                :class="{'disabled__block': !slotProps.data.editable}"
              >
                <button
                  class="d-flex justify-content-center align-items-center iconblock"
                  :disabled="!slotProps.data.editable"
                  @click="openEditModal(slotProps.data)"
                >
                  <a-icon
                    type="edit"
                  />
                </button>
              </div>
            </template>
          </FblDataGrid>
        </div>
      </div>
    </div>
    <ReviewModal
      :visible.sync="reviewModal.visible"
    />
    <HistoryModal
      :visible.sync="historyModal.visible"
    />
    <AccountEditModal
      :visible.sync="accountEditModal.visible"
      :edit-data="editData"
      :dept-options="deptOptions"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import HistoryModal from '@admin/account/AccountHistoryModal.vue';
import ReviewModal from '@admin/account/AccountReviewModal.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import AccountEditModal from '@/pages/admin/account/AccountEditModal.vue';
import {
	SearchAccountRequest, DepartmentId, SearchSingleAccountRequest, SearchAccountDto, SearchSingleAccountDto, DownloadAccountRequest,
} from '@fubonlife/iams-api-axios-sdk';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';

const modalModule = namespace('modalControl');

@Component({
	components: {
		FblDataGrid,
		ReviewModal,
		HistoryModal,
		IconTextButton,
		AccountEditModal,
	},
})
export default class AccountIndex extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  // 待覆核名單 Modal
  reviewModalVisible = false;

  // 歷史異動紀錄 Modal
  historyModalVisible = false;

  // 表單
  form = {
  	name: null,
  	domainId: null,
  	department: null, // 預設使用者登入單位
  };

  // 檢核規則
  formRules: { [key: string]: ValidationRule[] } = {
  	department: [{ required: true, message: '請選擇使用者單位', trigger: 'change' }],
  	domainId: [{ pattern: /^[a-zA-Z0-9]*$/, message: '只能填入英文、數字', trigger: 'change' }],
  };

  // 使用者單位 下拉選項
  deptOptions = null;

  accountEditModal = {
  	visible: false,
  }

  historyModal = {
  	visible: false,
  }

  reviewModal = {
  	visible: false,
  }

  editData: SearchSingleAccountDto = null;

  gridData: FblPDataGridHolder<SearchAccountDto> = {
  	rowKey: 'empNo',
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
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '員工姓名',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'domainId',
  			title: 'AD帳號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'accountUnit',
  			title: '使用者單位',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'roleUnit',
  			title: '角色名稱',
  			width: '300px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'applyUser',
  			title: '申請人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'applyDatetime',
  			title: '申請日期',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'approveUser',
  			title: '覆核人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'approveDatetime',
  			title: '覆核日期',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'approveStatus',
  			title: '覆核結果',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			title: '退回原因',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'enabled',
  			title: '帳號狀態',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			title: '',
  			template: 'edit',
  			fixed: 'right',
  		},
  	],
  }

  checkShowEdit(endDt) {
  	return DateTimeFormmat.isValidDate(endDt) ? DateTimeFormmat.isValidDate(endDt) < new Date() : true;
  }

  	// 判斷從 代辦事項 還是從 meun 點進來
	@Watch('$route.params.type', { immediate: true })
  watchRouterParamsType(val) {
  	if (val === 'todo') this.reviewModal.visible = true;
  }

	get departmentId(): DepartmentId {
  	const departmentId = this.deptOptions.find((dep) => dep.value === this.form.department);
  	return departmentId ? {
  		value: departmentId?.value,
  		whichDB: departmentId?.whichDB,
  	} : null;
	}

	created() {
  	this.getDeptList();
  	// 使用者單位預設帶入登入者單位
  	this.form.department = this.$user.getMe().employee.departmentId;
	}

	// API: 取得使用者單位選單
	getDeptList() {
  	this.setLoading(true);
  	this.$accountApi.searchDeptListInAccountUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			this.deptOptions = resp.data;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 查詢使用者維護清單(page)
	getAccountList() {
  	this.setLoading(true);
  	const request: SearchAccountRequest = {
  		departmentId: this.departmentId,
  		name: this.form.name,
  		domainId: this.form.domainId,
  		pageIndex: this.gridData.pagination.current - 1,
  		pageSize: this.gridData.pagination.pageSize,
  	};

  	this.$accountApi.searchListInAccountUsingPOST(request)
  		.then((resp) => {
  			console.log(resp);
  			this.gridData.data = resp.data.content;
  			this.gridData.pagination.total = parseInt(resp.data.totalElements);
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '查詢使用者維護失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 取得單筆使用者資料
	async getAccountDetail(request: SearchSingleAccountRequest) {
  	this.setLoading(true);
  	await this.$accountApi.searchInAccountUsingPOST(request)
  		.then((resp) => {
  			console.log('取得單筆使用者資料', resp);
  			this.editData = resp.data;
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 下載查詢結果
	downloadList() {
  	this.setLoading(true);
  	const request: DownloadAccountRequest = {
  		departmentId: this.departmentId,
  		name: this.form.name,
  		domainId: this.form.domainId,
  	};
  	this.$accountApi.downloadListInAccountUsingPOST(request, { responseType: 'blob' })
  		.then((resp) => {
  			this.$blobUtils.download(resp.data as unknown as Blob, `使用者維護查詢結果_${moment().format('YYYYMMDD_hhmmss')}.xlsx`);
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '下載使用者維護查詢結果失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// tabel點擊分頁
	async onPageChange($event: FblPageEvent) {
  	this.gridData.pagination.current = $event.pagination.current;
  	this.gridData.pagination.pageSize = $event.pagination.pageSize;
  	this.getAccountList();
	}

	// 重設
	onReset() {
  	this.form = {
  		name: null,
  		domainId: null,
  		department: null, // 預設使用者登入單位
  	};
  	this.gridData.pagination.current = 1;
  	this.gridData.pagination.pageSize = 10;
	}

	// 查詢
	onSearch() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.gridData.pagination.current = 1;
  			this.getAccountList();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
	}

	// 開啟編輯彈窗
	async openEditModal(account: SearchAccountDto) {
  	await this.getAccountDetail({
  		accountId: account.accountId,
  		domainId: account.domainId,
  		empNo: account.empNo,
  		whichDB: account.whichDB,
  	});
  	this.accountEditModal.visible = true;
	}
}
</script>

<style lang="scss" scoped>
  .userMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .input__title {
    font-size: 16px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 8px;
  }
  .userMaintain__block__title {
    font-weight: 600;
    font-size: 24px;
    padding-bottom: 30px;
  }
  .result__block {
    margin-top: 30px;
    .result__block__header {
      margin-bottom: 20px;
      .result__block__title {
        font-size: 24px;
        font-weight: $BS-TEXT-BOLD;
      }
    }
  }
  .edit__block {
    button {
      border: 0px;
      cursor: pointer;
    }
  }
  .table {
    margin-bottom: 40px;
  }
  ::v-deep{
    .ant-form-item {
      margin: 0px;
    }
    .ant-select-selection__rendered {
      line-height: 42px;
    }
    .ant-select-selection {
      height: 42px;
    }
    .ant-input {
      height: 42px;
    }
    .mx-input {
      height: 42px;
    }
    .iconblock{
      width: 46px;
      height: 32px;
      background-color: $BS-COLOR-MAIN10;
      border-radius: 16px;
      color: $BS-COLOR-MAIN1;
      .anticon svg {
        font-size: 20px;
      }
    }
    .disabled__block{
      .anticon svg {
        font-size: 20px;
        color: grey;
      }
      button {
        cursor: not-allowed;
      }
    }
  }
  ::v-deep{
    .ant-form-item {
      margin: 0px;
    }
    .ant-select-selection__rendered {
      line-height: 42px;
    }
    .ant-select-selection {
      height: 42px;
    }
    .ant-input {
      height: 42px;
    }
    .mx-input {
      height: 42px;
    }
    .iconblock{
      width: 46px;
      height: 32px;
      background-color: $BS-COLOR-MAIN10;
      border-radius: 16px;
      color: $BS-COLOR-MAIN1;
      .anticon svg {
        font-size: 20px;
      }
    }
    .disabled__block{
      .anticon svg {
        font-size: 20px;
        color: grey;
      }
      button {
        cursor: not-allowed;
      }
    }
  }
</style>
