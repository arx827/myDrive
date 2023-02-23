<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div v-if="nowStep === 'change'">
        <div class="row">
          <div class="col-lg-10 offset-0 offset-lg-1">
            <div class="title">
              眷屬基本基料變更
            </div>
          </div>
        </div>
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
          layout="vertical"
          :colon="false"
        >
          <div class="row">
            <div class="col-lg-10 offset-0 offset-lg-1">
              <div class="form__policychange__header">
                員工資料
              </div>
            </div>
          </div>
          <div
            v-if="empInfo"
            class="row"
          >
            <div
              v-if="empInfo!==null"
              class="col-lg-10 offset-0 offset-lg-1"
            >
              <UserDataCard
                :user-type="0"
                :datas="[
                  empInfo.insId,
                  empInfo.nationality,
                  empInfo.sex,
                  empInfo.birthDate,
                  empInfo.attribute,
                ]"
                :card-selected="false"
                :user-name="empInfo.insName"
                :user-sex="empInfo.sex"
                class="card--mb"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-10 offset-0 offset-lg-1">
              <div class="form__policychange__header">
                眷屬資料
              </div>
            </div>
          </div>
          <div class="row">
            <div
              v-if="empInfo!==null"
              class="col-lg-10 offset-0 offset-lg-1"
            >
              <UserDataCard
                :user-type="1"
                :datas="[
                  empFamilyInfo.insId,
                  empFamilyInfo.nationality,
                  empFamilyInfo.sex,
                  empFamilyInfo.birthDate,
                  empFamilyInfo.attribute,
                ]"
                :card-selected="false"
                :user-name="empFamilyInfo.insName"
                :user-sex="empFamilyInfo.sex"
                class="card--mb"
              />
            </div>
          </div>
          <hr class="hr--dashtopshort">
          <div class="bg__blue">
            <div class="row">
              <div class="col-12 col-lg-10 offset-0 offset-lg-1">
                <div class="title--warning">
                  變動此區資料需檢附<span
                    class="text-decoration-underline"
                  >身分證明文件</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-10 offset-0 offset-lg-1">
                身分證明文件上傳<span
                  class="text--light"
                >(身分證正反面、護照、居留證)</span>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-lg-10 offset-0 offset-lg-1">
                <div class="uploader__wrap">
                  <a-form-model-item
                    class="form__policychange__item"
                    prop="upload"
                  >
                    <a-upload-dragger
                      :show-upload-list="{ showRemoveIcon: uploadVaild }"
                      :accept="acceptType"
                      :custom-request="uploadFlie"
                      :multiple="true"
                      :before-upload="beforeUpload"
                      :file-list="uploadedFileList"
                      @change="handleChange"
                    >
                      <p class="ant-upload-drag-icon">
                        <a-icon type="inbox" />
                      </p>
                      <p class="ant-upload-text">
                        選擇欲上傳資料：點擊或將文件拖曳到這裡上傳
                      </p>
                      <p class="ant-upload-hint">
                        支持上傳格式：（1）僅接收jpg、pdf、doc、docx、tiff、tif
                        <br>（2）檔案大小限制5MB（3）檔案上傳數最多5項
                      </p>
                    </a-upload-dragger>
                  </a-form-model-item>
                </div>
              </div>
              <div class="col-12 col-lg-4" />
            </div>
            <div class="row">
              <div class="form__policychange col-lg-10 offset-0 offset-lg-1">
                <div class="row">
                  <div class="col-12">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="insName"
                    >
                      <span slot="label">
                        眷屬姓名
                        <a-popover
                          trigger="click"
                          placement="top"
                        >
                          <template slot="content">
                            <div>原住民特殊字元可以複製以下字元使用</div>
                            <div>ʼ &emsp; ⌃ &emsp; ṟ &emsp; é &emsp; ɨ &emsp; ʉ</div>
                          </template>
                          <a-icon
                            type="info-circle"
                            :style="{ color: '#4CAAF5' }"
                            @click="isreplyTypeModal = true"
                          />
                        </a-popover>
                      </span>
                      <a-textarea
                        v-model="form.insName"
                        vue="true"
                        alt="webfont"
                        :max-length="100"
                        :auto-size="{ minRows: 1 }"
                      />
                    </a-form-model-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="engInsName"
                      label="英文姓名"
                    >
                      <a-textarea
                        v-model.trim="form.engInsName"
                        :max-length="100"
                        :auto-size="{ minRows: 1 }"
                      />
                    </a-form-model-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="insId"
                      label="身分證字號/居留證號碼"
                    >
                      <a-input
                        v-model="form.insId"
                        :max-length="10"
                      />
                    </a-form-model-item>
                  </div>
                  <div class="col">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="insBirthdate"
                      label="生日"
                    >
                      <date-picker
                        v-model="form.insBirthdate"
                        placeholder="e.g. 066/01/04"
                        style="width: 100%"
                        type="date"
                        :formatter="formatter"
                        :allow-clear="true"
                        :disabled-date="disabledAfterToday"
                      />
                    </a-form-model-item>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="nationality"
                      label="國籍"
                    >
                      <a-select
                        v-model="form.nationality"
                        show-search
                        option-filter-prop="children"
                      >
                        <a-select-option
                          v-for="(item, index) in nationalityList"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.key }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </div>
                  <div class="col">
                    <a-form-model-item
                      class="form__policychange__item"
                      prop="sex"
                      label="性別"
                    >
                      <a-radio-group
                        v-model="form.sex"
                        class="query__list"
                      >
                        <a-radio value="M">
                          男性
                        </a-radio>
                        <a-radio value="F">
                          女性
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="other col-lg-10 offset-0 offset-lg-1">
            <div class="row">
              <div class="col-6">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="updateDate"
                  label="變更日期"
                >
                  <date-picker
                    v-model="form.updateDate"
                    placeholder="e.g. 066/01/04"
                    style="width: 100%"
                    type="date"
                    :formatter="formatter"
                    :disabled-date="disabledDate"
                    :allow-clear="true"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
      </div>
      <div v-else>
        <div class="row">
          <div class="col">
            <div class="title">
              請確認以下變更內容
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="comfirm comfirm--default">
              <div class="comfirm__header comfirm__header--default">
                變更前
              </div>
              <div class="comfirm__body">
                <template v-for="(item, index) in comfirmEmpBeforeList">
                  <div
                    :key="index"
                    class="comfirm__item"
                  >
                    <div class="comfirm__item__label">
                      {{ item.label }}
                    </div>
                    <div class="comfirm__item__value">
                      {{ item.value }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="comfirm comfirm--primary">
              <div class="comfirm__header comfirm__header--primary">
                變更後
              </div>
              <div class="comfirm__body">
                <template v-for="(item, index) in comfirmEmpAfterList">
                  <div
                    v-if="item.type == 'string'"
                    :key="index"
                    class="comfirm__item"
                    :class="{ 'comfirm__item--edit': item.isEdit }"
                  >
                    <div class="comfirm__item__label">
                      {{ item.label }}
                    </div>
                    <div class="comfirm__item__value">
                      {{ item.value }}
                    </div>
                  </div>
                  <div
                    v-if="item.type == 'array'"
                    :key="index"
                  >
                    <div v-if="item.value.length >= 1">
                      <div
                        v-for="(arritem, arrindex) in item.value"
                        :key="arrindex + item.value"
                        :class="{ 'comfirm__item--edit': item.isEdit }"
                        class="comfirm__item"
                      >
                        <div class="comfirm__item__label">
                          {{ arrindex == 0 ? item.label : "" }}
                        </div>
                        <div class="comfirm__item__value">
                          {{ arritem.name }}
                        </div>
                        <a
                          class="icon__btn comfirm__item__btn"
                          href="#"
                          @click="downloadFile(arritem)"
                        >
                          <img
                            src="@/assets/button_download.svg"
                            alt=""
                          >
                        </a>
                      </div>
                    </div>
                    <div v-else>
                      <div class="comfirm__item">
                        <div class="comfirm__item__label">
                          {{ item.label }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-10">
            <div class="mt-4">
              變更日期
            </div>
            <div>
              {{ updateDateString }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="text-center form__policychange__bottom">
            <button
              class="btn btn__main btn__main--light"
              @click="onPreStep"
            >
              上一步
            </button>
            <button
              class="btn btn__main btn__main--primary"
              @click="onNextStep"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      v-model="modalVisible"
      :wrap-class-name="'confirm__modal'"
      title="上傳錯誤"
      :footer="null"
      :width="385"
    >
      <p>{{ modalMessage }}</p>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Action } from 'vuex-class';
import {
	EmpFamilyPageDto,
	PolicyModel,
	GeneralInfoChangeDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import UploadFile from '@/plugins/uploadFile/UploadFile';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';

export interface form {
  insName: string;
  insId: string;
  sex: string;
  insBirthdate: string | Date;
  nationality: string;
  engInsName: string;
  rankNo?: string;
  depNo?: string;
  updateDate: string | Date;
}

@Component({
	components: {
		Breadcrumb,
		UserDataCard,
	},
})
export default class EmployeeGeneralInfoChange extends Vue {
  @Prop()
  breadcrumb: {};

  @Action('setLoading') setLoading;

  // 眷屬基本資料變更麵包屑
  empBreadcrumb = null;

  h = this.$createElement;

  // 當前步驟為變更資料或確認
  nowStep: 'change' | 'comfirm' = 'change';

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 可上傳的檔案類型
  acceptType = '.jpg,.pdf,.doc,.docx,.tiff,.tif';

  // 保險證號
  crtNo: string = null;

  // 國籍清單
  nationalityList = [];

  // 是否需要上傳檔案
  isNeedUpload: boolean = false;

  // 上傳檔案驗證
  uploadVaild: boolean = true;

  beforeData = {};

  // 需上傳身份證明文件選項
  needUploadItems: string[] = [
  	'insName',
  	'engInsName',
  	'insId',
  	'insBirthdate',
  	'nationality',
  	'sex',
  ];

  // 有改變資料的項目
  changeItems: string[] = [];

  // 眷屬資料
  empFamilyInfo: EmpFamilyPageDto & {
  mobile?: string;
  email?: string;
  } = null;

  // 員工資料
  empInfo: EmpFamilyPageDto = null;

  // 員工的所有眷屬資料
  empWholeFamilyInfo: EmpFamilyPageDto[] = null;

  policyModel: PolicyModel;

  // 原始表單資料
  oriForm: form = null;

  // 修改後表單
  form: form = {
  	insName: '',
  	engInsName: '',
  	insId: '',
  	insBirthdate: '',
  	nationality: '',
  	sex: '',
  	depNo: '',
  	rankNo: '',
  	// mobile: '',
  	// email: '',
  	updateDate: '',
  };

  // 已上傳檔案列表
  uploadedFileList = [];

  // 錯誤訊息彈窗是否開起
  modalVisible: boolean = false;

  // 錯誤訊息內容
  modalMessage: string = '';

  // 員工確認資料列表變更前
  comfirmEmpBeforeList = null;

  // 員工確認資料列表變更後
  comfirmEmpAfterList = null;

  // 是否為編輯狀態（從今日異動來）
  isEdit: boolean = false;

  // 從異動明細來的資料
  queryEditData: GeneralInfoChangeDto = null

  // 變更日期
  updateDateString: string = null;

	// 從今日異動第幾頁來的
	todaySearchPagination = null;

  // 表單檢驗規則
  formRules: { [key: string]: ValidationRule[] } = {
  	upload: [{ required: true, trigger: 'change', validator: this.uploadRule }],
  	insName: [{ required: true, message: '請填寫眷屬姓名', trigger: 'change' }],
  	engInsName: [{ pattern: /^[a-zA-Z.\s]*$/, message: '僅能填入半形英文' }],
  	insId: [
  		{ required: true, message: '請填寫身分證字號/居留證號碼', trigger: 'blur' },
  		{ trigger: 'blur', validator: this.insIdRule },
  		{
  			pattern: /^[A-Za-z0-9]+$/,
  			message: '僅能填入半形英數',
  			trigger: 'blur',
  		},
  	],
  	insBirthdate: [
  		{ required: true, message: '請填寫生日', trigger: 'change' },
  	],
  	nationality: [
  		{ required: true, message: '請填寫國籍', trigger: 'change' },
  		{ trigger: 'change', validator: this.nationalityRule },
  	],
  	sex: [
  		{ required: true, message: '請填寫性別', trigger: 'change' },
  		{ trigger: 'change', validator: this.sexRule },
  	],

  	updateDate: [
  		{ required: true, message: '請填變更日期', trigger: 'change' },
  	],
  };

  onBreadcrumbChange(val) {
  	this.empBreadcrumb = val;
  }

  async created() {
  	this.setLoading(true);
  	this.empBreadcrumb = this.breadcrumb;
  	if (this.$global.getParam() === null) {
  		this.$router.push({ name: 'Index' });
  	} else {
  		this.$global.getParam().fromPage === 'CO_EFTodayResultTable' ? this.isEdit = true : this.isEdit = false;
  		this.policyModel = this.$userInfo.getPolicyModel();
  		this.nationalityList = await this.$global.getNationalityData();
  		const decryptString = await this.$encryptionDecryption.decrypt(this.$global.getParam().query);
  		this.empFamilyInfo = JSON.parse(decryptString).empFamilyInfo;
  		this.empInfo = JSON.parse(decryptString).empInfo;
  		if (!this.isEdit) {
  			this.nationalityList = await this.$global.getNationalityData();
  			this.oriForm = {
  				insName: this.empFamilyInfo.input.insName,
  				engInsName: this.empFamilyInfo.input.engName,
  				insId: '',
  				insBirthdate: '',
  				nationality: this.empFamilyInfo.input.nationality,
  				sex: this.empFamilyInfo.input.sex,
  				updateDate: null,
  			};
  			this.oriForm.insId = await this.$encryptionDecryption.decrypt(
  				this.empFamilyInfo.input.insId,
  			);
  			const birthDateString = await this.$encryptionDecryption.decrypt(
  				this.empFamilyInfo.input.birthDate,
  			);
  			this.oriForm.insBirthdate = await new Date(birthDateString);
  			this.form = { ...this.oriForm };
  			this.form.updateDate = this.getTomorrow();
  		} else {
  			const queryObj = JSON.parse(decryptString);
  		  this.todaySearchPagination = queryObj.pagination;
  			this.queryEditData = {
  				beforeEmpGeneralInfoDto: queryObj.beforeEmpGeneralInfoDto,
  				afterEmpGeneralInfoDto: queryObj.afterEmpGeneralInfoDto,
  				isSave: queryObj.isSave,
  				appNo: queryObj.appNo,
  			};
  			console.log(' this.queryEditData', this.queryEditData);
  			this.oriForm = {
  				insName: this.queryEditData.beforeEmpGeneralInfoDto.befInsName,
  				engInsName: this.queryEditData.beforeEmpGeneralInfoDto.befEngInsName,
  				insId: this.queryEditData.beforeEmpGeneralInfoDto.befInsId,
  				insBirthdate: new Date(this.queryEditData.beforeEmpGeneralInfoDto.befInsBirthdate),
  				nationality: this.queryEditData.beforeEmpGeneralInfoDto.befNationality,
  				sex: this.queryEditData.beforeEmpGeneralInfoDto.befSex,
  				updateDate: null,
  			};
  			this.form = {
  				insName: this.queryEditData.afterEmpGeneralInfoDto.insName,
  				engInsName: this.queryEditData.afterEmpGeneralInfoDto.engInsName,
  				insId: this.queryEditData.afterEmpGeneralInfoDto.insId,
  				insBirthdate: new Date(this.queryEditData.afterEmpGeneralInfoDto.insBirthdate),
  				nationality: this.queryEditData.afterEmpGeneralInfoDto.nationality,
  				sex: this.queryEditData.afterEmpGeneralInfoDto.sex,
  				updateDate: new Date(this.queryEditData.afterEmpGeneralInfoDto.updateDate),
  			};
  			this.oriForm.insId = await this.$encryptionDecryption.decrypt(
  				this.empFamilyInfo.input.insId,
  			);
  			const birthDateString = await this.$encryptionDecryption.decrypt(
  				this.empFamilyInfo.input.birthDate,
  			);
  			this.oriForm.insBirthdate = await new Date(birthDateString);
  		}
  		this.setLoading(false);
  	}
  }

  updated() {
  	window.parseWord();
  }

  // 國籍號碼中文對照
  findNationalityName(nationalityValue) {
  	return this.nationalityList.find((item) => nationalityValue == item.value);
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

  // 上傳檔案若通過檢核，就加到列表裡
  uploadFlie(data) {
  	console.log('data', data);
  	if (this.beforeUpload) {
  		data.onSuccess();
  		// 產生上傳檔案list
  	} else {
  		console.log('上傳錯誤');
  		data.onError();
  	}
  }

  // 上傳檔案檢核
  beforeUpload(file, fileList) {
  	const vaildResult = UploadFile.beforeUpload(
  		file,
  		fileList,
  		this.uploadedFileList,
  		this.acceptType,
  		2,
  		5,
  	);
  	if (vaildResult.vaild == false) {
  		this.modalVisible = true;
  		this.modalMessage = vaildResult.message;
  		return false;
  	}
  	return vaildResult.vaild;
  }

  // 是否需要上傳檔案檢核規則
  async uploadRule(rule, value, callback) {
  	this.uploadedFileList = await this.uploadedFileList.filter(
  		(val) => val.uid !== 'vaild',
  	);
  	this.isNeedUpload = await this.needUploadItems.some((item) =>
  		this.changeItems.includes(item));
  	if (this.isNeedUpload) {
  		if (this.uploadedFileList.length <= 0) {
  		  window.scrollTo({ top: 300, behavior: 'smooth' });
  			callback('   ');
  			this.uploadedFileList.push({
  				uid: 'vaild',
  				name: '未選取任何文件',
  				response: '未選取任何文件',
  				status: 'error',
  			});
  			this.uploadVaild = false;
  		} else {
  			callback();
  			this.uploadVaild = true;
  		}
  	} else {
  		callback();
  		this.uploadVaild = true;
  	}
  }

  // 身分證字號檢核
  insIdRule(rule, value, callback) {
  	if (this.form.nationality === '001') {
  		if (this.form.sex === 'M') {
  			// 男性身分證字號第二位數為１
  			if (this.form.insId.slice(1, 2) === '1') {
  				callback();
  			} else {
  				callback('身分證字號格式不正確');
  			}
  		} else if (this.form.insId.slice(1, 2) === '2') {
  			callback();
  		} else {
  			callback('身分證字號格式不正確');
  		}
  	} else {
  		callback();
  	}
  }

  // 性別檢核
  sexRule(rule, value, callback) {
  	(this.$refs.formRef as any).validateField('insId');
  	callback();
  }

  // 國籍檢核
  nationalityRule(rule, value, callback) {
  	(this.$refs.formRef as any).validateField('insId');
  	callback();
  }

  // date轉民國年字串
  dateToTwString(date) {
  	let yyyy = date.getFullYear();
  	let mm = date.getMonth() + 1; // getMonth() is zero-based
  	let dd = date.getDate();
  	if (yyyy - 1911 < 100) {
  		yyyy = `0${yyyy - 1911}`;
  	} else {
  		yyyy -= 1911;
  	}
  	if (mm - 10 < 0) {
  		mm = `0${10 - mm}`;
  	}
  	if (dd - 10 < 0) {
  		dd = `0${10 - dd}`;
  	}
  	return `${yyyy}/${mm}/${dd}`; // Leading zeros for mm and dd
  }

  // 生日選擇不晚於今天
  disabledAfterToday(date) {
  	const today = new Date();
  	return date > today;
  }

  // 變更日期選擇不早於今天
  disabledDate(current) {
  	return current && current < moment().startOf('day');
  }

  // 檢核哪些資料被修改
  compareForm(newForm, oriForm) {
  	this.changeItems = [];
  	const compareItems = Object.keys(newForm);
  	compareItems.forEach((item) => {
  		if (newForm[item] !== oriForm[item]) {
  			this.changeItems.push(item);
  		}
  	});
  }

  getTomorrow() {
  	const tomorrow = new Date();
  	tomorrow.setDate(tomorrow.getDate() + 1);
  	return tomorrow;
  }

  // 下載檔案
  downloadFile(file) {
  	this.$blobUtils.download(file.originFileObj, file.name);
  }

  // 點擊下一步送出變更資料資料
  onNextStep() {
  	const GeneralInfoChangeDto: GeneralInfoChangeDto = {
  		beforeEmpGeneralInfoDto: null,
  		afterEmpGeneralInfoDto: {
  			insName: this.form.insName,
  			insId: this.form.insId,
  			sex: this.form.sex,
  			atribut: this.empFamilyInfo.input.attribute,
  			insBirthdate: this.form.insBirthdate as string,
  			nationality: this.form.nationality,
  			engInsName: this.form.engInsName ? this.form.engInsName : '',
  			rankNo: '',
  			depNo: '',
  			updateDate: this.form.updateDate as string,
  		},
  		isSave: false,
  		appNo: this.isEdit ? this.queryEditData.appNo : null,
  	};

  	this.isEdit ? GeneralInfoChangeDto.beforeEmpGeneralInfoDto = this.queryEditData.beforeEmpGeneralInfoDto : GeneralInfoChangeDto.beforeEmpGeneralInfoDto = {
  		crtNo: this.empFamilyInfo.input.crtNo,
  		crtSeq: this.empFamilyInfo.input.crtSeq,
  		befInsName: this.empFamilyInfo.input.insName,
  		befInsId: this.empFamilyInfo.input.insId,
  		befSex: this.empFamilyInfo.input.sex,
  		befAtribut: this.empFamilyInfo.input.attribute,
  		befInsBirthdate: this.empFamilyInfo.input.birthDate,
  		befNationality: this.empFamilyInfo.input.nationality,
  		befEngInsName: this.empFamilyInfo.input.engName ? this.empFamilyInfo.input.engName : '',
  		befRankNo: '',
  		befDepNo: '',
  	};

  	GeneralInfoChangeDto.beforeEmpGeneralInfoDto.policyModel = this.policyModel;

  	const files = this.uploadedFileList.map((val) => val.originFileObj);

  	if (this.nowStep === 'change') {
  	  this.setLoading(true);
  		this.compareForm(this.form, this.oriForm);
  		(this.$refs.formRef as any).validate((valid) => {
  			if (valid) {
  				if (document.getElementById('EUDCTopBanner')) {
  			const EUDCTopBannerEl = document.getElementById('EUDCTopBanner');
  			const compStyles = window.getComputedStyle(EUDCTopBannerEl);
  			console.log("compStyles.getPropertyValue('display')", compStyles.getPropertyValue('display'));
  			if (compStyles.getPropertyValue('display') !== 'none') {
  				EUDCTopBannerEl.style.display = 'none';
  			}
  		}
  				this.updateDateString = DateTimeFormmat.transformRocDate(moment(this.form.updateDate).format(
  					'YYYY-MM-DDTHH:mm:ss.sssZ',
  				));
  				this.$employeeFamilyGeneralInfoChangeApi
  					.updateEmployeeInfoUsingPOST(
  						JSON.stringify(GeneralInfoChangeDto),
  						...files,
  					)
  					.then((resp) => {
  						console.log(resp);
  						const respData = resp.data;
  						if (resp.data.status === 200) {
  							console.log(this.form);
  							this.nowStep = 'comfirm';
  							this.empBreadcrumb = {
  								list: [
  									'加退保申請及變更作業',
  									'員工及眷屬資料變更',
  									'眷屬基本資料變更',
  									'確認內容',
  								],
  							};
  							this.comfirmEmpBeforeList = [
  								{
  									type: 'string',
  									label: '眷屬姓名',
  									value: this.oriForm.insName,
  								},
  								{
  									type: 'string',
  									label: '英文姓名',
  									value: this.oriForm.engInsName,
  								},

  								{
  									type: 'string',
  									label: '性別',
  									value: this.oriForm.sex == 'M' ? '男' : '女',
  								},
  								{
  									type: 'string',
  									label: '生日',
  									value: DateTimeFormmat.transformRocDate(moment(this.oriForm.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ')),
  								},
  								{
  									type: 'string',
  									label: '身分證字號/居留證號碼',
  									value: this.oriForm.insId,
  								},
  								{
  									type: 'string',
  									label: '國籍',
  									value: this.findNationalityName(this.oriForm.nationality).key,
  								},
  								{
  									type: 'string',
  									label: '身份證明文件',
  									value: '',
  								},
  							];
  							this.comfirmEmpAfterList = [
  								{
  									type: 'string',
  									label: '眷屬姓名',
  									formItem: 'insName',
  									value: this.form.insName,
  								},
  								{
  									type: 'string',
  									label: '英文姓名',
  									formItem: 'engInsName',
  									value: this.form.engInsName,
  								},
  								{
  									type: 'string',
  									label: '性別',
  									formItem: 'sex',
  									value: this.form.sex == 'M' ? '男' : '女',
  								},
  								{
  									type: 'string',
  									label: '生日',
  									formItem: 'insBirthdate',
  									value: DateTimeFormmat.transformRocDate(moment(this.form.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ')),
  								},
  								{
  									type: 'string',
  									label: '身分證字號/居留證號碼',
  									formItem: 'insId',
  									value: this.form.insId,
  								},
  								{
  									type: 'string',
  									label: '國籍',
  									formItem: 'nationality',
  									value: this.findNationalityName(this.form.nationality).key,
  								},
  								{
  									type: 'array',
  									label: '身份證明文件',
  									formItem: 'uploadedFileList',
  									value: this.uploadedFileList,
  									isEdit: this.uploadedFileList.length > 0,
  								},
  							];
  							this.comfirmEmpAfterList.map((val) => {
  								if (val.formItem !== 'uploadedFileList') {
  									if (this.changeItems.indexOf(val.formItem) > -1) {
  										val.isEdit = true;
  									} else {
  										val.isEdit = false;
  									}
  								}
  								return val;
  							});
  						} else {
  							Modal.error({
  								title: this.h('div', {}, '資料錯誤'),
  								content: this.$global.getApiErrorMsg(respData.apiError).join(''),
  								okText: '確定',
  								icon: () =>
  									this.h('span', {
  										attrs: { class: 'modal__icon modal__icon--delete' },
  									}),
  							});
  						}
  					})
  					.catch(console.error)
  					.finally(() => {
  						this.setLoading(false);
  					});
  			} else {
  	      this.setLoading(false);
  			}
  		});
  	}

  	if (this.nowStep === 'comfirm') {
  		GeneralInfoChangeDto.isSave = true;
  		this.setLoading(true);

  		this.$employeeFamilyGeneralInfoChangeApi
  			.updateEmployeeInfoUsingPOST(
  				JSON.stringify(GeneralInfoChangeDto),
  				...files,
  			)
  			.then((resp) => {
  				console.log(resp);
  				const respData = resp.data;
  				if (resp.data.status === 200) {
  					if (resp.data.data.changeResult === '成功') {
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'EmployeeGeneralInfoChangeSuccess',
  							query: {
  								empName: this.empInfo.insName,
  								insName: this.form.insName,
  								message: resp.data.data.changeMessage,
  							},
  						});
  					} else if (resp.data.data.changeResult === '失敗') {
  						const messageArr = this.$global.getApiErrorMsg(respData.apiError);
  						console.log('messageArr', messageArr);
  						this.$global.changeRouterAndaddParam({
  							toRouter: 'EmployeeGeneralInfoChangeFail',
  							query: {
  								empName: this.empInfo.insName,
  								insName: this.form.insName,
  								message: messageArr,
  							},
  						});
  					}
  				} else {
  					Modal.error({
  						title: this.h('div', {}, '資料錯誤'),
  						content: this.$global.getApiErrorMsg(respData.apiError).join(''),
  						okText: '確定',
  						icon: () =>
  							this.h('span', {
  								attrs: { class: 'modal__icon modal__icon--delete' },
  							}),
  					});
  				}
  			})
  			.catch(console.error)
  			.finally(() => {
  				this.setLoading(false);
  			});
  	}
  }

  // 點擊上一步按鈕
  onPreStep() {
  	if (this.nowStep === 'change') {
  		if (this.isEdit) {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'CO_EFTodayResultTable',
  				query: {
  					pagination: this.todaySearchPagination,
  				},
  			});
  		} else {
  			this.$router.push({ name: 'EmpFamilyPolicyChange' });
  		}
  	}

  	if (this.nowStep === 'comfirm') {
  		this.nowStep = 'change';
  		this.empBreadcrumb = {
  			list: [
  				'加退保申請及變更作業',
  				'員工及眷屬資料變更',
  				'眷屬基本資料變更',
  			],
  		};
  	}
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: 18px;
  margin-top: 57px;
  margin-bottom: 17px;
}
.title--warning {
  background-color: $COLOR-MAIN5;
  border-radius: 4px;
  padding: 7px 0px;
  text-align: center;
  color: #fff;
  font-weight: bold;
  margin: 30px 0px;
}
.text--light {
  color: #788088;
}
.uploader__wrap {
  padding: 10px 0px 25px 0px;
  ::v-deep .ant-upload-drag {
    width: 60%;
    display: inline-block;
  }
  ::v-deep .ant-upload-list {
    width: 40%;
    display: inline-block;
    padding-left: 16px;
    vertical-align: top;
  }
  ::v-deep .ant-upload-list-item {
    margin-top: 0;
    margin-bottom: 18px;
  }
  ::v-deep .ant-upload-drag-icon {
    svg {
      width: 48px;
      height: 48px;
    }
  }
  ::v-deep .has-error {
    .ant-upload .ant-upload-btn {
      background: #ffebeb;
    }
  }
  ::v-deep .ant-form-explain {
    display: none;
  }
}
.form__policychange {
  margin-bottom: 5px;
}
.other {
  padding-top: 30px;
}
.info {
  padding-bottom: 25px;
}
.info__label {
  padding-bottom: 8px;
}
.info__text {
  font-weight: bold;
}
.comfirm {
  border: solid 1px;
  border-radius: 4px;
}
.comfirm--default {
  border-color: #d9d9d9;
}
.comfirm--primary {
  border-color: $TEXT-PRIMARY;
}
.comfirm__header {
  padding: 8px 40px;
  border-radius: 4px 4px 0px 0px;
  color: #fff;
  font-weight: bold;
}
.comfirm__header--default {
  background-color: #d9d9d9;
}
.comfirm__header--primary {
  background-color: $TEXT-PRIMARY;
}

.comfirm__item {
  padding: 12px 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .comfirm__item__label {
    font-weight: normal;
    padding: 0px;
    margin-right: auto;
  }
  .comfirm__item__value {
    font-weight: bold;
  }
}
.comfirm__item--edit {
  background-color: $LIST-BG-DARK;
}
.comfirm__item__btn {
  margin-left: 15px;
  max-width: 33px;
  max-height: 33px;
}

.hr--dashtopshort{
  border: 0;
  border-bottom: 1px#CECECE dashed;
  outline: 0;
  margin: 10px 0px 25px 0px;
}
</style>
