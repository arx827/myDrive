<template>
  <div>
    <a-modal
      v-model="visibleSync"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="adminModal fubon-backStage_modal"
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
          :custom-row="grid.customRow"
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
          :disabled="disabledApplyBtn"
          @click="onBack"
        >
          退回
        </button>
        <button
          class="btn__radius--primary ms-1"
          :disabled="disabledApplyBtn"
          @click="updateUserRecord"
        >
          同意
        </button>
      </div>
    </a-modal>
    <BackModal
      :visible="backModalVisible"
      :back-data="checkedData"
      @closeBackModal="backModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import moment from 'moment';
// import notification from '@/plugins/backStagePlugins/notification/infoNotification';
import { Action } from 'vuex-class';
// import {
// 	CertPassUpdateDto,
// } from '@fubonlife/oss-api-axios-sdk';
import BackModal from '@/pages/admin/userMaintain/UserMaintainBackModal.vue';
// import { repeat } from 'rxjs/operators';
import { Window } from '../models';

@Component({
	components: {
		FblDataGrid,
		BackModal,
	},
})
export default class UserMaintainReviewModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @PropSync('visible')
  visibleSync!: boolean

  modalVisible = false;

  // 退回資料
  backData = [];

	// 勾選資料
	checkedData = [];

  // 填寫退回原因 Modal
  backModalVisible = false;

	disabledApplyBtn = true;

  public grid = {
  	rowKey: 'adId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'adId',
  			title: 'AD帳號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '姓名',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'userDept',
  			title: '使用者單位',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'roles',
  			title: '角色名稱',
  			formatter: (data) => (data.roles ? data.roles.map((e) => e.roleName).join(',') : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'execAction',
  			title: '執行功能',
  			formatter: (data) => (data.execAction === 'CREATE' ? '新增' : '修改'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtName',
  			title: '申請人',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtDt',
  			title: '申請日期',
  			formatter: (data) => (data.crtDt ? moment(data.crtDt).format('YYYY/MM/DD HH:MM:SS') : ''),
  		},
  	],
  };

	@Watch('selectedRowAll')
  onCheckedChange(val) {
  	val.length > 0 ? this.disabledApplyBtn = false : this.disabledApplyBtn = true;
  }

	created() {
  	this.getData();
	}

	getData() {
  	// this.grid.data = this.fakeData;
  	this.searchUserRecord();
	}

  // 勾選列的資料
  selectedRowAll = [];

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

	// 清除所選
	clearCheck() {
		this.selectedRowAll = [];
		this.selectedRowKeys = [];
		// this.grid.data = [];
		console.log('clear');
	}

	// 退回, 打開彈窗
	onBack() {
		console.log('退回');
		this.checkedData = this.selectedRowAll;
  	this.backModalVisible = true;
	}

	// 1.2.37.查詢使用者待覆核紀錄
	searchUserRecord() {
		this.grid.data = [
			{
				uuid: 'aab71a7c-21e9-46f8-9efb-10d13fbe1d91',
				userId: 11,
				adId: 'Y0039',
				name: '彭Ｘ雁',
				userDept: 'VG800',
				execAction: 'UPDATE',
				crtName: '蕭Ｘ可',
				crtDt: '2022-07-26T11:36:52.687+0800',
				roles: [
					{
						roleId: '2',
						roleName: '護理師',
						remark: '健康資源系統',
					},
					{
						roleId: '3',
						roleName: '主管',
						remark: '健康資源系統',
					},
					{
						roleId: '1',
						roleName: '員工',
						remark: '健康資源系統',
					},
				],
			},
			{
				uuid: 'bd22cc91-32ad-4e93-8616-20b5e2cb85ef',
				userId: 1,
				adId: 'B1527',
				name: '龍Ｘ瑜',
				userDept: 'VL700',
				execAction: 'UPDATE',
				crtName: '蕭Ｘ可',
				crtDt: '2022-08-11T18:30:33.647+0800',
				roles: [
					{
						roleId: '2',
						roleName: '護理師',
						remark: '健康資源系統',
					},
					{
						roleId: '3',
						roleName: '主管',
						remark: '健康資源系統',
					},
				],
			},
			{
				uuid: 'db53e6c1-434e-4a82-9a6d-dbff40ab7415',
				userId: 49,
				adId: 'B2024',
				name: '薛Ｘ丰',
				userDept: 'VG800 職安管理部 庶務總務五科',
				execAction: 'UPDATE',
				crtName: '蕭Ｘ可',
				crtDt: '2022-09-01T10:35:38.270+0800',
				roles: [
					{
						roleId: '2',
						roleName: '護理師',
						remark: '健康資源系統',
					},
					{
						roleId: '1',
						roleName: '員工',
						remark: '健康資源系統',
					},
				],
			},
		];
		// this.grid.data = [];
		// this.$AdminControlAdminApi.queryUserReviewListUsingPOST()
		// 	.then((resp) => {
		// 		if (resp.data.status === 200) {
		// 			this.grid.data = resp.data.data;
		// 		} else {
		// 			notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// 1.2.38.更新使用者待覆核紀錄 (同意)
	updateUserRecord() {
	// 	const data: CertPassUpdateDto = {
	// 		certPassUpdateUserDtoList: this.selectedRowAll.map((e) => ({ uuid: e.uuid })),
	// 		isAgree: true,
	// 	};
	// 	this.$AdminControlAdminApi.updateUserReviewStatusUsingPOST(data)
	// 		.then((resp) => {
	// 			this.$global.changeRouterAndaddParam({
	// 				toRouter: 'UserMaintainResult',
	// 				query: {
	// 					result: resp.data.status === 200 ? 'success' : 'error',
	// 					type: '覆核',
	// 					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 				},
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	// 取消
	onClose() {
		this.clearCheck();
  	this.visibleSync = false;
	}

	// updated() {
	// 	// 難字
	// 	window.parseWord();
	// }
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
	.table__wrap {
		overflow-x: scroll;
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
