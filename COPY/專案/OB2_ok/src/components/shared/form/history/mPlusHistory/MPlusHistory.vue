<template>
  <div>
    <a-spin :spinning="isLoading">
      <div class="result__table">
        <FblDataGrid
          :themeColor="'theme2'"
          :rowKey="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :scroll="grid.scroll"
          size="middle"
          @tableChange="onPageChange($event)"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
        </FblDataGrid>
      </div>
    </a-spin>
  </div>
</template>
<script src="./MPlusHistory.ts" lang="ts"></script>
