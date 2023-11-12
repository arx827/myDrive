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

import { MajorTypeGrid, PageOfMajorTypeGrid, MajorSubTypeGrid, NotiBancassuranceGrid, PageOfNotiBancassuranceGrid, PageOfMajorSubTypeGrid, PageOfNotiDaySettingGrid, NotiDaySettingGrid, ReviewType, Option, NotiEmailTemplateGrid, PageOfNotiEmailTemplateGrid, NotiReplyContentGrid, PageOfNotiReplyContentGrid } from "@fubonlife/obd-api-axios-sdk";
import NotiMajorTypeUpdateForm from "@/components/shared/form/notiMajorTypeUpdateForm/NotiMajorTypeUpdateForm.vue";
import NotiMajotSubTypeUpdateForm from "@/components/shared/form/notiMajorSubTypeUpdateForm/NotiMajorSubTypeUpdateForm.vue";
import NotiBancassuranceUpdateForm from "@/components/shared/form/notiBancussuranceForm/NotiBancussuranceForm.vue"
import NotiDayUpdateForm from "@/components/shared/form/notiDayUpdateForm/NotiDayUpdateForm.vue";
import NotiEmailTemplateUpdateForm from "@/components/shared/form/notiEmailTemplateUpdateForm/NotiEmailTemplateUpdateForm.vue";
import NotiReplyContentUpdateForm from "@/components/shared/form/notiReplyContentUpdateForm/NotiReplyContentUpdateForm.vue";
import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import MessageUtil from "@/assets/config/MessageUtil";


@Component({
    components: { FblDataGrid, NotiMajorTypeUpdateForm,NotiMajotSubTypeUpdateForm,NotiBancassuranceUpdateForm,NotiDayUpdateForm, NotiEmailTemplateUpdateForm,NotiReplyContentUpdateForm, }
})
export default class NotiormBasicSetting extends Vue {

    created() {
        this.majorTypeGridReload();//1.照會主類別分頁搜尋
        this.majorSubTypeGridReload();//2.照會次類別分頁搜尋
        this.notiBancassuranceGridReload();//3.銀行照會代碼分頁搜尋
        this.notiDayGridReload();//4.照會日期分頁搜尋
        this.emailTemplateGridReload();//5.照會email範本分頁搜尋
        this.notiReplyContentGridReload();//6.照會罐頭語分頁搜尋
    }
    // ============================================照會主類別NotimajorType  start===================
    

    majorTypeGridloading: boolean = false;
    majorTypeGridReload() {
        this.majorTypeGridloading = true;
        this.$notifyBasicSettingApi.paginateNotiTypeUsingGET1(this.majorTypeGrid.pagination.current - 1, this.majorTypeGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfMajorTypeGrid>) => {
                this.majorTypeGrid.data = resp.data.content;
                const p = { ...this.majorTypeGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.majorTypeGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.majorTypeGridloading = false;
            }
            )
    }

    majorTypeGrid: FblPDataGridHolder<MajorTypeGrid> = {
        rowKey: "sequence",
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
                property: "userMajorTypeId",
                title:  this.$t("notiSettingPage_majorTypeCode").toString(),//主類別代碼 - 使用者定義 畫面使用
                width: CommonUtil.countColumnWidth(20),

            },
            {
                type: FblColumnType.PLAIN,
                property: "sequence",
                title:  this.$t("notiSettingPage_majorTypeCode").toString(),//主類別代碼 - 系統用不顯示
                width: CommonUtil.countColumnWidth(20),
                hidden: true,

            },
            {
                type: FblColumnType.PLAIN,
                property: "description",
                title: this.$t("notiSettingPage_majorTypeDescription").toString(),// 主類別說明
                width: CommonUtil.countColumnWidth(20),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_status").toString(),//狀態,
                property: "status",
                formatter: (data: MajorTypeGrid) => {
                    if (data.status == "Y") {
                        return this.$t("global_effective").toString();//"有效"
                    } else {
                        return this.$t("global_deactivate").toString();//"停用"
                    }
                },
                width: CommonUtil.countColumnWidth(60),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: MajorTypeGrid) => {
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
                formatter: (data: MajorTypeGrid) => {
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


    majorTypePageChange(e: FblPageEvent) {
        this.majorTypeGrid.pagination = e.pagination;
        this.majorTypeGrid.sort = e.sort;
        this.majorTypeGridReload();
    }


    notiMajorTypeUpdateFormSubmit() {
        (this.$refs.notiMajorTypeUpdateForm as any).submit();
    }
    
    //控制照會主類別視窗是否能看到
    notiMajorTypeTitle: string = "";
    isMajorTypeSettingVisible: boolean = false;
    updateNotiType: MajorTypeGrid = null;
    

    majorTypeActionClick(e: FblActionEvent<MajorTypeGrid>) {
        this.notiMajorTypeTitle = this.$t("notiSettingPage_modify_notiMajortype").toString();//修改-照會主類別
        this.isMajorTypeSettingVisible = true;
        this.updateNotiType = e.row.data;
    }

    showMajorTypeAddModal(){
        this.notiMajorTypeTitle = this.$t("notiSettingPage_create_notiMajortype").toString();//新增-照會主類別
        this.isMajorTypeSettingVisible = true;
        this.updateNotiType = {};
    }

    // ============================================照會主類別NotimajorType  end===================
    // ============================================照會次類別NotiMajorSubType  start===================


    majorSubTypeGridloading: boolean = false;
    majorSubTypeGridReload() {
        this.majorSubTypeGridloading = true;
        this.$notifyBasicSettingApi.paginateNotiSubTypeUsingGET(this.majorSubTypeGrid.pagination.current - 1, this.majorSubTypeGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfMajorSubTypeGrid>) => {
                this.majorSubTypeGrid.data = resp.data.content;
                const p = { ...this.majorSubTypeGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.majorSubTypeGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.majorSubTypeGridloading = false;
            }
            )
    }


    majorSubTypeGrid: FblPDataGridHolder<MajorSubTypeGrid> = {
        rowKey: "majorSubTypeId",
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
                property: "userMajorSubTypeId",
                title:  this.$t("notiSettingPage_majorSubTypeCode").toString(),//主類別代碼 - 使用者定義 畫面使用
                width: CommonUtil.countColumnWidth(20),

            },
            {
                type: FblColumnType.PLAIN,
                property: "majorSubTypeId",
                title:this.$t("notiSettingPage_majorSubTypeCode").toString(),//次類別代碼 - 系統用不顯示
                width: CommonUtil.countColumnWidth(20),
                hidden: true,

            },
            {
                type: FblColumnType.PLAIN,
                property: "description",
                title: this.$t("notiSettingPage_majorSubTypeDescription").toString(),// 次類別說明
                width: CommonUtil.countColumnWidth(20),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_status").toString(),//狀態,
                property: "status",
                formatter: (data: MajorSubTypeGrid) => {
                    if (data.status == "Y") {
                        return this.$t("global_effective").toString();//"有效"
                    } else {
                        return this.$t("global_deactivate").toString();//"停用"
                    }
                },
                width: CommonUtil.countColumnWidth(60),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: MajorSubTypeGrid) => {
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
                formatter: (data: MajorSubTypeGrid) => {
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


    majorSubTypePageChange(e: FblPageEvent) {
        this.majorSubTypeGrid.pagination = e.pagination;
        this.majorSubTypeGrid.sort = e.sort;
        this.majorSubTypeGridReload();
    }


    notiMajorSubTypeUpdateFormSubmit() {
        (this.$refs.notiMajorSubTypeUpdateForm as any).submit();
    }

    //控制email視窗是否能看到
    isMajorSubTypeSettingVisible: boolean = false;
    updateNotiSubType: MajorSubTypeGrid = null;
    notiMajorSubTypeTitle: string = "";

    majorSubTypeActionClick(e: FblActionEvent<MajorSubTypeGrid>) {
        this.notiMajorSubTypeTitle = this.$t("notiSettingPage_modify_notiMajorSubtype").toString();//"修改-照會次類別";
        this.isMajorSubTypeSettingVisible = true;
        this.updateNotiSubType = e.row.data;
    }
    showMajorSubTypeAddModal(){
        this.notiMajorSubTypeTitle = this.$t("notiSettingPage_create_notiMajorSubtype").toString();//"新增-照會次類別";
        this.isMajorSubTypeSettingVisible = true;
        this.updateNotiSubType = {};

    }

    
    // ============================================照會次類別NotiMajorSubType  end===================

    // ============================================NotiBancassuranceGrid 銀行照會代碼 start===================


    notiBancassuranceGridloading: boolean = false;
    notiBancassuranceGridReload() {
        this.notiBancassuranceGridloading = true;
        this.$notifyBasicSettingApi.paginateNotiBancassuranceUsingGET(this.notiBancassuranceGrid.pagination.current - 1, this.notiBancassuranceGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfNotiBancassuranceGrid>) => {
                this.notiBancassuranceGrid.data = resp.data.content;
                const p = { ...this.notiBancassuranceGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.notiBancassuranceGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.notiBancassuranceGridloading = false;
            }
            )
    }


    notiBancassuranceGrid: FblPDataGridHolder<NotiBancassuranceGrid> = {
        rowKey: "bancassuranceId",
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
                property: "bancassuranceId",
                title: this.$t("notification_bancassuranceCode").toString(),//銀保照會代碼",
                width: CommonUtil.countColumnWidth(20),

            },
            {
                type: FblColumnType.PLAIN,
                property: "description",
                title: this.$t("notiSettingPage_notiBancassuranceCodeDescription").toString(),//銀保照會說明",
                width: CommonUtil.countColumnWidth(20),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_status").toString(),//狀態,
                property: "status",
                formatter: (data: NotiBancassuranceGrid) => {
                    if (data.status == "Y") {
                        return this.$t("global_effective").toString();//"有效"
                    } else {
                        return this.$t("global_deactivate").toString();//"停用"
                    }
                },
                width: CommonUtil.countColumnWidth(60),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: NotiBancassuranceGrid) => {
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
                formatter: (data: NotiBancassuranceGrid) => {
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


    notiBancassuranceGridPageChange(e: FblPageEvent) {
        this.notiBancassuranceGrid.pagination = e.pagination;
        this.notiBancassuranceGrid.sort = e.sort;
        this.notiBancassuranceGridReload();
    }


    notiBancassuranceUpdateFormSubmit() {
        (this.$refs.notiBancassuranceUpdateForm as any).submit();
    }

    //控制email視窗是否能看到
    isNotiBancassuranceSettingVisible: boolean = false;
    updateNotiBancassurance: NotiBancassuranceGrid = null;
    notiBancassuranceTitle: string = "";

    notiBancassuranceGridActionClick(e: FblActionEvent<NotiBancassuranceGrid>) {
        this.notiBancassuranceTitle =this.$t("notiSettingPage_modify_notiBancassuranceCode").toString(); //"修改-銀保照會代碼";
        this.isNotiBancassuranceSettingVisible = true;
        this.updateNotiBancassurance = e.row.data;
    }

    showBancassuranceAddModal(){
        this.notiBancassuranceTitle =this.$t("notiSettingPage_create_notiBancassuranceCode").toString();// "新增-銀保照會代碼";
        this.isNotiBancassuranceSettingVisible = true;
        this.updateNotiBancassurance = {};
    }
    // ============================================NotiBancassuranceGrid 銀行照會代碼  end===================


    // ============================================照會日期設定notificationDayGrid 事件  start===================
    //日期設定buffer圈
    notiDayloading: boolean = false;

    notiDayGridReload() {
        this.notiDayloading = true;
        this.$notifyBasicSettingApi.paginateNotiDayUsingGET(this.notiDayGrid.pagination.current - 1, this.notiDayGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfNotiDaySettingGrid>) => {

                this.notiDayGrid.data = resp.data.content;
                const p = { ...this.notiDayGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.notiDayGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.notiDayloading = false;
            }
            )
    }

    //控制編輯視窗是否顯示
    isNotiDaySettingVisible: boolean = false;
    updateNotiDay: NotiDaySettingGrid = null;
    onNotiDayActionClick(e: FblActionEvent<NotiDaySettingGrid>) {

        this.isNotiDaySettingVisible = true;
        this.updateNotiDay = e.row.data;
    }
    //送出日期設定
    async notiDayUpdateFormSubmit() {
        const returnflag: boolean = await (this.$refs.notiDayUpdateForm as any).submit();
    }

    notiDayGrid: FblPDataGridHolder<NotiDaySettingGrid> = {
        rowKey: "notiDayId",
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
                property: "type",//類型
                title: this.$t("global_type").toString(),
                formatter: (data: NotiDaySettingGrid) => {
                    if (data.type == "REMINDER") {
                        return this.$t('notiSettingPage_Reminder').toString();//催辦
                    } else {
                        return this.$t('notiSettingPage_Due').toString();//到期
                    }
                },
                width: CommonUtil.countColumnWidth(3),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("notiSettingPage_workingDaysSetting").toString(),//設定工作天數
                property: "workingDay",
                width: CommonUtil.countColumnWidth(4),
            },
            {
                type: FblColumnType.ELLIPSIS,
                title: this.$t("infBasic_remarkExplanation").toString(),//備註說明
                property: "remark",
                width: CommonUtil.countColumnWidth(50),
            },

            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: NotiDaySettingGrid) => {
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
                formatter: (data: NotiDaySettingGrid) => {
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
    onNotiDayPageChange(e: FblPageEvent) {
        this.notiDayGrid.pagination = e.pagination;
        this.notiDayGrid.sort = e.sort;

        this.notiDayGridReload();
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



    // ============================================照會日期設定notificationDayGrid 事件 事件  end===================

    // ============================================email範本emailTemplateGrid  start===================


    emailTemplateGridloading: boolean = false;
    emailTemplateGridReload() {
        this.emailTemplateGridloading = true;
        this.$notifyBasicSettingApi.paginateNotiEmailTemplateUsingGET(this.emailTemplateGrid.pagination.current - 1, this.emailTemplateGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfNotiEmailTemplateGrid>) => {
                this.emailTemplateGrid.data = resp.data.content;
                const p = { ...this.emailTemplateGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.emailTemplateGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.emailTemplateGridloading = false;
            }
            )
    }


    emailTemplateGrid: FblPDataGridHolder<NotiEmailTemplateGrid> = {
        rowKey: "notiEmailTemplateId",
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
                property: "notiEmailTypeDes",
                title:this.$t('global_type').toString(), //"類型"
                width: CommonUtil.countColumnWidth(20),

            },
            {
                type: FblColumnType.PLAIN,
                property: "subject",
                title: this.$t('mailRecord_subject').toString(),// "主旨",
                width: CommonUtil.countColumnWidth(20),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t('email_content').toString(),//"內容",
                property: "content",
                width: CommonUtil.countColumnWidth(60),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: NotiDaySettingGrid) => {
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
                formatter: (data: NotiDaySettingGrid) => {
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


    emailTemplatePageChange(e: FblPageEvent) {
        this.emailTemplateGrid.pagination = e.pagination;
        this.emailTemplateGrid.sort = e.sort;
        this.emailTemplateGridReload();
    }

    //控制email視窗是否能看到
    isEmailTemplateSettingVisible: boolean = false;
    updateNotiEmailTemplate: NotiEmailTemplateGrid = null;
    notiEmailTemplateTitle: string = "";

    emailTemplateActionClick(e: FblActionEvent<NotiEmailTemplateGrid>) {
        this.notiEmailTemplateTitle = this.$t("modify-notification_emailTemplate").toString();
        this.isEmailTemplateSettingVisible = true;
        this.updateNotiEmailTemplate = e.row.data;
    }


    // showemailTemplateAddModal() {
    //     this.notiEmailTemplateTitle = "新增-Email範本";
    //     this.isEmailTemplateSettingVisible = true;
    //     this.updateNotiEmailTemplate = {}

    // }

    notiEmailTemplateUpdateFormSubmit() {
        (this.$refs.notiEmailTemplateUpdateForm as any).submit();
    }



    // ============================================email範本emailTemplateGrid  end===================


    // ============================================罐頭語replyContent  start===================
    

    notiReplyContentGridloading: boolean = false;
    notiReplyContentGridReload() {
        this.notiReplyContentGridloading = true;
        this.$notifyBasicSettingApi.paginateNotiReplyContentUsingGET(this.notiReplyContentGrid.pagination.current - 1, this.notiReplyContentGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfNotiReplyContentGrid>) => {
                this.notiReplyContentGrid.data = resp.data.content;
                const p = { ...this.notiReplyContentGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.notiReplyContentGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.notiReplyContentGridloading = false;
            }
            )
    }

    notiReplyContentGrid: FblPDataGridHolder<NotiReplyContentGrid> = {
        rowKey: "notiReplyContentId",
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
                title: this.$t("infContent").toString(),
                property: "content",


            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infSort").toString(),
                property: "sortNo",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("global_status").toString(),//"狀態",
                property: "status",
                formatter: (data: NotiReplyContentGrid) => {
                    if (data.status == "Y") {
                        return this.$t("global_effective").toString();//"有效"
                    } else {
                        return this.$t("global_deactivate").toString();//"停用"
                    }
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
                formatter: (data: NotiDaySettingGrid) => {
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
                formatter: (data: NotiDaySettingGrid) => {
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
    notiReplyContentPageChange(e: FblPageEvent) {
        this.notiReplyContentGrid.pagination = e.pagination;
        this.notiReplyContentGrid.sort = e.sort;
        this.notiReplyContentGridReload();
    }

    isNotiReplyContentSettingVisible: boolean = false;


    notiReplyContentActionClick(e: FblActionEvent<NotiReplyContentGrid>) {
        switch (e.action.name) {
            case "add":
                this.showReplyAddModal();
                break;
            case "edit":
                this.editReplyContent(e.row.data);
                break;
        }
    }


    notiReplcontentSetting: string = '';

    updateNotiReplyContent: NotiReplyContentGrid = null;
    //新增罐頭語
    showReplyAddModal() {
        this.notiReplcontentSetting = this.$t("global_add").toString() + "-" + this.$t("notification_replyContent").toString();
        this.isNotiReplyContentSettingVisible = true;
        this.updateNotiReplyContent = {};
    }
    //編輯罐頭語global_add
    editReplyContent(data: NotiReplyContentGrid) {
        this.notiReplcontentSetting = this.$t("global_modify").toString() + "-" + this.$t("notification_replyContent").toString();
        this.isNotiReplyContentSettingVisible = true;
        this.updateNotiReplyContent = data;
    }

    notiReplyContentUpdateFormSubmit() {

        (this.$refs.notiReplyContentUpdateForm as any).submit();
    }
    // ============================================罐頭語replyContent end===================


}