<template>
  <div class="index__content">
    <div class="index-topLine" />
    <div class="index-toDoList__wrap">
      <div class="index-toDoList__header-wrap">
        <h1 class="toDoList__header-title">
          系統待辦事項
        </h1>
        <a-radio-group
          v-model="systemTab"
          style="margin-bottom: 16px"
          class="d-flex"
        >
          <a-radio-button
            value="sys1"
            class="col"
          >
            健康資源系統({{ sys1Total }})
          </a-radio-button>
          <!-- <a-radio-button
            value="sys2"
            class="col"
          >
            通訊錄系統({{ sys2Total }})
          </a-radio-button> -->
        </a-radio-group>
      </div>
      <!-- pc版、平板 Table -->
      <div class="index-toDoList__table-wrap">
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
      <div
        v-if="mobileTableList"
        class="phone__table-wrap"
      >
        <div
          v-for="item in mobileTableList"
          :key="item.key"
          class="table-item"
        >
          <div class="phone__block-header d-flex">
            <div class="title">
              {{ item.val }}
            </div>
            <div>角色/件數</div>
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
import infoModal from '@/plugins/notification/infoModal';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import store from '@/store';

@Component({ components: { FblDataGrid } })
export default class Index extends Vue {
  @Action('setLoading') setLoading;

  // 欲合併的資料欄位
  rowSpanItemName = [];

  systemTab = '';

	mobileTableList = null

  // pc、平板-欄位資料
  pcGridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemName',
  			title: '項目名稱',
  			// 上下合併
  			customRender: (data, record, index, column) => ({
  				children: data.itemName,
  				attrs: {
  					rowSpan: this.rowSpanItemName[index],
  				},
  			}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'role',
  			title: '角色',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'count',
  			title: '件數',
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
  			property: 'role',
  			title: '角色',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'count',
  			title: '件數',
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

	// 健康資源系統代辦總數
	sys1Total = 0

	// 通訊錄系統代辦總數
	sys2Total = 0;

	@Watch('systemTab')
	async onTabChange(val) {
		if (val === 'sys1') {
			await this.fetchTodoDatas();
			// 處理合併欄位
			this.rowSpanItemName = this.getRowSpan('itemName');

			// 【類別】欄位 合併
			this.pcGridData.columns.find((i) => i.property == 'itemName').customRender = (data, record, index) => ({
				children: data.itemName,
				attrs: {
					rowSpan: this.rowSpanItemName[index],
				},
			});
		} else if (val === 'sys2') {
			// 通訊錄待辦
			this.pcGridData.data = [];
			this.mobileGridData.data = {};
		}
	}

	/**
   * Func
   */
	getGridData() {
  	// pc、平板
  	this.pcGridData.data = [
  		{
  			itemName: '醫師諮詢服務(16)',
  			role: '員工',
  			count: '2',
  		},
  		{
  			itemName: '醫師諮詢服務(16)',
  			role: '護理人員',
  			count: '10',
  		},
  		{
  			itemName: '醫師諮詢服務(16)',
  			role: '主管',
  			count: '2',
  		},
  		{
  			itemName: '醫師諮詢服務(16)',
  			role: '管理員',
  			count: '2',
  		},
  		{
  			itemName: '推動健康促進(14)',
  			role: '員工',
  			count: '2',
  		},
  		{
  			itemName: '推動健康促進(14)',
  			role: '護理人員',
  			count: '10',
  		},
  		{
  			itemName: '推動健康促進(14)',
  			role: '管理員',
  			count: '2',
  		},
  		{
  			itemName: '母性健康保護(1)',
  			role: '員工',
  			count: '1',
  		},
  		{
  			itemName: '異常負荷預防(7)',
  			role: '員工',
  			count: '2',
  		},
  		{
  			itemName: '異常負荷預防(7)',
  			role: '護理人員',
  			count: '5',
  		},
  	];
  	this.pcGridData.data.map((item, index) => {
  		item.rowkey = index + 1;
  	});
  	// 手機板
  	this.mobileGridData.data = {
  		a: [
  			{
  				itemName: '醫師諮詢服務(16)',
  				role: '員工',
  				count: '2',
  			},
  			{
  				itemName: '醫師諮詢服務(16)',
  				role: '護理人員',
  				count: '10',
  			},
  			{
  				itemName: '醫師諮詢服務(16)',
  				role: '主管',
  				count: '2',
  			},
  			{
  				itemName: '醫師諮詢服務(16)',
  				role: '管理員',
  				count: '2',
  			},
  		],
  		b: [
  			{
  				itemName: '推動健康促進(14)',
  				role: '員工',
  				count: '2',
  			},
  			{
  				itemName: '推動健康促進(14)',
  				role: '護理人員',
  				count: '10',
  			},
  			{
  				itemName: '推動健康促進(14)',
  				role: '管理員',
  				count: '2',
  			},
  		],
  		c: [
  			{
  				itemName: '母性健康保護(1)',
  				role: '員工',
  				count: '1',
  			},
  		],
  		d: [
  			{
  				itemName: '異常負荷預防(7)',
  				role: '員工',
  				count: '2',
  			},
  			{
  				itemName: '異常負荷預防(7)',
  				role: '護理人員',
  				count: '5',
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
	handleDetail(data): void {
		// 進入相對應頁面並且切換角色
		let roleId;
		switch (data.role) {
		case '員工':
			roleId = '1';
			break;

		case '護理師':
			roleId = '2';
			break;

		case '主管':
			roleId = '3';
			break;

		case '系統管理員':
			roleId = '4';
			break;

		default:
			break;
		}
		if (roleId === '2') {
			this.checkCertPass();
		} else {
			this.$user.changeSelectedRole(roleId);
  		store.dispatch('getRoleFromSession');
			this.$router.push({ name: 'OccupationalSafety' });
			console.log('代辦進入頁面');
		}
	}

	getRouteName(id) {
		console.log(id);
	}

	// API: 1.2.1.	護理師檢核是否可通行
	checkCertPass() {
		this.setLoading(true);
		this.$AdminControlManagerApi.checkCertPassUsingPOST({ isRecord: false })
			.then((resp) => {
				if (resp.data.status === 200) {
					if (!resp.data.data) {
						infoModal.alertSuccess({
							title: '確定要登入系統嗎？',
							content: '親愛的護理人員您好，欲使用本系統需取得主管覆核同意才可登入，有效登入權限將維持一日。請問您尚需登入本系統嗎？',
							okText: '我要登入 (系統將發送覆核通知)',
							cancelText: '不要',
							confirm: true,
							okType: 'primary',
							onCallback: () => {
								this.setLoading(true);
								this.$AdminControlManagerApi.checkCertPassUsingPOST({ isRecord: true })
									.then((resp) => {
										notification.success({ content: '已將申請發送主管覆核，請稍後再登入。' });
									})
									.catch((error) => {
										console.log('error status = ', error);
									})
									.finally(() => {
										this.setLoading(false);
									});
							},
						});
					} else {
						// to route
						this.$user.changeSelectedRole('2');
						store.dispatch('getRoleFromSession');
						this.$router.push({ name: 'OccupationalSafety' });
					}
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
		  })
		  .catch((error) => {
		    console.log('error status = ', error.status);
		  })
		  .finally(() => {
				this.setLoading(false);
		  });
	}

	// API: 2.5.1	系統待辦API
	async fetchTodoDatas() {
  	this.setLoading(true);
  	await this.$ToDoListApi.systemPendingUsingPOST()
  		.then((resp) => {
  			console.log(resp.data.data);
				if (resp.data.status === 200) {
					this.sys1Total = resp.data.data.totalCount;
					const arr = [];
					let index = 0;
					resp.data.data.sysToDoListBySrcFromDtoList.forEach((element) => {
						if (element.srcFromCount !== 0) {
							this.mobileGridData.data[element.srcFrom] = element.sysToDoListByRoleNameFromDtoList.map((e) => ({
								itemName: `${element.srcFrom}(${element.srcFromCount})`,
								role: e.roleName,
								count: e.eachCount,
								// routeName: this.$todosComparsion.getRouteInfo(e.todoList[0].toDoId),
								rowkey: index++,
							}));
						}

						element.sysToDoListByRoleNameFromDtoList.forEach((el) => {
							if (element.srcFromCount !== 0) {
								arr.push({
									itemName: `${element.srcFrom}(${element.srcFromCount})`,
									role: el.roleName,
									count: el.eachCount,
									// routeName: this.$todosComparsion.getRouteInfo(el.todoList[0].toDoId),
									rowkey: index++,
								});
							}
						});
					});

					this.mobileTableList = resp.data.data.sysToDoListBySrcFromDtoList.filter((a) => (a.srcFromCount !== 0)).map((e) => ({
						key: e.srcFrom,
						val: `${e.srcFrom}(${e.srcFromCount})`,
					}));
					this.pcGridData.data = arr;
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
  	  })
  	  .catch((error) => {
  	    console.log('error status = ', error.status);
  	  })
  	  .finally(() => {
  			this.setLoading(false);
  	  });
	}

	/**
   * Hook
   */
	async created() {
		this.systemTab = 'sys1';
  	// this.$user.loginState$
  	//   .pipe(takeUntil(this.unsubscribe$))
  	//   .subscribe((state) => {
  	//     if (state && state.me) {
  	//       this.avatarText = state.me.employeeId;
  	//     }
  	//   });

  	// this.$authApi.getAuthorizedMenuTreeUsingGET().then((resp) => {
  	//   const node = resp.data;
  	//   this.menuItems = node.children.map((c) => this.toMenuItem(c));
  	// });
	}
}
</script>

<style lang="scss" scoped>
.index__content {
  min-height: calc(100vh - var(--header-height) - 76px);
	display: flex;
	flex-direction: column;
}

.index-topLine {
	width: 100%;
	min-height: 40px;
	background: $LOGIN-BANNER-BG;
	z-index: 1;
}

.index-mainBg {
	position: absolute;
	bottom: 0;
	height: 100%;
	z-index: 1;
	img {
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
	@include rwd-sm {
		height: auto;
	}
}

.index-toDoList__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
	padding: 0 30px 90px 30px;
	background-image: url("~@images/image_background.svg");
	background-repeat: no-repeat;
  background-size: cover;
	background-position: center;
	flex: 1;
  .index-toDoList__header-wrap {
    display: flex;
    flex-direction: column;
		z-index: 2;
		width: 100%;
		@include rwd-sm {
			align-items: center;
		}
		::v-deep {
			.ant-radio-group {
				label {
					min-width: 12em;
				}
				@include rwd-xl {
					width: 25%;
				}
			}
		}
    .toDoList__header-title {
      padding: 20px 0 5px 0;
      font-size: 24px;
      font-weight: 600;
			@include rwd-sm {
				font-size: 30px;
			}

    }
  }
  .index-toDoList__table-wrap {
		display: none;
		width: 720px;
		z-index: 2;
		@include rwd-sm {
			display: block;
		}
  }
	.phone__table-wrap {
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
		@include rwd-sm {
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

::v-deep {
  .ant-table-body {
    background: $COLOR-WHITE;
  }
  .ant-table-tbody > tr > td {
    vertical-align: top;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    color: $COLOR-WHITE;
    background: $BUTTON-MAIN;
  }
	.ant-radio-button-wrapper {
		width: 50%;
		text-align: center;
	}
}
</style>
