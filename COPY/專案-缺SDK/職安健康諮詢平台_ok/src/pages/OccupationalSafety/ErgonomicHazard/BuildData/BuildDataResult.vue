<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '上傳成功':'上傳失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，
          <br>
          您的檔案已上傳成功，資料建立結果待後續 mail 通知，謝謝。
        </div>
        <div v-else>
          <div>
            親愛的護理同仁您好，
            <br>
            您的檔案上傳失敗，請確認檔案格式，再次嘗試上傳，謝謝。
          </div>
        </div>
        <!-- <div
          v-if="gridData.data && gridData.data.length > 0"
          class="fail__table"
        >
          <p
            class="fail__table__title"
            :style="{color: result === 'success' ? '#23C4A8' : '#CB5B4D'}"
          >
            檢核{{ result === 'success' ? '重複':'錯誤' }}內容
          </p>
          <div class="fail__table__data">
            <FblDataGrid
              :row-key="gridData.rowKey"
              :columns="gridData.columns"
              :data="gridData.data"
              :pagination="gridData.pagination"
              :empty-data="gridData.data.length <= 0"
            />
          </div>
        </div> -->
      </template>
      <template v-slot:buttons>
        <router-link :to="'/occupationSafety/ErgonomicHazard/BuildData/index'">
          <a
            class="btn__radius--primary me-1 back-btn"
            href="#"
          >返回主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import Result from '@/components/shared/layout/Result.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

@Component({ components: { Result, FblDataGrid } })
export default class BuildOverTimeResult extends Vue {
  result: 'success' | 'fail' = null;

	count = 0;

  // 欲合併的資料欄位
  rowSpanErrorNum = [];

  // 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			// template: 'index',
  			property: 'index',
  			title: '筆數編號',
  			// 上下合併
  			customRender: (data, record, index, column) => ({
  				children: data.index,
  				attrs: {
  					rowSpan: this.rowSpanErrorNum[index],
  					style: 'color: #CB5B4D',
  				},
  			}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'itemName',
  			title: '項目',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'errorDesc',
  			title: '描述',
  		},
  	],
  }

  // 表格合併
  getRowSpan(property) {
  	const rowSpanList = [];
  	const dataTitle = this.gridData.data.map((dto) => dto[property]);
  	// 計算相同元素並以物件key顯示
  	const countedColumns = dataTitle.reduce((all, col) => {
  		if (col in all) {
  			all[col]++;
  		} else {
  			all[col] = 1;
  		}
  		return all;
  	}, {});
  	// 取相同元素的值
  	Object.values(countedColumns as number).forEach((item) => {
  		rowSpanList.push(item);
  		if (item > 1) {
  			for (let i = 0; i < item - 1; i++) {
  				rowSpanList.push(0);
  			}
  		}
  	});
  	return rowSpanList;
  }

  setResultParam() {
  	const query = this.$global.getQuery();
  	if (query) {
  		const { hfeBuildingHumanHazardUpLoadItemListDtos, count, result } = query.respData;
  		this.result = (result === '成功') ? 'success' : 'fail';
  		this.count = count;
  		if (hfeBuildingHumanHazardUpLoadItemListDtos) {
  			this.gridData.data = hfeBuildingHumanHazardUpLoadItemListDtos;
  			this.gridData.data.map((item, index) => { item.rowkey = index + 1; });
  		}
  	}
  }

  async created() {
  	this.setResultParam();
  	// 處理合併欄位
  	this.rowSpanErrorNum = this.getRowSpan('index');
  	// 【類別】欄位 合併
  	this.gridData.columns.find((i) => i.property == 'index').customRender = (data, record, index) => ({
  		children: data.index,
  		attrs: {
  			rowSpan: this.rowSpanErrorNum[index],
  			style: `color: ${this.result === 'success' ? '#23C4A8' : '#CB5B4D'}`,
  		},
  	});
  }
}
</script>

<style lang="scss" scoped>
  .back-btn {
    width: 200px
  }
  .fail__table__title {
    padding-top: 30px;
    border-top: 1px dashed #CECECE;
    margin-top: 30px;
    font-size: 18px;
    // color: $COLOR-MAIN16;
    font-weight: $TEXT-BOLD;
  }
  .errorNum__block {
    color: $COLOR-MAIN16;
  }
  ::v-deep {
  .ant-table-tbody > tr > td {
    vertical-align: top;
  }
}
</style>
