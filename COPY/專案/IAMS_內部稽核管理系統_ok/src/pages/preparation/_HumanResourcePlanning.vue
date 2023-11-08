<template>
  <div class="main-contain crawlerindex-container container">
    <ResultModal
      :visible="resultModalSetting.visible"
      :title="resultModalSetting.title"
      :content="resultModalSetting.content"
      :type="resultModalSetting.type"
      :auto-close="resultModalSetting.autoClose"
      @closeModal="resultModalSetting.visible = false"
    />
    <div class="row justify-content-between mb-3 mt-1">
      <div class="col">
        <div class="search__item">
          <div class="search__label">
            查核月份：
          </div>
          <div class="search__input">
            <a-select
              mode="multiple"
              class="w-100"
            >
              <a-select-option
                v-for="item in $enum.monthOption"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="search__item">
          <div class="search__label">
            組別：
          </div>
          <div class="search__input">
            <a-select
              class="w-100"
              default-value="lucy"
              mode="multiple"
            >
              <a-select-option value="lucy">
                小明
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="search__item">
          <div class="search__label">
            人員：
          </div>
          <div class="search__input">
            <a-select
              class="w-100"
              default-value="lucy"
              mode="multiple"
            >
              <a-select-option value="lucy">
                小明
              </a-select-option>
            </a-select>
          </div>
        </div>
      </div>
      <div class="col">
        <button class="search__btn btn--search">
          查詢
        </button>
      </div>
      <div class="col">
        <IconTextButton
          class="float-end"
          text="上一頁"
          type="return"
          @click="$router.push({ name: 'PreparationIndex' })"
        />
      </div>
    </div>
    <fbl-data-grid
      class="table--pale"
      :row-key="grid.rowKey"
      :columns="grid.columns"
      :data="grid.data"
      :pagination="grid.pagination"
      :scroll="{ x: true }"
    />
    <!-- @tableChange="onPageChange($event)" -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import DataConfirmSearchForm from '@/components/crawlerData/crawlerIndex/DataConfirmSearchForm.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import ConfirmForm from '@/components/crawlerData/crawlerIndex/ClaimForm.vue';
import ConfirmGroupForm from '@/components/crawlerData/crawlerIndex/ConfirmGroupForm.vue';
import Action from '@/components/preparation/preparationIndex/Action.vue';
import StatusBar from '@/components/preparation/preparationIndex/StatusBar.vue';
import AddOutsidePlan from '@/components/preparation/preparationIndex/AddOutsidePlan.vue';
import AddInsidePlan from '@/components/preparation/preparationIndex/AddInsidePlan.vue';
import { Getter } from 'vuex-class';
import { RoleDto } from '@fubonlife/iams-api-axios-sdk';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';

export interface ResultModel{
  visible: boolean;
  title: string;
	content?: string;
  type: 'success' | 'error';
	autoClose?: string;
}

@Component({
	components: {
		DataConfirmSearchForm, IconTextButton, ConfirmForm, ConfirmGroupForm, Action, FblDataGrid, StatusBar, AddOutsidePlan, AddInsidePlan,
	},
})
export default class HumanResourcePlanning extends Vue {
	h = this.$createElement;

	get memberList() {
		return [...new Set(this.grid.data)];
	}

	// 結果彈窗設定
	resultModalSetting: ResultModel = {
		visible: false,
		title: 'title',
		content: '123456789',
		type: 'error',
		autoClose: null,
	}

	// 查詢列表
	searchForm = {
		year: null,
		months: undefined,
		type: null,
		item: null,
	}

	fakeData = [
		{
			member: '高Ｘ豐',
			totle: '222',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '高Ｘ豐',
			totle: '222',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '高Ｘ豐',
			totle: '222',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '王Ｘ名',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '王Ｘ名',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '王Ｘ名',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '王Ｘ名',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '王Ｘ名',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '小張',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
		{
			member: '小美',
			totle: '153',
			days: '5',
			date: '111/11/16~111/12/12',
			work: '保費帳務作業',
			unit: '保費帳務作業',
		},
	]

	// FblPDataGridHolder<>
	grid = {
		rowKey: 'month',
		data: this.fakeData,
		pagination: {
			size: 'small',
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['10', '15', '25'],
			showQuickJumper: true,
			showSizeChanger: true,
			showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
		},
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'member',
				title: '人員',
				formatter: (data) =>
					this.h('div', {}, [
						this.h(
							'img',
							{
								attrs: {
									src: this.getOddEven(data.member) ? require('@/assets/images/icon_working.svg') : require('@/assets/images/icon_working_1.svg'),
									class: 'user-img',
								},
							},
							'',
						),
						this.h(
							'span',
							{},
							data.member,
						),
					]),
				rowSpanKey: (data) => data.member + data.member,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'totle',
				title: '總天數',
				rowSpanKey: (data) => data.totle + data.member,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'days',
				title: '工作天數',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'date',
				title: '查核期間',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'work',
				title: '工作項目',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'unit',
				title: '組別',
				rowSpanKey: (data) => data.unit + data.member,
			},
		],
	};

	// 查詢人員順序基偶數
	getOddEven(name: string): boolean {
		const index = this.memberList.findIndex((e) => e.member === name);
		return !!(index % 2);
	}
}
</script>

<style lang="scss" scoped>
	.search{
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 8px;
	}
	.search__item{
		display: flex;
		align-items: flex-start;
	}
	.search__input{
		flex: 1;
	}
	.search__label{
		font-size: 14px;
		font-weight: bold;
		padding-top: 7px;
	}

	.search__btn{
		margin-left: 12px;
	}
	.user-img{
		width: 48px;
		height: 48px;
		margin-right: 20px;
	}
</style>
