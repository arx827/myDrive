<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title">
        待辦案件查詢
        <a-radio-group
          v-model="tabValue"
          class="query__tab text-center"
          button-style="solid"
        >
          <a-radio-button
            value="all"
          >
            待辦-全部
          </a-radio-button>
          <a-radio-button
            value="processed"
          >
            待辦-已處理
          </a-radio-button>
          <a-radio-button
            value="untreated"
          >
            待辦-未處理
          </a-radio-button>
          <a-radio-button
            value="notices"
          >
            通知單-全部
          </a-radio-button>
        </a-radio-group>
        <span class="float-end query__total">共 {{ grid.pagination.total }} 筆</span>
      </div>
      <div :class="tabValue==='notices'?'close-sort':null">
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="tabValue === 'notices' ? grid.columns__notice: grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
          @tableChange="clickDeadlineTitle"
        >
          <!-- 處理期限 -->
          <template
            v-if="tabValue!='notices'"
            slot="deadline"
            slot-scope="data"
          >
            <div class="fw-bold">
              <p
                v-if="data.data.deadline"
                class="mb-0"
              >
                {{ data.data.deadline | timeString }}
              </p>
              <p
                v-if="!data.data.deadline"
                class="mb-0"
              >
                - -
              </p>
            </div>
          </template>
          <!-- 處理狀態切換 -->
          <template
            v-if="tabValue!='notices'"
            slot="statusBtn"
            slot-scope="data"
          >
            <div>
              <a-switch
                v-model="data.data.process"
                @change="changeStatus(data.data)"
              >
                <a-icon
                  slot="checkedChildren"
                  type="check"
                />
                <a-icon
                  slot="unCheckedChildren"
                  type="close"
                />
              </a-switch>
            </div>
            <!-- <div
              class="switch"
            >
              <input
                :id="data.data.filePath"
                v-model="data.data.process"
                class="switch-checkbox"
                type="checkbox"
                :checked="data.data.process"
                @change="changeStatus(data.data)"
              >
              <label
                class="switch-label"
                :for="data.data.filePath"
              >
                <span
                  class="switch-txt"
                  turnOn="✓"
                  turnOff="✕"
                />
                <span class="switch-Round-btn" />
              </label>
            </div> -->
          </template>
          <!-- 下載按鈕 -->
          <template
            slot="downloadFile"
            slot-scope="data"
          >
            <a
              class="icon__btn"
              href="#"
              @click.prevent="downloadFile(data.data)"
            >
              <img
                src="@/assets/button_download.svg"
                alt=""
              >
            </a>
          </template>
        </fbl-data-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	ToDoListInput, PageOfToDoListInfoDto, ToDoListInfoDto, PolicyModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, Page } from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

// 日期轉換(民國年)
Vue.filter('timeString', (value) => DateTimeFormmat.transformRocDate(value));

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class TodoAllTable extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  todoListRequest: ToDoListInput;

  policyModel: PolicyModel;

  todoListInfo: ToDoListInfoDto

  oriData: ToDoListInfoDto[];

  tabValue = 'all';

  sortByDesc = false;

  @Watch('tabValue')
  setTable() {
  	// 切換tab回到第一頁
  	this.grid.pagination.current = 1;
  	this.onSearch();
  }

  public grid = {
  	rowKey: 'index',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'category',
  			title: '類別',
  			width: 90,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'reportName',
  			title: '項目',
  			width: 206,
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, `${data.reportName}`),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'genDate',
  			title: '發布日期',
  			width: 80,
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.genDate),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'deadline',
  			title: '處理期限',
  			width: 95,
  			template: 'deadline',
  			sorter: true,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'noticeObject',
  			title: '通知/照會對象',
  			width: 110,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'noticeNo',
  			title: '通知/照會單號',
  			width: 100,
  			formatter: (data) => (data.source === 'RCBILL' && ((data.fileTypeNo === '716') || (data.fileTypeNo === '717')) ? '' : data.noticeNo),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'statusBtn',
  			title: '處理狀態',
  			width: 80,
  			template: 'statusBtn',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'filePath',
  			title: '',
  			width: 30,
  			template: 'downloadFile',
  		},
  	],
  	columns__notice: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'category',
  			title: '類別',
  			width: 90,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'item',
  			title: '項目',
  			width: 206,
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, `${data.item}`),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'releaseDate',
  			title: '發布日期',
  			width: 80,
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.releaseDate),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'deadline',
  			title: '處理期限',
  			width: 95,
  			template: 'deadline',
  			sorter: true,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'noticeObject',
  			title: '通知/照會對象',
  			width: 110,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'noticeNumber',
  			title: '通知/照會單號',
  			width: 100,
  			formatter: (data) => (data.noticeNumber ? data.noticeNumber : '- -'),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'statusBtn',
  			title: '處理狀態',
  			width: 80,
  			template: 'statusBtn',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'filePath',
  			title: '',
  			width: 30,
  			template: 'downloadFile',
  		},
  	],
  };

  created() {
  	this.onSearch();
  }

  onSearch() {
  	// setReauest
  	const pageNo = this.grid.pagination.current - 1;
  	const pageSize = this.grid.pagination.pageSize;
  	this.policyModel = this.$userInfo.getPolicyModel();
  	if (this.tabValue !== 'notices') {
  		this.todoListRequest = {
  		policyModel: this.policyModel,
  		sortOrder: this.sortByDesc ? 'DESC' : 'ASC',
  	};
  	}

  	this.setLoading(true);
  	this.grid.data = [];
  	// 不同Tab不同API
  	switch (this.tabValue) {
  	case 'all': // 全部待辦事項
  	  this.$toDoListAndNoticeApi
  			.listAllToDoUsingPOST(pageNo, pageSize, this.todoListRequest)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					resp.data.data.content.forEach((item, index) => {
  						if (item.status === 'Y') {
  							this.grid.data.push({
  								...item,
  								process: true,
  								index,
  							});
  						} else {
  							this.grid.data.push({
  								...item,
  								process: false,
  								index,
  							});
  						}
  						this.oriData = resp.data.data.content;
  					});
  					this.grid.pagination.total = Number(resp.data.data.totalElements);
  				} else {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  		break;
  	case 'processed': // 已處理待辦事項
  		this.$toDoListAndNoticeApi
  			.listProcessedUsingPOST(pageNo, pageSize, this.todoListRequest)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					resp.data.data.content.forEach((item, index) => {
  						if (item.status === 'Y') {
  							this.grid.data.push({
  								...item,
  								process: true,
  								index,
  							});
  						} else {
  							this.grid.data.push({
  								...item,
  								process: false,
  								index,
  							});
  						}
  						this.oriData = resp.data.data.content;
  					});
  					this.grid.pagination.total = Number(resp.data.data.totalElements);
  				} else {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  		break;
  	case 'untreated': // 未處理待辦事項
  		this.$toDoListAndNoticeApi
  			.listUntreatedUsingPOST(pageNo, pageSize, this.todoListRequest)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					resp.data.data.content.forEach((item, index) => {
  						if (item.status === 'Y') {
  							this.grid.data.push({
  								...item,
  								process: true,
  								index,
  							});
  						} else {
  							this.grid.data.push({
  								...item,
  								process: false,
  								index,
  							});
  						}
  						this.oriData = resp.data.data.content;
  					});
  					this.grid.pagination.total = Number(resp.data.data.totalElements);
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  		break;
  	case 'notices': // 通知單
  		this.$toDoListAndNoticeApi
  			.queryNoticesUsingPOST(this.policyModel, pageNo, pageSize)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					console.log(resp);
  					resp.data.data.content.forEach((item, index) => {
  						const notice = {
  							...item,
  							index,
  						};
  						this.grid.data.push(notice);
  					});
  					this.grid.pagination.total = Number(resp.data.data.totalElements);
  				} else {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  		break;
  	default:
  		break;
  	}
  }

  // 點擊處理期限排序按鈕
  clickDeadlineTitle(e) {
  	console.log(e);
  	if (e.sort) {
  		this.sortByDesc = e.sort.desc;
  	} else {
  		this.sortByDesc = false;
  	}
  	this.grid.pagination.current = e.pagination.current;
  	this.grid.pagination.pageSize = e.pagination.pageSize;
  	if (this.tabValue !== 'notices') this.onSearch();
  }

  // 已處理SwitchButton
  async changeStatus(data) {
  	if (data.process) {
  		this.todoListInfo = {
  			...this.oriData[data.index],
  			status: 'Y',
  		};
  	} else {
      	this.todoListInfo = {
  			...this.oriData[data.index],
  			status: 'N',
  		};
  	}
  	this.setLoading(true);
  	this.$toDoListAndNoticeApi.oneProcessedStatusChangeUsingPOST(this.todoListInfo)
  		.then((resp) => {
  			if (resp.status === 200) {
  				console.log('處理狀態修改成功', resp);
  				this.onSearch();
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				this.setLoading(false);
  			}
  		}).catch((err) => {
  			console.log(err);
  			this.setLoading(false);
  		});
  }

  // 下載某列檔案
  downloadFile(data) {
  	this.setLoading(true);
  	let reportName;
  	if (this.tabValue === 'notices') {
  		reportName = data.item;
  	} else {
  		reportName = data.reportName;
  	}
  	this.$toDoListAndNoticeApi
  		.toDoListAndNoticeFileDownloadUsingPOST(data.filePath, reportName, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						const fileNameWithType = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  						const filename = fileNameWithType.split('.');
  						this.$blobUtils.download(
								resp.data as Blob,
								fileNameWithType,
  						);
  					}
  				}
  				this.setLoading(false);
  			} else {
  				this.$toDoListAndNoticeApi
  					.toDoListAndNoticeFileDownloadUsingPOST(data.filePath, reportName)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((err) => {
  						console.log(err);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		}).catch((err) => {
  			console.log(err);
  			this.setLoading(false);
  		}).finally();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.page__title {
  margin-bottom: 20px;
}
.query__table {
  margin-bottom: 50px;
}
.query__tab {
  width: 100%;
  margin-top: 12px;
  .ant-radio-button-wrapper {
    width: 130px;
    text-align: center;
  }
}
.query__total {
  margin-top: -30px;
}

// /*設定開關鈕的長寬*/
// .switch {
//   position: relative;
//   width: 42px;
//   height: 22px;
//   line-height: 22px;
// }
// .switch-checkbox {
//  position: absolute;
//  display: none;
// }
// .switch-label {
//   display: block;
//   overflow: hidden;
//   cursor: pointer;
//   border-radius: 20px;
// }
// .switch-txt {
//   display: block;
//   width: 200%;
//   margin-left: -100%;
// }
// .switch-txt::before, .switch-txt::after {
//   display: block;
//   float: right;
//   width: 50%;
//   font-size: 13px;
//   color: #fff;
//   font-weight: bold;
//   box-sizing: border-box;
// }
// /*開關鈕底色(開啟時)*/
// .switch-txt::after {
//   content: attr(turnOn);
//   padding-left: 8px;
//   background: #1ba0ef;
//   color: #fff;
// 	font-size: 8px;
// 	font-weight: 500;
// }
// /*開關鈕底色(關閉時)*/
// .switch-txt::before {
//   content: attr(turnOff);
//   padding-right: 8px;
//   background: #BFBFBF;
//   color: #fff;
//   text-align: right;
// 	font-size: 8px;
// 	font-weight: 500;
// }
// /*開關鈕的顏色與大小*/
// .switch-Round-btn {
//   position: absolute;
//   display: block;
//   width: 18px;
//   height: 18px;
//   margin: 2px;
//   background: #fff;
//   top: 0;
//   bottom: 0;
//   right: 20px;
//   border-radius: 13px;
//   transition: all 0.3s ease-in 0s;
// }
// .switch-checkbox:checked + .switch-label .switch-txt {
//   margin-left: 0;
// }
// .switch-checkbox:checked + .switch-label .switch-Round-btn{
//   right: 0;
// }

::v-deep{
	.ant-table-thead > tr > th.ant-table-column-sort {
		background: #7CACD3;
	}
	.ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-inner {
		color: #fff;
		.ant-table-column-sorter-up.on {
			color: #bfbfbf;
		}
		.ant-table-column-sorter-down.on {
			color: #bfbfbf;
		}
	}
	.ant-table-tbody > tr > td.ant-table-column-sort{
		background-color: rgba(0, 0, 0, 0);
	}
	.close-sort{
		.ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-sorters{
			cursor: default;
			.ant-table-header-column .ant-table-column-title{
				cursor: text;
			}
			.ant-table-column-sorters .ant-table-column-sorter{
				display: none;
			}
		}
		.ant-table-thead > tr > th .ant-table-header-column .ant-table-column-sorters:hover::before {
  		background: #7CACD3;
		}
	}
	.ant-switch svg {
		margin: 2px;
		width: 14px;
		height: 14px;
	}
}
</style>
