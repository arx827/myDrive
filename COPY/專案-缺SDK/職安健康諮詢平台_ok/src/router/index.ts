import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { message } from 'ant-design-vue';
import { BehaviorSubject, Subject } from 'rxjs';
import MainPage from '@/pages/MainPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import EmptyRouterView from '@/components/shared/layout/EmptyRouterView.vue';
import Index from '@/pages/Index.vue';
import SuccessSample from '@/pages/SuccessSample.vue';
import OccupationalSafety from '@/pages/OccupationalSafety/Index/Index_main.vue';
// import DoctorConsult
import DoctorConsultIndex from '@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultIndex.vue';
import DoctorConsultReservation from '@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation.vue';
import DoctorConsultReservationStep1 from '@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step1.vue';
import DoctorConsultReservationStep2 from '@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step2.vue';
import DoctorConsultReservationStep3 from '@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step3.vue';
// import MyReservation
import MyReservationIndex from '@/pages/OccupationalSafety/DoctorConsult/MyReservation/MyReservationIndex.vue';
import MyReservationResult from '@/pages/OccupationalSafety/DoctorConsult/MyReservation/MyReservationResult.vue';
// import EventMaintain
import EventMaintainIndex from '@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainIndex.vue';
import EventMaintainEdit from '@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainEdit.vue';
// import SendNoticeModifyReserve
import SendNoticeModifyReserveIndex from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveIndex.vue';
import SendNoticeModifyReserveResult from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveResult.vue';
import SendNoticeModifyReserveConfirm from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveConfirm.vue';
import SendNoticeModifyReserveConfirmResult from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveConfirmResult.vue';
import SendNoticeModifyReserveSendResult from '@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveSendResult.vue';
import EventMaintainResult from '@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainResult.vue';
// import ServiceTimeMaintain
import ServiceTimeMaintainIndex from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainIndex.vue';
import ServiceTimeMaintainAddAndEdit from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainAddAndEdit.vue';
import ServiceTimeMaintainResult from '@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainResult.vue';
// import MyHealthReport
import MyHealthReportIndex from '@/pages/OccupationalSafety/HealthEpass/MyHealthReport/MyHealthReportIndex.vue';
// import MyRegistration
import MyRegistrationIndex from '@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationIndex.vue';
import MyRegistrationDetails from '@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationDetails.vue';
import MyRegistrationQuest from '@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationQuest.vue';
import MyRegistrationResult from '@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationResult.vue';
// import NotificationAndRecord
import NotificationAndRecordQuery from '@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordQuery.vue';
import NotificationAndRecordQueryList from '@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordQueryList.vue';
import NotificationAndRecordSendResult from '@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordSendResult.vue';
import NotificationAndRecordSendQuery from '@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordSendQuery.vue';
// EmpHealthDataExportQuery
import EmpHealthDataExportQuery from '@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataExportQuery.vue';
import EmpHealthDataIndividualList from '@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataIndividualList.vue';
import EmpHealthDataList from '@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataList.vue';
import EmpHealthDataAnalyzeList from '@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataAnalyzeList.vue';
// import MedicalStaffData
import MedicalStaffDataIndex from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataIndex.vue';
import MedicalStaffDataDoctorAddAndEdit from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataDoctorAddAndEdit.vue';
import MedicalStaffDataResult from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataResult.vue';
import MedicalStaffDataNurseDetail from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataNurseDetail.vue';
import MedicalStaffDataNurseEdit from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataNurseEdit.vue';
import MedicalStaffDataSiteAddAndEdit from '@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataSiteAddAndEdit.vue';
// import EmpHealthReport
import EmpHealthReportList from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportList.vue';
import EmpHealthReportUploadBatchResult from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportUploadBatchResult.vue';
import EmpHealthReportUploadSingleResult from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportUploadSingleResult.vue';
import EmpHealthReportAdd from '@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportAdd.vue';
// import HealthValueMaintain
import HealthValueMaintainList from '@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainList.vue';
import HealthValueMaintainAddAndEdit from '@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainAddAndEdit.vue';
import HealthValueMaintainResult from '@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainResult.vue';

import { UserService } from '@/plugins/user';
// import HealthPromote
import HealthPromoteIndex from '@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteIndex.vue';
import HealthPromoteDescrip from '@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteDescrip.vue';
import HealthPromoteResult from '@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteResult.vue';
import HealthPromoteRegister from '@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteRegister.vue';
// import HealthEduMaintain
import HealthEduMaintainIndex from '@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainIndex.vue';
import HealthEduMaintainConfirm from '@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainConfirm.vue';
import HealthEduMaintainConfirmResult from '@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainConfirmResult.vue';
// import EventContentMaintain
import EventContentMaintainIndex from '@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainIndex.vue';
import EventContentMaintainEdit from '@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainEdit.vue';
import EventContentMaintainResult from '@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainResult.vue';
// import MonthMaintain
import MonthMaintainIndex from '@/pages/OccupationalSafety/MotherHealth/MonthMaintain/MonthMaintainIndex.vue';
import MonthMaintainResult from '@/pages/OccupationalSafety/MotherHealth/MonthMaintain/MonthMaintainResult.vue';
import SendModalResult from '@/pages/OccupationalSafety/MotherHealth/MonthMaintain/SendModalResult.vue';
// import EventAndTimeMaintain
import EventAndTimeMaintainIndex from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainIndex.vue';
// import YearReport
import YearReportIndex from '@/pages/OccupationalSafety/MotherHealth/YearReport/YearReportIndex.vue';
import YearReportResult from '@/pages/OccupationalSafety/MotherHealth/YearReport/YearReportResult.vue';
// import MotherPlan
import MotherPlanIndex from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanIndex.vue';
import MotherPlanFormResult from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanFormResult.vue';
import MotherPlanPregnantForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanPregnantForm.vue';
import MotherPlanAfterForm from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanAfterForm.vue';
import MotherPlanDoctorReservation from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanDoctorReservation.vue';
// import MotherPlanDoctorReservationStep1 from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanDoctorReservation_step1.vue';
// import MotherPlanDoctorReservationStep2 from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanDoctorReservation_step2.vue';
// import MotherPlanDoctorReservationStep3 from '@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanDoctorReservation_step3.vue';
import EventAndTimeMaintainEventAddAndEdit from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit.vue';
import EventAndTimeMaintainEventAddAndEditStep1 from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step1.vue';
import EventAndTimeMaintainEventAddAndEditStep2 from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step2.vue';
import EventAndTimeMaintainEventAddAndEditStep3 from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step3.vue';
import EventAndTimeMaintainEventAddAndEditStep4 from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step4.vue';

// import EventAndTimeMaintain
import EventAndTimeMaintainRegister from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainRegister.vue';
import EventAndTimeMaintainRegisterResult from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainRegisterResult.vue';
import EventAndTimeMaintainEventDetails_eventInfo from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventInfo.vue';
import EventAndTimeMaintainEventDetails_eventTime from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventTime.vue';
import EventAndTimeMaintainEventDetails_eventRegistration from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventRegistration.vue';
import EventAndTimeMaintainPersonnelDetails from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainPersonnelDetails.vue';
import EventAndTimeMaintainResult from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainResult.vue';
import ReportAnalyze from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/ReportAnalyze.vue';
// import SatisfyQuestMaintain
import SatisfyQuestMaintainIndex from '@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainIndex.vue';
import SatisfyQuestMaintainAddAndEdit from '@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainAddAndEdit.vue';
import SatisfyQuestMaintainDetails from '@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainDetails.vue';
import SatisfyQuestMaintainResult from '@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainResult.vue';
// import StrangeEventMaintain
import StrangeEventMaintainIndex from '@/pages/OccupationalSafety/StrangePrevent/StrangeEventMaintain/StrangeEventMaintainIndex.vue';
import StrangeEventMaintainEdit from '@/pages/OccupationalSafety/StrangePrevent/StrangeEventMaintain/StrangeEventMaintainEdit.vue';
import StrangeEventMaintainResult from '@/pages/OccupationalSafety/StrangePrevent/StrangeEventMaintain/StrangeEventMaintainResult.vue';
// import BuildOverTime
import BuildOverTimeIndex from '@/pages/OccupationalSafety/StrangePrevent/BuildOverTime/BuildOverTimeIndex.vue';
import BuildOverTimeList from '@/pages/OccupationalSafety/StrangePrevent/BuildOverTime/BuildOverTimeList.vue';
import BuildOverTimeResult from '@/pages/OccupationalSafety/StrangePrevent/BuildOverTime/BuildOverTimeResult.vue';
// import QueryOverTime
import QueryOverTimeIndex from '@/pages/OccupationalSafety/StrangePrevent/QueryOverTime/QueryOverTimeIndex.vue';
import QueryOverTimeList from '@/pages/OccupationalSafety/StrangePrevent/QueryOverTime/QueryOverTimeList.vue';
import QueryOverTimeResult from '@/pages/OccupationalSafety/StrangePrevent/QueryOverTime/QueryOverTimeResult.vue';
import QueryOverTimeSendModalResult from '@/pages/OccupationalSafety/StrangePrevent/QueryOverTime/QueryOverTimeSendModalResult.vue';
// import DownLoadOverTime
import DownLoadReportIndex from '@/pages/OccupationalSafety/StrangePrevent/DownLoadReport/DownLoadReportIndex.vue';
// import RelevantScale
import RelevantScaleIndex from '@/pages/OccupationalSafety/StrangePrevent/RelevantScale/RelevantScaleIndex.vue';
import RelevantScaleForm from '@/pages/OccupationalSafety/StrangePrevent/RelevantScale/RelevantScaleForm.vue';
import RelevantScaleResult from '@/pages/OccupationalSafety/StrangePrevent/RelevantScale/RelevantScaleResult.vue';
// import RelevantSurvey
import RelevantSurveyIndex from '@/pages/OccupationalSafety/ErgonomicHazard/RelevantSurvey/RelevantSurveyIndex.vue';
import RelevantSurveyForm1 from '@/pages/OccupationalSafety/ErgonomicHazard/RelevantSurvey/RelevantSurveyForm1.vue';
import RelevantSurveyForm2 from '@/pages/OccupationalSafety/ErgonomicHazard/RelevantSurvey/RelevantSurveyForm2.vue';
import RelevantSurveyForm3 from '@/pages/OccupationalSafety/ErgonomicHazard/RelevantSurvey/RelevantSurveyForm3.vue';
import RelevantSurveyResult from '@/pages/OccupationalSafety/ErgonomicHazard/RelevantSurvey/RelevantSurveyResult.vue';
// import EventMaintain
import EHEventMaintainIndex from '@/pages/OccupationalSafety/ErgonomicHazard/EventMaintain/EventMaintainIndex.vue';
import EHEventMaintainEdit from '@/pages/OccupationalSafety/ErgonomicHazard/EventMaintain/EventMaintainEdit.vue';
import EHEventMaintainResult from '@/pages/OccupationalSafety/ErgonomicHazard/EventMaintain/EventMaintainResult.vue';
// import BuildData
import BuildDataIndex from '@/pages/OccupationalSafety/ErgonomicHazard/BuildData/BuildDataIndex.vue';
import BuildDataList from '@/pages/OccupationalSafety/ErgonomicHazard/BuildData/BuildDataList.vue';
import BuildDataResult from '@/pages/OccupationalSafety/ErgonomicHazard/BuildData/BuildDataResult.vue';
// import ReportDownload
import ReportDownLoadIndex from '@/pages/OccupationalSafety/ErgonomicHazard/ReportDownload/ReportDownLoadIndex.vue';
// import QueryData
import QueryDataIndex from '@/pages/OccupationalSafety/ErgonomicHazard/QueryData/QueryDataIndex.vue';
import QueryDataList from '@/pages/OccupationalSafety/ErgonomicHazard/QueryData/QueryDataList.vue';
import QueryDataResult from '@/pages/OccupationalSafety/ErgonomicHazard/QueryData/QueryDataResult.vue';
import QueryDataSendModalResult from '@/pages/OccupationalSafety/ErgonomicHazard/QueryData/QueryDataSendModalResult.vue';
// import MotherMyRecord
import MotherMyRecordIndex from '@/pages/OccupationalSafety/MotherHealth/MotherMyRecord/MotherMyRecordIndex.vue';
// import StrangeMyRecord
import StrangeMyRecordIndex from '@/pages/OccupationalSafety/StrangePrevent/StrangeMyRecord/StrangeMyRecordIndex.vue';
// import ErMyRecord
import ErMyRecordIndex from '@/pages/OccupationalSafety/ErgonomicHazard/ErMyRecord/ErMyRecordIndex.vue';

// import CaseMaintein
import ErgonomicHazardForm from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/ErgonomicHazardForm.vue';
import AddPersonalResume from '@/pages/OccupationalSafety/OtherOptions/CaseMaintain/AddPersonalResume.vue';
// import NurseLoginRecord
import NurseLoginRecordIndex from '@/pages/OccupationalSafety/OtherOptions/NurseLoginRecord/NurseLoginRecordIndex.vue';
import NurseLoginRecordResult from '@/pages/OccupationalSafety/OtherOptions/NurseLoginRecord/NurseLoginRecordResult.vue';
// import LoginCheckWork
import LoginCheckWorkIndex from '@/pages/OccupationalSafety/OtherOptions/LoginCheckWork/LoginCheckWorkIndex.vue';
import LoginCheckWorkResult from '@/pages/OccupationalSafety/OtherOptions/LoginCheckWork/LoginCheckWorkResult.vue';
// import AgentSetting
import AgentSettingIndex from '@/pages/OccupationalSafety/OtherOptions/AgentSetting/AgentSettingIndex.vue';
import AgentSettingResult from '@/pages/OccupationalSafety/OtherOptions/AgentSetting/AgentSettingResult.vue';

import ParamMaintainIndex from '@/pages/OccupationalSafety/OtherOptions/ParamMaintain/ParamMaintainIndex.vue';
import ParamMaintainList from '@/pages/OccupationalSafety/OtherOptions/ParamMaintain/ParamMaintainList.vue';
import ParamMaintainResult from '@/pages/OccupationalSafety/OtherOptions/ParamMaintain/ParamMaintainResult.vue';
import SigninPage from '@/pages/SigninPage.vue';

Vue.use(VueRouter);
Vue.prototype.beforeEnter$ = new BehaviorSubject<{ to: Route; from: Route }>(null);
const routes = [
	{
		path: '/login', name: 'Login', component: LoginPage, meta: { access: ['員工', '護理師'] },
	},
	{
		path: '/signin', name: 'Signin', component: SigninPage, meta: { },
	},
	{
		path: '/',
		name: 'Main',
		component: MainPage,
		redirect: '/index',
		meta: {
			access: ['員工', '護理師'],
		},
		children: [
			{
				path: '/index', name: 'MainPage', component: Index, meta: { access: ['員工', '護理師'] },
			},
			/* ----------------------------------- 健康資源系統 ------------------------------------- */
			{
				path: 'occupationSafety',
				component: EmptyRouterView,
				children: [
					/* ----------------------------------- index ------------------------------------- */
					{
						path: 'occupationalSafety/index',
						name: 'OccupationalSafety',
						component: OccupationalSafety,
						meta: {
							access: ['員工', '護理師'],
						},
					},
					/* ----------------------------------- 醫師諮詢服務 ------------------------------------- */
					{
						path: 'PhyConsult',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [員工] 醫師諮詢服務 ------------------------------------- */
							{
								path: 'doctorConsultService/index',
								name: 'DoctorConsultIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '醫師諮詢服務'],
									access: ['員工'],
								},
							},
							{
								path: 'doctorConsultService/reservation',
								name: 'DoctorConsultReservation',
								component: DoctorConsultReservation,
								redirect: 'doctorConsultService/reservation/step1',
								children: [
									/* ----------------------------------- 選擇預約時間 ------------------------------------- */
									{
										path: 'step1',
										name: 'DoctorConsultReservationStep1',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step1.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '醫師諮詢服務', '醫師諮詢服務', '選擇預約時間'],
											contentBgColor: 'mainColor__lightBlue',
											access: ['員工'],
										},
									},
									{
										path: 'step2',
										name: 'DoctorConsultReservationStep2',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step2.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '醫師諮詢服務', '醫師諮詢服務', '選擇預約時間', '基本資料填寫'],
											access: ['員工'],
										},
									},
									{
										path: 'step3',
										name: 'DoctorConsultReservationStep3',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step3.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '醫師諮詢服務', '醫師諮詢服務', '選擇預約時間', '基本資料填寫', '預約結果'],
											access: ['員工'],
										},
									},
								],
							},
							/* ----------------------------------- [員工] 我的預約 ------------------------------------- */
							{
								path: 'myReservation/index',
								name: 'MyReservationIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MyReservation/MyReservationIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '我的預約'],
									access: ['員工'],
								},
							},
							{
								path: 'myReservation/result',
								name: 'MyReservationResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MyReservation/MyReservationResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '我的預約'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [護理] 活動資訊維護 ------------------------------------- */
							{
								path: 'eventMaintain/index',
								name: 'EventMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '活動資訊維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventMaintain/edit',
								name: 'EventMaintainEdit',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainEdit.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '活動資訊維護', '編輯活動資訊'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventMaintain/result',
								name: 'EventMaintainResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/EventMaintain/EventMaintainResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '活動資訊維護', '編輯活動資訊', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 服務場次管理 ------------------------------------- */
							{
								path: 'serviceTimeMaintain/index',
								name: 'ServiceTimeMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '服務場次管理'],
									access: ['護理師'],
								},
							},
							{
								path: 'serviceTimeMaintain/:type',
								name: 'ServiceTimeMaintainAddAndEdit',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainAddAndEdit.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫師諮詢服務', '服務場次管理', '新增服務場次'],
										edit: ['健康資源系統', '醫師諮詢服務', '服務場次管理', '編輯服務場次'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'serviceTimeMaintain/:type/result',
								name: 'ServiceTimeMaintainResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/ServiceTimeMaintain/ServiceTimeMaintainResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫師諮詢服務', '服務場次管理', '新增服務場次', '執行結果'],
										edit: ['健康資源系統', '醫師諮詢服務', '服務場次管理', '編輯服務場次', '執行結果'],
										release: ['健康資源系統', '醫師諮詢服務', '服務場次管理', '發布多場次'],
									},
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 發送通知與修改預約 ------------------------------------- */
							{
								path: 'sendNoticeModifyReserve/index',
								name: 'SendNoticeModifyReserveIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約'],
									access: ['護理師'],
								},
							},
							{
								path: 'sendNoticeModifyReserve/result',
								name: 'SendNoticeModifyReserveResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'sendNoticeModifyReserve/:type',
								name: 'SendNoticeModifyReserveConfirm',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveConfirm.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果', '新增預約資訊'],
										edit: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果', '編輯預約資訊'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'sendNoticeModifyReserve/:type/result',
								name: 'SendNoticeModifyReserveConfirmResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveConfirmResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果', '新增預約資訊'],
										edit: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果', '編輯預約資訊'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'sendNoticeModifyReserve/send/result',
								name: 'SendNoticeModifyReserveSendResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/SendNoticeModifyReserve/SendNoticeModifyReserveSendResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫師諮詢服務', '發送通知與修改預約', '查詢結果', '發送提醒通知'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 醫護人員資訊維護 ------------------------------------- */
							{
								path: 'medicalStaffData/index',
								name: 'MedicalStaffDataIndex',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/doctor/:type',
								name: 'MedicalStaffDataDoctorAddAndEdit',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataDoctorAddAndEdit.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '新增醫護人員資訊'],
										edit: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯醫護人員資訊'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/doctor/:type/result',
								name: 'MedicalStaffDataDoctorResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '新增醫護人員資訊', '執行結果'],
										edit: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯醫護人員資訊', '執行結果'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/nurse/detail',
								name: 'MedicalStaffDataNurseDetail',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataNurseDetail.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '護理人員資訊'],
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/nurse/edit',
								name: 'MedicalStaffDataNurseEdit',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataNurseEdit.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯護理人員資訊'],
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/nurse/result',
								name: 'MedicalStaffDataNurseResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯護理人員資訊', '執行結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/site/:type',
								name: 'MedicalStaffDataSiteAddAndEdit',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataSiteAddAndEdit.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '新增職場大樓資訊'],
										edit: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯職場大樓資訊'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'medicalStaffData/site/:type/result',
								name: 'MedicalStaffDataSiteResult',
								component: () => import('@/pages/OccupationalSafety/DoctorConsult/MedicalStaffData/MedicalStaffDataResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '新增職場大樓資訊', '執行結果'],
										edit: ['健康資源系統', '醫生諮詢服務', '醫護人員資訊維護', '編輯職場大樓資訊', '執行結果'],
									},
									access: ['護理師'],
								},
							},
						],
					},
					/* ----------------------------------- 推動健康促進 ------------------------------------- */
					{
						path: 'HealthAct',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [員工] 我的報名 ------------------------------------- */
							{
								path: 'myRegistration/index',
								name: 'MyRegistrationIndex',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '我的報名'],
									access: ['員工'],
								},
							},
							{
								path: 'myRegistration/details',
								name: 'MyRegistrationDetails',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationDetails.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '我的報名', '報名資料'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [員工] 滿意度問卷 ------------------------------------- */
							{
								path: 'myRegistration/quest',
								name: 'MyRegistrationQuest',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationQuest.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '我的報名', '填寫滿意度問卷'],
									access: ['員工'],
								},
							},
							{
								path: 'myRegistration/result',
								name: 'MyRegistrationResult',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/MyRegistration/MyRegistrationResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '我的報名', '填寫滿意度問卷', '執行結果'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [員工] 健康促進服務 ------------------------------------- */
							{
								path: 'healthPromote/index',
								name: 'HealthPromoteIndex',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '健康促進服務'],
									access: ['員工'],
								},
							},
							{
								path: 'healthPromote/descrip',
								name: 'HealthPromoteDescrip',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteDescrip.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '健康促進服務', '活動資訊'],
									access: ['員工'],
								},
							},
							{
								path: 'healthPromote/register',
								name: 'HealthPromoteRegister',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteRegister.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '健康促進服務', '活動資訊', '我要報名'],
									access: ['員工'],
								},
							},
							{
								path: 'healthPromote/result',
								name: 'HealthPromoteResult',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/HealthPromoteResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '健康促進服務', '活動資訊', '我要報名', '執行結果'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [護理] 活動與場次維護 ------------------------------------- */
							{
								path: 'eventAndTimeMaintain/index',
								name: 'EventAndTimeMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventAndTimeMaintain/event/:type',
								name: 'EventAndTimeMaintainEventAddAndEdit',
								component: EventAndTimeMaintainEventAddAndEdit,
								redirect: 'eventAndTimeMaintain/event/:type/step1',
								children: [
									/* ----------------------------------- 新增 / 修改 活動內容 - 活動頁設定 ------------------------------------- */
									{
										path: 'step1',
										name: 'EventAndTimeMaintainEventAddAndEditStep1',
										component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step1.vue'),
										meta: {
											breadcrumb: {
												add: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增活動與場次'],
												edit: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容', '編輯活動與場次'],
											},
											access: ['護理師'],
										},
									},
									{
										path: 'step2',
										name: 'EventAndTimeMaintainEventAddAndEditStep2',
										component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step2.vue'),
										meta: {
											breadcrumb: {
												add: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增活動與場次'],
												edit: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容', '編輯活動與場次'],
											},
											access: ['護理師'],
										},
									},
									{
										path: 'step3',
										name: 'EventAndTimeMaintainEventAddAndEditStep3',
										component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step3.vue'),
										meta: {
											breadcrumb: [{
												add: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增活動與場次'],
												edit: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容', '編輯活動與場次'],
											}],
											access: ['護理師'],
										},
									},
									{
										path: 'step4',
										name: 'EventAndTimeMaintainEventAddAndEditStep4',
										component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit_step4.vue'),
										meta: {
											breadcrumb: [{
												add: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增活動與場次', '執行結果'],
											 	edit: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容', '編輯活動與場次', '執行結果'],
											}],
											access: ['護理師'],
										},
									},
								],
							},
							// 活動內容：活動頁
							{
								path: 'eventAndTimeMaintain/eventDetails/eventInfo',
								name: 'EventAndTimeMaintainEventDetails_eventInfo',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventInfo.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容'],
									access: ['護理師'],
								},
							},
							// 活動內容：報名場次頁
							{
								path: 'eventAndTimeMaintain/eventDetails/eventTime',
								name: 'EventAndTimeMaintainEventDetails_eventTime',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventTime.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容'],
									access: ['護理師'],
								},
							},
							// 活動內容：報名表頁
							{
								path: 'eventAndTimeMaintain/eventDetails/eventRegistration',
								name: 'EventAndTimeMaintainEventDetails_eventRegistration',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventDetails_eventRegistration.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '活動內容'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventAndTimeMaintain/personnelDetails',
								name: 'EventAndTimeMaintainPersonnelDetails',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainPersonnelDetails.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '場次內容'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventAndTimeMaintain/register/:type',
								name: 'EventAndTimeMaintainRegister',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainRegister.vue'),
								meta: {
									access: ['護理師'],
									breadcrumb: {
										edit: ['健康資源系統', '推動健康促進', '活動與場次維護', '場次內容', '編輯人員報名資訊'],
										add: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增報名'],
									},
								},
							},
							{
								path: 'eventAndTimeMaintain/register/result',
								name: 'EventAndTimeMaintainRegisterResult',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainRegisterResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '新增報名', '執行結果'],
									access: ['護理師'],
								},
							},
							// 場次內容
							{
								path: 'eventAndTimeMaintain/result',
								name: 'EventAndTimeMaintainResult',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '場次內容', '編輯人員報名資訊', '執行結果'],
									access: ['護理師'],
								},
							},
							// 報表分析
							{
								path: 'eventAndTimeMaintain/report',
								name: 'ReportAnalyze',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/ReportAnalyze.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '活動與場次維護', '報表分析'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 滿意度問卷維護 ------------------------------------- */
							{
								path: 'satisfyQuestMaintain/index',
								name: 'SatisfyQuestMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '滿意度問卷維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'satisfyQuestMaintain/:type(add|edit)',
								name: 'SatisfyQuestMaintainAddAndEdit',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainAddAndEdit.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '推動健康促進', '滿意度問卷維護', '新增問卷'],
										edit: ['健康資源系統', '推動健康促進', '滿意度問卷維護', '滿意度問卷內容', '編輯滿意度問卷'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'satisfyQuestMaintain/details',
								name: 'SatisfyQuestMaintainDetails',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainDetails.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '推動健康促進', '滿意度問卷維護', '滿意度問卷內容'],
									access: ['護理師'],
								},
							},
							{
								path: 'satisfyQuestMaintain/:type/result',
								name: 'SatisfyQuestMaintainResult',
								component: () => import('@/pages/OccupationalSafety/PushHealthPromote/SatisfyQuestMaintain/SatisfyQuestMaintainResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '推動健康促進', '滿意度問卷維護', '新增問卷', '執行結果'],
										edit: ['健康資源系統', '推動健康促進', '滿意度問卷維護', '滿意度問卷內容', '編輯滿意度問卷', '執行結果'],
									},
									access: ['護理師'],
								},
							},

						],
					},
					/* ----------------------------------- 健康快e通 ------------------------------------- */
					{
						path: 'HealthCheck',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [員工] 我的健檢資訊 ------------------------------------- */
							{
								path: 'myHealthReport/index',
								name: 'MyHealthReportIndex',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/MyHealthReport/MyHealthReportIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '我的健檢資料'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [護理] 健檢數值維護 ------------------------------------- */
							{
								path: 'healthValueMaintain/list',
								name: 'HealthValueMaintainList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '健檢數值維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'healthValueMaintain/:type',
								name: 'HealthValueMaintainAddAndEdit',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainAddAndEdit.vue'),
								meta: {
									breadcrumb: {
										edit: ['健康資源系統', '健康快e通', '健檢數值維護', '編輯健檢數值'],
										add: ['健康資源系統', '健康快e通', '健檢數值維護', '新增健檢數值'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'healthValueMaintain/:type/result',
								name: 'HealthValueMaintainResult',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/HealthValueMaintain/HealthValueMaintainResult.vue'),
								meta: {
									breadcrumb: {
										edit: ['健康資源系統', '健康快e通', '健檢數值維護', '編輯健檢數值', '執行結果'],
										add: ['健康資源系統', '健康快e通', '健檢數值維護', '新增健檢數值', '執行結果'],
									},
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 發送通知與紀錄 ------------------------------------- */
							{
								path: 'notificationAndRecord/query',
								name: 'NotificationAndRecordQuery',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordQuery.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '發送通知與紀錄'],
									access: ['護理師'],
								},
							},
							{
								path: 'notificationAndRecord/list',
								name: 'NotificationAndRecordQueryList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordQueryList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '發送通知與紀錄', '查詢結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'notificationAndRecord/result',
								name: 'NotificationAndRecordSendResult',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordSendResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '發送通知與紀錄', '查詢結果', '執行結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'notificationAndRecord/sendQuery',
								name: 'NotificationAndRecordSendQuery',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/NotificationAndRecord/NotificationAndRecordSendQuery.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '發送通知與紀錄', '查詢發送紀錄'],
									access: ['護理師'],
								},
							},
							/* -------------------------------------- [護理] 建立員工健檢資料 -------------------------------*/
							{
								path: 'empHealthReport/list',
								name: 'EmpHealthReportList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '建立員工健檢資料'],
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthReport/batchResult',
								name: 'EmpHealthReportUploadBatchResult',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportUploadBatchResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '建立員工健檢資料', '執行結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthReport/:type',
								name: 'EmpHealthReportAdd',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportAdd.vue'),
								meta: {
									breadcrumb: {
										edit: ['健康資源系統', '健康快e通', '建立員工健檢資料', '單筆建檔'],
										add: ['健康資源系統', '健康快e通', '建立員工健檢資料', '單筆建檔'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthReport/singleResult',
								name: 'EmpHealthReportUploadSingleResult',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthReport/EmpHealthReportUploadSingleResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '建立員工健檢資料', '單筆建檔', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 員工健檢資料匯出 ------------------------------------- */
							{
								path: 'empHealthDataExport/query',
								name: 'EmpHealthDataExportQuery',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataExportQuery.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '員工健檢資料匯出'],
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthDataExport/individual/list',
								name: 'EmpHealthDataIndividualList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataIndividualList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '員工健檢資料匯出', '員工健檢資料 (依個人)'],
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthDataExport/data/list',
								name: 'EmpHealthDataList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '員工健檢資料匯出', '員工健檢資料 (依資料)'],
									access: ['護理師'],
								},
							},
							{
								path: 'empHealthDataExport/analyze/list',
								name: 'EmpHealthDataAnalyzeList',
								component: () => import('@/pages/OccupationalSafety/HealthEpass/EmpHealthDataExport/EmpHealthDataAnalyzeList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '健康快e通', '員工健檢資料匯出', '十大異常分析'],
									access: ['護理師'],
								},
							},
						],
					},
					/* ----------------------------------- 其他 ------------------------------------- */
					{
						path: 'Other',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [護理] 通知內容維護 ------------------------------------- */
							{
								path: 'healthEduMaintain/index',
								name: 'HealthEduMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '通知內容維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'healthEduMaintain/:type',
								name: 'HealthEduMaintainConfirm',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainConfirm.vue'),
								meta: {
									breadcrumb: {
										addHEItem: ['健康資源系統', '其他', '通知內容維護', '新增衛教項目'],
										editHEItem: ['健康資源系統', '其他', '通知內容維護', '編輯衛教項目'],
										addDocItem: ['健康資源系統', '其他', '通知內容維護', '新增醫師諮詢項目'],
										editDocItem: ['健康資源系統', '其他', '通知內容維護', '編輯醫師諮詢項目'],
										addFormItem: ['健康資源系統', '其他', '通知內容維護', '新增表單通知項目'],
										editFormItem: ['健康資源系統', '其他', '通知內容維護', '編輯表單通知項目'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'healthEduMaintain/:type/result',
								name: 'HealthEduMaintainConfirmResult',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainConfirmResult.vue'),
								meta: {
									breadcrumb: {
										addHE: ['健康資源系統', '其他', '通知內容維護', '新增衛教項目', '執行結果'],
										editHE: ['健康資源系統', '其他', '通知內容維護', '編輯衛教項目', '執行結果'],
										addDoc: ['健康資源系統', '其他', '通知內容維護', '新增醫師諮詢項目', '執行結果'],
										editDoc: ['健康資源系統', '其他', '通知內容維護', '編輯醫師諮詢項目', '執行結果'],
										addForm: ['健康資源系統', '其他', '通知內容維護', '新增表單通知項目', '執行結果'],
										editForm: ['健康資源系統', '其他', '通知內容維護', '編輯表單通知項目', '執行結果'],
									},
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 個案維護 ------------------------------------- */
							{
								path: 'caseMaintain/index',
								name: 'CaseMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/list',
								name: 'CaseMaintainList',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/addPersonalResume/:type',
								name: 'CaseMaintainAddPersonalResume',
								component: AddPersonalResume,
								meta: {
									access: ['護理師'],
									breadcrumb: {
										abnormal: ['健康資源系統', '其他', '個案維護', '查詢結果', '新增個人歷程'],
										mother: ['健康資源系統', '其他', '個案維護', '查詢結果', '新增個人歷程'],
									},
								},
							},
							{
								path: 'caseMaintain/list/workEnv',
								name: 'CaseMaintainWorkEnv',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainWorkEnv.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '作業環境評估表'],
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/list/talkNote',
								name: 'CaseMaintainTalkNote',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainTalkNote.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '面談紀錄'],
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/list/workFit',
								name: 'CaseMaintainWorkFit',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainWorkFit.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '工作適性安排建議表'],
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/:type/result',
								name: 'CaseMaintainResult',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/CaseMaintainResult.vue'),
								meta: {
									breadcrumb: {
										list: ['健康資源系統', '其他', '個案維護', '查詢結果', '執行結果'],
										email: ['健康資源系統', '其他', '個案維護', '查詢結果', '執行結果'],
										add: ['健康資源系統', '其他', '個案維護', '查詢結果', '新增個人歷程', '執行結果'],
										workEnv: ['健康資源系統', '其他', '個案維護', '查詢結果', '作業環境評估表', '執行結果'],
										talkNote: ['健康資源系統', '其他', '個案維護', '查詢結果', '面談紀錄', '執行結果'],
										workFit: ['健康資源系統', '其他', '個案維護', '查詢結果', '工作適性安排建議表', '執行結果'],
										docTalkForm: ['健康資源系統', '其他', '個案維護', '查詢結果', '醫師面談結果及採行措施表', '執行結果'],
										ergonomicForm: ['健康資源系統', '其他', '個案維護', '查詢結果', '簡易人因工程檢核表', '執行結果'],
									},
									access: ['護理師'],
								},
							},
							{
								path: 'caseMaintain/docTalkForm/:type',
								name: 'CaseMaintainDocTalkForm',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/CaseMaintain/Overload/DocTalkForm.vue'),
								meta: {
									access: ['護理師'],
									breadcrumb: {
										edit: ['健康資源系統', '其他', '個案維護', '查詢結果', '醫師面談結果及採行措施表'],
										add: ['健康資源系統', '其他', '個案維護', '查詢結果', '醫師面談結果及採行措施表'],
									},
								},
							},
							{
								path: 'caseMaintain/reservation',
								name: 'CaseMaintainReservation',
								component: DoctorConsultReservation,
								redirect: 'caseMaintain/reservation/step1',
								children: [
									{
										path: 'step1',
										name: 'CaseMaintainReservationStep1',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step1.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '預約諮詢'],
											contentBgColor: 'mainColor__lightBlue',
											access: ['護理師'],
										},
									},
									{
										path: 'step2',
										name: 'CaseMaintainReservationStep2',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step2.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '預約諮詢'],
											access: ['護理師'],
										},
									},
									{
										path: 'step3',
										name: 'CaseMaintainReservationStep3',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step3.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '預約諮詢', '執行結果'],
											access: ['護理師'],
										},
									},
								],
							},
							{
								path: 'caseMaintain/ergonomiHazardForm',
								name: 'CaseMaintainErgonomicForm',
								component: ErgonomicHazardForm,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '個案維護', '查詢結果', '簡易人因工程檢核表'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 登入紀錄------------------------------------- */
							{
								path: 'nurseLoginRecord/index',
								name: 'NurseLoginRecordIndex',
								component: NurseLoginRecordIndex,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '護理師登入紀錄'],
									access: ['護理師'],
								},
							},
							{
								path: 'nurseLoginRecord/result',
								name: 'NurseLoginRecordResult',
								component: NurseLoginRecordResult,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '護理師登入紀錄', '查詢結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- 使用者維護 ------------------------------------- */
							{
								path: 'userMaintain/index',
								name: 'UserMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '使用者維護'],
								},
							},
							{
								path: 'userMaintain/list',
								name: 'UserMaintainList',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainList.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '使用者維護', '查詢結果'],
								},
							},
							{
								path: 'userMaintain/:type/result',
								name: 'UserMaintainResult',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/UserMaintain/UserMaintainResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '使用者維護', '執行結果'],
								},
							},
							/* ----------------------------------- [護理] 登入覆核作業------------------------------------- */
							{
								path: 'loginCheckWork/index',
								name: 'LoginCheckWorkIndex',
								component: LoginCheckWorkIndex,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '登入覆核作業'],
								},
							},
							{
								path: 'loginCheckWork/:type/result',
								name: 'LoginCheckWorkResult',
								component: LoginCheckWorkResult,
								meta: {
									breadcrumb: {
										check: ['健康資源系統', '其他', '登入覆核作業', '執行結果'],
										back: ['健康資源系統', '其他', '登入覆核作業', '執行結果'],
									},
								},
							},
							/* ----------------------------------- [護理] 代理人設定------------------------------------- */
							{
								path: 'agentSetting/index',
								name: 'AgentSettingIndex',
								component: AgentSettingIndex,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '代理人設定'],
								},
							},
							{
								path: 'agentSetting/:type/result',
								name: 'AgentSettingResult',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/AgentSetting/AgentSettingResult.vue'),
								meta: {
									breadcrumb: {
										add: ['健康資源系統', '其他', '代理人設定', '執行結果'],
										edit: ['健康資源系統', '其他', '代理人設定', '執行結果'],
									},
								},
							},
							/* ----------------------------------- [護理] 角色維護------------------------------------- */
							{
								path: 'roleMaintain/index',
								name: 'RoleMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/RoleMaintain/RoleMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '其他', '角色維護'],
								},
							},
							{
								path: 'roleMaintain/:type/result',
								name: 'RoleMaintainResult',
								component: () => import('@/pages/OccupationalSafety/OtherOptions/RoleMaintain/RoleMaintainResult.vue'),
								meta: {
									breadcrumb: {
										back: ['健康資源系統', '其他', '角色維護', '執行結果'],
										add: ['健康資源系統', '其他', '角色維護', '執行結果'],
										edit: ['健康資源系統', '其他', '角色維護', '執行結果'],
										check: ['健康資源系統', '其他', '角色維護', '執行結果'],
									},
								},
							},
							{
								path: 'paramMaintain/index',
								name: 'ParamMaintainIndex',
								component: ParamMaintainIndex,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '參數維護'],
								},
							},
							{
								path: 'paramMaintain/list',
								name: 'ParamMaintainList',
								component: ParamMaintainList,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '參數維護'],
								},
							},
							{
								path: 'paramMaintain/:type/result',
								name: 'ParamMaintainResult',
								component: ParamMaintainResult,
								meta: {
									breadcrumb: ['健康資源系統', '其他', '參數維護', '執行結果'],
								},
							},
						],
					},
					/* ----------------------------------- 母性健康保護 ------------------------------------- */
					{
						path: 'MaternalProtect',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [護理] 活動內容維護 ------------------------------------- */
							{
								path: 'eventContentMaintain/index',
								name: 'EventContentMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '活動內容維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventContentMaintain/edit',
								name: 'EventContentMaintainEdit',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainEdit.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '活動內容維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'eventContentMaintain/result',
								name: 'EventContentMaintainResult',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/EventContentMaintain/EventContentMaintainResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '活動內容維護'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 當月維護 ------------------------------------- */
							{
								path: 'monthMaintain/index',
								name: 'MonthMaintainIndex',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MonthMaintain/MonthMaintainIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '當月維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'monthMaintain/result',
								name: 'MonthMaintainResult',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MonthMaintain/MonthMaintainResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '當月維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'monthMaintain/sendModal/result',
								name: 'SendModalResult',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MonthMaintain/SendModalResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '當月維護'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 年度紀錄與報表 ------------------------------------- */
							{
								path: 'yearReport/index',
								name: 'YearReportIndex',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/YearReport/YearReportIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '年度紀錄與報表'],
									access: ['護理師'],
								},
							},
							{
								path: 'yearReport/result',
								name: 'YearReportResult',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/YearReport/YearReportResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '年度紀錄與報表', '查詢結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [員工] 母性健康計畫 ------------------------------------- */
							{
								path: 'motherPlan/index',
								name: 'MotherPlanIndex',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanIndex.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫'],
									access: ['員工'],
									nacy: 'false',
								},
							},
							{
								path: 'motherPlan/formResult',
								name: 'MotherPlanFormResult',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanFormResult.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫', '執行結果'],
									access: ['員工'],
								},
							},
							{
								path: 'motherPlan/motherPregnantForm',
								name: 'MotherPlanPregnantForm',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanPregnantForm.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫'],
									access: ['員工'],
								},
							},
							{
								path: 'motherPlan/motherAfterForm',
								name: 'MotherPlanAfterForm',
								component: () => import('@/pages/OccupationalSafety/MotherHealth/MotherPlan/MotherPlanAfterForm.vue'),
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫'],
									access: ['員工'],
								},
							},
							{
								path: 'motherPlan/reservation',
								name: 'MotherPlanDoctorReservation',
								component: MotherPlanDoctorReservation,
								redirect: 'motherPlan/reservation/step1',
								children: [
									/* ----------------------------------- 選擇預約時間 ------------------------------------- */
									{
										path: 'step1',
										name: 'MotherPlanDoctorReservationStep1',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step1.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫', '預約諮詢'],
											contentBgColor: 'mainColor__lightBlue',
											access: ['員工'],
										},
									},
									{
										path: 'step2',
										name: 'MotherPlanDoctorReservationStep2',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step2.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫', '預約諮詢'],
											access: ['員工'],
										},
									},
									{
										path: 'step3',
										name: 'MotherPlanDoctorReservationStep3',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step3.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '母性健康保護', '母性健康計畫', '表單填寫', '預約諮詢', '執行結果'],
											access: ['員工'],
										},
									},
								],
							},
							/* ----------------------------------- [員工] 我的填寫紀錄 ------------------------------------- */
							{
								path: 'motherMyRecord/index',
								name: 'MotherMyRecordIndex',
								component: MotherMyRecordIndex,
								meta: {
									breadcrumb: ['健康資源系統', '母性健康保護', '我的填寫紀錄'],
									access: ['員工'],
								},
							},
						],
					},
					/* ----------------------------------- 異常負荷預防 ------------------------------------- */
					{
						path: 'AbnormalLoad',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [員工] 相關量表填寫 ------------------------------------- */
							{
								path: 'relevantScale/index',
								name: 'RelevantScaleIndex',
								component: RelevantScaleIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '相關量表填寫'],
									access: ['員工'],
								},
							},
							{
								path: 'relevantScale/form',
								name: 'RelevantScaleForm',
								component: RelevantScaleForm,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '相關量表填寫', '填寫量表'],
									access: ['員工'],
								},
							},
							{
								path: 'relevantScale/form/result',
								name: 'RelevantScaleResult',
								component: RelevantScaleResult,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '相關量表填寫', '填寫量表', '執行結果'],
									access: ['員工'],
								},
							},
							/* ----------------------------------- [護理] 活動內容維護 ------------------------------------- */
							{
								path: 'strangeEventMaintain/index',
								name: 'StrangeEventMaintainIndex',
								component: StrangeEventMaintainIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '活動內容維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'strangeEventMaintain/edit',
								name: 'StrangeEventMaintainEdit',
								component: StrangeEventMaintainEdit,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '活動內容維護', '編輯活動內容'],
									access: ['護理師'],
								},
							},
							{
								path: 'strangeEventMaintain/result',
								name: 'StrangeEventMaintainResult',
								component: StrangeEventMaintainResult,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '活動內容維護', '編輯活動內容', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 建立加班人員名單 ------------------------------------- */
							{
								path: 'buildOverTime/index',
								name: 'BuildOverTimeIndex',
								component: BuildOverTimeIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '建立加班人員名單'],
									access: ['護理師'],
								},
							},
							{
								path: 'buildOverTime/list',
								name: 'BuildOverTimeList',
								component: BuildOverTimeList,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '建立加班人員名單', '上傳名單列表'],
									access: ['護理師'],
								},
							},
							{
								path: 'buildOverTime/result',
								name: 'BuildOverTimeResult',
								component: BuildOverTimeResult,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '建立加班人員名單', '上傳名單列表', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 人員名單查詢 ------------------------------------- */
							{
								path: 'queryOverTime/index',
								name: 'QueryOverTimeIndex',
								component: QueryOverTimeIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '人員名單查詢'],
									access: ['護理師'],
								},
							},
							{
								path: 'queryOverTime/list',
								name: 'QueryOverTimeList',
								component: QueryOverTimeList,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '人員名單查詢', '查詢結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'queryOverTime/result',
								name: 'QueryOverTimeResult',
								component: QueryOverTimeResult,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '人員名單查詢', '查詢結果', '執行結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'queryOverTime/sendModal/result',
								name: 'QueryOverTimeSendModalResult',
								component: QueryOverTimeSendModalResult,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '人員名單查詢', '查詢結果', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 報表查詢下載 ------------------------------------- */
							{
								path: 'downLoadReport/index',
								name: 'DownLoadReportIndex',
								component: DownLoadReportIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '報表查詢下載'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- 我的填寫紀錄 ------------------------------------- */
							{
								path: 'strangeMyRecord/index',
								name: 'StrangeMyRecordIndex',
								component: StrangeMyRecordIndex,
								meta: {
									breadcrumb: ['健康資源系統', '異常負荷預防', '我的填寫紀錄'],
									access: ['員工'],
								},
							},
						],
					},
					/* ----------------------------------- 人因危害預防 ------------------------------------- */
					{
						path: 'ErgonomicHazard',
						component: EmptyRouterView,
						children: [
							/* ----------------------------------- [員工] 相關問卷填寫 ------------------------------------- */
							{
								path: 'RelevantSurvey/index',
								name: 'RelevantSurveyIndex',
								component: RelevantSurveyIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫'],
									access: ['員工'],
								},
							},
							{
								path: 'RelevantSurvey/form1',
								name: 'RelevantSurveyForm1',
								component: RelevantSurveyForm1,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷'],
									access: ['員工'],
								},
							},
							{
								path: 'RelevantSurvey/form2',
								name: 'RelevantSurveyForm2',
								component: RelevantSurveyForm2,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷'],
									access: ['員工'],
								},
							},
							{
								path: 'RelevantSurvey/form3',
								name: 'RelevantSurveyForm3',
								component: RelevantSurveyForm3,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷'],
									access: ['員工'],
								},
							},
							{
								path: 'RelevantSurvey/form/result',
								name: 'RelevantSurveyResult',
								component: RelevantSurveyResult,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷', '執行結果'],
									access: ['員工'],
								},
							},
							{
								path: 'RelevantSurvey/reservation',
								name: 'RelevantSurveyReservation',
								component: DoctorConsultReservation,
								redirect: 'RelevantSurvey/reservation/step1',
								children: [
									{
										path: 'step1',
										name: 'RelevantSurveyReservationStep1',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step1.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷', '預約諮詢'],
											contentBgColor: 'mainColor__lightBlue',
											access: ['員工'],
										},
									},
									{
										path: 'step2',
										name: 'RelevantSurveyReservationStep2',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step2.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷', '預約諮詢'],
											access: ['員工'],
										},
									},
									{
										path: 'step3',
										name: 'RelevantSurveyReservationStep3',
										component: () => import('@/pages/OccupationalSafety/DoctorConsult/DoctorConsultService/DoctorConsultReservation_step3.vue'),
										meta: {
											breadcrumb: ['健康資源系統', '人因危害預防', '相關問卷填寫', '填寫問卷', '預約諮詢', '執行結果'],
											access: ['員工'],
										},
									},
								],
							},
							/* ----------------------------------- [護理] 活動內容維護 ------------------------------------- */
							{
								path: 'EHEventMaintain/index',
								name: 'EHEventMaintainIndex',
								component: EHEventMaintainIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '活動內容維護'],
									access: ['護理師'],
								},
							},
							{
								path: 'EHEventMaintain/edit',
								name: 'EHEventMaintainEdit',
								component: EHEventMaintainEdit,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '活動內容維護', '編輯活動內容'],
									access: ['護理師'],
								},
							},
							{
								path: 'EHEventMaintain/result',
								name: 'EHEventMaintainResult',
								component: EHEventMaintainResult,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '活動內容維護', '編輯活動內容', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 建立人因危害資料 ------------------------------------- */
							{
								path: 'BuildData/index',
								name: 'BuildDataIndex',
								component: BuildDataIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '建立人因危害資料'],
									access: ['護理師'],
								},
							},
							// {
							// 	path: 'BuildData/list',
							// 	name: 'BuildDataList',
							// 	component: BuildDataList,
							// 	meta: {
							// 		breadcrumb: ['健康資源系統', '人因危害預防', '建立人因危害資料', '上傳資料列表'],
							// 		access: ['護理師'],
							// 	},
							// },
							{
								path: 'BuildData/result',
								name: 'BuildDataResult',
								component: BuildDataResult,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '建立人因危害資料', '上傳資料列表', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 人因危害資料查詢 ------------------------------------- */
							{
								path: 'QueryData/index',
								name: 'QueryDataIndex',
								component: QueryDataIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '人因危害資料查詢'],
									access: ['護理師'],
								},
							},
							{
								path: 'QueryData/list',
								name: 'QueryDataList',
								component: QueryDataList,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '人因危害資料查詢', '查詢結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'QueryData/result',
								name: 'QueryDataResult',
								component: QueryDataResult,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '人因危害資料查詢', '查詢結果', '執行結果'],
									access: ['護理師'],
								},
							},
							{
								path: 'QueryData/sendModal/result',
								name: 'QueryDataSendModalResult',
								component: QueryDataSendModalResult,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '人因危害資料查詢', '查詢結果', '執行結果'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- [護理] 報表查詢下載 ------------------------------------- */
							{
								path: 'ReportDownLoad/index',
								name: 'ReportDownLoadIndex',
								component: ReportDownLoadIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '報表查詢下載'],
									access: ['護理師'],
								},
							},
							/* ----------------------------------- 我的填寫紀錄 ------------------------------------- */
							{
								path: 'ErMyRecord/index',
								name: 'ErMyRecordIndex',
								component: ErMyRecordIndex,
								meta: {
									breadcrumb: ['健康資源系統', '人因危害預防', '我的填寫紀錄'],
									access: ['員工'],
								},
							},
						],
					},
				],
			},
			{
				path: '*',
				redirect: '/index',
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
