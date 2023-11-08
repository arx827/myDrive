<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item prop="id" label="群組ID1">
        <a-input type="text" v-model="form.id" disabled=true> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="name" label="群組名稱1">
        <a-input type="text" v-model="form.name"> </a-input>
      </a-form-model-item>
      <a-form-model-item prop="enabled" label="啟用1">
        <a-switch v-model="form.enabled"></a-switch>
      </a-form-model-item>
      <a-form-model-item prop="desciption" label="說明1">
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

<script>
//import { Vue, Component, Prop, Watch } from "vue-property-decorator";
//import { Subject } from "rxjs";
// import {
//   GroupDto, AccountDto
// } from "@fubonlife/<%= code %>-api-axios-sdk";
//import { takeUntil } from "rxjs/operators";
//import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { TreeSelect } from "ant-design-vue";
//import { TreeData } from "node_modules/ant-design-vue/types/tree-select";

const SHOW_PARENT = "SHOW_PARENT";
//const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default {
    name: 'GroupFormJs',
    components: {
    },
    props: {
      initData: Object,
      loading: Boolean,
    },
    data() {
        return {
          treeData: [],
          chkValue: '1',
          form: {},
          formRules: {
            name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
            enabled: [{ required: false, message: "請選擇啟用", trigger: "blur" }],
          },
          isEditing: {
            get: function () {
              return !!this.initData && !!this.initData.id;
            }
          }
        };
    },
    created() {
      this.reset();
    },
    watch: {
      initData: {
        handler: 'onInitDataChanged'
      }
    },
    methods: {
        onInitDataChanged() {
         this.reset();
        },
        toAccountTreeData(account) {
          return {
            key: account.employeeId,
            value: account.id,
            label: account.username,
            children: []
          }
        },
        reset() {
          if (this.initData) {
            this.form = JSON.parse(JSON.stringify(this.initData));
            this.treeData = this.initData.accounts.map((n) => this.toAccountTreeData(n));
          } else {
            this.form = {
              id: "",
              name: "",
              enabled: true,
              description: "",
            };
          }
        },
        submit() {
          (this.$refs.formRef).validate((valid) => {
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
        },
        cancel() {
          this.$emit("formCancel");
        }
    },
};
</script>

<style>
</style>
