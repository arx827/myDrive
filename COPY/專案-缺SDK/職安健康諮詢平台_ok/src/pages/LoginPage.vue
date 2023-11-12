<template>
  <div>
    <Header :is-login-page="true" />
    <FblLoading />
    <div id="login__content">
      <div class="login-banner__wrap">
        <div class="login-banner__bg" />
        <div class="login-banner__img-wrap container">
          <div class="login-banner__img">
            <img
              src="~@images/image_login.svg"
              alt=""
            >
          </div>
          <div class="login-banner__title-wrap">
            <h1
              class="login-banner__title"
              title="職安系統管理平台"
            >
              職安系統管理平台
            </h1>
          </div>
        </div>
      </div>

      <div
        v-if="env === 'dev' || env === 'local' || env === 'uat'"
        class="login-form__wrap"
      >
        <a-form-model
          ref="ruleForm"
          :rules="formRules"
          :model="form"
        >
          <a-form-model-item
            class="login__card-row"
            prop="username"
          >
            <label
              for="username"
              class="a-form-label"
            >員工編號</label>
            <a-input
              id="username"
              v-model="form.username"
              class="a-form-control"
              type="text"
              placeholder="e.g. A1234"
              autocomplete="off"
              size="large"
              @keyup.enter="login"
            />
          </a-form-model-item>
          <a-form-model-item
            class="login__card-row"
            prop="password"
          >
            <label
              for="password"
              class="a-form-label"
            >密碼</label>
            <a-row
              type="flex"
              align="middle"
              class="position-relative"
            >
              <a-input
                id="password"
                v-model="form.password"
                class="a-form-control"
                size="large"
                :type="passwordSeeState ? 'text' : 'password'"
                placeholder="e.g. 8位數以上密碼，請留意英文大小寫"
                autocomplete="off"
                @keyup.enter="login"
              />
              <span
                class="password-icon"
                :class="{ off: passwordSeeState }"
                @click="passwordControl"
              />
            </a-row>
          </a-form-model-item>
        </a-form-model>
        <button
          class="form__btn btn__radius--primary"
          @click="login"
        >
          登入
        </button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script lang="ts">
import { message } from 'ant-design-vue';
import { Action } from 'vuex-class';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Vue, Component } from 'vue-property-decorator';

import Header from '@compononts/layout/Header.vue';
import Footer from '@compononts/layout/Footer.vue';
import FblLoading from '@compononts/layout/FblLoading.vue';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
	components: {
		Header,
		Footer,
		FblLoading,
	},
})
export default class LoginPage extends Vue {
  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  isLoading = false;

  passwordSeeState = false;

  form = {
  	username: '',
  	password: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  	password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
  };

  sysCode = null

  TOKEN_KEY = 'tokenValue' // SAV

  TOKEN_KEY2 = 'Token' // EIP

  SYS_KEY = 'sysCode'

  env = null // 環境判斷:正式環境不開放帳密登入，DEV環境開放帳密登入

  /**
   * Func
   */
  passwordControl() {
  	this.passwordSeeState = !this.passwordSeeState;
  }

  login() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.loginLDAP();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  loginLDAP() {
  	this.$OSSAuthApi.ossLoginUsingPOST({
  		domainId: this.form.username,
  		password: this.form.password,
  	})
  		.then((resp) => {
  	    console.log('Login Resp', resp);
  			this.$user.signIn(resp.data.data.jwtTokenPair.accessToken, resp.data.data.userInfoDto, resp.data.data.roles);
  			this.$router.replace({ path: '/' }).catch((err) => { err; });
  	  })
  	  .catch((error) => {
  	    console.log('error status = ', error.status);
  	    message.error('帳號密碼有誤');
  	  })
  	  .finally(() => {
  	    this.isLoading = false;
  	  });
  }

  /*
  * EIP 網址範例
  * http://sdtwlvx00405/oss-web/index?Token=TKN_2b6732ef-654e-4d70-9f67-8275d8e4f54b&Rdt=http://sdtwlvx00405:80/oss-web/index?sysCode=EIP
  * SAV 網址範例
  * http://sdtwlvx00405/oss-web/login?tokenValue=20220810_8737C8C3-DED9-4ABA-A78C-C5A744D699B9&sysCode=SAV
  */

  fetchLoginAPI() {
  	const querySearch = window.location.search.split('&');
  	const foundSys = decodeURIComponent(querySearch.find((element) => element.includes(this.SYS_KEY)));
  	let token;
  	let sysCode;
  	if (querySearch.find((element) => element.includes(this.TOKEN_KEY))) {
  		// sav登入
  		const foundToken = querySearch.find((element) => element.includes(this.TOKEN_KEY));
  		token = foundToken.replace('?', '').substr(this.TOKEN_KEY.length + 1, foundToken.length);
  		sysCode = foundSys.replace('?', '').substr(this.SYS_KEY.length + 1, foundSys.length);
  	} else if (querySearch.find((element) => element.includes(this.TOKEN_KEY2))) {
  		// EIP登入
  		const foundToken = querySearch.find((element) => element.includes(this.TOKEN_KEY2));
  		token = foundToken.replace('?', '').substr(this.TOKEN_KEY2.length + 1, foundToken.length);
  		sysCode = foundSys.substr(foundSys.indexOf(this.SYS_KEY) + this.SYS_KEY.length + 1, foundSys.length);
  	} else {
  		token = null;
  	}
  	if (window.location.search.search(this.TOKEN_KEY) === -1 && window.location.search.search(this.TOKEN_KEY2) === -1) return;
  	if (!token || !sysCode) {
  		InfoModal.alertError({
  			content: 'SSO驗證失敗，請重新嘗試',
  		});
  		return;
  	}
  	this.setLoading(true);
  	this.isLoading = true;
  	this.$SSOAuthApi.loginSsoUsingPOST({
  		sysCode,
  		tokenValue: token,
  	})
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.$user.signIn(resp.data.data.jwtTokenPair.accessToken, resp.data.data.userInfoDto, resp.data.data.roles);
  				this.$router.replace({ path: '/' }).catch((err) => { err; });
  			} else {
  				// 認證失敗
  				InfoModal.alertError({
  					content: 'SSO驗證失敗，請重新嘗試',
  				});
  			}
  	  })
  	  .catch((error) => {
  	    console.log('error status = ', error.status);
  	    message.error('帳號密碼有誤');
  	  })
  	  .finally(() => {
  	    this.isLoading = false;
  	    this.setLoading(false);
  	  });
  }

  /**
   * Event
   */
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

  /**
   * Hook
   */
  created() {
  	this.fetchLoginAPI();
  	this.env = process.env.NODE_ENV;
  	// this.$user.loginState$
  	//   .pipe(takeUntil(this.unsubscribe$))
  	//   .subscribe((state) => {
  	//     if (state && state.me) {
  	//       this.$router.replace({ path: "/" });
  	//     }
  	//   });
  }

  destroyed(): void {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }
}
</script>

<style lang="scss" scoped>
#login__content {
  min-height: calc(100vh - 76px);
  padding: 50px 0 0;
  @include rwd-xl {
		padding: 80px 0 0;
	}
}
// banner
.login-banner__wrap {
  position: relative;
  height: 115px;
}
.login-banner__bg {
  background: $LOGIN-BANNER-BG;
  height: 115.8px;
  border-bottom: 1px solid $COLOR-MAIN12;
}

// img
.login-banner__img-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.login-banner__img {
  position: absolute;
  width: 154px;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  @include rwd-lg {
		width: 248px;
    left: 50px;
    bottom: -48px;
    transform: none;
	}
  @include rwd-xl {
    left: 0;
	}
}

// title
.login-banner__title-wrap {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  @include rwd-lg {
		top: 50%;
    transform: translate(-50%, -50%);
	}
}
.login-banner__title {
  font-size: 30px;
  color: $LOGIN-BANNER-TITLE-COLOR;
  margin: 0;
  word-break: keep-all;
  @include rwd-lg {
		font-size: 50px;
	}
}

// form
.login-form__wrap {
  max-width: 255px;
  margin: 53px auto 20px;
  @include rwd-lg {
		max-width: 280px;
	}
  @include rwd-xl {
		max-width: 350px;
	}
  ::v-deep .ant-form-item-control {
    line-height: 1.3;
  }
  .a-form-label {
    font-size: 15px;
    color: #000;
    line-height: 21px;
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
  }
  .a-form-control {
    padding: 5px 15px;
    font-size: 16px;
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
    &.off {
      background-image: url("~@images/button_eye_off.svg");
    }
  }
  .form__btn {
    width: 150px;
    margin: 40px auto 20px;
    display: block;
    @include rwd-lg {
      width: 200px;
    }
  }
}

</style>
