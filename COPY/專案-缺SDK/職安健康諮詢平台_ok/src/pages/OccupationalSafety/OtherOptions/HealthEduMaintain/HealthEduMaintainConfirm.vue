<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          {{ pagetitle }}
        </div>
      </div>
      <div class="healthEdu__wrap">
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <div class="healthEdu__block bg__light">
            <div class="healthEdu__block__title">
              計畫類別
            </div>
            <div class="row">
              <div class="col-sm">
                <a-form-model-item prop="planType">
                  <label class="a-form-label">計畫類別</label>
                  <a-select
                    v-model="form.planType"
                    placeholder="選擇計畫類別"
                    class="select"
                    :options="planTypeOptions"
                    @change="handlePlanChange"
                  />
                </a-form-model-item>
              </div>
              <div
                v-if="tableType==='HE'"
                class="col-sm"
              >
                <a-form-model-item prop="healthEduType">
                  <label class="a-form-label">衛教類別</label>
                  <a-select
                    v-model="form.healthEduType"
                    placeholder="選擇衛教類別"
                    class="select"
                    :options="healthEduTypeOptions"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div
              v-if="tableType==='HE'"
              class="row"
            >
              <a-form-model-item prop="healthEduUpload">
                <label class="a-form-label">衛教資訊上傳 <span class="label--normal">(上傳格式為PDF/JPG/PNG、檔案上限3MB)</span></label>
                <a-upload
                  :accept="acceptType"
                  :custom-request="uploadFlie"
                  :before-upload="beforeUpload"
                  :file-list="uploadedFileList"
                  @change="handleChange"
                >
                  <a-button class="btn__radius--primary btn__upload">
                    <a-icon type="upload" />上傳
                  </a-button>
                </a-upload>
                <div
                  v-if="uploadedFileList.length===0"
                  class="downloadList"
                  @click="downloadFile"
                >
                  {{ fileName }}
                </div>
              </a-form-model-item>
            </div>
          </div>
          <div class="healthEdu__block bg__light">
            <div class="healthEdu__block__title">
              {{ mailTitle }}
            </div>
            <div class="row">
              <a-form-model-item prop="subject">
                <label class="a-form-label">主旨</label>
                <a-input
                  v-model="form.subject"
                  placeholder="e.g. 職安管理部關心您-提供您醫療保健衛教資訊 (字數上限50字)"
                  :max-length="50"
                  type="text"
                />
              </a-form-model-item>
            </div>
            <div class="row">
              <a-form-model-item prop="content">
                <label class="a-form-label">內容</label>
                <a-textarea
                  v-model="form.content"
                  placeholder="(字數上限500字)"
                  :max-length="500"
                  :auto-size="{ minRows: 6 }"
                />
              </a-form-model-item>
            </div>
          </div>
        </a-form-model>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary--outline"
            @click="handleCancel"
          >
            取消
          </button>
          <button
            class="btn__radius--primary"
            :disabled="!uploadSuccess"
            @click="handleSubmit"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import notification from '@/plugins/notification/infoNotification';
import { SaveNoticeContentDto, ContentIdDto } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class HealthEduMaintainConfirm extends Vue {
  @Action('setLoading') setLoading;

  // 標題
  pagetitle = '新增衛教項目';

	mailTitle = '';

  // 衛教HE 醫生諮詢Doc 表單通知Form
  tableType = 'HE';

  saveType = 'add';

  // 已上傳檔案列表
  uploadedFileList = [];

  fileId = null;

  uploadSuccess = true;

  fileName = null;

  filePath = null;

  // 可上傳的檔案類型
  acceptType = '.jpg,.pdf,.png';

  // 表單
  form = {
  	planType: undefined,
  	healthEduType: undefined,
  	subject: null,
  	content: null,
  };

  // 檢核規則
  formRules = {
  	planType: [{ required: true, trigger: 'change', message: '請選擇計畫類別' }],
  	subject: [{ required: true, trigger: 'change', message: '請填寫主旨' }],
  	content: [{ required: true, trigger: 'change', message: '請填寫內容' }],
  };

  // API回傳資料
  content = [];

  // 計畫類別 下拉選項
  planTypeOptions = []

  // 衛教類別 下拉選項
  healthEduTypeOptions = []

  contentId = null;

  // 計畫類別 下拉選項變化 -> 衛教類別
  handlePlanChange(value) {
  	this.healthEduTypeOptions = [];
  	this.form.healthEduType = undefined;
  	const filterArr = this.content.filter((item) => item.srcFrom === value);
  	filterArr[0].itemDtoList.forEach((item) => {
  		const block = {
  			value: item.item,
  		  label: item.itemDesc,
  		};
  		this.healthEduTypeOptions.push(block);
  	});
  }

  setParam() {
  	if (this.$route.params.type === 'addHEItem') {
  		this.pagetitle = '新增衛教項目';
  		this.mailTitle = 'Email衛教內容發送';
  		this.tableType = 'HE';
  		this.saveType = 'add';
  		this.uploadSuccess = false;
  	} else if (this.$route.params.type === 'editHEItem') {
  		this.pagetitle = '編輯衛教項目';
  		this.mailTitle = 'Email衛教內容發送';
  		this.tableType = 'HE';
  		this.saveType = 'edit';
  		this.uploadSuccess = false;
  	} else if (this.$route.params.type === 'addDocItem') {
  		this.pagetitle = '新增醫師諮詢項目';
  		this.mailTitle = 'Email醫生諮詢內容';
  		this.tableType = 'Doc';
  		this.saveType = 'add';
  	} else if (this.$route.params.type === 'editDocItem') {
  		this.pagetitle = '編輯醫師諮詢項目';
  		this.mailTitle = 'Email醫生諮詢內容';
  		this.tableType = 'Doc';
  		this.saveType = 'edit';
  	} else if (this.$route.params.type === 'addFormItem') {
  		this.pagetitle = '新增表單通知項目';
  		this.mailTitle = 'Email表單通知內容';
  		this.tableType = 'Form';
  		this.saveType = 'add';
  	} else if (this.$route.params.type === 'editFormItem') {
  		this.pagetitle = '編輯表單通知項目';
  		this.mailTitle = 'Email表單通知內容';
  		this.tableType = 'Form';
  		this.saveType = 'edit';
  	}
  }

  getData() {
  	this.setLoading(true);
  	this.contentId = this.$global.getQuery().contentId;
  	const queryData: ContentIdDto = {
  		contentId: this.contentId,
  	};
  	this.$CaseMaintainUtilityApi.noticeContentUsingPOST(queryData)
  		.then((resp) => {
  			console.log('content data', resp.data.data);
  			this.form.planType = resp.data.data.srcFrom;
  			this.form.subject = resp.data.data.subject;
  			this.form.content = resp.data.data.content;
  			this.fileName = resp.data.data.fileName;
  			// this.filePath = resp.data.data.filePath;
  			this.uploadSuccess = true;
  			if (this.tableType === 'HE') {
  				this.healthEduTypeOptions = [];
  				const filterArr = this.content.filter((item) => item.srcFrom === resp.data.data.srcFrom);
  				filterArr[0].itemDtoList.forEach((item) => {
  					const block = {
  						value: item.item,
  						label: item.itemDesc,
  					};
  					this.healthEduTypeOptions.push(block);
  				});
  				this.form.healthEduType = resp.data.data.item;
  			}
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 上傳檔案change事件
  handleChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList.slice(-1);
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
  		this.uploadSuccess = false;
  	}
  }

  resetFile() {
  	this.uploadedFileList = [];
  	// this.imgData = null;
  }

  // 上傳檔案若通過檢核，進行上傳
  uploadFlie(options) {
  	if (this.beforeUpload) {
  	  this.uploadFile(options.file);
  	}
  }

  // 2022/07/27 目前檔案無法上傳超過1MB待後端調整底層
  uploadFile(file) {
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.uploadNotifyContentFileUsingPOST(file)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.fileId = resp.data.data;
  				this.uploadSuccess = true;
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				this.uploadSuccess = false;
  			}
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	this.resetFile();
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		this.acceptType,
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		InfoModal.alertError({ content: '限上傳 jpg、png、pdf 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  // 確定
  handleSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.setLoading(true);
  			const saveData: SaveNoticeContentDto = {
  				content: this.form.content,
  				subject: this.form.subject,
  				srcFrom: this.form.planType,
  			};
  			if (this.tableType === 'HE') {
  				saveData.fileId = this.fileId;
  				saveData.contentType = 1;
  				saveData.item = this.form.healthEduType;
  				if (this.saveType === 'edit') {
  					saveData.contentId = this.contentId;
  				}
  				console.log('saveData => ', saveData);
  			} else if (this.tableType === 'Doc') {
  				saveData.contentType = 2;
  				if (this.saveType === 'edit') {
  					saveData.contentId = this.contentId;
  				}
  				console.log('saveData => ', saveData);
  			} else if (this.tableType === 'Form') {
  				saveData.contentType = 3;
  				if (this.saveType === 'edit') {
  					saveData.contentId = this.contentId;
  				}
  				console.log('saveData => ', saveData);
  			}
  			this.$CaseMaintainUtilityApi.saveNoticeContentUsingPOST(saveData)
  				.then((resp) => {
  					if (resp.data.status === 200) {
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'HealthEduMaintainConfirmResult',
  							query: {
  								result: resp.data.status === 200 ? 'success' : 'error',
  								errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  							},
  							params: {
  								type: `${this.saveType}${this.tableType}`,
  							},
  						});
  					} else {
  						notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  					}
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  			// this.$router.push({ name: 'HealthEduMaintainConfirmResult' });
  		}
  	});
  }

  // 取消
  handleCancel() {
  	this.$router.push({ name: 'HealthEduMaintainIndex' });
  }

  getFormData() {
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.srcFromUsingPOST()
  		.then((resp) => {
  			this.content = resp.data.data;
  			resp.data.data.forEach((item) => {
  				const block = {
  					value: item.srcFrom,
  		      label: item.srcFromDesc,
  				};
  				this.planTypeOptions.push(block);
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  downloadFile() {
  	this.setLoading(true);
  	const queryData: ContentIdDto = {
  		contentId: this.contentId,
  	};
  	this.$CaseMaintainUtilityApi.downloadByDownloadFileDtoUsingPOST(queryData, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
						resp.data as Blob,
						filename,
						resp.headers['content-type'],
  				);
  			} else {
  				this.$CaseMaintainUtilityApi.downloadByDownloadFileDtoUsingPOST(queryData)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			this.$infoNotification.error({
  				content: '無法完成下載項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	this.setParam();
  	this.getFormData();
  	if (this.saveType === 'edit') {
  		this.getData();
  	}
  }
}
</script>

<style lang="scss" scoped>
  .downloadList {
    margin-top: 5px;
    color: #1797FB;
    &:hover {
      cursor: pointer;
    }
  }
  .healthEdu__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .healthEdu__block__title {
    color: #23C4A8;
    font-weight: 600;
    font-size: 20px;
    padding-bottom: 20px;
  }
  .a-form-label {
    color: #363636;
    font-weight: 600;
    display: block;
    padding-bottom: 10px;
  }
  .label--normal {
    font-weight: normal;
  }
  .btn__upload {
    border-radius: 4px;
    &:hover {
      background-color: #23C4A8;
    }
  }
  .btn__wrap {
    margin: 50px 100px 50px 0;
    width: 100%;
    padding: 0;
    @include rwd-md {
      padding-right: 108px;
    }
    button {
      width: 98px;
      padding: 10px 20px;
      @include rwd-md {
        width: 200px;
        margin-right: 10px;
      }
      max-width: 100%;
      margin-right: 5px;
    }
    .btn__temp {
      width: 98px;
    }
  }
  ::v-deep {
    .ant-select-selection--single, .ant-input, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-upload-list-item {
      width: 50%;
    }
    .ant-upload-list-item-name {
      color: #1797FB;
    }
  }
</style>
