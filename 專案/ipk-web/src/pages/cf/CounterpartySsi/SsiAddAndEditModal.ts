import {
  Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import exportUtil from '@/plugins/util/exportUtil';
import InfoModal from '@/plugins/notification/infoModal';
import transferUtil from '@/plugins/util/transferUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';

import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkSelect from '@/components/shared/form/IpkSelect.vue';
import IpkAddItemSelect from '@/components/shared/form/IpkAddItemSelect.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    UploadDragger,
    IpkVxeTable,
    IpkSelect,
    IpkAddItemSelect,
    IpkButton,
  },
})
export default class SsiAddAndEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  addAndEditInfo: any // 新增修改資訊

  /**
  * data
  */
  modalVisible = false; // modal開關

  modalTitle = ''; // modal標題

  isEdit = false; // 是否為修改流程

  activeKey = '1'; // 被選取的頁籤(預設資料明細)

  // ----------- 因後端回傳string，前端switch元件需用boolean，故另宣告變數 START -----------

  isCash = false; // 新增款

  isCashEffectStatus = true; // 生效，預設：true

  isCashDefault = false; // 預設

  isEquity = false; // 新增券

  isEquityEffectStatus = true; // 生效，預設：true

  isEquityDefault = false; // 預設

  // ----------- 因後端回傳string，前端switch元件需用boolean，故另宣告變數 END -----------

  cash = this.createCash(); // 款帳號資訊

  equity = this.createEquity(); // 券帳號資訊

  contact = this.createContact(); // 聯絡資訊

  attachment = this.createAttachment(); // 上傳附件

  afterCashEdit = {}; // 紀錄編輯後的款資訊，避免重查後值恢復

  afterEquityEdit = {}; // 紀錄編輯後的券資訊，避免重查後值恢復

  // 依照保管行改變欄位顏色
  isBONY = '';

  isCITI = ''

  isJPM = ''

  isBONY_JPM = ''

  isCITI_TDCC = ''

  isBONY_JPM_TDCC = ''

  // 新增款表單驗證
  cashRules: { [key: string]: ValidationRule[] } = {
    counterpartyId: [{ required: true, message: '請輸入機構編號', trigger: 'blur' }],
    productId: [{ required: true, message: '請選擇產品別', trigger: 'blur' }],
    bfBankAccount: [{
      required: false,
      validator: this.validateCashbfBankAccount,
      trigger: 'change',
    }],
    bfBankType: [{
      required: false,
      validator: this.validateBfBankType,
      trigger: 'change',
    }],
    bfAccount: [{
      required: false,
      validator: this.validateBfAccount,
      trigger: 'change',
    }],
    bfAccountNameCode: [{
      required: false,
      validator: this.validateBfAccountNameCode,
      trigger: 'change',
    }],
    bfBankIban: [{
      required: false,
      validator: this.validateBfBankIban,
      trigger: 'change',
    }],
    bfBankAba: [{
      required: false,
      validator: this.validateBfBankAba,
      trigger: 'change',
    }],
    bfAccountNoType: [{
      required: false,
      validator: this.validateBfAccountNoType,
      trigger: 'change',
    }],
    bfAccountNameType: [{
      required: false,
      validator: this.validateBfAccountNameType,
      trigger: 'change',
    }],
    imBankCode: [{
      required: false,
      validator: this.validateImBankCode,
      trigger: 'change',
    }],
    imBankCodeType: [{
      required: false,
      validator: this.validateImBankCodeType,
      trigger: 'change',
    }],
    draweeCode: [{
      required: false,
      validator: this.validateDraweeCode,
      trigger: 'change',
    }],
    draweeType: [{
      required: false,
      validator: this.validateDraweeType,
      trigger: 'change',
    }],
  };

  // 新增券表單驗證
  equityRules: { [key: string]: ValidationRule[] } = {
    counterpartyId: [{ required: true, message: '請輸入機構編號', trigger: 'blur' }],
    productId: [{ required: true, message: '請選擇產品別', trigger: 'blur' }],
    clearerId: [{
      required: false,
      validator: this.validateClearerId,
      trigger: 'change',
    }],
    clearerAccount: [{
      required: false,
      validator: this.validateClearerAccount,
      trigger: 'change',
    }],
    clAgentCodeType: [{
      required: false,
      validator: this.validateClAgentCodeType,
      trigger: 'change',
    }],
    clAgentCode: [{
      required: false,
      validator: this.validateClAgentCode,
      trigger: 'change',
    }],
    equityTdccAccount: [{
      required: false,
      validator: this.validateEquityTdccAccount,
      trigger: 'change',
    }],
    bondTdccAccount: [{
      required: false,
      validator: this.validateBondTdccAccount,
      trigger: 'change',
    }],
    pdAccount: [{
      required: false,
      validator: this.validatePdAccount,
      trigger: 'change',
    }],
    brokerAccount: [{
      required: false,
      validator: this.validateEquityBrokerAccount,
      trigger: 'change',
    }],
    taxId: [{
      required: false,
      validator: this.validateTaxId,
      trigger: 'blur',
    }],
  };

  // 新增附件表單驗證
  attachmentRules = {
    attachmentType: [{ required: true, message: '請選擇檔案類型', trigger: ['blur', 'change'] }],
    productCode: [],
    market: [],
  };

  // 上傳的資料清單
  ipkAttachmentGrid: IpkVxeTableModel = {
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
        width: 100,
        headerAlign: 'center',
        align: 'center',
      },
      {
        title: '商品代碼',
        field: 'productCode',
        width: 150,
        headerAlign: 'center',
        align: 'center',
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
        headerAlign: 'left',
        align: 'left',
      },
      {
        title: '',
        field: 'actionTool',
        headerAlign: 'center',
        align: 'right',
        slots: {
          default: 'actionTool',
        },
      },
    ],
  };

  fileList = []; // 上傳的資料

  fileUploadData: UploadModel = {
    multiple: false, // 是否可上傳多筆檔案
    acceptFileType: '.pdf', // 可上傳的檔案類型
    acceptType: ['application/pdf'],
    showRemoveIcon: true,
  }

  // 下拉選單
  counterpartyIdOption = []; // 機構編號，後端回傳的所有選項

  filterCounterpartyIdOption = []; // 機構編號，依照輸入條件篩選選項

  productClassOption = []; // 產品別

  currencyOption = []; // 幣別

  bankNoOption = []; // 受款銀行代碼，後端回傳的所有選項

  filterBankNoOption = []; // 受款銀行代碼，依照輸入條件篩選選項

  psetByMarketOptionByEquity = []; // PSET CODE

  psetCodeOptionByEquity = []; //  Market

  psetCodeOptionByAttachment = []; // 市場別

  settlementLocationOption = []; // Settlement Location

  brokerOptionByBrokerIdType = []; // Broker ID Type

  brokerOptionByClearerIdType = []; // Clearer ID Type

  brokerOptionByBsCodeType = []; // Buyer/Seller code Type

  productCodeOption = []; // 產品代碼

  custodianOption = []; // 保管行

  fileTypeOption = []; // 檔案類型

  indicatorOption = []; // Financial Indicator

  chargesOption = []; // Pay Charges Indicator

  /**
   * computed
   */
  // 判斷送出按鈕是否鎖定
  get submitDisabled() {
    let disabled = false;
    // 判斷新增款/券switch是否為N
    if (!this.isCash && !this.isEquity) {
      disabled = true;
    }
    if (this.isCash) {
      Object.entries(this.cashRules).forEach(([key, value]) => {
        if (value[0].required && this.isEmpty(this.cash[key])) {
          disabled = true;
        }
      });
    }
    if (this.isEquity) {
      Object.entries(this.equityRules).forEach(([key, value]) => {
        if (value[0].required && this.isEmpty(this.cash[key])) {
          disabled = true;
        }
      });
    }
    return disabled;
  }

  // 依據當前彈窗動作轉換buttonKey
  get buttonKey() {
    let buttonKey = '';
    switch (this.modalTitle) {
      case this.$cfEnum.constant.ADD.key:
        buttonKey = this.$cfButtonKey.buttonKey.ADD.val;
        break;
      case this.$cfEnum.constant.MODIFY.key:
        buttonKey = this.$cfButtonKey.buttonKey.MODIFY.val;
        break;
    }
    return buttonKey;
  }

  /**
   * watch
   */
  @Watch('modalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('addAndEditInfo', { immediate: true, deep: true })
  onValChange(val) {
    // 新增
    if (val.actionType === this.$cfEnum.constant.ADD.val) {
      this.modalTitle = this.$cfEnum.constant.ADD.key;
      this.isEdit = false;
      // table欄位是否可下載附件
      for (let i = 0; i < this.ipkAttachmentGrid.columns.length; i++) {
        if (!this.isEmpty(this.ipkAttachmentGrid.columns[i].field)) {
          let copyColumn = JSON.parse(JSON.stringify(this.ipkAttachmentGrid.columns[i]));
          if (this.ipkAttachmentGrid.columns[i].field === 'attachmentName') {
            copyColumn.slots = undefined;
          }
          this.$set(this.ipkAttachmentGrid.columns, i, copyColumn);
        }
      }
      this.setAddInfo(val.editInfo);
    }
    // 修改
    if (val.actionType === this.$cfEnum.constant.MODIFY.val) {
      this.modalTitle = this.$cfEnum.constant.MODIFY.key;
      this.isEdit = true;
      // table欄位是否可下載附件
      for (let i = 0; i < this.ipkAttachmentGrid.columns.length; i++) {
        if (!this.isEmpty(this.ipkAttachmentGrid.columns[i].field)) {
          let copyColumn = JSON.parse(JSON.stringify(this.ipkAttachmentGrid.columns[i]));
          if (this.ipkAttachmentGrid.columns[i].field === 'attachmentName') {
            copyColumn.slots = { default: 'link' };
          }
          this.$set(this.ipkAttachmentGrid.columns, i, copyColumn);
        }
      }
      this.setEditInfo(val.editInfo);
    }
  }

  /**
   * hook
   */
  async created() {
    this.counterpartyIdOption = await this.$cfCommon.getCounterpartyIdOption(); // 機構編號
    this.productClassOption = await this.$cfCommon.getProductClassOption(); // 產品別
    this.currencyOption = await this.$cfCommon.getCurrencyOption([]); // 幣別
    this.bankNoOption = await this.$cfCommon.getBankNoOption(); // 受款銀行
    // PSET Code
    let psetCodeOprions = await this.$cfCommon.getPsetCodeOption();
    this.psetCodeOptionByEquity = psetCodeOprions;
    this.psetCodeOptionByAttachment = psetCodeOprions;
    this.settlementLocationOption = await this.$cfCommon.getLocationOption(); // Settlement Location
    // brokerOptions
    let brokerOptions = await this.$cfCommon.getBrokerOption();
    this.brokerOptionByBrokerIdType = brokerOptions;
    this.brokerOptionByClearerIdType = brokerOptions;
    this.brokerOptionByBsCodeType = brokerOptions;
    this.productCodeOption = await this.$cfCommon.getProductCodeOption(); // 商品代碼
    this.custodianOption = this.$cfEnum.custodianOption; // 保管行
    this.fileTypeOption = this.$cfEnum.fileTypeOption; // 檔案類型
    this.indicatorOption = this.$cfEnum.indicatorOption; // Financial Indicator
    this.chargesOption = this.$cfEnum.chargesOption; // Pay Charges Indicator
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
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
    this.activeKey = '1'; // 被選取的頁籤(預設資料明細)
    this.isCash = false; // 新增款
    this.isCashEffectStatus = true; // 生效，預設：true
    this.isCashDefault = false; // 預設
    this.isEquity = false; // 新增券
    this.isEquityEffectStatus = true; // 生效，預設：true
    this.isEquityDefault = false; // 預設
    this.cash = this.createCash(); // 款帳號資訊
    this.equity = this.createEquity(); // 券帳號資訊
    this.contact = this.createContact(); // 聯絡資訊
    // 上傳附件
    this.attachment = this.createAttachment();
    this.ipkAttachmentGrid.data = [];
    this.fileList = [];
    // 依照保管行改變欄位顏色
    this.isBONY = '';
    this.isBONY_JPM = '';
    this.isCITI = '';
    this.isJPM = '';
    this.isCITI_TDCC = '';
    this.isBONY_JPM_TDCC = '';
  }

  // 關閉modal
  closeAddAndEditModal(action) {
    // 清空驗證警示訊息
    this.$nextTick(() => {
      if (!this.isEmpty(this.$refs.cashFormRef)) {
        (this.$refs.cashFormRef as any).clearValidate();
      }
      if (!this.isEmpty(this.$refs.equityFormRef)) {
        (this.$refs.equityFormRef as any).clearValidate();
      }
      if (!this.isEmpty(this.$refs.attachmentFormRef)) {
        (this.$refs.attachmentFormRef as any).clearValidate();
      }
    });

    // 修改成功時，關閉modal
    if (this.isEmpty(action)) {
      this.reset();
      this.afterCashEdit = {};
      this.afterEquityEdit = {};
      this.$emit('closeAddAndEditModal');
      return;
    }

    // 點擊取消
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.reset();
        this.$emit('closeAddAndEditModal');
      },
    });
  }

  /**
    * @summary 選取「款」機構編號
    * @param {any} data: v-model綁定的值
    * @param {string} validateKey: 要驗證的欄位
   */
  async onCashCounterpartyIdSelect(data: any, validateKey: string) {
    this.equity.counterpartyId = data;
    // blur 為空，欄位框要變色
    if (this.isEmpty(data)) {
      (this.$refs.cashFormRef as any)?.validateField([validateKey]);
      this.contact = this.createContact();
      this.cash.bfAccountName = undefined;
      return;
    }
    // 清空欄位框顏色
    (this.$refs.cashFormRef as any)?.clearValidate([validateKey]);
    let dto = { counterpartyId: data };
    // 取得聯絡資訊
    this.contact = await this.searchContactInfo(dto);
    // 取得受款人名稱(bfAccountName)
    this.cash.bfAccountName = await this.$cfCommon.getBfAccountName(data);
  }

  /**
    * @summary 選取「券」機構編號
    * @param {any} data: v-model綁定的值
    * @param {string} validateKey: 要驗證的欄位
   */
  // 選取「券」機構編號
  async oneEquityCounterpartyIdSelect(data: any, validateKey: string) {
    this.cash.counterpartyId = data;
    // blur 為空，欄位框要變色
    if (this.isEmpty(data)) {
      (this.$refs.equityFormRef as any)?.validateField([validateKey]);
      this.contact = this.createContact();
      this.equity.taxId = undefined;
      return;
    }
    // 清空欄位框顏色
    (this.$refs.equityFormRef as any)?.clearValidate([validateKey]);
    let dto = { counterpartyId: data };
    // 取得聯絡資訊
    this.contact = await this.searchContactInfo(dto);
    // 取得統編
    this.equity.taxId = await this.searchTaxIdUsing(dto);
    (this.$refs.equityFormRef as any)?.validateField(['taxId']);
  }

  /**
   * @summary 選取產品別
   * @param {any} data: v-model綁定的值
   * @param {string}} 當下改變的欄位類型名稱(key)
   * @param {string}} 欲連動的欄位類型名稱(key)
  */
  handleChangeProduct(data: any, before: string, after: string) {
    this[after].productId = data;
    // 取得產品名稱
    if (!this.isEmpty(this[before].productId) && !this.isEmpty(this.productClassOption)) {
      let option = transferUtil.getSelectOption(this.productClassOption, this[before].productId);
      if (!this.isEmpty(option)) {
        this[before].productName = option.label;
      }
    }
  }

  /**
   * @summary 連動「款」、「券」欄位
   * @param {any} data: 欄位值(value)
   * @param {string} key: 欲連動的欄位類型名稱(key)
   * @param {string} col: 當下改變的欄位名稱
  */
  changeCashOrEquity(data, key, col) {
    this[key][col] = data;
  }

  // 刪除檔案
  handleDeleteFile(item) {
    if (!this.isEdit) {
      this.addDeleteFile(item.row);
    } else {
      this.editDeleteFile(item.row);
    }
  }

  // 刪除檔案: 新增流程
  addDeleteFile(row) {
    if (!this.isEmpty(row.attachmentId)) {
      return;
    }
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.DELETE_CONFIRM_INFO?.message,
      onCallback: () => {
        const index = this.ipkAttachmentGrid.data.indexOf(row);
        this.ipkAttachmentGrid.data.splice(index, 1);
      },
    });
  }

  // 刪除檔案: 修改流程
  editDeleteFile(row) {
    InfoModal.alertInfo({
      confirm: true,
      content: '刪除附件不須放行即可生效，是否確定刪除？',
      onCallback: () => {
        const dto = {
          attachmentId: row.attachmentId,
          ssiId: this.cash.ssiId ? this.cash.ssiId : this.equity.ssiId,
        };
        // 紀錄編輯後的資訊，避免重查後值恢復
        this.afterCashEdit = this.cash;
        this.afterEquityEdit = this.equity;
        // call API
        this.submitDeleteFile(dto);
      },
    });
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
        this.fileList = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.fileList = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.fileList.push(info.file);
    }
  }

  // 改變上傳附件頁籤檔案類型
  changeAttachmentType(e) {
    (this.$refs.attachmentFormRef as any).clearValidate();
    // 檔案類型為3時，商品代碼及市場別為必填
    if (e === this.$cfEnum.fileTypeConstant.FILE_TYPE3.value) {
      this.attachmentRules.productCode = [{ required: true, message: '請選擇產品代碼', trigger: ['blur', 'change'] }];
      this.attachmentRules.market = [{ required: true, message: '請選擇市場別', trigger: ['blur', 'change'] }];
    } else {
      this.attachmentRules.productCode = [];
      this.attachmentRules.market = [];
    }
  }

  // 驗證單筆上傳附件必填欄位
  validateAttachmentCol(e, validateKey) {
    (this.$refs.attachmentFormRef as any).validate([validateKey]);
  }

  // 點擊上傳按鈕
  handleUpload() {
    let bypass = true;
    // 驗證所有上傳附件必填欄位
    (this.$refs.attachmentFormRef as any).validate((valid, unpassList) => {
      if (!valid) {
        let keyList = Object.keys(unpassList);
        if (keyList.includes('attachmentType')) {
          InfoModal.alertInfo({ confirm: false, content: '請選擇檔案類型。' });
          bypass = false;
          return false;
        }
        if (keyList.includes('productCode') || keyList.includes('market')) {
          InfoModal.alertInfo({ confirm: false, content: '檔案類型為3時，商品代碼及市場別為必填。' });
          bypass = false;
          return false;
        }
      }
    });
    // 箭頭函式無法用return中斷，故另外寫。
    if (!bypass) {
      return;
    }
    // 請上傳檔案
    if (this.isEmpty(this.fileList)) {
      InfoModal.alertInfo({ confirm: false, content: '請選擇檔案' });
      return;
    }
    // 若「檔案類型」選擇"1交易對手帳號"、"2富邦帳號"」時，檢查附件欄位是否已有對應檔案類型之附件
    if (!this.isEmpty(this.ipkAttachmentGrid.data)) {
      if (this.attachment.attachmentType === this.$cfEnum.fileTypeConstant.FILE_TYPE1.value || this.attachment.attachmentType === this.$cfEnum.fileTypeConstant.FILE_TYPE2.value) {
        for (let i = 0; i < this.ipkAttachmentGrid.data.length; i++) {
          // TODO: trim改由後端處理，待後端調整後刪除
          if (this.ipkAttachmentGrid.data[i].attachmentType.trim() === this.attachment.attachmentType) {
            const attachmentTypeLabel = this.$cfEnum.getLabel('fileTypeOption', this.attachment.attachmentType);
            InfoModal.alertInfo({ confirm: false, content: `已存在${attachmentTypeLabel}，請先刪除後再重新上傳` });
            return;
          }
        }
      }
    }
    //  通過檢核
    if (!this.isEdit) {
      // 新增: 將附件與相關資訊加入前端附件欄位中(因新增尚未送出，不用寫入資料庫)
      this.addUpload();
    } else {
      // 修改: 上傳區中的檔案「上傳」後即會生效
      this.editUpload();
    }
  }

  // 刪除上傳附件
  deleteUpload(file) {
    this.fileList = this.fileList.filter((el) => el.uid !== file.uid);
  }

  // 新增上傳
  addUpload() {
    InfoModal.alertInfo({
      confirm: true,
      content: '新增時上傳附件須放行即可生效，是否確定上傳？',
      onCallback: () => {
        const actionEnum = JSON.parse(JSON.stringify(this.$cfEnum.actionToolEnum.filter((e) => e.val === 'delete')));
        const fileObj = this.fileList[0].originFileObj ? this.fileList[0].originFileObj : this.fileList[0];
        this.ipkAttachmentGrid.data.push({
          ...this.attachment,
          attachmentName: fileObj.name,
          attachmentExtension: transferUtil.getFileExt(fileObj.name),
          attachmentFile: this.fileList[0],
          actionTool: actionEnum,
        });
        // 回到初始值
        this.attachment = this.createAttachment();
        this.fileList = [];
      },
    });
  }

  // 編輯上傳
  editUpload() {
    InfoModal.alertInfo({
      confirm: true,
      content: '上傳附件不須放行即可生效，是否確定上傳?',
      onCallback: () => {
        // 紀錄編輯後的資訊，避免重查後值恢復
        this.afterCashEdit = this.cash;
        this.afterEquityEdit = this.equity;
        // call API
        const fileObj = this.fileList[0].originFileObj ? this.fileList[0].originFileObj : this.fileList[0];
        let dto = {
          ...this.attachment,
          attachmentName: fileObj.name,
          attachmentExtension: transferUtil.getFileExt(fileObj.name),
          attachmentFile: this.fileList[0],
          ssiId: this.cash.ssiId ? this.cash.ssiId : this.equity.ssiId, // 帳號ID(ssiId),
        };
        let file = [];
        file.push(this.fileList[0]);
        this.$axios.axiosPut(`${process.env.VUE_APP_API_BASE_URL}/api/counterparty-ssi/upload`, 'dto', dto, 'file', this.fileList,
        () => {
          this.attachment = this.createAttachment();
          this.fileList = [];
          // 重新取得附件資訊
          this.searchDetailInfo(this.addAndEditInfo?.editInfo?.ssiId);
        });
      },
    });
  }

  // 依照保管行改變欄位顏色
  handleChangeCustodian(value) {
    this.isBONY = '';
    this.isBONY_JPM = '';
    this.isCITI = '';
    this.isJPM = '';
    this.isCITI_TDCC = '';
    this.isBONY_JPM_TDCC = '';

    switch (value) {
      case 'BONY':
        this.isBONY = 'warning';
        this.isBONY_JPM = 'warning';
        this.isBONY_JPM_TDCC = 'warning';
        break;
      case 'CITI':
        this.isCITI = 'warning';
        this.isCITI_TDCC = 'warning';
        break;
      case 'JPM':
        this.isJPM = 'warning';
        this.isBONY_JPM = 'warning';
        this.isBONY_JPM_TDCC = 'warning';
        break;
      case 'TDCC':
        this.isCITI_TDCC = 'warning';
        this.isBONY_JPM_TDCC = 'warning';
        break;
    }
  }

  // 點擊送出
  handleSubmit() {
    // 整理成後端格式
    this.cash.isDefault = this.isCashDefault ? 'Y' : 'N';
    this.cash.effectStatus = this.isCashEffectStatus ? 'Y' : 'N';
    this.equity.isDefault = this.isEquityDefault ? 'Y' : 'N';
    this.equity.effectStatus = this.isEquityEffectStatus ? 'Y' : 'N';
    // 未開啟新增款/新增券的頁籤，request的欄位給null。例: equity: null
    const cash = this.isCash ? this.cash : null;
    const equity = this.isEquity ? this.equity : null;
    let dto = {
      cash,
      equity,
    };
    // call API
    if (!this.isEdit) {
      this.validateBeforeAdd(dto);
    } else {
      this.validateBeforeModify(dto);
    }
  }

  /**
  * 資料處理
  */
  // 款帳號資訊
  createCash() {
    return {
      ssiId: undefined,
      isDefault: undefined, // 預設
      effectStatus: undefined, // 生效狀態
      counterpartyId: undefined, // 機構編號
      productId: undefined, // 產品別
      currency: undefined, // 幣別
      bfBankCode: undefined, // 受款銀行代碼
      bfBankName: undefined, // 受款銀行名稱
      bfBankAccount: undefined, // 受款行銀行帳號
      bfBankType: undefined, // 受款銀行類型
      bfAccountName: undefined, // 受款人名稱
      bfAccount: undefined, // 受款人帳號
      imBankCode: undefined, // 中間行代碼
      imBankName: undefined, // 中間行名稱
      imBankCodeType: undefined, // 中間行代碼類型
      draweeCode: undefined, // 付款人代碼
      draweeName: undefined, // 付款人名稱
      draweeType: undefined, // 付款人類型
      bfAccountNameCode: undefined, // 受款人帳戶名稱代碼
      bfAccountNoType: undefined, // 受款人帳戶號碼類型
      bfAccountNameType: undefined, // 受款人帳戶名稱類型
      bfBankAba: undefined, // 受款銀行ABA
      bfBankIban: undefined, // 受款銀行IBAN號碼
      charges: undefined, // Pay Charges Indicator
      indicator: undefined, // Financial Indicator
      memo: undefined, // 附言
      remark: undefined, // 備註
      productName: undefined, // 商品名稱
    };
  }

  // 券帳號資訊
  createEquity() {
    return {
      ssiId: undefined,
      isDefault: undefined, // 預設
      effectStatus: undefined, // 生效狀態
      counterpartyId: undefined, // 機構編號
      productId: undefined, // 產品別
      currency: undefined, // 幣別
      custodian: undefined, // 保管行
      market: undefined, // Market
      cycd: undefined, // CyCd
      psetCode: undefined, // PSET CODE
      settlementLocation: undefined, // Settlement Location
      brokerIdType: undefined, // Broker ID Type
      brokerId: undefined, // Broker ID
      brokerName: undefined, // Broker Name
      clearerIdType: undefined, // Clearer ID Type
      clearerId: undefined, // Clearer ID
      clearerName: undefined, // Clearer Name
      brokerAccount: undefined, // Broker Account
      clearerAccount: undefined, // Clearer Account
      settlementIndicator: undefined, // Settlement Indicator
      bsCodeType: undefined, // Buyer/Seller code Type
      bsCode: undefined, // Buyer/Seller Code
      bdName: undefined, // Buyer/Seller Name
      clAgentCodeType: undefined, // Clearer Agent Code Type
      clAgentCode: undefined, // Clearer Agent code/ Clearing Broker
      clAgentName: undefined, // Clearer Agent Name
      equityTdccAccount: undefined, // 股權集保帳號
      brokerage: undefined, // 證券商(130)
      brokerageCode: undefined, // 證券代號
      bondTdccAccount: undefined, // 債券集保帳號
      pdAccountBank: undefined, // 公債帳號對應銀行
      pdAccount: undefined, // 公債帳號
      pdAccountName: undefined, // 公債帳號戶名
      taxId: undefined, // 統編
      memo: undefined, // 附言
      remark: undefined, // 備註
      productName: undefined, // 商品名稱
    };
  }

  // 聯絡資訊
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

  // 上傳附件
  createAttachment() {
    return {
      attachmentId: undefined,
      attachmentType: undefined, // 檔案類型
      productCode: undefined, // 產品代碼
      market: undefined, // 市場別
      // attachmentTypeName: undefined,
      attachmentName: undefined, // 附件名稱
      attachmentExtension: undefined, // 副檔名
      attachmentFile: undefined, // 傳到後端的file格式
    };
  }

  // 設定複製新增資訊
  setAddInfo(val) {
    // 整理款帳號資訊
    if (!this.isEmpty(val.cash)) {
      Object.entries(val.cash).forEach(([key, item], index) => {
        this.cash[key] = item || undefined;
      });
      if (!this.isEmpty((this.cash.counterpartyId))) {
        this.isCash = true;
        this.isCashEffectStatus = this.cash.effectStatus === 'Y';
        this.isCashDefault = this.cash.isDefault === 'Y';
      }
    }
    // 整理券帳號資訊
    if (!this.isEmpty(val.equity)) {
      Object.entries(val.equity).forEach(([key, item], index) => {
        this.equity[key] = item || undefined;
      });
      if (!this.isEmpty((this.equity.counterpartyId))) {
        this.isEquity = true;
        this.isEquityEffectStatus = this.equity.effectStatus === 'Y';
        this.isEquityDefault = this.equity.isDefault === 'Y';
      }
    }
    // 整理聯絡資訊
    if (!this.isEmpty(val.contact)) {
      Object.entries(val.contact).forEach(([key, item], index) => {
        this.contact[key] = item || undefined;
      });
    }
    // 連動款/券表單資料
    if (val.cash && !val.equity) {
      this.linkFormData('equity', this.cash);
    } else if (val.equity && !val.cash) {
      this.linkFormData('cash', this.equity);
    }
  }

  // 連動款cash/券equity表單資料
  linkFormData(setKey: 'cash'|'equity', data) {
    // 機構編號、產品別、幣別、附言、備註 (若其中一邊沒資料, 需自動帶入另一邊資訊)
    this[setKey].counterpartyId = data.counterpartyId;
    this[setKey].productName = data.productName;
    this[setKey].productId = data.productId;
    this[setKey].currency = data.currency;
    this[setKey].memo = data.memo;
    this[setKey].remark = data.remark;
  }

  // 設定修改資訊
  setEditInfo(val) {
    // 整理款帳號資訊
    if (!this.isEmpty(val.cash)) {
      Object.entries(val.cash).forEach(([key, item], index) => {
        this.cash[key] = item || undefined;
      });
      this.isCash = !this.isEmpty(val.cash.ssiId);
      this.isCashEffectStatus = this.cash.effectStatus === 'Y';
      this.isCashDefault = this.cash.isDefault === 'Y';
    }
    // 整理券帳號資訊
    if (!this.isEmpty(val.equity)) {
      Object.entries(val.equity).forEach(([key, item], index) => {
        this.equity[key] = item || undefined;
      });
      this.isEquity = !this.isEmpty(val.equity.ssiId);
      this.isEquityEffectStatus = this.equity.effectStatus === 'Y';
      this.isEquityDefault = this.equity.isDefault === 'Y';
    }
    // 整理聯絡資訊
    if (!this.isEmpty(val.contact)) {
      Object.entries(val.contact).forEach(([key, item], index) => {
        this.contact[key] = item || undefined;
      });
    }
    // 上傳附件
    if (!this.isEmpty(val.attachment)) {
      const actionEnum = JSON.parse(JSON.stringify(this.$cfEnum.actionToolEnum.filter((e) => e.val === 'delete')));
      if (Array.isArray(val.attachment)) {
        val.attachment.forEach((item) => {
          if (!this.isEmpty(item)) {
            this.ipkAttachmentGrid.data.push({
              ...item,
              actionTool: actionEnum,
            });
          }
        });
      }
    }
    // 連動款/券表單資料
    if (val.cash && !val.equity) {
      this.linkFormData('equity', this.cash);
    } else if (val.equity && !val.cash) {
      this.linkFormData('cash', this.equity);
    }
  }

  /**
    * validate
    */
  // 受款行銀行帳號
  validateCashbfBankAccount(rule: any, value: any, callback: Function) {
    this.cash.bfBankAccount = validateUtil.validateFormData(1, value);
  }

  // 受款銀行類型
  validateBfBankType(rule: any, value: any, callback: Function) {
    this.cash.bfBankType = validateUtil.validateFormData(4, value);
  }

  // 受款人名稱
  validateBfAccount(rule: any, value: any, callback: Function) {
    this.cash.bfAccount = validateUtil.validateFormData(3, value);
  }

  // 受款人帳戶名稱代碼
  validateBfAccountNameCode(rule: any, value: any, callback: Function) {
    this.cash.bfAccountNameCode = validateUtil.validateFormData(4, value);
  }

  // 受款銀行IBAN號碼
  validateBfBankIban(rule: any, value: any, callback: Function) {
    this.cash.bfBankIban = validateUtil.validateFormData(3, value);
  }

  // 受款銀行ABA
  validateBfBankAba(rule: any, value: any, callback: Function) {
    this.cash.bfBankAba = validateUtil.validateFormData(5, value);
  }

  // 受款人帳戶號碼類型
  validateBfAccountNoType(rule: any, value: any, callback: Function) {
    this.cash.bfAccountNoType = validateUtil.validateFormData(4, value);
  }

  // 受款人帳戶名稱類型
  validateBfAccountNameType(rule: any, value: any, callback: Function) {
    this.cash.bfAccountNameType = validateUtil.validateFormData(4, value);
  }

  // 中間行代碼
  validateImBankCode(rule: any, value: any, callback: Function) {
    this.cash.imBankCode = validateUtil.validateFormData(3, value);
  }

  // 中間行代碼類型
  validateImBankCodeType(rule: any, value: any, callback: Function) {
    this.cash.imBankCodeType = validateUtil.validateFormData(4, value);
  }

  // 付款人代碼
  validateDraweeCode(rule: any, value: any, callback: Function) {
    this.cash.draweeCode = validateUtil.validateFormData(3, value);
  }

  // 付款人類型
  validateDraweeType(rule: any, value: any, callback: Function) {
    this.cash.draweeType = validateUtil.validateFormData(4, value);
  }

  // Clearer ID
  validateClearerId(rule: any, value: any, callback: Function) {
    this.equity.clearerId = validateUtil.validateFormData(2, value);
  }

  // Broker Account
  validateClearerAccount(rule: any, value: any, callback: Function) {
    this.equity.clearerAccount = validateUtil.validateFormData(2, value);
  }

  // Buyer/Seller Code
  validateBsCode(rule: any, value: any, callback: Function) {
    this.equity.bsCode = validateUtil.validateFormData(2, value);
  }

  // Clearer Agent Code Type
  validateClAgentCodeType(rule: any, value: any, callback: Function) {
    this.equity.clAgentCodeType = validateUtil.validateFormData(2, value);
  }

  // Clearer Agent code/ Clearing Broker
  validateClAgentCode(rule: any, value: any, callback: Function) {
    this.equity.clAgentCode = validateUtil.validateFormData(2, value);
  }

  // 股權集保帳號
  validateEquityTdccAccount(rule: any, value: any, callback: Function) {
    this.equity.equityTdccAccount = validateUtil.validateFormData(2, value);
  }

  // 債券集保帳號
  validateBondTdccAccount(rule: any, value: any, callback: Function) {
    this.equity.bondTdccAccount = validateUtil.validateFormData(3, value);
  }

  // 公債帳號
  validatePdAccount(rule: any, value: any, callback: Function) {
    this.equity.pdAccount = validateUtil.validateFormData(5, value);
  }

  // Broker Account
  validateEquityBrokerAccount(rule: any, value: any, callback: Function) {
    this.equity.brokerAccount = validateUtil.validateFormData(2, value);
  }

  // 統編
  validateTaxId(rule: any, value: any, callback: Function) {
    if (value) {
      let validateResult = validateUtil.validateTaxId(value);
      if (!validateResult.byPass) {
        callback(validateResult.errorMsg);
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
  // ------------------------------------------------------ API: -------------------------------------------------------

  // 新增前檢核
  validateBeforeAdd(dto) {
    this.setLoading(true);
    this.$counterpartySsiApi.checkBeforeAddUsingPOST(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      switch (content) {
        case 1:
          InfoModal.alertSuccess({
            title: message,
            confirm: true,
            content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
            onCallback: () => {
              this.addCounterpartySsi(dto);
            },
          });
          break;
        case 2:
          InfoModal.alertInfo({
            confirm: true,
            content: message,
            onCallback: () => {
              this.addCounterpartySsi(dto);
            },
          });
          break;
      }
    })
    .catch((error) => {
      //     // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 編輯前檢核
  validateBeforeModify(dto) {
    this.setLoading(true);
    this.$counterpartySsiApi.checkBeforeModifyUsingPOST(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 新增前檢核 通過，執行 新增
      switch (content) {
        case 1:
          InfoModal.alertSuccess({
            title: message,
            confirm: true,
            content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
            onCallback: () => {
              this.modifyCounterpartySsi(dto);
            },
          });
          break;
        case 2:
          InfoModal.alertInfo({
            confirm: true,
            content: message,
            onCallback: () => {
              this.modifyCounterpartySsi(dto);
            },
          });
          break;
      }
    })
    .catch((error) => {
      //     // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 取得聯絡資訊
  async searchContactInfo(dto) {
    let contact = this.createContact();
    // call API
    this.setLoading(true);
    await this.$counterpartySsiApi.searchContactInfoUsingPOST(dto)
      .then((res) => {
        this.setLoading(false);
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        if (!this.isEmpty(res.data.content)) {
          contact.address = content.address;
          contact.faxNumber1 = content.faxNumber1;
          contact.faxNumber2 = content.faxNumber2;
          contact.licenserName1 = content.licenserName1;
          contact.licenserTel1 = content.licenserTel1;
          contact.licenserMobile1 = content.licenserMobile1;
          contact.licenserEmail1 = content.licenserEmail1;
          contact.licenserName2 = content.licenserName2;
          contact.licenserTel2 = content.licenserTel2;
          contact.licenserMobile2 = content.licenserMobile2;
          contact.licenserEmail2 = content.licenserEmail2;
          contact.licenserName3 = content.licenserName3;
          contact.licenserTel3 = content.licenserTel3;
          contact.licenserMobile3 = content.licenserMobile3;
          contact.licenserEmail3 = content.licenserEmail3;
        }
      })
      .catch((error) => {
        this.setLoading(false);
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return contact;
  }

  // 取得統編
  async searchTaxIdUsing(dto) {
    let taxId = '';
    // call API
    this.setLoading(true);
    await this.$counterpartySsiApi.searchTaxIdUsingPOST(dto)
      .then((res) => {
        this.setLoading(false);
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        taxId = content;
      })
      .catch((error) => {
        this.setLoading(false);
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return taxId;
  }

  // 取得受款銀行名稱
  async getBfBankName(data) {
    if (this.isEmpty(data)) {
      this.cash.bfBankName = '';
      return;
    }
    this.cash.bfBankName = await this.$cfCommon.getBfBankName(data);
  }

  // 改變(券)Market
  async handleChangeEquityMarkt(data) {
    if (this.isEmpty(data)) {
      this.equity.cycd = '';
      this.equity.psetCode = undefined;
      this.psetByMarketOptionByEquity = [];
      return;
    }
    // 取得 PEST CODE
    this.psetByMarketOptionByEquity = await this.$cfCommon.getPsetByMarketOption(data);
    // 取得 Cycd
    this.equity.cycd = await this.$cfCommon.getCycdByMarket(data);
  }

  // 新增交易對手收付款機構
  addCounterpartySsi(dto) {
    // 送出後新增視窗不關閉，保留「機構編號」+「產品別」，其餘欄位及附件清空
    const counterpartyId = !this.isEmpty(this.cash.counterpartyId) ? this.cash.counterpartyId : this.equity.counterpartyId;
    const productId = !this.isEmpty(this.cash.productId) ? this.cash.productId : this.equity.productId;
    const productName = !this.isEmpty(this.cash.productName) ? this.cash.productName : this.equity.productName;
    // 整理成後端格式
    let files = [];
    this.ipkAttachmentGrid.data.forEach((e) => {
      files.push(e.attachmentFile);
    });
    dto.attachment = this.ipkAttachmentGrid.data;
    this.$axios.axiosPut(`${process.env.VUE_APP_API_BASE_URL}/api/counterparty-ssi/addCounterpartySsi`, 'dto', dto, 'files', files,
      () => {
        // 重設
        this.reset();
        this.cash.counterpartyId = counterpartyId;
        this.cash.productId = productId;
        this.cash.productName = productName;
        this.equity.counterpartyId = counterpartyId;
        this.equity.productId = productId;
        this.equity.productName = productName;
        // 更新待放行清單筆數
        this.$emit('getPendingInfoCount');
      });
  }

  // 修改交易對手收付款機構
  modifyCounterpartySsi(dto) {
    this.setLoading(true);
    this.$counterpartySsiApi.modifyCounterpartySsiUsingPATCH(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      // 關閉彈窗
      this.closeAddAndEditModal(null);
      // 成功訊息
      this.$message.success(message, 10);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
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

  // 刪除上傳附件頁籤 table 檔案
  submitDeleteFile(dto) {
    this.setLoading(true);
    this.$counterpartySsiApi.removeUsingDELETE(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      // 重新取得附件資訊
      this.searchDetailInfo(this.addAndEditInfo?.editInfo?.ssiId);
      // 成功訊息
      this.$message.success(message, 10);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 查詢交易對手收付款機構明細
  searchDetailInfo(ssiId: string): any {
    this.setLoading(true);
    this.$counterpartySsiApi.searchDetailUsingGET(ssiId)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;
      const content = res.data.content;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      let obj = JSON.parse(JSON.stringify(content));
      // 整理款帳號資訊
      this.cash = transferUtil.deepCopyData(this.afterCashEdit);
      // 整理券帳號資訊
      this.equity = transferUtil.deepCopyData(this.afterEquityEdit);
      // 整理聯絡資訊
      if (!this.isEmpty(obj.contact)) {
        Object.entries(obj.contact).forEach(([key, item], index) => {
          this.contact[key] = item || undefined;
        });
      }
      // 上傳附件
      this.ipkAttachmentGrid.data = [];
      if (!this.isEmpty(obj.attachment)) {
        const actionEnum = JSON.parse(JSON.stringify(this.$cfEnum.actionToolEnum.filter((e) => e.val === 'delete')));
        if (Array.isArray(obj.attachment)) {
          obj.attachment.forEach((item) => {
            if (!this.isEmpty(item)) {
              this.ipkAttachmentGrid.data.push({
                ...item,
                actionTool: actionEnum,
              });
            }
          });
        }
      }
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }
}
