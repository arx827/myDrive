<template>
  <div class="container">
    <div class="page__title">
      新增個人歷程_{{ pagetitle }}
    </div>
    <div class="table">
      <div class="table__title d-flex">
        <div class="table__title__left">
          項目
        </div>
        <div class="table__title__right">
          紀錄值
        </div>
      </div>
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
      >
        <div class="table__option d-flex">
          <div class="table__option__left pt-2">
            姓名
          </div>
          <div class="table__option__right">
            <a-form-model-item
              prop="name"
              :rules="formRules.name"
            >
              <a-input
                v-model="form.name"
                vue="true"
                alt="webfont"
                class="input__block"
                :disabled="true"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="table__option d-flex">
          <div class="table__option__left pt-2">
            {{ paramsType==='abnormal' ? '員工編號/身分證字號' : '員工編號' }}
          </div>
          <div class="table__option__right">
            <a-form-model-item
              prop="sid"
              :rules="formRules.sid"
            >
              <a-input
                v-model="form.sid"
                class="input__block"
                :disabled="true"
              />
            </a-form-model-item>
          </div>
        </div>
        <div
          v-if="paramsType==='abnormal'"
          class="table__option d-flex"
        >
          <div class="table__option__left pt-2">
            對應加班資料(年/月)
          </div>
          <div class="table__option__right">
            <a-form-model-item
              prop="month"
              :rules="formRules.month"
            >
              <date-picker
                v-model="form.month"
                placeholder="e.g. 2022/01"
                type="month"
                :format="'YYYY/MM'"
                :allow-clear="true"
                class="month__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div
          v-if="paramsType==='mother'"
          class="table__option d-flex"
        >
          <div class="table__option__left pt-2">
            狀態
          </div>
          <div class="table__option__right">
            <a-form-model-item
              prop="status"
              :rules="formRules.status"
            >
              <a-radio-group
                v-model="form.status"
                :disabled="true"
              >
                <a-radio value="在職">
                  在職
                </a-radio>
                <a-radio value="育嬰留停">
                  育嬰留停
                </a-radio>
                <a-radio value="留職停薪">
                  留職停薪
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
        <div
          v-if="paramsType==='mother'"
          class="table__option d-flex"
        >
          <div class="table__option__left pt-2">
            身份別(資料取得時)
          </div>
          <div class="table__option__right">
            <a-form-model-item
              prop="identity"
              :rules="formRules.identity"
            >
              <a-radio-group v-model="form.identity">
                <a-radio value="妊娠中">
                  妊娠中
                </a-radio>
                <a-radio value="產後一年">
                  產後一年
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
    </div>
    <div class="btn__wrap text-center">
      <router-link :to="'/occupationSafety/Other/caseMaintain/list'">
        <button class="btn__radius--primary--outline mb-2">
          取消
        </button>
      </router-link>
      <button
        class="btn__radius--primary mb-2"
        @click="onSubmit"
      >
        確認
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	UserIdWithMonPlanCaseType,
	UserIdWithMonPlanCaseTypePregnantCategoryEnumEnum,
	UserQueryModel,
	EmpWoInfoListDto,
} from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component({})
export default class addPersonalResume extends Vue {
  @Action('setLoading') setLoading;

  // 標題
  pagetitle = '';

  paramsType = '';

  setParam() {
  	this.paramsType = this.$route.params.type;
  	this.pagetitle = this.paramsType === 'abnormal' ? '異常負荷預防' : '母性健康保護';
  	const query = this.$global.getQuery();
  	if (query) {
  		this.userId = query.uid;
  	}
  }

  userId = 0;

  // 表單欄位資料
  form = {
  	name: null,
  	sid: null,
  	month: null,
  	status: null,
  	identity: null,
  }

  formRules= {
  	name: [{ required: true, trigger: 'change', message: '姓名不能空白' }],
  	sid: [{ required: true, trigger: 'change', message: '員工編號不能空白' }],
  	month: [{ required: true, trigger: 'change', message: '對應加班資料(年/月)  不能空白' }],
  	status: [{ required: true, trigger: 'change', message: '狀態不能空白' }],
  	identity: [{ required: true, trigger: 'change', message: '身份別(資料取得時)不能空白' }],
  }

  // API: 異常_新增個人歷程
  fetchAddPersonal() {
  	this.setLoading(true);
  	const $formData: EmpWoInfoListDto = {
  		dataMonth: moment(this.form.month).format('YYYYMM'),
  		uid: this.userId,
  	};
  	this.$AlRpnCaseInquiryControllerApi.addPersonalJourneyUsingPOST($formData)
  		.then((resp) => {
  			// TEST:
  			console.log(resp.data);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'CaseMaintainResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  				params: {
  					type: 'add',
  				},
  			});
  		})
    	.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 母性_新增個人歷程
  fetchNewCase() {
  	const data: UserIdWithMonPlanCaseType = {
  		monPlanLeaveInfo: null,
  		pregnantCategoryEnum: (this.form.identity === '產後一年') ? UserIdWithMonPlanCaseTypePregnantCategoryEnumEnum.MOTHER : UserIdWithMonPlanCaseTypePregnantCategoryEnumEnum.PREGNANT,
  		userId: this.userId,
  		warning: true,
  	};
  	this.setLoading(true);
  	// 根據UserId建立新個案
  	this.$MONPLANRpnMaintainApi.newCaseUsingPOST(data)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'CaseMaintainResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  				params: {
  					type: 'add',
  				},
  			});
  			console.log(resp.data.data);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			switch (this.paramsType) {
  			case 'abnormal':
  				this.fetchAddPersonal();
  				break;
  			case 'mother':
  				this.fetchNewCase();
  				break;
  			default:
  				break;
  			}
  		}
  	});
  }

  getUserData() {
  	this.setLoading(true);
  	console.log('this.userId', this.userId);
  	this.$UserApi.getUserInfoUsingPOST({ userId: this.userId })
  		.then((resp) => {
  			console.log('UserInfo', resp.data.data);
  			this.form.name = resp.data.data.name;
  			this.form.sid = resp.data.data.empId ? resp.data.data.empId : resp.data.data.idNo;
  			if (resp.data.data.jobStatus === 'EMIO1') {
  				this.form.status = '在職';
  			} else if (resp.data.data.jobStatus === 'EMIO4') {
  				this.form.status = '留職停薪';
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
  	this.setParam();
  	this.getUserData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .table__title {
    background-color: $COLOR_MAIN1;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    .table__title__left {
      width: 40%;
      color: white;
      padding-right: 16px;
      text-align: right;
    }
    .table__title__right {
      width: 60%;
      padding-left: 16px;
      color: white;
    }
  }
  .table__option {
    font-size: 16px;
    border-bottom: #00000017 solid 1px;
    .table__option__left {
      background-color: #F5F8FC;
      width: 40%;
      padding-right: 16px;
      text-align: right;
    }
    .table__option__right {
      width: 60%;
      padding-left: 16px;
    }
  }
  .input__block {
    width: 100%;
  }
  .month__block {
    width: 50%;
  }
  .btn__wrap {
    margin: 40px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
  }
  ::v-deep {
    .ant-form-item {
      margin-bottom: 0px;
    }
  }
</style>
