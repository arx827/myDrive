<template>
  <a-card style="box-shadow: -6px 6px 10px -5px rgb(0 0 0 / 15%);">
    <div
      style="
        background-color: white;
        text-align: right;
        font-size: 14px;
        height: 32px;
        vertical-align: middle;
      "
    >
      <a style="color: #2e2e2e" @click.prevent="isDisplay = !isDisplay">篩選條件
        <a-icon :type="isDisplay ? 'down' : 'up'" style="font-size: 15px; margin: 8px 16px 8px 0px" /></a>
    </div>
    <div v-if="isDisplay">
      <slot name="hiddenArea" :color="color" />
    </div>
  </a-card>
</template>

<script src="./HiddenFolde.ts" lang="ts"></script>
