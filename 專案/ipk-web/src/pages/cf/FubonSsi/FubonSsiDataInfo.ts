import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import transferUtil from '@/plugins/util/transferUtil';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import { FubonSsiDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import DataCheckInfoModal from '@/pages/cf/FubonSsi/DataCheckInfoModal.vue';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    DataCheckInfoModal,
  },
})
export default class FubonSsiDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfo = { // [檢視彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  labelList: Array<AdvancedSearchModel> = [ // 進階查詢欄位名稱
    {
      label: '保管機構', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '幣別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '使用類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '啟用狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ];

  // [進階查詢] 預設表單內容 v-model綁定
  form = {
    custodianBankCode: undefined,
    currency: undefined,
    type: undefined,
    isEnable: '1',
  };

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: true,
    showOverflow: 'ellipsis',
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
        title: '更多操作',
        field: 'actionType',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '保管機構',
        field: 'custodianBankCode',
        width: 200,
      },
      {
        title: '幣別',
        field: 'currency',
        width: 130,
      },
      {
        title: '使用類別',
        field: 'type',
        width: 130,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return transferUtil.getSelectOption(this.$cfEnum.useTypeOption, data.cellValue)?.label;
        },
      },
      {
        title: '清算行銀行代碼',
        field: 'cashBankCode',
        width: 130,
      },
      {
        title: '清算行銀行帳號',
        field: 'cashAccount',
        width: 130,
      },
      {
        title: '清算行銀行戶名',
        field: 'cashAccountName',
      },
      {
        title: '啟用狀態',
        field: 'isEnable',
        width: 100,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          let num = String(data.cellValue);
          if (num === '1') {
            return '啟用';
          }
          if (num === '0') {
            return '停用';
          }
        },
      },
    ],
  };

  /**
  * watch
  */

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form, isEnable: '1' };
    // 下拉選單設定
    this.labelList.find((el) => el.label === '使用類別').options = this.$cfEnum.useTypeOption;
    this.labelList.find((el) => el.label === '使用類別').allOptions = this.$cfEnum.useTypeOption;
    this.labelList.find((el) => el.label === '啟用狀態').options = this.$cfEnum.isEnableOption;
    this.labelList.find((el) => el.label === '啟用狀態').allOptions = this.$cfEnum.isEnableOption;
    let custodianBankCodeOptions = await this.$cfCommon.getCustodianBankCodeOption();
    this.labelList.find((el) => el.label === '保管機構').options = custodianBankCodeOptions;
    this.labelList.find((el) => el.label === '保管機構').allOptions = custodianBankCodeOptions;
    let currencyOptions = await this.$cfCommon.getCurrencyOption([]);
    this.labelList.find((el) => el.label === '幣別').options = currencyOptions;
    this.labelList.find((el) => el.label === '幣別').allOptions = currencyOptions;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.DATA_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
  * methods
  */
  // -------------------查詢-------------------
  // 點擊進階查詢按鈕
  handleSearch() {
    let dto = this.setSearchFubonInstitutionDto(1, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchFubonInstitution(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchFubonInstitutionDto(pageNum: number, pageSize: number) {
    let dto = {
      isEnable: this.isEmpty(this.advancedSearchForm.isEnable) ? undefined : this.advancedSearchForm.isEnable,
      currency: this.isEmpty(this.advancedSearchForm.currency) ? undefined : this.advancedSearchForm.currency,
      custodianBankCode: this.isEmpty(this.advancedSearchForm.custodianBankCode) ? undefined : this.advancedSearchForm.custodianBankCode,
      type: this.isEmpty(this.advancedSearchForm.type) ? undefined : this.advancedSearchForm.type,
      sort: this.isEmpty(this.advancedSearchForm.sort) ? undefined : this.advancedSearchForm.sort,
      pageNum,
      pageSize,
    };
    return dto;
  }

  // 進階查詢
  searchFubonInstitution(dto: FubonSsiDto) {
    this.setLoading(true);
    this.$fubonSsiApi.paginateFubonSsiUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        const actionTypeOption = [...this.$cfEnum.actionTypeOption];
        actionTypeOption.pop();
        actionTypeOption.pop();

        this.ipkGrid.data = [];
        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              actionType: actionTypeOption,
              ...item,
            });
          });
        }

        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);

        // 查詢待放行清單筆數
        this.$emit('getPendingInfoCount');
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // -------------------其他-------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 頁數改變
  handlePageChange(e) {
    let dto = this.setSearchFubonInstitutionDto(e.currentPage, e.pageSize);
    // call API
    this.searchFubonInstitution(dto);
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    switch (e.actionType) {
      // 檢視
      case 'C':
        this.openCheckInfoModal(e.actionType, e.rowData);
        break;
    }
  }

  // 開啟檢視彈窗
  openCheckInfoModal(actionType, editDto) {
    this.modalCheckInfoShow = true;
    this.checkInfo.actionType = actionType;
    this.checkInfo.editInfo = editDto;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 子頁簽傳遞getPendingInfoCount 查詢待放行筆數更新
  getPendingInfoCount() {
    // 查詢待放行清單筆數
    this.$emit('getPendingInfoCount');
  }
}
