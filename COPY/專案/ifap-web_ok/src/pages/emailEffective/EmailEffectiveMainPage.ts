import { Vue, Component } from "vue-property-decorator";
import { EffectiveInfoResult } from "@fubonlife/ifap-api-axios-sdk";
import router from "@/router";

@Component({
  components: {
    // EffetiveCheckLayout,
  },
})
export default class EmailEffectiveMainPage extends Vue {
  public uuid: string;

  public tokenResult: string;

  public effectiveInfoResult: EffectiveInfoResult = {
    disagree_url: "",
    verifyResult: "",
  };

  created() {
    if (!this.$validateUtil.isEmpty(this.$route.query.uuid)) {
      this.uuid = JSON.parse(JSON.stringify(this.$route.query.uuid));
    }

    this.reload();
  }

  reload() {
    if (this.$validateUtil.isEmpty(this.uuid)) {
      // 導轉到失敗頁面
      router.push({
        name: "EmailCheckResult",
        params: {
          verifyResult: "N",
        },
      }).catch((err) => {
        err;
      });
    } else {
      router.push({
        name: "EmailEffectiveCheck",
        query: { uuid: this.uuid },
      }).catch((err) => {
        err;
      });
    }
  }
}
