<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <!-- 結果狀態 彈窗 -->
      <loading v-if="getLoading" />
      <Header ref="header" />
      <div class="main-container">
        <Breadcrumb />
        <div class="mainPage">
          <router-view />
        </div>
      </div>
      <Footer />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import Header from '@shared/layout/Header.vue';
import Footer from '@shared/layout/Footer.vue';
import Breadcrumb from '@shared/layout/Breadcrumb.vue';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Loading from '@shared/layout/Loading.vue';

const modalControl = namespace('modalControl');

@Component({
	components: {
		Header,
		Footer,
		Loading,
		Breadcrumb,
		// TimeOut,
	},
})
export default class APP extends Vue {
  @modalControl.Action('setModalState') setModalState;

  unsubscribe$ = new Subject<void>();

  locale = zhTW;

  showGotop = false

  isInitTimeout: boolean = false;

  @Getter getLoading!: boolean;

  @Action('setWindowSize') setWindowSize;

  created() {
  	this.setWindowSize(window.innerWidth);
  	window.addEventListener('resize', () => {
  		this.setWindowSize(window.innerWidth);
  	});
  	// this.$user.loginState$
  	// 	.pipe(takeUntil(this.unsubscribe$))
  	// 	.subscribe((state) => {
  	// 		if (state && state.me) {
  	// 			(this.$refs.timeOut as any).timeOut();
  	// 		}
  	// 	});
  }

  scrollToTop() {
  	window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  signOut() {
  	(this.$refs.timeOut as any).cleanUpTime('signOut');
  }

  destroyed() {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }

  /**
   * 監聽
   */
  @Watch('$route', { immediate: true, deep: true })
  async watchGlobalRoute(newVal) {
  	// 自動清除非動線Storage
  	this.$global.autoClearParamFlat(newVal);
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 52px 0px 26px 0px;
  position: relative;
}

.main-container {
  min-height: calc(100vh - 78px);
  height: auto;
  display: flex;
  flex-direction: column;
}

.container {
  width: 100%;
  padding-right: var(--bs-gutter-x, 8px);
  padding-left: var(--bs-gutter-x, 8px);
  margin-right: auto;
  margin-left: auto;
  @media (min-width: 576px) {
    max-width: 540px;
  }
  @media (min-width: 768px) {
    max-width: 720px;
  }
  @media (min-width: 992px) {
    max-width: 960px;
  }
  @media (min-width: 1280px) {
    max-width: 1280px;
  }
}
</style>
