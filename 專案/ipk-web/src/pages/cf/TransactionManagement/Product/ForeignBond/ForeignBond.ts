import { Vue, Component } from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';

import UnStructuredNotes from '@product/ForeignBond/UnStructuredBond/UnStructuredNotes.vue';
import StructuredNotes from '@product/ForeignBond/StructuredBond/StructuredNotes.vue';
import ExchangeAndTender from '@product/ForeignBond/ExchangeAndTenderBond/ExchangeAndTender.vue';

@Component({
  components: {
    UnStructuredNotes,
    StructuredNotes,
    ExchangeAndTender,
  },
})
export default class ForeignBond extends Vue {
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [
    this.$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val,
    this.$cfChildrenTab.childrenTab.STRUCTURE_TAB.val,
    this.$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val,
  ]

  /**
   * hook
   */
  created() {
    // 取得子頁籤權限
    this.authInfo = this.$authService.getAuthInfo(this.$route.name);
    // 判斷要選定哪個子頁籤
    this.activeKey = this.$authService.getDefaultActiveTabKey(this.currentPageTabList, Object.keys(this.authInfo));
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data: any) {
    return validateUtil.isEmpty(data);
  }
}
