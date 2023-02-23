<template>
  <div>
    <a-modal
      v-model="checkInfoModalVisible"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :after-close="closeCheckInfoModal"
      :destroyOnClose="true"
    >
      <div class="tabline">
        <a-tabs v-model="activeKey" hide-add type="editable-card">
          <!-- 前台成交資訊 -->
          <a-tab-pane
            v-if="!isEmpty(main)"
            :key="$authService.mainTab.key"
            :tab="$authService.mainTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.mainTab.key">
                <CheckInfoForm
                  :form="main"
                  badgeKey="cfStatusEnum"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 其他成交資訊 -->
          <a-tab-pane
            v-if="!isEmpty(other)"
            :key="$authService.otherTab.key"
            :tab="$authService.otherTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.otherTab.key">
                <CheckInfoForm
                  :form="other"
                  badgeKey="cfStatusEnum"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 收付款資訊 -->
          <a-tab-pane
            v-if="!isEmpty(ssi)"
            :key="$authService.ssiTab.key"
            :tab="$authService.ssiTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.ssiTab.key">
                <MultiCheckInfoForm
                  :checkInfoFormTitle="checkInfoFormTitle"
                  :form="ssi"
                  badgeKey="cfStatusEnum"
                />
              </div>
            </div>
          </a-tab-pane>
          <!-- 上傳附件 -->
          <a-tab-pane
            :key="$authService.attachmentTab.key"
            :tab="$authService.attachmentTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '500px', overflow: 'hidden', overflowY: 'scroll'}">
              <div v-if="activeKey === $authService.attachmentTab.key">
                <div
                  v-for="(item, index) in attachment"
                  :key="index"
                  class="mt-1 download--hover"
                >
                  <a-icon type="paper-clip" class="icon_margin ms-1 download__icon" />
                  <span class="download ms-1" @click="handleDownloadAttachment(item)">
                    {{ item.attachmentName }}
                  </span>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template slot="footer">
        <div class="btnGroup tabline">
          <IpkButton
            buttonType="lightBlue"
            buttonText="關閉"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeCheckInfoModal"
          />
          <IpkButton
            buttonType="lightRed"
            buttonText="退回"
            iconType="stop"
            :childrenTab="childrenTab"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleReturn"
          />
          <IpkButton
            buttonType="primary"
            buttonText="放行"
            iconType="check"
            :childrenTab="childrenTab"
            :buttonKey="$cfButtonKey.buttonKey.MODIFY.val"
            @handleBtnEmit="handleReview"
          />
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script src="./DomesticCheckInfoModal.ts" lang="ts" />

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
}
.modal_content  {
  font-weight: $TEXT-BOLD;
  color: $COLOR-BLACK;
}
.modal_content_wrap {
  margin-left: 27px;
}

</style>
