<template>
  <div tabindex="-1" @keyup.enter="taskSearch">
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :model="taskSearchForm"
          style="background-color: #eef6f8"
        >
          <a-row>
            <!-- 電訪項目 -->
            <a-col :span="5">
              <a-form-model-item
                :label="$t('dispatchManagement_taskItem')"
                prop="taskId"
                style="margin-bottom: 0px"
              >
                <a-select
                  mode="multiple"
                  v-model="taskSearchForm.taskIds"
                  :options="selectTaskOptions"
                  :filter-option="filterOption"
                  :placeholder="$t('global_all')"
                  @change="exportDisable = true"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" style="margin-top: 16px">
            <div style="margin-bottom: 16px">
              <a-space>
                <!-- 查詢 -->
                <a-button type="primary" @click="taskSearch">
                  {{ $t("global_search") }}
                </a-button>
                <!-- 清除 -->
                <a-button type="default" @click="resetTaskSearchForm">
                  {{ $t("global_clean") }}
                </a-button>
                <!-- 匯出 -->
                <a-button type="primary" @click="exportSearchResult">
                  {{ $t("global_export") }}
                </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>
    <a-row type="flex" justify="center">
      <a-col :span="23"
        ><p v-if="isTableVisible">
          {{ $t("dispatchManagement_updateTime") + updateTime }}
        </p></a-col
      ></a-row
    >
    <a-row type="flex" justify="center">
      <a-col :span="23">
        <a-table
          v-if="isTableVisible"
          :data-source="tableData"
          size="small"
          bordered
          :pagination="false"
        >
          <a-table-column
            key="key"
            :title="$t('dispatchManagement_item')"
            data-index="item"
            :width="120"
            align="center"
          />
          <a-table-column-group class="dispatch_group">
            <!-- 電訪項目 -->
            <span slot="title" class="dispatch_group">{{
              $t("dispatchManagement_taskItem")
            }}</span>
            <a-table-column
              v-for="col in tableColumnsChildren"
              :key="col.key"
              :width="col.width"
              :data-index="col.dataIndex"
              align="center"
            >
              <span slot="title">{{ col.title }}</span>
              <template slot-scope="text, record, index, event">
                <template
                  v-if="
                    !text || col.title == $t('dispatchManagement_sumantion')
                  "
                  ><p>{{ text }}</p></template
                >
                <template v-else>
                  <a
                    @click="openPendingPage(record, index, event, text, col)"
                    >{{ text }}</a
                  >
                </template>
              </template>
            </a-table-column>
          </a-table-column-group>
          <a-table-column
            key="sum"
            :title="$t('dispatchManagement_sumantion')"
            data-index="sum"
            :width="64"
            align="center"
          />
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script src="./DispatchManagementPage.ts" lang="ts"></script>

<style lang="less" scoped>
/deep/ .dispatch_group {
  .ant-table-header-column {
    justify-content: center;
    display: flex;
  }
}
</style>