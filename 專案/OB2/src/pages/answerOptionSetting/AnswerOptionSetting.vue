<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :model="testForm"
          :label-col="{ span:8 }"
          :wrapper-col="{ span:16 }"
          style="background-color:#eef6f8;"
        >
          <a-row>
            <a-col :span="24" :sm="12" :md="8" :xl="6" :xxl="4">
              <a-form-model-item label="答案類別">
                <a-select  v-model="testForm.answerTypeCode" 
                            :placeholder="$t('select')"
                            :options="selectStatusOptions">
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="24" :sm="12" :md="8" :xl="6" :xxl="4">
              <a-form-model-item label="是否啟用">
                <a-select  v-model="testForm.answerEnable">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">啟用</a-select-option>
                  <a-select-option value="1">停用</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row type="flex" justify="center">
            <div style="margin-bottom: 16px">
              <a-space :size="24">
                <a-button type="primary" @click="clickQuery"> 查詢 </a-button>
                <a-button type="default" @click="resetForm"> 清除 </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-row>
      <a-col span="24">
        <a-button type="primary" style="margin:6px 24px;" @click="createAddModal()">
          <a-icon type="plus" />新增
        </a-button>
      </a-col>
    </a-row>

    <a-row>
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="masterGrid.rowKey"
          :columns="masterGrid.columns"
          :data="masterGrid.data"
          :pagination="masterGrid.pagination"
          :loading="isLoading"
          @tableChange="onMasterPageChange($event)"
          @inspectClick="onMasterInspectClick($event)"
          @actionClick="onMasterActionClick($event)"
        ></fbl-data-grid>
      </a-col>
    </a-row>

    <!-- 新增/修改窗 -->
    <a-modal v-model="formVisible" :title="formTitle" 
        :centered="true"
        :maskClosable="false"
        :cancelText="$t('global_cancel')"
        :okText="$t('global_ok')"
        @ok="onFormSubmit">
      <answer-option-setting-form
        :initData="masterEditing"
        :loading="isLoading"
        @formCallBack="onFormCallBack"
        ref="answerOptionSetting"
      ></answer-option-setting-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { FblFilterDataType, FblFilterHolder, FblFilters, FblOperator } from "@/components/shared/filter-builder/models";
import { Vue, Component } from "vue-property-decorator";
import { FiltersUtil } from "@/assets/config/FiltersUtil";
import { FblActionEvent, FblColumnType, FblPageEvent, FblPDataGridHolder, FblRow } from "@/components/shared/data-grid/models";
import { AnswerOptionDto, Option } from "@fubonlife/obd-api-axios-sdk";
import { AxiosResponse } from "axios";
import { Modal } from "ant-design-vue";
import MappingUtil from "@/assets/config/MappingUtil";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import AnswerOptionSettingForm from "@/components/shared/form/answerOptionSettingForm/AnswerOptionSettingForm.vue";
import message from "@/assets/config/MessageUtil";
import validationUtil, { validation } from "@/assets/config/ValidationUtil";
import HiddenFolde from "@/components/shared/hidden-tool/HiddenFolde.vue";

@Component({
  components: { FblFilterBuilder, FblDataGrid, AnswerOptionSettingForm, HiddenFolde},
})
export default class ProductPage extends Vue {
  // loading
  public isLoading: boolean = false;

  // filter
  public filterHolder: FblFilterHolder = {
    filters: {
      filters: [],
    },
    filterItems: [
      // 全部 / 單選 / 複選 / 子題單選 / 子題複選 / 子題問答單選 / 子題問答複選 / 母題單選 / 母題問答單選 / 題組 / 問答題單選 / 問答題複選
      {
        property: "answerTypeCode",
        title: "答案類別",
        dataType: FblFilterDataType.STRING,
      },
    ],
  };

  //form test
  testForm = {
    answerTypeCode:'',
    answerEnable:'',
  };
  
  // data grid
  public masterGrid: FblPDataGridHolder<AnswerOptionDto> = {
    rowKey: "answerOptionId",
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
      selector: "answerTypeCode",
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
        property: "answerTypeCode",
        title: "答案類別",
        sorter: true,
        defaultSortOrder: "ascend",
        formatter: (data: AnswerOptionDto) => {
           return MappingUtil.getSeletedList("answerTypeCode", data.answerTypeCode);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerOptionId",
        title: "答案選項代碼",
        sorter: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerOption",
        title: "答案選項",
        sorter: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerEnable",
        title: "是否啟用",
        sorter: true,
        formatter: (data: AnswerOptionDto) => {
          return MappingUtil.enableCode(data.answerEnable);
        }
      },
      {
        type: FblColumnType.PLAIN,
        property: "answerDesc",
        title: "說明",
        sorter: true,
      }
    ],
  };

  public detailGrid: FblPDataGridHolder<AnswerOptionDto> = {
    rowKey: "id",
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    columns: [
    ],
  };

  // form modal
  formVisible = false;
  formTitle = "";

  // misc
  masterInspected: AnswerOptionDto = null;
  masterEditing: AnswerOptionDto = null;
  detailFilter: FblFilters;

  selectStatusOptions:Option[] = [];
  // event
  created() {
    //取得答案類別下拉選單
    this.$commonApi.findByTypeIdUsingGET("answerTypeCode")
      .then((res:AxiosResponse<Option[]>) => {
          this.selectStatusOptions = res.data;
          this.selectStatusOptions.splice(0, 0, {label: "全部", value: "" });
      }).catch((err) => {
          console.log(err);
      });
  }

  onClean() {
    this.filterHolder.filters = { filters: [] };
    this.reloadMaster();
  }

  onMasterPageChange(e: FblPageEvent) {
    this.masterGrid.sort = e.sort;
    if(!validationUtil.isEmpty(this.masterGrid.data)){
      this.masterGrid.pagination.current = e.pagination.current;
      this.masterGrid.pagination.pageSize = e.pagination.pageSize;
      this.reloadMaster();
    }
  }

  onMasterInspectClick(row: FblRow<AnswerOptionDto>) {
    this.masterInspected = row.data;
    this.detailFilter = {
      filters: [
        {
          property: "productId",
          operator: FblOperator.EQ,
          operand: [row.data.answerOptionId],
        },
      ],
    };
    this.reloadDetail();
  }

  onMasterActionClick(e: FblActionEvent<AnswerOptionDto>) {
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

  /** 呼叫AnswerOptionSettingForm的submit */
  async onFormSubmit(){
    await new Promise((resolve, reject) => (this.$refs.answerOptionSetting as any).submit());
  }

  /** 開關answerOptionSettingFrom 並 更新列表*/
  onFormCallBack(val) {
    this.formVisible = val;
    this.reloadMaster();
  }

  onDetailPageChange(e: FblPageEvent) {
    this.detailGrid.pagination.current = e.pagination.current;
    this.detailGrid.sort = e.sort;
    this.reloadDetail();
  }

  onDetailInspectClick(row: FblRow<AnswerOptionDto>) {
    // message.info(`${row.data.name} Clicked`);
  }

  onDetailActionClick(e: FblActionEvent<AnswerOptionDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "detail":
        // message.info(`${data.name} detail...`);
        break;
      case "delete":
        // message.info(`${data.name} click delete...`);
        break;
      case "edit":
        // message.info(`${data.name} click edit...`);
        break;
    }
  }

  // methods
  reloadMaster() {
    const filter = this.filterHolder.filters
      ? JSON.stringify(this.filterHolder.filters)
      : JSON.stringify({ filters: [] });

    const sort = this.masterGrid.sort
      ? JSON.stringify([this.masterGrid.sort])
      : undefined;

    this.isLoading = true;

    this.$answerOptionApi
      .paginateAnswerOptionUsingGET(
        this.masterGrid.pagination.current - 1,
        this.masterGrid.pagination.pageSize,
        filter,
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

  reloadDetail() {
    const filter = JSON.stringify(this.detailFilter);
    const sort = this.detailGrid.sort
      ? JSON.stringify([this.detailGrid.sort])
      : undefined;
    this.isLoading = true;
    this.isLoading = false;
  }

  createAddModal() {
    this.formTitle = "新增設定";
    this.masterEditing = {};
    this.formVisible = true;
  }

  createEditModal(data: AnswerOptionDto) {
    this.formTitle = "修改設定";
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  createDeleteModal(data: AnswerOptionDto) {
    let msg = (data.answerDesc == null)? "":data.answerDesc;
    Modal.confirm({
      title: "刪除",
      okText: "確認",
      cancelText: "取消",
      content: `確定要刪除 ${msg} 答案選項設定嗎?`,
      centered: true,
      onOk: () => {
        this.isLoading = true;
        this.$answerOptionApi
          .deleteByAnswerOptionIdUsingDELETE(data.answerOptionId)
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

  clickQuery(): void {
    
    //塞入查詢條件
    const answerTypeCode = FiltersUtil.setFilterParam("answerTypeCode", FblOperator.EQ, this.testForm.answerTypeCode);
    const answerEnable = FiltersUtil.setFilterParam("answerEnable", FblOperator.EQ, this.testForm.answerEnable);
    
    //整理為Filters
    let filters = FiltersUtil.setFilters(answerTypeCode, answerEnable);
    const filter = JSON.stringify(filters);

    //儲存目前搜尋條件(for 排序、reload用)
    this.filterHolder.filters = filters;

    //列表回到第一頁
    this.masterGrid.pagination.current = 1;

    this.isLoading = true;
    this.$answerOptionApi
      .paginateAnswerOptionUsingGET(
        this.masterGrid.pagination.current - 1,
        this.masterGrid.pagination.pageSize,
        filter,
        this.masterGrid.sort
          ? JSON.stringify([this.masterGrid.sort])
          : undefined
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
  resetForm(): void {
    this.testForm.answerTypeCode = "";
    this.testForm.answerEnable = "";
    this.masterGrid.pagination.total = 0;
    this.masterGrid.data = [];
    this.filterHolder.filters = { filters: [] };
  }
}
</script>

