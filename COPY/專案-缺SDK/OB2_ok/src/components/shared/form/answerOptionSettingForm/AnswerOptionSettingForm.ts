import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Option, AnswerOptionDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import message from "@/assets/config/MessageUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { AxiosResponse } from "axios";

export interface AnswerOptionFormModel {
  answerTypeCode?: string;
  answerOptionId?: string;
  answerOption?: string;
  answerDesc?: string;
  answerEnable?: string;
  createId?: string;
  updateId?: string;
  createDate?: string;
  updateDate?: string;
}

@Component({ components: { FblLevelSelect } })
export default class AnswerOptionSettingForm extends Vue {

  //接收前頁傳入的值
  @Prop()
  public initData: AnswerOptionDto;

  @Prop()
  public loading: boolean;

  /** 答案選項類別下拉選單 */
  selectStatusOptions: Option[] = [];

  /** 欄位顯示/隱藏 */
  isHidden: boolean = false;

  /** 欄位檢核參數 */
  typeCodeValid = new validation();
  enableValid = new validation();
  optionIdValid = new validation();
  optionValid = new validation();

  form: AnswerOptionFormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    answerTypeCode:[{required: true, validator: this.validationAnswerTypeCode, trigger: "blur"}],
    answerEnable: [{ required: true, validator: this.validationAnswerEnable, trigger: "blur" }],
    answerOptionId: [{ required: true, validator: this.validationAnswerOptionId, trigger: "blur"}],
    answerOption: [{ required: true, validator: this.validationAnswerOption, trigger: "blur" }],
  };

  /** 取得目前狀態(修改/新增) */
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.answerOptionId;
  }

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created(): void {
    this.reset();
    this.$commonApi.findByTypeIdUsingGET("answerTypeCode")
      .then((res:AxiosResponse<Option[]>) => {
          this.selectStatusOptions = res.data;
      }).catch((err) => {
          console.log(err);
      });
  }

  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    //關閉答案類型提示窗
    this.isHidden = false;
    let answerTipDom = document.getElementById("answerTip");
    if( answerTipDom ){
      answerTipDom.innerHTML = "請先選擇答案選項類別";
    }

    //清除檢核訊息
    this.typeCodeValid.reset();
    this.enableValid.reset();
    this.optionIdValid.reset();
    this.optionValid.reset();

    if( this.isEditing ){
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.form.createDate = MomentUtil.transformRoc(this.initData.createDate);
      this.form.updateDate = MomentUtil.transformRoc(this.initData.updateDate);
    }else{
      this.form = {
        answerTypeCode:"",
        answerOptionId:"",
        answerOption:"",
        answerDesc:"",
        answerEnable:"0",//預設啟用:0
        createId:this.avatarText,
        updateId:this.avatarText,
        createDate:"",
        updateDate:"",
      };
    }
  }

  /** 表單送出(修改/新增) */
  public submit() {
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
        (this.isEditing)? this.updateAnswerOption():this.insertAnswerOption();
      },
    });
  }

  /** 修改答案選項設定 */
  updateAnswerOption() {
    this.form.updateId = this.avatarText;
    this.form.createDate = MomentUtil.transformRoc(this.form.createDate);//轉回西元年
    this.form.updateDate = MomentUtil.transformRoc(this.form.updateDate);//轉回西元年
    
    this.$answerOptionApi.doSaveUsingPUT("update", this.form as AnswerOptionDto)
      .then((resp) => {
        message.messageSuccess("儲存成功", true);
        this.$emit("formCallBack", false);//關閉視窗 並 更新列表
      })    
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
      });
  }

  /** 新增答案選項設定 */
  insertAnswerOption(){
    this.$answerOptionApi.doSaveUsingPUT("insert", this.form as AnswerOptionDto)
      .then((resp) => {
        if( resp.data == "100" as any ){
          ErrorModalUtil.modalError("答案選項代碼已存在");
          return;
        }
        message.messageSuccess("新增成功", true);
        this.$emit("formCallBack", false);//關閉視窗 並 更新列表
      })    
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
      });
  }

  /** 檢核所有欄位 */
  validateSubmit(){
    let vaild = true;

    this.validationAnswerTypeCode(null, this.form.answerTypeCode, () => {
      if(this.typeCodeValid.state == "error") vaild = false
    });

    this.validationAnswerEnable(null, this.form.answerEnable, () => {
      if(this.enableValid.state == "error") vaild = false
    });

    this.validationAnswerOptionId(null, this.form.answerOptionId, () => {
      if(this.optionIdValid.state == "error") vaild = false
    });

    this.validationAnswerOption(null, this.form.answerOption, () => {
      if(this.optionValid.state == "error") vaild = false
    });

    return vaild;
  }

  /** 檢核答案選項類別 - 為必填 */
  validationAnswerTypeCode(rule, value, callback){
    this.typeCodeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.typeCodeValid.msg = "請選擇答案選項類別";
    }

    if(this.form.answerOption != ""){
      this.validationAnswerOption(null, this.form.answerOption, () => {});
    }
    
    if(this.typeCodeValid.msg != ""){
      this.typeCodeValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核是否啟用 - 為必填 */
  validationAnswerEnable(rule, value, callback){
    this.enableValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.enableValid.msg = "請選擇是否啟用";
    }

    if(this.enableValid.msg != ""){
      this.enableValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核答案選項代碼 - 僅可輸入英數字 */
  validationAnswerOptionId(rule, value, callback){
    this.optionIdValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.optionIdValid.msg = "請輸入答案選項代碼";
    }else if( !validationUtil.answerOptionValidation(value) ){
      this.optionIdValid.msg = "答案選項代碼僅可輸入英數字";
    }

    if(this.optionIdValid.msg != ""){
      this.optionIdValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 
   * 檢核答案選項內容 - 參數格式
   * @value ATC01:單選, ATC02:複選, ATC03:子題, ATC04:母題, 
   *        ATC05:題組, ATC06:問答題單選, ATC07:問答題複選,
   *        ATC08:子題複選, ATC09:子題問答單選
   *        ATC10:子題問答複選, ATC11:母題問答單選
   */
  validationAnswerOption(rule, value, callback){
    this.optionValid.reset();

    let isError = false;

    //let itemsCount = (answerOptionTwoItems.includes(this.form.answerTypeCode))? 2:3;
    if( validationUtil.isEmpty(value) ){
      this.optionValid.msg = "請輸入答案選項";
    }else{
      //答案選項類別尚未選取
      if(this.form.answerTypeCode == ""){
        this.optionValid.msg = "答案選項類別尚未選取";
      } else{
        const answerOptionTwoItems = ["ATC01", "ATC02", "ATC03", "ATC05", "ATC08"];
        const answerOtionThreeItems = ["ATC04", "ATC06", "ATC07", "ATC09", "ATC10"];
        const answerOtionFourItems = ["ATC11"];
        //答案選項參數數量
        let itemsCount = 0;
        if(answerOptionTwoItems.includes(this.form.answerTypeCode)){
          itemsCount = 2;
        }else if(answerOtionThreeItems.includes(this.form.answerTypeCode)){
          itemsCount = 3;
        }else if(answerOtionFourItems.includes(this.form.answerTypeCode)){
          itemsCount = 4;
        }else{
          itemsCount = 2;
        }
        value.split(":").forEach(param => {
          let vals = param.split("-");
          if( vals.length != itemsCount ){
            isError = true;
          }else{
            vals.forEach(val => {
              if(val == "") isError = true;
            });
          }
        });
        if( isError ) this.optionValid.msg = "請確認答案選項格式是否正確";
      }
    }

    if(this.optionValid.msg != ""){
      this.optionValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 顯示/隱藏Tip訊息 */
  onAnswerTypeTipClick(){
    this.isHidden = !this.isHidden;
    this.onAnswerTypeChange(this.form.answerTypeCode, "");
  }
  
  /** 變更Tip訊息 */
  onAnswerTypeChange(value, title){
    let tipCont = ["<font class='tipEx'>是-Y:否-N:未答/拒答-R</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數",
                   
                   "<font class='tipEx'>是-Y-Y:否-N-N:未答/拒答-R-N</font><br>" +　
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數<br>" +　 
                   "參數3為決定點選後是否開啟子題<br>" + 
                   "『參數3』定義<br>" + 
                   "Y:開啟全部子題;N:不開啟子題;數字:開啟子題第○題",

                   "<font class='tipEx'>是-Y-N:否，繳費方式為-N-Y:未答/拒答-R-N</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數<br>" + 
                   "參數3為決定是否有輸入框資料",

                   "<font class='tipEx'>是-Y-N-Y:否，繳費方式為-N-Y-N:未答/拒答-R-N-1</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數<br>" + 
                   "參數3為決定是否有輸入框資料<br>" + 
                   "參數4為決定點選後是否開啟子題<br>" +
                   "『參數4』定義<br>" + 
                   "Y:開啟全部子題;N:不開啟子題;數字:開啟子題第○題",

                   "<font class='tipEx'>保障-1:房屋貸款-2:個人退休規劃-3:子女教育經費-4</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數",

                   "<font class='tipEx'>壽險/傷害/健康或年金保障需求-1:醫療保險需求-2:退休/養老規劃-3:為家人規劃醫療或意外保障-4</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數",

                   "<font class='tipEx'>保障-1-N:房屋貸款-2-N:個人退休規劃-3-N:子女教育經費-4-N:其他-5-Y:未答/拒答-R-N</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數<br>" + 
                   "參數3為決定是否有輸入框資料",

                   "<font class='tipEx'>是貸款或保單借款-N1-1:是終止契約(解約)-N2-2:兩者皆是-N3-3:兩者皆否-Y-N:未答/拒答-R-N</font><br>" + 
                   "【:】區隔答案的選項內容<br>" + 
                   "【-】區隔參數<br>" + 
                   "參數1為畫面呈現資訊<br>" + 
                   "參數2為背端參數<br>" + 
                   "參數3為決定點選後是否開啟子題<br>" +
                   "『參數3』定義<br>" + 
                   "Y:開啟全部子題;N:不開啟子題;數字:開啟子題第○題"

                  ];

    const answerOptionTwoItems = ["ATC01", "ATC03", "ATC05"];

    if( answerOptionTwoItems.includes(value) ){
      document.getElementById("answerTip").innerHTML = tipCont[0];
    }else if( value == "ATC04" ){
      document.getElementById("answerTip").innerHTML = tipCont[7];
    }else if( value == "ATC06" || value == "ATC09" ){
      document.getElementById("answerTip").innerHTML = tipCont[2];
    }else if( value == "ATC11" ){
      document.getElementById("answerTip").innerHTML = tipCont[3];
    } else if( value == "ATC02" ){
      document.getElementById("answerTip").innerHTML = tipCont[4];
    } else if( value == "ATC08" ){
      document.getElementById("answerTip").innerHTML = tipCont[5];
    } else if( value == "ATC10" || value == "ATC07" ){
      document.getElementById("answerTip").innerHTML = tipCont[6];
    }
  }
}