<template>
  <div class="insuranceClaimArea">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <div class="query__header">
          <h2 class="query__title">
            本年度保單理賠經驗
          </h2>
          <a
            class="icon__btn"
            href="#"
            @click="clickDownload"
          >
            <img
              src="@/assets/button_download.svg"
              alt=""
            >
          </a>
        </div>
        <div class="row table__header">
          <div class="col-5 col">
            要保單位
          </div>
          <div class="col-2 col">
            保單號碼
          </div>
          <div class="col-4 col">
            要保單位
          </div>
          <div class="col-1 col">
            保單狀態
          </div>
        </div>
        <div class="row table__header">
          <div class="col-5 col">
            {{ claimExperienceData.unitName }}
          </div>
          <div class="col-2 col">
            {{ claimExperienceData.poliNum }}
          </div>
          <div class="col-4 col">
            {{ claimExperienceData.insurancePeriod }}
          </div>
          <div class="col-1 col">
            {{ claimExperienceData.poliStatus }}
          </div>
        </div>
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :scroll="{ x: true }"
          :custom-row="grid.customRow"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	ClaimExperienceDto, PoliDetail, UserInfoDto, PolicyModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { repeat } from 'rxjs/operators';
import notification from '@/plugins/info/infoNotification';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class InsuranceClaimAreaExperience extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

	h = this.$createElement;

  //  當前登入者資料
  currentLoginData: UserInfoDto;

  policyModel: PolicyModel;

  claimExperienceData: ClaimExperienceDto={};

	public grid: FblPDataGridHolder<PoliDetail> = {
		rowKey: 'insItem',
 		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['10', '25', '50'],
			showQuickJumper: false,
			showSizeChanger: false,
		},
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'insItem',
				title: '險種',
				width: '40%',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'paidAmt',
				title: '保險年度期間給付金額 (1)',
				width: '22%',
				formatter: (data) => (data.paidAmt ? `${this.autoAddComdify(data.paidAmt)} 元` : '- -'),
				// width: 222,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'checkedAmt',
				title: '保險年度核帳保費 (2)',
				width: '20%',
				formatter: (data) => (data.checkedAmt ? `${this.autoAddComdify(data.checkedAmt)} 元` : '- -'),
				// width: 168,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'rate',
				title: '理賠率  (1)/(2)',
				width: '18%',
				formatter: (data) => (data.rate ? `${data.rate}%` : '- -'),
			},
		],
	};

	created() {
		if (sessionStorage.getItem('login_state')) {
			this.currentLoginData = JSON.parse(sessionStorage.getItem('login_state')).me;
			// console.log('this.currentLoginData', this.currentLoginData);
		}
		this.policyModel = this.$userInfo.getPolicyModel();
		this.setLoading(true);
		this.getData();
	}

	getData() {
		this.$insuranceClaimAreaApi.getClaimsExperienceListUsingPOST(this.policyModel).then((resp) => {
			if (resp.status === 200) {
				console.log(resp);
				this.grid.data = resp.data.data.poliDetails;
				this.grid.data.push(
					{
						checkedAmt: resp.data.data.totalCheckedAmt,
						insItem: '合計',
						paidAmt: resp.data.data.totalPaidAmt,
						rate: resp.data.data.totalRate,
					},
				);
				this.claimExperienceData = {
					...resp.data.data,
				};
			} else {
				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
			}
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			this.setLoading(false);
		});
	}

	clickDownload() {
		this.setLoading(true);
		if (this.grid.data.length < 1) {
			notification.error({
				Content: '無可下載資料',
			});
			this.setLoading(false);
		} else {
			this.$insuranceClaimAreaApi.downloadClaimsExperienceListUsingPOST(this.policyModel, { responseType: 'blob' }).then((resp) => {
				console.log(resp);
				const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						const fileNameWithType = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  						this.$blobUtils.download(
								resp.data as Blob,
								fileNameWithType,
  						);
  					}
  				}
				} else {
					this.$insuranceClaimAreaApi.downloadClaimsExperienceListUsingPOST(this.policyModel).then((resp) => {
				    const respData = JSON.stringify(resp);
						const apiErrorMsg = JSON.parse(respData).data.apiError;
						notification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
				  }).catch((error) => {
						console.log(error);
					}).finally(() => {
						this.setLoading(false);
					});
				}
			}).catch((error) => {
				console.log(error);
			}).finally(() => {
				this.setLoading(false);
			});
		}
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
}

</script>
<style lang="scss" scoped>
.insuranceClaimArea{
  background-color: $COLOR-MAIN4;
  min-height: calc(100vh - 80px - 76px);
}
.query__wrap-result{
  padding-bottom: 80px;
.table__header:nth-child(2){
  margin-top: 7px;
  padding: 8px 16px 8px 16px;
  .col{
    font-size: 14px;
  }
}
.table__header:nth-child(3){
  background-color:$COLOR-MAIN2 ;
  border-radius: 4px;
  padding: 13px 16px 13px 16px;
  .col{
    font-size: 14px;
    color: white;
  }
}
}

.query__header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .query__title{
    margin-bottom: 0px;
  }
  .icon__btn{
    width: 33px;
    height: 33px;
  }
}
.query__table{
  margin-top: 12px;
   background-color: #ffffff;
   .ant-table-tbody > tr > td{
     border-bottom: none;
   }
}

::v-deep{
  .ant-table-tbody > tr > td{
      border-bottom: none;
      padding-right: 0;
      padding-left: 0;
      span{
        font-size: 14px;
      }
   }
   .ant-table-thead > tr > th:first-child{
     text-align: right;
   }
  .ant-table-tbody > tr > td:nth-child(1){
    text-align: right;
    border-right: 1px solid #e8e8e8;
    padding-right: 38px;
    color: #000000;
    font-weight: bold;
  }
  table{
    padding: 0 15px;
  }

  tbody > tr > td:nth-child(2){
    padding-left: 38px;
  }

  thead {
    tr {
      th {
        background-color: #ffffff;
        padding-right: 0;
        padding-left: 0;
        span{
          font-size: 14px;
          color: #000000;
          font-weight: bold;
        }
      }
      th:first-child{
        padding-right: 38px;
      }
      th:nth-child(2){
        padding-left: 38px;
      }
    }
  }
  .row
  {
    margin:0
  }
}
</style>
