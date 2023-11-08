<template>
  <div>
    <div class="container">
      <div class="page__title">
        查詢結果
      </div>
      <div class="pt-4 btn__down">
        <button
          class="btn__radius--primary--outline--small"
          @click="isShowSendModal=true"
        >
          全區間發送通知
        </button>
      </div>
      <a-tabs
        v-model="activeKey"
        @change="dateChange"
      >
        <a-tab-pane
          v-for="(item, index) in daysList"
          :key="index"
          :tab="item"
        >
          <fbl-data-grid
            class="query__table"
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :row-selection="rowSelection"
            :data="grid.data"
            :pagination="grid.pagination"
            :custom-row="grid.customRow"
            :scroll="{ x: true }"
            @tableChange="onPageChange($event)"
          >
            <template #reserveTime="data">
              {{ data.data.sessionStartDate }}~{{ data.data.sessionEndDate }}
            </template>
            <template #modifyReserve="data">
              <div class="border-end">
                <button
                  v-if="data.data.reserveName==='無預約'"
                  class="table__btn--add px-2 py-1"
                  @click="addReserve(data.data)"
                >
                  新增預約
                </button>
                <button
                  v-else
                  class="table__btn--cancel px-2 py-1"
                  @click="cancelReserve(data.data)"
                >
                  取消預約
                </button>
              </div>
            </template>
            <template #edit="data">
              <button
                class="icon__btn"
                :class="{ 'btn--disable': data.data.reserveName==='無預約' }"
                :disabled="data.data.reserveName==='無預約'"
                @click.prevent="editBtn(data.data)"
              >
                <a-icon type="edit" />
              </button>
            </template>
            <template #dowmload="data">
              <button
                class="icon__btn"
                :class="{ 'btn--disable': data.data.reserveName==='無預約' }"
                :disabled="data.data.reserveName==='無預約'"
                @click.prevent="downloadBtn(data.data)"
              >
                <a-icon type="download" />
              </button>
            </template>
            <template #caseMaintain="data">
              <button
                class="icon__btn"
                :class="{ 'btn--disable': data.data.reserveName==='無預約' }"
                :disabled="data.data.reserveName==='無預約'"
                @click.prevent="caseMaintainBtn(data.data)"
              >
                <a-icon type="idcard" />
              </button>
            </template>
          </fbl-data-grid>
        </a-tab-pane>
      </a-tabs>
      <div
        v-if="daysList.length > 0"
        class="btn__wrap text-center"
      >
        <button
          class="btn__radius--primary"
          :disabled="selectedRowAll && selectedRowAll.length === 0"
          @click="checkSendNotice"
        >
          發送提醒通知
        </button>
      </div>
    </div>
    <SendModal
      :visible="isShowSendModal"
      @closeModal="isShowSendModal=false"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import SendModal from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveSend.vue';
import {
 	QueryPhyConsultSessionSingleModel,
	QueryPhyConsultSessionPeriodModel,
	SendRemindModel,
	CancelReserveDto,
} from '@fubonlife/oss-api-axios-sdk';
import InfoModal from '@/plugins/notification/infoModal';
import DataTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

require('bootstrap/js/dist/modal');

@Component({ components: { Breadcrumb, FblDataGrid, SendModal } })
export default class SendNoticeModifyReserveResult extends Vue {
	@Action('setLoading') setLoading;

	// 選擇的日期
  activeKey = 0;

	// 單日
	actDate = null;

	// 選取的所有日期
	daysList = [];

	isShowSendModal = false

	// 將開始到結束所有的日期列出來
	enumerateDaysBetweenDates(startDate, endDate) {
		const start = moment(startDate);
		const end = moment(endDate);
		const day = end.diff(start, 'days');
		this.daysList.push(start.format('YYYY/MM/DD'));
		for (let i = 1; i <= day; i++) {
			this.daysList.push(start.add(1, 'days').format('YYYY/MM/DD'));
		}
		this.actDate = startDate;
	}

  public grid = {
  	rowKey: 'id',
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
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 0,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'reserveTime',
  			title: '預約時段',
  			width: 120,
  			template: 'reserveTime',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserveLoction',
  			title: '預約地點',
  			width: 130,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserveName',
  			title: '預約人姓名',
  			width: 200,
  			customRender: (data) => this.$createElement('div', {
  				style: {
  					color: (data.reserveName === '無預約') ? '#999999' : '#595959',
  				},
  			}, data.reserveName),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'srcFrom',
  			title: '資料來源',
  			width: 170,
  			customRender: (data) => this.$createElement('div', {
  				style: {
  					color: (data.srcFrom === '無預約') ? '#999999' : '#595959',
  				},
  			}, data.srcFrom),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'status',
  			title: '個案狀態',
  			width: 95,
  			customRender: (data) => this.$createElement('div', {
  				style: {
  					color: (data.status === '無預約') ? '#999999' : '#595959',
  				},
  			}, data.status),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'modifyReserve',
  			title: '修改預約',
  			width: 120,
  			template: 'modifyReserve',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'edit',
  			width: 50,
  			template: 'edit',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'dowmload',
  			title: '下載',
  			width: 60,
  			template: 'dowmload',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'caseMaintain',
  			title: '個案維護',
  			width: 50,
  			template: 'caseMaintain',
  		},
  	],
  };

  // API: 查詢醫師諮詢活動時段-單日
  async fetchSingleData(date) {
  	this.setLoading(true);
  	const singleQuery: QueryPhyConsultSessionSingleModel = {
  		actDate: date,
  		pageNo: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	await this.$PCRRpnSendRemindAndModifyReservationApi.getPhyConsultSessionSingleUsingPOST(singleQuery)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				const getData = resp.data.data.content;
  				this.grid.data = getData.map(({
  					reserveName, srcFrom, status, ...other
  				}, index) => ({
  					id: index.toString(),
  					reserveName: reserveName || '無預約',
  					srcFrom: (!reserveName) ? '無預約' : srcFrom,
  					status: (!reserveName) ? '無預約' : status,

  					...other,
  					}));
  				// this.enumerateDaysBetweenDates(date, date);
  				this.grid.pagination.total = parseInt(resp.data.data.totalElements);
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

  // API:查詢醫師諮詢活動時段-區間
  async fetchSessionData(range) {
  	this.setLoading(true);
  	const rangeQuery: QueryPhyConsultSessionPeriodModel = {
  		startDate: range[0],
  		endDate: range[1],
  		pageNo: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	await this.$PCRRpnSendRemindAndModifyReservationApi.getPhyConsultSessionUsingPOST(rangeQuery)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				const getData = resp.data.data.content;
  				this.grid.data = getData.map(({
  					reserveName, srcFrom, status, ...other
  				}, index) => ({
  					id: index.toString(),
  					reserveName: reserveName || '無預約',
  					srcFrom: (!reserveName) ? '無預約' : srcFrom,
  					status: (!reserveName) ? '無預約' : status,

  					...other,
  					}));
  				// this.enumerateDaysBetweenDates(range[0], range[1]);
  				this.grid.data = this.grid.data.filter((item) => item.actDate === this.daysList[this.activeKey]);
  				this.grid.pagination.total = parseInt(resp.data.data.totalElements);
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

  async getData(type?) {
  	const query = this.$global.getQuery();
  	const dataType = type || query.dateType;
  	const date = this.actDate || query.data;
  	console.log(date);
  	(dataType === 'single') ? await this.fetchSingleData(date) : await this.fetchSingleData(date[0]);
  }

  created() {
  	this.getData();
  	const query = this.$global.getQuery();
  	const dataType = query.dateType;
  	const date = this.actDate || query.data;
  	(dataType === 'single') ? this.enumerateDaysBetweenDates(date, date) : this.enumerateDaysBetweenDates(date[0], date[1]);
  }

  // 勾選列的資料
  selectedRowAll = [];

  // 勾選列的index
	selectedRowKeyAll = [];

	// 判斷哪幾列被勾選
	get rowSelection() {
		return {
			onChange: (selectedRowKeys, selectedRows) => {
				this.selectedRowKeyAll = selectedRowKeys;
				this.selectedRowAll = selectedRows;
			},
			getCheckboxProps: (record) => ({
				props: {
					disabled: record.reserveName === null,
					name: record.name,
				},
			}),
		};
	}

	// 新增預約
	async addReserve(data) {
		this.$global.changeRouterAndaddParam({
			toRouter: 'SendNoticeModifyReserveConfirm',
			params: {
				type: 'add',
			},
			query: { data },
		});
	}

	// 取消預約彈窗
	cancelReserve(data) {
		InfoModal.alertError({
			title: '確定取消預約嗎？',
			confirm: true,
			content: `即將取消 ${data.reserveName} 的諮詢預約，您確定要取消嗎？`,
			onCallback: () => this.cancelOk(data),
		});
	}

	cancelOk(data) {
		const query: CancelReserveDto = {
			cancelReason: data.cancelReason,
			reserveInfoId: data.reserveInfoId,
		};
		this.setLoading(true);
		// 取消預約
		this.$PCRRpnSendRemindAndModifyReservationApi.addReserveQueryUsingPOST(query)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.getData();
					notification.success({ content: '取消預約成功' });
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
		this.setLoading(true);
		// 編輯預約-查詢結果頁
		this.$PCRRpnSendRemindAndModifyReservationApi.updateReserveQueryUsingPOST(data.reserveInfoId)
			.then(async (resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
  					toRouter: 'SendNoticeModifyReserveConfirm',
						params: {
							type: 'edit',
						},
  					query: { data, editData: resp.data.data },
  				});
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

	downloadBtn(data) {
		this.setLoading(true);
  	// 表單下載
  	this.$PCRRpnPhysicianConsultationFormsDownloadControllerApi.exportPhyFormUsingPOST({ reserveInfoId: data.reserveInfoId }, { responseType: 'blob' })
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
  				this.$PCRRpnPhysicianConsultationFormsDownloadControllerApi.exportPhyFormUsingPOST({ reserveInfoId: data.reserveInfoId })
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
							const apiErrorMsg = JSON.parse(respData).data.apiError;
							this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
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

	// 個案維護
	caseMaintainBtn(data) {
		// TEST:
		console.log('個案維護', data);
		const type: any = 'doctor';
  	sessionStorage.setItem('caseMaintainType', JSON.stringify({ tableType: type }));
		this.$global.changeRouterAndaddParam({
  		toRouter: 'CaseMaintainList',
  		query: {
  			data: { uid: JSON.parse(data.reserveUid) },
  			type: 'doctor',
  		},
  	});
	}

	// 選擇其他日期
	dateChange() {
		// const date = this.activeKey && DataTimeFormmat.formatStringDateDault(this.daysList[this.activeKey]);
		const date = DataTimeFormmat.formatStringDateDault(this.daysList[this.activeKey]);
		// console.log(this.activeKey && DataTimeFormmat.formatStringDateDault(this.daysList[this.activeKey]));
		this.actDate = date;
		this.grid.pagination.current = 1;
		this.fetchSingleData(date);
	}

	checkSendNotice() {
		const sendRemindModelList: SendRemindModel = {};
		this.selectedRowAll.forEach((item, index) => {
			sendRemindModelList[index] = { actId: item.actId, reserveUid: item.reserveUid };
		});
		this.setLoading(true);
		// 發送提醒通知
		this.$PCRRpnSendRemindAndModifyReservationApi.sendRemindUsingPOST(Object.values(sendRemindModelList))
			.then((resp) => {
				if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
  					toRouter: 'SendNoticeModifyReserveSendResult',
  					query: {
  						data: this.selectedRowAll,
  						result: 'success',
  					},
  				});
				} else {
					this.$global.changeRouterAndaddParam({
  					toRouter: 'SendNoticeModifyReserveSendResult',
  					query: {
  						result: 'fail',
							message: this.$global.getApiErrorMsg(resp.data.apiError),
  					},
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
		// this.daysList = [];
		console.log(this.actDate);
		this.getData('single');
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
  .btn__down {
    position: absolute;
    top: 40px;
    right: 30px;
    z-index: 2;
		@include rwd-xl {
			top: 50px;
    	right: 10px;
		}
  }
  .table__btn--add {
    color: #23C4A8;
    background: #F5F8FC;
    border-radius: 16px;
    border: 0;
    &:hover {
      color: #FFFFFF;
      background: #23C4A8;
			cursor: pointer;
    }
  }
  .table__btn--cancel {
    color: #F46A6A;
    background: #FFEBEB;
    border-radius: 16px;
    border: 0;
    &:hover {
      color: #FFFFFF;
      background: #F46A6A;
			cursor: pointer;
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
    .ant-tabs-nav-container {
      width: 50%;
			@include rwd-lg {
				margin: auto;
			}
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding: 12px 10px;
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
