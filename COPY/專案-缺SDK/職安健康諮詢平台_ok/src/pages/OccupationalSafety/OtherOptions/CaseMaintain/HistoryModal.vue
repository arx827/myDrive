<template>
  <div>
    <a-modal
      :visible="visible"
      :mask-closable="false"
      :centered="true"
      :closable="true"
      :footer="null"
      width="1088px"
      @cancel="closeModal"
    >
      <h2 class="modal__title">
        歷年歷程查詢__{{ title }}
      </h2>
      <FblDataGrid
        class="historytable"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :scroll="{ x: true }"
      />
    </a-modal>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import moment from 'moment';

@Component({
	components: { FblDataGrid },
})
export default class HistoryModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  title!: string

  @Prop()
  visible!: boolean

	@Prop()
	tabType: string

	@Prop()
	historyData

	recordColumns={}

	categories={
		ergonomic: {
			period: '年份',
			created: '立案時間',
			closedDt: '結案時間',
			level: '原始級別',
			checkLevel: '級別檢核結果',
			closedReason: '結案原因',
			workArea: '工作地點',
			preventionStatus: '問卷狀態',
			preventionFinshedDt: '問卷完成填寫日期',
			musculoskeletalFinshedDt: '肌肉骨骼症狀調查填寫日期',
			phyConsultEd: '醫師諮詢時間',
			simpleEhFinshedDt: '簡易人因工程檢核表填寫日期',
			isImprove: '簡易人因工程是否有改善',
			isDisease: '職業病',
			isNotice: '通報中',
			changeReason: '級別改變原因',
			trackRecord: '追蹤紀錄',
			eduSendDt: '已發送衛教指導通知日期',
			phyConsultDt: '已發送醫師諮詢通知日期',
			formNoticeDt: '已發送表單填寫通知日期',
			remark: '備註',
		},
		mother: {
			year: '年份',
			closeCaseDate: '結案日期',
			closeCaseReason: '結案原因',
			createCaseDate: '立案時間(資料取得/系統匯入時間)',
			pregnantCategoryEnum: '身份別(資料取得時)',
  		bgnDt: '產檢假開始日期',
  		bgnPeriod: '產假起訖日期(區間)',
  		leaveCnt: '產假天數',
  		returnDt: '復職日(在職)',
  		babyStop: '是否育嬰留停',
  		babyPeriod: '育嬰留停期間',
  		workArea: '工作地點(縣市)',
  		questionnaireStatus: '問卷狀態',
  		questionnaireFinishDate: '問卷完成填寫日期',
  		dueDate: '預產期',
  		childbirthDate: '分娩日期',
  		breastFeeding: '是否哺乳',
  		dangerLevel: '工作場所危害風險分級',
  		phyConsultStatus: '諮詢狀態',
  		actDate: '預約諮詢日期',
  		actFinishDate: '完成諮詢日期',
  		healthLevel: '健康分級 ',
  		nextTraceDate: '下次追蹤日期',
  		healthDt: '已發送衛教指導通知日期(最近一次)',
  		phyConsultDt: '已發送醫師諮詢通知日期(最近一次跟催)',
  		followDt: '已發送表單填寫通知日期(最近一次跟催)',
		},
	}

	public grid={
		rowKey: 'category',
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'category',
				title: '項目',
				width: '222',
			},
		],
		data: [],
	}

	@Watch('historyData')
	setData() {
		console.log('watch hi');
		// console.log(this.grid.data);
		this.grid.data = [];
		this.grid.columns = [
			{
				type: FblColumnType.PLAIN,
				property: 'category',
				title: '項目',
				width: '222',
			},
		];
		// 整理欄位
		this.historyData.forEach((item, index) => {
			this.recordColumns[`record${index + 1}`] = `紀錄${index + 1}`;
		});
		console.log('recordColumns', this.recordColumns);
		Object.keys(this.recordColumns).forEach((recordId) => {
			const column = {
				type: FblColumnType.PLAIN,
				property: recordId,
				title: this.recordColumns[recordId],
				width: '222',
				fixed: null,
			};
			this.grid.columns.push(column);
		});

		Object.entries(this.categories[this.tabType]).forEach(([key, value]) => {
			const data = {
				category: value,
			};
			Object.keys(this.recordColumns).forEach((recordId, recordIndex) => {
				const oriData = this.historyData.find((item, index) => index == recordIndex);
				if (oriData) {
					if (this.tabType === 'mother') {
						if (key === 'year') {
							data[recordId] = moment(oriData.createCaseDate).format('YYYY');
						} else if (key === 'closeCaseDate') {
							data[recordId] = oriData.closeCaseDate ? moment(oriData.closeCaseDate).format('YYYY') : null;
						} else if (key === 'createCaseDate') {
							data[recordId] = moment(oriData.createCaseDate).format('YYYY/MM/DD');
						} else if (key === 'bgnDt') {
							data[recordId] = oriData.bgnDt ? moment(oriData.bgnDt).format('YYYY/MM/DD') : null;
						} else if (key === 'bgnPeriod') {
							data[recordId] = oriData.bgnDt ? `${moment(oriData.bgnDt).format('YYYY/MM/DD')}~${moment(oriData.endDt).format('YYYY/MM/DD')}` : null;
						} else if (key === 'returnDt') {
							data[recordId] = oriData.returnDt ? moment(oriData.returnDt).format('YYYY/MM/DD') : null;
						} else if (key === 'babyStop') {
							data[recordId] = oriData.babyStartDate ? '是' : '否';
						} else if (key === 'babyPeriod') {
							data[recordId] = oriData.babyStartDate ? `${moment(oriData.babyStartDate).format('YYYY/MM/DD')}~${moment(oriData.babyEndDate).format('YYYY/MM/DD')}` : '無';
						} else if (key === 'questionnaireFinishDate') {
							data[recordId] = oriData.questionnaireFinishDate ? moment(oriData.questionnaireFinishDate).format('YYYY/MM/DD') : null;
						} else if (key === 'dueDate') {
							data[recordId] = oriData.dueDate ? moment(oriData.dueDate).format('YYYY/MM/DD') : null;
						} else if (key === 'childbirthDate') {
							data[recordId] = oriData.childbirthDate ? moment(oriData.childbirthDate).format('YYYY/MM/DD') : null;
						} else if (key === 'actDate') {
							data[recordId] = oriData.actDate ? moment(oriData.actDate).format('YYYY/MM/DD') : null;
						} else if (key === 'actFinishDate') {
							data[recordId] = oriData.actFinishDate ? moment(oriData.actFinishDate).format('YYYY/MM/DD') : null;
						} else if (key === 'nextTraceDate') {
							data[recordId] = oriData.nextTraceDate ? moment(oriData.nextTraceDate).format('YYYY/MM/DD') : null;
						} else if (key === 'followDt') {
							data[recordId] = oriData.followDt ? moment(oriData.followDt).format('YYYY/MM/DD') : null;
						} else if (key === 'phyConsultDt') {
							data[recordId] = oriData.phyConsultDt ? moment(oriData.phyConsultDt).format('YYYY/MM/DD') : null;
						} else if (key === 'healthDt') {
							data[recordId] = oriData.healthDt ? moment(oriData.healthDt).format('YYYY/MM/DD') : null;
						} else {
							data[recordId] = oriData[key];
						}
					} else if (this.tabType === 'ergonomic') {
						data[recordId] = oriData[key];
					}
				}
			});
			this.grid.data.push(data);
		});
		console.log('gridData: ', this.grid.data);
	}

	closeModal() {
  	this.$emit('closeModal');
	}
}
</script>

<style lang="scss" scoped>
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
      padding: 32px 92px;
    }
	}
}

  .modal__title{
		color: #000000;
		font-size: 30px;
		font-weight: bold;
	}

	::v-deep .historytable{
		.ant-table-thead > tr:first-child > th:first-child{
			text-align: end;
		}
		.ant-table-thead > tr > th{
			background:$COLOR-MAIN1;
			color: #fff;
		}
		.ant-table-tbody > tr > td:first-child{
			background: #F5F8FC;
			text-align: end;
		}
	}

</style>
