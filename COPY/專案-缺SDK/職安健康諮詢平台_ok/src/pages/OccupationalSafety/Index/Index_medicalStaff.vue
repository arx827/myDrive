<template>
  <div class="OSIndex__content">
    <div class="OSIndex-mainBg">
      <img
        src="~@images/image_mainBackground.svg"
        alt=""
      >
    </div>
    <div
      v-if="nowRole === '2'"
      class="OSIndex-banner__wrap container"
    >
      <div class="OSIndex-banner__img-wrap">
        <img
          src="~@images/image_personal.svg"
          alt=""
        >
      </div>
      <div
        class="OSIndex-banner__title-wrap"
      >
        <h1
          class="OSIndex-banner__title"
          title="個案維護"
        >
          個案維護
        </h1>
        <p>
          需要員工查詢嗎？
          <router-link to="/occupationSafety/Other/caseMaintain/index">
            <a href="#">點擊此區</a>
          </router-link>
          讓系統引導至個案維護
        </p>
      </div>
    </div>
    <div class="OSIndex-toDoList__wrap">
      <div class="OSIndex-toDoList__header-wrap">
        <h1 class="toDoList__header-title">
          健康資源待辦事項
        </h1>
        <div class="toDoList__header-icon">
          <div
            class="icon-button icon__calendar"
            @click="onOpenCalendarModal"
          >
            <a-icon type="calendar" />
          </div>
        </div>
      </div>
      <div class="OSIndex-toDoList__table-wrap">
        <FblDataGrid
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :empty-data="gridData.data.length <= 0"
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

    <!-- 預覽彈窗 -->
    <CalendarModal
      v-if="calendarModal"
      :calendar-list-data="calendarListData"
      @panelChanged="getEventCalendar"
      @close="closeCalendarModal"
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
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import CalendarModal from '@/components/modal/CalendarModal.vue';
import { Action } from 'vuex-class';
import moment from 'moment';
import notification from '@/plugins/notification/infoNotification';
import store from '@/store';

@Component({ components: { FblDataGrid, CalendarModal } })
export default class IndexNurse extends Vue {
  @Action('setLoading') setLoading;

  calendarModal = false;

  // 欲合併的資料欄位
  rowSpanCategory = [];

  // 欄位資料
  gridData = {
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

  calendarListData = [];

  rowKey = 0

  nowRole = null

	@Watch('$store.state.role')
  onChangeRole(newValue, oldValue) {
  	console.log('$store.state.rolev', newValue, oldValue);
  	if (newValue !== '1' && oldValue) {
  		this.fetchAll();
  	}
  	// if (val) location.reload();
  }

	/**
   * Func
   */
	// API:首頁行事曆
	getEventCalendar(data?) {
  	this.setLoading(true);
  	const month = data ? moment(data).format('MM') : moment().format('MM');
  	const year = data ? moment(data).format('YYYY') : moment().format('YYYY');
  	const $form = {
  		month,
  		year,
  	};
  	this.$AlRpnHomePageControllerApi.getEventCalendarUsingPOST($form)
  		.then((resp) => {
  			this.calendarListData = resp.data.data;
  		})
  		.catch((error) => {
  			// console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	// 表格合併
	getRowSpan(property) {
  	const rowSpanList = [];
  	const dataTitle = this.gridData.data.map((dto) => dto[property]);
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
	// 開啟行事曆彈窗
	onOpenCalendarModal() {
  	this.calendarModal = true;
  	this.getEventCalendar();
	}

	// 關閉行事曆彈窗
	closeCalendarModal() {
  	this.calendarModal = false;
	}

	handleDetail(data): void {
  	console.log(data);
  	this.$global.changeRouterAndaddParam({
  	  toRouter: data.routerName,
  	  query: data.routerWithQuery,
			params: data.routerParam,
  	});
	}

	generateTodos(arr, category, totalCount) {
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
  			this.gridData.data.push({
  				itemName: element.toDoDesc,
  				category: `${category}(${totalCount})`,
  				rowkey: this.rowKey++,
					routerName: routerInfo.routeName,
					routerParam: routerInfo.params,
					routerWithQuery: query,
  			});
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
		this.gridData.data = [];
		// 由於合併欄位 須在取得資料後 才處理合併，使用 async
  	let fetchArr = [];
  	this.nowRole = this.$user.getSelectedRole();
  	switch (this.$user.getSelectedRole()) {
  	case '2':
  		fetchArr = [this.fetchApis('rpnErgonomicHazardPendingUsingPOST'), this.fetchApis('rpnHealthActPendingUsingPOST'), this.fetchApis('rpnHealthCheckPendingUsingPOST'), this.fetchApis('rpnPhyConsultPendingUsingPOST'), this.fetchApis('rpnMonPlanPendingUsingPOST'), this.fetchApis('rpnAbnormalLoadPendingUsingPOST')];
  		break;

  	case '3':
  		fetchArr = [this.fetchApis('mngNurseLoginReviewPendingUsingPOST')];
  		break;

  	case '4':
  		fetchArr = [this.fetchApis('admRoleReviewPendingUsingPOST'), this.fetchApis('admUserReviewPendingUsingPOST')];
  		break;

  	default:
  		break;
  	}
  	Promise.all(fetchArr).then((resp) => {
  		// 處理合併欄位
  		this.rowSpanCategory = this.getRowSpan('category');

  		// 【類別】欄位 合併
  		this.gridData.columns.find((i) => i.property == 'category').customRender = (data, record, index) => ({
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
.OSIndex__content {
  min-height: calc(100vh - var(--header-height) - 76px);
  position: relative;
  padding-top: 30px;
  .OSIndex-mainBg {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

// banner
.OSIndex-banner__wrap {
  display: flex;
  align-items: center;
  background: $BANNER-BG-BLUE;
  height: 90px;
  border-radius: 10px;

  // img
  .OSIndex-banner__img-wrap {
    max-width: 200px;
    height: 100%;
    margin:0 50px;
    img {
      height: 100%;
    }
  }

  .OSIndex-banner__title-wrap{
    flex: 1;
    padding: 12px 0;
  }
}

.OSIndex-toDoList__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  .OSIndex-toDoList__header-wrap {
    display: flex;
    padding: 20px 0 18px 0;
    .toDoList__header-icon {
      margin-left: 20px;
    }
  }
  .OSIndex-toDoList__table-wrap {
    width: 720px;
  }
}

.OSIndex-banner__title, .toDoList__header-title {
  font-size: 30px;
  font-weight: 600;
}

h1, p {
  margin: 0;
}

::v-deep .ant-table-tbody > tr > td {
  vertical-align: top;
}
</style>
