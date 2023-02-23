import {
  Vue, Component, Prop, Watch,
 } from 'vue-property-decorator';
 import TreeTransfer from 'el-tree-transfer';

interface treeData {
  settings?: {
    mode?: string; // 模式(官方說明提供)
    disableSelectAll?: boolean; // 是否停用全選
  };
  leftTreeData: Array<any>; // 來源資料
  rightTreeData: Array<any>; // 目標資料
}

@Component({
  components: {
    TreeTransfer,
  },
})
export default class ElTreeTransfer extends Vue {
  @Prop()
  treeData: treeData; // 樹狀表單內容

  @Prop()
  value: Array<any>; // 選擇的內容(選單右側樹結構)

  /**
   * data
   */
  title = ['', ''] // 穿梭框標題

  fromData = [] // 來源項目清單

  toData = [] // 選擇的項目清單

  fromDataCount = 0 // 左側資料項目數量(僅計算葉節點數量)

  toDataCount = 0 // 右側資料項目數量(僅計算葉節點數量)

  leftCheckedCount = 0 // 左側選擇中的節點數量(僅計算葉節點數量)

  rightCheckedCount = 0 // 右側選擇中的節點數量(僅計算葉節點數量)

  disableSelectAll = false // 是否停用全選勾選框

  /**
   * watch
   */
  @Watch('treeData', { immediate: true, deep: true })
  onDataChange(val) {
    this.fromData = val.leftTreeData;
    this.toData = val.rightTreeData;
    this.disableSelectAll = val?.settings?.disableSelectAll;
    this.refreshTransferTitle();
    // 偵測到變更後更新v-model資料
    this.$emit('input', this.toData);
  }

  /**
   * methods
   */
  // 項目新增(左到右)
  add(fromData, toData, obj) {
    this.refreshTransferTitle();
    this.$emit('input', toData);
  }

  // 項目移除(右到左)
  remove(fromData, toData, obj) {
    this.refreshTransferTitle();
    this.$emit('input', toData);
  }

  /** 監聽左側勾選事件
   *
   * @param nodeObj 點選的樹狀節點(點選全選框時為null)
   * @param treeObj 點選的樹資料(點選全選框時為null)
   *                包含 1.checkedKeys : 當前所有被選到的節點的key值
   *                     2.checkedNodes : 當前所有被選到的節點
   *                     3.halfCheckedKeys : 當前半選擇狀態的節點(就是子項目有些有選有些沒選的)的key值
   *                     4.halfCheckedNodes :  當前半選擇狀態的節點(就是子項目有些有選有些沒選的)
   * @param checkAll 是否點選全選框
   */
  leftCheck(nodeObj, treeObj, checkAll) {
    const isLeftSide = true;
    const isChecked = treeObj?.checkedKeys?.length || checkAll;
    if (checkAll) {
      this.leftCheckedCount = this.leafCount(this.fromData);
    } else {
      this.leftCheckedCount = this.leafCount([nodeObj]);
    }
    if (isChecked) {
      this.refreshCheckedTransferTitle(isLeftSide);
    } else {
      this.refreshTransferTitle();
    }
  }

  /** 監聽右側勾選事件
   *
   * @param nodeObj 點選的樹狀節點(點選全選框時為null)
   * @param treeObj 點選的樹資料(點選全選框時為null)
   *                包含 1.checkedKeys : 當前所有被選到的節點的key值
   *                     2.checkedNodes : 當前所有被選到的節點
   *                     3.halfCheckedKeys : 當前半選擇狀態的節點(就是子項目有些有選有些沒選的)的key值
   *                     4.halfCheckedNodes :  當前半選擇狀態的節點(就是子項目有些有選有些沒選的)
   * @param checkAll 是否點選全選框
   */
  rightCheck(nodeObj, treeObj, checkAll) {
    const isLeftSide = false;
    const isChecked = treeObj?.checkedKeys?.length || checkAll;
    if (checkAll) {
      this.rightCheckedCount = this.leafCount(this.toData);
    } else {
      this.rightCheckedCount = this.leafCount([nodeObj]);
    }
    if (isChecked) {
      this.refreshCheckedTransferTitle(isLeftSide);
    } else {
      this.refreshTransferTitle();
    }
  }

  // 更新穿梭框的標題(即內容數量)
  refreshTransferTitle() {
    this.fromDataCount = this.leafCount(this.fromData);
      this.toDataCount = this.leafCount(this.toData);
      this.title = [`${this.fromDataCount}項`, `${this.toDataCount}項`];
  }

  // 更新選擇時的標題(選擇葉節點數量 / 總葉節點數量項)
  refreshCheckedTransferTitle(isLeftSide) {
    if (isLeftSide) {
      this.title = [`${this.leftCheckedCount} / ${this.fromDataCount}項`, `${this.toDataCount}項`];
    } else {
      this.title = [`${this.fromDataCount}項`, `${this.rightCheckedCount} / ${this.toDataCount}項`];
    }
  }

  // 找出樹的所有葉節點數量
  leafCount(treeData) {
    let count = 0;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i]?.children?.length) {
        count += this.leafCount(treeData[i].children);
      } else {
        count += 1;
      }
    }
    return count;
  }
}
