<template>
  <div>
    <a-form-model ref="formRefGroup">
      <div class="row mb-2">
        <div class="col">
          未授權群組
        </div>
        <div class="col ms-3">
          已授權群組
        </div>
      </div>
      <a-transfer
        class="customTransfer"
        :data-source="initData.mockData"
        :target-keys="initData.targetKeys"
        :show-search="true"
        :show-select-all="false"
        :locale="initData.locale"
        :filter-option="filterFunc"
        @change="onChange"
      >
        <template #children="{
          props: { filteredItems, selectedKeys, disabled: listDisabled },
          on: { itemSelectAll, itemSelect },
        }"
        >
          <a-table
            :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
            :columns="initData.tableColumns"
            :pagination="false"
            :data-source="filteredItems"
            size="small"
            :style="{ pointerEvents: listDisabled ? 'none' : null }"
            :custom-row="({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (itemDisabled || listDisabled) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })"
          />
        </template>
      </a-transfer>
    </a-form-model>
  </div>
</template>
<script src="./EditRoleGroup.ts" lang="ts"></script>
