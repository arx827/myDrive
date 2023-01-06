<template>
  <div>
    <a-modal
      title="EDD Admin (Vue)"
      :visible="true"
      :footer="null"
      :closable="false"
      :width="300"
    >
      <a-spin :spinning="isLoading" :delay="200">
        <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
        class="login-form"
      >
        <a-form-model-item prop="username">
          <a-input type="text" placeholder="帳號" v-model="form.username" @keyup.enter="handleSubmit">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input type="password" placeholder="密碼" v-model="form.password" @keyup.enter="handleSubmit">
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button :block="true" type="primary" @click="handleSubmit">
            登入
          </a-button>
          
        </a-form-model-item>
      </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts">
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import { CrowdCredentials } from "@fubonlife/edd-api-axios-sdk";
import { message } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Vue, Component } from "vue-property-decorator";
import axios from 'axios';
import { REVIEW_ASSIGNMENT_PAGE } from "@/plugins/user";

@Component
export default class LoginPage extends Vue {
  unsubscribe$ = new Subject<void>();
  isLoading = false;
  form = {
    username: "",
    password: "",
  };
  formRules: { [key: string]: ValidationRule[] } = {
    username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
    password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  };

  created() {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.$router.replace({ path: "/" });
        }
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    (this.$refs.formRef as any).validate((valid) => {
      if (valid) {
        this.login();
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  login() {
    //console.log(this.form.username);
    const body: CrowdCredentials = {
      username: this.form.username,
      password: this.form.password,
    };
    this.isLoading = true;
    this.$authApi
      .loginUsingPOST(body)
      .then((resp) => {
        console.log("Login Resp", resp);
        this.$user.signIn(resp.data.jwtTokenPair.accessToken);
      })
      .catch((error) => {
        console.log("error status = ", error.status);
        message.error("帳號密碼有誤");
      })
      .finally(() => {
        this.isLoading = false;
        localStorage.removeItem(REVIEW_ASSIGNMENT_PAGE);
      });
  }
  destroyed(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
</script>

<style>
</style>
