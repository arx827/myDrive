<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <WAFModal v-if="getWAFModalSetting.visible" />
      <Loading v-if="getLoading" />
      <Header />
      <div
        id="main__content"
      >
        <router-view />
      </div>
      <Footer />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import ConfigProvider from 'ant-design-vue/lib/config-provider';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import Header from '@/components/shared/layout/Header.vue';
import Footer from '@/components/shared/layout/Footer.vue';
import Loading from '@/components/shared/layout/Loading.vue';
import WAFModal from '@/components/shared/WAFModal.vue';

@Component({
	components: {
		Header, Footer, Loading, WAFModal,
	},
})
export default class App extends Vue {
	locale = zhTW;

	@Getter getLoading!: boolean;

	@Action('setLoading') setLoading;

	@Getter getWAFModalSetting!: WAFModal;

	@Watch('$route', { immediate: true, deep: true })
	async watchGlobalRoute(newVal) {
		if (sessionStorage.param) {
			if (JSON.parse(sessionStorage.param) !== null && sessionStorage.param !== '{}') {
				// 取得 所有 param key
				const paramAllKey = this.$global.getAllParamKey();
				// 取得 所有父層 含自己
				const routeMatched = newVal.matched.filter((i) => i.name != undefined).map((i) => i.name);

				// 取得所有同層
				let routeSibling;
				const loopGetSibling = function (routes) {
					// 先儲存此層所有 name
					const routeNameArray = routes.filter((i) => i.name !== null).map((i) => i.name);
					// 用自己 name 先找到層級
					if (routeNameArray.includes(newVal.name)) {
						// 已找到該層級
						routeSibling = routeNameArray.filter((i) => i !== undefined);
					} else {
						// 將子層再丟進來跑迴圈
						routes.filter((i) => i.children != undefined).map((i) => loopGetSibling(i.children));
					}
				};
				loopGetSibling(this.$router.options.routes);

				// @Watch('$route.path')
				// onRouterChanged() {
				// 	console.log('watch this.$router', this.$route.path);
				// }
				// 所有父層 及 同層 合併，且排除重複
				const matchedAndSibling = [...new Set([...routeMatched, ...routeSibling])];

				// 清除非 當前頁 流程中的 param資料，
				// note: 當route name 為 undefined 時，不算在流程中
				paramAllKey.forEach((i) => {
					if (!matchedAndSibling.includes(i)) {
						const $param = JSON.parse(sessionStorage.param);
						delete $param[i];
						sessionStorage.param = JSON.stringify($param);
					}
				});
			}
		}

		if (document.getElementById('EUDCTopBanner')) {
  		const EUDCTopBannerEl = document.getElementById('EUDCTopBanner');
  		const compStyles = window.getComputedStyle(EUDCTopBannerEl);
  		console.log("compStyles.getPropertyValue('display')", compStyles.getPropertyValue('display'));
  		if (compStyles.getPropertyValue('display') !== 'none') {
  			EUDCTopBannerEl.style.display = 'none';
  		}
  	}
	}

	updated() {
  	window.parseWord();
	}

	mounted() {
		this.locale.Pagination.items_per_page = '筆/頁';
	}
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
	#main__content {
	min-height: calc(100vh - 76px);
	padding: 80px 0 0px 0;
	}
	</style>
