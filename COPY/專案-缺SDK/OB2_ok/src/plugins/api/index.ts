import {
    AgentApi, AgentApiFactory, AnswerOptionApi, AnswerOptionApiFactory, AuthApi, AuthApiFactory, CalendarTableApi, CalendarTableApiFactory, CallUpApi, CallUpApiFactory, CaseCountsApi, CaseCountsApiFactory, CasesEstimatedReportApi, CasesEstimatedReportApiFactory, CommonApi, CommonApiFactory, Configuration, CustMarkApi, CustMarkApiFactory, EmailApi, EmailApiFactory, EventApi, EventApiFactory, EventClassApi, EventClassApiFactory, ExportApi, ExportApiFactory, FileUploadApi, FileUploadApiFactory, GroupApi, GroupApiFactory, I18NResourceApi, I18NResourceApiFactory, InformApi, InformApiFactory, IntraEmployeeApi, IntraEmployeeApiFactory, MenuApi, MenuApiFactory, PackMatchApi, PackMatchApiFactory, PdfUtilsApi, PdfUtilsApiFactory, PendingPageApi, PendingPageApiFactory, PersonTaskApi, PersonTaskApiFactory, PolicyDataApi, PolicyDataApiFactory, QuestionBankLetterRightsApi, QuestionBankLetterRightsApiFactory, QuestMainApi, QuestMainApiFactory, QuestSettingApi, QuestSettingApiFactory, RecordVoiceCloseSettingApi, RecordVoiceCloseSettingApiFactory, ReviewedSettingApi, ReviewedSettingApiFactory, ReviewSettingApi, ReviewSettingApiFactory,
    // DepartmentApi, DepartmentApiFactory, ProductApi, ProductSpecApi, ProductApiFactory, ProductSpecApiFactory, AccountApi, AccountApiFactory,FunctionApi,FunctionApiFactory, UrlResourceApi, UrlResourceApiFactory,
    RoleApi, RoleApiFactory, TaskSettingApi, TaskSettingApiFactory, TaskTypeApi, TaskTypeApiFactory, TelDataApi, TelDataApiFactory, TextMessageApi, TextMessageApiFactory, UnitApi, UnitApiFactory, UploadProgressApi, UploadProgressApiFactory, UserApi, UserApiFactory, UserEventApi, UserEventApiFactory, UserShiftWorkApi, UserShiftWorkApiFactory, UserSKillApi, UserSKillApiFactory, UserTaskApi, UserTaskApiFactory, VersionCheckApi, VersionCheckApiFactory, QuestionAnswerApi, QuestionAnswerApiFactory, HistoryApi, HistoryApiFactory, TransitionApi, TransitionApiFactory,
    CaseSearchApiFactory, CaseSearchApi, ContactResultApi, ContactResultApiFactory, InformBasicSettingApi, InformBasicSettingApiFactory, DispatchManagementApi, DispatchManagementApiFactory, TeleResultApi, TeleResultApiFactory, TeleResultAreaApi, TeleResultAreaApiFactory, PendingApi, PendingApiFactory, DeptMarkApi, DeptMarkApiFactory, UnlockApi, UnlockApiFactory, NotificationAgentApi, NotificationAgentApiFactory, TransferFileApi, TransferFileApiFactory, CaseClosedReasonApi, CaseClosedReasonApiFactory, NotificationApi, NotificationApiFactory, NotifySettingApi, NotifySettingApiFactory, VisitPersonSettingApi, VisitPersonSettingApiFactory, CommunicatSettingApi, CommunicatSettingApiFactory, CommonQuestionApiFactory,
    NotificationBasicSettingApi, NotificationBasicSettingApiFactory, CommonQuestionApi, NotiSettingApi, NotiSettingApiFactory, TeleResultConfigApi, TeleResultConfigApiFactory, PostRecordApi, PostRecordApiFactory, MailByPostApi, MailByPostApiFactory, ReviewCaseApi, ReviewCaseApiFactory, MailNoitceApi, MailNoitceApiFactory, RecordApi, RecordApiFactory, TelTimeResultApi, TelTimeResultApiFactory, TelChangeApi, TelChangeApiFactory,
    SendTemplateApi,SendTemplateApiFactory,NotiReplyPersonSettingApi,NotiReplyPersonSettingApiFactory,TeleReCordSettingApi,TeleReCordSettingApiFactory, MailReturnToSendApi, MailReturnToSendApiFactory, DailyReportApi, DailyReportApiFactory, MailValidateApi, MailValidateApiFactory, TelReportApi, TelReportApiFactory,BackDoorSettingApi,BackDoorSettingApiFactory 
    ,JasyptApi,JasyptApiFactory
} from '@fubonlife/obd-api-axios-sdk';
import axios from 'axios';
// Specify a file with the types you want to augment
// Vue has the constructor type in types/vue.d.ts
declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $backDoorSettingApi: BackDoorSettingApi
        $telReportPageApi: TelReportApi
        $recordApi: RecordApi
        $notificationAgentApi: NotificationAgentApi
        $deptMarkApi: DeptMarkApi
        $pendingApi: PendingApi
        $dispatchManagementApi: DispatchManagementApi
        $historyApi: HistoryApi
        $fileUploadApi: FileUploadApi
        $policyDataApi: PolicyDataApi
        $telDataApi: TelDataApi
        $callUpApi: CallUpApi
        $agentApi: AgentApi
        $authApi: AuthApi
        $roleApi: RoleApi
        $menuApi: MenuApi
        $userApi: UserApi
        $intraEmployeeApi: IntraEmployeeApi
        $i18NResourceApi: I18NResourceApi
        $commonApi: CommonApi
        $answerOptionApi: AnswerOptionApi
        $questionBankLetterRightsApi: QuestionBankLetterRightsApi
        $recordVoiceCloseSettingApi: RecordVoiceCloseSettingApi
        $userEventApi: UserEventApi
        $eventClassApi: EventClassApi
        $eventApi: EventApi
        $versionCheckApi: VersionCheckApi
        $taskApi: TaskTypeApi
        $taskSettingApi: TaskSettingApi
        $personTaskApi: PersonTaskApi
        $unitApi: UnitApi
        $userShiftWorkApi: UserShiftWorkApi
        $uploadProgressApi: UploadProgressApi
        $groupApi: GroupApi
        $userTaskApi: UserTaskApi
        $custMarkApi: CustMarkApi
        $userSkillApi: UserSKillApi
        $caseCountsApi: CaseCountsApi
        $reviewedSettingApi: ReviewedSettingApi
        $reviewSettingApi: ReviewSettingApi
        $exportApi: ExportApi
        $pendingPageApi: PendingPageApi
        $questSettingApi: QuestSettingApi
        $casesEstimatedReportApi: CasesEstimatedReportApi
        $packMatchApi: PackMatchApi
        $textMessageApi: TextMessageApi
        $questMainApi: QuestMainApi
        $emailApi: EmailApi
        $jasperApi: PdfUtilsApi
        $calendarTableApi: CalendarTableApi
        $informApi: InformApi
        $questionAnswerApi: QuestionAnswerApi
        $transitionApi: TransitionApi
        $caseSearchApi: CaseSearchApi
        $contactResultApi: ContactResultApi
        $informBasicSettingApi: InformBasicSettingApi
        $teleResultApi: TeleResultApi
        $teleResultAreaApi: TeleResultAreaApi
        $caseClosedReasonApi: CaseClosedReasonApi
        $transferFileApi: TransferFileApi
        $unlockApi: UnlockApi
        $notificationApi: NotificationApi
        $infNotifySettingApi: NotifySettingApi
        $visitPersonSettingApi: VisitPersonSettingApi
        $communicatSettingApi: CommunicatSettingApi
        $commonQuestionApi: CommonQuestionApi
        $notifyBasicSettingApi: NotificationBasicSettingApi
        $teleResultConfigApi: TeleResultConfigApi
        $notiSettingApi: NotiSettingApi
        $postRecordApi: PostRecordApi
        $mailByPostApi: MailByPostApi
        $reviewCaseApi: ReviewCaseApi
        $mailNoticeApi: MailNoitceApi
        $telTimeReportApi: TelTimeResultApi
        $notiReplyPersonApi:NotiReplyPersonSettingApi
        $teleRecordSettingApi:TeleReCordSettingApi
        $mailReturnToSendApi: MailReturnToSendApi
        $telChangeReportApi: TelChangeApi
        $dailyReportApi: DailyReportApi
        $mailValidateApi: MailValidateApi
        $sendTemplateApi: SendTemplateApi
        $jasyptApi: JasyptApi
        
    }
}

export default new (class Api {
    public install(Vue, options: Configuration) {
        Vue.prototype.$backDoorSettingApi = BackDoorSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$telReportPageApi = TelReportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$recordApi = RecordApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$recordApi = RecordApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$notificationAgentApi = NotificationAgentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$deptMarkApi = DeptMarkApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$pendingApi = PendingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$dispatchManagementApi = DispatchManagementApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$historyApi = HistoryApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$fileUploadApi = FileUploadApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$policyDataApi = PolicyDataApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$telDataApi = TelDataApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$callUpApi = CallUpApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$agentApi = AgentApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$authApi = AuthApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$roleApi = RoleApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$menuApi = MenuApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // Vue.prototype.$urlResourceApi = UrlResourceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$userApi = UserApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$intraEmployeeApi = IntraEmployeeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$i18NResourceApi = I18NResourceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // Vue.prototype.$functionApi = FunctionApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$commonApi = CommonApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        // Vue.prototype.$resourceApi = UrlResourceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$answerOptionApi = AnswerOptionApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$questionBankLetterRightsApi = QuestionBankLetterRightsApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$recordVoiceCloseSettingApi = RecordVoiceCloseSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$userEventApi = UserEventApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$eventClassApi = EventClassApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$eventApi = EventApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$eventApi = EventApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);

        Vue.prototype.$versionCheckApi = VersionCheckApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$taskApi = TaskTypeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$taskSettingApi = TaskSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$personTaskApi = PersonTaskApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$unitApi = UnitApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$userShiftWorkApi = UserShiftWorkApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$uploadProgressApi = UploadProgressApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$groupApi = GroupApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$userTaskApi = UserTaskApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$custMarkApi = CustMarkApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$userSkillApi = UserSKillApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$caseCountsApi = CaseCountsApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$reviewedSettingApi = ReviewedSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$reviewSettingApi = ReviewSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$exportApi = ExportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$pendingPageApi = PendingPageApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$questSettingApi = QuestSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$casesEstimatedReportApi = CasesEstimatedReportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$packMatchApi = PackMatchApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$textMessageApi = TextMessageApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$questMainApi = QuestMainApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$emailApi = EmailApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$jasperApi = PdfUtilsApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$calendarTableApi = CalendarTableApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$informApi = InformApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$questionAnswerApi = QuestionAnswerApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$transitionApi = TransitionApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$caseSearchApi = CaseSearchApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$contactResultApi = ContactResultApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$informBasicSettingApi = InformBasicSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$teleResultApi = TeleResultApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$teleResultAreaApi = TeleResultAreaApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$caseClosedReasonApi = CaseClosedReasonApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$transferFileApi = TransferFileApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$unlockApi = UnlockApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$notificationApi = NotificationApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$infNotifySettingApi = NotifySettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$visitPersonSettingApi = VisitPersonSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$communicatSettingApi = CommunicatSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$commonQuestionApi = CommonQuestionApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$notifyBasicSettingApi = NotificationBasicSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$teleResultConfigApi = TeleResultConfigApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$notiSettingApi = NotiSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$postRecordApi = PostRecordApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$mailByPostApi = MailByPostApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$reviewCaseApi = ReviewCaseApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$mailNoticeApi = MailNoitceApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$telTimeReportApi = TelTimeResultApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$notiReplyPersonApi=NotiReplyPersonSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$teleRecordSettingApi=TeleReCordSettingApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$mailReturnToSendApi = MailReturnToSendApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$telChangeReportApi = TelChangeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$dailyReportApi = DailyReportApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$telChangeReportApi = TelChangeApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);    
        Vue.prototype.$mailValidateApi = MailValidateApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$sendTemplateApi = SendTemplateApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
        Vue.prototype.$jasyptApi = JasyptApiFactory(options, process.env.VUE_APP_API_BASE_URL, axios);
    }
})();