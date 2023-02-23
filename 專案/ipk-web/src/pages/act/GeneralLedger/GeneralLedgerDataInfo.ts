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
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
    CheckInfoModal,
  },
})
export default class GeneralLedgerDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  /** *  介接總帳紀錄檔 ** */
  form = {
    lotNumber: undefined,
    createDate: undefined,
  }

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  functionName = 'ActGeneralLedgerMaster' // [常用設定] 依照不同功能帶入不同functionName

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    tableHeight: '605px',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '批號',
        field: 'lotNumber',
        fixed: 'left',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '案件來源',
        field: 'caseFrom',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '狀態',
        field: 'status',
        width: 160,
        showOverflow: true,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('caseStatusGeneralLedgerEnum', row.status).color,
                text: this.$actEnum.getObject('caseStatusGeneralLedgerEnum', row.status).key,
              },
            }),
          ],
        },
      },
      {
        title: '錯誤訊息',
        field: 'errLog',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '部位上傳筆數',
        field: 'actCount',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '總帳上傳筆數',
        field: 'glCount',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '建立人員',
        field: 'createName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '建立日期',
        field: 'createDate',
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
      label: '批號', placeholder: '請選擇', type: 'multiSelect', options: undefined, showSearch: true, allOptions: [],
    },
    { label: '建立日期', placeholder: 'yyyy/mm/dd', type: 'rangePicker' },
  ]

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    lotNumber: { key: null, label: '批號', type: 'textarea' },
    caseFrom: { key: null, label: '案件來源', type: 'textarea' },
    status: { key: null, label: '狀態', type: 'textarea' },
    actCount: { key: null, label: '部位上傳筆數', type: 'textarea' },
    glCount: { key: null, label: '總帳上傳筆數', type: 'textarea' },
    createName: { key: null, label: '建立人員', type: 'textarea' },
    createDate: { key: null, label: '建立日期', type: 'date' },
    updateName: { key: null, label: '異動人員', type: 'textarea' },
    updateDate: { key: null, label: '異動日期', type: 'date' },
  };

  showSubmitFileBtn = false; // 是否顯示送審檔案按鈕

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  tempSort = undefined; // 紀錄排序規則

  /**
   * hook
   */
  created() {
    // 取得「進階查詢、常用設定」表單內容
    this.advancedSearchForm = { ...this.form };
    this.usualForm = { ...this.form };
    // 下拉選單
    this.labelList.find((el) => el.label === '批號').options = this.getLotNumberList();
    this.labelList.find((el) => el.label === '批號').allOptions = this.getLotNumberList();
    // 查詢
    this.handleSearch(false);
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data: any) {
    return validateUtil.isEmpty(data);
  }

  // 取得批號代碼下拉選單
  getLotNumberList() {
    let lotNumberList = [];
    this.$generalLedgerApi.searchLotNumberUsingGET()
    .then((res) => {
      res.data.content.forEach((data) => {
        lotNumberList.push(data);
      });
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
    return lotNumberList;
  }

  // 開啟檢視彈窗
  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;

    this.checkInfoContentForm.lotNumber.key = e.formData.lotNumber;
    this.checkInfoContentForm.caseFrom.key = e.formData.caseFrom;
    this.checkInfoContentForm.status.key = e.formData.status;
    this.checkInfoContentForm.actCount.key = e.formData.actCount;
    this.checkInfoContentForm.glCount.key = e.formData.glCount;
    this.checkInfoContentForm.errLog.key = e.formData.errLog;
    this.checkInfoContentForm.createName.key = e.formData.createName;
    this.checkInfoContentForm.createDate.key = e.formData.createDate;
    this.checkInfoContentForm.updateName.key = e.formData.updateName;
    this.checkInfoContentForm.updateDate.key = e.formData.updateDate;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 點擊進階查詢按鈕
  async handleSearch(isOperate: boolean) { // 新增/編輯/刪除成功重查下拉選單
    let dto = this.setSearchInfoDto();
    this.searchInfo(dto);

    if (isOperate) {
      this.labelList.find((el) => el.label === '批號').options = this.getLotNumberList();
    }
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchInfoDto() {
    let dto = {
      lotNumber: this.isEmpty(this.advancedSearchForm.lotNumber) ? undefined : this.advancedSearchForm.lotNumber,
      createStartDate: !this.isEmpty(this.advancedSearchForm.createDate) ? moment(this.advancedSearchForm.createDate[0]).format('YYYYMMDD') : null,
      createEndDate: !this.isEmpty(this.advancedSearchForm.createDate) ? moment(this.advancedSearchForm.createDate[1]).format('YYYYMMDD') : null,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchInfo(generalLedgerDto) {
    this.setLoading(true);
    this.$generalLedgerApi.searchGeneralLedgerUsingPOST(generalLedgerDto)
    .then((res) => {
      const content = res.data.content;
      this.ipkGrid.data = [...content];
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 介接總帳紀錄檔排序
  onSortChange(e) {
    this.tempSort = e.sort;
    let dto = this.setSearchInfoDto();
    // call API
    this.searchInfo(dto);
  }

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    let createStartDate = !validateUtil.isEmpty(data.createStartDate) ? moment(data.createStartDate) : null;
    let createEndDate = !validateUtil.isEmpty(data.createEndDate) ? moment(data.createEndDate) : null;

    const form = {
      lotNumber: data.lotNumber ? data.lotNumber : undefined,
      createDate: (!createStartDate && !createEndDate) ? null : [createStartDate, createEndDate],
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
      lotNumber: data.lotNumber,
      createStartDate: !validateUtil.isEmpty(data.createDate) ? moment(data.createDate[0]).format('YYYYMMDD') : null,
      createEndDate: !validateUtil.isEmpty(data.createDate) ? moment(data.createDate[1]).format('YYYYMMDD') : null,
    };
    // 如果是新增常用設定,queryCode帶null
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
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
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

  // 取得狀態代碼對應的中文字
  getCaseStatusEnum(status) {
    if (this.isEmpty(status)) {
      return;
    }
    return this.$actEnum.getObject('caseStatusEnum', status).key;
  }
}
