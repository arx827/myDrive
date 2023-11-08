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
      <group-form
        :initData="editing"
        :loading="isLoading"
        @formSubmit="onFormSubmit"
        @formCancel="formVisible = false"
      ></group-form>
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
import { GroupDto, PageFiltersDto } from "@fubonlife/<%= code %>-api-axios-sdk";
import { message, Modal } from "ant-design-vue";
import { FblSubmitEvent } from "@/components/shared/form/models";
import GroupForm from "@/forms/GroupForm.vue";

@Component({ components: { FblFilterBuilder, FblDataGrid, GroupForm } })
export default class GroupPage extends Vue {
  // loading
  isLoading: boolean = false;
  // filter
  filterHolder: FblFilterHolder = {
    filters: {
      filters: [],
    },
    filterItems: [
      {
        property: "id",
        title: "群組 ID",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "name",
        title: "群組 名稱",
        dataType: FblFilterDataType.STRING,
      },
      {
        property: "enabled",
        title: "群組 啟用",
        dataType: FblFilterDataType.BOOLEAN,
      },
      {
        property: "description",
        title: "群組 說明",
        dataType: FblFilterDataType.STRING,
      },
    ],
  };

  // data grid
  grid: FblPDataGridHolder<GroupDto> = {
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
        property: "id",
        title: "群組 ID",
        sorter: true,
      },
      {
        type: FblColumnType.PLAIN,
        property: "name",
        title: "群組名稱",
      },
      {
        type: FblColumnType.PLAIN,
        property: "enabled",
        title: "啟用",
      },
       {
        type: FblColumnType.PLAIN,
        property: "description",
        title: "說明",
      },
      {
        type: FblColumnType.ACTION,
        title: "操作",
        actions: [
          {
            name: "edit",
            title: "編輯",
          },
        ],
      },
    ],
  };

  // form modal
  formVisible = false;

  // misc
  inspected: GroupDto = null;
  editing: GroupDto = null;

  // event
  created() {
    this.reload();
  }
  onPageChange(e: FblPageEvent) {
    const p = { ...this.grid.pagination };
    p.current = e.pagination.current;
    this.grid.pagination = p;
    this.grid.sort = e.sort;
    this.reload();
  }
  onClean() {
    this.filterHolder.filters = { filters: [] };
    this.reload();
  }
  onActionClick(e: FblActionEvent<GroupDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "edit":
        this.createEditModal(e.row.data);
        break;
    }
  }
  onFormSubmit(
    e: FblSubmitEvent<GroupDto, GroupDto>
  ) {
    this.isLoading = true;
    if (e.isEditing) {
      this.$groupApi
      .updateGroupUsingPOST(e.value)
        .then((resp) => {
          message.success(`Updated : ${resp.data.id}`);
          this.formVisible = false;
          this.reload();
        })
        .catch(console.error)
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.$groupApi
        .createGroupUsingPUT(e.value)
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
    const pageFilters: PageFiltersDto = {
      page: this.grid.pagination.current,
      size: this.grid.pagination.pageSize,
      filters: this.filterHolder.filters,
      sort: (this.grid.sort) ? this.grid.sort.selector : null,
      order: (this.grid.sort && this.grid.sort.desc) ? "desc" : "asc"
    }      
    this.isLoading = true;
    this.$groupApi
      .paginateGroupUsingPOST(
        pageFilters
      )
      .then((resp) => {
        const p = { ...this.grid.pagination };
        p.total = parseInt(resp.data.total);
        this.grid.data = resp.data.data.content;
        this.grid.pagination = p;
      })
      .catch((error) => {
        //catch error
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  createAddModal() {
    this.editing = null;
    this.formVisible = true;
  }
  createEditModal(data: GroupDto) {
    this.editing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }
}
</script>

<style>
</style>
