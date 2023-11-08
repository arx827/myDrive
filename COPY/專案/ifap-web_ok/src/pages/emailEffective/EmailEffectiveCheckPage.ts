import { Vue, Component } from "vue-property-decorator";
import Steps from "@/components/shared/layout/Steps.vue";

import {
  KaptchaDto,
  EmailVerificationInput,
  AuthenticationResult,
  EffectiveInfoResult,
  EffectiveInfoInput,
} from "@fubonlife/ifap-api-axios-sdk";
import router from "@/router";

@Component({
  components: { Steps },
})
export default class EmailEffectiveCheckPage extends Vue {
  public uuid: string = JSON.parse(JSON.stringify(this.$route.query.uuid));

  public title = "Email有效性驗證";

  public fieldInvalidMessageArr = [];

  public fieldInvalidTitle = "送出失敗";

  public custName = "";

  timeout_Message = "網頁無效，無須再次使用，請重新點選連結進入，謝謝!";

  valid_failed = "";

  current = 0;

  base64 = "";

  type = ""; // user輸入

  key = ""; // 裝後端來的key

  keyDto: KaptchaDto = {};

  get visible() {
    return this.fieldInvalidMessageArr.length > 0;
  }

  timeOutVisible = false;

  timeCount = {
    timer: null,
    time: 600, // 秒
  };

  form = {
    custId: "",
    type: "",
  };

  public emailVerificationInput: EmailVerificationInput = {
    custId: "",
    hashId: "",
    kaptcha: "",
    uuid: this.uuid,
  };

  public authenticationResult: AuthenticationResult = {
    codeResult: "",
    custIdResult: "",
    failureStatus: false,
  };

  public effectiveInfoResult: EffectiveInfoResult = {
    disagree_url: "",
    verifyResult: "",
  };

  public effectiveInfoInput: EffectiveInfoInput = {
    uuid: "",
  }

  forms = {
    layout: "vertical",
  };

  public commonCodeOutput = new Map();

  created() {
    this.effectiveInfoInput.uuid = this.uuid;
    this.timeCount.timer = setInterval(this.countdown, 1000); // 每一秒更新一次
    // this.reload();
    this.verifyCode();
    this.verifyEmail();
  }

  /**
   * 畫面停留計算
   */
  countdown() {
    this.timeCount.time--;
    console.log("目前停留時間(秒)");
    if (this.timeCount.time == 0) {
      clearInterval(this.timeCount.timer);
      this.timeOutVisible = true;
    }
  }

  beforeDestroy() {
    clearInterval(this.timeCount.timer);
  }

  /**
   * 根據uuid進行有效性驗證
   */
  verifyEmail() {
    this.$emailVerifyApi
      .grepEffectiveInfoResultUsingPOST(this.effectiveInfoInput)
      .then((res) => {
        if (res.data.apiErrorCode === "00") {
          console.log(`名稱 ${res.data.data.custName}`);
          this.custName = res.data.data.custName;
          // uuid已失效
          if (res.data.data.verifyResult === "N") {
            this.effectiveInfoResult.disagree_url = res.data.data.disagree_url;
            this.effectiveInfoResult.verifyResult = res.data.data.verifyResult;
            console.log(`this.valid_failed:${this.valid_failed}`);
            router
              .push({
                name: "EmailCheckResult",
                params: {
                  uuid: this.uuid,
                  disagree_url: this.effectiveInfoResult.disagree_url,
                  verifyResult: this.effectiveInfoResult.verifyResult,
                  valid_failed: this.valid_failed,
                },
              })
              .catch((err) => {
                err;
              });
          // uuid未失效
          } else if (res.data.data.verifyResult === "Y") {
            // 導入Email驗證成功頁
            router
              .push({
                name: "EmailCheckResult",
                params: {
                  uuid: this.uuid,
                  verifyResult: res.data.data.verifyResult,
                },
              })
              .catch((err) => {
                err;
              });
          }
        } else {
          router
            .push({
              // 導轉到失敗頁面
              name: "EmailCheckResult",
              params: {
                verifyResult: "N",
              },
            })
            .catch((err) => {
              err;
            });
        }
      })
      .catch((err) => {
        err;
      });
  }

  /**
   * 驗證碼產出API
   */
  verifyCode() {
    this.$smtpApi
      .generateCodeUsingPOST()
      .then((res) => {
        if (res) {
          this.base64 = `data:image/jpeg;base64, ${res.data.data.imgBase64}`;
          this.keyDto.key = res.data.data.hashId;
        }
      })
      .catch(console.error)
      .finally();
  }

  /**
   * 欄位驗證(user輸入值)
   */
  submit() {
      this.emailVerificationInput.custId = this.form.custId;
      this.emailVerificationInput.hashId = this.keyDto.key;
      this.emailVerificationInput.kaptcha = this.form.type;
      this.$emailVerifyApi
        .checkAuthenticationUsingPOST(this.emailVerificationInput)
        .then((res) => {
          const resp = res.data.data;
          this.authenticationResult.codeResult = resp.codeResult;
          this.authenticationResult.custIdResult = resp.custIdResult;
          this.authenticationResult.failureStatus = resp.failureStatus;
          if (resp.codeResult === 'true' && resp.custIdResult === 'true') {
            router
            .push({
              name: "ValidationSuccessful",
              params: {
                uuid: this.uuid,
                verifyResult: this.effectiveInfoResult.verifyResult,
              },
            })
            .catch((err) => {
              err;
            });
          } else if (resp.failureStatus) {
            this.valid_failed = 'true';
            this.verifyEmail();
          } else {
            this.linkStatusCheck();
          }
        })
        .catch((err) => {
          err;
        });
    // }
  }

  /**
   * 連結有效性確認
   */
  linkStatusCheck() {
    this.fieldInvalidMessageArr = [];
    this.$emailVerifyApi
      .grepEffectiveInfoResultUsingPOST(this.effectiveInfoInput)
      .then((res) => {
        if (res.data.data.verifyResult === "N") {
          this.effectiveInfoResult.disagree_url = res.data.data.disagree_url;
          this.effectiveInfoResult.verifyResult = res.data.data.verifyResult;
          router
            .push({
              name: "EmailCheckResult",
              params: {
                uuid: this.uuid,
                disagree_url: this.effectiveInfoResult.disagree_url,
                verifyResult: this.effectiveInfoResult.verifyResult,
              },
            })
            .catch((err) => {
              err;
            });
        // 確認是否還有資格繼續進行驗證
        } else if (res.data.data.verifyResult === "needCheck") {
          // 身分證或 驗整碼欄位任一為空時，塞入訊息
          if (this.authenticationResult.custIdResult === "noValue" || this.authenticationResult.codeResult === "noValue") {
            this.fieldInvalidMessageArr.push('欄位未輸入完整，請確認！');
          }
          // 身分證輸入結果錯誤時，塞入訊息
          if (this.authenticationResult.custIdResult === "false") {
            this.fieldInvalidMessageArr.push('身分證號碼/居留證字號末6碼輸入有誤，請確認!');
          }
          // 驗整碼輸入結果錯誤時，塞入訊息
          if (this.authenticationResult.codeResult === "false") {
            this.fieldInvalidMessageArr.push('驗證碼輸入有誤，請確認!');
          }
        }
      });
  }

  handleOk() {
    this.fieldInvalidMessageArr = [];
  }
}
