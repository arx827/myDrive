<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
// import { Getter, Action, State } from 'vuex-class';
import ConfigProvider from 'ant-design-vue/lib/config-provider';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
// import locale from 'ant-design-vue/es/date-picker/locale/zh_TW';
// import Loading from '@/components/shared/layout/Loading.vue';

@Component({})
export default class App extends Vue {
  locale = zhTW;

	isLogin = true;	// 撈取 Vuex 資訊

	isShowSecondMenu = false;

	changeHeaderHeight(param) {
		this.isShowSecondMenu = param;
	}

	get headerHeight() {
		return (this.isShowSecondMenu) ? { '--header-height': '133px' } : { '--header-height': '80px' };
	}

	@Watch('$route', { immediate: true, deep: true })
	async watchGlobalRoute(newVal) {
		if (document.getElementById('EUDCTopBanner')) {
  		const EUDCTopBannerEl = document.getElementById('EUDCTopBanner');
  		const compStyles = window.getComputedStyle(EUDCTopBannerEl);
  		console.log("compStyles.getPropertyValue('display')", compStyles.getPropertyValue('display'));
  		if (compStyles.getPropertyValue('display') !== 'none') {
  			EUDCTopBannerEl.style.display = 'none';
  		}
  	}
		// if (sessionStorage.param) {
		// 	if (JSON.parse(sessionStorage.param) !== null && sessionStorage.param !== '{}') {
		// 		// 取得 所有 param key
		// 		const paramAllKey = this.$global.getAllParamKey();
		// 		// 取得 所有父層 含自己
		// 		const routeMatched = newVal.matched.filter((i) => i.name != undefined).map((i) => i.name);

		// 		// 取得所有同層
		// 		let routeSibling;
		// 		const loopGetSibling = function (routes) {
		// 			// 先儲存此層所有 name
		// 			const routeNameArray = routes.filter((i) => i.name !== null).map((i) => i.name);
		// 			// 用自己 name 先找到層級
		// 			if (routeNameArray.includes(newVal.name)) {
		// 				// 已找到該層級
		// 				routeSibling = routeNameArray.filter((i) => i !== undefined);
		// 			} else {
		// 				// 將子層再丟進來跑迴圈
		// 				routes.filter((i) => i.children != undefined).map((i) => loopGetSibling(i.children));
		// 			}
		// 		};
		// 		loopGetSibling(this.$router.options.routes);

		// 		// 所有父層 及 同層 合併，且排除重複
		// 		const matchedAndSibling = [...new Set([...routeMatched, ...routeSibling])];

	// 		// 清除非 當前頁 流程中的 param資料，
	// 		// note: 當route name 為 undefined 時，不算在流程中
	// 		paramAllKey.forEach((i) => {
	// 			if (!matchedAndSibling.includes(i)) {
	// 				const $param = JSON.parse(sessionStorage.param);
	// 				delete $param[i];
	// 				sessionStorage.param = JSON.stringify($param);
	// 			}
	// 		});
	// 	}
	// }
	}

	// created() {
	// 	// console.log('this.$router', this.$route.path);
	// }

	// @Getter getLoading!: boolean;

	// @Action('setLoading') setLoading;

	mounted() {
	// 	console.log('mounted');
	// 	this.setLoading(true);
	// 	setTimeout(() => {
	// 	  console.log('close');
	// 		this.setLoading(false);
	// 	}, 1000);
	}
}
</script>

<style lang="scss">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
