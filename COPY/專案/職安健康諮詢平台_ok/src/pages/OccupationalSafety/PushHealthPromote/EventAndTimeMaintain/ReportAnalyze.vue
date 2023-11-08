<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        報表分析
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline"
          @click="goDownLoad"
        >
          下載報表
        </button>
      </div>
    </div>
    <div class="page__subtitle">
      人員系統分析
    </div>
    <div
      v-for="(item, idx) in userInfo"
      :key="idx"
    >
      <div class="question__block">
        <div class="event__title">
          <label>{{ item.title }}</label>
        </div>
        <a-table
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data-source="gridData.data[idx]"
          :pagination="false"
        />
        <div
          class="userChart"
          style="width: 800px;height:600px;"
        />
      </div>
    </div>

    <div class="page__subtitle">
      滿意度統計分析
    </div>
    <div
      v-for="(item, idx) in questInfo"
      :key="idx"
    >
      <div class="question__block">
        <div class="event__title">
          <label>{{ item.title }}</label>
        </div>
        <a-table
          :row-key="gridData2.rowKey"
          :columns="gridData2.columns"
          :data-source="gridData2.data[idx]"
          :pagination="false"
        />
        <div
          class="questChart"
          style="width: 800px;height:600px;"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import * as echarts from 'echarts';

@Component({ })
export default class ReportAnalyze extends Vue {
  @Action('setLoading') setLoading;

  actId = null;

	userInfo: Array<any> = [];

	questInfo = null;

	gridData = {
		rowKey: 'rowkey',
		data: [],
		columns: [
			{
				title: '答案/選項',
				key: 'optionDesc',
				dataIndex: 'optionDesc',
				// scopedSlots: { customRender: 'optionDesc' },
				width: 190,
			},
			{
				title: '填答數',
				key: 'eachCount',
				dataIndex: 'eachCount',
				// scopedSlots: { customRender: 'eachCount' },
				width: 130,
			},
			{
				title: '百分比',
				dataIndex: 'percent',
				key: 'percent',
				width: 120,
			},
		],
	 }

	 gridData2 = {
	 	rowKey: 'rowkey',
	 	data: [],
	 	columns: [
	 		{
	 			title: '答案/選項',
	 			key: 'optionDesc',
	 			dataIndex: 'optionDesc',
	 			// scopedSlots: { customRender: 'optionDesc' },
	 			width: 190,
	 		},
	 		{
	 			title: '填答數',
	 			key: 'eachCount',
	 			dataIndex: 'eachCount',
	 			// scopedSlots: { customRender: 'eachCount' },
	 			width: 130,
	 		},
	 		{
	 			title: '百分比',
	 			dataIndex: 'percent',
	 			key: 'percent',
	 			width: 120,
	 		},
	 	],
	 }

	 getActReportAnalysis() {
  	console.log('actId:', this.actId);
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getHealthActReportAnalysisRUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			if (resp.data.status == 200) {
	 				const getData = resp.data.data;
  				console.log('getData:', getData);

	 				this.userInfo.push(getData.healthActSessionStatisticsDto);
	 				this.userInfo.push(getData.healthActSexStatisticsDto);
	 				this.userInfo.push(getData.healthActWorkerStatisticsDto);
	 				// console.log('this.userInfo1:', this.userInfo);
	 				this.userInfo.forEach((element, index) => {
	 					// console.log('element:', element);
	 					Object.assign(this.gridData.data, { [index]: element.healthActStatisticsDetailDtoList });
	 					this.gridData.data[index] = this.gridData.data[index].map((item, idx) => ({
	 						// console.log('item:', item);
	 						rowkey: idx + 1,
	 						...item,
	 					}));
	 				});
	 				// console.log('this.gridData.data:', this.gridData.data);
	 				// this.userInfo = this.userInfo.push(getData.healthActSexStatisticsDto);
	 				// console.log('this.userInfo2:', this.userInfo);

	 				this.questInfo = getData.healthActTopicStatisticsDtoList;
	 				console.log('this.questInfo', this.questInfo);
	 				this.questInfo.forEach((element, index) => {
	 					// console.log('element:', element);
	 						Object.assign(this.gridData2.data, { [index]: element.healthActStatisticsDetailDtoList });
	 						this.gridData2.data[index] = this.gridData2.data[index].map((item, index) => ({
	 							// console.log('item:', item);
	 							rowkey: index + 1,
	 							...item,
	 						}));
	 				});

	 				console.log('gridData2:', this.gridData2.data);
  			} else {
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  				});
  				this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  			this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	 }

	 setResultParam() {
  	const query = this.$global.getQuery();
  	console.log('query', query);
  	this.actId = query?.actId;
  	this.getActReportAnalysis();
	 }

	 pieEcharts() {
	 	console.log('pieEcharts');
  	const userCharts = document.getElementsByClassName('userChart') as HTMLCollectionOf<HTMLElement>; // 對應地使用ByClassName

  	for (let i = 0; i < userCharts.length; i++) { // 通過for迴圈，在相同class的dom內繪製元素
  		const myChart = echarts.init(userCharts[i], null, { renderer: 'svg' });
	 		const datas = [];
	 		// console.log('this.userInfo:', this.userInfo[i]);
	 		this.userInfo[i].healthActStatisticsDetailDtoList.forEach((element, index) => {
	 			datas.push({
	 				name: element.optionDesc,
	 				value: element.eachCount,
	 			});
	 		});
	 		console.log('datas:', datas);
	 		const option = {
	 			title: {
			  text: '',
	 			},
	 			tooltip: {
	 				trigger: 'item',
	 			},
	 			legend: {
	 				top: '5%',
	 				left: 'center',
	 			},
	 			series: [
	 				{
	 					type: 'pie',
	 					radius: '50%',
	 					data: datas,
	 					emphasis: {
	 						itemStyle: {
	 							shadowBlur: 10,
	 							shadowOffsetX: 0,
	 							shadowColor: 'rgba(0, 0, 0, 0.5)',
	 						},
	 					},
	 				},
	 			],
	 		};
	 		myChart.setOption(option);
	 	}

	 	const questCharts = document.getElementsByClassName('questChart') as HTMLCollectionOf<HTMLElement>; // 對應地使用ByClassName
	 	for (let i = 0; i < questCharts.length; i++) { // 通過for迴圈，在相同class的dom內繪製元素
  		const myChart = echarts.init(questCharts[i], null, { renderer: 'svg' });
	 		const datas = [];
	 		console.log('this.questInfo:', this.questInfo[i]);
	 		this.questInfo[i].healthActStatisticsDetailDtoList.forEach((element, index) => {
	 			datas.push({
	 				name: element.optionDesc,
	 				value: element.eachCount,
	 			});
	 		});
	 		// console.log('questInfo datas:', datas);
	 		const option = {
	 			title: {
			  text: '',
	 			},
	 			tooltip: {
	 				trigger: 'item',
	 			},
	 			legend: {
	 				top: '5%',
	 				left: 'center',
	 			},
	 			series: [
	 				{
	 					type: 'pie',
	 					radius: '50%',
	 					data: datas,
	 					emphasis: {
	 						itemStyle: {
	 							shadowBlur: 10,
	 							shadowOffsetX: 0,
	 							shadowColor: 'rgba(0, 0, 0, 0.5)',
	 						},
	 					},
	 				},
	 			],
	 		};
	 		myChart.setOption(option);
	 	}
	 }

	 goDownLoad() {
		 console.log('goDownLoad');
		 this.$PHPRpnQuerySatisfyQuestApi.querySatisfyQuestDownloadUsingPOST(this.actId, { responseType: 'blob' })
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
	 			}
	 		})
  		.catch((error) => {
	 			console.log('goDownLoad', error);
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
  	console.log('created');
	 	this.setResultParam();
	 }

	 updated() {
	 	console.log('updated');
	 	this.pieEcharts();
	 }
}
</script>

<style lang="scss" scoped>
.page__subtitle {
    color: $TEXT-GREEN;
    margin-bottom: 20px;
    span {
      font-weight: $TEXT-BOLD;
    }
  }

.question__block {
  flex: 1;
  padding: 20px 25px 20px 50px;
}

.a-form-label {
    font-size: 14px;
    line-height: 1;
    display: block;
    margin-bottom: 10px;
    label {
      font-size: 14px;
      font-weight: 600;
      @include rwd-lg {
        font-size: 16px;
      }
    }
  }

	.event__title {
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
</style>
