import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { InfTransferSearchDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { Vue, Component, Prop } from "vue-property-decorator";
import { InfTransferValidateForm } from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { FblColumnType, FblPageEvent, FblPDataGridHolder } from "../data-grid/models";
import CommonUtil from "@/assets/config/CommonUtil";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblFilters, FblOperator } from "../filter-builder/models";
import MessageUtil from "@/assets/config/MessageUtil";
import { Modal } from "ant-design-vue";

@Component({
    components: { FblDataGrid }
})
export default class CountersignatureModalTransfer extends Vue {
    @Prop()
    infInfoId:string;

    // 欄位驗證
    infTransferFormRules: { [key: string]: ValidationRule[] } = {
        name: [{ validator: this.validateName, trigger: "blur" }],
        ext: [{ validator: this.validateExtensionNo, trigger: "blur" }],
    };

    //回覆表單驗證物件
    infTransferValidateForm : InfTransferValidateForm = {
        name: { hover: "", feedback: false, state: "", msg: "" },
        ext: { hover: "", feedback: false, state: "", msg: "" },
    }

    //查詢表單欄位資訊
    form = {
        name: "",
        ext: "",
        previousChecked: "",
        personList:[],
    }

    //是否初次載入
    isInitSearch: boolean = true;

    // 搜尋條件過濾
    infTransferFilter: FblFilters = {
        filters: []
    };

    grid: FblPDataGridHolder<InfTransferSearchDto> = {
        rowKey: "employeeNo",
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
        scroll: { x: 500, y: 370 },
        columns: [
            {
                type: FblColumnType.CHECKBOX,
                property: "isSelected",
                title: this.$t('pedding_select').toString(), //選取
                width: 20,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "deptName",
                title: this.$t('infTransferForm_dept').toString(), //部門
                width: 100,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "name",
                title: this.$t('infTransferForm_name').toString(), //姓名
                width: 80,
                align: 'center'
            },
            {
                type: FblColumnType.PLAIN,
                property: "ext",
                title: this.$t('infTransferForm_ext').toString(), //分機
                width: 80,
                align: 'center'
            },
        ]
    };

    //初始化表單
    created(){
        this.reload();
    }

    //重整表單
    reload(){
        this.grid.data = [];
        const filter: string = JSON.stringify(this.infTransferFilter); 
        LoadingUtil.show();
        this.$informApi.findByConditionalUsingPOST(filter,this.infInfoId,this.isInitSearch).then((resp)=>{
            this.grid.data = resp.data;
            if(this.form.personList.length>0){
                this.form.personList.forEach((person)=>{
                    this.grid.data.filter((each)=>each.employeeNo == person.value).forEach((each)=>each.isSelected = true);
                })
            }
        }).catch((err)=>{
            // 人員資料查詢失敗
            ErrorModalUtil.modalError(this.$t('infTransferForm_OASearchFailed').toString())
        }).finally(()=>{
            LoadingUtil.close();
        })
    }

    //OA資訊查詢
    infTransferSearch(){
        if(this.validateSearch()){
            const name = FiltersUtil.setFilterParam("name", FblOperator.CONTAINS, this.form.name);
            const ext = FiltersUtil.setFilterParam("ext", FblOperator.EQ, this.form.ext);
            this.infTransferFilter = FiltersUtil.setFilters(name, ext);
            this.form.previousChecked="";
            this.reload();
        }
    }

    //查詢前的驗證
    validateSearch(){
        let validate = true;

        //姓名
        this.validateName(null,this.form.name,()=>{
            if(this.infTransferValidateForm.name.state == 'error'){
                validate = false;
            }
        });

        //分機
        this.validateExtensionNo(null,this.form.ext,()=>{
            if(this.infTransferValidateForm.ext.state == 'error'){
                validate = false;
            }
        });

        //判斷是否至少輸入一個查詢條件
        if(VlidationUtil.isEmpty(this.form.ext)&&VlidationUtil.isEmpty(this.form.name)){
            validate = false;
            ErrorModalUtil.modalError("請至少輸入一個查詢條件")
        }

        return validate;
    }

    //姓名驗證
    validateName(rule, value, callback){
        CommonUtil.feildValidate(this.infTransferValidateForm.name, false, "success", "", "");
        if (!VlidationUtil.isEmpty(this.form.name)) {
            if (this.form.name.length<2) {
                //姓名 不可小於2個字
                CommonUtil.feildValidate(this.infTransferValidateForm.name, true, "error", "hover", this.$t('infTransferForm_nameLess2').toString());
                callback(() => { });
            } else if(this.form.name.length>10) {
                //姓名 不可超過10個字
                CommonUtil.feildValidate(this.infTransferValidateForm.name, true, "error", "hover", this.$t('infTransferForm_nameOver10').toString());
                callback(() => { });
            }else{
                callback();
                CommonUtil.feildValidate(this.infTransferValidateForm.name, false, "success", "", "");
            }
        }
        callback();
    }

    //分機號碼驗證
    validateExtensionNo(rule, value, callback){
        CommonUtil.feildValidate(this.infTransferValidateForm.ext, false, "success", "", "");
        if (!VlidationUtil.isEmpty(this.form.ext)) {
            if (VlidationUtil.extensionNoValidation(this.form.ext)) {
                CommonUtil.feildValidate(this.infTransferValidateForm.ext, false, "success", "", "");
                callback();
            } else {
                //分機號碼 僅可輸入數字
                CommonUtil.feildValidate(this.infTransferValidateForm.ext, true, "error", "hover", this.$t('infTransferForm_extError').toString());
                callback(() => { });
            }
        }
        callback();
    }

    //勾選資料列
    onCheckedChange(e){
        let temp : InfTransferSearchDto[] = [];
        let selected: InfTransferSearchDto = e.row.data;
        if(VlidationUtil.isEmpty(selected.email)){
            // 該人員無email資訊，請重新選取
            ErrorModalUtil.modalError(this.$t('infTransferForm_noEmail').toString());
            this.grid.data.find((data)=> data.employeeNo == selected.employeeNo).isSelected = false;
        }else{
            this.grid.data.forEach((each)=>{
                let target = each;
                if(each.employeeNo == selected.employeeNo){
                    target.isSelected = e.$event.target.checked;
                    if(e.$event.target.checked){
                        this.form.personList.push({value:target.employeeNo, label: target.deptName + " " + target.name + " " + target.ext});
                    }else{
                        this.onTransferPersonChange(selected.employeeNo);
                    }
                }
                temp.push(target);
            })
            this.grid.data = temp;
        }
    }

    //選取預設值
    checkSelected(data: InfTransferSearchDto) {
        if (data.isSelected) {
            return true;
        }else{
            return false;
        }
    }

    //換頁
    onPageChange(e: FblPageEvent) {
        if (this.grid.data.length > 0) {
            this.grid.sort = e.sort;
            this.grid.pagination = e.pagination;
            this.reload();
        }
    }

    //轉件
    infTransfering(){
        Modal.confirm({
            class: "error-modal-util-class",
            // 確認執行轉件?
            content: this.$t('infTransferForm_transferConfirmMsg').toString(),
            okText: this.$t('global_yes').toString(), //是
            cancelText: this.$t('global_no').toString(),  //否
            icon: 'info-circle',
            onOk: () => {
                if(this.form.personList.length<1){
                    // 請先選取轉件對象
                    ErrorModalUtil.modalError(this.$t('infTransferForm_selectTransferPersonFirst').toString())
                }else{
                    let targetEmployeeNoList = [];
                    this.form.personList.forEach(person=>{
                        targetEmployeeNoList.push(person.value);
                    })
                    LoadingUtil.show();
                    this.$informApi.informTransferUsingPOST(targetEmployeeNoList,this.infInfoId).then((resp)=>{
                        LoadingUtil.close();
                        if(resp.data.success){
                            // 轉件成功
                            MessageUtil.messageSuccess(this.$t('infTransferForm_transferSuccess').toString());
                            this.$emit('transferSuccess');
                        }else{
                            ErrorModalUtil.modalError(this.$t(resp.data.apiErrorCode).toString());
                        }
                    }).catch((err)=>{
                        // 轉件失敗
                        ErrorModalUtil.modalError(this.$t('infTransferForm_transferFailed').toString());
                        LoadingUtil.close();
                    })
                }
            },
            onCancel: () => { },
        });
    }
    // 關閉 會辦項目清單 tag
    onTransferPersonChange(value) {
        this.form.personList = this.form.personList.filter((item)=> item.value != value);
        let temp = [];
        this.grid.data.forEach(each=>{
            if(value == each.employeeNo){
                each.isSelected = false;
            }
            temp.push(each);
        })
        this.grid.data = temp;
    }
}