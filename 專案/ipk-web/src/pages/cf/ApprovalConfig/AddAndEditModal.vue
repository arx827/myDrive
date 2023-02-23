<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    :title="modalTitle"
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
              <a-form-model-item prop="productType" label="商品類別">
                <a-input v-model="oriForm.productType" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="calculateType" label="計算類型">
                <a-select v-model="oriForm.calculateType" disabled>
                  <a-select-option
                    v-for="(item, index1) in calculateTypeOption"
                    :key="index1"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="currency" label="計算幣別">
                <a-select v-model="oriForm.currency" disabled>
                  <a-select-option
                    v-for="(item, index2) in currencyOption"
                    :key="index2"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amountLv1" label="職等六上限">
                <a-input-number
                  v-model="oriForm.amountLv1"
                  style="width: 100%"
                  :min="0"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amountLv2" label="科主管上限">
                <a-input-number
                  v-model="oriForm.amountLv2"
                  style="width: 100%"
                  :min="0"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amountLv3" label="部副主管上限">
                <a-input-number
                  v-model="oriForm.amountLv3"
                  style="width: 100%"
                  :min="0"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amountLv4" label="部主管上限">
                <a-input-number
                  v-model="oriForm.amountLv4"
                  style="width: 100%"
                  :min="0"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amountLv4Above" label="處主管">
                <a-input-number
                  v-model="oriForm.amountLv4"
                  disabled
                  :formatter="(value) => `大於 ${value}`"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="modal__btn__wrap btnGroup">
        <IpkButton
          buttonType="lightBlue"
          buttonText="取消"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="closeAddAndEditModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :buttonDisabled="submitDisabled"
          :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="buttonKey"
          @handleBtnEmit="submitApprovalConfigInfo"
        />
      </div>
    </div>
  </a-modal>
</template>
<script src="./AddAndEditModal.ts" lang="ts">
</script>
<style lang="scss" scoped>
::v-deep {
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
  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    font-weight: $TEXT-BOLD;
  }
}
</style>
