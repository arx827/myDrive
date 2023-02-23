import {
  Vue, Component, Prop, Watch,
 } from 'vue-property-decorator';
 import { SysParamVo } from '@fubonlife/ipk-api-axios-sdk';
 import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
 import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import moment from 'moment';

@Component({
  components: {
    IpkVxeTable,
  },
})
export default class SysParamHistForm extends Vue {
  @Prop()
  public initData: any;

  @Prop()
  public loading: boolean;

  form: SysParamVo = null;

  checked = false;

  sort = undefined;

  sysParamHistEnum = [
    { key: '新增', val: 'A', color: 'green' },
    { key: '修改', val: 'M', color: 'blue' },
    { key: '刪除', val: 'D', color: 'black' },
	]

  created(): void {
    this.reset();
    this.reload();
  }

  @Watch('initData')
  onInitDataChanged(): void {
    this.reset();
    this.reload();
  }

  reset() {
    if (this.initData) {
      this.form = JSON.parse(JSON.stringify(this.initData));
    } else {
      this.form = null;
    }
  }

  ipkGrid: IpkVxeTableModel = {
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: true,
    showOverflow: 'ellipsis',
    columns: [
      {
        field: 'histId',
        title: '歷程ID',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 100,
      },
      {
        field: 'changeType',
        title: '類型',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 80,
        slots: {
          default: ({ row }, h) => [
            h('a-tag',
            { props: { color: this.getObject(this.sysParamHistEnum, row.changeType).color } },
            this.$actEnum.getObject('batchLogStatusEnum', row.changeType).key),
          ],
        },
      },
      {
        field: 'paramGroup',
        title: '參數群組',
        width: 100,
      },
      {
        field: 'paramId',
        title: '參數ID',
        width: 100,
      },
      {
        field: 'paramName',
        title: '參數名稱',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 110,
      },
      {
        field: 'paramValue',
        title: '參數值',
        width: 200,
      },
      {
        field: 'memo',
        title: '說明',
        width: 120,
      },
      {
        field: 'createName',
        title: '建立人員',
        width: 100,
      },
      {
        field: 'createDate',
        title: '建立日期',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 120,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        field: 'updateName',
        title: '異動人員',
        width: 100,
      },
      {
        field: 'updateDate',
        title: '異動日期',
        sortable: true,
        sortConfig: { orders: ['desc', 'asc'], remote: true, showIcon: true },
        width: 120,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  }

  // 查詢歷程表格欄位排序
  onSortChange(e) {
    this.sort = e.sort;
    this.reload();
  }

  reload() {
    this.$sysParamSettingApi
      .paginateSysParamHistUsingPOST({
        pageNum: this.ipkGrid.pagerConfig.currentPage,
        pageSize: this.ipkGrid.pagerConfig.pageSize,
        sort: this.sort,
        paramGroup: this.form.paramGroup,
        paramId: this.form.paramId,
      })
      .then((res) => {
        const p = { ...this.ipkGrid.pagerConfig };
        p.total = parseInt(res.data.totalCount);
        this.ipkGrid.data = res.data.content;
        this.ipkGrid.pagerConfig = p;
      })
      .catch(console.error)
      .finally();
  }

  public cancel() {
    this.$emit('formCancel');
  }

  getObject(objName, index) {
		if (this[objName].find((i) => i.val === index)) {
			return this[objName].find((i) => i.val === index);
		}
		return '';
	}
}
