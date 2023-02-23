import { Vue, Component } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

import { TxReviewInfo } from '@fubonlife/ipk-api-axios-sdk';
import ForeignCheckInfoModal from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignCheckInfoModal.vue';
import ManageFile from '@/pages/cf/TransactionManagement/TxDoubleReview/ForeignEquity/ManageFileModal.vue';

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
export default class TxDoubleReviewForeignEquity extends Vue {
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
    isAsia: undefined, // 市場別
    hid: undefined, // 交易階層
    counterpartyId: undefined, // 交易對手
    cfStatus: [this.$cfEnum.cfStatusConstant.TX_REVIEW.val], // 交易確認狀態，預設已初核
    applyDate: undefined, // 送審日期
    applyId: undefined, // 送審人員
    bsType: undefined, // 買賣類別
    cutOffDatetime: undefined, // 指示時間
    dealType: this.$cfEnum.dealTypeOption.find((el) => el.label === '實際交易').value, // 成交類別，預設帶實際交易
  }

  formRules: { [key: string]: ValidationRule[] } = { // 進階查詢驗證規則
    dealType: [{ required: true, message: '請選擇', trigger: 'change' }],
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
        title: '交易編號',
        field: 'txCode',
        visible: true,
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
        title: '送審人員',
        field: 'applyId',
        visible: true,
        width: 100,
      },
      {
        title: '送審日期',
        field: 'applyDate',
        visible: true,
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
        visible: true,
      },
      {
        title: '初核日期',
        field: 'reviewDate',
        width: 160,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '指示時間',
        field: 'cutOffDatetime',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 140,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm');
        },
      },
      {
        title: '買賣類別',
        field: 'bsType',
        width: 100,
        visible: true,
      },
      {
        title: '交易階層',
        field: 'hierarchyDesc',
        visible: true,
        width: 160,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return data.cellValue.split(',').pop();
        },
      },
      {
        title: '市場別',
        field: 'isAsia',
        visible: true,
        width: 90,
        // formatter: (data) => {
        //   if (!data.cellValue) {
        //     return null;
        //   }
        //   return this.$cfEnum.getLabel('isAsiaOption', data.cellValue);
        // },
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
        title: '商品代碼',
        field: 'productCode',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 100,
      },
      {
        title: 'ISIN',
        field: 'isinCode',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 140,
      },
      {
        title: '商品名稱',
        field: 'productName',
        visible: true,
        width: 300,
      },
      {
        title: '交易對手',
        field: 'counterpartyId',
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 300,
      },
      {
        title: '幣別',
        field: 'currency',
        width: 80,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '預計認購單位數',
        field: 'estNpa',
        visible: true,
        width: 140,
        align: 'right',
      },
      {
        title: '實際買/賣單位數',
        field: 'actNpa',
        visible: true,
        width: 160,
        align: 'right',
      },
      {
        title: '繳款日',
        field: 'estPaymentDate',
        visible: true,
        width: 140,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '預計成交價格',
        field: 'estTradePrice',
        visible: true,
        width: 140,
        align: 'right',
      },
      {
        title: '成交價',
        field: 'actTradePrice',
        visible: true,
        width: 140,
        align: 'right',
      },
      {
        title: '預計成交金額',
        field: 'estApDealAmount',
        visible: true,
        width: 140,
        align: 'right',
      },
      {
        title: '成交金額',
        field: 'actApDealAmount',
        visible: true,
        width: 140,
        align: 'right',
      },
      {
        title: '手續費及佣金',
        field: 'fee',
        visible: true,
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '其他費用(含交易稅)',
        field: 'commission',
        visible: true,
        width: 160,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '收付款金額',
        field: 'paymentAc',
        visible: true,
        width: 140,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '保管行/收付款機構',
        field: 'safekeepingSsi',
        visible: true,
        width: 170,
      },
      {
        title: '簽核權限',
        field: 'apvlLevel',
        visible: true,
        width: 120,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
        },
      },
      {
        title: '附件狀態',
        field: 'apvlAttachmentStatus',
        visible: true,
        width: 100,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
        },
      },
      {
        title: '預付交易單號及備註',
        field: 'memo',
        visible: true,
        width: 170,
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
      label: '市場別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易階層', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易對手', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '送審日期', placeholder: '請輸入', type: 'datePicker',
    },
    {
      label: '送審人員', placeholder: '請輸入', type: 'inputText', maxlength: 5,
    },
    {
      label: '買賣類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '指示時間', placeholder: '請選擇', type: 'datePicker', showTime: true, showTimeFormat: 'HH:mm',
    },
    {
      label: '成交類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

  selectedRowList = []; // 已選取的待放行清單項目

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  modalManageFileShow = false; // [附件管理彈窗] modal開關

  /** 前台成交資訊 */
  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: { key: undefined, label: '交易編號', type: 'textarea' },
    cfStatus: { key: undefined, label: '交易確認狀態', type: 'badge' },
    updateId: { key: undefined, label: '作業人員', type: 'textarea' },
    updateDate: { key: undefined, label: '作業日期', type: 'dateTime' },
    hierarchyDesc: { key: undefined, label: '交易階層', type: 'textarea' },
    isAsia: { key: undefined, label: '市場別', type: 'textarea' },
    bsType: { key: undefined, label: '買賣類別', type: 'textarea' },
    currency: { key: undefined, label: '幣別', type: 'textarea' },
    productCode: { key: undefined, label: '商品代碼', type: 'textarea' },
    isinCode: { key: undefined, label: 'ISIN', type: 'textarea' },
    productName: { key: undefined, label: '商品名稱', type: 'textarea' },
    counterpartyId: { key: undefined, label: '交易對手', type: 'textarea' },
    tradeDate: { key: undefined, label: '交易日', type: 'date' },
    settleDate: { key: undefined, label: '券交割日', type: 'date' },
    paymentSettleDate: { key: undefined, label: '款交割日', type: 'date' },
    paymentDate: { key: undefined, label: '繳款日', type: 'date' },
    safekeepingSsi: { key: undefined, label: '保管行/收付款機構', type: 'textarea' },
    actNpa: { key: undefined, label: '實際買/賣單位數', type: 'textarea' },
    actTradePrice: { key: undefined, label: '成交價', type: 'textarea' },
    actApDealAmount: { key: undefined, label: '成交金額', type: 'textarea' },
    estNpa: { key: undefined, label: '預計認購單位數', type: 'textarea' },
    estTradePrice: { key: undefined, label: '預計成交價格', type: 'textarea' },
    estApDealAmount: { key: undefined, label: '預計成交金額', type: 'textarea' },
    blank1: { key: undefined, label: '', type: 'action' }, // 因版型關係，設定 blank 空物件換行
    fee: { key: undefined, label: '手續費及佣金', type: 'textarea' },
    commission: { key: undefined, label: '其他費用(含交易稅)', type: 'textarea' },
    paymentAc: { key: undefined, label: '收付款金額', type: 'textarea' },
    blank2: { key: undefined, label: '', type: 'action' }, // 因版型關係，設定 blank 空物件換行
    apvlLevel: { key: undefined, label: '簽核權限', type: 'textarea' },
    apvlFxRateDate: { key: undefined, label: '匯率日期', type: 'date' },
    apvlFxRate: { key: undefined, label: '匯率', type: 'textarea' },
  };

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txAttribute: { key: undefined, label: '交易屬性', type: 'inputText' },
    portfolio: { key: undefined, label: 'PORTFOLIO', type: 'inputText' },
    ap: { key: undefined, label: '會計公報分類', type: 'inputText' },
    marketLevel: { key: undefined, label: '初級市場/次級市場', type: 'inputText' },
    diffReason: { key: undefined, label: '差異原因', type: 'inputText' },
    memo: { key: undefined, label: '預付交易單號或備註', type: 'inputText' },
    isStakeholder: { key: undefined, label: '是否為利害關係人', type: 'inputText' },
  };

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    safekeepingAccount: { key: undefined, label: 'Safekeeping Account', type: 'inputText' },
    blank1: { // 因版型關係，設定 blank 空物件換行
      key: undefined, label: '', type: 'action', span: 18,
    },
    brokerIdType: { key: undefined, label: 'Broker ID Type', type: 'inputText' },
    brokerId: { key: undefined, label: 'Broker ID', type: 'inputText' },
    brokerAccount: { key: undefined, label: 'Broker Account', type: 'inputText' },
    memo: { key: undefined, label: 'Special Instruction', type: 'inputText' },
    clearerIdType: { key: undefined, label: 'Clearer ID Type', type: 'inputText' },
    clearerId: { key: undefined, label: 'Clearer ID', type: 'inputText' },
    clearerAccount: { key: undefined, label: 'Clearer Account', type: 'inputText' },
    blank4: { key: undefined, label: '', type: 'action' }, // 因版型關係，設定 blank 空物件換行
    clAgentCodeType: { key: undefined, label: 'Clearing Agent Code Type', type: 'inputText' },
    clAgentCode: { key: undefined, label: 'Clearing Agent Code', type: 'inputText' },
    clearerName: { key: undefined, label: 'Clearer Name', type: 'inputText' },
    blank5: { key: undefined, label: '', type: 'action' }, // 因版型關係，設定 blank 空物件換行
    market: { key: undefined, label: 'Market', type: 'inputText' },
    cycd: { key: undefined, label: 'CyCd', type: 'inputText' },
    psetCode: { key: undefined, label: 'PSET CODE', type: 'inputText' },
    settlementLocation: { key: undefined, label: 'Settlement Location', type: 'inputText' },
    pot: { key: undefined, label: 'Settlement Transaction Indicator', type: 'inputText' },
    potNarrative: { key: undefined, label: 'Place of Trade', type: 'inputText' },
    indicator: { key: undefined, label: 'Place of Trade Narrative', type: 'inputText' },
    blank6: { key: undefined, label: '', type: 'action' }, // 因版型關係，設定 blank 空物件換行
    equityCutOffDate: { key: undefined, label: '保銀下指示日期', type: 'date' },
    equityCutOffTime: { key: undefined, label: '保銀下指示時間', type: 'inputText' },
    equityBufferTime: { key: undefined, label: '目標放行時間', type: 'inputText' },
    lastTx: { key: undefined, label: '前次交易日期', type: 'inputText' },
  };

  /** 上傳附件 */
  attachmentInfo = [];

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
    this.labelList.find((el) => el.label === '市場別').options = this.$cfEnum.isAsiaOption;
    this.labelList.find((el) => el.label === '市場別').allOptions = this.$cfEnum.isAsiaOption;
    this.labelList.find((el) => el.label === '交易階層').options = this.$cfEnum.hierarchyDescOption;
    this.labelList.find((el) => el.label === '交易階層').allOptions = this.$cfEnum.hierarchyDescOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    let buySellTypeOptions = await this.$cfCommon.getBuySellType();
    this.labelList.find((el) => el.label === '買賣類別').options = buySellTypeOptions;
    this.labelList.find((el) => el.label === '買賣類別').allOptions = buySellTypeOptions;
    this.labelList.find((el) => el.label === '成交類別').options = this.$cfEnum.dealTypeOption;
    this.labelList.find((el) => el.label === '成交類別').allOptions = this.$cfEnum.dealTypeOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
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

  // 點擊進階查詢按鈕
  handleSearch() {
    // 依照成交類別判斷table顯示"預付"還是"實際"欄位
    this.setEstOrActColumn(this.advancedSearchForm.dealType);
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    let dto = this.setSearchTxDoublewDto();
    this.searchTxDoubleReview(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchTxDoublewDto() {
    let dto = {
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      tradeStartDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD'),
      tradeEndDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD'),
      settleStartDate: this.isEmpty(this.advancedSearchForm.settleDate) ? undefined : moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD'),
      settleEndDate: this.isEmpty(this.advancedSearchForm.settleDate) ? undefined : moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD'),
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      isAsia: this.isEmpty(this.advancedSearchForm.isAsia) ? undefined : this.advancedSearchForm.isAsia,
      hid: this.isEmpty(this.advancedSearchForm.hid) ? undefined : this.advancedSearchForm.hid,
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      applyDate: this.isEmpty(this.advancedSearchForm.applyDate) ? undefined : moment(this.advancedSearchForm.applyDate).format('YYYYMMDD'),
      applyId: this.isEmpty(this.advancedSearchForm.applyId) ? undefined : this.advancedSearchForm.applyId,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      cutOffDatetime: this.isEmpty(this.advancedSearchForm.cutOffDatetime) ? undefined : moment(this.advancedSearchForm.cutOffDatetime).format('YYYYMMDD HHmm'),
      dealType: this.isEmpty(this.advancedSearchForm.dealType) ? undefined : this.advancedSearchForm.dealType,
      sort: this.tempSort,
    };
    return dto;
  }

  // 依照成交類別判斷table顯示"預付"還是"實際"欄位
  setEstOrActColumn(dealType) {
    let visibleKey = this.$cfEnum.dealTypeOption.find((i) => i.value !== dealType).column;
    for (let i = 0; i < this.ipkGrid.columns.length; i++) {
      if (!this.isEmpty(this.ipkGrid.columns[i].field)) {
        // 組裝正則表達式 ^est|act ，為ect、act開頭的欄位再重新賦值。
        if (new RegExp(`^${this.$cfEnum.dealTypeOption.map((i) => i.column).reduce((a, b) => `${a}|${b}`)}`).test(this.ipkGrid.columns[i].field)) {
          let copyColumn = JSON.parse(JSON.stringify(this.ipkGrid.columns[i]));
          if (new RegExp(`^${visibleKey}`).test(this.ipkGrid.columns[i].field)) {
            copyColumn.visible = false;
          } else {
            copyColumn.visible = true;
            // 宣告在data區會因為JSON.stringify而被刪掉，故在這邊轉換
            // 成交類別為"預付"時，才顯示繳款日欄位
            if (dealType === this.$cfEnum.dealTypeOption.find((el) => el.label === '預付交易').value && this.ipkGrid.columns[i].field === 'estPaymentDate') {
              copyColumn.formatter = (data) => {
                if (!data.cellValue) {
                  return null;
                }
                return moment(data.cellValue).format('YYYY/MM/DD');
              };
            } else {
              copyColumn.formatter = (data) => transferUtil.transferPrice(data.cellValue);
            }
          }
          this.$set(this.ipkGrid.columns, i, copyColumn);
        }
      }
    }
  }

  // 進階查詢
  searchTxDoubleReview(dto: TxReviewInfo) {
    this.setLoading(true);
    this.$txDoubleReview.searchTxDoubleReviewInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            estPaymentDate: item.paymentDate,
          });
        });
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
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchTxDoublewDto();
    // call API
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

  // 退回原因彈窗送出
  submitReturn() {
    // 驗證退回原因
    if (this.isEmpty(this.rejectReason)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.REJECT_REASON_REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.rejectReason = this.rejectReason;

    this.modifyCfStatus(this.reviewDto);
  }

  // 關閉退回拒絕彈窗
  closeCustomizationModal() {
    this.reviewDto.txCode = [];
    this.reviewDto.cfStatus = undefined;
    this.reviewDto.rejectReason = undefined;
    this.rejectReason = undefined;
    this.modalCustomizationShow = false;
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

  // 點擊附件管理
  handleManageFile() {
    this.modalManageFileShow = true;
  }

  // 關閉附件管理
  closeManageFileModal() {
    this.modalManageFileShow = false;
  }

  // 查詢已送審交易資訊明細
  searchTxDoubleReviewDetail(txCode: string) {
    this.setLoading(true);
    this.$txDoubleReview.searchTxDoubleReviewDetailUsingPOST({ txCode })
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

  // 驗證交易確認狀態
  validateBeforeModifyCfStatus(dto) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.checkBeforeModifyCfStatusUsingPOST(dto)
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
    this.$txDoubleReview.modifyCfStatusUsingPATCH(dto)
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
  setMainInitInfo(main) {
    if (this.isEmpty(main)) {
      return;
    }

    this.main.txCode.key = main.txCode;
    this.main.cfStatus.key = main.cfStatus;
    this.main.updateId.key = main.updateId;
    this.main.updateDate.key = main.updateDate;
    this.main.hierarchyDesc.key = main.hierarchyDesc ? main.hierarchyDesc.split(',').pop() : main.hierarchyDesc;
    this.main.isAsia.key = main.isAsia;
    this.main.bsType.key = main.bsType;
    this.main.currency.key = main.currency;
    this.main.productCode.key = main.productCode;
    this.main.isinCode.key = main.isinCode;
    this.main.productName.key = main.productName;
    this.main.counterpartyId.key = main.counterpartyId;
    this.main.tradeDate.key = main.tradeDate;
    this.main.settleDate.key = main.settleDate;
    this.main.paymentSettleDate.key = main.paymentSettleDate;
    this.main.paymentDate.key = main.paymentDate;
    this.main.safekeepingSsi.key = main.safekeepingSsi;
    this.main.actNpa.key = transferUtil.transferPrice(main.actNpa);
    this.main.actTradePrice.key = transferUtil.transferPrice(main.actTradePrice);
    this.main.actApDealAmount.key = transferUtil.transferPrice(main.actApDealAmount);
    this.main.estNpa.key = transferUtil.transferPrice(main.estNpa);
    this.main.estTradePrice.key = transferUtil.transferPrice(main.estTradePrice);
    this.main.estApDealAmount.key = transferUtil.transferPrice(main.estApDealAmount);
    this.main.fee.key = transferUtil.transferPrice(main.fee);
    this.main.commission.key = transferUtil.transferPrice(main.commission);
    this.main.paymentAc.key = transferUtil.transferPrice(main.paymentAc);
    this.main.apvlLevel.key = main.apvlLevel ? this.$cfEnum.getKey('apvlLevelEnum', main.apvlLevel) : main.apvlLevel; // 轉換成中文格式
    this.main.apvlFxRate.key = main.apvlFxRate;
    this.main.apvlFxRateDate.key = main.apvlFxRateDate;
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
