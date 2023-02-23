import {
 Vue, Component, Prop,
} from 'vue-property-decorator';
import validateUtil from '@/plugins/util/validateUtil';

export interface SortItem {
  selector?: string;
  desc?: boolean;
}

@Component({})
  export default class ExpandDataGrid extends Vue {
  /**
  * props
  */
  @Prop()
  outerGridData;

  @Prop()
  parentGridData;

  @Prop()
  childrenGridData;

  @Prop()
  expandIconColumnIndex: number; // 第幾列顯示縮合icon

  @Prop({ default: true })
  showEditFlag;

  /**
   * data
   */

  optionList = [];

  /**
   * hook
   */
  created() {
    //
  }

  /**
  * methods
  */
  // 取得更多操作的選單
  getOptions(data) {
    this.optionList = data;
  }

  // 取得狀態代碼對應badge顏色及文字
  getBadgeObject(statusText: string) {
    if (validateUtil.isEmpty(statusText)) {
      return;
    }
    return this.$actEnum.getObject('caseStatusEnum', statusText);
  }

  // 渲染無特別定義型態的文字
  plainTextOf(row, column, data): string {
    if (column.formatter) {
      return column.formatter(data);
    }

    const props = column.property.toString().split('.');
    let retVal = row[props[0]];
    props.forEach((p, i) => {
      if (i > 0) {
        if (retVal !== undefined && retVal !== null) {
          retVal = retVal[props[i]];
        }
      }
    });
    return retVal;
  }

  // 傳送更多操作所選的選項
  handleSelectChange(actionType, rowData) {
    this.$emit('getActionType', { actionType, rowData });
  }

  // 取得此列資料明細檢視彈窗內容
  handleCheckInfoModal(row) {
    let checkInfo = {
      modalCheckInfoShow: true,
      formData: row,
    };
    this.$emit('openCheckInfoModal', checkInfo);
  }

  // 取得此列待放行清單檢視彈窗內容
  handlePendingInfo(row, item) {
    this.$emit('getPendingSelected', { row, item });
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
    this.$emit('sortChange', { sort: s, page: this.outerGridData.pagerConfig });
  }

  // 取得待放行清單checkbox勾選項
  handleCheckboxChange(e) {
    this.$emit('checkboxChange', e);
  }

  // 取得待放行清單checkbox全部勾選項
  handleCheckboxAll(e) {
    this.$emit('checkboxAll', e);
  }

  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 合併欄位
  colspanMethod({ _rowIndex, _columnIndex }) {
    if (_columnIndex === 0) {
      return { rowspan: 2, colspan: 1 };
    }
  }

  // 編輯欄位change事件
  handleEditChange(rowData, rowIndex, changedValue, columnName) {
    this.$emit('handleEditChange', {
      rowData, rowIndex, changedValue, columnName,
    });
  }
}
