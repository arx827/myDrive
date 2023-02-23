<template>
  <div>
    <a-modal
      title="電訪作業平台 
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
            @change="saveAccount"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input class="maskpassword" type="text" placeholder="密碼" v-model="form.password" @keydown="handleKeypress">
            <a-icon slot="prefix" type="lock" />
          </a-input>
        </a-form-model-item>
        <div v-if="passwordValidate.feedback" style='color:#f5222d'>{{passwordValidate.msg}}</div>
        <a-form-model-item>
          <a-checkbox :checked="isAccountSaved" @change="saveAccountOnChange">
            {{ $t("global_accountSaved") }}
          </a-checkbox>
        </a-form-model-item>
        <a-form-model-item>
          <a-button :block="true" type="primary" html-type="submit">
            {{ $t("global_login") }}
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <a-button v-show="false" type="primary" @click="enforceLogout">
        登入解鎖
      </a-button>
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
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import jwt from "jsonwebtoken";

@Component
export default class LoginPage extends Vue {
  unsubscribe$ = new Subject<void>();
  isLoading = false;
  form = {
    username: "",
    password: "",
  };

  // 密碼欄位驗證提示工具
  passwordValidate : ValidateFormComponent = { feedback: false, hoverVisible: false };

  formRules: { [key: string]: ValidationRule[] } = {
    username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
    password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  };
  isAccountSaved = false;

  created() {
    // this.$user.loginState$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((state) => {
    //     if (state && state.me) {
    //       this.$router.replace({ path: "/" });
    //     }
    //   });

    let cookiesMap = CommonUtil.parseCookie();
    if (!LoginModule.hasValidToken && cookiesMap) {
      if (cookiesMap.get("fail_from_sso")) {
        this.loginFromSso(cookiesMap.get("fail_from_sso"));
      }
      if (cookiesMap.get("dtw.fbl")) {
        this.loginFromSso(cookiesMap.get("dtw.fbl"));
      }
    }

    this.isAccountSaved = localStorage.getItem("isAccountSaved") === "true";
    if (this.isAccountSaved) {
      this.form.username = localStorage.getItem("username");
    }
  }

  /**
   * 監測密碼欄位輸入內容
   */
  handleKeypress(e: KeyboardEvent) { 
    if(e.key == 'Process'){
      // 輸入模式有誤,請切換英數字模式
      CommonUtil.feildValidateWithVisible(this.passwordValidate, true, this.$t("loginPage_en_mode").toString(), false);
    }else{
      CommonUtil.feildValidateWithVisible(this.passwordValidate, false, '', false);
    }
  }
  
  /**
   * 有效使用者檢查
   */
  async validUserCheck(userId: string): Promise<boolean> {
    // 登入前判斷
    // 判斷AD帳號是否為系統使用者
    let isSysUser = false;
    await this.$userApi.isUserIdExistedUsingGET(userId).then((resp) => {
      isSysUser = resp.data;
    });
    if (!isSysUser) {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t("loginPage_noRules").toString());
      return isSysUser;
    }

    // 判斷AD帳號是否停用
    let isUserDisabled = true;
    await this.$userApi.isUserDisabledUsingGET(userId).then((resp) => {
      isUserDisabled = resp.data;
    });
    if (isUserDisabled) {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t("loginPage_noRules").toString());
      return !isUserDisabled;
    }

    // 判斷使用者是否有角色
    let hasRole = false;
    await this.$userApi.isUserHasRoleUsingGET(userId).then((resp) => {
      hasRole = resp.data;
    });
    if (!hasRole) {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t("loginPage_noRules").toString());
      return hasRole;
    }

    // LoadingUtil.close();
    return isSysUser && hasRole && !isUserDisabled;
  }

  /**
   * 重複登入檢查
   */
  async repeatLoginCheck(userId: string): Promise<boolean> {
    // 判斷是否重複登入
    let isRepeatLogin = true;
    await this.$userApi.isRepeatLoginUsingGET(userId).then((resp) => {
      isRepeatLogin = resp.data;
    });
    if (isRepeatLogin) {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t("loginPagel_repeatLogin").toString());
    }
    // LoadingUtil.close();
    return !isRepeatLogin;
  }

  /**
   * 檢查從SSO過來的登入
   */
  async loginFromSso(validatedInfo: string) {
    console.log("sso state: " + validatedInfo);
    // SSO從後端有判斷AD帳號是否為系統使用者 && 判斷使用者是否有角色 && 重複登入
    // 沒有通過驗證則後端不會記錄登入和未登出PIA，因為預期這邊會登入失敗。
    // 確定登入資料
    LoadingUtil.show();
    const token = jwt.decode(validatedInfo);
    console.log("jwt parse: " + token);
    if (token != null) {
      // 登入後判斷
      await LoginModule.signIn(validatedInfo);
      const state = LoginModule.loginState;
      if (state && state.me) {
        // 登入成功
        LoadingUtil.close();
        // OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面
        // 取得登入者所有角色
        const allRoles = state.me.roles;
        // 判斷登入人員是否有角色
        if (allRoles.length > 0) {
          // 尋找對應的角色裡所包含的menu權限有沒有帶電訪
          const isMatchPendingMenu = allRoles.some((i) =>
            i.menus.some((menu) => menu.menuId.includes("PENDDING_MENU"))
          );
          // 如果找到待電訪將其導到待電訪頁面，其餘到main page
          if (isMatchPendingMenu) {
            this.$router.push("/pending-page");
          } else {
            this.$router.push("/");
          }
        }
      } else {
        // 登入失敗
        LoadingUtil.close();
        ErrorModalUtil.modalError(
          this.$t("loginPage_wrongCertOrLock").toString()
        );
      }
    } else {
      const userId = validatedInfo;
      this.validUserCheck(userId);
      this.repeatLoginCheck(userId);
    }
    LoadingUtil.close();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.form.username) {
      this.form.username = this.form.username.toUpperCase();
    }

    (this.$refs.formRef as any).validate((valid) => {
      if (valid) {
        this.saveAccount();
        this.login();
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }

  async login() {
    console.log(this.form.username);
    const body: CrowdCredentials = {
      username: this.form.username,
      password: this.form.password,
    };
    // 登入後判斷
    LoadingUtil.show();
    if (
      (await this.validUserCheck(body.username)) &&
      (await this.repeatLoginCheck(body.username))
    ) {
      let loginToken = "";
      await this.$authApi
        .crowdLoginUsingPOST1(body)
        .then((resp) => {
          loginToken = resp.data.jwtTokenPair.accessToken;
        })
        .catch((error) => {
          // 登入失敗
        });
      if (loginToken) {
        // LoginModule.isTokenVerify();
        await LoginModule.signIn(loginToken);
        const state = LoginModule.loginState;
        if (state && state.me) {
          // 登入成功
          // OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面
          // 取得登入者所有角色
          const allRoles = state.me.roles;
          // 判斷登入人員是否有角色
          if (allRoles.length > 0) {
            // 尋找對應的角色裡所包含的menu權限有沒有帶電訪
            const isMatchPendingMenu = allRoles.some((i) =>
              i.menus.some((menu) => menu.menuId.includes("PENDDING_MENU"))
            );
            // 如果找到待電訪將其導到待電訪頁面，其餘到main page
            if (isMatchPendingMenu) {
              this.$router.push("/pending-page");
            } else {
              this.$router.push("/");
            }
          }
        } else {
          // 登入失敗
          ErrorModalUtil.modalError(
            this.$t("loginPage_wrongCertOrLock").toString()
          );
        }
      } else {
        // 登入失敗
        ErrorModalUtil.modalError(
          this.$t("loginPage_wrongCertOrLock").toString()
        );
      }
    }
    LoadingUtil.close();
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

  /**
   * 登入解鎖
   */
  enforceLogout() {
    LoadingUtil.show();
    this.$authApi
      .enforceLogoutUsingPOST(this.form.username)
      .catch((e) => console.log(e))
      .finally(() => LoadingUtil.close());
  }
}
</script>

<style scoped>
  .maskpassword {
    -webkit-text-security: disc;
  }
</style>
