<template>
  <div>
    <a-modal
      v-model="checkInfoModalVisible"
      title="檢視"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :after-close="closeCheckInfoModal"
      :body-style="{ maxHeight: '450px', overflow: 'hidden', overflowY: 'scroll'}"
      :destroyOnClose="true"
    >
      <div>
        <div class="modal__body">
          <slot :name="'noCompareColumn'" />
          <a-form-model
            layout="vertical"
            :model="checkInfoForm"
          >
            <a-row :gutter="[12]" type="flex" :wrap="true">
              <a-col
                v-for="(item,key,index) in checkInfoForm"
                :key="index"
                :span="6"
              >
                <a-form-model-item
                  v-if="!isEmpty(item.type) && item.type !== 'action'"
                  :prop="key"
                  :label="item.label"
                >
                  <a-input
                    v-if="item.type === 'badge'"
                    class="checkInfo__input"
                    :disabled="true"
                  >
                    <a-badge
                      v-if="!isEmpty(item.key)"
                      slot="prefix"
                      :color="item.key.color"
                      :text="item.key.key"
                    />
                  </a-input>
                  <a-textarea
                    v-else-if="item.type === 'textarea'"
                    v-model="item.key"
                    class="checkInfo__input"
                    rows="1"
                    :disabled="true"
                  />
                  <a-input
                    v-else
                    v-model="item.key"
                    class="checkInfo__input"
                    :disabled="true"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
          <IpkVxeTable
            v-if="codeTableShow"
            :ipkGrid="ipkGrid"
          />
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
        <!-- 資料明細與待放行頁籤共用檢視彈窗，放行/拒絕為待放行頁籤功能。 -->
        <IpkButton
          v-if="isPending"
          buttonType="lightRed"
          buttonText="拒絕"
          iconType="stop"
          :buttonDisabled="isDisabled"
          :childrenTab="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
          :buttonKey="$buttonKey.buttonKey.REVIEW.val"
          @handleBtnEmit="handleReject"
        />
        <IpkButton
          v-if="isPending"
          buttonType="primary"
          buttonText="放行"
          iconType="check"
          :buttonDisabled="isDisabled"
          :childrenTab="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
          :buttonKey="$buttonKey.buttonKey.REVIEW.val"
          @handleBtnEmit="handleReview"
        />
      </template>
    </a-modal>
  </div>
</template>
<script src="./CheckInfoModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
  .ant-input {
    border: none;
    border-radius: 0px;
    resize: none;
    cursor: default;
  }
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-divider-horizontal {
    margin: 0;
  }
  .ant-form-vertical .ant-form-item-label, .ant-col-24.ant-form-item-label, .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .ant-input[disabled] {
    background-color: transparent;
  }
  .checkInfo__input {
    border: none;
    border-bottom: 1px solid $COLOR-GRAY13;
    border-radius: 0;
    color: $COLOR-MAIN2;
    font-size: 16px;
    padding: 0;
  }
  .checkInfo__textarea {
    height: 32px !important;
    min-height: 32px !important;
    max-height: 32px !important;
    margin-top: 1px;
    padding-top: 4px;
  }
  .ant-badge-status-text {
    color: $COLOR-MAIN2;
    font-size: 16px;
  }
  .ant-badge-status-dot {
    width: 12px;
    height: 12px;
  }
  .ant-input-affix-wrapper .ant-input-prefix {
    left: 0px;
  }
}
</style>
