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
      :z-index="10000"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <a-form-model
        ref="formRef"
        :rules="formRules"
        :model="form"
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
                <a-form-model-item :prop="slotProps.data.uuid">
                  <a-textarea
                    v-model="form[slotProps.data.uuid]"
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
              @click="submit"
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
import { CertPassUpdateUserDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Prop()
  visible: boolean

  @Prop()
  rejectInfoList

  modalVisible = false;

  form = {};

  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'roleName',
  			title: '角色名稱',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'crtName',
  			title: '申請人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'enabled',
  			title: '是否啟用',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'reason',
  			title: '退回原因',
  		},
  	],
  }

  // 欄位規則
  formRules = {}

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.getGridData();
  	}
  }

  // 表單初始化
  initialForm() {
  	// this.gridData.data.forEach((item, idx) => {
  	// 	this.form[`data${item.rowkey}`] = null;
  	// });
  	this.formRules = {};
  	(this.$refs.formRef as any).resetFields();
  }

  getGridData() {
  	this.gridData.data = JSON.parse(JSON.stringify(this.rejectInfoList));
  	this.gridData.data.map((item, index) => {
  		item.rowkey = index + 1;
  		this.formRules[item.uuid] = [{ required: true, message: '請填寫退回原因', trigger: 'change' }];
  	});
  }

  onClose() {
  	this.$emit('closeBackModal');
  	this.initialForm();
  }

  submit() {
  	const certPassUpdateUserDtoList: CertPassUpdateUserDto[] = [];
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			for (const [key, value] of Object.entries(this.form)) {
  				certPassUpdateUserDtoList.push({
  					uuid: key,
  					disagreeReason: JSON.parse(JSON.stringify(value)),
  				});
  				this.$emit('onReject', certPassUpdateUserDtoList);
  			}
  		} else {
  			console.log('error catch!!!');
  			return false;
  		}
  	});
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
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
    .ant-input {
      height: 42px;
    }
    .ant-form-item {
      margin: 0px;
    }
    .mx-input {
      height: 42px;
    }
    .ant-table-header-column {
      font-weight: 900;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
