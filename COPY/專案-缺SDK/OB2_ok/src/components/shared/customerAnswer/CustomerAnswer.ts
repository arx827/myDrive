import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QuestAllData } from "@/pages/onDuty/model";
import validationUtil from "@/assets/config/ValidationUtil";

@Component
export default class CustomerAnswer extends Vue {
    @Prop()
    public custType: string; //保戶回答類型(open:開場白, checkId:核身, quest:問卷, end:結束語)

    @Prop()
    public questAllData: QuestAllData; //問卷所有區塊資料

    @Prop()
    public caseNo: string; //案件編號(問卷、結束語區塊才需傳入)

    @Prop()
    public itemCode: string; //題目編號(問卷區塊才需傳入)

    @Prop()
    public packNo: string; //判斷是否切件決定是否關閉保戶回答視窗
    
    /** 保戶回答歷程內容 */
    custHisAnswer: string = "";

    /** 保戶回答內容 */
    custAnswer: string = "";

    /** 顯示/隱藏開關 */
    isDisplay: boolean = false;

    /** 回答區塊位置 */
    position = {};

    /** 取得開合按鈕位置 */
    get style():string {
        return (this.custType == "quest" || this.custType == "end")? "right:-10px;":"";
    }

    created() {
        //監聽視窗 resize、scroll 時收合保戶回答窗
        window.addEventListener("resize", this.reset);
        window.addEventListener("scroll", this.reset);

        //塞入保戶回答歷程、保戶回答
        this.setAnswer();
    }

    mounted() {
        //滾動、收起事件加入自動關閉保戶回答視窗
        const ref = (this.custType == "end")? this.$parent.$parent.$refs :
                    (this.custType == "quest")? this.$parent.$parent.$parent.$refs : this.$parent.$refs;

        (ref.sectionLeft as any).addEventListener("scroll", this.reset);
        (ref.headerOpen as any).$refs.collapse.addEventListener("click", this.reset);
        (ref.headerCheckId as any).$refs.collapse.addEventListener("click", this.reset);
        (ref.headerQuest as any).$refs.collapse.addEventListener("click", this.reset);
    }

    @Watch("questAllData", {deep:true})
    setCustHisAnswer() {
        //塞入保戶回答歷程、保戶回答
        console.log("設置保戶回答")
        this.setAnswer();

        //如核身區塊答案為「不需核身(N)」關閉並灰化核身區塊保戶回答窗
        let style = "";
        if( this.questAllData.answer.checkId == "N" && this.custType == "checkId" ){
            this.reset();
            style = "background-color:#c4c4c4; pointer-events:none;";
        }
        (this.$refs.arrowBtn as any).style = style;

    }

    @Watch("caseNo")
    changeCustHisAnswer() {
        //問卷頁籤切頁後更換保戶回答內容
        this.setAnswer();
        this.reset();
    }

    @Watch("packNo")
    closeCustomerBlock(){
        this.reset();
    }

    /** 收合保戶回答窗 */
    reset() {
        this.isDisplay = false;
        if( this.$refs.arrowBtn ) (this.$refs.arrowBtn as any).children[0].className = "arrow right";
    }

    /** 保戶回答開合按鈕點擊事件 */
    onCustAnsClick(event) {
        this.isDisplay = !this.isDisplay;
        
        let className = (!this.isDisplay)? "arrow right":"arrow left";
        event.target.children[0].className = className;

        this.setPosition();
    }

    /** 計算保戶回答窗位置 */
    setPosition() {
        const rect = (this.$refs.arrowBtn as any).getBoundingClientRect();
        const y = rect.top - 90;
        const x = rect.left + 25;

        this.position = {top:y + "px", left:x + "px"};
    }

    /** 設定顯示保戶回答及歷程 */
    setAnswer() {
        //依照階層取答案內容
        let custAnswer    = this.questAllData.custAnswer[this.custType];
        let custHisAnswer = this.questAllData.custHisAnswer[this.custType];
        if( !validationUtil.isEmpty(this.caseNo) ){
            custAnswer = custAnswer[this.caseNo];
            custHisAnswer = custHisAnswer[this.caseNo];
        }
        if( !validationUtil.isEmpty(this.itemCode) ){
            custAnswer = custAnswer[this.itemCode];
            custHisAnswer = custHisAnswer[this.itemCode];
        }

        //塞入保戶回答歷程
        this.custHisAnswer = custHisAnswer;

        //塞入保戶回答
        this.custAnswer = custAnswer;
    }

    /** 紀錄儲存保戶回答 */
    setCustAnswer(value) {
        this.custAnswer = value.target.value;

        //依照階層儲存答案內容
        if( !validationUtil.isEmpty(this.itemCode) ){
            this.questAllData.custAnswer[this.custType][this.caseNo][this.itemCode] = value.target.value;
        }else if( !validationUtil.isEmpty(this.caseNo) ){
            this.questAllData.custAnswer[this.custType][this.caseNo] = value.target.value;
        }else{
            this.questAllData.custAnswer[this.custType] = value.target.value;
        }
    }

    /** 取得按鈕的ClassName */
    getBtnClass():string {
        if(validationUtil.isEmpty(this.custHisAnswer) && validationUtil.isEmpty(this.custAnswer)){
            return "switchBtn";
        }else{
            return "switchRedBtn";
        } 
    }
}