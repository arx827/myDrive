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
            <span class="fw-bold">忘記密碼</span>
            <span>－填寫個人資料</span>
          </h4>
          <a-form-model
            ref="ruleForm"
            :model="form"
            :layout="'vertical'"
            :rules="formRules"
          >
            <a-form-model-item prop="policy">
              <div class="form__line">
                <label for="">保單號碼-序號</label>
                <input
                  v-model="form.policy"
                  v-mask="'NNNNNNN-NNN'"
                  class="ant-input"
                  placeholder="____________-______"
                  type="text"
                  @blur="form.policy = $event.target.value.toUpperCase()"
                >
              </div>
            </a-form-model-item>
            <a-form-model-item prop="identityId">
              <div class="form__line">
                <label for="">身分證字號</label>
                <a-input
                  v-model="form.identityId"
                  placeholder="e.g. A123456789"
                  @input="form.identityId = $event.target.value.toUpperCase()"
                />
              </div>
            </a-form-model-item>
            <a-form-model-item prop="email">
              <div class="form__line">
                <label for="">E-mail</label>
                <a-input
                  v-model="form.email"
                  placeholder="e.g. fubon123@fubon.com"
                />
              </div>
            </a-form-model-item>
            <button
              class="form__btn btn__radius--primary w-100"
              :disabled="isLoading"
              @click="onSubmit"
            >
              送出
            </button>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CheckUser } from '@fubonlife/co-giiss-api-axios-sdk';
import notification from '@/plugins/info/infoNotification';

@Component({ components: {} })
export default class Forgot extends Vue {
   form = {
  	email: '',
  	identityId: '',
  	policy: '',
   }

  isLoading = false;

  formRules = {
  	email: [{ required: true, message: '請填入有效email' }],
  	identityId: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z0-9]/, message: '身分證字號不符，請再次輸入' }],
  	policy: [{ required: true, message: '請填入有效保單號碼-序號' }, { min: 10, message: '保單號碼-序號不符，請再次輸入' }, { pattern: /[A-Z0-9-]/, message: '保單號碼-序號不符，請再次輸入' }],
  }

  send() {
  	const data: CheckUser = {
  		email: this.form.email,
  		identityId: this.form.identityId,
  		policyNo: this.form.policy.substr(0, 7),
  		policySeq: this.form.policy.substr(8, 10),
  	};

  	this.isLoading = true;
  	console.log(data);
  	this.$userApi
  		.forgetUsingPOST(data)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.data == 'OK' && resp.data.status === 200) {
  				// 記下使用者資料存至sessionStorage, 用於重發信件
  				sessionStorage.setItem('userInfo', JSON.stringify(data));
  				this.$router.push({ name: 'loginResult' });
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		})
  		.finally(() => {
  			this.isLoading = false;
  		});
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			// 打API
  			this.send();
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
</style>
