import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import MailLetterEditFromValidationForm from "./model";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { AxiosResponse } from "axios";
import moment from "moment";
import ValidationUtil from "@/assets/config/ValidationUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { Modal } from "ant-design-vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { CasesTaskMailGrid, Option, MailByPostGrid, MailInforMationDto, MailByPostSettingUpdationDto, OutputErrorCodeDto, MailByPostSetting, ManualMailDto, MailByPost } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import MailLetterEditForm from "@/components/shared/form/mailLetter/mailLetterEditForm/MailLetterEditForm.vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { FileGrid } from "./model";
import {
    FblActionEvent,
    FblColumnType,
    FblPageEvent,
    FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import MailLetterCancelForm from "@/components/shared/form/mailLetter/mailLetterCancelForm/MailLetterCancelForm.vue"
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import ContinuePackStoreMoudle from "@/plugins/store/ContinuePackModule";

@Component({
    components: { FblDataGrid, MailLetterCancelForm, MailLetterEditForm }
})
export default class MailLetterForm extends Vue {



    created() {
        //上方郵寄設定table讀取
        this.mailByPostSettingReload();
    }
    //從外端判斷是否顯示上傳文件和下載word的button
    @Prop()
    editWordAndCancelLetterButtonFlag: boolean;

    @Prop()//由郵寄信函報表點進來時的caseNo;
    caseNo:string;

    get isEditWordAndCanelButtonFlag(): boolean {

        if (this.editWordAndCancelLetterButtonFlag) {
            return true;
        } else {
            return false
        }
    }

    // =============================郵寄文件自動產信設定與否 start=============================/

    /**
 * @description 郵寄文件資料欄位可操作的動作
 * @param e 
 */
    onMailByPostSettingTableActionClick(e: FblActionEvent<CasesTaskMailGrid>) {
        switch (e.action.name) {
            case "manulLetter":
                this.manualLetter(e.row.data);
                break;
        }
    }

    mailInformationCardVisible: boolean = false;

    //人工產信button按下
    manualLetter(rowData: CasesTaskMailGrid) {
        


        this.mailInformationReload(rowData.caseNo);
        //下方郵寄主檔紀錄讀取
        this.mailByPostGridReload(rowData.caseNo);

    }

    selectOptions: Option[] = [];

        //上方郵寄文件設定table reload圖示控制
        mailByPostSettingsloading: boolean = false;

    //讀取郵寄文件自動產信設定與否Table
    mailByPostSettingReload() {
        this.mailByPostSettingsloading=true;

        if(ValidationUtil.isEmpty(this.caseNo)){
        this.$mailByPostApi.getCasesMailByPostSettingByPackNoUsingPOST("",PackMatchModule.matchedCasePack.packNo)
            .then((resp: AxiosResponse<CasesTaskMailGrid[]>) => {
                this.mailByPostSettingsGrid.data = resp.data;
                if (resp.data.length > 0) {
                    this.selectOptions = this.mailByPostSettingsGrid.data[0].noLetterReasonOptions;
                }
            }).catch(error => {
                console.log(error);
            }).finally(() => {
              
                this.mailByPostSettingsloading=false;
            }
            )
        }else{

            this.$mailByPostApi.getCasesMailByPostSettingByPackNoUsingPOST(this.caseNo,"")
            .then((resp: AxiosResponse<CasesTaskMailGrid[]>) => {
                this.mailByPostSettingsGrid.data = resp.data;
                if (resp.data.length > 0) {
                    this.selectOptions = this.mailByPostSettingsGrid.data[0].noLetterReasonOptions;
                }
            }).catch(error => {
                console.log(error);
            }).finally(() => {
              
                this.mailByPostSettingsloading=false;
            }
            )
            console.log();
        }
        
    }
    //儲存郵寄文件設定儲存
    onSaveMailByPostSettingSubmit() {

        let saveObjectList = [];
        let gridList = this.mailByPostSettingsGrid.data.filter(grid => grid.batchCount == 0);
        let saveValidationFlag=true;
        for (var i = 0; i < gridList.length; i++) {
            let grid = gridList[i];
            let saveObject: MailByPostSettingUpdationDto = {};
            saveObject.caseNo = grid.caseNo;
            saveObject.packNo = grid.packNo;
            if (grid.autoLetter == "N") {
                saveObject.autoLetter = "N";
                if ( ValidationUtil.isEmpty(grid.noLetterReasonCode) ||(grid.noLetterReasonCode == "S" && ValidationUtil.isEmpty(grid.noLetterContent ))) {
                    ErrorModalUtil.modalError(this.$t("noticeManualLetterForm_notAutomaticMailLetter").toString() + "原因必填");
                    saveValidationFlag=false;
                    break;
                } else {
                    saveObject.noLetterReason = grid.noLetterReasonCode;
                    saveObject.noLetterContent = grid.noLetterContent;
                }
            } else {
                saveObject.autoLetter = "Y";
                saveObject.noLetterReason = "";
                saveObject.noLetterContent = "";
            }
            saveObjectList.push(saveObject);
        }
        //儲存
        if(saveValidationFlag){
        this.$mailByPostApi.updateCasesMailByPostSettingByPackNoUsingPOST(saveObjectList)
            .then((resp: AxiosResponse<MailByPostSetting[]>) => {
                MessageUtil.messageSuccess(this.$t("global_save_success").toString());
                this.mailByPostSettingReload()
            }).catch(error=>console.log(error))
        }else{
            return
        }

    }

    // 勾選狀態改變
    onCheckedChange(e) {
        let mailByPostSetting: CasesTaskMailGrid = e.row.data

        if (e.$event.target.checked) {
            mailByPostSetting.autoLetter = "N"
           

        } else {
            mailByPostSetting.autoLetter = "Y";
            mailByPostSetting.noLetterReasonCode="";
            mailByPostSetting.noLetterContent="";
        }
    }

    checkSelected(data: CasesTaskMailGrid) {
        if (data.autoLetter == "N") {
            return true;
        }
    }

    checkboxDisabledCheck(data: CasesTaskMailGrid) {
        if (data.batchCount > 0) {
            return false;
        } else {
            return false;
        }
    }
    selectValue(data: CasesTaskMailGrid) {
        return data.noLetterReasonCode
    }

    onSelectOptionsChange(e: CasesTaskMailGrid) {
        let mailByPostSetting: CasesTaskMailGrid = {};
        mailByPostSetting = e;
        mailByPostSetting.noLetterReasonCode = e.noLetterReasonCode;
        if(mailByPostSetting.noLetterReasonCode!="S"){
            mailByPostSetting.noLetterContent="";
        }
    }
    

    //inputChange改變時
    onSelectionInputChange(e: CasesTaskMailGrid,selectInputValue) {
        let mailByPostSetting: CasesTaskMailGrid = {};
        mailByPostSetting = JSON.parse(JSON.stringify(e));
        mailByPostSetting.noLetterContent=selectInputValue.data;
    }

    mailByPostSettingsGrid: FblPDataGridHolder<CasesTaskMailGrid> = {
        rowKey: "caseNo",
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
                property: "casePolicy",//
                title: this.$t("pedding_policyNo").toString(),//"保單號碼",
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "taskName",
                title: this.$t("noticeManualLetterForm_taskName").toString(),//電訪項目名稱
                width: CommonUtil.countColumnWidth(18),
                formatter:(data:CasesTaskMailGrid)=>{

                    return data.taskId+data.taskName;
                }
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_custName").toString(),//受訪者身份
                property: "custTypeName",
                width: CommonUtil.countColumnWidth(8),
            },
            {
                type: FblColumnType.CHECKBOX,
                title: this.$t("noticeManualLetterForm_notAutomaticMailLetter").toString(),//不自動產信
                property: "batchCount",
                width: CommonUtil.countColumnWidth(6),

            }, {
                type: FblColumnType.TEMPLATE,
                title: this.$t("noticeManualLetterForm_notAutomaticMailLetterReason").toString(),//不自動產信原因
                template:"selectionAndInputTemplate",
                width: CommonUtil.countColumnWidth(30)
            }, {
                type: FblColumnType.ACTION,
                title: "",
                actions: [
                    {
                        name: "manulLetter",
                        title: this.$t("noticeManualLetterForm_manualLetter").toString(), //人工產信
                        button: true
                    },
                ],
                width: CommonUtil.countColumnWidth(10),
            },
        ]
    }

    // =============================郵寄文件自動產信設定與否 end=============================/

    // =============================中間郵寄資訊 start=============================/
    addressOptions: Option[] = [];
    mailByPostDateString: string = "";//郵寄日期字串
    mailByPostDateMoment = null;
    //當點擊上方人工產信後中間郵寄資訊填入
    mailInformationReload(caseNo) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.custName, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.addressType, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, false, "", false);


        this.mailInformationCardVisible = true
        LoadingUtil.show();
        this.addressOptions = [];
        this.$mailByPostApi.getMailContentByCaseNoUsingPOST(caseNo)
            .then((resp: AxiosResponse<MailInforMationDto>) => {
                this.mailInformationForm = resp.data
            
                //設定下拉選單
                resp.data.addressOptions.forEach(mailOptionDto => {
                    this.addressOptions.push({
                        label: mailOptionDto.addressTypeDescription,
                        value: mailOptionDto.addressType
                    })
                })
                let mailOptionDto = this.mailInformationForm.addressOptions.find(mailOptionDto => mailOptionDto.address == this.mailInformationForm.address);
                //設定郵寄地址初始類型
                this.mailInformationForm.addressType = mailOptionDto.addressType;

                if(this.mailInformationForm.addressType!="O"){
                    this.addressTypeDisabled=true;
                }
                //日期預設為系統日+2工作日 由後端傳來
                this.mailByPostDateString = MomentUtil.transformRocYearMonthDay(this.mailInformationForm.mailByPostDate);
                this.mailByPostDateMoment = moment(new Date(resp.data.mailByPostDate));

               

            }).catch(error => {
                ErrorModalUtil.modalError(error.response.data.message);
                this.mailInformationCardVisible = false;
            }).finally(()=>LoadingUtil.close());
    }


    //當選單改變的時候
    onAddressChange() {
        let mailOptionDto = this.mailInformationForm.addressOptions.find(mailOptionDto => mailOptionDto.addressType == this.mailInformationForm.addressType);
        this.mailInformationForm.zipCode = mailOptionDto.zipCode;
        this.mailInformationForm.address = mailOptionDto.address;

    }

    //==========================dataPicker相關 in 中間郵寄資訊 start====================================

    // 為vue-datepicker套件所自製的formatter
    formatter = this.$twDateFormatter;
    onMailPostDateChange(date) {
        this.mailByPostDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));

    }
    //日期選擇器，可選擇範圍限定於系統日至系統日+2工作日
    disabledDate(value) {

        let date=moment(value).format("YYYY-MM-DD");
        let dayList=this.mailInformationForm.validatedPostDateList;
        return dayList.indexOf(date)==-1
       
    }

    //==========================dataPicker相關 in 中間郵寄資訊 end====================================
    // 人工產信將前端的值帶到後端
    onManualLetterSend() {
        

        (this.$refs.mailInformationForm as any).validate();


        let zipCodeValidation: boolean = !this.mailLetterEditValidationForm.zipCode.feedback ? true : false;
        let custNameValidation: boolean = !this.mailLetterEditValidationForm.custName.feedback ? true : false;
        let addressValidation: boolean = !this.mailLetterEditValidationForm.address.feedback ? true : false;
        let addressTypeValidation: boolean = !this.mailLetterEditValidationForm.addressType.feedback ? true : false;

        if(custNameValidation&&zipCodeValidation&&addressValidation&&addressTypeValidation){
        LoadingUtil.show();
        let manualMailBody: ManualMailDto = {};
        manualMailBody.mailByPostId = this.mailInformationForm.mailByPostId;
        manualMailBody.caseNo = this.mailInformationForm.caseNo;
        manualMailBody.casePolicy = this.mailInformationForm.casePolicy;
        manualMailBody.registerNo = this.mailInformationForm.registerNo;
        manualMailBody.mailBarCodeNo = this.mailInformationForm.mailBarCodeNo;
        manualMailBody.mailByPostDate = MomentUtil.transformRocYearMonthDay(this.mailByPostDateString);
        manualMailBody.zipCode = this.mailInformationForm.zipCode;
        manualMailBody.receiver = this.mailInformationForm.custName;
        manualMailBody.address = this.mailInformationForm.address;
        manualMailBody.addressType = this.mailInformationForm.addressType;
        
        this.$mailByPostApi.manulLetterUsingPOST(manualMailBody)
            .then((resp: AxiosResponse<MailByPost>) => {
                if(resp.data.abnormalReason!=null&&resp.data.abnormalReason!=""){

                    MessageUtil.messageWarning(resp.data.abnormalReason);
                }else{
                MessageUtil.messageSuccess(this.$t("noticeManualLetterForm_mailLetter_succeess").toString());
                }
                this.mailByPostGridReload(manualMailBody.caseNo);

            }).catch(error => {
                ErrorModalUtil.modalError(error.response.data.message);
            }).finally(()=>{
                LoadingUtil.close();
            })

        }else{
            return
        }
    }
    //中間郵寄資訊form
    mailInformationForm: MailInforMationDto = {
        mailByPostId: "",//郵寄編號
        custId: "",//客戶編號身分證id
        casePolicy: "",//保單號碼
        mailByPostDate: null,//郵寄日期型態為moment的date
        custName: "",//收件人預設為受訪者姓名
        custType: "",//受訪者身份
        zipCode: "",//郵遞區號
        address: "",//郵寄地址
        registerNo: "",
        addressOptions: null,//郵寄地址下拉選單
        addressType: "",//郵寄地址類型
        validatedPostDateList:null
    }
    // ============================驗證validate section start============================

    // 欄位驗證
    mailLetterEditFormRules: { [key: string]: ValidationRule[] } = {
        mailByPostDate: [{ validator: this.validateMailByPostDate, trigger: "blur" }],//郵寄日期
        custName: [{ validator: this.validateCustName, trigger: "blur" }],//收件人
        zipCode: [{ validator: this.validateZipCode, trigger: "blur" }],//郵遞區號
        address: [{ validator: this.validateAddress, trigger: "blur" }],//郵寄地址
        addressType: [{ validator: this.validateAddressType, trigger: "blur" }],////郵寄地址type

    };

    //修改郵寄主表表單驗證物件
    mailLetterEditValidationForm: MailLetterEditFromValidationForm = {
        mailByPostDate: { feedback: false, hoverVisible: false, msg: "" },
        custName: { feedback: false, hoverVisible: false, msg: "" },
        zipCode: { feedback: false, hoverVisible: false, msg: "" },
        address: { feedback: false, hoverVisible: false, msg: "" },
        addressType: { feedback: false, hoverVisible: false, msg: "" },
    }

    //顯示popOver的flag
    mailByPostDateVisible: boolean = false;
    custNameVisible: boolean = false;
    zipCodeVisible: boolean = false;
    addressVisible: boolean = false;
    addressTypeVisible: boolean = false;

    //驗證
    validateMailByPostDate(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, false, "", false);

        if (this.mailByPostDateMoment == null) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, true, this.$t("noticeManualLetterForm_mailPostDate_not_blank").toString(), false);//"郵寄日期不可為空"
            callback(false);
        }
    }

    mailByPostDateMouseOver() {
        if (this.mailLetterEditValidationForm.mailByPostDate.feedback) {
            this.mailByPostDateVisible = true;
        } else {
            this.mailByPostDateVisible = false;
        }

    }

    onSelectMailByPostDate() {
        this.validateMailByPostDate(null, this.mailByPostDateMoment, () => { });
    }

    //驗證收件人
    validateCustName(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.custName, false, "", false);

        if (this.mailInformationForm.custName.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.custName, true, this.$t("noticeManualLetterForm_receiver_not_blank").toString(), false);//"收件人不可為空"
            callback(false);
        }
    }

    custNameMouseOver() {
        if (this.mailLetterEditValidationForm.custName.feedback) {
            this.custNameVisible = true;
        } else {
            this.custNameVisible = false;
        }

    }
    //收件人改變時候
    onSelectCustName() {
        this.validateCustName(null, this.mailInformationForm.custName, () => { });
    }

    //驗證郵遞區號
    validateZipCode(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, false, "", false);

        if (ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, true, this.$t("noticeManualLetterForm_zipCode_not_blank").toString(), false);//"郵遞區號不可為空"
            callback(false);
        }
    }

    zipCodeMouseOver() {
        if (this.mailLetterEditValidationForm.zipCode.feedback) {
            this.zipCodeVisible = true;
        } else {
            this.zipCodeVisible = false;
        }

    }
    //收件人改變時候
    onSelectZipCode() {
        this.validateZipCode(null, this.mailInformationForm.zipCode, () => { });
    }

    //驗證郵寄地址
    validateAddress(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, false, "", false);

        if (ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, true, this.$t("noticeManualLetterForm_mailPostAddress_not_blank").toString(), false);//"郵寄地址不可為空"
            callback(false);
        }
    }

    addressMouseOver() {
        if (this.mailLetterEditValidationForm.address.feedback) {
            this.addressVisible = true;
        } else {
            this.addressVisible = false;
        }

    }
    //郵寄地址改變時候
    onSelectAddress() {
        this.validateAddress(null, this.mailInformationForm.address, () => { });
    }

    //驗證郵寄地址類型
    validateAddressType(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.addressType, false, "", false);

        if (ValidationUtil.isEmpty(value)) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.addressType, true, this.$t("noticeManualLetterForm_mailPostAddressType_not_blank").toString(), false);//"地址類型不可為空
            callback(false);
        }
    }

    addressTypeMouseOver() {
        if (this.mailLetterEditValidationForm.addressType.feedback) {
            this.addressTypeVisible = true;
        } else {
            this.addressTypeVisible = false;
        }

    }

    addressTypeDisabled:boolean=true;
    //郵寄地址類型改變時候
    onSelectAddressType() {
        let mailOptionDto = this.mailInformationForm.addressOptions.find(mailOptionDto => mailOptionDto.addressType == this.mailInformationForm.addressType);
        //設定郵寄地址初始類型
        this.mailInformationForm.address=mailOptionDto.address;
        this.mailInformationForm.zipCode=mailOptionDto.zipCode;
        if(this.mailInformationForm.addressType=="O"){
            this.addressTypeDisabled=false;
        }else{
            this.addressTypeDisabled=true;
        }
        this.validateAddressType(null, this.mailInformationForm.addressType, () => { });
        this.validateAddress(null, this.mailInformationForm.address, () => { });
        this.validateZipCode(null, this.mailInformationForm.zipCode, () => { });
    }



    // ============================驗證validate section end============================



    //========================共用驗證相關物件開始===================================

    //取得驗證feedback綁定的參數
    callCommonUtilFeildFeedback(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateFeedback(fv);
    }

    //取得驗證status綁定的參數
    callCommonUtilFeildStatus(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateStatus(fv);
    }

    //取得hover content綁定的參數
    callCommonUtilFeildMsg(fv: ValidateFormComponent) {
        return CommonUtil.getFeildValidateHoverMsg(fv);
    }

    //取得hover trigger綁定的參數
    callCommonUtilFeildTrigger(fv: ValidateFormComponent) {
        CommonUtil.getFeildVaildateTrigger(fv);
    }

    //取得hover hoverVisivle綁定的參數
    callCommonUtilFeildHoverVisible(fv: ValidateFormComponent) {
        return CommonUtil.getFeildVaildateHoverVisible(fv);
    }

    //變更hover hoverVisivle參數
    callCommonUtilFeildVisibleChange(fv: ValidateFormComponent) {
        CommonUtil.getFeildValidateVisibleChange(fv);
    }

    //========================共用驗證相關物件結束===================================

    // =============================中間郵寄資訊 end=============================/
    //  =============================下方郵寄主檔資料 start===========================
    //控制取消信函開啟與否
    cancelLetterVisible: boolean = false;
    //控制修改信函開啟與否
    modifyLetterVisible: boolean = false;

    onUpdateMailLetterSubmit() {

        (this.$refs.mailLetterEditForm as any).submit();

    }

    cancelCaseNo: string = "";
/**
* @description 郵寄主檔資料欄位可操作的動作
* @param e 
*/
    onMailByPostTableActionClick(e: FblActionEvent<MailByPostGrid>) {
        switch (e.action.name) {
            case "edit":
                this.editMailByPostGrid(e.row.data);
                break;
            case "downloadWord":
                this.downLoadWord(e.row.data);
                break;
            case "upLoadWord":

                break;
            case "cancel":
                this.cancelCaseNo = e.row.data.caseNo;
                this.cancelLetter(e.row.data);
                break;
            case "downlowdPDF":
                this.downlowdPDF(e.row.data)
                break;
        }
    }

    cancelLetterFormData: MailByPostGrid = {};

    afterCancelLetterMailByPostGridReload(e) {
        this.cancelLetterVisible = false;
        this.mailByPostGridReload(this.cancelCaseNo);
        this.mailInformationReload(this.cancelCaseNo);
    }

    //離開郵寄資訊
    leaveMailInformation() {

        this.mailInformationCardVisible = false;
        this.mailInformationForm = {}
        this.mailByPostGrid.data = [];
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.custName, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.addressType, false, "", false);
        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, false, "", false);
    }

    modifyLetterFormData: MailByPostGrid = {};

    //修改信函
    editMailByPostGrid(data: MailByPostGrid) {
        this.modifyLetterFormData = JSON.parse(JSON.stringify(data));
        this.modifyLetterVisible = true;
    }

    //取消信函
    cancelLetter(data: MailByPostGrid) {
        this.cancelLetterFormData = JSON.parse(JSON.stringify(data));
        this.cancelLetterVisible = true;

    }
    //送出取消信函
    onCancelMailLetterSubmit() {
        (this.$refs.mailLetterCancelForm as any).submit(this.cancelLetterFormData.mailByPostId);
    }


    downlowdPDF(data: MailByPostGrid) {
        this.$mailByPostApi.downloadFileUsingPOST1(
            data.pdfFileId,
            { responseType: 'blob' }
        )
            .then(resp => {
                this.dealDownLoadData(resp.data, this.$t("noticeManualLetterForm_mailLetter.pdf").toString());
                MessageUtil.messageInfo(this.$t("noticeManualLetterForm_mailLetter_download_success").toString());
            }).catch((err) => {
                ErrorModalUtil.modalError(this.$t("noticeManualLetterForm_mailLetter_download_failed").toString()) // 下載Word失敗
            })
    }
    //下載word檔案
    downLoadWord(data: MailByPostGrid) {
        if (!ValidationUtil.isEmpty(data.wordFileId)) {
            this.$mailByPostApi.downloadFileUsingPOST1(
                data.wordFileId,
                { responseType: 'blob' }
            )
                .then(resp => {
                    this.dealDownLoadData(resp.data, this.$t("郵寄主檔.doc").toString());
                    MessageUtil.messageInfo(this.$t("noticeManualLetterForm_mailLetterWord_download_success").toString());
                }).catch((err) => {
                    ErrorModalUtil.modalError(this.$t("fileUpload_downloadFail").toString()) // 下載失敗
                })
        } else {
            ErrorModalUtil.modalError(this.$t("noticeManualLetterForm_mailLetterWord_not_existed").toString()) // 該郵寄主檔無Word
        }
    }
    /**
    * 處理後端回傳的下載內容
    * @param resData 
    * @param fileName 
    */
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
            MessageUtil.messageError("noticeManualLetterForm_download_failed"); //下載失敗
        }
    }
    //郵寄主檔table spin控制

    mailByPostGridloading:boolean=false;
    //郵寄主檔table reload()
    mailByPostGridReload(caseNo: string) {
        this.mailByPostGridloading=true;
        this.$mailByPostApi.getMailByPostByCaseNoUsingPOST(caseNo)
            .then((resp: AxiosResponse<MailByPostGrid[]>) => {
                this.mailByPostGrid.data = resp.data;
                if (this.isEditWordAndCanelButtonFlag) {
                    this.mailByPostGrid.columns[0].actions = [
                        {
                            name: "edit",
                            title:this.$t("fileUpload_modify").toString(), //修改
                            button: true,
                        },
                        {
                            name: "downloadWord",
                            title: this.$t("noticeManualLetterForm_edit_word").toString(), //"編輯word"
                            button: true
                        },
                        {
                            name: "upLoadWord",
                            title: this.$t("noticeManualLetterForm_upload_file").toString(), //"上傳文件", 
                            uploadButton: true
                        },
                        {
                            name: "cancel",
                            title: this.$t("noticeManualLetterForm_mailLetterCancel").toString() ,//"取消信函",
                            button: true
                        },
                    ]
                } else {
                    this.mailByPostGrid.columns[0].actions = [
                        {
                            name: "edit",
                            title:  this.$t("fileUpload_modify").toString(), //修改
                            button: true,
                        },
                    ]
                }

            }).catch(error => {
                console.log(error);
            }).finally(()=>{this.mailByPostGridloading=false;})
    }

    mailByPostGrid: FblPDataGridHolder<MailByPostGrid> = {
        rowKey: "mailByPostId",
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
                type: FblColumnType.ACTIONCONTROL,
                title:this.$t("global_function").toString() ,//"功能",
                actions: [
                    {
                        name: "edit",
                        title:  this.$t("fileUpload_modify").toString(), //修改
                        button: true,
                    },
                    {
                        name: "downloadWord",
                        title:this.$t("noticeManualLetterForm_edit_word").toString(), //"編輯word"
                    },
                    {
                        name: "upLoadWord",
                        title: this.$t("noticeManualLetterForm_upload_file").toString(), //"上傳文件"
                    },
                    {
                        name: "cancel",
                        title:this.$t("noticeManualLetterForm_mailLetterCancel").toString() ,//"取消信函",
                        button: true
                    },
                ],
                width: this.isEditWordAndCanelButtonFlag ? CommonUtil.countColumnWidth(30) : CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "mailByPostId",//
                title: this.$t("noticeManualLetterForm_mailByPostId").toString(),//"郵寄編號
                width: CommonUtil.countColumnWidth(8),
            }, {
                type: FblColumnType.PLAIN,
                property: "mailBarcode",//
                title: this.$t("noticeManualLetterForm_mailBarCode").toString(),//"郵件條碼
                width: CommonUtil.countColumnWidth(6),
            },
            {
                type: FblColumnType.PLAIN,
                property: "casePolicy",
                title: this.$t("pedding_policyNo").toString(),//保單號碼
                width: CommonUtil.countColumnWidth(15),
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_mailbyPostDate").toString(),//郵寄日期
                property: "mailByPostDate",
                width: CommonUtil.countColumnWidth(8),
                formatter: (data: MailByPostGrid) => {
                    if (data.mailByPostDate != null) {
                        return MomentUtil.transformRocYearMonthDay(data.mailByPostDate);
                    }
                },
            },
            {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_receiver").toString(),//收件人
                property: "receiver",
                width: CommonUtil.countColumnWidth(6),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_address").toString(),//地址
                property: "address",
                width: CommonUtil.countColumnWidth(6),

            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_registerNo").toString(),//掛號號碼
                property: "registerNo",
                width: CommonUtil.countColumnWidth(6)
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_returnReason").toString(),//退回原因
                property: "returnReason",
                width: CommonUtil.countColumnWidth(6)
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_returnDate").toString(),//退回日期
                property: "returnDate",
                width: CommonUtil.countColumnWidth(6),
                formatter: (data: MailByPostGrid) => {
                    if (!ValidationUtil.isEmpty(data.returnDate)) {
                        return MomentUtil.transformRocYearMonthDay(data.returnDate);
                    }
                },
            }, {
                type: FblColumnType.ACTION,
                title: this.$t("noticeManualLetterForm_mailLetterFile").toString(),//"信函檔",
                actions: [
                    {
                        name: "downlowdPDF",
                        title:  this.$t("noticeManualLetterForm_mailLetterPdfFile").toString(),//"信函檔", 
                        filePdf: true
                    }
                ],
                width: CommonUtil.countColumnWidth(10),
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_mailLetterStatus").toString(),//信函狀態
                property: "manualLetterStatus",
                width: CommonUtil.countColumnWidth(6),
                formatter: (data: MailByPostGrid) => {
                    if (data.manualLetterStatus == "M") {
                        return this.$t("noticeManualLetterForm_manual").toString();
                    } else if (data.manualLetterStatus == "B") {
                        return this.$t("noticeManualLetterForm_batch").toString();
                    } else {
                        return this.$t("noticeManualLetterForm_abnormal").toString();
                    }
                }
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("mailNotice_search_cancelLetter").toString(),//取消信函
                property: "cancelLetter",
                width: CommonUtil.countColumnWidth(6)
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("mailNotice_grid_cancelLetterReason").toString(),//取消原因
                property: "cancelLetterReason",
                width: CommonUtil.countColumnWidth(6)
            }, {
                type: FblColumnType.PLAIN,
                title: this.$t("noticeManualLetterForm_abnormalReason").toString(),//異動時間
                property: "abnormalReason",
                width: CommonUtil.countColumnWidth(6)
            },{
                type: FblColumnType.PLAIN,
                title: "",//系統日 - 系統用不顯示
                property: "systemDate",
                hidden: true,
                width: CommonUtil.countColumnWidth(6)
            },
        ]
    }

    //==============================文件上傳相關 start=============================

    uploadingFile: FileGrid;

    uploadSuccessFlag:boolean=false;

    /**
   * 上傳前端檢核 檢查格式與檔案大小
   * @param file 
   * @returns 
   */
    beforeUpload(file: File) {
     
        const isWord = (file.type.includes("application/msword") );
        let validationFlag = true;
        //判斷檔案類型
        if (!isWord) {
            Modal.error({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                // 錯誤
                title: this.$t('global_error').toString(),
                // 檔案格式僅可上傳doc檔
                content: this.$t('noticeManualLetterForm_only_accept_word').toString(),
            });
            validationFlag=false;
            this.uploadingFile = null;
            return false;
        }

        if(validationFlag){
            this.uploadCount=0;
            this.uploadSuccessFlag = true;
            this.uploadingFile = file;
        }
        
        return false;
    }
    uploadCount:number=0;
    //驗證成功後上傳Word
    handleUploadChange(data:MailByPostGrid){
        this.uploadCount++;
        if (this.uploadSuccessFlag&&this.uploadCount==1) {
            LoadingUtil.show();
            let pdfFileId=data.pdfFileId?data.pdfFileId:"";
            let wordFileId=data.wordFileId?data.wordFileId:"";
            this.$mailByPostApi.ploadWordFileAndPdfUsingPOST(data.caseNo,pdfFileId,this.uploadingFile,data.mailByPostId,wordFileId)
                .then((resp: AxiosResponse<OutputErrorCodeDto>) => {
                    if(resp.data.returnMessage!=null&&resp.data.returnMessage!=""){
                        MessageUtil.messageWarning(resp.data.returnMessage);
                    }else{
                        MessageUtil.messageSuccess(this.$t('noticeManualLetterForm_upload_file_success').toString()); // 上傳成功
                    }
                    this.mailByPostGridReload(data.caseNo);
                }).catch((err) => {
                    console.error(err);
                    ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()+":"+err.response.data.message); // 上傳失敗
                }).finally(() => {
                    this.uploadCount=0;
                   
                    LoadingUtil.close();
                });
        }

    }

}



    //  =============================下方郵寄主檔資料 start===========================
