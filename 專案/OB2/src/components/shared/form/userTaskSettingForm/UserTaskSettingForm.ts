import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { StaffDto, UserTaskOptions, UserTaskUpdateDto } from "@fubonlife/obd-api-axios-sdk";
import { UserTaskDto } from "@/pages/userSkillTaskSetting/Model";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { LoginModule } from "@/plugins/store/LoginModule"
import  FeildValidation from "./model";
@Component
export default class UserTaskSettingForm extends Vue {

  //電訪項目表單資料傳入(由table傳入)之後弄一個Dto
  @Prop()
  public initData;

  @Prop()
  iniAllUserStaffList;

  
  // 為vue-datepicker套件所自製的formatter
  formatter = this.$twDateFormatter;

  //異動電訪項目的欄位資料
  initialtaskSettingForm: UserTaskDto = {
    id: "",
    superiorUnitId: "",
    superiorUnitName: "",
    unitId: "",
    unitName: "",
    userId: "",
    userName: "",
    taskId: "",
    taskName: "",
    skillGetDate: "",
    effectiveDate: "",
    updateId: "",
    updateName: "",
    updateDate: "",
  };

  taskSettingForm: UserTaskUpdateDto = {
    selectedDep: "",
    selectedUnit: "",
    userId: "",
    selectedTask: "",
    skillGetDate: "",
    effectiveDate: "",
  }

  globalskillGetDate: any = "";
  globaleffectiveDate: any = "";


  userTaskValidateForm = {
    depId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    }, unitId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    userId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    taskId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    skillGetDate: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    effectiveDate: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    }
  }

  //部門下拉選項
  depOptions = [

  ];
  //科別下拉選項
  unitOptions = [

  ];
  //初始化電訪員下拉選項
  unitUserOptions = [

  ];
  //電訪項目下拉選單
  userTasksOptions = [

  ];
  //原始的被授權科別
  originalUnitOptions = [];
  //被授權的電訪員清單
  authorizedroleUsers = [];
  //控制部門不能選擇
  departDisable: boolean = false;
  //控制科別不能選擇
  unitDisable: boolean = false;
  //控制電訪員不能選擇
  userIdDisable: boolean = false;

  // 判斷是否為編輯或新增
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.userId;
  }

  /**
 * 監聽initData資料變動
 * @returns 
 */
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  async created() {
    this.initialtaskSettingForm = JSON.parse(JSON.stringify(this.initData));

    let set = new Set();
    let filterDepSet = new Set();
    // 取得所有的使用者
   
      let staffs = this.iniAllUserStaffList;
      staffs.forEach((user) => {
        // 蒐集所有訪員及其科別的對應關係
        this.unitUserOptions.push({ label: user.name, value: user.id });
        this.authorizedroleUsers.push({
          userId: user.id,
          name: user.name,
          departmentName: user.departmentName,
          departmentId: user.departmentId,
          superiorUnitId: user.superiorUnitId,
          superiorUnitName: user.superiorUnitName,
          unitLevel: user.unitLevel,
        });
        //初始化科別下拉選單
        if (!set.has(user.departmentId) && user.unitLevel == "04") {
          set.add(user.departmentId);
          this.unitOptions.push({ label: user.departmentName, value: user.departmentId })
          this.originalUnitOptions.push({ label: user.departmentName, value: user.departmentId })
        }
        //初始化部門下拉選單
        if (!filterDepSet.has(user.superiorUnitId) && user.unitLevel == "04") {
          filterDepSet.add(user.superiorUnitId);
          this.depOptions.push({
            label: user.superiorUnitName, value: user.superiorUnitId
          })
        }
        if (user.unitLevel == "03" && !filterDepSet.has(user.departmentId)) {
          filterDepSet.add(user.departmentId);
          this.depOptions.push({
            label: user.departmentName, value: user.departmentId
          })
        }

      })
    
    //取得電訪下拉選單
    await this.$userTaskApi.findAllTaskOptionsUsingGET().then(
      (res: AxiosResponse<UserTaskOptions[]>) => {
        res.data.forEach(userTaskOption => {
          this.userTasksOptions.push({
            label: userTaskOption.taskName,
            value: userTaskOption.taskId
          })
        })
      }).catch(error => {
        console.log(error) //失敗
      }).finally(() => {
        LoadingUtil.close();
      })
    //初始化資料
    this.reset();
  }

  /**
  * 根據新增或編輯，重置電訪項目資料表單。
  * @returns 
  */
  async reset() {

    // 編輯電訪項目
    if (this.isEditing) {
      //填充表單
      this.taskSettingForm = {
        selectedDep: this.initialtaskSettingForm.superiorUnitName,
        selectedUnit: this.initialtaskSettingForm.unitName,
        userId: this.initialtaskSettingForm.userName,
        selectedTask: this.initialtaskSettingForm.taskName,
        skillGetDate: MomentUtil.transformRocYearMonthDay(this.initialtaskSettingForm.skillGetDate),//將其轉為民國年
        effectiveDate: MomentUtil.transformRocYearMonthDay(this.initialtaskSettingForm.effectiveDate),
      }
      this.adskillGetDate = this.initialtaskSettingForm.skillGetDate;
      this.adEffectiveDate = this.initialtaskSettingForm.effectiveDate;
      this.validateUserId(null, this.taskSettingForm.userId, () => { });
      this.validateTaskId(null, this.taskSettingForm.selectedTask, () => { });
      this.validateskillGetDate(null, this.taskSettingForm.skillGetDate, () => { });
      this.validateeffectiveDate(null, this.taskSettingForm.effectiveDate, () => { });
    } else {
      const state = LoginModule.loginState;
      const userSuperUnitID = state.me.employee.unitIdLevel3;
      this.taskSettingForm = {
        selectedDep: userSuperUnitID,
        selectedUnit: "",
        userId: "",
        selectedTask: "",
        skillGetDate: "",
        effectiveDate: "",
      };
      this.onDepSelectChange();
    }

  }

  /**
* 科別會被限縮在所選的部門裡面
* @returns 
*/
  onDepSelectChange() {
    //當被選中的部門不為空的時候
    if (this.taskSettingForm.selectedDep != "") {
      this.unitDisable = false;
      this.taskSettingForm.selectedUnit = "";
      this.taskSettingForm.userId = "";
      //如果原本為紅叉時透過這行將其消掉
      this.validateSelectedDepId(null, this.taskSettingForm.selectedDep, () => { })
      let set = new Set();
      this.unitOptions = [];
      this.unitUserOptions = [];

      this.authorizedroleUsers.filter((user) => this.taskSettingForm.selectedDep == user.superiorUnitId || this.taskSettingForm.selectedDep == user.departmentId)
        .forEach(user => {
          //過濾重複的科別,假設選取的部門Id及為電訪員的科別id說明其為部級員工
          if (this.taskSettingForm.selectedDep == user.superiorUnitId) {
            this.unitDisable = false;
            if (!set.has(user.departmentId) && user.departmentId != null) {
              set.add(user.departmentId);
              this.unitOptions.push({ label: user.departmentName, value: user.departmentId })
            }
            this.unitUserOptions.push({ label: user.name, value: user.userId });
          } else {
            this.unitDisable = true;
            this.feildValidate(this.userTaskValidateForm.unitId, false, "success", "", "");
            this.unitUserOptions.push({ label: user.name, value: user.userId });
          }
        }
        );
    }
  }



  /**
  * 人員名單會被限縮在所選的科別
  * @returns
  */
  onUnitSelectChange() {
    //如果科別有被選中 擇人員被限縮
    if (this.taskSettingForm.selectedUnit != "") {
      this.taskSettingForm.userId = "";
      this.unitUserOptions = [];
      this.authorizedroleUsers.filter((user) => this.taskSettingForm.selectedUnit == user.departmentId)
        .forEach(user => { this.unitUserOptions.push({ label: user.name, value: user.userId }) });

      this.validateSelectedUnitId(null, this.taskSettingForm.selectedUnit, () => { })
    }
  }

  //當user被選取時科別自動換成和user的科別
  onUserSelectChange() {
    if (this.taskSettingForm.userId != '') {
      this.validateUserId(null, this.taskSettingForm.userId, () => { })
      this.taskSettingForm.selectedUnit = this.authorizedroleUsers.filter(user => this.taskSettingForm.userId == user.userId&&user.unitLevel=="04").map(user => user.departmentId)[0];
      if(this.taskSettingForm.selectedUnit!=null&&this.taskSettingForm.selectedUnit!=""){
      this.validateSelectedUnitId(null, this.taskSettingForm.selectedUnit, () => { })
      }
    }
  }

  changeUserTaskBoolean: boolean = false;
  onUserTaskChange() {
    this.changeUserTaskBoolean = true;
    this.validateTaskId(null, this.taskSettingForm.selectedTask, () => { });


  }
  /**
     技能取得日改變的時候parse為前端需要的格式民國yyy/MM/dd日期
 */
  adskillGetDate: string = "";
  adEffectiveDate: string = "";
  onSkillgetDateChange(date) {
    this.taskSettingForm.skillGetDate = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));
    this.adskillGetDate = MomentUtil.transformRocYearMonthDay(this.taskSettingForm.skillGetDate);
    this.validateskillGetDate(null, this.taskSettingForm.skillGetDate, () => { })
    if (this.taskSettingForm.skillGetDate != null && this.taskSettingForm.skillGetDate != "" && this.taskSettingForm.effectiveDate != null && this.taskSettingForm.effectiveDate != "") {
      this.validateSkillGetDateAndEffecitiveDate(this.adskillGetDate, this.adEffectiveDate, () => { });
    }
  }
  /**
     技能生效日改變的時候parse為前端需要的格式民國yyy/MM/dd日期
  */
  onEffectiveDateChange(date) {
    this.taskSettingForm.effectiveDate = MomentUtil.transformRocYearMonthDay(MomentUtil.default(date));
    this.adEffectiveDate = MomentUtil.transformRocYearMonthDay(this.taskSettingForm.effectiveDate);
    this.validateeffectiveDate(null, this.taskSettingForm.effectiveDate, () => { })
    if (this.taskSettingForm.skillGetDate != null && this.taskSettingForm.skillGetDate != "" && this.taskSettingForm.effectiveDate != null && this.taskSettingForm.effectiveDate != "") {
      this.validateSkillGetDateAndEffecitiveDate(this.adskillGetDate, this.adEffectiveDate, () => { });
    }

  }

  // ============================submit提交section============================
  validateBeforeSubmit() {

    this.validateUserId(null, this.taskSettingForm.userId, () => { });
    this.validateSelectedDepId(null, this.taskSettingForm.selectedDep, () => { });
    let unitId=this.authorizedroleUsers.filter(user => this.taskSettingForm.userId == user.userId&&user.unitLevel=="04").map(user => user.departmentId)[0];
    //當科別無法選擇的時候不去做驗證
    if(this.unitDisable==true){
      this.userTaskValidateForm.unitId.state = "success"
    }else{
      this.validateSelectedUnitId(null, this.taskSettingForm.selectedUnit, () => { });
    }
    this.validateTaskId(null, this.taskSettingForm.selectedTask, () => { });
    this.validateskillGetDate(null, this.taskSettingForm.skillGetDate, () => { });
    this.validateeffectiveDate(null, this.taskSettingForm.effectiveDate, () => { });
    this.validateSkillGetDateAndEffecitiveDate(this.taskSettingForm.skillGetDate, this.taskSettingForm.effectiveDate, () => { });
    const isValidDepId: boolean = this.userTaskValidateForm.depId.state == "success" ? true : false;
    const isValidUserId: boolean = this.userTaskValidateForm.userId.state == "success" ? true : false;
    const isValidTaskId: boolean = this.userTaskValidateForm.taskId.state == "success" ? true : false;
    const isSkillGetDate: boolean = this.userTaskValidateForm.skillGetDate.state == "success" ? true : false;
    const isEffectiveDate: boolean = this.userTaskValidateForm.effectiveDate.state == "success" ? true : false;
    const isDatePass: boolean = this.userTaskValidateForm.skillGetDate.state == "success" && this.userTaskValidateForm.effectiveDate.state == "success" ? true : false;
    //假設驗證成功才可以送出
    if (
      isValidDepId
      && isValidUserId
      && isValidTaskId
      && isSkillGetDate
      && isEffectiveDate
      && isDatePass) {
      // 異動電訪
      return true;
    } else {
      return false;

    }










  }
  /**
   * 電訪項目技能新增/編輯表單提交
   * @returns 
   */
  public submit() {

    this.validateUserId(null, this.taskSettingForm.userId, () => { });
    this.validateSelectedDepId(null, this.taskSettingForm.selectedDep, () => { });
    // let unitId=this.authorizedroleUsers.filter(user => this.taskSettingForm.userId == user.userId&&user.unitLevel=="04").map(user => user.departmentId)[0];
    //當科別無法選擇的時候不去做驗證
    if(this.unitDisable==true){
      this.userTaskValidateForm.unitId.state = "success"
    }else{
      this.validateSelectedUnitId(null, this.taskSettingForm.selectedUnit, () => { });
    }
    this.validateTaskId(null, this.taskSettingForm.selectedTask, () => { });
    this.validateskillGetDate(null, this.taskSettingForm.skillGetDate, () => { });
    this.validateeffectiveDate(null, this.taskSettingForm.effectiveDate, () => { });
    this.validateSkillGetDateAndEffecitiveDate(this.taskSettingForm.skillGetDate, this.taskSettingForm.effectiveDate, () => { });
    const isValidDepId: boolean = this.userTaskValidateForm.depId.state == "success" ? true : false;
    const isValidUserId: boolean = this.userTaskValidateForm.userId.state == "success" ? true : false;
    const isValidTaskId: boolean = this.userTaskValidateForm.taskId.state == "success" ? true : false;
    const isSkillGetDate: boolean = this.userTaskValidateForm.skillGetDate.state == "success" ? true : false;
    const isEffectiveDate: boolean = this.userTaskValidateForm.effectiveDate.state == "success" ? true : false;
    const isDatePass: boolean = this.userTaskValidateForm.skillGetDate.state == "success" && this.userTaskValidateForm.effectiveDate.state == "success" ? true : false;
    //假設驗證成功才可以送出
    if (
      isValidDepId
      && isValidUserId
      && isValidTaskId
      && isSkillGetDate
      && isEffectiveDate
      && isDatePass) {
      // 異動電訪
      (this.isEditing) ? this.updateUserTask() : this.createUserTask();
    } else {
      const errorFields: string[] = [];
      if (!isValidDepId) { errorFields.push(this.$t("global_department").toString() + this.$t("global_column_canNotBeEmpty").toString()) }
      if (!isValidUserId) { errorFields.push(this.$t("global_telemarketer").toString() + this.$t("global_column_canNotBeEmpty").toString()) }
      if (!isValidTaskId) { errorFields.push(this.$t("userTask").toString() + this.$t("global_column_canNotBeEmpty").toString()) + this.$t("global_column_canNotBeEmpty").toString() }
      if (this.userTaskValidateForm.skillGetDate.content == this.$t("userTask_skillEffectiveDateNotEarly").toString()) {
        errorFields.push(this.userTaskValidateForm.skillGetDate.content)
      } else {
        errorFields.push(this.userTaskValidateForm.effectiveDate.content)
        errorFields.push(this.userTaskValidateForm.skillGetDate.content)
      }
      ErrorModalUtil.modalError(errorFields + "");

    }
  }

  /**
   * @description 更新電訪項目技能資料
   * @version 2021/12/09
   * @author B1530
   */
   async updateUserTask() {
    //假設沒有更動的話則將值改為id型態 為期初的狀態
    if (!this.changeUserTaskBoolean) {
      this.taskSettingForm.selectedTask = this.initialtaskSettingForm.taskId
    }

    //假設更新的電訪項目和一開始的電訪項目不同則驗證目前是否存在
    if (this.initialtaskSettingForm.taskId != this.taskSettingForm.selectedTask) {
      const resp = await this.$userTaskApi.findUserTaskbyTaskIdAndUserIdUsingGET(this.taskSettingForm.selectedTask, this.initialtaskSettingForm.userId)
      if (resp.data.userId != null && resp.data.taskId == this.taskSettingForm.selectedTask) {
        ErrorModalUtil.modalError(this.$t('userTask_existed').toString());
        return
      }
    }
    let updateBody:UserTaskUpdateDto={};
    updateBody.effectiveDate=this.adEffectiveDate;
    updateBody.skillGetDate=this.adskillGetDate;
    updateBody.selectedTask=this.taskSettingForm.selectedTask;
    updateBody.userId=this.taskSettingForm.userId;
   
    this.$userTaskApi.modifyUserTaskUsingPOST(updateBody
      , this.initData.id
    ).
      then(resp => {
        MessageUtil.messageSuccess(this.$t('global_data_save_success').toString())//電訪項目編輯成功 
        const formVisible = false;
        this.$emit("reloadData", formVisible);
      }).catch(err => {
        ErrorModalUtil.modalError(err + this.$t('global_data_save_failed').toString());
      })

  }

  /**
   * @description 新增電訪項目技能
   * @version 2021/12/09
   * @author B1530
   */
   async createUserTask() {
    let createBody:UserTaskUpdateDto={};
    createBody.effectiveDate=this.adEffectiveDate;
    createBody.skillGetDate=this.adskillGetDate;
    createBody.selectedTask=this.taskSettingForm.selectedTask;
    createBody.userId=this.taskSettingForm.userId;
    const resp = await this.$userTaskApi.findUserTaskbyTaskIdAndUserIdUsingGET(this.taskSettingForm.selectedTask, this.taskSettingForm.userId)
    if (resp.data.userId != null && resp.data.taskId == this.taskSettingForm.selectedTask) {
      ErrorModalUtil.modalError(this.$t('userTask_existed').toString());
    } else {
      this.$userTaskApi.createUserTaskUsingPOST(createBody).
        then(resp => {
          MessageUtil.messageSuccess(this.$t('global_data_save_success').toString())//資料儲存成功
          const formVisible = false;
          this.$emit("reloadData", formVisible);
        }).catch(err => {
          ErrorModalUtil.modalError(err + this.$t('global_data_save_failed').toString());//資料儲存失敗
        })
    }
  }

  // ============================驗證validate section============================

  /**
 * 電訪註記新增或編輯，部門不可為空白。
 * @param rule 驗證規則 
 * @param value 使用者帳號輸入值 
 * @param callback 回乎函數，不帶參數表示驗證成功。
 * @returns 
 */
  validateSelectedDepId(rule, value, callback) {

    this.userTaskValidateForm.depId.feedback = true;
    this.userTaskValidateForm.depId.hover = "";
    if (value != null && value != "") {
      this.userTaskValidateForm.depId.state = "success";
      this.userTaskValidateForm.depId.feedback = false;
      callback();

    } else {
      this.userTaskValidateForm.depId.hover = "hover";
      this.userTaskValidateForm.depId.state = "error";
      this.userTaskValidateForm.depId.content = this.$t("global_departmentRequired").toString(); //部門必填
      callback(false);
    }
  }
  /**
  * 使用者新增或編輯，科別不可為空白。
  * @param rule 驗證規則 
  * @param value 使用者帳號輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSelectedUnitId(rule, value, callback) {

    // this.userTaskValidateForm.unitId.feedback = true;
    // this.userTaskValidateForm.unitId.hover = "";
    // if (value != null && value != "") {
    //   this.userTaskValidateForm.unitId.state = "success";
    //   this.userTaskValidateForm.unitId.feedback = false;
    //   callback();

    // } else {
    //   this.userTaskValidateForm.unitId.hover = "hover";
    //   this.userTaskValidateForm.unitId.state = "error";
    //   this.userTaskValidateForm.unitId.content = this.$t("global_divisionRequired").toString(); // 科別必填
    //   callback(false);
    // }
  }

  /**
  * 使用者新增或編輯，使用者帳號不可為空白。
  * @param rule 驗證規則 
  * @param value 使用者帳號輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateUserId(rule, value, callback) {

    this.userTaskValidateForm.userId.feedback = true;
    this.userTaskValidateForm.userId.hover = "";
    if (value != null && value != "") {
      this.userTaskValidateForm.userId.state = "success";
      this.userTaskValidateForm.userId.feedback = false;

      callback();

    } else {
      this.userTaskValidateForm.userId.hover = "hover";
      this.userTaskValidateForm.userId.state = "error";
      this.userTaskValidateForm.userId.content = this.$t("global_telemarketerIdRequired").toString(); //電訪員帳號必填
      callback(false);
    }
  }

  validateTaskId(rule, value, callback) {

    this.userTaskValidateForm.taskId.feedback = true;
    this.userTaskValidateForm.taskId.hover = "";
    if (this.taskSettingForm.selectedTask != null && this.taskSettingForm.selectedTask != "") {
      this.userTaskValidateForm.taskId.state = "success";
      this.userTaskValidateForm.taskId.feedback = false;
      callback();
    } else {
      this.userTaskValidateForm.taskId.hover = "hover";
      this.userTaskValidateForm.taskId.state = "error";
      this.userTaskValidateForm.taskId.content = this.$t("userTask_skillRequired").toString();
      callback(false);
    }


  }

  validateskillGetDate(rule, value, callback) {

    this.userTaskValidateForm.skillGetDate.feedback = true;
    this.userTaskValidateForm.skillGetDate.hover = "";
    if (value != null && value != "") {
      this.userTaskValidateForm.skillGetDate.state = "success";
      this.userTaskValidateForm.skillGetDate.feedback = false;

      callback();

    } else {

      this.userTaskValidateForm.skillGetDate.hover = "hover";
      this.userTaskValidateForm.skillGetDate.state = "error";
      this.userTaskValidateForm.skillGetDate.content = this.$t("userTask_skillGetDateRequired").toString();//技能取得日不可為空白
      callback(false);
    }

  }

  validateeffectiveDate(rule, value, callback) {

    this.userTaskValidateForm.effectiveDate.feedback = true;
    this.userTaskValidateForm.effectiveDate.hover = "";
    if (value != null && value != "") {
      this.userTaskValidateForm.effectiveDate.state = "success";
      this.userTaskValidateForm.effectiveDate.feedback = false;

      callback();

    } else {

      this.userTaskValidateForm.effectiveDate.hover = "hover";
      this.userTaskValidateForm.effectiveDate.state = "error";
      this.userTaskValidateForm.effectiveDate.content = this.$t("userTask_skillEffectiveDateRequired").toString();//技能生效日不可為空
      callback(false);
    }

  }

  validateSkillGetDateAndEffecitiveDate(skillGetDate, effectiveDate, callback) {
    if (skillGetDate != null && skillGetDate != "" && effectiveDate != null && effectiveDate != "") {
      this.userTaskValidateForm.skillGetDate.feedback = true;
      this.userTaskValidateForm.skillGetDate.hover = "";
      this.userTaskValidateForm.effectiveDate.feedback = true;
      this.userTaskValidateForm.effectiveDate.hover = "";
      let skillGetDates = new Date(skillGetDate);
      let handleSkillGetDates = new Date(skillGetDates.getFullYear(), skillGetDates.getMonth(), skillGetDates.getDate());

      let effectiveDates = new Date(effectiveDate);
      let handleeffectiveDates = new Date(effectiveDates.getFullYear(), effectiveDates.getMonth(), effectiveDates.getDate());

      if (handleSkillGetDates.getTime() <= handleeffectiveDates.getTime()) {
        this.userTaskValidateForm.skillGetDate.state = "success";
        this.userTaskValidateForm.skillGetDate.feedback = false;
        this.userTaskValidateForm.effectiveDate.state = "success";
        this.userTaskValidateForm.effectiveDate.feedback = false;
        callback();
      } else {//驗證失敗
        this.userTaskValidateForm.effectiveDate.hover = "hover";
        this.userTaskValidateForm.effectiveDate.state = "error";
        this.userTaskValidateForm.effectiveDate.content = this.$t("userTask_skillEffectiveDateNotEarly").toString();
        this.userTaskValidateForm.skillGetDate.hover = "hover";
        this.userTaskValidateForm.skillGetDate.state = "error";
        this.userTaskValidateForm.skillGetDate.content = this.$t("userTask_skillEffectiveDateNotEarly").toString();
        callback(false);
      }
    }

  }

  isSkillGetDateVisible: boolean = false;
  isEffectiveDateVisible: boolean = false;
  /**
* 確保Tooltip在日期正確時確實隱藏
*/
  skillGetDateMouseOver() {
    if (this.userTaskValidateForm.skillGetDate.state == "error") {
      this.isSkillGetDateVisible = true;
    } else {
      this.isSkillGetDateVisible = false;
    }
  }
  effectiveMouseOver() {
    if (this.userTaskValidateForm.effectiveDate.state == "error") {
      this.isEffectiveDateVisible = true;
    } else {
      this.isEffectiveDateVisible = false;
    }
  }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }

   //驗證共用物件
   feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }

  clearFormStatus() {
    this.userTaskValidateForm = {
      depId: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      }, unitId: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      },
      userId: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      },
      taskId: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      },
      skillGetDate: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      },
      effectiveDate: {
        hover: "",
        feedback: false,
        state: "",
        content: "",
      }
    }



  }


}