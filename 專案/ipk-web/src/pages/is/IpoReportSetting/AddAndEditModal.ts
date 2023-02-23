import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import { IpoReportSettingEditDto } from '@fubonlife/ipk-api-axios-sdk';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import IpkSelect from '@/components/shared/form/IpkSelect.vue';

@Component({
  components: {
    IpkButton,
    IpkSelect,
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

  customTypeOptions = [
    { label: '股票基金', value: 'S' },
    { label: '債券', value: 'B' },
  ]

  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  addFormRules = { // 新增彈窗表單驗證
    seqNo: [],
    date: [],
    symId: [],
    sharesValue: [],
    investmentClass3: [],
    customType: [],
  };

  addForm = { // 新增彈窗 v-model綁定
    seqNo: undefined,
    date: undefined,
    symId: undefined,
    sharesValue: undefined,
    investmentClass3: undefined,
    customType: undefined,
  };

  customCodeList = [] // 商品代號下拉選單

  investmentClass3List = [] // 投資分類3下拉選單

  /**
   * computed
   */

  // 依據當前彈窗動作轉換buttonKey
  get buttonKey() {
    let buttonKey = '';
    switch (this.modalTitle) {
      case this.$actEnum.constant.ADD.key:
        buttonKey = this.$buttonKey.buttonKey.ADD.val;
        break;
      case this.$actEnum.constant.MODIFY.key:
        buttonKey = this.$buttonKey.buttonKey.MODIFY.val;
        break;
      case this.$actEnum.constant.STOP.key:
        buttonKey = this.$buttonKey.buttonKey.STOP.val;
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
    if (val.actionType === this.$actEnum.constant.ADD.val) {
      this.modalTitle = this.$actEnum.constant.ADD.key;
      this.setAddInfo();
    }
    // 修改
    if (val.actionType === this.$actEnum.constant.MODIFY.val) {
      this.modalTitle = this.$actEnum.constant.MODIFY.key;
      this.setEditInfo(val);
    }
  }

  /**
  * hook
  */
  created() {
    this.reset();
    // 取得初始值
    this.customCodeList = this.getCustomCode();
    this.investmentClass3List = this.getInvestmentClass3();
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
  }

  /**
  * methods
  */
  reset() {
    this.addForm = {
      seqNo: undefined,
      date: undefined,
      symId: undefined,
      sharesValue: undefined,
      investmentClass3: undefined,
      customType: undefined,
    };
    this.setAddInfo();
  }

  // 設定新增彈窗資料
  setAddInfo() {
    // 必填檢核條件
    this.addFormRules = {
      seqNo: [
        { required: true, message: '請輸入項次', trigger: 'blur' },
        {
          pattern: /\d{6}-\d{2}/,
          message: '項次格式有誤',
          trigger: 'blur',
        },
      ],
      date: [{ required: true, message: '請選擇日期', trigger: ['blur', 'change'] }],
      symId: [{ required: true, message: '請輸入商品代碼', trigger: 'blur' }],
      sharesValue: [{ required: true, message: '請輸入股數/面額', trigger: 'blur' }],
      investmentClass3: [{ required: true, message: '請輸入投資分類3', trigger: 'blur' }],
      customType: [{ required: true, message: '請選擇商品類別', trigger: 'blur' }],
    };
  }

  // 設定修改彈窗資料
  setEditInfo(val) {
    // 必填檢核條件
    this.addFormRules = {
      seqNo: [
        { required: true, message: '請輸入項次', trigger: 'blur' },
        {
          pattern: /\d{6}-\d{2}/,
          message: '項次格式有誤',
          trigger: 'blur',
        },
      ],
      date: [{ required: true, message: '請選擇日期', trigger: 'blur' }],
      symId: [{ required: true, message: '請輸入商品代碼', trigger: 'blur' }],
      sharesValue: [{ required: true, message: '請輸入股數/面額', trigger: 'blur' }],
      investmentClass3: [{ required: true, message: '請輸入投資分類3', trigger: 'blur' }],
      customType: [{ required: true, message: '請選擇商品類別', trigger: 'blur' }],
    };
    // 修改資訊
    this.addForm = {
      seqNo: val.editInfo.seqNo,
      date: !validateUtil.isEmpty(val.editInfo.date) ? moment(val.editInfo.date) : null,
      symId: this.toKeyLabelOption(this.customCodeList.find((el) => el.value == val.editInfo.symId)),
      sharesValue: val.editInfo.sharesValue,
      investmentClass3: this.toKeyLabelOption(this.investmentClass3List.find((el) => el.value == val.editInfo.investmentClass3)),
      customType: val.editInfo.customType,
    };
  }

  // 關閉modal
  closeAddAndEditModal(action) {
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    if (validateUtil.isEmpty(action)) {
      this.reset();
      this.$emit('closeAddAndEditModal');
      return;
    }

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.reset();
        this.$emit('closeAddAndEditModal');
      },
    });
  }

  // 儲存
  saveInfo() {
    // 驗證
    if (!this.validateRequired(this.$actEnum.actionButton.SAVE)) {
      (this.$refs.formRef as any).validate((valid) => {
        if (!valid) {
          return false;
        }
      });
      return;
    }
    // 整理後端所需格式
    const ipoReportSettingEditDto = {
      actionButton: this.$actEnum.actionButton.SAVE.val,
      seqNo: this.addForm.seqNo,
      customType: this.addForm.customType,
      date: !validateUtil.isEmpty(this.addForm.date) ? moment(this.addForm.date).format('YYYYMMDD') : null,
      symId: this.addForm.symId.key,
      sharesValue: this.addForm.sharesValue,
      investmentClass3: this.addForm.investmentClass3.key,
    };

    // 新增
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.ADD.val) {
      this.addIpoReportSetting(ipoReportSettingEditDto, this.$actEnum.actionButton.SAVE.key);
    }
    // 修改
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.MODIFY.val) {
      const editDto = {
        applySeq: this.addAndEditInfo.editInfo.applySeq,
        createDate: this.addAndEditInfo.editInfo.createDate,
        createId: this.addAndEditInfo.editInfo.createId,
        caseStatus: this.addAndEditInfo.editInfo.caseStatus,
        serialNo: this.addAndEditInfo.editInfo.serialNo,
        ...ipoReportSettingEditDto,
      };
      this.editIpoReportSetting(editDto);
    }
  }

  // 送審
  submitInfo() {
    // 驗證
    if (!this.validateRequired(this.$actEnum.actionButton.CHECK)) {
      (this.$refs.formRef as any).validate((valid) => {
        if (!valid) {
          return false;
        }
      });
      return;
    }

    // 整理後端所需格式
    const ipoReportSettingEditDto = {
      actionButton: this.$actEnum.actionButton.CHECK.val,
      seqNo: this.addForm.seqNo,
      date: !validateUtil.isEmpty(this.addForm.date) ? moment(this.addForm.date).format('YYYYMMDD') : null,
      symId: this.addForm.symId.key,
      sharesValue: this.addForm.sharesValue,
      investmentClass3: this.addForm.investmentClass3.key,
      customType: this.addForm.customType,
    };

    // 修改
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.MODIFY.val) {
      const editDto = {
        applySeq: this.addAndEditInfo.editInfo.applySeq,
        createDate: this.addAndEditInfo.editInfo.createDate,
        createId: this.addAndEditInfo.editInfo.createId,
        caseStatus: this.addAndEditInfo.editInfo.caseStatus,
        serialNo: this.addAndEditInfo.editInfo.serialNo,
        ...ipoReportSettingEditDto,
      };
      if (this.addAndEditInfo.editInfo.caseStatus === this.$actEnum.constant.UNCHECK.val
        && this.addAndEditInfo.editInfo.actionType === this.$actEnum.constant.ADD.val) {
          // 若為新增後修改->送審則call 新增API
          this.addIpoReportSetting(editDto, this.$actEnum.actionButton.CHECK.key);
      } else {
        this.editIpoReportSetting(editDto);
      }
    }

    // 新增
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.ADD.val) {
      this.addIpoReportSetting(ipoReportSettingEditDto, this.$actEnum.actionButton.CHECK.key);
    }
  }

  // 新增
  addIpoReportSetting(dto: IpoReportSettingEditDto, action) {
    this.setLoading(true);
    this.$ipoReportSettingApi.addIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ title: `${action}失敗`, confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        this.reset();
        // 關閉modal
        this.closeAddAndEditModal(null);
        // 重新查詢
        this.$emit('handleSearch', true);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 修改
  editIpoReportSetting(dto: IpoReportSettingEditDto) {
    this.setLoading(true);
    this.$ipoReportSettingApi.modifyIpoReportSettingUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        this.reset();
        // 關閉modal
        this.closeAddAndEditModal(null);
        // 重新查詢
        this.$emit('handleSearch', true);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 驗證必填欄位
  validateRequired(action) {
    let byPass = true;
    if (validateUtil.isEmpty(this.addForm.seqNo) || validateUtil.isEmpty(this.addForm.symId)
      || validateUtil.isEmpty(this.addForm.sharesValue) || validateUtil.isEmpty(this.addForm.investmentClass3) || validateUtil.isEmpty(this.addForm.customType)) {
      InfoModal.alertInfo({
        confirm: false,
        content: `${action.key}失敗，${this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message}`,
      });
      byPass = false;
    }
    return byPass;
  }

  // 取得商品代碼下拉選單
  getCustomCode() {
    let customCodeList = [];
    this.$ipoReportSettingApi.searchCustomCodeUsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          customCodeList.push(data);
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return customCodeList;
  }

  // 取得商品代碼下拉選單
  getInvestmentClass3() {
    let investmentClass3List = [];
    this.$ipoReportSettingApi.searchInvestmentClass3UsingGET()
      .then((res) => {
        res.data.content.forEach((data) => {
          investmentClass3List.push(data);
        });
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      });
    return investmentClass3List;
  }

  toKeyLabelOption(option) {
    if (!option) {
      return undefined;
    }
    return {
      key: option ? option.value : undefined,
      label: option ? option.label : undefined,
    };
  }
}
