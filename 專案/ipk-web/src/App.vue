<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';

@Component({ components: {} })
export default class App extends Vue {
  locale = zhTW;
}
</script>

<style lang="less">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
