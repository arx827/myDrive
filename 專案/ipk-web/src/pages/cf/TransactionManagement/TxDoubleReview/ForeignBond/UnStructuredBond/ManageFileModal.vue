<template>
  <a-modal
    v-model="modalManageFileShowSync"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :after-close="closeManageFileModal"
    :destroyOnClose="true"
  >
    <div class="tabline">
      <a-tabs v-model="activeKey" hide-add type="editable-card">
        <a-tab-pane v-for="tab in tabList" :key="tab.key" :tab="tab.label" :closable="false">
          <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
            <!-- 整批新增附件 -->
            <div v-show="activeKey === '0'">
              <a-form-model
                layout="vertical"
                :model="addManageFileForm"
                :rules="formRules"
              >
                <a-row :gutter="[12]" type="flex" justify="start" align="bottom" :wrap="true">
                  <a-col :span="6">
                    <a-form-model-item
                      prop="transactionDate"
                      label="交易日"
                    >
                      <a-date-picker
                        v-model="addManageFileForm.transactionDate"
                        format="YYYY/MM/DD"
                        placeholder="請輸入"
                        style="width: 100%"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="invCategoryCode"
                      label="資產類別"
                    >
                      <a-select
                        v-model="addManageFileForm.invCategoryCode"
                        placeholder="請選擇"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.invCategoryCodeOption"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="transactionType"
                      label="交易別"
                    >
                      <a-select
                        v-model="addManageFileForm.transactionType"
                        placeholder="請選擇"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.transactionType"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="bondKeeping"
                      label="債券保管"
                    >
                      <a-select
                        v-model="addManageFileForm.bondKeeping"
                        placeholder="請選擇"
                        mode="multiple"
                        :filterOption="true"
                        :maxTagCount="2"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.bondKeeping"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="txCode"
                      label="交易編號"
                    >
                      <a-input
                        v-model="addManageFileForm.txCode"
                        placeholder="請輸入"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6" :push="12" class="text-end mb-3">
                    <IpkButton
                      buttonType="primary"
                      buttonText="查詢"
                      iconType="search"
                      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
                      :buttonKey="$cfButtonKey.buttonKey.SEARCH.val"
                      @handleBtnEmit="handleSearchAddFile"
                    />
                  </a-col>
                </a-row>
              </a-form-model>
              <a-divider />
              <a-row :gutter="[18]" class="mt-3">
                <a-col :span="12">
                  <IpkVxeTable
                    ref="addIpkGrid"
                    :ipkGrid="addIpkGrid"
                    @checkboxChange="onAddCheckboxChange($event)"
                    @checkboxAll="onAddCheckboxChange($event)"
                  />
                </a-col>
                <a-col :span="12">
                  <UploadDragger
                    :fileUploadData="fileUploadData"
                    :fileList="attachmentInfo"
                    @handleChange="handleChange"
                    @deleteFile="deleteUpload"
                  />
                </a-col>
              </a-row>
            </div>
            <!-- 整批刪除附件 -->
            <div v-show="activeKey === '1'">
              <a-form-model
                layout="vertical"
                :model="deleteManageFileForm"
                :rules="formRules"
              >
                <a-row :gutter="[12]" type="flex" justify="start" align="bottom" :wrap="true">
                  <a-col :span="6">
                    <a-form-model-item
                      prop="transactionDate"
                      label="交易日"
                    >
                      <a-date-picker
                        v-model="deleteManageFileForm.transactionDate"
                        format="YYYY/MM/DD"
                        placeholder="請輸入"
                        style="width: 100%"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="invCategoryCode"
                      label="資產類別"
                    >
                      <a-select
                        v-model="deleteManageFileForm.invCategoryCode"
                        placeholder="請選擇"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.invCategoryCodeOption"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="transactionType"
                      label="交易別"
                    >
                      <a-select
                        v-model="deleteManageFileForm.transactionType"
                        placeholder="請選擇"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.transactionType"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="bondKeeping"
                      label="債券保管"
                    >
                      <a-select
                        v-model="deleteManageFileForm.bondKeeping"
                        placeholder="請選擇"
                        mode="multiple"
                        :filterOption="true"
                        :maxTagCount="2"
                        show-search
                        allow-clear
                      >
                        <a-select-option
                          v-for="(item, index) in selectorOption.bondKeeping"
                          :key="index"
                          :value="item.value"
                        >
                          {{ item.label }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item
                      prop="txCode"
                      label="交易編號"
                    >
                      <a-input
                        v-model="deleteManageFileForm.txCode"
                        placeholder="請輸入"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6" :push="12" class="text-end mb-3">
                    <IpkButton
                      buttonType="primary"
                      buttonText="查詢"
                      iconType="search"
                      :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
                      :buttonKey="$cfButtonKey.buttonKey.SEARCH.val"
                      @handleBtnEmit="handleSearchDeleteFile"
                    />
                  </a-col>
                </a-row>
              </a-form-model>
              <a-divider />
              <a-row :gutter="[18]" class="mt-3">
                <a-col :span="24">
                  <IpkVxeTable
                    ref="deleteIpkGrid"
                    :ipkGrid="deleteIpkGrid"
                    @checkboxChange="onDeleteCheckboxChange($event)"
                    @checkboxAll="onDeleteCheckboxChange($event)"
                    @openCheckInfoModal="handleDownloadAttachment($event)"
                  />
                </a-col>
              </a-row>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <div class="btnGroup tabline">
        <IpkButton
          buttonType="lightBlue"
          buttonText="清空"
          iconImg="icon__clear"
          :isAuthorize="false"
          @handleBtnEmit="resetManageFile"
        />
        <IpkButton
          buttonType="lightBlue"
          buttonText="取消"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeManageFileModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :childrenTab="$cfChildrenTab.childrenTab.NON_STRUCTURE_TAB.val"
          :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
          @handleBtnEmit="submitManageFile"
        />
      </div>
    </template>
  </a-modal>
</template>
<script src="./ManageFileModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-tabs-bar {
    margin-bottom: 0 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: $COLOR-WHITE;
    border-bottom: 3px solid $COLOR-MAIN2 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: $COLOR-WHITE;
    border: 1px solid $COLOR-WHITE;
  }
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
  .ant-modal-body {
    padding: 5px 10px;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .vxe-table--render-default .vxe-table--body-wrapper, .vxe-table--render-default .vxe-table--footer-wrapper {
    height: 350px;
    max-height: 350px;
  }
}
</style>
