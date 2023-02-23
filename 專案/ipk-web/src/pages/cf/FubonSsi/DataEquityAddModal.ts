import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { CfFbSsiEquityEditDto, CfFbSsiEquityKey } from '@fubonlife/ipk-api-axios-sdk';
import IpkAddItemSelect from '@/components/shared/form/IpkAddItemSelect.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkAddItemSelect,
    IpkButton,
  },
})
export default class DataEquityAddModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  equityModalAddInfoShow: boolean // modal開關

  @Prop()
  checkInfo: any // 新增修改資訊

  /**
   * data
   */
  modalVisible = false // modal開關

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    safekeepingAccount: [{
      required: true,
      validator: this.validateSafekeepingAccount,
      trigger: 'blur',
    }],
    safekeepingName: [{
      required: false,
      validator: this.validateSafekeepingName,
      trigger: 'change',
    }],
    market: [{
      required: true,
      validator: this.validateMarket,
      trigger: 'blur',
    }],
    settlementLocation: [{
      required: true,
      validator: this.validateSettlementLocation,
      trigger: 'blur',
    }],
    custodianIdType: [{
      required: false,
      validator: this.validateCustodianIdType,
      trigger: 'change',
    }],
    custodianId: [{
      required: false,
      validator: this.validateCustodianId,
      trigger: 'change',
    }],
    custodianAccount: [{
      required: false,
      validator: this.validateCustodianAccount,
      trigger: 'change',
    }],
    clearerIdType: [{
      required: false,
      validator: this.validateClearerIdType,
      trigger: 'change',
    }],
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
    taxId: [{
      required: false,
      validator: this.validateTaxId,
      trigger: 'change',
    }],
    pdAccountBank: [{
      required: false,
      validator: this.validatePdAccountBank,
      trigger: 'change',
    }],
  };

  // 下拉選單
  marketOption = [];

  // isAdd = false; // 自定義下拉選單

  // selectOpen = false; // 自定義下拉選單開關

  oriForm = { // 新增彈窗 v-model綁定
    uid: undefined,
    safekeepingAccount: undefined,
    safekeepingName: undefined,
    market: undefined,
    settlementLocation: undefined,
    custodianIdType: undefined,
    custodianId: undefined,
    custodianAccount: undefined,
    clearerIdType: undefined,
    clearerId: undefined,
    clearerAccount: undefined,
    taxId: undefined,
    pdAccountBank: undefined,
    memo: undefined,
    remark: undefined,
    isDefault: undefined,
    custodianBankCode: undefined,
    currency: undefined,
    type: undefined,
  }

  // 預設，先接true或false，再根據true或false設定oriForm.isDefault='Y'或'N'
  isDefault = false;

  // addItem: undefined; // 自定義下拉選單選項

  /**
  * watch
  */
  @Watch('equityModalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
    this.reset();
    if (!this.isEmpty(this.checkInfo.editInfo.after)) {
      const currentInfo = this.checkInfo.editInfo.after;
      this.oriForm = { ...currentInfo };
      this.isDefault = currentInfo.isDefault === 'Y';
    }
  }

  @Watch('selectOpen')
  onSelectOpenChange() {
    // 因Market為自定義選單，preventDefault 導致驗證失效，故手動觸發驗證
    (this.$refs.formRef as any).validateField(['market']);
  }

  /**
  * hook
  */
  async created() {
    this.reset();

    // 取得下拉選單
    this.marketOption = await this.$cfCommon.getPsetCodeOption(); // Market
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
  }

  /**
  * methods
  */
  // -------------------新增-------------------
  // 送出新增券帳號
  submitAddEquityInfo() {
    // 檢核欄位
    if (!this.checkContent()) {
      return;
    }
    // 整理成後端格式
    let dto;
    if (this.isEmpty(this.checkInfo.editInfo.after)) { // 新增件
    dto = {
      market: this.isEmpty(this.oriForm.market) ? undefined : this.oriForm.market,
      settlementLocation: this.isEmpty(this.oriForm.settlementLocation) ? undefined : this.oriForm.settlementLocation,
      uid: this.isEmpty(this.checkInfo.editInfo.uid) ? undefined : this.checkInfo.editInfo.uid,
      safekeepingAccount: this.isEmpty(this.oriForm.safekeepingAccount) ? undefined : this.oriForm.safekeepingAccount,
      isDefault: this.isDefault ? 'Y' : 'N',
    };
  } else if (!this.isEmpty(this.checkInfo.editInfo.after)) { // 複製新增件
    dto = {
      market: this.isEmpty(this.oriForm.market) ? undefined : this.oriForm.market,
      settlementLocation: this.isEmpty(this.oriForm.settlementLocation) ? undefined : this.oriForm.settlementLocation,
      uid: this.isEmpty(this.checkInfo.editInfo.after.uid) ? undefined : this.checkInfo.editInfo.after.uid,
      safekeepingAccount: this.isEmpty(this.oriForm.safekeepingAccount) ? undefined : this.oriForm.safekeepingAccount,
      isDefault: this.isDefault ? 'Y' : 'N',
    };
    }
    // call API 新增券帳號前檢核
    this.checkBeforeAddEquity(dto);
  }

  // 新增券帳號前檢核
  checkBeforeAddEquity(dto: CfFbSsiEquityKey) {
    this.setLoading(true);
    this.$fubonSsiApi.checkBeforeAddEquityUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        // 新增券帳號前檢核 通過，執行 新增券帳號
        switch (content) {
          case 1:
            InfoModal.alertInfo({
              title: message,
              confirm: true,
              content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
              onCallback: () => {
                if (this.isEmpty(this.checkInfo.editInfo.after)) { // 新增件
                this.oriForm.uid = this.checkInfo.editInfo.uid;
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.currency;
                this.oriForm.type = this.checkInfo.editInfo.type;
              } else if (!this.isEmpty(this.checkInfo.editInfo.after)) { // 複製新增件
                this.oriForm.uid = this.checkInfo.editInfo.after.uid;
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.after.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.after.currency;
                this.oriForm.type = this.checkInfo.editInfo.after.type;
              }
                // Call API
                this.addEquity(this.oriForm);
              },
            });
            break;
          case 2:
            InfoModal.alertInfo({
              confirm: true,
              content: message,
              onCallback: () => {
                if (this.isEmpty(this.checkInfo.editInfo.after)) { // 新增件
                this.oriForm.uid = this.checkInfo.editInfo.uid;
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.currency;
                this.oriForm.type = this.checkInfo.editInfo.type;
              } else if (!this.isEmpty(this.checkInfo.editInfo.after)) { // 複製新增件
                this.oriForm.uid = this.checkInfo.editInfo.after.uid;
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.after.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.after.currency;
                this.oriForm.type = this.checkInfo.editInfo.after.type;
              }
                // Call API
                this.addEquity(this.oriForm);
              },
            });
            break;
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

  // 執行新增券
  addEquity(dto: CfFbSsiEquityEditDto) {
    this.setLoading(true);
    this.$fubonSsiApi.addEquityUsingPUT(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        if (!isSuccess) {
          // 新增券帳號 失敗
          InfoModal.alertError({ title: '警告', confirm: false, content: message });
          return;
        }
        // 新增券帳號 成功
        this.$message.success(message, 10);
        // 關閉彈窗
        this.$emit('closeAddAndEditModal');
        // 更新待放行清單筆數
        this.$emit('getPendingInfoCount');
        // 重查待放行清單
        this.$emit('reSearch');
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // -------------------其他-------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 重整
  reset() {
    this.oriForm = {
      uid: undefined,
      safekeepingAccount: undefined,
      safekeepingName: undefined,
      market: undefined,
      settlementLocation: undefined,
      custodianIdType: undefined,
      custodianId: undefined,
      custodianAccount: undefined,
      clearerIdType: undefined,
      clearerId: undefined,
      clearerAccount: undefined,
      taxId: undefined,
      pdAccountBank: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      custodianBankCode: undefined,
      currency: undefined,
      type: undefined,
    };
    this.isDefault = false;
    // this.addItem = undefined;
  }

  // 關閉modal
  closeAddAndEditModal() {
    // 關閉下拉
    // this.closeAddOptionItem();

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.$emit('closeAddAndEditModal');
        // 清除相關檢核資訊
        this.$nextTick(() => {
          (this.$refs.formRef as any).clearValidate();
          // 欄位清空
          this.reset();
        });
      },
    });
  }

  // 檢核欄位
  checkContent() {
    let byPass = true;
    let alertContent = [];
    if (this.isEmpty(this.oriForm.safekeepingAccount)) {
      alertContent.push('保管帳號不得為空');
    }
    if (this.isEmpty(this.oriForm.market)) {
      alertContent.push('Market不得為空');
    }
    if (this.isEmpty(this.oriForm.settlementLocation)) {
      alertContent.push('Settlement Location不得為空');
    }
    if (!this.isEmpty(alertContent)) {
      InfoModal.alertInfo({
        title: '檢核有誤',
        confirm: false,
        content: alertContent,
        customContent: null,
      });
      byPass = false;
    }
    return byPass;
  }

  // 驗證是否可點擊送出按鈕
  validateSubmit() {
    let disabled = false;
    // 檢核必填欄位如果沒有填，則關閉送出按鈕
    if (this.isEmpty(this.oriForm.safekeepingAccount)
      || this.isEmpty(this.oriForm.market) || this.isEmpty(this.oriForm.settlementLocation)) {
      disabled = true;
    }
    return disabled;
  }

  // 新增選項
  // addOptionItem() {
  //   if (this.isEmpty(this.addItem)) {
  //     return;
  //   }
  //   for (let i = 0; i < this.marketOption.length; i++) {
  //     if (this.addItem === this.marketOption[i].value) {
  //       this.selectOpen = false;
  //       this.isAdd = false;
  //       this.addItem = undefined;
  //       InfoModal.alertInfo({ confirm: false, content: '已存在相同選項。' });
  //       return;
  //     }
  //   }
  //   this.marketOption.push({ label: this.addItem, value: this.addItem });
  //   this.isAdd = false;
  //   this.addItem = undefined;
  // }

  // 關閉新增選項
  // closeAddOptionItem() {
  //   this.isAdd = false;
  //   this.addItem = undefined;
  //   this.selectOpen = false;
  // }

  // 保管帳號 欄位輸入驗證
  validateSafekeepingAccount(rule: any, value: any, callback: Function) {
    if (value) {
      callback();
      // 只允許輸入英文數字
      this.oriForm.safekeepingAccount = validateUtil.validateFormData(3, value);
    } else {
      callback('請輸入保管帳號');
    }
  }

  // 保管行名稱 欄位輸入驗證
  validateSafekeepingName(rule: any, value: any, callback: Function) {
    // 只允許輸入英符中數
    this.oriForm.safekeepingName = validateUtil.validateFormData(8, value);
  }

  // Market 欄位輸入驗證
  validateMarket(rule: any, value: any, callback: Function) {
    if (value) {
      callback();
      // 只允許輸入英符
      this.oriForm.market = validateUtil.validateFormData(7, value);
    } else {
      callback('請輸入Market');
    }
  }

  // SettlementLocation 欄位輸入驗證
  validateSettlementLocation(rule: any, value: any, callback: Function) {
    if (value) {
      callback();
      // 只允許輸入英數符(不允許輸入中文)
      this.oriForm.settlementLocation = validateUtil.validateFormData(2, value);
    } else {
      callback('請輸入Settlement Location');
    }
  }

  // Custodian ID Type 欄位輸入驗證
  validateCustodianIdType(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.custodianIdType = validateUtil.validateFormData(2, value);
  }

  // Custodian ID 欄位輸入驗證
  validateCustodianId(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.custodianId = validateUtil.validateFormData(2, value);
  }

  // Custodian Account 欄位輸入驗證
  validateCustodianAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.custodianAccount = validateUtil.validateFormData(2, value);
  }

  // Clearer ID Type 欄位輸入驗證
  validateClearerIdType(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.clearerIdType = validateUtil.validateFormData(2, value);
  }

  // Clearer ID 欄位輸入驗證
  validateClearerId(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.clearerId = validateUtil.validateFormData(2, value);
  }

  // Clearer Account 欄位輸入驗證
  validateClearerAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.clearerAccount = validateUtil.validateFormData(2, value);
  }

  // 統編 欄位輸入驗證
  validateTaxId(rule: any, value: any, callback: Function) {
    // 只允許輸入數字
    this.oriForm.taxId = validateUtil.validateFormData(5, value);
  }

  // 公債帳號對應銀行 欄位輸入驗證
  validatePdAccountBank(rule: any, value: any, callback: Function) {
    // 只允許輸入中文
    this.oriForm.pdAccountBank = validateUtil.validateFormData(6, value);
  }
}
