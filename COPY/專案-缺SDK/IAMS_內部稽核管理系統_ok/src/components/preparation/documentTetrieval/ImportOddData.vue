<template>
  <InfoModal
    title="調閱清單-選擇項目匯入舊資料"
    :visible="visible"
    :centered="true"
    body-size="large"
    padding-size="small"
    @closeModal="closeModal"
  >
    <template slot="content">
      <fragment>
        <div class="content__wrap mt-2">
          <div class="d-flex mb-3">
            <div class="me-2 search-form__label flex-center">
              年度
            </div>
            <a-select
              v-model="form.year"
              show-search
              :filter-option="$global.filterOption"
              placeholder="請選擇年度"
              class="me-2 search-form__input--select "
            >
              <a-select-option
                v-for="(item) in yearOption"
                :key="item.year"
                :value="item.year"
              >
                {{ item.year }}
              </a-select-option>
            </a-select>
            <a-select
              v-model="form.auditItem"
              show-search
              :filter-option="$global.filterOption"
              class="me-2 search-form__input--select"
              placeholder="請選擇查核項目"
            >
              <a-select-option
                v-for="(item) in auditItemOption"
                :key="item.selectedvalue"
                value="item.selectedvalue"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-button
              class="btn--search"
              @click="handleSearch"
            >
              查詢
            </a-button>
          </div>
          <a-table
            class="query__table__wrap table--pale"
            :columns="columns"
            :data-source="gridData"
            :row-selection="rowSelection"
            :scroll="{ x: 868 }"
          >
            <template
              slot="range"
              slot-scope="text,record"
            >
              <div v-if="record.startTime">
                {{ record.startTime }} - {{ record.endTime }}
              </div>
            </template>
          </a-table>
        </div>
        <div class="d-flex mt-4 justify-content-end">
          <button
            class="btn--primary me-2"
            @click="hanldleAdd"
          >
            新增
          </button>
          <button
            class="btn--dark ms-2"
            @click="closeModal"
          >
            取消
          </button>
        </div>
      </fragment>
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

@Component({
	components: { FblDataGrid, InfoModal },
})
export default class ImportOddData extends Vue {
  @Prop()
  visible

  // 時間format格式
  formatter = this.$twDateFormatter;

  selecValue =null

  form = {
  	year: null,
  	auditItem: null,
  }

  // 查核項目選項
  auditItemOption = [
  	{
  		label: '查核項目1',
  		selectedvalue: 'item1',
  	},
  	{
  		label: '查核項目2',
  		selectedvalue: 'item2',
  	},
  ]

  // 年份選項
  yearOption = [
  	{
  		year: '111',
  	},
  	{
  		year: '110',
  	},
  	{
  		year: '109',
  	},

  ]

  columns = [
  	{
  		title: '調閱資料',
  		dataIndex: 'data',
  		key: 'data',
  		width: 400,
  		fixed: 'left',
  	},
  	{
  		title: '受查單位',
  		dataIndex: 'department',
  		key: 'department',
  		width: 150,
  	},
  	{
  		title: '版本',
  		dataIndex: 'version',
  		key: 'version',
  		width: 150,
  	},
  	{
  		title: '資料期間',
  		dataIndex: 'range',
  		key: 'range',
  		width: 250,
  		scopedSlots: {
  				customRender: 'range',
  			},
  	},
  	{
  		title: '備註',
  		dataIndex: 'remark',
  		key: 'remark',
  		width: 150,
  	},
  ];

  // 表格中的資料
  gridData= []

  // TEST:
  fakeData = [
  	{
  		key: 1,
  		data: '部門組織架構圖及人力配置、部門功能執掌',
  		children: [
  			{
  				key: 5,
  				data: '人員工作執長(含職務代理人)',
  				department: '保費帳務部',
  				version: '最新版本',
  				startTime: '111/01/01',
  				endTime: '111/03/21',
  				remark: '',
  			},
  			{
  				key: 6,
  				data: '作業辦法、作業執導書、流程圖、作業相關、作業等',
  				department: '保費帳務部',
  				version: '最新版本',
  				startTime: '111/01/01',
  				endTime: '111/03/21',
  				remark: '',
  			},
  		],
  	},
  	{
  		key: 2,
  		data: '業務員挪用保費改善情形',
  		children: [
  			{
  				key: 7,
  				data: '人員工作執長(含職務代理人)',
  				department: '保費帳務部',
  				version: '最新版本',
  				startTime: '111/01/01',
  				endTime: '111/03/21',
  				remark: '',
  			},
  			{
  				key: 8,
  				data: '作業辦法、作業執導書、流程圖、作業相關、作業等',
  				department: '保費帳務部',
  				version: '最新版本',
  				startTime: '111/01/01',
  				endTime: '111/03/21',
  				remark: '',
  			},
  		],
  	},
  ];

  // 查詢 年度/查核項目
  handleSearch() {
  	// API: 匯入調閱查詢 API
  	this.gridData = this.fakeData;
  }

  // 選擇表格row
  rowSelection = {
  	onChange: (selectedRowKeys, selectedRows) => {
  		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  	},
  	onSelect: (record, selected, selectedRows) => {
  		console.log('onselect', record, selected, selectedRows);
  	},
  	onSelectAll: (selected, selectedRows, changeRows) => {
  		console.log('onSelectAll', selected, selectedRows, changeRows);
  	},
  };

  closeModal() {
  	this.$emit('closeModal');
  }

  // 新增
  hanldleAdd() {
  	// API: 匯入調閱新增 API
  	this.$emit('confirmModal');
  }
}
</script>

<style lang="scss" scoped>
.content__wrap{
  background: $COLOR_LIGHT;
  padding: 16px;
}

.form__picker{
  width: 170px;
}
::v-deep .query__table__wrap{

  thead {
    th{
      border-left: 1px solid #D9D9D9;
    }
    th:first-child{
      border-left: none;
    }
    th:nth-child(2){
      border-left: none;
      padding-left: 43px;
    }
  }
  tr.ant-table-row-level-1{
    td {
      border-right: 1px solid #D9D9D9;
    }
    td:first-child,td:last-child{
      border-right: none;
    }
    td:nth-child(2){
      border-left: none;
      padding-left: 44px;
    }
    .ant-table-row-expand-icon{
      display: none;
    }
    .ant-table-row-indent{
      display: none;
    }
  }
  tr td{
    border-bottom: 1px solid #D9D9D9;
  }
  .ant-table .ant-table-column-title{
    font-size: 16px;
    font-weight: 100;
    font-weight: 600;
  }
  .ant-table-row-level-0{
    .ant-checkbox-wrapper {
      pointer-events: none;
      .ant-checkbox-inner{
        background: #FAFAFA;
      }
    }
    .ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner{
      border: none;
    }
  }
}
</style>
