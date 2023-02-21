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
      <role-form
        :initData="editing"
        :loading="isLoading"
        @formSubmit="onFormSubmit"
        @formCancel="formVisible = false"
      ></role-form>
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
import { RoleDto, RoleUpdates } from "@fubonlife/<%= code %>-api-axios-sdk";
import { message, Modal } from "ant-design-vue";
import { FblSubmitEvent } from "@/components/shared/form/models";
import RoleForm from "@/forms/RoleForm.vue";

@Component({ components: { FblFilterBuilder, FblDataGrid, RoleForm } })
export default class RolePage extends Vue {
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
        title: "角色 ID",
        dataType: FblFilterDataType.STRING,
      },
    ],
  };

  // data grid
  grid: FblPDataGridHolder<RoleDto> = {
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
        title: "角色 ID",
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
  inspected: RoleDto = null;
  editing: RoleDto = null;

  // event
  created() {
    this.reload();
  }
  onPageChange(e: FblPageEvent) {
    const p = { ...this.grid.pagination };
    p.current = e.pagination.current;
    this.grid.pagination = p;
    this.reload();
  }
  onClean() {
    this.filterHolder.filters = { filters: [] };
    this.reload();
  }
  onActionClick(e: FblActionEvent<RoleDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "edit":
        this.createEditModal(e.row.data);
        break;
    }
  }
  onFormSubmit(e: FblSubmitEvent<RoleUpdates, RoleDto>) {
    this.isLoading = true;
    if (e.isEditing) {
      this.$roleApi
        .updateRoleUsingPUT(e.initData.id, e.value)
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
      //
    }
  }

  // methods
  reload() {
    const filter = this.filterHolder.filters
      ? JSON.stringify(this.filterHolder.filters)
      : JSON.stringify({ filters: [] });
    this.isLoading = true;
    this.$roleApi
      .paginateRolesUsingGET(
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
        filter
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
  createEditModal(data: RoleDto) {
    this.editing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }
}
</script>

<style>
</style>
