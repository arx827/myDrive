<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-baseline">
      <div class="page__title">
        參數維護
      </div>
      <div>
        <button
          class="btn__radius--primary--outline--small"
          @click="openModal"
        >
          新增系統參數
        </button>
      </div>
    </div>
    <div
      class="form__container"
    >
      <div class="form__container__title">
        參數紀錄查詢
      </div>
      <a-form-model
        ref="formRef"
        :rules="formRules"
        :model="form"
      >
        <div class="row form__option">
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                分類代碼／名稱
              </div>
            </div>
            <a-form-model-item
              prop="className"
            >
              <a-select
                v-model="form.className"
                show-search
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="(d, idx) in selectlist"
                  :key="`paramList_${idx}`"
                  :value="d.codeType"
                >
                  {{ d.codeType }} {{ d.codeName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div class="col-12">
            <div class="label">
              <div class="input__title">
                代碼內容
              </div>
            </div>
            <a-form-model-item
              prop="classContent"
            >
              <a-input
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
            <div class="label">
              <div class="input__title">
                是否啟用
              </div>
            </div>
            <a-form-model-item
              prop="enabled"
            >
              <a-radio-group
                v-model="form.enabled"
                class="row"
                :default-value="form.enabled"
              >
                <div class="col-12 col-md-3">
                  <a-radio
                    class="radio__block"
                  >
                    全部（預設）
                  </a-radio>
                </div>
                <div class="col-12 col-md-3">
                  <a-radio
                    value="Y"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-12 col-md-3">
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
    </div>
    <div class="button__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="reset"
      >
        重設
      </button>
      <button
        class="btn__radius--primary"
        @click="search"
      >
        查詢
      </button>
    </div>
    <ParamModal
      :modal-type="modalType"
      @closeModal="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import debounce from 'lodash/debounce';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import ParamModal from '@/pages/OccupationalSafety/OtherOptions/ParamMaintain/ParamModal.vue';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid, ParamModal } })
export default class ParamMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

  selectlist = null;

  // 系統參數 CRUD modal 顯示: ['none', 'create', 'edit', 'delete']
  modalType = 'none';

  form = {
  	className: undefined,
  	classContent: undefined,
  	reserved1: undefined,
  	reserved2: undefined,
  	reserved3: undefined,
  	enabled: undefined,
  	note: undefined,
  }

  formRules = {
  	note: [{ max: 250, message: '字數上限250字', trigger: 'change' }],
  	reserved1: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
  	reserved2: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
  	reserved3: [{ max: 100, message: '字數上限100字', trigger: 'change' }],
  }

  filterOption(input, option) {
  	return (
  		option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
  	);
  }

  reset() {
  	this.form = {
  		className: undefined,
  		classContent: undefined,
  		enabled: undefined,
  		reserved1: undefined,
  		reserved2: undefined,
  		reserved3: undefined,
  		note: undefined,
  	};
  	(this.$refs.formRef as any).resetFields();
  }

  search() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'ParamMaintainList',
  				query: this.form,
  			});
  		} else {
  			console.log('Validation failed.');
  			return false;
  		}
  	});
  }

  openModal() {
  	this.modalType = 'create';
  	console.log('opened modal: create');
  }

  closeModal() {
  	this.modalType = 'none';
  }

  created() {
  	this.setLoading(true);
  	this.$AdminControlAdminApi.codeTypeListUsingPOST()
  		.then((resp) => {
  			this.selectlist = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>
<style lang="scss" scoped>
  .form__container {
    background-color: $COLOR-MAIN10;
    border-radius: 10px;
    padding: 30px calc(92/1088*100%);
    margin-bottom: 40px;
  }
  .form__container__title {
    font-size: 24px;
    font-weight: $TEXT-BOLD;
    margin-bottom: 30px;
  }
  .label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    .input__title {
      font-size: 16px;
      font-weight: $TEXT-BOLD;
    }
    .input__restriction {
      font-size: 14px;
      color: $COLOR-GRAY10;
    }
  }
  .radio__block {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding: 9px 12px;
    margin-bottom: 10px;
  }
  .button__wrap {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    padding-bottom: 40px;
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
  ::v-deep{
    .ant-form-item {
      margin: 0px;
      padding-bottom: 20px;
    }
    // 下拉選單
    .ant-select-selection__rendered {
      padding-left: 4px;
      margin-top: 6px;
    }
    .ant-select-selection {
      height: 42px;
    }
    .ant-input {
      height: 42px;
      padding: 12px;
      font-size: 16px;
    }
  }
</style>
