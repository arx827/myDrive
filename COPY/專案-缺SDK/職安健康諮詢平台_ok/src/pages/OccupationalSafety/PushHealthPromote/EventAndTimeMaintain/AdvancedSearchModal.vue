<template>
  <div class="container">
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      :footer="false"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="searchModal__wrap">
        <div class="searchModal-header__wrap">
          <div class="header-title">
            進階查詢 (可擇一查詢)
          </div>
          <a-form-model
            class="form__wrap"
            :model="form"
            :layout="'vertical'"
            :colon="false"
          >
            <a-row
              type="flex"
              justify="center"
              :gutter="[15, 0]"
            >
              <a-col span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop=""
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    活動建立日期區間
                  </span>
                  <date-picker
                    v-model="crtDateArr"
                    style="width: 100%"
                    :allow-clear="true"
                    type="date"
                    :range-separator="'~'"
                    :range="true"
                    :formatter="formatter"
                    placeholder="e.g. 2022/01/01～2022/02/01"
                  />
                </a-form-model-item>
              </a-col>
              <a-col span="12">
                <a-form-model-item
                  class="formItem-row"
                  prop=""
                >
                  <span
                    slot="label"
                    class="a-form-label"
                  >
                    活動狀態
                  </span>
                  <a-select
                    v-model="form.actStatus"
                    :show-arrow="true"
                    :options="actStatusOpts"
                    class="memberCard-auth"
                    placeholder="請選擇"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>

        <div class="modal-btn__wrap text-center">
          <button
            class="btn__radius--primary--outline--small"
            @click="onClose"
          >
            取消
          </button>
          <button
            class="btn__radius--primary--bg--small"
            @click="getGridData"
          >
            查詢
          </button>
        </div>

        <!-- 查詢結果 -->
        <div v-if="isShowResult">
          <a-divider dashed />
          <fbl-data-grid
            class="query__table"
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :data="grid.data"
            :pagination="false"
            :custom-row="grid.customRow"
            :scroll="{ x: true }"
          >
            <template #action="slotProps">
              <div>
                <button
                  data-bs-dismiss="modal"
                  class="icon-button icon__edit"
                  :class="{'icon__edit--disabled': slotProps.data.actStatus == '進行中' || slotProps.data.actStatus == '已結束'}"
                  :disabled="slotProps.data.actStatus == '進行中' || slotProps.data.actStatus == '已結束'"
                  @click="handleEdit(slotProps.data)"
                >
                  <a-icon type="edit" />
                </button>
                <button
                  class="icon-button icon__delete"
                  @click="handleDelete(slotProps.data)"
                >
                  <a-icon type="delete" />
                </button>
                <a
                  class="action__read"
                  data-bs-dismiss="modal"
                  @click="goEventDetailsPage(slotProps.data)"
                >
                  <a-icon type="right" />
                </a>
              </div>
            </template>
          </fbl-data-grid>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import { HealthActPageModel } from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: { FblDataGrid },
})
export default class AdvancedSearchModal extends Vue {
  @Prop()
  visible: boolean

  modalVisible = false;

  @Action('setLoading') setLoading;

  h = this.$createElement;

  /**
   * data
   */
  actStatusOpts = this.$enum.actStatusEnum.map((i) => ({ value: i.key, label: i.val }));

  crtDateArr: Array<Date> = null;

  form: HealthActPageModel = {};

  formatter = this.$adDateFormatter;

  grid = {
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
  			property: 'actName',
  			title: '活動名稱',
  			width: 200,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'actDate',
  			title: '活動日期',
  			customRender: (data) => this.$adDateFormatter.stringify(data.actDate),
  			width: 120,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'time',
  			title: '活動時間',
  			customRender: (data) => ((data.actStartTime || data.actEndTime) ? `${data.actStartTime}~${data.actEndTime}` : ''),
  			width: 120,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'actStatus',
  			title: '狀態',
  			width: 80,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createDate',
  			title: '建立日期',
  			customRender: (data) => this.$adDateFormatter.stringify(data.createDate),
  			width: 120,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'totalCount',
  			title: '報名總人數',
  			width: 110,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			template: 'action',
  			title: '',
  			width: 180,
  		},
  	],
  };

  isShowResult = false;

  /**
   * func
   */
  // 選擇日期 disabled
  disabledDate(current) {
  	// disabled 過去時間 以及 六、日
  	return current && (current <= moment().subtract(1, 'day') || moment(current).weekday() >= 5);
  }

  // API: 刪除前下載已報名人員名單
  downloadBeforeDelete(actId) {
  	const current = moment(new Date()).format('YYYY/MM/DD').split('/');
  	const twYear = `${parseInt(current[0]) - 1911}`;
  	const downloadName = `報名人員名單_${twYear}${current[1]}${current[2]}.xlsx`;
  	this.$PCRRpnRpnServiceFieldManagementApi.getDownLoadListRUsingPOST({ actId: JSON.parse(actId), fileName: downloadName }, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			console.log('export:', resp);
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(resp.data as Blob, `${downloadName}.xlsx`);
  				this.setLoading(false);
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
  			// this.setLoading(false);
  		});
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

  getGridData() {
  	this.setLoading(true);
  	let $search = {};
  	if (this.form.startDate && this.form.endDate) {
  		const { startDate, endDate, ...other } = this.form;
  		$search = {
  			pageNo: 0,
  		  pageSize: 100,
  			startDate: moment(startDate).startOf('day').format(),
  			endDate: moment(endDate).endOf('day').format(),
  			...other,
  		};
  	} else {
  		$search = {
  			pageNo: 0,
  		  pageSize: 100,
  			...this.form,
  		};
  	}
  	this.$PHPRpnEventSessionMaintainApi.getHealthActPageRUsingPOST($search)
  		.then((resp) => {
  			// TEST:
  			console.log(resp);
  			if (resp.data.status == 200) {
  				this.isShowResult = true;
  				const getData = resp.data.data;
  				this.grid.data = getData.content;
  				this.grid.data.map((item, index) => {
  					item.rowkey = index + 1;
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

  onClose() {
  	this.$emit('closeCateModal');
  }

  /**
   * Event
   */
  // 前往活動內容頁面
  goEventDetailsPage({ actId }) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventInfo',
  		query: { actId },
  	});
  }

  // 編輯
  handleEdit({ actId }) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep1',
  		params: {
  			type: 'edit',
  		},
  		query: { actId },
  	});
  }

  // 刪除
  handleDelete({ actId, actStatus }) {
  	if (actStatus == '進行中') {
  		InfoModal.alertError({
  			title: '確定刪除這個活動嗎？',
  			confirm: true,
  			content: '該活動狀態為「進行中」，且已有同仁報名該活動。如確定要執行刪除，請先下載報名人員名單(員編/身分證、姓名)，再進行刪除。',
  			customContent: () => this.$createElement('div', {
  				attrs: {
  					class: 'btn__radius--primary--bg--small modal__btn--dowload',
  					style: 'font-weight: normal; margin-top: 20px; width: 100%;',
  				},
  			}, [
  				this.$createElement('a-icon', {
  					attrs: {
  						name: '',
  						type: 'download',
  					},
  				}),
  				this.$createElement('div', {
  					on: {
  						click: () => this.downloadBeforeDelete(actId),
  					},
  				}, '下載已報名人員名單'),
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

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('crtDateArr')
  crtDateArrChanged(val) {
  	const [startDate, endDate] = val;
  	Object.assign(this.form, {
  		endDate,
  		startDate,
  	});
  }
}
</script>
<style lang="scss" scoped>
.searchModal__wrap {
  padding: 20px 0;
  .header-title {
    font-weight: 600;
    font-size: 30px;
    color: #000000;
    margin-bottom: 20px;
  }
  .searchModal-tableList__wrap {
    margin-top: 20px;
  }
  .btn__print {
    position: absolute;
    right: 0;
    width: 100px;
    padding: 0;
  }
}
.form__wrap {
  margin: 0 auto;
}
.a-form-label {
  font-size: 16px;
  line-height: 1;
  display: block;
}
.query__table {
  .ant-table-thead > tr:first-child > th:first-child,.ant-table-tbody > tr > td:first-child{
    padding-left: 8%;
  }
}
.action__read{
	color:#000000A6;
	margin-left: 18px;
	::v-deep svg{
		font-size: 13px;
	}
}
.icon-button:not(:first-of-type) {
  margin-left: 10px;
}

::v-deep {
  .mx-input, .ant-select-selection {
    height: 40px
  }
  .ant-select-selection__rendered {
    line-height: 40px;
  }
  .modal-btn__wrap {
    margin-top: 20px;
  }
}

</style>
