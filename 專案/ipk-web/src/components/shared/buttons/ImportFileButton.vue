<template>
  <span>
    <button
      key="export"
      class="btn__main btn__main--primary mx-0 mt-1 mb-2"
      @click="handleImportFile"
    >
      <a-icon type="export" class="icon_margin" />
      匯入
    </button>
  </span>
</template>

<script src="./ImportFileButton.ts" lang="ts" />
