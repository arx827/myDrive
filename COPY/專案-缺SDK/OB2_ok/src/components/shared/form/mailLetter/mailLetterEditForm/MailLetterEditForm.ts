import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import { AxiosResponse } from "axios";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { MailByPostGrid, CancelMail, MailAddressOptionDto, Option, MailByPostUpdation, MailByPost, OutputDto } from "@fubonlife/obd-api-axios-sdk";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import MailLetterEditFromValidationForm from "./model";
import moment from "moment";
@Component
export default class MailLetterCancelForm extends Vue {

    @Prop()
    initData: MailByPostGrid;
    
    @Prop()
    validatedPostDateList:Array<string>;



    //============================================================DatePicker相關 start================================================================

    // 為vue-datepicker套件所自製的formatter
    formatter = this.$twDateFormatter;
    onMailPostDateChange(date) {
        this.modifymailLetterForm.mailByPostDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));

    }

    //日期選擇器，可選擇範圍限定於系統日至系統日+2工作日
    disabledDate(value) {

        //從後端取得可選擇日期，除了這些日期外其他disabled
        let date=moment(value).format("YYYY-MM-DD");
        let dayList=this.validatedPostDateList;
        return dayList.indexOf(date)==-1
    }



    //============================================================DatePicker相關 end================================================================
    addressOptions: Option[] = [];


    created() {
        //設定收件人
        this.modifymailLetterForm.receiver = this.initData.receiver;
        //設定地址
        this.modifymailLetterForm.address = this.initData.address;
        //設定郵遞區號
        this.modifymailLetterForm.zipCode = this.initData.zipCode;
        //設定郵寄地址類型
        this.modifymailLetterForm.addressType = this.initData.addressType;
        


        this.modifymailLetterForm.mailByPostDateString = MomentUtil.transformRocYearMonthDay(this.initData.mailByPostDate);
        this.modifymailLetterForm.mailByPostDate = moment(new Date(this.initData.mailByPostDate));
        //將後端的郵寄地址object轉換成OPTION
        this.initData.addressOptions.forEach(mailOptionDto => {
            this.addressOptions.push({
                label: mailOptionDto.addressTypeDescription,
                value: mailOptionDto.addressType
            })
        })
    }
    //當收費地址改變時，根據其郵寄地址類型帶入郵遞區號和地址
    onAddressChange() {


    }
    /**
     * 
     * 送出修改郵寄
     */
    submit() {

        //驗證資訊
        (this.$refs.mailLetterEditForm as any).validate();


        let zipCodeValidation: boolean = !this.mailLetterEditValidationForm.zipCode.feedback ? true : false;
        let receiverValidation: boolean = !this.mailLetterEditValidationForm.receiver.feedback ? true : false;
        let addressValidation: boolean = !this.mailLetterEditValidationForm.address.feedback ? true : false;
        let addressTypeValidation: boolean = !this.mailLetterEditValidationForm.addressType.feedback ? true : false;

        if (receiverValidation && zipCodeValidation && addressValidation && addressTypeValidation) {
            let updateBody: MailByPostUpdation = {};

            Modal.confirm({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                title: this.$t('global_confirm').toString(),//"確認"
                content: this.$t('global_confirm_modified?').toString(),//"確認修改?
                onOk: () => {
                    updateBody.mailByPostDate = MomentUtil.transformRocYearMonthDay(this.modifymailLetterForm.mailByPostDateString);
                    updateBody.mailByPostId = this.initData.mailByPostId;
                    updateBody.addressType = this.modifymailLetterForm.addressType;
                    updateBody.receiver = this.modifymailLetterForm.receiver;
                    updateBody.zipCode = this.modifymailLetterForm.zipCode;
                    updateBody.address = this.modifymailLetterForm.address;
                    updateBody.pdfFileId=this.initData.pdfFileId;
                    updateBody.wordFileId=this.initData.wordFileId;
                

                    this.$mailByPostApi.updateMailByPostUsingPOST(updateBody)
                        .then((resp: AxiosResponse<OutputDto>) => {
                            if (resp.data.returnMessage != null && resp.data.returnMessage != "") {
                                MessageUtil.messageWarning(resp.data.returnMessage);
                            } else {
                                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                            }
                            this.$emit("reloadMailByPostGrid", this.initData.caseNo);

                        }).catch((error) => { 
                            console.log(error);
                        
                        })

                }
            });
        } else {
            return
        }



    }

    //郵寄修改資訊表單
    modifymailLetterForm = {
        mailByPostDate: null,//郵寄日期型態為moment的date
        mailByPostDateString: "",//郵寄日期字串
        receiver: "",//收件人
        zipCode: "",//郵遞區號
        address: "",//郵寄地址
        addressType: "",//郵寄地址type
        pdfFileId:"",
        wordFileId:""
    }


    // ============================驗證validate section start============================

    // 欄位驗證
    mailLetterEditFormRules: { [key: string]: ValidationRule[] } = {
        mailByPostDate: [{ validator: this.validateMailByPostDate, trigger: "blur" }],//郵寄日期
        receiver: [{ validator: this.validateReceiver, trigger: "blur" }],//收件人
        zipCode: [{ validator: this.validateZipCode, trigger: "blur" }],//郵遞區號
        address: [{ validator: this.validateAddress, trigger: "blur" }],//郵寄地址
        addressType: [{ validator: this.validateAddressType, trigger: "blur" }],////郵寄地址type

    };

    //修改郵寄主表表單驗證物件
    mailLetterEditValidationForm: MailLetterEditFromValidationForm = {
        mailByPostDate: { feedback: false, hoverVisible: false, msg: "" },
        receiver: { feedback: false, hoverVisible: false, msg: "" },
        zipCode: { feedback: false, hoverVisible: false, msg: "" },
        address: { feedback: false, hoverVisible: false, msg: "" },
        addressType: { feedback: false, hoverVisible: false, msg: "" },
    }

    //顯示popOver的flag
    mailByPostDateVisible: boolean = false;
    receiverVisible: boolean = false;
    zipCodeVisible: boolean = false;
    addressVisible: boolean = false;
    addressTypeVisible: boolean = false;

    //驗證收件人
    validateMailByPostDate(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, false, "", false);

        if (this.modifymailLetterForm.mailByPostDate.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.mailByPostDate, true, this.$t("noticeManualLetterForm_mailPostDate_not_blank").toString(), false);//"郵寄日期不可為空
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
    //收件人改變時候
    onSelectMailByPostDate() {
        this.validateMailByPostDate(null, this.modifymailLetterForm.mailByPostDate, () => { });
    }

    //驗證收件人
    validateReceiver(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.receiver, false, "", false);

        if (this.modifymailLetterForm.receiver.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.receiver, true, this.$t("noticeManualLetterForm_receiver_not_blank").toString(), false);//"收件人不可為空"
            callback(false);
        }
    }

    receiverMouseOver() {
        if (this.mailLetterEditValidationForm.receiver.feedback) {
            this.receiverVisible = true;
        } else {
            this.receiverVisible = false;
        }

    }
    //收件人改變時候
    onSelectReceiver() {
        this.validateReceiver(null, this.modifymailLetterForm.receiver, () => { });
    }

    //驗證郵遞區號
    validateZipCode(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, false, "", false);

        if (this.modifymailLetterForm.zipCode.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.zipCode, true, this.$t("noticeManualLetterForm_zipCode_not_blank").toString(), false);//"郵遞區號不可為空
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
        this.validateZipCode(null, this.modifymailLetterForm.zipCode, () => { });
    }

    //驗證郵寄地址
    validateAddress(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, false, "", false);

        if (this.modifymailLetterForm.address.length == 0) {
            CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.address, true, this.$t("noticeManualLetterForm_mailPostAddress_not_blank").toString(), false);//"郵寄地址不可為空
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
        this.validateAddress(null, this.modifymailLetterForm.address, () => { });
    }

    //驗證郵寄地址類型
    validateAddressType(rule, value, callback) {

        CommonUtil.feildValidateWithVisible(this.mailLetterEditValidationForm.addressType, false, "", false);

        if (this.modifymailLetterForm.addressType.length == 0) {
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
    addressTypeDisabled: boolean = true;
    //郵寄地址類型改變時候
    onSelectAddressType() {
        let mailOptionDto = this.initData.addressOptions.find(mailOptionDto => mailOptionDto.addressType == this.modifymailLetterForm.addressType);
        this.modifymailLetterForm.zipCode = mailOptionDto.zipCode;
        this.modifymailLetterForm.address = mailOptionDto.address;
        if (this.modifymailLetterForm.addressType == "O") {
            this.addressTypeDisabled = false;
        } else {
            this.addressTypeDisabled = true;
        }
        this.validateAddressType(null, this.modifymailLetterForm.addressType, () => { });
        this.validateAddress(null, this.modifymailLetterForm.address, () => { });
        this.validateZipCode(null, this.modifymailLetterForm.zipCode, () => { });
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

}