<template>
  <a-form-model ref="ruleForm" :layout="'vertical'">
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="ConsortiumName" :label="$t('consortium_name')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="customerBirthday" :label="$t('customer_birthday')">
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
        <a-form-model-item prop="idCast" :label="$t('type')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="customerType" :label="$t('customer_type')">
          <a-select class="select" size="large"  placeholder="請輸入">
            <a-select-option v-for="item in customerType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="wellknownPerson" :label="$t('wellknown_Person')">
          <a-select class="select" size="large"  placeholder="請輸入">
            <a-select-option v-for="item in wellknownPerson" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--統編/登記號碼-->
        <a-form-model-item prop="customerId" :label="$t('customer_id_2')">
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
        <a-form-model-item prop="customerPassport" :label="$t('customer_passport')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國籍名稱-->
        <a-form-model-item prop="customerCountryCN" :label="$t('customer_country_cn')">
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
        <a-form-model-item prop="customerCountry" :label="$t('customer_country')">
          <a-select class="select" size="large"  placeholder="請輸入">
            <a-select-option v-for="item in idCountry" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--職業-->
        <a-form-model-item prop="customerProfession" :label="$t('customer_profession')">
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
        <a-form-model-item prop="customerTel" :label="$t('customer_tel')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="16" :lg="16" :xxl="16"><!--住址-->
        <a-form-model-item prop="customerAddr" :label="$t('customer_addr')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--保單號碼-->
        <a-form-model-item prop="insuranceNum" :label="$t('insurance_num')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--契約生效日期-->
        <a-form-model-item prop="contracEffecDate" :label="$t('contrac_effec_date')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="elecPayAccount" :label="$t('elec_pay_account')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--認證身分機制1-->
        <a-form-model-item prop="CerMechanism1" :label="$t('cer_mechanism_1')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--認證身分機制2-->
        <a-form-model-item prop="CerMechanism2" :label="$t('cer_mechanism_2')">
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
        <a-button type="primary" size="default">產製申報表</a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class CustomerData extends Vue {
  
  private customerType: { key: string; value: string }[] = [
    { key: "1", value: "一般存款戶" },
    { key: "2", value: "信用卡戶" },
    { key: "3", value: "財富管理戶" },
  ];

  private wellknownPerson: { key: string; value: string }[] = [
    { key: "0", value: "是" },
    { key: "1", value: "否" },
  ];

  private idCountry: { key: string; value: string }[] = [
    { key: "0", value: "本國人" },
    { key: "1", value: "外國人有居留證" },
    { key: "2", value: "外國人無居留證" },
    { key: "3", value: "大陸人民有居留證" },
    { key: "4", value: "大陸人民無居留證" },
    { key: "5 ", value: "法人" },
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
