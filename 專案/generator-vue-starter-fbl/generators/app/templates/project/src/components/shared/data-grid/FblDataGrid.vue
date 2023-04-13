<template>
  <div>
    <!-- 冠儒新增rowSelection及scroll -->
    <a-table
      ref="tableRef"
      :rowKey="rowKey"
      :bordered="bordered"
      :size="size"
      :row-selection="rowSelection"
      :data-source="data"
      :loading="loading"
      :pagination="pagination"
      :scroll="scroll"
      @change="handleTableChange"
    >
      <a-table-column
        v-for="(col, index) in renderColumns"
        :key="index.toString()"
        :title="col.title"
        :sorter="col.sorter"
        :width="widthOf(col)"
        :fixed="col.fixed"
      >
        <template slot-scope="record">
          <div v-if="col.type === 'TEMPLATE'">
            <slot :name="col.template" v-bind:data="record"> </slot>
          </div>
          <div v-if="col.type === 'PLAIN'">
            <a v-if="col.inspect" @click="handleInspectClick(record)">{{
              plainTextOf(record, col)
            }}</a>
            <span v-if="!col.inspect">
              {{ plainTextOf(record, col) }}
            </span>
          </div>
          <div v-if="col.type === 'ACTION'">
            <a-button
              v-for="action in exposedActionsOf(col.actions)"
              :type="col.actionButtonType ? col.actionButtonType : 'link'"
              :key="action.name"
              :disabled="shouldDisableAction(record, action, col)"
              @click="handleActionClick(record, action)"
            >
              {{ action.title }}
            </a-button>
            <a-divider
              v-if="moreActionsOf(col.actions).length > 0"
              type="vertical"
            ></a-divider>
            <a-dropdown v-if="moreActionsOf(col.actions).length > 0">
              <a-button
                class="ant-dropdown-link"
                :type="col.actionButtonType ? col.actionButtonType : 'link'"
                @click="(e) => e.preventDefault()"
              >
                {{ col.moreActionTitle ? col.moreActionTitle : "更多" }}
                <a-icon type="down" />
              </a-button>
              <a-menu
                slot="overlay"
                @click="handleMoreActionClick($event, record, col.actions)"
              >
                <a-menu-item
                  v-for="action in moreActionsOf(col.actions)"
                  :key="action.name"
                  :disabled="shouldDisableAction(record, action, col)"
                >
                  {{ action.title }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div v-if="col.type === 'BADGE'">
            <a-badge
              :color="badgeColorOf(record, col)"
              :text="plainTextOf(record, col)"
            ></a-badge>
          </div>
          <div v-if="col.type === 'TAG'">
            <a-tag :color="tagColorOf(record, col)">
              {{ plainTextOf(record, col) }}
            </a-tag>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script lang="ts">
/* import 引用其他組件區塊 */
import { Pagination } from "ant-design-vue";
import { Column } from "ant-design-vue/types/table/column";
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { uuid } from "vue-uuid";
import {
  FblAction,
  FblColumn,
  FblColumnType,
  FblRow,
  SortItem,
} from "./models";
/* import 引用其他組件區塊 */

/* 定義 Template 用到的 Component */
/* 使用TypeScript Class方法，定義組件FblDataGrid<T>，並以泛型傳入資料型別 */
@Component
export default class FblDataGrid<T> extends Vue {
  /* data定義區塊，定義Template用到雙向資料綁定的變數 */
  
  //使用@Prop定義父元件傳到此元件的參數
  @Prop({ default: "key" })
  rowKey!: string;

  @Prop({ default: false })
  bordered!: boolean;
  // 冠儒新增rowSelection及scroll
  @Prop()
  rowSelection: object;

  @Prop()
  scroll: { x: number | true; y: number };
  // 冠儒新增rowSelection及scroll
  @Prop({ default: "default" })
  size!: string;

  @Prop({ default: [] })
  columns!: Array<FblColumn<T>>;
  renderColumns: Array<FblColumn<T>> = [];

  @Prop({ default: [] })
  data!: Array<T>;

  @Prop()
  pagination!: Pagination;

  @Prop({ default: false })
  loading!: boolean;

  @Prop()
  countersign: boolean;
  /* data定義區塊，定義Template用到雙向資料綁定的變數 */

  /* Vue 生命週期 Hooks function 區塊 */
  //Vue Watch 變數呼叫方法
  @Watch("columns")
  onColumnsChanged() {
    this.renderColumns = this.columns.filter((c) => !c.hidden);
    // let filteredColumns = this.columns.filter((col) => !col.isCountersign);
    // this.renderColumns = filteredColumns;
    this.$nextTick(() => {
      if (this.$refs.tableRef) {
        const nativeTable = (this.$refs.tableRef as Vue).$el;
        this.renderColumns.forEach((c, idx) => {
          const head: any = nativeTable.querySelector(
            `.ant-table-thead tr th[key="${idx}"]`
          );
          if (c.minWidth) {
            head.style.minWidth = `${c.minWidth}px`;
          } else {
            head.style.minWidth = undefined;
          }
        });
      }
      // console.log("nt", this.$refs.nativeTable);
    });
  }
  //組件初始化方法，將一些初始化資料，呼叫在此方法中實作
  created() {
    this.onColumnsChanged();
  }
  /* Vue 生命週期 Hooks function 區塊 */
 
  /* 自訂義方法區塊 */
  //觸發資料列中Action button時的方法
  handleActionClick(data: T, action: FblAction<T>) {
    //執行呼叫元件綁定的actionClick的事件
    this.$emit("actionClick", {
      row: {
        data,
      },
      action,
    });
  }
  //觸發資料列中"更多Action"時的方法
  handleMoreActionClick(e, data, actions: Array<FblAction<T>>) {
    const action = actions.filter((a) => a.name === e.key)[0];
    this.handleActionClick(data, action);
  }
  //資料列中觸發點擊資料列的方法
  handleInspectClick(data: T) {
    //執行呼叫元件綁定的inspectClick的事件
    this.$emit("inspectClick", {
      data,
    });
  }
  //觸發資料表中排序或分頁按鈕的方法
  handleTableChange(pagination, filters, sort) {
    // this.pageSize = size;
    console.log(sort);
    const col = this.renderColumns[parseInt(sort.columnKey)];
    const s: SortItem =
      sort && sort.order
        ? {
            selector: col.sortProperty
              ? col.sortProperty
              : col.property
              ? col.property.toString()
              : null,
            desc: sort.order === "descend",
          }
        : undefined;
    //執行呼叫元件綁定的tableChange的事件
    this.$emit("tableChange", { pagination, sort: s });
  }
  //點擊列事件
  handleRowClick(data: T) {
    this.$emit("rowClick", {
      data,
    });
  }
  //判斷不是"更多"Action
  exposedActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    return actions.filter((a) => !a.more);
  }
  //判斷是否為"更多"Action
  moreActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    return actions.filter((a) => a.more);
  }
  //處理width
  widthOf(column: FblColumn<T>) {
    return column.width + "px";
  }
  //處理plainText格式
  plainTextOf(data: T, column: FblColumn<T>): string {
    if (column.formatter) {
      return column.formatter(data);
    }
    const props = column.property.toString().split(".");
    let retVal = data[props[0]];
    props.forEach((p, i) => {
      if (i > 0) {
        if(retVal !== undefined && retVal !== null){
          retVal = retVal[props[i]];  
        }
      }
    });
    return retVal;
  }
  //處理圖標型態顏色
  badgeColorOf(data: T, column: FblColumn<T>): string {
    if (!column.badgeColor) {
      return null;
    }
    if (typeof column.badgeColor === "function") {
      return column.badgeColor(data);
    }
    return column.badgeColor;
  }
  //處理tag型態顏色
  tagColorOf(data: T, column: FblColumn<T>): string {
    if (!column.tagColor) {
      return null;
    }
    if (typeof column.tagColor === "function") {
      return column.tagColor(data);
    }
    return column.tagColor;
  }
  //處理Action按鈕是否可用
  shouldDisableAction(
    data: T,
    action: FblAction<T>,
    column: FblColumn<T>
  ): boolean {
    if (typeof action.disabled === "function") {
      console.log(data);
      return (action.disabled as (row: FblRow<T>) => boolean)({ data });
    }
    return action.disabled as boolean;
  }
  
  uuid() {
    return uuid.v4();
  }
  
}
</script>

<style lang="scss">
</style>
