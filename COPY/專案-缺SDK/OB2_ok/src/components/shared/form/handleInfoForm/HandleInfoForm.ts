import { HandleInput, HandleNoList, HandleResponseDto, ResponseEntity } from "@fubonlife/obd-api-axios-sdk";
import { Vue, Component, Prop } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { FblColumn, FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import MomentUtil from "@/assets/config/MomentUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({components: { FblDataGrid }})
export default class HandleInfoForm extends Vue {

    @Prop()
    themeColor:string;

    @Prop()
    data:HandleNoList;

    @Prop()
    name;

    inputData:HandleInput = {};

    handleNoData:HandleResponseDto = {};

    spinning = true;

    handleDataMap: Map<string, Object> = new Map();

    handleDataColumnsMap: Map<string, Object> = new Map();

    //BK Columns
    public bkColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CCATTCD',
            title: this.$t("handleInfoForm_ccattcd").toString(), //處理單編號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'insDT',
            title: this.$t("handleInfoForm_insDt").toString(), //受理日期
            width: 160,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.insDT)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.insDT);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PolNo',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CusName',
            title: this.$t("handleInfoForm_custName").toString(), //來電者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'Notes',
            title: this.$t("handleInfoForm_bkNotes").toString(), //來電意見
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'MemoTrs',
            title: this.$t("handleInfoForm_bkMemoTrs").toString(), //處理情形
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'TrsName',
            title: this.$t("handleInfoForm_trsName").toString(), //處理人員
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'FlagClsDes',
            title: this.$t("handleInfoForm_flagClsDes").toString(), //結案狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CaseStatusDes',
            title: this.$t("handleInfoForm_caseStatusDes").toString(), //案件狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ClsName',
            title: this.$t("handleInfoForm_clsName").toString(), //結案人員
            width: 110,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CodingNo',
            title: this.$t("handleInfoForm_codingNo").toString(), //服務紀錄編號
            width: 120,
        },
        
    ]

    //NA Columns
    public naColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CCATTCD',
            title: this.$t("handleInfoForm_ccattcd").toString(), //處理單編號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'insDT',
            title: this.$t("handleInfoForm_insDt").toString(), //受理日期
            width: 200,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.insDT)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.insDT);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PolNo',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CusName',
            title: this.$t("handleInfoForm_custName").toString(), //來電者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'AGName',
            title: this.$t("handleInfoForm_agName").toString(), //AG姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'AGUnit',
            title: this.$t("handleInfoForm_agUnit").toString(), //單位
            width: 100,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'Notes',
            title: this.$t("handleInfoForm_naNotes").toString(), //聯絡事項
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'MemoTrs',
            title: this.$t("handleInfoForm_naMemoTrs").toString(), //處理結果
            width: CommonUtil.countColumnWidth(20),
        },
        // 經討論後目前無需此兩個欄位資料，但怕後續需要，故只先在前端註解
        // {
        //     type: FblColumnType.PLAIN,
        //     property: 'FlgRepDes',
        //     title: this.$t("handleInfoForm_flgRepDes").toString(), //處理結果(AG)
        //     width: 100,
        // },
        // {
        //     type: FblColumnType.ELLIPSIS,
        //     property: 'MemoRep',
        //     title: this.$t("handleInfoForm_naMemoRep").toString(), //回覆內容(AG)
        //     width: CommonUtil.countColumnWidth(20),
        // },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'TrsName',
            title: this.$t("handleInfoForm_trsName").toString(), //處理人員
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'FlagClsDes',
            title: this.$t("handleInfoForm_flagClsDes").toString(), //結案狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CaseStatusDes',
            title: this.$t("handleInfoForm_caseStatusDes").toString(), //案件狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ClsName',
            title: this.$t("handleInfoForm_clsName").toString(), //結案人員
            width: 110,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CodingNo',
            title: this.$t("handleInfoForm_codingNo").toString(), //服務紀錄編號
            width: 120,
        },
        
    ]

    //GT Columns
    public gtColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CCATTCD',
            title: this.$t("handleInfoForm_ccattcd").toString(), //處理單編號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'insDT',
            title: this.$t("handleInfoForm_insDt").toString(), //受理日期
            width: 160,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.insDT)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.insDT);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PolNo',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CusName',
            title: this.$t("handleInfoForm_custName").toString(), //來電者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'TbTypeDes',
            title: this.$t("handleInfoForm_tbTypeDesc").toString(), //開單方式
            width: 120,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'TbList',
            title: this.$t("handleInfoForm_tbList").toString(), //表單名稱
            width: 120,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'Notes',
            title: this.$t("handleInfoForm_gtNotes").toString(), //備註
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'TrsName',
            title: this.$t("handleInfoForm_trsName").toString(), //處理人員
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'FlagClsDes',
            title: this.$t("handleInfoForm_flagClsDes").toString(), //結案狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CaseStatusDes',
            title: this.$t("handleInfoForm_caseStatusDes").toString(), //案件狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ClsName',
            title: this.$t("handleInfoForm_clsName").toString(), //結案人員
            width: 110,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CodingNo',
            title: this.$t("handleInfoForm_codingNo").toString(), //服務紀錄編號
            width: 120,
        },
        
    ]

    //AP Columns
    public apColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CCATTCD',
            title: this.$t("handleInfoForm_ccattcd").toString(), //處理單編號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'insDT',
            title: this.$t("handleInfoForm_insDt").toString(), //受理日期
            width: 160,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.insDT)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.insDT);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PolNo',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CusName',
            title: this.$t("handleInfoForm_custName").toString(), //來電者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'A3ItemDes',
            title: this.$t("handleInfoForm_a3ItemDes").toString(), //知會項目
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'A3DeptDes',
            title: this.$t("handleInfoForm_a3DeptDes").toString(), //知會部門
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'APTName',
            title: this.$t("handleInfoForm_aptName").toString(), //承辦窗口
            width: 100,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'Notes',
            title: this.$t("handleInfoForm_apNotes").toString(), //備註內容
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'FlgRepDes',
            title: this.$t("handleInfoForm_flgRepDes").toString(), //處理結果(承辦)
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'MemoRep',
            title: this.$t("handleInfoForm_memoRep").toString(), //回覆內容(承辦)
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'TrsName',
            title: this.$t("handleInfoForm_trsName").toString(), //處理人員
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'FlagClsDes',
            title: this.$t("handleInfoForm_flagClsDes").toString(), //結案狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CaseStatusDes',
            title: this.$t("handleInfoForm_caseStatusDes").toString(), //案件狀態
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ClsName',
            title: this.$t("handleInfoForm_clsName").toString(), //結案人員
            width: 110,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CodingNo',
            title: this.$t("handleInfoForm_codingNo").toString(), //服務紀錄編號
            width: 120,
        },
    ]

    //OBD INF會辦 Columns
    public obdInfColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CASE_POLICY',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PACK_NO',
            title: this.$t("handleInfoForm_packNo").toString(), //名單序號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CUST_ID',
            title: this.$t("handleInfoForm_custId").toString(), //受訪者ID
            width: 110,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CUST_NAME',
            title: this.$t("handleInfoForm_infCustName").toString(), //受訪者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'INF_DEPT_NAME',
            title: this.$t("handleInfoForm_infDeptName").toString(), //會辦部門
            width: 120,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'INF_TYPE_DESC',
            title: this.$t("handleInfoForm_infTypeDesc").toString(), //會辦類型
            width: 100,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'ITEM',
            title: this.$t("handleInfoForm_infItem").toString(), //會辦項目
            width: 100,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'INF_CONTENT',
            title: this.$t("handleInfoForm_infContent").toString(), //會辦內容
            width: CommonUtil.countColumnWidth(20),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CDNAME_RW',
            title: this.$t("handleInfoForm_cdnameRw").toString(), //覆核狀態
            width: 100,
        },
        {
            type: FblColumnType.TEMPLATE,
            property: 'INF_INFO_ID',
            template: 'infId',
            title: this.$t("handleInfoForm_informInfoId").toString(), //會辦單號
            width: 140,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'SEND_DATE',
            title: this.$t("handleInfoForm_sendDate").toString(), //會辦日期
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.SEND_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.SEND_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'REMINDER_DATE',
            title: this.$t("handleInfoForm_reminderDate").toString(), //會辦催辦日
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.REMINDER_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.REMINDER_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'INF_EXPIRE_DATE',
            title: this.$t("handleInfoForm_expireDate").toString(), //會辦到期日
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.INF_EXPIRE_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.INF_EXPIRE_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'REPLY_DATE',
            title: this.$t("handleInfoForm_replyDate").toString(), //會辦回覆日
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.REPLY_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.REPLY_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CDNAME_HANDLE',
            title: this.$t("handleInfoForm_cdnameHandle").toString(), //會辦處理結果
            width: 120,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'REPLY_CONTENT',
            title: this.$t("infPage_replyContent").toString(), //會辦回覆內容
            width: CommonUtil.countColumnWidth(20),
        },
    ]

    //OBD NOTI照會 Columns
    public obdNotiColumns: FblColumn<any>[] = [
        {
            type: FblColumnType.PLAIN,
            property: 'CASE_POLICY',
            title: this.$t("handleInfoForm_polNo").toString(), //保單號碼
            width: 150,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'PACK_NO',
            title: this.$t("handleInfoForm_packNo").toString(), //名單序號
            width: 160,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'CUST_ID',
            title: this.$t("handleInfoForm_custId").toString(), //受訪者ID
            width: 110,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'CUST_NAME',
            title: this.$t("handleInfoForm_infCustName").toString(), //受訪者姓名
            width: CommonUtil.countColumnWidth(7),
        },
        {
            type: FblColumnType.PLAIN,
            property: 'AGENT_UNIT_NAME',
            title: this.$t("handleInfoForm_agentUnitName").toString(), //業務單位
            width: 120,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'MAJOR_TYPE_DESC',
            title: this.$t("handleInfoForm_majorTypeDesc").toString(), //照會主類別/照會次類別
            width: 100,
        },
        
        {
            type: FblColumnType.PLAIN,
            property: 'REVIEW_STATUS',
            title: this.$t("handleInfoForm_cdnameRw").toString(), //覆核狀態
            width: 100,
        },
        {
            type: FblColumnType.TEMPLATE,
            property: 'NOTI_INFO_ID',
            template: 'notiId',
            title: this.$t("notificationBasic_notiInfoId").toString(), //照會單號
            width: 150,
        },
        {
            type: FblColumnType.PLAIN,
            property: 'SEND_DATE',
            title: this.$t("notificationInfo_notiDate").toString(), //照會日期
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.SEND_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.SEND_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'REMINDER_DATE',
            title: this.$t("notificationInfo_reminderDate").toString(), //照會催辦日
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.REMINDER_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.REMINDER_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'NOTI_EXPIRE_DATE',
            title: this.$t("notificationInfo_expireDate").toString(), //照會到期日
            width: 100,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.NOTI_EXPIRE_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.NOTI_EXPIRE_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'REPLY_DATE',
            title: this.$t("notification_replyDate").toString(), //照會回覆日
            width: 110,
            formatter: (data: any) => {
                if (VlidationUtil.isEmpty(data.REPLY_DATE)) {
                    return "";
                } else {
                    return MomentUtil.transformRocYearMonthDay(data.REPLY_DATE);
                }
            }
        },
        {
            type: FblColumnType.PLAIN,
            property: 'HANDLE_STATUS',
            title: this.$t("handleInfoForm_notiHandleStatus").toString(), //照會處理結果
            width: 120,
        },
        {
            type: FblColumnType.ELLIPSIS,
            property: 'REPLY_CONTENT',
            title: this.$t("handleInfoForm_notiReplyContent").toString(), //照會回覆內容
            width: CommonUtil.countColumnWidth(20),
        },
    ]

    public handleInfoGrid: FblPDataGridHolder<HandleResponseDto> = {
        rowKey: 'CCATTCD',
        data: [],
        pagination: {
            current: 1,
            pageSize: 15,
            total: 0
        },
        columns: [],
    }

    created(){
        // 測試
        // this.data.TICKET_ID = "2202181209_000029_I";
        // this.data.TICKET_TYPE = "OBD_INFO";
        // this.data.CASE_NO = "373979";

        this.handleDataColumnsMap.set('BK',this.bkColumns);
        this.handleDataColumnsMap.set('NA',this.naColumns);
        this.handleDataColumnsMap.set('GT',this.gtColumns);
        this.handleDataColumnsMap.set('AP',this.apColumns);
        this.handleDataColumnsMap.set('OBD_INFO',this.obdInfColumns);
        this.handleDataColumnsMap.set('OBD_NOTI_INFO',this.obdNotiColumns);

        this.inputData.TICKET_ID = this.data.TICKET_ID;
        this.inputData.TICKET_TYPE = this.data.TICKET_TYPE;
        if(this.data.TICKET_TYPE === "OBD_INFO" ) {
            this.inputData.CASE_NO = this.data.CASE_NO;
            this.inputData.CASE_LOG_ID = this.data.CASE_LOG_GUID;
        } else if (this.data.TICKET_TYPE === "OBD_NOTI_INFO"){
            this.inputData.TICKET_TYPE = "OBD_NOTICE";
            this.inputData.CASE_NO = this.data.CASE_NO;
            this.inputData.CASE_LOG_ID = this.data.CASE_LOG_GUID;
        }
        this.$historyApi.getHandleInfoUsingPOST(this.inputData).then((resp:AxiosResponse<HandleResponseDto>) => {
            this.handleNoData = resp.data;
            console.log("success", this.handleNoData);
            this.handleDataMap =  resp.data.handleData as Map<string, Object>;
            this.handleInfoGrid.data = this.handleDataMap[this.data.TICKET_TYPE];
            
            if (this.data.TICKET_TYPE === 'BK') {
                this.handleInfoGrid.columns = this.bkColumns;
            } else if (this.data.TICKET_TYPE === 'NA') {
                this.handleInfoGrid.columns = this.naColumns;
            } else if (this.data.TICKET_TYPE === 'GT') {
                this.handleInfoGrid.columns = this.gtColumns;
            } else if (this.data.TICKET_TYPE === 'AP') {
                this.handleInfoGrid.columns = this.apColumns;
            } else if (this.data.TICKET_TYPE === 'OBD_INFO') {
                this.handleInfoGrid.columns = this.obdInfColumns;
                this.handleInfoGrid.rowKey = 'INF_INFO_ID';
            } else {
                // OBD_NOTI 照會
                this.handleInfoGrid.columns = this.obdNotiColumns;
                this.handleInfoGrid.rowKey = 'NOTI_INFO_ID';
            }

            this.handleDataColumnsMap.get(this.data.TICKET_TYPE);

            this.spinning = false;
        }).catch((error) =>{
            console.log(error);
            this.spinning = false;
            // 關閉視窗
            this.$emit('getVisible', false);
        }).finally(() => {});
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
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y, 300)
        message.config({
        duration: 3,
        top: `50px`,
        });
    }

    onPdfOpen(data: any) {
        this.spinning = true;
        let file = data.substring(data.lastIndexOf("/")+1);
        let fileId = file.substring(0,file.indexOf("."));
        this.$informApi.showInfPdfUsingPOST(fileId, { responseType: 'blob' }).then((resp: AxiosResponse<ResponseEntity>) => {
            this.dealDownLoadData(resp.data);
        }).catch(error => console.log(error)
        ).finally(() => this.spinning = false);
    }

    /**
     * 處理後端回傳的下載內容
     * @param resData 
     * @param fileName 
     */
    dealDownLoadData(resData) {
        try {
            let blob;
            if (resData instanceof Blob) {
                blob = resData;
                console.log('blob',blob);
            } else {
                blob = new Blob([resData], { type: resData.type });
                console.log('blob',blob);
            }
            var url = window.URL.createObjectURL(blob);
            console.log(url);
            var a = window.open(url + "#toolbar=0" , "Inf", "config='height=500px,width=500px'");
          } catch (e) {
            console.error(e);
          }
    }
}