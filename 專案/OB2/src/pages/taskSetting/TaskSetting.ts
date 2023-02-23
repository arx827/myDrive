import { FblFilterHolder, FblOperator } from "@/components/shared/filter-builder/models";
import { Vue, Component } from "vue-property-decorator";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblActionEvent, FblColumnType, FblPageEvent, FblPDataGridHolder, FblRow } from "@/components/shared/data-grid/models";
import { Option, TaskSettingDto } from "@fubonlife/obd-api-axios-sdk";
import { Modal } from "ant-design-vue";
import { AxiosResponse } from "axios";
import { ValidationRule } from "ant-design-vue/types/form-model/form";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import LoadingUtil from "@/assets/config/LoadingUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import TaskSettingForm from "@/components/shared/form/taskSettingForm/TaskSettingForm.vue";
import message from "@/assets/config/MessageUtil";
import ErrorModalUtil from "@/assets/config/ErrorModalUtil";
import MappingUtil from "@/assets/config/MappingUtil";
import MomentUtil from "@/assets/config/MomentUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { FblFilterBuilder, FblDataGrid ,TaskSettingForm, HiddenFolde}
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

  /** 表單欄位 */
  testForm = {
    taskId: "",      //電訪項目代碼
    taskName: "",    //電訪項目名稱
    businessType: "" //業務別
  };

  // data grid
  public masterGrid: FblPDataGridHolder<TaskSettingDto> = {
    rowKey: "taskId",
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
        property: "coreSystemCode",
        title: "主機對應代碼",
        sorter: true
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
        title: "電訪項目名稱",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "taskTypeCode",
        title: "類型",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.getSeletedList("taskTypeCode", data.taskTypeCode);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "businessType",
        title: "業務別",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
            return MappingUtil.getSeletedList("businessType", data.businessType);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "lawReason",
        title: "法源/內控依據",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "respDepart",
        title: "權責部門",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
            return MappingUtil.getSeletedList("respDepart", data.respDepart);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "priority",
        title: "電訪項目優先序",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "callKeypoint",
        title: "電訪重點",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "executeTime",
        title: "執行時機",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
            return MappingUtil.getSeletedList("executeTime", data.executeTime);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "callLimit",
        title: "電訪期限",
        sorter: true
      },
      {
        type: FblColumnType.PLAIN,
        property: "callFreqDayVisit",
        title: "電訪頻率"
      },
      {
        type: FblColumnType.PLAIN,
        property: "caseReopen",
        title: "案件重啟",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.caseReopen);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "realTimeType",
        title: "即時電訪",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.realTimeType);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "batchLetter",
        title: "批次產信",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.batchLetter);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "messageNotice",
        title: "M+/PUSH/EMAIL/簡訊通知",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.messageNotice);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "callChange",
        title: "電話變更",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.callChange);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "firstLine",
        title: "第一線核保",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          return MappingUtil.yesNo(data.firstLine);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "costSetting",
        title: "費用分攤設定",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
            return MappingUtil.getSeletedList("costSetting", data.costSetting);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "taskStartDate",
        title: "項目執行期間起日",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          if(data.taskStartDate)
            return MomentUtil.transformRocYearMonthDay(data.taskStartDate);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "taskEndDate",
        title: "項目執行期間迄日",
        sorter: true,
        formatter: (data: TaskSettingDto) => {
          if(data.taskEndDate)
            return MomentUtil.transformRocYearMonthDay(data.taskEndDate);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "lastImportTime",
        title: "最後匯入時間",
        sorter: true
      }
    ]
  };

  // form modal
  formVisible = false;
  formTitle = "";

  // misc
  masterInspected: TaskSettingDto = null;
  masterEditing: TaskSettingDto = null;

  //欄位檢核
  taskIdValid = new validation();
  formRules: { [key: string]: ValidationRule[] } = {
    taskId: [{validator:this.validationTaskId, trigger:"blur" }]
  };

  /** 是否可執行Excel匯出 */
  isCanExport: boolean = false;

  /** Excel匯出上限訊息 */
  overMaxRowMsg: string = "";
  
  /** 業務別類型下拉選單 */
  selectBusinessTypeOptions:Option[] = [];

  created() {
    //取得業務別類型下拉選單
    this.$commonApi.findByTypeIdUsingGET("businessType")
    .then((res:AxiosResponse<Option[]>) => {
      this.selectBusinessTypeOptions = res.data;
      this.selectBusinessTypeOptions.splice(0, 0, {label: "全部", value: "" });
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

  onMasterInspectClick(row: FblRow<TaskSettingDto>) {
    this.masterInspected = row.data;
  }

  onMasterActionClick(e: FblActionEvent<TaskSettingDto>) {
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

    this.$taskSettingApi.paginateTaskSettingUsingGET(
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

  /** 開起Form窗(新增) */
  createAddModal() {
    this.formTitle = "新增設定";
    this.masterEditing = {};
    this.formVisible = true;
  }
  
  /** 開起Form窗(修改) */
  createEditModal(data: TaskSettingDto) {
    this.formTitle = "修改設定";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  /** 呼叫TaskSettingForm的submit */
  async onFormSubmit(){
    await new Promise((resolve, reject) => (this.$refs.taskSettingForm as any).submit());
  }

  /** 開關TaskSettingForm 並 更新列表*/
  onFormCallBack(val){
    this.formVisible = val;
    this.reloadMaster();
  }

  createDeleteModal(data: TaskSettingDto) {
    Modal.confirm({
      title: "刪除",
      okText: "確認",
      cancelText: "取消",
      content: `確定要刪除 ${data.taskId} 電訪項目設定嗎?`,
      centered: true,
      onOk: () => {
        this.isLoading = true;
        this.$taskSettingApi.deleteByTaskIdUsingDELETE(data.taskId)
          .then((resp) => {
            message.messageSuccess("刪除成功", true);
            this.reloadMaster();
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

  /** 查詢表單(條件)異動 */
  onSearchFormChange(){
    this.isCanExport = false;
  }

  /** 查詢 */
  clickQuery(): void{
    //欄位檢核
    let vaild = true;
    this.validationTaskId(null, this.testForm.taskId, () => {
      if(this.taskIdValid.state == "error") vaild = false;
    });
    if(!vaild) return;

    //塞入查詢條件
    const taskId = FiltersUtil.setFilterParam("taskId", FblOperator.EQ, this.testForm.taskId);
    const taskName = FiltersUtil.setFilterParam("taskName", FblOperator.CONTAINS, this.testForm.taskName);
    const businessType = FiltersUtil.setFilterParam("businessType", FblOperator.EQ, this.testForm.businessType);

    //整理為Filters
    let filters = FiltersUtil.setFilters(businessType);
    const filter = JSON.stringify(filters);

    //不分大小寫Filters
    let ignoreFilters = FiltersUtil.setFilters(taskId, taskName);
    const ignoreFilter = JSON.stringify(ignoreFilters);

    //儲存目前搜尋條件(for 排序、reload用)
    this.filterHolder.filters = filters;
    this.filterHolder.ignoreFilters = ignoreFilters;

    //列表回到第一頁
    this.masterGrid.pagination.current = 1;

    this.isLoading = true;
    this.$taskSettingApi.paginateTaskSettingUsingGET(
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
    this.$taskSettingApi.excelTaskExportUsingGET(filter, ignoreFilter, { responseType: 'blob' })
    .then((resp) => {
      this.dealDownLoadData(resp.data, "電訪項目設定.xlsx");
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

  /** 清除搜尋紀錄 */
  resetForm(){
    //清除檢核訊息
    this.taskIdValid.reset();
    
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

  /** 檢核電訪項目代碼 - 僅可輸入英數字 */
  validationTaskId(rule, value, callback){
    this.taskIdValid.reset();

    if( value != "" && !validationUtil.taskIdValidation(value) ){
      this.taskIdValid.msg = "電訪項目代碼僅可輸入英數字及【-】符號";
    }

    if(this.taskIdValid.msg != ""){
      this.taskIdValid.setError();
      callback(() => { });
    }

    callback();
  }
}