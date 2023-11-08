import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Option, QuestMainDto, QuestConditionDto } from "@fubonlife/obd-api-axios-sdk";
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

export interface questSettingFormModel {
  questCode: string;   //問卷代碼
  questName: string;   //問卷名稱
  taskId: string;      //電訪項目代碼
  questEnable: string; //是否啟用
  createId: string;    //建立人員
  createDate: string;  //建立日期
  updateId: string;    //最後異動人員
  updateDate: string;  //最後異動日期
  questConditionDtoList: Array<QuestConditionDto>; //問卷設定條件檔
}

export interface questSettingConditionModel {
  questCode: string;             //問卷代碼
  questSequence: string;         //條件順序
  questConditionDesc: string;    //條件
  questConditionExpress: string; //條件運算式
  questConditionColumn: string;  //條件欄位
  questConditionPara: string;    //條件參數
  updateId: string;              //最後異動人員
  updateDate: string;            //最後異動日期
}

@Component({ components: { FblLevelSelect } })
export default class QuestionnaireSettingMainForm extends Vue {

  @Prop()
  public initData: QuestMainDto;

  @Prop()
  public loading: boolean;
  
  /** 條件清單 */
  conditionList: Array<questSettingConditionModel> = [];
  index: number = 0;

  //欄位檢核參數
  taskIdValid = new validation();
  questCodeValid = new validation();
  questNameValid = new validation();

  form: questSettingFormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    taskId: [{required:true, validator:this.validationTaskId, trigger:"blur" }],
    questCode: [{required:true, validator:this.validationQuestCode, trigger:"blur" }],
    questName: [{required:true, validator:this.validationQuestName, trigger:"blur" }]
  };

  //下拉選單
  selectTaskIdNameShowOptions:Option[] = [];
  selectTaskIdNameOptions:Option[] = [];
  selectTaskIdNameAllOptions:Option[] = [];
  selectExpressOptions:Option[] = [];

  /** 取得目前狀態(修改/新增) */
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.taskId;
  }

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created(): void {
    this.reset();

    //取得電訪代碼 + 電訪名稱下拉選單 (未失效)
    this.$taskSettingApi.getTaskIdNameSelectedUsingGET("")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskIdNameOptions = res.data;
      this.setTaskIdNameOptions();
    }).catch((err) => {
      console.log(err);
    });

    //取得電訪代碼 + 電訪名稱下拉選單 (全部)
    this.$taskSettingApi.getTaskIdNameSelectedUsingGET("ALL")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskIdNameAllOptions = res.data;
      this.setTaskIdNameOptions();
    }).catch((err) => {
      console.log(err);
    });

    //取得運算式下拉選單
    this.$commonApi.findByTypeIdUsingGET("questConditionExpress")
    .then((res:AxiosResponse<Option[]>) => {
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
    //清除檢核訊息
    this.taskIdValid.reset();
    this.questCodeValid.reset();
    this.questNameValid.reset();

    //清除已開啟條件物件，並開啟新增按鈕
    this.conditionList = [];
    this.index = 0;
    this.$emit("btnCallBack", true);

    //設定電訪項目代碼-名稱 下拉選單
    this.setTaskIdNameOptions();

    if(this.isEditing){
      //塞入欄位資料
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.form.createDate = MomentUtil.transformRoc(this.initData.createDate);
      this.form.updateDate = MomentUtil.transformRoc(this.initData.updateDate);

      //塞入條件檔
      this.form.questConditionDtoList.forEach(data => {
        this.doAddObj(data);
      });
    } else {
      this.initForm();
    }
  }

  /** 新增條件物件 */
  public doAddObj(data?){
    let obj = {
      questCode: "",
      questSequence: (this.index++).toString(),
      questConditionDesc: "",
      questConditionExpress: "EQ",
      questConditionColumn: "",
      questConditionPara: "",
      updateId: this.avatarText
    }
    if( data ) obj = JSON.parse(JSON.stringify(data));
    this.conditionList.push( obj as questSettingConditionModel );

    //關閉新增條件按鈕
    if(this.conditionList.length == 15)
      this.$emit("btnCallBack", false);
  }
  
  /** 刪除條件物件 */
  public doDelObj(data){
    let index = this.conditionList.indexOf(data);
    this.conditionList.splice(index, 1);

    //開啟新增條件按鈕
    if(this.conditionList.length == 14)
      this.$emit("btnCallBack", true);
  }

  /** 匯入Excel */
  public doImport(data){
    //檢核資料筆數
    if(data.length == 0){
      ErrorModalUtil.modalError("匯入失敗：無輸入任何條件資料");
      return;
    }else if(data.length > 15){
      ErrorModalUtil.modalError("匯入失敗：條件最多僅能設定十五組");
      return;
    }
    
    //清除已開啟條件物件，並開啟新增按鈕
    this.conditionList = [];
    this.index = 0;
    this.$emit("btnCallBack", true);

    //塞入Excel資料
    let i = 0;
    data.map( value => {
      let desc    = (!value["條件"])?     "":value["條件"].toString().substring(0, 500);
      let express = (!value["運算式"])?   "EQ":MappingUtil.expressToCode(value["運算式"]);
      let column  = (!value["條件欄位"])? "":value["條件欄位"].toString().substring(0, 500);
      let para    = (!value["條件參數"])? "":value["條件參數"].toString().substring(0, 500);

      let obj = {
        questCode: "",
        questSequence: i++,
        questConditionDesc: desc,
        questConditionExpress: express,
        questConditionColumn: column,
        questConditionPara: para,
        updateId: this.avatarText
      }

      this.doAddObj(obj);
    });
  }

  /** 表單送出(修改/新增) */
  public doSubmit(){
    let typeMsg = (this.isEditing)? "修改":"新增";

    //欄位檢核
    if( !this.validateSubmit() ) return;

    Modal.confirm({
      title: typeMsg,
      okText: "送出",
      cancelText: "取消",
      content: "確定要送出嗎?",
      centered: true,
      onOk: () => {
        (this.isEditing)? this.updateQuestMain():this.insertQuestMain();
      },
    });
  }

  /** 修改問卷設定主檔 */
  updateQuestMain(){
    //移除空條件項目
    this.removeEmptyCondition();

    this.form.updateId = this.avatarText;
    this.form.createDate = MomentUtil.transformRoc(this.form.createDate);//轉回西元年
    this.form.updateDate = MomentUtil.transformRoc(this.form.updateDate);//轉回西元年
    this.form.questConditionDtoList = this.conditionList as Array<QuestConditionDto>;
    
    this.$questSettingApi.doSaveQuestSettingUsingPUT("update", this.form as QuestMainDto)
    .then((resp) => {
      message.messageSuccess("儲存成功", true);
      this.$emit("formCallBack", false);//關閉視窗 並 更新列表
    })    
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 新增問卷設定主檔 */
  insertQuestMain(){
    //移除空條件項目
    this.removeEmptyCondition();

    //塞入條件檔欄位
    this.form.questConditionDtoList = this.conditionList as Array<QuestConditionDto>;

    this.$questSettingApi.doSaveQuestSettingUsingPUT("insert", this.form as QuestMainDto)
    .then((resp) => {
      if( resp.data == "100" as any ){
        ErrorModalUtil.modalError("問卷代碼已存在");
        return;
      }
      message.messageSuccess("新增成功", true);
      this.$emit("formCallBack", false);//關閉視窗 並 更新列表
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 移除空條件(不儲存)、並重排SeqNo */
  removeEmptyCondition(){
    let delObj = [];
    this.conditionList.forEach( data => {
      if( data.questConditionDesc.trim().length == 0 ) delObj.push(data);
    });
    delObj.forEach( data => { this.doDelObj(data); } );

    this.conditionList.forEach( (data, index) => {
      data.questSequence = index.toString();
    });
  }

  /** 設定電訪項目代碼-名稱 下拉選單 */
  setTaskIdNameOptions(){
    if( this.isEditing )
      this.selectTaskIdNameShowOptions = this.selectTaskIdNameAllOptions;
    else 
      this.selectTaskIdNameShowOptions = this.selectTaskIdNameOptions;
  }

  /** 初始化Form */
  initForm(){
    //預設開啟五個條件物件
    for(var i = 0; i < 5; i++){
      this.doAddObj();
    }

    this.form = {
      questCode: "",
      questName: "",
      taskId: "",
      questEnable: "0",
      createId: this.avatarText,
      updateId: this.avatarText,
      createDate: "",
      updateDate: "",
      questConditionDtoList: []
    }
  }

  /** 檢核所有欄位 */
  validateSubmit(){
    let vaild = true;
    let errMsg = this.validationConditionList();

    this.validationTaskId(null, this.form.taskId, () => {
      if(this.taskIdValid.state == "error") vaild = false;
    });

    this.validationQuestCode(null, this.form.questCode, () => {
      if(this.questCodeValid.state == "error") vaild = false;
    });

    this.validationQuestName(null, this.form.questName, () => {
      if(this.questNameValid.state == "error") vaild = false;
    });

    if(errMsg != ""){
      vaild = false;
      ErrorModalUtil.modalError(errMsg);
    }
    
    return vaild;
  }

  /** 檢核電訪項目代碼 - 為必填、僅限英數字 */
  validationTaskId(rule, value, callback){
    this.taskIdValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.taskIdValid.msg = "請選擇電訪項目代碼-名稱";
    }

    if(this.taskIdValid.msg != ""){
      this.taskIdValid.setError();
      callback(() => { });
    }

    callback();
  }
  
  /** 檢核問卷代碼 - 為必填、僅限英數字 */
  validationQuestCode(rule, value, callback){
    this.questCodeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.questCodeValid.msg = "請輸入問卷代碼";
    }else if( !validationUtil.questCodeValidation(value) ){
      this.questCodeValid.msg = "問卷代碼僅可輸入英數字";
    }

    if(this.questCodeValid.msg != ""){
      this.questCodeValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核問卷名稱 - 為必填 */
  validationQuestName(rule, value, callback){
    this.questNameValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.questNameValid.msg = "請輸入問卷名稱";
    }

    if(this.questNameValid.msg != ""){
      this.questNameValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核條件細項 
   *  1.[條件]有值，[條件欄位]、[條件參數]為必填
   *  2.[條件]不可均無值
   */
  validationConditionList(): string{
    let errMsg = "";
    let descVaild = false;

    //[條件]有值，[條件欄位]、[條件參數]為必填
    this.conditionList.forEach( (data ,index) => {
      if(data.questConditionDesc.trim().length > 0){
        let colMsg = "";
        if(data.questConditionColumn.trim().length == 0){
          colMsg = "條件欄位";
        }
        if(data.questConditionPara.trim().length == 0){
          colMsg += (colMsg != "")? "、條件參數":"條件參數";
        }
        if(colMsg != "") errMsg += "請輸入 條件"+ (index + 1) +" 的" + colMsg + "資料\n";
        descVaild = true;
      }
    });

    //[條件]不可均無值
    // if(!descVaild) errMsg = "無輸入任何條件資料";

    return errMsg;
  }

}
