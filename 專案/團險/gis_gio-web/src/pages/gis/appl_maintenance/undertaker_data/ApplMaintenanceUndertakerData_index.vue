<template>
  <div class="applMaintenanceUndertakerData">
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的承辦人資料？
      </h2>
    </div>
    <div class="search-insurance">
      <a-form-model
        ref="applUndertakerIndexForm"
        class="gioFormGroup formW275"
        :form="form"
        :model="form"
        :rules="rules"
        :layout="'vertical'"
        :hide-required-mark="true"
      >
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col span="24">
            <a-form-model-item
              label="保單號碼"
              prop="policyNum"
              :validate-status="(customErrorMsg.policyNumError && customErrorMsg.policyNumError.length > 0)?'error':''"
            >
              <input
                v-model="form.policyNum"
                v-mask="'NNNNNNN-NNN'"
                class="ant-input"
                placeholder="e.g. 1234567 - 000"
                allow-clear
                type="text"
                @blur="form.policyNum = $event.target.value.toUpperCase()"
                @keyup.enter="onPolicyNumSubmit"
              >
              <p v-for="(msg, idx) in customErrorMsg.policyNumError" :key="idx" class="message--error">
                {{ msg }}
              </p>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="search-footer text-center">
      <button
        class="confirm__button confirm__button-submit"
        @click="onPolicyNumSubmit"
      >
        查詢
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import {
  ExtPolicyModelWithOutTimes,
} from '@fubonlife/co-giiss-api-axios-sdk';

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceUndertakerData extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  // 表單內容
  form: {policyNum?: string} = {
    // TEST:
    // policyNum: '1007824-000',
    policyNum: undefined,
  }

  // 查詢要保單位用的參數
  searchUnitCo: ExtPolicyModelWithOutTimes = {
    policyNo: undefined,
    policySeq: undefined,
  };

  // 錯誤提示訊息
  customErrorMsg: { [key: string]: Array<string>} = {
    policyNumError: null,
  }

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    policyNum: [{ trigger: 'change', validator: this.checkPolicyNum }],
  }

  /**
   * Func
   */
  // API: 查詢要保單位
  getUnitCoData(searchUnitCo) {
    this.setLoading(true);
    this.$unitManagementApi
      .getUnitCoDtoUsingPOST(searchUnitCo)
      .then((resp) => {
        if (resp.data.status == 200) {
          this.customErrorMsg.policyNumError = null;
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceUndertakerDataResult',
            query: {
              searchUnitCo: this.searchUnitCo,
            },
          });
        } else {
          const getError = resp.data;
          const errorMessage = [];
          Object.values(getError.apiError).map((i) => {
            (i as any).map((j) => {
              errorMessage.push(j);
            });
          });
          this.customErrorMsg.policyNumError = errorMessage;
        }
      })
      .catch(() => {
        this.customErrorMsg.policyNumError = ['查無保單資料'];
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 檢核
  checkPolicyNum(rule, value, callback) {
    const rgx = /[A-Z0-9-]/;
    const formatNum = this.$global.formatPolicyNum(value);
    if (!value) {
      this.customErrorMsg.policyNumError = ['請填入有效保單號碼-序號'];
      callback('');
    } else if (formatNum.length < 9 || !rgx.test(formatNum)) {
      this.customErrorMsg.policyNumError = ['保單號碼-序號不符，請再次輸入'];
      callback('');
    } else {
      this.customErrorMsg.policyNumError = null;
      callback();
    }
  }

  /**
   * Event
   */
  // 查詢保單號碼
  onPolicyNumSubmit() {
    (this.$refs.applUndertakerIndexForm as any).validate()
      .then(() => {
        if (this.customErrorMsg.policyNumError === null) {
          const [no, seq] = this.form.policyNum.split('-');
          this.searchUnitCo = {
            policyNo: no,
            policySeq: seq,
          };
          this.getUnitCoData(this.searchUnitCo);
        }
      });
  }

  /**
   * Hooks
   */
  created() {
    // TEST:
    // this.form.insuranceNumVal = '1001015002'; // 計劃別維護、保險計劃維護、狀態更新、核保規則
  }
}
</script>

<style lang="scss" scoped>
.search-footer {
  margin-top: 40px;
}
</style>
