import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { AxiosResponse } from "axios";
import { GetTransitionInfoResDto,ImpairmentInfoDto,ImpairmentReviewHistoryDto,Option,ResponseEntity, RiskControlDetailsDto, TobdHearingNote, TSysCodeDto, TSysCommonCode } from "@fubonlife/obd-api-axios-sdk";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import VlidationUtil from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import MessageUtil from "@/assets/config/MessageUtil";



@Component({ components: { FblDataGrid } })
export default class ImpairmentForm extends Vue {

   // 縮合面板預設全開
  activeKey: string[] = ['1', '2'];

  // // checkbox 欄位
  // checkedObject = {};

  // 樣式選擇
  layoutStyle: string = "vertical";
  columnStyle: number = 6;
  sizeStyle: string = "small"
  beforeChangeStyle: string = "";
  afterChangeStyle: string = "border-left: 2px solid rgba(128, 128, 128, 0.5 );  border-collapse: collapse;";

  h = this.$createElement;
  //基本資料
  impairmentDtoInfo: ImpairmentInfoDto[] = [];

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
  showimpairmentMarkReason: boolean = false;
  //儲存是否成功
  saveImpairmentMarkInfoFlag: boolean = false;
  selectImpairmentMarkReasonOptions: Option[] = [];
  
  @Prop()
  theRiskControlDetailsData: RiskControlDetailsDto;

  @Prop()
  propPackNo?: string;
  
  tobdHearingNoteInfo: TobdHearingNote[];
  impairmentMarkReason: TSysCommonCode[];
  impairmentReviewHistory: ImpairmentReviewHistoryDto[];
  $res: any;

  
  // 名單序號資訊(主名單)
  get getMainPackNo() {
    if(VlidationUtil.isEmpty(PackMatchModule.pickupResult) != null && VlidationUtil.isEmpty(PackMatchModule.pickupResult.mainCasePack) != null) {
      return PackMatchModule.pickupResult.mainCasePack.packNo;
    }
  }

  // 名單序號資訊(當前名單)
  get getFirstPackNo() {
    if(VlidationUtil.isEmpty(PackMatchModule.pickupResult) != null && VlidationUtil.isEmpty(PackMatchModule.pickupResult.firstCasePack) != null) {
      return PackMatchModule.pickupResult.firstCasePack.packNo;
    }
  }

  // 歸戶提示訊息紀錄
  get tansitionResultInfo(){
    return PackMatchModule.transitionResult;
  }

  // 歷程欄位資料
  gridData = {
    rowKey: 'guid',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'createDate',
        width: 150,
        title: this.$t('proccessDate').toString(),       // 處理時間
        // formatter:(data:ImpairmentReviewHistoryDto)=>
        //         {return MomentUtil.formatStringDateDault(data.createDate)},
      },
      {
        type: FblColumnType.PLAIN,
        property: 'divName',
        width: 150,
        title: this.$t('global_division').toString(),       // 科別
      },
      {
        type: FblColumnType.PLAIN,
        property: 'createName',
        width: 150,
        title: this.$t('person').toString(),       // 人員
      },
      {
        type: FblColumnType.PLAIN,
        property: 'processContent',
        width: 150,
        title: this.$t('proccessContent').toString(),       // 處理內容
      },
      {
        type: FblColumnType.PLAIN,
        property: 'reviewStatus',
        width: 150,
        title: this.$t('handleInfoForm_naMemoTrs').toString(),       // 處理結果
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isAddNonHearing',
        width: 150,
        title: this.$t('IS_HEARING').toString(),       // 聽障
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isAddNonLanguage',
        width: 150,
        title: this.$t('IS_LANGUAGE').toString(),       // 語障
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isCancel',
        width: 150,
        title: this.$t('cancel_disabled').toString(),       // 註銷註記
      },
      {
        type: FblColumnType.PLAIN,
        property: 'cancelDisabledReason',
        width: 150,
        title: this.$t('cancel_disabled_reason').toString(),       // 註銷原因
      }
    ],
  };

  // 基本資料欄位資料
  impairmentgridData = {
    rowKey: 'guid',
    data: [],
    pagination: false,
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'codeName',
        width: 100,
        title: this.$t('pedding_custType').toString(),       // 受訪者身分
      },
      {
        type: FblColumnType.PLAIN,
        property: 'custId',
        width: 100,
        title: this.$t('pedding_custId').toString(),       // 受訪者ID
      },
      {
        type: FblColumnType.PLAIN,
        property: 'custName',
        width: 100,
        title: this.$t('pedding_custName').toString(),       // 受訪者姓名
      },
      {
        type: FblColumnType.PLAIN,
        property: 'policyNo',
        width: 100,
        title: this.$t('pedding_policyNo').toString(),       // 保單號碼
      },
      {
        type: FblColumnType.PLAIN,
        property: 'taskName',
        width: 100,
        title: this.$t('pedding_contactItem').toString(),       // 電訪項目
      },
      {
        type: FblColumnType.PLAIN,
        property: 'isImpairment',
        width: 100,
        title: this.$t('pedding_impairment').toString(),       // 聽語障
      }
    ],
  };

  // ============================================================================== Function ========================================================================

  /**
   * @description 取得歸戶換場清單
   * @author B1529
   * @version 2022/03/15
   */
  getGridData() {
    LoadingUtil.show();
    this.impairmentReviewHistoryAction();
    LoadingUtil.close();
  }

  //取保單聽語障基本資料
  impairmentPolicyDetailsAction() {
    LoadingUtil.show();
    const impairmentDtoInfo: Promise<void | AxiosResponse<ImpairmentInfoDto>> =
    this.$informApi.getImpairmentInfoByPackNoUsingPOST(this.getFirstPackNo)
      .then((res: AxiosResponse<ImpairmentInfoDto[]>) => {
        this.impairmentgridData.data = res.data;
        this.impairmentgridData.data.forEach((row)=>{
          if(row.isImpairment==="Y"){
            this.showimpairmentMarkReason = true;
            this.showimpairmentMarkReasoncode = true;
          }
        })
      }).catch(e => {
        ErrorModalUtil.modalError("取基本資料失敗:" +e.toString); // 取基本資料失敗
      }).finally(() => LoadingUtil.close());
      LoadingUtil.close();
  }

  //取聽語障註記資料
  impairmentDetailsAction() {
    LoadingUtil.show();
    const tobdHearingNoteInfo: Promise<void | AxiosResponse<TobdHearingNote>> =
    this.$informApi.getImpairmentMarkInfoByPackNoUsingPOST(this.getFirstPackNo)
      .then((resp: AxiosResponse<TobdHearingNote[]>) => {
        this.tobdHearingNoteInfo = resp.data;
          if(this.tobdHearingNoteInfo[0].isAddNonHearing==="Y"){
            this.chkIsAddNonHearing=true;
            this.chkIsAddNonHearingrtn="Y";
          }

          if(this.tobdHearingNoteInfo[0].isAddNonLanguage==="Y"){
            this.chkisAddNonLanguage=true;
            this.chkisAddNonLanguagertn="Y";
          }
          this.impairmentMarkReasoncode = this.tobdHearingNoteInfo[0].cancelDisabledReason;
        }
        ).catch(e => {
          // ErrorModalUtil.modalError("取聽語障註記資料:" +e.toString); // 取聽語障註記資料
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
      }).finally(() => LoadingUtil.close());
      LoadingUtil.close();

  }

  //取聽語障歷程
  impairmentReviewHistoryAction() {
    LoadingUtil.show();
    this.$informApi.getImpairmentReviewHistoryUsingPOST(this.getFirstPackNo)
        .then((res : AxiosResponse<ImpairmentReviewHistoryDto[]>) => {
        this.impairmentReviewHistory = res.data;
        this.gridData.data = res.data;
        this.showimpairmentMarkReason = true;
        this.showimpairmentMarkReasoncode = false;
        
    }).catch(e => {
      ErrorModalUtil.modalError("取聽語障歷程:" +e.toString); // 取聽語障歷程
      this.gridData.data=[];
    }).finally(() => LoadingUtil.close());
    LoadingUtil.close();
  }


  
  // ================================================================== Event =====================================================================

  // 按鈕 『確定』
  onSubmit() {
    LoadingUtil.show();
    let currentPackNoGuid = PackMatchModule.pickupResult.firstCasePack.packLogNo;
    this.$informApi.saveImpairmentMarkInfoByPackNoUsingPOST(
      this.impairmentMarkReasoncode,
      this.chkIsAddNonHearingrtn,
      this.chkisAddNonLanguagertn,
      this.impairmentgridData.data[0].isImpairment,
      currentPackNoGuid,
      this.getFirstPackNo
      ).then((res : AxiosResponse<Boolean>) => {
        this.$res = this.saveImpairmentMarkInfoFlag;
        console.log('saveImpairmentMarkInfoFlag:'+this.saveImpairmentMarkInfoFlag);
        MessageUtil.messageSuccess(this.$t("eventS_dataSaved").toString()); //資料已儲存成功
      }).catch(e => {
        ErrorModalUtil.modalError(
          this.$t("global_save_failed").toString() // 資料儲存失敗
        );
      }).finally(() => LoadingUtil.close());
    this.$emit('onLeave');
    LoadingUtil.close();
  }

// 按鈕 『離開』
onLeave() {

  this.$emit('onLeave');
  LoadingUtil.close();
}

//原因下拉觸發事件
SelectOption(e){
  this.impairmentMarkReasoncode = e;
  LoadingUtil.close();
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

  // ===================================================================== Hooks =================================================================================

  created() {
    
    // 由於合併欄位 須在取得資料後 才處理合併，使用 async
    this.getGridData();

    //取保單聽語障基本資料
    this.impairmentPolicyDetailsAction();

    //取聽語障註記資料
    this.impairmentDetailsAction();

    //取聽語障註記下拉選單
    this.impairmentMarkReasonAction();

    //取聽語障歷程
    this.impairmentReviewHistoryAction();
    LoadingUtil.close();
  }
}