<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-10 offset-0 offset-lg-1">
          <div class="title">
            請確認以下投保內容
          </div>
        </div>
      </div>
      <div
        v-if="confirmType === 'family'"
        class="comfirm__block"
      >
        <div class="row">
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <div class="form__policychange__header">
              員工資料
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <UserDataCard
              class="uesrcard--bottom"
              :card-selected="true"
              :user-name="employeeData.insName"
              :user-sex="employeeData.sex"
              :user-type="0"
              :datas="[employeeData.insId, employeeData.nationality, employeeData.sex, employeeData.birthDate, employeeData.crtNo]"
            />
          </div>
        </div>
      </div>
      <div class="comfirm__block">
        <div class="row">
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <div class="form__policychange__header">
              個人資料
            </div>
          </div>
        </div>
        <div
          v-if="userDataList"
          class="row"
        >
          <template v-for="(item, index) in userDataList">
            <div
              v-if="item.categrory === 'personInfo'"
              :key="index"
              :class="{
                'col-12 col-lg-10 offset-0 offset-lg-1': item.col === 10 ? true : false,
                'col-12 col-lg-4 offset-0 offset-lg-1': item.col === 5 ? true : false,
              }"
            >
              <div class="comfirm__item">
                <div class="comfirm__item__label">
                  {{ item.title }}
                </div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        v-if="confirmType === 'employee'"
        class="comfirm__block"
      >
        <div class="row">
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <div class="form__policychange__header">
              任職資料
            </div>
          </div>
        </div>
        <div class="row">
          <template v-for="(item, index) in userDataList">
            <div
              v-if="item.categrory === 'career' && item.isShow"
              :key="index"
              :class="{
                'col-12 col-lg-10 offset-0 offset-lg-1': item.col === 10 ? true : false,
                'col-12 col-lg-4 offset-0 offset-lg-1': item.col === 5 ? true : false,
              }"
            >
              <div class="comfirm__item">
                <div class="comfirm__item__label">
                  {{ item.title }}
                </div>
                <div>{{ item.value }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div
        class="row product__header"
      >
        <div class="col-12 col-lg-10 offset-0 offset-lg-1">
          <div class="d-flex justify-content-between">
            <div class="product__header--bold">
              投保內容
            </div>
            <div class="product__header--bold product__header--sub">
              金額單位／新台幣TWD
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="selectedProject"
        class="row bg--pale"
      >
        <InsurancePlanFrom
          v-if="(productSelect === 'InsurancePlan' && productType === 'RC') || productSelect === 'Plan' && productType === 'CB'"
          :plan-type="productSelect"
          :insurance-plan="selectedProject"
          :product-type="productType"
          :mode="'confirm'"
        />
        <InsuranceItemFrom
          v-if="productSelect === 'InsuranceItem'"
          :insurance-item="selectedProject"
          :mode="'confirm'"
          :product-type="productType"
        />
      </div>
      <div class="row">
        <div class="col-12">
          <div class="block__btns text-center form__policychange__bottom">
            <button
              class="btn__radius--primary--outline"
              @click="back"
            >
              上一步
            </button>
            <button
              class="btn__radius--primary"
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
	EmployeeEnrollmentModel,
	EmployeeFamilyEnrollmentModel,
	EmployeeEnrollmentSendRc,
	EmployeeEnrollmentSendRcIns,
	EmployeeFamilyEnrollmentSendRcIns,
	EmployeeFamilyEnrollmentSendRc,
	PlanDto,
	EmpFamilyPageDto,
	UserInfoDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { Action } from 'vuex-class';
import { async } from 'rxjs';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import InsurancePlanFrom from '@/forms/EmployeeEnrollment/InsurancePlanFrom.vue';
import InsuranceItemFrom from '@/forms/EmployeeEnrollment/InsuranceItemFrom.vue';
import dateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/info/infoNotification';
import notificationModal from '@/plugins/info/infoModal';

export interface formModel {
  option: string;
  changeTime: string;
  changeTimeRange: string;
  idno: string;
  insName: string;
  appNoStart: string;
  appNoEnd: string;
  applyFor: string;
}

@Component({
	components: {
		Breadcrumb,
		UserDataCard,
		InsurancePlanFrom,
		InsuranceItemFrom,
	},
})
export default class EmployeeEnrollmentComfirm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  breadcrumb: {};

	// 確認資料類型：員工／眷屬
	confirmType: 'employee' | 'family' = 'employee';

	// 加保資料
	EmployeeEnrollmentModel: EmployeeEnrollmentModel = null;

	EmployeeFamilyEnrollmentModel: EmployeeFamilyEnrollmentModel = null;

	// 選擇的加保項目
	selectedProject = null;

	// 投保內容為險種(InsuranceItem)、保險計劃(InsurancePlan)、專案(Plan)
  productSelect: string = 'InsuranceItem';

  // 依保單號碼為RC還是CB
  productType: 'RC' | 'CB' = 'RC';

  userDataList = null;

  // 眷屬加保的員工資料
  employeeData: EmpFamilyPageDto = null;

  // 承辦人資訊
  currentLoginData: UserInfoDto = {};

	//
	appNo = null;

	async created() {
  	this.setLoading(true);
  	console.log('this.$global.getParam()', this.$global.getParam());
  	if (this.$global.getParam() === null) {
  		this.$router.push({ name: 'Index' });
  	} else {
			const encryptParam = this.$global.getParam().query; // 加密參數
  		this.currentLoginData = JSON.parse(sessionStorage.login_state).me;
  		const decryptPersonInfoString = await this.$encryptionDecryption.decrypt(encryptParam.personInfo);
  		const personInfo = JSON.parse(decryptPersonInfoString);
			const query = {
				...personInfo,
				...encryptParam.info,
			};
  		console.log('query', query);

  		// 判斷為員工加保還是眷屬
  		if (query.EmployeeEnrollmentModel) {
  			this.confirmType = 'employee';
  			this.EmployeeEnrollmentModel = query.EmployeeEnrollmentModel;
  		} else {
  			this.confirmType = 'family';
  			this.employeeData = query.employeeData;
  			this.EmployeeFamilyEnrollmentModel = query.EmployeeFamilyEnrollmentModel;
  		}

  		this.selectedProject = query.selectedProject;
  		console.log('this.selectedProject', this.selectedProject);
  		this.productSelect = query.productSelect;
  		this.productType = query.productType;

  		// 基本資料顯示資訊
  		if (this.confirmType == 'employee') {
  			this.userDataList = [
  				{
  					categrory: 'personInfo',
  					title: '員工姓名',
  					key: 'insName',
  					value: this.EmployeeEnrollmentModel.insName,
  					col: 10,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '英文姓名',
  					key: 'englishName',
  					value: this.EmployeeEnrollmentModel.englishName,
  					col: 10,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '身分證字號/居留證號碼',
  					key: 'idNo',
  					value: this.EmployeeEnrollmentModel.idNo,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '生日',
  					key: 'insBirthdate',
  					value: dateTimeFormmat.transformRocDate(this.EmployeeEnrollmentModel.insBirthdate),
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '國籍',
  					key: 'nationality',
  					value: query.infoName.nationalityName,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '性別',
  					key: 'mobile',
  					value: this.EmployeeEnrollmentModel.insSex === 'M' ? '男' : '女',
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '行動電話',
  					key: 'mobile',
  					value: this.EmployeeEnrollmentModel.mobile,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '電子信箱',
  					key: 'email',
  					value: this.EmployeeEnrollmentModel.email,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '受益人',
  					key: 'benType',
  					value: query.infoName.benTypeName,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '保險證號/員工編號',
  					key: 'crtNo',
  					value: this.EmployeeEnrollmentModel.crtNo,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '受雇日期',
  					key: 'onBoardDate',
  					value: dateTimeFormmat.transformRocDate(this.EmployeeEnrollmentModel.onBoardDate),
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '部門別',
  					key: 'depNo',
  					value: this.EmployeeEnrollmentModel.depNo,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '工作內容',
  					key: 'rankNo',
  					value: this.EmployeeEnrollmentModel.rankNo,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '提報工資(NTD)',
  					key: 'salary',
  					value: this.EmployeeEnrollmentModel.salary ? this.EmployeeEnrollmentModel.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
  					col: 5,
						isShow: this.currentLoginData.authNameList[0] == '一級權限' && query.infoName.scInsOption.salary,
  					// isShow: query.infoName.scInsOption.salary && this.EmployeeEnrollmentModel.scIns == 'Y',
  				},
  				{
  					categrory: 'career',
  					title: '於要保單位投保職保',
  					key: 'scIns',
  					value: this.EmployeeEnrollmentModel.scIns === 'Y' ? '是' : '否',
  					col: 5,
  					isShow: query.infoName.scInsOption.scIns,
  				},
  				{
  					categrory: 'career',
  					title: '職保薪資(NTD)',
  					key: 'scInsAmt',
  					value: this.EmployeeEnrollmentModel.scInsAmt ? this.EmployeeEnrollmentModel.scInsAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
  					col: 5,
						isShow: this.currentLoginData.authNameList[0] == '一級權限' && query.infoName.scInsOption.scInsAmt,
  				},
  				{
  					categrory: 'career',
  					title: '津貼(NTD)',
  					key: 'allowance',
  					value: this.EmployeeEnrollmentModel.allowance ? this.EmployeeEnrollmentModel.allowance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
  					col: 5,
						isShow: this.currentLoginData.authNameList[0] == '一級權限' && query.infoName.scInsOption.allowance,
  				},
  				{
  					categrory: 'career',
  					title: '備註',
  					key: 'note',
  					value: this.EmployeeEnrollmentModel.note,
  					col: 10,
  					isShow: true,
  				},
  			];
  		} else {
  			// 眷屬基本資料
  			this.userDataList = [
  				{
  					categrory: 'personInfo',
  					title: '眷屬姓名',
  					key: 'insName',
  					value: this.EmployeeFamilyEnrollmentModel.insName,
  					col: 10,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '英文姓名',
  					key: 'englishName',
  					value: this.EmployeeFamilyEnrollmentModel.englishName,
  					col: 10,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '身分證字號/居留證號碼',
  					key: 'idNo',
  					value: this.EmployeeFamilyEnrollmentModel.idNo,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '生日',
  					key: 'insBirthdate',
  					value: dateTimeFormmat.transformRocDate(this.EmployeeFamilyEnrollmentModel.insBirthdate),
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '國籍',
  					key: 'nationality',
  					value: query.infoName.nationalityName,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '性別',
  					key: 'insSex',
  					value: this.EmployeeFamilyEnrollmentModel.insSex === 'M' ? '男' : '女',
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '屬性',
  					key: 'attr',
  					value: query.infoName.attrName,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '加保日期',
  					key: 'insDate',
  					value: dateTimeFormmat.transformRocDate(this.EmployeeFamilyEnrollmentModel.insDate),
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'personInfo',
  					title: '受益人',
  					key: 'benType',
  					value: query.infoName.benTypeName,
  					col: 5,
  					isShow: true,
  				},
  				{
  					categrory: 'career',
  					title: '備註',
  					key: 'note',
  					value: this.EmployeeFamilyEnrollmentModel.note,
  					isShow: true,
  				},
  			];
  		}
  	}
  	this.setLoading(false);
  	setTimeout(() => {
  		window.parseWord();
  	}, 100);
	}

	// 送出資料
	onSubmit() {
  	this.setLoading(true);
  	const vm = this;
  	const api = this.confirmType === 'employee' ? '$employeeEnrollmentApi' : '$employeeFamilyEnrollmentApi';
  	const model = this.confirmType === 'employee' ? 'employeeEnrollmentModel' : 'employeeFamilyEnrollmentModel';
  	let dto = '';
  	let apiPath = '';

  	if (this.productType === 'RC' && this.productSelect === 'InsurancePlan') {
  		apiPath = this.confirmType === 'employee' ? 'sendEmpRcPlanUsingPOST' : 'sendFamilyRcPlanUsingPOST';
  		dto = 'planDto';
  	}
  	if (this.productType === 'RC' && this.productSelect === 'InsuranceItem') {
  		apiPath = this.confirmType === 'employee' ? 'sendEmpRcInsPlanUsingPOST' : 'sendFamilyRcInsPlanUsingPOST';
  		dto = 'insPlanDtoList';
  	}

		  	// 選CB+專案別
  	if (this.productType === 'CB' && this.productSelect === 'Plan') {
  		apiPath = this.confirmType === 'employee' ? 'sendEmpCbPlanUsingPOST' : 'sendFamilyCbPlanUsingPOST';
  		dto = 'planDto';
  	}

  	// 選CB+險種計畫
  	if (this.productType === 'CB' && this.productSelect === 'InsuranceItem') {
  		apiPath = this.confirmType === 'employee' ? 'sendEmpCbInsPlanUsingPOST' : 'sendFamilyCbInsPlanUsingPOST';
  		dto = 'insPlanDtoList';
  	}

  	const request: EmployeeEnrollmentSendRc | EmployeeEnrollmentSendRcIns | EmployeeFamilyEnrollmentSendRcIns | EmployeeFamilyEnrollmentSendRc = {
  		[model]: this.confirmType === 'employee' ? this.EmployeeEnrollmentModel : this.EmployeeFamilyEnrollmentModel,
  		[dto]: this.selectedProject,
  	};

  	this[api][apiPath](request)
  		.then(async (resp) => {
				const employeeId = this.confirmType === 'family' ? await this.$encryptionDecryption.decrypt(this.employeeData.input.insId) : this.EmployeeEnrollmentModel.idNo;
  			if (resp.data.status === 200) {
  				console.log('resp', resp);
  				const health = {
  					name: resp.data.data.hlNtcDocFileName ? resp.data.data.hlNtcDocFileName : null,
  					size: '',
  					link: resp.data.data.hlNtcDocId ? resp.data.data.hlNtcDocId : null,
  				};
  				const disability = {
  					name: resp.data.data.disNtcDocFileName ? resp.data.data.disNtcDocFileName : null,
  					size: '',
  					link: resp.data.data.disNtcDocId ? resp.data.data.disNtcDocId : null,
  				};
  				let files = null;
  				switch (resp.data.data.isHlNtc) {
  				case 'Y': // 只需要健康聲明書
  					if (resp.data.data.hlNtcDocId) {
  						files = [health];
  					}
  					break;

  				case 'D': // 只需要失能告知問卷
  					if (resp.data.data.disNtcDocId) {
  						files = [disability];
  					}
  					break;

  				case 'A': // 兩者都要
  					files = [health, disability];
  					break;

  				default: // N都不要
  					files = null;
  					break;
  				}
					let message = resp.data.data.healthAndDisabilityMsg ? resp.data.data.healthAndDisabilityMsg : '';
					message = resp.data.data.familyResetMsg ? `${message}\n${resp.data.data.familyResetMsg}` : message;
					const query = await this.$encryptionDecryption.encrypt(JSON.stringify({
						empName: this.confirmType === 'employee' ? this.EmployeeEnrollmentModel.insName : this.employeeData.insName,
						insName: this.confirmType === 'employee' ? this.EmployeeEnrollmentModel.insName : this.EmployeeFamilyEnrollmentModel.insName,
						employeeId,
						message,
						files,
  					}));
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeEnrollmentSuccess',
  					query,
  				});
  			} else {
  				const messageArr = this.$global.getApiErrorMsg(resp.data.apiError);
					const query = await this.$encryptionDecryption.encrypt(JSON.stringify({
						empName: this.confirmType === 'employee' ? this.EmployeeEnrollmentModel.insName : this.employeeData.insName,
						insName: this.confirmType === 'employee' ? this.EmployeeEnrollmentModel.insName : this.EmployeeFamilyEnrollmentModel.insName,
						employeeId: this.confirmType === 'employee' ? null : employeeId,
						message: messageArr,
					}));
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeEnrollmentFail',
  					query,
  				});
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	back() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CO_EEnrollmentApplication',
  		query: this.$global.getParam().query,
  	});
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

::v-deep .container{
	.form__policychange__bottom{
		padding: 28px 0px 28px 0px;
	}
	.product__content--bgblue{
		margin-top: 0px;
	}
}
</style>
