import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import { UserDtoStaffTypeEnum, UserDto, IntraEmployeeDto, UserUpdateDto, UserUpdateDtoStaffTypeEnum, UserUpdateDtoStatusEnum, UnitDto, UserStaffTypeEnum } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import { AxiosResponse } from "axios";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { UserValidateForm, Option } from "./model";
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import CommonUtil from "@/assets/config/CommonUtil";
import { Modal } from "ant-design-vue";
import { LoginModule } from "@/plugins/store/LoginModule";
@Component
export default class UserForm extends Vue {

  isEditMyself: boolean = false;

  isFilled: boolean = false;

  // 為vue-datepicker套件所自製的formatter
  formatter = this.$twDateFormatter;

  isInIntra = false;

  // 使用者列表單筆使用者資料點擊傳入
  @Prop()
  public initData: UserDto;

  // @Prop()
  // public unitFormOption: Option;

  // 載入畫面
  @Prop()
  public loading: boolean;

  // 判斷是否為編輯或新增
  idEditing: boolean = true;

  // 單位驗證後的值
  userChangeFormUnit: UnitDto = {
    isCurrentUnit: "",
    superiorUnitId: "",
    supervisorEmpId: "",
    supervisorIdNo: "",
    unitCreateDate: "",
    unitId: "",
    unitLevel: "",
    unitName: "",
    unitRevokeDate: "",
    updateDate: "",
    updateId: ""
  };

  // 使用者欄位資料
  userChangeForm: UserUpdateDto = {
    email: "",
    extensionNo: "",
    idNo: "",
    leavedDate: "",
    name: "",
    staffNo: "",
    staffType: null,
    status: null,
    supervisorId: "",
    unitId: "",
    unit: this.userChangeFormUnit,
    userId: "",
    aetnaDate: null,
  };

  userChangeFormDivisionPromt: string = "";
  userChangeFormDepartmentPromt: string = "";

  // 將後端傳過來的字串在編輯時能以Date資料型態被datepicker編輯
  leavedDate: Date = null;

  userValidateForm: UserValidateForm = {
    account: { feedback: false, hoverVisible: false },
    name: { feedback: false, hoverVisible: false },
    idNo: { feedback: false, hoverVisible: false },
    email: { feedback: false, hoverVisible: false },
    extensionNo: { feedback: false, hoverVisible: false },
    staffNo: { feedback: false, hoverVisible: false },
    unitId: { feedback: false, hoverVisible: false },
    unit: { feedback: false, hoverVisible: false },
  };

  // From 欄位驗證規則(新增/編輯)
  userFormRules: { [key: string]: ValidationRule[] } = {
    name: [{ validator: this.validateName, trigger: "blur" }],
    userId: [{ validator: this.validateAccount, trigger: "blur" }],
    idNo: [{ validator: this.validateIdNo, trigger: "blur" }],
    email: [{ validator: this.validateEmail, trigger: "blur" }],
    extensionNo: [{ validator: this.validateExtensionNo, trigger: "blur" }],
    unitId: [{ validator: this.validateUnitId, trigger: "blur" }],
  };
  selectStaffTypeOptions = [
    {
      label: this.$t('global_fullTimeJob').toString(),
      value: UserDtoStaffTypeEnum.F
    },
    {
      label: this.$t('userMP_othersJobType').toString(),
      value: UserDtoStaffTypeEnum.P
    },
    // {
    //   label: this.$t('global_prohibit').toString()+this.$t('global_login').toString()+this.$t('global_system').toString(),
    //   value: UserDtoStaffTypeEnum.N
    // }
  ];
  selectStatusOptions = [
    {
      label: this.$t('global_effective').toString(),
      value: UserUpdateDtoStatusEnum.Y
    },
    {
      label: this.$t('global_deactivate').toString(),
      value: UserUpdateDtoStatusEnum.N
    }
  ];

  // 科別搜尋下拉式選單資料來源
  selectDeptOptions = [{ label: this.$t('global_select').toString(), value: '' }];

  get isEditing(): boolean {
    return this.initData.userId.length !== 0;
  }

  /**
   * 頁面開啟
   * @returns 
   */
  created(): void {
    this.reset();
  }

  /**
   * 監聽initData資料變動
   * @returns 
   */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  /**
   * 根據新增或編輯，重置使用者資料表單。
   * @returns 
   */
  reset() {
    this.clearFormStatus();
    if (this.initData.userId.length !== 0) {
      // 編輯 
      this.idEditing = true;
      this.userValidateForm.account.state = "";
      this.userValidateForm.name.state = "";
      this.userValidateForm.account.hover = "";
      this.userValidateForm.name.hover = "";
      this.userChangeForm = JSON.parse(JSON.stringify(this.initData));
      this.userChangeFormUnit = this.userChangeForm.unit;
      this.promptUnitInfo(this.userChangeFormUnit);
      if (null != this.userChangeForm.leavedDate) {
        this.userChangeForm.leavedDate = moment(String(this.userChangeForm.leavedDate)).format('YYYY/MM/DD');
        this.defaultLeavedDate = MomentUtil.transformRocYearMonthDay(this.userChangeForm.leavedDate);
      } else {
        this.defaultLeavedDate = null;
      }

      if (null != this.userChangeForm.aetnaDate) {
        this.userChangeForm.aetnaDate = moment(String(this.userChangeForm.aetnaDate)).format('YYYY/MM/DD');
        this.defaultAetnaDate = MomentUtil.transformRocYearMonthDay(this.userChangeForm.aetnaDate);
      } else {
        this.defaultAetnaDate = null;
      }

      this.leavedDate = this.userChangeForm.leavedDate ?
        new Date(this.userChangeForm.leavedDate) : null;

      // 使用者不能編輯自己的單位
      this.isEditMyself = this.userChangeForm.userId.toUpperCase() == LoginModule.loginState.me.id.toUpperCase();
    } else {
      // 新增
      this.userChangeFormUnit = {
        isCurrentUnit: "",
        superiorUnitId: "",
        supervisorEmpId: "",
        supervisorIdNo: "",
        unitCreateDate: "",
        unitId: "",
        unitLevel: "",
        unitName: "",
        unitRevokeDate: "",
        updateDate: "",
        updateId: ""
      };
      this.promptUnitInfo(this.userChangeFormUnit);
      this.userChangeForm = {
        email: "",
        extensionNo: "",
        idNo: "",
        leavedDate: "",
        name: "",
        staffNo: "",
        staffType: UserUpdateDtoStaffTypeEnum.F,
        status: UserUpdateDtoStatusEnum.Y,
        supervisorId: "",
        unitId: "",
        unit: this.userChangeFormUnit,
        userId: "",
        aetnaDate: null,
      };
      this.idEditing = false;
      this.leavedDate = null;
      this.defaultAetnaDate = null;
      this.defaultLeavedDate = null;
    }
  }

  /**
   * 使用者新增或編輯，帳號驗證。使用者帳號僅可輸入英數字。
   * @param rule 驗證規則 
   * @param value 使用者帳號輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  async validateAccount(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.substring(0, 10);  // DB長度限制
    }
    this.userChangeForm.userId = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.account, false, "", false);
    if (value) {
      if (validationUtil.accountValidation(value)) {
        await this.$userApi.getUserUsingGET(value).then((resp: AxiosResponse<UserDto>) => {
          if (!resp.data) {
            CommonUtil.feildValidateWithVisible(this.userValidateForm.account, false, "", false);
            callback();
          } else {
            // 使用者帳號重複
            CommonUtil.feildValidateWithVisible(this.userValidateForm.account, true, this.$t('userF_duplicateUserAccount').toString(), false);
            callback(() => { });
          }
        }).catch(() => {
          CommonUtil.feildValidateWithVisible(this.userValidateForm.account, false, "", false);
          callback();
        });
      } else {
        //僅可輸入英數字(使用者帳號僅可輸入英數字)
        CommonUtil.feildValidateWithVisible(this.userValidateForm.account, true, this.$t('userMP_userAccountAlphanumericInputOnly').toString(), false);
        callback(() => { });
      }
    } else {
      //必填(使用者帳號必填)
      CommonUtil.feildValidateWithVisible(this.userValidateForm.account, true, this.$t('userF_userAccountRequired').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 使用者新增或編輯，身分證字號驗證。使用者身分證字號僅可輸入英數字。
   * @param rule 驗證規則 
   * @param value 使用者身分證字號輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateIdNo(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.substring(0, 10);  // DB長度限制
    }
    this.userChangeForm.idNo = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, true, "", false);
    if (value) {
      if (validationUtil.idNoValidation(value)) {
        if (validationUtil.idNoNativeValidation(value)) {
          CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, false, "", false);
          callback();
        } else {
          CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, true, "身份證字號格式錯誤", false);
          callback(() => { });
        }
      } else {
        //僅可輸入英數字
        CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, true, this.$t('global_idNumber').toString() + this.$t('global_alphanumericInputOnly').toString(), false);
        callback(() => { });
      }
    } else {
      //必填
      CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, true, this.$t('global_idNumber').toString() + this.$t('global_required').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 使用者新增或編輯，使用者姓名驗證。使用者姓名不可輸入符號。
   * @param rule 驗證規則 
   * @param value 使用者姓名輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateName(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.substring(0, 100);  // DB長度限制
    }
    this.userChangeForm.name = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.name, true, "", false);
    if (value) {
      if (validationUtil.nameValidation(value)) {
        CommonUtil.feildValidateWithVisible(this.userValidateForm.name, false, "", false);
        callback();
      } else {
        //不可輸入符號(使用者姓名不可輸入符號)
        CommonUtil.feildValidateWithVisible(this.userValidateForm.name, true, this.$t('userMP_userHumanNameNoSymbols').toString(), false);
        callback(() => { });
      }
    } else {
      //必填
      CommonUtil.feildValidateWithVisible(this.userValidateForm.name, true, this.$t('userF_userHumanNameRequired').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 使用者新增或編輯，使用者電子郵件驗證。使用者電子郵件格式驗證。
   * @param rule 驗證規則 
   * @param value 使用者電子郵件輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateEmail(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.substring(0, 80);  // DB長度限制
    }
    this.userChangeForm.email = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.email, true, "", false);
    if (!validationUtil.isEmpty(value)) {
      if (value.includes("@") && validationUtil.emailValidation(value)) {
        CommonUtil.feildValidateWithVisible(this.userValidateForm.email, false, "", false);
        callback();
      } else {
        //電子郵件 格式錯誤
        CommonUtil.feildValidateWithVisible(this.userValidateForm.email, true, this.$t('userF_emailFormatError').toString(), false);
        callback(() => { });
      }
    } else {
      //電子郵件 必填
      CommonUtil.feildValidateWithVisible(this.userValidateForm.email, true, this.$t('userF_emailFormatRequired').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 使用者新增或編輯，使用者分機號碼驗證。使用者分機號碼僅可輸入數字。
   * @param rule 驗證規則 
   * @param value 使用者分機號碼輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateExtensionNo(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.substring(0, 10);  // DB長度限制
    }
    this.userChangeForm.extensionNo = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.extensionNo, true, "", false);
    if (value) {
      if (validationUtil.extensionNoValidation(value)) {
        CommonUtil.feildValidateWithVisible(this.userValidateForm.extensionNo, false, "", false);
        callback();
      } else {
        //分機號碼 僅可輸入數字
        CommonUtil.feildValidateWithVisible(this.userValidateForm.extensionNo, true, this.$t('userMP_extensionNumberOnlyInputNumbers').toString(), false);
        callback(() => { });
      }
    } else {
      //分機號碼 必填
      CommonUtil.feildValidateWithVisible(this.userValidateForm.extensionNo, true, this.$t('userF_extensionNumberRequired').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 使用者新增或編輯，使用者單位代碼驗證。使用者單位代碼需存在。
   * @param rule 驗證規則 
   * @param value 使用者單位代碼輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  async validateUnitId(rule, value: string, callback) {
    if (!validationUtil.isEmpty(value)) {
      value = value.trim();
      value = value.toUpperCase();
      value = value.substring(0, 10);  // DB長度限制
    }
    this.userChangeForm.unitId = value;
    CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, false, "", false);
    if (value) {
      if (validationUtil.unitValidation(value)) {
        await this.$unitApi.getUnitByUnitIdUsingGET(value).then((res: AxiosResponse<UnitDto>) => {
          if (!validationUtil.isEmpty(res.data)) {
            this.userChangeFormUnit = res.data;
            this.userChangeForm.unit = this.userChangeFormUnit;
            this.promptUnitInfo(this.userChangeFormUnit);
          } else {
            this.userChangeForm.unit.unitName = this.$t('userForm_noCorrespondingUnit').toString();
            //單位代碼不存在
            CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, true, this.$t('userMP_unitIdNotExisted').toString(), false);
            callback(() => { });
          }
        }).catch(() => {
          this.userChangeForm.unit.unitName = this.$t('userForm_noCorrespondingUnit').toString();
          //單位代碼不存在
          CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, true, this.$t('userMP_unitIdNotExisted').toString(), false);
          callback(() => { });
        }).then(() => {
          if (this.userChangeForm.unit.unitName && this.userChangeForm.unit.unitName != this.$t('userForm_noCorrespondingUnit').toString()) {
            CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, false, "", false);
            callback();
          } else {
            //單位代碼不存在
            CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, true, this.$t('userMP_unitIdNotExisted').toString(), false);
            callback(() => { });
          }
        })
      } else {
        //單位代碼 僅可輸入英數字
        CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, true, this.$t('userF_unitCodeAlphanumericInputOnly').toString(), false);
        callback(() => { });
      }
    } else {
      this.userChangeFormUnit = {
        isCurrentUnit: "",
        superiorUnitId: "",
        supervisorEmpId: "",
        supervisorIdNo: "",
        unitCreateDate: "",
        unitId: "",
        unitLevel: "",
        unitName: "",
        unitRevokeDate: "",
        updateDate: "",
        updateId: ""
      };
      this.promptUnitInfo(this.userChangeFormUnit);

      this.userChangeForm.unit = this.userChangeFormUnit;
      //科別 必填
      CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, true, this.$t('userF_unitRequired').toString(), false);
      callback(() => { });
    }
  }

  /**
   * 解析單位部門與科別資訊
   */
  promptUnitInfo(userChangeFormUnit: UnitDto) {
    let name = userChangeFormUnit.unitName;
    let nameList = name.split(" ");
    let level = userChangeFormUnit.unitLevel;
    if (level == "03") {
      this.userChangeFormDepartmentPromt = name;
      this.userChangeFormDivisionPromt = "";
    } else if (level == "04" && nameList.length == 2) {
      this.userChangeFormDepartmentPromt = nameList[0];
      this.userChangeFormDivisionPromt = nameList[1];
    } else {
      this.userChangeFormDepartmentPromt = "";
      this.userChangeFormDivisionPromt = "";
    }
  }

  /**
   * 清除表單狀態(hover,feedback)
   * @returns 
   */
  clearFormStatus() {
    CommonUtil.feildValidateWithVisible(this.userValidateForm.account, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.name, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.idNo, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.email, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.extensionNo, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.staffNo, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.unitId, false, "", false);
    CommonUtil.feildValidateWithVisible(this.userValidateForm.unit, false, "", false);
  }

  /**
   * 使用者新增/編輯表單提交
   * @returns 
   */
  async onFormSubmit() {
    this.userChangeForm.userId = this.userChangeForm.userId.toUpperCase();
    // // 後端的日期格是要是UTC字串格式才能儲存。
    // this.userChangeForm.leavedDate = this.leavedDate ?
    //   this.leavedDate.toUTCString() : null;
    let validate = true;
    // if (validationUtil.isEmpty(this.userChangeForm.unitId)) {
    //   this.userValidateForm.unitId.feedback = true;
    //   this.userValidateForm.unitId.state = "error";
    //   this.userValidateForm.unitId.hover = "hover";
    //   this.userValidateForm.unitId.msg = this.$t('global_divisionRequired').toString(); // 必填
    //   validate = false;
    // }
    // 這個驗證會檢查是否有重複userId，會導致編輯時驗證不過，但由於非同步，因此驗證會先過然後亮紅框。
    if (!this.idEditing) {
      await this.validateAccount(null, this.userChangeForm.userId, () => { });
      if (this.userValidateForm.account.feedback) {
        validate = false;
      }
    }
    this.validateEmail(null, this.userChangeForm.email, () => { });
    if (this.userValidateForm.email.feedback) {
      validate = false;
    }
    this.validateName(null, this.userChangeForm.name, () => { });
    if (this.userValidateForm.name.feedback) {
      validate = false;
    }
    this.validateIdNo(null, this.userChangeForm.idNo, () => { });
    if (this.userValidateForm.idNo.feedback) {
      validate = false;
    }
    this.validateExtensionNo(null, this.userChangeForm.extensionNo, () => { });
    if (this.userValidateForm.extensionNo.feedback) {
      validate = false;
    }
    await this.validateUnitId(null, this.userChangeForm.unitId, () => { });
    if (this.userValidateForm.unitId.feedback) {
      validate = false;
    }

    if (validate == true) {
      Modal.confirm({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_save').toString(), //儲存
        content: this.$t('userMP_confirmSave').toString() + "？", //確認執行資料更新
        onOk: () => {
          // return validate;
          // if (validate) {
          this.userChangeForm.staffType = this.userChangeForm ? this.userChangeForm.staffType : null;
          this.userChangeForm.email = btoa(this.userChangeForm.email);
          if (this.idEditing) {
            // 修改DB中使用者資料
            LoadingUtil.show();
            this.$userApi.modifyUserUsingPOST(this.userChangeForm, this.userChangeForm.userId).then(() => {
              //資料更新成功
              message.messageSuccess(this.$t('userMP_userUpdateSuccess').toString()); //資料更新成功
              this.$emit("reloadData");
              this.$emit("reloadDropdownData");
              this.reset();
            }).catch((error) => {
              ErrorModalUtil.modalError(this.$t('userF_userEditFailure').toString()); //使用者編輯失敗
              LoadingUtil.close();
            });
          } else {
            LoadingUtil.show();
            this.$userApi.isUserIdExistedUsingGET(this.userChangeForm.userId).then((resp) => {
              if (resp.data) {
                //帳號已存在
                LoadingUtil.close();
                ErrorModalUtil.modalError(this.$t('USER_ID_DUPLICATED').toString());
              } else {
                // 新增使用者資料至DB
                this.$userApi.createUserUsingPOST(this.userChangeForm).then(() => {
                  //資料更新成功
                  LoadingUtil.close();
                  message.messageSuccess(this.$t('userMP_userUpdateSuccess').toString()); //資料更新成功
                  this.$emit("reloadData");
                  this.$emit("reloadDropdownData");
                }).catch((error) => {
                  LoadingUtil.close();
                  if (!this.isInIntra && this.userChangeForm.staffType == UserStaffTypeEnum.F.toString()) {
                    //intra無資料，不可新增正職類別
                    ErrorModalUtil.modalError(this.$t('STAFF_TYPE_FAILURE').toString());
                  } else {
                    //使用者新增失敗
                    ErrorModalUtil.modalError(this.$t('userF_userAddFailure').toString());
                  }
                });
              }
            })
          }
          // }
        }
      });
    }
  }

  defaultAetnaDate = null;

  defaultLeavedDate = null;

  /**
   * 新增使用者時，自動帶入公司員工相關資料。
   * @returns 
   */
  async autoFillIn() {
    LoadingUtil.show();
    this.isInIntra = true;
    this.userChangeForm.name = "";
    this.userChangeForm.idNo = "";
    this.userChangeForm.email = "";
    this.userChangeForm.extensionNo = "";
    this.userChangeForm.unitId = "";
    this.defaultAetnaDate = "";
    this.userChangeForm.staffNo = "";
    this.userChangeForm.unit.unitName = "";
    this.userChangeForm.aetnaDate = "";
    this.userChangeForm.leavedDate = "";
    this.userChangeForm.staffType = null;
    this.userChangeFormDepartmentPromt = "";
    this.userChangeFormDivisionPromt = "";
    await this.$intraEmployeeApi.findByDomainIdUsingGET(this.userChangeForm.userId).then((res: AxiosResponse<IntraEmployeeDto>) => {
      if (!validationUtil.isEmpty(res.data)) {
        this.userChangeForm.idNo = res.data.identificationNumber;
        this.userChangeForm.name = res.data.name;
        this.userChangeForm.email = res.data.email;
        this.userChangeForm.extensionNo = res.data.ext;
        this.userChangeForm.staffNo = res.data.employeeNo;
        this.userChangeForm.unitId = res.data.deptId;
        this.userChangeForm.leavedDate = validationUtil.isEmpty(res.data.quitDate) ? null : res.data.quitDate.trim().length === 0 ? null : res.data.quitDate;
        this.userChangeForm.supervisorId = res.data.supervisorEmployeeNo;
        this.userChangeForm.staffType = UserUpdateDtoStaffTypeEnum.F;
        this.defaultAetnaDate = moment(String(res.data.aetnaDate)).format('YYYYMMDD');
        this.userChangeForm.aetnaDate = moment(String(this.defaultAetnaDate)).format('YYYY/MM/DD');
        this.defaultAetnaDate = MomentUtil.transformRocYearMonthDay(this.userChangeForm.aetnaDate);
        this.defaultLeavedDate = null;
      } else {
        this.userChangeForm.staffType = UserUpdateDtoStaffTypeEnum.P;
        this.isInIntra = false;
      }
    }).catch((err) => {
      this.userChangeForm.staffType = UserUpdateDtoStaffTypeEnum.P;
      // this.userChangeForm.name = "";
      // this.userChangeForm.idNo = "";
      // this.userChangeForm.email = "";
      // this.userChangeForm.extensionNo = "";
      // this.userChangeForm.unitId = "";
      // this.defaultAetnaDate = "";
      // this.userChangeForm.staffNo = "";
      // this.userChangeForm.unit.unitName = "";
      // this.userChangeForm.aetnaDate = "";
      // this.userChangeForm.leavedDate = "";
      // this.userChangeForm.staffType = null;
      // this.userChangeFormDepartmentPromt = "";
      // this.userChangeFormDivisionPromt = "";
      this.isInIntra = false;
    });
    if (this.userChangeForm.unitId) {
      await this.$unitApi.getUnitByUnitIdUsingGET(this.userChangeForm.unitId).then((res: AxiosResponse<UnitDto>) => {
        if (!validationUtil.isEmpty(res.data)) {
          this.userChangeFormUnit = res.data;
          this.userChangeForm.unit = this.userChangeFormUnit;
          this.promptUnitInfo(this.userChangeFormUnit);
          Object.assign(this.initData, this.userChangeForm);
        }
      });
    }
    LoadingUtil.close();
  }

  /**
 * 科別下拉式清單搜尋用(依input過濾顯示符合的清單)
 * @param input 
 * @param option 
 * @returns 
 */
  unitFilterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }

  // validateSubmit() {
  //   let validate = true;
  //   if (validationUtil.isEmpty(this.userChangeForm.unitId)) {
  //     this.userValidateForm.unitId.feedback = true;
  //     this.userValidateForm.unitId.state = "error";
  //     this.userValidateForm.unitId.hover = "hover";
  //     this.userValidateForm.unitId.msg = this.$t('global_divisionRequired').toString(); // 必填
  //     validate = false;
  //   }
  //   // 這個驗證會檢查是否有重複userId，會導致編輯時驗證不過，但由於非同步，因此驗證會先過然後亮紅框。
  //   if (!this.idEditing) {
  //     this.validateAccount(null, this.userChangeForm.userId, () => {
  //       if (this.userValidateForm.account.feedback) {
  //         validate = false;
  //       }
  //     });
  //   }
  //   this.validateEmail(null, this.userChangeForm.email, () => {
  //     if (this.userValidateForm.email.feedback) {
  //       validate = false;
  //     }
  //   });
  //   this.validateName(null, this.userChangeForm.name, () => {
  //     if (this.userValidateForm.name.feedback) {
  //       validate = false;
  //     }
  //   });
  //   this.validateIdNo(null, this.userChangeForm.idNo, () => {
  //     if (this.userValidateForm.idNo.feedback) {
  //       validate = false;
  //     }
  //   });
  //   this.validateExtensionNo(null, this.userChangeForm.extensionNo, () => {
  //     if (this.userValidateForm.extensionNo.feedback) {
  //       validate = false;
  //     }
  //   });
  //   this.validateUnitId(null, this.userChangeForm.unitId, () => {
  //     if (this.userValidateForm.unitId.feedback) {
  //       validate = false;
  //     }
  //   });
  //   return validate;
  // }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input.toUpperCase()) >= 0 || option.componentOptions.propsData.value.indexOf(input.toUpperCase()) >= 0
    );
  }
  /**
   * 當狀態選擇停用的時候，停用日會預設帶上系統日，如再切回有效則清空
   */
  onStatusSelect() {
    if (this.userChangeForm.status == UserUpdateDtoStatusEnum.N) {
      const moment = MomentUtil.default(new Date());
      this.defaultLeavedDate = MomentUtil.transformRocYearMonthDay(moment);
      this.userChangeForm.leavedDate = moment;
    } else {
      this.userChangeForm.leavedDate = null;
      this.defaultLeavedDate = "";
    }
  }

  /**
   * 帳號停用日 月曆選擇
   * @param value 
   */
  onLeavedDateChange(value) {
    if (value == "" || value == null) {
      this.defaultLeavedDate = "";
      this.userChangeForm.leavedDate = null;
    } else {
      const moment = MomentUtil.default(new Date(value.getFullYear(), value.getMonth(), value.getDate()));
      this.defaultLeavedDate = MomentUtil.transformRocYearMonthDay(moment);
      this.userChangeForm.leavedDate = moment;
    }
  }
}