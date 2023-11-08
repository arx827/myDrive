<template>
  <div class="container">
    <div class="page__title">
      填寫報名表
    </div>
    <div class="page__card page__card--shadow p-0">
      <div class="page__card__title page__card__headerTitle">
        活動資訊
      </div>
      <div class="active__info__wrap">
        <div class="active__info__inner">
          <a-row type="flex">
            <a-col
              :lg="24"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動名稱
              </div>
              <div class="info__item__content">
                {{ actData.actName }}
              </div>
            </a-col>
            <a-col
              :lg="10"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動日期
              </div>
              <div class="info__item__content">
                {{ actData.date }}
              </div>
            </a-col>
            <a-col
              :lg="5"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動狀態
              </div>
              <div class="info__item__content">
                {{ actData.isExpired === 'Y' ? '已結束':'進行中' }}
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>

    <div class="page__card form__card">
      <div class="active__info__inner">
        <div class="form__card__title">
          {{ actData.actName }}
        </div>
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          class="pageHealthPromoteRegisterFormModel"
        >
          <!-- ↓↓↓↓↓↓↓↓前五項為固定問項↓↓↓↓↓↓↓↓↓↓ -->
          <!-- 欲報名場次 -->
          <a-form-model-item prop="session">
            <label class="a-form-label">
              <label>欲報名場次</label>
              <span class="mark-required">*</span>
            </label>
            <a-radio-group
              v-model="form.session"
              class="w-100"
            >
              <a-radio
                v-for="(item, index) in sessionRadios"
                :key="index"
                class="form__label__bg d-flex align-items-center"
                :value="item.sessionId"
              >
                【{{ item.buildingName }}】{{ item.location }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>

          <!-- 報名人姓名 -->
          <a-form-model-item prop="name">
            <label class="a-form-label">
              <label>報名人姓名</label>
              <span class="mark-required">*</span>
            </label>
            <a-row>
              <a-col :span="24">
                <a-input
                  v-model="form.name"
                  type="text"
                  size="large"
                  class="bg-white text-black"
                  disabled
                />
              </a-col>
            </a-row>
          </a-form-model-item>

          <!-- 部門/單位 -->
          <a-form-model-item prop="department">
            <label class="a-form-label">
              <label>部門/單位</label>
              <span class="mark-required">*</span>
            </label>
            <a-input
              v-model="form.department"
              size="large"
            />
          </a-form-model-item>

          <!-- 連絡電話 -->
          <a-form-model-item prop="telNo">
            <label class="a-form-label">
              <label>連絡電話</label>
              <span class="mark-required">*</span>
            </label>
            <a-row>
              <a-col :span="24">
                <a-input
                  v-model="form.telNo"
                  type="text"
                  size="large"
                  placeholder="e.g. 0918372888"
                />
              </a-col>
            </a-row>
          </a-form-model-item>

          <!-- 連絡信箱 -->
          <a-form-model-item prop="email">
            <label class="a-form-label">
              <label>連絡信箱</label>
              <span class="mark-required">*</span>
            </label>
            <a-row>
              <a-col :span="24">
                <a-input
                  v-model="form.email"
                  type="text"
                  size="large"
                  disabled
                  :placeholder="`e.g. ${publicMail}`"
                />
              </a-col>
            </a-row>
          </a-form-model-item>

          <!-- ↓↓↓↓↓↓↓↓↓↓↓以下從2.1.7	查詢健康促進活動問卷API取得↓↓↓↓↓↓↓↓↓↓ -->
          <div
            v-if="questionnaire"
          >
            <div
              v-for="(item, idx) in questionnaire"
              :key="idx"
            >
              <a-form-model-item
                :prop="item.topicId.toString()"
                class="quest__form__subTitle"
              >
                <div class="a-form-label">
                  <label>{{ item.type !== 7 ? item.title:'' }}</label>
                  <span
                    v-if="item.isAnswer === 'Y' && item.type!==7"
                    class="mark-required"
                  >*</span>
                </div>
                <a-input
                  v-if="item.type === 1"
                  v-model="form[item.topicId.toString()]"
                  class="quest__form__item"
                />
                <a-textarea
                  v-if="item.type === 2"
                  v-model="form[item.topicId.toString()]"
                  placeholder="簡述即可，字數上限250字。"
                  :max-length="250"
                  :auto-size="{ minRows: 6 }"
                  class="addingWish__input__style"
                />
                <a-radio-group
                  v-if="item.type === 3"
                  v-model="form[item.topicId.toString()]"
                  name="radioGroup"
                  class="checkbox__group__whole"
                >
                  <a-row
                    type="flex"
                    justify="space-between"
                    :gutter="[16,8]"
                  >
                    <a-col
                      v-for="(opt, optIdx) in item.healthActQuestTopicOptDtoList"
                      :key="optIdx"
                      :class="item.size==='whole'? 'checkbox__group__whole':'checkbox__group__half'"
                    >
                      <a-row class="form__label__bg">
                        <a-radio
                          :value="opt.optId.toString()"
                        >
                          {{ opt.optDesc }}
                        </a-radio>
                      </a-row>
                    </a-col>
                  </a-row>
                </a-radio-group>
                <a-checkbox-group
                  v-if="item.type === 4"
                  v-model="form[item.topicId.toString()]"
                  class="checkbox__group__whole"
                >
                  <a-row
                    type="flex"
                    justify="space-between"
                    :gutter="[16,8]"
                  >
                    <a-col
                      v-for="(opt, optIdx) in item.healthActQuestTopicOptDtoList"
                      :key="optIdx"
                      class="checkbox__group__half"
                    >
                      <a-row class="form__label__bg">
                        <a-checkbox
                          class="checkbox__width"
                          :class="{'checkbox__width':item.showInput==='Y'}"
                          :value="opt.optId.toString()"
                        >
                          {{ opt.optDesc }}
                        </a-checkbox>
                      <!-- <a-input
                    v-if="item.showInput==='Y'"
                    :max-length="50"
                    class="input__style"
                    :placeholder="item.inputPlaceHolder"
                  /> -->
                      </a-row>
                    </a-col>
                  </a-row>
                </a-checkbox-group>
                <a-input-number
                  v-if="item.type === 5"
                  v-model="form[item.topicId.toString()]"
                />
                <a-rate
                  v-if="item.type === 6"
                  v-model="form[item.topicId.toString()]"
                >
                  <a-icon
                    slot="character"
                    type="star"
                  />
                </a-rate>
                <div v-if="item.type === 7 && item.maxtixList">
                  <div class="a-form-label">
                    <label>{{ item.title }}</label>
                    <span
                      v-if="item.isAnswer === 'Y'"
                      class="mark-required"
                    >*</span>
                  </div>
                  <!-- pc&ipad 滿意度選項名稱 -->
                  <div class="d-none d-sm-block">
                    <a-row
                      class="satisfaction__title"
                    >
                      <a-col :span="9">
                        <a-row>
                          <a-col />
                        </a-row>
                      </a-col>
                      <a-col :span="15">
                        <a-row
                          type="flex"
                          justify="space-around"
                        >
                          <a-col
                            v-for="(opt, optIdx) in item.healthActQuestTopicOptDtoList"
                            :key="optIdx"
                            :span="4"
                            class="option__title"
                          >
                            {{ opt.optDesc }}
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-row>
                    <!-- 滿意度題目&radio選項 -->
                    <div>
                      <a-row
                        v-for="el in item.maxtixList"
                        :key="el.topicId"
                        type="flex"
                        justify="space-around"
                        class="satisfaction__item"
                        :class="{'with-white-bg': idx % 2 === 0}"
                      >
                        <a-col :span="9">
                          {{ el.title }}
                        </a-col>
                        <a-col :span="15">
                          <a-radio-group
                            v-model="form[el.topicId.toString()]"
                            name="radioGroup"
                            class="satisfaction__option"
                          >
                            <a-radio
                              v-for="(opt, optIdx) in item.healthActQuestTopicOptDtoList"
                              :key="optIdx"
                              :value="opt.optId.toString()"
                              class="satisfaction__radio"
                            />
                          </a-radio-group>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                  <!-- Phone 滿意度選項名稱 -->
                  <div class="d-block d-sm-none">
                    <a-row
                      v-for="el in item.maxtixList"
                      :key="el.topicId"
                    >
                      <a-col
                        :span="24"
                        class="satisfaction__title"
                      >
                        {{ el.title }}
                      </a-col>
                      <a-radio-group
                        v-model="form[el.topicId.toString()]"
                        name="radioGroup"
                        class="checkbox__group__whole"
                      >
                        <a-row
                          type="flex"
                          justify="space-between"
                          :gutter="[16,8]"
                        >
                          <a-col
                            v-for="(opt, optIdx) in item.healthActQuestTopicOptDtoList"
                            :key="optIdx"
                            class="checkbox__group__half"
                          >
                            <a-row class="form__label__bg">
                              <a-radio
                                :value="opt.optId.toString()"
                              >
                                {{ opt.optDesc }}
                              </a-radio>
                            </a-row>
                          </a-col>
                        </a-row>
                      </a-radio-group>
                    </a-row>
                  </div>
                </div>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
      </div>
    </div>

    <div class="btn__wrap text-center">
      <div class="row">
        <div class="col-6 text-end">
          <button
            class="btn__radius--primary--outline"
            @click="cancelRegister()"
          >
            取消
          </button>
        </div>
        <div class="col-6 text-start">
          <button
            class="btn__radius--primary"
            @click="submitRegister()"
          >
            確認
          </button>
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
import { HealthActSignupInfoModel, HealthActUpdateSingUpInfoDto } from '@fubonlife/oss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form/form';
import InfoModal from '@/plugins/notification/infoModal';

@Component({})
export default class HealthPromoteRegister extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */

  actData = null // 活動資訊

  form = {
  	session: null, // 報名場次
  	name: '', // 從登入資訊取姓名
  	department: '', // 從登入資訊取部門
  	unit: '', // 從登入資訊取單位
  	telNo: '', // 連絡電話
  	email: '', // 聯絡信箱
  }

  otherForm = null // 其他問項表單

  formRules = {
  	session: [{ required: true, message: '請選擇場次', trigger: 'blur' }],
  	department: [{ required: true, message: '請填寫部門', trigger: 'blur' }],
  	unit: [{ required: true, message: '請填寫科別', trigger: 'blur' }],
  	telNo: [{ required: true, message: '請填寫電話', trigger: 'blur' }],
  	email: [{ required: true, message: '請填寫email', trigger: 'blur' }],
  }

  // 欲報名場次radio
  sessionRadios = []

  // 活動ID
  actId = null

  // 報名ID
  singupInfoId = null

  questionnaire = null

  publicMail = null

  @Watch('form.session')
  onSessionChange(val) {
  	if (val !== null) {
  	  this.getSessionAmount(val);
  	}
  }

  /**
   * Event
   */
  // 填寫報名資訊，「取消」
  cancelRegister() {
  	// 回到活動資訊頁面
  	// this.$router.push({ name: 'HealthPromoteDescrip' });
  	history.back();
  }

  // 填寫報名資訊，『確認』
  submitRegister() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.fetchRegisterAPI();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  fetchRegisterAPI() {
  	const query = this.$global.getQuery();
  	this.setLoading(true);
  	if (query.action === 'edit') {
  		const data: HealthActUpdateSingUpInfoDto = {
  			actId: this.actId,
  			department: this.form.department,
  			email: this.form.email,
  			name: this.form.name,
  			sessionId: this.form.session,
  			telNo: this.form.telNo,
  			unit: '',
  			singupInfoId: this.singupInfoId,
  			uid: this.$user.getMe().userId, // 登入者ID
  			topicIdAndAnswersDtoList: [], // 其他問項問券資料
  		};
  		if (this.questionnaire) {
  			Object.entries(this.form).forEach(([key, val], index) => {
  				if (key !== 'department' && key !== 'name' && key !== 'session' && key !== 'telNo' && key !== 'unit' && key !== 'email') {
  					data.topicIdAndAnswersDtoList.push({
  						answers: val ? val.toString() : '',
  						topicId: parseInt(key),
  					});
  				}
  			});
  		}
  		console.log(data);
  		this.$PHPEmpHealthActSignupApi.updateSingupInfoUsingPOST(data)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  					toRouter: 'HealthPromoteResult',
  					query: {
  						result: resp.data.status === 200 ? 'success' : 'fail',
  						message: resp.data.status === 200 ? '' : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					},
  				});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	} else {
  		const data: HealthActSignupInfoModel = {
  			actId: this.actId,
  			department: this.form.department,
  			email: this.form.email,
  			name: this.form.name,
  			sessionId: this.form.session,
  			telNo: this.form.telNo,
  			unit: this.form.unit,
  			uid: this.$user.getMe().userId, // 登入者ID
  			topicIdAndAnswersDtoList: [], // 其他問項問券資料
  		};
  		if (this.questionnaire) {
  			Object.entries(this.form).forEach(([key, val], index) => {
  				if (key !== 'department' && key !== 'name' && key !== 'session' && key !== 'telNo' && key !== 'unit' && key !== 'email') {
  					data.topicIdAndAnswersDtoList.push({
  						answers: val ? val.toString() : '',
  						topicId: parseInt(key),
  					});
  				}
  			});
  		}
  		console.log(data);
  		this.$PHPEmpHealthActSignupApi.newSignupInfoEUsingPOST(data)
  		.then((resp) => {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'HealthPromoteResult',
  					query: {
  						result: resp.data.status === 200 ? 'success' : 'fail',
  						message: resp.data.status === 200 ? '' : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					},
  				});
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	}
  }

  // 取得場次
  getSession() {
  	// const id = 4;
  	const id = this.actId;
  	this.$PHPEmpHealthActApi.queryHealthActSessionEUsingPOST(id)
  		.then((resp) => {
  			this.sessionRadios = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取得場次人數
  getSessionAmount(sessionID) {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.querySessionUserCountEUsingPOST(sessionID)
  		.then((resp) => {
  			// this.sessionRadios = resp.data.data;
  			if (resp.data.data.isFull === 'Y') {
  				InfoModal.alertError({
  					title: '場次已滿',
  					confirm: false,
  					content: '所選取場次人數已滿，請選擇其他場次，謝謝。',
  				});
  				this.form.session = null;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 拿取登入者資訊 (新增用)
  async getInitData() {
  	const $userData = this.$user.getMe();
  	this.form.name = $userData.name;
  	this.form.department = $userData.dptName;
  	this.form.unit = $userData.dptName;
  	await this.$UtilityApi.decryptBase64UsingPOST({ decryptData: $userData.email })
  		.then((resp) => {
  			this.form.email = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			//
  		});
  	// console.log($userData)
  }

  // 帶出編輯過資料
  getRegisterData() {
  	this.$PHPEmpHealthActSignupApi.bringSingleInfoUsingPOST({ actId: this.actId, singupInfoId: this.singupInfoId })
  		.then((resp) => {
  			// this.sessionRadios = resp.data.data;
  			console.log(resp);
  			this.form.name = resp.data.data.name;
  			this.form.department = resp.data.data.department;
  			this.form.unit = resp.data.data.unit;
  			this.form.telNo = resp.data.data.telNo;
  			this.form.email = resp.data.data.email;
  			this.form.session = resp.data.data.sessionId;
  			this.setFormModel(resp.data.data.topicIdAndAnswersDtoList);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 帶出其它問項答案
  setFormModel(answers) {
  	answers.forEach((element) => {
  		const key = element.topicId.toString();
  		console.log(key);
  		this.form[key] = element.answers;
  	});
  }

  // 2.1.7	查詢健康促進活動問卷API
  getQuestData() {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.queryHealthActQuestEUsingPOST(this.actId)
  		.then((resp) => {
  			const arr = resp.data.data.sort((a, b) => (a.topicId - b.topicId)); // 排序
  			console.log(arr);
  			if (resp.data.data && resp.data.data.length > 5) {
  				this.sortQuset(arr.slice(5, arr.length)); // 只取第五項後表單選項
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 整理問券陣列
  sortQuset(array) {
  	const maxtixTitles = [];
  	array.forEach((element, index) => {
  		this.$set(this.form, element.topicId.toString(), null);
  		// 整理矩陣問題
  		if (element.type === 7) {
  			if (element.healthActQuestTopicOptDtoList && element.healthActQuestTopicOptDtoList.length > 0) {
  				maxtixTitles.push(element.topicId);
  				element.maxtixList = array.filter((e) => e.type === 7 && e.topicId > element.topicId);
  				const len = element.maxtixList.length;
  				const startIdx = element.maxtixList.findIndex((e) => e.healthActQuestTopicOptDtoList && e.healthActQuestTopicOptDtoList.length > 0);
  				element.maxtixList = element.maxtixList.slice(0, startIdx > 0 ? startIdx : len);
  			}
  		}
  		// 加入必填檢核
  		if (element.isAnswer === 'Y' && !element.maxtixList) {
  			this.formRules[element.topicId.toString()] = [{ required: true, message: `${element.title}為必填`, trigger: 'blur' }];
  		}
  	});
  	this.questionnaire = array;
  	console.log(this.form);
  }

  async created() {
  	const query = this.$global.getQuery();
  	this.actId = query.actId;
  	this.singupInfoId = query.singupInfoId; // 從編輯按鈕來的才會有值
  	this.actData = query.data;
  	this.getSession();
  	this.getQuestData(); // 拿取其他問項
  	if (query.action && query.action === 'edit') {
  		this.getRegisterData();
  	} else {
  	  this.getInitData(); // 拿取登入者資訊
  	}
	  this.publicMail = await this.$global.getPublicEmail();
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>

  .info__item__title {
    font-size: 16px;
    font-weight: 600;
    color: $COLOR-BLACK;
  }
  .info__item__content {
    font-size: 18px;
    color: $COLOR-GRAY1;
  }

  // 活動資訊
  .active__info__wrap {
    padding: 30px;
  }
  .active__info__item {
    margin: 0 20px;
    padding: 0 10px;
  }
  .form__card {
    background: $COLOR-MAIN10;
    // padding: 30px 92px;
  }
  .form__card__title {
    font-size: 30px;
    font-weight: 600;
    color: $COLOR-MAIN1;
    @include media-breakpoint-down('md') {
      font-size: 20px;
    }
  }
  .form__label__bg {
    background: $COLOR-WHITE;
    // line-height: 60px;
    margin-bottom: 10px;
    padding: 15px;
    white-space: initial;
  }

  .pageHealthPromoteRegisterFormModel {
    margin-top: 20px;
    ::v-deep {
      .ant-form-item-control {
        line-height: 2;
      }
      .a-form-label {
        font-weight: 600;
        color: $COLOR-BLACK;
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    display: inline-block;
    margin-left: 5px;
    font-size: 16px;
  }
  .active__info__inner {
    max-width: 900px;
    margin: auto;
  }
  .form__label__title {
    font-size: 16px;
    color: black;
    font-weight: 600;
  }
  .satisfaction__title {
    display: none;
    padding-top: 20px;
    font-size: 14px;
    font-weight: 600;
    @include rwd-sm {
      padding-top: 0px;
      line-height: 40px;
      text-align: center;
    }
    @include rwd-xl {
      font-size: 16px;
      line-height: 60px;
    }
    &:first-child {
      display: flex;
    }
  }
  .option__title {
    font-weight: 600;
    font-size: 14px;
  }
   ::v-deep {
    .ant-form-item-label > label {
      font-size: 14px;
      @include rwd-xl {
        font-size: 16px;
      }
    }
    .ant-form-item-control{
      line-height: 0px;
    }
    .satisfaction__item {
      text-align: center;
      line-height: 40px;
      font-size: 14px;
        &:nth-child(2n+1) {
            background: $COLOR-WHITE;
        }
        &.with-white-bg {
          background: $COLOR-WHITE;
        }
      @include rwd-xl {
        font-size: 16px;
        line-height: 60px;
      }
    }
    .satisfaction__option {
      display: flex;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      @include rwd-xl {
        font-size: 16px;
        line-height: 60px;
      }
    }
    .satisfaction__radio {
      flex: 1;
      line-height: 40px;
      @include rwd-xl {
        line-height: 60px;
      }
    }
  }
</style>
