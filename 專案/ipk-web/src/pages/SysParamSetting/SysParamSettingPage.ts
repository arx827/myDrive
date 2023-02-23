import Money from '@/components/shared/money/Money.vue';
import HiddenFolde from '@/components/shared/hidden-tool/HiddenFolde.vue';
import { Action } from 'vuex-class';
import moment from 'moment';
import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import { Vue, Component } from 'vue-property-decorator';
import { SysParamVo, SysParamEditDto } from '@fubonlife/ipk-api-axios-sdk';
import { MoneyData } from '@/components/shared/money/model';
import { message } from 'ant-design-vue';
import SysParamSettingForm from '@/forms/SysParamSettingForm/SysParamSettingForm.vue';
import SysParamHistForm from '@/forms/SysParamHistForm/SysParamHistForm.vue';
import { FblSubmitEvent } from '@/components/shared/form/models';
import validateUtil from '@/plugins/util/validateUtil';

@Component({
  components: {
    AdvancedSearch,
    Money,
    HiddenFolde,
    SysParamSettingForm,
    SysParamHistForm,
    IpkVxeTable,
  },
})
export default class SysParamSettingPage extends Vue {
  @Action('setLoading') setLoading;

  labelList = [];

  form = {
    paramGroup: null,
    paramId: null,
    paramName: null,
    paramValue: null,
    memo: null,
    createId: null,
    createStartDate: null,
    createEndDate: null,
  }

  advancedSearchForm = {};

  usualForm = {};

  functionName = 'SysParamSettingPage'

  isLoading = false;

  settingFormVisible = false;

  histFormVisible = false;

  params: SysParamVo = null;

  paramGroup: string = null;

  paramId: string = null;

  paramName: string = null;

  paramValue: string = null;

  memo: string = null

  createId: string = null;

  createDateArr: string[] = [];

  createStartDate: string = null;

  createEndDate: string = null;

  settingFormTitle = '';

  histFormTitle = '';

  formType = '';

  moneyData: MoneyData = { money: '', dollarSign: '$' };

  sysParamSettingEnum = [
		{ key: '維護', val: 'modify' },
		{ key: '刪除', val: 'remove' },
		{ key: '歷程', val: 'hist' },
	]

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
        title: '操作',
        field: 'actionType',
        fixed: 'left',
        headerAlign: 'left',
        align: 'center',
        width: 160,
        slots: { default: 'select' },
      },
      {
        title: '參數群組',
        field: 'paramGroup',
        width: 150,
      },
      {
        title: '參數ID',
        field: 'paramId',
        width: 150,
      },
      {
        title: '參數名稱',
        field: 'paramName',
        width: 150,
      },
      {
        title: '參數值',
        field: 'paramValue',
        width: 300,
      },
      {
        title: '說明',
        field: 'memo',
        width: 200,
      },
      {
        title: '建立人員',
        field: 'createId',
        width: 150,
      },
      {
        title: '建立日期',
        field: 'createDate',
        width: 150,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
      {
        title: '異動人員',
        field: 'updateName',
        width: 150,
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 150,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD');
        },
      },
    ],
  }

  created() {
    this.labelList = [
      { label: '參數群組', placeholder: '', type: 'inputText' },
      { label: '參數ID', placeholder: '', type: 'inputText' },
      { label: '參數名稱', placeholder: '', type: 'inputText' },
      { label: '參數值', placeholder: '', type: 'inputText' },
      { label: '說明', placeholder: '', type: 'inputText' },
      { label: '建立人員', placeholder: '', type: 'inputText' },
      { label: '建立起日', placeholder: '', type: 'rangePicker' },
      { label: '建立訖日', placeholder: '', type: 'datePicker' },
    ];

    this.advancedSearchForm = { ...this.form };
    this.usualForm = { ...this.form };
    this.reload();
  }

  // 查詢table資料
  handleSearch(e) {
    this.paramGroup = e.paramGroup;
    this.paramId = e.paramId;
    this.paramName = e.paramName;
    this.paramValue = e.paramValue;
    this.memo = e.memo;
    this.createId = e.createId;
    this.createStartDate = e.createStartDate;
    this.createEndDate = e.createEndDate;
    this.reload(e);
  }

  reload(e?) {
    this.setLoading(true);
    this.$sysParamSettingApi
      .paginateSysParamUsingPOST({
        pageNum: this.ipkGrid.pagerConfig.currentPage,
        pageSize: this.ipkGrid.pagerConfig.pageSize,
        // sort: this.ipkGrid.sort,
        paramGroup: this.paramGroup,
        paramId: this.paramId,
        paramName: this.paramName,
        paramValue: this.paramValue,
        memo: this.memo,
        createId: this.createId,
        createStartDate: this.createStartDate,
        createEndDate: this.createEndDate,
      })
      .then((res) => {
        const content = res.data.content;
        this.ipkGrid.data = [];
        const p = { ...this.ipkGrid.pagerConfig };
        p.total = parseInt(res.data.totalCount);
        if (!validateUtil.isEmpty(content)) {
          content.forEach((item) => {
            this.ipkGrid.data.push({
              ...item,
              actionType: this.sysParamSettingEnum,
              // actionTypeDisabled: true,
            });
          });
        }
        this.ipkGrid.pagerConfig = p;
      })
      .catch(console.error)
      .finally(() => {
        this.setLoading(false);
      });
  }

  // 頁數改變
  handlePageChange(e) {
    const p = { ...this.ipkGrid.pagerConfig };
    p.currentPage = e.currentPage;
    this.ipkGrid.pagerConfig.currentPage = e.currentPage;
    // this.grid.sort = e.sort;
    this.reload();
  }

  getActionType(e) {
    const data = e.rowData;
    switch (e.actionType) {
      case 'modify':
        this.settingFormTitle = '維護參數';
        this.formType = 'modify';
        this.params = JSON.parse(JSON.stringify(data));
        this.settingFormVisible = true;
        break;
      case 'remove':
        this.onRemove(e.rowData);
        break;
      case 'hist':
        this.histFormTitle = '參數歷程';
        this.params = JSON.parse(JSON.stringify(data));
        this.histFormVisible = true;
        break;
    }
  }

  onAddClick() {
    this.settingFormTitle = '新增參數';
    this.formType = 'add';
    this.params = {};
    this.settingFormVisible = true;
  }

  onSubmitAdd(e: FblSubmitEvent<SysParamEditDto, SysParamVo>) {
    this.setLoading(true);
    this.$sysParamSettingApi
      .addSysParamUsingPOST(e.value)
      .then(() => {
        message.success('儲存成功');
        this.settingFormVisible = e.formVisible;
        this.reload();
      })
      .catch(() => {
        console.error;
        message.error('儲存失敗');
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  onSubmitModify(e: FblSubmitEvent<SysParamEditDto, SysParamVo>) {
    this.setLoading(true);
    this.$sysParamSettingApi
      .modifySysParamUsingPOST(e.value)
      .then(() => {
        message.success('儲存成功');
        this.settingFormVisible = false;
        this.reload();
      })
      .catch(() => {
        console.error;
        message.error('儲存失敗');
      })
      .finally(() => {
        this.setLoading(false);
      });
  }

  onRemove(data: SysParamVo) {
    // Modal.confirm({
    //   title: '刪除確認?',
    //   cancelText: '取消',
    //   okText: '送出',
    //   onOk: () => {
    //     this.$sysParamSettingApi.removeSysParamUsingDELETE(data)
    //       .then((resp) => {
    //         message.success('刪除成功!');
    //       })
    //       .finally(() => {
    //         this.reload();
    //       });
    //   },
    // });
  }
}
