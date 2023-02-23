import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import BasicTinyEditor from '@/components/shared/editor/BasicTinyEditor.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import { getTinymce } from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import NoticeModal from '@/pages/MailSetting/MailModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    BasicTinyEditor,
    IpkVxeTable,
    NoticeModal,
    IpkButton,
  },
})
export default class SendModal extends Vue {
  @Action('setLoading') setLoading;

  /**
   * props
   */
  @Prop()
  sendModalShow: boolean // modal開關

  /**
   * data
   */
  noticeKind = this.$settingsEnum.noticeType.EMAIL.value // 通知類型

  modalTitle = '寄發測試信'

  formTemplate = {
    noticeSubject: '',
    noticeContent: '',
    selectedNoticeSymbolList: [],
    selectedTemplate: undefined, // 選擇的樣板
  }

  formRuleSettings = { // 表單內容驗證設定
    noticeSubject: [
      { required: true, message: '請輸入主旨' },
      { max: 200, message: '不可超過200個字' },
    ],
    noticeContent: [{ required: true, message: '請輸入內文' }],
  }

  dataGrid: IpkVxeTableModel = { // 字串樣板使用清單
    data: [],
    pagerConfig: { enabled: false },
    border: true,
    tableHeight: '400px',
    columns: [
      {
        title: '字串樣板',
        field: 'template',
      },
      {
        title: '字串樣板名稱',
        field: 'name',
      },
      {
        title: '字串範例',
        field: 'preview',
      },
    ],
  };

  showPreviewModal = false // [預覽彈窗] modal開關

  form = {
    ...this.formTemplate,
  }

  formRules: { [key: string]: ValidationRule[] } = {} // 表單的驗證規則

  templateList = [] // 可選的樣板清單

  /**
   * computed
   */
  // 是否顯示Modal
  get showModal() {
    return this.sendModalShow;
  }

  // 是否顯示字串樣板區塊
  get showNoticeSymbolArea() {
    return this.dataGrid.data && this.dataGrid.data.length > 0;
  }

  @Watch('showModal')
  onModelOpen() {
    if (!this.showModal) {
      return;
    }
    this.getTemplateList();
  }

  /**
   * hook
   */
  created() {
    this.resetForm();
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeModal;
  }

  /**
   * methods
   */
  // 重置表單狀態
  resetForm() {
    this.form = {
      ...this.formTemplate,
    };
    // 清空編輯器undo和redo歷程
    getTinymce()?.activeEditor?.undoManager.clear();
    // 清空字串樣板區塊
    this.dataGrid.data = [];
    this.setRules();
  }

  // 設定表單驗證規則
  setRules() {
    this.formRules = { ...this.formRuleSettings };
  }

  // 開啟預覽彈窗
  openPreviewModal() {
    this.showPreviewModal = true;
  }

  // 關閉預覽彈窗
  closePreviewModal() {
    this.showPreviewModal = false;
  }

  // 關閉modal
  closeModal() {
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.resetForm();
        this.$emit('closeModal');
      },
    });
  }

  // 取得可選通知樣板清單
  getTemplateList() {
    this.setLoading(true);
    this.$emailApi.searchNoticeTemplateNameListUsingGET(this.noticeKind)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.templateList = [...content];
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 選擇通知樣板
  selectTemplate() {
    if (!this.form.selectedTemplate) {
      // 若清空則一併清空使用的字串樣板區塊
      this.dataGrid.data = [];
      return;
    }
    this.setLoading(true);
    this.$emailApi.searchNoticeTemplateDetailUsingGET(this.form.selectedTemplate)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.form = {
          ...this.form,
          noticeSubject: content.noticeSubject,
          noticeContent: content.noticeContent,
          selectedNoticeSymbolList: content.noticeSymbolVoList,
        };
        this.form = this.$noticeService.replaceSymbol(this.form, 'defaultReplaceString');
        this.$nextTick(() => {
          (this.$refs.formRef as any).validate((valid) => valid);
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

  submit() {
    if (!this.validateAllRequireColumn() || !this.validateLength()) {
      (this.$refs.formRef as any).validate((valid) => valid);
      return;
    }
    this.setLoading(true);
    // TODO: 尚未進行測試
    const dto = {
      noticeSubject: this.form.noticeSubject,
      noticeContent: this.form.noticeContent,
    };
    this.$emailApi.sendTestMailUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 內容驗證(僅驗證是否為空)
  validateContent() {
    (this.$refs.formRef as any).validateField([this.$settingsEnum.columns.CONTENT.value]);
  }

  // 驗證所有必填欄位(送出前)
  validateAllRequireColumn() {
    const isValid = !(validateUtil.isEmpty(this.form.noticeSubject)
      || validateUtil.isEmpty(this.form.noticeContent));
    if (!isValid) {
      InfoModal.alertInfo({
        confirm: false,
        content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message,
      });
    }
    return isValid;
  }

  // 驗證欄位長度(送出前)
  validateLength() {
    const isValid = !(this.form.noticeSubject.length > 200);
    if (!isValid) {
      InfoModal.alertInfo({
        title: this.$otherMsgEnumData.SUBMIT_MAXLENGTH_VALIDATE_INFO.title,
        confirm: false,
        content: this.$otherMsgEnumData.SUBMIT_MAXLENGTH_VALIDATE_INFO.message,
      });
    }
    return isValid;
  }
}
