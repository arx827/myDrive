<template>
  <div>
    <!-- 冠儒新增rowSelection及scroll -->
    <a-table
      ref="tableRef"
      :row-key="rowKey"
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
        :custom-render="customRenderOf(col)"
      >
        <template slot-scope="text,record,slotIndex">
          <div v-if="col.type === 'TEMPLATE'">
            <slot
              :index="slotIndex"
              :name="col.template"
              :data="record"
              :property="col.property"
              :text="(col.property) ? plainTextOf(record, col) : ''"
            />
          </div>
          <div v-else-if="col.type === 'PLAIN'">
            <a
              v-if="col.inspect"
              @click="handleInspectClick(record)"
            >{{
              plainTextOf(record, col)
            }}</a>
            <span
              v-else-if="(typeof col.pendingEdit === 'function' && col.pendingEdit(record) || typeof col.pendingEdit === 'boolean' && col.pendingEdit) && !plainTextOf(record, col)"
              class="pendingEdit"
            >待編輯</span>
            <span v-else>{{ plainTextOf(record, col) }}</span>
          </div>
          <div v-else-if="col.type === 'ACTION'">
            <a-button
              v-for="action in exposedActionsOf(col.actions)"
              :key="action.name"
              :type="col.actionButtonType ? col.actionButtonType : 'link'"
              :disabled="shouldDisableAction(record, action, col)"
              @click="handleActionClick(record, action)"
            >
              {{ action.title }}
            </a-button>
            <a-divider
              v-if="moreActionsOf(col.actions).length > 0"
              type="vertical"
            />
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
          <div v-else-if="col.type === 'BADGE'">
            <a-badge
              :color="badgeColorOf(record, col)"
              :text="plainTextOf(record, col)"
            />
          </div>
          <div v-else-if="col.type === 'TAG'">
            <a-tag :color="tagColorOf(record, col)">
              {{ plainTextOf(record, col) }}
            </a-tag>
          </div>
          <div v-else-if="col.type === 'ELLIPSIS'">
            <span
              v-if="(typeof col.pendingEdit === 'function' && col.pendingEdit(record) || typeof col.pendingEdit === 'boolean' && col.pendingEdit) && !plainTextOf(record, col)"
              class="pendingEdit"
            >待編輯</span>
            <template v-else>
              <a-popover
                overlay-class-name="popover--summary"
                placement="top"
                :trigger="(plainTextOf(record, col).length < col.ellipsisNum || getWindowSize == 'xxl') ? '': 'hover'"
              >
                <template slot="content">
                  <span>
                    {{ plainTextOf(record, col) }}
                  </span>
                </template>
                {{ ellipsisString(col.ellipsisNum, plainTextOf(record, col)) }}
              </a-popover>
            </template>
          </div>
        </template>
      </a-table-column>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Pagination } from 'ant-design-vue';
import { Column } from 'ant-design-vue/types/table/column';
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { uuid } from 'vue-uuid';
import {
	FblAction,
	FblColumn,
	FblColumnType,
	FblRow,
	SortItem,
} from './models';

@Component
export default class FblDataGrid<T> extends Vue {
  @Getter getWindowSize!: string;

  @Prop({ default: 'key' })
  rowKey!: string;

  @Prop({ default: false })
  bordered!: boolean;

  // 冠儒新增rowSelection及scroll
  @Prop()
  rowSelection: object;

  @Prop()
  scroll: { x: number | true; y: number };

  // 冠儒新增rowSelection及scroll
  @Prop({ default: 'default' })
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

  @Watch('columns')
  onColumnsChanged() {
  	this.renderColumns = this.columns.filter((c) => !c.hidden);
  	// let filteredColumns = this.columns.filter((col) => !col.isCountersign);
  	// this.renderColumns = filteredColumns;
  	this.$nextTick(() => {
  		if (this.$refs.tableRef) {
  			const nativeTable = (this.$refs.tableRef as Vue).$el;
  			this.renderColumns.forEach((c, idx) => {
  				const head: any = nativeTable.querySelector(
  					`.ant-table-thead tr th[key="${idx}"]`,
  				);
  				if (c.minWidth) {
  					head.style.minWidth = `${c.minWidth}`;
  				} else {
  					head.style.minWidth = undefined;
  				}
  			});
  		}
  		// console.log("nt", this.$refs.nativeTable);
  	});
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

  handleTableChange(pagination, filters, sort) {
  	// this.pageSize = size;
  	// console.log(sort);
  	const col = this.renderColumns[parseInt(sort.columnKey)];
  	const s: SortItem = sort && sort.order
      	? {
      		selector: col.sortProperty
      			? col.sortProperty
      			: col.property
      				? col.property.toString()
      				: null,
      		desc: sort.order === 'descend',
      	}
      	: undefined;
  	this.$emit('tableChange', { pagination, sort: s });
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
  	return `${column.width}`;
  }

  plainTextOf(data: T, column: FblColumn<T>): string {
  	if (column.formatter) {
  		return column.formatter(data);
  	}
  	const props = column.property.toString().split('.');
  	let retVal = data[props[0]];
  	props.forEach((p, i) => {
  		if (i > 0) {
  			if (retVal !== undefined && retVal !== null) {
  				retVal = retVal[props[i]];
  			}
  		}
  	});
  	return retVal;
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

  customRenderOf(column: FblColumn<T>): (data, record, index, _column) => any {
  	if (column.rowSpanKey) {
  		return (data, record, index, _column) => {
  			const idx = this.data.indexOf(data);
  			const key = column.rowSpanKey(data);
  			const text = this.plainTextOf(data, column);

  			if (idx > 0) {
  				const prevIdx = idx - 1;
  				const prevData = this.data[prevIdx];
  				const prevKey = column.rowSpanKey(prevData);
  				if (prevKey == key) {
  					return {
  						children: text,
  						attrs: {
  							rowSpan: 0,
  						},
  					};
  				}
  			}
  			let span = 1;
  			for (let i = idx + 1; i < this.data.length; i++) {
  				const succIdx = i;
  				const succData = this.data[succIdx];
  				const succKey = column.rowSpanKey(succData);
  				if (succKey == key) {
  					span++;
  				} else {
  					break;
  				}
  			}
  			return {
  				children: text,
  				attrs: {
  					rowSpan: span,
  				},
  			};
  		};
  	} if (column.customRender) {
  		return column.customRender;
  	}
  	return undefined;
  }

  shouldDisableAction(
  	data: T,
  	action: FblAction<T>,
  	column?: FblColumn<T>,
  ): boolean {
  	if (typeof action.disabled === 'function') {
  		// console.log(data);
  		return (action.disabled as (row: FblRow<T>) => boolean)({ data });
  	}
  	return action.disabled as boolean;
  }

  ellipsisString(length: number, string: string): string {
  	if (this.getWindowSize !== 'xxl' && string.length > length) {
  		return `${string.slice(0, (length - 1))}...`;
  	}
  		return string;
  }

  uuid() {
  	return uuid.v4();
  }

  created() {
  	this.onColumnsChanged();
  }
}
</script>

<style lang="scss">
</style>
