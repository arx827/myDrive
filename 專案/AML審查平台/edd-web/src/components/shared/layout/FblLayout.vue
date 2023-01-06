<template>
  <a-layout id="components-layout-demo-fixed-sider">
    
    <a-layout-header id="layout-header-1">
      <span><img class="svg-fubon-logo" src="@/assets/images/fubon-logo.svg"/></span>
      <span>
        <a-dropdown>
          <img class="svg-header-loging" src="@/assets/images/header-loging.svg"/>
          <a-menu slot="overlay">
            <a-menu-item v-for="action of avatarActions" :key="action.name">
              <a @click="handleAvatarAction(action)">{{ action.title }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        {{ avatarText }}
      </span>
    </a-layout-header>
    
    <input type="checkbox" id="sider-toggle" v-model="collapsed" style="display: none">

    <a-layout>
      <a-layout-sider id="layout-sider-1" :width="256" v-model="collapsed">
        <slot name="side"></slot>
      </a-layout-sider>
    </a-layout>

    <a-layout id="layout-custom-content">
      <a-layout-header id="layout-header-2">
        <a-page-header :ghost="false" :title="title" :sub-title="subtitle">
        </a-page-header>
      </a-layout-header>
      <a-layout-content
        class="inner-content"
        :style="{ margin: '0px 10px', background: '#fff'}">
          <slot name="content"></slot>
          <a-layout-footer class="layout__footer">
            <p class="footer__copyright"><span>© Fubon Financial. All Rights Reserved</span><span>本平台網頁標準為 Chrome瀏覽器，1920x1080、1280x1024 兩種解析度</span></p>
          </a-layout-footer>
      </a-layout-content>
    </a-layout>
    
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { FblAvatarAction } from "./models";

@Component({})
export default class FblLayout extends Vue {
  @Prop()
  public collapsed: boolean;
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
  // back() {
  //   this.$router.go(-1);
  // }
}
</script>

<style scoped lang="scss">
$side-width: 256px;
#layout-header-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 25px 2px 60px;
}
#layout-header-1 span {
  display: flex;
}
.svg-header-loging {
  width: 19px;
  margin-right: 7px;
}
#layout-sider-1 {
  background-image: linear-gradient(#63E0C7 30%, #499EE5);    
  height: calc(100% - 60px);
  overflow: auto;
  position: fixed;
}


#layout-header-2 {
  background-color: #F0F2F5;
  padding: 0;
  margin-top: 4px;
}
#layout-custom-content {
  margin-left: $side-width;
  transition: margin-left 200ms;
}
/* #layout-header-2 > div {
  padding: 4px 20px
} */
#sider-toggle:checked ~ #layout-custom-content {
  margin-left: 80px;
}
.inner-content {
  background-color: white;
  overflow: auto;
  position: fixed;
  left: $side-width;
  top: 135px;
  height: calc(100% - 135px);
  min-height: calc(100% - 135px);
  width: calc(100% - #{$side-width});
  transition: left 200ms;
  margin: 0px 17px;
  display: flex;
  flex-direction: column;
  > :not(footer){
    flex: 1;
  }
}
#sider-toggle:checked ~ #layout-custom-content .inner-content {
  left: 80px;
  width: calc(100% - 100px);
}

.layout__footer {
  background: #f0f2f5;
  position: static;
  text-align: center;
  padding: 10px;
  height: auto;
  color: rgba(0,0,0,0.45);
  .footer__copyright {
    margin-bottom: 5px;
    span {
      margin-left: 2.5px;
      margin-right: 2.5px;
    }
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-thumb {
  background: #D9D9D9; 
  box-shadow: inset 0 0 5px #D9D9D9; 
  border-radius: 8px;
}
::-webkit-scrollbar-track {
  background: #F0F2F5;
}
</style>