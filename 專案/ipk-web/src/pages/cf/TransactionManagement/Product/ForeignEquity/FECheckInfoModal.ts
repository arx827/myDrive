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
import { TxCodeArrayWithCfStatusDto } from '@fubonlife/ipk-api-axios-sdk';
import SsiFileCheckInfoModal from '@product/ForeignEquity/SsiFileCheckInfoModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    PrintModal,
    ReturnModal,
    UploadDragger,
    CheckInfoForm,
    SsiFileCheckInfoModal,
    IpkButton,
  },
})
export default class FECheckInfoModal extends Vue {
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
      key: undefined, label: '交易編號', type: 'inputText', isEdit: false,
    },
    cfStatus: {
      key: undefined, label: '交易確認狀態', type: 'badge', isEdit: false,
    },
    updateId: {
      key: undefined, label: '作業人員', type: 'inputText', isEdit: false,
    },
    updateDate: {
      key: undefined, label: '作業日期', type: 'dateTime', isEdit: false,
    },
    hierarchyDesc: {
      key: undefined, label: '交易階層', type: 'inputText', isEdit: false,
    },
    isAsia: {
      key: undefined, label: '市場別', type: 'inputText', isEdit: false,
    },
    bsType: {
      key: undefined, label: '買賣類別', type: 'inputText', isEdit: false,
    },
    currency: {
      key: undefined, label: '幣別', type: 'inputText', isEdit: false,
    },
    productCode: {
      key: undefined, label: '商品代碼', type: 'inputText', isEdit: false,
    },
    isinCode: {
      key: undefined, label: 'ISIN', type: 'inputText', isEdit: false,
    },
    productName: {
      key: undefined, label: '商品名稱', type: 'inputText', isEdit: false,
    },
    counterpartyId: {
      key: undefined, label: '交易對手', type: 'textarea', isEdit: false,
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
    paymentDate: {
      key: undefined, label: '繳款日', type: 'date', isEdit: false,
    },
    safekeepingSsi: {
      key: undefined, label: '保管行/收付款機構', type: 'inputText', isEdit: false,
    },
    actNpa: {
      key: undefined, label: '實際買/賣單位數', type: 'inputText', isEdit: false,
    },
    actTradePrice: {
      key: undefined, label: '成交價', type: 'inputText', isEdit: false,
    },
    actApDealAmount: {
      key: undefined, label: '成交金額', type: 'inputText', isEdit: false,
    },
    estNpa: {
      key: undefined, label: '預計認購單位數', type: 'inputText', isEdit: false,
    },
    estTradePrice: {
      key: undefined, label: '預計成交價格', type: 'inputText', isEdit: false,
    },
    estApDealAmount: {
      key: undefined, label: '預計成交金額', type: 'inputText', isEdit: false,
    },
    blank1: {
      key: undefined, label: '', type: 'action', isEdit: false,
    }, // 因版型關係，設定 blank 空物件換行
    fee: {
      key: undefined, label: '手續費及佣金', type: 'inputText', isEdit: false,
    },
    commission: {
      key: undefined, label: '其他費用(含交易稅)', type: 'inputText', isEdit: false,
    },
    paymentAc: {
      key: undefined, label: '收付款金額', type: 'inputText', isEdit: false,
    },
    blank2: {
      key: undefined, label: '', type: 'action', isEdit: false,
    }, // 因版型關係，設定 blank 空物件換行
    apvlLevel: {
      key: undefined, label: '簽核權限', type: 'inputText', isEdit: false,
    },
    apvlFxRateDate: {
      key: undefined, label: '匯率日期', type: 'date', isEdit: false,
    },
    apvlFxRate: {
      key: undefined, label: '匯率', type: 'inputText', isEdit: false,
    },
    productId: {
      key: undefined, label: '商品編號', type: 'action', isEdit: false,
    },
  };

  tempApvlFxRateDate = null; // 暫存匯率日期，鎖定時才要塞值

  modalPrintShow = false; // [列印彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

  modalReturnShow = false; // [退回彈窗] modal開關

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    txAttribute: {
      key: undefined, label: '交易屬性', type: 'inputText', isEdit: false,
    },
    portfolio: {
      key: undefined, label: 'PORTFOLIO', type: 'inputText', isEdit: false,
    },
    ap: {
      key: undefined, label: '會計公報分類', type: 'inputText', isEdit: false,
    },
    marketLevel: {
      key: undefined, label: '初級市場/次級市場', type: 'inputText', isEdit: false,
    },
    diffReason: {
      key: undefined, label: '差異原因', type: 'inputText', isEdit: false,
    },
    memo: {
      key: undefined, label: '預付交易單號或備註', type: 'inputText', isEdit: false,
    },
    isStakeholder: {
      key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
    },
  };

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    safekeepingAccount: undefined,
    brokerIdType: undefined,
    brokerId: undefined,
    brokerAccount: undefined,
    memo: undefined,
    clearerIdType: undefined,
    clearerId: undefined,
    clearerAccount: undefined,
    bsCodeType: undefined,
    bsCode: undefined,
    bsName: undefined,
    clAgentCodeType: undefined,
    clAgentCode: undefined,
    clearerName: undefined,
    market: undefined,
    cycd: undefined,
    psetCode: undefined,
    settlementLocation: undefined,
    pot: undefined,
    potNarrative: undefined,
    indicator: undefined,
    equityCutOffDate: undefined,
    equityCutOffTime: undefined,
    equityBufferTime: undefined,
    lastTx: undefined,
  };

  ssiRules = { // 表單驗證
    psetCode: [{ required: true, message: '請選擇', trigger: ['blur', 'change'] }],
    potNarrative: [{
      required: false,
      validator: this.validatePotNarrative,
    }],
    indicator: [{
      required: false,
      validator: this.validateIndicator,
    }],
    pot: [{
      required: false,
      validator: this.validatePot,
    }],
  };

  psetCodeOption = []; // 下拉選單

  modalSsiCheckInfoShow = false; // 收付款資訊交易對手附件彈窗

  /** 上傳附件 */
  fileUploadData: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.pdf', // 可上傳的檔案類型
    acceptType: ['application/pdf'],
    uploadDisabled: false,
    showRemoveIcon: true,
    showDownload: true,
  }

  attachmentInfo = []; // 已儲存後端的上傳資料

  deleteUploadList = []; // 刪除後端回傳的上傳資料

  modalShowCount = 0; // 判斷modal是否是開啟狀態

  /**
  * computed
  */
  // 已比對後不可再調整收付款資訊頁籤欄位與上傳附件
  get disabledSsiTabCol() {
    let disalbed = false; // 收付款資訊頁籤欄位鎖定
    this.fileUploadData.uploadDisabled = false; // 上傳附件鎖定
    if (this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.LOCK.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.EMPTY.val) {
        disalbed = true;
        this.fileUploadData.uploadDisabled = true;
    }
    return disalbed;
  }

  // modal footer 上邊線
  get dividerBase() {
    return this.isEmpty(this.main.cfStatus) || this.isEmpty(this.main.cfStatus.key) ? 0 : this.main.cfStatus.key;
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

  // 關閉modal
  closeCheckInfoModal() {
    this.resetForm();
    // 關閉彈窗
    this.$emit('closeCheckInfoModal');
    // 重查國外股資訊，要依進階查詢篩選條件重查
    this.$emit('handleSearch', true);
  }

  // 整理成交資訊
  setInitInfo(data) {
    // 整理前台成交資訊
    this.setMainInitInfo(data.main);
    // 整理其他成交資訊
    this.setOtherInitInfo(data.other);
    // 收付款資訊下拉選單
    this.getTxSsiPsetCode(data);
    // 上傳附件
    this.setUploadList(data.attachment);
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
    this.main.hierarchyDesc.key = main.hierarchyDesc ? main.hierarchyDesc.split(',').pop() : main.hierarchyDesc;
    this.main.isAsia.key = main.isAsia;
    this.main.bsType.key = main.bsType;
    this.main.currency.key = main.currency;
    this.main.productCode.key = main.productCode;
    this.main.isinCode.key = main.isinCode;
    this.main.productName.key = main.productName;
    this.main.counterpartyId.key = main.counterpartyId;
    this.main.tradeDate.key = main.tradeDate;
    this.main.settleDate.key = main.settleDate;
    this.main.paymentSettleDate.key = main.paymentSettleDate;
    this.main.paymentDate.key = main.paymentDate;
    this.main.safekeepingSsi.key = main.safekeepingSsi;
    this.main.actNpa.key = transferUtil.transferPrice(main.actNpa);
    this.main.actTradePrice.key = transferUtil.transferPrice(main.actTradePrice);
    this.main.actApDealAmount.key = transferUtil.transferPrice(main.actApDealAmount);
    this.main.estNpa.key = transferUtil.transferPrice(main.estNpa);
    this.main.estTradePrice.key = transferUtil.transferPrice(main.estTradePrice);
    this.main.estApDealAmount.key = transferUtil.transferPrice(main.estApDealAmount);
    this.main.fee.key = transferUtil.transferPrice(main.fee);
    this.main.commission.key = transferUtil.transferPrice(main.commission);
    this.main.paymentAc.key = transferUtil.transferPrice(main.paymentAc);
    this.main.apvlLevel.key = main.apvlLevel ? this.$cfEnum.getKey('apvlLevelEnum', main.apvlLevel) : main.apvlLevel; // 轉換成中文格式
    this.main.apvlFxRate.key = main.apvlFxRate;
    this.main.productId.key = main.productId;

    // 鎖定時取得匯率之匯率日期，尚未鎖定時此欄位空白
    if (!this.isEmpty(this.main.cfStatus.key) && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val) {
      this.main.apvlFxRateDate.key = main.apvlFxRateDate || undefined;
    } else {
      this.main.apvlFxRateDate.key = undefined;
    }
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
    this.ssi.brokerIdType = ssi.brokerIdType ? ssi.brokerIdType : undefined;
    this.ssi.brokerId = ssi.brokerId ? ssi.brokerId : undefined;
    this.ssi.brokerAccount = ssi.brokerAccount ? ssi.brokerAccount : undefined;
    this.ssi.memo = ssi.memo ? ssi.memo : undefined;
    this.ssi.clearerIdType = ssi.clearerIdType ? ssi.clearerIdType : undefined;
    this.ssi.clearerId = ssi.clearerId ? ssi.clearerId : undefined;
    this.ssi.clearerAccount = ssi.clearerAccount ? ssi.clearerAccount : undefined;
    this.ssi.clAgentCodeType = ssi.clAgentCodeType ? ssi.clAgentCodeType : undefined;
    this.ssi.clAgentCode = ssi.clAgentCode ? ssi.clAgentCode : undefined;
    this.ssi.clearerName = ssi.clearerName ? ssi.clearerName : undefined;
    this.ssi.market = ssi.market ? ssi.market : undefined;
    this.ssi.cycd = ssi.cycd ? ssi.cycd : undefined;
    this.ssi.psetCode = ssi.psetCode ? ssi.psetCode : undefined;
    this.ssi.settlementLocation = ssi.settlementLocation ? ssi.settlementLocation : undefined;
    this.ssi.pot = ssi.pot ? ssi.pot : undefined;
    this.ssi.potNarrative = ssi.potNarrative ? ssi.potNarrative : undefined;
    this.ssi.indicator = ssi.indicator ? ssi.indicator : undefined;
    this.ssi.equityCutOffDate = ssi.equityCutOffDate ? ssi.equityCutOffDate : undefined;
    this.ssi.equityCutOffTime = ssi.equityCutOffTime ? moment(ssi.equityCutOffTime, 'HH:mm').format() : undefined;
    this.ssi.equityBufferTime = ssi.equityBufferTime ? moment(ssi.equityBufferTime, 'HH:mm').format() : undefined;
    this.ssi.bsCodeType = ssi.bsCodeType ? ssi.bsCodeType : undefined;
    this.ssi.bsCode = ssi.bsCode ? ssi.bsCode : undefined;
    this.ssi.bsName = ssi.bsName ? ssi.bsName : undefined;
    // 僅初始化給值
    if (isInit) {
      this.ssi.safekeepingAccount = ssi.safekeepingAccount ? ssi.safekeepingAccount : undefined;
      this.ssi.lastTx = ssi.lastTx ? ssi.lastTx : undefined;
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
  handleDataLock() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val };
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

  // 點擊產檔
  handleDataFile() {
    // 產檔前檢查
    this.$generateFileCommon.validateBeforeGenerate([this.main.txCode.key], '$foreignEquityApi').then(async (res) => {
      const message = res.message;
      const isSuccess = res.success;
      // 檢查失敗
      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 產檔
      let data = await this.$generateFileCommon.getGenerateFile({
        txCode: [this.main.txCode.key],
        custodian: !this.isEmpty(this.main.safekeepingSsi) && !this.isEmpty(this.main.safekeepingSsi.key)
                    ? this.main.safekeepingSsi.key.split('/')[0] : undefined,
      }, '$foreignEquityApi');
      // 產檔失敗
      if (!data.success) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 產檔成功
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
        },
      });
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    });
  }

  // 點擊列印
  handleDataPrint() {
    // 列印前檢查
    this.$generateFileCommon.validateBeforeGenerate([this.main.txCode.key], '$foreignEquityApi').then((res) => {
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

  // 列印確認送出
  async submitDataPrint(e) {
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: [this.main.txCode.key],
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

  // 點擊儲存按鈕
  handleSaveDetail() {
    // 驗證必填
    if (this.isEmpty(this.ssi.psetCode)) {
      InfoModal.alertInfo({
        confirm: false,
        content: this.$cfMessageEnum.SAVE_REQUIRED_VALIDATE_INFO?.message,
      });

      if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.formRef)) {
        (this.$refs.formRef as any).validate((valid) => {
          if (!valid) {
            return false;
          }
        });
      }
      // 頁籤跳至收付款資訊
      this.activeKey = this.$authService.ssiTab.key;
      return;
    }
    // call API
    this.saveDetail();
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

  // 儲存
  saveDetail() {
    // 整理儲存後端所需格式
    // Time整理
    this.ssi.equityCutOffTime = this.ssi.equityCutOffTime ? moment(this.ssi.equityCutOffTime).format('HHmm') : undefined;
    this.ssi.equityBufferTime = this.ssi.equityBufferTime ? moment(this.ssi.equityBufferTime).format('HHmm') : undefined;

    let dto = {
      txCode: this.main.txCode ? this.main.txCode.key : undefined,
      ssi: this.ssi,
      attachment: {
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
          attachmentType: this.$cfEnum.attachmentTypeEnum.find((el) => el.key === '確認書').val,
          // file,
        });
      }
    });
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/foreign-equity/saveDetail`, 'txCodeSaveDetailDto', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachmentInfo = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', dto.txCode);
        // 重查國外股票資訊，要依進階查詢篩選條件重查
        this.$emit('handleSearch', true);
      },
      // 失敗後要執行的流程
      // () => {
      //   this.attachmentInfo = [];
      //   this.deleteUploadList = [];
      // },
    );
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

  // 已上傳附件下載
  handleDownloadAttachment(item) {
    if (!item.attachmentName) return;
    const fileId = item.attachmentId;
    const fileName = item.attachmentName.slice(0, item.attachmentName.length - 4);
    const fileType = this.$cfEnum.fileExtensionEnum.PDF.toLowerCase();
    // call API
    this.$cfCommon.downloadAttachment(fileId, fileName, fileType);
  }

  // 查詢交易的PSET Code下拉選單
  getTxSsiPsetCode(data) {
    // 整理成後端格式
    let dto = {
      counterpartyId: data.main.counterpartyId ? data.main.counterpartyId : undefined,
      currency: data.main.currency ? data.main.currency : undefined,
      productId: data.main.productId ? data.main.productId : undefined,
      custodian: data.main.safekeepingSsi ? data.main.safekeepingSsi.split('/')[0] : undefined,
    };
    // call API
    this.setLoading(true);
    this.$foreignEquityApi.searchTxSsiPsetCodeUsingPOST(dto)
    .then((res) => {
      this.psetCodeOption = res.data.content;

      // 整理收付款資訊
      this.setSsiInitInfo(data.ssi, true);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 改變 PSET CODE 已選取選項
  changeTxSsi() {
    // 整理成後端格式
    let dto = {
      counterpartyId: this.main.counterpartyId ? this.main.counterpartyId.key : undefined,
      currency: this.main.currency ? this.main.currency.key : undefined,
      productId: this.main.productId ? this.main.productId.key : undefined,
      custodian: this.main.safekeepingSsi && this.main.safekeepingSsi.key
                  ? this.main.safekeepingSsi.key.split('/')[0] : undefined,
      psetCode: this.ssi.psetCode ? this.ssi.psetCode : undefined,
      txCode: this.main.txCode ? this.main.txCode.key : undefined,
    };
    // call API
    this.setLoading(true);
    this.$foreignEquityApi.changeTxSsiUsingPOST(dto)
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
    this.tempApvlFxRateDate = undefined;
    this.modalShowCount = 0;
    // 前台成交資訊
    Object.entries(this.main).forEach(([key, item], index) => {
      if (!this.isEmpty(this.main[key])) {
        this.main[key].key = undefined;
        this.main[key].isEdit = false;
      }
    });
    // 其他成交資訊
    Object.entries(this.other).forEach(([key, item], index) => {
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = undefined;
        this.other[key].isEdit = false;
      }
    });
    // 收付款資訊
    Object.entries(this.ssi).forEach(([key, item], index) => {
      if (!this.isEmpty(this.ssi[key])) {
        this.ssi[key] = undefined;
        this[key] = false;
      }
    });
    // 上傳的附件
    this.attachmentInfo = [];
    // 必填驗證紅框樣式
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.formRef)) {
      (this.$refs.formRef as any).resetFields();
    }
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

  // 開啟交易對手檢視彈窗
  openSsiCheckInfoModal() {
    this.modalSsiCheckInfoShow = true;
  }

  // 關閉交易對手檢視彈窗
  closeSsiCheckInfoModal() {
    this.modalSsiCheckInfoShow = false;
  }

  // 查詢成交資訊明細比較前後差異
  async searchDetailDifferent() {
    let data = await this.$cfCommon.searchDetailDifferent({ txCode: this.main.txCode.key }, '$foreignEquityApi');
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
  // potNarrative 欄位輸入驗證
  validatePotNarrative(rule: any, value: any, callback: Function) {
    // 只允許輸入英文
    this.ssi.potNarrative = validateUtil.validateFormData(4, value);
  }

  // indicator 欄位輸入驗證
  validateIndicator(rule: any, value: any, callback: Function) {
    // 只允許輸入英文
    this.ssi.indicator = validateUtil.validateFormData(4, value);
  }

  // pot 欄位輸入驗證
  validatePot(rule: any, value: any, callback: Function) {
    // 只允許輸入英文
    this.ssi.pot = validateUtil.validateFormData(4, value);
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
}
