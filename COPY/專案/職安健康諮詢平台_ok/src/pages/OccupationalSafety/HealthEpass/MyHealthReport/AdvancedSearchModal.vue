<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="handleClose"
      :footer="null"
      :width="'90%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="advancedSearch__wrap">
        <div class="advancedSearch-header__wrap">
          <h1 class="header-title">
            {{ modalTitle }}
          </h1>
          <a-form-model
            class="formItem-row"
            :model="form"
          >
            <label
              for=""
              class="a-form-label"
            >
              <label>健康檢查日期區間</label>
            </label>
            <a-row
              type="flex"
              justify="start"
              :gutter="[16, 16]"
            >
              <!-- pc、平版 -->
              <a-col
                :sm="12"
                :xl="10"
                class="pc-datePicker__wrap"
              >
                <date-picker
                  v-model="checkDateRange"
                  style="width: 100%"
                  :allow-clear="true"
                  :range-separator="'~'"
                  :range="true"
                  :formatter="formatter"
                  placeholder="e.g. 2022/01/01～2022/02/01"
                />
              </a-col>
              <!-- 手機板 -->
              <a-col
                span="24"
                class="phone-datePicker__wrap"
              >
                <date-picker
                  v-model="checkDateRange[0]"
                  :allow-clear="true"
                  :formatter="formatter"
                  placeholder="e.g. 2022/01/01"
                />
                <p>~</p>
                <date-picker
                  v-model="checkDateRange[1]"
                  style="width: 100%"
                  :allow-clear="true"
                  :formatter="formatter"
                  placeholder="e.g. 2022/01/01"
                />
              </a-col>
              <a-col
                :xs="24"
                :sm="12"
                :xl="14"
                class="search-btn__wrap"
              >
                <button
                  class="btn__radius--primary--bg--small btn__confirm"
                  @click="getGridData"
                >
                  確定
                </button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="advancedSearch-result__wrap">
          <a-table
            :row-key="gridData.rowKey"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="gridData.columns"
            :data-source="gridData.data"
            :pagination="false"
            :scroll="{ x: true }"
          >
            <template
              slot="handleTemp"
              slot-scope="slotProps"
            >
              <button
                class="icon-button icon__download"
                @click="downloadPDF(slotProps)"
              >
                <a-icon type="download" />
              </button>
            </template>
          </a-table>
        </div>
        <div class="modal-btn__wrap text-center">
          <div>
            <button
              class="btn__radius--primary--outline--small btn__preview"
              :disabled="selectedRowKeys.length == 0"
              @click="showPreviewModal()"
            >
              預覽
            </button>
          </div>
          <div>
            <button
              class="btn__radius--primary--outline--small"
              @click="handleClose"
            >
              取消
            </button>
            <button
              class="btn__radius--primary--bg--small"
              :disabled="selectedRowKeys.length == 0"
              @click="downloadPDF()"
            >
              下載
            </button>
          </div>
        </div>
      </div>
    </a-modal>
    <PreviewModal
      :visible="previewModalVisible"
      :print-data="selectedDataList"
      :info-id="infoId"
      @closeModal="closePreviewModal"
      @goToPrevModal="goToPrevModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import PreviewModal from '@/pages/OccupationalSafety/HealthEpass/MyHealthReport/PreviewModal.vue';
import { HealthCheckPeriodRecordInDto, HealthCheckPeriodRecordOutDto, HealthCheckDownloadInDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

export interface searchModule {
  key: string | Array<string>; // 屬性名稱
  label: string; // 標籤
  colSpan?: string; // 佔多少網格
  type: string; // 類型 (輸入框 / 下拉選單 / 單選框 ... )
}
@Component({ components: { PreviewModal } })
export default class AdvancedSearchModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  userId: number

  @Prop()
  modalTitle: string

  @Prop()
  visible: boolean

  checkDateRange = [];

  formatter = this.$adDateFormatter;

  form: HealthCheckPeriodRecordInDto = {};

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			title: '健檢年度',
  			dataIndex: 'period',
  			key: 'period',
  			width: 120,
  		},
  		{
  			title: '檢查日期',
  			dataIndex: 'checkDate',
  			key: 'checkDate',
  			customRender: (data) => data && moment(data).format('YYYY/MM/DD'),
  		},
  		{
  			title: '',
  			width: 80,
  			scopedSlots: { customRender: 'handleTemp' },
  		},
  	],
  }

  infoId = [];

  modalVisible = false;

  previewModalVisible = false;

  selectedRowKeys= [];

  // table 勾選的資料
  selectedDataList = [];

  /**
   * Func
   */
  // API: 查詢健檢年度紀錄
  getGridData() {
  	this.setLoading(true);
  	this.$HEEmpMyHealthCheckApi.healthCheckPeriodRecordUsingPOST(this.form)
    	.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData: HealthCheckPeriodRecordOutDto[] = resp.data.data;
  				if (getData) {
  					// TEST:
  					// console.log(getData);
  					this.gridData.data = getData;
  					this.gridData.data.map((item, index) => { item.rowkey = index + 1; });
  				}
  			} else {
  				const getError = resp.data;
  				this.$infoNotification.error({
  					content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成查詢項目，請再次嘗試。',
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  			this.selectedRowKeys = [];
  		});
  }

  // API: 下載健檢資料
  downloadPDF(data?) {
  	const $payLoad: HealthCheckDownloadInDto = {
  		infoId: data ? [data.infoId] : this.infoId,
  	};
  	this.setLoading(true);
  	this.$HEEmpMyHealthCheckApi.healthCheckDownloadPdfUsingPOST($payLoad, { responseType: 'blob' })
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
  				this.$HEEmpMyHealthCheckApi.healthCheckDownloadPdfUsingPOST($payLoad)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).apiError;
  						this.$infoNotification.error({
  							content: apiErrorMsg ? this.$global.getApiErrorMsg(apiErrorMsg.apiError).join('') : '無法完成下載項目，請再次嘗試。',
  						});
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
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onSelectChange(selectedRowKeys) {
  	this.selectedRowKeys = selectedRowKeys;

  	const filterArr = [];
  	this.selectedRowKeys.forEach((rowkey) => {
  		filterArr.push([...this.gridData.data].filter((i) => i.rowkey == rowkey)[0].infoId);
  	});
  	this.infoId = filterArr;
  }

  // 重置table
  resetDataGrid() {
  	this.gridData.data = [];
  	this.selectedRowKeys = [];
  	this.checkDateRange = [];
  }

  /**
   * Event
   */
  // 開啟【預覽】彈窗
  showPreviewModal() {
  	this.previewModalVisible = true;
  	this.handleClose();
  }

  // 關閉【預覽】彈窗
  closePreviewModal() {
  	this.previewModalVisible = false;
  }

  // 回到【進階查詢】彈窗
  goToPrevModal() {
  	this.$emit('backToModal');
  	this.previewModalVisible = false;
  }

  // 關閉彈窗
  handleClose() {
  	this.$emit('closeModal');
  }

  /**
   * Hook
   */
  created() {
  	Object.assign(this.form, { userId: this.userId });
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Watch('checkDateRange')
  checkDateChanged(val) {
  	const [startDate, endDate] = val;
  	Object.assign(this.form, {
  		endDate: moment(endDate).endOf('day').format(),
  		startDate: moment(startDate).startOf('day').format(),
  	});
  }
}
</script>

<style lang="scss" scoped>

  .advancedSearch__wrap {
    .header-title {
      font-weight: 600;
      font-size: 30px;
      // letter-spacing: 2px;
    }
    .pc-datePicker__wrap {
      display: none;
      @include rwd-sm {
        display: block;
      }
    }
    .phone-datePicker__wrap {
      display: flex;
      align-items: center;
      p {
        margin: auto 5px;
        padding: 0;
      }
      .mx-datepicker {
        flex: 1
      }
      @include rwd-sm {
        display: none;
      }
    }
    .search-btn__wrap {
      text-align: center;
      @include rwd-sm {
        text-align: left;
      }
      .btn__confirm {
        height: 40px;
        width: 120px;
        margin-left: 15px;
      }
    }
    .advancedSearch-result__wrap {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px dashed $BORDER-COLOR-GRAY;
    }
  }
  .icon__download {
    margin-left: 5px;
    background: $BUTTON-BG-BLUE;
    color: $BUTTON-MAIN;
    &:focus, &:hover {
      background: $BUTTON-MAIN;
      color: $COLOR-WHITE;
    }
    svg {
      font-size: 23px;
    }
  }

  .modal-btn__wrap {
    margin-top: 10px;
    @include rwd-sm {
      margin-top: 20px;
    }
    div {
      & > button {
        font-weight: 400;
      }
      &:first-of-type {
        text-align: right !important;
        margin-bottom: 10px;
      }
      &:last-of-type {
        display: flex;
        justify-content: center;
        button {
          flex: 1;
          @include rwd-sm {
            max-width: 160px;
          }
          @include rwd-xl {
            max-width: 200px;
          }
        }
      }
    }
    .btn__preview {
      width: 100px;
      padding: 7px 0;
      @include rwd-sm {
        position: absolute;
        right: 0;
      }
    }
  }

  ::v-deep {
    .mx-input {
      height: 40px;
    }
    .ant-modal {
      max-width: 1088px;
    }
    .ant-form-item label, .ant-table-column-title {
      color: $COLOR-BLACK;
      font-weight: $TEXT-BOLD;
    }
    .ant-row-flex-start {
      margin-top: 5px;
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
</style>
