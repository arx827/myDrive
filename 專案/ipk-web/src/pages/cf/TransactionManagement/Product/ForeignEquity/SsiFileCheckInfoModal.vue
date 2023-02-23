<template>
  <div>
    <a-modal
      v-model="checkInfoModalVisible"
      :maskClosable="false"
      :keyboard="false"
      :width="'50%'"
      :after-close="closeSsiCheckInfoModal"
      :destroyOnClose="true"
    >
      <div class="btnGroup tabline">
        <a-tabs v-model="activeKey" hide-add type="editable-card">
          <!-- 上傳附件 -->
          <a-tab-pane
            :key="$authService.attachmentTab.key"
            :tab="$authService.attachmentTab.label"
            :closable="false"
          >
            <div class="m-3" :style="{ height: '400px', overflow: 'hidden', overflowY: 'scroll'}">
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
            @handleBtnEmit="closeSsiCheckInfoModal"
          />
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script src="./SsiFileCheckInfoModal.ts" lang="ts" />

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
