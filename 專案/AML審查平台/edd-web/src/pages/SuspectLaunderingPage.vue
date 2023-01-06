<template>
  <div class="suspectLaunderingPage">
    <a-row class="spin__wrap" v-if="getSuspectPageLoading">
      <a-spin
        :spinning="getSuspectPageLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
      </a-spin>
    </a-row>
    <fbl-data-grid
      class="fbl-table table"
      :rowKey="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="false"
      :bordered="true"
      :class="{'table--border': grid.data.length > 0}"
    >
      <template v-slot:title="slotProps">
        <span style="font-size: 18px; color: #227FA8;">
          {{ slotProps.data.title }}
        </span>
      </template>
      <template v-slot:contents="slotProps">
        <span style="white-space: pre-line; font-size: 16px;">
          <!-- {{ formatString(slotProps.data.contents) }} -->
          {{ slotProps.data.contents }}
        </span>
      </template>
      <template v-slot:ansFlag="record">
        <a-form :form="form" v-if="!isConfirm">
          <a-form-item
            :validateStatus="validStatus[record.data.key]"
            :help="errMsg[record.data.key]"
          >
            <a-select
              size="large"
              style="width: 160px;"
              :placeholder="'請選擇'"
              v-model="record.data.ansFlag"
              @change="handleChange(record, $event)"
            >
              <a-select-option v-for="item in options" :key="item.key">
                {{ item.value }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-input
          v-else
          disabled
          :value="record.data.ansFlag ? options.find(obj => obj.key === record.data.ansFlag).value : ''"
          class="disabled-input"
        ></a-input>
      </template>
    </fbl-data-grid>
    <!-- TODO: 點擊「送覆核」時的檢核 -->
    <!-- TODO: 資料變更時 重整欄位 -->
    <!-- TODO: 儲存 -->
    <!-- <a-button @click="check">Test Validation</a-button>
    <a-button @click="reset">Test Reset</a-button>
    <a-button @click="save">儲存</a-button> -->
  </div>
</template>

<script lang="ts">
class Item {
  id: string;
  title: string;
  contents: string;

  constructor(id: string, title: string, contents: string) {
    this.id = id;
    this.title = title;
    this.contents = contents;
  }
}

import FblDataGrid from "@/components/shared/data-grid/FblDataGrid.vue";
import {
  FblColumnType,
  FblPDataGridHolder,
} from "@/components/shared/data-grid/models";
import Component from "vue-class-component";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import { Modal } from "ant-design-vue";
import {
  Getter,
  Action,
  State,
  namespace } from 'vuex-class';

import { createHelpers } from 'vuex-map-fields';
import {AmlReportDataFormVO} from '@fubonlife/edd-api-axios-sdk';

const { mapFields } = createHelpers({
  getterType: 'SuspectLaundering/getField',
  mutationType: 'SuspectLaundering/updateField',
});

const SuspectLaundering = namespace('SuspectLaundering');

@Component({ 
  components: { FblDataGrid } ,
  computed: {
    ...mapFields(['result'])
  }
})
export default class SupectLaunderingPage extends Vue {
  // Vuex
  // 路由決定『是否符合』欄位是否禁用
  @Getter isConfirm!: boolean;
  suspectLaunderingPageLoading: boolean = false;

  @SuspectLaundering.Getter getSuspectPageLoading;
  @SuspectLaundering.Action('setSupectPageLoading') setSupectPageLoading;

  // 取得 Vuex Modules 的資料
  @SuspectLaundering.State result:{[key: string]: string}
  @SuspectLaundering.State isSuspectUpdate;

  // @SuspectLaundering.State amlReportData!:[]
  @SuspectLaundering.Getter getAmlReportData;

  // 定義 @action
  @SuspectLaundering.Action("onResetField") onResetField

  @SuspectLaundering.Action("onImportField") onImportField

  // @SuspectLaundering.Action("onUpdateDatas") onUpdateDatas
  @SuspectLaundering.Action("onSetInitDataIsLoaded") onSetInitDataIsLoaded

  form = this.$form.createForm(this, { name: "form" });

  // antd-vue 驗證(有三種狀態: error、success、validate)
  validStatus: { [key: string]: string } = {};

  // 驗證的錯誤訊息
  errMsg: { [key: string]: string } = {};

  // 標題重複的次數
  countedList: Array<number> = [];

  // 每一列資料的 rowSpan 數值(合併用)
  rowSpanList: Array<number> = [];

  // 每一列資料的題號
  numberedList: Array<number> = [];

  // data grid
  public grid: FblPDataGridHolder<AmlReportDataFormVO> = {
    rowKey: "key",
    data: [
      // new Item(
      //   "1",
      //   "（一）交易前-客戶異常行為類",
      //   "現有客戶過去投資習慣皆為投保低保額之保險費，並以定期繳費 方式繳交保險費，突欲投保大額躉繳之保險，且無法提出合理說 明者。"
      // ),
      // new Item(
      //   "2",
      //   "（一）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "3",
      //   "（二）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "4",
      //   "（二）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "5",
      //   "（三）交易前-客戶異常行為類",
      //   "現有客戶過去投資習慣皆為投保低保額之保險費，並以定期繳費 方式繳交保險費，突欲投保大額躉繳之保險，且無法提出合理說 明者。"
      // ),
      // new Item(
      //   "6",
      //   "（三）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "7",
      //   "（四）交易前-客戶異常行為類",
      //   "現有客戶過去投資習慣皆為投保低保額之保險費，並以定期繳費 方式繳交保險費，突欲投保大額躉繳之保險，且無法提出合理說 明者。"
      // ),
      // new Item(
      //   "8",
      //   "（四）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "9",
      //   "（五）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "10",
      //   "（六）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "11",
      //   "（六）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "12",
      //   "（六）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
      // new Item(
      //   "13",
      //   "（六）交易前-客戶異常行為類",
      //   "客戶購買保險商品時，對於保障內容或給付項目完全不關心，抑 或對於具高保單價值準備金或具高現金價值或躉繳保費之保險商 品，僅關注保單借款、解約或變更受益人等程序。"
      // ),
    ],
    pagination: null,
    columns: [
      {
        type: FblColumnType.PLAIN,
        title: "內容",
        template: "content",
        formatter:(data:AmlReportDataFormVO) => {
          // const num = this.numberedList[data.key-1]
          return `${data.content}`
        }
      },
      {
        type: FblColumnType.TEMPLATE,
        title: "是否符合",
        template: "ansFlag",
        width: 200,
      },
    ],
  };

  options = [
    { key: "Y", value: "符合" },
    { key: "X", value: "不適用" },
    { key: "N", value: "檢視後不符合" },
  ];


  adjustTable(){
    // init
    this.grid.columns = [
      {
        type: FblColumnType.PLAIN,
        title: "內容",
        template: "content",
        formatter:(data:AmlReportDataFormVO) => {
          // const num = this.numberedList[data.key-1]
          return `${data.content}`
        }
      },
      {
        type: FblColumnType.TEMPLATE,
        title: "是否符合",
        template: "ansFlag",
        width: 200,
      },
    ],
    // 取完值,將相同標題之項目合併表格
    this.grid.columns.unshift(
      {
        type: FblColumnType.PLAIN,
        title: "項目",
        template: "title",
        width: 320,
        // 上下合併
        customRender: (data, record, index, column) => {
          return {
            children: data.title,
            attrs: {
              rowSpan: this.rowSpanList[index],
            },
          };
        },
      }
    )
    // 更新grid
    this.grid.data = this.getAmlReportData;
  }

  // 表格相同資料動態合併
  getRowSpan() {
    const dataTitle = this.grid.data.map(dto => dto.title);

    // 計算相同元素並以物件key顯示
    const countedColumns = dataTitle.reduce(function(all, col) {
      if (col in all) {
        all[col]++;
      } else {
        all[col] = 1;
      }
      return all;
    }, {});

    // 取相同元素的值
    this.countedList = Object.values(countedColumns as number);

    // 完整的 rowSpan list
    this.countedList.forEach((item) => {
      this.rowSpanList.push(item);
      if (item > 1) {
        for (var i = 0; i < item - 1; i++) {
          this.rowSpanList.push(0);
        }
      }
    });
  }

  // 把每列資料的題號存進陣列
  getNumberedList(){
    for(let i=0; i<this.countedList.length ; i++){
      for(let j=1 ; j<=this.countedList[i] ; j++) {
        this.numberedList.push(j);
      }
    }
  }

  getInit(id: number): void {
    // 使用 set 方法使新加入的屬性擁有 getter 及 setter，使得新增的屬性也是響應的
    this.$set(this.validStatus, id, "");
    this.errMsg[id] = "";
  }

  // 取得存在 localStorage 裡的資料
  getSessionStorage(): void {
    const confirmResult = localStorage.getItem('SuspectLaundering_result');
    const temp = localStorage.getItem('SuspectLaundering_tempResult');

    // API:?? 目前是取 sessionStorage的資料
    // 待覆核頁: 代入待審查『是否符合』欄位的結果
    if(this.isConfirm && confirmResult) {
      this.onImportField(JSON.parse(confirmResult));
    }
    else {
      this.onImportField({});
      // 待審查頁: 代入前一次的暫存
      if(temp !== "" && temp) {
        this.onImportField(JSON.parse(temp));
      }
    }
  }

  handleChange(record: { data }, selected: string) {
    this.validStatus[record.data.key] = "success";
    
    // this.errMsg[record.data.id] = "";
  }


/**
 * Event
 */
  reset() {
    // 清空 Vuex 資料
    this.onResetField()
    // this.errMsg = {};
    this.validStatus = {};
    this.grid.data.map((item) => {
      this.getInit(item.key);
    });
  }

  // TODO: 點擊「送覆核」時的檢核
  check() {
    let count = 0;

    this.grid.data.map((item) => {
      console.log(this.result[item.ansFlag])
      if (this.result[item.ansFlag] === undefined) {
        this.validStatus[item.key] = "error";
        // this.errMsg[item.id] = "請選擇";
        count = count + 1;
      }
    });
        console.log(this.validStatus)

    if (count > 0) {
      const h = this.$createElement;
      Modal.warning({
        title: h(
          "p",
          {
            attrs: { style: "font-size: 20px" },
          },
          "提醒"
        ),
        content: h('p',
        "疑似洗錢或資恐交易態樣表尚有項目未完成，請確認!"),
        okType: "green",
        okText: "確定",
        icon: () =>
          h("a-icon", {
            props: {
              type: "exclamation-circle",
              theme: "filled",
            },
            style: { fontSize: "30px" },
          }),
      });
    }
    else {
      // API:??目前是將『是否符合』欄位 待審查的結果存進 localStorage
      localStorage['SuspectLaundering_result'] = JSON.stringify(this.result);
      // 清空暫存
      localStorage.removeItem('SuspectLaundering_tempResult');
    }
  }

  // TODO: 暫存『是否符合』欄位 待審查的結果
  save() {
    localStorage['SuspectLaundering_tempResult'] = JSON.stringify(this.result);
  }


/**
 * Hook
 */
  created() {
    // this.fetchTableDatas();
    // console.log(this.result)
    // setTimeout(()=>{
    //   console.log(this.result)
    // },1000)
  }

  mounted() {
    // this.grid.data.map((item) => {
    //   this.getInit(item.key);
    // });

  }


/**
 * 監聽
 */
  // @Watch("amlReportData")
  // onValImport(val){
  //   // 取到值後整理表格樣式
  //   if (val) {
      
  //   }
  // }

  @Watch("isSuspectUpdate", { deep: true, immediate: true })
  async onDataChange(val){
    if(val) {
      this.setSupectPageLoading = true;
      // this.onSetInitDataIsLoaded(false);
      await this.adjustTable();
      await this.getRowSpan();
      await this.getNumberedList();
      this.setSupectPageLoading = false;
    }
  }

}
</script>

<style lang="less" scoped>
.table {
  .ant-table-thead {
    line-height: 26px !important;
  }
}

.ant-row,
.ant-form-item {
  margin: 0;
}

.table--border {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

/deep/ .fbl-table {
  margin-bottom: 30px;
  tr {
    td:first-of-type[rowSpan] {
      font-size: 18px;
      color: #227fa8;
    }
  }
  .ant-table-small.ant-table-bordered .ant-table-content {
    border-right: 0;
  }
}

.suspectLaunderingPage {
  .table {
    .ant-table-content {
      border-right: 0;
    }
  }
}

.disabled-input {
  width: 160px;
  height: 40px;
  text-align: center;
  font-size: 16px;
}

.ant-input-disabled:hover {
  border: 1px solid #227fa8;
}
</style>
