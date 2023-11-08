<template>
  <div class="container">
    <div class="page__title">
      人員名單查詢
    </div>
    <div class="query__title">
      以下為查詢篩選條件
    </div>
    <div class="form-container">
      <a-form-model
        ref="formRef"
        :rules="formRules"
        :model="form"
      >
        <div class="event__block row mb-0">
          <div class="col-6">
            <div class="input__title d-flex">
              <div>查詢區間(年/月)</div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item
              prop="date"
            >
              <date-picker
                v-model="form.date"
                class="input__block"
                :range="true"
                type="month"
                :format="'YYYY/MM'"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <div class="input__title">
              姓名
            </div>
            <a-form-model-item
              prop="name"
            >
              <a-input
                v-model="form.name"
                vue="true"
                alt="webfont"
                placeholder="e.g. 何陽光"
                class="input__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="event__block row mb-0">
          <div class="col-6">
            <div class="input__title d-flex">
              身分證字號/員編
            </div>
            <a-form-model-item
              prop="id"
            >
              <a-input
                v-model="form.id"
                placeholder="e.g. G1234567124"
                class="input__block"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <div class="input__title">
              單位代號
            </div>
            <a-form-model-item
              prop="dept"
            >
              <a-input
                v-model="form.dept"
                placeholder="e.g. 職安管理部"
                class="input__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="event__block">
          <div class="input__title">
            班別類型
          </div>
          <a-form-model-item
            prop="classType"
          >
            <a-radio-group
              v-model="form.classType"
              class="row"
              :default-value="form.classType"
            >
              <div class="col-6">
                <a-radio
                  :value="''"
                  class="radio__block"
                >
                  全部
                </a-radio>
                <a-radio
                  :value="1"
                  class="radio__block mb-0"
                >
                  日夜輪班
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="0"
                  class="radio__block mb-0"
                >
                  夜班
                </a-radio>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <div class="input__title">
            執行狀態
          </div>
          <a-form-model-item
            prop="status"
          >
            <a-radio-group
              v-model="form.status"
              class="row"
              :default-value="form.status"
            >
              <div class="col-6">
                <a-radio
                  :value="''"
                  class="radio__block"
                >
                  全部
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'E0304'"
                  class="radio__block"
                >
                  諮詢-已約
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'E0303'"
                  class="radio__block"
                >
                  諮詢-待約
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'E0305'"
                  class="radio__block"
                >
                  諮詢-已完成
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'E0302'"
                  class="radio__block mb-0"
                >
                  表單-已填
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'E0301'"
                  class="radio__block mb-0"
                >
                  表單-待填
                </a-radio>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <div class="input__title">
            心血管分級
          </div>
          <a-form-model-item
            prop="friskLevel"
          >
            <a-radio-group
              v-model="form.friskLevel"
              class="w-100"
              :default-value="form.friskLevel"
            >
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="''"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0101'"
                    class="radio__block"
                  >
                    低(輕微)
                  </a-radio>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="'E0102'"
                    class="radio__block mb-0"
                  >
                    中(中等)
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0103'"
                    class="radio__block mb-0"
                  >
                    高(嚴重)
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <div class="input__title">
            加班分級
          </div>
          <a-form-model-item
            prop="workLevel"
          >
            <a-radio-group
              v-model="form.workLevel"
              class="w-100"
              :default-value="form.workLevel"
            >
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="''"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0101'"
                    class="radio__block"
                  >
                    低(輕微)
                  </a-radio>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="'E0102'"
                    class="radio__block mb-0"
                  >
                    中(中等)
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0103'"
                    class="radio__block mb-0"
                  >
                    高(嚴重)
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <div class="input__title">
            綜合分級
          </div>
          <a-form-model-item
            prop="level"
          >
            <a-radio-group
              v-model="form.level"
              class="w-100"
              :default-value="form.level"
            >
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="''"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0101'"
                    class="radio__block"
                  >
                    低(輕微)
                  </a-radio>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="'E0102'"
                    class="radio__block mb-0"
                  >
                    中(中等)
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0103'"
                    class="radio__block mb-0"
                  >
                    高(嚴重)
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block">
          <div class="input__title">
            問卷分級
          </div>
          <a-form-model-item
            prop="questionLevel"
          >
            <a-radio-group
              v-model="form.questionLevel"
              class="w-100"
              :default-value="form.questionLevel"
            >
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="''"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0101'"
                    class="radio__block"
                  >
                    低(輕微)
                  </a-radio>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="'E0102'"
                    class="radio__block mb-0"
                  >
                    中(中等)
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="'E0103'"
                    class="radio__block mb-0"
                  >
                    高(嚴重)
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block mb-0">
          <div class="input__title">
            是否包含每月加班>45hr連續6次以上(含6次)
          </div>
          <a-form-model-item
            prop="continuous"
          >
            <a-radio-group
              v-model="form.continuous"
              class="w-100"
              :default-value="form.continuous"
            >
              <div class="row">
                <div class="col">
                  <a-radio
                    :value="''"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col">
                  <a-radio
                    :value="0"
                    class="radio__block"
                  >
                    否，不包含
                  </a-radio>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <a-radio
                    :value="1"
                    class="radio__block mb-0"
                  >
                    是，包含
                  </a-radio>
                </div>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
      </a-form-model>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="onSubmit"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpWoPersonnelListQueryDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: {} })
export default class QueryOverTimeIndex extends Vue {
  @Action('setLoading') setLoading;

  // 表單欄位名稱資料
  form = {
  	classType: '',
  	continuous: '',
  	date: null,
  	dept: null,
  	friskLevel: '',
  	id: null,
  	level: '',
  	name: null,
  	questionLevel: '',
  	status: '',
  	workLevel: '',
  }

  // 表單欄位規則
  formRules = {
  	date: [{ required: true, message: '查詢區間為必填', trigger: 'change' }],
  }

  // 2.2.6	人員名單查詢API
  search() {
  	this.setLoading(true);
  	const data: EmpWoPersonnelListQueryDto = {
  		classType: this.form.classType,
  		continuous: this.form.continuous,
  		dateStart: moment(DateTimeFormmat.formatStringDateDault(this.form.date[0])).toISOString(),
  		dateEnd: moment(DateTimeFormmat.formatStringDateDault(this.form.date[1])).toISOString(),
  		dept: this.form.dept,
  		friskLevel: this.form.friskLevel,
  		id: this.form.id,
  		level: this.form.level,
  		name: this.form.name,
  		questionLevel: this.form.questionLevel,
  		status: this.form.status,
  		workLevel: this.form.workLevel,
  	};
  	// const data: EmpWoPersonnelListQueryDto = { // 假資料
  	// 	classType: '1',
  	// 	continuous: 'string',
  	// 	dateEnd: '2022-06-05T01:07:50.443Z',
  	// 	dateStart: '2022-05-06T01:07:50.443Z',
  	// 	dept: 'VL700',
  	// 	friskLevel: '222',
  	// 	id: 'H223456789',
  	// 	level: '222',
  	// 	name: '龍X瑜',
  	// 	questionLevel: '222',
  	// 	status: 'E0301',
  	// 	workLevel: '222',
  	// };

  	this.$AlRpnAlRpnWorkOvertimeListControllerApi.getPersonnelListQueryUsingPOST(data, 0, 10)
  		.then(async (resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				const encryptQuery = await this.$encryptionDecryption.encrypt(JSON.stringify(data));
  				this.$global.changeRouterAndaddParam(
  					{ toRouter: 'QueryOverTimeList', query: data },
  				);
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
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
  			this.search();
  		} else {
  			console.log('error validate!!');
  			return false;
  		}
  	});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .query__title {
    font-size: 24px;
    margin-bottom: 20px;
    color: #000000;
    text-align: center;
  }
  .form-container {
    max-width: 720px;
    margin: auto;
    margin-bottom: 40px;
    background-color: $COLOR-MAIN10;
    border-radius: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: calc(92/1200*100%);
    padding-right: calc(92/1200*100%);
  }
  .event__block {
    margin-bottom: 20px;
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $TEXT-BOLD;
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    margin-left: 5px;
  }
  .input__block {
    width: 100%;
  }
  .radio__block {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 10px;
    padding-left: 12px;
    padding-top: 9px;
    padding-bottom:9px;
  }
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
  ::v-deep {
    .ant-input {
      height: 34px;
    }
  }
</style>
