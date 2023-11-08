<template>
  <a-spin :spinning="loading">
    <a-form-model
      ref="formRef"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-row>
        <a-col :span="6">
          <a-form-model-item id="taskId" label="電訪項目代碼-名稱">
            <a-select v-model="initData.taskId" :options="selectTaskIdNameOptions" :disabled="true"></a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="主機代碼">
            <a-input type="text" v-model="initData.coreSystemCode" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="問卷代碼">
            <a-input type="text" v-model="initData.questCode" :maxLength="20" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item label="問卷名稱">
            <a-input type="text" v-model="initData.questName" :maxLength="500" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="6">
          <a-form-model-item prop="createId" label="建立人員">
            <a-input type="text" v-model="initData.createId" :disabled="true"></a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="createDate" label="建立日期">
            <a-input type="text" v-model="initData.createDate" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateId" id="updateId" label="最後異動人員">
            <a-input type="text" v-model="initData.updateId" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>

        <a-col :span="6">
          <a-form-model-item prop="updateDate" id="updateDate" label="最後異動日期">
            <a-input type="text" v-model="initData.updateDate" :disabled="true"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-tabs type="card" v-model="itemTypeCode" @change="onTabChange">
          <a-tab-pane key="rightLetter" tab="題庫">
          </a-tab-pane>
          <a-tab-pane key="end" tab="結束語">
          </a-tab-pane>
        </a-tabs>
      </a-row>

      <div class="transferDiv">
        <a-row>
          <a-col :span="12">
            <div style="font-size:15px;"> 可設定 </div>
          </a-col>
          <a-col :span="12">
            <div style="font-size:15px; margin-left:20px"> 已設定 </div>
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
  </a-spin>
</template>
<script src="./QuestionnaireSettingForm.ts" lang="ts"></script>

<style>
  /** 頁面滾動 */
  .ant-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  /** 最後異動人員、日期標題樣式 */
  label[for=updateId], label[for=updateDate]{
    font-size: 13px;
    white-space: pre !important;
  }

  /** 電訪項目代碼-名稱標題樣式 */
  label[for=taskId]{
    padding-right: 5px;
  }
</style>

<style scoped>
  /** 欄位標題自動換行 */
  ::v-deep .ant-form-item-label > label {
    width: 100%;
    line-height: 18px;
    display: inline-block;
    white-space: pre-wrap;
  }

  /** 隱藏配置窗header */
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
  
  /** 配置窗邊框 */
  .transferDiv {
    padding: 10px;
    border: 1px solid #e8e8e8;
    border-top: 0px;
  }
</style>