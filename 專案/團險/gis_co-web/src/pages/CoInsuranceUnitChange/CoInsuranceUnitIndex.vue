<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div
        class="page__title float-start"
      >
        要保單位基本資料
      </div>
      <div
        v-if="coInsuranceUnitData"
        class="btn__radius--primary--small d-inline-flex align-items-center float-end mt-3"
        @click="changeData"
      >
        <img
          class="d-inline-block me-1"
          src="@/assets/button_edit.svg"
          alt=""
        >
        <span class="d-inline-block">變更資料</span>
      </div>
      <div class="clearfix" />
      <img
        src="@/assets/image_littleBanner.svg"
        alt=""
      >
      <div
        v-if="coInsuranceUnitData"
        class="coInfo__edit__table bg__blue"
      >
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">保單號碼-序號</label>
              <div>{{ policyId }}-{{ policySeq }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">保險期間</label>
              <div>{{ coInsuranceUnitData.strDate }} - {{ coInsuranceUnitData.endDate }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">要保單位中文名稱</label>
              <div>{{ coInsuranceUnitData.fullName }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">要保單位英文名稱</label>
              <div>{{ coInsuranceUnitData.corpName }}</div>
            </div>
          </div>
        </div>
        <hr class="mb-4">
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">負責人姓名</label>
              <div>{{ coInsuranceUnitData.bossName }}</div>
              <hr class="mt-4">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">匯款銀行</label>
              <div>{{ coInsuranceUnitData.bankNoName }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">分行代碼</label>
              <div>{{ coInsuranceUnitData.duizc2 }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">匯款帳號</label>
              <div>{{ coInsuranceUnitData.duknc2 }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">統一編號</label>
              <div>{{ coInsuranceUnitData.applId }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">職災編號/營業類別</label>
              <div>{{ coInsuranceUnitData.agcyTypeName }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">公司登記地址</label>
              <div>{{ coInsuranceUnitData.zipCode }} {{ coInsuranceUnitData.addr }}</div>
            </div>
          </div>
        </div>
        <!-- <hr class="mb-4"> -->
        <!-- <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">公司通訊地址</label>
              <div>{{ coInsuranceUnitData.crflc3 }} {{ coInsuranceUnitData.crfmc3 }}</div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form__line">
              <label for="">聯絡電話(區碼/電話/分機)</label>
              <div>{{ coInsuranceUnitData.applTel }}</div>
            </div>
          </div>
          <div class="col">
            <div class="form__line">
              <label for="">傳真號碼</label>
              <div>{{ coInsuranceUnitData.faxNo }}</div>
            </div>
          </div>
        </div> -->
      </div>
      <div v-else>
        查無資料
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';
import { CoInsuranceUnitQueryModel } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: { Breadcrumb, FblDataGrid } })
export default class CoInsuranceUnitIndex extends Vue {
  @Prop()
  breadcrumb: {}

  // 取得要保單位資料
  coInsuranceUnitData = null;

  // 保單號碼
  policyId = null;

  // 保單序號
  policySeq = null;

  // 變更要保單位資料
  async changeData() {
  	const query = {
  		form: this.coInsuranceUnitData,
  		fromApiForm: this.coInsuranceUnitData,
  	};
  	const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(query));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CoInsuranceUnitEdit',
  		query: encryptQuery,
  	});
  }

  getCoInsuranceInfo() {
  	const loginInfo = this.$user.getMe();
  	const policyDetail = this.$user.getPolicyDetail();
  	this.policyId = policyDetail.poliId;
  	this.policySeq = policyDetail.poliSeq;
  	const data: CoInsuranceUnitQueryModel = {
  		// policyId: 1002151,
  		// policySeq: '000',
  		// times: 25,
  		policyId: policyDetail.poliId,
  		policySeq: policyDetail.poliSeq,
  		times: policyDetail.times,
  	};
  	this.$coInsuranceUnitApi.oneUsingPOST(data)
  		.then(async (resp) => {
  			if (resp.data.status === 200) {
  				this.coInsuranceUnitData = resp.data.data;
  				console.log(this.coInsuranceUnitData);
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  				// this.$router.push({ path: '/' }).catch((err) => { err; });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isDownloading = false;
  		});
  }

  created() {
  	this.getCoInsuranceInfo();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.page__title {
  margin-bottom: 25px;
}
.notice__txt {
  position: absolute;
  top: -24px;
  right: 0;
  font-size: 12px;
}
.form__line {
  margin-bottom: 25px;
  word-break: break-word;
  label {
    font-weight: 400;
  }
  div {
    font-weight: 600;
    color: #000000;
  }
}
.coInfo__table__wrap {
  padding-bottom: 33px;
  padding-top: 27px;
}
.coInfo__edit__table {
  padding: 25px 90px;
  margin-top: 10px;
  margin-bottom: 40px;
  border-radius: 4px;
}
.block__btns {
  margin: 40px 0;
  button {
    width: 150px;
    max-width: 100%;
    margin: 0 5px;
  }
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
