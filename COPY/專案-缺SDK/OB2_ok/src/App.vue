<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">

import { Vue, Component } from "vue-property-decorator";



@Component

export default class App extends Vue{

  created(){

    let styleConfig = document.createElement('style');

    let fontUrl = `${process.env.VUE_APP_API_BASE_URL}/api/i18n/fontMingWoffDownload`;
    styleConfig.appendChild(document.createTextNode("\
    @font-face {\
        font-family: Fubon;\
        src: url('" + fontUrl + "') format('woff');\
    }\
    #app {\
      font-family: Fubon, Helvetica, Arial, sans-serif;\
    }\
    "));

    document.head.appendChild(styleConfig);

  }

}

</script>

<style lang="less">
#app {
  // font-family: Fubon, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  // color: #2c3e50;
  // font-weight: 600;
  // letter-spacing: 0.1px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
