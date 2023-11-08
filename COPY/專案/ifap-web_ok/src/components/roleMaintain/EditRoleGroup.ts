import {
  Vue, Component, Watch, Prop,
} from "vue-property-decorator";
import AccordionArea from "@shared/AccordionArea.vue";
import { Action } from 'vuex-class';
import { keyVal } from 'src/plugins/global/enumData'
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import difference from 'lodash/difference';

@Component({
  components: { AccordionArea, FblDataGrid },
})
export default class EditRoleGroup extends Vue {
  @Prop()
  public initData;

  @Action('setLoading') setLoading;

  statusArr: keyVal[] = this.$enum.userStatus;

  // 篩選框
  getRowSelection({
    disabled,
    selectedKeys,
    itemSelectAll,
    itemSelect,
  }) {
      return {
        getCheckboxProps: (item) => ({ props: { disabled: disabled || item.disabled } }),
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

  /**
    * Event
    */

  // 穿梭框 篩選
  filterFunc(inputValue, item) {
    return item.groupId.indexOf(inputValue.toUpperCase()) !== -1 || item.groupName.indexOf(inputValue.toUpperCase()) !== -1;
  }

  // 群組異動彈窗 變更
  onChange(nextTargetKeys) {
    this.initData.targetKeys = nextTargetKeys;
  }

  /**
    * 監聽initData資料變動
    * @returns
    */
  @Watch("initData")
  onInitDataChanged(): void {
  }
}
