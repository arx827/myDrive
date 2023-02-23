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
              <a-form-model-item prop="fundName" label="名稱">
                <a-select
                  v-model="addForm.fundName"
                  style="width: 100%"
                  placeholder="請輸入"
                  :options="fundNameOptions"
                  :maxLength="100"
                >
                  <a-select-option
                    v-for="(item, index) in fundNameOptions"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item prop="amount" label="金額">
                <a-input-number
                  v-model.trim="addForm.amount"
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
              <a-form-model-item prop="maintainDate" label="資料維護日">
                <a-date-picker
                  v-model="addForm.maintainDate"
                  :format="'YYYY/MM/DD'"
                  placeholder="請選擇日期"
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
