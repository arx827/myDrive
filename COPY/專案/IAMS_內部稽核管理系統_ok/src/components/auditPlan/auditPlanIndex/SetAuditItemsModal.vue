<template>
  <InfoModal
    title="查核項目設定"
    :visible="visible"
    body-size="large"
    padding-size="small"
    :closable="true"
    :centered="false"
    :footer="false"
    @closeModal="close"
  >
    <template slot="content">
      <div class="content">
        <div class="d-flex">
          年度：{{ year }}
          <button
            class="btn--action ms-auto mb-1"
            @click="addNewItem"
          >
            新增
          </button>
        </div>
        <a-table
          class="table__wrap"
          row-key="value"
          bordered
          :data-source="filterAuditItemsList"
          :columns="grid.columns"
          :scroll="{x:false,y:'500px'}"
          :pagination="false"
        >
          <div
            slot="filterDropdown"
            slot-scope="{clearFilters}"
            class="search__wrap"
          >
            <a-input
              v-model="keyword"
              class="input__search"
              @pressEnter="fuzzySearch"
            />
            <div class="d-flex">
              <button
                type="primary"
                class="btn--dark--small btn__search flex-center"
                @click="fuzzySearch"
              >
                查詢
              </button>
              <button
                class="btn--light--small btn__search flex-center"
                @click="searchReset(clearFilters)"
              >
                取消
              </button>
            </div>
          </div>
          <a-icon
            slot="filterIcon"
            type="search"
            class="icon--filter"
          />
          <template
            slot="icon"
          >
            <div class="table__tbody-icon">
              <img
                src="@/assets/images/icon/icon_announcement_2.svg"
                alt=""
              >
            </div>
          </template>
          <template
            slot="auditItem"
            slot-scope="text,record"
          >
            <div class="table__tbody__item">
              <a-input
                v-if="record.isEdit"
                v-model="record.editName"
              />
              <template v-else>
                {{ record.name }}
              </template>
            </div>
          </template>
          <template
            slot="action"
            slot-scope="text,record"
          >
            <button
              v-if="!record.isEdit"
              class="btn--action"
              @click="setEdit(record.value,true)"
            >
              編輯
            </button>
            <button
              v-if="record.isEdit"
              class="btn--action"
              :disabled="!record.editName && record.editName.length == 0"
              @click="save(record)"
            >
              儲存
            </button>
            <button
              v-if="record.isEdit"
              class="btn--action ms-2"
              @click="record.value.includes('add')? deleteAuditItem(record.value) : setEdit(record.value,false)"
            >
              取消
            </button>
          </template>
        </a-table>
      </div>
    </template>
  </InfoModal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import { SelectOptionDto } from '@fubonlife/iams-api-axios-sdk';
import { uuid } from 'vue-uuid';
import Fuse from 'fuse.js';

const modalModule = namespace('modalControl');

export interface AuditItem {
  name: string;
  editName: string;
  value: string;
  isEdit: boolean;
}

@Component({
	components: {
		InfoModal,
	},
})
export default class SetAuditItemsModal extends Vue {
  @Action('setLoading') setLoading;

  @modalModule.Action('setModalState') setModalState;

  @Prop()
  visible: boolean

  @Prop()
  auditItemsOption: SelectOptionDto[];

  @Prop()
  year: string

  @Watch('auditItemsOption', { immediate: true, deep: true })
  onAuditItemsOptionChanged(val: SelectOptionDto[]) {
  	if (val && val.length !== 0) {
  		this.auditItemsList = val.map((e) => ({
  			name: e.label,
  			editName: e.label,
  			value: e.value,
  			isEdit: false,
  		}));
  		this.filterAuditItemsList = this.auditItemsList;
  		console.log('filterAuditItemsList', this.filterAuditItemsList);
  	}
  }

  // 模糊搜尋關鍵字
  keyword: string = '';

  auditItemsList: AuditItem[] = [];

  filterAuditItemsList: AuditItem[] = [];

  grid = {
  	columns: [
  		{
  			title: '查核項目',
  			dataIndex: 'auditItem',
  			width: '75%',
  			key: 'auditItem.value',
  			scopedSlots: {
  				filterDropdown: 'filterDropdown',
  				filterIcon: 'filterIcon',
  				customRender: 'auditItem',
  			},
  		},
  		{
  			title: '',
  			dataIndex: 'auditItem',
  			key: 'action',
  			width: '25%',
  			scopedSlots: {
  				customRender: 'action',
  			},
  		},
  	],
  }

  addNewItem() {
  	this.filterAuditItemsList.unshift({
  		name: '',
  		editName: '',
  		value: `add${uuid.v4()}`,
  		isEdit: true,
  	});
  	// console.log('auditItemsList', this.auditItemsList);
  }

  // 將修改編輯狀態
  setEdit(value, isEdit) {
  	this.filterAuditItemsList.find((e) => e.value === value).isEdit = isEdit;
  }

  // 儲存
  save(auditItem: AuditItem) {
  	if (this.auditItemNameValidtor(auditItem.editName)) {
  		const request = {
  			auditItemName: auditItem.editName,
  			auditItem: auditItem.value.includes('add') ? undefined : auditItem.value,
  			year: this.year,
  		};
  		this.$emit('save', request);
  	} else {
  		this.setModalState({
  			resultModal: {
  				visible: true,
  				type: 'warning',
  				title: '查核項目名稱不得重複',
  			},
  		});
  	}
  }

  // 模糊搜尋
  fuzzySearch() {
  	if (this.keyword) {
  		const options = {
  			includeScore: true,
  			keys: ['name'],
  		};

  		const fuse = new Fuse(this.auditItemsList, options);
  		const result = fuse.search(this.keyword);
  		this.filterAuditItemsList = result.map((item) => item.item);
  	} else {
  		this.filterAuditItemsList = this.auditItemsList;
  	}
  }

  searchReset(clearFilters) {
  	clearFilters();
  	this.keyword = '';
  }

  deleteAuditItem(value) {
  	const deletedItem = this.filterAuditItemsList.findIndex((auditItem) => auditItem.value === value);
  	this.filterAuditItemsList.splice(deletedItem, 1);
  }

  // 檢核查核項目名稱是否有重複
  auditItemNameValidtor(auditItemName): boolean {
  	return this.auditItemsList.find((auditItem) => { console.log(auditItem.name, auditItemName); return auditItem.name === auditItemName; }) === undefined;
  }

  close() {
  	// this.resetAuditItemsList();
  	this.$emit('closeModal');
  }
}
</script>

<style lang="scss" scoped>
.content{
  margin-top: 16px;
  background-color: $BG-LIGHT;
  max-height: calc(100vh - 265px) ;
  overflow-y: auto;
  padding: 10px 36px;

}
/*----------------------------table-------------------------*/
::v-deep{
  .table__wrap{
    //  table-header
    .ant-table .ant-table-column-title {
      font-size: 16px;
    }
    .ant-table-header{
      background-color: #FAFAFA;
    }
    .ant-table-thead > tr > th{
      text-align: left;
      background-color: #FAFAFA;
      color:#000;
      padding: 12px 40px;
    }
    //  header 查詢icon 按鈕
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .anticon-filter.ant-table-filter-open, .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .ant-table-filter-icon.ant-table-filter-open{
      background: rgba($color: #000000, $alpha: 0);
    }
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters:hover .ant-table-filter-icon:hover{
      background: rgba($color: #000000, $alpha: 0);
    }
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .ant-table-filter-icon{
      color :#7E84A3;
    }

    // table-body
    .ant-table tr{
      background: $COLOR-LIGHT;
    }
    .ant-table-tbody > tr > td{
      padding: 12px;
      vertical-align: middle;
    }
    .ant-table-tbody > tr > td:nth-child(1){
      padding-left: 40px;
    }
    .table__tbody__item .table__tbody__item-bold{
      color:#000;
    }
  }
}
    // 查詢窗
.search__wrap{
  padding: 12px;
  .input__search{
    display: block;
    margin-bottom: 8px;
  }
  .btn__search{
    // padding: 4px 0px;
    width: 100%;
    height: 26px;
  }
  .btn__search:nth-child(1){
    margin-right: 8px;
  }
}
.icon--filter{
  color: #7E84A3;
  font-size: 18px;
  margin-right: 8px;
}
</style>
