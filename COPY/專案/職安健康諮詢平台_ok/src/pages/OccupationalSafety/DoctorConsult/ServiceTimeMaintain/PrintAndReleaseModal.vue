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
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="printAndReleaseModal__wrap">
        <div class="printAndReleaseModal-header__wrap">
          <h1 class="header-title">
            {{ modalTitle }}
          </h1>
          <a-form-model-item
            class="formItem-row"
            prop=""
          >
            <label
              for=""
              class="a-form-label"
            >
              <label>選擇{{ searchLabel }}</label>
            </label>
            <a-row
              type="flex"
              justify="start"
              :gutter="[16, 16]"
            >
              <a-col span="10">
                <date-picker
                  v-model="actDate"
                  style="width: 100%"
                  :allow-clear="true"
                  :range-separator="'~'"
                  :range="true"
                  :formatter="formatter"
                  placeholder="e.g. 2022/01/01～2022/02/01"
                />
              </a-col>
              <a-col>
                <button
                  class="btn__radius--primary--bg--small btn__confirm"
                  @click="getGridData"
                >
                  確定
                </button>
              </a-col>
            </a-row>
          </a-form-model-item>
        </div>
        <div class="printAndReleaseModal-result__wrap">
          <a-table
            :row-key="gridData.rowKey"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="gridData.columns"
            :data-source="gridData.data"
            :pagination="false"
          />
        </div>
        <div class="modal-btn__wrap text-center">
          <button
            class="btn__radius--primary--outline--small"
            @click="handleClose"
          >
            取消
          </button>
          <button
            v-if="type=='release'"
            :disabled="selectedRowKeys.length == 0"
            class="btn__radius--primary--bg--small"
            @click="handleRelease()"
          >
            確定發布
          </button>
          <button
            :disabled="selectedRowKeys.length == 0"
            :class="[ type =='print' ? 'btn__radius--primary--bg--small' : 'btn__radius--primary--outline--small btn__print']"
            @click="handleShowModal()"
          >
            預覽列印
          </button>
        </div>
      </div>
    </a-modal>
    <PrintModal
      :visible="printModalVisible"
      :print-data="selectedDataList"
      @closeModal="closeModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import PrintModal from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/PrintModal.vue';
import { Action } from 'vuex-class';
import { PrintQueryDto } from '@fubonlife/oss-api-axios-sdk';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import { filter } from 'vue/types/umd';

require('bootstrap/js/dist/modal');

@Component({ components: { PrintModal } })
export default class PrintAndReleaseModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  type: string

  actDate = null;

  formatter = this.$adDateFormatter;

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
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
  	],
  }

  modalVisible = false;

  modalTitle = null;

  printModalVisible = false;

  searchLabel = null;

  selectedRowKeys= [];

  // table 勾選的資料
  selectedDataList = [];

  /**
   * Func
   */
  getGridData() {
  	this.setLoading(true);
  	const NewRangeDate = this.actDate ? DateTimeFormmat.filterRangeDate(this.actDate) : null;
  	const $form = {
  		actStatus: (this.type == 'release') ? 1 : null,
  		startDate: NewRangeDate && NewRangeDate[0],
  		endDate: NewRangeDate && NewRangeDate[1],
  	};
  	this.$PCRRpnRpnServiceFieldManagementApi.getPrintActDataRUsingPOST($form)
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				// TEST:
  				// console.log(resp.data);
  				const getData = resp.data.data;
  				this.gridData.data = getData;
  				this.gridData.data.map((item, index) => {
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

  onSelectChange(selectedRowKeys) {
  	this.selectedRowKeys = selectedRowKeys;
  }

  // 過濾出Table勾選的資料
  filterSelectedData() {
  	const filterArr = [];
  	this.selectedRowKeys.map((rowkey) => {
  		filterArr.push(JSON.parse(JSON.stringify(this.gridData.data)).filter((i) => i.rowkey == rowkey)[0]);
  	});
  	return filterArr;
  }

  // 重置table
  resetDataGrid() {
  	this.gridData.data = [];
  	this.selectedRowKeys = [];
  }

  // 關閉【預覽列印】彈窗
  closeModal() {
  	this.printModalVisible = false;
  }

  /**
   * Event
   */
  // 開啟【預覽列印】彈窗
  handleShowModal() {
  	this.selectedDataList = this.filterSelectedData();
  	this.printModalVisible = true;
  	this.handleClose();
  }

  // 確定發布
  handleRelease() {
  	const actIdArr = [];
  	this.filterSelectedData().map((i) => {
  		actIdArr.push(i.actId);
  	});
  	this.setLoading(true);
  	this.$PCRRpnRpnServiceFieldManagementApi.publishPhyConsultActUsingPOST(actIdArr)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				this.handleClose('release');
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'ServiceTimeMaintainResult',
  					params: {
  						type: 'release',
  					},
  					query: {
  						result: 'success',
  					},
  				});
  			} else {
  				const getError = resp.data;
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'ServiceTimeMaintainResult',
  					params: {
  						type: 'release',
  					},
  					query: {
  						result: 'fail',
  						msg: getError && this.$global.getApiErrorMsg(getError).join(''),
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 關閉彈窗
  handleClose(type? : string) {
  	this.$emit('closeModal', type);
  }

  /**
   * Hook
   */
  @Watch('type')
  onTypeChange(val) {
  	this.modalTitle = (val === 'release') ? '發布多場次' : '列印資訊';
  	this.searchLabel = (val === 'release') ? '場次日期區間' : '列印日期區間';
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	this.actDate = null;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .printAndReleaseModal-header__wrap {
    border-bottom: 1px dashed $BORDER-COLOR-GRAY;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .header-title {
      font-weight: 600;
      font-size: 30px;
    }
  }
  .printAndReleaseModal-result__wrap {
    margin-top: 20px;
  }
  .modal-btn__wrap {
    & > button {
      font-weight: 400;
    }
    .btn__print {
      position: absolute;
      right: 0;
      width: 100px;
      padding: 7px 0;
    }
  }

  .btn__confirm {
    height: 40px;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep {
    .mx-input {
      height: 40px;
    }
    .ant-modal {
      max-width: 1088px;
    }
  }
</style>
