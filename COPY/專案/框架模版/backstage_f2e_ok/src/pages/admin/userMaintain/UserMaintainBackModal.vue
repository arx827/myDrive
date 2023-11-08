<template>
  <div>
    <a-modal
      v-model="modalVisible"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="common__modal fubon-backStage_modal"
      :after-close="onClose"
      :z-index="10000"
    >
      <div class="event__block">
        <div class="page__title m-0">
          填寫退回原因
        </div>
      </div>
      <div class="table__wrap">
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
        >
          <template #reason="data">
            <a-textarea
              v-model="data.data.reasonModel"
              placeholder="字數上限250字。"
              :max-length="250"
            />
          </template>
        </fbl-data-grid>
      </div>

      <div class="btn__wrap d-flex justify-content-center">
        <button
          class="btn__radius--primary--outline me-1"
          @click="onClose"
        >
          取消
        </button>
        <button
          class="btn__radius--primary ms-1"
          @click="updateUserRecord"
        >
          確定
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
// import {
// 	CertPassUpdateDto,
// } from '@fubonlife/oss-api-axios-sdk';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid } })
export default class UserMaintainBackModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  visible!: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

	@Prop()
	backData

  public grid = {
  	rowKey: 'adId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'adId',
  			title: 'AD帳號',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '使用者姓名',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'roles',
  			title: '角色名稱',
  			formatter: (data) => (data.roles ? data.roles.map((e) => e.roleName).join(',') : ''),
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'reason',
  			title: '退回原因',
  			width: 450,
  			template: 'reason',
  		},
  	],
  };

  @Watch('backData')
  setData() {
  	this.grid.data = this.backData;
  	this.grid.data.forEach((element) => {
  		this.$set(element, 'reasonModel', element.reason ? element.reason : '');
  	});
  }

  // 1.2.38.更新使用者待覆核紀錄 (退回同意)
  updateUserRecord() {
  	// const data: CertPassUpdateDto = {
  	// 	certPassUpdateUserDtoList: this.grid.data.map((e) => ({ uuid: e.uuid, disagreeReason: e.reasonModel })),
  	// 	isAgree: false,
  	// };
  	// this.$AdminControlAdminApi.updateUserReviewStatusUsingPOST(data)
  	// 	.then((resp) => {
  	// 		this.$global.changeRouterAndaddParam({
  	// 			toRouter: 'UserMaintainResult',
  	// 			query: {
  	// 				result: resp.data.status === 200 ? 'success' : 'error',
  	// 				type: '退回',
  	// 				errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  	// 			},
  	// 		});
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  }

  // 取消
  onClose() {
  	this.$emit('closeBackModal');
  }

	// 難字
	// updated() {
	// 	window.parseWord();
	// }
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include bs-rwd-sm {
      padding: 20px 70px;
    }
  }
	.table__wrap {
		overflow-x: scroll;
	}
  .query__table {
    min-width: 800px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-bottom: 50px;
    button {
      max-width: 100%;
      width: 100px;
      @include bs-rwd-lg {
        width: 200px;
      }
    }
  }
  ::v-deep {
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
  }
</style>
