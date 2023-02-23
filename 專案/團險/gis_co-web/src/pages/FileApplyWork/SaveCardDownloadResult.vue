<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title">
        查詢結果
        <span class="float-end">共 {{ grid.pagination.total }} 筆</span>
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :row-selection="rowSelection"
        :data="grid.data"
        :pagination="grid.pagination"
        :custom-row="grid.customRow"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      />
      <div class="block__btns text-center mb-5">
        <router-link
          :to="'/fileApplyWork/saveCardDownload'"
        >
          <button
            class="btn__radius--primary--outline me-1"
          >
            上一步
          </button>
        </router-link>
        <button
          v-if="grid.pagination.total!==0"
          class="ms-1 btn__radius--primary"
          type="primary"
          @click.prevent="downloadFile"
        >
          下載
        </button>
      </div>
    </div>
    <ModalPassword
      :visible="ModalPasswordVisible"
      :form="formPassword"
      @submitPassword="download"
      @closeModal="closePasswordModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	InsuredCardDownloadPdfDto,
	InsuredCardDownloadQueryResultDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ModalPassword from '@/components/shared/form/ModalPassword.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPageEvent,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import modal from '@/plugins/info/infoModal';

@Component({ components: { Breadcrumb, FblDataGrid, ModalPassword } })
export default class SaveCardDownloadResult extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public grid: FblPDataGridHolder<InsuredCardDownloadQueryResultDto> = {
  	rowKey: 'npDate',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 50,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'npDate',
  			title: '',
  			width: '0px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtNo',
  			title: '保險證號',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '被保人姓名(中文)',
  			width: '300px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insId',
  			title: '身分證字號/居留證號碼',
  			width: '160px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'atribut',
  			title: '屬性',
  			width: '60px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'birthDate',
  			title: '生日',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'sex',
  			title: '性別',
  			width: '60px',
  		},
  	],
  };

	selectedRowAll = []; // 勾選列的資料

  ModalPasswordVisible = false;

  formPassword = {
  	password: null,
  }

	query = []; // 要餵API的資料

	// 判斷哪幾列被勾選
	get rowSelection() {
  	return {
  		onChange: (selectedRowKeys, selectedRows) => {
  			console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  			this.selectedRowAll = selectedRows;
  		},
  		getCheckboxProps: (record) => ({
  			props: {
  				disabled: record.name === 'Disabled User',
  				name: record.name,
  			},
  		}),
  	};
	}

	created() {
  	this.getData();
	}

	// 打開密碼驗證彈窗
	openModalPassword() {
  	this.formPassword.password = null;
  	this.ModalPasswordVisible = true;
	}

	closePasswordModal() {
  	this.ModalPasswordVisible = false;
	}

	async getData() {
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);

  	this.setLoading(true);
  	// 保險證下載-查詢結果
  	this.$rePrintDownloadApi.insCardQueryUsingPOST(query, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data.content;
  				for (let i = 0; i < this.grid.data.length; i++) {
  					this.grid.data[i].npDate = i;
  				}
  				this.grid.pagination.total = parseInt(resp.data.data.totalElements);
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
	}

	onPageChange(e: FblPageEvent) {
  	this.grid.pagination = e.pagination;
  	this.getData();
	}

	// 按下下載按鈕
	downloadFile() {
  	const policyDetail = this.$user.getPolicyDetail();
  	const data: InsuredCardDownloadPdfDto = {
  		crtNo: '',
  		crtSeq: '',
			insId: '',
  		policyNo: policyDetail.poliId,
  		policySeq: policyDetail.poliSeq,
  		times: policyDetail.times,
  	};
		console.log(this.selectedRowAll);
		this.query = [];
  	for (let i = 0; i < this.selectedRowAll.length; i++) {
  		data.crtNo = this.selectedRowAll[i].crtNoOrigin;
  		data.crtSeq = this.selectedRowAll[i].crtSeq;
			data.insId = this.selectedRowAll[i].insIdOrigin;
  		this.query[i] = { ...data };
			// this.query.push(data);
  	}
  	console.log(this.query);

  	if (this.selectedRowAll.length) {
  		this.openModalPassword();
  	} else {
  		modal.alertForSingleError({
				title: '提示',
  			content: '無勾選任何需下載資料',
  		});
  	}
	}

	// 輸入完密碼確認框後下載
	download() {
  	this.closePasswordModal();

  	let fileName: string;
  	if (this.query.length <= 1) {
  		fileName = '.pdf';
  	} else {
  		fileName = '.zip';
  	}

  	this.setLoading(true);
  	// 保險證下載-下載pdf
  	this.$rePrintDownloadApi.insCardDownloadPdfUsingPOST(this.query, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(resp);
  			// if (resp.status === 200) {
  			// 	this.$blobUtils.download(
  			// 		resp.data as Blob,
  			// 		`保險證_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}${fileName}`,
  			// 	);
  			// } else {
  			// 	notification.error({
  			// 		Content: '系統忙碌中，請稍後再試',
  			// 	});
  			// }
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				this.$blobUtils.download(
						resp.data as Blob,
						`保險證_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}${fileName}`,
  				);
  				this.setLoading(false);
  			} else {
  				this.$rePrintDownloadApi.insCardDownloadPdfUsingPOST(this.query)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			this.setLoading(false);
  		})
  		.finally();
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
  margin-bottom: 20px;
}
.query__tab {
  width: 100%;
  margin-top: 12px;
  .ant-radio-button-wrapper {
    width: 176px;
    text-align: center;
  }
}
::v-deep .ant-table-thead > tr > th[key="0"] {
  padding: 0;
}
::v-deep .ant-table-tbody > tr > td:nth-child(2) {
  padding: 0;
}
</style>
