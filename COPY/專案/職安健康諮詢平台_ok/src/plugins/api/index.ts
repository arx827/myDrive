import axios from 'axios';
import {
	Configuration,
	MenuApi, MenuApiFactory,
	PCRRpnPortalApi, PCRRpnPortalApiFactory,
	PCRRpnSendRemindAndModifyReservationApi, PCRRpnSendRemindAndModifyReservationApiFactory,
	PCRRpnMedStaffInfoManagementApi, PCRRpnMedStaffInfoManagementApiFactory,
	PCREmpPhysicianConsultServiceControllerApi, PCREmpPhysicianConsultServiceControllerApiFactory,
	PCRRpnRpnServiceFieldManagementApi, PCRRpnRpnServiceFieldManagementApiFactory,
	RpnEventSessionMaintainApi, RpnEventSessionMaintainApiFactory,
	RpnEventRegistrationListApi, RpnEventRegistrationListApiFactory,
	EmpHealthActApi, EmpHealthActApiFactory,
	EmpHealthActSignupApi, EmpHealthActSignupApiFactory,
	RpnQuerySatisfyQuestApi, RpnQuerySatisfyQuestApiFactory,
	OSSAuthApi, OSSAuthApiFactory,
	HERpnCreateHealthCheckApi, HERpnCreateHealthCheckApiFactory,
	HEEmpMyHealthCheckApi, HEEmpMyHealthCheckApiFactory,
	HERpnNumericalMaintenanceApi, HERpnNumericalMaintenanceApiFactory,
	HeRpnHeRpnNoticeSentControllerApi,
	HeRpnHeRpnNoticeSentControllerApiFactory,
	HeRpnHeRpnCheckDataExportControllerApi,
	HeRpnHeRpnCheckDataExportControllerApiFactory,
	SSOAuthApi, SSOAuthApiFactory,
	AlRpnWorkOvertimeListControllerApi, AlRpnWorkOvertimeListControllerApiFactory,
	AlEmpAlCaseRecordInquireControllerApi, AlEmpAlCaseRecordInquireControllerApiFactory,
	AlEmpAlCaseFillOutControllerApi, AlEmpAlCaseFillOutControllerApiFactory,
	AlRpnHomePageControllerApi, AlRpnHomePageControllerApiFactory,
	TableauApi, TableauApiFactory,
	MONPLANRpnEventContentMaintainApi, MONPLANRpnEventContentMaintainApiFactory,
	MONPLANEmpFormApi, MONPLANEmpFormApiFactory,
	AlRpnReportQueryDownloadApi, AlRpnReportQueryDownloadApiFactory,
	MONPLANRpnCurrentMonthMaintainApi, MONPLANRpnCurrentMonthMaintainApiFactory,
	MONPLANRpnRecordWithYearReportApi, MONPLANRpnRecordWithYearReportApiFactory,
	UtilityApi, UtilityApiFactory,
	MONPLANRpnMaintainApi, MONPLANRpnMaintainApiFactory,
	UserApi, UserApiFactory,
	FormApi, FormApiFactory,
	AlRpnCaseInquiryControllerApi, AlRpnCaseInquiryControllerApiFactory,
	AcMngAdminManagerControllerApi, AcMngAdminManagerControllerApiFactory,
	EhEmpFormFillOutControllerApi, EhEmpFormFillOutControllerApiFactory,
	EhEmpFormRecordControllerApi, EhEmpFormRecordControllerApiFactory,
	CaseMaintainUtilityApi, CaseMaintainUtilityApiFactory,
	HfeRpnHfeQueryHumanHazardInformationControllerApi, HfeRpnHfeQueryHumanHazardInformationControllerApiFactory,
	HfeRpnHfeHumanFactorReportControllerApi, HfeRpnHfeHumanFactorReportControllerApiFactory,
	HfeRpnHfeRpnQueryHumanHazardICaseControllerApi, HfeRpnHfeRpnQueryHumanHazardICaseControllerApiFactory,
	HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApi, HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApiFactory,
	AcMngAdminAdminControllerApi, AcMngAdminAdminControllerApiFactory,
	ToDoListApi, ToDoListApiFactory,
	PCRRpnPhysicianConsultationFormsDownloadControllerApi, PCRRpnPhysicianConsultationFormsDownloadControllerApiFactory,
} from '@fubonlife/oss-api-axios-sdk';

declare module 'vue/types/vue' {
  interface Vue {
    $menuApi: MenuApi;
    $PCRRpnPortalApi: PCRRpnPortalApi;
		$PCRRpnMedStaffInfoManagementApi: PCRRpnMedStaffInfoManagementApi;
    $PCRRpnSendRemindAndModifyReservationApi: PCRRpnSendRemindAndModifyReservationApi;
		$PCREmpPhysicianConsultControllerApi: PCREmpPhysicianConsultServiceControllerApi;
		$PCRRpnRpnServiceFieldManagementApi: PCRRpnRpnServiceFieldManagementApi;
		$PHPRpnEventSessionMaintainApi: RpnEventSessionMaintainApi;
		$PHPRpnEventRegistrationListApi: RpnEventRegistrationListApi;
		$PHPEmpHealthActApi: EmpHealthActApi;
		$PHPEmpHealthActSignupApi: EmpHealthActSignupApi;
		$HERpnCreateHealthCheckApi: HERpnCreateHealthCheckApi;
		$PHPRpnQuerySatisfyQuestApi: RpnQuerySatisfyQuestApi;
		$OSSAuthApi: OSSAuthApi;
		$HeRpnHeRpnNoticeSentControllerApi: HeRpnHeRpnNoticeSentControllerApi;
		$HeRpnHeRpnCheckDataExportControllerApi: HeRpnHeRpnCheckDataExportControllerApi;
		$HEEmpMyHealthCheckApi: HEEmpMyHealthCheckApi;
		$HERpnNumericalMaintenanceApi: HERpnNumericalMaintenanceApi;
		$SSOAuthApi: SSOAuthApi;
		$AlRpnAlRpnWorkOvertimeListControllerApi: AlRpnWorkOvertimeListControllerApi;
		$AlEmpAlCaseRecordInquireControllerApi: AlEmpAlCaseRecordInquireControllerApi;
		$AlEmpAlCaseFillOutControllerApi: AlEmpAlCaseFillOutControllerApi;
		$AlRpnHomePageControllerApi: AlRpnHomePageControllerApi;
		$TableauApi: TableauApi;
		$MONPLANRpnEventContentMaintainApi: MONPLANRpnEventContentMaintainApi;
		$MONPLANEmpFormApi: MONPLANEmpFormApi;
		$AlRpnReportQueryDownloadApi: AlRpnReportQueryDownloadApi;
		$MONPLANRpnCurrentMonthMaintainApi: MONPLANRpnCurrentMonthMaintainApi;
		$MONPLANRpnRecordWithYearReportApi: MONPLANRpnRecordWithYearReportApi;
		$UtilityApi: UtilityApi;
		$MONPLANRpnMaintainApi: MONPLANRpnMaintainApi;
		$UserApi: UserApi;
		$FormApi: FormApi;
		$AlRpnCaseInquiryControllerApi: AlRpnCaseInquiryControllerApi;
		$AdminControlManagerApi: AcMngAdminManagerControllerApi;
		$EhEmpFormFillOutControllerApi: EhEmpFormFillOutControllerApi;
		$EhEmpFormRecordControllerApi: EhEmpFormRecordControllerApi;
		$CaseMaintainUtilityApi: CaseMaintainUtilityApi;
		$HfeRpnHfeQueryHumanHazardInformationControllerApi: HfeRpnHfeQueryHumanHazardInformationControllerApi;
		$HfeRpnHfeHumanFactorReportControllerApi: HfeRpnHfeHumanFactorReportControllerApi;
		$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi: HfeRpnHfeRpnQueryHumanHazardICaseControllerApi;
		$HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApi: HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApi;
		$AdminControlAdminApi: AcMngAdminAdminControllerApi;
		$ToDoListApi: ToDoListApi;
		$PCRRpnPhysicianConsultationFormsDownloadControllerApi: PCRRpnPhysicianConsultationFormsDownloadControllerApi;
  }
}

export default new (class Api {
	public install(Vue, options: Configuration) {
		Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCRRpnPortalApi = PCRRpnPortalApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCRRpnSendRemindAndModifyReservationApi = PCRRpnSendRemindAndModifyReservationApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCRRpnMedStaffInfoManagementApi = PCRRpnMedStaffInfoManagementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCREmpPhysicianConsultControllerApi = PCREmpPhysicianConsultServiceControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCRRpnRpnServiceFieldManagementApi = PCRRpnRpnServiceFieldManagementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PHPRpnEventSessionMaintainApi = RpnEventSessionMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PHPRpnEventRegistrationListApi = RpnEventRegistrationListApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PHPEmpHealthActApi = EmpHealthActApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PHPEmpHealthActSignupApi = EmpHealthActSignupApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PHPRpnQuerySatisfyQuestApi = RpnQuerySatisfyQuestApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$OSSAuthApi = OSSAuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HERpnCreateHealthCheckApi = HERpnCreateHealthCheckApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HeRpnHeRpnNoticeSentControllerApi = HeRpnHeRpnNoticeSentControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HeRpnHeRpnCheckDataExportControllerApi = HeRpnHeRpnCheckDataExportControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HEEmpMyHealthCheckApi = HEEmpMyHealthCheckApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HERpnNumericalMaintenanceApi = HERpnNumericalMaintenanceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$SSOAuthApi = SSOAuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlRpnAlRpnWorkOvertimeListControllerApi = AlRpnWorkOvertimeListControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlEmpAlCaseRecordInquireControllerApi = AlEmpAlCaseRecordInquireControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlEmpAlCaseFillOutControllerApi = AlEmpAlCaseFillOutControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlRpnHomePageControllerApi = AlRpnHomePageControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$TableauApi = TableauApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANRpnEventContentMaintainApi = MONPLANRpnEventContentMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANEmpFormApi = MONPLANEmpFormApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlRpnReportQueryDownloadApi = AlRpnReportQueryDownloadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANRpnCurrentMonthMaintainApi = MONPLANRpnCurrentMonthMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANRpnEventContentMaintainApi = MONPLANRpnEventContentMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANRpnRecordWithYearReportApi = MONPLANRpnRecordWithYearReportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$UtilityApi = UtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$MONPLANRpnMaintainApi = MONPLANRpnMaintainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$UserApi = UserApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$FormApi = FormApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AlRpnCaseInquiryControllerApi = AlRpnCaseInquiryControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AdminControlManagerApi = AcMngAdminManagerControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$EhEmpFormFillOutControllerApi = EhEmpFormFillOutControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$EhEmpFormRecordControllerApi = EhEmpFormRecordControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$CaseMaintainUtilityApi = CaseMaintainUtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HfeRpnHfeQueryHumanHazardInformationControllerApi = HfeRpnHfeQueryHumanHazardInformationControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AdminControlManagerApi = AcMngAdminManagerControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HfeRpnHfeHumanFactorReportControllerApi = HfeRpnHfeHumanFactorReportControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HfeRpnHfeRpnQueryHumanHazardICaseControllerApi = HfeRpnHfeRpnQueryHumanHazardICaseControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApi = HfeRpnHfeBuildingHumanHazardProfilesServiceControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$AdminControlAdminApi = AcMngAdminAdminControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$ToDoListApi = ToDoListApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$PCRRpnPhysicianConsultationFormsDownloadControllerApi = PCRRpnPhysicianConsultationFormsDownloadControllerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
	}
})();
