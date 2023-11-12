import { Vue, Component, Prop } from "vue-property-decorator";
import DatePicker from '@fubonlife/vue2-datepicker';
import { FileGrid } from "./model";
import {  CaseCallUpHistoryInput, InfDayDto, InfSelectionDto, InfSendTargetDto, Option,  ReturnMailInfo ,ImpairmentInfoDto, ImpairmentReviewHistoryDto, TobdHearingNote, TSysCommonCode} from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import BlockHeader from '@/components/shared/block-header/BlockHeader.vue';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CallupHistory from "@/components/shared/form/history/callupHistory/CallupHistory.vue";
import MomentUtil from "@/assets/config/MomentUtil";
import { FblColumnType } from "../../data-grid/models";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";

/**
 * @description 驗證收件人email格式
 * ex: aa@bb.cc 正確 (且結尾不能空白字串)
 */
const RECEIVER_ADDRESS_REGEX:RegExp = new RegExp(/\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]\S+$/);

@Component({
    components: { 
      DatePicker, 
      FblDataGrid, 
      BlockHeader,
      CallupHistory, 
    }
})
export default class ImpairmentInfo extends Vue {
  
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  caseType: string;

  @Prop()
  comInfInfoId: string;

  @Prop()
  propCaseNo: string;

  @Prop()
  propPackNo?: string;

  isCaseClosed: boolean = false;

  beforeChangeStyle: string = "";
  afterChangeStyle: string = "border-left: 2px solid rgba(128, 128, 128, 0.5 );  border-collapse: collapse;";

  //聽障要不要打勾
  chkIsAddNonHearing: boolean = false;
  chkIsAddNonHearingrtn: string = null;
  //語障要不要打勾
  chkisAddNonLanguage: boolean = false;
  chkisAddNonLanguagertn: string = null;
  //註銷聽語障原因代碼
  impairmentMarkReasoncode: string = null;
  //註銷聽語障原因顯示
  showimpairmentMarkReasoncode: boolean = false;
  //儲存是否成功
  saveImpairmentMarkInfoFlag: boolean = false;
  selectImpairmentMarkReasonOptions: Option[] = [];

  tobdHearingNoteInfo: TobdHearingNote[];
  impairmentMarkReason: TSysCommonCode[];
  impairmentReviewHistory: ImpairmentReviewHistoryDto[];
  $res: any;
  showimpairmentMarkReason: boolean = false;


 // 縮合面板預設全開
 activeKey: string[] = ['1', '2'];

  /**
  * Hook
  */
  created() {

    // this.readonlyDataInfo();
    LoadingUtil.show();

    this.getFirstPackNo();
    //取保單聽語障基本資料
    this.impairmentDetailsAction();
    //取聽語障註記下拉選單
    this.impairmentMarkReasonAction()
    LoadingUtil.close();    
  }


  //變更是否結案的參數
  changeCaseClosed(isCaseClosed){
    this.isCaseClosed = isCaseClosed;
  }


  /**
  * @description 案件調閱
  * 
  * @author B0845
  * @version 2022/08/30
   */
  caseCheck() {
    this.$emit('caseCheck');
  }

  //取聽語障註記資料
  impairmentDetailsAction() {
    LoadingUtil.show();
    const tobdHearingNoteInfo: Promise<void | AxiosResponse<TobdHearingNote>> =
    this.$informApi.getImpairmentMarkInfoByPackNoUsingPOST(this.propPackNo)
      .then((resp: AxiosResponse<TobdHearingNote[]>) => {
        this.tobdHearingNoteInfo = resp.data;
        this.tobdHearingNoteInfo.forEach((row)=>{
          if(row.isAddNonHearing==="Y"){
            this.chkIsAddNonHearing=true;
            this.chkIsAddNonHearingrtn="Y";
          }
        })
        this.tobdHearingNoteInfo.forEach((row)=>{
          if(row.isAddNonLanguage==="Y"){
            this.chkisAddNonLanguage=true;
            this.chkisAddNonLanguagertn="Y";
          }
        })
        this.impairmentMarkReasoncode = this.tobdHearingNoteInfo[0].cancelDisabledReason;
      }).catch(e => {
        ErrorModalUtil.modalError("取聽語障註記資料:" +e.toString); // 取聽語障註記資料
        this.chkisAddNonLanguage=false;
            this.chkisAddNonLanguagertn="N";
      }).finally(() => LoadingUtil.close());
      LoadingUtil.close();
  }

  //取聽語障註記下拉選單
  impairmentMarkReasonAction() {
    LoadingUtil.show();
    const impairmentMarkReason: Promise<void | AxiosResponse<TSysCommonCode>> =
    this.$informApi.getImpairmentMarkReasonUsingPOST()
      .then((resp: AxiosResponse<TSysCommonCode[]>) => {
        this.impairmentMarkReason = resp.data;
        this.impairmentMarkReason.forEach((row)=>{
          this.selectImpairmentMarkReasonOptions.push({ label: row.codeName, value: row.code });
      })
      }).catch(e => {
        // ErrorModalUtil.modalError("取聽語障註記下拉選單資料:" +e.toString); // 取聽語障註記資料
        this.impairmentMarkReason=null;
        this.selectImpairmentMarkReasonOptions.push({ label: "", value: "" });
      }).finally(() => LoadingUtil.close());
      LoadingUtil.close();

  }
  // 名單序號資訊(當前名單)
  getFirstPackNo() {
    if(VlidationUtil.isEmpty(this.propPackNo) != null && VlidationUtil.isEmpty(this.propPackNo) != null) {
      return this.propPackNo;
    }
  }

//聽障勾選觸發事件
chkIsAddNonHearingOption(){
  this.chkIsAddNonHearing = !this.chkIsAddNonHearing;
  if(this.chkIsAddNonHearing){
    this.chkIsAddNonHearingrtn = "Y"
  }else{
    this.chkIsAddNonHearingrtn = "N"
  }
  console.log("Hearing後"+this.chkIsAddNonHearingrtn);
  LoadingUtil.close();
}

//語障勾選觸發事件
chkisAddNonLanguageOption(){
  this.chkisAddNonLanguage = !this.chkisAddNonLanguage;
  if(this.chkisAddNonLanguage){
    this.chkisAddNonLanguagertn = "Y"
  }else{
    this.chkisAddNonLanguagertn = "N"
  }
  LoadingUtil.close();
}

//原因下拉觸發事件
SelectOption(e){
  this.impairmentMarkReasoncode = e;
  LoadingUtil.close();
}

  
}

