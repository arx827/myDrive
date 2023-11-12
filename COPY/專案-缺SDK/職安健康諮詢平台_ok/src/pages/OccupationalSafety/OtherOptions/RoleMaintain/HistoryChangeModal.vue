<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="modalVisible"
      class="common__modal"
      :mask-closable="false"
      :after-close="onClose"
      :footer="null"
      :width="'80%'"
      on-ok="handleOk"
    >
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <a-form-model
        ref="formRef"
        :model="form"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            歷史異動紀錄
          </div>
          <div class="modal-container__event__block">
            <div class="row option__block">
              <div class="col-xl-6 col-12 option__block__item ">
                <div class="input__title">
                  申請日期
                </div>
                <a-form-model-item
                  prop="applyRange"
                >
                  <date-picker
                    v-model="form.applyRange"
                    placeholder="e.g. 2022/01/01～2022/02/01"
                    type="date"
                    :range="true"
                    :format="'YYYY/MM/DD'"
                    class="input__block"
                  />
                </a-form-model-item>
              </div>
              <div class="col-xl-6 col-12">
                <div class="input__title">
                  覆核狀態
                </div>
                <a-form-model-item
                  prop="reviewStatus"
                >
                  <a-radio-group
                    v-model="form.reviewStatus"
                    :default-value="form.reviewStatus"
                    class="row"
                  >
                    <div class="col-4">
                      <a-radio
                        :value="3"
                        class="radio__block"
                      >
                        全部(預)
                      </a-radio>
                    </div>
                    <div class="col-4">
                      <a-radio
                        :value="1"
                        class="radio__block"
                      >
                        同意
                      </a-radio>
                    </div>
                    <div class="col-4">
                      <a-radio
                        :value="2"
                        class="radio__block"
                      >
                        退回
                      </a-radio>
                    </div>
                  </a-radio-group>
                </a-form-model-item>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="input__title">
                  角色名稱
                </div>
                <a-form-model-item
                  prop="roleIdList"
                >
                  <a-select
                    v-model="form.roleIdList"
                    mode="tags"
                    :show-arrow="true"
                    :allow-clear="true"
                    :options="rolesOpts"
                    :placeholder="' e.g. 系統管理員/主管/護理人員'"
                  />
                </a-form-model-item>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary--outline mb-2"
                @click="onClose"
              >
                取消
              </button>
              <button
                class="btn__radius--primary mb-2"
                @click="onSubmit"
              >
                查詢
              </button>
            </div>
          </div>
          <div
            v-if="gridData.data.length > 0"
            class="searchResult__block"
          >
            <div class=" searchResult__block__header d-flex justify-content-between align-items-center">
              <div class="searchResult__block__title">
                查詢結果
              </div>
              <button
                class="btn__radius--primary--outline--small"
                @click="download"
              >
                下載
              </button>
            </div>
            <div class="table--scroll">
              <div class="table">
                <a-table
                  :row-key="gridData.rowKey"
                  :columns="gridData.columns"
                  :data-source="gridData.data"
                  :pagination="false"
                  :empty-data="gridData.data.length <= 0"
                  class="components-table-demo-nested"
                >
                  <a-table
                    slot="expandedRowRender"
                    slot-scope="slotProps"
                    :row-key="innerGridData.rowKey"
                    :columns="innerGridData.columns"
                    :data-source="innerGridData.data[`roleId_${slotProps.uuid}`]"
                    :pagination="false"
                  >
                    <template
                      slot="menuName"
                      slot-scope="slotPropsChild"
                    >
                      <div>{{ slotPropsChild.menuName }} ({{ slotPropsChild.parentId }}/{{ slotPropsChild.menuId }})</div>
                    </template>
                  </a-table>
                </a-table>
              </div>
            </div>
            <div class="btn__wrap text-center">
              <button
                class="btn__radius--primary mb-2"
                @click="onClose"
              >
                返回
              </button>
            </div>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { FblColumnType } from '@/components/shared/data-grid/models';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { RoleChangeQueryDtoWithPage } from '@fubonlife/oss-api-axios-sdk';
import DataTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import moment from 'moment';

@Component({ components: { FblDataGrid } })
export default class ViewNurseRecordModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @Prop()
  visible: boolean

  modalVisible = false;

  rolesOpts = [];

  // 表單欄位資料
  form = {
  	applyRange: null,
  	reviewStatus: 3,
  	roleIdList: undefined,
  }

  @Watch('visible')
  onChange(val) {
  	this.modalVisible = val;
  }

  onClose() {
  	this.$emit('closeHistoryChangeModal');
  	this.form = {
  		applyRange: null,
  	  reviewStatus: 3,
  	  roleIdList: undefined,
  	};
  	this.gridData.data = [];
  }

  onSubmit() {
  	this.fetchQueryHistory();
  }

  download() {
  	this.fetchDownload();
  }

  // 父層 欄位資料
  gridData = {
  	rowKey: 'rowkey',
  	data: [],
  	columns: [
  		{
  			title: '角色名稱',
  			dataIndex: 'roleName',
  			key: 'roleName',
  			width: 120,
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
  			width: 130,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
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
  			width: 130,
  			customRender: (data) => ((data) ? moment(data).format('YYYY/MM/DD') : ''),
  		},
  		{
  			title: '覆核狀態',
  			dataIndex: 'proved',
  			key: 'proved',
  			width: 100,
  			customRender: (data) => ((data) ? this.$enum.getVal('reviewStatusEnum', data) : ''),
  		},
  		{
  			title: '退回原因',
  			dataIndex: 'reason',
  			key: 'reason',
  			width: 130,
  			customRender: (data) => ((data) || this.h('div', '--')),
  		},
  		{
  			title: '執行功能',
  			dataIndex: 'execAction',
  			key: 'execAction',
  			width: 100,
  			customRender: (data) => ((this.$enum.getVal('execActionEnum', data)) || this.h('div', '--')),
  		},
  	],
  }

  // 子層 欄位資料
  innerGridData = {
  	rowKey: 'rowkey',
  	data: {},
  	pagination: false,
  	columns: [
  		{
  			title: '模組名稱',
  			dataIndex: 'parentName',
  			key: 'parentName',
  			width: 200,
  		},
  		{
  			title: '功能名稱',
  			key: 'menuName',
  			scopedSlots: { customRender: 'menuName' },
  		},
  	],
  }

  getQueryForm(): RoleChangeQueryDtoWithPage {
  	const { applyRange, reviewStatus, roleIdList } = this.form;
  	const [startDt = null, endDt = null] = applyRange ? DataTimeFormmat.filterRangeDate(applyRange) : [];
  	return {
  		pageNo: 0,
  		pageSize: 100,
  		startDt,
  		endDt,
  		reviewStatus,
  		roleIdList: roleIdList && roleIdList.length === 0 ? null : roleIdList,
  	};
  }

  // API:1.2.31.	查詢角色選項
  fetchRolesOpts() {
  	this.setLoading(true);
  	this.$AdminControlAdminApi.queryRoleOptionsUsingPOST()
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status === 200) {
  				this.rolesOpts = JSON.parse(JSON.stringify(resp.data.data)).map((i) => ({ value: i.roleId, label: i.roleName }));
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 1.2.27.	查詢角色歷史異動紀錄
  fetchQueryHistory() {
  	const $form = this.getQueryForm();
  	this.setLoading(true);
  	this.$AdminControlAdminApi.queryRoleChangeHistoryUsingPOST($form)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.data) {
  				const content = JSON.parse(JSON.stringify(resp.data.data.content));
  				this.gridData.data = content.map((role, index) => {
  					const { menus, ...other } = role;
  					const innerData = menus.map((menu, index) => ({ rowkey: index + 1, ...menu }));
  					this.$set(this.innerGridData.data, `roleId_${role.uuid}`, innerData);
  					return { rowkey: index + 1, ...other };
  				});
  			} else {
  				const apiErrorMsg = JSON.parse(JSON.stringify(resp.data.apiError));
  				this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  				this.gridData.data = [];
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 1.2.28.	查詢角色歷史異動紀錄-下載
  fetchDownload() {
  	const $form = this.getQueryForm();
  	this.setLoading(true);
  	this.$AdminControlAdminApi.roleChangeHistoryDownloadUsingPOST($form, { responseType: 'blob' })
  		.then((resp) => {
  			// TEST:
  			console.log(resp);
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
  				this.$AdminControlAdminApi.roleChangeHistoryDownloadUsingPOST($form)
  					.then((resp) => {
  						const respData = JSON.stringify(resp);
  						const apiErrorMsg = JSON.parse(respData).data.apiError;
  						this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  					}).catch((error) => {
  						// TEST:
  						// console.log(error);
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

  created() {
  	this.fetchRolesOpts();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
    margin-bottom: 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    margin: 20px 0;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			// margin-bottom: 20px;
			padding-top: 40px;
			padding-bottom: 40px;
			padding-left: calc(92/1088*100%);
			padding-right: calc(92/1088*100%);
      .modal-container__event__block__title {
        font-size: 20px;
        font-weight: $TEXT-BOLD;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $TEXT-BOLD;
        }
      }
		}
    .radio__block {
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 4px;
      padding: 9px 12px;
    }
    .input__block {
      width: 100%
    }
    .searchResult__block {
      margin-top: 30px;
      .searchResult__block__header {
        margin-bottom: 20px;
      }
      .searchResult__block__title {
        font-size: 24px;
        font-weight: $TEXT-BOLD;
      }
    }
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $TEXT-BOLD;
  }
  .option__block {
    margin-bottom: 20px;
  }
  .option__block__item {
    margin-bottom: 20px;
    @include rwd-xl {
      margin-bottom: 0px;
    }
  }
  .table--scroll {
    overflow-x: auto;
  }
  ::v-deep {
    .ant-input, .ant-select-selection, .mx-input {
      height: 40px;
    }
    .ant-select-selection__rendered {
      line-height: 40px;
    }
    .ant-select-selection__rendered > ul > li {
      line-height: 31px;
      height: 31px;
    }
    .ant-form-item {
      margin: 0px;
    }
    .ant-table-header-column {
      font-weight: 900;
    }
    tr.ant-table-expanded-row td > .ant-table-wrapper {
      margin: -12px -16px -13px;
    }
  }
</style>
