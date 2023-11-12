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
            <!-- 新增 -->
            <template v-if="!initData">
              <a-form-model-item
                v-if="initData? false:true"
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
                v-if="initData? false:true "
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
                v-if="initData? false:true"
                prop="auditType"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  查核性質
                </span>
                <a-select
                  v-model="form.auditType"
                  show-search
                  :filter-option="$global.filterOption"
                  class="w-100"
                >
                  <a-select-option value="jack">
                    Jack
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                v-if="initData? false:true"
                prop="auditItem"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  查核項目
                </span>
                <a-select
                  v-model="form.auditItem"
                  show-search
                  :filter-option="$global.filterOption"
                  :disabled="initData? true : false"
                  class="w-100"
                >
                  <a-select-option
                    v-for="(item,idx) in fakeItemOption"
                    :key="idx"
                    :value="item.item"
                  >
                    {{ item.item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>
            <!--編輯-->
            <template v-else>
              <a-form-model-item
                v-if="isMainAucitorTeam"
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
                  :disabled-date="disableDate"
                  :range="true"
                  type="date"
                  :allow-clear="true"
                  class="w-100"
                />
              </a-form-model-item>

              <a-form-model-item
                prop="checkMans"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  查核人員
                </span>
                <a-select
                  v-model="form.checkMans"
                  show-search
                  mode="multiple"
                  class="w-100"
                  :show-arrow="true"
                  :filter-option="$global.filterOption"
                  @change="changeAuditMenber"
                >
                  <a-select-option
                    v-for="item in auditOption"
                    :key="item.domainId"
                    :value="item.domainId"
                    :disabled="isDisabledGroup(item.group)"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                v-if="isMainAucitorTeam"
                prop="inChargeMan"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  領隊人員
                </span>
                <a-select
                  v-model="form.inChargeMan"
                  show-search
                  class="w-100"
                  :show-arrow="true"
                  :allow-clear="true"
                  :filter-option="$global.filterOption"
                  @dropdownVisibleChange="changeInChargeMan"
                >
                  <a-select-option
                    v-for="item in leaderOption"
                    :key="item.domainId"
                    :value="item.domainId"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                v-if="isMainAucitorTeam"
                prop="itemDescs"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  受查單位
                </span>
                <a-tree-select
                  v-model="form.itemDescs"
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

              <a-form-model-item
                v-if="isMainAucitorTeam"
                prop="groupTeams"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
              >
                <span slot="label">
                  協辦組
                </span>
                <a-select
                  v-model="form.groupTeams"
                  show-search
                  class="w-100"
                  mode="multiple"
                  :show-arrow="true"
                  :filter-option="$global.filterOption"
                  @change="changePlanGroupInPreparation"
                >
                  <a-select-option
                    v-for="item in selectOption.planGroupInPreparation"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </template>
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
import { Getter, Action, namespace } from 'vuex-class';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';

const modalModule = namespace('modalControl');

@Component({
	components: { InfoModal },
})
export default class AddInsidePlan extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

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
  	return `${typeStr}計畫（內）作業`;
  }

  // 主辦組 列表
  get mainAucitorTeam() {
  	if (this.initData.mainAucitorTeam) {
  	  return this.initData.mainAucitorTeam.auditorTeam;
  	}
  	return '';
  }

  // 角色是主辦組？
  get isMainAucitorTeam() {
  	return this.mainAucitorTeam === this.$global.getCurrentRoleTeamCode();
  }

  // 角色是協辦組？
  get iscoAucitorTeam() {
  	return this.form.groupTeams.includes(this.$global.getCurrentRoleTeamCode());
  }

  // 篩選主辦組與協辦組人員，產生 查核人員 下拉
  get auditOption() {
  	return this.originAuditArr.filter((i) => [this.mainAucitorTeam, ...this.form.groupTeams].includes(i.group));
  }

  // 篩選主辦組人員，且包含在已選查核人員內，產生 領隊人員 下拉
  get leaderOption() {
  	return this.originAuditArr.filter((i) => this.mainAucitorTeam.includes(i.group) && this.form.checkMans.includes(i.domainId));
  }

  // --------- 下拉選項 --------- //
  selectOption = {
  	auditType: [],		// 查核性質
  	auditItem: [],		// 查核項目

  	// checkMans: [], // 查核人員
  	checkedUnit: [], // 受查單位
  	planGroupInPreparation: [], // 協辦組
  }

  form = {
  	startMonth: '',
  	endMonth: '',
  	auditTime: [],
  	checkMans: [],
  	groupTeams: [],
  	inChargeMan: '',
  	itemDescs: [],
  	quarterPlanMId: '',
  };

  formRules: { [key: string]: ValidationRule[] } = {
  	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  	startMonth: [
  		{ required: true, message: '請選擇預計查核月份', trigger: 'change' },
  		{ trigger: 'change', validator: this.monthValidator },
  	],
  	auditType: [{ required: true, message: '請選擇查核性質', trigger: 'change' }],

  	auditTime: [
  		{ required: true, message: '請選擇查核時間', trigger: 'change' },
  		{ trigger: 'change', validator: this.rangeDateValidator },
  	],
  	auditItem: [{ required: true, message: '請選擇查核項目', trigger: 'change' }],
  	// groupTeams: [{ required: true, message: '請選擇協辦組', trigger: 'change' }],
  	checkMans: [{ required: true, message: '請選擇查核人員', trigger: 'change' }],
  	inChargeMan: [{ required: true, message: '請選擇領隊人員', trigger: 'change' }],
  	itemDescs: [{ required: true, message: '請選擇受查單位', trigger: 'change' }],
  };

  // TEST:
  fakeItemOption = [
  	{
  	  item: '項目1',
  	},
  	{
  	  item: '項目23',
  	},
  	{
  	  item: '項木3966',
  	},
  ]

  monthValidator(rule, value, callback) {
  	// console.log(rule, value, callback);
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
  		// 主辦組，可編輯 主辦與協辦組
  		return ![this.mainAucitorTeam, ...this.form.groupTeams].includes(groupId);
  	}
  	// 不是主辦，只可編輯 自己組別
  	return groupId !== currentRoleGroupId;
  }

  disableDate(current, dates) {
  	// 以資料 年度、起始/結束月份 取得查核期間卡控
  	const ckStartDate = new Date(moment({ year: this.initData.year, month: this.initData.startMoth - 1, date: 1 }).add(1911, 'year').format());
  	return current && (current <= moment(ckStartDate).subtract(1, 'day'));
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

  // API: 儲存
  getApi_submitQuarterPlanModify() {
  	// this.setLoading(true);
  	const submitData = {
  		checkMans: this.form.checkMans,
  		ckStartDate: moment(this.form.auditTime[0]).isValid() ? moment(this.form.auditTime[0]).format('YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]') : '1000-01-01T00:00:00.000Z',
  		ckEndDate: moment(this.form.auditTime[0]).isValid() ? moment(this.form.auditTime[1]).format('YYYY-MM-DD[T]HH:mm:ss[.]SSS[Z]') : '1000-01-01T00:00:00.000Z',
  		groupTeams: this.form.groupTeams,
  		inChargeMan: this.form.inChargeMan,
  		itemDescs: this.form.itemDescs,
  		quarterPlanMId: this.form.quarterPlanMId,
  	};
  	// TEST:
  	// console.log('儲存 =>', submitData);
  	this.$preparationApi.setQuarterPlanUsingPOST(submitData)
  		.then((resp) => {
  			this.closeModal();
  			this.$emit('reload');
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '儲存成功',
  					autoClose: 3,
  				},
  			});
  		})
  		.catch((err) => {
  			console.log(err);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '儲存失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 處理時間格式
  returnTwYearFormatter(date) {
  	if (DateTimeFormmat.isValidDate(date)) {
  		return new Date(moment(date).add(1911, 'year').format());
  	}
  	return undefined;
  }

  // 初始化資料
  createData() {
  	Promise.all([
  		this.getApi_searchAuditors(), // API: 查核人員 下拉
  		this.getApi_yapUnit(), // API: 受查單位 下拉
  		this.getApi_searchInsidePlanGroup(), // API: 協辦組 下拉
  	])
  		.then(() => {
  			this.form.auditTime = [
  				this.initData.ckStartDate ? this.returnTwYearFormatter(this.initData.ckStartDate) : new Date(moment({ year: this.initData.year, month: this.initData.startMoth - 1, date: 1 }).add(1911, 'year').format()),
  				this.initData.ckEndDate ? this.returnTwYearFormatter(this.initData.ckEndDate) : new Date(moment({ year: this.initData.year, month: this.initData.endMoth - 1, date: 1 }).add(1911, 'year').format()),
  			];
  			this.form.checkMans = this.initData.checkMan?.map((i) => i.domainId);
  			this.form.groupTeams = this.initData.coAucitorTeam?.map((i) => i.auditorTeam);
  			this.form.inChargeMan = this.initData.incharge[0]?.domainId;
  			this.form.itemDescs = this.initData.checkedUnit?.map((i) => i.departmentId);
  			this.form.quarterPlanMId = this.initData.quarterPlanMId;
  		});
  }

  /**
	 * Event
	 */
  submit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.getApi_submitQuarterPlanModify();
  		}
  	});
  }

  closeModal() {
  	(this.$refs.formRef as any).clearValidate();
  	this.$emit('closeModal');
  }

  // 查核人員變更
  changeAuditMenber() {
  	if (!this.form.checkMans.includes(this.form.inChargeMan)) {
  		this.form.inChargeMan = undefined;
  	}
  }

  // 領隊人員變更
  changeInChargeMan(isOpen) {
  	// 開啟領隊人員下拉時，檢核 查核人員 不得為空
  	if (isOpen && this.form.checkMans.length < 1) {
  		(this.$refs.formRef as any).validateField('checkMans');
  	}
  }

  // 協辦組變更
  changePlanGroupInPreparation(value) {
  	// 查核人員陣列 computed 已做過 篩選，此處只處理 轉 domainId 陣列
  	const domainIdArray = this.auditOption.map((i) => i.domainId);
  	// 連動 查核人員變更
  	this.form.checkMans = this.form.checkMans.filter((i) => domainIdArray.includes(i));
  	// 連動 領隊人員變更
  	this.form.inChargeMan = this.form.checkMans.includes(this.form.inChargeMan) ? this.form.inChargeMan : undefined;
  }

  /**
	 * 監聽
	 */
  @Watch('visible')
  watchVisible(nV) {
  	if (nV) {
  		this.createData();
  	} else {
  		// 關閉時，清除檢核
  		(this.$refs.formRef as any).clearValidate();
  	}
  }
}
</script>

<style lang="scss" scoped>
.form{
  background-color: $BG-LIGHT;
  padding: 18px 50px;
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

    .month-input__group  .ant-select.search__result__month {
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

</style>
