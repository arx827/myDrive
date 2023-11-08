import { Vue, Component } from "vue-property-decorator";
import SendSMSTemplateSetting from "@/pages/sendSMSTemplateSetting/SendSMSTemplateSetting.vue";
import SendEmailTemplateSetting from "@/pages/sendEmailTemplateSetting/SendEmailTemplateSetting.vue";
import SendMPLUSTemplateSetting from "@/pages/sendMPLUSTemplateSetting/SendMPLUSTemplateSetting.vue";

@Component({
    components: {SendSMSTemplateSetting,SendEmailTemplateSetting,SendMPLUSTemplateSetting}
})
export default class InformSetting extends Vue {
    activeKey:string="1";

    onTabChange(key){
       
        this.activeKey=key;
    }
}