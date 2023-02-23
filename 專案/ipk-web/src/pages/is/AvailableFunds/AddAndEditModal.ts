import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import { AvailableFundsEditDto } from '@fubonlife/ipk-api-axios-sdk';
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
  addAndEditInfo: any // 新增修改資訊

  /**
  * data
  */

  fundNameOptions = [
    { label: 'IAF_M', value: 'IAF_M' },
    { label: 'EQUITY_M', value: 'EQUITY_M' },
    { label: 'IAF-R_M', value: 'IAF-R_M' },
    { label: 'IAF_Q', value: 'IAF_Q' },
    { label: 'EQUITY_Q', value: 'EQUITY_Q' },
  ]

  modalVisible = false // modal開關

  modalTitle = '' // modal標題

  addFormRules = { // 新增彈窗表單驗證
    fundName: [],
    amount: [],
    date: [],
    maintainDate: [],
  };

  addForm = { // 新增彈窗 v-model綁定
    fundName: undefined,
    amount: undefined,
    date: undefined,
    maintainDate: undefined,
  };

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
      fundName: undefined,
      amount: undefined,
      date: undefined,
      maintainDate: undefined,
    };
    this.setAddInfo();
  }

  // 設定新增彈窗資料
  setAddInfo() {
    // 必填檢核條件
    this.addFormRules = {
      fundName: [
        { required: true, message: '請選擇名稱', trigger: 'blur' },
      ],
      amount: [{ required: true, message: '請輸入金額', trigger: 'blur' }],
      date: [{ required: true, message: '請選擇日期', trigger: ['blur', 'change'] }],
      maintainDate: [{ required: true, message: '請選擇資料維護日', trigger: ['blur', 'change'] }],
    };
    // 新增資訊
    this.addForm = {
      fundName: undefined,
      amount: undefined,
      date: moment().subtract(1, 'months').endOf('month'), // 預設日期為資料維護日上月底日期
      maintainDate: moment(), // 資料維護日預帶當天的日期
    };
  }

  // 設定修改彈窗資料
  setEditInfo(val) {
    // 必填檢核條件
    this.addFormRules = {
      fundName: [
        { required: true, message: '請選擇名稱', trigger: 'blur' },
      ],
      amount: [{ required: true, message: '請輸入金額', trigger: 'blur' }],
      date: [{ required: true, message: '請選擇日期', trigger: ['blur', 'change'] }],
      maintainDate: [{ required: true, message: '請選擇資料維護日', trigger: ['blur', 'change'] }],
    };
    // 修改資訊
    this.addForm = {
      fundName: val.editInfo.fundName,
      amount: val.editInfo.amount,
      date: !validateUtil.isEmpty(val.editInfo.date) ? moment(val.editInfo.date) : null,
      maintainDate: !validateUtil.isEmpty(val.editInfo.maintainDate) ? moment(val.editInfo.maintainDate) : null,
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
    const availableFundsEditDto = {
      actionButton: this.$actEnum.actionButton.SAVE.val,
      fundName: this.addForm.fundName,
      amount: this.addForm.amount,
      date: !validateUtil.isEmpty(this.addForm.date) ? moment(this.addForm.date).format('YYYYMMDD') : null,
      maintainDate: this.addForm.maintainDate ? moment(this.addForm.maintainDate).format('YYYYMMDD') : null,
    };

    // 新增
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.ADD.val) {
      this.validateAddInfoExist(availableFundsEditDto, this.$actEnum.actionButton.SAVE.key);
    }
    // 修改
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.MODIFY.val) {
      const editDto = {
        applySeq: this.addAndEditInfo.editInfo.applySeq,
        createDate: this.addAndEditInfo.editInfo.createDate,
        createId: this.addAndEditInfo.editInfo.createId,
        caseStatus: this.addAndEditInfo.editInfo.caseStatus,
        serialNo: this.addAndEditInfo.editInfo.serialNo,
        seqNo: this.addAndEditInfo.editInfo.seqNo,
        ...availableFundsEditDto,
      };
      this.validateEditInfoExist(editDto);
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
    const availableFundsEditDto = {
      actionButton: this.$actEnum.actionButton.CHECK.val,
      fundName: this.addForm.fundName,
      amount: this.addForm.amount,
      date: validateUtil.isEmpty(this.addForm.date) ? null : moment(this.addForm.date).format('YYYYMMDD'),
      maintainDate: validateUtil.isEmpty(this.addForm.maintainDate) ? null : moment(this.addForm.maintainDate).format('YYYYMMDD'),
    };

    // 修改
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.MODIFY.val) {
      const editDto = {
        applySeq: this.addAndEditInfo.editInfo.applySeq,
        createDate: this.addAndEditInfo.editInfo.createDate,
        createId: this.addAndEditInfo.editInfo.createId,
        caseStatus: this.addAndEditInfo.editInfo.caseStatus,
        serialNo: this.addAndEditInfo.editInfo.serialNo,
        seqNo: this.addAndEditInfo.editInfo.seqNo,
        ...availableFundsEditDto,
      };
      if (this.addAndEditInfo.editInfo.caseStatus === this.$actEnum.constant.UNCHECK.val
        && this.addAndEditInfo.editInfo.actionType === this.$actEnum.constant.ADD.val) {
        // 若為新增後修改->送審則call 新增API
        this.validateAddInfoExist(availableFundsEditDto, this.$actEnum.actionButton.CHECK.key);
      } else {
        this.validateEditInfoExist(editDto);
      }
    }

    // 新增
    if (this.addAndEditInfo.actionType === this.$actEnum.constant.ADD.val) {
      this.validateAddInfoExist(availableFundsEditDto, this.$actEnum.actionButton.CHECK.key);
    }
  }

  // 新增
  addInfo(dto: AvailableFundsEditDto, action) {
    this.setLoading(true);
    this.$availableFundsApi.addAvailableFundsUsingPOST(dto)
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
  editInfo(dto: AvailableFundsEditDto) {
    this.setLoading(true);
    this.$availableFundsApi.modifyAvailableFundsUsingPOST(dto)
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
    if (validateUtil.isEmpty(this.addForm.fundName) || validateUtil.isEmpty(this.addForm.amount)
      || validateUtil.isEmpty(this.addForm.date) || validateUtil.isEmpty(this.addForm.maintainDate)) {
      InfoModal.alertInfo({
        confirm: false,
        content: `${action.key}失敗，${this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message}`,
      });
      byPass = false;
    }
    return byPass;
  }

  // 驗證是否可新增可運用資金
  validateAddInfoExist(dto: AvailableFundsEditDto, action) {
    this.setLoading(true);
    this.$availableFundsApi.checkAvailableFundsUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({
            confirm: false,
            content: message,
          });
          return;
        }

        switch ((content as any)) {
          case 0:
            this.addInfo(dto, action);
            break;
          case 1:
            InfoModal.alertInfo({
              confirm: true,
              content: message,
              onCallback: () => {
                this.addInfo(dto, action);
              },
            });
            break;
        }
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 驗證是否可修改可運用資金
  validateEditInfoExist(editDto: AvailableFundsEditDto) {
    this.setLoading(true);
    this.$availableFundsApi.checkAvailableFundsUsingPOST(editDto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({
            confirm: false,
            content: message,
          });
          return;
        }

        switch ((content as any)) {
          case 0:
            this.editInfo(editDto);
            break;
          case 1:
            InfoModal.alertInfo({
              confirm: true,
              content: message,
              onCallback: () => {
                this.editInfo(editDto);
              },
            });
            break;
        }
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
}
