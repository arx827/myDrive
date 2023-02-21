<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div class="page__title">
          查詢結果
        </div>
        <div class="modal__btn">
          <button
            class="btn__main btn__main--light me-2"
            @click="downloadList"
          >
            下載
          </button>
          <button
            class="btn__main btn__main--light me-2"
            @click="historyModalVisible=true"
          >
            歷史異動紀錄
          </button>
          <button
            class="btn__main btn__main--light"
            @click="reviewModalVisible=true"
          >
            待覆核名單
          </button>
        </div>
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :custom-row="grid.customRow"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      >
        <template #edit="data">
          <button
            class="icon__btn"
            :class="{ 'btn--disable': data.data.dataStatus!==0 }"
            :disabled="data.data.dataStatus!==0"
            @click.prevent="editBtn(data.data)"
          >
            <a-icon type="edit" />
          </button>
        </template>
      </fbl-data-grid>
      <div class="btn__wrap text-center">
        <router-link :to="{name: 'UserMaintainIndex'}">
          <button class="btn__radius--primary">
            返回
          </button>
        </router-link>
      </div>
    </div>
    <ReviewModal
      :visible.sync="reviewModalVisible"
    />
    <HistoryModal
      :visible.sync="historyModalVisible"
    />
    <EditModal
      :visible.sync="editModal.visible"
      :edit-data="editModal.data"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
// import {
// 	UserManageQueryModelWithPage,
// } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
// import notification from '@/plugins/backStagePlugins/notification/infoNotification';
import HistoryModal from '@/pages/admin/userMaintain/UserMaintainHistoryModal.vue';
import EditModal from '@/pages/admin/userMaintain/UserMaintainEditModal.vue';
import ReviewModal from '@/pages/admin/userMaintain/UserMaintainReviewModal.vue';

@Component({
	components: {
		FblDataGrid,
		EditModal,
		ReviewModal,
		HistoryModal,
	},
})
export default class UserMaintainList extends Vue {
	@Action('setLoading') setLoading;

  h = this.$createElement;

  // 待覆核名單 Modal
  reviewModalVisible = false;

  // 歷史異動紀錄 Modal
  historyModalVisible = false;

  // 編輯使用者 Modal
  editModal = {
  	visible: false,
  	data: [],
  }

  // 需編輯資料
  editData = [];

  // 假資料
  fakeData = [
  	{
  		userId: 3,
  		name: '蕭Ｘ可',
  		adId: 'B0569',
  		userDept: 'VG800 職安管理部 職安勤務科',
  		dataStatus: 0,
  		crtName: null,
  		crtDt: null,
  		updName: null,
  		updDt: null,
  		proved: null,
  		reason: null,
  		roleNames: [
  			{
  				roleId: '1',
  				infoId: '1',
  				roleName: '員工',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '3',
  				infoId: '1',
  				roleName: '主管',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '4',
  				infoId: '1',
  				roleName: '系統管理員',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '2',
  				infoId: '1',
  				roleName: '護理師',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  		],
  	},
  	{
  		userId: 7,
  		name: '楊Ｘ裕',
  		adId: 'B1895',
  		userDept: 'VG800 職安管理部 庶務總務三科',
  		dataStatus: 1,
  		crtName: null,
  		crtDt: null,
  		updName: null,
  		updDt: null,
  		proved: null,
  		reason: null,
  		roleNames: [
  			{
  				roleId: '1',
  				infoId: '1',
  				roleName: '員工',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '4',
  				infoId: '1',
  				roleName: '系統管理員',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '2',
  				infoId: '1',
  				roleName: '護理師',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  		],
  	},
  	{
  		userId: 11,
  		name: '彭Ｘ雁',
  		adId: 'Y0039',
  		userDept: 'VG800 職安管理部 庶務總務二科',
  		dataStatus: 1,
  		crtName: null,
  		crtDt: null,
  		updName: null,
  		updDt: null,
  		proved: null,
  		reason: null,
  		roleNames: [
  			{
  				roleId: '1',
  				infoId: '1',
  				roleName: '員工',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  			{
  				roleId: '2',
  				infoId: '1',
  				roleName: '護理師',
  				enabled: 'Y',
  				remark: '健康資源系統',
  			},
  		],
  	},
  ];

  public grid = {
  	rowKey: 'adId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
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
  			property: 'adId',
  			title: 'AD帳號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'userDept',
  			title: '使用者單位',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'roleNames',
  			title: '角色名稱',
  			formatter: (data) => (data.roleNames ? data.roleNames.map((e) => e.roleName).join('、') : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'dataStatus',
  			title: '資料狀態',
  			formatter: (data) => (data.dataStatus === 0 ? '可異動' : '不可異動'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtName',
  			title: '申請人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtDt',
  			title: '申請日期',
  			customRender: (data) => ((data.crtDt) ? this.h('div', [
  				this.h('div', moment(data.crtDt).format('YYYY/MM/DD')), this.h('div', moment(data.crtDt).format('HH:mm:ss')),
  			]) : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updName',
  			title: '覆核人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updDt',
  			title: '覆核日期',
  			customRender: (data) => ((data.updDt) ? this.h('div', [
  				this.h('div', moment(data.updDt).format('YYYY/MM/DD')), this.h('div', moment(data.reviewDate).format('HH:mm:ss')),
  			]) : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'proved',
  			title: '覆核結果',
  			formatter: (data) => {
  				//
  				let result;
  				switch (data.proved) {
  				case 0:
  					result = '待覆核';
  					break;
  				case 1:
  					result = '同意';
  					break;
  				case 2:
  					result = '退回';
  					break;

  				default:
  					result = '';
  					break;
  				}
  				return result;
  			},
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reason',
  			title: '退回原因',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'edit',
  			template: 'edit',
  			fixed: 'right',
  		},
  	],
  };

  created() {
  	this.getData();
  }

  getData() {
  	this.grid.data = this.fakeData;
  	// this.grid.pagination.total = 0;
  	// const query = this.$global.getQuery();
  	// this.setLoading(true);
  	// const data: UserManageQueryModelWithPage = {
  	// 	userDept: query.userDept,
  	// 	name: query.name,
  	// 	adId: query.adId,
  	// 	pageNo: this.grid.pagination.current - 1,
  	// 	pageSize: this.grid.pagination.pageSize,
  	// };
  	// this.$AdminControlAdminApi.usersPageUsingPOST(data)
  	// 	.then((resp) => {
  	// 		if (resp.data.status === 200) {
  	// 			if (resp.data.data.content && resp.data.data.content.length > 0) {
  	// 				this.grid.data = resp.data.data.content;
  	// 				this.grid.pagination.total = parseInt(resp.data.data.totalElements);
  	// 			} else {
  	// 				notification.error({ content: '查無資料' });
  	// 			}
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

  editBtn(data) {
  	this.editModal.data = data;
  	this.editModal.visible = true;
  }

  downloadList() {
  	// const query = this.$global.getQuery();
  	// this.setLoading(true);
  	// const data: UserManageQueryModelWithPage = {
  	// 	userDept: query.userDept,
  	// 	name: query.name,
  	// 	adId: query.adId,
  	// };
  	// this.$AdminControlAdminApi.usersPageDownloadUsingPOST(data, { responseType: 'blob' })
  	// 	.then((resp) => {
  	// 		const disposition = resp.headers['content-disposition'];
  	// 		if (disposition) {
  	// 		  let filename = '';
  	// 			if (disposition.indexOf('attachment') !== -1) {
  	// 				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  	// 				const matches = filenameRegex.exec(disposition);
  	// 				if (matches != null && matches[1]) {
  	// 					filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  	// 				}
  	// 			}
  	// 			this.$blobUtils.download(
  	// 				resp.data as Blob,
  	// 				filename,
  	// 				resp.headers['content-type'],
  	// 			);
  	// 		} else {
  	// 			this.$AdminControlAdminApi.usersPageDownloadUsingPOST(data)
  	// 				.then((resp) => {
  	// 					const respData = JSON.stringify(resp);
  	// 					const apiErrorMsg = JSON.parse(respData).data.apiError;
  	// 					this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  	// 				}).catch((error) => {
  	// 					// TEST:
  	// 					// console.log(error);
  	// 				}).finally(() => {
  	// 					this.setLoading(false);
  	// 				});
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // 換頁或換日期
  onPageChange(e) {
  	// this.grid.pagination = e.pagination;
  	// this.getData();
  }

  updated() {
  	// window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
#fubon-backStagePage {
	.modal__btn {
		text-align: center;
		margin-top: 15px;
		@include bs-rwd-md {
			margin: 0;
		}
		.btn__main{
			padding: 4px 24px;
		}
	}
  .icon__btn {
    background: #F5F8FC;
    color: #23C4A8;
    border-radius: 16px;
    border: 0;
    width: 40px;
    height: 32px;
    &:hover {
      color: #FFFFFF;
      background: #23C4A8;
			cursor: pointer;
    }
  }
	.btn--disable, .btn--disable:hover {
		background-color: #F5F5F5;
		color: #999999;
		cursor: default;
	}
  ::v-deep {
		.ant-table {
			color: #595959;
		}
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 12px 10px;
      white-space: pre-line;
    }
    .ant-tabs-bar {
      border: 0;
    }
    .ant-table-column-title {
      font-weight: bold;
    }
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
}
</style>
