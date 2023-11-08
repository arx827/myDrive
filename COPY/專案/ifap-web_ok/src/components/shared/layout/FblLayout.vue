<template>
  <a-layout>
    <a-layout-header class="header d-flex">
      <a @click="goHome">
        <img class="ifaplogo" src="~@imgs/logo_fbifap.svg" alt="">
      </a>
      <div class="ml-auto d-flex align-items-center">
        <slot name="menu" />
        <a-dropdown>
          <div class="userInfo ml-auto d-flex align-items-center ant-dropdown-link" @click="e => e.preventDefault()">
            <img class="ifaplogo" src="~@imgs/icon_user.svg" alt="">
            <span class="userInfo__name">{{ avatarText }}</span>
            <a-icon type="caret-down" class="userInfo__arrow" />
          </div>
          <!-- action : { "name": "logout", "title": "登出" } -->
          <a-menu slot="overlay">
            <a-menu-item
              v-for="action of avatarActions"
              :key="action.name"
            >
              <a @click="handleAvatarAction(action)">{{
                action.title
              }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </a-layout-header>
    <a-layout-content class="inner-content">
      <div class="contentSlot">
        <slot name="content" />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FblAvatarAction } from './models';

@Component({})
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
    this.$emit('onAvatarAction', action);
  }

  back() {
    this.$router.go(-1);
  }

  goHome() {
    this.$router.push('/')
  }
}
</script>

<style lang="scss" scoped>
// #components-layout-demo-top {
//   min-height: 100%;
// }
.logo {
  height: 28px;
}

.ant-page-header-heading-title {
  padding: 7px;
}

.inner-content {
  min-height: calc(100vh - 64px);
  background: $COLOR-GRAY7;
}
.contentSlot {
  padding: 0 36px 20px;
  height: calc(100vh - 64px);
}

.header {
  position: relative;
  height: 64px;
  background-color: white;
  padding-left: 36px;
  box-shadow: 0px 3px 6px #00000029; //目前無作用
  z-index: 1;
}

.userInfo {
  cursor: pointer;
}

.userInfo__name {
  margin-left: 10px;
  font-size: 14px;
}
::v-deep .userInfo__arrow {
  font-size: 10px;
  margin-left: 10px;
}
</style>
