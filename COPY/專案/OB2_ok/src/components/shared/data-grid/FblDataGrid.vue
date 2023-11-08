<template>
  <a-table
    :class="themeColor"
    :rowClassName="rowClassName"
    :rowKey="rowKey"
    :bordered="bordered"
    :size="size"
    :data-source="data"
    :loading="loading"
    :pagination="pagination ? pagination : false"
    :scroll="scroll"
    :row-selection="checkAllSelection=='pendingPage' ? pendingPageRowSelection : undefined"
    @change="handleTableChange"
  >
    <a-table-column
      v-for="(col, index) in renderColumns"
      :key="index.toString()"
      :title="col.title"
      :sorter="col.sorter"
      :defaultSortOrder="col.defaultSortOrder"
      :width="col.width + 'px'"
      :align="col.align ? col.align : 'left'"
      :fixed="col.fixed ? col.fixed : false"
      :custom-render="col.customRender"
    >
      <template slot-scope="record">
        <div v-if="col.type === 'TEMPLATE'">
          <slot :name="col.template" v-bind:data="record"> </slot>
        </div>
        <div style="word-break: break-all" v-if="col.type === 'PLAIN'">
          <a
            v-if="inspectOf(record, col)"
            @click="handleInspectClick(record)"
            >{{ plainTextOf(record, col) }}</a
          >
          <span v-if="!inspectOf(record, col)">
            {{ plainTextOf(record, col) }}
          </span>
        </div>
        <div
          class="ellipsisTest"
          @click="handleEllipsisClick($event, plainTextOf(record, col))"
          @mouseleave="handleEllipsisMouseLeave"
          v-if="col.type === 'ELLIPSIS'"
        >
          {{ plainTextOf(record, col) }}
        </div>
        <div v-if="col.type == 'CHECKBOX'">
          <a-checkbox
            :disabled="plainTextOf(record, col)==null || (record.batchCount != null && record.batchCount > 0)"
            @change="handleCheckedChange($event, record)"
            :defaultChecked="checkSelected(record)"
            :checked="checkSelected(record)"
          >
          </a-checkbox>
        </div>
        <div v-if="col.type === 'ACTION'">
          <a
            v-for="action in exposedActionsOf(col.actions)"
            :key="action.name"
            @click="handleActionClick(record, action)"
          >
            <a-icon
              v-if="showEditAction(record, action)"
              type="form"
              style="font-size: 24px; color: #000000"
            />
            <a-icon
              v-else-if="showDeleteAction(record, action)"
              type="delete"
              style="font-size: 24px; color: #f5222d"
            />
            <a-icon
              v-else-if="action.unlock"
              type="unlock"
              style="font-size: 24px; color: #000000"
            />
            <a-icon
              v-else-if="action.add"
              type="plus"
              style="font-size: 24px; color: #000000"
            />

            <a-icon
              v-else-if="record.pdfFileId != null&&action.filePdf"
              type="file-pdf"
              style="font-size: 24px; color: #000000"
            />

            <a-icon
              v-else-if="action.setting"
              type="setting"
              style="font-size: 24px"
            />
            <a-icon
              v-else-if="showDownloadAction(record, action)"
              type="download"
              style="font-size: 24px"
            />
            <a-button v-else-if="action.button" type="primary">{{
              action.title
            }}</a-button>
            <span v-else-if="action.text">{{ action.title }}</span>

            <a-divider
              v-if="dividerActionOf(col.actions, action.name, record)"
              type="vertical"
            ></a-divider>
          </a>

          <a-divider
            v-if="moreActionsOf(col.actions).length > 0"
            type="vertical"
          ></a-divider>
          <a-dropdown v-if="moreActionsOf(col.actions).length > 0">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              {{ col.moreActionTitle ? col.moreActionTitle : "更多" }}
              <a-icon type="down" />
            </a>
            <a-menu
              slot="overlay"
              @click="handleMoreActionClick($event, record, col.actions)"
            >
              <a-menu-item
                v-for="action in moreActionsOf(col.actions)"
                :key="action.name"
              >
                {{ action.title }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>

        <div v-if="col.type === 'ACTIONCONTROL' && 'N' == record.cancelLetter && 'M' == record.manualLetterStatus && Date.parse(record.mailByPostDate) >= Date.parse(record.systemDate)">
          <a
            v-for="action in exposedActionsOf(col.actions)"
            :key="action.name"
            @click="handleActionClick(record, action)"
          >
            <a-button v-if="action.button" type="primary">{{
              action.title
            }}</a-button>
           
            <a-upload 
              v-if="action.uploadButton"
              :multiple="false"
              :before-upload="beforeUpload"
              :showUploadList="false"
              @change="handleUploadChange(record)"
            >
              <a-button   type="primary">
                
                {{ action.title }}
              </a-button>
            </a-upload>
          

            <a-divider
              v-if="dividerActionOf(col.actions, action.name, record)"
              type="vertical"
            ></a-divider>
          </a>
        </div>

        <div v-if="col.type === 'ACTIONCONTROL' && 'N' == record.cancelLetter && 'B' == record.manualLetterStatus && Date.parse(record.mailByPostDate) > Date.parse(record.systemDate)">
          <a
            v-for="action in exposedActionsOf(col.actions)"
            :key="action.name"
            @click="handleActionClick(record, action)"
          >
            <a-button v-if="action.button" type="primary">{{
              action.title
            }}</a-button>
           
            <a-upload 
              v-if="action.uploadButton"
              :multiple="false"
              :before-upload="beforeUpload"
              :showUploadList="false"
              @change="handleUploadChange(record)"
            >
              <a-button   type="primary">
                
                {{ action.title }}
              </a-button>
            </a-upload>
          

            <a-divider
              v-if="dividerActionOf(col.actions, action.name, record)"
              type="vertical"
            ></a-divider>
          </a>
        </div>

        <div v-if="col.type === 'ACTIONCONTROL' && 'N' == record.cancelLetter && 'A' == record.manualLetterStatus ">
          <a
            v-for="action in exposedActionsOf(col.actions)"
            :key="action.name"
            @click="handleActionClick(record, action)"
          >
            <a-button v-if="action.button" type="primary">{{
              action.title
            }}</a-button>
           
            <a-upload 
              v-if="action.uploadButton"
              :multiple="false"
              :before-upload="beforeUpload"
              :showUploadList="false"
              @change="handleUploadChange(record)"
            >
              <a-button   type="primary">
                
                {{ action.title }}
              </a-button>
            </a-upload>
          

            <a-divider
              v-if="dividerActionOf(col.actions, action.name, record)"
              type="vertical"
            ></a-divider>
          </a>
        </div>

        <div v-if="col.type === 'SELECTION'">
          <a-select
            style="width: 200px"
            v-model="record.noLetterReasonCode"
            :options="
              record.noLetterReasonOptions != null
                ? record.noLetterReasonOptions
                : null
            "
            @change="onSelectOptionsChange"
            :disabled="!checkSelected(record)"
          >
          </a-select>
          <a-input
            v-model="record.noLetterContent"
            v-if="
              '' != record.noLetterReasonCode &&
              'S' == record.noLetterReasonCode
            "
            style="width: 350px"
            :maxLength="30"
            @change="onSelectionInputChange(record)"
          ></a-input>
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
        <div v-if="col.type === 'COLLAPSE'">
          <div class="content-collapse">
            <div>
              <p
                v-if="!isActive[record.rowkey]"
                :class="{
                  'text-ellipsis':
                    record[col.property] &&
                    record[col.property].length > col.maxLength,
                }"
                :style="{ 'max-width': `${col.maxLength * col.fontSize}px` }"
              >
                {{ record[col.property] }}
              </p>
              <slide-up-down :active="isActive[record.rowkey]">
                <p
                  :style="{ 'max-width': `${col.maxLength * col.fontSize}px` }"
                >
                  {{ record[col.property] }}
                </p>
              </slide-up-down>
            </div>
            <div
              v-if="
                record[col.property] &&
                record[col.property].length > col.maxLength
              "
              class="ml-auto"
            >
              <div
                class="icon-arrow"
                :class="{
                  'icon-arrow__down': !isActive[record.rowkey],
                  'icon-arrow__up': isActive[record.rowkey],
                }"
                @click="handleCollapse(record)"
              />
            </div>
          </div>
        </div>

        <div v-if="col.type === 'INPUTNUMBER'">
          <a-input-number
            :default-value="plainTextOf(record, col)"
            :text="plainTextOf(record, col)"
            @change="handleInPutNumberChange($event, record, col)"
            :min="0"
          />
        </div>
        <!-- 一個column呈現多筆超連結 -->
        <div style="word-break: break-all" v-if="col.type === 'LINK'">
          <p v-for="(item, index) in record[col.template].length" :key="item">
            <!-- 各link的名稱 -->
            <a @click="handleLinkClick(record, col, index)">
              {{ linkTextOf(record, col, item) }}
            </a>
            <!-- 中間需間格的符號 -->
            <span v-if="index + 1 != record[col.template].length">{{
              col.spliteSign
            }}</span>
          </p>
        </div>
      </template>
    </a-table-column>
    <!-- <a-table-column>
      <a slot="title" >
          <a-icon type="plus" />  新增
      </a>
    </a-table-column> -->
  </a-table>
</template>

<script lang="ts">
import ValidationUtil from "@/assets/config/ValidationUtil";
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

@Component
export default class FblDataGrid<T> extends Vue {
  @Prop({ default: "key" })
  rowKey!: string;

  @Prop({ default: false })
  bordered!: boolean;

  @Prop({ default: "small" })
  size!: string;

  @Prop({ default: [] })
  columns!: Array<FblColumn<T>>; // 定義要顯示哪一些欄位.

  renderColumns: Array<any> = [];

  noLetterContent: string = "";
  // @Prop()
  // templates: { [key: string]: TemplateRef<T> } = {};

  @Prop({ default: [] })
  data!: Array<T>;

  // @Prop()
  // pageIndex: number = 0;

  @Prop()
  pagination: Pagination;

  //判斷checkbox是否被勾選
  @Prop()
  public checkSelected: string;

  // @Prop()
  // pageSize: number = 10;

  // @Prop()
  // pageSizeOptions: Array<number> = [10, 20, 50, 100];

  // @Prop()
  // pageable: boolean = false;

  @Prop({ default: false })
  loading!: boolean;

  @Prop()
  scroll!: object;

  @Prop()
  rowClassName!: object;

  @Prop({ default: null })
  themeColor!: string;

  @Prop({ default: null })
  checkAllSelection!: string;

  // 判斷每筆資料要收合/展開內容 (true 為展開，false 為收合)
  isActive: { [rowkey: number]: boolean } = {};

  // @Prop()
  // total: number = 0;

  // frontPagination: boolean = false;

  // @Output()
  // actionClick = new EventEmitter<FblActionEvent<T>>();

  // @Output()
  // inspectClick = new EventEmitter<FblRow<T>>();

  // @Output()
  // rowClick = new EventEmitter<FblRow<T>>();

  // @Output()
  // pageSizeChange = new EventEmitter<number>();

  // @Output()
  // pageIndexChange = new EventEmitter<number>();

  // constructor() {}

  noLetterReasonCode: String = "";

  @Watch("columns")
  onColumnsChanged() {
    //顯示總筆數
    //B1683 若pagination為false 不對showTotal做判斷
    if (this.pagination) {
      this.pagination.showTotal = this.pagination.showTotal
        ? (total) => `共 ${total} 筆`
        : null;
    }

    this.renderColumns = this.columns.filter((c) => !c.hidden);
    // .map((c) => {
    //   if (c.type == FblColumnType.BADGE) {
    //     return {
    //       title: c.title,
    //       dataIndex: c.property,
    //       key: c.property,
    //       slots: { customRender: "badge" },
    //     };
    //   } else {
    //     return {
    //       title: c.title,
    //       dataIndex: c.property,
    //       key: c.property,
    //       scopedSlots: { customRender: "plain", column: c },
    //     };
    //   }
    // });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.pageSizeOptions) {
  //     this.pageSize = this.pageSizeOptions[0];
  //   }
  // }

  /**
   * @description 自行控制是否顯示刪除按鈕
   * @param data
   * @param action
   *
   * @version 2021/09/29
   * @author B1529
   */
  showDeleteAction(data: T, action: FblAction<T>): boolean {
    if (action.formatter) {
      return action.formatter(data) && action.name == "delete";
    }

    if (!ValidationUtil.isEmpty(action.formatterBoolean)) {
      return action.formatterBoolean && action.name == "delete";
    }

    return ValidationUtil.isEmpty(action.name == "delete" && action.delete)
      ? false
      : action.delete;
  }

  /**
   * @description 自行控制是否顯示編輯按鈕
   * @param data
   * @param action
   *
   * @version 2021/10/08
   * @author B1683
   */
  showEditAction(data: T, action: FblAction<T>): boolean {
    if (action.formatter) {
      return action.formatter(data) && action.name == "edit";
    }

    if (!ValidationUtil.isEmpty(action.formatterBoolean)) {
      return action.formatterBoolean && action.name == "edit";
    }

    return ValidationUtil.isEmpty(action.name == "edit" && action.edit)
      ? false
      : action.edit;
  }

  /**
   * @description 自行控制是否顯示下載按鈕
   * @param data
   * @param action
   *
   * @version 2022/02/24
   * @author B1842
   */
  showDownloadAction(data: T, action: FblAction<T>): boolean {
    if (action.formatter) {
      return action.formatter(data) && action.name == "download";
    }

    if (!ValidationUtil.isEmpty(action.formatterBoolean)) {
      return action.formatterBoolean && action.name == "download";
    }

    return ValidationUtil.isEmpty(action.name == "download" && action.download)
      ? false
      : action.download;
  }

  handleActionClick(data: T, action: FblAction<T>) {
    this.$emit("actionClick", {
      row: {
        data,
      },
      action,
    });
  }

  handleInPutNumberChange(event, record: T, col) {
    this.$emit("handleInPutNumberChange", event, col.property);
  }

  handleMoreActionClick(e, data, actions: Array<FblAction<T>>) {
    const action = actions.filter((a) => a.name === e.key)[0];
    this.handleActionClick(data, action);
  }

  handleInspectClick(data: T) {
    this.$emit("inspectClick", {
      data,
    });
  }

  handleTableChange(pagination, filters, sort) {
    // this.pageSize = size;

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
    this.$emit("tableChange", { pagination, sort: s });
  }

  handleCheckedChange($event, data: T) {
    this.$emit("checkedChange", {
      $event,
      row: {
        data,
      },
    });
  }

  onSelectOptionsChange($event, data: T) {
    this.$emit("onSelectOptionsChange", {
      $event,
      row: {
        data,
      },
    });
  }
  onSelectionInputChange(data: T) {
    this.$emit("onSelectionInputChange", {
      data,
    });
  }

  handleEllipsisClick($event, data: T) {
    this.$emit("handleEllipsisClick", $event, data);
  }

  handleEllipsisMouseLeave() {
    this.$emit("handleEllipsisMouseLeave");
  }

  handleRowClick(data: T) {
    this.$emit("rowClick", {
      data,
    });
  }

  /**
   * @description 觸發當前資料展開/收合
   * @param {rowkey} 解構賦值取出當前行鍵(data.rowkey)
   *
   * @version 2022/01/19
   * @author B1856
   */
  handleCollapse({ rowkey }) {
    this.$set(this.isActive, rowkey, !this.isActive[rowkey]);
  }


  //上傳前進行驗證
  beforeUpload(file: File){
    this.$emit("beforeUpload", file);

  }

  handleUploadChange(data:T){
  this.$emit("handleUploadChange", data);
      
  }

  exposedActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    // if (!actions) {
    //   return [];
    // }
    return actions.filter((a) => !a.more);
  }

  moreActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    // if (!actions) {
    //   return [];
    // }
    return actions.filter((a) => a.more);
  }

  // B1683 2021/12/03 追加過濾隱藏的icon
  dividerActionOf(actions: FblAction<T>[], name: string, data: T): boolean {
    const noMoreActions = actions.filter((a) =>
      a.formatter
        ? !a.more && a.formatter(data)
        : !ValidationUtil.isEmpty(a.formatterBoolean)
        ? a.formatterBoolean && !a.more
        : !a.more
    );

    let result = false;

    if (noMoreActions.length > 0) {
      // 找出陣列中最後一個元素比對
      if (noMoreActions.splice(-1)[0].name != name) {
        result = true;
      }
    }

    return result;
  }

  widthOf(column: FblColumn<T>) {
    // if (!column || !column.width) {
    //   return null;
    // }
    return column.width + "px";
  }
  plainTextOf(data: T, column: FblColumn<T>): string {
    if (column.formatter) {
      return column.formatter(data);
    }
    return (data as any)[column.property];
  }
  badgeColorOf(data: T, column: FblColumn<T>): string {
    if (!column.badgeColor) {
      return null;
    }
    if (typeof column.badgeColor === "function") {
      return column.badgeColor(data);
    }
    return column.badgeColor;
  }
  tagColorOf(data: T, column: FblColumn<T>): string {
    if (!column.tagColor) {
      return null;
    }
    if (typeof column.tagColor === "function") {
      return column.tagColor(data);
    }
    return column.tagColor;
  }
  inspectOf(data: T, column: FblColumn<T>): boolean {
    if (!column.inspect) {
      return null;
    }
    if (typeof column.inspect === "function") {
      return column.inspect(data);
    }
    return column.inspect;
  }
  uuid() {
    return uuid.v4();
  }
  handleLinkClick(data: T, column: FblColumn<T>, index: number) {
    console.log("data");
    this.$emit("linkClick", {
      row: {
        data,
      },
      column,
      index,
    });
  }
  // column內多筆資訊串接
  linkTextOf(data: T, column: FblColumn<T>, index: number): string {
    if (data[column.template].length > 0) {
      return (data as any)[column.template][index - 1][column.linkTemplate];
    }
    return (data as any)[column.property];
  }
  created() {
    this.onColumnsChanged();
  }

  pendingPageRowSelection = {
      onChange: (selectedRowKeys: (string | number)[], selectedRows: []) => {
        this.$emit("handleCheckAllSelection", selectedRows);
      },
      getCheckboxProps: records => {
        return{
          props:{
            disabled : records.caseCloseDate != null && records.caseReopen=='N',
          }
        }
      },
  
   }

}
</script>

<style lang="less" scoped>
/* 調整 table 間距 */
.ant-table-tbody > tr > td {
  padding: 5px !important;
}

/* 調整 table 字體大小 */
.ant-table-body {
  font-size: 14px;
}

/* ELLIPSIS 樣式(超過寬度以..省略) */
.ellipsisTest {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  text-align: "left";
}
</style>