import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import DateUtil from '@/plugins/util/dateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import ReturnModal from '@product/ReturnModal.vue';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import FileModal from '@/components/shared/modal/FileModal/FileModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import { TxInfoDto, TxCodeArrayWithCfStatusDto } from '@fubonlife/ipk-api-axios-sdk';
import FECheckInfoModal from '@product/ForeignEquity/FECheckInfoModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ForeignEquityManageFileModal from './ForeignEquityManageFileModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    ReturnModal,
    FECheckInfoModal,
    PrintModal,
    ForeignEquityManageFileModal,
    FileModal,
    IpkButton,
  },
})
export default class ForeignEquity extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = {
    txCode: undefined, // 交易編號
    hierarchyDesc: undefined, // 交易階層
    tradeDate: undefined, // 交易日
    settleDate: undefined, // 券交割日
    counterpartyId: undefined, // 交易對手
    currency: undefined, // 幣別
    isAsia: undefined, // 市場別
    cfStatus: [], // 交易確認狀態
    dealType: undefined, // 成交類別
    bsType: undefined, // 買賣類別
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
        title: '買賣類別',
        field: 'bsType',
        width: 100,
        visible: true,
      },
      {
        title: '交易階層',
        field: 'hierarchyDesc',
        width: 160,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
        width: 90,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '商品代碼',
        field: 'productCode',
        width: 100,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'ISIN',
        field: 'isinCode',
        width: 140,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '商品名稱',
        field: 'productName',
        width: 300,
        visible: true,
      },
      {
        title: '交易對手',
        field: 'counterpartyId',
        width: 300,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '預計認購單位數',
        field: 'estNpa',
        width: 140,
        visible: true,
        align: 'right',
      },
      {
        title: '實際買/賣單位數',
        field: 'actNpa',
        width: 160,
        visible: true,
        align: 'right',
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
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '繳款日',
        field: 'estPaymentDate',
        width: 140,
        visible: true,
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
        title: '預計成交價格',
        field: 'estTradePrice',
        width: 140,
        visible: true,
        align: 'right',
      },
      {
        title: '成交價',
        field: 'actTradePrice',
        width: 140,
        visible: true,
        align: 'right',
      },
      {
        title: '預計成交金額',
        field: 'estApDealAmount',
        width: 140,
        visible: true,
        align: 'right',
      },
      {
        title: '成交金額',
        field: 'actApDealAmount',
        width: 140,
        visible: true,
        align: 'right',
      },
      {
        title: '手續費及佣金',
        field: 'fee',
        width: 140,
        visible: true,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '其他費用(含交易稅)',
        field: 'commission',
        width: 160,
        visible: true,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '收付款金額',
        field: 'paymentAc',
        width: 140,
        visible: true,
        align: 'right',
        formatter: (data) => transferUtil.transferPrice(data.cellValue),
      },
      {
        title: '保管行/收付款機構',
        field: 'safekeepingSsi',
        width: 170,
        visible: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '保銀下指示日',
        field: 'equityCutOffDate',
        width: 140,
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
        title: '保銀下指示時間',
        field: 'equityCutOffTime',
        width: 170,
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
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getKey('apvlLevelEnum', data.cellValue);
        },
      },
      {
        title: '預付交易單號及備註',
        field: 'memo',
        width: 170,
        visible: true,
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
      label: '交易階層', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '券交割日', placeholder: '請選擇', type: 'rangePicker',
    },
    {
      label: '交易對手', placeholder: '請輸入', type: 'inputText',
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '市場別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '交易確認狀態', placeholder: '請選擇', type: 'multiSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '成交類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '買賣類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ]

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  formData = {}; // [檢視彈窗] 欄位資訊

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
    this.form.hierarchyDesc = this.$cfEnum.hierarchyDescOption.find((el) => el.label === '國外股權收益部').value; // 交易階層，預設國外股權收益部
    this.form.tradeDate = [moment(new Date()), moment(new Date())]; // 交易日，預設系統日
    this.form.dealType = this.$cfEnum.dealTypeOption.find((el) => el.label === '實際交易').value;
    this.form.cfStatus = this.$cfEnum.cfStatusEnum.filter((data) => data.val !== null && data.key !== '已確認')
    .map((data) => data.val); // 交易確認狀態，預設已放行/已鎖定/已比對/已送審/已初核

    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form };
    // 下拉選單
    this.labelList.find((el) => el.label === '交易階層').options = this.$cfEnum.hierarchyDescOption;
    this.labelList.find((el) => el.label === '交易階層').allOptions = this.$cfEnum.hierarchyDescOption;
    this.labelList.find((el) => el.label === '市場別').options = this.$cfEnum.isAsiaOption;
    this.labelList.find((el) => el.label === '市場別').allOptions = this.$cfEnum.isAsiaOption;
    this.labelList.find((el) => el.label === '交易確認狀態').options = this.getStatusOption();
    this.labelList.find((el) => el.label === '交易確認狀態').allOptions = this.getStatusOption();
    this.labelList.find((el) => el.label === '成交類別').options = this.$cfEnum.dealTypeOption;
    this.labelList.find((el) => el.label === '成交類別').allOptions = this.$cfEnum.dealTypeOption;
    let currencyOption = await this.$cfCommon.getCurrencyOption(['TWD']);
    this.labelList.find((el) => el.label === '幣別').options = currencyOption;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOption;
    let buySellTypeOptions = await this.$cfCommon.getBuySellType();
    this.labelList.find((el) => el.label === '買賣類別').options = buySellTypeOptions;
    this.labelList.find((el) => el.label === '買賣類別').allOptions = buySellTypeOptions;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.FOREIGN_EQUITY_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
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
    // 依照成交類別判斷table顯示"預付"還是"實際"欄位
    this.setEstOrActColumn(this.advancedSearchForm.dealType);
    // call API
    let dto = this.setSearchForeignEquityDto();
    this.searchForeignEquity(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchForeignEquityDto() {
    let dto = {
      txCode: this.isEmpty(this.advancedSearchForm.txCode) ? undefined : this.advancedSearchForm.txCode,
      hid: this.isEmpty(this.advancedSearchForm.hierarchyDesc) ? undefined : this.advancedSearchForm.hierarchyDesc,
      tradeStartDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[0]).format('YYYYMMDD'),
      tradeEndDate: this.isEmpty(this.advancedSearchForm.tradeDate) ? undefined : moment(this.advancedSearchForm.tradeDate[1]).format('YYYYMMDD'),
      settleStartDate: this.isEmpty(this.advancedSearchForm.settleDate) ? undefined : moment(this.advancedSearchForm.settleDate[0]).format('YYYYMMDD'),
      settleEndDate: this.isEmpty(this.advancedSearchForm.settleDate) ? undefined : moment(this.advancedSearchForm.settleDate[1]).format('YYYYMMDD'),
      counterpartyId: this.isEmpty(this.advancedSearchForm.counterpartyId) ? undefined : this.advancedSearchForm.counterpartyId,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      isAsia: this.isEmpty(this.advancedSearchForm.isAsia) ? undefined : this.advancedSearchForm.isAsia,
      cfStatus: this.isEmpty(this.advancedSearchForm.cfStatus) ? undefined : this.advancedSearchForm.cfStatus,
      dealType: this.isEmpty(this.advancedSearchForm.dealType) ? undefined : this.advancedSearchForm.dealType,
      bsType: this.isEmpty(this.advancedSearchForm.bsType) ? undefined : this.advancedSearchForm.bsType,
      sort: this.isEmpty(this.tempSort) ? null : this.tempSort,
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
  searchForeignEquity(dto: TxInfoDto) {
    this.setLoading(true);
    this.$foreignEquityApi.searchTxInfoUsingPOST(dto)
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
    let dto = this.setSearchForeignEquityDto();
    // call API
    this.searchForeignEquity(dto);
  }

  // 取得checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;
    // 查詢成交資訊明細
    this.searchTxDetail(e.formData.txCode);
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
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
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
    let dto = { txCode: txCodeList, cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val };
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

  // 點擊產檔
  handleDataFile() {
    if (this.isEmpty(this.selectedRowList)) {
      InfoModal.alertInfo({ confirm: false, content: this.$cfMessageEnum.TX_CONFRIM_VALIDATE_INFO?.message });
      return;
    }
    // 驗證：檢核勾選的交易，交易確認狀態若非「已比對」以訊息卡控「勾選狀態不符不可產檔」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 產檔前檢查
    this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$foreignEquityApi').then((res) => {
      const message = res.message;
      const isSuccess = res.success;
      // 檢查失敗
      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      // 打開產檔彈窗
      this.modalFileShow = true;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
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
    // 驗證：檢核勾選的交易，交易確認狀態若非「已比對」以訊息卡控「勾選狀態不符不可列印」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 列印前檢查
    this.$generateFileCommon.validateBeforeGenerate(this.txCodeListFile, '$foreignEquityApi').then(async (res) => {
      const message = res.message;
      const isSuccess = res.success;
      // 檢查失敗
      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      // 取得列印下拉選單
      this.getSearchFile();
      // 打開列印彈窗
      this.modalPrintShow = true;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
  }

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
    this.defaultVal.fileCode = undefined;
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
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
    // 驗證：交易確認狀態須為「已比對」，否則以訊息卡控「狀態不符不可退回修改」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val };
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
    // 驗證：交易確認狀態須為「已鎖定」、「已比對」、「已送審」、「已初核」，否則以訊息卡控「狀態不符不可退回解鎖」
    this.txCodeListFile = [];
    for (let i = 0; i < this.selectedRowList.length; i++) {
      this.txCodeListFile.push(this.selectedRowList[i].txCode);
    }
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: this.txCodeListFile, cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val };
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
    this.$foreignEquityApi.searchDetailUsingPOST({ txCode })
    .then((res) => {
      const content = res.data.content;

      this.formData = content;
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
      this.$foreignEquityApi.checkBeforeModifyCfStatusUsingPOST(dto)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
          reject();
      }).finally(() => {
        this.setLoading(false);
      });
    });
  }

  // 異動交易確認狀態
  async modifyCfStatus(dto: TxCodeArrayWithCfStatusDto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignEquityApi.modifyCfStatusUsingPATCH(dto)
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
    }).finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // 產檔確認送出
  async submitDataFile(e) {
    // 產檔
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      custodian: e ? e.custodian : undefined,
    }, '$foreignEquityApi');
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
      onCallback: () => {
        // 下載檔案
        if (!this.isEmpty(fileData)) {
          setTimeout(async () => {
            this.$generateFileCommon.download(fileData.fileId, fileData.fileDesc, fileData.fileExtension);
          }, this.$cfEnum.downloadTime);
        }
        // 關閉產檔彈窗
        this.closeFileModal();
      },
    });
  }

  // 列印確認送出
  async submitDataPrint(e) {
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: this.txCodeListFile,
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
      custodian: undefined,
    }, '$foreignEquityApi');
    // 列印失敗
    if (!data.success) {
      InfoModal.alertError({ confirm: false, content: data.message });
      return;
    }
    // 列印成功
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
      productGroup: this.$cfEnum.printParam.ForeignEquity.productGroup,
      fileType: this.$cfEnum.printParam.ForeignEquity.fileType,
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
