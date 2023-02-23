import axios from 'axios';
import {
	Configuration,
	COHomeNoticeApi,
	COHomeNoticeApiFactory,
	COAuthApiFactory,
	COAuthApi,
	COUserApiFactory,
	COUserApi,
	COHistoryTransactionQueryApi,
	COHistoryTransactionQueryApiFactory,
	COTodayTransactionQueryApi,
	COTodayTransactionQueryApiFactory,
	COEmployeeFamilyPolicyApiFactory,
	COEmployeeFamilyPolicyApi,
	COUtilityApiFactory,
	COUtilityApi,
	COEmpFamilyPolicyChangeApiFactory,
	COEmpFamilyPolicyChangeApi,
	COEmployeeFamilyGeneralInfoChangeApiFactory,
	COEmployeeFamilyGeneralInfoChangeApi,
	COCoInsuranceUnitApiFactory,
	COCoInsuranceUnitApi,
	UtilityApi,
	UtilityApiFactory,
	COServiceAndBusinessStaffApi,
	COServiceAndBusinessStaffApiFactory,
	AuthApi,
	AuthApiFactory,
	COInsuranceClaimAreaApi,
	COInsuranceClaimAreaApiFactory,
	COEmployeeFamilyEnrollmentApi,
	COEmployeeFamilyEnrollmentApiFactory,
	COEmployeeEnrollmentApi,
	COEmployeeEnrollmentApiFactory,
	GIODocsetApi,
	GIODocsetApiFactory,
	COEmpFamilyUploadApiFactory,
	COEmpFamilyUploadApi,
	COToDoListAndNoticeApi,
	COToDoListAndNoticeApiFactory,
	CORePrintDownloadApi,
	CORePrintDownloadApiFactory,
	COEveryPeriodPremiumApiFactory,
	COEveryPeriodPremiumApi,
	MenuApiFactory,
	MenuApi,
	CODocDownloadApi,
	CODocDownloadApiFactory,
} from '@fubonlife/co-giiss-api-axios-sdk';

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $homeNoticeApi: COHomeNoticeApi;
        $authApi: COAuthApi;
        $userApi: COUserApi;
        $historyTransactionQueryApi: COHistoryTransactionQueryApi;
        $todayTransactionQueryApi: COTodayTransactionQueryApi;
				$employeeFamilyPolicyApi: COEmployeeFamilyPolicyApi;
				$coUtilityApi: COUtilityApi;
				$empFamilyPolicyChangeApi: COEmpFamilyPolicyChangeApi;
				$employeeFamilyGeneralInfoChangeApi: COEmployeeFamilyGeneralInfoChangeApi;
				$coInsuranceUnitApi: COCoInsuranceUnitApi;
				$utilityApi: UtilityApi;
				$serviceAndBusinessStaff: COServiceAndBusinessStaffApi;
				$globalAuthApi: AuthApi;
				$insuranceClaimAreaApi: COInsuranceClaimAreaApi;
				$employeeEnrollmentApi: COEmployeeEnrollmentApi;
				$employeeFamilyEnrollmentApi: COEmployeeFamilyEnrollmentApi;
				$docsetApi: GIODocsetApi;
				$uploadApi: COEmpFamilyUploadApi;
				$toDoListAndNoticeApi: COToDoListAndNoticeApi;
				$rePrintDownloadApi: CORePrintDownloadApi;
				$everyPeriodPremiumApi: COEveryPeriodPremiumApi;
				$menuApi: MenuApi;
				$docDownloadApi: CODocDownloadApi;
    }
}
export default new (class Api {
	public install(Vue, options: Configuration) {
		Vue.prototype.$homeNoticeApi = COHomeNoticeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$authApi = COAuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$userApi = COUserApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$historyTransactionQueryApi = COHistoryTransactionQueryApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$todayTransactionQueryApi = COTodayTransactionQueryApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$employeeFamilyPolicyApi = COEmployeeFamilyPolicyApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$coUtilityApi = COUtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$empFamilyPolicyChangeApi = COEmpFamilyPolicyChangeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$employeeFamilyGeneralInfoChangeApi = COEmployeeFamilyGeneralInfoChangeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$utilityApi = UtilityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$coInsuranceUnitApi = COCoInsuranceUnitApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$serviceAndBusinessStaff = COServiceAndBusinessStaffApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$globalAuthApi = COAuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$globalAuthApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$insuranceClaimAreaApi = COInsuranceClaimAreaApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$employeeEnrollmentApi = COEmployeeEnrollmentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$employeeFamilyEnrollmentApi = COEmployeeFamilyEnrollmentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$docsetApi = GIODocsetApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$uploadApi = COEmpFamilyUploadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$toDoListAndNoticeApi = COToDoListAndNoticeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$rePrintDownloadApi = CORePrintDownloadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$everyPeriodPremiumApi = COEveryPeriodPremiumApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$docDownloadApi = CODocDownloadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
	}
})();
