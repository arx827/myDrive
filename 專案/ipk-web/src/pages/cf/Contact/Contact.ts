import { Vue, Component } from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import ContactDataInfo from '@/pages/cf/Contact/ContactDataInfo.vue';

@Component({
  components: {
    ContactDataInfo,
  },
})
export default class Contact extends Vue {
  /**
  * data
  */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  functionName = 'ContactConfig';

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [
    this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val,
  ]

  /**
   * hook
   */
  // 判斷空值
  isEmpty(data: any) {
    return validateUtil.isEmpty(data);
  }

  created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 判斷要選定哪個子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.currentPageTabList, Object.keys(this.authInfo));
  }
}
