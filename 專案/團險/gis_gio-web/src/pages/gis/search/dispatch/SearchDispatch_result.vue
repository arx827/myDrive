<template>
  <div class="SearchDispatchResult">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        查詢結果
      </h2>
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
      />
    </div>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { AdmUserAssignmentStatisticsQueryModel, AdmUserAssignmentStatisticsDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class SearchDispatchResult extends Vue {
  pageLoading = false;

  // 參數(查詢 API 用)
  resultParam: AdmUserAssignmentStatisticsQueryModel = {}

  // Table 內容
  public grid: FblPDataGridHolder<AdmUserAssignmentStatisticsDto> = {
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
        property: 'admUserId',
        title: '行政人員',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admUserName',
        title: '姓名',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'policyStatistics',
        title: '負責保單件數',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'insStatistics',
        title: '被保險人總人數',
      },
    ],
  };

  /**
   * Func
   */
  // 取得前一頁傳進來的參數
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.resultParam = $query.form;
      this.getGrid();
    } else {
      // 無query則強制跳轉至查詢頁
      this.$router.push({ name: 'SearchDispatch' });
    }
  }

  // 取得 Table 內容
  getGrid() {
    this.pageLoading = true;
    this.$gioDataProcessApi
      .listAdmPolicyStatisticsUsingPOST(this.resultParam, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          if (getData.content.length > 0) {
            getData.content.map((item, index) => item.rowkey = index + 1);
            this.grid.data = getData.content;
            this.grid.pagination.total = parseInt(getData.totalElements);
          } else {
            this.grid.pagination.current -= 1;
            this.getGrid();
          }
        } else {
          this.$router.push({ name: 'SearchDispatch' }).then(() => {
            const getError = resp.data;
            this.$infoNotification.error({
              Content: '無法完成查詢項目，請再次嘗試。',
              apiError: getError.apiError,
            });
          });
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

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }
}
</script>
