<template>
  <a-layout id="components-layout-demo-fixed-sider" :class="{'collapsed': collapsed}">
    <a-layout-sider
      :width="null"
      class="layout__sideWrap"
    >
      <slot name="side" />
    </a-layout-sider>
    <a-layout id="layout-custom-content">
      <a-layout-header :style="{ background: '#fff', padding: 0 }">
        <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          :title="title"
          :sub-title="subtitle"
          @back="back()"
        >
          <template slot="extra">
            <a-dropdown>
              <a-avatar
                size="large"
                :style="{ 'background-color': '#00a2ae' }"
              >
                {{ avatarText }}
              </a-avatar>
              <a-menu slot="overlay">
                <a-menu-item v-for="action of avatarActions" :key="action.name">
                  <a @click="handleAvatarAction(action)">{{ action.title }}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-page-header>
      </a-layout-header>
      <a-layout-content>
        <div class="inner-content">
          <slot name="content" />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FblAvatarAction } from './models';

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
    this.$emit('onAvatarAction', action);
  }

  /**
   * Event
   */
  back() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
#components-layout-demo-fixed-sider {
  --side-width: 256px;
  padding-top: #{$main-header-H}px;
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  // 收合尺寸
  &.collapsed {
    --side-width: 68px;
  }
}

.inner-content {
  padding: 24px;
  background: #fff;
  margin: 16px 0px;
}
.layout__sideWrap {
  width: var(--side-width);
  overflow: auto;
  min-height: calc(100vh - #{$main-header-H}px);
  position: fixed;
  left: 0;
  background: transparent linear-gradient(180deg, nth($COLOR-MAIN-BG-LINEAR, 1) 0%, nth($COLOR-MAIN-BG-LINEAR, 2) 39%, nth($COLOR-MAIN-BG-LINEAR, 3) 100%) 0% 0% no-repeat padding-box;
}

#layout-custom-content {
  margin-left: var(--side-width);
  transition: margin-left 200ms;
  min-height: calc(100vh - #{$main-header-H}px);
}
</style>
