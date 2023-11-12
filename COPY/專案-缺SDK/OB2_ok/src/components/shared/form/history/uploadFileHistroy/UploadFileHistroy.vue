<template>
  <div>
    <div class="upload_result__table" style="margin-top: 0.5rem">
      <FblDataGrid
        :themeColor="'theme2'"
        :scroll="{ x: 600, y: 400 }"
        :row-key="gridData.rowKey"
        :columns="gridData.columns"
        :data="gridData.data"
        :pagination="gridData.pagination"
        :empty-data="gridData.data.length <= 0"
      >
        <template v-slot:fileNameTemp="slotProps">
          <a href="#" @click="handleDownload(slotProps.data)">{{
            [slotProps.data.fileName, slotProps.data.fileExtension].join(".")
          }}</a>
        </template>
      </FblDataGrid>
    </div>
  </div>
</template>


<script src="./UploadFileHistroy.ts" lang="ts"></script>
