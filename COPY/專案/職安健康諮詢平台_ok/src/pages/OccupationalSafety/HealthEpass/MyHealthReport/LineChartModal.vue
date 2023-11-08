<template>
  <a-modal
    v-model="modalVisible"
    :centered="true"
    :closable="true"
    :footer="null"
    width="50%"
    @cancel="handleClose(false)"
  >
    <div class="previewModal__wrap">
      <h2 class="modal__title">
        {{ modalTitle }}
      </h2>
      <h2 class="modal__title">
        歷年趨勢圖
      </h2>
      <div
        id="main"
        style="width:600px;height:400px;"
      />
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
export default class LineChartModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  @Prop()
  modalInfo

	modalVisible = false

  modalTitle = ''

  handleClose() {
  	this.$emit('closeModal');
  }

  @Watch('visible')
  visibleChange(val) {
  	this.modalVisible = val;
  }

	@Watch('modalInfo')
  modalInfoChange(val) {
  	this.setData(val);
  }

	setData(val) {
		const xDatas = [val.threeCheck.period, val.twoCheck.period, val.oneCheck.period];
		const yDatas = [val.threeCheck.checkValue, val.twoCheck.checkValue, val.oneCheck.checkValue];
		const charTitle = val.caName;

		const myChart = echarts.init(document.getElementById('main'), null, { renderer: 'svg' });
		const option = {
			title: {
			  text: charTitle,
			},
			tooltip: {},
			legend: {
			  data: [''],
			},
			xAxis: {
				name: '年度',
			  data: xDatas,
			},
			yAxis: {
				name: '健檢數值',
			},
			series: [{
			  name: '',
			  type: 'line',
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

	updated() {
		console.log('modalInfo:', this.modalInfo);
		this.setData(this.modalInfo);
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
}
</style>
