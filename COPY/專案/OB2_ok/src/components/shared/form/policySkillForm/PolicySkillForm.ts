import { Vue, Component, Prop, Watch, } from "vue-property-decorator";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { StaffDto, UserSkillsUpdateDto, UserSkill } from "@fubonlife/obd-api-axios-sdk";
import UserSkillsDto from "@/pages/userSkillTaskSetting/Model";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { InputGroup } from "ant-design-vue/types/input/input-group";
import { LoginModule } from "@/plugins/store/LoginModule"
import  FeildValidation from "./model";
@Component
export default class UserSkillsSettingForm extends Vue {

  //初始化新增保戶註記功能項目的資料
  @Prop()
  public initialUserSkillsData: UserSkillsDto;

  //新增or編輯保戶註記表單
  userSkillsSettingForm = {
    selectedDep: "",
    selectedUnit: "",
    selectedUserId: "",
    selectedLanguages: [],
    selectedTags: [],
  }

  userSkillsValidateForm = {

    userId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    selectedDep: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    }, selectedUnit: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    selectedUserId: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    selectedLanguages: {
      hover: "",
      feedback: false,
      state: "",
      content: "",
    },
    selectedTags: {
      hover: "",
      feedback: false,
      state: "",
      content: "",

    }
  }

  //部門下拉選單
  depOptions = [

  ];
  //科別下拉選項
  unitOptions = [

  ];
  //電訪員下拉選項
  unitUserOptions = [

  ];
  //電訪項目下拉選單
  userTasksOptions = [

  ];
  //語言checkbox選單
  @Prop()
  userLanguagesOptions;

  @Prop()
  userTagsOptions;

  @Prop()
  iniAllUserStaffList;
  //被授權的電訪員清單
  authorizedroleUsers = [];
  //原始的被授權部門
  originalUnitOptions = [];
  //控制部門不能選擇
  departDisable: boolean = false;
  //控制科別不能選擇
  unitDisable: boolean = false;
  //控制電訪員不能選擇
  userIdDisable: boolean = false;
  //控制pop彈出的時間
  isUserSkillsPopVisible: boolean = false;
  // 判斷是否為編輯或新增
  get isEditing(): boolean {
    return !!this.initialUserSkillsData && !!this.initialUserSkillsData.userId;
  }

  userSkillsMouseOver() {
    if (this.userSkillsValidateForm.selectedLanguages.state == "error") {
      this.isUserSkillsPopVisible = true;
    } else {
      this.isUserSkillsPopVisible = false;
    }

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

    let set = new Set();
    let filterDepSet = new Set();
    // 取得所有具有訪員角色

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

      if (!set.has(user.departmentId) && user.unitLevel == "04") {
        set.add(user.departmentId);
        this.unitOptions.push({ label: user.departmentName, value: user.departmentId })
        this.originalUnitOptions.push({ label: user.departmentName, value: user.departmentId })
      }
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
      this.userSkillsSettingForm = {
        selectedDep: this.initialUserSkillsData.superiorUnitName,
        selectedUnit: this.initialUserSkillsData.unitName,
        selectedUserId: this.initialUserSkillsData.userName,
        selectedLanguages: this.initialUserSkillsData.languageIds,
        selectedTags: this.initialUserSkillsData.tagIds,
      }
      this.validateUserId(null, this.userSkillsSettingForm.selectedUserId, () => { });
    } else {

      const state = LoginModule.loginState;
      const userSuperUnitID = state.me.employee.unitIdLevel3;

      this.userSkillsSettingForm = {
        selectedDep: userSuperUnitID,
        selectedUnit: "",
        selectedUserId: "",
        selectedLanguages: [],
        selectedTags: [],
      };
      this.onDepSelectChange();
    }

  }

  /**
 * 人員名單會被限縮在所選的部門內
 * @returns this.unitOptions =
 */
  onDepSelectChange() {

    if (this.userSkillsSettingForm.selectedDep != "") {
      this.unitDisable = false;
      this.userSkillsSettingForm.selectedUnit = "";
      this.userSkillsSettingForm.selectedUserId = "";
      this.validateSelectedDepId(null, this.userSkillsSettingForm.selectedDep, () => { })
      let set = new Set();
      this.unitOptions = [];
      this.unitUserOptions = [];
      this.authorizedroleUsers.filter((user) => this.userSkillsSettingForm.selectedDep == user.superiorUnitId || this.userSkillsSettingForm.selectedDep == user.departmentId)
        .forEach(user => {
          //如果選取的部門Id與員工的相符說明其為科級員工
          if (this.userSkillsSettingForm.selectedDep == user.superiorUnitId) {
            this.unitDisable = false;
            //過濾重複的科別
            if (!set.has(user.departmentId) && user.departmentId != null) {
              set.add(user.departmentId);
              this.unitOptions.push({ label: user.departmentName, value: user.departmentId })
            }

            if (!set.has(user.userId)) {
              set.add(user.userId);
              this.unitUserOptions.push({ label: user.name, value: user.userId });
            }
          } else {
            this.unitDisable = true;
            this.feildValidate(this.userSkillsValidateForm.selectedUnit, false, "success", "", "");
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
    //如果科別有被選中 人員被限縮
    if (this.userSkillsSettingForm.selectedUnit != "") {
      this.userSkillsSettingForm.selectedUserId = "";
      this.unitUserOptions = [];
      this.authorizedroleUsers.filter((user) => this.userSkillsSettingForm.selectedUnit == user.departmentId)
        .forEach(user => { this.unitUserOptions.push({ label: user.name, value: user.userId }) });

      this.validateSelectedUnitId(null, this.userSkillsSettingForm.selectedUnit, () => { })
    }

  }

  //當user被選取時科別自動換成和user的科別
  onUserSelectChange() {
    if (this.userSkillsSettingForm.selectedUserId != '') {
      this.validateUserId(null, this.userSkillsSettingForm.selectedUserId, () => { });
      this.userSkillsSettingForm.selectedUnit = this.authorizedroleUsers.filter(user => this.userSkillsSettingForm.selectedUserId == user.userId && user.unitLevel == "04").map(user => user.departmentId)[0];
      if (this.userSkillsSettingForm.selectedUnit != null && this.userSkillsSettingForm.selectedUnit != "") {
        this.validateSelectedUnitId(null, this.userSkillsSettingForm.selectedUnit, () => { })
      }
    }
  }





  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }



  /**
  * 監聽客戶標籤資料變動
  * @returns 
  */
  onselectedTagsChanged(): void {
    const userSkillsList = this.userSkillsSettingForm.selectedLanguages.concat(this.userSkillsSettingForm.selectedTags);
    this.validateUserLanguagesAndTags(null, userSkillsList, () => { });
    if (userSkillsList.length != 0) {
      this.isUserSkillsPopVisible = false;
    }
  }


  /**
* 監聽語言資料變動
* @returns 
*/

  onselectedLangsChanged(): void {
    const userSkillsList = this.userSkillsSettingForm.selectedLanguages.concat(this.userSkillsSettingForm.selectedTags);
    this.validateUserLanguagesAndTags(null, userSkillsList, () => { });
    if (userSkillsList.length != 0) {
      this.isUserSkillsPopVisible = false;
    }
  }

  // #############################submit提交section#############################################


  async validateBeforeSubmit() {
    this.validateUserId(null, this.userSkillsSettingForm.selectedUserId, () => { });
    this.validateSelectedDepId(null, this.userSkillsSettingForm.selectedDep, () => { });
    let unitId = this.authorizedroleUsers.filter(user => this.userSkillsSettingForm.selectedUserId == user.userId && user.unitLevel == "04").map(user => user.departmentId)[0];
    //當科別無法選擇的時候不去做驗證
    if (this.unitDisable == true) {
      this.userSkillsValidateForm.selectedUnit.state = "success"
    } else {
      this.validateSelectedUnitId(null, this.userSkillsSettingForm.selectedUnit, () => { });
    }

    const userSkillsList = this.userSkillsSettingForm.selectedLanguages.concat(this.userSkillsSettingForm.selectedTags);
    this.validateUserLanguagesAndTags(null, userSkillsList, () => { });
    const isValidUserId: boolean = this.userSkillsValidateForm.userId.state == "success" ? true : false;
    const isValidDepId: boolean = this.userSkillsValidateForm.selectedDep.state == "success" ? true : false;
    const isUserSkill: boolean = this.userSkillsValidateForm.selectedLanguages.state == "success" ? true : false;
    // //假設驗證成功才可以送出
    if (isValidUserId && isValidDepId ) {
      //假設至少有一筆特保註記
      if (isUserSkill) {
        return true;
      } else {
        //假設無的話則出現錯誤
        ErrorModalUtil.modalError(this.$t("custMark_tagAndLanguageError").toString());
        return false;
      }
    } else {
      return false;
    }

  }
  /**
   * 特保註記技能新增/編輯表單提交
   * @returns 
   */
  public submit() {
    this.validateUserId(null, this.userSkillsSettingForm.selectedUserId, () => { });
    this.validateSelectedDepId(null, this.userSkillsSettingForm.selectedDep, () => { });
    let unitId = this.authorizedroleUsers.filter(user => this.userSkillsSettingForm.selectedUserId == user.userId && user.unitLevel == "04").map(user => user.departmentId)[0];
     //當科別無法選擇的時候不去做驗證
     if (this.unitDisable == true) {
      this.userSkillsValidateForm.selectedUnit.state = "success"
    } else {
      this.validateSelectedUnitId(null, this.userSkillsSettingForm.selectedUnit, () => { });
    }
    const userSkillsList = this.userSkillsSettingForm.selectedLanguages.concat(this.userSkillsSettingForm.selectedTags);
    this.validateUserLanguagesAndTags(null, userSkillsList, () => { });
    const isValidUserId: boolean = this.userSkillsValidateForm.userId.state == "success" ? true : false;
    const isValidDepId: boolean = this.userSkillsValidateForm.selectedDep.state == "success" ? true : false;
    const isUserSkill: boolean = this.userSkillsValidateForm.selectedLanguages.state == "success" ? true : false;

    // //假設驗證成功才可以送出
    if (isValidUserId && isValidDepId ) {
      //假設至少有一筆特保註記
      if (isUserSkill) {
        (this.isEditing) ? this.updateUserSkills() : this.createUserSkills();
      } else {
        //假設無的話則出現錯誤
        ErrorModalUtil.modalError(this.$t("custMark_tagAndLanguageError").toString());
      }
    } else {
      const errorFields: string[] = [];
      if (!isValidUserId) { errorFields.push(this.$t("global_telemarketer").toString()) }
      if (!isValidDepId) { errorFields.push(this.$t("global_department").toString()) }
      
      ErrorModalUtil.modalError(errorFields + this.$t("global_column_canNotBeEmpty").toString());

    }
  }

  /**
   * @description 更新保戶註記項目技能資料
   * @version 2021/12/17
   * @author B1530
   */
  updateUserSkills() {
    let updateBodies: UserSkillsUpdateDto = {
      userId: this.initialUserSkillsData.userId,
      userLanguages: this.userSkillsSettingForm.selectedLanguages,
      userTags: this.userSkillsSettingForm.selectedTags
    }
    this.$userSkillApi.modifyUserSkillsUsingPOST(updateBodies).
      then(resp => {
        MessageUtil.messageSuccess(this.$t('global_data_save_success').toString());//資料更新成功
        const formVisible = false;
        this.$emit("reloadData", formVisible);
      }).catch(err => {
        ErrorModalUtil.modalError(this.$t("global_data_save_failed").toString());//特保註記修改失敗
      })
  }

  /**
   * @description 新增電訪項目技能
   * @version 2021/12/09
   * @author B1530
   */
  async createUserSkills() {
    try {
      const resp = await this.$userSkillApi.findUserSkillsByUserIdUsingGET(this.userSkillsSettingForm.selectedUserId);
      //先判斷該名電訪員的技能是否已經存在
      if (resp.data.length > 0) {
        ErrorModalUtil.modalError(this.$t("userskill_existed").toString());
      } else {
        //不存在的話則進行新增
        let createBodies: UserSkillsUpdateDto = {
          userId: this.userSkillsSettingForm.selectedUserId,
          userLanguages: this.userSkillsSettingForm.selectedLanguages,
          userTags: this.userSkillsSettingForm.selectedTags
        }
        this.$userSkillApi.createUserSkillsUsingPOST(createBodies).
          then(resp => {
            MessageUtil.messageSuccess(this.$t('global_data_save_success').toString())//資料已儲存成功
            const formVisible = false;
            this.$emit("reloadData", formVisible);
          }).catch(err => {
            ErrorModalUtil.modalError(this.$t("global_data_save_failed").toString());//資料已儲存失敗

          })
      }
    } catch (err) {
      ErrorModalUtil.modalError(err + this.$t('custMark_paginateF').toString());
    }


  }


  // #############################驗證validate section#############################################

  // 欄位驗證規則(新增/編輯)
  // userTaskRules: { [key: string]: ValidationRule[] } = {
  //   userId: [{ validator: this.validateUserId, trigger: "blur" }],

  // };

  /**
  * 使用者新增或編輯，使用者帳號不可為空白。
  * @param rule 驗證規則 
  * @param value 使用者帳號輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateUserId(rule, value, callback) {

    this.userSkillsValidateForm.userId.feedback = true;
    this.userSkillsValidateForm.userId.hover = "";
    if (value != null && value != "") {
      this.userSkillsValidateForm.userId.state = "success";
      this.userSkillsValidateForm.userId.feedback = false;
      callback();

    } else {
      this.userSkillsValidateForm.userId.hover = "hover";
      this.userSkillsValidateForm.userId.state = "error";
      this.userSkillsValidateForm.userId.content = this.$t("global_telemarketerIdRequired").toString(); //電訪員帳號必填
      callback(false);
    }
  }


  /**
  * 電訪註記新增或編輯，部門不可為空白。
  * @param rule 驗證規則 
  * @param value 使用者帳號輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSelectedDepId(rule, value, callback) {

    this.userSkillsValidateForm.selectedDep.feedback = true;
    this.userSkillsValidateForm.selectedDep.hover = "";
    if (value != null && value != "") {
      this.userSkillsValidateForm.selectedDep.state = "success";
      this.userSkillsValidateForm.selectedDep.feedback = false;
      callback();

    } else {
      this.userSkillsValidateForm.selectedDep.hover = "hover";
      this.userSkillsValidateForm.selectedDep.state = "error";
      this.userSkillsValidateForm.selectedDep.content = this.$t("global_departmentRequired").toString(); //部門必填
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

    // this.userSkillsValidateForm.selectedUnit.feedback = true;
    // this.userSkillsValidateForm.selectedUnit.hover = "";
    // if (value != null && value != "") {
    //   this.userSkillsValidateForm.selectedUnit.state = "success";
    //   this.userSkillsValidateForm.selectedUnit.feedback = false;
    //   callback();

    // } else {
    //   this.userSkillsValidateForm.selectedUnit.hover = "hover";
    //   this.userSkillsValidateForm.selectedUnit.state = "error";
    //   this.userSkillsValidateForm.selectedUnit.content = this.$t("global_divisionRequired").toString(); //科別必填
    //   callback(false);
    // }
  }
  validateUserLanguagesAndTags(rule, value: Array<String>, callback) {
    this.userSkillsValidateForm.selectedLanguages.feedback = true;
    this.userSkillsValidateForm.selectedTags.feedback = true;
    this.userSkillsValidateForm.selectedLanguages.hover = "";
    this.userSkillsValidateForm.selectedTags.hover = "";
    if (value != null && value.length != 0) {
      this.isUserSkillsPopVisible = false;
      this.userSkillsValidateForm.selectedLanguages.feedback = false;
      this.userSkillsValidateForm.selectedLanguages.state = "success";
      this.userSkillsValidateForm.selectedTags.feedback = false;
      this.userSkillsValidateForm.selectedTags.state = "success";

      callback();

    } else {
      this.isUserSkillsPopVisible = true;
      this.userSkillsValidateForm.selectedLanguages.hover = "hover";
      this.userSkillsValidateForm.selectedLanguages.state = "error";
      this.userSkillsValidateForm.selectedTags.hover = "hover";
      this.userSkillsValidateForm.selectedTags.state = "error";
      this.userSkillsValidateForm.selectedLanguages.content = this.$t("custMark_tagAndLanguageError").toString();//擇一顯示
      callback(false);
    }



  }
   //驗證共用物件
   feildValidate(fv: FeildValidation, feedback: boolean, state: string, hover: string, msg: string) {
    fv.feedback = feedback == null ? fv.feedback : feedback;
    fv.state = state == null ? fv.state : state;
    fv.hover = hover == null ? fv.hover : hover;
    fv.msg = msg == null ? fv.msg : msg;
  }



}