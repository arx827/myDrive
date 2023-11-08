<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Modal } from 'ant-design-vue';
import ConfigProvider from 'ant-design-vue/lib/config-provider';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import locale from 'ant-design-vue/es/date-picker/locale/zh_TW';

Vue.component(ConfigProvider.name, ConfigProvider);

@Component
export default class App extends Vue {
  locale: locale = zhTW;
}
</script>

<style lang="scss">
@import '@scss/layout.scss';
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
