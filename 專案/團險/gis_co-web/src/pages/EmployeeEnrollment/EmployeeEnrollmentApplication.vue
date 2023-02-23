<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <h2
          v-if="!isEdit"
          class="query__title"
        >
          員工及員眷加保
        </h2>
        <h2
          v-else
          class="query__title"
        >
          員工及眷屬加保變更
        </h2>
        <div
          v-if="!(isEdit && nowStep === 'enroll')"
          class="row"
        >
          <div class="col-4 offset-4">
            <div class="query__option text-center">
              <a-radio-group
                v-if="nowStep === 'enroll'"
                v-model="enrollOption"
                class="query__tab"
                default-value="year"
                button-style="solid"
              >
                <a-radio-button value="employee">
                  員工加保
                </a-radio-button>
                <a-radio-button value="family">
                  眷屬加保
                </a-radio-button>
              </a-radio-group>
              <a-radio-group
                v-else
                v-model="productSelect"
                class="query__tab"
                button-style="solid"
              >
                <a-radio-button
                  :value="productType === 'RC' ? 'InsurancePlan' : 'Plan'"
                  :disabled="productType === 'CB' && cbPlanDtoList !== null && cbPlanDtoList.length === 0"
                >
                  {{ productType === 'RC' ? '保險計劃' : '專案別' }}
                </a-radio-button>
                <a-radio-button
                  value="InsuranceItem"
                  :disabled="productType === 'CB' && cbPlanDtoList !== null && cbPlanDtoList.length > 0"
                >
                  險種計畫
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </div>
        <EmployeeDataForm
          v-if="enrollOption === 'employee' && nowStep == 'enroll'"
          ref="EmployeeDataFormRef"
          :policy-model="policyModel"
          :init-data="employeeEditData"
          :today-edit="isEdit"
          :product-type="productType"
          :today-search-pagination="todaySearchPagination"
          @sentEmployeeData="sentEmployeeData"
        />
        <FamilyDataForm
          v-if="enrollOption === 'family' && nowStep == 'enroll'"
          ref="FamilyDataFormRef"
          :employee-id="employeeId"
          :policy-model="policyModel"
          :today-edit="isEdit"
          :init-data="familyEditData"
          :today-search-pagination="todaySearchPagination"
          @sentFamilyData="sentFamilyData"
        />

        <!-- RC保險計劃 -->
        <InsurancePlanFrom
          v-if="productSelect == 'InsurancePlan' && nowStep == 'productSelect'"
          :plan-type="productSelect"
          :insurance-plan="rcPlanDtoList"
          :default-select="planDefaultSelect"
          :product-type="productType"
          :mode="'edit'"
          @selected="getSelected"
        />

        <!-- CB專案別 -->
        <PlanFrom
          v-if="productSelect == 'Plan' && nowStep == 'productSelect'"
          :plan-type="productSelect"
          :insurance-plan="cbPlanDtoList"
          :default-select="planDefaultSelect"
          :mode="'edit'"
          @selected="getSelected"
        />

        <!-- RC、CB險種計劃 -->
        <InsuranceItemFrom
          v-if="productSelect == 'InsuranceItem' && nowStep == 'productSelect'"
          :insurance-item="productType === 'RC' ? rcInsPlanDtoList : cbInsPlanDtoList"
          :mode="'edit'"
          :product-type="productType"
          :clear-selected="isChangeOnBoardDate"
          @selected="getSelected"
        />

        <div
          v-if="nowStep == 'productSelect'"
          class="row"
        >
          <div class="col-12">
            <div class="block__btns text-center form__policychange__bottom">
              <button
                class="btn__radius--primary--outline"
                @click="changeStep('enroll')"
              >
                上一步
              </button>
              <button
                class="btn__radius--primary"
                @click="onConfirm"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
	PolicyModel,
	EmployeeEnrollmentScIns,
	EmployeeEnrollmentModel,
	EmployeeFamilyEnrollmentModel,
	EmployeeEnrollmentValidRc,
	EmployeeEnrollmentValidRcIns,
	InsurancePlanDto,
	EmpFamilyPageDto,
	PlanDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import EmployeeDataForm from '@/forms/EmployeeEnrollment/EmployeeDataForm.vue';
import FamilyDataForm from '@/forms/EmployeeEnrollment/FamilyDataForm.vue';
import InsurancePlanFrom from '@/forms/EmployeeEnrollment/InsurancePlanFrom.vue';
import InsuranceItemFrom from '@/forms/EmployeeEnrollment/InsuranceItemFrom.vue';
import PlanFrom from '@/forms/EmployeeEnrollment/PlanFrom.vue';
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
		Breadcrumb, EmployeeDataForm, InsurancePlanFrom, InsuranceItemFrom, PlanFrom, FamilyDataForm,
	},
})
export default class EmployeeEnrollmentApplication extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  breadcrumb: {}

  // 時間format格式
  formatter = this.$twDateFormatter;

  // PolicyModel
  policyModel: PolicyModel;

  // 是否為編輯狀態
  isEdit: boolean = false;

  // 選擇加保類型：員眷、員工
  enrollOption: string = null;

  // 選擇填寫資料或投保內容
  nowStep: 'enroll' | 'productSelect'= 'enroll';

  // 依保單號碼為RC還是CB
  productType: 'RC' | 'CB' = 'CB';

  // 投保內容為險種、保險計劃、專案
  productSelect: string = 'InsuranceItem';

  // plan default select
  planDefaultSelect = null;

  // CB險種計劃
  cbInsPlanDtoList: Array<InsurancePlanDto> = null;

  // CB專案別
  cbPlanDtoList: Array<PlanDto> = null;

  // RC險種計畫
  rcInsPlanDtoList: Array<InsurancePlanDto> = null;

  // RC保險計畫
  rcPlanDtoList: Array<PlanDto> = null;

  // 選擇之專案計畫
  selectedProject = null;

  // 選擇之專案計畫
  oriSelectedProject = null;

  // 險種選擇
  selectedProjectItem = null;

  // 眷屬加保的員工資料
  employeeData: EmpFamilyPageDto = null;

	employeeId: string = null;

  // 員工編輯資料
  employeeEditData = null;

  // 眷屬編輯資料
  familyEditData = null;

  // EmployeeEnrollmentModel
  EmployeeEnrollmentModel: EmployeeEnrollmentModel = null;

  EmployeeFamilyEnrollmentModel: EmployeeFamilyEnrollmentModel = null;

  // 詳細投保需要用到的中文：屬性、受益人、國籍
  infoName = null;

	// 從今日異動編輯來的要帶受理號碼
	appNo = null;

	// 從今日異動第幾頁來的
	todaySearchPagination = null;

	// 是否員工以異動到受僱日期
	isChangeOnBoardDate: boolean = false;

	@Watch('productSelect')
	onProductSelectChanged() {
		this.selectedProject = null;
	}

	async created() {
  	this.setLoading(true);
  	console.log('app created');
  	this.productType = this.$userInfo.getProject();
  	this.policyModel = this.$userInfo.getPolicyModel();
  	this.productType == 'RC' ? this.productSelect = 'InsurancePlan' : this.productSelect = 'Plan';
		let query = null;
  	if (this.$global.getParam() !== null) {
  		if (this.$global.getParam().fromPage === 'EmployeeEnrollmentComfirm') {
				// 如果從加保確認頁返回
				this.nowStep = 'productSelect';
				const encryptParam = this.$global.getParam().query; // 加密參數
				const decryptPersonInfoString = await this.$encryptionDecryption.decrypt(encryptParam.personInfo);
				const personInfo = JSON.parse(decryptPersonInfoString);
				query = {
					...personInfo,
					...encryptParam.info,
				};
			} else {
				this.nowStep = 'enroll';
				const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getParam().query);
				query = JSON.parse(decryptString);
				this.todaySearchPagination = query.pagination;
			}
			this.infoName = query.infoName;
			this.cbInsPlanDtoList = query.cbInsPlanDtoList;
			this.cbPlanDtoList = query.cbPlanDtoList;
			this.rcInsPlanDtoList = query.rcInsPlanDtoList;
			this.rcPlanDtoList = query.rcPlanDtoList;
  		if (query.isEdit) {
  			this.isEdit = true;
				this.appNo = query.appNo;
  		}

			this.productSelect = query.productSelect; // 選擇險種還是計劃
			if (this.productSelect == 'InsurancePlan' || this.productSelect == 'Plan') {
				this.planDefaultSelect = query.selectedProject;
			}
  		console.log('query', query);

  		// 判斷是否是員工還是眷屬加保
  		if (query.EmployeeEnrollmentModel) {
  			this.employeeEditData = query.EmployeeEnrollmentModel;
  			this.EmployeeEnrollmentModel = query.EmployeeEnrollmentModel;
  		  this.enrollOption = 'employee';
  		} else {
  			this.EmployeeFamilyEnrollmentModel = query.EmployeeFamilyEnrollmentModel;
  			this.familyEditData = query.EmployeeFamilyEnrollmentModel;
  			this.employeeData = query.employeeData ? query.employeeData : null;
  		  this.enrollOption = 'family';

  			// 從受理成功或失敗可以繼續眷屬加保，會帶員工身分證進行加保
				this.employeeId = query.employeeId ? query.employeeId : null;
  		}
  	} else {
  		// 初始
  		this.enrollOption = 'employee';
  		this.nowStep = 'enroll';
  	}
		if (this.nowStep === 'productSelect') {
			this.$nextTick(() => this.setLoading(false));
		}
	}

	// 選取加保項目
	getSelected(val) {
  	this.selectedProject = val;
  	console.log(this.selectedProject);
	}

	// 更換階段
	changeStep(step: 'enroll' | 'productSelect') {
  	this.nowStep = step;
	}

	// 新增員工加保資料
	sentEmployeeData({ request, infoName, isChangeOnBoardDate }) {
  	this.setLoading(true);
		this.isChangeOnBoardDate = isChangeOnBoardDate;
  	this.EmployeeEnrollmentModel = request;
  	this.infoName = infoName;
  	this.$employeeEnrollmentApi.empInfoUsingPOST(request)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.employeeEditData = request;
  				console.log('新增員工加保資料', resp);
  				this.rcInsPlanDtoList = resp.data.data.rcInsPlanDtoList;
  				this.rcPlanDtoList = resp.data.data.rcPlanDtoList;
  				this.cbInsPlanDtoList = resp.data.data.cbInsPlanDtoList;
  				this.cbPlanDtoList = resp.data.data.cbPlanDtoList;
  				if (this.isEdit) {
  					if (resp.data.data.planCode) {
  						this.planDefaultSelect = this.productType === 'RC' ? this.rcPlanDtoList.find((e) => (e.planCode == resp.data.data.planCode)) : this.cbPlanDtoList.find((e) => ((e.planCode + e.plan) == (resp.data.data.planCode + resp.data.data.plan)));
							this.productType === 'RC' ? this.productSelect = 'InsurancePlan' : this.productSelect = 'Plan';
  					} else {
  						this.productSelect = 'InsuranceItem';
  					}
  				} else {
  					this.productType === 'RC' ? this.productSelect = 'InsurancePlan' : this.productSelect = 'Plan';
  				}
					if (this.productType === 'CB') {
						if (this.cbPlanDtoList) {
							this.cbPlanDtoList.length === 0 ? this.productSelect = 'InsuranceItem' : this.productSelect = 'Plan';
						}
					}
					if (isChangeOnBoardDate) {
						this.planDefaultSelect = null;
						this.selectedProject = null;
					}

  				this.nowStep = 'productSelect';
  				// 隱藏難字圖示
  				if (document.getElementById('EUDCTopBanner')) {
  					const EUDCTopBannerEl = document.getElementById('EUDCTopBanner');
  					const compStyles = window.getComputedStyle(EUDCTopBannerEl);
  					console.log("compStyles.getPropertyValue('display')", compStyles.getPropertyValue('display'));
  					if (compStyles.getPropertyValue('display') !== 'none') {
  						EUDCTopBannerEl.style.display = 'none';
  					}
  				}
					(this.$refs.EmployeeDataFormRef as any).reset();
					(this.$refs.EmployeeDataFormRef as any).isSubmitting = false;
  				this.$nextTick(() => {
  					this.setLoading(false);
						window.scrollTo({ top: 0 });
  				});
  			} else {
					(this.$refs.EmployeeDataFormRef as any).isSubmitting = false;
					this.setLoading(false);
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(() => {
  			this.setLoading(false);
  			console.error();
  		});
	}

	// 新增眷屬加保資料
	sentFamilyData({ request, infoName, employeeData }) {
  	this.setLoading(true);
  	// this.familyEditData = request;
  	this.EmployeeFamilyEnrollmentModel = request;
  	this.infoName = infoName;
  	this.employeeData = employeeData;

  	this.$employeeFamilyEnrollmentApi.empFamilyInfoUsingPOST(request)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log('新增眷屬加保資料', resp);
  				this.familyEditData = request;
  				this.rcInsPlanDtoList = resp.data.data.rcInsPlanDtoList;
  				this.rcPlanDtoList = resp.data.data.rcPlanDtoList;
  				this.cbInsPlanDtoList = resp.data.data.cbInsPlanDtoList;
  				this.cbPlanDtoList = resp.data.data.cbPlanDtoList;
  				if (this.isEdit) {
  					if (resp.data.data.planCode) {
  						this.planDefaultSelect = this.productType === 'RC' ? this.rcPlanDtoList.find((e) => (e.planCode == resp.data.data.planCode)) : this.cbPlanDtoList.find((e) => ((e.planCode + e.plan) == (resp.data.data.planCode + resp.data.data.plan)));
  						this.productType === 'RC' ? this.productSelect = 'InsurancePlan' : this.productSelect = 'Plan';
  					} else {
  						this.productSelect = 'InsuranceItem';
  					}
  				} else {
  					this.productType === 'RC' ? this.productSelect = 'InsurancePlan' : this.productSelect = 'Plan';
  				}
  				// 隱藏難字圖示
					if (this.productType === 'CB') {
						if (this.cbPlanDtoList) {
							this.cbPlanDtoList.length === 0 ? this.productSelect = 'InsuranceItem' : this.productSelect = 'Plan';
						}
					}
  				this.nowStep = 'productSelect';
  				if (document.getElementById('EUDCTopBanner')) {
  					const EUDCTopBannerEl = document.getElementById('EUDCTopBanner');
  					const compStyles = window.getComputedStyle(EUDCTopBannerEl);
  					console.log("compStyles.getPropertyValue('display')", compStyles.getPropertyValue('display'));
  					if (compStyles.getPropertyValue('display') !== 'none') {
  						EUDCTopBannerEl.style.display = 'none';
  					}
  				}
					(this.$refs.FamilyDataFormRef as any).isSubmitting = false;
  				this.$nextTick(() => {
  					this.setLoading(false);
  				});
  			} else {
					(this.$refs.FamilyDataFormRef as any).isSubmitting = false;
  				this.setLoading(false);
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(() => {
  			console.error();
  			this.setLoading(false);
  		});
	}

	// 確認投保內容
	onConfirm() {
  	this.setLoading(true);
  	const vm = this;
  	const api = this.enrollOption === 'employee' ? '$employeeEnrollmentApi' : '$employeeFamilyEnrollmentApi';
  	const model = this.enrollOption === 'employee' ? 'EmployeeEnrollmentModel' : 'EmployeeFamilyEnrollmentModel';
  	let dto = '';
  	let apiPath = '';

  	// 沒有選投保項目
  	if (this.selectedProject === null || this.selectedProject.length === 0) {
  		notification.error({ Content: '請選擇投保項目' });
			this.setLoading(false);
  		return;
  	}

  	// 選RC+保險計劃
  	if (this.productType === 'RC' && this.productSelect === 'InsurancePlan') {
  		apiPath = this.enrollOption === 'employee' ? 'validEmpRcPlanUsingPOST' : 'validFamilyRcPlanUsingPOST';
  		dto = 'planDto';
  	}

  	// 選RC+險種計畫
  	if (this.productType === 'RC' && this.productSelect === 'InsuranceItem') {
  		apiPath = this.enrollOption === 'employee' ? 'validEmpRcInsPlanUsingPOST' : 'validFamilyRcInsPlanUsingPOST';
  		dto = 'insPlanDtoList';
  		// 險種的選取資料要另外轉換
  		this.selectedProjectItem = JSON.parse(JSON.stringify(this.selectedProject));
  			this.selectedProjectItem.forEach((element) => {
  			element.insPlanItemDto = element.insPlanItemDtoList.find((e) => (element.item + e.plan + e.vrsn) === element.itemSelectedModel);
  		});
  		console.log('this.selectedProjectItem', this.selectedProjectItem);
  	}

  	// 選CB+專案別
  	if (this.productType === 'CB' && this.productSelect === 'Plan') {
  		apiPath = this.enrollOption === 'employee' ? 'validEmpCbPlanUsingPOST' : 'validFamilyCbPlanUsingPOST';
  		dto = 'planDto';
  	}

  	// 選CB+險種計畫
  	if (this.productType === 'CB' && this.productSelect === 'InsuranceItem') {
  		apiPath = this.enrollOption === 'employee' ? 'validEmpCbInsPlanUsingPOST' : 'validFamilyCbInsPlanUsingPOST';
  		dto = 'insPlanDtoList';
  		// 險種的選取資料要另外轉換
  		this.selectedProjectItem = JSON.parse(JSON.stringify(this.selectedProject));
  		this.selectedProjectItem.forEach((element) => {
  			if (element.insPlanItemDtoList !== null) {
  				element.insPlanItemDto = element.insPlanItemDtoList.find((e) => (element.item + e.plan + e.vrsn) === element.itemSelectedModel);
  			} else {
  				element.insPlanItemDto.sa = element.itemSelectedModel;
  			}
  		});

  		console.log('this.selectedProjectItem', this.selectedProjectItem);
  	}
  	const request: EmployeeEnrollmentValidRc | EmployeeEnrollmentValidRcIns = {
  		attr: this[model].attr,
  		crtNo: this[model].crtNo,
  		insBirthdate: this[model].insBirthdate,
  		insSex: this[model].insSex,
  		scIns: this.enrollOption === 'employee' ? this.EmployeeEnrollmentModel.scIns : null,
  		[dto]: this.productSelect === 'InsuranceItem' ? this.selectedProjectItem : this.selectedProject,
			appNo: this.appNo,
  		policyModel: this.policyModel,
			onBoardDate: this.enrollOption === 'employee' ? (this[model] as EmployeeEnrollmentModel).onBoardDate : (this[model] as EmployeeFamilyEnrollmentModel).insDate,
  	};

  	this[api][apiPath](request)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (resp.data.data.warmMsg) {
  					notificationModal.alertForListError({
  						title: '提醒',
  					  contentList: vm.$global.getApiErrorMsg(resp.data.data.warmMsg),
  						onCallback: this.toConfirmPage,
  				});
  				} else {
  					this.toConfirmPage();
  				}
  			} else {
  				notificationModal.alertForListError({
  					contentList: vm.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
	}

	async toConfirmPage() {
  	console.log('this.selectedProject', this.selectedProject);
		if (this.EmployeeEnrollmentModel !== null) {
			this.EmployeeEnrollmentModel.insBirthdate = moment(this.EmployeeEnrollmentModel.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
			this.EmployeeEnrollmentModel.onBoardDate = moment(this.EmployeeEnrollmentModel.onBoardDate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
		} else {
			this.EmployeeFamilyEnrollmentModel.insBirthdate = moment(this.EmployeeFamilyEnrollmentModel.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
			this.EmployeeFamilyEnrollmentModel.insDate = moment(this.EmployeeFamilyEnrollmentModel.insDate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
		}

		// 機敏資料需加密
		const personInfo = {
			employeeData: this.employeeData, // 眷屬加保的員工資料
  		EmployeeEnrollmentModel: this.EmployeeEnrollmentModel, // 員工資料dto
  		EmployeeFamilyEnrollmentModel: this.EmployeeFamilyEnrollmentModel, // 眷屬資料dto
		};
  	const personInfoEncrypt = await this.$encryptionDecryption.encrypt(JSON.stringify(personInfo));

  	const query = {
			personInfo: personInfoEncrypt,
			info: {
				selectedProject: this.productSelect === 'InsuranceItem' ? this.selectedProjectItem : this.selectedProject,
				productSelect: this.productSelect,
				productType: this.productType,
				infoName: this.infoName,
				cbInsPlanDtoList: this.cbInsPlanDtoList,
				cbPlanDtoList: this.cbPlanDtoList,
				rcInsPlanDtoList: this.rcInsPlanDtoList,
				rcPlanDtoList: this.rcPlanDtoList,
				isEdit: this.isEdit,
				appNo: this.appNo,
			},
  	};
		console.log('query', query);
  	this.setLoading(false);
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EmployeeEnrollmentComfirm',
  		query,
  	});
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
  .query__option{
    margin-bottom: 40px;
  }
  .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
	.form__policychange__bottom {
    margin-top: 40px;
    margin-bottom: 40px;
}
</style>
