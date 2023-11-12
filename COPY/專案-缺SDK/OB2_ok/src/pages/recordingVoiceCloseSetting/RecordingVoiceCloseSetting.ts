import { FblFilterHolder, FblOperator } from "@/components/shared/filter-builder/models";
import { Vue, Component } from "vue-property-decorator";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblActionEvent, FblColumnType, FblPageEvent,
         FblPDataGridHolder, FblRow } from "@/components/shared/data-grid/models";
import { QuestionBankLetterRightDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import RecordingVoiceCloseSettingForm from "@/components/shared/form/recordingVoiceCloseSettingForm/RecordingVoiceCloseSettingForm.vue";
import MappingUtil from "@/assets/config/MappingUtil";
import message from "@/assets/config/MessageUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { FblFilterBuilder, FblDataGrid ,RecordingVoiceCloseSettingForm, HiddenFolde},
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
    filterItems: []
  };

  // form test 
  testForm = {
    itemTypeCode: '',
    itemCode: '',
    itemContent: '',
    answerTypeCode: '',
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
            title: this.$t("edit").toString(),
            edit: true
          }
        ]
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemTypeCode",
        title: "段落類型",
        sorter: true,
        formatter: (data: QuestionBankLetterRightDto) => {
            return MappingUtil.getSeletedList("itemTypeCode", data.itemTypeCode);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemCode",
        title: "編號",
        sorter: true,
        defaultSortOrder: "ascend",
      },
      {
        type: FblColumnType.PLAIN,
        property: "itemContent",
        title: "內容",
        sorter: true
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
  formTitle = "";

  // misc
  masterInspected: QuestionBankLetterRightDto = null;
  masterEditing: QuestionBankLetterRightDto = null;

  //欄位檢核
  itemCodeValid = new validation();
  formRules: { [key: string]: ValidationRule[] } = {
    itemCode: [{validator:this.validationItemCode, trigger:"blur" }]
  };

  /** 段落類型下拉選單 */
  selectItemTypeOptions:Option[] = [];
  
  created() {
    //取得段落類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("itemTypeCode")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectItemTypeOptions = res.data.filter((element) => {return element.value != 'rightLetter'});
      this.selectItemTypeOptions.splice(0, 0, {label: "全部", value: "" });
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

  onMasterInspectClick(row: FblRow<QuestionBankLetterRightDto>) {
    this.masterInspected = row.data;
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
    }
  }

  // methods
  reloadMaster() {
    //預設查詢條件(不查段落類型為題庫)
    const itemTypeCode = FiltersUtil.setFilterParam("itemTypeCode", FblOperator.NEQ, "rightLetter");
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
    this.formVisible = true;
  }

  /** 開起Form窗(修改) */
  createEditModal(data: QuestionBankLetterRightDto) {
    this.formTitle = "修改設定";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }
  
  /** 呼叫RecordingVoiceCloseSettingForm的submit */
  async onFormSubmit(){
    await new Promise((resolve, reject) => (this.$refs.recordingVoiceCloseSettingForm as any).submit());
  }

  /** 開關RecordingVoiceCloseSettingForm 並 更新列表*/
  onFormCallBack(val){
    this.formVisible = val;
    this.reloadMaster();
  }

  createDeleteModal(data: QuestionBankLetterRightDto) {
    Modal.confirm({
      title: "刪除",
      okText: "確認",
      cancelText: "取消",
      content: `確定要刪除 ${data.itemCode} 話術設定嗎?`,
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
      }
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
    const itemTypeCode = (this.testForm.itemTypeCode == "")? 
                          FiltersUtil.setFilterParam("itemTypeCode", FblOperator.NEQ, "rightLetter") : 
                          FiltersUtil.setFilterParam("itemTypeCode", FblOperator.EQ, this.testForm.itemTypeCode);
    const itemCode = FiltersUtil.setFilterParam("itemCode", FblOperator.EQ, this.testForm.itemCode);
    const itemContent = FiltersUtil.setFilterParam("itemContent", FblOperator.CONTAINS, this.testForm.itemContent);
    const answerTypeCode = FiltersUtil.setFilterParam("answerTypeCode", FblOperator.EQ, this.testForm.answerTypeCode);
    const itemEnable = FiltersUtil.setFilterParam("itemEnable", FblOperator.EQ, this.testForm.itemEnable);
    
    //整理為Filters
    let filters = FiltersUtil.setFilters(itemTypeCode, answerTypeCode, itemEnable);
    const filter = JSON.stringify(filters);

    //不分大小寫Filters
    let ignoreFilters = FiltersUtil.setFilters(itemCode, itemContent);
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

    //還原查詢條件(不查段落類型為題庫)
    const itemTypeCode = FiltersUtil.setFilterParam("itemTypeCode", FblOperator.NEQ, "rightLetter");
    this.filterHolder.filters = FiltersUtil.setFilters(itemTypeCode);

    //還原不分大小寫條件
    this.filterHolder.ignoreFilters = { filters: []};

    //還原查詢結果
    this.masterGrid.pagination.total = 0;
    this.masterGrid.data = [];
  }

  /** 檢核編號 - 僅可輸入英數字 */
  validationItemCode(rule, value, callback){
    this.itemCodeValid.reset();

    if( value != "" && !validationUtil.itemCodeValidation(value) ){
      this.itemCodeValid.msg = "編號僅可輸入英數字";
    }

    if(this.itemCodeValid.msg != ""){
      this.itemCodeValid.setError();
      callback(() => { });
    }

    callback();
  }
}