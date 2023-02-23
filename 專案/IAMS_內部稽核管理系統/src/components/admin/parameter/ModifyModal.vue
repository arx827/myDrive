<template>
  <InfoModal
    :title="type == 'edit' ? '編輯' : '新增／預覽'"
    :visible="visible"
    :centered="true"
    :width="'80%'"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="form mt-2">
          <a-form-model
            ref="formRef"
            :model="form"
            :rules="formRules"
          >
            <div class="form__group mb-3">
              <div class="title mb-2">
                用途
              </div>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="sysCodeMainId"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">系統代碼</span>
                    <a-input
                      v-model="form.sysCodeMainId"
                      :disabled="mainDisabled"
                      :max-length="50"
                      class="w-100"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    prop="defaultTextInSysCodeMain"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">系統代碼的預設值</span>
                    <a-input
                      v-model="form.defaultTextInSysCodeMain"
                      :disabled="mainDisabled"
                      :max-length="200"
                      class="w-100"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="doubleCheck"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">是否要特別授權</span>
                    <a-radio-group
                      v-model="form.doubleCheck"
                      :disabled="mainDisabled"
                      class="w-100"
                    >
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    style="display: block"
                    prop="remarkInSysCodeMain"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <span slot="label">備註</span>
                    <a-textarea
                      v-model="form.remarkInSysCodeMain"
                      :disabled="mainDisabled"
                      :max-length="150"
                      class="w-100 remark"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>

            <div class="form__group mb-3">
              <div class="title mb-2">
                大分類
              </div>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="sysCodeDetailId"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">系統代碼</span>
                    <a-input
                      v-model="form.sysCodeDetailId"
                      :disabled="detailDisabled"
                      :max-length="50"
                      class="w-100"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    prop="sequenceInSysCodeDetail"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">顯示順序</span>
                    <a-input-number
                      v-model="form.sequenceInSysCodeDetail"
                      :disabled="detailDisabled"
                      class="w-100"
                      :min="0"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    prop="defaultTextInSysCodeDetail"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <span slot="label">系統代碼的預設值</span>
                    <a-input
                      v-model="form.defaultTextInSysCodeDetail"
                      :disabled="detailDisabled || detailAttachmentReadOnly"
                      :max-length="200"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col
                  :span="8"
                  :offset="4"
                >
                  <a-upload
                    v-if="!isReadonly()"
                    :file-list="detailFileList"
                    :show-upload-list="false"
                    :disabled="detailDisabled"
                    :before-upload="beforeUploadDetailAttachment"
                    :custom-request="uploadFile"
                    @change="uploadDetailAttachment"
                  >
                    <button
                      class="btn--primary me-2"
                      :disabled="detailDisabled"
                    >
                      <a-icon type="upload" />上傳
                    </button>
                  </a-upload>

                  <button
                    class="btn--primary me-2"
                    :disabled="isDetailDownload()"
                    @click="downloadDetailAttachment"
                  >
                    <a-icon type="download" />下載
                  </button>

                  <button
                    v-if="!isReadonly()"
                    class="btn--primary me-2"
                    :disabled="detailDisabled || disabledDetailHasUpload"
                    @click="removeDetailAttachment"
                  >
                    <a-icon type="delete" />刪除
                  </button>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="enabledInDetail"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">是否啟用</span>
                    <a-radio-group
                      v-model="form.enabledInDetail"
                      :disabled="detailDisabled"
                      class="w-100"
                    >
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    style="display: block"
                    prop="remarkInSysCodeDetail"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <span slot="label">備註</span>
                    <a-textarea
                      v-model="form.remarkInSysCodeDetail"
                      :disabled="detailDisabled || detailAttachmentReadOnly"
                      :max-length="150"
                      class="w-100 remark"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>

            <div class="form__group">
              <div class="title mb-2">
                小分類
              </div>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="sysCodeGroupId"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">系統代碼</span>
                    <a-input
                      v-model="form.sysCodeGroupId"
                      :disabled="groupDisabled"
                      :max-length="50"
                      class="w-100"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item
                    prop="sequenceInSysCodeGroup"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">顯示順序</span>
                    <a-input-number
                      v-model="form.sequenceInSysCodeGroup"
                      :disabled="groupDisabled"
                      class="w-100"
                      :min="0"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    prop="defaultTextInSysCodeGroup"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <span slot="label">系統代碼的預設值</span>
                    <a-input
                      v-model="form.defaultTextInSysCodeGroup"
                      :disabled="groupDisabled || groupAttachmentReadOnly"
                      :max-length="200"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col
                  :span="8"
                  :offset="4"
                >
                  <a-upload
                    :file-list="groupFileList"
                    :show-upload-list="false"
                    :disabled="groupDisabled"
                    :before-upload="beforeUploadGroupAttachment"
                    :custom-request="uploadFile"
                    @change="uploadGroupAttachment"
                  >
                    <button
                      v-if="!isReadonly()"
                      class="btn--primary me-2"
                      :disabled="groupDisabled"
                    >
                      <a-icon type="upload" />上傳
                    </button>
                  </a-upload>
                  <button
                    class="btn--primary me-2"
                    :disabled="isGroupDownload()"
                    @click="downloadGroupAttachment"
                  >
                    <a-icon type="download" />下載
                  </button>
                  <button
                    v-if="!isReadonly()"
                    class="btn--primary me-2"
                    :disabled="groupDisabled || disabledGroupHasUpload"
                    @click="removeGroupAttachment"
                  >
                    <a-icon type="delete" />刪除
                  </button>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item
                    prop="enabledInGroup"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                  >
                    <span slot="label">是否啟用</span>
                    <a-radio-group
                      v-model="form.enabledInGroup"
                      :disabled="groupDisabled"
                      class="w-100"
                    >
                      <a-radio :value="true">
                        是
                      </a-radio>
                      <a-radio :value="false">
                        否
                      </a-radio>
                    </a-radio-group>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item
                    style="display: block"
                    prop="remarkInSysCodeGroup"
                    :label-col="{ span: 4 }"
                    :wrapper-col="{ span: 20 }"
                  >
                    <span slot="label">備註</span>
                    <a-textarea
                      v-model="form.remarkInSysCodeGroup"
                      :disabled="groupDisabled || groupAttachmentReadOnly"
                      :max-length="150"
                      class="w-100 remark"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
        <div class="d-flex mt-4 justify-content-end">
          <button
            v-if="!isReadonly()"
            class="btn--primary me-2"
            @click="submit"
          >
            {{ initData ? '確認' : '新增' }}
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
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { CreateSysCode, Resource } from '@fubonlife/iams-api-axios-sdk';
import { Action, namespace } from 'vuex-class';
import { UploadFile } from 'ant-design-vue/types/upload';
import UploadModal from '@/components/crawlerData/crawlerUpload/UploadModal.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';

const modalControl = namespace('modalControl');

@Component({
	components: {
		InfoModal, UploadModal, IconTextButton,
	},
})
export default class ModifyModal extends Vue {
	@Action('setLoading') setLoading;

	@Prop()
	visible: boolean;

	@Prop()
	initData;

	@Prop()
	type;

	@Watch('visible')
	watchVisible() {
		this.detailAttachmentReadOnly = false;
		this.groupAttachmentReadOnly = false;
		this.initTmpAttachment();
		if (this.type == 'edit') {
			this.form = this.$global.deepCopyData(this.initData);
			if (this.form.remarkInSysCodeDetail != null && this.form.remarkInSysCodeDetail.indexOf('attachmentId=') > -1) {
				const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeDetail);
				this.tmpAttachment.detail.uid = attachmentId;
				this.tmpAttachment.detail.attachmentId = attachmentId;
				this.tmpAttachment.detail.fileName = this.form.defaultTextInSysCodeDetail;
				this.detailAttachmentReadOnly = true;
			}
			if (this.form.remarkInSysCodeGroup != null && this.form.remarkInSysCodeGroup.indexOf('attachmentId=') > -1) {
				const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeGroup);
				this.tmpAttachment.group.uid = attachmentId;
				this.tmpAttachment.group.attachmentId = attachmentId;
				this.tmpAttachment.group.fileName = this.form.defaultTextInSysCodeGroup;
				this.groupAttachmentReadOnly = true;
			}
		} else if (this.type == 'readonly') {
			this.initReadonly();
		} else {
			this.form = this.$global.deepCopyData(this.initForm);
		}
	}

	@modalControl.Action('setModalState') setModalState; // 全域 狀態彈窗

	@modalControl.Getter('getResultModal') getResultModal;

	initForm = {
		sysCodeMainId: '',
		defaultTextInSysCodeMain: '',
		doubleCheck: false,
		editableInSysCodeMain: true,
		remarkInSysCodeMain: '',

		sysCodeDetailId: '',
		defaultTextInSysCodeDetail: '',
		sequenceInSysCodeDetail: undefined,
		enabledInDetail: true,
		editableInSysCodeDetail: true,
		remarkInSysCodeDetail: '',

		sysCodeGroupId: '',
		defaultTextInSysCodeGroup: '',
		sequenceInSysCodeGroup: undefined,
		enabledInGroup: true,
		editableInSysCodeGroup: true,
		remarkInSysCodeGroup: '',
	};

	// 上傳檔案參數
  detailFileList: UploadFile[] = [];

  groupFileList: UploadFile[] = [];

  tmpAttachment = {
  	detail: {
  		uid: '',
  		attachmentId: '',
  		fileName: '',
  	},
  	group: {
  		uid: '',
  		attachmentId: '',
  		fileName: '',
  	},
  }

	canType = [];
	// 上傳檔案參數 end

	form: CreateSysCode = null;

	mainDisabled: boolean = false;

	detailDisabled: boolean = true;

	groupDisabled: boolean = true;

  detailAttachmentReadOnly: boolean = false;

  groupAttachmentReadOnly: boolean = false;

	formRules: { [key: string]: ValidationRule[] } = {
		sysCodeMainId: [
			{ required: true, validator: this.codeIdRule, trigger: 'change' },
		],
		defaultTextInSysCodeMain: [
			{ required: true, message: '請輸入系統代碼的預設值', trigger: 'change' },
		],
		doubleCheck: [
			{ required: true, message: '請選擇是否啟用', trigger: 'change' },
		],
		editableInSysCodeMain: [
			{ required: true, message: '請選擇是否能修改預設值', trigger: 'change' },
		],

		sysCodeDetailId: [
			{ required: false, validator: this.codeIdRule, trigger: 'change' },
		],
		defaultTextInSysCodeDetail: [
			{
				required: this.initForm.sysCodeDetailId != '',
				message: '請輸入系統代碼的預設值',
				trigger: 'change',
			},
		],
		sequenceInSysCodeDetail: [
			{
				required: this.initForm.sysCodeDetailId != '',
				message: '請輸入顯示順序',
				trigger: 'change',
			},
		],
		enabledInDetail: [
			{
				required: this.initForm.sysCodeDetailId != '',
				message: '請選擇是否啟用',
				trigger: 'change',
			},
		],
		editableInSysCodeDetail: [
			{
				required: this.initForm.sysCodeDetailId != '',
				message: '請選擇是能修改預設值',
				trigger: 'change',
			},
		],

		sysCodeGroupId: [
			{ required: false, validator: this.codeIdRule, trigger: 'change' },
		],
		defaultTextInSysCodeGroup: [
			{
				required: this.initForm.sysCodeGroupId != '',
				message: '請輸入系統代碼的預設值',
				trigger: 'change',
			},
		],
		sequenceInSysCodeGroup: [
			{
				required: this.initForm.sysCodeGroupId != '',
				message: '請輸入顯示順序',
				trigger: 'change',
			},
		],
		enabledInGroup: [
			{
				required: this.initForm.sysCodeGroupId != '',
				message: '請選擇是否啟用',
				trigger: 'change',
			},
		],
		editableInSysCodeGroup: [
			{
				required: this.initForm.sysCodeGroupId != '',
				message: '請選擇是否能修改預設值',
				trigger: 'change',
			},
		],
	};

	// 系統代碼檢查規則
	codeIdRule(rule, value, callback) {
		const re = /^(?:[a-zA-Z]|_|\*|-|\d)*$/;

		if (rule.required || !(value == '' || value == undefined)) {
			if (re.test(value) && !(value == '' || value == undefined)) {
				callback();
			} else {
				callback('請輸入英數字或下底線或*或-');
			}
		} else {
			callback();
		}
	}

	created() {
		this.form = this.$global.deepCopyData(this.initForm);
		this.getApi_authorizationFileType();
	}

	// API: 取得 可上傳格式
	getApi_authorizationFileType() {
  	const $return = this.$parameterApi.searchAllowedFileExtensionsInParameterUsingGET()
			.then((res) => {
				this.canType = res.data.result;
			});
	}

	initReadonly() {
		const lodData = this.$global.deepCopyData(this.initData);
		const jsonResult = JSON.parse(lodData.jsonString);
		let sysCodeMain = null;
		let sysCodeDetail = null;
		let sysCodeGroup = null;
		if (jsonResult.sysCodeGroupId) {
			sysCodeGroup = jsonResult;
			sysCodeDetail = jsonResult.sysCodeDetail;
			sysCodeMain = sysCodeDetail.sysCodeMain;
		} else if (jsonResult.sysCodeDetailId) {
			sysCodeDetail = jsonResult;
			sysCodeMain = sysCodeDetail.sysCodeMain;
		} else {
			sysCodeMain = jsonResult;
		}

		this.form = {
			sysCodeMainId: sysCodeMain.sysCodeMainId,
			defaultTextInSysCodeMain: sysCodeMain.defaultText,
			doubleCheck: sysCodeMain.doubleCheck,
			editableInSysCodeMain: sysCodeMain.editable,
			remarkInSysCodeMain: sysCodeMain.remark,

			sysCodeDetailId: sysCodeDetail ? sysCodeDetail.sysCodeDetailId : '',
			defaultTextInSysCodeDetail: sysCodeDetail ? sysCodeDetail.defaultText : '',
			sequenceInSysCodeDetail: sysCodeDetail ? sysCodeDetail.sequence : undefined,
			enabledInDetail: sysCodeDetail ? sysCodeDetail.enabled : true,
			editableInSysCodeDetail: sysCodeDetail ? sysCodeDetail.editable : false,
			remarkInSysCodeDetail: sysCodeDetail ? sysCodeDetail.remark : '',

			sysCodeGroupId: sysCodeGroup ? sysCodeGroup.sysCodeGroupId : '',
			defaultTextInSysCodeGroup: sysCodeGroup ? sysCodeGroup.defaultText : '',
			sequenceInSysCodeGroup: sysCodeGroup ? sysCodeGroup.sequence : undefined,
			enabledInGroup: sysCodeGroup ? sysCodeGroup.enabled : true,
			editableInSysCodeGroup: sysCodeGroup ? sysCodeGroup.editable : false,
			remarkInSysCodeGroup: sysCodeGroup ? sysCodeGroup.remark : '',
		};
		this.tmpAttachment.detail.uid = this.convertAttachmentId(this.form.remarkInSysCodeDetail);
		this.tmpAttachment.group.uid = this.convertAttachmentId(this.form.remarkInSysCodeGroup);
	}

	isUpdate() {
		return this.type == 'edit';
	}

	// 是否為預覽模式
	isReadonly() {
		return this.type && this.type == 'readonly';
	}

	// Detail 下載按鈕判斷
	isDetailDownload() {
		if (this.isReadonly() && !this.disabledDetailHasUpload) {
			return false;
		}
		return this.groupDisabled || this.disabledDetailHasUpload;
	}

	// Group 下載按鈕判斷
	isGroupDownload() {
		if (this.isReadonly() && !this.disabledGroupHasUpload) {
			return false;
		}
		return this.groupDisabled || this.disabledGroupHasUpload;
	}

	submit() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				console.log('form', this.form);
				this.setLoading(true);
				const title = this.type == 'edit' ? '編輯' : '新增';
				if (this.isUpdate()) {
					this.uploadAttachment().then(() => {
						this.sendSubmit();
					});
				} else {
					this.sendSubmit();
				}
			}
		});
	}

	sendSubmit() {
		const title = this.type == 'edit' ? '編輯' : '新增';

		this.$parameterApi
			.saveInParameterUsingPOST(this.form)
			.then((resp) => {
				if (resp.data.success) {
					this.$emit('closeModal', this.form);
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'success',
							title: `${title}成功`,
						},
					});
				} else {
					this.setModalState({
						resultModal: {
							visible: true,
							type: 'error',
							title: `${title}失敗`,
							content: resp.data.message,
						},
					});
				}
			})
			.catch((err) => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: `${title}失敗`,
						content: err.response.data.message,
					},
				});
			})
			.finally(() => {
				// 初始化暫存檔案參數
				this.initTmpAttachment();
				this.setLoading(false);
			});
	}

	initTmpAttachment() {
		this.detailFileList = [];
		this.groupFileList = [];
		this.tmpAttachment = {
			detail: {
				uid: '',
				attachmentId: '',
				fileName: '',
			},
			group: {
				uid: '',
				attachmentId: '',
				fileName: '',
			},
		};
	}

	initDetailAttachment() {
		this.form.defaultTextInSysCodeDetail = '';
		this.form.remarkInSysCodeDetail = '';
		this.tmpAttachment.detail.uid = '';
		this.tmpAttachment.detail.attachmentId = '';
		this.tmpAttachment.detail.fileName = '';
		this.detailAttachmentReadOnly = false;
		this.detailFileList = [];
	}

	initGroupAttachment() {
		this.form.defaultTextInSysCodeGroup = '';
		this.form.remarkInSysCodeGroup = '';
		this.tmpAttachment.group.uid = '';
		this.tmpAttachment.group.attachmentId = '';
		this.tmpAttachment.group.fileName = '';
		this.groupAttachmentReadOnly = false;
	}

	get disabledDetailHasUpload() {
		return this.tmpAttachment.detail.uid == '';
	}

	get disabledGroupHasUpload() {
		return this.tmpAttachment.group.uid == '';
	}

	closeModal() {
		this.$emit('closeModal');
	}

	/**
	 * 監聽
	 */
	@Watch('form', { deep: true })
	watchForm() {
		if (this.type == 'readonly') {
			this.mainDisabled = true;
			this.detailDisabled = true;
			this.groupDisabled = true;
			return;
		}
		this.mainDisabled = false;
		// 更新disabled狀態
		this.detailDisabled = !(
			this.form.sysCodeMainId && this.form.defaultTextInSysCodeMain
		);
		this.groupDisabled = !(
			this.form.sysCodeDetailId && this.form.defaultTextInSysCodeDetail
		);

		// 更新必填驗證
		this.formRules.defaultTextInSysCodeDetail[0].required =			!!this.form.sysCodeDetailId;
		this.formRules.sequenceInSysCodeDetail[0].required =			!!this.form.sysCodeDetailId;
		this.formRules.enabledInDetail[0].required = !!this.form.sysCodeDetailId;
		this.formRules.editableInSysCodeDetail[0].required =			!!this.form.sysCodeDetailId;
		this.formRules.defaultTextInSysCodeGroup[0].required =			!!this.form.sysCodeGroupId;
		this.formRules.sequenceInSysCodeGroup[0].required =			!!this.form.sysCodeGroupId;
		this.formRules.enabledInGroup[0].required = !!this.form.sysCodeGroupId;
		this.formRules.editableInSysCodeGroup[0].required =			!!this.form.sysCodeGroupId;
	}

	uploadDetailAttachment(info) {
		if (info.file.status == 'done') {
			const firstFile = info.fileList[0];
			this.detailAttachmentReadOnly = true;
			const fileName = firstFile.name;
			if (!this.validatorFileExt(firstFile)) {
				this.form.defaultTextInSysCodeDetail = '';
				this.uploadFileValidationMsg();
				return;
			}

			this.form.defaultTextInSysCodeDetail = fileName.substring(0, fileName.lastIndexOf('.'));
			if (this.isUpdate()) {
				return;
			}

			const attachmentId = info.file.response.result.attachmentId;
			this.form.remarkInSysCodeDetail = `attachmentId=${attachmentId}`;
			this.tmpAttachment.detail.uid = info.file.uid;
			this.tmpAttachment.detail.attachmentId = attachmentId;
			this.tmpAttachment.detail.fileName = fileName;
		} else if (info.file.status == 'removed') {
			const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeDetail);
		  const fileName = this.form.defaultTextInSysCodeDetail;
			this.removeAttachment(attachmentId, fileName);
			this.initDetailAttachment();
		}
	}

	uploadGroupAttachment(info) {
		if (info.file.status == 'done') {
			const firstFile = info.fileList[0];
			this.groupAttachmentReadOnly = true;
			const fileName = firstFile.name;
			if (!this.validatorFileExt(firstFile)) {
				this.form.defaultTextInSysCodeGroup = '';
				this.uploadFileValidationMsg();
				return;
			}

			this.form.defaultTextInSysCodeGroup = fileName.substring(0, fileName.lastIndexOf('.'));
			if (this.isUpdate()) {
				return;
			}

			const attachmentId = info.file.response.result.attachmentId;
			this.form.remarkInSysCodeGroup = `attachmentId=${attachmentId}`;
			this.tmpAttachment.group.uid = info.file.uid;
			this.tmpAttachment.group.attachmentId = attachmentId;
			this.tmpAttachment.group.fileName = fileName;
		} else if (info.file.status == 'removed') {
			const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeGroup);
		  const fileName = this.form.defaultTextInSysCodeGroup;
			this.removeAttachment(attachmentId, fileName);
			this.initGroupAttachment();
		}
	}

	removeAttachment(attachmentId, fileName) {
		if (attachmentId !== '' && fileName !== '' && !this.isUpdate()) {
			this.$parameterApi.removeAttachmentInParameterUsingDELETE(attachmentId, fileName);
		}
	}

	validatorFileExt(file) {
  	const typeArrStr = this.canType.reduce((a, b) => `${a}|${b}`);
  	const typeRegExp = new RegExp(`(${typeArrStr})$`);
  	// 格式判斷
  	if (!typeRegExp.test(file.name)) {
  		return false;
  	}
		return true;
	}

	uploadFileValidationMsg() {
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

	beforeUploadDetailAttachment(file, fileList: UploadFile[]) {
		if (this.tmpAttachment.detail.uid !== '' && file.uid !== this.tmpAttachment.detail.uid) {
			const attachmentId = this.tmpAttachment.detail.attachmentId;
		  const fileName = this.tmpAttachment.detail.fileName;
			this.removeAttachment(attachmentId, fileName);
		}
		this.detailFileList = [file];
	}

	beforeUploadGroupAttachment(file, fileList: UploadFile[]) {
		if (this.tmpAttachment.group.uid !== '' && file.uid !== this.tmpAttachment.group.uid) {
			const attachmentId = this.tmpAttachment.group.attachmentId;
		  const fileName = this.tmpAttachment.group.fileName;
			this.removeAttachment(attachmentId, fileName);
		}
		this.groupFileList = [file];
	}

	uploadAttachment() {
		const detailUploadPromise = new Promise((resolve) => {
			if (this.detailFileList.length == 0) {
				resolve(null);
				return;
			}

			this.$parameterApi.uploadAttachmentInParameterUsingPOST(this.detailFileList[0])
				.then((response) => {
					const attachmentId = response.data.result.attachmentId;
					const fileName = response.data.result.fileName;
					this.form.defaultTextInSysCodeDetail = fileName;
					this.form.remarkInSysCodeDetail = `attachmentId=${attachmentId}`;
					this.tmpAttachment.detail.uid = attachmentId;
					this.tmpAttachment.detail.attachmentId = attachmentId;
					this.tmpAttachment.detail.fileName = fileName;
					this.detailAttachmentReadOnly = true;
					resolve(response);
				});
		});

		const groupUploadPromise = new Promise((resolve) => {
			if (this.groupFileList.length == 0) {
				resolve(null);
				return;
			}
			this.$parameterApi.uploadAttachmentInParameterUsingPOST(this.groupFileList[0])
				.then((response) => {
					const attachmentId = response.data.result.attachmentId;
					const fileName = response.data.result.fileName;
					this.form.defaultTextInSysCodeGroup = fileName;
					this.form.remarkInSysCodeGroup = `attachmentId=${attachmentId}`;
					this.tmpAttachment.group.uid = attachmentId;
					this.tmpAttachment.group.attachmentId = attachmentId;
					this.tmpAttachment.group.fileName = fileName;
					this.groupAttachmentReadOnly = true;
					resolve(response);
				});
		});

		return Promise.all([detailUploadPromise, groupUploadPromise]);
	}

	downloadDetailAttachment() {
		const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeDetail);
		const fileName = this.form.defaultTextInSysCodeDetail;
		this.$parameterApi.downloadAttachmentInParameterUsingGET(attachmentId, fileName, {	responseType: 'blob' })
			.then((response) => {
				this.downloadFile(response);
			}).catch(() => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '下載檔案失敗',
					},
				});
			});
	}

	downloadGroupAttachment() {
		const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeGroup);
		const fileName = this.form.defaultTextInSysCodeGroup;
		this.$parameterApi.downloadAttachmentInParameterUsingGET(attachmentId, fileName, { responseType: 'blob' })
			.then((response) => {
				this.downloadFile(response);
			}).catch(() => {
				this.setModalState({
					resultModal: {
						visible: true,
						type: 'error',
						title: '下載檔案失敗',
					},
				});
			});
	}

	removeDetailAttachment() {
		const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeDetail);
		const fileName = this.form.defaultTextInSysCodeDetail;
		this.removeAttachment(attachmentId, fileName);
		this.initDetailAttachment();
	}

	removeGroupAttachment() {
		const attachmentId = this.convertAttachmentId(this.form.remarkInSysCodeGroup);
		const fileName = this.form.defaultTextInSysCodeGroup;
		this.removeAttachment(attachmentId, fileName);
		this.initGroupAttachment();
	}

	convertAttachmentId(remark) {
		return remark != null && remark.indexOf('=') > -1 ? remark.substring(remark.indexOf('=') + 1) : '';
	}

	downloadFile(response) {
		const blob = response.data as Blob;
		const blobUrl = URL.createObjectURL(blob);
		const downloadlink: HTMLAnchorElement = document.createElement('a');
		const downloadName = this.getContentDisposition(response.headers);
		downloadlink.setAttribute('href', blobUrl);
		downloadlink.setAttribute('download', `${downloadName}`);
		downloadlink.click();
		downloadlink.remove();
	}

	getContentDisposition(headers) {
		const contentDisposition = headers['content-disposition'];
		const fileName = contentDisposition.substring(contentDisposition.indexOf('filename=') + 9).replaceAll('"', '');
		return decodeURI(fileName);
	}

	uploadFile({
		onSuccess, onError, file, onProgress,
	}) {
		const config = {
			onUploadProgress: (event) => {
				onProgress({ percent: (event.loaded / event.total) * 100 }, file);
			},
		};
		if (this.isUpdate()) {
			onSuccess(file);
		} else {
			if (!this.validatorFileExt(file)) {
				this.uploadFileValidationMsg();
				onError('fail');
				return;
			}
			this.$parameterApi.uploadAttachmentInParameterUsingPOST(file, config)
				.then((res) => {
					onSuccess(res.data);
				})
				.catch((err) => {
					onError(err);
				});
		}
	}
}
</script>

<style lang="scss" scoped>
.form {
	background-color: $BG-LIGHT;
	padding: 18px 30px;
	.form__group {
		padding: 10px 24px;
		border: 1px solid $COLOR-MAIN5;
		.title {
			font-size: 20px;
			font-weight: 500;
			color: $COLOR-MAIN1;
		}
	}
	::v-deep {
		.ant-form-item {
			display: flex;
			align-items: center;
			.ant-form-item-label {
				.ant-form-item-required::before {
					font-family: inherit;
					font-size: 22px;
					font-weight: bold;
					position: relative;
					top: 8px;
				}
				span {
					font-size: 14px;
					font-weight: bold;
				}
			}
		}
		.ant-input-group {
			display: flex;
		}
		.remark {
			min-height: 76px;
		}
	}
}
::v-deep .ant-radio-group {
	display: flex;
	align-items: center;
	.ant-radio-wrapper {
		display: flex;
		.ant-radio-inner {
			width: 24px;
			height: 24px;
			border-color: $COLOR-MAIN1;
		}
		.ant-radio-inner::after {
			width: 14px;
			height: 14px;
			top: 4px;
			left: 4px;
			background-color: $COLOR-MAIN1;
		}
	}
}

</style>
