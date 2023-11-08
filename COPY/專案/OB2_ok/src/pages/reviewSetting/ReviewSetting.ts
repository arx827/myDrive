
import { Vue, Component } from "vue-property-decorator";
import ReviewedSetting from "@/pages/reviewedSetting/ReviewedSetting.vue";
import ReviewableSetting from "@/pages/reviewedSetting/ReviewableSetting.vue";
import {MenuItemsModule} from "@/plugins/store/MenuItemsModule"
@Component({
    components: { ReviewedSetting,ReviewableSetting}
})
export default class ReviewSetting extends Vue {

    tabActiveKey:string = "1";

    get activeKey():string{

        return MenuItemsModule.tabActiveKey;
    }

    created(){
        MenuItemsModule.updateTabActiveKey(this.tabActiveKey);
    }

    onTabChange(key){
       
        MenuItemsModule.updateTabActiveKey(key);
        MenuItemsModule.updateReviewableSettingSearchDto(null);
    }
}