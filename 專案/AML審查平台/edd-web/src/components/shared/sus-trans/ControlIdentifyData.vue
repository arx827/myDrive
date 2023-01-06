<template>
  <a-form-model ref="ruleForm" :layout="'vertical'">
    <a-row type="flex" :gutter="[40, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--姓名/法人團體名稱-->
        <a-form-model-item prop="controlPeoName" :label="$t('consortium_name')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--對象名稱／姓名-->
        <a-form-model-item prop="objectName" :label="$t('object_name')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--身份別-->
        <a-form-model-item prop="controlPeoType" :label="$t('people_type')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in controlPeoType" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--類型-->
        <a-form-model-item prop="controlPeoCast" :label="$t('type')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in controlPeoCast" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--生日/登記日期-->
        <a-form-model-item prop="controlPeoBirDate" :label="$t('customer_birthday')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--統編/登記號碼-->
        <a-form-model-item prop="controlPeoNumber" :label="$t('customer_id_2')">
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
        <a-form-model-item prop="controlPeoCountry" :label="$t('customer_country')">
          <a-select class="select" size="large" placeholder="請輸入">
            <a-select-option v-for="item in controlPeoCountry" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--國籍名稱-->
        <a-form-model-item prop="controlPeoCountryName" :label="$t('customer_country_cn')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6"><!--職業/營業項目-->
        <a-form-model-item prop="controlPeoProfession" :label="$t('customer_profession_business')">
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
        <a-form-model-item prop="controlPeoTel" :label="$t('customer_tel')">
          <a-input
            :allowClear="true"
            style="width:100%"
            type="text"
            size="large"
            placeholder="請輸入"
          ></a-input>
        </a-form-model-item>
      </a-col>

      <a-col :xs="24" :md="12" :lg="16" :xxl="16"><!--地址-->
        <a-form-model-item prop="controlPeoAddr" :label="$t('address')">
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
export default class ControlIdentifyData extends Vue {
  form:{};
  
  private controlPeoType: { key: string; value: string }[] = [
    { key: "1", value: "實質受益人" },
    { key: "2", value: "機構內關連人" },
    { key: "3", value: "授權簽署人" },
  ];
  private controlPeoCast: { key: string; value: string }[] = [
    { key: "1", value: "男" },
    { key: "2", value: "女" },
    { key: "3", value: "本國公司" },
    { key: "4", value: "外國公司" },
    { key: "5", value: "非法人團體或行號" },
    { key: "6", value: "其他" },
  ];
  private controlPeoCountry: { key: string; value: string }[] = [
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
