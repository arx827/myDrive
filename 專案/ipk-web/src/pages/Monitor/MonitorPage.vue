<template>
  <div>
    <p>參數設定</p>
    <a-input v-model="executeSql" type="text" style="width: 80%" /><a-button
      style="margin-left: 10px"
      @click="callExecute()"
    >
      執行
    </a-button>
    <p>Excel下載</p>
    <a-input v-model="excelSql" type="text" style="width: 80%" /><a-button
      style="margin-left: 10px"
      @click="callExcel()"
    >
      下載
    </a-button>
    <p>資料查詢</p>
    <a-input v-model="querySql" type="text" style="width: 80%" /><a-button
      style="margin-left: 10px"
      @click="callQuery()"
    >
      查詢
    </a-button>
    <br>
    <a-input-number v-model="top" :min="1" style="width: 80px" />
    <p>Message: {{ message }}</p>
    <a-table
      :columns="columns"
      :data-source="data"
      size="middle"
      :pagination="false"
      bordered
    />
  </div>
</template>

<script src="./MonitorPage.ts" lang="ts">
</script>

<style>
</style>
