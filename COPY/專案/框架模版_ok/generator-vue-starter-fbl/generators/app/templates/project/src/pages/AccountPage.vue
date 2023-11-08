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
          <template v-slot:switchTemplate="slotProps">
            <a-switch v-model="slotProps.data.enabled" readonly="true"></a-switch>
          </template>
        </fbl-data-grid>
      </a-col>
    </a-row>

    <a-modal v-model="formVisible" title="表單" :footer="null">
      <account-form
        :initData="editing"
        :loading="isLoading"
        @formSubmit="onFormSubmit"
        @formCancel="formVisible = false"
      ></account-form>
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
import { AccountDto, AccountCreation, AccountUpdates, PageFiltersDto} from "@fubonlife/<%= code %>-api-axios-sdk";
import { message, Modal } from "ant-design-vue";
import { FblSubmitEvent } from "@/components/shared/form/models";
import AccountForm from "@/forms/AccountForm.vue";

@Component({ components: { FblFilterBuilder, FblDataGrid, AccountForm } })
export default class AccountPage extends Vue {
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
        title: "帳號 ID",
        dataType: FblFilterDataType.STRING,
      },
    ],
  };

  // data grid
  grid: FblPDataGridHolder<AccountDto> = {
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
        title: "帳號 ID",
      },
      {
        type: FblColumnType.PLAIN,
        property: "employeeId",
        title: "員工編號",
      },
      {
        type: FblColumnType.PLAIN,
        property: "employee.name",
        title: "員工姓名",
      },
      {
        type: FblColumnType.PLAIN,
        property: "enabled",
        title: "啟用",
      },
      {
        type: FblColumnType.TEMPLATE,
        title: "啟用",
        template: "switchTemplate",
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
  inspected: AccountDto = null;
  editing: AccountDto = null;

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
  onActionClick(e: FblActionEvent<AccountDto>) {
    const data = e.row.data;
    switch (e.action.name) {
      case "edit":
        this.createEditModal(e.row.data);
        break;
    }
  }
  onFormSubmit(
    e: FblSubmitEvent<AccountCreation | AccountUpdates, AccountDto>
  ) {
    this.isLoading = true;
    if (e.isEditing) {
      this.$accountApi
      .updateAccountUsingPOST(e.value)
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
      this.$accountApi
        .createEmployeeUserUsingPOST(e.value)
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
    this.$accountApi
      .paginateAccountUsingPOST(
        pageFilters
      )
      .then((resp) => {
        const p = { ...this.grid.pagination };
        p.total = parseInt(resp.data.total);
        this.grid.data = resp.data.data.content;
        this.grid.pagination = p;
        alert(resp.status);
      })
      .catch((error) => {
        //this.handleError(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createAddModal() {
    this.editing = null;
    this.formVisible = true;
  }

  createEditModal(data: AccountDto) {
    this.editing = JSON.parse(JSON.stringify(data));
    this.formVisible = true;
  }

  signOut() {
    this.$user.signOut();
    this.$router.replace({ path: "/login" });
  }

  
}
</script>

<style>
</style>
