<template>
  <div class="container">
    <h2 class="page__title">
      簡易人因工程檢核表
    </h2>
    <div class="page__subTitle">
      原始級別 : {{ levelDes }}
    </div>
    <div
      v-if="humanHazardCheckData"
      class="form"
    >
      <a-form-model
        ref="formRef"
        class="form__wrap"
        :model="form"
        :rules="formRules"
        layout="vertical"
        :hide-required-mark="false"
      >
        <a-form-model-item
          v-for="(data, idx) in humanHazardCheckData.humanHazardCheckTableTopicDetailDtos"
          :key="idx"
          :prop="data.topicId.toString()"
        >
          <div
            class="form__label d-flex"
            for=""
          >
            <span>{{ data.topicDesc }}</span>

            <span
              v-if="data.isRequire === 'Y'"
              class="mark__red"
            >＊</span>
          </div>
          <a-radio-group
            v-if="data.ansType === 2 || data.ansType === 1"
            v-model="form[data.topicId]"
            class="row w-100 g-3"
            :disabled="readOnly"
          >
            <div
              v-for="(item,index) in data.humanHazardCheckTableOptDtoList"
              :key="index"
              class="col-12 col-md-6"
            >
              <div class="col-12 form__radio">
                <a-radio
                  :value="item.optValue"
                  style="col-12"
                >
                  {{ item.optDesc }}
                </a-radio>
              </div>
            </div>
          </a-radio-group>
          <a-textarea
            v-if="data.ansType === 4"
            v-model="form[data.topicId]"
            placeholder="字數上限2000字"
            :disabled="readOnly"
            :max-length="2000"
          />
        </a-form-model-item>

        <a-form-model-item
          prop="remark"
        >
          <div
            slot="label"
            class="form__label d-flex"
          >
            <span>上傳附件<span style="font-weight: 300;">(上傳格式為PDF/WORD/EXCEL/TIF、檔案上限為3MB)</span></span>

            <span
              class="mark__red"
            >＊</span>
          </div>
          <a-upload
            class="form__upload"
            :accept="acceptType"
            :file-list="uploadedFileList"
            name="file"
            :custom-request="uploadFlie"
            :multiple="true"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <a-button
              class="btn__radius--primary btn__upload"
              :disabled="readOnly"
            >
              <a-icon type="upload" /> 上傳
            </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div
      v-if="!readOnly"
      class="btn__wrap d-flex justify-content-center"
    >
      <router-link :to="'/occupationSafety/Other/caseMaintain/list'">
        <button class="me-2 form__btn btn__radius--primary--outline">
          取消
        </button>
      </router-link>
      <button
        class="form__btn btn__radius--primary"
        @click="handleSubmit"
      >
        確認
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import HistoryModal from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/HistoryModal.vue';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import { Action } from 'vuex-class';
import { HumanHazardCheckTableAnsSaveDto } from '@fubonlife/oss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import infoModal from '@/plugins/notification/infoModal';
import notification from '@/plugins/notification/infoNotification';
import { UploadAPIUrl } from '@/plugins/uploadFile/UploadFetchAPI';

@Component({
	components: { HistoryModal },
})
export default class ErgonomicHazardForm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  caseId

  @Prop()
  readOnly

  @Prop()
  level

  title='人因危害預防'

  acceptType='.pdf,.doc,.docs,.tif,.xlsx,.xls,.docx'

  levelDes

  oriLevel = {
  	value: 'first',
  	label: '第一級',
  }

  uploadedFileList=[]

  form = {

  }

  files = null;

  fileName = null

  filePath = null

  formRules = {
  	// result: [
  	// 	{ required: true, message: '請選擇級別檢核結果', trigger: 'blur' },
  	// ],
  	// improve: [
  	// 	{ required: true, message: '請選擇簡易人因工程是否改善', trigger: 'change' },
  	// ],
  	// careerSick: [
  	// 	{ required: true, message: '請選擇是否具有職業病', trigger: 'change' },
  	// ],
  	// inform: [
  	// 	{ required: true, message: '請選擇是否通報', trigger: 'change' },
  	// ],
  	// changeReason: [
  	// 	{ required: false, message: '請選擇是否通報', trigger: 'change' },
  	// ],
  }

  humanHazardCheckData = null;

  uploadFlie(options) {
  	if (this.beforeUpload) {
  		this.uploadApi(options.file);
  	}
  }

  resetFile() {
  	this.uploadedFileList = [];
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
  		5,
  	);
  	if (vaildResult.vaild == false) {
  		return false;
  	}
  	return vaildResult.vaild;
  }

  handleChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'valid',
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
  }

  handleSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.saveForm();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 2.2.9	儲存簡易人因工程檢核表API
  saveForm() {
  	if (!this.files) {
  		infoModal.alertError({ content: '請上傳檔案!' });
  		return;
  	}
  	const data = {
  		recordId: this.humanHazardCheckData.recordId,
  		formType: 'F0205',
  		humanHazardCheckTableTopicDetailDtos: null,
  	};

  	this.humanHazardCheckData.humanHazardCheckTableTopicDetailDtos.forEach((element) => {
  		Object.entries(this.form).forEach(([key, val]) => {
  			if (element.topicId == key) {
  				element.ans = val;
  			}
  		});
  	});

  	data.humanHazardCheckTableTopicDetailDtos = this.humanHazardCheckData.humanHazardCheckTableTopicDetailDtos;

  	console.log(data);
  	this.$customUpload.fetchAPI(
  		UploadAPIUrl.ERGONOMICSIMPLEFORMSAVE,
  		'ansSaveDto',
  		data,
  		'file',
  		[this.files],
  		(resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'CaseMaintainResult',
  				params: {
  					type: 'edit',
  				},
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
  	);
  	// this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanHazardCheckTableUpdateUsingPOST(data)
  	// 	.then((resp) => {
  	// 		this.$global.changeRouterAndaddParam({
  	// 			toRouter: 'CaseMaintainResult',
  	// 			params: {
  	// 				type: 'edit',
  	// 			},
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

  // 2.2.8	查詢簡易人因工程檢核表API
  queryForm() {
  	const caseId = this.caseId || this.$global.getQuery().caseId;
  	this.levelDes = this.level || this.$global.getQuery().level;
  	this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanHazardCheckTableQuerryUsingPOST({
  		caseId,
  		formName: 'F0205',
  	})
  		.then((resp) => {
  			console.log(resp.data.data);
  			this.humanHazardCheckData = resp.data.data;
  			// 建立form
  			resp.data.data.humanHazardCheckTableTopicDetailDtos.forEach((element) => {
  				// this.form[element.topicId] = element.ans;
  				this.$set(this.form, element.topicId, element.ans);
  				if (element.isRequire === 'Y') {
  					this.formRules[element.topicId] = [{ required: true, message: '此欄位為必填', trigger: 'blur' }];
  				}
  			});
  			console.log(this.form);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 上傳簡易人因工程檢核表
  uploadApi(file) {
  	this.files = file;
  	// this.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi.humanHazardCheckTableFileUploadUsingPOST(file)
  	// 	.then((resp) => {
  	// 		this.fileName = resp.data.data.fileName;
  	// 		this.filePath = resp.data.data.filePath;
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 		notification.error({ content: '上傳失敗' });
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  created() {
  	this.queryForm();
  }
}

</script>

<style lang="scss" scoped>
.form__label {
  color: #000000;
  font-weight: 600;
  margin-bottom: 10px;
  >*{
    font-size: 16px;
  }
  .mark__red {
    color: #FC001A;
    font-size: 22px;
  }
}
.page__subTitle{
  background: $COLOR-MAIN1;
  color:#fff;
  padding: 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
}
.form{
  background:$COLOR-MAIN10;
  padding-top: 20px;
  padding-bottom: 30px;
}
::v-deep .form__wrap{
  width: 50%;
  margin: 0 auto;
  .ant-form-item-label > label span span{
    font-weight: 400;
    color:#363636
  }
}
.form__radio{
  background: #fff;
  box-sizing: border-box;
  padding: 12px;
}
::v-deep .form__upload{
  .ant-upload-list-item-name{
    width: auto;
  }
  .ant-upload-list-item-card-actions{
    right: auto;
  }
}
.btn__upload {
    border-radius: 4px;
    background: $COLOR-MAIN15;
    border:none;
  }
</style>
