import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { BackDoorTokenOutput } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import BackDoorUtil from "./BackDoorUtil";

@Component({ components: {} })
export default class BackDoorValidation extends Vue {

    promptMesg: string = "";

    validUserPrompt: string = "判斷進入資格和擷取token...";

    backDoorToken: string = "";

    loading: boolean = true;

    /**
     * 開啟頁面
     */
    created() {
        this.getBackDoorTokenByApi();
    }

    // /**
    //  * 設置token
    //  */
    // setBackDoorTokenAndForward() {
    //     BackDoorUtil.setBackDoorToken(this.backDoorToken);
    //     if (BackDoorUtil.checkToken()) {
    //         this.$router.push({ name: this.$route.query.from as string }).catch(() => { });
    //     } else {
    //         this.getBackDoorTokenByApi();
    //     }
    // }

    /**
     * 打API根據IP獲得token
     */
    getBackDoorTokenByApi() {
        this.$backDoorSettingApi.getBackDoorTokenUsingPOST().then((resp: AxiosResponse<BackDoorTokenOutput>) => {
            if (resp && resp.data && resp.data.success) {
                if (!ValidationUtil.isEmpty(resp.data.backDoorToken)) {
                    // this.isValidUser = true;
                    this.backDoorToken = resp.data.backDoorToken;
                    BackDoorUtil.setBackDoorToken(this.backDoorToken);
                    this.$router.push({ name: this.$route.query.from as string }).catch(() => { });
                } else {
                    this.validUserPrompt = "未授權使用本網站";
                }
            } else {
                this.validUserPrompt = "未授權使用本網站";
                alert("取得token時發生錯誤：" + resp.data.returnMessage);
            }
        }).catch(e => console.error(e)).finally(() => this.loading = false);
    }
}