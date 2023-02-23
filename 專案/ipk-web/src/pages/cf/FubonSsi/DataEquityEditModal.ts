import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { CfFbSsiEquityEditDto, CfFbSsiEquityKey } from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class DataEquityEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  equityEditInfoShow: boolean // modal開關

  @Prop()
  equityEditInfo: any // 修改修改資訊

  @Prop()
  checkInfo: any // 新增修改資訊

  /**
   * data
   */
  modalVisible = false // modal開關

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    safekeepingAccount: [{
      required: false,
      message: '請輸入保管帳號',
      validator: this.validateSafekeepingAccount,
      trigger: 'blur',
    }],
    safekeepingName: [{
      required: false,
      validator: this.validateSafekeepingName,
      trigger: 'change',
    }],
    market: [{
      required: false,
      message: '請輸入Market',
      validator: this.validateMarket,
      trigger: 'blur',
    }],
    settlementLocation: [{
      required: false,
      message: '請輸入Settlement Location',
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

  // 下拉選單-市場別
  marketOption: any = this.$cfCommon.getPsetCodeOption();

  /**
  * watch
  */

  @Watch('equityEditInfoShow')
  onChange(val) {
    this.modalVisible = val;
    this.oriForm = { ...this.equityEditInfo.editInfo };
    // 調整判斷1/0成true/false
    this.isDefault = this.equityEditInfo.editInfo.isDefault === 'Y';
  }

  /**
  * hook
  */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
  }

  /**
  * methods
  */
  // -------------------修改-------------------
  // 送出修改券帳號
  submitEditEquityInfo() {
    // this.setLoading(true);
    let dto = {
      uid: this.isEmpty(this.oriForm.uid) ? undefined : this.oriForm.uid,
      market: this.isEmpty(this.oriForm.market) ? undefined : this.oriForm.market,
      settlementLocation: this.isEmpty(this.oriForm.settlementLocation) ? undefined : this.oriForm.settlementLocation,
      isDefault: this.isDefault ? 'Y' : 'N',
      safekeepingAccount: this.isEmpty(this.oriForm.safekeepingAccount) ? undefined : this.oriForm.safekeepingAccount,
    };
    this.checkBeforeModifyEquity(dto);
  }

  // 修改券帳號前檢核
  checkBeforeModifyEquity(dto: CfFbSsiEquityKey) {
    this.setLoading(true);
    this.$fubonSsiApi.checkBeforeModifyEquityUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        // 檢核失敗>>結束
        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 檢核通過>>修改券帳號
        switch (res.data.content) {
          case 1:
            InfoModal.alertInfo({
              title: message,
              confirm: true,
              content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
              onCallback: () => {
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.currency;
                this.oriForm.type = this.checkInfo.editInfo.type;
                // Call API
                this.modifyEquity(this.oriForm);
              },
            });
            break;
          case 2:
            InfoModal.alertInfo({
              confirm: true,
              content: message,
              onCallback: () => {
                this.isDefault ? this.oriForm.isDefault = 'Y' : this.oriForm.isDefault = 'N';
                this.oriForm.custodianBankCode = this.checkInfo.editInfo.custodianBankCode;
                this.oriForm.currency = this.checkInfo.editInfo.currency;
                this.oriForm.type = this.checkInfo.editInfo.type;
                // Call API
                this.modifyEquity(this.oriForm);
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

  // 執行修改
  modifyEquity(dto: CfFbSsiEquityEditDto) {
    this.setLoading(true);
    this.$fubonSsiApi.modifyEquityUsingPATCH(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        // 修改券帳號 失敗
        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 修改券帳號 成功
        this.$message.success(message, 10);
        // 關閉彈窗
        this.$emit('closeEquityEditModal');
        // 更新待放行清單筆數
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

  // -------------------其他-------------------
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 重設
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
  }

  // 關閉modal
  closeAddAndEditModal() {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.$emit('closeEquityEditModal');
        this.reset();
      },
    });
  }

  // 保管帳號 欄位輸入驗證
  validateSafekeepingAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入英文數字
    this.oriForm.safekeepingAccount = validateUtil.validateFormData(3, value);
  }

  // 保管行名稱 欄位輸入驗證
  validateSafekeepingName(rule: any, value: any, callback: Function) {
    // 只允許輸入英符中數
    this.oriForm.safekeepingName = validateUtil.validateFormData(8, value);
  }

  // Market 欄位輸入驗證
  validateMarket(rule: any, value: any, callback: Function) {
    // 只允許輸入英符
    this.oriForm.market = validateUtil.validateFormData(7, value);
  }

  // SettlementLocation 欄位輸入驗證
  validateSettlementLocation(rule: any, value: any, callback: Function) {
    // 只允許輸入英數符(不允許輸入中文)
    this.oriForm.settlementLocation = validateUtil.validateFormData(2, value);
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
