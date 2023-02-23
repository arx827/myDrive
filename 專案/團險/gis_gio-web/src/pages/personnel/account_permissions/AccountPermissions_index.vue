<template>
  <div class="container main-container accountPermissionsIndex">
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        團險行政人員帳號權限
      </h2>
      <div class="header-control__wrap ms-auto">
        <button
          class="icon-button"
          @click="onAddData"
        >
          <img
            class="icon-button__img"
            src="~@images/button_add.svg"
            alt=""
          >
        </button>
        <button
          v-if="grid.data.length > 0"
          class="icon-button"
          @click="onExport"
        >
          <img
            class="icon-button__img"
            src="~@images/button_download.svg"
            alt=""
          >
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
import moment from 'moment';

import { GiIngBasicDto, GiOfficerDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class AccountPermissions extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading

  // data grid
  public grid: FblPDataGridHolder<GiOfficerDto> = {
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
        property: 'admCbrc',
        title: '產品線',
        customRender: (data) => {
          if (data.admCbrc) {
            return this.$createElement('div', { attrs: { class: 'fw-bold' } }, `${data.admCbrc}`);
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admId',
        title: 'ID',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admAuth',
        title: '群組名稱',
        customRender: (data) => {
          if (data.authMaps) {
            return Object.values(data.authMaps).map((x) => this.$createElement('div', `${x}`));
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admName',
        title: '員工姓名',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admTelExt',
        title: '電話與分機',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admEmail',
        title: '電子信箱',
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
  getGrid(): void {
    this.setLoading(true);
    this.$maintenanceApi
      .listGiOfficerUsingPOST(this.grid.pagination.current - 1, this.grid.pagination.pageSize)
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
        this.setLoading(false);
      });
  }

  /**
 * Event
 */
  // table 事件 (change page)
  onMasterPageChange(e): void {
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

  // 新增
  onAddData(): void {
    this.$router.push({ name: 'PersonnelAccPermissionsAdd' });
  }

  // 匯出
  onExport(): void {
    this.setLoading(true);
    this.$maintenanceApi.exportGiOfficerUsingPOST({ responseType: 'blob' })
      .then((resp) => {
        const downloadlink: HTMLAnchorElement = document.createElement('a');
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(resp.data as unknown as Blob);
        const current = moment(new Date()).format('YYYY/MM/DD').split('/');
        const twYear = `${parseInt(current[0]) - 1911}`;
        const downloadName = `人員帳號權限檢核報表_${twYear}${current[1]}${current[2]}`;
        downloadlink.setAttribute('href', url);
        downloadlink.setAttribute('download', `${downloadName}.xlsx`);
        downloadlink.click();
        downloadlink.remove();
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 編輯
  onEditData(rowData): void {
    // TEST:
    // console.log(rowData);
    this.$global.changeRouterAndaddParam({
      toRouter: 'PersonnelAccPermissionsEdit',
      query: {
        admId: rowData.admId,
        admCbrc: rowData.admCbrc,
        authId: Object.keys(rowData.authMaps),
      },
    });
  }

  onDeleteData({ admId }): void {
    // API: 刪除
    // console.log(admId);
    Modal.confirm({
      title: this.h('div', {}, '執行刪除'),
      content: '即將執行刪除帳號權限動作，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        // API: 刪除
        this.setLoading(true);
        this.$maintenanceApi
          .deleteGiOfficerUsingDELETE(admId)
          .then(async (resp) => {
            if (resp.data.status == 200) {
              await this.getGrid();
              this.$infoNotification.success({
                Content: '已完成刪除',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
              });
            }
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

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
</style>
