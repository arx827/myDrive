<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between">
        <div class="page__title">
          滿意度問卷維護
        </div>
        <div class="pt-4">
          <button
            class="btn__radius--primary--outline--small"
            @click="handleAdd"
          >
            新增問卷
          </button>
        </div>
      </div>
      <div class="serviceTime__wrap">
        <FblDataGrid
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :class-name="'components-table-demo-nested'"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template v-slot:handleSwitch="slotProps">
            <a-switch
              :checked="slotProps.data.enabled === 'Y'"
              checked-children="啟用"
              un-checked-children="停用"
              @click="changeEnebled(slotProps.data)"
            />
          </template>
          <template #action="data">
            <div class="action">
              <button
                class="icon-button icon__edit"
                @click="handleEdit(data.data)"
              >
                <a-icon type="edit" />
              </button>
              <button
                :disabled="data.data.enabled == 'Y'"
                class="icon-button icon__delete"
                @click="handleDelete(data.data)"
              >
                <a-icon type="delete" />
              </button>
              <a
                class="action__read"
                @click="readDetail(data.data)"
              >
                <a-icon type="right" />
              </a>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import TodoButton from '@compononts/to-do/TodoButton.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import InfoModal from '@/plugins/notification/infoModal';
import { Action } from 'vuex-class';
import { QueryPageModel, HealthQuerySatisfyQuestUpdateEnableDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

require('../../../../../node_modules/bootstrap/js/dist/modal');

@Component({ components: { TodoButton, FblDataGrid } })
export default class SatisfyQuestMaintainIndex extends Vue {
	@Action('setLoading') setLoading;

  type: string = '';

	request: QueryPageModel={
		pageNo: 0,
		pageSize: 10,
	}

  // 父層 欄位資料
  gridData = {
  	rowKey: 'satisfyQuestId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 10,
  		total: 50,
  		pageSizeOptions: ['5', '10', '25'],
  		showSizeChanger: true,
  		showQuickJumper: true,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'version',
  			title: '版號',
  			width: 130,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtDt',
  			title: '建立日期',
  			formatter: (data) => (data.crtDt ? moment(data.crtDt).format('YYYY-MM-DD') : ''),
  			width: 120,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'handleSwitch',
  			property: 'enabled',
  			title: '狀態',
  			width: 130,
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'action',
  			template: 'action',
  			title: '',
  			width: 180,
  		},
  	],
  };

  /**
   * Func
   */
  setData() {
  	this.setLoading(true);
  	this.$PHPRpnQuerySatisfyQuestApi.querySatisfyQuestRUsingPOST(this.request).then((resp) => {
  		if (resp.data.status === 200) {
  			this.gridData.data = resp.data.data.content;
  			this.gridData.pagination.total = Number(resp.data.data.totalElements);
  			console.log(resp.data);
  		}
  	}).catch((err) => {
  		console.log(err);
  	}).finally(() => {
  		this.setLoading(false);
  	});
  }

  handleEdit(data) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SatisfyQuestMaintainAddAndEdit',
  		query: {
  			satisfyQuestId: data.satisfyQuestId,
  			status: data.status,
  			version: data.version,
  		},
  		params: {
  			type: 'edit',
  		},
  	});
  }

  handleDelete(data) {
  		InfoModal.alertError({
  			title: '確定要刪除嗎？',
  			confirm: true,
  			content: '系統即將刪除此份滿意度問卷，您確定要刪除嗎？',
  		onCallback: () => {
  			this.setLoading(true);
  			this.$PHPRpnQuerySatisfyQuestApi.deleteSatisfyQuestUsingPOST(data.satisfyQuestId).then((resp) => {
  				if (resp.status === 200) {
  					this.setData();
  				}
  			}).catch((err) => {
  				console.log(err);
  				this.setLoading(false);
  			});
  		},
  		});
  }

  handleAdd() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SatisfyQuestMaintainAddAndEdit',
  		params: {
  			type: 'add',
  		},
  	});
  }

  // 改變問卷狀態
  changeEnebled(data) {
  	console.log('itemData', data);
  	let enabledRequest: HealthQuerySatisfyQuestUpdateEnableDto = {
  		satisfyQuestId: data.satisfyQuestId,
  	};
  	if (data.enabled === 'Y') {
  		enabledRequest = {
  			...enabledRequest,
  			enabled: 'N',
  		};
  	} else {
  		enabledRequest = {
  			...enabledRequest,
  			enabled: 'Y',
  		};
  	}
  	console.log('enabledRequest', enabledRequest);
  	this.$PHPRpnQuerySatisfyQuestApi.updateEnableUsingPOST(enabledRequest).then((resp) => {
  		console.log(resp);
  			if (resp.status === 200) {
  				console.log(resp.data);
  				this.setData();
  			} else {
  				this.setLoading(false);
  			}
  		}).catch((err) => {
  			console.log(err);
  			this.setLoading(false);
  		});
  }

  readDetail(data) {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'SatisfyQuestMaintainDetails',
  		query: data,
  	});
  	// this.$router.push({ name: 'SatisfyQuestMaintainDetails' });
  }

  /**
   * Hook
   */
  created() {
  	this.setData();
  }

  onPageChange(e) {
  	this.gridData.pagination = {
  		...this.gridData.pagination,
  		current: e.pagination.current,
  		pageSize: e.pagination.pageSize,
  	};
  	this.request = {
  		pageNo: e.pagination.current - 1,
  		pageSize: e.pagination.pageSize,
  	};
  	this.setData();
  }
}
</script>

<style lang="scss" scoped>
.icon-button:not(:first-of-type) {
  margin-left: 10px;
}
.icon-button:disabled{
	pointer-events: none;
	cursor: pointer;
	background-color: $COLOR-GRAY6;
	color: #999999;

}

.action {
  float: right;
}

.action__read {
  color: #000000a6;
  margin-left: 18px;
  ::v-deep svg {
    font-size: 13px;
  }
}

::v-deep {
  .ant-table-header-column {
    font-weight: 900;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -12px -16px -13px;
  }
}
</style>
