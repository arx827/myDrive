<!--<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item prop="productId" label="產品 ID">
        <a-input type="text" v-model="form.productId"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="name" label="名稱">
        <a-input type="text" v-model="form.name"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="quantity" label="數量">
        <a-input-number :min="0" :max="999999" v-model="form.quantity">
        </a-input-number>
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
  ProductDto,
  ProductDtoStatusEnum,
} from "@fubonlife/occupationalSafety-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

interface FormModel {
  productId?: string;
  name?: string;
  quantity?: number;
}

@Component
export default class ProductSpecForm extends Vue {
  @Prop()
  public initData: ProductDto;

  @Prop()
  public loading: boolean;

  form: FormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    productId: [{ required: true, message: "請輸入產品ID", trigger: "blur" }],
    name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
    quantity: [{ required: true, message: "請輸入數量", trigger: "blur" }],
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
        productId: "",
        name: "",
        quantity: 0,
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
-->
