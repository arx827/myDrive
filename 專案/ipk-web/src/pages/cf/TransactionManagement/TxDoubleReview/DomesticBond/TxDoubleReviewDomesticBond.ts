import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

import { TxReviewInfo } from '@fubonlife/ipk-api-axios-sdk';
import DomesticCheckInfoModal from '@/pages/cf/TransactionManagement/TxDoubleReview/DomesticCheckInfoModal.vue';

@Component({
  components: {
    AdvancedSearch,
    DomesticCheckInfoModal,
    IpkVxeTable,
    IpkButton,
  },
})
export default class TxReviewForeignEquity extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = {
    txCode: undefined, // 交易流水編號
    oldPortfolio: undefined, // 舊portfolio
    counterpartyId: undefined, // 交易對象
    invCategoryCode: undefined, // 資產類別
    bsType: undefined, // 交易別
    tradeDate: undefined, // 交易日
    paymentSettleDate: undefined, // 款交割日
    cfStatus: [this.$cfEnum.cfStatusConstant.TX_REVIEW.val], // 交易確認狀態，預設已初核
    isinCode: undefined, // 債券標的
    attachmentStatus: undefined, // 附件狀態
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
        visible: true,
      },
      {
        title: '交易流水編號',
        field: 'txCode',
        fixed: 'left',
        width: 160,
        visible: true,
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
        field: 'attachmentStatus',
        fixed: 'left',
        width: 100,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
        },
      },
      {
        title: '前台覆核狀態',
        field: 'confirmStatus',
        width: 140,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getKey('confirmStatusEnum', data.cellValue);
        },
      },
      {
        title: '資產類別',
        field: 'invCategoryName',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 100,
      },
      {
        title: '交易別',
        field: 'bsType',
        width: 100,
        visible: true,
        sortable: true,
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
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
        width: 100,
      },
      {
        title: '款交割日',
        field: 'paymentSettleDate',
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
        title: '債券標的',
        field: 'isinCode',
        width: 140,
        visible: true,
      },
      {
        title: '幣別',
        field: 'currency',
        width: 80,
        visible: true,
      },
      {
        title: '買/賣成交面額',
        field: 'tradeNpa',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '成交價',
        field: 'tradePrice',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '成交殖利率',
        field: 'tradeDealYield',
        width: 140,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return `${data.cellValue}%`;
        },
        align: 'right',
      },
      {
        title: '除息金額',
        field: 'apDealAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '前手息',
        field: 'apAiAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '前手稅',
        field: 'apTax',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '手續費',
        field: 'apTaxAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: 'Commision',
        field: 'commission',
        width: 160,
        visible: true,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '交割款項',
        field: 'paymentAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '交易對象',
        field: 'counterpartyId',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 300,
      },
      {
        title: '交易對象(中)',
        field: 'counterpartyName',
        width: 220,
        visible: true,
      },
      {
        title: '舊portfolio',
        field: 'oldPortfolio',
        width: 140,
        visible: true,
      },
      {
        title: '債券保管',
        field: 'custodian',
        width: 120,
        visible: true,
        sortable: true,
      },
      {
        title: '備註',
        field: 'memo',
        width: 170,
        visible: true,
      },
      {
        title: '交割方式',
        field: 'settleType',
        width: 100,
        visible: true,
      },
      {
        title: '合併交割',
        field: 'isCombined',
        width: 100,
        visible: true,
      },
      {
        title: '交易對象統編',
        field: 'cpTaxId',
        width: 140,
        visible: true,
      },
      {
        title: '交易對象公債帳號/債券集保帳號',
        field: 'cpPdAccount',
        width: 250,
        visible: true,
      },
      {
        title: '交易對象受款行銀行帳號',
        field: 'cpBfBankAccount',
        width: 180,
        visible: true,
      },
      {
        title: '交易對象受款銀行名稱',
        field: 'cpBfBankName',
        width: 200,
        visible: true,
      },
      {
        title: '送審人員',
        field: 'applyId',
        width: 100,
        visible: true,
      },
      {
        title: '送審日期',
        field: 'applyDate',
        width: 160,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '初核人員',
        field: 'reviewId',
        width: 100,
        visible: true,
      },
      {
        title: '初核日期',
        field: 'reviewDate',
        width: 140,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '交易流水編號', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '舊portfolio', placeholder: '請選擇', type: 'inputText',
    },
    {
      label: '交易對象', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '資產類別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '款交割日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '債券標的', placeholder: '請選擇', type: 'inputText',
    },
    {
      label: '附件狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '送審日期', placeholder: '請選擇', type: 'datePicker',
    },
    {
      label: '送審人員', placeholder: '請選擇', type: 'inputText', maxlength: 5,
    },
  ]

  selectedRowList = []; // 已選取的待放行清單項目

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  /** 前台成交資訊 */
  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: { key: undefined, label: '交易流水編號', type: 'textarea' },
    cfStatus: { key: undefined, label: '交易確認狀態', type: 'badge' },
    updateId: { key: undefined, label: '作業人員', type: 'textarea' },
    updateDate: { key: undefined, label: '作業日期', type: 'dateTime' },
    isWi: { key: undefined, label: 'WI交易', type: 'textarea' },
    bsType: { key: undefined, label: '交易別', type: 'textarea' },
    invCategoryName: { key: undefined, label: '資產類別', type: 'textarea' },
    isinCode: { key: undefined, label: '債券標的', type: 'textarea' },
    bondName: { key: undefined, label: '債權名稱', type: 'textarea' },
    tradeDate: { key: undefined, label: '交易日', type: 'date' },
    settleDate: { key: undefined, label: '券交割日', type: 'date' },
    paymentSettleDate: { key: undefined, label: '款交割日', type: 'date' },
    currency: { key: undefined, label: '幣別', type: 'textarea' },
    tradeNpa: { key: undefined, label: '買/賣成交面額	', type: 'textarea' },
    tradePrice: { key: undefined, label: '成交價', type: 'textarea' },
    tradeDealYield: { key: undefined, label: '成交殖利率', type: 'textarea' },
    apDealAmount: { key: undefined, label: '除息金額', type: 'textarea' },
    apAiAmount: { key: undefined, label: '前手息', type: 'textarea' },
    apTax: { key: undefined, label: '前手稅', type: 'textarea' },
    paymentAmount: { key: undefined, label: '交割款項', type: 'textarea' },
    counterpartyId: { key: undefined, label: '交易對象', type: 'textarea' },
    counterpartyName: { key: undefined, label: '交易對象(中文)', type: 'textarea' },
    custodian: { key: undefined, label: '債券保管', type: 'textarea' },
    isOversold: { key: undefined, label: '是否超賣', type: 'textarea' },
    memo: { key: undefined, label: '備註', type: 'textarea' },
    productId: { key: undefined, label: '商品編號', type: 'action' },
    invCategoryCode: { key: undefined, label: '', type: 'action' },
  };

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    asName: { key: undefined, label: '資產區隔', type: 'inputText' },
    ap: { key: undefined, label: '會計分類', type: 'inputText' },
    settleType: { key: undefined, label: '交割方式', type: 'inputText' },
    issuer: { key: undefined, label: '發行公司/所屬國家', type: 'inputText' },
    sector: { key: undefined, label: '產業別/國家Asset Class', type: 'inputText' },
    creditRating: { key: undefined, label: '信用評等', type: 'inputText' },
    otherNotation: { key: undefined, label: '其他申明(註)', type: 'inputText' },
    isTradePurpose: { key: undefined, label: '是否為交易目的', type: 'inputText' },
    isOtc: { key: undefined, label: '是否為境內掛牌', type: 'inputText' },
    isStakeholder: { key: undefined, label: '是否為利害關係人', type: 'inputText' },
    oldPortfolio: { key: undefined, label: '舊Portfolio', type: 'inputText' },
    isSppi: { key: undefined, label: '是否通過SPPI測試', type: 'inputText' },
    trader: { key: undefined, label: '交易員', type: 'inputText' },
    confirmManager1: { key: undefined, label: '放行主管1', type: 'inputText' },
    confirmManager2: { key: undefined, label: '放行主管2', type: 'inputText' },
    confirmManager3: { key: undefined, label: '放行主管3', type: 'inputText' },
    isCombined: { key: undefined, label: '是否合併交割', type: 'inputText' },
    bondFullName: { key: undefined, label: '債券完整名稱', type: 'input' },
  };

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    fbForm: { // 我方收付款資訊
      fbPdAccountBank: { key: null, label: '我方公債帳號對應銀行名稱', type: 'textarea' },
      fbBfAccountName: { key: null, label: '我方受款人戶名', type: 'textarea' },
      fbTaxId: { key: null, label: '我方統編', type: 'textarea' },
      safekeepingAccount: { key: null, label: '我方保管帳號', type: 'textarea' },
      safekeepingName: { key: null, label: '我方保管行名稱', type: 'textarea' },
      fbBfAccount: { key: null, label: '我方受款銀行帳號', type: 'textarea' },
      fbBankAccount: { key: null, label: '我方調撥銀行帳號', type: 'textarea' },
      fbBankName: { key: null, label: '我方調撥銀行名稱', type: 'textarea' },
    },
    ssiForm: { // 交易對象收付款資訊
      cpPdAccountBank: { key: null, label: '交易對象公債帳號對應銀行名稱', type: 'textarea' },
      cpBfAccountName: { key: null, label: '交易對象公債帳號戶名/受款人戶名', type: 'textarea' },
      cpTaxId: { key: null, label: '交易對象統編', type: 'textarea' },
      cpPdAccount: { key: null, label: '交易對象公債帳號/債券集保帳號', type: 'textarea' },
      cpBfBankAccount: { key: null, label: '交易對象受款行銀行帳號', type: 'textarea' },
      cpBfBankName: { key: null, label: '交易對象受款銀行名稱', type: 'textarea' },
      noteName: { key: null, label: '照會對象', type: 'textarea' },
      noteTime: { key: null, label: '照會時間', type: 'textarea' },
      memo: { key: null, label: '備註', type: 'textarea' },
    },
  };

  // 收付款資訊表單title
  multiCheckInfoFormTitle = [
    { label: '我方收付款資訊', value: 'fbForm' },
    { label: '交易對象收付款資訊', value: 'ssiForm' },
  ];

  /** 上傳附件 */
  attachment = []; // 已儲存後端的上傳資料

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
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '資產類別').options = this.$cfEnum.invCategoryCodeOption;
    this.labelList.find((el) => el.label === '資產類別').allOptions = this.$cfEnum.invCategoryCodeOption;
    this.labelList.find((el) => el.label === '交易別').options = this.$cfEnum.transactionOption;
    this.labelList.find((el) => el.label === '交易別').allOptions = this.$cfEnum.transactionOption;
    this.labelList.find((el) => el.label === '附件狀態').options = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '附件狀態').allOptions = this.$cfEnum.attachmentStatusOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
  * methods
  */
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

  // 點擊進階查詢按鈕
  handleSearch() {
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    let dto = this.setSearchTxReviewDto();
    this.searchTxReview(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchTxReviewDto() {
    let dto = {
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      oldPortfolio: this.isEmpty(this.advancedSearchForm.oldPortfolio) ? undefined : this.advancedSearchForm.oldPortfolio,
      invCategoryCode: this.isEmpty(this.advancedSearchForm.invCategoryCode) ? undefined : this.advancedSearchForm.invCategoryCode,
      tradeStartDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD'),
      tradeEndDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD'),
      paymentSettleStartDate: this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? undefined : moment(this.advancedSearchForm.paymentSettleDate[0]).format('YYYYMMDD'),
      paymentSettleEndDate: this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? undefined : moment(this.advancedSearchForm.paymentSettleDate[1]).format('YYYYMMDD'),
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      applyDate: this.isEmpty(this.advancedSearchForm.applyDate) ? undefined : moment(this.advancedSearchForm.applyDate).format('YYYYMMDD'),
      applyId: this.isEmpty(this.advancedSearchForm.applyId) ? undefined : this.advancedSearchForm.applyId,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      isinCode: this.isEmpty(this.advancedSearchForm.isinCode) ? undefined : this.advancedSearchForm.isinCode,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
      attachmentStatus: this.isEmpty(this.advancedSearchForm.attachmentStatus) ? undefined : this.advancedSearchForm.attachmentStatus,
    };
    return dto;
  }

  // 進階查詢
  searchTxReview(dto: TxReviewInfo) {
    this.setLoading(true);
    this.$txDoubleReview.domesticBondSearchTxDoubleReviewInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];
      this.selectedRowList = [];

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

  // 表格欄位排序改變
  onSortChange(e) {
    this.tempSort = { ...e.sort };
    // 資產類別sort調整為'invCategoryCode'
    if (e.sort?.selector === 'invCategoryName') this.tempSort.selector = 'invCategoryCode';
    // 整理成後端格式
    let dto = this.setSearchTxReviewDto();
    // call API
    this.searchTxReview(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = true;
    // 查詢成交資訊明細
    this.searchTxReviewDetail(e.formData.txCode);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 整批退回
  async handleReturnList(action: string) {
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 驗證: 後台檢查若勾選的交易確認狀態非「已送審」，以提示訊息「勾選了狀態不符的交易，請確認」
    let dto = { txCode: txCodeList, cfStatus: action };
    let check = await this.validateBeforeModifyCfStatus(dto) as any;
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: () => {
        this.modifyCfStatus(dto);
      },
    });
  }

  // 單筆退回
  async handleReturn(e: any) {
    let dto = { txCode: e.txCode, cfStatus: e.cfStatus };
    let check = await this.validateBeforeModifyCfStatus(dto) as any;
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: () => {
        this.modifyCfStatus(dto);
      },
    });
  }

  // 整批放行
  async handleReviewList(action: string) {
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 驗證: 後台檢查若勾選的交易確認狀態非「已送審」，以提示訊息「勾選了狀態不符的交易，請確認」
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
    // 驗證: 後台檢查交易確認狀態非「已初核」，以提示訊息「狀態不符不可放行」
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

  // 查詢已初核交易資訊明細_國內債
  searchTxReviewDetail(txCode: string) {
    this.setLoading(true);
    this.$txDoubleReview.domesticBondSearchTxDoubleReviewDetailUsingPOST({ txCode })
    .then((res) => {
      const content = res.data.content;
      if (!this.isEmpty(content)) {
        // 整理前台成交資訊
        this.setMainInitInfo(content.main);
        // 整理其他成交資訊
        this.setOtherInitInfo(content.other);
        // 整理收付款資訊
        this.setSsiInitInfo(content.ssi);
        // 上傳附件
        this.attachment = content.attachment;
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

  // 驗證交易確認狀態
  validateBeforeModifyCfStatus(dto) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.domesticBondCheckBeforeModifyCfStatusUsingPOST(dto)
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

  // 異動交易確認狀態
  modifyCfStatus(dto) {
    this.setLoading(true);
    this.$txDoubleReview.domesticBondModifyCfStatusUsingPATCH(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 關閉檢視彈窗
      this.closeCheckInfoModal();

      InfoModal.alertSuccess({
        title: this.$cfMessageEnum.REVIEW_SUCCESS.title,
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
  setMainInitInfo(main) {
    if (this.isEmpty(main)) {
      return;
    }

    this.main.txCode.key = main.txCode;
    this.main.cfStatus.key = main.cfStatus;
    this.main.updateId.key = main.updateId;
    this.main.updateDate.key = main.updateDate;
    this.main.isWi.key = transferUtil.getSelectOption(this.$cfEnum.isWIOption, main.isWi)?.label;
    this.main.bsType.key = main.bsType;
    this.main.invCategoryName.key = main.invCategoryName;
    this.main.isinCode.key = main.isinCode;
    this.main.bondName.key = main.bondName;
    this.main.tradeDate.key = main.tradeDate;
    this.main.settleDate.key = main.settleDate;
    this.main.paymentSettleDate.key = main.paymentSettleDate;
    this.main.currency.key = main.currency;
    this.main.tradeNpa.key = transferUtil.transferPrice(main.tradeNpa);
    this.main.tradePrice.key = transferUtil.transferPrice(main.tradePrice);
    this.main.tradeDealYield.key = main.tradeDealYield ? `${main.tradeDealYield}%` : '';
    this.main.apDealAmount.key = transferUtil.transferPrice(main.apDealAmount);
    this.main.apAiAmount.key = transferUtil.transferPrice(main.apAiAmount);
    this.main.apTax.key = transferUtil.transferPrice(main.apTax);
    this.main.paymentAmount.key = transferUtil.transferPrice(main.paymentAmount);
    this.main.counterpartyId.key = main.counterpartyId;
    this.main.counterpartyName.key = main.counterpartyName;
    this.main.custodian.key = main.custodian;
    this.main.isOversold.key = main.isOversold;
    this.main.memo.key = main.memo;
    this.main.productId.key = main.productId;
    this.main.invCategoryCode.key = main.invCategoryCode;
  }

  // 整理其他成交資訊
  setOtherInitInfo(other) {
    if (this.isEmpty(other)) {
      return;
    }
    Object.entries(other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;
      }
    });
  }

  // 整理收付款資訊
  setSsiInitInfo(ssi) {
    if (this.isEmpty(ssi)) {
      return;
    }
    this.ssi.fbForm.fbPdAccountBank.key = ssi.fbPdAccountBank ? ssi.fbPdAccountBank : undefined;
    this.ssi.fbForm.fbBfAccountName.key = ssi.fbBfAccountName ? ssi.fbBfAccountName : undefined;
    this.ssi.fbForm.fbTaxId.key = ssi.fbTaxId ? ssi.fbTaxId : undefined;
    this.ssi.fbForm.safekeepingAccount.key = ssi.safekeepingAccount ? ssi.safekeepingAccount : undefined;
    this.ssi.fbForm.safekeepingName.key = ssi.safekeepingName ? ssi.safekeepingName : undefined;
    this.ssi.fbForm.fbBfAccount.key = ssi.fbBfAccount ? ssi.fbBfAccount : undefined;
    this.ssi.fbForm.fbBankAccount.key = ssi.fbBankAccount ? ssi.fbBankAccount : undefined;
    this.ssi.fbForm.fbBankName.key = ssi.fbBankName ? ssi.fbBankName : undefined;
    this.ssi.ssiForm.cpPdAccountBank.key = ssi.cpPdAccountBank ? ssi.cpPdAccountBank : undefined;
    this.ssi.ssiForm.cpBfAccountName.key = ssi.cpBfAccountName ? ssi.cpBfAccountName : undefined;
    this.ssi.ssiForm.cpTaxId.key = ssi.cpTaxId ? ssi.cpTaxId : undefined;
    this.ssi.ssiForm.cpPdAccount.key = ssi.cpPdAccount ? ssi.cpPdAccount : undefined;
    this.ssi.ssiForm.cpBfBankAccount.key = ssi.cpBfBankAccount ? ssi.cpBfBankAccount : undefined;
    this.ssi.ssiForm.cpBfBankName.key = ssi.cpBfBankName ? ssi.cpBfBankName : undefined;
    this.ssi.ssiForm.noteName.key = ssi.noteName ? ssi.noteName : undefined;
    this.ssi.ssiForm.noteTime.key = ssi.noteTime ? ssi.noteTime : undefined;
    this.ssi.ssiForm.memo.key = ssi.memo ? ssi.memo : undefined;
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
