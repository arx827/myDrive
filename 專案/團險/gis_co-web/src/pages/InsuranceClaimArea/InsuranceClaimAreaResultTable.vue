<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <div class="query__header">
          <h2 class="query__title">
            查詢結果
          </h2>
          <span class="query__total">共 {{ grid.pagination.total }}筆</span>
        </div>
        <div class="query__table-wrap">
          <div class="query__search-wrap">
            <a
              class="icon__btn"
              href="#"
              :disabled="isDownloading"
              @click.prevent="downloadAllFile"
            >
              <img
                src="@/assets/button_download.svg"
                alt=""
              >
            </a>
          </div>
          <div class="clearfix" />
          <div class="query__totalPaid">
            給付金額加總(TWD)：<span>${{ totalPaid.toLocaleString() }}元</span>
          </div>
        </div>
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template
            slot="fileName"
            slot-scope="data"
          >
            <div class="col_fileDonwload">
              <a
                v-if="data.data.fileName.length!==0"
                class="icon__btn"
                href="#"
                :disabled="isDownloading"
                @click.prevent="downloadFile(data.data)"
              >
                <img
                  src="@/assets/button_download.svg"
                  alt=""
                >
              </a>
            </div>
          </template>
        </fbl-data-grid>
        <div
          class="col-12 pt-5"
        >
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary--outline"
              @click="back"
            >
              上一步
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	UserInfoDto,
	RecordAndProgressDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import modal from '@/plugins/info/infoModal';
import EmployeeFamilyPolicyChangeWithoutSalaryDetail from '@/pages/EmpFamilyPolicyChangeWithoutSalary/EmpFamilyPolicyChangeWithoutSalaryDetail.vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
	FblPageEvent,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid, EmployeeFamilyPolicyChangeWithoutSalaryDetail } })
export default class InsuranceClaimAreaResultTable extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  //  當前登入者資料
  currentLoginData: UserInfoDto;

	totalPaid: number = 0

	public grid: FblPDataGridHolder<RecordAndProgressDto> = {
  	rowKey: 'rgstNo',
 		data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['5', '10', '50'],
  		showQuickJumper: true,
  		showSizeChanger: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'rgstNo',
  			title: '受理號碼',
				width: '140px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'accidName',
  			title: '事故人姓名',
				width: '120px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'relDesc',
  			title: '屬性',
				width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'empName',
  			title: '員工姓名',
				width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'rctNo',
  			title: '保險證號',
				width: '100px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'acptDate',
  			title: '受理日',
				width: '100px',
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.acptDate),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'acdnDate',
  			title: '事故日',
				width: '100px',
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.acdnDate),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'closeDate',
  			title: '結案日',
				width: '100px',
  			formatter: (data) => (data.closeDate === null ? '-' : DateTimeFormmat.transformRocDate(data.closeDate)),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'paidAmt',
  			title: '給付淨額',
				width: '100px',
	  		// formatter: (data) => this.autoAddComdify(data.paidAmt),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'caseSts',
  			title: '案件狀態',
				width: '120px',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '給付明細',
				width: '100px',
	  		template: 'fileName',
  		},
  	],
	};

	pageQuery = null;

	isDownloading = false;

	async created() {
		if (sessionStorage.getItem('login_state')) {
			this.currentLoginData = JSON.parse(sessionStorage.getItem('login_state')).me;
			// console.log('this.currentLoginData', this.currentLoginData);
		}
		this.getData();
	}

	back() {
		this.$router.push({ name: 'CO_ICQuery' });
	}

	getData() {
		// for (let i = 0; i < 20; i++) {
		// 	const index = `TC1231232${i}`;
		// 	this.fakeData = {
		// 		...this.fakeData,
		// 		rgstNo: index,
		// 	};
		// 	this.fakeDataList.push(this.fakeData);
		// }

		// this.fakeDataList.forEach((item) => {
		// 	this.totalPaid = item.paidAmt + this.totalPaid;
		// });
		// this.grid.data = this.fakeDataList;

		this.pageQuery = this.$global.getParam().query;
		this.setLoading(true);
		// 查詢理賠紀錄與進度
		this.$insuranceClaimAreaApi.getRecordAndProgressUsingPOST(this.pageQuery, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
			.then((resp) => {
				if (resp.data.status === 200) {
					console.log(this.pageQuery);
					this.grid.data = resp.data.data.content;
					this.totalPaid = 0;
					this.grid.data.forEach((item) => {
						this.totalPaid += item.paidAmt;
					});
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

	  autoAddComdify(val) {
	  	if (!val) return val;
	  	// const str = val.split('.');
	  	const rgx = /(\d)(?=(?:\d{3})+$)/g;
	  	const c = val.toString().replace(rgx, '$1,');
	  	// const c = val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	  	return c;
	  }

	  updated() {
	  	window.parseWord();
	  }

	downloadAllFile() {
		this.isDownloading = true;
		this.setLoading(true);
		// 下載查詢理賠紀錄與進度資料(excel)
		this.$insuranceClaimAreaApi.downloadRecordAndProgressListUsingPOST(this.pageQuery, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
  			let filename = '';
				if (disposition) {
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
					this.$insuranceClaimAreaApi.downloadRecordAndProgressListUsingPOST(this.pageQuery)
						.then((resp) => {
							console.log(resp);
							const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
						}).catch((err) => {
  						console.log(err);
  					}).finally();
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
				this.setLoading(false);
  			this.isDownloading = false;
  		});
	}

	downloadFile(data) {
		this.isDownloading = true;
		const encryptQuery = this.$encryptionDecryption.encrypt(JSON.stringify(data)).toString();
		// 下載給付明細
		this.$insuranceClaimAreaApi.oneFileDownloadUsingPOST(data.paidDetail, data.fileName, { responseType: 'blob' })
			.then((resp) => {
				const disposition = resp.headers['content-disposition'];
				if (disposition) {
					this.$blobUtils.download(
						resp.data as Blob,
						`${data.fileName}.pdf`,
					);
				} else {
					this.$insuranceClaimAreaApi.oneFileDownloadUsingPOST(data.paidDetail, data.fileName)
						.then((resp) => {
							console.log(resp);
							const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
						}).catch((err) => {
  						console.log(err);
  					}).finally();
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isDownloading = false;
  		});
	}
}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0;
	}
	.query__header{
  	width: 100%;
  	display: flex;
  	justify-content: space-between;
  	align-items: center;
  	.query__title{
    	margin-bottom: 0px;
  	}
  	.icon__btn{
    	width: 33px;
    	height: 33px;
  	}
	}
	.query__table-wrap{
		margin-top:14px;
		margin-bottom: 22px;
	}
	.query__totalPaid{
		background-color: $COLOR-MAIN4;
		padding: 11px 16px;
		font-size: 20px;
		margin-top: 15px;
		span{
			font-size: 20px;
			font-weight: bold;
		}
	}
	.query__search-wrap {
		display: flex;
		float:right;
	}
	.query__table{
		margin-top:15px;
		span{
		font-size: 14px;
	}
	}
	.col_fileDonwload{
		display: flex;
		justify-content: center;
	}
	::v-deep{
		thead tr th span,tbody tr td span{
      font-size: 14px;
    }
	}
</style>
