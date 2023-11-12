import { Vue, Component } from "vue-property-decorator";
import Steps from "@/components/shared/layout/Steps.vue";
import { EmailVerificationRecordUpdateInput } from "@fubonlife/ifap-api-axios-sdk";

@Component({
  components: { Steps },
})
export default class ValidationSuccessfulPage extends Vue {
  public title = "E-mail 驗證成功，將繼續變更作業";

  public uuid: string = this.$route.params.uuid;

  public emailVerificationRecordUpdateInput: EmailVerificationRecordUpdateInput =
    {
      //  驗證狀態:Y/N
      status: "Y",
      uuid: this.uuid,
    };

  current = 2;

  created() {
    this.updateValidStatus();
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
