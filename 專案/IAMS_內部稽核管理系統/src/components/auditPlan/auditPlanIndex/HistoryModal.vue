<template>
  <InfoModal
    title="編制歷程"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    @closeModal="closeModal"
  >
    <template slot="content">
      <div class="container historyModal__container mt-2">
        <accordion-area>
          <div class="search-form mt-2 row align-items-end">
            <a-form-model
              ref="formRef"
              :rules="rules"
              class="col-11 row"
              :model="form"
              :hide-required-mark="true"
            >
              <div class="search-form__item col">
                <div class="search-form__label">
                  年度
                </div>
                <a-form-model-item
                  prop="year"
                >
                  <a-select
                    v-model="form.year"
                    placeholder="請選擇年度"
                    class="w-100"
                    :filter-option="$global.filterOption"
                    :options="initOptions.yearOptions"
                    :dropdown-match-select-width="false"
                    @change="handleYearChange"
                  />
                </a-form-model-item>
              </div>
              <div class="search-form__item col">
                <div class="search-form__label">
                  月份
                </div>
                <a-form-model-item
                  prop="month"
                >
                  <a-select
                    v-model="form.month"
                    :filter-option="$global.filterOption"
                    placeholder="請選擇月份"
                    class="w-100"
                    :allow-clear="true"
                    :options="$enum.monthOption"
                  />
                </a-form-model-item>
              </div>
              <div class="search-form__item col">
                <div class="search-form__label">
                  查核性質
                </div>
                <a-form-model-item
                  prop="auditType"
                >
                  <a-select
                    v-model="form.auditType"
                    :filter-option="$global.filterOption"
                    :options="initOptions.typeOption"
                    :allow-clear="true"
                    placeholder="請選擇查核性質"
                    class="w-100"
                  />
                </a-form-model-item>
              </div>
              <div class="search-form__item col">
                <div class="search-form__label">
                  查核項目
                </div>
                <a-form-model-item
                  prop="auditItems"
                >
                  <a-select
                    v-model="form.auditItems"
                    :options="itemOption"
                    :allow-clear="true"
                    placeholder="請選擇查核項目"
                    class="w-100"
                    :filter-option="$global.filterOption"
                  />
                </a-form-model-item>
              </div>
              <div class="search-form__item col">
                <div class="search-form__label">
                  組別
                </div>
                <a-form-model-item
                  prop="auditorTeam"
                >
                  <a-select
                    v-model="form.auditorTeam"
                    :filter-option="$global.filterOption"
                    :allow-clear="true"
                    placeholder="請選擇查核組別"
                    class="w-100"
                    :options="initOptions.teamOption"
                  />
                </a-form-model-item>
              </div>
            </a-form-model>
            <a-button
              class="mb-1 btn--search col-1"
              @click="onSubmit"
            >
              查詢
            </a-button>
          </div>
        </accordion-area>
        <fbl-data-grid
          class="query__table mt-3"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :custom-row="grid.customRow"
          :scroll="{ x: true }"
          @tableChange="handleTableChange"
        >
          <div>底部文字</div>
        </fbl-data-grid>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import AccordionArea from '@/components/shared/AccordionArea.vue';
import {
	SearchAuditPlanForLog, SelectOptionDto,
} from '@fubonlife/iams-api-axios-sdk';
import { Action, namespace } from 'vuex-class';

const modalControl = namespace('modalControl');

interface initOptionsType {
  teamOption: SelectOptionDto[];
  typeOption: SelectOptionDto[];
  yearOptions: SelectOptionDto[];
}

@Component({
	components: { InfoModal, FblDataGrid, AccordionArea },
})
export default class HistoryModal extends Vue {
  @modalControl.Action('setModalState') setModalState;

  @Action('setLoading') setLoading;

  @Prop()
  initOptions: initOptionsType

	@Prop()
	initSearchForm

  @Prop()
  visible

  @Watch('initSearchForm', { deep: true })
  watchSearchForm() {
  	this.form = this.$global.deepCopyData(this.initSearchForm);
  }

  @Watch('visible', { deep: true })
  async watchVisible(value: boolean) {
  	if (value) {
  		await this.handleYearChange();
  		await this.onSearch();
  	}
  }

  // 查核項目選項
  itemOption= []

  request: SearchAuditPlanForLog

  form = {
  	year: null,
  	month: null,
  	auditType: null,
  	auditItems: null,
  	auditorTeam: null,
  }

  rules={
  	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  }

  public grid = {
  	rowKey: 'yapLogId',
  	data: [],
  	pagination: {
  		size: 'small',
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  		showSizeChanger: true,
  		showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  	},
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'month',
  			title: '月份',
  			width: '95px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'auditItem',
  			title: '查核項目',
  			width: '117px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateTeam',
  			title: '編輯組別',
  			width: '150px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateUser',
  			title: '編輯人員',
  			width: '108px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateDate',
  			title: '編輯日期',
  			width: '163px',

  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'operate',
  			title: '執行動作',
  			width: '210px',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			title: '備註',
  			width: '210px',
  		},
  	],
  };

  // table pagination改變
  handleTableChange(e) {
  	this.grid.pagination.current = e.pagination.current;
  	this.grid.pagination.pageSize = e.pagination.pageSize;
  	this.onSearch();
  }

  closeModal() {
  	this.$emit('closeModal');
  }

  // 選擇年度變更查核項目選項
  async handleYearChange() {
  	await this.$auditPlanApi.searchAuditItemInAuditPlanUsingGET(String(this.form.year), true)
  		.then((resp) => {
  		this.itemOption = resp.data.result;
  	})
  		.catch((err) => {
  		console.log(err);
  	})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 查詢編制歷程
  async onSearch() {
  	this.setLoading(true);
  	this.request = {
  		pageIndex: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  		...this.form,
  		auditItems: [],
  	};
  	this.form.auditItems ? this.request.auditItems.push(this.form.auditItems) : this.request.auditItems = [];

  	await this.$auditPlanApi.searchYapLogInAuditPlanUsingPOST(this.request)
  		.then((resp) => {
  			this.grid.data = [];
  			this.grid.data = resp.data.result.content;
  			this.grid.pagination.total = parseInt(resp.data.result.totalElements);
  		})
  		.catch((err) => {
  			console.log(err.response);
  			this.grid.data = err.response.data.result;
  			this.grid.pagination.total = err.response.data.total;
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					title: err.response.data.message,
  					type: 'error',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onSubmit() {
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.grid.pagination.current = 1;
  		  this.onSearch();
  		}
  	});
  }
}

</script>

<style lang="scss" scoped>
.query__table{
  ::v-deep{
    .ant-table-thead tr th:first-child ,.ant-table-tbody tr td:first-child {
      padding-left:37px ;
    }
    .ant-table-tbody tr td:first-child {
      padding-left:37px ;
    }
    .ant-table tr:nth-child(even){
      background: $COLOR-LIGHT;
    }
  }
}
.btn__block{
  float: right;
  margin-top: 15px;
  margin-bottom: 9px;
  z-index: 2;
}
.historyModal__container{
  background: $COLOR_LIGHT;
}
.search-form{
  margin: 0;
}
.search__select{
	width: 190px;
}
</style>
