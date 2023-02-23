import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import CheckInfoModal from '@/components/shared/modal/CheckInfoModal/CheckInfoModal.vue';
import CheckEditInfoModal from '@/components/shared/modal/CheckInfoModal/CheckEditInfoModal.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import { ReviewDto } from '@fubonlife/ipk-api-axios-sdk';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

let diff = require('deep-diff').diff;

@Component({
  components: {
    AdvancedSearch,
    CheckInfoModal,
    IpkVxeTable,
    CheckEditInfoModal,
    IpkButton,
  },
})
export default class ApprovalConfigDataInfo extends Vue {
  @Action('setLoading') setLoading;
  /**
   * data
   */

  selectedRowList = []; // [查詢結果]已選取的待放行清單項目

  modalCheckEditInfoShow = false; // [檢視彈窗] modal開關

  isDisabled = false; // [檢視彈窗] 是否鎖定放行/拒絕按鈕

  checkInfoBeforeForm = {}; // [檢視彈窗] 修改前表單內容 v-model綁定

  checkInfoAfterForm = {}; // [檢視彈窗] 修改後表單內容 v-model綁定

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  selectedIpkRowKeys = []; // 選中的選項index

  selectedIpkRows = []; // 選中的選項列

  reviewDto = { // 覆核(拒絕)資訊
    applySeq: [],
    reviewStatus: undefined, // 此reviewStatus為"拒絕"/"放行"流程
  };

  labelList: Array<AdvancedSearchModel> = [ // 進階查詢欄位名稱
    {
      label: '申請人員', placeholder: '請輸入申請人員', type: 'inputText', maxlength: 5,
    },
    {
      label: '申請日期', placeholder: 'yyyy/mm/dd', type: 'rangePicker',
    },
    {
      label: '放行狀態', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
  ];

  form = { // 表單內容
    applyId: undefined,
    applyDate: undefined,
    reviewStats: undefined,
  };

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
    showOverflow: 'tooltip',
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
        type: 'checkbox',
        fixed: 'left',
        align: 'center',
        width: 60,
      },
      {
        title: '操作類型',
        field: 'action',
        fixed: 'left',
        slots: { default: 'action' },
      },
      {
        title: '申請人員',
        field: 'applyId',
      },
      {
        title: '申請日期',
        field: 'applyDate',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '放行狀態',
        field: 'reviewStatus',
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$cfEnum.getObject('reviewStatusEnum', row.reviewStatus).color,
                text: this.$cfEnum.getObject('reviewStatusEnum', row.reviewStatus).key,
              },
            }),
          ],
        },
      },
      {
        title: '放行人員',
        field: 'reviewId',
      },
      {
        title: '放行日期',
        field: 'reviewDate',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
    ],
  };

  checkInfoEditForm: { [key: string]: CheckInfoModel } = { // [檢視彈窗] 修改表單預設內容 v-model綁定
    productType: {
      key: null, isEdit: false, message: null, label: '商品類別', type: 'inputText',
    },
    calculateType: {
      key: null, isEdit: false, message: null, label: '計算類型', type: 'inputText',
    },
    currency: {
      key: null, isEdit: false, message: null, label: '計算幣別', type: 'inputText',
    },
    amountLv1: {
      key: null, isEdit: false, message: null, label: '職等六上限', type: 'inputText',
    },
    amountLv2: {
      key: null, isEdit: false, message: null, label: '科主管上限', type: 'inputText',
    },
    amountLv3: {
      key: null, isEdit: false, message: null, label: '部副主管上限', type: 'inputText',
    },
    amountLv4: {
      key: null, isEdit: false, message: null, label: '部主管上限', type: 'inputText',
    },
    amountLv4Above: {
      key: null, isEdit: false, message: null, label: '處主管', type: 'inputText',
    },
    applySeq: {
      key: null, isEdit: false, message: null, label: '覆核申請編號', type: 'action',
    },
  };

  /**
   * hook
   */
  created() {
    // 取得「進階查詢」表單內容
    this.advancedSearchForm = { ...this.form };
    // 下拉選單設定-放行狀態下拉選單
    this.labelList.find((el) => el.label === '放行狀態').options = this.$cfEnum.reviewTypeOption;
    this.labelList.find((el) => el.label === '放行狀態').allOptions = this.$cfEnum.reviewTypeOption;
    // 檢視修改前modal表單內容
    this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
    // 檢視修改後modal表單內容
    this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, this.$cfChildrenTab.childrenTab.PENDING_INFO_TAB.val, this.$cfButtonKey.buttonKey.SEARCH.val);
		if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // call API
    this.handleSearch();
  }

  /**
  * methods
  */
  // -------------------查詢-------------------
  // 查詢table資料
  handleSearch() {
    let dto = this.setSearchPendingInfoDto(1, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchPendingInfo(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchPendingInfoDto(pageNum: number, pageSize: number) {
    let dto = {
      applyId: this.isEmpty(this.advancedSearchForm.applyId) ? undefined : this.advancedSearchForm.applyId,
      applyStartDate: this.isEmpty(this.advancedSearchForm.applyDate) ? null : moment(this.advancedSearchForm.applyDate[0]).format('YYYYMMDD'),
      applyEndDate: this.isEmpty(this.advancedSearchForm.applyDate) ? null : moment(this.advancedSearchForm.applyDate[1]).format('YYYYMMDD'),
      reviewStats: this.isEmpty(this.advancedSearchForm.reviewStats) ? undefined : this.advancedSearchForm.reviewStats,
      pageNum,
      pageSize,
    };
    return dto;
  }

  // 查詢待放行清單
  searchPendingInfo(dto) {
    this.setLoading(true);
    this.$approvalConfigApi.paginateApplyInfoUsingPOST(dto)
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];

        if (!this.isEmpty(content)) {
          content.forEach((item) => {
            let actionEnum = !this.isEmpty(item.action) ? item.action.substring(1, 2).toUpperCase() : undefined;
            this.ipkGrid.data.push({
              ...item,
              action: this.$cfEnum.getObject('actionEnum', actionEnum),
            });
          });
        }
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

  // 交易明細頁數改變
  handlePageChange(e) {
    let dto = this.setSearchPendingInfoDto(e.currentPage, e.pageSize);
    // call API
    this.searchPendingInfo(dto);
  }

  // -------------------放行-------------------
  // 單筆放行
  handleReview(e: any) {
    // 勾選的"資料放行狀態"非「待放行」
    if (e.data.rowData.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
      return;
    }
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: e.applySeq,
      reviewStatus: e.reviewStatus, // 此reviewStatus為"拒絕"/"放行"流程
    };
    // 先confirm
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
      customContent: null,
      onCallback: () => {
        // 再打後端API
        this.review(reviewDto);
      },
    });
  }

  // 整批放行
  handleReviewList(action: string) {
    let editApplySeq = []; // 修改(M)
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 勾選的"資料放行狀態"非「待放行」
      if (this.selectedRowList[i].reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
        InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
        return;
      }
      editApplySeq.push(this.selectedRowList[i].applySeq);
    }
    // 整理覆核後端格式
    let reviewDto = {
      applySeq: [...editApplySeq],
      reviewStatus: action, // 此reviewStatus為"拒絕"/"放行"流程
    };
    // 先confirm
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REVIEW_CONFIRM_INFO?.message,
      customContent: null,
      onCallback: () => {
        // 再打後端API
        this.review(reviewDto);
      },
    });
  }

  // 真正打到後端放行
  review(reviewDto: ReviewDto) {
    this.setLoading(true);
    this.$approvalConfigApi.reviewUsingPATCH(reviewDto)
      .then((res) => {
        const message = res.data.message;
        const isSuccess = res.data.success;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        // 關閉檢視彈窗
        this.closeCheckEditInfoModal();
        // 成功訊息
        this.$message.success(message, 10);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
        // 清空checkbox勾選
        this.selectedRowList = null;
        // 重查待放行清單
        this.handleSearch();
      });
  }

  // -------------------拒絕-------------------
  // 單筆拒絕
  handleReject(e: any) {
    // 勾選的"資料放行狀態"非「待放行」
    if (e.data.rowData.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
      InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
      return;
    }
    this.reviewDto.applySeq = e.applySeq;
    this.reviewDto.reviewStatus = e.reviewStatus;
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REJECT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.review(this.reviewDto);
      },
    });
  }

  // 整批拒絕
  handleRejectList(action: string) {
    this.reviewDto.applySeq = [];
    this.reviewDto.reviewStatus = action;
    for (let i = 0; i < this.selectedRowList.length; i++) {
      // 勾選的"資料放行狀態"非「待放行」
      if (this.selectedRowList[i].reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val) {
        InfoModal.alertInfo({ confirm: false, content: this.$commonMessageEnum.PENDING_VALIDATE_INFO?.message });
        return;
      }
      this.reviewDto.applySeq.push(this.selectedRowList[i].applySeq);
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.REJECT_CONFIRM_INFO?.message,
      onCallback: () => {
        this.review(this.reviewDto);
      },
    });
  }

  // -------------------放大鏡-------------------
  // 取得待放行清單已選取項目
  async getPendingSelected(e) {
    const content = await this.searchInformation(e) as any;
    // 已覆核、已拒絕鎖定按鈕
    this.isDisabled = e.row.reviewStatus !== this.$cfEnum.reviewStatusEnum.find((el) => el.key === '待放行').val;
    // 修改(U)
    if (e.row.action.val === this.$cfEnum.constant.MODIFY.val) {
      // 整理修改前、後資訊
      this.getBeforeAndAfterInfo(content);
    }
  }

  // 整理修改前、後資訊
  getBeforeAndAfterInfo(content: any) {
    const before = this.checkInfoBeforeForm as any;
    const after = this.checkInfoAfterForm as any;
    // 修改前
    if (!this.isEmpty(content.before)) {
      Object.entries(content.before).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoBeforeForm[key])) {
          this.checkInfoBeforeForm[key].key = item;
        }
      });

      before.calculateType.key = this.cheangeCalculateType(before.calculateType.key);
      before.amountLv1.key = before.amountLv1.key ? Number(before.amountLv1.key) / 100000000 : null;
      before.amountLv2.key = before.amountLv2.key ? Number(before.amountLv2.key) / 100000000 : null;
      before.amountLv3.key = before.amountLv3.key ? Number(before.amountLv3.key) / 100000000 : null;
      before.amountLv4.key = before.amountLv4.key ? Number(before.amountLv4.key) / 100000000 : null;
      before.amountLv4Above.key = before.amountLv4.key ? `大於${before.amountLv4.key}` : null;
    }
    // 修改後
    if (!this.isEmpty(content.after)) {
      Object.entries(content.after).forEach(([key, item], index) => {
        if (!this.isEmpty(this.checkInfoAfterForm[key])) {
          this.checkInfoAfterForm[key].key = item;
        }
      });
      after.applySeq.key = content.rowData.applySeq;
      after.rowData = content.rowData;
      after.calculateType.key = this.cheangeCalculateType(after.calculateType.key);
      after.amountLv1.key = after.amountLv1.key ? Number(after.amountLv1.key) / 100000000 : null;
      after.amountLv2.key = after.amountLv2.key ? Number(after.amountLv2.key) / 100000000 : null;
      after.amountLv3.key = after.amountLv3.key ? Number(after.amountLv3.key) / 100000000 : null;
      after.amountLv4.key = after.amountLv4.key ? Number(after.amountLv4.key) / 100000000 : null;
      after.amountLv4Above.key = after.amountLv4.key ? `大於${after.amountLv4.key}` : null;
    }
    // 比較
    const differences = diff(before, after);
    if (!this.isEmpty(differences)) {
      differences.forEach((item) => {
        if (!this.isEmpty(this.checkInfoAfterForm[item.path[0]])) {
          this.checkInfoAfterForm[item.path[0]].isEdit = true;
        }
      });
    }
    // 開啟修改檢視彈窗-比較差異頁面
    this.modalCheckEditInfoShow = true;
  }

  // 關閉修改檢視彈窗-比較差異頁面
  closeCheckEditInfoModal() {
    this.modalCheckEditInfoShow = false;
    this.isDisabled = false;
    // 清空重設checkInfoBeforeForm
    this.checkInfoBeforeForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
    // 清空重設checkInfoAfterForm
    this.checkInfoAfterForm = JSON.parse(JSON.stringify(this.checkInfoEditForm));
  }

  // 查詢檢視明細-查詢申請資訊
  searchInformation(e) {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$approvalConfigApi.searchInformationUsingGET(e.row.applySeq)
        .then((res) => {
          const content = res.data.content;
          resolve({ ...content, rowData: e.row });
        })
        .catch((error) => {
          // API失敗
          InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        })
        .finally(() => {
          this.setLoading(false);
        });
    });
  }

  // -------------------其他-------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得待放行清單checkbox勾選項
  onCheckboxChange(e) {
    this.selectedRowList = e.records;
  }

  // 轉換CalculateType成對照中文
  cheangeCalculateType(data) {
    return this.$cfEnum.getLabel('calculateTypeOption', String(data));
  }
}
