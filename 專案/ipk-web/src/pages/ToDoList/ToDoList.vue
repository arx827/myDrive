<template>
  <div class="btnGroup tabline">
    <a-row v-for="(item, index) in toDoList" :key="index">
      <a-col>
        <a-row>
          <a-col>
            <img class="todo__icon" :src="require(`@images/${item.groupIcon}_blue.svg`)">
            <span class="case__Name">{{ item.groupName }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <IpkVxeTable
              :ipkGrid="item.gridData"
              @sortChange="onSortChange($event)"
              @openCheckInfoModal="openCheckInfoModal($event)"
              @getActionType="getActionType($event)"
            />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./ToDoList.ts" lang="ts">
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-table-thead > tr > th {
    text-align: left;
    font-size: 14px;
  }
  .ant-table-tbody > tr > td {
    padding: 10px 16px !important;
  }
  .ant-table-thead > tr > th .anticon-filter, .ant-table-thead > tr > th .ant-table-filter-icon {
    position: absolute;
    right : unset;
  }
  .link__style {
    text-decoration: underline;
    color: #0093C1;
  }
}
.todo__icon {
  height:39px;
  width: 51px;
}
.case__Name {
  font-size: 16px;
  line-height: 22px;
  font-weight: $TEXT-BOLD;
}
</style>
