<template>
  <div>
    <a-modal
      v-model="visibleSync"
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
        <a-form-model
          ref="form"
          :model="form"
        >
          <fbl-data-grid
            class="query__table"
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :data="form.gridData"
            :pagination="false"
          >
            <template
              #remark="slotProp"
            >
              <a-form-model-item
                :prop="'gridData.'+slotProp.index+'.remark'"
                :rules="{required: true, message: '請填寫退回原因'}"
              >
                <a-textarea
                  v-model="slotProp.data.remark"
                />
              </a-form-model-item>
            </template>
          </fbl-data-grid>
        </a-form-model>
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
          @click="onReject"
        >
          確定
        </button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { ReviewLogDto, RejectReviewLogRequest } from '@fubonlife/iams-api-axios-sdk';
import { FblColumnType, FblPDataGridHolder } from '@/components/shared/data-grid/models';
import { Action } from 'vuex-class';

@Component({ components: { FblDataGrid } })
export default class UserMaintainBackModal extends Vue {
  @Action('setLoading') setLoading;

  @PropSync('visible')
  visibleSync!: boolean

	@Prop()
	selectedUser: ReviewLogDto[];

  rejectModalVisible: boolean = false;

  form = {
  	gridData: null,
  };

  grid: FblPDataGridHolder<ReviewLogDto&{remark: string}>= {
  	rowKey: 'domainId',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'domainId',
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
  			formatter: (data) => (data.roleUnit ? data.roleUnit?.join('、') : ''),
  			width: '40%',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			property: 'remark',
  			title: '退回原因',
  			width: 450,
  			template: 'remark',
  		},
  	],
  };

  @Watch('selectedUser')
  onSelectedUserChanged(val) {
  	if (val) this.setGridData(val);
  }

  @Watch('visible')
  onVisibleChanged(val) {
  	if (val) this.rejectModalVisible = true;
  }

  // 產生表格資料(多reamrk)
  setGridData(selectedUser: ReviewLogDto[]) {
  	this.form.gridData = this.selectedUser.map((user) => ({ ...user, remark: '' }));
  }

  // API: 退回同意
  onReject() {
  	console.log('click reject');
  	(this.$refs.form as any).validate((valid) => {
  		if (valid) {
  			this.sendReject();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  sendReject() {
  	this.setLoading(true);
  	const request: RejectReviewLogRequest[] = this.form.gridData.map((selectedUser) => ({
  		accountId: selectedUser.accountId,
  		logId: selectedUser.logId,
  		remark: selectedUser.remark,
  	}));
  	this.$accountApi.rejectReviewListInAccountUsingPOST(request)
  		.then((resp) => {
  			this.$global.changeRouterAndaddParam({
  				toRouter: 'AccountResult',
  				params: { type: 'reject' },
  				query: { result: 'success' },
  			});
  		})
  		.catch((error) => {
  		  this.$global.changeRouterAndaddParam({
  				toRouter: 'AccountResult',
  				params: { type: 'reject' },
  				query: {
  					result: 'fail',
  					msg: error.response.data.message,
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取消
  onClose() {
  	this.visibleSync = false;
  }
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
