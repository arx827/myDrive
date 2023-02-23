<template>
  <div class="loginBackground">
    <a-row>
      <a-col :span="8">
        <div>
          <div class="login-banner__img-wrap">
            <img
              src="~@images/image_fubonLogo.svg"
              alt=""
            >
          </div>
          <div class="loginBlock">
            <div class="loginBlock__wrap">
              <a-divider>
                <span class="loginBlock__label">{{ title }}</span>
              </a-divider>
              <div>
                <a-form-model
                  ref="loginFormRef"
                  layout="vertical"
                  :model="loginForm"
                  :rules="formRules"
                >
                  <a-form-model-item
                    label="帳號"
                    name="username"
                    prop="username"
                  >
                    <a-input
                      v-model.trim="loginForm.username"
                      class="input__style"
                      @keyup.enter="handleSubmit"
                      @blur="toUpper()"
                    >
                      <img slot="addonBefore" class="user_icon" src="~@images/icon_user.svg">
                    </a-input>
                  </a-form-model-item>
                  <a-form-model-item
                    label="密碼"
                    name="pswd"
                    prop="pswd"
                  >
                    <a-input-password
                      v-model="loginForm.pswd"
                      v-decorator="[
                        'password',
                      ]"
                      type="password"
                      class="input__style"
                      @keyup.enter="handleSubmit"
                    >
                      <a-icon slot="addonBefore" type="lock" />
                    </a-input-password>
                  </a-form-model-item>
                  <div class="loginButton__wrap">
                    <a-button
                      type="primary"
                      class="loginButton"
                      :block="true"
                      :disabled="loginForm.username === '' || loginForm.pswd === ''"
                      @click="handleSubmit"
                    >
                      登入
                    </a-button>
                  </div>
                </a-form-model>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./Login.ts" lang="ts">
</script>

<style lang="scss" scoped>
  .loginBackground {
    background-image: url('~@images/image_loginbg.svg');
    height: 100vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .login-banner__img-wrap {
    position: absolute;
    top: 77px;
    left: 116px;
    width: 135px;
    height: 28px;
  }
  .loginBlock {
    width: 380px;
    height: 360px;
    position: absolute;
    top: 171px;
    left: 81px;
    border: 3px dashed $COLOR-MAIN1;
    background: $COLOR-MAIN13;
    border-radius: 20px;
    text-align: center;
  }
  .loginBlock__wrap {
    padding: 50px 33px;
  }
  .loginBlock__label {
    color: $COLOR-GRAY17;
    letter-spacing: 4px;
    font-size: 20px;
    font-weight: $TEXT-BOLD;
    line-height: 28px;
    text-align: center;
  }
  .input__style {
    width: 100%;
    line-height: 44px;
    height: 44px;
  }
  .loginButton__wrap {
    padding-top: 13px;
  }
  .loginButton {
    background:$COLOR-MAIN2;
    border-radius: 20px;
    color: $COLOR-WHITE;
    font-size: 16px;
    font-weight: $TEXT-BOLD;
    width: 183px;
    height: 40px;
  }
  ::v-deep {
    .ant-input {
      line-height: 40px;
      height: 40px;
    }
    .ant-input-group-addon {
      background-color: $COLOR-WHITE;
    }
    //密碼隱藏控制的眼睛顏色
    .ant-input-suffix {
      color: $COLOR-GRAY5;
    }
    .ant-form-item-label {
      padding: 0;
    }
    .ant-form-vertical .ant-form-item {
      padding-bottom: 0;
    }
    .ant-divider-horizontal {
      margin: 0 0 16px 0;
    }
    .ant-divider-horizontal.ant-divider-with-text-center::before {
      border-top: 1px solid $COLOR-GRAY17;
    }
    .ant-divider-horizontal.ant-divider-with-text-center::after {
      border-top: 1px solid $COLOR-GRAY17;
    }
    .user_icon{
      height: 1em;
      width: 1em;
    }
    .loginButton:hover, .loginButton:focus {
      color: $COLOR-WHITE;
      background-color: $COLOR-MAIN3;
      border-color: $BORDER-COLOR-GRAY;
    }

    .loginButton:active {
      color: $COLOR-WHITE;
      border-color: $COLOR-MAIN16;
      background: $COLOR-MAIN16;
    }
  }
</style>
