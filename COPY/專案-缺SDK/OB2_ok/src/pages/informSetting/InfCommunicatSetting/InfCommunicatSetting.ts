import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CommonUtil from "@/assets/config/CommonUtil";
import { message, Modal } from "ant-design-vue";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
    FblActionEvent
} from "@/components/shared/data-grid/models";

import { Option, InfSettingFirstDto, InfSettingSecondDto, PageOfInfSettingFirstDto, PageOfInfSettingSecondDto, InfSendTargetCDto, PageOfInfSendTargetCDto, PageOfInfBancassuranceSettingDto, InfBancassuranceSettingDto, InfSettingFirstUpdateDtoStatusEnum, InfBancassuranceErrorMsgDto, InfSettingFirstDtoStatusEnum, UnitDto, InfEmailTemplate, StaffDto } from "@fubonlife/obd-api-axios-sdk";
import InfItemSettingEditForm from "@/components/shared/form/InfSettingEdit/infItemSettingEditForm/infItemSettingEditForm.vue";
import InfItemSecondSettingEditForm from "@/components/shared/form/InfSettingEdit/infItemSecondSettingEditForm/infItemSecondSettingEditForm.vue";
import InfSendMsgSettingEditForm from "@/components/shared/form/InfSettingEdit/infSendMsgSettingEditForm/infSendMsgSettingEditForm.vue";

import { AxiosResponse } from "axios";
import { Component, Vue } from "vue-property-decorator";
import ValidationUtil from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { FblDataGrid, InfItemSettingEditForm, InfItemSecondSettingEditForm, InfSendMsgSettingEditForm }
})
export default class InfCommunicatSetting extends Vue {

    // 會辦項目第一層
    isInformItemSettingVisible: boolean = false;
    infItemSettingUpdateDto: InfSettingFirstDto = null;
    informItemSettingTitle: string = "";
    selectFirstItemOptions: Option[] = [];

    // 會辦項目第二層
    isInformSecondItemSettingVisible: boolean = false;
    infItemSecondSettingUpdateDto: InfSettingSecondDto = null;
    informSecondItemSettingTitle: string = "";

    // 狀態下拉選單
    selectStatusOptions = [
        {
            label: this.$t('global_enable').toString(), //啟用
            value: InfSettingFirstUpdateDtoStatusEnum.Y,
        }, {
            label: this.$t('global_deactivate').toString(), //停用
            value: InfSettingFirstUpdateDtoStatusEnum.L,
        }
    ];

    // 發送對象設定
    isInfSendTargetSettingVisible: boolean = false;
    updateInfSendTarget: InfSendTargetCDto = null;
    emailTemplates: Array<Option> = [];
    allDepts: Array<Option> = [];
    allUnits: Array<Option> = [];
    allEmps: Array<Option> = [];

    // 銀保通路對照表
    infBancassuranceGridloading: boolean = false
    updateTime: string = "";
    updateName: string = "";
    fileList: File[] = [];
    selectedFileName: string = "";
    isUploading: boolean = false;
    isExporting: boolean = false;

    // loading flag
    informItemloading: boolean = false;
    sendInfSettingSecondloading: boolean = false;
    sendTargetGridloading: boolean = false;

    // 查詢所有部門
    getDepartmentOptions() {
        return this.$unitApi.getUnitsByUnitLevelUsingGET("03").then((resp: AxiosResponse<UnitDto[]>) => {
            resp.data.forEach(unit =>
                this.allDepts.push({ label: unit.unitName, value: unit.unitId }));
        }).catch((err) => {
            console.log(err);
        });
    }

    // 查詢所有科別
    getUnitOptions() {
        return this.$unitApi.getUnitsByUnitLevelUsingGET("04").then((resp: AxiosResponse<UnitDto[]>) => {
            resp.data.forEach(unit =>
                this.allUnits.push({ label: unit.unitName, value: unit.unitId }));
        }).catch((err) => {
            console.log(err);
        })
    }

    // 查詢所有員工
    getAllEmp() {
        return this.$intraEmployeeApi.findAllIntraEmployeesUsingGET()
            .then((resp: AxiosResponse<StaffDto[]>) => {
                resp.data.forEach(staff => {
                    // 員工下拉選單
                    if (!ValidationUtil.isEmpty(staff.email)) {
                        this.allEmps.push({
                            label: staff.name,
                            value: staff.email
                        });
                    }
                })
            }).catch((err) => {
                console.log(err);
            })
    }

    // 查詢所有郵件範本
    getEmailTemplate() {
        return this.$communicatSettingApi.getInfEmailTemplateUsingGET()
            .then((resp: AxiosResponse<InfEmailTemplate[]>) => {
                resp.data.forEach(emailTemplate => {
                    // 員工下拉選單
                    this.emailTemplates.push({
                        label: emailTemplate.subject,
                        value: emailTemplate.infEmailTemplateId
                    });
                })
            }).catch((err) => {
                console.log(err);
            })
    }

    // 查詢所有第一層項目
    getFirstItem() {
        return this.$communicatSettingApi.paginateInformItemCUsingGET(0, 1000)
            .then((resp: AxiosResponse<PageOfInfSettingFirstDto>) => {
                if (resp.data != null) {
                    this.selectFirstItemOptions = [];
                    // 會辦第一層 下拉
                    resp.data.content.forEach((opt) => {
                        if (opt.status == InfSettingFirstDtoStatusEnum.Y) {
                            this.selectFirstItemOptions.push({ label: opt.itemDesc, value: opt.reviewSubTypeId });
                        }
                    });
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    // *頁面初始化*
    created() {
        LoadingUtil.show();
        const dptPromise = this.getDepartmentOptions();
        const unitPromise = this.getUnitOptions();
        const empPromise = this.getAllEmp();
        const emailPromise = this.getEmailTemplate();
        const firstItemPromise = this.getFirstItem();
        this.informItemReload();
        this.sendInfSettingSecondReload();
        this.sendTargetGridReload();
        this.infBancassuranceGridReload();
        Promise.all([dptPromise, unitPromise, empPromise, emailPromise, firstItemPromise])
            .then(() => {
                LoadingUtil.close();
            })
    }

    // *會辦項目設定-第一層*
    informItemReload() {
        this.informItemloading = true;
        this.$communicatSettingApi.paginateInformItemCUsingGET(this.informItemGrid.pagination.current - 1, this.informItemGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfInfSettingFirstDto>) => {
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

    informItemGrid: FblPDataGridHolder<InfSettingFirstDto> = {
        rowKey: "reviewSubTypeId",
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
                property: "itemDesc",
                title: this.$t("communicatSetting_infItemDesc").toString(),//項目說明
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t("global_status").toString(), //狀態
                formatter: (data: InfSettingFirstDto) => {
                    if (data.status == "Y") {
                        return this.$t('global_enable').toString();
                    } else {
                        return this.$t('global_deactivate').toString();
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    onInformItemPageChange(e: FblPageEvent) {
        this.informItemGrid.pagination = e.pagination;
        this.informItemGrid.sort = e.sort;
        this.informItemReload();
    }

    showInformItemAddModal() {
        this.informItemSettingTitle = this.$t("communicatSetting_infItem_add_firstLevel").toString();
        this.isInformItemSettingVisible = true;
        this.infItemSettingUpdateDto = {}
    }

    onInformItemActionClick(e: FblActionEvent<InfSettingFirstDto>) {
        this.informItemSettingTitle = this.$t("communicatSetting_infItem_modify_firstLevel").toString();//修改-會辦項目第一層
        this.isInformItemSettingVisible = true;
        this.infItemSettingUpdateDto = e.row.data;
    }

    async informItemUpdateFormSubmit() {
        LoadingUtil.show();
        (this.$refs.infItemUpdateForm as any).submit();
        this.getFirstItem();
        LoadingUtil.close();
    }


    // *會辦項目-第二層*

    sendInfSettingSecondReload() {
        this.sendInfSettingSecondloading = true;
        this.$communicatSettingApi.paginateInformSecondItemCUsingGET(this.informItemSecondGrid.pagination.current - 1, this.informItemSecondGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfInfSettingSecondDto>) => {
                this.informItemSecondGrid.data = resp.data.content;
                const p = { ...this.informItemSecondGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.informItemSecondGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.sendInfSettingSecondloading = false;
            }
            )
    }

    informItemSecondGrid: FblPDataGridHolder<InfSettingSecondDto> = {
        rowKey: "infReviewId",
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
                property: "itemFirst",
                title: this.$t("communicatSetting_firstInfItem").toString(),//第一層項目
            },
            {
                type: FblColumnType.PLAIN,
                property: "description",
                title: this.$t("communicatSetting_secondInfItem").toString(),//第二層項目
            },
            {
                type: FblColumnType.PLAIN,
                property: "content",
                title: this.$t("communicatSetting_content").toString(),//罐頭語
            },
            {
                type: FblColumnType.PLAIN,
                property: "status",
                title: this.$t("global_status").toString(),//狀態
                width: CommonUtil.countColumnWidth(4),
                formatter: (data: InfSettingSecondDto) => {
                    if (data.status == "Y") {
                        return this.$t('global_enable').toString(); //啟用
                    } else {
                        return this.$t('global_deactivate').toString(); //停用
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    onInfSettingSecondPageChange(e: FblPageEvent) {
        this.informItemSecondGrid.pagination = e.pagination;
        this.informItemSecondGrid.sort = e.sort;
        this.sendInfSettingSecondReload();
    }

    showInformSecondItemAddModal() {
        this.informSecondItemSettingTitle = this.$t("communicatSetting_infItem_add_secondLevel").toString();//新增-會辦項目
        this.isInformSecondItemSettingVisible = true;
        this.infItemSecondSettingUpdateDto = {}
    }

    onInformSecondItemActionClick(e: FblActionEvent<InfSettingSecondDto>) {
        this.informSecondItemSettingTitle = this.$t("communicatSetting_infItem_modify_secondLevel").toString();//修改-會辦項目
        this.isInformSecondItemSettingVisible = true;
        this.infItemSecondSettingUpdateDto = e.row.data;
    }

    async informSecondItemUpdateFormSubmit() {
        (this.$refs.infSecondItemUpdateForm as any).submit();
    }

    // *發送對象設定*

    sendTargetGridReload() {
        this.sendTargetGridloading = true;
        this.$communicatSettingApi.paginateInformSendTargetCUsingGET(this.sendTargetGrid.pagination.current - 1, this.sendTargetGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfInfSendTargetCDto>) => {
                this.sendTargetGrid.data = resp.data.content;
                const p = { ...this.sendTargetGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.sendTargetGrid.pagination = p;
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.sendTargetGridloading = false;
            })
    }

    sendTargetGrid: FblPDataGridHolder<InfSendTargetCDto> = {
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
                property: "infChannels",
                title: this.$t("communicatSetting_infSendTarget_caseChannel").toString()  //案件通路
            },
            {
                type: FblColumnType.PLAIN,
                property: "departmentName",
                title: this.$t("infPage_infDep").toString()  //會辦部門
            },
            {
                type: FblColumnType.PLAIN,
                property: "contactEmail",
                title: this.$t("communicatSetting_receiver").toString(),//窗口
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("communicatSetting_cc").toString(),//副本
                property: "carbonCopyEmail",

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infEmail_template").toString(),//Email範本
                property: "infEmailTemplateSubject",

            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createdDate").toString(),//新增時間
                property: "createDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_createPerson").toString(),//新增人員
                property: "createName",

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedDate").toString(),//異動時間
                property: "updateDate",
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("infBasic_modifiedPerson").toString(),//異動人員 
                property: "updateName",
            },
        ]
    }

    sendTargetPageChange(e: FblPageEvent) {
        this.sendTargetGrid.pagination = e.pagination;
        this.sendTargetGrid.sort = e.sort;
        this.sendTargetGridReload();
    }

    infSendTargetUpdateFormSubmit() {
        (this.$refs.infSendTargetUpdateForm as any).submit();
    }

    infSendTargetActionClick(e: FblActionEvent<InfSendTargetCDto>) {
        this.isInfSendTargetSettingVisible = true;
        this.updateInfSendTarget = e.row.data;
    }

    // *銀保通路對照表*

    infBancassuranceGridReload() {
        this.infBancassuranceGridloading = true;
        this.$communicatSettingApi.paginateInformBancassuranceUsingGET(this.infBancassuranceGrid.pagination.current - 1, this.infBancassuranceGrid.pagination.pageSize)
            .then((resp: AxiosResponse<PageOfInfBancassuranceSettingDto>) => {
                this.infBancassuranceGrid.data = resp.data.content;
                this.updateTime = resp.data.content[0].updateDate;
                this.updateName = resp.data.content[0].updateName;
                const p = { ...this.infBancassuranceGrid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.infBancassuranceGrid.pagination = p;
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                this.infBancassuranceGridloading = false;
            }
            )
    }

    // 銀保通路對照表Grid
    infBancassuranceGrid: FblPDataGridHolder<InfBancassuranceSettingDto> = {
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
                type: FblColumnType.PLAIN,
                property: "bancassuranceId",
                title: this.$t("eventS_serialNumber").toString()  //序號
            },
            {
                type: FblColumnType.PLAIN,
                property: "unitId",
                title: this.$t("communicatSetting_unidIdPrefix").toString()  //單位代號前三碼
            },
            {
                type: FblColumnType.PLAIN,
                property: "department",
                title: this.$t("global_department").toString()  //部門
            }
        ]
    }

    // 換頁
    infBancassurancePageChange(e: FblPageEvent) {
        this.infBancassuranceGrid.pagination = e.pagination;
        this.infBancassuranceGrid.sort = e.sort;
        this.infBancassuranceGridReload();
    }

    // 檔案上傳前格式檢核
    beforeUpload(file: File) {
        const isExcel = (file.type.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") || file.type.includes("application/vnd.ms-excel"));
        //判斷檔案類型
        if (!(isExcel)) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: "錯誤",
                content: "「上傳檔案」格式錯誤",
            });
            return false;
        }

        if (file.size >= 15_759_375) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToobig').toString(), // 「上傳檔案」檔案大於15Mb
            });
            return false;
        }

        if (file.size <= 0) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('fileUpload_error').toString(), // 錯誤
                content: this.$t('fileUpload_sizeToosmall').toString(), // 「上傳檔案」檔案大小為0,不可上傳！
            });
            return false;
        }

        this.fileList = [file];
        this.selectedFileName = file.name;
        return false;
    }

    // 移除已上傳附件
    handleRemove() {
        this.fileList = [];
        this.selectedFileName = "";
    }

    // 上傳銀保通路對照表
    handleUpload() {
        this.isUploading = true;
        if (!ValidationUtil.isEmpty(this.fileList)) {
            LoadingUtil.show();
            this.$communicatSettingApi.uploadInformBancassuranceUsingPOST(this.fileList[0])
                .then((resp: AxiosResponse<InfBancassuranceErrorMsgDto>) => {
                    if (resp.data.successLog == null) {
                        ErrorModalUtil.modalListError(resp.data.errMsg, 500);
                    } else {
                        MessageUtil.messageInfo(resp.data.successLog);
                    }
                    this.infBancassuranceGridReload();
                    this.fileList = [];
                    this.selectedFileName = "";
                }).catch((err) => {
                    console.error(err);
                    ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
                }).finally(() => {
                    this.isUploading = false;
                    this.selectedFileName = "";
                    LoadingUtil.close();
                });
        }
    }

    // 匯出銀保通路對照表
    handleExport() {
        this.isExporting = true;
        LoadingUtil.show();
        this.$communicatSettingApi.exportInformBancassuranceUsingGET({ responseType: 'blob' })
            .then((res) => {
                this.dealDownLoadData(res.data, "銀保通路對照表.xlsx"); // 銀保通路對照表.xlsx
                MessageUtil.messageInfo(this.$t('global_exportSuccess').toString()); //匯出成功
            }).catch((err) => {
                console.error(err);
                ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); // 上傳失敗
            }).finally(() => {
                this.isExporting = false;
                LoadingUtil.close();
            });
    }

    // 處理後端回傳的下載內容
    dealDownLoadData(resData, fileName) {
        try {
            let blob;
            if (resData instanceof Blob) {
                blob = resData;
            } else {
                blob = new Blob([resData], { type: resData.type });
            }
            if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
                (window.navigator as any).msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
                // navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕
            } else {
                var linkElement = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", fileName);
                var clickEvent = new MouseEvent("click",
                    {
                        "view": window,
                        "bubbles": true,
                        "cancelable": false
                    });
                linkElement.dispatchEvent(clickEvent);
            }
        } catch (ex) {
            MessageUtil.messageError(this.$t('roleSP_exportFailure').toString()); //匯出失敗
        }
    }

}