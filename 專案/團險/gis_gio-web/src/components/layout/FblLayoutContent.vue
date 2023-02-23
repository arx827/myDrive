<template>
  <div class="main-content">
    <!-- 麵包屑 -->
    <div
      v-if="isShowBreadcrumb"
      class="breadcrumb_wrap"
    >
      <div class="container d-flex align-items-center">
        <div
          v-for="(item, index) in breadcrumbArray"
          :key="index"
          class="d-flex align-items-center"
        >
          <!-- 首頁處理 -->
          <i
            v-if="item == 'index'"
            class="gio-icon gio-icon__home"
          />
          <!-- 間格箭頭 -->
          <i
            v-if="index > 0"
            class="gio-icon gio-icon__nextPage"
          />
          <span
            v-if="item !== 'index'"
            :class="{'breadcrumbLastList': index == breadcrumbArray.length - 1}"
          >{{ item }}</span>
        </div>
      </div>
    </div>
    <!-- main 沒有內容時顯示首頁樣式 -->
    <slot name="layoutContentSlot" />
  </div>
</template>

<script lang="ts">
import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class LayoutContent extends Vue {
  isShowBreadcrumb = false;

  breadcrumbArray: string[] = [];

  /**
 * 監聽
 */
  @Watch('$route', { immediate: true, deep: true })
  watchRoute(newVal) {
    this.isShowBreadcrumb = this.$router.currentRoute.path !== '/' && this.$router.currentRoute.path !== '/index'; // 首頁不顯示
    // 動態判斷麵包屑
    const $type = newVal.params.type;
    this.breadcrumbArray = ($type) ? this.$router.currentRoute.meta.breadcrumb[$type] : this.$router.currentRoute.meta.breadcrumb;
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  flex: 1;
}
.inner-content {
  overflow: initial;
  background: #fff;
  // 設定兩張背景圖
  background: url('~@images/iamge_homeBackground1.svg'),
              url('~@images/iamge_homeBackground2.svg');
  background-position: left 0 bottom 0, right 0 top 0;
  background-repeat: no-repeat;
  background-size: auto 70%;
  height: calc(100vh - 80px - 48px);
}

.breadcrumb_wrap {
  font-size: 12px;
  line-height: 1.5;
  padding: 13px 0;
  background: $COLOR-MAIN8;
}
.gio-icon__nextPage {
  margin-left: 10px;
  margin-right: 10px;
}
.breadcrumbLastList {
  font-weight: 600;
}
</style>
