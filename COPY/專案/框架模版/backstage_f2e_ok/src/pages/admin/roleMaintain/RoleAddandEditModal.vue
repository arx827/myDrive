<template>
  <div>
    <!-- Modal -->
    <a-modal
      v-model="visibleSync"
      class="common__modal fubon-backStage_modal"
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
        :hide-required-mark="true"
        :colon="false"
        :rules="formRules"
      >
        <div class="modal-container">
          <div class="modal-container__title">
            {{ type === 'edit' ? '編輯' : '新增' }}角色
          </div>
          <div class="modal-container__event__block mb-0">
            <div class="option__block">
              <a-form-model-item
                prop="roleName"
                :rules="formRules.roleName"
              >
                <span slot="label">
                  角色名稱 <div class="mark-required"> * </div>
                </span>
                <a-input
                  v-model="form.roleName"
                  class="input__block"
                  placeholder="e.g. 系統管理員"
                />
              </a-form-model-item>
            </div>
            <div class="option__block">
              <a-form-model-item
                prop="remark"
              >
                <span slot="label">
                  備註  <div class="mark-required__desc"> 字數上限100字 </div>
                </span>
                <a-textarea
                  v-model="form.remark"
                  placeholder="字數上限100字。"
                  :max-length="100"
                  :auto-size="{ minRows: 3 }"
                  size="large"
                />
              </a-form-model-item>
            </div>
            <a-form-model-item
              prop="enabled"
              :rules="formRules.enabled"
            >
              <span slot="label">
                是否啟用 <div class="mark-required"> * </div>
              </span>
              <a-radio-group
                v-model="form.enabled"
                class="row"
              >
                <div class="col-3">
                  <a-radio
                    value="1"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-3">
                  <a-radio
                    value="2"
                    class="radio__block"
                  >
                    否
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-model-item>
            <hr class="hr__line hr__line--margin">
            <a-form-model-item
              prop="menuSelectedRowKeys"
              :rules="formRules.menuSelectedRowKeys"
            >
              <span
                slot="label"
                class="d-flex justify-content-between"
              >
                <div class="input__title">
                  功能明細  <div class="mark-required">
                    *
                  </div>
                </div>
                <a-input-search
                  v-model="searchValue"
                  class="input__searchBar"
                  placeholder="你想查詢什麼 ?"
                  @search="onSearch"
                />
              </span>
              <a-table
                :row-key="gridData.rowKey"
                :row-selection="{ selectedRowKeys: form.menuSelectedRowKeys, onChange: onSelectChange }"
                :columns="gridData.columns"
                :data-source="gridData.data"
                :pagination="false"
                :scroll="{ x: false, y: 500 }"
              >
                <template
                  slot="menuName"
                  slot-scope="slotProps"
                >
                  <div>{{ slotProps.menuName }} ({{ slotProps.parentId }}/{{ slotProps.menuId }})</div>
                </template>
              </a-table>
            </a-form-model-item>
          </div>
          <div class="btn__wrap text-center">
            <button
              class="btn__radius--primary--outline mb-2"
              @click="onClose"
            >
              返回
            </button>
            <button
              class="btn__radius--primary mb-2"
              @click="submit"
            >
              送出覆核
            </button>
          </div>
        </div>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Watch, Prop, PropSync,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
// import { RoleCreateOrUpdateDto, RoleMenuDto } from '@fubonlife/oss-api-axios-sdk';

@Component({ components: {} })
export default class ViewNurseRecordModal extends Vue {
	@Action('setLoading') setLoading;

	@PropSync('visible')
	visibleSync: boolean;

	@Prop()
	type: string

	@Prop()
	editData;

	searchValue = '';

	form = {
		roleId: null,
		roleName: null,
		remark: null,
		enabled: null,
		menuSelectedRowKeys: [],
	}

	formRules = {
		roleName: [{ required: true, message: '請填入角色名稱' }],
		enabled: [{ required: true, message: '請選擇是否啟用' }],
	}

	respData = [];

	gridData = {
		rowKey: 'rowkey',
		data: [],
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

	@Watch('editData')
	onEditDataChange(val) {
		if (val) {
			const {
				roleId, roleName, remark, enabled, menus,
			} = val;
			Object.assign(this.form, {
				roleId,
				roleName,
				remark,
				enabled: (enabled === 'Y') ? '1' : '2',
			});
			menus.forEach((el) => {
				const rowkey = this.gridData.data.find((c) => c.menuId === el.menuId)?.rowkey;
				if (rowkey) {
					this.form.menuSelectedRowKeys.push(rowkey);
				}
			});
		}
	}

	// API: 1.2.32.	查詢所有選單選項
	fetchMenuOpts() {
		// TEST:
		const TESTDATA = [
			{
				menuId: 'RelevantScaleIndex',
				menuName: '相關量表填寫',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'StrangeEventMaintainIndex',
				menuName: '活動內容維護',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'BuildOverTimeIndex',
				menuName: '建立加班人員名單',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'QueryOverTimeIndex',
				menuName: '員工名單查詢',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'DownLoadReportIndex',
				menuName: '報表查詢下載',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'StrangeMyRecordIndex',
				menuName: '我的填寫紀錄',
				parentId: 'AbnormalLoad',
				parentName: '異常負荷預防',
			},
			{
				menuId: 'RelevantSurveyIndex',
				menuName: '相關問卷填寫',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'EHEventMaintainIndex',
				menuName: '活動內容維護',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'BuildDataIndex',
				menuName: '建立人因危害資料',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'QueryDataIndex',
				menuName: '人因危害資料查詢',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'ReportDownLoadIndex',
				menuName: '報表查詢下載',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'ErMyRecordIndex',
				menuName: '我的填寫紀錄',
				parentId: 'ErgonomicHazard',
				parentName: '人因危害預防',
			},
			{
				menuId: 'HealthPromoteIndex',
				menuName: '健康促進服務',
				parentId: 'HealthAct',
				parentName: '推動健康促進',
			},
			{
				menuId: 'MyRegistrationIndex',
				menuName: '我的報名',
				parentId: 'HealthAct',
				parentName: '推動健康促進',
			},
			{
				menuId: 'EventAndTimeMaintainIndex',
				menuName: '活動與場次維護',
				parentId: 'HealthAct',
				parentName: '推動健康促進',
			},
			{
				menuId: 'SatisfyQuestMaintainIndex',
				menuName: '滿意度問卷維護',
				parentId: 'HealthAct',
				parentName: '推動健康促進',
			},
			{
				menuId: 'MyHealthReportIndex',
				menuName: '我的健檢資訊',
				parentId: 'HealthCheck',
				parentName: '健康快e通',
			},
			{
				menuId: 'EmpHealthReportList',
				menuName: '建立員工健檢資料',
				parentId: 'HealthCheck',
				parentName: '健康快e通',
			},
			{
				menuId: 'HealthValueMaintainList',
				menuName: '健檢數值維護',
				parentId: 'HealthCheck',
				parentName: '健康快e通',
			},
			{
				menuId: 'NotificationAndRecordQuery',
				menuName: '衛教通知發送',
				parentId: 'HealthCheck',
				parentName: '健康快e通',
			},
			{
				menuId: 'EmpHealthDataExportQuery',
				menuName: '員工健檢資料匯出',
				parentId: 'HealthCheck',
				parentName: '健康快e通',
			},
			{
				menuId: 'EventContentMaintainIndex',
				menuName: '活動內容維護',
				parentId: 'MaternalProtect',
				parentName: '母性健康保護',
			},
			{
				menuId: 'MonthMaintainIndex',
				menuName: '當月維護',
				parentId: 'MaternalProtect',
				parentName: '母性健康保護',
			},
			{
				menuId: 'YearReportIndex',
				menuName: '年度紀錄與報表',
				parentId: 'MaternalProtect',
				parentName: '母性健康保護',
			},
			{
				menuId: 'MotherPlanIndex',
				menuName: '母性健康計畫',
				parentId: 'MaternalProtect',
				parentName: '母性健康保護',
			},
			{
				menuId: 'MotherMyRecordIndex',
				menuName: '我的填寫紀錄',
				parentId: 'MaternalProtect',
				parentName: '母性健康保護',
			},
			{
				menuId: 'HealthEduMaintainIndex',
				menuName: '通知內容維護',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'CaseMaintainIndex',
				menuName: '個案維護',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'NurseLoginRecordIndex',
				menuName: '登入紀錄',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'LoginCheckWorkIndex',
				menuName: '登入覆核作業',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'AgentSettingIndex',
				menuName: '代理人設定',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'RoleMaintainIndex',
				menuName: '角色維護',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'ParamMaintainIndex',
				menuName: '參數維護',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'UserMaintainIndex',
				menuName: '使用者維護',
				parentId: 'Other',
				parentName: '其他',
			},
			{
				menuId: 'DoctorConsultIndex',
				menuName: '醫師諮詢服務',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
			{
				menuId: 'MyReservationIndex',
				menuName: '我的預約',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
			{
				menuId: 'EventMaintainIndex',
				menuName: '活動資訊設定',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
			{
				menuId: 'ServiceTimeMaintainIndex',
				menuName: '服務場次管理',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
			{
				menuId: 'SendNoticeModifyReserveIndex',
				menuName: '發送通知與修改預約',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
			{
				menuId: 'MedicalStaffDataIndex',
				menuName: '醫護人員資料維護',
				parentId: 'PhyConsult',
				parentName: '醫師諮詢服務',
			},
		];
		const respData = JSON.parse(JSON.stringify(TESTDATA));
		this.gridData.data = respData && respData.map((item, index) => ({ rowkey: index + 1, ...item }));
		this.respData = this.gridData.data;
		// this.setLoading(true);
		// this.$AdminControlAdminApi.queryMenuOptionsUsingPOST()
		// 	.then((resp) => {
		// 		// console.log(resp);
		// 		if (resp.data.status === 200) {
		// 			const respData = JSON.parse(JSON.stringify(resp.data.data));
		// 			this.gridData.data = respData && respData.map((item, index) => ({ rowkey: index + 1, ...item }));
		// 			this.respData = this.gridData.data;
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		console.log('error status = ', error);
		// 	})
		// 	.finally(() => {
		// 		this.setLoading(false);
		// 	});
	}

	// API: 1.2.25.	新增角色API(送出覆核)
	fetchCreateRole() {
		const $form = this.mapToCreateForm();
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.createRoleUsingPOST($form)
	//   	.then((resp) => {
	// 			// console.log(resp);
	// 			this.$global.changeRouterAndaddParam({
	// 				toRouter: 'RoleMaintainResult',
	// 				params: { type: 'add' },
	// 				query: {
	// 					result: (resp.data.status === 200) ? 'success' : 'fail',
	// 					msg: (resp.data.status !== 200) && this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 				},
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	// API: 1.2.26.	修改角色API(送出覆核)
	fetchUpdateRole() {
		const $form = this.mapToCreateForm();
	// 	this.setLoading(true);
	// 	this.$AdminControlAdminApi.updateRoleUsingPOST($form)
	// 		.then((resp) => {
	// 			// console.log(resp);
	// 			this.$global.changeRouterAndaddParam({
	// 				toRouter: 'RoleMaintainResult',
	// 				params: { type: 'edit' },
	// 				query: {
	// 					result: (resp.data.status === 200) ? 'success' : 'fail',
	// 					msg: (resp.data.status !== 200) && this.$global.getApiErrorMsg(resp.data.apiError).join(''),
	// 				},
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			console.log('error status = ', error);
	// 		})
	// 		.finally(() => {
	// 			this.setLoading(false);
	// 		});
	}

	onClose() {
		this.visibleSync = false;
		this.reset();
	}

	reset() {
		this.form = {
			roleId: null,
			roleName: null,
			remark: null,
			enabled: null,
			menuSelectedRowKeys: [],
		};
		(this.$refs.formRef as any).resetFields();
	}

	mapToCreateForm() {
		const {
			roleId, enabled, menuSelectedRowKeys, ...other
		} = this.form;
		const roleMenuDtoList = [];
		menuSelectedRowKeys.forEach((e) => {
			const findItem = this.gridData.data.find((c) => c.rowkey === e);
			roleMenuDtoList.push({
				menuId: findItem.menuId,
				menuName: findItem.menuName,
				parentId: findItem.parentId,
				parentName: findItem.parentName,
			});
		});
		return {
			roleId,
			enabled: (enabled === '1') ? 'Y' : 'N',
			roleMenuDtoList,
			...other,
		};
	}

	onSearch() {
		if (!this.searchValue || this.searchValue === '') {
			this.gridData.data = this.respData;
		} else {
			// 搜尋是否有符合字串 用column來搜尋
			const searchArray = [];
			const filterData = [];
			const regx = new RegExp(this.searchValue);
			this.gridData.columns.forEach((item) => {
				searchArray.push(item.dataIndex);
			});
			this.respData.forEach((item) => {
				let include = false;
				searchArray.forEach((key) => {
					if (regx.test(item[key])) {
						include = true;
					}
				});
				if (include) {
					filterData.push(item);
				}
			});
			this.gridData.data = filterData;
		}
	}

	onSelectChange(selectedRowKeys) {
		this.form.menuSelectedRowKeys = selectedRowKeys;
	}

	submit() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				switch (this.type) {
				case 'add':
					this.fetchCreateRole();
					break;
				case 'edit':
					this.fetchUpdateRole();
					break;
				default:
					break;
				}
			} else {
				const getErrorEle = this.$el.querySelector('.has-error');
				if (getErrorEle) {
					getErrorEle.scrollIntoView({ block: 'center', inline: 'nearest' });
				}
				return false;
			}
		});
	}

	created() {
		this.fetchMenuOpts();
	}
}
</script>

<style lang="scss" scoped>
	.btn__wrap {
    margin-top: 40px;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
	}
  .modal-container {
    padding-top: 6px;
    .modal-container__title {
      margin-bottom: 20px;
      font-size: 30px;
      font-weight: $BS-TEXT-BOLD;
    }
		.modal-container__event__block {
			background-color: $BS-COLOR-MAIN10;
			border-radius: 10px;
			width: 100%;
			// margin-bottom: 20px;
			padding-top: 40px;
			padding-bottom: 30px;
			padding-left: (92/1088)*100%;
			padding-right: (92/1088)*100%;
      .modal-container__event__block__title {
        font-size: 20px;
        font-weight: $BS-TEXT-BOLD;
        margin-bottom: 20px;
      }
      .modal-container__event__block__option {
        font-size: 16px;
        margin-bottom: 20px;
        .modal-container__event__block__option__title {
          margin-bottom: 10px;
          font-weight: $BS-TEXT-BOLD;
        }
      }
		}
    .input__block {
      width: 100%
    }
  }
  .input__title {
    margin-bottom: 10px;
    font-weight: $BS-TEXT-BOLD;
  }
  .mark-required {
    color: $BS-ERROR-COLOR;
    margin-left: 5px;
  }
  .mark-required__desc {
    color: #999999;
    font-weight: 400;
    font-size: 14px;
    float: right;
  }
  .option__block {
    margin-bottom: 20px;
  }
  .hr__line--margin {
    margin-top: 30px;
    margin-bottom: 40px;
  }
  .table--scroll {
    overflow-x: auto;
  }
  .table__searchbar {
    margin-bottom: 10px;
  }
  .input__searchBar {
    width: 30%;
  }
  ::v-deep {
    .ant-input {
      height: 42px;
    }
    .ant-form-item {
      margin: 0px;
    }
    .mx-input {
      height: 42px;
    }
    .ant-table-header-column {
      font-weight: 900;
    }
    .ant-table-thead > tr >th {
      background-color: $BS-COLOR-MAIN1;
      color: white;
    }
    .ant-table-body {
      border-radius: 4px 4px 0px 0px;
    }
    .ant-table-hide-scrollbar {
      margin-right: -15px;
    }
    .ant-table-scroll {
      border-radius: 4px 4px 0px 0px;
    }
    .ant-form-item-label {
      text-align: left;
      width: 100%;
    }
    .ant-form-item-label > label.ant-form-item-no-colon::after {
      display: none;
    }
  }
</style>
