import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import { Modal, TimePicker } from "ant-design-vue";
import DatePicker from '@fubonlife/vue2-datepicker';
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import { CloseValidateForm } from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { OutputErrorCodeDto, NotiFileUploadDto, ResponseEntity, InfFileDto, OutputDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import MessageUtil from "@/assets/config/MessageUtil";

@Component({
    components: { TimePicker, DatePicker, FblDataGrid }
})
export default class NotificationClosed extends Vue {

  @Prop()
  notiInfoId!: string;

  @Prop()
  caseNo: string;

  //結案表單
  notificationClosedForm = {
    caseClosedRemark: '',
    contactDate: null,
    contactString: "",
    notiContactStartTime: null,
    notiContactEndTime: null,
    notiContactStartTimeString: "",
    notiContactEndTimeString: "",
    fileIds: [],
    fileNames: [],
    returnPool: false,
    checkReturnPool: false
  }

  //結案表單驗證物件
  notiCloseValidateForm : CloseValidateForm = {
    caseClosedRemark: { feedback: false, hoverVisible: false },
    contactDate: { feedback: false, hoverVisible: false },
    notiContactStartTime: { feedback: false, hoverVisible: false },
    notiContactEndTime: { feedback: false, hoverVisible: false },
  }

  // 欄位驗證
  notiClosedRules: { [key: string]: ValidationRule[] } = {
    caseClosedRemark: [{ validator: this.validateCloseRemark, trigger: "blur" }],
    convenientContactStartTime: [{ validator: this.validateTimeStart, trigger: "blur" }],
    convenientContactEndTime: [{ validator: this.validateTimeEnd, trigger: "blur" }],
  };

  //日期選擇器hover是否顯示
  isContactDateVisible: boolean = false;
  isTimeStartVisible: boolean = false;
  isTimeEndVisible: boolean = false;

  //時間選擇器是否顯示
  isConvenientContactStartOpen: boolean = false;
  isConvenientContactEndOpen: boolean = false;

  isTimePickerShow: boolean = false;

  // DatePicker民國年的格式
  formatter = this.$twDateFormatter;

  // 選擇上傳檔案名稱
  selectedFileName: string = "";
  // 上傳按鍵wording變換
  isUploading: boolean = false;
  // 上傳檔案儲存變數
  uploadingFile: File = null;

  // 解決Tooltip無法隱藏的問題
  isDateVisible: boolean = false;

  // 時間選擇器是否開啟
  isTimePickerStartOpen: boolean = false;
  isTimePickerEndOpen: boolean = false;
  

  // ================================= 表單顯示用資料 =================================
  // 檔案列表 table
  public gridFileData : FblPDataGridHolder<InfFileDto> = {
    rowKey: 'fileId',
    data: [],
    // pagination: false,
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        title: '',
        property: 'fileId',
        template: 'handleTemp',
        width: 10,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'fileName',
        title: this.$t('global_fileName').toString()
      },
    ],
  };


  //日期選擇器，可選擇範圍限定於系統日之後
  disabledDate(value) {
    const rangeStart = moment().add(-1,'days');
    if (!value || !rangeStart) {
      return false;
    }
    return (value.valueOf() < rangeStart.valueOf());
  }

  /**
   * 上傳前端檢核 檢查格式與檔案大小
   * @param file 
   * @returns 
   */
  beforeUpload(file: File) {
    let fileTypeCheckResult = ValidationUtil.fileTypeValidate(file);

    //判斷檔案類型
    if (!fileTypeCheckResult) {
      Modal.error({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        // 錯誤
        title: this.$t('global_error').toString(),
        // 檔案格式僅可上傳WORD、EXCEL、PDF、TIF、TXT、MSG、JPG
        content: this.$t('infReplyForm_fileTypeError').toString(),
      });
      return false;
    }

    if (file.size >= 15_759_375) {
      Modal.error({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('global_error').toString(), // 錯誤
        content: this.$t('fileUpload_sizeToobig').toString(), // 「上傳檔案」檔案大於15Mb
      });
      return false;
    }

    if (file.size <= 0) {
      Modal.error({
        okText: this.$t('global_ok').toString(),
        cancelText: this.$t('global_cancel').toString(),
        title: this.$t('fileUpload_error').toString(), // 錯誤
        content: this.$t('fileUpload_sizeToosmall').toString(), // 「上傳檔案」檔案大小為0,不可上傳！
      });
      return false;
    }

    this.uploadingFile = file;
    this.selectedFileName = file.name;
    return false;
  }

  /**
   * 上傳檔案
   */
  handleUpload() {
    this.isUploading = true;
    if (!ValidationUtil.isEmpty(this.uploadingFile)) {
      LoadingUtil.show();
      this.$notificationApi.notiFileUploadUsingPOST(this.uploadingFile)
        .then((resp: AxiosResponse<NotiFileUploadDto>) => {
          if (resp.data.success) {
            
            const [ext, ...fileNames] = this.selectedFileName.split('.').reverse();
            this.gridFileData.data.push({
              fileId: resp.data.fileId,
              fileName: fileNames ? this.selectedFileName : ext,
              fileExtension: fileNames ? ext : "",
            });

            // 紀錄新增的檔案
            this.notificationClosedForm.fileIds.push(resp.data.fileId);
          } else {
            ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
          }
        }).catch((err) => {
          console.error(err);
          ErrorModalUtil.modalError(this.$t('global_upload_failed').toString()); // 上傳失敗
        }).finally(() => {
          this.isUploading = false;
          this.uploadingFile = null;
          this.selectedFileName = "";
          LoadingUtil.close();
        });
    }
  }

  /**
   * 刪除檔案
   * @param data 
   */
  handleRemove(data: InfFileDto) {
    Modal.confirm({
      okText: this.$t('global_ok').toString(),
      cancelText: this.$t('global_cancel').toString(),
      title: this.$t('global_confirm').toString(),              // 確認
      content: this.$t('fileUpload_deleteConfirm').toString(),  // 確認刪除?
      onOk: () => {
        LoadingUtil.show();
        this.$fileUploadApi.deleteFileUsingPOST(data.fileId).then((resp: AxiosResponse<OutputErrorCodeDto>) => {
          if (resp.data.success) {
            this.gridFileData.data = this.gridFileData.data.filter(d => d.fileId != data.fileId);
            this.notificationClosedForm.fileIds.filter(fileId => fileId != data.fileId);
          }
        }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
      }
    });
  }

  /**
   * 下載檔案
   * @param data 
   */
  handleDownload(data: InfFileDto) {
    LoadingUtil.show();
    this.$fileUploadApi.downloadFileUsingPOST(data.fileId, { responseType: 'blob' })
      .then((resp: AxiosResponse<ResponseEntity>) => {
        this.dealDownLoadData(resp.data, data.fileName);
      }).catch(e => {
        ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
      }).finally(() => LoadingUtil.close());
  }

  /**
   * 處理後端回傳的下載內容
   * @param resData 
   * @param fileName 
   */
  dealDownLoadData(resData, fileName) {
    try {
      let blob;
      if (resData instanceof Blob) {
        blob = resData;
      } else {
        blob = new Blob([resData], { type: resData.type });
      }
      if (!!window.ActiveXObject || "ActiveXObject" in window) {  //IE瀏覽器
        (window.navigator as any).msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕 
        // navigator.msSaveOrOpenBlob(blob, fileName); //有儲存和開啟按鈕 
      } else {
        var linkElement = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute("download", fileName);
        var clickEvent = new MouseEvent("click",
          {
            "view": window,
            "bubbles": true,
            "cancelable": false
          });
        linkElement.dispatchEvent(clickEvent);
      }
    } catch (e) {
      ErrorModalUtil.modalError(this.$t('fileUpload_downloadFail').toString()); // 下載失敗
    }
  }

  /**
   * @description 照會結案送出
   * 
   * @author B1529
   * @version 2022/09/01
   */
  async notiClosedSubmit(){

    // 送出驗證
    if(this.validateCloseSubmit()) {

      // 有方便聯絡時間
      if( !ValidationUtil.isEmpty(this.notificationClosedForm.contactDate) ){

        // 檢查是否回大眾池
        await this.checkReturnPool();
        if(this.notificationClosedForm.checkReturnPool){
          if(this.notificationClosedForm.returnPool){
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
                this.clearContactDate();
              },
              onCancel: () => {
                //原指定電訪員於該方便聯絡時段非當班 不調整、回大眾池 實際送出資料
                this.notiClosed();
              }
            });
          } else {
            //原指定電訪員於該方便聯絡時段當班 實際送出資料
            Modal.confirm({
              class: "error-modal-util-class",
              content: this.$t('infMainForm_sureToClose').toString(), //確認結案？
              okText: this.$t('global_yes').toString(), //是
              cancelText: this.$t('global_no').toString(),  //否
              icon: 'info-circle',
              onOk: () => {
                this.notiClosed();
              }
            });
          }
        }

      } else {
        //結案且無方便連絡時段/回覆 直接送出
        Modal.confirm({
          class: "error-modal-util-class",
          content: this.$t('infMainForm_sureToClose').toString(), //確認結案？
          okText: this.$t('global_yes').toString(), //是
          cancelText: this.$t('global_no').toString(),  //否
          icon: 'info-circle',
          onOk: () => {
            this.notiClosed();
          }
        });
      }

    }
  }

  //===========================方便連絡日 相關方法 start ==========================================

  //自動轉為字串更新搜尋條件
  onContactDateChange(date){
    this.notificationClosedForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isContactDateVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.contactDate,false,"",false);
    if(ValidationUtil.isEmpty(this.notificationClosedForm.contactString)){
      this.isTimePickerShow = false;
    }else{
      this.isTimePickerShow = true;
      this.validateTimeStart();
    }

    //結案備註
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.caseClosedRemark,false,"",false);
  }

  //清除日期
  clearContactDate(){
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.contactDate,false,"",false);
    this.isContactDateVisible = false;
    this.notificationClosedForm.contactString = "";
    this.notificationClosedForm.contactDate = null;
    this.notificationClosedForm.notiContactStartTimeString = "";
    this.notificationClosedForm.notiContactStartTime = null;
    this.notificationClosedForm.notiContactEndTimeString = "";
    this.notificationClosedForm.notiContactEndTime = null;
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime , false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,false,"",false);
    this.isTimePickerShow = false;
  }

  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputContactDate(data: any) {
    this.isContactDateVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.contactDate,false,"",false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.contactDate,false,"",false);
    } else {
      this.isContactDateVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.contactDate,true,this.$t('global_dateError').toString(),false);    
    }
    this.notificationClosedForm.contactDate = parseDate ? parseDate : this.notificationClosedForm.contactDate;
    this.notificationClosedForm.contactString = parseDate ?
    MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.notificationClosedForm.contactDate.toString()))) :
    data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  //===========================方便連絡日 相關方法 end ==========================================

  //===========================時間選擇器 相關方法 start ==========================================

  clickConvenientContactStartTimePicker(open){
    this.isConvenientContactStartOpen = open;
  }

  clickConvenientContactEndTimePicker(open){
    this.isConvenientContactEndOpen = open;
  }

  //選擇時間後，將時間更新
  onConvenientContactStartTimeChange(date, timeString) {
    this.isTimeStartVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime, false, "", false);
    this.notificationClosedForm.notiContactStartTimeString = timeString;
    this.notificationClosedForm.notiContactEndTime = this.notificationClosedForm.notiContactStartTime;
    this.notificationClosedForm.notiContactEndTimeString = this.notificationClosedForm.notiContactStartTimeString;
    this.validateTimeStart();
  }
  
  onConvenientContactEndTimeChange(date, timeString) {
    this.isTimeEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime , false, "", false);
    this.notificationClosedForm.notiContactEndTimeString = timeString;
    this.validateTimeEnd();
  }

  closeConvenientContactStartTimePicker() {
    this.isConvenientContactStartOpen = false;
  }

  closeConvenientContactEndTimePicker() {
    this.isConvenientContactEndOpen = false;
  }

  //===========================時間選擇器 相關方法 end =========================================

  //判斷時間是否小於現在時間
  validateTimeStart() {
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,false,"",false);
    let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.notificationClosedForm.contactDate).startOf("dates"));
    let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
    if(selectDate == today){
      if (!ValidationUtil.isEmpty(this.notificationClosedForm.notiContactStartTimeString)) {
        let start = moment(this.notificationClosedForm.notiContactStartTime).add(1,"minutes").startOf("minutes");
        if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false); // 時間不可小於現在時間
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);   // 時間不可小於現在時間
        }
      }
    }
  }

  //判斷時間起訖與範圍
  validateTimeEnd() {
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,false,"",false);
    if (!ValidationUtil.isEmpty(this.notificationClosedForm.notiContactEndTimeString)) {
      if( MomentUtil.transferMomentToTimestamp( this.notificationClosedForm.notiContactEndTime) < MomentUtil.transferMomentToTimestamp(this.notificationClosedForm.notiContactStartTime)){
        //起訖時間有誤
        CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
        CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
      }else{
        let start = moment(this.notificationClosedForm.notiContactStartTime) ;
        if( start.add(480,"minutes").isBefore(this.notificationClosedForm.notiContactEndTime)){
          // 起訖不得超過八小時
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime,true,this.$t('pedding_mark_time_over').toString(),false);
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime,true,this.$t('pedding_mark_time_over').toString(),false);
        }
        start = moment(this.notificationClosedForm.notiContactStartTime).add(1,"minutes").startOf("minutes");
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.notificationClosedForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
        if(selectDate == today){
          if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
            // 時間不可小於現在時間
            CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime, true, this.$t('pedding_mark_time_before_now').toString(),false);
            CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime, true, this.$t('pedding_mark_time_before_now').toString(),false);
          }
        }
      }
    }
  }

  /**
   * @description 驗證方便聯絡時段是否為空
   * 
   * @author B1529
   * @version 2022/08/23
   */
  validateContractDate(){

    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime, false, "", false);
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime, false, "", false);

    if(!ValidationUtil.isEmpty(this.notificationClosedForm.contactString)) {

      let next = true;

      // 檢查起訖不能為空
      if( ValidationUtil.isEmpty(this.notificationClosedForm.notiContactEndTimeString) || ValidationUtil.isEmpty(this.notificationClosedForm.notiContactEndTimeString) ){
        // 時間起不可為空值
        CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime, true, this.$t('pedding_mark_time_required').toString(), false);
        // 時間訖不可為空值
        CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime, true, this.$t('pedding_mark_time_required').toString(), false);
        next = false;
      }

      // 檢查起訖不能相同
      if(next){
        let start = this.getContactDateTime(this.notificationClosedForm.notiContactStartTime, this.notificationClosedForm.contactDate);
        let end = this.getContactDateTime(this.notificationClosedForm.notiContactEndTime, this.notificationClosedForm.contactDate);
        if(start == end){
          
          // 起訖時間有誤
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactStartTime, true, this.$t('pedding_start_and_end_error').toString(),false);
          CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.notiContactEndTime , true, this.$t('pedding_start_and_end_error').toString(),false);
        }
      }
    }
  }

  //結案備註驗證
  validateCloseRemark(rule, value, callback){
    //若有方便連絡時段 必填
    CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.caseClosedRemark,false,"",false);
    if (!ValidationUtil.isEmpty(this.notificationClosedForm.contactString) && ValidationUtil.isEmpty(this.notificationClosedForm.caseClosedRemark)) {
      // 結案備註 必填
      CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.caseClosedRemark,true,
        this.$t('infCloseForm_closeRemarkRequired').toString(),false);
      callback(() => { });
    }else if(this.notificationClosedForm.caseClosedRemark.length >200){
      // 結案備註 不可超過200字
      CommonUtil.feildValidateWithVisible(this.notiCloseValidateForm.caseClosedRemark,true,this.$t('infCloseForm_closeRemarkOver200').toString(),false);
      callback(() => { });
    }
    callback();
  }

  //結案表單送出前驗證
  validateCloseSubmit(){
    let validate = true;

    //結案備註
    this.validateCloseRemark(null,this.notificationClosedForm.caseClosedRemark,()=>{
      if(this.notiCloseValidateForm.caseClosedRemark.feedback){
        validate = false;
      }
    });

    // 有方便聯絡時間
    if(validate && !ValidationUtil.isEmpty(this.notificationClosedForm.contactString)){

      //方便聯絡時間(起)驗證
      this.validateTimeStart();
      if(this.notiCloseValidateForm.notiContactStartTime.feedback){
          validate = false;
      }

      //方便聯絡時間(訖)驗證
      if(validate){
        this.validateTimeEnd();
        if(this.notiCloseValidateForm.notiContactEndTime.feedback){
            validate = false;
        }
      }

      // 驗證方便連絡時段
      if(validate){
        this.validateContractDate();
        if(this.notiCloseValidateForm.notiContactStartTime.feedback 
            || this.notiCloseValidateForm.notiContactEndTime.feedback){
            validate = false;
        }
      }
    }

    return validate;
  }

  //取得方便連絡時段時間
  getContactDateTime(time, date){
    if(time == null){
      return null
    }else{
      return moment(date).set('hour',time.hour()).set('minute',time.minute()).format("YYYY-MM-DD HH:mm");
    }
  }

  //取得會辦結案區塊資料
  getInfCloseData(){
      this.notificationClosedForm.fileIds = [];
      this.notificationClosedForm.fileNames = [];
      (this.gridFileData.data as InfFileDto[]).forEach(d => {
          this.notificationClosedForm.fileIds.push(d.fileId);
          this.notificationClosedForm.fileNames.push(d.fileName);
      });
      return this.notificationClosedForm;
  }
//========================共用驗證相關物件開始===================================

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

  //========================共用驗證相關物件結束===================================

  //================================== Ajax =====================================

  /**
   * @description 照會結案
   * 
   * @author B1529
   * @version 2022/09/01
   */
  notiClosed(){

    LoadingUtil.show();

    let contactStart = this.getContactDateTime(this.notificationClosedForm.notiContactStartTime, this.notificationClosedForm.contactDate);
    let contactEnd = this.getContactDateTime(this.notificationClosedForm.notiContactEndTime, this.notificationClosedForm.contactDate);

    this.$notificationApi.notiClosedUsingPOST({
      notiInfoId : this.notiInfoId,
      fileIds : this.notificationClosedForm.fileIds,
      visitStartDate : contactStart,
      visitEndDate : contactEnd,
      closedRemark : this.notificationClosedForm.caseClosedRemark
    }).then((res:AxiosResponse<OutputDto>) => {

      if(res.data.success){
        // 有提示警告訊息
        if(!ValidationUtil.isEmpty(res.data.warningMessage)){
          ErrorModalUtil.modalError(res.data.warningMessage);
        } else {
          // 照會結案成功
          MessageUtil.messageSuccess(this.$t('notificationModal_notiClosedSuccess').toString());
        }
        
        this.$emit('emitClosedSubmit');
      } else {
        ErrorModalUtil.modalError(res.data.returnMessage);
      }

    }).catch((err) => {
      console.log(err);
      // 照會結案儲存失敗
      ErrorModalUtil.modalError(this.$t('notificationModal_notiClosedFailure').toString());
    }).finally(() => {
      LoadingUtil.close();
    });
  }

  /**
   * @description 檢查是否回大眾池
   * 
   * @author B1529
   * @version 2022/09/01
   */
  async checkReturnPool(){

    LoadingUtil.show();

    let contactStart = this.getContactDateTime(this.notificationClosedForm.notiContactStartTime, this.notificationClosedForm.contactDate);
    let contactEnd = this.getContactDateTime(this.notificationClosedForm.notiContactEndTime, this.notificationClosedForm.contactDate);

    await this.$packMatchApi.checkReturnPoolUsingPOST({
      caseNo : this.caseNo,
      visitStartDate : contactStart,
      visitEndDate : contactEnd
    }).then((res:AxiosResponse<boolean>) => {

      this.notificationClosedForm.checkReturnPool = true;
      this.notificationClosedForm.returnPool = res.data;

    }).catch((err) => {
      console.log(err);
      this.notificationClosedForm.checkReturnPool = false;
      // 判斷是否需回大眾池失敗
      ErrorModalUtil.modalError(this.$t('infMainForm_returnToPublicFailed').toString());
    }).finally(() => {
      LoadingUtil.close();
    });
  }
}