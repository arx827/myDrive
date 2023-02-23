<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap">
        <h2 class="query__title">
          您想查詢的資料關鍵？
        </h2>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :layout="'vertical'"
          :rules="formRules"
        >
          <a-radio-group
            v-model="tabValue"
            class="query__tab"
            default-value="year"
            button-style="solid"
          >
            <a-radio-button :value="1">
              保單年度-本年度
            </a-radio-button>
            <a-radio-button :value="2">
              保單年度-上年度
            </a-radio-button>
          </a-radio-group>
          <p class="info__txt primary__txt text-center">
            請擇一填寫
          </p>
          <!-- 保單年度-本年度查詢 -->
          <div
            v-if="tabValue === 1"
            class="query__content"
          >
            <a-radio-group
              v-model="radioYearOpt"
              default-value="'crtNo'"
              class="query__list"
            >
              <a-radio
                class="query__item"
                :value="'crtNo'"
              >
                保險證號
                <div
                  v-if="radioYearOpt === 'crtNo'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="crtNo">
                    <a-input
                      v-model="form.crtNo"
                      block
                      @input="form.crtNo = $event.target.value.toUpperCase()"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'insId'"
              >
                身分證字號/居留證號碼
                <div
                  v-if="radioYearOpt === 'insId'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="insId">
                    <a-input
                      v-model="form.insId"
                      block
                      @input="form.insId = $event.target.value.toUpperCase()"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'insName'"
              >
                被保險人姓名
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
                <div
                  v-if="radioYearOpt === 'insName'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="insName">
                    <a-input
                      v-model="form.insName"
                      vue="true"
                      alt="webfont"
                      block
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'dataStatus'"
              >
                資料狀態
                <div
                  v-if="radioYearOpt === 'dataStatus'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="dataStatus">
                    <a-radio-group
                      v-model="form.dataStatus"
                      :options="dataStatusOpts"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'jnDate'"
              >
                加保日期區間
                <div
                  v-if="radioYearOpt === 'jnDate'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="jnDate">
                    <date-picker
                      v-model="form.jnDate"
                      type="date"
                      :range="true"
                      :editable="false"
                      :formatter="formatter"
                      :allow-clear="true"
                      :disabled-date="thisYeardisabledDate"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'npDate'"
              >
                退保日期區間
                <div
                  v-if="radioYearOpt === 'npDate'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="npDate">
                    <date-picker
                      v-model="form.npDate"
                      type="date"
                      :range="true"
                      :editable="false"
                      :formatter="formatter"
                      :allow-clear="true"
                      :disabled-date="thisYeardisabledDate"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
            </a-radio-group>
          </div>
          <!-- 保單年度-上年度查詢 -->
          <div
            v-if="tabValue === 2"
            class="query__content"
          >
            <a-radio-group
              v-model="radioLastYearOpt"
              default-value="'lastYearJnDate'"
              class="query__list"
            >
              <a-radio
                class="query__item"
                :value="'lastYearJnDate'"
              >
                加保日期區間
                <div
                  v-if="radioLastYearOpt === 'lastYearJnDate'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="lastYearJnDate">
                    <date-picker
                      v-model="form.lastYearJnDate"
                      type="date"
                      :editable="false"
                      :formatter="formatter"
                      :allow-clear="true"
                      :range="true"
                      :disabled-date="lastYeardisabledDate"
                      @open="onOpen('lastYearJnDate')"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
              <a-radio
                class="query__item"
                :value="'lastYearNpDate'"
              >
                退保日期區間
                <div
                  v-if="radioLastYearOpt === 'lastYearNpDate'"
                  class="query__item-content"
                >
                  <a-form-model-item prop="lastYearNpDate">
                    <date-picker
                      v-model="form.lastYearNpDate"
                      type="date"
                      :editable="false"
                      :formatter="formatter"
                      :allow-clear="true"
                      :range="true"
                      :disabled-date="lastYeardisabledDate"
                      @open="onOpen('lastYearNpDate')"
                    />
                  </a-form-model-item>
                </div>
              </a-radio>
            </a-radio-group>
          </div>
          <div class="block__btns text-center">
            <button
              class="btn__radius--primary w-50"
              :disabled="isLoading"
              @click="onSubmit"
            >
              查詢
            </button>
          </div>
        </a-form-model>
        <!-- <p class="gray__txt info__txt text-center">
          每項條件最多呈現 500 筆查詢資料
        </p> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { FGPEMPNQueryModel, InspectionPolicyDateDto } from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

enum errorCode {
  'QUERY_INPUT_MORE_THAN_ONE' = '只能有一個查詢項目',
  'TW_ID_FORM_ERROR' = '身分證字號格式錯誤',
  'DATA_STATUS_ERROR' = '資料狀態錯誤',
  'JN_DATE_ERROR' = '加保日期格式錯誤',
  'NP_DATE_ERROR' = '退保日期格式錯誤',
  'PAGE_NUMBER_OUT_OF_RANGE' = '頁碼大小超出範圍',
}

@Component({ components: { Breadcrumb } })
export default class EmployeeFamilyPolicyQuery extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

  form = {
  	crtNo: '',
  	insId: '',
  	dataStatus: '',
  	insName: '',
  	jnDate: '',
  	npDate: '',
  	lastYearJnDate: null,
  	lastYearNpDate: null,
  }

  isLoading = false;

  formatter = this.$twDateFormatter;

  tabValue: 1|2 = 1; // 1: 本年度, 2: 上年度

  radioYearOpt = 'crtNo';

  radioLastYearOpt = 'lastYearJnDate';

  datepickRange = null; // 保單年度的起訖日(從API拿取), 用於鎖住小日曆日期

  dataStatusOpts = [
  	{ label: '全部有效人員', value: '1' },
  	{ label: '全部退保人員', value: '2' },
  ];

  formRules = {
  	insId: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z0-9]/, message: '身分證字號輸入格式錯誤' }],
  	crtNo: [{ required: true, message: '請填入有效保險證號' }, { pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]{1,10}$/, message: '保險證號輸入格式錯誤' }],
  	insName: [{ required: true, message: '請填入有效姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  	dataStatus: [{ required: true, message: '請填入有效資料狀態' }],
  	jnDate: [{ required: true, message: '請填入有效加保日期區間' }],
  	npDate: [{ required: true, message: '請填入有效退保日期區間' }],
  	lastYearJnDate: [{ required: true, message: '請填入有效加保日期區間' }],
  	lastYearNpDate: [{ required: true, message: '請填入有效退保日期區間' }],
  }

  @Watch('tabValue')
  onYearChange() {
  	this.getdateRange();
  }

  @Watch('radioLastYearOpt')
  onRadioChange(val) {
  	// this.form.lastYearJnDate = null;
  	// this.form.lastYearNpDate = null;
  	// this.firstDatepickOpen = true;
  }

  updated() {
  	window.parseWord();
  }

  thisYeardisabledDate(current) {
  	return current && (current > this.datepickRange[1] || current < this.datepickRange[0]);
  }

  lastYeardisabledDate(current) {
  	return current && (current > this.datepickRange[1] || current < this.datepickRange[0]);
  }

  defaultLastYearDate() {
  	const lastYear = this.datepickRange[0];
  	return [lastYear, lastYear];
  }

  onOpen(d) {
  	// 設置預設選取上年度日期
  	if (this.form[d] === null) {
  		this.form[d] = this.defaultLastYearDate();
  	}
  }

  formatDate(date) {
  	return DateTimeFormmat.filterRangeDate(date);
  }

  setQuery() {
  	const data = {
  		jnDateStart: '',
  		jnDateEnd: '',
  		npDateEnd: '',
  		npDateStart: '',
  		policyYear: this.tabValue.toString(),
  		policyModel: this.$userInfo.getPolicyModel(),
  	};

  	const key = this.tabValue == 1 ? this.radioYearOpt : this.radioLastYearOpt;
  	const value = this.form[key];

  	switch (key) {
  	case 'jnDate':

  		data.jnDateStart = this.formatDate(value)[0];
  		data.jnDateEnd = this.formatDate(value)[1];
  		break;

  	case 'npDate':
  		data.npDateStart = this.formatDate(value)[0];
  		data.npDateEnd = this.formatDate(value)[1];
  		break;

  	case 'lastYearJnDate':
  		data.jnDateStart = this.formatDate(value)[0];
  		data.jnDateEnd = this.formatDate(value)[1];
  		break;

  	case 'lastYearNpDate':
  		data.npDateStart = this.formatDate(value)[0];
  		data.npDateEnd = this.formatDate(value)[1];
  		break;

  	default:
  		data[key] = value;
  		break;
  	}

  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EmployeeFamilyPolicyResultTable',
  		query: {
  			pageQuery: data,
  		},
  	});
  	// setTimeout(() => {
  	// 	this.$router.push({ path: '/employeeFamilyPolicy/employeeFamilyPolicyResultTable' }).catch((err) => { err; });
  	// }, 300);
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.setQuery();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 取得可查詢日期區間
  async getdateRange() {
  	this.setLoading(true);
  	const data: InspectionPolicyDateDto = {
  		policyModel: this.$userInfo.getPolicyModel(),
  		policyYear: this.tabValue.toString(),
  	};
  	await this.$employeeFamilyPolicyApi
  		.checkContractDateUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.datepickRange = [new Date(resp.data.data.contractBeginsDate), new Date(resp.data.data.contractEndDate)];
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async created() {
  	await this.getdateRange();
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
  ::v-deep {
    .ant-radio {
      top: -2px;
    }
    .ant-form-vertical .ant-form-item {
      margin: 0;
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
