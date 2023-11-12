<template>
  <div>
    <a-row type="flex" align="top">
      <a-col>
        <label for="">資料庫連線：</label>
        <a-select class="db-select" v-model="dbSelect" :options="dbOptions">
        </a-select>
        <p style="color: red; display: inline" name="statement">
          {{ statement }}
        </p>
        <!-- <label for="" style="color: red; float: right">
          {{ tokenCountDown }}</label
        > -->
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col>
        <label for="">Script：</label>
        <a-textarea
          name="sql-script"
          id=""
          style="width: 100%"
          v-model="sqlScript"
        ></a-textarea>
        <a-button type="primary" @click="onSearch">查詢</a-button>
        <a-button type="primary" @click="exportSearchResult">匯出</a-button>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col>
        <label for="">查詢結果：</label>
        <p class="data-length">
          {{ "查詢時間：" + searchTime }}
        </p>
        <p class="data-length">
          {{ "總筆數：" + searchResultDataLength + " 筆" }}
        </p>

        <FblDataGrid
          :themeColor="'theme2'"
          :row-key="searchResultGrid.rowKey"
          :columns="searchResultGrid.columns"
          :data="searchResultGrid.data"
          :loading="isLoading"
          :pagination="searchResultGrid.pagination"
          :empty-data="searchResultGrid.data.length <= 0"
          @tableChange="onPageChange($event)"
        ></FblDataGrid>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./BackDoorSearch.ts" lang="ts"></script>

<style scoped>
app {
  width: 100%;
}
.ant-row-flex {
  margin: 30px;
}
.ant-col {
  width: 100%;
}

.db-select {
  width: 100px;
  margin: 0px 20px 0px 0px;
}

/* .ant-input[name="statement"] {
  width: 500px;
  height: 100px;
  margin-left: 20px;
} */

.ant-input {
  height: 300px;
}

.ant-btn.ant-btn-primary {
  margin: 10px;
}

.data-length {
  margin: 8px 0px 0px 16px;
}
</style>