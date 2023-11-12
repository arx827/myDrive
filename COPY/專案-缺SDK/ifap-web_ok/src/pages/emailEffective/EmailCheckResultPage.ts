import { Vue, Component } from "vue-property-decorator";
import { EmailVerificationRecordUpdateInput } from "@fubonlife/ifap-api-axios-sdk";

@Component({
  components: {},
})
export default class EmailCheckResultPage extends Vue {
  public uuid: string = this.$route.params.uuid;

  public disagree_url: string = this.$route.params.disagree_url;

  public verifyResult: string = this.$route.params.verifyResult;

  public valid_failed: string = this.$route.params.valid_failed;

  fb_url = 'https://www.fubon.com/life/';

  btnVisible = false;

  is_fail = false;

  is_invalid = false;

  is_success = false;

  public emailVerificationRecordUpdateInput: EmailVerificationRecordUpdateInput =
    {
      //  驗證狀態:Y/N
      status: "",
      uuid: this.uuid,
    };

  created() {
    this.checkValidStatus();
    this.checkDisagreeUrl();
  }

  /**
   * 檢查驗證結果
   */
  checkValidStatus() {
    if (this.valid_failed === "true") {
      this.is_fail = true;
      this.is_invalid = false;
      this.is_success = false;
      this.emailVerificationRecordUpdateInput.status = "N";
      this.updateValidStatus();
    } else if (this.verifyResult === "Y") {
      this.is_fail = false;
      this.is_invalid = false;
      this.is_success = true;
    } else {
      this.is_fail = false;
      this.is_invalid = true;
      this.is_success = false;
    }
  }

  checkDisagreeUrl() {
    if (!this.$validateUtil.isEmpty(this.disagree_url)) {
      this.btnVisible = true;
      this.emailVerificationRecordUpdateInput.status = "N";
    }
    this.updateValidStatus();
  }

  submit_invalid() {
    window.location.href = this.disagree_url;
  }

  submit() {
    window.location.href = this.fb_url;
  }

  updateValidStatus() {
    this.$emailVerifyApi
      .updateEmailVerificationRecordUsingPOST(
        this.emailVerificationRecordUpdateInput,
      )
      .then((res) => {
        console.log(`狀態更新結果:${res.data.data.message}`);
      })
      .catch((err) => {
        err;
      });
  }
}
