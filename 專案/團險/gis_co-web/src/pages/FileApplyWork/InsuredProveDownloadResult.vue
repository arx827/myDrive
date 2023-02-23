<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title">
        選擇下載項目
        <span class="float-end fw-normal">共 {{ grid.pagination.total }} 筆</span>
      </div>
      <div class="text-center">
        <p
          id="info"
          class="info__txt primary__txt fw-bold mx-auto"
        >
          ＊欲下載英文版，請先填入完整護照英文姓名
        </p>
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
      >
        <template
          slot="insEnglishName"
          slot-scope="data"
        >
          <a-input
            v-model="data.data.insEnglishName"
            placeholder="e.g. Show-ming Lee"
            class="insNameEN__input"
          />
        </template>
      </fbl-data-grid>
      <div class="block__btns text-center mb-5">
        <button
          class="btn__radius--primary--outline"
          @click="back"
        >
          上一步
        </button>
        <router-link
          :to="'/fileApplyWork/saveCardDownload'"
        >
          <button
            v-if="grid.pagination.total!==0"
            class="btn__radius--primary--outline me-1"
            @click.prevent="downloadFile(1)"
          >
            下載英文版
          </button>
        </router-link>
        <button
          v-if="grid.pagination.total!==0"
          class="ms-1 btn__radius--primary"
          type="primary"
          @click.prevent="downloadFile(2)"
        >
          下載中文版
        </button>
      </div>
    </div>
    <ModalPassword
      :visible="ModalPasswordVisible"
      :form="formPassword"
      :selected="selected"
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
	InsuredProveDownloadQueryResultDto,
	InsuredProveContent,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ModalPassword from '@/components/shared/form/ModalPassword.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import modal from '@/plugins/info/infoModal';

@Component({ components: { Breadcrumb, FblDataGrid, ModalPassword } })
export default class InsuredProveDownloadResult extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public grid: FblPDataGridHolder<InsuredProveDownloadQueryResultDto> = {
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
  			property: 'crtNoMask',
  			title: '保險證號',
  			width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insChineseName',
  			title: '被保人姓名(中文)',
  			width: '176px',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'insEnglishName',
  			title: '被保人姓名(護照上英文全名)',
  			width: '254px',
  			template: 'insEnglishName',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insId',
  			title: '身分證字號/居留證號碼',
  			width: '165px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'atribut',
  			title: '屬性',
  			width: '60px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'birthDay',
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

	selectedRowKeyAll = []; // 勾選列的index

	ModalPasswordVisible = false;

  formPassword = {
  	password: null,
  }

  selected = null;

	downloadType = null; // 1: 中文, 2:英文

	// 判斷哪幾列被勾選
	get rowSelection() {
  	return {
  		onChange: (selectedRowKeys, selectedRows) => {
  			// console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  			this.selectedRowKeyAll = selectedRowKeys;
  			this.selectedRowAll = selectedRows;
  		},
  		getCheckboxProps: (record) => ({
  			props: {
  				disabled: record.name === 'Disabled User', // Column configuration not to be checked
  				name: record.name,
  			},
  		}),
  	};
	}

	back() {
		this.$router.push({ name: 'CO_InsuredProveDownload' });
	}

	checkAuth() {
  	// 確認是否為一級權限
  	const authList = this.$user.getMe().authNameList;
  	return !!authList.includes('一級權限');
	}

	// 打開密碼驗證彈窗
	openModalPassword() {
  	this.formPassword.password = null;
  	this.ModalPasswordVisible = true;
  	this.selected = this.selectedRowAll;
	}

	closePasswordModal() {
  	this.ModalPasswordVisible = false;
	}

	created() {
  	this.getData();
	}

	async getData() {
  	const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	const query = JSON.parse(decryptString);

  	this.setLoading(true);
  	// 投保證明下載-查詢結果
  	this.$rePrintDownloadApi.queryForInsuredproveUsingPOST(query, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data.content;
  				for (let i = 0; i < this.grid.data.length; i++) {
  					this.grid.data[i].npDate = i.toString();
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

	isOK = true; // 確定有勾選及下載英文版時有填寫英文名

	query = []; // 要餵API的資料

	// 按下下載按鈕
	downloadFile(type) {
		this.downloadType = type;
  	const loginInfo = this.$user.getMe();
  	const data: InsuredProveContent = {
			authority: this.checkAuth() ? 'Y' : 'N',
  		crtNo: '',
  		crtSeq: '',
			jnDate: '',
  		policyModel: this.$userInfo.getPolicyModel(),
			userId: loginInfo.userId,
			version: 'C',
  	};

		this.query = [];

  	// document.getElementById('info').classList.remove('info__txt--red');
		// for (let i = 0; i < this.grid.data.length; i++) {
  	// 	document.querySelectorAll('.insNameEN__input')[i].classList.remove('input--required');
		// }
		this.isOK = true;
		let key;
		if (this.downloadType == 1) { // 下載英文版時
			this.downloadFileEN();
		}

		for (let i = 0; i < this.selectedRowAll.length; i++) {
			if (this.downloadType == 1) {
				key = 'englishName';
				data[key] = this.selectedRowAll[i].insEnglishName;
				data.version = 'E';
			}
			data.crtNo = this.selectedRowAll[i].crtNo;
			data.crtSeq = this.selectedRowAll[i].crtSeq;
			data.jnDate = this.selectedRowAll[i].jnDate;
			this.query[i] = { ...data };
		}
		console.log(this.query);

		if (this.isOK) {
			if (this.selectedRowAll.length) {
				this.openModalPassword();
			} else {
				this.isOK = false;
				modal.alertForSingleError({
					title: '提示',
					content: '無勾選任何需下載資料',
				});
			}
		}
	}

	// 下載英文版
	downloadFileEN() {
		const data = [];
  	// document.getElementById('info').classList.remove('info__txt--red');
  	for (let i = 0; i < this.grid.data.length; i++) {
  		// document.querySelectorAll('.insNameEN__input')[i].classList.remove('input--required');
			for (let j = 0; j < this.selectedRowKeyAll.length; j++) {
				if (this.grid.data[i].npDate === this.selectedRowKeyAll[j]) {
					if (this.grid.data[i].insEnglishName) {
						const rgx = /^[A-Za-z0-9~\!@#\u0020\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]{1,100}$/;
						if (rgx.test(this.grid.data[i].insEnglishName)) {
							data[i] = { ...this.selectedRowAll[j] };
						} else {
							this.isOK = false;
							modal.alertForSingleError({
								title: '提示',
								content: '被保人姓名(護照上英文全名)僅能填入半形英數與符號',
							});
						}
					} else {
						this.isOK = false;
						modal.alertForSingleError({
							title: '提示',
							content: '欲下載英文版，請先填入完整護照英文姓名',
						});
						// document.getElementById('info').classList.add('info__txt--red');
						// document.querySelectorAll('.insNameEN__input')[i].classList.add('input--required');
					}
				}
			}
  	}
		console.log(data);
	}

	// 輸入完密碼確認框後下載
	download() {
		let fileName: string;
		if (this.query.length <= 1) {
			fileName = '.pdf';
		} else {
			fileName = '.zip';
		}

		if (this.isOK) {
			this.closePasswordModal();
			this.setLoading(true);
			// 投保證明下載-中文_英文版-PDF
			this.$rePrintDownloadApi.insuredproveDownLoadPdfCUsingPOST(this.query, { responseType: 'blob' })
				.then((resp) => {
					console.log(resp);
					// if (resp.status === 200) {
					// 	this.$blobUtils.download(
					// 		resp.data as Blob,
					// 		`投保證明_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}${fileName}`,
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
							`投保證明_${Number.parseInt(moment().format('YYYY')) - 1911}${moment().format('MMDD')}${fileName}`,
						);
						this.setLoading(false);
					} else {
						this.$rePrintDownloadApi.insuredproveDownLoadPdfCUsingPOST(this.query).then((resp) => {
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
.info__txt {
	width: 536px;
	background: #F2F8FF;
	border-radius: 4px;
	padding: 7px 138px;
	&--red {
		background-color: #FFEBEB;
		color: #ED7D7D;
	}
}
.ant-form-item {
	margin-bottom: 0;
	padding-bottom: 0;
}
.input--required {
	border: 1px solid #ED8282;
}
::v-deep .ant-table-thead > tr > th[key="0"] {
  padding: 0;
}
::v-deep .ant-table-tbody > tr > td:nth-child(2) {
  padding: 0;
}
</style>
