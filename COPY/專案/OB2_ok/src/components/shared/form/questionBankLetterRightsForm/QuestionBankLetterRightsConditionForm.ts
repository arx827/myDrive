import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Option, QuestionBankLetterRightConditionDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { LoginModule } from "@/plugins/store/LoginModule";
import { Modal } from "ant-design-vue";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import message from "@/assets/config/MessageUtil";
import MappingUtil from "@/assets/config/MappingUtil";
import MomentUtil from "@/assets/config/MomentUtil";

export interface questionBankLetterRightsFormModel {
  itemTitleCode: string;   //題目類型
  itemTypeCode: string;    //段落類型代碼
  itemCode: string;         //題目編號
  createId: string;         //建立人員
  createDate: string;       //建立日期
  updateId: string;         //最後異動人員
  updateDate: string;       //最後異動日期
  questConditionDtoList: Array<QuestionBankLetterRightConditionDto>; //題目條件設定檔
}

export interface questionBankLetterRightsConditionFormModel {
  itemCode: string;               //編號
  itemTypeCode: string;           //段落類型代碼
  itemSequence: string;           //條件順序
  itemConditionDesc: string;      //條件
  itemConditionExpress: string;   //條件運算式
  itemConditionColumn: string;    //條件欄位
  itemConditionPara: string;      //條件參數
  updateId: string;               //最後異動人員
  updateDate: string;             //最後異動日期
}

@Component({ components: { FblLevelSelect } })
export default class QuestionBankLetterRightsConditionForm extends Vue {

  @Prop()
  public initData: questionBankLetterRightsFormModel;

  @Prop()
  public loading: boolean;

  public isLoading: boolean = false;

  /** 條件清單 */
  conditionList: Array<questionBankLetterRightsConditionFormModel> = [];
  index: number = 0;

  form: questionBankLetterRightsFormModel = null;

  //下拉選單
  selectExpressOptions: Option[] = [];

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me) ? state.me.id : "";
  }

  created(): void {
    this.isLoading = this.loading;
    this.reset();
    //取得運算式下拉選單
    this.$commonApi.findByTypeIdUsingGET("questConditionExpress")
      .then((res: AxiosResponse<Option[]>) => {
        this.selectExpressOptions = res.data;
      }).catch((err) => {
        console.log(err);
      });
  }

  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    //清除已開啟條件物件，並開啟新增按鈕
    this.conditionList = [];
    this.index = 0;
    this.$emit("btnCallBack", true);

    //匯入基本form資料
    this.form = {
      itemCode: this.initData.itemCode,
      itemTitleCode: this.initData.itemTitleCode,
      itemTypeCode: this.initData.itemTypeCode,
      createId: this.initData.createId,
      updateId: this.initData.updateId,
      createDate: MomentUtil.transformRoc(this.initData.createDate),
      updateDate: MomentUtil.transformRoc(this.initData.updateDate),
      questConditionDtoList: []
    }

    //判斷是否已有設定資料
    this.isLoading = true;
    this.$questionBankLetterRightsApi.selectQuestItemConditionUsingPOST(this.initData)
      .then((resp) => {
        this.form.questConditionDtoList = resp.data;
        if (this.form.questConditionDtoList.length > 0) {
          //有值，塞入條件檔資料
          this.form.questConditionDtoList.forEach(data => {
            this.doAddObj(data);
          });
        } else {
          this.initForm();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });

  }

  /** 新增條件物件 */
  public doAddObj(data?) {
    let obj = {
      itemCode: "",
      itemSequence: (this.index++).toString(),
      itemConditionDesc: "",
      itemConditionExpress: "EQ",
      itemConditionColumn: "",
      itemConditionPara: "",
      updateId: this.avatarText
    }
    if (data) obj = JSON.parse(JSON.stringify(data));
    this.conditionList.push(obj as questionBankLetterRightsConditionFormModel);

    //關閉新增條件按鈕
    if (this.conditionList.length == 15)
      this.$emit("btnCallBack", false);
  }

  /** 刪除條件物件 */
  public doDelObj(data) {
    let index = this.conditionList.indexOf(data);
    this.conditionList.splice(index, 1);

    //開啟新增條件按鈕
    if (this.conditionList.length == 14)
      this.$emit("btnCallBack", true);
  }

  /** 匯入Excel */
  public doImport(data) {
    //檢核資料筆數
    if (data.length == 0) {
      ErrorModalUtil.modalError("匯入失敗：無輸入任何條件資料");
      return;
    } else if (data.length > 15) {
      ErrorModalUtil.modalError("匯入失敗：條件最多僅能設定十五組");
      return;
    }

    //清除已開啟條件物件，並開啟新增按鈕
    this.conditionList = [];
    this.index = 0;
    this.$emit("btnCallBack", true);

    //塞入Excel資料
    let i = 0;
    data.map(value => {
      let desc = (!value["條件"]) ? "" : value["條件"].toString().substring(0, 500);
      let express = (!value["運算式"]) ? "EQ" : MappingUtil.expressToCode(value["運算式"]);
      let column = (!value["條件欄位"]) ? "" : value["條件欄位"].toString().substring(0, 500);
      let para = (!value["條件參數"]) ? "" : value["條件參數"].toString().substring(0, 500);

      let obj = {
        itemCode: "",
        itemSequence: i++,
        itemConditionDesc: desc,
        itemConditionExpress: express,
        itemConditionColumn: column,
        itemConditionPara: para,
        updateId: this.avatarText
      }

      this.doAddObj(obj);
    });
  }

  /** 表單送出(修改/新增) */
  public doSubmit() {
    //欄位檢核
    if (!this.validateSubmit()) return;

    Modal.confirm({
      title: "",
      okText: "送出",
      cancelText: "取消",
      content: "確定要送出嗎?",
      centered: true,
      onOk: () => {
        this.updateQuestMain();
      },
    });
  }

  /** 修改問卷設定主檔 */
  updateQuestMain() {
    //移除空條件項目
    this.removeEmptyCondition();

    //將conditionList裡的資料補齊
    for (let condition in this.conditionList) {
      this.conditionList[condition].itemCode = this.form.itemCode;
      this.conditionList[condition].itemTypeCode = this.form.itemTypeCode;
    }

    this.form.questConditionDtoList = this.conditionList as Array<QuestionBankLetterRightConditionDto>;

    this.isLoading = true;
    this.$questionBankLetterRightsApi.updateQuestItemConditionUsingPOST(this.form.itemCode, this.form.itemTypeCode, this.form.questConditionDtoList)
      .then((resp) => {
        message.messageSuccess("儲存成功", true);
        this.$emit("formCallBack", false);//關閉視窗 並 更新列表
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /** 移除空條件(不儲存)、並重排SeqNo */
  removeEmptyCondition() {
    let delObj = [];
    this.conditionList.forEach(data => {
      if (data.itemConditionDesc.trim().length == 0) delObj.push(data);
    });
    delObj.forEach(data => { this.doDelObj(data); });

    this.conditionList.forEach((data, index) => {
      data.itemSequence = index.toString();
    });
  }

  /** 初始化Form */
  initForm() {
    //預設開啟五個條件物件
    for (var i = 0; i < 5; i++) {
      this.doAddObj();
    }
  }

  /** 檢核所有欄位 */
  validateSubmit() {
    let vaild = true;
    let errMsg = this.validationConditionList();

    if (errMsg != "") {
      vaild = false;
      ErrorModalUtil.modalError(errMsg);
    }
    return vaild;
  }

  /** 檢核條件細項 
   *  1.[條件]有值，[條件欄位]、[條件參數]為必填
   */
  validationConditionList(): string {
    let errMsg = "";
    let descVaild = false;

    //[條件]有值，[條件欄位]、[條件參數]為必填
    this.conditionList.forEach((data, index) => {
      if (data.itemConditionDesc.trim().length > 0) {
        let colMsg = "";
        if (data.itemConditionColumn.trim().length == 0) {
          colMsg = "條件欄位";
        }
        if (data.itemConditionPara.trim().length == 0) {
          colMsg += (colMsg != "") ? "、條件參數" : "條件參數";
        }
        if (colMsg != "") errMsg += "請輸入 條件" + (index + 1) + " 的" + colMsg + "資料\n";
        descVaild = true;
      }
    });

    return errMsg;
  }

}
