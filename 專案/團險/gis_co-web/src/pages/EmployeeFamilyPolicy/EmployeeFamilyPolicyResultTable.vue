<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <h2 class="query__title">
          <span>查詢結果</span>
          <span class="query__total">共 {{ employeeGrid.pagination.total }} 筆</span>
          <div class="clearfix" />
        </h2>
        <div class="query__table-wrap">
          <div class="query__search-wrap">
            <a
              class="icon__btn"
              href="#"
              :disabled="isDownloading"
              @click.prevent="downloadFile"
            >
              <img
                src="@/assets/button_download.svg"
                alt=""
              >
            </a>
          </div>
          <div class="clearfix" />
        </div>
        <!-- :class="{'noAuthCheck': hasAuth === 'N'}" -->
        <fbl-data-grid
          class="query__table"
          :row-key="employeeGrid.rowKey"
          :columns="employeeGrid.columns"
          :data="employeeGrid.data"
          :pagination="employeeGrid.pagination"
          :custom-row="employeeGrid.customRow"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
          @rowClick="onRowClick"
        >
          <template
            slot="arrowAction"
            slot-scope="data"
          >
            <a-icon
              v-if="!data.data.npDate"
              type="right"
            />
          </template>
        </fbl-data-grid>
        <div class="col-12 pt-5">
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import { FGPEMPNDto, EmpPolicyContentDto } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class EmployeeFamilyPolicyResultTable extends Vue {
  @Prop()
  breadcrumb: {}

	@Action('setLoading') setLoading;

  public employeeGrid: FblPDataGridHolder<FGPEMPNDto> = {
  	rowKey: 'insId',
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
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insName',
  			title: '被保險人姓名',
  			width: '120px',
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, `${data.insName}`),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'insId',
  			title: '身分證字號/居留證號碼',
  			width: '185px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'atribut',
  			title: '屬性',
  			width: '80px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtNo',
  			title: '保險證號(員工編號)',
  			width: '160px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'birthDate',
  			title: '出生日期',
  			width: '100px',
  			formatter: (data) => DateTimeFormmat.transformRocDate(data.birthDate),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'jnDate',
  			title: '加保日期',
  			width: '100px',
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, DateTimeFormmat.transformRocDate(data.jnDate)),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'npDate',
  			title: '退保日期',
  			width: '140px',
  			customRender: (data) => this.$createElement('div', {
  				attrs: {
  					class: 'fw-bold',
  				},
  			}, data.npDate !== null ? DateTimeFormmat.transformRocDate(data.npDate) : '--'),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'arrowAction',
  			title: '',
  			width: '39px',
  			template: 'arrowAction',
  		},
  	],
  };

	hasAuth = '';

	pageQuery = null;

	isDownloading = false;

	checkAuth() {
  	// 一級權限人員才能查看detail頁面
  	const authList = this.$user.getMe().authNameList;
		console.log(authList);
  	return authList.includes('一級權限') ? 'Y' : 'N';
	}

	back() {
		this.$router.push({ name: 'CO_EFPolicyQuery' });
	}

	created() {
		if (this.$global.getParam() === null) {
			notification.error({
				Content: '無查詢條件，請重新查詢',
				onCallback: () => {
					this.$router.push({ path: '/' }).catch((err) => { err; });
				},
			});
			return;
		}
		if (this.$global.getParam().query.pagination) {
			this.employeeGrid.pagination = this.$global.getParam().query.pagination;
		}
		this.onSearch();
	}

	onSearch() {
		this.setLoading(true);
  	this.pageQuery = this.$global.getParam().query.pageQuery;
		// this.hasAuth = this.checkAuth();
		this.$employeeFamilyPolicyApi
  		.listPolicyByQueryModelUsingPOST(this.employeeGrid.pagination.current - 1, this.employeeGrid.pagination.pageSize, this.pageQuery)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.employeeGrid.data = resp.data.data.content.map((obj) => {
  					obj.jnDate = moment(obj.jnDate).format('YYYY/MM/DD');
  					obj.npDate = obj.npDate !== null ? moment(obj.npDate).format('YYYY/MM/DD') : null;
  					return obj;
  				});
  				this.employeeGrid.pagination.total = parseInt(resp.data.data.totalElements);
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	downloadFile() {
		this.isDownloading = true;
		this.$employeeFamilyPolicyApi.downloadPolicyListUsingPOST('', this.pageQuery, { responseType: 'blob' })
			.then((resp) => {
  			console.log(resp);
				if (resp.headers['content-disposition']) {
					this.$blobUtils.download(
						resp.data as Blob,
						'員眷資料查詢結果.xlsx',
					);
				} else {
					this.$employeeFamilyPolicyApi.downloadPolicyListUsingPOST('', this.pageQuery)
						.then((resp) => {
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

	checkIfTopAuth() {
  	// 一級權限人員才能查看detail
  	const authList = this.$user.getMe().authNameList;
  	console.log(authList);
  	return authList.includes('一級權限') ? 'Y' : 'N';
	}

	onRowClick(row) {
  	// router to detail page
		console.log(row.data);
		this.setLoading(true);
  	// if (this.hasAuth === 'N' || row.data.npDate) return;
  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
		const data: EmpPolicyContentDto = {
  		authority: this.checkIfTopAuth(), // 一級權限給Y
  		crtNo: row.data.crtNoForInput,
  		crtSeq: row.data.crtSeq,
  		userId: loginInfo.userId,
  		policyModel: {
  			policyNo: policyDetail.poliId.toString(),
  			policySeq: policyDetail.poliSeq,
  			times: row.data.times,
  		},
  	};
		this.$employeeFamilyPolicyApi.onePolicyContentUsingPOST(data)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
					this.$global.changeRouterAndaddParam({
						toRouter: '/EmployeeFamilyPolicyResultDetail',
						query: {
							crtNo: row.data.crtNoForInput,
							crtSeq: row.data.crtSeq,
							times: row.data.times,
							pageQuery: this.$global.getParam().query.pageQuery,
							pagination: this.employeeGrid.pagination,
  					},
  				});
  			} else {
					notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	onPageChange(e) {
		this.employeeGrid.pagination = e.pagination;
		// 儲存當前頁碼
		this.$global.changeRouterAndaddParam({
  		toRouter: 'self',
			query: {
				pageQuery: this.$global.getParam().query.pageQuery,
				pagination: e.pagination,
			},
  	});
  	this.onSearch();
	}

	updated() {
  	window.parseWord();
	}
}
</script>

<style lang="scss" scoped>
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    padding-bottom: 80px;
  }
  .input__search {
    max-width: 160px;
  }
  .query__search-wrap {
    float: right;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  ::v-deep {
    .query__table {
      tr {
        cursor: pointer;
        td:first-child, th:first-child {
          padding-left: 38px;
        }
      }
			&.noAuthCheck {
				tr {
					cursor: auto;
					.anticon-right {
						display: none;
					}
				}
			}
    }
    .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
  }
</style>
