<template>
  <TreeTransfer
    ref="transferRef"
    :from_data="fromData"
    :to_data="toData"
    :defaultProps="{label:'label'}"
    :mode="'transfer'"
    :title="title"
    :class="{'el-tree-transfer-custom-disabel-select-all': disableSelectAll}"
    height="480px"
    openAll
    @add-btn="add"
    @remove-btn="remove"
    @left-check-change="leftCheck"
    @right-check-change="rightCheck"
  >
    <template slot="content-left" slot-scope="{ node }">
      <span v-if="node.data.diff" class="diff">{{ node.label }}</span>
      <span v-else>{{ node.label }}</span>
    </template>
    <template slot="content-right" slot-scope="{ node }">
      <span v-if="node.data.diff" class="diff">{{ node.label }}</span>
      <span v-else>{{ node.label }}</span>
    </template>
  </TreeTransfer>
</template>
<script src="./ElTreeTransfer.ts" lang="ts" />
<style lang="scss">
  .el-tree-transfer-custom-disabel-select-all
  .transfer-title
  .el-checkbox {
    display: none;
  }

  .diff {
    color: red
  }
</style>
