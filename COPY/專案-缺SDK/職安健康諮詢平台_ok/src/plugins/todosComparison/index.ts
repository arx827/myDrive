/**
 * @summary 待辦事項ID&Route對照表
*/
import Vue, { PluginFunction, PluginObject } from 'vue';
import axios from 'axios';

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
		$todosComparsion: TodosComparsion;
  }
}

export interface TodosComparsion {
}

export class TodosComparsion implements PluginObject<TodosComparsion> {
	comparison = [
		{
			todoId: 'Z0401', toRoute: 'MyReservationIndex', toDoDesc: '提醒您~您已預約醫師諮詢', cate: '醫師諮詢', note: '到我的預約', withQuery: null, params: null,
		},
		{
			todoId: 'Z0402', toRoute: 'ServiceTimeMaintainAddAndEdit', toDoDesc: '場次編輯暫存', cate: '醫師諮詢', note: '到場次編輯畫面,需多傳場次ID', withQuery: { actId: 'API_caseId' }, params: { type: 'edit' },
		},
		{
			todoId: 'Z0403', toRoute: 'ServiceTimeMaintainIndex', toDoDesc: '待發佈之活動', cate: '醫師諮詢', note: '到服務場次管理, 打開待發布多場次popup', withQuery: null, params: null,
		},
		{
			todoId: 'Z0404', toRoute: 'SendNoticeModifyReserveResult', toDoDesc: '尚未完成諮詢', cate: '醫師諮詢', note: ', ', withQuery: { dateType: 'single', data: 'API_caseDate' }, params: null,
		},
		// {
		// 	todoId: 'Z0405', toRoute: 'DoctorConsultReservationStep1', toDoDesc: '需追蹤', cate: '醫師諮詢', note: '?', withQuery: null, params: null,
		// },
		{
			todoId: 'Z0406', toRoute: 'MyRegistrationIndex', toDoDesc: '已報名活動', cate: '健康促進活動', note: '到我的報名頁', withQuery: null, params: null,
		},
		{
			todoId: 'Z0407', toRoute: 'MyRegistrationIndex', toDoDesc: '滿意度問卷待填', cate: '健康促進活動', note: '到我的報名頁', withQuery: null, params: null,
		},
		{
			todoId: 'Z0408', toRoute: 'EventAndTimeMaintainEventAddAndEditStep3', toDoDesc: '活動問卷暫存', cate: '健康促進活動', note: '活動問卷編輯畫面(帶問卷ID)', withQuery: { status: 0, actId: 'API_caseId' }, params: { type: 'edit' },
		},
		{
			todoId: 'Z0409', toRoute: 'SatisfyQuestMaintainAddAndEdit', toDoDesc: '滿意度問卷暫存', cate: '健康促進活動', note: '滿意度問卷編輯畫面(帶問卷ID)', withQuery: { status: 0, satisfyQuestId: 'API_caseId' }, params: { type: 'edit' },
		},
		// {
		// 	todoId: 'Z0410', toRoute: '', toDoDesc: '需追蹤', cate: '健康促進活動', note: ', ', withQuery: {}, params: null,
		// },
		{
			todoId: 'Z0411', toRoute: 'MyReservationIndex', toDoDesc: '醫師諮詢預約', cate: '健康快e通', note: '進入醫師諮詢/我的預約頁面', withQuery: null, params: null,
		},
		{
			todoId: 'Z0412', toRoute: 'popup', toDoDesc: '衛教訊息', cate: '健康快e通', note: '?', withQuery: { sendInfoRecordId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0413', toRoute: 'EmpHealthReportAdd', toDoDesc: '單筆建檔暫存', cate: '健康快e通', note: '填寫頁面(帶KEY值)', withQuery: { resultId: 'API_caseId' }, params: { type: 'edit' },
		},
		// {
		// 	todoId: 'Z0414', toRoute: 'DoctorConsultReservationStep1', toDoDesc: '尚未預約諮詢', cate: '健康快e通', note: '!?', withQuery: {}, params: null,
		// },
		{
			todoId: 'Z0415', toRoute: 'MotherPlanIndex', toDoDesc: '表單待填', cate: '母性保護', note: '導頁到填寫表單入口', withQuery: null, params: null,
		},
		{
			todoId: 'Z0416', toRoute: 'MotherPlanIndex', toDoDesc: '表單暫存', cate: '母性保護', note: '導頁到填寫表單入口', withQuery: null, params: null,
		},
		{
			todoId: 'Z0417', toRoute: 'popup', toDoDesc: '衛教訊息', cate: '母性保護', note: '', withQuery: { sendInfoRecordId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0418', toRoute: 'MotherPlanDoctorReservationStep1', toDoDesc: '醫師諮詢預約', cate: '母性保護', note: '進入醫師諮詢/我的預約頁面src_from = D0102', withQuery: { srcFrom: 'D0102', caseId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0419', toRoute: 'MonthMaintainIndex', toDoDesc: '待結案', cate: '母性保護', note: '', withQuery: { todoId: 'Z0420' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0420', toRoute: 'MonthMaintainIndex', toDoDesc: '表單待填', cate: '母性保護', note: '', withQuery: { todoId: 'Z0419' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0421', toRoute: 'MonthMaintainIndex', toDoDesc: '尚未回填表單', cate: '母性保護', note: '', withQuery: { todoId: 'Z0421' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0422', toRoute: 'RelevantScaleIndex', toDoDesc: '表單待填', cate: '異常負荷', note: '', withQuery: null, params: null,
		},
		{
			todoId: 'Z0423', toRoute: 'RelevantScaleIndex', toDoDesc: '表單暫存', cate: '異常負荷', note: '', withQuery: null, params: null,
		},
		{
			todoId: 'Z0424', toRoute: 'popup', toDoDesc: '衛教訊息', cate: '異常負荷', note: '', withQuery: { sendInfoRecordId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0425', toRoute: 'DoctorConsultReservationStep1', toDoDesc: '醫師諮詢預約', cate: '異常負荷', note: '進入醫師諮詢/我的預約頁src_from = D0103', withQuery: { srcFrom: 'D0103', caseId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0426',
			toRoute: 'QueryOverTimeList',
			toDoDesc: '待結案',
			cate: '異常負荷',
			note: ', ',
			withQuery: {
				todoId: 'Z0426', classType: '', status: '', friskLevel: '', level: '', questionLevel: '', workLevel: '', continuous: '',
			},
			params: { type: 'todo' },
		},
		{
			todoId: 'Z0427',
			toRoute: 'QueryOverTimeList',
			toDoDesc: '尚未回填表單',
			cate: '異常負荷',
			note: ', ',
			withQuery: {
				todoId: 'Z0427', classType: '', status: '', friskLevel: '', level: '', questionLevel: '', workLevel: '', continuous: '',
			},
			params: { type: 'todo' },
		},
		{
			todoId: 'Z0428',
			toRoute: 'QueryOverTimeList',
			toDoDesc: '尚未預約諮詢',
			cate: '異常負荷',
			note: ', ',
			withQuery: {
				todoId: 'Z0428', classType: '', status: '', friskLevel: '', level: '', questionLevel: '', workLevel: '', continuous: '',
			},
			params: { type: 'todo' },
		},
		{
			todoId: 'Z0429',
			toRoute: 'QueryOverTimeList',
			toDoDesc: '需追蹤',
			cate: '異常負荷',
			note: '',
			withQuery: {
				todoId: 'Z0429', classType: '', status: '', friskLevel: '', level: '', questionLevel: '', workLevel: '', continuous: '',
			},
			params: { type: 'todo' },
		},
		{
			todoId: 'Z0430', toRoute: 'RelevantSurveyIndex', toDoDesc: '表單待填', cate: '人因性', note: ', ', withQuery: null, params: null,
		},
		{
			todoId: 'Z0431', toRoute: 'popup', toDoDesc: '衛教訊息', cate: '人因性', note: '', withQuery: { sendInfoRecordId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0432', toRoute: 'DoctorConsultReservationStep1', toDoDesc: '醫師諮詢預約', cate: '人因性', note: '進入醫師諮詢/我的預約頁面src_from = D0104', withQuery: { srcFrom: 'D0104', caseId: 'API_caseId' }, params: null,
		},
		{
			todoId: 'Z0433', toRoute: 'QueryDataList', toDoDesc: '待結案案件', cate: '人因性', note: ', ', withQuery: { period: '2022', todoId: 'Z0433' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0434', toRoute: 'QueryDataList', toDoDesc: '發通知表單還未填須追蹤', cate: '人因性', note: ', ', withQuery: { period: '2022', todoId: 'Z0434' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0435', toRoute: 'QueryDataList', toDoDesc: '發醫師諮詢後有表單未填須追蹤', cate: '人因性', note: '', withQuery: { period: '2022', todoId: 'Z0435' }, params: { type: 'todo' },
		},
		{
			todoId: 'Z0436', toRoute: 'RoleMaintainIndex', toDoDesc: '角色待覆核', cate: '系統管理員', note: '', withQuery: null, params: null,
		},
		{
			todoId: 'Z0437', toRoute: 'UserMaintainIndex', toDoDesc: '使用者待覆核', cate: '系統管理員', note: '', withQuery: null, params: null,
		},
		{
			todoId: 'Z0438', toRoute: 'LoginCheckWorkIndex', toDoDesc: '護理師登入待覆核', cate: '主管', note: '', withQuery: null, params: null,
		},
	]

	/**
	 * @summary 取得相對應route資訊
	 * @param routeName
	 * @param queryKey
	 * @param params
	 * @param otherQuery
	*/
	getRouteInfo(id: string): {routeName: string; withQuery: any; params: any} {
		const target = this.comparison.find((e) => e.todoId === id);
		return {
			routeName: target ? target.toRoute : '',
			withQuery: target ? target.withQuery : '',
			params: target ? target.params : null,
		};
	}

	public install(Vue) {
		Vue.prototype.$todosComparsion = this;
	}
}

export default new TodosComparsion();
