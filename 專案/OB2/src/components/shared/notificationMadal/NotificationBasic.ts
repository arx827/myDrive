import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { NotiPolicySelectDto, NotiBasicInfoDto } from "@fubonlife/obd-api-axios-sdk";
import { Vue, Component, Prop, Watch, PropSync } from "vue-property-decorator";
import NotificationCallUpAgentModal from "./NotificationCallUpAgentModal.vue";
import { AxiosResponse } from "axios";
import { PackMatchModule } from '@/plugins/store/packMatchModule';
import { Modal } from "ant-design-vue"
import { AgentPersonModule } from '@/plugins/store/CallUpAgentModule';

@Component({ components: { NotificationCallUpAgentModal } })
export default class NotificationModalBasic extends Vue {
  // 接收到 prop 保單號碼時，欄位變成唯讀，不可編輯
  @Prop()
  basicCaseNo!: string;

  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  notiInfoId: string; // 照會作業單號

  @Prop({default:false})
  isReview: boolean;

  // 聯絡業務員彈窗顯示
  contactAgentShow: boolean = false;

  // 是否為結案案件
  isCaseClosed: boolean = false;

  // 保單下拉選單
  selectPolicyOptions = [];

  // 業務員
  agentName: string = '';

  // 保單資訊 (暫存，emit用)
  form = {
    caseNo: undefined,
    notiInfoId: '',
    basicLoading: false
  }
  
  // 基本資料
  basicInfoData : NotiBasicInfoDto= {
    caseNo: '',
    agentId: '',
    agentName: '',
    agentSencondId: '',
    agentSencondName: '',
    agentUnitName: '',
    casePolicy: '',
    custName: '',
    custType: '',
    custTypeDes: '',
    editCallUp: false,
    insuName: '',
    notiCount: '',
    notiInfoId: '',
    pherName: '',
    sysType: '',
    taskId: '',
    taskName: '',
    caseCloseReasonCode: ''
  };

  // 回傳資料
  emitData = {
    basicLoading : false,
    basicInfoData : null
  }

  // ==================================================== Hook ==========================================================

  /**
   * @description 初始化
   * 
   * @author B1529
   * @version 2022/06/09
   */
   created() {

    // 有傳入案件編號
    if(!VlidationUtil.isEmpty(this.basicCaseNo)) {
      this.form.caseNo = this.basicCaseNo;
    }

    // 有傳入照會單號
    if(!VlidationUtil.isEmpty(this.notiInfoId)){
      this.form.notiInfoId = this.notiInfoId;
    }

    // 開單狀態時
    if(this.isEdit){

      // 取得照會作業單號
      this.getNotiInfoId();
    } else {

      // 取得基本資料
      this.getBasicInfo();
    }
  }

  // ==================================================== Event =========================================================

  /**
   * @description 變更保單下拉選單
   * 
   * @author B1529
   * @version 2022/06/09
   */
  getBasicData(){

    LoadingUtil.show();
    this.basicInfoData = {};

    // 取得基本資料
    this.getBasicInfo();
  }

  /**
   * Event
   */
   onDialClick() {
    console.log('撥號to 業務員');
    this.contactAgentShow = true;
  }

  // ==================================================== Ajax ==========================================================

  /**
   * @description 取得照會作業單號
   * 
   * @author B1529
   * @version 2022/06/07
   */
  getNotiInfoId(){

    LoadingUtil.show();
    this.$notificationApi.getNotiInfoIdUsingPOST()
    .then((res:AxiosResponse<string>) => {
      
      if( !VlidationUtil.isEmpty(res.data) ){

        this.form.notiInfoId = res.data;

        // 無案件
        if(VlidationUtil.isEmpty(this.basicCaseNo)){

          // 取得保單下拉選單
          this.getBasicPolicySelect();

        } else {
          // 取得基本資料
          this.getBasicInfo();
        }
      } else {
        LoadingUtil.close();
        ErrorModalUtil.modalError(this.$t('notificationBasic_error_notiInfoId').toString());   // 取得照會作業單號失敗!
      }
      
    })
    .catch((err) => {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t('notificationBasic_error_notiInfoId').toString());   // 取得照會作業單號失敗!
    })
  }

  /**
   * @description 取得保單號碼下拉選單
   * 
   * @author B1529
   * @version 2022/06/07
   */
  getBasicPolicySelect(){
    
    this.$notificationApi.getBasicPolicySelectUsingPOST({
      packNo : PackMatchModule.pickupResult.firstCasePack.packNo
    })
    .then((res:AxiosResponse<NotiPolicySelectDto>) => {
      
      if( !VlidationUtil.isEmpty(res.data.policyOptions) ){
        this.selectPolicyOptions = res.data.policyOptions;
        this.form.caseNo = res.data.defaultCaseNo;

        // 取得基本資料資訊
        this.getBasicInfo();
      } else {
        LoadingUtil.close();
        ErrorModalUtil.modalError(this.$t('notificationBasic_error_policyOptions').toString());   // 查無保單號碼下拉選單資訊!
      }
    })
    .catch((err) => {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t('notificationBasic_error_policyOptionsFail').toString());  // 取得保單號碼下拉選單失敗
    });
  }

  /**
   * @description 取得基本資料資訊
   * 
   * @author B1529
   * @version 2022/06/09
   */
  getBasicInfo(){

    // 唯讀時才需要自己轉圈圈跟老大一樣
    if(!this.isEdit){
      LoadingUtil.show();
    }

    this.$notificationApi.getBasicInfoUsingPOST({
      caseNo : this.form.caseNo,
      notiInfoId : this.form.notiInfoId
    })
    .then((res:AxiosResponse<NotiBasicInfoDto>) => {
      if(res.data){
        
        
        // 組合業務員資訊
        this.agentName = VlidationUtil.isEmpty(res.data.agentName) ? '' : res.data.agentName;
        this.agentName += VlidationUtil.isEmpty(res.data.agentSencondName) ? '' : '/' + res.data.agentSencondName;
        this.basicInfoData = res.data;
        this.isCaseClosed = !VlidationUtil.isEmpty(this.basicInfoData.caseCloseReasonCode);

        this.emitData.basicInfoData = this.basicInfoData;
        this.emitData.basicLoading = true;
        this.$emit('emitBasicInfo', this.emitData);
      } else {
        LoadingUtil.close();
        ErrorModalUtil.modalError(this.$t('notificationBasic_error_basicInfo').toString());  // 查無照會基本資料
      }
    })
    .catch((err) => {
      LoadingUtil.close();
      ErrorModalUtil.modalError(this.$t('notificationBasic_error_basicInfoFail').toString());  // 取得照會基本資料失敗
    });

  }

  // // 表單送出
  // onFormSubmit() {
  //   console.log('表單送出');

  //   if((this.$refs.notificationCallUpAgentModal as any).validateSubmit()) {
  //     Modal.confirm({
  //         okText: this.$t('global_ok').toString(), // 確定
  //         cancelText: this.$t('global_cancel').toString(), // 取消
  //         title: this.$t('notificationBasic_sendContactAgentData').toString(), //送出聯繫業務員資料
  //         content: this.$t('notificationBasic_confirmDataCorrectToSave').toString() , //確認資料正確儲存?
  //         onOk: () => {
  //             (this.$refs.notificationCallUpAgentModal as any).onFormSubmit();
  //         }
  //     })
  //   } else {
  //     console.log('聯絡業務員送出失敗');
  //   }
      
  // }

  // 表單取消
  onFormCalcel(data) {
    this.contactAgentShow = data;
  }

  /**
     * @description 離開按鈕
     * 
     * @author B1529
     * @version 2022/10/03
     */
   onLeave(){
    let closable = true;
    // 驗證有撥號是否有撥號結果、聯絡結果與細項
    const validatePeson = AgentPersonModule.validateContactInfo;
    if (!validatePeson.success) {
      ErrorModalUtil.modalListError(validatePeson.errMsg, null);
      closable = false;
    }
    if (!AgentPersonModule.isShouldSaveIsSave) {
      ErrorModalUtil.modalError(this.$t('notification_dialNotSaved').toString()); // 撥號未儲存
      closable = false;
    }
    if (!AgentPersonModule.isShouldSendIsSend) {
      ErrorModalUtil.modalError(this.$t('notification_mesgNotSent').toString()); // 訊息未發送
      closable = false;
    }
    if (closable) {
      this.contactAgentShow = false;
    }
}

}