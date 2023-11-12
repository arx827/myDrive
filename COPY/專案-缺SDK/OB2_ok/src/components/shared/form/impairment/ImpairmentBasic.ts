import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { ImpairmentInfoDto, InfFormCasePolicyDataDto, RiskControlDetailsDto, TobdHearingNote } from "@fubonlife/obd-api-axios-sdk";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from "../../data-grid/models";
import { AxiosResponse } from "axios";

@Component({})
export default class ImpairmentBasic extends Vue {
  // 接收到 prop 保單號碼時，欄位變成唯讀，不可編輯
  @Prop()
  basicCaseNo!: string;

  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  theRiskControlDetailsData: RiskControlDetailsDto;

  @Prop()
  tobdHearingNote: TobdHearingNote;

  @Prop()
  propPackNo?: string;

  // 保單資訊 (暫存，emit用)

  selectPolicyOptions = [];
  policyInfoDataList : InfFormCasePolicyDataDto[] = [];

  showimpairmentMarkReason: boolean = false;
  showimpairmentMarkReasoncode: boolean = false;
  impairmentgridData:ImpairmentInfoDto[]= [];

  policyInfoData= {
    custId: '--',
    custName: "--",
    pherId:"--",
  };
  impairmentgridInfo: any;

  /**
   * Func
   */
  // 初始化 保單資訊
  initPolicyData() {
    this.policyInfoData = {
      custId: '--',
      custName: "--",
      pherId:"--",
    };
  }
  getGridData() {
    LoadingUtil.show();
    this.getPolicyList();
    LoadingUtil.close();
  }

  getPolicyList() {
    LoadingUtil.show();
    this.initPolicyData();

    // 搬到外層判斷
    // LoadingUtil.show();
    this.$informApi.getImpairmentInfoByPackNoUsingPOST(this.propPackNo).then((resp)=>{
      let selected :ImpairmentInfoDto[] = resp.data;
      console.log("selected:"+selected[0]);
      this.policyInfoData = {
        custId: selected[0].custId,
        custName: selected[0].custName,
        pherId:selected[0].isImpairment,
      }    
    }).finally(()=>{
      LoadingUtil.close();
    })
  }


  /**
   * Hook
   */
  created() {
    LoadingUtil.show();
    this.getFirstPackNo();

    //取保單聽語障基本資料
    this.getPolicyList();
    // this.getFirstPackNo;
    LoadingUtil.close();


  }

  // 名單序號資訊(當前名單)
  getFirstPackNo() {
    if(VlidationUtil.isEmpty(this.propPackNo) != null && VlidationUtil.isEmpty(this.propPackNo) != null) {
      return this.propPackNo;
    }
  }

}


function impairmentPolicyDetailsAction() {
  throw new Error("Function not implemented.");
}
