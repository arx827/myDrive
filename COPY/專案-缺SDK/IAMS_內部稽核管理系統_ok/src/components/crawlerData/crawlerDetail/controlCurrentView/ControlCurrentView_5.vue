<!-- Tab 歷程 -->
<template>
  <FblDataGrid
    :row-key="grid.rowKey"
    :columns="grid.columns"
    :data="grid.data"
    :pagination="grid.pagination"
    :empty-data="grid.data.length <= 0"
    :scroll="grid.scroll"
  />
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { uuid } from 'vue-uuid';
import { Action, namespace } from 'vuex-class';
import TwDateFormatter from '@/plugins/TwDateFormatter';

const detailModule = namespace('crawlerDataDetailVuex');

@Component({
	components: { FblDataGrid },
})
export default class ControlCurrentView_5 extends Vue {
	@Action('setLoading') setLoading;

	@detailModule.Getter('getDetailData') getDetailData;

	@detailModule.State('detailData') detailData;

	public grid = {
  	rowKey: 'rowkey',
  	data: [],
		scroll: { x: 'auto' },
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'operate',
  			title: '執行動作',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateUser',
  			title: '異動人員',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'updateDatetime',
  			title: '異動日期',
				formatter: (data) => this.$twDateTimeFormatter.stringify(data.updateDatetime),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'remark',
  			title: '處理意見',
  		},
  	],
	};

	groupArr = [];

	@Prop()
  crawlerDataId;

	/**
   * API
   */
	// API: 查詢資料檔案
	getApi_GetDataLogt() {
  	this.setLoading(true);
  	this.$dataCollectApi.getDataLogUsingGET(this.crawlerDataId)
  		.then((resp) => {
				this.grid.data = resp.data.result;
				this.grid.data.map((i) => { i.rowkey = uuid.v4(); });
				// console.log('查詢資料檔案:', this.grid.data);
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	/**
   * Hook
   */
	created() {
		this.getApi_GetDataLogt();
	}

	/**
   * 監聽
   */
	// 只要 detail 有更新 就刷新列表
	@Watch('detailData', { deep: true })
	watchDetailData(newVal) {
		this.$nextTick(() => {
			this.getApi_GetDataLogt();
		});
	}
}
</script>

<style lang="scss" scoped>
	::v-deep {
		.ant-table-tbody {
			.ant-table-row-cell-break-word {
				white-space: nowrap;
				&:nth-last-child(1),
				&:nth-last-child(2) {
					word-break: normal;
					white-space: initial;
				}
			}
		}
	}
</style>
