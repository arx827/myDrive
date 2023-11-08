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
      on-ok="handleOk"
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
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="toUnit"
                :rules="rules.toUnit"
              >
                <a-select
                  v-model="form.toUnit"
                  class="input__block"
                  placeholder="e.g. VL000 職安管理部"
                  :disabled="curRole === '2' || !isManager"
                  :options="units"
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <div class="d-flex">
                <div class="input__title">
                  被代理人姓名
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="toName"
                :rules="rules.toName"
              >
                <a-select
                  v-model="form.toName"
                  class="input__block"
                  placeholder="e.g. 林曉春"
                  :options="toEmployeeList"
                  :disabled="curRole === '2' || !isManager"
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
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="unit"
                :rules="rules.unit"
              >
                <a-select
                  v-model="form.unit"
                  class="input__block"
                  placeholder="e.g. VL000 職安管理部"
                  :options="units"
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
              <a-form-model-item
                prop="name"
                :rules="rules.name"
              >
                <a-select
                  v-model="form.name"
                  class="input__block"
                  placeholder="e.g. 林曉春"
                  :options="employeeList"
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
              <a-form-model-item
                prop="period"
              >
                <date-picker
                  v-model="form.period"
                  class="input__block"
                  type="date"
                  :range="true"
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
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { RuleObject } from 'ant-design-vue/es/form';

@Component({
	components: {
		// FblDataGrid
	},
})
export default class LoginCheckWorkBackReasondModal extends Vue {
  @PropSync('visible')
	visibleSync: boolean

  curRole: string = '0';

  isManager: boolean = false;

  // 代理人單位清單
  units = [];

  // 被代理員工清單
  toEmployeeList = [];

  // 代理員工清單
  employeeList = [];

  // @Watch('visible')
  // onChangeVisible(val) {
  // 	this.modalVisible = val;
  // }

  // @Watch('form.toUnit')
  // onChangeToUnit(val, to = true) {
  // 	if (this.curRole !== '2') {
  // 		this.fetchEmployees(val, to);
  // 	}
  // }

  // @Watch('form.unit')
  // onChangeUnit(val, to = false) {
  // 	this.fetchEmployees(val, to);
  // }

	form={
		toUnit: undefined,
		toName: undefined, // 顯示 name, value=userId
		enabled: true,
		unit: undefined,
		name: undefined,
		period: null,
	};

	reset() {
		this.form = {
			toUnit: undefined,
			toName: undefined,
			enabled: undefined,
			unit: undefined,
			name: undefined,
			period: null,
		};
		this.initForm();
	}

	identicalNameCheck = async (rule: RuleObject, value: string) => {
	// 	// console.log('curRole:', this.curRole); // 待解決: returns 0
	// 	const toUserId = this.$user.getSelectedRole() === '2' ? this.$user.getMe().userId : this.form.toName;
	// 	if (value === '') {
	// 		return Promise.reject(new Error('請填入代理人姓名'));
	// 	} if (value === toUserId) {
	// 		return Promise.reject(new Error('請選擇其他代理人'));
	// 	}
	// 	return Promise.resolve();
	};

	rules: { [key: string]: ValidationRule[] } = {
		toUnit: [{ required: true, message: '請填入被代理人單位', trigger: 'change' }],
		toName: [{ required: true, message: '請填入被代理人姓名', trigger: 'change' }],
		unit: [{ required: true, message: '請填入代理人單位', trigger: 'change' }],
		name: [{ validator: this.identicalNameCheck, trigger: 'change' }],
		// name: [{ required: true, message: '請填入代理人姓名', trigger: 'change' }],
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

	// // API: 獲取代理人單位清單
	// fetchUnits() {
	// 	this.$AdminControlManagerApi.agentDeptListUsingPOST()
	// 		.then((resp) => {
	// 			// console.log(resp);
	// 			const rawData = resp.data.data;
	// 			this.units = rawData.map((item) => {
	// 				const { deptCd, deptName, ...dto } = item;
	// 				return {
	// 					value: deptCd,
	// 					label: deptCd.concat(' ', deptName),
	// 					...dto,
	// 				};
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			console.log('fetchUnits() Error\n', error);
	// 		});
	// }

	// // API: 獲取單位員工清單
	// fetchEmployees(unit, to) {
	// 	console.log('to:', to);
	// 	const payLoad: DeptDto = {
	// 		deptCd: unit, // from @Watch
	// 	};
	// 	this.$AdminControlManagerApi.userListByDeptUsingPOST(payLoad)
	// 		.then((resp) => {
	// 			// console.log(resp);
	// 			const rawData = resp.data.data;
	// 			const employees = rawData.map((item) => {
	// 				const { userId, name, ...dto } = item;
	// 				return {
	// 					value: userId,
	// 					label: name,
	// 					...dto,
	// 				};
	// 			});

	// 			if (to) {
	// 				this.toEmployeeList = employees;
	// 			} else {
	// 				this.employeeList = employees;
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('fetchEmployees() Error\n', error);
	// 		});
	// }

	// // 護理師僅可幫自己建立代理
	initForm() {
	// 	// 判斷是否有主管身分(權限)
	// 	this.$AdminControlManagerApi.checkUserRoleUsingPOST()
	// 		.then((resp) => {
	// 			if (resp.status == 200) {
	// 				const rawData = resp.data.data;
	// 				// console.log(rawData);
	// 				this.isManager = rawData.isManager;
	// 			} else {
	// 				console.log('Error: ', resp.data.apiError);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error:', error);
	// 		})
	// 		.finally(() => {
	// 			console.log('isManager:', this.isManager);
	// 		});
	// 	// 取得使用者角色： 1-員工, 2-護理師, 3-主管, 4-系統管理員
	// 	this.curRole = this.$user.getSelectedRole();
	// 	console.log('curRole:', this.curRole);

		// 	if (this.curRole === '2') {
		// 		// 取得使用者單位及姓名
		// 		// console.log(this.$user.getMe());
		// 		const toUnit = this.$user.getMe().userDept; // Dept 回傳部門，Unit 回傳單位
		// 		const toUnitName = this.$user.getMe().dptName;
		// 		this.form.toUnit = toUnit.concat(' ', toUnitName);
		// 		this.form.toName = this.$user.getMe().name;
		// 	}

	// 	this.toEmployeeList = [];
	// 	this.employeeList = [];
	}

	// API: 建立
	onSubmit() {
	// 	(this.$refs.formRef as any).validate((valid) => {
	// 		if (valid) {
	// 			console.log('Validation successful.');
	// 			// 獲取輸入參數
	// 			const payLoad: AgentDto = {
	// 				// -- 被代理人資訊 --
	// 				toUnit: this.curRole === '2' ? this.$user.getMe().userDept : this.form.toUnit,
	// 				toUserId: this.curRole === '2' ? this.$user.getMe().userId : this.form.toName, // 見 fetchEmployees
	// 				// -- 代理人資訊 --
	// 				unit: this.form.unit,
	// 				userId: this.form.name,
	// 				// -- Misc --
	// 				// agentId: ,
	// 				enabled: this.form.enabled,
	// 				startDt: this.form.period[0],
	// 				endDt: this.form.period[1],
	// 				// sysEnum: ,
	// 			};
	// 			this.$AdminControlManagerApi.createOrUpdateAgentUsingPOST(payLoad)
	// 				.then((resp) => {
	// 					// console.log(resp);
	// 					if (resp.data.status == 200) {
	// 						this.$global.changeRouterAndaddParam({
	// 							toRouter: 'AgentSettingResult',
	// 							params: { type: 'add' },
	// 							query: { result: 'success' },
	// 						});
	// 					} else {
	// 						this.$global.changeRouterAndaddParam({
	// 							toRouter: 'AgentSettingResult',
	// 							params: { type: 'add' },
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
	// 						content: '無法建立代理事項，請再次嘗試。',
	// 					});
	// 				});
	// 		} else {
	// 			console.log('Validation failed.');
	// 		}
	// 	});
	}

	// 取消建立
	onClose() {
		this.reset();
		this.visibleSync = false;
	}

	// created() {
	// 	this.initForm();
	// 	this.fetchUnits();
	// }

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
