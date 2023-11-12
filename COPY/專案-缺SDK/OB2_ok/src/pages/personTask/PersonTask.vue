<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :model="searchForm"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="background-color: #eef6f8"
        >
          <a-row>
            <a-col :span="7">
              <a-form-model-item label="電訪項目代碼-名稱">
                <a-select v-model="searchForm.taskId" :options="selectTaskIdNameOptions" @change="onTaskIdChange" show-search option-filter-prop="children"></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

    <a-form-model
      :model="resultForm"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      style="margin: 0px 10px;"
    >
      <a-row>
        <a-col :span="4">
          <a-form-model-item prop="createId" label="建立人員">
            <a-input type="text" v-model="resultForm.createId" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="4">
          <a-form-model-item prop="createDate" label="建立日期">
            <a-input type="text" v-model="resultForm.createDate" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateId" label="最後異動人員">
            <a-input type="text" v-model="resultForm.updateId" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateDate" label="最後異動日期">
            <a-input type="text" v-model="resultForm.updateDate" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <a-row>
      <a-col :span="12">
        <div style="font-size:15px;"> 可設定人員 </div>
      </a-col>
      <a-col :span="12">
        <div style="font-size:15px; margin-left:20px"> 已設定人員 </div>
      </a-col>
    </a-row>
    
    <a-transfer :data-source="originalTargetKeys" :target-keys="rightTargetKeys"
                :disabled="disabled" :show-search="false" :show-select-all="false"
                :list-style="{ width: '50%', height: '500px' }" 
                :filter-option="
                  (inputValue, item) => {
                    item.key.indexOf(inputValue) !== -1 ||
                    item.key.indexOf(inputValue.toUpperCase()) !== -1 ||
                    item.description.indexOf(inputValue) !== -1
                  }
                "
                @change="onTransferChange"
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
          :scroll="{ y: 430 }"
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

    <a-row type="flex" justify="center">
      <div style="margin:16px 0px;">
        <a-button type="primary" @click="submit"> 儲存 </a-button>
      </div>
    </a-row>

  </div>
</template>
<script src="./PersonTask.ts" lang="ts"></script>

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
  }
</style>