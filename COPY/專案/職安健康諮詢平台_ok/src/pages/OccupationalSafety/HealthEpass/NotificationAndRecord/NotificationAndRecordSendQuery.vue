<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          查詢發送紀錄
        </div>
      </div>
      <div class="send__wrap">
        <a-form-model
          :layout="'vertical'"
          :model="form"
        >
          <div class="row">
            <div class="col">
              <a-form-model-item label="發送日期區間">
                <date-picker
                  v-model="form.date"
                  type="date"
                  :range="true"
                  placeholder="e.g. 2022/01/01～2022/02/01"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </div>
            <div class="col">
              <a-form-model-item label="類別">
                <a-radio-group v-model="form.type">
                  <a-radio value="1">
                    衛教通知
                  </a-radio>
                  <a-radio value="2">
                    醫師諮詢
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <a-form-model-item>
                <label
                  class="fw-bold"
                  for=""
                >衛教類別</label>
                <button
                  class="btn__healthCate mx-2 mb-1"
                  @click="getHealthItem"
                >
                  選擇
                </button>
                <div
                  class="health__category"
                >
                  <div
                    v-for="(item, index) in showCateOpts"
                    :key="index"
                    class="health__category__item"
                    :data-id="item.id"
                  >
                    {{ item.name }}
                    <a-icon
                      class="btn__close"
                      type="close"
                      @click.stop="removeHealthItem(item.id)"
                    />
                  </div>
                </div>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
        <div class="btn__wrap text-center mt-0 mb-4">
          <router-link :to="'/occupationSafety/HealthCheck/notificationAndRecord/query'">
            <button
              class="btn__radius--primary--outline mx-2"
            >
              返回
            </button>
          </router-link>
          <button
            class="btn__radius--primary mx-2"
            @click="searchRecord"
          >
            確定
          </button>
        </div>
      </div>
      <div
        v-if="gridData.data"
        class="send__result__wrap"
      >
        <div class="result__table__head d-flex justify-content-between">
          <div>總發送則數：{{ totalCount }}</div>
          <div>統計區間：{{ startDate }} ~ {{ endDate }}</div>
        </div>
        <a-table
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data-source="gridData.data"
          :scroll="{ x: true }"
          :pagination="gridData.pagination"
          @change="onPageChange($event)"
        >
          <a-table
            slot="expandedRowRender"
            slot-scope="slotProps"
            :row-key="slotProps.phyNameTimesListDto ? slotProps.phyNameTimesListDto.readDate:slotProps.heNameTimesListDto.readDate"
            :columns="innerGridData.columns"
            :data-source="slotProps.heNameTimesListDto ? slotProps.heNameTimesListDto:slotProps.phyNameTimesListDto"
            :pagination="false"
          />
          <!-- <p
            v-else
            slot="expandedRowRender"
            class="m-0"
          >
            暫無資料 {{ slotProps.heNameTimesListDto }}
          </p> -->
        </a-table>
        <div class="btn__wrap text-center mt-0 mb-5">
          <router-link :to="'/occupationSafety/HealthCheck/notificationAndRecord/query'">
            <button
              class="btn__radius--primary"
            >
              返回查詢
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <HealthCategoryModal
      :visible="modalVisible"
      :selected-cate="cateSelected"
      :modal-title="'衛教類別'"
      @closeCateModal="closeCateModal"
      @changeSelected="changeCateSelected"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import HealthCategoryModal from '@/components/modal/HealthCategoryModal.vue';
import { NoticeQuerySendingRecordsDto } from '@fubonlife/oss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import infoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { HealthCategoryModal } })
export default class NotificationAndRecordSendQuery extends Vue {
@Action('setLoading') setLoading;

  type: string = '';

  modalVisible = false;

  cateSelected: [{name: string; id: string; isChecked: boolean}] = null;

  // 父層 欄位資料
  gridData = {
  	rowKey: 'rowKey',
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	data: null,
  	columns: [
  		{
  			title: '衛教類別',
  			dataIndex: 'itemDesc',
  			key: 'itemDesc',
  		},
  		{
  			title: '則數',
  			dataIndex: 'count',
  			key: 'count',
  		},
  		{
  			title: '發送人員',
  			dataIndex: 'sendName',
  			key: 'sendName',
  		},
  		{
  			title: '發送時間',
  			dataIndex: 'snedDate',
  			key: 'snedDate',
  			customRender: (data) => (data ? moment(data).format('YYYY/MM/DD HH:mm:ss') : '-'),
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'readDate',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			title: '員工姓名',
  			dataIndex: 'receiveName',
  			key: 'receiveName',
  		},
  		{
  			title: '讀取時間',
  			dataIndex: 'readDate',
  			key: 'readDate',
  			customRender: (data) => (data ? moment(data).format('YYYY/MM/DD HH:mm:ss') : '-'),
  		},
  	],
  }

  get showCateOpts() {
  	if (!this.cateSelected) return;
  	const allOpts = this.cateSelected;
  	const arr = allOpts.filter((e: any) => e.isChecked);
  	return arr;
  }

  form = {
  	date: null,
  	type: null,
  }

  totalCount = null;

  startDate = null;

  endDate = null;

  /**
   * Func
   */

  openModal() {
  	this.modalVisible = true;
  }

  // 查詢健檢項目
  getHealthItem() {
  	if (!this.cateSelected) {
  	// 首次點擊需讀取API項目
  		this.setLoading(true);
  		this.$HeRpnHeRpnNoticeSentControllerApi.getHealthEducationCategoryUsingPOST()
  			.then((resp: any) => {
  				if (resp.data.status === 200) {
  					this.cateSelected = resp.data.data.map((e) => ({
  						name: e.itemDesc, id: e.itemId, isChecked: false,
  					}));
  					this.openModal();
  				} else {
  					notification.error({
  						content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					});
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else {
  		this.openModal();
  	}
  }

  // 移除健檢項目
  removeHealthItem(removeID) {
  	this.cateSelected.forEach((element) => {
  		if (element.id === removeID) {
  			element.isChecked = false;
  		}
  	});
  }

  closeCateModal() {
  	this.modalVisible = false;
  }

  changeCateSelected(data) {
  	this.cateSelected = data;
  	console.log(data);
  }

  // 1.2.18	查詢發送紀錄API
  searchRecord() {
  	const date: any = this.form.date;
  	const NewRangeDate = date ? DateTimeFormmat.filterRangeDate(date) : null;
  	const data: NoticeQuerySendingRecordsDto = {
  		startDate: NewRangeDate ? NewRangeDate[0] : null,
  		endDate: NewRangeDate ? NewRangeDate[1] : null,
  		itemId: this.showCateOpts ? this.showCateOpts.map((e) => e.id) : [],
  		type: this.form.type,
  	};

  	// const data: NoticeQuerySendingRecordsDto = {
  	// 	endDate: '2022-05-30T05:10:37.423Z',
  	// 	itemId: [
  	// 		'H0001',
  	// 	],
  	// 	startDate: '2021-01-30T05:10:37.423Z',
  	// 	type: 2,
  	// };
  	this.setLoading(true);
  	this.$HeRpnHeRpnNoticeSentControllerApi.getSendingRecordsUsingPOST(data, this.gridData.pagination.current - 1, this.gridData.pagination.pageSize)
  		.then((resp: any) => {
  			if (resp.data.status === 200) {
  				if (!resp.data.data) {
  					notification.error({ content: '查無資料' });
  					return;
  				}
  				console.log(resp.data.data);
  				let index = 0;
  				this.startDate = moment(data.startDate).format('YYYY/MM/DD');
  				this.endDate = moment(data.endDate).format('YYYY/MM/DD');
  				this.totalCount = resp.data.data.content[0].totalCount;
  				this.gridData.pagination.total = parseInt(resp.data.data.totalElements);
  				this.gridData.data = resp.data.data.content.map(({ ...rest }) => ({
  					rowKey: index++,
  					...rest,
  				}));
  				console.log(this.gridData.data);
  			} else {
  				this.gridData.data = null;
  				notification.error({
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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

  onPageChange(e) {
  	this.gridData.pagination = e;
  	this.searchRecord();
  }

  /**
   * Hook
   */
  created() {
  	// this.getGridData();
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

.send__result__wrap {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px dashed #CECECE;
  .result__table__head {
    color: #fff;
    background-color: #7DC9CF;
    padding: 9px 40px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 20px;
  }
}

::v-deep {
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
	.ant-table-body {
		overflow-x: auto;
	}
}

.serviceTime__btnGroup {
  button:not(:first-of-type) {
    margin-left: 10px;
  }
}

.btn__wrap button {
  max-width: 45%;
}

</style>
