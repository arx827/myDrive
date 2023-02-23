import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestAreaDto, QuestEndDto, TeleResultConfigCond, QuestTelDto, ContactAgentDtoMplusQualifiedEnum } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { QuestAllData } from "../onDuty/model";
import { Radio, Modal } from "ant-design-vue";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import CustomerAnswer from "@/components/shared/customerAnswer/CustomerAnswer.vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import validationUtil from "@/assets/config/ValidationUtil";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { default as LoadingUtil } from "@/assets/config/LoadingUtil";
import QuestTelChange from "@/pages/questArea/QuestTelChange.vue";
import { Option } from "@fubonlife/obd-api-axios-sdk";
// import { EventBus } from "@/pages/questArea/eventBus";


const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

/** 答案選項物件資料 */
export interface optionItem {
  type: string,    //選項類型(radio、checkbox)
  value: string,   //選項值
  cont: string,    //選項內容
  answer: boolean, //是否預設選取此項答案
  subShow: string  //是否顯示子題項(Y:全顯示, N:全不顯示, 1,2:顯示1、2題)
  input: boolean,  //是否顯示input物件
  inputAnswer: string, //問答題答案內容
  questIndex: number   //題目List中的index
}

@Component({ components: { FblLevelSelect, Radio, RadioGroup, RadioButton, CustomerAnswer, QuestTelChange } })
export default class QuestArea extends Vue {

  @Prop()
  public questAreaData:QuestAreaDto; //問卷區塊資料

  @Prop()
  public endData:QuestEndDto; //結束語區塊資料

  @Prop()
  public questAllData: QuestAllData; //問卷所有區塊資料


  /** 答案選項對應類型 */
  radio: Array<string>    = ["ATC01", "ATC03", "ATC04", "ATC05", "ATC06", "ATC09", "ATC11"];
  checkbox: Array<string> = ["ATC02", "ATC07", "ATC08", "ATC10"];
  input: Array<string>    = ["ATC06", "ATC07", "ATC09", "ATC10", "ATC11"];

  /** 關鍵字提示訊息 */
  keyWordTip = [
    {
      keyWord: "您知道收到保單的隔天起算10天內，可以書面連同保單提出撤銷契約的權益？",
      tipMsg: "請向保戶說明保單有10日撤銷契約的權益",
      itemCode: [] //符合關鍵字的題目
    }
  ]

  /** 問卷資料 */
  form = {
    caseNo: "", //現在caseNo頁面
    errTip: "", //錯誤提示訊息
    questTabKey: "0",    //目前問卷頁籤Tab選取頁面
    closeCase: false,    //是否結案
    reSendLetter: false, //是否需重寄信函
    reSendType: "",      //重寄信函方式
    reSendAddr: "",      //重寄信函地址
    reSendOriAddr: "",   //郵寄原址
    questPolicyDto: [],  //保單資料
    questContDto: {},    //題目資料
    questEndAreaDto: {}, //問卷結束語
    
    poliycNo: "",       //保單號
    executeTime: "",    //執行時機
    businessType: "",   //業務別

    coreSystemCode: "", //主機代碼
    closeReasonCode: "", //結案原因代碼

    callOutResult: "", //電訪結果(下拉選單)
    closeReasonCodeCase:"", //結案原因(下拉選單)

    isCancelPlayRecord:"" //是否取消語音撥發

  }

  /** 電話變更作業資料 */
  changeCase = {
    packNo: "", //簽合電話變更的packNo
    caseNo: "", //符合電話變更的案件號
    reviewNo: "", //作業單號
    isReSend: false
  }

  questTelDto: QuestTelDto = {};

  /** 目前問卷選項答案列表(單選) _ FormModel _ {itemCode:答案值} */
  radioAns = {};
  /** 目前問卷選項答案列表(複選) _ FormModel _ {itemCode:[答案值]}*/
  checkboxAns = {};
  /** 目前問卷選項備註列表 _ FormModel _ {itemCode:{答案值:備註}} */
  inputAns = {};
  /** 答案值對應的中文 _ {itemCode:{答案值:選項中文}} */
  inputOption = {};

  /** 母題題號在所有題目中對應的index位置 */
  parentKeyToIndex = {}; //{母題號:對應的index位置}

  /** 母題包含的子題數量 */
  parentSubCount = {}; //{母題號:子題數量}

  /** 預設需開啟的子題 */
  defaultShowSub = {}; //{母題號:開啟的子題(Y:全顯示, N:全不顯示, 1,2:顯示1、2題)}

  /** Q&A提示窗是否顯示 */
  popoverShow = {};//{itemCode:boolean}

  /** 是否有答案選取「否」或「不確定」 */
  questAnswerN = {}; //{caseNo:boolean}

  /** 答案需共同選取清單 */
  sameAnsList = {}; //{caseNo:{itemCode:[{caseNo, itemCode}])}

  /** 符合題組(ATC05)類型的母題，及包含的子題 */
  groupQuestList = {}; //{caseNo:{母題題號parentKey:{母itemCode, [子題itemCode]}}}

  /** 保單區塊是否皆為Y */
  policyAnsY:boolean = false;
  
  /** 是否符合電話變更作業 */
  isChangeWork:boolean = false;
  
  //未使用
  /** 答案按鈕_保單資料區 */
  policyAllOption = {};//key:itemCode, value:Array<optionItem>
  policyAnswerOption: Array<optionItem> = [];

  //未使用
  /** 答案按鈕_問卷區 */
  questAllOption = {};//key:itemCode, value:Array<optionItem>
  questAnswerOption: Array<optionItem> = [];

  /** 取得取件後拿到的預設取件資訊*/
  defaultPickupResult = PackMatchModule.pickupResult;

  /** 取得風控因子列表*/
  defaultRiskCTRLItem = [];

  /** 取得客戶群組 */
  defaultCustLevel = "";

  /** 取得契約狀態 */
  defaultContract = "";

  /** 下拉選單 */
  selectCallOutResultOptions:Option[] = [];
  selectCloseReasonCodeCaseOptions:Option[] = [];

  //** 送給電訪結果區的資料 */
  callOutResultData = {};

  // 電話變更作業 loading狀態
  telChangeLoading: boolean = true;
  
  /** 取得 保單資料 答案選項狀態(開/關) */
  get policyDisaled(): boolean {
    //開啟可點選條件：1.開場白答案為 同意(Y) 或 無選項, 2.核身答案為 通過(Y) 或 不需核身(N), 3.該案件未結案
    let passAnswer = ["Y", "N"];
    let open    = (this.questAllData.answer.open == "Y" || this.questAllData.answer.open == null);
    let checkId = (passAnswer.includes(this.questAllData.answer.checkId));
    let result  = (open && checkId && !this.form.closeCase);

    //設定語音宣告按鈕(開/關)
    this.setPlayRecordDisabled(result);

    return !result;
  }

  /** 取得 問卷題目 答案選項狀態(開/關) */
  get questDisabled(): boolean { 
    //開啟可點選條件：1.開場白答案為 同意(Y) 或 無選項, 2.核身答案為 通過(Y) 或 不需核身(N), 3.該案件未結案
    //　　　　　　　　4.保單 無資料 或 皆無選項 或 有選項題目皆為(Y) 5.問卷有問卷代碼時

    //條件1, 2, 3直接使用policyDisaled的判斷結果
    let openAndCheckId = !this.policyDisaled;

    //條件4 判斷是否policy全部題目選項 如都選為Y 才可以開啟問卷題目
    this.policyAnsY = this.getPolicyAnswerY();

    //條件5 判斷是否有問卷代碼(因第一次進來時無值，要判斷掉)
    if( typeof this.questAreaData.questDto == "undefined" ){
      return !(openAndCheckId && this.policyAnsY);
    } else {
      let questData = this.questAreaData.questDto[this.form.questTabKey];
      return !(openAndCheckId && this.policyAnsY && questData.questCode != null);
    }
    
  }

  /** 取得 電話變更作業 狀態(開/關) */
  get changeWorkDisaled(): boolean {
    let result = !(this.isChangeWork && this.questAllData.answer.checkId=="Y");

    //開關區塊Title星號提示
    this.$set(this.questAreaData, "isChangeWork", !result);

    //如關閉時頁籤在電話變更作業，自動切頁回第一頁 
    if( result && this.form.questTabKey == "changeWork" ){
      this.onTabChange("0");
      this.form.questTabKey = "0";
    }

    if(!result){
      //曾符合過電話變更作業的時候，就寫一筆資料到電話變更作業主檔
      this.questTelDto = {};
      this.questTelDto.packNoGuid = PackMatchModule.pickupResult.firstCasePack.packLogNo;
      this.questTelDto.packNo = this.changeCase.packNo;
      this.questTelDto.caseNo = this.changeCase.caseNo;
      LoadingUtil.show();
      this.$questMainApi.doSaveTelChangeStatusIsNUsingPOST(this.questTelDto)
        .then((resp) => {
          console.log("電話變更切始化資料存檔成功");
        })
        .catch((err) => {
          console.log(err);
          LoadingUtil.close();
          ErrorModalUtil.modalError("系統發生錯誤，請聯絡系統管理員處理(電話變更作業初始化資料存檔失敗)");
          return;
        })
        .finally(() => { LoadingUtil.close() });
    }

    return result;
  }

  /** 取得 重寄信函改寄地址 狀態(開/關) */
  get reSendLetterDisabled(): boolean {
    //開啟可點選條件：1.開場白答案為 同意(Y) 或 無選項, 2.核身答案為 通過(Y) 或 不需核身(N), 3.語音宣告保單資料區點選同意(Y)
    let passAnswer = ["Y", "N"];
    let open    = (this.questAllData.answer.open == "Y" || this.questAllData.answer.open == null);
    let checkId = (passAnswer.includes(this.questAllData.answer.checkId));
    this.policyAnsY = this.getPolicyAnswerY();
    if(!(open && checkId && this.policyAnsY)){
      if(this.form.reSendType == "1"){
        this.form.reSendType = "";
        this.form.reSendAddr = "";
        this.questAllData.answer.reSendLetter[this.form.caseNo].type = "";
        this.questAllData.answer.reSendLetter[this.form.caseNo].addr = "";
      }
    }

    return !(open && checkId && this.policyAnsY);
  }

  @Watch("questAreaData")
  onContentSet() {
    this.questAnswerN = {};
    this.sameAnsList = {};
    this.groupQuestList = {};
    this.isChangeWork = false;
    this.resetQuest();

    if( validationUtil.isEmpty(this.questAreaData.questDto) )
      return;

    //預設選取第一筆問卷
    this.onTabChange("0");
    this.form.questTabKey = "0";

    //取得是否符合電話變更作業
    //符合條件：1.受訪者為要保人 2.為新契約承保後，且服務人員為業務通路或服展通路 3.該受訪者ID不可有簽核中電話變更作業
    for(let data of this.questAreaData.questDto){
      //matchEdit=true 包含符合1, 2項
      if(!data.matchEdit) continue;

      this.getChangeCaseCount(data.caseNo, (count) => {
        //符合第3項，只取第一筆caseNo(所以加上this.isChangeWork判斷)
        if(count==0 && !this.isChangeWork){
          this.changeCase.packNo = this.defaultPickupResult.firstCasePack.packNo;
          this.changeCase.caseNo = data.caseNo;
          this.isChangeWork = true;
        }
      });
    }
    
    for(let data of this.questAreaData.questDto){
      //1. 判斷所有問卷是否有先前儲存答案包含「否」或「不確定」
      this.$set( this.questAnswerN, data.caseNo, this.getQuestAnswerN("", data.questContDto) );

      //2. 判斷是否為題組(ATC05)及他包含的子題
      this.groupQuestList[data.caseNo] = {};
      for(let quest of data.questContDto){
        if(quest.questSubNumber == "0" && quest.answerTypeCode == "ATC05"){
          //母題
          this.groupQuestList[data.caseNo][quest.questNumber] = {itemCode:quest.itemCode, subItemCode:[]};
        }else if(quest.questSubNumber != "0" && !validationUtil.isEmpty(this.groupQuestList[data.caseNo][quest.questNumber])){
          //子題
          this.groupQuestList[data.caseNo][quest.questNumber].subItemCode.push(quest.itemCode);
        }
      }

      //3. 產出答案需共同選取清單(條件:1.相同業務別 2.相同保單號 3.相同題目內容 4.有相同的答案選項編號)
      this.sameAnsList[data.caseNo] = {};
      for(let quest of data.questContDto){
        this.sameAnsList[data.caseNo][quest.itemCode] = [];

        for(let compareData of this.questAreaData.questDto){
          if(data.caseNo == compareData.caseNo) continue;
          //3-1.需相同業務別 3-2.需相同保單號
          if(data.businessType != compareData.businessType) continue;
          if(data.policyNo != compareData.policyNo) continue;

          for(let compareQuest of compareData.questContDto){
            //3-3.相同題目內容
            if(quest.content == compareQuest.content){
              //3-4.有相同的答案選項編號
              if(quest.answerOptionId == compareQuest.answerOptionId){
                this.sameAnsList[data.caseNo][quest.itemCode].push({caseNo:compareData.caseNo, itemCode:compareQuest.itemCode, questNumber:compareQuest.questNumber});
              }
            }
          }
        }
      }
    }

    console.log("內容~~~~");
    console.log( this.sameAnsList );
    console.log( this.groupQuestList );
    console.log( this.questAreaData );
    console.log( this.endData );

  }

  /** 頁籤切換 */
  onTabChange(key) {
    console.log(key);
    if(key == "changeWork"){
      this.telChangeLoading = false;
      return;
    }

    let questData = this.questAreaData.questDto[key];

    this.form.caseNo = questData.caseNo;

    this.getChangeCaseCount(this.form.caseNo, (count) => {
      if(count > 0){
        this.isChangeWork = false;
      }
    });
    
    if(questData.questCode == null && questData.overTwoQuestMessage == null){
      this.resetQuest();

      //出現提示錯誤訊息
      this.form.errTip = "案件資料無法比對到問卷，案件編號：" + questData.caseNo;
    }else if(questData.questCode == null && questData.overTwoQuestMessage != null){
      this.resetQuest();

      //出現提示錯誤訊息
      this.form.errTip = "案件資料比對到多份問卷，案件編號：" + questData.caseNo+"，比對到的問卷編號：" + questData.overTwoQuestMessage;
    }else{
      this.form.errTip = "";
      this.form.closeCase = questData.closeCase;
      this.form.questContDto = questData.questContDto;
      this.form.questPolicyDto = questData.questPolicyDto;
      this.form.questEndAreaDto = questData.questEndAreaDto;

      this.form.poliycNo = questData.policyNo;
      this.form.executeTime = questData.executeTime;
      this.form.businessType = questData.businessType;

      this.form.coreSystemCode = questData.coreSystemCode;
      this.form.closeReasonCode = questData.closeReasonCode;
      
      this.parentSubCount = {};
      this.parentKeyToIndex = {};
      this.defaultShowSub = {};

      this.defaultRiskCTRLItem = [];
      LoadingUtil.show();
      this.$questMainApi.getRiskDataUsingGET(this.form.caseNo)
        .then((resp) => {
          this.defaultRiskCTRLItem = resp.data;
        })
        .catch((err) => {
          console.log(err);
          ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(getRiskDataUsingGET error)" );
          return;
        })
        .finally(() => LoadingUtil.close());

      this.defaultCustLevel = "";
      LoadingUtil.show();
      this.$questMainApi.selectCustLevelDataUsingGET(this.form.caseNo)
        .then((resp) => {
          this.defaultCustLevel = resp.data;
        })
        .catch((err) => {
          console.log(err);
          ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(getRiskDataUsingGET error)" );
          return;
        })
        .finally(() => LoadingUtil.close());

      this.defaultContract = "";
      LoadingUtil.show();
      this.$questMainApi.selectContractDataUsingGET(this.form.caseNo)
        .then((resp) => {
          this.defaultContract = resp.data;
        })
        .catch((err) => {
          console.log(err);
          ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(getRiskDataUsingGET error)" );
          return;
        })
        .finally(() => LoadingUtil.close());
      
      //清空符合關鍵字題目
      for(let i in this.keyWordTip)
        this.keyWordTip[i].itemCode = [];

      //保單資料區
      let policyIndex = 0;
      questData.questPolicyDto.forEach( (pData) => {
        //塞入答案、產答案選項
        let answer = this.questAllData.answer.policy[this.form.caseNo][pData.itemCode];
        if( answer == "" && pData.answer != null ){
          answer = pData.answer;
          this.questAllData.answer.policy[this.form.caseNo][pData.itemCode] = pData.answer;
        }
        pData["answerOptions"] = this.setAnswerBtn( pData.answerTypeCode, pData.answerOption, answer, policyIndex );

        //是否已聽取語音宣告，如已有選答案或不需聽取直接為true(第一次開啟時預設就好)
        if( typeof pData["isPlayRecord"] == "undefined" ){
          pData["isPlayRecord"] = (!pData.showPlayRecord || answer != "");
        }

        //產出語音宣告按鈕
        let playRecordBtn = "<button id='playRecord"+ policyIndex +"' name='btnPlayRecord' class='ant-btn recordBtn' disabled>聽取語音宣告</button> <input type='checkbox' id='cancelPlayRecord' name='cancelPlayRecord' style=width:15px;height:15px;vertical-align:middle>取消播放語音宣告<br>";
        pData.content = pData.content.replace("<#語音宣告按鈕>", playRecordBtn);

        policyIndex++;
      });

      //加上語音宣告按鈕點擊事件，並設定disabled
      this.$nextTick( () => {
        if( !validationUtil.isEmpty(this.$refs.policyRef) ){
          (this.$refs.policyRef as any).forEach( (policy) => {
            for(let child of policy.children){
              if( child.nodeName == "BUTTON" ){
                child.addEventListener("click", this.clickPlayRecord);
              }
              if( child.nodeName == "INPUT" ){
                child.addEventListener("click", this.cancelPlayRecord);
              }
            }
          });
        }

        //設定語音宣告按鈕(開/關)
        this.setPlayRecordDisabled(!this.policyDisaled);
      });

      //問卷區及每題的保戶回答、答案選項
      let questIndex = 0;
      questData.questContDto.forEach( (qData) => {
        //塞入符合關鍵字的題目
        for( let i in this.keyWordTip ){
          if( qData.content == this.keyWordTip[i].keyWord ) {
            this.keyWordTip[i].itemCode.push(qData.itemCode);
          }
        }

        //組保戶回答歷程
        qData["customerAnswer"] = "";
        qData.questCustomerAnswerDto.forEach( (data) => {
          //時間秒數不顯示
          let createDate = MomentUtil.transformRoc(data.createDate);
          createDate = createDate.substring(0, createDate.length - 3);

          //塞入保戶回答內容
          qData["customerAnswer"] += createDate + " {" + data.createId + data.createName + "}\n" + data.customerAnswerContent + "\n";
        });
        //回傳保戶回答歷程
        this.questAllData.custHisAnswer.quest[this.form.caseNo][qData.itemCode] = qData["customerAnswer"];

        //塞入母題號對應的index位置
        if( qData.questSubNumber == "0" ){
          this.parentKeyToIndex[qData.questNumber] = questIndex;
        }

        //塞入題目是否顯示，母題 或 子題且母題為題組(ATC05)預設顯示，其餘子題預設隱藏(第一次開啟時預設就好)
        if( validationUtil.isEmpty(qData["isShow"]) ){
          let parentIndex    = this.parentKeyToIndex[qData.questNumber];
          let parentTypeCode = this.form.questContDto[parentIndex].answerTypeCode;
          qData["isShow"] = ( Number.parseInt(qData.questSubNumber) == 0 || parentTypeCode == "ATC05" );
        }

        //塞入母題包含的子題數量
        if(Number.parseInt(qData.questSubNumber) > 0){
          let count = this.parentSubCount[qData.questNumber];
          this.parentSubCount[qData.questNumber] = ( validationUtil.isEmpty(count) )? 1:count+1;
        }

        //塞入答案、備註，產答案選項
        this.inputAns[qData.itemCode] = {};//塞入remark
        this.inputOption[qData.itemCode] = {};//塞入備註選項中文
        //單選 & 複選才需要做，無選項不用做
        if( this.radio.includes(qData.answerTypeCode) || this.checkbox.includes(qData.answerTypeCode) ){
          //取得此次選取答案、備註
          let answer = this.questAllData.answer.quest[this.form.caseNo][qData.itemCode].value;
          let remark = this.questAllData.answer.quest[this.form.caseNo][qData.itemCode]["remark"];

          //取得先前答案(如此次未選取帶入先前答案)
          if( answer == "" && qData.answer != null ){
            answer = qData.answer;
            this.questAllData.answer.quest[this.form.caseNo][qData.itemCode].value = qData.answer;
          }

          //取得先前備註(如此次未填寫帶入先前備註)
          if( remark == undefined && qData.answerDesc != null ){
            remark = {};
            let answerDescs = qData.answerDesc.split(":");
            for( let i in answerDescs ){
              let optionConts = answerDescs[i].split("-");
              let answers = answer.split(":");
              remark[answers[i]] = {value:answers[i], option:optionConts[0], cont:optionConts[1]};
            }
            this.questAllData.answer.quest[this.form.caseNo][qData.itemCode]["remark"] = remark;
          }

          //塞入答案(依照單選、複選)
          if(this.radio.includes(qData.answerTypeCode)){
            this.radioAns[qData.itemCode] = answer;
          }else if(this.checkbox.includes(qData.answerTypeCode)){
            this.checkboxAns[qData.itemCode] = answer.split(":");
            //避免全勾消後切頁返回時，又帶入先前儲存答案，存入answer.quest後，就清空
            qData.answer = null;
            qData.answerDesc = null;
          }

          //塞入備註
          if(remark != undefined){
            for( let value in remark ){
              this.inputAns[qData.itemCode][value] = remark[value].cont;
              this.inputOption[qData.itemCode][value] = remark[value].option;
            }
          }

          //產答案選項
          qData["answerOptions"] = this.setAnswerOption( qData.answerTypeCode, qData.answerOption, answer, qData.answerDesc, questIndex, qData.questNumber );
          
        }

        //如有先前儲存母題答案，開啟該子題
        for(let parentKey in this.defaultShowSub){
          this.setSubQuestDisabled(parentKey, this.defaultShowSub[parentKey], true);
        }
        
        questIndex++;
      });
      
      console.log( "資料===>" );
      console.log( questData );

      //結束語及保戶回答
      this.form.questEndAreaDto["customerAnswer"] = "";
      questData.questEndAreaDto.questCustomerAnswerDto.forEach( (data) => {
          //時間秒數不顯示
          let createDate = MomentUtil.transformRoc(data.createDate);
          createDate = createDate.substring(0, createDate.length - 3);

          //塞入保戶回答內容
          this.form.questEndAreaDto["customerAnswer"] += createDate + " {" + data.createId + data.createName + "}\n" + data.customerAnswerContent + "\n";
      });
      //回傳保戶回答歷程
      this.questAllData.custHisAnswer.end[this.form.caseNo] = this.form.questEndAreaDto["customerAnswer"];

      //是否顯示重寄信函區塊並帶入內容
      const reSendCode = ["AML03", "AML04", "AML05"];
      this.form.reSendLetter = reSendCode.includes(questData.coreSystemCode);
      this.form.reSendType = this.questAllData.answer.reSendLetter[this.form.caseNo].type;
      this.form.reSendAddr = this.questAllData.answer.reSendLetter[this.form.caseNo].addr;
      this.form.reSendOriAddr = questData.pherContAddr;
    }

    //設定下拉選單資料
    this.form.callOutResult = "";
    this.selectCallOutResultOptions = [];
    this.form.closeReasonCodeCase = "";
    this.selectCloseReasonCodeCaseOptions = [];
    this.setDefauleCallOutResult();

    //預設取消語音撥放為N
    this.form.isCancelPlayRecord = "N";

  }

  /** 顯示關鍵字提示訊息 (value:答案值) */
  showKeyWordTip(value){
    let index = null; //符合哪則關鍵字

    //條件:1.答案選否(N)時, 2.業務別為新契約, 3.執機時間為承保後
    if( value.startsWith("N") && this.form.businessType == "NB" && this.form.executeTime == "AUW" ){
      index = 0;
    }

    if( index == null ) return;

    //判斷符合的題目是否未點選答案，如未點選(或無選項)，顯示提示訊息
    let itemCodeList = this.keyWordTip[index].itemCode;
    for( let i in itemCodeList ){
      let answerList = this.questAllData.answer.quest[this.form.caseNo];
      if( validationUtil.isEmpty(answerList[itemCodeList[i]]) || validationUtil.isEmpty(answerList[itemCodeList[i]].value) ){
        Modal.warning({
          title: "注意",
          content: this.keyWordTip[index].tipMsg,
          okText: "確定",
          centered: true
        });
        break;
      }
    }
  }

  /** 設定答案按鈕 (answerTypeCode:選項類型, answerOption:選項, answer:預設選取的答案, questIndex:題目List中的index) */
  setAnswerBtn(answerTypeCode, answerOption, answer, questIndex):Array<object> {
    let result = new Array<object>();

    //單選
    if(answerTypeCode == "ATC01"){
      let options = answerOption.split(":");
      for( let option of options ){
        let cont = option.split("-");
        let className = (answer == cont[1])? "selected":"default";
        result.push( {questIndex:questIndex, key:cont[1], cont:cont[0], class:className} );
      }
    }

    return result;
  }

  /** 設定答案選項 (answerTypeCode:選項類型, answerOption:選項, answer:預設選取的答案, inputAnswer:問答題答案內容, questIndex:題目List中的index, parentKey:母題題號) 
   *  @value ATC01:單選, ATC02:複選, ATC03:子題, ATC04:母題, 
   *         ATC05:題組, ATC06:問答題單選, ATC07:問答題複選,
   *         ATC08:子題複選, ATC09:子題問答單選
   *         ATC10:子題問答複選, ATC11:母題問答單選
   */
  setAnswerOption(answerTypeCode, answerOption, answer, inputAnswer, questIndex, parentKey):Array<object> {
    const result = new Array<optionItem>();

    const twoItems = ["ATC01", "ATC02", "ATC03", "ATC05", "ATC08"];
    const threeItemsInput = ["ATC06", "ATC07", "ATC09", "ATC10"];

    //無選項
    if(answerOption == null) return null;

    //解析問答答案
    let inputAns = (inputAnswer != null)? inputAnswer:"";
    let inputConts = inputAns.split(":");
    let inputAnsList = {};
    for(let input of inputConts){
      let conts = input.split("-");
      inputAnsList[conts[0]] = conts[1];
    }

    //按照參數數量，解析答案選項
    let options = answerOption.split(":");
    for( let option of options ){
      let conts = option.split("-");
      let item = {} as optionItem;

      item.type   = answerTypeCode;
      item.value  = conts[1];
      item.cont   = conts[0];
      item.answer = (answer.split(":").includes(conts[1]));
      item.questIndex = questIndex;

      //if( twoItems.includes(answerTypeCode) ){
        //暫未使用到 因都為預設資料
      //}else
      if( threeItemsInput.includes(answerTypeCode) ){
        //是-Y-Y:否-N-N:未答/拒答-R-N
        //參數3為決定是否有輸入框資料
        item.input = (conts[2] == "Y");
        item.inputAnswer = inputAnsList[conts[0]];

      }else if( answerTypeCode == "ATC04" ){
        //是-Y-Y:否-N-N:未答/拒答-R-N
        //參數3為決定點選後是否開啟子題(可數字1,2 或 Y N)
        item.subShow = conts[2];

      }else if( answerTypeCode == "ATC11" ){
        //是-Y-N-Y:否，繳費方式為-N-Y-N:未答/拒答-R-N-1
        //參數3為決定是否有輸入框資料 參數4可設定數字指定需開啟的子題數(可複數題 中間用, 分隔)
        item.input = (conts[2] == "Y");
        item.inputAnswer = inputAnsList[conts[0]];
        item.subShow = conts[3];

      }

      //如答案為選取狀態，判斷是否需開啟子題
      if(item.answer && !validationUtil.isEmpty(item.subShow) ){
        if( validationUtil.isEmpty(this.defaultShowSub[parentKey]) ){
          this.defaultShowSub[parentKey] = item.subShow;
        }else{
          this.defaultShowSub[parentKey] += "," + item.subShow;
        }
      }

      result.push( item );
    }

    return result;
  }

  /** 設定題組(ATC05)答案(caseNo:案件編號, parentKey:母題題號) */
  setQuestGroupAnswer(caseNo, parentKey) {
    let quest = this.groupQuestList[caseNo][parentKey];

    if( validationUtil.isEmpty(quest) ) return;

    //自動帶入答案條件
    //1.其中一題子題答案為否(N)，母題組帶入否(N), 2.其中一題子題答案為拒答(R)，並且其他子題沒選否(N)，母題組帶入拒答(R)
    //3.如目前子題有選是(Y)，但有尚未選取的子題，母題組帶入"", 4.全部子題皆為是(Y)，母題組帶入是(Y)
    let answer = "Y";
    for(let i in quest.subItemCode){
      let subItemCode = quest.subItemCode[i];
      let value = this.questAllData.answer.quest[caseNo][subItemCode].value;

      console.log( subItemCode + "_" + value);

      if(value == "N"){
        answer = "N";
        break;
      }else if(value == "R"){
        answer = "R";
      }else if(value == "" && answer == "Y"){
        answer = "";
      }
    }

    console.log("!!!" + caseNo + " _ " + parentKey + " 題組母題答案("+ quest.itemCode +") ==> " + answer);

    if(this.form.caseNo == caseNo) this.radioAns[quest.itemCode] = answer; //只更新當下問卷畫面答案
    this.questAllData.answer.quest[caseNo][quest.itemCode].value = answer;

    //更新物件顯示
    //this.$forceUpdate();
  }

  /** 設定共同題目答案 */
  setSameQuestAns(itemCode){
    console.log(this.sameAnsList);
    console.log(this.form.caseNo + "/" + itemCode);
    let sameQuestList = this.sameAnsList[this.form.caseNo][itemCode];

    console.log("相同的列表 => ");
    console.log(sameQuestList);

    for(let i in sameQuestList){
      let caseNo = sameQuestList[i].caseNo;
      let newItemCode = sameQuestList[i].itemCode;
      let questNumber = sameQuestList[i].questNumber;
      console.log( "與現在題目相同 => " + caseNo + " / " + newItemCode );
      //可直接讓他們位址相等 (是不是可以再產出caseNo表的時候~就先相等~)(這邊就只需要判斷是否有選否或不確定)
      this.questAllData.answer.quest[caseNo][newItemCode] = this.questAllData.answer.quest[this.form.caseNo][itemCode];

      //如為題組子題，判斷題組(ATC05)母題是否需顯示答案
      this.setQuestGroupAnswer(caseNo, questNumber);
      
      //如答案有「否」或「不確定」設定驚嘆號 (是不是可以再產出caseNo表的時候~就先等於兩個caseNo位置)
      this.$set( this.questAnswerN, caseNo, this.getQuestAnswerN(caseNo) );
    }
  }

  /** 設定聽取語音宣告按鈕(開/關) */
  setPlayRecordDisabled(state) {
    document.getElementsByName("btnPlayRecord").forEach( (e) => {
      if(state) e.removeAttribute("disabled")
      else      e.setAttribute("disabled", "disabled");
    });
    document.getElementsByName("cancelPlayRecord").forEach( (e) => {
      if(state) e.removeAttribute("disabled")
      else      e.setAttribute("disabled", "disabled");
    });
  }

  /** 設定問卷子題題目(開/關)(parentKey:母題題號, subShow:顯示子題號, isChecked:選取狀態) 
   *  @value subShow => Y:全顯示, N:全不顯示, 1,2:顯示1、2題
   *  @value isChecked => true:勾選, false:勾消
   */
  setSubQuestDisabled(parentKey, subShow, isChecked) {
    console.log( "是否顯示子題=> " + parentKey + "_" + subShow + "_" + isChecked);
    console.log( this.form.questContDto );

    if( validationUtil.isEmpty(subShow) ) return;

    let index = this.parentKeyToIndex[parentKey];
    let subCount = this.parentSubCount[parentKey];

    console.log(subCount);

    if( subShow == "Y" || subShow == "N" ){
      //如勾消Y，也要關閉所有子題
      let isShow = (subShow == "Y" && isChecked);
      for(let i = 1; i <= subCount; i++){
        this.form.questContDto[index + i].isShow = isShow;
        if(!this.form.questContDto[index + i].isShow){
          this.form.questContDto[index + i].answer = null;
          //需判斷子題類型決定怎麼清資料
          if(this.form.questContDto[index + i].answerTypeCode == 'ATC03' || this.form.questContDto[index + i].answerTypeCode == 'ATC09'){
            this.radioAns[this.form.questContDto[index + i].itemCode] = "";
          }else if(this.form.questContDto[index + i].answerTypeCode == 'ATC08' || this.form.questContDto[index + i].answerTypeCode == 'ATC10'){
            this.checkboxAns[this.form.questContDto[index + i].itemCode] = [];
            this.inputAns[this.form.questContDto[index + i].itemCode] = {};
            this.inputOption[this.form.questContDto[index + i].itemCode] = {};
            delete this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[index + i].itemCode]["remark"];
          }
          this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[index + i].itemCode].value = "";
        }
      }
    }else{
      let nums = subShow.split(",");
      for(let i = 1; i <= subCount; i++){
        //(防呆)如為母題不開關
        if( this.form.questContDto[index + 1].questSubNumber == "0" ) continue;
        this.form.questContDto[index + i].isShow = ( nums.includes(i.toString()) && isChecked );
        if(!this.form.questContDto[index + i].isShow){
          this.form.questContDto[index + i].answer = null;
          //需判斷子題類型決定怎麼清資料
          if(this.form.questContDto[index + i].answerTypeCode == 'ATC03' || this.form.questContDto[index + i].answerTypeCode == 'ATC09'){
            this.radioAns[this.form.questContDto[index + i].itemCode] = "";
          }else if(this.form.questContDto[index + i].answerTypeCode == 'ATC08' || this.form.questContDto[index + i].answerTypeCode == 'ATC10'){
            this.checkboxAns[this.form.questContDto[index + i].itemCode] = [];
            this.inputAns[this.form.questContDto[index + i].itemCode] = {};
            this.inputOption[this.form.questContDto[index + i].itemCode] = {};
            delete this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[index + i].itemCode]["remark"];
          }
          this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[index + i].itemCode].value = "";
        }
      }
    }
  }

  /** 保單答案按鈕點擊事件(index:題目順序, i:選項順序, value:選取值) */
  clickPolicyAnswer(index, i, value) {

    if( this.questAllData.answer.policy[this.form.caseNo][this.form.questPolicyDto[index].itemCode] != value){
      this.questAllData.commonData.questModify = "Y";
    }

    let answerData = this.form.questPolicyDto[index].answerOptions;

    //還原所有按鈕
    answerData.forEach( btn => { btn["class"] = "default"; } );

    //選取此次點選按鈕
    answerData[i]["class"] = "selected";

    //塞入答案
    this.questAllData.answer.policy[this.form.caseNo][this.form.questPolicyDto[index].itemCode] = value;
    this.policyAnsY = this.getPolicyAnswerY();

    //如選取否定答案，畫面帶至共用結束語區塊
    if(value != 'Y'){
      window.location.href = "#commonEnd";
    }

    //更新物件顯示
    this.$forceUpdate();
  }

  /** 聽取語音宣告按鈕點擊事件  */
  clickPlayRecord(event) {
    let packNo = this.questAreaData["packNo"];
    
    //檢核
    if( callUpInfoModule.callUpInfo == null ){
      ErrorModalUtil.modalError( "尚未有撥打記錄" );
      return;
    }else if( validationUtil.isEmpty(callUpInfoModule.callUpInfo.sessionId) ){
      ErrorModalUtil.modalError( "尚未有撥打記錄" );
      return;
    }

    //播放語音宣告
    this.$questMainApi.playDialerRecordUsingGET(packNo, callUpInfoModule.callUpInfo.sessionId)
    .then((resp) => {
      if( resp.data != "Y"){
        ErrorModalUtil.modalError( "語音宣告撥放失敗!![sendccxmlerror invalid session id]" );
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });

    //紀錄已點擊聽取語音宣告
    let questIndex = Number.parseInt(event.target.id.replace("playRecord", ""));
    this.form.questPolicyDto[questIndex].isPlayRecord = true;

    //更新物件顯示
    this.$forceUpdate();
  }


  

  /** 問卷答案選項選取事件(複選) */
  checkboxItemCode: string = "";
  checkboxClickVal: string = "";
  checkboxSubShow: string = "";
  checkboxQuestIndex: string = "";
  clickCheckboxAnswer(itemCode, check) {
    let questIndex = check.questIndex;
    let value = check.value;

    console.log( "複選答案 => " + this.checkboxAns[itemCode].toString());
    this.checkboxItemCode = itemCode;
    this.checkboxClickVal = value;
    this.checkboxQuestIndex = questIndex;
    this.checkboxSubShow = check.subShow;

    console.log( itemCode + "/" + questIndex + "/" + value ); 
  }

  /** 問卷答案選項選取事件(單選) */
  radioQuestIndex: string = "";
  clickRadioAnswer(itemCode, radio) {
    
    this.radioQuestIndex = radio.questIndex;

    let isInput = radio.input;
    let value   = radio.value;
    let subShow = radio.subShow;


    //subShow => (Y:全顯示, N:全不顯示, 1,2:顯示1、2題)
    console.log( isInput + " / " + itemCode + " / " + subShow );
    console.log( radio );

    //開關子題項
    this.setSubQuestDisabled(this.form.questContDto[radio.questIndex].questNumber, subShow, true);

    //選項中文也要加入remark中 (中文-備註)

    if( this.questAllData.answer.quest[this.form.caseNo][itemCode].remark === undefined )
      this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"] = {};

    //是否選到了需備註的答案
    if(isInput){
      let remark = this.inputAns[itemCode][value];
          remark = (!remark)? "":remark;
      let option = this.inputOption[itemCode][value];
          option = (!option)? "":option;
      this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"][value] = {value:value, option:option, cont:remark};
    }else{
      delete this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"];
    }

    //答案有異動，問卷檢核pass要set to N
    this.questAllData.answer.questCheck[this.form.caseNo].pass = "N";
    
  }

  /** 問卷答案選項異動事件(複選) */
  onCheckboxChange(value) {
    console.log( this.checkboxItemCode + " : " + value );

    this.questAllData.commonData.questModify = "Y";

    //如果value內有R，需把其他選項都清空
    let rCheck = value.includes("R");
    if(rCheck){
      value = ['R'];
      this.checkboxAns[this.checkboxItemCode] = ['R'];
    }

    //塞回選取值
    this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode].value = value.toString().replaceAll(",",":");

    //取 1.這次點選的是否有備註欄位, 2.這次點選的動作是 選取 or 勾消
    let isInput = false;
    let isChecked = value.includes(this.checkboxClickVal);
    for(let check of this.form.questContDto[this.checkboxQuestIndex].answerOptions){
      if( check.value == this.checkboxClickVal ) isInput = check.input;
    }

    // if( isInput ) {
    //需填寫備註
    if( isChecked ){
      //選取
      if( this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode].remark === undefined )
        this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode]["remark"] = {};

      //勾起時, 如input已有內容, 預設塞入
      let remark;
      if ( isInput){
        remark = this.inputAns[this.checkboxItemCode][this.checkboxClickVal];
        remark = (!remark)? "":remark;
      }else{
        remark = undefined;
      }
      let option;
      var questCont;
      for(questCont in this.form.questContDto){
        if(this.form.questContDto[questCont].itemCode == this.checkboxItemCode){
          for (let optionValue of this.form.questContDto[questCont].answerOptions){
            if(optionValue.value == this.checkboxClickVal){
              option = optionValue.cont;
            }
          }
        }  
      }
      this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode]["remark"][this.checkboxClickVal] = {value:this.checkboxClickVal, option:option, cont:remark};
    }else{
      //勾消
      delete this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode]["remark"][this.checkboxClickVal];

      //如勾消後，都沒其他選取需要備註的項目，刪除備註obj
      if( Object.keys(this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode]["remark"]).length == 0 )
        delete this.questAllData.answer.quest[this.form.caseNo][this.checkboxItemCode]["remark"];
    }

    //開關子題項
    this.setSubQuestDisabled(this.checkboxQuestIndex, this.checkboxSubShow, isChecked);

    //(勾選)是否符合關鍵字提示訊息
    if(isChecked) this.showKeyWordTip(this.checkboxClickVal);

    //塞入共同題目答案
    this.setSameQuestAns(this.checkboxItemCode);
    
    console.log( "複選是否有remark => ");
    console.log( isInput );

    console.log( this.form.questContDto );
    console.log("答案--------");
    console.log( this.radioAns );
    console.log( this.checkboxAns );
    console.log( value );

    //如答案有「否」或「不確定」設定驚嘆號
    this.$set( this.questAnswerN, this.form.caseNo, this.getQuestAnswerN() );

    //答案有異動，問卷檢核pass要set to N
    this.questAllData.answer.questCheck[this.form.caseNo].pass = "N";
    
    //更新物件顯示
    this.$forceUpdate();
  }

  /** 問卷答案選項異動事件(單選) */
  onRadioChange(event) {
    
    console.log("這次點選的答案："+event.target.value);
    console.log("上次的答案"+this.questAllData.answer.quest[this.form.caseNo][event.target.name].value);

    this.questAllData.commonData.questModify = "Y";

    this.questAllData.answer.quest[this.form.caseNo][event.target.name].value = event.target.value;

    //如答案有「否」或「不確定」設定驚嘆號
    this.$set( this.questAnswerN, this.form.caseNo, this.getQuestAnswerN() );

    //設定題組(ATC05)答案
    this.setQuestGroupAnswer(this.form.caseNo, this.form.questContDto[this.radioQuestIndex].questNumber);

    //是否符合關鍵字提示訊息
    this.showKeyWordTip(event.target.value);

    //塞入共同題目答案
    this.setSameQuestAns(event.target.name);

    console.log( this.questAnswerN );
    console.log("答案--------");
    console.log( this.radioAns );
    console.log( this.checkboxAns );

    //更新物件顯示
    this.$forceUpdate();
  }

  /** 問卷答案備註異動 */
  onInputChange(event, itemCode, option) {
    console.log(this.inputAns);
    console.log( event );
    console.log(itemCode);
    console.log( option );

    console.log( typeof this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"] );

    this.inputOption[itemCode][option.value] = option.cont;

    this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"][option.value].option = option.cont;
    this.questAllData.answer.quest[this.form.caseNo][itemCode]["remark"][option.value].cont   = this.inputAns[itemCode][option.value];

    //更新物件顯示
    this.$forceUpdate();

    console.log( "選項對應 => " );
    console.log( this.inputOption );
  }

  /** 重寄信函 - 寄送方式異動 */
  onReSendTypeChange(value) {
    console.log("寄送方式異動 => " );
    console.log("現在點選："+value);
    console.log("上次點選的資料："+this.form.reSendType);
    if(value == this.form.reSendType){
      //清掉radiobutton
      this.form.reSendType = "";
      this.questAllData.answer.reSendLetter[this.form.caseNo].type = "";
      this.questAllData.answer.reSendLetter[this.form.caseNo].addr = "";
    }else{
      this.form.reSendType = value;
      this.questAllData.answer.reSendLetter[this.form.caseNo].type = value;
      if(this.form.reSendType == "0"){
        this.questAllData.answer.reSendLetter[this.form.caseNo].addr = "";
      }else{
        this.questAllData.answer.reSendLetter[this.form.caseNo].addr = this.form.reSendAddr;
        console.log("onReSendTypeChange:"+this.questAllData.answer.reSendLetter[this.form.caseNo].addr);
      }
    }
  }

  /** 重寄信函 - 地址欄位異動 */
  onReSendAddrChange() {
    this.questAllData.answer.reSendLetter[this.form.caseNo].addr = this.form.reSendAddr;
    console.log("onReSendAddrChange："+this.questAllData.answer.reSendLetter[this.form.caseNo].addr);
  }

  /** 取得該受訪者ID是否有簽核中電話變更作業 */
  getChangeCaseCount(caseNo, callBack) {
    LoadingUtil.show();
    this.$questMainApi.getChangeCaseCountUsingGET(caseNo)
    .then((resp) => {
      callBack(resp.data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => LoadingUtil.close());
  }

  /** 檢查是否全部保單答案皆為Y */
  getPolicyAnswerY():boolean {
    let answers = this.questAllData.answer.policy[this.form.caseNo];
    for(let itemCode in answers){
      if( answers[itemCode] != "Y" )
        return false;
    }

    return true;
  }

  /** 檢查問卷答案是否有「否」或「不確定」 
   *  @value caseNo    => 案件編號(不傳預設檢查目前開啟的問卷)
   *  @value questList => 題目列表(內必需含answer key，不傳預設使用答案清單做判斷)
   */
  getQuestAnswerN(caseNo?, questList?):boolean {
    caseNo = (validationUtil.isEmpty(caseNo))? this.form.caseNo:caseNo;
    let answersList = (validationUtil.isEmpty(questList))? this.questAllData.answer.quest[caseNo]:questList;
    for(let i in answersList){
      let answer  = (validationUtil.isEmpty(questList))? answersList[i].value:answersList[i].answer;
      let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
      for(let val of answers){
        if( val.startsWith("N") || val == "R" )
          return true;
      }
    }
    return false;
  }

  /** 取得頁籤ClassName */
  getTabClass(caseNo, closeCase):string {
    let claseName = "";
    if(closeCase) claseName = "tabClose";
    if(this.questAnswerN[caseNo]) claseName += " tabTipIcon";

    //儲存回壓結案案件為目前選取頁，更新結案狀態
    if(caseNo == this.form.caseNo) this.form.closeCase = closeCase;

    return claseName;
  }

  /** 取得頁籤標題 */
  getTabTitle(business, casePolicy, questName):string {
    business  = (business == null)?  "":business;
    casePolicy  = (casePolicy == null)?  "":casePolicy;
    questName = (questName == null)? "":questName;
    return business + "(" + casePolicy + ")" + questName;
  }

  /** 清除問卷區塊資料 */
  resetQuest(){
    this.form.caseNo = "";
    this.form.errTip = "";
    this.form.reSendType = "";
    this.form.reSendAddr = "";
    this.form.closeCase = false;
    this.form.reSendLetter = false;
    //this.form.answerNTip = false;
    this.form.questPolicyDto = [];
    this.form.questContDto = {};
    this.form.questEndAreaDto = {};

    this.form.poliycNo = "";
    this.form.executeTime = "";
    this.form.businessType = "";

    this.form.coreSystemCode = "";
    this.form.closeReasonCode = "";

    this.defaultRiskCTRLItem = [];
    this.defaultCustLevel = "";
    this.defaultContract = "";
  }

  /** 問卷檢核 
   *  1.檢查未點選變藍底並快速定位到第一個未點選問項 
   *  2.確認是否全部的問卷檢核是否完成且無其他訊息，若符合，需確認是否還有其他
   *    跟件名單，如有：需彈跳未完成訊息，如無：需彈跳後續會再聯絡訊息
   */
  onQuestCheckClick(caseNo) {

    //0.先存檔
    this.$emit("saveAllQuest",caseNo);

    //1.【請向保戶說明保單有10日撤銷契約的權益】訊息
    if( this.form.businessType == "NB" && this.form.executeTime == "AUW" ){
      let itemCodeList = this.keyWordTip[0].itemCode;
      for( let i in itemCodeList ){
        let answerList = this.questAllData.answer.quest[this.form.caseNo];
        if( validationUtil.isEmpty(answerList[itemCodeList[i]]) || validationUtil.isEmpty(answerList[itemCodeList[i]].value) ){
          Modal.warning({
            title: "注意",
            content: this.keyWordTip[0].tipMsg,
            okText: "確定",
            centered: true
          });
          break;
        }
      }
    }
    
    //2.檢查未點選變藍底並快速定位到第一個未點選問項(需排除不需顯示的子題)
    this.questAllData.answer.questCheck[caseNo].doChecked = "Y";
    let answersList =  this.questAllData.answer.quest[caseNo];
    let firstTag = "";
    for(let i in answersList){
      var questCont;
      let index = 0;
      for(questCont in this.form.questContDto){
        let questContItemCode = this.form.questContDto[questCont].itemCode;
        if ( i == questContItemCode){
          index = questCont;
          break;
        }
      }
      if(this.form.questContDto[index].isShow){
        let answer  = answersList[i].value;
        if(answer == ''){
          document.getElementById(caseNo+'_'+ i).style.backgroundColor = 'LightSkyBlue';
          if(firstTag == ''){
            firstTag = '#'+caseNo+'_'+ i;
          }
        }
      }
    }
    if(firstTag != ''){
      ErrorModalUtil.modalError( "尚有答項未點選" );
      window.location.href = firstTag;
      return;
    }

    //2.確認是否全部的問卷檢核是否完成且無其他訊息(需排除已結案件)
    this.questAllData.answer.questCheck[caseNo].pass = "Y";
    if(this.defaultPickupResult.casePackList == null){
      ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(casePackList is null)" );
      return;
    }
    let defaultPackNoList = this.defaultPickupResult.casePackList;
    let checkFollows = true;
    let questChecks = this.questAllData.answer.questCheck;
    for(let questCheck in questChecks){
      if(this.questAllData.answer.questCheck[questCheck].doChecked != 'Y' 
        || this.questAllData.answer.questCheck[questCheck].pass != 'Y'){
          for(let data of this.questAreaData.questDto){
            if(data.caseNo == questCheck){
              if(data.closeCase == false){
                checkFollows = false;
              }
            }
          }
      }
    }
    if(checkFollows){
      LoadingUtil.show();
      let packNoList = [];
      for(let defaultPackNo in defaultPackNoList){
        packNoList.push(defaultPackNoList[defaultPackNo].packNo);
      }
      this.$questMainApi.checkQuestToDoListUsingGET(packNoList)
      .then((resp) => {
        if(resp.data.hasData == 'Y'){
          let matchMessage = "";
          let matchPolicy = "";
          let notMatchMessage = "";
          if(resp.data.matchPolicyData.length > 0){
            for(let i in resp.data.matchPolicyData){
              matchPolicy = matchPolicy + resp.data.matchPolicyData[i].taskName + "-" + resp.data.matchPolicyData[i].casePolicy + ",";
            }
            matchPolicy = matchPolicy.substring(0, matchPolicy.length - 1);
            matchMessage = matchPolicy + "尚待完成電訪問卷，請執行續訪!";
            Modal.warning({
              title: "注意",
              content: matchMessage,
              okText: "確定",
              centered: true
            });
          }
          if(resp.data.notMatchPolicyData.length > 0){
            notMatchMessage = "請提醒保戶，公司後續將會有電訪員再次與您確認保單相關權益內容";
            Modal.warning({
              title: "注意",
              content: notMatchMessage,
              okText: "確定",
              centered: true
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(checkFollows error)" );
        return;
      })
      .finally(() => LoadingUtil.close());
    }

    this.$forceUpdate();

  }

  /** 拒答檢核 */
  onNoAnswerCheckClick(caseNo) {
    this.questAllData.answer.questCheck[caseNo].refuseCheck = "Y";
    // 將未點選的所有問項全部帶入【未答/拒答】
    let answersList =  this.questAllData.answer.quest[caseNo];
    for(let i in answersList){
      let answer = this.questAllData.answer.quest[caseNo][i].value;
      let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
      for(let val of answers){
        if(val == ''){
          //判斷答案選項是否有背端為R的選項，有就set = R
          let updateOption = false;
          let isRadio = false;
          for (let data in this.form.questContDto){
            if(this.form.questContDto[data].itemCode == i){  
              if(this.radio.includes(this.form.questContDto[data].answerTypeCode)){
                isRadio = true;
              }else{
                isRadio = false;
              }
              for (let answer of this.form.questContDto[data].answerOptions){
                if(answer.value == 'R'){
                  updateOption = true;
                }
              }
            }
          }
          if(updateOption){
            this.questAllData.answer.quest[caseNo][i].value = 'R';
            if(isRadio){
              this.radioAns[i] = 'R';
            }else{
              this.checkboxAns[i] = ['R'];
            }
          }
        }
      }
    }

    //如答案有「否」或「不確定」設定驚嘆號
    this.$set( this.questAnswerN, this.form.caseNo, this.getQuestAnswerN() );

    this.$forceUpdate();

    this.$emit("saveAllQuest",caseNo);
    
  }

  /** 依答案決定背景產色 */
  getBackgroundStyle(caseNo, itemCode){
    //如果是不需顯示的子題就不需處理
    var questCont;
    let index = 0;
    for(questCont in this.form.questContDto){
      let questContItemCode = this.form.questContDto[questCont].itemCode;
      if (itemCode == questContItemCode){
        index = questCont;
        break;
      }
    }
    if(!this.form.questContDto[index].isShow){
      return "background-color: #FFF"; 
    }
    //排除無選項題目問題
    if(this.questAllData.answer.quest[caseNo][itemCode] == undefined){
      return "background-color: #FFF"; 
    }
    let answer = this.questAllData.answer.quest[caseNo][itemCode].value;
    let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
    let doChecked = this.questAllData.answer.questCheck[caseNo].doChecked;
    let isEmpty = true;
    for(let val of answers){
      if( val.startsWith("N") || val == "R" ){
        return "background-color: #fcb0b0";
      }
      if(val != ""){
        isEmpty = false;
      }
    }
    //是否點過問卷檢核，如果點過且答案為空值就設定為淡藍色
    if(doChecked == "Y" && isEmpty){
      return "background-color: LightSkyBlue";
    }
    return "background-color: #FFF";
  }

  /** 依條件決定是否顯示結束語 */
  getDisplayOrNot(itemCode){
    //主機代碼
    let coreSystemCode = this.form.coreSystemCode;
    //核身結果
    let notPassAnswer = ["F"];
    let checkId = (notPassAnswer.includes(this.questAllData.answer.checkId));
    //錄音
    let notPassOpen = ["N"];
    let open = (notPassOpen.includes(this.questAllData.answer.open));
    //問卷是否有任一題點選未答/拒答
    let questHasCheckR = this.questHasRAnswer(this.form.caseNo);
    //問卷是否沒點否
    let questNoCheckN = this.questNoCheckNAnswer(this.form.caseNo);
    //是否有點拒訪檢或問卷檢核
    let questCheckOption = ["Y"];
    let questCheck = (questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked) ||
    questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].refuseCheck));
    //語音宣告是否點不同意
    let openAndCheckId = !this.policyDisaled;
    let policyAnsN = this.getPolicyAnswerN();
    let policyNotice = (openAndCheckId && policyAnsN);
    //問答項是否皆為是
    let allAnswerIsYes = this.checkAllAnswerIsYes();
    //問答項是否任一為否
    let hasOneAnswerIsNo = this.checkOneAnswerIsNo();

    if( itemCode == 'Z0001' ){
      if(this.checkRiskCtrl('B0061')){
        return true;
      }
    }

    if( itemCode == 'Z0002' || itemCode == 'Z0003' || itemCode == 'Z0004' || itemCode == 'Z0005' ){
      if(questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked)){
        return true;
      }
    }

    if( itemCode == 'Z0006' ){
      if(checkId){
        return true;
      }
    }

    if( itemCode == 'Z0007' || itemCode == 'Z0008' || itemCode == 'Z0009' || itemCode == 'Z0010' || itemCode == 'Z0011' || itemCode == 'Z0012' ){
      if(allAnswerIsYes && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked)){
        return true;
      }
    }

    if( itemCode == 'Z0014' || itemCode == 'Z0015' || itemCode == 'Z0016' ){
      if(hasOneAnswerIsNo && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked)){
        return true;
      }
    }

    if( itemCode == 'Z0018' ){
      if(open){
        return true;
      }
      if(questHasCheckR && questNoCheckN && questCheck){
        return true;
      }
      if(policyNotice){
        return true;
      }
    }

    if( itemCode == 'Z0019' || itemCode == 'Z0020' || itemCode == 'Z0021' ){
      if(open){
        return true;
      }
      if(questHasCheckR && questNoCheckN && questCheck){
        return true;
      }
    }

    if( itemCode == 'Z0022' ){
      if(allAnswerIsYes && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked)){
        return true;
      }
    }

    if( itemCode == 'Z0023' ){
      if(hasOneAnswerIsNo && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked)){
        return true;
      }
    }

    if( itemCode == 'Z0024' ){
      if(open){
        return true;
      }
      if(questHasCheckR && questNoCheckN && questCheck){
        return true;
      }
    }

    if( itemCode == 'Z0028' ){
      if( allAnswerIsYes ){
        return true;
      }
    }

    if( itemCode == 'Z0029' && itemCode == 'Z0030' ){
      if ( hasOneAnswerIsNo ){
        return true;
      }
    }

    if( itemCode == 'Z0031' ){
      let checkNItem = ["P0011"];
      var itemN;
      for(itemN in checkNItem){
        if(this.questAllData.answer.quest[this.form.caseNo][checkNItem[itemN]] != undefined){
          if(this.checkAnswerIsN(checkNItem[itemN])){
            return true;
          }
        }
      }
    }

    if( itemCode == 'Z0032' ){
      let checkNItem = ["K0068"];
      var itemN;
      for(itemN in checkNItem){
        if(this.questAllData.answer.quest[this.form.caseNo][checkNItem[itemN]] != undefined){
          if(this.checkAnswerIsN1(checkNItem[itemN])){
            return true;
          }
        }
      }
    }

    if( itemCode == 'Z0033' || itemCode == 'Z0034' ){
      let checkNItem = ["K0070"];
      var itemN;
      for(itemN in checkNItem){
        if(this.questAllData.answer.quest[this.form.caseNo][checkNItem[itemN]] != undefined){
          if(this.checkAnswerIsN1(checkNItem[itemN])){
            return true;
          }
        }
      }
    }

    if( itemCode == 'Z0035' ){
      if( allAnswerIsYes && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked) ){
        return true;
      }
    }

    if( itemCode == 'Z0036' ){
      if( hasOneAnswerIsNo && questCheckOption.includes(this.questAllData.answer.questCheck[this.form.caseNo].doChecked) ){
        return true;
      }
    }

    if( itemCode == 'Z0037' ){
      if( this.checkAllAnswerIsNo() ){
        return true;
      }
    }

    if( itemCode == 'Z0038' ){
      if( this.checkAllAnswerIsNo() ){
        return true;
      }
    }

    if( itemCode == 'Z0039' ){
      if( allAnswerIsYes ){
        return true;
      }
    }

    if( itemCode == 'Z0040' || itemCode == 'Z0041' ){
      if( allAnswerIsYes && this.checkRiskCtrl('B0094') ){
        return true;
      }
    }
    
    return false;
    
  }

  questHasRAnswer(caseNo){
    let answersList =  this.questAllData.answer.quest[this.form.caseNo];
    for(let i in answersList){
      let answer = this.questAllData.answer.quest[this.form.caseNo][i].value;
      let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
      for(let val of answers){
        if(val == 'R'){
          return true;
        }
      }
    }
    return false;
  }

  questNoCheckNAnswer(caseNo){
    let answersList =  this.questAllData.answer.quest[this.form.caseNo];
    for(let i in answersList){
      let answer = this.questAllData.answer.quest[this.form.caseNo][i].value;
      let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
      for(let val of answers){
        if(val == 'N'){
          return false;
        }
      }
    }
    return true;
  }

  getPolicyAnswerN():boolean {
    let answers = this.questAllData.answer.policy[this.form.caseNo];
    for(let itemCode in answers){
      if( answers[itemCode] == "N" )
        return true;
    }
    return false;
  }

  checkAllAnswerIsYes(){
    var questCont;
    for(questCont in this.form.questContDto){
      if(this.form.questContDto[questCont].isShow && this.form.questContDto[questCont].answerOptionId != null){
        let answer = this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[questCont].itemCode].value;
        let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
        for(let val of answers){
          if( !val.startsWith("Y") ){
            return false;
          }
        }
      }
    }
    return true;
  }

  checkAllAnswerIsNo(){
    var questCont;
    for(questCont in this.form.questContDto){
      if(this.form.questContDto[questCont].isShow && this.form.questContDto[questCont].answerOptionId != null){
        let answer = this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[questCont].itemCode].value;
        let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
        for(let val of answers){
          if( !val.startsWith("N") ){
            return false;
          }
        }
      }
    }
    return true;
  }

  checkOneAnswerIsNo(){
    var questCont;
    for(questCont in this.form.questContDto){
      if(this.form.questContDto[questCont].isShow && this.form.questContDto[questCont].answerOptionId != null){
        let answer = this.questAllData.answer.quest[this.form.caseNo][this.form.questContDto[questCont].itemCode].value;
        let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
        for(let val of answers){
          if( val.startsWith("N") ){
            return true;
          }
        }
      }
    }
    return false;
  }

  checkAnswerIsN(itemCode){
    let answer = this.questAllData.answer.quest[this.form.caseNo][itemCode].value;
    let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
    for(let val of answers){
      if( val.startsWith("N") ){
        return true;
      }
    }
    return false;
  }

  checkAnswerIsN1(itemCode){
    let answer = this.questAllData.answer.quest[this.form.caseNo][itemCode].value;
    let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
    for(let val of answers){
      if( val.startsWith("N1") ){
        return true;
      }
    }
    return false;
  }

  checkAnswerIsY(itemCode){
    let answer = this.questAllData.answer.quest[this.form.caseNo][itemCode].value;
    let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
    for(let val of answers){
      if( val.startsWith("Y") ){
        return true;
      }
    }
    return false;
  }

  checkAnswerIsR(itemCode){
    let answer = this.questAllData.answer.quest[this.form.caseNo][itemCode].value;
    let answers = (answer == null)? []:answer.split(":"); //複選會使用 ":" 分隔
    for(let val of answers){
      if( val.startsWith("R") ){
        return true;
      }
    }
    return false;
  }

  checkRiskCtrl(item){
    for(let value in this.defaultRiskCTRLItem){
      if(this.defaultRiskCTRLItem[value] == item){
        return true;
      }
    }
    return false;
  }

  setDefauleCallOutResult() {
    //取得電訪結果下拉選單
    var teleResultConfigCond:TeleResultConfigCond = {};
    let caseNo = this.form.caseNo;
    let taskId = '';

    if(caseNo == ""){
      return;
    }
    
    LoadingUtil.show();
    this.$questMainApi.selectTaskIdDataUsingGET(caseNo)
      .then((resp) => {
        taskId = resp.data;
        teleResultConfigCond.taskId = taskId;
        teleResultConfigCond.contactResultId = "A001"; //一定是聯絡到本人才會填寫問卷
        this.$teleResultAreaApi.getTeleResultOptByCondUsingPOST(teleResultConfigCond)
          .then((resp:AxiosResponse<Option[]>)=>{
            if(resp != null){
              for (let resultData of resp.data) {
                this.selectCallOutResultOptions.push({label: resultData.value, value:resultData.label});
              }
            }
          })
          .catch((error)=>{
            console.error("查詢電訪結果下拉發生異常");
          })
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => LoadingUtil.close());
  }

  onCallOutResultChange() {
    this.form.closeReasonCodeCase = "";
    this.selectCloseReasonCodeCaseOptions = [];
    //取得電訪結果下拉選單
    var teleResultConfigCond:TeleResultConfigCond = {};
    let caseNo = this.form.caseNo;
    let taskId = '';

    if(caseNo == ""){
      return;
    }
    
    LoadingUtil.show();
    this.$questMainApi.selectTaskIdDataUsingGET(caseNo)
      .then((resp) => {
        taskId = resp.data;
        teleResultConfigCond.taskId = taskId;
        teleResultConfigCond.contactResultId = "A001"; //一定是聯絡到本人才會填寫問卷
        teleResultConfigCond.teleResultId = this.form.callOutResult;
        this.$teleResultAreaApi.getClosedReasonOptByCondUsingPOST(teleResultConfigCond)
        .then((resp:AxiosResponse<Option[]>)=>{
          if(resp != null){
            for (let resultData of resp.data) {
              this.selectCloseReasonCodeCaseOptions.push({label: resultData.value, value:resultData.label});
            }
          }
        })
        .catch((error)=>{
          console.error("查詢電訪結果下拉發生異常");
        })
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => LoadingUtil.close());


  }

  sendDataButton(){
    this.callOutResultData = {caseNo: this.form.caseNo, teleResult:this.form.callOutResult, closedReason: this.form.closeReasonCodeCase};
    // EventBus.$emit("setValueMsg", this.callOutResultData);
    
    let pageAll = this.questAreaData.questDto.length;
    let pageNow = parseInt(this.form.questTabKey) + 1;

    if(pageNow < pageAll){
      this.onTabChange(pageNow);
      this.form.questTabKey = pageNow.toString();
    }else if(pageNow == pageAll){
      let result = (this.isChangeWork && this.questAllData.answer.checkId=="Y");
      if(result){
        this.onTabChange("changeWork");
        this.form.questTabKey = "changeWork";
      }
    }

  }

  cancelPlayRecord(event){
    if(event.target.checked == true){
      this.form.isCancelPlayRecord = "Y";
    } else {
      this.form.isCancelPlayRecord = "N";
    }
  }

  checkPlayRecord(isPlayRecord){
    if(isPlayRecord == true){
      return false;
    }else if(this.form.isCancelPlayRecord == "Y"){
      return false;
    }
    return true;
  }

  resultLoading(isLoading){
    this.telChangeLoading = isLoading;
  }

  // 判斷電話變更作業是否都完成資料抓取
  get componentLoading(){
    return this.telChangeLoading;
  }

  @Watch('componentLoading')
  isLoading(newVal:boolean){
    if(newVal){
      LoadingUtil.close();
    }else{
      LoadingUtil.show();
    }
    
  }

}