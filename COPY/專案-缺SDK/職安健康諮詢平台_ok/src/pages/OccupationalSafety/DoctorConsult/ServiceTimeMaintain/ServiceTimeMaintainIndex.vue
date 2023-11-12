<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          服務場次管理
        </div>
        <div class="serviceTime__btnGroup pt-4">
          <button
            class="btn__radius--primary--outline--small"
            @click="handleShowModal('print')"
          >
            列印資訊
          </button>
          <button
            class="btn__radius--primary--outline--small"
            @click="handleShowModal('release')"
          >
            發布多場次
          </button>
          <button
            class="btn__radius--primary--bg--small"
            @click="handleAdd"
          >
            新增
          </button>
        </div>
      </div>
      <div class="serviceTime__wrap">
        <a-table
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data-source="gridData.data"
          class="components-table-demo-nested"
        >
          <div
            slot="handleTemp"
            slot-scope="slotProps"
            class="d-flex"
          >
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': slotProps.actStatus == 2}"
              :disabled="slotProps.actStatus == 2"
              @click="handleEdit(slotProps)"
            >
              <a-icon type="edit" />
            </button>
            <button
              class="icon-button icon__delete"
              @click="handleDelete(slotProps)"
            >
              <a-icon type="delete" />
            </button>
          </div>
          <a-table
            slot="expandedRowRender"
            slot-scope="slotProps"
            :row-key="innerGridData.rowKey"
            :columns="innerGridData.columns"
            :data-source="innerGridData.data[slotProps.actId]"
            :pagination="false"
          />
        </a-table>
      </div>
    </div>
    <PrintAndReleaseModal
      ref="printAndReleaseModal"
      :visible="printAndReleaseModalVisible"
      :type="printOrReleaseType"
      @closeModal="closeModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import PrintAndReleaseModal from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/PrintAndReleaseModal.vue';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import { Modal } from 'ant-design-vue';

require('bootstrap/js/dist/modal');

@Component({ components: { PrintAndReleaseModal } })
export default class ServiceTimeMaintainIndex extends Vue {
	@Action('setLoading') setLoading;

  printOrReleaseType: string = '';

	printAndReleaseModalVisible = false;

  // 父層 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	// pagination: {
  	// 	current: 1,
  	// 	pageSize: Number(this.$global.getPageArray()[0]),
  	// 	total: 1,
  	// 	showSizeChanger: true,
  	// 	pageSizeOptions: this.$global.getPageArray(),
  	// 	showQuickJumper: true,
  	// },
  	columns: [
  		{
  			title: '活動地點',
  			dataIndex: 'actLocation',
  			key: 'actLocation',
  		},
  		{
  			title: '活動日期',
  			dataIndex: 'actDate',
  			key: 'actDate',
  		},
  		{
  			title: '活動時間',
  			dataIndex: 'actTime',
  			key: 'actTime',
  		},
  		{
  			title: '間距時間',
  			dataIndex: 'timeInterval',
  			key: 'timeInterval',
  		},
  		{
  			title: '護理人員',
  			dataIndex: 'nurseName',
  			key: 'nurseName',
  		},
  		{
  			title: '活動狀態',
  			dataIndex: 'actStatus',
  			key: 'actStatus',
  			customRender: (data) => {
  				if (data) {
  					return this.$enum.getVal('releaseStatusEnum', data);
  				}
  				return null;
  			},
  		},
  		{
  			title: '',
  			scopedSlots: { customRender: 'handleTemp' },
  			width: 30,
  			align: 'right',
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'rowkey',
  	data: {},
  	pagination: false,
  	columns: [
  		{
  			title: '排班醫師',
  			dataIndex: 'physicianName',
  			key: 'physicianName',
  		},
  		{
  			title: '排班日期',
  			dataIndex: 'scheduleDate',
  			key: 'scheduleDate',
  		},
  		{
  			title: '排班時間',
  			dataIndex: 'scheduleTime',
  			key: 'scheduleTime',
  		},
  		{
  			title: '發送通知提醒日期',
  			dataIndex: 'remindDate',
  			key: 'remindDate',
  		},
  		{
  			title: '發布活動設定',
  			dataIndex: 'publicStatus',
  			key: 'publicStatus',
  			customRender: (data) => {
  				if (data) {
  					return this.$enum.getVal('publicStatusEnum', data);
  				}
  				return null;
  			},
  		},
  	],
  }

  /**
   * Func
   */
  // API: 查詢醫生諮詢場次設定(Page)
  getGridData() {
  	this.setLoading(true);
  	this.$PCRRpnRpnServiceFieldManagementApi.getPhyConsultActPageRUsingPOST({ pageNo: 0, pageSize: 100 })
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				// TEST:
  				// console.log(resp.data);
  				const getData = resp.data.data;
  				const { content } = getData;

  				// 外層Table
  				this.gridData.data = content;
  				this.gridData.data.map((item, index) => {
  					item.rowkey = index + 1;
  				});
  				// 內層Table(細項)
  				content.map((dto) => {
  					const { actId } = dto;
  					Object.assign(this.innerGridData.data, { [actId]: [] });
  					this.innerGridData.data[actId].push({ rowkey: 1, ...dto });
  					// this.innerGridData.data[actId].map((item, index) => {
  					// 	item.rowkey = index + 1;
  					// });
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  handleEdit({ actId }) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'ServiceTimeMaintainAddAndEdit',
  		params: {
  			type: 'edit',
  		},
  		query: {
  			actId,
  		},
  	});
  }

  handleDelete(data) {
  	const { actStatus, actId, actLocation } = data;
  	// 刪除「已發布」的場次
  	if (actStatus == 2) {
  		InfoModal.alertError({
  			title: '確定刪除這個場次嗎？',
  			confirm: true,
  			content: '該場次狀態為「發布中」，且已有同仁報名該活動。如確定要執行刪除，請先下載報名人員名單(員編/身分證、姓名)，再進行刪除。',
  			disabled: true,
  			customContent: () => this.$createElement('div', {
  				attrs: {
  					class: 'btn__radius--primary--bg--small modal__btn--dowload',
  					style: 'font-weight: normal; margin-top: 20px; width: 100%;',
  				},
  				on: {
  					click: () => this.downloadExcel(actId, actLocation),
  				},
  			}, [
  				this.$createElement('a-icon', {
  					attrs: {
  						name: '',
  						type: 'download',
  					},
  				}),
  				this.$createElement('div', {}, '下載已報名人員名單'),
  			]),
  			onCallback: () => {
  				this.$PCRRpnRpnServiceFieldManagementApi.deletePhyConsultActRUsingPOST(actId)
  					.then(async (resp) => {
  						if (resp.data.status == 200) {
  							await this.getGridData();
  							this.$infoNotification.success({
  								content: '已完成刪除場次',
  								duration: 3,
  							});
  						} else {
  							const getError = resp.data;
  							this.$infoNotification.error({
  								content: '無法完成刪除項目，請再次嘗試。',
  								apiError: getError.apiError,
  							});
  						}
  					})
  					.catch((error) => {
  						this.$infoNotification.error({
  							content: '無法完成刪除項目，請再次嘗試。',
  						});
  					})
  					.finally(() => {
  						// this.setLoading(false);
  					});
  			},
  		});
  	} else {
  		// 一般刪除
  		InfoModal.alertError({
  			title: '確定刪除這個場次嗎？',
  			confirm: true,
  			content: '該場次即將執行刪除，您確定要刪除嗎？',
  			customContent: null,
  			onCallback: () => {
  				this.$PCRRpnRpnServiceFieldManagementApi.deletePhyConsultActRUsingPOST(actId)
  					.then(async (resp) => {
  						if (resp.data.status == 200) {
  							await this.getGridData();
  							this.$infoNotification.success({
  								content: '已完成刪除場次',
  								duration: 3,
  							});
  						} else {
  							const getError = resp.data;
  							this.$infoNotification.error({
  								content: '無法完成刪除項目，請再次嘗試。',
  								apiError: getError.apiError,
  							});
  						}
  					})
  					.catch((error) => {
  						console.log(error);
  						this.$infoNotification.error({
  							content: '無法完成刪除項目，請再次嘗試。',
  						});
  					})
  					.finally(() => {
  						// this.setLoading(false);
  					});
  			},
  		});
  	}
  }

  handleAdd() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'ServiceTimeMaintainAddAndEdit',
  		params: {
  			type: 'add',
  		},
  	});
  }

  // 開啟【列印資訊】/【發布多場次】彈窗
  handleShowModal(type) {
  	this.printOrReleaseType = type;
  	// TEST: 重置table
  	(this.$refs.printAndReleaseModal as any).resetDataGrid();
  	this.printAndReleaseModalVisible = true;
  }

  closeModal(type) {
  	if (type) {
  		this.getGridData();
  	}
  	this.printAndReleaseModalVisible = false;
  }

  // API: 刪除前下載報名同仁資料
  downloadExcel(actId, actLocation) {
  	this.setLoading(true);
  	const downloadName = `【${actLocation}】已報名人員名單.xlsx`;
  	this.$PCRRpnRpnServiceFieldManagementApi.getDownLoadListRUsingPOST({ actId: JSON.parse(actId), fileName: downloadName }, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			// console.log('export:', resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(resp.data as Blob, downloadName);
  				InfoModal.changeOkBtn(false);
  			} else {
  				this.$PCRRpnRpnServiceFieldManagementApi.getDownLoadListRUsingPOST({ actId: JSON.parse(actId), fileName: downloadName })
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
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Hook
   */
  created() {
  	this.getGridData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.icon-button:not(:first-of-type) {
  margin-left: 10px;
}

::v-deep {
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
}

.serviceTime__btnGroup {
  button:not(:first-of-type) {
    margin-left: 10px;
  }
}

</style>
