<template>
  <div
    ref="accountAgent"
    class="container"
  >
    <div class="d-flex justify-content-between">
      <div class="page__title">
        代理人設定
      </div>
      <div class="pt-4">
        <IconTextButton
          text="建立代理事項"
          type="add"
          @click="openBuildModal"
        />
      </div>
    </div>
    <div
      class="form__container"
      :class="{'mb-0': query}"
    >
      <div class="form__container__title">
        代理紀錄查詢
      </div>
      <a-form-model
        ref="formRef"
        :model="form"
        :rules="formRules"
      >
        <div class="row form__option">
          <div class="col-6 col-xl-4">
            <div class="input__title">
              被代理人單位
            </div>
            <a-form-model-item prop="principalUnit">
              <a-select
                v-model="form.principalUnit"
                class="input__block"
                placeholder="e.g. VL000 職安管理部"
                :allow-clear="true"
                :options="selectOptions.units"
              />
            </a-form-model-item>
          </div>
          <div class="col-6 col-xl-4 mb-2">
            <div class="input__title">
              被代理人姓名
            </div>
            <a-form-model-item prop="principal">
              <a-select
                v-model="form.principal"
                class="input__block"
                placeholder="e.g. 林曉春"
                :allow-clear="true"
                :options="selectOptions.toAgentList"
              />
            </a-form-model-item>
          </div>
          <div class="col-12 col-xl-4">
            <div class="input__title">
              是否啟用
            </div>
            <a-form-model-item prop="enabled">
              <a-radio-group
                v-model="form.enabled"
                class="row"
              >
                <div class="col-4">
                  <a-radio
                    value="*"
                    class="radio__block"
                  >
                    全部
                  </a-radio>
                </div>
                <div class="col-4">
                  <a-radio
                    value="Y"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-4">
                  <a-radio
                    value="N"
                    class="radio__block"
                  >
                    否
                  </a-radio>
                </div>
              </a-radio-group>
            </a-form-model-item>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-xl-4">
            <div class="input__title">
              代理人單位
            </div>
            <a-form-model-item prop="agentUnit">
              <a-select
                v-model="form.agentUnit"
                class="input__block"
                :allow-clear="true"
                placeholder="e.g. VL000 職安管理部"
                :options="selectOptions.units"
              />
            </a-form-model-item>
          </div>
          <div class="col-6 col-xl-4 mb-2">
            <div class="input__title">
              代理人姓名
            </div>
            <a-form-model-item prop="agent">
              <a-select
                v-model="form.agent"
                class="input__block"
                placeholder="e.g. 林曉春"
                :allow-clear="true"
                :options="selectOptions.agentList"
              />
            </a-form-model-item>
          </div>
          <div class="col-6 col-xl-4">
            <div class="d-flex">
              <div class="input__title">
                代理時間起迄
              </div>
              <div class="mark-required">
                *
              </div>
            </div>
            <a-form-model-item prop="period">
              <date-picker
                v-model="form.period"
                :disabled-date="disableDate"
                show-time
                class="input__block"
                range
                :show-time-panel="showTimeRangePanel"
                :minute-step="30"
                type="datetime"
                :format="'YYYY/MM/DD HH:mm'"
                :formatter="formatter"
                :show-second="false"
                :clearable="true"
                :editable="false"
                :open.sync="isContactDatePickerOpen"
                @open="openContactDatesPicker"
              >
                <template v-slot:footer>
                  <a-space>
                    <a-button
                      type="primary"
                      size="small"
                      @click="toggleTimeRangePanel"
                    >
                      {{ showTimeRangePanel ? '選擇日期' : '選擇時間' }}
                      <!-- 選擇日期  選擇時間 -->
                    </a-button>
                    <!-- 確定 -->
                    <a-button
                      size="small"
                      type="primary"
                      @click="closeContactDatesPicker"
                    >
                      確定
                    </a-button>
                  </a-space>
                </template>
              </date-picker>
            </a-form-model-item>
          </div>
        </div>
      </a-form-model>
      <div class="button__wrap text-center">
        <button
          class="btn__radius--primary--outline mb-2"
          @click="reset"
        >
          重設
        </button>
        <button
          class="btn__radius--primary mb-2"
          @click="handleSearch"
        >
          查詢
        </button>
      </div>
    </div>
    <div
      v-if="query===true"
      class="result__block"
    >
      <div class="result__block__header d-flex justify-content-between">
        <div class="result__block__title">
          代理紀錄查詢結果
        </div>
        <div>
          <button
            v-if="gridData.data.length > 0"
            class="btn__radius--primary--outline--small"
            :disabled="!downloadEnabled"
            @click="download"
          >
            下載
          </button>
        </div>
      </div>
      <div class="table">
        <FblDataGrid
          :row-key="gridData.rowKey"
          :columns="gridData.columns"
          :data="gridData.data"
          :pagination="gridData.pagination"
          :empty-data="gridData.data.length <= 0"
          :scroll="{ x: true }"
          @tableChange="handleTableChange"
        >
          <template v-slot:toUnitDisplay="slotProps">
            <!-- <div>{{ slotProps.data.principalUnit.departmentId }}</div> -->
            <div>{{ slotProps.data.principalUnit.departmentName }}</div>
          </template>
          <template v-slot:unitDisplay="slotProps">
            <!-- <div>{{ slotProps.data.agentUnit.departmentId }}</div> -->
            <div>{{ slotProps.data.agentUnit.departmentName }}</div>
          </template>
          <template v-slot:enabled="slotProps">
            <CustomPopConfirm
              :disabled="!canEdit(slotProps.data)"
              title="確定提早結束代理人設定？"
              @confirm="getApi_closeRecordInAccountAgent(slotProps.data.accountAgentId)"
            >
              <div :class="{'datalink': canEdit(slotProps.data)}">
                {{ slotProps.data.enabled.keyId === 'Y' ? '是' : '否' }}
              </div>
            </CustomPopConfirm>
          </template>
          <template v-slot:edit="slotProps">
            <div
              class="d-flex justify-content-center edit__block"
              :class="{'disabled__block': !canEdit(slotProps.data)}"
            >
              <button
                class="d-flex justify-content-center align-items-center iconblock"
                :disabled="!canEdit(slotProps.data)"
                @click="openEditModal(slotProps.data.accountAgentId)"
              >
                <a-icon
                  type="edit"
                />
              </button>
            </div>
          </template>
        </FblDataGrid>
      </div>
    </div>
    <BuildAgentModal
      :visible.sync="buildModalVisible"
    />
    <EditAgentModal
      :visible.sync="editModalVisible"
      :edit-modal-account-agent-id="editModalAccountAgentId"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import FblDataGrid from '@/components/shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
// import { AgentQueryDto } from '@fubonlife/oss-api-axios-sdk';
import BuildAgentModal from '@admin/account-agent/BuildAgentModal.vue';
import EditAgentModal from '@admin/account-agent/EditAgentModal.vue';
import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';
import CustomPopConfirm from '@shared/CustomPopConfirm.vue';
import IconTextButton from '@/components/shared/button/IconTextButton.vue';
import moment from 'moment';

const modalControl = namespace('modalControl');

@Component({
	components: {
		FblDataGrid,
		BuildAgentModal,
		EditAgentModal,
		IconTextButton,
		CustomPopConfirm,
	},
})
export default class AccountAgentIndex extends Vue {
	@Action('setLoading') setLoading;

	@modalControl.Action('setModalState') setModalState;

	// 時間format格式
  formatter = this.$twDateTimeFormatter;

	curRole: string = '0';

	// 當前角色
  currentRoleId = null;

  // 當前角色單位
  currentRoleUnit = null;

	// 查詢結果顯示
	query = false;

	// 建立代理人 modal 顯示
	buildModalVisible = false;

	// 編輯代理人 modal 顯示
	editModalVisible = false;

	editModalAccountAgentId = '';

	// 查無資料則不提供下載功能
	downloadEnabled = true;

	// 編輯彈窗 API 輸入
	agentId: number = 0;

	selectOptions = {
		units: [],	// 單位清單
		toAgentList: [],	// 被代理人清單
		agentList: [],	// 代理人清單
	}

	form = {
		agent: undefined,
		agentUnit: undefined,
		enabled: '*',
		principal: undefined,
		principalUnit: undefined,
		period: null,
	}

	downloadSearchData = null;

	formRules: { [key: string]: ValidationRule[] } = {
  	period: [{
			required: true,
			message: '請選擇代理時間',
			trigger: 'change',
			validator: (rule, value) => value.every((i) => i),
		}],
	};

	gridData = {
		rowKey: 'accountAgentId',
		data: [],
		pagination: {
  		size: 'small',
  		current: 1,
  		pageSize: 10,
  		total: 0,
  		pageSizeOptions: ['10', '25', '50'],
  		showSizeChanger: true,
  		showTotal: (total, range) => `顯示${range[0]}-${range[1]}筆 共${total}筆`,
  	},
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'principal',
				title: '被代理人姓名',
				fixed: 'left',
				formatter: (data) => data.principal.name,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'toUnitDisplay',
				title: '被代理人單位',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'agent',
				title: '代理人姓名',
				formatter: (data) => data.agent.name,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'unitDisplay',
				title: '代理人單位',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'startDatetime',
				title: '代理起始時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'endDatetime',
				title: '代理結束時間',
				width: 130,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'enabled',
				title: '是否啟用',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'createUser',
				title: '建立人員',
				formatter: (data) => data.createUser.name,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'createDatetime',
				title: '建立時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updateUser',
				title: '異動人員',
				formatter: (data) => data.updateUser.name,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updateDatetime',
				title: '異動時間',
				width: 130,
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'edit',
				fixed: 'right',
			},
		],
	}

	showTimeRangePanel = false;

	isContactDatePickerOpen = false;

	/**
	 * Function
	 */
	disableDate(current, dates) {
		if (dates[0]) {
			const date = DateTimeFormmat.isValidDate(dates[0]);
			if ((dates[0] && dates[1])) {
				return false;
			}
			return (
				current && (current < moment(date).subtract(365, 'd') || current > moment(date).add(365, 'd'))
			);
		}
		return false;
	}

	toggleTimeRangePanel() {
		this.showTimeRangePanel = !this.showTimeRangePanel;
	}

	openContactDatesPicker() {
		this.closeContactDatesPicker();
		this.isContactDatePickerOpen = !this.isContactDatePickerOpen;
	}

	closeContactDatesPicker() {
		this.isContactDatePickerOpen = false;
	}

	canEdit({
		endDatetime, principal, enabled, updateUser,
	}) {
		// 異動人員 或 被代理人 為自己 則可編輯
		// 時間未到期
		const timeNotOver = DateTimeFormmat.isValidDate(DateTimeFormmat.transformMinguoDateTime(endDatetime)) >= moment().toDate();
		// 被代理人 或 建立人員 為自己
		const isPrincipal = [principal.domainId, updateUser.domainId].includes(this.$user.getMe().employee.domainId);
		// 可否編輯
		const isEnabled = enabled.keyId === 'Y';
		return timeNotOver && isPrincipal && isEnabled;
	}

	/**
	 * API
	 */
	// API: 獲取單位清單 UnitList
	getApi_searchAgentDeptList() {
		this.$accountAgentApi.searchAgentDeptListInAccountAgentUsingPOST()
			.then((resp) => {
				const getData = resp.data.result;
				this.selectOptions.units = getData.map((i) => ({ value: i.value, label: i.label }));
			})
			.catch((error) => {
				console.log('Error:', error);
				this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '查詢失敗',
						content: error.response.data.message,
  				},
  			});
			});
	}

	// API: 獲取代理人清單 agentList
	getApi_searchAgentList(unit) {
		const searchData = {
			departmentId: unit,
			whichDB: this.$user.getMe().employee.whichDB,
		};
		return this.$accountAgentApi.searchAgentListInAccountAgentUsingPOST(searchData)
			.then((resp) => {
				const getData = resp.data.result;
				return getData.filter((i) => i.value !== null).map((i) => ({ label: i.label, value: i.value }));
			})
			.catch();
	}

	// API: 代理人記錄查詢
	getApi_searchRecordListInAccountAgent() {
		this.setLoading(true);

		this.query = true;
		// 獲取輸入參數
		const submitData = {
			agent: this.form.agent,
			agentUnit: this.form.agentUnit,
			enabled: this.form.enabled,
			endDatetime: moment(this.form.period[1]).format('YYYY-MM-DD HH:mm'),
			pageIndex: this.gridData.pagination.current - 1,
			pageSize: this.gridData.pagination.pageSize,
			principal: this.form.principal,
			principalUnit: this.form.principalUnit,
			startDatetime: moment(this.form.period[0]).format('YYYY-MM-DD HH:mm'),
		};

		// 回傳查詢結果
		this.$accountAgentApi.searchRecordListInAccountAgentUsingPOST(submitData)
			.then((resp) => {
				const getData = resp.data.result;
				this.gridData.data = getData.content;
				this.downloadSearchData = {
					agent: this.form.agent,
					agentUnit: this.form.agentUnit,
					enabled: this.form.enabled,
					endDatetime: moment(this.form.period[1]).format('YYYY-MM-DD HH:mm'),
					principal: this.form.principal,
					principalUnit: this.form.principalUnit,
					startDatetime: moment(this.form.period[0]).format('YYYY-MM-DD HH:mm'),
				};
			})
			.catch((error) => {
				console.log('Error:', error);
				this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '查詢失敗',
						content: error.response.data.message,
  				},
  			});
			})
			.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 結束代理
	getApi_closeRecordInAccountAgent(accountAgentId) {
		this.setLoading(true);
		this.$accountAgentApi.closeRecordInAccountAgentUsingPOST(accountAgentId)
			.then((resp) => {
				this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'success',
  					title: '結束代理成功',
  					autoClose: 3,
  				},
  			});
				this.getApi_searchRecordListInAccountAgent();
			})
			.catch((error) => {
				// console.log('Error:', error);
				this.setModalState({
  				resultModal: {
  					visible: true,
  					type: 'error',
  					title: '結束代理失敗',
  				},
  			});
			})
			.finally(() => {
  			this.setLoading(false);
  		});
	}

	// API: 下載 代理人記錄查詢結果
	getApi_download() {
		this.setLoading(true);
		this.$accountAgentApi.downloadRecordListInAccountAgentUsingPOST(this.downloadSearchData, { responseType: 'blob' })
			.then((resp) => {
				this.$blobUtils.downloadFile(resp, `代理人紀錄_${moment().format('YYYYMMDD_HHmmss')}`);
			})
			.catch((error) => {
				console.log('Error:', error);
			})
			.finally(() => {
  			this.setLoading(false);
  		});
	}

	openBuildModal() {
	// 	if (this.curRole === '1') {
	// 		this.$infoNotification.error({
	// 			content: '權限不足。',
	// 		});
	// 	} else {
		this.buildModalVisible = true;
	// 	}
	}

	// 載入編輯資料
	openEditModal(info) {
		// if (this.curRole === '1') {
		// 	this.$infoNotification.error({
		// 		content: '權限不足。',
		// 	});
		// } else {
		// 	this.agentId = info;
		this.editModalAccountAgentId = info;
		this.editModalVisible = true;
		// }
	}

	/**
	 * Event
	 */
	// 代理人記錄查詢
	search() {
		(this.$refs.formRef as any).validate((valid) => {
			if (valid) {
				this.getApi_searchRecordListInAccountAgent();
			}
		});
	}

	// table pagination改變
	handleTableChange(e) {
  	this.gridData.pagination.current = e.pagination.current;
  	this.gridData.pagination.pageSize = e.pagination.pageSize;
  	this.getApi_searchRecordListInAccountAgent();
	}

	reset() {
		this.query = false;
		this.form = {
			agent: undefined,
			agentUnit: undefined,
			enabled: '*',
			principal: undefined,
			principalUnit: undefined,
			period: null,
		};

		// 預設
		const defaultStartTime = new Date(moment(new Date()).minute(0).format());
		const defaultEndTime = new Date(moment(new Date()).add(1, 'd').minute(0).format());

		this.form.period = [defaultStartTime, defaultEndTime];
		this.downloadSearchData = null;
	}

	handleSearch() {
		// if (this.curRole === '1') {
		// 	this.$infoNotification.error({
		// 		content: '權限不足。',
		// 	});
		// } else {
		this.search();
		// }
	}

	download() {
		this.getApi_download();
	}

	/**
	 * Hook
	 */
	created() {
		this.getApi_searchAgentDeptList();
	}

	mounted() {
		this.currentRoleId = this.$global.getCurrentRoleId();

		// 查核人員 須設定 預設值，並disabled
		// this.currentRoleUnit = this.$global.getCurrentRole().roleUnits[0].auditorTeamCode;
		// if (this.currentRoleId === 'ROLE_Auditor') {
		// 	this.form.principalUnit = this.currentRoleUnit;
		// 	this.form.agentUnit = this.currentRoleUnit;
		// }
		this.reset();
		this.getApi_searchRecordListInAccountAgent();
	}

	/**
	 * 監聽
	 */
	// 切換 被代理人單位
	@Watch('form.principalUnit')
	async watchToUnit(nV) {
		this.form.principal = undefined;
		if (nV) {
			this.selectOptions.toAgentList = await this.getApi_searchAgentList(nV);
		}
	}

	// 切換 代理人單位
	@Watch('form.agentUnit')
	async watchUnit(nV) {
		this.form.agent = undefined;
		if (nV) {
			this.selectOptions.agentList = await this.getApi_searchAgentList(nV);
		}
	}
}
</script>

<style lang="scss" scoped>
  .form__container {
    background-color: $BS-COLOR-MAIN10;
    border-radius: 10px;
    padding: 30px (92/1088)*100%;
    margin-bottom: 40px;
  }
  .form__container__title {
    font-size: 24px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 30px;
  }
  .input__title {
    font-size: 16px;
    font-weight: $BS-TEXT-BOLD;
    margin-bottom: 10px;
  }
  .input__block {
    width: 100%;
  }
  .form__option {
    margin-bottom: 12px;
  }
  .button__wrap {
    margin-top: 22px;
    button {
      width: 200px;
      max-width: 100%;
      margin-right: 5px;
    }
  }
  .result__block {
    margin-top: 30px;
    .result__block__header {
      margin-bottom: 20px;
      .result__block__title {
        font-size: 24px;
        font-weight: $BS-TEXT-BOLD;
      }
    }
  }
  .edit__block {
    button {
      border: 0px;
      cursor: pointer;
    }
  }
  .table {
    margin-bottom: 40px;
  }
  ::v-deep{
    .ant-form-item {
      margin: 0px;
    }
    .ant-select-selection__rendered {
      line-height: 42px;
    }
    .ant-select-selection {
      height: 42px;
    }
    .ant-input {
      height: 42px;
    }
    .mx-input {
      height: 42px;
    }
    .iconblock{
      width: 46px;
      height: 32px;
      background-color: $BS-COLOR-MAIN10;
      border-radius: 16px;
      color: $BS-COLOR-MAIN1;
      .anticon svg {
        font-size: 20px;
      }
    }
    .disabled__block{
      .anticon svg {
        font-size: 20px;
        color: grey;
      }
      button {
        cursor: not-allowed;
      }
    }
  }
	.datalink{
		color: #4CAAF5;
		text-decoration: none;
		background-color: transparent;
		outline: none;
		cursor: pointer;
		transition: color 0.3s;
		&:hover{
		color: #78c7ff;
		}
	}
</style>
