import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestionBankLetterRightDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { LoginModule } from "@/plugins/store/LoginModule";
import { Modal } from "ant-design-vue";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import message from "@/assets/config/MessageUtil";

export interface tQuestItemFormModel {
  itemCode?: string;      //題目編號
  itemTypeCode?: string   //段落類型
  itemContent?: string;   //內容
  itemEnable?: string;    //是否啟用
  answerTypeCode?: string;//答案類別代碼
  answerOptionId?: string;//答案選項代碼
  subItemSetting?: string;//是否有設定子題項
  updateReason?: string;  //修改原因
  createId?: string;      //建立人員
  updateId?: string;      //最後異動人員
  createDate?: string;    //建立日期
  updateDate?: string;    //最後異動日期
}

@Component({ components: { FblLevelSelect } })
export default class RecordingVoiceCloseSettingForm extends Vue {
  @Prop()
  public initData: QuestionBankLetterRightDto;

  @Prop()
  public loading: boolean;

  /** 控制答案選項可否編輯 */
  isAnswerOptionEdit: boolean = false;

  //下拉選單
  selectItemTypeOptions: Option[] = [];
  selectAnswerOptions: Option[] = [];

  //欄位檢核參數
  itemTypeValid = new validation();
  contentValid = new validation();
  enableValid = new validation();
  answerTypeValid = new validation();
  reasonValid = new validation();
  codeValid = new validation();

  form: tQuestItemFormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    itemTypeCode: [{required:true, validator:this.validationItemTypeCode, trigger:"blur" }],
    itemContent: [{required:true, validator:this.validationItemContent, trigger:"blur" }],
    answerTypeCode: [{required:true, validator:this.validationAnswerTypeCode, trigger:"blur"}],
    itemEnable: [{required:true, validator:this.validationItemEnable, trigger:"blur" }],
    updateReason: [{required:true, validator:this.validationReason, trigger:"blur"}],
    itemCode: [{required:true, validator:this.validationItemCode, trigger:"blur"}]
  };

  /** 取得目前狀態(修改/新增) */
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.itemCode;
  }

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created(): void {
    this.reset();

    //取得段落類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("itemTypeCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectItemTypeOptions = res.data.filter((element) => {return element.value != 'rightLetter'});
    }).catch((err) => {
      console.log(err);
    });
  }

  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  reset() {
    //關閉答案選項下拉
    this.isAnswerOptionEdit = false;

    //清除檢核訊息
    this.itemTypeValid.reset();
    this.contentValid.reset();
    this.enableValid.reset();
    this.answerTypeValid.reset();
    this.reasonValid.reset();
    this.codeValid.reset();

    if (this.isEditing) {
      //塞入欄位資料
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.form.createDate = MomentUtil.transformRoc(this.initData.createDate);
      this.form.updateDate = MomentUtil.transformRoc(this.initData.updateDate);
      this.form.updateReason = "";

      //修改時,修改原因為必填
      this.formRules.updateReason[0].required = true;

      this.onAnswerTypeChange("load");
    } else {
      this.form = {
        itemCode: "",
        itemTypeCode: "",
        itemContent: "",
        itemEnable: "0",//預設啟用
        answerTypeCode: "",
        answerOptionId: "",
        subItemSetting: "N",
        updateReason: "",
        createId: this.avatarText,
        updateId: this.avatarText,
        createDate: "",
        updateDate: ""
      };

      //新增時,修改原因不需必填
      this.formRules.updateReason[0].required = false;
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
        (this.isEditing)? this.updateQuestItem():this.insertQuestItem();
      },
    });
  }
  
  /** 修改話術設定 */
  updateQuestItem(){
    this.form.updateId = this.avatarText;
    this.form.createDate = MomentUtil.transformRoc(this.form.createDate);//轉回西元年
    this.form.updateDate = MomentUtil.transformRoc(this.form.updateDate);//轉回西元年

    this.$questionBankLetterRightsApi.doSaveTQuestItemUsingPUT("update", this.form as QuestionBankLetterRightDto)
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

  /** 新增話術設定 */
  insertQuestItem(){
    this.$questionBankLetterRightsApi.doSaveTQuestItemUsingPUT("insert", this.form as QuestionBankLetterRightDto)
    .then((resp) => {
      if( resp.data == "100" as any ){
        ErrorModalUtil.modalError("編號已存在");
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

  /** 答案類別下拉異動 or 開啟編輯窗
   * @value ATC01:單選, null:無選項
   * @value type => load:開啟編輯窗, 其他:答案類別下拉異動
   */
  onAnswerTypeChange(type: string){
    //清除先前選取資料
    if(type != "load"){
      this.form.answerOptionId = "";
    }

    if( this.form.answerTypeCode == "ATC01" ){
      this.isAnswerOptionEdit = true;
    }else if( this.form.answerTypeCode == "null" ){
      this.isAnswerOptionEdit = false;
    }

    //取得答案選項下拉選單
    if( this.isAnswerOptionEdit ){
      this.$answerOptionApi.getSelectByTypeCodeUsingGET(this.form.answerTypeCode)
      .then((resp) => {
        //顯示編號及內容
        for(let i in resp.data){
          resp.data[i].label = "[" +  resp.data[i].value + "] " +  resp.data[i].label;
        }
        this.selectAnswerOptions = resp.data;
        //預設帶入第一筆答案選項 並 紀錄選項中文
        if(resp.data != null && resp.data.length != 0 && type != "load"){
          this.form.answerOptionId = resp.data[0].value;
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  /** 檢核所有欄位 */
  validateSubmit(){
    let vaild = true;

    this.validationItemCode(null, this.form.itemCode, () => {
      if(this.codeValid.state == "error") vaild = false;
    });

    this.validationItemTypeCode(null, this.form.itemTypeCode, () => {
      if(this.itemTypeValid.state == "error") vaild = false;
    });

    this.validationItemContent(null, this.form.itemContent, () => {
      if(this.contentValid.state == "error") vaild = false;
    });

    this.validationItemEnable(null, this.form.itemEnable, () => {
      if(this.enableValid.state == "error") vaild = false;
    });

    this.validationAnswerTypeCode(null, this.form.answerTypeCode, () => {
      if(this.answerTypeValid.state == "error") vaild = false;
    });

    this.validationReason(null, this.form.updateReason, () => {
      if(this.reasonValid.state == "error") vaild = false;
    });

    return vaild;
  }

  /** 檢核題目編號 - 為必填 */
  validationItemCode(rule, value, callback){
    this.codeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.codeValid.msg = "請輸入題目編號";
    }else if( !validationUtil.itemCodeValidation(value) ){
      this.codeValid.msg = "題目編號僅可輸入英數字";
    }

    if(this.codeValid.msg != ""){
      this.codeValid.setError();
      callback(() => { });
    }

    callback();

  }

  /** 檢核段落類型 - 為必填 */
  validationItemTypeCode(rule, value, callback){
    this.itemTypeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.itemTypeValid.msg = "請選擇段落類型";
    }

    if(this.itemTypeValid.msg != ""){
      this.itemTypeValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核內容 - 為必填 */
  validationItemContent(rule, value, callback){
    this.contentValid.reset();

    if( validationUtil.isEmpty(value.trim()) ){
      this.contentValid.msg = "請輸入內容";
    }

    if(this.contentValid.msg != ""){
      this.contentValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核是否啟用 - 為必填 */
  validationItemEnable(rule, value, callback){
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

  /** 檢核答案類別 - 為必填 */
  validationAnswerTypeCode(rule, value, callback){
    this.answerTypeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.answerTypeValid.msg = "請選擇答案類別";
    }

    if(this.answerTypeValid.msg != ""){
      this.answerTypeValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核修改原因 - 修改狀態下為必填 */
  validationReason(rule, value, callback){
    if(!this.isEditing){ callback(); return; }

    this.reasonValid.reset();

    if( validationUtil.isEmpty(value.trim()) ){
      this.reasonValid.msg = "請輸入修改原因";
    }

    if(this.reasonValid.msg != ""){
      this.reasonValid.setError();
      callback(() => { });
    }

    callback();
  }
}