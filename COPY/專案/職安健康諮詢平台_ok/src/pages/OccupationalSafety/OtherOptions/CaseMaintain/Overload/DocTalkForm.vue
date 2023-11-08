<template>
  <div class="container">
    <div class="page__title">
      醫師面談結果及採行措施表
    </div>

    <a-form-model
      ref="formRef"
      :model="form"
      :rules="formRules"
      :form="form"
      :hide-required-mark="true"
      :layout="'vertical'"
      :colon="false"
    >
      <div
        v-for="(item, index) in questFormData"
        :key="index"
        class="form__block"
      >
        <div class="form__block__title">
          {{ item.title === 'E0601' ? '醫師面談指導' : '採行措施建議' }}
        </div>
        <a-row :gutter="[16,8]">
          <a-col
            v-for="(topic, idxOfTopic) in item.topics"
            :key="idxOfTopic"
            :xs="topic.colSpan && topic.colSpan[0]"
            :md="topic.type === 'DatePicker' ? 12 : topic.colSpan && topic.colSpan[1] "
          >
            <a-form-model-item
              :prop="topic.key"
            >
              <span slot="label">
                {{ topic.desc }}
                <span
                  v-if="topic.isWrite === 'Y'"
                  class="mark-required"
                >*</span>
              </span>
              <template v-if="topic.type === 'RadioButton'">
                <a-radio-group
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  class="radioGroup__block"
                >
                  <a-radio
                    v-for="opt in topic.opts"
                    :key="opt.optId"
                    :value="opt.optId"
                    class="radio__block--margin"
                  >
                    {{ opt.desc }}
                  </a-radio>
                </a-radio-group>
              </template>
              <template v-if="topic.type=='CheckBox'">
                <a-checkbox-group
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  @change="onChange"
                >
                  <a-checkbox
                    v-for="opt in topic.opts"
                    :key="opt.optId"
                    :value="opt.optId"
                    class="checkbox__input"
                    :class="{'formItem__hasDesc': opt.optDesc=='Y' && opt.isOnlyCheck!='Y'}"
                  >
                    {{ opt.desc }}
                    <template v-if="opt.optDesc=='Y' && form[topic.key] && form[topic.key].indexOf(opt.optId) >= 0">
                      <a-form-model-item
                        :prop="`opt_${opt.optId}`"
                      >
                        <a-textarea
                          v-if="opt.isOnlyCheck=='Y' "
                          v-model="form[`opt_${opt.optId}`]"
                          class="checkbox__textarea"
                          placeholder="請簡述，字數上限100字。"
                          :auto-size="{ minRows: 1 }"
                        />
                        <a-input
                          v-else
                          v-model="form[`opt_${opt.optId}`]"
                          class="input_desc"
                          allow-clear
                          placeholder="請簡述原因，文字上限50字。"
                        />
                      </a-form-model-item>
                    </template>
                  </a-checkbox>
                </a-checkbox-group>
              </template>
              <template v-if="topic.type === 'T/F'">
                <a-radio-group
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  class="radioGroup__block"
                >
                  <a-radio
                    v-for="opt in topic.opts"
                    :key="opt.optId"
                    :value="opt.optId"
                    class="radio__block--margin"
                  >
                    {{ opt.desc }}
                  </a-radio>
                </a-radio-group>
              </template>
              <template v-if="topic.type === 'TextAera'">
                <a-textarea
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  placeholder="請填入文字"
                />
              </template>
              <template v-if="topic.type==='Select'">
                <a-select
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  :class="{'form-select-w50': topic.colSpan[1]==24}"
                  :show-arrow="true"
                  :options=" topic.key == 'checkDoctor' ? optionEnum.doctorInfo : optionEnum.nurseInfo"
                  placeholder="請選擇"
                />
              </template>
              <template v-if="topic.type==='DatePicker'">
                <date-picker
                  v-model="form[topic.key]"
                  :disabled="isReadonly"
                  type="date"
                  style="width: 100%"
                  :allow-clear="true"
                  :formatter="formatter"
                  placeholder="e.g. 2022/01/01"
                />
              </template>
              <template v-if="topic.type=='upload'">
                <a-upload
                  :accept="acceptType"
                  :custom-request="uploadFlie"
                  :file-list="uploadedFileList"
                  :before-upload="beforeUpload"
                  :disabled="isReadonly"
                  :show-upload-list="false"
                  @change="handleChange"
                >
                  <button class="upload__btn d-flex">
                    <a-icon
                      type="upload"
                      theme="outlined"
                      class="pt-1"
                    />
                    <div style="margin-left: 5px;">
                      上傳
                    </div>
                  </button>
                </a-upload>

                <div
                  v-if="uploadedFileList[0]"
                  class="upload-list"
                >
                  <div
                    v-for="item in uploadedFileList"
                    :key="item.uid"
                    class="upload-list-item d-flex"
                  >
                    <img
                      class="icon-button__img icon-paperclip"
                      src="~@images/image_paperclip.svg"
                      alt=""
                    >
                    <a
                      :title="item.name"
                      :href="item.url"
                      :download="item.name"
                      class="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1"
                    >
                      {{ item.name }}
                    </a>
                    <img
                      title="刪除檔案"
                      class="icon-button__img icon-deleteGray"
                      src="~@images/button_deletGrey.svg"
                      @click="handleRemoveFile($event, item)"
                    >
                  </div>
                </div>
              </template>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
    </a-form-model>
    <div
      v-if="!isReadonly"
      class="btn__wrap text-center"
    >
      <button
        class="btn__view btn__radius--primary--outline mb-2 float-start"
        @click="onSubmit('0')"
      >
        暫存
      </button>
      <router-link :to="'/occupationSafety/Other/caseMaintain/list'">
        <button class="btn__radius--primary--outline mb-2">
          取消
        </button>
      </router-link>
      <button
        class="btn__radius--primary mb-2"
        @click="onSubmit('1')"
      >
        確定
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { EmpWoStoringPhysicianInterviewResultsDto, CiIdDto } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

@Component({ components: { } })
export default class DocTalkForm extends Vue {
  @Prop()
  recordIdProp

  @Prop()
  isReadonly: boolean

  @Action('setLoading') setLoading;

  // 可上傳的檔案類型
  acceptType = '.pdf,.docx,.doc,.xls,.xlsx,.tif';

  formatter = this.$adDateFormatter;

  uploadedFileList = [] // uploadNightData列表

  originFile = null

  recordId = 0;

  type = 'add';

  questTypeEnum = [
  	{ key: 1, val: 'RadioButton' }, // 單選
  	{ key: 2, val: 'CheckBox' }, // 勾選
  	{ key: 3, val: 'T/F' }, // 是非
  	{ key: 4, val: 'TextAera' }, // 說明
  	{ key: 5, val: 'Select' }, // 選擇說明
  	{ key: 6, val: 'DatePicker' }, // 日期選擇
  ]

  questFormData = [];

  // 固定題目項
  recordForm = {
  	title: '紀錄',
  	topics: [
  		{
  			desc: '是否通知部門/單位主管',
  			key: 'advice',
  			type: 'T/F',
  			isWrite: 'Y',
  			opts: [
  				{
  					sort: 1,
  					desc: '是',
  					optId: 'Y',
  					score: 0,
  					isOnlyCheck: 'N',
  					optDesc: 'N',
  					empWoHealthOverloadPhyDescListDtos: null,
  				},
  				{
  					sort: 2,
  					desc: '否',
  					optId: 'N',
  					score: 1,
  					isOnlyCheck: 'N',
  					optDesc: 'N',
  					empWoHealthOverloadPhyDescListDtos: null,
  				},
  			],
  		},
  		{
  			desc: '面談日期',
  			key: 'checkDate',
  			type: 'DatePicker',
  			isWrite: 'Y',
  			colSpan: [24, 12],
  			opts: [],
  		},
  		{
  			desc: '下次面談預定日期',
  			key: 'nextCheckDate',
  			type: 'DatePicker',
  			isWrite: 'Y',
  			colSpan: [24, 12],
  			opts: [],
  		},
  		{
  			desc: '評估醫師',
  			key: 'checkDoctor',
  			type: 'Select',
  			isWrite: 'Y',
  			opts: [],
  			colSpan: [24, 24],
  		},
  		{
  			desc: '評估護理師',
  			key: 'checkNurse',
  			type: 'Select',
  			isWrite: 'Y',
  			opts: [],
  			colSpan: [24, 12],
  		},
  		{
  			desc: '填表護理師',
  			key: 'writeNurse',
  			type: 'Select',
  			isWrite: 'Y',
  			opts: [],
  			colSpan: [24, 12],
  		},
  		{
  			desc: '附件上傳(上傳格式為PDF/WORD/EXCEL/TIF、檔案上限3MB)',
  			key: 'uploadFilePath',
  			type: 'upload',
  			isWrite: 'Y',
  			opts: [],
  			colSpan: [24, 24],
  		},
  	],
  }

  // 下拉選項
  optionEnum = {
  	nurseInfo: [],
  	doctorInfo: [],
  }

  recordIdEnum = []

  // 表單欄位資料
  form = {
  	// record
  	advice: '',
  	checkDate: '',
  	nextCheckDate: '',
  	checkDoctor: '',
  	checkNurse: '',
  	writeNurse: '',
  	uploadFilePath: '',
  }

  // 表單欄位規則
  formRules= {
  	advice: [{ required: true, message: '是否通知部門/單位主管為必填' }],
  	checkDate: [{ required: true, message: '面談日期為必填' }],
  	nextCheckDate: [{ required: true, message: '下次面談預定日期為必填' }],
  	checkDoctor: [{ required: true, message: '評估醫師為必填' }],
  	checkNurse: [{ required: true, message: '評估護理師為必填' }],
  	writeNurse: [{ required: true, message: '填表護理師為必填' }],
  	uploadFilePath: [{ required: true, trigger: 'change', validator: this.checkFileList }],
  }

  setResultParam() {
  	const query = this.$global.getQuery();
  	this.recordId = query.recordId || this.recordIdProp;
  }

  maptoSubmitData(status): EmpWoStoringPhysicianInterviewResultsDto {
  	const {
  		advice, checkDate, nextCheckDate, checkDoctor, checkNurse, writeNurse, uploadFilePath, ...topicsAns
  	} = this.form;
  	const empWoStoringPhysicianInterviewResultsAnsLists = [];
  	for (const [key, value] of Object.entries(topicsAns)) {
  		if (value) {
  			const [prefix, topicId] = key.split('_');
  			if (prefix === 'topic') {
  				const empWoStoringPhysicianInterviewResultsAnsDtoList = [];
  				switch (typeof (value)) {
  				case 'number':
  					empWoStoringPhysicianInterviewResultsAnsDtoList.push({
  						ans: value,
  						recordId: this.recordIdEnum[`topic_${topicId}`] || null,
  						specilDesc: null,
  					});
  					break;
  				case 'string':
  					empWoStoringPhysicianInterviewResultsAnsDtoList.push({
  						ans: null,
  						recordId: this.recordIdEnum[`topic_${topicId}`] || null,
  						specilDesc: value,
  					});
  					break;
  				case 'object':
  					if (value.length > 0) {
  						value.forEach((element) => {
  							const obj = {
  								ans: element,
  								recordId: this.recordIdEnum[`opt_${element}`] || null,
  								specilDesc: this.form[`opt_${element}`],
  							};
  							empWoStoringPhysicianInterviewResultsAnsDtoList.push(obj);
  						});
  					} else {
  						// Date
  						empWoStoringPhysicianInterviewResultsAnsDtoList.push({
  							ans: null,
  							recordId: this.recordIdEnum[`topic_${topicId}`] || null,
  							specilDesc: DateTimeFormmat.formatStringDateDault(value),
  						});
  					}
  					break;
  				default:
  					break;
  				}
  				empWoStoringPhysicianInterviewResultsAnsLists.push({
  					topicId,
  					empWoStoringPhysicianInterviewResultsAnsDtoList,
  				});
  			}
  		}
  	}

  	return {
  		advice,
  		checkDate: checkDate && DateTimeFormmat.formatStringDateDault(checkDate),
  		nextCheckDate: nextCheckDate && DateTimeFormmat.formatStringDateDault(nextCheckDate),
  		checkDoctor: checkDoctor && JSON.parse(checkDoctor),
  		checkNurse: checkNurse && JSON.parse(checkNurse),
  		writeNurse: writeNurse && JSON.parse(writeNurse),
  		empWoStoringPhysicianInterviewResultsAnsLists,
  		recordId: this.recordId,
  		status,
  		uploadFilePath,
  	};
  }

  // API: 醫師面談結果之採行措施表題目
  fetchTafrdQuest() {
  	const newFormData = [];
  	this.$AlRpnCaseInquiryControllerApi.getTafrdiUsingPOST({ recordId: this.recordId })
    	.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			const getData = resp.data.data;
  			const uniqueFormTypeArr = [];
  			const { empWoHealthOverloadPhyTopicListDtoList, empWoHealthOverloadRecordAnsDto } = getData;

  			for (const el of empWoHealthOverloadPhyTopicListDtoList) {
  				const {
  					formType, empWoHealthOverloadPhyOptListDtoList, type, ...otherProps
  				} = el;
  				const obj = {
  					title: formType,
  					topics: [],
  				};
  				const topicData = {
  					type: this.questTypeEnum.find((i) => i.key === type).val,
  					key: `topic_${el.topicId}`,
  					opts: empWoHealthOverloadPhyOptListDtoList,
  					...otherProps,
  				};
  				// 將相同 formType 值合併在一起
  				if (!uniqueFormTypeArr.includes(formType)) {
  					obj.topics.push(topicData);
  					newFormData.push(obj);
  					uniqueFormTypeArr.push(formType);
  				} else {
  					const index = uniqueFormTypeArr.indexOf(formType);
  					newFormData[index].topics.push(topicData);
  				}

  				// 表單檢核資訊&塞入表單初始值
  				const defaultVal = [];
  				empWoHealthOverloadPhyOptListDtoList && empWoHealthOverloadPhyOptListDtoList.forEach((e) => {
  					const { isSelect, recordId, specilDesc } = e.empWoHealthOverloadPhyDescListDtos;
  					switch (topicData.type) {
  					  case 'RadioButton' || 'T/F':
  						if (isSelect === 'Y') {
  							this.$set(this.form, `topic_${el.topicId}`, e.optId || null);
  							this.$set(this.recordIdEnum, `topic_${el.topicId}`, recordId);
  						}
  						break;
  					  case 'CheckBox':
  						if (isSelect === 'Y') {
  							defaultVal.push(e.optId);
  							this.$set(this.form, `topic_${el.topicId}`, defaultVal || null);
  						  this.$set(this.form, `opt_${e.optId}`, specilDesc || null);
  							this.$set(this.recordIdEnum, `opt_${e.optId}`, recordId);
  						}
  						break;
  					  case 'TextAera':
  						  this.$set(this.form, `topic_${el.topicId}`, specilDesc || null);
  						this.$set(this.recordIdEnum, `topic_${el.topicId}`, recordId);
  						break;
  					  case 'DatePicker':
  						  this.$set(this.form, `topic_${el.topicId}`, new Date(specilDesc) || null);
  						this.$set(this.recordIdEnum, `topic_${el.topicId}`, recordId);
  						break;
  					default:
  						break;
  					}
  				});

  				// 塞入檢核規則
  				if (el.isWrite === 'Y') {
  					this.formRules[`topic_${el.topicId}`] = [{ required: true, message: `${el.desc}為必填`, trigger: 'change' }];
  				}
  			}

  			this.questFormData = newFormData;

  			if (empWoHealthOverloadRecordAnsDto) {
  				const {
  					advice, checkDoctor, checkDate, nextCheckDate, checkNurse, writeNurse,
  				} = empWoHealthOverloadRecordAnsDto;
  				Object.assign(this.form, {
  					advice,
  					checkDoctor,
  					checkDate: new Date(checkDate),
  					nextCheckDate: new Date(nextCheckDate),
  					checkNurse,
  					writeNurse,
  				});
  			}
  			this.questFormData.push(this.recordForm);
  		}).catch((error) => {
  			console.log('error status = ', error);
  		});
  }

  // API: 取得檔案-醫師面談結果之採行措施表
  async fetchInterviewPDF() {
  	const ciIdDto: CiIdDto = {
  		recordId: [this.recordId],
  		uid: this.$user.getMe().userId,
  	};
  	await this.$AlRpnCaseInquiryControllerApi.downloadPirmtPdfUsingPOST(ciIdDto, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  						this.uploadedFileList = this.$blobUtils.fetchFileList((resp.data as unknown as Blob), filename, this.uploadedFileList);

  						const blob = new Blob([(resp.data as unknown as Blob)], { type: 'application/octet-stream' });
  						this.originFile = new File([blob], filename);
  					}
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 取得下拉式選單-職場大樓、護理師、排班醫生
  fetchGetOpts() {
  	this.$PCRRpnRpnServiceFieldManagementApi.getDropDownMenuRUsingPOST()
  		.then((resp) => {
  			const { nurseNameDtosList, physicianNameDtosList } = resp.data.data;
  			this.optionEnum.nurseInfo = nurseNameDtosList.map((i) => ({
  				value: i.nurseId,
  				label: i.nurseName,
  			}));
  			this.optionEnum.doctorInfo = physicianNameDtosList.map((i) => ({
  				value: i.physicianId,
  				label: i.physicianName,
  			}));
  		});
  }

  // API: 儲存醫師面談結果-檔案上傳
  async fetchUploadAPI(file) {
  	await this.$AlRpnCaseInquiryControllerApi.savePhysicianInterviewResultsuploadUsingPOST(file)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.form.uploadFilePath = resp.data?.data?.filePath;
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		});
  }

  // API: 儲存醫師面談結果
  fetchSaveResult(status, submitData) {
  	this.setLoading(true);
  	this.$AlRpnCaseInquiryControllerApi.savePhysicianInterviewResultsUsingPOST(submitData)
  		.then((resp) => {
  			// TEST:
  			console.log(resp);
  			if (resp.data && resp.data.status !== 200) {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			} else if (resp.status === 200) {
  				status === '1'
  					? this.$global.changeRouterAndaddParam({
  						toRouter: 'CaseMaintainResult',
  						params: { type: 'docTalkForm' },
  						query: { result: 'success' },
  					})
  					: notification.success({ content: '暫存成功' });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onSubmit(status) {
  	const submitData: EmpWoStoringPhysicianInterviewResultsDto = this.maptoSubmitData(status);
  	// TEST:
  	console.log('submitData:', JSON.stringify(submitData));

  	if (status === '0') {
  		this.fetchSaveResult(status, submitData);
  		return;
  	}
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.fetchSaveResult(status, submitData);
  		} else {
  			const getErrorEle = this.$el.querySelector('.has-error');
  			if (getErrorEle) {
  				getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
  			}
  			return false;
  		}
  	});
  }

  resetFile() {
  	this.uploadedFileList = [];
  }

  	// 【檔案】欄位檢核
  checkFileList(rule, value, callback) {
  	if (this.uploadedFileList.length == 0) {
  		callback('請選擇有效檔案');
  	} else {
  		callback();
  	}
  }

  async uploadFlie(options) {
  	if (this.beforeUpload) {
  		this.setLoading(true);
  	  await this.fetchUploadAPI(options.file);
  		this.setLoading(false);
  	}
  }

  // 刪除上傳檔案列表的檔案
  handleRemoveFile(e, item) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== item.uid,
  	);
  }

  // 上傳檔案change事件
  async handleChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		this.uploadedFileList = e.fileList;
  		this.uploadedFileList.map((val) => {
  			if (e.file.status == 'uploading') {
  				val.status = 'done';
  			}
  			const blobURL = window.URL.createObjectURL(val.originFileObj as unknown as Blob);
  			Object.assign(val, { url: blobURL });
  			return val;
  		});
  	}
  	if (e.file.status == 'removed') {
  		this.uploadedFileList = this.uploadedFileList.filter(
  			(val) => val.uid !== e.file.uid,
  		);
  		this.resetFile();
  	}
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	console.log(this.uploadedFileList);
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
  		notification.error({ content: '限上傳格式為PDF/WORD/EXCEL/TIF' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  onChange(e) {
  	if (e.length > 0) {
  		e.forEach((element) => {
  			this.formRules[`opt_${element}`] = [{ required: true, message: '此欄位為必填', trigger: 'change' }];
  		});
  	}
  }

  async created() {
  	this.setLoading(true);
  	this.fetchGetOpts();
  	this.setResultParam();
  	this.fetchTafrdQuest();
  	await this.fetchInterviewPDF();
  	if (this.originFile) {
  		this.fetchUploadAPI(this.originFile);
  	}
  	this.setLoading(false);
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .peron-detail__block {
    margin-bottom: 50px;
    .peron-detail__block__title {
      background-color: $COLOR_MAIN1;
      color: white;
      text-align: center;
      font-size: 16px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .peron-detail__block__option {
      padding-top: 20px;
      padding-bottom: 20px;
      border-right: 1px solid #D1D1D1;
      border-left: 1px solid #D1D1D1;
      border-bottom: 1px solid #D1D1D1;
      .peron-detail__block__option__left {
        border-right: 0.5px solid #D1D1D1;
        padding-left: calc(92/544*100%);
      }
      .peron-detail__block__option__right {
        padding-left: calc(92/544*100%);
      }
    }
  }
  .option__title {
    color: $COLOR_MAIN1;
    font-size: 16px;
    font-weight: $TEXT_BOLD;
  }
  .form__block {
    background-color: #F5F8FC;
    border-radius: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-left: calc(92/1088*100%);
    padding-right: calc(92/1088*100%);
    margin-bottom: 20px;
    .form__block__title {
      font-size: 20px;
      margin-bottom: 20px;
      font-weight: $TEXT_BOLD;
    }
    .form__block__option {
      margin-bottom: 20px;
      .form__block__option__title {
        font-weight: $TEXT-BOLD;
        margin-bottom: 10px;
      }
      .form__block__option__subtitle {
        margin-left: 10px;
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    margin-left: 5px;
  }
  .radio__block {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding-top: 9px;
    padding-bottom:9px;
    padding-left: 12px;
  }
  .radioGroup__block {
    width: 100%;
    @include rwd-xl {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .radio__block--margin {
      margin-right: 0;
      margin-left: 5px;
      margin-bottom: 10px;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding-top: 9px;
      padding-bottom:9px;
      padding-left: 12px;
      width: 100%;
      margin-right: 0;
      margin-left: 0;
      @include rwd-xl{
        .radio__block--margin:nth-of-type(2n+1) {
          width: calc( 100% / 2 - 10px);
          margin-right: 5px;
        }
        width: calc( 100% / 2 - 10px);
      }
    }
  }
  .input__block {
    width: 100%;
  }
  .upload__btn {
    background-color: $COLOR-MAIN13;
    color: $COLOR-WHITE;
    font-weight: $TEXT-BOLD;
    border-radius: 4px;
    padding: 9px 33px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    max-width: 120px;
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
  .checkbox__input {
    margin-left: 0;
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 12px;
    ::v-deep {
      span:nth-of-type(2) {
        width: 100%;
      }
      .ant-form-item {
        flex: 1;
      }
    }
  }
  .checkbox__textarea {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding-left: 12px;
  }
  .form-select-w50 {
    width: 50%;
    padding-right: 8px;
  }
  .formItem__hasDesc {
    @include rwd-xl {
      display: flex;
      align-items: center;
      ::v-deep {
        span.ant-radio + *, span.ant-checkbox + * {
          display: flex;
          align-items: center;
          padding-right: 0;
        }
      }
    }
    .ant-form-item {
      padding: 0 15px;
    }
    .input_desc {
      flex: 1;
      width: 100%;
      ::v-deep .ant-input {
        border: none;
        border-bottom: 1px solid #D1D1D1;
        border-radius: 0;
        padding: 0;
      }
    }
  }
  ::v-deep {
    .ant-select-selection, .mx-input, .mx-input-wrapper, .mx-DatePicker {
      height: 40px;
      margin: auto;
      font-size: 16px;
      .ant-select-selection__rendered {
        line-height: 40px;
      }
      i {
        margin-right: 5px;
      }
    }
    .ant-checkbox-group {
      width: 100%;
    }
    .ant-upload-list-item {
      max-width: 300px;
    }
    form textarea.ant-input {
      margin-bottom: 0px;
    }
    .ant-form {
      counter-reset: Num;
      .form__block {
        .form__block__title::before {
          content: counter(Num, simp-chinese-informal) '、';
          counter-increment: Num;
        }
      }
    }
    .ant-form-item {
      margin-bottom: 0px;
    }
  }
</style>
