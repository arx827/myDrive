<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        查詢結果
      </div>
      <div>
        <button
          class="btn__radius--primary--outline ms-2"
          @click="downloadYearRecord"
        >
          查詢結果下載
        </button>
        <button
          v-if="content.year"
          class="btn__radius--primary--outline ms-2"
          @click="downloadExeYearRecord"
        >
          年度執行報告下載
        </button>
        <!-- <button
          v-if="content.year"
          class="btn__radius--primary--outline ms-2"
          data-bs-toggle="modal"
          data-bs-target="#recordModal"
        >
          年度執行紀錄
        </button> -->
      </div>
    </div>
    <div class="table">
      <FblDataGrid
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      />
    </div>
    <div class="bottom__btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="goback()"
      >
        返回
      </button>
    </div>
    <RecordModal />
    <!-- <TodoButton /> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TodoButton from '@compononts/to-do/TodoButton.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import RecordModal from '@/pages/OccupationalSafety/MotherHealth/YearReport/YearReportRecord.vue';
import { MonPlanRecordWithYearReportQueryDto, MonPlanRecordWithYearReportQueryDownloadDto } from '@fubonlife/oss-api-axios-sdk';
import { Action } from 'vuex-class';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import moment from 'moment';

require('../../../../../node_modules/bootstrap/js/dist/modal');

@Component({ components: { TodoButton, FblDataGrid, RecordModal } })
export default class YearReportResult extends Vue {
	@Action('setLoading') setLoading;

	h = this.$createElement;

	changepageNo = null;

  changepageSize = null;

	content = null;

  gridData = {
  	rowKey: 'index',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['5', '10', '25'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'createCaseDate',
  			title: '立案時間',
  			fixed: 'left',
  			customRender: (data) => ((data.createCaseDate) ? this.h('div', [
  				this.h('div', moment(data.createCaseDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '姓名',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'idNo',
  			title: 'ID',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'age',
  			title: '年齡',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'unit',
  			title: '部門/單位',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'email',
  			title: '信箱',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'jobStatus',
  			title: '狀態',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'pregnantCategoryEnum',
  			title: '身份別',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'bgnDt',
  			title: '產檢假開始日',
  			customRender: (data) => ((data.bgnDt) ? this.h('div', [
  				this.h('div', moment(data.bgnDt).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'endDt',
  			title: '產假起訖日',
  			customRender: (data) => ((data.bgnDt) ? this.h('div', [
  				this.h('div', moment(data.bgnDt).format('YYYY/MM/DD~')), this.h('div', (data.endDt) ? moment(data.endDt).format('YYYY/MM/DD') : '-'),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'leaveCnt',
  			title: '產假天數',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'returnDt',
  			title: '復職日(在職)',
  			customRender: (data) => ((data.returnDt) ? this.h('div', [
  				this.h('div', moment(data.returnDt).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'm',
  			title: '育嬰留停期間',
  			customRender: (data) => ((data.babyStartDate) ? this.h('div', [
  				this.h('div', moment(data.babyStartDate).format('YYYY/MM/DD~')), this.h('div', (data.babyEndDate) ? moment(data.babyEndDate).format('YYYY/MM/DD') : '-'),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'workArea',
  			title: '工作地點',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'questionnaireStatus',
  			title: '問卷狀態',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'questionnaireFinishDate',
  			title: '問卷完成填寫日期',
  			width: 130,
  			customRender: (data) => ((data.questionnaireFinishDate) ? this.h('div', [
  				this.h('div', moment(data.questionnaireFinishDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'dueDate',
  			title: '預產日期',
  			customRender: (data) => ((data.dueDate) ? this.h('div', [
  				this.h('div', moment(data.dueDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'childbirthDate',
  			title: '分娩日期',
  			customRender: (data) => ((data.childbirthDate) ? this.h('div', [
  				this.h('div', moment(data.childbirthDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'breastFeeding',
  			title: '哺乳',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'dangerLevel',
  			title: '工作場所危害風險等級',
  			width: 120,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'phyConsultStatus',
  			title: '諮詢狀態',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'actDate',
  			title: '諮詢預約日期',
  			customRender: (data) => ((data.actDate) ? this.h('div', [
  				this.h('div', moment(data.actDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'actFinishDate',
  			title: '完成詢日期',
  			customRender: (data) => ((data.actFinishDate) ? this.h('div', [
  				this.h('div', moment(data.actFinishDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'healthLevel',
  			title: '健康分級',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'nextTraceDate',
  			title: '下次追蹤日期',
  			customRender: (data) => ((data.nextTraceDate) ? this.h('div', [
  				this.h('div', moment(data.nextTraceDate).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'closeCaseDate',
  			title: '結案日期',
  			customRender: (data) => ((data.closeCaseDesc) ? this.h('div', { style: { color: 'red' } }, data.closeCaseDesc) : this.h('div', [
  				this.h('div', moment(data.closeCaseDate).format('YYYY/MM/DD'))])),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'closeCaseReason',
  			title: '結案原因',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'followDt',
  			title: '最近一次發送衛教指導預約通知日期',
  			width: 130,
  			customRender: (data) => ((data.followDt) ? this.h('div', [
  				this.h('div', moment(data.followDt).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'phyConsultDt',
  			title: '最近一次發送醫生諮詢通知(跟催)日期',
  			width: 130,
  			customRender: (data) => ((data.phyConsultDt) ? this.h('div', [
  				this.h('div', moment(data.phyConsultDt).format('YYYY/MM/DD')),
  			]) : null),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'healthDt',
  			title: '最近一次發送表單填寫通知(跟催)日期',
  			width: 130,
  			customRender: (data) => ((data.healthDt) ? this.h('div', [
  				this.h('div', moment(data.healthDt).format('YYYY/MM/DD')),
  			]) : null),
  		},
  	],
  }; // 表格欄位名稱

  getGridData() {
  	this.setLoading(true);
  	this.gridData.data = [];
  	this.changepageNo = this.gridData.pagination.current - 1;
  	this.changepageSize = this.gridData.pagination.pageSize;
  	const [startDate, endDate] = this.content.range ? DateTimeFormmat.filterRangeDate([new Date(this.content.range[0]), new Date(this.content.range[1])]) : [undefined, undefined];
  	const queryData: MonPlanRecordWithYearReportQueryDto = {
  		dangerLevel: this.content.danger ? this.content.danger : undefined,
  		endDate,
  		healthLevel: this.content.health ? this.content.health : undefined,
  		id: this.content.id ? this.content.id : undefined,
  		jobStatus: this.content.status ? this.content.status : undefined,
  		name: this.content.name ? this.content.name : undefined,
  		pageNo: this.changepageNo,
  		pageSize: this.changepageSize,
  		phyConsultStatusEnum: this.content.doctor ? this.content.doctor : undefined,
  		pregnantCategoryEnum: this.content.identity ? this.content.identity : undefined,
  		questionnaireStatus: this.content.qa ? this.content.qa : undefined,
  		startDate,
  		unit: this.content.dept ? this.content.dept : undefined,
  		year: this.content.year ? parseInt(this.content.year) : undefined,
  	};
  	this.$MONPLANRpnRecordWithYearReportApi.recordWithYearReportPageRUsingPOST(queryData)
  		.then((resp) => {
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  			this.gridData.data = resp.data.data.content;
  			this.gridData.data.forEach((item, idx) => {
  				item.index = idx + 1;
  			});
  		})
  		.catch((error) => {
  			console.log('error status=', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  goback() {
  	this.$router.push({ name: 'YearReportIndex' });
  }

  onPageChange(e) {
  	this.gridData.pagination.current = e.pagination.current;
  	this.gridData.pagination.pageSize = e.pagination.pageSize;
  	this.getGridData();
  }

  // 年度紀錄與報表查詢結果下載
  downloadYearRecord() {
  	this.setLoading(true);
  	const [startDate, endDate] = this.content.range ? DateTimeFormmat.filterRangeDate([new Date(this.content.range[0]), new Date(this.content.range[1])]) : [undefined, undefined];
  	const downloadData: MonPlanRecordWithYearReportQueryDownloadDto = {
  		dangerLevel: this.content.danger ? this.content.danger : undefined,
  		endDate,
  		healthLevel: this.content.health ? this.content.health : undefined,
  		id: this.content.id ? this.content.id : undefined,
  		jobStatus: this.content.status ? this.content.status : undefined,
  		name: this.content.name ? this.content.name : undefined,
  		phyConsultStatusEnum: this.content.doctor ? this.content.doctor : undefined,
  		pregnantCategoryEnum: this.content.identity ? this.content.identity : undefined,
  		questionnaireStatus: this.content.qa ? this.content.qa : undefined,
  		startDate,
  		unit: this.content.dept ? this.content.dept : undefined,
  		year: this.content.year ? parseInt(this.content.year) : undefined,
  	};
  	this.$MONPLANRpnRecordWithYearReportApi.recordWithYearReportDownloadRUsingPOST(downloadData, { responseType: 'blob' })
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
  				this.$MONPLANRpnRecordWithYearReportApi.recordWithYearReportDownloadRUsingPOST(downloadData)
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
  			console.log('error status=', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 執行年度報告下載
  downloadExeYearRecord() {
  	this.setLoading(true);
  	const downloadData: MonPlanRecordWithYearReportQueryDto = {
  		dangerLevel: this.content.danger ? this.content.danger : undefined,
  		endDate: this.content.range ? this.content.range[1] : undefined,
  		healthLevel: this.content.health ? this.content.health : undefined,
  		id: this.content.id ? this.content.id : undefined,
  		jobStatus: this.content.status ? this.content.status : undefined,
  		name: this.content.name ? this.content.name : undefined,
  		pageNo: this.changepageNo,
  		pageSize: this.changepageSize,
  		phyConsultStatusEnum: this.content.doctor ? this.content.doctor : undefined,
  		pregnantCategoryEnum: this.content.identity ? this.content.identity : undefined,
  		questionnaireStatus: this.content.qa ? this.content.qa : undefined,
  		startDate: this.content.range ? this.content.range[0] : undefined,
  		unit: this.content.dept ? this.content.dept : undefined,
  		year: this.content.year ? parseInt(this.content.year) : undefined,
  	};
  	this.$MONPLANRpnRecordWithYearReportApi.recordWithYearReportExecuteDownloadRUsingPOST(downloadData, { responseType: 'blob' })
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
  				this.$MONPLANRpnRecordWithYearReportApi.recordWithYearReportExecuteDownloadRUsingPOST(downloadData)
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
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	const query = this.$global.getQuery();
  	this.content = query;
  	this.getGridData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
	.header{
		width: 100%;
	}
	.bottom__btn__wrap {
    margin-bottom: 40px;
		margin-top: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
