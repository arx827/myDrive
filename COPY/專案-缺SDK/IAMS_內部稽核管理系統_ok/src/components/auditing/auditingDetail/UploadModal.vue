<template>
  <InfoModal
    title="上傳資料"
    :visible="visible"
    :centered="true"
    body-size="large"
    padding-size="small"
    :closable="true"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="content__wrap mt-2">
        <a-form-model
          ref="formRef"
          class="content__form"
          :model="form"
          :rules="formRules"
          :hide-required-mark="false"
        >
          <a-form-model-item
            prop="fileType"
            class="d-flex justify-content-center"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 8 }"
            :label="'資料類型'"
          >
            <a-select
              v-model="form.fileType"
              class="input--select"
              placeholder="請選擇資料類型"
            >
              <a-select-option
                v-for="item in fileTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
        <a-upload-dragger
          class="upload__dragger"
          :show-upload-list="false"
          :file-list="fileList"
          :custom-request="uploadFile"
          :multiple="true"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="container" />
          </p>
          <p class="ant-upload-text">
            點選或將文件拖曳到這裡上傳
          </p>
          <p class="ant-upload-hint">
            支援多種格式，檔案大小200MB以內
          </p>
        </a-upload-dragger>
        <fbl-data-grid
          class="upload__table mt-3"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :scroll="{ x: true }"
        >
          <template #fileName="slotData">
            <a
              class="file__list__text"
              @click="onDownload(slotData.data)"
            >
              {{ slotData.data.fileName }}
            </a>
          </template>
          <template #delete="slotData">
            <div class="flex-center">
              <CustomPopConfirm
                v-if="showDelete && slotData.data.canDeleteFlag"
                @confirm="remove(slotData.data)"
              >
                <img
                  class="table__btn-delete"
                  alt=""
                  src="@/assets/images/icon/icon_delete.svg"
                >
              </CustomPopConfirm>
            </div>
          </template>
        </fbl-data-grid>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import { UploadFile } from 'ant-design-vue/types/upload';
import { AccountDto } from '@fubonlife/iams-api-axios-sdk';
import { Action, namespace } from 'vuex-class';

const modalControl = namespace('modalControl');

@Component({
	components: { FblDataGrid, InfoModal, CustomPopConfirm },
})
export default class UploadModal extends Vue {
  @Action('setLoading') setLoading;

	@modalControl.Action('setModalState') setModalState; // 全域 狀態彈窗

  @PropSync('visible')
  syncedVisible: boolean;

  @Prop()
  auditDraftId: string;

  // resultModalVisible = false

	form = {
		fileType: undefined,
	}

	showDelete = false;

	// 上傳檔案參數
  fileList: UploadFile[] = [];

	canType = [];
	// 上傳檔案參數 end

	formRules: { [key: string]: ValidationRule[] } = {
  	fileType: [{ required: true, message: '請選擇資料類型', trigger: 'change' }],
	};

	fileTypeList = [];

  user: AccountDto

  // 儲存promiseAll的promise陣列
  promiseArray = []

  uploadErr = []

  modalData = {
  	content: '',
  	title: '',
  	type: '',
  	autoClose: null,
  }

  grid = {
  	rowKey: 'auditDraftFileId',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '檔案名稱',
  			template: 'fileName',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'fileTypeCn',
  			title: '資料類型',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateUserCn',
  			title: '上傳人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateDateTime',
  			title: '上傳時間',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.updateDateTime),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'delete',
  			template: 'delete',
  			title: '刪除',
  			width: 100,
  		},
  	],
  }

  initData() {
  	this.form = {
  		fileType: undefined,
  	};
  	this.fileList = [];
  	this.grid.data = [];
  }

  validatorFileTypeExt(file) {
  	const typeArrStr = this.canType.reduce((a, b) => `${a}|${b}`);
  	const typeRegExp = new RegExp(`(${typeArrStr})$`);
  	// 格式判斷
  	if (!typeRegExp.test(file.name)) {
  		return false;
  	}
  	return true;
  }

  uploadFileTypeValidationMsg() {
  	const modalData = {
  		  autoClose: null,
  			content: '檔案格式不符，請重新選擇檔案',
  			type: 'warning',
  			title: '上傳提示',
  		};
  	this.setModalState({
  		resultModal: {
  			...modalData,
  		  visible: true,
  		},
  	});
  }

  validatorFileSizeTypeExt(file) {
  	const isAcceptSize = 200 / 1024 / 1024 < file.size;
  	return isAcceptSize;
  }

  uploadFileSizeValidationMsg() {
  	const modalData = {
  		  autoClose: null,
  			content: '檔案大小超過200MB，請重新選擇檔案',
  			type: 'warning',
  			title: '上傳提示',
  		};
  	this.setModalState({
  		resultModal: {
  			...modalData,
  		  visible: true,
  		},
  	});
  }

  // get dataType

  /**
	 * API
	 */
  // API: 取得 資料類型 下拉選項
  async getApi_docType() {
  	this.setLoading(true);
  	await this.$workPaperApi.searchDocTypeUsingPOST()
  		.then((resp) => {
  			const getData = this.$global.deepCopyData(resp.data.result);
  			if (getData && getData.length > 0) {
  				this.fileTypeList = getData.map((i) => ({
  					label: i.name,
  					value: i.id,
  				}));
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 取得 可上傳格式
  getApi_authorizationFileType() {
  	this.$parameterApi.searchAllowedFileExtensionsInParameterUsingGET()
  		.then((res) => {
  			this.canType = res.data.result;
  		});
  }

  // API: 取得 工作底稿檔案
  getApi_searchAudifDraftFile() {
  	this.setLoading(true);
  	this.$workPaperApi.searchAudifDraftFileUsingPOST(this.auditDraftId)
  		.then((resp) => {
  			const getData = this.$global.deepCopyData(resp.data.result);
  			const auditDraftFileVOSArr = getData.auditDraftFileVOS;
  			if (getData && getData.length > 0) {
  				auditDraftFileVOSArr.map((i) => {
  					i.fileType = this.fileTypeList.find((j) => j.value === i.fileType).label;
  				});
  			}
  			this.grid.data = auditDraftFileVOSArr;
  			this.showDelete = getData.showDelete;
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 上傳檔案
  uploadFile({
  	onSuccess, onError, file,
  }) {
  	(this.$refs.formRef as any).validate()
  		.then(() => {
  			if (!this.validatorFileTypeExt(file)) {
  				this.uploadFileTypeValidationMsg();
  				onError('fail');
  				return false;
  			}
  			if (!this.validatorFileSizeTypeExt(file)) {
  				this.uploadFileSizeValidationMsg();
  				onError('fail');
  				return false;
  			}
  			this.$workPaperApi.uploadAudifDraftFileUsingPOST(this.auditDraftId, file.name, this.form.fileType, file)
  				.then((res) => {
  					this.getApi_searchAudifDraftFile();
  					this.setModalState({
  						resultModal: {
  							visible: true,
  							type: 'success',
  							title: '上傳成功',
  							autoClose: 3,
  						},
  					});
  					onSuccess(res.data);
  				})
  				.catch((err) => {
  					onError(err);
  				});
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '請先選擇檔案類型',
  				},
  			});
  			return false;
  		});
  }

  // API: 移除檔案
  remove({ auditDraftFileId }) {
  	// console.log('刪除', auditDraftFileId);
  	this.setLoading(true);
  	this.$workPaperApi.removeAuditDraftFileUsingPOST(auditDraftFileId)
  		.then((resp) => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '刪除成功',
  					autoClose: 3,
  				},
  			});
  			this.getApi_searchAudifDraftFile();
  		})
  		.catch(() => {
  			console.error();
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  	    this.setLoading(false);
  		});
  }

  // API: 下載檔案
  onDownload({ auditDraftFileId, fileName }) {
  	this.setLoading(true);
  	this.$workPaperApi.downloadAuditDraftFileUsingPOST(auditDraftFileId, { responseType: 'blob' })
  		.then((resp) => {
  			const downloadlink: HTMLAnchorElement = document.createElement('a');
  			const URL = window.URL || window.webkitURL;
  			const url = URL.createObjectURL(resp.data as unknown as Blob);
  			const downloadName = fileName;
  			downloadlink.setAttribute('href', url);
  			downloadlink.setAttribute('download', `${downloadName}`);
  			downloadlink.click();
  			downloadlink.remove();
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
	 * Event
	 */
  closeModal() {
  	this.syncedVisible = false;
  }

  /**
	 * Hook
	 */
  async created() {
  	this.user = this.$user.getMe();
  	this.getApi_authorizationFileType();
  	await this.getApi_docType();
  	this.initData();
  	this.getApi_searchAudifDraftFile();
  }

	/**
	* 監聽
	*/
	@Watch('syncedVisible')
  watchVisible(nV) {
  	if (nV) {
  		this.getApi_searchAudifDraftFile();
  	}
  }
}
</script>

<style lang="scss" scoped>
.content__wrap{
  padding: 20px 103px;
  background: $COLOR_LIGHT;
}
::v-deep .upload__dragger{
  .ant-upload.ant-upload-drag{
    margin: 0 auto;
    background-color: $COLOR-MAIN10;
    .ant-upload-text{
      color: $COLOR-MAIN1;
    }
    .ant-upload-hint{
      color: #00000073;
    }
    .anticon svg{
      font-size: 54px;
      color: $COLOR-MAIN1;
    }
  }
}
.table__btn-delete{
  cursor: pointer;
  width: 24px;
  height: 24px;
}

::v-deep .upload__table{
  margin: 0 auto;
  .ant-table-thead > tr:first-child > th:last-child{
    display: flex;
    justify-content: center;
  }
}
</style>
