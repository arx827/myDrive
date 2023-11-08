<template>
  <div class="container">
    <div class="page__title">
      人因危害資料查詢
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
          <div class="col-12">
            <div class="input__title d-flex">
              <div>健檢年度</div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item prop="period">
              <a-input
                v-model="form.period"
                placeholder="e.g. 2022"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="event__block row mb-0">
          <div class="col-6">
            <div class="input__title">
              姓名
            </div>
            <a-form-model-item
              prop="name"
            >
              <a-input
                v-model="form.name"
                placeholder="e.g. 何陽光"
                class="input__block"
                vue="true"
                alt="webfont"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <div class="input__title d-flex">
              員工編號
            </div>
            <a-form-model-item
              prop="id"
            >
              <a-input
                v-model="form.id"
                placeholder="e.g. A1234"
                class="input__block"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="event__block row mb-0">
          <div class="input__title">
            部門/單位
          </div>
          <a-form-model-item
            prop="dept_name"
          >
            <a-select
              v-model="form.dept_name"
              placeholder="e.g. 系統整合部 職安勤務科"
              class="input__block"
              :show-arrow="true"
              :allow-clear="true"
              :show-search="true"
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(dept, index) in depts"
                :key="index"
                :value="dept.deptCd"
              >
                {{ dept.deptName }}
              </a-select-option>
            </a-select>
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
                  class="radio__block"
                >
                  全部(預設)
                </a-radio>
                <a-radio
                  :value="1"
                  class="radio__block"
                >
                  表單-待填
                </a-radio>
                <a-radio
                  :value="3"
                  class="radio__block"
                >
                  衛教資訊-未發送
                </a-radio>
                <a-radio
                  :value="5"
                  class="radio__block"
                >
                  諮詢-未預約
                </a-radio>
                <a-radio
                  :value="7"
                  class="radio__block"
                >
                  諮詢-已預約(過期)
                </a-radio>
                <a-radio
                  :value="9"
                  class="radio__block"
                >
                  人因工程改善-追蹤中
                </a-radio>
                <a-radio
                  :value="11"
                  class="radio__block mb-0"
                >
                  行政改善-追蹤中
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="0"
                  class="radio__block"
                >
                  表單-未填
                </a-radio>
                <a-radio
                  :value="2"
                  class="radio__block"
                >
                  表單-已填
                </a-radio>
                <a-radio
                  :value="4"
                  class="radio__block"
                >
                  衛教資訊-已發送
                </a-radio>
                <a-radio
                  :value="6"
                  class="radio__block"
                >
                  諮詢-已預約
                </a-radio>
                <a-radio
                  :value="8"
                  class="radio__block"
                >
                  諮詢-已完成
                </a-radio>
                <a-radio
                  :value="10"
                  class="radio__block"
                >
                  人因工程改善-已結案
                </a-radio>
                <a-radio
                  :value="12"
                  class="radio__block mb-0"
                >
                  行政改善-已結案
                </a-radio>
              </div>
            </a-radio-group>
          </a-form-model-item>
        </div>
        <div class="event__block mb-0">
          <div class="input__title">
            問卷分級
          </div>
          <a-form-model-item
            prop="surveyLev"
          >
            <a-radio-group
              v-model="form.surveyLev"
              class="row"
              :default-value="form.surveyLev"
            >
              <div class="col-12">
                <a-radio
                  class="radio__block"
                >
                  全部(預設)
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'F0601'"
                  class="radio__block"
                >
                  第一級
                </a-radio>
                <a-radio
                  :value="'F0603'"
                  class="radio__block mb-0"
                >
                  第三級
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="'F0602'"
                  class="radio__block"
                >
                  第二級
                </a-radio>
                <a-radio
                  :value="'F0604'"
                  class="radio__block mb-0"
                >
                  第四級
                </a-radio>
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
import notification from '@/plugins/notification/infoNotification';

@Component({ components: {} })
export default class QueryDataIndex extends Vue {
  // 表單欄位名稱資料
  form = {
  	period: null,
  	name: '',
  	id: '',
  	dept_name: undefined,
  	status: undefined,
  	surveyLev: undefined,
  }

  // 表單欄位規則
  formRules = {
  	period: [{ required: true, message: '健檢年度為必填', trigger: 'change' }],
  }

  depts = null // 部門下拉

  // 模糊搜尋
  filterOption(input, option) {
  	return option.componentOptions?.children[0]?.text?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
  }

  // 拿取部門下拉資料
  getDeptList() {
  	this.$UtilityApi.deptListUsingPOST()
  		.then((resp) => {
  				if (resp.data.status === 200) {
  					this.depts = resp.data.data;
  				} else {
  					notification.error({
  						content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					});
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				// this.setLoading(false);
  			});
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid, item) => {
  		if (valid) {
  			// this.$router.push({ name: 'QueryDataList' });
  			console.log('this.form => ', this.form);
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'QueryDataList',
  				query: this.form,
  			});
  		} else {
  			console.log('Validation failed.');
  			const itemFocus = Object.keys(item)[0];
  			(this.$refs[itemFocus] as any).focus();
  		}
  	});
  }

  updated() {
  	window.parseWord();
  }

  created() {
  	this.getDeptList();
  	const query = this.$global.getQuery();
  	if (query) {
  		this.form.status = query.status; // 待辦Z0435,需選好執行狀態為1
  		// 取得資料後清空自己, 避免由一般入口進入弄髒參數
  		const $param = JSON.parse(sessionStorage.param);
  		delete $param.QueryDataIndex;
  		sessionStorage.param = JSON.stringify($param);
  	}
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
    margin-bottom: 5px;
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
