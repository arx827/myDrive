import { FblFilterHolder, FblOperator } from "@/components/shared/filter-builder/models";
import { Vue, Component } from "vue-property-decorator";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblActionEvent, FblColumnType, FblPageEvent, FblPDataGridHolder, FblRow } from "@/components/shared/data-grid/models";
import { Option, QuestMainDto, TaskSettingDto } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import message from "@/assets/config/MessageUtil";
import MappingUtil from "@/assets/config/MappingUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import QuestionnaireSettingMainForm from "@/components/shared/form/questionnaireSettingForm/QuestionnaireSettingMainForm.vue";
import QuestionnaireSettingShowForm from "@/components/shared/form/questionnaireSettingForm/QuestionnaireSettingShowForm.vue";
import QuestionnaireSettingForm from "@/components/shared/form/questionnaireSettingForm/QuestionnaireSettingForm.vue";
import XLSX from 'xlsx';
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { FblFilterBuilder, FblDataGrid , QuestionnaireSettingMainForm, QuestionnaireSettingShowForm, QuestionnaireSettingForm, HiddenFolde}
})
export default class ProductPage extends Vue {

  public isLoading: boolean = false;

  /** 查詢紀錄Filter */
  public filterHolder: FblFilterHolder = {
    filters: {
      filters: []
    },
    ignoreFilters: {
      filters: []
    },
    filterItems: []
  };

  /** 查詢表單欄位 */
  testForm = {
    taskId: "",     //電訪項目代碼
    questCode: "",  //問卷代碼
    questName: "",  //問卷名稱
    questEnable: "" //是否啟用
  };

  /** 查詢結果表格 */
  public masterGrid: FblPDataGridHolder<QuestMainDto> = {
    rowKey: "questCode",
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      total: 0,
      showTotal: true,
      showSizeChanger: true,
      pageSizeOptions: ['15', '30', '50'],
      locale: { items_per_page: "" }
    },
    sort: {
      selector: "taskId",
      desc: false
    },
    columns: [
      {
        type: FblColumnType.ACTION,
        title: "",
        actions: [
          {
            name: "edit",
            title: this.$t("edit").toString(),
            edit: true

          }
        ]
      },
      {
        type: FblColumnType.PLAIN,
        property: "taskId",
        title: "電訪項目代碼",
        sorter: true,
        defaultSortOrder: "ascend"
      },
      {
        type: FblColumnType.PLAIN,
        property: "taskName",
        title: "電訪項目名稱"
      },
      {
        type: FblColumnType.PLAIN,
        property: "questCode",
        title: "問卷代碼",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "questName",
        title: "問卷名稱",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "questEnable",
        title: "是否啟用",
        sorter: true,
        formatter: (data: QuestMainDto) => {
          return MappingUtil.enableCode(data.questEnable);
        }
      },
      {
        type: FblColumnType.ACTION,
        title: "條件",
        actions: [
          {
            name: "condition",
            title: "條件細項",
            button: true
          }
        ]
      },
      {
        type: FblColumnType.ACTION,
        title: "問卷設定",
        actions: [
          {
            name: "setting",
            title: "問卷設定",
            button: true
          }
        ]
      }
    ]
  };

  //Form Modal 參數
  formVisible = false;
  formTitle = "";
  showFormVisible = false;
  settingFormVisible = false;

  /** 條件細項帶入資料 */
  conditionList = [];

  /** 問卷設定帶入資料 */
  settingFormData = {};

  /** 編輯帶入資料 */
  masterEditing: QuestMainDto = null;

  /** 新增條件按鈕(顯示/隱藏參數) */
  isShowAdd: boolean = true;

  /** 是否可執行Excel匯出 */
  isCanExport: boolean = false;

  /** Excel匯出上限訊息 */
  overMaxRowMsg: string = "";

  //欄位檢核
  questCodeValid = new validation();
  formRules: { [key: string]: ValidationRule[] } = {
    questCode: [{validator:this.validationQuestCode, trigger:"blur" }]
  };

  /** 電訪項目代碼-名稱下拉選單 */
  selectTaskIdNameOptions:Option[] = [];

  created() {
    //取得電訪代碼 + 電訪名稱下拉選單
    this.$taskSettingApi.getTaskIdNameSelectedUsingGET("ALL")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectTaskIdNameOptions = res.data;
    }).catch((err) => {
      console.log(err);
    });
  }

  onMasterPageChange(e: FblPageEvent) {
    this.masterGrid.sort = e.sort;
    if(!validationUtil.isEmpty(this.masterGrid.data)){
      this.masterGrid.pagination.current = e.pagination.current;
      this.masterGrid.pagination.pageSize = e.pagination.pageSize;
      this.reloadMaster();
    }
  }

  onMasterActionClick(e: FblActionEvent<TaskSettingDto>) {
    switch (e.action.name) {
      case "condition":
        this.createConditionModal(e.row.data);
        break;
      case "setting":
        this.createSettingModal(e.row.data);
        break;
      case "edit":
        this.createEditModal(e.row.data);
        break;
      case "delete":
        break;
    }
  }

  /** 重載查詢列表 */
  reloadMaster() {
    const filter = (this.filterHolder.filters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.filters)
    : JSON.stringify({ filters: [] });

    const ignoreFilter = (this.filterHolder.ignoreFilters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.ignoreFilters)
    : JSON.stringify({ filters: [] });

    const sort = this.masterGrid.sort
    ? JSON.stringify([this.masterGrid.sort])
    : undefined;

    this.isLoading = true;

    this.$questSettingApi.paginateQuestSettingUsingGET(
        this.masterGrid.pagination.current - 1,
        this.masterGrid.pagination.pageSize,
        filter,
        ignoreFilter,
        sort
      )
      .then((resp) => {
        const p = { ...this.masterGrid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this.masterGrid.data = resp.data.content;
        this.masterGrid.pagination = p;

        this.isCanExport = true;
        this.doCheckExportRow();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /** 開啟Main Form窗(新增) */
  createAddModal() {
    this.formTitle = "新增設定";
    this.masterEditing = {};
    this.formVisible = true;
  }
  
  /** 開啟Main Form窗(修改) */
  createEditModal(data: QuestMainDto) {
    this.formTitle = "修改設定";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  /** 開啟條件細項顯示窗 */
  createConditionModal(data: QuestMainDto){
    this.showFormVisible = true;
    this.conditionList = data.questConditionDtoList;
  }

  /** 開啟問卷設定窗 */
  createSettingModal(data: QuestMainDto){
    this.settingFormVisible = true;
    this.settingFormData = JSON.parse(JSON.stringify(data));
  }

  /** 開關QuestSettingMainForm 並 更新列表*/
  onMainFormCallBack(val){
    this.formVisible = val;
    this.reloadMaster();
  }

  /** 開關QuestSettingForm 並 更新列表 */
  onFormCallBack(val){
    this.settingFormVisible = val;
    this.reloadMaster();
  }

  /** 開關新增條件按鈕 */
  onBtnCallBack(val){
    this.isShowAdd = val;
  }

  /** 查詢表單(條件)異動 */
  onSearchFormChange(){
    this.isCanExport = false;
  }

  /** 查詢 */
  clickQuery(): void{
    //欄位檢核
    let vaild = true;
    this.validationQuestCode(null, this.testForm.questCode, () => {
      if(this.questCodeValid.state == "error") vaild = false;
    });
    if(!vaild) return;

    //塞入查詢條件
    const taskId = FiltersUtil.setFilterParam("taskId", FblOperator.EQ, this.testForm.taskId);
    const questCode = FiltersUtil.setFilterParam("questCode", FblOperator.EQ, this.testForm.questCode);
    const questName = FiltersUtil.setFilterParam("questName", FblOperator.CONTAINS, this.testForm.questName);
    const questEnable = FiltersUtil.setFilterParam("questEnable", FblOperator.EQ, this.testForm.questEnable);

    //整理為Filters
    let filters = FiltersUtil.setFilters(taskId, questEnable);
    const filter = JSON.stringify(filters);

    //不分大小寫Filters
    let ignoreFilters = FiltersUtil.setFilters(questCode, questName);
    const ignoreFilter = JSON.stringify(ignoreFilters);

    //儲存目前搜尋條件(for 排序、reload用)
    this.filterHolder.filters = filters;
    this.filterHolder.ignoreFilters = ignoreFilters;

    //列表回到第一頁
    this.masterGrid.pagination.current = 1;

    this.isLoading = true;
    this.$questSettingApi.paginateQuestSettingUsingGET(
        this.masterGrid.pagination.current - 1,
        this.masterGrid.pagination.pageSize,
        filter,
        ignoreFilter,
        this.masterGrid.sort ? JSON.stringify([this.masterGrid.sort]) : undefined
      )
      .then((resp) => {
        const p = { ...this.masterGrid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this.masterGrid.data = resp.data.content;
        this.masterGrid.pagination = p;

        this.isCanExport = true;
        this.doCheckExportRow();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /** 匯出Excel */
  doExport(){
    //欄位檢核
    if( !this.isCanExport ){
      //尚未執行查詢 或 reload (msg：請先執行查詢再匯出)
      ErrorModalUtil.modalError( this.$t("global_executeReloadBeforeExport").toString() );
      return;
    }else if( this.overMaxRowMsg != "" ){
      //執行查詢 或 reload後 筆數超過上限
      ErrorModalUtil.modalError( this.overMaxRowMsg );
      return;
    }else if( this.masterGrid.data.length == 0 ){
      //執行查詢 或 reload 後無結果 (msg：無符合結果，無法匯出)
      ErrorModalUtil.modalError( this.$t("userMP_noMatchExportFailed").toString() );
      return;
    }
    
    //查詢紀錄Filters
    const filter = (this.filterHolder.filters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.filters)
    : JSON.stringify({ filters: [] });

    //查詢紀錄不分大小寫Filters
    const ignoreFilter = (this.filterHolder.ignoreFilters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.ignoreFilters)
    : JSON.stringify({ filters: [] });

    LoadingUtil.show();
    this.$questSettingApi.excelQuestSettingExportUsingGET(filter, ignoreFilter, { responseType: 'blob' })
    .then((resp) => {
      this.dealDownLoadData(resp.data, "問卷設定.xlsx");
      message.messageSuccess("匯出成功", true);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      LoadingUtil.close();
    });
  }

  /** 處理後端回傳的下載內容 */
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
    } catch (ex) {
      console.error(ex);
    }
  }

  /** 確認匯出最大限制筆數 */
  doCheckExportRow() {
    this.$exportApi.checkExportUsingGET(this.masterGrid.pagination.total)
    .then((resp)=>{
      this.overMaxRowMsg = resp.data.errorMessage;
    }).catch((err)=>{
      console.log(err);
    }).finally(()=>{
    })
  }

  /** 匯入Excel，並檢查格式 */
  beforeUpload(file) {
    const isExcel = file.type.includes("sheet");

    //判斷檔案類型
    if(!isExcel){
      ErrorModalUtil.modalError("請選擇Excel檔案");
      return false;
    }
    
    //取得Excel內資料，並匯入
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      let workbook = XLSX.read(data, {type: 'binary'});
      const sheet = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      this.doImport(jsonData);
    }
    reader.readAsBinaryString(file);

    return false;
  }

  /** 清除搜尋紀錄 */
  resetForm(){
    //清除檢核訊息
    this.questCodeValid.reset();
    
    //清除查詢表單
    for(let key in this.testForm){
      this.testForm[key] = "";
    }

    //還原查詢結果、條件
    this.isCanExport = false;
    this.overMaxRowMsg = "";
    this.masterGrid.pagination.total = 0;
    this.masterGrid.data = [];
    this.filterHolder.filters = { filters: [] };
    this.filterHolder.ignoreFilters = { filters: [] };
  }

  /** 檢核問卷代碼 - 僅可輸入英數字 */
  validationQuestCode(rule, value, callback){
    this.questCodeValid.reset();

    if( value != "" && !validationUtil.questCodeValidation(value) ){
      this.questCodeValid.msg = "問卷代碼僅可輸入英數字";
    }

    if(this.questCodeValid.msg != ""){
      this.questCodeValid.setError();
      callback(() => { });
    }

    callback();
  }

  //------- 呼叫Main Form Function -------
  /** 新增條件物件 */
  async doAddObj(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingMainForm as any).doAddObj());
  }

  /** 刪除條件物件 */
  async doDelObj(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingMainForm as any).doDelObj());
  }

  /** 匯入Excel */
  async doImport(data){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingMainForm as any).doImport(data));
  }

  /** 表單送出(修改/新增) */
  async doSubmit(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingMainForm as any).doSubmit());
  }

  /** 關閉Form窗 */
  doCancel(){
    this.formVisible = false;
  }

  //------- 呼叫Setting Form Function -------
  /** 表單送出(儲存) */
  async doSettingSubmit(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingForm as any).doSubmit());
  }

  /** 問卷預覽 */
  async doSettingShowQuest(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingForm as any).doReviewPdf("quest"));
  }

  /** 權益信函預覽 */
  async doSettingShowRight(){
    await new Promise((resolve, reject) => (this.$refs.questionnaireSettingForm as any).doReviewPdf("rightLetter"));
  }

  /** 關閉Form窗 */
  doSettingCancel(){
    this.settingFormVisible = false;
  }
}