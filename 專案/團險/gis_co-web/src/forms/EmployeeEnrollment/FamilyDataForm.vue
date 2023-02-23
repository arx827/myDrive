<template>
  <div>
    <div class="container">
      <div
        v-if="!todayEdit"
        class="query__wrap"
      >
        <h2 class="query__title">
          請輸入欲投保員工的資料
        </h2>
        <p class="info__txt primary__txt text-center">
          請擇一填寫
        </p>
        <a-form-model
          ref="queryFormRef"
          :model="queryForm"
          :rules="queryFormRules"
          :label-col="{
            xs: {span: 0}
          }"
          :wrapper-col="{
            xs: {span: 24}
          }"
        >
          <a-form-model-item prop="option">
            <a-radio-group
              v-model="queryForm.option"
              class="query__list"
            >
              <a-radio
                class="query__item"
                value="crtNo"
              >
                保險證號(員工號碼)
                <a-form-model-item
                  v-if="queryForm.option === 'crtNo'"
                  class="query__item-content"
                  prop="crtNo"
                >
                  <a-input-search
                    v-model="queryForm.crtNo"
                    :max-length="10"
                    block
                    enter-button
                    :disabled="isSearching"
                    @search="onSearch('crtNo', queryForm.crtNo)"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="insIdNo"
              >
                身分證字號/居留證號碼
                <a-form-model-item
                  v-if="queryForm.option === 'insIdNo'"
                  prop="insIdNo"
                  class="query__item-content"
                >
                  <a-input-search
                    v-model="queryForm.insIdNo"
                    :max-length="10"
                    block
                    enter-button
                    :disabled="isSearching"
                    @input="queryForm.insIdNo = $event.target.value.toUpperCase()"
                    @search="onSearch('insIdNo', queryForm.insIdNo)"
                  />
                </a-form-model-item>
              </a-radio>
              <a-radio
                class="query__item"
                value="insName"
              >
                員工姓名
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
                <a-form-model-item
                  v-if="queryForm.option === 'insName'"
                  class="query__item-content"
                  prop="insName"
                >
                  <a-input-search
                    v-model="queryForm.insName"
                    vue="true"
                    alt="webfont"
                    block
                    enter-button
                    :disabled="isSearching"
                    @search="onSearch('insName', queryForm.insName)"
                  />
                </a-form-model-item>
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </div>
      <hr
        v-if="employeeList && !todayEdit"
        class="hr--dash"
      >
      <div
        v-if="employeeList"
      >
        <div class="row">
          <div class="col">
            <div
              v-if="employeeList.length > 1"
              class="form__policychange__header"
            >
              員工資料
            </div>
          </div>
        </div>
        <div class="row">
          <div
            v-if="employeeList.length > 1"
            class="col text-center info__txt"
          >
            查詢到多筆員工資料，請擇一進行眷屬加保
          </div>
          <div
            v-if="employeeList.length === 0"
            class="col text-center info__txt"
          >
            查詢無資料
          </div>
        </div>
        <div class="row">
          <div class="col">
            <UserDataCard
              v-for="(user) in employeeList"
              :key="user.insId"
              :user-name="user.insName"
              :user-sex="user.sex"
              :user-type="0"
              :datas="[user.insId, user.nationality, user.sex, user.birthDate, user.crtNo]"
            >
              <template v-slot:others>
                <div class="card__action">
                  <div class="text-center">
                    <button
                      :class="{'card__btn--active': user.isAdd}"
                      class="btn card__btn"
                      @click="onClickAdd(user)"
                    >
                      加保
                    </button>
                  </div>
                </div>
              </template>
            </UserDataCard>
          </div>
        </div>
        <hr
          v-if="isShowForm"
          class="hr--dashtopshort"
        >
        <a-form-model
          v-if="isShowForm"
          ref="formRef"
          :model="form"
          :rules="formRules"
          layout="vertical"
          :colon="false"
        >
          <div class="form__policychange">
            <div class="row">
              <div class="col">
                <div class="form__policychange__header">
                  眷屬資料
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
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
                    v-model.trim="form.insName"
                    vue="true"
                    :max-length="100"
                    alt="webfont"
                    :auto-size="{ minRows: 1}"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="englishName"
                  label="英文姓名(護照上英文全名)"
                  :rules="{ required: form.nationality !== '001', trigger: 'blur',validator: englishNameRule}"
                >
                  <a-textarea
                    v-model="form.englishName"
                    :max-length="60"
                    :auto-size="{ minRows: 1}"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="idNo"
                  label="身分證字號/居留證號碼"
                >
                  <a-input
                    v-model="form.idNo"
                    :max-length="10"
                    @input="form.idNo = $event.target.value.toUpperCase()"
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
                    :disabled-date="disabledAfterToday"
                    :allow-clear="true"
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
                    option-filter-prop="children"
                    show-search
                  >
                    <a-select-option
                      v-for="(item) in nationalityList"
                      :key="item.value"
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
                  prop="insSex"
                  label="性別"
                >
                  <a-radio-group
                    v-model="form.insSex"
                    default-value="1"
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
            <div class="row">
              <div class="col-6">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="attr"
                  label="屬性"
                >
                  <a-select
                    v-model="form.attr"
                    option-filter-prop="children"
                    show-search
                    @change="getBenType"
                  >
                    <a-select-option
                      v-for="(item) in attrList"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.key }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>
              <div class="col-6">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="insDate"
                  label="加保日期"
                >
                  <date-picker
                    v-model="form.insDate"
                    placeholder="e.g. 066/01/04"
                    style="width: 100%"
                    type="date"
                    :formatter="formatter"
                    :allow-clear="true"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="benType"
                  label="受益人"
                >
                  <a-input
                    :value="benTypeName"
                    disabled
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <a-form-model-item
                  class="form__policychange__item"
                  prop="note"
                  label="備註"
                >
                  <a-textarea
                    v-model="form.note"
                    placeholder="您想備註什麼呢"
                    :max-length="50"
                    :auto-size="{ minRows: 1}"
                  />
                </a-form-model-item>
              </div>
            </div>
          </div>
        </a-form-model>
        <div
          class="row"
        >
          <div
            v-if="benTypeInfo && isShowForm"
            class="hr--light"
          />
          <div
            v-if="benTypeInfo && isShowForm"
            class="col-12"
          >
            <div class="text-center">
              {{ benTypeInfo.desc }}
              <a
                href=""
                @click.prevent="downloadFile(benTypeInfo.docId)"
              >{{ benTypeInfo.linkDesc }}</a>
            </div>
          </div>
          <div class="col-12">
            <div class="block__btns text-center form__policychange__bottom">
              <button
                v-if="todayEdit"
                class="btn__radius--primary--outline"
                @click="backToTodaySearch"
              >
                上一步
              </button>
              <button
                class="btn__radius--primary"
                @click="submitFamData"
              >
                下一步
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import { Action } from 'vuex-class';
import {
	EmpFamilyPageDto,
	PolicyModel,
	EmployeeEnrollmentValidId,
	EmployeeEnrollmentModel,
	EmployeeFamilyEnrollmentModel,
	EmployeeEnrollmentBenTypePdf,
	FGPEMPNEmployeeQueryModel,
	PolicyModelWithAttr,
} from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import UserDataCard from '@/components/shared/info/UserDataCard.vue';
import infoNotification from '@/plugins/info/infoNotification';
import notificationModal from '@/plugins/info/infoModal';

export interface formModel {
	insName: string;
  englishName: string;
  idNo: string;
  insBirthdate: string;
  nationality: string;
  insSex: string;
  benType: string;
  attr: string;
  insDate: Date;
  note: string;
}

@Component({ components: { UserDataCard } })
export default class FamilyDataForm extends Vue {
  @Prop()
  breadcrumb: {}

  @Prop()
  policyModel: PolicyModel

  @Prop() // 編輯狀態，有員工與眷屬的預設值
  initData: EmployeeFamilyEnrollmentModel

  @Prop() // 是否是從今日異動明細過來
  todayEdit: boolean;

  @Prop() // 從今日異動第幾頁來的
  todaySearchPagination;

  @Prop() // 受理失敗、成功 繼續員眷加保
  employeeId;

  @Action('setLoading') setLoading;

  @Watch('submitEmp')
  onSubmitEmpChange(val) {
  	if (val) {
  		this.isShowForm = true;
  	}
  }

  @Watch('initData')
  onInitDataChange(val) {
  	val ? this.isEdit = true : this.isEdit = false;
  	this.form = val;
  	this.form.insBirthdate = new Date(val.insBirthdate) as any;
  	this.form.insDate = new Date(val.insDate) as any;
  	this.setInitData();
  }

  // 時間format格式
  formatter = this.$twDateFormatter;

  benTypeInfo: EmployeeEnrollmentBenTypePdf = null;

  // search btn loading animate
  isSearching: boolean = false;

  // 是否為編輯狀態
  isEdit: boolean = false;

  // 是否在init資料
  isIniting: boolean = false;

  // 查詢員眷方式與值
  queryForm = {
  	option: null,
  	crtNo: null,
  	insIdNo: null,
  	insName: null,
  };

  // 受益人
  benType: {[key: string]: string} = null;

  // 受益人中文
  benTypeName: string = null;

  // 屬性列表
  attrList: Array<{ key: string; value: string}> = null;

  // 國籍列表
  nationalityList = null;

  // 查詢員工列表
  employeeList: Array<EmpFamilyPageDto & { isAdd?: boolean }> = null;

  // 選定要進行眷屬加保的員工
  submitEmp: EmpFamilyPageDto & { isAdd?: boolean } = null;

  // 是否顯示表單
  isShowForm: boolean = false;

  isSubmitting: boolean = false;

  // 加保日期最小值(API取得)
  minInsDate: Date = null;

  // 表單
  form: EmployeeFamilyEnrollmentModel = {
  	insName: null,
  	englishName: null,
  	idNo: null,
  	insBirthdate: null,
  	nationality: '001',
  	insSex: null,
  	attr: null,
  	insDate: null,
  	benType: null,
  	note: null,
  };

  // 查詢表單檢驗規則
  queryFormRules: { [key: string]: ValidationRule[] } = {
  	insIdNo: [{ required: true, message: '請填入有效身分證字號' }, { pattern: /[A-Z]\d/, message: '輸入格式錯誤' }],
  	crtNo: [{ required: true, message: '請填入有效保險證號' }, { pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]+$/, message: '保險證號輸入格式錯誤' }],
  	insName: [{ required: true, message: '請填入有效姓名' }, { max: 100, message: '姓名輸入格式錯誤' }],
  };

  // 表單檢驗規則
  formRules: { [key: string]: ValidationRule[] } = {
  	insName: [
  		{ required: true, message: '請填寫眷屬姓名', trigger: 'blur' },
  	],
  	englishName: [
  		{ validator: this.englishNameRule, trigger: 'blur' },
  	],
  	idNo: [
  		{ required: true, message: '請填寫身分證字號/居留證號碼', trigger: 'blur' },
  		{ trigger: 'blur', validator: this.insIdRule },
  		{ pattern: /^[A-Za-z0-9]+$/, message: '僅能填入半形英數', trigger: 'blur' },
  	],
  	mobile: [
  		{ pattern: /^[0-9]{10}$/g, message: '行動電話格式填寫錯誤', trigger: 'blur' },
  	],
  	insBirthdate: [
  		{ required: true, message: '請填寫生日', trigger: 'change' },
  	],
  	nationality: [
  		{ required: true, message: '請填寫國籍', trigger: 'change' },
  		{ trigger: 'change', validator: this.nationalityRule },
  	],
  	insSex: [
  		{ required: true, message: '請填寫性別', trigger: 'change' },
  		{ trigger: 'change', validator: this.sexRule },
  	],
  	attr: [
  		{ required: true, message: '請選擇屬性', trigger: 'change' },
  	],
  	insDate: [
  		{ required: true, message: '請選擇加保日期', trigger: 'change' },
  	],
  };

  // 身分證字號檢核
  async insIdRule(rule, value, callback) {
  	if (!this.isSubmitting) {
  		const vm = this;
  		// 檢核是否已申請過加保
  		vm.setLoading(true);
  		// TODO:編輯加保要多帶appNo(未做)
  		const request: EmployeeEnrollmentValidId = {
  			idNo: value,
  			policyModel: vm.policyModel,
  			nationality: this.form.nationality,
  			appNo: vm.form.appNo,
  		};
  		await vm.$employeeEnrollmentApi.idValidUsingPOST(request)
  			.then((resp) => {
  				if (resp.data.status === 200) {
  					callback();
  				} else {
  					callback(vm.$global.getApiErrorMsg(resp.data.apiError).join(''));
  				}
  			})
  			.catch(console.error)
  			.finally(() => {
  				if (!this.isSubmitting) {
  					vm.setLoading(false);
  				}
  			});
  	} else {
  		callback();
  	}
  }

  // 性別檢核
  sexRule(rule, value, callback) {
  	if (this.form.nationality === '001' && this.form.idNo) {
  		(this.$refs.formRef as any).validateField('idNo');
  	}
  	callback();
  }

  // 國籍檢核
  nationalityRule(rule, value, callback) {
  	(this.$refs.formRef as any).validateField('englishName');
  	if (this.form.idNo) {
  		(this.$refs.formRef as any).validateField('idNo');
  	}
  	callback();
  }

  // 時間選擇日期不得大於今天
  disabledAfterToday(date) {
  	const today = new Date();
  	today.setHours(0, 0, 0, 0);
  	return date > today;
  }

  // 眷屬加保日期可選最小值
  disabledBeforeMinDate(date) {
  	return date < this.minInsDate;
  }

  // hook
  async created() {
  	// this.setLoading(false);

  	this.nationalityList = await this.$global.getNationalityData();
  	// 抓取屬性列表
  	await this.$employeeFamilyEnrollmentApi.familyAttrListUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.attrList = Object.keys(resp.data.data).map((ele) => {
  					const item = {
  						key: resp.data.data[ele],
  						value: ele,
  					};
  					return item;
  				});
  			}
  		})
  		.catch(console.error);

  	// 從受理成功或失敗可以繼續眷屬加保，會帶員工身分證進行加保
  	if (this.employeeId) {
  		this.queryForm.insIdNo = this.employeeId;
  		await this.searchEmployee('insIdNo', this.queryForm.insIdNo);
  	}

  	if (this.initData) {
  		this.isEdit = true;
  		this.form = this.initData;
  		this.form.insBirthdate = new Date(this.form.insBirthdate) as any;
  		this.form.insDate = new Date(this.form.insDate) as any;
  		console.log(this.form);
  		await this.setInitData();
  	} else {
  		this.isEdit = false;
  		this.form.policyModel = this.policyModel;
  	  this.setLoading(false);
  	}
  }

  updated() {
  	window.parseWord();
  }

  async setInitData() {
  	console.log('this.initData', this.initData);
  	this.isIniting = true;
  	this.isEdit = true;
  	this.form = this.initData;
  	this.form.insBirthdate = new Date(this.form.insBirthdate) as any;
  	this.form.insDate = new Date(this.form.insDate) as any;
  	const empCrtNo = await this.$encryptionDecryption.decrypt(this.initData.crtNo);
  	this.queryForm.crtNo = empCrtNo;
  	await this.searchEmployee('crtNo', this.queryForm.crtNo);
  	await this.getBenType();
  	this.isIniting = false;
  }

  // 取得受益人類別
  getBenType() {
  	if (this.form.attr !== null) {
  		this.setLoading(true);
  		const request: PolicyModelWithAttr = {
  			...this.policyModel,
  			attr: this.form.attr,
  		};
  		return this.$employeeEnrollmentApi.benTypeUsingPOST(request)
  			.then((resp) => {
  				console.log('取得受益人類別', resp);
  				if (resp.data.status === 200) {
  					this.benType = resp.data.data;
  					this.benTypeName = Object.values(resp.data.data)[0];
  					this.form.benType = Object.keys(resp.data.data)[0];
  					this.getBentypePdf(Object.keys(resp.data.data)[0]);
  				} else {
  					notificationModal.alertForListError({
  						contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  					});
  				}
  			})
  			.catch(console.error)
  			.finally(() => {
  				if (!this.isIniting) {
  					this.setLoading(false);
  				}
  			});
  	}
  }

  // 依受益人產生wording與下載檔案
  getBentypePdf(benType) {
  	return this.$employeeEnrollmentApi.enrollBenTypePdfUsingPOST({
  		benType,
  		policyModel: this.policyModel,
  	})
  		.then((resp) => {
  			console.log('取得受益人類別檔案', resp);
  			if (resp.data.status === 200) {
  				if (resp.data.data.docId !== null) {
  					this.benTypeInfo = resp.data.data;
  				} else {
  					this.benTypeInfo = null;
  				}
  			} else {
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 加保按鈕被點擊
  onClickAdd(emp: EmpFamilyPageDto & { isAdd?: boolean }) {
  	console.log('emp', emp);
  	this.employeeList.map((ele) => {
  		if (ele.insId === emp.insId) {
  			ele.isAdd = true;
  			this.submitEmp = ele;
  		} else {
  			ele.isAdd = false;
  		}
  	});
  	this.getMinInsDate(emp);
  }

  // 取得眷屬加保日期最小值
  async getMinInsDate(emp: EmpFamilyPageDto & { isAdd?: boolean }) {
  	const request: FGPEMPNEmployeeQueryModel = {
  		crtNo: emp.crtNo,
  		insIdNo: await this.$encryptionDecryption.decrypt(emp.input.insId),
  		insName: emp.insName,
  		policyModel: this.policyModel,
  	};
  	this.setLoading(true);
  	this.$employeeFamilyEnrollmentApi.minInsDateUsingPOST(request)
  		.then((resp) => {
  			if (resp.status === 200) {
  				console.log(resp);
  				this.minInsDate = new Date(resp.data.data.date);
  				if (!this.isEdit) {
  					this.form.insDate = resp.data.data.needDefault ? new Date(resp.data.data.date) as any : null;
  				}
  			} else {
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 下載檔案
  downloadFile(docID) {
  	this.$docsetApi.downloadNasFileForDocsetUsingPOST(docID, { responseType: 'blob' })
  		.then((resp) => {
  			console.log(resp);
  			let filename = '';
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
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
  				this.$docsetApi.downloadNasFileForDocsetUsingPOST(docID)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						infoNotification.error({ Content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  			      console.log('error status = ', error);
  		      }).finally();
  			}
  		});
  }

  // 查詢員工條件驗證
  onSearch(key, val) {
  	(this.$refs.queryFormRef as any).validate((valid) => {
  		if (valid) {
  			this.searchEmployee(key, val);
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 英文姓名檢核
  englishNameRule(rule, value, callback) {
  	const rules = /^[a-zA-Z.\s]*$/;
  	if (this.form.nationality !== '001') {
  		if (this.form.englishName) {
  			if (!rules.test(value)) {
  				callback('僅能填入半形英文');
  			} else {
  				callback();
  			}
  		} else {
  			callback('請填寫護照上英文全名');
  		}
  	} else if (!rules.test(value)) {
  			callback('僅能填入半形英文');
  		} else {
  			callback();
  		}
  }

  // 查詢員工API
  searchEmployee(key, val) {
  	const data = {
  		policyModel: this.policyModel,
  	};

  	data[key] = val;
  	this.isSearching = true;
  	this.setLoading(true);
  	return this.$employeeFamilyEnrollmentApi.empPageByEnrollUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.employeeList = resp.data.data.map((element) => {
  					this.$set(element, 'isAdd', false);
  					return element;
  				});
  				if (this.employeeList.length > 0) {
  					if (this.isEdit) {
  						this.employeeList.map((element) => {
  							if (element.input.crtNo === this.initData.crtNo) {
  								element.isAdd = true;
  							}
  							return element;
  						});
  						this.isShowForm = true;
  					}
  					if (this.employeeId) {
  						this.employeeList[0].isAdd = true;
  						this.isShowForm = true;
  					}
  					console.log('employeeList', this.employeeList);
  					this.getMinInsDate(this.employeeList[0]);
  				}
  			} else {
  				infoNotification.error({ Content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.isSearching = false;
  			this.setLoading(false);
  		});
  }

  // 送出眷屬資料
  submitFamData() {
  	this.isSubmitting = true;
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			console.log(this.form);
  			const request: EmployeeEnrollmentModel = JSON.parse(JSON.stringify(this.form));
  			// request.benType = Object.keys(this.benType)[0]; // form還要再轉受益人代號
  			request.policyModel = this.policyModel;
  			const infoName = {
  				nationalityName: this.nationalityList.find((item) => item.value === this.form.nationality).key,
  				benTypeName: this.benTypeName,
  				attrName: this.attrList.find((item) => item.value === this.form.attr).key,
  			};
  			const employeeData = this.employeeList.find((e) => e.isAdd == true);
  			request.crtNo = employeeData.input.crtNo; // 眷屬要帶員工加密crtNo
  			console.log({ request, infoName, employeeData });
  			request.insBirthdate = moment(this.form.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  			request.onBoardDate = moment(this.form.insDate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  			this.$emit('sentFamilyData', { request, infoName, employeeData });
  		} else {
  			this.isSubmitting = false;
  			this.setLoading(false);
  			console.log('error submit!!');
  		}
  	});
  }

  // 返回今日異動編輯(回到原始頁數)
  backToTodaySearch() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CO_EFTodayResultTable',
  		query: {
  			pagination: this.todaySearchPagination,
  		},
  	});
  }
}
</script>

<style lang="scss" scoped>
.hr--light{
  border: 0;
  border-bottom: 1px #F5F5F5 solid;
  outline: 0;
  margin: 25px 0px;
}
.hr--dash{
  border: 0;
  border-bottom: 1px#CECECE dashed;
  outline: 0;
  margin: 25px 0px;
}
.hr--dashtopshort{
  border: 0;
  border-bottom: 1px#CECECE dashed;
  outline: 0;
  margin: 10px 0px 25px 0px;
}
.card__btn{
  border-radius: 100vh;
  background-color: #fff;
  border: solid 1px $COLOR-MAIN5;
  color: $COLOR-MAIN5;
  padding: 10px 44px;
  cursor: pointer;
}
.card__btn--active{
  background-color: $COLOR-MAIN5;
  border: solid 1px $COLOR-MAIN5;
  color: #fff;
}
.card__action{
  margin-left: auto;
  margin-right: 23px;
}
.query__wrap{
  margin: -10px auto 25px;
}
.info__txt{
  margin: -5px 0px 20px;
  color: #4CAAF5;
}
.form__policychange__bottom {
  padding: 28px 0px 8px 0px;
}
</style>
