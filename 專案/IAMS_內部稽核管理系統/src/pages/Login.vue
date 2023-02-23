<template>
  <div class="login-container d-flex flex-column container-fluid">
    <img
      class="login-container__leftbg"
      src="@/assets/images/login/icon-left-bg.svg"
    >
    <img
      class="login-container__rightbg"
      src="@/assets/images/login/icon-right-bg.svg"
    >
    <div class="title">
      內部稽核管理系統
    </div>
    <div
      v-if="!isSSO"
      class="login"
    >
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
        class="login-form"
      >
        <a-form-model-item prop="username">
          <a-input
            v-model="form.username"
            type="text"
            placeholder="請輸入AD帳號"
            size="large"
          >
            <template slot="addonBefore">
              <div class="input-info">
                <img
                  src="@/assets/images/login/icon-acount-number.svg"
                  alt=""
                >
                <span>
                  帳號
                </span>
              </div>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input
            v-model="form.password"
            :type="isShowPassword? 'test' : 'password'"
            placeholder="請輸入密碼"
            size="large"
          >
            <div
              slot="addonBefore"
              class="input-info"
            >
              <img
                src="@/assets/images/login/icon-password.svg"
                alt=""
              >
              <span>
                密碼
              </span>
            </div>

            <img
              v-show="form.password && !isShowPassword"
              slot="suffix"
              src="@/assets/images/login/icon-show-close.svg"
              alt=""
              class="suffix-img"
              @click="isShowPassword = true"
            >
            <img
              v-show="form.password && isShowPassword"
              slot="suffix"
              src="@/assets/images/login/icon-show-open.svg"
              alt=""
              class="suffix-img"
              @click="isShowPassword = false"
            >
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <button
            class="btn--login"
            @click="handleSubmit"
          >
            登入
          </button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="step row g-0">
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-1.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-2.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-3.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-4.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-5.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-6.svg"
          alt=""
        >
      </div>
      <div class="col-6 col-md-4 col-lg">
        <img
          src="@/assets/images/login/icon-login-7.svg"
          alt=""
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CrowdCredentials, EipSsoCredentials } from '@fubonlife/iams-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Action } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';

export interface ResultModel{
  type: 'success' | 'error';
  title: string;
  content?: string;
  visible: boolean;
}

@Component({ components: { } })
export default class Login extends Vue {
  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  // 是否顯示密碼
  isShowPassword: boolean = false;

  // 是否為SSO登入
  isSSO: boolean = false;

  form: CrowdCredentials = {
  	username: '',
  	password: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  	password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
  };

  resultMsg: ResultModel = {
  	type: 'error',
  	title: '登入失敗',
  	visible: false,
  }

  created() {
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				this.$router.replace({ path: '/' });
  			}
  		});
  	if (this.$route.query.Token) {
  		console.log('Got EIP SSO Token', this.$route.query.Token);
  		this.loginWithSSOToken(this.$route.query.Token as string);
  		this.isSSO = true;
  	} else {
  		this.isSSO = false;
  	}
  }

  handleSubmit(e) {
  	e.preventDefault();
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			process.env.VUE_APP_LOGIN_MODE === 'ldap' ? this.loginLdap() : this.login();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  loginLdap() {
  	this.setLoading(true);
  	console.log(this.form.username);
  	const body: CrowdCredentials = {
  		username: this.form.username,
  		password: this.form.password,
  	};
  	this.$authApi
  		.crowdLdapLoginUsingPOST(body)
  		.then((resp) => {
  			console.log('Login Resp', resp);
  			this.$user.signIn(resp.data.jwtTokenPair.accessToken);
  		  localStorage.setItem('sign-out-time', 'login');
  		})
  		.catch((error) => {
  			if (error.response.status === 500 || error.response.status === 403) return this.$router.replace({ path: '/no-authorization' });
  			// this.resultMsg.visible = true;
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  login() {
  	this.setLoading(true);
  	console.log(this.form.username);
  	const body: CrowdCredentials = {
  		username: this.form.username,
  		password: this.form.password,
  	};
  	this.$authApi
  		.crowdLoginUsingPOST(body)
  		.then((resp) => {
  			console.log('Login Resp', resp);
  			this.$user.signIn(resp.data.jwtTokenPair.accessToken);
  		  localStorage.setItem('sign-out-time', 'login');
  		})
  		.catch((error) => {
  			if (error.response.status === 500 || error.response.status === 403) return this.$router.replace({ path: '/no-authorization' });
  			// this.resultMsg.visible = true;
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  loginWithSSOToken(ssoToken: string) {
  	this.setLoading(true);
  	const body: EipSsoCredentials = {
  		token: ssoToken,
  	};
  	this.$authApi.eipSsoLoginUsingPOST(body)
  		.then((resp) => {
  			console.log('EIP SSO Login Resp', resp);
  			this.$user.signIn(resp.data.jwtTokenPair.accessToken);
  		  localStorage.setItem('sign-out-time', 'login');
  		})
  		.catch((error) => {
  			if (error.response.status === 500 || error.response.status === 403) return this.$router.replace({ path: '/no-authorization' });
  			// this.resultMsg.visible = true;
  			// this.isSSO = false;
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  destroyed(): void {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
.login-container{
  background: $BG-LOGIN;
  min-height: calc(100vh - 78px);
  ::v-deep{
    .ant-input-group-addon{
      background-color: $BG-LIGHT;
      padding: 7px 12px 7px 9px;
      width: 84px;
      // @include rwd-xll{
      //   width: 100px;
      // }
    }
    .ant-form-explain{
      color: $FONT-LIGHT;
      padding-top: 2px;
    }
  }
}
.login-container__leftbg{
  position: absolute;
  top: 0;
  left: 0;
  width: 26%;
}
.login-container__rightbg{
  position: absolute;
  top: 0;
  right: 0;
  width: 26%;
}
.title{
  color: $FONT-LIGHT;
  font-size: 50px;
  letter-spacing: 6px;
  padding: 77px 0px 47px 0px;
  text-align: center;
  font-weight: bold;
  @include rwd-xll{
    // font-size: 70px;
    // letter-spacing: 8.4px;
    padding: 108px 0px 67px 0px;
  }
}
.login-form{
  margin: auto;
  max-width: 442px;
  margin-bottom: 63px;
  @include rwd-xll{
    // max-width: 625px;
    // font-size: 70px;
    margin-bottom: 82px;
  }
}
.step{
  width: 100%;
  max-width: 1180px;
  margin: auto;
  padding-bottom: 28px;
  @include rwd-xll{
    // max-width: 1664px;
  }
}
.input-info{
  img{
    width: 22px;
    vertical-align: middle;
    // @include rwd-xll{
    //   width: 27px;
    // }
  }
  span{
    font-size: 16px;
    color: $FONT-PRIMARY;
    font-weight: bold;
    line-height: 1em;
    vertical-align: middle;
    // @include rwd-xll{
    //   font-size: 22px;
    // }
  }
}
.suffix-img{
  width: 22px;
  cursor: pointer;
}
</style>
