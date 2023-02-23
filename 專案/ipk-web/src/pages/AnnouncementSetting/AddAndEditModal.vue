<template>
  <a-modal
    ref="modal"
    v-model="showModal"
    :title="modalTitle"
    :maskClosable="false"
    :keyboard="false"
    :width="'43%'"
    :dialog-style="{ top: '25px' }"
    :body-style="{ maxHeight: '825px', overflow: 'hidden', overflowY: 'scroll'}"
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
            <a-form-model-item prop="title" label="標題">
              <a-textarea
                v-model.trim="form.title"
                :auto-size="{ minRows: 1, maxRows: 1 }"
                allow-clear
                style="width: 100%;"
                placeholder="請輸入"
                :maxLength="200"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item prop="content" label="內容">
              <BasicTinyEditor v-model="form.content" @input="validateContent" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="publishDate" label="發佈日">
              <a-date-picker
                v-model="form.publishDate"
                :format="'YYYY/MM/DD'"
                placeholder="請選擇日期"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="type" label="類型">
              <a-select
                v-model="form.type"
                placeholder="請選擇"
                show-search
              >
                <a-select-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="effectDate" label="生效日">
              <a-date-picker
                v-model="form.effectDate"
                :format="'YYYY/MM/DD'"
                placeholder="請選擇日期"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item prop="expiryDate" label="失效日">
              <a-date-picker
                v-model="form.expiryDate"
                :format="'YYYY/MM/DD'"
                placeholder="請選擇日期"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item prop="documentNum" label="文號">
              <a-textarea
                v-model.trim="form.documentNum"
                :auto-size="{ minRows: 1, maxRows: 1 }"
                allow-clear
                style="width: 100%;"
                placeholder="請輸入"
                :maxLength="100"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item prop="attachment" label="附件">
              <UploadDragger
                :fileUploadData="fileUploadDataSettings"
                :fileUploadStatus="fileUploadStatus"
                :fileList="form.attachment"
                @handleChange="handleChange"
                @handleDownload="handleDownload"
                @deleteFile="deleteFile"
              />
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
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeAddAndEditModal('cancel')"
        />
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :isAuthorize="false"
          @handleBtnEmit="submit"
        />
      </a-space>
    </template>
  </a-modal>
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
}
</style>
