<template>
  <div class="applMaintenanceApplData">
    <LayoutLoading v-if="pageLoading" />
    <div class="search-header d-flex justify-content-center">
      <h2 class="main-title">
        您想變更的要保單位資料？
      </h2>
    </div>
    <div class="search-insurance">
      <a-form-model
        ref="applMaintenanceApplDataIndexForm"
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
              prop="policyNumVal"
              :validate-status="(customErrorMsg.policyNumError && customErrorMsg.policyNumError.length > 0)?'error':''"
            >
              <input
                v-model="form.policyNumVal"
                v-mask="'NNNNNNN-NNN'"
                class="ant-input"
                placeholder="e.g. 1234567 - 000"
                allow-clear
                @blur="form.policyNumVal = $event.target.value.toUpperCase()"
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
import { Modal } from 'ant-design-vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { PolicyMaintainDto } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({
  components: { LayoutLoading },
})
export default class ApplMaintenanceApplData extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading

  pageLoading = false;

  form: { policyNumVal: string } = {
    policyNumVal: undefined,
  };

  rules: { [key: string]: ValidationRule[] } = {
    policyNumVal: [
      {
        trigger: 'change',
        validator: this.checkPolicyNum,
      },
    ],
  };

  searchUnitCo: PolicyMaintainDto = {
    policyNo: undefined,
    policySeq: undefined,
  }

  // 錯誤提示訊息
  customErrorMsg: { [key: string]: Array<string>} = {
    policyNumError: null,
  }

  /**
 * Func
 */
  // 欄位檢核
  // 半形字元檢核
  fullWidthAcd(rule, value) {
    return !this.$global.fullWidthAcd(value);
  }

  checkPolicyNum(rule, value, callback) {
    const rgx = /^[A-Z0-9-]/;
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

  // API: 查詢要保單位資訊 GIOInsDeptMaintainApi
  // 只是先確認保單有效
  getUnitCoData(searchUnitCo) {
    this.pageLoading = true;
    this.$insDeptMaintainApi
      .queryUsingPOST(searchUnitCo)
      .then((resp) => {
        // 如果保單狀態為此四種，跳燈箱回傳錯誤訊息
        const errorNumArr = ['03', '05', '06', '08'];
        // TEST:
        // console.log(resp);
        // console.log(this.form.policyNumVal, this.searchUnitCo);
        if (resp.data.status == 200) {
          this.customErrorMsg.policyNumError = null;
          if (errorNumArr.includes(resp.data.data.insStatus) || resp.data.data.insStatusWording === '此保單尚在受理，請確認。') {
            Modal.error({
              title: this.h('div', {}, '錯誤訊息'),
              content: resp.data.data.insStatusWording,
              okType: 'confrim',
              okText: '確定',
              icon: () =>
                this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
            });
          } else {
            this.$global.changeRouterAndaddParam({
              toRouter: 'ApplMaintenanceApplDataResult',
              query: {
                policyNum: this.form.policyNumVal,
                searchUnitCo: this.searchUnitCo,
              },
            });
          }
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
      .catch((error) => {
        this.customErrorMsg.policyNumError = ['查無保單資料'];
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
   * Event
   */
  // 查詢保單號碼 送參準備
  onPolicyNumSubmit() {
    (this.$refs.applMaintenanceApplDataIndexForm as any).validate()
      .then(() => {
        if (this.customErrorMsg.policyNumError === null) {
          const [no, seq] = this.form.policyNumVal.split('-');
          this.searchUnitCo = {
            policyNo: no,
            policySeq: seq,
          };
          this.getUnitCoData(this.searchUnitCo);
        }
      });
  }

  // 【保單號碼】欄位 號碼加-號
  handlePolicyNumChanged(e) {
    if (e.target.value) {
      const val = this.$global.formatPolicyNum(e.target.value);
      if (val && val.length > 0) {
        this.form.policyNumVal = this.$global.autoAddDash(val, '([A-Za-z0-9]{7})(.{1,3})').toUpperCase();
      }
    }
  }

  /**
   * Hooks
   */
  created() {
    // TEST:
    // this.form.policyNumVal = '1005858-000';
  }
}
</script>

<style scoped>
.search-insurance {
  margin-top: 20px;
}
.search-footer {
  margin-top: 40px;
}

</style>
