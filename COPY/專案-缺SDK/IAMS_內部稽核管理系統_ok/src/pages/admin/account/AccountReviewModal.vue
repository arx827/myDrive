<template>
  <div>
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
          待覆核名單
        </div>
      </div>
      <div class="table__wrap">
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :row-selection="rowSelection"
          :data="grid.data"
          :pagination="false"
          :scroll="{ x: true }"
        />
      </div>
      <div class="btn__wrap d-flex justify-content-center">
        <button
          class="btn__radius--primary--outline me-1"
          @click="onClose"
        >
          取消
        </button>
        <button
          class="btn__radius--primary--outline me-1 ms-1"
          :disabled="selectedRowAll.length === 0"
          @click="onBack"
        >
          退回
        </button>
        <button
          class="btn__radius--primary ms-1"
          :disabled="selectedRowAll.length === 0"
          @click="onConfirm"
        >
          同意
        </button>
      </div>
    </a-modal>
    <AccountBackModal
      :visible.sync="accountBackModalVisible"
      :selected-user="selectedRowAll"
      @closeAccountBackModal="accountBackModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import moment from 'moment';
import { Action, namespace } from 'vuex-class';
import { PassReviewLogRequest, ReviewLogDto } from '@fubonlife/iams-api-axios-sdk';
import AccountBackModal from '@/pages/admin/account/AccountBackModal.vue';

const modalModule = namespace('modalControl');

@Component({
	components: {
		FblDataGrid,
		AccountBackModal,
	},
})
export default class AccountReviewModal extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  h = this.$createElement;

  @PropSync('visible')
  visibleSync!: boolean

  modalVisible = false;

  // 填寫退回原因 Modal
  accountBackModalVisible = false;

  grid: FblPDataGridHolder<ReviewLogDto> = {
  	rowKey: 'domainId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'domainId',
  			title: 'AD帳號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '姓名',
  			width: '80px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'accountUnit',
  			title: '使用者單位',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'roleUnit',
  			title: '角色名稱',
  			formatter: (data) => (data.roleUnit ? data.roleUnit?.join('、') : ''),
  			width: '40%',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'applyUser',
  			title: '申請人',
  			width: '80px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'applyDatetime',
  			title: '申請日期',
  		},
  	],
  };

  // 勾選列的資料
  selectedRowAll: ReviewLogDto[] = [];

  // 勾選列的index
	selectedRowKeys = [];

	// 判斷哪幾列被勾選
	get rowSelection() {
		const { selectedRowKeys } = this;
		return {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRowAll = selectedRows;
			},
			getCheckboxProps: (record) => ({
				props: {
					disabled: record.name === null,
					name: record.name,
				},
			}),
		};
	}

	@Watch('visibleSync')
	onVisibleChanged(val) {
  	console.log('visible', val);
  	if (val) this.getReviewList();
	}

	created() {
		if (this.visibleSync) this.getReviewList();
	}

	// API: 查詢待覆核名單
	getReviewList() {
  	this.setLoading(true);
  	this.$accountApi.searchReviewListInAccountUsingPOST()
  		.then((resp) => {
  			console.log('查詢待覆核名單', resp);
				this.grid.data = resp.data.result;
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

	// 清除所選
	clearCheck() {
		this.selectedRowAll = [];
		this.selectedRowKeys = [];
		// this.grid.data = [];
		console.log('clear');
	}

	// 退回, 打開彈窗
	onBack() {
  	this.accountBackModalVisible = true;
	}

	// API:  送出同意
	onConfirm() {
		this.setLoading(true);
		const request: PassReviewLogRequest[] = this.selectedRowAll.map((selectedUser) => ({
			accountId: selectedUser.accountId,
			logId: selectedUser.logId,
		}));
		this.$accountApi.passReviewListInAccountUsingPOST(request)
			.then((resp) => {
				this.$global.changeRouterAndaddParam({
					toRouter: 'AccountResult',
  				params: { type: 'pass' },
  				query: { result: 'success' },
				});
			})
			.catch((error) => {
				this.$global.changeRouterAndaddParam({
  				toRouter: 'AccountResult',
  				params: { type: 'pass' },
  				query: {
  					result: 'fail',
  					msg: error.response.data.message,
  				},
  			});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 取消
	onClose() {
		this.clearCheck();
  	this.visibleSync = false;
	}
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include bs-rwd-sm {
      padding: 20px 70px;
    }
  }
  .query__table {
    min-width: 800px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-bottom: 50px;
    button {
      max-width: 100%;
      width: 100px;
      @include bs-rwd-lg {
        width: 200px;
      }
    }
  }
  ::v-deep {
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
  }
</style>
