import {
  Vue, Component, Prop,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import transferUtil from '@/plugins/util/transferUtil';
import { SortItem, IpkVxeTableModel } from './IpkVxeTableModels';

@Component({
  components: {
    IpkButton,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
})
export default class IpkVxeTable extends Vue {
  /**
   * props
   */
  @Prop()
  ipkGrid: IpkVxeTableModel;

  @Prop()
  showEditFlag: boolean; // 是否要顯示編輯框

  @Prop()
  showRedBorderFlag: boolean; // 是否要顯示必填紅框

  /**
   * data
   */

  /**
   * methods
   */

  // 金額轉換成千分位
  transferPrice(data: number | string, decimal?: number) {
    return transferUtil.transferPrice(data, decimal);
  }

  // 下載檔案
  handleDownloadFile(row) {
    this.$emit('handleDownloadFile', row);
  }

  // 查看此列內容
  handlePendingInfo(row, item) {
    this.$emit('getPendingSelected', { row, item });
  }

  // 取得此列檢視彈窗內容
  handleCheckInfoModal(row) {
    let checkInfo = {
      modalCheckInfoShow: true,
      formData: row,
    };
    this.$emit('openCheckInfoModal', checkInfo);
  }

  // 傳送更多操作所選的選項
  handleSelectChange(actionType, rowData, rowIndex) {
    this.$emit('getActionType', { actionType, rowData, rowIndex });
  }

  // 換頁
  handlePageChange(currentPage) {
    this.$emit('handlePageChange', currentPage);
  }

  // 排序
  handleSortChange(sort) {
    const s: SortItem = sort && sort.order
      ? {
        selector: sort.field,
        desc: sort.order === 'desc',
      }
      : undefined;
    this.$emit('sortChange', { sort: s, page: this.ipkGrid.pagerConfig });
  }

  // 取得checkbox勾選項
  handleCheckboxChange(e) {
    this.$emit('checkboxChange', e);
  }

  // 取得checkbox全部勾選項
  handleCheckboxAll(e) {
    this.$emit('checkboxAll', e);
  }

  // 取得radio選中項
  handleRadioChange(e) {
    this.$emit('radioChange', e);
  }

  // 只對 rowConfig.isCurrent設定為true時有效，當手動選中列並且值發生改變時觸發的事件
  handleRowCurrentChange(e) {
    this.$emit('handleRowCurrentChange', e);
  }

  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 編輯框關閉事件
  editClosedEvent(e) {
    this.$emit('editClosedEvent', e);
  }

  // 編輯框開啟事件
  editActivedEvent(e) {
    this.$emit('editActivedEvent', e);
  }

  // 編輯框disable事件
  editDisabledEvent(e) {
    this.$emit('editDisabledEvent', e);
  }

  // 編輯框內容檢核
  validError(e) {
    this.$emit('validError', e);
  }

  // 單元格被點擊時會觸發該事件
  cellClickEvent(e) {
    this.$emit('cellClickEvent', e);
  }

  // 當樹節點展開或收起時會觸發該事件
  toggleTreeExpand(e) {
    this.$emit('toggleTreeExpand', e);
  }

  // 編輯欄位change事件
  handleEditChange(rowData, rowIndex, changedValue, columnName) {
    this.$emit('handleEditChange', {
      rowData, rowIndex, changedValue, columnName,
    });
  }

  // 下拉選單(複選)全選
  selectALL(row, fieldName, optionList) {
    let newOptionList = [];

    optionList.forEach((item) => {
      if (!validateUtil.isEmpty(item.value)) {
        newOptionList.push(item.value);
      }
    });

    row[fieldName] = newOptionList;
  }

  // 下拉選單(複選)清除
  clearALL(row, fieldName) {
    row[fieldName] = undefined;
  }
}
