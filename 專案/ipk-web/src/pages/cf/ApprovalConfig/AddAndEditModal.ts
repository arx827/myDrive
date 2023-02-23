import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkButton,
  },
})
export default class AddAndEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  modalAddInfoShow: boolean // modal開關

  @Prop()
  addAndEditInfo: any // 編輯修改資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  addFormRules: { [key: string]: ValidationRule[] } = { // 編輯彈窗表單驗證
    amountLv1: [{ required: true, message: '請輸入職等六上限', trigger: 'blur' }],
    amountLv2: [{ required: true, message: '請輸入科主管上限', trigger: 'blur' }],
    amountLv3: [{ required: true, message: '請輸入部副主管上限', trigger: 'blur' }],
    amountLv4: [{ required: true, message: '請輸入部主管上限', trigger: 'blur' }],
  };

  oriForm = { // 編輯彈窗 v-model綁定
    amountLv1: undefined,
    amountLv2: undefined,
    amountLv3: undefined,
    amountLv4: undefined,
    amountLv5: undefined,
    amountLv6: undefined,
    calculateType: undefined,
    currency: undefined,
    productType: undefined,
    productTypeId: undefined,
  }

  inputForm = { // 針對要操作的資料-整理金額乘回去
    amountLv1: undefined,
    amountLv2: undefined,
    amountLv3: undefined,
    amountLv4: undefined,
    amountLv5: undefined,
    amountLv6: undefined,
    calculateType: undefined,
    currency: undefined,
    productType: undefined,
    productTypeId: undefined,
  }

  currencyOption = [];

  calculateTypeOption = [];

  /**
  * computed
  */
  // 判斷送出按鈕是否鎖定
  get submitDisabled() {
    let disalbed = false;
    if (this.isEmpty(this.oriForm.amountLv1) || this.isEmpty(this.oriForm.amountLv2)
    || this.isEmpty(this.oriForm.amountLv3) || this.isEmpty(this.oriForm.amountLv4)) {
        disalbed = true;
    }
    return disalbed;
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
    // 修改
    if (val.actionType === this.$cfEnum.constant.MODIFY.val) {
      this.modalTitle = this.$cfEnum.constant.MODIFY.key;
      this.setMyInput();
    }
  }

  /**
  * hook
  */
  async created() {
    this.reset();

    // 下拉選單
    this.currencyOption = await this.$cfCommon.getCurrencyOption([]);
    this.calculateTypeOption = this.$cfEnum.calculateTypeOption;
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

  // 回到初始值
  reset() {
    this.oriForm = {
      amountLv1: undefined,
      amountLv2: undefined,
      amountLv3: undefined,
      amountLv4: undefined,
      amountLv5: undefined,
      amountLv6: undefined,
      calculateType: undefined,
      currency: undefined,
      productType: undefined,
      productTypeId: undefined,
    };
  }

  // 資料欄位塞到顯示的Form
  setMyInput() {
    this.oriForm = {
      amountLv1: this.addAndEditInfo.editInfo.amountLv1 ? Number(this.addAndEditInfo.editInfo.amountLv1) / 100000000 : null,
      amountLv2: this.addAndEditInfo.editInfo.amountLv2 ? Number(this.addAndEditInfo.editInfo.amountLv2) / 100000000 : null,
      amountLv3: this.addAndEditInfo.editInfo.amountLv3 ? Number(this.addAndEditInfo.editInfo.amountLv3) / 100000000 : null,
      amountLv4: this.addAndEditInfo.editInfo.amountLv4 ? Number(this.addAndEditInfo.editInfo.amountLv4) / 100000000 : null,
      amountLv5: this.addAndEditInfo.editInfo.amountLv5 ? Number(this.addAndEditInfo.editInfo.amountLv5) / 100000000 : null,
      amountLv6: this.addAndEditInfo.editInfo.amountLv6 ? Number(this.addAndEditInfo.editInfo.amountLv6) / 100000000 : null,
      calculateType: this.addAndEditInfo.editInfo.calculateType,
      currency: this.addAndEditInfo.editInfo.currency,
      productType: this.addAndEditInfo.editInfo.productType,
      productTypeId: this.addAndEditInfo.editInfo.productTypeId,
    };
  }

  // 編輯送出
  submitApprovalConfigInfo() {
    // 檢核欄位
    if (!this.checkContent()) {
      return;
    }
    // 修改前檢核
    this.setLoading(true);
    this.adjInputForm();
    this.$approvalConfigApi.checkBeforeModifyUsingPOST(this.oriForm)
      .then((resp) => {
        const isSuccess = resp.data.success;
        const message = resp.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        InfoModal.alertInfo({
          confirm: true,
          content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
          customContent: null,
          onCallback: () => {
            this.modifyConfig();
          },
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 真正執行變更-確認送出
  modifyConfig() {
    this.setLoading(true);
    this.$approvalConfigApi.modifyConfigUsingPATCH(this.inputForm)
      .then((resp) => {
        const isSuccess = resp.data.success;
        const message = resp.data.message;
        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        // 關閉彈窗
        this.closeAddAndEditModalWithoutAlert();
        // 重新查詢
        this.$emit('handleSearch');
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 檢核欄位
  checkContent() {
    let byPass = true;
    let alertContent = [];
    if (this.oriForm.amountLv2 <= this.oriForm.amountLv1) {
      alertContent.push('科主管上限須大於職等六上限');
    }
    if (this.oriForm.amountLv3 <= this.oriForm.amountLv2) {
      alertContent.push('部副主管上限須大於科主管上限');
    }
    if (this.oriForm.amountLv4 <= this.oriForm.amountLv3) {
      alertContent.push('部主管上限須大於部副主管上限');
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

  // 設定修改彈窗資料-清空
  setEditInfo() {
    (this.$refs.formRef as any).resetFields();
  }

  // 資料轉換回真正數值(待執行送出時使用)
  adjInputForm() {
    this.inputForm.amountLv1 = this.oriForm.amountLv1 ? Number(this.oriForm.amountLv1) * 100000000 : null;
    this.inputForm.amountLv2 = this.oriForm.amountLv2 ? Number(this.oriForm.amountLv2) * 100000000 : null;
    this.inputForm.amountLv3 = this.oriForm.amountLv3 ? Number(this.oriForm.amountLv3) * 100000000 : null;
    this.inputForm.amountLv4 = this.oriForm.amountLv4 ? Number(this.oriForm.amountLv4) * 100000000 : null;
    this.inputForm.calculateType = this.oriForm.calculateType;
    this.inputForm.currency = this.oriForm.currency;
    this.inputForm.productType = this.oriForm.productType;
    this.inputForm.productTypeId = this.oriForm.productTypeId;
  }

  // 關閉modal
  closeAddAndEditModal(action) {
    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.$emit('closeAddAndEditModal');
        // 結束-清空作業中的form
        this.resetInputForm();
        // 清檢核條件
        this.setEditInfo();
      },
    });
  }

  // 關閉modal
  closeAddAndEditModalWithoutAlert() {
    this.$emit('closeAddAndEditModal');
    // 結束-清空作業中的form
    this.resetInputForm();
    // 清檢核條件
    this.setEditInfo();
  }

  // 結束-清空作業中的form
  resetInputForm() {
    this.inputForm = {
      amountLv1: undefined,
      amountLv2: undefined,
      amountLv3: undefined,
      amountLv4: undefined,
      amountLv5: undefined,
      amountLv6: undefined,
      calculateType: undefined,
      currency: undefined,
      productType: undefined,
      productTypeId: undefined,
    };
  }
}
