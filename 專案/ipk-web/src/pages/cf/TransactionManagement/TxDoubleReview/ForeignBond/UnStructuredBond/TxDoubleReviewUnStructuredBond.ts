import { Vue, Component } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ForeignCheckInfoModal from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignCheckInfoModal.vue';
import ManageFile from './ManageFileModal.vue';

@Component({
  components: {
    AdvancedSearch,
    ForeignCheckInfoModal,
    IpkVxeTable,
    CustomizationModal,
    ManageFile,
    IpkButton,
  },
})
export default class TxDoubleReviewUnStructuredBond extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * data
  */
  rejectReason = ''; // [退回原因] 退回內容

  modalCustomizationShow = false; // [退回原因] modal開關

  reviewDto = { // 覆核(退回)資訊
    txCode: [],
    cfStatus: undefined,
    rejectReason: undefined,
  };

  form = {
    txCode: undefined, // 交易編號
    tradeDate: undefined, // 交易日
    settleDate: undefined, // 券交割日
    currency: undefined, // 幣別
    counterpartyId: undefined, // 交易對手
    bsType: undefined, // 交易別
    cutOffDatetime: undefined, // 保銀放行日期
    cfStatus: [this.$cfEnum.cfStatusEnum.find((i) => i.key === '已初核').val], // 交易確認狀態 預設已初核
    apvlAttachmentStatus: undefined, // 附件狀態
    applyDate: undefined, // 送審日期
    applyId: undefined, // 送審人員
  }

  formRules = { // 進階查詢驗證規則
    tradeDate: [
      {
        required: true,
        validator: this.validateTradeDate,
        trigger: 'change',
      },
    ],
  };

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄已點選的排序

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    tableHeight: '388px',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    checkboxConfig: {
      showHeader: true,
      strict: true,
    },
    columns: [
      {
        type: 'checkbox',
        fixed: 'left',
        align: 'center',
        width: 60,
      },
      {
        title: '交易編號',
        field: 'txCode',
        fixed: 'left',
        width: 160,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: { default: 'link' },
      },
      {
        title: '交易確認狀態',
        field: 'cfStatus',
        fixed: 'left',
        width: 130,
        visible: true,
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$cfEnum.getObject('cfStatusEnum', row.cfStatus).color,
                text: this.$cfEnum.getObject('cfStatusEnum', row.cfStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '簽核權限',
        field: 'apvlLevel',
        fixed: 'left',
        width: 120,
        visible: true,
        formatter: (data) => {
          if (data.cellValue) {
            return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
          } return '';
        },
      },
      {
        title: '附件狀態',
        field: 'apvlAttachmentStatus',
        fixed: 'left',
        width: 140,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
        },
      },
      {
        title: '債券標的(ISIN)',
        field: 'bondCode',
        width: 140,
        visible: true,
      },
      {
        title: '交易日',
        field: 'tradeDate',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
        width: 100,
      },
      {
        title: '券交割日',
        field: 'settleDate',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 100,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '交易對象',
        field: 'counterpartyId',
        width: 300,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '幣別',
        field: 'currency',
        width: 80,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '買/賣成交面額',
        field: 'tradeNpa',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '買入/賣出價格',
        field: 'tradePrice',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '除息金額',
        field: 'apDealAmount',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '前手息',
        field: 'apAiAmount',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '手續費',
        field: 'apTaxAmount',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: 'Commission',
        field: 'commission',
        width: 160,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '前手稅',
        field: 'apTax',
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '交割款項',
        field: 'paymentAmount',
        width: 140,
        visible: true,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '債券保管',
        field: 'custodian',
        width: 120,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '保銀放行日期',
        field: 'cutOffDate',
        width: 160,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '保銀放行時間',
        field: 'cutOffTime',
        width: 140,
      },
      {
        title: '送審人員',
        field: 'applyId',
        width: 100,
      },
      {
        title: '送審日期',
        field: 'applyDate',
        width: 160,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '初核人員',
        field: 'reviewId',
        width: 100,
      },
      {
        title: '初核日期',
        field: 'reviewDate',
        width: 160,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '交易編號', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '交易日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '券交割日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易對象', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '交易別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '保銀放行日期', placeholder: 'yyyy/mm/dd HH:mm', type: 'datePicker', showTime: true, showTimeFormat: 'HH:mm',
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '附件狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '送審日期', placeholder: 'yyyy/mm/dd', type: 'datePicker',
    },
    {
      label: '送審人員', placeholder: '請輸入', type: 'inputText', maxlength: 5,
    },
  ]

  selectedRowList = []; // 已選取的待放行清單項目

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  modalManageFileShow = false; // [附件管理彈窗] modal開關

  /** 前台成交資訊 */
  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: { key: undefined, label: '交易編號', type: 'inputText' },
    cfStatus: { key: undefined, label: '交易狀態', type: 'badge' },
    bsType: { key: undefined, label: '交易別', type: 'inputText' },
    invCategoryName: { key: undefined, label: '資產類別', type: 'inputText' },
    bondCode: { key: undefined, label: '債券標的(ISIN)', type: 'inputText' },
    tradeDate: { key: undefined, label: '交易日', type: 'date' },
    settleDate: { key: undefined, label: '券交割日', type: 'date' },
    paymentSettleDate: { key: undefined, label: '款交割日', type: 'date' },
    currency: { key: undefined, label: '幣別', type: 'inputText' },
    tradeNpa: { key: undefined, label: '買/賣成交面額', type: 'inputText' },
    tradePrice: { key: undefined, label: '買入/賣出價格', type: 'inputText' },
    apDealAmount: { key: undefined, label: '除息金額', type: 'inputText' },
    apAiAmount: { key: undefined, label: '前手息', type: 'inputText' },
    apTax: { key: undefined, label: '前手稅', type: 'inputText' },
    apTaxAmount: { key: undefined, label: '手續費', type: 'inputText' },
    commission: { key: undefined, label: 'Commission', type: 'inputText' },
    paymentAmount: { key: undefined, label: '交割款項', type: 'inputText' },
    counterpartyId: { key: undefined, label: '交易對象', type: 'inputText' },
    tradeDirection: { key: undefined, label: '收/付款', type: 'inputText' },
    actCurrency: { key: undefined, label: '實際交割幣別', type: 'inputText' },
    actRate: { key: undefined, label: '實際交割匯率', type: 'inputText' },
    actAmount: { key: undefined, label: '實際交割金額', type: 'inputText' },
    ap: { key: undefined, label: '會計分類', type: 'inputText' },
    asName: { key: undefined, label: '資產區隔', type: 'inputText' },
    custodian: { key: undefined, label: '債券保管', type: 'inputText' },
    memo: { key: undefined, label: '備註', type: 'inputText' },
    apvlLevel: { key: undefined, label: '簽核權限', type: 'inputText' },
    updateId: { key: undefined, label: '作業人員', type: 'inputText' },
    updateDate: { key: undefined, label: '作業日期', type: 'dateTime' },
  };

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    tradeDealYield: { key: undefined, label: '買入/賣出殖利率', type: 'inputText' },
    tradeSpread: { key: undefined, label: '買入/賣出Spread', type: 'inputText' },
    issuer: { key: undefined, label: '發行公司/所屬國家', type: 'inputText' },
    issueCountry: { key: undefined, label: '所屬國家', type: 'inputText' },
    bondName: { key: undefined, label: '債券名稱', type: 'inputText' },
    sector: { key: undefined, label: '產業別/國家Asset Class', type: 'inputText' },
    creditRating: { key: undefined, label: '信用評等', type: 'inputText' },
    otherNotation: { key: undefined, label: '其他申明(註)', type: 'inputText' },
    isTradePurpose: { key: undefined, label: '是否為交易目的', type: 'inputText' },
    isOtc: { key: undefined, label: '是否為境內掛牌', type: 'inputText' },
    isStakeholder: { key: undefined, label: '是否為利害關係人', type: 'inputText' },
    oldPortfolio: { key: undefined, label: '舊Portfolio', type: 'inputText' },
    trader: { key: undefined, label: '交易員', type: 'inputText' },
    confirmManager1: { key: undefined, label: '放行主管1', type: 'inputText' },
    confirmManager2: { key: undefined, label: '放行主管2', type: 'inputText' },
    confirmManager3: { key: undefined, label: '放行主管3', type: 'inputText' },
    confirmStatus: { key: undefined, label: '覆核狀態', type: 'inputText' },
    isSppi: { key: undefined, label: '是否通過SPPI測試', type: 'inputText' },
    guarantor: { key: undefined, label: '保證人(Guarantor)', type: 'inputText' },
    issueDate: { key: undefined, label: '債券發行日', type: 'date' },
    maturityDate: { key: undefined, label: '債券到期日', type: 'date' },
    rateType: { key: undefined, label: '固定/浮動利率', type: 'inputText' },
    couponRate: { key: undefined, label: '票面利率', type: 'inputText' },
    dividendFreq: { key: undefined, label: '付息頻率', type: 'inputText' },
    factor: { key: undefined, label: 'Factor', type: 'inputText' },
    currentNpa: { key: undefined, label: '目前面額', type: 'inputText' },
    years: { key: undefined, label: '存續期間(YEARS)', type: 'inputText' },
    tradeCouponRate: { key: undefined, label: '買入/賣出票面利率(Coupon)', type: 'inputText' },
    isPrivate: { key: undefined, label: '是否為私募', type: 'inputText' },
  };

  /** 收付款資訊 */
  ssi: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    safekeepingAccount: { key: undefined, label: '保管銀行帳號', type: 'inputText' },
    fbPayAccount: { key: undefined, label: '我方付款帳號', type: 'inputText' },
    fbSettlementLocation: { key: undefined, label: '我方Settlement Location', type: 'inputText' },
    fbClearerId: { key: undefined, label: '我方SSI', type: 'inputText' },
    fbClearerIdAccount: { key: undefined, label: '我方SSI Sub. Account', type: 'inputText' },
    cpSettlementLocation: { key: undefined, label: '交易對手Settlement Location', type: 'inputText' },
    cpClAgentCode: { key: undefined, label: '交易對手SSI', type: 'inputText' },
    cpBrokerAccount: { key: undefined, label: '交易對手sub account', type: 'inputText' },
    cpBfAccount: { key: undefined, label: '交易對手付款帳號', type: 'inputText' },
    cpBfBankCode: { key: undefined, label: '受款銀行代碼', type: 'inputText' },
    cpBfBankName: { key: undefined, label: '受款銀行名稱', type: 'inputText' },
    cpBfAccountName: { key: undefined, label: '受款人名稱', type: 'inputText' },
    cpImBankCode: { key: undefined, label: '交易對手中間行代碼', type: 'inputText' },
    cpImBankName: { key: undefined, label: '交易對手中間行名稱', type: 'inputText' },
    cpRemark: { key: undefined, label: 'Special Instruction', type: 'inputText' },
  };

  /** 上傳附件 */
  attachmentInfo = []; // 已儲存後端的上傳資料

  invCategoryCode = null;

  // checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  // isPending = false; // 是否從待放行清單點擊檢視

  /**
   * computed
   */
  // sass取得table高度
  get tableHeight() {
    return this.ipkGrid.tableHeight;
  }

  /**
   * hook
   */
  async created() {
    this.form.tradeDate = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
    this.labelList.find((el) => el.label === '幣別').options = currencyOption;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOption;
    this.labelList.find((el) => el.label === '交易別').options = this.$cfEnum.transactionOption;
    this.labelList.find((el) => el.label === '交易別').allOptions = this.$cfEnum.transactionOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '附件狀態').options = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '附件狀態').allOptions = this.$cfEnum.attachmentStatusOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得交易狀態下拉選單
  getStatusOption() {
    let cfStatusOption = [];
    this.$cfEnum.cfStatusEnum.forEach((item) => {
      if (!this.isEmpty(item.val)) {
        cfStatusOption.push({
          label: item.key,
          value: item.val,
        });
      }
    });
    return cfStatusOption;
  }

  resetDetailData() {
    /** 前台成交資訊 */
    this.main = {
      txCode: { key: undefined, label: '交易編號', type: 'textarea' },
      cfStatus: { key: undefined, label: '交易狀態', type: 'badge' },
      bsType: { key: undefined, label: '交易別', type: 'textarea' },
      invCategoryName: { key: undefined, label: '資產類別', type: 'textarea' },
      bondCode: { key: undefined, label: '債券標的(ISIN)', type: 'textarea' },
      tradeDate: { key: undefined, label: '交易日', type: 'date' },
      settleDate: { key: undefined, label: '券交割日', type: 'date' },
      paymentSettleDate: { key: undefined, label: '款交割日', type: 'date' },
      currency: { key: undefined, label: '幣別', type: 'textarea' },
      tradeNpa: { key: undefined, label: '買/賣成交面額', type: 'textarea' },
      tradePrice: { key: undefined, label: '買入/賣出價格', type: 'textarea' },
      apDealAmount: { key: undefined, label: '除息金額', type: 'textarea' },
      apAiAmount: { key: undefined, label: '前手息', type: 'textarea' },
      apTax: { key: undefined, label: '前手稅', type: 'textarea' },
      apTaxAmount: { key: undefined, label: '手續費', type: 'textarea' },
      commission: { key: undefined, label: 'Commission', type: 'textarea' },
      paymentAmount: { key: undefined, label: '交割款項', type: 'textarea' },
      counterpartyId: { key: undefined, label: '交易對象', type: 'textarea' },
      tradeDirection: { key: undefined, label: '收/付款', type: 'textarea' },
      actCurrency: { key: undefined, label: '實際交割幣別', type: 'textarea' },
      actRate: { key: undefined, label: '實際交割匯率', type: 'textarea' },
      actAmount: { key: undefined, label: '實際交割金額', type: 'textarea' },
      ap: { key: undefined, label: '會計分類', type: 'textarea' },
      asName: { key: undefined, label: '資產區隔', type: 'textarea' },
      custodian: { key: undefined, label: '債券保管', type: 'textarea' },
      memo: { key: undefined, label: '備註', type: 'textarea' },
      apvlLevel: { key: undefined, label: '簽核權限', type: 'textarea' },
      updateId: { key: undefined, label: '作業人員', type: 'textarea' },
      updateDate: { key: undefined, label: '作業日期', type: 'dateTime' },
    };

    /** 其他成交資訊 */
    this.other = {
      tradeDealYield: { key: undefined, label: '買入/賣出殖利率', type: 'inputText' },
      tradeSpread: { key: undefined, label: '買入/賣出Spread', type: 'inputText' },
      issuer: { key: undefined, label: '發行公司/所屬國家', type: 'inputText' },
      issueCountry: { key: undefined, label: '所屬國家', type: 'inputText' },
      bondName: { key: undefined, label: '債券名稱', type: 'inputText' },
      sector: { key: undefined, label: '產業別/國家Asset Class', type: 'inputText' },
      creditRating: { key: undefined, label: '信用評等', type: 'inputText' },
      otherNotation: { key: undefined, label: '其他申明(註)', type: 'inputText' },
      isTradePurpose: { key: undefined, label: '是否為交易目的', type: 'inputText' },
      isOtc: { key: undefined, label: '是否為境內掛牌', type: 'inputText' },
      isStakeholder: { key: undefined, label: '是否為利害關係人', type: 'inputText' },
      oldPortfolio: { key: undefined, label: '舊Portfolio', type: 'inputText' },
      trader: { key: undefined, label: '交易員', type: 'inputText' },
      confirmManager1: { key: undefined, label: '放行主管1', type: 'inputText' },
      confirmManager2: { key: undefined, label: '放行主管2', type: 'inputText' },
      confirmManager3: { key: undefined, label: '放行主管3', type: 'inputText' },
      confirmStatus: { key: undefined, label: '覆核狀態', type: 'inputText' },
      isSppi: { key: undefined, label: '是否通過SPPI測試', type: 'inputText' },
      guarantor: { key: undefined, label: '保證人(Guarantor)', type: 'inputText' },
      issueDate: { key: undefined, label: '債券發行日', type: 'inputText' },
      maturityDate: { key: undefined, label: '債券到期日', type: 'inputText' },
      rateType: { key: undefined, label: '固定/浮動利率', type: 'inputText' },
      couponRate: { key: undefined, label: '票面利率', type: 'inputText' },
      dividendFreq: { key: undefined, label: '付息頻率', type: 'inputText' },
      factor: { key: undefined, label: 'Factor', type: 'inputText' },
      currentNpa: { key: undefined, label: '目前面額', type: 'inputText' },
      years: { key: undefined, label: '存續期間(YEARS)', type: 'inputText' },
      tradeCouponRate: { key: undefined, label: '買入/賣出票面利率(Coupon)', type: 'inputText' },
      isPrivate: { key: undefined, label: '是否為私募', type: 'inputText' },
    };

    /** 收付款資訊 */
    this.ssi = {
      safekeepingAccount: { key: undefined, label: '保管銀行帳號', type: 'inputText' },
      fbPayAccount: { key: undefined, label: '我方付款帳號', type: 'inputText' },
      fbSettlementLocation: { key: undefined, label: '我方Settlement Location', type: 'inputText' },
      fbClearerId: { key: undefined, label: '我方SSI', type: 'inputText' },
      fbClearerIdAccount: { key: undefined, label: '我方SSI Sub. Account', type: 'inputText' },
      cpSettlementLocation: { key: undefined, label: '交易對手Settlement Location', type: 'inputText' },
      cpClAgentCode: { key: undefined, label: '交易對手SSI', type: 'inputText' },
      cpBrokerAccount: { key: undefined, label: '交易對手sub account', type: 'inputText' },
      cpBfAccount: { key: undefined, label: '交易對手付款帳號', type: 'inputText' },
      cpBfBankCode: { key: undefined, label: '受款銀行代碼', type: 'inputText' },
      cpBfBankName: { key: undefined, label: '受款銀行名稱', type: 'inputText' },
      cpBfAccountName: { key: undefined, label: '受款人名稱', type: 'inputText' },
      cpImBankCode: { key: undefined, label: '交易對手中間行代碼', type: 'inputText' },
      cpImBankName: { key: undefined, label: '交易對手中間行名稱', type: 'inputText' },
      cpRemark: { key: undefined, label: 'Special Instruction', type: 'inputText' },
    };
  }

  // 資訊明細_依資產類別 轉換 版型代號
  getInvCategoryCodeCompType(invCategoryCode) {
    // 取得字元開頭
    switch (true) {
      case /932/.test(invCategoryCode):
        return 'D';
      case /^[4-7K]/.test(invCategoryCode):
        return 'A';
      case /^B/.test(invCategoryCode):
        return 'B';
      case /^[9A]/.test(invCategoryCode):
        return 'C';
    }
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchTxReviewDto() {
    let dto = {
      applyDate: this.isEmpty(this.advancedSearchForm.applyDate) ? null : moment(this.advancedSearchForm.applyDate).format('YYYYMMDD'),
      applyId: this.isEmpty(this.advancedSearchForm.applyId) ? undefined : this.advancedSearchForm.applyId,
      apvlAttachmentStatus: this.isEmpty(this.advancedSearchForm.apvlAttachmentStatus) ? undefined : this.advancedSearchForm.apvlAttachmentStatus,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      cutOffDatetime: this.isEmpty(this.advancedSearchForm.cutOffDatetime) ? null : moment(this.advancedSearchForm.cutOffDatetime).format('YYYYMMDD HHmm'),
      settleEndDate: this.isEmpty(this.advancedSearchForm.settleDate) ? null : moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD'),
      settleStartDate: this.isEmpty(this.advancedSearchForm.settleDate) ? null : moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD'),
      tradeEndDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? null : moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD'),
      tradeStartDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? null : moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD'),
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
    };
    return dto;
  }

  // API: 進階查詢
  searchTxDoubleReview(dto) {
    this.setLoading(true);
    this.$txDoubleReview.nonstructureSearchTxDoubleReviewInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

      if (!this.isEmpty(content)) {
        this.ipkGrid.data = content;
      }

      // 取得各頁籤放行筆數
      this.$emit('getReviewInfoCount');
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 查詢已送審交易資訊明細
  searchTxDoubleReviewDetail(txCode: string) {
    this.setLoading(true);
    this.resetDetailData(); // 初始化
    this.$txDoubleReview.nonstructureSearchTxDoubleReviewDetailUsingPOST({ txCode })
    .then((res) => {
      const content = res.data.content;
      if (!this.isEmpty(content)) {
        // 先判斷資產類別
        const invCategoryCodeCompType = this.getInvCategoryCodeCompType(content.main.invCategoryCode);
        // 整理前台成交資訊
        this.setMainInitInfo(content.main, invCategoryCodeCompType);
        // 整理其他成交資訊
        this.setOtherInitInfo(content.other, invCategoryCodeCompType);
        // 整理收付款資訊
        this.setSsiInitInfo(content.ssi);
        // 上傳附件
        this.setUploadList(content.attachment);
      }
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 驗證交易確認狀態
  validateBeforeModifyCfStatus(dto) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.nonstructureCheckBeforeModifyCfStatusUsingPOST(dto)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
          reject();
      })
      .finally(() => {
        this.setLoading(false);
      });
    });
  }

  // API: 異動交易確認狀態
  modifyCfStatus(dto) {
    this.setLoading(true);
    this.$txDoubleReview.nonstructureModifyCfStatusUsingPATCH(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 關閉檢視彈窗
      this.closeCheckInfoModal();
      this.closeCustomizationModal();

      InfoModal.alertSuccess({
        title: this.$cfMessageEnum.REVIEW_SUCCESS?.title,
        confirm: false,
        content: message,
        onCallback: () => {
          this.handleSearch();
        },
      });
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 整理前台成交資訊
  setMainInitInfo(main, invCategoryCodeCompType) {
    if (this.isEmpty(main)) {
      return;
    }

    // 為了欄位順序，所以使用刪去法

    this.main.cfStatus.key = main.cfStatus; // 交易確認狀態
    this.main.txCode.key = main.txCode; // 交易編號
    this.main.bsType.key = main.bsType; // 交易別
    this.main.invCategoryName.key = main.invCategoryName; // 資產類別
    this.main.bondCode.key = main.bondCode; // 債券標的(ISIN)
    this.main.tradeDate.key = main.tradeDate; // 交易日
    this.main.settleDate.key = main.settleDate; // 券交割日
    this.main.paymentSettleDate.key = main.paymentSettleDate; // 款交割日
    this.main.currency.key = main.currency; // 幣別
    this.main.tradeNpa.key = transferUtil.transferPrice(main.tradeNpa); // 買/賣成交面額
    this.main.tradePrice.key = transferUtil.transferPrice(main.tradePrice); // 買入/賣出價格
    this.main.apDealAmount.key = transferUtil.transferPrice(main.apDealAmount); // 除息金額
    this.main.apAiAmount.key = transferUtil.transferPrice(main.apAiAmount) || '0'; // 前手息
    this.main.apTax.key = transferUtil.transferPrice(main.apTax) || '0'; // 前手稅
    this.main.apTaxAmount.key = transferUtil.transferPrice(main.apTaxAmount) || '0'; // 手續費
    this.main.commission.key = main.commission || '0'; // Commission

    if (['B', 'C', 'D'].includes(invCategoryCodeCompType)) {
      delete this.main.apTax;
      delete this.main.apTaxAmount;
      delete this.main.commission;
    }

    this.main.paymentAmount.key = transferUtil.transferPrice(main.paymentAmount); // 交割款項
    this.main.counterpartyId.key = main.counterpartyId; // 交易對象
    this.main.tradeDirection.key = main.tradeDirection; // 收/付款

    if (['A', 'B', 'C'].includes(invCategoryCodeCompType)) {
      delete this.main.tradeDirection;
    }

    this.main.actCurrency.key = main.actCurrency; // 實際交割幣別
    this.main.actRate.key = main.actRate; // 實際交割匯率
    this.main.actAmount.key = transferUtil.transferPrice(main.actAmount); // 實際交割金額
    this.main.ap.key = main.ap; // 會計分類
    this.main.asName.key = main.asName; // 資產區隔
    this.main.custodian.key = main.custodian; // 債券保管
    this.main.memo.key = main.memo; // 備註
    this.main.apvlLevel.key = main.apvlLevel ? this.$cfEnum.getKey('apvlLevelEnum', main.apvlLevel) : main.apvlLevel; // 簽核權限
    this.main.updateId.key = main.updateId; // 作業人員
    this.main.updateDate.key = main.updateDate; // 作業日期

    this.invCategoryCode = main.invCategoryCode;
  }

  // 整理其他成交資訊
  setOtherInitInfo(other, invCategoryCodeCompType) {
    if (this.isEmpty(other)) {
      return;
    }
    Object.entries(other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;
        if (key === 'couponRate') {
          this.other[key].key = typeof (item) === 'number' ? `${item}%` : '';
        }
        if (key === 'tradeDealYield') {
          this.other[key].key = item && this.invCategoryCode !== '932' ? `${item}%` : item;
        }
        if (key === 'confirmStatus') {
          this.other[key].key = item ? this.$cfEnum.getKey('confirmStatusEnum', item) : '';
        }
        if (key === 'maturityDate' || key === 'issueDate') {
          this.other[key].key = moment(item).format('YYYY/MM/DD');
        }
        if (key === 'dividendFreq') {
          this.other[key].key = this.$cfEnum.getLabel('dividendFreqOption', item);
        }
      }
    });

    switch (invCategoryCodeCompType) {
      case 'A':
        delete this.other.issueCountry;
        delete this.other.guarantor;
        delete this.other.issueDate;
        delete this.other.maturityDate;
        delete this.other.rateType;
        delete this.other.couponRate;
        delete this.other.dividendFreq;
        delete this.other.factor;
        delete this.other.currentNpa;
        delete this.other.years;
        delete this.other.tradeCouponRate;
        delete this.other.isPrivate;
        break;
      case 'B':
        delete this.other.tradeSpread;
        delete this.other.bondName;
        delete this.other.factor;
        delete this.other.currentNpa;
        delete this.other.years;
        delete this.other.tradeCouponRate;
        delete this.other.isPrivate;
        break;
      case 'C':
        delete this.other.tradeSpread;
        delete this.other.bondName;
        delete this.other.sector;
        delete this.other.isOtc;
        delete this.other.guarantor;
        delete this.other.issueDate;
        delete this.other.maturityDate;
        delete this.other.tradeCouponRate;
        delete this.other.isPrivate;
        break;
      case 'D':
        delete this.other.tradeSpread;
        delete this.other.issueCountry;
        delete this.other.sector;
        delete this.other.isTradePurpose;
        delete this.other.isOtc;
        delete this.other.oldPortfolio;
        delete this.other.confirmStatus;
        delete this.other.isSppi;
        delete this.other.guarantor;
        delete this.other.issueDate;
        delete this.other.maturityDate;
        delete this.other.rateType;
        delete this.other.couponRate;
        delete this.other.dividendFreq;
        delete this.other.factor;
        delete this.other.currentNpa;
        delete this.other.years;
        break;
    }
  }

  // 整理收付款資訊
  setSsiInitInfo(ssi) {
    if (this.isEmpty(ssi)) {
      return;
    }
    Object.entries(ssi).forEach(([key, item], index) => {
      if (!this.isEmpty(this.ssi[key])) {
        this.ssi[key].key = item;
      }
    });
  }

  // 整理附件上傳
  setUploadList(attachment) {
    this.attachmentInfo = [];
    if (this.isEmpty(attachment)) {
      return;
    }
    const empDomain = (this.getLoginInfo as any).domainId;
    attachment.forEach((file) => {
      this.attachmentInfo.push({
        ...file,
        uid: file.attachmentId,
        name: file.attachmentName,
        isDownload: true,
        isRemoved: empDomain !== file.createId, // 非自己上傳，不得刪除
      });
    });
  }

  /**
   * Event
   */
  // 查詢table資料
  handleSearch() {
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    const dto = this.setSearchTxReviewDto();
    this.searchTxDoubleReview(dto);
  }

  // 表格欄位排序改變
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchTxReviewDto();
    this.searchTxDoubleReview(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = true;
    // 查詢成交資訊明細
    this.searchTxDoubleReviewDetail(e.formData.txCode);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 關閉 退回原因彈窗
  closeCustomizationModal() {
    this.modalCustomizationShow = false;
    this.rejectReason = null;
  }

  // 退回原因彈窗送出
  submitReturn() {
    // 驗證退回原因
    if (this.isEmpty(this.rejectReason)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.REJECT_REASON_REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.rejectReason = this.rejectReason;
    this.closeCustomizationModal();
    this.modifyCfStatus(this.reviewDto);
  }

  // 點擊附件管理
  handleManageFile() {
    this.modalManageFileShow = true;
  }

  // 整批退回
  async handleReturnList(action: string) {
    this.reviewDto.txCode = [];
    this.reviewDto.cfStatus = action;
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.reviewDto.txCode.push(this.selectedRowList[i].txCode);
    }
    // 驗證: 後台檢查若勾選的交易確認狀態非「已初核」或「已確認」，以提示訊息「勾選了狀態不符的交易，請確認」
    let res = await this.validateBeforeModifyCfStatus(this.reviewDto) as any;
    if (!res.success) {
      InfoModal.alertError({ confirm: false, content: res.message });
      return;
    }
    // 打開拒絕彈窗
    this.modalCustomizationShow = true;
  }

  // 單筆退回
  async handleReturn(e: any) {
    this.reviewDto.txCode = e.txCode;
    this.reviewDto.cfStatus = e.cfStatus;
    // 驗證: 後台檢查交易確認狀態非「已初核」或「已確認」，以提示訊息「狀態不符不可退回」
    let res = await this.validateBeforeModifyCfStatus(this.reviewDto) as any;
    if (!res.success) {
      InfoModal.alertError({ confirm: false, content: res.message });
      return;
    }
    // 打開拒絕彈窗
    this.modalCustomizationShow = true;
  }

  // 整批放行
  async handleReviewList(action: string) {
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 驗證: 後台檢查若勾選的交易確認狀態非「已初核」，以提示訊息「勾選了狀態不符的交易，請確認」
    let dto = { txCode: txCodeList, cfStatus: action };
    let res = await this.validateBeforeModifyCfStatus(dto) as any;
    if (!res.success) {
      InfoModal.alertError({ confirm: false, content: res.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
      onCallback: () => {
        this.modifyCfStatus(dto);
      },
    });
  }

  // 單筆放行
  async handleReview(e: any) {
    // 驗證: 後台檢查若交易確認狀態非「已初核」，以提示訊息「狀態不符不可放行」
    let dto = { txCode: e.txCode, cfStatus: e.cfStatus };
    let res = await this.validateBeforeModifyCfStatus(dto) as any;
    if (!res.success) {
      InfoModal.alertError({ confirm: false, content: res.message });
      return;
    }

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
      onCallback: () => {
        this.modifyCfStatus(dto);
      },
    });
  }

  // 交易日驗證
  validateTradeDate(rule: any, value: any, callback: Function) {
    if (!this.isEmpty(value)) {
      const diffDate = DateUtil.diffDateRange(value);
      if (diffDate > this.$cfEnum.rangeDateLimit) {
        callback(`交易日區間不得超過${this.$cfEnum.rangeDateLimit}天`);
      } else {
        callback();
      }
    } else {
      callback(`交易日區間不得超過${this.$cfEnum.rangeDateLimit}天`);
    }
  }

  // 進階查詢必填欄位未填，清空查詢結果
  resetDataInfo() {
    this.ipkGrid.data = [];
  }
}
