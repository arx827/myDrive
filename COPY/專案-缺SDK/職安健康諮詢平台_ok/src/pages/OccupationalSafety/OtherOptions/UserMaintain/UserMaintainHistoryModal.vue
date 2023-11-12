<template>
  <div>
    <a-modal
      v-model="modalVisible"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="common__modal"
      :after-close="onClose"
    >
      <div class="event__block">
        <div class="page__title m-0">
          歷史異動紀錄
        </div>
      </div>
      <div class="userMaintain__wrap">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="formRules"
          :layout="'vertical'"
        >
          <div class="userMaintain__block bg__light">
            <div class="row">
              <div class="col-md-6">
                <a-form-model-item
                  prop="applyDate"
                  label="申請日期"
                >
                  <date-picker
                    v-model="form.applyDate"
                    type="date"
                    :range="true"
                    :format="'YYYY/MM/DD'"
                    placeholder="e.g. 2022/01/01～2022/02/01"
                    style="width: 100%;"
                  />
                </a-form-model-item>
              </div>
              <div class="col-md-6">
                <a-form-model-item
                  prop="status"
                  label="覆核狀態"
                >
                  <a-radio-group
                    v-model="form.status"
                    class="row"
                  >
                    <div
                      v-for="item in statusOptions"
                      :key="item.value"
                      class="col-12 col-md"
                    >
                      <a-radio
                        :value="item.value"
                        class="query__wrap mb-2"
                      >
                        {{ item.label }}
                      </a-radio>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <a-form-model-item
                  prop="adNum"
                  label="AD帳號"
                >
                  <a-input
                    v-model="form.adNum"
                    placeholder="e.g. A1234"
                  />
                </a-form-model-item>
              </div>
              <div class="col-md-6">
                <a-form-model-item
                  prop="name"
                  label="姓名"
                >
                  <a-input
                    v-model="form.name"
                    vue="true"
                    alt="webfont"
                    placeholder="e.g. 林曉春"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary--outline me-1"
                @click="onClose"
              >
                取消
              </button>
              <button
                class="btn__radius--primary ms-1"
                @click="onSearch"
              >
                查詢
              </button>
            </div>
          </div>
        </a-form-model>
      </div>
      <div
        v-if="grid.data.length>0"
        class="content__wrap"
      >
        <div class="content__title d-flex justify-content-between align-items-center">
          查詢結果
          <button
            class="btn__radius--primary--outline"
            @click="downloadFile"
          >
            下載
          </button>
        </div>
        <div class="table__wrap">
          <a-table
            :row-key="grid.rowKey"
            :columns="grid.columns"
            :data-source="grid.data"
            :pagination="false"
          >
            <a-table
              slot="expandedRowRender"
              slot-scope="slotProps"
              :row-key="innerGrid.rowKey"
              :columns="innerGrid.columns"
              :data-source="innerGrid.data[slotProps.uuid]"
              :pagination="false"
            />
          </a-table>
        </div>
        <div class="btn__wrap d-flex justify-content-center">
          <button
            class="btn__radius--primary"
            @click="onClose"
          >
            返回
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
import {
	UserChangeQueryDtoWithPage, UserChangeQueryDto,
} from '@fubonlife/oss-api-axios-sdk';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import { FblColumnType } from '@/components/shared/data-grid/models';
import moment from 'moment';
import { Action } from 'vuex-class';
import notification from '@/plugins/notification/infoNotification';

@Component({ components: { FblDataGrid } })
export default class UserMaintainHistoryModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @Prop()
  visible!: boolean

  modalVisible = false;

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  // 覆核狀態 選項
  statusOptions = [
  	{ value: 3, label: '全部' },
  	{ value: 1, label: '同意' },
  	{ value: 2, label: '退回' },
  ]

  // 表單
  form = {
  	applyDate: null,
  	status: 3, // 預設全部
  	adNum: null,
  	name: null,
  	roleName: null,
  };

  // 檢核規則 (皆非必填)
  formRules = {
  };

  public grid = {
  	rowKey: 'uuid',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 1000,
  		total: 0,
  	},
  	columns: [
  		{
  			title: 'AD帳號',
  			dataIndex: 'adId',
  			key: 'adId',
  			width: 90,
  		},
  		{
  			title: '姓名',
  			dataIndex: 'name',
  			key: 'name',
  			width: 100,
  		},
  		{
  			title: '申請人員',
  			dataIndex: 'crtName',
  			key: 'crtName',
  			width: 100,
  		},
  		{
  			title: '申請日期',
  			dataIndex: 'crtDt',
  			key: 'crtDt',
  			width: 120,
  			customRender: (data) => (data ? this.h('div', [this.h('div', moment(data).format('YYYY/MM/DD')), this.h('div', moment(data).format('HH:mm:ss'))]) : ''),
  		},
  		{
  			title: '覆核人員',
  			dataIndex: 'updName',
  			key: 'updName',
  			width: 100,
  		},
  		{
  			title: '覆核日期',
  			dataIndex: 'updDt',
  			key: 'updDt',
  			width: 120,
  			customRender: (data) => (data ? this.h('div', [this.h('div', moment(data).format('YYYY/MM/DD')), this.h('div', moment(data).format('HH:mm:ss'))]) : ''),
  		},
  		{
  			title: '覆核狀態',
  			dataIndex: 'proved',
  			key: 'proved',
  			width: 100,
  			customRender: (data) => {
  				let status;
  				switch (data) {
  				case '1':
  					status = '同意';
  					break;
  				case '2':
  					status = '退回';
  					break;
  				case '3':
  					status = '全部';
  					break;
  				default:
  					status = '';
  					break;
  				}
  				return this.h('div', status);
  			},
  		},
  		{
  			title: '退回原因',
  			dataIndex: 'reason',
  			key: 'reason',
  			width: 130,
  			customRender: (data) => (data === null ? '- -' : data),
  		},
  		{
  			title: '執行狀態',
  			dataIndex: 'execAction',
  			key: 'execAction',
  			width: 100,
  			customRender: (data) => (data === 'CREATE' ? this.h('div', '新增') : this.h('div', '修改')),
  		},
  	],
  };

  public innerGrid = {
  	rowKey: 'uuid',
  	data: [],
  	pagination: {
  		current: 1,
  		pageSize: 100,
  		total: 0,
  	},
  	columns: [
  		{
  			title: '角色名稱/權限說明', // roleName + remark，多筆一起呈現
  			dataIndex: 'roles',
  			key: 'roles',
  			customRender: (data) => this.h('div', data.map((e) => `${e.roleName}：${e.remark}`).join('、')),
  		},
  	],
  };

  // 下載
  downloadFile() {
  	this.setLoading(true);
  	const NewRangeDate = this.form.applyDate ? DateTimeFormmat.filterRangeDate(this.form.applyDate) : null;
  	const data: UserChangeQueryDto = {
  		name: this.form.name,
  		startDt: NewRangeDate ? NewRangeDate[0] : null,
  		endDt: NewRangeDate ? NewRangeDate[1] : null,
  		adId: this.form.adNum,
  		reviewStatus: this.form.status,
  	};
  	this.$AdminControlAdminApi.userChangeHistoryDownloadUsingPOST(data, { responseType: 'blob' })
  		.then((resp) => {
  			const disposition = resp.headers['content-disposition'];
  			if (disposition) {
  				let filename = '';
  				if (disposition.indexOf('attachment') !== -1) {
  					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  					const matches = filenameRegex.exec(disposition);
  					if (matches != null && matches[1]) {
  						filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  					}
  				}
  				this.$blobUtils.download(
							resp.data as Blob,
							filename,
							resp.headers['content-type'],
  				);
  			} else {
  				this.$AdminControlAdminApi.userChangeHistoryDownloadUsingPOST(data)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						console.log(error);
  					}).finally(() => {
  						this.setLoading(false);
  					});
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 查詢
  onSearch() {
  	(this.$refs.ruleForm as any).validate((valid) => {
  		if (valid) {
  	    this.searchUserHistory();
  		} else {
  			console.log('error submit!!');
  			return false;
  		}
  	});
  }

  // 取消
  onClose() {
  	this.clearForm();
  	this.$emit('closeHistoryModal');
  }

  // 清除表單
  clearForm() {
  	this.form = {
  		applyDate: null,
  		status: 3, // 預設全部
  		adNum: null,
  		name: null,
  		roleName: null,
  	};
  	this.grid.data = [];
  	this.innerGrid.data = [];
  }

  // 1.2.35.查詢使用者歷史異動紀錄
  searchUserHistory() {
  	const NewRangeDate = this.form.applyDate ? DateTimeFormmat.filterRangeDate(this.form.applyDate) : null;
  	const data: UserChangeQueryDtoWithPage = {
  		name: this.form.name,
  		startDt: NewRangeDate ? NewRangeDate[0] : null,
  		endDt: NewRangeDate ? NewRangeDate[1] : null,
  		adId: this.form.adNum,
  		reviewStatus: this.form.status,
  		pageNo: this.grid.pagination.current - 1,
  		pageSize: this.grid.pagination.pageSize,
  	};
  	this.setLoading(true);
  	this.$AdminControlAdminApi.queryUserChangeHistoryUsingPOST(data)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				this.grid.data = resp.data.data.content;
  				this.grid.data.forEach((item) => {
  					this.innerGrid.data[item.uuid] = [
  						{
  							roles: item.roles,
  							uuid: item.uuid,
  						},
  					];
  				});
  				console.log(this.innerGrid);
  			} else {
  				notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .userMaintain__block {
    margin: 0 0 20px 0 !important;
    padding: 30px 10%;
    line-height: 28px;
    border-radius: 10px;
  }
  .event__wrap {
    line-height: 28px;
    padding: 20px;
    @include rwd-sm {
      padding: 20px 70px;
    }
  }
  .content__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
	.table__wrap {
		overflow-x: scroll;
	}
  .query__wrap {
    background-color: #fff;
    padding: 8px 10px;
    width: 100%;
    border-radius: 4px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .btn__wrap {
    margin: 20px 0;
    button {
      max-width: 100%;
      width: 100px;
      @include rwd-lg {
        width: 200px;
      }
    }
  }
  ::v-deep {
    .ant-table-thead > tr > th {
      font-weight: bold;
    }
    .ant-form-item-required::before {
      display: none;
    }
    .ant-input, .mx-input {
      height: 40px;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
    .ant-table-expanded-row, .ant-table-expanded-row th, .ant-table-expanded-row:hover{
      background: #F5F8FC;
    }
  }
</style>
