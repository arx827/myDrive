<template>
  <div>
    <div class="d-flex">
      <!-- 可新增選項下拉選單 -->
      <a-select
        v-if="!showSelfDefined"
        :ref="`${refKey}`"
        v-model="selected"
        class="select__block"
        :placeholder="placeholder"
        allowClear
        :show-search="showSearch"
        :disabled="isDisabled"
        :filter-option="(showSearch) ? filterOption : false"
        :labelInValue="labelInValue"
        optionFilterProp="children"
        @select="handleSelect($event, 'select')"
        @blur="handleSelect($event, 'blur')"
        @inputKeydown="deleteInputValue($event)"
        @mouseenter="handleClear($event)"
      >
        <a-select-option
          v-for="(singleSelect, index) in allOptions"
          :key="index"
          :value="singleSelect.value"
        >
          {{ singleSelect.label }}
        </a-select-option>
      </a-select>
      <!-- 單選下拉(客製化模糊查詢: 需輸入關鍵字) -->
      <a-select
        v-if="showSelfDefined"
        :ref="`${refKey}`"
        v-model="selected"
        class="select__block"
        :placeholder="placeholder"
        allowClear
        show-search
        :disabled="isDisabled"
        :labelInValue="labelInValue"
        optionFilterProp="children"
        :filter-option="false"
        @select="handleSelect($event, 'select')"
        @blur="handleSelect($event, 'blur')"
        @search="handleOption($event)"
        @inputKeydown="deleteInputValue($event)"
        @mouseenter="handleClear($event)"
      >
        <a-select-option
          v-for="(singleSelect, index) in filterOptions"
          :key="index"
          :value="singleSelect.value"
        >
          {{ singleSelect.label }}
        </a-select-option>
      </a-select>
      <!-- 新增選項按鈕 -->
      <a-button
        class="btn__select--default ms-1"
        :disabled="isDisabled"
        @click="handleOpenAddModal"
      >
        <a-icon type="plus" />
      </a-button>
    </div>
    <!-- 新增選項彈窗 -->
    <a-modal
      v-model="modalAddOptionShow"
      title="新增選項"
      :destroyOnClose="true"
      @cancel="handleCloseAddModal"
    >
      <div>
        <div>請輸入新增的選項</div>
        <a-form-model
          ref="formRef"
          :model="addItemForm"
          :rules="addItemFormRules"
          :layout="'vertical'"
        >
          <a-form-model-item prop="addItem">
            <a-input
              v-model.trim="addItemForm.addItem"
              class="my-2"
              :maxLength="addItemMaxLength ? addItemMaxLength : -1"
              @change="transferInput"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <template slot="footer">
        <IpkButton
          buttonType="lightBlue"
          buttonText="關閉"
          iconType="close"
          :isAuthorize="false"
          @handleBtnEmit="handleCloseAddModal"
        />
        <IpkButton
          buttonType="primary"
          buttonText="確定"
          iconType="check"
          :buttonDisabled="isEmpty(addItemForm.addItem)"
          :isAuthorize="false"
          @handleBtnEmit="submitAddOptionItem"
        />
      </template>
    </a-modal>
  </div>
</template>
<script src="./IpkAddItemSelect.ts" lang="ts" />

<style lang="scss" scoped>
::v-deep{
  .ant-btn[disabled] {
    &, &:hover {
      color: rgba(0, 0, 0, 0.25);
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      text-shadow: none;
      box-shadow: none;
    }
  }
  .ant-form-vertical .ant-form-item {
    padding-bottom: 0px;
  }
}

.btn__select--default {
  &, &:focus {
    color: $COLOR-MAIN15;
    border: {
      width: 1px;
      style: solid;
      color: $COLOR-MAIN15;
    }
  }
  &:hover,
  &:active {
    color: $COLOR-MAIN16;
    border: {
      color: $COLOR-MAIN16;
    }
  }
}
.select__block {
  flex: 1;
}
</style>
