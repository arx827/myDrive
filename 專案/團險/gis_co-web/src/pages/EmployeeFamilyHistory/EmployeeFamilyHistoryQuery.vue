<template>
  <div class="employeefamilyhistory">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap">
        <h2 class="query__title">
          您想查詢的歷史異動？
        </h2>
        <p class="info__txt primary__txt text-center">
          請擇一填寫
        </p>
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
          :label-col="{
            xs: {span: 0}
          }"
          :wrapper-col="{
            xs: {span: 24}
          }"
        >
          <a-form-model-item prop="option">
            <a-radio-group
              v-model="form.option"
              class="query__list"
            >
              <a-radio
                class="query__item"
                value="changeTime"
              >
                申請異動受理期間
                <a-form-model-item
                  v-if="form.option === 'changeTime'"
                  class="query__item-content"
                >
                  <a-radio-group
                    v-model="form.changeTime"
                  >
                    <a-radio
                      value="1"
                    >
                      一個月
                    </a-radio>
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
                    <div class="d-flex mt-2">
                      <a-radio
                        value="other"
                        class="mt-2"
                      >
                        其他
                      </a-radio>
                      <a-form-model-item
                        prop="changeTimeRange"
                        class="accepDate--mb"
                      >
                        <date-picker
                          v-model="form.changeTimeRange"
                          type="date"
                          :range="true"
                          :formatter="formatter"
                          :allow-clear="true"
                          class="datepicker--full"
                          :disabled-date="disabledAfterToday"
                        />
                      </a-form-model-item>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="idno"
              >
                身分證字號/居留證號碼
                <a-form-model-item
                  v-if="form.option === 'idno'"
                  class="query__item-content"
                  prop="idno"
                >
                  <a-input
                    v-model="form.idno"
                    block
                    :style="{ width: '100%'}"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="insName"
              >
                被保人姓名
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
                >
                  <a-input
                    v-model="form.insName"
                    vue="true"
                    alt="webfont"
                    max-legnth="100"
                    block
                    :style="{ width: '100%'}"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="appNo"
              >
                受理號碼
                <div
                  v-if="form.option === 'appNo'"
                  class="query__item-content d-flex"
                >
                  <a-form-model-item
                    class="input--inline"
                    prop="appNoStart"
                  >
                    <a-input
                      v-model="form.appNoStart"
                      max-legnth="20"
                    />
                  </a-form-model-item>
                  <div class="input--dash">
                    －
                  </div>
                  <a-form-model-item
                    class="input--inline"
                    prop="appNoEnd"
                  >
                    <a-input
                      v-model="form.appNoEnd"
                      max-legnth="20"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                value="applyFor"
              >
                申請方式
                <a-form-model-item
                  v-if="form.option === 'applyFor'"
                  class="query__item-content"
                  prop="applyFor"
                >
                  <a-radio-group
                    v-model="form.applyFor"
                  >
                    <a-radio
                      value="S"
                    >
                      單筆
                    </a-radio>
                    <a-radio
                      value="M"
                    >
                      批次上傳
                    </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary"
              @click="onSearch"
            >
              查詢
            </button>
          </div>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { HistoryTransactionQueryModel } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

export interface formModel {
	option: string;
  changeTime: string;
  changeTimeRange: Date[];
  idno: string;
  insName: string;
  appNoStart: string;
  appNoEnd: string;
  applyFor: string;
}

@Component({ components: { Breadcrumb } })
export default class EmployeeFamilyHistoryQuery extends Vue {
  @Prop()
  breadcrumb: {}

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 表單
  form: formModel = {
  	option: 'changeTime',
  	changeTime: '1',
  	changeTimeRange: null,
  	idno: null,
  	insName: null,
  	appNoStart: null,
  	appNoEnd: null,
  	applyFor: '1',
  };

  // 查詢條件
  submitForm: HistoryTransactionQueryModel = {};

  // 表單檢驗規則
  formRules: { [key: string]: ValidationRule[] } = {
  	option: [{ required: true, message: '請選擇您想查詢的歷史異動', trigger: 'change' }],
  	changeTimeRange: [
  		{ trigger: 'change', validator: this.accepDateRule },
  	],
  	idno: [
  		{ message: '請填寫身分證字號/居留證號碼', trigger: 'blur', validator: this.idnoRule },
  		{ pattern: /^[A-Za-z0-9]+$/, message: '僅能填入英數' },
  		// { pattern: /^([a-zA-Z]|\d){10}$/g, message: '僅能填入英數' },
  	],
  	appNoStart: [
  		{ trigger: 'blur', validator: this.appNoStartRule },
  		{ pattern: /^[0-9]+$/, message: '僅能填入數字' },
  	],
  	appNoEnd: [
  		{ trigger: 'blur', validator: this.appNoEndRule },
  		{ pattern: /^[0-9]+$/, message: '僅能填入數字' },
  	],
  };

  // 身分證必填規則
  idnoRule(rule, value, callback) {
  	if (this.form.option === 'idno') {
  		if (this.form.idno !== null && this.form.idno !== '' && this.form.idno !== undefined) {
  			callback();
  		} else {
  			callback('請填寫身分證字號/居留證號碼');
  		}
  	}
  }

  // 受理時間必填規則
  accepDateRule(rule, value, callback) {
  	if (this.form.option === 'changeTime' && this.form.changeTime === 'other') {
  		if (this.form.changeTimeRange !== null && this.form.changeTimeRange !== undefined) {
  			if (this.form.changeTimeRange[0] !== null && this.form.changeTimeRange[1] !== null) { callback(); } else {
  			  callback('請填寫申請異動受理期間');
  			}
  		} else {
  			callback('請填寫申請異動受理期間');
  		}
  	}
  }

  // 時間選擇日期不得大於今天
  disabledAfterToday(date) {
  	const today = new Date();
  	today.setHours(0, 0, 0, 0);
  	const tempToday = new Date();
  	tempToday.setHours(0, 0, 0, 0);
  	const lastYear = new Date(tempToday.setFullYear(tempToday.getFullYear() - 1));
  	console.log('lastYear', lastYear);
  	return date > today || date < lastYear;
  }

  // 受理號碼驗證
  appNoStartRule(rule, value, callback) {
  	if (this.form.option === 'appNo') {
  		if (value == null || value == '' || value == undefined) {
  			callback('請填寫受理號碼');
  		} else if (this.form.appNoEnd !== null) {
  			if (parseInt(value) > parseInt(this.form.appNoEnd)) {
  			  callback('起始受理號碼不可大於結束受理號碼');
  			} else {
  				callback();
  				(this.$refs.formRef as any).validateField('appNoEnd');
  			}
  		} else {
  			callback();
  		}
  	}
  }

  appNoEndRule(rule, value, callback) {
  	if (this.form.option === 'appNo') {
  		if (value == null || value == '' || value == undefined) {
  			callback('請填寫受理號碼');
  		} else if (this.form.appNoStart !== null) {
  			if (parseInt(value) < parseInt(this.form.appNoStart)) {
  			  callback('結束受理號碼不可小於起始受理號碼');
  			} else {
  				callback();
  				(this.$refs.formRef as any).validateField('appNoStart');
  			}
  		} else {
  			callback();
  		}
  	}
  }

  // 送出查詢資料
  onSearch() {
  	const vm = this;
  	console.log('form', vm.form);
  	if (vm.form.option === 'changeTime' && vm.form.changeTime !== 'other') {
  		vm.submitForm = {
  			changeTime: parseInt(vm.form.changeTime),
  		};
  		this.$global.changeRouterAndaddParam({
  			toRouter: 'EmployeeFamilyHistoryResultTable',
  			query: { queryRequest: vm.submitForm },
  		});
  	} else {
  		(this.$refs.formRef as any).validate((valid) => {
  			if (valid) {
  				console.log(vm.form);
  				switch (vm.form.option) {
  				case 'changeTime':
  					if (vm.form.changeTime === 'other') {
  						const NewRangeDate = DateTimeFormmat.filterRangeDate(vm.form.changeTimeRange);
  						console.log('NewRangeDate', NewRangeDate);
  						vm.submitForm = {
  							changeStartTime: NewRangeDate[0],
  							changeEndTime: NewRangeDate[1],
  						};
  					} else {
  						vm.submitForm = {
  							changeTime: parseInt(vm.form.changeTime),
  						};
  					}
  					break;
  				case 'idno':
  					vm.submitForm = {
  						idNo: vm.form.idno,
  					};
  					break;
  				case 'insName':
  					vm.submitForm = {
  						insName: vm.form.insName,
  					};
  					break;
  				case 'appNo':
  					vm.submitForm = {
  						appNoStart: vm.form.appNoStart,
  						appNoEnd: vm.form.appNoEnd,
  					};
  					break;
  				case 'applyFor':
  					vm.submitForm = {
  						applyFor: vm.form.applyFor,
  					};
  					break;
  				default:
  					console.log('沒有輸入查詢選項');
  				}
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'EmployeeFamilyHistoryResultTable',
  					query: { queryRequest: vm.submitForm },
  				});
  				// this.$router.push('/employeeFamilyHistory/employeeFamilyHistoryResultTable');
  			} else {
  				console.log('error', this.form);
  			}
  		});
  	}
  }

  updated() {
  	window.parseWord();
  }
	// reset
}
</script>

<style lang="scss" scoped>
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    padding-bottom: 80px;
  }
  .employeefamilyhistory::v-deep {
    .query__tab {
      width: 100%;
      .ant-radio-button-wrapper {
        width: 50%;
        text-align: center;
      }
    }
    .ant-form-item{
      margin-bottom: 0 !important;
    }
  }
  .input--inline{
    width: calc(50% - 12px);
    display: inline-block;
  }
  .input--dash{
    display: inline-block;
    padding-top: 10px;
  }
  .datepicker--full{
    width: 115%;
  }

</style>
