import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import IpkAddItemSelect from '@/components/shared/form/IpkAddItemSelect.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    IpkAddItemSelect,
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
  addAndEditInfo: any // 新增修改資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  isSubmit = false; // 是否可點擊送出

  addFormRules: { [key: string]: ValidationRule[] } = { // 新增彈窗表單驗證
    custodian: [],
    nationId: [],
    currency: [],
    type: [],
    tradeType: [],
  };

  addForm = { // 新增彈窗 v-model綁定
    custodian: undefined,
    nationId: undefined,
    currency: undefined,
    type: undefined,
	  tradeCycle: undefined,
    equityCutOffDay: undefined,
    equityCutOffTime: undefined,
    equityBufferTime: undefined,
    cashCutOffDay: undefined,
    cashCutOffTime: undefined,
    cashBufferTime: undefined,
    tradeType: undefined,
    localTradeStartTime: undefined,
    localTradeEndTime: undefined,
    twTradeStartTime: undefined,
    twTradeEndTime: undefined,
    createId: undefined,
    createDate: undefined,
  };

  // 下拉選單
  custodianOption = [];

  nationIdOption = [];

  currencyOption = [];

  typeOption = [];

  tradeTypeOption = [];

  // 時間下拉選單開關
  equityCutOffTimeOpen = false;

  equityBufferTimeOpen = false;

  cashCutOffTimeOpen = false;

  cashBufferTimeOpen = false;

  localTradeStartTimeOpen = false;

  localTradeEndTimeOpen = false;

  twTradeStartTimeOpen = false;

  twTradeEndTimeOpen = false;

  /**
   * computed
   */
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
      this.setAddInfo(val);
    }
    // 修改
    if (val.actionType === this.$cfEnum.constant.MODIFY.val) {
      this.modalTitle = this.$cfEnum.constant.MODIFY.key;
      this.setEditInfo(val);
    }
  }

  /**
  * hook
  */
  async created() {
    this.reset();

    // 取得下拉選單
    this.custodianOption = this.$cfEnum.custodianOption; // 保管行
    this.typeOption = this.$cfEnum.typeOption; // 交易類型
    this.tradeTypeOption = this.$cfEnum.tradeTypeOption; // 買賣類型
    this.nationIdOption = await this.$cfCommon.getNationOption();
    this.currencyOption = await this.$cfCommon.getCurrencyOption([]);
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

  reset() {
    this.addForm = {
      custodian: undefined,
      nationId: undefined,
      currency: undefined,
      type: undefined,
      tradeCycle: undefined,
      equityCutOffDay: undefined,
      equityCutOffTime: undefined,
      equityBufferTime: undefined,
      cashCutOffDay: undefined,
      cashCutOffTime: undefined,
      cashBufferTime: undefined,
      tradeType: undefined,
      localTradeStartTime: undefined,
      localTradeEndTime: undefined,
      twTradeStartTime: undefined,
      twTradeEndTime: undefined,
      // addItem: undefined,
      createId: undefined,
      createDate: undefined,
    };
  }

  // 關閉modal
  closeAddAndEditModal(action) {
    // 關閉下拉
    // this.closeAddOptionItem();

    // 清空驗證警示訊息
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    // 新增/修改成功時，關閉modal
    if (this.isEmpty(action)) {
      this.reset();
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

  // 設定新增彈窗資料
  setAddInfo(val) {
    // 必填檢核條件
    this.addFormRules = {
      custodian: [{ required: true, message: '請請選擇保管行', trigger: 'change' }],
      nationId: [{ required: true, message: '請選擇國家', trigger: 'change' }],
      currency: [{ required: true, message: '請選擇幣別', trigger: 'change' }],
      type: [{ required: true, message: '請選擇交易類型', trigger: 'change' }],
      tradeType: [{ required: true, message: '請選擇買賣類型', trigger: 'change' }],
    };
    // 複製新增資訊
    this.setTimeFormat(val);
  }

  // 設定修改彈窗資料
  setEditInfo(val) {
    // 必填檢核條件
    this.addFormRules = {};
    // 修改資訊
    this.setTimeFormat(val);
  }

  // 驗證是否可點擊送出
  validateSubmit() {
    let disabled = false;
    if (this.isEmpty(this.addForm.custodian)
    || this.isEmpty(this.addForm.nationId) || this.isEmpty(this.addForm.currency)
    || this.isEmpty(this.addForm.type) || this.isEmpty(this.addForm.tradeType)) {
      disabled = true;
    }
    return disabled;
  }

  // 判斷新增流程還是修改流程
  validateAddOrEditProcess() {
    // 新增
    if (this.addAndEditInfo.actionType === this.$cfEnum.constant.ADD.val) {
      this.validateBeforeAdd();
    }
    // 修改
    if (this.addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val) {
      this.validateBeforeModify();
    }
  }

  // 新增前檢核
  validateBeforeAdd() {
    // 整理成後端格式
    let dto = {
      custodian: this.addForm.custodian,
      currency: this.addForm.currency,
      nationId: this.addForm.nationId,
      type: this.addForm.type,
      tradeType: this.addForm.tradeType,
    };

    // call API
    this.setLoading(true);
    this.$cutOffConfigApi.checkBeforeAddUsingPOST(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 新增
      InfoModal.alertInfo({
        title: message,
        confirm: true,
        content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
        onCallback: () => {
          this.addConfig();
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

  // 新增申請
  addConfig() {
    // 整理成後端格式
    let dto = {
      custodian: this.addForm.custodian,
      nationId: this.addForm.nationId,
      currency: this.addForm.currency,
      type: this.addForm.type,
      tradeType: this.addForm.tradeType,
      tradeCycle: this.addForm.tradeCycle,
      equityCutOffDay: this.addForm.equityCutOffDay,
      equityCutOffTime: !this.isEmpty(this.addForm.equityCutOffTime) ? moment(this.addForm.equityCutOffTime).format('HHmm') : undefined,
      equityBufferTime: !this.isEmpty(this.addForm.equityBufferTime) ? moment(this.addForm.equityBufferTime).format('HHmm') : undefined,
      cashCutOffDay: this.addForm.cashCutOffDay,
      cashCutOffTime: !this.isEmpty(this.addForm.cashCutOffTime) ? moment(this.addForm.cashCutOffTime).format('HHmm') : undefined,
      cashBufferTime: !this.isEmpty(this.addForm.cashBufferTime) ? moment(this.addForm.cashBufferTime).format('HHmm') : undefined,
      localTradeStartTime: !this.isEmpty(this.addForm.localTradeStartTime) ? moment(this.addForm.localTradeStartTime).format('HHmm') : undefined,
      localTradeEndTime: !this.isEmpty(this.addForm.localTradeEndTime) ? moment(this.addForm.localTradeEndTime).format('HHmm') : undefined,
      twTradeStartTime: !this.isEmpty(this.addForm.twTradeStartTime) ? moment(this.addForm.twTradeStartTime).format('HHmm') : undefined,
      twTradeEndTime: !this.isEmpty(this.addForm.twTradeEndTime) ? moment(this.addForm.twTradeEndTime).format('HHmm') : undefined,
    };

    this.setLoading(true);
    this.$cutOffConfigApi.addConfigUsingPUT(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      this.$message.success(message, 10);
      // 關閉modal
      this.closeAddAndEditModal(null);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 修改前檢核
  validateBeforeModify() {
    // 整理成後端格式
    let dto = {
      custodian: this.addForm.custodian,
      currency: this.addForm.currency,
      nationId: this.addForm.nationId,
      type: this.addForm.type,
      tradeType: this.addForm.tradeType,
    };

    // call API
    this.setLoading(true);
    this.$cutOffConfigApi.checkBeforeModifyUsingPOST(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 修改
      InfoModal.alertInfo({
        title: message,
        confirm: true,
        content: this.$commonMessageEnum.SUBMIT_TO_PENDING_CONFIRM_INFO?.message,
        onCallback: () => {
          this.modifyConfig();
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

  // 修改申請
  modifyConfig() {
    // 整理成後端格式
    let dto = {
      custodian: this.addForm.custodian,
      nationId: this.addForm.nationId,
      currency: this.addForm.currency,
      type: this.addForm.type,
      tradeType: this.addForm.tradeType,
      tradeCycle: this.addForm.tradeCycle,
      equityCutOffDay: this.addForm.equityCutOffDay,
      equityCutOffTime: !this.isEmpty(this.addForm.equityCutOffTime) ? moment(this.addForm.equityCutOffTime).format('HHmm') : undefined,
      equityBufferTime: !this.isEmpty(this.addForm.equityBufferTime) ? moment(this.addForm.equityBufferTime).format('HHmm') : undefined,
      cashCutOffDay: this.addForm.cashCutOffDay,
      cashCutOffTime: !this.isEmpty(this.addForm.cashCutOffTime) ? moment(this.addForm.cashCutOffTime).format('HHmm') : undefined,
      cashBufferTime: !this.isEmpty(this.addForm.cashBufferTime) ? moment(this.addForm.cashBufferTime).format('HHmm') : undefined,
      localTradeStartTime: !this.isEmpty(this.addForm.localTradeStartTime) ? moment(this.addForm.localTradeStartTime).format('HHmm') : undefined,
      localTradeEndTime: !this.isEmpty(this.addForm.localTradeEndTime) ? moment(this.addForm.localTradeEndTime).format('HHmm') : undefined,
      twTradeStartTime: !this.isEmpty(this.addForm.twTradeStartTime) ? moment(this.addForm.twTradeStartTime).format('HHmm') : undefined,
      twTradeEndTime: !this.isEmpty(this.addForm.twTradeEndTime) ? moment(this.addForm.twTradeEndTime).format('HHmm') : undefined,
      createId: this.addForm.createId,
      createDate: this.addForm.createDate,
    };

    this.setLoading(true);
    this.$cutOffConfigApi.modifyConfigUsingPATCH(dto)
    .then((res) => {
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }
      this.$message.success(message, 10);
      // 關閉modal
      this.closeAddAndEditModal(null);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 時間轉換
  setTimeFormat(val) {
    if (this.isEmpty(val.editInfo)) {
      return;
    }
    Object.entries(val.editInfo).forEach(([key, item], index) => {
      if (new RegExp(/Time$/).test(key)) {
        if (!this.isEmpty(item)) {
          let formatted = moment(item, 'HH:mm').format();
          this.addForm[key] = formatted;
        } else {
          this.addForm[key] = null;
        }
      } else {
        this.addForm[key] = item;
      }
    });
  }
}
