import { Vue, Component } from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import TxDoubleReviewForeignEquity from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignEquity/TxDoubleReviewForeignEquity.vue';
import TxDoubleReviewUnStructuredBond from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignBond/UnStructuredBond/TxDoubleReviewUnStructuredBond.vue';
import TxDoubleReviewExchangeAndTenderBond from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignBond/ExchangeAndTenderBond/TxDoubleReviewExchangeAndTenderBond.vue';
import TxDoubleReviewDomsticBond from '@/pages/cf/TransactionManagement/TxDoubleReview/DomesticBond/TxDoubleReviewDomesticBond.vue';
import TxDoubleReviewStructuredBond from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignBond/StructuredBond/TxDoubleReviewStructuredBond.vue';

@Component({
  components: {
    TxDoubleReviewForeignEquity,
    TxDoubleReviewUnStructuredBond,
    TxDoubleReviewStructuredBond,
    TxDoubleReviewExchangeAndTenderBond,
    TxDoubleReviewDomsticBond,
  },
})
export default class TxDoubleReview extends Vue {
  /**
  * data
  */
  activeKey = null; // 被選取的頁籤

  authInfo = null; // 權限資訊

  foreignEquity = 0; // 國外股票筆數

  structuredBond = 0; // 國內股票筆數

  domesticBond = 0; // 國內債筆數

  nonstructured = 0; // 非結構債筆數

  structured = 0; // 結構債筆數

  exchangeTenderOffer = 0; // tender換券筆數

  functionName = 'doubleReview';

  // 此頁面的全部子頁籤 (for排序子頁籤用)
  currentPageTabList = [
    this.$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val,
    this.$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val,
    this.$cfChildrenTab.childrenTab.STRUCTURE_TAB.val,
    this.$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val,
    this.$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val,
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

  // 取得各頁籤放行筆數
  async getReviewInfoCount() {
    let countList: any = await this.$cfCommon.getCountTxApplyInfo(this.functionName);
    if (!this.isEmpty(countList)) {
      countList.forEach((item, index) => {
        this[item.tabName] = item.count;
      });
    }
  }

  // 頁籤改變
  onTabChange() {
    this.getReviewInfoCount();
  }
}
