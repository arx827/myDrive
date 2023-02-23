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
              <span class="fw-bold">帳密登入</span>
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
              <a-form-model-item prop="username">
                <div class="form__line">
                  <label for="">身分證字號</label>
                  <a-input
                    v-model="form.username"
                    placeholder="e.g. A123456789"
                    @input="form.username = $event.target.value.toUpperCase()"
                  />
                </div>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <div class="form__line">
                  <label
                    class="d-block"
                    for=""
                  >
                    <span class="float-start">密碼</span>
                    <span class="forgot__txt float-end">
                      <router-link to="/forgot">忘記密碼?</router-link>
                    </span>
                  </label>
                  <a-input
                    v-model.trim="form.password"
                    placeholder="8-12位數密碼，請留意英文大小寫"
                    :type="isHideMode?'password':'text'"
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
              <a-form-model-item prop="captchaResponse">
                <div class="form__line">
                  <label for="">驗證碼</label>
                  <div class="row">
                    <div class="col">
                      <a-input
                        v-model="form.captchaResponse"
                        placeholder="圖中6碼數字"
                      />
                    </div>
                    <div class="col position-relative">
                      <img
                        class="captcha__img d-inline-flex"
                        :src="captchaImg"
                      >
                      <a
                        class="captcha__btn d-inline-flex"
                        href="#"
                        @click.prevent="getCaptcha"
                      >
                        <img
                          src="@/assets/button_reset.svg"
                          alt=""
                        >
                      </a>
                    </div>
                  </div>
                </div>
              </a-form-model-item>

              <button
                class="form__btn btn__radius--primary w-100"
                :disabled="isLoading"
                @click="onSubmit"
              >
                登入
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
            <div class="col-7 white-space-pre">
              {{ item.content[0].content }}
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CaseCredentials, ImgCreation, GiMessageTypeQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Action } from 'vuex-class';
import { Modal } from 'ant-design-vue';
import notification from '@/plugins/info/infoNotification';

@Component({ components: {} })

export default class Login extends Vue {
  @Action('setLoading') setLoading;

  unsubscribe$ = new Subject<void>();

  hasValue = false;

  isHideMode = true;

  isLoading = false;

  form = {
  	captchaResponse: '',
  	password: '',
  	policy: '',
  	username: '',
  }

  formRules = {
  	captchaResponse: [{ required: true, message: '請填入有效驗證碼' }, { pattern: /^[0-9]{6}$/, message: '驗證碼不符，請再次輸入' }],
  	password: [{ required: true, message: '請填入有效密碼' }, { min: 8, message: '密碼不符，請再次輸入' }],
  	policy: [{ required: true, message: '請填入有效保單號碼-序號' }, { min: 10, message: '保單號碼-序號不符，請再次輸入' }, { pattern: /[A-Z0-9-]/, message: '保單號碼-序號不符，請再次輸入' }],
  	username: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z0-9]/, message: '身分證字號不符，請再次輸入' }],
  }

  captchaImg = '';

  captchResp: ImgCreation = {};

  modalVisible = false;

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
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				this.$router.replace({ path: '/' });
  			}
  		});
  	this.getCaptcha();
  	this.getAnnouncement();
  }

  login() {
  	this.isLoading = true;
  	const body: CaseCredentials = {
  		word: this.form.captchaResponse,
  		password: this.form.password,
  		policyNo: this.form.policy.substr(0, 7),
  		policySeq: this.form.policy.substr(8, 10),
  		username: this.form.username,
  		hashDate: this.captchResp.hashDate,
  		hashId: this.captchResp.hashId,
  	};
  	console.log(body);
  	this.$authApi
  		.loginUsingPOST(body)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.$user.signIn(
  					resp.data.data.jwtTokenPair.accessToken,
  					resp.data.data.caseOfficeLoginSuccess.userInfoDto,
  					resp.data.data.caseOfficeLoginSuccess.fgppolrJoin,
  				);
  			  this.$router.replace({ path: '/' }).catch((err) => { err; });
  			} else {
  				const errorMsg: any = resp.data.apiError;
  				if (errorMsg.DUPLICATED_LOGIN) {
  					const tmpToken = resp.data.message;
  					console.log(tmpToken);
  					Modal.confirm({
  						title: '提醒',
  						content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  						okType: 'danger',
  						okText: '確定',
  						cancelText: '取消',
  						icon: (h) => h('span', { attrs: { class: 'modal__icon modal__icon--alert' } }),
  						onOk: async () => {
  							// API: 強制登出再登入
  							console.log('登出');
  						await	this.$authApi.forceLoginUsingPOST({
  								headers: {
  									Authorization: `Bearer ${tmpToken}`,
  								},
  							})
  								.then((resp: any) => {
  									console.log(resp);
  									this.$user.signIn(
  										resp.data.data.jwtTokenPair.accessToken,
  										resp.data.data.caseOfficeLoginSuccess.userInfoDto,
  										resp.data.data.caseOfficeLoginSuccess.fgppolrJoin,
  									);
  									this.$router.replace({ path: '/' }).catch((err) => { err; });
  								})
  							.catch((error) => {
  									console.log('error status = ', error.status);
  									// message.error('帳號密碼有誤');
  								})
  								.finally(() => {
  									// this.isLoading = false;
  								});
  						},
  					});
  				} else {
  					notification.error({
  					Content: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				});
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  			// message.error('帳號密碼有誤');
  		})
  		.finally(() => {
  			this.isLoading = false;
  		});
  }

  getCaptcha() {
  	// 拿取驗證碼
  	this.$authApi
  		.kaptchaUsingPOST1()
  		.then((resp) => {
  			this.captchaImg = `data:image/png;base64,${resp.data.imgBase64}`;
  			this.captchResp = resp.data;
  			console.log('captchResp', this.captchResp);
  		})
  		.catch((error) => {
  			console.log('error status = ', error.status);
  		})
  		.finally(() => {
  			// this.isLoading = false;
  		});
  }

  async getAnnouncement() {
 	this.setLoading(true);
 	await this.$homeNoticeApi
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
  	this.announcementData.length > 0 ? this.modalVisible = true : this.modalVisible = false;
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

  onChange() {
  	if (this.form.password) {
  		this.hasValue = true;
  	} else {
  		this.hasValue = false;
  	}
  }
}
</script>

<style lang="scss" scoped>
.forgot__txt {
  font-size: 12px;
  font-weight: normal;
}
.login__wrapper {
  padding: 50px 0;
}
.btn__login {
  margin-top: 15px;
}
.captcha__img {
  padding-right: 30px;
}
.captcha__btn {
  position: absolute;
  right: 5px;
  top: 4px;
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

.white-space-pre{
  white-space: pre-line;
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
// ::v-deep .ant-modal-header{
//   height: 13%;
// }
::v-deep .ant-modal-body{
  height: 87%;
  overflow-y: scroll;
  padding-top: 0px;
}
</style>
