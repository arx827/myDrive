<template>
  <div>
    <!-- Modal -->
    <div
      id="healthEduMaintainSearchModal"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="searchModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl">
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
            <div class="event__wrap">
              <div class="event__block">
                <div class="page__title mt-0">
                  進階查詢
                </div>
                <div class="block__content" />
              </div>
              <div class="event__block">
                <a-form-model
                  ref="formRef"
                  :model="form"
                  :rules="formRules"
                  :layout="'vertical'"
                >
                  <div class="row">
                    <a-form-model-item prop="tableType">
                      <label class="a-form-label">類別</label>
                      <a-radio-group v-model="form.tableType">
                        <a-radio value="1">
                          衛教通知
                        </a-radio>
                        <a-radio value="2">
                          醫師諮詢
                        </a-radio>
                        <a-radio value="3">
                          表單通知
                        </a-radio>
                      </a-radio-group>
                    </a-form-model-item>
                  </div>
                  <div class="row">
                    <div class="col-md">
                      <a-form-model-item prop="planTypeSearch">
                        <label class="a-form-label">計畫類別</label>
                        <a-select
                          v-model="form.planTypeSearch"
                          placeholder="選擇計畫"
                          class="select"
                          :options="planTypeOptions"
                          @change="handlePlanChange"
                        />
                      </a-form-model-item>
                    </div>
                    <div class="col-md">
                      <a-form-model-item prop="healthEduTypeSearch">
                        <label class="a-form-label">衛教類別</label>
                        <a-select
                          v-model="form.healthEduTypeSearch"
                          placeholder="選擇衛教類別"
                          class="select"
                          :options="healthEduTypeOptions"
                          :disabled="form.tableType!=='1'"
                        />
                      </a-form-model-item>
                    </div>
                  </div>
                </a-form-model>
                <div class="row">
                  <button
                    class="btn__radius--primary btn__search mx-auto"
                    @click="onSearch"
                  >
                    確定
                  </button>
                </div>
              </div>
              <hr>
              <div
                v-if="isSearching"
                class="event__block"
              >
                <fbl-data-grid
                  class="query__table"
                  :row-key="gridData.rowKey"
                  :columns="gridData.columns"
                  :data="gridData.data"
                  :pagination="false"
                  :scroll="{ x: true }"
                >
                  <template v-slot:handleAction="slotProps">
                    <div class="d-flex">
                      <button
                        class="icon-button icon__edit action__block--margin"
                        :class="{'icon__edit--disabled':slotProps.data.enabled==='N'}"
                        :disabled="slotProps.data.enabled==='N'"
                        data-bs-dismiss="modal"
                        @click="editBtn(slotProps.data.contentId)"
                      >
                        <a-icon type="edit" />
                      </button>
                      <button
                        class="icon-button icon__delete"
                        :class="{'icon__delete--disabled':slotProps.data.enabled==='N'}"
                        :disabled="slotProps.data.enabled==='N'"
                        @click="delBtn(slotProps.data)"
                      >
                        <a-icon type="delete" />
                      </button>
                    </div>
                  </template>
                  <template v-slot:handleStatus="slotProps">
                    <a-switch
                      checked-children="啟用"
                      un-checked-children="停用"
                      :checked="slotProps.data.enabled==='Y'"
                      :disabled="false"
                      @click="handleSwitch(slotProps.data)"
                    />
                  </template>
                </fbl-data-grid>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import moment from 'moment';
import { Action } from 'vuex-class';
import { AdvQueryNoticeContentDto, ContentIdDto, SaveNoticeContentEnabledDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: { FblDataGrid } })
export default class HealthEduMaintainSearch extends Vue {
  @Action('setLoading') setLoading;

	@Prop()
	visible: boolean

  content = [];

  // 正在查詢
  isSearching = true;

  // 表單
  form = {
  	planTypeSearch: undefined, // 計畫類別查詢
  	healthEduTypeSearch: undefined, // 衛教類別查詢
  	tableType: undefined, // 選擇類別
  }

  // 檢核規則
  formRules = {
  	planTypeSearch: [{ required: true, trigger: 'change', message: '請選擇計畫類別' }],
  	tableType: [{ required: true, trigger: 'change', message: '請選擇類別' }],
  };

  // 計畫類別 下拉選項
  planTypeOptions = [];

  // 衛教類別 下拉選項
  healthEduTypeOptions = []

	@Watch('visible')
  onModalChange(val) {
  	if (!val) {
  		this.form = {
  			planTypeSearch: undefined, // 計畫類別查詢
  			healthEduTypeSearch: undefined, // 衛教類別查詢
  			tableType: undefined, // 選擇類別
  		};
  		this.gridData.data = [];
  	}
  }

	// 計畫類別 下拉選項變化 -> 衛教類別
	handlePlanChange(value) {
  	this.healthEduTypeOptions = [];
  	this.form.healthEduTypeSearch = undefined;
  	const filterArr = this.content.filter((item) => item.srcFrom === value);
  	filterArr[0].itemDtoList.forEach((item) => {
  		const block = {
  			value: item.item,
  		  label: item.itemDesc,
  		};
  		this.healthEduTypeOptions.push(block);
  	});
	}

  gridData = {
  	rowKey: 'id',
  	data: [],
  	columns: [],
  };

  columnsTpye = {
  	healthInfo:
		[
			{
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 0,
  		},
			{
				type: FblColumnType.PLAIN,
				property: 'srcFromDesc',
				title: '計畫類別',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'itemDesc',
				title: '衛教類別',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtDt',
				title: '建立時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.crtDt !== null ? moment(data.crtDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtName',
				title: '建立人員',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
				title: '修改時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.updDt !== null ? moment(data.updDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '修改人員',
				width: 150,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleStatus',
				title: '狀態',
				width: 100,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleAction',
				title: '',
			},
		],
  	doctorConsult:
		[
			{
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 70,
  		},
			{
				type: FblColumnType.PLAIN,
				property: 'srcFromDesc',
				title: '計畫類別',
  			width: 250,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtDt',
				title: '建立時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.crtDt !== null ? moment(data.crtDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtName',
				title: '建立人員',
				width: 180,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
				title: '修改時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.updDt !== null ? moment(data.updDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '修改人員',
				width: 180,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleStatus',
				title: '狀態',
				width: 100,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleAction',
				title: '',
			},
		],
  	formInfo:
		[
			{
  			type: FblColumnType.TEMPLATE,
  			property: 'id',
  			title: '',
  			width: 70,
  		},
			{
				type: FblColumnType.PLAIN,
				property: 'srcFromDesc',
				title: '計畫類別',
  			width: 250,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtDt',
				title: '建立時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.crtDt !== null ? moment(data.crtDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtName',
				title: '建立人員',
				width: 180,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
				title: '修改時間',
				width: 150,
				customRender: (data) => this.$createElement('div', {
  				style: {
  					marginRight: '20px',
  				},
  			}, data.updDt !== null ? moment(data.updDt).format('YYYY/MM/DD HH:mm:ss') : ''),
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '修改人員',
				width: 180,
			},
			{
				type: FblColumnType.TEMPLATE,
				property: 'action',
				template: 'action',
				title: '',
				width: 50,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleStatus',
				title: '狀態',
				width: 100,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'handleAction',
				title: '',
			},
		],
  }

  // 編輯
  editBtn(data) {
  	let type;
  	switch (parseInt(this.form.tableType)) {
  	case 1:
  		type = 'editHEItem';
  		break;
  	case 2:
  		type = 'editDocItem';
  		break;
  	case 3:
  		type = 'editFormItem';
  		break;
  	default:
  		type = 'editHEItem';
  		break;
  	}
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'HealthEduMaintainConfirm',
  		query: {
  			contentId: data,
  		},
  		params: {
  			type,
  		},
  	});
  }

  delBtn(data) {
  	this.setLoading(true);
  	const delData: ContentIdDto = {
  		contentId: data.contentId,
  	};
  	this.$CaseMaintainUtilityApi.deleteNoticeContentUsingPOST(delData)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.onSearch();
  			}
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  handleSwitch(data) {
  	this.setLoading(true);
  	if (data.enabled === 'Y') {
  		data.enabled = 'N';
  		const enabledData: SaveNoticeContentEnabledDto = {
  			contentId: data.contentId,
  			enabled: data.enabled,
  		};
  		this.$CaseMaintainUtilityApi.saveNoticeContentEnabledUsingPOST(enabledData)
  			.then((resp) => {
  				console.log('result => ', resp);
  			})
  			.catch((error) => {
  				console.log('error status => ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	} else if (data.enabled === 'N') {
  		data.enabled = 'Y';
  		const enabledData: SaveNoticeContentEnabledDto = {
  			contentId: data.contentId,
  			enabled: data.enabled,
  		};
  		this.$CaseMaintainUtilityApi.saveNoticeContentEnabledUsingPOST(enabledData)
  			.then((resp) => {
  				console.log('result => ', resp);
  			})
  			.catch((error) => {
  				console.log('error status => ', error);
  			})
  			.finally(() => {
  				this.setLoading(false);
  			});
  	}
  }

  // 確定
  onSearch() {
  	this.gridData.data = [];
  	(this.$refs.formRef as any).validate((valid) => {
  		if (valid) {
  			this.setLoading(true);
  			const searchData: AdvQueryNoticeContentDto = {
  				srcFrom: this.form.planTypeSearch,
  				contentType: parseInt(this.form.tableType),
  			};
  			if (parseInt(this.form.tableType) === 1) {
  				searchData.item = this.form.healthEduTypeSearch;
  			}
  			this.$CaseMaintainUtilityApi.advQueryNoticeContentUsingPOST(searchData)
  				.then((resp) => {
  					this.gridData.data = resp.data.data;
  					for (let i = 0; i < this.gridData.data.length; i++) {
  						this.gridData.data[i].id = i.toString();
  					}
  					switch (parseInt(this.form.tableType)) {
  					case 1:
  						this.gridData.columns = this.columnsTpye.healthInfo;
  						break;
  					case 2:
  						this.gridData.columns = this.columnsTpye.doctorConsult;
  						break;
  					case 3:
  						this.gridData.columns = this.columnsTpye.formInfo;
  						break;
  					default:
  						this.gridData.columns = this.columnsTpye.healthInfo;
  						break;
  					}
  					this.isSearching = true;
  				})
  				.catch((error) => {
  					console.log('error status => ', error);
  				})
  				.finally(() => {
  					this.setLoading(false);
  				});
  		}
  	});
  }

  getFormData() {
  	this.setLoading(true);
  	this.$CaseMaintainUtilityApi.srcFromUsingPOST()
  		.then((resp) => {
  			this.content = resp.data.data;
  			resp.data.data.forEach((item) => {
  				const block = {
  					value: item.srcFrom,
  		      label: item.srcFromDesc,
  				};
  				this.planTypeOptions.push(block);
  			});
  		})
  		.catch((error) => {
  			console.log('error status => ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  created() {
  	this.getFormData();
  }
}
</script>

<style lang="scss" scoped>
  #searchModal {
    padding: 20px;
    margin-top: 30px;
  }
  .a-form-label {
    color: #000;
    display: block;
    padding-bottom: 2px;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include rwd-sm {
      padding: 20px 70px;
    }
  }
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin-bottom: 50px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }

  // 虛線
  hr {
    border: 0;
    border-top: 1px dashed #CECECE;
    margin: 30px 0;
  }

  .btn__search {
    height: 40px;
    width: 120px;
    padding-top: 5px;
  }
  .action__edit{
    color: #23C4A8;
    padding: 4px 15px;
    &:hover{
      background-color: #23C4A8;
      ::v-deep .anticon{
        color: #fff;
      }
    }
  }

  ::v-deep {
    .ant-select-selection--single, .ant-select-selection__rendered {
      height: 40px;
    }
    .ant-select-selection-selected-value {
      padding-top: 5px;
    }
  }
</style>
