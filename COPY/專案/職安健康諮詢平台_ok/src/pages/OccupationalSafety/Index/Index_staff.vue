<template>
  <div class="OSIndex__content">
    <div class="OSIndex-mainBg">
      <img
        src="~@images/image_mainBackground.svg"
        alt=""
      >
    </div>
    <div class="OSIndex-topLine">
      <p class="topLine-title">
        健康資源系統
      </p>
    </div>
    <div class="OSIndex-toDoList__wrap">
      <div class="OSIndex-toDoList__header-wrap">
        <h1 class="toDoList__header-title">
          健康資源待辦事項
        </h1>
      </div>
      <!-- pc版、平板 Table -->
      <div class="OSIndex-toDoList__table-wrap">
        <FblDataGrid
          :row-key="pcGridData.rowKey"
          :columns="pcGridData.columns"
          :data="pcGridData.data"
          :pagination="pcGridData.pagination"
          :empty-data="pcGridData.data.length <= 0"
        >
          <template v-slot:handleTemp="slotProps">
            <i
              class="os-icon os-icon__nextPage"
              @click="handleDetail(slotProps.data)"
            />
          </template>
        </FblDataGrid>
      </div>

      <!-- 手機板 Table -->
      <div class="phone__OSIndex-table-wrap">
        <div
          v-for="item in mobileTableList"
          :key="item.key"
          class="table-item"
        >
          <div class="phone__block-header d-flex">
            <div class="title">
              {{ item.val }}
            </div>
            <div>項目/名稱</div>
          </div>
          <FblDataGrid
            :row-key="mobileGridData.rowKey"
            :columns="mobileGridData.columns"
            :data="mobileGridData.data[item.key]"
            :pagination="mobileGridData.pagination"
            :empty-data="mobileGridData.data.length <= 0"
          >
            <template v-slot:handleTemp="slotProps">
              <i
                class="os-icon os-icon__nextPage"
                @click="handleDetail(slotProps.data)"
              />
            </template>
          </FblDataGrid>
        </div>
      </div>
    </div>

    <!-- 衛教代辦彈窗 -->
    <healthEduPendingModal
      :send-info-record-id="healthEduPendingId"
      :visible="healthEduPendingModalVisible"
      @closeModal="closeHealthEduPendingModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import {
	FblColumnType,
	FblPageEvent,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import notification from '@/plugins/notification/infoNotification';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import healthEduPendingModal from '@/pages/OccupationalSafety/Index/healthEduPendingModal.vue';

@Component({ components: { FblDataGrid, healthEduPendingModal } })
export default class IndexStaff extends Vue {
  @Action('setLoading') setLoading;

  // 欲合併的資料欄位
  rowSpanCategory = [];

	// 手機板-Table項目
	mobileTableList = [
		// {
		// 	key: 'a',
		// 	val: '醫師諮詢服務(16)',
		// },
		// {
		// 	key: 'b',
		// 	val: '推動健康促進(14)',
		// },
	]

  // pc、平板-欄位資料
  pcGridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'category',
  			title: '分類',
  			// 上下合併
  			customRender: (data, record, index, column) => ({
  				children: data.category,
  				attrs: {
  					rowSpan: this.rowSpanCategory[index],
  				},
  			}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemName',
  			title: '項目名稱',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'handleTemp',
  			width: 30,
  			align: 'right',
  			title: '',
  		},
  	],
  }

  // 手機板-欄位資料
  mobileGridData = {
  	rowKey: 'rowkey',
  	data: {},
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemName',
  			title: '項目名稱',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'handleTemp',
  			width: 30,
  			align: 'right',
  			title: '',
  		},
  	],
  }

	rowKey = 0

	healthEduPendingId = null; // 代辦衛教通知所需ID

	healthEduPendingModalVisible = false;

	@Watch('$store.state.role')
	onChangeRole(val) {
  	console.log('$store.state.rolev', val);
  	if (val === '1') {
  		this.fetchAll();
  	}
  	// if (val) location.reload();
	}

	/**
   * Func
   */
	getGridData() {
  	this.pcGridData.data = [
  		{
  			rowkey: 1,
  			category: '醫師諮詢服務',
  			itemName: '預約醫生（預留長文項目空間）',
  		},
  		{
  			rowkey: 2,
  			category: '醫師諮詢服務',
  			itemName: '預約醫生',
  		},
  		{
  			rowkey: 3,
  			category: '醫師諮詢服務',
  			itemName: '預約醫生',
  		},
  		{
  			rowkey: 4,
  			category: '醫師諮詢服務',
  			itemName: '預約醫生',
  		},
  		{
  			rowkey: 5,
  			category: '推動健康促進',
  			itemName: '預約醫生',
  		},
  	];

  	// 手機板
  	this.mobileGridData.data = {
  		a: [
  			{
  				category: '醫師諮詢服務(16)',
  				itemName: '預約醫生（預留長文項目空間）',
  			},
  			{
  				category: '醫師諮詢服務(16)',
  				itemName: '預約醫生',
  			},
  			{
  				category: '醫師諮詢服務(16)',
  				itemName: '預約醫生',
  			},
  			{
  				category: '醫師諮詢服務(16)',
  				itemName: '預約醫生',
  			},
  		],
  		b: [
  			{
  				category: '推動健康促進(14)',
  				itemName: '預約醫生',
  			},
  			{
  				category: '推動健康促進(14)',
  				itemName: '預約醫生',
  			},
  			{
  				category: '推動健康促進(14)',
  				itemName: '預約醫生',
  			},
  		],
  	};
  		this.mobileTableList.map((i) => {
  		this.mobileGridData.data[i.key].map((item, index) => {
  			item.rowkey = index + 1;
  		});
  	});
	}

	// 表格合併
	getRowSpan(property) {
  	const rowSpanList = [];
  	const dataTitle = this.pcGridData.data.map((dto) => dto[property]);
  	// 計算相同元素並以物件key顯示
  	const countedColumns = dataTitle.reduce((all, col) => {
  		if (col in all) {
  			all[col]++;
  		} else {
  			all[col] = 1;
  		}
  		return all;
  	}, {});
  	// 取相同元素的值
  	Object.values(countedColumns as number).forEach((item) => {
  		rowSpanList.push(item);
  		if (item > 1) {
  			for (let i = 0; i < item - 1; i++) {
  				rowSpanList.push(0);
  			}
  		}
  	});
  	return rowSpanList;
	}

	/**
   * Event
   */

	// 關閉衛教通知彈窗
	closeHealthEduPendingModal() {
  	this.healthEduPendingModalVisible = false;
		this.healthEduPendingId = null;
	}

	handleDetail(data): void {
		console.log(data);
		if (data.routerName === 'popup') {
			this.healthEduPendingModalVisible = true;
			this.healthEduPendingId = data.routerWithQuery.sendInfoRecordId;
			return;
		}
  	this.$global.changeRouterAndaddParam({
  	  toRouter: data.routerName,
  	  query: data.routerWithQuery,
			params: data.routerParam,
  	});
	}

	generateTodos(arr, category, totalCount) {
		const index = 0;
		if (totalCount > 0) {
			arr.forEach((element) => {
				const routerInfo = this.$todosComparsion.getRouteInfo(element.toDoId);
				let query = {};
				if (routerInfo.withQuery) {
					Object.entries(routerInfo.withQuery).forEach(([key, val]: any) => {
						if (val.toString().indexOf('API_') > -1) {
							query[key] = element[val.substr(4, val.length)];
						} else {
							query[key] = val;
						}
					});
				} else {
					query = null;
				}
				this.pcGridData.data.push({
					itemName: element.toDoDesc,
					category: `${category}(${totalCount})`,
					rowkey: this.rowKey++,
					routerName: routerInfo.routeName,
					routerWithQuery: query,
				});
			});
			this.mobileGridData.data[category] = arr.map((e) => {
				const routerInfo = this.$todosComparsion.getRouteInfo(e.toDoId);
				let query = {};
				if (routerInfo.withQuery) {
					Object.entries(routerInfo.withQuery).forEach(([key, val]: any) => {
						if (val.toString().indexOf('API_') > -1) {
							query[key] = e[val.substr(4, val.length)];
						} else {
							query[key] = val;
						}
					});
				} else {
					query = null;
				}
				return {
					category: `${category}(${totalCount})`,
					itemName: e.toDoDesc,
					rowkey: `mobile${this.rowKey++}`,
					routerName: routerInfo.routeName,
					routerWithQuery: query,
				};
			});
			this.mobileTableList.push({
				key: category,
				val: `${category}(${totalCount})`,
			});
		}
	}

	async fetchApis(apiName) {
		await this.$ToDoListApi[apiName]()
			.then((resp) => {
  			if (resp.data.status === 200) {
					this.generateTodos(resp.data.data.todoList, resp.data.data.srcFrom, resp.data.data.totalCount);
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	fetchAll() {
		this.pcGridData.data = [];
		this.mobileGridData.data = {};
		Promise.all(
			[this.fetchApis('empPhyConsultPendingUsingPOST'),
				this.fetchApis('empHealthActPendingUsingPOST'),
				this.fetchApis('empHealthCheckPendingUsingPOST'),
				this.fetchApis('empMonPlanPendingUsingPOST'),
				this.fetchApis('empAbnormalLoadPendingUsingPOST'),
				this.fetchApis('empErgonomicHazardPendingUsingPOST')],
		).then((resp) => {
			// 處理合併欄位
  		this.rowSpanCategory = this.getRowSpan('category');

  		// 【類別】欄位 合併
  		this.pcGridData.columns.find((i) => i.property == 'category').customRender = (data, record, index) => ({
  			children: data.category,
  			attrs: {
  				rowSpan: this.rowSpanCategory[index],
  			},
  		});
  	});
	}

	async created() {
		this.fetchAll();
	}
}
</script>

<style lang="scss" scoped>
.OSIndex-topLine {
	width: 100%;
	min-height: 40px;
	background: $LOGIN-BANNER-BG;
	z-index: 1;
	padding: 0 30px;
	display: flex;
	align-items: center;
	.topLine-title {
		font-size: 600;
		@include rwd-md {
			display: none;
		}
	}
}

.OSIndex__content {
  min-height: calc(100vh - var(--header-height) - 76px);
  position: relative;
  .OSIndex-mainBg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.OSIndex-toDoList__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
	padding: 0 30px;
	@include rwd-md {
		margin-top: 20px;
	}
  .OSIndex-toDoList__header-wrap {
    display: flex;
    padding: 20px 0 18px 0;
		margin-left: 0;
    width: 100%;
		@include rwd-md {
			justify-content: center;
		}
    .toDoList__header-title {
      font-size: 24px;
      font-weight: 600;
			@include rwd-md {
				font-size: 30px;
			}
    }
  }
  .OSIndex-toDoList__table-wrap {
		display: none;
		width: 720px;
		z-index: 2;
		@include rwd-md {
			display: block;
		}
  }

	.phone__OSIndex-table-wrap {
		width: 100%;
		z-index: 2;
		::v-deep {
			.ant-table-thead {
				display: none;
			}
			.ant-table-body {
				border: 1px solid $TABLE-BORDER-COLOR;
    		border-radius: 4px;
				.ant-table-tbody {
					tr:last-child {
						td {
							border: none;
						}
					}
				}
			}
		}
		@include rwd-md {
			display: none;
		}
		.table-item {
			margin-bottom: 15px;
		}
		.phone__block-header {
			margin-bottom: 10px;
			justify-content: space-between;
			.title {
				font-weight: 600;
			}
		}
	}
}

h1, p {
  margin: 0;
}

::v-deep .ant-table-tbody{
	background-color: $COLOR-WHITE;
	@include rwd-md {
		opacity:0.85;
	}
	& > tr > td {
		vertical-align: top;
	}
}
</style>
