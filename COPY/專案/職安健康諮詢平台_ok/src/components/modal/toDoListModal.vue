<template>
  <!-- Modal -->
  <a-modal
    v-model="modalVisible"
    class="common__modal cate__modal todoList__modal"
    :mask-closable="false"
    :after-close="onToDoListModalClose"
    :footer="null"
    :width="'90%'"
  >
    <template slot="title">
      <div class="page__title m-0">
        待辦事項({{ totalNum }})
      </div>
      <div class="query__bar">
        <a-input-search
          v-model="searchValue"
          placeholder="你想查詢什麼 ?"
          @search="onSearch"
        />
      </div>
    </template>
    <template slot="closeIcon">
      <a-icon type="close" />
    </template>
    <div class="todoList__content">
      <div class="todoList__title__wrap">
        <span class="todoList__title">項目名稱</span>
      </div>
      <ul class="todoList__listGroup">
        <li
          v-for="(i, idx) in todoData"
          :key="idx"
          class="todoList__item"
          @click="onClickTodoItem(i.toDoId, i)"
        >
          <span>{{ i.toDoDesc }}</span>
          <a-icon type="right" />
        </li>
      </ul>
      <!-- 衛教代辦彈窗 -->
      <healthEduPendingModal
        :send-info-record-id="healthEduPendingId"
        :visible="healthEduPendingModalVisible"
        @closeModal="closeHealthEduPendingModal"
      />
    </div>
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';
import healthEduPendingModal from '@/pages/OccupationalSafety/Index/healthEduPendingModal.vue';

@Component({
	components: { FblDataGrid, healthEduPendingModal },
})
export default class toDoListModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  @Prop()
  route

  modalVisible = false;

  themeName = ''; // 流程主題名稱

  themeName_b = ''; // 次要流程主題名稱

  role = null;

  todoData = [];

  totalNum = null;

  searchValue = '';

	resetData = [];

	healthEduPendingId = null; // 代辦衛教通知所需ID

	healthEduPendingModalVisible = false;

	/**
 * Event
 */
	onToDoListModalClose() {
  	// 關閉
		this.searchValue = '';
  	this.$emit('closeToDoListModal');
	}

	// 關閉衛教通知彈窗
	closeHealthEduPendingModal() {
  	this.healthEduPendingModalVisible = false;
		this.healthEduPendingId = null;
	}

	onSearch() {
		this.setLoading(true);
  	this.todoData = this.resetData;
  	if (this.searchValue !== '') {
  		// 搜尋是否有符合字串
  		this.setLoading(true);
  		const filterData = [];
  		const regx = new RegExp(this.searchValue);
  		this.todoData.forEach((item) => {
  			let include = false;
  			if (regx.test(item.toDoDesc)) {
  					include = true;
  				}
  			if (include) {
  				filterData.push(item);
  			}
  		});
  		this.todoData = filterData;
  		this.setLoading(false);
  	} else {
			this.setLoading(false);
		}
	}

	onClickTodoItem(todoId, data) {
		const routerInfo = this.$todosComparsion.getRouteInfo(todoId);
		if (this.route.name === routerInfo.routeName) {
			this.onToDoListModalClose();
		} else {
			this.onToDoListModalClose();
			console.log(data);
			let query: any = {};
			if (routerInfo.withQuery) {
				Object.entries(routerInfo.withQuery).forEach(([key, val]: any) => {
					if (val.toString().indexOf('API_') > -1) {
						query[key] = data[val.substr(4, val.length)];
					} else {
						query[key] = val;
					}
				});
			} else {
				query = null;
			}

			if (routerInfo.routeName === 'popup') {
				this.healthEduPendingModalVisible = true;
				this.healthEduPendingId = query.sendInfoRecordId;
				return;
			}

			this.$global.changeRouterAndaddParam({
				toRouter: routerInfo.routeName,
				query,
				params: routerInfo.params,
			});
		}
	}

	getTodoData(role, themeName, themeName_b) {
  	this.setLoading(true);
  	this.todoData = [];
  	switch (themeName) {
  	case 'PhyConsult':
  		if (role === '1') {
  			this.$ToDoListApi.empPhyConsultPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnPhyConsultPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'HealthAct':
  		if (role === '1') {
  			this.$ToDoListApi.empHealthActPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnHealthActPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'HealthCheck':
  		if (role === '1') {
  			this.$ToDoListApi.empHealthCheckPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnHealthCheckPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'MaternalProtect':
  		if (role === '1') {
  			this.$ToDoListApi.empMonPlanPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnMonPlanPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'AbnormalLoad':
  		if (role === '1') {
  			this.$ToDoListApi.empAbnormalLoadPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnAbnormalLoadPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'ErgonomicHazard':
  		if (role === '1') {
  			this.$ToDoListApi.empErgonomicHazardPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '2') {
  			this.$ToDoListApi.rpnErgonomicHazardPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  		break;
  	case 'Other':
  		if (role === '3' && themeName_b === 'loginCheckWork') {
  			this.$ToDoListApi.mngNurseLoginReviewPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '4' && themeName_b === 'roleMaintain') {
  			this.$ToDoListApi.admRoleReviewPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else if (role === '4' && themeName_b === 'userMaintain') {
  			this.$ToDoListApi.admUserReviewPendingUsingPOST()
  				.then((resp) => {
  					this.todoData = resp.data.data.todoList;
  					this.totalNum = resp.data.data.totalCount;
						this.resetData = resp.data.data.todoList;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		} else {
  			this.setLoading(false);
  		}
  		break;
  	default:
  		this.setLoading(false);
  		break;
  	}
	}

	/**
   * Hook
   */
	// mounted() {
	// 	// 取得目前流程 主題名稱
	// 	this.themeName = this.$router.currentRoute.path.split('/')[2];
	// }

  /**
   * 監聽
   */
  @Watch('visible')
	onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.role = this.$user.getSelectedRole();
  		this.themeName = this.route.path.split('/')[2];
  		this.themeName_b = this.route.path.split('/')[3];
  		console.log(this.role);
  		console.log('this.themeName', this.themeName);
  		this.getTodoData(this.role, this.themeName, this.themeName_b);
  	}
	}
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ant-modal-content {
    .ant-modal-header {
      padding: 40px 20px 5px;
      @include rwd-sm {
        padding: 40px 75px 5px;
      }
      @include rwd-xl {
        padding: 33px 91px 5px;
      }
    }
    .ant-modal-body {
      padding: 5px 20px 20px;
      @include rwd-sm {
        padding: 20px 75px 50px;
      }
      @include rwd-xl {
        padding: 20px 91px 50px;
      }
    }
  }
  .ant-modal-title {
    display: block;
    @include rwd-sm {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .query__input{
    border-radius: 4px;
    width: 212px;
    margin-bottom: 25px;
    .ant-input-search:nth-child(2){
      margin-top: 22px;
    }
  }
}
.query__bar{
  width: 100%;
  margin-top: 10px;
  @include rwd-sm {
    width: 212px;
		margin-top: 0;
	}
}
.todoList__modal {
  ::v-deep {
    .ant-modal {
      max-width: 720px;
    }
  }
}
.todoList__content {
  font-size: 14px;
  @include rwd-sm {
    font-size: 16px;
	}
}
.todoList__title__wrap {
  border-bottom: 1px solid $COLOR-GRAY4;
  padding-bottom: 8px;
}
.todoList__title {
  color: $COLOR-MAIN1;
}
.todoList__listGroup {
  overflow: auto;
  max-height: 200px;
}
.todoList__item {
  border-bottom: 1px solid $COLOR-GRAY4;
  padding: 12px 12px 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .anticon {
    color: $COLOR-GRAY10;
  }
  &:hover {
    background: lighten($COLOR-MAIN1, 50%);
  }
}
</style>
