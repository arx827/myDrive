<template>
  <div class="main-contain container">
    <ActionBar
      :is-auditor="isAuditor"
      :is-leader="isLeader"
      @click="handleClick"
    />
    <div
      class="d-flex mb-3"
    >
      <div class="me-2 search-form__label flex-center">
        提供部門
      </div>
      <a-select
        v-model="units"
        :default-value="units"
        show-search
        :filter-option="$global.filterOption"
        class="me-2 search-form__input--select"
        placeholder="請選擇提供部門"
        mode="multiple"
        @blur="handleSearch"
      >
        <a-select-option
          v-for="(unit) in unitOption"
          :key="unit.unitCode"
          :value="unit.unitCode"
        >
          {{ unit.unitName }}
        </a-select-option>
      </a-select>
    </div>
    <div class="list__wrap">
      <div class="row align-items-center">
        <div class="list__info col">
          <div class="list__info__item mb-2 row">
            <div class="list__info__item-label col">
              受查單位
            </div>
            <div class="list__info__item-text col-7">
              保費帳務部門
            </div>
          </div>
          <div class="list__info__item mb-2 row">
            <div class="list__info__item-label col">
              查核範圍期間
            </div>
            <div class="list__info__item-text col-7">
              111/01/01-111/03/31
            </div>
          </div>
        </div>
        <div class="page__title col-7">
          <span>{{ title.year }}</span>年度<span>{{ title.pickItem }}</span>作業-調閱清單
        </div>
        <div class="col" />
        <fbl-data-grid
          class="query__table"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="false"
          :scroll="{ x: true }"
        >
          <template #action="data">
            <div class="btn__wrap flex-center">
              <div
                class="btn__icon--edit-acion me-2"
                @click="handleEditAndAdd('edit',data.data)"
              />
              <CustomPopConfirm
                @confirm="deleteItem(data.data)"
              >
                <div
                  class="btn__icon--delete-action"
                />
              </CustomPopConfirm>
            </div>
          </template>
        </fbl-data-grid>
      </div>
      <EditAndAdd
        :visible="editAndAddVisible"
        :init-data="editItem"
        :type="modalType"
        @confirmModal="editAndAddConfirm"
        @closeModal="editAndAddVisible=false"
      />
      <ImportOddData
        :visible="importOddDataVisible"
        @closeModal="importOddDataVisible=false"
        @confirmModal="importconfirm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import EditAndAdd from '@/components/preparation/documentTetrieval/EditAndAddModal.vue';
import { RoleDto } from '@fubonlife/iams-api-axios-sdk';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import ActionBar from '@/components/preparation/documentTetrieval/ActionBar.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import ImportOddData from '@/components/documentTetrieval/ImportOddData.vue';

@Component({
	components: {
		ActionBar, FblDataGrid, IconTextButton, EditAndAdd, ImportOddData, CustomPopConfirm,
	},
})
export default class DocumentTetrieval extends Vue {
  h = this.$createElement;

  // 標題 年分/調閱清單項目
  title = {
  	year: '111',
  	pickItem: '保費帳務作業',
  }

  editAndAddVisible = false

  importOddDataVisible = false

  // 查核期間結束日大於今日
  isEnd: boolean = false

  // 新增/編輯調閱清單彈窗Type
  modalType: 'add'|'edit' = 'add'

  // 是否為領隊
  isLeader = false

  // 是否為查核人員
  isAuditor = false

  role: RoleDto

  // 編輯調閱清單項目
  editItem = {}

  // 提供部門
  units = []

  // 提供部門選項
  unitOption = [
  	{
  		unitCode: '01',
  		unitName: '部門1',
  	},
  	{
  		unitCode: '02',
  		unitName: '部門2',
  	},
  ]

  public grid = {
  	rowKey: 'index',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'index',
  			title: '',
  			width: 25,
  			template: '',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'data',
  			title: '調閱資料',
  			width: 250,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'department',
  			title: '提供部門',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'version',
  			title: '版本',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'rangeTime',
  			title: '資料期間',
  			width: 200,
  			customRender: (data) => this.h('div', {},
  			`${this.$twDateFormatter.stringify(data.startTime)} - ${this.$twDateFormatter.stringify(data.endTime)}`),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			width: 200,
  			title: '備註',
  		},
  	],
  }

  fakeData = [
  	{
  		index: 1,
  		data: '部門組織架構圖及人力配置、部門功能執掌',
  		department: '保費帳務部',
  		version: '最新版本',
  		startTime: new Date('2022/01/01'),
  		endTime: new Date('2022/03/21'),
  	},
  	{
  		index: 2,
  		data: '人員工作執長(含職務代理人)',
  		department: '保費帳務部',
  		version: '最新版本',
  		startTime: new Date('2022/01/01'),
  		endTime: new Date('2022/03/21'),
  	},
  	{
  		index: 3,
  		data: '作業辦法、作業執導書、流程圖、作業相關、作業等',
  		department: '保費帳務部',
  		version: '最新版本',
  		startTime: new Date('2022/01/01'),
  		endTime: new Date('2022/03/21'),
  	},
  ]

  created() {
  	this.role = this.$global.getCurrentRole();
  	if (this.role.id === 'ROLE_Auditor') {
  		// 查核人員
  		this.isAuditor = true;
  		// TODO: 判斷是否為領隊
  		// TEST:uditor
  		this.isLeader = true;

  		// 是領隊增加action欄位
  		if (this.isLeader) {
  			this.grid.columns.push({
  				type: FblColumnType.TEMPLATE,
  				property: 'action',
  				title: '',
  				width: 100,
  				template: 'action',
  		  });
  		}
  	} else if (this.role.id === 'ROLE_Audit_Team_Head' || this.role.id === 'ROLE_Audit_Department_Head') {
  		// 部主管或部主管
  		this.isAuditor = false;
  	}

  	this.grid.data = this.fakeData;
  }

  handleEditAndAdd(type: 'edit'|'add', data) {
  	this.editItem = data;
  	this.modalType = type;
  	this.editAndAddVisible = true;
  }

  handleClick(action) {
  	switch (action) {
  	case 'add':
  		this.handleEditAndAdd('add', null);
  		break;
  	case 'save':
  		console.log('儲存');
  	  break;
  	case 'return':
  		this.$router.back();
  		break;
  	case 'import':
  		this.importOddDataVisible = true;
  		break;
  	case 'download':
  		console.log('下載');
  		break;
  	}
  }

  // 匯入舊資料彈窗 新增
  importconfirm() {
  	// TODO: 匯入調閱新增API
  	this.importOddDataVisible = false;
  }

  // 確認 新增/編輯調閱清單
  editAndAddConfirm(data) {
  	// API:調閱新增/編輯 API
  	this.editAndAddVisible = false;
  }

  // 查詢提供部門
  handleSearch(value) {
  	console.log('查詢', value);
  }

  deleteItem() {
  	// 刪除
  }
}
</script>

<style lang="scss" scoped>
.page__title{
  color: #000;
  display: flex;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  line-height: 1em;
  margin-bottom: 20px;
  span {
    font-size: 28px;
    border-bottom: 1px solid #707070 ;
    margin-bottom: 0;
    font-weight: normal;
    padding:0 10px
  }
}
.list__wrap{
  padding: 36px 10px;
  border: 2px solid #00829B;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 22px;
}
.list__info{
  .list__info__item-label{
    text-align:right;
    font-size: 14px;
  }
  .list__info__item-text{
    padding: 3px 10px;
    margin-left: 6px;
    background: $COLOR-MAIN7;
    font-size: 14px;
  }
}
::v-deep .query__table{
  table,tr, td, th{
    border: 1px solid #D9D9D9;
  }
  th{
    background-color: $COLOR_LIGHT;
    color: #000;
    font-weight: 600;
  }
  .ant-table table{
    border-radius: 0;
  }
  .ant-table .ant-table-column-title{
    font-size: 16px;
  }
  .ant-table-thead > tr:first-child > th:last-child{
    border-top-right-radius: 0;
  }
  .ant-table-thead > tr:first-child > th:first-child{
    border-top-left-radius: 0;
  }
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background-color: $COLOR_LIGHT;
  }
}

</style>
,
