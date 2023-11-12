<template>
  <div>
    <a-spin :spinning="loading">
    <a-row style="text-align: left; padding-right: 20px;">
      <p>查詢條件：受理日期：{{telChangeDetailInfo.telChangeStartDate}}~{{telChangeDetailInfo.telChangeEndDate}} / 部門：{{inputData.depName}} / 科別：{{inputData.divName}} / 電訪員：{{inputData.tmrName}}
      </p>
      <p>查詢結果：共計 {{inputData.dueContactCount}} 筆</p>
    </a-row>
    <div class="result__table">
      <FblDataGrid
        :themeColor="'theme2'"
        :scroll="{ x: 1300, y: 300 }"
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        @tableChange="onPageChange($event)"
      >
      </FblDataGrid>
    </div>
    </a-spin>
  </div>
</template>

<script src="./TelChangeDetail.ts" lang="ts"></script>
