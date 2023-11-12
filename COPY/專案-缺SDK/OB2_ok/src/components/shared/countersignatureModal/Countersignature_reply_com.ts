import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Modal, TimePicker } from "ant-design-vue";
import DatePicker from '@fubonlife/vue2-datepicker';
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import { FileGrid, FileReplyAndClose, InfReplyForm, InfReplyValidateForm } from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { AxiosResponse } from "axios";
import { InfFormReplyInitData, InfFormReplyReadOnly, InfReplyLeaveInputDto, OutputErrorCodeDto, ResponseEntity } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import VlidationUtil from "@/assets/config/ValidationUtil";

@Component({
    components: { TimePicker, DatePicker, FblDataGrid }
})
export default class CountersignatureModalReply extends Vue {
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  insetPolicy!: string;

  @Prop()
  replyInfInfoId: string;

  @Prop()
  infTypeId: string;

  singleFile:FileReplyAndClose = {
    fileId: "",
    fileName: "",
    fileRemark: "",
    uploadData: null,
  };
  fileList = [];

  //回覆區塊唯讀資料
  infReplyReadOnly :InfFormReplyReadOnly={
    handleStatusDesc: '',
    replyContent: '',
    visitDateRange: '',
    replierInfo: '',
    replyTimeString: '',
    fileList: []
  }

  //回覆表單內容
  infReplyForm : InfReplyForm ={
    handleStatus: "",
    contentId: "",
    content: "",
    contactDate: null,
    contactString: "",
    datePickerContactDate: null,
    convenientContactStartTime: null,
    convenientContactEndTime: null,
    convenientContactStartString: "",
    convenientContactEndString: "",
    fileIds: [],
    fileNames: [],
    deletedFileIds: []
  }

  //回覆表單驗證物件
  infReplyValidateForm : InfReplyValidateForm = {
    content: { feedback: false, hoverVisible: false, msg: ""},
    contactDate: { feedback: false, hoverVisible: false, msg: ""},
    convenientContactStartTime: { feedback: false, hoverVisible: false, msg: ""},
    convenientContactEndTime: { feedback: false, hoverVisible: false, msg: ""},
  }

  // 欄位驗證
  infReplyFormRules: { [key: string]: ValidationRule[] } = {
    content: [{ validator: this.validateContent, trigger: "blur" }],
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
  uploadingFile: FileGrid = null;

  // ================================= 表單顯示用資料 =================================

  // 處理狀態 選項
  handleStatusOptions = [];
  // 回覆內容 選項
  replyContentOption = [];

  // 檔案列表 table
  public gridFileData = {
    rowKey: 'rowkey',
    data: [],
    // pagination: false,
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        property: 'handleTemp',
        template: 'handleTemp',
        width: 10,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'fileName',
        title: '檔案名稱',
        formatter: (data: FileGrid) => {
            if (data) {
                return [data.fileName, data.fileExtension].join(".")
            }
        }
    },
    ],
  };
  
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
      this.$informApi.saveInfSingleFileUsingPOST(this.uploadingFile)
        .then((resp: AxiosResponse<OutputErrorCodeDto>) => {
          if (resp.data.success) {
            const [ext, ...fileNames] = this.selectedFileName.split('.').reverse();
            this.gridFileData.data.push({
              rowkey: this.gridFileData.data.length + 1,
              fileId: resp.data.returnMessage,
              fileName: fileNames ? fileNames.reverse().join(".") : ext,
              fileExtension: fileNames ? ext : "",
            });
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
  handleRemove(data: FileGrid) {
    Modal.confirm({
      okText: this.$t('global_ok').toString(),
      cancelText: this.$t('global_cancel').toString(),
      title: "確認",
      content: "確認刪除?",
      onOk: () => {
        // 暫時刪除檔案
        this.infReplyForm.deletedFileIds.push(data.fileId);
        this.gridFileData.data = this.gridFileData.data.filter(d => d.fileId != data.fileId);
      }
    });
  }

  /**
   * 下載檔案
   * @param data 
   */
   handleDownload(data: FileGrid) {
    LoadingUtil.show();
    this.$fileUploadApi.downloadFileUsingPOST(data.fileId, { responseType: 'blob' })
      .then((resp: AxiosResponse<ResponseEntity>) => {
        this.dealDownLoadData(resp.data, [data.fileName, data.fileExtension].join("."));
      }).catch(e => {
        ErrorModalUtil.modalError("下載失敗"); // 下載失敗
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
      ErrorModalUtil.modalError("下載失敗"); // 下載失敗
    }
  }
  

  /**
   * 監聽
   */
  @Watch('fileList')
  onFileListChanged(newVal) {
    const newGridData = []
    if(newVal.length > 0) {
      newVal.map((file, idx) => {
        newGridData.push({ rowkey: idx, fileName: file.name, });
        this.gridFileData.data = newGridData;
      })
    } else {
      this.gridFileData.data = [];
      this.singleFile.fileName = null;
    }
  }
  // 更新父層資料
  @Watch('form', { deep: true })
  watchForm(newVal) {
    this.$emit('emitFormData',  {
      replay: newVal
    });
  }

  /**
  * Hook
  */
  created() {
    if(this.isEdit){
      this.editDataInfo();
    }else{
      this.readonlyInfo();
    }
  }

  //唯讀資訊載入
  readonlyInfo(){
    // 搬到外層判斷
    // LoadingUtil.show();
    this.$informApi.replyInformInitReadOnlyUsingGET(this.replyInfInfoId).then((resp:AxiosResponse<InfFormReplyReadOnly>)=>{
      this.infReplyReadOnly = resp.data;
      //會辦檔案資訊
      if(this.infReplyReadOnly.fileList != null && this.infReplyReadOnly.fileList.length>0){
        this.infReplyReadOnly.fileList.forEach((file)=>{
          this.gridFileData.data.push({
            rowkey: this.gridFileData.data.length + 1,
            fileId: file.fileId,
            fileName: file.fileName,
            fileExtension: file.fileExtension,
          });
        })
      }
    }).finally(()=>{
      this.$emit('resultLoading',true);
      // 搬到外層判斷
      // LoadingUtil.close();
    })
  }

  //編輯表單初始資料載入
  editDataInfo(){
    this.infReplyForm ={
      handleStatus: "",
      contentId: "",
      content: "",
      contactDate: null,
      contactString: "",
      datePickerContactDate: null,
      convenientContactStartTime: null,
      convenientContactEndTime: null,
      convenientContactStartString: "",
      convenientContactEndString: "",
      fileIds: [],
      fileNames: [],
      deletedFileIds: []
    }
    // 搬到外層判斷
    // LoadingUtil.show();
    this.$informApi.replyInformInitUsingGET(this.replyInfInfoId)
    .then((resp: AxiosResponse<InfFormReplyInitData>)=>{
      this.handleStatusOptions = resp.data.handleStatus;
      this.replyContentOption = resp.data.replyContentOption;
      this.infReplyForm.handleStatus = "01";
      // 帶出先前暫存的方便連絡時段
      if(!VlidationUtil.isEmpty(resp.data.visitStartTime) && !VlidationUtil.isEmpty(resp.data.visitEndTime)){
        this.isTimePickerShow = true;
        this.infReplyForm.contactDate = moment(resp.data.visitStartTime);
        this.infReplyForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(resp.data.visitStartTime)));
        this.infReplyForm.datePickerContactDate = moment(resp.data.visitStartTime).toDate();
        this.infReplyForm.convenientContactStartTime = moment(resp.data.visitStartTime);
        this.infReplyForm.convenientContactStartString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(resp.data.visitStartTime)));
        this.infReplyForm.convenientContactEndTime = moment(resp.data.visitEndTime);
        this.infReplyForm.convenientContactEndString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(resp.data.visitEndTime)));
      }
      // 帶出先前暫存的回覆內容
      if(!VlidationUtil.isEmpty(resp.data.replyContent)){
        this.infReplyForm.content = resp.data.replyContent;
      }
      // 帶出先前暫存的回覆檔案資訊
      if(resp.data.fileList != null && resp.data.fileList.length>0){
        resp.data.fileList.forEach((file)=>{
          this.gridFileData.data.push({
            rowkey: this.gridFileData.data.length + 1,
            fileId: file.fileId,
            fileName: file.fileName,
            fileExtension: file.fileExtension,
          });
        })
      }
    }).finally(()=>{
      this.$emit('resultLoading',true);
      // 搬到外層判斷
      // LoadingUtil.close();
    })
  }

  //處理狀態選項變動
  onHandleStatusChange(){
    if(this.infReplyForm.handleStatus =='01'){
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.content,false,"",false);
    }
  }

  //回覆罐頭語選項變動
  onContentIdChange(){
    this.infReplyForm.content = this.replyContentOption.find((option)=> option.value == this.infReplyForm.contentId).label;
    //回覆內容驗證
    this.validateContent(null,this.infReplyForm.content,()=>{});
  }

  //===========================方便連絡日 相關方法 start ==========================================

    //自動轉為字串更新搜尋條件
    onContactDateChange(date){
      this.infReplyForm.contactDate = date;
      this.infReplyForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
      this.isContactDateVisible = false;
      CommonUtil.feildValidate(this.infReplyValidateForm.contactDate,false,"success","","");
      if(ValidationUtil.isEmpty(this.infReplyForm.contactString)){
          this.isTimePickerShow = false;
      }else{
          this.isTimePickerShow = true;
          this.validateTimeStart();
      }
  }

  //清除日期
  clearContactDate(){
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.contactDate,false,"",false);
    this.isContactDateVisible = false;
    this.infReplyForm.contactString = "";
    this.infReplyForm.contactDate = null;
    this.infReplyForm.datePickerContactDate = null;
    this.infReplyForm.convenientContactStartString = "";
    this.infReplyForm.convenientContactStartTime = null;
    this.infReplyForm.convenientContactEndString = "";
    this.infReplyForm.convenientContactEndTime = null;
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,false,"",false);
    this.isTimePickerShow = false;
  }

  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
   checkManualInputContactDate(data: any) {
    this.isContactDateVisible = false;
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.contactDate,false,"",false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.contactDate,false,"",false);
    } else {
      this.isContactDateVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.contactDate,true,this.$t('global_dateError').toString(),false);
    }
    this.infReplyForm.contactDate = parseDate ? parseDate : this.infReplyForm.contactDate;
    this.infReplyForm.contactString = parseDate ?
    MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infReplyForm.contactDate.toString()))) :
    data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
   eventMouseOverContactDate() {
      if (this.infReplyValidateForm.contactDate.feedback) {
          this.isContactDateVisible = true;
      } else {
          this.isContactDateVisible = false;
      }
  }
  //===========================方便連絡日 相關方法 end ==========================================

  //===========================時間選擇器 相關方法 start ==========================================

  clickConvenientContactStartTimePicker(open){
      this.isConvenientContactStartOpen = open;
  }

  clickConvenientContactEndTimePicker(open){
      this.isConvenientContactEndOpen = open;
  }

  //選擇時間(起)後，將時間更新
  onConvenientContactStartTimeChange(date, timeString) {
    this.isTimeStartVisible = false;
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,false,"",false);
    this.infReplyForm.convenientContactStartString = timeString;
    this.infReplyForm.convenientContactEndTime = this.infReplyForm.convenientContactStartTime;
    this.infReplyForm.convenientContactEndString = this.infReplyForm.convenientContactStartString;
    this.validateTimeStart();
  }
  
  //選擇時間(迄)後，將時間更新
  onConvenientContactEndTimeChange(date, timeString) {
    this.isTimeEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,false,"",false);
    this.infReplyForm.convenientContactEndString = timeString;
    this.validateTimeEnd();
  }

  //手動關閉時間選擇器(起)
  closeConvenientContactStartTimePicker() {
    this.isConvenientContactStartOpen = false;
  }

  //手動關閉時間選擇器(迄)
  closeConvenientContactEndTimePicker() {
    this.isConvenientContactEndOpen = false;
  }

  //===========================時間選擇器 相關方法 end =========================================

  //判斷時間是否小於現在時間
  validateTimeStart() {
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,false,"",false);
    let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.infReplyForm.contactDate).startOf("dates"));
    let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
    if(selectDate == today){
      if (!ValidationUtil.isEmpty(this.infReplyForm.convenientContactStartString)) {
        let start = moment(this.infReplyForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
        if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
          CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false); // 時間不可小於現在時間
          CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);   // 時間不可小於現在時間
        }
      }
    }
  }

  //判斷時間起訖與範圍
  validateTimeEnd() {
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,false,"",false);
    if (!ValidationUtil.isEmpty(this.infReplyForm.convenientContactEndString)) {
      if( MomentUtil.transferMomentToTimestamp( this.infReplyForm.convenientContactEndTime) < MomentUtil.transferMomentToTimestamp(this.infReplyForm.convenientContactStartTime)){
        //起訖時間有誤
        CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
        CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
      }else{
        let start = moment(this.infReplyForm.convenientContactStartTime) ;
        if( start.add(480,"minutes").isBefore(this.infReplyForm.convenientContactEndTime)){
          // 起訖不得超過八小時
          CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_over').toString(),false);
          CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_over').toString(),false);
        }
        start = moment(this.infReplyForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.infReplyForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
        if(selectDate == today){
          if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
            // 時間不可小於現在時間
            CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
            CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
          }
        }
      }
    }
  }

  //回覆內容驗證
  validateContent(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.content,false,"",false);
    if (ValidationUtil.isEmpty(this.infReplyForm.content) && this.infReplyForm.handleStatus != '01') {
      // 回覆內容 必填
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.content,true,this.$t('infReplyForm_contentRequried').toString(),false);
      callback(() => { });
    }else if(this.infReplyForm.content.length >200){
      // 回覆內容 不可超過50字
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.content,true,this.$t('infReplyForm_contentOver50').toString(),false);
      callback(() => { });
    }
    callback();
  }

  //日期選擇器，可選擇範圍限定於系統日之後
  disabledDate(value) {
    const rangeStart = moment().add(-1,'days');
    if (!value || !rangeStart) {
      return false;
    }
    return (value.valueOf() < rangeStart.valueOf());
  }

  //回覆表單送出前驗證
  validateInfReplySubmit(isTempSave){
    let validate = true;

    //回覆內容
    this.validateContent(null,this.infReplyForm.content,()=>{
      if(this.infReplyValidateForm.content.feedback && !isTempSave){
        validate = false;
      }
    });

    //方便聯絡時間驗證
    if(!ValidationUtil.isEmpty(this.infReplyForm.contactString) &&(ValidationUtil.isEmpty(this.infReplyForm.convenientContactStartString) || ValidationUtil.isEmpty(this.infReplyForm.convenientContactEndString))){
      // 時間起迄皆不可為空值
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_required').toString(),false);
      CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_required').toString(),false);
      validate = false;
    }

    //方便聯絡時間驗證
    if(!ValidationUtil.isEmpty(this.infReplyForm.contactString)){
      let start = this.getContactDateTime(this.infReplyForm.convenientContactStartTime,0,this.infReplyForm.contactDate);
      let end = this.getContactDateTime(this.infReplyForm.convenientContactEndTime,0,this.infReplyForm.contactDate);
      if(start == end){
        validate = false;
        // 起訖時間有誤
        CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
        CommonUtil.feildValidateWithVisible(this.infReplyValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
      }
      if(this.infReplyValidateForm.convenientContactStartTime.feedback || this.infReplyValidateForm.convenientContactEndTime.feedback){
        validate = false;
      }
    }

    if(this.infTypeId !='6' && this.gridFileData.data.length<1 && !isTempSave){
      validate = false;
      //通報類或親訪類 附加檔案為必填項目
      ErrorModalUtil.modalError(this.$t('infReplyForm_fileRequire').toString());
    }

    return validate;
  }

  //取得方便連絡時段時間
  getContactDateTime(time, addMinute, date){
    if(time == null){
      return null
    }else{
      return moment(date).set('hour',time.hour()).set('minute',time.minute()+ addMinute).format("YYYY-MM-DD HH:mm");
    }
  }

  //取得會辦回覆區塊資料
  getInfReplyData(){
    this.infReplyForm.fileIds = [];
    this.infReplyForm.fileNames = [];
    (this.gridFileData.data as FileGrid[]).forEach(d => {
      this.infReplyForm.fileIds.push(d.fileId);
      this.infReplyForm.fileNames.push(d.fileName);
    });
    return this.infReplyForm;
  }

  /**
   * 會辦回覆 離開
   */
   handleLeave() {
    // 若檔案清單有資料，須將本次上傳的檔案刪除
    let fileIdList: string[] = [];
    if (this.gridFileData.data.length > 0) {
      this.gridFileData.data.forEach(d => {
        fileIdList.push(d.fileId);
      });
    }
    
    let replyLeaveInput: InfReplyLeaveInputDto = {
      infInfoId: this.replyInfInfoId,
      fileIds: fileIdList,
      deletedFileIds: this.infReplyForm.deletedFileIds
    }
    this.$informApi.infReplyLeaveDeleteFilesUsingPOST(replyLeaveInput)
    .catch((err)=>{
      console.error(err);
    })
  }

  //========================共用驗證相關物件開始===================================

  //取得驗證feedback綁定的參數
  callCommonUtilFeildFeedback(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateFeedback(fv);
  }

  //取得驗證status綁定的參數
  callCommonUtilFeildStatus(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateStatus(fv);
  }

  //取得hover content綁定的參數
  callCommonUtilFeildMsg(fv: ValidateFormComponent){
    return CommonUtil.getFeildValidateHoverMsg(fv);
  }

  //取得hover trigger綁定的參數
  callCommonUtilFeildTrigger(fv: ValidateFormComponent){
    CommonUtil.getFeildVaildateTrigger(fv);
  }

  //取得hover hoverVisivle綁定的參數
  callCommonUtilFeildHoverVisible(fv: ValidateFormComponent){
    return CommonUtil.getFeildVaildateHoverVisible(fv);
  }

  //變更hover hoverVisivle參數
  callCommonUtilFeildVisibleChange(fv: ValidateFormComponent){
    CommonUtil.getFeildValidateVisibleChange(fv);
  }

  //========================共用驗證相關物件結束===================================
}