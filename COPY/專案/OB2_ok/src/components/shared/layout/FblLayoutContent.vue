<template>
    <a-layout-content style="background:#fff">
        <div v-if="!isThirdMenuListEmpty">
            <a-space v-for="menu in thirdMenuList" :key="menu.menuName" class="thirdMenuClass">
                <a-button :style="getThirdMenuStyle(menu.menuId)" @click="thirdMenuButtonClick(menu)">{{menu.menuName}}</a-button>
            </a-space>
            <a-divider style="margin-top:10px;margin-bottom:12px"></a-divider>
        </div>
        <div class="inner-content">
            <!-- 首頁處理 OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面 修改首頁處理註解-->
            <!-- <div v-if="isInedx"> -->
                <!-- <OnDutyPage/> -->
            <!-- </div> -->

            <router-view></router-view>
            <router-view :name="vuexThirdMenuId"></router-view>
        </div>
    </a-layout-content>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";

@Component({
    //OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面 不需要 commponents
    components: {  }
})
export default class FblLayoutContent extends Vue {
    
    @Prop()
    public isThirdMenuListEmpty: boolean;
    @Prop()
    public thirdMenuList: [];
    @Prop()
    public thirdMenuId: string;

    //採用vuex決定第三層選單thirdMenuId
    get vuexThirdMenuId():string{
        return MenuItemsModule.thirdMenuId$;
    }
    //第三層選單切換按鈕
    thirdMenuButtonClick(menu){
        this.$emit("thirdMenuButtonClick",menu);
    }

    //變更第三層選單顏色
    getThirdMenuStyle(data) {
        if (MenuItemsModule.thirdMenuId$ == data) {
            return "margin-right: 5px;margin-top: 10px;margin-left: 10px;background-color: rgb(70 107 153);color: #fff;cursor: context-menu;";
        } else {
            return "margin-right: 5px;margin-top: 10px;margin-left: 10px;background-color: rgb(124 167 219/90%);color: #fff;";
        }
    }
}
</script>