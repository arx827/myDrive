<template>
  <div>
    <!-- Modal -->
    <a-modal
      ref="sendModal"
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="handleClose"
      :footer="null"
      :width="'80%'"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="event__wrap">
        <div class="event__block">
          <div class="page__title mt-0">
            全區間發送通知
          </div>
          <div class="block__content" />
        </div>
        <div class="event__block">
          <label class="a-form-label">選擇活動日期區間</label>
          <div class="d-flex">
            <date-picker
              v-model="dateRange"
              placeholder="e.g. 2022/01/01～2022/02/01"
              type="date"
              :range="true"
              :format="'YYYY/MM/DD'"
            />
            <button
              class="btn__radius--primary ms-3 btn__search"
              @click="onSearch"
            >
              確定
            </button>
          </div>
        </div>
        <hr>
        <div
          v-if="isSearching"
          class="event__block table__wrap"
        >
          <a-checkbox-group
            v-model="checkedList"
            @change="onChangeChecked"
          >
            <fbl-data-grid
              class="query__table"
              :row-key="grid.rowKey"
              :columns="grid.columns"
              :data="grid.data"
              :pagination="false"
              :custom-row="grid.customRow"
              :scroll="{ y: '500px' }"
              @tableChange="onPageChange($event)"
            >
              <template #reserveTime="data">
                {{ data.data.sessionStartDate }}~{{ data.data.sessionEndDate }}
              </template>
            </fbl-data-grid>
          </a-checkbox-group>
        </div>
      </div>
      <div class="modal-btn__wrap text-center">
        <button
          class="btn__radius--primary--outline--small"
          @click="handleClose"
        >
          取消
        </button>
        <button
          class="btn__radius--primary ms-1"
          :disabled="checkedList.length===0"
          @click="onNext"
        >
          確定
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import notification from '@/plugins/notification/infoNotification';
import { Action } from 'vuex-class';
import {
	QueryPhyConsultSessionPeriodModel,
	SendRemindModel,
} from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class SendNoticeModifyReserveSend extends Vue {
  @Action('setLoading') setLoading;

	@Prop()
  visible: boolean

	modalVisible = false;

  // 輸入日期
  dateRange = '';

  // 正在查詢
  isSearching = true;

  // 已勾選的index(0為全選)
	checkedList = [];

	// 有勾選列的index(+1)
	plainOptions = [];

	// 勾選列的資料
	selectedRowAll = [];

  public grid = {
  	rowKey: 'id',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 0,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'checkbox',
  			title: this.$createElement('a-checkbox', {
  				attrs: {
  					value: 0,
  				},
  				on: {
  					click: this.onCheckAll,
  				},
  			}),
  			width: 30,
  			customRender: (value, row, index) => {
  				const obj = {
  					children: this.$createElement('a-checkbox', {
  						attrs: {
  							value: index + 1,
  						},
  					}),
  					attrs: {
  						rowSpan: (value.actDatecount > 0) ? value.actDatecount : 0,
  					},
  				};
  				return obj;
  			},
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'actDate',
  			title: '活動日期',
  			width: 100,
  			customRender: (value, row, index) => {
  				const obj = {
  					children: value.actDate,
  					attrs: {
  						rowSpan: (value.actDatecount > 0) ? value.actDatecount : 0,
  					},
  				};
  				return obj;
  			},
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserveLoction',
  			title: '活動地點',
  			width: 100,
  			customRender: (value, row, index) => {
  				const obj = {
  					children: value.reserveLoction,
  					attrs: {
  						rowSpan: (value.actDatecount > 0) ? value.actDatecount : 0,
  					},
  				};
  				return obj;
  			},
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'reserveTime',
  			title: '活動時段',
  			width: 100,
  			template: 'reserveTime',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reserveName',
  			title: '預約人姓名',
  			width: 250,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'srcFrom',
  			title: '資料來源',
  			width: 150,
  		},
  	],
  };

  // 計算相同日期數量
  listHandle(list) {
  	for (const key in list[0]) {
  		let k = 0;
  		while (k < list.length) {
  			list[k][`${key}count`] = 1;
  			list[k][`${key}show`] = true;
  			let i = k + 1;
  			for (i = k + 1; i <= list.length - 1; i++) {
  				if (list[k][key] == list[i][key] && list[k][key] != '') {
  					list[k][`${key}count`]++;
  					list[k][`${key}show`] = true;
  					list[i][`${key}count`] = 0;
  					list[i][`${key}show`] = false;
  				} else {
  					break;
  				}
  			}
  			k = i;
  		}
  	}
  	return list;
  }

	isCheckAll = false;

  indeterminate = false;

  // 全選
  onCheckAll() {
  	this.indeterminate = false;
  	this.changeIndeterminate();
  	this.isCheckAll = true;
  }

  // 勾選
  onChangeChecked(checkedValues) {
  	this.$emit('changeByChecked', checkedValues);

  	if (this.isCheckAll) {
  		if (this.checkedList.indexOf(0) !== -1) {
  			this.checkedList = [...new Set(this.checkedList.concat(this.plainOptions))];
  		} else if (this.isCheckAll) {
  			this.checkedList = [];
  		}
  		this.isCheckAll = false;
  	} else {
  		this.indeterminate = true;
  		this.changeIndeterminate();

  		if (this.checkedList.indexOf(0) === -1 && this.checkedList.length === this.plainOptions.length) {
  			this.checkedList.push(0);
  			this.indeterminate = false;
  			this.changeIndeterminate();
  		} else if (this.checkedList.indexOf(0) !== -1) {
  			this.checkedList.splice(this.checkedList.indexOf(0), 1);
  		}
  		if (this.checkedList.length === 0) {
  			this.indeterminate = false;
  			this.changeIndeterminate();
  		}
  	}

  	console.log(this.checkedList);
  }

  // 半勾選狀態
  changeIndeterminate() {
  	this.grid.columns[1].title = this.$createElement('a-checkbox', {
  		attrs: {
  			value: 0,
  			indeterminate: this.indeterminate,
  		},
  		on: {
  			click: this.onCheckAll,
  		},
  	});
  }

  // 確定
  onNext() {
  	this.selectedRowAll = [];
  	this.checkedList.sort();
  	this.checkedList.forEach((item) => {
  		if (item !== 0) {
  			for (let i = 0; i < this.grid.data[item - 1].actDatecount; i++) {
  				this.selectedRowAll.push(this.grid.data[item - 1 + i]);
  			}
  		}
  	});
  	console.log(this.selectedRowAll);
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

  // 查詢
  onSearch() {
  	console.log('查詢');
  	this.isSearching = true;

		 // 清空
  	this.grid.data = [];
  	this.checkedList = [];
  	this.plainOptions = [];

  	// // 假資料
  	// this.grid.data = this.fakeData;
  	// for (let i = 0; i < this.grid.data.length; i++) {
  	// 	this.grid.data[i].id = i.toString();
  	// }
  	// this.listHandle(this.grid.data);
  	// this.grid.data.forEach((item, index) => {
  	// 	if (item.actDatecount > 0) {
  	// 		this.plainOptions.push(index + 1);
  	// 	}
  	// });
  	// console.log(this.plainOptions);

  	const rangeQuery: QueryPhyConsultSessionPeriodModel = {
  		startDate: this.dateRange[0],
  		endDate: this.dateRange[1],
  		pageNo: 0,
  		pageSize: 100,
  	};
  	this.setLoading(true);
  	// 查詢醫師諮詢活動時段-只顯示有預約人的資料
  	this.$PCRRpnSendRemindAndModifyReservationApi.getPhyConsultSessionWithRegisteredUsingPOST(rangeQuery)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.grid.data = resp.data.data.content;
  				for (let i = 0; i < this.grid.data.length; i++) {
  					this.grid.data[i].id = i.toString();
  				}
  				this.listHandle(this.grid.data);
  				this.grid.data.forEach((item, index) => {
  					if (item.actDatecount > 0) {
  						this.plainOptions.push(index + 1);
  					}
  				});
  				console.log(this.plainOptions);
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

  handleClose() {
  	this.$emit('closeModal');
  }

	 updated() {
  	window.parseWord();
  }

	@Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }
}
</script>

<style lang="scss" scoped>
  #sendModal {
    padding: 20px;
    margin-top: 30px;
  }
  .a-form-label, .card__val {
    color: #000;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include rwd-sm {
      padding: 20px 70px;
    }
  }
	.table__wrap {
		overflow: scroll;
	}
  .btn__wrap {
    margin-bottom: 50px;
    button {
      max-width: 100%;
      width: 100px;
      @include rwd-lg {
        width: 200px;
      }
    }
  }

  // 虛線
  hr {
    border: 1px dashed #CECECE;
    margin: 20px 0;
  }

  .btn__search {
    height: 40px;
    width: 120px;
    padding-top: 5px;
  }

  ::v-deep {
    .mx-input {
      height: 40px;
      margin: 0;
      font-size: 16px;
    }
		.mx-input-wrapper {
			width: 100%;
		}
    td {
      vertical-align: top;
    }
  }
</style>
