import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import transferUtil from '@/plugins/util/transferUtil';
import { InvestmentLimitReportPageDto } from '@fubonlife/ipk-api-axios-sdk';
import axios from 'axios';
import { toJSONString } from 'xe-utils';
import ExportUtil from '@/plugins/util/exportUtil';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
  },
})
export default class InvestmentLimitReportDownload extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  functionName = 'InvestmentLimitReportSetup' // [常用設定] 依照不同功能帶入不同functionName

  form = {
    baseDate: undefined,
    symId: undefined,
    counterPartyName: undefined,
    counterPartyId: undefined,
  }

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄排序規則

  customCodeList = [] // 商品代碼下拉選單

  counterPartyNameList = [] // 歸戶名稱下拉選單

  counterPartyIdList = [] // 機構編號下拉選單

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: true,
    showOverflow: 'tooltip',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作',
        field: 'actionType',
        headerAlign: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '基準日',
        field: 'baseDate',
        width: 130,
        sortable: false,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '商品代碼',
        field: 'customCode',
        sortable: false,
      },
      {
        title: '歸戶名稱',
        field: 'counterPartyName',
        sortable: false,
      },
      {
        title: '機構編號',
        field: 'counterPartyId',
        sortable: false,
      },
      {
        title: '產檔日期',
        field: 'createDate',
        sortable: false,
        width: 190,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '報表狀態',
        field: 'reportStatus',
        sortable: false,
        width: 120,
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$ipEnum.getObject('reportStatusEnum', row.reportStatus).color,
                text: this.$ipEnum.getObject('reportStatusEnum', row.reportStatus).key,
              },
            }),
          ],
        },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    { label: '基準日', placeholder: 'yyyy/MM/dd', type: 'datePicker' },
    {
      label: '商品代碼',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
    {
      label: '歸戶名稱',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
    {
      label: '機構編號',
      placeholder: '請至少輸3位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 3,
        filterOptions: [],
      },
    },
  ]

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢、常用設定」表單內容
    this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 取得下拉選單
    this.customCodeList = await this.getCustomCode();
    this.counterPartyNameList = await this.getCounterPartyName();
    this.counterPartyIdList = await this.getCounterPartyId();
    this.labelList.find((el) => el.label === '商品代碼').options = this.customCodeList;
    this.labelList.find((el) => el.label === '商品代碼').allOptions = this.customCodeList;
    this.labelList.find((el) => el.label === '歸戶名稱').options = this.counterPartyNameList;
    this.labelList.find((el) => el.label === '歸戶名稱').allOptions = this.counterPartyNameList;
    this.labelList.find((el) => el.label === '機構編號').options = this.counterPartyIdList;
    this.labelList.find((el) => el.label === '機構編號').allOptions = this.counterPartyIdList;
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.REPORT_DOWNLOAD_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
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

  // 取得更多操作及欄位資訊
  getActionType(e) {
    switch (e.actionType) {
      // 下載批次明細
      case 'D':
        const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.REPORT_DOWNLOAD_TAB.val, this.$buttonKey.buttonKey.DOWNLOAD.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertInfo({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.downloadInvestmentLimitReport(e);
        break;
    }
  }

  // 下載批次明細
  downloadInvestmentLimitReport(e) {
    // 整理後端所需格式
    let formData = new FormData();
    formData.append('downloadSequence', e.rowData.downloadSeq);

    this.setLoading(true);
    this.$investmentLimitReportApi.downloadInvestmentLimitReportUsingPOST(e.rowData.downloadSeq, { responseType: 'blob' })
      .then((response) => {
        const content = response.data;
        ExportUtil.dealDownloadData(content, `國內投資交易限額表-${e.rowData.baseDate}`, 'xlsx');
      })
      .catch(() => {
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 點擊進階查詢按鈕
  async handleSearch() {
    let dto = this.setInvestmentLimitReportDto(1, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInvestmentLimitReport(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setInvestmentLimitReportDto(pageNum: number, pageSize: number) {
    let dto = {
      baseDate: validateUtil.isEmpty(this.advancedSearchForm.baseDate) ? undefined : moment(this.advancedSearchForm.baseDate).format('YYYYMMDD'),
      symId: validateUtil.isEmpty(this.advancedSearchForm.symId) ? undefined : this.advancedSearchForm.symId.key,
      counterPartyName: validateUtil.isEmpty(this.advancedSearchForm.counterPartyName) ? undefined : this.advancedSearchForm.counterPartyName.key,
      counterPartyId: validateUtil.isEmpty(this.advancedSearchForm.counterPartyId) ? undefined : this.advancedSearchForm.counterPartyId.key,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchInvestmentLimitReport(dto: InvestmentLimitReportPageDto) {
    this.setLoading(true);
    this.$investmentLimitReportApi.paginateInvestmentLimitReportUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];

        if (!validateUtil.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              ...item,
              actionType: [{ label: '下載', value: 'D' }],
              actionTypeDisabled: item.reportStatus && (item.reportStatus !== 'E'),
            });
          });
        }

        this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
        this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
        this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);
      })
      .catch(() => {
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
    let dto = this.setInvestmentLimitReportDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInvestmentLimitReport(dto);
  }

  // 進階查詢頁數改變
  handlePageChange(e) {
    let dto = this.setInvestmentLimitReportDto(e.currentPage, e.pageSize);
    // call API
    this.searchInvestmentLimitReport(dto);
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    let baseDate = this.isEmpty(data.baseDate) ? undefined : moment(data.baseDate);

    const form = {
      baseDate,
      symId: this.toKeyLabelOption(transferUtil.getSelectOption(this.customCodeList, data.symId.toString())),
      counterPartyName: this.toKeyLabelOption(transferUtil.getSelectOption(this.counterPartyNameList, data.counterPartyName)),
      counterPartyId: this.toKeyLabelOption(transferUtil.getSelectOption(this.counterPartyIdList, data.counterPartyId)),
    };

    if (e.modalName === 'advancedSearch') {
      this.advancedSearchForm = form;
    } else {
      this.usualForm = form;
    }
  }

  // 設定常用彈窗儲存按鈕
  submitSaveUsual(e) {
    // 整理後端所需格式
    const data = e.usualForm;
    const setupQueryObj = {
      baseDate: data.baseDate,
      symId: this.isEmpty(data.symId) ? undefined : data.symId.key,
      counterPartyName: this.isEmpty(data.counterPartyName) ? undefined : data.counterPartyName.key,
      counterPartyId: this.isEmpty(data.counterPartyId) ? undefined : data.counterPartyId.key,
    };
    // 如果是修改常用設定,queryCode帶null
    const queryCode = e.actionType === this.$actEnum.constant.ADD.val ? null : e.usual.key;
    const querySetupEditDto = {
      actionType: e.actionType,
      functionName: this.functionName,
      queryName: e.selectedName,
      setupQuery: JSON.stringify(setupQueryObj),
      department: this.$actEnum.departmentConstant.DEPARTMENT_SYS,
      queryCode,
    };

    // call API
    this.setLoading(true);
    this.$querySetupApi.addOrModifyQuerySetupUsingPOST(querySetupEditDto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          // 呼叫子元件方法
          (this.$refs.advancedSearch as any).resetNameToOrigin();
          return;
        }
        // 成功
        this.$message.success({ content: message, duration: 10 });
        // 呼叫子元件方法
        (this.$refs.advancedSearch as any).getSetupList();
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 取得商品代碼下拉選單
  async getCustomCode() {
    let customCodeList = [];
    await this.$investmentLimitReportApi.searchCustomCodeUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          customCodeList.push(data);
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return customCodeList;
  }

  // 取得歸戶名稱下拉選單
  async getCounterPartyName() {
    let counterPartyNameList = [];
    this.$investmentLimitReportApi.searchCounterPartyNameUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          counterPartyNameList.push(data);
        });
      })
      .catch(() => {
        // API 失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return counterPartyNameList;
  }

  // 取得機構編號下拉選單
  async getCounterPartyId() {
    let counterPartyIdList = [];
    this.$investmentLimitReportApi.searchCounterPartyIdUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          counterPartyIdList.push(data);
        });
      })
      .catch(() => {
        // API 失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return counterPartyIdList;
  }

  toKeyLabelOption(option) {
    if (!option) {
      return undefined;
    }
    return {
      key: option ? option.value : undefined,
      label: option ? option.label : undefined,
    };
  }
}
