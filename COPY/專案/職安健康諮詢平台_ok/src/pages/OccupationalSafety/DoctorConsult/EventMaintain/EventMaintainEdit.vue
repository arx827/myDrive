<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          編輯活動資訊
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block">
          <div class="block__title">
            活動EDM Banner
          </div>
          <div class="block__content">
            <a-upload-dragger
              name="file"
              accept="image/jpeg, image/png, image/gif,"
              :file-list="uploadedFileList"
              :custom-request="uploadFlie"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                選擇欲上傳資料：點擊或將文件拖曳到這裡上傳
              </p>
              <p class="ant-upload-hint">
                最佳尺寸建議：寬1088＊高285，每張大小限制不超過3MB，限上傳 jpg、png、gif 格式。
              </p>
            </a-upload-dragger>
            <img
              class="img-fluid mt-3"
              :src="imgData"
            >
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            活動說明
          </div>
          <div class="block__content">
            <vue-editor
              v-model="description"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            預約規範
          </div>
          <div class="block__content">
            <vue-editor
              v-model="appointmentSpec"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
        <div class="event__block">
          <div class="block__title">
            個資聲明
          </div>
          <div class="block__content">
            <vue-editor
              v-model="personalInfoStatement"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="btn__wrap text-center">
        <router-link :to="'/occupationSafety/PhyConsult/eventMaintain/index'">
          <button class="btn__radius--primary--outline mb-2">
            取消
          </button>
        </router-link>
        <button
          class="btn__radius--primary mb-2"
          @click="submit"
        >
          確定
        </button>
        <button
          class="btn__view btn__radius--primary--outline float-end mb-2"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          預覽
        </button>
      </div>
    </div>
    <EventModal
      :pic="imgData"
      :description="description"
      :appointment-spec="appointmentSpec"
      :personal-info-statement="personalInfoStatement"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';
import { PhyConsultConfigRpnModel } from '@fubonlife/oss-api-axios-sdk';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import InfoModal from '@/plugins/notification/infoModal';
import EventModal from '@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainModal.vue';
import notification from '@/plugins/notification/infoNotification';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

require('bootstrap/js/dist/modal');

@Component({ components: { VueEditor, EventModal } })
export default class DoctorConsultIndex extends Vue {
  @Action('setLoading') setLoading;

  description: any = null // 活動說明

  appointmentSpec: any = null // 預約規範

  personalInfoStatement: any = null // 個資聲明

  imgData = null // banner圖網址

  uploadedFileList = [] // upload列表

  originImage = null // 原始banner

  fileName = null

  filePath = null

  uploadSuccess = true

  files = null;

  customToolbar = [
  	[{ header: [1, 2, 3, 4, 5, 6, false] }],
  	[{ color: [] }, { background: [] }],
  	['bold', 'italic', 'underline', 'strike'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[{ align: [] }],
  	['link'],
  	['clean'],
  ] // 文字編輯器設定

  resetFile() {
  	this.uploadedFileList = [];
  	this.imgData = null;
  	this.fileName = null;
  	this.filePath = null;
  }

  async handleChange(e) {
  	this.resetFile();
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList.slice(-1);
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

  	if (this.uploadedFileList[0]) {
  		const el = this.uploadedFileList[0].originFileObj;
  		const reader = new FileReader();
  		reader.onload = (e) => {
  			const img = new Image();
  			img.src = reader.result.toString();
  			img.onload = () => {
  			// setTimeout(() => {
  				this.imgData = this.onLoadImage(img);
  			// });
  			};
  		};
  		reader.readAsDataURL(el);
  	}
  	console.log(this.uploadedFileList);
  }

  uploadFlie(options) {
  	console.log(options.file);
  	if (this.beforeUpload) {
  	  this.uploadImg(options.file);
  	}
  }

  onLoadImage(img) {
  	let dataURL = '';
  	const canvas = document.createElement('canvas');
  	const maxWidth = 1088;
  	let zoomRatio = 1;
  	let width = img.width;
  	/** 圖片壓縮 */
  	if (width >= maxWidth) {
  		zoomRatio = maxWidth / width;
  		width = maxWidth;
  	}
  	const height = img.height * zoomRatio;

  	canvas.width = width;
  	canvas.height = height;
  	canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  	dataURL = canvas.toDataURL('image/jpeg');
  	console.log(width);
  	return dataURL;
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		'.jpg, .png, .gif,',
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		InfoModal.alertError({ content: '限上傳 jpg、png、gif 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  uploadImg(file) {
  	this.files = file;
  	// this.setLoading(true);
  	// this.$PCRRpnPortalApi.uploadPhyConsultConfigPictureUsingPOST(file)
  	// 	.then((resp) => {
  	// 		console.log(resp.data);
  	// 		this.fileName = resp.data.data.fileName;
  	// 		this.filePath = resp.data.data.filePath;
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // 將base64轉成file格式
  dataURLtoFile(dataurl, filename) {
  	const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  	const bstr = atob(arr[1]); let n = bstr.length; const
  		u8arr = new Uint8Array(n);
  	while (n--) {
  		u8arr[n] = bstr.charCodeAt(n);
  	}
  	return new File([u8arr], filename, { type: mime });
  }

  created() {
  	const query = this.$global.getQuery();
  	this.description = query.description;
  	this.appointmentSpec = query.appointmentSpec;
  	this.personalInfoStatement = query.personalInfoStatement;
  	if (!query.edmBannerPath) return;
  	this.imgData = query.edmBannerPath;
  	this.originImage = this.dataURLtoFile(this.imgData, `pic.${this.imgData.substring('data:image/'.length, this.imgData.indexOf(';base64'))}`);
  	this.uploadImg(this.originImage);
  }

  submit() {
  	const content: PhyConsultConfigRpnModel = {
  		description: this.description,
  		appointmentSpec: this.appointmentSpec,
  		personalInfoStatement: this.personalInfoStatement,
  		fileName: this.fileName ? this.fileName : 'image',
  		filePath: this.filePath,
  	};
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.DOCTOREVENT,
  		'phyConsultConfigRpnModel',
  		content,
  		'picture',
  		[this.files],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'EventMaintainResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'error',
  					errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  				},
  			});
  		},
  		(msg) => {
  			notification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
  	// this.$PCRRpnPortalApi.newPhyConsultConfigUsingPOST(content)
  	// 	.then((resp) => {
  	// 		this.$global.changeRouterAndaddParam({
  	// 			toRouter: 'EventMaintainResult',
  	// 			query: {
  	// 				result: resp.data.status === 200 ? 'success' : 'error',
  	// 				errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  	// 			},
  	// 		});
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    padding: 30px 10%;
    line-height: 28px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: #000;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
    .btn__view {
      width: 100px;
      margin: 0;
    }
  }
  ::v-deep {
    .ant-upload-drag-icon {
      svg {
        width: 48px;
        height: 48px;
        color: #4CAAF5;
      }
    }
  }
  .ant-upload-text {
    font-size: 16px;
  }
  .ant-upload-hint {
    font-size: 14px;
    color: #0000006E;
  }
</style>
