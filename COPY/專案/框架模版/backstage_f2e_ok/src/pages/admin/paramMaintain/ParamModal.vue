<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal fubon-backStage_modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="modal-container">
        <div class="modal-container__title">
          {{ modalTitle }}系統參數
        </div>

        <a-form-model
          ref="formRef"
          :model="form"
          :rules="rules"
        >
          <div class="row form__option">
            <div class="col-12">
              <div class="label item-required">
                <div class="input__title">
                  分類代碼／名稱
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="className"
              >
                <a-select
                  v-model="form.className"
                  class="input__block"
                  :disabled="modalType === 'edit'"
                >
                  <a-select-option
                    v-for="(d, idx) in selectlist"
                    :key="idx"
                    :value="`${d.codeType} ${d.codeName}`"
                  >
                    {{ d.codeType }} {{ d.codeName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>
            <div class="col-6">
              <div class="label item-required">
                <div class="input__title">
                  代碼
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="number"
              >
                <a-input
                  ref="number"
                  v-model="form.number"
                  class="input__block"
                  :disabled="modalType === 'edit'"
                />
              </a-form-model-item>
            </div>
            <div class="col-6">
              <div class="label item-required">
                <div class="input__title">
                  資料順序
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="order"
              >
                <a-input
                  ref="order"
                  v-model="form.order"
                  class="input__block"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label item-required">
                <div class="input__title">
                  代碼內容
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="classContent"
              >
                <a-input
                  ref="classContent"
                  v-model="form.classContent"
                  class="input__block"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label">
                <div class="input__title">
                  備註
                </div>
                <div class="input__restriction">
                  字數上限250字
                </div>
              </div>
              <a-form-model-item
                prop="note"
              >
                <a-textarea
                  v-model="form.note"
                  class="text-area"
                  placeholder="字數上限250字。"
                  :auto-size="{minRows: 4}"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label">
                <div class="input__title">
                  保留欄位一
                </div>
                <div class="input__restriction">
                  字數上限100字
                </div>
              </div>
              <a-form-model-item
                prop="reserved1"
              >
                <a-textarea
                  v-model="form.reserved1"
                  class="text-area"
                  placeholder="字數上限100字。"
                  :auto-size="{minRows: 2}"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label">
                <div class="input__title">
                  保留欄位二
                </div>
                <div class="input__restriction">
                  字數上限100字
                </div>
              </div>
              <a-form-model-item
                prop="reserved2"
              >
                <a-textarea
                  v-model="form.reserved2"
                  class="text-area"
                  placeholder="字數上限100字。"
                  :auto-size="{minRows: 2}"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label">
                <div class="input__title">
                  保留欄位三
                </div>
                <div class="input__restriction">
                  字數上限100字
                </div>
              </div>
              <a-form-model-item
                prop="reserved3"
              >
                <a-textarea
                  v-model="form.reserved3"
                  class="text-area"
                  placeholder="字數上限100字。"
                  :auto-size="{minRows: 2}"
                />
              </a-form-model-item>
            </div>
            <div class="col-12">
              <div class="label item-required">
                <div class="input__title">
                  是否啟用
                </div>
                <div class="mark-required">
                  *
                </div>
              </div>
              <a-form-model-item
                prop="enabled"
              >
                <a-radio-group
                  ref="enabled"
                  v-model="form.enabled"
                  class="row"
                  :default-value="form.enabled"
                >
                  <div class="col-6 col-md-3">
                    <a-radio
                      value="Y"
                      class="radio__block"
                    >
                      是
                    </a-radio>
                  </div>
                  <div class="col-6 col-md-3">
                    <a-radio
                      value="N"
                      class="radio__block"
                    >
                      否
                    </a-radio>
                  </div>
                </a-radio-group>
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
        <div class="button__wrap text-center">
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
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';

@Component({ components: { FblDataGrid } })
export default class ParamModal extends Vue {
	// @Action('setLoading') setLoading;

	@PropSync('modalType', { default: 'none' })
	typeSync: string; // ['none', 'create', 'edit', 'delete']

	modalVisible = false;

	modalTitle = ''; // needs to be determined by button press

	selectlist = null;

	@Watch('typeSync')
	onChange(val) {
		this.modalVisible = this.typeSync !== 'none';
		if (val !== 'none') {
			this.fetchList();
			if (val === 'create') {
				this.modalTitle = '新增';
				this.resetForm();
			} else if (val === 'edit') {
				this.modalTitle = '修改';
				this.resetForm();
				this.readFormData();
			}
		}
	}

	// @Prop()
	// selectCodeType

	// @Prop()
	// selectCodeId

	onClose() {
		this.typeSync = 'none';
	}

	onSubmit() {
	// 	(this.$refs.formRef as any).validate((valid, item) => {
	// 		if (valid) {
	// 			this.setLoading(true);
	// 			const saveData: SysCodeDto = {
	// 				codeDesc: this.form.classContent,
	// 				codeId: this.form.number,
	// 				codeType: this.form.className.split(' ')[0],
	// 				codeName: this.form.className.split(' ')[1],
	// 				remark: this.form.note,
	// 				isortby: this.form.order,
	// 				reserve1: this.form.reserved1,
	// 				reserve2: this.form.reserved2,
	// 				reserve3: this.form.reserved3,
	// 				enabled: this.form.enabled,
	// 			};
	// 			if (this.modalType === 'create') {
	// 				this.$AdminControlAdminApi.createSysCodeUsingPOST(saveData)
	// 					.then((resp) => {
	// 						if (resp.data.status === 200) {
	// 							this.$global.changeRouterAndaddParam({
	// 								toRouter: 'ParamMaintainResult',
	// 								query: {
	// 									result: resp.data.status === 200 ? 'success' : 'error',
	// 									errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 								},
	// 								params: {
	// 									type: 'add',
	// 								},
	// 							});
	// 						} else {
	// 							notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
	// 						}
	// 					})
	// 					.catch((error) => {
	// 						console.log('error status => ', error);
	// 					})
	// 					.finally(() => {
	// 						this.setLoading(false);
	// 					});
	// 			} else if (this.modalType === 'edit') {
	// 				this.$AdminControlAdminApi.updateSysCodeUsingPOST(saveData)
	// 					.then((resp) => {
	// 						if (resp.data.status === 200) {
	// 							this.$global.changeRouterAndaddParam({
	// 								toRouter: 'ParamMaintainResult',
	// 								query: {
	// 									result: resp.data.status === 200 ? 'success' : 'error',
	// 									errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 								},
	// 								params: {
	// 									type: 'edit',
	// 								},
	// 							});
	// 						} else {
	// 							notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
	// 						}
	// 					})
	// 					.catch((error) => {
	// 						console.log('error status => ', error);
	// 					})
	// 					.finally(() => {
	// 						this.setLoading(false);
	// 					});
	// 			}
	// 		} else {
	// 			console.log('Validation failed.');
	// 			const itemFocus = Object.keys(item)[0];
	// 			(this.$refs[itemFocus] as any).focus();
	// 		}
	// 	});
	}

	rules = {
		className: [
			{ required: true, message: '請填寫分類代碼／名稱', trigger: 'change' },
		],
		number: [
			{ required: true, message: '請填寫代碼', trigger: 'change' },
		],
		order: [
			{ required: true, message: '請填寫資料順序', trigger: 'change' },
		],
		classContent: [
			{ required: true, message: '請填寫代碼內容', trigger: 'change' },
		],
		enabled: [
			{ required: true, message: '請選擇是否啟用', trigger: 'change' },
		],
		note: [{ max: 250, message: '字數上限250字', trigger: 'change' }],
		reserved1: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
		reserved2: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
		reserved3: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
	}

	form = {
		className: undefined,
		number: undefined,
		order: undefined,
		classContent: undefined,
		reserved1: undefined,
		reserved2: undefined,
		reserved3: undefined,
		note: undefined,
		enabled: undefined,
	}

	resetForm() {
		this.form.className = undefined;
		this.form.number = undefined;
		this.form.classContent = undefined;
		this.form.reserved1 = undefined;
		this.form.reserved2 = undefined;
		this.form.reserved3 = undefined;
		this.form.note = undefined;
		this.form.enabled = undefined;
		this.form.order = undefined;
		// (this.$refs.formRef as any).resetFields();
	}

	readFormData() {
		// this.setLoading(true);
		// const getData: SysCodeInfoQueryDto = {
		// 	codeId: this.selectCodeId,
		// 	codeType: this.selectCodeType,
		// };
		// this.$AdminControlAdminApi.sysCodeInfoUsingPOST(getData)
		// 	.then((resp) => {
		// 		this.form.className = `${resp.data.data.codeType} ${resp.data.data.codeName}`;
		// 		this.form.number = resp.data.data.codeId;
		// 		this.form.order = resp.data.data.isortby;
		// 		this.form.classContent = resp.data.data.codeDesc;
		// 		this.form.note = resp.data.data.remark;
		// 		this.form.enabled = resp.data.data.enabled;
		// 		this.form.reserved1 = resp.data.data.reserve1;
		// 		this.form.reserved2 = resp.data.data.reserve2;
		// 		this.form.reserved3 = resp.data.data.reserve3;
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status => ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	async fetchList() {
		// this.setLoading(true);
		// await this.$AdminControlAdminApi.codeTypeListUsingPOST()
		// 	.then((resp) => {
		// 		this.selectlist = resp.data.data;
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status => ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// created() {

	// }
}
</script>

<style lang="scss" scoped>
  .modal-container {
    padding: 16px 0;
  }
  .modal-container__title {
    font-size: 30px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 20px;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    .input__title {
      font-size: 16px;
      font-weight: $BS-TEXT-BOLD;
    }
    .input__restriction {
      font-size: 14px;
      color: $BS-COLOR-GRAY10;
    }
  }
  .button__wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    padding: 80px 0 40px;
    @media(min-width: 768px) {
      flex-direction: row;
      justify-content: center;
    }
    button {
      width: 200px;
      max-width: 100%;
      margin: 5px;
    }
  }
  .mark-required {
    color: $BS-ERROR-COLOR;
    vertical-align: top;
    display: inline-block;
    margin-left: 5px;
  }
  .item-required {
    display: flex;
    justify-content: flex-start;
  }
  ::v-deep{
    .ant-form-item {
      margin: 0px;
      padding-bottom: 20px;
    }
    .ant-select-selection {
      height: 42px !important;
    }
    .ant-input {
      height: 42px;
      padding: 12px;
      margin-bottom: 6px;
      font-size: 16px;
    }
  }
</style>
