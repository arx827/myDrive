import {
  Vue, Component, Prop, Watch,
 } from 'vue-property-decorator';
 import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
 import InfoModal from '@/plugins/notification/infoModal';
 import validateUtil from '@/plugins/util/validateUtil';

@Component
export default class UploadDragger extends Vue {
  /**
  * props
  */
  // 顯示上傳燈箱flag
  @Prop()
  showModal: boolean; // modalVisible

  // 上傳檔案的規格&配置
  @Prop()
  fileUploadData: UploadModel;

  // 檔案上傳狀態
  @Prop()
  fileUploadStatus: string;

  // 檔案列表
  @Prop()
  fileList: Array<any>;

  /**
  * data
  */
  // 顯示上傳燈箱flag
  showModalFlag = false;

  // 檔案列表
  fileUploadList = []

  // 檔案上傳狀態
  fileStatus = ''

  // 給size檢驗區塊用的function呼叫次數計算
  sizeCount = 0

  // 給type檢驗區塊用的function呼叫次數計算
  typeCount = 0

  // 不合格式的檔案list
  invalidTypeList = []

  // 不合size的檔案list
  invalidSizeList = []

  /**
  * watch
  */
  @Watch('showModal')
  onChanged(newValue: boolean) {
      this.showModalFlag = newValue;
  }

  @Watch('fileUploadStatus', { immediate: true, deep: true })
  onUploadChanged(newValue) {
    this.fileStatus = newValue;
  }

  @Watch('fileList', { immediate: true, deep: true })
  onListChanged(newValue) {
    this.fileUploadList = newValue;
    if (!this.isEmpty(this.fileUploadList)) {
      this.fileUploadList.forEach((file) => {
        file.status = file.status ? file.status : 'done';
      });
    }
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 拖曳進上傳區塊的不合格式的檔案會進入此方法
  rejectInvalidTypeFile(fileList) {
    // 驗證格式
    let fileNameList = [];
    fileList.forEach((file) => {
      file.status = 'removed';
      fileNameList.push(`\r\n${file.name}`);
    });
    InfoModal.alertError({
      title: '資料上傳有誤',
      confirm: false,
      content: `檔案：${fileNameList}\r\n檔案格式須為${this.fileUploadData.acceptFileType.replaceAll('.', '')}，請確認，謝謝。`,
      customContent: null,
    });
  }

  // 上傳前檢核檔案 (ant design上傳元件如要使用自定義的上傳方法，都要return false讓後續自動的動作停止)
  // 會進入此方法的情境： 拖曳檔案/點擊上傳區塊自選檔案。(拖曳不合格式的檔案不會進入此方法)
  beforeUpload(file, fileList) {
    this.sizeCount++;
    this.typeCount++;

    if (validateUtil.isEmpty(file)) {
      return false;
    }

    // 驗證格式
    if (!validateUtil.isEmpty(this.fileUploadData.acceptType)) {
      if (this.fileUploadData.acceptType.indexOf(file.type) === -1) {
        file.status = 'removed';
        this.invalidTypeList.push(`\r\n${file.name}`);
      }
    }

    // 驗證大小
    if (!validateUtil.isEmpty(this.fileUploadData.acceptFileSize)) {
      const fileSize = file.size / 1024 / 1024;
      if (fileSize > this.fileUploadData.acceptFileSize) {
        file.status = 'removed';
        this.invalidSizeList.push(`\r\n${file.name}`);
      }
    }

    // 跳檔案格式錯誤訊息
    if (this.typeCount === fileList.length) {
      if (this.invalidTypeList.length > 0) {
        InfoModal.alertError({
          title: '資料上傳有誤',
          confirm: false,
          content: `檔案：${this.invalidTypeList}\r\n檔案格式須為${this.fileUploadData.acceptFileType.replaceAll('.', '')}，請確認，謝謝。`,
          customContent: null,
        });
      }
      this.invalidTypeList = [];
      this.typeCount = 0;
    }

    // 跳檔案大小錯誤訊息
    if (this.sizeCount === fileList.length) {
      if (this.invalidSizeList.length > 0) {
        InfoModal.alertError({
          title: `檔案大小超過${this.fileUploadData.acceptFileSize}MB`,
          confirm: false,
          content: `檔案：${this.invalidSizeList}\r\n檔案大小超過${this.fileUploadData.acceptFileSize}MB，請確認檔案大小，謝謝。`,
          customContent: null,
        });
      }
      this.sizeCount = 0;
      this.invalidSizeList = [];
    }
    return false;
  }

  // 符合條件的文件，改變文件狀態
  handleChange(info) {
    this.$emit('handleChange', info);
  }

  // 下載檔案
  handleDownload(file) {
    this.$emit('handleDownload', file);
  }

  // 移除檔案
  deleteFile(file) {
    this.$emit('deleteFile', file);
  }
}
