<template>
  <div class="loginPage__wrap d-flex flex-column">
    <div class="loginPage__header" />
    <div class="loginPage__content">
      <div class="login__wrap">
        <div class="login__container container">
          <div class="login__formBox">
            <h1 class="login__formTitle">
              核保審核作業系統
            </h1>
            <a-form-model
              ref="formRef"
              :model="form"
              :rules="rules"
              class="login-form"
            >
              <a-form-model-item prop="username">
                <a-input v-model="form.username" type="text" placeholder="請輸入AD帳號" size="large">
                  <div slot="addonBefore" class="login-form__addon d-flex align-items-center">
                    <a-icon type="user" />
                    <span class="login-form__label">帳號</span>
                  </div>
                </a-input>
              </a-form-model-item>

              <a-form-model-item prop="password">
                <a-row type="flex" align="middle" class="position-relative">
                  <a-input
                    v-model="form.password"
                    placeholder="請輸入密碼"
                    size="large"
                    :type="passwordSeeState ? 'text' : 'password'"
                  >
                    <div slot="addonBefore" class="login-form__addon d-flex align-items-center">
                      <a-icon type="lock" />
                      <span class="login-form__label">密碼</span>
                    </div>
                  </a-input>
                  <span
                    class="password-icon"
                    :class="{ off: passwordSeeState }"
                    @click="passwordContrel"
                  />
                </a-row>
              </a-form-model-item>
              <a-form-model-item>
                <a-button :block="true" class="login__button" size="large" @click="handleSubmit">
                  登入
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
      <div class="login__cardLists">
        <div class="container d-flex">
          <div class="login__card">
            <i class="card__icon" />
            <p class="card__title">
              核保審核作業
            </p>
            <p class="card__subTitle">
              審核、風控、覆核、其他
            </p>
          </div>
          <div class="login__card">
            <i class="card__icon" />
            <p class="card__title">
              監控作業
            </p>
            <p class="card__subTitle">
              應處理案件、Pending案件
            </p>
          </div>
          <div class="login__card">
            <i class="card__icon" />
            <p class="card__title">
              MIS統計
            </p>
            <p class="card__subTitle">
              新契約受理件、快核率、照會
            </p>
          </div>
          <div class="login__card">
            <i class="card__icon" />
            <p class="card__title">
              權限管理
            </p>
            <p class="card__subTitle">
              角色設定、部門維護、特殊設定
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="page__footer">
      最新版本chrome、Firefox、Safari、Edge © Fubon Life Insurance Co.Ltd. All Rights Reserved
    </div>
    <!-- <a-modal
      title="F2B_RE Admin (Vue)"
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
            <a-input v-model="form.username" type="text" placeholder="帳號">
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input v-model="form.password" type="password" placeholder="密碼">
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
    </a-modal> -->
  </div>
</template>

<script lang="ts">
import FblFilterBuilder from '@/components/shared/filter-builder/FblFilterBuilder.vue';
// import { CrowdCredentials } from "@fubonlife/f2b_re-api-axios-sdk";
import { message } from 'ant-design-vue';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoginPage extends Vue {
  unsubscribe$ = new Subject<void>();

  passwordSeeState = false;

  isLoading = false;

  form = {
    username: '',
    password: '',
  };

  rules: { [key: string]: ValidationRule[] } = {
    // username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    // password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
  };

  /**
   * Func
   */
  passwordContrel(): void {
    this.passwordSeeState = !this.passwordSeeState;
  }

  handleSubmit(e) {
    e.preventDefault();

    (this.$refs.formRef as any).validate((valid) => {
      if (valid) {
        this.login();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  login() {
    // console.log(this.form.username);
    // const body: CrowdCredentials = {
    //   username: this.form.username,
    //   password: this.form.password,
    // };
    // this.isLoading = true;
    // this.$authApi
    //   .loginUsingPOST(body)
    //   .then((resp) => {
    //     console.log("Login Resp", resp);
    //     this.$user.signIn(resp.data.jwtTokenPair.accessToken);
    //   })
    //   .catch((error) => {
    //     console.log("error status = ", error.status);
    //     message.error("帳號密碼有誤");
    //   })
    //   .finally(() => {
    //     this.isLoading = false;
    //   });
    this.$router.push({ name: 'Home' });
  }

  /**
   * Hook
   */
  created() {
    // this.$user.loginState$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((state) => {
    //     if (state && state.me) {
    //       this.$router.replace({ path: "/" });
    //     }
    //   });
  }

  destroyed(): void {
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
.loginPage__wrap {
  min-height: 100vh;
}

// login header
.loginPage__header {
  height: 87px;
  background: #3aa7c5;
}

// login content
.loginPage__content {
  flex: 1;
}
.login__wrap {
  background: $COLOR-GRAY1;
  height: 481px;
}
.login__container {
  position: relative;
  height: 100%;
}
.login__formBox {
  position: absolute;
  top: 50%;
  left: 150px;
  transform: translateY(-50%);
  .login__formTitle {
    font-size: 45px;
    color: $COLOR-MAIN3;
    letter-spacing: 0.45px;
    margin-bottom: 52.57px;
  }
  ::v-deep {
    .ant-input-group-addon {
      color: $COLOR-MAIN2;
      background: $COLOR-WHITE;
      padding-left: 15px;
      padding-right: 15px;
      border: 1px solid $COLOR-MAIN2;
      border-right: 0;
    }
    .ant-input {
      border: 1px solid $COLOR-MAIN2;
      padding-right: 40px;
    }
  }
  .login-form__label {
    margin-left: 5px;
  }
}
.password-icon {
  width: 30px;
  height: 30px;
  background-image: url("~@images/button_eye_on.svg");
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  z-index: 10;
  &.off {
    background-image: url("~@images/button_eye_off.svg");
  }
}

.login__cardLists {
  margin-top: 38px;
}
.login__card {
  flex: 1;
  text-align: center;
  position: relative;
  color: $COLOR-WHITE;
  padding: 65px 25px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    border-width: 0 15px 16px 15px;
  }
  $cardColor: $COLOR-MAIN2, $COLOR-MAIN3, $COLOR-MAIN4, $COLOR-MAIN5;
  @each $color in $cardColor {
    $i: index($cardColor, $color);
    &:nth-child(#{$i}) {
      background: $color;
      &::before {
        border-bottom-color: $color;
      }
    }
  }
  .card__icon {
    display: block;
    width: 85px;
    height: 85px;
    background: $COLOR-GRAY1;
  }
  .card__title {
    font-size: 25px;
    margin-top: 34px;
    margin-bottom: 0;
  }
  .card__subTitle {
    font-size: 16px;
    margin-top: 21px;
    margin-bottom: 0;
  }
}

.login__button {
  background: $COLOR-MAIN6;
  border: 0;
  color: $COLOR-WHITE;
  font-size: 21px;
}

::v-deep {
  .ant-input-lg {
    height: 49px;
    padding: 10.5px 11px;
    font-size: 14px;
  }
  .ant-btn-lg {
    height: 49px;
  }
}
</style>
