import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil from "@/assets/config/ValidationUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
// import { MenuDto, UrlResource } from "@fubonlife/obd-api-axios-sdk";
import { MenuDto } from "@fubonlife/obd-api-axios-sdk";
import { MenuFormDto } from "@/pages/menuSetting/models";
import { AxiosResponse } from "axios";

@Component
export default class MenuForm extends Vue {
  @Prop()
  public initData: MenuDto;

  // hover message
  menuIdHover: string = '';
  menuNameHover: string = '';
  resourceIdHover: string = '';
  parentMenuIdHover: string = '';
  sortSequenceHover: string = '';
  isLeafHover: string = '';
  enableHover: string = '';

  // validateMsg
  menuIdMsg: string = '';
  menuNameMsg: string = '';
  resourceIdMsg: string = '';
  parentMenuIdMsg: string = '';
  sortSequenceMsg: string = '';
  isLeafMsg: string = '';
  enableMsg: string = '';

  //feedback(錯誤時X圖案)
  menuIdFeedback: boolean = false;
  menuNameFeedback: boolean = false;
  resourceIdFeedback: boolean = false;
  parentMenuIdFeedback: boolean = false;
  sortSequenceFeedback: boolean = false;

  // form status(紅框)
  stateMenuId: string = '';
  stateMenuName: string = '';
  stateResourceId: string = '';
  stateParentMenuId: string = '';
  stateSortSequence: string = '';
  stateIsLeaf: string = '';
  stateEnable: string = '';

  menuChangeForm: MenuFormDto = {
    menuId: null,
    menuName: null,
    resourceId: "",
    parentMenuId: "",
    sortSequence: null,
    enable: '',
    isLeaf: '',
  };

  //功能代碼選項(下拉式清單用)
  selectResourceIdOptions = [];

  //父選單名稱/代碼選項(下拉式清單用)
  selectParentMenuIdOptions = [];

  //是否為子選單選項(下拉式清單用)
  selectLeafOptions = [
    // {
    //   value: '',
    //   label: this.$t('global_select').toString()
    // },
    {
      value: '1',
      label: this.$t('global_yes').toString() //是
    },
    {
      value: '0',
      label: this.$t('global_no').toString()  //否
    },
  ];

  //是否啟用選項(下拉式清單用)
  selectEnableOptions = [
    {
      value: '1',
      label: this.$t('global_effective').toString() //啟用
    },
    {
      value: '0',
      label: this.$t('global_deactivate').toString() //不啟用
    },
  ];

  // From 欄位條件篩選
  changeRules: { [key: string]: ValidationRule[] } = {
    menuId: [{ validator: this.validateMenuId, trigger: "blur" }],
    menuName: [{ validator: this.validateMenuName, trigger: "blur" }],
    resourceId: [{ validator: this.validateResourceId, trigger: "blur" }],
    parentMenuId: [{ validator: this.validateParentMenuId, trigger: "blur" }],
    sortSequence: [{ validator: this.validateSortSequence, trigger: "blur" }],
    isLeaf: [{ validator: this.validateIsLeaf, trigger: "blur" }],
    enable: [{ validator: this.validateEnable, trigger: "blur" }],
  };

  //判斷是否為編輯
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.menuId;
  }

  //建立表單
  created(): void {
    this.reset();
  }

  //若initData有異動則重設表單
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  //下拉式清單搜尋用(依input過濾顯示符合的清單)
  filterOption(input, option) {
    return (
      option.componentOptions.children[0].text.indexOf(input) >= 0
    );
  }

  //重設表單
  reset() {
    this.clearForm();
    // 父選單名稱/代碼下拉式清單中的資料來源
    this.selectParentMenuIdOptions = [{ label: '', value: '' }]; //請選擇
    this.$menuApi.findAllParentUsingGET()
      .then((res: AxiosResponse<MenuFormDto[]>) => {
        res.data.forEach(menu => this.selectParentMenuIdOptions.push(
          {
            label: menu.menuName,
            value: menu.menuId
          }
        ));
      })
      .catch((err) => {
        console.error(err);
      })
    // 功能名稱/代碼下拉式清單中的資料來源
    //this.selectResourceIdOptions = [{ label: this.$t('global_select').toString(), value: '' }]; //請選擇
    // this.$urlResourceApi.findAllUrlResourceUsingGET()
    //   .then((res: AxiosResponse<UrlResource[]>) => {
    //     res.data.forEach(urlResource => this.selectResourceIdOptions.push(
    //       {
    //         label: urlResource.resourceName,
    //         value: urlResource.resourceId
    //       }
    //     ));
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   })
    if (this.initData.menuName) {
      //若是編輯則將資料對應到各欄位
      this.menuChangeForm = {
        menuId: this.initData.menuId,
        menuName: this.initData.menuName,
        resourceId: this.initData.resourceId,
        sortSequence: this.initData.sortSequence,
        isLeaf: this.initData.isLeaf,
        enable: this.initData.enable,
        parentMenuId: this.initData.parentMenuId,
      };
    }
  }

  //清除表單狀態(hover,feedback)
  clearForm() {
    // hover message
    this.menuIdHover = '';
    this.menuNameHover = '';
    this.resourceIdHover = '';
    this.parentMenuIdHover = '';
    this.sortSequenceHover = '';
    this.isLeafHover = '';
    this.enableHover = '';

    // validateMsg
    this.menuIdMsg = '';
    this.menuNameMsg = '';
    this.resourceIdMsg = '';
    this.parentMenuIdMsg = '';
    this.sortSequenceMsg = '';
    this.isLeafMsg = '';
    this.enableMsg = '';

    //feedback(錯誤時X圖案)
    this.menuIdFeedback = false;
    this.menuNameFeedback = false;
    this.resourceIdFeedback = false;
    this.parentMenuIdFeedback = false;
    this.sortSequenceFeedback = false;

    // form status(紅框)
    this.stateMenuId = '';
    this.stateMenuName = '';
    this.stateResourceId = '';
    this.stateParentMenuId = '';
    this.stateSortSequence = '';
    this.stateIsLeaf = '';
    this.stateEnable = '';

    //清除表單欄位
    this.menuChangeForm = {
      menuId: null,
      menuName: null,
      resourceId: "",
      parentMenuId: "",
      sortSequence: null,
      enable: "",
      isLeaf: ""
    };
  }

  //送出表單
  async onFormSubmit() {
    //再次進行欄位驗證，判斷欄位是否合乎規定
    if (this.validateSubmit()) {
      //若欄位合乎規定，進行新增/編輯
      LoadingUtil.show();
      if (this.isEditing) {
        //編輯
        try {
          const resp = await this.$menuApi.modifyMenuUsingPUT(this.menuChangeForm.menuId,
            {
              menuName: this.menuChangeForm.menuName,
              resourceId: (this.menuChangeForm.resourceId == "") ? null : this.menuChangeForm.resourceId,
              parentMenuId: (this.menuChangeForm.parentMenuId == "") ? null : this.menuChangeForm.parentMenuId,
              sortSequence: this.menuChangeForm.sortSequence,
              isLeaf: (this.menuChangeForm.isLeaf == true) ? true : false,
              enable: (this.menuChangeForm.enable == true) ? true : false,
            }
          );
          LoadingUtil.close();
          MessageUtil.messageSuccess(`${resp.data.menuName}` + this.$t('global_editSuccess').toString()); //編輯成功
          this.$emit("reloadData");
        } catch (err) {
          console.error(err);
          MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('global_editFailure').toString() + ' '); //編輯失敗
        } finally {
          LoadingUtil.close();
        }
      } else {
        //新增
        try {
          const resp = await this.$menuApi.createMenuUsingPOST({
            menuId: this.menuChangeForm.menuId, menuName: this.menuChangeForm.menuName,
            resourceId: (this.menuChangeForm.resourceId == "") ? null : this.menuChangeForm.resourceId,
            parentMenuId: (this.menuChangeForm.parentMenuId == "") ? null : this.menuChangeForm.parentMenuId,
            sortSequence: this.menuChangeForm.sortSequence,
            isLeaf: (this.menuChangeForm.isLeaf == true) ? true : false,
            enable: (this.menuChangeForm.enable == true) ? true : false,
          })
          LoadingUtil.close();
          MessageUtil.messageSuccess(`${resp.data.menuName}` + this.$t('global_addSuccess').toString()); //新增成功
          this.$emit("reloadData");
        } catch (err) {
          console.error(err);
          MessageUtil.messageError(this.$t(err.response.data.apiErrorCode).toString() + "，" + this.$t('global_addtFailure').toString() + ' '); //新增失敗
        } finally {
          LoadingUtil.close();
        }
      }
    }
  }

  /**
   * 選單代碼，篩選條件，僅可輸入英數字與底線。
   * @param rule 驗證規則 
   * @param value 選單代碼輸入值 
   * @param callback 回乎函數，不帶參數表示驗證成功。
   * @returns 
   */
  validateMenuId(rule, value, callback) {
    this.menuIdFeedback = true;
    this.menuIdHover = '';
    this.stateMenuId = '';
    this.menuIdMsg = '';
    //若非空值，判斷是否符合規定
    if (value) {
      if (!validationUtil.idValidation(value)) {
        this.menuIdHover = 'hover';
        this.stateMenuId = 'error';
        this.menuIdMsg = this.$t('menuSP_menuCodeAlphanumericAndUnderscoresInputOnly').toString(); //僅可輸入英數字與底線(選單代碼僅可輸入英數字與底線)
        callback(() => { });
      } else {
        this.menuIdFeedback = false;
      }
    } else {
      this.stateMenuId = 'error';
      this.menuIdHover = 'hover';
      this.menuIdMsg = this.$t('menuSP_menuCodeRequired').toString(); //必填(選單代碼必塡)
      callback(() => { });
    }
    callback();
  }

  /**
  * 選單名稱，篩選條件，不可輸入符號。
  * @param rule 驗證規則 
  * @param value 選單名稱輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateMenuName(rule, value, callback) {
    this.menuNameFeedback = true;
    this.menuNameHover = '';
    this.stateMenuName = "";
    this.menuNameMsg = '';
    //若非空值，判斷是否符合規定
    if (value) {
      if (!validationUtil.nameValidation(value)) {
        this.menuNameHover = "hover";
        this.stateMenuName = "error";
        this.menuNameMsg = this.$t('menuSP_menuNameNoSymbols').toString(); //不可輸入符號(選單名稱不可輸入符號)
        callback(() => { });
      } else {
        this.menuNameFeedback = false;
      }
    } else {
      this.menuNameHover = "hover";
      this.stateMenuName = "error";
      this.menuNameMsg = this.$t('global_menu').toString() + this.$t('global_name').toString() + ' ' + this.$t('global_required').toString(); //必填
      callback(() => { });
    }
    callback();
  }

  /**
  * 功能代碼，篩選條件，僅可輸入英數字與底線。
  * @param rule 驗證規則 
  * @param value 功能代碼輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateResourceId(rule, value, callback) {
    this.resourceIdFeedback = true;
    this.resourceIdHover = '';
    this.stateResourceId = '';
    this.resourceIdMsg = '';
    //若非空值，判斷是否符合規定
    if (value) {
      if (!validationUtil.idValidation(value)) {
        this.resourceIdHover = 'hover';
        this.stateResourceId = 'error';
        this.resourceIdMsg = this.$t('menuF_functionCodeAlphanumericAndUnderscoresInputOnly').toString(); //僅可輸入英數字與底線(功能代碼僅可輸入英數字與底線)
        callback(() => { });
      } else {
        this.resourceIdFeedback = false;
      }
    } else {
      this.resourceIdFeedback = false;
      this.resourceIdHover = '';
      this.stateResourceId = '';
      this.resourceIdMsg = '';
    }
    callback();
  }

  /**
  * 父選單代碼，篩選條件，僅可輸入英數字與底線。
  * @param rule 驗證規則 
  * @param value 父選單代碼輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateParentMenuId(rule, value, callback) {
    this.parentMenuIdFeedback = true;
    this.parentMenuIdHover = '';
    this.stateParentMenuId = '';
    this.parentMenuIdMsg = '';
    //若非空值，判斷是否符合規定
    if (value) {
      if (!validationUtil.idValidation(value)) {
        this.parentMenuIdHover = 'hover';
        this.stateParentMenuId = 'error';
        this.parentMenuIdMsg = this.$t('menuF_parentMenuCodeAlphanumericAndUnderscoresInputOnly').toString(); //僅可輸入英數字與底線
        callback(() => { });
      } else {
        this.parentMenuIdFeedback = false;
      }
    } else if (this.menuChangeForm.isLeaf == true) {
      this.stateParentMenuId = 'error';
      this.parentMenuIdHover = 'hover';
      this.parentMenuIdMsg = this.$t('menuF_parentMenuCodeRequired').toString(); //必填(父選單代碼必填)
      callback(() => { });
    } else {
      this.parentMenuIdFeedback = false;
    }
    callback();
  }

  /**
  * 排列順序，篩選條件，僅可輸入數字。
  * @param rule 驗證規則 
  * @param value 排列順序輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateSortSequence(rule, value, callback) {
    this.sortSequenceFeedback = true;
    this.sortSequenceHover = '';
    this.stateSortSequence = '';
    this.sortSequenceMsg = '';
    //若非空值，判斷是否符合規定
    if (value != null) {
      if (value == 0 || validationUtil.extensionNoValidation(value)) {
        this.sortSequenceFeedback = false;
      } else {
        this.sortSequenceHover = 'hover';
        this.stateSortSequence = 'error';
        this.sortSequenceMsg = this.$t('menuF_arrangeOrderOnlyInputNumbers').toString(); //僅可輸入數字(排列順序 僅可輸入數字)
        callback(() => { });
      }
    } else {
      this.stateSortSequence = 'error';
      this.sortSequenceHover = 'hover';
      this.sortSequenceMsg = this.$t('menuF_arrangeOrderRequired').toString(); //必填(排列順序 必塡)
      callback(() => { });
    }
    callback();
  }

  /**
  * 是否為子選單，篩選條件，必填。
  * @param rule 驗證規則 
  * @param value 是否為子選單輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateIsLeaf(rule, value, callback) {
    this.isLeafHover = '';
    this.stateIsLeaf = '';
    this.isLeafMsg = '';

    if (validationUtil.isEmpty(value)) {
      this.stateIsLeaf = 'error';
      this.isLeafHover = 'hover';
      this.isLeafMsg = this.$t('menuSP_isLeafRequired').toString(); //必填
      callback(() => { });
    } else {
      this.isLeafHover = '';
      this.stateIsLeaf = '';
      this.isLeafMsg = '';
      callback();
    }
    callback();
  }

  /**
  * 是否啟用，篩選條件，必填。
  * @param rule 驗證規則 
  * @param value 是否啟用輸入值 
  * @param callback 回乎函數，不帶參數表示驗證成功。
  * @returns 
  */
  validateEnable(rule, value, callback) {
    this.enableHover = '';
    this.stateEnable = '';
    this.enableMsg = '';

    if (validationUtil.isEmpty(value)) {
      this.stateEnable = 'error';
      this.enableHover = 'hover';
      this.enableMsg = this.$t('menuF_whetherEnableRequired').toString(); //是否啟用 必填
      callback(() => { });
    }
    callback();
  }

  /**
   * @description 選單送出驗證
   * @returns 
   * @version 2021/05/31
   * @author X2546
   */
  validateSubmit() {

    let vaild = true;

    // 驗證選單代碼
    this.validateMenuId(null, this.menuChangeForm.menuId, () => {
      if (this.stateMenuId == 'error') {
        vaild = false;
      }
    });

    // 驗證選單名稱
    this.validateMenuName(null, this.menuChangeForm.menuName, () => {
      if (this.stateMenuName == 'error') {
        vaild = false;
      }
    });

    // 驗證功能代碼
    this.validateResourceId(null, this.menuChangeForm.resourceId, () => {
      if (this.stateResourceId == 'error') {
        vaild = false;
      }
    });

    // 驗證父選單代碼
    this.validateParentMenuId(null, this.menuChangeForm.parentMenuId, () => {
      if (this.stateParentMenuId == 'error') {
        vaild = false;
      }
    });

    // 驗證排列順序
    this.validateSortSequence(null, this.menuChangeForm.sortSequence, () => {
      if (this.stateSortSequence == 'error') {
        vaild = false;
      }
    });

    // 驗證是否為子選單
    this.validateIsLeaf(null, this.menuChangeForm.isLeaf, () => {
      if (this.stateIsLeaf == 'error') {
        vaild = false;
      }
    });

    // 驗證是否啟用
    this.validateEnable(null, this.menuChangeForm.enable, () => {
      if (this.stateEnable == 'error') {
        vaild = false;
      }
    });

    return vaild;
  }
}