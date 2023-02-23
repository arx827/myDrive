import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import CustomizationModal from '@/components/shared/modal/CustomizationModal/CustomizationModal.vue';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    CustomizationModal,
    UploadDragger,
    IpkButton,
  },
})
export default class GeneralLedgerImportInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  modalCustomizationShow = false; // [下載錯誤訊息] modal開關

  errorContent = ''; // [下載錯誤訊息] 內容

  showSubmitFileBtn = false; // 是否顯示送審檔案按鈕

  serialNo = undefined; // [匯出下載錯誤訊息資訊] 流水號

  fileList = []; // 上傳的資料

  fileUploadStatus = ''; // 判斷excel錯誤樣式

  fileUploadData: UploadModel = {
    multiple: false, // 是否可上傳多筆檔案
    acceptFileType: '.xls, .xlsx', // 可上傳的檔案類型
    acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    acceptFileSize: 5, // 可上傳的檔案大小(MB)
    showRemoveIcon: true,
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data: any) {
    return validateUtil.isEmpty(data);
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
    if (!this.fileUploadData.multiple) {
      this.fileUploadStatus = '';
      if (info.fileList.length > 1) {
        this.fileList = [...info.fileList.slice(-1)];// 限制只上傳一個文件
      } else {
        this.fileList = [info.fileList[0]];
      }
      return;
    }
    // 多筆上傳會進入的流程
    if (info.file.status !== 'removed') {
      this.fileList.push(info.file);
    }
  }

  // 確認上傳檔案
  uploadFile() {
    if (this.isEmpty(this.fileList)) {
      return;
    }
    this.setLoading(true);
    let fileObj = this.fileList[0].originFileObj ? this.fileList[0].originFileObj : this.fileList[0];
    this.$generalLedgerApi.uploadImportGeneralLedgerUsingPOST(fileObj)
    .then((res) => {
      const content = res.data.content;
      const isSuccess = res.data.success;
      const message = res.data.message;

      if (!isSuccess) {
        // 如果上傳的檔案格式不對
        if (content.failedCount === 0) {
          const alertMessage = res.data.content.failedReason;
          InfoModal.alertError({
            title: message,
            confirm: false,
            content: `檔案：\r\n${fileObj.name}\r\n ${alertMessage}`,
          });
          fileObj.status = 'error';
          this.$set(this.fileList, 0, fileObj);
          return;
        }
        // 如果上傳的檔案格式無誤但是其中幾筆有問題
        const errorMessage = `檔案：\r\n${fileObj.name}\r\n 您上傳的資料有誤，可點擊"下載"檢視錯誤訊息。\r\n * 檢核正確：${res.data.content.successfulCount}\r\n * 檢核錯誤：${res.data.content.failedCount}`;
        InfoModal.alertError({
          title: message,
          confirm: false,
          content: errorMessage,
        });
        fileObj.status = 'download';
        this.fileUploadStatus = 'download';
        this.$set(this.fileList, 0, fileObj);
        this.serialNo = content.serialNo;
        this.errorContent = errorMessage;
        this.modalCustomizationShow = true;
        return;
      }

      // 成功
      const successMessage = `檔案：\r\n${fileObj.name}\r\n * 檢核正確：${res.data.content.successfulCount}`;
      InfoModal.alertSuccess({
        title: message,
        confirm: false,
        content: successMessage,
      });
      fileObj.status = 'done';
      this.$set(this.fileList, 0, fileObj);
      this.fileList = [];
      // 查詢
      this.$emit('handleSearch', true);
    })
    .catch(() => {
      fileObj.status = 'error';
      this.$set(this.fileList, 0, fileObj);
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 移除檔案
  deleteFile(e) {
    this.fileList = this.fileList.filter((el) => el.uid !== e.uid);
  }

  // 下載錯誤excel
  async downloadFile() {
    this.setLoading(true);
    const fileName = '部位系統介接總帳系統_上傳檔錯誤訊息回覆';
    await this.$actCommon.downloadErrorExcelUsingPOST(this.serialNo, fileName).finally(() => {
      this.setLoading(false);
    });
  }
}
