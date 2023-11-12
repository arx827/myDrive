
import { Vue, Component } from "vue-property-decorator";
import ShiftWork from "@/pages/shiftsWork/ShiftsWorkPage.vue";
import Event from "@/pages/eventSetting/EventSetting.vue";
import { ComponentDto } from "@fubonlife/obd-api-axios-sdk";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { AxiosResponse } from "axios";

@Component({
    components: { ShiftWork, Event }
})
export default class ScheduleManagement extends Vue {

    tabActiveKey:string = "1";

    created() {
        // 取得畫面元件權限 範例
        // this.$authApi.getAuthComponentUsingGET(this.$route.path)
        // .then(( res: AxiosResponse<ComponentDto>) => {
        //     if(res.data.component){
        //         this.authComponent.TAB_EVENT = ValidationUtil.isEmpty(res.data.component.TAB_EVENT) ? AuthComonent.TAB_EVENT : res.data.component.TAB_EVENT;
        //         this.authComponent.TAB_SHIFT = ValidationUtil.isEmpty(res.data.component.TAB_SHIFT) ? AuthComonent.TAB_SHIFT : res.data.component.TAB_SHIFT;
        //     }
        //     if(!this.authComponent.TAB_SHIFT.show && this.authComponent.TAB_EVENT.show){
        //         this.tabActiveKey = "2";
        //     }

        // }).catch((err) => {
        //     console.log(err);
        // });
    }
}