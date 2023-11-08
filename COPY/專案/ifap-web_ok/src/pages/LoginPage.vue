<template>
  <div class="loginPage">
    <a-spin v-if="getLoading" :delay="200" class="ifap_spin" size="large" />
    <a-modal
      v-if="notSSO"
      :visible="true"
      :footer="null"
      :closable="false"
      :width="400"
      centered
      class="loginModal"
      :getContainer="getContainer"
    >
      <h2>登入</h2>

      <a-form-model ref="formRef" :model="form" :rules="formRules">
        <p>員工編號</p>
        <a-form-model-item class="w-100" prop="username">
          <a-input v-model="form.username" type="text" />
        </a-form-model-item>
        <p>密碼</p>
        <a-form-model-item class="w-100" prop="password">
          <a-input-password v-model="form.password" />
        </a-form-model-item>
        <a-form-model-item class="text-center">
          <a-button class="p-1" @click="handleSubmit">
            登入
          </a-button>
        </a-form-model-item>
      </a-form-model>

      <template v-slot:title>
        <div
          style="
            text-align: center;
            border: 1px solid #ffffff;
            width: auto;
            margin-top: 10px;
          "
        >
          <p style="margin: 4px 8px">
            資訊輔助平台 IFAP
          </p>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import { CrowdCredentials } from "@fubonlife/ifap-api-axios-sdk";
import { message } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Vue, Component } from "vue-property-decorator";
import { Getter, Action } from 'vuex-class';

@Component
export default class LoginPage extends Vue {
  @Getter getLoading!: boolean;

  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  notSSO = false;

  public signOut_flag: string = this.$route.params.signOut_flag;

  // title = "IFAP 資訊輔助平台";
  form = {
    username: "",
    password: "",
  };

  formRules: { [key: string]: ValidationRule[] } = {
    username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
    password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  };

  getContainer(triggerNode) {
    return document.querySelector('#app .loginPage');
  }

  /**
  * Hook
  */
  created() {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.$router.replace({ path: "/" });
        }
      });
  }

  mounted() {
    // 判斷進行登入或登出
    if (this.signOut_flag != 'Y') {
      this.setLoading(true)
      this.$authApi.ssoLoginUsingPOST()
      .then((resp) => {
        if (resp.data.accessToken != null) {
          this.$user.signIn(resp.data.accessToken);
        } else {
          this.notSSO = true;
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.setLoading(false)
      })
    } else {
      this.notSSO = true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.form.username) {
      this.form.username = this.form.username.toUpperCase();
    }

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
    // console.log(this.form.username);
    const body: CrowdCredentials = {
      username: this.form.username,
      password: this.form.password,
    };
    this.setLoading(true)
    this.$authApi
      // .loginUsingPOST(body) // 後端版本較舊時使用
      .crowdLoginUsingPOST(body)
      .then((resp) => {
        // console.log("Login Resp", resp);
        this.$user.signIn(resp.data.jwtTokenPair.accessToken);
        sessionStorage.setItem('sign-out-time', 'login');
      })
      .catch((error) => {
        console.log("error status = ", error.status);
        message.error("帳號密碼有誤");
      })
      .finally(() => {
        this.setLoading(false)
      });
  }

  destroyed(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>

button,
html [type="button"] {
  color: #51b7a3;
  border-radius: 5px;
}

form button {
  appearance: none;
  outline: 0;
  background-color: white;
  border: 0;
  padding: 10px 15px;
  color: #51b7a3;
  border-radius: 3px;
  width: 182px;
  cursor: pointer;
  font-size: 18px;
  transition-duration: 0.25s;
  margin-top: 10px;
}

form button > span {
  font-size: 16px;
}

form button:hover {
  background-color: #f5f7f9;
}

h2 {
  margin: 0px;
  color: #ffffff;
  font-size: 16px;
  text-align: center;
}

p {
  margin: 10px;
  margin-left: 0px;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 0px;
}

:deep(.ifap_spin) {
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  z-index: 9999;
  > div > .ant-spin {
    position: static;
  }
}
:deep(.loginModal) {
  .ant-modal-content {
    border-radius: 10px;
    background: #fafafa1c;
  }

  .ant-modal-header {
    padding: 16px 24px;
    background: #fafafa00;
    border-bottom: 0px solid #ffffff;
    border-radius: 10px 10px 0px 0px;
  }

  .ant-modal-title {
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    /* line-height: 25px; */
    /* border: 1px solid #ffffff; */
    padding: 0px 55px 0px 55px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ant-modal-body {
    padding-top: 0px;
    border-radius: 0px 0px 10px 10px;
  }

  .ant-modal-wrap {
    background: transparent
      linear-gradient(180deg, var(--unnamed-color-50a3a2) 0%, #52c9a4db 100%) 0%
      0% no-repeat padding-box;
    background: transparent linear-gradient(180deg, #50a3a2 0%, #52c9a4db 100%) 0%
      0% no-repeat padding-box;
    opacity: 1;
  }

  .ant-input {
    border-radius: 5px;
  }

  .ant-spin-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
:deep(.ant-btn) {
  height: auto;
}
</style>
