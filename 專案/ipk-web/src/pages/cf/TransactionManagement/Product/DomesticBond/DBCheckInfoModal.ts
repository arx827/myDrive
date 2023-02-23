import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import transferUtil from '@/plugins/util/transferUtil';
import moment from 'moment';

import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import ReturnModal from '@product/ReturnModal.vue';
import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import IpkAddItemSelect from '@/components/shared/form/IpkAddItemSelect.vue';
import IpkSelect from '@/components/shared/form/IpkSelect.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    PrintModal,
    ReturnModal,
    UploadDragger,
    CheckInfoForm,
    IpkAddItemSelect,
    IpkSelect,
    IpkButton,
  },
})
export default class DBCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  formData: object // 檢視彈窗資訊

  /**
  * data
  */
  activeKey = this.$authService.mainTab.key; // 被選取的頁籤(預設前台成交資訊)

  checkInfoModalVisible = false; // modal開關

  /** 前台成交資訊 */
  main: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txCode: {
      key: undefined, label: '交易流水編號', type: 'textarea', isEdit: false,
    },
    cfStatus: {
      key: undefined, label: '交易確認狀態', type: 'badge', isEdit: false,
    },
    updateId: {
      key: undefined, label: '作業人員', type: 'textarea', isEdit: false,
    },
    updateDate: {
      key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
    },
    isWi: {
      key: undefined, label: 'WI交易', type: 'textarea', isEdit: false,
    },
    bsType: {
      key: undefined, label: '交易別', type: 'textarea', isEdit: false,
    },
    invCategoryName: {
      key: undefined, label: '資產類別', type: 'textarea', isEdit: false,
    },
    isinCode: {
      key: undefined, label: '債券標的', type: 'textarea', isEdit: false,
    },
    bondName: {
      key: undefined, label: '債權名稱', type: 'textarea', isEdit: false,
    },
    tradeDate: {
      key: undefined, label: '交易日', type: 'date', isEdit: false,
    },
    settleDate: {
      key: undefined, label: '券交割日', type: 'date', isEdit: false,
    },
    paymentSettleDate: {
      key: undefined, label: '款交割日', type: 'date', isEdit: false,
    },
    currency: {
      key: undefined, label: '幣別', type: 'textarea', isEdit: false,
    },
    tradeNpa: {
      key: undefined, label: '買/賣成交面額	', type: 'textarea', isEdit: false,
    },
    tradePrice: {
      key: undefined, label: '成交價', type: 'textarea', isEdit: false,
    },
    tradeDealYield: {
      key: undefined, label: '成交殖利率', type: 'textarea', isEdit: false,
    },
    apDealAmount: {
      key: undefined, label: '除息金額', type: 'textarea', isEdit: false,
    },
    apAiAmount: {
      key: undefined, label: '前手息', type: 'textarea', isEdit: false,
    },
    apTax: {
      key: undefined, label: '前手稅', type: 'textarea', isEdit: false,
    },
    paymentAmount: {
      key: undefined, label: '交割款項', type: 'textarea', isEdit: false,
    },
    counterpartyId: {
      key: undefined, label: '交易對象', type: 'textarea', isEdit: false,
    },
    counterpartyName: {
      key: undefined, label: '交易對象(中文)', type: 'textarea', isEdit: false,
    },
    custodian: {
      key: undefined, label: '債券保管', type: 'textarea', isEdit: false,
    },
    isOversold: {
      key: undefined, label: '是否超賣', type: 'textarea', isEdit: false,
    },
    memo: {
      key: undefined, label: '備註', type: 'textarea', isEdit: false,
    },
    productId: {
      key: undefined, label: '商品編號', type: 'action', isEdit: false,
    },
    invCategoryCode: {
      key: undefined, label: '', type: 'action', isEdit: false,
    },
  };

  modalPrintShow = false; // [列印彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

  modalReturnShow = false; // [退回彈窗] modal開關

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    asName: {
      key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
    },
    ap: {
      key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
    },
    settleType: {
      key: undefined, label: '交割方式', type: 'inputText', isEdit: false,
    },
    issuer: {
      key: undefined, label: '發行公司/所屬國家', type: 'inputText', isEdit: false,
    },
    sector: {
      key: undefined, label: '產業別/國家Asset Class', type: 'inputText', isEdit: false,
    },
    creditRating: {
      key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
    },
    otherNotation: {
      key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
    },
    isTradePurpose: {
      key: undefined, label: '是否為交易目的', type: 'inputText', isEdit: false,
    },
    isOtc: {
      key: undefined, label: '是否為境內掛牌', type: 'inputText', isEdit: false,
    },
    isStakeholder: {
      key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
    },
    oldPortfolio: {
      key: undefined, label: '舊Portfolio', type: 'inputText', isEdit: false,
    },
    isSppi: {
      key: undefined, label: '是否通過SPPI測試', type: 'inputText', isEdit: false,
    },
    trader: {
      key: undefined, label: '交易員', type: 'inputText', isEdit: false,
    },
    confirmManager1: {
      key: undefined, label: '放行主管1', type: 'inputText', isEdit: false,
    },
    confirmManager2: {
      key: undefined, label: '放行主管2', type: 'inputText', isEdit: false,
    },
    confirmManager3: {
      key: undefined, label: '放行主管3', type: 'inputText', isEdit: false,
    },
    isCombined: {
      key: undefined, label: '是否合併交割', type: 'inputText', isEdit: false,
    },
    bondFullName: {
      key: undefined, label: '債券完整名稱', type: 'input', isEdit: false,
    },
  };

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    fbPdAccountBank: undefined,
    fbBfAccountName: undefined,
    fbTaxId: undefined,
    safekeepingAccount: undefined,
    safekeepingName: undefined,
    fbBfAccount: undefined,
    fbBankAccount: undefined,
    fbBankName: undefined,
    cpPdAccountBank: undefined,
    cpBfAccountName: undefined,
    cpTaxId: undefined,
    cpPdAccount: undefined,
    cpBfBankAccount: undefined,
    cpBfBankName: undefined,
    ssiId: undefined,
    noteName: undefined,
    noteTime: undefined,
    memo: undefined,
  }

  pdAccountNameOption = []; // 交易對手公債帳號戶名/受款人戶名下拉選單

  ssiIdOption = []; // 交易對手受款行銀行名稱/帳號下拉選單

  counterPartyLicenserOption = []; // 交易對手聯絡人下拉選單

  noteTimeOpen = false; // 時間下拉選單開關

  /** 上傳附件 */
  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf, .tif', // 可上傳的檔案類型
    acceptType: ['application/pdf', 'image/tiff'],
    uploadDisabled: false,
    showRemoveIcon: true,
    showDownload: true,
  }

  attachmentInfo = []; // 已儲存後端的上傳資料

  attachmentType = this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val; // 附件上傳類型，預設交易確認文件

  deleteUploadList = []; // 刪除後端回傳的上傳資料

  modalShowCount = 0; // 判斷modal是否是開啟狀態

  /**
  * computed
  */
  // modal footer 上邊線
   get dividerBase() {
    return this.isEmpty(this.main.cfStatus) || this.isEmpty(this.main.cfStatus.key) ? 0 : this.main.cfStatus.key;
  }

  // 已比對後不可再調整收付款資訊頁籤欄位
  get disabledSsiTabCol() {
    let disalbed = false; // 收付款資訊頁籤欄位鎖定
    if (this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.LOCK.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.EMPTY.val) {
        disalbed = true;
    }
    return disalbed;
  }

  // 鎖定按鈕卡控：若交易確認狀態非「無狀態」、「已放行」或「已確認+備註WI交易」則反灰不可點選
  get disabledLockBtn() {
    let disalbed = false;
    if ((!this.isEmpty(this.main.cfStatus.key) && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val)) {
      disalbed = true;
    }
    if (this.main.cfStatus.key === this.$cfEnum.cfStatusConstant.TX_DOUBLE_REIVEW.val && this.main.isWi.key === '是') {
      disalbed = false;
    }
    return disalbed;
  }

  /**
  * watch
  */
  @Watch('modalCheckInfoShow')
  onChange(val) {
    this.checkInfoModalVisible = val;
  }

  @Watch('formData', { immediate: true, deep: true })
  onChangeForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    this.modalShowCount++;
    // 整理初始資訊
    this.setInitInfo(val);
  }

  @Watch('ssi.ssiId', { immediate: true, deep: true })
  onSsiIdChange(newVal, oldVal) {
    if (this.isEmpty(newVal) || newVal === oldVal) {
      return;
    }
    this.changeTxSsi(newVal);
  }

  /**
  * hook
  */
  created() {
    //
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 取得對應badge顏色
  getBadgeObject(data) {
    return this.$cfEnum.getObject('cfStatusEnum', data);
  }

  // 關閉modal
  closeCheckInfoModal() {
    this.resetForm();
    // 關閉彈窗
    this.$emit('closeCheckInfoModal');
    // 重查國內債資訊，要依進階查詢篩選條件重查
    this.$emit('handleSearch', true);
  }

  // 整理成交資訊
  setInitInfo(data) {
    // 整理前台成交資訊
    this.setMainInitInfo(data.main);
    // 整理其他成交資訊
    this.setOtherInitInfo(data.other);
    // 查詢交易對手受款銀行下拉選單
    this.getCpBfBankOption(data.ssi);
    // 查詢交易對手聯絡人下拉選單
    this.getCounterPartyLicenser();
    // 上傳附件
    this.setUploadList(data.attachment);
    // this.attachment = data.attachment;
    // 查詢成交資訊明細比較前後差異
    if (this.modalShowCount === 1) {
      this.searchDetailDifferent();
    }
  }

  // 整理前台成交資訊
  setMainInitInfo(main) {
    if (this.isEmpty(main)) {
      return;
    }

    this.main.txCode.key = main.txCode;
    this.main.cfStatus.key = main.cfStatus;
    this.main.updateId.key = main.updateId;
    this.main.updateDate.key = main.updateDate;
    this.main.isWi.key = transferUtil.getSelectOption(this.$cfEnum.isWIOption, main.isWi)?.label;
    this.main.bsType.key = main.bsType;
    this.main.invCategoryName.key = main.invCategoryName;
    this.main.isinCode.key = main.isinCode;
    this.main.bondName.key = main.bondName;
    this.main.tradeDate.key = main.tradeDate;
    this.main.settleDate.key = main.settleDate;
    this.main.paymentSettleDate.key = main.paymentSettleDate;
    this.main.currency.key = main.currency;
    this.main.tradeNpa.key = transferUtil.transferPrice(main.tradeNpa);
    this.main.tradePrice.key = transferUtil.transferPrice(main.tradePrice);
    this.main.tradeDealYield.key = main.tradeDealYield ? `${main.tradeDealYield}%` : undefined;
    this.main.apDealAmount.key = transferUtil.transferPrice(main.apDealAmount);
    this.main.apAiAmount.key = transferUtil.transferPrice(main.apAiAmount);
    this.main.apTax.key = transferUtil.transferPrice(main.apTax);
    this.main.paymentAmount.key = transferUtil.transferPrice(main.paymentAmount);
    this.main.counterpartyId.key = main.counterpartyId;
    this.main.counterpartyName.key = main.counterpartyName;
    this.main.custodian.key = main.custodian;
    this.main.isOversold.key = main.isOversold;
    this.main.memo.key = main.memo;
    this.main.productId.key = main.productId;
    this.main.invCategoryCode.key = main.invCategoryCode;
  }

  // 整理其他成交資訊
  setOtherInitInfo(other) {
    if (this.isEmpty(other)) {
      return;
    }
    Object.entries(other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;
      }
    });
  }

  // 整理收付款資訊
  setSsiInitInfo(ssi: any, isInit: boolean) {
    if (this.isEmpty(ssi)) {
      return;
    }
    this.ssi.cpPdAccountBank = ssi.cpPdAccountBank ? ssi.cpPdAccountBank : undefined;
    this.ssi.cpBfAccountName = ssi.cpBfAccountName ? ssi.cpBfAccountName : undefined;
    this.ssi.cpTaxId = ssi.cpTaxId ? ssi.cpTaxId : undefined;
    this.ssi.cpPdAccount = ssi.cpPdAccount ? ssi.cpPdAccount : undefined;
    this.ssi.cpBfBankAccount = ssi.cpBfBankAccount ? ssi.cpBfBankAccount : undefined;
    this.ssi.cpBfBankName = ssi.cpBfBankName ? ssi.cpBfBankName : undefined;

    // 僅初始化給值
    if (isInit) {
      this.ssi.fbPdAccountBank = ssi.fbPdAccountBank ? ssi.fbPdAccountBank : undefined;
      this.ssi.fbBfAccountName = ssi.fbBfAccountName ? ssi.fbBfAccountName : undefined;
      this.ssi.fbTaxId = ssi.fbTaxId ? ssi.fbTaxId : undefined;
      this.ssi.safekeepingAccount = ssi.safekeepingAccount ? ssi.safekeepingAccount : undefined;
      this.ssi.safekeepingName = ssi.safekeepingName ? ssi.safekeepingName : undefined;
      this.ssi.fbBfAccount = ssi.fbBfAccount ? ssi.fbBfAccount : undefined;
      this.ssi.fbBankAccount = ssi.fbBankAccount ? ssi.fbBankAccount : undefined;
      this.ssi.fbBankName = ssi.fbBankName ? ssi.fbBankName : undefined;
      this.ssi.noteName = ssi.noteName ? ssi.noteName : undefined;
      this.ssi.noteTime = ssi.noteTime ? moment(ssi.noteTime, 'HH:mm').format() : undefined;
      this.ssi.memo = ssi.memo ? ssi.memo : undefined;
      this.ssi.ssiId = ssi.ssiId ? ssi.ssiId : undefined;
    }
  }

  // 整理附件上傳
  setUploadList(attachment) {
    this.attachmentInfo = [];
    if (this.isEmpty(attachment)) {
      return;
    }
    const empDomain = (this.getLoginInfo as any).domainId;
    attachment.forEach((file) => {
      this.attachmentInfo.push({
        ...file,
        uid: file.attachmentId,
        name: file.attachmentName,
        isDownload: true,
        isRemoved: empDomain !== file.createId, // 非自己上傳，不得刪除
      });
    });
  }

  // 點擊鎖定
  async handleDataLock() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
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
            content: respData.message,
            onCallback: async () => {
              this.attachmentInfo = [];
              this.deleteUploadList = [];
              // 頁籤回到前台成交資訊
              this.activeKey = this.$authService.mainTab.key;
              // 重查成交資訊明細，單筆確認只會有一個txCode
              this.$emit('searchTxDetail', dto.txCode[0]);
            },
          });
        }
      },
    });
  }

  // 點擊資料比對
  handleDataComparison() {
    // 清空必填提示欄位紅框
    if (!this.isEmpty(this.$refs.formRef)) {
      (this.$refs.formRef as any).clearValidate();
    }
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val };
    this.validateBeforeModifyCfStatus(dto).then((check) => {
      if (!check.success) {
        InfoModal.alertError({ confirm: false, content: check.message });
        return;
      }
      InfoModal.alertInfo({
        confirm: true,
        content: this.$cfMessageEnum.COMPARED_VALIDATE_INFO?.message + check.message,
        onCallback: async () => {
          let respData: any = await this.modifyCfStatus(dto);

          if (respData?.success) {
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.COMPARED_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', dto.txCode[0]);
              },
            });
          }
        },
      });
    });
  }

  // 點擊列印
  async handleDataPrint() {
    // 進行狀態檢核API
    let check = await this.$generateFileCommon.validateBeforeGenerate([this.main.txCode.key], '$domesticBondApi');
    // 產檔失敗
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

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
    this.defaultVal.fileCode = undefined;
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
  }

  // 列印確認送出
  async submitDataPrint(e) {
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: [this.main.txCode.key],
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
    }, '$domesticBondApi');
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
      onCallback: () => {
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

  // 點擊交易確認
  handleDataConfirm() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val };
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
              content: respData.message,
              onCallback: () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', dto.txCode[0]);
              },
            });
          }
        },
      });
    });
  }

  // 點擊退回
  handleDataReturn() {
    this.modalReturnShow = true;
  }

  // 退回修改
  handleReturnFront() {
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val };
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
            // 關閉退回彈窗
            this.closeReturnModal();
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.RETURN_EDIT_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', dto.txCode[0]);
              },
            });
          }
        },
      });
    });
  }

  // 退回解鎖
  handleReturnLock() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val };
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
            // 關閉退回彈窗
            this.closeReturnModal();
            InfoModal.alertSuccess({
              title: this.$cfMessageEnum.RETURN_UNLOCKED_SUCCESS?.title,
              confirm: false,
              content: respData.message,
              onCallback: async () => {
                this.attachmentInfo = [];
                this.deleteUploadList = [];
                // 頁籤回到前台成交資訊
                this.activeKey = this.$authService.mainTab.key;
                // 重查成交資訊明細，單筆確認只會有一個txCode
                this.$emit('searchTxDetail', dto.txCode[0]);
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

  // 上傳change事件
  handleChange(info) {
    // 移除不合規的檔案(在beforeUpload方法裡status被設為removed的檔案)
    info.fileList.forEach((item, index, arr) => {
      if (item.status === 'removed') {
          arr.splice(index, 1);
      }
    });
    // 單筆上傳會進入的流程
    if (!this.fileUploadData.multiple) {
      if (info.fileList.length > 1) {
        this.attachmentInfo = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.attachmentInfo = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.attachmentInfo.push(info.file);
    }
  }

  // 刪除上傳附件
  deleteUpload(file) {
    // 刪除
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
    // 有attachmentId的表示為後端傳的，push進去
    if (file.attachmentId) {
      this.deleteUploadList.push(file.attachmentId);
    }
  }

  // 點擊儲存按鈕
  async handleSaveDetail() {
    // 驗證
    const txCodeList = this.main.txCode ? [this.main.txCode.key] : undefined;
    const dto = { txCode: txCodeList, attachmentType: this.attachmentType };
    const data = await this.validateBeforeSaveAttachment(dto);
    if (!data.success) {
      InfoModal.alertError({ confirm: false, content: data.message });
      return;
    }
    // call API
    this.saveDetail();
  }

  // 儲存
  saveDetail() {
    // 整理儲存後端所需格式
    // Time整理
    this.ssi.noteTime = this.ssi.noteTime ? moment(this.ssi.noteTime).format('HHmm') : undefined;

    let dto = {
      txCode: this.main.txCode ? this.main.txCode.key : undefined,
      other: {
        bondFullName: this.other.bondFullName ? this.other.bondFullName.key : undefined,
      },
      ssi: this.ssi,
      attachment: {
          attachmentType: undefined,
          add: [],
          remove: this.deleteUploadList,
      },
    };
    this.attachmentInfo.forEach((file) => {
      // 沒有attachmentId的push進去
      if (!file.attachmentId) {
        dto.attachment.add.push({
          attachmentName: file.name,
          attachmentExtension: transferUtil.getFileExt(file.name),
          txCode: this.main.txCode ? [this.main.txCode.key] : undefined,
          // file,
        });
      }
    });
    // 有新增檔案，才傳attachmentType給後端
    if (!this.isEmpty(dto.attachment.add)) {
      dto.attachment.attachmentType = this.attachmentType;
    }
    // call API
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/domestic-bond/saveDetail`, 'dto', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachmentInfo = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', dto.txCode);
        // 重查國內債資訊，要依進階查詢篩選條件重查
        // this.$emit('handleSearch', true);
      },
      // 失敗後要執行的流程
      // () => {
      //   this.attachmentInfo = [];
      //   this.deleteUploadList = [];
      // },
    );
  }

  // 異動交易確認狀態
  async modifyCfStatus(dto) {
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
    }).finally(() => {
      this.setLoading(false);
    });
    return data;
  }

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.attachmentName) return;
    const fileId = item.attachmentId;
    const fileName = item.attachmentName.slice(0, item.attachmentName.length - 4);
    const fileType = item.attachmentName.split('.').pop();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 查詢交易對手聯絡人下拉選單
  async getCounterPartyLicenser() {
    // 整理成後端格式
    let counterpartyId = this.main.counterpartyId ? this.main.counterpartyId.key : undefined;

    // call API
    this.counterPartyLicenserOption = await this.$cfCommon.getCounterPartyLicenser(counterpartyId);
  }

  // 查詢交易對手受款銀行下拉選單
  async getCpBfBankOption(ssi) {
    let dto = {
      invCategoryCode: this.main.invCategoryCode ? this.main.invCategoryCode.key : undefined,
      counterpartyId: this.main.counterpartyId ? this.main.counterpartyId.key : undefined,
      productId: this.main.productId ? this.main.productId.key : undefined,
      bsType: this.main.bsType ? this.$cfEnum.getValue('transactionOption', this.main.bsType.key) : undefined,
    };
    this.ssiIdOption = await this.$cfCommon.getCpBfBankOption(dto);
    // 整理收付款資訊
    this.setSsiInitInfo(ssi, true);
  }

  // 異動收付款資訊
  changeTxSsi(e) {
    // 整理成後端格式
    let dto = {
      invCategoryCode: this.main.invCategoryCode ? this.main.invCategoryCode.key : undefined,
      bsType: this.main.bsType ? this.main.bsType.key : undefined,
      ssiId: this.ssi.ssiId ? this.ssi.ssiId : undefined,
    };
    // call API
    this.setLoading(true);
    this.$domesticBondApi.changeTxSsiUsingPOST(dto)
    .then((res) => {
      const message = res.data.message;
      const isSuccess = res.data.success;
      const content = res.data.content;

      // 失敗訊息
      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 異動收付款資訊
      if (this.isEmpty(content)) {
        return;
      }
      this.setSsiInitInfo(content, false);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 清空各個form的值
  resetForm() {
    this.activeKey = this.$authService.mainTab.key;
    // 前台成交資訊
    Object.entries(this.main).forEach(([key, item], index) => {
      if (!this.isEmpty(this.main[key])) {
        this.main[key].key = undefined;
      }
    });
    // 其他成交資訊
    Object.entries(this.other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = undefined;
      }
    });
    // 收付款資訊
    Object.entries(this.ssi).forEach(([key, item], index) => {
      if (!this.isEmpty(this.ssi[key])) {
        this.ssi[key] = undefined;
      }
    });
    // 上傳的附件
    this.attachmentType = this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val; // 附件上傳類型，預設交易確認文件
    this.attachmentInfo = [];
  }

  // 查詢成交資訊明細比較前後差異
  async searchDetailDifferent() {
    let data = await this.$cfCommon.searchDetailDifferent({ txCode: this.main.txCode.key }, '$domesticBondApi');
    const content = data.content;

    // 有值代表有差異
    if (!this.isEmpty(content)) {
      // 整理前台成交資訊
      if (!this.isEmpty(content.main)) {
        Object.entries(content.main).forEach(([key, item], index) => {
          if (!this.isEmpty(this.main[key])) {
            this.main[key].isEdit = !this.isEmpty(item);
          }
        });
      } else {
        Object.entries(this.main).forEach(([key, item], index) => {
          this.main[key].isEdit = false;
        });
      }

      // 整理其他成交資訊
      if (!this.isEmpty(content.other)) {
        Object.entries(content.other).forEach(([key, item], index) => {
          if (!this.isEmpty(this.other[key])) {
            this.other[key].isEdit = !this.isEmpty(item);
          }
        });
      } else {
        Object.entries(this.other).forEach(([key, item], index) => {
          this.other[key].isEdit = false;
        });
      }

      // 收付款資訊下拉選單
      // if (!this.isEmpty(content.ssi)) {
      //   Object.entries(content.ssi).forEach(([key, item], index) => {
      //     if (!this.isEmpty(this.ssi[key])) {
      //       this[key] = !this.isEmpty(item);
      //     }
      //   });
      // }
    }
  }

  /**
  * validate
  */
  // 異動交易確認狀態前檢查
  validateBeforeModifyCfStatus(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$domesticBondApi.checkBeforeModifyCfStatusUsingPOST(dto)
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

  // 儲存附件前檢查
  validateBeforeSaveAttachment(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$domesticBondApi.checkBeforeSaveAttachmentUsingPOST(dto)
      .then((res) => {
        resolve(res.data);
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
}
