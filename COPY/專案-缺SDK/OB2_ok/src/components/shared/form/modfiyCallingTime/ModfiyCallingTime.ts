import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { Modal } from "ant-design-vue";
import FeildValidation from "./model"
@Component
export default class ModfiyCallingTimeForm extends Vue {

  //被勾選的pendingCase的caseNo資料傳入(由table傳入)
  @Prop()
  public caseNumbers: Array<number>;

  // 為vue-datepicker套件所自製的formatter
  formatter = this.$twDateFormatter;

  //異動電訪項目的欄位資料
  modifyCallDateForm = {
    dueContDateChg: null,
    dueContDateChgString: "",
    dueContDateChgReason: null,
  }

  finalModifyDate = "";

  //當改應電訪日change的時候
  onModifyDateChange(date) {
    //將moment轉為要顯示的字串其pattern為民國年
    this.modifyCallDateForm.dueContDateChgString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));
    //將民國年轉化為西元年
    this.finalModifyDate = MomentUtil.transformRocYearMonthDay(this.modifyCallDateForm.dueContDateChgString);
    this.validateDueContDateChg(null, this.finalModifyDate, () => { });
  }
  //當改變原因change的時候
  onReasonChange(data) {
    this.validateDueContDateChgReason(null, this.modifyCallDateForm.dueContDateChgReason, () => { });

  }

  cleardueContDateChg() {
    this.feildValidate(this.modifyCallDateFormValidateForm.dueContDateChg, false, "success", "", "");
    this.modifyCallDateForm.dueContDateChg = null;
    this.modifyCallDateForm.dueContDateChgString = "";
    this.finalModifyDate = "";
  }
  // ============================submit提交section start ============================

  public async submit() {
    this.validateDueContDateChg(null, this.finalModifyDate, () => { });
    this.validateDueContDateChgReason(null, this.modifyCallDateForm.dueContDateChgReason, () => { });
    const dueContBooleean = this.modifyCallDateFormValidateForm.dueContDateChg.state == "success" ? true : false;
    const dueContReasonBooleean = this.modifyCallDateFormValidateForm.dueContDateChgReason.state == "success" ? true : false;

    if (dueContBooleean && dueContReasonBooleean) {
      let paramList = [];
      this.caseNumbers.forEach(e => {
        paramList.push({
          caseNo: e,
          dueContDateChg: this.finalModifyDate,
          dueContDateChgReason: this.modifyCallDateForm.dueContDateChgReason,
        })
      })

      let workDaysOver5daysBoolean = await this.$pendingPageApi.judgeWorkDaysOver5daysUsingGET(this.finalModifyDate);
      if (workDaysOver5daysBoolean.data == true) {
        Modal.info(
          {
            class: "error-modal-util-class",
            title: () => this.$t("global_information").toString(),//提示訊息
            content: () => this.$t("pending_callDate_over5days_modify_confirm").toString(),
            onOk: () => {
              Modal.confirm({
                okText: this.$t('global_ok').toString(),
                cancelText: this.$t('global_cancel').toString(),
                content: this.$t('globalmodified_confirm').toString(),
                onOk: () => {
                  this.$pendingPageApi.upDatePendingCasesCallDateUsingPOST(paramList)
                  .then(resp => {
                    
                    this.$emit("reloadData");
  
                  }).catch(err => {
                    ErrorModalUtil.modalError(this.$t("pending_callDate_modify_faied").toString());
                  })
                }
              });
             

            }
          }
        )
      } else {

        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          content: this.$t('globalmodified_confirm').toString(),
          onOk: () => {
            this.$pendingPageApi.upDatePendingCasesCallDateUsingPOST(paramList)
            .then(resp => {
              this.$emit("reloadData");

            }).catch(err => {
              ErrorModalUtil.modalError(this.$t("pending_callDate_modify_faied").toString());
            })
          }
        });
      }
    } else {
      let errorFields: string[] = [];
      if (!dueContBooleean) { errorFields.push(this.modifyCallDateFormValidateForm.dueContDateChg.content); }
      if (!dueContReasonBooleean) { errorFields.push(this.modifyCallDateFormValidateForm.dueContDateChgReason.content) }
      ErrorModalUtil.modalError(errorFields + "");

    }

  }
  // ============================submit提交section end ============================

  // ============================驗證validate section start============================
  modifyCallDateFormValidateForm = {
    dueContDateChg: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    dueContDateChgReason: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    }
  }


  /**
* 改應電訪日,不可為空白且不能小於系統日
* @param rule 驗證規則 
* @param value 改應電訪日輸入值
* @param callback 回乎函數，不帶參數表示驗證成功。
* @returns 
*/

  validateDueContDateChg(rule, dueContDateChg, callback) {
    this.modifyCallDateFormValidateForm.dueContDateChg.feedback = true;
    this.modifyCallDateFormValidateForm.dueContDateChg.hover = "";
    if (dueContDateChg == "" || dueContDateChg == null) {
      this.modifyCallDateFormValidateForm.dueContDateChg.hover = "hover";
      this.modifyCallDateFormValidateForm.dueContDateChg.state = "error";
      this.modifyCallDateFormValidateForm.dueContDateChg.content = this.$t("pending_callDate_is_not_blank").toString();//修改後應電訪日不可為空白

    } else {
      let todayDate=new Date();
      if (new Date(todayDate.getFullYear(),todayDate.getMonth(),todayDate.getDate()).getTime() <= new Date(dueContDateChg).getTime()) {
        this.modifyCallDateFormValidateForm.dueContDateChg.state = "success";
        this.modifyCallDateFormValidateForm.dueContDateChg.feedback = false;
        callback();
      } else {//驗證失敗
        this.modifyCallDateFormValidateForm.dueContDateChg.hover = "hover";
        this.modifyCallDateFormValidateForm.dueContDateChg.state = "error";
        this.modifyCallDateFormValidateForm.dueContDateChg.content = this.$t("pending_callDate_not_early_sysDate").toString();//修改後應電訪日不可小於系統日

        callback(false);
      }
    }

  }
  /**
* 改應電訪日原因不可為空白。
* @param rule 驗證規則 
* @param value textArea輸入值
* @param callback 回乎函數，不帶參數表示驗證成功。
* @returns 
*/
  validateDueContDateChgReason(rule, value, callback) {

    this.modifyCallDateFormValidateForm.dueContDateChgReason.feedback = true;
    this.modifyCallDateFormValidateForm.dueContDateChgReason.hover = "";
    if (value != null && value != "") {
      this.modifyCallDateFormValidateForm.dueContDateChgReason.state = "success";
      this.modifyCallDateFormValidateForm.dueContDateChgReason.feedback = false;
      callback();
      if (value.length > 50) {
        this.modifyCallDateFormValidateForm.dueContDateChgReason.content = this.$t("dueContDateChgReason_not_over_50_words").toString()
        this.modifyCallDateFormValidateForm.dueContDateChgReason.hover = "hover";
        this.modifyCallDateFormValidateForm.dueContDateChgReason.state = "error";
        this.modifyCallDateFormValidateForm.dueContDateChgReason.feedback = true;
        callback(false);
      }

    } else {
      this.modifyCallDateFormValidateForm.dueContDateChgReason.hover = "hover";
      this.modifyCallDateFormValidateForm.dueContDateChgReason.state = "error";
      this.modifyCallDateFormValidateForm.dueContDateChgReason.content = this.$t("pending_callDate_reason_not_blank").toString(); //修改原因不可為空
      callback(false);
    }
  }
  isDueContDateChgVisible: boolean = false;
  isDueContDateChgReasonVisible: boolean = false;
  dueContDateChgMouseOver() {
    if (this.modifyCallDateFormValidateForm.dueContDateChg.state == "error") {
      this.isDueContDateChgVisible = true;
    } else {
      this.isDueContDateChgVisible = false;
    }

  }

  dueContDateChgReasonMouseOver() {
    if (this.modifyCallDateFormValidateForm.dueContDateChgReason.state == "error") {
      this.isDueContDateChgReasonVisible = true;
    } else {
      this.isDueContDateChgReasonVisible = false;
    }

  }

  //驗證共用物件
  feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.content = msg == null ? fv.content : msg;
  }
}







