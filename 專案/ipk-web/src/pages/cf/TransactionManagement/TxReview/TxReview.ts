import { Vue, Component } from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import TxReviewForeignEquity from '@/pages/cf/TransactionManagement/TxReview/ForeignEquity/TxReviewForeignEquity.vue';
import TxReviewForeignBondStructuredNotes from '@/pages/cf/TransactionManagement/TxReview/ForeignBond/StructuredBond/TxReviewForeignBondStructuredNotes.vue';
import TxReviewForeignBondUnStructuredNotes from '@/pages/cf/TransactionManagement/TxReview/ForeignBond/UnStructuredBond/TxReviewForeignBondUnStructuredNotes.vue';
import TxReviewForeignBondExchangeAndTender from '@/pages/cf/TransactionManagement/TxReview/ForeignBond/ExchangeAndTenderBond/TxReviewForeignBondExchangeAndTender.vue';
import TxReviewDomesticBond from '@/pages/cf/TransactionManagement/TxReview/DomesticBond/TxReviewDomesticBond.vue';

@Component({
  components: {
    TxReviewForeignEquity,
    TxReviewForeignBondStructuredNotes,
    TxReviewForeignBondUnStructuredNotes,
    TxReviewForeignBondExchangeAndTender,
    TxReviewDomesticBond,
  },
})
export default class TxReview extends Vue {
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

  functionName = 'review';

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
    // console.log(countList);
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
