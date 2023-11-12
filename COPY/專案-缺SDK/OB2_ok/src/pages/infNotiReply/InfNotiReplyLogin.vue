<template>
  <div>
    <a-modal
      title="電訪作業平台 -會辦回覆
  (請輸入AD網域帳號密碼)"
      :visible="true"
      :footer="null"
      :closable="false"
      :width="300"
      style="white-space: pre"
    >
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-model-item prop="username">
          <a-input
            type="text"
            placeholder="帳號"
            v-model="form.username"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input type="password" placeholder="密碼" v-model="form.password">
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <!-- 記住帳號  (會辦回覆目前不需要先註解)-->
        <!-- <a-form-model-item>
          <a-checkbox :checked="isAccountSaved" @change="saveAccountOnChange">
            {{ $t("global_accountSaved") }}
          </a-checkbox>
        </a-form-model-item> -->
        <a-form-model-item>
          <a-button :block="true" type="primary" html-type="submit">
            {{ $t("global_login") }}
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import { CrowdCredentials } from "@fubonlife/obd-api-axios-sdk";
import { message } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Vue, Component } from "vue-property-decorator";
import { LoginModule } from "@/plugins/store/LoginModule";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import jwt from "jsonwebtoken";
import {AxiosResponse} from 'axios';
import axios from 'axios';

@Component
export default class InfNotiReplyLogin extends Vue {
  
  form = {
    username: "",
    password: "",
  };
  formRules: { [key: string]: ValidationRule[] } = {
    username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
    password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  };
  
  isAccountSaved = false; // 是否儲存帳號


  created(){
    // console.log("infNotiReplyLogin create .....");
    this.isAccountSaved = localStorage.getItem("isAccountSaved") === "true";
    if(this.isAccountSaved){
      this.form.username = localStorage.getItem("username");
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.form.username) {
      this.form.username = this.form.username.toUpperCase();
    }

    (this.$refs.formRef as any).validate((valid) => {
      if(valid){
        this.login();
      }else{
        ErrorModalUtil.modalError(this.$t("inf_loginPage_required").toString()); //登入帳號密碼不可為空值 
        return false;
      }
      
    });

  }

  async login() {

    var loginParam:{username:string;password:string}={
      username: this.form.username,
      password: this.form.password,
    }

    let loginToken = "";

    LoadingUtil.show();
    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/api/inform/informLogin`, loginParam)
    .then(async (resp:AxiosResponse<any>)=>{
      // console.log(JSON.stringify(resp.data));
      loginToken = resp.data.jwtTokenPair.accessToken || null;

      await LoginModule.signIn(loginToken);
      const state = LoginModule.loginState
      if(state){
        this.$router.push({path:"/infNotiReplyMainPage/infReplySearch"});
      }
    })
    .catch((error)=>{
      // 登入失敗
      if(error.response.status === 401){
        if(error.response.data){
          var errorData = error.response.data;
          if(!errorData.success){
            if(errorData.message === "inf_loginPage_noRules"){
              ErrorModalUtil.modalError(this.$t("inf_loginPage_noRules").toString()); //此帳號無權限登入
            }else if(errorData.message === "inf_loginPage_wrongCertOrLock"){
              ErrorModalUtil.modalError(this.$t("inf_loginPage_wrongCertOrLock").toString()); //帳號或密碼有誤，或帳號被鎖定！
            }
          }
        }
      }else if(error.response.status === 423){
        ErrorModalUtil.modalError(this.$t("inf_loginPage_repeatLogin").toString()); //帳號已登入 
      }

    })
    .finally(()=>{
      LoadingUtil.close();
    })

  }


  /**
   * 改變記錄帳號狀態
   */
  saveAccountOnChange() {
    this.isAccountSaved = !this.isAccountSaved;
    this.saveAccount();
  }

   /**
   * 紀錄帳號
   */
  saveAccount() {
    if (this.isAccountSaved) {
      localStorage.setItem("username", this.form.username);
      localStorage.setItem(
        "isAccountSaved",
        Boolean(this.isAccountSaved).toString()
      );
    } else {
      localStorage.setItem("username", "");
      localStorage.setItem(
        "isAccountSaved",
        Boolean(this.isAccountSaved).toString()
      );
    }
  }


  destroyed(): void {
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}
</script>

<style>
</style>
