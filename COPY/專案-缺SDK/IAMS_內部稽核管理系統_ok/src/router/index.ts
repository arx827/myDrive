import Vue from 'vue';
import VueRouter, { Route, RawLocation } from 'vue-router';
import LoginPage from '@/pages/Login.vue';
import Index from '@/pages/Index.vue';
import EmptyRouterView from '@/components/shared/layout/EmptyRouterView.vue';

import { UserService } from '@/plugins/user';
import { message } from 'ant-design-vue';
import { BehaviorSubject, Subject } from 'rxjs';
/* -----------------------系統代碼維護-------------------------*/

/* -----------------------年度稽核計畫-------------------------*/
import AuditPlanIndex from '@/pages/auditPlan/AuditPlanIndex.vue';
import AuditPlanResult from '@/pages/auditPlan/AuditPlanResult.vue';
/* -----------------------資料蒐集確認-------------------------*/
import CrawlerDataUpload from '@/pages/crawlerData/CrawlerDataUpload.vue';
import CrawlerDataIndex from '@/pages/crawlerData/CrawlerDataIndex.vue';
import CrawlerDataDetail from '@/pages/crawlerData/CrawlerDataDetail.vue';
/* -----------------------查核行前規劃-------------------------*/
// import Notice from '@/pages/preparation/_Notice.vue';
import PreparationIndex from '@/pages/preparation/PreparationIndex.vue';
// import HumanResourcePlanning from '@/pages/preparation/_HumanResourcePlanning.vue';
import WorkPlanning from '@/pages/preparation/WorkPlanning.vue';
// import DocumentTetrieval from '@/pages/preparation/_DocumentTetrieval.vue';
// import Questionnaire from '@/pages/preparation/Questionnaire.vue';
/* -----------------------工作底稿-------------------------*/
import AuditingIndex from '@/pages/auditing/AuditingIndex.vue';
import AuditingDetail from '@/pages/auditing/AuditingDetail.vue';
import AuditingContent from '@/pages/auditing/AuditingContent.vue';
import AuditingResult from '@/pages/auditing/AuditingResult.vue';

/* -----------------------系統設定-------------------------*/
import AdminView from '@admin/AdminView.vue';
import AccountIndex from '@admin/account/AccountIndex.vue';
import AccountResult from '@admin/account/AccountResult.vue';
import ParameterIndex from '@admin/parameter/ParameterIndex.vue';
import AccountAgentIndex from '@admin/account-agent/AccountAgentIndex.vue';
import AccountAgentResult from '@admin/account-agent/AccountAgentResult.vue';

/* -----------------------reload跳轉頁-------------------------*/
import Refresh from '@/components/shared/Refresh.vue';
/* ------------------------404跳轉頁---------------------------*/
import NotFound from '@/pages/NotFound.vue';
import NoAuthorization from '@/pages/NoAuthorization.vue';

// 解決重複點擊路由的報錯錯
const originalPush = VueRouter.prototype.push as unknown as Promise<Route>;
VueRouter.prototype.push = function push(location: RawLocation) {
	return (originalPush as any).call(this, location).catch((err: Error) => err);
};

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
	{ path: '/login', name: 'Login', component: LoginPage },
	{ path: '/no-authorization', name: 'NoAuthorization', component: NoAuthorization },
	{
		path: '/refresh',
		name: 'Refresh',
		component: Refresh,
	},
	{
		path: '/',
		name: 'Main',
		redirect: '/index',
		component: EmptyRouterView,
		children: [
			{ path: '/index', name: 'Index', component: Index },
			/* -----------------------資料蒐集確認-------------------------*/
			{
				path: 'crawler-data/:type(todo|all)?',
				name: 'DataCollectIndex',
				component: CrawlerDataIndex,
				meta: {
					breadcrumb: ['資料蒐集確認'],
				},
			},
			{
				path: 'crawler-data/detail',
				name: 'CrawlerDataDetail',
				component: CrawlerDataDetail,
				meta: {
					breadcrumb: ['資料蒐集確認'],
				},
			},
			{
				path: 'crawler-data/upload',
				name: 'CrawlerDataUpload',
				component: CrawlerDataUpload,
			},
			/* -----------------------年度稽核計畫-------------------------*/
			{
				path: 'audit-plan/:type(todo|all)?',
				name: 'AuditPlanIndex',
				component: AuditPlanIndex,
				meta: {
					breadcrumb: ['年度稽核計畫', '年度稽核計畫一覽表'],
				},
			},
			{
				path: 'audit-plan/result',
				name: 'AuditPlanResult',
				component: AuditPlanResult,
				meta: {
					breadcrumb: ['年度稽核計畫', '結案'],
				},
			},
			/* -----------------------查核行前規劃-------------------------*/
			{
				path: 'preparation/:type(todo|all)?',
				name: 'PreparationIndex',
				component: PreparationIndex,
				meta: {
					breadcrumb: ['查核行前規劃', '季工作規劃表'],
				},
			},
			// {
			// 	path: 'preparation/notice',
			// 	name: 'Notice',
			// 	component: Notice,
			// 	meta: {
			// 		breadcrumb: ['查核行前規劃', '查核通知書'],
			// 		path: 'preparation/human-resource-planning',
			// 		name: 'HumanResourcePlanning',
			// 		component: HumanResourcePlanning,
			// 		meta: {
			// 			breadcrumb: ['查核行前規劃', '季工作規劃表', '人力工作狀況統計表'],
			// 		},
			// 	},
			// },
			{
				path: 'preparation/work-planning',
				name: 'WorkPlanning',
				component: WorkPlanning,
				meta: {
					breadcrumb: ['查核行前規劃', '工作規劃表'],
				},
			},
			// {
			// 	path: 'preparation/document-tetrieval',
			// 	name: 'DocumentTetrieval',
			// 	component: DocumentTetrieval,
			// 	meta: {
			// 		breadcrumb: ['查核行前規劃', '調閱清單'],
			// 	},
			// },
			// {
			// 	path: 'preparation/questionnaire',
			// 	name: 'Questionnaire',
			// 	component: Questionnaire,
			// 	meta: {
			// 		breadcrumb: ['查核行前規劃', '問卷'],
			// 	},
			// },
			/* -----------------------工作底稿-------------------------*/
			{
				path: 'auditing/:type(todo|all)?',
				name: 'WorkPaperIndex',
				component: AuditingIndex,
				meta: {
					breadcrumb: ['工作底稿'],
				},
			},
			{
				path: 'auditing/detail',
				name: 'AuditingDetail',
				component: AuditingDetail,
				meta: {
					breadcrumb: ['工作底稿'],
				},
			},
			{
				path: 'auditing/content',
				name: 'AuditingContent',
				component: AuditingContent,
				meta: {
					breadcrumb: ['工作底稿', '查核內容'],
				},
			},
			{
				path: 'auditing/result',
				name: 'AuditingResult',
				component: AuditingResult,
				meta: {
					breadcrumb: ['工作底稿', '查核結束'],
				},
			},
			/* ----------------------- 後台管理 -------------------------*/
			{
				path: 'admin',
				name: 'admin',
				component: AdminView,
				children: [
					/* ----------------------- 使用者維護 -------------------------*/
					{
						path: 'account/:type(todo|all)?',
						name: 'AccountIndex',
						component: AccountIndex,
						meta: {
							breadcrumb: ['系統設定', '使用者維護'],
						},
					},
					{
						path: 'account/:type(pass|reject|edit)',
						name: 'AccountResult',
						component: AccountResult,
						meta: {
							breadcrumb: ['系統設定', '使用者維護', '執行結果'],
						},
					},
					/* ----------------------- 參數設定 -------------------------*/
					{
						path: 'parameter',
						name: 'ParameterIndex',
						component: ParameterIndex,
						meta: {
							breadcrumb: ['系統設定', '參數設定'],
						},
					},
					/* ----------------------- 代理人設定 -------------------------*/
					{
						path: 'account-agent',
						name: 'AccountAgentIndex',
						component: AccountAgentIndex,
						meta: {
							breadcrumb: ['系統設定', '代理人設定'],
						},
					},
					{
						path: 'account-agent/:type(add|edit)',
						name: 'AccountAgentResult',
						component: AccountAgentResult,
						meta: {
							breadcrumb: ['系統設定', '代理人設定', '執行結果'],
						},
					},
				],
			},
			/* -----------------------test-尚未開發的流程-------------------------*/
			{
				path: 'AuditOpinionIndex',
				name: 'AuditOpinionIndex',
				component: NotFound,
			},
			{
				path: 'AuditMeetingIndex',
				name: 'AuditMeetingIndex',
				component: NotFound,
			},
			{
				path: 'AuditReportIndex',
				name: 'AuditReportIndex',
				component: NotFound,
			},
			{
				path: 'IssueTrackingIndex',
				name: 'IssueTrackingIndex',
				component: NotFound,
			},
		],

		beforeEnter(to, from, next) {
			const userService: UserService = Vue.prototype.$user;
			if (!userService.hasValidToken()) {
				message.warn('尚未登入');
				next({ name: 'Login' });
			} else {
				next();
			}
		},
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: NotFound,
	},

];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.path === '/login') return next();
	Vue.prototype.beforeEnter$.next({
		to,
		from,
	});
	next();
});

export default router;
