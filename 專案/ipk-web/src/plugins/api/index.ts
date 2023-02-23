import axios from 'axios';
import {
    Configuration, AuthApiFactory, AuthApi, DepartmentApi, DepartmentApiFactory, AccountApi, AccountApiFactory,
    RoleApi, RoleApiFactory, MenuApi, MenuApiFactory, SysParamSettingApi, SysParamSettingApiFactory,
    QuerySetupApi, QuerySetupApiFactory, CommonApi, CommonApiFactory,
    AnnouncementApi, AnnouncementApiFactory, NoticeApi, NoticeApiFactory, EmailApi, EmailApiFactory,
    // 交易確認
    CutOffConfigApi, CutOffConfigApiFactory, ApprovalConfigApi, ApprovalConfigApiFactory,
    FubonSsiApi, FubonSsiApiFactory, CounterpartySsiApi, CounterpartySsiApiFactory,
    ForeignBondStructureApi, ForeignBondStructureApiFactory,
    ForeignEquityApi, ForeignEquityApiFactory,
    TxReviewApi, TxReviewApiFactory,
    ContactApiFactory, ContactApi,
    FileDownloadApi, FileDownloadApiFactory,
    TxDoubleReviewApi, TxDoubleReviewApiFactory,
    ForeignBondNonstructureApi, ForeignBondNonstructureApiFactory,
    ForeignExchangeAndTenderApi, ForeignExchangeAndTenderApiFactory,
    DomesticBondApi, DomesticBondApiFactory,
    // 投會、投規
    GeneralLedgerApi, GeneralLedgerApiFactory, ALMGeneralLedgerApi, ALMGeneralLedgerApiFactory, BatchSettingApi, BatchSettingApiFactory,
    // 投系
    AvailableFundsApi, AvailableFundsApiFactory, InvestmentLimitReportApi, InvestmentLimitReportApiFactory,
    IpoReportSettingApi, IpoReportSettingApiFactory,
} from '@fubonlife/ipk-api-axios-sdk';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authApi: AuthApi;
        $accountApi: AccountApi;
        $departmentApi: DepartmentApi;
        $roleApi: RoleApi;
        $menuApi: MenuApi;
        $sysParamSettingApi: SysParamSettingApi;
        $commonApi: CommonApi;
        $querySetupApi: QuerySetupApi;
        $announcementApi: AnnouncementApi;
        $noticeApi: NoticeApi;
        $emailApi: EmailApi;
        // 投確
        $cutOffConfigApi: CutOffConfigApi;
        $contactApi: ContactApi;
        $approvalConfigApi: ApprovalConfigApi;
        $fubonSsiApi: FubonSsiApi;
        $foreignEquityApi: ForeignEquityApi;
        $filedownload: FileDownloadApi;
        $txReview: TxReviewApi;
        $txDoubleReview: TxDoubleReviewApi;
        $counterpartySsiApi: CounterpartySsiApi;
        $foreignBondStructureApi: ForeignBondStructureApi;
        $foreignBondNonstructureApi: ForeignBondNonstructureApi;
        $foreignExchangeAndTenderApi: ForeignExchangeAndTenderApi;
        $domesticBondApi: DomesticBondApi;
        // 投會、投規
        $generalLedgerApi: GeneralLedgerApi;
        $almGeneralLedgerApi: ALMGeneralLedgerApi;
        $batchSettingApi: BatchSettingApi;
        // 投系
        $ipoReportSettingApi: IpoReportSettingApi;
        $availableFundsApi: AvailableFundsApi;
        $investmentLimitReportApi: InvestmentLimitReportApi;
    }
}
export default new (class Api {
    public install(Vue, options: Configuration) {
        Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$accountApi = AccountApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$departmentApi = DepartmentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$roleApi = RoleApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$sysParamSettingApi = SysParamSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$commonApi = CommonApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$querySetupApi = QuerySetupApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$announcementApi = AnnouncementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$noticeApi = NoticeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$emailApi = EmailApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // 投確
        Vue.prototype.$cutOffConfigApi = CutOffConfigApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$contactApi = ContactApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$approvalConfigApi = ApprovalConfigApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$fubonSsiApi = FubonSsiApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$foreignEquityApi = ForeignEquityApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$filedownload = FileDownloadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$txReview = TxReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$txDoubleReview = TxDoubleReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$counterpartySsiApi = CounterpartySsiApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$txDoubleReview = TxDoubleReviewApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$foreignBondStructureApi = ForeignBondStructureApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$foreignBondNonstructureApi = ForeignBondNonstructureApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$foreignExchangeAndTenderApi = ForeignExchangeAndTenderApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$domesticBondApi = DomesticBondApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // 投會、投規
        Vue.prototype.$generalLedgerApi = GeneralLedgerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$almGeneralLedgerApi = ALMGeneralLedgerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$batchSettingApi = BatchSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // 投系
        Vue.prototype.$ipoReportSettingApi = IpoReportSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$availableFundsApi = AvailableFundsApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$investmentLimitReportApi = InvestmentLimitReportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    }
})();
