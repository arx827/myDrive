/* eslint-disable vue/no-template-shadow */
<template>
  <div class="btnGroup" :style="{height: outerGridData.tableHeight}">
    <vxe-table
      class="expandTable"
      :height="outerGridData.tableHeight && !outerGridData.height ? 'auto' : outerGridData.height ? outerGridData.height : ''"
      :data="outerGridData.data"
      :expandIconAsCell="false"
      :expandIconColumnIndex="expandIconColumnIndex"
      :expand-config="outerGridData.expandConfig"
      :column-config="outerGridData.columnConfig ? outerGridData.columnConfig : { resizable: true }"
      :show-overflow="outerGridData.showOverflow ? outerGridData.showOverflow : 'ellipsis'"
      :border="outerGridData.border"
      :sort-config="outerGridData.sortConfig"
      :tree-config="outerGridData.treeConfig"
      :checkbox-config="outerGridData.checkboxConfig"
      :scroll-y="{ enabled: true, gt: 200, mode: 'wheel' }"
      :row-class-name="outerGridData.rowClassName"
      :span-method="colspanMethod"
      @sort-change="handleSortChange"
      @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxAll"
      @page-change="handlePageChange"
    >
      <!-- 外層資料 -->
      <vxe-column
        v-for="(col, index) in outerGridData.columns"
        :key="index"
        :slots="col.slots"
        :type="col.type"
        :field="col.field"
        :title="col.title"
        :fixed="col.fixed"
        :width="col.width"
        :align="col.align"
        :formatter="col.formatter"
        :sortable="col.sortable"
        :tree-node="col.treeNode"
        :show-overflow="col.showOverflow ? col.showOverflow: outerGridData.showOverflow"
      >
        <template #default="{ row, column }">
          <div v-if="col.slots === 'badge'">
            <a-badge
              :color="getBadgeObject(row[column.field]).color"
              :text="getBadgeObject(row[column.field]).key"
            />
          </div>
          <!-- 打開檢視彈窗 -->
          <div v-else-if="col.slots === 'link'">
            <a class="link__style" @click="handleCheckInfoModal(row)">
              {{ row[column.field] }}
            </a>
          </div>
          <!-- 下拉選單 -->
          <div v-else-if="col.slots === 'select'">
            <span class="buttonSpace">
              <vxe-button
                transfer
                :disabled="row.actionTypeDisabled"
              >
                <template #default>更多操作</template>
                <template #dropdowns>
                  <vxe-button
                    v-for="(option, index1) in row[column.field]"
                    :key="index1"
                    type="text"
                    @click="handleSelectChange(option.value, row)"
                  >
                    {{ option.label }}
                  </vxe-button>
                </template>
              </vxe-button>
            </span>
          </div>
          <!-- 文字 + icon -->
          <div v-else-if="col.slots === 'action'">
            <div v-if="!isEmpty(row[column.field])">
              <span class="iconSpace">
                {{ row[column.field].key }}
              </span>
              <span v-for="(item, index2) in row[column.field].icon" :key="index2">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{ item.key }}</span>
                  </template>
                  <a-icon
                    class="iconColor iconSpace"
                    :type="item.val"
                    @click="handlePendingInfo(row, item.val)"
                  />
                </a-tooltip>
              </span>
            </div>
          </div>
          <div v-else-if="!col.slots && !col.type">
            {{ plainTextOf(row, column, row[column.field]) }}
          </div>
        </template>
        <!-- 內層資料 -->
        <template #content="{ row }">
          <vxe-table
            class="parentTable"
            :data="row.parentData"
            :border="parentGridData.border"
            :show-overflow="parentGridData.showOverflow ? parentGridData.showOverflow : 'ellipsis'"
            :column-config="parentGridData.columnConfig ? parentGridData.columnConfig : { resizable: true }"
          >
            <vxe-column
              v-for="parentItem in parentGridData.columns"
              :key="parentItem.key"
              :type="parentItem.type"
              :field="parentItem.field"
              :title="parentItem.title"
              :fixed="parentItem.fixed"
              :width="parentItem.width"
              :align="parentItem.align"
              :formatter="parentItem.formatter"
              :show-overflow="parentItem.showOverflow ? parentItem.showOverflow: parentGridData.showOverflow"
            />
          </vxe-table>
          <vxe-table
            class="childrenTable"
            :data="row.childrenData"
            :border="childrenGridData.border"
            :show-overflow="childrenGridData.showOverflow ? childrenGridData.showOverflow : 'ellipsis'"
            :column-config="childrenGridData.columnConfig ? childrenGridData.columnConfig : { resizable: true }"
          >
            <vxe-column
              v-for="childrenItem in childrenGridData.columns"
              :key="childrenItem.key"
              :type="childrenItem.type"
              :field="childrenItem.field"
              :title="childrenItem.title"
              :fixed="childrenItem.fixed"
              :width="childrenItem.width"
              :align="childrenItem.align"
              :formatter="childrenItem.formatter"
              :slots="childrenItem.slots"
              :show-overflow="childrenItem.showOverflow ? childrenItem.showOverflow: childrenGridData.showOverflow"
            >
              <!-- 編輯 Input -->
              <!-- eslint-disable-next-line vue/no-template-shadow -->
              <template #default="{row, column}">
                <div v-if="childrenItem.slots && childrenItem.slots.default === 'editInput'">
                  <a-input
                    v-if="showEditFlag"
                    v-model="row[column.field]"
                    type="text"
                    placeholder="請輸入"
                    style="width:100%"
                    @change="handleEditChange(row, rowIndex, row[column.field], column.field)"
                  />
                </div>
                <div v-else-if="childrenItem.slots === 'badge'">
                  <a-badge
                    :color="getBadgeObject(row[column.field]).color"
                    :text="getBadgeObject(row[column.field]).key"
                  />
                </div>
                <!-- 打開檢視彈窗 -->
                <div v-else-if="childrenItem.slots === 'link'">
                  <a class="link__style" @click="handleCheckInfoModal(row)">
                    {{ row[column.field] }}
                  </a>
                </div>
                <!-- 下拉選單 -->
                <div v-else-if="childrenItem.slots === 'select'">
                  <span class="buttonSpace">
                    <vxe-button
                      transfer
                      :disabled="row.actionTypeDisabled"
                    >
                      <template #default>更多操作</template>
                      <template #dropdowns>
                        <vxe-button
                          v-for="(option, index1) in row[column.field]"
                          :key="index1"
                          type="text"
                          @click="handleSelectChange(option.value, row)"
                        >
                          {{ option.label }}
                        </vxe-button>
                      </template>
                    </vxe-button>
                  </span>
                </div>
                <!-- 文字 + icon -->
                <div v-else-if="childrenItem.slots === 'action'">
                  <div v-if="!isEmpty(row[column.field])">
                    <span class="iconSpace">
                      {{ row[column.field].key }}
                    </span>
                    <span v-for="(item, index2) in row[column.field].icon" :key="index2">
                      <a-tooltip placement="top">
                        <template slot="title">
                          <span>{{ item.key }}</span>
                        </template>
                        <a-icon
                          class="iconColor iconSpace"
                          :type="item.val"
                          @click="handlePendingInfo(row, item.val)"
                        />
                      </a-tooltip>
                    </span>
                  </div>
                </div>
                <div v-else-if="!childrenItem.slots && !childrenItem.type">
                  {{ plainTextOf(row, column, row[column.field]) }}
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script src="./ExpandDataGrid.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .childrenTable .vxe-body--row.row-gray {
    background-color: #fafafa;
    color: #fff;
  }

  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -6px !important;
  }
  .ant-table-placeholder {
    background: #fafafa;
    border-radius: 0;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    padding: 5px 16px;
  }
  .ant-table .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 0px;
    margin-left: 3px;
  }
  .ant-table table {
    border-radius: 0;
  }
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
  .vxe-table--render-default .vxe-cell--checkbox .vxe-checkbox--label, .vxe-table--render-default .vxe-cell--radio .vxe-radio--label {
    padding-left: unset;
  }
}
.link__style {
  text-decoration: underline;
  color: $COLOR-MAIN2;
  margin-left: 5px;
}
.iconColor {
  color: $COLOR-MAIN14;
}
</style>
