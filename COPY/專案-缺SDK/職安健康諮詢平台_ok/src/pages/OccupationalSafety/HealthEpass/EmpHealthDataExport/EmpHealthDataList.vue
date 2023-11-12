<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          員工健檢資料 (依資料)
        </div>
        <div class="pt-4">
          <button
            class="btn__radius--primary--outline"
            @click="viewChart"
          >
            圖表分析
          </button>
        </div>
      </div>
      <div class="notification__wrap">
        <div class="text-end">
          <ul class="list__level">
            <li>
              <span class="icon__level icon__second" />
              <span>2級</span>
            </li>
            <li>
              <span class="icon__level icon__third" />
              <span>3級</span>
            </li>
          </ul>
        </div>
        <a-table
          class="table__green__head"
          :row-key="grid.rowKey"
          :data-source="grid.data"
          :columns="grid.columns"
          :pagination="grid.pagination"
          :scroll="{ x: true }"
          @change="onPageChange($event)"
        >
          <div
            slot="action"
            slot-scope="slotProps"
            class="innerTable-btnWrap"
          >
            <button
              class="icon-button icon__detailBook"
              @click="getDetail(slotProps.infoId)"
            />
          </div>
        </a-table>
        <div class="note__block">
          ＊為保護員工健檢資料，凡<u>下載報表文件皆會發信通知主管</u>，特此通知說明。
        </div>
        <div class="btn__wrap text-center">
          <router-link :to="{name: 'EmpHealthDataExportQuery'}">
            <button class="btn__radius--primary--outline mx-2 mb-3">
              返回
            </button>
          </router-link>
          <button
            class="btn__radius--primary mx-2 mb-3"
            @click="downloadData"
          >
            下載
          </button>
        </div>
      </div>
    </div>
    <ReportPreviewModal
      v-if="reportData"
      :visible="reportPreviewModaOpen"
      :fetch-data="reportData"
      @closeModal="closeReportPreviewModaOpen"
    />
    <EmpHealthCheckChartModal
      :visible="chartModaOpen"
      :modal-info="queryData"
      @closeModal="closeChartModaOpen"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import ReportPreviewModal from '@/components/modal/ReportPreviewModal.vue';
import notification from '@/plugins/notification/infoNotification';
import moment from 'moment';
import EmpHealthCheckChartModal from '@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthCheckChartModal.vue';

@Component({ components: { ReportPreviewModal, EmpHealthCheckChartModal } })
export default class EmpHealthDataList extends Vue {
  @Action('setLoading') setLoading;

  type: string = '';

	queryData = null

	reportPreviewModaOpen = false;

	chartModaOpen = false;

	reportData = null;

	h = this.$createElement;

	downloadList = null; // 下載所需id

  public grid = {
  	rowKey: 'seq',
  	data: [
  	],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  			{
  				title: '姓名',
  				dataIndex: 'userName',
  				key: 'userName',
  				width: 80,
  				fixed: 'left',
  			},
  			{
  				key: 'emp',
  				dataIndex: 'emp',
  				title: '健檢資訊',
  				width: 100,
  				children: [
  					{
  						key: 'period',
  						dataIndex: 'period',
  						title: '健檢年度',
  						width: 120,
  					},
  					{
  						key: 'conSendName',
  						dataIndex: 'conSendName',
  						title: '最近一次發送醫師諮詢人員',
  						width: 120,
  					},
  					{
  						key: 'conSendDate',
  						dataIndex: 'conSendDate',
  						title: '最近一次發送醫師諮詢時間',
  						width: 120,
  						customRender: (data) => data && moment(data).format('YYYY/MM/DD'),
  					},
  					{
  						key: 'eduSendName',
  						dataIndex: 'eduSendName',
  						title: '最近一次發送衛教人員',
  						width: 120,
  					},
  					{
  						key: 'eduSendDate',
  						dataIndex: 'eduSendDate',
  						title: '最近一次發送衛教時間',
  						width: 120,
  						customRender: (data) => data && moment(data).format('YYYY/MM/DD'),
  					},
  					// {
  					// 	key: 'crtNo',
  					// 	dataIndex: 'crtNo',
  					// 	title: '建檔時間',
  					// 	width: 120,
  					// },
  				// {
  				// 		key: 'empIdNo',
  				// 		dataIndex: 'empIdNo',
  				// 		title: '建檔方式',
  				// 		width: 120,
  				// 	},
  				],
  			},
  			{
  				key: 'chcekDataItemLevelListDtoList',
  				dataIndex: 'chcekDataItemLevelListDtoList',
  				title: '健檢項目',
  				width: 100,
  				// children: [
  				// 	{
  				// 		key: 'attributeDesc',
  				// 		dataIndex: 'attributeDesc',
  				// 		title: '糖尿病',
  				// 		width: 100,
  				// 	},
  				// 	{
  				// 		key: 'insName',
  				// 		dataIndex: 'insName',
  				// 		title: '高血壓',
  				// 		width: 120,
  				// 	},

  				// ],
  			  children: null,
  			},
  			{
  				title: '健檢結果',
  				width: 100,
  				fixed: 'right',
  			  scopedSlots: { customRender: 'action' },
  			},
  		],
  };

  /**
   * Func
   */

  // 關閉詳細資料彈窗
  closeReportPreviewModaOpen() {
  	this.reportPreviewModaOpen = false;
  	this.queryData = null;
  }

  closeChartModaOpen() {
  	this.chartModaOpen = false;
  }

	 // 下載
  downloadData() {
  	const data = {
  		infoId: [],
  		isShade: 'Y',
  	};
  	// this.grid.data.forEach((element) => {
  	// 	data.infoId.push(element.infoId);
  	// });
  	data.infoId = this.downloadList;
  	this.$HeRpnHeRpnCheckDataExportControllerApi.downloadCheckHealthInfoUsingPOST(data, { responseType: 'blob' })
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
  				this.$HeRpnHeRpnCheckDataExportControllerApi.downloadCheckHealthInfoUsingPOST(data)
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

  // 讀取單一資料
  getDetail(infoId) {
  	console.log(infoId);
  	this.setLoading(true);
  	this.$HEEmpMyHealthCheckApi.getHealthCheckInfoUsingPOST([infoId])
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log(resp.data);
  				this.reportPreviewModaOpen = true;
  				this.reportData = resp.data.data;
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
  }

  // 讀取資料
  fetchData() {
  	this.setLoading(true);
  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataexportDataPageUsingPOST(this.queryData, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
    	.then((resp) => {
  			if (resp.data.status === 200) {
  				this.downloadList = resp.data.data.infoIdList;
  				this.grid.data = resp.data.data.checkDataPersonalHealthInfoDtoPage.content;
  				this.grid.columns.find((e) => e.key === 'chcekDataItemLevelListDtoList').children = this.grid.data[0].chcekDataItemLevelListDtoList.map((e, index) => ({
  					key: `item${index}`,
  					dataIndex: `item${index}`,
  					title: e.itemName,
  					width: 100,
  					customRender: (data, record, idx) => this.h('div', {
  						attrs: {
  							class: this.grid.data[idx].chcekDataItemLevelListDtoList[index].level ? `color_level color__level${this.grid.data[idx].chcekDataItemLevelListDtoList[index].level}` : 'color_level color__level1',
  						},
  					}, data),
  				}));
  				this.grid.data.forEach((element) => {
  					element.chcekDataItemLevelListDtoList.forEach((el, index) => {
  						element[`item${index}`] = el.checkValue;
  					});
  				});
  				this.grid.pagination.total = parseInt(resp.data.data.checkDataPersonalHealthInfoDtoPage.totalElements);
  			} else {
  				notification.error({
  					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  			console.log(this.grid.columns);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 查看圖表
  viewChart() {
  	console.log('viewChart');
  	// this.$tableau.gotoTableauUrl('HealthCheck_c3');
  	this.chartModaOpen = true;
  }

  onPageChange(e) {
  	this.grid.pagination = e;
  	this.fetchData();
  }

  /**
   * Hook
   */
  created() {
  	const query = this.$global.getQuery();
  	this.queryData = query;
  	this.fetchData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>

.note__block {
	display: inline-block;
	color: $COLOR-MAIN1;
	font-size: 14px;
	background-color: #F5F8FC;
	padding: 5px 12px;
	u {
		font-size: 14px;
	}
}

.notification__label {
	display: inline-block;
	font-size: 16px;
	font-weight: 600;
	padding: 3px 12px;
	margin-bottom: 25px;
	color: #fff;
	background: #363636;
	border-radius: 15px;
}

.icon__level {
	width: 10px;
	height: 10px;
	display: inline-flex;
	margin-right: 5px;
}
.icon__second {
	background-color: #4D86FF;
}
.icon__third {
	background-color: #F5222D;
}

.color_level{
	color: #F5222D;
	&.color__level2{
	color: #4D86FF;
	}
	&.color__level1{
		color: #000000;
	}
}
.list__level{
	margin-bottom: 5px;
	>li{
		display: inline-flex;
		align-items: center;
		margin-right: 5px;
	}
}
::v-deep {
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
	// .ant-table-row {
	// 	display: block;
	// 	overflow: hidden;
	// 	width: 100%;
	// }
	.ant-table-expanded-row, .ant-table-expanded-row th, .ant-table-expanded-row:hover{
		background: #E6F7FF;
	}
}

</style>
