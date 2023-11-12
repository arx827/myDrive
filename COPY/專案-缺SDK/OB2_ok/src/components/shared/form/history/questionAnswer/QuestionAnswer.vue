<template>
    <a-spin :spinning="loading">
      <a-row style="text-align: right; padding-right: 20px;">
        <p>{{createDate}}</p>
      </a-row>
      <a-form-model :label-col="{ span: 10 }" :wrapper-col="{ span: 10 }">
        <a-row>
          <FblDataGrid
            :themeColor="'theme2'"
            :rowKey="grid.rowKey"
            :columns="grid.columns"
            :data="grid.data"
            :pagination="false"
            :scroll="grid.scroll"
            size="large"
            style="margin-left: 24px; margin-right: 12px; box-shadow: 0 0 10px #0000001a;"
          >
          </FblDataGrid>
        </a-row>
      </a-form-model>
    </a-spin>
</template>
<script src="./QuestionAnswer.ts" lang="ts"></script>


<style lang="less" scoped>
  // tbody高度
  /deep/.ant-table-body {
    max-height: 400px !important;
  }

</style>