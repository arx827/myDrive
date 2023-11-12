<template>
  <div>
    <a-row>
      <!-- 未授權帳號 -->
      <a-col :span="12">
        <p>{{ $t("userGroup_unauthorizedRole") }}</p>
      </a-col>
      <!-- 授權帳號 -->
      <a-col :span="12">
        <p style="margin-left: 20px">{{ $t("userGroup_authorizedRole") }}</p> 
      </a-col>
    </a-row>

    <a-transfer
      :data-source="originalTargetKeys"
      :target-keys="rightTargetKeys"
      :show-search="true"
      :filter-option="
        (inputValue, item) =>
          item.key.indexOf(inputValue) !== -1 ||
          item.key.indexOf(inputValue.toUpperCase()) !== -1 ||
          item.description.indexOf(inputValue) !== -1
      "
      :show-select-all="false"
      @change="onChange"
      :locale="locale"
      :list-style="{ width: '50%', height: '300px' }"
    >
      <template
        slot="children"
        slot-scope="{
          props: { direction, filteredItems, selectedKeys },
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
          :columns="direction === 'left' ? leftColumns : rightColumns"
          :data-source="filteredItems"
          size="small"
          :pagination="false"
          :scroll="{ y: 200 }"
          :custom-row="
            ({ key }) => ({
              on: {
                click: () => {
                  if (!isUserEnable) return;
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
<script src="./RoleUpdateForm.ts" lang="ts"></script>

<style scoped>
::v-deep .ant-transfer-list-header {
  display: none;
}

::v-deep .ant-transfer-list {
  padding-top: 0px;
}
</style>