<template>
  <div>

    <a-row>
      <a-col :span="6" :offset="5">
        <p>{{$t("reviewSU_unauthorized_roles")}}</p>
      </a-col>
       <a-col :span="6" :offset="5">
        <p style="margin-left:20px">{{$t("reviewSU_authorized_roles")}}</p>
      </a-col>
    </a-row>

    <a-transfer
      :data-source="originalTargetKeys"
      :target-keys="rightTargetKeys"
      :disabled="disabled"
      :show-search="true"
      :filter-option="
        (inputValue, item) => item.key.indexOf(inputValue)!== -1 ||
        item.key.indexOf(inputValue.toUpperCase())!== -1 ||
        item.description.indexOf(inputValue)!== -1
      "
      :show-select-all="false"
      @change="onChange"
      :locale="locale"
      :list-style="{width : '50%', height: '300px'}"
    >
      <template
        slot="children"
        slot-scope="{
          props: {
            direction,
            filteredItems,
            selectedKeys,
            disabled: listDisabled,
          },
          on: { itemSelectAll, itemSelect },
        }"
      >
        <a-table
          :row-selection="
            getRowSelection({
              disabled: listDisabled,
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
          :style="{ pointerEvents: listDisabled ? 'none' : null }"
          :custom-row="
            ({ key}) => ({
              on: {
                click: () => {
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
<script src="./ReviewSettingUpdateForm.ts" lang="ts"></script>

<style scoped>

::v-deep .ant-transfer-list-header {
  display: none;
}

::v-deep .ant-transfer-list {
  padding-top: 0px;
}
</style>