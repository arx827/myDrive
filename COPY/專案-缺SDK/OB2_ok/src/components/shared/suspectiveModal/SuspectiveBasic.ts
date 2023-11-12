import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { LoginModule } from "@/plugins/store/LoginModule";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { InfFormCasePolicyDataDto } from "@fubonlife/obd-api-axios-sdk";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class SuspectiveBasic extends Vue {
  // 接收到 prop 保單號碼時，欄位變成唯讀，不可編輯
  @Prop()
  basicCaseNo!: string;

  @Prop()
  isEdit: boolean;    // 編輯狀態

  // 保單資訊 (暫存，emit用)
  form = {
    caseNo: undefined,
  }
  selectPolicyOptions = [];
  policyInfoDataList : InfFormCasePolicyDataDto[] = [];

  policyInfoData= {
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

  /**
   * Func
   */
  // 初始化 保單資訊
  initPolicyData() {
    this.policyInfoData = {
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
  }
  // 取得 多筆基本資料 資訊
  getPolicyList() {
    // 搬到外層判斷
    // LoadingUtil.show();
    this.selectPolicyOptions = [];
    this.$informApi.initInformBasicUsingGET(PackMatchModule.pickupResult.firstCasePack.packNo).then((resp)=>{
      this.policyInfoDataList = resp.data;
      resp.data.forEach((item)=>{
        //若保單號碼為空，改抓取受理案號資訊
        if(VlidationUtil.isEmpty(item.casePolicy)){
          this.selectPolicyOptions.push({label: item.changeNo, value: item.caseNo})
        }else{
          this.selectPolicyOptions.push({label: item.casePolicy, value: item.caseNo})
        }
      })
      // this.form.policyNo = "";
      this.form.caseNo = "";
      // this.form.policyNo = this.selectPolicyOptions[0].label;
      this.form.caseNo = this.selectPolicyOptions[0].value;
    }).catch((err)=>{
      // 會辦基本資料區塊載入失敗
      ErrorModalUtil.modalError(this.$t('infBasic_basicInfoLoadingFailed').toString());
    }).finally(()=>{
      // 搬到外層判斷
      // LoadingUtil.close();
      this.getPolicyData();
      this.$emit('basicLoading',true);
    });
  }

  // 從多筆資料內取得選取的基本資料資訊
  getPolicyData() {
    this.initPolicyData();
    let selected :InfFormCasePolicyDataDto = this.policyInfoDataList.find((item)=> item.caseNo == this.form.caseNo);
    // 利用保單號碼 this.policyNo 查找資料
    this.policyInfoData = {
      casePolicy: selected.casePolicy,
      packNo: selected.packNo,
      chageNo:selected.changeNo,
      custId: selected.custId,
      custName: selected.custName,
      custTypeName: selected.custTypeName,
      taskName: selected.taskName,
      pherId: selected.pherId,
      pherName: selected.pherName,
      insuId: selected.insuId,
      insuName: selected.insuName,
      agentNames: this.getAgentNames(selected.agentName, selected.agentName2),
      legalId: selected.legalId,
      legalName: selected.legalName,
      underTaker: selected.undertaker,
      underTakerEmail: selected.undertakerEmail,
      underTakerSupervisorEmail: selected.undertakerSupervisorEmail,
      sysType: selected.sysType,
      channelsId: selected.channelsId,
      caseNo: selected.caseNo,
      agentUnitName: selected.agentUnitName,
      contDate:selected.contDate,
      contDateChange:selected.contDateChange,
      agentUnitNo:selected.agentUnitNo,
    };
    //還原是否預覽的FLAG(權益信函與會辦單)
    this.$emit("emitInitInformPreviewFlag");
    //變更是否結案的參數
    this.$emit("emitIsCaseClosed",selected.closed );
    //更新通路類型資訊
    this.$emit("emitChannelsId",selected.channelsId );
  }

  // 取得 單筆基本資料資訊 資訊
  getOneRecordData() {
    this.initPolicyData();
    // 搬到外層判斷
    // LoadingUtil.show();
    this.$informApi.initInformBasicReadOnlyUsingGET(this.basicCaseNo).then((resp)=>{
      let selected :InfFormCasePolicyDataDto = resp.data;
      this.policyInfoData = {
        casePolicy: selected.casePolicy,
        packNo: selected.packNo,
        chageNo:selected.changeNo,
        custId: selected.custId,
        custName: selected.custName,
        custTypeName: selected.custTypeName,
        taskName: selected.taskName,
        pherId: selected.pherId,
        pherName: selected.pherName,
        insuId: selected.insuId,
        insuName: selected.insuName,
        agentNames: this.getAgentNames(selected.agentName, selected.agentName2),
        legalId: selected.legalId,
        legalName: selected.legalName,
        underTaker: selected.undertaker,
        underTakerEmail: selected.undertakerEmail,
        underTakerSupervisorEmail: selected.undertakerSupervisorEmail,
        sysType: selected.sysType,
        channelsId: selected.channelsId,
        caseNo: selected.caseNo,
        agentUnitName: selected.agentUnitName,
        contDate:selected.contDate,
        contDateChange:selected.contDateChange,
        agentUnitNo:selected.agentUnitNo,
      };
      if(VlidationUtil.isEmpty(selected.casePolicy)){
        this.selectPolicyOptions.push({label: selected.changeNo, value: selected.caseNo})
      }else{
        this.selectPolicyOptions.push({label: selected.casePolicy, value: selected.caseNo})
      }
      //還原是否預覽的FLAG(權益信函與會辦單)
      this.$emit("emitInitInformPreviewFlag");
      //變更是否結案的參數
      this.$emit("emitIsCaseClosed",selected.closed );
      //更新通路類型資訊
      this.$emit("emitChannelsId",selected.channelsId );
    }).finally(()=>{
      this.$emit('basicLoading',true);
      // 搬到外層判斷
      // LoadingUtil.close();
    })
  }

  //取得承辦與承辦主管email資訊
  getEmailInfo(){
    let emailInfo = {underTakerEmail: this.policyInfoData.underTakerEmail, underTakerSupervisorEmail : this.policyInfoData.underTakerSupervisorEmail}
    return emailInfo;
  }

  //取得通路資訊
  getChannelIdInfo(){
    let channelsIdInfo = this.policyInfoData.channelsId;
    return channelsIdInfo;
  }

  //組合業務員姓名
  getAgentNames(name1, name2){
    let s = "";
    if(!VlidationUtil.isEmpty(name1) && !VlidationUtil.isEmpty(name2)){
      s = name1 + " / " + name2;
    }else if(VlidationUtil.isEmpty(name1)){
      s = name2;
    }else{
      s = name1;
    }
    return s;
  }


  /**
   * Hook
   */
  created() {
    if(this.basicCaseNo) {
      // 有prop保單號碼，直接查找資料
      this.form.caseNo = this.basicCaseNo;
      this.getOneRecordData();
    }else{
      this.getPolicyList();
    }
  }

  /**
   * 監聽
   */
  // 若 變更案件 就 emit父層
  @Watch('form.caseNo')
  watchForm(newVal) {
    if (newVal) {
      this.$emit('emitCaseNo', this.form.caseNo);
    }
  }

  //取得基本資料區塊資料
  getInfBasicData(){
    return this.policyInfoData;
  }
}