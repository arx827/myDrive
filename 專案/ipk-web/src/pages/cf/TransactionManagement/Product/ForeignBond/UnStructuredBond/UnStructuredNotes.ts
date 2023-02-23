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
import ReturnModal from '@product/ReturnModal.vue';
import { TxInfoFbnsDto, TxCodeArrayWithCfStatusDto } from '@fubonlife/ipk-api-axios-sdk';
import FileModal from '@/components/shared/modal/FileModal/FileModal.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import UploadCompareReportModal from '@product/ForeignBond/UploadCompareReportModal.vue';
import USNCheckInfoModal from '@product/ForeignBond/UnStructuredBond/USNCheckInfoModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ForeignBondManageFileModal from '@/pages/cf/TransactionManagement/Product/ForeignBond/ForeignBondManageFileModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    ReturnModal,
    USNCheckInfoModal,
    ForeignBondManageFileModal,
    UploadCompareReportModal,
    FileModal,
    PrintModal,
    IpkButton,
  },
})
export default class UnStructuredNotes extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  USNmodalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  modalFileShow = false; // [產檔彈窗] modal開關

  txCodeListFile = []; // [產檔彈窗] 因開啟產檔modal取不到整理好的交易編號，故另外宣告變數賦值

  modalPrintShow = false; // [列印彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

  modalReturnShow = false; // [退回彈窗] modal開關

  modalManageFileShow = false; // [附件管理彈窗] modal開關

  modalUploadCompareReportShow = false;

  // 查詢條件
  form = {
    txCode: undefined, // 交易類別
    bondCode: undefined, // 債券標的(ISIN)
    tradeDateRange: [], // 交易日
    settleDateRange: [], // 券交割日
    bsType: undefined, // 交易別
    counterpartyId: undefined, // 交易對象
    custodian: undefined, // 債券保管
    cfStatus: [], // 交易狀態
    invCategoryCode: undefined, // 資產類別
    currency: undefined, // 幣別
  }

  formRules = { // 進階查詢驗證規則
    tradeDateRange: [
      {
        required: true,
        validator: this.validateTradeDateRange,
        trigger: 'change',
      },
    ],
  };

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄已點選的排序

  selectedRowList = []; // 已選取的待放行清單項目

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '交易編號', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '債券代碼', placeholder: '請輸入', type: 'inputText',
    },
    // {
    //   label: '債券標的(ISIN)',
    //   placeholder: '請至少輸入4位關鍵字搜尋選項清單',
    //   type: 'singleSelect',
    //   options: undefined,
    //   showSearch: true,
    //   showSelfDefined: {
    //     limitNum: 4,
    //     filterOptions: [],
    //   },
    // },
    {
      label: '交易日(起)-交易日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '券交割日(起)-券交割日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '交易別',
      placeholder: '請選擇',
      type: 'singleSelect',
      options: this.$cfEnum.transactionOption,
      allOptions: this.$cfEnum.transactionOption,
      showSearch: true,
    },
    {
      label: '交易對象', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '債券保管', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '資產類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

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
    rowConfig: {
      keyField: 'txCode',
    },
    checkboxConfig: {
      showHeader: true,
      strict: true,
      checkRowKeys: this.selectRowsId,
      reserve: true,
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
            })],
        },
      },
      {
        title: '交易別',
        field: 'bsType',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '資產類別',
        field: 'invCategoryName',
        width: 100,
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
        title: '券交割日',
        field: 'settleDate',
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
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        title: '買入/賣出價格',
        field: 'tradePrice',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
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
        width: 300,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        title: '交易對手Settlement location',
        field: 'cpSettlementLocation',
        width: 230,
        visible: true,
      },
      {
        title: '交易對手SSI',
        field: 'cpClAgentCode',
        width: 120,
        visible: true,
      },
      {
        title: '簽核權限',
        field: 'apvlLevel',
        width: 120,
        visible: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
        },
      },
      {
        title: '退回原因',
        field: 'rejectReason',
        width: 170,
        visible: true,
      },
    ],
  };

  /**
   * computed
   */
  // sass取得table高度
  get tableHeight() {
    return this.ipkGrid.tableHeight;
  }

  get selectRowsId() {
    return this.selectedRowList.map((item) => item.txCode);
  }

  /**
   * hook
   */
  async created() {
    // 篩選條件預設條件
    this.form.tradeDateRange = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    this.form.cfStatus = this.$cfEnum.cfStatusEnum.filter((data) => data.val !== null && data.key !== '已確認')
    .map((data) => data.val); // 交易確認狀態，預設已放行/已鎖定/已比對/已送審/已初核
    this.setLoading(true);
    // 取得「進階查詢」表單內容
    // this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    // let bondIsinOption = await this.$cfCommon.getBondIsinOption('nonstructure');
    // this.labelList.find((el) => el.label === '債券標的(ISIN)').options = bondIsinOption;
    // this.labelList.find((el) => el.label === '債券標的(ISIN)').allOptions = bondIsinOption;
    let counterpartyOption = await this.$cfCommon.getCounterpartyOption();
    this.labelList.find((el) => el.label === '交易對象').options = counterpartyOption;
    this.labelList.find((el) => el.label === '交易對象').allOptions = counterpartyOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    let custodianOption = await this.$cfCommon.getCustodianOption();
    this.labelList.find((el) => el.label === '債券保管').options = custodianOption;
    this.labelList.find((el) => el.label === '債券保管').allOptions = custodianOption;
    let investmentCategoryOption = await this.$cfCommon.getInvestmentCategoryOption('nonstructure');
    this.labelList.find((el) => el.label === '資產類別').options = investmentCategoryOption;
    this.labelList.find((el) => el.label === '資產類別').allOptions = investmentCategoryOption;
    let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
    this.labelList.find((el) => el.label === '幣別').options = currencyOption;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch(false);
    this.setLoading(false);
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

  /**
	 * @summary 點擊進階查詢按鈕
	 * @param {boolean} isOperate: 是否為異動交易重查
	*/
  handleSearch(isOperate: boolean) {
    // 非交易確認過程清除勾選
    if (!isOperate) {
      this.clearCheckbox();
    }
    // call API
    let dto = this.maptoFbnsDto();
    this.searchUnStructuredNotes(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  maptoFbnsDto() {
    const dto: TxInfoFbnsDto = {
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : Array.isArray(this.advancedSearchForm.cfStatus) ? this.advancedSearchForm.cfStatus : [this.advancedSearchForm.cfStatus],
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      bondCode: this.isEmpty(this.advancedSearchForm.bondCode) ? undefined : this.advancedSearchForm.bondCode,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      custodian: this.isEmpty(this.advancedSearchForm.custodian) ? undefined : this.advancedSearchForm.custodian,
      invCategoryCode: this.isEmpty(this.advancedSearchForm.invCategoryCode) ? undefined : this.advancedSearchForm.invCategoryCode,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      tradeEndDate: (this.advancedSearchForm.tradeDateRange && this.advancedSearchForm.tradeDateRange.length > 0) ? moment(this.advancedSearchForm.tradeDateRange[1]).format('YYYYMMDD') : null,
      tradeStartDate: (this.advancedSearchForm.tradeDateRange && this.advancedSearchForm.tradeDateRange.length > 0) ? moment(this.advancedSearchForm.tradeDateRange[0]).format('YYYYMMDD') : null,
      settleEndDate: (this.advancedSearchForm.settleDateRange && this.advancedSearchForm.settleDateRange.length > 0) ? moment(this.advancedSearchForm.settleDateRange[1]).format('YYYYMMDD') : null,
      settleStartDate: (this.advancedSearchForm.settleDateRange && this.advancedSearchForm.settleDateRange.length > 0) ? moment(this.advancedSearchForm.settleDateRange[0]).format('YYYYMMDD') : null,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
    };
    return dto;
  }

  // 進階查詢結果表格欄位排序
  onSortChange(e) {
    this.tempSort = { ...e.sort };
    // 資產類別sort調整為'invCategoryCode'
    if (e.sort?.selector === 'invCategoryName') this.tempSort.selector = 'invCategoryCode';
    // 整理成後端格式
    let dto = this.maptoFbnsDto();
    // call API
    this.searchUnStructuredNotes(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.USNmodalCheckInfoShow = e.modalCheckInfoShow;
    // 查詢成交資訊明細
    this.searchSingleDetail(e.formData.txCode);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.USNmodalCheckInfoShow = false;
  }

  // 點擊鎖定
  async handleDataLock() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
    let check = await this.validateBeforeModifyCfStatus(dto);
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: async () => {
        let respData: any = await this.modifyCfStatus(dto);

        if (respData?.success) {
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.LOCK_SUCCESS?.title,
            confirm: false,
            content: `${respData.message}，共${this.selectedRowList.length}筆`,
            onCallback: async () => {
              // 重查table資料
              this.handleSearch(dto.cfStatus !== this.$cfEnum.cfStatusConstant.SUBMIT.val);
            },
          });
        }
      },
    });
  }

  // 點擊資料比對
  async handleDataComparison() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val };
    let check = await this.validateBeforeModifyCfStatus(dto);
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: async () => {
        const respData = await this.modifyCfStatus(dto);
        if (respData?.success) {
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.COMPARED_SUCCESS?.title,
            confirm: false,
            content: `${respData.message}，共${this.selectedRowList.length}筆`,
            onCallback: () => {
              // 重查table資料
              this.handleSearch(dto.cfStatus !== this.$cfEnum.cfStatusConstant.SUBMIT.val);
            },
          });
        }
      },
    });
  }

  // 點擊產檔
  async handleDataFile() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$foreignBondNonstructureApi');
    if (typeof (check) === 'object') {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
    } else {
      InfoModal.alertError({ confirm: false, content: check });
      return;
    }

    // 檢核成功開啟彈窗
    this.modalFileShow = true;
  }

  // 產檔確認送出
  async submitDataFile(e) {
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      custodian: e.custodian,
    }, '$foreignBondNonstructureApi');
    // 產檔失敗
    if (!data.success) {
      InfoModal.alertError({ confirm: false, content: data.message });
      return;
    }
    // 產檔成功
    let fileData = data.content;
    InfoModal.alertInfo({
      confirm: false,
      content: data.message,
      onCallback: async () => {
        // 下載檔案
        if (!this.isEmpty(fileData)) {
          setTimeout(async () => {
            this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension);
          }, this.$cfEnum.downloadTime);
          this.closeFileModal();
        }
      },
    });
  }

  // 關閉產檔彈窗
  closeFileModal() {
    this.modalFileShow = false;
  }

  // 點擊列印
  async handleDataPrint() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$foreignBondNonstructureApi');
    if (typeof (check) === 'object') {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
    } else {
      InfoModal.alertError({ confirm: false, content: check });
      return;
    }

    // 取得列印下拉選單
    this.fileCodeOption = await this.$cfCommon.getSearchFile({
      productGroup: this.$cfEnum.printParam.UnStructuredNotes.productGroup,
      fileType: this.$cfEnum.printParam.UnStructuredNotes.fileType,
    });
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL

    // 檢核成功開啟彈窗
    this.modalPrintShow = true;
  }

  // 列印確認送出
  async submitDataPrint(e) {
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
      custodian: undefined,
    }, '$foreignBondNonstructureApi');
    // 列印失敗
    if (!data.success) {
      InfoModal.alertError({ confirm: false, content: data.message });
      return;
    }
    // 關閉列印彈窗
    let fileData = data.content;
    InfoModal.alertInfo({
      confirm: false,
      content: data.message,
      onCallback: async () => {
        // 下載檔案
        if (!this.isEmpty(fileData)) {
          setTimeout(async () => {
            this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension);
          }, this.$cfEnum.downloadTime);
        }
        // 關閉列印彈窗
        this.closePrintModal();
      },
    });
  }

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
    this.defaultVal.fileCode = undefined;
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
  }

  // 點擊交易確認
  async handleDataConfirm() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      txCodeList.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val };
    let check = await this.validateBeforeModifyCfStatus(dto);
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: async () => {
        let respData: any = await this.modifyCfStatus(dto);

        if (respData?.success) {
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.SUBMIT_CONFIRM_SUCCESS?.title,
            confirm: false,
            content: `${respData.message}，共${this.selectedRowList.length}筆。`,
            onCallback: () => {
              // 重查table資料
              this.handleSearch(dto.cfStatus !== this.$cfEnum.cfStatusConstant.SUBMIT.val);
            },
          });
        }
      },
    });
  }

  // 點擊退回
  handleDataReturn() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    this.modalReturnShow = true;
  }

  // 退回修改
  async handleReturnFront() {
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }

    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val };
    let check = await this.validateBeforeModifyCfStatus(dto);
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: async () => {
        let respData: any = await this.modifyCfStatus(dto);

        if (respData?.success) {
          this.modalReturnShow = false;
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.RETURN_EDIT_SUCCESS?.title,
            confirm: false,
            content: `${respData.message}，共${this.selectedRowList.length}筆。`,
            onCallback: () => {
              // 重查table資料
              this.handleSearch(dto.cfStatus !== this.$cfEnum.cfStatusConstant.SUBMIT.val);
            },
          });
        }
      },
    });
  }

  // 退回解鎖
  async handleReturnLock() {
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }

    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val };
    let check = await this.validateBeforeModifyCfStatus(dto);
    if (!check.success) {
      InfoModal.alertError({ confirm: false, content: check.message });
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: check.message,
      onCallback: async () => {
        let respData: any = await this.modifyCfStatus(dto);

        if (respData?.success) {
          this.modalReturnShow = false;
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.RETURN_UNLOCKED_SUCCESS?.title,
            confirm: false,
            content: `${respData.message}，共${this.selectedRowList.length}筆。`,
            onCallback: async () => {
              // 重查table資料
              this.handleSearch(dto.cfStatus !== this.$cfEnum.cfStatusConstant.SUBMIT.val);
            },
          });
        }
      },
    });
  }

  // 關閉退回彈窗
  closeReturnModal() {
    this.modalReturnShow = false;
  }

  // 點擊附件管理
  handleManageFile() {
    this.modalManageFileShow = true;
  }

  // 點擊上傳庫存報表
  handleUploadFile() {
    this.modalUploadCompareReportShow = true;
  }

  // 關閉附件管理
  closeManageFileModal() {
    this.modalManageFileShow = false;
  }

  // 關閉報表上傳比對
  closeUploadCompareReportModal() {
    this.modalUploadCompareReportShow = false;
  }

  // 交易日驗證
  validateTradeDateRange(rule: any, value: any, callback: Function) {
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

  // API: 6. 查詢成交資訊
  searchUnStructuredNotes(dto) {
    this.setLoading(true);
    this.$foreignBondNonstructureApi.searchTxInfoUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];

        if (!this.isEmpty(content)) {
          this.ipkGrid.data = content;
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

  // API: 7. 查詢成交資訊明細
  searchSingleDetail(txCode: string) {
    this.setLoading(true);
    this.$foreignBondNonstructureApi.searchTxDetailUsingPOST({ txCode })
      .then((res) => {
        const content = res.data.content;
        this.checkInfoForm = content;
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // API: 12. 異動交易確認狀態前檢查
  async validateBeforeModifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await	this.$foreignBondNonstructureApi.checkBeforeModifyCfStatusUsingPOST(dto)
    .then((res) => {
      data = res.data;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // API:  13. 異動交易確認狀態
  async modifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignBondNonstructureApi.modifyCfStatusUsingPATCH(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      data = res.data;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // 清除checkbox勾選
  clearCheckbox() {
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.ipkGrid)) {
      this.selectedRowList = [];
      (this.$refs.ipkGrid as any).$refs.vxeGrid.clearCheckboxReserve();
      (this.$refs.ipkGrid as any).$refs.vxeGrid.clearCheckboxRow();
      // 清空排序
      (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
      this.tempSort = undefined;
    }
  }
}
