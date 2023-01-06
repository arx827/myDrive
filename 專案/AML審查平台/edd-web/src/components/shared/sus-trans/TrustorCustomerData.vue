<template>
  <a-form-model ref="ruleForm" :layout="'vertical'" >
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--姓名/法人團體名稱-->
        <a-form-model-item prop="agentName" :label="$t('consortium_name')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--生日/登記日期-->
        <a-form-model-item prop="agentBirDate" :label="$t('customer_birthday')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--類型-->
        <a-form-model-item prop="agentCastType" :label="$t('type')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in castType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--統編/登記號碼-->
        <a-form-model-item prop="agentNumber" :label="$t('customer_id_2')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--護照號碼-->
        <a-form-model-item prop="agentPassport" :label="$t('customer_passport')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國籍-->
        <a-form-model-item prop="agentCountry" :label="$t('customer_country')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in agentCountry" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國籍名稱-->
        <a-form-model-item prop="agentCountryName" :label="$t('customer_country_cn')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--職業-->
        <a-form-model-item prop="agentProfession" :label="$t('customer_profession')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--電話-->
        <a-form-model-item prop="agentTel" :label="$t('customer_tel')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--交易地點-->
        <a-form-model-item prop="tansAddr" :label="$t('tans_place')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="16" :xxl="16"><!--交易地址-->
        <a-form-model-item prop="trustorAddr" :label="$t('tans_addr')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--客戶關係-->
        <a-form-model-item prop="customRelat" :label="$t('customer_relation')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in customRelat" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
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
export default class TrustorCustomerData extends Vue {

  form:{};
  
  private castType: { key: string; value: string }[] = [
    { key: "1", value: "男" },
    { key: "2", value: "女" },
    { key: "3", value: "本國公司" },
    { key: "4", value: "外國公司" },
    { key: "5", value: "非法人團體或行號" },
    { key: "6", value: "其他" },
  ];

  private agentCountry: { key: string; value: string }[] = [
    { key: "0", value: "本國人" },
    { key: "1", value: "外國人有居留證" },
    { key: "2", value: "外國人無居留證" },
    { key: "3", value: "大陸人民有居留證" },
    { key: "4", value: "大陸人民無居留證" },
    { key: "5 ", value: "法人" },
  ];
  private customRelat: { key: string; value: string }[] = [
    { key: "1", value: "配偶" },
    { key: "2", value: "直（旁）系血親" },
    { key: "3", value: "非1、2之其他親屬" },
    { key: "4", value: "僱傭" },
    { key: "5", value: "大陸人民無居留證" },
    { key: "6", value: "非個人戶之負責人" },
    { key: "7", value: "要保人" },
    { key: "8", value: "受益人" },
    { key: "9", value: "無法確認" },
    { key: "0", value: "其他" },
  ];
}
</script>

<style scoped>
.select {
  width: 100%;
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
