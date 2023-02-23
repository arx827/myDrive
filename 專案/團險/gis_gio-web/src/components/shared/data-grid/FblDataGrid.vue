<template>
  <div>
    <!-- empty -->
    <template v-if="data.length === 0 || emptyData">
      <a-empty>
        <span slot="description">查無資料</span>
      </a-empty>
    </template>
    <div
      v-else
      class="fblDataGrid"
    >
      <a-table
        :rowKey="rowKey"
        :rowClassName="rowClassName"
        :bordered="bordered"
        :size="size"
        :data-source="data"
        :loading="loading"
        :pagination="pagination"
        :scroll="scroll"
        :customRow="rowAction"
        @change="handleTableChange"
      >
        <a-table-column
          v-for="col in columns"
          :key="uuid() + col.property"
          :title="col.title"
          :width="col.width + 'px'"
          :fixed="col.fixed ? col.fixed : false"
          :align="col.align ? col.align : 'left'"
          :sorter="col.sorter"
          :custom-render="col.customRender"
        >
          <template slot-scope="record">
            <div v-if="col.type === 'TEMPLATE'">
              <slot
                :name="col.template"
                :data="record"
              />
            </div>
            <div v-if="col.type === 'PLAIN'">
              <a
                v-if="col.inspect"
                @click="handleInspectClick(record)"
              >{{
                plainTextOf(record, col)
              }}</a>
              <span v-if="!col.inspect">
                {{ plainTextOf(record, col) }}
              </span>
            </div>
            <div v-if="col.type === 'ACTION'">
              <a
                v-for="action in exposedActionsOf(col.actions)"
                :key="action.name"
                @click="handleActionClick(record, action)"
              >
                {{ action.title }}
              </a>
              <a-divider
                v-if="exposedActionsOf(col.actions).length > 0"
                type="vertical"
              />
              <a-dropdown v-if="moreActionsOf(col.actions).length > 0">
                <a
                  class="ant-dropdown-link"
                  @click="(e) => e.preventDefault()"
                >
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
            <div v-if="col.type === 'BADGE'">
              <a-badge
                :color="badgeColorOf(record, col)"
                :text="plainTextOf(record, col)"
              />
            </div>
            <div v-if="col.type === 'TAG'">
              <a-tag :color="tagColorOf(record, col)">
                {{ plainTextOf(record, col) }}
              </a-tag>
            </div>
            <div v-if="col.type === 'SELECTION'">
              <div v-if="record.verify == ''">
                <a-select
                  :placeholder="'請選擇'"
                  style="width: 100%"
                  mode="default"
                  :dropdownMatchSelectWidth="false"
                  :allowClear="true"
                  @change="handleChange(record, $event)"
                >
                  <a-select-option
                    v-for="option in col.options"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </div>
              <div
                v-for="option in col.options"
                v-else
                :key="option.value"
                :value="option.value"
              >
                <span v-if="record.verify === option.value">
                  {{ option.label }}
                </span>
              </div>
            </div>
            <div v-if="col.type === 'TIPS'">
              <a-tooltip
                placement="top"
                :title="record.tipsTxt"
              >
                {{ plainTextOf(record, col) }}
              </a-tooltip>
            </div>
          </template>
        </a-table-column>
      </a-table>
      <!-- <p
        v-if="pageInfoShow"
        class="pageInfo"
      >
        顯示<span class="numStyle">{{ pageInfo.rangeStart }}</span>到<span class="numStyle">{{ pageInfo.rangeEnd }}</span>筆,共<span class="numStyle">{{ pageTotal }}</span>筆紀錄
      </p> -->
      <!-- <div ref="toolTipDiv" id="toolTipDiv">
        <div class="tooltip" v-show="rowTipsTxt">
          <span class="tooltiptext" :style="{width: tipWidth}">{{ rowTipsTxt }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="tsx">
import { Pagination } from 'ant-design-vue';
import { Column } from 'ant-design-vue/types/table/column';
import {
  Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { uuid } from 'vue-uuid';
import {
  FblAction, FblColumn, FblColumnType, FblRow,
} from './models';

@Component({})
export default class FblDataGrid<T> extends Vue {
  @Prop({ default: 'key' })
  rowKey!: string;

  @Prop({ default: false })
  bordered!: boolean;

  @Prop({ default: 'small' })
  size!: string;

  @Prop({ default: [] })
  columns!: Array<FblColumn<T>>; // 定義要顯示哪一些欄位.

  renderColumns: Array<any> = [];

  @Prop({ default: [] })
  data!: Array<T>;

  @Prop({ default: '' })
  pagination!: Pagination;

  @Prop({ default: false })
  loading!: boolean;

  @Prop()
  scroll!: string;

  @Prop()
  emptyData!: boolean;

  @Prop()
  rowClassName: string;

  @Prop()
  rowTipsTxt: string;

  @Prop()
  countersign: boolean;

  @Watch('columns')
  onColumnsChanged() {
    this.renderColumns = this.columns
      .filter((c) => !c.hidden)
      .map((c) => {
        if (c.type == FblColumnType.BADGE) {
          return {
            title: c.title,
            dataIndex: c.property,
            key: c.property,
            slots: { customRender: 'badge' },
          };
        }
        return {
          title: c.title,
          dataIndex: c.property,
          key: c.property,
          scopedSlots: { customRender: 'plain', column: c },
        };
      });
  }

  // -------- 新增customRow功能
  // Bind Different Events to Click and Double Click
  // dbclick時也會觸發click，須設定延遲
  timer = 0;

  delay = 200;

  prevent = false;

  // 目前顯示比數 資訊
  public pageInfo: {
    total: number | string;
    rangeStart: number;
    rangeEnd: number;
  } = {
    total: this.pagination.total,
    rangeStart: 1,
    rangeEnd: this.pagination.pageSize,
  };

  get pageInfoShow(): boolean {
    return this.pageInfo.total > 0;
  }

  // 非同步 pageTotal 處理
  pageTotal = '';

  @Watch('pagination.total', { immediate: true })
  private paginationChange(newVal) {
    this.pageTotal = newVal;
  }

  rowAction(data: T, index) {
    return {
      on: {
        click: () => {
          this.timer = setTimeout(() => {
            if (!this.prevent) {
              this.$emit('rowClick', {
                data,
                index,
              });
            }
            this.prevent = false;
          }, this.delay);
        },
        dblclick: () => {
          clearTimeout(this.timer);
          this.prevent = true;
          this.$emit('rowDblclick', {
            data,
            index,
          });
        },
        mouseover: (event) => {
          // this.setRowTipsDom(event);
          this.$emit('rowMouseover', {
            data,
            index,
            event,
          });
        },
        mouseleave: (event) => {
          this.$emit('rowMouseleave', {
            data,
            index,
            event,
          });
        },
      },
    };
  }

  handleActionClick(data: T, action: FblAction<T>) {
    this.$emit('actionClick', {
      row: {
        data,
      },
      action,
    });
  }

  handleMoreActionClick(e, data, actions: Array<FblAction<T>>) {
    const action = actions.filter((a) => a.name === e.key)[0];
    this.handleActionClick(data, action);
  }

  handleInspectClick(data: T) {
    this.$emit('inspectClick', {
      data,
    });
  }

  handleTableChange(pagination, filters, sorter) {
    this.$emit('tableChange', pagination);
  }

  handleRowClick(data: T) {
    this.$emit('rowClick', {
      data,
    });
  }

  exposedActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    return actions.filter((a) => !a.more);
  }

  moreActionsOf(actions: FblAction<T>[]): FblAction<T>[] {
    return actions.filter((a) => a.more);
  }

  widthOf(column: FblColumn<T>) {
    return `${column.width}px`;
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
    if (typeof column.badgeColor === 'function') {
      return column.badgeColor(data);
    }
    return column.badgeColor;
  }

  tagColorOf(data: T, column: FblColumn<T>): string {
    if (!column.tagColor) {
      return null;
    }
    if (typeof column.tagColor === 'function') {
      return column.tagColor(data);
    }
    return column.tagColor;
  }

  handleChange(data: T, option: string) {
    this.$emit('actionSelect', {
      row: {
        data,
      },
      option,
    });
  }

  uuid() {
    return uuid.v4();
  }

  // setRowTipsDom(e) {
  //   let toolTipDivDom: any = this.$refs.toolTipDiv;
  //   e.target.addEventListener("mousemove", (e) => {
  //     toolTipDivDom.style.display = "block";
  //     toolTipDivDom.style.left = (e as MouseEvent).x + "px";
  //     toolTipDivDom.style.top = (e as MouseEvent).y - 20 + "px";
  //   });
  //   e.target.addEventListener("mouseout", (e) => {
  //     toolTipDivDom.style.display = "none";
  //   });
  // }

  created() {
    this.onColumnsChanged();
  }

  get tipWidth() {
    const unit = 1.2;
    let tipStringCount = 0;
    if (this.rowTipsTxt) {
      tipStringCount = this.rowTipsTxt.length;
    }
    return `${tipStringCount * unit}em`;
  }
}
</script>

<style lang="scss">
</style>
