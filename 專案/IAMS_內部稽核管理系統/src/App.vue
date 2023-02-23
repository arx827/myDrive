<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <!-- 結果狀態 彈窗 -->
      <loading v-if="getLoading" />
      <AnnoucementModal
        :visible="annouceModalShow"
        @closeModal="modalShow"
      />
      <TimeOut
        ref="timeOut"
      />
      <Header
        ref="header"
        @open-modal="modalShow"
        @signOut="signOut"
      />
      <div class="main-container">
        <div is="Breadcrumb" />
        <div class="mainPage">
          <router-view />
        </div>
      </div>
      <GotopButton
        v-if="showGotop"
        @scrollToTop="scrollToTop"
      />
      <ResultModal />
      <ChangeRole
        :visible="getIs403ChangingRole"
        @reloadHeader="reloadHeader"
      />
      <Footer />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import Header from '@/components/shared/layout/Header.vue';
import Footer from '@/components/shared/layout/Footer.vue';
import AnnoucementModal from '@/components/announcement/AnnouncementModal.vue';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ResultModal from '@shared/modal/ControlResultModal.vue';
import TimeOut from '@/components/shared/TimeOut.vue';
import ChangeRole from '@/components/shared/ChangeRole.vue';
import Loading from '@/components/shared/layout/Loading.vue';
import GotopButton from '@/components/shared/button/GotopButton.vue';

const modalControl = namespace('modalControl');

@Component({
	components: {
		Header,
		Footer,
		AnnoucementModal,
		Loading,
		Breadcrumb,
		GotopButton,
		TimeOut,
		ResultModal,
		ChangeRole,
	},
})
export default class APP extends Vue {
  @modalControl.Action('setModalState') setModalState;

  @modalControl.Getter('getResultModal') getResultModal;

  unsubscribe$ = new Subject<void>();

  locale = zhTW;

  showGotop = false

	@Getter getIs403ChangingRole!: boolean;

  @Getter getLoading!: boolean;

  @Action('setWindowSize') setWindowSize;

  // 顯示最新公告
  annouceModalShow = false;

  created() {
  	this.setWindowSize(window.innerWidth);
  	window.addEventListener('resize', () => {
  		this.setWindowSize(window.innerWidth);
  	});
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				(this.$refs.timeOut as any).timeOut();
  			}
  		});
  }

  mounted() {
  	window.addEventListener('scroll', this.handleScroll);
  }

  modalShow() {
  	this.annouceModalShow = !this.annouceModalShow;
  }

  scrollToTop() {
  	window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleScroll() {
  	if (window.scrollY > 1200) {
  		this.showGotop = true;
  	} else {
  		this.showGotop = false;
  	}
  }

  reloadHeader() {
  	(this.$refs.header as any).reloadRole();
  }

  signOut() {
  	(this.$refs.timeOut as any).cleanUpTime();
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
  // @include rwd-xll{
  //   padding: 69px 0px 44px 0px;
  // }
}

.main-container{
  min-height: calc(100vh - 78px);
  height: auto;
  display: flex;
  flex-direction: column;
  // @include rwd-xll{
  //   min-height: calc(100vh - 113px);
  // }
}

</style>
