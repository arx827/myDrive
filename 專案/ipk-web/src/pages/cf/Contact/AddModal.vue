<template>
  <a-modal
    ref="modal"
    v-model="modalVisible"
    title="新增"
    :maskClosable="false"
    :keyboard="false"
    :width="'50%'"
    :footer="null"
    :destroyOnClose="true"
    @cancel="closeAddModal('cancel')"
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
            <a-col :span="24">
              <a-form-model-item prop="productGroup" label="產品群組">
                <a-select
                  v-model="addForm.productGroup"
                  placeholder="請選擇產品群組"
                  show-search
                  allowClear
                  @change="resetEmpData"
                >
                  <a-select-option
                    v-for="(item, index1) in productGroup"
                    :key="index1"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item prop="empDomain" label="帳號">
                <a-input
                  v-model="addForm.empDomain"
                  style="width: 100%"
                  placeholder="請輸入帳號"
                  :maxLength="5"
                  @blur="findEmpBeforeAdd"
                  @change="resetEmpData"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item prop="empName" label="姓名">
                <a-input
                  v-model="addForm.empName"
                  style="width: 100%"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item prop="unitName" label="單位">
                <a-input
                  v-model="addForm.unitName"
                  style="width: 100%"
                  :disabled="true"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item prop="tel" label="分機">
                <a-input
                  v-model="addForm.tel"
                  style="width: 100%"
                  :disabled="true"
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
          @handleBtnEmit="closeAddModal('cancel')"
        />
        <IpkButton
          buttonType="primary"
          buttonText="送出"
          iconType="check"
          :buttonDisabled="validateSubmit()"
          :childrenTab="$cfChildrenTab.childrenTab.DATA_INFO_TAB.val"
          :buttonKey="$cfButtonKey.buttonKey.ADD.val"
          @handleBtnEmit="validateBeforeAdd"
        />
      </div>
    </div>
  </a-modal>
</template>
<script src="./AddModal.ts" lang="ts">
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
