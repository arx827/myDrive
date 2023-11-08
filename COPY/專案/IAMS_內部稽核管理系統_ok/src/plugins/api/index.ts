import axios from 'axios';
import {
	Configuration,
	AuthApiFactory, AuthApi,
	AccountApi, AccountApiFactory,
	RoleApi, RoleApiFactory,
	MenuApi, MenuApiFactory,
	AnnouncementApi, AnnouncementApiFactory,
	DataCollectApi, DataCollectApiFactory,
	AuditPlanApi, AuditPlanApiFactory,
	ParameterApi, ParameterApiFactory,
	PreparationApi, PreparationApiFactory,
	WorkPaperApi, WorkPaperApiFactory,
	AccountAgentApi, AccountAgentApiFactory,
} from '@fubonlife/iams-api-axios-sdk';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
	// 3. Declare augmentation for Vue
	interface Vue {
		$authApi: AuthApi;
		$accountApi: AccountApi;
		$roleApi: RoleApi;
		$menuApi: MenuApi;
		$announcementApi: AnnouncementApi;
		$dataCollectApi: DataCollectApi;
		$auditPlanApi: AuditPlanApi;
		$parameterApi: ParameterApi;
		$preparationApi: PreparationApi;
		$workPaperApi: WorkPaperApi;
		$accountAgentApi: AccountAgentApi;
	}
}
export default new (class Api {
	public install(Vue, options: Configuration) {
		Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$accountApi = AccountApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$roleApi = RoleApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$announcementApi = AnnouncementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$dataCollectApi = DataCollectApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$auditPlanApi = AuditPlanApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$parameterApi = ParameterApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$preparationApi = PreparationApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$workPaperApi = WorkPaperApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
		Vue.prototype.$accountAgentApi = AccountAgentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
	}
})();
