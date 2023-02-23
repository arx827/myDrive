<template>
  <div>
    <div class="container">
      <div class="upload__wrap">
        <div class="row">
          <div class="col">
            <div class="page__title">
              資料整批上傳
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3">
            <img
              class="img__people d-none d-md-block"
              src="@/assets/image_parents.svg"
              alt=""
            >
          </div>
          <div class="col-md-6 col-10">
            <DataUploadTab :tab-value="tabValue" />
            <p class="primary__txt tip__txt">
              {{ uploadTip }}
            </p>
            <div class="uploader__wrap">
              <a-upload-dragger
                name="file"
                :custom-request="uploadFlie"
                :file-list="uploadedFileList"
                :before-upload="beforeUpload"
                @change="handleChange"
                @reject="beforeUpload"
              >
                <p class="ant-upload-drag-icon">
                  <a-icon type="inbox" />
                </p>
                <p class="ant-upload-text">
                  選擇欲上傳資料：點擊或將文件拖曳到這裡上傳
                </p>
                <p class="ant-upload-hint">
                  {{ uploadMsg }}
                </p>
              </a-upload-dragger>
            </div>
          </div>
          <div class="col-md-3 col-2">
            <div class="text-end d-flex">
              <ProjectTip />
              <DemoExcelList />
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="grid.data.length > 0"
        class="row"
      >
        <div class="upload__result__wrap">
          <div class="upload__result-title">
            <span v-if="tabValue == 1">加保上傳資料</span>
            <span v-if="tabValue == 2">退保上傳資料</span>
            <span v-if="tabValue == 3">薪資變更上傳資料</span>
            <span v-if="tabValue == 4">投保內容變更上傳資料</span>
          </div>
          <div class="text-center position-relative">
            <a-radio-group
              v-model="tabUploadValue"
              class="text-center"
              default-value="1"
              button-style="solid"
            >
              <a-radio-button
                :value="1"
              >
                全部
              </a-radio-button>
              <a-radio-button
                :value="2"
                :disabled="allFileVaild"
              >
                錯誤
              </a-radio-button>
            </a-radio-group>
            <p
              class="total__num position-absolute"
              style="right: 0; top: 0;"
            >
              共{{ totalEle }}筆
            </p>
            <div class="clearfix" />
          </div>
          <div
            class="upload__result-table"
            :class="{'hide-pagination':hidePagination}"
          >
            <fbl-data-grid
              v-if="tabValue == 1 || tabValue == 3"
              class="upload__table"
              :row-key="grid.rowKey"
              :columns="grid.columns"
              :data="grid.data"
              :pagination="grid.pagination"
              :custom-row="grid.customRow"
              :scroll="{ x: true }"
              @tableChange="onPageChange($event)"
            />

            <a-table
              v-if="tabValue == 2 || tabValue == 4"
              class="upload__table-span"
              :data-source="grid.data"
              :columns="grid.columns"
              :pagination="grid.pagination"
              :scroll="{ x: true }"
            />

            <div class="block__btns text-center">
              <button
                :disabled="!allFileVaild"
                class="btn__radius--primary"
                @click="confirmUpload"
              >
                存檔上傳
              </button>
            </div>
            <p class="info__txt primary__txt text-center">
              提醒：請將所有錯誤項目更正後，才可存檔上傳。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import notification from '@/plugins/info/infoNotification';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DataUploadTab from '@/components/shared/dataUpload/DataUploadTab.vue';
import DemoExcelList from '@/components/shared/dataUpload/DemoExcelList.vue';
import ProjectTip from '@/components/shared/dataUpload/ProjectTip.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import infoModal from '@/plugins/info/infoModal';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({
	components: {
		Breadcrumb, FblDataGrid, DataUploadTab, DemoExcelList, ProjectTip,
	},
})
export default class DataUpload extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

	@Prop()
  tabValue

	@Prop()
  uploadTip

	@Prop()
  uploadMsg

  tabUploadValue = 1; // 1:全部 2:錯誤

  uploadedFileList = []; // 上傳excel清單

  initTableDatas = []; // excel table 資料

	errorTableDatas = []; // 錯誤資料

  totalEle = '0'; // excel總比數

  file = null; // 暫存excel file

  allFileVaild = false; // 是否所有excel欄位皆正確

  uploadNo = null; // API回傳之excel ID

  defaultPagination = { // pagination預設值
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	};

  h = this.$createElement;

  apiConfig = { // 上傳excel格式
  	headers: {
  		'content-type': 'multipart/form-data;',
  	},
  };

	config = [
		{ sdkCheckName: 'checkEnrollmentDataUsingPOST', sdkUploadName: 'uploadEnrollUsingPOST', sdkCheckDetail: 'batchUploadDetailEnrollValidUsingPOST' },
		{ sdkCheckName: 'checkSurrenderDataUsingPOST', sdkUploadName: 'uploadSurrenderUsingPOST', sdkCheckDetail: 'batchUploadDetailSurrenderValidUsingPOST' },
		{ sdkCheckName: 'checkChangeSalaryDataUsingPOST', sdkUploadName: 'uploadSalaryChangeUsingPOST', sdkCheckDetail: 'batchUploadDetailChangeSalaryValidUsingPOST' },
		{ sdkCheckName: 'checkChangePlanDataUsingPOST', sdkUploadName: 'uploadPlanChangeUsingPOST', sdkCheckDetail: 'batchUploadDetailChangePlanValidUsingPOST' },
	]

	public grid = {
		rowKey: 'seq',
  	data: [
  	],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 1,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
		columns: [],
	};

	hidePagination = false;

  @Watch('tabUploadValue')
	onChange(val) {
  	if (val === 1) {
  		this.grid.data = this.initTableDatas;
			this.hidePagination = false;
  	} else {
  		this.grid.data = this.errorTableDatas;
			this.hidePagination = true;
  	}
	}

  checkErrorCol(data, key) {
  	let dataVal;
  	if (key === 'insBirthDate' || key === 'appOcDate') {
  		dataVal = DateTimeFormmat.transformRocDate(moment(data[key]).format('YYYY/MM/DD'));
  	} else {
  		dataVal = data[key];
  	}
  	return this.$createElement('div', {
  				attrs: {
  					class: data.errorColumn.includes(key) ? 'notice__txt' : '',
  				},
  			}, dataVal);
  }

  checkAllfileValid() {
  	this.$uploadApi[this.config[this.tabValue - 1].sdkCheckDetail](0, { batchUploadId: this.uploadNo, status: 'F' }, 1000)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.allFileVaild = resp.data.data.batchUploadDetailDtoPage.content.length === 0;
  				this.errorTableDatas = resp.data.data.batchUploadDetailDtoPage.content;
  				console.log('checkSuccess');
  			}
  			console.log(this.allFileVaild);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
  }

  beforeUpload(file) {
  	console.log(file.type);
  	const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
  	if (!isExcel) notification.error({ Content: '上傳格式錯誤，請上傳Excel檔案' });
  	return isExcel;
  }

  confirmUpload() {
  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
  	this.setLoading(true);
  	this.$uploadApi[this.config[this.tabValue - 1].sdkUploadName]({
  		policyNo: loginInfo.policyNo,
  		policySeq: loginInfo.policySeq,
  		times: policyDetail.times,
  		uploadNo: this.uploadNo,
  	})
  		.then((resp) => {
  			if (resp.status === 200) {
  				// 上傳成功
  				this.$router.push({ name: 'DataUploadSuccess' });
  			} else {
  				// 上傳失敗
  				this.$router.push({ name: 'DataUploadFail' });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  resetFile() {
  	this.uploadedFileList = [];
  	this.grid.data = [];
  	this.grid.pagination = this.defaultPagination;
  	console.log('clear');
  }

  uploadFlie(options) {
  	this.file = options.file;
  	this.resetFile();
  	console.log(options);
  	this.callAPI(options.file).then(() => {
  		console.log('checkAllfileValid');
  		this.checkAllfileValid();
  	});
  }

  callAPI(file) {
  	this.setLoading(true);
  	const policyDetail = this.$user.getPolicyDetail();
  	console.log(file);
  	return new Promise((resolve, reject) => {
  		this.$uploadApi[this.config[this.tabValue - 1].sdkCheckName](this.grid.pagination.current - 1, file, this.grid.pagination.pageSize, policyDetail.poliId.toString(), policyDetail.poliSeq, policyDetail.times, this.apiConfig)
  		.then((resp) => {
  				console.log(resp);
  			if (resp.data.status === 200) {
  				this.grid.pagination.total = parseInt(resp.data.data.batchUploadDetailDtoPage.totalElements);
  				this.totalEle = resp.data.data.batchUploadDetailDtoPage.totalElements;
  				this.initTableDatas = resp.data.data.batchUploadDetailDtoPage.content;
  				this.grid.data = this.initTableDatas;
  				this.uploadNo = resp.data.data.uploadNo;
  	      // this.checkAllfileValid();
  				resolve();
  			} else {
  					console.log(resp.data.apiError);
  				// this.modalVisible = true;
  				// this.errMsg = this.$global.getApiErrorMsg(resp.data.apiError).join('');
  					infoModal.alertForSingleError({ title: '哎呀，上傳錯誤！', content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	});
  }

  handleChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  	  // 1. Limit the number of uploaded files
  	  //    Only to show two recent uploaded files, and old ones will be replaced by the new
  		this.uploadedFileList = e.fileList.slice(-1);
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  		this.resetFile();
  	}
  }

  init() {
  	switch (this.tabValue) {
  	case 1:
  		this.grid.columns = [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'seq',
  			title: '序號',
  			width: '80px',
  			fixed: 'left',
  		},
  		{
  			type: FblColumnType.BADGE,
  			property: 'errorMsg',
  			title: '檢核狀態',
  			width: '100px',
  			fixed: 'left',
  			customRender: (data) => this.h('div', {
  			}, [
  				this.h('a-badge', {
  					attrs: { color: data.errorMsg.length > 0 ? 'red' : 'green', text: data.errorMsg.length > 0 ? '錯誤' : '正確' },
  				}, ''),
  					data.errorMsg.map((e, index) => (
  						this.h('p', {
  							attrs: { class: e.length > 0 ? 'notice__txt upload__error__txt' : '' },
  						}, `${index + 1}.${e}`)
  					)),
  			]),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '姓名',
  			width: '100px',
  			fixed: 'left',
  			customRender: (data) => this.checkErrorCol(data, 'insName'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insSex',
  			title: '性別',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'insSex'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insIdNo',
  			title: '身分證字號 居留證號碼',
  			width: '120px',
  			customRender: (data) => this.checkErrorCol(data, 'insIdNo'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtNo',
  			title: '保險證號',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'crtNo'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insBirthDate',
  			title: '出生日期',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'insBirthDate'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'attributeDesc',
  			title: '屬性',
  			width: '80px',
  			customRender: (data) => this.checkErrorCol(data, 'attributeDesc'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'nationality',
  			title: '國籍',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'nationality'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'appOcDate',
  			title: '受僱日期',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'appOcDate'),
  		},
  		// {
  		// 	type: FblColumnType.PLAIN,
  		// 	property: 'npDate',
  		// 	title: '生效日期',
  		// 	width: 100,
  		// 	customRender: (data) => this.checkErrorCol(data, 'npDate'),
  		// },
  		{
  			type: FblColumnType.PLAIN,
  			property: 'scIns',
  			title: '投保職保',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'scIns'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'scType',
  			title: '職保類別',
  			width: '100px',
  			customRender: (data) => this.checkErrorCol(data, 'scType'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'policyPlan',
  			title: '保險計劃',
  			width: '100px',
  			fixed: 'right',
  			customRender: (data) => this.checkErrorCol(data, 'policyPlan'),
  		},
  	];
  		break;

  	case 2:
  		this.grid.columns = [
  			{
  				title: '序號',
  				dataIndex: 'seq',
  				key: 'seq',
  				width: 80,
  			},
  			{
  				title: '檢核狀態',
  				dataIndex: 'errorMsg',
  				key: 'errorMsg',
  				width: 100,
  				customRender: (data, record, index, column) => this.h('div', {
  					// children: record.title,
  					attrs: {
  						rowSpan: 1,
  					},
  				}, [
  					this.h('a-badge', {
  						attrs: { color: record.errorMsg.length > 0 ? 'red' : 'green', text: record.errorMsg.length > 0 ? '錯誤' : '正確' },
  					}, ''),
  					record.errorMsg.map((e, index) => (
  						this.h('p', {
  							attrs: { class: e.length > 0 ? 'notice__txt upload__error__txt' : '' },
  						}, `${index + 1}.${e}`)
  					)),
  				]),
  			},
  			{
  				key: 'emp',
  				dataIndex: 'emp',
  				title: '員工資訊',
  				width: 100,
  				children: [
  					{
  						key: 'empName',
  						dataIndex: 'empName',
  						title: '姓名',
  						width: 120,
  					},
  					{
  						key: 'empIdNo',
  						dataIndex: 'empIdNo',
  						title: '身分證字號/居留證號碼',
  						width: 120,
  					},
  					{
  						key: 'crtNo',
  						dataIndex: 'crtNo',
  						title: '保險證號',
  						width: 120,
  					},
  				],
  			},
  			{
  				key: 'ins',
  				dataIndex: 'ins',
  				title: '退保人資訊',
  				width: 100,
  				children: [
  					{
  						key: 'attributeDesc',
  						dataIndex: 'attributeDesc',
  						title: '屬性',
  						width: 100,
  					},
  					{
  						key: 'insName',
  						dataIndex: 'insName',
  						title: '姓名',
  						width: 120,
  					},
  					{
  						key: 'insIdNo',
  						dataIndex: 'insIdNo',
  						title: '身分證字號/居留證號碼',
  						width: 120,
  					},
  					{
  						key: 'insSex',
  						dataIndex: 'insSex',
  						title: '性別',
  						width: 100,
  					},
  				],
  			},
  			{
  				key: 'appOcDate',
  				dataIndex: 'appOcDate',
  				title: '退保日期',
  				width: 100,
  				customRender: (data, record, index, column) => this.checkErrorCol(record, 'appOcDate'),
  			},
  		];

  		break;

  	case 3:
  		this.grid.columns = [
  			{
  				type: FblColumnType.PLAIN,
  				property: 'seq',
  				title: '序號',
  				width: '80px',
  				fixed: 'left',
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'errorMsg',
  				title: '檢核狀態',
  				width: '100px',
  				fixed: 'left',
  				customRender: (data) => this.h('div', {
  				}, [
  					this.h('a-badge', {
  						attrs: { color: data.errorMsg.length > 0 ? 'red' : 'green', text: data.errorMsg.length > 0 ? '錯誤' : '正確' },
  					}, ''),
  					data.errorMsg.map((e, index) => (
  						this.h('p', {
  							attrs: { class: e.length > 0 ? 'notice__txt upload__error__txt' : '' },
  						}, `${index + 1}.${e}`)
  					)),
  				]),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'insName',
  				title: '姓名',
  				width: '100px',
  				fixed: 'left',
  				customRender: (data) => this.checkErrorCol(data, 'insName'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'insIdNo',
  				title: '身分證字號 居留證號碼',
  				width: '120px',
  				customRender: (data) => this.checkErrorCol(data, 'insIdNo'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'crtNo',
  				title: '保險證號',
  				width: '100px',
  				customRender: (data) => this.checkErrorCol(data, 'crtNo'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'insSexDesc',
  				title: '性別',
  				width: '100px',
  				customRender: (data) => this.checkErrorCol(data, 'insSexDesc'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'salary',
  				title: '提報工資',
  				width: '120px',
  				customRender: (data) => this.checkErrorCol(data, 'salary'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'allowance',
  				title: '津貼',
  				width: '120px',
  				customRender: (data) => this.checkErrorCol(data, 'allowance'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'scInsAmt',
  				title: '職保薪資',
  				width: '100px',
  				customRender: (data) => this.checkErrorCol(data, 'scInsAmt'),
  			},
  			{
  				type: FblColumnType.PLAIN,
  				property: 'appOcDate',
  				title: '變更日期',
  				width: '100px',
  				customRender: (data) => this.checkErrorCol(data, 'appOcDate'),
  			},
  		];
  		break;

  	case 4:
  		this.grid.columns = [
  		{
  			key: 'seq',
  			dataIndex: 'seq',
  			title: '序號',
  			width: 80,
  		},
  		{
  			key: 'errorMsg',
  			dataIndex: 'errorMsg',
  			title: '檢核狀態',
  			width: 100,
  				customRender: (data, record, index, column) => this.h('div', {
  					// children: record.title,
  					attrs: {
  						rowSpan: 1,
  					},
  				}, [
  					this.h('a-badge', {
  						attrs: { color: record.errorMsg.length > 0 ? 'red' : 'green', text: record.errorMsg.length > 0 ? '錯誤' : '正確' },
  					}, ''),
  					record.errorMsg.map((e, index) => (
  						this.h('p', {
  							attrs: { class: e.length > 0 ? 'notice__txt upload__error__txt' : '' },
  						}, `${index + 1}.${e}`)
  					)),
  				]),
  		},
  		{
  			key: 'emp',
  			dataIndex: 'emp',
  			title: '員工資訊',
  			width: 100,
  			children: [
  				{
  					key: 'empName',
  					dataIndex: 'empName',
  					title: '姓名',
  					width: 120,
  					customRender: (data, record) => this.checkErrorCol(record, 'empName'),
  				},
  				{
  					key: 'empIdNo',
  					dataIndex: 'empIdNo',
  					title: '身分證字號/居留證號碼',
  					width: 120,
  					customRender: (data, record) => this.checkErrorCol(record, 'empIdNo'),
  				},
  				{
  					key: 'crtNo',
  					dataIndex: 'crtNo',
  					title: '保險證號',
  					width: 120,
  					customRender: (data, record) => this.checkErrorCol(record, 'crtNo'),
  				},
  			],
  		},
  		{
  			key: 'ins',
  			dataIndex: 'ins',
  			title: '投保人資訊',
  			width: 100,
  			children: [
          	{
  					key: 'attributeDesc',
  					dataIndex: 'attributeDesc',
  					title: '屬性',
  					width: 100,
  					customRender: (data, record) => this.checkErrorCol(record, 'attributeDesc'),
  				},
  				{
  					key: 'insName',
  					dataIndex: 'insName',
  					title: '姓名',
  					width: 120,
  					customRender: (data, record) => this.checkErrorCol(record, 'insName'),
  				},
  				{
  					key: 'insIdNo',
  					dataIndex: 'insIdNo',
  					title: '身分證字號/居留證號碼',
  					width: 120,
  					customRender: (data, record) => this.checkErrorCol(record, 'insIdNo'),
  				},
  				{
  					key: 'insSexDesc',
  					dataIndex: 'insSexDesc',
  					title: '性別',
  					width: 100,
  					customRender: (data, record) => this.checkErrorCol(record, 'insSexDesc'),
  				},
  			],
  		},
  		{
  			key: 'appOcDate',
  			dataIndex: 'appOcDate',
  			title: '變更日期',
  			width: 100,
  			customRender: (data, record) => this.checkErrorCol(record, 'appOcDate'),
  		},
  		{
  			key: 'policyPlan',
  			dataIndex: 'policyPlan',
  			title: '保險計畫',
  			width: 100,
  			fixed: 'right',
  			customRender: (data, record) => this.checkErrorCol(record, 'policyPlan'),
  		},
  	];
  		break;
  	default:
  		break;
  	}
  }

  created() {
  	this.init();
  }

  updated() {
  	window.parseWord();
  }

  onPageChange(e) {
  	this.tabUploadValue = 1;
  	this.grid.pagination = e.pagination;
  	this.callAPI(this.file);
  }
}
</script>

<style lang="scss" scoped>

.upload__error__txt {
  font-size: 12px;
}

.upload__wrap {
  padding-bottom: 50px;
  border-bottom: 1px #CECECE dashed;
  // margin-bottom: 70px;
}
// .uploader__wrap {
//   margin-top: 30px;
// }
.notice__txt {
	margin-bottom: 5px;
}
.tip__txt {
  margin: 20px 0 15px 0;
  font-size: 13px;
}
.img__people {
  margin-left: -40%;
  padding-top: 20%;
}
.upload__result__wrap {
  margin-top: 30px;
  padding-top: 30px;
  padding-bottom: 40px;
}
.upload__result-title {
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 30px;
}
.total__num {
  font-size: 18px;
}
.upload__result-table {
  margin-top: 38px;
}
.info__txt {
  margin-top: 30px;
}
::v-deep {
	.upload__result-table.hide-pagination {
		.ant-pagination {
			display: none;
		}
	}
  .confirm__modal {
    .ant-modal-title {
      font-size: 16px;
      padding-top: 3px;
      color: #000000;
    }
    .ant-modal-header {
      border: 0;
    }
    .ant-modal-body {
      padding: 5px 24px;
      color: #000000A6;
    }
  }
  .upload__table-span {
    th {
      border: 1px #ffffff solid;
    }
  }
  .ant-upload-text {
    font-size: 16px;
  }
  .ant-upload-hint {
    font-size: 14px;
    color: #0000006E;
  }
  .ant-upload-drag-icon {
    svg {
      width: 48px;
      height: 48px;
    }
  }
	.ant-radio-button-wrapper {
		padding: 0 22px;
	}
}
</style>
