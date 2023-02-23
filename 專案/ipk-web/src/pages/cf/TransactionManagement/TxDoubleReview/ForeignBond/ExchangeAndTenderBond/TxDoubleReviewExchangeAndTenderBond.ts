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
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import { IpkVxeTableModel, ColumnsItem } from '@/components/shared/data-grid/IpkVxeTableModels';
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
export default class TxDoubleReviewExchangeAndTenderBond extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * data
  */
  rejectReason = ''; // [退回原因] 退回內容

  modalCustomizationShow = false; // [退回原因] modal開關

  reviewDto = { // 覆核(退回)資訊
    txCodeList: [],
    reviewStatus: null, // 此reviewStatus為"退回"/"放行"流程
    rejectReason: null,
    event: null,
  };

  form = {
    txCode: undefined, // 交易編號
    tradeDate: undefined, // 交易日
    settleDate: undefined, // 券交割日
    currency: undefined, // 幣別
    event: this.$cfEnum.eventOption.find((i) => i.label === '換券').value, // 交易別 預設換券
    cfStatus: [this.$cfEnum.cfStatusEnum.find((i) => i.key === '已初核').val], // 交易確認狀態 預設已初核
    attachmentStatus: undefined, // 附件狀態
    applyDate: undefined, // 送審日期
    applyId: undefined, // 送審人員
  }

  formRules: { [key: string]: ValidationRule[] } = { // 進階查詢驗證規則
    event: [{ required: true, message: '請選擇', trigger: 'change' }],
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
    columns: [],
  };

  // 換券欄位
  exchangeColumns: ColumnsItem[] = [
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
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
      title: '交易類別',
      field: 'event',
      width: 100,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      formatter: (data) => {
        if (data.cellValue) {
          return this.$cfEnum.getLabel('eventOption', data.cellValue);
        } return '';
      },
    },
    {
      title: '換出債券標的(ISIN)',
      field: 'outBondCode',
      width: 170,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '換入債券標的(ISIN)',
      field: 'inBondCode',
      width: 170,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '交易日',
      field: 'tradeDate',
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
      title: '幣別',
      field: 'currency',
      width: 80,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '換出面額',
      field: 'outNpa',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換入面額',
      field: 'inNpa',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換出價格',
      field: 'outTradePrice',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換入價格',
      field: 'inTradePrice',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '交割款項',
      field: 'paymentAmount',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換出金額',
      field: 'outApDealAmount',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換入金額',
      field: 'inApDealAmount',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '換出保管行',
      field: 'outCustodian',
      width: 140,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '換入保管行',
      field: 'inCustodian',
      width: 140,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
  ];

  // tender offer欄位
  tenderColumns: ColumnsItem[] = [
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
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
      title: '交易類別',
      field: 'event',
      width: 100,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      formatter: (data) => {
        if (data.cellValue) {
          return this.$cfEnum.getLabel('eventOption', data.cellValue);
        } return '';
      },
    },
    {
      title: '債券標的(ISIN)',
      field: 'bondCode',
      width: 140,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '交易日',
      field: 'tradeDate',
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
      title: '幣別',
      field: 'currency',
      width: 80,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
    },
    {
      title: '面額/換出面額',
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
      title: '交割款項',
      field: 'paymentAmount',
      width: 140,
      align: 'right',
      formatter: (data) => transferUtil.transferPrice(data.cellValue),
    },
    {
      title: '債券保管',
      field: 'custodian',
      width: 120,
      sortable: true,
      sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
  ];

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
      label: '交易別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
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

  /** 前台成交資訊 */
  changeMain() {
    // Tender Offer
    const $return = {};
    if (this.advancedSearchForm.event === '14') {
      return {
        txCode: { key: this.main.txCode.key, label: '交易編號', type: 'inputText' },
        event: { key: this.main.event.key, label: '交易類別', type: 'inputText' },
        invCategoryName: { key: this.main.invCategoryName.key, label: '資產類別', type: 'inputText' },
        tradeDirection: { key: this.main.tradeDirection.key, label: '收/付款', type: 'inputText' },
        bondCode: { key: this.main.bondCode.key, label: '債券標的(ISIN)', type: 'inputText' },
        tradeDate: { key: this.main.tradeDate.key, label: '交易日', type: 'date' },
        settleDate: { key: this.main.settleDate.key, label: '券交割日', type: 'date' },
        paymentSettleDate: { key: this.main.paymentSettleDate.key, label: '款交割日', type: 'inputText' },
        currency: { key: this.main.currency.key, label: '幣別', type: 'inputText' },
        tradeNpa: { key: this.main.tradeNpa.key, label: '買/賣成交面額', type: 'inputText' },
        tradePrice: { key: this.main.tradePrice.key, label: '買入/賣出價格', type: 'inputText' },
        apDealAmount: { key: this.main.apDealAmount.key, label: '除息金額', type: 'inputText' },
        apAiAmount: { key: this.main.apAiAmount.key, label: '前手息', type: 'inputText' },
        paymentAmount: { key: this.main.paymentAmount.key, label: '交割款項', type: 'inputText' },
        custodian: { key: this.main.custodian.key, label: '債券保管', type: 'inputText' },
        counterpartyId: { key: this.main.counterpartyId.key, label: '交易對象', type: 'inputText' },
        ap: { key: this.main.ap.key, label: '會計分類', type: 'inputText' },
        asName: { key: this.main.asName.key, label: '資產區隔', type: 'inputText' },
        memo: { key: this.main.memo.key, label: '備註', type: 'textarea' },
        apvlLevel: { key: this.main.apvlLevel.key, label: '簽核權限', type: 'inputText' },
        cfStatus: { key: this.main.cfStatus.key, label: '交易確認狀態', type: 'badge' },
        updateId: { key: this.main.updateId.key, label: '作業人員', type: 'inputText' },
        updateDate: { key: this.main.updateDate.key, label: '作業日期', type: 'dateTime' },
      };
    }
    // 換券
    if (this.advancedSearchForm.event === '15') {
      return {
        txCode: { key: this.main.txCode.key, label: '交易編號', type: 'inputText' },
        event: { key: this.main.event.key, label: '交易類別', type: 'inputText' },
        invCategoryName: { key: this.main.invCategoryName.key, label: '資產類別', type: 'inputText' },
        tradeDirection: { key: this.main.tradeDirection.key, label: '收/付款', type: 'inputText' },
        outBondCode: { key: this.main.outBondCode.key, label: '換出債券標的(ISIN)', type: 'inputText' },
        inBondCode: { key: this.main.inBondCode.key, label: '換入債券標的(ISIN)', type: 'inputText' },
        tradeDate: { key: this.main.tradeDate.key, label: '交易日', type: 'date' },
        settleDate: { key: this.main.settleDate.key, label: '換券交割日', type: 'date' },
        currency: { key: this.main.currency.key, label: '幣別', type: 'inputText' },
        outNpa: { key: this.main.outNpa.key, label: '換出面額', type: 'inputText' },
        inNpa: { key: this.main.inNpa.key, label: '換入面額', type: 'inputText' },
        outTradePrice: { key: this.main.outTradePrice.key, label: '換出價格', type: 'inputText' },
        inTradePrice: { key: this.main.inTradePrice.key, label: '換入價格', type: 'inputText' },
        apDealAmount: { key: this.main.apDealAmount.key, label: '淨額除息金額', type: 'inputText' },
        apAiAmount: { key: this.main.apAiAmount.key, label: '淨額前手息', type: 'inputText' },
        consentFee: { key: this.main.consentFee.key, label: 'ConsentFee', type: 'inputText' },
        paymentAmount: { key: this.main.paymentAmount.key, label: '淨額交割金額', type: 'inputText' },
        outApDealAmount: { key: this.main.outApDealAmount.key, label: '換出金額', type: 'inputText' },
        inApDealAmount: { key: this.main.inApDealAmount.key, label: '換入金額', type: 'inputText' },
        outCustodian: { key: this.main.outCustodian.key, label: '換出保管行', type: 'inputText' },
        inCustodian: { key: this.main.inCustodian.key, label: '換入保管行', type: 'inputText' },
        counterpartyId: { key: this.main.counterpartyId.key, label: '交易對象', type: 'inputText' },
        outAp: { key: this.main.outAp.key, label: '換出會計分類', type: 'inputText' },
        inAp: { key: this.main.inAp.key, label: '換入會計分類', type: 'inputText' },
        outAsName: { key: this.main.outAsName.key, label: '換出資產區隔', type: 'inputText' },
        inAsName: { key: this.main.inAsName.key, label: '換入資產區隔', type: 'inputText' },
        memo: { key: this.main.memo.key, label: '備註', type: 'textarea' },
        apvlLevel: { key: this.main.apvlLevel.key, label: '簽核權限', type: 'inputText' },
        cfStatus: { key: this.main.cfStatus.key, label: '交易確認狀態', type: 'badge' },
        updateId: { key: this.main.updateId.key, label: '作業人員', type: 'inputText' },
        updateDate: { key: this.main.updateDate.key, label: '作業日期', type: 'dateTime' },
      };
    }
    // console.log($return);
    return $return;
  }

  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: { key: undefined, label: '交易編號', type: 'inputText' },
    event: { key: undefined, label: '交易類別', type: 'inputText' },
    invCategoryName: { key: undefined, label: '資產類別', type: 'inputText' },
    tradeDirection: { key: undefined, label: '收/付款', type: 'inputText' },
    outBondCode: { key: undefined, label: '換出債券標的(ISIN)', type: 'inputText' },
    inBondCode: { key: undefined, label: '換入債券標的(ISIN)', type: 'inputText' },
    bondCode: { key: undefined, label: '債券標的(ISIN)', type: 'inputText' },
    tradeDate: { key: undefined, label: '交易日', type: 'date' },
    settleDate: { key: undefined, label: '券交割日', type: 'date' },
    paymentSettleDate: { key: undefined, label: '款交割日', type: 'inputText' },
    currency: { key: undefined, label: '幣別', type: 'inputText' },
    outNpa: { key: undefined, label: '換出面額', type: 'inputText' },
    inNpa: { key: undefined, label: '換入面額', type: 'inputText' },
    tradePrice: { key: undefined, label: '買入/賣出價格', type: 'inputText' },
    outTradePrice: { key: undefined, label: '換出價格', type: 'inputText' },
    inTradePrice: { key: undefined, label: '換入價格', type: 'inputText' },
    apDealAmount: { key: undefined, label: '淨額除息金額', type: 'inputText' },
    apAiAmount: { key: undefined, label: '淨額前手息', type: 'inputText' },
    consentFee: { key: undefined, label: 'ConsentFee', type: 'inputText' },
    paymentAmount: { key: undefined, label: '淨額交割金額', type: 'inputText' },
    tradeNpa: { key: undefined, label: '買/賣成交面額', type: 'inputText' },
    outApDealAmount: { key: undefined, label: '換出金額', type: 'inputText' },
    inApDealAmount: { key: undefined, label: '換入金額', type: 'inputText' },
    custodian: { key: undefined, label: '債券保管', type: 'inputText' },
    outCustodian: { key: undefined, label: '換出保管行', type: 'inputText' },
    inCustodian: { key: undefined, label: '換入保管行', type: 'inputText' },
    counterpartyId: { key: undefined, label: '交易對象', type: 'inputText' },
    ap: { key: undefined, label: '會計分類', type: 'inputText' },
    outAp: { key: undefined, label: '換出會計分類', type: 'inputText' },
    inAp: { key: undefined, label: '換入會計分類', type: 'inputText' },
    asName: { key: undefined, label: '資產區隔', type: 'inputText' },
    outAsName: { key: undefined, label: '換出資產區隔', type: 'inputText' },
    inAsName: { key: undefined, label: '換入資產區隔', type: 'inputText' },
    memo: { key: undefined, label: '備註', type: 'inputText' },
    apvlLevel: { key: undefined, label: '簽核權限', type: 'inputText' },
    cfStatus: { key: undefined, label: '交易確認狀態', type: 'badge' },
    updateId: { key: undefined, label: '作業人員', type: 'inputText' },
    updateDate: { key: undefined, label: '作業日期', type: 'dateTime' },
  };

  /** 其他成交資訊 */
  changeOther(): { [key: string]: CheckInfoModel } {
    // Tender Offer
    const $return = {};
    if (this.advancedSearchForm.event === '14') {
      return {
        guaranteeType: { key: this.other.guaranteeType.key, label: '擔保類型', type: 'inputText' },
        tradeDealYield: { key: this.other.tradeDealYield.key, label: '買入/賣出殖利率', type: 'inputText' },
        tradeSpread: { key: this.other.tradeSpread.key, label: '買入/賣出Spread', type: 'inputText' },
        issuer: { key: this.other.issuer.key, label: '發行公司', type: 'inputText' },
        bondName: { key: this.other.bondName.key, label: '債券名稱', type: 'inputText' },
        sector: { key: this.other.sector.key, label: '產業別', type: 'inputText' },
        creditRating: { key: this.other.creditRating.key, label: '信用評等', type: 'inputText' },
        otherNotation: { key: this.other.otherNotation.key, label: '其他申明(註)', type: 'inputText' },
        isStakeholder: { key: this.other.isStakeholder.key, label: '是否為利害關係人', type: 'inputText' },
        oldPortfolio: { key: this.other.oldPortfolio.key, label: '舊Portfolio', type: 'inputText' },
        trader: { key: this.other.trader.key, label: '交易員', type: 'inputText' },
        confirmManager1: { key: this.other.confirmManager1.key, label: '放行主管1', type: 'inputText' },
        confirmManager2: { key: this.other.confirmManager1.key, label: '放行主管2', type: 'inputText' },
        confirmManager3: { key: this.other.confirmManager1.key, label: '放行主管3', type: 'inputText' },
        isSppi: { key: this.other.isSppi.key, label: '是否通過SPPI測試', type: 'inputText' },
      };
    }
    // 換券
    if (this.advancedSearchForm.event === '15') {
      return {
        outDealYield: { key: this.other.outDealYield.key, label: '換出yield', type: 'inputText' },
        inDealYield: { key: this.other.inDealYield.key, label: '換入yield', type: 'inputText' },
        outIssuer: { key: this.other.outIssuer.key, label: '換出券發行公司', type: 'inputText' },
        inIssuer: { key: this.other.inIssuer.key, label: '換入券發行公司', type: 'inputText' },
        outIssuerCountry: { key: this.other.outIssuerCountry.key, label: '換出券所屬國家', type: 'inputText' },
        inIssueCountry: { key: this.other.inIssueCountry.key, label: '換入券所屬國家', type: 'inputText' },
        outSector: { key: this.other.outSector.key, label: '換出產業別', type: 'inputText' },
        inSector: { key: this.other.inSector.key, label: '換入產業別', type: 'inputText' },
        outIssueDate: { key: this.other.outIssueDate.key, label: '換出發行日', type: 'date' },
        inIssueDate: { key: this.other.inIssueDate.key, label: '換入發行日', type: 'date' },
        outMaturityDate: { key: this.other.outMaturityDate.key, label: '換出到期日', type: 'date' },
        inMaturityDate: { key: this.other.inMaturityDate.key, label: '換入到期日', type: 'date' },
        outIssueNpa: { key: this.other.outIssueNpa.key, label: '換出發行總額', type: 'inputText' },
        inIssueNpa: { key: this.other.inIssueNpa.key, label: '換入發行總額', type: 'inputText' },
        outCouponRate: { key: this.other.outCouponRate.key, label: '換出票面利率', type: 'inputText' },
        inCouponRate: { key: this.other.inCouponRate.key, label: '換入票面利率', type: 'inputText' },
        outRateType: { key: this.other.outRateType.key, label: '換出固定/浮動', type: 'inputText' },
        inRateType: { key: this.other.inRateType.key, label: '換入固定/浮動', type: 'inputText' },
        outDividendFreq: { key: this.other.outDividendFreq.key, label: '換出付息頻率', type: 'inputText' },
        inDividendFreq: { key: this.other.inDividendFreq.key, label: '換入付息頻率', type: 'inputText' },
        outCreditRating: { key: this.other.outCreditRating.key, label: '換出信用評等', type: 'inputText' },
        inCreditRating: { key: this.other.inCreditRating.key, label: '換入信用評等', type: 'inputText' },
        otherNotation: { key: this.other.otherNotation.key, label: '其他申明(註)', type: 'inputText' },
        isStakeholder: { key: this.other.isStakeholder.key, label: '是否為利害關係人', type: 'inputText' },
        trader: { key: this.other.trader.key, label: '交易員', type: 'inputText' },
        confirmManager1: { key: this.other.confirmManager1.key, label: '放行主管1', type: 'inputText' },
        confirmManager2: { key: this.other.confirmManager1.key, label: '放行主管2', type: 'inputText' },
        confirmManager3: { key: this.other.confirmManager1.key, label: '放行主管3', type: 'inputText' },
        outIsSppi: { key: this.other.outIsSppi.key, label: '換出債券是否通過SPPI測試', type: 'inputText' },
        inIsSppi: { key: this.other.inIsSppi.key, label: '換入債券是否通過SPPI測試', type: 'inputText' },
      };
    }
    return $return;
  }

  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    guaranteeType: { key: undefined, label: '擔保類型', type: 'inputText' },
    tradeDealYield: { key: undefined, label: '買入/賣出殖利率', type: 'inputText' },
    outDealYield: { key: undefined, label: '換出yield', type: 'inputText' },
    inDealYield: { key: undefined, label: '換入yield', type: 'inputText' },
    tradeSpread: { key: undefined, label: '買入/賣出Spread', type: 'inputText' },
    issuer: { key: undefined, label: '發行公司', type: 'inputText' },
    outIssuer: { key: undefined, label: '換出券發行公司', type: 'inputText' },
    inIssuer: { key: undefined, label: '換入券發行公司', type: 'inputText' },
    bondName: { key: undefined, label: '債券名稱', type: 'inputText' },
    outIssuerCountry: { key: undefined, label: '換出券所屬國家', type: 'inputText' },
    inIssueCountry: { key: undefined, label: '換入券所屬國家', type: 'inputText' },
    sector: { key: undefined, label: '產業別', type: 'inputText' },
    outSector: { key: undefined, label: '換出產業別', type: 'inputText' },
    inSector: { key: undefined, label: '換入產業別', type: 'inputText' },
    outIssueDate: { key: undefined, label: '換出發行日', type: 'date' },
    inIssueDate: { key: undefined, label: '換入發行日', type: 'date' },
    outMaturityDate: { key: undefined, label: '換出到期日', type: 'date' },
    inMaturityDate: { key: undefined, label: '換入到期日', type: 'date' },
    outIssueNpa: { key: undefined, label: '換出發行總額', type: 'inputText' },
    inIssueNpa: { key: undefined, label: '換入發行總額', type: 'inputText' },
    outCouponRate: { key: undefined, label: '換出票面利率', type: 'inputText' },
    inCouponRate: { key: undefined, label: '換入票面利率', type: 'inputText' },
    outRateType: { key: undefined, label: '換出固定/浮動', type: 'inputText' },
    inRateType: { key: undefined, label: '換入固定/浮動', type: 'inputText' },
    outDividendFreq: { key: undefined, label: '換出付息頻率', type: 'inputText' },
    inDividendFreq: { key: undefined, label: '換入付息頻率', type: 'inputText' },
    creditRating: { key: undefined, label: '信用評等', type: 'inputText' },
    outCreditRating: { key: undefined, label: '換出信用評等', type: 'inputText' },
    inCreditRating: { key: undefined, label: '換入信用評等', type: 'inputText' },
    otherNotation: { key: undefined, label: '其他申明(註)', type: 'inputText' },
    isStakeholder: { key: undefined, label: '是否為利害關係人', type: 'inputText' },
    oldPortfolio: { key: undefined, label: '舊Portfolio', type: 'inputText' },
    trader: { key: undefined, label: '交易員', type: 'inputText' },
    confirmManager1: { key: undefined, label: '放行主管1', type: 'inputText' },
    confirmManager2: { key: undefined, label: '放行主管2', type: 'inputText' },
    confirmManager3: { key: undefined, label: '放行主管3', type: 'inputText' },
    isSppi: { key: undefined, label: '是否通過SPPI測試', type: 'inputText' },
    outIsSppi: { key: undefined, label: '換出債券是否通過SPPI測試', type: 'inputText' },
    inIsSppi: { key: undefined, label: '換入債券是否通過SPPI測試', type: 'inputText' },
  };

  /** 收付款資訊 */
  ssi: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    safekeepingAccount: { key: undefined, label: 'Safekeeping Account', type: 'inputText' },
  };

  /** 上傳附件 */
  attachmentInfo = []; // 已儲存後端的上傳資料

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  isPending = false; // 是否從待放行清單點擊檢視

  modalManageFileShow = false; // [附件管理彈窗] modal開關

  // 交易類別
  detailEventType = null;

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
    this.labelList.find((el) => el.label === '交易別').options = this.$cfEnum.eventOption;
    this.labelList.find((el) => el.label === '交易別').allOptions = this.$cfEnum.eventOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '附件狀態').options = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '附件狀態').allOptions = this.$cfEnum.attachmentStatusOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
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

  // 整理進階查詢查詢按鈕後端格式
  setSearchTxReviewDto() {
    let dto = {
      applyDate: this.isEmpty(this.advancedSearchForm.applyDate) ? undefined : moment(this.advancedSearchForm.applyDate).format('YYYYMMDD'),
      applyId: this.isEmpty(this.advancedSearchForm.applyId) ? undefined : this.advancedSearchForm.applyId,
      apvlAttachmentStatus: this.isEmpty(this.advancedSearchForm.attachmentStatus) ? undefined : this.advancedSearchForm.attachmentStatus,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      event: this.isEmpty(this.advancedSearchForm.event) ? undefined : this.advancedSearchForm.event,
      settleEndDate: this.isEmpty(this.advancedSearchForm.settleDate) ? null : moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD'),
      settleStartDate: this.isEmpty(this.advancedSearchForm.settleDate) ? null : moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD'),
      tradeEndDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? null : moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD'),
      tradeStartDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? null : moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD'),
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
    };
    return dto;
  }

  // ipkGrid 表格欄位轉換
  changeGridColumns() {
    const nVString = this.$cfEnum.getLabel('eventOption', this.advancedSearchForm.event);
    if (nVString === '換券') {
      this.ipkGrid.columns = this.exchangeColumns;
    } else if (nVString === 'Tender Offer') {
      this.ipkGrid.columns = this.tenderColumns;
    }
  }

  // API: 進階查詢
  searchTxDoubleReview(dto) {
    this.setLoading(true);
    this.changeGridColumns();
    this.$txDoubleReview.exchangeTenderOfferSearchTxDoubleReviewInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];
      if (!this.isEmpty(content)) {
        this.ipkGrid.data = content;
      }
      this.reviewDto.event = dto.event;

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
    const submitData = {
      txCode,
      event: this.advancedSearchForm.event,
    };
    this.setLoading(true);
    this.$txDoubleReview.exchangeTenderOfferSearchTxDoubleReviewDetailUsingPOST(submitData)
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

        // 交易類別
        this.detailEventType = content.main.event;
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
  validateBeforeModifyCfStatus({ cfStatus, event, txCode }) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.exchangeTenderOfferCheckBeforeModifyCfStatusUsingPOST({ cfStatus, event, txCode })
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
    this.$txDoubleReview.exchangeTenderOfferModifyCfStatusUsingPATCH(dto)
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
    Object.entries(main).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.main[key])) {
        switch (key) {
          case 'event':
            this.main[key].key = this.$cfEnum.getLabel('eventOption', item);
            break;
          case 'tradeDirection':
            this.main[key].key = this.$cfEnum.getKey(this.detailEventType === '14' ? 'tradeDirectionTenderEnum' : 'tradeDirectionEnum', item);
            break;
          case 'apvlLevel':
            this.main[key].key = this.$cfEnum.getKey('apvlLevelEnum', item);
            break;
          case 'paymentSettleDate':
            this.main[key].key = this.isEmpty(item) ? '-' : moment(item).format('YYYY/MM/DD');
            break;
          default:
            this.main[key].key = item;
            break;
        }

        if (typeof (this.main[key].key) === 'number') {
          this.main[key].key = transferUtil.transferPrice(itemVal);
        }
      }
    });
  }

  // 整理其他成交資訊
  setOtherInitInfo(other) {
    if (this.isEmpty(other)) {
      return;
    }

    Object.entries(other).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.other[key])) {
        switch (key) {
          case 'isSppi':
          case 'outIsSppi':
          case 'inIsSppi':
            this.other[key].key = this.$cfEnum.getLabel('isSppiOption', item);
            break;
          case 'outDividendFreq':
          case 'inDividendFreq':
            this.other[key].key = this.$cfEnum.getLabel('dividendFreqOption', item);
            break;
          case 'tradeDealYield':
          case 'outDealYield':
          case 'inDealYield':
          case 'outCouponRate':
          case 'inCouponRate':
            this.other[key].key = typeof (item) === 'number' ? `${item}%` : '';
            break;
          case 'outIssueNpa':
          case 'inIssueNpa':
            this.other[key].key = transferUtil.transferPrice(itemVal);
            break;
          default:
            this.other[key].key = item;
            break;
        }
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
  }

  // 退回原因彈窗送出
  submitReturn() {
    // 驗證退回原因
    if (validateUtil.isEmpty(this.rejectReason)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.REJECT_REASON_REQUIRED_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.rejectReason = this.rejectReason;

    this.modifyCfStatus({
      txCode: this.reviewDto.txCodeList,
      rejectReason: this.reviewDto.rejectReason,
      cfStatus: this.reviewDto.reviewStatus,
      event: this.reviewDto.event,
    });
  }

  // 點擊附件管理
  handleManageFile() {
    this.modalManageFileShow = true;
  }

  // 整批退回
  async handleReturnList(action: string) {
    this.reviewDto.txCodeList = [];
    this.reviewDto.reviewStatus = action;
    this.reviewDto.event = this.selectedRowList[0].event;
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.reviewDto.txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 驗證: 後台檢查若勾選的交易確認狀態非「已初核」或「已確認」，以提示訊息「勾選了狀態不符的交易，請確認」
    let res = await this.validateBeforeModifyCfStatus({
      cfStatus: action,
      event: this.selectedRowList[0].event,
      txCode: this.reviewDto.txCodeList,
    }) as any;
    if (!res.success) {
      InfoModal.alertError({ confirm: false, content: res.message });
      return;
    }
    // 打開拒絕彈窗
    this.modalCustomizationShow = true;
  }

  // 單筆退回
  async handleReturn(e: any) {
    this.reviewDto.txCodeList = e.txCode;
    this.reviewDto.reviewStatus = e.cfStatus;
    // 驗證: 後台檢查交易確認狀態非「已初核」或「已確認」，以提示訊息「狀態不符不可退回」
    let res = await this.validateBeforeModifyCfStatus({
      cfStatus: e.cfStatus,
      event: this.reviewDto.event,
      txCode: this.reviewDto.txCodeList,
    }) as any;
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
    let dto = {
      txCode: txCodeList,
      cfStatus: action,
      event: this.selectedRowList[0].event,
    };
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
    let dto = {
      txCode: e.txCode,
      cfStatus: e.cfStatus,
      event: this.$cfEnum.getValue('eventOption', this.main.event.key),
    };
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
