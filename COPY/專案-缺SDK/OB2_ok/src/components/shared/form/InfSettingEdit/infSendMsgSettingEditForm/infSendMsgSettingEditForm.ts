import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { Modal } from "ant-design-vue";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { StaffDto, UnitDto, Option, InfSendTargetCDto, InfSendTargetUpdateDto } from "@fubonlife/obd-api-axios-sdk";
import MessageUtil from "@/assets/config/MessageUtil";
import infSendTargetSettingValidationForm from "./model";
import { ValidationRule } from "ant-design-vue/types/form-model/form";

@Component
export default class InfSendTargetSettingForm extends Vue {

  @Prop()
  public initData: InfSendTargetCDto;

  @Prop()
  originalSelectDepOptions: Option[];

  @Prop()
  originalSelectUnitOptions: Option[];

  @Prop()
  originalSelectEmpOptions: Option[];

  @Prop()
  originalEmailTemplateOptions: Option[];

  // 部門下拉選單
  selectDepOptions: Option[] = [];

  // 科別下拉選單
  selectUnitOptions: Option[] = [];

  // 實際表單綁定的員工下拉選單
  selectEmpOptions: Option[] = [];

  // 實際表單綁定的員工下拉選單
  selectEmpCopyOptions: Option[] = [];

  // email範本下拉選單
  selectEmailTemplateOptions: Option[] = [];

  // 控制第二層科別是否可選
  isUnitDisabled: boolean = true;

  // 控制第三層人員是否可選
  isEmpDisabled: boolean = true;

  infSendTargetSettingForm = {
    infChannels: "",
    selectedDep: "",
    selectedUnit: "",
    empList: [],
    contactEmail: "",
    empCopyList: [],
    carbonCopyEmail: "",
    emailTemplateId: "",
    emailTemplateSubject: ""
  }

  // 欄位驗證
  infSendTargetSettingFormRules: { [key: string]: ValidationRule[] } = {
    empList: [{ validator: this.validateEmpList, trigger: "blur" }],
    contactEmail: [{ validator: this.validateContactEmail, trigger: "blur" }],
    empCopyList: [{ validator: this.validateEmpCopyList, trigger: "blur" }],
    carbonCopyEmail: [{ validator: this.validateCarbonCopyEmail, trigger: "blur" }],
    emailTemplateId: [{ validator: this.validateEmailTemplate, trigger: "blur" }],
  };

  /**
  * 監聽initData資料變動
  * @returns 
  */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  created() {
    this.reset();
  }

  async reset() {
    LoadingUtil.show();

    // Form: 案件通路
    this.infSendTargetSettingForm.infChannels = this.initData.infChannels;
    // Form: 部門
    this.infSendTargetSettingForm.selectedDep = this.initData.departmentId;
    // Form: 科別
    if (this.initData.unitId) {
      this.infSendTargetSettingForm.selectedUnit = this.initData.unitId;
    }
    // Form: 收件者
    this.infSendTargetSettingForm.empList = this.initData.contactEmail.slice(0, -1).split(";");
    // Form: 副本收件者
    this.infSendTargetSettingForm.empCopyList = this.initData.carbonCopyEmail.slice(0, -1).split(";");
    // Form: 收件者email字串
    this.infSendTargetSettingForm.contactEmail = this.initData.contactEmail;
    // Form: 副本收件者email字串
    this.infSendTargetSettingForm.carbonCopyEmail = this.initData.carbonCopyEmail;
    // Form: 信件範本
    this.infSendTargetSettingForm.emailTemplateId = this.initData.infEmailTemplateId;
    // Form: 信件主旨
    this.infSendTargetSettingForm.emailTemplateSubject = this.initData.infEmailTemplateSubject;

    // Selector: 部門
    this.selectDepOptions = this.originalSelectDepOptions;
    // Selector: 郵件範本
    this.selectEmailTemplateOptions = this.originalEmailTemplateOptions;
    // Selector: 科別
    const getUnitPromise = this.getUnit(this.initData.departmentId);

    let getEmpPromise;

    // Selector: 員工
    if (this.initData.unitId) {
      getEmpPromise = this.getEmp(this.initData.unitId);
    } else {
      this.getOriginEmp();
    }

    Promise.all([getUnitPromise, getEmpPromise
    ]).then(() => {
      LoadingUtil.close();
    })
  }

  // 取得科別
  getUnit(deptId: string) {
    this.selectUnitOptions = [];
    return this.$unitApi.getUnitsByUnitLevelUsingGET("04")
      .then((resp: AxiosResponse<UnitDto[]>) => {
        resp.data.filter(e => e.superiorUnitId == deptId)
          .forEach(unit => {
            let unitName = unit.unitName.split(" ").length == 2 ? unit.unitName.split(" ")[1] : unit.unitName.split(" ")[0];
            // 科別下拉選單
            this.selectUnitOptions.push(
              {
                label: unitName,
                value: unit.unitId
              })
          })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // 取得員工
  getEmp(deptId: string) {
    this.selectEmpOptions = [];
    this.selectEmpCopyOptions = [];
    return this.$intraEmployeeApi.findIntraEmployeesByDepIdsUsingGET([deptId])
      .then((resp: AxiosResponse<StaffDto[]>) => {
        resp.data.forEach(staff => {
          // 員工下拉選單
          if (!ValidationUtil.isEmpty(staff.email)) {
            this.selectEmpOptions.push({
              label: staff.name,
              value: staff.email
            });
          }
          // 員工副本下拉選單
          if (!ValidationUtil.isEmpty(staff.email)) {
            this.selectEmpCopyOptions.push({
              label: staff.name,
              value: staff.email
            });
          }
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // 若科別未選 則取得初始員工
  getOriginEmp() {
    this.selectEmpOptions = this.originalSelectEmpOptions.filter((emp) => this.infSendTargetSettingForm.empList.includes(emp.value));
    this.selectEmpCopyOptions = this.originalSelectEmpOptions.filter((emp) => this.infSendTargetSettingForm.empCopyList.includes(emp.value));
  }

  // 下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return option.componentOptions.children[0].text.indexOf(input) >= 0
  }

  // 部門下拉改變
  onSelectDept() {
    if (this.infSendTargetSettingForm.selectedDep) {
      LoadingUtil.show();
      this.infSendTargetSettingForm.selectedUnit = "";
      // 部門選定後，重新取得科別
      const getUnitPromise = this.getUnit(this.infSendTargetSettingForm.selectedDep);
      let getEmpPromise;
      // 若僅選擇部門，取得該部員工
      // 若已選定科別，取得該科員工
      if (this.infSendTargetSettingForm.selectedUnit) {
        getEmpPromise = this.getEmp(this.infSendTargetSettingForm.selectedUnit);
      } else {
        getEmpPromise = this.getEmp(this.infSendTargetSettingForm.selectedDep);
      }

      Promise.all([getUnitPromise, getEmpPromise
      ]).then(() => {
        LoadingUtil.close();
      })
    }
  }

  // 科別下拉改變
  onSelectUnit() {
    if (this.infSendTargetSettingForm.selectedUnit) {
      this.getEmp(this.infSendTargetSettingForm.selectedUnit).then(() => {
        LoadingUtil.close();
      });
    }
  }

  // 收件者下拉改變
  onSelectEmp() {
    // 檢核是否符合必填
    this.validateEmpList(null, this.infSendTargetSettingForm.empList, () => { });
    // 重新組成email字串(以分號分隔)
    this.infSendTargetSettingForm.contactEmail = "";
    this.infSendTargetSettingForm.empList.forEach(empList => {
      this.infSendTargetSettingForm.contactEmail += empList + ";"
    })
    // 檢核是否符合Email格式
    this.validateContactEmail(null, this.infSendTargetSettingForm.contactEmail, () => { });
  }

  // 副本收件者下拉改變
  onSelectEmpCopy() {
    // 檢核是否符合必填
    this.validateEmpCopyList(null, this.infSendTargetSettingForm.empCopyList, () => { });
    // 重新組成email字串(以分號分隔)
    this.infSendTargetSettingForm.carbonCopyEmail = "";
    this.infSendTargetSettingForm.empCopyList.forEach(empCopyList => {
      this.infSendTargetSettingForm.carbonCopyEmail += empCopyList + ";"
    })
    // 檢核是否符合Email格式
    this.validateCarbonCopyEmail(null, this.infSendTargetSettingForm.carbonCopyEmail, () => { });
  }

  // 收件者email字串改變
  onContactEmailChange() {
    this.validateContactEmail(null, this.infSendTargetSettingForm.contactEmail, () => { });
  }

  // 副本收件者email字串改變
  onCarbonCopyEmailChange() {
    this.validateCarbonCopyEmail(null, this.infSendTargetSettingForm.carbonCopyEmail, () => { });
  }

  // 信件範本改變
  onSelectedEmailTemplateChange(event) {
    this.infSendTargetSettingForm.emailTemplateId = event.key;
    this.infSendTargetSettingForm.emailTemplateSubject = event.label;
    this.validateEmailTemplate(null, this.infSendTargetSettingForm.emailTemplateId, () => { });
  }

  /**
   * 發送對象編輯表單提交
   * @returns 
   */
  public submit() {

    let infEmpListValidation: boolean = !this.infSendTargetSettingValidationForm.empList.feedback;
    let contactEmailValidation: boolean = !this.infSendTargetSettingValidationForm.contactEmail.feedback;
    let empcopyListValidation: boolean = !this.infSendTargetSettingValidationForm.empCopyList.feedback;
    let carbonCopyEmailValidation: boolean = !this.infSendTargetSettingValidationForm.carbonCopyEmail.feedback;
    let emailTemplateValidation: boolean = !this.infSendTargetSettingValidationForm.emailTemplateId.feedback;

    // 送出前欄位檢核
    if (infEmpListValidation && contactEmailValidation && empcopyListValidation && carbonCopyEmailValidation && emailTemplateValidation) {
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_confirm').toString(),
        content: this.$t('global_confirm_modified?').toString(),
        onOk: () => {
          LoadingUtil.show();
          let updateBody: InfSendTargetUpdateDto = {};
          updateBody.departmentId = this.infSendTargetSettingForm.selectedDep;
          updateBody.unitId = this.infSendTargetSettingForm.selectedUnit;
          updateBody.contactEmail = this.infSendTargetSettingForm.contactEmail;
          updateBody.carbonCopyEmail = this.infSendTargetSettingForm.carbonCopyEmail;
          updateBody.emailTemplateId = this.infSendTargetSettingForm.emailTemplateId;

          this.$communicatSettingApi.updateInformSendTargetCUsingPOST(this.initData.infSendTargetId, updateBody)
            .then((resp: AxiosResponse<InfSendTargetCDto>) => {
              MessageUtil.messageInfo(this.$t("fileUpload_modifySuccess").toString());
              this.$emit("reloadInfSendTargetGrid");
            })
            .catch((error) => {
              console.log(error)
            })
            .finally(() => {
              LoadingUtil.close();
            })
        }
      });
    } else {
      MessageUtil.messageInfo("更新失敗");
    }
  }

  // ---欄位驗證 Validation---

  // 表單驗證物件
  infSendTargetSettingValidationForm: infSendTargetSettingValidationForm = {
    empList: {
      hover: "",
      feedback: false,
      state: "",
      msg: "",
      hoverVisible: false
    },
    contactEmail: {
      hover: "",
      feedback: false,
      state: "",
      msg: "",
      hoverVisible: false
    },
    empCopyList: {
      hover: "",
      feedback: false,
      state: "",
      msg: "",
      hoverVisible: false
    },
    carbonCopyEmail: {
      hover: "",
      feedback: false,
      state: "",
      msg: "",
      hoverVisible: false
    },
    emailTemplateId: {
      hover: "",
      feedback: false,
      state: "",
      msg: "",
      hoverVisible: false
    }
  }

  // popOver
  infContactEmailVisible: boolean = false;
  infCopyEmailVisible: boolean = false;
  infEmailTemplateIdVisible: boolean = false;

  infContactEmailMouseOver() {
    this.infContactEmailVisible = this.infSendTargetSettingValidationForm.contactEmail.feedback ? true : false;
  }

  infCarbonCopyEmailMouseOver() {
    this.infCopyEmailVisible = this.infSendTargetSettingValidationForm.carbonCopyEmail.feedback ? true : false;
  }

  selectedEmailTemplateMouseOver() {
    this.infEmailTemplateIdVisible = this.infSendTargetSettingValidationForm.emailTemplateId.feedback ? true : false;
  }

  // 驗證共用物件
  feildValidate(fv: ValidateFormComponent, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }

  // 驗證收件者
  validateEmpList(rule, value, callback) {
    // 窗口不可為空
    if (value.length == 0) {
      this.feildValidate(this.infSendTargetSettingValidationForm.empList, true, "error", "hover", this.$t('visitPersonSetting_contactPerson_is_not_blank').toString())
      callback(() => { });
    } else {
      this.feildValidate(this.infSendTargetSettingValidationForm.empList, false, "success", "", "");
    }
  }

  // 驗證窗口Email 內容不可以為空 & email格式
  validateContactEmail(rule, value, callback) {
    // 窗口Email不可為空
    if (ValidationUtil.isEmpty(value)) {
      this.feildValidate(this.infSendTargetSettingValidationForm.contactEmail, true, "error", "hover", this.$t('visitPersonSetting_contactEmail_is_not_blank').toString());
      callback(() => { })
    } else {
      let continueFlag = true;
      this.infSendTargetSettingForm.contactEmail.slice(0, -1).split(";").forEach(value => {
        if (value.includes("@") && ValidationUtil.emailValidation(value) && continueFlag) {
          this.feildValidate(this.infSendTargetSettingValidationForm.contactEmail, false, "success", "", "");
        } else {
          //電子郵件 格式錯誤
          this.feildValidate(this.infSendTargetSettingValidationForm.contactEmail, true, "error", "hover", this.$t('userF_emailFormatError').toString());
          continueFlag = false;
          callback(() => { });
        }
      })
    }
  }

  // 驗證窗口副本
  validateEmpCopyList(rule, value, callback) {
    // 窗口副本不可為空
    if (value.length == 0) {
      this.feildValidate(this.infSendTargetSettingValidationForm.empCopyList, true, "error", "hover", this.$t('visitPersonSetting_carbonCopy_is_not_blank').toString())
      callback(() => { });
    } else {
      this.feildValidate(this.infSendTargetSettingValidationForm.empCopyList, false, "success", "", "");
    }
  }

  // 驗證Email副本內容 內容不可以為空 & email格式
  validateCarbonCopyEmail(rule, value, callback) {
    // 副本Email不可為空
    if (ValidationUtil.isEmpty(value)) {
      this.feildValidate(this.infSendTargetSettingValidationForm.carbonCopyEmail, true, "error", "hover", this.$t('visitPersonSetting_carbonCopyEmail_is_not_blank').toString());
      callback(() => { });
    } else {
      let continueFlag = true;
      this.infSendTargetSettingForm.carbonCopyEmail.slice(0, -1).split(";").forEach(value => {
        if (value.includes("@") && ValidationUtil.emailValidation(value) && continueFlag) {
          this.feildValidate(this.infSendTargetSettingValidationForm.carbonCopyEmail, false, "success", "", "");
        } else {
          //電子郵件 格式錯誤
          this.feildValidate(this.infSendTargetSettingValidationForm.carbonCopyEmail, true, "error", "hover", this.$t('userF_emailFormatError').toString());
          continueFlag = false;
          callback(() => { });
        }
      })
    }
  }

  // 驗證email範本
  validateEmailTemplate(rule, value, callback) {

    // 驗證email範本不可為空
    if (ValidationUtil.isEmpty(value)) {
      this.feildValidate(this.infSendTargetSettingValidationForm.emailTemplateId, true, "error", "hover", this.$t('visitPersonSetting_emailTemplate_not_blank').toString());
      callback(() => { });
    } else {
      this.feildValidate(this.infSendTargetSettingValidationForm.emailTemplateId, false, "success", "", "");
    }
  }

  // 共用驗證相關物件

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

}