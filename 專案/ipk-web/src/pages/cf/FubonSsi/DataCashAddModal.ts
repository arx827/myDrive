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
export default class DataCashAddModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  cashModalAddInfoShow: boolean // modal開關

  @Prop()
  checkInfo: any // 新增修改資訊

  /**
   * data
   */
  modalVisible = false // modal開關

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    bfAccount: [{
      required: true,
      validator: this.validateBfAccount,
      trigger: 'blur',
    }],
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
  @Watch('cashModalAddInfoShow')
  onChange(val) {
    this.modalVisible = val;
    this.reset();
    if (!this.isEmpty(this.checkInfo.editInfo.after)) {
      const currentInfo = this.checkInfo.editInfo.after;
      this.oriForm = { ...currentInfo };
      this.isDefault = currentInfo.isDefault === 'Y';
    }
  }

  /**
  * hook
  */
  async created() {
    this.reset();
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
  }

  /**
  * methods
  */
  // -------------------新增-------------------
  // 檢核欄位
  checkContent() {
    let byPass = true;
    let alertContent = [];
    if (this.isEmpty(this.oriForm.bfAccount)) {
      alertContent.push('受款人帳號不得為空');
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

  // 送出新增款帳號
  submitAddCashInfo() {
    // 檢核欄位
    if (!this.checkContent()) {
      return;
    }
    // this.setLoading(true);
    // 整理成後端格式
    let dto;
    if (this.isEmpty(this.checkInfo.editInfo.after)) { // 新增件
      dto = {
        bfAccount: this.isEmpty(this.oriForm.bfAccount) ? undefined : this.oriForm.bfAccount,
        uid: this.isEmpty(this.checkInfo.editInfo.uid) ? undefined : this.checkInfo.editInfo.uid,
        isDefault: this.isDefault ? 'Y' : 'N',
      };
    } else if (!this.isEmpty(this.checkInfo.editInfo.after)) { // 複製新增件
      dto = {
        bfAccount: this.isEmpty(this.oriForm.bfAccount) ? undefined : this.oriForm.bfAccount,
        uid: this.isEmpty(this.checkInfo.editInfo.after.uid) ? undefined : this.checkInfo.editInfo.after.uid,
        isDefault: this.isDefault ? 'Y' : 'N',
      };
    }
    // call API 新增款帳號前檢核
    this.checkBeforeAddCash(dto);
  }

  // 新增款帳號前檢核
  checkBeforeAddCash(dto: CfFbSsiCashKey) {
    this.setLoading(true);
    this.$fubonSsiApi.checkBeforeAddCashUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        // 新增款帳號前檢核 通過，執行 新增款帳號
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
                this.addCash(this.oriForm);
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
                this.addCash(this.oriForm);
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

  // 執行新增款
  addCash(dto: CfFbSsiCashEditDto) {
    this.setLoading(true);
    this.$fubonSsiApi.addCashUsingPUT(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        if (!isSuccess) {
          // 新增款帳號 失敗
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        // 新增款帳號 成功
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
        this.$emit('closeAddAndEditModal');
        // (this.$refs.formRef as any).resetFields();
        // 清除相關檢核資訊
        this.$nextTick(() => {
          (this.$refs.formRef as any).clearValidate();
        });
        // 欄位清空
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
    if (value) {
      callback();
      // 只允許輸入英文數字
      this.oriForm.bfAccount = validateUtil.validateFormData(3, value);
    } else {
      callback('請輸入受款人帳號');
    }
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
