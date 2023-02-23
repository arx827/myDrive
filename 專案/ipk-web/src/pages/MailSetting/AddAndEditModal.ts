import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import BasicTinyEditor from '@/components/shared/editor/BasicTinyEditor.vue';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { getTinymce } from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import MailModal from '@/pages/MailSetting/MailModal.vue';

interface FormInfo {
  actionType: string; // 操作類型
  formData: any; // 表單資訊
}

@Component({
  components: {
    BasicTinyEditor,
    IpkButton,
    IpkVxeTable,
    MailModal,
  },
})
export default class AddAndEditModal extends Vue {
  @Action('setLoading') setLoading;

  /**
   * props
   */
  @Prop()
  showAddAndEditModal: boolean // modal開關

  @Prop()
  addAndEditInfo: FormInfo // 新增修改資訊

  /**
   * data
   */
  noticeKind = this.$settingsEnum.noticeType.EMAIL.value // 通知類型

  formTemplate = {
    noticeTemplateId: null, // 通知樣板ID
    templateName: '', // 通知樣板名稱
    noticeSubject: '', // 通知標題
    noticeContent: '', // 通知內容
    selectedNoticeSymbolList: [], // 通知對應的字串樣板
  }

  formRuleSettings = { // 表單內容驗證設定
    templateName: [
      { required: true, message: '請輸入樣板名稱' },
      { max: 50, message: '不可超過50個字' },
    ],
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
    tableHeight: '485px',
    columns: [
      {
        title: '',
        field: 'action',
        className: 'text-center',
        slots: {
          default: ({ row }, h) => [
            this.generateInsertButton(row, h),
          ],
        },
      },
      {
        title: '字串樣板名稱',
        field: 'noticeSymbolName',
        width: '30%',
      },
      {
        title: '字串範例',
        field: 'noticeSymbolExample',
        width: '50%',
      },
    ],
  };

  allowUseSymbolFields = [
    this.$settingsEnum.columns.SUBJECT.value,
    this.$settingsEnum.columns.CONTENT.value,
  ]; // 可使用字串樣版的欄位

  showPreviewModal = false // [預覽彈窗] modal開關

  form = {
    ...this.formTemplate,
    selectedNoticeSymbolList: [],
  } // 表單

  formRules: { [key: string]: ValidationRule[] } = {} // 表單的驗證規則

  currentEditField = '' // 當前編輯的欄位id

  detail = {
    noticeSubject: '',
    noticeContent: '',
  } // 預覽

  /**
   * computed
   */
  // 是否顯示Modal
  get showModal() {
    return this.showAddAndEditModal;
  }

  // 標題
  get modalTitle() {
    return this.addAndEditInfo.actionType === this.$settingsEnum.constant.MODIFY.value
      ? this.$settingsEnum.constant.MODIFY.label
      : this.$settingsEnum.constant.ADD.label;
  }

  // 字串樣版選擇區塊是否顯示
  get showNoticeSymbol() {
    return this.dataGrid.data.length > 0;
  }

  /**
   * watch
   */
  @Watch('addAndEditInfo', { immediate: true, deep: true })
  onFormChange() {
    const isEdit = this.addAndEditInfo.actionType === this.$settingsEnum.constant.MODIFY.value;
    if (isEdit) {
      this.initEditForm();
    } else {
      // 新增時的可選字串樣板查詢後端所有可選的清單(編輯時會帶在表單裡面)
      this.searchAvailableNoticeSymbol();
    }
  }

  @Watch('currentEditField')
  onCurrentFieldChange() {
    const newColumnSetting = this.dataGrid.columns;
    newColumnSetting[0].slots = {
      default: ({ row }, h) => [
          this.generateInsertButton(row, h),
        ],
    };
    this.dataGrid.columns = [...newColumnSetting];
  }

  /**
   * hook
   */
  created() {
    this.resetForm();
  }

  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeAddAndEditModal;
  }

  /**
   * methods
   */
  // 重置表單狀態
  resetForm() {
    this.form = {
      ...this.formTemplate,
      selectedNoticeSymbolList: [],
    };
    this.currentEditField = '';
    // 清空編輯器undo和redo歷程
    getTinymce()?.activeEditor?.undoManager.clear();
    this.setRules();
  }

  // 設定編輯操作表單初始資料
  initEditForm() {
    this.form = {
      ...this.addAndEditInfo.formData,
    };
    this.dataGrid.data = [...this.addAndEditInfo.formData.selectedNoticeSymbolList];
    this.setRules();
    this.$nextTick(() => {
      (this.$refs.formRef as any).validate((valid) => valid);
    });
  }

  // 設定表單驗證規則
  setRules() {
    this.formRules = { ...this.formRuleSettings };
  }

  // 產生插入按鈕
  generateInsertButton(row, h) {
    return h(
      'a-button',
      {
        props: {
          type: 'primary',
          disabled: !this.allowUseSymbolFields.includes(this.currentEditField),
        },
        on: {
          click: () => { this.insertNoticeSymbolTemplate(row); },
        },
      },
      [
        h('a-icon', {
          props: {
            type: 'arrow-left',
          },
        }),
        '插入',
      ],
    );
  }

  // 取得可用內容樣板清單
  searchAvailableNoticeSymbol() {
    this.setLoading(true);
    this.$emailApi.searchAllNoticeSymbolUsingGET()
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        const gridData = content.map((data) => ({
          ...data,
          actionType: {
            value: 'primary',
          },
        }));
        this.dataGrid.data = [...gridData];
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 偵測編輯中的欄位
  detectFocus(field: string) {
    this.currentEditField = field;
  }

  // 插入內容樣板
  insertNoticeSymbolTemplate(symbol) {
    if (validateUtil.isEmpty(this.currentEditField)) {
      return;
    }
    const templateString = symbol.noticeSymbolTemplate;
    let filedName = '';
    if (this.currentEditField === this.$settingsEnum.columns.SUBJECT.value) {
      filedName = 'noticeSubject';
      // 抓取textarea滑鼠框起來的部分插入文字
      const startPosition = ((((this.$refs.subjectInput as any).$refs.resizableTextArea as any)).$refs.textArea as any).selectionStart;
      const endPosition = ((((this.$refs.subjectInput as any).$refs.resizableTextArea as any)).$refs.textArea as any).selectionEnd;
      const currentStringLength = this.form.noticeSubject.length;
      this.form.noticeSubject = this.form.noticeSubject.substring(0, startPosition) + templateString + this.form.noticeSubject.substring(endPosition, currentStringLength);
      (this.$refs.subjectInput as any).focus();
    }
    if (this.currentEditField === this.$settingsEnum.columns.CONTENT.value) {
      filedName = 'noticeContent';
      // 編輯器的插入字串
      getTinymce()?.activeEditor.insertContent(templateString);
      getTinymce()?.activeEditor.focus();
    }
    // 紀錄選過的樣板(去除重複後放回)
    const selectedNoticeSymbolList = new Set([...this.form.selectedNoticeSymbolList, symbol]);
    this.form.selectedNoticeSymbolList = Array.from(selectedNoticeSymbolList);
    // 由程式進行的變更輸入欄位無法偵測，所以手動驗證
    (this.$refs.formRef as any).validateField([filedName]);
  }

  // 確認並更新使用到的字串樣板
  checkAndUpdateSelectedNoticeSymbol() {
    const noticeSubject = this.form.noticeSubject;
    const noticeContent = this.form.noticeContent;
    const updatedList = [];
    this.form.selectedNoticeSymbolList.forEach((noticeSymbol) => {
      if (noticeSubject.includes(noticeSymbol.noticeSymbolTemplate) || noticeContent.includes(noticeSymbol.noticeSymbolTemplate)) {
        updatedList.push(noticeSymbol);
      }
    });
    this.form.selectedNoticeSymbolList = [...updatedList];
  }

  // 開啟預覽彈窗
  openPreviewModal() {
    this.detail = this.$noticeService.replaceSymbol(this.form, 'noticeSymbolExample');
    this.showPreviewModal = true;
  }

  // 關閉預覽彈窗
  closePreviewModal() {
    this.showPreviewModal = false;
  }

  // 送出
  submit() {
    if (!this.validateAllRequireColumn() || !this.validateLength()) {
      (this.$refs.formRef as any).validate((valid) => valid);
      return;
    }
    // 送出整理資料前更新樣板使用清單
    if (this.addAndEditInfo.actionType === this.$settingsEnum.constant.ADD.value) {
      // 新增送出會重新確認內容和標題中是否有使用到對應的字串樣板
      this.checkAndUpdateSelectedNoticeSymbol();
      this.addInfo();
    }
    if (this.addAndEditInfo.actionType === this.$settingsEnum.constant.MODIFY.value) {
      // 編輯不進行字串樣板過濾(因為新增時有選或預設有就代表後端程式會放入對應字串)
      this.editInfo();
    }
  }

  // 新增通知版型
  addInfo() {
    const dto = {
      templateName: this.form.templateName,
      noticeSubject: this.form.noticeSubject,
      noticeContent: this.form.noticeContent,
      noticeKind: this.noticeKind,
      noticeSymbolIdList: this.form.selectedNoticeSymbolList.map((noticeSymbol) => noticeSymbol.noticeSymbolId),
    };
    this.$emailApi.addNoticeTemplateUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        this.resetForm();
        // 關閉modal
        this.closeAddAndEditModal(null);
        // 重新查詢
        this.$emit('handleSearch');
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 編輯通知版型
  editInfo() {
    const dto = {
      noticeTemplateId: this.form.noticeTemplateId,
      templateName: this.form.templateName,
      noticeSubject: this.form.noticeSubject,
      noticeContent: this.form.noticeContent,
      noticeKind: this.noticeKind,
      noticeSymbolIdList: this.form.selectedNoticeSymbolList.map((noticeSymbol) => noticeSymbol.noticeSymbolId),
    };
    this.$emailApi.modifyNoticeTemplateUsingPOST(dto)
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }
        this.$message.success(message, 10);
        this.resetForm();
        // 關閉modal
        this.closeAddAndEditModal(null);
        // 重新查詢
        this.$emit('handleSearch');
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 關閉modal
  closeAddAndEditModal(action) {
    this.$nextTick(() => {
      (this.$refs.formRef as any).clearValidate();
    });

    if (validateUtil.isEmpty(action)) {
      this.resetForm();
      this.$emit('closeAddAndEditModal');
      return;
    }

    InfoModal.alertInfo({
      confirm: true,
      content: this.$commonMessageEnum.CLOSE_MODAL_CONFIRM_INFO?.message,
      onCallback: () => {
        this.resetForm();
        this.$emit('closeAddAndEditModal');
      },
    });
  }

  // 內容驗證(僅驗證是否為空)
  validateContent() {
    (this.$refs.formRef as any).validateField(['noticeContent']);
  }

  // 驗證所有必填欄位(送出前)
  validateAllRequireColumn() {
    const isValid = !(validateUtil.isEmpty(this.form.templateName)
      || validateUtil.isEmpty(this.form.noticeSubject)
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
    const isValid = !(this.form.templateName.length > 50 || this.form.noticeSubject.length > 200);
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
