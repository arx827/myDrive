
import { Vue, Component } from "vue-property-decorator";
import InformBasicSetting from "@/pages/informBasicSetting/InformBasicSetting.vue"
import InfVisitPersonSetting from "@/pages/informSetting/infVisitPersonSetting/InfVisitPersonSetting.vue"
import InfNotifySetting from "@/pages/informSetting/infNotifySetting/InfNotifySetting.vue"
import InfCommunicateSetting from "@/pages/informSetting/InfCommunicatSetting/InfCommunicatSetting.vue"
@Component({
    components: { InformBasicSetting, InfVisitPersonSetting, InfNotifySetting, InfCommunicateSetting}
})
export default class InformSetting extends Vue {
    activeKey: string = "1";

    onTabChange(key) {
        this.activeKey = key;
    }
}