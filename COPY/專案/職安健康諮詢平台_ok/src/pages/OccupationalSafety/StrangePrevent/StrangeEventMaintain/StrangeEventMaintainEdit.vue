<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          編輯活動內容
        </div>
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
              :file-list="banner.uploadedFileList"
              :custom-request="uploadBannerFlie"
              @change="handleChange($event, 'banner')"
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
              :src="banner.path"
            >
          </div>
        </div>
        <div class="event__block mb-0">
          <div class="block__title">
            活動說明
          </div>
          <div class="block__content">
            <vue-editor
              v-model="content.desc"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block mb-0">
          <div class="block__title">
            個資聲明 (表1_負荷評估量表)
          </div>
          <div class="block__content">
            <vue-editor
              v-model="content.statementOverload"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block mb-0">
          <div class="block__title">
            個資聲明 (表2_十年內心血管疾病發病風險評估量表)
          </div>
          <div class="block__content">
            <vue-editor
              v-model="content.statementFRisk"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block mb-0">
          <div class="block__title">
            備註 (相關醫師面談)
          </div>
          <div class="block__content">
            <vue-editor
              v-model="content.piDescPhy"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block mb-0">
          <div class="block__title">
            個資聲明 (相關醫師面談)
          </div>
          <div class="block__content">
            <vue-editor
              v-model="content.piStatementPhy"
              :editor-toolbar="customToolbar"
            />
          </div>
        </div>
      </div>
      <div class="event__wrap bg__light">
        <div class="event__block mb-0">
          <div class="block__title">
            疾病風險參考
          </div>
          <div class="block__content">
            <a-upload-dragger
              name="Sickfile"
              accept="image/jpeg, image/png,"
              :file-list="symptomImg.uploadedFileList"
              :custom-request="uploadSymptomImgFlie"
              @change="handleChange($event, 'symptomImg')"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                選擇欲上傳資料：點擊或將文件拖曳到這裡上傳
              </p>
              <p class="ant-upload-hint">
                最佳尺寸建議：每張大小限制不超過3MB，限上傳 jpg、png 格式。
              </p>
            </a-upload-dragger>
            <img
              class="img-fluid mt-3"
              :src="symptomImg.path"
            >
          </div>
        </div>
      </div>

      <div class="btn__wrap text-center">
        <router-link :to="'/occupationSafety/AbnormalLoad/strangeEventMaintain/index'">
          <button class="btn__radius--primary--outline mb-2">
            取消
          </button>
        </router-link>
        <button
          class="btn__radius--primary mb-2"
          @click="submit()"
        >
          確定
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpHealthOverLoadConfigTextDto } from '@fubonlife/oss-api-axios-sdk';
import { VueEditor, Quill } from 'vue2-editor';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { VueEditor } })
export default class EventContentMaintainEdit extends Vue {
  @Action('setLoading') setLoading;

  content = null;

  banner = {
  	path: null, // banner圖網址
  	uploadedFileList: [], // upload banner列表
  	origin: null, // 原始banner
  	fileName: null, // 打上傳API後回傳
  	filePath: null, // 打上傳API後回傳
  	file: null,
  }

  symptomImg = {
  	path: null, // 疾病圖圖網址
  	uploadedFileList: [], // upload 疾病圖列表
  	origin: null, // 原始疾病圖
  	fileName: null, // 打上傳API後回傳
  	filePath: null, // 打上傳API後回傳
  	file: null,
  }

  customToolbar = [
  	[{ header: [1, 2, 3, 4, 5, 6, false] }],
  	[{ color: [] }, { background: [] }],
  	['bold', 'italic', 'underline', 'strike'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[{ align: [] }],
  	['link'],
  	['clean'],
  ] // 文字編輯器設定

  resetFile(target) {
  	console.log('reset');
  	this[target].uploadedFileList = [];
  	this[target].path = null;
  	this[target].file = null;
  	// this.uploadedFileList = [];
  	// this.imgData = null;
  }

  async handleChange(e, target) {
  	this[target].uploadedFileList = this[target].uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this[target].uploadedFileList = e.fileList.slice(-1);
  		this[target].uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  	  this.resetFile(target);
  		this[target].uploadedFileList = this[target].uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}

  	if (this[target].uploadedFileList[0]) {
  		const el = this[target].uploadedFileList[0].originFileObj;
  		const reader = new FileReader();
  		reader.onload = (e) => {
  			const img = new Image();
  			img.src = reader.result.toString();
  			img.onload = () => {
  			// setTimeout(() => {
  				this[target].path = this.onLoadImage(img);
  			// });
  			};
  		};
  		reader.readAsDataURL(el);
  	}
  	// console.log(this.uploadedFileList);
  }

  uploadBannerFlie(options) {
  	console.log(options);
  	this.uploadImg(options.file, 'banner');
  }

  uploadSymptomImgFlie(options) {
  	console.log(options);
  	this.uploadImg(options.file, 'symptomImg');
  }

  // 上傳圖片API
  uploadImg(file, target) {
  	this[target].file = file;
  	// this.setLoading(true);
  	// this.$AlEmpAlCaseFillOutControllerApi.updateHealthOverLoadConfigPicUsingPOST(file)
  	// 	.then((resp) => {
  	// 		console.log(resp.data);
  	// 		if (resp.data.status === 200) {
  	// 			this[target].fileName = resp.data.data.fileName;
  	// 		  this[target].filePath = resp.data.data.filePath;
  	// 		} else {
  	// 			notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  	// 			this.resetFile(target);
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  	// console.log(this.banner);
  	// console.log(this.symptomImg);
  }

  // 壓縮圖片
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

  submit() {
  	const content: EmpHealthOverLoadConfigTextDto = {
  		// bannerFilePath: this.banner.filePath,
  		// bannerFilename: this.banner.fileName,
  		// configId: this.content.configId,
  		desc: this.content.desc,
  		piDescPhy: this.content.piDescPhy,
  		piStatementPhy: this.content.piStatementPhy,
  		// picSpec: this.symptomImg.fileName,
  		// picSpecPath: this.symptomImg.filePath,
  		statementFRisk: this.content.statementFRisk,
  		statementOverload: this.content.statementOverload,
  	};
  	this.setLoading(true);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.STRANGEEVENTSAVE,
  		'empHealthOverLoadConfigTextDto',
  		content,
  		'banner',
  		[this.banner.file],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'StrangeEventMaintainResult',
  				query: {
  					result: resp.data.status === 200 ? 'success' : 'fail',
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
  		'picture',
  		[this.symptomImg.file],
  	);
  	// this.$AlEmpAlCaseFillOutControllerApi.updateHealthOverLoadConfigUsingPOST(content)
  	// 	.then((resp) => {
  	// 		this.$global.changeRouterAndaddParam({
  	// 			toRouter: 'StrangeEventMaintainResult',
  	// 			query: {
  	// 				result: resp.data.status === 200 ? 'success' : 'fail',
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

  // 從上一步來的初始化圖片
  initUploadImg(defaultImg, target) {
  	if (!defaultImg) return;
  	this[target].path = defaultImg;
  	this[target].origin = this.dataURLtoFile(defaultImg, `pic.${defaultImg.substring('data:image/'.length, defaultImg.indexOf(';base64'))}`);
  	this.uploadImg(this[target].origin, target);
  }

  created() {
  	const query = this.$global.getQuery();
  	this.content = query;

  	console.log(query);

  	this.initUploadImg(query.bannerFile, 'banner');
  	this.initUploadImg(query.picBase64Spec, 'symptomImg');
  }
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    padding-left: calc(92/1088*100%);
    padding-right: calc(92/1088*100%);
    padding-top: 29px;
    padding-bottom: 30px;
    line-height: 28px;
    margin-bottom: 20px;
    border-radius: 10px;
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
