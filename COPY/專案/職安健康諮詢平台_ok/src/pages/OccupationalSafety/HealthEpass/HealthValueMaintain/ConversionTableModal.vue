<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal cate__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      :footer="false"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="conversionTableModal__wrap">
        <div class="conversionTableModal-title">
          <h1>{{ modalTitle }}</h1>
        </div>
        <div class="conversionTableModal-result__wrap">
          <FblDataGrid
            :row-key="gridData.rowKey"
            :columns="gridData.columns"
            :data="gridData.data"
            :pagination="gridData.pagination"
            :empty-data="gridData.data.length <= 0"
          >
            <template v-slot:handleTemp="slotProps">
              <i
                class="os-icon os-icon__nextPage"
                @click="handleDetail(slotProps.data)"
              />
            </template>
          </FblDataGrid>
        </div>
        <div class="conversionTableModal-btn__wrap text-center">
          <button
            class="btn__radius--primary--bg--small btn__close"
            @click="onClose"
          >
            關閉
          </button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	FblColumnType,
	FblPageEvent,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';

require('bootstrap/js/dist/modal');

@Component({ components: { FblDataGrid } })
export default class ConversionTableModal extends Vue {
	@Action('setLoading') setLoading

  @Prop()
  modalTitle: string

  @Prop()
  period: string

	@Prop()
  visible: boolean

	modalVisible = false;

	h = this.$createElement;

  // 欲合併的資料欄位
  rowSpanItemName = [];

  // 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	pagination: false,
  	columns: [
  		{
  			type: FblColumnType.PLAIN,
  			property: 'typeDesc',
  			title: '類別',
  			width: 120,
  			// 上下合併
  			customRender: (data, record, index) => ({
  				children: this.$createElement('div', {
  					style: {
  						color: '#23C4A8',
  					},
  				}, data.typeDesc),
  				attrs: {
  					rowSpan: this.rowSpanItemName[index],
  				},
  			}),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'cnName',
  			title: '健檢項目(中/英文)',
  			width: 180,
  			customRender: (data) => this.h('div', {
  			}, data.enName ? `${data.cnName}/${data.enName}` : data.cnName),
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'lv1',
  			title: '一級',
  			width: 150,
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'lv2',
  			title: '二級(衛教)',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'lv3',
  			title: '三級(諮詢)',
  		},
  		{
  			type: FblColumnType.PLAIN,
  			property: 'lv4',
  			title: '四級(諮詢)',
  		},
  	],
  }

  /**
   * Func
   */

  onClose() {
  	this.$emit('closeCateModal');
  }

  async getCorrespondenceTable() {
  	this.setLoading(true);
  	await this.$HERpnNumericalMaintenanceApi.getGradingCorrespondenceTableUsingPOST(this.period)
  		.then((resp) => {
  			// TEST:
  			// console.log('resp:', resp.data.data);
  			const getData = resp.data.data;
  			const gridData = [];
  			let count = 1;
  			getData.forEach((dto) => {
  				const { typeDesc, levelDetails } = dto;
  				levelDetails.map((level) => ({ typeDesc, ...level })).forEach((i) => {
  					gridData.push({
  						rowkey: count,
  						...i,
  					});
  					count++;
  				});
  			});
  			this.gridData.data = gridData;
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 表格合併
  getRowSpan(property) {
  	const rowSpanList = [];
  	const dataTitle = this.gridData.data.map((dto) => dto[property]);
  	// 計算相同元素並以物件key顯示
  	const levelOneedColumns = dataTitle.reduce((all, col) => {
  		if (col in all) {
  			all[col]++;
  		} else {
  			all[col] = 1;
  		}
  		return all;
  	}, {});
  	// 取相同元素的值
  	Object.values(levelOneedColumns as number).forEach((item) => {
  		rowSpanList.push(item);
  		if (item > 1) {
  			for (let i = 0; i < item - 1; i++) {
  				rowSpanList.push(0);
  			}
  		}
  	});
  	return rowSpanList;
  }

  async createdTable() {
  	// 由於合併欄位 須在取得資料後 才處理合併，使用 async
  	await this.getCorrespondenceTable();

  	// 處理合併欄位
  	this.rowSpanItemName = this.getRowSpan('typeDesc');

  	// 【類別】欄位 合併
  	this.gridData.columns.find((i) => i.property == 'typeDesc').customRender = (data, record, index) => ({
  		children: this.$createElement('div', {
  			style: {
  				color: '#23C4A8',
  			},
  		}, data.typeDesc),
  		attrs: {
  			rowSpan: this.rowSpanItemName[index],
  		},
  	});
  }

  /**
   * Hook
   */
  // async created() {

  // }

	@Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  	if (val) {
  		this.createdTable();
  	}
  }
}
</script>

<style lang="scss" scoped>
  .conversionTableModal__wrap {
    padding: 30px 0;
    .conversionTableModal-title {
      h1 {
        font-weight: 600;
        font-size: 30px;
        margin-bottom: 0;
      }
    }
    .conversionTableModal-result__wrap {
      margin: 20px 0 40px;
    }
  }

	.btn__close {
		height: 40px;
		width: 120px;
	}
</style>
