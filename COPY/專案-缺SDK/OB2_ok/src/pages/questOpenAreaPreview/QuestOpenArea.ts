import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestOpenAreaDto } from "@fubonlife/obd-api-axios-sdk";
import { QuestAllData } from "../onDuty/model";
import MomentUtil from "@/assets/config/MomentUtil";

@Component({ components: {  } })
export default class QuestOpenArea extends Vue {

  @Prop()
  public openAreaData: QuestOpenAreaDto; //開場白區塊資料

  @Prop()
  public questAllData: QuestAllData; //問卷所有區塊資料

  /** 介面顯示資料 */
  form = {
    openCont: '',   //開場白內容
    consultCont: '' //徵詢事項內容
  }

  /** 答案按鈕 */
  openAnswerBtn: Array<object> = [];

  /** 保戶回答歷程內容 */
  customerAnswer: string = "";

  /** 提示訊息 */
  tipMsg: string = "稍後會提到您保單內容，電話過程會全程錄音，以保障您的權益";

  @Watch("openAreaData")
  onContentSet() {
    this.reset();

    //徵詢事項區塊資料
    const consultData = this.openAreaData.consultData;

    //塞入開場白、徵詢事項內容
    this.form.openCont = this.openAreaData.content;
    this.form.consultCont = consultData.content;

    //組保戶回答歷程
    this.openAreaData.questCustomerAnswerDto.forEach( (data) => {
      //時間秒數不顯示
      let createDate = MomentUtil.transformRoc(data.createDate);
      createDate = createDate.substring(0, createDate.length - 3);

      //塞入保戶回答內容
      this.customerAnswer += createDate + " {" + data.createId + data.createName + "}\n" + data.customerAnswerContent + "\n";
    });
    // this.customerAnswer = this.customerAnswer.substr(0, this.customerAnswer.length - 2);

    //回傳保戶回答歷程
    this.questAllData.custHisAnswer.open = this.customerAnswer;

    //產答案按鈕 及 是否預設選取答案
    let answer = (consultData.showAnswer && consultData.answer != null)? consultData.answer:"";
    this.openAnswerBtn = this.setAnswerBtn(consultData.answerTypeCode, consultData.answerOption, answer);
    this.questAllData.answer.open = answer;

    //如果沒有答案選項，答案回傳null
    let answerOptionId = consultData.answerOptionId;
    if( answerOptionId == null || answerOptionId == "" ) this.questAllData.answer.open = null;
  }

  reset() {
    //清除表單資料
    for(let key in this.form){
      this.form[key] = "";
    }

    this.customerAnswer = "";
    this.openAnswerBtn = [];
  }

  /** 設定答案選項 (answerTypeCode:選項類型, answerOption:選項, answer:預設選取的答案) */
  setAnswerBtn(answerTypeCode, answerOption, answer):Array<object> {
    let result = new Array<object>();

    //單選
    if(answerTypeCode == "ATC01"){
      let options = answerOption.split(":");
      for( let option of options ){
        let cont = option.split("-");
        let className = (answer == cont[1])? "selected":"default";
        result.push( {key:cont[1], cont:cont[0], class:className} );
      }
    }

    return result;
  }

  /** 答案按鈕點擊事件--因為預覽功能故不需要 */
  clickOpenAnswer(index, value) {

    if( this.questAllData.answer.open != value){
      this.questAllData.commonData.questModify = "Y";
    }

    //還原所有按鈕
    this.openAnswerBtn.forEach( btn => { btn["class"] = "default"; } );

    //選取此次點選按鈕
    this.openAnswerBtn[index]["class"] = "selected";    

    if(value == 'Y'){
      //收合開場白區塊
      //console.log(this.$parent);
      //(this.$parent.$refs.headerOpen as any).$refs.collapse.click();  //表示訪問當前元件的父元件($parent)的引用對象($refs)
    }else{
      //畫面帶至共用結束語區塊
      //window.location.href = "#commonEnd";
    }

    //回傳點擊答案
    this.questAllData.answer.open = value;
  }
}