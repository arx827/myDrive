<template>
  <div>
    <a-row>
      <!-- 未授權功能 -->
      <a-col :span="12">
        <p>{{ $t("roleGF_unauthorizedGroup") }}</p>
      </a-col>
      <!-- 授權功能 -->
      <a-col :span="12">
        <p style="margin-left: 20px">{{ $t("roleGF_authorizedGroup") }}</p>
      </a-col>
    </a-row>

    <a-transfer
      :data-source="transferData"
      :target-keys="targeFunctiontKeys"
      :show-search="true"
      :filter-option="
        (inputValue, item) =>
          item.key.indexOf(inputValue) !== -1 ||
          item.key.indexOf(inputValue.toUpperCase()) !== -1 ||
          item.name.indexOf(inputValue) !== -1
      "
      :show-select-all="false"
      @change="onChange"
      :locale="locale"
      :list-style="{ width: '50%', height: '300px' }"
    >
      <template
        slot="children"
        slot-scope="{
          props: { filteredItems, selectedKeys },
          on: { itemSelectAll, itemSelect },
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              selectedKeys,
              itemSelectAll,
              itemSelect,
            })
          "
          :columns="functionColumn"
          :data-source="filteredItems"
          size="small"
          :pagination="false"
          :scroll="{ y: 200 }"
          :custom-row="
            ({ key, disabled: itemDisabled }) => ({
              on: {
                click: () => {
                  if (!isRoleEnable) return;
                  itemSelect(key, !selectedKeys.includes(key));
                },
              },
            })
          "
        />
      </template>
    </a-transfer>
  </div>
</template>
<script src="./RoleGroupForm.ts" lang="ts"></script>

<style scoped>
::v-deep .ant-transfer-list-header {
  display: none;
}

::v-deep .ant-transfer-list {
  padding-top: 0px;
}
</style>