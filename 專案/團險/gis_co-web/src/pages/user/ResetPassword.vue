<template>
  <div class="container">
    <div class="login__wrapper">
      <div class="row align-items-center">
        <div class="col-8">
          <img
            class="img__people-login"
            src="@/assets/image_login_people.svg"
            alt=""
          >
        </div>
        <div class="col-4">
          <h4 class="form__title">
            <span class="fw-bold">重設密碼</span>
          </h4>
          <a-form-model
            ref="ruleForm"
            :model="form"
            :layout="'vertical'"
            :rules="formRules"
          >
            <a-form-model-item prop="password">
              <div class="form__line">
                <label for="">
                  新密碼
                </label>
                <a-input
                  v-model="form.password"
                  placeholder="8-12位數密碼，請留意英文大小寫"
                  :type="isHideMode?'password':'text'"
                  @keyup="debounceCheck"
                  @change="$event.target.value?hasValue=true:hasValue=false"
                >
                  <a
                    slot="suffix"
                    href="#"
                    @click.prevent="isHideMode = !isHideMode"
                  >
                    <img
                      v-if="!hasValue"
                      src="@/assets/button_eye_noTyping.svg"
                      alt=""
                    >
                    <img
                      v-if="hasValue && !isHideMode"
                      src="@/assets/button_eye_off.svg"
                      alt=""
                    >
                    <img
                      v-if="hasValue && isHideMode"
                      src="@/assets/button_eye_on.svg"
                      alt=""
                    >
                  </a>
                </a-input>
              </div>
            </a-form-model-item>

            <div class="form__check-block">
              <p>須符合</p>
              <ul class="form__check-list">
                <li
                  v-for="(v, index) in validates"
                  :key="index"
                  :class="{'form__check-list--check':v.validate}"
                >
                  {{ v.name }}
                </li>
              </ul>
            </div>

            <button
              class="form__btn btn__radius--primary w-100"
              :disabled="!allPass"
              @click="onSubmit"
            >
              確認
            </button>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Password } from '@fubonlife/co-giiss-api-axios-sdk';
import axios from 'axios';
import notification from '@/plugins/info/infoNotification';

@Component({ components: {} })

export default class ResetPassword extends Vue {
  hasValue = false;

  isHideMode = true;

  timeout = null;

  allPass = false;

  validates = [
  	{ name: '密碼長度須為8~12字元', validate: false, regex: /^.{8,16}$/ },
  	{ name: '須包含大小寫字母及數字', validate: false, regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/ },
  	{ name: '重覆或連號的字母或數字不得超過3碼', validate: false, regex: 'custom' },
  	// { name: '不得與前3次密碼重覆', validate: false, regex: null }, //到後端檢核
  	// { name: '不得與使用者身分證字號/帳號相同', validate: false, regex: null }, //到後端檢核
  ]

  form = {
  	password: '',
  	checkPassword: '',
  }

  formRules = {
  	password: [{ required: true, message: '請填入有效密碼' }, { min: 8, message: '密碼不符，請再次輸入' }, { max: 12, message: '密碼不符，請再次輸入' }],
  }

  @Watch('form.checkPassword')
  onValChange(val) {
  	this.validates.forEach((element) => {
  		const regex = element.regex as any;
  		if (regex === 'custom') {
  			if (!/([0-9])\1{2}|(012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210)/.test(val)) {
  				element.validate = true;
  				const counts = {};
  				[...val].forEach((x) => { counts[x] = (counts[x] || 0) + 1; });
  				const array = Object.values(counts);
  				for (let index = 0; index < array.length; index++) {
  					if (array[index] > 2) {
  						element.validate = false;
  						break;
  					}
  				}
  			} else {
  				element.validate = false;
  			}
  		} else {
  			regex.test(val) ? element.validate = true : element.validate = false;
  		}
  	});

  	this.allPass = this.validates.every((e) => e.validate);
  }

  debounceCheck() {
  	clearTimeout(this.timeout);
  	this.timeout = setTimeout(() => {
  		// enter this block of code after 0.8 second
  		this.form.checkPassword = this.form.password;
  	}, 800);
  }

  resetPassword() {
  	const password: Password = {
  		passwordNEW: this.form.password,
  		passwordOld: '',
  	};
  	const querySearch = window.location.search.split('&');
  	const found = querySearch.find((element) => element.includes('token'));
  	const token = found.substr(7, found.length);
  	this.$authApi
  		.forgetPasswordUsingPOST(password, {
  			headers: {
  				Authorization: `Bearer ${token}`,
  			},
  		})
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				notification.success({
  					Content: '密碼重設完成，請至登入頁面使用新密碼登入!',
  				});
  				setTimeout(() => {
  					this.$router.push({ name: 'Login' });
  				}, 100);
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		});
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			// 打API
  			this.resetPassword();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }
}
</script>

<style lang="scss" scoped>
.login__wrapper {
  padding: 50px 0;
}
.form__check-block {
    border-top: 1px #DEE2E6 solid;
    padding-top: 10px;
    margin-top: 30px;
}

</style>
