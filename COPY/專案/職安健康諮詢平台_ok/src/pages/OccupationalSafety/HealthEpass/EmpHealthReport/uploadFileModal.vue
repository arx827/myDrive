<template>
  <div class="uploadModal">
    <a-modal
      v-model="modalVisible"
      :centered="true"
      :closable="true"
      :footer="null"
      width="52%"
      @cancel="close"
    >
      <h2 class="upload__title">
        批次匯入
      </h2>
      <a-upload-dragger
        width="52%"
        accept=".xlsx, .xls"
        :show-upload-list="{ showRemoveIcon: uploadVaild }"
        :custom-request="uploadFlie"
        :file-list="uploadedFileList"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="upload__text">
          選擇欲上傳資料: 點擊或將文件拖曳到這裡上傳
        </p>
        <p class="upload__hint">
          檔案上傳建議: 限上傳excel格式，檔案大小限制不超過3MB、兩萬筆資料。
        </p>
      </a-upload-dragger>
      <div class="upload__btn__wrap btn__wrap">
        <a-button
          key="back"
          class="btn__radius--primary--outline"
          @click="close"
        >
          取消
        </a-button>
        <a-button
          key="submit"
          type="primary"
          class="btn__radius--primary"
          @click="onSubmit"
        >
          上傳檢核
        </a-button>
      </div>
    </a-modal>
  </div>
</template>
<!--a-form-model-item a-select-option a-form-model-->
<script lang="ts">
import {
	Vue, Component, Prop, Watch, Emit,
} from 'vue-property-decorator';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';

@Component({})
export default class UploadFileModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  @Watch('visible')
  visibleChange() {
  	this.modalVisible = this.visible;
  }

  file = null; // 暫存excel file

	uploadedFileList = []

	// 上傳檔案驗證
  uploadVaild: boolean = true;

  // 可上傳的檔案類型
  acceptType = '.xlsx';

  // 錯誤訊息內容
  modalMessage: string = '';

  @Emit('close-modal')
  close() {
  	this.modalVisible = false;
  	return false;
  }

	modalVisible = false

	created() {
		this.modalVisible = this.visible;
	}

	uploadFlie(options) {
  	this.file = options.file;
	}

	// 上傳檔案change事件
	handleChange(e) {
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
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		this.acceptType,
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		this.modalVisible = true;
  		this.modalMessage = vaildResult.message;
			InfoModal.alertError({
				confirm: false,
				content: this.modalMessage,
			});
  		return false;
  	}
  	return vaildResult.vaild;
	}

	// 上傳
	onSubmit() {
		if (this.file) {
			this.setLoading(true);
			// 多筆儲存健檢資料
			this.$HERpnCreateHealthCheckApi.healthCheckTablesMultiSaveUsingPOST(this.file)
				.then((resp) => {
					if (resp.data.status === 200) {
						if (resp.data.data[0].result === '成功') {
							this.$global.changeRouterAndaddParam({
								toRouter: 'EmpHealthReportUploadBatchResult',
								query: {
									data: resp.data.data,
									result: 'success',
								},
							});
						} else {
							this.$global.changeRouterAndaddParam({
								toRouter: 'EmpHealthReportUploadBatchResult',
								query: {
									data: resp.data.data,
									result: 'fail',
									reason: 'check',
								},
							});
						}
					} else {
						this.$global.changeRouterAndaddParam({
							toRouter: 'EmpHealthReportUploadBatchResult',
							query: {
								message: this.$global.getApiErrorMsg(resp.data.apiError),
								result: 'fail',
								reason: 'system',
							},
						});
					}
				})
				.catch((error) => {
					console.log('error status = ', error);
				})
				.finally(() => {
					this.setLoading(false);
				});
		} else {
			InfoModal.alertError({
				title: '檔案尚未上傳',
				confirm: false,
				content: '檢測到檔案尚未上傳，請上傳完成，再進行下一步，謝謝。',
			});
  		return false;
		}
	}
}
</script>

<style lang="scss" scoped>
::v-deep {
button.ant-modal-close{
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
		background-color: #23C4A8;
		width: 44px;
		height: 44px;
		border-radius: 50vh;
		display: flex;
		justify-content: center;
		align-items: center;
		svg {
			font-size: 18px;
    	color: #ffffff;
			font-weight: bold;
		}
	}

	.ant-modal-body{
		padding: 20px 45px;
		@include rwd-md {
			padding: 40px 92px;
		}
	}

	.upload__title{
			color: #000000;
			font-size: 30px;
			font-weight: bold;
		}
	.ant-upload-drag-container {
		.anticon svg{
			font-size: 60px;
			color: #4CAAF5;
		}
		.upload__text{
			font-size: 16px;
		}
		.upload__hint{
			font-size: 14px;
			color: #0000006E;
		}
	}
	.upload__btn__wrap{
		display: flex;
		justify-content: center;
	}
	.btn__wrap{
		margin: 20px 0;
		@include rwd-md{
			margin-bottom: 0px;
			margin-top: 50px;
		}

	}
	.ant-modal .ant-btn{
		border-radius: 100vh;
		margin:0 5px;
	}
	.ant-upload-list-item-name{
		display: inline;
		color: #1797FB;
	}
	.ant-upload-list-item-card-actions {
		position:relative;
		margin-left: 13px;
	}
}

</style>
