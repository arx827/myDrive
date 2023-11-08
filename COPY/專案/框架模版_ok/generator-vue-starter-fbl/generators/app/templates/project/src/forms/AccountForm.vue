<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item prop="id" label="ID">
        <a-input type="text" v-model="form.id"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="employeeId" label="員工 ID">
        <a-input type="text" v-model="form.employeeId"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="enabled" label="啟用">
        <a-switch v-model="form.enabled"></a-switch>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button type="primary" @click="submit"> 送出 </a-button>
          <a-button type="default" @click="cancel"> 取消 </a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Subject } from "rxjs";
import {
  AccountDto,
} from "@fubonlife/<%= code %>-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

interface FormModel {
  id: string;
  employeeId: string;
  enabled: boolean;
}

@Component
export default class ProductSpecForm extends Vue {
  @Prop()
  public initData: AccountDto;

  @Prop()
  public loading: boolean;

  form: FormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    id: [{ required: false, message: "請輸入ID", trigger: "blur" }],
    employeeId: [{ required: false, message: "請輸入員工ID", trigger: "blur" }],
    enabled: [{ required: false, message: "請選擇啟用", trigger: "blur" }],
  };

  get isEditing(): boolean {
    return !!this.initData && !!this.initData.id;
  }

  created(): void {
    this.reset();
  }

  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }
  reset() {
    if (this.initData) {
      this.form = JSON.parse(JSON.stringify(this.initData));
    } else {
      this.form = {
        id: "",
        employeeId: "",
        enabled: true,
      };
    }
  }

  public submit() {
    (this.$refs.formRef as any).validate((valid) => {
      if (valid) {
        this.$emit("formSubmit", {
          value: this.form,
          isEditing: this.isEditing,
          initData: this.initData,
        });
      } else {
        console.log("error submit");
        return false;
      }
    });
  }
  public cancel() {
    this.$emit("formCancel");
  }
}
</script>

<style>
</style>
