<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div
      v-if="empInfo!==null"
      class="container"
    >
      <div class="query__wrap-result">
        <div class="insuredContent__wrap">
          <h2 class="query__title">
            請選擇投保變更項目
          </h2>
          <div class="query__table">
            <div class="clearfix" />
            <div class="block__line--blue">
              員工資料
            </div>
            <div class="clearfix" />
            <div class="position-relative">
              <UserDataCard
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
          <div class="clearfix" />
          <div class="insured__content">
            <div class="block__line--blue">
              投保內容
            </div>
            <div class="row">
              <div class="col-4 offset-4">
                <div class="query__option text-center">
                  <a-radio-group
                    v-model="tabModel"
                    class="query__tab"
                    default-value="1"
                    button-style="solid"
                  >
                    <a-radio-button
                      value="1"
                      :disabled="productMode === 'CB' && cbPlanDtoList !== null && cbPlanDtoList.length === 0"
                    >
                      {{ productMode === 'RC' ? '保險計劃' : '專案別' }}
                    </a-radio-button>
                    <a-radio-button
                      value="2"
                      :disabled="productMode === 'CB' && cbPlanDtoList !== null && cbPlanDtoList.length > 0"
                    >
                      險種計畫
                    </a-radio-button>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>

        <InsurancePlanFrom
          v-if="tabModel === '1' && productMode === 'RC' && rcPlanDtoList !== null"
          :insurance-plan="rcPlanDtoList"
          :default-select="planDefaultSelect"
          :plan-type="'InsurancePlan'"
          :mode="'edit'"
          :clear-selected="dateChanged"
          @selected="getSelected"
        />
        <InsuranceItemFrom
          v-if="tabModel === '2' && productMode === 'RC' && rcInsPlanDtoList !== null"
          :insurance-item="rcInsPlanDtoList"
          :product-type="productMode"
          :mode="'edit'"
          :clear-selected="dateChanged"
          @selected="getSelected"
        />
        <PlanFrom
          v-if="tabModel === '1' && productMode === 'CB' && cbPlanDtoList !== null && cbPlanDtoList.length !== 0"
          :plan-type="'Plan'"
          :insurance-plan="cbPlanDtoList"
          :default-select="planDefaultSelect"
          :mode="'edit'"
          :clear-selected="dateChanged"
          @selected="getSelected"
        />
        <InsuranceItemFrom
          v-if="tabModel === '2' && productMode === 'CB' && cbInsPlanDtoList !== null && cbInsPlanDtoList.length !== 0"
          :insurance-item="cbInsPlanDtoList"
          :product-type="productMode"
          :clear-selected="dateChanged"
          :mode="'edit'"
          @selected="getSelected"
        />

        <div class="row">
          <div class="col-12 col-lg-10 offset-0 offset-lg-1">
            <div class="mt-4">
              變更日期
            </div>
            <div>
              <a-form-model
                ref="ruleForm"
                :model="form"
                :layout="'vertical'"
                :rules="formRules"
              >
                <a-form-model-item prop="date">
                  <date-picker
                    v-model="form.date"
                    type="date"
                    :formatter="formatter"
                    :allow-clear="false"
                  />
                </a-form-model-item>
              </a-form-model>
            </div>
          </div>
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
import {
	PolicyContentQueryModel, CbPlanCheckModel, ItemPlanCheckModel, RcPlanCheckModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import EmployeeDataForm from '@/forms/EmployeeEnrollment/EmployeeDataForm.vue';
import FamilyDataForm from '@/forms/EmployeeEnrollment/FamilyDataForm.vue';
import InsurancePlanFrom from '@/forms/EmployeeEnrollment/InsurancePlanFrom.vue';
import InsuranceItemFrom from '@/forms/EmployeeEnrollment/InsuranceItemFrom.vue';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import PlanFrom from '@/forms/EmployeeEnrollment/PlanFrom.vue';
import notification from '@/plugins/info/infoNotification';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
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
		Breadcrumb, EmployeeDataForm, InsurancePlanFrom, InsuranceItemFrom, PlanFrom, FamilyDataForm, UserDataCard,
	},
})
export default class EmployeeEnrollmentApplication extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  // 時間format格式
  formatter = this.$twDateFormatter;

  productMode: 'RC' | 'CB' = 'RC';

  tabModel: '1' | '2' = '1'; // 1: CB專案別orRC保險計劃, 2: CB險種計劃orRC險種計劃

  empInfo = null; // 員工資料

  empFamilyInfo = null; // 員眷資料

  rcPlanDtoList = null; // RC保險計劃

  rcInsPlanDtoList = null; // RC險種計劃

  cbPlanDtoList = null; // CB專案別

  cbInsPlanDtoList = null; // CB險種計劃

  selectedProject = null; // 選擇之專案計畫

  planDefaultSelect = null; // 初始選擇"保險計畫"or專案別資料

  // 0: 員工查詢功能, 1: 歷史異動編輯
  fromWhere = 0;

  form = {
  	date: null,
  };

	oldDate = null;

  formRules = {
  	date: [{ required: true, message: '請填入有效變更日期' }],
  };

	appNo = null;

	dateChanged = false; // 有無變動過日期

	@Watch('form.date', { deep: true })
	async onValChange(val) {
		const newDate = moment(val).format(
  		'YYYY-MM-DDTHH:mm:ss.sssZ',
  	);
		if (newDate !== this.oldDate) {
			console.log('有更動日期');
			this.dateChanged = true;
			// this.planDefaultSelect = null;
			// this.selectedProject = null;
			if (this.oldDate !== null) {
				notificationModal.alertForSingleError({
					title: '提示',
					content: '變更日期已異動，請重新確認資訊是否正確',
				});
			}
			this.oldDate = newDate;
			await this.getInsruranceContent();
		}
	}

	getSelected(val) {
  	this.selectedProject = val;
  	console.log(this.selectedProject);
	}

	async getUserInfo() {
		// const query = typeof (this.$global.getQuery()) === 'string' ? JSON.parse(await this.$encryptionDecryption.decrypt(this.$global.getQuery())) : this.$global.getQuery();

		// console.log(query);

		if (typeof (this.$global.getQuery()) === 'string') {
			const query = JSON.parse(await this.$encryptionDecryption.decrypt(this.$global.getQuery()));
			console.log(query.empFamilyInfo);
			this.empInfo = query.empInfo === undefined ? query : query.empInfo;
			this.empFamilyInfo = query.empFamilyInfo === undefined ? null : query.empFamilyInfo;
		} else {
			const query = this.$global.getQuery();
			const empInfo = JSON.parse(await this.$encryptionDecryption.decrypt(query.empInfo));
			const empFamilyInfo = JSON.parse(await this.$encryptionDecryption.decrypt(query.empFamilyInfo));
			this.empInfo = empInfo === undefined ? JSON.parse(await this.$encryptionDecryption.decrypt(query)) : empInfo;
			this.empFamilyInfo = empFamilyInfo === undefined ? null : empFamilyInfo;
		}

  	this.setLoading(true);

  	// 1. 檢查是否有申請退保
  	// 2. 檢查該被保人是否已申請投保內容變更
  	await this.checkIfSurrender();
  	await this.checkIfChangeInsrurance();

  	this.setLoading(false);

  	// 3. 取得可投保內容
		if (this.$global.getParam().fromPage == 'CO_EFTodayResultTable' || this.$global.getQuery().initProject) {
  		this.getInsruranceContent();
		} else {
			this.form.date = this.getTomorrow();
		}
	}

	getTomorrow() {
  	const tomorrow = new Date();
  	tomorrow.setDate(tomorrow.getDate() + 1);
  	return tomorrow;
	}

	// 查該被保人是否已申請投保內容變更
	async checkIfChangeInsrurance() {
  	// 檢查該被保人是否已申請投保內容變更
  	if (this.fromWhere === 1) return; // 從異動編輯來的不用檢核
  	const searchTarget = this.empFamilyInfo === null ? this.empInfo : this.empFamilyInfo;
  	console.log(searchTarget);
  	const data = {
  		crtNo: searchTarget.input.crtNo,
  		crtSeq: searchTarget.input.crtSeq,
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
  	await this.$coUtilityApi.checkAlreadyApplyUsingPOST(data, '1')
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (!resp.data.data) {
  					notification.error({
  						Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					});
  					this.$router.replace({ name: 'CO_EFPolicyChangeQuery' });
  				}
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  				 this.$router.replace({ name: 'CO_EFPolicyChangeQuery' });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
	}

	// 檢查是否有申請退保
	async checkIfSurrender() {
		console.log(this.empFamilyInfo);
  	const searchTarget = this.empFamilyInfo === null ? this.empInfo : this.empFamilyInfo;
  	console.log(searchTarget);
  	const data = {
  		crtNo: searchTarget.input.crtNo,
  		crtSeq: searchTarget.input.crtSeq,
  		policyModel: this.$userInfo.getPolicyModel(),
  	};
  	await this.$coUtilityApi.checkSurrenderedOrNotUsingPOST(data)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				if (!resp.data.data) {
  					notification.error({
  						Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					});
  					window.history.go(-1);
  				}
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  	     window.history.go(-1);
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		});
	}

	// 取得可投保內容
	getInsruranceContent() {
  	const searchTarget = this.empFamilyInfo === null ? this.empInfo : this.empFamilyInfo;

  	const data: PolicyContentQueryModel = { // 先寫固定資料
  		attribute: searchTarget.input.attribute,
  		scIns: searchTarget.input.scIns,
  		policyModel: this.$userInfo.getPolicyModel(),
  		crtNo: searchTarget.input.crtNo,
			updateDate: this.form.date !== null ? moment(this.form.date).format(
  				'YYYY-MM-DDTHH:mm:ss.sssZ',
  			) : null,
			input: searchTarget.input,
  	};
  	data.appNo = searchTarget.appNo ? searchTarget.appNo : null;

		this.appNo = searchTarget.appNo ? searchTarget.appNo : null;

  	console.log(data);
  	this.setLoading(true);

  	this.$coUtilityApi
  		.getPolicyContentForInsUsingPOST(data)
  		.then((resp) => {
  			this.rcPlanDtoList = resp.data.data.rcPlanDtoList;
  			this.rcInsPlanDtoList = resp.data.data.rcInsPlanDtoList;
  			this.cbInsPlanDtoList = resp.data.data.cbInsPlanDtoList;
  			this.cbPlanDtoList = resp.data.data.cbPlanDtoList;

				// 異動編輯過來的會有預設值
  			if (this.rcPlanDtoList !== null && this.form.date === null && this.fromWhere == 1) {
  				this.planDefaultSelect = this.rcPlanDtoList.find((e) => (e.planCode === resp.data.data.planCode));
  			}
				// 異動編輯過來的會有預設值
  			if (this.cbPlanDtoList !== null && this.form.date === null && this.fromWhere == 1) {
  				this.planDefaultSelect = this.cbPlanDtoList.find((e) => (e.planCode + e.plan === resp.data.data.planCode + resp.data.data.plan));
  			}

  			if (!resp.data.data.planCode && data.appNo) {
  				this.tabModel = '2';
  			}
  			if (resp.data.data.updateDate !== null && this.form.date === null && this.fromWhere == 1) {
					// 異動編輯過來的會有預設日期
  				this.form.date = new Date(resp.data.data.updateDate);
					this.oldDate = moment(resp.data.data.updateDate).format(
						'YYYY-MM-DDTHH:mm:ss.sssZ',
					);
  			}
				if (this.productMode === 'CB') {
					// 如果今天是CB保單，後端有回專案的話，投保內容只能顯示專案，他就不能切險種，反之亦然
					this.cbPlanDtoList.length !== 0 ? this.tabModel = '1' : this.tabModel = '2';
				}
				if (this.form.date === null) {
					this.getInitProject();
				}
				console.log(this.planDefaultSelect);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	send() {
  	const selectedProject = this.tabModel === '1' ? this.selectedProject : this.selectedProject.filter((e) => e.itemSelectedModel !== '不投保');
  	if (selectedProject === null || selectedProject.length === 0) {
  		notification.error({ Content: '請選擇投保變更項目' });
  	}
  	const policyDetail = this.$user.getPolicyDetail();

  	const data: any = {
  		input: this.empFamilyInfo !== null ? this.empFamilyInfo.input : this.empInfo.input,
  		policyNo: policyDetail.poliId.toString(),
  		policySeq: policyDetail.poliSeq,
  		times: policyDetail.times,
			updateDate: moment(this.form.date).format(
  				'YYYY-MM-DDTHH:mm:ss.sssZ',
  			),
  	};
  	data.appNo = this.appNo;
  	let targetApi = '';

  	if (this.tabModel === '1') {
  		// 保險計畫/專案別
  		data.planDto = selectedProject;
  	} else {
  		// 顯種計畫
  		const arr = [];
  		selectedProject.forEach((element) => {
  			if (element.insPlanItemDtoList !== null) {
  				element.insPlanItemDto = element.insPlanItemDtoList.find((e) => (element.item + e.plan + e.vrsn) === element.itemSelectedModel);
  			} else {
  				element.insPlanItemDto.sa = element.itemSelectedModel;
  			}
  		});
  		data.insPlanDtoList = selectedProject;
  	}

  	if (this.tabModel === '1' && this.productMode === 'RC') {
  		targetApi = 'checkRcPlanUsingPOST';
  	} else if (this.tabModel === '1' && this.productMode === 'CB') {
  		targetApi = 'checkCbPlanUsingPOST';
  	} else {
  		targetApi = 'checkItemPlanUsingPOST';
  	}
  	this.setLoading(true);
  	this.$empFamilyPolicyChangeApi[targetApi](data)
  		.then((resp) => {
  			// 檢核通過到確認頁
  			console.log(resp);
  			if (resp.data.status === 200) {
  	      	this.goNextPage(selectedProject, resp.data.data.isHlNtc);
  			} else {
  	      	notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			// this.isSending = false;
  			this.setLoading(false);
  		});
	}

	async goNextPage(selectedProject, isHlNtc) {
  	// 加密初始資料(員工/眷屬個資)
		const empInfo = await this.$encryptionDecryption.encrypt(JSON.stringify(this.empInfo));
		const empFamilyInfo = await this.$encryptionDecryption.encrypt(JSON.stringify(this.empFamilyInfo));
  	const query = {
  		empInfo,
  		empFamilyInfo,
  		initProject: {
  			tabModel: this.tabModel,
  			date: this.form.date,
  			selectedProject,
  			rcInsPlanDtoList: this.rcInsPlanDtoList,
  			cbInsPlanDtoList: this.cbInsPlanDtoList,
  		},
  		isHlNtc,
  	};
  	// 儲存記住初始資料於本頁
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'self',
  		query,
  	});

  	// 儲存加密資料到確認頁
  	const queryData = {
  		empInfo,
  		empFamilyInfo,
  		selectedProject,
  		date: DateTimeFormmat.transformRocDate(
  			moment(this.form.date).format(
  				'YYYY-MM-DDTHH:mm:ss.sssZ',
  			),
  		),
  		productMode: this.productMode,
  		plan: this.tabModel,
  		isHlNtc,
			appNo: this.appNo,
  	};
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EmployeeInsuredContentChangeComfirm',
  		query: queryData,
  	});
	}

	disabledDate(current) {
		return current && current < moment().startOf('day');
	}

	onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.send();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
	}

	async getInitProject() {
		console.log('getinit');
  	// const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	// const query = JSON.parse(decryptString);
		const query = this.$global.getQuery();

  	if (!query.initProject) return;
  	this.tabModel = query.initProject.tabModel;
  	if (this.tabModel === '1') {
  		this.planDefaultSelect = query.initProject.selectedProject;
  	} else {
  		this.rcInsPlanDtoList = query.initProject.rcInsPlanDtoList;
  		this.cbInsPlanDtoList = query.initProject.cbInsPlanDtoList;
  	}
  	this.form.date = new Date(query.initProject.date);
		this.oldDate = moment(query.initProject.date).format(
			'YYYY-MM-DDTHH:mm:ss.sssZ',
		);
	}

	created() {
  	if (this.$global.getParam() === null) {
  		notification.error({
  			Content: '無查詢條件，請重新查詢',
  			onCallback: () => {
  				this.$router.push({ path: '/empFamilyPolicyChangeQuery' }).catch((err) => { err; });
  			},
  		});
  		return;
  	}
  	if (this.$global.getParam().fromPage == 'CO_EFTodayResultTable') {
  		this.fromWhere = 1;
  	}
  	this.getUserInfo();
  	this.productMode = this.$userInfo.getProject(); // 取得專案類型 CB or RC
  	// this.productMode = 'CB';
  	console.log(this.productMode);
	}

	updated() {
  	window.parseWord();
	}

	back() {
  	window.history.go(-1);
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
.insured__content {
  margin-top: 10px;
}
.insuredContent__wrap {
  max-width: 100%;
  width: 900px;
  margin: auto;
}
</style>
