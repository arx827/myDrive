<template>
  <div class="MaintenanceDoc">
    <LayoutLoading v-if="pageLoading" />
    <div
      class="main-header d-flex justify-content-between"
    >
      <h2 class="main-title">
        文件維護
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
              class="icon-button word-button__default"
              :class="{ 'btn--gray': slotProps.data.status == 0 }"
              :disabled="slotProps.data.status != 0"
              @click="handleReview(slotProps.data)"
            >
              主管核可
            </button>
            <button
              v-if="grid.data.length > 0"
              class="icon-button"
              @click="handleExport(slotProps.data)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_download.svg"
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
import { DocsetQueryDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class MaintenanceDoc extends Vue {
  h = this.$createElement;

  pageLoading = true;

  // data grid
  public grid: FblPDataGridHolder<DocsetQueryDto> = {
    rowKey: 'rowkey',
    data: [
    ],
    pagination: {
      // current: 1,
      // pageSize: 10,
      // total: 1,
      // showSizeChanger: true,
      // pageSizeOptions: ['10', '15', '20'],
      // showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'docCode',
        title: '文件代號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'docinstruction',
        title: '文件說明',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'status',
        title: '狀態',
        customRender: (data) => {
          if (data.status) {
            return this.$enum.getVal('docsetStatus', data.status);
          }
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'effDate',
        title: '生效日期',
        customRender: (data) => {
          // 轉民國年
          if (data.effDate) {
            return this.$dateTime.customTWDateFormatter(data.effDate, 'YYYY/MM/DD');
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
    this.$gioDocsetApi
      .findMarketingQueryUsingPOST()
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          getData.map((item, index) => item.rowkey = index + 1);
          this.grid.data = getData;
        }
      })
      .catch((error) => {
        // TEST:
        // console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // 覆核
  handleReview({ id }) {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceDocApproving',
      query: {
        id,
      },
    });
  }

  // 下載文件檔案
  handleExport({ id }) {
    this.pageLoading = true;
    this.$gioDocsetApi
      .downloadNasFileForDocsetUsingPOST(id, { responseType: 'blob' })
      .then((resp) => {
        if (resp.headers['content-disposition']) {
          // TEST:
          // console.log('export:', resp);
          this.$blobUtils.download((resp.data as unknown as Blob), this.$blobUtils.decodeFileName(resp));
        } else {
          this.$gioDocsetApi
          .downloadNasFileForDocsetUsingPOST(id)
          .then((resp) => {
            const errorData = JSON.parse(JSON.stringify(resp));
            if (errorData.data.status != 200) {
              const getError = errorData.data;
              this.$infoNotification.error({
                Content: '無法完成下載項目，請再次嘗試。',
                apiError: getError.apiError,
              });
            }
          });
        }
      })
      .catch((error) => {
        // TEST:
        // console.log(error);
        this.$infoNotification.error({
          Content: '無法完成下載項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  /**
   * Event
   */
  handleNewData() {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceDocAddAndEdit',
      query: null,
    });
  }

  handleEditData({ id }) {
    this.$global.changeRouterAndaddParam({
      toRouter: 'MaintenanceDocAddAndEdit',
      query: {
        id,
      },
    });
  }

  handleDeleteData({ id }) {
    Modal.confirm({
      title: this.h('div', {}, '執行註銷'),
      content: '即將執行刪除此文件項目，您確定要刪除嗎？',
      okType: 'warning',
      okText: '刪除',
      cancelText: '取消',
      icon: () => this.h('i', { attrs: { class: 'icon__custom icon__delete' } }),
      onOk: () => {
        this.pageLoading = true;
        this.$gioDocsetApi
        .docSetDeleteUsingPOST(id)
          .then(async (resp) => {
            if (resp.status == 200) {
              await this.getGridData();
              this.$infoNotification.success({
                Content: '已完成刪除',
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
