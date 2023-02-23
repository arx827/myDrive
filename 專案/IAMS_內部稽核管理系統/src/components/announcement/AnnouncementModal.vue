<template>
  <div>
    <a-modal
      :visible="visible"
      :closable="false"
      :footer="null"
      wrap-class-name="modal__primary annouceModal"
      :width="907"
      :centered="true"
      :mask-closable="false"
    >
      <div
        class="modal__close flex-center"
        @click="handleCancel"
      >
        <img
          src="@/assets/images/icon/icon_window_close.svg"
          alt=""
        >
      </div>
      <div class="modal__content__title d-flex align-items-center">
        <div class="icon-notificate">
          <img
            src="@/assets/images/icon/icon_announcement_1.svg"
            alt=""
          >
        </div>
        最新公告
      </div>
      <div class="text-end mt-3">
        <button
          v-if="isAdmin"
          class="btn__add ms-0"
          @click="onAdd"
        >
          新增
        </button>
      </div>
      <a-table
        class="table__wrap"
        :data-source="grid.data"
        :columns="grid.columns"
        :scroll="{x:false,y:true}"
        row-key="announcementId"
        :pagination="grid.pagination"
        @change="pageChange"
      >
        <div
          slot="filterDropdown"
          slot-scope="{confirm}"
          class="search__wrap"
        >
          <a-input
            v-model="keyword"
            class="input__search"
            @pressEnter="handleSearch(confirm)"
          />
          <div class="d-flex">
            <a-button
              type="primary"
              size="small"
              class="btn--dark--small btn__search flex-center"
              @click="handleSearch(confirm)"
            >
              查詢
            </a-button>
            <a-button
              size="small"
              class="btn--light--small btn__search flex-center"
              @click="handleReset(confirm)"
            >
              取消
            </a-button>
          </div>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template
          slot="icon"
        >
          <div class="table__tbody-icon">
            <img
              src="@/assets/images/icon/icon_announcement_2.svg"
              alt=""
            >
          </div>
        </template>
        <template
          slot="date"
          slot-scope="text,record"
        >
          <div class="table__tbody__item">
            <div class="table__tbody__item-bold">
              {{ ROCDateformat(record.startTimestamp) }}
            </div>
          </div>
        </template>
        <template
          slot="topicAndContent"
          slot-scope="text,record"
        >
          <div class="table__tbody__item">
            <p class="table__tbody__item-bold">
              主旨 : {{ record.title }}
            </p>
            <p>
              內容 : {{ record.content }}
            </p>
            <div
              v-if="isAdmin"
              class="d-flex justify-content-end pe-2"
            >
              <div
                class="btn__icon--edit-acion me-3"
                @click="onEdit(record)"
              />
              <CustomPopConfirm
                @confirm="onDelete(record)"
              >
                <div
                  class="btn__icon--delete-action"
                />
              </CustomPopConfirm>
            </div>
          </div>
        </template>
      </a-table>
    </a-modal>
    <AnnouncementEdit
      :edit-data="editData"
      :visible="editModaVisible"
      @closeModal="editModaVisible = false"
      @reloadAnnouncement="getAnnounce"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Prop, Component, Watch,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import { QueryAnnouncement } from '@fubonlife/iams-api-axios-sdk';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import AnnouncementEdit from '@/components/announcement/AnnouncementEdit.vue';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import DateTimeFormmat from '@/plugins/DateTimeFormmat';
import moment from 'moment';
import FblDataGrid from '../shared/data-grid/FblDataGrid.vue';

const modalModule = namespace('modalControl');

@Component({
	components: { FblDataGrid, AnnouncementEdit, CustomPopConfirm },
})
export default class AnnouncementModal extends Vue {
  @Action('setLoading') setLoading;

	@modalModule.Action('setModalState') setModalState;

  unsubscribe$ = new Subject<void>();

  @Prop()
  visible: boolean;

  showSearch: boolean = false;

  // 是否有編輯的權限
  isAdmin: boolean = false;

  searchInput= null

  // 查詢公告關鍵字
  keyword: string = '';

  editModaVisible: boolean = false;

  editData = null;

  grid = {
  	pagination: {
  		size: 'small',
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  	},
  	data: null,
  	columns: [
  		{
  			title: '',
  			dataIndex: 'icon',
  			key: 'icon',
  			colSpan: 2,
  			scopedSlots: {
  				customRender: 'icon',
  			},
  		},
  		{
  			title: '公告日期',
  			dataIndex: 'date',
  			colSpan: 2,
  			key: 'date',
  			scopedSlots: {
  				customRender: 'date',
  			},
  		},
  		{
  			title: '主旨/公告內容',
  			dataIndex: 'topic',
  			key: 'topic',
  			colSpan: 8,
  			scopedSlots: {
  				filterDropdown: 'filterDropdown',
  				filterIcon: 'filterIcon',
  				customRender: 'topicAndContent',
  			},
  		},
  	],
  }

  @Watch('visible')
  onVisibleChanged(val) {
  	if (val) this.getAnnounce();
  	if (this.$global?.getCurrentRoleId() === 'ROLE_ROOT') this.isAdmin = true;
  }

  handleSearch(confirm) {
  	confirm();
  	if (this.keyword
        && this.keyword !== null
        && this.keyword !== undefined
        && this.keyword.length !== 0) {
  		this.getAnnounce(this.keyword);
  	}
  }

  handleReset(confirm) {
  	confirm();
  	this.keyword = '';
  }

  created() {
  	if (this.$global?.getCurrentRoleId() === 'ROLE_ROOT') this.isAdmin = true;
  	this.$user.loginState$
  		.pipe(takeUntil(this.unsubscribe$))
  		.subscribe((state) => {
  			if (state && state.me) {
  				this.getAnnounce();
  			}
  		});
  }

  getAnnounce(keyword?: string, pageIndex?: number) {
  	this.setLoading(true);
  	const request: QueryAnnouncement = {
  		startYYYYMMDD: '',
  		endYYYYMMDD: '',
  		keyword: keyword || '',
  		pageIndex: pageIndex || 0,
  		pageSize: 10,
  		sortList: [],
  	};
  	this.$announcementApi.getRecentListInAnnouncementUsingPOST(request)
  		.then((resp) => {
  			// console.log(resp);
  			const data = resp.data.result;
  			this.grid.data = data.content;
  			this.grid.pagination.total = parseInt(data.totalElements);
  		})
  		.catch((error) => {
  			this.grid.pagination.total = 0;
  			this.grid.data = [];
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  ROCDateformat(dateString: string) {
  	const date = new Date(dateString);
  	if (!date) {
  		return '';
  	}
  	const yearStr = moment(date, 'YYYY').year().toString();
  	const twYear = parseInt(yearStr, 10) - 1911;
  	return moment(date).format(`${twYear}/MM/DD`);
  }

  handleCancel() {
  	this.$emit('closeModal');
  }

  pageChange(value) {
  	console.log(value);
  	const current = value.current - 1;
  	this.getAnnounce('', current);
  }

  onEdit(record) {
  	this.editModaVisible = true;
  	this.editData = record;
  }

  onAdd() {
  	this.editData = null;
  	this.editModaVisible = true;
  }

  onDelete(record) {
  	this.setLoading(true);
  	this.$announcementApi.removeInAnnouncementUsingGET(record.announcementId)
  		.then(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '刪除公告成功',
  					autoClose: 3,
  				},
  			});
  			this.getAnnounce();
  		})
  		.catch(() => {
  			this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '刪除公告失敗',
  				},
  			});
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }
}
</script>

<style lang="scss" scoped>
.btn__add {
  @include button_base($BUTTON-LIGHT, #e5f2f5, $BUTTON-DARK, $BUTTON-DARK, $BUTTON-DARK, $BUTTON-DARK, 4px, 13px,);
  line-height: 0;
  height: 26px;
  padding: 2px 20px;
  margin-bottom: 5px;
}
::v-deep .annouceModal{
  .ant-modal-body{
    max-height: 79vh;
    padding: 20px 36px;
  }
  .icon-notificate{
    width: 26px;
    height: 26px;
    margin-right: 10px;
  }

  /*----------------------------table-------------------------*/
  .table__wrap{
    .ant-table-body{
      max-height: calc(67vh - 105px);
    }
    //  table-header
    .ant-table .ant-table-column-title {
      font-size: 16px;
    }
    .ant-table-header{
      background-color: $COLOR-MAIN5;
    }
    .ant-table-thead > tr > th{
      text-align: left;
      background-color: $COLOR-MAIN5;
      color:#000;
      padding: 8px 0;
    }
    .ant-table-thead > tr > th:nth-child(1){
      width: 10%;
    }
    .ant-table-thead > tr > th:nth-child(2){
      width: 15%;
    }
    //  header 查詢icon 按鈕
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .anticon-filter.ant-table-filter-open, .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .ant-table-filter-icon.ant-table-filter-open{
      background: rgba($color: #000000, $alpha: 0);
    }
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters:hover .ant-table-filter-icon:hover{
      background: rgba($color: #000000, $alpha: 0);
    }
    .ant-table-thead > tr > th.ant-table-column-has-actions.ant-table-column-has-filters .ant-table-filter-icon{
      color :#7E84A3;
    }

    // table-body
    .ant-table tr{
      background: $COLOR-LIGHT;
    }
    .ant-table-tbody > tr > td{
      padding: 20px 0px;
      vertical-align: top;
    }
    .ant-table-tbody > tr > td:nth-child(1){
      width: 10%;
    }
    .ant-table-tbody > tr > td:nth-child(2){
      width: 15%;
    }
    .table__tbody__item .table__tbody__item-bold{
      color:#000;
    }

    .table__tbody-icon{
      display: flex;
      justify-content: center;
      img {
        width: 32px;
        height: 22px;
      }
    }

    // table-pagination
    .ant-table-pagination.ant-pagination {
      background: #fff;
      margin: 0;
      padding: 8px 0px;
      border: 1px solid #C7C7C7;
    }
  }
}
  // 查詢窗
  .search__wrap{
    .input__search{
      display: block;
      margin-bottom: 8px;
    }
    padding: 8px;
    .btn__search:nth-child(1){
      margin-right: 8px;
    }
  }

</style>
