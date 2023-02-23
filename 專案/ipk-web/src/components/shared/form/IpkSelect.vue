<template>
  <div>
    <!-- 單選下拉(一般模糊查詢 => 判斷渲染) -->
    <a-select
      v-if="!showSelfDefined"
      :ref="`${refKey}`"
      v-model="selected"
      :placeholder="placeholder"
      allowClear
      :show-search="showSearch"
      :disabled="isDisabled"
      :labelInValue="labelInValue"
      optionFilterProp="children"
      style="width: 100%"
      @select="handleSelect($event, 'select')"
      @blur="handleSelect($event, 'blur')"
      @search="handleFilterOption($event)"
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
      :placeholder="placeholder"
      allowClear
      show-search
      :disabled="isDisabled"
      :labelInValue="labelInValue"
      optionFilterProp="children"
      :filter-option="false"
      style="width: 100%"
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
  </div>
</template>
<script src="./IpkSelect.ts" lang="ts" />

<style lang="scss" scoped>
</style>
