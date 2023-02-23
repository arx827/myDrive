<template>
  <a-modal
    ref="modal"
    v-model="showModal"
    :title="modalTitle"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    centered
    :destroyOnClose="true"
    @cancel="closeModal('cancel')"
  >
    <div class="modal__body">
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
        :layout="'vertical'"
      >
        <a-row :gutter="[12]" justify="center">
          <a-col :span="14">
            <a-row>
              <a-col :span="24">
                <a-form-model-item prop="noticeSubject" label="標題">
                  <a-textarea
                    ref="titleInput"
                    v-model.trim="form.noticeSubject"
                    :auto-size="{ minRows: 1, maxRows: 1 }"
                    allow-clear
                    style="width: 100%"
                    placeholder="請輸入"
                    :maxLength="200"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item prop="noticeContent" label="內容">
                  <BasicTinyEditor
                    v-model="form.noticeContent"
                    @input="validateContent"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-row>
              <a-col>
                <a-form-model-item prop="selectedTemplate" label="通知樣板選擇">
                  <a-select
                    v-model="form.selectedTemplate"
                    placeholder="請選擇"
                    show-search
                    allowClear
                    @change="selectTemplate"
                  >
                    <a-select-option
                      v-for="item in templateList"
                      :key="item.noticeTemplateId"
                      :value="item.noticeTemplateId"
                    >
                      {{ item.templateName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <template slot="footer">
      <a-space>
        <IpkButton
          buttonType="lightBlue"
          buttonText="取消"
          :isAuthorize="false"
          @handleBtnEmit="closeModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="預覽"
          :isAuthorize="false"
          @handleBtnEmit="openPreviewModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="全體發送"
          :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="$buttonKey.buttonKey.SEND.val"
          @handleBtnEmit="submit"
        />
      </a-space>
    </template>
    <NoticeModal
      :modal-notice-show="showPreviewModal"
      :detail="form"
      @modalClose="closePreviewModal"
    />
  </a-modal>
</template>
<script src="./SendModal.ts" />
<style lang="scss" scoped>
::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .has-error .tox {
    // 編輯器驗證錯誤紅色外框
    border-color: #f5222d;
  }
}
</style>
