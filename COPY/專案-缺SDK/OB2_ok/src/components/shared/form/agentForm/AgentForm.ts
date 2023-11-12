import CommonUtil from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { DivisionUsersDto, Option, UserAgentDto, UserAgentDtoIsAgentActivatedEnum, UserAgentDtoStatusEnum, UserDto, UserDtoStatusEnum } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { AgentValidateForm, AgnetEditForm } from "./model";
@Component
export default class AgentForm extends Vue {
  // 使用者列表單筆使用者資料點擊傳入
  @Prop()
  public initData: UserAgentDto;

  // 部門選項
  @Prop()
  public selectAgentDeptOptions: Option[];

  // 科別選項
  @Prop()
  public selectAgentDiviOptions: Option[];

  @Prop()
  public deptToDiviMap: Map<string, string[]>;

  @Prop()
  public diviToDeptMap: Map<string, string>;

  // 驗證欄位物件
  validate: AgentValidateForm = {
    agentDept: {
      hover: '',
      feedback: false,
      state: '',
      msg: ''
    },
    agentDivi: {
      hover: '',
      feedback: false,
      state: '',
      msg: ''
    },
    agentId: {
      hover: '',
      feedback: false,
      state: '',
      msg: ''
    }
  };

  // 科別、人員選項
  selectAgentDiviOptionsOnSelect: Option[] = [];
  selectAgentOptions: Option[] = [];

  // // 代理人科別和人員
  agentEditForm: AgnetEditForm = {
    agentDeptId: "",
    agentDiviId: "",
    agentId: "",
  }

  // 為vue-datepicker套件所自製的formatter
  formatter = this.$twDateFormatter;

  // 使用者欄位資料
  userAgentChangeForm: UserAgentDto = {
    agentId: "",
    createDate: "",
    createId: "",
    createName: "",
    isAgentActivated: UserAgentDtoIsAgentActivatedEnum.F,
    name: "",
    status: UserAgentDtoStatusEnum.N,
    unit: null,
    unitId: "",
    updateDate: "",
    updateId: "",
    updateName: "",
    userAgentDto: null,
    userId: "",
  };

  // 最後異動人員名稱
  updateName: string = '';

  // 各單位對應科員映射
  diviToUserMap = new Map<string, UserDto[]>();

  // 代理人設定單位標題
  unitNameTitle: string;

  get isEditing(): boolean {
    return this.initData.userId.length !== 0;
  }

  /**
   * 驗證代理人部門。
   * @param value 
   * @param callback 
   */
  validateAgentDept(value, callback) {
    this.validate.agentDept = {
      hover: '',
      feedback: true,
      state: '',
      msg: ''
    }

    if (ValidationUtil.isEmpty(value)) {
      this.validate.agentDept.hover = "hover";
      this.validate.agentDept.state = "error";
      // 代理人部門 不可為空值
      this.validate.agentDept.msg = this.$t('agentF_agentDepartmentNotNull').toString();
    } else {
      this.validate.agentDept.feedback = false;
    }
    if (callback && typeof callback === "function") {
      callback();
    }
  }

  // /**
  //  * 驗證代理人科別。
  //  * @param value 
  //  * @param callback 
  //  */
  // validateAgentDivi(value, callback) {
  //   this.validate.agentDivi = {
  //     hover: '',
  //     feedback: true,
  //     state: '',
  //     msg: ''
  //   }

  //   if (ValidationUtil.isEmpty(value) && !ValidationUtil.isEmpty(this.selectAgentDiviOptionsOnSelect)) {
  //     this.validate.agentDivi.hover = "hover";
  //     this.validate.agentDivi.state = "error";
  //     // 代理人科別 不可為空值
  //     this.validate.agentDivi.msg = this.$t('agentF_agentDivisionNotNull').toString();
  //   } else {
  //     this.validate.agentDivi.feedback = false;
  //   }
  //   if (callback && typeof callback === "function") {
  //     callback();
  //   }
  // }

  /**
   * 驗證代理人名稱。
   * @param value 
   * @param callback 
   */
  validateAgentId(value, callback) {
    this.validate.agentId = {
      hover: '',
      feedback: true,
      state: '',
      msg: ''
    }

    if (ValidationUtil.isEmpty(value)) {
      this.validate.agentId.hover = "hover";
      this.validate.agentId.state = "error";
      // 代理人 不可為空值
      this.validate.agentId.msg = this.$t('agentF_agentNotNull').toString();
    } else {
      this.validate.agentId.feedback = false;
    }
    if (callback && typeof callback === "function") {
      callback();
    }
  }

  /**
   * 科別會被限縮在所選的部門
   * @param value 
   * @param callback 
   */
  onAgentDeptSelect(value, callback) {
    this.agentEditForm.agentDiviId = "";
    this.agentEditForm.agentId = "";
    if (this.agentEditForm.agentDeptId) {
      this.renewAgentDiviOption();
      this.renewAgentOption();
    } else {
      this.selectAgentDiviOptionsOnSelect = [];
      this.selectAgentOptions = [];
    }
    this.validateAgentDept(value, callback);
  }

  /**
   * 代理人會被限縮在所選的科別
   * @param value 
   * @param callback 
   */
  onAgentDiviSelect(value, callback) {
    this.agentEditForm.agentId = "";
    if (this.agentEditForm.agentDiviId) {
      this.selectAgentOptions = [];
      this.agentEditForm.agentDeptId = this.diviToDeptMap.get(this.agentEditForm.agentDiviId);
      this.renewAgentOption();
    } else {
      this.selectAgentOptions = [];
    }
    // this.validateAgentDivi(value, callback);
  }

  /**
   * 更新代理人選項
   */
  renewAgentOption() {
    this.selectAgentOptions = [];
    let diviUserOption: Option[] = [];
    let diviUsers = this.diviToUserMap.get(this.agentEditForm.agentDiviId);
    if (!ValidationUtil.isEmpty(diviUsers)) {
      diviUsers.forEach(u => {
        diviUserOption.push({ label: u.name, value: u.userId });
      });
      this.selectAgentOptions = this.selectAgentOptions.concat(diviUserOption);
    } else {
      let deptUsers = this.diviToUserMap.get(this.agentEditForm.agentDeptId);
      if (!ValidationUtil.isEmpty(deptUsers)) {
        deptUsers.forEach(u => {
          diviUserOption.push({ label: u.name, value: u.userId });
        });
        this.selectAgentOptions = this.selectAgentOptions.concat(diviUserOption);
      }
    }
  }

  /**
   * 更新代理人科別選項
   */
  renewAgentDiviOption() {
    this.selectAgentDiviOptionsOnSelect = [];
    let selectedDivis = this.deptToDiviMap.get(this.agentEditForm.agentDeptId);
    if (!ValidationUtil.isEmpty(selectedDivis)) {
      let selectAgentDiviOptionsOnSelectList = this.selectAgentDiviOptions.filter(o => selectedDivis.includes(o.value));
      this.selectAgentDiviOptionsOnSelect = this.selectAgentDiviOptionsOnSelect.concat(selectAgentDiviOptionsOnSelectList);
    }
  }

  /**
  * 選擇人員時會禁止科別選單變動
  * @returns 
  */
  onAgentIdSelect(value, callback) {
    if (this.agentEditForm.agentDiviId) {
      this.validateAgentId(value, callback);
    }
  }

  /**
   * 頁面開啟
   * @returns 
   */
  created() {
    LoadingUtil.show();
    this.unitNameTitle = this.userAgentChangeForm.unit ?
      [this.userAgentChangeForm.unit.unitName.replace(" ", " - "), this.userAgentChangeForm.name].join(" - ") :
      this.userAgentChangeForm.name;
    this.$userApi.getDivisionUsersUsingGET(false).then((resp: AxiosResponse<DivisionUsersDto>) => {
      this.diviToUserMap = new Map(Object.entries(resp.data.diviToUserMap));
      this.reset();
    }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
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
  async reset(): Promise<void> {
    // this.nameFormOptions = JSON.parse(JSON.stringify(this.nameOptions))
    // 驗證欄位物件
    this.validate = {
      agentDept: {
        hover: '',
        feedback: false,
        state: '',
        msg: ''
      },
      agentDivi: {
        hover: '',
        feedback: false,
        state: '',
        msg: ''
      },
      agentId: {
        hover: '',
        feedback: false,
        state: '',
        msg: ''
      }
    };
    this.userAgentChangeForm = JSON.parse(JSON.stringify(this.initData));
    if (!this.userAgentChangeForm.userAgentDto) {
      // this.agentEditForm.agentDiviId = LoginModule.loginState.me.employee.departmentId
      // this.agentEditForm.agentDeptId = this.diviToDeptMap.get(LoginModule.loginState.me.employee.departmentId);
      // this.agentEditForm.agentDeptId = LoginModule.loginState.me.employee.unitIdLevel3;
      if (this.userAgentChangeForm.unit.unitLevel == "04") {
        this.agentEditForm.agentDeptId = this.userAgentChangeForm.unit.superiorUnitId;
        this.agentEditForm.agentDiviId = this.userAgentChangeForm.unit.unitId;
      } else if (this.userAgentChangeForm.unit.unitLevel == "03") {
        this.agentEditForm.agentDeptId = this.userAgentChangeForm.unit.unitId;
        this.agentEditForm.agentDiviId = "";
      }
      this.agentEditForm.agentId = "";
    } else {
      // 判斷代理人的單位是否指有部級
      if (this.deptToDiviMap.has(this.userAgentChangeForm.userAgentDto.unit.superiorUnitId)) {
        this.agentEditForm.agentDeptId = this.userAgentChangeForm.userAgentDto.unit.superiorUnitId;
        this.agentEditForm.agentDiviId = this.userAgentChangeForm.userAgentDto.unit.unitId;
      } else {
        this.agentEditForm.agentDeptId = this.userAgentChangeForm.userAgentDto.unit.unitId;
        this.agentEditForm.agentDiviId = "";
      }
      this.agentEditForm.agentId = this.userAgentChangeForm.userAgentDto.userId;
    }
    this.renewAgentDiviOption();
    this.renewAgentOption();

    this.userAgentChangeForm.updateDate = MomentUtil.transformRoc(this.userAgentChangeForm.updateDate);

  }

  /**
   * 使用者新增/編輯表單提交
   * @returns 
   */
  async onFormSubmit() {
    // 欄位驗證
    let vaildForField = true;
    // 驗證代理人部門
    this.validateAgentDept(this.agentEditForm.agentDeptId, () => {
      if (this.validate.agentDept.state == 'error') {
        vaildForField = false;
      }
    });
    // // 驗證代理人科別
    // this.validateAgentDivi(this.agentEditForm.agentDiviId, () => {
    //   if (this.validate.agentDivi.state == 'error') {
    //     vaildForField = false;
    //   }
    // });
    // 驗證代理人
    this.validateAgentId(this.agentEditForm.agentId, () => {
      if (this.validate.agentId.state == 'error') {
        vaildForField = false;
      }
    });

    // 業務邏輯驗證
    let validForBusiness = true;

    // 人員與代理人不可為同一人
    if (this.userAgentChangeForm.userId == this.agentEditForm.agentId) {
      ErrorModalUtil.modalError(this.$t('agentSP_staffAndAgentNotTheSame').toString());
      validForBusiness = false;
    }

    // 檢查代理人是否停用
    // let selectedAgent: UserDto;
    await this.$userApi.getUserUsingGET(this.agentEditForm.agentId).then((resp: AxiosResponse<UserDto>) => {
      // selectedAgent = resp.data;
      if (resp.data.status == UserDtoStatusEnum.N) {
        ErrorModalUtil.modalError(this.$t('agentF_agentIsDisable').toString());
        validForBusiness = false;
      }
    });

    let isAgentTaskEnough: boolean = false;
    await this.$agentApi.isAgentTaskEnoughUsingPOST(this.agentEditForm.agentId, this.userAgentChangeForm.userId)
      .then((resp: AxiosResponse<boolean>) => {
        isAgentTaskEnough = resp.data;
      });

    // 代理人技能不足
    // let selectedAgent: UserDto;
    // let isGettingUserStoStop: boolean = false;
    // const userDtosIterator = this.diviToUserMap.values();
    // while (!isGettingUserStoStop) {
    //   const nextUserDtos = userDtosIterator.next();
    //   isGettingUserStoStop = nextUserDtos.done;
    //   if (!isGettingUserStoStop) {
    //     (nextUserDtos.value as UserDto[]).forEach(u => {
    //       if (u.userId == this.agentEditForm.agentId) {
    //         selectedAgent = u;
    //       }
    //     });
    //   }
    // }

    // let agentSkillSet = new Set();
    // if (selectedAgent && selectedAgent.userSkills) {
    //   agentSkillSet = new Set(selectedAgent.userSkills.map((v, i, a) => v.userSkill));
    // }
    // let userSkillSet = new Set(this.userAgentChangeForm.userSkills);

    if (vaildForField && validForBusiness) {
      // if (!CommonUtil.isSuperset(agentSkillSet, userSkillSet)) {
      if (!isAgentTaskEnough) {
        Modal.confirm({
          okText: this.$t('global_ok').toString(),
          cancelText: this.$t('global_cancel').toString(),
          content: this.$t('agentF_agentSkillInsufficientConfirm').toString(),
          onOk: () => {
            this.saveConfirm();
          }
        });
      } else {
        // 儲存前確認
        this.saveConfirm();
      }
    }
  }

  /**
   * 儲存前確認，要同時滿足欄位驗證和業務邏輯驗證才會儲存
   * 
   * @param vaildForField 
   * @param validForBusiness 
   */
  saveConfirm() {
    Modal.confirm({
      okText: this.$t('global_ok').toString(),
      cancelText: this.$t('global_cancel').toString(),
      content: this.$t('agentF_confirmExecuteSave').toString(),
      onOk: () => {
        this.$agentApi.setAgentUsingPOST(this.agentEditForm.agentId, this.userAgentChangeForm.userId).then(() => {
          this.$emit("reloadData");
          MessageUtil.messageSuccess(this.$t('agentF_agentSaveSuccess').toString());
        });
      }
    });
  }
}