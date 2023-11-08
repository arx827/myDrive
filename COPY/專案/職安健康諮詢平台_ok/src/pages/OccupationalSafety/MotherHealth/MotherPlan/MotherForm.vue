<template>
  <div>
    <a-form-model
      v-if="newData"
      ref="formRef"
      :rules="formRules"
      :model="form"
    >
      <div
        v-for="(item, index) in newData"
        :key="index"
        class="form__container"
      >
        <div>
          <div class="form__container__title">
            {{ item.bigTitle }}
          </div>
          <div class="form__container__content row">
            <div
              v-for="(c, idx) in item.children"
              :key="idx"
              class="form__container__content__block col-6"
              :class="{'col-12': c.key === 'P_NAME' || c.children.length >0 || c.key === 'I_NAME'}"
            >
              <div
                class="input__title d-flex"
                :class="{'d-none': (c.key === 'I_IS_T' || c.key === 'I_M_D') && hidePField}"
              >
                <div
                  :class="{'title--green sepcial__txt':c.key === 'W_H_W' || c.key === 'W_H_P' || c.key === 'W_H_WP' || c.key === 'W_H_O'}"
                >
                  {{ c.name }}
                </div>
                <div
                  v-if="c.required"
                  class="mark-required"
                >
                  *
                </div>
              </div>
              <!-- ↓↓↓↓↓↓↓↓↓↓↓作業環境評估表：作業場所危害類型 -->
              <div v-if="c.key === 'W_H_W' || c.key === 'W_H_P' || c.key === 'W_H_WP' || c.key === 'W_H_O'">
                <div
                  v-for="(c1, i) in c.children"
                  :key="i"
                >
                  <div class="d-flex">
                    <div class="input__title">
                      {{ c1.name }}
                    </div>
                    <div
                      v-if="c1.required"
                      class="mark-required"
                    >
                      *
                    </div>
                  </div>
                  <a-radio-group
                    v-model="form[c1.key]"
                    :disabled="isReadonly"
                    class="row"
                  >
                    <div
                      v-for="(m, moreIdx) in c1.children"
                      :key="moreIdx"
                      class="col-sm-12 col-4"
                    >
                      <a-radio
                        class="radio__block--margin"
                        :value="m.name"
                      >
                        {{ m.name }}
                      </a-radio>
                    </div>
                  </a-radio-group>
                </div>
              </div>
              <!-- ↑↑↑↑↑↑↑↑↑↑↑作業環境評估表：作業場所危害類型 -->
              <a-form-model-item
                :prop="c.key"
              >
                <a-upload
                  v-if="(c.key === 'W_U_F' || c.key === 'I_UPLOAD')"
                  :accept="acceptType"
                  :file-list="uploadedFileList"
                  :custom-request="uploadFlie"
                  :before-upload="beforeUpload"
                  :disabled="isReadonly"
                  @change="handleChange"
                >
                  <a-button class="btn__radius--primary btn__upload">
                    <a-icon type="upload" />上傳
                  </a-button>
                  <div
                    v-if="fileName && fileName.length>0"
                    class="py-4"
                  >
                    已上傳：{{ fileName }}
                  </div>
                </a-upload>
                <a-input
                  v-if="c.iconDto === 'input' && c.children.length === 0 && c.key!=='W_U_F' && c.key !== 'I_UPLOAD'"
                  v-model="form[c.key]"
                  class="input__block"
                  :placeholder="c.placeholder"
                  :disabled="c.key === 'M_NAME' || c.key === 'M_UNIT' || c.key === 'P_NAME' || c.key === 'P_UNIT' || c.key === 'P_AGE' || c.key === 'M_AGE' || isReadonly"
                />
                <date-picker
                  v-if="c.iconDto && c.iconDto.type === 'DatePicker'"
                  v-model="form[c.key]"
                  :placeholder="c.placeholder"
                  type="date"
                  :format="'YYYY/MM/DD'"
                  :allow-clear="false"
                  class="input__block"
                  :class="{'d-none': c.key === 'I_M_D' && hidePField}"
                  :disabled="isReadonly"
                  :disabled-date="c.key === 'P_DUE_DATE'?disabledDate:()=>(false)"
                />
                <a-checkbox-group
                  v-if="c.iconDto && c.children.length > 0 && c.children[0].iconDto.type === 'CheckBox'"
                  v-model="form[c.key]"
                  :disabled="isReadonly"
                  class="row"
                >
                  <div
                    v-for="(c1, i) in c.children"
                    :key="i"
                    class="col-sm-6 col-12"
                  >
                    <div class="checkbox__input">
                      <div class="d-flex">
                        <div>
                          <!-- 勾選無or正常，其他選項要鎖＋清除 -->
                          <a-checkbox
                            class="checkbox__block--margin"
                            :disabled="(form[c.key].find((e)=>(e.includes('無'))) && !(c1.name.indexOf('無') > -1)) || (form[c.key].find((e)=>(e.includes('正常'))) && !(c1.name.indexOf('正常') > -1))"
                            :value="c1.name"
                            @change="checkValueChecked($event, c.key, c1.name, c)"
                          >
                            {{ c1.name }}
                          </a-checkbox>
                        </div>
                        <!-- 有勾選才顯示夾帶input -->
                        <div v-if="c1.valueVisible && form[c.key].find((e)=>(e.includes(c1.name)))">
                          <a-form-model-item
                            :prop="c1.key"
                          >
                            <a-input
                              v-model="form[c1.key]"
                              :placeholder="c1.placeholder"
                              :value="c1.value"
                              class="checkbox__input__input"
                            />
                          </a-form-model-item>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-checkbox-group>
                <a-select
                  v-if="c.iconDto && c.iconDto.type === 'List'"
                  v-model="form[c.key]"
                  :placeholder="c.placeholder"
                  class="input__block"
                  :disabled="isReadonly"
                >
                  <a-select-option
                    v-for="(c1, i) in JSON.parse(c.iconDto.ref)"
                    :key="i"
                    :value="c1.key"
                  >
                    {{ c1.value }}
                  </a-select-option>
                </a-select>
                <a-radio-group
                  v-if="c.iconDto && c.children.length > 0 && c.children[0].iconDto.type === 'RadioButton'"
                  v-model="form[c.key]"
                  :disabled="isReadonly"
                  :class="{'d-none': c.key === 'I_IS_T' && hidePField}"
                  class="row"
                >
                  <div
                    v-for="(c1, i) in c.children"
                    :key="i"
                    class="col-sm-6 col-12"
                    :class="{'col-sm-12':c.key === 'I_S' || c.key === 'W_WA' || c.key === 'W_HP'}"
                  >
                    <a-radio
                      class="radio__block--margin"
                      :value="c1.name"
                    >
                      {{ c1.name }}
                      <a-input
                        v-if="c1.valueVisible"
                        v-model="form[c1.key]"
                        :placeholder="c1.placeholder"
                        :value="c1.value"
                        class="radio__input__input"
                      />
                      <div
                        v-if="c1.appendIcon && c1.appendIcon.iconDto.iconTypeEnum === 'TextBox'"
                        class="px-4"
                      >
                        <a-textarea
                          v-model="form[c1.appendIcon.keyName]"
                          :placeholder="c1.appendIcon.defaultTipValue"
                          :auto-size="{ minRows: 2, maxRows: 6 }"
                        />
                      </div>
                    </a-radio>

                    <div
                      v-if="c1.key === 'I_HD'"
                      class="query__wrap px-5"
                    >
                      <div class="title--green my-2">
                        承上題，採取何項衛教指導
                      </div>
                      <a-radio-group
                        v-model="form.I_F_HD"
                        :disabled="isReadonly"
                        class="row"
                      >
                        <div
                          v-for="(m, moreIdx) in moreFormOpts.INTERVIEW"
                          :key="moreIdx"
                          class="col-12"
                        >
                          <a-radio
                            class="radio__block--margin"
                            style="background: #F5F8FC;"
                            :value="m.displayText"
                          >
                            {{ m.displayText }}
                            <div
                              v-if="m.appendChildren && m.appendChildren.iconDto.iconTypeEnum === 'TextBox'"
                              class="px-4"
                            >
                              <a-textarea
                                v-model="form[m.appendChildren.keyName]"
                                :placeholder="m.appendChildren.defaultTipValue"
                                :auto-size="{ minRows: 2, maxRows: 6 }"
                              />
                            </div>
                          </a-radio>
                        </div>
                      </a-radio-group>
                    </div>
                    <div
                      v-if="c1.key === 'W_C_W_C'"
                      class="query__wrap px-5"
                    >
                      <div class="title--green my-2">
                        承上題，請選擇限制條件
                      </div>
                      <a-checkbox-group
                        v-model="form.W_C_L"
                        :disabled="isReadonly"
                        class="row"
                      >
                        <div
                          v-for="(m, moreIdx) in moreFormOpts.WORK_ARRANGEMENT"
                          :key="moreIdx"
                          class=""
                        >
                          <div
                            v-if="m.keyName === 'W_L_O' || m.keyName === 'W_L_D'"
                            class="other__hr"
                          />
                          <div
                            class="checkbox__input"
                            style="background: #F5F8FC;"
                          >
                            <div class="d-flex">
                              <div>
                                <!-- 勾選無，其他選項要鎖＋清除 -->
                                <a-checkbox
                                  :value="m.displayText"
                                  class="checkbox__block--margin"
                                  style="background: #F5F8FC;"
                                >
                                  {{ m.displayText }}
                                </a-checkbox>
                              </div>
                              <!-- 有勾選才顯示夾帶input -->
                              <div v-if="m.valueVisible">
                                <a-form-model-item
                                  :prop="m.key"
                                >
                                  <a-input
                                    v-if="m.valueVisible"
                                    v-model="form[m.keyName]"
                                    class="checkbox__input__input"
                                    :placeholder="m.defaultTipValue"
                                    style="background: #F5F8FC;"
                                  />
                                </a-form-model-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a-checkbox-group>
                    </div>
                  </div>
                </a-radio-group>
              </a-form-model-item>
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
    <div class="policy editor__preview">
      <div
        class="policy__content"
        v-html="privacyContent"
      />
    </div>
    <div
      v-if="!isReadonly"
      class="btn__wrap"
    >
      <button
        class="btn__view btn__radius--primary--outline mb-2"
        @click="onSubmit('temporary')"
      >
        暫存
      </button>
      <button
        class="btn__radius--primary--outline mb-2"
        @click="cancelForm"
      >
        取消
      </button>
      <button
        class="btn__radius--primary mb-2"
        @click="onSubmit('submit')"
      >
        確定
      </button>
    </div>
    <PregnantModel
      :visible="showModel"
      :data="modalData"
    />
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import moment from 'moment';
import { Action } from 'vuex-class';
import { FormDataDto, MonPlanSaveDto, MonPlanFormDtoFormTypeEnumEnum } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';
import infoModal from '@/plugins/notification/infoModal';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import PregnantModel from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanPreModel.vue';

@Component({ components: { PregnantModel } })
export default class MotherPlanPregnantForm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  formType: 'WRITE' | 'READ' | 'CASE_WRITE'

  @Prop()
  isReadonly: boolean

  @Prop()
  formInput: {caseId; formNo; pregnantCategoryEnum}

  @Prop()
  // [個案維護] 表單類別
  formTypeEnum;

	initFormData = null; // 初始表單Data

	privacyContent = null; // 個資聲明Data

  newData = null; // 整理過後表單data

  showModel = false; // 決定是否顯示醫師諮詢需求詢問彈窗

	modalData = null;

  form: any = {} // 表單欄位資料

	formRules: any = {
		P_GESTATION_WEEKS: [
			{ validator: this.validateP_GESTATION_WEEKS, message: '填入值不得為0或大於44', trigger: 'blur' },
		],
		W_P_D: [
			{ validator: this.validateW_P_D, message: '點選"妊娠中" 則 "預產期" 必填', trigger: 'blur' },
		],
		W_M_D: [
			{ validator: this.validateW_M_D, message: '點選"產後一年" 則 "分娩日期" 必填', trigger: 'blur' },
		],
	} // 表單欄位檢核

  uploadedFileList = [] // 上傳檔案列表

  moreFormOpts = {
  	WORK_ARRANGEMENT: null, // key: W_C_W_C
  	INTERVIEW: null, // key: I_HD
  	WORK_PLACE: null, // key:
  } // 更多問項題目(用於多層題目)

  // 可上傳的檔案類型
  acceptType = '.pdf,.doc,.xlsx,.tif,.docx,.xls';

  // API回傳檔案ID
  fileId = null

  fileName = null; // 用於判斷是否前次已有上傳檔案了

  hidePField = false; // 面談紀錄表單, 身分別選擇妊娠中, 隱藏分娩日期、是否哺乳欄位

  @Watch('form.I_I')
  onI_IChange(val) {
  	if (val === '妊娠中') {
  		this.hidePField = true;
  	} else {
  		this.hidePField = false;
  	}
  	if (this.$refs.formRef) (this.$refs.formRef as any).clearValidate();
  }

  // 預產日期選擇不早於今天
  disabledDate(current) {
  	return current && current <= moment().startOf('day');
  }

  validateW_P_D(rule, value, callback) {
  	if (this.form.W_I === '妊娠中' && !value) {
  		callback('點選"妊娠中" 則 "預產期" 必填');
  	} else {
  		callback();
  	}
  }

  validateW_M_D(rule, value, callback) {
  	if (this.form.W_I === '產後一年' && !value) {
  		callback('點選"妊娠中" 則 "預產期" 必填');
  	} else {
  		callback();
  	}
  }

  validateP_GESTATION_WEEKS(rule, value, callback) {
  	const n = parseInt(value);
  	if (n > 0 && n <= 44) {
  		callback();
  	} else {
  		callback('填入值不得為0或大於44');
  	}
  }

  // 上傳檔案change事件
  async handleChange(e) {
  	this.uploadedFileList = this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	if (e.file.status == 'uploading') {
  		console.log('uploading');
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
  		this.resetFile();
  	}
  }

  resetFile() {
  	this.uploadedFileList = [];
  	this.fileId = null;
  	this.fileName = null;
  }

  // 上傳檔案若通過檢核，就加到列表裡
  uploadFlie(options) {
  	console.log(options);
  	if (this.beforeUpload) {
  	  this.fetchUploadAPI(options.file);
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
  		notification.error({ content: '限上傳 .pdf,.doc,.xlsx,.tif' });
  		return false;
  	}
  	return vaildResult.vaild;
  }

  // 上傳檔案API
  fetchUploadAPI(file) {
  	this.setLoading(true);
  	const formTypeEnum = this.formTypeEnum;
  	const caseId = this.formInput.caseId;
  	console.log(formTypeEnum, caseId, this.formInput);
  	this.$FormApi.uploadFileAboutFormUsingPOST(file, caseId, formTypeEnum)
  		.then((resp) => {
  			this.fileId = resp.data.data;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  			notification.error({ content: '上傳失敗' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 點下[取消]
  cancelForm() {
  	switch (this.formType) {
  	case 'WRITE':
  		this.$router.push({ name: 'MotherPlanIndex' });
  		break;

  	case 'READ':

  		break;

  	case 'CASE_WRITE':
  		this.$router.push({ name: 'CaseMaintainList' });
  		break;

  	default:
  		break;
  	}
  }

  // [共用]勾選無, 其他選項要清空
  checkValueChecked($event, key, IconName, IconGroup) {
  	setTimeout((e) => {
  		if ($event.target.checked && (IconName.indexOf('無') > -1 || IconName.indexOf('正常') > -1)) {
  			// 清除除了無以外的勾選項目
  			this.form[key] = [$event.target.value];
  			// 清除checkbox之input值
  			IconGroup.children.forEach((element) => {
  				Object.entries(this.form).forEach(([key, val]) => {
  					if (element.key === key) {
  						this.form[element.key] = null;
  					}
  				});
  			});
  		}
  	}, 100);
  }

  // [個案維護] 上傳文件
  // uploadFile() {}

  onSubmit(type) {
  	if (type === 'temporary') {
  		// 暫存不檢核
  		this.submitForm(type);
  	} else {
  		if (this.formTypeEnum === 'INTERVIEW') {
  			if (this.hidePField) {
  				// 面談紀錄表單, 身分別選擇妊娠中, 隱藏分娩日期、是否哺乳欄位, 拿掉檢核
  				this.formRules.I_M_D[0].required = false;
  				this.formRules.I_IS_T[0].required = false;
  			} else {
  				this.formRules.I_M_D[0].required = true;
  				this.formRules.I_IS_T[0].required = true;
  			}
  		}
  		(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			// this.myModal.addEventListener('shown.bs.modal', () => {
  			// 	console.log('yes');
  			// });
  			// this.showModel = true;
  			// console.log('yes');
  			this.submitForm(type);
  		} else {
  			console.log('error validate!!');
  			return false;
  		}
  	});
  	}
  }

  closeModal() {
  	this.showModel = false;
  }

  // API:取得表單資訊
  async getFormInit() {
  	const arr = [];
  	if (this.formType === 'WRITE') {
  		this.setLoading(true);
  		await this.$MONPLANEmpFormApi.evaluateFormEUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.initFormData = resp.data.data;
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	} else if (this.formType === 'READ') {
  		this.setLoading(true);
  		await this.$MONPLANEmpFormApi.myFillFormEUsingPOST(this.formInput.caseId, this.formInput.formNo, this.formInput.pregnantCategoryEnum)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					this.initFormData = resp.data.data;
  				} else {
  					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				}
  			})
  			.catch((error) => {
  				console.log('error status = ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else if (this.formType === 'CASE_WRITE') {
  		await this.$FormApi.viewFormUsingPOST({ formId: this.formInput.formNo, caseId: this.formInput.caseId })
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.initFormData = resp.data.data;
  				this.fileName = resp.data.data.fileName;
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  	}

  	// 整理成畫面所需表單格式
  	const initFormData = this.initFormData.contexts;
  	initFormData.forEach((element) => {
  		if (!element.parentId && !element.isLeaf) {
  			arr.push(
  				{
  					bigTitle: element.displayText,
  					key: element.keyName,
  					sort: element.sort,
  					children: initFormData.filter((e) => e.parentId === element.indexId).map((b) => ({
  						name: b.displayText,
  						required: b.required,
  						iconDto: b.iconDto ? { type: b.iconDto.iconTypeEnum, value: b.iconDto.value, ref: b.iconDto.ref } : 'input',
  						placeholder: b.defaultTipValue,
  						valueVisible: b.valueVisible, // checkbox若此值為true代表需夾帶input
  						value: b.valueVisible ? b.value : null, // valueVisible為true時才給值
  						key: b.keyName,
  						originData: b, // 原始完整資料
  						appendIndexId: b.appendIndexId,
  						parentId: b.parentId,
  						isLeaf: b.isLeaf,
  						appendIcon: initFormData.find((a) => a.indexId === b.appendIndexId), // 是否額外加上icon
  						children: initFormData.filter((c) => c.parentId === b.indexId).map((d) => ({
  							name: d.displayText,
  							required: d.required,
  							iconDto: d.iconDto ? { type: d.iconDto.iconTypeEnum, value: d.iconDto.value, ref: d.iconDto.ref } : 'input',
  							placeholder: d.defaultTipValue,
  							valueVisible: d.valueVisible,
  							value: d.valueVisible ? d.value : null,
  						  key: d.keyName,
  							originData: d,
  							appendIndexId: d.appendIndexId,
  							parentId: d.parentId,
  							isLeaf: d.isLeaf,
  						  appendIcon: initFormData.find((a) => a.indexId === d.appendIndexId), // 是否額外加上icon
  							children: initFormData.filter((c) => c.parentId === d.indexId).map((g) => ({
  								name: g.displayText,
  								required: g.required,
  								iconDto: g.iconDto ? { type: g.iconDto.iconTypeEnum, value: g.iconDto.value, ref: g.iconDto.ref } : 'input',
  								placeholder: g.defaultTipValue,
  								valueVisible: g.valueVisible,
  								value: g.valueVisible ? g.value : null,
  								key: g.keyName,
  								originData: g,
  								appendIndexId: g.appendIndexId,
  								parentId: g.parentId,
  								isLeaf: g.isLeaf,
  								appendIcon: initFormData.find((a) => a.indexId === g.appendIndexId), // 是否額外加上icon
  							})),
  						})),
  					})),
  				},
  			);
  		}
  		// [面談紀錄表單] 額外處理欄位:衛教指導（選擇此項，請作答下一題）Radio
  		if (element.keyName === 'I_F_HD' && this.formTypeEnum === 'INTERVIEW') {
  			const matchId = element.indexId;
  			this.moreFormOpts.INTERVIEW = initFormData.filter((e) => e.parentId === matchId).map(({ appendIndexId, ...rest }) => (
  				{
  					appendChildren: appendIndexId !== 0 ? initFormData.find((e) => (e.indexId) === appendIndexId) : null,
  					...rest,
  				}
  			));
  			const defaultVal = this.moreFormOpts.INTERVIEW.find((e) => e.iconDto.value === 'true');
  			this.moreFormOpts.INTERVIEW.forEach((mEl) => {
  				if (mEl.appendChildren) {
  					this.$set(this.form, mEl.appendChildren.keyName, mEl.appendChildren.iconDto.value);
  				}
  			});
  			this.$set(this.form, 'I_F_HD', defaultVal ? defaultVal.displayText : null);
  		}
  		// [工作適性安排建議表] 額外處理欄位:可繼續從事工作（選擇此項，須作答下列限制條件）Checkbox
  		if (element.keyName === 'W_C_L' && this.formTypeEnum === 'WORK_ARRANGEMENT') {
  			const matchId = element.indexId;
  			this.moreFormOpts.WORK_ARRANGEMENT = initFormData.filter((e) => e.parentId === matchId);
  			const defaultVal = [];
  			this.moreFormOpts.WORK_ARRANGEMENT.forEach((mEl) => {
  				if (mEl.valueVisible) {
  					this.$set(this.form, mEl.keyName, mEl.value);
  				}
  				if (mEl.iconDto.value === 'true') {
  					defaultVal.push(mEl.displayText);
  				}
  			});
  			this.$set(this.form, 'W_C_L', defaultVal || null);
  		}
  		// [作業環境評估表] 額外處理欄位: 二、作業場所危害類型: 綠字以下
  		if (this.formTypeEnum === 'WORK_PLACE') {

  		}

  		// append textbox
  	});
  	console.log(arr);
  	arr.sort((a, b) => (a.sort - b.sort)); // 排序
  	// 表單檢核資訊&塞入表單初始值
  	arr.forEach((element) => {
  		// console.log(element);
  		element.children.forEach((el) => {
  			if (el.children.length > 0) {
  				let defaultVal = [];
  				// CheckBox/RadioButton開始塞入初始值
  				el.children.forEach((cEl) => {
  					if (cEl.value && !cEl.iconDto) {
  						// input初始值
  						defaultVal = cEl.value;
  					}
  					if (cEl.iconDto) {
  						console.log(cEl);
  						// iconDto類型初始值
  						if (cEl.iconDto.value === 'true' && cEl.iconDto.type === 'CheckBox') {
  							defaultVal.push(cEl.name);
  						} else if (cEl.iconDto.value === 'true' && cEl.iconDto.type === 'RadioButton') {
  							defaultVal = cEl.name;
  							// console.log(defaultVal);
  						}
  						// checkbox,RadioButton有夾帶input另外處理
  						if (cEl.iconDto.value === 'true' && cEl.valueVisible) {
  							console.log(cEl);
  							if (cEl.iconDto.type === 'CheckBox' || cEl.iconDto.type === 'RadioButton') {
  								// defaultVal.push(cEl.name);
  							  this.$set(this.form, cEl.key, cEl.value);
  								console.log(this.form[cEl.key]);
  							  this.formRules[cEl.key] = [{ required: true, message: '此欄位為必填', trigger: 'blur' }];
  							}
  						}
  					}
  					// 有附加icon
  					if (cEl.appendIcon) {
  						console.log(cEl);
  						if (cEl.appendIcon.iconDto && cEl.appendIcon.iconDto.iconTypeEnum === 'TextBox') {
  						  this.$set(this.form, cEl.appendIcon.keyName, cEl.appendIcon.iconDto.value);
  						}
  					}
  					// 處理第三層
  					if (cEl.children && cEl.children.length > 0) {
  						console.log(cEl);
  						let selfVal;
  						cEl.children.forEach((self) => {
  							if (self.iconDto.value === 'true' && self.iconDto.type === 'RadioButton') {
  								selfVal = self.name;
  							}
  						});
  						this.$set(this.form, cEl.key, selfVal || null);
  					}
  				});
  				this.$set(this.form, el.key, defaultVal || null);
  			} else {
  				// List/DatePicker/Input 開始塞入初始值
  				let defaultVal;
  				switch (el.iconDto.type) {
  				case 'List':
  					defaultVal = el.iconDto.value;
  					break;

  				case 'DatePicker':
  					defaultVal = el.iconDto.value ? new Date(el.iconDto.value) : null;
  					break;

  				case 'TextBox':
  					defaultVal = el.iconDto.value;
  					console.log('Textbox:', defaultVal);
  					break;

  				default:
  					defaultVal = el.value;
  					break;
  				}
  				this.$set(this.form, el.key, defaultVal);
  			}

  			// 塞入檢核規則
  			if (el.required && el.key !== 'W_U_F' && el.key !== 'I_UPLOAD') {
  				this.formRules[el.key] = [{ required: true, message: `${el.name}為必填`, trigger: 'blur' }];
  			}
  		});
  	});
  	this.formRules.P_GESTATION_WEEKS.push({ validator: this.validateP_GESTATION_WEEKS, message: '填入值不得為0或大於44', trigger: 'blur' }); // 加上妊娠週數檢核
  	this.newData = arr;
  	this.setLoading(false);
  }

  // [母性健康計畫]取得個資聲明
  getPrivacy() {
  	this.setLoading(true);
  	this.$MONPLANRpnEventContentMaintainApi.queryEventContentRUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((element) => {
  					if (element.code === 'PERSONAL_INFO_STATEMENT') {
  						this.privacyContent = element.value;
  					}
  				});
  				console.log(this.privacyContent);
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 1.2.4.	查詢醫生諮詢需求詢問
  fetchDoctorAPI() {
  	this.setLoading(true);
  	this.$MONPLANEmpFormApi.needPhyConsultEUsingPOST()
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				const data = resp.data.data;
  				if (data.isRecord) {
  					infoModal.alertError({
  						title: '提醒',
  						confirm: true,
  						content: '您已有預約醫師諮詢，是否需修改預約醫師諮詢時間?',
  						okText: '是',
  						cancelText: '否',
  						onCallback: () => {
  							console.log('ok');
  							// 開彈窗填是否醫生諮詢
  							this.modalData = resp.data.data;
  					    this.showModel = true;
  						},
  						onCancel: () => {
  							console.log('no');
  							// 醫生諮詢需求詢問儲存
  							this.saveDoctorConsult(data);
  						},
  					});
  				} else {
  					// 沒有預約紀錄
  					this.modalData = resp.data.data;
  					this.showModel = true;
  				}
  			} else {
  				// notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'MotherPlanFormResult',
  					query: {
  						result: 'fail',
  						errorMsg: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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
  }

  // 醫生諮詢需求詢問儲存
  saveDoctorConsult(data) {
  	this.$MONPLANEmpFormApi.savePhyConsultEUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				if (data.isPhyConsult) {
  					// 導向醫師預約 傳入參數:個案維護ID、TYPE(D0102)、護理師email
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MotherPlanDoctorReservationStep1',
  						query: {
  							caseId: resp.data.data.caseId,
  							srcFrom: 'D0102',
  							nurseEmail: resp.data.data.email,
  						},
  					});
  				} else {
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'MotherPlanFormResult',
  						query: {
  							result: 'success',
  						},
  					});
  				}
  			} else {
  				this.$global.changeRouterAndaddParam({
  					toRouter: 'MotherPlanFormResult',
  					query: {
  						result: 'fail',
  						errorMsg: this.$global.getApiErrorMsg(resp.data.apiError).join(''),
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
  }

  // 送出表單
  async submitForm(type) {
  	const submitData: MonPlanSaveDto = {
  		formDataDto: {},
  	};
  	type === 'temporary' ? submitData.isSave = false : submitData.isSave = true;
		submitData.formDataDto as FormDataDto;
		submitData.formDataDto = {
			formBaseName: this.initFormData.formBaseName,
			formId: this.initFormData.formId,
			formTypeEnum: this.initFormData.formTypeEnum,
			// generation: this.initFormData.generation,
			contexts: null,
		};
		console.log(submitData);
		// 將所填資訊餵回初始表單格式
		const compareIDs = [];
		const newFormData = JSON.parse(JSON.stringify(this.initFormData.contexts));
		newFormData.forEach((element) => {
			Object.entries(this.form).forEach(([key, value]) => {
			  const val: any = JSON.parse(JSON.stringify(value));
				if (element.keyName === key) {
					compareIDs.push({ id: element.indexId, value: val });
					// console.log(element);
					if (!element.iconDto) {
						element.isLeaf ? element.value = value : element.value = null;
					} else {
						// List, others
						// eslint-disable-next-line no-lonely-if
						if (element.iconDto.iconTypeEnum === 'List') {
							element.iconDto.value = JSON.parse(element.iconDto.ref).find((e) => e.key === value) ? JSON.parse(element.iconDto.ref).find((e) => e.key === value).key : '';
						} else if (element.iconDto.iconTypeEnum === 'DatePicker') {
							element.iconDto.value = value ? moment(value).format('YYYY/MM/DD') : '';
						} else if (element.iconDto.iconTypeEnum !== 'CheckBox' && element.iconDto.iconTypeEnum !== 'RadioButton') {
							console.log(value);
							element.iconDto.value = value ? value.toString() : value;
						} else if (element.valueVisible) {
							// checkbox, RadioButton有夾帶input
							// console.log(element);
							if (element.iconDto.iconTypeEnum === 'CheckBox' || element.iconDto.iconTypeEnum === 'RadioButton') {
								element.value = value;
							}
						}
					}
				}
			});

			compareIDs.forEach((el) => {
				if (element.parentId === el.id && element.iconDto) {
					if (element.iconDto.iconTypeEnum === 'CheckBox') {
						element.iconDto.value = 'false';
						el.value.forEach((vEl) => {
							if (vEl === element.displayText) {
								element.iconDto.value = 'true';
							}
						});
					} else if (element.iconDto.iconTypeEnum === 'RadioButton') {
						el.value === element.displayText ? element.iconDto.value = 'true' : element.iconDto.value = 'false';
					}
				}
			});
		});
		console.log(compareIDs);
		submitData.formDataDto.contexts = newFormData;
		console.log(submitData);
		this.$notification.destroy(); // 清除錯誤彈窗
		if (this.formType === 'WRITE') {
			// [員工] 自我評估表
			this.setLoading(true);
			this.$MONPLANEmpFormApi.saveEvaluateFormEUsingPOST(submitData)
				.then((resp) => {
					console.log(resp);
					if (resp.data && resp.data.status !== 200) {
						notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('\r\n') });
					} else if (resp.status === 200) {
					// 按下確定才跳是否預約醫生諮詢彈窗
						type === 'submit' ? this.fetchDoctorAPI() : notification.success({ content: '暫存成功' });
					}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
		} else if (this.formType === 'CASE_WRITE') {
			// [護理師]個案維護表單:作業環境評估表(不用上傳檔案)、面談紀錄、工作適性安排建議表
			// 先上傳檔案後API 在儲存表單API

			let passUploadFile = false;
			console.log(this.formTypeEnum);
			if (!this.fileName && !this.fileId && type === 'submit' && this.formTypeEnum !== 'WORK_PLACE') {
				notification.error({ content: '請上傳檔案!' });
				return;
			}
			this.setLoading(true);
			if (this.fileId) {
				await this.$FormApi.uploadFileIdAndFormIdUsingPOST({ formId: this.formInput.formNo, fileId: this.fileId })
					.then((resp) => {
						console.log(resp);
						passUploadFile = resp.data.data;
  		      })
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else {
				passUploadFile = true;
			}
			if (passUploadFile) {
				submitData.caseId = this.formInput.caseId; // 個案維護需傳caseID
				this.$MONPLANRpnMaintainApi.saveFormRUsingPOST({ monPlanSaveDto: submitData, formTypeEnum: this.formTypeEnum })
					.then((resp) => {
						console.log(resp.data);
						if (resp.data.status === 200) {
							// notification.success({ content: '儲存成功!' });
							this.$global.changeRouterAndaddParam({
								toRouter: 'CaseMaintainResult',
								params: { type: 'list' },
								query: {
									result: 'success',
								},
							});
						} else {
							notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('\r\n') });
						}
					})
					.catch((error) => {
						console.log('error status = ', error);
					})
					.finally(() => {
						this.setLoading(false);
					});
			} else {
				notification.error({ content: '上傳檔案失敗, 請稍後再試' });
			}
		}
  }

  created() {
  	if (this.formType === 'WRITE') this.getPrivacy();
  	this.getFormInit();
  	console.log(this.isReadonly);
  }

  updated() {
  	window.parseWord();
  }
}
</script>
<style lang="scss" scoped>
  .other__hr {
    margin-bottom: 20px;
    margin-top: 10px;
    border-top: 1px #D1D1D1 solid;
  }
  .page__subtitle {
    color: $TEXT-GREEN;
    margin-bottom: 20px;
    a {
      font-weight: $TEXT-BOLD;
      text-decoration: underline;
    }
  }
  .form__container  {
    margin-bottom: 20px;
    background-color: $COLOR-MAIN10;
    border-radius: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-right: calc(92/1088*100%);
    padding-left: calc(92/1088*100%);
    .form__container__title {
      font-size: 20px;
      font-weight: $TEXT-BOLD;
      margin-bottom: 20px;
    }
    .form__container__content {
      .form__container__content__block {
        margin-bottom: 20px;
      }
      .form__container__content__immunityblock {
        margin-bottom: 20px;
        @include rwd-lg {
          margin-bottom: 0px;
        }
      }
      .checkbox__input__checkbox--special {
        min-width: 165px;
        padding-top: 12px;
        padding-bottom:12px;
        padding-left: 12px;
      }
    }
  }
  .title--green {
    color: #23C4A8;
    font-weight: 600;
  }
  .sepcial__txt {
    font-size: 20px;
    font-weight: bold;
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    margin-left: 5px;
  }
  .input__block {
    width: 100%
  }
  .input__title {
    font-weight: $TEXT-BOLD;
    margin-bottom: 10px;
  }
  .radio__block {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding-top: 9px;
    padding-bottom:9px;
    padding-left: 12px;
  }
  .radio__block--margin {
    width: 100%;
    margin-bottom: 10px;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding-top: 9px;
    padding-bottom:9px;
    padding-left: 12px;
  }
  .check__box__group {
    width: 100%;
  }
  .checkbox__block {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    padding-top: 12px;
    padding-bottom:12px;
    padding-left: 12px;
  }
  .checkbox__block--margin {
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 10px;
    padding-top: 12px;
    padding-bottom:12px;
    padding-left: 12px;
  }
  // 水平線根據RWD顯示
  .hr__display {
    display: none;
    @include rwd-lg {
      display:block;
      margin-top: 30px;
      margin-bottom: 30px;
      background-color: #D1D1D1;
    }
  }
  // 水平線根據RWD顯示調整margin
  .hr__rwd {
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #D1D1D1;
    @include rwd-lg {
      margin-top: 30px;
      margin-bottom: 30px;
    }
  }
  // 水平線根據RWD顯示調整特殊margin
  .hr__special {
    margin-top: 20px;
    margin-bottom: 20px;
    @include rwd-lg {
      margin-top: 30px;
      margin-bottom: 42px;
    }
  }
  .policy {
    margin-top: 10px;
    .policy__title {
      font-weight: $TEXT-BOLD;
      margin-bottom: 10px;
    }
  }
  .btn__wrap {
    margin: 50px 0;
    @include rwd-sm {
      text-align: center;
    }
    button {
      width: 98px;
      max-width: 100%;
      margin: 0 5px;
      @include rwd-sm {
        width: 200px;
      }
    }
    .btn__view {
      width: 98px;
      margin-left: 0px;
      margin-right: 5px;
      @include rwd-sm {
        width: 100px;
        float: left;
      }
    }
  }
  .query__wrap {
    width: 100%;
    border-radius: 4px;
    background-color: #FFFFFF;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  ::v-deep{
    .radio__input__input {
      border: 0;
      border-bottom: 1px #999999 solid;
      width: auto;
      outline: 0;
      border-radius: 0;
      height: auto;
      padding: 0 5px;
      &:focus {
        // border-right-width: 1px !important;
        outline: 0;
        box-shadow: 0 0 0 2px transparent;
      }
    }
    .ant-radio-disabled + span, .ant-checkbox-disabled + span, .ant-input:disabled, .ant-input-number-disabled {
      color: #636363;
    }
    .radio__input {
      width: 100%;
      height: 42px;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding-left: 12px;
      .radio__input__radio {
        padding-top: 9px;
        padding-bottom:9px;
      }
      .ant-input {
        border-color: #ffffff;
        padding-top: 10px;
        padding-left: 0px;
        padding-bottom: 0px;
        &:focus {
          border-right-width: 1px !important;
          outline: 0;
          box-shadow: 0 0 0 2px transparent;
        }
      }
      .radio__input__input {
        width: 100%;
        border-bottom: #999999 0.5px solid;
      }
    }
    .ant-checkbox-wrapper {
      margin-left: 0px;
    }
    .ant-radio-wrapper {
      margin-right: 0px;
    }
    .checkbox__input {
      width: 100%;
      height: 48px;
      background-color: #FFFFFF;
      border-radius: 4px;
			margin-bottom: 10px;
      .checkbox__input__checkbox {
        padding-top: 12px;
        padding-bottom:12px;
        padding-left:12px;
        min-width: 80px;
      }
      .ant-input {
        border-color: #ffffff;
        padding-top: 10px;
        padding-left: 0px;
        padding-bottom: 0px;
        &:focus {
          border-right-width: 1px !important;
          outline: 0;
          box-shadow: 0 0 0 2px transparent;
        }
      }
      .checkbox__input__input {
        width: 100%;
        border-bottom: #999999 0.5px solid;
      }
    }
  }
</style>
