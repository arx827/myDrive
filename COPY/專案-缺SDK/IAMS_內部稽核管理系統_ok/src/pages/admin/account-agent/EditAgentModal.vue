<template>
  <!-- Modal -->
  <a-modal
    v-model="visibleSync"
    class="common__modal fubon-backStage_modal"
    :mask-closable="false"
    :after-close="onClose"
    :footer="null"
    :width="'66%'"
  >
    <template slot="closeIcon">
      <a-icon type="close" />
    </template>
    <div class="modal-container">
      <div class="modal-container__title">
        編輯代理事項
      </div>
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <div class="row form__option">
          <div class="d-flex">
            <div class="input__title">
              被代理人單位：
            </div>
            <div>
              {{ staticData.principalUnit.departmentName }}
            </div>
          </div>
        </div>
        <div class="row form__option">
          <div class="d-flex">
            <div class="input__title">
              被代理人姓名：
            </div>
            <div>
              {{ staticData.principal.name }}
            </div>
          </div>
        </div>
        <div class="row form__option">
          <div class="d-flex">
            <div class="input__title">
              代理人單位：
            </div>
            <div>
              {{ staticData.agentUnit.departmentName }}
            </div>
          </div>
        </div>
        <div class="row form__option">
          <div class="d-flex">
            <div class="input__title">
              代理人姓名：
            </div>
            <div>
              {{ staticData.agent.name }}
            </div>
          </div>
        </div>
        <div class="row form__option">
          <div class="d-flex">
            <div class="input__title">
              代理開始時間：
            </div>
            <div>
              {{ staticData.startDatetime }}
            </div>
          </div>
        </div>
        <div class="row form__option">
          <div class="col-12">
            <div class="d-flex">
              <div class="input__title">
                代理結束時間
              </div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item prop="period">
              <date-picker
                v-model="form.period"
                :disabled-date="disableDate"
                :editable="false"
                show-time
                class="input__block"
                :show-time-panel="showTimeRangePanel"
                :minute-step="30"
                type="datetime"
                :format="'YYYY/MM/DD HH:mm'"
                :show-second="false"
                :clearable="true"
                :open.sync="isContactDatePickerOpen"
                @open="openContactDatesPicker"
              >
                <template v-slot:footer>
                  <a-space>
                    <a-button
                      type="primary"
                      size="small"
                      @click="toggleTimeRangePanel"
                    >
                      {{ showTimeRangePanel ? '選擇日期' : '選擇時間' }}
                      <!-- 選擇日期  選擇時間 -->
                    </a-button>
                    <!-- 確定 -->
                    <a-button
                      size="small"
                      type="primary"
                      @click="closeContactDatesPicker"
                    >
                      確定
                    </a-button>
                  </a-space>
                </template>
              </date-picker>
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
      <div class="btn__wrap text-center">
        <button
          class="btn__radius--primary--outline mb-2"
          @click="onClose"
        >
          取消
        </button>
        <button
          class="btn__radius--primary mb-2"
          @click="onSubmit"
        >
          確定
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop, PropSync,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { RecordListResponseDto } from '@fubonlife/iams-api-axios-sdk';
import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';
import { Action } from 'vuex-class';
import moment from 'moment';

@Component({ components: { } })
export default class EditAgentModal extends Vue {
	@Action('setLoading') setLoading;

	@PropSync('visible')
	visibleSync: boolean

	@Prop()
	editModalAccountAgentId: string

	// 當前角色
  currentRoleId = null;

  // 當前角色單位
  currentRoleUnit = null;

  showTimeRangePanel = false;

  isContactDatePickerOpen = false;

	staticData: RecordListResponseDto = {
		principalUnit: {
			departmentId: '',
			departmentName: '',
		},
		principal: {
			domainId: '',
			name: '',
		},
		agentUnit: {
			departmentId: '',
			departmentName: '',
		},
		agent: {
			domainId: '',
			name: '',
		},
	};

	form = {
		period: undefined,
	}

	reset() {
		this.form = {
			period: undefined,
		};
	}

	rules: { [key: string]: ValidationRule[] } = {
		period: [{
			required: true, trigger: 'change', validator: this.validatorEndDate,
		}],
	}

	/**
	 * Function
	 */
	disableDate(current, dates) {
		const date = DateTimeFormmat.isValidDate(dates[0]);

		if (dates[0] && dates[1]) {
			return false;
		}
		const nowDateMoment = moment().subtract(1, 'day');
		const startDateMoment = moment(this.staticData.startDatetime).add(1911, 'year').subtract(1, 'day');
		const max = (nowDateMoment.isBefore(startDateMoment)) ? startDateMoment : nowDateMoment;
		return (
			current && current <= max
		);
	}

	toggleTimeRangePanel() {
		this.showTimeRangePanel = !this.showTimeRangePanel;
	}

	openContactDatesPicker() {
		this.showTimeRangePanel = false;
		this.isContactDatePickerOpen = !this.isContactDatePickerOpen;
	}

	closeContactDatesPicker() {
		this.isContactDatePickerOpen = false;
		this.showTimeRangePanel = false;
	}

	// disableTime(date) {
	// 	// 欲卡控的時間
	// 	let disableDate = null;

	// 	const staticDataAD = moment(this.staticData.startDatetime).add(1911, 'year');

	// 	// 先判斷Time 要卡 當天 還是 開始時間
	// 	if (moment(moment(date).format('YYYY-MM-DD')).isSame(moment(moment().format('YYYY-MM-DD')))) {
	// 		// 選擇時間為當天
	// 		disableDate = DateTimeFormmat.isValidDate(moment().format());
	// 	}
	// 	if (moment(moment(date).format('YYYY-MM-DD')).isSame(moment(staticDataAD.format('YYYY-MM-DD')))) {
	// 		// 選擇時間為開始時間
	// 		disableDate = DateTimeFormmat.isValidDate(staticDataAD.format());
	// 	}
	// 	// 只有選到當天，才卡時間
	// 	if (disableDate) {
	// 		if (date.getHours() < disableDate.getHours()) {
	// 			return true;
	// 		}
	// 		// 小時相同，且現在時間未超過30分 則全部disabled
	// 		if (date.getHours() === disableDate.getHours() && disableDate.getMinutes() >= 30) {
	// 			return true;
	// 		}
	// 		// 已選小時，且現在時間未超過30分 則 只disabled 00
	// 		if (DateTimeFormmat.isValidDate(this.form.period)?.getHours() === disableDate.getHours()) {
	// 			return date.getMinutes() < 30;
	// 		}
	// 		return false;
	// 	}
	// }

	// 點擊 『分』 收合datePicker
	// handleChange(value, type) {
	// 	if (type == 'minute') {
	// 		this.closeContactDatesPicker();
	// 	}
	// }

	validatorEndDate(rule, value, callback) {
		if (!(value instanceof Date)) {
			callback('請選擇代理結束時間');
		}
		if (moment(value).isBefore(moment(this.staticData.startDatetime).add(1911, 'year'))) {
			callback('不得小於 代理開始時間');
		}
		if (moment(value).isBefore(moment())) {
			callback('不得小於 當前時間');
		}
		callback();
	}

	/**
	 * API
	 */
	// API: 查詢代理紀錄
	fetchAgentData() {
		this.setLoading(true);
		this.$accountAgentApi.searchRecordInAccountAgentUsingPOST(this.editModalAccountAgentId)
			.then((resp) => {
				const getData = resp.data.result;
				this.staticData = getData;
				this.form.period = DateTimeFormmat.isValidDate(moment(this.staticData.endDatetime).add(1911, 'year').format());
			})
			.catch((error) => {
				console.log('Error:', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 編輯代理人
	getApi_modifyRecordInAccountAgent() {
		this.setLoading(true);
		const submitData = {
			accountAgentId: this.editModalAccountAgentId,
			endDatetime: moment(this.form.period).format('YYYY-MM-DD HH:mm'),
		};
		this.$accountAgentApi.modifyRecordInAccountAgentUsingPOST(submitData)
			.then((resp) => {
				// const getData = resp.data.result;
				this.$global.changeRouterAndaddParam({
					toRouter: 'AccountAgentResult',
					params: { type: 'edit' },
					query: { result: 'success' },
				});
			})
			.catch((error) => {
				// console.log('Error:', error);
				this.$global.changeRouterAndaddParam({
					toRouter: 'AccountAgentResult',
					params: { type: 'edit' },
					query: {
						result: 'fail',
						msg: error.response.data.message,
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	/**
	 * Event
	 */
	onSubmit() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.getApi_modifyRecordInAccountAgent();
			}
		});
	}

	// 取消編輯
	onClose() {
		(this.$refs.formRef as any).clearValidate();
		this.visibleSync = false;
	}

	/**
	 * 監聽
	 */
  @Watch('visibleSync', { immediate: true })
	watchVisible(nV) {
  	if (nV) {
			this.fetchAgentData();
  	} else {
  		this.reset();
  	}
	}
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 16px;
    padding-bottom: 16px;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $BS-TEXT-BOLD;
    }
  }
  .mark-required {
    color: $BS-ERROR-COLOR;
    vertical-align: top;
    display: inline-block;
    margin-left: 5px;
  }
  .input__title {
    font-size: 16px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 10px;
  }
  .input__block {
    width: 100%;
  }
  .form__option {
    margin-bottom: 20px;
  }
  ::v-deep {
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
