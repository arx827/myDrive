<template>
<a-card style="margin: 20px 10px; padding: 0 0 0 0; box-shadow: -6px 6px 10px -5px rgb(0 0 0 / 15%);">
  <!-- <div> -->
    <!-- <a-divider style="margin: 0px"></a-divider> -->
    <div
      style="
        background-color: #eef6f8;
        text-align: right;
        font-size: 14px;
        height: 32px;
        vertical-align: middle;
      "
    >
      <a style="color: #2e2e2e" @click.prevent="isDisplay = !isDisplay"
        >{{ $t("global_filterCondition") }}
        <a-icon type="filter" style="font-size: 15px; margin: 8px 16px 8px 0px"
      /></a>
    </div>
    <div v-if="isDisplay">
      <slot name="hiddenArea" :color="color"></slot>
    </div>
  <!-- </div> -->
  </a-card>
</template>

<script src="./HiddenFolde.ts" lang="ts"></script>