<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <!-- Vue的進入點 public/index.html -->
      <router-view />
    </div>
  </a-config-provider>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import locale from 'ant-design-vue/es/date-picker/locale/zh_TW';

@Component({
	components: {},
})
export default class APP extends Vue {
  locale: locale = zhTW;

  mounted() {
    this.locale.Pagination.items_per_page = '筆/頁';
  }
}
</script>
<style lang="scss">
@import '~@scss/basic';
@import '~bootstrap/scss/bootstrap';
#app {
  font-family: 'Microsoft JhengHei', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $COLOR-MAIN1;
  min-height: 100%;
}

.ant-table  {
  background: #FFF;
  overflow: hidden;
  > .ant-table-content {
    > .ant-table-body {
      margin: 0;
    }
  }
}

.ant-btn {
  height: auto;
  min-height: 32px;
}

</style>
