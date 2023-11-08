<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider
      :width="250"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <slot name="side" />
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '250px', overflow: 'hidden' }">
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
                <a-menu-item
                  v-for="action of avatarActions"
                  :key="action.name"
                >
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
}
</script>

<style>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.inner-content {
  overflow: "initial";
  padding: 24px;
  background: #fff;
  margin: 16px 0px;
  min-height: 100%;
}
</style>
