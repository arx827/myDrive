<template>
  <div class="transitionFormModal">
    <FblDataGrid
      :themeColor="'theme2'"
      :row-key="gridData.rowKey"
      :columns="gridData.columns"
      :data="gridData.data"
      :pagination="gridData.pagination"
      :empty-data="gridData.data.length <= 0"
      bordered
    >
    </FblDataGrid>
    <a-row type="flex" justify="end" class="modal__footerBar" :gutter="[10, 0]">
      <a-col>
        <!-- 儲存 -->
        <a-button type="primary" @click="onSubmit">{{ $t('transition_save') }}</a-button>
      </a-col>
      <!-- <a-col>
        <a-button type="primary" @click="onLeave">離開</a-button>
      </a-col> -->
    </a-row>
  </div>
</template>


<script src="./TransitionForm.ts" lang="ts"></script>

<style lang="less" scoped>
.header-button {
  margin-right: auto;
  padding: 6px 10px;
  background-color: @ICON-BUTTON-BG-BLUE;
  color: @COLOR-WHITE;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
  cursor: pointer;
}
.modal__footerBar {
  margin-top: 20px;
}

.transitionFormModal /deep/ .ant-table-content .ant-table-body {
  margin: 0;
}

</style>