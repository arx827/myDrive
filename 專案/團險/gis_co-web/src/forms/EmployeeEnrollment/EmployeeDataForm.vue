<template>
  <div>
    <a-form-model
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
              個人資料
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
              </span>
              <a-textarea
                v-model.trim="form.insName"
                vue="true"
                alt="webfont"
                :max-length="100"
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
                :formatter="formatter"
                type="date"
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
              prop="mobile"
              label="行動電話"
            >
              <a-input
                v-model="form.mobile"
                placeholder="e.g. 0912345667"
              />
            </a-form-model-item>
          </div>
          <div class="col-6">
            <a-form-model-item
              class="form__policychange__item"
              prop="email"
              label="電子信箱"
            >
              <a-input
                v-model="form.email"
                placeholder="e.g. fubonlife@fubon.com"
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
      </div>
      <div class="form__policychange">
        <div class="row">
          <div class="col">
            <div class="form__policychange__header">
              任職資料
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <a-form-model-item
              class="form__policychange__item"
              prop="crtNo"
              label="保險證號/員工編號"
            >
              <a-input
                v-model="form.crtNo"
                :max-length="10"
                placeholder="e.g. B1234"
              />
            </a-form-model-item>
          </div>
          <div class="col">
            <a-form-model-item
              class="form__policychange__item"
              prop="onBoardDate"
              label="受僱日期"
            >
              <date-picker
                v-model="form.onBoardDate"
                style="width: 100%"
                type="date"
                :formatter="formatter"
                :clearable="false"
                placeholder="___/__/__"
                @change="getLaborInsuranceList($event,true)"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <a-form-model-item
              class="form__policychange__item"
              prop="depNo"
              label="部門別"
            >
              <a-input
                v-model="form.depNo"
                :max-length="6"
                placeholder="僅可輸入英數字"
              />
            </a-form-model-item>
          </div>
          <div class="col">
            <a-form-model-item
              class="form__policychange__item"
              prop="rankNo"
              label="工作內容"
              :rules="{ required: isRankNo, message: '請填寫工作內容', trigger: 'blur' }"
            >
              <a-input
                v-model="form.rankNo"
                placeholder="您的工作"
                :max-length="12"
              />
            </a-form-model-item>
          </div>
        </div>
        <div class="row">
          <div
            v-if="scInsOption.salary && showScInsOption.salary"
            class="col-6"
          >
            <a-form-model-item
              class="form__policychange__item"
              prop="salary"
              label="提報工資 (NTD)"
            >
              <a-input-number
                v-model="form.salary"
                :formatter="value => value.toString().slice(0,9).replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                class="w-100"
                placeholder="e.g. 320,000,000"
                @blur="checkSalaryAllowance('salary')"
              />
              <transition>
                <div
                  v-show="isSalaryTip"
                  class="tip"
                >
                  {{ salaryTip }}
                </div>
              </transition>
            </a-form-model-item>
          </div>
          <div
            v-if="scInsOption.scIns"
            class="col-6"
          >
            <a-form-model-item
              class="form__policychange__item"
              prop="scIns"
              label="於要保單位投保職保"
            >
              <a-radio-group
                v-model="form.scIns"
                class="query__list"
              >
                <a-radio value="Y">
                  是
                </a-radio>
                <a-radio value="N">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </div>
          <div
            v-if="scInsOption.scInsAmt && showScInsOption.scInsAmt"
            class="col-6"
          >
            <a-form-model-item
              class="form__policychange__item"
              prop="scInsAmt"
              label="職保金額 (NTD)"
            >
              <a-select
                v-model="form.scInsAmt"
                :disabled="laborInsuranceList == null || laborInsuranceList.length === 0"
              >
                <a-select-option
                  v-for="item in laborInsuranceList"
                  :key="item"
                  :value="item"
                >
                  {{ item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
          <div
            v-if="scInsOption.allowance && showScInsOption.allowance"
            class="col-6"
          >
            <a-form-model-item
              class="form__policychange__item"
              prop="allowance"
              label="津貼 (NTD)"
            >
              <a-input-number
                v-model="form.allowance"
                class="w-100"
                :formatter="value => value.toString().slice(0,6).replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                placeholder="e.g. 320,000,000"
                @blur="checkSalaryAllowance('allowance')"
              />
              <transition>
                <div
                  v-show="isAllowanceTip"
                  class="tip"
                >
                  {{ allowanceTip }}
                </div>
              </transition>
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
                :max-length="50"
                :auto-size="{ minRows: 1}"
                placeholder="您想備註什麼呢"
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
        v-if="benTypeInfo"
        class="hr--light"
      />
      <div
        v-if="benTypeInfo"
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
            @click="onSubmit"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	EmployeeEnrollmentScIns,
	SalaryModel,
	EmployeeEnrollmentValidCrtNo,
	PolicyModel,
	EmployeeEnrollmentValidId,
	EmployeeEnrollmentModel,
	EmployeeEnrollmentBenTypePdf,
	PolicyModelWithAttr,
	PolicyModelWithUpdateDateAndEffDate,
} from '@fubonlife/co-giiss-api-axios-sdk';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import notificationModal from '@/plugins/info/infoModal';

export interface formModel {
	insName: string;
  englishName: string;
  idNo: string;
  insBirthdate: string;
  nationality: string;
  insSex: string;
  mobile: string;
  email: string;
  benType: string;
  rankNo: string;
  onBoardDate: string;
  depNo: string;
  salary: number;
  scIns: string;
  scInsAmt: string;
  allowance: string;
  note: string;
  crtNo: string;
}

@Component({ components: {} })
export default class EmployeeDataForm extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  initData: EmployeeEnrollmentModel;

  @Prop()
  policyModel: PolicyModel;

  @Prop() // 是否是從今日異動明細過來
  todayEdit: boolean;

  @Prop()
  productType: 'RC' | 'CB';

  @Prop() // 從今日異動第幾頁來的
  todaySearchPagination;

  h = this.$createElement;

  isEdit: boolean = false;

  // 受益人
  benType: {[key: string]: string}

  // 受益人中文名稱
	benTypeName: string = null;

  // 職保列表
  laborInsuranceList = null;

  // 國籍列表
  nationalityList = null;

  isRankNo: boolean = true;

  isSubmitting: boolean = false;

  // 是否於要保單位投保職保、提報工資/職保薪資/津貼顯示API
  scInsOption: EmployeeEnrollmentScIns = {
  	allowance: true,
  	salary: true,
  	scIns: true,
  	scInsAmt: true,
  }

  // 於要保單位投保職保選[否], 隱藏判斷
  showScInsOption = {
  	allowance: true,
  	salary: true,
  	scInsAmt: true,
  }

  // 提報工資提示顯示
  isSalaryTip: boolean = false;

  // 提報工資提示訊息
  salaryTip: string = '提報工資超過50萬元，請確認是否正確';

  // 津貼提示顯示
  isAllowanceTip: boolean = false;

  // 津貼提示訊息
  allowanceTip: string = '津貼超過50萬元，請確認是否正確';

  // 原始受僱日期
  oriOnBoardDate: Date = null;

  // 是否有修改受僱日期
  isChangeOnBoardDate: boolean = null;

  // 時間format格式
  formatter = this.$twDateFormatter;

  benTypeInfo: EmployeeEnrollmentBenTypePdf = null;

  @Watch('productType')
  onProductTypeChange(val) {
  	if (val === 'RC') {
  		this.isRankNo = false;
  	} else {
  		this.isRankNo = true;
  	}
  	console.log('this.isRankNo', this.isRankNo);
  }

  @Watch('initData')
  onInitDataChange(val) {
  	val ? this.isEdit = true : this.isEdit = false;
  	this.form = val;
  	this.form.insBirthdate = new Date(val.insBirthdate) as any;
  	this.form.onBoardDate = new Date(val.onBoardDate) as any;
  }

  @Watch('policyModel')
  onPolicyModelChange(val) {
  	this.form.policyModel = val;
  }

  @Watch('form.scIns')
  onScInsChange(val) {
  	if (val === 'N') {
  		// 清除檢核
  		(this.$refs.formRef as any).clearValidate(['salary', 'scInsAmt']);
  		// 隱藏職保金額、提報工資、津貼
  		this.showScInsOption.allowance = false;
  		this.showScInsOption.salary = false;
  		this.showScInsOption.scInsAmt = false;
  	}
  	if (val === 'Y') {
  		this.showScInsOption.allowance = true;
  		this.showScInsOption.salary = true;
  		this.showScInsOption.scInsAmt = true;
  	}
  }

  @Watch('form.onBoardDate', { deep: true })
  onOnBoardDateChange(newVal, oldVal) {
  	console.log('newVal, oldVal', newVal, oldVal);
  	if (oldVal) {
  		if (this.form.scInsAmt) {
  			notificationModal.alertForSingleError({
  				title: '提示',
  				content: '受僱日期已異動，請重新確認資訊是否正確',
  			});
  		}
  	}
  }

  // 表單
  form: EmployeeEnrollmentModel = {
  	crtNo: null,
  	insName: null,
  	englishName: null,
  	idNo: null,
  	insBirthdate: null,
  	nationality: '001',
  	insSex: null,
  	mobile: null,
  	email: null,
  	benType: null,
  	rankNo: null,
  	onBoardDate: null,
  	depNo: null,
  	salary: null,
  	scIns: null,
  	scInsAmt: null,
  	allowance: null,
  	note: null,
  	policyModel: null,
  	appNo: null,
  };

  // 表單檢驗規則
  formRules: { [key: string]: ValidationRule[] } = {
  	insName: [
  		{ required: true, message: '請填寫員工姓名', trigger: 'blur' },
  	],
  	englishName: [
  		{ validator: this.englishNameRule, trigger: 'blur' },
  	],
  	crtNo: [
  		{ trigger: 'blur', validator: this.crtNoRule },
  		{ pattern: /^[A-Za-z0-9~\!@#\$%\^&\*\(\)_\+\{\}\|\:"<>\?`\-\=\[\]\\;',\.\/]{1,10}$/, message: '僅能填入半形英數與符號', trigger: 'blur' },
  	],
  	idNo: [
  		{ required: true, message: '請填寫身分證字號/居留證號碼', trigger: 'blur' },
  		{ trigger: 'blur', validator: this.insIdRule },
  		{ pattern: /^[A-Za-z0-9]+$/, message: '僅能填入半形英數', trigger: 'blur' },
  	],
  	mobile: [
  		{ pattern: /^09\d{8}$/, message: '行動電話格式填寫錯誤', trigger: 'blur' },
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
  	depNo: [
  		// { required: true, message: '請填寫部門別', trigger: 'blur' },
  		{ pattern: /^[A-Za-z0-9]+$/, message: '僅能填入英數', trigger: 'blur' },
  	],
  	onBoardDate: [
  		{ required: true, message: '請選擇受僱日期', trigger: 'change' },
  	],
  	rankNo: [
  		{ message: '請填寫工作內容', trigger: 'blur' },
  	],
  	email: [
  		{ pattern: /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/, message: 'email格式填寫錯誤', trigger: 'blur' },
  	],
  	salary: [
  		{ required: true, message: '請填寫提報工資', trigger: 'blur' },
  	],
  	scIns: [
  		{ required: true, message: '請填寫於要保單位投保職保', trigger: 'change' },
  	],
  	scInsAmt: [
  		{ required: true, message: '請填寫職保金額', trigger: 'change' },
  	],
  	// allowance: [
  	// 	{ required: true, message: '請填寫津貼', trigger: 'blur' },
  	// ],
  };

  // Hook
  async created() {
  	const vm = this;
  	vm.setLoading(true);
  	console.log('this.todayEdit', this.todayEdit);
  	console.log('this.productType', this.productType);
  	if (this.productType === 'RC') {
  		this.isRankNo = false;
  	} else {
  		this.isRankNo = true;
  	}

  	if (this.initData) {
  		this.isEdit = true;
  		this.form = this.initData;
  		this.form.insBirthdate = new Date(this.form.insBirthdate) as any;
  		this.form.onBoardDate = new Date(this.form.onBoardDate) as any;
  		this.oriOnBoardDate = new Date(this.form.onBoardDate);
  		console.log(this.form);
  	} else {
  		this.isEdit = false;
  		this.form.policyModel = this.policyModel;
  	}
  	// 取得國籍
  	this.nationalityList = await this.$global.getNationalityData();
  	await this.getBenType();
  	await this.scInsSearch();
  	if (this.isEdit) {
  		await this.getLaborInsuranceList();
  	}
  	vm.setLoading(false);
  }

  updated() {
  	window.parseWord();
  }

  // 身分證字號檢核
  async insIdRule(rule, value, callback) {
  	if (!this.isSubmitting) {
  		const vm = this;
  		// 檢核是否已申請過加保
  		vm.setLoading(true);
  		const request: EmployeeEnrollmentValidId = {
  			idNo: value,
  			policyModel: vm.form.policyModel,
  			nationality: vm.form.nationality,
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

  // 保險證號檢核
  async crtNoRule(rule, value, callback) {
  	if (!this.isSubmitting) {
  		const vm = this;
  		if (value === null || value === '' || value === undefined) {
  			callback();
  		} else {
  			vm.setLoading(true);
  			console.log('form', this.form);
  			const request: EmployeeEnrollmentValidCrtNo = {
  				crtNo: value,
  				policyModel: vm.form.policyModel,
  				appNo: vm.form.appNo,
  			};
  			await vm.$employeeEnrollmentApi.crtNoValidUsingPOST(request)
  				.then((resp) => {
  					console.log('保險證號/員工編號檢核是否有投保', resp);
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
  		}
  	}
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

  // 時間選擇日期不得大於今天
  disabledAfterToday(date) {
  	const today = new Date();
  	today.setHours(0, 0, 0, 0);
  	return date > today;
  }

  // 取得受益人類別
  getBenType() {
  	const request: PolicyModelWithAttr = {
  		...this.policyModel,
  		attr: '1', // 員工
  	};

  	return this.$employeeEnrollmentApi.benTypeUsingPOST(request)
  		.then((resp) => {
  			console.log('取得受益人類別', resp);
  			if (resp.data.status === 200) {
  				this.benType = resp.data.data;
  				this.benTypeName = Object.values(resp.data.data)[0];
  				this.form.benType = Object.values(resp.data.data)[0];
  				this.getBentypePdf(Object.keys(resp.data.data)[0]);
  			} else {
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(console.error)
  		.finally();
  }

  // 依受益人產生wording與下載檔案
  getBentypePdf(benType) {
  	return this.$employeeEnrollmentApi.enrollBenTypePdfUsingPOST({
  		benType,
  		policyModel: this.policyModel,
  	})
  		.then((resp) => {
  			console.log('取得受益人類別wording與下載檔案', resp);
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
  		.finally();
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
  						notificationModal.alertForSingleError({
  							content: this.$global.getApiErrorMsg(apiErrorMsg).join(''),
  						});
  			  }).catch((error) => {
  			      console.log('error status = ', error);
  		    }).finally();
  			}
  		});
  }

  // 是否於要保單位投保職保、提報工資/職保薪資/津貼顯示API
  scInsSearch() {
  	return this.$employeeEnrollmentApi.scInsUsingPOST(this.policyModel)
  		.then((resp) => {
  			console.log('是否於要保單位投保職保、提報工資/職保薪資/津貼顯示API', resp);
  			if (resp.data.status === 200) {
  				this.scInsOption = resp.data.data;
  			}
  		})
  		.catch(console.error)
  		.finally();
  }

  // 取得職保級距下拉選單資料
  getLaborInsuranceList($event?, closeLoading?: boolean) {
  	console.log('this.form.onBoardDate', this.form.onBoardDate);
  	console.log('event', $event);
  	if (closeLoading) {
  		this.setLoading(true);
  	}
  	const request: PolicyModelWithUpdateDateAndEffDate = {
  		...this.policyModel,
  		updateDate: this.form.onBoardDate,
  	};
  	return (
  		this.$coUtilityApi.listLaborInsStepUsingPOST(request)
  			.then((resp) => {
  				if (resp.status === 200) {
  					console.log('取得職保級距下拉選單資料', resp);
  					this.laborInsuranceList = resp.data.data;
  					if (this.laborInsuranceList.find((e) => e == this.form.scInsAmt) == undefined) {
  						this.form.scInsAmt = null;
  					}
  				} else {
  					notificationModal.alertForListError({
  						contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  					});
  				}
  			})
  			.catch(console.error)
  			.finally(() => {
  				if (closeLoading) {
  					this.setLoading(false);
  				}
  			})
  	);
  }

  // 計算取得職保薪資
  getscInsAmt(salaryInput, allowanceInput?) {
  	const request: SalaryModel = {
  		salary: salaryInput,
  		allowance: allowanceInput || null,
  		policyModelWithUpdateDateAndEffDate: {
  			...this.policyModel,
  			updateDate: this.formatter.onBoardDate,
  		},
  	};
  	return this.$coUtilityApi.getScInsAmtUsingPOST(request)
  		.then((resp) => {
  			console.log('計算取得職保薪資', resp);
  			if (resp.data.status === 200) {
  				this.form.scInsAmt = resp.data.data;
  			} else {
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch(console.error)
  		.finally();
  }

  // 檢查提報工資/津貼超過50萬
  checkSalaryAllowance(item) {
  	if (item === 'salary') {
  		this.isSalaryTip = this.form.salary > 500000;
  	} else {
  		this.isAllowanceTip = this.form.allowance > 50000;
  	}
  }

  reset() {
  	this.form = {
  		crtNo: null,
  		insName: null,
  		englishName: null,
  		idNo: null,
  		insBirthdate: null,
  		nationality: '001',
  		insSex: null,
  		mobile: null,
  		email: null,
  		benType: null,
  		rankNo: null,
  		onBoardDate: null,
  		depNo: null,
  		salary: null,
  		scIns: null,
  		scInsAmt: null,
  		allowance: null,
  		note: null,
  		policyModel: null,
  		appNo: null,
  	};
  }

  // 送出查詢資料
  onSubmit() {
  	const vm = this;
  	this.isSubmitting = true;
  	(this.$refs.formRef as any).validate(async (valid) => {
  		if (valid) {
  			console.log(this.form);
  			// if (this.form.scIns === 'N') {
  			// 	this.form.salary = null;
  			// 	this.form.scInsAmt = null;
  			// 	this.form.allowance = null;
  			// } else {
  				this.form.salary = this.scInsOption.salary && this.showScInsOption.salary ? parseInt(this.form.salary.toString().slice(0, 9)) : null;
  				this.form.scInsAmt = this.scInsOption.scInsAmt && this.showScInsOption.scInsAmt ? this.form.scInsAmt : null;
  				this.form.allowance = this.scInsOption.allowance && this.form.allowance && this.showScInsOption.allowance ? parseInt(this.form.allowance.toString().slice(0, 6)) : null;
  			// }
  			// 是否需要計算薪資
  			// if (this.scInsOption.salary == true && this.scInsOption.scInsAmt == false && this.form.scIns === 'Y') {
  			// 	await this.getscInsAmt(this.form.salary, this.form.allowance);
  			// }
  			const request: EmployeeEnrollmentModel = JSON.parse(JSON.stringify(this.form));
  			request.benType = Object.keys(this.benType)[0]; // form還要再轉受益人代號
  			request.policyModel = this.policyModel;
  			request.attr = '1';
  			const infoName = {
  				nationalityName: this.nationalityList.find((item) => item.value === this.form.nationality).key,
  				benTypeName: this.benTypeName,
  				scInsOption: this.scInsOption,
  			};
  			request.insBirthdate = moment(this.form.insBirthdate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  			request.onBoardDate = moment(this.form.onBoardDate).format('YYYY-MM-DDTHH:mm:ss.sssZ');
  			if (this.isEdit) {
  				// console.log('this.oriOnBoardDate', this.oriOnBoardDate);
  				// console.log('new Date(this.form.onBoardDate)', new Date(this.form.onBoardDate));
  				this.oriOnBoardDate.getTime() == new Date(this.form.onBoardDate).getTime() ? this.isChangeOnBoardDate = false : this.isChangeOnBoardDate = true;
  			  // vm.isChangeOnBoardDate = true;
  			}
  			console.log({ request, infoName, isChangeOnBoardDate: vm.isChangeOnBoardDate });
  			this.$emit('sentEmployeeData', { request, infoName, isChangeOnBoardDate: vm.isChangeOnBoardDate });
  		} else {
  			this.isSubmitting = false;
  			this.setLoading(false);
  			console.log('error', this.form);
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
    border-bottom: 1px#CECECE solid;
    outline: 0;
    margin: 25px 0px;
  }
  .info__txt {
    margin: 10px 0;
  }
  .query__content {
    padding-bottom: 80px;
  }
  .query__option{
    margin-bottom: 40px;
  }

  .form__policychange__bottom{
    padding: 28px 0px 8px 0px;
  }

  .tip {
    position: relative;
    opacity: 100;
    color: #f5222d;
    // top: 28px;
    padding-top: 2px;
  }
  ::v-deep .ant-input-number-handler-wrap{
    display: none;
  }
  .v-enter-active, .v-leave-active {
    transition: all .3s cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  .v-enter, .v-leave-to {
    opacity: 0;
    color: rgba(0, 0, 0, 0.45);
    top: -5px;
  }
</style>
