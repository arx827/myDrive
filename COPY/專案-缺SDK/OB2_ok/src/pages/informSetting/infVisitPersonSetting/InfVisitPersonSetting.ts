import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { VNode } from "vue/types/umd";
import { MessageOptions } from "ant-design-vue/types/message";
import CommonUtil from "@/assets/config/CommonUtil";
import { message } from "ant-design-vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblActionEvent
} from "@/components/shared/data-grid/models";

import { PageOfVisitInformItemGrid, VisitInformItemGrid, UnitDto, SendTargetGrid, PageOfSendTargetGrid, Option, StaffDto } from "@fubonlife/obd-api-axios-sdk";
import InfItemSettingEditForm from "@/components/shared/form/infItemSettingEditForm/InfItemSettingEditForm.vue";
import InfSendTargetSettingForm from "@/components/shared/form/infSendTargetSettingForm/InfSendTargetSettingForm.vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, InfItemSettingEditForm, InfSendTargetSettingForm }
})
export default class InfVisitPersonSetting extends Vue {
    // =============================處理發送對象部門和科別與窗口的下拉選單=============================/
    // 部門
    selectDepOptions: Option[] = [];


    //有效無效下拉選單
    selectStatusOptions: Option[] = [];

    emailAndTmrIdMap: Map<string, string> = new Map<string, string>();

    //取得部門下拉選單
    getDepartmentUnitTmrOptions() {
        this.$unitApi.getUnitsByUnitLevelUsingGET("03").then((resp: AxiosResponse<UnitDto[]>) => {
            resp.data.forEach(unit =>
                this.selectDepOptions.push({ label: unit.unitName, value: unit.unitId }));

        }).catch((err) => {
            console.log(err);
        }).finally(()=>{
            this.selectDepOptions.forEach(e=>{
                this.$intraEmployeeApi.findIntraEmployeesByDepIdsUsingGET([e.value])
                .then((resp: AxiosResponse<StaffDto[]>) => {
                  resp.data.forEach(staff => {
                 this.emailAndTmrIdMap.set(staff.email, staff.domainId)
                  })
               
                }).catch((err) => {
                  console.log(err);
                })
                
            })
        })
    }

    

    //取得狀態下拉選單
    getInformItemEffectiveOption() {
        this.$commonApi.findByTypeIdUsingGET("status")
            .then((res: AxiosResponse<Option[]>) => {
                this.selectStatusOptions = res.data;

            }).catch((err) => {
                console.log(err);
            });

    }

    //email範本下拉選單
    selectEmailTemplateOptions: Option[] = [];
    getEmailTemplateOption() {

        this.$visitPersonSettingApi.getVisitPersonEmailTemplateOptionsUsingGET().
            then((res: AxiosResponse<Option[]>) => {
                this.selectEmailTemplateOptions = res.data;

            }).catch((err) => {
                console.log(err);
            });
    }


    // =======================================================================================
    created() {
        this.getDepartmentUnitTmrOptions();
        this.getInformItemEffectiveOption();
        this.getEmailTemplateOption();
        this.informItemReload();
        this.sendTargetGridReload();

    }
    
    depIdAndEmailTmrIdMap:Map<string,Map<string, string>>;



    // ============================================會辦項目-第一層事件  start===================
    //會辦項目第一層reload
    informItemloading: boolean = false;

    informItemReload() {
        this.informItemloading = true;
        this.$visitPersonSettingApi.paginateInformItemUsingGET(this.informItemGrid.pagination.current - 1, this.informItemGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfVisitInformItemGrid>) => {
                this.informItemGrid.data = resp.data.content;
                const p = { ...this.informItemGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.informItemGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.informItemloading = false;
            }
            )
    }



    informItemGrid: FblPDataGridHolder<VisitInformItemGrid> = {
        rowKey: "infMajorSubTypeId",
        data: [],
        pagination: {
            showSizeChanger: false,
            pageSizeOptions: ['5', '10', '15'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        scroll: { x: 500, y: 600 },
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(),
                        edit: true
                    },
                ],
                width: CommonUtil.countColumnWidth(3),
            },
            {
                type: FblColumnType.PLAIN,
                property: "description",//
                title: this.$t("visitPersonSetting_firstLevel").toString(),
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "content",//罐頭語
                title: this.$t("visitPersonSetting_canContent").toString(),
                width: CommonUtil.countColumnWidth(30),

            }, {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t("global_status").toString(),//狀態
                width: CommonUtil.countColumnWidth(4),
                formatter: (data: VisitInformItemGrid) => {
                    if (data.status == "Y") {
                        return this.$t("global_effective").toString()//"有效"
                    } else {
                        return this.$t("global_deactivate").toString()//"停用"
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: VisitInformItemGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: VisitInformItemGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    /**
  * 換頁事件對應方法
  */
    onInformItemPageChange(e: FblPageEvent) {
        this.informItemGrid.pagination = e.pagination;
        this.informItemGrid.sort = e.sort;

        this.informItemReload();
    }

    //控制編輯視窗是否顯示
    isInformItemSettingVisible: boolean = false;
    infItemSettingUpdateDto: VisitInformItemGrid = null;
    informItemSettingTitle: string = "";
    //會辦項目第一層新增button按下後的方法
    showInformItemAddModal() {
        this.informItemSettingTitle = this.$t("visitPersonSetting_infItem_firstLevel_add").toString();
        this.isInformItemSettingVisible = true;
        this.infItemSettingUpdateDto = {}

    }


    onInformItemActionClick(e: FblActionEvent<VisitInformItemGrid>) {
        this.informItemSettingTitle = this.$t("visitPersonSetting_infItem_firstLevel_modify").toString();//"修改-會辦項目第一層"
        this.isInformItemSettingVisible = true;
        this.infItemSettingUpdateDto = e.row.data;
    }
    //送出會辦日期設定
    async informItemUpdateFormSubmit() {
        (this.$refs.infItemUpdateForm as any).submit();

    }

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



    // ============================================informItemGrid 事件  end===================
    // ============================================infSendTargetGrid 發送對象設定  start===================
    sendTargetPageChange(e: FblPageEvent) {
        this.sendTargetGrid.pagination = e.pagination;
        this.sendTargetGrid.sort = e.sort;
        this.sendTargetGridReload();
    }


    sendTargetGridloading: boolean = false;
    //重新讀取發送對象
    sendTargetGridReload() {
        this.sendTargetGridloading = true;
        this.$visitPersonSettingApi.paginateInformSendTargetUsingGET(this.sendTargetGrid.pagination.current - 1, this.sendTargetGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfSendTargetGrid>) => {
                this.sendTargetGrid.data = resp.data.content;
                const p = { ...this.sendTargetGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.sendTargetGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.sendTargetGridloading = false;
                
            }
            )
    }

    sendTargetGrid: FblPDataGridHolder<SendTargetGrid> = {
        rowKey: "infSendTargetId",
        data: [],
        pagination: {
            showSizeChanger: false,
            pageSizeOptions: ['5', '10', '15'],
            current: 1,
            pageSize: 5,
            total: 0,
            locale: { items_per_page: "" },
            showTotal: true
        },
        columns: [
            {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "edit",
                        title: this.$t('global_edit').toString(),
                        edit: true
                    },
                ],
            },
            {
                type: FblColumnType.PLAIN,
                property: "departmentName",//會辦部門
                title: this.$t("infPage_infDep").toString()  //"會辦部門",
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactEmail",
                title: this.$t("visitPersonSetting_contactPerson").toString(),// "窗口",//
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infCom_ccEmail").toString(),//"副本",
                property: "carbonCopyEmail",
                width: CommonUtil.countColumnWidth(60),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infEmail_template").toString(),//"Email 範本",
                property: "subject",
                width: CommonUtil.countColumnWidth(50),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: SendTargetGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.createDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
                formatter: (data: SendTargetGrid) => {
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateDate);
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    infSendTargetUpdateFormSubmit() {
        (this.$refs.infSendTargetUpdateForm as any).submit();
    }


    //控制email視窗是否能看到
    isInfSendTargetSettingVisible: boolean = false;
    updateInfSendTarget: SendTargetGrid = null;
    infSendTargetActionClick(e: FblActionEvent<SendTargetGrid>) {
        
        
        
        this.isInfSendTargetSettingVisible = true;

        this.updateInfSendTarget = e.row.data;
    }
    // ===========================================sendTargetGrid 發送對象設定 end===================


}