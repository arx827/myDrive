import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import CutOffConfigDataInfo from '@/pages/cf/CutOffConfig/CutOffConfigDataInfo.vue';
import CutOffConfigPendingInfo from '@/pages/cf/CutOffConfig/CutOffConfigPendingInfo.vue';

@Component({
  components: {
    CutOffConfigDataInfo,
    CutOffConfigPendingInfo,
  },
})
export default class CutOffConfig extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  pendingCount = 0; // 待放行清單筆數

  functionName = 'CutOffConfig';

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [
    this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val,
    this.$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val,
  ]

  /**
   * hook
   */
  created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 判斷要選定哪個子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.currentPageTabList, Object.keys(this.authInfo));
    // 查詢待放行筆數
    // this.getPendingInfoCount();
    this.pendingCount = 0;
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data: any) {
    return validateUtil.isEmpty(data);
  }

  // 取得待放行筆數
  async getPendingInfoCount() {
    this.pendingCount = await this.$cfCommon.getCountApplyInfo(this.functionName, false);
  }
}
