<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title text-center">
        您想查詢的保險費收據資料？
        <a-form-model
          :layout="'vertical'"
          class="text-center fw-normal"
        >
          <a-radio-group
            v-model="tabValue"
            class="query__tab"
            default-value="year"
            button-style="solid"
          >
            <a-radio-button :value="1">
              保單年度-本年度
            </a-radio-button>
            <a-radio-button :value="2">
              保單年度-上年度
            </a-radio-button>
          </a-radio-group>
        </a-form-model>
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        :custom-row="grid.customRow"
        :scroll="{ x: true }"
      >
        <template
          slot="downloadFile"
          slot-scope="data"
        >
          <a
            v-if="data.data.premAmt > 0 && data.data.download"
            class="icon__btn"
            href="#"
            @click.prevent="openModalPassword(data.data)"
          >
            <img
              src="@/assets/button_download.svg"
              alt=""
            >
          </a>
        </template>
      </fbl-data-grid>
      <p class="info__txt primary__txt text-center mb-5">
        下載檔案含有個人資料，請妥善利用
      </p>
    </div>
    <ModalPassword
      :visible="ModalPasswordVisible"
      :form="formPassword"
      :selected="selected"
      @submitPassword="downloadFile"
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
	PolicyModelWithYear,
	PolicyModelWithPeriodAndRcptNo,
} from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ModalPassword from '@/components/shared/form/ModalPassword.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid, ModalPassword } })
export default class SaveCostReceiptDownload extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public grid = {
  	rowKey: 'rcptNo',
  	data: null,
  	pagination: {
  		current: 1,
  		pageSize: 50,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'times',
  			title: '保單年度',
  			width: '60px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'period',
  			title: '期數',
  			width: '56px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'rcptNo',
  			title: '通知單號',
  			width: '56px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'mop',
  			title: '繳別',
  			width: '56px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'premAmt',
  			title: '當期保費',
  			width: '56px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'dueDate',
  			title: '繳費期限',
  			width: '90px',
  			formatter: (data) => (data.dueDate ? DateTimeFormmat.transformRocDate(data.dueDate) : ''),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'paidDate',
  			title: '核帳日期',
  			width: '90px',
  			formatter: (data) => (data.paidDate ? DateTimeFormmat.transformRocDate(data.paidDate) : ''),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'filePath',
  			title: '',
  			width: '30px',
  			template: 'downloadFile',
  		},
  	],
  };

  tabValue = 1; // 保單年度

  ModalPasswordVisible = false;

  formPassword = {
  	password: null,
  }

	selected = null;

	@Watch('tabValue')
	onYearChange() {
  	this.getDatas();
	}

	// 打開密碼驗證彈窗
	openModalPassword(data) {
  	this.formPassword.password = null;
  	this.ModalPasswordVisible = true;
		this.selected = data;
	}

	closePasswordModal() {
  	this.ModalPasswordVisible = false;
	}

	// 下載某列檔案
	downloadFile(data) {
		this.setLoading(true);
  	console.log(data);
		this.closePasswordModal();
		const userInfo = this.$userInfo.getPolicyModel();
		const input: PolicyModelWithPeriodAndRcptNo = {
			period: data.period,
			policyNo: userInfo.policyNo,
			policySeq: userInfo.policySeq,
			times: data.times,
			rcptNo: data.rcptNo,
		};
		this.$rePrintDownloadApi.downloadInsurReceiptUsingPOST(input, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				const disposition = resp.headers['content-disposition'];
  				if (disposition && disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
            resp.data as Blob,
            `${filename}.pdf`,
            resp.headers['content-type'],
  				);
					this.setLoading(false);
  			} else {
  				this.$rePrintDownloadApi.downloadInsurReceiptUsingPOST(input)
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
  		.finally(() => {
				this.setLoading(false);
			});
	}

	getDatas() {
  	const userInfo = this.$userInfo.getPolicyModel();
  	const data: PolicyModelWithYear = {
  		policyNo: userInfo.policyNo,
  		policySeq: userInfo.policySeq,
  		times: userInfo.times,
  		year: this.tabValue.toString(),
  	};
  	this.setLoading(true);
  	this.$rePrintDownloadApi.queryForInsurPaymentReceiptUsingPOST(data)
  		.then((resp) => {
  			console.log(resp.data.data);
  			this.grid.data = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	created() {
  	this.getDatas();
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
.query__total {
  margin-top: -30px;
}
::v-deep{
	.query__table {
		tr {
			td:first-child, th:first-child{
				padding-left: 90px;
			}
		}
	}
}
</style>
