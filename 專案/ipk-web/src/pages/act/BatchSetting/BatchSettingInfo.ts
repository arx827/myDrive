import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import EditBatchModal from '@/pages/act/BatchSetting/EditBatchModal.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { BatchSettingDto } from '@fubonlife/ipk-api-axios-sdk';

@Component({
  components: {
    AdvancedSearch,
    EditBatchModal,
    CheckInfoModal,
    IpkVxeTable,
    IpkButton,
  },
})
export default class BatchSettingInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  functionName = 'BatchSetting' // [常用設定] 依照不同功能帶入不同functionName

  form = {
    jobDesc: undefined,
    updateStartDate: undefined,
    updateEndDate: undefined,
  }

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄排序規則

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
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作',
        field: 'actionType',
        fixed: 'left',
        headerAlign: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '批次描述',
        field: 'jobDesc',
        fixed: 'left',
        width: 300,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: { default: 'link' },
      },
      {
        title: 'URL',
        field: 'qrtzUrl',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '觸發時間',
        field: 'cronTrigger',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '是否開始排程',
        field: 'isExecutable',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('isExecutableEnum', row.isExecutable).color,
                text: this.$actEnum.getObject('isExecutableEnum', row.isExecutable).key,
              },
            }),
          ],
        },
      },
      {
        title: '異動人員',
        field: 'updateName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '批次描述', placeholder: '請輸入', type: 'inputText',
    },
    { label: '異動起日', placeholder: 'yyyy/mm/dd', type: 'datePicker' },
    { label: '異動訖日', placeholder: 'yyyy/mm/dd', type: 'datePicker' },
  ]

  modalEditInfoShow = false; // [修改彈窗] modal開關

  batchEditInfo = { // [修改彈窗] 後端邏輯
    actionType: null,
    editInfo: {},
  };

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    jobDesc: { key: null, label: '批次描述', type: 'textarea' },
    qrtzUrl: { key: null, label: 'URL', type: 'textarea' },
    cronTrigger: { key: null, label: '觸發時間', type: 'textarea' },
    cronTriggerName: { key: null, label: '觸發時間描述', type: 'textarea' },
    isExecutable: { key: null, label: '是否開始排程', type: 'badge' },
    updateName: { key: null, label: '異動人員', type: 'textarea' },
    updateDate: { key: null, label: '異動日期', type: 'dateTime' },

  };

  tempHistSort = undefined; // 紀錄排序規則

  histModalVisible = false; // [歷程] modal開關

  batchSettingDto = {}; // 查詢歷程表格-後端查詢dto

  histDataGrid: IpkVxeTableModel = { // [檢視歷程] 查詢結果
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
        title: '批次描述',
        field: 'jobDesc',
        width: '20%',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '批次名稱',
        field: 'jobName',
        width: '20%',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'URL',
        field: 'qrtzUrl',
        width: '20%',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '觸發時間',
        field: 'cronTrigger',
        width: 500,
        showOverflow: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '是否開始排程',
        field: 'isExecutable',
        width: '10%',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('isExecutableEnum', row.isExecutable).color,
                text: this.$actEnum.getObject('isExecutableEnum', row.isExecutable).key,
              },
            }),
          ],
        },
      },
      {
        title: '異動人員',
        field: 'updateName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  };

  /**
   * hook
   */
  created() {
    // 取得「進階查詢、常用設定」表單內容
    this.usualForm = { ...this.form };
    this.advancedSearchForm = { ...this.form };
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_SETTING_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
        InfoModal.alertInfo({
          confirm: false,
          content: getButtonsAuthInfoObj.message,
        });
        return;
      }
    // 查詢
    this.handleSearch(false);
  }

  /**
  * methods
  */
   isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    let getButtonsAuthInfoObj: any = {};
    switch (e.actionType) {
      // 檢視
      case 'C':
        this.openCheckInfoModal(e);
        break;
      // 修改
      case 'M':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_SETTING_TAB.val, this.$buttonKey.buttonKey.MODIFY.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertError({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openEditBatchModal(e);
        break;
      // 執行
      case 'S':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_SETTING_TAB.val, this.$buttonKey.buttonKey.EXECUTE.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertError({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.handleExecuteBatchSetting(e);
        break;
      // 歷程
      case 'H':
        this.openHistModal(e);
    }
  }

  // 開啟檢視歷程彈窗
  openHistModal(e) {
    this.histModalVisible = true;
    // 整理成後端格式
    this.batchSettingDto = {
      jobName: this.isEmpty(e.rowData.jobName) ? undefined : e.rowData.jobName,
      jobDesc: this.isEmpty(e.rowData.jobDesc) ? undefined : e.rowData.jobDesc,
    };

    let dto = this.setSearchHistoryInfoDto(1, this.histDataGrid.pagerConfig.pageSize);
    this.searchHistoryInfo(dto);
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;

    this.checkInfoContentForm.jobDesc.key = e.formData.jobDesc;
    this.checkInfoContentForm.qrtzUrl.key = e.formData.qrtzUrl;
    this.checkInfoContentForm.cronTrigger.key = e.formData.cronTrigger;
    this.checkInfoContentForm.cronTriggerName.key = e.formData.cronTriggerName;
    this.checkInfoContentForm.isExecutable.key = this.$actEnum.getObject('isExecutableEnum', e.formData.isExecutable);
    this.checkInfoContentForm.updateName.key = e.formData.updateName;
    this.checkInfoContentForm.updateDate.key = e.formData.updateDate;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 開啟修改/維護彈窗
  openEditBatchModal(e) {
    this.modalEditInfoShow = true;
    this.batchEditInfo.actionType = e.actionType;
    this.batchEditInfo.editInfo = e.rowData;
  }

  // 關閉修改彈窗
  closeEditBatchModal() {
    this.modalEditInfoShow = false;
  }

  // 執行批次
  handleExecuteBatchSetting(e) {
    this.setLoading(true);
    this.$batchSettingApi.executeBatchUsingGET(e.rowData.jobName)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      if (!isSuccess) {
        this.$message.error(message, 10);
        return;
      }
      this.$message.success(message, 10);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 點擊進階查詢按鈕
  async handleSearch(isOperate: boolean) { // 新增/編輯/刪除成功重查下拉選單
    let dto = this.setSearchInfoDto(1, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      jobDesc: this.isEmpty(this.advancedSearchForm.jobDesc) ? undefined : this.advancedSearchForm.jobDesc,
      updateEndDate: this.isEmpty(this.advancedSearchForm.updateEndDate) ? undefined : moment(this.advancedSearchForm.updateEndDate).format('YYYYMMDD'),
      updateStartDate: this.isEmpty(this.advancedSearchForm.updateStartDate) ? undefined : moment(this.advancedSearchForm.updateStartDate).format('YYYYMMDD'),
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchInfo(dto: BatchSettingDto) {
    this.setLoading(true);
    this.$batchSettingApi.paginateBatchSettingUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

      if (!validateUtil.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            actionType: this.$actEnum.getBatchOptionsEnum,
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
    let dto = this.setSearchInfoDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 進階查詢頁數改變
  handlePageChange(e) {
    let dto = this.setSearchInfoDto(e.currentPage, e.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 取得歷程資料
  searchHistoryInfo(dto) {
    // 整理成後端格式
    this.setLoading(true);
    this.$batchSettingApi.paginateBatchSettingHistoryUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.histDataGrid.data = [...content];
      this.histDataGrid.pagerConfig.currentPage = dto.pageNum;
      this.histDataGrid.pagerConfig.pageSize = dto.pageSize;
      this.histDataGrid.pagerConfig.total = parseInt(res.data.totalCount);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchHistoryInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      ...this.batchSettingDto,
      sort: this.tempSort,
      pageNum,
      pageSize,
    };
    return dto;
  }

  // 查詢歷程表格欄位排序
  onHistSortChange(e) {
    this.tempHistSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchHistoryInfoDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchHistoryInfo(dto);
  }

  // 歷程頁數改變
  handleHistPageChange(e) {
    let dto = this.setSearchHistoryInfoDto(e.pagerConfig.currentPage, e.pageSize);
    // call API
    this.searchHistoryInfo(dto);
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    const form = {
      jobDesc: data.jobDesc ? data.jobDesc : undefined,
      updateStartDate: !validateUtil.isEmpty(data.updateStartDate) ? moment(data.updateStartDate) : null,
      updateEndDate: !validateUtil.isEmpty(data.updateEndDate) ? moment(data.updateEndDate) : null,
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
      jobDesc: data.jobDesc,
      updateStartDate: !validateUtil.isEmpty(data.updateStartDate) ? moment(data.updateStartDate).format('YYYYMMDD') : null,
      updateEndDate: !validateUtil.isEmpty(data.updateEndDate) ? moment(data.updateEndDate).format('YYYYMMDD') : null,
    };
    // 如果是修改常用設定,queryCode帶null
    const queryCode = e.actionType === this.$actEnum.constant.ADD.val ? null : e.usual.key;
    const querySetupEditDto = {
      actionType: e.actionType,
      functionName: this.functionName,
      queryName: e.selectedName,
      setupQuery: JSON.stringify(setupQueryObj),
      department: this.$actEnum.departmentConstant.DEPARTMENT_ACCOUNTING,
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
}
