<template>
  <div class="container">
    <div class="page__title">
      編輯活動內容
    </div>
    <div class="event__wrap bg__light">
      <div class="event__block">
        <div class="block__title">
          活動Banner
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
      <div class="event__block--margin">
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
    </div>
    <div class="btn__wrap text-center">
      <router-link :to="'/occupationSafety/ErgonomicHazard/EHEventMaintain/index'">
        <button class="btn__radius--primary--outline mb-2">
          取消
        </button>
      </router-link>
      <button
        class="btn__radius--primary mb-2"
        :disabled="!uploadSuccess"
        @click="submit()"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueEditor, Quill } from 'vue2-editor';
import { Action } from 'vuex-class';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import InfoModal from '@/plugins/notification/infoModal';
import notification from '@/plugins/notification/infoNotification';
import { HfeConfigDto } from '@fubonlife/oss-api-axios-sdk';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({ components: { VueEditor } })
export default class EventContentMaintainEdit extends Vue {
  @Action('setLoading') setLoading;

  content: any = null // 原始內容

  description: any = null // 活動說明

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
  	this.files = null;
  }

  handleChange(e) {
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
  		this.imgData = null;
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
  		// console.log('yes');
  	}
  	console.log(this.uploadedFileList);
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	this.resetFile();
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		'.jpg,.png,.gif,',
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		InfoModal.alertError({ content: '限上傳 jpg、png、gif 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
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

  uploadImg(file) {
  	this.files = file;
  	// this.setLoading(true);
  	// this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.updateHumanFactorConfigPicUsingPOST(file)
  	// 	.then((resp) => {
  	// 		if (resp.data.status === 200) {
  	// 			this.fileName = resp.data.data.fileName;
  	// 		  this.filePath = resp.data.data.filePath;
  	// 			this.uploadSuccess = true;
  	// 		} else {
  	// 			notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  	// 			this.uploadSuccess = false;
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  dataURLtoFile(dataurl, filename) {
  	const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  	const bstr = atob(arr[1]); let n = bstr.length; const
  		u8arr = new Uint8Array(n);
  	while (n--) {
  		u8arr[n] = bstr.charCodeAt(n);
  	}
  	return new File([u8arr], filename, { type: mime });
  }

  submit() {
  	if (this.uploadSuccess) {
  		this.setLoading(true);
  		const formData: HfeConfigDto = {
  			// bannerFilePath: this.filePath,
  			// bannerFilename: this.fileName,
  			desc: this.description,
  		};
  		const regex = /(<([^>]+)>)/ig;
  		const hasText = !!this.description.replace(regex, '').length;
  		if (hasText) {
  			console.log(this.files);
  			this.$customUpload.fetchAPI(
  				UploadAPIUrl.ERGONOMICFORMSAVE,
  				'hfeConfigDto',
  				formData,
  				'picture',
  				[this.files],
  				(resp) => {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'EHEventMaintainResult',
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
  			// this.$HfeRpnHfeQueryHumanHazardInformationControllerApi.updateHumanFactorConfigUsingPOST(formData)
  			// 	.then((resp) => {
  			// 		this.$global.changeRouterAndaddParam({
  			// 			toRouter: 'EHEventMaintainResult',
  			// 			query: {
  			// 				result: resp.data.status === 200 ? 'success' : 'error',
  			// 				errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  			// 			},
  			// 		});
  			// 	})
  			// 	.catch((error) => {
  			// 		console.log('error status => ', error);
  			// 	})
  			// 	.finally(() => {
  			// 		this.setLoading(false);
  			// 	});
  		} else {
  			notification.error({ content: '請填入說明文字' });
  			this.setLoading(false);
  		}
  	}
  }

  created() {
  	const query = this.$global.getQuery();
  	this.content = query;
  	this.description = query.desc;
  	if (!query.picBase64) return;
  	this.imgData = query.picBase64;
  	this.originImage = this.dataURLtoFile(this.imgData, `pic.${this.imgData.substring('data:image/'.length, this.imgData.indexOf(';base64'))}`);
  	this.uploadImg(this.originImage);
  }
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    padding-left: calc(90/1088*100%);
    padding-right: calc(94/1088*100%);
    padding-top: 29px;
    padding-bottom: 30px;
    line-height: 28px;
    margin-bottom: 20px;
    border-radius: 10px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .event__block--margin {
    margin-bottom: 0px;
  }
  .block__title {
    color: #000;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .btn__wrap {
    margin: 40px 0;
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
