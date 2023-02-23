<template>
  <div class="applMaintenanceInsuranceTypeIndex">
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想查詢的險種核保規則/計劃別？
      </h2>
    </div>
    <div class="search-insurance">
      <a-form-model
        ref="applInsuranceTypeIndex"
        class="gioFormGroup"
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
          <a-col span="8">
            <a-form-model-item
              label="保單號碼"
              prop="insuranceNumVal"
              :validate-status="(customErrorMsg.insuranceNumError && customErrorMsg.insuranceNumError.length > 0)?'error':''"
            >
              <input
                v-model="form.insuranceNumVal"
                v-mask="'NNNNNNN-NNN'"
                class="ant-input"
                placeholder="e.g. 1234567 - 000"
                allow-clear
                @blur="form.insuranceNumVal = $event.target.value.toUpperCase()"
                @keyup.enter="onInsuranceNumSubmit"
              >
              <p v-for="(msg, idx) in customErrorMsg.insuranceNumError" :key="idx" class="message--error mt-0">
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
        @click="onInsuranceNumSubmit"
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
import { ExtPolicyModelWithOutTimes, PolicyMaintainDto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceInsuranceTypeIndex extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  // 表單內容
  form: {insuranceNumVal: string} = {
    insuranceNumVal: undefined,
  }

  customErrorMsg: { [key: string]: Array<string>} = {
    insuranceNumError: null,
  }

  // 表單檢驗規則
  rules: { [key: string]: ValidationRule[] } = {
    insuranceNumVal: [
      {
        trigger: 'change',
        validator: this.checkPolicyNum,
      },
    ],
  }

  /**
   * Func
   */
  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  // 檢核
  checkPolicyNum(rule, value, callback) {
    const rgx = /[A-Z0-9-]/;
    const formatNum = this.$global.formatPolicyNum(value);
    if (!value) {
      this.customErrorMsg.insuranceNumError = ['請填入有效保單號碼-序號'];
      callback('');
    } else if (formatNum.length < 9 || !rgx.test(formatNum)) {
      this.customErrorMsg.insuranceNumError = ['保單號碼-序號不符，請再次輸入'];
      callback('');
    } else {
      this.customErrorMsg.insuranceNumError = null;
      callback();
    }
  }

  // API: 要保單位險種/保險計劃/檢核 (先試打看看是否有資料)
  getUnderPlanQueryData(searchUnitCo: PolicyMaintainDto) {
    this.setLoading(true);
    this.$gioInsPlanReviewApi
      .insUnderPlanQueryUsingPOST(searchUnitCo)
      .then((resp) => {
        if (resp.data.status == 200) {
          this.customErrorMsg.insuranceNumError = null;
          this.$global.changeRouterAndaddParam({
            toRouter: 'ApplMaintenanceInsuranceTypeResult',
            query: {
              policyNo: searchUnitCo.policyNo,
              policySeq: searchUnitCo.policySeq,
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
          this.customErrorMsg.insuranceNumError = errorMessage;
        }
      })
      .catch((error) => {
        this.customErrorMsg.insuranceNumError = ['查無保單資料'];
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 【保單號碼】欄位 號碼加-號
  handleInsuranceNumChanged(e) {
    if (e.target.value) {
      const val = this.$global.formatPolicyNum(e.target.value);
      if (val && val.length > 0) {
        this.form.insuranceNumVal = this.$global.autoAddDash(val, '([A-Za-z0-9]{7})(.{1,3})').toUpperCase();
      }
    }
  }

  /**
   * Event
   */
  // 保單號碼 查詢
  onInsuranceNumSubmit() {
    (this.$refs.applInsuranceTypeIndex as any).validate()
    .then(() => {
      if (this.customErrorMsg.insuranceNumError === null) {
        const [no, seq] = this.form.insuranceNumVal.split('-');
        this.getUnderPlanQueryData({
          policyNo: no,
          policySeq: seq,
        });
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
