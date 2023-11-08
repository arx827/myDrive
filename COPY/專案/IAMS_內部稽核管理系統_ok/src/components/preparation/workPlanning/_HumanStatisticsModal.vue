<!-- 人力統計表 -->
<template>
  <a-modal
    :visible="visibleSync"
    :closable="false"
    wrap-class-name="modal__primary"
    :footer="null"
    :centered="true"
    :width="1200"
    @closeModal="visibleSync = false"
  >
    <div
      class="modal__close flex-center"
      @click="visibleSync = false"
    >
      <img
        src="@/assets/images/icon/icon_window_close.svg"
        alt=""
      >
    </div>
    <div class="modal__content">
      <div class="modal__content__title">
        人力統計表
      </div>
      <div class="modal__main">
        <!-- 查詢 -->
        <div class="search__bar mb-3 mt-1">
          <a-form-model
            ref="formRef"
            :rules="rules"
            class="d-flex flex-grow-1 align-items-center search__formGroup"
            :model="searchForm"
            :hide-required-mark="true"
          >
            <div class="col search__item">
              <div class="search__label">
                年度
              </div>
              <a-form-model-item
                prop="year"
              >
                <date-picker
                  v-model="searchForm.year"
                  :formatter="yearFormatter"
                  :disabled="searchForm.todo"
                  type="year"
                  :allow-clear="true"
                  class="w-100"
                />
              </a-form-model-item>
            </div>
            <div class="col search__item">
              <div class="search__label">
                組別
              </div>
              <a-form-model-item
                prop="group"
              >
                <a-select
                  v-model="searchForm.group"
                  mode="multiple"
                  show-search
                  :options="$enum.quarter"
                  :allow-clear="true"
                  class="w-100"
                />
              </a-form-model-item>
            </div>
            <div class="col search__item">
              <div class="search__label">
                查核人員
              </div>
              <a-form-model-item
                prop="group"
              >
                <a-select
                  v-model="searchForm.group"
                  mode="multiple"
                  show-search
                  :options="$enum.quarter"
                  :allow-clear="true"
                  class="w-100"
                />
              </a-form-model-item>
            </div>
            <button class="search__btn btn--search">
              查詢
            </button>
            <div class="col">
              <IconTextButton
                class="float-end"
                text="上一頁"
                type="return"
                @click="$router.push({ name: 'PreparationIndex' })"
              />
            </div>
          </a-form-model>
        </div>
        <FblDataGrid
          class="table--pale"
          :row-key="grid.rowKey"
          :columns="grid.columns"
          :data="grid.data"
          :pagination="grid.pagination"
          :scroll="{ x: true }"
        />
      </div>
    </div>
    <!-- <div class="d-flex mt-4 justify-content-end">
      <button class="btn--primary me-2">
        確認
      </button>
      <button
        class="btn--dark ms-2"
        @click="visibleSync = false"
      >
        取消
      </button>
    </div> -->
  </a-modal>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, PropSync, Watch,
} from 'vue-property-decorator';
import { Getter, Action, namespace } from 'vuex-class';
import { DataConfirmRequestDto } from '@fubonlife/iams-api-axios-sdk';
import InfoModal from '@/components/shared/modal/InfoModal.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
} from '@/components/shared/data-grid/models';

@Component({
	components: { InfoModal, IconTextButton, FblDataGrid },
})
export default class ReviewCommitModal extends Vue {
  @PropSync('visible')
  visibleSync: boolean;

  yearFormatter = this.$twYearFormatter;

	// 查詢列表
	searchForm = {
		year: undefined,
		quarter: undefined,
		type: undefined,
		range: [],
		item: undefined,
		todo: undefined,
		// status: null,
	}

  rules = {
  	year: [{ required: true, message: '請選擇年度', trigger: 'change' }],
  	quarter: [{ required: true, message: '請選擇季', trigger: 'change' }],
  }

  h = this.$createElement;

  get memberList() {
  	return [...new Set(this.grid.data)];
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
  .modal__main {
    width: 100%;
    margin-top: 10px;
    background: $BG-LIGHT;
    padding: 10px;
  }
  .search__bar {
    padding: 14px 24px;
  }
  .search__item {
		display: flex;
		align-items: center;
    + .search__item {
      margin-left: 20px;
    }
	}
  .search__label {
    color: rgba(0, 0, 0, 0.85);
    margin-right: 10px;
    word-break: keep-all;
    font-weight: 600;
    font-size: 14px;
  }
  ::v-deep {
    .ant-form-item {
      width: 100%;
    }
  }
  .user-img{
		width: 48px;
		height: 48px;
		margin-right: 20px;
	}
</style>
