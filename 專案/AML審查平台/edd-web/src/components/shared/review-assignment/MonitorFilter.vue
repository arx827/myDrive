<template>
  <a-form-model
    ref="form"
    :form="form"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
  >
    <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="operationType" label="作業別">
          <a-select class="select" size="large" v-model="form.operationType">
            <a-select-option v-for="item in operation" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="產生日期" prop="produceDate">
          <date-picker
            type="date"
            v-model="form.produceDate"
            :formatter="formatter"
            :range="true"
            size="large"
            :allowClear="true"
          />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="案件類型">
          <a-select class="select" size="large">
            <a-select-option v-for="item in type" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查部門">
          <a-select class="input" size="large">
            <a-select-option v-for="item in dep" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查科別">
          <a-select class="input" size="large">
            <a-select-option v-for="item in div" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item label="審查人員">
          <a-select class="input" size="large">
            <a-select-option v-for="item in emp" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_TW";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
@Component
export default class MonitorFilter extends Vue {
  locale: locale = locale;
  operation: { key: string; value: string }[] = [
    { key: "A", value: "全選" },
    { key: "B", value: "AN-年金給付" },
    { key: "C", value: "ML-保單借款" },
    { key: "D", value: "ML_1-保單還款溢繳" },
    { key: "E", value: "MB-回饋分享金給付" },
    {
      key: "F",
      value:
        "MI-標的現金配息／基金贖回、投資收益／全委提解、專屬帳戶定期匯出或投資標的合併／基金下巿",
    },
    { key: "G", value: "PB1-滿期或祝壽保險金給付" },
    {
      key: "H",
      value:
        "PB2-生存、關懷、教育、升學、立業、健康檢查、無理賠回饋保險金或實物給付替代金或實物給付補償金給付",
    },
    { key: "I", value: "PB4-失效給付" },
    { key: "J", value: "PB5-停效出清" },
    { key: "K", value: "PB6-保障期滿給付" },
    { key: "L", value: "SN-SN07分期還本" },
  ];
  type: { key: string; value: string }[] = [
    { key: "A", value: "案件類型A" },
    { key: "B", value: "案件類型B" },
    { key: "C", value: "案件類型C" },
  ];
  system: { key: string; value: string }[] = [
    { key: "A", value: "A" },
    { key: "B", value: "F" },
  ];
  status: { key: string; value: string }[] = [
    { key: "A", value: "案件狀態A" },
    { key: "B", value: "案件狀態B" },
    { key: "C", value: "案件狀態C" },
  ];

  dep: { key: string; value: string }[] = [
    { key: "A", value: "VP200保全服務部" },
    { key: "B", value: "PR00櫃檯服務部" },
    { key: "C", value: "PH00台中行政部" },
    { key: "D", value: "VPJ00高雄行政部" },
    { key: "E", value: "VPK00客戶利益部" },
    { key: "F", value: "VPE00理賠部" },
    { key: "G", value: "VPK00保費帳務部" },
    { key: "H", value: "VPD00保單風險管理部" },
  ];
  div: { key: string; value: string }[] = [
    { key: "A", value: "審查科別A" },
    { key: "B", value: "審查科別B" },
    { key: "C", value: "審查科別C" },
  ];
  emp: { key: string; value: string }[] = [
    { key: "A", value: "審查同仁A" },
    { key: "B", value: "審查同仁B" },
    { key: "C", value: "審查同仁C" },
  ];

  formatter = this.$twDateFormatter;

  form: { operationType: string; produceDate: any; type: string } = {
    operationType: undefined,
    produceDate: [],
    type: "",
  };

  rules: { [key: string]: ValidationRule[] } = {
    operationType: [
      {
        required: true,
        message: "請選擇作業別",
        trigger: "change",
      },
    ],
    produceDate: [
      {
        required: true,
        // message: "請選擇日期區間",
        validator: (rule, value, callback) => {
          if (value[0] === null || value[1] === null || value.length === 0) {
            callback(new Error(this.$t("rule_choose_date_msg") as string));
          } else {
            let start = value[0].valueOf();
            let end = value[1].valueOf();
            let gap = (end - start) / 1000 / 60 / 60 / 24;
            if (gap > 29) {
              callback(new Error(this.$t("rule_more_than_30days") as string));
            }else{
              callback();
            }
          }
        },
        trigger: "change",
      },
    ],
  };

  validateForm() {
    return (this.$refs.form as any).validate();
  }
}
</script>

<style scoped lang="less">

.ant-input-affix-wrapper .ant-input:focus {
  border: none;
  border-bottom: 1px solid white !important;
  box-shadow: none;
}
.title {
  font-size: 16px;
  color: #000000d9;
}

</style>
