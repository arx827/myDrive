<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          十大異常分析
        </div>
        <div class="pt-4" />
      </div>
      <div class="notification__wrap">
        <div class="result__table__head d-flex justify-content-between">
          <div>總檢查人數：{{ totalCount }}</div>
          <div>統計區間：{{ statisticalInterval }}</div>
        </div>
        <fbl-data-grid
          class="dataAnalyze__table table__green__head"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :scroll="{ x: true }"
        />
        <div class="note__block mt-3">
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

      <div class="notification__wrap">
        圖表
      </div>
      <div
        id="main"
        style="width: 1200px;height:600px;"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import axios from 'axios';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import ReportChartModal from '@/components/modal/ReportChartModal.vue';
import notification from '@/plugins/notification/infoNotification';
import moment from 'moment';
import * as echarts from 'echarts';

@Component({ components: { FblDataGrid, ReportChartModal } })
export default class EmpHealthDataAnalyzeList extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement

	queryData = null

	totalCount = null

	startDate = null

	endDate = null

	statisticalInterval = null // 異常統計區間

	chartData = null

	public grid = {
  	rowKey: 'itemDesc',
  	data: null,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'order',
  			title: '排名',
  			width: 80,
				customRender: (data, h) => this.h('div', {
					attrs: {
						class: 'text-primary',
					},
				}, data.order),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemDesc',
  			title: '檢查項目',
  			width: 100,
				customRender: (data, h) => this.h('div', {
					attrs: {
						class: 'fw-bold',
					},
				}, data.itemDesc),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'totalCount',
  			title: '總檢查人數',
  			width: 100,
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: 'totalAbnormalPercent',
  			title: '總異常率',
  			width: 150,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'totalCountM',
  			title: '男性 受檢人數',
  			width: 150,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'totalAbnormalCountM',
  			title: '男性 異常人數',
  			width: 150,
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: 'totalAbnormalPercentM',
  			title: '男性 異常率',
  			width: 150,
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: 'totalCountF',
  			title: '女性 受檢人數',
  			width: 150,
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: 'totalAbnormalCountF',
  			title: '女性 異常人數',
  			width: 150,
  		},
			{
  			type: FblColumnType.PLAIN,
  			property: 'totalAbnormalPercentF',
  			title: '女性 異常率',
  			width: 150,
  		},
  	],
	};

	// 讀取資料
	fetchData() {
  	this.setLoading(true);
  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataLargeAnomalyAnalysisInfoUsingPOST(this.queryData)
    	.then((resp: any) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data[0].checkDataLAAHealthInfoDetailDtoList;
					this.totalCount = resp.data.data[0].totalCount;
					this.statisticalInterval = resp.data.data[0].statisticalInterval;
  				// this.grid.pagination.total = parseInt(resp.data.data.totalElements);
					this.chartData = this.grid.data;
					this.barEcharts();
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

	// 下載
	downloadData() {
  	this.setLoading(true);
		this.$HeRpnHeRpnCheckDataExportControllerApi.downloadLargeanomalyanalysisInfoUsingPOST(this.queryData, { responseType: 'blob' })
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
  				this.$HeRpnHeRpnCheckDataExportControllerApi.downloadLargeanomalyanalysisInfoUsingPOST(this.queryData)
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

	// 取得圖表
	getTableau() {
		this.$tableau.gotoTableauUrl('HealthCheck_c2');
	}

	barEcharts() {
		const xDatas = [];
		const yDatas = [];
		this.chartData.forEach((item) => {
			xDatas.push(item.itemDesc);
			yDatas.push(item.totalAbnormalCount);
  	});
		const myChart = echarts.init(document.getElementById('main'), null, { renderer: 'svg' });
		const option = {
			title: {
			  text: '十大異常分析',
			},
			tooltip: {},
			legend: {
			  data: [''],
			},
			xAxis: {
			  data: xDatas,
				axisLabel: {
					interval: 0,
					formatter(value) {
						return value.split('').join('\n');
					},
				},
			},
			yAxis: {
			},
			series: [{
			  name: '',
			  type: 'bar',
			  data: yDatas,
				itemStyle: {
					color: '#7DC9CF',
				},
				label: {
					position: 'top',
					show: true,
					color: 'black',
					borderWidth: 0,
    		},
			}],
		};
		myChart.setOption(option);
	}

	/**
   * Hook
   */
	created() {
		const query = this.$global.getQuery();
  	this.queryData = query;
  	this.fetchData();
		this.startDate = moment(this.queryData.startDate).format('YYYY/MM/DD');
		this.endDate = moment(this.queryData.endDate).format('YYYY/MM/DD');
	}
}
</script>

<style lang="scss" scoped>
.result__table__head {
    color: #fff;
    background-color: #7DC9CF;
    padding: 9px 40px;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 20px;
  }

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

	::v-deep {
		.dataAnalyze__table {
			tr {
				td:nth-child(5), td:nth-child(6), td:nth-child(7) {
					background-color: #F5F8FC;
				}
				td:nth-child(8), td:nth-child(9), td:nth-child(10) {
					background-color: #FFF4F4;
				}
			}
		}
	}
</style>
