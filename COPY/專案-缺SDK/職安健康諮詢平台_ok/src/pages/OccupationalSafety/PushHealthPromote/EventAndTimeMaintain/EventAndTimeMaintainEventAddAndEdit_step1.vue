<template>
  <div>
    <div class="event__wrap bg__light">
      <a-form-model
        ref="eventSettingStep1Form"
        class="eventSettingStep1Form"
        :form="form"
        :model="form"
        :rules="rules"
        :hide-required-mark="true"
        :layout="'vertical'"
      >
        <a-form-model-item
          ref="upload"
          prop="formPath"
          :auto-link="true"
        >
          <span slot="label">
            活動EDM Banner
            <span class="mark-required">*</span>
          </span>
          <a-upload-dragger
            name="file"
            accept="image/jpeg, image/png, image/gif,"
            :file-list="uploadedFileList"
            :custom-request="uploadFlie"
            :show-upload-list="false"
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
          <p
            v-if="fileError"
            class="message--error ml-0"
          >
            {{ fileError }}
          </p>
          <img
            class="img-fluid mt-3"
            :src="imgData"
          >
          <!-- banner img 外開連結 -->
          <div
            v-if="imgData"
            class="my-2"
          >
            <a-icon
              type="paper-clip"
              class="icon__style"
            />
            <a
              :title="bannerFileName"
              :href="imgData"
              :download="bannerFileName"
              class="link__style"
            >
              {{ bannerFileName }}
            </a>
            <a-icon
              type="close"
              @click="handleRemoveBanner"
            />
          </div>
        </a-form-model-item>

        <a-form-model-item prop="actSummary">
          <span slot="label">
            活動摘要
            <span class="mark-required">*</span>
          </span>
          <vue-editor
            v-model="form.actSummary"
            :editor-toolbar="customToolbar"
            placeholder="請填寫活動摘要，字數上限500字。"
          />
        </a-form-model-item>

        <a-form-model-item prop="actDesc">
          <span slot="label">
            活動說明
            <span class="mark-required">*</span>
          </span>
          <vue-editor
            v-model="form.actDesc"
            :editor-toolbar="customToolbar"
            placeholder="請填寫活動說明或歡迎文字，字數上限500字。"
          />
        </a-form-model-item>

        <a-form-model-item prop="personalInfoStatement">
          <span slot="label">
            個資聲明
            <span class="mark-required">*</span>
          </span>
          <vue-editor
            v-model="form.personalInfoStatement"
            :editor-toolbar="customToolbar"
            placeholder="請填寫個資聲明，字數上限500字。"
          />
        </a-form-model-item>
      </a-form-model>
    </div>

    <div class="btn__wrap text-center">
      <button
        class="btn__view btn__radius--primary--outline float-start"
        @click="handleSaveTemp"
      >
        暫存
      </button>
      <button
        class="btn__radius--primary--outline"
        @click="goEventAndTimeMaintainPage"
      >
        取消
      </button>
      <button
        class="btn__radius--primary"
        @click="handleNextStep"
      >
        下一步
      </button>
      <button
        class="btn__view btn__radius--primary--outline float-end"
        @click="()=>previewModalVisible = true"
      >
        預覽
      </button>
    </div>

    <!-- 預覽 -->
    <EventPagePreviewModal
      :visible="previewModalVisible"
      :pic="imgData"
      :form="form"
      @closeModal="handleCloseModal"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { VueEditor, Quill } from 'vue2-editor';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import EventPagePreviewModal from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventPagePreviewModal.vue';
import { HealthActCreateModel } from '@fubonlife/oss-api-axios-sdk';
import { filter } from 'vue/types/umd';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({ components: { VueEditor, EventPagePreviewModal } })
export default class EventAndTimeMaintainEventAddAndEditStep1 extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
  uploadedFileList = [] // 欲上傳的檔案

	imgData = null // banner圖網址

	form: any = {
		actId: undefined,
		actDesc: undefined,
		actSummary: undefined,
		personalInfoStatement: undefined,
	};

	fileError = null;

	bannerFileName = null;

	// 表單檢驗規則
	rules: { [key: string]: ValidationRule[] } = {
		formPath: [{ required: true, trigger: 'change', validator: this.checkFileList }],
  	actSummary: [{ required: true, message: '請填寫活動摘要', trigger: 'change' }],
  	actDesc: [{ required: true, message: '請填寫活動說明', trigger: 'change' }],
  	personalInfoStatement: [{ required: true, message: '請填寫個資聲明', trigger: 'change' }],
	};

  // 編輯 or 新增
  paramsType = '';

  // editor設定
	customToolbar = [
  	[{ header: [1, 2, 3, 4, 5, 6, false] }],
  	[{ color: [] }, { background: [] }],
  	['bold', 'italic', 'underline', 'strike'],
  	[{ list: 'ordered' }, { list: 'bullet' }],
  	[{ align: [] }],
  	['link'],
  	['clean'],
	]

	files = null

	fileBase64 = null

	previewModalVisible = false;

	/**
   * func
   */
	// 【檔案】欄位檢核
	checkFileList(rule, value, callback) {
		if (!this.imgData && this.uploadedFileList.length == 0) {
			this.fileError = '請選擇有效檔案';
			callback('');
		} else {
			this.fileError = null;
			callback();
		}
	}

	setResultParam() {
  	this.paramsType = this.$router.currentRoute.params.type;
		const query = this.$global.getQuery();
		// // TEST:
		// console.log(query);
		const { actId } = query;
		this.form.actId = actId;

		// 判斷 session 有沒有資料
		if (sessionStorage.getItem('form_step1')) {
			const { picture, fileName, ...formData } = JSON.parse(sessionStorage.getItem('form_step1'));
			this.imgData = picture;
			this.bannerFileName = fileName;
			this.form = formData;
		} else if (this.paramsType == 'edit') {
			this.getActInfo(actId);
		} else {
			this.form = {};
		}
	}

	resetFile() {
  	this.uploadedFileList = [];
  	this.imgData = null;
	}

	onLoadImage(img): string {
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
  	// console.log(width);
  	return dataURL;
	}

	// API: 查詢單一健康促進活動API
	getActInfo(actId) {
		this.setLoading(true);
		this.$PHPRpnEventSessionMaintainApi.getOneHealthActRpnUsingPOST(actId)
			.then((resp) => {
				// TEST:
				// console.log(resp);
				if (resp.data.status == 200) {
					const {
						actId, picture, edmBannerFileName, actDesc, actSummary, personalInfoStatement,
					} = resp.data.data;
					Object.assign(this.form, {
						actDesc,
						actSummary,
						personalInfoStatement,
					});
					this.imgData = picture;
					this.bannerFileName = edmBannerFileName;
				} else {
  				const getError = resp.data;
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  					apiError: getError.apiError,
  				});
					this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  			}
			})
			.catch((error) => {
				console.log('error actStatus = ', error);
				this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
				this.$router.push({ name: 'EventAndTimeMaintainIndex' });
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 上傳圖片 API
	uploadImg(file) {
		this.files = file;
		// this.setLoading(true);
		// this.$PHPRpnEventSessionMaintainApi.uploadHealthActPictureUsingPOST(file)
		// 	.then((resp) => {
		// 		// TEST:
		// 		// console.log(resp);
		// 		if (resp.data.status == 200) {
		// 			this.form.fileName = resp.data.data.fileName;
  	// 			this.form.filePath = resp.data.data.filePath;
		// 		} else {
		// 			const getError = resp.data;
		// 			this.$infoNotification.error({
		// 				content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成暫存項目，請再次嘗試。',
		// 			});
		// 			this.resetFile();
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('error actStatus = ', error);
		// 		this.$infoNotification.error({
		// 			content: '無法完成上傳圖片，請再次嘗試。',
		// 		});
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	/**
   * Event
   */
	// 回到活動與場次維護
	goEventAndTimeMaintainPage() {
  	this.$router.push({ name: 'EventAndTimeMaintainIndex' });
		sessionStorage.removeItem('form_step1');
	}

	// 點擊按鈕，『下一步』
	async handleNextStep() {
		(this.$refs.eventSettingStep1Form as any).validate((valid) => {
			if (valid && this.imgData) {
				// 當頁資料存進	sessionStorage
				sessionStorage.setItem('form_step1', JSON.stringify({
					...this.form,
					picture: this.imgData,
					fileName: this.bannerFileName,
				}));
				this.$global.changeRouterAndaddParam({
  				toRouter: 'EventAndTimeMaintainEventAddAndEditStep2',
  				params: {
  					type: this.paramsType,
  				},
  				query: { actId: this.form.actId	},
  			});
			} else {
  			// 驗證失敗 要捲到 輸入框
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
			}
		});
	}

	// API: 暫存健康促進活動 API
	handleSaveTemp() {
		this.setLoading(true);
		this.$customUpload.fetchAPI(
  		UploadAPIUrl.HEALTHTPUSHTEMPSAVE,
  		'healthActCreateModel',
  		this.form,
  		'file',
  		[this.files || this.$customUpload.dataURLtoFile(this.imgData, this.bannerFileName)],
  		(resp) => {
				this.form.actId = resp.data.data.actId;
  			this.$infoNotification.success({
					content: '已成功暫存。',
				});
  		},
  		(msg) => {
  			this.$infoNotification.error({ content: this.$global.getApiErrorMsg(msg).join('') });
  		},
  		() => {
  			this.setLoading(false);
  		},
  	);
		// this.$PHPRpnEventSessionMaintainApi.saveTempHealthActWithPictureUsingPOST(this.form)
		// 	.then((resp) => {
		// 		// TEST:
		// 		// console.log(resp);
		// 		if (resp.data.status == 200) {
		// 			const { filePath, picture } = resp.data.data;
		// 			this.form.filePath = filePath;
		// 			this.imgData = picture;
		// 			this.$infoNotification.success({
		// 				content: '已成功暫存。',
		// 			});
		// 		} else {
		// 			const getError = resp.data;
		// 			this.$infoNotification.error({
		// 				content: getError ? this.$global.getApiErrorMsg(getError.apiError).join('') : '無法完成暫存項目，請再次嘗試。',
		// 			});
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 		this.$infoNotification.error({
		// 			content: '無法完成暫存項目，請再次嘗試。',
		// 		});
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	async handleChange(e) {
		// console.log(e);
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
			this.bannerFileName = el.name;
  	}
  	// console.log(this.uploadedFileList);
	}

	uploadFlie(options) {
		this.uploadImg(options.file);
	}

	handleRemoveBanner() {
		this.uploadedFileList = [];
		this.imgData = null;
		this.bannerFileName = null;
		// this.form.filePath = null;
		// this.form.fileName = null;
	}

	handleCloseModal() {
  	this.previewModalVisible = false;
	}

	/**
   * Hook
   */
	created() {
  	this.$emit('changeParent', { step: 1, pageTitle: null });
		this.setResultParam();
	}
}
</script>
<style lang="scss" scoped>
.event__wrap {
  padding: 30px 10%;
  line-height: 28px;
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

.quillWrapper {
	background: $COLOR-WHITE;
}

.icon__style {
  font-size: 11px !important;
  color: #8C8C8C;
}

.link__style {
  color: #1797FB;
  font-size: 14px;
	margin-right: 20px;
}

::v-deep {
  .ant-upload.ant-upload-drag {
    // height: 236px;
    background: $COLOR-WHITE;
  }
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
