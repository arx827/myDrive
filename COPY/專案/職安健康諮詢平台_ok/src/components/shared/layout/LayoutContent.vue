<template>
  <div
    id="main__content"
    :class="contentBgColor"
  >
    <Breadcrumb :breadcrumb="{list: breadcrumbArray}" />
    <!-- main 沒有內容時顯示首頁樣式 -->
    <slot name="layoutContentSlot" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';

@Component({
	components: { Breadcrumb },
})
export default class LayoutContent extends Vue {
  contentBgColor = '';

  breadcrumbArray: string[] = [];

  // // 當前router名稱
  // currentRouterName = this.$route.name;

  // @Watch('$route.name')
  // onRouterChanged(val) {
  // this.currentRouterName = val;
  // }

  // mounted() {
  // this.currentRouterName = this.$route.name;
  // }

  updated() {
  	window.parseWord();
  }

  /**
   * 監聽
   */
  @Watch('$route', { immediate: true, deep: true })
  watchRouter(newVal) {
  	// 根據 router 背景色切換
  	this.contentBgColor = this.$router.currentRoute.meta.contentBgColor;

  	// 抓取該頁面router meta 的方法
  	if (this.$router.currentRoute.params.breadcrumb) {
  		this.breadcrumbArray = this.$router.currentRoute.params.breadcrumb as any;
  	} else if (this.$router.currentRoute.meta.breadcrumb) {
  		this.breadcrumbArray = this.$router.currentRoute.meta.breadcrumb;
  	}
  }
}
</script>

<style lang="scss" scoped>
#main__content {
  min-height: calc(100vh - 76px);
  padding: var(--header-height) 0 0;
  background: $COLOR-WHITE;
  // bs 的 container 左右邊界
  --bs-gutter-x: 30px;
  @include rwd-xl {
		--bs-gutter-x: 8px;
	}
  &.mainColor__lightBlue {
    background: $COLOR-MAIN10;
  }
}
</style>
