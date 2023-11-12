<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="formRules"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            填寫退回原因
          </div>
          <div class="table">
            <FblDataGrid
              :row-key="gridData.rowKey"
              :columns="gridData.columns"
              :data="gridData.data"
              :pagination="gridData.pagination"
              :empty-data="gridData.data.length <= 0"
            >
              <template v-slot:reason="slotProps">
                <a-form-model-item :prop="`data${slotProps.data.rowkey}`">
                  <a-textarea
                    v-model="form[`data${slotProps.data.rowkey}`]"
                    placeholder="字數上限250字。"
                    :max-length="250"
                    :auto-size="{ minRows: 3 }"
                    size="large"
                  />
                </a-form-model-item>
              </template>
            </FblDataGrid>
          </div>
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline mb-2"
              @click="onClose"
            >
              取消
            </button>
            <button
              class="btn__radius--primary mb-2"
              @click="onSubmit"
            >
              確定
            </button>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { Action } from 'vuex-class';
import { CertPassUpdateDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class LoginCheckWorkBackReasondModal extends Vue {
	@Action('setLoading') setLoading;

  @Prop()
  visible: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  @Prop()
  tableData

  formData = null;

  @Watch('tableData')
  onChangeTable(val) {
  	this.formData = val;
  	if (val) {
  		this.getGridData();
  		this.initialForm();
  	}
  }

  onClose() {
  	this.$emit('closeReasonModal');
  }

  // 表單欄位
  form = {};

  // 檢核規則
  formRules = {};

  // 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'adId',
  			title: '護理AD/員編',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'name',
  			title: '登入護理人員',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'reason',
  			title: '退回原因',
  		},
  	],
  }

  getGridData() {
  	this.gridData.data = [];
  	this.gridData.data = this.formData;
  }

  // 表單初始化
  initialForm() {
  	this.form = {};
  	this.gridData.data.forEach((item, idx) => {
  		this.$set(this.form, `data${item.rowkey}`, null);
  		this.formRules[`data${item.rowkey}`] = [{ required: true, message: '請填入原因', trigger: 'change' }];
  	});
  }

  onSubmit() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  			this.setLoading(true);
  			const backData: CertPassUpdateDto = {
  				certPassUpdateUserDtoList: [],
  				isAgree: false,
  			};
  			this.tableData.forEach((item) => {
  				const block = {
  					uuid: item.uuid,
  					disagreeReason: this.form[`data${item.rowkey}`],
  				};
  				backData.certPassUpdateUserDtoList.push(block);
  			});
  			this.$AdminControlManagerApi.loginReviewWorkUpdateUsingPOST(backData)
  				.then((resp) => {
  					console.log(resp);
  					this.$global.changeRouterAndaddParam({
  						toRouter: 'LoginCheckWorkResult',
  						params: {
  							type: 'back',
  						},
  						query: {
  							result: resp.data.status === 200 ? 'success' : 'fail',
  							errorMsg: resp.data.status === 200 ? null : this.$global.getApiErrorMsg(resp.data.apiError).join(''),
  						},
  					});
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  	});
  }

  updated() {
  	window.parseWord();
  }

	// created() {
	// 	this.getGridData();
	// 	this.initialForm();
	// }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
		margin-bottom: 16px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
  }
  ::v-deep {
    .ant-form-item {
      margin: 0px;
    }
  }
</style>
