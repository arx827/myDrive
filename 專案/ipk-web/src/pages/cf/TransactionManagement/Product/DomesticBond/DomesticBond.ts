import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import InfoModal from '@/plugins/notification/infoModal';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import ReturnModal from '@product/ReturnModal.vue';
import moment from 'moment';
import { TxInfoDbDto, TxCodeArrayWithCfStatusDto } from '@fubonlife/ipk-api-axios-sdk';
import FileModal from '@/components/shared/modal/FileModal/FileModal.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import DBManageFileModal from '@/pages/cf/TransactionManagement/Product/DomesticBond/DBManageFileModal.vue';
import DBCheckInfoModal from '@/pages/cf/TransactionManagement/Product/DomesticBond/DBCheckInfoModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    ReturnModal,
    DBCheckInfoModal,
    DBManageFileModal,
    FileModal,
    PrintModal,
    IpkButton,
  },
})
export default class DomesticBond extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  USNmodalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoForm = {}; // [檢視彈窗] 欄位資訊

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
    txCode: undefined, // 交易編號
    invCategoryCode: undefined, // 資產類別
    oldPortfolio: undefined, // 舊Portfolio
    bsType: undefined, // 交易別
    isinCode: undefined, // 債券標的
    tradeDateRange: undefined, // 交易日(起)-交易日(迄)
    paymentSettleDateRnage: undefined, // 款交割日(起)-款交割日(迄)
    cfStatus: undefined, // 交易確認狀態
    isWi: undefined, // WI交易
    counterpartyId: undefined, // 交易對象
    attachmentStatus: undefined, // 附件狀態
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

  // usualForm = {}; // [常用設定] 表單內容 v-model綁定

  selectedRowList = []; // 已選取的待放行清單項目

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '交易流水編號', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '資產類別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '舊Portfolio', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '交易別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '債券標的', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '交易日(起)-交易日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '款交割日(起)-款交割日(迄)', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: 'WI交易', placeholder: '請選擇', type: 'singleSelect', options: this.$cfEnum.isWIOption, allOptions: this.$cfEnum.isWIOption, showSearch: true,
    },
    {
      label: '交易對象', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '附件狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
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
            })],
        },
      },
      {
        title: '前台覆核狀態',
        field: 'confirmStatus',
        fixed: 'left',
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
        title: '債券標的',
        field: 'isinCode',
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
        formatter: (data) => (data.cellValue ? `${data.cellValue}%` : null),
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
        title: 'Commission',
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
        width: 300,
        visible: true,
      },
      {
        title: '交易對象(中文)',
        field: 'counterpartyName',
        width: 220,
        visible: true,
      },
      {
        title: '舊Portifolio',
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
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '備註',
        field: 'memo',
        width: 170,
        visible: true,
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
      {
        title: '交割方式',
        field: 'settleType',
        width: 100,
        visible: true,
        slots: { default: 'editSelection' },
      },
      {
        title: '合併交割',
        field: 'isCombined',
        width: 100,
        visible: true,
        slots: { default: 'editSelection' },
        params: { labelInValue: true },
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
        title: '交易對象受款行銀行名稱',
        field: 'cpBfBankName',
        width: 200,
        visible: true,
      },
      {
        title: '附件狀態',
        field: 'attachmentStatus',
        width: 100,
        visible: true,
        formatter: (data) => {
          if (data.cellValue) {
            return this.$cfEnum.getLabel('attachmentStatusOption', data.cellValue);
          } return '';
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

  // 編輯/儲存/取消按鈕顯示控制
  isClickEditBtn = false; // 判斷是否點擊編輯按鈕

  tempOldData = []; // 暫存修改資料

  newData = []; // 修改後的資料

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
    this.form.cfStatus = this.$cfEnum.cfStatusEnum.filter((data) => data.val !== null && data.key !== '已確認')
    .map((data) => data.val); // 交易確認狀態，預設已放行/已鎖定/已比對/已送審/已初核
    this.form.invCategoryCode = this.$cfEnum.invCategoryCodeOption.map((item) => item.value); // 資產類別預設全選全部選項
    this.form.tradeDateRange = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    // 取得「進階查詢」表單內容
    // this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '附件狀態').options = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '附件狀態').allOptions = this.$cfEnum.attachmentStatusOption;
    this.labelList.find((el) => el.label === '資產類別').options = this.$cfEnum.invCategoryCodeOption;
    this.labelList.find((el) => el.label === '資產類別').allOptions = this.$cfEnum.invCategoryCodeOption;
    this.labelList.find((el) => el.label === '交易別').options = this.$cfEnum.transactionOption;
    this.labelList.find((el) => el.label === '交易別').allOptions = this.$cfEnum.transactionOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DOMESTIC_BOND_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
		if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch(false);
  }

  /**
    methods
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

  /**
	 * @summary 點擊進階查詢按鈕
	 * @param {boolean} isOperate: 是否為異動交易重查
	*/
  handleSearch(isOperate: boolean) {
    // 非交易確認過程清除勾選
    if (!isOperate) {
      this.clearCheckbox();
      this.selectedRowList = [];
      // 編輯按鈕回到初始
      this.isClickEditBtn = false;
    }
    // call API
    let dto = this.maptoInfoDbDto();
    this.searchTxInfo(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  maptoInfoDbDto() {
    const dto: TxInfoDbDto = {
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      invCategoryCode: this.isEmpty(this.advancedSearchForm.invCategoryCode) ? undefined : this.advancedSearchForm.invCategoryCode,
      oldPortfolio: this.isEmpty(this.advancedSearchForm.oldPortfolio) ? undefined : this.advancedSearchForm.oldPortfolio,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      isinCode: this.isEmpty(this.advancedSearchForm.isinCode) ? undefined : this.advancedSearchForm.isinCode,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : Array.isArray(this.advancedSearchForm.cfStatus) ? this.advancedSearchForm.cfStatus : [this.advancedSearchForm.cfStatus],
      isWi: this.isEmpty(this.advancedSearchForm.isWi) ? undefined : this.advancedSearchForm.isWi,
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      attachmentStatus: this.isEmpty(this.advancedSearchForm.attachmentStatus) ? undefined : this.advancedSearchForm.attachmentStatus,
      tradeEndDate: (this.advancedSearchForm.tradeDateRange && this.advancedSearchForm.tradeDateRange.length > 0) ? moment(this.advancedSearchForm.tradeDateRange[1]).format('YYYYMMDD') : null,
      tradeStartDate: (this.advancedSearchForm.tradeDateRange && this.advancedSearchForm.tradeDateRange.length > 0) ? moment(this.advancedSearchForm.tradeDateRange[0]).format('YYYYMMDD') : null,
      paymentSettleEndDate: (this.advancedSearchForm.paymentSettleDateRnage && this.advancedSearchForm.paymentSettleDateRnage.length > 0)
      ? moment(this.advancedSearchForm.paymentSettleDateRnage[1]).format('YYYYMMDD') : null,
      paymentSettleStartDate: (this.advancedSearchForm.paymentSettleDateRnage && this.advancedSearchForm.paymentSettleDateRnage.length > 0)
      ? moment(this.advancedSearchForm.paymentSettleDateRnage[0]).format('YYYYMMDD') : null,
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
    let dto = this.maptoInfoDbDto();
    // call API
    this.searchTxInfo(dto);
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

        if (respData.success) {
          InfoModal.alertSuccess({
            title: this.$cfMessageEnum.COMPARED_SUCCESS?.title,
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

  // 點擊編輯，顯示編輯欄位
  handleEdit() {
    // 暫存修改前的資料
    this.tempOldData = this.ipkGrid.data.map((item) => ({ ...item }));
    // 提供編輯欄位下拉選單的選單資料
    this.ipkGrid.data.map((el, index) => {
      el.settleType = el.settleType ? el.settleType : undefined;
      el.isCombined = el.isCombined ? el.isCombined : undefined;
      el.settleTypeOption = this.$cfEnum.settleTypeOption; // 交割方式下拉選單
      el.isCombinedOption = this.$cfEnum.yesOrNoOption; // 合併交割下拉選單
    });
    this.isClickEditBtn = true;
  }

  // 編輯欄位change
  handleEditChange(e) {
    let editBeforeValue = this.tempOldData[e.rowIndex][e.columnName];
    let editAfterValue = e.changedValue ? e.changedValue : null;

    // 取得newData中的所有txCode
    let allSerialNo = this.newData.map((item) => item.txCode);
    // 在所有txCode中尋找跟新資料的txCode相同的index
    let getIndex = allSerialNo.indexOf(e.rowData.txCode);

    // 如果更改的值跟原始的值不同
    if (editBeforeValue !== editAfterValue) {
      // 如果找不到相同值的話getIndex就會為 -1，並把新資料push進去
      if (getIndex === -1) {
        // 將此列修改的欄位名放在editColumnList並加進rowData中
        this.newData.push(
          { ...e.rowData, editColumnList: [e.columnName] },
        );
      } else {
        // 從newData中找到相同值並以其index抓出editColumnList
        const editColumnList = this.newData[getIndex].editColumnList;
        // 比對editColumnList中是否有當前修改的欄位名稱，沒有的話將此欄位名稱push進去
        if (!editColumnList.includes(e.columnName)) {
          editColumnList.push(e.columnName);
        }
        // 如果有找到相同txCode且當前修改的欄位名稱之前已有修改過，就會取得其index，把相同txCode的資料替換成新資料
        this.newData[getIndex] = { ...e.rowData, editColumnList: [e.columnName] };
      }
    } else {
      // 如果更改的值跟原始的值相同
      // 從newData中的editColumnList篩選出跟當前修改欄位不同的欄位
      let diffArr = this.newData[getIndex].editColumnList.filter((item) => item !== e.columnName);
      // 如果無篩選出不同欄位，代表與原始資料相符，將其從newData中移除
      if (this.isEmpty(diffArr)) {
        this.newData.splice(getIndex, 1);
      } else {
        // 如果有篩選出不同的欄位，代表有做其他修改，將篩選出的欄位放回editColumnList
        this.newData[getIndex] = { ...e.rowData, editColumnList: diffArr };
      }
    }
  }

  // 儲存編輯資料
  handleEditSave() {
    // 驗證是否有異動
    if (this.isEmpty(this.newData)) {
      this.handleCancelEdit();
      return;
    }
    // 整理後端格式
    let txCodeList = [];
    for (let i = 0; i < this.newData.length; i++) {
      txCodeList.push(this.newData[i].txCode);
    }
    let dto = { txCode: txCodeList };
    // call API
    this.validateBeforeSaveTxInfo(dto);
  }

  // 取消編輯
  handleCancelEdit() {
    this.isClickEditBtn = false;
    this.newData = [];
    this.ipkGrid.data = this.tempOldData;
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
    let check = await this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$domesticBondApi');
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
      productGroup: this.$cfEnum.printParam.DomesticBond.productGroup,
      fileType: this.$cfEnum.printParam.DomesticBond.fileType,
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
    }, '$domesticBondApi');
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

        if (respData.success) {
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

    // 異動交易確認狀態前檢查：狀態是壓成 7 「已比對」才可點選
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

        if (respData.success) {
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

    // 異動交易確認狀態前檢查: 狀態是壓成 0
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

        if (respData.success) {
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
  searchTxInfo(dto) {
    this.setLoading(true);
    this.$domesticBondApi.searchTxInfoUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];
        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            const yesOrNoOption = transferUtil.getSelectOption(this.$cfEnum.yesOrNoOption, item.isCombined);
            this.ipkGrid.data.push({
              ...item,
              // 編輯框顯示條件
              showInput: item.cfStatus === this.$cfEnum.cfStatusEnum.find((el) => el.key === '已比對').val,
              isCombined: { key: yesOrNoOption.value, label: yesOrNoOption.label },
            });
          });
          this.selectedRowList = this.selectedRowList.filter((selectedRow) => content.some((data) => data.txCode === selectedRow.txCode));
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
  searchSingleDetail(txCode: string) {
    this.setLoading(true);
    this.$domesticBondApi.searchTxDetailUsingPOST({ txCode })
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
  async validateBeforeModifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await	this.$domesticBondApi.checkBeforeModifyCfStatusUsingPOST(dto)
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

  // 異動交易確認狀態
  async modifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await this.$domesticBondApi.modifyCfStatusUsingPATCH(dto)
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

  // 儲存成交資訊前檢查
  validateBeforeSaveTxInfo(dto) {
    this.setLoading(true);
    this.$domesticBondApi.checkBeforeSaveTxInfoUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 儲存成交資訊
      this.saveTxInfo();
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }).finally(() => {
      this.setLoading(false);
    });
  }

  // 儲存成交資訊
  saveTxInfo() {
    // 整理後端格式
    this.newData.forEach((item) => {
      item.isCombined = item.isCombined.key;
    });
    // call API
    this.setLoading(true);
    this.$domesticBondApi.saveTxInfoUsingPATCH(this.newData)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      this.$message.success(message, 10);
      this.handleCancelEdit();
      this.handleSearch(false);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    }).finally(() => {
      this.setLoading(false);
    });
  }
}
