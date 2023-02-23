<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="page__title">
        每期保費查詢
        <span class="float-end fw-normal">共 {{ grid.pagination.total }} 筆</span>
        <div class="mt-2 text-end">
          <a
            class="icon__btn"
            href="#"
            @click.prevent="downloadAllFile"
          >
            <img
              src="@/assets/button_download.svg"
              alt=""
            >
          </a>
        </div>
      </div>
      <fbl-data-grid
        class="query__table"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :custom-row="grid.customRow"
        :scroll="{ x: true }"
        @tableChange="onPageChange($event)"
      >
        <template
          slot="downloadFile"
          slot-scope="data"
        >
          <a
            v-if="data.data.fileTypeNos.length > 0"
            class="icon__btn"
            href="#"
            @click.prevent="downloadFile(data.data)"
          >
            <img
              src="@/assets/button_download.svg"
              alt=""
            >
          </a>
        </template>
      </fbl-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { FgprnpaDto, EveryPeriodPremiumToZipModel, EveryPeriodPremiumToExcelModel } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType, FblPageEvent } from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class PeriodSaveCostSearch extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public grid = {
  	rowKey: 'rcptNo',
  	data: null,
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'times',
  			title: '保單年度',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'period',
  			title: '期數',
  			width: '60px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'rcptNo',
  			title: '通知單號',
  			width: '80px',
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, `${data.rcptNo}`),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'mop',
  			title: '繳別',
  			width: '70px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'premAmt',
  			title: '當期保費(TWD)',
  			width: '150px',
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, new Intl.NumberFormat().format(data.premAmt)),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'calDate',
  			title: '繳費期限',
  			width: '90px',
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.calDate),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'paidDate',
  			title: '核帳日期',
  			width: '90px',
  			formatter: (data) => (data.paidDate ? DateTimeFormmat.transformRocDate(data.paidDate) : '-'),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'calDesc',
  			title: '繳費狀態',
  			width: '90px',
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

  // 下載某列檔案
  downloadFile(data) {
  	this.setLoading(true);
  	const query: EveryPeriodPremiumToZipModel = {
  		fileName: `每期保費查詢_${data.rcptNo}`,
  		period: data.period,
  		policyModel: {
  			policyNo: this.$userInfo.getPolicyModel().policyNo,
  			policySeq: this.$userInfo.getPolicyModel().policySeq,
  			times: data.times,
  		},
  	};
  	this.$everyPeriodPremiumApi.everyPeriodPremiumDownloadZipUsingPOST(query, { responseType: 'blob' })
  		.then((resp: any) => {
  			if (resp.headers['content-disposition']) {
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
						filename,
						resp.headers['content-type'],
  				);
  			} else {
  				this.$everyPeriodPremiumApi.everyPeriodPremiumDownloadZipUsingPOST(query).then((resp: any) => {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				  }).catch((error) => {
  					console.log(error);
  				}).finally(() => {
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

  // 下載所有檔案
  downloadAllFile() {
  	console.log('downloadAllFile');
  	this.setLoading(true);
  	const query: EveryPeriodPremiumToExcelModel = {
  		fileName: '每期保費查詢',
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
  	this.$everyPeriodPremiumApi.everyPeriodPremiumDownloadListUsingPOST(query, { responseType: 'blob' })
  		.then((resp: any) => {
  			if (resp.headers['content-disposition']) {
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
						decodeURIComponent(filename),
						resp.headers['content-type'],
  				);
  			} else {
  				this.$everyPeriodPremiumApi.everyPeriodPremiumDownloadListUsingPOST(query).then((resp: any) => {
  					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				  }).catch((error) => {
  					console.log(error);
  				}).finally(() => {
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

  getDatas() {
  	const data = this.$userInfo.getPolicyModel();
  	this.setLoading(true);
  	this.$everyPeriodPremiumApi.everyPeriodPremiumPageUsingPOST(this.grid.pagination.current - 1, data, this.grid.pagination.pageSize)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log(resp.data.data);
  				this.grid.data = resp.data.data.content;
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

  created() {
  	this.getDatas();
  }

  onPageChange(e) {
  	this.grid.pagination = e.pagination;
  	this.getDatas();
  }
}
</script>

<style lang="scss" scoped>
.page__title {
  margin-bottom: 10px;
}
::v-deep{
	.query__table {
		margin-bottom: 50px;
		tr {
			td:first-child, th:first-child{
				padding-left: 90px;
			}
		}
	}
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
</style>
