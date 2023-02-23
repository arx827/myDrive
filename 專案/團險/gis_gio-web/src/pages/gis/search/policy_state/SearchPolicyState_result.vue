<template>
  <div class="SearchPolicyStateResult">
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

import { FGPPOLRQueryModel, FGPPOLRDataProcessDto } from '@fubonlife/co-giiss-api-axios-sdk';
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
export default class SearchPolicyStateResult extends Vue {
  h = this.$createElement;

  // 參數(查詢 API 用)
  resultParam: FGPPOLRQueryModel = {};

  pageLoading = false;

  // Table 內容
  public grid: FblPDataGridHolder<FGPPOLRDataProcessDto> = {
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
        property: 'policyNoSeq',
        title: '保單號碼',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'fullName',
        title: '要保單位中文名稱',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'strDate',
        title: '保險期間',
        customRender: (data) => {
          if (data.strDate && data.endDate) {
            const strDate = this.$dateTime.customTWDateFormatter(data.strDate, 'YYYY/MM/DD');
            const endDate = this.$dateTime.customTWDateFormatter(data.endDate, 'YYYY/MM/DD');
            return `${strDate}-${endDate}`;
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'cnctStat',
        title: '保單狀態',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'applReprName',
        title: '要保單位承辦人',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'admUserName',
        title: '行政人員',
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
      this.$router.push({ name: 'SearchPolicyState' });
    }
  }

  // 取得 Table 內容
  getGrid() {
    this.pageLoading = true;
    const $submit = JSON.parse(JSON.stringify(this.resultParam));
    // 【產品線】 欄位值若為「全部」，則帶 null 給後端
    // console.log($submit);
    $submit.productLine = ($submit.productLine === '0') ? null : $submit.productLine;
    $submit.userId = ($submit.userId === '0') ? null : $submit.userId;
    this.$gioDataProcessApi
      .listPolicyStatusUsingPOST($submit, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
      .then((resp) => {
        // TEST:
        // console.log(resp);
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
          this.$router.push({ name: 'SearchPolicyState' }).then(() => {
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

  updated() {
  	window.parseWord();
  }
}
</script>
