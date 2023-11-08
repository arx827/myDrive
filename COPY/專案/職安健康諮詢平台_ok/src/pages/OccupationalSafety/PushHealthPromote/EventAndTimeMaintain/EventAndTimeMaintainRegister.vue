<template>
  <div class="container">
    <div class="page__title">
      {{ isEdit ? '編輯人員報名資訊':'新增報名' }}
    </div>

    <div class="page__card form__card">
      <div class="active__info__inner">
        <a-form-model
          ref="pageHealthPromoteRegisterFormModel"
          class="pageHealthPromoteRegisterFormModel"
          :form="form"
          :model="form"
          :rules="rules"
          :hide-required-mark="true"
          :layout="'vertical'"
        >
          <template>
            <div
              v-if="isEdit"
              class="form__card__title"
            >
              {{ actName }}
            </div>
            <a-form-model-item
              v-else
              prop="actId"
            >
              <span slot="label">
                欲報名活動
                <span class="mark-required">*</span>
              </span>
              <a-select
                v-model="form.actId"
                placeholder="報名活動"
                class="select eventSelect"
                size="large"
                :allow-clear="true"
              >
                <a-select-option
                  v-for="opt in actOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </template>
          <a-form-model-item
            v-show="sessionRadios"
            prop="sessionId"
          >
            <span slot="label">
              欲報名場次
              <span class="mark-required">*</span>
            </span>
            <a-radio-group
              v-model="form.sessionId"
              class="w-100"
            >
              <a-radio
                v-for="(item, index) in sessionRadios"
                :key="index"
                class="form__label__bg d-flex align-items-center"
                :value="item.value"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item prop="name">
            <span
              slot="label"
              class="form-label-slot"
            >
              報名人姓名
              <span class="mark-required">*</span>
              <a
                v-if="!isEdit"
                href="#"
                class="float-end"
                @click="queryModalVisible=true"
              ><a-icon type="search" /> 員工查詢</a>
            </span>
            <a-input
              v-model="form.name"
              :disabled="true"
              type="text"
              size="large"
              placeholder="e.g. 許亮亮"
            />
          </a-form-model-item>
          <a-form-model-item prop="department">
            <span slot="label">
              部門/單位
              <span class="mark-required">*</span>
            </span>
            <a-input-group compact>
              <a-input
                v-model="form.department"
                placeholder="e.g. 系統整合部"
                style="width: 40%"
              />
              <a-input
                v-model="form.unit"
                placeholder="e.g. 職安勤務長文科名科"
                style="width: 60%"
              />
            </a-input-group>
          </a-form-model-item>
          <a-form-model-item prop="telNo">
            <span slot="label">
              連絡電話
              <span class="mark-required">*</span>
            </span>
            <a-input
              v-model="form.telNo"
              type="text"
              size="large"
              placeholder="e.g. 0918372888"
            />
          </a-form-model-item>
          <a-form-model-item prop="email">
            <span slot="label">
              連絡信箱
              <span class="mark-required">*</span>
            </span>
            <a-input
              v-model="form.email"
              type="text"
              size="large"
              :placeholder="`e.g. ${publicMail}`"
            />
          </a-form-model-item>
          <a-form-model-item
            v-if="isEdit"
            prop="checkInTime"
          >
            <span slot="label">
              簽到時間
            </span>
            <a-time-picker
              v-model="form.checkInTime"
              size="large"
              format="HH:mm"
              placeholder="e.g. 14:00"
            />
          </a-form-model-item>

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
      <button
        class="btn__radius--primary--outline"
        @click="cancelRegister()"
      >
        取消
      </button>
      <button
        class="btn__radius--primary"
        @click="submitRegister()"
      >
        確認
      </button>
    </div>
    <!-- 員工查詢 -->
    <staff-query-modal
      :visible="queryModalVisible"
      @close-modal="closeQueryModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Action } from 'vuex-class';
import { HealthActSingupInfoUpdateModel } from '@fubonlife/oss-api-axios-sdk';
import StaffQueryModal from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/StaffQueryModal.vue';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';

@Component({
	components: { StaffQueryModal },
})
export default class EventAndTimeMaintainRegister extends Vue {
  @Action('setLoading') setLoading;

  formatter = this.$adDateFormatter;

  /**
   * data
   */
  actName = '';

  actOptions = null;

  sessionRadios = null;

  questionnaire = null

  // 編輯 or 新增
  isEdit = false;

  form: HealthActSingupInfoUpdateModel = {
  	actId: undefined,
  	department: undefined,
  	email: undefined,
  	name: undefined,
  	sessionId: undefined,
  	singupInfoId: undefined,
  	telNo: undefined,
  	uid: undefined,
  	unit: undefined,
  	checkInTime: undefined,
  	healthActQuestTopicAnswersDtoList: [], // 其他問項問券資料
  };

  rules: { [key: string]: ValidationRule[] } = {
  	actId: [{ required: true, message: '請選擇欲報名的活動', trigger: 'change' }],
  	sessionId: [{ required: true, message: '請選擇報名場次', trigger: 'change' }],
  	name: [{ required: true, message: '請填寫報名人姓名', trigger: 'change' }],
  	email: [{ required: true, message: '請填寫連絡信箱', trigger: 'change' }],
  	telNo: [{ required: true, message: '請填寫連絡電話', trigger: 'change' }],
  	department: [{ required: true, message: '請選擇部門/單位', trigger: 'change' }],
  	unit: [{ required: true, message: '請選擇單位', trigger: 'change' }],
  };

  queryModalVisible = false // 員工查詢modal

  publicMail = null

  closeQueryModal(data) {
  	this.queryModalVisible = false;
  	if (!data) return;
  	this.getEmpInfo(data);
  }

  async setResultParam() {
  	this.isEdit = this.$router.currentRoute.params.type === 'edit';
  	const $query = this.$global.getQuery();
  	if ($query) {
  		const { singupInfoId, actId, actName } = $query;
  		this.actName = actName;
  		this.form.actId = actId;
  		this.form.singupInfoId = singupInfoId;
  		this.getSignUpInfo();
  	}
  }

  getEmpInfo({
  	department, userName, uid, telNo, email,
  }) {
  	const [dep, unit] = department.split(' ');
  	this.form.department = dep;
  	this.form.unit = unit;
  	this.form.uid = uid;
  	this.form.name = userName;
  	this.form.telNo = telNo;
  	this.form.email = email;
  	(this.$refs.pageHealthPromoteRegisterFormModel as any).validateField('department');
  	(this.$refs.pageHealthPromoteRegisterFormModel as any).validateField('name');
  }

  // 取得場次人數
  getSessionAmount(sessionID) {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.querySessionUserCountEUsingPOST(sessionID)
  		.then((resp) => {
  			if (resp.data.data.isFull === 'Y') {
  				InfoModal.alertError({
  					title: '場次已滿',
  					confirm: false,
  					content: '所選取場次人數已滿，請選擇其他場次，謝謝。',
  				});
  				this.form.sessionId = null;
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 取得單一報名明細
  getSignUpInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventRegistrationListApi.getHealthActSingUpInfoRUsingPOST(this.form.singupInfoId)
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				this.form = resp.data.data;
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢健康促進活動
  getAct() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getHealthActPageRUsingPOST({
  		// actStatus: 1,
  		pageNo: 0,
  		pageSize: 1000,
  	})
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const getData = resp.data.data.content;
  				this.actOptions = getData.map((i) => ({
  					value: i.actId,
  					label: i.actName,
  				}));
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢場次
  getSession(actId) {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.queryHealthActSessionEUsingPOST(actId)
  		.then((resp) => {
  			this.sessionRadios = resp.data.data.map((i) => ({
  				value: i.sessionId,
  				label: `【${i.buildingName}_${i.sessionName}】 ${i.location}`,
  			}));
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 新增報名資料
  createRegister(form) {
  	this.setLoading(true);
  	const { name, uid } = form;
  	console.log('createRegister==>', form);
  	if (this.questionnaire) {
  		Object.entries(this.form).forEach(([key, val], index) => {
  			if (key !== 'department' && key !== 'name' && key !== 'session' && key !== 'telNo' && key !== 'unit' && key !== 'email'
        && key !== 'checkInTime' && key !== 'healthActQuestTopicAnswersDtoList'
        && key !== 'actId' && key !== 'sessionId' && key !== 'singupInfoId' && key !== 'uid') {
  			console.log('key==>', key);
  			console.log('val==>', val);

  				form.healthActQuestTopicAnswersDtoList.push({
  					answers: val ? val.toString() : '',
  					topicId: parseInt(key),
  				});
  			}
  		});
  	}
  	console.log('createRegister==>', form.healthActQuestTopicAnswersDtoList);
  	this.$PHPRpnEventRegistrationListApi.healthActSingupInfoCreateRUsingPOST(form)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'EventAndTimeMaintainRegisterResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'error',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  					name,
  					uid,
  				},
  			});
  		})
  		.catch((error) => {
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成新增項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 修改報名資料
  editRegister(form) {
  	this.setLoading(true);
  	this.$PHPRpnEventRegistrationListApi.healthActSingupInfoUpdateRUsingPOST(form)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'EventAndTimeMaintainResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'error',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		})
  		.catch((error) => {
  			// console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成修改項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 2.1.7	查詢健康促進活動問卷API
  getQuestData(actId) {
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.queryHealthActQuestEUsingPOST(actId)
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
  			this.rules[element.topicId.toString()] = [{ required: true, message: `${element.title}為必填`, trigger: 'blur' }];
  		}
  	});
  	this.questionnaire = array;
  	console.log(this.form);
  }

  /**
   * Event
   */
  cancelRegister() {
  	this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  }

  submitRegister() {
  	const { checkInTime, ...other } = this.form;
  	const form = {
  		checkInTime: checkInTime && moment(checkInTime).format('HH:mm'),
  		...other,
  	};
  	(this.$refs.pageHealthPromoteRegisterFormModel as any).validate()
  		.then(() => {
  			(this.isEdit) ? this.editRegister(form) : this.createRegister(form);
  		});
  }

  /**
   * Hook
   */
  async created() {
  	await this.getAct();
  	this.setResultParam();
	  this.publicMail = await this.$global.getPublicEmail();
  }

  @Watch('form.actId')
  onActIdChange(val) {
  	if (val) {
  		this.getSession(val);
  		this.getQuestData(val);
  	} else {
  		this.sessionRadios = null;
  	}
  }

  @Watch('form.sessionId')
  onSessionChange(val) {
  	if (val !== null) {
  	  this.getSessionAmount(val);
  	}
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
    .btn__view {
      width: 100px;
      margin: 0;
    }
  }

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
    margin-bottom: 20px;
  }
  .form__label__bg {
    background: $COLOR-WHITE;
    // line-height: 60px;
    margin-bottom: 10px;
    padding: 15px;
    white-space: initial;
  }

  .eventSelect {
    width: 100%;
  }

  .pageHealthPromoteRegisterFormModel {
    margin-top: 20px;
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
  ::v-deep {
    .ant-input {
      height: 40px;
    }
    .ant-form-item-control {
      line-height: 2;
    }
    .a-form-label {
      font-weight: 600;
      color: $COLOR-BLACK;
    }
    .ant-time-picker-input {
      font-size: 14px;
      &::placeholder {
        font-size: 14px;
      }
    }
  }
</style>
