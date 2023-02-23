import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { message } from 'ant-design-vue';
import { BehaviorSubject, Subject } from 'rxjs';
import EmptyRouterView from '@/components/shared/layout/EmptyRouterView.vue';
import Login from '@/pages/user/Login.vue';
import LoginFirstPassword from '@/pages/user/LoginFirstPassword.vue';
import LoginFirst from '@/pages/user/LoginFirst.vue';
import Forgot from '@/pages/user/Forgot.vue';
import ResetPassword from '@/pages/user/ResetPassword.vue';
import LoginResult from '@/pages/user/Result.vue';
import ChangePassword from '@/pages/user/ChangePassword.vue';
import EmpFamilyPolicyChangeQuery from '@/pages/EmpFamilyPolicyChangeQuery.vue';
import EmployeeFamilyPolicyQuery from '@/pages/EmployeeFamilyPolicy/EmployeeFamilyPolicyQuery.vue';
import EmployeeFamilyPolicyResultTable from '@/pages/EmployeeFamilyPolicy/EmployeeFamilyPolicyResultTable.vue';
import EmployeeFamilyPolicyResultDetail from '@/pages/EmployeeFamilyPolicy/EmployeeFamilyPolicyResultDetail.vue';
import EmployeeFamilyHistoryQuery from '@/pages/EmployeeFamilyHistory/EmployeeFamilyHistoryQuery.vue';
import EmployeeFamilyHistoryResultTable from '@/pages/EmployeeFamilyHistory/EmployeeFamilyHistoryResultTable.vue';
import EmployeeFamilyHistoryResultDetail from '@/pages/EmployeeFamilyHistory/EmployeeFamilyHistoryResultDetail.vue';
import EmployeeEnrollmentApplication from '@/pages/EmployeeEnrollment/EmployeeEnrollmentApplication.vue';
import EmployeeEnrollmentComfirm from '@/pages/EmployeeEnrollment/EmployeeEnrollmentComfirm.vue';
import EmployeeEnrollmentSuccess from '@/pages/EmployeeEnrollment/EmployeeEnrollmentSuccess.vue';
import EmployeeEnrollmentFail from '@/pages/EmployeeEnrollment/EmployeeEnrollmentFail.vue';
import DataUpload from '@/pages/DatasUpload/DatasUpload.vue';
import DatasUploadEnrollment from '@/pages/DatasUpload/DatasUploadEnrollment.vue';
import DatasUploadDetail from '@/pages/DatasUpload/DatasUploadDetail.vue';
import DatasUploadContent from '@/pages/DatasUpload/DatasUploadContent.vue';
import DatasUploadResult from '@/pages/DatasUpload/DatasUploadResult.vue';
import DatasUploadSurrender from '@/pages/DatasUpload/DatasUploadSurrender.vue';
import DatasUploadSalary from '@/pages/DatasUpload/DatasUploadSalary.vue';
import DataUploadFail from '@/pages/DatasUpload/DataUploadFail.vue';
import DataUploadSuccess from '@/pages/DatasUpload/DataUploadSuccess.vue';
import EmpFamilyPolicyChangeSurrenderList from '@/pages/EmpFamilyPolicyChangeSurrender/EmpFamilyPolicyChangeSurrenderList.vue';
import EmpFamilyPolicyChangeSurrenderFail from '@/pages/EmpFamilyPolicyChangeSurrender/EmpFamilyPolicyChangeSurrenderFail.vue';
import EmpFamilyPolicyChangeSurrenderSuccess from '@/pages/EmpFamilyPolicyChangeSurrender/EmpFamilyPolicyChangeSurrenderSuccess.vue';
import EmpFamilyPolicyChangeWithoutSalaryTable from '@/pages/EmpFamilyPolicyChangeWithoutSalary/EmpFamilyPolicyChangeWithoutSalaryTable.vue';
import EmpFamilyPolicyChangeWithoutSalarySuccess from '@/pages/EmpFamilyPolicyChangeWithoutSalary/EmpFamilyPolicyChangeWithoutSalarySuccess.vue';
import EmpFamilyPolicyChangeWithoutSalaryFail from '@/pages/EmpFamilyPolicyChangeWithoutSalary/EmpFamilyPolicyChangeWithoutSalaryFail.vue';
import CoInfoTable from '@/pages/CoInfo/CoInfoTable.vue';
import EmployeeGeneralInfoChange from '@/pages/EmployeeFamilyGeneralInfoChange/EmployeeGeneralInfoChange.vue';
import FamilyGeneralInfoChange from '@/pages/EmployeeFamilyGeneralInfoChange/FamilyGeneralInfoChange.vue';
import EmployeeFamilyGeneralInfoChangeSuccess from '@/pages/EmployeeFamilyGeneralInfoChange/EmployeeFamilyGeneralInfoChangeSuccess.vue';
import EmployeeFamilyGeneralInfoChangeFail from '@/pages/EmployeeFamilyGeneralInfoChange/EmployeeFamilyGeneralInfoChangeFail.vue';
import CoInfoChange from '@/pages/CoInfo/CoInfoChange.vue';
import CoInfoConfirm from '@/pages/CoInfo/CoInfoConfirm.vue';
import CoInsuranceUnitIndex from '@/pages/CoInsuranceUnitChange/CoInsuranceUnitIndex.vue';
import CoInsuranceUnitEdit from '@/pages/CoInsuranceUnitChange/CoInsuranceUnitEdit.vue';
import CoInsuranceUnitView from '@/pages/CoInsuranceUnitChange/CoInsuranceUnitView.vue';
import Index from '@/pages/Index.vue';
import global from '@/plugins/global';
import notification from '@/plugins/info/infoNotification';
// eslint-disable-next-line import/no-cycle
import { UserService } from '@/plugins/user';
import EmployeeSalaryChange from '@/pages/EmployeeSalary/EmployeeSalaryChange.vue';
import EmployeeSalaryConfirm from '@/pages/EmployeeSalary/EmployeeSalaryConfirm.vue';
import EmployeeSalarySuccess from '@/pages/EmployeeSalary/EmployeeSalarySuccess.vue';
import EmployeeSalaryFail from '@/pages/EmployeeSalary/EmployeeSalaryFail.vue';
import TodoAllTable from '@/pages/TodoCaseSearch/TodoAllTable.vue';
import EmployeeInsuredContentChangeApplication from '@/pages/EmployeeInsuredContentChange/EmployeeInsuredContentChangeApplication.vue';
import EmployeeInsuredContentChangeComfirm from '@/pages/EmployeeInsuredContentChange/EmployeeInsuredContentChangeComfirm.vue';
import InsuredRegister from '@/pages/FileApplyWork/InsuredRegister.vue';
import SaveCardDownload from '@/pages/FileApplyWork/SaveCardDownload.vue';
import SaveCardDownloadResult from '@/pages/FileApplyWork/SaveCardDownloadResult.vue';
import SaveCostReceiptDownload from '@/pages/FileApplyWork/SaveCostReceiptDownload.vue';
import InsuredProveDownload from '@/pages/FileApplyWork/InsuredProveDownload.vue';
import InsuredProveDownloadResult from '@/pages/FileApplyWork/InsuredProveDownloadResult.vue';
import PeriodSaveCostSearch from '@/pages/FileApplyWork/PeriodSaveCostSearch.vue';
import ServiceAndBusinessStaffQuery from '@/pages/ServiceAndBusinessStaff/ServiceAndBusinessStaffQuery.vue';
import EmployeeInsuredContentChangeFail from '@/pages/EmployeeInsuredContentChange/EmployeeInsuredContentChangeFail.vue';
import EmployeeInsuredContentChangeSuccess from '@/pages/EmployeeInsuredContentChange/EmployeeInsuredContentChangeSuccess.vue';
import InsuranceClaimAreaQuery from '@/pages/InsuranceClaimArea/InsuranceClaimAreaQuery.vue';
import InsuranceClaimAreaResultTable from '@/pages/InsuranceClaimArea/InsuranceClaimAreaResultTable.vue';
import InsuranceClaimAreaExperience from '@/pages/InsuranceClaimArea/InsuranceClaimAreaExperience.vue';
import Refresh from '@/components/shared/Refresh.vue';
import AnotherFormDownload from '@/pages/FileApplyWork/AnotherFormDownload.vue';
import EmployeeInsuredContentChangeResult from '@/pages/EmployeeInsuredContentChange/EmployeeInsuredContentChangeResult.vue';
import EmployeeFamilyGeneralInfoChangeComfirm from '@/pages/EmployeeFamilyGeneralInfoChange/EmployeeFamilyGeneralInfoChangeComfirm.vue';
import CoInfoEditConfirm from '@/pages/CoInfo/CoInfoEditConfirm.vue';
import CoInfoAddConfirm from '@/pages/CoInfo/CoInfoAddConfirm.vue';
import CoInfoEdit from '@/pages/CoInfo/CoInfoEdit.vue';
import CoInfoAdd from '@/pages/CoInfo/CoInfoAdd.vue';
import MainPage from '@/pages/MainPage.vue';

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
	},
	{
		path: '/refresh',
		name: 'refresh',
		component: Refresh,
	},
	{
		path: '/registerPassword',
		name: 'LoginFirstPassword',
		component: LoginFirstPassword,
		beforeEnter(to, from, next) {
			const querySearch = window.location.search.split('&');
			const found = querySearch.find((element) => element.includes('token'));
			// 確保網址有夾帶token
			if (found !== undefined) {
				next();
			} else {
				notification.error({
					Content: '連結有誤，請至信箱重新確認',
					onCallback() {
						router.push({ name: 'LoginFirst' });
					},
				});
			}
		},
	},
	{
		path: '/register',
		name: 'LoginFirst',
		component: LoginFirst,
		beforeEnter(to, from, next) {
			const querySearch = window.location.search.split('&');
			const found = querySearch.find((element) => element.includes('token'));
			// 確保網址有夾帶token
			if (found !== undefined) {
				next();
			} else {
				notification.error({
					Content: '連結有誤，請至信箱重新確認',
					onCallback() {
						router.push({ name: 'Login' });
					},
				});
			}
		},
	},
	{ path: '/forgot', name: 'Forgot', component: Forgot },
	{
		path: '/resetPassword',
		name: 'resetPassword',
		component: ResetPassword,
		beforeEnter(to, from, next) {
			const querySearch = window.location.search.split('&');
			const found = querySearch.find((element) => element.includes('token'));
			// 確保網址有夾帶token
			if (found !== undefined) {
				next();
			} else {
				notification.error({
					Content: '連結有誤，請至信箱重新確認或重新進行忘記密碼',
					onCallback() {
						router.push({ name: 'Forgot' });
					},
				});
			}
		},
	},
	// { path: '/result', name: 'loginResult', component: LoginResult },
	{ path: '/loginResult', name: 'loginResult', component: LoginResult },
	{ path: '/changePassword', name: 'CO_ChangePassword', component: ChangePassword },
	{
		path: '/',
		name: 'index',
		redirect: '/index',
		component: EmptyRouterView,
		children: [
			{ path: '/index', name: 'CO_Index', component: Index },
			{
				path: '/employeeFamilyPolicy',
				name: 'EmployeeFamilyPolicy',
				redirect: '/employeeFamilyPolicy/employeeFamilyPolicyQuery',
				component: EmptyRouterView,
				children: [
					{
						path: 'employeeFamilyPolicyQuery',
						name: 'CO_EFPolicyQuery',
						component: EmployeeFamilyPolicyQuery,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員眷資料查詢'] },
						},
					},
					{
						path: 'employeeFamilyPolicyResultTable',
						name: 'EmployeeFamilyPolicyResultTable',
						component: EmployeeFamilyPolicyResultTable,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員眷資料查詢', '查詢結果'] },
						},
					},
					{
						path: 'employeeFamilyPolicyResultDetail',
						name: '/EmployeeFamilyPolicyResultDetail',
						component: EmployeeFamilyPolicyResultDetail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員眷資料查詢', '查詢結果', '詳細投保內容'] },
						},
					},
				],
			},
			{
				path: '/employeeFamilyHistory',
				name: 'EmployeeFamilyHistory',
				redirect: 'employeeFamilyHistory/employeeFamilyHistoryQuery',
				component: EmptyRouterView,
				children: [
					{
						path: 'employeeFamilyHistoryQuery',
						name: 'CO_EFHistoryQuery',
						component: EmployeeFamilyHistoryQuery,
						props: {
							breadcrumb: { list: ['查詢作業', '歷史線上異動資料查詢'] },
						},
					},
					{
						path: 'employeeFamilyHistoryResultTable',
						name: 'EmployeeFamilyHistoryResultTable',
						component: EmployeeFamilyHistoryResultTable,
						props: {
							breadcrumb: { list: ['查詢作業', '歷史線上異動資料查詢', '查詢結果'] },
						},
					},
					{
						path: 'employeeFamilyHistoryResultDetail',
						name: 'EmployeeFamilyHistoryResultDetail',
						component: EmployeeFamilyHistoryResultDetail,
						props: {
							breadcrumb: { list: ['查詢作業', '歷史線上異動資料查詢', '查詢結果', '詳細投保內容'] },
						},
					},
				],
			},
			{
				path: '/employeeFamilyToday',
				name: 'EmployeeFamilyToday',
				redirect: '/employeeFamilyToday/employeeFamilyTodayResultTable',
				component: EmptyRouterView,
				children: [
					{
						path: '/employeeFamilyToday/employeeFamilyTodayResultTable',
						name: 'CO_EFTodayResultTable',
						component: EmployeeFamilyHistoryResultTable,
						props: {
							breadcrumb: { list: ['查詢作業', '今日線上異動資料查詢', '查詢結果'] },
						},
					},
					{
						path: '/employeeFamilyToday/employeeFamilyTodayResultDetail',
						name: 'EmployeeFamilyTodayResultDetail',
						component: EmployeeFamilyHistoryResultDetail,
						props: {
							breadcrumb: { list: ['查詢作業', '今日線上異動資料查詢', '查詢結果', '詳細投保內容'] },
						},
					},
				],
			},
			{
				path: '/employeeEnrollment',
				name: 'EmployeeEnrollment',
				redirect: '/employeeEnrollment/employeeEnrollmentApplication',
				component: EmptyRouterView,
				children: [
					{
						path: '/employeeEnrollment/employeeEnrollmentApplication',
						name: 'CO_EEnrollmentApplication',
						component: EmployeeEnrollmentApplication,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬加保'] },
						},
					},
					{
						path: '/employeeEnrollment/employeeEnrollmentComfirm',
						name: 'EmployeeEnrollmentComfirm',
						component: EmployeeEnrollmentComfirm,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬加保', '確認投保內容'] },
						},
					},
					{
						path: '/employeeEnrollment/employeeEnrollmentSuccess',
						name: 'EmployeeEnrollmentSuccess',
						component: EmployeeEnrollmentSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬加保', '確認投保內容', '受理結果'] },
						},
					},
					{
						path: '/employeeEnrollment/employeeEnrollmentFail',
						name: 'EmployeeEnrollmentFail',
						component: EmployeeEnrollmentFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬加保', '確認投保內容', '受理結果'] },
						},
					},
				],
			},
			{
				path: '/datasUpload',
				name: 'DataUpload',
				redirect: '/datasUpload/uploadEnrollment',
				component: EmptyRouterView,
				children: [
					{
						path: '/datasUpload/uploadEnrollment',
						name: 'CO_DatasUploadEnrollment',
						component: DatasUploadEnrollment,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '加保上傳'] },
						},
					},
					{
						path: '/datasUpload/uploadSurrender',
						name: 'DatasUploadSurrender',
						component: DatasUploadSurrender,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '退保上傳'] },
						},
					},
					{
						path: '/datasUpload/uploadDetail',
						name: 'DatasUploadDetail',
						component: DatasUploadDetail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '上傳結果', '項目明細'] },
						},
					},
					{
						path: '/datasUpload/uploadContent',
						name: 'DatasUploadContent',
						component: DatasUploadContent,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '投保內容變更上傳'] },
						},
					},
					{
						path: '/datasUpload/uploadSalary',
						name: 'DatasUploadSalary',
						component: DatasUploadSalary,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '薪資變更上傳'] },
						},
					},
					{
						path: '/datasUpload/uploadResult',
						name: 'DatasUploadResult',
						component: DatasUploadResult,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '上傳結果'] },
						},
					},
					{
						path: '/datasUpload/fail',
						name: 'DataUploadFail',
						component: DataUploadFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '授權結果'] },
						},
					},
					{
						path: '/datasUpload/success',
						name: 'DataUploadSuccess',
						component: DataUploadSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '資料整批上傳', '授權結果'] },
						},
					},
				],
			},
			{
				path: '/employeeSalary',
				name: 'EmployeeSalary',
				redirect: '/employeeSalaryChange',
				component: EmptyRouterView,
				children: [
					{
						path: '/employeeSalaryChange',
						name: 'EmployeeSalaryChange',
						component: EmployeeSalaryChange,
						props: {
							breadcrumb: { list: ['員工及眷屬資料變更', '員工及眷屬資料變更', '員工薪資變更'] },
						},
					},
					{
						path: '/employeeSalaryConfirm',
						name: 'EmployeeSalaryConfirm',
						component: EmployeeSalaryConfirm,
						props: {
							breadcrumb: { list: ['員工及眷屬資料變更', '員工及眷屬資料變更', '員工薪資變更', '確認內容'] },
						},
					},
					{
						path: '/employeeSalarySuccess',
						name: 'EmployeeSalarySuccess',
						component: EmployeeSalarySuccess,
						props: {
							breadcrumb: { list: ['員工及眷屬資料變更', '員工基本資料變更', '確認內容', '受理結果'] },
						},
					},
					{
						path: '/employeeSalaryFail',
						name: 'EmployeeSalaryFail',
						component: EmployeeSalaryFail,
						props: {
							breadcrumb: { list: ['員工及眷屬資料變更', '員工基本資料變更', '確認內容', '受理結果'] },
						},
					},
				],
			},
			{
				path: '/empFamilyPolicyChange',
				name: 'EmpFamilyPolicyChange',
				redirect: '/empFamilyPolicyChangeQuery',
				component: EmptyRouterView,
				children: [
					{
						path: '/empFamilyPolicyChangeQuery',
						name: 'CO_EFPolicyChangeQuery',
						component: EmpFamilyPolicyChangeQuery,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更'] },
						},
					},
					{
						path: '/empFamilyPolicyChangeSurrender/list',
						name: 'EmpFamilyPolicyChangeSurrenderList',
						component: EmpFamilyPolicyChangeSurrenderList,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工及眷屬退保'] },
						},
					},
					{
						path: '/empFamilyPolicyChangeSurrender/success',
						name: 'EmpFamilyPolicyChangeSurrenderSuccess',
						component: EmpFamilyPolicyChangeSurrenderSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工及眷屬退保', '受理結果'] },
						},
					},
					{
						path: '/empFamilyPolicyChangeSurrender/fail',
						name: 'EmpFamilyPolicyChangeSurrenderFail',
						component: EmpFamilyPolicyChangeSurrenderFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工及眷屬退保', '受理結果'] },
						},
					},
					// 員眷基本資料變更
					{
						path: '/employeeFamilyGeneralInfoChange/employeeInfoChange',
						name: 'EmployeeGeneralInfoChange',
						component: EmployeeGeneralInfoChange,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工基本資料變更'] },
						},
					},
					{
						path: '/employeeFamilyGeneralInfoChange/employeeSuccess',
						name: 'EmployeeGeneralInfoChangeSuccess',
						component: EmployeeFamilyGeneralInfoChangeSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工基本資料變更', '確認內容', '受理結果'] },
						},
					},
					{
						path: '/employeeFamilyGeneralInfoChange/employeeFail',
						name: 'EmployeeGeneralInfoChangeFail',
						component: EmployeeFamilyGeneralInfoChangeFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工基本資料變更', '確認內容', '受理結果'] },
						},
					},
					{
						path: '/employeeFamilyGeneralInfoChange/familyInfoChange',
						name: 'FamilyGeneralInfoChange',
						component: FamilyGeneralInfoChange,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '眷屬基本資料變更'] },
						},
					},
					{
						path: '/employeeFamilyGeneralInfoChange/familySuccess',
						name: 'FamilyGeneralInfoChangeSuccess',
						component: EmployeeFamilyGeneralInfoChangeSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '眷屬基本資料變更', '確認內容', '受理結果'] },
						},
					},
					{
						path: '/employeeFamilyGeneralInfoChange/familyFail',
						name: 'FamilyGeneralInfoChangeFail',
						component: EmployeeFamilyGeneralInfoChangeFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '眷屬基本資料變更', '確認內容', '受理結果'] },
						},
					},
				],
			},
			{
				path: '/coInfo',
				name: 'CoInfo',
				redirect: '/coInfo/coInfoTable',
				component: EmptyRouterView,
				children: [
					{
						path: '/coInfo/coInfoTable',
						name: 'CO_CoInfoTable',
						component: CoInfoTable,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '承辦人基本資料'] },
						},
					},
					{
						path: '/coInfo/change',
						name: 'CoInfoChange',
						component: CoInfoChange,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '承辦人基本資料', '變更內容'] },
						},
					},
					{
						path: '/coInfo/confirm',
						name: 'CoInfoConfirm',
						component: CoInfoConfirm,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '承辦人基本資料', '變更內容'] },
						},
					},
				],
			},
			{
				path: '/coInsuranceUnit',
				name: 'CoInsuranceUnit',
				redirect: '/coInsuranceUnit/coInsuranceUnitIndex',
				component: EmptyRouterView,
				children: [
					{
						path: '/coInsuranceUnit/coInsuranceUnitIndex',
						name: 'CO_CoInsuranceUnitIndex',
						component: CoInsuranceUnitIndex,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '要保單位基本資料'] },
						},
					},
					{
						path: '/coInsuranceUnit/coInsuranceUnitEdit',
						name: 'CoInsuranceUnitEdit',
						component: CoInsuranceUnitEdit,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '要保單位基本資料', '變更內容'] },
						},
					},
					{
						path: '/coInsuranceUnit/coInsuranceUnitView',
						name: 'CoInsuranceUnitView',
						component: CoInsuranceUnitView,
						props: {
							breadcrumb: { list: ['要保基本資料作業', '要保單位基本資料', '變更內容'] },
						},
					},
				],
			},
			{
				path: '/todoCaseSearch',
				name: 'TodoCaseSearch',
				redirect: '/todoCaseSearch/todoAllTable',
				component: EmptyRouterView,
				children: [
					{
						path: '/todoCaseSearch/todoAllTable',
						name: 'CO_TodoAllTable',
						component: TodoAllTable,
						props: {
							breadcrumb: { list: ['查詢作業', '待辦案件查詢'] },
						 },
					},
				],
			},
			{
				path: '/empFamilyPolicyChangeWithoutSalary',
				name: 'EmpFamilyPolicyChangeWithoutSalary',
				redirect: '/empFamilyPolicyChangeWithoutSalary/empFamilyPolicyChangeWithoutSalaryTable',
				component: EmptyRouterView,
				children: [
					{
						path: '/empFamilyPolicyChangeWithoutSalary/empFamilyPolicyChangeWithoutSalaryTable',
						name: 'CO_EFPolicyChangeSalaryTable',
						component: EmpFamilyPolicyChangeWithoutSalaryTable,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '加保薪資登錄'] },
						},
					},
					{
						path: '/empFamilyPolicyChangeWithoutSalary/empFamilyPolicyChangeWithoutSalarySuccess',
						name: 'EmpFamilyPolicyChangeWithoutSalarySuccess',
						component: EmpFamilyPolicyChangeWithoutSalarySuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '加保薪資登錄', '受理結果'] },
						},
					},
					{
						path: '/empFamilyPolicyChangeWithoutSalary/empFamilyPolicyChangeWithoutSalaryFail',
						name: 'EmpFamilyPolicyChangeWithoutSalaryFail',
						component: EmpFamilyPolicyChangeWithoutSalaryFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '加保薪資登錄', '受理結果'] },
						},
					},
				],
			},
			{
				path: '/employeeInsuredContentChange',
				name: 'EmployeeInsuredContentChange',
				redirect: '/employeeInsuredContentChange/employeeInsuredContentChangeApplication',
				component: EmptyRouterView,
				children: [
					{
						path: '/employeeInsuredContentChange/employeeInsuredContentChangeApplication',
						name: 'EmployeeInsuredContentChangeApplication',
						component: EmployeeInsuredContentChangeApplication,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工投保內容變更'] },
						},
					},
					{
						path: '/employeeInsuredContentChange/FamilyInsuredContentChangeApplication',
						name: 'FamilyInsuredContentChangeApplication',
						component: EmployeeInsuredContentChangeApplication,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '眷屬投保內容變更'] },
						},
					},
					{
						path: '/employeeInsuredContentChange/employeeInsuredContentChangeComfirm',
						name: 'EmployeeInsuredContentChangeComfirm',
						component: EmployeeInsuredContentChangeComfirm,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工投保內容變更'] },
						},
					},
					{
						path: '/employeeInsuredContentChange/fail',
						name: 'EmployeeInsuredContentChangeFail',
						component: EmployeeInsuredContentChangeFail,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工投保內容變更', '受理結果'] },
						},
					},
					{
						path: '/employeeInsuredContentChange/success',
						name: 'EmployeeInsuredContentChangeSuccess',
						component: EmployeeInsuredContentChangeSuccess,
						props: {
							breadcrumb: { list: ['加退保申請及變更作業', '員工及眷屬資料變更', '員工投保內容變更', '受理結果'] },
						 },
					},
				],
			},
			{
				path: '/fileApplyWork',
				name: 'FileApplyWork',
				redirect: '/fileApplyWork/insuredRegister',
				component: EmptyRouterView,
				children: [
					{
						path: '/fileApplyWork/insuredRegister',
						name: 'CO_InsuredRegister',
						component: InsuredRegister,
						props: {
							breadcrumb: { list: ['文件申請作業', '投保名冊'] },
						 },
					},
					{
						path: '/fileApplyWork/saveCardDownload',
						name: 'CO_SaveCardDownload',
						component: SaveCardDownload,
						props: {
							breadcrumb: { list: ['文件申請作業', '保險證下載'] },
						 },
					},
					{
						path: '/fileApplyWork/saveCardDownload/result',
						name: 'SaveCardDownloadResult',
						component: SaveCardDownloadResult,
						props: {
							breadcrumb: { list: ['文件申請作業', '保險證下載', '查詢結果'] },
						 },
					},
					{
						path: '/fileApplyWork/saveCostReceiptDownload',
						name: 'CO_SaveCostReceiptDownload',
						component: SaveCostReceiptDownload,
						props: {
							breadcrumb: { list: ['文件申請作業', '保險費收據下載'] },
						 },
					},
					{
						path: '/fileApplyWork/insuredProveDownload',
						name: 'CO_InsuredProveDownload',
						component: InsuredProveDownload,
						props: {
							breadcrumb: { list: ['文件申請作業', '投保證明下載'] },
						 },
					},
					{
						path: '/fileApplyWork/insuredProveDownload/result',
						name: 'InsuredProveDownloadResult',
						component: InsuredProveDownloadResult,
						props: {
							breadcrumb: { list: ['文件申請作業', '投保證明下載', '查詢結果'] },
						 },
					},
					{
						path: '/fileApplyWork/periodSaveCostSearch',
						name: 'CO_PeriodSaveCostSearch',
						component: PeriodSaveCostSearch,
						props: {
							breadcrumb: { list: ['文件申請作業', '每期保費查詢'] },
						 },
					},
					{
						path: '/fileApplyWork/anotherFormDownload',
						name: 'CO_AnotherFormDownload',
						component: AnotherFormDownload,
						props: {
							breadcrumb: { list: ['文件申請作業', '其他表單下載'] },
						 },
					},
				],
			},
			{
				path: '/serviceAndBusinessStaffQuery',
				name: 'CO_ServiceAndBusinessStaffQuery',
				component: ServiceAndBusinessStaffQuery,
				props: {
					breadcrumb: { list: ['查詢作業', '服務及業務人員查詢'] },
				},
			},
			{
				path: '/insuranceClaimArea',
				name: 'InsuranceClaimArea',
				component: EmptyRouterView,
				redirect: '/insuranceClaimArea/insuranceClaimAreaQuery',
				children: [
					{
						path: '/insuranceClaimArea/insuranceClaimAreaQuery',
						name: 'CO_ICQuery',
						component: InsuranceClaimAreaQuery,
						props: {
							breadcrumb: { list: ['理賠專區', '理賠紀錄與進度'] },
						},
					},
					{
						path: '/insuranceClaimArea/insuranceClaimAreaResultTable',
						name: 'InsuranceClaimAreaResultTable',
						component: InsuranceClaimAreaResultTable,
						props: {
							breadcrumb: { list: ['理賠專區', '理賠紀錄與進度', '查詢結果'] },
						},
					},
					{
						path: '/insuranceClaimArea/insuranceClaimAreaExperience',
						name: 'CO_ICAreaExperience',
						component: InsuranceClaimAreaExperience,
						props: {
							breadcrumb: { list: ['理賠專區', '保單理賠經驗'] },
						},
					},
				],
			},
		],
		beforeEnter(to, from, next) {
			const userService: UserService = Vue.prototype.$user;
			if (!userService.hasValidToken()) {
				notification.error({
					Content: '請先登入',
					duration: 3,
				});
				next({ name: 'Login' });
			} else {
				next();
			}
		},
	},
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		}
		return { x: 0, y: 0 };
	},
});

router.beforeEach((to, from, next) => {
	Vue.prototype.beforeEnter$.next({
		to,
		from,
	});
	next();
});

export default router;
