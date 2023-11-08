<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        活動與場次維護
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          @click="advancedSearchModalVisible=true"
        >
          進階查詢
        </button>
        <button
          class="btn__radius--primary--outline--small serviceTime__btnGroup"
          @click="goToAddRegister()"
        >
          新增報名
        </button>

        <button
          class="btn__radius--primary--outline--small serviceTime__btnGroup"
          @click="goAddAndEditEventPage('add')"
        >
          新增活動
        </button>
      </div>
    </div>
    <div>
      <a-table
        :row-key="outterGridData.rowKey"
        :columns="outterGridData.columns"
        :data-source="outterGridData.data"
        :pagination="outterGridData.pagination"
        @change="onMasterPageChange($event)"
      >
        <template
          slot="actName"
          slot-scope="slotProps"
        >
          <div>{{ slotProps.actName }}</div>
          <div>{{ slotProps.actStatus }}</div>
        </template>
        <template
          slot="actDate"
          slot-scope="slotProps"
        >
          <div>{{ $adDateFormatter.stringify(slotProps.actDate) }}</div>
          <div>{{ (slotProps.actStartTime || slotProps.actEndTime) ? `${slotProps.actStartTime}~${slotProps.actEndTime}` : '' }}</div>
        </template>
        <div
          slot="totalCount"
          slot-scope="slotProps"
          class="column__totalCount"
        >
          <div class="txt_totalCount">
            {{ slotProps.totalCount }}
          </div>
          <div class="icon__button__wrap">
            <button
              class="icon-button icon__barChart"
              @click="getReport(slotProps)"
            >
              <i class="os-icon__barChart" />
            </button>
            <button
              class="icon-button icon__downloadList"
              :class="{'icon__downloadList--disabled': slotProps.totalCount === 0}"
              :disabled="slotProps.totalCount === 0"
              @click="downloadExcel(slotProps)"
            />

            <a-divider
              type="vertical"
              class="divider__wrap"
            />
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': slotProps.actStatus == '進行中' || slotProps.actStatus == '已結束'}"
              :disabled="slotProps.actStatus == '進行中' || slotProps.actStatus == '已結束'"
              @click="goAddAndEditEventPage('edit', slotProps.actId)"
            >
              <a-icon type="edit" />
            </button>
            <button
              class="icon-button icon__delete"
              @click="handleDelete(slotProps)"
            >
              <a-icon type="delete" />
            </button>
            <a
              class="action__read"
              @click="goEventDetailsPage(slotProps)"
            >
              <a-icon type="right" />
            </a>
          </div>
        </div>
        <a-table
          slot="expandedRowRender"
          slot-scope="innerSlotProps"
          :row-key="innerGridData.rowKey"
          :columns="innerGridData.columns"
          :data-source="innerGridData.data[innerSlotProps.actId]"
          :pagination="false"
        >
          <template
            slot="sessionName"
            slot-scope="slotProps"
          >
            <div>{{ slotProps.sessionName }}</div>
            <div> {{ slotProps.sessionTypeDesc }}</div>
          </template>
          <template
            slot="building"
            slot-scope="slotProps"
          >
            <div>{{ slotProps.building }}</div>
            <div>{{ slotProps.location }}</div>
          </template>
          <template
            slot="maxCount"
            slot-scope="slotProps"
          >
            <div>{{ slotProps.maxCount }}</div>
            <div>{{ slotProps.count }}</div>
          </template>
          <div
            slot="action"
            slot-scope="slotProps"
            class="innerTable-btnWrap"
          >
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': !slotProps.qrCode}"
              :disabled="!slotProps.qrCode"
              @click="getQrcode(slotProps)"
            >
              <a-icon type="qrcode" />
            </button>
            <button
              class="icon-button icon__downloadList"
              :class="{'icon__downloadList--disabled': !slotProps.sessionName || slotProps.count === 0}"
              :disabled="!slotProps.sessionName || slotProps.count === 0"
              @click="downloadExcel(slotProps)"
            />
            <a
              class="action__read"
              @click="goDescripPage(slotProps)"
            >
              <a-icon type="right" />
            </a>
          </div>
        </a-table>
      </a-table>
    </div>

    <!-- 進階查詢 -->
    <AdvancedSearchModal
      :visible="advancedSearchModalVisible"
      @closeCateModal="closeAdvancedSearchModal"
    />

    <QrcodePreviewModal
      :visible="qrcodePreviewModalVisible"
      :modal-info="modalInfo"
      @closeModal="closeQrcodePreviewModal"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import AdvancedSearchModal from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/AdvancedSearchModal.vue';
import QrcodePreviewModal from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/QrcodePreviewModal.vue';
import { Modal } from 'ant-design-vue';
import InfoModal from '@/plugins/notification/infoModal';
import { Action } from 'vuex-class';
import { HealthActSingupDownLoadExcelDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component({
	components: { FblDataGrid, AdvancedSearchModal, QrcodePreviewModal },
})
export default class EventAndTimeMaintainIndex extends Vue {
	@Action('setLoading') setLoading;

	/**
	 * data
   */
	advancedSearchModalVisible = false;

	qrcodePreviewModalVisible = false;

	modalInfo = null

  // 父層 欄位資料
  outterGridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: Number(this.$global.getPageArray()[1]),
  		pageSizeOptions: this.$global.getPageArray(),
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			title: '活動名稱/狀態',
  			key: 'actName',
  			scopedSlots: { customRender: 'actName' },
  			width: 290,
  		},
  		{
  			title: '活動日期/時間',
  			key: 'actDate',
  			scopedSlots: { customRender: 'actDate' },
  			width: 130,
  		},
  		{
  			title: '建立日期',
  			dataIndex: 'createDate',
  			key: 'createDate',
  			width: 120,
  			customRender: (data: Date) => this.$adDateFormatter.stringify(data),
  		},
  		{
  			title: '報名總人數',
  			key: 'totalCount',
  			scopedSlots: { customRender: 'totalCount' },
  			width: 150,
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
  			title: '場次名稱/類型',
  			key: 'sessionName',
  			scopedSlots: { customRender: 'sessionName' },
  			width: 300,
  		},
  		{
  			title: '場次大樓/地點',
  			key: 'building',
  			scopedSlots: { customRender: 'building' },
  		},
  		{
  			title: '人數限制/已報名人數',
  			key: 'maxCount',
  			scopedSlots: { customRender: 'maxCount' },
  		},
  		{
  			title: '',
  			scopedSlots: { customRender: 'action' },
  			align: 'right',
  			width: 170,
  		},
  	],
  }

  /**
   * Func
   */
  getGridData() {
  	this.setLoading(true);
  	// const pageNo = this.outterGridData.pagination.current - 1;
  	// const pageSize = this.outterGridData.pagination.pageSize;
  	this.$PHPRpnEventSessionMaintainApi.getHealthActPageRUsingPOST({
  		pageNo: 0,
  		pageSize: 1000,
  	})
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				const { content } = getData;

  				// 外層Table
  				this.outterGridData.data = content;
  				this.outterGridData.data.map((item, index) => {
  					item.rowkey = index + 1;
  				});
  				// 內層Table(細項)
  				// console.log('content:', content);
  				content.map((dto) => {
  					const {
  						actId, healthActSessionPageDtoList, actName, actDate, actStartTime, actEndTime,
  					} = dto;
  					Object.assign(this.innerGridData.data, { [actId]: healthActSessionPageDtoList });
  					this.innerGridData.data[actId] = this.innerGridData.data[actId].map((item, index) => ({
  						rowkey: index + 1,
  						actId,
  						actName,
  						actDate,
  						actStartTime,
  						actEndTime,
  						...item,
  						}));
  				});
  				// console.log('this.innerGridData.data:', this.innerGridData.data);
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 刪除前下載已報名人員名單
  async downloadBeforeDelete(actId, actName) {
  	const downloadName = `${actName}_報名人員名單.xlsx`;
  	const $search: HealthActSingupDownLoadExcelDto = { actId, fileName: downloadName };
  	await this.fetchDownloadExcel($search, downloadName);
  	InfoModal.changeOkBtn(false);
  }

  // API: 刪除活動
  deleteHealthAct(actId) {
  	this.$PHPRpnEventSessionMaintainApi.deleteHealthActRUsingPOST(actId)
  		.then(async (resp) => {
  			if (resp.data.status == 200) {
  				await this.getGridData();
  				this.$infoNotification.success({
  					content: '已成功刪除活動與場次',
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
  		});
  }

  // API: 下載報名表
  async fetchDownloadExcel($search, downloadName) {
  	this.setLoading(true);
  	await this.$PHPRpnEventRegistrationListApi.healthActSingupDownloadExcelRUsingPOST($search, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(resp.data as Blob, `${downloadName}.xlsx`);
  			} else {
  				this.$PHPRpnEventRegistrationListApi.healthActSingupDownloadExcelRUsingPOST($search)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					})
  					.finally(() => {
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

  closeAdvancedSearchModal() {
  	this.advancedSearchModalVisible = false;
  }

  closeQrcodePreviewModal() {
  	this.qrcodePreviewModalVisible = false;
  }

  /**
   * Event
   */
  // qrCode 彈窗
  getQrcode(data) {
  	this.modalInfo = data;
  	this.qrcodePreviewModalVisible = true;
  }

  getReport(data) {
  	console.log('getReport');
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'ReportAnalyze',
  		query: { actId: data.actId },
  	});
  }

  downloadExcel(data) {
  	// TEST:
  	// console.log(data);
  	const {
  		actId, sessionId, actName, sessionName,
  	} = data;
  	const downloadName = sessionId ? `${actName}【${sessionName}】_報名人員名單.xlsx` : `${actName}_報名人員名單.xlsx`;
  	const $search: HealthActSingupDownLoadExcelDto = sessionId ? { actId, fileName: downloadName, sessionId } : { actId, fileName: downloadName };
  	this.fetchDownloadExcel($search, downloadName);
  }

  // 前往活動內容頁面
  goEventDetailsPage({ actId, actStatus }) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventInfo',
  		query: { actId, actStatus },
  	});
  }

  // 前往『場次內容』頁面
  goDescripPage(data) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainPersonnelDetails',
  		query: { actContent: data },
  	});
  }

  // 前往『新增報名』
  goToAddRegister() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainRegister',
  		params: {
  			type: 'add',
  		},
  	});
  }

  // 點擊按鈕，『新增/編輯活動』
  goAddAndEditEventPage(path, actId?) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep1',
  		params: {
  			type: path,
  		},
  		query: { actId },
  	});
  }

  handleDelete({
  	actId, actName, actStatus, totalCount,
  }) {
  	if (actStatus == '進行中' && totalCount > 0) {
  		InfoModal.alertError({
  			title: '確定刪除這個活動嗎？',
  			confirm: true,
  			content: '該活動狀態為「進行中」，且已有同仁報名該活動。如確定要執行刪除，請先下載報名人員名單(員編/身分證、姓名)，再進行刪除。',
  			disabled: true,
  			customContent: () => this.$createElement('div', {
  				attrs: {
  					class: 'btn__radius--primary--bg--small modal__btn--dowload',
  					style: 'font-weight: normal; margin-top: 20px; width: 100%;',
  				},
  				on: {
  					click: () => this.downloadBeforeDelete(actId, actName),
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
  			onCallback: () => this.deleteHealthAct(actId),
  		});
  	} else {
  		// 一般刪除
  		InfoModal.alertError({
  			title: '確定刪除這個活動嗎？',
  			confirm: true,
  			content: '該活動即將執行刪除，您確定要刪除嗎？',
  			onCallback: () => this.deleteHealthAct(actId),
  		});
  	}
  }

  // table 事件 (change page)
  onMasterPageChange(e) {
  	const $pagination = e;
  	const p = { ...this.outterGridData.pagination };
  	// 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
  	// 只保留 pageCurrent 或 pageSize 變更時 reload
  	if (p.current !== $pagination.current || p.pageSize !== $pagination.pageSize) {
  		p.current = $pagination.current;
  		// 切換顯示筆數時，跳回第一頁
  		if (p.pageSize !== $pagination.pageSize) {
  			p.current = 1;
  		}
  		p.pageSize = $pagination.pageSize;
  		this.outterGridData.pagination = p;
  		this.getGridData();
  	}
  }

  /**
   * Hook
   */
  created() {
  	sessionStorage.removeItem('form_step1');
  	sessionStorage.removeItem('form_step2');
  	this.getGridData();
  }
}
</script>
<style lang="scss" scoped>
	.serviceTime__btnGroup {
		margin-left: 10px;
	}
	.action__read{
		color:#000000A6;
		margin-left: 18px;
		::v-deep svg{
			font-size: 13px;
		}
	}
	.column__totalCount {
		display: flex;
		align-items: center;
		.txt_totalCount {
			margin-right: 40px;
			@include rwd-xl {
				margin-right: 0;
			}
		}
		.icon__button__wrap {
			display: flex;
			align-items: center;
			margin-left: auto;
		}
	}
	.innerTable-btnWrap {
		display: flex;
		align-items: center;
	}
	::v-deep {
		.ant-table-header-column {
			font-weight: 900;
		}
		tr.ant-table-expanded-row td > .ant-table-wrapper {
			margin: -12px -16px -13px;
		}
	}
	.divider__wrap {
		margin: 0px 16px;
	}
	.icon-button:not(:nth-of-type(2n+1)) {
		margin-left: 10px;
	}
</style>
