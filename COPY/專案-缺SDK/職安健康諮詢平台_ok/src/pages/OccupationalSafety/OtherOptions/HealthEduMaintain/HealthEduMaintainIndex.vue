<template>
  <div>
    <div class="container">
      <h2 class="page__title">
        通知內容維護
      </h2>
      <div class="query__wrapper d-md-flex align-items-center">
        <a-radio-group
          class="query__radio"
          :default-value="tableTypeOption[0].value"
          button-style="solid"
          @change="onClickRadio"
        >
          <a-radio-button
            v-for="(item,index) in tableTypeOption"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
        <div
          class="query__add"
        >
          <button
            class="query__add__btn btn__main btn__main--light me-2"
            data-bs-toggle="modal"
            data-bs-target="#healthEduMaintainSearchModal"
          >
            進階查詢
          </button>
          <button
            class="query__add__btn btn__main btn__main--light"
            @click="addBtn"
          >
            新增
          </button>
        </div>
      </div>
      <div class="query__wrap-result">
        <fbl-data-grid
          class="query__table"
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :scroll="{ x: true }"
          @tableChange="onPageChange($event)"
        >
          <template v-slot:handleAction="slotProps">
            <div class="d-flex">
              <button
                class="icon-button icon__edit action__block--margin"
                :class="{'icon__edit--disabled':slotProps.data.enabled==='N'}"
                :disabled="slotProps.data.enabled==='N'"
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
    <SearchModal :visible="searchModalVisible" />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import {
	FblColumnType,
	FblPDataGridHolder,
} from '@/components/shared/data-grid/models';
import moment from 'moment';
import SearchModal from '@/pages/OccupationalSafety/OtherOptions/HealthEduMaintain/HealthEduMaintainSearch.vue';
import { ContentTypeDto, SaveNoticeContentEnabledDto, ContentIdDto } from '@fubonlife/oss-api-axios-sdk';
import notification from '@/plugins/notification/infoNotification';

require('../../../../../node_modules/bootstrap/js/dist/modal');

@Component({ components: { FblDataGrid, SearchModal } })
export default class HealthEduMaintainIndex extends Vue {
  @Action('setLoading') setLoading;

	h = this.$createElement;

	// table顯示的類別
	tableType = 1;

	// radio的button選項
	tableTypeOption = [
		{ label: '衛教通知', value: 1 },
		{ label: '醫師諮詢', value: 2 },
		{ label: '表單通知', value: 3 },
	]

	searchModalVisible = false // 進階查詢modal

	// 不同table不同columns
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

	gridData = {
		rowKey: 'id',
		data: [],
		pagination: {
			current: 1,
			pageSize: 10,
			total: 0,
			pageSizeOptions: ['5', '10', '25'],
			showQuickJumper: true,
			showSizeChanger: true,
		},
		columns: [],
	};

	created() {
		this.setData();
	}

	mounted() {
		const searchModal = document.getElementById('healthEduMaintainSearchModal');
		searchModal.addEventListener('hidden.bs.modal', (event) => {
			// do something...
			this.searchModalVisible = false;
			console.log('close modalllllllllllllllll');
		});
		searchModal.addEventListener('shown.bs.modal', (event) => {
			// do something...
			this.searchModalVisible = true;
			console.log('open modalllllllllllllllll');
		});
	}

	setData() {
		this.setLoading(true);
		this.gridData.data = [];
		const queryData: ContentTypeDto = {
			contentType: this.tableType,
			pageNo: this.gridData.pagination.current - 1,
			pageSize: this.gridData.pagination.pageSize,
		};
		this.$CaseMaintainUtilityApi.noticeContentMaintainUsingPOST(queryData)
			.then((resp) => {
				if (resp.data.status === 200) {
					this.gridData.pagination.total = Number(resp.data.data.totalElements);
					this.gridData.data = resp.data.data.content;
					for (let i = 0; i < this.gridData.data.length; i++) {
						this.gridData.data[i].id = i.toString();
					}
					switch (this.tableType) {
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
				} else {
					notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
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

	// 編輯
	editBtn(data) {
		let type;
		switch (this.tableType) {
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
					this.setData();
				}
			})
			.catch((error) => {
				console.log('error status => ', error);
			})
			.finally(() => {
				this.setLoading(false);
			});
	}

	// 新增
	addBtn() {
		let path;
		switch (this.tableType) {
		case 1:
			path = '/occupationSafety/Other/healthEduMaintain/addHEItem';
			break;
		case 2:
			path = '/occupationSafety/Other/healthEduMaintain/addDocItem';
			break;
		case 3:
			path = '/occupationSafety/Other/healthEduMaintain/addFormItem';
			break;
		default:
			path = '/occupationSafety/Other/healthEduMaintain/addHEItem';
			break;
		}
		this.$router.push({ path });
	}

	// 切換衛教&醫生諮詢
	onClickRadio(e) {
		this.tableType = e.target.value;
		this.setData();
	}

	onPageChange(e) {
  	this.gridData.pagination.current = e.pagination.current;
  	this.gridData.pagination.pageSize = e.pagination.pageSize;
  	this.setData();
	}
}
</script>

<style lang="scss" scoped>
	.query__radio{
		display: flex;
		justify-content: center;
		margin: 0px auto;
		@include rwd-md {
			padding-left: 203px;
		}
	}
	::v-deep .ant-radio-button-wrapper{
		min-width: 95px;
		text-align: center;
	}
	::v-deep .ant-input-suffix{
		font: 1.2em;
	}
	.query__add {
		text-align: center;
		margin-top: 15px;
		@include rwd-md {
			margin: 0;
		}
		.query__add__btn{
			padding: 4px 24px;
		}
	}
	.action__block--margin {
		margin-right: 5px;
	}
	.action__read{
		color:#000000A6;
		margin-left: 18px;
		::v-deep svg{
			font-size: 13px;
		}
	}

	.query__wrap-result{
		margin-top: 20px;
	}

	::v-deep {
		.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
			padding: 7px 16px;
		}
		.ant-table-thead > tr > th span{
			font-weight: bold;
		}
		.query__wrap-result{
			padding-bottom: 70px;
		}
	}
</style>
