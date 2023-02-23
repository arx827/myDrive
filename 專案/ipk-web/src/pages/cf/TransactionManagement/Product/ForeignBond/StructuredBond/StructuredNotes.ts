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
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import FileModal from '@/components/shared/modal/FileModal/FileModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import SNCheckInfoModal from '@product/ForeignBond/StructuredBond/SNCheckInfoModal.vue';
import { TxInfoFbsDto, TxCodeArrayWithCfStatusDto } from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ForeignBondManageFileModal from '@/pages/cf/TransactionManagement/Product/ForeignBond/ForeignBondManageFileModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    ReturnModal,
    SNCheckInfoModal,
    PrintModal,
    ForeignBondManageFileModal,
    FileModal,
    IpkButton,
  },
})
export default class StructuredNotes extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = {
    txCode: undefined, // 交易編號
    invCategoryCode: undefined, // 資產類別
    tradeDate: undefined, // 交易日
    counterpartyId: undefined, // 交易對象
    bondCode: undefined, // 債券標的(ISIN)
    paymentSettleDate: undefined, // 款交割日
    custodian: undefined, // 債券保管
    cfStatus: [], // 交易確認狀態
    settleDate: undefined, // 券交割日
    currency: undefined, // 幣別
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

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

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
        title: '資產類別',
        field: 'invCategoryName',
        width: 100,
        visible: true,
      },
      {
        title: '交易別',
        field: 'bsType',
        width: 100,
        visible: true,
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
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '退回原因',
        field: 'rejectReason',
        width: 170,
        visible: true,
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
      label: '交易日(起)-交易日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '交易對象', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '債券代碼', placeholder: '請輸入', type: 'inputText',
    },
    // {
    //   label: '債券代碼',
    //   placeholder: '請至少輸入4位關鍵字搜尋選項清單',
    //   type: 'singleSelect',
    //   options: undefined,
    //   allOptions: [],
    //   showSearch: true,
    //   showSelfDefined: {
    //     limitNum: 4,
    //     filterOptions: [],
    //   },
    // },
    {
      label: '款交割日(起)-款交割日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '債券保管', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '券交割日(起)-券交割日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

  modalFileShow = false; // [產檔彈窗] modal開關

  txCodeListFile = []; // [產檔彈窗] 因開啟產檔modal取不到整理好的交易編號，故另外宣告變數賦值

  modalPrintShow = false; // [列印彈窗] modal開關

  modalReturnShow = false; // [退回彈窗] modal開關

  modalManageFileShow = false; // [附件管理彈窗] modal開關

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
    this.form.tradeDate = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    this.form.cfStatus = this.$cfEnum.cfStatusEnum.filter((data) => data.val !== null && data.key !== '已確認')
    .map((data) => data.val); // 交易確認狀態，預設已放行/已鎖定/已比對/已送審/已初核
    // 取得「進階查詢」表單內容
    // this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    let investmentCategoryOption = await this.$cfCommon.getInvestmentCategoryOption('structure');
    this.labelList.find((el) => el.label === '資產類別').options = investmentCategoryOption;
    this.labelList.find((el) => el.label === '資產類別').allOptions = investmentCategoryOption;
    let counterpartyIdOption = await this.$cfCommon.getCounterpartyIdOption();
    this.labelList.find((el) => el.label === '交易對象').options = counterpartyIdOption;
    this.labelList.find((el) => el.label === '交易對象').allOptions = counterpartyIdOption;
    // let bondIsinOption = await this.$cfCommon.getBondIsinOption('structure');
    // this.labelList.find((el) => el.label === '債券標的(ISIN)').options = bondIsinOption;
    // this.labelList.find((el) => el.label === '債券標的(ISIN)').allOptions = bondIsinOption;
    let custodianOption = await this.$cfCommon.getCustodianOption();
    this.labelList.find((el) => el.label === '債券保管').options = custodianOption;
    this.labelList.find((el) => el.label === '債券保管').allOptions = custodianOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
    this.labelList.find((el) => el.label === '幣別').options = currencyOption;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.STRUCTURE_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
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
    let dto = this.setSearchStructuredNotesDto();
    this.searchBondStructure(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchStructuredNotesDto() {
    const dto: TxInfoFbsDto = {
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined
      : Array.isArray(this.advancedSearchForm.cfStatus) ? this.advancedSearchForm.cfStatus : [this.advancedSearchForm.cfStatus],
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      custodian: this.isEmpty(this.advancedSearchForm.custodian) ? undefined : this.advancedSearchForm.custodian,
      invCategoryCode: this.isEmpty(this.advancedSearchForm.invCategoryCode) ? undefined : this.advancedSearchForm.invCategoryCode,
      bondCode: this.isEmpty(this.advancedSearchForm.bondCode) ? undefined : this.advancedSearchForm.bondCode,
      paymentSettleEndDate: !this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? moment(this.advancedSearchForm.paymentSettleDate[1]).format('YYYYMMDD') : null,
      paymentSettleStartDate: !this.isEmpty(this.advancedSearchForm.paymentSettleDate) ? moment(this.advancedSearchForm.paymentSettleDate[0]).format('YYYYMMDD') : null,
      settleEndDate: !this.isEmpty(this.advancedSearchForm.settleDate) ? moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD') : null,
      settleStartDate: !this.isEmpty(this.advancedSearchForm.settleDate) ? moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD') : null,
      tradeEndDate: !this.isEmpty(this.advancedSearchForm.tradeDate) ? moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD') : null,
      tradeStartDate: !this.isEmpty(this.advancedSearchForm.tradeDate) ? moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD') : null,
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
    };
    return dto;
  }

  // API進階查詢
  searchBondStructure(dto: TxInfoFbsDto) {
    this.setLoading(true);
    this.$foreignBondStructureApi.searchTxInfoUsingPOST(dto)
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

  // 進階查詢結果表格欄位排序
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchStructuredNotesDto();
    // call API
    this.searchBondStructure(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openSNCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;
    // 查詢成交資訊明細
    this.searchTxDetail(e.formData.txCode);
  }

  // 關閉檢視彈窗
  closeSNCheckInfoModal() {
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
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
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
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val };
    this.validateBeforeModifyCfStatus(dto).then((check) => {
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
    // 進行狀態檢核API (結構債-產檔前檢查邏輯跟其他不一樣)
    this.setLoading(true);
    await this.$foreignBondStructureApi.checkBeforeGenerateUsingPOST({ txCode: this.txCodeListFile })
      .then((res) => {
        if (!res.data.success) {
          InfoModal.alertError({ confirm: false, content: res.data?.message });
        } else {
          // 檢核成功開啟彈窗
          this.modalFileShow = true;
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

  // 關閉產檔彈窗
  closeFileModal() {
    this.modalFileShow = false;
  }

  // 點擊列印
  handleDataPrint() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    // 結構債先打開列印彈窗, 點下確認才檢查狀態
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    this.modalPrintShow = true;

    // 取得列印下拉選單
    this.getSearchFile();
  }

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
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
    // 驗證：交易確認狀態若含「已送審」、「已初核」、「已確認」時以訊息卡控「勾選的交易含送審後的資料，不可退回修改」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val };
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
    // 驗證：交易確認狀態「已確認」時以訊息卡控「已確認的資料不可退回解鎖」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val };
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
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val };
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

  // 點擊附件管理
  handleManageFile() {
    // 開啟附件管理彈窗
    this.modalManageFileShow = true;
  }

  // 關閉附件管理
  closeManageFileModal() {
    this.modalManageFileShow = false;
  }

  // 查詢成交資訊明細
  searchTxDetail(txCode: string) {
    this.setLoading(true);
    this.$foreignBondStructureApi.searchTxDetailUsingPOST({ txCode })
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

  // 異動交易確認狀態前檢查
  validateBeforeModifyCfStatus(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$foreignBondStructureApi.checkBeforeModifyCfStatusUsingPOST(dto)
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
  async modifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignBondStructureApi.modifyCfStatusUsingPATCH(dto)
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

  // 產檔確認送出
  async submitDataFile(e) {
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      custodian: e ? e.custodian : undefined,
    });
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
          // 關閉產檔彈窗
          this.closeFileModal();
        }
      },
    });
  }

  // 列印確認送出
  async submitDataPrint(e) {
    let check = false;
    await this.$foreignBondStructureApi.checkBeforeGenerateUsingPOST({ txCode: this.txCodeListFile, fileCode: e.fileCode })
      .then((res) => {
        if (!res.data.success) {
          InfoModal.alertError({ confirm: false, content: res.data?.message });
          check = false;
        } else {
          check = true;
        }
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        })
      .finally(() => {
        this.setLoading(false);
      });
    // 列印
    if (!check) return;
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
    });
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

  // 取得列印下拉選單
  async getSearchFile() {
    this.fileCodeOption = await this.$cfCommon.getSearchFile({
      productGroup: this.$cfEnum.printParam.StructuredNotes.productGroup,
      fileType: this.$cfEnum.printParam.StructuredNotes.fileType,
    });
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
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
