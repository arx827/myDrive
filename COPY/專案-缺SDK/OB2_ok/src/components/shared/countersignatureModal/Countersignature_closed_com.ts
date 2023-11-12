import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Modal, TimePicker } from "ant-design-vue";
import DatePicker from '@fubonlife/vue2-datepicker';
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import { FileGrid, FileReplyAndClose, InfCloseValidateForm } from "./model";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { OutputErrorCodeDto, ResponseEntity } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import VlidationUtil from "@/assets/config/ValidationUtil";

@Component({
    components: { TimePicker, DatePicker, FblDataGrid }
})
export default class CountersignatureModalReply extends Vue {
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  insetPolicy!: string;

  singleFile:FileReplyAndClose = {
    fileId: "",
    fileName: "",
    fileRemark: "",
    uploadData: null,
  };
  fileList = [];

  // API 取得的唯讀資料
  countersignatureModalForm_closed = {
    data1: [
      {
        title: '檔案清單_會辦單回覆.pdf',
      },
    ],
    data2: '110/10/26 13:30',
    data3: '結案備註',
  };

  //結案表單
  infCloseForm = {
    caseClosedRemark: '',
    contactDate: null,
    contactString: "",
    convenientContactStartTime: null,
    convenientContactEndTime: null,
    convenientContactStartString: "",
    convenientContactEndString: "",
    fileIds: [],
    fileNames: [],
  }

  //結案表單驗證物件
  infCloseValidateForm : InfCloseValidateForm = {
    caseClosedRemark: { feedback: false, hoverVisible: false, msg: ""},
    contactDate: { feedback: false, hoverVisible: false, msg: ""},
    convenientContactStartTime: { feedback: false, hoverVisible: false, msg: ""},
    convenientContactEndTime: { feedback: false, hoverVisible: false, msg: ""},
  }

  // 欄位驗證
  infCloseormRules: { [key: string]: ValidationRule[] } = {
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
  uploadingFile: FileGrid = null;

  // 解決Tooltip無法隱藏的問題
  isDateVisible: boolean = false;

  // 時間選擇器是否開啟
  isTimePickerStartOpen: boolean = false;
  isTimePickerEndOpen: boolean = false;
  

  // ================================= 表單顯示用資料 =================================
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


  //日期選擇器，可選擇範圍限定於系統日之後
  disabledDate(value) {
    const rangeStart = moment().add(-1,'days');
    if (!value || !rangeStart) {
      return false;
    }
    return (value.valueOf() < rangeStart.valueOf());
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
      closed: newVal
    });
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
        LoadingUtil.show();
        this.$fileUploadApi.deleteFileUsingPOST(data.fileId).then((resp: AxiosResponse<OutputErrorCodeDto>) => {
          if (resp.data.success) {
            this.gridFileData.data = this.gridFileData.data.filter(d => d.fileId != data.fileId);
          }
        }).catch(e => console.error(e)).finally(() => LoadingUtil.close());
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

  //===========================方便連絡日 相關方法 start ==========================================

  //自動轉為字串更新搜尋條件
  onContactDateChange(date){
    this.infCloseForm.contactString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    this.isContactDateVisible = false;
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.contactDate,false,"",false);
    if(ValidationUtil.isEmpty(this.infCloseForm.contactString)){
      this.isTimePickerShow = false;
    }else{
      this.isTimePickerShow = true;
      this.validateTimeStart();
    }

    //結案備註
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.caseClosedRemark,false,"",false);
  }

  //清除日期
  clearContactDate(){
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.contactDate,false,"",false);
    this.isContactDateVisible = false;
    this.infCloseForm.contactString = "";
    this.infCloseForm.contactDate = null;
    this.infCloseForm.convenientContactStartString = "";
    this.infCloseForm.convenientContactStartTime = null;
    this.infCloseForm.convenientContactEndString = "";
    this.infCloseForm.convenientContactEndTime = null;
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,false,"",false);
    this.isTimePickerShow = false;
  }

  /**
   * 手動輸入開始日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputContactDate(data: any) {
    this.isContactDateVisible = false;
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.contactDate,false,"",false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.contactDate,false,"",false);
    } else {
      this.isContactDateVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.contactDate,true,this.$t('global_dateError').toString(),false);    
    }
    this.infCloseForm.contactDate = parseDate ? parseDate : this.infCloseForm.contactDate;
    this.infCloseForm.contactString = parseDate ?
    MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.infCloseForm.contactDate.toString()))) :
    data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
  eventMouseOverContactDate() {
    if (this.infCloseValidateForm.contactDate.feedback) {
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

  //選擇時間後，將時間更新
  onConvenientContactStartTimeChange(date, timeString) {
    this.isTimeStartVisible = false;
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,false,"",false);
    this.infCloseForm.convenientContactStartString = timeString;
    this.infCloseForm.convenientContactEndTime = this.infCloseForm.convenientContactStartTime;
    this.infCloseForm.convenientContactEndString = this.infCloseForm.convenientContactStartString;
    this.validateTimeStart();
  }
  
  onConvenientContactEndTimeChange(date, timeString) {
    this.isTimeEndVisible = false;
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,false,"",false);
    this.infCloseForm.convenientContactEndString = timeString;
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
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,false,"",false);
    let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.infCloseForm.contactDate).startOf("dates"));
    let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
    if(selectDate == today){
      if (!ValidationUtil.isEmpty(this.infCloseForm.convenientContactStartString)) {
        let start = moment(this.infCloseForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
        if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
          CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false); // 時間不可小於現在時間
          CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);   // 時間不可小於現在時間
        }
      }
    }
  }

  //判斷時間起訖與範圍
  validateTimeEnd() {
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,false,"",false);
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,false,"",false);
    if (!ValidationUtil.isEmpty(this.infCloseForm.convenientContactEndString)) {
      if( MomentUtil.transferMomentToTimestamp( this.infCloseForm.convenientContactEndTime) < MomentUtil.transferMomentToTimestamp(this.infCloseForm.convenientContactStartTime)){
        //起訖時間有誤
        CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
        CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
      }else{
        let start = moment(this.infCloseForm.convenientContactStartTime) ;
        if( start.add(480,"minutes").isBefore(this.infCloseForm.convenientContactEndTime)){
          // 起訖不得超過八小時
          CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_over').toString(),false);
          CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_over').toString(),false);
        }
        start = moment(this.infCloseForm.convenientContactStartTime).add(1,"minutes").startOf("minutes");
        let selectDate = MomentUtil.transferMomentToTimestamp(moment(this.infCloseForm.contactDate).startOf("dates"));
        let today = MomentUtil.transferMomentToTimestamp(moment(new Date()).startOf("dates"));
        if(selectDate == today){
          if( MomentUtil.transferMomentToTimestamp(start) < MomentUtil.transferMomentToTimestamp(moment())){
            // 時間不可小於現在時間
            CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
            CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_before_now').toString(),false);
          }
        }
      }
    }
  }

  //結案備註驗證
  validateCloseRemark(rule, value, callback){
    //若有方便連絡時段 必填
    CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.caseClosedRemark,false,"",false);
    if (!VlidationUtil.isEmpty(this.infCloseForm.contactString) && ValidationUtil.isEmpty(this.infCloseForm.caseClosedRemark)) {
      // 結案備註 必填
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.caseClosedRemark,true,
        this.$t('infCloseForm_closeRemarkRequired').toString(),false);
      callback(() => { });
    }else if(this.infCloseForm.caseClosedRemark.length >200){
      // 結案備註 不可超過200字
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.caseClosedRemark,true,this.$t('infCloseForm_closeRemarkOver200').toString(),false);
      callback(() => { });
    }
    callback();
  }

  //結案表單送出前驗證
  validateInfCloseSubmit(){
    let validate = true;

    //結案備註
    this.validateCloseRemark(null,this.infCloseForm.caseClosedRemark,()=>{
      if(this.infCloseValidateForm.caseClosedRemark.feedback){
        validate = false;
      }
    });

    //方便聯絡時間驗證
    if(!ValidationUtil.isEmpty(this.infCloseForm.contactString) &&(ValidationUtil.isEmpty(this.infCloseForm.convenientContactStartString) || ValidationUtil.isEmpty(this.infCloseForm.convenientContactEndString))){
      // 時間起迄皆不可為空值
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_mark_time_required').toString(),false);
      CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_mark_time_required').toString(),false);
      validate = false;
    }

    //方便聯絡時間驗證
    if(!ValidationUtil.isEmpty(this.infCloseForm.contactString)){
      let start = this.getContactDateTime(this.infCloseForm.convenientContactStartTime,0,this.infCloseForm.contactDate);
      let end = this.getContactDateTime(this.infCloseForm.convenientContactEndTime,0,this.infCloseForm.contactDate);
      if(start == end){
        validate = false;
        // 起訖時間有誤
        CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactStartTime,true,this.$t('pedding_start_and_end_error').toString(),false);
        CommonUtil.feildValidateWithVisible(this.infCloseValidateForm.convenientContactEndTime,true,this.$t('pedding_start_and_end_error').toString(),false);
      }
      if(this.infCloseValidateForm.convenientContactStartTime.feedback || this.infCloseValidateForm.convenientContactEndTime.feedback){
        validate = false;
      }
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

  //取得會辦結案區塊資料
  getInfCloseData(){
    this.infCloseForm.fileIds = [];
    this.infCloseForm.fileNames = [];
    (this.gridFileData.data as FileGrid[]).forEach(d => {
      this.infCloseForm.fileIds.push(d.fileId);
      this.infCloseForm.fileNames.push(d.fileName);
    });
    return this.infCloseForm;
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