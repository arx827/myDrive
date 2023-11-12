<template>
  <div>
    <div v-if="gridData.data.length > 0">
      <FblDataGrid
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
        :scroll="{ x: true }"
      >
        <template v-slot:fileNo="slotProps">
          <div
            class="text--green"
            @click="downloadFile(slotProps.data)"
          >
            {{ slotProps.data.fileNo }}
          </div>
        </template>
        <template v-slot:upload="slotProps">
          <a-upload
            name="file"
            accept=".pdf, .docx, .doc, .xls, .xlsx"
            :file-list="uploadedFileList"
            :custom-request="uploadFlie"
            :before-upload="beforeUpload"
            :show-upload-list="false"
            :disabled="slotProps.data.isClosed === '已結案'"
            @change="handleChange(slotProps.data, $event)"
          >
            <button
              class="icon__btn"
              :class="{'btn--disable':slotProps.data.isClosed === '已結案'}"
              :disabled="slotProps.data.isClosed === '已結案'"
            >
              <a-icon type="upload" />
            </button>
          </a-upload>
          <h6
            v-if="slotProps.data.isClosed !== '已結案' && form.find((e)=>e.reserveInfoId === slotProps.data.reserveInfoId).uploadFileId"
            class="mt-2"
            style="font-size: 12px; color:#23C4A8;"
          >
            已成功上傳<br>一份檔案
          </h6>
        </template>
        <template v-slot:isClosed="slotProps">
          <a-switch
            v-model="form[slotProps.data.rowkey - 1].isClosed"
            checked-children="結案"
            un-checked-children="未結"
            :class="{'switch--disable':slotProps.data.isClosed === '已結案'}"
            :disabled="slotProps.data.isClosed === '已結案'"
          />
        </template>
        <template v-slot:textarea="slotProps">
          <a-textarea
            v-model="form[slotProps.data.rowkey - 1].remark"
            :disabled="form[slotProps.data.rowkey - 1].isClosed"
            :auto-size="{ minRows: 5 }"
            placeholder="e.g. 已完成醫師諮詢。"
          />
        </template>
      </FblDataGrid>
    </div>
    <div
      v-else
      class="table__nodata"
    >
      <div class="border nodata__wrap">
        <div class="nodata__text">
          暫無資料
        </div>
        <img src="@/assets/images/image_nothing.svg">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { CaseMaintainWithPhyYearHisInputDto, CaseMaintainResultInputInfoDto } from '@fubonlife/oss-api-axios-sdk';
import infoModal from '@/plugins/notification/infoModal';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import notification from '@/plugins/notification/infoNotification';

@Component({
	components: { FblDataGrid },
})
export default class DoctorConsultCaseGrid extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  period: string

  @Prop()
  uid: number

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'formType',
  			title: '表單類別',
  			width: 100,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'formName',
  			title: '表單名稱',
  			width: 110,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'fileNo',
  			title: '表單項目/編號',
  			width: 200,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'execStatus',
  			title: '執行狀態',
  			width: 90,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'execDate',
  			title: '執行時間',
  			width: 130,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'upload',
  			title: '上傳附件',
  			width: 100,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'isClosed',
  			title: '結案狀態',
  			width: 100,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'textarea',
  			width: 200,
  		},
  	],
  }

  uploadedFileList = [];

  nowReserveInfoId = null;

  form = [];

  uploadFlie(options) {
  	// console.log(options);
  	if (this.beforeUpload) {
  		this.fetchUploadFile(options.file);
  	}
  }

  // 下載檔案
  downloadFile(data) {
  	if (!data.reserveInfoId) return;
  	this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST({ reserveInfoId: data.reserveInfoId }, { responseType: 'blob' })
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
  				this.$CaseMaintainUtilityApi.getphysicianDownLoadUsingPOST({ reserveInfoId: data.reserveInfoId })
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					})
  					.catch((error) => {
  						console.log(error);
  					})
  					.finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
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
  		'.pdf,.docx,.doc,.xls,.xlsx',
  		3,
  		1,
  	);
  	if (vaildResult.vaild == false) {
  		infoModal.alertError({ content: '限上傳 pdf、doc、docx、xls、xlsx 格式' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  resetFile() {
  	this.uploadedFileList = [];
  }

  resetCaseInfo() {
  	this.gridData.data = [];
  	this.form = [];
  }

  async handleChange(data, e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList.slice(-1);
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  				this.nowReserveInfoId = data.reserveInfoId;
  			}
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  	}
  }

  onSwitch(index) {
  	this.form[index].isClose = !this.form[index].isClose;
  }

  getFormData() {
  	if (this.gridData.data?.length === 0) {
  		return;
  	}
  	const formData = [];
  	const caseMaintainResultInputInfoDtoList: CaseMaintainResultInputInfoDto[] = JSON.parse(JSON.stringify(this.form));
  	caseMaintainResultInputInfoDtoList.map((el) => {
  		el.isClosed = el.isClosed ? 'Y' : 'N';
  	});
  	caseMaintainResultInputInfoDtoList.forEach((e, index) => {
  		// 無上傳過的附件的該筆才須送檢核
  		if (!this.gridData.data[index].fileNo || this.gridData.data[index].fileNo.length === 0) {
  			formData.push(e);
  		}
  	});
  	// TEST:
  	// console.log(caseMaintainResultInputInfoDtoList);
  	// console.log(JSON.stringify(caseMaintainResultInputInfoDtoList));
  	return formData;
  }

  // API: 2.1.1	個案維護-醫師諮詢年度歷程API
  fetchCaseMaintain() {
  	if (!sessionStorage.getItem('caseMaintainType')) {
  		return;
  	}
  	const srcFrom = JSON.parse(sessionStorage.getItem('caseMaintainType')).srcFrom;
  	const $form: CaseMaintainWithPhyYearHisInputDto = {
  		srcFrom,
  		uid: this.uid,
  		year: JSON.parse(this.period),
  	};
  	this.resetCaseInfo();
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.getPYHUsingPOST($form)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				const rawData = JSON.parse(JSON.stringify(resp.data.data));
  				rawData.forEach((el, index) => {
  					this.gridData.data.push({
  						rowkey: index + 1, ...el,
  					});
  					this.form.push({
  						isClosed: !!(el.isClosed === '已結案'),
  						remark: el.remark,
  						reserveInfoId: el.reserveInfoId,
  						srcFrom,
  						uploadFileId: null,
  					});
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 上傳檔案(醫生諮詢)
  fetchUploadFile(file) {
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.uploadFileAboutCaseMaintainUsingPOST(file)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status === 200) {
  				this.form.find((e) => e.reserveInfoId === this.nowReserveInfoId).uploadFileId = resp.data.data;
  				notification.success({ content: '上傳成功' });
  			} else {
  				notification.error({ content: resp.data.apiError && this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			notification.error({ content: '上傳失敗' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

	@Watch('period')
  periodOnChange(val) {
  	this.fetchCaseMaintain();
  }
}
</script>

<style lang="scss" scoped>
.icon__btn {
  background: #F5F8FC;
  border-radius: 16px;
  border: 0;
  width: 40px;
  height: 32px;
  color: #23C4A8;
  &:hover {
    color: #FFFFFF;
    background: #23C4A8;
    cursor: pointer;
		img {
			content: url("../../../../assets/images/button_mail_white.svg");
		}
  }
  img {
    margin: auto;
  }
}
.nodata__wrap {
  padding: 20px 0;
  width: 100%;
  text-align: center;
  .nodata__text {
    font-size: 20px;
    margin-bottom: 10px;
  }
  img {
    margin: auto;
  }
}
.table__nodata {
	margin-top: 25px;
  table {
    min-width: 100%;
  }
}
.btn--disable, .btn--disable:hover {
  background-color: #F5F5F5;
  color: #999999;
  cursor: not-allowed;
	img {
		content: url("../../../../assets/images/button_mail_gray.svg");
	}
}
.text--green {
  text-decoration: underline;
  color: #23C4A8;
  white-space: pre-line;
	cursor: pointer;
}
</style>
