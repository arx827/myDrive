import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';

import {
 FbSettlementLocationDto, ForeignBondStructureChangeTxSsiFbDto, ForeignBondStructureChangeTxSsiCpDto, SearchCpDto,
} from '@fubonlife/ipk-api-axios-sdk';

import { CheckInfoModel } from '@/components/shared/modal/CheckInfoModal/model';
import PrintModal from '@/components/shared/modal/PrintModal/PrintModal.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import transferUtil from '@/plugins/util/transferUtil';
import CheckInfoForm from '@/components/shared/form/CheckInfoForm.vue';
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
export default class SNCheckInfoModal extends Vue {
  @Action('setLoading') setLoading;

  @Getter getLoginInfo!: object;

  /**
  * props
  */
  @Prop()
  modalCheckInfoShow: boolean // modal開關

  @Prop()
  form: object // 檢視彈窗資訊

  /**
  * data
  */
  activeKey = this.$authService.mainTab.key; // 被選取的頁籤(預設前台成交資訊)

  snCheckInfoModalVisible = false // modal開關

  fileCodeOption = []; // [列印彈窗] 下拉選單

  defaultVal = { // [列印彈窗] 預設選項
    fileCode: undefined, // 檔案類型
    fileExtension: undefined, // 檔案格式
  }

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
    invCategoryName: {
      key: undefined, label: '資產類別', type: 'inputText', isEdit: false,
    },
    bsType: {
      key: undefined, label: '交易別', type: 'inputText', isEdit: false,
    },
    counterpartyId: {
      key: undefined, label: '交易對象', type: 'inputText', isEdit: false,
    },
    issuer: {
      key: undefined, label: '發行公司(ISSUER)', type: 'inputText', isEdit: false,
    },
    bondName: {
      key: undefined, label: '債券名稱', type: 'inputText', isEdit: false,
    },
    bondCode: {
      key: undefined, label: '債券標的(ISIN)', type: 'inputText', isEdit: false,
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
      key: undefined, label: '幣別', type: 'inputText', isEdit: false,
    },
    tradeNpa: {
      key: undefined, label: '買/賣成交面額', type: 'inputText', isEdit: false,
    },
    tradePrice: {
      key: undefined, label: '買入/賣出價格', type: 'inputText', isEdit: false,
    },
    apDealAmount: {
      key: undefined, label: '除息金額', type: 'inputText', isEdit: false,
    },
    apAiAmount: {
      key: undefined, label: '前手息', type: 'inputText', isEdit: false,
    },
    paymentAmount: {
      key: undefined, label: '交割款項', type: 'inputText', isEdit: false,
    },
    custodian: {
      key: undefined, label: '債券保管', type: 'inputText', isEdit: false,
    },
    asName: {
      key: undefined, label: '資產區隔', type: 'inputText', isEdit: false,
    },
    memo: {
      key: undefined, label: '備註', type: 'inputText', isEdit: false,
    },
  };

  modalPrintShow = false; // [列印彈窗] modal開關

  modalReturnShow = false; // [退回彈窗] modal開關

  /** 其他成交資訊 */
  other: { [key: string]: CheckInfoModel } = { // v-model綁定及表單欄位名稱
    sector: {
      key: undefined, label: '產業別', type: 'inputText', isEdit: false,
    },
    creditRating: {
      key: undefined, label: '信用評等', type: 'inputText', isEdit: false,
    },
    otherNotation: {
      key: undefined, label: '其他申明(註)', type: 'inputText', isEdit: false,
    },
    ap: {
      key: undefined, label: '會計分類', type: 'inputText', isEdit: false,
    },
    oldPortfolio: {
      key: undefined, label: '舊Portfolio', type: 'inputText', isEdit: false,
    },
    isStakeholder: {
      key: undefined, label: '是否為利害關係人', type: 'inputText', isEdit: false,
    },
    isSppi: {
      key: undefined, label: '是否通過SPPI測試', type: 'inputText', isEdit: false,
    },
    trader: {
      key: undefined, label: '交易員', type: 'inputText', isEdit: false,
    },
    guarantor: {
      key: undefined, label: '保證人(Guarantor)', type: 'inputText', isEdit: false,
    },
    tradeDealYield: {
      key: undefined, label: '買入/賣出殖利率', type: 'inputText', isEdit: false,
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
    confirmStatus: {
      key: undefined, label: '覆核狀態', type: 'inputText', isEdit: false,
    },
  };

  /** 收付款資訊 */
  ssi = { // v-model綁定及表單欄位名稱
    safekeepingAccount: undefined,
    fbSettlementLocation: undefined,
    cpClAgentCode: undefined,
    cpCounterpartyId: undefined,
    cpSettlementLocation: undefined,
    fbClearerId: undefined,
  };

  fbSettlementLocations = [] // Settlement Location下拉選項

  cpClAgentCodes = [] // Broker Agent Code下拉選項

  ssiRules: { [key: string]: ValidationRule[] } = { // 表單驗證
    fbSettlementLocation: [{ required: true, message: '請選擇', trigger: 'blur' }],
    cpClAgentCode: [{ required: true, message: '請選擇', trigger: 'blur' }],
  };

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

  productId = null; // 產品Id用於查詢

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
    this.snCheckInfoModalVisible = val;
  }

  @Watch('form', { immediate: true, deep: true })
  async onChangeForm(val) {
    if (this.isEmpty(val)) {
      return;
    }
    // 整理初始資訊
    this.setInitInfo(val);
  }

  @Watch('ssi.fbSettlementLocation', { immediate: true, deep: true })
  onChangefbSettlementLocation(val) {
    if (val && this.main.cfStatus.key === '1') {
      // 更換settlement location後連動更新
      this.setChangeTxSsiFb();
    }
  }

  @Watch('ssi.cpClAgentCode', { immediate: true, deep: true })
  onChangecpClAgentCode(val) {
    if (val && this.main.cfStatus.key === '1') {
      // 更換settlement location後連動更新
      this.setChangeTxSsiCp();
    }
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉modal
  closeSNCheckInfoModal() {
    this.resetForm();
    this.$emit('closeSNCheckInfoModal');
    this.$emit('handleSearch', true);
  }

  // 整理成交資訊
  async setInitInfo(data) {
    // 整理前台成交資訊
    this.setMainInitInfo(data.main);
    // 整理其他成交資訊
    this.setOtherInitInfo(data.other);
    // 取得 Settlement Location 下拉選單
    await this.getSettlementLocationOption();
    // 取得 交易對手Clearing agent code下拉選單
    await this.getCpSettlementLocationOption();
    // 收付款資訊
    this.setSsiInitInfo(data.ssi);
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

    this.productId = main.productId;
      Object.entries(main).forEach(([key, item], index) => {
        const itemVal: any = item;
        if (!this.isEmpty(this.main[key])) {
          this.main[key].key = item;
          // this.transferDate(this.main[key]);
          if (key === 'tradePrice' || key === 'apDealAmount' || key === 'tradeNpa' || key === 'paymentAmount' || key === 'apAiAmount') {
            this.main[key].key = transferUtil.transferPrice(itemVal);
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
      if (!this.isEmpty(this.other[key])) {
        this.other[key].key = item;
        // this.transferDate(this.other[key]);
        if (key === 'tradeDealYield') {
          this.other[key].key = typeof (item) === 'number' ? `${item}%` : '';
        }
        if (key === 'confirmStatus') {
          this.other[key].key = item ? this.$cfEnum.getKey('confirmStatusEnum', item) : '';
        }
      }
    });
  }

  // 整理收付款資訊
  setSsiInitInfo(ssi) {
    if (this.isEmpty(ssi)) {
      return;
    }
    Object.entries(ssi).forEach(([key, item], index) => {
      // if (!this.isEmpty(this.ssi[key])) {
        this.ssi[key] = item;
        // this.transferDate(this.other[key]);
      // }
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
  async handleDataFile() {
    // 產檔前檢查(結構債-產檔前檢查邏輯跟其他不一樣)
    this.setLoading(true);
    await this.$foreignBondStructureApi.checkBeforeGenerateUsingPOST({ txCode: [this.main.txCode.key] })
      .then(async (res) => {
        if (!res.data.success) {
          InfoModal.alertError({ confirm: false, content: res.data?.message });
        }

        // 產檔
        let data = await this.$generateFileCommon.getGenerateFile({
          txCode: [this.main.txCode.key],
          custodian: this.main.custodian?.key,
        });
        // 產檔失敗
        if (!data.success) {
          InfoModal.alertError({ confirm: false, content: data?.message });
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
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 點擊列印
  handleDataPrint() {
    // 結構債先打開列印彈窗, 點下確認才檢查狀態
    this.modalPrintShow = true;

    // 取得列印下拉選單
    this.getSearchFile();
  }

  // 關閉列印彈窗
  closePrintModal() {
    this.modalPrintShow = false;
  }

  // 列印確認送出
  async submitDataPrint(e) {
    let check = false;
    await this.$foreignBondStructureApi.checkBeforeGenerateUsingPOST({ txCode: [this.main.txCode.key], fileCode: e.fileCode })
      .then((res) => {
        if (!res.data.success) {
          InfoModal.alertError({ confirm: false, content: res.data?.message });
          check = false;
        } else {
          check = true;
        }
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
    if (!check) return;
    // 列印
    let data = await this.$generateFileCommon.getGenerateFile({
      txCode: [this.main.txCode.key],
      fileCode: e.fileCode,
      fileExtension: e.fileExtension,
    }, '$foreignBondStructureApi');

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
            this.$generateFileCommon.download(data.content.fileId, data.content.fileDesc, data.content.fileExtension);
          }, this.$cfEnum.downloadTime);
        }
        // 關閉列印彈窗
        this.closePrintModal();
      },
    });

    // 關閉列印彈窗
    this.closePrintModal();
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
    // 異動交易確認狀態前檢查：cfStatus=7 “經辦退回”
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
    // 異動交易確認狀態前檢查: 狀態是壓成0
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
    if (this.isEmpty(this.ssi.fbSettlementLocation) || this.isEmpty(this.ssi.cpClAgentCode)) {
      InfoModal.alertInfo({
        confirm: true,
        content: this.$cfMessageEnum.SAVE_REQUIRED_VALIDATE_INFO?.message,
      });

      if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.ssiModalForm)) {
        (this.$refs.ssiModalForm as any).validate((valid) => {
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

  // API: 15.儲存交易資訊明細
  saveDetail() {
    // 整理儲存後端所需格式
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
        });
      }
    });
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/foreign-bond-structure/saveDetail`, 'dto', dto, 'files', this.attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.attachmentInfo = [];
        this.deleteUploadList = [];
        // 重查成交資訊明細
        this.$emit('searchTxDetail', dto.txCode);
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
      this.$foreignBondStructureApi.checkBeforeModifyCfStatusUsingPOST(dto)
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
    await this.$foreignBondStructureApi.modifyCfStatusUsingPATCH(dto)
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

  // API: 8.查詢SettlementLocation下拉選單
  async getSettlementLocationOption() {
    this.setLoading(true);
    const data: FbSettlementLocationDto = {
      currency: this.main.currency?.key,
      custodian: this.main.custodian?.key,
    };
    await this.$foreignBondStructureApi.searchFbSettlementLocationUsingPOST(data)
    .then((res) => {
      this.fbSettlementLocations = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 9. 異動我方收付款資訊
  async setChangeTxSsiFb() {
    this.setLoading(true);
    const data: ForeignBondStructureChangeTxSsiFbDto = {
      settlementLocation: this.ssi.fbSettlementLocation,
      currency: this.main.currency?.key,
      custodian: this.main.custodian?.key,
    };
    await this.$foreignBondStructureApi.changeTxSsiFbUsingPOST(data)
    .then((res) => {
      // this.fbSettlementLocations = res.data.content;
      const content = res.data.content;
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      this.ssi.safekeepingAccount = content?.safekeepingAccount;
      this.ssi.fbClearerId = content?.fbClearerId;
      // this.ssi.cpSettlementLocation = content.fbSettlementLocation;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 10. 查詢交易對手Clearing agent code下拉選單
  async getCpSettlementLocationOption() {
    this.setLoading(true);
    const data: SearchCpDto = {
      // TEST:
      // counterpartyId: 'CITIC Securities Co Ltd',
      counterpartyId: this.main.counterpartyId?.key,
      productId: this.productId,
    };
    await this.$foreignBondStructureApi.searchCpClearingAgentCodeUsingPOST(data)
    .then((res) => {
      this.cpClAgentCodes = res.data.content;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 11. 異動交易對手收付款資訊
  async setChangeTxSsiCp() {
    this.setLoading(true);
    const data: ForeignBondStructureChangeTxSsiCpDto = {
      clAgentCode: this.ssi.cpClAgentCode,
      counterpartyId: this.main.counterpartyId ? this.main.counterpartyId.key : undefined,
      productId: this.productId,
    };
    await this.$foreignBondStructureApi.changeTxSsiCpUsingPOST(data)
    .then((res) => {
      const content = res.data.content;
      const message = res.data.message;
      const isSuccess = res.data.success;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      this.ssi.cpCounterpartyId = content?.cpCounterpartyId;
      this.ssi.cpSettlementLocation = content?.cpSettlementLocation;
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // API: 取得列印下拉選單
  async getSearchFile() {
    this.fileCodeOption = await this.$cfCommon.getSearchFile({
      productGroup: this.$cfEnum.printParam.StructuredNotes.productGroup,
      fileType: this.$cfEnum.printParam.StructuredNotes.fileType,
    });
    // 預設選項
    this.defaultVal.fileExtension = this.$cfEnum.fileExtensionEnum.EXCEL; // 檔案格式, 預設EXCEL
  }

  // API: 查詢成交資訊明細比較前後差異
  async searchDetailDifferent() {
    let data = await this.$cfCommon.searchDetailDifferent({ txCode: this.main.txCode.key }, '$foreignBondStructureApi');
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
    this.attachmentInfo = [];
    // 必填驗證紅框樣式
    if (!this.isEmpty(this.$refs) && !this.isEmpty(this.$refs.formRef)) {
      (this.$refs.formRef as any).resetFields();
    }
  }
}
