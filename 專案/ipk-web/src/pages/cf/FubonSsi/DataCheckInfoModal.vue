<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    title="檢視"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :destroyOnClose="true"
    @cancel="closeCheckInfoModal()"
  >
    <div class="tabline">
      <div class="modal__body">
        <a-form-model ref="formRef" :model="oriForm" :layout="'vertical'">
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="custodianBankCode" label="保管機構">
                <a-input
                  v-model="oriForm.custodianBankCode"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="currency" label="幣別">
                <a-input
                  v-model="oriForm.currency"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="type" label="使用類別">
                <a-input
                  v-model="oriForm.type"
                  class="checkInfo__input"
                  disabled
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <a-tabs
          v-model="activeKey"
          hide-add
          type="editable-card"
        >
          <!-- 款帳號資訊 -->
          <a-tab-pane key="1" tab="款帳號資訊" :closable="false">
            <div class="m-3" :style="{ maxHeight: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === '1'">
                <DataCashPage
                  :checkInfo="checkInfo"
                  @getPendingInfoCount="getPendingInfoCount"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 券帳號資訊 -->
          <a-tab-pane key="2" tab="券帳號資訊" :closable="false">
            <div class="m-3" :style="{ maxHeight: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === '2'">
                <DataEquityPage
                  :checkInfo="checkInfo"
                  @getPendingInfoCount="getPendingInfoCount"
                />
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeCheckInfoModal"
      />
    </template>
  </a-modal>
</template>

<script src="./DataCheckInfoModal.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-tabs-nav-scroll {
    background-color: $COLOR-WHITE !important;
    box-shadow: none !important;
  }
  .ant-tabs-bar {
    margin: 0 0 5px 0;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: $COLOR-WHITE;
    border-bottom: 3px solid $COLOR-MAIN2 !important;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    background: $COLOR-WHITE;
    border: 1px solid $COLOR-WHITE;
  }
  .checkInfo__input {
    border: none;
    border-bottom: 1px solid $COLOR-GRAY13;
    border-radius: 0;
    color: $COLOR-MAIN2;
    font-size: 16px;
    padding: 0;
  }
  .ant-input[disabled] {
    background-color: transparent;
  }
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0 !important;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label, .ant-col-24.ant-form-item-label, .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
