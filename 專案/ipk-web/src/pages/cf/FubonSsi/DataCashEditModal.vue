<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    title="修改款"
    :maskClosable="false"
    :keyboard="false"
    :width="'70%'"
    :footer="null"
    :destroyOnClose="true"
    @cancel="closeAddAndEditModal()"
  >
    <div>
      <div class="modal__body">
        <a-form-model
          ref="formRef"
          :model="oriForm"
          :rules="addFormRules"
          :layout="'vertical'"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="bfBankId" label="受款銀行代碼">
                <a-input
                  v-model="oriForm.bfBankId"
                  placeholder="請輸入"
                  :maxLength="15"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="bfBankAccount" label="受款銀行帳號">
                <a-input
                  v-model="oriForm.bfBankAccount"
                  placeholder="請輸入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="bfBankName" label="受款銀行名稱">
                <a-input
                  v-model="oriForm.bfBankName"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="bfAccount" label="受款人帳號">
                <a-input
                  v-model="oriForm.bfAccount"
                  placeholder="請輸入"
                  :maxLength="50"
                  disabled
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="bfAccountName" label="受款人戶名">
                <a-input
                  v-model="oriForm.bfAccountName"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="imBankCode" label="中間行代碼">
                <a-input
                  v-model="oriForm.imBankCode"
                  placeholder="請輸入"
                  :maxLength="15"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="imBankName" label="中間行名稱">
                <a-input
                  v-model="oriForm.imBankName"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="tfBankAccount" label="調撥銀行帳號">
                <a-input
                  v-model="oriForm.tfBankAccount"
                  placeholder="請輸入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="tfBankName" label="調撥銀行名稱">
                <a-input
                  v-model="oriForm.tfBankName"
                  placeholder="請輸入"
                  :maxLength="100"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="12">
              <a-form-model-item prop="memo" label="附言">
                <a-textarea
                  v-model="oriForm.memo"
                  placeholder="請輸入"
                  :auto-size="{ minRows: 1, maxRows: 1 }"
                  :maxLength="200"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item prop="remark" label="備註">
                <a-textarea
                  v-model="oriForm.remark"
                  placeholder="請輸入"
                  :auto-size="{ minRows: 1, maxRows: 1 }"
                  :maxLength="200"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="isDefault" label="預設">
                <a-switch v-model="isDefault" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="modal__btn__wrap btnGroup">
          <IpkButton
            buttonType="lightBlue"
            buttonText="取消"
            iconType="close"
            :isAuthorize="false"
            @handleBtnEmit="closeAddAndEditModal"
          />
          <!-- TODO: 權限待修改 -->
          <IpkButton
            buttonType="primary"
            buttonText="送出"
            iconType="check"
            :isAuthorize="false"
            @handleBtnEmit="submitEditCashInfo"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script src="./DataCashEditModal.ts" lang="ts" />

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
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
