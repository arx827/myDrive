import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType } from "@/components/shared/data-grid/models";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { CaseCallUpHistoryDto, GetRecordUrlByInumResponse, INumDto, ServiceHistorygDto, TobdRecordHistoryDto, TobdRecordHistoryDtoActionEnum } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({ components: { FblDataGrid, DragModal } })
export default class RecordPlayList extends Vue {
    // 錄音檔撥放清單
    @Prop()
    inumDtoList: INumDto[];

    @Prop({ default: false })
    loading: boolean;

    @Prop()
    serviceHistorygDto: ServiceHistorygDto;

    @Prop()
    caseCallUpHistoryDto: CaseCallUpHistoryDto;

    @Prop()
    tobdRecordHistoryDtoFromInform: TobdRecordHistoryDto;

    isLoading: boolean = false;

    showRecordPlayer: boolean = false;

    recordPlayUrl: string = "";

    public inumDtoListGrid = {
        rowKey: 'rowKey',
        data: [],
        pagination: {
            current: 1,
            pageSize: 5,
            total: 0
        },
        columns: [
            {
                type: FblColumnType.TEMPLATE,
                property: 'inum',
                template: 'inumTemp',
                title: this.$t("recordPlayList_inum").toString(), // 錄音檔
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
            {
                type: FblColumnType.PLAIN,
                property: 'seconds',
                title: this.$t("recordPlayList_seconds").toString(), // 秒數
                width: CommonUtil.countColumnWidth(10),
                align: "center",
            },
        ],
    };

    /**
     * 監聽外層loading有沒有變動，如有變動將啟動內層loading並判斷是否有reload
     */
    @Watch("loading")
    onDataChange() {
        this.isLoading = this.loading;
        // 當loading為false代表關閉，不須再reload一次
        if (this.loading) {
            this.reload();
        }

    }

    /**
     * 頁面啟動第一動
     */
    created() {
        // reload資料
        this.reload();
    }
    /**
     * 整理資料
     */
    reload() {
        let rowKey = 0;
        this.inumDtoListGrid.data = this.inumDtoList.map(i => {
            i["rowKey"] = rowKey++;
            return i;
        });
        // 每次重新整理須把撥放部分關閉
        this.showRecordPlayer = false;
        console.log("this.inumDtoListGrid.data", this.inumDtoListGrid.data);
    }

    /**
     * 透過iNum打API找網址開啟網頁聽錄音檔
     * @param iNumDto 
     */
    openInumRecordUrl(iNumDto: INumDto) {
        this.recordlayLogging(iNumDto);
        this.isLoading = true;
        this.showRecordPlayer = false;
        this.$historyApi.getRecordUrlByInumUsingPOST(iNumDto.inum).then((resp: AxiosResponse<GetRecordUrlByInumResponse>) => {
            if (resp.data.apiStatus) {
                // window.open(resp.data.recordUrl, "", "width=323,height=200");
                this.recordPlayUrl = resp.data.recordUrl;
                this.showRecordPlayer = true;
            } else {
                // ErrorModalUtil.modalError(this.$t("recordPlayList_brokenVendorLink").toString()); // 廠商連結毀損
                ErrorModalUtil.modalError(this.$t("recordPlayList_theRecordCanNotReach").toString()); // 請由錄音系統調閱錄音
            }
        }).catch(e => {
            console.log(e);
            // ErrorModalUtil.modalError(this.$t("recordPlayList_brokenSystemLink").toString()); // 系統連結毀損
            ErrorModalUtil.modalError(this.$t("recordPlayList_theRecordCanNotReach").toString()); // 請由錄音系統調閱錄音
        }).finally(() => this.isLoading = false);
    }

    /**
     * 透過recordUrl開啟網頁聽錄音檔
     * @param iNumDto 
     */
    openEduidRecordUrl(iNumDto: INumDto) {
        this.recordlayLogging(iNumDto);
        // window.open(recordUrl, "", "width=323,height=200");
        this.recordPlayUrl = iNumDto.recordUrl;
        this.showRecordPlayer = true;
    }

    /**
     * 記錄播放錄音檔行為
     * @param iNumDto
     */
    recordlayLogging(iNumDto: INumDto) {
        let tobdRecordHistoryDto: TobdRecordHistoryDto;
        if (!VlidationUtil.isEmpty(this.serviceHistorygDto)) {
            tobdRecordHistoryDto = {
                action: TobdRecordHistoryDtoActionEnum.P,
                casePolicy: this.serviceHistorygDto.casePolicy,
                custName: this.serviceHistorygDto.custName,
                eduId: iNumDto.eduid,
                extNo: this.serviceHistorygDto.csrExtNo,
                source: this.$t("recordPlayList_serveContactHistroy").toString(), // 服務歷程
                telNo: this.serviceHistorygDto.dialNum.toString(),
                tmrId: this.serviceHistorygDto.createId
            };
            this.$recordApi.loggingUsingPOST(tobdRecordHistoryDto);
        }

        if (!VlidationUtil.isEmpty(this.caseCallUpHistoryDto)) {
            tobdRecordHistoryDto = {
                action: TobdRecordHistoryDtoActionEnum.P,
                casePolicy: this.caseCallUpHistoryDto.casePolicy,
                custName: this.caseCallUpHistoryDto.contactPersonName,
                eduId: iNumDto.eduid,
                source: this.$t("recordPlayList_caseCallUpHistory").toString(), // 撥號歷程
                telNo: this.caseCallUpHistoryDto.phoneNo,
            };
            this.$recordApi.loggingUsingPOST(tobdRecordHistoryDto);
        }

        if (!VlidationUtil.isEmpty(this.tobdRecordHistoryDtoFromInform)) {
            tobdRecordHistoryDto = {
                action: TobdRecordHistoryDtoActionEnum.P,
                eduId: iNumDto.eduid,
                source: this.$t("recordPlayList_phoneChangeModal").toString(), // 電話變更覆核
                casePolicy: this.tobdRecordHistoryDtoFromInform.casePolicy,
            };
            this.$recordApi.loggingUsingPOST(tobdRecordHistoryDto);
        }
    }

}