import {
  Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import exportUtil from '@/plugins/util/exportUtil';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkVxeTable,
    IpkButton,
  },
})
export default class SsiCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean; // modal開關

  @Prop()
  checkInfo: any;

  @Prop({ default: false })
  isPending: boolean; // 是否從待放行清單點擊檢視

  @Prop({ default: false })
  isDisabled: boolean; // 判斷是否要鎖定

  /**
  * data
  */
  activeKey = '1'; // 被選取的頁籤

  isCash = ''; // 新增款

  isEquity = ''; // 新增券

  modalVisible = false; // modal開關

  cash = this.createCash(); // 款帳號資訊

  equity = this.createEquity(); // 券帳號資訊

  contact = this.createContact(); // 聯絡資訊

  reviewInfo: any = {}; // 待放行資訊

  // attachment = this.createAttachmentForm(); // 上傳附件

  ipkGrid: IpkVxeTableModel = {
    data: [],
    pagerConfig: {
      enabled: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: false,
    maxHeight: '650',
    height: '650',
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '檔案類型',
        field: 'attachmentType',
        headerAlign: 'center',
        align: 'center',
        width: 100,
      },
      {
        title: '商品代碼',
        field: 'productCode',
        headerAlign: 'center',
        align: 'center',
        width: 150,
      },
      {
        title: '市場別',
        field: 'market',
        headerAlign: 'center',
        align: 'center',
        width: 150,
      },
      {
        title: '附件名稱',
        field: 'attachmentName',
        slots: { default: 'link' },
        headerAlign: 'left',
        align: 'left',
      },
    ],
  };

  /**
   * computed
   */
  /**
  * watch
  */
  @Watch('modalCheckInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('checkInfo', { immediate: true, deep: true })
  oncheckInfoForm(val) {
    if (this.isEmpty(val)) {
       return;
    }
    // 整理款帳號資訊
    this.setCashInitInfo(val.cash);
    // 整理券帳號資訊
    this.setEquityInitInfo(val.equity);
    // 整理聯絡資訊
    this.setContactInitInfo(val.contact);
    // 上傳附件
    this.setUploadList(val.attachment);
    // 待放行資訊
    if (this.isPending) {
      this.reviewInfo = val.reviewInfo;
    }
  }

  /**
   * methods
   */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 初始資料
  reset() {
    this.activeKey = '1';
    this.isCash = '';
    this.isEquity = '';
    // 清除款帳號資訊
    Object.entries(this.cash).forEach(([key, item], index) => {
      this.cash[key] = undefined;
    });
    // 清除券帳號資訊
    Object.entries(this.equity).forEach(([key, item], index) => {
      this.equity[key] = undefined;
    });
    // 清除聯絡資訊
    Object.entries(this.contact).forEach(([key, item], index) => {
      this.contact[key] = undefined;
    });
    // 清除上傳附件
    this.ipkGrid.data = [];
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.$emit('closeCheckInfoModal');
    this.reset();
  }

  // 下載
  handleDownload(e) {
    const sliceItemName = e.formData.attachmentName.slice(0, e.formData.attachmentName.length - 4);
    this.setLoading(true);
    this.$counterpartySsiApi.downloadUsingGET(e.formData.attachmentId, { responseType: 'blob' })
    .then((res) => {
      const content = res.data;
      exportUtil.dealDownloadData(content, sliceItemName, this.$cfEnum.fileExtensionEnum.PDF.toLowerCase());
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 整理款帳號資訊
  setCashInitInfo(cash) {
    if (this.isEmpty(cash)) {
      this.isCash = 'N';
      return;
    }
    Object.entries(cash).forEach(([key, item], index) => {
      this.cash[key] = item;
    });
    this.isCash = !this.isEmpty(cash.ssiId) ? 'Y' : 'N';
    this.cash.indicator = !this.isEmpty(cash.indicator) ? this.$cfEnum.getLabel('indicatorOption', cash.indicator) : undefined;
  }

  // 整理券帳號資訊
  setEquityInitInfo(equity) {
    if (this.isEmpty(equity)) {
      this.isEquity = 'N';
      return;
    }
    Object.entries(equity).forEach(([key, item], index) => {
      this.equity[key] = item;
    });
    this.isEquity = !this.isEmpty(equity.ssiId) ? 'Y' : 'N';
  }

  // 整理聯絡資訊
  setContactInitInfo(contact) {
    if (this.isEmpty(contact)) {
      return;
    }
    Object.entries(contact).forEach(([key, item], index) => {
      this.contact[key] = item;
    });
  }

  // 上傳附件
  setUploadList(attachment) {
    if (this.isEmpty(attachment)) {
      return;
    }
    this.ipkGrid.data = attachment;
  }

  // 拒絕
  handleReject() {
    let reviewDto = {
      applySeq: [this.reviewInfo.applySeq],
      reviewStatus: this.$cfEnum.reviewStatus.REJECT.val,
      reviewType: this.reviewInfo.reviewStatus, // 放行狀態
      action: this.reviewInfo.action?.val,
    };
    this.$emit('handleReject', reviewDto);
  }

  // 放行
  handleReview() {
    let reviewDto = {
      applySeq: [this.reviewInfo.applySeq],
      reviewStatus: this.$cfEnum.reviewStatus.APPROVAL.val,
      reviewType: this.reviewInfo.reviewStatus, // 放行狀態
      action: this.reviewInfo.action?.val,
    };
    this.$emit('handleReview', reviewDto);
  }

  /**
  * 資料處理
  */
  // 建立款資料格式
  createCash() {
    return {
      counterpartyId: undefined,
      productName: undefined,
      productId: undefined,
      currency: undefined,
      bfBankCode: undefined,
      bfBankName: undefined,
      bfBankAccount: undefined,
      bfBankIban: undefined,
      bfBankAba: undefined,
      bfAccountName: undefined,
      bfAccountNameCode: undefined,
      bfAccount: undefined,
      bfBankType: undefined,
      bfAccountNoType: undefined,
      bfAccountNameType: undefined,
      ImBankCode: undefined,
      ImBankName: undefined,
      ImBankCodeType: undefined,
      draweeType: undefined,
      draweeName: undefined,
      draweeCode: undefined,
      indicator: undefined,
      charges: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      effectStatus: undefined,
      payChargesIndicator: undefined,
      financialIndicator: undefined,
    };
  }

  // 建立券資料格式
  createEquity() {
    return {
      counterpartyId: undefined,
        productName: undefined,
        productId: undefined,
        currency: undefined,
        custodian: undefined,
        brokerIdType: undefined,
        brokerId: undefined,
        brokerAccount: undefined,
        brokerName: undefined,
        clearerIdType: undefined,
        clearerId: undefined,
        clearerAccount: undefined,
        clearerName: undefined,
        bsCodeType: undefined,
        bsCode: undefined,
        bdName: undefined,
        clAgentCodeType: undefined,
        clAgentName: undefined,
        market: undefined,
        cycd: undefined,
        psetCode: undefined,
        settlementLocation: undefined,
        settlementIndicator: undefined,
        equityTdccAccount: undefined,
        brokerage: undefined,
        brokerageCode: undefined,
        pdAccountBank: undefined,
        pdAccount: undefined,
        pdAccountName: undefined,
        boundTdccAccount: undefined,
        taxId: undefined,
        memo: undefined,
        remark: undefined,
        isDefault: undefined,
        effectStatus: undefined,
    };
  }

  // 建立聯絡資訊資料格式
  createContact() {
    return {
      address: undefined,
      faxNumber1: undefined,
      faxNumber2: undefined,
      licenserName1: undefined,
      licenserTel1: undefined,
      licenserMobile1: undefined,
      licenserEmail1: undefined,
      licenserName2: undefined,
      licenserTel2: undefined,
      licenserMobile2: undefined,
      licenserEmail2: undefined,
      licenserName3: undefined,
      licenserTel3: undefined,
      licenserMobile3: undefined,
      licenserEmail3: undefined,
    };
  }

  // 建立附件資料格式/Form
  // createAttachmentForm() {
  //   return {
  //     attachmentType: [],
  //     productCode: undefined,
  //     market: undefined,
  //     attachmentName: undefined,
  //     attachmentExtention: undefined,
  //     attachmentFile: undefined,
  //   };
  // }
}
