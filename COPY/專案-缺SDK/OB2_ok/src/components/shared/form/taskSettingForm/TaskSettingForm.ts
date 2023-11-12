import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Option, TaskSettingDto } from "@fubonlife/obd-api-axios-sdk";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import { LoginModule } from "@/plugins/store/LoginModule";
import { Modal } from "ant-design-vue";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import message from "@/assets/config/MessageUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import moment from 'moment';

export interface tobdTaskFormModel {
  coreSystemCode?: string; //主機對應代碼
  taskId?: string;         //電訪項目代碼
  taskName?: string;       //電訪項目名稱
  taskTypeCode?: string;   //類型
  businessType?: string;   //業務別
  lawReason?: string;      //法源/內控依據
  respDepart?: string;     //權責部門
  priority?: string;       //電訪項目優先序
  callKeypoint?: string;   //電訪重點
  executeTime?: string;    //執行時機
  callLimit?: string;      //電訪期限
  callFreqDay?: string;    //電訪頻率(幾天)
  callFreqVisit?: string;  //電訪頻率(幾訪)
  deadLine?: string;       //結案期限
  caseReopen?: string;     //案件重啟
  realTimeType?: string;   //即時電訪
  batchLetter?: string;    //批次產信
  messageNotice?: string;  //M+/PUSH/EMAIL/簡訊通知
  callChange?: string;     //電話變更
  firstLine?: string;      //第一線核保
  costSetting?: string;    //費用分攤設定
  lastImportTime?: string; //最後匯入時間
  createId?: string;       //建立人員
  createDate?: string;     //建立日期
  updateId?: string;       //最後異動人員
  updateDate?: string;     //最後異動日期
  taskStartDate?: string | Date;    //項目執行期間起日
  taskEndDate?: string | Date;      //項目執行期間迄日
}

@Component({ components: { FblLevelSelect } })
export default class TaskSettingForm extends Vue {

  @Prop()
  public initData: TaskSettingDto;

  @Prop()
  public loading: boolean;

  /** 日期選擇器格式 */
  formatter = this.$twDateFormatter;

  /** 起日(格式轉換) */
  startDateStr:string = "";

  //欄位檢核參數
  coreSystemCodeValid = new validation();
  taskIdValid = new validation();
  taskNameValid = new validation();
  taskTypeCodeValid = new validation();
  businessTypeValid = new validation();
  respDepartValid = new validation();
  priorityValid = new validation();
  callLimitValid = new validation();
  callFreqDayValid = new validation();
  callFreqVisitValid = new validation();
  deadLineValid = new validation();
  executeTimeValid = new validation();
  taskStartDateValid = new validation();
  lastImportTimeValid = new validation();

  form: tobdTaskFormModel = null;
  formRules: { [key: string]: ValidationRule[] } = {
    coreSystemCode: [{required:true, validator:this.validationCoreSystemCode, trigger:"blur" }],
    taskId: [{required:true, validator:this.validationTaskId, trigger:"blur" }],
    taskName: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    taskTypeCode: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    businessType: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    respDepart: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    priority: [{required:true, validator:this.validationPriority, trigger:"blur" }],
    callLimit: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    callFreqLab: [{required:true}],
    callFreqDay: [{validator:this.validationRequired, trigger:"blur" }],
    callFreqVisit: [{validator:this.validationRequired, trigger:"blur" }],
    deadLine: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    executeTime: [{required:true, validator:this.validationRequired, trigger:"blur" }],
    taskStartDate: [{required:true, validator:this.validationTaskStartDate, trigger:"blur" }],
    lastImportTime: [{required:true, validator:this.validationlastImportTime, trigger:"blur"}]
  };

  //下拉選單
  selectTaskTypeOptions:Option[] = [];
  selectBusinessTypeOptions:Option[] = [];
  selectRespDepartOptions:Option[] = [];
  selectExecuteTimeOptions:Option[] = [];
  selectCostSettingOptions:Option[] = [];
  selectYesNoOptions:Option[] = [{value:"Y", label:"是"}, {value:"N", label:"否"}];

  /** 取得目前狀態(修改/新增) */
  get isEditing(): boolean {
    return !!this.initData && !!this.initData.taskId;
  }

  /** 取得登入人員AD帳號 */
  get avatarText(): string {
    const state = LoginModule.loginState;
    return (state && state.me)? state.me.id:"";
  }

  created(): void {
    this.reset();

    //取得類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("taskTypeCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskTypeOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });

    //取得業務別類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("businessType")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectBusinessTypeOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });

    //取得權責部門下拉選單
    this.$commonApi.findByTypeIdUsingGET("respDepart")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectRespDepartOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });

    //取得執行時機下拉選單
    this.$commonApi.findByTypeIdUsingGET("executeTime")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectExecuteTimeOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });

    //取得費用分攤設定下拉選單
    this.$commonApi.findByTypeIdUsingGET("costSetting")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectCostSettingOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });
  }
  
  @Watch("initData")
  onInitDataChanged(): void {
    this.reset();
  }

  /** 起始日期選擇器離開焦點(儲存手動輸入) */
  onStartDateBlur(e){
    let value = e.target.value;
    let time = value.split("/");
    let year = Number.parseInt(time[0]) + 1911;

    if(value == ""){
      this.form.taskStartDate = null;
      this.startDateStr = "";
    }else if(time.length == 3 && year <= 9999){
      let date = new Date( year + "-" + time[1] + "-" + time[2] + " 00:00");
      //日期是否有效
      if( !isNaN(date.getTime()) ){
        this.form.taskStartDate = date;
        this.startDateStr = MomentUtil.transformRocYearMonthDay( MomentUtil.default(date) );
      }
    }

    //欄位檢核
    this.validationTaskStartDate(null, this.form.taskStartDate, () => {});
  }

  /** 起始日期選擇器異動(顯示選取日期) */
  onStartDateChange(value){
    this.startDateStr = (value == "" || value == null)? 
                        "":MomentUtil.transformRocYearMonthDay(MomentUtil.default( new Date(value.getFullYear(), value.getMonth(), value.getDate()) ));
    
    //欄位檢核
    this.validationTaskStartDate(null, this.form.taskStartDate, () => {});
  }

  /** 迄日期選擇器異動  */
  onEndDateChange(value){
    //欄位檢核
    this.validationTaskStartDate(null, this.form.taskStartDate, () => {});
  }

  reset() {
    //清除檢核訊息
    this.coreSystemCodeValid.reset();
    this.taskIdValid.reset();
    this.taskNameValid.reset();
    this.taskTypeCodeValid.reset();
    this.businessTypeValid.reset();
    this.respDepartValid.reset();
    this.priorityValid.reset();
    this.executeTimeValid.reset();
    this.taskStartDateValid.reset();
    this.lastImportTimeValid.reset(); 
    this.callLimitValid.reset(); 
    this.callFreqDayValid.reset(); 
    this.callFreqVisitValid.reset(); 
    this.deadLineValid.reset(); 

    if(this.isEditing){
      //塞入欄位資料
      this.form = JSON.parse(JSON.stringify(this.initData));
      this.form.taskStartDate = new Date(this.initData.taskStartDate);
      this.form.taskEndDate = (this.initData.taskEndDate != null)? new Date(this.initData.taskEndDate):null;
      this.form.createDate = MomentUtil.transformRoc(this.initData.createDate);
      this.form.updateDate = MomentUtil.transformRoc(this.initData.updateDate);
      this.startDateStr = MomentUtil.transformRocYearMonthDay(this.initData.taskStartDate);
    } else {
      this.initForm();
    }
  }

  /** 表單送出(修改/新增) */
  public submit() {
    let typeMsg = (this.isEditing)? "修改":"新增";

    //欄位檢核
    if( !this.validateSubmit() ) return;

    Modal.confirm({
      title: typeMsg,
      okText: "送出",
      cancelText: "取消",
      content: "確定要送出嗎?",
      centered: true,
      onOk: () => {
        (this.isEditing)? this.updateTaskItem():this.insertTaskItem();
      },
    });
  }

  /** 修改電訪項目設定 */
  updateTaskItem(){
    this.form.updateId = this.avatarText;
    this.form.createDate = MomentUtil.transformRoc(this.form.createDate);//轉回西元年
    this.form.updateDate = MomentUtil.transformRoc(this.form.updateDate);//轉回西元年

    this.$taskSettingApi.doSaveTaskSettingUsingPUT("update", this.form as TaskSettingDto)
    .then((resp) => {
      message.messageSuccess("儲存成功", true);
      this.$emit("formCallBack", false);//關閉視窗 並 更新列表
    })    
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 新增電訪項目設定 */
  insertTaskItem(){
    this.$taskSettingApi.doSaveTaskSettingUsingPUT("insert", this.form as TaskSettingDto)
    .then((resp) => {
      if( resp.data == "100" as any ){
        ErrorModalUtil.modalError("電訪項目代碼已存在");
        return;
      }
      message.messageSuccess("新增成功", true);
      this.$emit("formCallBack", false);//關閉視窗 並 更新列表
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
    });
  }

  /** 初始化Form */
  initForm(){
    this.startDateStr = "";
    this.form = {
      coreSystemCode: "",
      taskId: "",
      taskName: "",
      taskTypeCode: "",
      businessType: "",
      lawReason: "",
      respDepart: "",
      priority: "",
      callKeypoint: "",
      executeTime: "",
      callLimit: "",
      callFreqDay: "",
      callFreqVisit: "",
      deadLine: "",
      caseReopen: "N",
      realTimeType: "N",
      batchLetter: "N",
      messageNotice: "N",
      callChange: "N",
      firstLine: "N",
      costSetting: "",
      taskStartDate: "",
      taskEndDate: "",
      lastImportTime: "",
      createId: this.avatarText,
      updateId: this.avatarText,
      createDate: "",
      updateDate: ""
    }
  }

  /** 檢核所有欄位 */
  validateSubmit(){
    let vaild = true;
    //通用必填檢核
    let commonList = {
      taskName: this.taskNameValid,
      taskTypeCode: this.taskTypeCodeValid,
      businessType: this.businessTypeValid,
      respDepart: this.respDepartValid,
      executeTime: this.executeTimeValid,
      callLimit: this.callLimitValid,
      callFreqDay: this.callFreqDayValid,
      callFreqVisit: this.callFreqVisitValid,
      deadLine: this.deadLineValid
    };

    //通用數字檢核
    let numberList = {
      callLimit: this.callLimitValid,
      callFreqDay: this.callFreqDayValid,
      callFreqVisit: this.callFreqVisitValid,
      deadLine: this.deadLineValid
    }

    this.validationCoreSystemCode(null, this.form.coreSystemCode, () => {
      if(this.coreSystemCodeValid.state == "error") vaild = false;
    });

    this.validationTaskId(null, this.form.taskId, () => {
      if(this.taskIdValid.state == "error") vaild = false;
    });

    this.validationPriority(null, this.form.priority, () => {
      if(this.priorityValid.state == "error") vaild = false;
    });

    this.validationTaskStartDate(null, this.form.taskStartDate, () => {
      if(this.taskStartDateValid.state == "error") vaild = false;
    });

    this.validationlastImportTime(null, this.form.lastImportTime, () => {
      if(this.lastImportTimeValid.state == "error") vaild = false;
    });
    
    for(let key in commonList){
      this.validationRequired({field:key}, this.form[key], () => {
        if(commonList[key].state == "error") vaild = false;
      });
    }

    // for(let key in numberList){
    //   this.validationNumber({field:key}, this.form[key], () => {
    //     if(numberList[key].state == "error") vaild = false;
    //   });
    // }

    return vaild;
  }

  /** 檢核主機對應代碼 - 為必填、僅限英數字 */
  validationCoreSystemCode(rule, value, callback){
    this.coreSystemCodeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.coreSystemCodeValid.msg = "請輸入主機對應代碼";
    }else if( !validationUtil.coreSystemCodeValidation(value) ){
      this.coreSystemCodeValid.msg = "主機對應代碼僅可輸入英數字";
    }

    if(this.coreSystemCodeValid.msg != ""){
      this.coreSystemCodeValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核電訪項目代碼 - 為必填、僅限英數字 */
  validationTaskId(rule, value, callback){
    this.taskIdValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.taskIdValid.msg = "請輸入電訪項目代碼";
    }else if( !validationUtil.taskIdValidation(value) ){
      this.taskIdValid.msg = "電訪項目代碼僅可輸入英數字及【-】符號";
    }

    if(this.taskIdValid.msg != ""){
      this.taskIdValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核電訪項目優先序 - 為必填、僅限數字 */
  validationPriority(rule, value, callback){
    this.priorityValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.priorityValid.msg = "請輸入電訪項目優先序";
    }else if( !validationUtil.priorityValidation(value) ){
      this.priorityValid.msg = "電訪項目優先序僅可輸入數字";
    }

    if(this.priorityValid.msg != ""){
      this.priorityValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核項目執行期間起日 - 為必填、迄日不可早於起日 */
  validationTaskStartDate(rule, value, callback){
    this.taskStartDateValid.reset();

    let eDate = this.form.taskEndDate;

    if( value == "" || value == null ){
      this.taskStartDateValid.msg = "請選擇項目執行期間起日";
    }else if( eDate != null && value != eDate && moment(value).isAfter(eDate) ){
      this.taskStartDateValid.msg = "項目執行期間迄日不可早於起日";
    }

    if(this.taskStartDateValid.msg != ""){
      this.taskStartDateValid.setError();
      callback(() => { });
    }

    callback();
  }

  /** 檢核最後匯入時間 - 為四位數字、僅限數字、時間合理性 */
  validationlastImportTime(rule, value, callback){
    this.lastImportTimeValid.reset();

    if( validationUtil.isEmpty(value) ){
      this.lastImportTimeValid.msg = "請輸入最後匯入時間";
    }else if( !validationUtil.lastImportTimeValidation(value) ){
      this.lastImportTimeValid.msg = "最後匯入時間僅可輸入數字";
    }else if( value.length != 4 ){
      this.lastImportTimeValid.msg = "最後匯入時間格式有誤";
    }else if( Number.parseInt(value) == 0 || Number.parseInt(value.substring(0, 2)) > 23 || Number.parseInt(value.substring(2, 4)) > 59 ){
      this.lastImportTimeValid.msg = "最後匯入時間格式有誤";      
    }

    if(this.lastImportTimeValid.msg != ""){
      this.lastImportTimeValid.setError();
      callback(() => { });
    }
    
    callback();
  }

  /** 共用欄位檢核 - 僅限數字 - 最多僅可輸入兩位數*/
  validationNumber(rule, value, callback){
    let valid = !validationUtil.numberValidation(value);

    switch(rule.field){
      case "callLimit":
        this.callLimitValid.reset();
        if( validationUtil.isEmpty(value) ){ callback(); return; }

        if( valid ){
          this.callLimitValid.msg = "電訪期限僅可輸入數字";
          this.callLimitValid.setError();

          callback(() => { });
        } else {
          if (value.length > 2){
            this.callLimitValid.msg = "電訪期限最多僅可輸入兩位數";
            this.callLimitValid.setError();

            callback(() => { });
          }
        }
        break;
      case "callFreqDay":
        this.callFreqDayValid.reset();
        if( validationUtil.isEmpty(value) ){ callback(); return; }

        if( valid ){
          this.callFreqDayValid.msg = "電訪頻率(天)僅可輸入數字";
          this.callFreqDayValid.setError();

          callback(() => { });
        } else {
          if (value.length > 2){
            this.callFreqDayValid.msg = "電訪頻率(天)最多僅可輸入兩位數";
            this.callFreqDayValid.setError();

            callback(() => { });
          }
        }
        break;
      case "callFreqVisit":
        this.callFreqVisitValid.reset();
        if( validationUtil.isEmpty(value) ){ callback(); return; }

        if( valid ){
          this.callFreqVisitValid.msg = "電訪頻率(訪)僅可輸入數字";
          this.callFreqVisitValid.setError();

          callback(() => { });
        } else {
          if (value.length > 2){
            this.callFreqVisitValid.msg = "電訪頻率(訪)最多僅可輸入兩位數";
            this.callFreqVisitValid.setError();

            callback(() => { });
          }
        }
        break;
      case "deadLine":
        this.deadLineValid.reset();
        if( validationUtil.isEmpty(value) ){ callback(); return; }

        if( valid ){
          this.deadLineValid.msg = "結案期限僅可輸入數字";
          this.deadLineValid.setError();
          callback(() => { });
        } else {
          if (value.length > 2){
            this.deadLineValid.msg = "結案期限最多僅可輸入兩位數";
            this.deadLineValid.setError();

            callback(() => { });
          }
        }
        break;
    }

    callback();
  }

  /** 共用欄位檢核 - 為必填 */
  validationRequired(rule, value, callback){
    let valid = validationUtil.isEmpty(value.trim());
    let validNm = !validationUtil.numberValidation(value);
    switch(rule.field){
      case "taskName":
        this.taskNameValid.reset();
        if( valid ){
          this.taskNameValid.msg = "請輸入電訪項目名稱";
          this.taskNameValid.setError();
          callback(() => { });
        }
        break;
      case "taskTypeCode":
        this.taskTypeCodeValid.reset();
        if( valid ){
          this.taskTypeCodeValid.msg = "請選擇類型";
          this.taskTypeCodeValid.setError();
          callback(() => { });
        }
        break;
      case "businessType":
        this.businessTypeValid.reset();
        if( valid ){
          this.businessTypeValid.msg = "請選擇業務別";
          this.businessTypeValid.setError();
          callback(() => { });
        }
        break;
      case "respDepart":
        this.respDepartValid.reset();
        if( valid ){
          this.respDepartValid.msg = "請選擇權責部門";
          this.respDepartValid.setError();
          callback(() => { });
        }
        break;
      case "executeTime":
        this.executeTimeValid.reset();
        if( valid ){
          this.executeTimeValid.msg = "請選擇執行時機";
          this.executeTimeValid.setError();
          callback(() => { });
        }
        break;
      case "callLimit":
        this.callLimitValid.reset();
        if( valid ){
          this.callLimitValid.msg = "請輸入電訪期限";
          this.callLimitValid.setError();
          callback(() => { });
        } else {
          if( validNm ){
            this.callLimitValid.msg = "電訪期限僅可輸入數字";
            this.callLimitValid.setError();
            callback(() => { });
          } else {
            if (value.length > 2){
              this.callLimitValid.msg = "電訪期限最多僅可輸入兩位數";
              this.callLimitValid.setError();
              callback(() => { });
            }
          }
        }
        break;
      case "callFreqDay":
        this.callFreqDayValid.reset();
        if( valid ){
          this.callFreqDayValid.msg = "請輸入電訪頻率(天)";
          this.callFreqDayValid.setError();
          callback(() => { });
        } else {
          if( validNm ){
            this.callFreqDayValid.msg = "電訪頻率(天)僅可輸入數字";
            this.callFreqDayValid.setError();
            callback(() => { });
          } else {
            if (value.length > 2){
              this.callFreqDayValid.msg = "電訪頻率(天)最多僅可輸入兩位數";
              this.callFreqDayValid.setError();
              callback(() => { });
            }
          }
        }
        break;
      case "callFreqVisit":
        this.callFreqVisitValid.reset();
        if( valid ){
          this.callFreqVisitValid.msg = "請輸入電訪頻率(訪)";
          this.callFreqVisitValid.setError();
          callback(() => { });
        } else {
          if( validNm ){
            this.callFreqVisitValid.msg = "電訪頻率(訪)僅可輸入數字";
            this.callFreqVisitValid.setError();
            callback(() => { });
          } else {
            if (value.length > 2){
              this.callFreqVisitValid.msg = "電訪頻率(訪)最多僅可輸入兩位數";
              this.callFreqVisitValid.setError();
              callback(() => { });
            }
          }
        }
        break;
      case "deadLine":
        this.deadLineValid.reset();
        if( valid ){
          this.deadLineValid.msg = "請輸入結案期限";
          this.deadLineValid.setError();
          callback(() => { });
        } else {
          if( validNm ){
            this.deadLineValid.msg = "結案期限僅可輸入數字";
            this.deadLineValid.setError();
            callback(() => { });
          } else {
            if (value.length > 2){
              this.deadLineValid.msg = "結案期限最多僅可輸入兩位數";
              this.deadLineValid.setError();
              callback(() => { });
            }
          }
        }
        break;
    }

    callback();
  }
}