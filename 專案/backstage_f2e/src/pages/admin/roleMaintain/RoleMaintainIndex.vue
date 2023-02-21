<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        角色維護
      </div>
      <div class="d-flex">
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="download"
        >
          下載
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openHistoryChangeModal"
        >
          歷史異動紀錄
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openCheckItemModal"
        >
          待覆核項目
        </button>
        <button
          class="btn__radius--primary--outline--small ms-2 mb-2"
          @click="openRoleAddandEditModal()"
        >
          新增角色
        </button>
      </div>
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
          <div
            slot="handleTemp"
            slot-scope="slotProps"
            class="d-flex"
          >
            <button
              class="icon-button icon__edit"
              :class="{'icon__edit--disabled': slotProps.dataStatus === 1}"
              :disabled="slotProps.dataStatus === 1"
              @click="openRoleAddandEditModal(slotProps)"
            >
              <a-icon type="edit" />
            </button>
          </div>
          <a-table
            slot="expandedRowRender"
            slot-scope="slotProps"
            :row-key="innerGridData.rowKey"
            :columns="innerGridData.columns"
            :data-source="innerGridData.data[`roleId_${slotProps.roleId}`]"
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

    <div
      v-if="gridData.data.length!==0"
      class="d-flex justify-content-end pagination__block"
    >
      <a-pagination
        size="small"
        :total="gridData.pagination.total"
        :page-size-options="gridData.pagination.pageSizeOptions"
        show-size-changer
        show-quick-jumper
        @change="onPageChange"
        @showSizeChange="onShowSizeChange"
      />
    </div>

    <HistoryChangeModal
      :visible.sync="historyChangeModalVisible"
    />
    <CheckItemModal
      :visible.sync="checkItemModalVisible"
    />
    <RoleAddandEditModal
      :visible.sync="roleAddandEditModalVisible"
      :type="roleAddandEditModalType"
      :edit-data="editData"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import HistoryChangeModal from '@admin/roleMaintain/HistoryChangeModal.vue';
import RoleAddandEditModal from '@admin/roleMaintain/RoleAddandEditModal.vue';
import CheckItemModal from '@admin/roleMaintain/CheckItemModal.vue';
// import notification from '@/plugins/backStagePlugins/notification/infoNotification';
// import { QueryPageModel, RoleChangeQueryDto } from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: {
		HistoryChangeModal,
		CheckItemModal,
		RoleAddandEditModal,
	},
})
export default class RoleMaintainIndex extends Vue {
	@Action('setLoading') setLoading;

	h = this.$createElement;

	historyChangeModalVisible = false;

	checkItemModalVisible = false;

	roleAddandEditModalVisible = false;

	roleAddandEditModalType = null;

	editData = null;

	// 父層 欄位資料
	gridData = {
		rowKey: 'rowkey',
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 25,
			pageSizeOptions: ['5', '10', '25'],
			showQuickJumper: true,
			showSizeChanger: true,
		},
		columns: [
			{
				title: '角色名稱',
				dataIndex: 'roleName',
				key: 'roleName',
				width: 130,
			},
			{
				title: '是否啟用',
				dataIndex: 'enabled',
				key: 'enabled',
				width: 100,
				customRender: (data) => {
					if (data) {
						return data === 'Y' ? '是' : '否';
					}
				},
			},
			{
				title: '建立人員',
				dataIndex: 'crtName',
				key: 'crtName',
				width: 130,
			},
			{
				title: '建立時間',
				dataIndex: 'crtDt',
				key: 'crtDt',
				width: 120,
				customRender: (data) => {
					if (data) {
						return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
					} return '';
				},
			},
			{
				title: '異動人員',
				dataIndex: 'updName',
				key: 'chengePerson',
				width: 130,
			},
			{
				title: '異動時間',
				dataIndex: 'updDt',
				key: 'updDt',
				width: 120,
				customRender: (data) => {
					if (data) {
						return	this.h('ul', [this.h('li', moment(data).format('YYYY/MM/DD')), this.h('li', moment(data).format('HH:mm:ss'))]);
					} return '';
				},
			},
			{
				title: '備註',
				dataIndex: 'remark',
				key: 'remark',
				width: 150,
				customRender: (data) => ((data) || this.h('div', '--')),
			},
			{
				title: '資料狀態',
				dataIndex: 'dataStatus',
				key: 'dataStatus',
				width: 100,
				customRender: (data) => (data === 0 ? '可異動' : '不可異動'),
			},
			{
				title: '',
				scopedSlots: { customRender: 'handleTemp' },
				width: 100,
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

	openHistoryChangeModal() {
		this.historyChangeModalVisible = true;
	}

	// closeHistoryChangeModal() {
	// 	this.historyChangeModalVisible = false;
	// }

	openCheckItemModal() {
		this.checkItemModalVisible = true;
	}

	// closeCheckItemModal() {
	// 	this.checkItemModalVisible = false;
	// }

	openRoleAddandEditModal(data?) {
		this.roleAddandEditModalVisible = true;
		this.roleAddandEditModalType = data ? 'edit' : 'add';
		this.editData = data;
	}

	// closeRoleAddandEditModal() {
	// 	this.roleAddandEditModalVisible = false;
	// }

	download() {
		this.fetchDownloadRoles();
	}

	onPageChange(current) {
		this.gridData.pagination.current = current;
		this.fetchRolesPage();
	}

	onShowSizeChange(current, pageSize) {
		this.gridData.pagination.current = current;
		this.gridData.pagination.pageSize = pageSize;
		this.fetchRolesPage();
	}

	// API:1.2.23.	查詢所有角色(page)
	fetchRolesPage() {
		const $search = {
			pageNo: this.gridData.pagination.current - 1,
			pageSize: this.gridData.pagination.pageSize,
		};
		// TEST:
		const TESTDATA = {
			content: [
				{
					roleId: '1',
					roleName: '員工',
					enabled: 'Y',
					crtName: null,
					crtDt: null,
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.527+0800',
					remark: '健康資源系統',
					dataStatus: 1,
					menus: [
						{
							menuId: 'MyHealthReportIndex',
							menuName: '我的健檢資訊',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
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
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
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
							menuId: 'RelevantScaleIndex',
							menuName: '相關量表填寫',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'MyRegistrationIndex',
							menuName: '我的報名',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
					],
				},
				{
					roleId: '10',
					roleName: '09',
					enabled: 'N',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T14:49:28.087+0800',
					updName: '張Ｘ茹',
					updDt: '2022-08-23T08:49:34.927+0800',
					remark: null,
					dataStatus: 0,
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
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
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
					],
				},
				{
					roleId: '2',
					roleName: '護理師',
					enabled: 'Y',
					crtName: null,
					crtDt: null,
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.427+0800',
					remark: '健康資源系統',
					dataStatus: 1,
					menus: [
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
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
							menuId: 'EHEventMaintainIndex',
							menuName: '活動內容維護',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'EmpHealthReportList',
							menuName: '建立員工健檢資料',
							parentId: 'HealthCheck',
							parentName: '健康快e通',
						},
						{
							menuId: 'EventContentMaintainIndex',
							menuName: '活動內容維護',
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
							menuId: 'HealthEduMaintainIndex',
							menuName: '通知內容維護',
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
							menuId: 'BuildOverTimeIndex',
							menuName: '建立加班人員名單',
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
							menuId: 'QueryDataIndex',
							menuName: '人因危害資料查詢',
							parentId: 'ErgonomicHazard',
							parentName: '人因危害預防',
						},
						{
							menuId: 'YearReportIndex',
							menuName: '年度紀錄與報表',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
						{
							menuId: 'EmpHealthDataExportQuery',
							menuName: '員工健檢資料匯出',
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
							menuId: 'MedicalStaffDataIndex',
							menuName: '醫護人員資料維護',
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
							menuId: 'EventAndTimeMaintainIndex',
							menuName: '活動與場次維護',
							parentId: 'HealthAct',
							parentName: '推動健康促進',
						},
						{
							menuId: 'QueryOverTimeIndex',
							menuName: '員工名單查詢',
							parentId: 'AbnormalLoad',
							parentName: '異常負荷預防',
						},
						{
							menuId: 'DownLoadReportIndex',
							menuName: '報表查詢下載',
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
							menuId: 'StrangeEventMaintainIndex',
							menuName: '活動內容維護',
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
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					roleId: '3',
					roleName: '主管',
					enabled: 'Y',
					crtName: null,
					crtDt: null,
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.350+0800',
					remark: '健康資源系統',
					dataStatus: 0,
					menus: [
						{
							menuId: 'NurseLoginRecordIndex',
							menuName: '登入紀錄',
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
							menuId: 'LoginCheckWorkIndex',
							menuName: '登入覆核作業',
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
					],
				},
				{
					roleId: '4',
					roleName: '系統管理員',
					enabled: 'Y',
					crtName: null,
					crtDt: null,
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.497+0800',
					remark: '健康資源系統',
					dataStatus: 0,
					menus: [
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
						{
							menuId: 'AgentSettingIndex',
							menuName: '代理人設定',
							parentId: 'Other',
							parentName: '其他',
						},
						{
							menuId: 'RoleMaintainIndex',
							menuName: '角色維護',
							parentId: 'Other',
							parentName: '其他',
						},
					],
				},
				{
					roleId: '5',
					roleName: '系統管理員助理',
					enabled: 'Y',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-28T11:01:00.357+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-28T11:07:32.360+0800',
					remark: null,
					dataStatus: 0,
					menus: [
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
					roleId: '6',
					roleName: '測試人員',
					enabled: 'Y',
					crtName: '楊Ｘ裕',
					crtDt: '2022-07-28T13:32:50.367+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T14:49:26.587+0800',
					remark: '協助測試母性繼康保護事項',
					dataStatus: 0,
					menus: [
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
						{
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
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
					],
				},
				{
					roleId: '7',
					roleName: '測試12',
					enabled: 'Y',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T14:49:26.673+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-12T16:03:18.577+0800',
					remark: '0812測試',
					dataStatus: 0,
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
					roleId: '8',
					roleName: '助產士',
					enabled: 'Y',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T14:49:27.983+0800',
					updName: null,
					updDt: null,
					remark: '協助護理師處理母性繼康保護事項',
					dataStatus: 0,
					menus: [
						{
							menuId: 'MonthMaintainIndex',
							menuName: '當月維護',
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
							menuId: 'MotherPlanIndex',
							menuName: '母性健康計畫',
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
							menuId: 'MotherMyRecordIndex',
							menuName: '我的填寫紀錄',
							parentId: 'MaternalProtect',
							parentName: '母性健康保護',
						},
					],
				},
				{
					roleId: '9',
					roleName: '行政助理',
					enabled: 'Y',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-12T14:49:28.027+0800',
					updName: null,
					updDt: null,
					remark: '協助醫護人員資料維護和活動資訊設定',
					dataStatus: 0,
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
			],
			pageable: {
				sort: {
					sorted: false,
					unsorted: true,
				},
				pageSize: 10,
				pageNumber: 0,
				offset: '0',
				paged: true,
				unpaged: false,
			},
			last: true,
			totalPages: 1,
			totalElements: '10',
			sort: {
				sorted: false,
				unsorted: true,
			},
			numberOfElements: 10,
			first: true,
			size: 10,
			number: 0,
		};

		const content = JSON.parse(JSON.stringify(TESTDATA.content));
		this.gridData.data = content.map((role, index) => {
			const innerData = role.menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
			this.$set(this.innerGridData.data, `roleId_${role.roleId}`, innerData);
			return { rowkey: index + 1, ...role };
		});
		this.gridData.pagination.total = Number(TESTDATA.totalElements);
		// this.setLoading(true);
		// this.$AdminControlAdminApi.rolesPageUsingPOST($search)
		// 	.then((resp) => {
		// 		// TEST:
		// 		// console.log(resp.data.data);
		// 		if (resp.data.data) {
		// 			const content = JSON.parse(JSON.stringify(resp.data.data.content));
		// 			this.gridData.data = content.map((role, index) => {
		// 				const innerData = role.menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
		// 				this.$set(this.innerGridData.data, `roleId_${role.roleId}`, innerData);
		// 				return { rowkey: index + 1, ...role };
		// 			});
		// 		}
		// 		this.gridData.pagination.total = Number(resp.data.data.totalElements);
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// API: 1.2.24.	查詢所有角色(page)-下載
	fetchDownloadRoles() {
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.rolesPageDownloadUsingPOST({ responseType: 'blob' })
	// 		.then((resp) => {
	// 			// TEST:
	// 			// console.log(resp);
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
	// 				this.$AdminControlAdminApi.rolesPageDownloadUsingPOST()
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
	// 			// TEST:
	// 			// console.log('error status = ', error);
	// 			this.$infoNotification.error({
	// 				content: '無法完成下載項目，請再次嘗試。',
	// 			});
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	created() {
		this.fetchRolesPage();
	}
}
</script>

<style lang="scss" scoped>
	.table--scroll {
		overflow-x: auto;
	}
	.pagination__block {
		margin-top: 20px;
		margin-bottom: 40px;
	}
  ::v-deep {
    .ant-table-header-column {
      font-weight: 900;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
