import { FblFilterDataType, FblFilterHolder, FblOperator } from "@/components/shared/filter-builder/models";
import { Vue, Component } from "vue-property-decorator";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblActionEvent, FblColumnType, FblPageEvent, FblPDataGridHolder, FblRow } from "@/components/shared/data-grid/models";
import { QuestionBankLetterRightDto, QuestionBankLetterRightSubDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import { AxiosResponse } from "axios";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import QuestionBankLetterRightsForm from "@/components/shared/form/questionBankLetterRightsForm/QuestionBankLetterRightsForm.vue";
import QuestionBankLetterRightsConditionForm from "@/components/shared/form/questionBankLetterRightsForm/QuestionBankLetterRightsConditionForm.vue";
import QuestionBankLetterRightsSubForm from "@/components/shared/form/questionBankLetterRightsSubForm/QuestionBankLetterRightsSubForm.vue";
import MappingUtil from "@/assets/config/MappingUtil";
import message from "@/assets/config/MessageUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import XLSX from 'xlsx';

@Component({
  components: { FblFilterBuilder, FblDataGrid ,QuestionBankLetterRightsForm, QuestionBankLetterRightsSubForm, QuestionBankLetterRightsConditionForm, HiddenFolde},
})
export default class ProductPage extends Vue {
  // loading
  public isLoading: boolean = false;

  // filter
  public filterHolder: FblFilterHolder = {
    filters: {
      filters: []
    },
    ignoreFilters: {
      filters: []
    },
    filterItems: [
      // 全部 / 單選 / 複選 / 子題單選 / 子題複選 / 子題問答單選 / 子題問答複選 / 母題單選 / 母題問答單選 / 題組 / 問答題單選 / 問答題複選
      {
        property: "answerTypeCode",
        title: "答案類別",
        dataType: FblFilterDataType.STRING
      }
    ]
  };

  //form test 
  testForm = {
    itemTitleCode: '',
    itemCode: '',
    itemContent: '',
    answerTypeCode: '',
    rightsContent: '',
    itemEnable: ''
  };

  // data grid
  public masterGrid: FblPDataGridHolder<QuestionBankLetterRightDto> = {
    rowKey: "itemCode",
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
      selector: "itemCode",
      desc: false
    },
    columns: [
      {
        type: FblColumnType.ACTION,
        title: "",
        actions: [
          {
            name: "edit",
            title: this.$t("global_setting").toString(),
            edit: true
          }
        ]
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemTitleCode",
        title: "題目類型",
        sorter: true,
        formatter: (data: QuestionBankLetterRightDto) => {
          return MappingUtil.getSeletedList("itemTitleCode", data.itemTitleCode);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemCode",
        title: "題目編號",
        sorter: true,
        defaultSortOrder: "ascend"
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemContent",
        title: "題目內容",
        sorter: true,
        inspect: (data: QuestionBankLetterRightDto) => { 
          return this.inspectFormatter(data)
        }
      },
      {
        type: FblColumnType.ACTION,
        title: "問項條件",
        actions: [
            {
                name: "conditionSetting",
                title: this.$t('global_setting').toString(),
                setting: true
            }
        ]
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerTypeCode",
        title: "答案類別",
        sorter: true,
        formatter: (data: QuestionBankLetterRightDto) => {
          return MappingUtil.getSeletedList("answerTypeCode", data.answerTypeCode);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerOption",
        title: "答案選項"
      },
      {
        type: FblColumnType.PLAIN,
        property: "rightsContent",
        title: "權益信函內容",
        sorter: true,
        inspect: (data: QuestionBankLetterRightDto) => { 
          return this.inspectFormatter(data)
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemEnable",
        title: "是否啟用",
        sorter: true,
        formatter: (data: QuestionBankLetterRightDto) => {
          return MappingUtil.enableCode(data.itemEnable);
        }
      }
    ],
  };

  // form modal
  formVisible = false;
  formSubVisible = false;
  formConditionVisible = false;
  formTitle = "";

  /** 子題項設定窗純顯示或編輯 */
  isSubEditing: boolean = null;

  //子題項設定窗按鈕是否顯示
  okBtnStyle = { style: { display: 'none' } };
  cancelBtnStyle = { style: { display: '' } };

  /** 子題項搜尋條件 */
  subAnswerOption = "";

  /** 子題項選取內容 */
  selectedSubItem:Map<string, string> = new Map<string, string>();

  /** 子題項顯示內容 */
  showSubItem:Array<QuestionBankLetterRightSubDto> = [];

  // misc
  masterInspected: QuestionBankLetterRightDto = null;
  masterEditing: QuestionBankLetterRightDto = null;

  //欄位檢核
  itemCodeValid = new validation();
  formRules: { [key: string]: ValidationRule[] } = {
    itemCode: [{validator:this.validationItemCode, trigger:"blur" }]
  };

  //下拉選單
  selectAnswerTypeOptions:Option[] = [];
  selectItemTitleOptions:Option[] = [];

  /** 新增條件按鈕(顯示/隱藏參數) */
  isShowAdd: boolean = true;

  created() {
    //取得答案類別下拉選單
    this.$commonApi.findByTypeIdUsingGET("answerTypeCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectAnswerTypeOptions = res.data;
      this.selectAnswerTypeOptions.splice(0, 0, {label: "全部", value: "" });
      this.selectAnswerTypeOptions.splice(12, 0, {label: "無選項", value: "null" });
    }).catch((err) => {
      console.log(err);
    });

    //取得題目類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("itemTitleCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectItemTitleOptions = res.data;
      this.selectItemTitleOptions.splice(0, 0, {label: "全部", value: "" });
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

  /** 表單點擊事件 */
  onMasterInspectClick(row: FblRow<QuestionBankLetterRightDto>) {
    this.masterInspected = row.data;
    this.showSubItem = row.data.subItems;
    this.openSubForm(false, null);
  }

  onMasterActionClick(e: FblActionEvent<QuestionBankLetterRightDto>) {
    switch (e.action.name) {
      case "detail":
        break;
      case "delete":
        this.createDeleteModal(e.row.data);
        break;
      case "edit":
        this.createEditModal(e.row.data);
        break;
      case "conditionSetting":
        this.createConditionModal(e.row.data);
        break;
    }
  }

  // methods
  reloadMaster() {
    //預設查詢條件(只查段落類型為題庫)
    const itemTypeCode = FiltersUtil.setFilterParam("itemTypeCode", FblOperator.EQ, "rightLetter");
    let filters = FiltersUtil.setFilters(itemTypeCode);

    const filter = (this.filterHolder.filters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.filters)
    : JSON.stringify(filters);

    const ignoreFilter = (this.filterHolder.ignoreFilters.filters.length != 0)
    ? JSON.stringify(this.filterHolder.ignoreFilters)
    : JSON.stringify({ filters: [] });
    
    const sort = this.masterGrid.sort
    ? JSON.stringify([this.masterGrid.sort])
    : undefined;

    this.isLoading = true;

    this.$questionBankLetterRightsApi.paginateTQuestItemUsingGET(
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
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  
  /** 開起Form窗(新增) */
  createAddModal() {
    this.formTitle = "新增設定";
    this.masterEditing = {};
    this.selectedSubItem = new Map<string, string>();
    this.formVisible = true;
  }

  /** 開起Form窗(修改) */
  createEditModal(data: QuestionBankLetterRightDto) {
    this.formTitle = "修改設定";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  /** 開起Form窗(問項條件) */
  createConditionModal(data: QuestionBankLetterRightDto) {
    this.formTitle = "問項條件";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formConditionVisible = true;
  }

  createDeleteModal(data: QuestionBankLetterRightDto) {
    Modal.confirm({
      title: "刪除",
      okText: "確認",
      cancelText: "取消",
      content: `確定要刪除 ${data.itemCode} 題庫及權益信函設定嗎?`,
      centered: true,
      onOk: () => {
        this.isLoading = true;
        this.$questionBankLetterRightsApi.deleteByIdUsingDELETE(data.itemCode)
          .then((resp) => {
            this.reloadMaster();
            message.messageSuccess("刪除成功", true);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    });
  }

  /** 查詢 */
  clickQuery(): void{
    //欄位檢核
    let vaild = true;
    this.validationItemCode(null, this.testForm.itemCode, () => {
      if(this.itemCodeValid.state == "error") vaild = false;
    });
    if(!vaild) return;

    //塞入查詢條件
    const itemTypeCode = FiltersUtil.setFilterParam("itemTypeCode", FblOperator.EQ, "rightLetter");
    const itemTitleCode = FiltersUtil.setFilterParam("itemTitleCode", FblOperator.EQ, this.testForm.itemTitleCode);
    const itemCode = FiltersUtil.setFilterParam("itemCode", FblOperator.EQ, this.testForm.itemCode);
    const itemContent = FiltersUtil.setFilterParam("itemContent", FblOperator.CONTAINS, this.testForm.itemContent);
    const answerTypeCode = FiltersUtil.setFilterParam("answerTypeCode", FblOperator.EQ, this.testForm.answerTypeCode);
    const rightsContent = FiltersUtil.setFilterParam("rightsContent", FblOperator.CONTAINS, this.testForm.rightsContent);
    const itemEnable = FiltersUtil.setFilterParam("itemEnable", FblOperator.EQ, this.testForm.itemEnable);

    //整理為Filters
    let filters = FiltersUtil.setFilters(itemTypeCode, itemTitleCode, answerTypeCode, itemEnable);
    const filter = JSON.stringify(filters);

    //不分大小寫Filters
    let ignoreFilters = FiltersUtil.setFilters(itemCode, itemContent, rightsContent);
    const ignoreFilter = JSON.stringify(ignoreFilters);

    //儲存目前搜尋條件(for 排序、reload用)
    this.filterHolder.filters = filters;
    this.filterHolder.ignoreFilters = ignoreFilters;

    //列表回到第一頁
    this.masterGrid.pagination.current = 1;
    
    this.isLoading = true;
    this.$questionBankLetterRightsApi.paginateTQuestItemUsingGET(
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
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /** 清除搜尋紀錄 */
  resetForm(): void{
    //清除檢核訊息
    this.itemCodeValid.reset();

    for(let key in this.testForm){
      this.testForm[key] = "";
    }

    //還原查詢條件(只查段落類型為題庫)
    const itemTypeCode = FiltersUtil.setFilterParam("itemTypeCode", FblOperator.EQ, "rightLetter");
    this.filterHolder.filters = FiltersUtil.setFilters(itemTypeCode);

    //還原不分大小寫條件
    this.filterHolder.ignoreFilters = { filters: []};

    //還原查詢結果
    this.masterGrid.pagination.total = 0;
    this.masterGrid.data = [];
  }

  /** 開啟子題項設定窗(純顯示:false, 編輯:true) */
  openSubForm(isSubEditing: boolean, subItems: Map<string, string>): void{
    //還原設定
    this.subAnswerOption = "";
    this.okBtnStyle.style.display = "none";
    this.cancelBtnStyle.style.display = "";
    
    if(isSubEditing){
      let form = (this.$refs.questionBankLetterRightsForm as any).form;

      //母視窗如為題組, 子題項篩選需多加答案選項條件
      if(form.answerTypeCode == "ATC05" && form.answerOptionId != ""){
        this.subAnswerOption = form.answerOption;
      }

      this.okBtnStyle.style.display = "";
      this.cancelBtnStyle.style.display = "none";
    }

    if(subItems != null)
      this.selectedSubItem = subItems;
    
    this.isSubEditing = isSubEditing;
    this.formSubVisible = true;
  }

  /** 呼叫QuestionBankLetterRightsForm的submit */
  async onFormSubmit(){
    await new Promise((resolve, reject) => (this.$refs.questionBankLetterRightsForm as any).submit());
  }

  /** 子題項設定送出 */
  async onSubFormSubmit(){
    await new Promise((resolve, reject) => (this.$refs.questionBankLetterRightsSubForm as any).submit());
  }

  /** 開關QuestionBankLetterRightsForm 並 更新列表*/
  onFormCallBack(val){
    this.formVisible = val;
    this.reloadMaster();
  }

  /** 子題項設定 回傳選取資料給 QuestionBankLetterRightsForm */
  onSubFormCallBack(data){
    if(data.size > 0){
      let form = (this.$refs.questionBankLetterRightsForm as any);
      form.form.subItemSetting = "Y";
      form.selectedSubItem = data;
      this.selectedSubItem = data;
    }
    this.formSubVisible = false;
  }

  /** 列表inspect條件格式 */
  inspectFormatter(data: QuestionBankLetterRightDto): boolean{
    //ATC04:母題單選, ATC05:題組, ATC11:母題問答單選
    return (data.answerTypeCode == "ATC04" || data.answerTypeCode == "ATC05" || data.answerTypeCode == "ATC11")? true:false;
  }

  /** 檢核題目編號 - 僅可輸入英數字 */
  validationItemCode(rule, value, callback){
    this.itemCodeValid.reset()

    if( value != "" && !validationUtil.itemCodeValidation(value) ){
      this.itemCodeValid.msg = "題目編號僅可輸入英數字";
    }

    if(this.itemCodeValid.msg != ""){
      this.itemCodeValid.setError();
      callback(() => { });
    }

    callback();
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

  /** 開關新增條件按鈕 */
  onBtnCallBack(val){
    this.isShowAdd = val;
  }

  /** 開關QuestionBankLetterRightsConditionForm 並 更新列表*/
  onMainFormCallBack(val){
    this.formConditionVisible = val;
    this.reloadMaster();
  }

  //------- 呼叫Form Function -------
  /** 新增條件物件 */
  async doAddObj(){
    await new Promise((resolve, reject) => (this.$refs.questionBankLetterRightsConditionForm as any).doAddObj());
  }
  /** 匯入Excel */
  async doImport(data){
    await new Promise((resolve, reject) => (this.$refs.questionBankLetterRightsConditionForm as any).doImport(data));
  }
  /** 表單送出(修改/新增) */
  async doSubmit(){
    await new Promise((resolve, reject) => (this.$refs.questionBankLetterRightsConditionForm as any).doSubmit());
  }
  /** 關閉Form窗 */
  doCancel(){
    this.formConditionVisible = false;
  }

}