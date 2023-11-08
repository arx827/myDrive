<template>
<a-spin :spinning = spinning>
  <div>
    <FblDataGrid
          :themeColor="'theme2'"
          :scroll="{ x: 1300, y: 300 }"
          :row-key="handleInfoGrid.rowKey"
          :columns="handleInfoGrid.columns"
          :data="handleInfoGrid.data"
          :pagination="handleInfoGrid.pagination"
          @handleEllipsisClick="handleEllipsisClick"
          @handleEllipsisMouseLeave="handleEllipsisMouseLeave"
        >
        <!-- 會辦單號 -->
        <template v-slot:infId="slotProps">
          <a v-if="slotProps.data.INF_TYPE_DESC==='通報類' 
            && slotProps.data.FILE_PATH != '' 
            && slotProps.data.FILE_PATH != null" 
            @click="onPdfOpen(slotProps.data.FILE_PATH)">
            {{ slotProps.data.INF_INFO_ID }}
          </a>
          <span v-else>{{ slotProps.data.INF_INFO_ID }}</span>
        </template>
        <!-- 照會單號 -->
        <template v-slot:notiId="slotProps">
          <a v-if="slotProps.data.FILE_PATH"
            @click="onPdfOpen(slotProps.data.FILE_PATH)">
            {{ slotProps.data.NOTI_INFO_ID }}
          </a>
          <span v-else>{{ slotProps.data.NOTI_INFO_ID }}</span>
        </template>
    </FblDataGrid>
  </div>
</a-spin>
</template>
<script src="./HandleInfoForm.ts" lang="ts"></script>