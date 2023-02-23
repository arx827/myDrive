import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { CfFbSsiCashEditDto, CfFbSsiCashKey } from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class DataCashEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  cashEditInfoShow: boolean // modal開關

  @Prop()
  cashEditInfo: any // 修改修改資訊

  @Prop()
  checkInfo: any // 新增修改資訊

  /**
   * data
   */
  modalVisible = false // modal開關

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    bfBankId: [{
      required: false,
      validator: this.validateBfBankId,
      trigger: 'change',
    }],
    bfBankAccount: [{
      required: false,
      validator: this.validateBfBankAccount,
      trigger: 'change',
    }],
    imBankCode: [{
      required: false,
      validator: this.validateImBankCode,
      trigger: 'change',
    }],
    tfBankAccount: [{
      required: false,
      validator: this.validateTfBankAccount,
      trigger: 'change',
    }],
  };

  oriForm = { // 新增彈窗 v-model綁定
    uid: undefined,
    bfBankId: undefined,
    bfBankAccount: undefined,
    bfBankName: undefined,
    bfAccount: undefined,
    bfAccountName: undefined,
    imBankCode: undefined,
    imBankName: undefined,
    tfBankAccount: undefined,
    tfBankName: undefined,
    isDefault: undefined,
    memo: undefined,
    remark: undefined,
    custodianBankCode: undefined,
    currency: undefined,
    type: undefined,
  }

  // 預設，先接true或false，再根據true或false設定oriForm.isDefault='Y'或'N'
  isDefault = false;

  /**
  * watch
  */
  @Watch('cashEditInfoShow')
  onChange(val) {
    this.modalVisible = val;
    this.oriForm = { ...this.cashEditInfo.editInfo };
    // 調整判斷1/0成true/false
    this.isDefault = this.cashEditInfo.editInfo.isDefault === 'Y';
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
  // 送出修改款帳號
  submitEditCashInfo() {
    // this.setLoading(true);
    let dto = {
      bfAccount: this.isEmpty(this.oriForm.bfAccount) ? undefined : this.oriForm.bfAccount,
      uid: this.isEmpty(this.oriForm.uid) ? undefined : this.oriForm.uid,
      isDefault: this.isDefault ? 'Y' : 'N',
    };
    this.checkBeforeModifyCash(dto);
  }

  // 修改款帳號前檢核
  checkBeforeModifyCash(dto: CfFbSsiCashKey) {
    this.setLoading(true);
    this.$fubonSsiApi.checkBeforeModifyCashUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        // 檢核失敗>>結束
        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 檢核通過>>修改款帳號
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
                this.modifyCash(this.oriForm);
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
                this.modifyCash(this.oriForm);
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
  modifyCash(dto: CfFbSsiCashEditDto) {
    this.setLoading(true);
    this.$fubonSsiApi.modifyCashUsingPATCH(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        // 修改款帳號 失敗
        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 修改款帳號 成功
        this.$message.success(message, 10);
        // 關閉彈窗
        this.$emit('closeCashEditModal');
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
      bfBankId: undefined,
      bfBankAccount: undefined,
      bfBankName: undefined,
      bfAccount: undefined,
      bfAccountName: undefined,
      imBankCode: undefined,
      imBankName: undefined,
      tfBankAccount: undefined,
      tfBankName: undefined,
      isDefault: undefined,
      memo: undefined,
      remark: undefined,
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
        this.$emit('closeCashEditModal');
        this.reset();
      },
    });
  }

  // 驗證是否可點擊送出按鈕
  validateSubmit() {
    let disabled = false;
    if (this.isEmpty(this.oriForm.bfAccount)) {
      disabled = true;
    }
    return disabled;
  }

  // 受款人帳號 欄位輸入驗證
  validateBfAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入英文數字
    this.oriForm.bfAccount = validateUtil.validateFormData(3, value);
  }

  // 受款銀行代碼 欄位輸入驗證
  validateBfBankId(rule: any, value: any, callback: Function) {
    // 只允許輸入英文數字
    this.oriForm.bfBankId = validateUtil.validateFormData(3, value);
  }

  // 受款銀行帳號 欄位輸入驗證
  validateBfBankAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入英文數字
    this.oriForm.bfBankAccount = validateUtil.validateFormData(3, value);
  }

  // 中間行代碼 欄位輸入驗證
  validateImBankCode(rule: any, value: any, callback: Function) {
    // 只允許輸入英文數字
    this.oriForm.imBankCode = validateUtil.validateFormData(3, value);
  }

  // 調撥銀行帳號 欄位輸入驗證
  validateTfBankAccount(rule: any, value: any, callback: Function) {
    // 只允許輸入數字
    this.oriForm.tfBankAccount = validateUtil.validateFormData(5, value);
  }
}
