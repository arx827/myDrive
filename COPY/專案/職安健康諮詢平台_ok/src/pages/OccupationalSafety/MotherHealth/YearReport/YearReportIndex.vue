<template>
  <div class="container">
    <div class="page__title">
      年度紀錄與報表
    </div>
    <div class="query__title">
      您想找的執行紀錄/報表？
    </div>
    <div class="query__subtitle">
      請滿足以下查詢條件
      <br>
      「擇一必填＋多項選填」
    </div>
    <a-form-model
      ref="formRef"
      :rules="formRules"
      :model="form"
    >
      <div class="formcontainer">
        <div class="formcontainer__block">
          <div class="oneformcontainer__block__title d-flex justify-content-center align-items-center">
            <p class="oneformcontainer__block__title--required">
              *
            </p>
            <p>擇一必填</p>
          </div>
          <div class="oneformcontainer__block__content d-flex">
            <div
              class="oneformcontainer__block__content__block"
              style="margin-right: 16px;"
            >
              <div class="oneformcontainer__block__content__block__title">
                執行年分
              </div>
              <div class="oneformcontainer__block__content__block__input">
                <a-form-model-item
                  prop="year"
                  :validate-status="checkYearAndRange? 'success' : 'error'"
                  :help="checkYearAndRange? '' : '執行年分/查詢區間 請擇一填寫'"
                >
                  <a-input
                    v-model="form.year"
                    class="inputblock"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="oneformcontainer__block__content__block">
              <div class="oneformcontainer__block__content__block__title">
                查詢區間
              </div>
              <div class="oneformcontainer__block__content__block__input">
                <a-form-model-item
                  prop="range"
                  :validate-status="checkYearAndRange? 'success' : 'error'"
                  :help="checkYearAndRange? '' : '執行年分/查詢區間 請擇一填寫'"
                >
                  <date-picker
                    v-model="form.range"
                    placeholder="e.g. 2022/01/01～2022/02/01"
                    type="date"
                    :range="true"
                    :format="'YYYY/MM/DD'"
                    class="inputblock"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </div>
        <div class="formcontainer__plusblock">
          +
        </div>
        <div class="manyformcontainer__block">
          <div class="manyformcontainer__block__title">
            <p>多項選填</p>
          </div>
          <div class="manyformcontainer__block__content">
            <div class="manyformcontainer__block__content__deptblock">
              <div class="manyformcontainer__block__content__deptblock__title">
                部門/單位
              </div>
              <div class="manyformcontainer__block__content__deptblock__input d-flex">
                <div class="col-12">
                  <a-form-model-item
                    prop="dept"
                  >
                    <a-select
                      v-model="form.dept"
                      placeholder="e.g. 系統整合部 職安勤務科"
                      :show-arrow="false"
                      :allow-clear="true"
                      :show-search="true"
                      :options="units"
                      :loading="isSelectLoading"
                      :filter-option="filterOption"
                    />
                  </a-form-model-item>
                </div>
                <!-- <div class="col-8">
                  <a-form-model-item
                    prop="class"
                  >
                    <a-select
                      v-model="form.class"
                      :default-value="form.class"
                      placeholder="e.g. 職安勤務科"
                    >
                      <a-select-option value="使用者介面系統科">
                        使用者介面系統科
                      </a-select-option>
                      <a-select-option :value="2">
                        2
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </div> -->
              </div>
            </div>
            <div class="manyformcontainer__block__content__idnameblock d-flex">
              <div class="manyformcontainer__block__content__idblock col-6">
                <div class="manyformcontainer__block__content__idblock__title">
                  員編/ID
                </div>
                <div class="manyformcontainer__block__content__idblock__input">
                  <a-form-model-item
                    prop="id"
                  >
                    <a-input
                      v-model="form.id"
                      placeholder="e.g. 911234"
                      class="inputblock"
                    />
                  </a-form-model-item>
                </div>
              </div>
              <div class="manyformcontainer__block__content__nameblock col-6">
                <div class="manyformcontainer__block__content__nameblock__title">
                  員工姓名
                </div>
                <div class="manyformcontainer__block__content__nameblock__input">
                  <a-form-model-item
                    prop="name"
                  >
                    <a-input
                      v-model="form.name"
                      vue="true"
                      alt="webfont"
                      placeholder="e.g. 林春曉"
                      class="inputblock"
                    />
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <div class="manyformcontainer__block__content__idenqablock d-flex">
              <div class="manyformcontainer__block__content__idenblock col-6">
                <div class="manyformcontainer__block__content__idenblock__title d-flex">
                  <div>
                    身份別
                  </div>
                </div>
                <div class="manyformcontainer__block__content__idenblock__input">
                  <a-form-model-item
                    prop="identity"
                  >
                    <a-radio-group
                      v-model="form.identity"
                      :default-value="form.identity"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in identityList"
                        :key="index"
                        class="col-6"
                      >
                        <a-radio :value="item.key">
                          {{ item.value }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
              <div class="manyformcontainer__block__content__qablock col-6">
                <div class="manyformcontainer__block__content__qablock__title">
                  問卷填寫
                </div>
                <div class="manyformcontainer__block__content__qablock__input">
                  <a-form-model-item
                    prop="qa"
                  >
                    <a-radio-group
                      v-model="form.qa"
                      default-value="form.qa"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in qaList"
                        :key="index"
                        class="col-6"
                      >
                        <a-radio :value="item.key">
                          {{ item.value }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <div class="manyformcontainer__block__content__healthdanblock d-flex">
              <div class="manyformcontainer__block__content__healthblock col-6">
                <div class="manyformcontainer__block__content__healthblock__title">
                  健康分級
                </div>
                <div class="manyformcontainer__block__content__healthblock__input">
                  <a-form-model-item
                    prop="health"
                  >
                    <a-radio-group
                      v-model="form.health"
                      default-value="form.health"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in healthList"
                        :key="index"
                        class="col-6"
                      >
                        <a-radio :value="item.key">
                          {{ item.value }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
              <div class="manyformcontainer__block__content__danblock col-6">
                <div class="manyformcontainer__block__content__danblock__title">
                  危害風險分級
                </div>
                <div class="manyformcontainer__block__content__danblock__input">
                  <a-form-model-item
                    prop="danger"
                  >
                    <a-radio-group
                      v-model="form.danger"
                      default-value="form.danger"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in dangerList"
                        :key="index"
                        class="col-6"
                      >
                        <a-radio :value="item.key">
                          {{ item.value }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
            </div>
            <div class="manyformcontainer__block__content__statusdocblock d-flex">
              <div class="manyformcontainer__block__content__statusblock col-6">
                <div class="manyformcontainer__block__content__statusblock__title">
                  在職狀態
                </div>
                <div class="manyformcontainer__block__content__statusblock__input">
                  <a-form-model-item
                    prop="status"
                  >
                    <a-checkbox-group
                      v-model="form.status"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in statusList"
                        :key="index"
                        class="col-6"
                      >
                        <a-checkbox
                          :value="item.key"
                          name="type"
                        >
                          {{ item.value }}
                        </a-checkbox>
                      </div>
                    </a-checkbox-group>
                  </a-form-model-item>
                </div>
              </div>
              <div class="manyformcontainer__block__content__docblock col-6">
                <div class="manyformcontainer__block__content__docblock__title">
                  醫師諮詢
                </div>
                <div class="manyformcontainer__block__content__docblock__input">
                  <a-form-model-item
                    prop="doctor"
                  >
                    <a-radio-group
                      v-model="form.doctor"
                      default-value="form.doctor"
                      class="row"
                    >
                      <div
                        v-for="(item, index) in doctorList"
                        :key="index"
                        class="col-6"
                      >
                        <a-radio :value="item.key">
                          {{ item.value }}
                        </a-radio>
                      </div>
                    </a-radio-group>
                  </a-form-model-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="goQuery"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({ components: { } })
export default class YearReportIndex extends Vue {
  @Action('setLoading') setLoading;

  identityList = null; // 身分別清單

  qaList = null; // 問卷清單

  healthList = null; // 健康分級清單

  dangerList = null; // 危害風險清單

  statusList = null; // 在職狀態清單

  doctorList = null; // 醫師諮詢清單

  // 單位清單
  units = [];

  // 表單欄位資料
  form = {
  	year: '2022',
  	range: null,
  	dept: undefined,
  	// class: undefined,
  	id: '',
  	name: '',
  	identity: null,
  	qa: null,
  	health: null,
  	danger: null,
  	status: null,
  	doctor: null,
  }

  checkYearAndRange = true;

  isSelectLoading = false;

  // 欄位規則
  formRules = {
  	year: [{
  		validator: this.checkField, trigger: 'change',
  	}],
  	range: [{
  		validator: this.checkField, trigger: 'change',
  	}],
  }

  checkField(rule, value, callback) {
  	if (!this.form.year && (!this.form.range || !this.form.range[0])) {
  		callback('');
  		this.checkYearAndRange = false;
  	} else {
  		callback();
  		this.checkYearAndRange = true;
  	}
  }

  // 模糊搜尋
  filterOption(input, option) {
  	return option.componentOptions?.children[0]?.text?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
  }

  // 清除年份欄位資料
  clearDataYear() {
  	// this.formRules.year = [{ required: false, message: '' }];
  	// this.formRules.range = [{ required: true, message: '請填入有效區間日期' }];
  	this.form.year = null;
  }

  // 清除區間欄位資料
  clearDataRange() {
  	// this.formRules.year = [{ required: true, message: '請填入有效年分' }];
  	// this.formRules.range = [{ required: false, message: '' }];
  	this.form.range = null;
  }

  @Watch('form.year', { deep: true })
  onYearChange(val) {
  	if (val) {
  		this.clearDataRange();
  	}
  }

  @Watch('form.range', { deep: true })
  onRangeChange(val) {
  	if (val) {
  		this.clearDataYear();
  	}
  	console.log(val);
  }

  // 前往查詢
  goQuery() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid && this.checkYearAndRange) {
  			// console.log(this.form);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'YearReportResult',
  				query: this.form,
  			});
  		} else {
  			console.log('error catch!!!');
  			return false;
  		}
  	});
  }

  // API: 獲取代理人單位清單 Dept (Unit?)
  fetchUnits() {
  	this.isSelectLoading = true;
  	this.$UtilityApi.deptListUsingPOST()
  		.then((resp) => {
  			const rawData = resp.data.data;
  			rawData.forEach((item) => {
  				const block = {
  					value: item.deptCd,
  					label: item.deptName,
  				};
  				this.units.push(block);
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  				this.isSelectLoading = false;
  		});
  }

  async created() {
  	this.setLoading(true);
  	await this.fetchUnits();
  	this.$MONPLANRpnRecordWithYearReportApi.searchConditionRUsingPOST()
  		.then((resp) => {
  			// console.log('result', resp.data.data);
  			this.identityList = resp.data.data.pregnantCategoryList;
  			this.qaList = resp.data.data.questionnaireStatusList;
  			this.healthList = resp.data.data.healthLevelList;
  			this.dangerList = resp.data.data.dangerLevelList;
  			this.statusList = resp.data.data.jobStatusList;
  			this.doctorList = resp.data.data.phyConsultStatusList;
  		})
  		.catch((error) => {
  			console.log('error status=', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
  .query__title{
    font-size: 24px;
    margin-bottom: 20px;
    color: #000000;
    text-align: center;
    font-weight: $TEXT-BOLD;
  }
  .query__subtitle{
    margin-bottom: 20.23px;
    color: $TEXT-GREEN;
    text-align: center;
    font-weight: $TEXT-BOLD;
  }
  .formcontainer{
    max-width: 720px;
    margin: auto;
    // 上半部block
    .formcontainer__block{
      background-color: $COLOR-MAIN10;
      width: 100%;
      padding-top: 30px;
      padding-bottom: 30px;
      padding-left: calc(92/720*100%);
      padding-right: calc(92/720*100%);
      border-radius: 10px;
      .oneformcontainer__block__title{
        color: #59CBD0;
        font-weight: $TEXT-BOLD;
        margin-bottom: 10px;
        p{
          font-size: 24px;
        }
        .oneformcontainer__block__title--required{
          font-size: 24px;
          color: red;
          text-align: center;
          margin-right: 10px;
          padding-top: 8px;
        }
      }
      .oneformcontainer__block__content{
        .oneformcontainer__block__content__block{
          width: calc(260/536*100%);
          .oneformcontainer__block__content__block__title{
            font-weight: $TEXT-BOLD;
            margin-bottom: 10px;
          }
          .oneformcontainer__block__content__block__input{
            .inputblock{
              width: 100%;
            }
          }
        }
      }
    }
    .formcontainer__plusblock{
      text-align: center;
      font-size: 50px;
      font-weight: $TEXT-BOLD;
    }
    // 下半部block
    .manyformcontainer__block{
      background-color: $COLOR-MAIN10;
      width: 100%;
      padding-top: 30px;
      padding-bottom: 28px;
      padding-left: calc(92/720*100%);
      padding-right: calc(92/720*100%);
      border-radius: 10px;
      margin-bottom: 40px;
      .manyformcontainer__block__title{
        color: #59CBD0;
        font-weight: $TEXT-BOLD;
        margin-bottom: 20px;
        text-align: center;
        p{
          font-size: 24px;
        }
      }
      .manyformcontainer__block__content{
        .manyformcontainer__block__content__deptblock{
          margin-bottom: 20px;
          .manyformcontainer__block__content__deptblock__title{
            margin-bottom: 10px;
            font-weight: $TEXT-BOLD;
          }
        }
        .manyformcontainer__block__content__idnameblock{
          padding-right: 16px;
          margin-bottom: 20px;
          .manyformcontainer__block__content__idblock{
            margin-right: 16px;
            .manyformcontainer__block__content__idblock__title{
              font-weight: $TEXT-BOLD;
              margin-bottom: 10px;
            }
            .manyformcontainer__block__content__idblock__input{
              .inputblock{
                width: 100%;
              }
            }
          }
          .manyformcontainer__block__content__nameblock{
            .manyformcontainer__block__content__nameblock__title{
              font-weight: $TEXT-BOLD;
              margin-bottom: 10px;
            }
            .manyformcontainer__block__content__nameblock__input{
              .inputblock{
                width: 100%;
              }
            }
          }
        }
        .manyformcontainer__block__content__idenqablock{
          padding-right: 16px;
          margin-bottom: 20px;
          .manyformcontainer__block__content__idenblock{
            margin-right: 16px;
            .manyformcontainer__block__content__idenblock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
          .manyformcontainer__block__content__qablock{
            .manyformcontainer__block__content__qablock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
        }
        .manyformcontainer__block__content__healthdanblock{
          padding-right: 16px;
          margin-bottom: 20px;
          .manyformcontainer__block__content__healthblock{
            margin-right: 16px;
            .manyformcontainer__block__content__healthblock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
          .manyformcontainer__block__content__danblock{
            .manyformcontainer__block__content__danblock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
        }
        .manyformcontainer__block__content__statusdocblock{
          padding-right: 16px;
          .manyformcontainer__block__content__statusblock{
            margin-right: 16px;
            .manyformcontainer__block__content__statusblock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
          .manyformcontainer__block__content__docblock{
            .manyformcontainer__block__content__docblock__title{
              margin-bottom: 10px;
              font-weight: $TEXT-BOLD;
            }
          }
        }
      }
    }
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
