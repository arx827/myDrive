<template>
  <div>
    <a-modal
      v-model="visibleSync"
      :mask-closable="false"
      :width="'90%'"
      :footer="null"
      class="adminModal fubon-backStage_modal"
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
                class="btn__radius--primary--outline mx-1 mb-2"
                @click="onClose"
              >
                取消
              </button>
              <button
                class="btn__radius--primary mx-1 mb-2"
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
	Vue, Component, Prop, Watch, PropSync,
} from 'vue-property-decorator';
import moment from 'moment';
import { Action } from 'vuex-class';

// @Component({ components: { FblDataGrid } })
@Component({})
export default class UserMaintainHistoryModal extends Vue {
  @Action('setLoading') setLoading;

  h = this.$createElement;

  @PropSync('visible')
  visibleSync!: boolean

  modalVisible = false;

  // @Watch('visible')
  // onChange(val) {
  // 	this.modalVisible = val;
  // }

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
  	// this.setLoading(true);
  	// const NewRangeDate = this.form.applyDate ? DateTimeFormmat.filterRangeDate(this.form.applyDate) : null;
  	// const data: UserChangeQueryDto = {
  	// 	name: this.form.name,
  	// 	startDt: NewRangeDate ? NewRangeDate[0] : null,
  	// 	endDt: NewRangeDate ? NewRangeDate[1] : null,
  	// 	adId: this.form.adNum,
  	// 	reviewStatus: this.form.status,
  	// };
  	// this.$AdminControlAdminApi.userChangeHistoryDownloadUsingPOST(data, { responseType: 'blob' })
  	// 	.then((resp) => {
  	// 		const disposition = resp.headers['content-disposition'];
  	// 		if (disposition) {
  	// 			let filename = '';
  	// 			if (disposition.indexOf('attachment') !== -1) {
  	// 				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  	// 				const matches = filenameRegex.exec(disposition);
  	// 				if (matches != null && matches[1]) {
  	// 					filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
  	// 				}
  	// 			}
  	// 			this.$blobUtils.download(
  	// 					resp.data as Blob,
  	// 					filename,
  	// 					resp.headers['content-type'],
  	// 			);
  	// 		} else {
  	// 			this.$AdminControlAdminApi.userChangeHistoryDownloadUsingPOST(data)
  	// 				.then((resp) => {
  	// 					const respData = JSON.stringify(resp);
  	// 					const apiErrorMsg = JSON.parse(respData).data.apiError;
  	// 					this.$infoNotification.error({ content: this.$global.getApiErrorMsg(apiErrorMsg).join('') });
  	// 				}).catch((error) => {
  	// 					console.log(error);
  	// 				}).finally(() => {
  	// 					this.setLoading(false);
  	// 				});
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
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
  	this.visibleSync = false;
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
  	// const NewRangeDate = this.form.applyDate ? DateTimeFormmat.filterRangeDate(this.form.applyDate) : null;
  	// const data: UserChangeQueryDtoWithPage = {
  	// 	name: this.form.name,
  	// 	startDt: NewRangeDate ? NewRangeDate[0] : null,
  	// 	endDt: NewRangeDate ? NewRangeDate[1] : null,
  	// 	adId: this.form.adNum,
  	// 	reviewStatus: this.form.status,
  	// 	pageNo: this.grid.pagination.current - 1,
  	// 	pageSize: this.grid.pagination.pageSize,
  	// };
  	// this.setLoading(true);
  	// this.$AdminControlAdminApi.queryUserChangeHistoryUsingPOST(data)
  	// 	.then((resp) => {
  	// 		if (resp.data.status === 200) {
  	// 			this.grid.data = resp.data.data.content;
  	// 			this.grid.data.forEach((item) => {
  	// 				this.innerGrid.data[item.uuid] = [
  	// 					{
  	// 						roles: item.roles,
  	// 						uuid: item.uuid,
  	// 					},
  	// 				];
  	// 			});
  	// 			console.log(this.innerGrid);
  	// 		} else {
  	// 			notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  	// 		}
  	// 	})
  	// 	.catch((error) => {
  	// 		console.log('error status = ', error);
  	// 	})
  	// 	.finally(() => {
  	// 		this.setLoading(false);
  	// 	});
  	this.grid.data = [
  		{
  			uuid: '077c0957-f277-4093-bb58-bb7bd4511b30',
  			adId: 'B1527',
  			name: '龍Ｘ瑜',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-07-27T10:41:18.890+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-07-27T10:46:51.333+0800',
  			proved: '2',
  			reason: 'ttest',
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '4',
  					roleName: '系統管理員',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '3',
  					roleName: '主管',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: '6d588551-8135-4871-86c4-611260818d23',
  			adId: 'B1895',
  			name: '楊Ｘ裕',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-07-27T10:42:37.980+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-07-27T10:43:44.423+0800',
  			proved: '2',
  			reason: 'test',
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '4',
  					roleName: '系統管理員',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '3',
  					roleName: '主管',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: '7a7de637-024d-4f65-8cb9-3fd96109e7d4',
  			adId: 'B1895',
  			name: '楊Ｘ裕',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-08-12T15:03:10.793+0800',
  			updName: null,
  			updDt: null,
  			proved: '0',
  			reason: null,
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '4',
  					roleName: '系統管理員',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '8',
  					roleName: '助產士',
  					remark: '協助護理師處理母性繼康保護事項',
  				},
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '9',
  					roleName: '行政助理',
  					remark: '協助醫護人員資料維護和活動資訊設定',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: '97812527-f644-4a84-90a4-89cb31ce0e7a',
  			adId: 'B0569',
  			name: '蕭Ｘ可',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-08-11T18:32:01.887+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-08-12T16:47:54.607+0800',
  			proved: '2',
  			reason: 'test',
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '4',
  					roleName: '系統管理員',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '3',
  					roleName: '主管',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: '97cb3c66-a510-49e1-8357-8927a14e3d90',
  			adId: 'B2023',
  			name: '陳Ｘ萱',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-08-15T17:21:11.063+0800',
  			updName: null,
  			updDt: null,
  			proved: '0',
  			reason: null,
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '7',
  					roleName: '測試12',
  					remark: '0812測試',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: 'a2868244-16d7-4dcd-9852-9ddef3dd3322',
  			adId: 'B1527',
  			name: '龍Ｘ瑜',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-07-25T12:54:52.817+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-07-25T12:57:06.017+0800',
  			proved: '2',
  			reason: '使用者對應角色不正確',
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '4',
  					roleName: '系統管理員',
  					remark: '負責系統管理維運',
  				},
  			],
  		},
  		{
  			uuid: 'aab71a7c-21e9-46f8-9efb-10d13fbe1d91',
  			adId: 'Y0039',
  			name: '彭Ｘ雁',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-07-26T11:36:52.687+0800',
  			updName: null,
  			updDt: null,
  			proved: '0',
  			reason: null,
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '3',
  					roleName: '主管',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: 'b98993bc-417b-4e9a-8e9c-77a6119b6eae',
  			adId: 'B2024',
  			name: '薛Ｘ丰',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-08-16T16:57:42.680+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-08-17T09:42:09.833+0800',
  			proved: '1',
  			reason: null,
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '5',
  					roleName: '系統管理員助理',
  					remark: null,
  				},
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: 'bd22cc91-32ad-4e93-8616-20b5e2cb85ef',
  			adId: 'B1527',
  			name: '龍Ｘ瑜',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-08-11T18:30:33.647+0800',
  			updName: null,
  			updDt: null,
  			proved: '0',
  			reason: null,
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '3',
  					roleName: '主管',
  					remark: '健康資源系統',
  				},
  			],
  		},
  		{
  			uuid: 'f1ae63a6-df3f-46e5-86ba-ec0b859c1e67',
  			adId: 'B1527',
  			name: '龍Ｘ瑜',
  			crtName: '蕭Ｘ可',
  			crtDt: '2022-07-22T20:02:57.713+0800',
  			updName: '楊Ｘ裕',
  			updDt: '2022-07-25T12:01:06.177+0800',
  			proved: '2',
  			reason: '選單不正確',
  			execAction: 'UPDATE',
  			roles: [
  				{
  					roleId: '2',
  					roleName: '護理師',
  					remark: '健康資源系統',
  				},
  				{
  					roleId: '1',
  					roleName: '員工',
  					remark: '健康資源系統',
  				},
  			],
  		},
  	];
  }

	// updated() {
	// 	// 難字
	// 	window.parseWord();
	// }
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
    @include bs-rwd-sm {
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
    .ant-table-expanded-row, .ant-table-expanded-row th, .ant-table-expanded-row:hover {
      background: #F5F8FC;
    }
  }
</style>
