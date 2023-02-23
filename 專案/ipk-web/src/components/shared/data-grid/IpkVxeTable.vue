<template>
  <div class="w-100" :style="{ height: ipkGrid.tableHeight }">
    <vxe-grid
      :id="ipkGrid.id"
      ref="vxeGrid"
      :data="ipkGrid.data"
      :height="ipkGrid.tableHeight && !ipkGrid.height? 'auto': ipkGrid.height? ipkGrid.height: ''"
      :maxHeight="ipkGrid.maxHeight"
      :auto-resize="ipkGrid.autoResize ? ipkGrid.autoResize : true"
      :sync-resize="ipkGrid.syncResize"
      :stripe="ipkGrid.stripe"
      :border="ipkGrid.border"
      :round="ipkGrid.round"
      :size="ipkGrid.size"
      :loading="ipkGrid.loading"
      :align="ipkGrid.align"
      :header-align="ipkGrid.headerAlign"
      :footer-align="ipkGrid.footerAlign"
      :show-header="ipkGrid.showHeader"
      :show-footer="ipkGrid.showFooter"
      :show-overflow="ipkGrid.showOverflow"
      :show-header-overflow="ipkGrid.showHeaderOverflow ? ipkGrid.showHeaderOverflow : true"
      :show-footer-overflow="ipkGrid.showFooterOverflow"
      :footer-method="ipkGrid.footerMethod"
      :merge-cells="ipkGrid.mergeCells"
      :merge-footer-items="ipkGrid.mergeFooterItems"
      :keep-source="ipkGrid.keepSource"
      :empty-text="ipkGrid.emptyText"
      :scroll-x="ipkGrid.scrollX ? ipkGrid.scrollX : { scrollToLeftOnChange: true }"
      :scroll-y="ipkGrid.scrollY ? ipkGrid.scrollY : { gt: 200, mode: 'wheel', scrollToTopOnChange: true }"
      :pager-config="ipkGrid.pagerConfig"
      :column-config="ipkGrid.columnConfig ? ipkGrid.columnConfig : { resizable: true }"
      :row-config="ipkGrid.rowConfig"
      :sort-config="ipkGrid.sortConfig"
      :filter-config="ipkGrid.filterConfig"
      :proxy-config="ipkGrid.proxyConfig"
      :expand-config="ipkGrid.expandConfig"
      :checkbox-config="ipkGrid.checkboxConfig"
      :tree-config="ipkGrid.treeConfig"
      :edit-config="ipkGrid.editConfig"
      :edit-rules="ipkGrid.editRules"
      :columns="ipkGrid.columns"
      :row-class-name="ipkGrid.rowClassName"
      :cell-class-name="ipkGrid.cellClassName"
      @sort-change="handleSortChange"
      @radio-change="handleRadioChange"
      @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxAll"
      @page-change="handlePageChange"
      @current-change="handleRowCurrentChange"
      @edit-closed="editClosedEvent"
      @edit-actived="editActivedEvent"
      @edit-disabled="editDisabledEvent"
      @valid-error="validError"
      @cell-click="cellClickEvent"
      @toggle-tree-expand="toggleTreeExpand"
    >
      <!-- 編輯 Input -->
      <template #editInput="{ row, rowIndex, column }">
        <a-input
          v-if="row.showInput && showEditFlag"
          v-model="row[column.field]"
          type="text"
          @change="handleEditChange(row, rowIndex, row[column.field], column.field)"
        />
        <span v-else>{{ row[column.field] }}</span>
      </template>
      <!-- 編輯 Input Number -->
      <template #editInputNumber="{ row, rowIndex, column }">
        <vxe-input
          v-if="row.showInput && showEditFlag"
          v-model="row[column.field]"
          align="right"
          placeholder="0"
          :type="row.inputType"
          clearable
          @change="handleEditChange(row, rowIndex, row[column.field], column.field)"
        >
          <template #prefix>
            <span>$</span>
          </template>
        </vxe-input>
        <span v-else>{{ `$${transferPrice(parseInt(row[column.field]))}` }}</span>
      </template>
      <!-- 編輯 下拉選單(單選) -->
      <template #editSelection="{ row, rowIndex, column }">
        <a-select
          v-if="row.showInput && showEditFlag"
          v-model="row[column.field]"
          :placeholder="'請選擇'"
          style="width: 100%"
          allowClear
          :labelInValue="column.params && column.params.labelInValue"
          :disabled="row.singleSelectionDisabled"
          :class="{'redWarning':!row.singleSelectionDisabled && !row[column.field] && row.showRedBorder}"
          @change="handleEditChange(row, rowIndex, row[column.field], column.field)"
        >
          <a-select-option
            v-for="option in row[column.field + 'Option']"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
        <span v-else>{{ column.params && column.params.labelInValue ? row[column.field].label : row[column.field] }}</span>
      </template>
      <!-- 編輯 下拉選單(多選) -->
      <template #editMultiSelection="{ row, rowIndex, column }">
        <a-select
          v-if="row.showInput && showEditFlag"
          ref="multiSelect"
          v-model="row[column.field]"
          mode="multiple"
          allowClear
          :labelInValue="column.params && column.params.labelInValue"
          :maxTagCount="2"
          :placeholder="'請選擇'"
          style="width: 100%"
          :disabled="row.multiSelectionDisabled"
          :class="{'redWarning':!row.multiSelectionDisabled && !row[column.field] && row.showRedBorder}"
          @change="handleEditChange(row, rowIndex, row[column.field], column.field)"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider class="dropdownRender__divider__block" />
            <div
              class="dropdownRender__block btnGroup text-left"
              @mousedown="e => e.preventDefault()"
            >
              <div class="mt-1" @click="selectALL(row, column.field, row[column.field + 'Option'])">
                <a-icon type="plus" /> 全選
              </div>
              <div class="mt-2" @click="clearALL(row, column.field)">
                <a-icon type="minus" /> 清空
              </div>
            </div>
          </div>
          <a-select-option
            v-for="(option, optionIndex) in row[column.field + 'Option']"
            :key="optionIndex"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
        <span v-else>{{ column.params && column.params.labelInValue ? row[column.field].label : row[column.field] }}</span>
      </template>
      <!-- 下載 -->
      <template #download="{ row }">
        <IpkButton
          buttonType="primary"
          buttonText="下載"
          iconType="download"
          :buttonDisabled="row.actionTypeDisabled"
          :isAuthorize="false"
          @handleBtnEmit="handleDownloadFile(row)"
        />
      </template>
      <!-- 文字 + icon -->
      <template #action="{ row, column }">
        <div v-if="!isEmpty(row[column.field])">
          <span class="iconSpace">
            {{ row[column.field].key }}
          </span>
          <span v-for="(item, index) in row[column.field].icon" :key="index">
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
      </template>
      <!-- 下拉選單 -->
      <template #select="{ row, rowIndex, column }">
        <span class="iconSpace">
          <vxe-button transfer :disabled="row.actionTypeDisabled">
            <template #default>更多操作</template>
            <template #dropdowns>
              <vxe-button
                v-for="(option, index) in row[column.field]"
                :key="index"
                type="text"
                @click="handleSelectChange(option.value, row, rowIndex)"
              >
                {{ option.label }}
              </vxe-button>
            </template>
          </vxe-button>
        </span>
      </template>
      <!-- 無文字 + 單個icon -->
      <template #actionTool="{ row, column }">
        <div v-if="!isEmpty(row[column.field])">
          <span v-for="(item, index) in row[column.field]" :key="index">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ item.key }}</span>
              </template>
              <a-icon
                class="iconSpace"
                :type="item.val"
                @click="handlePendingInfo(row, item.val)"
              />
            </a-tooltip>
          </span>
        </div>
      </template>
      <!-- 打開檢視彈窗 -->
      <template #link="{ row, column }">
        <a class="link__style" @click="handleCheckInfoModal(row)">
          {{ row[column.field] }}
        </a>
      </template>
      <!-- 操作區塊 link -->
      <template #textLink="{ row, rowIndex, column }">
        <!-- icon 設置按鈕圖標類型
             type 設置按鈕類型 primary | dashed | danger | link -->
        <a-button
          v-for="action in row.actionType"
          :key="action.value"
          :type="action.actionButtonType ? action.actionButtonType : 'link'"
          :icon="action.icon"
          :disabled="row.actionTypeDisabled"
          style="width:80%"
          @click="handleSelectChange(action.value, row, rowIndex)"
        >
          {{ column.icon ? null : action.label }}
        </a-button>
      </template>
    </vxe-grid>
  </div>
</template>
<script src="./IpkVxeTable.ts" lang="ts" />

<style lang="scss" scoped>
.tagStyle {
  color: $COLOR-WHITE;
}
.buttonSpace {
  padding-left: 4px;
}
.iconColor {
  color: $COLOR-MAIN14;
}
.announcement__title {
  color: $COLOR-MAIN2;
}
.link__style {
  text-decoration: underline;
  color: $COLOR-MAIN2;
}
::v-deep {
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
  .ant-btn {
    padding: 0;
  }
  .redWarning {
    border: 2px solid red;
    border-right-color: red !important;
  }
}
.iconSpace {
  margin: 0 5px;
}
</style>
