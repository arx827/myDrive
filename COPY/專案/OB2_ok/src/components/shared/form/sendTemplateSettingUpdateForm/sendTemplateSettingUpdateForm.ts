import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import MessageUtil from "@/assets/config/MessageUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal, TimePicker } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { SendTemplateSMSGrid,SendTemplateEmailGrid, Option, SendTemplateUpdateAndCreation, TSysSendTemplate } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import SendTemplateSettingUpdateFormValidateForm from "./model";
import ContinuePackStoreMoudle from "@/plugins/store/ContinuePackModule";
@Component
export default class SendTemplateSettingUpdateForm extends Vue {

  //電訪照會碼設定表單資料傳入 B1530
  @Prop()
  public initData: SendTemplateEmailGrid;

  @Prop() //發送對象下拉選單
  originalSendTargetOptions: Option[];

  @Prop() //是否為email範本
  parentIsEmail: boolean;

  @Prop() //發送類型
  sendMode: string;

  //實際發送對象下拉選單
  sendTargetOptions: Option[] = [];

  //限制條件
  options = ['C','R','U','D'];

  newTemplateId: string = "";

  created(): void {
    
    this.sendTargetOptions = this.originalSendTargetOptions;
    console.log('this.initData:',this.initData);
    console.log('this.sendMode:',this.sendMode);
    console.log('this.isEditing:',this.isEditing);
   
    if (this.isEditing) {
      this.sendTargetOptions = this.originalSendTargetOptions;
      this.reset();
    } else {
      this.sendTargetOptions = this.originalSendTargetOptions;
      this.getNewTemplateId();//新增的話,要自動給templateId
    }

   

  }

  getNewTemplateId(){

    this.$sendTemplateApi.getNewTemplatIdUsingPOST(
       this.sendMode
    ).then((resp: AxiosResponse<String>) => {
        this.newTemplateId = resp.data.toString();
        this.sendTemplateSettingUpdateForm = {
          sendTarget: "", //發送對象
          subject: "", //主旨
          content: "", //範本內文
          templateId: this.newTemplateId, //範本內文ID
          codeName:"",//範本名稱
        };

    }).catch(error => {
        console.log(error);
    })

    console.log('this.newTemplateId:',this.newTemplateId);


        
  }



  /**
   * 監聽initData資料變動
   * @returns 
   */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  

  get isEditing(): boolean {
    if (!ValidationUtil.isEmpty(this.initData.templateId)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 編輯，電訪照會碼設定表單
   */
  reset() {

    // 塞入電訪照會碼設定表單的欄位資料
    this.sendTemplateSettingUpdateForm = {
      sendTarget: this.initData.target, //發送對象
      subject: this.initData.subject, //主旨
      content: this.initData.content, //範本內文
      templateId: this.initData.templateId, //範本內文ID
      codeName:this.initData.codeName,//範本名稱
      // crud:this.initData.crud,//限制條件
      // crudList: this.initData.crud.split(','),//限制條件
    };

    console.log('this.sendTemplateSettingUpdateForm=====>',this.sendTemplateSettingUpdateForm);

  }



   /**
   * 送出，發送通知範本表單
   */
  submit() {
    (this.$refs.sendTemplateSettingUpdateForm as any).validate();
   
    let sendTargetValidation: boolean = !this.sendTemplateSettingUpdateFormValidateForm.sendTarget.feedback? true : false;
    let contentValidation: boolean = !this.sendTemplateSettingUpdateFormValidateForm.content.feedback? true : false;
  
    console.log('sendTargetValidation',sendTargetValidation);
    console.log('contentValidation',contentValidation);

    console.log('this.sendTemplateSettingUpdateForm:',this.sendTemplateSettingUpdateForm);

    //送出前先進行驗證
    if(sendTargetValidation && contentValidation){
      
      console.log('this.isEditing:',this.isEditing);

      if (this.isEditing) {//編輯模式
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_modified?').toString(),
          onOk: () => {
            LoadingUtil.show();
            let updateBody: SendTemplateUpdateAndCreation = {};
            updateBody.target = this.sendTemplateSettingUpdateForm.sendTarget;
            updateBody.templateId = this.initData.templateId;
            updateBody.subject = this.sendTemplateSettingUpdateForm.subject;
            updateBody.codeName = this.sendTemplateSettingUpdateForm.codeName;
            updateBody.content = this.sendTemplateSettingUpdateForm.content;


            console.log('update this.sendMode=====>',this.sendMode);

            if(this.sendMode=='S'){
              updateBody.sendMode = "SMS";
            } else if (this.sendMode=='M'){
              updateBody.sendMode = "MPLUS";
            } else {
              updateBody.sendMode = "EMAIL";
            }

            this.$sendTemplateApi.updateSendTemplateUsingPOST(updateBody)
              .then((resp: AxiosResponse<TSysSendTemplate>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                
                if(this.sendMode=='S'){
                  this.$emit("reloadSendSMSTemplate");
                } else if (this.sendMode=='M'){
                  this.$emit("reloadSendMPLUSTemplate");  
                } else {      
                  this.$emit("reloadSendEMAILTemplate"); 
                }


              }).catch(err => {
                console.log(err)
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      } else {
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_add?').toString(),//"確認新增?",
          onOk: () => {
            LoadingUtil.show();
            let createBody: SendTemplateUpdateAndCreation = {};
            
            //寫入T_SYS_SEND_TEMPLATE:
            console.log(this.sendTemplateSettingUpdateForm.sendTarget);
            createBody.target = this.sendTemplateSettingUpdateForm.sendTarget;
            createBody.templateId = this.sendTemplateSettingUpdateForm.templateId;
            createBody.subject = this.sendTemplateSettingUpdateForm.subject;
            createBody.content = this.sendTemplateSettingUpdateForm.content;

            console.log('create this.sendMode=====>',this.sendMode);

            if(this.sendMode=='S'){
              createBody.sendMode = "SMS";
            } else if (this.sendMode=='M'){
              createBody.sendMode = "MPLUS";
            } else {
              createBody.sendMode = "EMAIL";
            }
        
            //t_sys_common_code:
            createBody.codeName = this.sendTemplateSettingUpdateForm.codeName;

            this.$sendTemplateApi.insertSendTemplateUsingPOST(createBody)
              .then((resp: AxiosResponse<TSysSendTemplate>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                
                if(this.sendMode=='S'){
                  this.$emit("reloadSendSMSTemplate");
                } else if (this.sendMode=='M'){
                  this.$emit("reloadSendMPLUSTemplate");  
                } else {
                  this.$emit("reloadSendEMAILTemplate"); 
                }

              }).catch(err => {
                ErrorModalUtil.modalError(this.$t("global_addtFailure").toString());
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }


    } else {
      return;
    }
  

  }


  //宣告發送範本設定的欄位資料
  sendTemplateSettingUpdateForm = {
    sendTarget: "", //發送對象
    subject: "", //主旨
    content: "", //範本內文
    templateId: "", //範本內文ID
    codeName:"",//範本名稱
    // crud:"",//限制條件
    // crudList: [],//限制條件
  };


  // ============================驗證validate section start============================
  // 欄位驗證
  sendTemplateSettingUpdateFormRules: { [key: string]: ValidationRule[] } = {
    sendTarget: [{ validator: this.validateSendTarget, trigger: "blur" }], //發送對象
    templateId: [{ validator: this.validateTemplateId, trigger: "blur" }], //範本ID
    subject: [{ validator: this.validateSubject, trigger: "blur" }],//主旨
    content: [{ validator: this.validateContent, trigger: "blur" }],//範本內文
    codeName: [{ validator: this.validatecodeName, trigger: "blur" }],//範本名稱
  };

    //結案表單驗證物件
    sendTemplateSettingUpdateFormValidateForm:  SendTemplateSettingUpdateFormValidateForm = {
      sendTarget: { feedback: false, hoverVisible: false, msg: "" }, //發送對象
      templateId: { feedback: false, hoverVisible: false, msg: "" }, //範本ID
      subject: { feedback: false, hoverVisible: false, msg: "" }, //主旨
      content: { feedback: false, hoverVisible: false, msg: "" }, //範本內文
      codeName: { feedback: false, hoverVisible: false, msg: "" }, //範本名稱
      // crud: { feedback: false, hoverVisible: false, msg: "" }, //限制條件
    }

     // //顯示popOver的flag
    notiMajorTypeIdVisible: boolean = false;
    notiMajorSubTypeIdVisible: boolean = false;
    notiDescriptionVisible: boolean = false;
    addtionalVisible: boolean = false;
    notiBancassuranceVisible: boolean = false;


    //發送對象
    validateSendTarget(rule, value, callback){
      CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.sendTarget, false, "", false);
    
      if (ValidationUtil.isEmpty(value)) {
        CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.sendTarget, true, this.$t("infEmail_template_contactPerson_not_blank").toString(), false);
        callback(false);
      }
    }

    //範本名稱
    validatecodeName(rule, value, callback){
      CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.codeName, false, "", false);
    
      if (ValidationUtil.isEmpty(value)) {
        CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.codeName, true, this.$t("infEmail_template_codeName_not_blank").toString(), false);
        callback(false);
      }
    }

    //範本ID
    validateTemplateId(rule, value, callback){
      CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.templateId, false, "", false);
    
      if (ValidationUtil.isEmpty(value)) {
        CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.templateId, true, this.$t("infEmail_template_subject_not_blank").toString(), false);
        callback(false);
      }
    }

    //主旨
    validateSubject(rule, value, callback){
      CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.subject, false, "", false);
    
      if (ValidationUtil.isEmpty(value)) {
        CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.subject, true, this.$t("infEmail_template_subject_not_blank").toString(), false);
        callback(false);
      }
    }

    //範本內文
    validateContent(rule, value, callback){
      CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.content, false, "", false);
    
      if (ValidationUtil.isEmpty(value)) {
        CommonUtil.feildValidateWithVisible(this.sendTemplateSettingUpdateFormValidateForm.content, true, this.$t("infEmail_template_content_not_blank").toString(), false);
        callback(false);
      }
    }

    onTemplateIdChange() {
      this.validateTemplateId(null, this.sendTemplateSettingUpdateForm.content, () => { });
    }

    // onContentChange() {
    //   this.validateContent(null, this.sendTemplateSettingUpdateForm.content, () => { });
    // }

    onSendTargetChange() {
        this.validateSendTarget(null, this.sendTemplateSettingUpdateForm.sendTarget, () => { });
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







