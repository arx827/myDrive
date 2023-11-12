import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { AxiosResponse } from "axios";
import { NotiQuestTableDto } from '@fubonlife/obd-api-axios-sdk';

@Component({
  components: {
    FblDataGrid
  }
})
export default class NotificationModalInterview extends Vue {
  // 接收到 prop 保單號碼時，欄位變成唯讀，不可編輯
  @Prop()
  basicCaseNo!: string;

  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  caseLogId: string;

  //  判斷是不是review的狀態
  @Prop({default:false})
  isReview: boolean;

  // 是否修改過
  isModify: boolean = false;
  // 是否第一次監聽data
  isFirstValue: boolean = true;

  // 保單資訊 (暫存，emit用)
  form = {
    caseNo: undefined,
  }

  emitData = {
    intererviewLoading : false,
    intereviewData : null
  }

  interviewData= {
    casePolicy: '--',
    packNo: "",
    chageNo:"",
    custId: "",
    custName: "",
    custTypeName: '--',
    taskName: '--',
    pherId: '--',
    pherName: '--',
    insuId: '--',
    insuName: '--',
    agentNames: '--',
    legalId: '--',
    legalName: '--',
    underTaker: '--',
    underTakerEmail: '--',
    underTakerSupervisorEmail: '--',
    sysType: '--',
    channelsId: '--',
    caseNo: '--',
    agentUnitName: '--',
    contDate:"",
    contDateChange:"",
    agentUnitNo:"",
  };


  // 電訪內容 table
  gridFileData : FblPDataGridHolder<any> = {
    rowKey: 'index',
    data: [],
    columns: [
      {
        type: FblColumnType.PLAIN,
        title: this.$t('notificationInterview_number').toString(),  // 序號
        width: 60,
        align: 'center',
        property: 'index'
      },
      {
        type: FblColumnType.PLAIN,
        property: 'question',
        title: this.$t('notificationInterview_questContent').toString(),  // 電訪問卷
        width: 590,
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'answerInput',
        title: this.$t('notificationInterview_answerInput').toString(),  // 保戶回答
        width: 590,
      },
    ],
  };

  // ==================================================== Hook ================================================================

  /**
   * 監聽
   */
  @Watch('basicCaseNo')
  watchCaseNo(newVal) {
    if (newVal) {

      // 重新取得保戶回答資訊
      this.getAnswer();
    }
  }

  /**
   * @author B0845
   * @description 監聽是否有編輯保戶回答內容
   * @version 2022/10/20
   */
  @Watch('gridFileData',{deep:true})
  watchData(){

    if(!this.isModify){
      if(!this.isFirstValue){
        this.$emit("emitReviewStatus");
        this.isModify = true;
      } else {
        this.isFirstValue = false;
      }
    } 
  }

  created() {
    
  }

  // ==================================================== Event ===============================================================


  // ==================================================== Ajax ================================================================

  /**
   * @description 取得保戶回答資訊
   * 
   * @author B1529
   * @version 2022/07/05
   */
  getAnswer() {

    LoadingUtil.show();
    if(!VlidationUtil.isEmpty(this.basicCaseNo)){
      // 取得案件歷程代碼
      const caseLogId = VlidationUtil.isEmpty(this.caseLogId) ? CommonUtil.getCaseLogId(this.basicCaseNo) : this.caseLogId;

      this.$questionAnswerApi.getNotiFormatQuestionAnswerUsingPOST({
        CASE_NO : this.basicCaseNo,
        GUID : caseLogId
      }).then((resp:AxiosResponse<NotiQuestTableDto[]>) => {

        this.gridFileData.data = [];
        resp.data.forEach((item)=>{
          let newVal: any = item;
          newVal.validate = { hover: "", feedback: false, state: "success", msg: "", hoverVisible: false };
          this.gridFileData.data.push(newVal);
        })

          this.emitData.intererviewLoading = true;
          // 回傳資料給父畫面
          this.emitData.intereviewData = this.gridFileData.data;
          this.$emit('emitIntereview', this.emitData);
      }).catch((err) => {
          console.log(err);
          LoadingUtil.close();
      });
    }
    
  }

  // ==================================================== Validation ==========================================================

  // 保戶回答內容異動 驗證必填
  onAnswerChange(value, validate){
    if (VlidationUtil.isEmpty(value)) {
      // 保戶回答 必填
      CommonUtil.feildValidateWithVisible(validate, true, this.$t('notificationInterview_answerRequired').toString(), false);
    }else{
      CommonUtil.feildValidateWithVisible(validate, false, '', false);
    }
  }

  /**
   * @description 取得驗證參數
   * @param fv 
   * @returns 
   * 
   * @author B1529
   * @version 2022/06/13
   */
  callCommonUtilFeild(fv: ValidateFormComponent){
    return CommonUtil.getFeildValid(fv);
  }

  /**
   * @description 變更hover hoverVisivle參數
   * @param fv 
   * 
   * @author B1529
   * @version 2022/06/13
   */
  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

}