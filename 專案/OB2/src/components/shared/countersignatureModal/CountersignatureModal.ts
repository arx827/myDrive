import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { LoginModule } from "@/plugins/store/LoginModule"
import MomentUtil from "@/assets/config/MomentUtil";
// 會辦 components
import Basic from "@/components/shared/countersignatureModal/Countersignature_basic_com.vue";
import Countersignature from "@/components/shared/countersignatureModal/Countersignature_countersignature_com.vue";
import Reply from "@/components/shared/countersignatureModal/Countersignature_reply_com.vue";
import Closed from "@/components/shared/countersignatureModal/Countersignature_closed_com.vue";
import { InfCloseSaveDto, InfPDFPreview, InfReplySaveDto, InfSendDto, InfSendResult, ReviewUpdate, ReviewUpdateReviewStatusEnum } from "@fubonlife/obd-api-axios-sdk";
import VlidationUtil from "@/assets/config/ValidationUtil";

import ReviewWork from "@/components/shared/countersignatureModal/ReviewＷork_com.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import MessageUtil from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { Modal } from "ant-design-vue";
import moment from "moment";
import CountersignatureModalTransfer from "@/components/shared/countersignatureModal/Countersignature_transfer_com.vue"
import { InfReplyForm } from "./model";
import CaseSearchPage from "@/pages/case/CaseSearchPage.vue";
import DragModal from '@/components/shared/dragModal/DragModal.vue';


@Component({
  components: { Basic, Countersignature, Reply, Closed, ReviewWork, CountersignatureModalTransfer, CaseSearchPage, DragModal}
})
export default class CountersignatureModal extends Vue {
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

  // 是否顯示通過/退回的button
  @Prop()
  isShowReviewButton: boolean;

  @Prop()
  propPackNo?: string;

  // 是否是由未結案提醒表單開啟
  @Prop({default: false})
  isNotCloseNotify?: boolean;

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


  // 判斷是否三個component都完成資料抓取
  get componentLoading(){
    if(this.isNotCloseNotify){
      return ((this.thirdComponentLoading && this.caseType == 'review') || (this.isNotCloseNotify && this.caseType == undefined)) && this.seconComponentLoading && this.fistComponentLoading;
    }else{
      return this.thirdComponentLoading && this.seconComponentLoading && this.fistComponentLoading;
    }
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
  // 還原會辦資料區塊的是否預覽flag
  initInformPreviewFlag(){
    (this.$refs.infInform as any).initInformPreviewFlag();
  }

  // 子component 更新 form
  updateFormData(data) {
    this.updateFrom.processContent = data.review.formData1;
    Object.assign(this.form, data);
  }

  //取得上游承辦email
  getBasicEmailInfo(){
    var emailInfo = (this.$refs.infBasicform as any).getEmailInfo();
    (this.$refs.infInform as any).updateEmailInfo(emailInfo);
  }

  //取得通路別資訊
  getBasicChannelIdInfo(){
  }

  //更新通路類型資訊
  updateChannelsId(channelIdInfo){
    (this.$refs.infInform as any).updateChannelIdInfo(channelIdInfo);
  }

  //取得案件編號
  getBasicCaseNo(){
    // 取得上方基本資料
    let basicData = (this.$refs.infBasicform as any).getInfBasicData();
    (this.$refs.infInform as any).updateCaseNo(basicData.caseNo);
  }

  //更新會辦類型資訊
  updateInfTypeInfo(infType){
    this.infInformType = infType;
    this.form.countersignature.isClickInformPreview = false;
  }

  //還原會辦單預覽是否已點選的flag
  updateInformPreviewFlag(){
    this.form.countersignature.isClickInformPreview = false;
  }

  // 驗證通路別資訊
  checkChannelsId(){
    let basicData = (this.$refs.infBasicform as any).getInfBasicData();
    if(VlidationUtil.isEmpty(basicData.channelsId)){
      // 資訊有誤，缺少通路類型資訊
      ErrorModalUtil.modalError(this.$t('infMainForm_noChannelId').toString())
    }
  }

  // 會辦開單 『會辦單預覽』
  async onCountersignatureReview() {
    if((this.$refs.infInform as any).validateInfInformSubmit()){
    let returnFileId: string = "";
    
      let interviewer:string="";
      let interViewerUnit:string="";
      let interViewerSuperUnit:string="";
      const state = LoginModule.loginState;
      try{
      LoadingUtil.show();
      const resp=await this.$userApi.getUserUsingGET(state.me.id);
      LoadingUtil.close();
      interviewer=resp.data.name;
      let array=resp.data.unit.unitName.split(" ");
      if(array.length>1){
        interViewerUnit=array[1];
        interViewerSuperUnit=array[0];
      }else{
        interViewerUnit=array[0];
      }
      }catch(e){
        console.log(e);
      }
      // 取得上方基本資料
      let basicData = (this.$refs.infBasicform as any).getInfBasicData();
      //取得會辦開單資訊
      let formData = (this.$refs.infInform as any).getInfInformData();
    let pdfPreviewDto:InfPDFPreview={};
    
      if(!VlidationUtil.isEmpty(basicData.contDateChange)){
        pdfPreviewDto.callDate= MomentUtil.transformRocYearMonthDayHHMMSS(basicData.contDateChange); // 首次電訪日期改顯示民國年月日時分秒
      }else{
        pdfPreviewDto.callDate = "";
      }
          //若保單號碼為空，改抓取受理案號資訊
          if (VlidationUtil.isEmpty(basicData.casePolicy)) {
            pdfPreviewDto.caseNo = basicData.chageNo;
          } else {
            pdfPreviewDto.caseNo = basicData.casePolicy;
          }
      pdfPreviewDto.infContent= formData.content;
      pdfPreviewDto.infDuteDate= formData.expireString; //到期日改顯示民國年
      pdfPreviewDto.infItemList= formData.infItemList.map(e=>e.label);
      pdfPreviewDto.infManageDepartment= formData.infDepartment;
      pdfPreviewDto.infNo= formData.infId;
      pdfPreviewDto.insured= basicData.insuName;
      pdfPreviewDto.interViewerSuperUnit= interViewerSuperUnit;
      pdfPreviewDto.interViewerUnit= interViewerUnit;
      pdfPreviewDto.interviewee= basicData.custTypeName;
      pdfPreviewDto.interviewer= interviewer;
      pdfPreviewDto.legalAgent= basicData.legalName;
      pdfPreviewDto.proposer= basicData.pherName;
    pdfPreviewDto.pushMessage= "";
      pdfPreviewDto.salesPerson= basicData.agentNames;
      pdfPreviewDto.agentUnitNo= basicData.agentUnitNo
      pdfPreviewDto.agentUnitName=basicData.agentUnitName;
      LoadingUtil.show();
    this.$informApi.saveInfPreviewPDFUsingPOST(
      LoginModule.loginState.me.id,
      pdfPreviewDto,{ responseType: 'blob' }
    ).then(resp => {
      this.dealDownLoadData(resp.data);
      const int=resp.headers;
      const headers=new Headers(int);
      returnFileId=headers.get('content-disposition');
      this.form.countersignature.infFileId = returnFileId;
        this.form.countersignature.isClickInformPreview = true;
    }).catch(error => console.log(error))
      .finally(()=>{
        LoadingUtil.close();
      })
    }else{
      this.form.countersignature.isClickInformPreview = false;
    }
  
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
      window.open(url + "#toolbar=0", "會辦單預覽");
    } catch (e) {
      console.error(e);

    }
  }
  // 會辦開單 『發送』
  onCountersignatureSubmit() {
    if ((this.$refs.infInform as any).validateInfInformSubmit()) {
      if(!(this.infInformType =='4') || this.form.countersignature.isClickInformPreview){
      let formData = (this.$refs.infInform as any).getInfInformData();
      let basicData = (this.$refs.infBasicform as any).getInfBasicData();
      let caseLogId = PackMatchModule.pickupResult.casePolicyLogList.filter((log)=>log.caseNo == basicData.caseNo)[0].guid;
      let submitData: InfSendDto = {
        infId: formData.infId,
        caseNo: basicData.caseNo,
        packNo: basicData.packNo,
        casePolicy: basicData.casePolicy,
        custId: basicData.custId,
        informAgain: formData.reInform,
        custName: basicData.custName,
        interstLetter: formData.adjunct.hasAdjunct,
        letterFileId: formData.adjunct.fileId,
        interestDes:formData.adjunct.desc,
        targetEmail: formData.targetPersonEmail,
        carbonCopyEmail: formData.carbonCopyEmail,
        content: formData.content,
        infTypeId: formData.countersignatureType,
        infSubTypeId: formData.subTypeId,
        infSecondTypeId: formData.secondTypeId,
        infDepartmentId: formData.infDepartment,
        expireDate: formData.expireDate,
        caseLogId: caseLogId,
        fileIds: formData.fileIds,
        fileNames: formData.fileNames,
        infItemList: formData.infItemList,
        channelId: basicData.channelsId,
        infFileId: this.form.countersignature.infFileId
      }
      LoadingUtil.show();
      this.$informApi.saveInformUsingPOST(submitData).then((resp)=>{
        LoadingUtil.close();
        if(resp.data.success){
          if(resp.data.needReview){
            // 本次會辦需先進行覆核作業,已發送覆核!
            MessageUtil.messageSuccess(this.$t('infMainForm_needReviewMsg').toString());
          }else if(resp.data.mailSendSuccess){
            // 會辦已發送
            MessageUtil.messageSuccess(this.$t('infMainForm_infSendMsg').toString());
          }else{
            // 會辦發送失敗
            ErrorModalUtil.modalError(this.$t('infMainForm_sendInfFailed').toString());
          }
          this.$emit('onLeave');
        }else{
          if(resp.data.mailAddressIncorrect){
            Modal.error(
              {
                class: "error-modal-util-class",
                title: () => this.$t("global_information").toString(),//提示訊息
                content: (h) => {
                  let msgListWithPObject = [];
                  // 下列郵件位址不存在
                  if (resp.data.incorrectMailAddress.length > 0) {
                    msgListWithPObject.push(h('div',  this.$t('infMainForm_addNotFound').toString()));
                    msgListWithPObject.push(h('div', {
                    }, this.changeListIntoString(resp.data.incorrectMailAddress)));
                  }
                  return h('div', {}, msgListWithPObject);
                },
              }
            )
          }else if(resp.data.expireDateOnRest){
            // 會辦到期日不可選擇非工作日
            ErrorModalUtil.modalError(this.$t('infMainForm_expireDateOnRest').toString());
          }else if(!resp.data.needReview && !resp.data.bqInfoCorrect){
            if(resp.data.bqPersonIsExisted){
              // 無法通知核保員，請通知系統管理者
              ErrorModalUtil.modalError(this.$t('infMainForm_writterEmailNotFound').toString());
            }else{
              // 查無核保員資料，請通知系統管理者
              ErrorModalUtil.modalError(this.$t('infMainForm_underwritterNotFound').toString());
            }
          }else{
            if(resp.data.needReview){
              // 會辦待覆核資訊建立失敗
              ErrorModalUtil.modalError(this.$t('infMainForm_reviewInfoSaveFailed').toString());
            }else{
              if(!resp.data.bqInformMailSendSuccess){
                // 會辦營品發送失敗
                ErrorModalUtil.modalError(this.$t('infMainForm_sendInfBqFailed').toString());
              }else{
                // 會辦發送失敗
                ErrorModalUtil.modalError(this.$t('infMainForm_sendInfFailed').toString());
              }
            }
          }
        } 
      }).catch((err)=>{
        LoadingUtil.close();
        // 會辦發送失敗
        ErrorModalUtil.modalError(this.$t('infMainForm_sendInfFailed').toString());
      })
      }else{
        // 請先點選會辦單預覽
        ErrorModalUtil.modalError(this.$t('infMainForm_clickPreviewFirst').toString());
      }
    }
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

  //變更是否結案的參數
  changeCaseClosed(isClosed){
    this.isCaseClosed = isClosed;
    (this.$refs.infInform as any).changeCaseClosed(isClosed);
  }

  // 會辦回覆 『轉件』
  onReplyTransfer() {
    this.isTransferFormVisible = true;
  }
  
  // 會辦回覆 『送出』
  onReplySubmit() {
    let replyData: InfReplyForm = (this.$refs.infReplyForm as any).getInfReplyData();
    //判斷處理狀態
    if (replyData.handleStatus == '01' && (this.$refs.infReplyForm as any).validateInfReplySubmit(true)) {
      //處理中 暫存回覆內容
      this.saveReplyData(replyData, true);
    }else if (replyData.handleStatus != '01' && (this.$refs.infReplyForm as any).validateInfReplySubmit(false)) {
      //非處理中 將進行各式驗證 驗證通過後將執行回覆
      Modal.confirm({
        class: "error-modal-util-class",
        // 案件將回覆結果, 請確認內容是否無誤？
        content: this.$t('notificationReply_caseWillReplyPleaseConfirm').toString() ,
        okText: this.$t('global_yes').toString(), //是
        cancelText: this.$t('global_no').toString(),  //否
        icon: 'info-circle',
        onOk: () => {
          // 進行檔案上傳驗證
          this.checkFileUpload(replyData);
        },
        onCancel: () => { },
      });
    }
  }

  //回大眾池檢核
  checkVisitTimeForReplyAndClose(isReply){
    let formData = isReply? (this.$refs.infReplyForm as any).getInfReplyData():(this.$refs.infCloseForm as any).getInfCloseData();
      //會辦回覆無須顯示回大眾池提示
      if(!isReply && formData.contactDate != null){
        //方便連絡時段有值 判斷是否回大池
        let start = this.getContactDateTime(formData.convenientContactStartTime,0,formData.contactDate);
        let end = this.getContactDateTime(formData.convenientContactEndTime,0,formData.contactDate);
        LoadingUtil.show();
        this.$informApi.checkReturnPublicUsingGET(end,this.propInfInfoId,start).then((resp)=>{
          LoadingUtil.close();
          if(resp.data!=null){
            if(resp.data){
              //需回大眾池
              Modal.confirm({
                class: "error-modal-util-class",
                // 原指定電訪員於該方便聯絡時段非當班,是否要重新調整方便聯絡時段? 如不調整 ,將丟回大眾池中
                content: this.$t('infMainForm_returnToPublicMsg').toString(),
                okText: this.$t('global_yes').toString(), //是
                cancelText: this.$t('global_no').toString(),  //否
                icon: 'info-circle',
                onOk: () => {
                  //原指定電訪員於該方便聯絡時段非當班 清空方便聯絡時間
                  (this.$refs.infCloseForm as any).clearContactDate();
                },
                onCancel: () => {
                  //原指定電訪員於該方便聯絡時段非當班 不調整、回大眾池 實際送出資料
                  this.saveCloseData(formData);
                },
              });
            }else{
              //原指定電訪員於該方便聯絡時段當班 實際送出資料
              Modal.confirm({
                class: "error-modal-util-class",
                content: this.$t('infMainForm_sureToClose').toString(), //確認結案？
                okText: this.$t('global_yes').toString(), //是
                cancelText: this.$t('global_no').toString(),  //否
                icon: 'info-circle',
                onOk: () => {
                  this.saveCloseData(formData);
                },
                onCancel: () => {
                },
              });
            }
          }else{
            // 判斷是否需回大眾池失敗
            ErrorModalUtil.modalError(this.$t('infMainForm_returnToPublicFailed').toString())
          }
        }).catch(()=>{
          LoadingUtil.close();
        })
      }else{
        if(isReply){
          this.saveReplyData(formData, false);
        }else{
           //結案且無方便連絡時段/回覆 直接送出
          Modal.confirm({
            class: "error-modal-util-class",
            content: this.$t('infMainForm_sureToClose').toString(), // 確認結案？
            okText: this.$t('global_yes').toString(), //是
            cancelText: this.$t('global_no').toString(),  //否
            icon: 'info-circle',
            onOk: () => {
              if(isReply){
                this.saveReplyData(formData, false);
              }else{
                this.saveCloseData(formData);
              }
            },
            onCancel: () => {
            },
          });
        }
      }
  }

  //檔案上傳數量檢核
  checkFileUpload(replyData: InfReplyForm){
    if(this.propInfTypeId !='6' && replyData.fileIds.length<1){
      //通報類或親訪類 附加檔案為必填項目
      ErrorModalUtil.modalError(this.$t('infMainForm_fileIsRequired').toString());
    }else if(this.propInfTypeId =='6' && replyData.fileIds.length<1){
      //通知類 無上傳檔案
      Modal.confirm({
        class: "error-modal-util-class",
        // 請確認是否不需附檔?
        content: this.$t('infMainForm_sureNotUpload').toString(),
        okText: this.$t('global_yes').toString(), //是
        cancelText: this.$t('global_no').toString(),  //否
        icon: 'info-circle',
        onOk: () => {
          this.checkVisitTimeForReplyAndClose(true);
        },
        onCancel: () => {
        },
      });
    }else{
      //有上傳檔案
      this.checkVisitTimeForReplyAndClose(true);
    }
  }

  /**
   * @description 會辦回覆實際儲存邏輯
   * @author B1683
   * @version 2022/07/07
   * @param replyData 會辦回覆內容
   * @param isTempSave 是否為暫存
   */
  saveReplyData(replyData, isTempSave){
    let start = this.getContactDateTime(replyData.convenientContactStartTime,0,replyData.contactDate);
    let end = this.getContactDateTime(replyData.convenientContactEndTime,0,replyData.contactDate);
    let submit: InfReplySaveDto = {
      infInfoId: this.propInfInfoId,
      handleStatus: replyData.handleStatus,
      replyContent: replyData.content,
      fileIds: replyData.fileIds,
      contactTimeStart: start,
      contactTimeEnd: end,
      deletedFileIds: replyData.deletedFileIds
    }

    //提示訊息顯示文字
    let sussessMsg = this.$t('infMainForm_reqlySuccess').toString(); // 會辦回覆成功
    let errMsg = this.$t('infMainForm_reqlySaveError').toString(); // 會辦回覆儲存錯誤
    if(isTempSave){
      sussessMsg = this.$t('infMainForm_reqlySuccess_temp').toString(); // 會辦回覆暫存成功
      errMsg = this.$t('infMainForm_reqlySaveError_temp').toString(); // 會辦回覆暫存錯誤
    }

    LoadingUtil.show();
    this.$informApi.replyInformUsingPOST(submit).then((resp)=>{
      LoadingUtil.close();
      if(resp.data.success){
        // 會辦回覆成功
        MessageUtil.messageSuccess(sussessMsg)
        this.$emit('onLeave');
      }else{
        if(!VlidationUtil.isEmpty(resp.data.apiErrorCode)){
          ErrorModalUtil.modalError(this.$t(resp.data.apiErrorCode).toString())
        }else{
          // 會辦回覆儲存錯誤
          ErrorModalUtil.modalError(errMsg)
        }
      }
    }).catch((err)=>{
      LoadingUtil.close();
      // 會辦回覆儲存錯誤
      ErrorModalUtil.modalError(errMsg)
    })
  }

  //會辦結案實際儲存邏輯
  saveCloseData(closeData){
    let start = this.getContactDateTime(closeData.convenientContactStartTime,0,closeData.contactDate);
    let end = this.getContactDateTime(closeData.convenientContactEndTime,0,closeData.contactDate);
    let submit: InfCloseSaveDto = {
      infInfoId: this.propInfInfoId,
      caseClosedRemark: closeData.caseClosedRemark,
      fileIds: closeData.fileIds,
      contactTimeStart: start,
      contactTimeEnd: end,
    }
    LoadingUtil.show();
    this.$informApi.informCaseCloseUsingPOST(submit).then((resp)=>{
      LoadingUtil.close();
      if(resp.data.success){
        // 會辦結案儲存成功
        MessageUtil.messageSuccess(this.$t('infMainForm_closeSuccess').toString())
        this.$emit('onLeave');
      }else{
        if(!VlidationUtil.isEmpty(resp.data.apiErrorCode)){
          ErrorModalUtil.modalError(this.$t(resp.data.apiErrorCode).toString())
        }else{
          // 會辦結案儲存錯誤
          ErrorModalUtil.modalError(this.$t('infMainForm_closeSaveError').toString())
        }
      }
    }).catch((err)=>{
      LoadingUtil.close();
      // 會辦結案儲存錯誤
      ErrorModalUtil.modalError(this.$t('infMainForm_closeSaveError').toString())
    })
  }

  // 會辦結案 『結案』
  onClosedSubmit() {
    if ((this.$refs.infCloseForm as any).validateInfCloseSubmit()) {
      this.checkVisitTimeForReplyAndClose(false);
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
        this.updateFrom.reviewNo = this.infInfoId;
        console.log("覆核通過");
        this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
          
          if(resp.data.success){
            // 覆核通過
            MessageUtil.messageSuccess(this.$t('reviewPass').toString());
            this.$emit("onLeave");
          } else {
            if(!VlidationUtil.isEmpty(resp.data.returnObj)){
              let returnInfo : InfSendResult = resp.data.returnObj;
              if(!returnInfo.needReview && !returnInfo.bqInfoCorrect){
                if(returnInfo.bqPersonIsExisted){
                  // 無法通知核保員，請通知系統管理者
                  ErrorModalUtil.modalError(this.$t('infMainForm_writterEmailNotFound').toString());
                }else{
                  // 查無核保員資料，請通知系統管理者
                  ErrorModalUtil.modalError(this.$t('infMainForm_underwritterNotFound').toString());
                }
              }else{
                //覆核通過失敗
                ErrorModalUtil.modalError(resp.data.returnMessage);
              }
            }else{
              //覆核通過失敗
              ErrorModalUtil.modalError(resp.data.returnMessage);
            }
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
              ErrorModalUtil.modalError(resp.data.returnMessage)
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
    
    // API:
    console.log(this.form.review);
  }

  // 會辦重送
  onResendSubmit(){
    if ((this.$refs.infInform as any).validateInfInformSubmit() && (this.$refs.reviewForm as any).validateReviewSubmit()) {
      if(!(this.infInformType =='4') || this.form.countersignature.isClickInformPreview){
        let formData = (this.$refs.infInform as any).getInfInformData();
        let basicData = (this.$refs.infBasicform as any).getInfBasicData();
        let submitData: InfSendDto = {
          infId: this.propInfInfoId,
          caseNo: basicData.caseNo,
          packNo: basicData.packNo,
          casePolicy: basicData.casePolicy,
          custId: basicData.custId,
          informAgain: formData.reInform,
          custName: basicData.custName,
          interstLetter: formData.adjunct.hasAdjunct,
          letterFileId: formData.adjunct.fileId,
          interestDes:formData.adjunct.desc,
          targetEmail: formData.targetPersonEmail,
          carbonCopyEmail: formData.carbonCopyEmail,
          content: formData.content,
          infTypeId: formData.countersignatureType,
          infSubTypeId: formData.subTypeId,
          infSecondTypeId: formData.secondTypeId,
          infDepartmentId: formData.infDepartment,
          expireDate: formData.expireDate,
          caseLogId: formData.caseLogId,
          fileIds: formData.fileIds,
          fileNames: formData.fileNames,
          infItemList: formData.infItemList,
          channelId: basicData.channelsId,
          infFileId: this.form.countersignature.infFileId
        }
        LoadingUtil.show();
        this.updateFrom.reviewStatus = ReviewUpdateReviewStatusEnum.S;
        this.updateFrom.reviewNo = this.propInfInfoId;
        this.updateFrom.infResendData = submitData;
        this.$reviewCaseApi.updateReviewCaseUsingPOST(this.updateFrom).then(resp => {
          if(resp.data.success) {
            // 重送成功 
            MessageUtil.messageSuccess(this.$t("reviewCasePage_resend_success").toString());
            this.$emit("onLeave");
          } else {
            if(!VlidationUtil.isEmpty(resp.data.returnObj)){
              let returnInfo : InfSendResult = resp.data.returnObj;
              if(returnInfo.mailAddressIncorrect){
                Modal.error(
                  {
                    class: "error-modal-util-class",
                    title: () => this.$t("global_information").toString(),//提示訊息
                    content: (h) => {
                      let msgListWithPObject = [];
                      // 下列郵件位址不存在
                      if (returnInfo.incorrectMailAddress.length > 0) {
                        msgListWithPObject.push(h('div',  this.$t('infMainForm_addNotFound').toString()));
                        msgListWithPObject.push(h('div', {
                        }, this.changeListIntoString(returnInfo.incorrectMailAddress)));
                      }
                      return h('div', {}, msgListWithPObject);
                    },
                  }
                )
              }else if(returnInfo.expireDateOnRest){
                // 會辦到期日不可選擇非工作日
                ErrorModalUtil.modalError(this.$t('infMainForm_expireDateOnRest').toString());
              }else{
                // 覆核重送失敗
                ErrorModalUtil.modalError(resp.data.returnMessage);
              }
            }else{
              // 覆核重送失敗
              ErrorModalUtil.modalError(resp.data.returnMessage);
            }
          }
        })
        .catch(error => {
          console.log(error);
          // 重送失敗
          ErrorModalUtil.modalError(this.$t('reviewCasePage_reviewReSendFailed').toString())
        })
        .finally(()=> LoadingUtil.close())
      }else{
        // 請先點選會辦單預覽
        ErrorModalUtil.modalError(this.$t('infMainForm_clickPreviewFirst').toString());
      }
    }
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
          this.updateFrom.reviewNo = this.propInfInfoId;
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
  }

  // 按鈕 『離開』
  onLeave() {
    if(this.caseType == 'review' || this.isNotCloseNotify){
      this.$emit("onLeave");
    } else {
      Modal.confirm({
        okText: this.$t('global_ok').toString(),                     // 確定
        cancelText: this.$t('global_cancel').toString(),             // 取消
        title: this.$t('global_confirm').toString(),                 // 確認
        content: this.$t('global_confirm_cancelSend').toString(),    // 確認取消發送?
        onOk: () => {
          //開單離開
          if(this.$props.step == 1){
            (this.$refs.infInform as any).handleLeave();
          }
          //回覆離開
          else if(this.$props.step == 2){
            (this.$refs.infReplyForm as any).handleLeave();
          }
          this.$emit("onLeave");
        }
      });
    }
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
  }

  //取得方便連絡時段時間
  getContactDateTime(time, addMinute, date){
    if(time == null){
        return null
    }else{
        return moment(date).set('hour',time.hour()).set('minute',time.minute()+ addMinute).format("YYYY-MM-DD HH:mm");
    }
  }

  //轉件成功
  transferSuccess(){
    this.isTransferFormVisible = true;
    this.$emit('onLeave');
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