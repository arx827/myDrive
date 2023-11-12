<template>
  <div>
   
      <FblDataGrid
        :themeColor="'theme2'"
        :rowKey="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="false"
        size="middle"
        @inspectClick="onInspectClick"
      >
      </FblDataGrid>
   
  </div>
</template>
<script src="./F2BFileForm.ts" lang="ts"></script>
