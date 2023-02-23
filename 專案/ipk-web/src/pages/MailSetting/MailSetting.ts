import { Component, Vue } from 'vue-property-decorator';
import MailSettingDataInfo from '@/pages/MailSetting/MailSettingDataInfo.vue';

@Component({
  components: {
    MailSettingDataInfo,
  },
})
export default class MailSetting extends Vue {
  /**
   * data
   */
  tabList = [ // 當前功能子頁籤清單(順序有意義)
    this.$childrenTab.childrenTab.DATA_INFO_TAB.val,
  ];

  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  /**
   * computed
   */
  get showDataInfoTab() {
    return !this.$authService.isEmpty(this.authInfo) && this.authInfo[this.$childrenTab.childrenTab.DATA_INFO_TAB.val];
  }

  /**
   * hook
   */
  created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 選定初始顯示的子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.tabList, Object.keys(this.authInfo));
  }

  /**
   * methods
   */
}
