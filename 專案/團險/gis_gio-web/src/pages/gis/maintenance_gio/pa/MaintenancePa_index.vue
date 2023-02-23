<template>
  <div class="MaintenancePa">
    <LayoutLoading v-if="pageLoading" />
    <div
      class="main-header d-flex justify-content-between"
    >
      <h2 class="main-title">
        公告維護
      </h2>
      <button class="icon-button" @click="handleNewData">
        <img class="icon-button__img" src="~@images/button_add.svg" alt="">
      </button>
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
          <div class="d-flex">
            <button
              class="icon-button icon__edit"
              @click="handleEditData(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_edit.svg"
                alt=""
              >
            </button>
            <button
              class="icon-button icon__delete"
              @click="handleDeleteData(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_delete.svg"
                alt=""
              >
            </button>
          </div>
        </template>
      </FblDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import {
  AnnouncementQueryallDto,
} from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class MaintenancePa extends Vue {
  h = this.$createElement;

  @Action('setLoading') setLoading

  pageLoading = true;

  // data grid
  public grid: FblPDataGridHolder<AnnouncementQueryallDto> = {
    rowKey: 'rowkey',
    data: [
    ],
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
        property: 'category',
        title: '類別',
        customRender: (data) => {
          if (data.category) {
           return this.$enum.getVal('category', data.category);
          }
            return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'customer',
        title: '客戶',
        customRender: (data) => {
          if (data.customer) {
            return this.$enum.getVal('customer', data.customer);
          }
            return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'subject',
        title: '主旨',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'content',
        title: '內容',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'startDate',
        title: '發布日期',
        customRender: (data) => {
          // 轉民國年
          if (data.startDate) {
            return this.$dateTime.TWDateFormatter(data.startDate);
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'endDate',
        title: '下架日期',
        customRender: (data) => {
          // 轉民國年
          if (data.endDate) {
            return this.$dateTime.TWDateFormatter(data.endDate);
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'top',
        title: '置頂',
        customRender: (data) => {
          if (data.top) {
            return this.$enum.getVal('top', data.top);
          }
            return '';
        },
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 80,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
   * Func
   */

  getGridData() {
    this.pageLoading = true;

    // 訊息公告維護查詢
    this.$messageMaintainApi
      .findMessageQueryUsingPOST(
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
      )
      .then((resp) => {
        this.pageLoading = true;
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          getData.content.map((item, index) => item.rowkey = index + 1);
          this.grid.data = getData.content;
          this.grid.pagination.total = parseInt(getData.totalElements);
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
      this.getGridData();
    }
  }

  handleNewData() {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenancePaAddAndEdit',
      query: {
        type: 'add',
      },
    });
  }

  handleEditData({ id }) {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenancePaAddAndEdit',
      query: {
        type: 'edit',
        id,
      },
    });
  }

  handleDeleteData({ id }) {
    Modal.confirm({
      title: this.h('div', {}, '執行註銷'),
      content: '即將執行刪除此公告項目，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        this.pageLoading = true;
        this.$messageMaintainApi
          .messageDeleteUsingPOST(id)
          .then(async (resp) => {
            if (resp.status == 200) {
              await this.getGridData();
              this.$infoNotification.success({
                Content: '已完成註銷',
              });
            } else {
              this.$infoNotification.error({
                Content: '無法完成刪除項目，請再次嘗試。',
                apiError: resp.data.apiError,
              });
            }
          })
          .catch((error) => {
            this.$infoNotification.error({
              Content: '無法完成刪除項目，請再次嘗試。',
            });
          })
          .finally(() => {
            this.pageLoading = false;
          });
      },
    });
  }

  checkModal() {
    (this.$refs.reviewModalRef as any).validateCommentMsg();
  }

  /**
   * Hooks
   */
  created() {
    this.getGridData();
  }

  /**
 * 監聽
 */
}
</script>

<style lang="scss" scoped>
.header-button {
  padding: 7px;
  background-color: $ICON-BUTTON-BG-BLUE;
  color: $COLOR-WHITE;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
}

.word-button__default {
  background-color: $BUTTON-DISABLED-BG-GRAY;
  color: $BUTTON-DISABLED-COLOR-GRAY;
  letter-spacing: 1px;
  &.btn--gray {
    background: $BUTTON-BG-GRAY;
    color: $BUTTON-COLOR-WHITE;
  }
}
</style>
