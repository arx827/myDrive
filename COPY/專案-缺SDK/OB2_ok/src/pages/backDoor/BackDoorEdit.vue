<template>
  <div>
    <a-row type="flex" align="top">
      <a-col>
        <label for="">資料庫連線：</label>
        <a-select class="db-select" v-model="dbSelect" :options="dbOptions">
        </a-select>
        <span class="required">*</span>
        <label for="">限制執行筆數：</label>
        <a-input
          class="limit-num-input"
          v-model="limitedDataLength"
          @blur="validateLimitedDataLength"
        ></a-input>
        <label for=""> 筆</label>
        <!-- <label for="" style="color: red; float: right">
          {{ tokenCountDown }}</label
        > -->
        <p
          style="color: red; display: inline; margin-left: 20px"
          name="statement"
        >
          {{ statement }}
        </p>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col>
        <a-spin :spinning="isInsertLoading">
          <label for="">新增語法：</label>
          <a-textarea
            class="sql-insert"
            name="sql-script"
            id=""
            style="width: 100%"
            v-model="insertSqlScript"
          ></a-textarea>
          <a-button type="primary" @click="onInsert">新增</a-button>
        </a-spin>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col>
        <a-spin :spinning="isModifyLoading">
          <label for="">修改語法：</label>
          <a-textarea
            class="sql-modify"
            name="sql-script"
            id=""
            style="width: 100%"
            v-model="modifySqlScript"
          ></a-textarea>
          <a-button type="primary" @click="onModify">修改</a-button>
        </a-spin>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col>
        <a-spin :spinning="isDeleteLoading">
          <label for="">刪除語法：</label>
          <a-textarea
            class="sql-delete"
            name="sql-script"
            id=""
            style="width: 100%"
            v-model="deleteSqlScript"
          ></a-textarea>
          <a-button type="primary" @click="onDelete">刪除</a-button>
        </a-spin>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./BackDoorEdit.ts" lang="ts"></script>

<style scoped>
.ant-row-flex {
  margin: 30px;
}

.ant-col {
  width: 70%;
  margin: 0 auto;
}

.db-select {
  width: 100px;
  margin: 0px 20px 20px 0px;
}

.required {
  color: red;
}

.limit-num-input {
  width: 100px;
}

.ant-btn.ant-btn-primary {
  margin: 5px;
  float: right;
}

.sql-insert.ant-input,
.sql-modify.ant-input,
.sql-delete.ant-input {
  height: 125px;
}
</style>