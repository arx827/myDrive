<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="19">
        <fbl-filter-builder
          ref="filterBuilder"
          :items="filterHolder.filterItems"
          initProperty="name"
          initOperator="EQ"
          v-model="filterHolder.filters"
        ></fbl-filter-builder>
      </a-col>
      <a-col :span="5">
        <a-space :align="'start'">
          <a-button
            type="primary"
            icon="search"
            @click="
              $refs.filterBuilder.flush();
              reloadMaster();
            "
            >搜尋
          </a-button>
          <a-button icon="reload" @click="onClean()"> 清空條件 </a-button>
        </a-space>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col span="24">
        <a-space>
          <a-button type="primary" @click="createAddModal()">
            <a-icon type="plus" />新增
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <br />
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
        >
          <template v-slot:imgTemplate="slotProps">
            <a-avatar>
              {{ slotProps.data.name }}
            </a-avatar>
          </template>
        </fbl-data-grid>
      </a-col>
    </a-row>
    <a-divider orientation="left">
      {{
        masterInspected && masterInspected.name
          ? masterInspected.name + " 規格表"
          : ""
      }}
    </a-divider>
    <a-row>
      <a-col :span="24">
        <fbl-data-grid
          :rowKey="detailGrid.rowKey"
          :columns="detailGrid.columns"
          :data="detailGrid.data"
          :pagination="detailGrid.pagination"
          :loading="isLoading"
          @tableChange="onDetailPageChange($event)"
          @inspectClick="onDetailInspectClick($event)"
          @actionClick="onDetailActionClick($event)"
        >
        </fbl-data-grid>
      </a-col>
    </a-row>

    <a-modal v-model="formVisible" title="表單" :footer="null">
      <product-form
        :initData="masterEditing"
        :loading="isLoading"
        @formSubmit="onFormSubmit"
        @formCancel="formVisible = false"
      ></product-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
  EMPTY_FILTER,
  FblFilterDataType,
  FblFilterHolder,
  FblFilterItem,
  FblFilters,
  FblOperator,
} from "@/components/shared/filter-builder/models";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import ProductForm from "@/forms/ProductForm.vue";
import { ProductFormModel } from "@/forms/ProductForm.vue";
import { Vue, Component } from "vue-property-decorator";
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  EMPTY_PAGE,
  FblActionEvent,
  FblColumnType,
  FblPageEvent,
  FblPDataGridHolder,
  FblRow,
} from "@/components/shared/data-grid/models";
import {
  AuthApi,
  ProductCreation,
  ProductDto,
  ProductDtoStatusEnum,
  ProductSpecCreation,
  ProductSpecDto,
  ProductSpecUpdates,
  ProductUpdates,
  PageFiltersDto
} from "@fubonlife/<%= code %>-api-axios-sdk";
import { message, Modal } from "ant-design-vue";
import { FblSubmitEvent } from "@/components/shared/form/models";
import {
  FblLevelSelectHolder,
  FblLevelState,
} from "@/components/shared/level-select/models";

@Component({
  components: { FblFilterBuilder, FblDataGrid, ProductForm },
})
export default class ProductPage extends Vue {
  // loading
  public isLoading: boolean = false;

  // filter 欄位定義
  public filterHolder: FblFilterHolder = {
    filters: {        //存放輸入的篩選條件
      filters: [],
    },
    filterItems: [    //定義可選擇的篩選條件欄位
      {
        property: "name",                   //欄位ID
        title: "名稱",                      //欄位顯示名稱
        dataType: FblFilterDataType.STRING, //欄位型態
      },
      {
        property: "listPrice",
        title: "定價",
        dataType: FblFilterDataType.NUMBER,
        min: 0,                              //數字檢核
        max: 1000,
        step: 1,
      },
      {
        property: "unitCost",
        title: "成本",
        dataType: FblFilterDataType.NUMBER,
        min: 0,
        max: 1000,
        step: 1,
      },
      {
        property: "attribute",
        title: "屬性",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "status",
        title: "狀態",
        dataType: FblFilterDataType.STRING,
        enum: [ProductDtoStatusEnum.Available, ProductDtoStatusEnum.Shortage], //顯示選項
      },
    ],
  };

  // data grid 欄位定義
  public masterGrid: FblPDataGridHolder<ProductDto> = {
    //Key值欄位
    rowKey: "id",
    //資料陣列
    data: [],
    //分頁資訊物件
    pagination: {
      //當前頁
      current: 1,
      //每頁筆數
      pageSize: 20,
      //總共筆數
      total: 0,
    },
    //顯示欄位定義
    columns: [
      {
        type: FblColumnType.PLAIN,  //一般文字欄位
        property: "name",           //欄位名稱，對應DTO欄位名稱
        title: "名稱",              //顯示標題
        inspect: true,              //是否連動事件
        sorter: true,               //是否排序
        minWidth: 200,              //最小寬度(px)
      },
      {
        type: FblColumnType.PLAIN,
        property: "listPrice",
        title: "定價",
        sorter: true,
        minWidth: 200,
      },
      {
        type: FblColumnType.PLAIN,
        property: "unitCost",
        title: "成本",
        sorter: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "attribute",
        title: "屬性",
        sorter: true,
        width: 200,
      },
      {
        type: FblColumnType.TAG,             //狀態標籤型態欄位範例
        property: "status",
        title: "狀態 (Tag)",
        sorter: true,
        formatter: (data: ProductDto) => {   //標籤型態欄位格式化
          switch (data.status) {
            case "AVAILABLE":
              return "Available";
            case "SHORTAGE":
              return "Shortage";
            default:
              return null;
          }
        },
      },
      {
        type: FblColumnType.BADGE,          //狀態圖標型態欄位
        property: "status",
        title: "狀態 (Badge)",
        sorter: true,
        formatter: (data: ProductDto) => {  //圖標型態欄位字型格式化
          switch (data.status) {
            case "AVAILABLE":
              return "Available";
            case "SHORTAGE":
              return "Shortage";
            default:
              return null;
          }
        },
        badgeColor: (data: ProductDto) => {  //圖標型態欄位顏色格式化
          switch (data.status) {
            case "AVAILABLE":
              return "green";
            case "SHORTAGE":
              return "red";
            default:
              return null;
          }
        },
      },
      {
        type: FblColumnType.TEMPLATE,       //客制化型態欄位
        title: "圖片",
        template: "imgTemplate",            //template名稱
        sorter: true,
        sortProperty: "name",
      },
      {
        type: FblColumnType.PLAIN,
        title: "負責人",
        //文字可自定義格式
        formatter: (data: ProductDto) => (data.ownerAccount) ? data.ownerAccount.employee.name : "負責人A",
      },
      {
        type: FblColumnType.ACTION,              //Action按鈕型態定義
        title: "操作",
        actionButtonType: "primary",
        actions: [                               //個別按鈕定義
          {
            name: "edit",                        //按鈕名稱，以此判斷按哪個按鈕
            title: "編輯",
            disabled: (row) => {
              return row.data.name == "iMac";    //判斷disabled範例
            },
          },
          {
            name: "detail",
            title: "檢視",
          },
          {
            name: "delete",
            title: "刪除",
          },
        ],
      },
    ],
  };

  public detailGrid: FblPDataGridHolder<ProductSpecDto> = {
    rowKey: "id",
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: "name",
        title: "名稱",
        inspect: true,
        sorter: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "quantity",
        title: "數量",
        sorter: true,
      },
      {
        type: FblColumnType.ACTION,
        title: "操作",
        actions: [
          {
            name: "edit",
            title: "編輯",
          },
          {
            name: "detail",
            title: "檢視",
            more: true,
          },
          {
            name: "delete",
            title: "刪除",
            more: true,
          },
        ],
      },
    ],
  };

  // form modal
  formVisible = false;

  // misc
  masterInspected: ProductDto = null;
  masterEditing: ProductDto = null;
  detailFilter: FblFilters;

  // event
  created() {
    this.reloadMaster();
  }

  onClean() {
    this.filterHolder.filters = { filters: [] };
    this.reloadMaster();
  }
  //data grid 事件方法
  //點選排序或更改頁碼觸發事件
  onMasterPageChange(e: FblPageEvent) {
    this.masterGrid.pagination.current = e.pagination.current;
    this.masterGrid.sort = e.sort;
    this.reloadMaster();
  }
  //點選Master資料觸發Detatil事件
  onMasterInspectClick(row: FblRow<ProductDto>) {
    message.info(`${row.data.name} Clicked`);
    this.masterInspected = row.data;
    this.detailFilter = {
      filters: [
        {
          property: "productId",
          operator: FblOperator.EQ,
          operand: [row.data.id],
        },
      ],
    };
    this.reloadDetail();
  }
  //點選Master資料列中Action按鈕觸發事件
  onMasterActionClick(e: FblActionEvent<ProductDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "detail":
        message.info(`${data.name} detail...`);
        break;
      case "delete":
        this.createDeleteModal(e.row.data);
        break;
      case "edit":
        this.createEditModal(e.row.data);
        break;
    }
  }
  onFormSubmit(
    e: FblSubmitEvent<ProductCreation | ProductUpdates, ProductDto>
  ) {
    this.isLoading = true;
    if (e.isEditing) {
      this.$productApi
        .updateProductUsingPUT(e.initData.id, e.value as ProductUpdates)
        .then((resp) => {
          message.success(`Updated: ${resp.data.id}`);
          this.formVisible = false;
          this.reloadMaster();
        })
        .catch(console.error)
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.$productApi
        .createProductUsingPOST(e.value as ProductCreation)
        .then((resp) => {
          message.success(`Created: ${resp.data.id}`);
          this.formVisible = false;
          this.reloadMaster();
        })
        .catch(console.error)
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
  onDetailPageChange(e: FblPageEvent) {
    this.detailGrid.pagination.current = e.pagination.current;
    this.detailGrid.sort = e.sort;
    this.reloadDetail();
  }
  onDetailInspectClick(row: FblRow<ProductSpecDto>) {
    message.info(`${row.data.name} Clicked`);
  }

  onDetailActionClick(e: FblActionEvent<ProductSpecDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "detail":
        message.info(`${data.name} detail...`);
        break;
      case "delete":
        message.info(`${data.name} click delete...`);
        break;
      case "edit":
        message.info(`${data.name} click edit...`);
        break;
    }
  }

  // 查詢methods
  reloadMaster() {
    const filter = this.filterHolder.filters
      ? JSON.stringify(this.filterHolder.filters)
      : JSON.stringify({ filters: [] });
    const sort = this.masterGrid.sort
      ? JSON.stringify([this.masterGrid.sort])
      : undefined;
    //送出查詢前，定義PageFilter物件，將filters物件傳入
    const pageFilters: PageFiltersDto = {
      page: this.masterGrid.pagination.current,
      size: this.masterGrid.pagination.pageSize,
      filters: this.filterHolder.filters,
      sort: (this.masterGrid.sort) ? this.masterGrid.sort.selector : null,
      order: (this.masterGrid.sort && this.masterGrid.sort.desc) ? "desc" : "asc"
    }
    this.isLoading = true;
    this.$productApi
      .paginateProductUsingPOST(
        pageFilters
      )
      .then((resp) => {
        const p = { ...this.masterGrid.pagination };
        p.total = parseInt(resp.data.data.totalElements);
        this.masterGrid.data = resp.data.data.content;
        this.masterGrid.pagination = p;
      })
      .catch(console.error)
      .finally(() => {
        this.isLoading = false;
      });
  }

  reloadDetail() {
    const filter = JSON.stringify(this.detailFilter);
    const sort = this.detailGrid.sort
      ? JSON.stringify([this.detailGrid.sort])
      : undefined;
    const pageFilters: PageFiltersDto = {
      page: this.detailGrid.pagination.current,
      size: this.detailGrid.pagination.pageSize,
      filters: this.filterHolder.filters,
      sort: (this.detailGrid.sort) ? this.detailGrid.sort.selector : null,
      order: (this.detailGrid.sort && this.detailGrid.sort.desc) ? "desc" : "asc"
    }  
    this.isLoading = true;
    this.$productSpecApi
      .paginateProductSpecUsingPOST(
          pageFilters
      )
      .then((resp) => {
        const p = { ...this.detailGrid.pagination };
        p.total = parseInt(resp.data.data.totalElements);
        this.detailGrid.data = resp.data.data.content;
        this.detailGrid.pagination = p;
      })
      .catch(console.error)
      .finally(() => {
        this.isLoading = false;
      });
  }

  createAddModal() {
    this.masterEditing = null;
    this.formVisible = true;
  }

  createEditModal(data: ProductDto) {
    this.masterEditing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  createDeleteModal(data: ProductDto) {
    Modal.confirm({
      title: "刪除",
      content: `確定要刪除 ${data.name} 嗎?`,
      onOk: () => {
        this.isLoading = true;
        this.$productApi
          .deleteProductUsingDELETE(data.id)
          .then((resp) => {
            message.success(`Deleted: ${data.id}`);
            this.reloadMaster();
          })
          .catch(console.error)
          .finally(() => {
            this.isLoading = false;
          });
      },
    });
  }
}
</script>

<style>
</style>
