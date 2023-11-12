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
        建立代理事項
      </div>
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <div class="row form__option">
          <div class="col-6">
            <div class="d-flex">
              <div class="input__title">
                被代理人單位
              </div>
              <div
                v-if="!isDisabledUnit"
                class="mark-required"
              >
                *
              </div>
            </div>
            <a-form-model-item prop="principalUnit">
              <a-select
                v-model="form.principalUnit"
                class="input__block"
                placeholder="請選擇被代理人單位"
                :options="selectOptions.units"
                :disabled="isDisabledUnit"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <div class="d-flex">
              <div class="input__title">
                被代理人姓名
              </div>
              <div
                v-if="!isDisabledUnit"
                class="mark-required"
              >
                *
              </div>
            </div>
            <a-form-model-item prop="principal">
              <a-select
                v-model="form.principal"
                class="input__block"
                placeholder="e.g. 林曉春"
                :options="selectOptions.toAgentList"
                :disabled="isDisabledUnit"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="row form__option">
          <div class="col-6">
            <div class="d-flex">
              <div class="input__title">
                代理人單位
              </div>
              <div
                v-if="!isDisabledUnit"
                class="mark-required"
              >
                *
              </div>
            </div>
            <a-form-model-item prop="agentUnit">
              <a-select
                v-model="form.agentUnit"
                class="input__block"
                placeholder="請選擇代理人單位"
                :options="selectOptions.units"
                :disabled="isDisabledUnit"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <div class="d-flex">
              <div class="input__title">
                代理人姓名
              </div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item prop="agent">
              <a-select
                v-model="form.agent"
                class="input__block"
                placeholder="e.g. 林曉春"
                :allow-clear="true"
                :options="selectOptions.agentList.filter(i => i.value !== this.$user.getMe().employee.domainId)"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="row form__option">
          <div class="col-12">
            <div class="d-flex">
              <div class="input__title">
                代理時間起迄
              </div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item prop="period">
              <date-picker
                v-model="form.period"
                :disabled-date="disableDate"
                show-time
                class="input__block"
                range
                :show-time-panel="showTimeRangePanel"
                :minute-step="30"
                type="datetime"
                :format="'YYYY/MM/DD HH:mm'"
                :show-second="false"
                :clearable="true"
                :open.sync="isContactDatePickerOpen"
                :editable="false"
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
                      v-if="form.period"
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
import { RuleObject } from 'ant-design-vue/es/form';
import { Action } from 'vuex-class';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';

@Component({
	components: {
		// FblDataGrid
	},
})
export default class BuildAgentModal extends Vue {
  @Action('setLoading') setLoading;

  @PropSync('visible')
	visibleSync: boolean

  // 當前角色
  currentRoleId = null;

  isDisabledUnit: boolean = true;

  // 當前角色單位
  currentRoleUnit = null;

  showTimeRangePanel = false;

  isContactDatePickerOpen = false;

  selectOptions = {
  	units: [],	// 單位清單
  	toAgentList: [],	// 被代理人清單
  	agentList: [],	// 代理人清單
  }

  rules: { [key: string]: ValidationRule[] } = {
  	agent: [{ required: true, message: '請選擇代理人', trigger: 'change' }],
  	period: [{ required: true, message: '請填入代理時間', trigger: 'change' }],
  }

	form = {
		principal: undefined,
		principalUnit: undefined,
		agentUnit: undefined,
		agent: undefined,
		period: null,
	};

	/**
	 * Function
	 */
	disableDate(current, dates) {
		const date = new Date(dates[0]);
		if (dates[0] && dates[1]) {
			return false;
		}
		return (
			current && current <= moment().subtract(1, 'day')
		);
	}

	// disableTime(date) {
	// 	// 只有選到當天，才卡時間
	// 	if (date.getDate() === moment().date()) {
	// 		if (date.getHours() < new Date().getHours()) {
	// 			return true;
	// 		}
	// 		// 小時相同，且現在時間未超過30分 則全部disabled
	// 		if (date.getHours() === new Date().getHours() && new Date().getMinutes() >= 30) {
	// 			return true;
	// 		}
	// 		// 已選小時，且現在時間未超過30分 則 只disabled 00
	// 		if (DateTimeFormmat.isValidDate(this.form.period)?.getHours() === new Date().getHours()) {
	// 			return date.getMinutes() < 30;
	// 		}
	// 		return false;
	// 	}
	// }

	toggleTimeRangePanel() {
		this.showTimeRangePanel = !this.showTimeRangePanel;
	}

	openContactDatesPicker() {
		this.isContactDatePickerOpen = false;
		this.isContactDatePickerOpen = !this.isContactDatePickerOpen;
	}

	closeContactDatesPicker() {
		this.isContactDatePickerOpen = false;
	}

	async creatOptions() {
		await this.getApi_searchAgentDeptList();
		this.currentRoleId = this.$global.getCurrentRoleId();

		if (['ROLE_Auditor', 'ROLE_Audit_Team_Head'].includes(this.currentRoleId)) {
			this.currentRoleUnit = this.$global.getCurrentRole().roleUnits[0].auditorTeamCode;
			this.isDisabledUnit = true;
		} else {
			this.isDisabledUnit = false;
		}

		if (this.isDisabledUnit) {
			// 代理、被代理 單位 鎖定自己單位
			this.form.principalUnit = this.currentRoleUnit;
			this.form.agentUnit = this.currentRoleUnit;
		} else {
			this.$set(this.rules, 'principal', [{ required: true, message: '請選擇被代理人', trigger: 'change' }]);
			this.$set(this.rules, 'principalUnit', [{ required: true, message: '請選擇被代理人單位', trigger: 'change' }]);
			this.$set(this.rules, 'agentUnit', [{ required: true, message: '請選擇代理人單位', trigger: 'change' }]);
		}
	}

	/**
	 * API
	 */
	// API: 獲取單位清單 UnitList
	async getApi_searchAgentDeptList() {
		await this.$accountAgentApi.searchAgentDeptListInAccountAgentUsingPOST()
			.then((resp) => {
				const getData = resp.data.result;
				this.selectOptions.units = getData.map((i) => ({ value: i.value, label: i.label }));
			})
			.catch();
	}

	// API: 獲取代理人清單 agentList
	getApi_searchAgentList(unit) {
		const searchData = {
			departmentId: unit,
			whichDB: this.$user.getMe().employee.whichDB,
		};
		return this.$accountAgentApi.searchAgentListInAccountAgentUsingPOST(searchData)
			.then((resp) => {
				const getData = resp.data.result;
				return getData.filter((i) => i.value !== null).map((i) => ({ label: i.label, value: i.value }));
			})
			.catch();
	}

	// API: 建立代理人
	getApi_createRecordInAccountAgent() {
		this.setLoading(true);
		const submitData = {
			principal: this.form.principal,
			principalUnit: this.form.principalUnit,
			agent: this.form.agent,
			agentUnit: this.form.agentUnit,
			startDatetime: moment(this.form.period[0]).format('YYYY-MM-DD HH:mm'),
			endDatetime: moment(this.form.period[1]).format('YYYY-MM-DD HH:mm'),
		};

		this.$accountAgentApi.createRecordInAccountAgentUsingPOST(submitData)
			.then((resp) => {
				// console.log(resp);
				this.$global.changeRouterAndaddParam({
					toRouter: 'AccountAgentResult',
					params: { type: 'add' },
					query: { result: 'success' },
				});
			})
			.catch((error) => {
				// console.log('Error:', error);
				this.$global.changeRouterAndaddParam({
					toRouter: 'AccountAgentResult',
					params: { type: 'add' },
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
				this.getApi_createRecordInAccountAgent();
			}
		});
	}

	// 取消建立
	onClose() {
		this.visibleSync = false;
	}

	reset() {
		this.form = {
			principal: undefined,
			principalUnit: undefined,
			agent: undefined,
			agentUnit: undefined,
			period: null,
		};
		this.closeContactDatesPicker();
	}

	// 點擊 時間迄 『分』 收合datePicker
	// handleChange(value, type) {
	// 	if (DateTimeFormmat.isValidDate(value[1])?.getHours()) {
	// 		if (type == 'minute') {
	// 			this.closeContactDatesPicker();
	// 		}
	// 	}
	// }

	/**
	 * Hook
	 */
	created() {
		this.creatOptions();
	}

	/**
	 * 監聽
	 */
	// 切換 被代理人單位
	@Watch('form.principalUnit')
	async watchToUnit(nV) {
		this.form.principal = undefined;
		if (nV) {
			this.selectOptions.toAgentList = await this.getApi_searchAgentList(nV);

			// 代理人 鎖定自己
			const currentAgent = this.selectOptions.toAgentList.find((i) => i.value === this.$user.getMe().employee.domainId);
			if (currentAgent) {
				this.form.principal = currentAgent.value;
			}
		}
	}

	// 切換 代理人單位
	@Watch('form.agentUnit')
	async watchUnit(nV) {
		this.form.agent = undefined;
		if (nV) {
			this.selectOptions.agentList = await this.getApi_searchAgentList(nV);
		}
	}

  @Watch('visibleSync', { immediate: true })
	watchVisible(nV) {
		if (!nV) {
			this.reset();
			this.closeContactDatesPicker();
		} else {
			this.creatOptions();
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
