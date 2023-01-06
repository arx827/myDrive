<template>
  <a-form-model ref="ruleForm" :layout="'vertical'">
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易是否完成-->
        <a-form-model-item prop="transYN" :label="$t('trans_YN')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in transYN" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易種類-保險業-->
        <a-form-model-item prop="transType" :label="$t('trans_type')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in transType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--開戶行-->
        <a-form-model-item prop="accountBank" :label="$t('account_bank')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易行-->
        <a-form-model-item prop="transBank" :label="$t('trans_bank')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--可疑交易起始日-->
        <a-form-model-item prop="suspiciousDateS" :label="$t('suspicious_date_s')">
          <a-date-picker class="select" size="large" />
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--可疑交易終止日-->
        <a-form-model-item prop="suspiciousDateE" :label="$t('suspicious_date_e')">
          <a-date-picker class="select" size="large" />
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易幣別-->
        <a-form-model-item prop="transCoin" :label="$t('trans_coin')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易金額-->
        <a-form-model-item prop="transMoney" :label="$t('trans_money')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--折合台幣-->
        <a-form-model-item prop="covertMoney" :label="$t('covert_money')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--證券種類-->
        <a-form-model-item prop="securitiesType" :label="$t('securities_type')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in transYN" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--證券股數-->
        <a-form-model-item prop="securitiesNum" :label="$t('securities_num')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
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
export default class TransactionDetails extends Vue {
  form:{};
  private transYN: { key: string; value: string }[] = [
    { key: "Y", value: "是" },
    { key: "N", value: "否" },
  ];
  private transType: { key: string; value: string }[] = [
    { key: "01", value: "現金支出" },
    { key: "02", value: "現金存入" },
  ];

  private securitiesType: { key: string; value: string }[] = [
    { key: "A", value: "選項一" },
    { key: "B", value: "選項二" },
  ];
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
