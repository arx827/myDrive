<template>
  <div class="MaintenanceBusiness">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        營業類別維護
      </h2>
      <div class="header-control__wrap ms-auto">
        <button class="icon-button" @click="onAddData">
          <img class="icon-button__img" src="~@images/button_add.svg" alt="">
        </button>
      </div>
    </div>
    <div class="result__table">
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
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import { GiIngBasicDto, GiOfficerDto, GiCode } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
  components: { FblDataGrid },
})
export default class MaintenanceBusiness extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading;

  // data grid
  public grid: FblPDataGridHolder<GiCode> = {
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
        property: 'gpCode',
        title: '職災編號',
        width: 110,
      },

      {
        type: FblColumnType.PLAIN,
        property: 'gpCodeName',
        title: '營業類別',
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
  // API: 取得 table 資料
  getGrid() {
    this.setLoading(true);
    this.$maintenanceApi
      .listBusinessTypeUsingPOST(
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
      )
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
          // 查找失敗訊息
          const errorMsg = [];
          Object.values(resp.data.apiError).map((i) => {
            (i as any).map((j) => {
              errorMsg.push(j);
            });
          });
          Modal.error({
            title: this.h('div', {}, '取得營業類別資料錯誤'),
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
        this.setLoading(false);
      });
  }

  /**
   * Event
   */
  // table 事件 (change page)
  onMasterPageChange(e) {
    const $pagination = e;
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== $pagination.current || p.pageSize !== $pagination.pageSize) {
      p.current = $pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== $pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = $pagination.pageSize;
      this.grid.pagination = p;
      this.getGrid();
    }
  }

  // 新增
  onAddData() {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceBusinessAddAndEdit',
      params: { type: 'add' },
    });
  }

  // 編輯
  onEditData(rowData) {
    // TEST:
    // console.log(rowData);
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceBusinessAddAndEdit',
      params: { type: 'edit' },
      query: {
        gpCode: rowData.gpCode,
        gpCodeName: rowData.gpCodeName,
      },
    });
  }

  // API: 刪除
  onDeleteData({ gpCode }) {
    Modal.confirm({
      title: this.h('div', {}, '執行刪除'),
      content: '即將執行刪除此項營業類別，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () =>
        this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        // API: 刪除
        this.setLoading(true);
        this.$maintenanceApi
          .deleteBusinessTypeUsingDELETE(gpCode)
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getGrid();
              this.$infoNotification.success({
                Content: '已完成刪除',
              });
            } else {
              // 查找失敗訊息
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            // API失敗
            this.$infoNotification.error({
              Content: '無法完成刪除項目，請再次嘗試。',
            });
          })
          .finally(() => {
            this.setLoading(false);
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

<style lang="scss" scoped>
</style>
