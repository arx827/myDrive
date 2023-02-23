import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import transferUtil from '@/plugins/util/transferUtil';
import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';
import moment from 'moment';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import ReturnModal from '@/pages/cf/TransactionManagement/Product/ReturnModal.vue';

@Component({
  components: {
    PrintModal,
    ReturnModal,
    UploadDragger,
    CheckInfoForm,
    IpkButton,
  },
})
export default class EATCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  // @Prop()
  // txCode: object // 檢視彈窗資訊

  @Prop()
  tradeType: string // 交易別，Tender Offer='14 換券='15'

  @Prop()
  form: any // 檢視彈窗資訊

  /**
  * data
  */
  activeKey = this.$authService.mainTab.key; // 被選取的頁籤(預設前台成交資訊)

  checkInfoModalVisible = false // modal開關

  // cfStatus = ''; // 交易確認狀態

  /** 前台成交資訊頁籤 */
  main: any = {};

  // 前台成交資訊頁籤_表單欄位名稱
  mainColumnEnum = {
    exchange: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText',
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態', type: 'badge',
      },
      event: {
        key: undefined, label: '交易別', type: 'inputText',
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText',
      },
      tradeDirection: {
        key: undefined, label: '收/付款', type: 'inputText',
      },
      outBondCode: {
        key: undefined, label: '換出債券標的(ISIN)', type: 'inputText',
      },
      inBondCode: {
        key: undefined, label: '換入債券標的(ISIN)', type: 'inputText',
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date',
      },
      settleDate: {
        key: undefined, label: '換券交割日', type: 'date',
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText',
      },
      outNpa: {
        key: undefined, label: '換出面額', type: 'inputText',
      },
      inNpa: {
        key: undefined, label: '換入面額', type: 'inputText',
      },
      outTradePrice: {
        key: undefined, label: '換出價格', type: 'inputText',
      },
      inTradePrice: {
        key: undefined, label: '換入價格', type: 'inputText',
      },
      apDealAmount: {
        key: undefined, label: '淨額除息金額', type: 'inputText',
      },
      apAiAmount: {
        key: undefined, label: '淨額前手息', type: 'inputText',
      },
      consentFee: {
        key: undefined, label: 'ConsentFee', type: 'inputText',
      },
      paymentAmount: {
        key: undefined, label: '淨額交割金額', type: 'inputText',
      },
      outApDealAmount: {
        key: undefined, label: '換出金額', type: 'inputText',
      },
      inApDealAmount: {
        key: undefined, label: '換入金額', type: 'inputText',
      },
      outCustodian: {
        key: undefined, label: '換出保管行', type: 'inputText',
      },
      inCustodian: {
        key: undefined, label: '換入保管行', type: 'inputText',
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText',
      },
      outAp: {
        key: undefined, label: '換出會計分類', type: 'inputText',
      },
      inAp: {
        key: undefined, label: '換入會計分類', type: 'inputText',
      },
      outAsName: {
        key: undefined, label: '換出資產區隔', type: 'inputText',
      },
      inAsName: {
        key: undefined, label: '換入資產區隔', type: 'inputText',
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText',
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText',
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText',
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'dateTime',
      },
    },
    tender: {
      txCode: {
        key: undefined, label: '交易編號', type: 'inputText',
      },
      cfStatus: {
        key: undefined, label: '交易確認狀態', type: 'badge',
      },
      event: {
        key: undefined, label: '交易別', type: 'inputText',
      },
      invCategoryName: {
        key: undefined, label: '資產類別', type: 'inputText',
      },
      tradeDirection: {
        key: undefined, label: '收/付款', type: 'inputText',
      },
      bondCode: {
        key: undefined, label: '債券標的(ISIN)', type: 'inputText',
      },
      tradeDate: {
        key: undefined, label: '交易日', type: 'date',
      },
      settleDate: {
        key: undefined, label: '券交割日', type: 'date',
      },
      paymentSettleDate: {
        key: undefined, label: '款交割日', type: 'inputText',
      },
      currency: {
        key: undefined, label: '幣別', type: 'inputText',
      },
      tradeNpa: {
        key: undefined, label: '買/賣成交面額', type: 'inputText',
      },
      tradePrice: {
        key: undefined, label: '買入/賣出價格', type: 'inputText',
      },
      apDealAmount: {
        key: undefined, label: '除息金額', type: 'inputText',
      },
      apAiAmount: {
        key: undefined, label: '前手息', type: 'inputText',
      },
      paymentAmount: {
        key: undefined, label: '交割款項', type: 'inputText',
      },
      custodian: {
        key: undefined, label: '債券保管', type: 'inputText',
      },
      counterpartyId: {
        key: undefined, label: '交易對象', type: 'inputText',
      },
      ap: {
        key: undefined, label: '會計分類', type: 'inputText',
      },
      asName: {
        key: undefined, label: '資產區隔', type: 'inputText',
      },
      memo: {
        key: undefined, label: '備註', type: 'inputText',
      },
      apvlLevel: {
        key: undefined, label: '簽核權限', type: 'inputText',
      },
      updateId: {
        key: undefined, label: '作業人員', type: 'inputText',
      },
      updateDate: {
        key: undefined, label: '作業日期', type: 'date',
      },
    },
  }

  /** 其他成交資訊頁籤 */
  other: any = {};

  // 其他成交資訊頁籤_表單欄位名稱
  otherColumnEnum = {
    exchange: {
      outDealYield: {
        key: undefined, label: '換出yield', type: 'inputText',
      },
      inDealYield: {
        key: undefined, label: '換入yield', type: 'inputText',
      },
      outIssuer: {
        key: undefined, label: '換出券發行公司', type: 'inputText',
      },
      inIssuer: {
        key: undefined, label: '換入券發行公司', type: 'inputText',
      },
      outIssuerCountry: {
        key: undefined, label: '換出券所屬國家', type: 'inputText',
      },
      inIssuerCountry: {
        key: undefined, label: '換入券所屬國家', type: 'inputText',
      },
      outSector: {
        key: undefined, label: '換出產業別', type: 'inputText',
      },
      inSector: {
        key: undefined, label: '換入產業別', type: 'inputText',
      },
      outIssueDate: {
        key: undefined, label: '換出發行日', type: 'date',
      },
      inIssueDate: {
        key: undefined, label: '換入發行日', type: 'date',
      },
      outMaturityDate: {
        key: undefined, label: '換出到期日', type: 'date',
      },
      inMaturityDate: {
        key: undefined, label: '換入到期日', type: 'date',
      },
      outIssueNpa: {
        key: undefined, label: '換出發行總額', type: 'inputText',
      },
      inIssueNpa: {
        key: undefined, label: '換入發行總額', type: 'inputText',
      },
      outCouponRate: {
        key: undefined, label: '換出票面利率', type: 'inputText',
      },
      inCouponRate: {
        key: undefined, label: '換入票面利率', type: 'inputText',
      },
      outRateType: {
        key: undefined, label: '換出固定/浮動', type: 'inputText',
      },
      inRateType: {
        key: undefined, label: '換入固定/浮動', type: 'inputText',
      },
      outDividendFreq: {
        key: undefined, label: '換出付息頻率', type: 'inputText',
      },
      inDividendFreq: {
        key: undefined, label: '換入付息頻率', type: 'inputText',
      },
      outCreditRating: {
        key: undefined, label: '換出信用評等', type: 'inputText',
      },
      inCreditRating: {
        key: undefined, label: '換入信用評等', type: 'inputText',
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText',
      },
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText',
      },
      trader: {
        key: undefined, label: '交易員', type: 'inputText',
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText',
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText',
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText',
      },
      outIsSppi: {
        key: undefined, label: '換出債券是否通過SSPI測試', type: 'inputText',
      },
      inIsSppi: {
        key: undefined, label: '換入債券是否通過SSPI測試', type: 'inputText',
      },
    },
    tender: {
      guaranteeType: {
        key: undefined, label: '擔保類型', type: 'inputText',
      },
      tradeDealYield: {
        key: undefined, label: '買入/賣出殖利率', type: 'inputText',
      },
      tradeSpread: {
        key: undefined, label: '買入/賣出Spread', type: 'inputText',
      },
      issuer: {
        key: undefined, label: '發行公司', type: 'inputText',
      },
      bondName: {
        key: undefined, label: '債券名稱', type: 'inputText',
      },
      sector: {
        key: undefined, label: '產業別', type: 'inputText',
      },
      creditRating: {
        key: undefined, label: '信用評等', type: 'inputText',
      },
      otherNotation: {
        key: undefined, label: '其他申明(註)', type: 'inputText',
      },
      isStakeholder: {
        key: undefined, label: '是否為利害關係人', type: 'inputText',
      },
      oldPortfolio: {
        key: undefined, label: '舊Portfolio', type: 'inputText',
      },
      trader: {
        key: undefined, label: '交易員', type: 'inputText',
      },
      confirmManager1: {
        key: undefined, label: '放行主管1', type: 'inputText',
      },
      confirmManager2: {
        key: undefined, label: '放行主管2', type: 'inputText',
      },
      confirmManager3: {
        key: undefined, label: '放行主管3', type: 'inputText',
      },
      isSppi: {
        key: undefined, label: '是否通過SSPI測試', type: 'inputText',
      },
    },
  }

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    safekeepingAccount: undefined,
  };

  modalPrintShow = false; // [列印彈窗] modal開關

  modalReturnShow = false; // [退回彈窗] modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

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

  @Watch('form', { immediate: true, deep: true })
  onChangeForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    // 整理初始資訊
    this.onTabChange();
  }

  @Watch('main.cfStatus', { immediate: true, deep: true })
  onCfStatusChangeForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    // 已比對後不可再調整上傳附件
    if (this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.LOCK.val
      && this.main.cfStatus.key !== this.$cfEnum.cfStatusConstant.EMPTY.val) {
        this.fileUploadData.uploadDisabled = true;
    } else {
      this.fileUploadData.uploadDisabled = false;
    }
  }

  // 頁籤改變
  // @Watch('activeKey')
  onTabChange() {
    switch (this.activeKey) {
      // 前台資料明細
      case this.$authService.mainTab.key:
        this.main = this.tradeType === '14' ? this.mainColumnEnum.tender : this.mainColumnEnum.exchange;
        break;
      // 其他成交資訊
      case this.$authService.otherTab.key:
        this.other = this.tradeType === '14' ? this.otherColumnEnum.tender : this.otherColumnEnum.exchange;
        break;
      case this.$authService.ssiTab.key:
        this.ssi = this.form.ssi;
        break;
      case this.$authService.attachmentTab.key:
        break;
    }
    this.setInitInfo(this.form);
  }

  /**
  * methods
  */

  // 整理成交資訊
  setInitInfo(data) {
    // 整理前台成交資訊
    this.setMainInitInfo(data.main);
    // 整理其他成交資訊
    this.setOtherInitInfo(data.other);
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
    Object.entries(main).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.main[key])) {
        this.main[key].key = item;
        if (key === 'outTradePrice' || key === 'inTradePrice' || key === 'apDealAmount' || key === 'paymentAmount' || key === 'outApDealAmount'
        || key === 'inApDealAmount' || key === 'tradePrice' || key === 'apDealAmount' || key === 'apAiAmount' || key === 'tradeNpa' || key === 'outNpa' || key === 'inNpa' || key === 'consentFee') {
          this.main[key].key = transferUtil.transferPrice(itemVal);
        }
        if (key === 'paymentSettleDate') {
          // tender款交割日固定'-'
          this.main[key].key = this.isEmpty(item) ? '-' : moment(item).format('YYYY/MM/DD');
        }
        if (key === 'apvlLevel') {
          this.main[key].key = this.$cfEnum.getKey('apvlLevelEnum', item);
        }
        if (key === 'tradeDirection') {
          this.main[key].key = this.$cfEnum.getKey(this.tradeType === '14' ? 'tradeDirectionTenderEnum' : 'tradeDirectionEnum', item);
        }
        if (key === 'event') {
          this.main[key].key = this.$cfEnum.getLabel('eventOption', item);
        }
        if (key === 'inTradePrice') {
          this.main[key].key = item === 0 ? '成本換入' : item;
        }
        if (key === 'outTradePrice') {
          this.main[key].key = item === 0 ? '成本換出' : item;
        }
      }
    });
  }

  // 整理其他成交資訊
  setOtherInitInfo(other) {
    if (this.isEmpty(other)) {
      return;
    }
    Object.entries(other).forEach(([key, item], index) => {
      const itemVal: any = item;
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;

        if (key === 'tradeDealYield' || key === 'inCouponRate' || key === 'outCouponRate' || key === 'outDealYield' || key === 'inDealYield') {
          this.other[key].key = typeof (item) === 'number' ? `${item}%` : '';
        }

        if (key === 'outDividendFreq' || key === 'inDividendFreq') {
          this.other[key].key = this.$cfEnum.getLabel('dividendFreqOption', item);
        }
        if (key === 'outIssueNpa' || key === 'inIssueNpa') {
          this.other[key].key = transferUtil.transferPrice(itemVal);
        }
      }
    });
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

  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closeCheckInfoModal() {
    this.resetForm();
    // 關閉彈窗
    this.$emit('closeCheckInfoModal');
    // 依進階查詢篩選條件重查
    this.$emit('handleSearch', true);
  }

  // 點擊鎖定
  handleDataLock() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.LOCK.val, event: this.tradeType };
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
                this.$emit('searchTxDetail', dto.txCode[0], this.tradeType);
              },
            });
          }
        },
      });
    });
  }

  // 點擊資料比對
  handleDataComparison() {
    // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.COMPARED.val, event: this.tradeType };
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
                this.$emit('searchTxDetail', dto.txCode[0], this.tradeType);
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
    let check = await this.$generateFileCommon.validateBeforeGenerate([this.main.txCode.key], '$foreignExchangeAndTenderApi');
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
      productGroup: this.$cfEnum.printParam.ExchangeAndTender.productGroup,
      fileType: this.$cfEnum.printParam.ExchangeAndTender.fileType,
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
       custodian: undefined,
       fileCode: e.fileCode,
       fileExtension: e.fileExtension,
     }, '$foreignExchangeAndTenderApi');

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
    // // 異動交易確認狀態前檢查
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.SUBMIT.val, event: this.tradeType };
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
                this.$emit('searchTxDetail', dto.txCode[0], this.tradeType);
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
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.prodReviewStatus.RETURN.val, event: this.tradeType };
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
                this.$emit('searchTxDetail', dto.txCode[0], this.tradeType);
              },
            });
          }
        },
      });
    });
  }

  // 退回解鎖
  handleReturnLock() {
    // 異動交易確認狀態前檢查: 狀態是壓成0
    let dto = { txCode: [this.main.txCode.key], cfStatus: this.$cfEnum.cfStatusConstant.RETURN_UNLOCKED.val, event: this.tradeType };
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
                this.$emit('searchTxDetail', dto.txCode[0], this.tradeType);
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

  // 點擊儲存
  saveDetail() {
    // 整理儲存後端所需格式
    let dto = {
      txCode: this.main.txCode ? this.main.txCode.key : undefined,
      // ssi: this.ssi,
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
        });
      }
    });
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/foreign-bond-exchange-tender-offer/saveDetail`, 'dto', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachmentInfo = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', dto.txCode, this.tradeType);
        // 重查國外債table，要依進階查詢篩選條件重查
        this.$emit('handleSearch');
      },
      // 失敗後要執行的流程
      // () => {
      //   this.attachmentInfo = [];
      //   this.deleteUploadList = [];
      // },
    );
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.attachmentInfo = this.attachmentInfo.filter((el) => el.uid !== file.uid);
    // 有attachmentId的表示為後端傳的，push進去
    if (file.attachmentId) {
      this.deleteUploadList.push(file.attachmentId);
    }
  }

  // 異動交易確認狀態前檢查
  validateBeforeModifyCfStatus(dto): any {
    this.setLoading(true);
    return new Promise((resolve, reject) => {
      this.$foreignExchangeAndTenderApi.checkBeforeModifyCfStatusUsingPOST(dto)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
        reject();
      })
      .finally(() => {
        this.setLoading(false);
      });
    });
  }

  // 異動交易確認狀態
  async modifyCfStatus(dto) {
    let data: any = {};
    this.setLoading(true);
    await this.$foreignExchangeAndTenderApi.modifyCfStatusUsingPATCH(dto)
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
    })
    .finally(() => {
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
    this.ssi.safekeepingAccount = undefined;
    // 上傳的附件
    this.attachmentInfo = [];
    // 必填驗證紅框樣式
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.formRef)) {
      (this.$refs.formRef as any).resetFields();
    }
  }

  // API: 查詢成交資訊明細比較前後差異
  async searchDetailDifferent() {
    let data = await this.$cfCommon.searchDetailDifferent({ txCode: this.main.txCode.key }, '$foreignExchangeAndTenderApi');
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
}
