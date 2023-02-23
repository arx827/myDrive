<template>
  <div>
    <a-modal
      ref="modal"
      v-model="showModal"
      :title="modalTitle"
      :maskClosable="false"
      :keyboard="false"
      :width="'70%'"
      :destroyOnClose="true"
      @cancel="closeAddAndEditModal('cancel')"
    >
      <div class="modal__body">
        <a-form-model
          ref="formRef"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="24">
              <a-form-model-item prop="templateName" label="版型名稱">
                <a-textarea
                  v-model.trim="form.templateName"
                  :auto-size="{ minRows: 1, maxRows: 1 }"
                  allow-clear
                  style="width: 100%;"
                  placeholder="請輸入"
                  :maxLength="50"
                  @focus="detectFocus('')"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]">
            <a-col :span="14">
              <a-row>
                <a-col :span="24">
                  <a-form-model-item prop="noticeSubject" label="標題">
                    <a-textarea
                      ref="titleInput"
                      v-model.trim="form.noticeSubject"
                      :auto-size="{ minRows: 1, maxRows: 1 }"
                      allow-clear
                      style="width: 100%;"
                      placeholder="請輸入"
                      :maxLength="200"
                      @focus="detectFocus($settingsEnum.columns.TITLE.value)"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item prop="noticeContent" label="內容">
                    <BasicTinyEditor
                      v-model="form.noticeContent"
                      @input="validateContent"
                      @focus="detectFocus($settingsEnum.columns.CONTENT.value)"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="10">
              <a-form-model-item label="可選字串樣板">
                <div v-if="showNoticeSymbol">
                  <IpkVxeTable
                    :ipkGrid="dataGrid"
                  />
                </div>
                <div v-else>
                  無可選字串樣板
                </div>
              </a-form-model-item>
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
            @handleBtnEmit="closeAddAndEditModal('cancel')"
          />
          <IpkButton
            buttonType="primary"
            buttonText="預覽"
            :isAuthorize="false"
            @handleBtnEmit="openPreviewModal"
          />
          <IpkButton
            buttonType="primary"
            buttonText="送出"
            :isAuthorize="false"
            @handleBtnEmit="submit"
          />
        </a-space>
      </template>
    </a-modal>
    <NoticeModal
      :modal-notice-show="showPreviewModal"
      :detail="detail"
      @modalClose="closePreviewModal"
    />
  </div>
</template>

<script src="./AddAndEditModal.ts" />

<style lang="scss" scoped>
::v-deep {
  .ant-modal-title {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-form-vertical .ant-form-item-label, .ant-col-24.ant-form-item-label, .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
  .has-error .tox { // 編輯器驗證錯誤紅色外框
    border-color: #f5222d;
  }
  .ant-modal .vxe-table--body .ant-btn-primary {
    color: #FFF;
    background-color: #0093C1;
    border-color: #D9D9D9;
  }
  .ant-modal .vxe-table--body .ant-btn-primary[disabled] {
    color: rgba(0,0,0,.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    box-shadow: none;
  }
  .ant-btn {
    white-space: normal;
  }
}
</style>
