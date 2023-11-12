<template>
  <InfoModal
    :title="pageTitle"
    :visible="visible"
    :centered="true"
    body-size="large"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="content__wrap mt-2">
          <a-upload-dragger
            class="upload__dragger"
            :show-upload-list="false"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :custom-request="()=>{}"
            @change="handleChange"
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
            <template #fileName="data">
              <div>
                {{ data.data.fileName }}
              </div>
            </template>
            <template #delete="data">
              <div class="flex-center">
                <CustomPopConfirm
                  @confirm="remove(data.data)"
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
        <div class="d-flex mt-4 justify-content-end">
          <button
            class="btn--primary me-2"
            @click="confirmUpload"
          >
            確認
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </fragment>
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
import { Action } from 'vuex-class';

@Component({
	components: { FblDataGrid, InfoModal, CustomPopConfirm },
})
export default class UploadModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible

  @Prop()
  caseType

  @Prop()
  pageTitle

  resultModalVisible = false

  fileList = []

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

  public grid = {
  	rowKey: 'uid',
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
  			property: 'user',
  			title: '上傳人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'time',
  			title: '上傳時間',
  			formatter: (data) => this.$twDateTimeFormatter.stringify(data.time),
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

  created() {
  	this.user = this.$user.getMe();
  }

  closeModal() {
  	// 取消按鈕
  	this.$emit('closeModal');
  }

  add() {
  	// 確認/新增按鈕
  	this.$emit('confirmModal');
  }

  // API: 取得 可上傳格式
  async getApi_authorizationFileType() {
  	const $return = await this.$parameterApi.searchAllowedFileExtensionsInParameterUsingGET();
  	return $return.data.result;
  }

  async beforeUpload(file) {
  	console.log('file', file);
  	const canType = await this.getApi_authorizationFileType();
  	const typeArrStr = canType.reduce((a, b) => `${a}|${b}`);
  	const typeRegExp = new RegExp(`(${typeArrStr})$`);
  	// 格式判斷
  	if (!typeRegExp.test(file.name)) {
  		this.modalData = {
  		  autoClose: null,
  			content: '檔案格式不符，請重新選擇檔案',
  			type: 'warning',
  			title: '上傳提示',
  		};
  		this.$emit('setModal', this.modalData);
  		return false;
  	}

  	// 檔案size判斷
  	const isAcceptSize = 200 / 1024 / 1024 < file.size;
  	if (!isAcceptSize) {
  		this.modalData = {
  		  autoClose: null,
  			content: '檔案大小超過200MB，請重新選擇檔案',
  			type: 'warning',
  			title: '上傳提示',
  		};
  		this.$emit('setModal', this.modalData);
  		return false;
  	}

  	// 檔案後續處理
  	this.fileList = [...this.fileList, file];
  	const newFile = {
  		uid: file.uid,
  		fileName: file.name,
  		time: new Date(),
  		user: this.user.employee.name,
  	};
  	this.grid.data.push(newFile);
  }

  async confirmUpload() {
  	this.uploadErr = [];
  	if (this.fileList.length != 0) {
  		this.setLoading(true);
  		this.fileList.forEach((item) => {
  			this.promiseArray.push(this.uploadData(item.originFileObj));
  		});
  		await Promise.all(this.promiseArray)
  			.then((resp) => {
  				console.log(resp);
  			})
  			.catch(console.error)
  			.finally(() => {
  				this.setLoading(false);
  			});
  		this.grid.data = [];
  		this.fileList = [];
  		if (this.uploadErr.length == 0) {
  			this.modalData.autoClose = 3;
  			this.modalData.type = 'success';
  			this.modalData.title = '上傳成功';
  			this.$emit('setModal', this.modalData);
  			this.$emit('closeModal');
  		} else {
  			// table、list保留錯誤檔案
  			this.fileList = this.uploadErr;
  			this.fileList.map((item) => {
  		    this.grid.data.push({
  					uid: item.uid,
  					fileName: item.name,
  					time: new Date(),
  					user: this.user.employee.name,
  				});
  			});
  			this.modalData.autoClose = 3;
  			this.modalData.type = 'error';
  			this.modalData.title = '上傳失敗';
  			this.$emit('setModal', this.modalData);
  		}
  	} else {
    	this.modalData = {
  		  autoClose: null,
  			content: '請先選擇檔案',
  			type: 'warning',
  			title: '上傳提示',
  		};
  		this.$emit('setModal', this.modalData);
  	}
  }

  uploadData(file) {
  	return this.$dataCollectApi.uploadDataUsingPOST(this.caseType,	file).then((resp) => {
  			console.log(resp);
  	}).catch((err) => {
  		console.log(err);
  		this.uploadErr.push(file);
  	});
  }

  handleChange(e) {
  	this.fileList = this.fileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.fileList = e.fileList;
  		this.fileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			return val;
  		});
  	}
  }

  remove(data) {
  	console.log('刪除', data, this.fileList);
  	this.fileList = this.fileList.filter((item) => item.uid !== data.uid);
  	this.grid.data = this.grid.data.filter((item) => item.uid !== data.uid);
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
