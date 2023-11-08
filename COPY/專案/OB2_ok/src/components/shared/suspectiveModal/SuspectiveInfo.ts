import { Vue, Component, Prop } from "vue-property-decorator";
import DatePicker from '@fubonlife/vue2-datepicker';
import { FileGrid } from "./model";
import {  CaseCallUpHistoryInput, InfDayDto, InfSelectionDto, InfSendTargetDto, Option,  ReturnMailInfo } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import BlockHeader from '@/components/shared/block-header/BlockHeader.vue';
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import CallupHistory from "../form/history/callupHistory/CallupHistory.vue";
import MomentUtil from "@/assets/config/MomentUtil";

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
export default class SuspectiveInfo extends Vue {
  
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  caseType: string;

  @Prop()
  comInfInfoId: string;

  @Prop()
  propCaseNo: string;

  isCaseClosed: boolean = false;

  //下拉選單選項
  infDayList: InfDayDto[] = [];
  infTypeList: InfSelectionDto[] = [];
  infSendTargetList: InfSendTargetDto[] = [];
  infSecondSelection: Option[] = []; 
  infSubSelection: Option[] = [];
  infMainSelection: Option[] = [];
  infDepartmentSelection: Option[] = [];

  //是否已點選權益信函預覽
  isClickAdjunctPreview: boolean = false;
  //到期日最晚日期
  lastExpireDateString: string = "";
  //到期日最早日期
  earliestExpireDateString: string = "";
  //到期日hover是否顯示
  isExpireDateHoverVisible: boolean = false;
  // 選擇上傳檔案名稱
  selectedFileName: string = "";
  // 上傳按鍵wording變換
  isUploading: boolean = false;
  // 上傳檔案儲存變數
  uploadingFile: FileGrid = null;
  //第一層項目是否可選
  isSecondTypeDisable: boolean = true;
  //檔案清單
  fileList = [];

  //撥號歷程input
  callUpInput:CaseCallUpHistoryInput={
    caseNo:"",
    custId:"",
    guid:""
  };

  // 郵寄通知函資料
  mailInfo:ReturnMailInfo = {
    receiver:"",
    address:"",
    letterDate:"",
    mailByPostDate:"",
    manulLetterStatus:"",
    returnDate:"",
    returnReason:""
  };


 
  /**
  * Hook
  */
  created() {

      this.readonlyDataInfo();
  }

  //查詢唯讀資料
  readonlyDataInfo(){
    // LoadingUtil.show();
    this.callUpInput.caseNo = this.propCaseNo;
    this.$mailByPostApi.returnMailInfoUsingPOST(this.comInfInfoId).then((resp:AxiosResponse<ReturnMailInfo>) => {
      this.mailInfo = resp.data;
      // 日期轉民國年
      this.mailInfo.letterDate = MomentUtil.transformRocYearMonthDay(this.mailInfo.letterDate);
      this.mailInfo.mailByPostDate = MomentUtil.transformRocYearMonthDay(this.mailInfo.mailByPostDate);
      this.mailInfo.returnDate = MomentUtil.transformRocYearMonthDay(this.mailInfo.returnDate);
    }).catch(error => console.log(error))
    .finally(() => this.$emit('resultLoading',true))

  }

  //變更是否結案的參數
  changeCaseClosed(isCaseClosed){
    this.isCaseClosed = isCaseClosed;
  }

  //會辦內容變動
  onContentChange(){
    //還原判斷會辦單是否已預覽的flag
    this.$emit('emitUpdateInformPreviewFlag');
  }


  //案件編號
  caseNo:string='';
  updateCaseNo(caseNo){
    this.caseNo=caseNo;
    // console.log("this.caseNo"+this.caseNo);
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
  
}