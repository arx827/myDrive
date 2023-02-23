import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import validateUtil from '@/plugins/util/validateUtil';
import IpkIndex from '@/pages/IpkIndex/IpkIndex.vue';

@Component({
  components: {
    Breadcrumb,
    IpkIndex,
  },
})
export default class OuterTab extends Vue {
  @Getter getTabArray!: Array<any>;

  @Getter getKeepAliveList!: Array<any>;

  @Getter getActiveTab!: string;

  @Action('setTabArray') setTabArray;

  @Action('setDelCachedView') setDelCachedView;

  @Action('setActiveTab') setActiveTab;

  /**
  * data
  */
  view = ''; // 要顯示的component

  activeKey = '0'; // 被選取的頁籤(預設首頁)

  breadCrumb = ''; // 當前畫面的麵包屑

  showRouterView = false; // 是否顯示router-view

  /**
  * watch
  */
  @Watch('getTabArray')
  onChanged(newValue) {
    for (let i = 0; i < newValue.length; i++) {
      if (i === (newValue.length - 1)) {
        this.activeKey = newValue[i].key;
      //  this.view = newValue[i].route;
      }
    }
  }

  @Watch('getActiveTab')
  onChangedActiveTab(newValue) {
    this.activeKey = newValue;
  }

  @Watch('activeKey')
  onChangedActiveKey(newValue) {
    this.setActiveTab(newValue);
    // 首頁
    if (newValue === '0') {
      this.goToIndexPage();
      this.showRouterView = false;
      this.breadCrumb = '';
      return;
    }
    // 是否有頁面
    this.getTabArray.forEach((item) => {
      if (item.key === newValue) {
        //  this.view = item.route;
        this.$router.replace({ name: item.route });
        this.breadCrumb = item.breadCrumb;
      }
    });
    this.showRouterView = true;
  }

  @Watch('$route', { immediate: true, deep: true })
  onRouterChanged(newVal) {
    this.geThemeName(newVal);
  }

  /**
   * hook
   */
  created() {
    // 重新整理刷新頁面
    if (this.$route.path !== '/') {
      this.goToIndexPage();
    }
    // 取得已開啟頁籤
    // this.setTabArray(this.$global.getTabParam('tabArray'));
  }

  /**
   * methods
   */
  // 判斷空值
	isEmpty(data) {
		return validateUtil.isEmpty(data);
	}

  // 回到首頁
  goToIndexPage() {
    this.$router.replace('/');
  }

  // 取得目前流程 主題名稱
  geThemeName(val) {
    let themeName = val.path.split('/')[2];
    for (let i = 0; i < this.getTabArray.length; i++) {
      if (this.getTabArray[i].route === themeName) {
        this.activeKey = this.getTabArray[i].key;
      }
      // 首頁
      if (validateUtil.isEmpty(themeName)) {
        this.activeKey = '0';
      }
    }
  }

  // 頁籤改變
  onTabChange(key) {
    // 首頁
    if (key === '0') {
      (this.$refs.home as any).searchAnnouncementList();
      this.goToIndexPage();
    }
  }

  // 頁籤事件(ex: 刪除)
  onEdit(targetKey, action) {
    this[action](targetKey);
  }

  // 關閉頁籤
  remove(targetKey) {
    let activeKey = this.activeKey;
    // keepAlive緩存機制
    for (let i = 0; i < this.getTabArray.length; i++) {
      if (this.getTabArray[i].key === targetKey) {
        let itemPart = this.getTabArray[i].route.split('-');
        let res = '';
        for (let i = 0; i < itemPart.length; i++) {
          res += (itemPart[i][0].toUpperCase() + itemPart[i].slice(1));
        }
        // let res = itemPart[0][0].toUpperCase() + itemPart[0].slice(1) + itemPart[1][0].toUpperCase() + itemPart[1].slice(1);
        this.setDelCachedView(res);
      }
    }
    // 關閉頁籤
    const panes = this.getTabArray.filter((pane) => pane.key !== targetKey);
    this.setTabArray(panes);

    // 判斷頁籤要指向哪頁
    if (panes.length === 0) {
      this.activeKey = '0';
    } else {
      this.activeKey = activeKey;
    }
  }
}
