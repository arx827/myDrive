<template>
  <div class="letterValidateAbnormal_modal">
    <div class="fbl-table">
      <FblDataGrid
        :rowKey="letterValidateAbnormalGrid.rowKey"
        :columns="letterValidateAbnormalGrid.columns"
        :data="letterValidateAbnormalGrid.data"
        ref="LetterValidateAbnormalGrid"
      >
      </FblDataGrid>
    </div>
  </div>
</template>
<script src="./LetterValidateAbnormalModal.ts" lang="ts"></script>
<style lang="less">
.letterValidateAbnormal_modal {
  .fbl-table {
    // width: 50%;
    // padding-left: 24px;
    // padding-right: 12px;
    margin: 10px 0;
  }
  .dataNumBar {
    margin: 0 30px;
  }
}
</style>
