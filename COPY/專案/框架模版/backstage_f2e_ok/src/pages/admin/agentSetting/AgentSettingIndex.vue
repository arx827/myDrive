<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        代理人設定
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          @click="openBuildModal"
        >
          建立代理事項
        </button>
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
      >
        <div class="row form__option">
          <div class="col-6 col-xl-4">
            <div class="input__title">
              被代理人單位
            </div>
            <a-form-model-item
              prop="toUnit"
            >
              <a-select
                v-model="form.toUnit"
                class="input__block"
                placeholder="e.g. VL000 職安管理部"
                :options="units"
              />
            </a-form-model-item>
          </div>
          <div class="col-6 col-xl-4 mb-2">
            <div class="input__title">
              被代理人姓名
            </div>
            <a-form-model-item prop="toName">
              <a-input
                v-model="form.toName"
                vue="true"
                alt="webfont"
                class="input__block"
                placeholder="e.g. 林曉春"
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
                :default-value="form.enabled"
              >
                <div class="col-4">
                  <a-radio class="radio__block">
                    全部
                  </a-radio>
                </div>
                <div class="col-4">
                  <a-radio
                    :value="true"
                    class="radio__block"
                  >
                    是
                  </a-radio>
                </div>
                <div class="col-4">
                  <a-radio
                    :value="false"
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
            <a-form-model-item prop="unit">
              <a-select
                v-model="form.unit"
                class="input__block"
                placeholder="e.g. VL000 職安管理部"
                :options="units"
              />
            </a-form-model-item>
          </div>
          <div class="col-6 col-xl-4 mb-2">
            <div class="input__title">
              代理人姓名
            </div>
            <a-form-model-item prop="name">
              <a-input
                v-model="form.name"
                vue="true"
                alt="webfont"
                class="input__block"
                placeholder="e.g. 林曉春"
              />
            </a-form-model-item>
          </div><div class="col-6 col-xl-4">
            <div class="input__title">
              代理時間起迄
            </div>
            <a-form-model-item prop="period">
              <date-picker
                v-model="form.period"
                class="input__block"
                :range="true"
                type="date"
                :format="'YYYY/MM/DD'"
              />
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
          :pagination="false"
          :empty-data="gridData.data.length <= 0"
          :scroll="{ x: true }"
        >
          <template v-slot:toUnitDisplay="slotProps">
            <div>{{ slotProps.data.toUnit.split(' ')[0] }}</div>
            <div>{{ slotProps.data.toUnit.split(' ').slice(1).join(' ') }}</div>
          </template>
          <template v-slot:unitDisplay="slotProps">
            <div>{{ slotProps.data.unit.split(' ')[0] }}</div>
            <div>{{ slotProps.data.unit.split(' ').slice(1).join(' ') }}</div>
          </template>
          <template v-slot:edit="slotProps">
            <div
              class="d-flex justify-content-center edit__block"
              :class="{'disabled__block': new Date(slotProps.data.endDt) < new Date()}"
            >
              <button
                class="d-flex justify-content-center align-items-center iconblock"
                :disabled="new Date(slotProps.data.endDt) < new Date()"
                @click="openEditModal(slotProps.data.agentId)"
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
      :agent-id="agentId"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import DateTimeFormmat from '@/plugins/backStagePlugins/DateTimeFormmat/dateTimeFormmat';
import FblDataGrid from '@shared/data-grid/FblDataGrid.vue';
import { FblColumnType } from '@/components/shared/data-grid/models';
import BuildAgentModal from '@admin/agentSetting/BuildAgentModal.vue';
import EditAgentModal from '@admin/agentSetting/EditAgentModal.vue';

@Component({
	components: {
		FblDataGrid,
		BuildAgentModal,
		EditAgentModal,
	},
})
export default class AgentSettingIndex extends Vue {
	// @Action('setLoading') setLoading;

	curRole: string = '0';

	$payLoad = null;

	// 查詢結果顯示
	query = false;

	// 建立代理人 modal 顯示
	buildModalVisible = false;

	// 編輯代理人 modal 顯示
	editModalVisible = false;

	// 查無資料則不提供下載功能
	downloadEnabled = true;

	// 編輯彈窗 API 輸入
	agentId: number = 0;

	// 代理人單位清單
	units = [];

	form = {
		toUnit: undefined,
		// toUserId: undefined,
		toName: undefined,
		enabled: undefined,
		unit: undefined,
		// userId: undefined,
		name: undefined,
		period: null,
	}

	reset() {
		this.query = false;
		this.form = {
			toUnit: undefined,
			toName: undefined,
			enabled: undefined,
			unit: undefined,
			name: undefined,
			period: null,
		};
	}

	gridData = {
		rowKey: 'agentId',
		data: [],
		columns: [
			{
				type: FblColumnType.PLAIN,
				property: 'toName',
				title: '被代理人姓名',
				fixed: 'left',
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'toUnitDisplay',
				title: '被代理人單位',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'name',
				title: '代理人姓名',
			},
			{
				type: FblColumnType.TEMPLATE,
				template: 'unitDisplay',
				title: '代理人單位',
				width: 150,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'startDt',
				title: '代理起始時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'endDt',
				title: '代理結束時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'enabled',
				title: '是否啟用',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtName',
				title: '建立人員',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'crtDt',
				title: '建立時間',
				width: 130,
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updName',
				title: '異動人員',
			},
			{
				type: FblColumnType.PLAIN,
				property: 'updDt',
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

	// // API: 獲取代理人單位清單 Dept (Unit?)
	// fetchUnits() {
	// 	this.$AdminControlManagerApi.agentDeptListUsingPOST()
	// 		.then((resp) => {
	// 			// console.log(resp);
	// 			const rawData = resp.data.data;
	// 			this.units = rawData.map((item) => {
	// 				const { deptCd, deptName, ...dto } = item;
	// 				return {
	// 					value: deptCd,
	// 					label: deptCd.concat(' ', deptName),
	// 					...dto,
	// 				};
	// 			});
	// 		})
	// 		.catch();
	// }

	// JSON -> 'yyyy/mm/dd hh:mm:ss'
	formatDatetime(datetime) {
		const parts = datetime.split('T');
		let dtDisplay = parts[0].replaceAll('-', '/');
		dtDisplay = dtDisplay.concat(' ', parts[1].split('.')[0]);
		return dtDisplay;
	}

	// DTO -> FblDataGrid (for search)
	toGridData(rawData) {
		this.gridData.data = rawData.content;
		this.gridData.data.forEach((object) => {
			const startDt = object.startDt; // 2022-07-15T14:58:07.687+0800
			object.startDt = startDt && this.formatDatetime(startDt); // 2022/07/15 14:58:07
			const endDt = object.endDt;
			object.endDt = endDt && this.formatDatetime(endDt);
			const crtDt = object.crtDt;
			object.crtDt = crtDt && this.formatDatetime(crtDt);
			const updDt = object.updDt;
			object.updDt = updDt && this.formatDatetime(updDt);
			object.unit = object.unit.concat(' ', object.unitDesc);
			object.toUnit = object.toUnit.concat(' ', object.toUnitDesc);
		});
		// console.log(this.gridData.data);
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

	// API: 代理人記錄查詢
	search() {
	// 	this.setLoading(true);

		this.query = true;
		// 獲取輸入參數
		this.$payLoad = {
			pageNo: 0,
			pageSize: 100,
			// -- 被代理人資訊 --
			// toUserId: 0,
			toUnit: this.form.toUnit,
			toName: this.form.toName,
			// -- 代理人資訊 --
			// userId: 0,
			unit: this.form.unit,
			name: this.form.name,
			// -- Misc --
			enabled: this.form.enabled,
			startDt: this.form.period && DateTimeFormmat.formatStringDateDault(this.form.period[0]),
			endDt: this.form.period && DateTimeFormmat.formatStringDateDault(this.form.period[1]),
			// sys: 0,
	  };

		// TEST:
		const TESTDATA = {
			content: [
				{
					agentId: 44,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 186583,
					name: '任Ｘ英',
					unit: 'VG801',
					unitDesc: '職安管理部 服務企劃科',
					startDt: '2022-09-12T00:00:00.000+0800',
					endDt: '2022-09-16T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-09-12T16:05:07.023+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-09-12T16:05:07.023+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 43,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 29,
					name: '張Ｘ茹',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-09-09T00:00:00.000+0800',
					endDt: '2022-09-10T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-09-08T13:31:58.187+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-09-08T13:31:58.187+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 42,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 186583,
					name: '任Ｘ英',
					unit: 'VG801',
					unitDesc: '職安管理部 服務企劃科',
					startDt: '2022-09-06T00:00:00.000+0800',
					endDt: '2022-09-11T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-09-06T11:57:43.897+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-09-06T11:57:43.897+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 41,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 28,
					name: '張Ｘ允',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-09-01T00:00:00.000+0800',
					endDt: '2022-09-04T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-24T16:54:23.087+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-24T17:05:08.723+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 40,
					toUserId: 7,
					toName: '楊Ｘ裕',
					toUnit: 'VG807',
					toUnitDesc: '職安管理部 庶務總務三科',
					userId: 1,
					name: '龍Ｘ瑜',
					unit: 'VLD03',
					unitDesc: '應用系統四部 企業服務系統科',
					startDt: '2022-10-22T00:00:00.000+0800',
					endDt: '2022-10-24T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-24T15:30:09.430+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-24T15:30:09.430+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 39,
					toUserId: 7,
					toName: '楊Ｘ裕',
					toUnit: 'VG807',
					toUnitDesc: '職安管理部 庶務總務三科',
					userId: 1,
					name: '龍Ｘ瑜',
					unit: 'VLD03',
					unitDesc: '應用系統四部 企業服務系統科',
					startDt: '2022-10-24T00:00:00.000+0800',
					endDt: '2022-10-31T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-24T15:15:12.500+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-24T15:15:12.500+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 38,
					toUserId: 7,
					toName: '楊Ｘ裕',
					toUnit: 'VG807',
					toUnitDesc: '職安管理部 庶務總務三科',
					userId: 33,
					name: '陳Ｘ茹',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-08-13T00:00:00.000+0800',
					endDt: '2022-09-20T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-12T17:36:07.897+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-12T17:36:07.897+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 37,
					toUserId: 28,
					toName: '張Ｘ允',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 29,
					name: '張Ｘ茹',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-08-12T00:00:00.000+0800',
					endDt: '2022-09-17T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-11T17:32:49.747+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-12T09:54:18.033+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 36,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-08-31T00:00:00.000+0800',
					endDt: '2022-09-04T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-11T16:31:32.530+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-11T17:44:09.307+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 35,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-08-12T00:00:00.000+0800',
					endDt: '2022-08-13T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-11T16:30:18.947+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-11T16:30:18.947+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 34,
					toUserId: 11,
					toName: '彭Ｘ雁',
					toUnit: 'VG806',
					toUnitDesc: '職安管理部 庶務總務二科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-08-15T00:00:00.000+0800',
					endDt: '2022-08-19T23:59:59.000+0800',
					enabled: '是',
					crtName: '楊Ｘ裕',
					crtDt: '2022-08-10T10:00:35.040+0800',
					updName: '楊Ｘ裕',
					updDt: '2022-08-10T10:00:35.040+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 33,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-08-05T00:00:00.000+0800',
					endDt: '2022-08-07T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-04T17:56:53.790+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-04T17:56:53.790+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 32,
					toUserId: 7,
					toName: '楊Ｘ裕',
					toUnit: 'VG807',
					toUnitDesc: '職安管理部 庶務總務三科',
					userId: 11,
					name: '彭Ｘ雁',
					unit: 'VG806',
					unitDesc: '職安管理部 庶務總務二科',
					startDt: '2022-10-12T00:00:00.000+0800',
					endDt: '2022-10-19T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-01T17:50:35.390+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-04T14:46:52.057+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 31,
					toUserId: 7,
					toName: '楊Ｘ裕',
					toUnit: 'VG807',
					toUnitDesc: '職安管理部 庶務總務三科',
					userId: 11,
					name: '彭Ｘ雁',
					unit: 'VG806',
					unitDesc: '職安管理部 庶務總務二科',
					startDt: '2022-08-05T00:00:00.000+0800',
					endDt: '2022-08-07T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-08-01T17:48:24.127+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-04T15:11:27.010+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 30,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 3,
					name: '蕭Ｘ可',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-08-30T00:00:00.000+0800',
					endDt: '2022-08-30T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T16:31:36.817+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-05T09:44:29.947+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 29,
					toUserId: 33,
					toName: '陳Ｘ茹',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 33,
					name: '陳Ｘ茹',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-07-30T00:00:00.000+0800',
					endDt: '2022-07-30T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T14:12:56.487+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-29T14:12:56.487+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 28,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 38,
					name: '許Ｘ綾',
					unit: 'VG809',
					unitDesc: '職安管理部 庶務總務五科',
					startDt: '2022-09-20T00:00:00.000+0800',
					endDt: '2022-09-23T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T11:17:40.657+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-05T10:31:31.077+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 27,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 38,
					name: '許Ｘ綾',
					unit: 'VG809',
					unitDesc: '職安管理部 庶務總務五科',
					startDt: '2022-08-20T00:00:00.000+0800',
					endDt: '2022-08-24T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T11:11:30.793+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-29T11:48:52.247+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 26,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 29,
					name: '張Ｘ茹',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-08-23T00:00:00.000+0800',
					endDt: '2022-08-23T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-29T10:27:51.867+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-29T10:27:51.867+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 25,
					toUserId: 13,
					toName: '戴Ｘ倩',
					toUnit: 'VG805',
					toUnitDesc: '職安管理部 庶務總務一科',
					userId: 39,
					name: 'Ｘ姍',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-07-29T00:00:00.000+0800',
					endDt: '2022-07-30T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-28T16:55:33.400+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-07-28T16:55:33.400+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 24,
					toUserId: 13,
					toName: '戴Ｘ倩',
					toUnit: 'VG805',
					toUnitDesc: '職安管理部 庶務總務一科',
					userId: 11,
					name: '彭Ｘ雁',
					unit: 'VG806',
					unitDesc: '職安管理部 庶務總務二科',
					startDt: '2022-10-01T00:00:00.000+0800',
					endDt: '2022-10-02T23:59:59.000+0800',
					enabled: '否',
					crtName: '蕭Ｘ可',
					crtDt: '2022-07-28T16:52:13.813+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-08-24T16:51:20.980+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 23,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 3,
					name: '蕭Ｘ可',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-07-01T00:00:00.000+0800',
					endDt: '2022-08-27T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-06-27T18:19:25.803+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-06-27T18:19:25.803+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 7,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 1,
					name: '龍Ｘ瑜',
					unit: 'VLD03',
					unitDesc: '應用系統四部 企業服務系統科',
					startDt: '2022-06-23T00:00:00.000+0800',
					endDt: '2022-06-27T23:59:59.000+0800',
					enabled: '是',
					crtName: '蕭Ｘ可',
					crtDt: '2022-06-23T14:42:07.997+0800',
					updName: '蕭Ｘ可',
					updDt: '2022-06-23T14:42:07.997+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 6,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 1,
					name: '龍Ｘ瑜',
					unit: 'VLD03',
					unitDesc: '應用系統四部 企業服務系統科',
					startDt: '2022-06-22T00:00:00.000+0800',
					endDt: '2022-06-22T23:59:59.000+0800',
					enabled: '是',
					crtName: '彭Ｘ雁',
					crtDt: '2022-06-19T21:53:35.867+0800',
					updName: '彭Ｘ雁',
					updDt: '2022-06-19T21:53:35.867+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 5,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-06-27T00:00:00.000+0800',
					endDt: '2022-06-30T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-06-20T21:35:04.233+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-06-21T00:37:56.307+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 4,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 3,
					name: '蕭Ｘ可',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-06-22T00:00:00.000+0800',
					endDt: '2022-06-23T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-06-20T21:34:40.030+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-06-21T00:53:17.667+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 3,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 3,
					name: '蕭Ｘ可',
					unit: 'VG804',
					unitDesc: '職安管理部 職安勤務科',
					startDt: '2022-06-24T00:00:00.000+0800',
					endDt: '2022-06-26T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-06-20T21:22:46.577+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-06-20T21:22:46.577+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 2,
					toUserId: 3,
					toName: '蕭Ｘ可',
					toUnit: 'VG804',
					toUnitDesc: '職安管理部 職安勤務科',
					userId: 1,
					name: '龍Ｘ瑜',
					unit: 'VLD03',
					unitDesc: '應用系統四部 企業服務系統科',
					startDt: '2022-06-18T00:00:00.000+0800',
					endDt: '2022-06-21T23:59:59.000+0800',
					enabled: '是',
					crtName: '彭Ｘ雁',
					crtDt: '2022-06-19T21:53:35.867+0800',
					updName: '彭Ｘ雁',
					updDt: '2022-06-19T21:53:35.867+0800',
					sysEnum: 'HRS',
				},
				{
					agentId: 1,
					toUserId: 1,
					toName: '龍Ｘ瑜',
					toUnit: 'VLD03',
					toUnitDesc: '應用系統四部 企業服務系統科',
					userId: 7,
					name: '楊Ｘ裕',
					unit: 'VG807',
					unitDesc: '職安管理部 庶務總務三科',
					startDt: '2022-06-18T00:00:00.000+0800',
					endDt: '2022-06-21T23:59:59.000+0800',
					enabled: '是',
					crtName: '龍Ｘ瑜',
					crtDt: '2022-06-19T21:53:35.867+0800',
					updName: '龍Ｘ瑜',
					updDt: '2022-06-19T21:53:35.867+0800',
					sysEnum: 'HRS',
				},
			],
			pageable: {
				sort: {
					sorted: false,
					unsorted: true,
				},
				pageSize: 100,
				pageNumber: 0,
				offset: '0',
				paged: true,
				unpaged: false,
			},
			last: true,
			totalPages: 1,
			totalElements: '29',
			sort: {
				sorted: false,
				unsorted: true,
			},
			numberOfElements: 29,
			first: true,
			size: 100,
			number: 0,
		};

		const rawData = TESTDATA;
		this.downloadEnabled = Number(rawData.totalElements) !== 0;
		if (rawData) {
			this.toGridData(rawData);
		}

		// 回傳查詢結果
		// 	this.$AdminControlManagerApi.agentRecordListUsingPOST(this.$payLoad)
		// 		.then((resp) => {
		// 			if (resp.data.status == 200) {
		// 				const rawData = resp.data.data;
		// 				this.downloadEnabled = Number(rawData.totalElements) !== 0;
		// 				if (rawData) {
		// 					this.toGridData(rawData);
		// 				}
		// 			} else {
		// 				this.$infoNotification.error({
		// 					content: '無法完成查詢項目，請再次嘗試。',
		// 					apiError: resp.data.apiError,
		// 				});
		// 			}
		// 		})
		// 		.catch((error) => {
		// 			console.log('Error:', error);
		// 		});

	// 	this.setLoading(false);
	}

	// API: 代理人記錄查詢結果-下載
	download() {
	// 	this.$AdminControlManagerApi.agentRecordListDownloadUsingPOST(this.$payLoad, { responseType: 'blob' })
	// 		.then((resp) => {
	// 			if (resp.status == 200) {
	// 				let filename = '';
	// 				const disposition = resp.headers['content-disposition'];
	// 				if (disposition) {
	// 					if (disposition.indexOf('attachment') !== -1) {
	// 						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
	// 						const matches = filenameRegex.exec(disposition);
	// 						if (matches != null && matches[1]) {
	// 							filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
	// 						}
	// 					}
	// 					this.$blobUtils.download(
	// 						resp.data as Blob,
	// 						filename,
	// 						resp.headers['content-type'],
	// 					);
	// 				}
	// 			} else {
	// 				this.$infoNotification.error({
	// 					content: '無法完成查詢項目，請再次嘗試。',
	// 				});
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.log('Error:', error);
	// 		});
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
		this.editModalVisible = true;
		// }
	}

	// closeEditModal() {
	// 	this.editModalVisible = false;
	// }

	// created() {
	// 	// 取得使用者角色： 1-員工, 2-護理師, 3-主管, 4-系統管理員
	// 	this.curRole = this.$user.getSelectedRole();
	// 	console.log('curRole:', this.curRole);
	// 	this.fetchUnits();
	// }

	// updated() {
	// 	window.parseWord();
	// }
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
      padding-top: 9px;
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
</style>
