import Vue from 'vue';
import VueRouter, { Route, RawLocation } from 'vue-router';
import DiffPage from '@/pages/DiffPage.vue';
import EmptyRouterView from '@/components/shared/layout/EmptyRouterView.vue';
import { message } from 'ant-design-vue';
import { BehaviorSubject, Subject } from 'rxjs';
import NotFound from '@/pages/NotFound.vue';
import AgentSettingIndex from '@admin/agentSetting/AgentSettingIndex.vue';
import AgentSettingResult from '@admin/agentSetting/AgentSettingResult.vue';
import RoleMaintainIndex from '@admin/roleMaintain/RoleMaintainIndex.vue';
import RoleMaintainResult from '@admin/roleMaintain/RoleMaintainResult.vue';
import ParamMaintainIndex from '@admin/paramMaintain/ParamMaintainIndex.vue';
import ParamMaintainList from '@admin/paramMaintain/ParamMaintainList.vue';
import ParamMaintainResult from '@admin/paramMaintain/ParamMaintainResult.vue';
import UserMaintainIndex from '@admin/userMaintain/UserMaintainIndex.vue';
import UserMaintainList from '@admin/userMaintain/UserMaintainList.vue';
import AdminView from '@admin/AdminView.vue';
import Index from '@/pages/Index.vue';
import Test from '@/pages/Test.vue';

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
	// { path: '/login', name: 'Login', component: LoginPage },
	// { path: '/diffdemo', name: 'diffdemo', component: DiffPage },

	{
		path: '/',
		name: 'Main',
		redirect: '/admin/agentSetting/index',
		component: EmptyRouterView,
		children: [
			/* ----------------------- 後台管理 -------------------------*/
			{
				path: 'admin',
				name: 'admin',
				component: AdminView,
				children: [
					/* ----------------------- 代理人維護 -------------------------*/
					{
						path: 'agentSetting/index',
						name: 'AgentSettingIndex',
						component: AgentSettingIndex,
						meta: {
							breadcrumb: ['其他', '代理人設定'],
						},
					},
					{
						path: 'agentSetting/:type/result',
						name: 'AgentSettingResult',
						component: AgentSettingResult,
						meta: {
							breadcrumb: {
								add: ['其他', '代理人設定', '執行結果'],
								edit: ['其他', '代理人設定', '執行結果'],
							},
						},
					},
					/* ----------------------- 角色維護 -------------------------*/
					{
						path: 'roleMaintain/index',
						name: 'RoleMaintainIndex',
						component: RoleMaintainIndex,
						meta: {
							breadcrumb: ['其他', '角色維護'],
						},
					},
					{
						path: 'roleMaintain/:type/result',
						name: 'RoleMaintainResult',
						component: RoleMaintainResult,
						meta: {
							breadcrumb: {
								back: ['其他', '角色維護', '執行結果'],
								add: ['其他', '角色維護', '執行結果'],
								edit: ['其他', '角色維護', '執行結果'],
								check: ['其他', '角色維護', '執行結果'],
							},
						},
					},
					/* ----------------------- 參數維護 -------------------------*/
					{
						path: 'paramMaintain/index',
						name: 'ParamMaintainIndex',
						component: ParamMaintainIndex,
						meta: {
							breadcrumb: ['其他', '參數維護'],
						},
					},
					{
						path: 'paramMaintain/list',
						name: 'ParamMaintainList',
						component: ParamMaintainList,
						meta: {
							breadcrumb: ['其他', '參數維護'],
						},
					},
					{
						path: 'paramMaintain/:type/result',
						name: 'ParamMaintainResult',
						component: ParamMaintainResult,
						meta: {
							breadcrumb: ['其他', '參數維護', '執行結果'],
						},
					},
					/* ----------------------- 使用者維護 -------------------------*/
					{
						path: 'userMaintain/index',
						name: 'UserMaintainIndex',
						component: UserMaintainIndex,
						meta: {
							breadcrumb: ['其他', '使用者維護'],
						},
					},
					{
						path: 'userMaintain/list',
						name: 'UserMaintainList',
						component: UserMaintainList,
						meta: {
							breadcrumb: ['其他', '使用者維護', '查詢結果'],
						},
					},
				],
			},
		],
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

// 解決重複點擊路由的報錯錯
const originalPush = VueRouter.prototype.push as unknown as Promise<Route>;
VueRouter.prototype.push = function push(location: RawLocation) {
	return (originalPush as any).call(this, location).catch((err: Error) => err);
};

router.beforeEach((to, from, next) => {
	Vue.prototype.beforeEnter$.next({
		to,
		from,
	});
	next();
});

export default router;
