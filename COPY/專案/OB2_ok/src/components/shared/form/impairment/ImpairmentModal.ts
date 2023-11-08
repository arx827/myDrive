import { INumDto, ReviewUpdate, ReviewUpdateReviewStatusEnum, ServiceHistorygDto, TobdRecordHistoryDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import MessageUtil from "@/assets/config/MessageUtil";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { Modal } from "ant-design-vue";
import Basic from "./ImpairmentBasic.vue";
import ReviewWork from "./ImpairmentReview.vue"
import ImpairmentInfo from "./ImpairmentInfo.vue";
import CaseSearchPage from "@/pages/case/CaseSearchPage.vue";
import VlidationUtil from "@/assets/config/ValidationUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";

@Component({
    components: {  DragModal, Basic, ReviewWork, ImpairmentInfo, CaseSearchPage }
  })
  export default class ImpairmentModal extends Vue {
    @Prop()
    step: number;
  
    @Prop()
    caseType: string;
  
    @Prop()
    propCaseNo: string;
  
    @Prop()
    propInfInfoId: string;
  
    @Prop()
    propInfTypeId: string;

    @Prop()
    propPackNo?: string;

    // 錄音檔撥放清單
    inumDtoList: INumDto[] = [];
    tobdRecordHistoryDtoFromInform: TobdRecordHistoryDto = null;
    showRecordPlayList: boolean = false;
    playButtonLoading = {};
    callSys: string = "";
    serviceHistorygDto: ServiceHistorygDto = null;
    loading: boolean = false;
  
    // 是否顯示通過/退回的button
    @Prop()
    isShowReviewButton: boolean;
  
    //轉件視窗是否顯示
    isTransferFormVisible: boolean = false;
  
    //案件調閱視窗
    isCaseSearch: boolean = false;
  
    // 保單號碼 (可變動變數)
    policy = '';
  
    caseNo:string='';
    infInfoId: string ='';
  
    form = {
      countersignature: {
        //會辦單是否已點選預覽
        isClickInformPreview: false,
        //會辦單預覽的檔案代碼
        infFileId: "",
      },
      replay: {},
      closed: {},
      review: {},
    }
  
    //會辦類型
    infInformType:string =  "";
  
    isCaseClosed: boolean = false;
  
  
    // 第一個component loading狀態
    fistComponentLoading: boolean = false;
    // 第二個component loading狀態
    seconComponentLoading: boolean = false;
    // 第三個component loading狀態
    thirdComponentLoading: boolean = false;
  
    // 覆核狀態更新input
    updateFrom: ReviewUpdate = {
      reviewNo: "",
      reviewStatus:ReviewUpdateReviewStatusEnum.S,
      processContent: ""
    };
  
    // 保單號碼
    packNo: String = "";

    // 是否可編輯
    isEdit: boolean = false;

    // 判斷是否三個component都完成資料抓取
    get componentLoading(){
      return this.thirdComponentLoading && this.seconComponentLoading && this.fistComponentLoading;
    }
  
    @Watch('componentLoading')
    isLoading(newVal:boolean){
      // 如果都完成將loading關掉
      LoadingUtil.close();
    }
  
    /**
     * Event
     */
    // 更新 案件編號
    updateCaseNo(newVal) {
      this.caseNo = newVal;
    }
  
    /**
     * Event
     */

    // 名單序號資訊(當前名單)
  // get getFirstPackNo() {
  //   if(VlidationUtil.isEmpty(PackMatchModule.pickupResult) != null && VlidationUtil.isEmpty(PackMatchModule.pickupResult.firstCasePack) != null) {
  //     return PackMatchModule.pickupResult.firstCasePack.packNo;
  //   }
  // }
  
    // 子component 更新 form
    updateFormData(data) {
      this.updateFrom.processContent = data.review.formData1;
      Object.assign(this.form, data);
    }
  
    //將陣列轉字串，以逗號分隔
    changeListIntoString(list: string[]) {
      let s = "";
      let count = 0;
      list.forEach((item) => {
        count++;
        s = s + item;
        if (count != list.length) {
          s = s + ";";
        }
      })
      return s;
    }
  
      // 覆核作業 『通過』
      onPassSubmit() {
        // API:
        Modal.confirm({
          class: "error-modal-util-class",
          content: this.$t('isReviewPass').toString(), // 確認覆核通過?
          okText: this.$t('global_yes').toString(), //是
          cancelText: this.$t('global_no').toString(),  //否
          icon: 'info-circle',
          onOk: () => {
            LoadingUtil.show();
            this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.Y;
            this.updateFrom.reviewNo = this.infInfoId;
            console.log("覆核通過");
            this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
              if(resp.data.success){
                // 覆核通過,憂質寫檔成功!
                MessageUtil.messageSuccess(this.$t('reviewCasePage_suspectiveReviewPass').toString());
                this.$emit("onLeave");
              } else {
                //覆核通過失敗
                ErrorModalUtil.modalError(resp.data.returnMessage);
              }
            })
            .catch(error => {
              console.log(error);
              // 覆核通過失敗
              ErrorModalUtil.modalError(this.$t('reviewPassFailed').toString())
            })
            .finally(()=> LoadingUtil.close())
          }
        });
        console.log(this.form.review);
        LoadingUtil.close();
        // this.$emit('onLeave');
      }

          // 覆核作業 『退回』
    onUnpassSubmit() {
      if(!(this.$refs.reviewForm as any).validateReviewSubmit()){
        console.log("驗證失敗");
      } else {
        Modal.confirm({
          class: "error-modal-util-class",
          content: this.$t('isReviewReturn').toString(), //確認覆核退回
          okText: this.$t('global_yes').toString(), //是
          cancelText: this.$t('global_no').toString(),  //否
          icon: 'info-circle',
          onOk: () => {
            LoadingUtil.show();
            this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.R;
            this.updateFrom.reviewNo = this.infInfoId;
            console.log("覆核退回");
            this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
              if(resp.data.success) {
                // 覆核退回成功
                MessageUtil.messageSuccess(this.$t('reviewReturnSuccess').toString());
                this.$emit("onLeave");
              } else {
                // 覆核退回失敗
                ErrorModalUtil.modalError(resp.data.returnMessage);
              }
            })
            .catch(error => {
              console.log(error);
              // 覆核退回失敗
              ErrorModalUtil.modalError(this.$t('reviewReturnFailed').toString())
            })
            .finally(()=> LoadingUtil.close())
          }
        });
      }
    }
    // 覆核作業 『重送』
    async onReSendSubmit() {
      // API:
      if(!(this.$refs.reviewForm as any).validateReviewSubmit()){
        console.log("驗證失敗");
      } else {
        LoadingUtil.show();
        const questResult = await(this.$refs.questTelChange as any).questTelChange();
 
        console.log(questResult);
          if(questResult.success){
            this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.S;
            this.updateFrom.reviewNo = this.infInfoId;
            this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
            if(resp.data.success){
              // 覆核『重送』成功
              MessageUtil.messageSuccess(this.$t('reviewCasePage_resend_success').toString());
              this.$emit("onLeave");
            } else {
              //覆核『重送』失敗
              ErrorModalUtil.modalError(resp.data.returnMessage);
            }
          })
          .catch(error => {
            console.log(error);
            // 覆核『重送』失敗
            ErrorModalUtil.modalError(this.$t('reviewPassFailed').toString())
          })
          .finally(()=> LoadingUtil.close())
        } else {
          ErrorModalUtil.modalError(questResult.data.returnMessage);
          LoadingUtil.close();
        }
      }

      // this.$emit('onLeave');
    }
    // 覆核作業 『取消』
    onCancelSubmit() {
      if(!(this.$refs.reviewForm as any).validateReviewSubmit()){
        console.log("驗證失敗");
      } else {
        Modal.confirm({
          class: "error-modal-util-class",
          content: this.$t('reviewPage_cancelAction').toString(), //取消後,本作業單將結案,確認執行?
          okText: this.$t('global_yes').toString(), //是
          cancelText: this.$t('global_no').toString(),  //否
          icon: 'info-circle',
          onOk: () => {
            LoadingUtil.show();
            this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.F;
            this.updateFrom.reviewNo = this.infInfoId;
            console.log("覆核取消");
            this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
              if(resp.data.success) {
                // 覆核取消成功
                MessageUtil.messageSuccess(this.$t('reviewReturnSuccess').toString());
                this.$emit("onLeave");
              } else {
                // 覆核取消失敗
                MessageUtil.messageSuccess(resp.data.returnMessage);
              }
            })
            .catch(error => {
              console.log(error);
              // 覆核取消失敗
              ErrorModalUtil.modalError(this.$t('reviewReturnFailed').toString())
            })
            .finally(()=> LoadingUtil.close())
          }
        });
      }
      
      // API:
      console.log(this.form.review);
    }
  
    // 按鈕 『離開』
    onLeave() {
      this.$emit("onLeave");
      LoadingUtil.close();
    }
  
    /**
     * Hook
     */
    created() {
      LoadingUtil.show(); 
      // 開單時 thirdComponentLoading 設為 true 避免整體的Loading關不起來
      if(this.$props.step == 1){
        this.thirdComponentLoading = true;
      }
      if(this.propCaseNo){
        this.caseNo = this.propCaseNo;
      }
      if(this.propInfInfoId){
        this.infInfoId = this.propInfInfoId;
      }
      if(this.$route.name == 'REVIEW_MENU' && this.isShowReviewButton){
        this.isEdit = true;
      }
      LoadingUtil.close();
    }
  
    // 第三個(會辦回覆/結案/覆核)component資料準備狀態
    resultLoading(isLoading){
      this.thirdComponentLoading = isLoading;
    }
    // 會辦基本資料component資料準備狀態
    countersignatureLoading(isLoading){
      this.seconComponentLoading = isLoading;
    }
    // 基本資料component資料準備狀態
    basicLoading(isLoading){
      this.fistComponentLoading = isLoading;
    }
  
    caseCheck() {
      this.isCaseSearch = true;
    }

  }