<template>
  <div>
    <!-- Modal -->
    <div
      id="recordModal"
      class="modal"
      tabindex="-1"
      aria-labelledby="recordModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <button
            type="button"
            class="modal-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <a-icon type="close" />
          </button>
          <div class="modal-body">
            <div class="container">
              <div class="container__inner">
                <div class="d-flex justify-content-between">
                  <div class="page__title">
                    年度執行紀錄
                  </div>
                  <div class="btnwrap pt-4">
                    <button
                      class="btn__radius--primary--outline--small"
                    >
                      下載
                    </button>
                  </div>
                </div>
                <div class="table__block">
                  <div class="table__block__title">
                    第一部分、保護對象之評估
                  </div>
                  <div class="table__block__content">
                    <FblDataGrid
                      :class-name="'model__table'"
                      :row-key="gridData1.rowKey"
                      :columns="gridData1.columns"
                      :data="gridData1.data"
                      :pagination="false"
                    >
                      <template v-slot:result="slotProps">
                        完成期間諮詢人數: {{ slotProps.data.b }} 人
                        <br>
                        完成分娩後未滿一年之諮詢人數: {{ slotProps.data.c }} 人
                        <br>
                        有哺乳人數: {{ slotProps.data.d }} 人
                        <br>
                        本年度已結案人數: {{ slotProps.data.e }} 人
                        <br>
                        尚未結案（仍在保護期間）人數: {{ slotProps.data.f }} 人
                      </template>
                      <template v-slot:replace="slotProps">
                        {{ slotProps.data.a }}
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                      </template>
                    </FblDataGrid>
                  </div>
                  <div class="table__block__chartchoice d-flex">
                    <div class="table__block__chartchoice__chart d-flex justify-content-end">
                      <div>圖表</div>
                    </div>
                    <div class="table__block__chartchoice__choice d-flex justify-content-end">
                      <div class="table__block__chartchoice__choice__pie">
                        <div
                          v-if="piechoice===true"
                          class="table__block__chartchoice__choice__pie--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="piechoice===false"
                          class="table__block__chartchoice__choice__pie--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                      <div class="table__block__chartchoice__choice__bar">
                        <div
                          v-if="barchoice===true"
                          class="table__block__chartchoice__choice__bar--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="barchoice===false"
                          class="table__block__chartchoice__choice__bar--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table__block">
                  <div class="table__block__title">
                    第二部分、工作場所環境及作業危害辨識評估
                  </div>
                  <div class="table__block__content">
                    <FblDataGrid
                      :class-name="'model__table'"
                      :row-key="gridData2.rowKey"
                      :columns="gridData2.columns"
                      :data="gridData2.data"
                      :pagination="false"
                    >
                      <template v-slot:result="slotProps">
                        完成期間諮詢人數: {{ slotProps.data.b }} 人
                        <br>
                        完成分娩後未滿一年之諮詢人數: {{ slotProps.data.c }} 人
                        <br>
                        有哺乳人數: {{ slotProps.data.d }} 人
                        <br>
                        本年度已結案人數: {{ slotProps.data.e }} 人
                        <br>
                        尚未結案（仍在保護期間）人數: {{ slotProps.data.f }} 人
                      </template>
                      <template v-slot:replace="slotProps">
                        {{ slotProps.data.a }}
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                      </template>
                    </FblDataGrid>
                  </div>
                  <div class="table__block__chartchoice d-flex">
                    <div class="table__block__chartchoice__chart d-flex justify-content-end">
                      <div>圖表</div>
                    </div>
                    <div class="table__block__chartchoice__choice d-flex justify-content-end">
                      <div class="table__block__chartchoice__choice__pie">
                        <div
                          v-if="piechoice===true"
                          class="table__block__chartchoice__choice__pie--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="piechoice===false"
                          class="table__block__chartchoice__choice__pie--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                      <div class="table__block__chartchoice__choice__bar">
                        <div
                          v-if="barchoice===true"
                          class="table__block__chartchoice__choice__bar--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="barchoice===false"
                          class="table__block__chartchoice__choice__bar--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table__block">
                  <div class="table__block__title">
                    第三部分、安排醫師諮詢及相關建議
                  </div>
                  <div class="table__block__content">
                    <FblDataGrid
                      :class-name="'model__table'"
                      :row-key="gridData3.rowKey"
                      :columns="gridData3.columns"
                      :data="gridData3.data"
                      :pagination="false"
                    >
                      <template v-slot:result="slotProps">
                        完成期間諮詢人數: {{ slotProps.data.b }} 人
                        <br>
                        完成分娩後未滿一年之諮詢人數: {{ slotProps.data.c }} 人
                        <br>
                        有哺乳人數: {{ slotProps.data.d }} 人
                        <br>
                        本年度已結案人數: {{ slotProps.data.e }} 人
                        <br>
                        尚未結案（仍在保護期間）人數: {{ slotProps.data.f }} 人
                      </template>
                      <template v-slot:replace="slotProps">
                        {{ slotProps.data.a }}
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                      </template>
                    </FblDataGrid>
                  </div>
                  <div class="table__block__chartchoice d-flex">
                    <div class="table__block__chartchoice__chart d-flex justify-content-end">
                      <div>圖表</div>
                    </div>
                    <div class="table__block__chartchoice__choice d-flex justify-content-end">
                      <div class="table__block__chartchoice__choice__pie">
                        <div
                          v-if="piechoice===true"
                          class="table__block__chartchoice__choice__pie--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="piechoice===false"
                          class="table__block__chartchoice__choice__pie--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                      <div class="table__block__chartchoice__choice__bar">
                        <div
                          v-if="barchoice===true"
                          class="table__block__chartchoice__choice__bar--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="barchoice===false"
                          class="table__block__chartchoice__choice__bar--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="table__block">
                  <div class="table__block__title">
                    第四部分、執行成效評估及改善
                  </div>
                  <div class="table__block__content">
                    <FblDataGrid
                      :class-name="'model__table'"
                      :row-key="gridData4.rowKey"
                      :columns="gridData4.columns"
                      :data="gridData4.data"
                      :pagination="false"
                    >
                      <template v-slot:result="slotProps">
                        完成期間諮詢人數: {{ slotProps.data.b }} 人
                        <br>
                        完成分娩後未滿一年之諮詢人數: {{ slotProps.data.c }} 人
                        <br>
                        有哺乳人數: {{ slotProps.data.d }} 人
                        <br>
                        本年度已結案人數: {{ slotProps.data.e }} 人
                        <br>
                        尚未結案（仍在保護期間）人數: {{ slotProps.data.f }} 人
                      </template>
                      <template v-slot:replace="slotProps">
                        {{ slotProps.data.a }}
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                        <br>
                        &nbsp;
                      </template>
                    </FblDataGrid>
                  </div>
                  <div class="table__block__chartchoice d-flex">
                    <div class="table__block__chartchoice__chart d-flex justify-content-end">
                      <div>圖表</div>
                    </div>
                    <div class="table__block__chartchoice__choice d-flex justify-content-end">
                      <div class="table__block__chartchoice__choice__pie">
                        <div
                          v-if="piechoice===true"
                          class="table__block__chartchoice__choice__pie--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="piechoice===false"
                          class="table__block__chartchoice__choice__pie--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ pieChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                      <div class="table__block__chartchoice__choice__bar">
                        <div
                          v-if="barchoice===true"
                          class="table__block__chartchoice__choice__bar--choose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_green.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                        <div
                          v-if="barchoice===false"
                          class="table__block__chartchoice__choice__bar--unchoose d-flex justify-content-center"
                        >
                          <img
                            src="~@images/button_ barChart_gray.svg"
                            width="22.22px"
                            height="22.22px"
                            @click="changeChoice()"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary me-1"
                data-bs-dismiss="modal"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';

@Component({ components: { FblDataGrid } })
export default class YearReportRecord extends Vue {
  gridData1 = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'result',
  			title: '執行結果',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'replace',
  			title: '備註',
  		},
  	],
  }; // 第一表格欄位名稱

  gridData2 = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'result',
  			title: '執行結果',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'replace',
  			title: '備註',
  		},
  	],
  }; // 第二表格欄位名稱

  gridData3 = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'result',
  			title: '執行結果',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'replace',
  			title: '備註',
  		},
  	],
  }; // 第三表格欄位名稱

  gridData4 = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'result',
  			title: '執行結果',
  		},
  		{
  			type: FblColumnType.TEMPLATE,
  			template: 'replace',
  			title: '備註',
  		},
  	],
  }; // 第四表格欄位名稱

  piechoice: boolean = true; // true:選取圓餅圖 false: 不選取圓餅圖

  barchoice: boolean = false; // true:選取長條圖 false: 不選取長條圖

  changeChoice() {
  	this.piechoice = !this.piechoice;
  	this.barchoice = !this.barchoice;
  	console.log(this.piechoice, this.barchoice);
  }

  getGridData() {
  	this.gridData1.data = [
  		{
  			rowkey: 1,
  			a: '109/01/01~109/12/31期間，保護對象累計共46人。',
  			b: 12,
  			c: 13,
  			d: 14,
  			e: 15,
  			f: 16,
  		},
  	];
  	this.gridData2.data = [
  		{
  			rowkey: 1,
  			a: '109/01/01~109/12/31期間，保護對象累計共46人。',
  			b: 12,
  			c: 13,
  			d: 14,
  			e: 15,
  			f: 16,
  		},
  	];
  	this.gridData3.data = [
  		{
  			rowkey: 1,
  			a: '109/01/01~109/12/31期間，保護對象累計共46人。',
  			b: 12,
  			c: 13,
  			d: 14,
  			e: 15,
  			f: 16,
  		},
  	];
  	this.gridData4.data = [
  		{
  			rowkey: 1,
  			a: '109/01/01~109/12/31期間，保護對象累計共46人。',
  			b: 12,
  			c: 13,
  			d: 14,
  			e: 15,
  			f: 16,
  		},
  	];
  }

  created() {
  	this.getGridData();
  }
}
</script>

<style lang="scss" scoped>
  #recordModal {
    margin-top: 30px;
  }
  .container__inner {
    padding-right: calc(50/800*100%);
    padding-left: calc(50/800*100%);
  }
  .table__block {
    margin-bottom: 25px;
    .table__block__title {
      color: $TEXT-GREEN;
      margin-bottom: 10px;
    }
    .table__block__content {
      margin-bottom: 20px;
    }
    .table__block__chartchoice {
      .table__block__chartchoice__chart{
        width: 60%;
      }
      .table__block__chartchoice__choice{
        width: 40%;
        .table__block__chartchoice__choice__pie{
          margin-right: 2px;
          &:hover{
            cursor: pointer;
          }
          .table__block__chartchoice__choice__pie--choose{
            border-bottom: $COLOR-MAIN1 4px solid;
            padding-bottom: 4px;
            width: 50px;
          }
          .table__block__chartchoice__choice__pie--unchoose{
            border-bottom: #D1D1D1 4px solid;
            padding-bottom: 4px;
            width: 50px;
          }
        }
        .table__block__chartchoice__choice__bar{
          &:hover{
            cursor: pointer;
          }
          .table__block__chartchoice__choice__bar--choose{
            border-bottom: $COLOR-MAIN1 4px solid;
            padding-bottom: 4px;
            width: 50px;
          }
          .table__block__chartchoice__choice__bar--unchoose{
            border-bottom: #D1D1D1 4px solid;
            padding-bottom: 4px;
            width: 50px;
          }
        }
      }
    }
  }
  .btn__wrap {
    margin-bottom: 50px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }

  ::v-deep{
    .ant-table-thead > tr {
      > th:first-child {
        border-right: 1px solid;
        width: 60%;
      }
    }
    .ant-table-thead > tr {
      > th:last-child {
        width: 40%;
      }
    }
    .ant-table-thead > tr > th{
      color: white;
      background-color: $COLOR-MAIN1;
      text-align: center;
    }
    .ant-table-tbody > tr {
      background-color: $COLOR-MAIN10;
    }
    .ant-table-tbody > tr {
      > td:first-child {
        width: 60%;
      }
    }
    .ant-table-tbody > tr {
      > td:last-child {
        width: 40%;
      }
    }
  }
</style>
