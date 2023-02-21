<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="visibleSync"
      class="common__modal fubon-backStage_modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <a-form-model
        ref="formRef"
        :model="form"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            歷史異動紀錄
          </div>
          <div class="modal-container__event__block">
            <div class="row option__block">
              <div class="col-xl-6 col-12 option__block__item ">
                <div class="input__title">
                  申請日期
                </div>
                <a-form-model-item
                  prop="applyRange"
                >
                  <date-picker
                    v-model="form.applyRange"
                    placeholder="e.g. 2022/01/01～2022/02/01"
                    type="date"
                    :range="true"
                    :format="'YYYY/MM/DD'"
                    class="input__block"
                  />
                </a-form-model-item>
              </div>
              <div class="col-xl-6 col-12">
                <div class="input__title">
                  覆核狀態
                </div>
                <a-form-model-item
                  prop="reviewStatus"
                >
                  <a-radio-group
                    v-model="form.reviewStatus"
                    :default-value="form.reviewStatus"
                    class="row"
                  >
                    <div class="col-4">
                      <a-radio
                        :value="3"
                        class="radio__block"
                      >
                        全部(預)
                      </a-radio>
                    </div>
                    <div class="col-4">
                      <a-radio
                        :value="1"
                        class="radio__block"
                      >
                        同意
                      </a-radio>
                    </div>
                    <div class="col-4">
                      <a-radio
                        :value="2"
                        class="radio__block"
                      >
                        退回
                      </a-radio>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="input__title">
                  角色名稱
                </div>
                <a-form-model-item
                  prop="roleIdList"
                >
                  <a-select
                    v-model="form.roleIdList"
                    mode="tags"
                    :show-arrow="true"
                    :allow-clear="true"
                    :options="rolesOpts"
                    :placeholder="' e.g. 系統管理員/主管/護理人員'"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary--outline mb-2"
                @click="onClose"
              >
                取消
              </button>
              <button
                class="btn__radius--primary mb-2"
                @click="onSubmit"
              >
                查詢
              </button>
            </div>
          </div>
          <div
            v-if="gridData.data.length > 0"
            class="searchResult__block"
          >
            <div
              class="searchResult__block"
            >
              <div class=" searchResult__block__header d-flex justify-content-between align-items-center">
                <div class="searchResult__block__title">
                  查詢結果
                </div>
                <button
                  class="btn__radius--primary--outline--small"
                  @click="download"
                >
                  下載
                </button>
              </div>
              <div class="table--scroll">
                <div class="table">
                  <a-table
                    :row-key="gridData.rowKey"
                    :columns="gridData.columns"
                    :data-source="gridData.data"
                    :pagination="false"
                    :empty-data="gridData.data.length <= 0"
                    class="components-table-demo-nested"
                  >
                    <a-table
                      slot="expandedRowRender"
                      slot-scope="slotProps"
                      :row-key="innerGridData.rowKey"
                      :columns="innerGridData.columns"
                      :data-source="innerGridData.data[`roleId_${slotProps.uuid}`]"
                      :pagination="false"
                    >
                      <template
                        slot="menuName"
                        slot-scope="slotPropsChild"
                      >
                        <div>{{ slotPropsChild.menuName }} ({{ slotPropsChild.parentId }}/{{ slotPropsChild.menuId }})</div>
                      </template>
                    </a-table>
                  </a-table>
                </div>
              </div>
              <div class="btn__wrap text-center">
                <button
                  class="btn__radius--primary mb-2"
                  @click="onClose"
                >
                  返回
                </button>
              </div>
            </div>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop, PropSync,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import DataTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';
import moment from 'moment';

@Component({
	components: {
		// FblDataGrid,
	},
})
export default class ViewNurseRecordModal extends Vue {
	// @Action('setLoading') setLoading;

	h = this.$createElement;

	@PropSync('visible')
	visibleSync: boolean;

	rolesOpts = [];

	// 表單欄位資料
	form = {
		applyRange: null,
		reviewStatus: 3,
		roleIdList: undefined,
	}

	onClose() {
	// 	this.$emit('closeHistoryChangeModal');
	// 	this.form = {
	// 		applyRange: null,
	// 	  reviewStatus: 3,
	// 	  roleIdList: undefined,
	// 	};
		this.gridData.data = [];
		this.visibleSync = false;
	}

	onSubmit() {
		this.fetchQueryHistory();
	}

	download() {
		this.fetchDownload();
	}

	// 父層 欄位資料
	gridData = {
		rowKey: 'rowkey',
		data: [],
		columns: [
			{
				title: '角色名稱',
				dataIndex: 'roleName',
				key: 'roleName',
				width: 120,
			},
			{
				title: '申請人員',
				dataIndex: 'crtName',
				key: 'crtName',
				width: 100,
			},
			{
				title: '申請日期',
				dataIndex: 'crtDt',
				key: 'crtDt',
				width: 130,
				customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
			},
			{
				title: '覆核人員',
				dataIndex: 'updName',
				key: 'updName',
				width: 100,
			},
			{
				title: '覆核日期',
				dataIndex: 'updDt',
				key: 'updDt',
				width: 130,
				customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
			},
			{
				title: '覆核狀態',
				dataIndex: 'proved',
				key: 'proved',
				width: 100,
				// customRender: (data) => ((data) ? this.$enum.getVal('reviewStatusEnum', data) : ''),
			},
			{
				title: '退回原因',
				dataIndex: 'reason',
				key: 'reason',
				width: 130,
				customRender: (data) => ((data) || this.h('div', '--')),
			},
			{
				title: '執行功能',
				dataIndex: 'execAction',
				key: 'execAction',
				width: 100,
				// customRender: (data) => ((this.$enum.getVal('execActionEnum', data)) || this.h('div', '--')),
			},
		],
	}

	// 子層 欄位資料
	innerGridData = {
		rowKey: 'rowkey',
		data: {},
		pagination: false,
		columns: [
			{
				title: '模組名稱',
				dataIndex: 'parentName',
				key: 'parentName',
				width: 200,
			},
			{
				title: '功能名稱',
				key: 'menuName',
				scopedSlots: { customRender: 'menuName' },
			},
		],
	}

	getQueryForm() {
		const { applyRange, reviewStatus, roleIdList } = this.form;
		const [startDt = null, endDt = null] = applyRange ? DataTimeFormmat.filterRangeDate(applyRange) : [];
		return {
			pageNo: 0,
			pageSize: 100,
			startDt,
			endDt,
			reviewStatus,
			roleIdList: roleIdList && roleIdList.length === 0 ? null : roleIdList,
		};
	}

	// // API:1.2.31.	查詢角色選項
	// fetchRolesOpts() {
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.queryRoleOptionsUsingPOST()
	// 		.then((resp) => {
	// 			// TEST:
	// 			// console.log(resp);
	// 			if (resp.data.status === 200) {
	// 				this.rolesOpts = JSON.parse(JSON.stringify(resp.data.data)).map((i) => ({ value: i.roleId, label: i.roleName }));
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	// }

	// API: 1.2.27.	查詢角色歷史異動紀錄
	fetchQueryHistory() {
		const $form = this.getQueryForm();
		// TEST:
		const TESTDATA = {
			content: [
				{
					uuid: '0129ec5a-ecb7-4647-bf94-73d3b600465e',
					roleName: '測試人員',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T18:31:42.550+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:26.580+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					uuid: '16822556-ad11-41e2-bf44-17291f83f2c4',
					roleName: '1',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T17:01:36.367+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-12T17:02:44.190+0800',
					proved: '2',
					reason: 'test',
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: '223fc6ba-879d-4858-aa59-e3654f534253',
					roleName: '主管',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T16:01:40.923+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.347+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: '29a0af5f-e2c6-49f5-b2a5-22a76daa54ee',
					roleName: '2',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T15:14:15.827+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.393+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: '3751f1f8-4322-400a-ab3b-184f11484b14',
					roleName: '系統管理員助理',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-28T10:01:01.277+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-28T10:07:42.187+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: '4066735d-6b15-4686-a1b6-ba63d04969ba',
					roleName: '防護員',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-26T11:47:31.273+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-26T11:52:52.490+0800',
					proved: '2',
					reason: '角色對應選單不完整',
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: '419312c2-9b24-4c95-a1c4-370c2bafaef3',
					roleName: '員工',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-25T16:06:09.533+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:28.120+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'CaseMaintainIndex',
							menuName: '個案維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					uuid: '515ad54c-d960-416c-8f22-66b8ed099578',
					roleName: '1',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-02T15:16:30.347+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:28.107+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: '52f1ddf1-2410-48a5-967c-ad5f0053ec75',
					roleName: '56',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-28T13:42:33.510+0800',
					updName: '張Ｘ茹',
					updDt: '2022-08-23T08:49:34.873+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: '8e93e9c7-0a5f-40df-a259-cc392ce7186b',
					roleName: '系統管理員',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T09:57:20.847+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:28.063+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: '93b5bb6f-c0fa-48a2-aadc-3fc29f4a3906',
					roleName: '1',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T15:11:28.130+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.417+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: 'a60aa5d0-40bb-4625-a0dc-5b2aa27aa10a',
					roleName: '護理師',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-22T20:22:15.587+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-07-27T15:43:42.693+0800',
					proved: '2',
					reason: '"123"',
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: 'a70c4538-09dd-4e46-aac6-9026fae01cc8',
					roleName: '行政助理',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-09T17:17:07.730+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:28.053+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: 'a9222ece-7673-44db-b8b1-6bc1bf6b08b0',
					roleName: '助產士',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T18:19:12.193+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:28.007+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					uuid: 'aa791103-ecdf-4cfa-8a7d-bee35b921067',
					roleName: '護理師三號',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-16T16:20:17.510+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-16T16:33:40.327+0800',
					proved: '2',
					reason: '權限設定有誤',
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					uuid: 'c1e494a1-6c1e-46ae-8d10-5e4c210f8cf9',
					roleName: '1**',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T16:19:59.977+0800',
					updName: '張Ｘ茹',
					updDt: '2022-08-23T08:49:34.883+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: 'c210d85e-2a31-4b5c-85bc-e140c88b9af4',
					roleName: '測試人員',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-27T15:57:13.923+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-07-28T13:32:54.133+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'CaseMaintainIndex',
							menuName: '個案維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					uuid: 'c8c72aed-f48c-4430-965d-4097d4909b2e',
					roleName: '護理師',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T15:57:38.300+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.430+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'CaseMaintainIndex',
							menuName: '個案維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
					],
				},
				{
					uuid: 'c97ed913-6723-4459-8f1a-4a865d6eeb51',
					roleName: '系統管理員助理',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-28T11:02:48.950+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-28T11:07:32.353+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: 'dca89dd7-d126-4bf9-bb9d-b85273f140e0',
					roleName: '系統管理員',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T16:02:19.470+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.497+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: 'e0fb464d-c583-4717-891a-d129431b2658',
					roleName: '護理師',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-31T16:24:04.263+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-09-01T11:10:48.417+0800',
					proved: '2',
					reason: '測試退回',
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'CaseMaintainIndex',
							menuName: '個案維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
					],
				},
				{
					uuid: 'e91cac7e-387e-438d-9414-c992acae3b4e',
					roleName: '0727測試',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-27T11:21:44.973+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-07-27T15:43:19.487+0800',
					proved: '2',
					reason: '"56"',
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: 'edb60e0a-b379-40d5-b7d6-637987befac0',
					roleName: '09',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-28T13:33:37.680+0800',
					updName: '張Ｘ茹',
					updDt: '2022-08-23T08:49:34.960+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					uuid: 'ef64f975-ca5e-4e14-94df-28a2eaa6b5b4',
					roleName: '員工',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T15:54:36.187+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.527+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					uuid: 'f203883d-5e26-4f0f-8339-b353c023f938',
					roleName: '測試1',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T14:46:41.333+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:27.957+0800',
					proved: '1',
					reason: null,
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: 'f269a22b-bec4-432f-b104-f397467d73c5',
					roleName: '測試12',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T15:21:36.333+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.577+0800',
					proved: '1',
					reason: null,
					execAction: 'UPDATE',
					menus: [
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
					],
				},
				{
					uuid: 'f27fd0aa-ecbb-4721-8e41-173a90192bfd',
					roleName: '123',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-25T16:19:21.853+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-07-26T11:30:09.763+0800',
					proved: '2',
					reason: '角色名稱非字串',
					execAction: 'CREATE',
					menus: [
						{
							menuId: 'CaseMaintainIndex',
							menuName: '個案維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ParamMaintainIndex',
							menuName: '參數維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ErMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'SatisfyQuestMaintainIndex',
							menuName: '滿意度問卷維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'EventMaintainIndex',
							menuName: '活動資訊設定',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'HealthPromoteIndex',
							menuName: '健康促進服務',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'RelevantSurveyIndex',
							menuName: '相關問卷填寫',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'UserMaintainIndex',
							menuName: '使用者維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'BuildDataIndex',
							menuName: '建立人因危害資料',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'SendNoticeModifyReserveIndex',
							menuName: '發送通知與修改預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'NotificationAndRecordQuery',
							menuName: '衛教通知發送',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'DoctorConsultIndex',
							menuName: '醫師諮詢服務',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'ServiceTimeMaintainIndex',
							menuName: '服務場次管理',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'StrangeMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MyReservationIndex',
							menuName: '我的預約',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'ReportDownLoadIndex',
							menuName: '報表查詢下載',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'HealthValueMaintainList',
							menuName: '健檢數值維護',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
							parentId: 'PhyConsult',
							parentName: '醫師諮詢服務',
						},
						{
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
			],
			pageable: {
				sort: {
					sorted: false,
					unsorted: true,
				},
				pageSize: 100,
				pageNumber: 0,
				offset: '0',
				paged: true,
				unpaged: false,
			},
			last: true,
			totalPages: 1,
			totalElements: '27',
			sort: {
				sorted: false,
				unsorted: true,
			},
			numberOfElements: 27,
			first: true,
			size: 100,
			number: 0,
		};
		const content = JSON.parse(JSON.stringify(TESTDATA.content));
		this.gridData.data = content.map((role, index) => {
			const { menus, ...other } = role;
			const innerData = menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
			this.$set(this.innerGridData.data, `roleId_${role.uuid}`, innerData);
			return { rowkey: index + 1, ...other };
		});
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.queryRoleChangeHistoryUsingPOST($form)
	// 		.then((resp) => {
	// 			// TEST:
	// 			// console.log(resp);
	// 			if (resp.data.data) {
	// 				const content = JSON.parse(JSON.stringify(resp.data.data.content));
	// 				this.gridData.data = content.map((role, index) => {
	// 					const { menus, ...other } = role;
	// 					const innerData = menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
	// 					this.$set(this.innerGridData.data, `roleId_${role.uuid}`, innerData);
	// 					return { rowkey: index + 1, ...other };
	// 				});
	// 			} else {
	// 				const apiErrorMsg = JSON.parse(JSON.stringify(resp.data.apiError));
	// 				this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
	// 				this.gridData.data = [];
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	// API: 1.2.28.	查詢角色歷史異動紀錄-下載
	fetchDownload() {
		const $form = this.getQueryForm();
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.roleChangeHistoryDownloadUsingPOST($form, { responseType: 'blob' })
	// 		.then((resp) => {
	// 			// TEST:
	// 			console.log(resp);
	// 			const disposition = resp.headers['content-disposition'];
	// 			if (disposition) {
	// 			  let filename = '';
	// 				if (disposition.indexOf('attachment') !== -1) {
	// 					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	// 					const matches = filenameRegex.exec(disposition);
	// 					if (matches != null && matches[1]) {
	// 						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
	// 					}
	// 				}
	// 				this.$blobUtils.download(
	// 					resp.data as Blob,
	// 					filename,
	// 					resp.headers['content-type'],
	// 				);
	// 			} else {
	// 				this.$AdminControlAdminApi.roleChangeHistoryDownloadUsingPOST($form)
	// 					.then((resp) => {
	// 						const respData = JSON.stringify(resp);
	// 						const apiErrorMsg = JSON.parse(respData).data.apiError;
	// 						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
	// 					}).catch((error) => {
	// 						// TEST:
	// 						// console.log(error);
	// 					}).finally(() => {
	// 						this.setLoading(false);
	// 					});
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	// created() {
	// 	this.fetchRolesOpts();
	// }

	// updated() {
	// 	window.parseWord();
	// }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
    margin-bottom: 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    margin: 20px 0;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $BS-TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $BS-COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			// margin-bottom: 20px;
			padding-top: 40px;
			padding-bottom: 40px;
			padding-left: (92/1088)*100%;
			padding-right: (92/1088)*100%;
      .modal-container__event__block__title {
        font-size: 20px;
        font-weight: $BS-TEXT-BOLD;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $BS-TEXT-BOLD;
        }
      }
		}
    .input__block {
      width: 100%
    }
    .searchResult__block {
      margin-top: 30px;
      .searchResult__block__header {
        margin-bottom: 20px;
      }
      .searchResult__block__title {
        font-size: 24px;
        font-weight: $BS-TEXT-BOLD;
      }
    }
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $BS-TEXT-BOLD;
  }
  .option__block {
    margin-bottom: 20px;
  }
  .option__block__item {
    margin-bottom: 20px;
    @include bs-rwd-xl {
      margin-bottom: 0px;
    }
  }
  .table--scroll {
    overflow-x: auto;
  }
  ::v-deep {
    .ant-input, .ant-select-selection, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-select-selection__rendered > ul > li {
      line-height: 31px;
      height: 31px;
    }
    .ant-form-item {
      margin: 0px;
    }
    .ant-table-header-column {
      font-weight: 900;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
