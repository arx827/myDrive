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
      <div class="modal-container">
        <div class="modal-container__title">
          查看護理紀錄
        </div>
        <div class="modal-container__table">
          <FblDataGrid
            :row-key="GridData.rowKey"
            :columns="GridData.columns"
            :data="GridData.data"
            :pagination="GridData.pagination"
            :empty-data="GridData.data.length <= 0"
          />
        </div>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary mb-2"
            @click="onClose"
          >
            返回
          </button>
        </div>
      </div>
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
import { UidDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
	@Action('setLoading') setLoading;

  @Prop()
  visible: boolean

	@Prop()
	uid

  modalVisible = false;

  @Watch('visible')
  async onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		await this.getGridData();
  		this.mappingTable();
  	}
  }

  onClose() {
  	this.$emit('closeViewModal');
  }

  // 欲合併的資料欄位
  rowSpanPlanCate = [];

  // 欄位資料
  GridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'srcFromDesc',
  			title: '計畫類別',
  			// 上下合併
  			customRender: (data, record, index, column) => ({
  				children: data.srcFromDesc,
  				attrs: {
  					rowSpan: this.rowSpanPlanCate[index],
  				},
  			}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'recordDt',
  			title: '紀錄時間',
  			formatter: (data) => (moment(data.recordDt).format('YYYY/MM/DD')),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'careRecordTypeDesc',
  			title: '護理紀錄類別',
  		},
      	{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			title: '備註說明',
  		},
  	],
  }

  async getGridData() {
  	const userData: UidDto = {
  		// uid: 1, // 測試用
  		uid: this.uid,
  	};
  	this.setLoading(true);
  	await this.$CaseMaintainUtilityApi.rpnRecordUsingPOST(userData)
  		.then((resp) => {
  			this.GridData.data = resp.data.data;
  			this.GridData.data = this.GridData.data.sort((a, b) => (a.srcFrom < b.srcFrom ? 1 : -1));
  			this.GridData.data.forEach((item, index) => {
  				item.rowkey = index + 1;
  			});
  		})
  		.catch((error) => {
  			console.log('error status: ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 表格合併
  getRowSpan(property) {
  	const rowSpanList = [];
  	const dataTitle = this.GridData.data.map((dto) => dto[property]);
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

  // 處理table
  mappingTable() {
  	// 處理合併欄位
  	this.rowSpanPlanCate = this.getRowSpan('srcFromDesc');

  	console.log(this.rowSpanPlanCate);

  	// 【類別】欄位 合併
  	this.GridData.columns.find((i) => i.property == 'srcFromDesc').customRender = (data, record, index) => ({
  		children: record.srcFromDesc,
  		attrs: {
  			rowSpan: this.rowSpanPlanCate[index],
  		},
  	});
  }

  async created() {
  	// 由於合併欄位 須在取得資料後 才處理合併，使用 async
  	// await this.getGridData();
  	// this.mappingTable();
  }
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
    padding-top: 10px;
    .modal-container__title {
      font-size: 30px;
      font-weight: $TEXT-BOLD;
      margin-bottom: 20px;
    }
  }
  ::v-deep {
    .ant-table-tbody > tr > td {
      vertical-align: top;
    }
  }
</style>
