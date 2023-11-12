import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType, FblPDataGridHolder, FblActionEvent } from '@/components/shared/data-grid/models';
import DatePicker from '@fubonlife/vue2-datepicker';
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import { NotiformValidateForm } from "./model";
import { Option, NotiInfoInitDto, NotiAddInfoDto, ResponseEntity, NotiBasicInfoDto } from "@fubonlife/obd-api-axios-sdk";
import LoadingUtil from "@/assets/config/LoadingUtil";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil, { ValidateFormComponent } from "@/assets/config/CommonUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { Modal } from 'ant-design-vue';
import { NotiStep } from "@/pages/onDuty/model";

@Component({
  components: { DatePicker, FblDataGrid }
})
export default class NotificationInfo extends Vue {
  
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  caseClosed: boolean;

  @Prop()
  notiInfoId: string;

  @Prop()
  propReOpen: boolean;  // 是否從照會回覆開單

  @Prop()
  propStep: number;

  @Prop({default:false})
  isReview: boolean;

  // 是否來自未結案提醒表單
  @Prop({default:false})
  isNotCloseNotify: boolean;

  // DatePicker民國年的格式
  formatter = this.$twDateFormatter;

  // 照會主類型
  notiTypeOption: Option[] = [];
  // 照會次類型
  notiSubTypeOption: Option[] = [];
  // 對應主類型的次類型
  notiSubTypeOptionMap: Object = {};
  // 對應次類型的補字後內容
  additionalMap: Object = {};

  //到期日hover是否顯示
  isExpireDateHoverVisible: boolean = false;

  // 是否顯示照會項目清單
  showNotiInfoList: boolean = false;

  // 最晚到期日
  lastExpireDate: string = null;
  // 最早到期日
  startExpireDate: string = null;

  // 照會階段
  notiStep = NotiStep;

  // 是否有編輯過
  isModify: boolean = false;

  // 照會資訊
  notificationInfoForm = {
    notiType: '',
    notiSubType: '',
    additional: '',
    expireDate: null,
    expireDateString: ''
  }

  // 照會畫面Disable
  notificationDisable = {
    notiSubType : true,
    additional : true
  }

  emitData = {
    itemInfoLoading : false,
    itemInfoData : null
  }

  // 照會單pdf檔案Id
  notiFileId: string;

  // 照會資訊 欄位驗證
  notiformRules: { [key: string]: ValidationRule[] } = {
    notiType: [{ validator: this.validateNotiType, trigger: "blur" }],
    notiSubType: [{ validator: this.validateNotiSubType, trigger: "blur" }],
    additional: [{ validator: this.validateAdditional, trigger: "blur" }]
  };

  //照會資訊表單驗證物件
  notiValidateForm : NotiformValidateForm = {
    notiType: { feedback: false, hoverVisible: false },
    notiSubType: { feedback: false, hoverVisible: false },
    additional: { feedback: false, hoverVisible: false },
    expireDate: { feedback: false, hoverVisible: false }
  }

  // 照會項目 table
  gridFileData: FblPDataGridHolder<NotiAddInfoDto> = {
    rowKey: 'notiSettingId',
    data: [],
    columns: [
      {
        type: FblColumnType.ACTION,
        title: "",
        actions: [
            {
                name: "delete",
                title: this.$t('global_delete').toString(), //刪除
                delete: true
            }
        ],
        width: 40,
        hidden: false,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'notiSettingId',
        title: this.$t('notificationInfo_notiSettingId').toString(),  // 照會代碼
      },
      {
        type: FblColumnType.PLAIN,
        property: 'notiStatus',
        title: this.$t('notificationInfo_notiStatus').toString(),  // 照會狀態
      },
      {
        type: FblColumnType.PLAIN,
        property: 'additional',
        title: this.$t('notificationInfo_notiAdditional').toString(),  // 照會內容
        width: 350,
      },
      {
        type: FblColumnType.PLAIN,
        property: 'notiDate',
        title: this.$t('notificationInfo_notiDate').toString(),  // 照會日期
        formatter: (data: NotiAddInfoDto) => {
            if (data.notiDate) {
                return MomentUtil.transformRocYearMonthDay(data.notiDate);
            } else {
                return ""
            }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: 'reminderDate',
        title: this.$t('notificationInfo_reminderDate').toString(),  // 照會催辦日
        formatter: (data: NotiAddInfoDto) => {
            if (data.reminderDate) {
                return MomentUtil.transformRocYearMonthDay(data.reminderDate);
            } else {
                return ""
            }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: 'exprieDate',
        title: this.$t('notificationInfo_exprieDate').toString(),  // 照會到期日
        formatter: (data: NotiAddInfoDto) => {
            if (data.exprieDate) {
                return MomentUtil.transformRocYearMonthDay(data.exprieDate);
            } else {
                return ""
            }
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: 'notiUserName',
        title: this.$t('notificationInfo_notiUserName').toString(),  // 照會人員
      },
    ],
  };

  // ==================================================== Hook ==========================================================

  /**
  * @description 照會資訊區初始化
  * 
  * @author B1529
  * @version 2022/06/13
  */
   created() {
    // 取得初始化照會項目
    this.initNotiInfo();
    
  }

  // ==================================================== Event =========================================================

  /**
   * @description 照會主類型 變更
   * 
   * @author B1529
   * @version 2022/06/13
   */
  onNotiTypeChange(value) {
    
    this.notificationInfoForm.notiSubType = '';
    this.notiSubTypeOption = [];
    this.notificationDisable.notiSubType = ValidationUtil.isEmpty(value) ? true : false;

    // 清空補字後內容
    if(ValidationUtil.isEmpty(this.notificationInfoForm.notiSubType)){

      this.notificationInfoForm.additional = '';
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiSubType, false, '', false);
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, false, '', false);
      this.notificationDisable.additional = true;
      
    }

    // 取得照會次類型
    this.notiSubTypeOption = Object.assign(this.notiSubTypeOptionMap[value]);
    
  }

  /**
   * @description 次類型選單點選時，新增補字後內容
   * @param value 
   * 
   * @author B1529
   * @version 2022/06/13
   */
  onSubTypeChange(value) {

    this.notificationDisable.additional = ValidationUtil.isEmpty(value) ? true : false;
    if(!ValidationUtil.isEmpty(value)) {
      
      // 將選取的次類別補字內容, 帶入補字後內容
      this.notificationInfoForm.additional = this.additionalMap[value];
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, false, '', false);
    }
  }

  /**
   * @description 清除照會資訊
   * 
   * @author B1529
   * @version 2022/06/13
   */
  onCleanNotificationInfo(isClear:boolean) {
    
    this.notificationInfoForm.notiType = '';
    this.notificationInfoForm.notiSubType = '';
    this.notificationInfoForm.additional = '';

    // 還原到期日
    if(isClear){
      this.notificationInfoForm.expireDate = this.startExpireDate;
      this.notificationInfoForm.expireDateString = MomentUtil.transformRocYearMonthDay(this.startExpireDate);
    }

    // 還原 Disable
    this.notificationDisable.notiSubType = true;
    this.notificationDisable.additional = true;

    // 清除驗證參數
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiType, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiSubType, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, false, '', false);
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, false, '', false);
 
  }

  /**
   * @description 照會Table列表事件
   * @param e 單筆使用者資料觸發事件 
   * @returns 
   * 
   * @author B1529
   * @version 2022/06/14
   */
  onTableClick(e : FblActionEvent<NotiAddInfoDto>){
    switch (e.action.name) {
      case "delete":
          this.onDelete(e.row.data);
          break;
    }
  }

  // 刪除 照會項目
  /**
   * @description 刪除 照會項目
   * @param data 
   * 
   * @author B1529
   * @version 2022/06/14
   */
  onDelete(data : NotiAddInfoDto) {

    Modal.confirm({
      okText: this.$t('global_ok').toString(),                     // 確定
      cancelText: this.$t('global_cancel').toString(),             // 取消
      title: this.$t('global_confirm').toString(),                 // 確認
      content: this.$t('global_confirmDelete_param', ['?']).toString(),  // 確認刪除?
      onOk: () => {
        
        console.log('刪除 照會項目', data);
        this.gridFileData.data = this.gridFileData.data.filter(notiInfo => notiInfo.notiSettingId != data.notiSettingId);

        // 回傳資料給父畫面
        this.emitData.itemInfoData = this.gridFileData.data;
        this.$emit('emitItemInfo', this.emitData);
        // 是否已經回傳過狀態，如果有就不再emit
        if(!this.isModify){
          this.$emit("emitReviewStatus");
          this.isModify = true;
        }
      }
    });

  }

  /**
   * @description 日期選擇器，自動轉為字串更新表單資料
   * @param date
   * 
   * @author B1529
   * @version 2022/06/14
   */
  onDateChange(date) {

    this.notificationInfoForm.expireDate = date;
    this.notificationInfoForm.expireDateString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date)));
    
    // 驗證照會到期日
    this.validateExpireDate();
    
  }

  /**
   * @description 手動輸入日期時檢查日期是否符合曆法
   * @param data 
   * 
   * @author B1529
   * @version 2022/06/14
   */
   checkManualInputDate(data: any) {
    
    this.isExpireDateHoverVisible = false;
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, false, '', false);
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (ValidationUtil.isEmpty(parseDate)) {
      
      this.isExpireDateHoverVisible = true;
      // 日期錯誤
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, true, this.$t('global_dateError').toString(), false);
    }

    this.notificationInfoForm.expireDate = parseDate ? parseDate : this.notificationInfoForm.expireDate ;
    this.notificationInfoForm.expireDateString = parseDate ? MomentUtil.transformRocYearMonthDay(MomentUtil.default(this.notificationInfoForm.expireDate)) : data.currentTarget.value.match(/\d+\/\d+\/\d+/)[0];
  }

  /**
   * @description 確保Tooltip在日期正確時確實隱藏
   * 
   * @author B1529
   * @version 2022/06/14
   */
  eventMouseOver() {
    if (this.notiValidateForm.expireDate.feedback) {
      this.isExpireDateHoverVisible = true;
    } else {
      this.isExpireDateHoverVisible = false;
    }
  }

  /**
   * @description 清除照會資訊與項目
   * 
   * @author B1529
   * @version 2022/08/04
   */
  clearNotificationItems(){

    // 清除照會資訊
    this.onCleanNotificationInfo(true);

    // 清除照會項目
    this.gridFileData.data = [];
    this.showNotiInfoList = false;
  }
  

  // ==================================================== Ajax ==========================================================

  /**
   * @description 照會資訊初始化資料
   * 
   * @author B1529
   * @version 2022/06/13
   */
  initNotiInfo(){

    LoadingUtil.show();

    this.$notificationApi.initNotificationInfoUsingPOST({
      notiInfoId : this.notiInfoId,
      reOpen : this.propReOpen,
      reSend : this.propReOpen && !this.isReview
    })
    .then((res:AxiosResponse<NotiInfoInitDto>) => {

      this.notiTypeOption = res.data.notiTypeOption;
      this.notiSubTypeOptionMap = res.data.notiSubTypeOption;
      this.additionalMap = res.data.additionalMap;

      this.notificationInfoForm.expireDate = res.data.expireDate;
      this.startExpireDate = res.data.expireDate;
      this.notificationInfoForm.expireDateString = MomentUtil.transformRocYearMonthDay(res.data.expireDate);
      this.lastExpireDate = res.data.lastExpireDate;
      // 照會單pdf
      this.notiFileId = res.data.notiFileId;

      // 照會回覆開單...
      if(this.propReOpen){

        if(!ValidationUtil.isEmpty(res.data.notiItems)){
          // 顯示照會項目清單
          this.showNotiInfoList = true;
          this.gridFileData.data = Object.assign(res.data.notiItems);
          this.emitData.itemInfoData = this.gridFileData.data;
          // 是否隱藏刪除按鈕
          this.gridFileData.columns[0].hidden = this.isReview;
        }
      }

      // 回傳資料給父畫面
      this.emitData.itemInfoLoading = true;
      this.$emit('emitItemInfo', this.emitData);

    }).catch((err) => {
      console.log(err);
      LoadingUtil.close();
    });
  }

  /**
   * @description 新增照會資訊
   * 
   * @auhor B1529
   * @version 2022/06/12
   */
   async onAddNotificationInfo() {

    // 新增照會資訊驗證
    if( await this.validateAddNotiInfo() ){

      LoadingUtil.show();
      // API: 
      this.$notificationApi.addNotificationInfoUsingPOST({
        notiSettingId : this.notificationInfoForm.notiSubType,
        additional : this.notificationInfoForm.additional,
        exprieDate : this.notificationInfoForm.expireDate
      })
      .then((res:AxiosResponse<NotiAddInfoDto>) => {

        if(res.data.success){
          // 塞入照會項目清單
          this.gridFileData.data.push(res.data);
          this.gridFileData.data.forEach((value : NotiAddInfoDto) => {
            value.exprieDate = res.data.exprieDate;
            value.reminderDate = res.data.reminderDate;
          });

          // 清除照會項目
          this.onCleanNotificationInfo(false);

          // 顯示照會項目清單
          this.showNotiInfoList = true;

          // 回傳資料給父畫面
          this.emitData.itemInfoData = this.gridFileData.data;
          this.$emit('emitItemInfo', this.emitData);

        } else {
          LoadingUtil.close();
          ErrorModalUtil.modalError(this.$t('notificationInfo_error_addNotificationInfo').toString());  // 新增照會項目失敗
        }
      })
      .catch((err) => {
        LoadingUtil.close();
        ErrorModalUtil.modalError(this.$t('notificationInfo_error_addNotificationInfo').toString());  // 新增照會項目失敗
      }).finally(()=>{
        // 是否已經回傳過狀態，如果有就不再emit
        if(!this.isModify){
          this.$emit("emitReviewStatus");
          this.isModify = true;
        }
      });
    }
  }

  // ==================================================== Validation ==========================================================

  /**
   * @description 照會主類型驗證
   * @param rule 
   * @param value 
   * @param callback
   * 
   * @author B1529
   * @version 2022/06/13
   */
  validateNotiType(rule, value, callback){

    if(!this.caseClosed){
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiType, false, '', false);
      if (ValidationUtil.isEmpty(this.notificationInfoForm.notiType)) {
        // 照會主類型 必填
        CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiType, true, this.$t('notificationInfo_error_notiType').toString(), false);
        callback(() => { });
      }
      callback();
    }
    
  }

  /**
   * @description 照會次類型驗證
   * @param rule 
   * @param value 
   * @param callback
   * 
   * @author B1529
   * @version 2022/06/13
   */
   validateNotiSubType(rule, value, callback){
    
    if(!this.caseClosed){
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiSubType, false, '', false);
      if (ValidationUtil.isEmpty(this.notificationInfoForm.notiSubType)) {
        // 照會次類型 必填
        CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiSubType, true, this.$t('notificationInfo_error_notiSubType').toString(), false);
        callback(() => { });
      } else {
        // 電訪照會碼已重複
        if( !ValidationUtil.isEmpty(this.gridFileData.data) 
        && this.gridFileData.data.some( data => data.notiSettingId == this.notificationInfoForm.notiSubType) ){
          CommonUtil.feildValidateWithVisible(this.notiValidateForm.notiSubType, true, this.$t('notificationInfo_error_notiSettingId').toString(), false);
          callback(() => { });
        }
      }

      callback();
    }
    
  }

  /**
   * @description 補字後內容驗證
   * @param rule 
   * @param value 
   * @param callback
   * 
   * @author B1529
   * @version 2022/06/13
   */
   validateAdditional(rule, value, callback){
    CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, false, '', false);
    if (ValidationUtil.isEmpty(this.notificationInfoForm.additional)) {
      // 補字後內容 必填
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, true, this.$t('notificationInfo_error_additional').toString(), false);
      callback(() => { });
    }else if (this.notificationInfoForm.additional.length > 300){
      // 補字後內容 不可超過300字
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.additional, true, this.$t('notificationInfo_overMax_additional').toString(), false);
      callback(() => { });
    }
    callback();
  }

  /**
   * @description 到期日驗證
   * 
   * @author B1529
   * @version 2022/06/13
   */
  async validateExpireDate() {

    let next : boolean = true;

    CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, false, '', false);
    if (ValidationUtil.isEmpty(this.notificationInfoForm.expireDate)) {
      // 照會到期日 必填
      CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, true, this.$t('notificationInfo_error_expireDate').toString(), false);
      next = false;
    }

    // 是否小於原本帶出的到期日
    if(next){
      if(moment(this.notificationInfoForm.expireDate).isBefore(this.startExpireDate)){
      
        let startExpireDateString = MomentUtil.transformRocYearMonthDay(this.startExpireDate);
        // 修改後的到期日需大於預設日
        CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, true, this.$t('notificationInfo_error_expireDate_default', [startExpireDateString + '!']).toString(), false);
        next = false;
      }
    }

    // 超過20天
    if(next){
      if(moment(this.notificationInfoForm.expireDate).isAfter(this.lastExpireDate)){
        // 照會到期回覆天數超過20日,請修改！
        CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, true, this.$t('notificationInfo_error_expireDate_over').toString(), false);
        next = false;
      }
    }

    // 是否為假日
    if(next){
      LoadingUtil.show();
      let isRestRes = await this.$calendarTableApi.isRestUsingGET(this.notificationInfoForm.expireDateString, 'C');
      LoadingUtil.close();
      if( isRestRes.data ){
        // 照會到期日不可選擇非工作日
        CommonUtil.feildValidateWithVisible(this.notiValidateForm.expireDate, true, this.$t('notificationInfo_error_expireDate_work').toString(), false);
      }
    }
    
  }

  /**
   * @description 新增照會資訊驗證
   * @returns 
   * 
   * @author B1529
   * @version 2022/06/12
   */
  async validateAddNotiInfo(){
    let validate = true;

    // 照會主類型
    this.validateNotiType(null, this.notificationInfoForm.notiType, () => {
      if(this.notiValidateForm.notiType.feedback){
        validate = false;
      }
    });

    // 照會次類型
    if(validate){
      this.validateNotiSubType(null, this.notificationInfoForm.notiSubType, () => {
        if(this.notiValidateForm.notiSubType.feedback){
          validate = false;
        }
      });
    }

    // 補字後內容
    if(validate){
      this.validateAdditional(null, this.notificationInfoForm.additional, () => {
        if(this.notiValidateForm.additional.feedback){
          validate = false;
        }
      });
    }

    // 照會到期日
    await this.validateExpireDate();
    if(this.notiValidateForm.expireDate.feedback){
      validate = false;
    }

    return validate;
  }

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

 /**
  * @description 案件調閱
  * 
  * @author B0845
  * @version 2022/09/27
  */
  caseCheck() {
    this.$emit('caseCheck');
  }

  /**
  * @description 調閱pdf
  * 
  * @author B0845
  * @version 2022/09/27
   */
  onPdfOpen(data: any) {
    LoadingUtil.show();
    console.log(data);
    // 如果會辦檔案沒有就改抓權益信函 (需求調整不抓權益信函)
    // let fileId = data.infFileId != null ? data.infFileId : data.interestFileId;
    // let fileId = data.notiFileId ;
    if(data != null) {
      this.$informApi.showInfPdfUsingPOST(data, { responseType: 'blob' }).then((resp: AxiosResponse<ResponseEntity>) => {
        this.showData(resp.data);
        console.log(resp);
    }).catch(error => console.log(error)).finally(() => LoadingUtil.close())
    } else {
      ErrorModalUtil.modalError(this.$t('checkFailde').toString());
      LoadingUtil.close();
      console.log("fileId is null");
    }

  }

  /**
  * @description 開啟pdf
  * 
  * @author B0845
  * @version 2022/09/27
  */
  showData(resData) {
    try {
        let blob;
        if (resData instanceof Blob) {
            blob = resData;
            console.log('blob',blob);
        } else {
            blob = new Blob([resData], { type: resData.type });
            console.log('blob',blob);
        }
        var url = window.URL.createObjectURL(blob);
        console.log(url);
        var a = window.open(url + "#toolbar=0", "Inf", "config='height=500px,width=500px'");
      } catch (e) {
        console.error(e);
      }
  }

}