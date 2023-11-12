<template>
  <div class="workplanning-container container">
    <div class="dataType__form__card">
      <a-form-model
        ref="formRef"
        :rules="rules"
        :model="showData"
      >
        <div class="d-flex flex-wrap mainDataType__page">
          <!-- 受查單位 -->
          <a-form-model-item
            label="受查單位"
            prop="itemDescs"
          >
            <a-tree-select
              v-model="showData.itemDescs"
              mode="multiple"
              :tree-data="selectOption.units"
              tree-checkable
              :tree-default-expand-all="true"
              tree-node-filter-prop="title"
              dropdown-class-name="treeselect"
              :dropdown-style="{'maxHeight': '300px'}"
              :show-arrow="true"
              :dropdown-match-select-width="false"
              :disabled="!isLeader"
              placeholder="請選擇受查單位"
            />
          </a-form-model-item>
          <!-- 查核基準日 -->
          <a-form-model-item
            label="查核基準日"
          >
            <date-picker
              v-model="showData.baseDate"
              :formatter="formatter"
              type="date"
              :allow-clear="true"
              :disabled="!isLeader"
              placeholder="請選擇查核基準日"
            />
          </a-form-model-item>
          <!-- 查核期間 -->
          <a-form-model-item
            label="查核期間"
          >
            <date-picker
              v-model="showData.ckDateArr"
              :formatter="formatter"
              :disabled-date="disableDate"
              :range="true"
              type="date"
              :allow-clear="true"
              :disabled="!isLeader"
              placeholder="請選擇查核期間"
            />
          </a-form-model-item>
          <!-- 受查範圍期間 -->
          <a-form-model-item
            label="受查範圍期間"
          >
            <date-picker
              v-model="showData.ckRangeDateArr"
              :formatter="formatter"
              :range="true"
              type="date"
              :allow-clear="true"
              :disabled="!isLeader"
            />
          </a-form-model-item>
          <!-- 領隊人員 -->
          <a-form-model-item
            label="領隊人員"
          >
            <a-select
              v-model="showData.inChargeMan"
              show-search
              :show-arrow="true"
              :allow-clear="true"
              :filter-option="$global.filterOption"
              :dropdown-match-select-width="false"
              :disabled="!isLeader"
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
          <!-- 查核人員 -->
          <a-form-model-item
            label="查核人員"
            prop="checkMansArr"
          >
            <a-select
              v-model="showData.checkMansArr"
              show-search
              mode="multiple"
              :show-arrow="true"
              :dropdown-match-select-width="false"
              :filter-option="$global.filterOption"
              :disabled="!isLeader"
              @change="changeAuditMenber"
            >
              <a-select-option
                v-for="item in selectOption.member"
                :key="item.domainId"
                :value="item.domainId"
                :disabled="isDisabledGroup(item.group)"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </a-form-model>
    </div>
    <div class="d-flex flex-wrap-reverse mt-3">
      <div class="tabGroup d-flex">
        <button
          v-for="(item, index) in tabsArr"
          :key="index"
          class="tabGroup__item"
          :class="{'tabGroup__item--active': activeTab == item.id}"
          @click="()=> activeTab = item.id"
        >
          {{ item.title }}
        </button>
      </div>
      <div class="ms-auto align-self-center">
        <ActionBar
          :role="currentRole.id"
          :is-leader="isLeader"
          :work-m-status="originData.workMStatus"
          @click="emitClick"
        />
      </div>
    </div>
    <div class="controlMain__container">
      <KeepAlive>
        <component
          :is="`Comp_${activeTab}`"
          :role="currentRole.id"
          :is-leader="isLeader"
          :tabs-data.sync="tabsData[activeTab]"
          :select-option="selectOption"
          :show-data="showData"
          @click="emitClick"
        />
      </KeepAlive>
    </div>
    <!-- 審核通過/退回 彈窗 -->
    <ReviewCommitModal
      :visible.sync="reviewCommitModal.visible"
      :type="reviewCommitModal.type"
      :quarter-work-m-id="originData.quarterWorkMId"
      :status="originData.workMStatus"
    />
    <!-- 人力統計查詢 彈窗 -->
    <!-- <HumanStatisticsModal
      :visible.sync="humanStatisticsModal.visible"
    /> -->

    <!-- 比對資料 彈窗 -->
    <CompareDataModal
      :visible="compareModal.visible"
      :now-data="compareModal.nowData"
      :old-data="compareModal.oldData"
      @closeModal="compareModal.visible = false"
    />

    <!-- 連結資料 彈窗 -->
    <ConnectDataModal
      :visible="connectDataModal.visible"
      :content-data="connectDataModal.data"
      @closeModal="connectDataModal.visible = false"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import AccordionArea from '@shared/AccordionArea.vue';
import ActionBar from '@/components/preparation/workPlanning/ActionBar.vue';
import { Action, namespace } from 'vuex-class';
import {
	RoleDto,
	SelectOptionDto,
	GetAuditorTeamRequest,
	Member,
	SearchWorkPlanResponseDto,
	DataCollectDetailDto,
} from '@fubonlife/iams-api-axios-sdk';
import Comp_reference from '@/components/preparation/workPlanning/Comp_reference.vue';
import Comp_riskAnalysis from '@/components/preparation/workPlanning/Comp_riskAnalysis.vue';
import Comp_assignment from '@/components/preparation/workPlanning/Comp_assignment.vue';
import Comp_contact from '@/components/preparation/workPlanning/Comp_contact.vue';
import Comp_notice from '@/components/preparation/workPlanning/Comp_notice.vue';
import ReviewCommitModal from '@/components/preparation/workPlanning/ReviewCommitModal.vue';
// import HumanStatisticsModal from '@/components/preparation/workPlanning/_HumanStatisticsModal.vue';
import CompareDataModal from '@components/preparation/workPlanning/CompareDataModal.vue';
import ConnectDataModal from '@components/preparation/workPlanning/ConnectDataModal.vue';
import { uuid } from 'vue-uuid';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';

const modalModule = namespace('modalControl');

@Component({
	components: {
		AccordionArea,
		ActionBar,
		Comp_reference,
		Comp_riskAnalysis,
		Comp_assignment,
		Comp_contact,
		Comp_notice,
		ReviewCommitModal,
		// HumanStatisticsModal,
		CompareDataModal,
		ConnectDataModal,
	},
})
export default class WorkPlanning extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

	queryData = {
		year: '',
		startMoth: '',
		endMoth: '',
		quarterPlanMId: '',
		mainAucitorTeam: '',
		coAucitorTeam: [],
	}

	// 此份工作規劃表 領隊人員資料
	inChargeMan: Member = {
		domainId: '',
		group: '',
		groupName: '',
		name: '',
	}

	// ---------------------------------- 彈窗控制 ----------------------------------//
	// 審核 通過/退回 彈窗
  reviewCommitModal = {
  	visible: false, // -> syncedVisible
  	type: 'reject',
  	quarterWorkMId: '',
  	status: '',
  };

  // 連結資料 彈窗
  connectDataModal: {visible: boolean; data: DataCollectDetailDto[]} = {
  	visible: false,
  	data: [],
  };

  // 人力統計表 彈窗
  // humanStatisticsModal = {
  // 	visible: false,
  // }

  // 比對資料 彈窗
  compareModal = {
  	visible: false,
  	nowData: {},
  	oldData: [],
  };

  // 時間format格式
  formatter = this.$twDateFormatter;

  // 當前角色
	currentRole: RoleDto = null;

  tabsArr = [
  	{
  		id: 'reference',
  		title: '查核依據',
  	},
  	{
  		id: 'riskAnalysis',
  		title: '風險分析',
  	},
  	{
  		id: 'notice',
  		title: '應注意事項',
  	},
  	{
  		id: 'assignment',
  		title: '查核範圍與工作分配',
  	},
  	{
  		id: 'contact',
  		title: '查核窗口',
  	},
  ]

  // tab active
  activeTab = 'reference';

	// 工作規劃表內容 初始資料
	originData: SearchWorkPlanResponseDto = {}

  // 工作規劃表內容
  showData = {
  	itemDescs: [],
  	baseDate: undefined,
  	ckDateArr: [],
  	ckRangeDateArr: [],
  	inChargeMan: undefined,
  	checkMansArr: [],
  }

	// 查核欄位檢核
	rules = {
  	itemDescs: [{ required: true, message: '請選擇受查單位', trigger: 'change' }],
		checkMansArr: [{ required: true, message: '請選擇查核人員', trigger: 'change' }],
	}

  // 分頁資料匯集
  tabsData = {
  	reference: {
  		textarea: '',
  	},
  	riskAnalysis: {
  		textarea: '',
  	},
  	notice: [],
  	assignment: [],
  	contact: [],
  }

  // tab 應注意事項，比對用
  // noticeOld = [];

  // 下拉選項
  selectOption = {
  	units: [],
  	member: [],
  }

	asccountAgentList = [];

	// 編輯權限 (查核人員領隊 == 登入者)
	get isLeader() {
  	// 角色 查核人員 && 領隊
  	const domainId = this.$user.getMe().employee.domainId;
		const isIncharge = [...this.asccountAgentList, domainId].includes(this.inChargeMan.domainId);
  	if (this.currentRole.id === 'ROLE_Auditor' && isIncharge && ['01', '04', '05'].includes(this.originData.workMStatus)) {
  		return true;
  	}
  	return false;
	}

	// 角色是主辦組？
	get isMainAucitorTeam() {
  	return this.queryData.mainAucitorTeam === this.$global.getCurrentRoleTeamCode();
	}

	// 角色是協辦組？
	get iscoAucitorTeam() {
  	return this.queryData.coAucitorTeam.includes(this.$global.getCurrentRoleTeamCode());
	}

	get leaderOption() {
  	return this.selectOption.member.filter((i) => this.queryData.mainAucitorTeam.includes(i.group) && this.showData.checkMansArr.includes(i.domainId));
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

	// 查核人員變更
	changeAuditMenber() {
  	if (!this.showData.checkMansArr.includes(this.showData.inChargeMan)) {
  		this.showData.inChargeMan = undefined;
  		// (this.$refs.formRef as any).validateField('incharge');
  	}
	}

	// 領隊人員變更
	changeInChargeMan(isOpen) {
  	// 開啟領隊人員下拉時，檢核 查核人員 不得為空
  	if (isOpen && this.showData.checkMansArr.length < 1) {
  		(this.$refs.formRef as any).validateField('checkMansArr');
  	}
	}

	disableDate(current, dates) {
  	const setYear: number = Number(this.queryData.year) + 1911;
  	const setMonth: number = Number(this.queryData.startMoth) - 1;
  	// 以資料 年度、起始/結束月份 取得查核期間卡控
  	const ckStartDate = new Date(moment({ year: setYear, month: setMonth, date: 1 }).format());
  	return current && (current <= moment(ckStartDate).subtract(1, 'day'));
	}

	// 篩選 不在下拉選項內的 查核人員 及 領隊人員
	filterAuditMenber() {
  	const allMemberDomainId = this.selectOption.member.map((i) => i.domainId);
  	this.showData.checkMansArr = this.showData.checkMansArr.filter((i) => allMemberDomainId.includes(i));
  	this.showData.inChargeMan = allMemberDomainId.includes(this.showData.inChargeMan) ? this.showData.inChargeMan : undefined;
	}

	// API: 受查單位 下拉選項
	getApi_yapUnit() {
  	this.setLoading(true);
  	const requestYear = this.queryData.year.toString();
  	this.$preparationApi.searchUnitNameInPreparationUsingGET(requestYear)
  		.then((resp) => {
  			const getData = resp.data.result;
  			// 整理資料
  			this.selectOption.units = [
  				{
  					title: '全部',
  					value: 'all',
  					key: 'all',
  					children: getData.validYapUnits?.map((e) => ({
  						title: e.value + e.label,
  						value: e.value,
  						label: e.label,
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
  						label: e.label,
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

	// API: 取得所有查核人員
	getApi_Auditors() {
  	this.setLoading(true);
  	this.$preparationApi.searchAuditorsUsingPOST()
  		.then((resp) => {
  			const getData = resp.data.result;
  			// 只列出主辦 跟 協辦 並排序
  			this.selectOption.member = getData.filter((i) => [this.queryData.mainAucitorTeam, ...this.queryData.coAucitorTeam].includes(i.group));
  			this.selectOption.member.sort((a, b) => a.group.charCodeAt() - b.group.charCodeAt());
  			this.filterAuditMenber();
  		})
  		.catch(console.error)
  		.finally(() => {
  	    this.setLoading(false);
  		});
	}

	// API: 工作規劃表API(初始Load)
	getApi_searchWorkPlan({ quarterPlanMId, updateScope = 'all' }) {
  	this.setLoading(true);
  	this.$preparationApi.searchWorkPlanUsingGET(quarterPlanMId)
  		.then((resp) => {
  			const getData = this.$global.deepCopyData(resp.data.result);
  			this.originData = getData;
  			// 使用部分更新方式
  			// ---------- 頁面資料 ---------- //
  			if (['all'].includes(updateScope)) {
  				// 受查單位
  				this.showData.itemDescs = (getData.itemDescs) ? getData.itemDescs?.map((i) => i.departmentId.toUpperCase()) : getData.itemDescs;
  				// 查核基準日
  				this.showData.baseDate = DateTimeFormmat.isValidDate(getData.ckBaseDate);
  				// 查核期間
  				this.showData.ckDateArr = [DateTimeFormmat.isValidDate(getData.ckStartDate), DateTimeFormmat.isValidDate(getData.ckEndDate)];
  				// 受查範圍期間
  				this.showData.ckRangeDateArr = [DateTimeFormmat.isValidDate(getData.ckRangeStrDate), DateTimeFormmat.isValidDate(getData.ckRangeEndDate)];
  				// 領隊人員
  				this.showData.inChargeMan = getData.inChargeMan.domainId;
  				this.inChargeMan = getData.inChargeMan;
  				// 查核人員
  				this.showData.checkMansArr = getData.auditors?.length > 0 ? getData.auditors?.map((i) => i.domainId) : [];
  			}

  			// ---------- Tabs資料 ---------- //
  			// 查核依據
  			if (['all', 'reference'].includes(updateScope)) {
  				this.tabsData.reference.textarea = getData.checkBase;
  			}
  			// 風險分析
  			if (['all', 'riskAnalysis'].includes(updateScope)) {
  				this.tabsData.riskAnalysis.textarea = getData.riskAnaly;
  			}
  			// 應注意事項
  			if (['all', 'notice'].includes(updateScope)) {
  				const $noticeDescs = this.$global.deepCopyData(getData.noticeDescs);
  				$noticeDescs.map((i) => {
  					if (!i.noticeChildrenDescs) {
  						i.noticeChildrenDescs = [];
  					}
  				});
  				this.tabsData.notice = $noticeDescs;
  			}
  			// 查核範圍與工作分配
  			if (['all', 'assignment'].includes(updateScope)) {
  				this.tabsData.assignment = getData.checkDescs;
  			}
  			// 查核窗口
  			if (['all', 'contact'].includes(updateScope)) {
  				// 查核窗口 歸零
  				this.tabsData.contact = [];
  				getData.auditContact?.map((i) => {
  					if (i.auditees.length <= 0) {
  						this.tabsData.contact.push({
  							unit: `${i.itemDesc.departmentId.toUpperCase()} ${i.itemDesc.departmentName}`,
  							name: '',
  						});
  					} else {
  						i.auditees?.map((j) => {
  							this.tabsData.contact.push({
  								unit: `${i.itemDesc.departmentId.toUpperCase()} ${i.itemDesc.departmentName}`,
  								name: j,
  							});
  						});
  					}
  				});
  			}
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 應注意事項 刪除API
	getApi_removeNotice(quarterWorkDId) {
  	// console.log(quarterWorkDId);
  	this.setLoading(true);
  	this.$preparationApi.removeNoticeUsingPOST(quarterWorkDId)
  		.then((resp) => {
  			if (resp.data.success) {
  				for (const i of this.tabsData.notice) {
  					const thatItem = i.noticeChildrenDescs.find((i) => i.quarterWorkDId === quarterWorkDId);
  					if (thatItem) {
  						i.noticeChildrenDescs.splice(i.noticeChildrenDescs.indexOf(thatItem), 1);
  					}
  				}
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '刪除成功',
  						autoClose: 3,
  					},
  				});
  			}
  		})
  		.catch((err) => {
  			console.log(err);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 查核範圍 刪除API
	getApi_assignmentRemove(quarterWorkDId) {
  	this.setLoading(true);
  	this.$preparationApi.removeAssignmentOfWorkPlanInPreparationUsingGET(quarterWorkDId)
  		.then((resp) => {
  			if (resp.data.success) {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '刪除成功',
  						autoClose: 3,
  					},
  				});
  				const thatData = this.tabsData.assignment.find((i) => i.quarterWorkDId === quarterWorkDId);
  				this.tabsData.assignment.splice(this.tabsData.assignment.indexOf(thatData), 1);
  			}
  		})
  		.catch((err) => {
  			console.log(err);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 取得 Query 並帶入資料
	async setParam() {
  	if (this.queryData) {
  		this.queryData = await this.$global.getQuery();
  	}
	}

	// API: 下載檔案
	getApi_download() {
  	this.setLoading(true);
  	this.$preparationApi.downloadWorkPlanUsingPOST(this.createFormData(), { responseType: 'blob' })
  		.then((resp) => {
  			// console.log(resp.headers);
  			const downloadlink: HTMLAnchorElement = document.createElement('a');
  			const URL = window.URL || window.webkitURL;
  			const url = URL.createObjectURL(resp.data as unknown as Blob);
  			const fileName = 'workPlan';
  			downloadlink.setAttribute('href', url);
  			downloadlink.setAttribute('download', `${fileName}_${this.originData.quarterPlanMId}.docx`);
  			downloadlink.click();
  			downloadlink.remove();
  		})
  		.catch((err) => {
  			console.log(err.reaponse);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '下載檔案失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 暫存
	getApi_saveTemp() {
  	this.setLoading(true);
  	this.$preparationApi.modifyWorkPlanUsingPOST(this.createFormData())
  		.then((resp) => {
  			if (resp.data.success) {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'success',
  						title: '暫存成功',
  						autoClose: 3,
  					},
  				});
  				this.getApi_searchWorkPlan({ quarterPlanMId: this.queryData.quarterPlanMId });
					this.getApi_accountAgent();
  			}
  		})
  		.catch((err) => {
  			console.log(err);
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '暫存失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 送出覆核
	getApi_dataSubmitInData() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.setLoading(true);
  			this.$preparationApi.reviewWorkPlanInPreparationUsingPOST(this.createFormData())
  				.then((resp) => {
  					if (resp.data.success) {
  						this.setModalState({
  							resultModal: {
  								visible: true,
  								type: 'success',
  								title: '送出覆核成功',
  								autoClose: 3,
  							},
  						});
  						this.$router.go(-1);
  					}
  				})
  				.catch((err) => {
  					console.log(err);
  					this.setModalState({
  						resultModal: {
  							visible: true,
  							type: 'error',
  							title: '送出覆核失敗',
  						},
  					});
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  	});
	}

	// API: 應注意事項 資料關聯
	getApi_dataCollectDetail({ quarterWorkDId }) {
  	this.setLoading(true);
  	// 初始化
  	this.connectDataModal.data = [];
  	this.$preparationApi.searchNoticeUsingPOST(quarterWorkDId)
  		.then((resp) => {
  			const getData = resp.data.result;
  			this.connectDataModal.data = getData;
  			this.connectDataModal.visible = true;
  		})
  		.catch((error) => {
  			if (error?.response?.data?.total === 0) {
  				this.connectDataModal.visible = true;
  			} else {
  				this.setModalState({
  					resultModal: {
  						visible: true,
  						type: 'error',
  						title: error?.response?.data?.message,
  					},
  				});
  			}
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 取得代理人資料
	getApi_accountAgent() {
		this.setLoading(true);
		this.$accountAgentApi.searchPrincipalUsingPOST()
  		.then((resp) => {
  			this.asccountAgentList = resp.data.result;
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	createFormData() {
  	return {
  		checkBase: this.tabsData.reference.textarea, 				// 查核依據
  		checkDescs: this.tabsData.assignment,								// 查核範圍與工作分配
  		checkMans: this.showData.checkMansArr,							// 查核人員
  		ckBaseDate: (this.showData.baseDate) ? moment(this.showData.baseDate).format('YYYY-MM-DD[T]HH:mm:ss') : this.showData.baseDate,									// 查核基準日
  		ckRangeStrDate: (this.showData.ckRangeDateArr[0]) ? moment(this.showData.ckRangeDateArr[0]).format('YYYY-MM-DD[T]HH:mm:ss') : this.showData.ckRangeDateArr[0],		// 受查範圍期間-起
  		ckRangeEndDate: (this.showData.ckRangeDateArr[1]) ? moment(this.showData.ckRangeDateArr[1]).format('YYYY-MM-DD[T]HH:mm:ss') : this.showData.ckRangeDateArr[1],		// 受查範圍期間-迄
  		ckStartDate: (this.showData.ckDateArr[0]) ? moment(this.showData.ckDateArr[0]).format('YYYY-MM-DD[T]HH:mm:ss') : this.showData.ckDateArr[0],						// 查核期間-起
  		ckEndDate: (this.showData.ckDateArr[1]) ? moment(this.showData.ckDateArr[1]).format('YYYY-MM-DD[T]HH:mm:ss') : this.showData.ckDateArr[1],							// 查核期間-迄
  		inChargeMan: this.showData.inChargeMan,							// 領隊人員
  		itemDescs: (this.showData.itemDescs) ? this.showData.itemDescs.map((i) => {
  			const thatUnit = [...this.selectOption.units[0].children, ...this.selectOption.units[1].children].find((j) => j.key === i);
  			return {
  				departmentId: (thatUnit) ? thatUnit.key : i,
  				departmentName: (thatUnit) ? thatUnit.label : '',
  			};
  		}) : this.showData.itemDescs,																									// 受查單位代碼代碼和名稱
  		noticeDescs: this.tabsData.notice,									// 應注意事項
  		quarterPlanMId: this.originData.quarterPlanMId, 		// 季工作規劃主檔資料表的主鍵
  		quarterWorkMId: this.originData.quarterWorkMId,			// 工作規劃表主檔資料表的主鍵
  		riskAnaly: this.tabsData.riskAnalysis.textarea, 		// 風險分析
  		workMStatus: this.originData.workMStatus,						// 工作規劃表狀態
  	};
	}

	/**
   * Event
   */
	emitBack() {
  	this.$router.go(-1);
	}

	emitClick({ type, params }) {
  	switch (type) {
  	// case 'change':
  	// 	console.log('異動');
  	// 	// 異動
  	// 	// this.setDetailModalState({
  	// 	// 	reviewCommitModal: {
  	// 	// 		visible: true,
  	// 	// 		type: 'reject',
  	// 	// 	},
  	// 	// });
  	// 	break;
  	case 'submitReview':	// 送出覆核
  		this.getApi_dataSubmitInData();
  		break;
  	case 'save':	// 暫存
  		this.getApi_saveTemp();
  		break;
  	case 'meeting':		// 行前會議
  		console.log('行前會議通知');
  		break;
  	case 'sussess':			// 通過
  		this.reviewCommitModal.type = 'pass';
  		this.reviewCommitModal.visible = true;
  		break;
  	case 'reject':			// 退回
  		this.reviewCommitModal.type = 'reject';
  		this.reviewCommitModal.visible = true;
  		break;
  	case 'search':			// 查詢
  		console.log('查詢');
  		break;
  	case 'download':		// 下載檔案
  		this.getApi_download();
  		break;
  	case 'back':		// 上一頁
  		this.emitBack();
  		break;

  		// -------- 應注意事項 -------- //
  	case 'comparisonAll':		// 比對 應注意事項 (全部)  7/14 現階段先不做
  		this.compareModal.visible = true;
  		this.compareModal.oldData = [
  			{
  				dateTime: '當前編輯項目',
  				title: 'test old1',
  				staffname: this.$user.getMe().employee.name,
  				text: 'test old1',
  			},
  			{
  				dateTime: '當前編輯項目',
  				title: 'test old2',
  				staffname: this.$user.getMe().employee.name,
  				text: 'test old2',
  			},
  		];
  		this.compareModal.nowData = {
  				dateTime: '當前編輯項目',
  				title: 'test now',
  				staffname: this.$user.getMe().employee.name,
  				text: 'test now',
  			};
  	// nowData: {},
  	// oldData: [],
  		break;
  	case 'deleteNoticeItem':		// 刪除 應注意事項 子項目
  		this.getApi_removeNotice(params.quarterWorkDId);
  		break;
  	case 'linkItem':
  		this.getApi_dataCollectDetail(params);
  		break;

  		// -------- 查核範圍與工作分配 -------- //
  	case 'deleteAssignment':		// 刪除 查核範圍
  		this.getApi_assignmentRemove(params.quarterWorkDId);
  		break;
  	}
	}

	/**
   * Hook
   */
	async created() {
  	// 領隊才可以編輯
  	this.currentRole = this.$global.getCurrentRole();
  	// 取得 param
  	await this.setParam()
  		.then(() => {
  			// 取得下拉選項
  			Promise.all([
  				this.getApi_yapUnit(),		// 受查單位 下拉選項
  				this.getApi_Auditors(),		// 取得查核人員清單 下拉選項
  			]);
  			this.getApi_searchWorkPlan({ quarterPlanMId: this.queryData.quarterPlanMId });
				this.getApi_accountAgent();
  		});
	}

	/**
	 * 監聽
	 */
	// @Watch('showData', { deep: true })
	// watchShowData(nV) {
	// 	// console.log('基本資料變更 =>', nV);
	// }
}
</script>

<style lang="scss" scoped>
  .crawlerDetail-container {
    padding-bottom: 20px;
  }

	.dataType__form__card {
		background: $BG-YELLOW;
	}
	::v-deep {
		.mainDataType__page{
				padding: 16px 55px 16px 24px;
		}
		.ant-form-item {
			display: flex;
			align-items: flex-start;
			margin-top: 4px;
			margin-bottom: 4px;
			.ant-form-item-label {
				line-height: 2;
				width: 7em;
				font-weight: 600;
			}
			.ant-form-item-control-wrapper {
				flex: 1 0 5em;
			}
			.ant-form-item-control {
				line-height: initial;
			}
		}
		.ant-input {
			height: auto;
			&[disabled] {
				border: 0;
				border-radius: 0;
				color: $COLOR-DARK;
				background: $COLOR-MAIN7;
			}
		}
		.mainDataType__page {
			> .ant-form-item {
				&:nth-child(1),
				&:nth-child(2),
				&:nth-child(3),
				&:nth-child(4),
				&:nth-child(5)  {
					width: 33.33%;
				}
				&:nth-child(6) {
					width: 100%;
				}
			}
		}
	}

.controlBar {
  margin-top: 22px;
}

.tabGroup {
  width: 975px;
  max-width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 16px;
}
.tabGroup__item {
  flex: 1;
  border-radius: 0;
  background: $COLOR-LIGHT;
  border: 1px solid #DEDFDF;
  color: $COLOR-DARK;
  padding: 10px;
  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  &.tabGroup__item--active {
    border-color: $COLOR-MAIN1;
    color: $COLOR-MAIN1;
  }
  &:not(.tabGroup__item--active) {
    cursor: pointer;
    &:hover {
      background: darken($COLOR-LIGHT, 2%)
    }
  }
}
</style>
