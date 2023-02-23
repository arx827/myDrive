import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblActionEvent, FblColumn, FblColumnType, FblPageEvent, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import MomentUtil from "@/assets/config/MomentUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import { TelChangeDetailGrid, TelChangeDetailInput, TelChangeInput } from "@fubonlife/obd-api-axios-sdk";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";

@Component({components: { FblDataGrid }})
export default class TelChangeDetail extends Vue {

    @Prop()
    inputData; // 電話變更查詢條件

    // 載入畫面
    loading = false;

    // 電話變更明細查詢條件
    telChangeDetailInput: TelChangeDetailInput = {
        tmrId:'',
        telChangeStartDate:'',
        telChangeEndDate:'',
    }

    // 報表查詢條件資訊
    telChangeDetailInfo: {telChangeStartDate?:String, telChangeEndDate?:String} =  {
        telChangeStartDate:'',
        telChangeEndDate:'',
    }

    // data grid Setting
    grid: FblPDataGridHolder<TelChangeDetailGrid> = {
        rowKey: "id",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.PLAIN,
                property: "createDate",
                title: this.$t('handleInfoForm_insDt').toString(), //受理日期
                width: 160,
                align: 'center',
                formatter(data: TelChangeDetailGrid) {
                    if (VlidationUtil.isEmpty(data.createDate)) {
                      return "";
                    } else {
                        return MomentUtil.transformRocYearMonthDay(data.createDate);
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "divName",
                title: this.$t('global_division').toString(), //科別
                width: 150,
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "userName",
                title: this.$t('global_telemarketer').toString(), //電訪員
                width: CommonUtil.countColumnWidth(6),
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "custType",
                title: this.$t('teleResultArea_grid_custType').toString(), //受訪者身分別
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('handleInfoForm_custId').toString(), //受訪者ID
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "custName",
                title: this.$t('handleInfoForm_infCustName').toString(), //受訪者姓名
                align: 'center',
                width: CommonUtil.countColumnWidth(7),
            },
            {
                type: FblColumnType.PLAIN,
                property: "phoneNo",
                title: this.$t('textMessage_sendMsgGrid_telePhone').toString(), //電話號碼
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "sourceCaseNo",
                title: this.$t('telChangeDetailForm_sourceCaseNo').toString(), //電話所屬保單
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "agreeRecord",
                title: this.$t('telChangeDetailForm_agreeRecord').toString(), //人員註記同意宣告內容
                align: 'center',
                width: 140,
                formatter(data: TelChangeDetailGrid) {
                    if (VlidationUtil.isEmpty(data.agreeRecord)) {
                      return "";
                    } else {
                        if(data.agreeRecord == 'Y') {
                            return '同意 ';
                        } else{
                            return '不同意';
                        }
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "changeMobile",
                title: this.$t('textMessage_phoneNum').toString(), //手機號碼
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "changeEmail",
                title: this.$t('telChangeDetailForm_changeEmail').toString(), //電子信箱
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('telChangeDetailForm_policyNo').toString(), //變更保單號碼 (要保單號碼+保單序號+重複別)
                align: 'center',
                width: 200,
                formatter(data: TelChangeDetailGrid){
                    if(!VlidationUtil.isEmpty(data.policyNo)) {
                        if(!VlidationUtil.isEmpty(data.idDup)) {
                            return data.policyNo + '-' + data.policySeq + '-' + data.idDup;
                        } else if (!VlidationUtil.isEmpty(data.policySeq)) {
                            return data.policyNo + '-' + data.policySeq;
                        } else {
                            return data.policyNo;
                        }
                    } else {
                        return '';
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "agreeEnotice",
                title: this.$t('telChangeDetailForm_agreeEnotice').toString(), //電子通知單服務
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "agreeEnoticeMethod",
                title: this.$t('telChangeDetailForm_agreeEnoticeMethod').toString(), //電子通知單服務通知方式
                align: 'center',
                width: 140,
                formatter(data: TelChangeDetailGrid) {
                    if (data.agreeEnotice == 'Y') {
                        if(!VlidationUtil.isEmpty(data.changeEmail)) {
                            return data.changeEmail;
                        } else {
                            return data.changeMobile;
                        }
                    } else {
                        return 'N';
                    }

                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "reviewStatus",
                title: this.$t('handleInfoForm_cdnameRw').toString(), //覆核狀態
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "reviewProcessResult",
                title: this.$t('handleInfoForm_naMemoTrs').toString(), //處理結果
                align: 'center',
                width: 200,
            },
            {
                type: FblColumnType.PLAIN,
                property: "reviewerName",
                title: this.$t('telChangeDetailForm_reviewerName').toString(), //覆核者
                align: 'center',
                width: 140,
            },
            {
                type: FblColumnType.PLAIN,
                property: "caseNoCount",
                title: this.$t('telChangeDetailForm_caseNoCount').toString(), //覆核不通過次數
                align: 'center',
                width: 140,
                formatter(data: TelChangeDetailGrid){
                    if (data.caseNoCount == '0') {
                        return '';
                    } else {
                        return data.caseNoCount;
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "coreStatus",
                title: this.$t('telChangeDetailForm_coreStatus').toString(), //回寫400結果
                align: 'center',
                width: 150,
            },
            {
                type: FblColumnType.PLAIN,
                property: "sendMail",
                title: this.$t('telChangeDetailForm_sendMail').toString(), //發送客戶通知
                align: 'center',
                width: 140,
                formatter(data: TelChangeDetailGrid) {
                    if (VlidationUtil.isEmpty(data.sendMail)) {
                      return '未發送';
                    } else {
                        if(data.sendMail == 'Y') {
                            return '已發送';
                        } else{
                            return '發送失敗';
                        }
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                property: "reviewCloseDate",
                title: this.$t('telChangeDetailForm_reviewCloseDate').toString(), //覆核結案日期
                align: 'center',
                width: 160,
                formatter(data: TelChangeDetailGrid) {
                    if (VlidationUtil.isEmpty(data.reviewCloseDate)) {
                      return "";
                    } else {
                        return MomentUtil.transformRocYearMonthDay(data.reviewCloseDate);
                    }
                }
            },
        ],
    };

    created(){
        // 把查詢日期條件轉成民國年並帶到電話變更明細畫面
        this.telChangeDetailInfo = {
            telChangeStartDate: MomentUtil.transformRocYearMonthDay(this.inputData.telChangeStartDate),
            telChangeEndDate: MomentUtil.transformRocYearMonthDay(this.inputData.telChangeEndDate),
        }
        // 查詢電話變更明細資料
        this.findTeleChangeDetail();        
    }

    reload() {
        LoadingUtil.show();
        this.$telChangeReportApi.findTelChangeDetailUsingPOST(this.telChangeDetailInput)
        .then((resp) => {

            if (resp.data != null && resp.data.success) {
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.telChangeDetailGridPage.totalElements);
                this.grid.data = resp.data.telChangeDetailGridPage.content;
                this.grid.pagination = p;
                if (p.total == 0) {
                    MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                }
            } else {
                // 通話時數統計查詢失敗
                ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
            }

        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            LoadingUtil.close();
        })
    }

    // 查詢電話變更明細資料
    findTeleChangeDetail() {

        this.telChangeDetailInput = {
            tmrId: this.inputData.tmrId,
            telChangeStartDate: this.inputData.telChangeStartDate,
            telChangeEndDate: this.inputData.telChangeEndDate,
        }

        this.reload();
    }

    // 監聽是否點選其他電訪員的電訪應訪件數
    @Watch("inputData")
    onDataChange() {
      this.findTeleChangeDetail();
    }

    // 換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
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

}