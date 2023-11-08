import { Vue, Component, Prop, Watch, Ref } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import { RoleDto, RoleChange, RoleChangeStatusEnum, RoleDtoStatusEnum, Option } from "@fubonlife/obd-api-axios-sdk";
import message from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { RoleSettingValidateObject } from "@/pages/roleSetting/model";
import { RoleSettingFormValidateObject } from "./model";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";

@Component
export default class RoleSettingForm extends Vue {

  //角色ID表單資料傳入
  @Prop()
  public initData: RoleDto;

  roleSettingFormValidateObject: RoleSettingFormValidateObject = {
    id: { feedback: false, hoverVisible: false, msg: ""},
    name: { feedback: false, hoverVisible: false, msg: ""},
  }

  //異動角色的欄位資料
  roleChangeForm: RoleChange = {
    id: '',
    roleName: '',
    roleDesc: '',
    status: RoleChangeStatusEnum.Y,
  };

  // From 欄位規則驗證(新增/編輯)
  changeRules: { [key: string]: ValidationRule[] } = {
    id: [{ validator: this.validateRoleId, trigger: "blur" }],
    roleName: [{ validator: this.validateName, trigger: "blur" }],
    // roleDesc: [{ validator: this.validateDesc, trigger: "blur" }],
  };

  //狀態，下拉式表單
  selectStatusOptions: Option[] = [];

  // 判斷是否為編輯或新增
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.id;
  }

  created(): void {

    // 取得狀態下拉選單
    this.$commonApi.findByTypeIdUsingGET("status")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectStatusOptions = res.data;
      }).catch((err) => {
        console.log(err);
      });

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
   * 根據新增或編輯，重置角色資料表單。
   * @returns 
   */
  reset() {

    // 清空為預設值
    this.clearForm();

    // 編輯角色
    if (this.isEditing) {

      // 塞入異動角色的欄位資料
      this.roleChangeForm = {
        id: this.initData.id,
        roleName: this.initData.roleName,
        roleDesc: this.initData.roleDesc,
        status: (this.initData.status == RoleDtoStatusEnum.Y) ? RoleChangeStatusEnum.Y : RoleChangeStatusEnum.N
      }
    }
  }

  /**
   * 角色新增/編輯表單提交
   * @returns 
   */
  public submit() {

    // 此交由呼叫頁面驗證
    // // 驗證角色異動欄位
    // if (!this.validateSubmit()) {
    //   return;
    // }

    // 異動角色
    (this.isEditing) ? this.updateRole() : this.createRole();
  }

  /**
   * @description 更新角色資料
   * @version 2021/05/27
   * @author B1529
   */
  updateRole() {
    LoadingUtil.show();
    this.$roleApi.updateRoleUsingPOST(this.roleChangeForm.id, this.roleChangeForm as RoleChange)
      .then((resp) => {
        message.messageSuccess(this.$t('roleSF_roleEditSuccess').toString()); // 角色編輯成功
        const formVisible = false;
        LoadingUtil.close();
        this.$emit("Visible", formVisible);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        LoadingUtil.close();
      });
  }

  /**
   * @description 新增角色資料
   * @version 2021/05/27
   * @author B1529
   */
  createRole() {
    LoadingUtil.show();
    this.$roleApi.createRoleUsingPOST(this.roleChangeForm as RoleChange)
      .then((resp) => {
        message.messageSuccess(this.$t('roleSF_roleAddSuccess').toString()); // 角色新增成功
        const formVisible = false;
        LoadingUtil.close();
        this.$emit("Visible", formVisible);
      })
      .catch((err) => {
        console.error(err);
      }).finally(() => {
        LoadingUtil.close();
      });
  }

  /**
   * 角色代號，篩選條件，僅可輸入英數字與底線。
   * @param rule 驗證規則 
   * @param value 角色代號輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateRoleId(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.id,false,"",false);
    if(validationUtil.isEmpty(value)){
      // 角色代號 必填
      CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.id,true,this.$t('roleSF_roleCodeNameRequired').toString(),false);    
      callback(() => { });
    }else if(!validationUtil.accountValidation(value)){
      // 角色代號 僅可輸入英 
      CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.id,true,this.$t('roleSF_roleCodeNameAlphanumericInputOnly').toString(),false);       
      callback(() => { });
    }else{
      CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.id,false,"",false);
      callback();
    }
  }


  /**
   * 角色名稱，篩選條件，不可輸入符號。
   * @param rule 驗證規則 
   * @param value 使用者姓名輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateName(rule, value, callback) {
    CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.name,true,"",false);
    if (!validationUtil.isEmpty(value)) {
      if (!validationUtil.nameValidation(value)) {
        // 角色名稱 不可輸入符號
        CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.name,true,this.$t('roleSF_roleNameNoSymbols').toString(),false);
        callback(() => { });
      } else {
        CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.name,false,"",false);
      }
    } else {
      // 角色名稱 必填
      CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.name,true,this.$t('roleSF_roleNameRequired').toString(),false);
      callback(() => { });
    }
    callback();
  }

  // /**
  //  * 說明，，篩選條件，不可輸入符號。
  //  * @param rule 驗證規則 
  //  * @param value 說明輸入值 
  //  * @param callback 回乎函數，不帶參數表示驗證成功。
  //  * @returns 
  //  */
  // validateDesc(rule, value, callback) {
  //   this.descFeedback = true;
  //   this.descHover = "";
  //   this.stateDesc = "";
  //   this.descMsg = "";
  //   if (!validationUtil.isEmpty(value)) {
  //     if (!validationUtil.nameValidation(value)) {
  //       this.descHover = 'hover';
  //       this.stateDesc = 'error';
  //       this.descMsg = this.$t('roleSF_instructionNoSymbols').toString(); // 說明 不可輸入符號
  //       callback(() => { });
  //     } else {
  //       this.descFeedback = false;
  //     }
  //   }
  //   callback();
  // }

  /**
   * @description 角色異動送出驗證
   * @returns 
   * @version 2021/05/27
   * @author B1529
   */
  async validateSubmit() {

    let vaild = true;

    // 驗證角色編號
    this.validateRoleId(null, this.roleChangeForm.id, () => {
      if (this.roleSettingFormValidateObject.id.feedback) {
        vaild = false;
      }
    });

    if (!this.isEditing) {
      // 檢核『角色代號』不可重複
      await this.$roleApi.findAllRolesUsingGET().then(resp => {
        const findIds = resp.data.map(r => r.id).filter(i => i == this.roleChangeForm.id);
        const findNames = resp.data.map(r => r.roleName).filter(i => i == this.roleChangeForm.roleName);
        if (findIds && findIds.length > 0) {
          ErrorModalUtil.modalError(this.$t('roleSF_roleCodeNameNotRepeatable').toString())
          vaild = false;
        }
        if (findNames && findNames.length > 0) {
          ErrorModalUtil.modalError(this.$t('roleSF_roleNameNotRepeatable').toString())
          vaild = false;
        }
      });
    }

    // 驗證角色名稱
    this.validateName(null, this.roleChangeForm.roleName, () => {
      if (this.roleSettingFormValidateObject.name.feedback) {
        vaild = false;
      }
    });

    // // 驗證說明
    // this.validateDesc(null, this.roleChangeForm.roleDesc, () => {
    //   if (this.stateDesc == 'error') {
    //     vaild = false;
    //   }
    // });

    return vaild;
  }


  /**
   * 清除表單狀態(hover,feedback)
   * @returns 
   */
  clearForm() {
    CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.id,false,"",false);
    CommonUtil.feildValidateWithVisible(this.roleSettingFormValidateObject.name,false,"",false);

    // 清除異動角色的欄位資料
    this.roleChangeForm = {
      id: '',
      roleName: '',
      roleDesc: '',
      status: RoleChangeStatusEnum.Y,
    };

  }

  //========================共用驗證相關物件開始===================================

  //取得驗證feedback綁定的參數
  callCommonUtilFeildFeedback(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateFeedback(fv);
  }

  //取得驗證status綁定的參數
  callCommonUtilFeildStatus(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateStatus(fv);
  }

  //取得hover content綁定的參數
  callCommonUtilFeildMsg(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateHoverMsg(fv);
  }

  //取得hover trigger綁定的參數
  callCommonUtilFeildTrigger(fv: ValidateFormComponent){
    CommonUtil.getFeildVaildateTrigger(fv);
  }

  //取得hover hoverVisivle綁定的參數
  callCommonUtilFeildHoverVisible(fv: ValidateFormComponent){
    return CommonUtil.getFeildVaildateHoverVisible(fv);
  }

  //變更hover hoverVisivle參數
  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  //========================共用驗證相關物件結束===================================
}