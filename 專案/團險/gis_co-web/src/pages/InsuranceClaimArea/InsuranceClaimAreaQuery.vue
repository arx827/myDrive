<template>
  <div class="insuranceClaimArea">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap">
        <h2 class="query__title">
          您想查詢的理賠資料？
        </h2>
        <p class="info__txt primary__txt text-center">
          請擇一填寫
        </p>
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
        >
          <a-form-model-item prop="option">
            <a-radio-group
              v-model="form.option"
              class="query__list"
            >
              <a-radio
                class="query__item"
                value="insName"
              >
                員工姓名
                <a-popover
                  trigger="click"
                  placement="top"
                >
                  <template slot="content">
                    <div>原住民特殊字元可以複製以下字元使用</div>
                    <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                  </template>
                  <a-icon
                    type="info-circle"
                    :style="{ color: '#4CAAF5' }"
                    @click="isreplyTypeModal = true"
                  />
                </a-popover>
                <a-form-model-item
                  v-if="form.option === 'insName'"
                  class="query__item-content"
                  prop="insName"
                >
                  <a-input
                    v-model="form.insName"
                    vue="true"
                    alt="webfont"
                    block
                    class="input--full"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="accidName"
              >
                事故人姓名
                <a-popover
                  trigger="click"
                  placement="top"
                >
                  <template slot="content">
                    <div>原住民特殊字元可以複製以下字元使用</div>
                    <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                  </template>
                  <a-icon
                    type="info-circle"
                    :style="{ color: '#4CAAF5' }"
                    @click="isreplyTypeModal = true"
                  />
                </a-popover>
                <a-form-model-item
                  v-if="form.option === 'accidName'"
                  class="query__item-content"
                  prop="accidName"
                >
                  <a-input
                    v-model="form.accidName"
                    vue="true"
                    alt="webfont"
                    block
                    class="input--full"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="accidIdno"
              >
                事故人身分證字號/居留證號碼
                <a-form-model-item
                  v-if="form.option === 'accidIdno'"
                  class="query__item-content"
                  prop="accidIdno"
                >
                  <a-input
                    v-model="form.accidIdno"
                    block
                    class="input--full"
                    @input="form.accidIdno = $event.target.value.toUpperCase()"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="acptData"
              >
                受理期間
                <a-form-model-item
                  v-if="form.option === 'acptData'"
                  class="query__item-content"
                >
                  <a-radio-group
                    v-model="form.acptData"
                    default-value="3"
                  >
                    <a-radio
                      value="3"
                    >
                      三個月
                    </a-radio>
                    <a-radio
                      value="6"
                    >
                      半年
                    </a-radio>
                    <a-radio
                      value="12"
                    >
                      一年
                    </a-radio>
                    <a-radio
                      value="24"
                    >
                      二年
                    </a-radio>
                    <div class="d-flex mt-2">
                      <a-radio
                        value="other"
                        class="mt-2"
                      >
                        其他
                      </a-radio>
                      <a-form-model-item
                        prop="acptDataRange"
                        class="accepDate--mb"
                      >
                        <date-picker
                          v-model="form.acptDataRange"
                          type="date"
                          :range="true"
                          :formatter="formatter"
                          :allow-clear="true"
                          :disabled-date="disabledAfterToday"
                          class="datepicker--full"
                        />
                      </a-form-model-item>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div class="border_bottom-dashed" />
          <a-form-model-item
            class="query__item-content"
          >
            <div class="query__caseSts">
              結案狀態
              <a-radio-group
                v-model="form.caseSts"
              >
                <a-radio
                  value="1"
                >
                  已結案
                </a-radio>
                <a-radio
                  value="2"
                >
                  未結案
                </a-radio>
                <a-radio
                  value="3"
                >
                  全部
                </a-radio>
              </a-radio-group>
            </div>
          </a-form-model-item>
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary main__btn"
              @click="onSearch"
            >
              查詢
            </button>
          </div>
          <div class="bottom__text">
            僅提供受理日前兩年之資料
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { InsuranceClaimModel, UserInfoDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Action } from 'vuex-class';
import modal from '@/plugins/info/infoModal';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/info/infoNotification';
import InsuranceClaimAreaResultTable from './InsuranceClaimAreaResultTable.vue';

export interface formModel {
	option: string;
  insName: string;
  accidName: string;
  accidIdno: string;
  acptData: string;
  acptDataRange: Date[];
  caseSts: string;
}

export enum SelectType {
  INSNAME = 'A',
  ACCINAME = 'B',
  ACCIDIDNO = 'C',
  ACPTDATA = 'D',
}

@Component({ components: { Breadcrumb } })
export default class InsuranceClaimAreaQuery extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  //  當前登入者資料
  currentLoginData: UserInfoDto;

  // 查詢條件
  queryInsuranceClaim: InsuranceClaimModel={}

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 表單
  form: formModel = {
  	option: 'insName',
  	insName: null,
  	accidName: null,
  	accidIdno: null,
  	acptData: '3',
  	acptDataRange: null,
  	caseSts: '1',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	option: [{ required: true, message: '請選擇您想查詢的理賠資料', trigger: 'change' }],
  	insName: [{ required: true, message: '請填入有效員工姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  	accidName: [{ required: true, message: '請填入有效事故人姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  	accidIdno: [{ required: true, message: '請填入有效事故人身分證字號/居留證號碼' }, { pattern: /^[A-Za-z0-9]+$/, message: '僅能填入半形英數' }],
  	acptData: [{ required: true, message: '請填入有效受理期間' }],
  	acptDataRange: [{ required: true, message: '請填入有效受理期間', validator: this.accepDateRule }],
  }

  created() {
  	if (sessionStorage.getItem('login_state')) {
  		this.currentLoginData = JSON.parse(sessionStorage.getItem('login_state')).me;
  		// console.log('this.currentLoginData', this.currentLoginData);
  		// 查詢需登錄薪資的Modal
  	}
  }

  updated() {
  	window.parseWord();
  }

  // 受理時間必填規則
  accepDateRule(rule, value, callback) {
  	if (this.form.option === 'acptData' && this.form.acptData === 'other') {
  		if (this.form.acptDataRange !== null && this.form.acptDataRange !== undefined) {
  			if (this.form.acptDataRange[0] !== null && this.form.acptDataRange[1] !== null) { callback(); } else {
  			  callback('請填入有效受理期間');
  			}
  		} else {
  			callback('請填入有效受理期間');
  		}
  	} else {
  		callback();
  	}
  }

  // 時間選擇日期不得大於今天
  disabledAfterToday(date) {
  	const today = new Date();
  	today.setHours(0, 0, 0, 0);
  	const tempToday = new Date();
  	tempToday.setHours(0, 0, 0, 0);
  	const minYear = new Date(tempToday.setFullYear(tempToday.getFullYear() - 2));
  	return date > today || date < minYear;
  }

  onSearch() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.setQuery();
  		} else {
  			console.log('error', this.form);
  		}
  	});
  }

  setQuery() {
  	switch (this.form.option) {
  	case 'insName':
  		this.queryInsuranceClaim.selectType = SelectType.INSNAME;
  		this.queryInsuranceClaim.inputContent = this.form.insName;
  		break;
  	case 'accidName':
  		this.queryInsuranceClaim.selectType = SelectType.ACCINAME;
  		this.queryInsuranceClaim.inputContent = this.form.accidName;
  		break;
  	case 'accidIdno':
  		this.queryInsuranceClaim.selectType = SelectType.ACCIDIDNO;
  		this.queryInsuranceClaim.inputContent = this.form.accidIdno;
  		break;
  	case 'acptData':
  		const monthRange = parseInt(this.form.acptData);
  	  const today = new Date();
  	  let startDate;
  	  let endDate;
  		// 受理時間是否填其他
  		if (this.form.acptData === 'other') {
  			startDate = DateTimeFormmat.filterRangeDate(this.form.acptDataRange)[0];
  		  endDate = DateTimeFormmat.filterRangeDate(this.form.acptDataRange)[1];
  		} else {
  			endDate = today.toISOString();
  			startDate = this.getStartMonth(today, monthRange).toISOString();
  		}
  		this.queryInsuranceClaim.selectType = SelectType.ACPTDATA;
  		this.queryInsuranceClaim.acptEndDate = endDate;
  		this.queryInsuranceClaim.acptStartDate = startDate;
  		break;
  	default:
  		break;
  	}
  	this.queryInsuranceClaim.claimStatus = this.form.caseSts;

  	this.queryInsuranceClaim = {
  		...this.queryInsuranceClaim,
  	  policyNo: this.$userInfo.getPolicyModel().policyNo.toString(),
  		policySeq: this.$userInfo.getPolicyModel().policySeq,
  		times: this.$userInfo.getPolicyModel().times,
  	};

  	this.setLoading(true);

  	// 查詢理賠紀錄與進度
  	this.$insuranceClaimAreaApi.getRecordAndProgressUsingPOST(this.queryInsuranceClaim, 0, 1)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				console.log(resp);
  				if (resp) {
  					// 有資料前往查詢結果Table頁
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'InsuranceClaimAreaResultTable',
  						query: this.queryInsuranceClaim,
  					});
  				} else {
  					// 查無資料Modal
  					modal.alertForSingleError({
  						title: '查詢結果',
  						content: '查詢無資料',
  					});
  				}
  			} else {
  				notification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  			this.setLoading(false);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			this.setLoading(false);
  		})
  		.finally(() => {
  			// this.setLoading(false);
  		});
  }

  getStartMonth(date, offset) {
  	if (date instanceof Date && !isNaN(offset)) {
  		console.log(date);
  		const givenMonth = date.getMonth();
  		const newMonth = givenMonth - offset;
  		date.setMonth(newMonth);
  		console.log(date);
  		return date;
  	}
  	return null;
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
  .insuranceClaimArea::v-deep {
    .ant-form{
      width: 100%;
      margin:0 auto;
    }
    .ant-form-item{
      margin-bottom: 0 !important;
    }
  }
  .input--full{
    width: 100%;
    max-width: 298px;
  }
  .datepicker--full{
    width: 115%;
  }
  .border_bottom-dashed{
    border-bottom: 1px dashed #CECECE;
    width: 64%;
    max-width: 904px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .query__caseSts {
    margin-top: 14px;
    .ant-radio-group {
    margin-left: 6px;
    margin-top: 4px;
   }
  }
  .main__btn{
    margin-top: 56px;
  }
  .bottom__text{
    font-size: 13px;
    display: flex;
    justify-content: center;
  }

</style>
