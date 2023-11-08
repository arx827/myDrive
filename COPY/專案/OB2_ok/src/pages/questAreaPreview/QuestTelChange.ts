import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Radio } from "ant-design-vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import VlidationUtil, { default as validationUtil } from "@/assets/config/ValidationUtil";
import { default as LoadingUtil } from "@/assets/config/LoadingUtil";
import { callUpInfoModule } from "@/plugins/store/CallUpModule";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { OutputDto, QuestTelDto } from '@fubonlife/obd-api-axios-sdk';
import { Alert, Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

@Component({ components: { Radio, RadioGroup, RadioButton } })
export default class QuestTelChange extends Vue {

    @Prop()
    public changeType: string; //開啟的類型 ex.問卷前端用 or 覆核用

    @Prop()
    public changePackNo: string; //名單編號

    @Prop()
    public changeCaseNo: string; //案件編號

    @Prop()
    public reviewNo: string; //作業單號

    @Prop()
    public isReSend: boolean; //是否為重送

    /** 電話變更作業資料 */
    changeCase = {
        packNo: "", //名單編號
        caseNo: "", //案件編號
        policyNo: "", //保單號
        custId: "", //受訪者ID
        custName: "", //受訪者姓名
        custEmail: "", //受訪者Email(改取得要保人Email)
        mobChang: "", //受訪者手機號碼(改取得要保人手機)
        showType: "", //變更項目顯示用
        cancelPlayRecord: "" //取消語音宣告
    }

    /** 電話變更作業題目 */
    questList = [];

    /** 單選選項 */
    radioAns = {};

    /** input資料 */
    inputAns = {};

    /** 預設資料 */
    emailOrPhoneString = "為響應環保愛地球，公司寄送給保戶的通知新增以電子通知單方式寄送供保戶選擇，申請後各項通知單改以<#showType>方式通知，包含日後同一要保人投保之新保單，但法令要求或實際作業必須以紙本寄發的通知則除外。請問您是否同意在電話中申請？";
    endTypeOne = "結束語：以上的變更內容，公司會依據您提供的手機和E-Mail，發送變更受理的通知，完成後將寄發批註書，請您收到後務必核對確認，以後如果有任何需要服務的地方，歡迎隨時與您的服務人員聯絡，或來電客服中心，祝您事事順心，再見！";
    endTypeTwo = "好的，謝謝";

    /** 後送存檔的資料 */
    questTelDto: QuestTelDto = {};

    /** 瀏覽模式的資料 */
    defaultTelChange = {};

    created() {
        this.questList = [];
        this.radioAns = {item03:"",item05:"",item09:""};
        this.inputAns = {item06:"",item07:""};
        this.changeCase.packNo = this.changePackNo;
        this.changeCase.caseNo = this.changeCaseNo;
        this.changeCase.cancelPlayRecord = "N";
        this.showChangeCase();
    }

    /** 撈取電話變更頁面資料 */
    showChangeCase(){
        console.log(this.changeCase.caseNo);
        if(this.changeCase.policyNo != "") return;

        // LoadingUtil.show();
        this.$questMainApi.getChangeCaseDataUsingGET(this.changeCase.caseNo)
        .then((resp) => {
            this.changeCase.policyNo = resp.data.policyNo;
            this.changeCase.custId = resp.data.custId;
            this.changeCase.custName = resp.data.custName;
            this.changeCase.custEmail = resp.data.custEmail;
            this.changeCase.mobChang = resp.data.mobChang;

            if(this.changeCase.policyNo == null){
                this.changeCase.policyNo = "";
            }
            if(this.changeCase.custEmail == null){
                this.changeCase.custEmail = "";
            }
            if(this.changeCase.mobChang == null){
                this.changeCase.mobChang = "";
            }

            this.setChangeCase();
        
        }).catch((err) => {
            console.log(err);
        }).finally(()=>{
            // LoadingUtil.close();
        })
    }

    /** 設定電話變更作業頁面資料 */
    async setChangeCase(){
        this.questList = [
        {
            item: "item01",
            content: "方便耽誤您幾分鐘，因為公司目前沒有您完整的手機號碼、email，請問您是否願意讓我協助您建檔？未來有相關保單重要訊息，可以有多一個管理通知您？",
            answerType: "checkbox",
            answerOption: [{value:"N", cont:"無意願",}],
            answer: "false",
            disable: false,
            status: ""
        },
        {
            item: "item02",
            content: "為確保您的權益，要請您先聽一段【個人資料蒐集、處理利用告知事項】的語音宣告。",
            answerType: "button",
            answerOption: [{value:"Declare", cont:"聽取錄音宣告"}],
            answer: "",
            disable: false,
            status: ""
        },
        {
            item: "item03",
            content: "請問您是否同意宣告內容？",
            answerType: "radio",
            answerOption: [{value:"Y", cont:"同意"}, {value:"N", cont:"不同意(結束問卷)"}],
            answer: "",
            disable: true,
            status: ""
        },
        {
            item: "item04",
            content: "受訪者身分：要保人　　受訪者ID：<#custId>　　受訪者姓名：<#custName>　　本次電訪保單號碼：<#policyNo>",
            answerType: null,
            answerOption: null,
            answer: "",
            disable: false,
            status: ""
        },
        {
            item: "item05",
            content: "是否同意以您為要保人之所有有效保單均同步變更手機號碼及電子信箱？",
            answerType: "radio",
            answerOption: [{value:"Y", cont:"同意"}, {value:"N", cont:"不同意(結束問卷)"}],
            answer: "",
            disable: true,
            status: ""
        },
        {
            item: "item06",
            content: "手機號碼（<#mobChang>）：",
            answerType: "input",
            answerOption: [{value:"mobChang", cont:"修改手機號碼"}],
            answer: "",
            disable: true,
            status: ""
        },
        {
            item: "item07",
            content: "電子信箱（<#custEmail>）：",
            answerType: "input",
            answerOption: [{value:"custEmail", cont:"修改電子信箱"}],
            answer: "",
            disable: true,
            status: ""
        },
        {
            item: "item08",
            content: "<font color='#FF0000'>提醒：蒐集保戶手機號碼或email時，務必重複覆誦，如數字【1與7】、【b與v】、【t與p】、【b與d】、【e與數字1】，需要舉例確認清楚</font>",
            answerType: null,
            answerOption: null,
            answer: "",
            disable: false,
            status: ""
        },
        {
            item: "item09",
            content: "為響應環保愛地球，公司寄送給保戶的通知新增以電子通知單方式寄送供保戶選擇，申請後各項通知單改以<#showType>方式通知，包含日後同一要保人投保之新保單，但法令要求或實際作業必須以紙本寄發的通知則除外。請問您是否同意在電話中申請？",
            answerType: "radio",
            answerOption: [{value:"Y", cont:"同意"}, {value:"N", cont:"不同意"}],
            answer: "",
            disable: true,
            status: ""
        },
        {
            item: "item10",
            content: "結束語：以上的變更內容，公司會依據您提供的手機和E-Mail，發送變更受理的通知，完成後將寄發批註書，請您收到後務必核對確認，以後如果有任何需要服務的地方，歡迎隨時與您的服務人員聯絡，或來電客服中心，祝您事事順心，再見！",
            answerType: null,
            answerOption: null,
            answer: "",
            disable: false,
            status: ""
        },
        {
            item: "item11",
            content: "",
            answerType: "button",
            answerOption: [{value:"clean", cont:"取消"}, {value:"submit", cont:"送出"}],
            answer: "",
            disable: false,
            status: ""
        }
        ];

        //置換參數(資料內容)
        for(let data of this.questList){
            for(let key in this.changeCase){
                data.content = data.content.replace("<#"+ key +">", this.changeCase[key]);
            }
        }

        //判斷傳入的模式決定資料的處理
        if(this.changeType != 'quest'){
            if (this.reviewNo != ''){
                await this.$questMainApi.getTelChangeMainDataUsingPOST(this.reviewNo).then((resp) => {
                    this.defaultTelChange = resp.data;
                    //帶入相關資料
                    this.questList[0].disable = true;
                    if(this.defaultTelChange["noWill"] == null){
                        this.questList[0].answer = "";
                    }else{
                        if(this.defaultTelChange["noWill"] == "Y"){
                            this.questList[0].answer = "N";
                        }
                    }

                    this.questList[1].disable = true;
                    if(this.defaultTelChange["clickRecord"] == null){
                        this.changeCase.cancelPlayRecord = "Y";
                    }else{
                        this.changeCase.cancelPlayRecord = "N";
                    }

                    this.questList[2].disable = true;
                    if(this.defaultTelChange["agreeRecord"] == null){
                        this.questList[2].answer = "";
                    }else{
                        if(this.defaultTelChange["agreeRecord"] == 'Y'){
                            this.questList[2].answer = "Y";
                        }else if(this.defaultTelChange["agreeRecord"] == 'N'){
                            this.questList[2].answer = "N";
                        }
                        this.radioAns["item03"] =  this.questList[2].answer;
                    }

                    this.questList[4].disable = true;
                    if(this.defaultTelChange["agreeChange"] == null){
                        this.questList[4].answer = "";
                    }else{
                        if(this.defaultTelChange["agreeChange"] == 'Y'){
                            this.questList[4].answer = "Y";
                        }else if(this.defaultTelChange["agreeChange"] == 'N'){
                            this.questList[4].answer = "N";
                        }
                        this.radioAns["item05"] =  this.questList[4].answer;
                    }

                    if(this.isReSend){
                        this.questList[5].disable = false;
                        this.questList[6].disable = false;
                        this.questList[8].disable = false;
                    }else{
                        this.questList[5].disable = true;
                        this.questList[6].disable = true;
                        this.questList[8].disable = true;
                    }
                    if(this.defaultTelChange["changeMobile"] == null){
                        this.questList[5].answer = "";
                    }else{
                        this.questList[5].answer = this.defaultTelChange["changeMobile"];
                        this.inputAns["item06"] =  this.defaultTelChange["changeMobile"];
                    }

                    if(this.defaultTelChange["changeEmail"] == null){
                        this.questList[6].answer = "";
                    }else{
                        this.questList[6].answer = this.defaultTelChange["changeEmail"];
                        this.inputAns["item07"] =  this.defaultTelChange["changeEmail"];
                    }

                    if(this.defaultTelChange["agreeENotice"] == null){
                        this.questList[8].answer = "";
                    }else{
                        if(this.defaultTelChange["agreeENotice"] == 'Y'){
                            this.questList[8].answer = "Y";
                        }else if(this.defaultTelChange["agreeENotice"] == 'N'){
                            this.questList[8].answer = "N";
                        }
                        this.radioAns["item09"] =  this.questList[8].answer;
                    }

                    this.questList[10].disable = true;

                    console.log( this.questList );

                    //更新物件顯示
                    this.$forceUpdate();

                }).catch((err) => {
                    console.log(err);
                }).finally(() => {
                    this.$emit('resultLoading',true)
                });
            }
        }else{
            this.$emit('resultLoading',true)
        }    
        
    }

    /** 清除電話變更作業資料 */
    resetChangeCase(){
        for(let key in this.changeCase){
            this.changeCase[key] = "";
        }
    }

    /** 取得該受訪者ID是否有簽核中電話變更作業 */
    getChangeCaseCount(caseNo, callBack) {
        this.$questMainApi.getChangeCaseCountUsingGET(caseNo)
        .then((resp) => {
        callBack(resp.data);
        })
        .catch((err) => {
        console.log(err);
        })
        .finally(() => {
        });
    }

    /** 電話變更儲存 */
    submitChangeWork() {
        
        //***檢核 - 400條件***
        let condition = true;

        //檢核 - 該受訪者ID不可有簽核中電話變更作業
        this.getChangeCaseCount(this.changeCaseNo, (count) => {
        if( !condition || count > 0 ){
            ErrorModalUtil.modalError("不符合電話變更作業條件");
            return;
        }

        console.log("判斷條件通過並進行儲存");
        });

    }

    //checkbox value
    clickCheckboxAnswer(event, item, check) {
        var telCont;
        let index = 0;
        for(telCont in this.questList){
            let telItem = this.questList[telCont].item;
            if (item == telItem){
                index = telCont;
                break;
            }
        }
        if(this.questList[index].item == 'item01'){
            if(event.target.checked){
                this.questList[index].answer = "true";
            }else{
                this.questList[index].answer = "false";
            }
        }
        
        this.setContentVerify();
        
    }

    //radio value 
    clickRadioAnswer(item, radio){
        var telCont;
        let index = 0;
        for(telCont in this.questList){
            let telItem = this.questList[telCont].item;
            if (item == telItem){
                index = telCont;
                break;
            }
        }
        if(this.questList[index].item == 'item03'){
            this.questList[index].answer = radio.value;
            this.radioAns["item03"] = radio.value;
        }
        if(this.questList[index].item == 'item05'){
            this.questList[index].answer = radio.value;
            this.radioAns["item05"] = radio.value;
        }
        if(this.questList[index].item == 'item09'){
            this.questList[index].answer = radio.value;
            this.radioAns["item09"] = radio.value;
        }

        if(this.changeType == 'quest'){
            this.setContentVerify();
        }

    }

    //button check
    clickButtonAnswer(item, button){
        var telCont;
        let index = 0;
        for(telCont in this.questList){
            let telItem = this.questList[telCont].item;
            if (item == telItem){
                index = telCont;
                break;
            }
        }
        if(this.questList[index].item == 'item02'){

            //檢核
            if( callUpInfoModule.callUpInfo == null ){
                ErrorModalUtil.modalError( "尚未有撥打記錄" );
                return;
            }else if( validationUtil.isEmpty(callUpInfoModule.callUpInfo.sessionId) ){
                ErrorModalUtil.modalError( "尚未有撥打記錄" );
                return;
            }

            //播放語音宣告
            this.$questMainApi.playDialerRecordUsingGET(this.changeCase.packNo, callUpInfoModule.callUpInfo.sessionId)
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

            this.questList[index].answer = "Y";
            this.setContentVerify();

        }

        if(this.questList[index].item == 'item11'){
            this.sendSubmit(button.value);
        }

    }

    //text 
    textChange(event, item){
        var telCont;
        let index = 0;
        for(telCont in this.questList){
            let telItem = this.questList[telCont].item;
            if (item == telItem){
                index = telCont;
                break;
            }
        }
        if(this.questList[index].item == 'item06'){
            this.questList[index].answer = event.target.value;
            this.inputAns["item06"] = event.target.value;
        }
        if(this.questList[index].item == 'item07'){
            this.questList[index].answer = event.target.value;
            this.inputAns["item07"] = event.target.value;
        }

        if(this.changeType == 'quest'){
            this.setContentVerify();
        }else{
            this.setDefaultContentVerify();
        }

    }

    sendSubmit(type){
        if(type == 'submit'){
            if(this.changeCase.cancelPlayRecord != 'Y'){
                if((this.questList[1].answer != 'Y' && !this.questList[1].disable)){
                    ErrorModalUtil.modalError( "尚有問項未回答" );
                    return;
                }
            }
            if(!this.questList[2].disable && validationUtil.isEmpty(this.questList[2].answer)){
                ErrorModalUtil.modalError( "尚有問項未回答" );
                    return;
            }
            if(!this.questList[4].disable && validationUtil.isEmpty(this.questList[4].answer)){
                ErrorModalUtil.modalError( "尚有問項未回答" );
                    return;
            }
            if(!this.questList[8].disable && validationUtil.isEmpty(this.questList[8].answer)){
                ErrorModalUtil.modalError( "尚有問項未回答" );
                return;
            }
            if(this.questList[4].answer == 'Y' && validationUtil.isEmpty(this.questList[5].answer) && validationUtil.isEmpty(this.questList[6].answer)){
                ErrorModalUtil.modalError( "手機號碼或電子信箱擇一必填" );
                this.questList[5].status = "error";
                this.questList[6].status = "error";
                return;
            }
            if(this.questList[4].answer == 'Y' && !validationUtil.isEmpty(this.questList[5].answer) ){
                var regex = /^[0-9]{10}$/;
                if(!this.questList[5].answer.match(regex)){
                    ErrorModalUtil.modalError( "手機欄位請輸入十碼數字" );
                    this.questList[5].status = "error";
                    return;
                }

            }
        }

        //檢核
        if( callUpInfoModule.callUpInfo == null ){
            ErrorModalUtil.modalError( "尚未有撥打記錄" );
            return;
        }else if( validationUtil.isEmpty(callUpInfoModule.callUpInfo.sessionId) ){
            ErrorModalUtil.modalError( "尚未有撥打記錄" );
            return;
        }
        
        let currentPackNoGuid = PackMatchModule.pickupResult.firstCasePack.packLogNo;
        let currentPackNo = this.changeCase.packNo;
        let currentCaseNo = this.changeCase.caseNo;
        let codingNo = callUpInfoModule.callUpInfo.codingNo;
        
        this.questTelDto = {};
        this.questTelDto.submitType = type;
        this.questTelDto.packNoGuid = currentPackNoGuid;
        this.questTelDto.packNo = currentPackNo;
        this.questTelDto.caseNo = currentCaseNo;
        this.questTelDto.codingNo = codingNo;
        this.questTelDto.noWill = this.questList[0].answer;
        this.questTelDto.clickRecord = this.questList[1].answer;
        this.questTelDto.agreeRecord = this.questList[2].answer;
        this.questTelDto.agreeRChange = this.questList[4].answer;
        this.questTelDto.changeMobile = this.questList[5].answer;
        this.questTelDto.changeEmail = this.questList[6].answer;
        this.questTelDto.agreeENotice = this.questList[8].answer;

        LoadingUtil.show();
        this.$questMainApi.doSaveTelContentUsingPOST(this.questTelDto)
        .then((resp) => {

            if(type == 'submit'){
                Modal.warning({
                    title: "注意",
                    content: "已送出申請電話變更作業",
                    okText: "確定",
                    centered: true
                });
            }else if(type == 'clean'){
                Modal.warning({
                    title: "注意",
                    content: "已完成取消電話變更作業",
                    okText: "確定",
                    centered: true
                });
            }

            if( resp.data == 'S' as any ){
                this.questList[0].disable = true;
                this.questList[1].disable = true;
                this.questList[2].disable = true;
                this.questList[3].disable = true;
                this.questList[4].disable = true;
                this.questList[5].disable = true;
                this.questList[6].disable = true;
                this.questList[7].disable = true;
                this.questList[8].disable = true;
                this.questList[9].disable = true;
                this.questList[10].disable = true;
            }

        })
        .catch((err) => {
            console.log(err);
            ErrorModalUtil.modalError( "系統發生錯誤，請聯絡系統管理員處理(sendSubmit error)" );
            return;
        })
        .finally(() => LoadingUtil.close());

    }

    setContentVerify(){
        
        //item01 this.questList[0]
        if(this.questList[0].answer == 'true'){
            this.questList[1].disable = true;
            this.questList[2].disable = true;
            this.questList[2].answer = "";
            this.questList[4].disable = true;
            this.questList[4].answer = "";
            this.questList[5].disable = true;
            this.questList[5].answer = "";
            this.questList[6].disable = true;
            this.questList[6].answer = "";
            this.questList[8].disable = true;
            this.questList[8].answer = "";
            this.questList[9].content = this.endTypeTwo;
            this.radioAns = {item03:"",item05:"",item09:""};
            this.inputAns = {item06:"",item07:""};
        }else if(this.questList[0].answer == 'false'){
            this.questList[1].disable = false;
            this.questList[9].content = this.endTypeOne;
        }

        //item02 this.questList[1]
        if((this.questList[0].answer == 'false' && this.questList[1].answer == 'Y') || this.changeCase.cancelPlayRecord == 'Y'){
            this.questList[2].disable = false;
        }else{
            this.questList[2].disable = true;
            this.questList[2].answer = "";
            this.radioAns["item03"] = "";
        }

        //item03 this.questList[2]
        if(this.questList[2].answer == 'Y'){
            this.questList[4].disable = false;
            this.questList[5].disable = false;
            this.questList[6].disable = false;
            this.questList[8].disable = false;
        }else if(this.questList[2].answer == 'N' || this.questList[2].answer == ''){
            this.questList[4].disable = true;
            this.questList[4].answer = "";
            this.questList[5].disable = true;
            this.questList[5].answer = "";
            this.questList[6].disable = true;
            this.questList[6].answer = "";
            this.questList[8].disable = true;
            this.questList[8].answer = "";
            this.radioAns["item05"] = "";
            this.radioAns["item09"] = "";
            this.inputAns = {item06:"",item07:""};
            this.questList[9].content = this.endTypeTwo;
        }

        //item05 this.questList[4]
        if(this.questList[4].answer == 'Y'){
            this.questList[5].disable = false;
            this.questList[6].disable = false;
            this.questList[8].disable = false;
            this.questList[9].content = this.endTypeOne;
        }else if(this.questList[4].answer == 'N'){
            this.questList[5].disable = true;
            this.questList[5].answer = "";
            this.questList[6].disable = true;
            this.questList[6].answer = "";
            this.questList[8].disable = true;
            this.questList[8].answer = "";
            this.radioAns["item09"] = "";
            this.inputAns = {item06:"",item07:""};
            this.questList[9].content = this.endTypeTwo;
        }

        //item06 this.questList[5]
        //item07 this.questList[6]
        if( !validationUtil.isEmpty(this.questList[5].answer) || !validationUtil.isEmpty(this.questList[6].answer)){
            this.questList[8].disable = false;
        }else{
            this.questList[8].disable = true;
            this.questList[8].answer = "";
            this.radioAns["item09"] = "";
        }
        if(!validationUtil.isEmpty(this.questList[5].answer) && !validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "電子郵件【email】/手機簡訊";
        }else if(!validationUtil.isEmpty(this.questList[5].answer) && validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "手機簡訊";
        }else if(validationUtil.isEmpty(this.questList[5].answer) && !validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "電子郵件【email】";
        }else{
            this.changeCase.showType = "";
        }
        this.questList[8].content = this.emailOrPhoneString.replace("<#showType>", this.changeCase.showType);

        //後續有任何異動清除紅框顯示
        this.questList[5].status = "";
        this.questList[6].status = "";

        console.log(this.questList);
        //更新物件顯示
        this.$forceUpdate();

    }

    setDefaultContentVerify(){
        if(!validationUtil.isEmpty(this.questList[5].answer) && !validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "電子郵件【email】/手機簡訊";
        }else if(!validationUtil.isEmpty(this.questList[5].answer) && validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "手機簡訊";
        }else if(validationUtil.isEmpty(this.questList[5].answer) && !validationUtil.isEmpty(this.questList[6].answer)){
            this.changeCase.showType = "電子郵件【email】";
        }else{
            this.changeCase.showType = "";
        }
        this.questList[8].content = this.emailOrPhoneString.replace("<#showType>", this.changeCase.showType);

        //後續有任何異動清除紅框顯示
        this.questList[5].status = "";
        this.questList[6].status = "";
    }

    cancelPlayRecord(event){
        if(event.target.checked == true){
          this.changeCase.cancelPlayRecord = "Y";
        } else {
          this.changeCase.cancelPlayRecord = "N";
        }
        this.setContentVerify();
    }

    /**
     * @author B0845
     * @deprecated 電話變更編輯送出
     */
    questTelChange(){
        this.questTelDto.changeMobile = this.questList[5].answer;
        this.questTelDto.changeEmail = this.questList[6].answer;
        this.questTelDto.agreeENotice = this.questList[8].answer;
        return this.$questMainApi.saveTelChangeMainDataUsingPOST(this.questTelDto, this.reviewNo)
        .then((resp:AxiosResponse<OutputDto>) => resp.data)
        .catch(error => console.error(error))
    }

}