<template>
  <a-form-model ref="ruleForm" :layout="'vertical'">
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--一般國內帳號-->
        <a-form-model-item prop="domesticAccount" :label="$t('domestic_account')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國際金融業務分行帳號-->
        <a-form-model-item prop="obuAccount"  :label="$t('obu_account')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國際金融保險業務分公司保單號碼-->
        <a-form-model-item prop="osuNumber" :label="$t('osu_number')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國際金融證券業務分公司帳號-->
        <a-form-model-item prop="osuAccount" :label="$t('osu_account')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--境外資金匯回-->
        <a-form-model-item prop="rof" :label="$t('rof')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--類別-->
        <a-form-model-item prop="rofType" :label="$t('type')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--帳號-->
        <a-form-model-item prop="rofAccount" :label="$t('account')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
             placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--可疑理由之陳述-->
        <a-form-model-item prop="note" :label="$t('suspicious_reason')">
          <a-textarea
            v-model="value"
            :allowClear="true"
            placeholder="Controlled autosize"
            :auto-size="{ minRows: 2, maxRows: 10 }"
          />
        </a-form-model-item>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" :gutter="[8, 48]">
      <a-col :span="2">
        <a-button type="default" size="default">儲存</a-button>
      </a-col>
      <a-col :span="2">
        <a-button type="default" size="default">離開</a-button>
      </a-col>
      <a-col :span="2">
        <a-button type="primary" size="default">確認</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class TransactionAccount extends Vue {
   form:{};
  private value:string ="預設文字";
  

}
</script>

<style scoped>
.select {
  width: 100%;
}

.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}
.title {
  font-size: 16px;
  color: #000000d9;
  font-weight: Medium;
}
.highlight {
  color: red;
}
.padding {
  padding-top: 0.5cm;
}
</style>
