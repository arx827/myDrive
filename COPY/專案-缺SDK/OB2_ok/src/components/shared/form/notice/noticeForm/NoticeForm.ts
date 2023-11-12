import { Vue, Component, Prop } from "vue-property-decorator";
import TextMessage from "@/components/shared/form/notice/textMessage/TextMessage.vue";
import Email from "@/components/shared/form/notice/email/Email.vue";
import { AuthComonent } from "@/assets/config/CommonUtil";
import { AxiosResponse } from "axios";
import { ComponentDto } from "@fubonlife/obd-api-axios-sdk";
import ValidationUtil from "@/assets/config/ValidationUtil";
import MailLetterForm from "@/components/shared/form/mailLetter/mailLetterForm/MailLetterForm.vue";

@Component({
    components: {TextMessage, Email,MailLetterForm}
})
export default class NoticeForm extends Vue{
    tabActiveKey:string = "1";

    // 畫面元件
    authComponent: AuthComonent ={
        NOTICE_SEND_POST : {
            show: false,
            enable: false
        }
    };
    
    created() {
        // console.log("noticeForm created execute");
        // 畫面元件 component 權限
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
        .then((res: AxiosResponse<ComponentDto>) => {
            if (res.data.component) {
                this.authComponent.NOTICE_SEND_POST = ValidationUtil.isEmpty(res.data.component.NOTICE_SEND_POST) ? this.authComponent.NOTICE_SEND_POST : res.data.component.NOTICE_SEND_POST;
            }
            console.log("NoticeForm: ", JSON.stringify(this.authComponent));

        }).catch((err) => {
            console.log(err);
        });
    }

    destroyed(){
        // console.log("noticeForm dsetroyed execute");
    }
}