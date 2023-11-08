<template>
  <div :style="headerHeight">
    <!-- <Loading v-if="getLoading" /> -->
    <Header
      :is-login-page="false"
      @emitChangeHeight="changeHeaderHeight($event)"
    />
    <FblLoading />
    <LayoutContent>
      <template v-slot:layoutContentSlot>
        <router-view />
      </template>
    </LayoutContent>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import zhTW from 'ant-design-vue/es/locale/zh_TW.js';
import FblLayout from '@compononts/layout/FblLayout.vue';
import FblSideMenu from '@compononts/side-menu/FblSideMenu.vue';
import { FblMenuItem } from '@/components/shared/side-menu/model';
import { FblAvatarAction } from '@/components/shared/layout/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import Header from '@compononts/layout/Header.vue';
import LayoutContent from '@compononts/layout/LayoutContent.vue';
import Footer from '@compononts/layout/Footer.vue';
import FblLoading from '@compononts/layout/FblLoading.vue';

@Component({
	components: {
		FblLayout,
		FblSideMenu,
		Header,
		LayoutContent,
		Footer,
		FblLoading,
	},
})
export default class MainPage extends Vue {
  locale = zhTW;

	isShowSecondMenu = false;

	// 目前螢幕寬度
	windowWidth = 0;

	xlWidth = 1199.98;

	changeHeaderHeight(param) {
		this.isShowSecondMenu = param;
	}

	get headerHeight() {
		if (this.windowWidth <= this.xlWidth) {
			// 手機、平板
			return { '--header-height': '50px' };
		}
		return (this.isShowSecondMenu) ? { '--header-height': '133px' } : { '--header-height': '80px' };
	}

  private unsubscribe$ = new Subject<void>();

  public title: string = 'OCCUPATIONALSAFETY';

  public subtitle: string = 'An example Vue project';

  public avatarText: string = '';

  public avatarActions: FblAvatarAction[] = [
  	{
  		name: 'logout',
  		title: '登出',
  	},
  ];

  public menuItems: FblMenuItem[] = [];

  destroyed() {
  	this.unsubscribe$.next();
  	this.unsubscribe$.complete();
  }

  onAvatarAction(action: FblAvatarAction) {
  	switch (action.name) {
  	case 'logout':
  		this.signOut();
  		break;
  	}
  }

  onItemNavigated(item: FblMenuItem) {
  	this.title = item ? item.title : 'OCCUPATIONALSAFETY';
  }

  signOut() {
  	// this.$user.signOut();
  	// this.$router.replace({ path: "/login" });
  }

  // toMenuItem(node: MenuNode): FblMenuItem {
  //   const item = node.item;
  //   return {
  //     key: item.id,
  //     title: item.title,
  //     route: item.route,
  //     uri: item.uri,
  //     children: node.children.map((c) => this.toMenuItem(c)),
  //     disabled: item.isLeaf && !item.enabled,
  //   };
  // }

  /**
   * Hook
   */
  created() {
  	// this.$user.loginState$
  	//   .pipe(takeUntil(this.unsubscribe$))
  	//   .subscribe((state) => {
  	//     if (state && state.me) {
  	//       this.avatarText = state.me.employeeId;
  	//     }
  	//   });

  	// this.$authApi.getAuthorizedMenuTreeUsingGET().then((resp) => {
  	//   const node = resp.data;
  	//   this.menuItems = node.children.map((c) => this.toMenuItem(c));
  	// });

  	// 監聽window size
  	window.addEventListener('resize', () => {
  		this.windowWidth = window.innerWidth;
  	});
  }

  updated() {
  	window.parseWord();
  }

  mounted() {
  	this.windowWidth = window.innerWidth;
  	this.locale.Pagination.items_per_page = '項/頁';
  }

  /**
   * 監聽
   */
  // 手機、平板 側邊選單的遮罩 顯示判斷
  @Watch('$route', { immediate: true, deep: true })
  watchGlobalRoute(newVal) {
  	this.isShowSecondMenu = false;
  }
}
</script>

<style lang="scss" scoped>

</style>
