<template>
  <div class="SearchPrintResult">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex justify-content-between">
      <h2 class="main-title">
        查詢結果
      </h2>
      <div class="d-flex align-items-center">
        <a-popover
          trigger="click"
          placement="top"
        >
          <template slot="content">
            <div>僅提供當頁之資料進行多筆下載</div>
          </template>
          <a-icon
            type="info-circle"
            :style="{ color: '#4CAAF5', 'margin-right': '10px', cursor: 'pointer' }"
          />
        </a-popover>
        <a-button
          class="icon-button"
          :disabled="isMultipleDisabled"
          @click="DownloadAll"
        >
          <p>多筆下載</p>
        </a-button>
      </div>
    </div>
    <div v-if="grid.data.length > 0" class="result__table">
      <a-table
        :row-key="grid.rowKey"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps,
        }"
        :columns="grid.columns"
        :data-source="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
        @change="onMasterPageChange($event)"
      >
        <span slot="date" slot-scope="dateData">
          <p v-if="dateData">{{ splitDate(dateData) }}</p>
        </span>
        <span slot="cash" slot-scope="cashData">
          {{ $global.autoAddComdify(cashData) }}
        </span>
        <span slot="status" slot-scope="statusData">
          <p v-if="statusData === 'Y'">已列印</p>
          <p v-else-if="statusData === ''">未列印</p>
        </span>
        <template v-slot:handleTemp="slotProps">
          <div class="d-flex">
            <button
              v-if="grid.data.length > 0"
              class="icon-button"
              :disabled="slotProps.disabled"
              @click="handleExport(slotProps)"
            >
              <img
                class="icon-button__img"
                src="~@images/button_download.svg"
                alt=""
              >
            </button>
          </div>
        </template>
      </a-table>
    </div>
    <div class="confirm__button-group text-center">
      <button
        class="confirm__button confirm__button-cancel"
        @click="$router.go(-1)"
      >
        上一步
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { ReceiptPrintQueryInDto } from '@fubonlife/co-giiss-api-axios-sdk';
import moment from 'moment';
import { TableProps, ColumnProps } from 'ant-design-vue/es/table';
import { Modal } from 'ant-design-vue';
import { uuid } from 'vue-uuid';

@Component({
  components: { LayoutLoading },
})
export default class SearchPrintResult extends Vue {
  h = this.$createElement;

  form: ReceiptPrintQueryInDto = {
    endDate: undefined,
    status: undefined,
    strDate: undefined,
  };

  pageLoading = true;

  selectedRowKeys = [];

  get isMultipleDisabled() {
    return !(this.selectedRowKeys && this.selectedRowKeys.length > 0);
  }

  public grid = {
    rowKey: 'rowkey',
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50'],
      showQuickJumper: true,
    },
    columns: [
      {
        dataIndex: 'b9ewn4',
        title: '發放日期',
        scopedSlots: { customRender: 'date' },
      },
      {
        dataIndex: 'b9krc2',
        title: '收據號碼',
      },
      {
        dataIndex: 'b9ptc2',
        title: '保單號碼',
      },
      {
        dataIndex: 'b9aqig',
        title: '要保人/要保單位名稱',
      },
      {
        dataIndex: 'b9eun4',
        title: '保險費(TWD)',
        scopedSlots: { customRender: 'cash' },
      },
      {
        dataIndex: 'b9cqst',
        title: '列印狀態',
        scopedSlots: { customRender: 'status' },
      },
      {
        dataIndex: 'b9ezn4',
        title: '列印次數',
      },
      {
        scopedSlots: { customRender: 'handleTemp' },
        template: 'handleTemp',
        width: 80,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
   * Func
   */
  // 取得 Query 並帶入資料
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.form = $query;
    }
  }

  // 分割民國年月日
  splitDate(data) {
    if (data) {
      const reg = new RegExp('(.*)(.{2})(.{2})$', 'g');
      return data.replace(reg, '$1/$2/$3');
    }
    return '';
  }

  // 檢驗是否有欄位選取
  hasSelected() {
    return this.selectedRowKeys.length > 0;
  }

  // 控制 checkBox disabled
  getCheckboxProps(data) {
    return {
      props: {
        disabled: data.disabled,
      },
    };
  }

  // API:團險收據列印-查詢結果
  getGridData() {
    this.pageLoading = true;
    // 訊息公告維護查詢
    this.$gioDataProcessApi
      .receiptPrintQueryUsingPOST(
        this.form,
        this.grid.pagination.current - 1,
        this.grid.pagination.pageSize,
      )
      .then((resp) => {
        if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          if (getData.content.length > 0) {
            getData.content.map((item, index) => {
              item.rowkey = uuid.v4();
              item.key = index + 1;
              item.disabled = (item.b9hzst === '' && item.b9ezn4 === 1) || (item.b9cqst === 'Y' && item.b9hzst === '');
              // item.disabled = (item.b9cqst === 'Y' && item.b9c7c3 != 'C') || (item.b9hzst === '' && item.b9ezn4 === 1) || (item.b9cqst === '' && item.b9c7c3 != 'Y');
            });
            this.grid.data = getData.content;
            this.grid.pagination.total = parseInt(getData.totalElements);
          } else {
            this.grid.pagination.current -= 1;
            this.getGridData();
          }
        }
      })
      .catch((error) => {
        console.log('error = ', error);
      })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  // API:檔案下載
  downloadData(obj, downloadName) {
    this.$gioDataProcessApi
      .receiptPrintDownloadUsingPOST(obj, downloadName, {
        responseType: 'blob',
      })
      .then((resp) => {
        if (resp.headers['content-disposition']) {
          this.$blobUtils.download(
            resp.data as unknown as Blob,
            `${downloadName}.pdf`,
          );
        } else {
          this.$gioDataProcessApi
            .receiptPrintDownloadUsingPOST(obj)
            .then((resp) => {
              const errorData = JSON.parse(JSON.stringify(resp));
              if (errorData.data.status != 200) {
                const getError = errorData.data;
                this.$infoNotification.error({
                  Content: '無法完成下載項目，請再次嘗試。',
                  apiError: getError.apiError,
                });
              }
            });
        }
      })
      .catch((error) => {
        // console.log(error);
        this.$infoNotification.error({
          Content: '無法完成下載項目，請再次嘗試。',
        });
      })
      .finally(() => {
        this.pageLoading = false;
        this.selectedRowKeys = [];
        this.getGridData();
      });
  }

  /**
   * Event
   */
  // 控制多選
  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }

  // table 事件 (change page)
  onMasterPageChange(e) {
    // 清空當頁的欄位選取
    this.selectedRowKeys = [];

    const $pagination = e;
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (
      p.current !== $pagination.current
      || p.pageSize !== $pagination.pageSize
    ) {
      p.current = $pagination.current;
      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== $pagination.pageSize) {
        p.current = 1;
      }
      p.pageSize = $pagination.pageSize;
      this.grid.pagination = p;
      this.getGridData();
    }
  }

  // API:單筆下載文件
  handleExport({ b9krc2, b9ptc2 }) {
    this.pageLoading = true;
    const obj = { b9krc2, b9ptc2 };
    const downloadName = `保險費收據_${b9krc2}`;
    this.downloadData([obj], `${downloadName}`);
  }

  // API:多筆下載文件
  DownloadAll() {
    // Modal.warning({
    //   title: this.h('div', {}, '提示訊息'),
    //   content: '僅提供當頁之資料進行多筆下載',
    //   okType: 'confrim',
    //   okText: '確定',
    // });

    this.pageLoading = true;
    const multiObj = this.selectedRowKeys.map((i) => {
      const { b9krc2, b9ptc2 } = this.grid.data.find((j) => j.rowkey === i);
      return { b9krc2, b9ptc2 };
    });
    // TEST:
    // console.log(multiObj);
    const current = moment(new Date()).format('YYYY/MM/DD').split('/');
    const twYear = `${parseInt(current[0]) - 1911}`;
    const downloadName = `保險費收據_${twYear}${current[1]}${current[2]}`;
    this.downloadData(multiObj, `${downloadName}`);
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
    this.getGridData();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.icon-button > p {
  color: #ffffff;
  padding: 0px 5px;
}

::v-deep .ant-table-thead th {
  background: $COLOR-MAIN6;
}

.icon-button {
  padding: 7px;
  background-color: #4caaf5;
  border-radius: 4px;
  border: 0;
  min-width: 33px;
  min-height: 33px;
  text-align: center;
}

button[disabled] {
  background: #f5f5f5;
}
</style>
