<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="result__table">
      <FblDataGrid
        :themeColor="'theme2'"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        size="middle"
        :scroll="grid.scroll"
        @inspectClick="onInspectClick"
        @handleEllipsisClick="handleEllipsisClick"
        @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
      >
      </FblDataGrid>
      </div>
    </a-spin>
  </div>
</template>
<script src="./InfRecord.ts" lang="ts"></script>
