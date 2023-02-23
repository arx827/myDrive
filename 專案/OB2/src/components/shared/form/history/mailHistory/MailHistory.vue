<template>
<a-spin :spinning="isLoading">
   <FblDataGrid
      :themeColor="'theme2'"
      :rowKey="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      size="middle"
      @tableChange="onPageChange($event)"
      @inspectClick="onInspectClick"
    >
    </FblDataGrid>
    </a-spin>
</template>
<script src="./MailHistory.ts" lang="ts"></script>
