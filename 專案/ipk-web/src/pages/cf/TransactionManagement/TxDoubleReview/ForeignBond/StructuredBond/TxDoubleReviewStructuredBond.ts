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
export default class TxDoubleReviewStructuredBond extends Vue {
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
    // reviewStatus: undefined, // 此reviewStatus為"退回"/"放行"流程
    rejectReason: undefined,
  };

  form = {
    txCode: undefined, // 交易編號
    invCategoryCode: undefined, // 資產類別
    tradeDate: undefined, // 交易日
    settleDate: undefined, // 券交割日
    paymentSettleDate: undefined, // 款交割日
    currency: undefined, // 幣別
    counterpartyId: undefined, // 交易對象
    custodian: undefined, // 債券保管
    cfStatus: [this.$cfEnum.cfStatusEnum.find((i) => i.key === '已初核').val], // 交易確認狀態 預設已初核
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
          if (data.cellValue) {
            return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
          } return '';
        },
      },

      {
        title: '資產類別',
        field: 'invCategoryName',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => (data.row.invCategoryName ? data.row.invCategoryName : ''),
      },
      {
        title: '交易別',
        field: 'bsType',
        width: 100,
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
        title: '款交割日',
        field: 'paymentSettleDate',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
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
        title: '債券保管',
        field: 'custodian',
        width: 120,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '保管帳號',
        field: 'safekeepingAccount',
        width: 120,
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
      label: '資產類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '券交割日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '款交割日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易對象', placeholder: '請選擇', type: 'inputText', options: undefined,
    },
    {
      label: '債券保管', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
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
  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: { key: null, label: '交易編號', type: 'textarea' },
    cfStatus: { key: null, label: '交易確認狀態', type: 'badge' },
    updateId: { key: null, label: '作業人員', type: 'textarea' },
    updateDate: { key: null, label: '作業日期', type: 'dateTime' },
    invCategoryName: { key: null, label: '資產類別', type: 'textarea' },
    bsType: { key: null, label: '交易別', type: 'textarea' },
    counterpartyId: { key: null, label: '交易對象', type: 'textarea' },
    issuer: { key: null, label: '發行公司(ISSUER)', type: 'textarea' },
    bondName: { key: null, label: '債券名稱', type: 'textarea' },
    bondCode: { key: null, label: '債券標的(ISIN)', type: 'textarea' },
    tradeDate: { key: null, label: '交易日', type: 'date' },
    settleDate: { key: null, label: '券交割日', type: 'date' },
    paymentSettleDate: { key: null, label: '款交割日', type: 'date' },
    currency: { key: null, label: '幣別', type: 'textarea' },
    tradeNpa: { key: null, label: '買/賣成交面額', type: 'textarea' },
    tradePrice: { key: null, label: '買入/賣出價格', type: 'textarea' },
    apDealAmount: { key: null, label: '除息金額', type: 'textarea' },
    apAiAmount: { key: null, label: '前手息', type: 'textarea' },
    paymentAmount: { key: null, label: '交割款項', type: 'textarea' },
    custodian: { key: null, label: '債券保管', type: 'textarea' },
    asName: { key: null, label: '資產區隔', type: 'textarea' },
    memo: { key: null, label: '備註', type: 'textarea' },
  };

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    sector: { key: null, label: '產業別', type: 'inputText' },
    creditRating: { key: null, label: '信用評等', type: 'inputText' },
    otherNotation: { key: null, label: '其他申明(註)', type: 'inputText' },
    ap: { key: null, label: '會計分類', type: 'inputText' },
    oldPortfolio: { key: null, label: '舊Portfolio', type: 'inputText' },
    isStakeholder: { key: null, label: '是否為利害關係人', type: 'inputText' },
    isSppi: { key: null, label: '是否通過SPPI測試', type: 'inputText' },
    trader: { key: null, label: '交易員', type: 'inputText' },
    guarantor: { key: null, label: '保證人(Guarantor)', type: 'inputText' },
    tradeDealYield: { key: null, label: '買入/賣出殖利率', type: 'inputText' },
    confirmManager1: { key: null, label: '放行主管1', type: 'inputText' },
    confirmManager2: { key: null, label: '放行主管2', type: 'inputText' },
    confirmManager3: { key: null, label: '放行主管3', type: 'inputText' },
    confirmStatus: { key: null, label: '覆核狀態', type: 'inputText' },
  };

  /** 收付款資訊 */
  ssi: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    safekeepingAccount: { key: undefined, label: '保管銀行帳號', type: 'inputText' },
    fbSettlementLocation: { key: undefined, label: 'Settlement Location', type: 'inputText' },
    fbClearerId: { key: undefined, label: 'Fubon ECL Clearing Agent Code', type: 'inputText' },
    cpCounterpartyId: { key: undefined, label: 'Broker Name', type: 'inputText' },
    cpClAgentCode: { key: undefined, label: 'Broker Agent Code', type: 'inputText' },
    cpSettlementLocation: { key: undefined, label: 'Broker Settlement Location', type: 'inputText' },
  };

  /** 上傳附件 */
  attachmentInfo = []; // 已儲存後端的上傳資料

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  isPending = false; // 是否從待放行清單點擊檢視

  modalManageFileShow = false; // [附件管理彈窗] modal開關

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
    let investmentCategoryOption = await this.$cfCommon.getInvestmentCategoryOption('structure');
    this.labelList.find((el) => el.label === '資產類別').options = investmentCategoryOption;
    this.labelList.find((el) => el.label === '資產類別').allOptions = investmentCategoryOption;
    let custodianOption = await this.$cfCommon.getCustodianOption();
    this.labelList.find((el) => el.label === '債券保管').options = custodianOption;
    this.labelList.find((el) => el.label === '債券保管').allOptions = custodianOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '附件狀態').options = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '附件狀態').allOptions = this.$cfEnum.attachmentStatusOption;
    let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
    this.labelList.find((el) => el.label === '幣別').options = currencyOption;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.STRUCTURE_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
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
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined
      : Array.isArray(this.advancedSearchForm.cfStatus) ? this.advancedSearchForm.cfStatus : [this.advancedSearchForm.cfStatus],
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      custodian: this.isEmpty(this.advancedSearchForm.custodian) ? undefined : this.advancedSearchForm.custodian,
      invCategoryCode: this.isEmpty(this.advancedSearchForm.invCategoryCode) ? undefined : this.advancedSearchForm.invCategoryCode,
      paymentSettleEndDate: this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? null : moment(this.advancedSearchForm.paymentSettleDate[1]).format('YYYYMMDD'),
      paymentSettleStartDate: this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? null : moment(this.advancedSearchForm.paymentSettleDate[0]).format('YYYYMMDD'),
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
    this.$txDoubleReview.structureSearchTxDoubleReviewInfoUsingPOST(dto)
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
    this.$txDoubleReview.structureSearchTxDoubleReviewDetailUsingPOST({ txCode })
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

  // API: 驗證交易確認狀態
  validateBeforeModifyCfStatus(dto) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$txDoubleReview.structureCheckBeforeModifyCfStatusUsingPOST(dto)
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
    this.$txDoubleReview.structureModifyCfStatusUsingPATCH(dto)
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

  // 日期轉換
  transferDate(item) {
    if (this.isEmpty(item.key)) {
      return;
    }
    // string型別，無時間格式
    if (item.type === 'date') {
      item.key = moment(item.key).format('YYYY/MM/DD');
    }
    // string型別，有時間格式
    if (item.type === 'dateTime') {
      item.key = moment((item as any).key).format('YYYY/MM/DD HH:mm:ss');
    }
  }

  // 金額format
  transferCurrency(item) {
    if (this.isEmpty(item.key)) {
      return;
    }
    item.key = transferUtil.transferPrice(item.key, 4);
  }

  // 整理前台成交資訊
  setMainInitInfo(main) {
    if (this.isEmpty(main)) {
      return;
    }

    Object.entries(main).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.main[key])) {
        this.main[key].key = item;
        this.transferDate(this.main[key]);
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
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;
        if (key === 'tradeDealYield') {
          this.other[key].key = typeof (item) === 'number' ? `${item}%` : '';
        }
        if (key === 'confirmStatus') {
          this.other[key].key = item ? this.$cfEnum.getKey('confirmStatusEnum', item) : '';
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
    this.tempSort = { ...e.sort };
    // 資產類別sort調整為'invCategoryCode'
    if (e.sort?.selector === 'invCategoryName') this.tempSort.selector = 'invCategoryCode';
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
    this.reviewDto.txCode = [];
    this.reviewDto.cfStatus = undefined;
    this.reviewDto.rejectReason = undefined;
    this.rejectReason = undefined;
    this.modalCustomizationShow = false;
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
