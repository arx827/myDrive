<template>
  <div class="main">
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      bordered
      rowKey="rowKey"
    >
      <span slot="reset" slot-scope="text, record">
        <a-button type="primary" @click="reset(record.functionName)"
          >重置
        </a-button>
      </span>
    </a-table>
  </div>
</template>
<script src="./BackDoorBatch.ts" lang="ts"></script>

<style scoped>
.main {
  width: 80%;
  margin: 50px auto;
}
</style>