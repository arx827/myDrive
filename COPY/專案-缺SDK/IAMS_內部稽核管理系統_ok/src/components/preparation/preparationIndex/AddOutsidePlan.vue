<template>
  <InfoModal
    :title="headerTitle"
    :visible="visible"
    :centered="true"
    :width="650"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div>
        <div class="form mt-2">
          <a-form-model
            ref="formRef"
            :model="form"
            :rules="formRules"
            :wrapper-col="{ span: 18, offset: 6 }"
          >
            <a-form-model-item
              prop="year"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                年度
              </span>
              <date-picker
                v-model="form.year"
                :formatter="yearFormatter"
                type="year"
                :allow-clear="true"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              ref="startMonth"
              prop="startMonth"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                預計查核月份
              </span>
              <a-select
                v-model="form.startMonth"
                :options="$enum.monthOption"
                placeholder="起"
                class="search__result__month search-form__select--month--left"
                :dropdown-match-select-width="false"
              />
              <a-input
                class="search-form__range"
                placeholder="~"
                disabled
              />
              <a-select
                v-model="form.endMonth"
                placeholder="迄"
                :options="$enum.monthOption"
                class="search__result__month search-form__select--month--right"
                :dropdown-match-select-width="false"
                @change="() => {$refs.startMonth.onFieldChange()}"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="auditType"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                查核性質
              </span>
              <a-input
                v-model="form.auditType"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="auditTime"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                查核期間
              </span>
              <date-picker
                v-model="form.auditTime"
                :formatter="dateFormatter"
                :range="true"
                type="date"
                :allow-clear="true"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              v-if="!initData"
              prop="auditItem"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                查核項目
              </span>
              <a-input
                v-model="form.auditItem"
                class="w-100"
              />
            </a-form-model-item>
            <a-form-model-item
              prop="inCharge"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                領隊人員
              </span>
              <a-select
                v-model="form.inCharge"
                show-search
                class="w-100"
                :show-arrow="true"
                :allow-clear="true"
                :filter-option="$global.filterOption"
              >
                <a-select-option
                  v-for="item in selectOption.auditMenber.filter(i => form.auditMenber.includes(i.domainId))"
                  :key="item.domainId"
                  :value="item.domainId"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              prop="auditMenber"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                查核人員
              </span>
              <a-select
                v-model="form.auditMenber"
                show-search
                mode="multiple"
                class="w-100"
                :show-arrow="true"
                :filter-option="$global.filterOption"
                @change="changeAuditMenber"
              >
                <a-select-option
                  v-for="item in selectOption.auditMenber"
                  :key="item.domainId"
                  :value="item.domainId"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              v-if="initData"
              prop="checkedUnit"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <span slot="label">
                受查單位
              </span>
              <a-tree-select
                v-model="form.checkedUnit"
                mode="multiple"
                :tree-data="selectOption.checkedUnit"
                tree-checkable
                :tree-default-expand-all="true"
                tree-node-filter-prop="title"
                dropdown-class-name="treeselect"
                :dropdown-style="{'maxHeight': '300px'}"
                :show-arrow="true"
                :dropdown-match-select-width="false"
                placeholder="請選擇受查單位"
              />
            </a-form-model-item>

            <!-- <a-form-model-item
              prop="planClass.plan"
              :label-col="{ span: 9 }"
              :wrapper-col="{ span: 15 }"
            >
              <span slot="label">
                是否增加至七大流程
              </span>
              <a-radio-group
                v-model="form.planClass.plan"
                default-value="03"
                class="w-100 planClass__group"
              >
                <a-radio :value="'03'">
                  <div>
                    是
                  </div>
                  <a-form-model-item
                    :required="form.planClass.plan === '03'"
                    :rules="{ required: form.planClass.plan === '03', message: '為必選', trigger: 'change' }"
                    prop="planClass.classY"
                    class="planClass__group__item"
                  >
                    <a-select
                      v-model="form.planClass.classY"
                      :disabled="form.planClass.plan === '02'"
                      show-search
                      class="ms-1 w-50"
                      placeholder="請選擇受查單位"
                    >
                      <a-select-option value="jack">
                        Jack
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-radio>
                <a-radio :value="'02'">
                  否
                  <a-form-model-item
                    :rules="{ required: form.planClass.plan === '02', message: '為必填', trigger: 'change' }"
                    :required="form.planClass.plan === '02'"
                    prop="planClass.classN"
                    class="planClass__group__item"
                  >
                    <a-input
                      v-model="form.planClass.classN"
                      :disabled="form.planClass.plan === '03'"
                      class="ms-1 w-50"
                    />
                  </a-form-model-item>
                </a-radio>
              </a-radio-group>
            </a-form-model-item> -->

            <!--編輯-->
            <!-- <template v-else /> -->
          </a-form-model>
        </div>
        <div class="d-flex mt-4 justify-content-end">
          <button
            class="btn--primary me-2"
            @click="submit"
          >
            {{ initData?'確認':'新增' }}
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { Getter, Action } from 'vuex-class';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';
// export interface todoListDataInterface{
//   img: string;
//   title: string;
//   count: number;
// }

@Component({
	components: { InfoModal },
})
export default class AddOutsidePlan extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean;

  @Prop()
  initData

  // 時間format格式
  dateFormatter = this.$twDateFormatter;

  yearFormatter = this.$twYearFormatter;

  // 原始 人員列表
  originAuditArr = [];

  get isEdit() {
  	return !!this.initData;
  }

  // title組裝
  get headerTitle() {
  	const typeStr = (this.isEdit) ? '編輯' : '新增';
  	return `${typeStr}計畫（外）作業`;
  }

  // 主辦組 列表
  get mainAucitorTeam() {
  	if (this.initData.mainAucitorTeam) {
  	  return this.initData.mainAucitorTeam.auditorTeam;
  	}
  	return '';
  }

  // 協辦組 列表
  get coAucitorTeam() {
  	if (this.initData.coAucitorTeam) {
  		return this.initData.coAucitorTeam?.map((i) => i.auditorTeam);
  	}
  	return '';
  }

  // 角色是主辦組？
  get isMainAucitorTeam() {
  	return this.mainAucitorTeam === this.$global.getCurrentRoleTeamCode();
  }

  // 角色是協辦組？
  get iscoAucitorTeam() {
  	return this.coAucitorTeam.includes(this.$global.getCurrentRoleTeamCode());
  }

  // --------- 下拉選項 --------- //
  selectOption = {
  	inCharge: '', // 領隊人員
  	auditMenber: [], // 查核人員
  	checkedUnit: [], // 受查單位
  	planGroupInPreparation: [], // 協辦組
  }

  form = {
  	year: null,
  	startMonth: null,
  	endMonth: null,
  	auditType: '',
  	auditItem: '',
  	inCharge: [],
  	auditMenber: [],
  	checkedUnit: [],

  	auditTime: [],
  	member: [],
  	planClass: {
  		plan: '03',
  		classY: null,
  		classN: null,
  	},
  };

  // 領隊人員選項
  // leaderOption = []

  // dataType = '';

  formRules: { [key: string]: ValidationRule[] } = {
  	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  	startMonth: [
  		{ required: true, message: '請選擇預計查核月份', trigger: 'change' },
  		{ trigger: 'change', validator: this.monthValidator },
  	],
  	auditType: [{ required: true, message: '請輸入查核性質', trigger: 'change' }],
  	auditTime: [{ required: true, message: '請選擇查核期間', trigger: 'change' }],
  	auditItem: [{ required: true, message: '請輸入查核項目', trigger: 'change' }],
  	inCharge: [{ required: true, message: '請選擇領隊人員', trigger: 'change' }],
  	auditMenber: [{ required: true, message: '請選擇查核人員', trigger: 'change' }],
  	checkedUnit: [{ required: true, message: '請選擇受查單位', trigger: 'change' }],

  	// unitName: [{ required: true, message: this.initData ? '請輸入受查單位' : '請選擇受查單位', trigger: 'change' }],
  	'planClass.plan': [{ required: true, message: '請選擇是否加入七大流程', trigger: 'change' }],
  	// 'planClass.classY': [{ required: false, message: '為必選', trigger: 'change' }],
  	// 'planClass.classN': [{ required: false, message: '為必填', trigger: 'change' }],
  };

  monthValidator(rule, value, callback) {
  	if (this.form.startMonth === undefined || this.form.endMonth === undefined) {
  		callback('請填入月份');
  	} else if (parseInt(this.form.startMonth, 10) > parseInt(this.form.endMonth, 10)) {
  		callback('結束月份不得小於開始月份');
  	} else {
  		callback();
  	}
  }

  // 查核期間 驗證
  rangeDateValidator(rule, value, callback) {
  	if (this.form[rule.field].some((i) => !i)) {
  		callback('請填入查核期間');
  	} else {
  		callback();
  	}
  }

  // 若角色為 協辦 只能編輯 協辦
  isDisabledGroup(groupId) {
  	// 是否為禁止編輯的組別
  	const currentRoleGroupId = this.$global.getCurrentRoleTeamCode();
  	if (this.isMainAucitorTeam) {
  		// 主辦組 全show
  		return false;
  	}
  	// 不是主辦，只篩選 自己組別
  	return groupId !== currentRoleGroupId;
  }

  /**
	 * API
	 */
  // API: 查核人員 下拉選項
  getApi_searchAuditors() {
  	this.setLoading(true);
  	this.$preparationApi.searchAuditorsUsingPOST()
  		.then((resp) => {
  			const getData = resp.data.result;

  			// 只列出主辦 跟 協辦
  			this.selectOption.auditMenber = getData.filter((i) => [this.mainAucitorTeam, ...this.coAucitorTeam].includes(i.group));

  			// 排序查核人員 到 原始下拉列表
  			this.originAuditArr = getData;
  			this.originAuditArr.sort((a, b) => a.group.charCodeAt() - b.group.charCodeAt());
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 受查單位 下拉選項
  getApi_yapUnit() {
  	this.setLoading(true);
  	const requestYear = this.initData.year.toString();
  	this.$preparationApi.searchUnitNameInPreparationUsingGET(requestYear)
  		.then((resp) => {
  			const getData = resp.data.result;
  			// 整理資料
  			this.selectOption.checkedUnit = [
  				{
  					title: '全部',
  					value: 'all',
  					key: 'all',
  					children: getData.validYapUnits?.map((e) => ({
  						title: e.value + e.label,
  						value: e.value,
  						key: e.value,
  					})),
  				},
  				{
  				title: '無效單位',
  				value: 'invalid',
  				key: 'invalid',
  				children: getData.inValidYapUnits?.map((e) => ({
  					title: e.value + e.label,
  					value: e.value,
  					key: e.value,
  				})),
  			},
  			];
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 協辦組 下拉選項
  getApi_searchInsidePlanGroup() {
  	this.setLoading(true);
  	this.$preparationApi.searchInsidePlanGroupInPreparationUsingGET()
  		.then((resp) => {
  			const getData = resp.data.result;
  			// 排除主辦組
  			this.selectOption.planGroupInPreparation = getData.filter((i) => i.value !== this.mainAucitorTeam);
  		})
  		.catch(console.error)
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 初始化資料
  createData() {
  	// console.log('initData => ', this.initData);
  	Promise.all([
  		this.getApi_searchAuditors(), // API: 查核人員 下拉
  		this.getApi_yapUnit(), // API: 受查單位 下拉
  		// this.getApi_searchInsidePlanGroup(), // API: 協辦組 下拉
  	])
  		.then(() => {
  			this.form.year = DateTimeFormmat.isValidDate(moment(this.initData.year).add(1911, 'year').format());
  			this.form.startMonth = this.initData.startMoth;
  			this.form.endMonth = this.initData.endMoth;
  			this.form.auditType = this.initData.auditType;
  			this.form.auditTime = [DateTimeFormmat.isValidDate(moment(this.initData.ckStartDate).format()), DateTimeFormmat.isValidDate(moment(this.initData.ckEndDate).format())];

  			this.form.inCharge = this.initData.inCharge?.map((i) => i.domainId);
  			this.form.auditMenber = this.initData.checkMan?.map((i) => i.domainId);
  			this.form.checkedUnit = this.initData.checkedUnit?.map((i) => i.departmentId);

  			// this.form.inCharge = this.initData.inCharge?.map((i) => i.domainId);
  			// this.form.auditMenber = this.initData.checkMan?.map((i) => i.domainId);
  			// this.form.checkedUnit = this.initData.checkedUnit?.map((i) => i.departmentId);
  			// this.form.coAucitorTeam = this.initData.coAucitorTeam?.map((i) => i.auditorTeam);
  		});
  }

  /**
	 * Event
	 */
  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			// 計劃內 未處理 0727
  			const formData = {

  			};
  			// console.log(this.form);
  			//         {
  			//   "checkMans": "string",     // 查核人員
  			//   "ckEndDate": "2022-07-25T02:39:01.728Z",       // 查核期間-迄
  			//   "ckStartDate": "2022-07-25T02:39:01.728Z",     // 查核期間-起
  			//   "groupTeams": {                                // 領隊人員
  			//     "auditorName": "string",
  			//     "auditorTeam": "string"
  			//   },
  			//   "inChargeMan": "string",                       // 領隊人員
  			//   "itemDescs": {                                 // 季工作規劃明細檔資料表的主鍵
  			//     "departmentId": "string",
  			//     "departmentName": "string"
  			//   },
  			//   "quarterPlanDId": "string",                    // 季工作規劃明細檔資料表的主鍵
  			//   "quarterPlanMId": "string"                     // 季工作規劃主檔資料表的主鍵
  			// }

  			//         {
  			//     "startMonth": "",
  			//     "endMonth": "",
  			//     "auditTime": [
  			//         "0110-12-31T15:54:00.000Z",
  			//         "0111-01-30T15:54:00.000Z"
  			//     ],
  			//     "inCharge": "VH002",
  			//     "auditMenber": [
  			//         "VH002"
  			//     ],
  			//     "checkedUnit": [
  			//         "VPN00"
  			//     ],
  			//     "coAucitorTeam": [
  			//         "E",
  			//         "D"
  			//     ]
  			// }
  			// this.$preparationApi.setQuarterPlanUsingPOST(this.form)
  			// 	.then((resp) => {
  			// 		const getData = resp.data.result;
  			// 		// this.selectorOption.auditType = getData;
  			// 		console.log(getData);
  			// 		// this.selectorOption.item.unshift(
  			// 		// 	{
  			// 		// 		label: '全選',
  			// 		// 		value: undefined,
  			// 		// 	},
  			// 		// );
  			// 	})
  			// 	.catch(console.error)
  			// 	.finally(() => {
  			// 		this.setLoading(false);
  			// 	});
  		}
  	});
  }

  closeModal() {
  	(this.$refs.formRef as any).clearValidate();
  	this.$emit('closeModal');
  }

  changeAuditMenber() {
  	if (!this.form.auditMenber.includes(this.form.inCharge)) {
  		this.form.inCharge = undefined;
  		(this.$refs.formRef as any).validateField('inCharge');
  	}
  }

  /**
	 * Hook
	 */

  /**
	 * 監聽
	 */
  @Watch('form', { deep: true })
  watchForm(nV) {
  	// console.log(nV);
  }

  @Watch('visible')
  watchVisible(nV) {
  	// console.log(nV);
  	if (nV) {
  		// console.log('initData =>', this.initData);
  		this.createData();
  	}
  }
}
</script>

<style lang="scss" scoped>
.form{
  background-color: $BG-LIGHT;
  padding: 18px 30px;
  padding-left: 20px;
  ::v-deep{
    .ant-form-item-label{
      span{
        font-size: 14px;
        font-weight: bold;
      }
    }
    .ant-input-group{
      display: flex;
    }
    .search__result__month--right .ant-select-selection{
      border-left: none;
    }
    .month-input__group .ant-select.search__result__month {
      width: 65px;
    }
  }
}

.search__result__range {
    padding-right: 0px;
    padding-left: 0px;
    width: 10px;
    border-left: 0;
    border-right: 0;
    pointer-events: none;
    background-color: #fff;
}

::v-deep .planClass__group.ant-radio-group{
    display: flex;
    flex-direction: column;
    .ant-radio-wrapper{
      margin-top: 4px;
      display: flex;
      align-items: center;
      span:nth-child(2) {
        display: flex;
        align-items: center;
        flex: 1;
      }
    }
    .planClass__group__item.ant-form-item{
      flex:1;
      margin-bottom: 0;
      margin-left: 6px;;
    }
}
</style>
