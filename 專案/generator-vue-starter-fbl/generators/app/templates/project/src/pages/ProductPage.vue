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
import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import FblFilterBuilder from "@/components/shared/filter-builder/FblFilterBuilder.vue";
import FblLevelSelect from "@/components/shared/level-select/FblLevelSelect.vue";
import ProductForm from "@/forms/ProductForm.vue";
import { ProductFormModel } from "@/forms/ProductForm.vue";
import { Vue, Component } from "vue-property-decorator";
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

  // filter
  public filterHolder: FblFilterHolder = {
    filters: {
      filters: [],
    },
    filterItems: [
      {
        property: "name",
        title: "名稱",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "listPrice",
        title: "定價",
        dataType: FblFilterDataType.NUMBER,
        min: 0,
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
        enum: [ProductDtoStatusEnum.AVAILABLE, ProductDtoStatusEnum.SHORTAGE],
      },
    ],
  };

  // data grid
  public masterGrid: FblPDataGridHolder<ProductDto> = {
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
        minWidth: 200,
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
        type: FblColumnType.PLAIN,
        property: "attribute",
        title: "屬性(合併)",
        width: 100,
        rowSpanKey: (data) => {
          return data.attribute; 
        },
      },
      {
        type: FblColumnType.TAG,
        property: "status",
        title: "狀態 (Tag)",
        sorter: true,
        formatter: (data: ProductDto) => {
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
        type: FblColumnType.BADGE,
        property: "status",
        title: "狀態 (Badge)",
        sorter: true,
        formatter: (data: ProductDto) => {
          switch (data.status) {
            case "AVAILABLE":
              return "Available";
            case "SHORTAGE":
              return "Shortage";
            default:
              return null;
          }
        },
        badgeColor: (data: ProductDto) => {
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
        type: FblColumnType.TEMPLATE,
        title: "圖片",
        template: "imgTemplate",
        sorter: true,
        sortProperty: "name",
      },
      {
        type: FblColumnType.PLAIN,
        title: "負責人",
        formatter: (data: ProductDto) => data.ownerAccount.employee.name,
      },
      {
        type: FblColumnType.ACTION,
        title: "操作",
        actionButtonType: "primary",
        actions: [
          {
            name: "edit",
            title: "編輯",
            disabled: (row) => {
              return row.data.name == "iMac";
            },
          },
          {
            name: "edit1",
            title: "編輯1",
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
  onMasterPageChange(e: FblPageEvent) {
    this.masterGrid.pagination.current = e.pagination.current;
    this.masterGrid.sort = e.sort;
    this.reloadMaster();
  }
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
      case "edit1":
        e.row.data.name = "iMac";
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

  // methods
  reloadMaster() {
    const filter = this.filterHolder.filters
      ? JSON.stringify(this.filterHolder.filters)
      : JSON.stringify({ filters: [] });
    const sort = this.masterGrid.sort
      ? JSON.stringify([this.masterGrid.sort])
      : undefined;
    this.isLoading = true;
    this.$productApi
      .paginateProductUsingGET(
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
    this.isLoading = true;
    this.$productSpecApi
      .paginateProductSpecUsingGET(
        this.detailGrid.pagination.current - 1,
        this.detailGrid.pagination.pageSize,
        filter,
        sort
      )
      .then((resp) => {
        const p = { ...this.detailGrid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this.detailGrid.data = resp.data.content;
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
