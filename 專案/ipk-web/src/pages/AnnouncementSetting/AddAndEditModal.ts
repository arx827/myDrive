import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import { Action } from 'vuex-class';
import BasicTinyEditor from '@/components/shared/editor/BasicTinyEditor.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import validateUtil from '@/plugins/util/validateUtil';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/plugins/notification/infoModal';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import { getTinymce } from '@tinymce/tinymce-vue/lib/cjs/main/ts/TinyMCE';
import transferUtil from '@/plugins/util/transferUtil';
import exportUtil from '@/plugins/util/exportUtil';
import axios from 'axios';

interface FormInfo {
  actionType: string; // 操作類型
  formData: any; // 表單資訊
}

@Component({
  components: {
    BasicTinyEditor,
    UploadDragger,
    IpkButton,
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
  // TODO: 修改訊息
  // TODO: 失效日?生效日?
  alertSettings = { // 警告彈窗設定
    // REQUIRE: { title: '必填欄位尚未填寫', alertContent: '${this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message}' },
		BEFORE_TODAY: { title: '選取日期有誤', alertContent: '日期不得早於今天。' },
    EXPIRY_BEFORE_EFFECT: { title: '選取日期有誤', alertContent: '失效日不得早於生效日。' },
    EFFECT_AFTER_EXPIRY: { title: '選取日期有誤', alertContent: '生效日必須早於失效日。' },
    // CLOSE: { title: '提醒', alertContent: '是否確定關閉表單？' },
    // API_FAIL: { title: '', alertContent: this.$commonMessageEnum.SYSTEM_ERROR?.message },
	}

  formTemplate = {
    id: null,
    title: '',
    content: '',
    attachment: [], // 上傳的附件清單(File)
    documentNum: '',
    publishDate: undefined,
    effectDate: undefined,
    expiryDate: undefined,
    type: null,
  }

  formRuleSettings = { // 表單內容驗證設定
    title: [
      { required: true, message: '請輸入標題' },
      { max: 200, message: '不可超過200個字' },
    ],
    content: [{ required: true, message: '請輸入內文' }],
    attachment: [], // 附件驗證由檔案上傳元件處理
    documentNum: [{ max: 100, message: '不可超過100個字' }],
    publishDate: [{ required: true, validator: this.validatePublishDate }],
    effectDate: [{ required: true, validator: this.validateEffectDate }],
    expiryDate: [{ validator: this.validateExpiryDate }],
    type: [{ required: true, validator: this.validateAnnouncementType }],
  }

  fileUploadDataSettings: UploadModel = {
    multiple: true, // 是否可上傳多筆檔案
    acceptFileType: '.doc, .docx, .xls, .xlsx, .pdf', // 可上傳的檔案類型
    acceptType: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/pdf',
    ],
    acceptFileSize: 5, // 可上傳的檔案大小(MB)
    showRemoveIcon: true, // 是否顯示移除icon
    showDownload: true,
  }

  fileUploadStatus = ''; // 檔案上傳狀態

  form = {
    ...this.formTemplate,
  } // 表單

  deletedAttachment = []; // 刪除的附件清單(id)

  formRules: {[key: string]: ValidationRule[]} = {} // 表單的驗證規則

  typeOptions = []; // 公告類型選項

  /**
   * computed
   */
  // 是否顯示Modal(因效能問題 原用watch改computed)
  get showModal() {
    return this.showAddAndEditModal;
  }

  // 標題
  get modalTitle() {
    return this.addAndEditInfo.actionType === this.$settingsEnum.constant.MODIFY.value
      ? this.$settingsEnum.constant.MODIFY.label
      : this.$settingsEnum.constant.ADD.label;
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
      this.resetForm();
    }
  }

  /**
   * hook
   */
  created() {
    this.resetForm();
    this.searchAnnouncementTypeOption();
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
      attachment: [],
    };
    this.deletedAttachment = [];
    getTinymce()?.activeEditor?.undoManager?.clear();
    this.setRules();
  }

  // 設定編輯操作表單初始資料
  initEditForm() {
    this.form = {
      ...this.addAndEditInfo.formData,
      deletedAttachment: [],
    };
    this.setRules();
    this.$nextTick(() => {
      (this.$refs.formRef as any).validate((valid) => valid);
    });
  }

  // 設定表單驗證規則
  setRules() {
    this.formRules = { ...this.formRuleSettings };
  }

  // 取得公告類型選項
  searchAnnouncementTypeOption() {
    this.setLoading(true);
    this.$announcementApi.searchAnnouncementTypeUsingGET()
      .then((res) => {
        const isSuccess = res.data.success;
        const message = res.data.message;
        const content = res.data.content;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.typeOptions = content.map((type) => ({
            label: type.typeName,
            value: type.typeCode,
          }));
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 上傳change事件
  handleChange(info) {
    // 移除不合規的檔案(在beforeUpload方法裡status被設為removed的檔案)
    info.fileList.forEach((item, index, arr) => {
      if (item.status === 'removed') {
          arr.splice(index, 1);
      }
    });
    // 單筆上傳會進入的流程
    if (!this.fileUploadDataSettings.multiple) {
      this.fileUploadStatus = '';
      this.form.attachment = info.fileList.slice(-1);
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.form.attachment.push(info.file);
    }
  }

  // 刪除檔案
  deleteFile(file) {
    const deleteFileIndex = this.form.attachment.findIndex((attachment) => attachment.uid === file.uid);
    const deleteTarget = this.form.attachment.splice(deleteFileIndex, 1)[0];
    // 編輯時既有的檔案會用給uid(id * -1)和檔名的方式產出File物件，所以不會有實際內容
    // 因此若size為0代表為已經在後端存下來的檔案，需要被刪除
    if (deleteTarget.size) {
      return;
    }
    this.deletedAttachment = [...this.deletedAttachment, deleteTarget.uid * -1];
  }

  // 附件下載
  handleDownload(file) {
    this.setLoading(true);
    const fileFullName = file.name;
    const extDotIndex = fileFullName.lastIndexOf('.');
    const fileName = fileFullName.substring(0, extDotIndex);
    const ext = transferUtil.getFileExt(fileFullName);
    const attachmentId = file.uid * -1;
    this.$announcementApi.downloadAttachmentUsingGET(this.form.id, attachmentId, { responseType: 'blob' })
      .then((res) => {
        exportUtil.dealDownloadData(res.data, fileName, ext);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 送出
  submit() {
    if (!this.validateAllRequireColumn() || !this.validateDate()) {
      (this.$refs.formRef as any).validate((valid) => valid);
      return;
    }
    if (this.addAndEditInfo.actionType === this.$settingsEnum.constant.ADD.value) {
      this.addAnnouncement();
    }
    if (this.addAndEditInfo.actionType === this.$settingsEnum.constant.MODIFY.value) {
      this.editAnnouncement();
    }
  }

  // 新增公告
  addAnnouncement() {
    let formData = this.convertFormToFormData();
    this.setLoading(true);
    axios
      .post(`${process.env.VUE_APP_API_BASE_URL}/api/announcement/addAnnouncement`, formData)
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
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 編輯公告
  editAnnouncement() {
    let formData = this.convertFormToFormData();
    this.setLoading(true);
    axios
      .post(`${process.env.VUE_APP_API_BASE_URL}/api/announcement/modifyAnnouncement`, formData)
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
        // 重新查詢
        this.$emit('handleSearch');
        this.resetForm();
      })
      .catch(() => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
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
    (this.$refs.formRef as any).validateField(['content']);
  }

  // 發佈日驗證
  validatePublishDate(rule, value, callback) {
    // 欄位必填
    if (!value) {
      return callback('請輸入發佈日');
    }
    // 發佈日不得早於今日
    const today = moment(moment().format('YYYYMMDD'));
    const publishDate = moment(moment(value).format('YYYYMMDD'));
    if (publishDate.isBefore(today)) {
      return callback('發佈日不得早於今日');
    }
    return callback();
  }

  // 生效日驗證
  validateEffectDate(rule, value, callback) {
    // 欄位必填
    if (!value) {
      return callback('請輸入生效日');
    }
    const effectDate = moment(moment(value).format('YYYYMMDD'));
    // 發佈日不得晚於到期日
    if (!validateUtil.isEmpty(this.form.expiryDate)) {
      const expiryDate = moment(moment(this.form.expiryDate).format('YYYYMMDD'));
      if (effectDate.isAfter(expiryDate)) {
        return callback('生效日不得晚於到期日');
      }
      (this.$refs.formRef as any).validateField(['expiryDate']);
    }
    return callback();
  }

  // 失效日驗證
  validateExpiryDate(rule, value, callback) {
    const expiryDate = moment(moment(value).format('YYYYMMDD'));
    // 失效日不得早於生效日
    if (!validateUtil.isEmpty(this.form.effectDate)) {
      const effectDate = moment(moment(this.form.effectDate).format('YYYYMMDD'));
      if (expiryDate.isBefore(effectDate)) {
        return callback('失效日不得早於生效日');
      }
      (this.$refs.formRef as any).validateField(['effectDate']);
    }
    return callback();
  }

  // 公告類型驗證
  validateAnnouncementType(rule, value, callback) {
      if (!value) {
        return callback('請選擇公告類型');
      }
      const option = this.typeOptions.filter((option) => option.value === value);
      if (!option.length) {
        return callback('非合法公告類型');
      }
      return callback();
  }

  // 驗證所有必填欄位(送出前)
  validateAllRequireColumn() {
    const isValid = !(validateUtil.isEmpty(this.form.title)
      || validateUtil.isEmpty(this.form.content)
      || validateUtil.isEmpty(this.form.publishDate)
      || validateUtil.isEmpty(this.form.effectDate)
      || validateUtil.isEmpty(this.form.type));
    if (!isValid) {
      InfoModal.alertInfo({
        confirm: false,
        content: this.$otherMsgEnumData.SUBMIT_REQUIRED_VALIDATE_INFO?.message,
      });
    }
    return isValid;
  }

  // 驗證日期(送出前)
  validateDate() {
    const publishDate = moment(moment(this.form.publishDate).format('YYYYMMDD'));
    const today = moment(moment().format('YYYYMMDD'));
    if (publishDate.isBefore(today)) {
      InfoModal.alertInfo({
        title: this.alertSettings.BEFORE_TODAY.title,
        confirm: false,
        content: this.alertSettings.BEFORE_TODAY.alertContent,
      });
      return false;
    }
    // 沒有選失效日期不進行後續驗證
    if (!this.form.effectDate) {
      return true;
    }
    const effectDate = moment(moment(this.form.effectDate).format('YYYYMMDD'));
    const expiryDate = moment(moment(this.form.expiryDate).format('YYYYMMDD'));
    if (effectDate.isAfter(expiryDate)) {
      InfoModal.alertInfo({
        title: this.alertSettings.EFFECT_AFTER_EXPIRY.title,
        confirm: false,
        content: this.alertSettings.EFFECT_AFTER_EXPIRY.alertContent,
      });
      return false;
    }
    if (expiryDate.isBefore(effectDate)) {
      InfoModal.alertInfo({
        title: this.alertSettings.EXPIRY_BEFORE_EFFECT.title,
        confirm: false,
        content: this.alertSettings.EXPIRY_BEFORE_EFFECT.alertContent,
      });
      return false;
    }
    return true;
  }

  // 轉換表單為後端格式(因有檔案上傳轉換為FormData)
  convertFormToFormData() {
    const formData = new FormData();
    if (this.form.id) {
      formData.append('announcementId', this.form.id);
    }
    formData.append('announcementTitle', this.form.title);
    formData.append('announcementContent', this.form.content);
    formData.append('announcementPublishDate', this.form.publishDate);
    formData.append('announcementEffectDate', this.form.effectDate);
    if (this.form.expiryDate) {
      formData.append('announcementExpiryDate', this.form.expiryDate);
    }
    formData.append('announcementType', this.form.type);
    formData.append('announcementDocumentNo', this.form.documentNum);
    let addAttachmentCount = 0;
    for (let i = 0; i < this.form.attachment.length; i++) {
      // 檔案大小為0的是已經在DB的檔案，因此新增時只拿畫面上上傳(size>0)的檔案
      if (this.form.attachment[i].size > 0) {
        formData.append(`attachmentList[${addAttachmentCount}]`, this.form.attachment[i]);
        addAttachmentCount++;
      }
    }
    for (let i = 0; i < this.deletedAttachment.length; i++) {
      formData.append(`deletedAttachmentList[${i}]`, this.deletedAttachment[i]);
    }
    return formData;
  }
}
