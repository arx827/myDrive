<template>
  <div class="container">
    <div class="page__title">
      建立人因危害資料
    </div>
    <div class="upload__block">
      <div class="upload__block__title">
        上傳檔案
      </div>
      <div class="upload__block__subtitle">
        檔案大小限不超過3MB，限定 Excel 格式。
      </div>
      <a-upload
        name="Data"
        accept=".xlsx, .xls"
        :custom-request="uploadFlie"
        :file-list="uploadedFileList"
        :before-upload="beforeUpload"
        @change="handleDataChange"
      >
        <button class="upload__block__btn">
          選擇檔案
        </button>
      </a-upload>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary"
        @click="goUpload()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: {} })
export default class BuildOverTimeIndex extends Vue {
  @Action('setLoading') setLoading;

  file = null;

  uploadedFileList = [] // uploadNightData列表

  goUpload() {
  	if (this.beforeUpload) {
  		this.fetchUpload();
  	}
  }

  uploadFlie(options) {
  	this.uploadedFileList = this.$blobUtils.updateFileList(options.file, options.name, this.uploadedFileList, false);
  	this.file = options.file;
  }

  handleDataChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList;
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}
  	console.log('uploadedFileList', this.uploadedFileList);
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	this.resetFile();
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		'.xls,.xlsx',
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		InfoModal.alertError({ content: '檔案格式錯誤，無法進行上傳。請將原檔案格式修正完成後，再次上傳。' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  resetFile() {
  	this.uploadedFileList = [];
  }

  // API: 上傳人因性危害資料
  fetchUpload() {
  	this.setLoading(true);
  	this.$HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApi.upLoadExcelToHfeUsingPOST(this.file)
    	.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status === 200) {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'BuildDataResult',
  					query: {
  						respData: resp.data.data,
  					},
  				});
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			// TEST:
  			// console.log('error status = ', error);
  			notification.error({ content: '上傳失敗' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
  .upload__block {
    background-color: #F4F8FC;
    padding-top: 20px;
    padding-bottom: 30px;
    border-radius: 4px;
    text-align: center;
    .upload__block__title {
      font-size: 16px;
      margin-bottom: 5px;
      font-weight: $TEXT_BOLD;
    }
    .upload__block__subtitle {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .upload__block__btn {
      background-color: $COLOR-MAIN13;
      color: $COLOR-WHITE;
      font-weight: $TEXT-BOLD;
      border-radius: 4px;
      padding: 9px 33px;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }
    .btn__wrap {
      margin-bottom: 40px;
      button {
        width: 200px;
        max-width: 100%;
      }
    }
  }
  ::v-deep {
    .ant-upload-list-item {
      margin: auto;
      margin-top: 8px;
      max-width: 300px;
    }
  }
</style>
