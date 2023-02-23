<template>
  <div class="page__login">
    <LayoutLoading v-if="getLoading" />
    <header class="header login__header">
      <nav class="header__navBar">
        <div class="header__logo">
          <img class="header__logo-img" src="~@images/image_logo.svg" alt="">
        </div>
      </nav>
    </header>
    <div class="main">
      <main class="main__container">
        <div class="login__card">
          <h2 class="page-title">
            團險行政管理
          </h2>
          <a-form-model :model="form">
            <a-form-model-item class="login__card-row" prop="username">
              <label for="username" class="a-form-label">使用者ID</label>
              <a-input
                id="username"
                v-model="form.domainId"
                class="a-form-control"
                type="text"
                placeholder="e.g. B1234"
                autocomplete="off"
                @keyup.enter="handleSubmit"
              />
            </a-form-model-item>
            <a-form-model-item class="login__card-row" prop="password">
              <label for="password" class="a-form-label">密碼</label>
              <a-row type="flex" align="middle" class="position-relative">
                <a-input
                  id="password"
                  v-model="form.password"
                  class="a-form-control"
                  :type="passwordSeeState ? 'text' : 'password'"
                  placeholder="e.g. 8位數以上密碼，請留意英文大小寫"
                  autocomplete="off"
                  @keyup.enter="handleSubmit"
                />
                <span
                  class="password-icon"
                  :class="{ off: passwordSeeState }"
                  @click="passwordContrel"
                />
              </a-row>
            </a-form-model-item>
          </a-form-model>
          <button
            type="button"
            class="btn login__card-button"
            @click="handleSubmit"
          >
            登入
          </button>
        </div>
      </main>
      <LayoutFooter />
    </div>
  </div>
</template>

<script lang="ts">
// import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import { GioCredentials } from '@fubonlife/co-giiss-api-axios-sdk';
// import { message } from "ant-design-vue";
// import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

import LayoutFooter from '@compononts/layout/FblLayoutFooter.vue';

@Component({
  components: {
    LayoutLoading,
    LayoutFooter,
  },
})
export default class LoginPage extends Vue {
  @Getter getLoading!: boolean;

  @Action('setLoading') setLoading;

  h = this.$createElement;

  unsubscribe$ = new Subject<void>();

  form: GioCredentials = {
    domainId: '',
    password: '',
  };

  passwordSeeState = false;

  errorTitle = '';

  errorMessage = '';

  /**
   * Func
   */
  passwordContrel(): void {
    this.passwordSeeState = !this.passwordSeeState;
  }

  login(): void {
    const body: GioCredentials = {
      domainId: this.form.domainId.toUpperCase(),
      password: this.form.password,
    };
    this.setLoading(true);
    this.$gioAuthApi
      .gioLoginUsingPOST(body)
      .then(async (resp) => {
        if (resp.data.status == 200) {
          const getData = resp.data.data;
          // console.log(getData);
          this.$user.signIn(getData.jwtTokenPair.accessToken, getData.admUser);
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  /**
   * Event
   */
  handleSubmit(e): void {
    this.errorTitle = '';
    this.errorMessage = '';
    e.preventDefault();
    const $domainId = this.form.domainId.trim();
    const $password = this.form.password.trim();

    if ($domainId == '' && $password == '') {
      // 驗證 使用者ID 或 密碼是否為空值
      this.errorTitle = '帳號/密碼未填';
      this.errorMessage = '尚有欄位未填，請輸入有效帳號/密碼。';
    } else if ($domainId == '') {
      // 驗證 僅 使用者ID 是否為空值
      this.errorTitle = '錯誤訊息';
      this.errorMessage = '請輸入使用者ID。';
    } else if ($password == '') {
      // 驗證 僅 密碼是否為空值
      this.errorTitle = '錯誤訊息';
      this.errorMessage = '請輸入密碼。';
    } else if ($password.length < 8) {
      // 格式不符 ID 未達5碼，密碼 未介於 8~碼
      this.errorTitle = '錯誤訊息';
      this.errorMessage = '密碼錯誤，請確認所輸入之密碼是否正確(密碼提示：8位數以上密碼)。';
    }

    if (this.errorTitle != '' || this.errorMessage != '') {
      Modal.error({
        title: this.h('div', {}, this.errorTitle),
        content: this.errorMessage,
        okType: 'confrim',
        okText: '確定',
        icon: () =>
          this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
      });
    } else {
      this.login();
    }
  }

  /**
   * Hook
   */
  created(): void {
    this.$user.loginState$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((state) => {
        if (state && state.me) {
          this.$router.replace({ path: '/' });
        }
      });

    // TEST:
    // this.form.domainId = 'B0757';
    // this.form.password = 'Aa123456';
  }

  destroyed(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
.page__login {
  background: $LOGIN-BG;
}

/**
   *  header 區塊
   * ----------------------------------
   */
.header {
  background: #fff;
  box-shadow: 0 -3px 6px 5px rgba(0, 0, 0, 0.2);
  position: fixed;
  width: 100%;
  z-index: 999;
  &::before {
    content: "";
    background: linear-gradient(to right, $COLOR-MAIN1 0%, $COLOR-MAIN2 100%);
    display: block;
    width: 100%;
    height: 8px;
  }
}
.header__navBar {
  height: 72px;
  display: flex;
  align-items: center;
  padding-left: 139px;
  padding-right: 139px;
}
.header__logo {
  display: block;
  width: 135px;
}
.header__logo-img {
  width: 100%;
  height: auto;
}

/**
   *  main 區塊
   * ----------------------------------
   */
.main {
  padding-top: 80px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: url("~@images/iamge_login.svg");
  background-position: left 0 bottom 48px;
  background-size: 70%;
  background-repeat: no-repeat;
}
.main__container {
  position: relative;
  flex: 1;
  min-height: 500px;
}

/**
   *  login 區塊
   * ----------------------------------
   */
.login__card {
  width: 310px;
  position: absolute;
  padding: 20px;
  top: 50px;
  right: 180px;
  box-sizing: content-box;
  .a-form-label {
    font-size: 15px;
    color: #000;
    line-height: 21px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  .a-form-control {
    padding: 5px 15px;
    font-size: 15px;
    border-radius: 0.25rem;
    font-weight: 400;
    &[id^="password"] {
      padding-right: 35px;
    }
    &:focus {
      border-color: $INPUT-FOCUS-BORDER-COLOR;
      box-shadow: 0 0 0 0.25rem rgba($INPUT-FOCUS-BORDER-COLOR, 0.2);
    }
  }
  .password-group {
    position: relative;
  }
  .password-icon {
    width: 30px;
    height: 30px;
    background-image: url("~@images/button_eye_on.svg");
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    top: 2px;
    right: 5px;
    &.off {
      background-image: url("~@images/button_eye_off.svg");
    }
  }
}
.page-title {
  color: $COLOR-MAIN3;
  padding-bottom: 8px;
  border-bottom: 2px solid $COLOR-MAIN3;
}
.login__card-row {
  margin-top: 15px;
  margin-bottom: 0;
  ::v-deep {
    .ant-form-item-control {
      line-height: 1;
    }
    .ant-input {
      height: auto;
    }
  }
}
.login__card-button {
  background: $LOGINBUTTON-COLOR;
  color: $COLOR-WHITE;
  font-weight: 600;
  width: 100%;
  border-radius: 50vh;
  font-size: 16px;
  padding: 12px;
  margin-top: 37px;
}

/**
   *  footer 區塊
   * ----------------------------------
   */
.footer {
  background: $FOOTER-BG;
  text-align: center;
}
.footer__navBar {
  margin-top: 16px;
  margin-bottom: 1px;
  .menu-item {
    color: #000;
    font-size: 14px;
    border-left: 1px solid #000;
    padding-left: 8px;
    padding-right: 8px;
    &:last-child {
      border-right: 1px solid #000;
    }
  }
}
.footer__copyright {
  font-size: 12px;
  margin-bottom: 14px;
}
</style>
