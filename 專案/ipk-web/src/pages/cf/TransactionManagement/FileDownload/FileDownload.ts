import { Vue, Component } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import validateUtil from '@/plugins/util/validateUtil';
import InfoModal from '@/plugins/notification/infoModal';
import moment from 'moment';

import AdvancedSearch from '@/components/shared/advancedSearch/AdvancedSearch.vue';
import { AdvancedSearchModel } from '@/components/shared/advancedSearch/model';
import IpkVxeTable from '@/components/shared/data-grid/IpkVxeTable.vue';
import { IpkVxeTableModel } from '@/components/shared/data-grid/IpkVxeTableModels';

@Component({
  components: {
    AdvancedSearch,
    IpkVxeTable,
  },
})
export default class FileDownload extends Vue {
  @Action('setLoading') setLoading;

  /**
  * data
  */
  form = { // [進階查詢] 預設表單內容 v-model綁定
    createId: undefined,
    productGroup: undefined,
    fileType: undefined,
    fileName: undefined,
  }

  advancedSearchForm: any = {}; // [進階查詢] 表單內容 v-model綁定

  tempSort = undefined; // 紀錄已點選的排序

  ipkGrid: IpkVxeTableModel = { // [進階查詢] 查詢結果
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
    sortConfig: {
      trigger: 'cell',
      remote: true,
    },
    columns: [
      {
        title: '',
        field: 'actionType',
        width: 100,
        slots: { default: 'download' },
        headerAlign: 'left',
        align: 'center',
      },
      {
        title: '建立人員',
        field: 'createId',
        width: 140,
      },
      {
        title: '產品群組',
        field: 'productGroupName',
      },
      {
        title: '開始時間',
        field: 'startDate',
        width: 200,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '結束時間',
        field: 'endDate',
        width: 200,
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return moment(data.cellValue).format('YYYY/MM/DD HH:mm:ss');
        },
      },
      {
        title: '檔案類型',
        field: 'fileType',
        formatter: (data) => {
          if (!data.cellValue) {
            return null;
          }
          return this.$cfEnum.getLabel('fileDownloadTypeOption', data.cellValue);
        },
      },
      {
        title: '檔名',
        field: 'fileName',
        width: '25%',
      },
      {
        title: '狀態',
        field: 'executeStatus',
        width: 140,
        slots: {
          default: ({ row }, h) => [
            h('a-badge', {
              props: {
                color: this.$cfEnum.getObject('executeStatusEnum', row.executeStatus).color,
                text: this.$cfEnum.getObject('executeStatusEnum', row.executeStatus).key,
              },
            }),
          ],
        },
      },
    ],
  };

  labelList: Array<AdvancedSearchModel> = [ // [進階查詢] 表單欄位名稱
    {
      label: '建立人員', placeholder: '請選擇', type: 'inputText', maxlength: 5,
    },
    {
      label: '產品群組', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '檔案類型', placeholder: '請選擇', type: 'singleSelect', options: undefined, allOptions: [], showSearch: true,
    },
    {
      label: '檔名', placeholder: '請選擇', type: 'inputText',
    },
  ]

  /**
  * hook
  */
  async created() {
    // 取得「進階查詢」表單內容
      this.advancedSearchForm = { ...this.form };
    // 下拉選單
    let productGroupOptions = await this.$cfCommon.getProductGroupOption();
    this.labelList.find((el) => el.label === '產品群組').options = productGroupOptions;
    this.labelList.find((el) => el.label === '產品群組').allOptions = productGroupOptions;
    this.labelList.find((el) => el.label === '檔案類型').options = this.$cfEnum.fileDownloadTypeOption;
    this.labelList.find((el) => el.label === '檔案類型').allOptions = this.$cfEnum.fileDownloadTypeOption;

    // 驗證查詢權限
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, null, this.$cfButtonKey.buttonKey.SEARCH.val);
    if (!getButtonsAuthInfoObj.byPass) {
      return;
    }
    // 查詢
    this.handleSearch();
  }

  /**
   * methods
   */
  // 判斷空值
  isEmpty(data) {
    return validateUtil.isEmpty(data);
  }

  // 點擊進階查詢按鈕
  handleSearch() {
    // 清空排序
    (this.$refs?.ipkGrid as any)?.$refs?.vxeGrid.clearSort();
    this.tempSort = undefined;
    // call API
    let dto = this.setSearchFileDownloadDto(1, this.ipkGrid.pagerConfig.pageSize);
    this.searchFileDownload(dto);
  }

  // 整理進階查詢查詢按鈕後端格式
  setSearchFileDownloadDto(pageNum: number, pageSize: number) {
    let dto = {
      createId: this.isEmpty(this.advancedSearchForm.createId) ? undefined : this.advancedSearchForm.createId,
      productGroup: this.isEmpty(this.advancedSearchForm.productGroup) ? undefined : this.advancedSearchForm.productGroup,
      fileType: this.isEmpty(this.advancedSearchForm.fileType) ? undefined : this.advancedSearchForm.fileType,
      fileName: this.isEmpty(this.advancedSearchForm.fileName) ? undefined : this.advancedSearchForm.fileName,
      pageNum,
      pageSize,
      sort: this.tempSort,
    };
    return dto;
  }

  // 進階查詢
  searchFileDownload(dto) {
    this.setLoading(true);
    this.$filedownload.paginateRecordUsingPOST(dto)
    .then((res) => {
      const content = res.data.content;
      const isSuccess = res.data.success;
      const message = res.data.message;
      this.ipkGrid.data = [];

      if (!isSuccess) {
        InfoModal.alertError({ confirm: false, content: message });
        return;
      }

      // 狀態=完成，按鈕才可點選，其餘按鈕反灰不可點選。
      let executeStatusEnum = this.$cfEnum.executeStatusEnum.find((el) => el.key === '完成');
      if (!this.isEmpty(content)) {
        content.forEach((item) => {
          this.ipkGrid.data.push({
            ...item,
            actionTypeDisabled: item.executeStatus !== executeStatusEnum.val,
          });
        });
      }

      this.ipkGrid.pagerConfig.currentPage = dto.pageNum;
      this.ipkGrid.pagerConfig.pageSize = dto.pageSize;
      this.ipkGrid.pagerConfig.total = parseInt(res.data.totalCount);
    })
    .catch((error) => {
      // API失敗
      InfoModal.alertError({ confirm: false, content: this.$commonMessageEnum.SYSTEM_ERROR?.message });
    })
    .finally(() => {
      this.setLoading(false);
    });
  }

  // 表格欄位排序改變
  onSortChange(e) {
    this.tempSort = e.sort;
    // 整理成後端格式
    let dto = this.setSearchFileDownloadDto(this.ipkGrid.pagerConfig.currentPage, this.ipkGrid.pagerConfig.pageSize);
    // call API
    this.searchFileDownload(dto);
  }

  // 頁數改變
  handlePageChange(e) {
  let dto = this.setSearchFileDownloadDto(e.currentPage, e.pageSize);
    // call API
    this.searchFileDownload(dto);
  }

  // 下載
  handleDownload(fileData) {
    const getButtonsAuthInfoObj = this.$authService.getButtonsAuthInfo(this.$route.name, null, this.$cfButtonKey.buttonKey.SEARCH.val);
		if (!getButtonsAuthInfoObj.byPass) {
			InfoModal.alertInfo({
        confirm: false,
        content: getButtonsAuthInfoObj.message,
      });
      return;
		}
    this.$generateFileCommon.download(fileData.fileId, fileData.fileName, fileData.fileExtension);
  }
}
