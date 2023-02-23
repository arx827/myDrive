import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';
import validateUtil from '@/plugins/util/validateUtil';
import axios from 'axios';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    Breadcrumb,
    UploadDragger,
    IpkButton,
  },
})
export default class UploadPage extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  showModalFlag = false; // 是否顯示上傳modal

  fileList = []; // 上傳的資料

  fileUploadStatus = ''; // 判斷excel錯誤樣式

  fileUploadData: UploadModel = {
    multiple: false, // 是否可上傳多筆檔案
    acceptFileType: '.xls, .xlsx', // 可上傳的檔案類型
    acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    acceptFileSize: 5, // 可上傳的檔案大小(MB)
    showRemoveIcon: true,
  }

  exportUploadColumns = [ // [匯出下載錯誤訊息資訊] 表頭
    { label: '投組代碼', field: 'tranPortfolioCode' },
    { label: '帳本別', field: 'kbCode' },
    { label: '資產區隔代碼', field: 'portfolioCode' },
    { label: '自操/委外', field: 'outsourcingCode' },
    { label: '生效起日', field: 'effectStartDatec' },
    { label: '錯誤訊息', field: 'message' },
  ]

  exportUploadData = [ // [匯出下載錯誤訊息資訊] 內容
    {
      tranPortfolioCode: 'ANN_IH',
      kbCode: '1',
      portfolioCode: 'ANNUITY',
      outsourcingCode: 'B',
      effectStartDatec: moment('20220910').format('YYYY/MM/DD'),
      message: null,
    },
  ]

  exportFileName = '錯誤訊息回覆'

  /**
  * methods
  */
  // 開啟上傳燈箱
  openUploadModal() {
    this.showModalFlag = true;
  }

  // 關閉上傳燈箱
  closeUploadModal() {
    this.fileUploadStatus = '';
    this.fileList = [];
    this.showModalFlag = false;
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
    if (validateUtil.isEmpty(this.fileList)) {
      return;
    }
    this.setLoading(true);
    let fileObj = this.fileList[0].originFileObj ? this.fileList[0].originFileObj : this.fileList[0];

    // 測試網址區塊，請自行更換自己的API
    let mockUrlSuccess = 'https://run.mocky.io/v3/edd8d17c-7289-4646-9f75-375fe210b6ba';
    let mockUrlFail = 'https://run.mocky.io/v3/2af322e6-0258-4082-a289-3a69956eceb8';
    let mockUrlList = [mockUrlSuccess, mockUrlFail];
    const shuffleArray = mockUrlList[Math.floor(Math.random() * mockUrlList.length)];
    // 以下請自行更換自己的API
    axios.post(shuffleArray, { file: fileObj })
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

  // 下載寫入檢核訊息的錯誤檔案
  downloadErrorFile() {
    //
  }
 }
