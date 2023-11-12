<template>
  <div>
    <HiddenFolde>
      <template v-slot:hiddenArea>
        <a-form-model
          :model="testForm"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          :rules="formRules"
          style="background-color:#eef6f8;"
        >
          <a-row>
            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="主機代碼" prop="coreSystemCode"
                                 :has-feedback="coreSystemValid.feedback" :validateStatus="coreSystemValid.state">
                <a-popover placement="top" v-model="coreSystemValid.hoverShow" :trigger="coreSystemValid.hover" :content="coreSystemValid.msg">
                  <a-select v-model="testForm.coreSystemCode" :options="selectCoreSystemOptions" @change="onCoreSystemChange" show-search option-filter-prop="children"></a-select>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5">
              <a-form-model-item label="段落類型" prop="itemTypeCode"
                                 :has-feedback="itemTypeValid.feedback" :validateStatus="itemTypeValid.state">
                <a-popover placement="top" v-model="itemTypeValid.hoverShow" :trigger="itemTypeValid.hover" :content="itemTypeValid.msg">
                  <a-select v-model="testForm.itemTypeCode" :options="selectItemTypeOptions" @change="onItemTypeChange"></a-select>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5" v-show="isItemsShow">
              <a-form-model-item label="題目類型" prop="itemTitleCode" 
                                 :has-feedback="itemTitleValid.feedback" :validateStatus="itemTitleValid.state">
                <a-popover v-model="isPopTitleShow" placement="top" :trigger="itemTitleValid.hover" :content="itemTitleValid.msg">
                  <a-select v-model="testForm.itemTitleCode" :options="selectItemTitleOptions"></a-select>
                </a-popover>
              </a-form-model-item>
            </a-col>

            <a-col :span="7" :xl="6" :xxl="5" v-show="isItemsShow">
              <a-form-model-item label="題目編號" prop="itemCode"
                                 :has-feedback="itemCodeValid.feedback" :validateStatus="itemCodeValid.state">
                <a-popover v-model="isPopItemShow" placement="top" :trigger="itemCodeValid.hover" :content="itemCodeValid.msg">
                  <a-input type="text" v-model="testForm.itemCode" :maxLength="20"></a-input>
                </a-popover>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row type="flex" justify="center">
            <div style="margin-bottom:16px;">
              <a-space :size="24">
                <a-button type="primary" @click="clickQuery"> 查詢 </a-button>
                <a-button type="default" @click="resetForm"> 清除 </a-button>
              </a-space>
            </div>
          </a-row>
        </a-form-model>
      </template>
    </HiddenFolde>

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

<script src="./TaskTypeSetting.ts" lang="ts"></script>

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