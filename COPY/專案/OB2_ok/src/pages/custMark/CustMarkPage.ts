import { Vue, Component } from "vue-property-decorator";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { CustMarkSearchForm, EditDataDto, FeildValidation, SelectOption } from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { CustMarkGrid, MappFilter } from "@fubonlife/obd-api-axios-sdk/dist/api";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import CustMarkForm from "@/components/shared/form/custMarkForm/CustMarkForm.vue";
import moment from "moment";
import MessageUtil from "@/assets/config/MessageUtil";
import { Modal } from "ant-design-vue";
import "@/assets/less/custMark.less";

@Component({
    components: { FblDataGrid, HiddenFolde, CustMarkForm }
})
export default class CustMarkPage extends Vue {
    //查詢條件
    custMarkPageSearchForm :CustMarkSearchForm = {
        nationality: "",
        custId: "",
        skillLanguage: [],
        skillTag: [],
    };

    //判斷當下是否可執行匯出
    isExportDisable: boolean = true;
    //匯出筆數超過最大限制的錯誤訊息
    overMaxRowCountMessage: string = "";

    //表單按鈕文字
    formButtonText: string = "";

    //特殊保戶註記表單是否顯示
    formVisible:boolean = false;

    editingData: EditDataDto = {};

    //控制不重複搜尋的flag
    searchFlag: boolean = true;

    custMarkRules: { [key: string]: ValidationRule[] } = {
        custId: [{ validator: this.validateCustId, trigger: "blur" }],
    };

    //客戶身分證字號搜尋欄位驗證提示工具
    custIdFeildValidation: FeildValidation = {
        feedback: false,
        state: "",
        hover: "",
    }

    // 搜尋欄位驗證方式
    custMarkSearchRules: { [key: string]: ValidationRule[] } = {
        custId: [{ validator: this.validateCustId, trigger: "blur" }],
    };

    //國籍、語言、標籤下拉選項
    selectNationalityOptions: SelectOption[] = [];
    selectSkillLanguageOptions: SelectOption[] = [];
    selectSkillTagOptions: SelectOption[] = [];

    // 搜尋條件過濾
    custMarkSearchFilters: FblFilters = {
        filters: []
    };
    mappFilter: MappFilter = {
        languageId:[],
        tagId:[]
    }

    // 任務資料顯示設定
    grid: FblPDataGridHolder<CustMarkGrid> = {
        rowKey: "custMarkId",
        data: [],
        pagination: {
            showSizeChanger: true,
            pageSizeOptions: ['15', '30', '50'],
            current: 1,
            pageSize: 30,
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
                        title: this.$t('global_edit').toString(), //編輯
                        edit: true,
                    },
                    {
                        name: "delete",
                        title: this.$t('global_delete').toString(), //刪除
                        delete: true
                    }

                ],
                width:90
            },
            {
                type: FblColumnType.PLAIN,
                property: "nationality",
                title: this.$t('custMark_nationality').toString(), //客戶國籍,
                formatter: (data: CustMarkGrid) => {
                    if ("native" == data.nationality) {
                        return this.$t('custMark_native').toString(); // 本國人
                    } else if("foreigner" == data.nationality) {
                        return this.$t('custMark_foreigner').toString(); // 外國人
                    }else{
                        return this.$t('custMark_codeError').toString(); // 代碼有誤
                    }
                },
                width:90
            },
            {
                type: FblColumnType.PLAIN,
                property: "custId",
                title: this.$t('custMark_custId').toString(), //客戶身分證字號
                sorter: true,
                formatter: (data:CustMarkGrid) =>{
                    if (data.custId) {
                        return data.custId;
                    }else{
                        return ""
                    }
                },
                width:150
            },
            {
                type: FblColumnType.PLAIN,
                property: "custName",
                title: this.$t('global_humanName').toString(), //姓名
            },
            {
                type: FblColumnType.PLAIN,
                property: "skillLanguageString",
                title: this.$t('global_language').toString(), // 語言 多項 以;隔開
                formatter: (data: CustMarkGrid) => {
                    if("" == data.skillLanguageString){
                        return "";
                    }else{
                        return data.skillLanguageString;
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "skillTagString",
                title: this.$t('custMark_tag').toString(), //客戶標籤
                formatter: (data: CustMarkGrid) => {
                    if("" == data.skillTagString){
                        return "";
                    }else{
                        return data.skillTagString;
                    }
                },
                width:150
            },
            {
                type: FblColumnType.PLAIN,
                property: "content",
                title: this.$t('custMark_content').toString(), //內容
                formatter: (data: CustMarkGrid) => {
                    if("" == data.content || null == data.content){
                        return "";
                    }else{
                        return data.content;
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                property: "handled",
                title: this.$t('custMark_handled').toString(), //處理方式
                formatter: (data: CustMarkGrid) => {
                    if("" == data.handled || null == data.handled){
                        return "";
                    }else{
                        return data.handled;
                    }
                },
            },
            {
                type: FblColumnType.BADGE,
                property: "isAffective",
                title: this.$t('global_effective').toString(), //有效 Y N
                formatter: (data: CustMarkGrid) => {
                    switch (data.isAffective) {
                        case "Y":
                            return this.$t('global_effective').toString(); // 有效
                        case "N":
                            return this.$t('global_invalid').toString(); // 無效
                        default:
                            return null;
                    }
                },
                badgeColor: (data: CustMarkGrid) => {
                    switch (data.isAffective) {
                        case "Y":
                            return "green";
                        case "N":
                            return "red";
                        default:
                            return null;
                    }
                },
                width:70
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateId",
                title: this.$t('global_lastChangeStaff').toString(), //最後異動人員 ID + name
                formatter(data:CustMarkGrid){
                    return data.updateId + " - " + data.updateName;
                },
                width:120
            },
            {
                type: FblColumnType.PLAIN,
                property: "updateTime",
                title: this.$t('global_lastChangeDate').toString(), //最後異動時間 YYY/MM/DD hh:mm:ss (民國年時分秒)
                formatter(data:CustMarkGrid){
                    return MomentUtil.transformRocYearMonthDayHHMMSS(data.updateTime);
                },
                width:140
            }
        ]
    };

    //下拉式清單搜尋用(依input過濾顯示符合的清單)
    filterOption(input, option) {
        return (
            option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >=0
        );
    }

    //初始化頁面
    created(){
        this.selectNationalityOptions = [{ label: this.$t('global_all').toString(), value: '' }]; //全部
        this.custMarkPageSearchForm = {
            nationality: "native",
            custId: "",
            skillLanguage: [],
            skillTag: [],
        };
        
        //語言下拉選單載入
        this.$commonApi.findByTypeIdUsingGET("skill.language")
            .then((resp)=>{
                resp.data.forEach((code)=>{
                    this.selectSkillLanguageOptions.push({label: code.label, value: code.value});
                })
            }).catch((err)=>{
                //語言下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('custMark_selectionL').toString())
            })
        //客戶標籤下拉選單載入
        this.$commonApi.findByTypeIdUsingGET("skill.tag")
            .then((resp)=>{
                resp.data.forEach((code)=>{
                    this.selectSkillTagOptions.push({label: code.label, value: code.value});
                })
            }).catch((err)=>{
                //客戶標籤下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('custMark_selectionT').toString())
            })
        //國籍下拉選單載入
        this.$commonApi.findByTypeIdUsingGET("nationality")
            .then((resp)=>{
                resp.data.forEach((code)=>{
                    this.selectNationalityOptions.push({label: code.label, value: code.value});
                })
            }).catch((err)=>{
                //國籍下拉選單載入失敗
                ErrorModalUtil.modalError(this.$t('custMark_selectionN').toString())
            })
        this.custMarkSearch();
    }

    //重整頁面
    reload(){
        this.formVisible = false;
        if(this.searchFlag){
            this.searchFlag = false;
            LoadingUtil.show();
            // 整理為 Filters
            const filter: string = JSON.stringify(this.custMarkSearchFilters); 
            
            this.$custMarkApi.paginateCustMarkUsingPOST(this.grid.pagination.current-1,this.grid.pagination.pageSize,filter,this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined,this.mappFilter)
            .then((resp)=>{
                const p = { ...this.grid.pagination };
                p.total = parseInt(resp.data.totalElements);
                this.grid.data = resp.data.content;
                this.grid.pagination = p;
                if(p.total == 0){
                    //	查無符合篩選條件之資料
                    MessageUtil.messageInfo(this.$t('CUST_MARK_NOT_FOUND').toString());
                }
                //確認查詢結果是否超出匯出最大限制筆數
                this.$exportApi.checkExportUsingGET(this.grid.pagination.total).then((exportCheck)=>{
                    if(exportCheck.data.isOverMaxCount){
                        this.isExportDisable = true;
                    }
                    this.overMaxRowCountMessage = exportCheck.data.errorMessage;
                }).catch((err)=>{
                    //特殊保戶註記查詢失敗
                    ErrorModalUtil.modalError(this.$t('custMark_paginateF').toString())
                }).finally(()=>{
                    this.searchFlag = true;
                    LoadingUtil.close();
                })
            })
        }
    }

    //查詢
    custMarkSearch(){
        if(this.validateSearch()){
            
            this.isExportDisable = false;
            if(this.custMarkPageSearchForm.skillLanguage.length == 0){
                this.mappFilter.languageId = [];
            }else{
                this.mappFilter.languageId = this.custMarkPageSearchForm.skillLanguage
            }
            if(this.custMarkPageSearchForm.skillTag.length == 0){
                this.mappFilter.tagId = [];
            }else{
                this.mappFilter.tagId = this.custMarkPageSearchForm.skillTag
            }
            const country = FiltersUtil.setFilterParam("nationality", FblOperator.EQ, (this.custMarkPageSearchForm.nationality));
            const custId = FiltersUtil.setFilterParam("custId", FblOperator.EQ, this.custMarkPageSearchForm.custId.toUpperCase());
            this.custMarkSearchFilters = FiltersUtil.setFilters(country, custId);
            this.grid.pagination.current = 1;
            this.reload();
        }
    }

    //查詢前驗證格式
    validateSearch(){
        let validate = true;
        this.validateCustId(null, this.custMarkPageSearchForm.custId, () => {
            if (this.custIdFeildValidation.state == 'error') {
                validate = false;
            }
        });
        return validate;
    }

    //上方查詢條件清除
    resetCustMarkSearchForm(){
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.custMarkPageSearchForm = {
            nationality: "",
            custId: "",
            skillLanguage: [],
            skillTag: [],
        };
        this.grid.data = [];
        this.grid.pagination.total = 0;
        this.feildValidate(this.custIdFeildValidation, false, "success", null, null);
    }

    //刪除/編輯
    onTableActionClick(e:FblActionEvent<CustMarkGrid>){
        switch (e.action.name) {
            case "delete":
                this.custMarkDelete(e.row.data);
                break;
            case "edit":
                this.showCustMarkEditModal(e.row.data);
                break;
        }
    }

    //換頁
    onPageChange(e: FblPageEvent){
        if(this.grid.data.length>0){
            this.grid.pagination = e.pagination;
            this.grid.sort = e.sort;
            this.reload();
        }
    }

    //刪除
    custMarkDelete(data: CustMarkGrid){
        Modal.confirm({
            okText: this.$t('global_ok').toString(), //確定
            cancelText: this.$t('global_cancel').toString(), //取消
            title: this.$t('global_delete').toString(), //刪除
            content: this.$t('custMark_confirmDeleteMsg').toString(), //請確認是否要刪除
            onOk: () => {
                LoadingUtil.show();
                this.$custMarkApi.deleteUsingPOST(data.custMarkId)
                .then(()=>{
                    //特殊保戶註記刪除成功
                    MessageUtil.messageSuccess(this.$t('custMark_DeleteSuccess').toString());
                })
                .catch((err)=>{
                    //刪除失敗
                    ErrorModalUtil.modalError(this.$t(err.response.data.apiErrorCode).toString());  
                }).finally(()=>{
                    LoadingUtil.close();
                    this.reload();
                })
            }
        });
    }

    //編輯
    showCustMarkEditModal(data: CustMarkGrid){
        this.formButtonText = this.$t('global_modify').toString(); //修改
        this.formVisible = true;
        this.editingData = {
            custMarkId: data.custMarkId,
            nationality: data.nationality,
            custId: data.custId,
            name: data.custName,
            languageIdList: data.languageIdList,
            tagIdList: data.tagIdList,
            content: data.content,
            handled: data.handled,
            isAffective: data.isAffective,
            createId: data.createId,
            createName: data.createName,
            createTime: MomentUtil.transformRocYearMonthDayHHMMSS(data.createTime),
            updateId: data.updateId,
            updateName: data.updateName,
            updateTime: MomentUtil.transformRocYearMonthDayHHMMSS(data.updateTime),
            effectiveStartDate: moment(new Date(data.effectiveStartDate)),
            effectiveEndDate: (null == data.effectiveEndDate)? null :  moment(new Date(data.effectiveEndDate)),
            effectiveStartString: MomentUtil.transformRocYearMonthDay(data.effectiveStartDate),
            effectiveEndString: (null == data.effectiveEndDate)? "" :  MomentUtil.transformRocYearMonthDay(data.effectiveEndDate),
        };
    }

    //新增
    showCustMarkAddModal(){
        this.formButtonText = this.$t('global_add').toString(); //新增
        this.editingData = {
            custMarkId: "",
            nationality: "",
            custId: "",
            name: "",
            languageIdList: [],
            tagIdList: [],
            content: "",
            handled: "",
            isAffective: "",
            createId: "",
            createName: "",
            createTime: "",
            updateId: "",
            updateName: "",
            updateTime: "",
            effectiveStartDate: null,
            effectiveEndDate: null,
            effectiveStartString: "",
            effectiveEndString: "",
        }
        this.formVisible = true;
    }

    //新增修改表單送出
    custMarkModalSubmit(){
        if((this.$refs.custMarkForm as any).getIsEdit()){
            if((this.$refs.custMarkForm as any).validateSubmit()){
                Modal.confirm({
                    okText: this.$t('global_ok').toString(), //確定
                    cancelText: this.$t('global_cancel').toString(), //取消
                    title: this.formButtonText,
                    //請確認是否要新增/修改
                    content: this.$t('custMark_confirmMsg').toString()+ this.formButtonText + ' ?',
                    onOk: () => {
                        (this.$refs.custMarkForm as any).onFormSubmit();
                    }
                }); 
            }     
        }else{
            this.formVisible = false;
        }  
    }

    //新增/修改表單取消
    custMarkModalCancel(){
        this.formVisible = false;
    }

    //匯出
    exportCustMark(){
        if(!this.isExportDisable){
            if(this.grid.data.length==0){
                ErrorModalUtil.modalError(this.$t('userMP_noMatchExportFailed').toString()); //無符合結果，無法匯出
            }else{
                LoadingUtil.show();
                // 整理為 Filters
                const filter: string = JSON.stringify(this.custMarkSearchFilters); 
                this.$custMarkApi.excelExportUsingPOST(filter,this.mappFilter,{ responseType: 'blob' })
                .then((resp)=>{
                    this.dealDownLoadData(resp.data,"特殊保戶註記匯出.xlsx");
                    MessageUtil.messageSuccess(this.$t('global_exportSuccess').toString()); //匯出成功
                }).catch((err)=>{
                    ErrorModalUtil.modalError(this.$t('global_exportFailure').toString()); //匯出失敗
                }).finally(()=>{
                    LoadingUtil.close();
                })
            }
        }else{
            if(ValidationUtil.isEmpty(this.overMaxRowCountMessage)){
                ErrorModalUtil.modalError(this.$t('global_executeReloadBeforeExport').toString()); //請先執行查詢再匯出
            }else{
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


    //驗證共用物件
    feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
        fv.feedback = feedback == null ? fv.feedback : feedback;
        fv.state = state == null ? fv.state : state;
        fv.hover = hover == null ? fv.hover : hover;
        fv.msg = msg == null ? fv.msg : msg;
    }

    //客戶身分證字號驗證
    validateCustId(rule, value, callback) {
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.feildValidate(this.custIdFeildValidation, true, null, "", null);
        if (!ValidationUtil.isEmpty(value)) {
            if(ValidationUtil.idNoValidation(value)){
                if("native" == this.custMarkPageSearchForm.nationality){
                    //本國人 法定格式驗證
                    if(ValidationUtil.idNoNativeValidation(value)){
                        this.feildValidate(this.custIdFeildValidation,false,"success","","");
                    }else{
                        // 客戶身分證字號 格式有誤
                        this.feildValidate(this.custIdFeildValidation,true,"error","hover",this.$t('custMark_custIdFormatError').toString());
                        callback(() => { });
                    }
                }else{
                    //外國人 英數驗證
                    if(this.custMarkPageSearchForm.custId.length >10){
                        //客戶身分證字號 不可超過十個字
                        this.feildValidate(this.custIdFeildValidation,true,"error","hover",this.$t('custMark_custIdOverTen').toString());
                        callback(() => { });
                    }else{
                        this.feildValidate(this.custIdFeildValidation,false,"success","","");
                    }
                }
            }else{
                // 客戶身分證字號 格式有誤
                this.feildValidate(this.custIdFeildValidation,true,"error","hover",this.$t('custMark_custIdFormatError').toString());
                callback(() => { });
            }
        } else {
            this.feildValidate(this.custIdFeildValidation, false, "success", null, null);
        }
        callback();
    }

    //下拉選單選項異動
    onSelectionChange(){
        this.isExportDisable = true;
        this.overMaxRowCountMessage = "";
        this.validateCustId(null, this.custMarkPageSearchForm.custId, () => { });
    }
    
}