import { Vue, Component } from "vue-property-decorator";
import {
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import { Modal } from "ant-design-vue";
import { TimePicker } from "ant-design-vue";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { PeddingSearchForm, FeildValidation, SelectOption, PeddingSearchValidateForm, DatePickerTypeEnum, DatePickerEnum } from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment, { Moment } from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { message } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { PendingFilter, PendingGrid, PendingListDto, StaffDto, TSysCodeDto,ComponentDto, AllUserUnitSuperUnitInfoDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { LoginModule } from "@/plugins/store/LoginModule";
import ModifyCallDateForm from "@/components/shared/form/modfiyCallingTime/ModfiyCallingTime.vue";
import PolicyMaskForm from "@/components/shared/form/policyMask/PolicyMask.vue";
import "@/assets/less/pendingPage.less";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { AuthComonent } from "@/assets/config/CommonUtil";
import { ContinuePackMoudle } from "@/plugins/store/ContinuePackModule";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";

@Component({
    components: { FblDataGrid, HiddenFolde, TimePicker, ModifyCallDateForm, PolicyMaskForm }
})
export default class PeddingPage extends Vue {

    // 電訪項目映射物件
    reverseItemMapping = new Map();

    // 判斷是否從派件管理過來的
    isFromDispatchManagement: boolean = false;

    policyMaskVisible: boolean = false;
    pendingListForPolicyMark: PendingListDto[] = [];
    //選取的資料案件是否為重啟的電訪項目
    isMarkReboot: boolean = false;

    //查詢條件預設值
    defaultDepartmentId: string = "";
    defaultStatusId: string = "01";
    defaultStageId: string = "00";

    //查詢條件
    peddingSearchForm: PeddingSearchForm = {
        importStartDate: null,
        importEndDate: null,
        importStartString: "",
        importEndString: "",
        contactDates: [],
        policyNo01: "",
        policyNo02: "",
        policyNo03: "",
        changeNo: "",
        dueContactStartDate: moment(new Date()).startOf("day"),
        datePickerDueContactStartDate: moment(new Date()).startOf("day").toDate(),
        dueContactEndDate: moment(new Date()).startOf("day"),
        datePickerDueCountactEndDate: moment(new Date()).startOf("day").toDate(),
        dueContactStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        dueContactEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
        respondentsId: "",
        contactItemIdList: [],
        caseStageId: this.defaultStageId,
        typeIdList: [],
        caseStatusId: this.defaultStatusId,
        caseLevelId: "",
        priorityId: "",
        departmentIdList: [],
        divisionIdList: [],
        specifyContactStartTime: null,
        specifyContactEndTime: null,
        specifyContactStartString: "",
        specifyContactEndString: "",
        tmrIdList: [],
        agentUnitId: "",
        agentId: "",
        agentName: "",
        isLegal: "",
    };

    // 畫面元件
    authComponent: AuthComonent ={
        PENDDING_SEARCH : {
            show: false,
            enable: false
        },
        PENDDING_GET_CASE : {
            show: false,
            enable: false
        },
        PENDDING_CASE_REMARK : {
            show: false,
            enable: false
        },
        PENDDING_EXPORT : {
            show: false,
            enable: false
        },
        PENDDING_CHANGE_DUE_DATE : {
            show: false,
            enable: false
        }
    };

    //下拉選單選項值
    static SelectY: string = 'Y';
    static SelectN: string = 'N';
    static Select1: string = "1";
    static Select2: string = "2";

    //控制不重複搜尋的flag
    searchFlag: boolean = true;

    //DatePicker民國年的格式
    formatter = this.$twDateFormatter;
    formatterDateTime = this.$twDateTimeFormatter
    //vue2 時間選擇器標題格式
    timeTitleFormat: string = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));

    //案件包數量
    packCount: Number = 0;

    //日期選擇器hover是否顯示
    isImportDateStartVisible: boolean = false;
    isImportDateEndVisible: boolean = false;
    isDueContactStartVisible: boolean = false;
    isDueContactEndVisible: boolean = false;
    isContactDatesVisible: boolean = false;

    //時間選擇器是否顯示
    isSpecifyContactStartOpen: boolean = false;
    isSpecifyContactEndOpen: boolean = false;

    //日期選擇器是否顯示
    isContactDatePickerOpen: boolean = false;

    //判斷當下是否可執行匯出
    isExportDisable: boolean = false;
    overMaxRowCountMessage: string = "";

    //欄位驗證提示工具
    peddingSearchValidateForm: PeddingSearchValidateForm = {
        importStartDate: { feedback: false, hoverVisible: false },
        importEndDate: { feedback: false, hoverVisible: false },
        contactDates: { feedback: false, hoverVisible: false },
        policyNo01: { feedback: false, hoverVisible: false },
        policyNo02: { feedback: false, hoverVisible: false },
        policyNo03: { feedback: false, hoverVisible: false },
        changeNo: { feedback: false, hoverVisible: false },
        dueContactStartDate: { feedback: false, hoverVisible: false },
        dueContactEndDate: { feedback: false, hoverVisible: false },
        respondentsId: { feedback: false, hoverVisible: false },
        contactItemIdList: { feedback: false, hoverVisible: false },
        caseStageId: { feedback: false, hoverVisible: false },
        typeIdList: { feedback: false, hoverVisible: false },
        caseStatusId: { feedback: false, hoverVisible: false },
        caseLevelId: { feedback: false, hoverVisible: false },
        priorityId: { feedback: false, hoverVisible: false },
        departmentIdList: { feedback: false, hoverVisible: false },
        divisionIdList: { feedback: false, hoverVisible: false },
        specifyContactStartTime: { feedback: false, hoverVisible: false },
        specifyContactEndTime: { feedback: false, hoverVisible: false },
        tmrIdList: { feedback: false, hoverVisible: false },
        agentUnitId: { feedback: false, hoverVisible: false },
        agentId: { feedback: false, hoverVisible: false },
        agentName: { feedback: false, hoverVisible: false },
        isLegal: { feedback: false, hoverVisible: false },
    }

    // 搜尋欄位驗證方式
    peddingSearchRules: { [key: string]: ValidationRule[] } = {
        importStartDate: [{ validator: this.validateImportStartDate, trigger: "blur" }],
        importEndDate: [{ validator: this.validateImportEndDate, trigger: "blur" }],
        dueContactStartDate: [{ validator: this.validateDueContactStartDate, trigger: "blur" }],
        dueContactEndDate: [{ validator: this.validateDueContactEndDate, trigger: "blur" }],
        policyNo01: [{ validator: this.validatePolicyNo, trigger: "blur" }],
        policyNo02: [{ validator: this.validatePolicyNo02, trigger: "blur" }],
        policyNo03: [{ validator: this.validatePolicyNo03, trigger: "blur" }],
        respondentsId: [{ validator: this.validateRespondetsId, trigger: "blur" }],
        changeNo: [{ validator: this.validateChangeNo, trigger: "blur" }],
        agentUnitId: [{ validator: this.validateAgentUnitId, trigger: "blur" }],
        agentId: [{ validator: this.validateAgentId, trigger: "blur" }],
        agentName: [{ validator: this.validateAgentName, trigger: "blur" }],
    };

    //案件階段、案件狀態、類型、電訪項目、法代/監護下拉選項
    selectPolicyStageOptions: Option[] = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
    selectPolicyStatusOptions: Option[] = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
    selectPolicyTypeOptions: SelectOption[] = [];
    selectContactItemOptions: SelectOption[] = [];
    selectLegalOptions: SelectOption[] = [
        { label: this.$t('global_all').toString(), value: '' }, //全部
        { label: this.$t('pedding_selectLegalYes').toString(), value: PeddingPage.SelectY }, //有
        { label: this.$t('pedding_selectLegalNo').toString(), value: PeddingPage.SelectN } //無
    ];
    selectPolicyLevelOptions: SelectOption[] = [
        { label: this.$t('global_all').toString(), value: '' }, //全部
        { label: this.$t('pedding_emergency').toString(), value: PeddingPage.Select1 }, //急件
        { label: this.$t('pedding_emergencyNot').toString(), value: PeddingPage.Select2 } //非急件
    ];
    selectPriorityOptions: SelectOption[] = [
        { label: this.$t('global_all').toString(), value: '' }, //全部
        { label: this.$t('pedding_selectPriority').toString(), value: PeddingPage.SelectY }, //優先
        { label: this.$t('pedding_selectNotPriority').toString(), value: PeddingPage.SelectN } //非優先
    ];
    selectDeptOptions: SelectOption[] = [];
    activedDeptOptions:  SelectOption[] = [];
    selectDiviOptions: SelectOption[] = [];
    selectDiviOptionsOnSelect: SelectOption[] = [];
    selectTmrOptions: SelectOption[] = [];
    selectStageAndStatus: TSysCodeDto[] = [];

    //部門、科別、電訪員的下拉選單選項來源存放
    allDivList: Option[] = [];
    allUserList: Option[] = [];

    depUnitInfo = {};
    depUserInfo ={};
    unitUserInfo = {};

    unitDepInfo = {};
    activedUnitDepInfo = {};

    // 搜尋條件過濾(主表)
    peddingSearchFilters: FblFilters = {
        filters: []
    };

    // 搜尋條件過濾(非主表)
    peddingFilter: PendingFilter = {
        isLegal: null,
        departmentIdList: [],
        contactItemIdList: [],
        divisionIdList: [],
        tmrIdList: [],
        agentId: "",
        agentName: "",
        isPriority: null,
        isUrgent: null,
        obdType: [],
        checkVisitDateNotNull: false,
        dispatchTaskDto: null,
    }

    // 待電訪查詢結果顯示設定
    grid: FblPDataGridHolder<PendingGrid> = {
        rowKey: "caseNo",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 15,
            total: 0,
            locale: { items_per_page: "" }
        },
        scroll: { x: 500, y: 370 },
        columns: [
            {
                type: FblColumnType.CHECKBOX,
                property: "isSelected",
                title: this.$t('pedding_select').toString(), //選取
                width: CommonUtil.countColumnWidth(2),
                fixed: 'left',
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('pedding_custId').toString(), //受訪者ID
                width: 100,
                fixed: 'left',
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "custName",
                title: this.$t('pedding_custName').toString(), //受訪者姓名
                width: CommonUtil.countColumnWidth(6),
                fixed: 'left',
                align: 'center',
            },
            {
                type: FblColumnType.PLAIN,
                property: "custType",
                title: this.$t('pedding_custType').toString(), //受訪者身分
                width: 130,
                fixed: 'left',
                formatter: (data: PendingGrid) => {
                    return data.custTypeName;
                },
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "policyNo",
                title: this.$t('pedding_policyNo').toString(), //保單號碼
                formatter: (data: PendingGrid) => {
                    let no = "";
                    if (!ValidationUtil.isEmpty(data.policyNo)) {
                        no = data.policyNo;
                        if (!ValidationUtil.isEmpty(data.policySeq)) {
                            no = no + "-" + data.policySeq;
                            if (!ValidationUtil.isEmpty(data.idDup)) {
                                no = no + "-" + data.idDup;
                            }
                        }
                    }
                    return no;
                },
                width: 120,
                fixed: 'left',
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "taskId",
                title: this.$t('pedding_contactItem').toString(), //電訪項目
                width: CommonUtil.countColumnWidth(6),
                formatter: (data: PendingGrid) => {
                    return data.taskName;
                },
                fixed: 'left',
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "pherId",
                title: this.$t('pedding_pherId').toString(), //要保人ID
                width: 100,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "pherName",
                title: this.$t('pedding_pherName').toString(), //要保人姓名
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "insuId",
                title: this.$t('pedding_insuId').toString(), //被保險人ID
                width: 100,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "insuName",
                title: this.$t('pedding_insuName').toString(), //被保險人姓名
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "contractorMemo",
                title: this.$t('pedding_contractorMemo').toString(), //交辦部門備註-行政部門
                width: CommonUtil.countColumnWidth(15),
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "casePolicyMark",
                title: this.$t('pedding_casePolicyMarkMemo').toString(), //交辦部門備註-電訪
                width: CommonUtil.countColumnWidth(15),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "dueContDateChg",
                title: this.$t('pedding_dueContactDate').toString(), //應電訪日
                formatter: (data: PendingGrid) => {
                    if (data.dueContDateChg == null) {
                        return "";
                    } else {
                        return MomentUtil.transformRocYearMonthDay(data.dueContDateChg);
                    }
                },
                width: 85,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "dueContDateChgReason",
                title: this.$t('pedding_dueContDateChgReason').toString(), //修改應電訪日原因
                formatter: (data: PendingGrid) => {
                    if (data.dueContDateChgReason == null) {
                        return "";
                    } else {
                        return data.dueContDateChgReason;
                    }
                },
                width: CommonUtil.countColumnWidth(7),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentAssignStartTime",
                title: this.$t('pedding_specifyContactTime').toString(), //指定聯絡時段
                formatter: (data: PendingGrid) => {
                    if (data.agentAssignStartTime == null && data.agentAssignEndTime == null) {
                        return "";
                    } else if(data.agentAssignStartTime == null){
                        return "~" + data.agentAssignEndTime;
                    }else if(data.agentAssignEndTime == null){
                        return data.agentAssignStartTime + "~";
                    }else{
                        return data.agentAssignStartTime + "~" + data.agentAssignEndTime;
                    }
                },
                width: 110,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "visitStartDate",
                title: this.$t('pedding_contactTime').toString(), //方便連絡時段
                formatter: (data: PendingGrid) => {
                    if (data.visitStartDate == null && data.visitEndDate == null) {
                        return "";
                    } else if(data.visitStartDate == null){
                        return "~" + MomentUtil.transformRocYearMonthDay(data.visitEndDate) + " "+ moment(data.visitEndDate).format("HH:mm");
                    }else if(data.visitEndDate == null){
                        return MomentUtil.transformRocYearMonthDay(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~";
                    }else{
                        return MomentUtil.transformRocYearMonthDay(data.visitStartDate) + " " + moment(data.visitStartDate).format("HH:mm") + "~" + moment(data.visitEndDate).format("HH:mm");
                    }
                },
                width: 180,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "hasLegal",
                title: this.$t('pedding_Legal').toString(), //法代
                width: 90,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "priorityFlag",
                title: this.$t('pedding_priority').toString(), //優先
                formatter: (data: PendingGrid) => {
                    if (PeddingPage.SelectY == data.priorityFlag) {
                        return this.$t('pedding_selectPriority').toString(); //優先
                    } else if (PeddingPage.SelectN == data.priorityFlag) {
                        return this.$t('pedding_selectNotPriority').toString(); //非優先
                    } else {
                        return "";
                    }
                },
                width: 90,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "vipType",
                title: "VIP/VVIP",
                width: 90,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "type",
                title: this.$t('pedding_type').toString(), //類型
                width: 70,
                formatter: (data: PendingGrid) => {
                    return data.typeName;
                },
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "changeNo",
                title: this.$t('pedding_changeNo').toString(), //受理案號
                width: 110,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "packNo",
                title: this.$t('pedding_packNo').toString(), //名單序號
                width: 130,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "sysType",
                title: this.$t('pedding_sysType').toString(), //通路別
                formatter: (data: PendingGrid) => {
                    switch (data.sysType) {
                        case "1": return this.$t('pedding_sysTypeDesc01').toString(); //業務/服展/整銷業務
                        case "2": return this.$t('pedding_sysTypeDesc02').toString(); //整銷(含內勤/關係企業)
                        case "3": return this.$t('pedding_sysTypeDesc03').toString(); //保經代
                        default:
                            return "";
                    }
                },
                width: 150,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentUnitNo",
                title: this.$t('pedding_agentUnitId').toString(), //單位代號
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentUnitName",
                title: this.$t('pedding_agentUnitName').toString(), //單位名稱
                width: 100,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentId",
                title: this.$t('pedding_agentId').toString(), //業務員ID
                width: 100,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "agentName",
                title: this.$t('pedding_agentName').toString(), //業務員姓名
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "agentId2",
                title: this.$t('pedding_agentId2').toString(), //第二業務員ID
                width: 130,
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "agentName2",
                title: this.$t('pedding_agentName2').toString(), //第二業務員姓名
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "tmrDepartmentId",
                title: this.$t('global_division').toString(), //科別
                width: 140,
                formatter: (data: PendingGrid) => {
                    return data.tmrDepartmentName;
                },
                align: 'center'
            },
            {
                type: FblColumnType.ELLIPSIS,
                property: "tmrId",
                title: this.$t('global_telemarketer').toString(), //電訪員
                formatter: (data: PendingGrid) => {
                    return data.tmrName;
                },
                width: CommonUtil.countColumnWidth(6),
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "obdStageId",
                title: this.$t('pedding_caseStage').toString(), //案件階段
                formatter: (data: PendingGrid) => {
                    return data.obdStageName;
                },
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "obdStatusId",
                title: this.$t('pedding_caseStatus').toString(), //案件狀態
                formatter: (data: PendingGrid) => {
                    return data.obdStatusName;
                },
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "cont",
                title: this.$t('pedding_caseLevel').toString(), //案件等級
                formatter: (data: PendingGrid) => {
                    if (data.cont == PeddingPage.Select1) {
                        return this.$t('pedding_emergency').toString(); //急件
                    } else {
                        return this.$t('pedding_emergencyNot').toString(); //非急件
                    }
                },
                width: 80,
                align: 'center'
            },
        ]
    };

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
        );
    }

    /**
     * 頁面開啟
     * @returns 
     */
    created() {
        this.reverseItemMapping.set(this.$t('dispatchManagement_pendingPicked').toString(), "dispatchManagement_pendingPicked"); // 新件待取件
        this.reverseItemMapping.set(this.$t('dispatchManagement_pendingDued').toString(), "dispatchManagement_pendingDued"); // 新件逾時未取
        this.reverseItemMapping.set(this.$t('dispatchManagement_callBackPicked').toString(), "dispatchManagement_callBackPicked"); // 回撥件待取件
        this.reverseItemMapping.set(this.$t('dispatchManagement_callBackDued').toString(), "dispatchManagement_callBackDued"); // 回撥件逾時未取
        this.reverseItemMapping.set(this.$t('dispatchManagement_pendingAboutDued').toString(), "dispatchManagement_pendingAboutDued"); // 新件即將逾時未取
        this.reverseItemMapping.set(this.$t('dispatchManagement_callBackAboutDued').toString(), "dispatchManagement_callBackAboutDued"); // 回撥件即將逾時未取

        if (this.$route.query && !ValidationUtil.isEmpty(this.$route.query.dispatchType) && !ValidationUtil.isEmpty(this.$route.query.contactItemId)) {
            this.peddingFilter.dispatchTaskDto = {
                dispatchType: this.reverseItemMapping.get(this.$route.query.dispatchType), // 第一欄數值(項目)
                contactItemId: (this.$route.query.contactItemId) as string, // 該欄數值(電訪項目ID)
            };
            this.$route.query.dispatchType = "";
            this.$route.query.contactItemId = "";
        }

        LoadingUtil.show();
        this.$authApi.getAuthComponentUsingGET(this.$route.path)
            .then((res: AxiosResponse<ComponentDto>) => {
                if (res.data.component) {
                    this.authComponent.PENDDING_GET_CASE= ValidationUtil.isEmpty(res.data.component.PENDDING_GET_CASE) ? this.authComponent.PENDDING_GET_CASE : res.data.component.PENDDING_GET_CASE;
                    this.authComponent.PENDDING_SEARCH= ValidationUtil.isEmpty(res.data.component.PENDDING_SEARCH) ? this.authComponent.PENDDING_SEARCH : res.data.component.PENDDING_SEARCH;
                    this.authComponent.PENDDING_EXPORT = ValidationUtil.isEmpty(res.data.component.PENDDING_EXPORT) ? this.authComponent.PENDDING_EXPORT : res.data.component.PENDDING_EXPORT;
                    this.authComponent.PENDDING_CASE_REMARK = ValidationUtil.isEmpty(res.data.component.PENDDING_CASE_REMARK) ? this.authComponent.PENDDING_CASE_REMARK : res.data.component.PENDDING_CASE_REMARK;
                    this.authComponent.PENDDING_CHANGE_DUE_DATE= ValidationUtil.isEmpty(res.data.component.PENDDING_CHANGE_DUE_DATE) ? this.authComponent.PENDDING_CHANGE_DUE_DATE : res.data.component.PENDDING_CHANGE_DUE_DATE;
                    
                }

            }).catch((err) => {
                console.log(err);
            });
        this.$pendingPageApi.getInitSearchDataUsingPOST().then((resp)=>{
            if(resp.data.unitDepInfo != null){
                this.unitDepInfo = resp.data.unitDepInfo;
                // 部門對應科別/人員資料
                this.depUnitInfo = resp.data.unitDepInfo.depUnitInfo;
                this.depUserInfo = resp.data.unitDepInfo.depUserInfo;
        
                // 科別對應人員資料
                this.unitUserInfo = resp.data.unitDepInfo.unitUserInfo;
        
                // 部門 下拉
                this.selectDeptOptions = Object.assign(resp.data.unitDepInfo.departOptions);
                
                // 科別 下拉
                this.allDivList = resp.data.unitDepInfo.unitList;
                
                // 電訪員 下拉
                this.allUserList = resp.data.unitDepInfo.userList;
        
                // 有預設部門需一起異動科別/人員
                if(!ValidationUtil.isEmpty(resp.data.unitDepInfo.defaultDepId)) {
                    this.onSelectDept();
                }
            }
            //案件階段
            if(resp.data.obdStageSelectOption != null){
                this.selectPolicyStageOptions = this.selectPolicyStageOptions.concat(resp.data.obdStageSelectOption);
            }
            //案件狀態
            if(resp.data.obdStatusSelectOption != null){
                this.selectPolicyStatusOptions = this.selectPolicyStatusOptions.concat(resp.data.obdStatusSelectOption);
            }
            //案件階段、狀態關聯資訊
            if(resp.data.obdStatusAndStageList != null){
                this.selectStageAndStatus = resp.data.obdStatusAndStageList;
            }
            //電訪項目類型
            if(resp.data.taskTypeSelectOption != null){
                this.selectPolicyTypeOptions = Object.assign(resp.data.taskTypeSelectOption);
            }
            //電訪項目
            if(resp.data.taskSelectOption != null){
                this.selectContactItemOptions = Object.assign(resp.data.taskSelectOption);
            }
            this.selectStageChange();
            this.peddingSearchForm.caseStatusId = this.defaultStatusId;
            this.peddingSearch();
        }).catch((err)=>{
            LoadingUtil.close();
            // 下拉選單選項載入失敗
            ErrorModalUtil.modalError(this.$t('pedding_selectOptionLoadingFailed').toString());
        })
    }

    //重整頁面
    reload() {
        if (this.searchFlag) {
            this.searchFlag = false;
            this.pendingListForPolicyMark = null;
            LoadingUtil.show();
            // 整理為 Filters
            this.peddingFilter.filterView = this.peddingSearchFilters;
            this.$pendingPageApi.paginatePendingUsingPOST(this.grid.pagination.current - 1, this.grid.pagination.pageSize, this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined, this.peddingFilter)
                .then((resp) => {
                    const p = { ...this.grid.pagination };
                    p.total = parseInt(resp.data.paginate.totalElements);
                    let temparayDataList = resp.data.paginate.content;
                    //過濾是否被選擇的PendingCases
                    if (this.caseNumbers.size > 0) {
                        let caseNumbersArray = Array.from(this.caseNumbers);
                        for (let i = 0; i < this.caseNumbers.size; i++) {
                            temparayDataList.forEach((e) => {
                                if (caseNumbersArray[i] == parseInt(e.caseNo)) {
                                    e.modifyCallDateSelected = true;
                                }
                            })
                        }
                    } else {
                        temparayDataList.filter(e => e.modifyCallDateSelected == true).forEach(
                            e => {
                                e.modifyCallDateSelected = false;
                            }
                        )


                    }
                    this.grid.data = temparayDataList;
                    this.grid.pagination = p;
                    this.packCount = resp.data.packCount;
                    if (p.total == 0) {
                        //	查無符合篩選條件之資料
                        MessageUtil.messageInfo(this.$t('global_searchNoMatchData').toString());
                    }
                    //確認查詢結果是否超出匯出最大限制筆數
                    this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then((exportCheck) => {
                        if (exportCheck.data.isOverMaxCount) {
                            this.isExportDisable = true;
                        }
                        this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                        LoadingUtil.close();
                    }).catch((err) => {
                        //待電訪查詢失敗
                        ErrorModalUtil.modalError(this.$t('pedding_seachFailed').toString())
                        LoadingUtil.close();
                    })
                }).catch((err) => {
                    //待電訪查詢失敗
                    ErrorModalUtil.modalError(this.$t('pedding_seachFailed').toString())
                    LoadingUtil.close();
                }).finally(() => {
                    this.searchFlag = true;
                })
                this.peddingFilter.dispatchTaskDto = null;
        }
    }

    //查詢
    peddingSearch() {
        if (this.validateSearch(true)) {
            this.isExportDisable = false;
            const emptyList = [];
            const importDateStart = FiltersUtil.setFilterParam("createDate", FblOperator.GEQ, (this.peddingSearchForm.importStartDate == null) ? null : moment(this.peddingSearchForm.importStartDate).startOf("day").toISOString(true));
            const importDateEnd = FiltersUtil.setFilterParam("createDate", FblOperator.LEQ, (this.peddingSearchForm.importEndDate == null) ? null : moment(this.peddingSearchForm.importEndDate).endOf("day").toISOString(true));
            const dueContDateChgStart = FiltersUtil.setFilterParam("dueContDateChg", FblOperator.GEQ, moment(this.peddingSearchForm.dueContactStartDate).startOf("day").toISOString(true));
            const dueContDateChgEnd = FiltersUtil.setFilterParam("dueContDateChg", FblOperator.LEQ, moment(this.peddingSearchForm.dueContactEndDate).endOf("day").toISOString(true));
            const contactDateStart = FiltersUtil.setFilterParam("visitEndDate", FblOperator.GEQ, (this.peddingSearchForm.contactDates[0] == null) ? null : MomentUtil.transferMomentToTimestamp(this.peddingSearchForm.contactDates[0]));
            const contactDateEnd = FiltersUtil.setFilterParam("visitStartDate", FblOperator.LEQ, (this.peddingSearchForm.contactDates[1] == null) ? null : MomentUtil.transferMomentToTimestamp(this.peddingSearchForm.contactDates[1]));
            const obdStage = FiltersUtil.setFilterParam("obdStage", FblOperator.EQ, this.peddingSearchForm.caseStageId);
            const obdStatus = FiltersUtil.setFilterParam("obdStatus", FblOperator.EQ, this.peddingSearchForm.caseStatusId);
            const policyNo = FiltersUtil.setFilterParam("policyNo", FblOperator.EQ, this.peddingSearchForm.policyNo01);
            const policySeq = FiltersUtil.setFilterParam("policySeq", FblOperator.EQ, this.peddingSearchForm.policyNo02);
            const idDup = FiltersUtil.setFilterParam("idDup", FblOperator.EQ, this.peddingSearchForm.policyNo03);
            const custId = FiltersUtil.setFilterParam("custId", FblOperator.EQ, this.peddingSearchForm.respondentsId.toUpperCase());
            const changeNo = FiltersUtil.setFilterParam("changeNo", FblOperator.EQ, this.peddingSearchForm.changeNo);
            //法代
            switch (this.peddingSearchForm.isLegal) {
                case PeddingPage.SelectY: this.peddingFilter.isLegal = true;
                    break;
                case PeddingPage.SelectN: this.peddingFilter.isLegal = false;
                    break;
                default:
                    this.peddingFilter.isLegal = null;
            }
            //案件等級
            switch (this.peddingSearchForm.caseLevelId) {
                case PeddingPage.Select1: this.peddingFilter.isUrgent = true;
                    break;
                case PeddingPage.Select2: this.peddingFilter.isUrgent = false;
                    break;
                default:
                    this.peddingFilter.isUrgent = null;
            }
            //優先
            switch (this.peddingSearchForm.priorityId) {
                case PeddingPage.SelectY: this.peddingFilter.isPriority = true;
                    break;
                case PeddingPage.SelectN: this.peddingFilter.isPriority = false;
                    break;
                default:
                    this.peddingFilter.isPriority = null;
            }
            this.peddingFilter.checkVisitDateNotNull = false;
            this.peddingFilter.contactItemIdList = (this.peddingSearchForm.contactItemIdList.length == 0) ? emptyList : this.peddingSearchForm.contactItemIdList;
            this.peddingFilter.departmentIdList = (this.peddingSearchForm.departmentIdList.length == 0) ? emptyList : this.peddingSearchForm.departmentIdList;
            this.peddingFilter.divisionIdList = (this.peddingSearchForm.divisionIdList.length == 0) ? emptyList : this.peddingSearchForm.divisionIdList;
            this.peddingFilter.tmrIdList = (this.peddingSearchForm.tmrIdList.length == 0) ? emptyList : this.peddingSearchForm.tmrIdList;
            this.peddingFilter.contactItemIdList = (this.peddingSearchForm.contactItemIdList.length == 0) ? emptyList : this.peddingSearchForm.contactItemIdList;
            this.peddingFilter.obdType = (this.peddingSearchForm.typeIdList.length == 0) ? emptyList : this.peddingSearchForm.typeIdList;
            this.peddingFilter.agentId = this.peddingSearchForm.agentId;
            this.peddingFilter.agentName = this.peddingSearchForm.agentName;
            this.peddingFilter.agentUnitId = this.peddingSearchForm.agentUnitId;
            this.peddingFilter.specifyStartTime = ValidationUtil.isEmpty(this.peddingSearchForm.specifyContactStartString) ? null : this.peddingSearchForm.specifyContactStartString;
            this.peddingFilter.specifyEndTime = ValidationUtil.isEmpty(this.peddingSearchForm.specifyContactEndString) ? null : this.peddingSearchForm.specifyContactEndString;
            this.peddingSearchFilters = FiltersUtil.setFilters(importDateStart, importDateEnd, dueContDateChgStart, dueContDateChgEnd, obdStage, obdStatus, policyNo, policySeq, idDup, custId,
                changeNo, contactDateStart, contactDateEnd);
            this.grid.pagination.current = 1;
            this.caseNumbers.clear();
            this.grid.data = [];
            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch(isRealSearch) {
        let validate = true;
        let validateImportDate = true;
        let validateDueContactDate = true;
        this.validateImportStartDate(null, this.peddingSearchForm.importStartString, () => {
            if (this.peddingSearchValidateForm.importStartDate.feedback) {
                validateImportDate = false;
                validate = false;
            }
        });

        this.validateImportEndDate(null, this.peddingSearchForm.importEndString, () => {
            if (this.peddingSearchValidateForm.importEndDate.feedback) {
                validateImportDate = false;
                validate = false;
            }
        });
        
        this.validateDueContactStartDate(null, this.peddingSearchForm.dueContactStartString, () => {
            if (this.peddingSearchValidateForm.dueContactStartDate.feedback) {
                validateDueContactDate = false;
                validate = false;
            }
        });
        this.validateDueContactEndDate(null, this.peddingSearchForm.dueContactEndString, () => {
            if (this.peddingSearchValidateForm.dueContactEndDate.feedback) {
                validateDueContactDate = false;
                validate = false;
            }
        });
        this.validatePolicyNo(null, null, () => {
            if (this.peddingSearchValidateForm.policyNo01.feedback) {
                validate = false;
            }else{
                this.validatePolicyNo02(null, null, () => {
                    if (this.peddingSearchValidateForm.policyNo02.feedback) {
                        validate = false;
                    }
                });
        
                this.validatePolicyNo03(null, null, () => {
                    if (this.peddingSearchValidateForm.policyNo03.feedback) {
                        validate = false;
                    }
                });
            }
        });   

        this.validateRespondetsId(null, this.peddingSearchForm.respondentsId, () => {
            if (this.peddingSearchValidateForm.respondentsId.feedback) {
                validate = false;
            }
        });

        this.validateChangeNo(null, this.peddingSearchForm.changeNo, () => {
            if (this.peddingSearchValidateForm.changeNo.feedback) {
                validate = false;
            }
        });

        this.validateAgentUnitId(null, this.peddingSearchForm.agentUnitId, () => {
            if (this.peddingSearchValidateForm.agentUnitId.feedback) {
                validate = false;
            }
        });

        this.validateAgentId(null, this.peddingSearchForm.agentId, () => {
            if (this.peddingSearchValidateForm.agentId.feedback) {
                validate = false;
            }
        });

        //起始與結束皆符合規範才進一步判斷起訖區間
        if (validateImportDate && !ValidationUtil.isEmpty(this.peddingSearchForm.importStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.importEndString)) {
            this.validateImportStartAndEndDate(null, this.peddingSearchForm.importStartDate, this.peddingSearchForm.importEndDate, this.peddingSearchForm.importStartString,
                this.peddingSearchForm.importEndString, this.isImportDateStartVisible, this.isImportDateEndVisible, () => {
                    if (this.peddingSearchValidateForm.importStartDate.feedback || this.peddingSearchValidateForm.importEndDate.feedback) {
                        validate = false;
                    }
                });
        }
        if (validateDueContactDate && !ValidationUtil.isEmpty(this.peddingSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.dueContactEndString)) {
            this.validateDueContactStartAndEndDate(null, this.peddingSearchForm.datePickerDueContactStartDate, this.peddingSearchForm.datePickerDueCountactEndDate, this.peddingSearchForm.dueContactStartString,
                this.peddingSearchForm.dueContactEndString, this.isDueContactStartVisible, this.isDueContactEndVisible, () => {
                    if (this.peddingSearchValidateForm.dueContactStartDate.feedback || this.peddingSearchValidateForm.dueContactEndDate.feedback) {
                        validate = false;
                    }
                });
        }

        //起始與結束時間皆符合規範才進一步判斷起訖區間
        if (!ValidationUtil.isEmpty(this.peddingSearchForm.specifyContactStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.specifyContactEndString)) {
            this.validateSpecifyStartAndEndTime(null, this.peddingSearchForm.specifyContactStartTime, this.peddingSearchForm.specifyContactEndTime, () => {
                if (this.peddingSearchValidateForm.specifyContactStartTime.feedback || this.peddingSearchValidateForm.specifyContactEndTime.feedback) {
                    validate = false;
                }
            });
        }

        if (validate && isRealSearch) {
            //檢核查詢條件匯入日期與應電訪日至少輸入一項
            if(VlidationUtil.isEmpty(this.peddingSearchForm.importStartDate) && VlidationUtil.isEmpty(this.peddingSearchForm.importEndDate)
             && VlidationUtil.isEmpty(this.peddingSearchForm.dueContactStartDate) && VlidationUtil.isEmpty(this.peddingSearchForm.dueContactEndDate)
             && VlidationUtil.isEmpty(this.peddingSearchForm.policyNo01) && VlidationUtil.isEmpty(this.peddingSearchForm.changeNo)){
                validate = false;
                ErrorModalUtil.modalError(this.$t('pedding_importOrDueContactDateRequire').toString()); //查詢條件匯入日期與應電訪日需擇一填寫
            }
        }

        if (validate && isRealSearch) {
            //檢核查詢條件數量(少於兩個不可執行查詢)
            let countResult = this.checkFilterCount();
            validate = countResult;
            if (!countResult) {
                ErrorModalUtil.modalError(this.$t('pedding_filterCountError').toString()); //查詢條件至少輸入兩項
            }
        }
        
        return validate;
    }

    //檢核查詢條件數量(少於兩個不可執行查詢)
    checkFilterCount() {
        let isAbleToSearch = false;
        let filterColumn = [];

        Object.keys(this.peddingSearchForm).forEach((key=>{
            if(key == 'contactDates'){
                if (null != this.peddingSearchForm[key][0] || null != this.peddingSearchForm[key][1]) {
                    filterColumn.push(key);
                }
            } else if(key != 'importStartDate' && key !='importEndDate' && key !='dueContactStartDate' && key !='dueContactEndDate' && key !='specifyContactStartTime' && key != 'specifyContactEndTime'){
                if (!ValidationUtil.isEmpty(this.peddingSearchForm[key])) {
                    filterColumn.push(key);
                }
            }
        }))

        //若有填寫保單號碼或受理案號 即可直接查詢
        if(filterColumn.some((c)=>c == 'policyNo01' || c == 'changeNo' )){
            isAbleToSearch = true;
        }

        //計算有效查詢欄位數量
        if(!isAbleToSearch){
            let count = 0;
            if(filterColumn.some((c)=> c == "policyNo01" || c == "policyNo02" || c =="policyNo03")){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "policyNo01" && c != "policyNo02" && c !="policyNo03" );
            }
            if(filterColumn.some((c)=> c == "importStartString" || c == "importEndString")){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "importStartString" && c != "importEndString");
            }
            if(filterColumn.some((c)=> c == "dueContactStartString" || c == "dueContactEndString" )){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "dueContactStartString" && c != "dueContactEndString" && c != "datePickerDueContactStartDate" && c != "datePickerDueCountactEndDate" );
            }
            if(filterColumn.some((c)=> c == "specifyContactStartString" || c == "specifyContactEndString")){
                count ++;
                filterColumn = filterColumn.filter((c)=> c != "specifyContactStartString" && c != "specifyContactEndString" );
            }

            count = count + filterColumn.length;

            if(count >=2){
                isAbleToSearch = true;
            }
        }
        
        return isAbleToSearch;
    }

    //個人再電訪快速查詢
    pendingClick() {
        this.resetPeddingSearchForm();
        this.clearSearchFrom();
        this.personalCondition();
        this.isExportDisable = false;
        this.peddingFilter.tmrIdList = [LoginModule.loginState.me.id];
        this.peddingFilter.departmentIdList = [];
        this.peddingFilter.checkVisitDateNotNull = true;
        this.grid.pagination.current = 1;
        this.caseNumbers = new Set();
        this.peddingSearchFilters = FiltersUtil.setFilters();
        this.reload();
    }

    //個人今日再電訪快速查詢
    pendingTodayClick() {
        this.resetPeddingSearchForm();
        this.clearSearchFrom();
        this.personalCondition();
        this.isExportDisable = false;
        const contactDateStart1 = FiltersUtil.setFilterParam("visitStartDate", FblOperator.GEQ, moment(new Date()).startOf("day").toISOString(true));
        const contactDateEnd1 = FiltersUtil.setFilterParam("visitStartDate", FblOperator.LEQ, moment(new Date()).endOf("day").toISOString(true));
        const contactDateStart2 = FiltersUtil.setFilterParam("visitEndDate", FblOperator.GEQ, moment(new Date()).startOf("day").toISOString(true));
        const contactDateEnd2 = FiltersUtil.setFilterParam("visitEndDate", FblOperator.LEQ, moment(new Date()).endOf("day").toISOString(true));
        this.peddingFilter.tmrIdList = [LoginModule.loginState.me.id];
        this.peddingFilter.departmentIdList = [];
        this.peddingSearchFilters = FiltersUtil.setFilters(contactDateStart1, contactDateStart2, contactDateEnd1, contactDateEnd2);
        this.reload();
    }

    //個人(今日)再電訪查詢條件清空
    personalCondition(){
        this.peddingSearchForm = {
            importStartDate: null,
            importEndDate: null,
            importStartString: "",
            importEndString: "",
            contactDates: [],
            policyNo01: "",
            policyNo02: "",
            policyNo03: "",
            changeNo: "",
            dueContactStartDate: null,
            dueContactEndDate: null,
            dueContactStartString: "",
            dueContactEndString: "",
            respondentsId: "",
            contactItemIdList: [],
            caseStageId: "",
            typeIdList: [],
            caseStatusId: "",
            caseLevelId: "",
            priorityId: "",
            departmentIdList: [],
            divisionIdList: [],
            specifyContactStartTime: null,
            specifyContactEndTime: null,
            specifyContactStartString: "",
            specifyContactEndString: "",
            tmrIdList: [],
            agentUnitId: "",
            agentId: "",
            agentName: "",
            isLegal: "",
        };
    }

    // OBD2-1543 系統登入後的主畫面調整為待電訪查詢畫面 按下取件 導轉到 執機畫面
    pendingPickUp() {
        // console.log("pendingPickUp......execute"); // <-- 實作邏輯後之後請刪除
        PackMatchModule.updateMatchedCasePack(null);
        PackMatchModule.updatePickpResult(null);
        PackMatchModule.clearTrasitionResult();         // 初始化續訪下拉選單與歸戶提示訊息
        PackMatchModule.clearTeleResultAreaSelectAns(); // VL903-1114 清除 電訪結果資訊 vuex & localStorage
        PackMatchModule.clearTeleResultAreaContactAns(); // VL903-1129 清除 電訪結果之方便聯絡時間 vuex & localStorage
        //撥號資訊初始化
        callUpInfoModule.setCallUpInfo({ codingNo: "", sessionId: "", previousCodingNoList: [] });
        LoadingUtil.show();
        this.$packMatchApi.queryCasePackTempUsingGET(LoginModule.loginState.me.id).then((resp) => {
            const queryCasePackTempOpen = "Y";
            if (resp.data.success) {
                //存至Vuex 與 Local Storage
                PackMatchModule.updatePickpResult(resp.data);
                PackMatchModule.updateMatchedCasePack(resp.data.firstCasePack);
                //名單是否在本次儲存過方便聯絡時間初始化
                ContinuePackMoudle.initContinuePackInfo();
                LoadingUtil.close();
                this.$router.push("/on-duty");
            } else {
                LoadingUtil.close();
                if (queryCasePackTempOpen == resp.data.returnCode) {
                    //取件預處理失敗
                    // 1.PACK_MATCH_TEMP_CASENO_NOT_FOUND 取件預處理 執行失敗 案件編號不存在
                    ErrorModalUtil.modalError(this.$t(resp.data.returnMessage).toString());
                } else {
                    // 1.取件預處理未啟用 直接導頁
                    // 2.無設定指定案件編號
                    // 執行正式自動撮合
                    this.realPickUp();
                }
            }
        }).catch((err) => {
            LoadingUtil.close();
            // 取件預處理 執行失敗
            ErrorModalUtil.modalError(this.$t('packMatch_temp_query_packNoFailed').toString());
        })
    }

    //實際取件
    realPickUp(){
        LoadingUtil.show();
        this.$packMatchApi.queryAndMatchCasePackUsingGET().then((resp)=>{
            LoadingUtil.close();
            if(!resp.data.success){
                if(ValidationUtil.isEmpty(resp.data.returnMessage)){
                    ErrorModalUtil.modalError(this.$t('packMatch_query_packNoFailed').toString());
                }else{
                    ErrorModalUtil.modalError(resp.data.returnMessage);
                }
            }else{
                if(resp.data.firstCasePack!= null){
                    PackMatchModule.updatePickpResult(resp.data);
                    PackMatchModule.updateMatchedCasePack(resp.data.firstCasePack);
                    //名單是否在本次儲存過方便聯絡時間初始化
                    ContinuePackMoudle.initContinuePackInfo();
                    this.$router.push("/on-duty");
                }else{
                    Modal.info(
                        {
                            class: "error-modal-util-class",
                            title: () => this.$t("global_information").toString(),//提示訊息
                            content: () => this.$t('packMatch_query_noMatchedPack').toString(), //撮合結果:無符合之電訪案件可派發!
                            onOk: () => {}
                        }
                    )
                }
            }
        }).catch((err)=>{
            LoadingUtil.close();
            ErrorModalUtil.modalError(this.$t('packMatch_query_packNoFailed').toString());
        })
    }

    //清除所有查詢條件
    clearSearchFrom() {
        this.peddingSearchForm.departmentIdList = [];
        this.peddingSearchForm.dueContactStartDate = null;
        this.peddingSearchForm.datePickerDueContactStartDate = null;
        this.peddingSearchForm.datePickerDueCountactEndDate = null;
        this.peddingSearchForm.dueContactEndDate = null;
        this.peddingSearchForm.dueContactStartString = "";
        this.peddingSearchForm.dueContactEndString = "";
        this.peddingSearchForm.caseStageId = "";
        this.peddingSearchForm.caseStatusId = "";
    }

    //待電訪查詢結果匯出
    exportSearchResult() {
        if (!this.isExportDisable) {
            if (this.grid.data.length == 0) {
                ErrorModalUtil.modalError(this.$t('global_noMatchExportFailed').toString()); //無符合結果，無法匯出
            } else {
                LoadingUtil.show();
                // 整理為 Filters
                this.peddingFilter.filterView = this.peddingSearchFilters;
                this.$pendingPageApi.excelPendingToExportUsingPOST(this.peddingFilter, { responseType: 'blob' })
                    .then((resp) => {
                        this.dealDownLoadData(resp.data, this.$t('pedding_peddingExport').toString() + ".xlsx"); //待電訪匯出
                        MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
                    }).catch((err) => {
                        ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                    }).finally(() => {
                        LoadingUtil.close();
                    })
            }
        } else {
            if (ValidationUtil.isEmpty(this.overMaxRowCountMessage)) {
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            } else {
                //匯出筆數超過最大限制
                ErrorModalUtil.modalError(this.overMaxRowCountMessage);
            }
        }
    }

    //處理後端回傳的下載內容
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
            ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
        }
    }

    //上方查詢條件回復預設值
    resetPeddingSearchForm() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm = {
            importStartDate: null,
            importEndDate: null,
            importStartString: "",
            importEndString: "",
            contactDates: [null, null],
            policyNo01: "",
            policyNo02: "",
            policyNo03: "",
            changeNo: "",
            dueContactStartDate: moment(new Date()).startOf("day"),
            datePickerDueContactStartDate: moment(new Date()).startOf("day").toDate(),
            dueContactEndDate: moment(new Date()).startOf("day"),
            datePickerDueCountactEndDate: moment(new Date()).startOf("day").toDate(),
            dueContactStartString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            dueContactEndString: MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date())),
            respondentsId: "",
            contactItemIdList: [],
            caseStageId: this.defaultStageId,
            typeIdList: [],
            caseStatusId: this.defaultStatusId,
            caseLevelId: "",
            priorityId: "",
            departmentIdList: [],
            divisionIdList: [],
            specifyContactStartTime: null,
            specifyContactEndTime: null,
            specifyContactStartString: "",
            specifyContactEndString: "",
            tmrIdList: [],
            agentUnitId: "",
            agentId: "",
            agentName: "",
            isLegal: "",
        };
        this.peddingFilter.checkVisitDateNotNull = false;
        this.grid.data = [];
        this.caseNumbers = new Set();
        this.grid.pagination.total = 0;
        this.packCount = 0;
        this.clearValidateStatus();
        this.selectPolicyStatusOptions = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
        let set = new Set();
        this.selectStageAndStatus.filter((status) => this.peddingSearchForm.caseStageId == status.smemo1)
                .forEach((status) => {
                    if (!set.has(status.code)) {
                        set.add(status.code);
                        this.selectPolicyStatusOptions.push({ label: status.sdesc, value: status.code });
                    }
                })
        this.onSelectDept();
        this.grid.pagination.current = 1;
    }

    //方便連絡時段的時間選擇區塊是否顯示
    showTimeRangePanel: boolean = false;
    toggleTimeRangePanel() {
        this.showTimeRangePanel = !this.showTimeRangePanel;
    }

    //清除查詢條件的驗證狀態
    clearValidateStatus() {
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo01, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo03, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.contactDates, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactEndTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.respondentsId, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.changeNo, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentUnitId, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentId, false, '', false);
    }

    //換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.sort = e.sort;
            this.grid.pagination = e.pagination;
            this.reload();
        }
    }

    checkSelected(data: PendingGrid) {
        if (data.isSelected || data.modifyCallDateSelected) {
            return true;
        }
    }

    //===========================應電訪日起訖 相關方法 start ==========================================
    //自動轉為字串更新搜尋條件
    onDueContractStartChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.dueContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.peddingSearchForm.dueContactStartDate = date;
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        this.validateSearch(false);
    }

    //自動轉為字串更新搜尋條件
    onDueContractEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.dueContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.peddingSearchForm.dueContactEndDate = date;
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        this.validateSearch(false);
    }

    //清除日期
    clearDueContractDate(cleanType: String) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        if(cleanType === DatePickerTypeEnum.StartDate) {
            this.peddingSearchForm[DatePickerEnum.dueContactStartString] = "";
            this.peddingSearchForm[DatePickerEnum.dueContactStartDate] = null;
            if(!VlidationUtil.isEmpty(this.peddingSearchForm.dueContactEndDate)){
                this.isDueContactStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('pedding_dueContactDateStartRequire').toString(), false); //應電訪日(起) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.peddingSearchForm[DatePickerEnum.dueContactEndString] = "";
            this.peddingSearchForm[DatePickerEnum.dueContactEndDate] = null;
            if(!VlidationUtil.isEmpty(this.peddingSearchForm.dueContactStartDate)){
                this.isDueContactEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('pedding_dueContactDateEndRequire').toString(), false); //應電訪日(訖) 必填
            }
        }
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDueContractStartDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        this.peddingSearchForm.datePickerDueContactStartDate = parseDate;
        } else {
            this.isDueContactStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('global_dateError').toString(), false);
        }
        this.peddingSearchForm.dueContactStartDate = parseDate ? parseDate : this.peddingSearchForm.dueContactStartDate;
        this.peddingSearchForm.dueContactStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.peddingSearchForm.dueContactStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputDueContractEndDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isDueContactStartVisible = false;
        this.isDueContactEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
            this.peddingSearchForm.datePickerDueCountactEndDate = parseDate;
        } else {
            this.isDueContactEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('global_dateError').toString(), false);
        }
        this.peddingSearchForm.dueContactEndDate = parseDate ? parseDate : this.peddingSearchForm.dueContactEndDate;
        this.peddingSearchForm.dueContactEndString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.peddingSearchForm.dueContactEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    //===========================應電訪日起訖 相關方法 end ==========================================

    //===========================方便連絡日 相關方法 start ==========================================
    //自動轉為字串更新搜尋條件
    onContactDatesChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.contactDates = [date[0], date[1]];
        this.timeTitleFormat = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date(date[0])));
    }
    //清除日期
    clearContactDates() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.contactDates, false, '', false);
        this.isContactDatesVisible = false;
        this.peddingSearchForm.contactDates = [null, null];
        this.timeTitleFormat = MomentUtil.transTimePickerTitle(MomentUtil.default(new Date()));
    }

    //手動關閉日期選擇器
    handCloseContactDatesPicker() {
        this.closeContactDatesPicker();
    }

    //關閉日期選擇器時，改回日期畫面並隱藏
    closeContactDatesPicker() {
        this.showTimeRangePanel = false;
        this.isContactDatePickerOpen = false;
    }

    //開啟日期選擇器
    openContactDatesPicker() {
        this.isContactDatePickerOpen = true;
    }

    //===========================方便連絡日 相關方法 end ==========================================

    //===========================匯入起訖 相關方法 start ==========================================
    //自動轉為字串更新搜尋條件
    onImportStartChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.importStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isImportDateStartVisible = false;
        this.isImportDateEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        this.validateSearch(false);
    }

    //自動轉為字串更新搜尋條件
    onImportEndChange(date) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.importEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
        this.isImportDateStartVisible = false;
        this.isImportDateEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        this.validateSearch(false);
    }

    //清除日期
    clearImportDate(cleanType) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        this.isImportDateStartVisible = false;
        if(cleanType === DatePickerTypeEnum.StartDate) {
            this.peddingSearchForm[DatePickerEnum.importStartString] = "";
            this.peddingSearchForm[DatePickerEnum.importStartDate] = null;
            if(!VlidationUtil.isEmpty(this.peddingSearchForm.importEndDate)){
                this.isDueContactStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('pedding_importDateStartRequire').toString(), false); //匯入日期(起) 必填
            }
        } else if (cleanType === DatePickerTypeEnum.EndDate) {
            this.peddingSearchForm[DatePickerEnum.importEndString] = "";
            this.peddingSearchForm[DatePickerEnum.importEndDate] = null;
            if(!VlidationUtil.isEmpty(this.peddingSearchForm.importStartDate)){
                this.isDueContactEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('pedding_importDateEndRequire').toString(), false); //匯入日期(訖) 必填
            }
        }
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputImportStartDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isImportDateStartVisible = false;
        this.isImportDateEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        } else {
            this.isImportDateStartVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
        }
        this.peddingSearchForm.importStartDate = parseDate ? parseDate : this.peddingSearchForm.importStartDate;
        this.peddingSearchForm.importStartString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.peddingSearchForm.importStartDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    /**
     * 手動輸入開始日期時檢查日期是否符合曆法
     * @param data 
     */
    checkManualInputImportEndDate(data: any) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.isImportDateStartVisible = false;
        this.isImportDateEndVisible = false;
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        const parseDate = this.formatter.parse(data.currentTarget.value);
        if (parseDate) {
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        } else {
            this.isImportDateEndVisible = true;
            // 日期錯誤
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
        }
        this.peddingSearchForm.importEndDate = parseDate ? parseDate : this.peddingSearchForm.importEndDate;
        this.peddingSearchForm.importEndString = parseDate ?
            MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.peddingSearchForm.importEndDate.toString()))) :
            data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
    }

    //===========================匯入起訖 相關方法 end ==========================================

    /**
     * 選擇部門時，科別範圍限縮
     */
    onSelectDept() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.selectDiviOptions = [];
        this.selectTmrOptions = [];
       
        if (this.peddingSearchForm.departmentIdList.length > 0) {
          // 組科別 下拉，從 部門對應科別的下拉選單選項來源 篩選 該科屬於該部
          this.peddingSearchForm.departmentIdList.forEach((depId) => {
        
            // 取得部門對應的科別
            if(!ValidationUtil.isEmpty(this.depUnitInfo[depId])){
              this.selectDiviOptions = this.selectDiviOptions.concat(this.depUnitInfo[depId]);
            }
    
            // 取得部門對應人員
            if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
              this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
            }
            
          });
            
        }else{
            // 科別 下拉
            this.selectDiviOptions = Object.assign(this.allDivList);

            // 電訪員 下拉
            this.selectTmrOptions = Object.assign(this.allUserList);
        }

        //重置科別選項
        let unitIdTempList = Object.assign(this.peddingSearchForm.divisionIdList);
        unitIdTempList.forEach((eachSelected)=>{
            // 如果當前選擇的科別不在科別下拉選單裡，則要移除
            if(!this.selectDiviOptions.some((allDiv) => allDiv.value == eachSelected)){
                if(this.peddingSearchForm.divisionIdList.length > 0) {
                this.peddingSearchForm.divisionIdList = this.peddingSearchForm.divisionIdList.filter(unitId => unitId != eachSelected);
                }
            }
        });

        //重置電訪員選項
        let userIdTempList = Object.assign(this.peddingSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {
            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
                if(this.peddingSearchForm.tmrIdList.length > 0) {
                this.peddingSearchForm.tmrIdList = this.peddingSearchForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });

        //連動科別異動
        this.onSeletDivi();
    }

    /**
     * 選擇科別時，電訪員範圍限縮
     */
    onSeletDivi() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.selectTmrOptions = [];
        if(this.peddingSearchForm.divisionIdList.length > 0){
            // 取得科別對應人員
            this.peddingSearchForm.divisionIdList.forEach( (unitId) => {
                if(!ValidationUtil.isEmpty(this.unitUserInfo[unitId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.unitUserInfo[unitId]);
                }
            });
        }else{
            // 有選擇部門
            if (this.peddingSearchForm.departmentIdList.length > 0) {

                this.peddingSearchForm.departmentIdList.forEach((depId) => {

                // 取得部門對應人員
                if(!ValidationUtil.isEmpty(this.depUserInfo[depId])) {
                    this.selectTmrOptions = this.selectTmrOptions.concat(this.depUserInfo[depId]);
                }
                
                });
                
            } else {
                // 電訪員 下拉
                this.selectTmrOptions = Object.assign(this.allUserList);
            }
        }

        //重置電訪員選項
        let userIdTempList = Object.assign(this.peddingSearchForm.tmrIdList);
        userIdTempList.forEach((eachSelected) => {
            // 如果當前選擇的人員不在人員下拉選單裡，則要移除
            if(!this.selectTmrOptions.some((allUser) => allUser.value == eachSelected)){
                if(this.peddingSearchForm.tmrIdList.length > 0) {
                this.peddingSearchForm.tmrIdList = this.peddingSearchForm.tmrIdList.filter(userId => userId != eachSelected);
                }
            }
        });
    }

    //===========================時間選擇器 相關方法 start ==========================================

    //點選時間選擇器
    clickSpecifyContactStartTimePicker(open) {
        this.isSpecifyContactStartOpen = open;
    }

    clickSpecifyContactEndTimePicker(open) {
        this.isSpecifyContactEndOpen = open;
    }

    //選擇時間後，將時間更新
    onSpecifyContactStartTimeChange(date, timeString) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactEndTime, false, '', false);
        this.peddingSearchForm.specifyContactStartString = timeString;
        this.validateSearch(false);
    }

    onSpecifyContactEndTimeChange(date, timeString) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactEndTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactStartTime, false, '', false);
        this.peddingSearchForm.specifyContactEndString = timeString;
        this.validateSearch(false);
    }

    //手動關閉時間選擇器
    closeSpecifyContactStartTimePicker() {
        this.isSpecifyContactStartOpen = false;
    }

    closeSpecifyContactEndTimePicker() {
        this.isSpecifyContactEndOpen = false;
    }

    //===========================時間選擇器 相關方法 end ==========================================
    //===========================改應電訪日 相關屬性和方法 modifyCallDate Start==========================

    //顯示改應電訪日視窗
    modifyCallingDateVisible: boolean = false;

    //當checkBox被選取時其caseNo會帶入set中
    caseNumbers = new Set();
    //將caseNo從set轉為array
    caseNumbersArray = [];
    //caseNo和其對應的案件狀態
    pendingCasesMapStatus = new Map<number, boolean>();

    // 勾選狀態改變
    onCheckedChange(e) {
        let pedingCase: PendingGrid = e.row.data
        pedingCase.modifyCallDateSelected = e.$event.target.checked;

        if (pedingCase.modifyCallDateSelected == true) { //當被勾選後其回傳值為true 將caseNo加入set
            this.caseNumbers.add(parseInt(pedingCase.caseNo));
            this.$pendingPageApi.judgeCaseFinishedyetUsingGET(pedingCase.caseNo)
                .then((resp) => {
                    let flag = resp.data;
                    this.pendingCasesMapStatus.set(parseInt(pedingCase.caseNo), flag);
                }).catch(() => {
                    ErrorModalUtil.modalError(this.$t("judge_cases_fiinished_yet").toString());
                })

        } else { //當不被勾選後其回傳值為false 將caseNo從set去除
            if (this.caseNumbers.has(parseInt(pedingCase.caseNo))) {
                this.caseNumbers.delete(parseInt(pedingCase.caseNo));
            }
            if (this.pendingCasesMapStatus.has(parseInt(pedingCase.caseNo))) {
                this.pendingCasesMapStatus.delete(parseInt(pedingCase.caseNo));
            }
        }

    }

    modifyCallDateModalCancel() {
        this.modifyCallingDateVisible = false;

    }
    //按下應電訪日
    onModifyCallDateClick() {
        this.caseNumbersArray = Array.from(this.caseNumbers);

        if (this.caseNumbersArray.length != 0) {
            let judgeCasesFinishedFlag = false;
            for (let i = 0; i < this.pendingCasesMapStatus.size; i++) {
                if (this.pendingCasesMapStatus.get(this.caseNumbersArray[i]) == true) {
                    judgeCasesFinishedFlag = true;
                    break;
                }
            }
            //假設勾選的有結案的案子則進行提示擋件
            if (judgeCasesFinishedFlag == true) {

                Modal.info(
                    {
                        class: "error-modal-util-class",
                        title: () => this.$t("global_information").toString(),//提示訊息
                        content: () => this.$t("pending_case_finished_not_modify").toString(),
                        onOk: () => {
                            this.modifyCallingDateVisible = false;
                        }
                    }
                )
            } else {
                this.modifyCallingDateVisible = true;
            }
        }
        else {
            //假設沒有勾選任何一個提示需選擇
            Modal.info(
                {
                    class: "error-modal-util-class",
                    title: () => this.$t("global_information").toString(),//提示訊息
                    content: () => this.$t("pending_cases_choose_first").toString(),
                    onOk: () => {
                        this.modifyCallingDateVisible = false;

                    }
                }
            )
        }
    }
    async modifyCallDateModalSubmit() {
        await (this.$refs.modifyCallTime as any).submit();
    }
    //應電訪日修改成功後
    onCallDateModify() {
        this.modifyCallingDateVisible = false;
        this.caseNumbers.clear();
        this.grid.data = [];
        MessageUtil.messageInfo(this.$t('modified_success').toString());
        this.reload();
    }

    //=================================改應電訪日 modifyCallDate end==========================
    //單選下拉選單選項異動
    selectChange() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
    }

    //案件階段下拉選單選項異動
    selectStageChange() {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.peddingSearchForm.caseStatusId = "";
        this.selectPolicyStatusOptions = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
        let set = new Set();
        if (!ValidationUtil.isEmpty(this.peddingSearchForm.caseStageId)) {
            this.selectStageAndStatus.filter((status) => this.peddingSearchForm.caseStageId == status.smemo1)
                .forEach((status) => {
                    if (!set.has(status.code)) {
                        set.add(status.code);
                        this.selectPolicyStatusOptions.push({ label: status.sdesc, value: status.code });
                    }
                })
        } else {
            this.selectStageAndStatus.forEach((status) => {
                if (!set.has(status.code)) {
                    set.add(status.code);
                    this.selectPolicyStatusOptions.push({ label: status.sdesc, value: status.code });
                }
            })
        }
    }

    /**
    * 匯入日期格式驗證(起)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateImportStartDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
                callback();
            } else {
                this.isImportDateStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        }else if(!VlidationUtil.isEmpty(this.peddingSearchForm.importEndDate)){
            this.isImportDateStartVisible = true;
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('pedding_importDateStartRequire').toString(), false); //匯入日期(起) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 匯入日期格式驗證(訖)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateImportEndDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
                callback();
            } else {
                this.isImportDateEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        }else if(!VlidationUtil.isEmpty(this.peddingSearchForm.importStartDate)){
            this.isImportDateEndVisible = true;
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('pedding_importDateEndRequire').toString(), false); //匯入日期(訖) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 待電訪日期格式驗證(起)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDueContactStartDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
                callback();
            } else {
                this.isDueContactStartVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        }else if(!VlidationUtil.isEmpty(this.peddingSearchForm.dueContactEndDate)){
            this.isDueContactStartVisible = true;
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('pedding_dueContactDateStartRequire').toString(), false); //應電訪日(起) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 待電訪日期格式驗證(訖)
    * @param rule 驗證規則 
    * @param value 日期
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDueContactEndDate(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            const parseDate = this.formatter.parse(value);
            if (parseDate) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
                callback();
            } else {
                this.isDueContactEndVisible = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('global_dateError').toString(), false); //日期錯誤
                callback(() => { });
            }
        }else if(!VlidationUtil.isEmpty(this.peddingSearchForm.dueContactStartDate)){
            this.isDueContactEndVisible = true;
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('pedding_dueContactDateEndRequire').toString(), false); //應電訪日(訖) 必填
            callback(() => { });
        }
        callback();
    }

    /**
    * 保單號碼驗證
    * @param rule 驗證規則 
    * @param value 驗證內容
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validatePolicyNo(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo01, false, '', false);
        if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo01)) {

            if(ValidationUtil.isAnyChinese(this.peddingSearchForm.policyNo01)){
                // 保單號碼 不可輸入中文
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo01, true,  this.$t('pedding_policyNo_noChinese').toString(), false);
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo03, false, '', false);
                callback(() => { });
            }else{
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo01, false, '', false);
                if (!ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo01)) {
                    if (ValidationUtil.isEmpty(this.peddingSearchForm.policyNo02)) {
                        // 保單序號 必填
                        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqRequired').toString(), false);
                    } else if (!ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo02)) {
                        // 保單序號 僅可輸入數字
                        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqFormatError').toString(), false);
                    } else {
                        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
                    }
                } else {
                    // 保單序號 僅可輸入數字
                    if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo02)) {
                        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqFormatError').toString(), false);
                    } else {
                        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
                    }
                }
            }


            
        } else {
            // 保單序號 僅可輸入數字
            if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo02) && !ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo02)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqFormatError').toString(), false);
            } else {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
            }
        }
        callback();
    }

    /**
    * 保單序號驗證
    * @param rule 驗證規則 
    * @param value 驗證內容
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validatePolicyNo02(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
        if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo02)) {
            if (!ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo02)) {
                // 保單序號 僅可輸入數字
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqFormatError').toString(), false);
                callback(() => { });
            }
        } else {
            if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo01)) {
                if (!ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo01)) {
                    // 保單序號 必填
                    CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, true,  this.$t('pedding_policyNoSeqRequired').toString(), false);
                    callback(() => { });
                } else {
                    CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo02, false, '', false);
                }
            }
        }
        callback();
    }

    /**
    * 保單重複碼驗證
    * @param rule 驗證規則 
    * @param value 驗證內容
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validatePolicyNo03(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo03, false, '', false);
        if (!ValidationUtil.isEmpty(this.peddingSearchForm.policyNo03)) {
            if (!ValidationUtil.numberOnlyValidation(this.peddingSearchForm.policyNo03)) {
                // 保單重複碼 僅可輸入數字
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.policyNo03, true,  this.$t('pedding_policyNoDupFormatError').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateImportStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            MomentUtil.betweenStartAndEndOverTime
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if(!isOver31Days){
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, false, '', false);
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, false, '', false);
                callback();
            }else{
                dateDisableStart = true;
                dateDisableEnd = true;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('pedding_startAndEndOver31_import').toString(), false); //起訖不可超過31天
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('pedding_startAndEndOver31_import').toString(), false); //起訖不可超過31天
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.peddingSearchForm.importStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.importEndString)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importStartDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.importEndDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
            }
            callback(() => { });
        }
        callback();
    }

    /**
    * 起訖日期驗證
    * @param rule 驗證規則 
    * @param startTime 起始日期
    * @param endTime 結束日期 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateDueContactStartAndEndDate(rule, startDate, endDate, startString, endString, dateDisableStart, dateDisableEnd, callback) {
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
        if (startString == endString || moment(startDate).isBefore(endDate)) {
            var isOver31Days = MomentUtil.betweenStartAndEndOverTime(moment(startDate), moment(endDate), 'days', 31);
            if(!isOver31Days){
                dateDisableStart = false;
                dateDisableEnd = false;
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, false, '', false);
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, false, '', false);
                callback();
            }else{
                dateDisableStart = true;
                dateDisableEnd = true;
                if (!ValidationUtil.isEmpty(this.peddingSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.dueContactEndString)) {
                    CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                    CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('pedding_startAndEndOver31_due').toString(), false); //起訖不可超過31天
                }
                callback(() => { });
            }
        } else {
            dateDisableStart = true;
            dateDisableEnd = true;
            if (!ValidationUtil.isEmpty(this.peddingSearchForm.dueContactStartString) && !ValidationUtil.isEmpty(this.peddingSearchForm.dueContactEndString)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactStartDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.dueContactEndDate, true, this.$t('global_pleaseInputCorrectStartAndEndDate').toString(), false); //請輸入正確的起訖日期
            }
            callback(() => { });
        }
        callback();
    }
    /**
    * 起訖時間驗證
    * @param rule 驗證規則 
    * @param startTime 起始時間
    * @param endTime 結束時間 
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateSpecifyStartAndEndTime(rule, startTime, endTime, callback) {
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactStartTime, false, '', false);
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactEndTime, false, '', false);
        if (!startTime.isBefore(endTime)) {
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactStartTime, true, this.$t('global_pleaseInputCorrectStartAndEndTime').toString(), false); //請輸入正確的起訖時間
            CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.specifyContactEndTime, true, this.$t('global_pleaseInputCorrectStartAndEndTime').toString(), false); //請輸入正確的起訖時間
            callback(() => { });
        }
        callback();
    }

    /**
    * 受訪者代碼驗證
    * @param rule 驗證規則 
    * @param value
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateRespondetsId(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.respondentsId, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.respondentsId, false, '', false);
                callback();
            } else {
                //受訪者代碼 僅可輸入英文與數字
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.respondentsId, true, this.$t('pedding_custIdFormatError').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    /**
    * 受理案號驗證
    * @param rule 驗證規則 
    * @param value
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateChangeNo(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.changeNo, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.changeNo, false, '', false);
                callback();
            } else {
                //受理案號 僅可輸入英文與數字
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.changeNo, true, this.$t('pedding_changeNoFormatError').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    /**
    * 單位代號驗證
    * @param rule 驗證規則 
    * @param value
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateAgentUnitId(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentUnitId, false, '', false);
        callback();
    }

    /**
    * 業務員ID驗證
    * @param rule 驗證規則 
    * @param value
    * @param callback 回乎函數，不帶參數表示驗證成功。
    * @returns 
    */
    validateAgentId(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentId, false, '', false);
        if (!ValidationUtil.isEmpty(value)) {
            if (ValidationUtil.alphabetAndNumberValidation(value)) {
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentId, false, '', false);
                callback();
            } else {
                //業務員ID 僅可輸入英文與數字
                CommonUtil.feildValidateWithVisible(this.peddingSearchValidateForm.agentId, true, this.$t('pedding_agentIdFormatError').toString(), false);
                callback(() => { });
            }
        }
        callback();
    }

    //業務員姓名驗證
    validateAgentName(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
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

    //將陣列轉字串，以逗號分隔
    changeListIntoString(list: string[]) {
        let s = "";
        let count = 0;
        list.forEach((item) => {
            count++;
            s = s + item;
            if (count != list.length) {
                s = s + "、";
            }
        })
        return s;
    }

    // 案件註記表單開啟
    policyMarkClick() {
        this.caseNumbersArray = Array.from(this.caseNumbers);
        if (this.caseNumbersArray.length > 0) {
            this.$pendingPageApi.getPolicyListUsingGET(this.caseNumbersArray).then((resp) => {
                // 非停用的部門科別電訪員下拉資料
                this.activedUnitDepInfo = resp.data.unitDepInfo;
                this.activedDeptOptions = Object.assign(resp.data.unitDepInfo.departOptions);
                
                let count = resp.data.closedPolicyNoList.length + resp.data.closedChangeNo.length;
                if (count > 0 && count != resp.data.pendingList.length) {
                    Modal.info(
                        {
                            class: "error-modal-util-class",
                            title: () => this.$t("global_information").toString(),//提示訊息
                            content: (h) => {
                                let msgListWithPObject = [];
                                if (resp.data.closedPolicyNoList.length > 0) {
                                    msgListWithPObject.push(h('div', this.$t('pedding_policyNo').toString() + "： ")); //保單號碼
                                    msgListWithPObject.push(h('div', {
                                        attrs: {
                                            style: `color: blue;`,
                                        },
                                    }, this.changeListIntoString(resp.data.closedPolicyNoList)));
                                }
                                if (resp.data.closedChangeNo.length > 0) {
                                    msgListWithPObject.push(h('div', this.$t('pedding_changeNo').toString() + "： ")); //受理案號
                                    msgListWithPObject.push(h('div', {
                                        attrs: {
                                            style: `color: blue;`,
                                        },
                                    }, this.changeListIntoString(resp.data.closedChangeNo)));
                                }
                                msgListWithPObject.push(h('div', this.$t('pedding_mark_check_div').toString()));  //已結案，請分別執行案件註記
                                return h('div', {}, msgListWithPObject);
                            },
                        }
                    )
                } else {
                    this.pendingListForPolicyMark = resp.data.pendingList;
                    if (count > 0) {
                        this.isMarkReboot = true;
                    } else {
                        this.isMarkReboot = false;
                    }
                    this.policyMaskVisible = true;
                }
            })
        } else {
            Modal.info(
                {
                    class: "error-modal-util-class",
                    title: () => this.$t("global_information").toString(),//提示訊息
                    content: () => this.$t("pending_case_choose_first").toString(),
                    onOk: () => {
                        this.modifyCallingDateVisible = false;

                    }
                }
            )
        }
    }

    // 案件註記表單送出
    policyMaskSubmit() {
        if ((this.$refs.policyMarkTable as any).validateSubmit()) {
            Modal.confirm({
                title: this.$t('global_save').toString(), //儲存
                content: this.$t('pedding_mark_sureToSave').toString() + '？', //確認執行儲存嗎？
                okText: this.$t('global_ok').toString(), //確認
                cancelText: this.$t('global_cancel').toString(),  //取消
                icon: 'info-circle',
                onOk: () => { (this.$refs.policyMarkTable as any).onFormSubmit();},
                onCancel: () => {  },
            });
        }
    }

    // 案件註記表單關閉
    policyMaskCancel() {
        this.policyMaskVisible = false;
        this.caseNumbers.clear();
        this.grid.data = [];
        this.reload();
        (this.$refs.policyMarkTable as any).onFormCancel();
    }

    //案件備註儲存成功後
    onPolicyMarkSubmit() {
        this.policyMaskVisible = false;
        this.caseNumbers.clear();
        this.grid.data = [];
        this.reload();
    }

    //========================共用驗證相關物件開始===================================

    // 取得驗證參數
    callCommonUtilFeild(fv: ValidateFormComponent){
        return CommonUtil.getFeildValid(fv);
    }

    // 變更hover hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================

  
}