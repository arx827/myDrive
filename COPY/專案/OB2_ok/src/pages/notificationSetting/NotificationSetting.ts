
import { Vue, Component } from "vue-property-decorator";
import NotificationBasicSetting from "@/pages/notificationBasicSetting/NotificationBasicSetting.vue"
import NotiSetting from "@/pages/notiSetting/NotiSetting.vue";
import NotiReplyPersonSetting from "@/pages/notiReplyPerson/NotiReplyPerson.vue";
@Component({
    components: {NotificationBasicSetting,NotiSetting,NotiReplyPersonSetting }
})
export default class InformSetting extends Vue {
    activeKey:string="1";

    onTabChange(key){
       
        this.activeKey=key;
    }
}