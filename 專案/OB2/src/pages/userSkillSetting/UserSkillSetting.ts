
import { Vue, Component } from "vue-property-decorator";
import UserSkillTaskSetting from "@/pages/userSkillTaskSetting/UserSkillTaskSetting.vue";
import PolicyTagSetting from "@/pages/userSkillTaskSetting/PolicyTagSetting.vue";
@Component({
    components: { UserSkillTaskSetting,PolicyTagSetting}
})
export default class ScheduleManagement extends Vue {

    tabActiveKey:string = "1";

    created() {
    }
}