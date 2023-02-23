<template>
  <div class="container main-container groupPermissionsPage">
    <div class="groupPermissionsIndex">
      <LayoutLoading v-if="pageLoading" />
      <div class="main-header d-flex align-items-center">
        <h2 class="main-title">
          群組權限設定
        </h2>
        <div class="header-control__wrap ms-auto">
          <button
            class="icon-button"
            @click="gotoAddPage"
          >
            <img
              class="icon-button__img"
              src="~@images/button_add.svg"
              alt=""
            >
          </button>
        </div>
      </div>
      <div
        v-if="grid.data.length > 0"
        class="result__table"
      >
        <FblDataGrid
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :empty-data="grid.data.length <= 0"
          @tableChange="onMasterPageChange($event)"
        >
          <template v-slot:handleTemp="slotProps">
            <button
              class="icon-button icon__edit"
              @click="onEditData(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_edit.svg"
                alt=""
              >
            </button>
            <button
              class="icon-button icon__delete"
              @click="onDeleteData(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_delete.svg"
                alt=""
              >
            </button>
          </template>
        </FblDataGrid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';

import { AuthDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
  components: { FblDataGrid, LayoutLoading },
})
export default class GroupPermissions extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading

  pageLoading = true;

  // data grid
  public grid: FblPDataGridHolder<AuthDto> = {
    rowKey: 'rowkey',
    data: [],
    pagination: {
      current: 1,
      pageSize: Number(this.$global.getPageArray()[0]),
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: this.$global.getPageArray(),
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'authName',
        title: '群組名稱',
        customRender: (data) => {
          if (data.authName) {
            return this.$createElement('div', { attrs: { class: 'fw-bold' } }, `${data.authName}`);
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'authDesc',
        title: '群組描述',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 120,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
 * Func
 */
  getGrid() {
    this.pageLoading = true;
    this.$maintenanceApi
      .pageAuthUsingPOST(this.grid.pagination.current - 1, this.grid.pagination.pageSize)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          // TEST:
          // console.log(getData);
          if (getData.content.length > 0) {
            getData.content.map((item, index) => item.rowkey = index + 1);
            this.grid.data = getData.content;
            this.grid.pagination.total = parseInt(getData.totalElements);
          } else {
            this.grid.pagination.current -= 1;
            this.getGrid();
          }
        } else {
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '錯誤訊息'),
            content: this.h('ul', {
              attrs: { class: 'list-with-border' },
            }, errorMsg.map((x) => this.h('li', x))),
            okType: 'confrim',
            okText: '確定',
            icon: () =>
              this.h('i', { attrs: { class: 'icon__custom icon__error' } }),
          });
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
 * Event
 */
  // table 事件 (change page)
  onMasterPageChange(e): void{
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== e.current || p.pageSize !== e.pageSize) {
      p.current = e.current;

      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== e.pageSize) {
        p.current = 1;
      }
      p.pageSize = e.pageSize;
      this.grid.pagination = p;
      this.getGrid();
    }
  }

  gotoAddPage(): void {
    this.$global.clearParam();
    this.$router.push({ name: 'PersonnelGroupPermissionsAddAndEdit' });
  }

  onEditData({ authId }): void {
    // console.log(rowData)
    this.$global.changeRouterAndaddParam({
      toRouter: 'PersonnelGroupPermissionsAddAndEdit',
      query: {
        authId,
      },
    });
  }

  // API: 刪除
  onDeleteData({ authId, authName }): void {
    Modal.confirm({
      title: this.h('div', {}, '執行刪除'),
      content: `即將執行刪除 "${authName}" 群組，您確定要刪除嗎？`,
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        // API: 刪除
        this.pageLoading = true;
        this.$maintenanceApi
          .deleteAuthUsingDELETE(authId)
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getGrid();
              this.$infoNotification.success({
                Content: '已完成刪除',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            console.log('error = ', error);
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  /**
 * Hooks
 */
  created() {
    this.getGrid();
  }
}
</script>
