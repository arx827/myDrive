import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import AddAndEditModal from '@/pages/is/IpoReportSetting/AddAndEditModal.vue';
import { IpoReportSettingEditDto, IpoReportSettingPageDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel, SortItem } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import validateUtil from '@/plugins/util/validateUtil';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import transferUtil from '@/plugins/util/transferUtil';

@Component({
  components: {
    AdvancedSearch,
    AddAndEditModal,
    IpkButton,
    IpkVxeTable,
    CheckInfoModal,
  },
})
export default class IpoReportSettingDataInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    { label: '日期', placeholder: 'yyyy/MM/dd', type: 'rangePicker' },
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
    { label: '股數/面額', type: 'inputText' },
    {
      label: '投資分類3',
      placeholder: '請至少輸入2位數關鍵字搜尋選項清單',
      type: 'singleSelect',
      options: undefined,
      allOptions: [],
      labelInValue: true,
      showSearch: true,
      showSelfDefined: {
        limitNum: 2,
        filterOptions: [],
      },
    },
    {
      label: '商品類別', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [],
    },
    {
      label: '狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [],
    },
  ]

  form = {
    date: undefined,
    symId: undefined,
    sharesValue: undefined,
    investmentClass3: undefined,
    customType: undefined,
    caseStatus: undefined,
  }

  public caseStatusOptions = [
    { label: '適用中', value: 'E' },
    { label: '維護中', value: 'U' },
    { label: '待審核', value: 'W' },
    { label: '已拒絕', value: 'R' },
    { label: '歷史件', value: 'H' },
  ]

  public customTypeOptions = [
    { label: '股票基金', value: 'S' },
    { label: '債券', value: 'B' },
  ]

  usualForm = {}; // [常用設定] 表單內容 v-model綁定

  functionName = 'IpoReportSettingPage' // [常用設定] 依照不同功能帶入不同functionName

  formRules: { [key: string]: ValidationRule[] } = {
  }; // 進階查詢驗證規則

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
        field: 'action',
        fixed: 'left',
        headerAlign: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '項次',
        field: 'seqNo',
        fixed: 'left',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: { default: 'link' },
      },
      {
        title: '日期',
        field: 'date',
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
        title: '商品代碼',
        field: 'customCode',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '股數/面額',
        field: 'sharesValue',
        width: 180,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return transferUtil.transferPrice(data.cellValue);
        },
      },
      {
        title: '投資分類3',
        field: 'investmentClass3EngName',
        width: 200,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '商品類別',
        field: 'customType',
        width: 160,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          if (data.cellValue === 'S') {
            return '股票基金';
          }
          return '債券';
        },
      },
      {
        title: '狀態',
        field: 'caseStatus',
        width: 160,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$actEnum.getObject('caseStatusEnum', row.caseStatus).color,
                text: this.$actEnum.getObject('caseStatusEnum', row.caseStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '操作類型',
        field: 'actionType',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.getActionTypeEnum(data.cellValue);
        },
      },
      {
        title: '拒絕原因',
        field: 'rejectReason',
        width: 140,
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
      {
        title: '覆核人員',
        field: 'reviewName',
        width: 140,
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
      },
      {
        title: '覆核日期',
        field: 'reviewDate',
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

  checkInfoContentForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 表單內容 v-model綁定及表單欄位名稱
    seqNo: { key: null, label: '項次', type: 'textarea' },
    date: { key: null, label: '日期', type: 'date' },
    customCode: { key: null, label: '商品代號', type: 'textarea' },
    sharesValue: { key: null, label: '股數/面額', type: 'textarea' },
    investmentClass3EngName: { key: null, label: '投資分類3', type: 'textarea' },
    customType: { key: null, label: '商品類別', type: 'textarea' },
    caseStatus: { key: null, label: '狀態', type: 'badge' },
    rejectReason: { key: null, label: '拒絕原因', type: 'textarea' },
    createName: { key: null, label: '建立人員', type: 'textarea' },
    createDate: { key: null, label: '建立日期', type: 'date' },
    updateName: { key: null, label: '異動人員', type: 'textarea' },
    updateDate: { key: null, label: '異動日期', type: 'date' },
    reviewName: { key: null, label: '覆核人員', type: 'textarea' },
    reviewDate: { key: null, label: '覆核日期', type: 'date' },
    serialNo: { key: null, label: '流水號', type: 'action' },
    symId: { key: null, label: '系統Id', type: 'action' },
  };

  exportColumns = [ // [匯出資訊] 表頭
    { label: '項次', field: 'seqNo' },
    { label: '日期', field: 'date' },
    { label: '商品代碼', field: 'customCode' },
    { label: '股數/面額', field: 'sharesValue' },
    { label: '投資分類3', field: 'investmentClass3EngName' },
    { label: '商品類別', field: 'customType' },
    { label: '狀態', field: 'caseStatus' },
    { label: '操作類型', field: 'actionType' },
    { label: '拒絕原因', field: 'rejectReason' },
    { label: '建立人員', field: 'createName' },
    { label: '建立日期', field: 'createDate' },
    { label: '異動人員', field: 'updateName' },
    { label: '異動日期', field: 'updateDate' },
    { label: '覆核人員', field: 'reviewName' },
    { label: '覆核日期', field: 'reviewDate' },
  ]

  exportData = [] // [匯出資訊] 內容

  fileName = 'IPO現增報表設定資料明細'; // 匯出檔名

  fileType = 'xlsx'; // 匯出檔案類型

  sheetName = 'IPO現增報表設定'; // 資料表名稱

  showAddBtn = true; // 是否顯示新增按鈕

  modalAddInfoShow = false; // [新增彈窗] modal開關

  addAndEditInfo = { // [新增彈窗] 後端邏輯-新增/修改
    actionType: null,
    editInfo: {},
  };

  tempSort: SortItem = undefined

  customCodeList = [] // 商品代號下拉選單

  investmentClass3List = [] // 投資分類3下拉選單

  /**
  * watch
  */
  @Watch('ipkGrid.data', { immediate: true, deep: true })
  onChange(val) {
    this.exportData = [];

    val.forEach((item) => {
      this.exportData.push({
        seqNo: item.seqNo,
        date: !validateUtil.isEmpty(item.date) ? moment(item.date).format('YYYY/MM/DD') : null,
        customCode: item.customCode,
        sharesValue: transferUtil.transferPrice(item.sharesValue),
        investmentClass3EngName: item.investmentClass3EngName,
        customType: item.customType == 'S' ? '股票基金' : '債券',
        caseStatus: item.caseStatus ? this.getCaseStatusEnum(item.caseStatus) : null,
        actionType: this.getActionTypeEnum(item.actionType),
        rejectReason: item.rejectReason,
        createName: item.createName,
        createDate: !validateUtil.isEmpty(item.createDate) ? moment(item.createDate).format('YYYY/MM/DD') : null,
        updateName: item.updateName,
        updateDate: !validateUtil.isEmpty(item.updateDate) ? moment(item.updateDate).format('YYYY/MM/DD') : null,
        reviewName: item.reviewName,
        reviewDate: !validateUtil.isEmpty(item.reviewDate) ? moment(item.reviewDate).format('YYYY/MM/DD') : null,
      });
    });
  }

  /**
   * hook
   */
  async created() {
    // 取得「進階查詢、常用設定」表單內容
    this.advancedSearchForm = transferUtil.deepCopyData(this.form);
    this.usualForm = transferUtil.deepCopyData(this.form);
    // 取得下拉選單
    this.labelList.find((el) => el.label === '商品類別').options = this.customTypeOptions; // 商品類別
    this.labelList.find((el) => el.label === '商品類別').allOptions = this.customTypeOptions; // 商品類別
    this.labelList.find((el) => el.label === '狀態').options = this.caseStatusOptions; // 狀態
    this.labelList.find((el) => el.label === '狀態').allOptions = this.caseStatusOptions; // 狀態
    this.investmentClass3List = this.getInvestmentClass3();
    this.labelList.find((el) => el.label === '投資分類3').options = this.investmentClass3List; // 投資分類3
    this.labelList.find((el) => el.label === '投資分類3').allOptions = this.investmentClass3List; // 投資分類3
    this.customCodeList = await this.getCustomCode();
    this.labelList.find((el) => el.label === '商品代碼').options = this.customCodeList; // 商品代碼
    this.labelList.find((el) => el.label === '商品代碼').allOptions = this.customCodeList; // 商品代碼
    // 預設資料明細狀態為適用中
    this.advancedSearchForm.caseStatus = this.caseStatusOptions.find((el) => el.label === '適用中').value;
    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
		}
    // 查詢
    this.handleSearch(false);
  }

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfoGrid = { // [檢視彈窗] 查詢結果
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [],
  };

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  /**
   * method
   */

  getCaseStatusEnum(status) {
    if (validateUtil.isEmpty(status)) {
      return;
    }
    return this.$actEnum.getObject('caseStatusEnum', status).key;
  }

  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 設定常用彈窗儲存按鈕
  submitSaveUsual(e) {
    // 整理後端所需格式
    const data = e.usualForm;
    const setupQueryObj = {
      startDate: this.isEmpty(data.date) ? null : moment(data.date[0]).format('YYYYMMDD'),
      endDate: this.isEmpty(data.date) ? null : moment(data.date[1]).format('YYYYMMDD'),
      symId: this.isEmpty(data.symId) ? undefined : data.symId.key,
      sharesValue: this.isEmpty(data.sharesValue) ? undefined : data.sharesValue,
      investmentClass3: this.isEmpty(data.investmentClass3) ? undefined : data.investmentClass3.key,
      customType: data.customType,
      caseStatus: data.caseStatus,
    };
    // 如果是新增常用設定,queryCode帶null
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

  // 點擊設定常用下拉選單，取得內容
  querySetupData(e) {
    const data = e.querySetupData;

    let startDate = this.isEmpty(data.startDate) ? null : moment(data.startDate);
    let endDate = this.isEmpty(data.endDate) ? null : moment(data.endDate);

    const form = {
      date: (!startDate && !endDate) ? undefined : [startDate, endDate],
      symId: this.toKeyLabelOption(this.customCodeList.find((el) => el.value == data.symId)),
      sharesValue: this.isEmpty(data.sharesValue) ? undefined : data.sharesValue,
      investmentClass3: this.toKeyLabelOption(this.investmentClass3List.find((el) => el.value == data.investmentClass3)),
      customType: this.isEmpty(data.customType) ? undefined : data.customType,
      caseStatus: this.isEmpty(data.caseStatus) ? undefined : data.caseStatus,
    };

    if (e.modalName === 'advancedSearch') {
      this.advancedSearchForm = form;
    } else {
      this.usualForm = form;
    }
  }

  // 點擊進階查詢按鈕
  async handleSearch(isOperate: boolean) { // 新增/編輯/刪除成功重查下拉選單
    let dto = this.setSearchInfoDto(1, 10);
    // call API
    this.searchInfo(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      startDate: this.isEmpty(this.advancedSearchForm.date) ? undefined : moment(this.advancedSearchForm.date[0]).format('YYYYMMDD'),
      endDate: this.isEmpty(this.advancedSearchForm.date) ? undefined : moment(this.advancedSearchForm.date[1]).format('YYYYMMDD'),
      symId: this.isEmpty(this.advancedSearchForm.symId) ? undefined : this.advancedSearchForm.symId.key,
      sharesValue: this.advancedSearchForm.sharesValue ? this.advancedSearchForm.sharesValue : null,
      investmentClass3: this.isEmpty(this.advancedSearchForm.investmentClass3) ? undefined : this.advancedSearchForm.investmentClass3.key,
      customType: this.advancedSearchForm.customType ? this.advancedSearchForm.customType : null,
      caseStatus: this.advancedSearchForm.caseStatus ? this.advancedSearchForm.caseStatus : null,
      pageNum,
      pageSize,
      sort: this.tempSort,

    };
    return dto;
  }

  // 進階查詢
  searchInfo(dto: IpoReportSettingPageDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.paginateDataInfoIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];

        if (!validateUtil.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              ...item,
              action: this.$actEnum.getVal('getOptionsEnum', item.caseStatus),
              actionTypeDisabled: item.caseStatus && (item.caseStatus !== this.$actEnum.caseStatusConstant.UNCHECK.val
                && item.caseStatus !== this.$actEnum.caseStatusConstant.ENABLE.val),
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

  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchInfoDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    this.searchInfo(dto);
  }

  openCheckInfoModal(e) {
    this.modalCheckInfoShow = e.modalCheckInfoShow;

    this.checkInfoContentForm.seqNo.key = e.formData.seqNo;
    this.checkInfoContentForm.date.key = e.formData.date;
    this.checkInfoContentForm.customCode.key = e.formData.customCode;
    this.checkInfoContentForm.sharesValue.key = transferUtil.transferPrice(e.formData.sharesValue);
    this.checkInfoContentForm.investmentClass3EngName.key = e.formData.investmentClass3EngName;
    this.checkInfoContentForm.customType.key = e.formData.customType == 'S' ? '股票基金' : '債券';
    this.checkInfoContentForm.caseStatus.key = e.formData.caseStatus ? this.$actEnum.getObject('caseStatusEnum', e.formData.caseStatus) : null;
    this.checkInfoContentForm.rejectReason.key = e.formData.rejectReason;
    this.checkInfoContentForm.createName.key = e.formData.createName;
    this.checkInfoContentForm.createDate.key = e.formData.createDate;
    this.checkInfoContentForm.updateName.key = e.formData.updateName;
    this.checkInfoContentForm.updateDate.key = e.formData.updateDate;
    this.checkInfoContentForm.reviewName.key = e.formData.reviewName;
    this.checkInfoContentForm.reviewDate.key = e.formData.reviewDate;
  }

  // 清空查詢結果資訊
  resetDataInfo() {
    return this.ipkGrid.data = [];
  }

  // 開啟新增彈窗
  openAddAndEditModal(addAndEditObj) {
    this.modalAddInfoShow = true;
    this.addAndEditInfo.actionType = addAndEditObj.actionType;
    this.addAndEditInfo.editInfo = addAndEditObj.editDto;
  }

  // 關閉新增彈窗
  closeAddAndEditModal() {
    this.modalAddInfoShow = false;
  }

  // 取得更多操作及欄位資訊
  getActionType(e) {
    const editDto = {
      actionType: e.rowData.actionType,
      applySeq: e.rowData.applySeq,
      serialNo: e.rowData.serialNo,
      seqNo: e.rowData.seqNo,
      date: e.rowData.date,
      customCode: e.rowData.customCode,
      symId: e.rowData.symId,
      sharesValue: e.rowData.sharesValue,
      investmentClass3: e.rowData.investmentClass3,
      customType: e.rowData.customType,
      caseStatus: e.rowData.caseStatus,
      createDate: e.rowData.createDate,
      createId: e.rowData.createId,
    };
    // 修改IPO報表設定
    if (e.actionType === this.$actEnum.constant.MODIFY.val) {
      const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.MODIFY.val);
      if (!getButtonsAuthInfoObj.byPass) {
        InfoModal.alertInfo({
          confirm: false,
          content: getButtonsAuthInfoObj.message,
        });
        return;
      }
      this.openAddAndEditModal({ actionType: e.actionType, editDto });
    } else if (e.actionType === this.$actEnum.constant.DELETE.val) {
      // 刪除IPO報表設定;
      const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.REMOVE.val);
      if (!getButtonsAuthInfoObj.byPass) {
        InfoModal.alertInfo({
          confirm: false,
          content: getButtonsAuthInfoObj.message,
        });
        return;
      }
      this.openDeleteInfoModal(editDto);
    } else if (e.actionType === this.$actEnum.actionButton.CHECK.val) {
      // 送審IPO報表設定
      let buttonKey = '';
      if (e.rowData.action === this.$actEnum.constant.MODIFY.val) {
        buttonKey = this.$buttonKey.buttonKey.MODIFY.val;
      } else {
        buttonKey = this.$buttonKey.buttonKey.ADD.val;
      }
      const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, buttonKey);
      if (!getButtonsAuthInfoObj.byPass) {
        InfoModal.alertInfo({
          confirm: false,
          content: getButtonsAuthInfoObj.message,
        });
        return;
      }
      const submitDto = {
        actionButton: this.$actEnum.actionButton.CHECK.val,
        ...editDto,
      };
      this.submitInfo(submitDto);
    } else if (e.actionType === this.$actEnum.constant.STOP.val) {
      // 停用IPO報表設定
      const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$childrenTab.childrenTab.DATA_INFO_TAB.val, this.$buttonKey.buttonKey.STOP.val);
      if (!getButtonsAuthInfoObj.byPass) {
        InfoModal.alertInfo({
          confirm: false,
          content: getButtonsAuthInfoObj.message,
        });
        return;
      }
      this.openStopInfoModal(editDto);
    }
  }

  // 警告, 提示訊息-確定要刪除此交易?
  openDeleteInfoModal(dto: IpoReportSettingEditDto) {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$otherMsgEnumData.SUBMIT_DELETE_CONFIRM_INFO?.message,
      onCallback: () => {
        this.deleteInfo(dto);
      },
    });
  }

  // 警告, 提示訊息-確定要停用此交易?
  openStopInfoModal(dto: IpoReportSettingEditDto) {
    InfoModal.alertInfo({
      title: '是否確定停用?',
      confirm: true,
      content: '是否確認停用此筆適用中資料？',
      onCallback: () => {
        this.stopInfo(dto);
      },
    });
  }

  // 刪除IPO報表設定
  deleteInfo(dto: IpoReportSettingEditDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.removeIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        // 查詢
        this.handleSearch(true);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 停用IPO報表設定
  stopInfo(dto: IpoReportSettingEditDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.stopIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        // 查詢
        this.handleSearch(true);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 下拉選單操作送審
  submitInfo(dto) {
    // 驗證==>下拉選單操作送審只需驗證必填欄位是否有填
    if (!this.validateRequired(this.$actEnum.actionButton.CHECK, dto)) {
      return;
    }

    if (dto.actionType === this.$actEnum.constant.MODIFY.val) {
      this.editInfo(dto);
    } else {
      this.addInfo(dto);
    }
  }

  // 驗證必填欄位
  validateRequired(action, dto) {
    let byPass = true;
    if (validateUtil.isEmpty(dto.seqNo) || validateUtil.isEmpty(dto.symId)
      || validateUtil.isEmpty(dto.sharesValue) || validateUtil.isEmpty(dto.investmentClass3) || validateUtil.isEmpty(dto.customType)) {
      InfoModal.alertInfo({
        confirm: false,
        content: `${action.key}失敗，${this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message}`,
      });
      byPass = false;
    }
    return byPass;
  }

  // 修改IPO報表設定
  editInfo(dto: IpoReportSettingEditDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.modifyIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        // 重新查詢
        this.handleSearch(true);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 新增IPO報表設定
  addInfo(dto: IpoReportSettingEditDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.addIpoReportSettingUsingPOST(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      this.$message.success(message, 10);
      // 重新查詢
      this.handleSearch(true);
    })
    .catch(() => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 頁數改變
  handlePageChange(e) {
    let dto = this.setSearchInfoDto(e.currentPage, e.pageSize);
    // call API
    this.searchInfo(dto);
  }

  // 取得操作類型對應的中文字
  getActionTypeEnum(actionType) {
    if (validateUtil.isEmpty(actionType)) {
      return;
    }
    return this.$actEnum.getObject('actionEnum', actionType).key;
  }

  // 取得商品代碼下拉選單
  async getCustomCode() {
    let customCodeList = [];
    await this.$ipoReportSettingApi.searchCustomCodeUsingGET()
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

  // 取得商品代碼下拉選單
  getInvestmentClass3() {
    let investmentClass3List = [];
    this.$ipoReportSettingApi.searchInvestmentClass3UsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          investmentClass3List.push(data);
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return investmentClass3List;
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
