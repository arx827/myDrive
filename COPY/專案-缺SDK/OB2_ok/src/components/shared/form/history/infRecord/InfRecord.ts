import { AxiosResponse } from "axios";
import { Component, Prop, Vue } from "vue-property-decorator";
import { ResponseEntity, InfInfoGrid, InfDto } from "@fubonlife/obd-api-axios-sdk";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import {
    FblColumn,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblRow,
} from "@/components/shared/data-grid/models";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
// import InfInfoGrid from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import MessageUtil from "@/assets/config/MessageUtil";
@Component({
    components: {
        FblDataGrid
    }
})
export default class InfRecord extends Vue {

    @Prop()
    custId: string;
    @Prop()
    caseLogId: string;

    @Prop()
    caseNo:string;

    isLoading: boolean = false;

    reload() {
        this.isLoading = true;
        let infDto: InfDto = {}
        //透過custId搜尋其會辦紀錄
        infDto.caseNo = this.caseNo

        if (!ValidationUtil.isEmpty(this.caseLogId)) {//透過caseLogId搜尋會辦紀錄
            infDto.caseLogId = this.caseLogId
        }
        if (!ValidationUtil.isEmpty(infDto.caseNo)) {//透過custId搜尋其會辦紀錄
            this.$informApi.infRecordsGetUsingPOST(infDto
            )
                .then((resp) => {
                    this.grid.data = resp.data;
                }).catch(e => {
                    console.log(e)
                }).finally(() => {
                    this.isLoading = false;
                })
        } else {
            return
        }

    }
    /**
     * 取得後端會辦紀錄資料
     */
    created() {
        this.reload();
    }

    // ================Grid事件==============================================

    onInspectClick(row: FblRow<InfInfoGrid>) {
        this.$informApi.showInfPdfUsingPOST(row.data.infFileId, { responseType: 'blob' }).then((resp: AxiosResponse<ResponseEntity>) => {
            this.dealDownLoadData(resp.data);
        }).catch(error => console.log(error));
    }

    
    // 會辦紀錄顯示
    grid: FblPDataGridHolder<InfInfoGrid> = {
        rowKey: "sequence",
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
        scroll:{x:50,y:500},
        columns: [
            {
                type: FblColumnType.PLAIN,
                title: this.$t("eventS_serialNumber").toString(),//序號
                property: "sequence",
                width: 60
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_policyNo").toString(),//保單號碼
                property: "casePolicy",
                width: 130
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_packNo").toString(),//名單序號
                property: "packNo",
                width: 90
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_custId").toString(),//受訪者ID
                property: "custId",
                width: 90

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("pedding_custName").toString(),//受訪者姓名
                property: "custName",
                width: 90
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_infDep").toString(),//"會辦部門"
                property: "departmentId",
                width: 90
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_infTypeId").toString(),//"會辦項目"
                property: "infTypeId",
                width: 60
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_infSubTyp").toString(),//會辦項目
                property: "infSubTyp",
                width: CommonUtil.countColumnWidth(8)
            }, {
                type: FblColumnType.ELLIPSIS,
                title: this.$t("infPage_infContent").toString(),//會辦內容
                property: "infContent",
                width: CommonUtil.countColumnWidth(20)
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_reviewStatus").toString(),//"覆核狀態"
                property: "reviewSettingStatus",
                width: 70
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_informInfoId").toString(),//會辦單號
                property: "infInfoId",
                width: 100,
                inspect: (data: InfInfoGrid) => {
                    if (data.infTypeId == "通報類") {
                        return true;
                    }
                }

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_infDate").toString(),//會辦日期
                property: "createDate",
                width: 100,
                formatter: (data: InfInfoGrid) => {

                    if (!ValidationUtil.isEmpty(data.createDate)) {
                        return MomentUtil.transformRocYearMonthDay(data.createDate)
                    } else {
                        return "";
                    }
                }
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_reminderDate").toString(),//會辦催辦日
                property: "reminderDate",
                width: 100,
                formatter: (data: InfInfoGrid) => {

                    if (!ValidationUtil.isEmpty(data.reminderDate)) {
                        return MomentUtil.transformRocYearMonthDay(data.reminderDate)
                    } else {
                        return "";
                    }
                }
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_expiryDate").toString(),//會辦到期日
                property: "infExpireDate",
                width: 100,
                formatter: (data: InfInfoGrid) => {

                    if (!ValidationUtil.isEmpty(data.infExpireDate)) {
                        return MomentUtil.transformRocYearMonthDay(data.infExpireDate)
                    } else {
                        return "";
                    }
                }

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_replyDate").toString(),//會辦回覆日
                property: "replyDate",
                width: 100,
                formatter: (data: InfInfoGrid) => {
                    if (!ValidationUtil.isEmpty(data.replyDate)) {
                        return MomentUtil.transformRocYearMonthDay(data.replyDate)
                    } else {
                        return "";
                    }
                }
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_informHandleStatus").toString(),//"會辦處理結果"
                property: "handleStatus",
                width: 70
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infPage_replyContent").toString(),//"會辦回覆內容"
                property: "replyContent",
                width: 100
            }
        ]
    };

    /**
   * 換行
   */
    handleEllipsisClick($event, data) {
        message.destroy();
        message.config({
            duration: 0,
            top: `50px`
        });

        //摺疊字串，依照自訂字數摺疊
        var wordWrap: string = this.wordWrap(data, 20);
        var arrWordWrap: Array<string> = wordWrap.split("\n");

        // 整理 message open 需要參數
        var arrVnode: Array<VNode> = [];
        arrWordWrap.forEach((wordStr) => {
            arrVnode.push(this.$createElement("div", { attrs: { align: "left" } }, wordStr));
        });
        var wordWrapMessage: VNode = this.$createElement("div", arrVnode);
        var messageOptions: MessageOptions = { content: wordWrapMessage };
        message.open(messageOptions);

        //取得message 的html元件
        let antDesignMessage = document.getElementsByClassName('ant-message');
        //變更messae顯示位置
        MessageUtil.changePosition(antDesignMessage, $event.x, $event.y);
    }
    /**
     * @description 摺疊字串，依照自訂字數摺疊
     * @param str 總字串
     * @param maxWidth 欲摺疊字數
     * @returns 
     */
    wordWrap(str, maxWidth) {
        var newLineStr = "\n";
        var res = '';

        var testWhite = (x) => {
            var white = new RegExp(/^\s$/);
            return white.test(x.charAt(0));
        }

        while (str.length > maxWidth) {
            var found = false;
            // Inserts new line at first whitespace of the line
            for (var i = maxWidth - 1; i >= 0; i--) {
                if (testWhite(str.charAt(i))) {
                    res = res + [str.slice(0, i), newLineStr].join('');
                    str = str.slice(i + 1);
                    found = true;
                    break;
                }
            }
            // Inserts new line at maxWidth position, the word is too long to wrap
            if (!found) {
                res += [str.slice(0, maxWidth), newLineStr].join('');
                str = str.slice(maxWidth);
            }

        }

        return res + str;
    }

    // 滑鼠離開 message 顯示消失
    handleEllipsisMouseLeave() {
        message.destroy();
    }
    /**
     * 處理後端回傳的下載內容並開啟
     * @param resData 

     */
    dealDownLoadData(resData) {
        try {
            let blob;
            if (resData instanceof Blob) {
                blob = resData;
            } else {
                blob = new Blob([resData], { type: resData.type });
            }
            var url = window.URL.createObjectURL(blob);

            window.open(url);
        } catch (e) {
            console.error(e);

        }
    }
}