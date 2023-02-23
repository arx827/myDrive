<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="24">
        <IpkVxeTable
          :ipkGrid="ipkGrid"
          @sortChange="onSortChange($event)"
          @handlePageChange="handlePageChange($event)"
        />
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-form-model-item style="text-align: right" :wrapper-col="{ span: 24 }">
        <a-space>
          <a-button type="default" @click="cancel">
            關閉
          </a-button>
        </a-space>
      </a-form-model-item>
    </a-row>
  </a-spin>
</template>

<script src="./SysParamHistForm.ts" lang="ts">

</script>

<style>
</style>
