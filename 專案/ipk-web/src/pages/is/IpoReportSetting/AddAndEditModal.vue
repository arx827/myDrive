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
    @cancel="closeAddAndEditModal('cancel')"
  >
    <div>
      <div class="modal__body">
        <a-form-model
          ref="formRef"
          :model="addForm"
          :rules="addFormRules"
          :layout="'vertical'"
        >
          <a-row :gutter="[12]" type="flex" :wrap="true">
            <a-col :span="6">
              <a-form-model-item prop="seqNo" label="項次">
                <a-input
                  v-model.trim="addForm.seqNo"
                  :maxLength="9"
                  :disabled="
                    (addAndEditInfo.actionType === $actEnum.constant.MODIFY.val)
                  "
                  placeholder="請輸入"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item prop="date" label="日期">
                <a-date-picker
                  v-model="addForm.date"
                  :format="'YYYY/MM/DD'"
                  placeholder="請選擇日期"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="symId" label="商品代碼">
                <IpkSelect
                  v-model="addForm.symId"
                  :options="customCodeList"
                  placeholder="請至少輸入3位數關鍵字搜尋選項清單"
                  :showSearch="true"
                  :showSelfDefined="true"
                  :limitNum="3"
                  :labelInValue="true"
                  refKey="symId"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="sharesValue" label="股數/面額">
                <a-input-number
                  v-model.trim="addForm.sharesValue"
                  :formatter="
                    (data) => {
                      return `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }
                  "
                  :parser="
                    (data) => {
                      return data.replace(/\$\s?|(,*)/g, '');
                    }
                  "
                  :min="0"
                  placeholder="請輸入"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="investmentClass3" label="投資分類3">
                <IpkSelect
                  v-model="addForm.investmentClass3"
                  :options="investmentClass3List"
                  placeholder="請至少輸入2位數關鍵字搜尋選項清單"
                  :showSearch="true"
                  :showSelfDefined="true"
                  :limitNum="2"
                  :labelInValue="true"
                  refKey="investmentClass3"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="customType" label="商品類別">
                <a-select
                  v-model="addForm.customType"
                  style="width: 100%"
                  placeholder="請輸入"
                  :options="customTypeOptions"
                  :maxLength="100"
                >
                  <a-select-option
                    v-for="(item, index) in customTypeOptions"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
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
          @handleBtnEmit="closeAddAndEditModal('cancel')"
        />
        <!-- 儲存&送審按鈕 -->
        <IpkButton
          v-if="addAndEditInfo.actionType !== $actEnum.constant.STOP.val"
          buttonType="primary"
          buttonText="儲存"
          iconType="save"
          :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="buttonKey"
          @handleBtnEmit="saveInfo"
        />
        <IpkButton
          buttonType="primary"
          buttonText="送審"
          iconType="check"
          :childrenTab="$childrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="buttonKey"
          @handleBtnEmit="submitInfo"
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
