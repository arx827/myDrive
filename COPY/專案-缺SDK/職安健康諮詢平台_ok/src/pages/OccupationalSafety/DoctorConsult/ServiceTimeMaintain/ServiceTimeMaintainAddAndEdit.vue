<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          {{ (paramsType == 'edit') ? '編輯' : '新增' }}服務場次
        </div>
      </div>
      <div class="serviceTime__wrap">
        <a-form-model
          ref="serviceTimeMaintainAddAndEditForm"
          class="form__wrap"
          :form="form"
          :model="form"
          :rules="rules"
          :hide-required-mark="true"
          :layout="'vertical'"
        >
          <div
            v-for="(block, index) in serviceTimeDataGroup"
            :key="index"
            class="serviceTime__block bg__light"
          >
            <a-row
              type="flex"
              justify="start"
              :gutter="[16, 16]"
            >
              <a-col
                v-for="(info, infoIndex) in block.infoGroup"
                :key="infoIndex"
                :span="info.colSpan"
              >
                <a-form-model-item
                  :prop="info.property"
                  :label="info.label"
                  class="formItem-row"
                >
                  <!-- input -->
                  <a-input
                    v-if="info.type=='input'"
                    v-model="form[info.key]"
                    allow-clear
                    placeholder="e.g. 5樓職安會議室"
                  />
                  <!-- select -->
                  <a-select
                    v-if="info.type=='dropdown'"
                    v-model="form[info.key]"
                    :show-arrow="true"
                    :options="optionEnum[info.key]"
                    class="memberCard-auth"
                    placeholder="請選擇"
                  />
                  <!-- date-picker -->
                  <date-picker
                    v-if="info.type=='datePicker'"
                    v-model="form[info.key]"
                    type="date"
                    style="width: 100%"
                    :allow-clear="true"
                    :disabled-date="(info.key== 'actDate') ? disabledDate : disabledAfterActDate"
                    :formatter="formatter"
                    placeholder="e.g. 2022/01/01"
                  />
                  <!-- 文字編輯器 -->
                  <vue-editor
                    v-if="info.type=='editor'"
                    v-model="form[info.key]"
                    :editor-toolbar="customToolbar"
                    placeholder="請填寫提醒通知文字簡述，字數上限500字。"
                  />
                  <!-- radio + date-picker -->
                  <div
                    v-if="info.type=='radioAndDatePicker'"
                    class="radioAndDatePicker__wrap"
                  >
                    <a-form-model-item :prop="info.key[0]">
                      <a-radio-group
                        v-model="form[info.key[0]]"
                      >
                        <a-radio
                          v-for="item in optionEnum[info.key[0]]"
                          :key="item.value"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item :prop="info.key[1]">
                      <date-picker
                        v-model="form[info.key[1]]"
                        style="width: 100%"
                        type="date"
                        :allow-clear="true"
                        :disabled="form[info.key[0]] !== 0"
                        :disabled-date="disabledAfterActDate"
                        :class="{'has__error': actTimeErrorMsg}"
                        :formatter="formatter"
                        placeholder="e.g. 2022/01/01"
                      />
                      <p
                        v-if="actTimeErrorMsg"
                        class="message--error"
                      >
                        {{ actTimeErrorMsg }}
                      </p>
                    </a-form-model-item>
                  </div>
                  <!-- time-picker -->
                  <a-row
                    v-if="info.type=='timePicker'"
                    type="flex"
                  >
                    <a-form-model-item :prop="info.key[0]">
                      <a-time-picker
                        v-model="form[info.key[0]]"
                        size="large"
                        format="HH:mm"
                        placeholder="e.g. 14:00"
                      />
                    </a-form-model-item>
                    <p class="timePicker-dash">
                      ~
                    </p>
                    <a-form-model-item :prop="info.key[1]">
                      <a-time-picker
                        v-model="form[info.key[1]]"
                        size="large"
                        format="HH:mm"
                        placeholder="e.g. 17:00"
                      />
                    </a-form-model-item>
                  </a-row>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-form-model>
      </div>
      <div class="serviceTime-btn__wrap text-center">
        <button
          class="btn__view btn__radius--primary--outline float-start"
          @click="submitForm('0')"
        >
          暫存
        </button>
        <button
          class="btn__radius--primary--outline"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          class="btn__radius--primary"
          @click="handleSubmit('1')"
        >
          確定
        </button>
        <button
          class="btn__view btn__radius--primary--outline float-end"
          data-bs-toggle="modal"
          data-bs-target="#previewModal"
        >
          預覽
        </button>
      </div>
    </div>
    <PreviewModal
      :form-data="form"
      :service-time-data-group="serviceTimeDataGroup"
      :option-enum="optionEnum"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import PreviewModal from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/PreviewModal.vue';
import { RpnServiceFieldManageSaveDto } from '@fubonlife/oss-api-axios-sdk';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import InfoModal from '@/plugins/notification/infoModal';

import moment from 'moment';

require('bootstrap/js/dist/modal');

export interface infoGroupModel {
  key?: string | Array<string>;
  property?: string;
  label?: string;
  colSpan?: string;
  type?: string;
}
@Component({ components: { VueEditor, PreviewModal } })
export default class ServiceTimeMaintainAddAndEdit extends Vue {
  @Action('setLoading') setLoading;

  formatter = this.$adDateFormatter;

  // 表單類別項目
  serviceTimeDataGroup: {infoGroup: Array<infoGroupModel>}[] = [
  	{
  		infoGroup: [
  			{
  				key: 'wbInfoId',
  				property: 'wbInfoId',
  				label: '活動大樓',
  				colSpan: '12',
  				type: 'dropdown',
  			},
  			{
  				key: 'actLocation',
  				property: 'actLocation',
  				label: '活動地點',
  				colSpan: '12',
  				type: 'input',
  			},
  			{
  				key: 'actDate',
  				property: 'actDate',
  				label: '活動日期',
  				colSpan: '12',
  				type: 'datePicker',
  			},
  			{
  				key: ['actStartTime', 'actEndTime'],
  				property: 'actTime',
  				label: '活動時間',
  				colSpan: '12',
  				type: 'timePicker',
  			},
  			{
  				key: 'timeInterval',
  				property: 'timeInterval',
  				label: '間距時間(分)',
  				colSpan: '12',
  				type: 'dropdown',
  			},
  		],
  	},
  	{
  		infoGroup: [
  			{
  				key: 'nurseInfoId',
  				property: 'nurseInfoId',
  				label: '護理人員',
  				colSpan: '12',
  				type: 'dropdown',
  			},
  			{
  				key: 'physicianInfoId',
  				property: 'physicianInfoId',
  				label: '排班醫師',
  				colSpan: '12',
  				type: 'dropdown',
  			},
  		],
  	},
  	{
  		infoGroup: [
  			{
  				key: 'remindDate',
  				property: 'remindDate',
  				label: '發送提醒通知日期',
  				colSpan: '12',
  				type: 'datePicker',
  			},
  			{
  				key: 'remindDesc',
  				property: 'remindDesc',
  				label: '提醒通知文字簡述',
  				colSpan: '24',
  				type: 'editor',
  			},
  			{
  				key: ['publicStatus', 'autoPublicDate'],
  				label: '發布活動設定',
  				colSpan: '24',
  				type: 'radioAndDatePicker',
  			},
  		],
  	},
  ]

  // 表單內容
  form: RpnServiceFieldManageSaveDto = {
  	actId: null,
  	actStartTime: null,
  	actEndTime: null,
  	publicStatus: 0,
  	actDate: null,
  	remindDate: null,
  	autoPublicDate: null,
  };

  // 活動日期(轉換格式用)
  actDate = null;

  // 編輯 or 新增
  paramsType = '';

  // 活動時間檢核訊息
  actTimeErrorMsg = null;

  // 下拉選項
  optionEnum = {
  	wbInfoId: null,
  	nurseInfoId: null,
  	physicianInfoId: null,
  	publicStatus: [
  		{ value: 0, label: '自動發布（預定發布日期）' },
  		{ value: 1, label: '手動發布' },
  	],
  	timeInterval: [
  		{ value: '10', label: '10' },
  		{ value: '15', label: '15' },
  		{ value: '20', label: '20' },
  		{ value: '30', label: '30' },
  	],
  }

  // 文字編輯器的功能選單
  customToolbar = [
  	['bold', 'italic', 'underline'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[
  		{ align: 'left' },
  		{ align: 'center' },
  		{ align: 'right' },
  		{ align: 'justify' },
  	],
  	[{ color: [] }],
  ]

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
  	wbInfoId: [{ required: true, message: '請選擇活動大樓', trigger: 'change' }],
  	actLocation: [{ required: true, message: '請填寫活動地點', trigger: 'change' }],
  	actDate: [{ required: true, message: '請選擇活動日期', trigger: 'change' }],
  	actStartTime: [{ required: true, trigger: 'change', message: '請選擇活動起訖時間' }],
  	actEndTime: [{ required: true, trigger: 'change', message: '請選擇活動起訖時間' }],
  	timeInterval: [{ required: true, message: '請選擇間距時間(分)', trigger: 'change' }],
  	nurseInfoId: [{ required: true, message: '請選擇護理人員', trigger: 'change' }],
  	physicianInfoId: [{ required: true, message: '請選擇排班醫師', trigger: 'change' }],
  	remindDate: [{ required: true, message: '請選擇發送提醒通知日期', trigger: 'change' }],
  	remindDesc: [{ required: true, message: '請簡述提醒通知', trigger: 'change' }],
  	publicStatus: [{ trigger: 'change', validator: this.checkPublicStatus }],
  	autoPublicDate: [{ trigger: 'change', validator: this.checkAutoPublicDate }],
  }

  /**
   * Func
   */
  checkPublicStatus(rule, value, callback) {
  	if (!value && value != 0) {
  		callback('');
  		this.actTimeErrorMsg = '請選擇發布活動設定';
  	} else if (value == 0 && !this.form.autoPublicDate) {
  		this.actTimeErrorMsg = '請選擇自動發布日期';
  	} else if (value == 1) {
  		this.form.autoPublicDate = null;
  		this.actTimeErrorMsg = null;
  		callback();
  	} else {
  		this.actTimeErrorMsg = null;
  		callback();
  	}
  }

  checkAutoPublicDate(rule, value, callback) {
  	if (!value && this.form.publicStatus == 0) {
  		this.actTimeErrorMsg = '請選擇自動發布日期';
  	} else {
  		this.actTimeErrorMsg = null;
  		callback();
  	}
  }

  disabledDate(current) {
  	const date = new Date();
  	// 禁用過去的時間
  	return current && (current < moment().date(date.getDate() - 1) || moment(current).weekday() >= 5);
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

  setResultParam() {
  	this.paramsType = this.$router.currentRoute.params.type;

  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.form.actId = $query.actId;
  		this.getEditData();
  	}
  }

  // API: 取得下拉式選單-職場大樓、護理師、排班醫生
  getOpts() {
  	this.$PCRRpnRpnServiceFieldManagementApi.getDropDownMenuRUsingPOST()
  		.then((resp) => {
  			const { nurseNameDtosList, physicianNameDtosList, workBuildingNameDtoList } = resp.data.data;
  			this.optionEnum.nurseInfoId = nurseNameDtosList.map((i) => ({
  				value: i.nurseId,
  				label: i.nurseName,
  			}));
  			this.optionEnum.physicianInfoId = physicianNameDtosList.map((i) => ({
  				value: i.physicianId,
  				label: i.physicianName,
  			}));
  			this.optionEnum.wbInfoId = workBuildingNameDtoList.map((i) => ({
  				value: i.buildingId,
  				label: i.buildingName,
  			}));
  		});
  }

  // API: 帶出編輯資料
  getEditData() {
  	this.setLoading(true);
  	this.$PCRRpnRpnServiceFieldManagementApi.bringPhyInfoRUsingPOST(this.form.actId)
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				// console.log(getData);
  				const {
  					actDate, actStartTime, actEndTime, autoPublicDate, remindDate, ...other
  				} = getData;
  				this.form = JSON.parse(JSON.stringify(getData));
  				Object.assign(this.form, {
  					actDate: new Date(actDate),
  					actStartTime: actStartTime && moment(actStartTime, 'HH:mm'),
  					actEndTime: actEndTime && moment(actEndTime, 'HH:mm'),
  					autoPublicDate: autoPublicDate && new Date(autoPublicDate),
  					remindDate: remindDate && new Date(remindDate),
  					...other,
  				});
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 確定功能
  submitForm(status: '0' | '1') {
  	this.setLoading(true);
  	const str = (status === '0' ? '暫存' : '儲存');
  	const {
  		actStartTime, actEndTime, saveOrTemp, autoPublicDate, actDate, remindDate, ...other
  	} = this.form;
  	const $form = {
  		saveOrTemp: status,
  		actStartTime: actStartTime && moment(actStartTime).format('HH:mm'),
  		actEndTime: actEndTime && moment(actEndTime).format('HH:mm'),
  		actDate: actDate && DateTimeFormmat.formatStringDateDault(actDate),
  		remindDate: remindDate && DateTimeFormmat.formatStringDateDault(remindDate),
  		autoPublicDate: autoPublicDate && DateTimeFormmat.formatStringDateDault(autoPublicDate),
  		...other,
  	};
  	this.$PCRRpnRpnServiceFieldManagementApi.savePhyConsultActRUsingPOST($form)
  		.then((resp) => {
  			// TEST:
  			console.log(resp);
  			if (resp.data.status === 200) {
  				if (status == '1') {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'ServiceTimeMaintainResult',
  						query: {
  							result: 'success',
  						},
  					});
  				} else {
  					if (resp.data.data) {
  						this.form.actId = resp.data.data.actId;
  					}
  					this.$infoNotification.success({
  						content: '已成功暫存',
  						duration: 3,
  					});
  				}
  			} else {
  				const getError = resp.data.apiError;
  				if (status == '1') {
  					if (Object.keys(resp.data.apiError).includes('DUPLICATE_ACT_DATE_INVALID')) {
  						InfoModal.alertSuccess({
  							title: '活動日期重覆',
  							confirm: false,
  							content: '系統檢測到重覆的活動日期，請將日期排開後再作新增，謝謝。',
  						});
  					} else {
  						this.$global.changeRouterAndaddParam({
              	toRouter: 'ServiceTimeMaintainResult',
              	params: {
              		type: this.paramsType,
              	},
              	query: {
              		result: 'fail',
              		msg: getError && this.$global.getApiErrorMsg(getError).join(''),
              	},
  						});
  					}
  				} else {
  					this.$infoNotification.error({ content: getError ? this.$global.getApiErrorMsg(getError).join('') : `無法完成${str}項目，請再次嘗試。` });
  				}
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			console.log('error status = ', error);
  		  this.$infoNotification.error({
  				content: `無法完成${str}項目，請再次嘗試。`,
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 儲存服務場次
  handleSubmit(status) {
  	(this.$refs.serviceTimeMaintainAddAndEditForm as any).validate((valid) => {
  		if (valid) {
  		  this.submitForm(status);
  		} else {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			return false;
  		}
  	});
  }

  handleCancel() {
  	this.$router.push({ name: 'ServiceTimeMaintainIndex' });
  }

  /**
   * Hook
   */
  async created() {
  	await this.getOpts();
  	this.setResultParam();
  }

  @Watch('form.actDate')
  actDateChanged(val) {
  	const { autoPublicDate, remindDate } = this.form;
  	if (autoPublicDate && moment(val) < moment(autoPublicDate)) {
  		this.form.autoPublicDate = null;
  	} else if (remindDate && moment(val) < moment(remindDate)) {
  		this.form.remindDate = null;
  	} else {
  		// console.log(val);
  	}
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .serviceTime__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
    .block__title {
      font-weight: 600;
      color: $COLOR-BLACK;
      margin-bottom: 10px;
    }
  }
  .label__radio {
    margin-bottom: 10px;
  }
  .serviceTime-btn__wrap {
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
  .radioAndDatePicker__wrap {
    ::v-deep {
      .has__error {
        .mx-input {
          border-color: $FORMRADIOERROR-BORDER;
        }
      }
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-radio-group {
        width: 100%;
        label:first-of-type {
          width: 40%;
        }
      }
      .mx-input-wrapper {
        width: 35%;
      }
    }
  }
  .quillWrapper {
    background: $COLOR-WHITE;
  }
  .timePicker-dash {
    margin: 5px;
  }
  ::v-deep {
    .ant-form-item label {
      color: $COLOR-BLACK;
      font-weight: $TEXT-BOLD;
    }
    // reset ant select, input
    .ant-select-selection--single, .ant-input, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-form-item-control {
      line-height: 2rem;
    }
    .ant-time-picker-large .ant-time-picker-input {
      font-size: 16px;
    }
  }
</style>
