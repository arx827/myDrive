import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumn, FblColumnType, FblPageEvent } from '@/components/shared/data-grid/models';
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import QuestionAnswer from '@/components/shared/form/history/questionAnswer/QuestionAnswer.vue';
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { ComponentDto, CasePackDto, DataHubInput, HandleNoList, INumDto, ServeContactDataList, ServeContactInput, ServiceHistorygDto, ServeContactOutput, CallRecordDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import UploadFileHistroy from "../uploadFileHistroy/UploadFileHistroy.vue";
import RecordPlayList from "./RecordPlayList.vue";
import InfRecord from "@/components/shared/form/history/infRecord/InfRecord.vue";
import HandleInfoForm from "@/components/shared/form/handleInfoForm/HandleInfoForm.vue";
import MailRecord from '@/components/shared/form/history/mailHistory/MailHistory.vue';
import MPlusHistory from "@/components/shared/form/history/mPlusHistory/MPlusHistory.vue";
import { message } from "ant-design-vue";
import { AuthComonent } from "@/assets/config/CommonUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import PostRecord from "@/components/shared/form/history/postRecord/PostRecord.vue";
import { eventData } from "./model";

@Component({
    components: { DragModal, FblDataGrid, RecordPlayList, UploadFileHistroy, QuestionAnswer, InfRecord, HandleInfoForm, MailRecord, MPlusHistory, PostRecord }
})
export default class ServeContactHistroy extends Vue {

    // 畫面元件 
    authComponent: AuthComonent = {
        SERVE_CONTACT_HIS_REORD_FILE: {
            show: false,
            enable: false
        }
    };

    @Prop()
    isModal !: boolean;

    @Prop()
    tabKey: string;

    @Prop()
    currentPack: CasePackDto;

    loading: boolean = false;

    // 檔案上傳
    showUploadFileHistory: boolean = false;

    // 通話內容
    showQuestionAnswerHistory: boolean = false;

    // 錄音檔撥放清單
    inumDtoList: INumDto[] = [];
    showRecordPlayList: boolean = false;
    playButtonLoading = {};
    callSys: string = "";
    serviceHistorygDto: ServiceHistorygDto = null;

    // 服務歷程-外部系統輸入值
    serveInput: ServeContactInput;

    // 服務歷程-外部系統
    serveDataList: ServeContactDataList[] = [];

    // 服務歷程-內部系統
    innerServeDataList: ServiceHistorygDto[] = [];

    // loading
    isLoading: boolean = false;

    //會辦紀錄
    infReocrdvisible: boolean = false;

    // 照會紀錄
    notiReocrdvisible: boolean = false;

    //mplus和簡訊紀錄
    infMplusSendMessageVisible: boolean = false;
    //email紀錄
    infEmailRecordsVisible: boolean = false;
    //郵寄紀錄
    infPostRecordVisible: boolean = false;
    custId: string = "";
    //案件編號
    caseNo: string = "";
    caseLogid: string = "";
    // get getTabKey():string{
    //     console.log("tabkey");
    //     return this.tabKey;
    // }

    // 通話內容 modal 參數
    questionAnswerParam: DataHubInput = {
        CASE_NO: "",
        GUID: "",
    };
    questionAnswerCountNum: number = 0; // 通話內容資料總筆數

    // 處理單號彈窗開關
    showHandleNoInfo: boolean = false;
    // 處理單內容
    handleInfoData: HandleNoList = {};

    /**
     * @description 監聽是否切件&tab換頁籤
     * @author B0845
     * @version 2022/11/02
     */
    get dataChange(){
        return {
            tabKey: this.tabKey,
            currentPack: this.currentPack
        };
    }
    // 監聽tab看是否有換頁(A為外部系統，B為內部系統)
    @Watch('dataChange')
    tabChange(newVal: eventData, oldVal: eventData) {
        if (newVal.tabKey === "A") {
            if (!VlidationUtil.isEmpty(this.currentPack)) {
                this.outerServeContact(this.currentPack);
                // this.isPackChange = false;
            }
        } else if (newVal.tabKey === "B") {
            if (!VlidationUtil.isEmpty(this.currentPack) &&
                !VlidationUtil.isEmpty(this.currentPack.custId)) {
                this.innerServeContact(this.currentPack.custId);
            }
        }

        if(!VlidationUtil.isEmpty(newVal.currentPack) && !VlidationUtil.isEmpty(oldVal.currentPack) && newVal.currentPack.packNo != oldVal.currentPack.packNo){
            // 續訪/取下一筆 切換名單編號 關閉已開啟的所有表單

            // 照會紀錄
            this.notiReocrdvisible = false;
            // 郵寄紀錄
            this.infPostRecordVisible = false;
            // M+和簡訊紀錄
            this.infMplusSendMessageVisible = false;
            // 檔案上傳歷程
            this.showUploadFileHistory = false;
            // 通話內容
            this.showQuestionAnswerHistory = false;
            // Email紀錄
            this.infEmailRecordsVisible = false;
            // 會辦紀錄
            this.infReocrdvisible = false;
            // 處理單號
            this.showHandleNoInfo = false;
        }
    }

    // 服務歷程-外部系統欄位定義
    public serveColumns: FblColumn<ServeContactDataList>[] = [
        // 服務平台
        {
            type: FblColumnType.PLAIN,
            property: 'Service_SYS_DESC',
            title: this.$t("onDutyPage_serviceSystemCode").toString(),
            width: CommonUtil.countColumnWidth(5),
            fixed: 'left',
        },
        // 問題類型/電訪結果
        {
            type: FblColumnType.PLAIN,
            property: 'Contact_Memo',
            title: this.$t("onDutyPage_contactMemo").toString(),
            width: CommonUtil.countColumnWidth(11),
            fixed: 'left',
        },
        // 處理單號
        {
            type: FblColumnType.LINK,
            template: 'HANDLE_NO',
            title: this.$t("onDutyPage_handleNo").toString(),
            width: CommonUtil.countColumnWidth(12),
            fixed: 'left',
            linkTemplate: 'TICKET_ID',
            spliteSign: ',',
        },
        // 處理狀況
        {
            type: FblColumnType.PLAIN,
            property: 'HANDIE_STATUS',
            title: this.$t("onDutyPage_handleStatus").toString(),
            width: CommonUtil.countColumnWidth(4),
            fixed: 'left',
        },
        // 通話內容
        {
            type: FblColumnType.TEMPLATE,
            template: "handleTemp",
            title: this.$t("onDutyPage_contactContent").toString(),
            width: CommonUtil.countColumnWidth(10),
        },
        // 受理人員
        {
            type: FblColumnType.PLAIN,
            property: 'ACCEPT_NAME',
            title: this.$t("onDutyPage_acceptName").toString(),
            width: CommonUtil.countColumnWidth(4),
        },
        // 受理日期時間
        {
            type: FblColumnType.PLAIN,
            property: 'ACCEPT_DATETIME',
            title: this.$t("onDutyPage_acceptDatetime").toString(),
            width: CommonUtil.countColumnWidth(10),
            formatter: (data) => {
                if (VlidationUtil.isEmpty(data.ACCEPT_DATETIME)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.ACCEPT_DATETIME);
                }
            },
        },
        // 結案人員
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_CLOSE_NAME',
            title: this.$t("onDutyPage_contactCloseName").toString(),
            width: CommonUtil.countColumnWidth(4),
        },
        // 結案日期時間
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_CLOSE_DATETIME',
            title: this.$t("onDutyPage_contactCloseDatetime").toString(),
            width: CommonUtil.countColumnWidth(6),
            formatter: (data) => {
                if (VlidationUtil.isEmpty(data.CONTACT_CLOSE_DATETIME)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.CONTACT_CLOSE_DATETIME);
                }
            },
        },
        // 諮詢管道
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_TYPE',
            title: this.$t("onDutyPage_contactType").toString(),
            width: CommonUtil.countColumnWidth(4),
        },
        // 電訪項目
        {
            type: FblColumnType.PLAIN,
            property: 'TASK_NAME',
            title: this.$t("userTask").toString(),
            width: CommonUtil.countColumnWidth(4),
        },
        // 來電者身分
        {
            type: FblColumnType.PLAIN,
            property: 'CALLER_TYPE',
            title: this.$t("onDutyPage_callerType").toString(),
            width: CommonUtil.countColumnWidth(5),
        },
        // 來電者ID
        {
            type: FblColumnType.PLAIN,
            property: 'CALLER_ID',
            title: this.$t("onDutyPage_callerId").toString(),
            width: CommonUtil.countColumnWidth(6),
        },
        // 來電者姓名
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CALLER_NAME',
            title: this.$t("onDutyPage_callerName").toString(),
            width: CommonUtil.countColumnWidth(7),
        },
        // 服務紀錄編號
        {
            type: FblColumnType.PLAIN,
            property: 'Service_LOG_NO',
            title: this.$t("onDutyPage_ServiceLogNo").toString(),
            width: CommonUtil.countColumnWidth(6),
        },

    ]

    // 服務歷程-外部系統modal欄位定義
    public serveModalColumns: FblColumn<ServeContactDataList>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'Service_SYS_DESC',
            title: this.$t("onDutyPage_serviceSystemCode").toString(), // 服務平台
            width: CommonUtil.countColumnWidth(5),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'Contact_Memo',
            title: this.$t("onDutyPage_contactMemo").toString(), // 問題類型/電訪結果
            width: CommonUtil.countColumnWidth(9),
        },
        {
            type: FblColumnType.LINK,
            template: 'HANDLE_NO',
            title: this.$t("onDutyPage_handleNo").toString(), // 處理單號
            width: CommonUtil.countColumnWidth(12),
            linkTemplate: 'TICKET_ID',
            spliteSign: ',',
        },
        {
            type: FblColumnType.PLAIN,
            property: 'HANDIE_STATUS',
            title: this.$t("onDutyPage_handleStatus").toString(), // 處理狀況
            width: CommonUtil.countColumnWidth(4),
        },
        {
            type: FblColumnType.TEMPLATE,
            template: "handleTemp",
            title: this.$t("onDutyPage_contactContent").toString(), // 通話內容
            width: CommonUtil.countColumnWidth(10),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ACCEPT_NAME',
            title: this.$t("onDutyPage_acceptName").toString(), // 受理人員
            width: CommonUtil.countColumnWidth(4),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ACCEPT_DATETIME',
            title: this.$t("onDutyPage_acceptDatetime").toString(), // 受理日期時間
            width: CommonUtil.countColumnWidth(8),
            formatter: (data) => {
                if (VlidationUtil.isEmpty(data.ACCEPT_DATETIME)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.ACCEPT_DATETIME);
                }
            },
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_CLOSE_NAME',
            title: this.$t("onDutyPage_contactCloseName").toString(), // 結案人員
            width: CommonUtil.countColumnWidth(4),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_CLOSE_DATETIME',
            title: this.$t("onDutyPage_contactCloseDatetime").toString(), // 結案日期時間
            width: CommonUtil.countColumnWidth(6),
            formatter: (data) => {
                if (VlidationUtil.isEmpty(data.CONTACT_CLOSE_DATETIME)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.CONTACT_CLOSE_DATETIME);
                }
            },
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CONTACT_TYPE',
            title: this.$t("onDutyPage_contactType").toString(), // 諮詢管道
            width: CommonUtil.countColumnWidth(4),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'TASK_NAME',
            title: this.$t("userTask").toString(), // 電訪項目
            width: CommonUtil.countColumnWidth(4),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CALLER_TYPE',
            title: this.$t("onDutyPage_callerType").toString(), // 來電者身分
            width: CommonUtil.countColumnWidth(5),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CALLER_ID',
            title: this.$t("onDutyPage_callerId").toString(), // 來電者ID
            width: CommonUtil.countColumnWidth(6),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CALLER_NAME',
            title: this.$t("onDutyPage_callerName").toString(), // 來電者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'Service_LOG_NO',
            title: this.$t("onDutyPage_ServiceLogNo").toString(), // 服務紀錄編號
            width: CommonUtil.countColumnWidth(6),
        },
    ]

    // 服務歷程-內部系統欄位定義
    public innerServeColumns: FblColumn<ServiceHistorygDto>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'contactDate',
            title: this.$t("serveConHis_contactDate").toString(), // 聯絡時間
            width: CommonUtil.countColumnWidth(10),
            align: "center",
            fixed: 'left',
            formatter: (data) => {
                if (VlidationUtil.isEmpty(data.contactDate)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.contactDate);
                }
            },
        },
        {
            type: FblColumnType.PLAIN,
            property: 'casePolicy',
            title: this.$t("serveConHis_casePolicy").toString(), // 保單號碼
            width: CommonUtil.countColumnWidth(10),
            align: "center",
            fixed: 'left',
        },
        {
            type: FblColumnType.PLAIN,
            property: 'campaignName',
            title: this.$t("serveConHis_campaignName").toString(), // 電訪項目
            width: CommonUtil.countColumnWidth(10),
            align: "center",
            fixed: 'left',
        },
        {
            type: FblColumnType.PLAIN,
            property: 'identity',
            title: this.$t("serveConHis_identity").toString(), // 受訪者身分
            width: CommonUtil.countColumnWidth(10),
            align: "center",
            fixed: 'left',
        },
        {
            type: FblColumnType.PLAIN,
            property: 'custID',
            title: this.$t("serveConHis_custID").toString(), // 受訪者ID
            width: CommonUtil.countColumnWidth(10),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            property: 'custName',
            template: 'custNameTemp',
            title: this.$t("serveConHis_custName").toString(), // 受訪者姓名
            width: CommonUtil.countColumnWidth(7),
            align: "center",
        },
        {
            type: FblColumnType.PLAIN,
            property: 'termdept',
            title: this.$t("serveConHis_termdept").toString(), // 聯絡結果
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.PLAIN,
            property: 'termitem',
            title: this.$t("serveConHis_termitem").toString(), // 電訪結果
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.PLAIN,
            property: 'custMemo',
            title: this.$t("serveConHis_custMemo").toString(), // 結案原因
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            property: 'content',
            template: 'contentTemp',
            title: this.$t("callUpF_callUpRemark").toString(), // 通話內容
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.PLAIN,
            property: 'createId',
            title: this.$t("serveConHis_createId").toString(), // 電訪員
            width: CommonUtil.countColumnWidth(10),
            align: "center",
        },
        {
            type: FblColumnType.PLAIN,
            title: this.$t("serveConHis_visitDate").toString(), // 方便聯絡時段
            width: CommonUtil.countColumnWidth(6),
            align: "center",
            formatter: (data: ServiceHistorygDto) => {
                if (data) {
                    return this.visitDateProcess(data.visitStartDate, data.visitEndDate);
                } else {
                    return "";
                }
            }
        },
        {
            type: FblColumnType.TEMPLATE,
            title: this.$t("serveConHis_countersignatureExist").toString(), // 照會紀錄
            property: "countersignatureExist",
            template: 'countersignatureExistTemp',
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            title: this.$t("serveConHis_postRecordExist").toString(), // 郵寄紀錄
            property: "postRecordExist",
            template: 'postRecordExistTemp',
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            title: this.$t("serveConHis_informExist").toString(), // 會辦紀錄
            property: "informExist",
            template: 'informExistTemp',
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            title: this.$t("serveConHis_mplusMesgExist").toString(), // M+/簡訊紀錄
            property: "mplusMesgExist",
            template: 'mplusMesgExistTemp',
            width: CommonUtil.countColumnWidth(6),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            title: this.$t("serveConHis_mailRecordExist").toString(), // MAIL紀錄
            property: "mailRecordExist",
            template: 'mailRecordExistTemp',
            width: CommonUtil.countColumnWidth(5),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            property: "uploadFileExist",
            template: 'uploadFileExistTemp',
            title: this.$t("serveConHis_uploadFileExist").toString(), // 檔案上傳
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        },
        {
            type: FblColumnType.TEMPLATE,
            property: 'codingNo',
            template: 'codingNoTemp',
            title: this.$t("serveConHis_inumDtoList").toString(),  // 錄音檔案
            width: CommonUtil.countColumnWidth(4),
            align: "center",
        }
    ];

    // 服務歷程-外部系統 內容
    public serveGrid = {
        rowKey: 'rowKey',
        data: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: 0
        },
        columns: [],
    };
    // 服務歷程-外部系統modal分頁設定
    public serveModalPagination = {
        current: 1,
        pageSize: 15,
        total: 0
    }

    /**
     * 頁面啟動第一動
     */
    created() {

        // 畫面元件 component 權限
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
            .then((res: AxiosResponse<ComponentDto>) => {
                if (res.data.component) {
                    this.authComponent.SERVE_CONTACT_HIS_REORD_FILE = VlidationUtil.isEmpty(res.data.component.SERVE_CONTACT_HIS_REORD_FILE) ? this.authComponent.SERVE_CONTACT_HIS_REORD_FILE : res.data.component.SERVE_CONTACT_HIS_REORD_FILE;
                }
                console.log("ServeContactHistory authComp: ", JSON.stringify(this.authComponent));

            }).catch((err) => {
                console.log(err);
            });

        if (this.tabKey === "A") {
            if (!VlidationUtil.isEmpty(PackMatchModule.matchedCasePack)) {
                this.outerServeContact(PackMatchModule.matchedCasePack);
            }
        } else if (this.tabKey === "B") {
            if (!VlidationUtil.isEmpty(PackMatchModule.matchedCasePack) &&
                !VlidationUtil.isEmpty(PackMatchModule.matchedCasePack.custId)) {
                this.innerServeContact(PackMatchModule.matchedCasePack.custId);
            }
        }
    }

    /**
     * 取得服務歷程-內部系統資訊
     * @param custId 受訪者ID
     */
    innerServeContact(custId: string) {
        this.serveGrid.data = [];
        this.serveGrid.columns = this.innerServeColumns;
        this.isLoading = true;
        console.log("custId", custId);
        this.$historyApi.getInnerServeContactUsingPOST(custId)
            .then((resp: AxiosResponse<ServiceHistorygDto[]>) => {
                this.innerServeDataList = [];
                let rowkey = 0;
                this.innerServeDataList = resp.data
                    .map(d => {
                        d["rowKey"] = rowkey++;
                        this.playButtonLoading[rowkey] = false;
                        return d;
                    });
                if (this.isModal) {
                    this.serveGrid.data = this.innerServeDataList;
                    this.serveGrid.pagination = this.serveModalPagination;
                } else {
                    this.serveGrid.data = this.innerServeDataList;
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                this.getDataLength(this.innerServeDataList.length);
                this.isLoading = false;
            });
    }

    /**
     * 
     * @param caseNo 通話內容     */
    handleContent(data: ServiceHistorygDto) {
        this.showQuestionAnswerHistory = true;
        this.questionAnswerParam.CASE_NO = data.caseNo;
        this.questionAnswerParam.GUID = data.guid;
    }

    /**
     * 照會紀錄
     */
    handleCountersignature(data: ServiceHistorygDto) {
        this.notiReocrdvisible = true;
        this.handleInfoData = {
            CASE_LOG_GUID: data.guid,
            CASE_NO: data.caseNo,
            TICKET_ID: '',
            TICKET_TYPE: 'OBD_NOTI_INFO',
            TICKET_TYPE_DESC: '',
        }
    }

    getNotiReocrdvisible(val: boolean) {
        this.notiReocrdvisible = val;
    }

    /**
     * 郵寄紀錄
     * @param packNo 
     */
    handlePostRecord(data: ServiceHistorygDto) {
        this.infPostRecordVisible = true;
        this.caseLogid = data.guid;
    }

    /**
     * 會辦紀錄
     * @param packNo 
     */
    handleInform(data: ServiceHistorygDto) {
        // this.caseLogid = data.guid;
        // this.caseNo = data.caseNo;
        this.infReocrdvisible = true;
        this.handleInfoData = {
            CASE_LOG_GUID: data.guid,
            CASE_NO: data.caseNo,
            TICKET_ID: '',
            TICKET_TYPE: 'OBD_INFO',
            TICKET_TYPE_DESC: '',
        }
    }

    getInfReocrdvisible(val: boolean) {
        this.infReocrdvisible = val;
    }


    /**
     * M+/簡訊紀錄
     * @param packNo 
     */
    handleMPlusMesg(data: ServiceHistorygDto) {
        this.questionAnswerParam.CASE_NO = data.caseNo;
        this.questionAnswerParam.GUID = data.guid;
        this.infMplusSendMessageVisible = true;
    }

    /**
     * MAIL紀錄
     * @param packNo 
     */
    handleMailRecord(data: ServiceHistorygDto) {
        this.questionAnswerParam.CASE_NO = data.caseNo;
        this.questionAnswerParam.GUID = data.guid;
        this.infEmailRecordsVisible = true;
    }

    /**
     * 檔案上傳歷程
     * @param packNo 
     */
    handleUploadFileHistory(data: ServiceHistorygDto) {
        this.caseNo = data.caseNo;
        this.caseLogid = data.guid;
        this.showUploadFileHistory = true;
    }

    /**
     * 錄音檔案播放
     * @param data 
     */
    handleRecordPlayList(data) {
        this.serviceHistorygDto = {...data};
        this.loading = true;
        console.log("錄音檔案播放", data);

        if (!VlidationUtil.isEmpty(data)) {
            this.playButtonLoading[data.rowKey] = true;

            // 打API擷取錄音檔
            this.$historyApi.getRecordsPlayListUsingPOST(({
                codingNo: data.codingNo,
                eduId: data.eduid,
              }) as CallRecordDto)
                .then((resp: AxiosResponse<INumDto[]>) => {
                    this.inumDtoList = resp.data;

                    if (!VlidationUtil.isEmpty(this.inumDtoList)) {
                        if (this.inumDtoList.some(i => !VlidationUtil.isEmpty(i.inum))) {
                            this.callSys = " - ACR";
                        } else {
                            this.callSys = " - EZ";
                        }
                        this.showRecordPlayList = true;
                        this.playButtonLoading[data.rowKey] = false;
                    } else {
                        // 沒有錄音檔跳錯誤訊息：「請由錄音系統調閱錄音」。
                        ErrorModalUtil.modalError(this.$t("recordPlayList_theRecordCanNotReach").toString());
                        // this.playButtonLoading[data.rowKey] = false;
                        this.showRecordPlayList = false;
                    }
                })
                .catch(e => {
                    console.error(e);
                    ErrorModalUtil.modalError(this.$t("recordPlayList_apiFail").toString()); // 網路服務異常
                    this.showRecordPlayList = false;
                })
                .finally(() => {
                    this.playButtonLoading[data.rowKey] = false;
                    this.loading = false;

                });
        }
    }

    // 取得服務歷程-外部系統資訊
    outerServeContact(currentPackNo: CasePackDto) {
        this.serveGrid.data = [];

        this.isLoading = true;
        this.serveInput = {
            SYS_SOURCE: "",
            CUST_ID: currentPackNo.custId
        }
        this.$historyApi.getServeContactUsingPOST(currentPackNo.packNo, this.serveInput).then((resp: AxiosResponse<ServeContactOutput>) => {
            this.serveDataList = JSON.parse(JSON.stringify(resp.data.DataList));
            // 顯示全部區塊
            if (this.isModal) {
                this.serveGrid.data = this.serveDataList;
                this.serveGrid.pagination = this.serveModalPagination;
                this.serveGrid.columns = this.serveModalColumns;
            } else {
                this.serveGrid.data = this.serveDataList;
                this.serveGrid.columns = this.serveColumns;
            }
        }).catch(err => {
            console.error(err);
        }).finally(
            () => {
                this.getDataLength(this.serveDataList ? this.serveDataList.length : 0);
                this.isLoading = false;
            }
        )
    }

    handleTemp(data: ServeContactDataList) {
        this.showQuestionAnswerHistory = true;
        let str = data.Contact_Content;
        let splitStr = str.split(",");
        this.questionAnswerParam.CASE_NO = splitStr[0];
        this.questionAnswerParam.GUID = splitStr[1];
    }

    // 取得回傳的通話內容筆數
    questionAnswerCount(length: number) {
        this.questionAnswerCountNum = length;
        if (this.questionAnswerCountNum == 0) {
            this.showQuestionAnswerHistory = false;
        }
    }

    // 換頁(提供換頁共用，name為要切頁的grid)
    onPageChange(e: FblPageEvent, name: string) {
        if (this[name].data && this[name].data.length > 0) {
            this[name].pagination = e.pagination;
            this[name].sort = e.sort;
        }
    }
    // 將資料比數回傳
    getDataLength(dataLength: number) {
        this.$emit("getLength", dataLength);
    }

    /**
     * 方便聯絡時段字串處理
     * @param visitDate 
     * @returns [民國年日期(YYY/MM/dd), hh:mm]
     */
    visitDateStringProcess(visitDate: string): string[] {
        if (!VlidationUtil.isEmpty(visitDate)) {
            let dateTime = MomentUtil.transformRocYearMonthDayHHMMSS(visitDate); // 民國年日期：「YYY/MM/dd hh:mm:ss」
            let rocDateTimeArray = dateTime.split(" ");
            if (rocDateTimeArray.length != 2) {
                return null;
            }
            let rocDate = rocDateTimeArray[0]; // 民國年日期YYY/MM/dd
            let rocTime = rocDateTimeArray[1]; // hh:mm:ss
            let rocTimeArray = rocTime.split(":");
            if (rocTimeArray.length != 3) {
                return null;
            }
            return [rocDate, [rocTimeArray[0], rocTimeArray[1]].join(":")];
        }
        return null;
    }

    /**
     * 方便聯絡時段字串處理
     * @param visitStartDate 
     * @param visitEndDate 
     */
    visitDateProcess(visitStartDate: string, visitEndDate: string): string {
        let visitStartDateArray = [];
        if (!VlidationUtil.isEmpty(visitStartDate)) {
            visitStartDateArray = this.visitDateStringProcess(visitStartDate); // [民國年日期(YYY/MM/dd), hh:mm]
        }
        let visitEndDateArray = [];
        if (!VlidationUtil.isEmpty(visitEndDate)) {
            visitEndDateArray = this.visitDateStringProcess(visitEndDate); // [民國年日期(YYY/MM/dd), hh:mm]
        }
        // 2.起訖日期其中一欄空值的處理方式請依據第29條規則進行調整，謝謝
        // 2.1.如果起日空值，顯示 (空)~迄日
        if (VlidationUtil.isEmpty(visitStartDateArray) && !VlidationUtil.isEmpty(visitEndDateArray) && visitEndDateArray.length == 2) {
            return [" ~ ", visitEndDateArray.join(" ")].join("");
        }
        // 2.2.如果迄日空值，顯示 起日~(空)
        if (VlidationUtil.isEmpty(visitEndDateArray) && !VlidationUtil.isEmpty(visitStartDateArray) && visitStartDateArray.length == 2) {
            return [visitStartDateArray.join(" "), " ~ "].join("");
        }
        // 2.3.如果起迄日都非空值，顯示 起日~迄日
        if (!VlidationUtil.isEmpty(visitStartDateArray) && visitStartDateArray.length == 2 && !VlidationUtil.isEmpty(visitEndDateArray) && visitEndDateArray.length == 2) {
            if (visitStartDateArray[0] == visitEndDateArray[0]) {
                return [visitStartDateArray.join(" "), " ~ ", visitEndDateArray[1]].join(""); // 日期相等，只需要顯示一次
            } else {
                return [visitStartDateArray.join(" "), " ~ ", visitEndDateArray.join(" ")].join("");
            }
        }
        // 2.4.如果起迄日都空值，直接顯示(空)，不含"~"
        if (VlidationUtil.isEmpty(visitStartDateArray) && VlidationUtil.isEmpty(visitEndDateArray)) {
            return "";
        }
        return "";
    }
    // 處理單彈跳視窗
    openHandleList(data) {
        this.showHandleNoInfo = true;
        this.handleInfoData = data.row.data[data.column.template][data.index];
    }

    //滑鼠移出cell，detail消失
    handleEllipsisMouseLeave() {
        message.destroy();
    }

    //滑鼠點擊該cell，顯示detail
    handleEllipsisClick($event, data) {
        message.destroy();
        message.config({
            duration: 0,
            top: `50px`,
        });
        message.info(data);
        //取得message 的html元件
        let antDesignMessage = document.getElementsByClassName('ant-message');
        //變更messae顯示位置
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y)
        message.config({
            duration: 3,
            top: `50px`,
        });
    }

    checkEmpty(data) {
        return !VlidationUtil.isEmpty(data);
    }
}