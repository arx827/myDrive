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
      :visible="reviewModalVisible"
      @closeReviewModal="reviewModalVisible=false"
    />
    <HistoryModal
      :visible="historyModalVisible"
      @closeHistoryModal="historyModalVisible=false"
    />
    <EditModal
      :visible="editModalVisible"
      :edit-data="editData"
      @closeEditModal="editModalVisible=false"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import {
	UserManageQueryModelWithPage,
} from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import ReviewModal from '@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainReviewModal.vue';
import HistoryModal from '@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainHistoryModal.vue';
import EditModal from '@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainEditModal.vue';

@Component({
	components: {
		Breadcrumb, FblDataGrid, ReviewModal, HistoryModal, EditModal,
	},
})
export default class SendNoticeModifyReserveResult extends Vue {
	@Action('setLoading') setLoading;

  h = this.$createElement;

  // 待覆核名單 Modal
  reviewModalVisible = false;

  // 歷史異動紀錄 Modal
  historyModalVisible = false;

  // 編輯使用者 Modal
  editModalVisible = false;

  // 需編輯資料
  editData = [];

  // 假資料
  fakeData = [
  	{
  		name: '歐陽小魚(留)',
  		adNum: 'A1234',
  		unit: 'VL000 職安管理部(留)',
  		roleName: '系統管理員(留)',
  		status: '不可異動',
  		applyName: '',
  		applyDate: '',
  		reviewName: '',
  		reviewDate: '',
  		reviewResult: '',
  		reason: '',
  	},
  	{
  		name: '陳珪魚',
  		adNum: 'A1235',
  		unit: 'VL000 職安管理部',
  		roleName: '護理人員、主管',
  		status: '可異動',
  		applyName: '蕭世一',
  		applyDate: '2022-06-06T13:23:48.017+0800',
  		reviewName: '畢曉彤(預留)',
  		reviewDate: '2022-06-06T13:23:48.017+0800',
  		reviewResult: '退回',
  		reason: '此員工已離職。(預留更多文字空間)',
  	},
  	{
  		name: '黃魚魚',
  		adNum: 'A1236',
  		unit: 'VL000 職安管理部',
  		roleName: '護理人員',
  		status: '可異動',
  		applyName: '蕭世一',
  		applyDate: '2022-06-06T13:23:48.017+0800',
  		reviewName: '畢曉彤(預留)',
  		reviewDate: '2022-06-06T13:23:48.017+0800',
  		reviewResult: '同意',
  		reason: '',
  	},
  ];

  public grid = {
  	rowKey: 'rowkey',
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
  				this.h('div', moment(data.updDt).format('YYYY/MM/DD')), this.h('div', moment(data.updDt).format('HH:mm:ss')),
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
  	// this.grid.data = this.fakeData;
  	const query = this.$global.getQuery();
  	this.setLoading(true);
  	const data: UserManageQueryModelWithPage = {
  		userDept: query.userDept,
  		name: query.name,
  		adId: query.adId,
  		pageNo: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	this.$AdminControlAdminApi.usersPageUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data.content && resp.data.data.content.length > 0) {
  					this.grid.data = resp.data.data.content;
  					this.grid.data.map((item, index) => {
  						item.rowkey = index + 1;
  					});
  					this.grid.pagination.total = parseInt(resp.data.data.totalElements);
  				} else {
  					notification.error({ content: '查無資料' });
  				}
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  editBtn(data) {
  	console.log(data);
  	this.editData = data;
  	this.editModalVisible = true;
  }

  downloadList() {
  	const query = this.$global.getQuery();
  	this.setLoading(true);
  	const data: UserManageQueryModelWithPage = {
  		userDept: query.userDept,
  		name: query.name,
  		adId: query.adId,
  	};
  	this.$AdminControlAdminApi.usersPageDownloadUsingPOST(data, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  			  let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
  				this.$AdminControlAdminApi.usersPageDownloadUsingPOST(data)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						// TEST:
  						// console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 換頁或換日期
  onPageChange(e) {
  	this.grid.pagination = e.pagination;
  	this.getData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
  }
	.modal__btn {
		text-align: center;
		margin-top: 15px;
		@include rwd-md {
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
</style>
