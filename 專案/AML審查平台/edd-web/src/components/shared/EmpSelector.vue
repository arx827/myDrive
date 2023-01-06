<template>
  <a-form-model
    ref="ruleForm"
    :form="form"
    :layout="'vertical'"
    :model="form"
    :rules="rules"
    :hideRequiredMark="true"
  >
    <a-row type="flex" :gutter="[{ lg: 43, xxl: 55 }, 0]">
      <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
        <a-form-model-item prop="contDp">
          <span slot="label">
            審查部門
            <!-- <span v-if="isRequired[0]" class="mark-required">*</span> -->
          </span>
          <a-select
            class="input"
            size="large"
            v-model="form.contDp"
            @change="handleDepChange"
            allow-clear
            :disabled="isDisabled[0]"
            placeholder="請選擇"
            :showArrow="!isDisabled[0]"
          >
            <a-select-option v-for="item in selectOpts.contDp" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
        <a-form-model-item prop="contUt">
          <span slot="label">
            審查科別
            <span v-if="isRequired[1]" class="mark-required">*</span>
          </span>
          <a-select
            class="input"
            size="large"
            v-model="form.contUt"
            @change="handleDivChange"
            allow-clear
            :disabled="isDisabled[1]"
            placeholder="請選擇"
            :showArrow="!isDisabled[1]"
          >
            <a-select-option v-for="item in selectOpts.contUt" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :xs="xsSpan" :md="mdSpan" :lg="lgSpan" :xxl="xxlSpan">
        <a-form-model-item prop="contId">
          <span slot="label">
            審查人員
            <span v-if="isRequired[2]" class="mark-required">*</span>
          </span>
          <a-select
            class="input"
            size="large"
            v-model="form.contId"
            @change="handleEmpChange"
            allow-clear
            :disabled="isDisabled[2]"
            placeholder="請選擇"
            :showArrow="!isDisabled[2]"
          >
            <a-select-option v-for="item in selectOpts.contId" :key="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script lang="ts">
import { QryOptionsDto } from "@fubonlife/edd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Prop } from "vue-property-decorator";
import { Vue, Component, Watch } from "vue-property-decorator";

export interface Iform {
  contDp: string;
  contUt: string;
  contId: string;
}

export interface IdefaultValue {
  [key: string]: {
    key: string;
    value: string;
  };
}

@Component
export default class ReviewFields extends Vue {
  // 必填選項 [(部門),(科別),(人員)]
  @Prop()
  isRequired!: Array<boolean>;

  // disabled [(部門),(科別),(人員)]
  @Prop()
  isDisabled!: Array<boolean>;

  @Prop()
  defaultValue!: Array<IdefaultValue>;

  @Prop()
  xsSpan!: number;

  @Prop()
  mdSpan!: number;

  @Prop()
  lgSpan!: number;

  @Prop()
  xxlSpan!: number;

  @Prop()
  selectOpts: {
    contDp: QryOptionsDto[],
    contUt: QryOptionsDto[],
    contId: QryOptionsDto[]
  };

  @Prop()
  form: Iform;

  /**
   * 驗證
   */
  rules: { [key: string]: ValidationRule[] } = {
    contDp: [
      {
        required: this.isRequired[0],
        message: "請選擇審查部門",
        trigger: "change",
      },
    ],
    contUt: [
      {
        required: this.isRequired[1],
        message: "請選擇審查科別",
        trigger: "change",
      },
    ],
    contId: [
      {
        required: this.isRequired[2],
        message: "請選擇審查人員",
        trigger: "change",
      },
    ],
  };

  /**
   * Event
   */
  created() {
  }

  handleDepChange(value) {
    this.form.contDp = value;
    this.form.contUt = undefined
    this.form.contId = undefined
    this.$emit("onChange", this.form);
  }

  handleDivChange(value) {
    this.form.contUt = value;
    this.form.contId = undefined
    this.$emit("onChange", this.form);
  }

  handleEmpChange(value) {
    this.form.contId = value;
    this.$emit("onChange", this.form);
  }

  validateForm() {
    this.$emit("submitData", {
      form: this.form,
    });
    return (this.$refs.ruleForm as any).validate();
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
