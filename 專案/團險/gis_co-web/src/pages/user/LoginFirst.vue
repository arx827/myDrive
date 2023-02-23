<template>
  <div>
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
              <span class="fw-bold">首次登入</span>
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
                下一步
              </button>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>
    <div>
      <a-modal
        v-model="modalVisible"
        :centered="true"
        :closable="true"
        :footer="null"
        width="66%"
        title="公告"
      >
        <div>
          <div
            v-for="(item,index) in announcementData"
            :key="index"
            class="row modal__row"
          >
            <div class="col-2 modal__row--date">
              {{ item.startDate }}
            </div>
            <div class="col-3 modal__row--subject">
              {{ item.content[0].subject }}
            </div>
            <div class="col-7">
              {{ item.content[0].content }}
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { FirstCaseOfficerLogin, GiMessageTypeQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import axios from 'axios';
import { Action } from 'vuex-class';
import notification from '@/plugins/info/infoNotification';

@Component({ components: {} })

export default class LoginFirst extends Vue {
  @Action('setLoading') setLoading;

  form = {
  	email: '',
  	identityId: '',
  	policy: '',
  }

  formRules = {
  	email: [{ required: true, message: '請填入有效e-mail' }],
  	policy: [{ required: true, message: '請填入有效保單號碼-序號' }, { min: 10, message: '保單號碼-序號不符，請再次輸入' }, { pattern: /[A-Z0-9-]/, message: '保單號碼-序號不符，請再次輸入' }],
  	identityId: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z0-9]/, message: '身分證字號不符，請再次輸入' }],
  }

  isLoading = false;

  token = '';

  // 公告資料
  announcementData = [];

  announcementRequest: GiMessageTypeQueryDto = {
  	// 0：全部 1：登入前 2：登入後
  	customer: '0', // 0：全部 1：RC 8：CB
  	sortOrder: 'desc', // desc、asc
  	pageNo: 0,
  	pageSize: 99999,
  }

  created() {
  	// this.setToken();
  	this.getAnnouncement();
  }

  login() {
  	const body: FirstCaseOfficerLogin = {
  		email: this.form.email,
  		identityId: this.form.identityId,
  		policyNo: this.form.policy.substr(0, 7),
  		policySeq: this.form.policy.substr(8, 10),
  	};
  	const querySearch = window.location.search.split('&');
  	const found = querySearch.find((element) => element.includes('token'));
  	const token = found.substr(7, found.length);
  	this.isLoading = true;
  	this.$authApi
  		.firstLoginUsingPOST(body, {
  			headers: {
  				Authorization: `Bearer ${token}`,
  			},
  		})
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200 && resp.data.data === 'OK') {
  				this.$router.push({ name: 'LoginFirstPassword', query: { token } });
  			} else {
  				notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  			}
  			// this.$user.signIn(resp.data.jwtTokenPair.accessToken);
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  			// message.error('帳號密碼有誤');
  		})
  		.finally(() => {
  			this.isLoading = false;
  		});
  }

  getAnnouncement() {
 	this.setLoading(true);
 	this.$homeNoticeApi
 		.listAnnouncementUnLogInUsingPOST(this.announcementRequest)
 		.then((resp) => {
 		if (resp.data.status === 200) {
  					if (resp.data.data.content.length > 0) {
  						const topItem = null;
  						const input = resp.data.data.content.map(({ startDate, top, ...rest }) => ({
  							startDate,
  							content: [{ ...rest }],
  							top,
  						}));
  						const output = [];
  						input.forEach((item) => {
  							const existing = output.filter((v, i) => v.startDate == item.startDate);
  							if (existing.length) {
  								const existingIndex = output.indexOf(existing[0]);
  								output[existingIndex].content = output[existingIndex].content.concat(item.content);
  							} else {
  								if (typeof item.content == 'string') item.content = [item.content];
  								output.push(item);
  							}
  						});
  						this.announcementData = output.map((e) => {
  							e.activekey = e.content.map((e, index) => `child${index}`);
  							return e;
  						});
  						console.log('this.announcementData', this.announcementData);
  					}
  			}
 		}).catch((err) => {
 			console.log(err);
 		}).finally(() => {
 			this.setLoading(false);
 		});
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			// 打登入API
  			this.login();
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
.modal__row{
  padding-top: 20px;
  padding-bottom:20px ;
  border-top: 1px solid #FFF4F4;
}
.modal__row--subject{
  color: $COLOR-MAIN6;
  padding-right: 17px;
}
::v-deep .ant-modal-content{
  font-size: 16px;
  height: 54vh;
  max-height: 420px;
}
::v-deep .ant-modal-title{
  font-size: 16px;
  font-weight: 500;
}
::v-deep .ant-modal-header{
  height: 13%;
}
::v-deep .ant-modal-body{
  height: 87%;
  overflow-y: scroll;
  padding-top: 0px;
}
</style>
