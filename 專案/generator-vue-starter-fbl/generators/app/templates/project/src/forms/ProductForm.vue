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
      <a-form-model-item prop="ownerAccountId" label="負責人">
        <fbl-level-select
          layout="horizontal"
          :levels="ownerAccountSelect.levels"
          v-model="ownerAccountSelect.selected"
        ></fbl-level-select>
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
  PageFiltersDto
} from "@fubonlife/<%= code %>-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import {
  FblLevelSelectHolder,
  FblLevelState,
} from "@/components/shared/level-select/models";
import {
  FblFilters,
  FblOperator,
} from "@/components/shared/filter-builder/models";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";

export interface ProductFormModel {
  name?: string;
  listPrice?: number;
  unitCost?: number;
  attribute?: string;
  status?: ProductDtoStatusEnum;
  ownerAccountId?: { accountId: string };
}

@Component({ components: { FblLevelSelect } })
export default class ProductForm extends Vue {
  @Prop()
  public initData: ProductDto;

  @Prop()
  public loading: boolean;

  form: ProductFormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
    listPrice: [{ required: true, message: "請輸入定價", trigger: "blur" }],
    unitCost: [{ required: true, message: "請輸入成本", trigger: "blur" }],
    attribute: [{ required: true, message: "請輸入屬性", trigger: "blur" }],
    status: [{ required: true, message: "請輸入狀態", trigger: "blur" }],
    ownerAccountId: [
      { required: true, message: "請選擇負責人", trigger: "blur" },
    ],
  };
  //級聯下拉選單資料及屬性定義
  ownerAccountSelect: FblLevelSelectHolder = {
    selected: {},
    levels: [
      {
        // title: "部門",
        property: "departmentId",          //欄位名稱
        placeholder: "請選擇部門",          //顯示提示
        multiple: false,
        allowClear: true,
        showSearch: true,                  //輸入值是否進行清單搜尋
        load: async (prev: FblLevelState) => {    //讀取清單資料的方法
          const pageFilters: PageFiltersDto = {
            page: 1,
            size: 9999,
            filters: null,
            sort: "id",
            order: "asc"
          };
          return (
            //呼叫後端API取得資料，並組合成物件陣列
            await this.$departmentApi.paginateDepartmentUsingPOST(pageFilters)
          ).data.data.content.map((department) => {
            return {
              label: department.name,
              value: department.id,
            };
          });
        },
      },
      {
        // title: "負責人",
        property: "accountId",
        placeholder: "請選擇負責人",
        multiple: false,
        allowClear: true,
        showSearch: true,
        load: async (prev: FblLevelState) => { 
          const filter: FblFilters = {   //子選單需要根據前一個選單的value顯示，將前一個選單值組成filter傳到後端
            filters: [
              {
                property: "employee.departmentId",
                operator: FblOperator.EQ,
                operand: [prev.value as string],
              },
            ],
          };
          const pageFilters: PageFiltersDto = {
            page: 1,
            size: 9999,
            filters: filter,
            sort: "id",
            order: "asc"
          };
          return (
            await this.$accountApi.paginateAccountUsingPOST( //後端需對應filter來進行處理
              pageFilters
            )
          ).data.data.content.map((account) => {  //組合回傳資料物件陣列
            return {
              label: account.employee.name,
              value: account.id,
            };
          });
        },
      },
    ],
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
  
  //監看欄位選擇資料，同步到form要送出的欄位中
  @Watch("ownerAccountSelect.selected")
  onOwnerAccountSelectChanged(newValue, oldValue){
    this.form.ownerAccountId = newValue ? newValue.accountId : null;
  }

  reset() {
    if (this.initData) {
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.ownerAccountSelect.selected = {
        departmentId: this.initData.ownerAccount.employee.departmentId,
        accountId: this.initData.ownerAccountId
      };
    } else {
      this.form = {
        name: "",
        listPrice: 0,
        unitCost: 0,
        attribute: "",
        status: ProductDtoStatusEnum.Available,
        ownerAccountId: null,
      };
      this.ownerAccountSelect.selected = {};
      
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
