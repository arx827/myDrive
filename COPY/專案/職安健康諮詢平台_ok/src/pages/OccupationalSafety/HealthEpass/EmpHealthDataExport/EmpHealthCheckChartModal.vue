<template>
  <a-modal
    v-model="modalVisible"
    :centered="true"
    :closable="true"
    :footer="null"
    width="80%"
    @cancel="handleClose(false)"
  >
    <div class="previewModal__wrap">
      <div class="modal__content">
        <h2 class="modal__title">
          {{ modalTitle }}
        </h2>
        <h2 class="modal__title">
          圖表分析
        </h2>
      </div>
      <div
        v-for="(item, idx) in getData"
        :key="idx"
      >
        <div class="question__block">
          <div class="page__subtitle">
            <label>{{ item.itemDesc }}</label>
          </div>
          <a-table
            class="table__green__head"
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

      <div class="modal__btn__wrap btn__wrap">
        <button
          class="btn__radius--primary--outline"
          @click="handleClose(false)"
        >
          關閉
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import * as echarts from 'echarts';

@Component({})
export default class EmpHealthCheckChartModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  @Prop()
  modalInfo

	modalVisible = false

  modalTitle = ''

	getData = null;

	dataInfo: Array<any> = [];

	gridData = {
		rowKey: 'rowKey',
		data: [],
		columns: [
			{
  			dataIndex: 'totalCount',
  			title: '總檢查人數',
  			width: 120,
  		},
			{
  			dataIndex: 'totalAbnormalPercent',
  			title: '總異常率',
  			width: 120,
  		},
			{
  			dataIndex: 'totalCountM',
  			title: '男性 受檢人數',
  			width: 150,
  		},
  		{
  			dataIndex: 'totalAbnormalCountM',
  			title: '男性 異常人數',
  			width: 150,
  		},
			{
  			dataIndex: 'totalAbnormalPercentM',
  			title: '男性 異常率',
  			width: 150,
  		},
			{
  			dataIndex: 'totalCountF',
  			title: '女性 受檢人數',
  			width: 150,
  		},
			{
  			dataIndex: 'totalAbnormalCountF',
  			title: '女性 異常人數',
  			width: 150,
  		},
			{
  			dataIndex: 'totalAbnormalPercentF',
  			title: '女性 異常率',
  			width: 150,
  		},
		],
	 }

	handleClose() {
  	this.$emit('closeModal');
	}

  @Watch('visible')
	visibleChange(val) {
  	this.modalVisible = val;
	}

	@Watch('modalInfo')
  modalInfoChange(val) {
  	// this.setData(val);
  }

	// 讀取資料
	fetchData() {
  	this.setLoading(true);
  	this.$HeRpnHeRpnCheckDataExportControllerApi.getCheckdataexportDataAnalyzeUsingPOST(this.modalInfo)
    	.then((resp: any) => {
  			if (resp.data.status === 200) {
					this.getData = resp.data.data;
  				console.log('getData:', this.getData);
					this.getData.forEach((element, index) => {
						this.dataInfo = [];
						this.dataInfo.push(element);
						this.dataInfo.forEach((el, idx) => {
							el.rowkey = idx + 1;
						});
						// console.log('dataInfo:', this.dataInfo);
						this.gridData.data[index] = this.dataInfo;
						this.gridData.data[index] = this.gridData.data[index].map((item, idx) => ({
							rowkey: idx + 1,
							...item,
						}));
					});

					this.getData.forEach((element, index) => {
						console.log('gridData.data====>', this.gridData.data[index]);
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

	pieEcharts() {
		console.log('pieEcharts');
  	const userCharts = document.getElementsByClassName('userChart') as HTMLCollectionOf<HTMLElement>; // 對應地使用ByClassName

  	for (let i = 0; i < userCharts.length; i++) { // 通過for迴圈，在相同class的dom內繪製元素
  		const myChart = echarts.init(userCharts[i], null, { renderer: 'svg' });
			const infoData = this.getData[i];

			const datas = [];
			datas.push({
				name: '女性異常',
				value: infoData.totalAbnormalCountF,
			});

			datas.push({
				name: '男性異常',
				value: infoData.totalAbnormalCountM,
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
	}

	created() {
		console.log('created');
		this.fetchData();
	}

	updated() {
		console.log('modalInfo:', this.modalInfo);
		this.pieEcharts();
		// this.setData(this.modalInfo);
	}
}
</script>

<style lang="scss" scoped>
.previewModal__wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal__content {
  margin-top: 10px;
}

::v-deep {
  .ant-modal{
    margin-top: 80px;
  }
	 button.ant-modal-close{
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		background-color: #23C4A8;
		width: 44px;
		height: 44px;
		border-radius: 50vh;
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			font-size: 18px;
    	color: #ffffff;
			font-weight: bold;
		}
	}

	.ant-modal-body{
    padding: 20px 45px;
		@include rwd-lg{
      padding: 40px 92px;
    }
	}

  .modal__title{
		color: #000000;
		font-size: 30px;
		font-weight: bold;
    margin-bottom: 0;
	}

	.modal__btn__wrap{
		display: flex;
		justify-content: center;
    margin: 20px 0 0 0;
    gap: 10px;
    @include rwd-lg{
      margin:40px 0 0 0;
    }
	}

	.question__block {
		flex: 1;
		padding: 20px 25px 20px 50px;
	}

	.page__subtitle {
    color: $TEXT-GREEN;
    margin-bottom: 20px;
    span {
      font-weight: $TEXT-BOLD;
    }
  }
}
</style>
