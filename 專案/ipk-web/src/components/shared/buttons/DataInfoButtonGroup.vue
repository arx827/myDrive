<template>
  <!-- 資料明細頁籤按鈕群 -->
  <div class="mb-2">
    <button
      v-if="showAddBtn"
      class="btn__main btn__main--primary me-2"
      @click="openAddAndEditModal($actEnum.constant.ADD.val, {})"
    >
      <a-icon type="plus" class="icon_margin" />
      新增
    </button>
    <button
      v-if="showUploadBtn"
      class="btn__main btn__main--lightBlue me-2"
      @click="openUploadModal"
    >
      <a-icon type="upload" class="icon_margin" />
      {{ uploadButtonName }}
    </button>
    <span @mousedown.self="e => {
      e.preventDefault()
      checkExportData()}"
    >
      <vue-excel-xlsx
        v-if="showExportBtn"
        ref="exportBtn"
        :data="exportData"
        :columns="exportColumns"
        :file-name="fileName"
        :file-type="fileType"
        :sheet-name="sheetName"
        class="btn__main btn__main--lightBlue me-2"
      >
        <a-icon type="export" class="icon_margin" />
        匯出
      </vue-excel-xlsx>
    </span>
    <!-- 開啟匯出彈窗 -->
    <button
      v-if="showExportModalBtn"
      class="btn__main btn__main--lightBlue me-2"
      @click="openCustomizationModal"
    >
      <a-icon
        type="export"
        class="icon_margin"
      />
      匯出
    </button>
  </div>
</template>

<script src="./DataInfoButtonGroup.ts" lang="ts" />
