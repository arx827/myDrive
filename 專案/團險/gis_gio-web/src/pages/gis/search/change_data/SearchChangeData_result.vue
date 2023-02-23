<template>
  <div class="SearchChangeDataResult">
    <LayoutLoading v-if="pageLoading" />
    <div class="main-header d-flex align-items-center">
      <h2 class="main-title">
        查詢結果
      </h2>
      <div class="header-control__wrap ms-auto">
        <button
          v-if="grid.data.length > 0"
          class="icon-button"
          @click="handleDownload"
        >
          <img
            class="icon-button__img"
            src="~@images/button_download.svg"
            alt=""
          >
        </button>
      </div>
    </div>
    <div
      v-if="grid.data.length > 0"
      class="result__table"
    >
      <FblDataGrid
        :row-key="grid.rowKey"
        :columns="grid.columns"
        :data="grid.data"
        :pagination="grid.pagination"
        :empty-data="grid.data.length <= 0"
        @tableChange="onMasterPageChange($event)"
      >
        <template v-slot:handleTemp="slotProps">
          <i
            class="gio-icon gio-icon__nextPage"
            @click="handleDetail(slotProps.data)"
          />
        </template>
      </FblDataGrid>
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
import { Vue, Component } from 'vue-property-decorator';
import { Getter, Action, State } from 'vuex-class';
import LayoutLoading from '@compononts/layout/FblLayoutLoading.vue';
import { InschgMasterQueryModel, InschgMasterDataProcessDto } from '@fubonlife/co-giiss-api-axios-sdk';
import { Modal } from 'ant-design-vue';
import moment from 'moment';
import {
  FblColumnType,
  FblActionEvent,
  FblPDataGridHolder,
  FblRow,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({
  components: { FblDataGrid, LayoutLoading },
})
export default class SearchChangeDataResult extends Vue {
  h = this.$createElement;

  // 參數(查詢 API 用)
  resultParam: InschgMasterQueryModel = {};

  pageLoading = false;

  // 取得 Table 內容
  public grid: FblPDataGridHolder<InschgMasterDataProcessDto> = {
    rowKey: 'rowkey',
    data: [],
    pagination: {
      current: 1,
      pageSize: Number(this.$global.getPageArray()[0]),
      total: 1,
      showSizeChanger: true,
      pageSizeOptions: this.$global.getPageArray(),
      showQuickJumper: true,
    },
    columns: [
      {
        type: FblColumnType.PLAIN,
        property: 'policyNoSeq',
        title: '保單號碼',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'appDate',
        title: '受理日期',
        customRender: (data) => {
          if (data.appDate) {
            return this.$dateTime.customTWDateFormatter(data.appDate, 'YYYY/MM/DD');
          }
          return '';
        },
      },
      {
        type: FblColumnType.PLAIN,
        property: 'appNo',
        title: '受理號碼',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'insName',
        title: '被保險人姓名',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'idNo',
        title: '身分證字號',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'insAttr',
        title: '屬性',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'appType',
        title: '作業別',
      },
      {
        type: FblColumnType.PLAIN,
        property: 'status',
        title: '狀態',
      },
      {
        type: FblColumnType.TEMPLATE,
        template: 'handleTemp',
        width: 30,
        align: 'right',
        title: '',
      },
    ],
  };

  /**
   * Func
   */
  // 取得前一頁傳進來的參數
  setResultParam() {
    const $query = this.$global.getQuery();
    if ($query) {
      this.resultParam = $query.form;
      this.getGrid();
    } else {
      // 無query則強制跳轉至查詢頁
      this.$router.push({ name: 'SearchChangeData' });
    }
  }

  // 取得 Table 內容
  getGrid() {
    this.pageLoading = true;
    // 欄位值若為「全部」，則帶 null 給後端:
    const $submit = JSON.parse(JSON.stringify(this.resultParam));
    $submit.productLine = ($submit.productLine === '0') ? null : $submit.productLine; // 【產品線】
    $submit.userId = ($submit.userId === '0') ? null : $submit.userId; // 【行政人員】
    $submit.status = ($submit.status === '0') ? null : $submit.status; // 【異動狀態】
    $submit.insAttr = ($submit.insAttr === '0') ? null : $submit.insAttr; // 【屬性】
    $submit.appType = ($submit.appType === '8') ? null : $submit.appType; // 【作業別】
    $submit.noteType = ($submit.noteType === '0') ? null : $submit.noteType; // 【備註】

    this.$gioDataProcessApi.listChgDataUsingPOST($submit, this.grid.pagination.current - 1, this.grid.pagination.pageSize)
    .then((resp) => {
      // TEST:
      // console.log(resp);
      if (resp.data.status == 200) {
          const getData = JSON.parse(JSON.stringify(resp.data.data));
          if (getData.content.length > 0) {
            getData.content.map((item, index) => item.rowkey = index + 1);
            this.grid.data = getData.content;
            this.grid.pagination.total = parseInt(getData.totalElements);
          } else {
            this.grid.pagination.current -= 1;
            this.getGrid();
          }
        } else {
          this.$router.push({ name: 'SearchChangeData' }).then(() => {
            const getError = resp.data;
            this.$infoNotification.error({
              Content: '無法完成查詢項目，請再次嘗試。',
              apiError: getError.apiError,
            });
          });
        }
    })
    .catch((error) => {
      this.$router.push({ name: 'SearchChangeData' }).then(() => {
        this.$infoNotification.error({
          Content: '無法完成查詢項目，請再次嘗試。',
        });
      });
    })
    .finally(() => {
      this.pageLoading = false;
    });
  }

  /**
   * Event
   */
  // table 事件 (change page)
  onMasterPageChange(e): void{
    const p = { ...this.grid.pagination };
    // 由於 sort 排序的事件亦會觸發此 Event，所以多此判斷屏蔽sort
    // 只保留 pageCurrent 或 pageSize 變更時 reload
    if (p.current !== e.current || p.pageSize !== e.pageSize) {
      p.current = e.current;

      // 切換顯示筆數時，跳回第一頁
      if (p.pageSize !== e.pageSize) {
        p.current = 1;
      }
      p.pageSize = e.pageSize;
      this.grid.pagination = p;
      this.getGrid();
    }
  }

  // 查看異動資料投保內容
  handleDetail({ appNo }): void {
    this.$global.changeRouterAndaddParam({
      toRouter: 'SearchChangeDataDetails',
      query: {
        appNo,
      },
    });
  }

  // 下載異動資料清單(pdf)
  handleDownload() {
    this.pageLoading = true;
    // 欄位值若為「全部」，則帶 null 給後端:
    const current = moment(new Date()).format('YYYY/MM/DD').split('/');
    const twYear = `${parseInt(current[0]) - 1911}`;
    const downloadName = `異動資料清單_${twYear}${current[1]}${current[2]}`;
    const $submit = JSON.parse(JSON.stringify(this.resultParam));
    $submit.productLine = ($submit.productLine === '0') ? null : $submit.productLine; // 【產品線】
    $submit.userId = ($submit.userId === '0') ? null : $submit.userId; // 【行政人員】
    $submit.status = ($submit.status === '0') ? null : $submit.status; // 【異動狀態】
    $submit.insAttr = ($submit.insAttr === '0') ? null : $submit.insAttr; // 【屬性】
    $submit.appType = ($submit.appType === '8') ? null : $submit.appType; // 【作業別】
    $submit.noteType = ($submit.noteType === '0') ? null : $submit.noteType; // 【備註】

    this.$gioDataProcessApi.downloadChgDataUsingPOST($submit, downloadName, { responseType: 'blob' })
    .then((resp) => {
      // TEST:
      // console.log(resp);
      if (resp.headers['content-disposition']) {
        this.$blobUtils.download((resp.data as unknown as Blob), `${downloadName}.pdf`);
      } else {
        this.$gioDataProcessApi.downloadChgDataUsingPOST($submit, downloadName)
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
      this.$infoNotification.error({
        Content: '無法完成下載項目，請再次嘗試。',
      });
    })
    .finally(() => {
      this.pageLoading = false;
    });
  }

  /**
   * Hooks
   */
  created() {
    this.setResultParam();
  }

  updated() {
  	window.parseWord();
  }
}
</script>
