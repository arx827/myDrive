<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item prop="id" label="群組ID">
        <a-input type="text" v-model="form.id" disabled="true"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="name" label="群組名稱">
        <a-input type="text" v-model="form.name"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="enabled" label="啟用">
        <a-switch v-model="form.enabled"></a-switch>
      </a-form-model-item>
      <a-form-model-item prop="desciption" label="說明">
        <a-input type="text" v-model="form.description"> </a-input>
      </a-form-model-item>
      <a-form-model-item label="帳號選單">
        <a-tree-select
          v-model="chkValue"
          style="width: 100%"
          :tree-data="treeData"
          tree-checkable
          :show-checked-strategy="SHOW_PARENT"
          search-placeholder="Please select"
        />
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
  GroupDto, AccountDto
} from "@fubonlife/<%= code %>-api-axios-sdk";
import { takeUntil } from "rxjs/operators";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { TreeSelect } from "ant-design-vue";
import { TreeData } from "node_modules/ant-design-vue/types/tree-select";

interface FormModel {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

const SHOW_PARENT = "SHOW_PARENT";

@Component
export default class GroupForm extends Vue {
  @Prop()
  public initData: GroupDto;

  @Prop()
  public loading: boolean;

  treeData: TreeData[];

  chkValue: string = '1';

  form: FormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
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
  toAccountTreeData(account:AccountDto): TreeData {
    return {
      key: account.employeeId,
      value: account.id,
      label: account.username,
      children: []
    }
  }
  reset() {
    if (this.initData) {
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.treeData = this.initData.accounts.map((n) => this.toAccountTreeData(n));
      // [
      //   {
      //     title: 'Node1',
      //     value: '0-0',
      //     key: '0-0',
      //     children: [
      //       {
      //         title: 'Child Node1',
      //         value: '0-0-0',
      //         key: '0-0-0',
      //       },
      //     ],
      //   }
      // ];
    } else {
      this.form = {
        id: "",
        name: "",
        enabled: true,
        description: "",
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
