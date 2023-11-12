<template>
  <div class="main">
    <h1 class="main-title">Health Check (中台)</h1>
    <h2 class="main-title">
      {{ "更新時間：" + updateTime }}
      <!-- <label for="" style="color: red; float: right">
        {{ tokenCountDown }}</label
      > -->
    </h2>
    <h3 class="sub-title">
      {{ "下次更新時間：" + updatePeriod + " 秒" }}
    </h3>
    <a-table
      :columns="columns"
      :data-source="healthStatusData"
      :pagination="false"
      bordered
      rowKey="name"
      size="small"
      :customRow="theCustomRow"
    >
      <div slot="status" slot-scope="text, record">
        <span v-if="record.success">正常</span>
        <span v-else>{{
          "異常" + "( " + record.rtnCode + " " + record.rtnMsg + " )"
        }}</span>
      </div>
    </a-table>
  </div>
</template>

<script src="./HealthCheck.ts" lang="ts"></script>

<style scoped>
.main {
  width: 80%;
  margin: 50px auto;
}
</style>
