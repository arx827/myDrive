<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item prop="name" label="名稱">
        <a-input type="text" v-model="form.name"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="listPrice" label="定價">
        <a-input-number :min="0" :max="999999" v-model="form.listPrice">
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item prop="unitCost" label="成本">
        <a-input-number :min="0" :max="999999" v-model="form.unitCost">
        </a-input-number>
      </a-form-model-item>
      <a-form-model-item prop="attribute" label="屬性">
        <a-input type="text" v-model="form.attribute"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="status" label="狀態">
        <a-select prop="status" v-model="form.status">
          <a-select-option value="AVAILABLE">有現貨</a-select-option>
          <a-select-option value="SHORTAGE">缺貨</a-select-option>
        </a-select>
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
} from "@fubonlife/edd-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

interface FormModel {
  name?: string;
  listPrice?: number;
  unitCost?: number;
  attribute?: string;
  status?: ProductDtoStatusEnum;
}

@Component
export default class ProductForm extends Vue {
  @Prop()
  public initData: ProductDto;

  @Prop()
  public loading: boolean;

  form: FormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
    listPrice: [{ required: true, message: "請輸入定價", trigger: "blur" }],
    unitCost: [{ required: true, message: "請輸入成本", trigger: "blur" }],
    attribute: [{ required: true, message: "請輸入屬性", trigger: "blur" }],
    status: [{ required: true, message: "請輸入狀態", trigger: "blur" }],
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
        name: "",
        listPrice: 0,
        unitCost: 0,
        attribute: "",
        status: ProductDtoStatusEnum.AVAILABLE,
      };
    }
  }

  public submit() {
    (this.$refs.formRef as any).validate(valid => {
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
