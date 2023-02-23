<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="insuredContent__wrap">
        <div class="title">
          請確認以下投保內容
        </div>
        <div class="query__table">
          <div class="clearfix" />
          <div class="block__line--blue">
            員工資料
          </div>
          <div class="clearfix" />
          <div class="position-relative">
            <UserDataCard
              v-if="empInfo!==null"
              :card-selected="true"
              :user-name="empInfo.insName"
              :user-sex="empInfo.sex"
              :user-type="0"
              :datas="[empInfo.insId,empInfo.nationality,empInfo.sex,empInfo.birthDate,empInfo.crtNo]"
            />
          </div>
        </div>
        <div class="clearfix" />
        <div
          v-if="empFamilyInfo!==null"
          class="query__table"
        >
          <div class="clearfix" />
          <div class="block__line--blue">
            員眷資料
          </div>
          <div class="clearfix" />
          <div class="position-relative">
            <UserDataCard
              :card-selected="true"
              :user-name="empFamilyInfo.insName"
              :user-sex="empFamilyInfo.sex"
              :user-type="0"
              :datas="[empFamilyInfo.insId,empFamilyInfo.nationality,empFamilyInfo.sex,empFamilyInfo.birthDate,empFamilyInfo.crtNo]"
            />
          </div>
        </div>
        <div
          class="block__line--blue"
        >
          <div class="">
            <div class="d-flex justify-content-between">
              <div class="product__header--bold">
                投保內容
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="row product__content"
      >
        <InsurancePlanFrom
          v-if="plan === '1' && productMode === 'RC'"
          :insurance-plan="selectedProject"
          :plan-type="'InsurancePlan'"
          :product-type="productMode"
          :mode="'confirm'"
        />
        <InsuranceItemFrom
          v-if="plan === '2' && productMode === 'RC'"
          :insurance-item="selectedProject"
          :product-type="productMode"
          :mode="'confirm'"
        />
        <InsurancePlanFrom
          v-if="plan === '1' && productMode === 'CB'"
          :insurance-plan="selectedProject"
          :plan-type="'Plan'"
          :product-type="productMode"
          :mode="'confirm'"
        />
        <InsuranceItemFrom
          v-if="plan === '2' && productMode === 'CB'"
          :insurance-item="selectedProject"
          :product-type="productMode"
          :mode="'confirm'"
        />
      </div>
      <div class="row">
        <div class="col-12 col-lg-10 offset-0 offset-lg-1">
          <div class="mt-4">
            變更日期
          </div>
          <div>
            {{ date }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="block__btns uesrcard--bottom text-center">
            <button
              class="btn__radius--primary--outline"
              @click="back"
            >
              上一步
            </button>
            <button
              class="btn__radius--primary"
              :disabled="isSending"
              @click="onSubmit"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';
import { PolicyContentChangeModelForRcPlan, PolicyContentChangeModelForItemPlan } from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import InsurancePlanFrom from '@/forms/EmployeeEnrollment/InsurancePlanFrom.vue';
import InsuranceItemFrom from '@/forms/EmployeeEnrollment/InsuranceItemFrom.vue';
import PlanFrom from '@/forms/EmployeeEnrollment/PlanFrom.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({
	components: {
		Breadcrumb,
		UserDataCard,
		InsurancePlanFrom,
		InsuranceItemFrom,
		PlanFrom,
	},
})
export default class EmployeeEnrollmentComfirm extends Vue {
  @Prop()
  breadcrumb: {};

	empInfo = null; // 員工資料

  empFamilyInfo = null; // 員眷資料

	selectedProject = null; // 選擇之專案計畫

	date = null; // 變更日期

	plan: '1' | '2' = null; // 1:保險計劃or計畫別 2:險種計畫

	productMode = null; // 保單種類 CB or RC

  isSending = false;

  isHlNtc = null; // 是否健告書

  userId = null; // 承辦人ID

  appNo = null;

  back() {
  	window.history.go(-1);
  }

  onSubmit() {
  	let targetApi = '';

  	let data: any = {};

  	const date = moment(DateTimeFormmat.transformDate(this.date)).format(
  		'YYYY-MM-DDTHH:mm:ss.sssZ',
  	);

  	const policyDetail = this.$user.getPolicyDetail();

  	if (this.plan === '1') {
  		// 保險計畫/專案別
  		const dataInput: PolicyContentChangeModelForRcPlan = {
  			input: this.empFamilyInfo !== null ? this.empFamilyInfo.input : this.empInfo.input,
  			policyNo: policyDetail.poliId.toString(),
  			policySeq: policyDetail.poliSeq,
  			times: policyDetail.times,
  			updateDate: date,
  			userId: this.userId,
  			isHlNtc: this.isHlNtc,
  			planDto: this.selectedProject,
  			appNo: this.appNo,
  		};
  		data = dataInput;
  	} else {
  		// 顯種計畫
  		const dataInput: PolicyContentChangeModelForItemPlan = {
  			input: this.empFamilyInfo !== null ? this.empFamilyInfo.input : this.empInfo.input,
  			policyNo: policyDetail.poliId.toString(),
  			policySeq: policyDetail.poliSeq,
  			times: policyDetail.times,
  			updateDate: date,
  			userId: this.userId,
  			isHlNtc: this.isHlNtc,
  			insPlanDtoList: this.selectedProject,
  			appNo: this.appNo,
  		};
  		data = dataInput;
  	}

  	if (this.plan === '1' && this.productMode === 'RC') {
  		targetApi = 'changePolicyContentRcPlanUsingPOST';
  	} else if (this.plan === '1' && this.productMode === 'CB') {
  		targetApi = 'changePolicyContentCbPlanUsingPOST';
  	} else {
  		targetApi = 'changePolicyContentItemPlanUsingPOST';
  	}
  	this.isSending = true;
  	console.log(data);
  	this.$empFamilyPolicyChangeApi[targetApi](data)
  		.then((resp) => {
  			// 傳員工姓名&被退保人姓名到下一頁
  			console.log(resp);
  			if (resp.data.status === 200) {
  				let message = resp.data.data.healthAndDisabilityMsg ? resp.data.data.healthAndDisabilityMsg : '';
  				message = resp.data.data.familyResetMsg ? `${message}\n${resp.data.data.familyResetMsg}` : message;
  	      	this.$global.changeRouterAndaddParam({
  					  toRouter: 'EmployeeInsuredContentChangeSuccess',
  					  query: {
  						  empName: this.empInfo.insName, // 員工資料
  						  insName: data.input.insName, // 被保人資料
  						  message, // 檢核訊息
  						  file: { // 文件
  							hlNtcDocFileName: resp.data.data.hlNtcDocFileName,
  							hlNtcDocId: resp.data.data.hlNtcDocId,
  							disNtcDocId: resp.data.data.disNtcDocId,
  							disNtcDocFileName: resp.data.data.disNtcDocFileName,
  						  },
  					  },
  				  });
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeInsuredContentChangeFail',
  					query: {
  						  empName: this.empInfo.insName,
  						  insName: data.input.insName,
  						  message: resp.data.apiError, // 錯誤訊息
  					},
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isSending = false;
  		});
  }

  async created() {
  	// const queryDecrypt = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	// const query = JSON.parse(queryDecrypt);
  	const query = this.$global.getQuery();

  	this.empInfo = JSON.parse(await this.$encryptionDecryption.decrypt(query.empInfo));
  	this.empFamilyInfo = JSON.parse(await this.$encryptionDecryption.decrypt(query.empFamilyInfo));
  	this.selectedProject = query.selectedProject;
  	this.date = query.date;
  	this.plan = query.plan;
  	this.productMode = query.productMode;
  	this.isHlNtc = query.isHlNtc;
  	this.appNo = query.appNo;
  	this.userId = this.$user.getMe().userId;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  color: $COLOR-MAIN5;
  padding: 57px 0px 20px 0px;
}
.uesrcard--bottom{
	margin-bottom: 25px;
}
.insuredContent__wrap {
  max-width: 100%;
  width: 900px;
  margin: auto;
}
.block__btns {
	margin-top: 60px;
	margin-bottom: 40px;
}
</style>
