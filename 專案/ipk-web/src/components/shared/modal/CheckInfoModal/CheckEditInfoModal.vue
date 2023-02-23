<template>
  <a-modal
    v-model="checkInfoModalVisible"
    title="檢視"
    :maskClosable="false"
    :keyboard="false"
    :width="'40%'"
    :after-close="closeCheckEditInfoModal"
    :body-style="{ maxHeight: '450px', overflow: 'hidden', overflowY: 'scroll'}"
    :destroyOnClose="true"
  >
    <div>
      <div class="modal__body">
        <slot :name="'noCompareColumn'" />
        <a-row>
          <a-col :span="12" class="beforeWrap">
            <div class="form__title">
              修改前
            </div>
            <a-form-model
              layout="vertical"
              :model="checkInfoBeforeForm"
            >
              <a-row type="flex" :wrap="true">
                <a-col
                  v-for="(item,key,index) in checkInfoBeforeForm"
                  :key="index"
                  :span="24"
                >
                  <a-form-model-item
                    v-if="!isEmpty(item.type) && item.type !== 'action' && item.type !== 'file'"
                    :prop="key"
                  >
                    <label class="form__label">{{ item.label }}
                      <span v-if="item.message !== null" class="font_12 afterEditInfo">
                        {{ item.message }}
                      </span>
                    </label>
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
                  <div v-if="item.type === 'file'">
                    <label class="form__label">{{ item.label }}</label>
                    <slot :name="'fileBeforeData'" />
                  </div>
                </a-col>
              </a-row>
            </a-form-model>
          </a-col>
          <a-col :span="12" class="afterWrap">
            <div class="form__title">
              修改後
            </div>
            <a-form-model
              layout="vertical"
              :model="checkInfoAfterForm"
            >
              <a-row type="flex" :wrap="true">
                <a-col
                  v-for="(item,key,index) in checkInfoAfterForm"
                  :key="index"
                  :span="24"
                >
                  <a-form-model-item
                    v-if="!isEmpty(item.type) && item.type !== 'action' && item.type !== 'file'"
                    :prop="key"
                  >
                    <label class="form__label">{{ item.label }}</label>
                    <a-input
                      v-if="item.type === 'badge'"
                      class="checkInfo__input"
                      :class="{'afterEditInfo': item.isEdit}"
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
                      :class="{'afterEditInfo': item.isEdit}"
                      :disabled="true"
                    />
                    <a-input
                      v-else
                      v-model="item.key"
                      class="checkInfo__input"
                      :class="{'afterEditInfo': item.isEdit}"
                      :disabled="true"
                    />
                  </a-form-model-item>
                  <div v-if="item.type === 'file'">
                    <label class="form__label">{{ item.label }}</label>
                    <slot :name="'fileAfterData'" />
                  </div>
                </a-col>
              </a-row>
            </a-form-model>
          </a-col>
        </a-row>
      </div>
    </div>
    <template slot="footer">
      <IpkButton
        buttonType="lightBlue"
        buttonText="關閉"
        iconType="close"
        :isAuthorize="false"
        @handleBtnEmit="closeCheckEditInfoModal"
      />
      <IpkButton
        buttonType="lightRed"
        buttonText="拒絕"
        iconType="stop"
        :buttonDisabled="isDisabled"
        :childrenTab="$childrenTab.childrenTab.PENDING_INFO_TAB.val"
        :buttonKey="$buttonKey.buttonKey.REVIEW.val"
        @handleBtnEmit="handleReject"
      />
      <IpkButton
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
</template>
<script src="./CheckEditInfoModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
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
}
.form__title {
  font-size: 20px;
  color: $COLOR-GRAY2;
  font-weight: $TEXT-BOLD;
  padding-top: 10px;
  padding-bottom: 20px;
}
.afterEditInfo {
  color: red !important;
}
.form__label {
  font-weight: $TEXT-BOLD;
  display: block;
  margin: 0;
  padding: 0 0 8px;
  line-height: 1.5;
  white-space: initial;
  text-align: left;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.font_12 {
  font-size: 12px;
}
</style>
