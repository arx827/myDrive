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
              <a-form-model-item prop="custodian" label="保管行">
                <a-select
                  v-model="addForm.custodian"
                  placeholder="請選擇"
                  show-search
                  :disabled="addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, index1) in custodianOption"
                    :key="index1"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="6">
              <a-form-model-item prop="nationId" label="國家">
                <IpkAddItemSelect
                  v-model="addForm.nationId"
                  :options="nationIdOption"
                  :isDisabled="addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val"
                  placeholder="請選擇"
                  :showSearch="true"
                  refKey="nationId"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="currency" label="幣別">
                <a-select
                  v-model="addForm.currency"
                  placeholder="請選擇"
                  show-search
                  :disabled="addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, index3) in currencyOption"
                    :key="index3"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="type" label="交易類型">
                <a-select
                  v-model="addForm.type"
                  placeholder="請選擇"
                  show-search
                  :disabled="addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, index3) in typeOption"
                    :key="index3"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="tradeCycle" label="交易週期">
                <a-input-number
                  v-model="addForm.tradeCycle"
                  :min="0"
                  :max="9"
                  :formatter="value => `T+${value}`"
                  :parser="value => value.replace('T+', '')"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="equityCutOffDay" label="券指示日">
                <a-input-number
                  v-model="addForm.equityCutOffDay"
                  :min="0"
                  :max="9"
                  :formatter="value => `SD-${value}`"
                  :parser="value => value.replace('SD-', '')"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="equityCutOffTime" label="券指示時間">
                <a-time-picker
                  v-model="addForm.equityCutOffTime"
                  :open.sync="equityCutOffTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="equityCutOffTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="equityCutOffTime" label="券目標放行時間">
                <a-time-picker
                  v-model="addForm.equityBufferTime"
                  :open.sync="equityBufferTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="equityBufferTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="tradeType" label="買賣類型">
                <a-select
                  v-model="addForm.tradeType"
                  placeholder="請選擇"
                  show-search
                  :disabled="addAndEditInfo.actionType === this.$cfEnum.constant.MODIFY.val"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, index3) in tradeTypeOption"
                    :key="index3"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="cashCutOffDay" label="款指示日">
                <a-input-number
                  v-model="addForm.cashCutOffDay"
                  :min="0"
                  :max="9"
                  :formatter="value => `SD-${value}`"
                  :parser="value => value.replace('SD-', '')"
                  style="width: 100%"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="cashCutOffTime" label="款指示時間">
                <a-time-picker
                  v-model="addForm.cashCutOffTime"
                  :open.sync="cashCutOffTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="cashCutOffTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="cashBufferTime" label="款目標放行時間">
                <a-time-picker
                  v-model="addForm.cashBufferTime"
                  :open.sync="cashBufferTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="cashBufferTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="localTradeStartTime" label="當地交易時間起">
                <a-time-picker
                  v-model="addForm.localTradeStartTime"
                  :open.sync="localTradeStartTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="localTradeStartTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="localTradeEndTime" label="當地交易時間迄">
                <a-time-picker
                  v-model="addForm.localTradeEndTime"
                  :open.sync="localTradeEndTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="localTradeEndTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="twTradeStartTime" label="台灣交易時間起">
                <a-time-picker
                  v-model="addForm.twTradeStartTime"
                  :open.sync="twTradeStartTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="twTradeStartTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="twTradeEndTime" label="台灣交易時間迄">
                <a-time-picker
                  v-model="addForm.twTradeEndTime"
                  :open.sync="twTradeEndTimeOpen"
                  format="HH:mm"
                  placeholder="請選擇時間"
                  style="width: 100%"
                >
                  <!-- TODO: a-time-picker 裡的確定，待修改 -->
                  <a-button
                    slot="addon"
                    size="small"
                    type="default"
                    class="select__btn--default timePicker_close"
                    @click="twTradeEndTimeOpen = false"
                  >
                    <a-icon type="check" />
                    確定
                  </a-button>
                </a-time-picker>
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
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :buttonDisabled="validateSubmit()"
          :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="buttonKey"
          @handleBtnEmit="validateAddOrEditProcess"
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
.timePicker_close {
  border: none !important;
  justify-content: center;
  align-items: center;
  display: flex;
}
.select__btn--default {
  color: $COLOR-MAIN15;
}
</style>
