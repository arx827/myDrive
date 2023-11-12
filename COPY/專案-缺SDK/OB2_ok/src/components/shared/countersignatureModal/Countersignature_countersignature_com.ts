import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FblColumnType } from '@/components/shared/data-grid/models';
import DatePicker from '@fubonlife/vue2-datepicker';
import moment from "moment";
import MomentUtil from "@/assets/config/MomentUtil";
import { FileGrid, InfInformValidateForm } from "./model";
import { InfDayDto, InfSelectionDto, InfSendTargetDto, Option, OutputErrorCodeDto, ResponseEntity } from "@fubonlife/obd-api-axios-sdk";
import VlidationUtil from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import { PackMatchModule } from "@/plugins/store/packMatchModule";
import { Modal } from "ant-design-vue";
import ValidationUtil from "@/assets/config/ValidationUtil";
import { AxiosResponse } from "axios";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import CommonUtil from "@/assets/config/CommonUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import { LoginModule } from "@/plugins/store/LoginModule";

/**
 * @description 驗證收件人email格式
 * ex: aa@bb.cc 正確 (且結尾不能空白字串)
 */
const RECEIVER_ADDRESS_REGEX:RegExp = new RegExp(/\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]\S+$/);

@Component({
    components: { DatePicker, FblDataGrid }
})
export default class CountersignatureModalCountersignature extends Vue {
  
  @Prop()
  isEdit: boolean;    // 編輯狀態

  @Prop()
  caseType: string;

  @Prop({default:""})
  comInfInfoId: string;

  // 是否來自未結案提醒表單
  @Prop({default:false})
  isNotCloseNotify: boolean;

  @Prop()
  packNo: string;

  isCaseClosed: boolean = false;

  //下拉選單選項
  infDayList: InfDayDto[] = [];
  infTypeList: InfSelectionDto[] = [];
  infSendTargetList: InfSendTargetDto[] = [];
  infSecondSelection: Option[] = []; 
  infSubSelection: Option[] = [];
  infMainSelection: Option[] = [];
  infDepartmentSelection: Option[] = [];

  //是否已點選權益信函預覽
  isClickAdjunctPreview: boolean = false;
  //到期日最晚日期
  lastExpireDateString: string = "";
  //到期日最早日期
  earliestExpireDateString: string = "";
  //到期日hover是否顯示
  isExpireDateHoverVisible: boolean = false;
  // 選擇上傳檔案名稱
  selectedFileName: string = "";
  // 上傳按鍵wording變換
  isUploading: boolean = false;
  // 上傳檔案儲存變數
  uploadingFile: FileGrid = null;
  //第一層項目是否可選
  isSecondTypeDisable: boolean = true;
  //檔案清單
  fileList = [];

  // 欄位驗證
  infInformRules: { [key: string]: ValidationRule[] } = {
    infType: [{ validator: this.validateInfType, trigger: "blur" }],
    adjunctDesc: [{ validator: this.validateAdjunctDesc, trigger: "blur" }],
    infDepartment: [{ validator: this.validateInfDep, trigger: "blur" }],
    targetEmail: [{ validator: this.validateTargetEmail, trigger: "blur" }],
    carbonCopyEmail: [{ validator: this.validateCarbonCopyEmail, trigger: "blur" }],
    content: [{ validator: this.validateContent, trigger: "blur" }],
    expireDate: [{ validator: this.validateExpireDate, trigger: "blur" }],
  };

  //欄位驗證提示工具
  infInformValidateForm: InfInformValidateForm = {
    infType: { hover: "", feedback: false, state: "", msg: "" },
    infItemList: { hover: "", feedback: false, state: "", msg: "" },
    infSecondType:{ hover: "", feedback: false, state: "", msg: "" },
    content:{ hover: "", feedback: false, state: "", msg: "" },
    infDepartment:{ hover: "", feedback: false, state: "", msg: "" },
    targetEmail:{ hover: "", feedback: false, state: "", msg: "" },
    carbonCopyEmail: { hover: "", feedback: false, state: "", msg: "" },
    expireDate: { hover: "", feedback: false, state: "", msg: "" },
    adjunctDesc: { hover: "", feedback: false, state: "", msg: "" },
  }

  //唯讀資料
  infReadOnlyForm ={
    infInfoId:'',
    infTypeId:'',
    interestLetter: '',
    interestDes:'',
    infItemListString:'',
    infDept:'',
    infContent:'',
    contactMail:'',
    carbonCopyMail:'',
    fileList: [],
    expireDateString: '',
    tmrInfo:'',
    infFileId:'',
    interestFileId:''
  }

  // [編輯] submit 專用
  form = {
    infId: "",
    countersignatureType: undefined,
    reInform: false,
    adjunct: {
      hasAdjunct: '',
      desc: '',
      fileId: ''
    },
    infItemList: [],
    content: '',
    infDepartment: '',
    targetPersonEmail: '',
    carbonCopyEmail: '',
    expireDate: null,
    expireString: "",
    subTypeId: "",
    secondTypeId: "",
    fileIds: [],
    fileNames: [],
    channelsId: "",
    caseLogId: ""
  }
  
  // DatePicker民國年的格式
  formatter = this.$twDateFormatter;

  // ================================= 表單顯示用資料 =================================
  
  // 再次通報 (顯示條件)
  isReCircularShow = false ;

  // 附權益信函 (顯示條件)
  isAjunctShow = false ;

  // 檔案列表 table
  public gridFileData = {
    rowKey: 'fileId',
    data: [],
    // pagination: false,
    columns: [
      {
        type: FblColumnType.TEMPLATE,
        property: 'handleTemp',
        template: 'handleTemp',
        width: 10,
      },
      // 檔案名稱
      {
        type: FblColumnType.PLAIN,
        property: 'fileName',
        title: this.$t('uploadFileForm_fileName').toString(),
        formatter: (data: FileGrid) => {
            if (data) {
                return [data.fileName, data.fileExtension].join(".")
            }
        }
    },
    ],
  };

  /**
   * Func
   */
  // 日期選擇器，可選擇範圍
  disabledDate(value) {
    return false;
    const rangeEnd = moment(this.lastExpireDateString).add(-1,'days');
    const rangeStart = moment(this.earliestExpireDateString);
    if (!value || !rangeEnd || !rangeStart) {
      return false;
    }
    return (value.valueOf() > rangeEnd.valueOf()) || (value.valueOf() < rangeStart.valueOf());
  }

  // 日期選擇器，自動轉為字串更新表單資料
  onDateChange(date) {
    CommonUtil.feildValidate(this.infInformValidateForm.expireDate, false, "success", "", "");
    this.form.expireString = date ? MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(date))) : '';
    this.validateExpireDate(null,this.form.expireString,()=>{ });
    //還原判斷會辦單是否已預覽的flag
    this.$emit('emitUpdateInformPreviewFlag');
  }
  /**
   * 手動輸入日期時檢查日期是否符合曆法
   * @param data 
   */
  checkManualInputDate(data: any) {
    this.isExpireDateHoverVisible = false;
    CommonUtil.feildValidate(this.infInformValidateForm.expireDate, false, "success", "", "");
    const parseDate = this.formatter.parse(data.currentTarget.value);
    if (parseDate) {
      CommonUtil.feildValidate(this.infInformValidateForm.expireDate, false, "success", "", "");
    } else {
      this.isExpireDateHoverVisible = true;
      CommonUtil.feildValidate(this.infInformValidateForm.expireDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
    }
    this.form.expireDate = parseDate ? parseDate : null;
    this.form.expireString = parseDate ?
        MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.form.expireDate.toString()))) :
        data.currentTarget.value;
  }

  /**
   * 確保Tooltip在日期正確時確實隱藏
   */
  eventMouseOver() {
    if (this.infInformValidateForm.expireDate.feedback) {
      this.isExpireDateHoverVisible = true;
    } else {
      this.isExpireDateHoverVisible = false;
    }
  }
  
  /**
   * Event
   */
  // 附權益信函 check事件
  onCheckAdjunct(e) {
    CommonUtil.feildValidate(this.infInformValidateForm.adjunctDesc, false, "success", "", "");
    if((e.target.value === "Y" && this.form.adjunct.hasAdjunct == 'Y') || (e.target.value === "N" && this.form.adjunct.hasAdjunct == 'N')) {
      this.form.adjunct.hasAdjunct = null;
    }else{
      this.form.adjunct.hasAdjunct = e.target.value;
    }
    this.isClickAdjunctPreview = false;
    this.form.adjunct.desc = "";
  }

  /**
   * 點選預覽按鈕以附權益信函
   */
   adjuctPreviewClick() {
    this.isClickAdjunctPreview = false;
    this.$emit('emitGetBasicCaseNo');
    if (ValidationUtil.isEmpty(this.caseNo)) {
      ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
      console.error("Case ID 為空");
      return;
    }
    let userId = "";
    try {
      userId = LoginModule.loginState.me.id;
    } catch {
      console.warn("擷取使用者ID發生錯誤");
    }
    LoadingUtil.show();
    this.$informApi.reviewInformInterestLetterUsingPOST(this.caseNo, userId, { responseType: 'blob' })
      .then(resp => {
        console.error("resp", resp);
        if (resp) {
          if (resp.headers) {
            const headersMap = new Headers(resp.headers);
            let noData = headersMap.get("no-data");
            if (noData) {
              ErrorModalUtil.modalError(this.$t("infCom_adjunctNotProduce").toString()); // 未產出權益信函
            } else {
              let manualLetterStatus = headersMap.get('manual-letter-status');
              let fileId = headersMap.get('file-id');
              if (!ValidationUtil.isEmpty(manualLetterStatus) && !ValidationUtil.isEmpty(fileId) && (resp.data as Blob).size) {
                if (manualLetterStatus == "A") {
                  ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
                } else {
                  this.dealDownLoadPdfPreview(resp.data);
                  this.form.adjunct.fileId = fileId;
                  console.log("fileId", fileId);
                  // 權益信函附加成功後才算是點擊完成，後面才可以送出表單。
                  this.isClickAdjunctPreview = true;
                }
              } else {
                ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
              }
            }
          } else {
            ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
          }
        } else {
          ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
        }
      }).catch(() => {
        ErrorModalUtil.modalError(this.$t("infCom_adjunctError").toString()); // 權益信函異常
        console.error("附權益信函API發生錯誤");
      }).finally(() => {
        LoadingUtil.close();
      });
  }

    /**
 * 處理後端回傳的下載內容並開啟
 * @param resData 

 */
     dealDownLoadPdfPreview(resData) {
      try {
        let blob;
        if (resData instanceof Blob) {
          blob = resData;
        } else {
          blob = new Blob([resData], { type: resData.type });
        }
        var url = window.URL.createObjectURL(blob);
        window.open(url + "#toolbar=0", "權益信函預覽");
      } catch (e) {
        console.error(e);
  
      }
    }

  // 新增 會辦項目
  onAddCountersignatureItem() {
    //還原判斷會辦單是否已預覽的flag
    this.$emit('emitUpdateInformPreviewFlag');
    
    // 會辦類型 為 通知 時，會辦項目為單選、清除會辦部門與email資訊
    if(this.form.countersignatureType === '6') {
      this.form.infItemList = [];
      this.form.infDepartment ="";
      this.form.targetPersonEmail = "";
      this.form.carbonCopyEmail ="";
    }

    let target: InfSelectionDto;
    let label = "";
    if(this.form.countersignatureType === '5'){
      target = this.infTypeList.find((item)=> item.infTypeId == this.form.countersignatureType && item.infSubId == this.form.subTypeId);
      label = target.infSubDesc;
    }else{
      target = this.infTypeList.find((item)=> item.infTypeId == this.form.countersignatureType && item.infSubId == this.form.subTypeId && item.infSecondId == this.form.secondTypeId);
      label = `${target.infSubDesc} / ${target.infSecondDesc}`
    }
    // 避免重複
    if(this.form.infItemList.some((item)=>item.value == target.infSelectionId)){
      return;
    }
    
    this.form.infItemList.push({value:target.infSelectionId,label:label});
    this.getDistinctContent();
    let depSet = new Set();
    this.infDepartmentSelection = [];
    this.infSendTargetList.filter((item)=> this.sendTargetFilter(item,target)? true : false)
      .forEach((item)=>{
        if(!depSet.has(item.departmentId)){
          depSet.add(item.departmentId);
          this.infDepartmentSelection.push({label: VlidationUtil.isEmpty(item.departmentName)? item.departmentId: item.departmentName, value: item.departmentId });
        }
      })

    // 通報類 預設帶出會辦部門
    if(this.form.countersignatureType =='4' && this.infDepartmentSelection.length >0){
      this.form.infDepartment = this.infDepartmentSelection[0].value;
      this.onInfDepartmentChange();
    }
  }

  //判斷符合的發送對象資料
  sendTargetFilter(item, target){
    let ans = false;
    if(this.form.countersignatureType == '6'){
      ans = (item.infTypeId == this.form.countersignatureType && item.infSettingId == target.infSelectionId)? true : false;
    } else if(this.form.countersignatureType == '4'){
      ans = (item.infTypeId == this.form.countersignatureType && item.caseChannelId == this.form.channelsId)? true : false;
    } else {
      // ans = (item.infTypeId == this.form.countersignatureType && item.departmentId == this.form.infDepartment)? true : false;
      ans = (item.infTypeId == this.form.countersignatureType )? true : false;
    }
    return ans;
  }

  //判斷符合的發送對象資料
  sendTargetFilterById(item, target){
    let ans = false;
    if(this.form.countersignatureType == '6'){
      ans = (item.infTypeId == this.form.countersignatureType && target.some( (t)=>item.infSettingId == t.value))? true : false;
    } else if(this.form.countersignatureType == '4'){
      ans = (item.infTypeId == this.form.countersignatureType && item.caseChannelId == this.form.channelsId)? true : false;
    } else {
      // ans = (item.infTypeId == this.form.countersignatureType && item.departmentId == this.form.infDepartment)? true : false;
      ans = (item.infTypeId == this.form.countersignatureType )? true : false;
    }
    return ans;
  }

  // 關閉 會辦項目清單 tag
  onCountersignatureItemClose(value) {
    this.form.infItemList = this.form.infItemList.filter((item)=> item.value != value);
    this.getDistinctContent();
    if(this.form.countersignatureType =='6'){
      this.form.infDepartment = '';
      this.onInfDepartmentChange();
    }
  }

  //取得會辦內容資訊
  getDistinctContent(){
    let s = "";
    let contentSet = new Set();
    this.infTypeList.filter((item=> this.form.infItemList.some((target)=> item.infSelectionId == target.value)))
    .forEach((item)=>{
      if(!contentSet.has(item.content) && !VlidationUtil.isEmpty(item.content)){
        contentSet.add(item.content);
      }
    });
    contentSet.forEach((c)=>{
      s = s + c + "\n";
    })

    this.form.content = s;
  }

  //會辦類型變動
  onMainTypeChange(){
    this.form.infItemList = [];
    this.infSubSelection = [];
    this.infSecondSelection = [];
    this.form.subTypeId = "";
    this.form.secondTypeId = "";
    this.form.content = "";
    this.form.infDepartment = "";
    this.form.targetPersonEmail = "";
    this.form.carbonCopyEmail = "";
    this.isClickAdjunctPreview = false;
    let set = new Set();
    if(!VlidationUtil.isEmpty(this.form.countersignatureType)){
      CommonUtil.feildValidate(this.infInformValidateForm.infDepartment, false, "success", "", "");
      CommonUtil.feildValidate(this.infInformValidateForm.targetEmail, false, "success", "", "");
      CommonUtil.feildValidate(this.infInformValidateForm.carbonCopyEmail, false, "success", "", "");
      CommonUtil.feildValidate(this.infInformValidateForm.expireDate, false, "success", "", "");
      this.isExpireDateHoverVisible = false;
      this.infTypeList.filter((item)=> item.infTypeId == this.form.countersignatureType).forEach((item)=>{
        if(!set.has(item.infSubId)){
          set.add(item.infSubId);
          this.infSubSelection.push({ label: item.infSubDesc, value: item.infSubId })
        }
        if(!VlidationUtil.isEmpty(item.infSecondId)){
          this.infSecondSelection.push({ label: item.infSecondDesc, value: item.infSecondId })
        }
      })
      let defaultDate = this.infDayList.find((item)=>item.infTypeId == this.form.countersignatureType).expireDate;
      this.form.expireDate = moment(defaultDate);
      this.earliestExpireDateString = defaultDate;
      this.form.expireString = MomentUtil.transformRocYearMonthDay(MomentUtil.default(new Date(this.form.expireDate.toString())))
      this.infDepartmentSelection = [];
      let depSet = new Set();
      this.infSendTargetList.filter((item)=> item.infTypeId == this.form.countersignatureType)
      .forEach((item)=>{
        if(!depSet.has(item.departmentId)){
          depSet.add(item.departmentId);
          this.infDepartmentSelection.push({label: VlidationUtil.isEmpty(item.departmentName)? item.departmentId: item.departmentName, value: item.departmentId });
        }
      })
      if(this.form.countersignatureType =='5'){
        this.form.adjunct.hasAdjunct = 'Y';
      }else if(this.form.countersignatureType == '4'){
        // 通報類 即時檢核是否有通路別資訊
        this.$emit('emitCheckChannelsId');
      }

      //還原判斷會辦單是否已預覽的flag
      this.$emit('emitUpdateInfTypeInfo', this.form.countersignatureType);
    }
  }

  //會辦類型第一層選項變動
  onSubTypeChange(){
    this.form.secondTypeId = "";
    this.infSecondSelection = [];
    if(!VlidationUtil.isEmpty(this.form.subTypeId)){
      this.infTypeList.filter((item)=> item.infSubId == this.form.subTypeId).forEach((item)=>{
        if(!VlidationUtil.isEmpty(item.infSecondId)){
          this.infSecondSelection.push({ label: item.infSecondDesc, value: item.infSecondId })
        }
      })
    }
  }

  //會辦部門變動
  onInfDepartmentChange(){
    //還原判斷會辦單是否已預覽的flag
    this.$emit('emitUpdateInformPreviewFlag');
    this.form.targetPersonEmail = "";
    this.form.carbonCopyEmail = "";
    let targetEmailSet = new Set();
    let ccEmailSet = new Set();
    CommonUtil.feildValidate(this.infInformValidateForm.infDepartment, false, "success", "", "");
    CommonUtil.feildValidate(this.infInformValidateForm.targetEmail, false, "success", "", "");
    CommonUtil.feildValidate(this.infInformValidateForm.carbonCopyEmail, false, "success", "", "");
    if(!VlidationUtil.isEmpty(this.form.infDepartment)){
      this.infSendTargetList.filter((item)=>item.infTypeId == this.form.countersignatureType 
      && item.departmentId == this.form.infDepartment 
      &&((this.form.countersignatureType =='6')? item.infSettingId == this.form.infItemList[0].value : true)
      &&((this.form.countersignatureType =='4')? item.caseChannelId == this.form.channelsId : true)
      )
      .forEach((item)=>{
        if(!ValidationUtil.isEmpty(item.contactEmail) && !targetEmailSet.has(item.contactEmail)){
          this.form.targetPersonEmail = this.form.targetPersonEmail + item.contactEmail;
          targetEmailSet.add(item.contactEmail);
        }
        if(!ValidationUtil.isEmpty(item.carbonCopyEmail) && !ccEmailSet.has(item.carbonCopyEmail)){
          this.form.carbonCopyEmail = this.form.carbonCopyEmail + item.carbonCopyEmail;
          ccEmailSet.add(item.carbonCopyEmail);
        }
      })
    }
    if(ValidationUtil.isEmpty(this.form.targetPersonEmail) && this.form.countersignatureType =='6'){
      this.$emit('emitGetBasicEmailInfo');
    }
  }

  //通知類，若email為空，帶入上游承辦Email
  updateEmailInfo(emailInfo){
    this.form.carbonCopyEmail = "";
    if(!ValidationUtil.isEmpty(emailInfo.underTakerEmail)){
      this.form.targetPersonEmail = emailInfo.underTakerEmail + ";";
    }else{
      this.form.targetPersonEmail = "";
    }
  }

  // 會辦類型 變更時，欲處理的動作
  @Watch('form.countersignatureType', { immediate: true })
  watchFormCountersignatureType(newVal) {
    this.isReCircularShow = (newVal === '4');
    this.isAjunctShow = (newVal === '5');

    // 再次通報 切換顯示時，初始化
    if(!this.isReCircularShow) {
      this.form.reInform = false;
    }

    // 附權益信函 切換顯示時，初始化
    if(!this.isAjunctShow) {
      this.form.adjunct = {
        hasAdjunct: '',
        desc: '',
        fileId: ''
      };
    }

    // 若 會辦類型選擇 『通知』，會辦項目要變成單選，所以會辦項目 只保留第一個
    if(newVal === '1' && this.form.infItemList.length > 1) {
      this.form.infItemList = this.form.infItemList.slice(0, 1);
    }
  }
  // 更新父層資料 form.countersignature
  // 無用到，暫時拿掉
  // @Watch('form', { deep: true })
  // watchForm(newVal) {
  //   this.$emit('emitFormData', {
  //     countersignature: newVal
  //   });
  // }

  /**
  * Hook
  */
  created() {
    if(this.isEdit){
      this.editDataInfo();
    }else{
      this.readonlyDataInfo();
    }
  }

  //查詢唯讀資料
  readonlyDataInfo(){
    // 搬到外層判斷
    // LoadingUtil.show();
    let isReview : boolean = this.$route.name =='OnDuty' || this.$route.name =='REVIEW_MENU' || this.$route.name == "REVIEW_INF";
    this.$informApi.initInformReadOnlyUsingGET(this.comInfInfoId, isReview).then((resp)=>{
      let infData = resp.data;
      this.infReadOnlyForm ={
        infInfoId: this.comInfInfoId,
        interestLetter: infData.interestLetter,
        interestDes: infData.interestDes,
        infTypeId: infData.infTypeId,
        infItemListString: infData.infItemListString,
        infDept: infData.infDept,
        infContent: infData.infContent,
        contactMail: infData.contactMail,
        carbonCopyMail: infData.carbonCopyMail,
        fileList: infData.fileList,
        expireDateString: infData.expireDateString,
        tmrInfo: infData.tmrInfo,
        // 新增會辦檔案與權益信函檔案
        infFileId: infData.infFileId,
        interestFileId: infData.interestFileId
      }
      //會辦開單檔案資訊
      if(this.infReadOnlyForm.fileList != null && this.infReadOnlyForm.fileList.length>0){
        this.infReadOnlyForm.fileList.forEach((file)=>{
          this.gridFileData.data.push({
            rowkey: this.gridFileData.data.length + 1,
            fileId: file.fileId,
            fileName: file.fileName,
            fileExtension: file.fileExtension,
          });
        })
      }
    })
    .catch((error) => console.error(error))
    .finally(() => this.$emit('countersignatureLoading',true))
  }

  //查詢編輯所需的資料
  editDataInfo(){
    this.selectedFileName = "";
    this.$informApi.initInformUsingGET(this.comInfInfoId, this.packNo).then((resp)=>{
      let mainSet = new Set();
      let subSet = new Set();
      let secondSet = new Set();
      this.infTypeList = resp.data.infTypeAllSelection;
      this.infDayList = resp.data.infDayList;
      this.lastExpireDateString = resp.data.lastExpireDate;
      this.form.infId = resp.data.infId;
      this.infTypeList.forEach((item)=>{
        if(!VlidationUtil.isEmpty(item.infSecondId) && !secondSet.has(item.infSecondId)){
          secondSet.add(item.infSecondId);
          this.infSecondSelection.push({ label: item.infSecondDesc, value: item.infSecondId });
        }
        if(!subSet.has(item.infSubId)){
          subSet.add(item.infSecondId);
          this.infSubSelection.push({ label: item.infSubDesc, value: item.infSubId });
        }
        if(!mainSet.has(item.infTypeId)){
          mainSet.add(item.infTypeId);
          this.infMainSelection.push({ label: item.infTypeDesc, value: item.infTypeId });
        }
      })
      this.infSendTargetList = resp.data.sendTargetList;
      if(!ValidationUtil.isEmpty(this.comInfInfoId)){
        this.form.countersignatureType = resp.data.infTypeId;
        this.onMainTypeChange();
        if(resp.data.informAgain == 'Y'){
          this.form.reInform = true;
        }
        this.form.adjunct.hasAdjunct = resp.data.interestLetter;
        this.form.adjunct.desc = resp.data.interestDes;
        this.form.infItemList = resp.data.infItemList;
        this.form.content = resp.data.infContent;
        this.form.caseLogId = resp.data.caseLogId;

        let depSet = new Set();
        this.infDepartmentSelection = [];
        let anyMatch = false;
        

        this.infSendTargetList.filter((item)=> this.sendTargetFilterById(item,resp.data.infItemList)? true : false)
          .forEach((item)=>{
            if(!depSet.has(item.departmentId)){
              depSet.add(item.departmentId);
              if(item.departmentId == resp.data.departmentId){
                anyMatch = true;
              }
              this.infDepartmentSelection.push({label: VlidationUtil.isEmpty(item.departmentName)? item.departmentId: item.departmentName, value: item.departmentId });
            }
          })
        if(this.form.countersignatureType =='6'){
          //通知類 帶出第一層會辦項目
          let subId = this.infTypeList.find((item)=> item.infSelectionId == this.form.infItemList[0].value ).infSubId;
          this.form.subTypeId = subId;
          this.onSubTypeChange();
        }

        if(anyMatch){
          this.form.infDepartment = resp.data.departmentId;
          this.form.targetPersonEmail = resp.data.contactMail;
          this.form.carbonCopyEmail = resp.data.carbonCopyMail;
        }
        
        // this.form.expireDate = moment(resp.data.infExpireDate);
        // this.form.expireString = MomentUtil.transformRocYearMonthDay(resp.data.infExpireDate)
        if(!ValidationUtil.isEmpty(resp.data.fileList)){
          this.gridFileData.data = resp.data.fileList;
        }
        
      }else{
        this.onMainTypeChange();
      }
      
      this.$emit('emitGetBasicCaseNo');
    }).catch((err)=>{
      // 會辦資料載入失敗
      ErrorModalUtil.modalError(this.$t('infCom_infDataLoadingFailed').toString());
    }).finally(()=>{
      // 搬到外層判斷
      // LoadingUtil.close();
      this.$emit('countersignatureLoading',true);
    })
  }

  //還原是否預覽FLAG
  initInformPreviewFlag(){
    //權益信函Flag
    this.isClickAdjunctPreview= false;
    //會辦單flag
    this.$emit('emitUpdateInfTypeInfo', this.form.countersignatureType);
  }

  //變更是否結案的參數
  changeCaseClosed(isCaseClosed){
    this.isCaseClosed = isCaseClosed;
  }

  //會辦內容變動
  onContentChange(){
    //還原判斷會辦單是否已預覽的flag
    this.$emit('emitUpdateInformPreviewFlag');
  }

  //更新通路類型資訊
  updateChannelIdInfo(channelIdInfo){
    this.form.channelsId = channelIdInfo;
    this.form.infDepartment = "";
    this.onInfDepartmentChange();
  }

  //案件編號
  caseNo:string='';
  updateCaseNo(caseNo){
    this.caseNo=caseNo;
    // console.log("this.caseNo"+this.caseNo);
  }

  //表單送出前驗證
  validateInfInformSubmit(){
    let validate = true;
    if(ValidationUtil.isEmpty(this.form.countersignatureType)){
      validate = false;
      // 會辦類型 必填
      ErrorModalUtil.modalError(this.$t('infCom_infTypeRequired').toString())
    }
    if(validate && "5" == this.form.countersignatureType){
      if("Y" != this.form.adjunct.hasAdjunct && "N" != this.form.adjunct.hasAdjunct){
        validate = false;
        // 請選擇是否附權益信函
        ErrorModalUtil.modalError(this.$t('infCom_pleaseSelectAdjunct').toString())
      }else if("Y" == this.form.adjunct.hasAdjunct && !this.isClickAdjunctPreview){
        validate = false;
        // 請先預覽權益信函
        ErrorModalUtil.modalError(this.$t('infCom_pleasePreviewAdjunct').toString())
      }
      this.validateAdjunctDesc(null,this.form.adjunct.desc,()=>{
        if(this.infInformValidateForm.adjunctDesc.state == 'error'){
            validate = false;
        }
      });
    }

    if(validate){
      if(this.form.countersignatureType =='4' && ValidationUtil.isEmpty(this.form.channelsId)){
        validate = false;
        // 資訊有誤，缺少通路類型資訊
        ErrorModalUtil.modalError(this.$t('infMainForm_noChannelId').toString())
      }
    }

    if(validate){
      if(this.form.infItemList.length <1){
        validate = false;
        // 必須輸入至少一項會辦項目
        ErrorModalUtil.modalError(this.$t('infCom_infItemAtLessOne').toString())
      }
    }
    if(validate){
      this.validateInfDep(null,this.form.infDepartment,()=>{
        if(this.infInformValidateForm.infDepartment.state == 'error'){
          validate = false;
        }
      });
      this.validateContent(null,this.form.content,()=>{
        if(this.infInformValidateForm.content.state == 'error'){
          validate = false;
        }
      });
      this.validateExpireDate(null,this.form.expireString,()=>{
        if(this.infInformValidateForm.expireDate.state == 'error'){
          validate = false;
        }
      });
    }
    if(validate){
      this.validateTargetEmail(null,this.form.targetPersonEmail,()=>{
        if(this.infInformValidateForm.targetEmail.state == 'error'){
          validate = false;
        }
      });
      this.validateCarbonCopyEmail(null,this.form.carbonCopyEmail,()=>{
        if(this.infInformValidateForm.carbonCopyEmail.state == 'error'){
          validate = false;
        }
      });
    }
    
    return validate;
  }

  //取得會辦資料區塊資料
  getInfInformData(){
    this.form.fileIds = [];
    this.form.fileNames = [];
    (this.gridFileData.data as FileGrid[]).forEach(d => {
      this.form.fileIds.push(d.fileId);
      this.form.fileNames.push(d.fileName);
    });
    return this.form;
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
        title: "錯誤",
        content: "「上傳檔案」檔案大於15Mb",
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

  /**
   * 新增時有上傳檔但直接離開，則把未儲存的檔案刪除
   */
  handleLeave() {
    if (this.gridFileData.data.length > 0) {
      this.gridFileData.data.forEach(async data => {
        await this.$fileUploadApi.deleteFileUsingPOST(data.fileId).then((resp: AxiosResponse<OutputErrorCodeDto>) => {
        }).catch(e => console.error(e));
      });
    }
  }

  //會辦類型驗證
  validateInfType(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.infType, false, "success", "", "");
    if (ValidationUtil.isEmpty(value)) {
      // 會辦類型 必填
      CommonUtil.feildValidate(this.infInformValidateForm.infType,true,"error","hover",this.$t('infCom_infTypeRequired').toString());
      callback(() => { });
    }
    callback();
  }

  //不附權益信函說明驗證
  validateAdjunctDesc(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.adjunctDesc, false, "success", "", "");
    if (ValidationUtil.isEmpty(this.form.adjunct.desc) && "N" == this.form.adjunct.hasAdjunct) {
      // 說明 必填
      CommonUtil.feildValidate(this.infInformValidateForm.adjunctDesc,true,"error","hover",this.$t('infCom_descRequired').toString());
      callback(() => { });
    }else if(!ValidationUtil.isEmpty(this.form.adjunct.desc) && this.form.adjunct.desc.length >30 && "N" == this.form.adjunct.hasAdjunct){
      // 說明 不可超過30字
      CommonUtil.feildValidate(this.infInformValidateForm.adjunctDesc,true,"error","hover",this.$t('infCom_descOver30').toString());
      callback(() => { });
    }
    callback();
  }

  //會辦部門驗證
  validateInfDep(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.infDepartment, false, "success", "", "");
    if (ValidationUtil.isEmpty(this.form.infDepartment) && this.form.infItemList.length >= 1) {
      // 會辦部門 必填
      CommonUtil.feildValidate(this.infInformValidateForm.infDepartment,true,"error","hover",this.$t('infCom_infDepRequired').toString());
      callback(() => { });
    }
    callback();
  }

  //會辦內容驗證
  validateContent(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.content, false, "success", "", "");
    if (ValidationUtil.isEmpty(this.form.content)) {
      // 會辦內容 必填
      CommonUtil.feildValidate(this.infInformValidateForm.content,true,"error","hover",this.$t('infCom_infContentRequired').toString());
      callback(() => { });
    }else if(this.form.content.length >1000){
      // 會辦內容 不可超過1000字
      CommonUtil.feildValidate(this.infInformValidateForm.content,true,"error","hover",this.$t('infCom_infContentOver1000').toString());
      callback(() => { });
    }
    callback();
  }

  //承辦窗口驗證
  validateTargetEmail(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.targetEmail, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.form.targetPersonEmail) && !ValidationUtil.isEmpty(this.form.targetPersonEmail.trim())) {
      var validateMultipleReceiverAddress = this.validateMultipleReceiverAddress(this.form.targetPersonEmail.trim());
      if(validateMultipleReceiverAddress){
        CommonUtil.feildValidate(this.infInformValidateForm.targetEmail, false, "success", "", "");
        callback();
      }else{
        //承辦窗口 格式錯誤
        CommonUtil.feildValidate(this.infInformValidateForm.targetEmail, true, "error", "hover", this.$t('infCom_targetEmailFormatError').toString());
        callback(() => { });
      }
    }else{
      // 承辦窗口 必填
      CommonUtil.feildValidate(this.infInformValidateForm.targetEmail,true,"error","hover",this.$t('infCom_targetEmailRequired').toString());
      callback(() => { });
    }
    callback();
  }

  // 驗證收件人email 多筆 (包含單筆)
  /**
   * @description 
  */
  validateMultipleReceiverAddress(value){
    var result = true;
    var receiverAddrSplit = value.trim().split(";"); // 切分 ";""
    for(var i=0; i<receiverAddrSplit.length; i++){
      var goNext = true; // 是否繼續執行
      // 如果是最後的字串 且為 空白 不繼續驗證
      if( (i == receiverAddrSplit.length-1) && ValidationUtil.isEmpty(receiverAddrSplit[i])){
        goNext = false;
      }else{
        goNext = true;
      }

      if(goNext){
        if(ValidationUtil.isEmpty(receiverAddrSplit[i])){
          result = false;
          break;
        }else{
          var match = receiverAddrSplit[i].match(RECEIVER_ADDRESS_REGEX);
          if(!match){
            result = false;
            break;
          }else{
            result = true;
          }
        }
      } // gonext end
    } // for end
    return result;
  }

  //副本驗證
  validateCarbonCopyEmail(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.carbonCopyEmail, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.form.carbonCopyEmail) && !ValidationUtil.isEmpty(this.form.carbonCopyEmail.trim())) {
      var validateMultipleReceiverAddress = this.validateMultipleReceiverAddress(this.form.carbonCopyEmail.trim());
      if(validateMultipleReceiverAddress){
        CommonUtil.feildValidate(this.infInformValidateForm.carbonCopyEmail, false, "success", "", "");
        callback();
      }else{
        //副本 格式錯誤
        CommonUtil.feildValidate(this.infInformValidateForm.carbonCopyEmail, true, "error", "hover", this.$t('infCom_ccEmailFormatError').toString());
        callback(() => { });
      }
    }
    callback();
  }

  //到期日驗證
  validateExpireDate(rule, value, callback) {
    CommonUtil.feildValidate(this.infInformValidateForm.expireDate, false, "success", "", "");
    if (!ValidationUtil.isEmpty(this.form.expireString)) {
        const parseDate = this.formatter.parse(value);
        if (parseDate) {
          if(this.form.expireDate.valueOf() > moment(this.lastExpireDateString).add(-1,'days')){
            this.isExpireDateHoverVisible = true;
            // 到期回覆天數超過20日,請修改！
            CommonUtil.feildValidate(this.infInformValidateForm.expireDate, true, "error", "hover", this.$t('infCom_expireDateOver20').toString());
            callback(() => { });
          }else if(this.form.expireDate.valueOf() < moment(this.earliestExpireDateString)){
            this.isExpireDateHoverVisible = true;
            // 修改後的到期日需大於預設日
            CommonUtil.feildValidate(this.infInformValidateForm.expireDate, true, "error", "hover", this.$t('infCom_expireDateOverdefault').toString());
            callback(() => { });
          }else{
            this.isExpireDateHoverVisible = false;
            callback();
          }
        } else {
          this.isExpireDateHoverVisible = true;
          CommonUtil.feildValidate(this.infInformValidateForm.expireDate, true, "error", "hover", this.$t('global_dateError').toString()); //日期錯誤
          callback(() => { });
        }
    }
    callback();
  }
  /**
  * @description 調閱pdf
  * 
  * @author B0845
  * @version 2022/08/30
   */
  onPdfOpen(data: any) {
    LoadingUtil.show();
    console.log(data);
    // 如果會辦檔案沒有就改抓權益信函 (需求調整不抓權益信函)
    // let fileId = data.infFileId != null ? data.infFileId : data.interestFileId;
    let fileId = data.infFileId ;
    if(fileId != null) {
      this.$informApi.showInfPdfUsingPOST(fileId, { responseType: 'blob' }).then((resp: AxiosResponse<ResponseEntity>) => {
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
  * @version 2022/08/30
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
    /**
  * @description 案件調閱
  * 
  * @author B0845
  * @version 2022/08/30
   */
  caseCheck() {
    this.$emit('caseCheck');
  }
  
}