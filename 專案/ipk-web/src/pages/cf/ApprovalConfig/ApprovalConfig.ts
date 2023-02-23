import { Vue, Component } from 'vue-property-decorator';

import validateUtil from '@/plugins/util/validateUtil';
import ApprovalConfigDataInfo from '@/pages/cf/ApprovalConfig/ApprovalConfigDataInfo.vue';
import ApprovalConfigPendingInfo from '@/pages/cf/ApprovalConfig/ApprovalConfigPendingInfo.vue';

@Component({
  components: {
    ApprovalConfigDataInfo,
    ApprovalConfigPendingInfo,
  },
})
export default class ApprovalConfig extends Vue {
  /**
   * data
   */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  pendingCount = 0; // 待放行清單筆數

  functionName = 'ApprovalConfig'; // 功能名稱

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

  // 查詢待放行筆數
  async getPendingInfoCount() {
    this.pendingCount = await this.$cfCommon.getCountApplyInfo(this.functionName, false);
  }
}
