<template>
  <a-layout-sider
    :width="230"
    :style="{
      overflowX: 'auto',
      overflow: 'overlay',
      height: '100vh',
      position: 'fixed',
      left: 0,
      paddingRight: '5px',
    }"
    theme="dark"
  >
    <a-row style="text-align: center; margin-top: 30px">
      <!-- <a-button @click="getMenuPendingCasesCounts()">下一件更新</a-button>
      <a-button @click="manualUpdateMenuCaseCounts()">手動更新</a-button> -->
      <!-- <a-col>
        <a-dropdown>
        
          <img
            style="width: 35px; height: 35px"
            src="@/assets/imgs/image_user.svg"
          />
        </a-dropdown>
      </a-col> -->
      <a-col>
        <span style="font-size: 20px">
          <template>
            <a-popover
              placement="bottomRight"
              trigger="click"
              :autoAdjustOverflow="false"
              overlayClassName="layoutSide__popover"
              :align="{offset: [10, 0]}"
            >
              <!-- trigger="focus" -->
              <template slot="content">
                <a-space align="baseline" :size="13" direction="vertical"
                  ><!-- 標題與button的間隔 -->
                  <div class="space-align-block">
                    <div v-for="action of avatarActions" :key="action.name">
                      <a @click="onAvatarAction(action)">
                        <a-icon type="export" /><span class="layoutSide__popover__text">登出</span>
                      </a>
                    </div>
                  </div>
                </a-space>
              </template>

              <span style="cursor: pointer; color: black">
                {{ avatarText }} <a-icon type="caret-down" />
              </span>
            </a-popover>
          </template>
        </span>
      </a-col>
    </a-row>
    <slot name="side" />
  </a-layout-sider>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FblAvatarAction } from "@/components/shared/layout/models";
import { MenuItemsModule } from "@/plugins/store/MenuItemsModule";

@Component({
  components: {},
})
export default class FblLayoutSider extends Vue {
  @Prop()
  public avatarText: string;
  @Prop()
  public avatarActions: FblAvatarAction[];
  /** TODO 前端使用button進行下一件更新Vuex
   *  
   * */
  // 目前沒用到
  async getMenuPendingCasesCounts() {
    await MenuItemsModule.updateMenuPendingCasesCounts();
  }
  /** TODO 前端使用button進行手動更新Vuex
   *  
   * */
   // 目前沒用到
  async manualUpdateMenuCaseCounts(){
    await MenuItemsModule.updateMenuItems(); 
  }
  
  onAvatarAction(action) {
    this.$emit("onAvatarAction", action);
  }
}
</script>

<style lang="less">
  .layoutSide__popover {
    width: 100px;
    text-align: center;
    border-radius: 4px;
    .space-align-block {
      .anticon + .layoutSide__popover__text {
        margin-left: 6px;
      }
    }
  }
</style>