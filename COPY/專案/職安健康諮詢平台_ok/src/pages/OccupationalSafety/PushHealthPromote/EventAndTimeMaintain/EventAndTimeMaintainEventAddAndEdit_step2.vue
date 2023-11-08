<template>
  <div>
    <a-form-model
      ref="eventSettingStep2Form"
      class="form__wrap"
      :form="form"
      :model="form"
      :rules="rules"
      :hide-required-mark="true"
      :layout="'vertical'"
    >
      <!-- 活動資訊 -->
      <div class="event__wrap bg__light">
        <div class="event__block__title event__info">
          活動資訊
        </div>
        <div class="event__block">
          <a-form-model-item prop="actName">
            <span slot="label">
              活動名稱
              <span class="mark-required">*</span>
            </span>
            <a-input
              v-model="form.actName"
              type="text"
              placeholder="e.g. 健康促進樂活講座"
            />
          </a-form-model-item>

          <a-row
            type="flex"
            justify="center"
            :gutter="[15, 0]"
          >
            <a-col span="12">
              <a-form-model-item prop="actDate">
                <span slot="label">
                  活動日期
                  <span class="mark-required">*</span>
                </span>
                <date-picker
                  v-model="form.actDate"
                  style="width: 100%"
                  :allow-clear="true"
                  type="date"
                  :disabled-date="disabledDate"
                  :format="'YYYY/MM/DD'"
                  placeholder="eg.2022/01/01"
                />
              </a-form-model-item>
            </a-col>
            <a-col span="12">
              <a-form-model-item>
                <span slot="label">
                  活動時間
                  <span class="mark-required">*</span>
                </span>
                <div class="actInfo-timePicker">
                  <a-form-model-item prop="actStartTime">
                    <a-time-picker
                      v-model="form.actStartTime"
                      size="large"
                      format="HH:mm"
                      placeholder="e.g. 14:00"
                    />
                  </a-form-model-item>
                  <p class="px-2 my-2">
                    ~
                  </p>
                  <a-form-model-item prop="actEndTime">
                    <a-time-picker
                      v-model="form.actEndTime"
                      size="large"
                      format="HH:mm"
                      placeholder="e.g. 17:00"
                    />
                  </a-form-model-item>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row
            type="flex"
            justify="center"
            :gutter="[15, 0]"
          >
            <a-col span="12">
              <a-form-model-item prop="signupDate">
                <span slot="label">
                  可報名期間（亦為報名表填寫期間）
                  <span class="mark-required">*</span>
                </span>
                <date-picker
                  v-model="form.signupDate"
                  style="width: 100%"
                  :allow-clear="true"
                  type="date"
                  :range-separator="'~'"
                  :range="true"
                  :disabled-date="disabledAfterActDate"
                  :format="'YYYY/MM/DD'"
                  placeholder="可報名期間 請早於活動日期"
                />
              </a-form-model-item>
            </a-col>
            <a-col span="12" />
          </a-row>

          <a-row
            type="flex"
            justify="center"
            :gutter="[15, 0]"
          >
            <a-col span="12">
              <a-form-model-item prop="remindDate">
                <span slot="label">
                  發送提醒通知日期
                  <span class="mark-required">*</span>
                </span>
                <date-picker
                  v-model="form.remindDate"
                  style="width: 100%"
                  :allow-clear="true"
                  type="date"
                  :format="'YYYY/MM/DD'"
                  :disabled-date="disabledAfterActDate"
                  placeholder="發送提醒通知日期 請早於活動日期"
                />
              </a-form-model-item>
            </a-col>
            <a-col span="12">
              <a-form-model-item prop="sendSatisfyQuestDate">
                <span slot="label">
                  滿意度問卷發送日期
                  <span class="mark-required">*</span>
                </span>
                <date-picker
                  v-model="form.sendSatisfyQuestDate"
                  style="width: 100%"
                  :allow-clear="true"
                  type="date"
                  :format="'YYYY/MM/DD'"
                  :disabled-date="disabledBeforeActDate"
                  placeholder="滿意度問卷發送日期 請晚於活動日期"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- 場次資訊 -->
      <div class="event__wrap bg__light">
        <div class="d-flex justify-content-between">
          <div class="event__block__title">
            場次資訊
          </div>
          <button
            class="btn__radius--primary--outline"
            @click="handleAdd"
          >
            新增場次
          </button>
        </div>
        <div
          v-for="(sessionDetail, index) in form.activitiesList"
          :key="index"
        >
          <div class="event__block bg__white">
            <div class="d-flex justify-content-end icon__delete__wrap">
              <button
                class="icon-button icon__delete"
                @click="handleDelete(sessionDetail)"
              >
                <a-icon type="delete" />
              </button>
            </div>
            <div class="event__block__content">
              <!-- 動態綁定檢核規則 -->
              <a-form-model-item
                :prop="'activitiesList.'+ index +'.sessionName'"
                :rules="rules.sessionName"
              >
                <span slot="label">
                  場次名稱
                  <span class="mark-required">*</span>
                </span>
                <a-input
                  v-model="sessionDetail.sessionName"
                  type="text"
                  placeholder="e.g. 【台北】場次一"
                />
              </a-form-model-item>

              <a-row
                type="flex"
                justify="center"
                :gutter="[15, 0]"
              >
                <a-col span="12">
                  <a-form-model-item
                    :prop="'activitiesList.'+ index +'.wbInfoId'"
                    :rules="rules.wbInfoId"
                  >
                    <span slot="label">
                      場次大樓
                      <span class="mark-required">*</span>
                    </span>
                    <a-select
                      v-model="sessionDetail.wbInfoId"
                      :allow-clear="true"
                      :show-arrow="true"
                      :options="optionEnum.wbInfoId"
                      class="memberCard-auth"
                      placeholder="e.g. 建北大樓_台北市建國北路二段236號"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col span="12">
                  <a-form-model-item
                    :prop="'activitiesList.'+ index +'.location'"
                    :rules="rules.location"
                  >
                    <span slot="label">
                      場次地點
                      <span class="mark-required">*</span>
                    </span>
                    <a-input
                      v-model="sessionDetail.location"
                      type="text"
                      placeholder="e.g. 1樓職安訓練教室"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>

              <a-row
                type="flex"
                justify="center"
                :gutter="[15, 0]"
              >
                <a-col span="12">
                  <a-form-model-item
                    :prop="'activitiesList.'+ index +'.type'"
                    :rules="rules.type"
                  >
                    <span slot="label">
                      活動類型
                      <span class="mark-required">*</span>
                    </span>
                    <a-radio-group v-model="sessionDetail.type">
                      <a-radio
                        v-for="item in optionEnum.type"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
                <a-col span="12">
                  <a-form-model-item>
                    <span slot="label">
                      人數限制(最低/最高)
                      <span class="mark-required">*</span>
                    </span>
                    <div class="sessionInfo-inputGroup">
                      <a-form-model-item
                        :prop="'activitiesList.'+ index +'.minCount'"
                        :rules="rules.minCount"
                      >
                        <a-input-number
                          v-model="sessionDetail.minCount"
                          :min="0"
                          placeholder="e.g. 0"
                        />
                      </a-form-model-item>
                      <p class="px-2 my-2">
                        ~
                      </p>
                      <a-form-model-item
                        :prop="'activitiesList.'+ index +'.maxCount'"
                        :rules="rules.maxCount"
                      >
                        <a-input-number
                          v-model="sessionDetail.maxCount"
                          :min="0"
                          placeholder="e.g. 0"
                        />
                      </a-form-model-item>
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
    <div
      class="btn__wrap text-center"
      style="width:100%"
    >
      <button
        class="btn__view btn__radius--primary--outline float-start"
        @click="saveTemp"
      >
        暫存
      </button>
      <button
        class="btn__radius--primary--outline"
        @click="handlePrevStep"
      >
        上一步
      </button>
      <button
        class="btn__radius--primary"
        @click="handleNextStep"
      >
        下一步
      </button>
      <button
        class="btn__view btn__radius--primary--outline float-end"
        @click="()=>previewModalVisible=true"
      >
        預覽
      </button>
    </div>

    <!-- 預覽 -->
    <PerformancePreviewModal
      :visible="previewModalVisible"
      :form="form"
      :option-enum="optionEnum"
      @closeModal="handleCloseModal"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import PerformancePreviewModal from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/PerformancePreviewModal.vue';
import { ActAndSessionModel, ActInfoModel, SessionInfoModel } from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit.vue';
import { HealthActCreateModel } from '@fubonlife/oss-api-axios-sdk';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({ components: { PerformancePreviewModal } })
export default class EventAndTimeMaintainEventAddAndEditStep2 extends Vue {
   @Action('setLoading') setLoading;

   /**
   * data
   */
  actId = 0;

  form: ActAndSessionModel = {
  	actName: null,
  	actDate: null,
  	actStartTime: null,
  	actEndTime: null,
  	signupDate: [],
  	remindDate: null,
  	sendSatisfyQuestDate: null,
  	activitiesList: [
  		{
  			sessionName: null,
  			wbInfoId: null,
  			location: null,
  			type: null,
  			minCount: null,
  			maxCount: null,
  		},
  	],
  };

  rules: { [key: string]: ValidationRule[] } = {
  	actName: [{ required: true, message: '請填寫活動名稱', trigger: 'change' }],
  	actDate: [{ required: true, trigger: 'change', message: '請選擇活動日期' }],
  	actStartTime: [{ required: true, trigger: 'change', message: '請選擇活動起訖時間' }],
  	actEndTime: [{ required: true, trigger: 'change', message: '請選擇活動起訖時間' }],
  	signupDate: [{ required: true, trigger: 'change', validator: this.checkSignupDate }],
  	remindDate: [{ required: true, trigger: 'change', message: '請選擇發送提醒通知日期' }],
  	sendSatisfyQuestDate: [{ required: true, trigger: 'change', message: '請選擇滿意度問卷發送日期' }],
  	sessionName: [{ required: true, trigger: 'change', message: '請填寫場次名稱' }],
  	wbInfoId: [{ required: true, trigger: 'change', message: '請選擇場次大樓' }],
  	location: [{ required: true, trigger: 'change', message: '請填寫場次地點' }],
  	type: [{ required: true, trigger: 'change', message: '請選擇活動類型' }],
  	minCount: [{ required: true, trigger: 'change', message: '請填寫最低人數限制' }],
  	maxCount: [{ required: true, trigger: 'change', message: '請填寫最高人數限制' }],
  };

  prevData = null;

  // 下拉選項
  optionEnum = {
  	wbInfoId: [], // 職場大樓
  	type: [], // 活動類型
  }

  // 編輯 or 新增
  paramsType = '';

  // 暫存欲刪除的資料
  tempDeleteItem = {}

  previewModalVisible = false;

  /**
   * func
   */
  // 【可報名期間】欄位檢核
  checkSignupDate(rule, value, callback) {
  	const [st, en] = value;
  	if (!st || !en) {
  		callback('請選擇可報名期間');
  	} else {
  		callback();
  	}
  }

  // 驗證場次數量
  checkEventCount() {
  	if (this.form.activitiesList.length === 1) {
  		InfoModal.alertSuccess({
  			title: '須至少保留一個場次',
  			confirm: false,
  			content: '無法完成您的刪除，該活動必須至少保留一個場次。',
  		});
  		return;
  	}
  	const deleteIndex = this.form.activitiesList.findIndex((performanceInfo) => performanceInfo == this.tempDeleteItem);
  	this.form.activitiesList.splice(deleteIndex, 1);
  }

  async setResultParam() {
  	const query = this.$global.getQuery();
  	this.actId = query.actId;
  	this.paramsType = this.$router.currentRoute.params.type;

  	if (this.paramsType == 'edit') {
  		await this.getActInfo();
  		await this.getSessionInfo();
  	}

  	// 判斷 session 有沒有資料
  	if (sessionStorage.getItem('form_step1')) {
  		this.prevData = JSON.parse(sessionStorage.getItem('form_step1'));
  	}
  	if (sessionStorage.getItem('form_step2')) {
  		const {
  			actDate, actStartTime, actEndTime, signupStartDate, signupEndDate, remindDate, sendSatisfyQuestDate, picture, ...other
  		} = JSON.parse(sessionStorage.getItem('form_step2'));
  		Object.assign(this.form, {
  			actDate: actDate && new Date(actDate),
  			actStartTime: actStartTime && moment(actStartTime, 'HH:mm'),
  			actEndTime: actEndTime && moment(actEndTime, 'HH:mm'),
  			remindDate: remindDate && new Date(remindDate),
  			sendSatisfyQuestDate: sendSatisfyQuestDate && new Date(sendSatisfyQuestDate),
  			signupDate: (signupStartDate && signupEndDate) ? [new Date(signupStartDate), new Date(signupEndDate)] : [],
  			...other,
  		});
  	}
  }

  getOpts() {
  	this.optionEnum.type = this.$enum.sessionTypeEnum.map((i) => ({
  		value: i.key,
  		label: i.val,
  	}));
  	this.getWokingBuildingInfo();
  }

  disabledDate(current) {
  	const date = new Date();
  	// 禁用過去的時間
  	return current && current < moment().date(date.getDate() - 1);
  }

  disabledAfterActDate(current) {
  	const date = new Date();
  	const { actDate } = this.form;
  	if (actDate) {
  		// 禁用過去及活動日期之後的時間
  		return current && (current < moment().date(date.getDate() - 1) || current > moment(actDate));
  	}
  	// 禁用過去的時間
  	return current && current < moment().date(date.getDate() - 1);
  }

  disabledBeforeActDate(current) {
  	const date = new Date();
  	const { actDate } = this.form;
  	if (actDate) {
  		// 禁用活動日期之前的時間
  	  return current && current < moment(this.form.actDate);
  	}
  	// 禁用過去的時間
  	return current && current < moment().date(date.getDate() - 1);
  }

  // API: 查詢職場大樓API
  getWokingBuildingInfo() {
  	this.setLoading(true);
  	this.$PCREmpPhysicianConsultControllerApi.getWorkBuildingInfoUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((item) => {
  					this.optionEnum.wbInfoId.push({
  						value: item.wbInfoId,
  						label: item.buildingName,
  					});
  			  });
  			} else {
  				this.$infoNotification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢單一健康促進活動API
  async getActInfo() {
  	this.setLoading(true);
  	await this.$PHPRpnEventSessionMaintainApi.getOneHealthActRpnUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const {
  					actName, actDate, actStartTime, actEndTime, signupStartDate, signupEndDate, remindDate, sendSatisfyQuestDate, edmBannerFileName, ...other
  				} = resp.data.data;

  				this.prevData = {
  					fileName: edmBannerFileName,
  					...other,
  				};

  				Object.assign(this.form, {
  					actName,
  					actDate: actDate && new Date(actDate),
  					actStartTime: actStartTime && moment(actStartTime, 'HH:mm'),
  					actEndTime: actEndTime && moment(actEndTime, 'HH:mm'),
  					remindDate: remindDate && new Date(remindDate),
  					sendSatisfyQuestDate: sendSatisfyQuestDate && new Date(sendSatisfyQuestDate),
  					signupDate: [signupStartDate && new Date(signupStartDate), signupEndDate && new Date(signupEndDate)],
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢場次資訊API
  async getSessionInfo() {
  	this.setLoading(true);
  	await this.$PHPRpnEventSessionMaintainApi.getHealthActSessionDetailUsingPOST(this.actId)
  	.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				// TEST:
  				// console.log(getData);
  				if (getData.length > 0) {
  					this.form.activitiesList = getData.map((dto) => {
  						const {
  							sessionId, count, sessionType, ...other
  						} = dto;
  						return {
  							type: sessionType,
  							...other,
  						};
  					});
  				} else {
  					this.form.activitiesList = [{
  						sessionName: null,
  						wbInfoId: null,
  						location: null,
  						type: null,
  						minCount: null,
  						maxCount: null,
  			  	}];
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 暫存健康促進活動 API
  saveTemp() {
  	const file = this.$customUpload.dataURLtoFile(this.prevData.picture, this.prevData.fileName);
  	this.setLoading(true);
  	const $formData = this.mapToFormData();
  	console.log('this.mapToFormData():', this.mapToFormData());
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHTPUSHTEMPSAVE,
  		'healthActCreateModel',
  		$formData,
  		'file',
  		[file],
  		(resp) => {
  			this.$infoNotification.success({
  				content: '已成功暫存。',
  			});
  		},
  		(msg) => {
  			this.$infoNotification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.$PHPRpnEventSessionMaintainApi.saveTempHealthActWithPictureUsingPOST($formData)
  	// 	.then((resp) => {
  	// 		if (resp.data.status == 200) {
  	// 			this.prevData.filePath = resp.data.data.filePath;
  	// 			this.$infoNotification.success({
  	// 				content: '已成功暫存。',
  	// 			});
  	// 		} else {
  	// 			const getError = resp.data;
  	// 			this.$infoNotification.error({
  	// 				content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成暫存項目，請再次嘗試。',
  	// 			});
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 		this.$infoNotification.error({
  	// 			content: '無法完成暫存項目，請再次嘗試。',
  	// 		});
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // mapping 成後端接受的資料型態
  mapToFormData(): HealthActCreateModel {
  	const { picture, fileName, ...prevFormData } = this.prevData;
  	const {
  		actDate, actStartTime, actEndTime, signupDate, remindDate, sendSatisfyQuestDate, activitiesList, ...other
  	} = this.form;
  	const filterActivitiesList = [];
  	activitiesList.forEach((obj) => {
  		if (this.checkObjHasVal(obj)) {
  			filterActivitiesList.push(obj);
  		}
  	});
  	return {
  		...prevFormData,
  		actDate: actDate && actDate.toISOString(),
  		actStartTime: actStartTime && moment(actStartTime).format('HH:mm'),
  		actEndTime: actEndTime && moment(actEndTime).format('HH:mm'),
  		signupStartDate: signupDate[0] && signupDate[0].toISOString(),
  		signupEndDate: signupDate[1] && signupDate[1].toISOString(),
  		remindDate: remindDate && remindDate.toISOString(),
  		sendSatisfyQuestDate: sendSatisfyQuestDate && sendSatisfyQuestDate.toISOString(),
  		activitiesList: filterActivitiesList,
  		...other,
  	};
  }

  // 檢查是否有屬性值
  checkObjHasVal(obj) {
  	let bool = false;
  	for (const [key, value] of Object.entries(obj)) {
  		const val: any = value;
  		if (val && val.length !== 0) {
  			bool = true;
  		}
  	}
  	return bool;
  }

  /**
   * Event
   */
  // 點擊按鈕，『新增場次』
  handleAdd() {
  	const sessionDetail: SessionInfoModel = {
  		sessionName: null,
  		wbInfoId: null,
  		location: null,
  		type: null,
  		minCount: null,
  		maxCount: null,
  	};
  	this.form.activitiesList.push(sessionDetail);
  }

  // 點擊按鈕，『刪除』
  handleDelete(item) {
  	this.tempDeleteItem = item;
  	InfoModal.alertError({
  		title: '確定刪除這個場次嗎？',
  		confirm: true,
  		content: '該場次即將執行刪除，您確定要刪除嗎？',
  		customContent: null,
  		onCallback: () => this.checkEventCount(),
  	});
  }

  // 點擊按鈕，『上一步』
  handlePrevStep() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep1',
  		params: {
  			type: this.paramsType,
  		},
  		query: { actId: this.actId },
  	});
  	sessionStorage.removeItem('form_step2');
  }

  // 點擊按鈕，『下一步』
  handleNextStep() {
  	(this.$refs.eventSettingStep2Form as any).validate()
  		.then(() => {
  			const $formData = this.mapToFormData();
  			// 當頁資料存進	sessionStorage
  			sessionStorage.setItem('form_step2', JSON.stringify($formData));
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'EventAndTimeMaintainEventAddAndEditStep3',
  				params: {
  					type: this.paramsType,
  				},
  				query: { actId: this.actId },
  			});
  		})
  		.catch((error) => {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  		});
  }

  handleCloseModal() {
  	this.previewModalVisible = false;
  }

  /**
   * Hook
   */
  created() {
  	this.$emit('changeParent', { step: 2, pageTitle: null });
  	this.setResultParam();
  	this.getOpts();
  }

  @Watch('form.actDate')
  actDateChanged(val) {
  	const { signupDate, remindDate, sendSatisfyQuestDate } = this.form;
  	if ((signupDate[0] && moment(val) < moment(signupDate[0])) || (signupDate[1] && moment(val) < moment(signupDate[1]))) {
  		this.form.signupDate = null;
  	} else if (remindDate && moment(val) < moment(remindDate)) {
  		this.form.remindDate = null;
  	} else if (sendSatisfyQuestDate && moment(val) > moment(sendSatisfyQuestDate)) {
  		this.form.sendSatisfyQuestDate = null;
  	} else {
  		// console.log(val);
  	}
  }
}
</script>
<style lang="scss" scoped>
.event__wrap {
  margin-top: 20px;
  padding: 30px 92px;
  border-radius: 10px;
}
.event__block {
  margin-bottom: 20px;
}
.event__block__title {
  color: $COLOR-MAIN1;
  font-size: 20px;
  font-weight: $TEXT-BOLD;
}
.event__block__content {
  padding: 0px 76px 40px 76px;
}
.event__info {
  margin-bottom: 20px;
}
.form__wrap {
  margin: 0 auto;
}
.a-form-label {
  color: #000;
  margin-bottom: 5px;
  font-weight: $TEXT-BOLD;
}
.actInfo-timePicker, .sessionInfo-inputGroup {
  display: flex;
  ::v-deep {
    .ant-form-item {
      padding-bottom: 0;
      margin-bottom: 0;
      width: 30%;
    }
  }
}

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
.icon__wave {
  font-size: 16px;
  font-weight: $TEXT-BOLD;
  text-align: center;
}
.icon__delete__wrap {
  margin-top: 20px;
  padding: 10px;
}
::v-deep {
  .ant-input, .ant-select-selection, .mx-input, .mx-input-wrapper, .mx-datepicker, .ant-time-picker, .ant-input-number {
    width: 100%;
    height: 40px;
    margin: 0;
    font-size: 16px;
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-input-number-input {
      height: 40px;
    }
  }
}
</style>
