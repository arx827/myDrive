import { Vue, Component } from 'vue-property-decorator';
import FblLoading from '@/components/shared/layout/FblLoading.vue';
import FblLayout from '@/components/shared/layout/FblLayout.vue';
import FblSideMenu from '@/components/shared/side-menu/FblSideMenu.vue';
import { FblMenuItem } from '@/components/shared/side-menu/model';
import { FblAvatarAction } from '@/components/shared/layout/models';
import { Subject, Subscription, timer } from 'rxjs';
import { MenuNode } from '@fubonlife/ipk-api-axios-sdk';
import { takeUntil } from 'rxjs/operators';
import { Action, Getter } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    FblLayout,
    FblSideMenu,
    FblLoading,
  },
})
export default class MainPage extends Vue {
  @Getter getMenuIdList;

  @Getter getNotice;

  @Action('setLoginInfo') setLoginInfo;

  @Action('setLoading') setLoading;

  @Action('setMenuItem') setMenuItem;

  @Action('setMenuIdList') setMenuIdList;

  @Action('setNotice') setNotice;

  /**
  * data
  */
  public collapsed = false;

  private unsubscribe$ = new Subject<void>();

  public avatarText = '';

  public avatarActions: FblAvatarAction[] = [
    {
      name: 'logout',
      title: '登出',
    },
  ];

  public menuItems: FblMenuItem[] = [];

  public timer: Subscription;

  public needRefresh= false;

  /**
  * hook
  */
   created() {
    this.$user.loginState$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((state) => {
      if (state && state.me) {
        this.avatarText = state.me.domainId;
        this.setLoginInfo(state.me);
      }
    });
    // 取得menu資訊
    this.getAuthorizedMenuTree();
    // 每1分鐘驗證Token
    this.timer = timer(1000, 60000).subscribe(() => {
      this.checkTokenEffect();
      this.searchNoticeCount();
    });
    // 每10分鐘驗證權限是否被更新
    this.timer = timer(600000, 600000).subscribe(() => this.validateAuthorizedMenu());
  }

  mounted() {
    const hander = (event) => {
      this.openSelectByTab(event);
    };
    // 監聽鍵盤keyup事件
    document.addEventListener('keyup', hander);
    this.$once('hook:beforeDestroy', () => document.removeEventListener('keyup', hander, true));
  }

  destroyed() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
  * methods
  */
  // 移動tab鍵，開啟下拉選單
  openSelectByTab(event) {
    if ((event.keyCode === 9 || (event.shiftKey && event.keyCode === 9)) && (event.target as any).className.indexOf('ant-select') > -1) {
      event.target.click();
    }
  }

  // 取得menu資訊
  getAuthorizedMenuTree() {
    this.setLoading(true);
    this.$menuApi.getAuthorizedMenuTreeUsingGET()
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      const node = content;
      // 整理權限資訊至vueX
      this.setMenuItem(node);
      // 儲存初始化選單，權限更新時比對用
      this.$global.setTabParam('tabArray', node);
      // 整理選單資訊
      this.menuItems = node.children ? node.children.map((c) => this.toMenuItem(c)) : [];
      const functionCodeArray = [];
      this.getFuncitonCode(functionCodeArray, node);
      this.setMenuIdList(functionCodeArray);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }).finally(() => {
      this.setLoading(false);
    });
  }

  // header工具列
  onAvatarAction(action: FblAvatarAction) {
    switch (action.name) {
      case 'logout':
        this.signOut();
        break;
    }
  }

  onItemNavigated(item: FblMenuItem) {
    //
  }

  // 登出
  signOut() {
    this.timer.unsubscribe();
    const token = this.$user.loginState.accessToken;
    this.$authApi.logoutUsingPOST({ accessToken: token });
    this.$user.signOut();
    this.$router.replace({ path: '/login' });
    // 清空vueX資訊
    window.location.reload();
  }

  // 驗證 Token
  checkTokenEffect() {
    this.$authApi
      .checkSessionEffectUsingPOST({ needRefresh: this.$user.needRefresh })
      .then((res) => {
        if (res.data.sessionResult === 'N') {
          this.signOut();
          this.$message.warn(
            '此帳號已在其他地方重複登入本平台，此連線中斷，請重新登入系統。',
            10,
          );
        } else if (res.data.sessionResult === 'T') {
          this.signOut();
          this.$message.warn('連線已逾時中斷，請重新登入系統。', 10);
        } else if (res.data.needRefresh) {
            this.$user.signIn(res.data.tokenPair.accessToken);
          }
      })
      .catch(() => {
        this.signOut();
        this.$message.warn('連線已逾時中斷，請重新登入系統。', 10);
      }).finally(() => {
        this.$user.needRefresh = false;
      });
  }

  // 驗證權限是否更新
	validateAuthorizedMenu() {
		this.$menuApi.checkAuthorizedMenuTreeUsingGET()
		.then((res) => {
      const isSuccess = res.data.success;

      // 驗證權限是否被更新非使用者操作行為，因此call API失敗時，不丟錯誤訊息給使用者
      if (!isSuccess) {
        return;
      }

      // content = null 代表權限沒有更新
      // content = {item: null, children: []} 代表權限被更新，且所有選單皆無權限
      if (!validateUtil.isEmpty(res.data) && !validateUtil.isEmpty(res.data.content)) {
        const node = res.data.content;
        // 整理權限資訊至vueX
        this.setMenuItem(node);
      }
		})
		.catch(() => {
			// API失敗
		});
	}

  /**
   * methods
   */
  // 取得訊息通知總筆數
  searchNoticeCount() {
    const dto = {
      functionCode: this.getMenuIdList,
    };
    this.$noticeApi.searchNoticeAndTodoCountUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.setNotice({
          messageNoticeCount: content.messageNoticeCount,
          todoCount: content.todoCount,
          needUpdate: true,
        });
      })
      .catch(() => {
        // API失敗
        // InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
  }

  // 整理選單資訊
  toMenuItem(node: MenuNode): FblMenuItem {
    const item = node.item;
    return {
      key: item.id,
      title: item.title,
      route: item.route,
      uri: item.uri,
      children: node.children.map((c) => this.toMenuItem(c)),
      disabled: item.isLeaf && !item.enabled,
      icon: item.icon,
      breadCrumb: item.breadCrumb,
      isLeaf: item.isLeaf,
      description: item.description,
    };
  }

  // 控制menu選單間距
  handleMenuWrap(data) {
    if (data.icon) {
      return;
    }
    if (this.collapsed) {
      return 'menu-collapsed__wrap';
    }
    switch (data.description) {
      case '1':
        return 'menu-second-item__wrap';
      case '2':
        return 'menu-third-item__wrap';
      case '3':
        return 'menu-fourth-item__wrap';
      case '4':
        return 'menu-fiveth-item__wrap';
    }
  }

  // 取得各功能的functionCode(id)
  getFuncitonCode(functionCodeArray, node: MenuNode) {
    if (node.children && node.children.length === 0) {
      functionCodeArray.push(node.item.id);
    }
    node.children.forEach((subNode) => {
      this.getFuncitonCode(functionCodeArray, subNode);
    });
  }
}
