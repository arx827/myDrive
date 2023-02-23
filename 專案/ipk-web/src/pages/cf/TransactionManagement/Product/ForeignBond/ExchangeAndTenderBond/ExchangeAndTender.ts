import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import ReturnModal from '@product/ReturnModal.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import { IpkVxeTableModel, ColumnsItem } from '@/components/shared/data-grid/IpkVxeTableModels';
import EATCheckInfoModal from '@product/ForeignBond/ExchangeAndTenderBond/EATCheckInfoModal.vue';
import { TxInfoFeatDto, TxCodeWithEventDto } from '@fubonlife/ipk-api-axios-sdk';
 import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ForeignBondManageFileModal from '@/pages/cf/TransactionManagement/Product/ForeignBond/ForeignBondManageFileModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    ReturnModal,
    EATCheckInfoModal,
    PrintModal,
    ForeignBondManageFileModal,
    IpkButton,
  },
})
export default class ExchangeAndTender extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = {
    tradeType: undefined, // 交易類別
    bondCode: undefined, // 債券標的(ISIN)
    tradeDate: undefined, // 交易日
    settleDate: undefined, // 券交割日
    txCode: undefined, // 交易編號
    currency: undefined, // 幣別
    custodian: undefined, // 債券保管
    cfStatus: [], // 交易狀態
  }

  formRules: { [key: string]: ValidationRule[] } = {
    tradeType: [{ required: true, message: '交易類別為必填', trigger: 'change' }],
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

  // usualForm = {}; // [常用設定] 表單內容 v-model綁定

  columnsEnum: {[key: string]: ColumnsItem[]} = {
    exchange: [
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
        title: '交易別',
        field: 'event',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return data.cellValue === '14' ? 'Tender Offer' : '換券';
        },
      },
      {
        title: '換出債券標的(ISIN)',
        field: 'outBondCode',
        width: 180,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '換入債券標的(ISIN)',
        field: 'inBondCode',
        width: 180,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        title: '換出面額',
        field: 'outNpa',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換入面額',
        field: 'inNpa',
        width: 160,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換出價格',
        field: 'outTradePrice',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換入價格',
        field: 'inTradePrice',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '淨額交割金額',
        field: 'paymentAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換出金額',
        field: 'outApDealAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換入金額',
        field: 'inApDealAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
      },
      {
        title: '換出保管行',
        field: 'outCustodian',
        width: 140,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '換入保管行',
        field: 'inCustodian',
        width: 140,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '簽核權限',
        field: 'apvlLevel',
        width: 120,
        visible: true,
        formatter: (data) => {
          if (data.cellValue) {
            return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
          } return '';
        },
      },
    ],
    tender: [
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
        title: '交易別',
        field: 'event',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return data.cellValue === '14' ? 'Tender Offer' : '換券';
        },
      },
      {
        title: '債券標的(ISIN)',
        field: 'bondCode',
        width: 140,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        title: '面額',
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
        title: '交割款項',
        field: 'paymentAmount',
        width: 140,
        visible: true,
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
        align: 'right',
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
        title: '簽核權限',
        field: 'apvlLevel',
        width: 120,
        visible: true,
        formatter: (data) => {
          if (data.cellValue) {
            return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
          } return '';
        },
      },
    ],
  };

  selectedRowList = []; // 已選取的待放行清單項目

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
    columns: [],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '交易類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '債券代碼', placeholder: '請輸入', type: 'inputText',
    },
    // {
    //   label: '債券標的(ISIN)',
    //   placeholder: '請至少輸入4位關鍵字搜尋選項清單',
    //   type: 'singleSelect',
    //   options: undefined,
    //   allOptions: undefined,
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
      label: '交易編號', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: undefined, showSearch: true,
    },
    {
      label: '債券保管', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: undefined, showSearch: true,
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: undefined, showSearch: true,
    },
  ]

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  txCodeListFile = []; // 因開啟modal取不到整理好的交易編號，故另外宣告變數賦值

  modalPrintShow = false; // [列印彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

  modalReturnShow = false; // [退回彈窗] modal開關

  modalManageFileShow = false; // [附件管理彈窗] modal開關

  detailTradeType = ''; // 單一筆數的交易類別

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
    this.form.tradeType = '15';
    this.form.tradeDate = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    this.form.cfStatus = this.$cfEnum.cfStatusEnum.filter((data) => data.val !== null && data.key !== '已確認')
    .map((data) => data.val); // 交易確認狀態，預設已放行/已鎖定/已比對/已送審/已初核
    // 取得「進階查詢」表單內容
    // this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    this.labelList.forEach(async (el, index) => {
      switch (el.label) {
        case '交易類別':
          this.labelList[index].options = this.$cfEnum.eventOption;
          this.labelList[index].allOptions = this.$cfEnum.eventOption;
          break;
        case '交易確認狀態':
          this.labelList[index].options = this.getStatusOption();
          this.labelList[index].allOptions = this.getStatusOption();
          break;
        // case '債券標的(ISIN)':
        //   let bondIsinOption = await this.$cfCommon.getBondIsinOption();
        //   this.labelList[index].options = bondIsinOption;
        //   this.labelList[index].allOptions = bondIsinOption;
        //   break;
        case '幣別':
          let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
          this.labelList[index].options = currencyOption;
          this.labelList[index].allOptions = currencyOption;
          break;
        case '債券保管':
          let custodianOption = await this.$cfCommon.getCustodianOption();
          this.labelList[index].options = custodianOption;
          this.labelList[index].allOptions = custodianOption;
          break;
        default:
          break;
      }
    });

    // Table 預設為換券的欄位
    this.ipkGrid.columns = this.columnsEnum.exchange;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.EXCHANGE_TENDER_OFFER_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch(false);
  }

  /**
  * methods
  */
  // 判斷空值
   isEmpty(data) {
    return validateUtil.isEmpty(data);
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
    // 依照交易類別判斷 Table 顯示"換券"還是"Tender Offer"欄位
    this.ipkGrid.columns = this.advancedSearchForm.tradeType === '14' ? this.columnsEnum.tender : this.columnsEnum.exchange;
    // call API
    let dto = this.maptoFeatDto();
    this.searchForeignBondTender(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  maptoFeatDto() {
    let dto: TxInfoFeatDto = {
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      custodian: this.isEmpty(this.advancedSearchForm.custodian) ? undefined : this.advancedSearchForm.custodian,
      event: this.isEmpty(this.advancedSearchForm.tradeType) ? undefined : this.advancedSearchForm.tradeType,
      bondCode: this.isEmpty(this.advancedSearchForm.bondCode) ? undefined : this.advancedSearchForm.bondCode,
      settleEndDate: !this.isEmpty(this.advancedSearchForm.settleDate) ? moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD') : null,
      settleStartDate: !this.isEmpty(this.advancedSearchForm.settleDate) ? moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD') : null,
      tradeEndDate: !this.isEmpty(this.advancedSearchForm.tradeDate) ? moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD') : null,
      tradeStartDate: !this.isEmpty(this.advancedSearchForm.tradeDate) ? moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD') : null,
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
    };
    return dto;
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

  // 進階查詢結果表格欄位排序
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.maptoFeatDto();
    // call API
    this.searchForeignBondTender(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;
    // 查詢成交資訊明細
    this.searchTxDetail(e.formData.txCode, e.formData.event);
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 點擊鎖定
  handleDataLock() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 組裝後端所需參數
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val, event: this.advancedSearchForm.tradeType };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
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
    });
  }

  // 點擊資料比對
  handleDataComparison() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 組裝後端所需參數
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val, event: this.advancedSearchForm.tradeType };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
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
    });
  }

  // 點擊列印
  async handleDataPrint() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }

    // 檢核勾選的交易，交易確認狀態若非「已比對」以訊息卡控「勾選狀態不符不可列印」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }

    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$foreignExchangeAndTenderApi');
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
      productGroup: this.$cfEnum.printParam.ExchangeAndTender.productGroup,
      fileType: this.$cfEnum.printParam.ExchangeAndTender.fileType,
    });
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL

    this.modalPrintShow = true;
  }

  // 列印確認送出
  async submitDataPrint(e) {
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      custodian: undefined,
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
    }, '$foreignExchangeAndTenderApi');

    // 列印失敗
    if (!data.success) {
      InfoModal.alertError({ confirm: false, content: data.message });
      return;
    }
    let fileData = data.content;
    InfoModal.alertInfo({
      confirm: false,
      content: data.message,
      onCallback: async () => {
        // this.search();
        // 下載檔案
        if (!this.isEmpty(fileData)) {
          setTimeout(() => {
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
    // this.txCodeListFile = [];
    this.defaultVal.fileCode = undefined;
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
  }

  // 點擊交易確認
  handleDataConfirm() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    // 驗證：檢核交易確認狀態若非「已比對」以訊息卡控「狀態不符不可送審」
    let txCodeList = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 組裝後端所需參數
      txCodeList.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val, event: this.advancedSearchForm.tradeType };
    this.validateBeforeModifyCfStatus(dto).then((check) => {
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
  handleReturnFront() {
    // 驗證：檢核勾選的資料交易確認狀態若含「已送審」、「已初核」、「已確認」時以訊息卡控「勾選的交易含送審後的資料，不可退回修改」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val, event: this.advancedSearchForm.tradeType };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
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
    });
  }

  // 退回解鎖
  handleReturnLock() {
    // 驗證：檢核勾選的資料交易確認狀態若含「已確認」時以訊息卡控「已確認的資料不可退回解鎖」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val, event: this.advancedSearchForm.tradeType };
    this.validateBeforeModifyCfStatus(dto).then(async (check) => {
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
    });
  }

  // 關閉退回彈窗
  closeReturnModal() {
    this.modalReturnShow = false;
  }

  // 點擊附件管理
  handleManageFile() {
    // 開啟附件管理彈窗
    this.modalManageFileShow = true;
  }

  // 關閉附件管理
  closeManageFileModal() {
    this.modalManageFileShow = false;
  }

  // 進階查詢必填欄位未填，清空查詢結果
  resetDataInfo() {
    this.ipkGrid.data = [];
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

  // ------------------------------------------------------ API: -------------------------------------------------------
  // 查詢成交資訊
  searchForeignBondTender(dto: TxInfoFeatDto) {
    this.setLoading(true);
    this.$foreignExchangeAndTenderApi.searchTxInfoUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

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

  // 查詢成交資訊明細
  searchTxDetail(txCode: string, tradeType?) {
    // 整理成後端格式
    const dto: TxCodeWithEventDto = {
      txCode,
      event: tradeType,
    };

    this.detailTradeType = tradeType;
    // call API
    this.setLoading(true);
    this.$foreignExchangeAndTenderApi.searchTxDetailUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

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

  // 異動交易確認狀態前檢查
  validateBeforeModifyCfStatus(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$foreignExchangeAndTenderApi.checkBeforeModifyCfStatusUsingPOST(dto)
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
  async modifyCfStatus(dto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignExchangeAndTenderApi.modifyCfStatusUsingPATCH(dto)
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
}
