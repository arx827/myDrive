import {
  Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import InfoModal from '@/plugins/notification/infoModal';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import validateUtil from '@/plugins/util/validateUtil';
import moment from 'moment';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';
import IpkButton from '@/components/shared/buttons/IpkButton.vue';
import SsiCheckInfoModal from '@/pages/cf/CounterpartySsi/SsiCheckInfoModal.vue';

@Component({
  components: {
    IpkVxeTable,
    SsiCheckInfoModal,
    IpkButton,
  },
})
export default class SsiHistoryModal extends Vue {
  @Action('setLoading') setLoading;

  /**
  * props
  */
  @Prop()
  historyShow: boolean // modal開關

  @Prop()
  historyInfo: any // 傳進來的資訊

  /**
  * data
  */
  modalVisible = false // modal開關

  tempHistoryInfo = {}; // [歷程彈窗] 暫存歷程內容換頁、排序使用

  // checkShow = false; // [檢視彈窗] modal開關

  modalCheckInfoShow = false; // [檢視彈窗] modal開關

  checkInfo = { // [檢視彈窗] 資料帶入
    actionType: null,
    editInfo: {},
  };

  ipkGrid: IpkVxeTableModel = { // [歷程查詢]
    data: [],
    pagerConfig: {
      enabled: true,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
      layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    },
    border: true,
    showOverflow: 'ellipsis',
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '操作類型',
        field: 'action',
        width: 100,
        slots: { default: 'action' },
      },
      {
        title: '機構編號',
        field: 'counterpartyId',
        width: 300,
      },
      {
        title: '產品別',
        field: 'productName',
        width: 200,
      },
      {
        title: '幣別',
        field: 'currency',
        width: 150,
      },
      {
        title: '受款行銀行帳號',
        field: 'bfBankAccount',
        width: 150,
      },
      {
        title: '受款人帳號',
        field: 'bfAccount',
        width: 150,
      },
      {
        title: 'Broker ID Type',
        field: 'brokerIdType',
        width: 150,
      },
      {
        title: 'Broker ID',
        field: 'brokerId',
        width: 150,
      },
      {
        title: 'Clearer ID Type',
        field: 'clearerIdType',
        width: 150,
      },
      {
        title: 'Clearer ID',
        field: 'clearerId',
        width: 150,
      },
      {
        title: 'Settlement Location',
        field: 'settlementLocation',
        width: 200,
      },
      {
        title: '股權集保帳號',
        field: 'equityTdccAccount',
        width: 150,
      },
      {
        title: '證券代號',
        field: 'brokerageCode',
        width: 150,
      },
      {
        title: '公債帳號',
        field: 'pdAccount',
        width: 150,
      },
      {
        title: '債券集保帳號',
        field: 'bondTdccAccount',
        width: 150,
      },
      {
        title: '異動人員',
        field: 'updateId',
        width: 100,
      },
      {
        title: '異動日期',
        field: 'updateDate',
        width: 200,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
    ],
  };

  checkInfoForm = { // [檢視彈窗] 新增表單內容 v-model綁定及表單欄位名稱
    cash: {
      counterpartyId: undefined,
      productName: undefined,
      productId: undefined,
      currency: undefined,
      bfBankCode: undefined,
      bfBankName: undefined,
      bfBankAccount: undefined,
      bfBankIban: undefined,
      bfBankAba: undefined,
      bfAccountName: undefined,
      bfAccountNameCode: undefined,
      bfAccount: undefined,
      bfBankType: undefined,
      bfAccountNoType: undefined,
      bfAccountNameType: undefined,
      ImBankCode: undefined,
      ImBankName: undefined,
      ImBankCodeType: undefined,
      draweeType: undefined,
      draweeName: undefined,
      draweeCode: undefined,
      indicator: undefined,
      charges: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      effectStatus: undefined,
    },
    equity: {
      counterpartyId: undefined,
      productName: undefined,
      productId: undefined,
      currency: undefined,
      custodian: undefined,
      brokerIdType: undefined,
      brokerId: undefined,
      brokerAccount: undefined,
      brokerName: undefined,
      clearerIdType: undefined,
      clearerId: undefined,
      clearerAccount: undefined,
      clearerName: undefined,
      bsCodeType: undefined,
      bsCode: undefined,
      bsName: undefined,
      clAgentCodeType: undefined,
      clAgentCode: undefined,
      clAgentName: undefined,
      market: undefined,
      cycd: undefined,
      psetCode: undefined,
      settlementLocation: undefined,
      settlementIndicator: undefined,
      equityTdccAccount: undefined,
      brokerage: undefined,
      brokerageCode: undefined,
      pdAccountBank: undefined,
      pdAccount: undefined,
      pdAccountName: undefined,
      bondTdccAccount: undefined,
      taxId: undefined,
      memo: undefined,
      remark: undefined,
      isDefault: undefined,
      effectStatus: undefined,
    },
    contact: {
      address: undefined,
      faxNumber1: undefined,
      faxNumber2: undefined,
      licenserName1: undefined,
      licenserTel1: undefined,
      licenserMobile1: undefined,
      licenserEmail1: undefined,
      licenserName2: undefined,
      licenserTel2: undefined,
      licenserMobile2: undefined,
      licenserEmail2: undefined,
      licenserName3: undefined,
      licenserTel3: undefined,
      licenserMobile3: undefined,
      licenserEmail3: undefined,
    },
    attachment: [],
  };

  /**
   * watch
   */
  @Watch('historyShow')
  onChange(val) {
    this.modalVisible = val;
  }

  @Watch('historyInfo', { immediate: true, deep: true })
  onValChange(val) {
    if (this.isEmpty(val) || this.isEmpty(val.rowData)) {
      return;
    }
    this.tempHistoryInfo = val;
    this.paginateHist(val);
  }

  /**
  * hook
  */
  mounted() {
    // ant design vue 的closeIcon 點擊事件會關閉第一個彈窗，無法執行double check，所以替換掉該事件方法。
    (this.$refs.modal as any).handleCancel = this.closeHistoryModal;
  }

  /**
  * methods
  */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 關閉歷程彈窗
  closeHistoryModal() {
    this.$emit('closeHistoryModal');
    this.ipkGrid.data = [];
  }

  // 頁碼改變
  handlePageChange(e) {
    let searchDto = {
      ...this.tempHistoryInfo,
      pageNum: e.currentPage,
      pageSize: e.pageSize,
    };
    this.paginateHist(searchDto);
  }

  // 選擇表格內資訊
  getPendingSelected(e) {
    this.openCheckModal(e.row);
  }

  // 開啟檢視彈窗
  openCheckModal(editDto) {
    this.searchPendingInfo(editDto);
    this.modalCheckInfoShow = true;
    this.checkInfo.editInfo = editDto;
  }

  // 關閉檢視彈窗
  closeCheckInfoModal() {
    this.modalCheckInfoShow = false;
  }

  // 取得選項
  getOptionObject(options, value) {
    for (let i = 0; i < options.length; i++) {
      if (options[i].val === value) {
        return options[i];
      }
    }
    return null;
  }

  // ------------------------------------------------------ API: -------------------------------------------------------
  // 查詢歷程
  paginateHist(val) {
    // 整理成後端格式
    let dto = {
      ssiId: this.isEmpty(val.rowData.ssiId) ? undefined : val.rowData.ssiId,
      pageNum: val.pageNum,
      pageSize: val.pageSize,
    };
    // call API
    this.setLoading(true);
    this.$counterpartySsiApi.paginateHistUsingPOST(dto)
    .then((resp) => {
      const content = resp.data.content;
      const isSuccess = resp.data.success;
      const message = resp.data.message;
      this.ipkGrid.data = [];

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      const actionEnum = JSON.parse(JSON.stringify(this.$cfEnum.actionEnum));
      actionEnum[0].icon = [this.$cfEnum.actionConstant.SEARCH];

      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            action: this.getOptionObject(actionEnum, item.changeType),
          });
        });
      }
      this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
      this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
      this.ipkGrid.pagerConfig.total = parseInt(resp.data.totalCount);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 檢視API
  searchPendingInfo(editDto: any) {
    this.setLoading(true);
    return this.$counterpartySsiApi.searchHistDetailUsingGET(editDto.histId)
      .then((res) => {
        const content = res.data.content;
        const isSuccess = res.data.success;
        const message = res.data.message;

        if (!isSuccess) {
          InfoModal.alertError({ confirm: false, content: message });
          return;
        }

        this.checkInfoForm = JSON.parse(JSON.stringify(content));
      })
      .catch((error) => {
        // API失敗
        InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
      })
      .finally(() => {
        this.setLoading(false);
      });
  }
}
