<template>
  <a-form-model
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 12 }"
    :model="menuChangeForm"
    :rules="changeRules"
  >
    <!-- 選單代碼 -->
    <a-form-model-item
      :label="$t('menuSP_menuCode')"
      prop="menuId"
      style="margin-bottom: 0px"
      :has-feedback="menuIdFeedback"
      :validateStatus="stateMenuId"
    >
      <a-popover placement="top" :content="menuIdMsg" :trigger="menuIdHover">
        <a-input
          type="text"
          v-model="menuChangeForm.menuId"
          :disabled="isEditing"
        />
      </a-popover>
    </a-form-model-item>
    <!-- 選單名稱 -->
    <a-form-model-item
      :label="$t('menuSP_menuCode')"
      prop="menuName"
      style="margin-bottom: 0px"
      :has-feedback="menuNameFeedback"
      :validateStatus="stateMenuName"
    >
      <a-popover
        placement="top"
        :content="menuNameMsg"
        :trigger="menuNameHover"
      >
        <a-input type="text" v-model="menuChangeForm.menuName" />
      </a-popover>
    </a-form-model-item>
    <!-- 功能名稱/代碼 搜尋式下拉清單 -->
    <!-- <a-form-model-item
      :label="$t('global_function') + $t('global_name')"
      prop="resourceId"
      style="margin-bottom: 0px"
      :has-feedback="resourceIdFeedback"
      :validateStatus="stateResourceId"
    >
      <a-popover
        placement="top"
        :content="resourceIdMsg"
        :trigger="resourceIdHover"
      >
        <a-select
          show-search
          option-filter-prop="children"
          :filter-option="filterOption"
          :options="selectResourceIdOptions"
          v-model="menuChangeForm.resourceId"
        >
        </a-select>
      </a-popover>
    </a-form-model-item> -->
    <!-- 是否為子選單 -->
    <a-form-model-item
      :label="$t('menuSP_isLeaf')"
      prop="isLeaf"
      style="margin-bottom: 0px"
      :validateStatus="stateIsLeaf"
    >
      <a-popover placement="top" :content="isLeafMsg" :trigger="isLeafHover">
        <a-select v-model="menuChangeForm.isLeaf" :options="selectLeafOptions">
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 狀態(是否啟用) -->
    <a-form-model-item
      :label="$t('global_status')"
      prop="enable"
      style="margin-bottom: 0px"
      :validateStatus="stateEnable"
    >
      <a-popover placement="top" :content="enableMsg" :trigger="enableHover">
        <a-select
          v-model="menuChangeForm.enable"
          :options="selectEnableOptions"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 父選單名稱  搜尋式下拉清單 -->
    <a-form-model-item
      :label="$t('menuSP_parentMenuName')"
      prop="parentMenuId"
      style="margin-bottom: 0px"
      :has-feedback="parentMenuIdFeedback"
      :validateStatus="stateParentMenuId"
    >
      <a-popover
        placement="top"
        :content="parentMenuIdMsg"
        :trigger="parentMenuIdHover"
      >
        <a-select
          show-search
          option-filter-prop="children"
          :filter-option="filterOption"
          :options="selectParentMenuIdOptions"
          v-model="menuChangeForm.parentMenuId"
        >
        </a-select>
      </a-popover>
    </a-form-model-item>
    <!-- 排列順序 -->
    <a-form-model-item
      :label="$t('menuSP_arrangeOrder')"
      prop="sortSequence"
      style="margin-bottom: 0px"
      :has-feedback="sortSequenceFeedback"
      :validateStatus="stateSortSequence"
    >
      <a-popover
        placement="top"
        :content="sortSequenceMsg"
        :trigger="sortSequenceHover"
      >
        <a-input type="text" v-model="menuChangeForm.sortSequence" />
      </a-popover>
    </a-form-model-item>
  </a-form-model>
</template>
<script src="./MenuForm.ts" lang="ts"></script>
