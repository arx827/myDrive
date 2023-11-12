<template>
  <div>
    <a-form-model ref="subformRef" :model="subForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">

      <!-- 子題項設定純顯示窗 -->
      <div v-show="!isSubEditing">
        <template>
          <a-table :columns="showColumns.columns" :data-source="showSubItem" :rowKey="showColumns.rowKey"
                   :pagination="showColumns.pagination">
          </a-table>
        </template>
      </div>

      <!-- 子題項設定編輯窗 -->
      <div v-show="isSubEditing">
        <a-row> 
          <a-col :span="8">
            <a-form-model-item label="題目類型">
              <a-select v-model="subForm.itemTitleCode" :options="selectItemTitleOptions"></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item>
              <a-button type="primary" @click="doQuery"> 查詢 </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="12">
            <div style="font-size:15px;"> 可配置 </div>
          </a-col>
          <a-col :span="12">
            <div style="font-size:15px; margin-left:20px"> 已配置 </div>
          </a-col>
        </a-row>

        <a-transfer :data-source="originalTargetKeys" :target-keys="rightTargetKeys"
                    :disabled="disabled" :show-search="false" :show-select-all="false"
                    :list-style="{ width: '50%', height: '300px' }" 
                    :filter-option="
                      (inputValue, item) => {
                        item.key.indexOf(inputValue) !== -1 ||
                        item.key.indexOf(inputValue.toUpperCase()) !== -1 ||
                        item.description.indexOf(inputValue) !== -1
                      }
                    "
                    @change="onChange"
        >
          <template slot="children" slot-scope="{
              props: {
                direction,
                filteredItems,
                selectedKeys,
                disabled: listDisabled,
              },
              on: { itemSelectAll, itemSelect },
            }"
          >
            <a-table
              :row-selection="
                getRowSelection({
                  disabled: listDisabled,
                  selectedKeys,
                  itemSelectAll,
                  itemSelect,
                })
              "
              size="small"
              :columns="direction === 'left' ? leftColumns : rightColumns"
              :data-source="filteredItems"
              :pagination="false"
              :scroll="{ y: 230 }"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="({key, name}) => ({
                on: {
                  click: (e) => {
                    itemSelect(key, !selectedKeys.includes(key));
                  }
                }
              })"
            ></a-table>
          </template>
        </a-transfer>
      </div>

    </a-form-model>
  </div>
</template>

<script src="./QuestionBankLetterRightsSubForm.ts" lang="ts"></script>

<style scoped>
  ::v-deep .ant-transfer-list-header {
    display: none;
  }

  ::v-deep .ant-transfer-list {
    padding-top: 0px;
  }

  /** 調整 Table 間距 */
  ::v-deep .ant-table-thead > tr > th { 
    padding: 10px 5px !important;
  }

  /** 調整 Table 列高 */
  ::v-deep .ant-table-tbody > tr > td {
    height: 38px;
    padding: 5px !important;
    word-break: break-all; /* 數字,英文自動換行 */
  }
</style>