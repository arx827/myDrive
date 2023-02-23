import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { default as validationUtil, default as ValidationUtil } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import { AgentPersonModule } from "@/plugins/store/CallUpAgentModule";
import { ContactAgentDto, ContactAgentDtoEmailContactPersonEnum, ContactAgentDtoEmailProcessEnum, ContactAgentDtoMplusContactPersonEnum, ContactAgentDtoMplusProcessEnum, ContactAgentDtoProcessEnum, EmailTemplate, GetEmailTemplateOutput, NotificationAgentDto, NotificationOtherAgentDto } from "@fubonlife/obd-api-axios-sdk";
import DatePicker from '@fubonlife/vue2-datepicker';
import { Modal, TimePicker } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EmailTemplateMap, EmailTemplateObj, NotificationCallUpAgentInfoValidateForm, SelectOption } from "./model";

@Component({
  components: { HiddenFolde, FblDataGrid, DatePicker, TimePicker }
})
export default class NotificationCallUpAgentInfo extends Vue {

  @Prop()
  public notiInfoId: string;

  @Prop()
  public caseLogId: string;

  @Prop()
  public caseNo: string;

  @Prop()
  public initData: NotificationAgentDto;

  @Prop({ default: 0 })
  public agentPickValue: number;

  @Prop()
  public initAgentData: NotificationOtherAgentDto;

  @Prop()
  public searchOtherAgentData: NotificationOtherAgentDto;

  @Prop()
  public isSendMessage: boolean;

  // 發送成功後資料還原成初始資料
  initDataTemp = {
    checkSend: '',
    visitDate: null,
    visitString: "",
    convenientContactStartTime: null,
    convenientContactEndTime: null,
    convenientContactStartString: "",
    convenientContactEndString: "",
    agentId: "",
    email: "",
    custName: "",
    custMobChang: "",
    casePolicy: "",
    policyNo: "",
    policySeq: "",
    custAppeal: "",
    emailSubject: "",
    emailContent: "",
    agent: "",
  }

  // email範本下拉
  emailTemplateOpts: SelectOption[] = [{ label: "", value: "" }];
  // email範本mapping 表
  emailTemplateMap: EmailTemplateMap = {};

  notiCallUpAgentInfoForm = {
    checkSend: '',
    visitDate: null,
    visitString: "",
    convenientContactStartTime: null,
    convenientContactEndTime: null,
    convenientContactStartString: "",
    convenientContactEndString: "",
    agentId: "",
    email: "",
    custName: "",
    custMobChang: "",
    casePolicy: "",
    policyNo: "",
    policySeq: "",
    custAppeal: "",
    emailSubject: "",
    emailContent: "",
    agent: "",
  }

  // 欄位驗證
  notiCallUpAgentInfoFormRules: { [key: string]: ValidationRule[] } = {
    email: [{ validator: this.validateEmail, trigger: "blur" }],
    custName: [{ validator: this.validateCustName, trigger: "blur" }],
    custMobChang: [{ validator: this.validateCustMobChang, trigger: "blur" }],
    casePolicy: [{ validator: this.validateCasePolicy, trigger: "blur" }],
    emailSubject: [{ validator: this.validateEmailSubject, trigger: "blur" }],
    emailContent: [{ validator: this.validateEmailContent, trigger: "blur" }],
  };

  //欄位驗證提示工具
  notiCallUpAgentInfoValidateForm: NotificationCallUpAgentInfoValidateForm = {
    checkSend: { feedback: false, hoverVisible: false, msg: "" },
    email: { feedback: false, hoverVisible: false, msg: "" },
    custName: { feedback: false, hoverVisible: false, msg: "" },
    custMobChang: { feedback: false, hoverVisible: false, msg: "" },
    casePolicy: { feedback: false, hoverVisible: false, msg: "" },
    custAppeal: { feedback: false, hoverVisible: false, msg: "" },
    emailSubject: { feedback: false, hoverVisible: false, msg: "" },
    emailContent: { feedback: false, hoverVisible: false, msg: "" },
  }

  created() {
    this.getEmailTemplate();
  }

  /**
   * @description 取得 Email範本
   */
  getEmailTemplate() {
    this.$notificationAgentApi.getNotiAgentEmailTemplateUsingGET()
      .then((resp: AxiosResponse<GetEmailTemplateOutput>) => {
        if (resp.data != null) {
          if (resp.data.success) {
            resp.data.emailTemplateList.forEach((emailTemplate: EmailTemplate) => {
              this.emailTemplateOpts.push({ label: emailTemplate.codeName, value: emailTemplate.code });
              this.emailTemplateMap[emailTemplate.code] = { codeName: emailTemplate.codeName, content: emailTemplate.content };
            });
          } else {
            ErrorModalUtil.modalError(resp.data.returnMessage);
          }
        } else {
          ErrorModalUtil.modalError(this.$t('email_getEmailTemplate_occur_error').toString()); //取得Email範本發生異常
        }
      })
      .catch((error) => {
        ErrorModalUtil.modalError(this.$t('email_getEmailTemplate_occur_error').toString()); //取得Email範本發生異常
      })
  }

  /**
     * @description 更改email範本
     */
  changeEmailTemplate(selectTemplate) {
    if (!validationUtil.isEmpty(selectTemplate)) {
      var emailTemplateObj: EmailTemplateObj = this.emailTemplateMap[selectTemplate];
      this.notiCallUpAgentInfoForm.emailContent = emailTemplateObj.content;
    } else {
      this.notiCallUpAgentInfoForm.emailContent = "";
    }

    // 重新驗證訊息內容
    this.validateEmailContent(null, this.notiCallUpAgentInfoForm.emailContent, () => { });
  }

  @Watch('isSendMessage', { deep: true })
  watchIsSendMessage(newVal: number, oldVal: number) {
    if (!validationUtil.isEmpty(newVal)) {
      if (this.isSendMessage) {
        this.notiCallUpAgentInfoForm.checkSend = 'Y';
        AgentPersonModule.setShouldSendIsSend(false);
      } else {
        this.notiCallUpAgentInfoForm.checkSend = 'N';
        AgentPersonModule.setShouldSendIsSend(true);
      }
    }
  }

  @Watch('searchOtherAgentData', { deep: true })
  watchSearchOtherAgent(newVal, oldVal) {
    if (!validationUtil.isEmpty(newVal)) {
      if (this.agentPickValue == 0) {
        this.notiCallUpAgentInfoForm = {
          checkSend: 'N',
          visitDate: this.initData.visitStartDate,
          visitString: "",
          convenientContactStartTime: null,
          convenientContactEndTime: null,
          convenientContactStartString: "",
          convenientContactEndString: "",
          agentId: '',
          email: '',
          custName: this.initData.custName,
          custMobChang: this.initData.mobChang,
          casePolicy: this.initData.casePolicy,
          policyNo: this.initData.policyNo,
          policySeq: this.initData.policySeq,
          custAppeal: "",
          emailSubject: this.$t('notificationCallUpAgentInfo_custInform').toString(), // 客戶關懷部電訪訊息通知
          emailContent: "",
          agent: "",
        };
        this.notiCallUpAgentInfoForm.agentId = this.searchOtherAgentData.agentId;
        this.notiCallUpAgentInfoForm.email = this.searchOtherAgentData.agentEmail;
        this.notiCallUpAgentInfoForm.agent = this.searchOtherAgentData.agent;
        AgentPersonModule.setShouldSendIsSend(true);
      }
    }
  }

  @Watch('initAgentData', { deep: true })
  watchAgentPick(newVal: number, oldVal: number) {
    if (!validationUtil.isEmpty(newVal)) {
      this.notiCallUpAgentInfoForm = {
        checkSend: 'N',
        visitDate: this.initData.visitStartDate,
        visitString: "",
        convenientContactStartTime: null,
        convenientContactEndTime: null,
        convenientContactStartString: "",
        convenientContactEndString: "",
        agentId: '',
        email: '',
        custName: this.initData.custName,
        custMobChang: this.initData.mobChang,
        casePolicy: this.initData.casePolicy,
        policyNo: this.initData.policyNo,
        policySeq: this.initData.policySeq,
        custAppeal: "",
        emailSubject: this.$t('notificationCallUpAgentInfo_custInform').toString(), // 客戶關懷部電訪訊息通知
        emailContent: "",
        agent: "",
      };
      this.notiCallUpAgentInfoForm.agentId = this.initAgentData[0].agentId;
      this.notiCallUpAgentInfoForm.email = this.initAgentData[0].agentEmail;
      this.notiCallUpAgentInfoForm.agent = this.initAgentData[0].agent;
      AgentPersonModule.setShouldSendIsSend(true);
      this.clearForm();
    }
  }

  @Watch('initData', { immediate: true, deep: true })
  watchInitData(newVal: NotificationAgentDto, oldVal: NotificationAgentDto) {
    if (!validationUtil.isEmpty(newVal)) {
      let agentId = "";
      let agentEmail = "";
      let agent = ""
      let agentData = this.initAgentData[0];
      let agent1 = this.initData.agent1
      if (agentData) {
        agentId = agentData.agentId;
        agentEmail = agentData.agentEmail;
        agent = agentData.agent;
      } else if (agent1) {
        agent = agent1;
      }
      this.notiCallUpAgentInfoForm = {
        checkSend: 'N',
        visitDate: this.initData.visitStartDate,
        visitString: "",
        convenientContactStartTime: null,
        convenientContactEndTime: null,
        convenientContactStartString: "",
        convenientContactEndString: "",
        agentId: agentId,
        email: agentEmail,
        custName: this.initData.custName,
        custMobChang: this.initData.mobChang,
        casePolicy: this.initData.casePolicy,
        policyNo: this.initData.policyNo,
        policySeq: this.initData.policySeq,
        custAppeal: "",
        emailSubject: this.$t('notificationCallUpAgentInfo_custInform').toString(), // 客戶關懷部電訪訊息通知
        emailContent: "",
        agent: agent,
      };
      this.initDataTemp = JSON.parse(JSON.stringify(this.notiCallUpAgentInfoForm));
    }
  }

  @Watch('notiCallUpAgentInfoForm', { deep: true })
  watchInfoFormData(newVal, oldVal) {
    if (newVal) {
      this.$emit("contactAgentData", this.notiCallUpAgentInfoForm);
    }
  }

  // 訊息發送 check事件
  onChenkSendMessage(e) {
    if (e.target.value == 'Y') {
      this.notiCallUpAgentInfoForm.checkSend = 'Y';
      AgentPersonModule.setShouldSendIsSend(false);
      this.$emit("isSendMessage", true);
    } else {
      this.notiCallUpAgentInfoForm.checkSend = 'N';
      AgentPersonModule.setShouldSendIsSend(true);
      this.$emit("isSendMessage", false);
    }
  }

  /**
     * @description 下拉式清單搜尋用(依input過濾顯示符合的清單)
     */
  filterOption(input, option) {

    if (!validationUtil.isEmpty(option.componentOptions.children[0]) && !validationUtil.isEmpty(option.componentOptions.propsData.value)) {
      return (
        option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.toUpperCase().indexOf(input.toUpperCase()) >= 0
      );
    }

  }

  // 表單送出前驗證
  validateSubmit() {
    let validate = true;

    if (this.notiCallUpAgentInfoForm.checkSend == 'Y') {

      // email
      this.validateEmail(null, this.notiCallUpAgentInfoForm.email, () => {
        if (this.notiCallUpAgentInfoValidateForm.email.feedback) {
          validate = false;
        }
      });

      // 保戶姓名
      this.validateCustName(null, this.notiCallUpAgentInfoForm.custName, () => {
        if (this.notiCallUpAgentInfoValidateForm.custName.feedback) {
          validate = false;
        }
      });

      // 保戶電話
      this.validateCustMobChang(null, this.notiCallUpAgentInfoForm.custMobChang, () => {
        if (this.notiCallUpAgentInfoValidateForm.custMobChang.feedback) {
          validate = false;
        }
      });

      // 保單號碼
      this.validateCasePolicy(null, this.notiCallUpAgentInfoForm.casePolicy, () => {
        if (this.notiCallUpAgentInfoValidateForm.casePolicy.feedback) {
          validate = false;
        }
      });

      // Email主旨
      this.validateEmailSubject(null, this.notiCallUpAgentInfoForm.emailSubject, () => {
        if (this.notiCallUpAgentInfoValidateForm.emailSubject.feedback) {
          validate = false;
        }
      });

      // 訊息內容
      this.validateEmailContent(null, this.notiCallUpAgentInfoForm.emailContent, () => {
        if (this.notiCallUpAgentInfoValidateForm.emailContent.feedback) {
          validate = false;
        }
      });

      return validate;

    }


  }

  // 電子郵件驗證
  validateEmail(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.email, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      if (!validationUtil.emailValidation(value)) {
        // 電子郵件格式錯誤
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.email, true, this.$t('userF_emailFormatError').toString(), false);
        callback(() => { });
      } else {
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.email, false, "", false);
      }
    } else {
      // 電子郵件 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.email, true, this.$t('userF_emailFormatRequired').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // 保戶姓名驗證
  validateCustName(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custName, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custName, false, "", false);
    } else {
      // 保戶姓名 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custName, true, this.$t('notificationCallUpAgentInfo_custNameRequired').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // 保戶電話驗證
  validateCustMobChang(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custMobChang, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      if (validationUtil.isAnyChinese(value)) {
        // 保戶電話 不可輸入中文
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custMobChang, true, this.$t('notificationCallUpAgentInfo_custMobChangNumbersInputOnly').toString(), false);
        callback(() => { });
      } else {
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custMobChang, false, "", false);
      }
    } else {
      // 保戶電話 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custMobChang, true, this.$t('notificationCallUpAgentInfo_custMobChangRequired').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // 保單號碼驗證
  validateCasePolicy(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.casePolicy, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      if (validationUtil.isAnyChinese(value)) {
        //保單號碼 不可輸入中文
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.casePolicy, true, this.$t('pedding_policyNo_noChinese').toString(), false);
        callback(() => { });
      } else {
        CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.casePolicy, false, "", false);
      }
    } else {
      // 保單號碼 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.casePolicy, true, this.$t('notificationCallUpAgentInfo_casePolicyRequired').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // Email主旨驗證
  validateEmailSubject(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailSubject, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailSubject, false, "", false);
    } else {
      // Email主旨 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailSubject, true, this.$t('email_subject_validate_required').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // 訊息內容驗證
  validateEmailContent(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailContent, false, "", false);
    if (!validationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailContent, false, "", false);
    } else {
      // 訊息內容 必填
      CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailContent, true, this.$t('notificationCallUpAgentInfo_emailContentRequired').toString(), false);
      callback(() => { });
    }
    callback();
  }

  // 清除表單狀態(hover,feedback)
  clearForm() {
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.email, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custName, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.custMobChang, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.casePolicy, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailSubject, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCallUpAgentInfoValidateForm.emailContent, false, "", false);
  }

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

  // 發送訊息給業務員
  sendInfoToAgent() {
    // 發送訊息
    if (!this.isSendMessage) {
      ErrorModalUtil.modalError(this.$t('notificationCallUpAgentInfo_checkSendMesgFirst').toString()); // 若要發送 請先選擇訊息發送
    } else {
      if (this.validateSubmit()) {
        Modal.confirm({
          okText: this.$t('global_ok').toString(), // 確定
          cancelText: this.$t('global_cancel').toString(), // 取消
          title: this.$t('notificationBasic_sendContactAgentData').toString(), // 送出聯繫業務員資料
          content: this.$t('notificationBasic_confirmDataCorrectToSave').toString(), // 確認資料正確儲存?
          onOk: () => {
            this.onFormSubmit();
          }
        });

      } else {
        console.log('聯絡業務員送出失敗');
      }
    }
  }

  /**
   * 聯絡業務員
   */
  onFormSubmit() {
    LoadingUtil.show();
    console.log('儲存聯絡業務員前的資料', this.notiCallUpAgentInfoForm);

    // 取得案件歷程代碼
    let caseLogId = ValidationUtil.isEmpty(this.caseLogId) ? CommonUtil.getCaseLogId(this.caseNo) : this.caseLogId;

    // 儲存聯絡業務員資料
    let email = this.notiCallUpAgentInfoForm.email;
    let agent = this.notiCallUpAgentInfoForm.agent;
    let contactAgentData: ContactAgentDto = {
      caseLogId: caseLogId,
      caseNo: this.caseNo,
      casePolicy: this.notiCallUpAgentInfoForm.casePolicy,
      codingNo: "",
      content: this.notiCallUpAgentInfoForm.emailContent,
      custName: this.notiCallUpAgentInfoForm.custName,
      custPhone: this.notiCallUpAgentInfoForm.custMobChang,
      emailContactPerson: ContactAgentDtoEmailContactPersonEnum.SALES,
      emailProcess: ContactAgentDtoEmailProcessEnum.A,
      mplusContactPerson: ContactAgentDtoMplusContactPersonEnum.SALES,
      mplusProcess: ContactAgentDtoMplusProcessEnum.A,
      packNo: this.initData.packNo,
      policyNo: this.notiCallUpAgentInfoForm.policyNo,
      policySeq: parseInt(this.notiCallUpAgentInfoForm.policySeq, 10),
      process: ContactAgentDtoProcessEnum.N,
      subject: this.notiCallUpAgentInfoForm.emailSubject,
      // visitEndDate: this.initData.visitStartDate,
      // visitStartDate: this.initData.visitEndDate,
      notiInFoId: this.notiInfoId,
      agentId: this.notiCallUpAgentInfoForm.agentId,
      email: this.notiCallUpAgentInfoForm.email,
    }

    this.$notificationAgentApi.contactAgentUsingPOST(contactAgentData)
      .then((resp) => {
        if (resp.data.success) {
          this.$emit("closeForm", false);
          // 發送完畢後聯絡資料復原
          this.notiCallUpAgentInfoForm = JSON.parse(JSON.stringify(this.initDataTemp));
          this.notiCallUpAgentInfoForm.email = email;
          this.notiCallUpAgentInfoForm.agent = agent;
          AgentPersonModule.setShouldSendIsSend(true);
          Modal.success({
            title: this.$t('textMessage_sendTextMsg_success').toString(), // 發送成功!
            content: resp.data.returnMessage, // 提示哪個尚未發送成功的訊息
            okText: this.$t('global_ok').toString(), // 確定
            centered: false
          });
        } else {
          ErrorModalUtil.modalError(resp.data.returnMessage);
        }
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        LoadingUtil.close();
      });
  }
}