<template>
  <a-form-model
    ref="form"
    :form="form"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
  >
    <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
      <a-col :xs="24" :md="12" :lg="8" :xxl="6" >
        <a-form-model-item prop="operationType" :label="$t('operation_type')">
          <a-select class="select" size="large" v-model="form.operationType">
            <a-select-option v-for="item in operation" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="source" :label="$t('source')">
          <a-select class="select" size="large">
            <a-select-option v-for="item in source" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item prop="produceDate" :label="$t('produce_date')">
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
        <a-form-model-item :label="$t('category')">
          <a-select class="select" size="large">
            <a-select-option v-for="item in type" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('system')">
          <a-select class="select" size="large">
            <a-select-option v-for="item in system" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('insurance_num')">
          <a-row :gutter="13" type="flex" align="bottom">
            <a-col :span="14">
              <a-input
                :allowClear="true"
                type="text"
                size="large"
              ></a-input>
            </a-col>
            <a-col :span="5">
              <a-input
                :allowClear="true"
                type="text"
                size="large"
              ></a-input>
            </a-col>
            <a-col :span="5">
              <a-input
                :allowClear="true"
                type="text"
                size="large"
              ></a-input>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('insurance_serial')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input></a-form-model-item
      ></a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('repeat_code')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input></a-form-model-item
      ></a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('transaction_num')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input> </a-form-model-item
      ></a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('customer_id')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input></a-form-model-item
      ></a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('customer_name')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('proposer_id')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input> </a-form-model-item
      ></a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('proposer_name')">
          <a-input :allowClear="true" class="input" type="text" size="large" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('aml_id')">
          <a-input
            :allowClear="true"
            class="input"
            type="text"
            size="large"
          ></a-input>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('review_dep')">
          <a-select class="input" size="large">
            <a-select-option v-for="item in dep" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('review_div')">
          <a-select class="input" size="large">
            <a-select-option v-for="item in div" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" :lg="8" :xxl="6">
        <a-form-model-item :label="$t('review_member')">
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
@Component({})
export default class AssignmentFilter extends Vue {
  locale: locale = locale;
  operation: { key: string; value: string }[] = [
    { key: "A", value: "??????" },
    { key: "B", value: "AN-????????????" },
    { key: "C", value: "ML-????????????" },
    { key: "D", value: "ML_1-??????????????????" },
    { key: "E", value: "MB-?????????????????????" },
    {
      key: "F",
      value:
        "MI-??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
    },
    { key: "G", value: "PB1-??????????????????????????????" },
    {
      key: "H",
      value:
        "PB2-??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
    },
    { key: "I", value: "PB4-????????????" },
    { key: "J", value: "PB5-????????????" },
    { key: "K", value: "PB6-??????????????????" },
    { key: "L", value: "SN-SN07????????????" },
  ];
  source: { key: string; value: string }[] = [
    { key: "1", value: "?????????" },
    { key: "2", value: "RENEW" },
  ];
  type: { key: string; value: string }[] = [
    { key: "A", value: "????????????A" },
    { key: "B", value: "????????????B" },
    { key: "C", value: "????????????C" },
  ];
  system: { key: string; value: string }[] = [
    { key: "A", value: "A" },
    { key: "B", value: "F" },
  ];

  dep: { key: string; value: string }[] = [
    { key: "A", value: "VP200???????????????" },
    { key: "B", value: "PR00???????????????" },
    { key: "C", value: "PH00???????????????" },
    { key: "D", value: "VPJ00???????????????" },
    { key: "E", value: "VPK00???????????????" },
    { key: "F", value: "VPE00?????????" },
    { key: "G", value: "VPK00???????????????" },
    { key: "H", value: "VPD00?????????????????????" },
  ];
  div: { key: string; value: string }[] = [
    { key: "A", value: "????????????A" },
    { key: "B", value: "????????????B" },
    { key: "C", value: "????????????C" },
  ];
  emp: { key: string; value: string }[] = [
    { key: "A", value: "????????????A" },
    { key: "B", value: "????????????B" },
    { key: "C", value: "????????????C" },
  ];

  formatter = this.$twDateFormatter;

  form: { operationType: string; produceDate: [] } = {
    operationType: undefined,
    produceDate: [],
  };

  rules = {
    operationType: [
      {
        required: true,
        message: this.$t("rule_operation_type_msg"),
        trigger: "change",
      },
    ],
    produceDate: [
      {
        required: true,
        // message: "?????????????????????",
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
.title {
  font-size: 16px;
  color: #000000d9;
}

</style>
