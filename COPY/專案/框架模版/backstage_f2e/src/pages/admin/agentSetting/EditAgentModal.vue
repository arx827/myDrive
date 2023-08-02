<template>
  <div>
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
            <div class="col-6">
              <div class="input__title">
                被代理人單位
              </div>
              <div>
                {{ form.toUnit }}
              </div>
            </div>
            <div class="col-6">
              <div class="input__title">
                被代理人姓名
              </div>
              <div>
                {{ form.toName }}
              </div>
            </div>
          </div>
          <div class="row form__option">
            <div class="col-6">
              <div class="input__title">
                代理人單位
              </div>
              <div>
                {{ form.unit }}
              </div>
            </div>
            <div class="col-6">
              <div class="input__title">
                代理人姓名
              </div>
              <div>
                {{ form.name }}
              </div>
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
              <a-form-model-item
                prop="period"
              >
                <date-picker
                  v-model="form.period"
                  class="input__block"
                  :range="true"
                  type="date"
                  :format="'YYYY/MM/DD'"
                  :rules="rules.period"
                  @change="checkDataRange"
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="d-flex">
            <div class="input__title">
              是否啟用
            </div>
            <div class="mark-required">
              *
            </div>
          </div>
          <a-form-model-item
            prop="enabled"
            :rules="rules.enabled"
          >
            <a-radio-group
              v-model="form.enabled"
              class="row"
              :default-value="form.enabled"
            >
              <div class="col-6">
                <a-radio
                  :value="true"
                  class="radio__block"
                >
                  是
                </a-radio>
              </div>
              <div class="col-6">
                <a-radio
                  :value="false"
                  class="radio__block"
                >
                  否
                </a-radio>
              </div>
            </a-radio-group>
          </a-form-model-item>
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
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop, PropSync,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
// import { Action } from 'vuex-class';

@Component({
	components: {
		// FblDataGrid
	},
})
export default class LoginCheckWorkBackReasondModal extends Vue {
	// @Action('setLoading') setLoading;

	@PropSync('visible')
	visibleSync: boolean

	// @Prop()
	// agentId: number

	// modalVisible = false;

	form = {
		agentId: undefined,
		toUnit: undefined,
		toUserId: undefined,
		toName: undefined,
		unit: undefined,
		userId: undefined,
		name: undefined,
		enabled: undefined,
		period: null,
	}

	// @Watch('visible')
	// onChange(val) {
	// 	this.reset();
	// 	this.modalVisible = val;
	// 	if (val) {
	// 		this.fetchAgentData();
	// 	}
	// }

	reset() {
		this.form = {
			agentId: undefined,
			toUnit: undefined,
			toUserId: undefined,
			toName: undefined,
			unit: undefined,
			userId: undefined,
			name: undefined,
			enabled: undefined,
			period: null,
		};
	}

	rules: { [key: string]: ValidationRule[] } = {
		period: [{ required: true, message: '請填入代理時間', trigger: 'change' }],
		enabled: [{ required: true, message: '請填入啟用狀態', trigger: 'change' }],
	}

	checkDataRange() {
	// 	if (this.form.period[0] < new Date()) {
	// 		InfoModal.alertError({
	// 			title: '錯誤提示',
	// 			confirm: false,
	// 			content: '不可建立早於系統日期的代理時間。請調整代理時間起迄後，再做設定。',
	// 		});
	// 		this.form.period = null;
	// 	}
	}

	// // API: 查詢代理紀錄
	// fetchAgentData() {
	// 	this.setLoading(true);
	// 	const $agentId: AgentDto = { agentId: this.agentId };
	// 	this.$AdminControlManagerApi.agentUsingPOST($agentId)
	// 		.then((resp) => {
	// 			if (resp.data.status == 200) {
	// 				const data = resp.data.data;
	// 				this.form.agentId = data.agentId;
	// 				this.form.toUserId = data.toUserId;
	// 				this.form.userId = data.userId;
	// 				// 後端回傳的單位為 department，因此使用者單位由 fetchFullNames 取得
	// 				this.form.enabled = data.enabled;
	// 				this.form.period = [new Date(data.startDt), new Date(data.endDt)];
	// 				this.fetchFullNames(true);
	// 				this.fetchFullNames(false);
	// 			} else {
	// 				console.log('無法完成查詢項目：', resp.data.apiError);
	// 				this.$infoNotification.error({
	// 					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 				});
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error:', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	// }

	// fetchFullNames(to) {
	// 	const $Id: UserQueryModel = (to) ? { userId: this.form.toUserId } : { userId: this.form.userId };
	// 	this.$UserApi.getUserInfoUsingPOST($Id)
	// 		.then((resp) => {
	// 			if (resp.data.status == 200) {
	// 				const data = resp.data.data;
	// 				if (to) {
	// 					this.form.toUnit = data.userUnit.concat(' ', data.dptName);
	// 					this.form.toName = data.name;
	// 				} else {
	// 					this.form.unit = data.userUnit.concat(' ', data.dptName);
	// 					this.form.name = data.name;
	// 				}
	// 			} else {
	// 				console.log('Error:', resp.data.apiError);
	// 				this.$infoNotification.error({
	// 					content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 				});
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('Failed to get user info. Error:', error);
	// 		});
	// }

	// API: 編輯
	onSubmit() {
	// 	(this.$refs.formRef as any).validate((valid) => {
	// 		if (valid) {
	// 			console.log('Validation successful.');
	// 			// 獲取輸入參數
	// 			const payLoad: AgentDto = {
	// 				// -- 被代理人資訊 --
	// 				toUnit: this.form.toUnit,
	// 				toUserId: this.form.toUserId,
	// 				// -- 代理人資訊 --
	// 				unit: this.form.unit,
	// 				userId: this.form.userId,
	// 				// -- Misc --
	// 				agentId: this.form.agentId,
	// 				enabled: this.form.enabled,
	// 				startDt: this.form.period && DateTimeFormmat.formatStringDateDault(this.form.period[0]),
	// 				endDt: this.form.period && DateTimeFormmat.formatStringDateDault(this.form.period[1]),
	// 				// sysEnum: ,
	// 			};
	// 			this.$AdminControlManagerApi.createOrUpdateAgentUsingPOST(payLoad)
	// 				.then((resp) => {
	// 					// console.log(resp);
	// 					if (resp.data.status == 200) {
	// 						this.$global.changeRouterAndaddParam({
	// 							toRouter: 'AgentSettingResult',
	// 							params: { type: 'edit' },
	// 							query: { result: 'success' },
	// 						});
	// 					} else {
	// 						this.$global.changeRouterAndaddParam({
	// 							toRouter: 'AgentSettingResult',
	// 							params: { type: 'edit' },
	// 							query: {
	// 								result: 'fail',
	// 								msg: this.$global.getApiErrorMsg(resp.data.apiError).join('、'), // 失敗原因
	// 							},
	// 						});
	// 					}
	// 				})
	// 				.catch((error) => {
	// 					console.log('Error:', error);
	// 					this.$infoNotification.error({
	// 						content: '無法編輯代理事項，請再次嘗試。',
	// 					});
	// 				});
	// 		} else {
	// 			console.log('Validation failed.');
	// 		}
	// 	});
	}

	onClose() {
	// 	this.$emit('closeEditModal');
		this.visibleSync = false;
	}

	// updated() {
	// 	window.parseWord();
	// }
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
    .ant-modal-wrap {
      z-index: 1060;
    }
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
