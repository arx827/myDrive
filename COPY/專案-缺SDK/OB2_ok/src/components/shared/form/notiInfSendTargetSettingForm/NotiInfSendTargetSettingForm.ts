import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { AxiosResponse } from "axios";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { StaffDto, UnitDto, Option, NotiSendTargetUpdateDto, NotiSendTargetGrid } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import infSendTargetSettingValidationForm from "./model";
@Component
export default class InfSendTargetSettingForm extends Vue {

  //電訪項目表單資料傳入(由table傳入)之後弄一個Dto
  @Prop()
  public initData: NotiSendTargetGrid;

  @Prop()// 外部傳進來的原生部門下拉選單
  originalSelectDepOptions: Option[];

  @Prop()//外部傳進來會辦項目第一層
  originalInfItemOptions: Option[];

  @Prop()//外部傳進來會辦項目第二層
  originalInfSettingOptions: Option[];

  @Prop()//外部傳進來email範本下拉選單
  originalEmailTemplateOptions: Option[];

  //狀態，下拉式表單由外部傳來
  @Prop()
  originalSelectStatusOptions: Option[];

  //狀態，實際綁定的下拉選單
  selectStatusOptions: Option[];


  // 實際表單綁定的部門下拉選單
  selectDepOptions: Option[];
  // 實際表單綁定的科別下拉選單
  selectDiviOptions: Option[] = [];
  // 實際表單綁定的電訪員下拉選單
  selectTmrOptions: Option[] = [];

  //實際表單綁定的email範本下拉選單
  selectEmailTemplateOptions: Option[] = [];

  // 實際表單綁定的會辦項目第一層下拉選單
  selectInfItemOptions: Option[] = [];

  // 實際表單綁定的會辦項目第二層下拉選單
  selectInfSettingOptions: Option[] = [];


  // 窗口人員帳號和其email的map 
  tmrIdAndEmail: Map<string, string> = new Map<string, string>();



  /**
 * 監聽initData資料變動
 * @returns 
 */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  //判斷為編輯或者新增
  get isEditing(): boolean {
    if (!ValidationUtil.isEmpty(this.initData.infSendTargetId)) {
      return true;
    } else {
      return false;
    }
  }

  async created() {
    //初始化資料
    this.reset();
  }

  /**
  * 根據新增或編輯，重置電訪項目資料表單。
  * @returns 
  */
  async reset() {
    //部門 狀態  第一層項目 email範本下拉選單
    this.selectDepOptions = this.originalSelectDepOptions;
    this.selectStatusOptions = this.originalSelectStatusOptions;
    this.selectInfItemOptions = this.originalInfItemOptions;
    this.selectEmailTemplateOptions = this.originalEmailTemplateOptions;
    if (this.isEditing) {

      // Form: 部門
      this.infSendTargetSettingForm.selectedDep = this.initData.departmentId;
      //第二層項目下拉選單
      this.selectInfSettingOptions = this.originalInfSettingOptions;

        // Form: 信件範本
      this.infSendTargetSettingForm.emailTemplateId = this.initData.emailTemplateId;

        // Form: 第一層項目
      this.infSendTargetSettingForm.selectedInfItemId = this.initData.majorSubTypeId;
      // Form: 狀態
      this.infSendTargetSettingForm.status = this.initData.status;


       // Form: 信件主旨
      this.infSendTargetSettingForm.subject = this.initData.subject;
      this.onSelectDept();
      this.infSendTargetSettingForm.selectedInfSettingId = this.initData.infSettingId;
      this.infSendTargetSettingForm.contactEmail = this.initData.contactEmail;
      this.infSendTargetSettingForm.carbonCopyEmail = this.initData.carbonCopyEmail
    }
  }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }

  // ============================submit提交section============================

  /**
   * 發送對象編輯表單提交
   * @returns 
   */
  public submit() {
    //先用表單方法進行驗證
    (this.$refs.infSendTargetSettingForm as any).validate();
    let selectedInfItemIdValidation: boolean = !this.infSendTargetSettingValidationForm.selectedInfItemId.feedback ? true : false;
    let selectedInfSettingIdValidation: boolean = !this.infSendTargetSettingValidationForm.selectedInfSettingId.feedback ? true : false;
    let selectedDepIdValidation: boolean = !this.infSendTargetSettingValidationForm.selectedDep.feedback ? true : false;
    let infTmrIdListValidation: boolean = !this.infSendTargetSettingValidationForm.tmrIdList.feedback ? true : false;
    let contactEmailValidation: boolean = !this.infSendTargetSettingValidationForm.contactEmail.feedback ? true : false;
    let tmrIdcopyListValidation: boolean = !this.infSendTargetSettingValidationForm.tmrIdcopyList.feedback ? true : false;
    let carbonCopyEmailValidation: boolean = !this.infSendTargetSettingValidationForm.carbonCopyEmail.feedback ? true : false;
    let emailTemplateValidation: boolean = !this.infSendTargetSettingValidationForm.emailTemplateId.feedback ? true : false;
    if (selectedInfItemIdValidation && selectedInfSettingIdValidation && selectedDepIdValidation && infTmrIdListValidation && contactEmailValidation && tmrIdcopyListValidation && carbonCopyEmailValidation && emailTemplateValidation) {
      if (this.isEditing) {
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          title: this.$t('global_confirm').toString(),//"確認"
          content: this.$t('global_confirm_modified?').toString(),//"確認修改?
          onOk: () => {
            LoadingUtil.show();
            let updateBody: NotiSendTargetUpdateDto = {};
            updateBody.infSendTargetId = this.initData.infSendTargetId;
            updateBody.infSettingId = this.infSendTargetSettingForm.selectedInfSettingId;
            updateBody.departmentId = this.infSendTargetSettingForm.selectedDep;
            updateBody.contactEmail = this.infSendTargetSettingForm.contactEmail;
            updateBody.carbonCopyEmail = this.infSendTargetSettingForm.carbonCopyEmail;
            updateBody.emailTemplateId = this.infSendTargetSettingForm.emailTemplateId;
            updateBody.unitId=this.infSendTargetSettingForm.selectedUnit;
            updateBody.status = this.infSendTargetSettingForm.status;

            this.$infNotifySettingApi.updateInformItemUsingPOST(updateBody)
              .then((resp: AxiosResponse<NotiSendTargetGrid>) => {
                MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
                this.$emit("reloadInfSendTargetGrid");

              }).catch((error) => {
                ErrorModalUtil.modalError(error.response.data.message);
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
          content: this.$t('global_confirm_add?').toString(),//"確認新增?
          onOk: () => {
            LoadingUtil.show();
            let createBody: NotiSendTargetUpdateDto = {};
            createBody.infSendTargetId = this.initData.infSendTargetId;
            createBody.majorSubTypeId = this.infSendTargetSettingForm.selectedInfItemId;
            createBody.infSettingId = this.infSendTargetSettingForm.selectedInfSettingId;
            createBody.departmentId = this.infSendTargetSettingForm.selectedDep;
            createBody.contactEmail = this.infSendTargetSettingForm.contactEmail;
            createBody.carbonCopyEmail = this.infSendTargetSettingForm.carbonCopyEmail;
            createBody.unitId=this.infSendTargetSettingForm.selectedUnit;
            createBody.emailTemplateId = this.infSendTargetSettingForm.emailTemplateId

            this.$infNotifySettingApi.insertSendTargetUsingPOST(createBody)
              .then((resp: AxiosResponse<NotiSendTargetGrid>) => {
                MessageUtil.messageInfo(this.$t("global_addSuccess").toString());
                this.$emit("reloadInfSendTargetGrid");

              }).catch((error) => {
                ErrorModalUtil.modalError(error.response.data.message);
              }).finally(() => {
                LoadingUtil.close();
              })
          }
        });
      }
    } else {
      return //如果驗證失敗就return
    }
  }

  // =============================第一層會辦項目和第二層項目下拉change相關

  //當會辦第一層改變時選中對應的第二層項目
  onSelectInfItem() {
    this.validateInfItemId(null, this.infSendTargetSettingForm.selectedInfItemId, () => { });
    this.selectInfSettingOptions = this.originalInfSettingOptions.filter(e => e.value.substring(1, 3) == this.infSendTargetSettingForm.selectedInfItemId && !ValidationUtil.isEmpty(e.label));

  }

  initDeptChangeFlag:boolean=true;
  // ==============================部門科別人員下拉change相關===============================
  onSelectDept() {


    //當選取部門時將窗口和副本窗口歸零

    this.selectDiviOptions = [];
    this.selectTmrOptions = [];
    if (this.infSendTargetSettingForm.selectedDep != null && this.infSendTargetSettingForm.selectedDep != "") {

      this.infSendTargetSettingForm.tmrIdList = [];
      this.infSendTargetSettingForm.selectedUnit = "";
      // 組科別 下拉，從 部門對應科別的下拉選單選項來源 篩選 該科屬於該部
      const getDiviOptions =this.$unitApi.getUnitsByUnitLevelUsingGET("04").then((resp: AxiosResponse<UnitDto[]>) => {
        resp.data.filter(e => e.superiorUnitId == this.infSendTargetSettingForm.selectedDep)
          .forEach(unit => {
            let unitName = "";
            if (unit.unitName.split(" ").length == 2) {
              unitName = unit.unitName.split(" ")[1];
            } else {
              unitName = unit.unitName.split(" ")[0];
            }
            //設定科別下拉選單
            this.selectDiviOptions.push(
              {
                label: unitName
                , value: unit.unitId
              })
          });



        

      }).catch((err) => {
        console.log(err);
      })
      let departmentList = [];
      departmentList.push(this.infSendTargetSettingForm.selectedDep);
      const getEmployeeOptions=this.$intraEmployeeApi.findIntraEmployeesByDepIdsUsingGET(departmentList)
        .then((resp: AxiosResponse<StaffDto[]>) => {
          resp.data.forEach(staff => {
            if(!ValidationUtil.isEmpty(staff.email)){
            this.selectTmrOptions.push({
              label: staff.name,
              value: staff.email
            });
            this.tmrIdAndEmail.set(staff.domainId, staff.email);
            }
          })

        }).catch((err) => {
          console.log(err);
        })

      Promise.all([getDiviOptions,getEmployeeOptions]).then(() => {

         // Form: 科別
         if(this.initDeptChangeFlag){
          this.infSendTargetSettingForm.selectedUnit = this.initData.unitId;
           }else{
            this.infSendTargetSettingForm.selectedUnit ="";
           }
        if (this.infSendTargetSettingForm.selectedUnit != null) {
          this.onSeletDivi();
        }
        // Form: 窗口 透過email匹配
        this.infSendTargetSettingForm.tmrIdList=this.initData.contactEmail.slice(0, -1).split(";");

        //Form: 副本窗口 透過copyContactEmail匹配
        this.infSendTargetSettingForm.tmrIdcopyList=this.initData.carbonCopyEmail.slice(0, -1).split(";");
      })
    }
  }
  /**
  * 人員名單會被限縮在所選的科別
  * 
  * @returns 
  */
  onSeletDivi() {

    this.selectTmrOptions = [];

    let divList = [];
    if (this.infSendTargetSettingForm.selectedUnit != null && this.infSendTargetSettingForm.selectedUnit != "") {
      // 組 電訪員 下拉，從 部門、科別、電訪員的下拉選單選項來源 篩選 該人員屬於 該科
      divList.push(this.infSendTargetSettingForm.selectedUnit)
      this.$intraEmployeeApi.findIntraEmployeesByDepIdsUsingGET(divList)
        .then((resp: AxiosResponse<StaffDto[]>) => {
          resp.data.forEach(staff => {
            if(!ValidationUtil.isEmpty(staff.email)){
            this.selectTmrOptions.push({
              label: staff.name,
              value: staff.email
            });
            this.tmrIdAndEmail.set(staff.domainId, staff.email);
            }
          })

        }).catch((err) => {
          console.log(err);
        })
    }

  }

  //發送對象表單(通知類)
  infSendTargetSettingForm = {
    selectedInfItemId: "",//選擇的會辦第一層項目
    selectedInfSettingId: "",//選擇的會辦第二層項目
    selectedDep: "",//選擇的會辦部門
    selectedUnit: "",//科別
    tmrIdList: [],//窗口
    contactEmail: "",//窗口email
    tmrIdcopyList: [],//窗口副本
    carbonCopyEmail: "",//
    emailTemplateId: "",//選擇的email範本
    status: "",//狀態
    subject: ""
  }

  // ============================驗證validate section start============================
  // 欄位驗證
  infSendTargetSettingFormRules: { [key: string]: ValidationRule[] } = {
    selectedInfItemId: [{ validator: this.validateInfItemId, trigger: "blur" }],//驗證第一層項目
    selectedInfSettingId: [{ validator: this.validateInfSettingId, trigger: "blur" }],//驗證第二層項目
    selectedDep: [{ validator: this.validateDepId, trigger: "blur" }],//驗證會辦部門
    tmrIdList: [{ validator: this.validateinfTmrIdList, trigger: "blur" }],//驗證窗口
    contactEmail: [{ validator: this.validateContactEmail, trigger: "blur" }],//驗證窗口email
    tmrIdcopyList: [{ validator: this.validateinfTmrIdCopyList, trigger: "blur" }],
    carbonCopyEmail: [{ validator: this.validateCarbonCopyEmail, trigger: "blur" }],
    emailTemplateId: [{ validator: this.validateEmailTemplate, trigger: "blur" }],//驗證email範本id
  };

  //結案表單驗證物件
  infSendTargetSettingValidationForm: infSendTargetSettingValidationForm = {
    selectedInfItemId: { feedback: false, hoverVisible: false, msg: "" },
    selectedInfSettingId: { feedback: false, hoverVisible: false, msg: "" },
    selectedDep: { feedback: false, hoverVisible: false, msg: "" },
    tmrIdList: { feedback: false, hoverVisible: false, msg: "" },
    contactEmail: { feedback: false, hoverVisible: false, msg: "" },
    tmrIdcopyList: { feedback: false, hoverVisible: false, msg: "" },
    carbonCopyEmail: { feedback: false, hoverVisible: false, msg: "" },
    emailTemplateId: { feedback: false, hoverVisible: false, msg: "" }
  }
  //顯示popOver的flag
  selectedInfItemIdVisible: boolean = false;
  selectedInfSettingIdVisible: boolean = false;
  selectedDepVisible: boolean = false;

  infTmrIdListVisible: boolean = false;
  infContactEmailVisible: boolean = false;
  infTmrICopyListVisible: boolean = false;
  infCopyEmailVisible: boolean = false;

  infEmailTemplateIdVisible: boolean = false;

  //驗證第一層項目
  validateInfItemId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedInfItemId, false, "", false);

    if (ValidationUtil.isEmpty(this.infSendTargetSettingForm.selectedInfItemId)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedInfItemId, true, this.$t("visitPersonSetting_firstLevel_is_not_blank").toString(), false);//"第一層項目不可為空"
      callback(false);
    } else {
      callback();
    }

  }

  selectedInfItemIdMouseOver() {
    if (this.infSendTargetSettingValidationForm.selectedInfItemId.feedback) {
      this.selectedInfItemIdVisible = true;
    } else {
      this.selectedInfItemIdVisible = false;
    }

  }

  onSelectedInfItemIdChange() {
    this.validateInfItemId(null, this.infSendTargetSettingForm.selectedInfItemId, () => { });
  }

  //驗證第二層項目
  validateInfSettingId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedInfSettingId, false, "", false);

    if (ValidationUtil.isEmpty(this.infSendTargetSettingForm.selectedInfSettingId)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedInfSettingId, true, this.$t("second_level_item_is_not_blank").toString(), false);//第二層項目不可為空
      callback(false);
    } else {
      callback();
    }
  }
  //第二層項目滑鼠移開時
  selectedInfSettingIdMouseOver() {
    if (this.infSendTargetSettingValidationForm.selectedInfSettingId.feedback) {
      this.selectedInfSettingIdVisible = true;
    } else {
      this.selectedInfSettingIdVisible = false;
    }
  }

  onSelectedInfSettingIdChange() {
    this.validateInfSettingId(null, this.infSendTargetSettingForm.selectedInfSettingId, () => { });
  }
  //驗證會辦部門
  validateDepId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedDep, false, "", false);

    if (ValidationUtil.isEmpty(this.infSendTargetSettingForm.selectedDep)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.selectedDep, true, this.$t("infdepartment_is_not_blank").toString(), false);
      callback(false);
    } else {
      callback();
    }
  }
  //會辦部門滑鼠移開時
  selectedDepIdMouseOver() {
    if (this.infSendTargetSettingValidationForm.selectedDep.feedback) {
      this.selectedDepVisible = true;
    } else {
      this.selectedDepVisible = false;
    }
  }

  onSelectedDepIdChange() {
    this.validateDepId(null, this.infSendTargetSettingForm.selectedDep, () => { });
  }

  //驗證窗口
  validateinfTmrIdList(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.tmrIdList, false, "", false);

    if (this.infSendTargetSettingForm.tmrIdList.length == 0) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.tmrIdList, true, this.$t("visitPersonSetting_contactPerson_is_not_blank").toString(), false);//"窗口不可為空"
      callback(false);
    }
  }

  infTmrIdListMouseOver() {
    if (this.infSendTargetSettingValidationForm.tmrIdList.feedback) {
      this.infTmrIdListVisible = true;
    } else {
      this.infTmrIdListVisible = false;
    }

  }

  onSelectTmr() {
    this.validateinfTmrIdList(null, this.infSendTargetSettingForm.tmrIdList, () => { });
    this.infSendTargetSettingForm.contactEmail = "";
    //累加email 並用;區分
    this.infSendTargetSettingForm.tmrIdList.forEach(tmrIdList => {
      this.infSendTargetSettingForm.contactEmail += tmrIdList + ";"
    }
    )
    this.validateContactEmail(null, this.infSendTargetSettingForm.contactEmail, () => { });
  }

  //驗證窗口Email內容不可以為空和驗證email格式
  validateContactEmail(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.contactEmail, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.contactEmail, true, this.$t("visitPersonSetting_contactEmail_is_not_blank").toString(), false);//窗口Email不可為空
      callback(false);
    } else {
      let continueFlag = true;
      this.infSendTargetSettingForm.contactEmail.slice(0, -1).split(";").forEach(value => {
        if (value.includes("@") && ValidationUtil.emailValidation(value) && continueFlag) {
          CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.contactEmail, false, "", false);

        } else {
          //電子郵件 格式錯誤
          CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.contactEmail, true, this.$t('userF_emailFormatError').toString(), false);
          continueFlag = false;
          callback(() => { });
        }
      })
    }
  }

  infContactEmailMouseOver() {
    if (this.infSendTargetSettingValidationForm.contactEmail.feedback) {
      this.infContactEmailVisible = true;
    } else {
      this.infContactEmailVisible = false;
    }

  }

  onContactEmailChange() {

    this.validateContactEmail(null, this.infSendTargetSettingForm.contactEmail, () => { });

  }

  //驗證窗口副本
  validateinfTmrIdCopyList(rule, value, callback) {

    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.tmrIdcopyList, false, "", false);

    if (this.infSendTargetSettingForm.tmrIdcopyList.length == 0 || this.infSendTargetSettingForm.tmrIdcopyList == null) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.tmrIdcopyList, true, this.$t("visitPersonSetting_carbonCopy_is_not_blank").toString(), false);//"窗口副本不可為空"
      callback(false);
    }
  }

  infTmrIdCopyListMouseOver() {
    if (this.infSendTargetSettingValidationForm.tmrIdcopyList.feedback) {
      this.infTmrICopyListVisible = true;
    } else {
      this.infTmrICopyListVisible = false;
    }

  }
    //副本窗口改變時
  onSelectTmrCopy() {
    this.validateinfTmrIdCopyList(null, this.infSendTargetSettingForm.tmrIdcopyList, () => { });
    this.infSendTargetSettingForm.carbonCopyEmail = "";
    //累加email 並用;區分
    this.infSendTargetSettingForm.tmrIdcopyList.forEach(tmrIdList => {
      this.infSendTargetSettingForm.carbonCopyEmail += tmrIdList + ";"
    }
    )
    this.validateCarbonCopyEmail(null, this.infSendTargetSettingForm.carbonCopyEmail, () => { });
  }



  //驗證Email副本內容不可以為空和驗證email格式
  validateCarbonCopyEmail(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.carbonCopyEmail, false, "", false);

    if (ValidationUtil.isEmpty(value)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.carbonCopyEmail, true, this.$t("visitPersonSetting_carbonCopyEmail_is_not_blank").toString(), false);//"副本Email不可為空"
      callback(false);
    } else {
      let continueFlag = true;
      this.infSendTargetSettingForm.carbonCopyEmail.slice(0, -1).split(";").forEach(value => {
        if (value.includes("@") && ValidationUtil.emailValidation(value) && continueFlag) {
          CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.carbonCopyEmail, false, "", false);

        } else {
          //電子郵件 格式錯誤
          CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.carbonCopyEmail, true, this.$t('userF_emailFormatError').toString(), false);
          continueFlag = false;
          callback(() => { });
        }
      })
    }
  }

  infCarbonCopyEmailMouseOver() {
    if (this.infSendTargetSettingValidationForm.carbonCopyEmail.feedback) {
      this.infCopyEmailVisible = true;
    } else {
      this.infCopyEmailVisible = false;
    }

  }

  onCarbonCopyEmailChange() {

    this.validateCarbonCopyEmail(null, this.infSendTargetSettingForm.carbonCopyEmail, () => { });

  }

  //驗證email範本
  validateEmailTemplate(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.emailTemplateId, false, "", false);

    if (ValidationUtil.isEmpty(this.infSendTargetSettingForm.emailTemplateId)) {
      CommonUtil.feildValidateWithVisible(this.infSendTargetSettingValidationForm.emailTemplateId, true, this.$t("visitPersonSetting_emailTemplate_not_blank").toString(), false);
      callback(false);
    } else {
      callback();
    }
  }
  //會辦部門滑鼠移開時
  selectedEmailTemplateMouseOver() {
    if (this.infSendTargetSettingValidationForm.emailTemplateId.feedback) {
      this.infEmailTemplateIdVisible = true;
    } else {
      this.infEmailTemplateIdVisible = false;
    }
  }

  onSelectedEmailTemplateChange(event) {
    this.infSendTargetSettingForm.subject =this.selectEmailTemplateOptions.find(option=>option.value==event).label;
    this.validateEmailTemplate(null, this.infSendTargetSettingForm.emailTemplateId, () => { });
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




}