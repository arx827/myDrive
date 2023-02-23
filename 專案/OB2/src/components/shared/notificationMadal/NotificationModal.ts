import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import { NotiPdfInputDto, OutputDto, NotiContentDto, ReviewUpdate, ReviewUpdateReviewStatusEnum } from "@fubonlife/obd-api-axios-sdk";
import VlidationUtil from "@/assets/config/ValidationUtil";

import LoadingUtil from "@/assets/config/LoadingUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { Modal } from "ant-design-vue";
import { AnswerType, NotificationSubmitData } from "./model";
import { NotiStep } from "@/pages/onDuty/model";
import CommonUtil from '@/assets/config/CommonUtil';
import moment from "moment";

// 照會 components
import Basic from "@shared/notificationMadal/NotificationBasic.vue";
import Interview from "@shared/notificationMadal/NotificationInterview.vue";
import NotificationInfo from "@shared/notificationMadal/NotificationInfo.vue";
import NotificationReplyInfo from "@/components/shared/notificationMadal/NotificationReplyInfo.vue"
import NotificationClosed from "@/components/shared/notificationMadal/NotificationClosed.vue";

// 覆核
import ReviewWork from "./NotificationReview.vue";
import CaseSearchPage from "@/pages/case/CaseSearchPage.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';
import { LoginModule } from "@/plugins/store/LoginModule";

@Component({
  components: { Basic, Interview, NotificationInfo, NotificationReplyInfo, NotificationClosed, ReviewWork, CaseSearchPage, DragModal }
})
export default class NotificationModal extends Vue {
  @Prop()
  step: number;

  @Prop()
  propCaseNo: string;

  @Prop()
  propNotiInfoId: string;

  @Prop()
  caseLogId: string;

  @Prop()
  packLogId: string;

  @Prop()
  propPackNo: string;

  @Prop()
  reOpen: boolean;

  // 是否顯示通過/退回的button
  @Prop()
  isShowReviewButton: boolean;

  // 是否來自未結案提醒表單
  @Prop()
  isNotCloseNotify: boolean;

  // 照會階段
  notiStep = NotiStep;

  //轉件視窗是否顯示
  isTransferFormVisible: boolean = false;

  // 保單號碼 (可變動變數)
  policy = '';

  caseNo:string='';

  //案件調閱視窗
  isCaseSearch: boolean = false;

  //是否編輯過
  canReSend: boolean = true;

  // 發送資料
  submitData : NotificationSubmitData = {
    basicInfoData : {
      caseNo : ''
    }
  };

  // 子畫面回傳資料的 Loading
  childLoading = {
    basicLoading : false,
    itemInfoLoading : false,
    intererviewLoading : false,
    // 覆核
    reviewLoading : false
  }

  // 是否有點選照會單預覽
  isNotiPreview : boolean = false;
  // 是否已結案
  isCaseClosed: boolean = false;

  // 覆核狀態更新input
  updateFrom: ReviewUpdate = {
    reviewNo: "",
    reviewStatus:ReviewUpdateReviewStatusEnum.S,
    processContent: ""
  };

  // ==================================================== Hook ===========================================================

  /**
   * Hook
   */
   created() {
    
    if(this.propCaseNo){
      this.caseNo = this.propCaseNo;
    }

  }

  // ==================================================== Event ==========================================================

  // 按鈕 『離開』
  onLeave() {
    // 如果是覆核離開不需要跳提示訊息
    if(this.step == this.notiStep.review || this.isNotCloseNotify){
      this.$emit('onLeave');
    } else {
      let content = this.$t('global_confirm_cancelSend').toString();          // 確認取消發送?
      if(this.step == this.notiStep.reply){
        content = this.$t('notification_confirmToCancelReply').toString();    // 確認取消回覆?
      } else if(this.step == this.notiStep.close){
        content = this.$t('notificationModal_confirmToCancelClose').toString(); // 確認取消結案?
      }
  
      Modal.confirm({
        okText: this.$t('global_ok').toString(),                     // 確定
        cancelText: this.$t('global_cancel').toString(),             // 取消
        title: this.$t('global_confirm').toString(),                 // 確認
        content: content,    
        onOk: () => {
  
          // 照會回覆需先刪除暫存檔
          if(this.step == this.notiStep.reply){
              (this.$refs.notificationReplyInfo as any).deleteTempFiles();
          }
  
          this.$emit('onLeave');
        }
        
      });
    }
  }

  //照會單預覽
  onNotiPdfPreview(){

    // 驗證保戶回答資訊
    let answerValidate = true;
    if(!VlidationUtil.isEmpty(this.submitData.interivewData)){
      this.submitData.interivewData.forEach((interview)=>{
        if(VlidationUtil.isEmpty(interview.answer)){
          answerValidate = false;
        }
      })
    }

    // 保戶回答不可為空
    if(!answerValidate){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_answer').toString());
    }
    // 必須選擇至少一項照會項目
    else if(VlidationUtil.isEmpty(this.submitData.itemInfoData)){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_notiItem').toString());
    }else{
      // 整理照會項目資訊
      let notiContentList:NotiContentDto[] = [];
      let expireDate = null;
      if(!VlidationUtil.isEmpty(this.submitData.itemInfoData)){
        this.submitData.itemInfoData.forEach((item, index)=>{
          expireDate = item.exprieDate;
          notiContentList.push(
            {
              index: index+1,
              content: item.additional
            }
          )
        })
      }
      
      // 整理 照會單內文 所需資訊
      let pdfInfo: NotiPdfInputDto = {
        //照會單號
        notiInfoId: this.submitData.basicInfoData.notiInfoId,
        //案件編號
        caseNo: this.submitData.basicInfoData.caseNo,
        //列印日期
        printDate: moment().format('YYYY-MM-DD'),
        //照會日期
        notificationDate: moment().format('YYYY-MM-DD'),
        //照會到期日
        notiExpireDate: !VlidationUtil.isEmpty(expireDate)? moment(expireDate).format('YYYY-MM-DD') : null,
        //照會次數
        notiCount: parseInt(this.submitData.basicInfoData.notiCount),
        //是否為催辦
        reminder: false,
        //照會內容清單
        notiContentInfoList: notiContentList,
        //問卷表格資訊清單
        notiQuestTableInfoList: this.submitData.interivewData,
        //登入人員AD
        tmrId: LoginModule.loginState.me.id
      }

      LoadingUtil.show();
      this.$notificationApi.notiPdfPreviewUsingPOST(pdfInfo, { responseType: 'blob' })
      .then((resp)=>{
        if(resp.data){
          const int=resp.headers;
          const headers=new Headers(int);
          if(headers.get('content-disposition')){
            // 案件查無通路別資訊
            ErrorModalUtil.modalError(this.$t("NOTI_CHANNEL_INFO_NOT_FOUND").toString());
          }else{
            this.dealDownLoadData(resp.data);
            this.isNotiPreview = true;
            // 開啟pdf後才可以重送
            this.canReSend = true;
          }
        }else{
          // 照會PDF預覽失敗
          ErrorModalUtil.modalError(this.$t("NOTI_PDF_FILE_GENERATE_FAILED").toString())
        }
        this.canReSend = true;
      }).catch((err)=>{
        // 照會PDF預覽失敗
        ErrorModalUtil.modalError(this.$t("NOTI_PDF_FILE_GENERATE_FAILED").toString());
      }).finally(()=>{
        LoadingUtil.close();
      })
    }
  }

  /**
   * 整理問卷題目資料
   * @param data 
   * @returns 
   * 
   * @author B1683
   * @version 2022/08/22
   */
  arrangeQuestContent(data){
    let result = "";
    if(AnswerType.rightLetter == data.customerAnswerType){  // 問卷
      result = data.paragraph.concat(data.questContent);
    } else if(AnswerType.end == data.customerAnswerType) {  // 結束語
      result = this.$t('notificationInterview_other').toString();  // 其他反應事項
    } else {
      result = data.questContent;
    }
    return result;
  }

  /**
  * 處理後端回傳的下載內容並開啟
  * @param resData 
  */
  dealDownLoadData(resData) {
    try {
      let blob;
      if (resData instanceof Blob) {
        blob = resData;
      } else {
        blob = new Blob([resData], { type: resData.type });
      }
      var url = window.URL.createObjectURL(blob);
      var a = window.open(url + "#toolbar=0" , "NOTI", "config='height=500px,width=500px'");
    } catch (e) {
      console.error(e);
    }
  }
  
  /**
   * @description 取得子元件回傳值
   * 
   * @author B1529
   * @version 2022/06/13
   */
   getChildInformation(value){
    console.log('Child Component Value : ' + value);

    // 照會基本資料區
    if(!VlidationUtil.isEmpty(value.basicLoading)){
      this.childLoading.basicLoading = value.basicLoading;
      this.submitData.basicInfoData = value.basicInfoData;
      
      // 有結案原因則不可進行照會
      this.isCaseClosed = !VlidationUtil.isEmpty(this.submitData.basicInfoData.caseCloseReasonCode);
      
      // 因為變更案件須還原預設相關照會資訊 (無照會單單號才清除)
      if(VlidationUtil.isEmpty(this.propNotiInfoId)){
        this.clearNotification();
      }
      
    }

    // 照會資訊區
    if(!VlidationUtil.isEmpty(value.itemInfoLoading)){
      this.childLoading.itemInfoLoading = value.itemInfoLoading;
      this.submitData.itemInfoData = value.itemInfoData;

      // 還原點選照會單預覽
      this.isNotiPreview = false;
    }

    // 照會電訪內容
    if(!VlidationUtil.isEmpty(value.intererviewLoading)){
      this.childLoading.intererviewLoading = value.intererviewLoading;
      this.submitData.interivewData = value.intereviewData;
      // 還原點選照會單預覽
      this.isNotiPreview = false;
    }

    // 照會覆核內容
    if(!VlidationUtil.isEmpty(value.reviewLoading)){
      this.childLoading.reviewLoading = value.reviewLoading;
    }

    // 照會基本資料載入完成
    if(this.childLoading.basicLoading && this.childLoading.itemInfoLoading && this.childLoading.intererviewLoading){
      // 如果為覆核階段需要多判斷覆核的loading
      if(this.step == this.notiStep.review && this.childLoading.reviewLoading){
        LoadingUtil.close();
      } else if(this.step != this.notiStep.review) {
        LoadingUtil.close();
      }
    }
  }

  /**
   * @description 照會發送驗證
   * 
   * @author B1529
   * @version 2022/08/03
   */
  validateNotiSubmit(){

    let result = true;
    
    // 照會基本資料有誤
    if(VlidationUtil.isEmpty(this.submitData.basicInfoData)){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_basic').toString());
      result = false;
    }

    // 缺少照會作業單號
    if(result && VlidationUtil.isEmpty(this.submitData.basicInfoData.notiInfoId)){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_notiInfoId').toString());
      result = false;
    }

    // 必須選擇至少一項照會項目
    if(result && VlidationUtil.isEmpty(this.submitData.itemInfoData)){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_notiItem').toString());
      result = false;
    }

    // 請先點選照會單預覽
    if(result && !this.isNotiPreview){
      ErrorModalUtil.modalError(this.$t('notification_validate_error_preview').toString());
      result = false;
    }

    return result;

  }

  /**
   * @description 還原照會相關資訊
   * 
   * @author B1529
   * @version 2022/08/04
   */
  clearNotification(){

    // 清除照會資訊與項目
    (this.$refs.notiInfoform as any).clearNotificationItems();

    // 清除暫存照會物件
    this.submitData.itemInfoData = [];
    this.submitData.interivewData = [];

    // 還原點選照會單預覽
    this.isNotiPreview = false;
  }

  // ==================================================== Ajax ===========================================================

  /**
   * @description 照會開單 『發送』
   * 
   * @author B1529
   * @version 2022/08/03
   */
   onSendNotification() {

    // 驗證發送參數
    const submit = this.validateNotiSubmit();

    if(submit){
      const caseLogId = VlidationUtil.isEmpty(this.caseLogId) ? CommonUtil.getCaseLogId(this.submitData.basicInfoData.caseNo) : this.caseLogId;

      LoadingUtil.show();
      this.$notificationApi.sendNotificationUsingPOST({
        caseNo : this.submitData.basicInfoData.caseNo,
        packNo : VlidationUtil.isEmpty(this.propPackNo) ? PackMatchModule.pickupResult.firstCasePack.packNo : this.propPackNo,
        casePolicyLodId : caseLogId,
        casePolicyLogInfoList : PackMatchModule.pickupResult.firstCasePack.casePolicyLogInfoList,
        packLogNo : VlidationUtil.isEmpty(this.packLogId) ? PackMatchModule.pickupResult.firstCasePack.packLogNo : this.packLogId,
        notiItems : this.submitData.itemInfoData,
        notiBasicInfo : this.submitData.basicInfoData,
        notiIntereviews : this.submitData.interivewData
      })
      .then((resp : AxiosResponse<OutputDto>)=>{
        
        LoadingUtil.close();
        if(resp.data.success){
          if(!VlidationUtil.isEmpty(resp.data.returnCode)){
            MessageUtil.messageSuccess(this.$t(resp.data.returnCode).toString());
          }
          if(!VlidationUtil.isEmpty(resp.data.warningMessage)){
            ErrorModalUtil.modalError(resp.data.warningMessage);
          }
          this.$emit('onLeave');
        } else {
          // 照會發送失敗 {}
          ErrorModalUtil.modalError(this.$t('notification_send_error', [resp.data.returnMessage]).toString());
        }
      }).catch((err)=>{
        console.log("照會發送失敗", err);
        LoadingUtil.close();
      });
    }
  }

  /**
   * @description 照會回覆
   * 
   * @author B1529
   * @version 2022/08/22
   */
  onReplySubmit(){
    (this.$refs.notificationReplyInfo as any).notiReplySubmit();
  }

  /**
   * @description 照會回覆結案
   * 
   * @author B1529
   * @version 2022/09/01
   */
   onReplyClosedSubmit(){
    (this.$refs.notificationReplyInfo as any).notiReplyClosedSubmit();
  }

  /**
   * @description 照會結案
   * 
   * @author B1529
   * @version 2022/09/01
   */
   onClosedSubmit(){
    (this.$refs.notificationClosedInfo as any).notiClosedSubmit();
  }

  /**
   * @description 接收照會送出回傳
   */
  onSubmitLeave(){
    this.$emit('onLeave');
  }

  /**
   * @description 照會回覆結案回傳
   * 
   * @author B1529
   * @version 2022/09/01
   */
  onReplySubmitLeave(notiOpen: boolean){
    
    if(notiOpen){
      this.$emit('onReplySubmitLeave');
    } else {
      this.onSubmitLeave();
    }
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
        this.updateFrom.reviewNo = this.propNotiInfoId;
        console.log("覆核通過");
        this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
          if(resp.data.success){
            // 覆核通過，照會發送成功
            MessageUtil.messageSuccess(this.$t('reviewCasePage_notiReviewPass').toString());
            this.$emit("onLeave");
            if(!VlidationUtil.isEmpty(resp.data.warningMessage)){
              ErrorModalUtil.modalError(resp.data.warningMessage);
            }
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
    // console.log(this.form.review);
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
          this.updateFrom.reviewNo = this.propNotiInfoId;
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
  onReSendSubmit() {
    // API:
    if(!this.canReSend){
      console.log("不可以重送");
      ErrorModalUtil.modalError("請先點過照會單預覽");
    } else {
      console.log("可以重送");
      if(!(this.$refs.reviewForm as any).validateReviewSubmit()){
        console.log("驗證失敗");
      } else {
      
        LoadingUtil.show();
        this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.S;
        this.updateFrom.reviewNo = this.propNotiInfoId;
        this.updateFrom.notiQuestTableDtoList = this.submitData.interivewData;
        this.updateFrom.notiSendReqDto = {
          caseNo : this.submitData.basicInfoData.caseNo,
          packNo : this.propPackNo,
          casePolicyLodId : "",
          casePolicyLogInfoList : [],
          packLogNo : this.packLogId,
          notiItems : this.submitData.itemInfoData,
          notiBasicInfo : this.submitData.basicInfoData,
          notiIntereviews : this.submitData.interivewData
        }
        this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
        if(resp.data.success){
          // 覆核重送
          MessageUtil.messageSuccess(this.$t('reviewCasePage_resend_success').toString());
          this.$emit("onLeave");
        } else {
          //覆核重送失敗
          ErrorModalUtil.modalError(resp.data.returnMessage);
        }
      })
      .catch(error => {
        console.log(error);
        // 重送失敗
        ErrorModalUtil.modalError(this.$t('reviewCasePage_reviewReSendFailed').toString())
      })
      .finally(()=> LoadingUtil.close())
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
          this.updateFrom.reviewNo = this.propNotiInfoId;
          console.log("覆核取消");
          this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
            if(resp.data.success) {
              // 覆核取消成功
              MessageUtil.messageSuccess(this.$t('reviewCancelSuccess').toString());
              this.$emit("onLeave");
            } else {
              // 覆核取消失敗
              ErrorModalUtil.modalError(resp.data.returnMessage);
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
    // console.log(this.form.review);
  }

  // 子component 更新 form
  updateFormData(data) {
    this.updateFrom.processContent = data.review.formData1;
    // Object.assign(this.form, data);
  }
  /**
   * @author B0845
   * @deprecated 開啟案件調閱
   * @version 2022/09/27
   */
  caseCheck() {
    this.isCaseSearch = true;
  }

  /**
   * @author B0845
   * @deprecated 是否可以重送
   * @version 2022/10/11
   */
  changeResendStatus(){
    this.canReSend = false;
  }

  /**
   * @author B0845
   * @description 更新狀態來判斷是否需要按預覽
   * @version 2022/10/18
   */
   getReviewStatus(){
    this.canReSend = false;
    console.log("emitReviewStatus");
   }
}