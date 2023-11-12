<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        活動與場次維護：活動場次
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          :disabled="actStatus == '進行中' || actStatus == '已結束'"
          @click="goEdit"
        >
          編輯
        </button>
      </div>
    </div>
    <div class="page__card form__card">
      <div class="actInfoGroup__wrap">
        <div class="event__title">
          活動資訊
        </div>
        <a-row
          :gutter="[16, 20]"
          class="actInfo-item"
        >
          <template v-for="(info, index) in actInfoDataGroup">
            <a-col
              :key="index"
              :span="info.colSpan"
            >
              <div class="info__label">
                {{ info.label }}
              </div>
              <div class="info__value">
                <template v-if="info.type=='input'">
                  {{ dataGroup[info.key] }}
                </template>
                <template v-if="info.type=='dropdown'">
                  {{ getOptionLabel(info.key, dataGroup[info.key] ) }}
                </template>
                <template v-if="info.type=='datePicker'">
                  {{ getDate(info.key) }}
                </template>
                <template v-if="info.type=='dateRangePicker'">
                  {{ getDateRange(info.key) }}
                </template>
                <template v-if="info.type=='timePicker'">
                  {{ getTime(info.key) }}
                </template>
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
    </div>
    <div
      v-if="dataGroup.activitiesList.length > 0"
      class="page__card form__card"
    >
      <div class="event__title">
        場次資訊
      </div>
      <div
        v-for="(sessionItem, index) in dataGroup.activitiesList"
        :key="index"
        class="form__card__block"
      >
        <a-row
          :gutter="[16, 25]"
          class="sessionInfo-item"
        >
          <template v-for="(info, index) in sessionInfoGroup">
            <a-col
              :key="index"
              :span="info.colSpan"
            >
              <div class="info__label">
                {{ info.label }}
              </div>
              <div class="timeInfo__value">
                <template v-if="info.type=='input'">
                  {{ sessionItem[info.key] }}
                </template>
                <template v-if="info.type=='inputGroup' && (sessionItem[info.key[0]] || sessionItem[info.key[1]])">
                  {{ `${sessionItem[info.key[0]]}~${sessionItem[info.key[1]]}` }}
                </template>
                <template v-if="info.type=='dropdown' || info.type=='radio'">
                  {{ getOptionLabel(info.key, sessionItem[info.key]) }}
                </template>
                <template v-if="info.type=='datePicker'">
                  {{ getDate(sessionItem[info.key]) }}
                </template>
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="handlePrevStep()"
      >
        返回
      </button>
      <button
        class="btn__radius--primary"
        @click="goNextPage()"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';
import { SessionInfoModel } from '@/pages/OccupationalSafety/PushHealthPromote/EventAndTimeMaintain/EventAndTimeMaintainEventAddAndEdit.vue';

export interface infoGroupModel {
  key?: string | Array<string>;
  label?: string;
  colSpan?: string;
  type?: 'input' | 'datePicker' | 'dateRangePicker' | 'timePicker' | 'dropdown' | 'editor' | 'radio' | 'inputGroup';
}
@Component({})
export default class EventAndTimeMaintainEventDetails_eventTime extends Vue {
  @Action('setLoading') setLoading;

  /**
   * Data
   */
  actId = null;

  actStatus = '';

  dataGroup: {
    actName?: string;
    actDate?: Date;
    actStartTime?: Date;
    actEndTime?: Date;
    signupDate?: Array<Date>;
    remindDate?: Date;
    sendSatisfyQuestDate?: Date;
    activitiesList?: Array<SessionInfoModel>;
  } = {
  	actName: null,
  	actDate: null,
  	actStartTime: null,
  	actEndTime: null,
  	signupDate: [],
  	remindDate: null,
  	sendSatisfyQuestDate: null,
  	activitiesList: [
  		{
  			sessionName: '',
  			wbInfoId: 0,
  			location: '',
  			type: 1,
  			minCount: 0,
  			maxCount: 0,
  		},
  	],
  };

  // 活動資訊
  actInfoDataGroup: Array<infoGroupModel> = [
  	{
  		key: 'actName',
  		label: '活動名稱',
  		colSpan: '24',
  		type: 'input',
  	},
  	{
  		key: 'actDate',
  		label: '活動日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  	{
  		key: ['actStartTime', 'actEndTime'],
  		label: '活動時間',
  		colSpan: '12',
  		type: 'timePicker',
  	},
  	{
  		key: 'signupDate',
  		label: '可報名期間（亦為報名表填寫期間）',
  		colSpan: '24',
  		type: 'dateRangePicker',
  	},
  	// {
  	// 	key: 'actEndTime',
  	// 	label: '報名表填寫截止時間',
  	// 	colSpan: '12',
  	// 	type: 'timePicker',
  	// },
  	{
  		key: 'remindDate',
  		label: '發送提醒通知日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  	{
  		key: 'sendSatisfyQuestDate',
  		label: '滿意度問卷發送日期',
  		colSpan: '12',
  		type: 'datePicker',
  	},
  ]

  // 場次資訊
  sessionInfoGroup: Array<infoGroupModel> = [
  	{
  		key: 'sessionName',
  		label: '場次名稱',
  		colSpan: '24',
  		type: 'input',
  	},
  	{
  		key: 'wbInfoId',
  		label: '場次大樓',
  		colSpan: '12',
  		type: 'dropdown',
  	},
  	{
  		key: 'location',
  		label: '場次地點',
  		colSpan: '12',
  		type: 'input',
  	},
  	{
  		key: 'type',
  		label: '活動類型',
  		colSpan: '12',
  		type: 'radio',
  	},
  	{
  		key: ['minCount', 'maxCount'],
  		label: '人數限制(最低/最高)',
  		colSpan: '12',
  		type: 'inputGroup',
  	},
  ]

  // 下拉選項
  opts = {
  	wbInfoId: [], // 職場大樓
  	type: [], // 活動類型
  }

  /**
   * func
   */

  // 檢查是否有屬性值
  checkObjHasVal(obj) {
  	let bool = false;
  	for (const [key, value] of Object.entries(obj)) {
  		const val: any = value;
  		if (val && val.length !== 0) {
  			bool = true;
  		}
  	}
  	return bool;
  }

  // mapping 成後端接受的資料型態
  mapToFormData() {
  	const {
  		actDate, actStartTime, actEndTime, signupDate, remindDate, sendSatisfyQuestDate, activitiesList, ...other
  	} = this.dataGroup;
  	const filterActivitiesList = [];
  	activitiesList.forEach((obj) => {
  		if (this.checkObjHasVal(obj)) {
  			filterActivitiesList.push(obj);
  		}
  	});
  	return {
  		actDate: actDate && actDate.toISOString(),
  		actStartTime: actStartTime && moment(actStartTime).format('HH:mm'),
  		actEndTime: actEndTime && moment(actEndTime).format('HH:mm'),
  		signupStartDate: signupDate[0] && signupDate[0].toISOString(),
  		signupEndDate: signupDate[1] && signupDate[1].toISOString(),
  		remindDate: remindDate && remindDate.toISOString(),
  		sendSatisfyQuestDate: sendSatisfyQuestDate && sendSatisfyQuestDate.toISOString(),
  		activitiesList: filterActivitiesList,
  		...other,
  	};
  }

  // 取得下拉選單的中文值
  getOptionLabel(key, data) {
  	if (this.opts[key]) {
  		return this.opts[key].find((i) => i.value == data) ? this.opts[key].find((i) => i.value == data).label : data;
  	}
  	return '';
  }

  // 格式化日期
  getDate(key: string): string {
  	return (this.dataGroup[key]) ? moment(this.dataGroup[key]).format('yy/MM/DD') : '';
  }

  // 格式化日期區間
  getDateRange(key: string): string {
  	const stDate = this.dataGroup[key] && this.dataGroup[key][0];
  	const enDate = this.dataGroup[key] && this.dataGroup[key][1];
  	if (stDate || enDate) {
  		return `${(stDate) ? moment(stDate).format('yy/MM/DD') : ''} ~ ${enDate ? moment(enDate).format('yy/MM/DD') : ''}`;
  	}
  	return '';
  }

  // 格式化時間
  getTime(keyArr: Array<string>): string {
  	const [key1, key2] = keyArr;
  	if (this.dataGroup[key1] || this.dataGroup[key2]) {
  	  return `${moment(this.dataGroup[key1]).format('HH:mm')}~${moment(this.dataGroup[key2]).format('HH:mm')}`;
  	}
  }

  getOpts() {
  	this.opts.type = this.$enum.sessionTypeEnum.map((i) => ({
  		value: i.key,
  		label: i.val,
  	}));
  	this.getWokingBuildingInfo();
  }

  // API: 查詢職場大樓API
  getWokingBuildingInfo() {
  	this.setLoading(true);
  	this.$PCREmpPhysicianConsultControllerApi.getWorkBuildingInfoUsingPOST()
  		.then((resp) => {
  			if (resp.data.status === 200) {
  				resp.data.data.forEach((item) => {
  					this.opts.wbInfoId.push({
  						value: item.wbInfoId,
  						label: item.buildingName,
  					});
  			  });
  			} else {
  				this.$infoNotification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢單一健康促進活動API
  getActInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getOneHealthActRpnUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const {
  					actName, actDate, actStartTime, actEndTime, signupStartDate, signupEndDate, remindDate, sendSatisfyQuestDate,
  				} = resp.data.data;
  				Object.assign(this.dataGroup, {
  					actName,
  					actDate: actDate && new Date(actDate),
  					actStartTime: actStartTime && moment(actStartTime, 'HH:mm'),
  					actEndTime: actEndTime && moment(actEndTime, 'HH:mm'),
  					remindDate: remindDate && new Date(remindDate),
  					sendSatisfyQuestDate: sendSatisfyQuestDate && new Date(sendSatisfyQuestDate),
  					signupDate: [signupStartDate && new Date(signupStartDate), signupEndDate && new Date(signupEndDate)],
  				});
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢場次資訊API
  getSessionInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getHealthActSessionDetailUsingPOST(this.actId)
  	.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				// TEST:
  				// console.log(getData);
  				if (getData.length > 0) {
  					this.dataGroup.activitiesList = getData.map((dto) => {
  						const {
  							sessionId, count, sessionType, ...other
  						} = dto;
  						return {
  							type: sessionType,
  							...other,
  						};
  					});
  				} else {
  					this.dataGroup.activitiesList = [];
  				}
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  setResultParam() {
  	const query = this.$global.getQuery();
  	this.actId = query?.actId;
  	this.actStatus = query?.actStatus;
  	this.getActInfo();
  	this.getSessionInfo();
  }

  /**
   * Event
   */
  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep2',
  		params: {
  			type: 'edit',
  		},
  		query: { actId: this.actId },
  	});
  }

  // 點擊按鈕，『上一步』
  handlePrevStep() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventInfo',
  		query: { actId: this.actId, actStatus: this.actStatus },
  	});
  	sessionStorage.removeItem('form_step2');
  }

  // 前往活動與場次維護：活動場次頁
  goNextPage() {
  	// const $formData = this.mapToFormData();
  	// sessionStorage.setItem('form_step2', JSON.stringify($formData));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventRegistration',
  		query: { actId: this.actId, actStatus: this.actStatus },
  	});
  }

  /**
   * Hook
   */
  created() {
  	this.setResultParam();
  	this.getOpts();
  }
}
</script>

<style lang="scss" scoped>
  .lists__num {
    list-style: inside decimal;
    width: 100%;
  }
  .form__card {
    background: $COLOR-MAIN10;
    padding: 30px 92px;
    &:last-of-type {
      margin-bottom: 20px;
    }
  }
  .form__card__block {
    background: $COLOR-WHITE;
    margin: 20px 0;
    padding: 40px 76px;
  }
  .event__title {
    font-size: 20px;
    font-weight: 600;
    color: $COLOR-MAIN1;
    margin-bottom: 20px;
  }
  .info__label {
    font-size: 16px;
    font-weight: 600;
    color: $COLOR-GRAY1;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .info__value {
    font-size: 20px;
    color: $COLOR-GRAY1;
    line-height: 28px;
  }
  .timeInfo__value {
    font-size: 16px;
    color: $COLOR-GRAY1;
    line-height: 22px;
  }
  .block__title {
    width: 180px;
    color: $COLOR-BLACK;
    font-weight: $TEXT-BOLD;
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.5;
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 1em;
      background: $COLOR-MAIN1;
      margin-right: 8px;
    }
  }

  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
    .btn__view {
      width: 100px;
      margin: 0;
    }
  }
  .img__content {
    width: 904px;
    height: 236px;
  }

  .link__block {
    margin-bottom: 30px;
  }

  .icon__style {
    font-size: 11px !important;
    color: #8C8C8C;
  }

  .link__style {
    color: #1797FB;
    font-size: 14px;
  }

  .info__item__content {
    font-size: 16px;
    line-height: 29px;
    color: $COLOR-BLACK;
  }
  .info__item__block {
    margin-top: 20px;
  }
</style>
