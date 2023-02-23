import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import EditBatchModal from '@/pages/act/BatchSetting/EditBatchModal.vue';
import exportUtil from '@/plugins/util/exportUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { BatchLogDto } from '@fubonlife/ipk-api-axios-sdk';

@Component({
  components: {
    AdvancedSearch,
    EditBatchModal,
    IpkVxeTable,
    IpkButton,
  },
})
export default class BatchLogInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  functionName = 'BatchLog' // [常用設定] 依照不同功能帶入不同functionName

  form = {
    jobDesc: undefined,
    createStartDate: undefined,
    createEndDate: undefined,
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
    showOverflow: 'tooltip',
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
        title: 'JOB_ID',
        field: 'jobId',
        width: 100,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '批次描述',
        field: 'jobDesc',
        width: 300,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: 'IP',
        field: 'ip',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '觸發來源',
        field: 'urlFrom',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '執行機器',
        field: 'hostName',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '執行時間',
        field: 'createDate',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '開始時間',
        field: 'startDate',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '結束時間',
        field: 'endDate',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
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
    { label: '批次描述', placeholder: '請輸入', type: 'inputText' },
    { label: '執行起日', placeholder: 'yyyy/mm/dd', type: 'datePicker' },
    {
      label: '執行訖日', placeholder: 'yyyy/mm/dd', type: 'datePicker',
    },
  ]

  batchDetailModalVisible = false; // [批次明細] modal開關

  batchLogDto = {}; // 查詢批次明細表格-後端查詢dto

  batchDetailDataGrid: IpkVxeTableModel = { // [檢視批次明細] 查詢結果
    data: [],
    pagerConfig: {
      enabled: false,
    },
    border: true,
    showOverflow: 'tooltip',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '步驟ID',
        field: 'stepExecutionId',
        width: 140,
      },
      {
        title: '步驟名稱',
        field: 'stepName',
        width: 140,
        showOverflow: true,
      },
      {
        title: '開始時間',
        field: 'startTime',
        width: 140,
        showOverflow: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '結束時間',
        field: 'endTime',
        width: 140,
        showOverflow: true,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '狀態',
        field: 'status',
        width: 140,
        slots: {
          default: ({ row }, h) => [
            h('a-tag',
            { props: { color: this.$actEnum.getObject('batchLogStatusEnum', row.status).color } },
            this.$actEnum.getObject('batchLogStatusEnum', row.status).key),
          ],
        },
      },
      {
        title: '結束碼',
        field: 'exitCode',
        width: 140,
        slots: {
          default: ({ row }, h) => [
            h('a-tag',
            { props: { color: this.$actEnum.getObject('batchLogStatusEnum', row.exitCode).color } },
            this.$actEnum.getObject('batchLogStatusEnum', row.exitCode).key),
          ],
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
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_LOG_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
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
  // 取得更多操作及欄位資訊
  getActionType(e) {
    let getButtonsAuthInfoObj: any = {};
    switch (e.actionType) {
      // 下載批次明細
      case 'D':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_LOG_TAB.val, this.$buttonKey.buttonKey.DOWNLOAD.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertError({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.downloadBatchLog(e);
        break;
      // 檢視批次明細
      case 'H':
        getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.BATCH_LOG_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
        if (!getButtonsAuthInfoObj.byPass) {
          InfoModal.alertError({
            confirm: false,
            content: getButtonsAuthInfoObj.message,
          });
          return;
        }
        this.openBatchDetailModal(e);
    }
  }

  // 下載批次明細
  downloadBatchLog(e) {
    this.$batchSettingApi.downloadLogFileUsingPOST(e.rowData.jobId, { responseType: 'blob' })
      .then((res) => {
        exportUtil.dealDownloadData(res.data, `${e.rowData.jobName}_${e.rowData.createDate}`, 'txt');
        this.$message.success('下載成功', 10);
      })
      .catch(() => {
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
  }

  // 開啟檢視批次明細彈窗
  openBatchDetailModal(e) {
    this.batchDetailModalVisible = true;
    // 查詢批次明細
    this.searchBatchLogDetail(e.rowData.jobId);
  }

  // 查詢批次明細
  searchBatchLogDetail(jobId) {
    this.setLoading(true);
    this.$batchSettingApi.searchBatchLogDetailUsingPOST(jobId)
    .then((res) => {
      const content = res.data.content;
      this.batchDetailDataGrid.data = [...content];
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
      jobDesc: validateUtil.isEmpty(this.advancedSearchForm.jobDesc) ? undefined : this.advancedSearchForm.jobDesc,
      createStartDate: validateUtil.isEmpty(this.advancedSearchForm.createStartDate) ? undefined : moment(this.advancedSearchForm.createStartDate).format('YYYYMMDD'),
      createEndDate: validateUtil.isEmpty(this.advancedSearchForm.createEndDate) ? undefined : moment(this.advancedSearchForm.createEndDate).format('YYYYMMDD'),
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchInfo(dto: BatchLogDto) {
    this.setLoading(true);
    this.$batchSettingApi.paginateBatchLogUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [];

      if (!validateUtil.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            actionType: this.$actEnum.getBatchLogOptionsEnum,
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

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    const form = {
      jobDesc: data.jobDesc ? data.jobDesc : undefined,
      createStartDate: !validateUtil.isEmpty(data.createStartDate) ? moment(data.createStartDate).format('YYYYMMDD') : null,
      createEndDate: !validateUtil.isEmpty(data.createEndDate) ? moment(data.createEndDate).format('YYYYMMDD') : null,
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
      createStartDate: !validateUtil.isEmpty(data.createStartDate) ? moment(data.createStartDate).format('YYYYMMDD') : null,
      createEndDate: !validateUtil.isEmpty(data.createEndDate) ? moment(data.createEndDate).format('YYYYMMDD') : null,
    };
    // 如果是新增常用設定,queryCode帶null
    const queryCode = e.actionType === this.$actEnum.constant.ADD.val ? null : e.usual.key;
    const querySetupEditDto = {
      actionType: e.actionType,
      functionName: this.functionName,
      queryName: e.selectedName,
      setupQuery: JSON.stringify(setupQueryObj),
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
