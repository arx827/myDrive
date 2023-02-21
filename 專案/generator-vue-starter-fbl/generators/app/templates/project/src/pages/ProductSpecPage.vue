<template>
  <div>
    <a-row :gutter="8">
      <a-col :span="19">
        <fbl-filter-builder
          ref="filterBuilder"
          :items="filterHolder.filterItems"
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
              reload();
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
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :loading="isLoading"
          @tableChange="onPageChange($event)"
          @inspectClick="onInspectClick($event)"
          @actionClick="onActionClick($event)"
        >
        </fbl-data-grid>
      </a-col>
    </a-row>

    <a-modal v-model="formVisible" title="表單" :footer="null">
      <product-spec-form
        :initData="editing"
        :loading="isLoading"
        @formSubmit="onFormSubmit"
        @formCancel="formVisible = false"
      ></product-spec-form>
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
  ProductDtoStatusEnum,
  ProductSpecCreation,
  ProductSpecDto,
  ProductSpecUpdates,
} from "@fubonlife/<%= code %>-api-axios-sdk";
import { message, Modal } from "ant-design-vue";
import { FblSubmitEvent } from "@/components/shared/form/models";
import ProductSpecForm from "@/forms/ProductSpecForm.vue";

@Component({ components: { FblFilterBuilder, FblDataGrid, ProductSpecForm } })
export default class ProductSpecPage extends Vue {
  // loading
  isLoading: boolean = false;

  // filter
  filterHolder: FblFilterHolder = {
    filters: {
      filters: [],
    },
    filterItems: [
      {
        property: "productId",
        title: "產品 ID",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "name",
        title: "名稱",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "quantity",
        title: "數量",
        dataType: FblFilterDataType.NUMBER,
        min: 0,
        max: 1000,
        step: 1,
      },
    ],
  };

  // data grid
  grid: FblPDataGridHolder<ProductSpecDto> = {
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
  inspected: ProductSpecDto = null;
  editing: ProductSpecDto = null;

  // event
  created() {
    this.reload();
  }
  onPageChange(e: FblPageEvent) {
    const p = { ...this.grid.pagination };
    p.current = e.pagination.current;
    this.grid.pagination.current = e.pagination.current;
    this.grid.sort = e.sort;
    this.reload();
  }
  onClean() {
    this.filterHolder.filters = { filters: [] };
    this.reload();
  }
  onInspectClick(row: FblRow<ProductSpecDto>) {
    message.info(`${row.data.name} Clicked`);
    this.inspected = row.data;
  }
  onActionClick(e: FblActionEvent<ProductSpecDto>) {
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
    e: FblSubmitEvent<ProductSpecCreation | ProductSpecUpdates, ProductSpecDto>
  ) {
    this.isLoading = true;
    if (e.isEditing) {
      this.$productSpecApi
        .updateProductSpecUsingPUT(e.initData.id, e.value)
        .then((resp) => {
          message.success(`Updated: ${resp.data.id}`);
          this.formVisible = false;
          this.reload();
        })
        .catch(console.error)
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.$productSpecApi
        .createProductSpecUsingPOST(e.value)
        .then((resp) => {
          message.success(`Created: ${resp.data.id}`);
          this.formVisible = false;
          this.reload();
        })
        .catch(console.error)
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  // methods
  reload() {
    const filter = this.filterHolder.filters
      ? JSON.stringify(this.filterHolder.filters)
      : JSON.stringify({ filters: [] });
    const sort = this.grid.sort ? JSON.stringify([this.grid.sort]) : undefined;
    this.isLoading = true;
    this.$productSpecApi
      .paginateProductSpecUsingGET(
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
        filter,
        sort
      )
      .then((resp) => {
        const p = { ...this.grid.pagination };
        p.total = parseInt(resp.data.totalElements);
        this.grid.data = resp.data.content;
        this.grid.pagination = p;
      })
      .catch(console.error)
      .finally(() => {
        this.isLoading = false;
      });
  }
  createAddModal() {
    this.editing = null;
    this.formVisible = true;
  }

  createEditModal(data: ProductSpecDto) {
    this.editing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }
  createDeleteModal(data: ProductSpecDto) {
    Modal.confirm({
      title: "刪除",
      content: `確定要刪除 ${data.name} 嗎?`,
      onOk: () => {
        this.isLoading = true;
        this.$productSpecApi
          .deleteProductSpecUsingDELETE(data.id)
          .then((resp) => {
            message.success(`Deleted: ${data.id}`);
            this.reload();
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
