import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';

import UploadDragger from '@/components/shared/file-upload/UploadDragger.vue';
import { UploadModel } from '@/components/shared/file-upload/UploadDraggerModel';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';

@Component({
  components: {
    UploadDragger,
    IpkButton,
  },
})
export default class UploadCompareReportModal extends Vue {
  /**
  * props
  */
  @Prop()
  modalShow: boolean // modal開關

  /**
  * data
  */
  modalVisible = false; // modal開關

  fileList = {
    bony: [],
    citi: [],
    jpm: [],
  }

  fileUploadData: UploadModel = {
    multiple: false, // 是否可上傳多筆檔案
    acceptFileType: '.xlsx', // 可上傳的檔案類型
    acceptType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    uploadDisabled: false,
    showRemoveIcon: true,
    showDownload: true,
  }

  /**
  * computed
  */
  // 未上傳檔案禁止送出
  get submitDisabled() {
    let disabled = false;
    if (this.isEmpty(this.fileList.bony) && this.isEmpty(this.fileList.citi) && this.isEmpty(this.fileList.jpm)) {
      disabled = true;
    }
    return disabled;
  }

  /**
  * watch
  */
  @Watch('modalShow')
  onChange(val) {
    this.modalVisible = val;
  }

  /**
  * methods
  */
 // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  closeModal() {
    this.$emit('closeModal');

    this.fileList = {
      bony: [],
      citi: [],
      jpm: [],
    };
  }

  // 上傳change事件
  handleChange(info, type): void {
    if (info.file.status === 'removed') {
      this.fileList[type] = [];
      return;
    }
    if (info.fileList.length > 1) {
      this.fileList[type] = [...info.fileList.slice(-1)];
    } else {
      this.fileList[type] = [info.fileList[0]];
    }
  }

  // 刪除上傳附件
  deleteUpload(file, type) {
    this.fileList[type] = this.fileList[type].filter((el) => el.uid !== file.uid);
  }

  // 儲存
  submit() {
    // InfoModal.alertInfo({
    //   confirm: true,
    //   content: this.$cfMessageEnum.MANAGE_FILE_SAVE_CONFIRM_INFO?.message,
    //   onCallback: () => {
    //     this.saveDetail();
    //   },
    // });
    this.saveDetail();
  }

  // API: 24.上傳庫存比對報表
  saveDetail() {
    // const dto = Object.keys(this.fileList).map((type) => ({ [type]: this.fileList[type].length > 0 }));
    let dto: any = {};
    let attachmentInfo = Object.values(this.fileList);
    attachmentInfo = attachmentInfo.map((e) => (
      e = e.length > 0 ? e[0] : 'empty'
    ));
    Object.entries(this.fileList).forEach(([key, value], index) => {
      dto[key] = value.length > 0;
    });

    // 整理儲存後端所需格式
    this.$axios.axiosPatch(
      `${process.env.VUE_APP_API_BASE_URL}/api/foreign-bond-nonstructure/uploadCompareReport`, 'foreignBondNonStructureUploadCompareReportDto', dto, 'multipartfiles', attachmentInfo,
      // 成功後要執行的流程 successCallBack
      () => {
        this.fileList = {
          bony: [],
          citi: [],
          jpm: [],
        };
      },
    );
  }
}
