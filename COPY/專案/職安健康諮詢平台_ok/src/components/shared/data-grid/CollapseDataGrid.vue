<template>
  <div>
    <a-table
      ref="tableHeaderScroll"
      class="table-forHeader"
      :row-key="rowKey"
      :columns="renderColumns"
      :pagination="pagination"
    >
      <template slot="footer">
        <a-collapse
          v-for="item in collapseTitleList"
          :key="item.key"
          v-model="activeKey"
        >
          <a-collapse-panel
            :key="item.key"
          >
            <span slot="header">
              <div
                v-for="(val, index) in item.value"
                :key="index.toString()"
                class="collapse-panel"
              > {{ val }} </div>
            </span>
            <a-table
              :ref="item.key"
              class="table-forBody"
              :row-key="rowKey"
              :data-source="data[item.key]"
              :columns="renderColumns"
              :pagination="pagination"
              @scroll="handleScroll"
            >
              <template
                slot="handleTemp"
                slot-scope="slotProps"
              >
                <slot
                  name="handleTemp"
                  :childSlotProps="slotProps"
                />
              </template>
            </a-table>
          </a-collapse-panel>
        </a-collapse>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import {
	CollapseContent,
	CollapseColumn,
} from './models';

@Component({})
export default class CollapseDataGrid<T> extends Vue {
  h = this.$createElement;

	@Prop()
	collapseContentData: CollapseContent // 展開收合內容

  @Prop({ default: [] })
  columns!: Array<any>;

  @Prop({ default: [] })
  data!: Array<any>;

  @Prop({ default: 'key' })
  rowKey!: string;

  @Prop()
  pagination;

  activeKey: Array<string> = [];

	collapseTitleList: Array<any> = [] // 收合表格的標題 陣列

	renderColumns: Array<CollapseColumn<T>> = [];

	/**
   * Func
   */
	getGridData(contentData): void {
		this.collapseTitleList = Object.keys(contentData).map((key) => {
			const { title, subTitle } = contentData[key];
			return {
				key,
				value: [title, subTitle],
			};
		});

  	this.collapseTitleList.forEach((i) => {
  		const subItemGroup = [];
			contentData[i.key].rowDataList.forEach((dto, index) => {
				if (!dto.itemId) {
					// 取子項目塞進標題欄位
					const { itemTypeDesc } = dto;
					subItemGroup.push({
						rowkey: index,
						caName: itemTypeDesc,
					});
				} else {
					// 其餘項目塞進表格資料內
					subItemGroup.push({
						rowkey: index,
						...dto,
					});
				}
  		});
  		// 將表格陣列 mapping 至收合表格內
  		Object.assign(this.data, { [i.key]: subItemGroup });
  	});
	}

	// 標題欄位 - 若為子項目則需合併其他欄位(除 template)
	getColSpan(property: string): void {
		this.renderColumns.find((i) => i.dataIndex == property).customRender = (data: any, record: any, index) => {
			if (!record.itemId) {
  			return {
  				children: this.h('div', {
  					attrs: {
  						class: 'table-dataGrid__subtitle',
  					},
  				}, data),
  				attrs: {
  					colSpan: this.renderColumns.length - [...this.renderColumns].filter((i) => !i.dataIndex).length,
  				},
  			};
  		}
  		return {
  			children: data,
  			attrs: {
  				colSpan: {},
  			},
  		};
  	};
	}

	// 對映成 antd-vue table 的 columns 格式
	mapRenderColumns(): void {
  	this.renderColumns = this.columns
  		.map((c) => {
  			if (c.template) {
  				return {
  					title: c.title,
  					dataIndex: c.dataIndex,
  					key: c.key,
  					width: c.width,
  					scopedSlots: { customRender: c.template },
  				};
  			} if (c.customRender) {
  				return {
  					title: c.title,
  					dataIndex: c.dataIndex,
  					key: c.key,
  					width: c.width,
  					scopedSlots: { customRender: c.template },
  					customRender: (data, record, index) => this.renderContent(c.customRender(data), record, index),
  				};
  			}
  			return {
  				title: c.title,
  				dataIndex: c.dataIndex,
  				key: c.key,
  				width: c.width,
  				customRender: (data, record, index) => this.renderContent(data, record, index),
  			};
  		});
	}

	// 計算各欄位的 colSpan
	renderContent(value, record, index): {children?: string; attrs?} {
  	const obj = {};
  	if (!record.itemId) {
  		Object.assign(obj, {
  			children: value,
  			attrs: { colSpan: 0 },
  		});
  	}
		Object.assign(obj, {
			children: value,
		});
  	return obj;
	}

	/**
   * Event
   */
	// scroll內層table的同時，也scroll外層表頭及其他table(自己除外)
	handleScroll(e): void {
  	const $scrollLeft = e.target.scrollLeft;
		// 獲取表頭的DOM元素
		const $tableHeaderScroll = this.$el?.querySelector('.ant-table-body');
		$tableHeaderScroll.scrollLeft = $scrollLeft;

		// 獲取其他展開的表格
		if (this.activeKey) {
			this.activeKey.map((item) => {
				const $otherContentScroll = this.$refs[item][0].$el.querySelector('.ant-table-body');
				$otherContentScroll.scrollLeft = $scrollLeft;
			});
		}
		// console.log(1);
	}

	/**
	 * Hook
   */
	created() {
  	this.mapRenderColumns();
		console.log(this.collapseContentData);
	}

	mounted() {
  	this.$el.addEventListener('scroll', this.handleScroll, true);
	}

	beforeDestroy() {
		this.$el.removeEventListener('scroll', this.handleScroll, true);
	}

	@Watch('activeKey', { deep: true })
	watchActiveKey(newVal, oldVal) {
		// 展開新元素
		if (newVal.length > oldVal.length) {
			// 獲取其他展開的表格
			this.$nextTick(() => {
				const $scrollLeft = this.$el?.querySelector('.ant-table-body').scrollLeft;
				const $otherContentScroll = this.$refs[newVal[newVal.length - 1]][0].$el.querySelector('.ant-table-body');
				$otherContentScroll.scrollLeft = $scrollLeft;
			});
		}
	}

	@Watch('collapseContentData', { deep: true })
	collapseContentDataChange(newVal) {
		// 由於合併欄位 須在取得資料後 才處理合併
  	this.getGridData(newVal);

  	// 處理需合併的標題欄位
  	this.getColSpan('caName');
		this.activeKey = this.collapseTitleList.map((i) => i.key);
	}
}
</script>

<style lang="scss" scoped>

.collapse-panel{
	font-size: 16px;
	&:not(:first-of-type) {
		font-size: 14px;
		font-weight: 400;
	}
}
.ant-collapse {
	border: none;
}
.table-forHeader {
	// scroll
	::-webkit-scrollbar {
		display: none !important;  /* Safari and Chrome */
		-ms-overflow-style: none !important;  /* Internet Explorer 10+ */
		scrollbar-width: none !important;  /* Firefox */
	}
}

.table-forBody {
	::-webkit-scrollbar {
		display: block !important;
	}
	::v-deep {
		.ant-table-thead {
			display: none;
		}
		.ant-table-row > td:nth-child(3)  {
			background-color: $BANNER-BG-BLUE;
		}
	}
}

.table-dataGrid__subtitle {
	color: $TEXT-GREEN;
	font-weight: 600;
}

::v-deep {
	.ant-collapse-content {
		border: none;
	}
	.ant-table-placeholder {
		display: none;
	}
	.ant-table-footer {
		padding: 0;
	}
		.ant-collapse > .ant-collapse-item:last-child, .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header {
		border-radius: 0;
	}
	.ant-collapse-header {
		background: $COLLAPSE-HEADER-BG;
		color: $COLOR-WHITE !important;
		font-weight: 600;
		font-size: 16px;
		i {
			color: $COLOR-WHITE !important;
		}
	}
	.ant-collapse-content-box {
		padding: 0;
	}
	.ant-table-thead {
		.ant-table-row-cell-break-word {
			font-weight: 900;
			border: none;
		}
	}
	.ant-table-column-title span {
		display: flex;
		align-items: center;
	}
	.anticon-ellipsis {
		svg {
			font-size: 25px;
		}
	}
}
</style>
