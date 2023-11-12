<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider
      :width="230"
      :style="{ overflowX: 'auto', overflow:'overlay',height: '100vh', position: 'fixed', left: 0,
      paddingRight:'5px' }"
      theme="dark"
    >
      <slot name="side"></slot>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '230px', overflow: 'hidden' }">
      <!-- 跑馬燈，需要時再引入 -->
      <!-- <Marquee-Message></Marquee-Message> -->
      <a-layout-header :style="{ background: '#BBDDE240', padding: 0 }">
        <a-page-header
          style="border: 1px solid rgb(235, 237, 240); border-bottom:4px rgb(235, 237, 240) solid; padding:0;"
          :title="title"
          :subTitle="subtitle"
        >
          <!-- <template slot="extra">
            <a-dropdown>
              <a-avatar
                size="large"
                :style="{ 'background-color': '#00a2ae' }"
                >{{ avatarText }}</a-avatar
              >
              <a-menu slot="overlay">
                <a-menu-item v-for="action of avatarActions" :key="action.name">
                  <a @click="handleAvatarAction(action)">{{ action.title }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template> -->
        </a-page-header>
      </a-layout-header>
      <a-layout-content style="background:#fff">
        <div class="inner-content">
          <slot name="content"></slot>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FblAvatarAction } from "./models";
// 跑馬燈，需要時再引入
// import MarqueeMessage from "@/components/shared/marquee/Marquee.vue";

@Component({
  components: {
    // MarqueeMessage,
  },
})
export default class FblLayout extends Vue {
  @Prop()
  public title: string;
  @Prop()
  public subtitle: string;
  @Prop()
  public avatarText: string;
  @Prop()
  public avatarActions: FblAvatarAction[];

  handleAvatarAction(action: FblAvatarAction) {
    this.$emit("onAvatarAction", action);
  }
}
</script>

<style scope>

.inner-content {
  overflow: "initial";
  padding: 0px;
  background: #fff;
  margin: 0px 0px;
  min-height: 100%;
}

.ant-page-header-content{
  padding: 0px;
}

.ant-layout-header, .ant-page-header-heading{
  height: 50px;
  padding: 8px 20px;
}

</style>