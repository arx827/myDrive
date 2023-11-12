<template>
  <InfoModal
    title="上傳附件"
    :visible="visible"
    :centered="true"
    :closable="true"
    body-size="large"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="content__wrap mt-2">
        <a-upload-dragger
          class="upload__dragger"
          :show-upload-list="false"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :custom-request="()=>{}"
          :multiple="true"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="container" />
          </p>
          <p class="ant-upload-text">
            點選或將文件拖曳到這裡上傳
          </p>
          <p class="ant-upload-hint">
            支援{{ allowedFileType && allowedFileType.join('、') }}格式，檔案大小200MB以內
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
          <template #fileName="data">
            <a @click="downloadFile(data.data.auditDraftContentFileId,data.data.fileName)">
              {{ data.data.fileName }}
            </a>
          </template>
          <template #delete="data">
            <div
              v-if="data.data.canDeleteFlag"
              class="flex-center"
            >
              <CustomPopConfirm
                @confirm="deleteFile(data.data.auditDraftContentFileId)"
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
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import { AccountDto } from '@fubonlife/iams-api-axios-sdk';
import { Getter, Action, namespace } from 'vuex-class';

const modalModule = namespace('modalControl');

@Component({
	components: { FblDataGrid, InfoModal, CustomPopConfirm },
})
export default class UploadModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

	@Prop()
	auditDraftContentId: string;

	@modalModule.Action('setModalState') setModalState;

	allowedFileType = null;

  fileList = []

  public grid = {
  	rowKey: 'updateDatetime',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'fileName',
  			title: '檔案上傳',
  			template: 'fileName',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateUser',
  			title: '上傳人員',
  			formatter: (data) => data.updateUser.value,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateDatetime',
  			title: '上傳時間',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.updateDatetime),
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

	@Watch('visible')
  async onVisibleChange() {
  	if (this.visible) {
  		this.getDraftContentFile(this.auditDraftContentId);
  		this.allowedFileType = await this.getApi_authorizationFileType();
  	}
  }

	closeModal() {
  	// 取消按鈕
  	this.$emit('closeModal');
	}

	// API: 取得上傳附件
	getDraftContentFile(auditDraftContentId: string) {
		this.setLoading(true);
		this.$workPaperApi.getDraftContentFilesUsingGET(auditDraftContentId)
			.then((resp) => {
				this.grid.data = resp.data.result.auditDraftContentFiles;
			})
			.catch((error) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '取得附件失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 取得 可上傳格式
	async getApi_authorizationFileType() {
		this.setLoading(true);
  	const $return = await this.$parameterApi.searchAllowedFileExtensionsInParameterUsingGET();
		this.setLoading(false);
  	return $return.data.result;
	}

	// API: 上傳檔案
	uploadFile(auditDraftContentId: string, fileType: string, fileName: string, file: any) {
		this.setLoading(true);
		this.$workPaperApi.uploadDraftContentUsingPOST(auditDraftContentId, fileName, fileType, file)
			.then((resp) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '上傳附件成功',
						autoClose: 3,
					},
				});
				this.getDraftContentFile(this.auditDraftContentId);
				this.$emit('reloadDraft');
			})
			.catch((error) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '上傳附件失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 下載檔案
	downloadFile(auditDraftContentFileId: string, fileName: string) {
		this.setLoading(true);
		this.$workPaperApi.downloadDraftContentFileUsingPOST({ auditDraftContentFileIds: [auditDraftContentFileId] }, { responseType: 'blob' })
			.then((resp) => {
				console.log('resp', resp);
				this.$blobUtils.download(resp.data as unknown as Blob, fileName);
			})
			.catch((error) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '上傳附件失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// API: 刪除檔案
	deleteFile(auditDraftContentFileId: string) {
		this.setLoading(true);
		this.$workPaperApi.deleteDraftContentFileUsingPOST({ auditDraftContentFileId })
			.then((resp) => {
				console.log('resp', resp);
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'success',
						title: '刪除附件成功',
						autoClose: 3,
					},
				});
				this.getDraftContentFile(this.auditDraftContentId);
				this.$emit('reloadDraft');
			})
			.catch((error) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '刪除附件失敗',
					},
				});
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 檢查檔案格式
	async beforeUpload(file) {
  	const typeArrStr = this.allowedFileType.reduce((a, b) => `${a}|${b}`);
  	const typeRegExp = new RegExp(`(${typeArrStr})$`);
  	// 格式判斷
  	if (!typeRegExp.test(file.name)) {
  		this.setModalState({
				resultModal: {
					visible: true,
					type: 'warning',
					title: '上傳提示',
  				content: '檔案格式錯誤',
				},
			});
  		return false;
  	}

  	// 檔案size判斷
  	const isAcceptSize = 200 / 1024 / 1024 < file.size;
  	if (!isAcceptSize) {
			this.setModalState({
				resultModal: {
					visible: true,
					type: 'warning',
					title: '上傳提示',
  				content: '檔案大小超過200MB，請重新選擇檔案',
				},
			});
  		return false;
  	}

  	// 檔案後續處理
		this.uploadFile(this.auditDraftContentId, '01', file.name, file);
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
  width: 76%;
  .ant-table-thead > tr:first-child > th:last-child{
    display: flex;
    justify-content: center;
  }
}
</style>
