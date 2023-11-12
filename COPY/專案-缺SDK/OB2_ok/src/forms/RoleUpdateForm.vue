<template>
  <div>
      <a-col :span="1">
      </a-col>
    <a-row>
      <a-col :span="12">
        <p>{{ UnauthorizedRoles }}</p>
      </a-col>
      <a-col :span="12">
        <p style="margin-left: 20px">{{ AuthorizedRoles }}</p>
      </a-col>
    </a-row>
    <a-transfer
      :data-source="originalTargetKeys"
      :target-keys="rightTargetKeys"
      :disabled="disabled"
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
            ({ key }) => ({
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
<script lang="ts">
import difference from "lodash/difference";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class RoleUpdateFormNew extends Vue {
  @Prop()
  mockData;

  @Prop()
  targetKeys;

  rightTargetKeys = [];
  disabled: boolean = false;

  //未授權角色和已授權角色
  UnauthorizedRoles: string =
    this.$t("global_unauthorized").toString() +
    this.$t("global_role").toString();
  AuthorizedRoles: string =
    this.$t("global_authorized").toString() + this.$t("global_role").toString();

  originalTargetKeys: string[];

  locale: object = {};
  leftColumns = [
    {
      dataIndex: "title",
      title:
        this.$t("global_role").toString() +
        this.$t("global_codeName").toString(), //角色代號
    },
    {
      dataIndex: "description",
      title:
        this.$t("global_role").toString() + this.$t("global_name").toString(), //角色名稱
    },
    {
      dataIndex: "roleStatus",
      title: this.$t("global_status").toString(), //狀態
    },
  ];
  rightColumns = [
    {
      dataIndex: "title",
      title:
        this.$t("global_role").toString() +
        this.$t("global_codeName").toString(), //角色代號
    },
    {
      dataIndex: "description",
      title:
        this.$t("global_role").toString() + this.$t("global_name").toString(), //角色名稱
    },
    {
      dataIndex: "roleStatus",
      title: this.$t("global_status").toString(), //狀態
    },
  ];

  created() {
    this.locale = {
      itemUnit: null,
      itemsUnit: null,
      notFoundContent: null,
      searchPlaceholder: this.$t("roleSF_searchIdorName").toString(), //搜尋角色id或者名稱

    };

    this.originalTargetKeys = this.mockData;
    this.rightTargetKeys = this.targetKeys;
  }

  onChange(nextTargetKeys: any) {
    this.rightTargetKeys = nextTargetKeys;
  }

  //原本transfer套件用來左右轉換table內項目的方法
  getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
    return {
      getCheckboxProps: (item) => ({
        props: { disabled: disabled || item.disabled },
      }),
      onSelectAll(selected, selectedRows) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        const diffKeys = selected
          ? difference(treeSelectedKeys, selectedKeys)
          : difference(selectedKeys, treeSelectedKeys);
        itemSelectAll(diffKeys, selected);
      },
      onSelect({ key }, selected) {
        itemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  }

  public submit() {
    let retval = this.rightTargetKeys;
    return retval;
  }

  public cancel() {
    // this.$emit("formCancel");

    return true;
  }
}
</script>

 <style scoped>
::v-deep .ant-transfer-list-header {
  display: none;
}

::v-deep .ant-transfer-list {
  padding-top: 0px;
}
</style>