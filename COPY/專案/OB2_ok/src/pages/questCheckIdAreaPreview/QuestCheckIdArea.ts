import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestCheckIdAreaDto } from "@fubonlife/obd-api-axios-sdk";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { LoginModule } from "@/plugins/store/LoginModule";
import { Radio } from "ant-design-vue";
import { QuestAllData } from "../onDuty/model";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import validationUtil from "@/assets/config/ValidationUtil";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import MomentUtil from "@/assets/config/MomentUtil";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@Component({ components: { FblLevelSelect, Radio, RadioGroup, RadioButton } })
export default class QuestCheckIdArea extends Vue {

  @Prop()
  public checkIdAreaData: QuestCheckIdAreaDto; //核身區塊資料

  @Prop()
  public questAllData: QuestAllData; //問卷所有區塊資料

  /** 保戶回答歷程內容 */
  customerAnswer: string = "";
  
  /** 答案選項 */
  checkIdAnsOption: Array<object> = [];

  /** 取得 核身 答案選項狀態(開/關) */
  get isDisabled(): boolean {
    //開啟可點選條件：1.開場白答案為 同意(Y) 或 無選項, 2.核身答案未有不需核身選項
    let open    = (this.questAllData.answer.open == "Y" || this.questAllData.answer.open == null);
    let checkId = !this.checkIdAreaData.showNoNeedCheckBtn;
    return !(open && checkId);
  }

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  @Watch("checkIdAreaData")
  onContentSet() {
    this.reset();

    //組保戶回答歷程
    this.checkIdAreaData.questCustomerAnswerDto.forEach( (data) => {
      //時間秒數不顯示
      let createDate = MomentUtil.transformRoc(data.createDate);
      createDate = createDate.substring(0, createDate.length - 3);

      //塞入保戶回答內容
      this.customerAnswer += createDate + " {" + data.createId + data.createName + "}\n" + data.customerAnswerContent + "\n";
    });
    // this.customerAnswer = this.customerAnswer.substr(0, this.customerAnswer.length - 2);

    //回傳保戶回答歷程
    this.questAllData.custHisAnswer.checkId = this.customerAnswer;

    //產生答案選項
    if( this.checkIdAreaData.showNoNeedCheckBtn ){
      //顯示不需核身按鈕，並預設選取
      this.questAllData.answer.checkId = "N";
      this.checkIdAreaData.checkAnswerOption += ":不需核身-N";
    }
    this.checkIdAnsOption = this.setAnswerBtn("ATC01", this.checkIdAreaData.checkAnswerOption);
  }

  /** 核身按鈕點擊事件-因為預覽畫面故不需要功能 */ 
  onCheckIdBtnClick() {
    // let packNo = this.checkIdAreaData["packNo"];
    // let codingNo;
    // if( callUpInfoModule.callUpInfo == null ){
    //   codingNo = "";
    // }else if( validationUtil.isEmpty(callUpInfoModule.callUpInfo.codingNo) ){
    //   codingNo = "";
    // }else{
    //   codingNo = callUpInfoModule.callUpInfo.codingNo;
    // }

    // //檢核
    // // if( callUpInfoModule.callUpInfo == null ){
    // //   ErrorModalUtil.modalError( "尚未有撥打記錄" );
    // //   return;
    // // }else if( validationUtil.isEmpty(callUpInfoModule.callUpInfo.codingNo) ){
    // //   ErrorModalUtil.modalError( "尚未有撥打記錄" );
    // //   return;
    // // }

    // //取得 舊核身系統 url需帶參數
    // this.$questMainApi.getOldCheckIdParamsUsingGET(packNo, this.avatarText)
    // .then((resp) => {
    //   let data = resp.data;
    //   if(data.token == "null" || data.token == ""){
    //     ErrorModalUtil.modalError( data.msg );
    //   }else{
    //     //前往舊核身系統
    //     let url = data.url + "/CAMPWeb/RISKCamp/script/CampQuestMainOB2.aspx?";
    //     let params = "ID=" + this.avatarText + 
    //                  "&Token="  + data.token + 
    //                  "&SYS=OB2" + 
    //                  "&PACKNO=" + packNo + 
    //                  "&CUSTGROUP=" + data.custGroup + 
    //                  "&CodingNo="  + codingNo;

    //     window.open(url + params);
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
    // .finally(() => {
    // });
  }

  /** 核身答案點擊事件-因為預覽畫面故不需要功能 */
  onCheckIdAnsClick(value) {

    if( this.questAllData.answer.checkId != value){
      this.questAllData.commonData.questModify = "Y";
    }

    //核身不通過(F)、拒答(R)
    // if( value == "F" || value =="R" ){
    //   //畫面帶至共用結束語區塊
    //   window.location.href = "#commonEnd"; 
    // }
  }

  reset() {
    this.customerAnswer = "";
    this.checkIdAnsOption = [];
  }

  /** 設定答案選項 (answerTypeCode:選項類型, answerOption:選項) */
  setAnswerBtn(answerTypeCode, answerOption):Array<object> {
    let result = new Array<object>();

    //單選
    if(answerTypeCode == "ATC01"){
      let options = answerOption.split(":");
      for( let option of options ){
        let cont = option.split("-");
        result.push( {key:cont[1], cont:cont[0]} );
      }
    }

    return result;
  }
}