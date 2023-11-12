<template>
  <div class="pageDoctorConsultReservationStep1">
    <div class="page__card search__card">
      <a-form-model
        class="form__wrap"
        :model="searchForm"
      >
        <a-row
          type="flex"
          justify="center"
          :gutter="[15, 0]"
        >
          <a-col
            span="24"
            :lg="12"
          >
            <a-form-model-item
              class="formItem-row"
            >
              <label
                for=""
                class="a-form-label"
              >
                <label>選擇大樓</label>
                <span class="mark-required">*</span>
              </label>
              <a-select
                v-model="searchForm.site"
                :show-arrow="true"
                :options="siteOptions"
                class="memberCard-auth"
                placeholder="請選擇大樓"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            span="24"
            :lg="12"
          >
            <a-form-model-item
              class="formItem-row"
            >
              <label
                for=""
                class="a-form-label d-flex justify-content-between"
              >
                <label>選擇日期</label>
              </label>
              <date-picker
                v-model="searchForm.date"
                style="width: 100%"
                :allow-clear="true"
                type="date"
                :disabled-date="disabledDate"
                :input-read-only="true"
                format="YYYY/MM/DD"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="footer__control d-flex justify-content-center">
        <button
          class="form__btn btn__radius--primary"
          @click="handleSearch"
        >
          查詢
        </button>
      </div>
    </div>
    <template v-if="isCalendarShow">
      <div class="page__card calendar__card">
        <div class="calendar__header d-lg-flex justify-content-between">
          <ul class="header__caption d-flex">
            <li class="header__caption-item">
              <i class="caption__icon calendar__style-booking" />
              <span class="caption__txt">尚可預約</span>
            </li>
            <li class="header__caption-item">
              <i class="caption__icon calendar__style-myBooked" />
              <span class="caption__txt">{{ userCaseId?'個案的預約':'我的預約' }}</span>
            </li>
            <li class="header__caption-item">
              <i class="caption__icon calendar__style-bookedUp" />
              <span class="caption__txt">預約額滿</span>
            </li>
          </ul>
          <div class="header__control d-flex align-items-center justify-content-center">
            <button
              class="button-formatter control__item control__item--prev"
              @click="prevWeek"
            >
              <a-icon
                class="control__icon"
                type="left-circle"
                theme="filled"
              />
              <span>前一週</span>
            </button>
            <span class="currentWeek">本週</span>
            <button
              class="button-formatter control__item control__item--next"
              @click="nextWeek"
            >
              <span>下一週</span>
              <a-icon
                class="control__icon"
                type="right-circle"
                theme="filled"
              />
            </button>
          </div>
        </div>

        <a-divider class="calendar__header__divider" />

        <div class="calendar__container">
          <!-- 星期標題 -->
          <div class="booking__header d-none d-lg-block">
            <div class="booking__weekRow d-flex">
              <div
                v-for="(item, index) in showWeeksData"
                :key="index"
                class="booking__weekItem"
              >
                <span class="weekItem__date">{{ item.date }}</span>
                <span class="weekItem__day">{{ getNowDate == item.date ? '今天' : weeksEnum.find((i) => i.val === item.key).ch }}</span>
              </div>
            </div>
          </div>

          <div class="booking__content booking__Block d-lg-flex align-items-start">
            <div
              v-for="(item, index) in showWeeksData"
              :key="index"
              class="booking__weekRow"
              :class="{'booking__weekRow__RWD_emptyNone': item.timesArr.length <= 0}"
            >
              <div class="booking__rwd__header">
                <span class="booking__rwd__date">{{ item.date }}</span>
                <span class="booking__rwd__day">{{ getNowDate == item.date ? '今天' : weeksEnum.find((i) => i.val === item.key).ch }}</span>
              </div>
              <template v-for="(item2, index2) in item.timesArr">
                <!--  可預約，狀態 = 0
                      登入者已預約，狀態 = 1
                      別人已預約，狀態 = 2
                      已過期不可預約，狀態 = 3-->
                <template v-if="item2.reserveStatus === '1' || (userCaseId && userCaseId.toString() === item2.reserveUid)">
                  <a-popover
                    :key="index2"
                    title="預約資訊"
                    trigger="click"
                    placement="bottomLeft"
                  >
                    <template slot="content">
                      <p>地點：{{ item2.actLocation }}</p>
                      <p>日期：{{ item2.actDate }}</p>
                      <p>時段：{{ `${getTime(item2.sessionStartDate)}~${getTime(item2.sessionEndDate)}` }}</p>
                      <p>醫生：{{ item2.physicianName }}</p>
                    </template>
                    <div
                      class="booking__weekItem"
                      :class="{
                        'calendar__style-booking': item2.reserveStatus === '0',
                        'calendar__style-myBooked': (userCaseId&&item2.reserveUid === userCaseId.toString()) || item2.reserveStatus === '1' || (selectBooking.sessionId === item2.sessionId),
                        'calendar__style-beBooked': item2.reserveStatus === '2' || item2.reserveStatus === '3'
                      }"
                    >
                      <span class="weekItem__info">{{ getTime(item2.sessionStartDate) }} ~ {{ getTime(item2.sessionEndDate) }}</span>
                      <a-icon
                        type="close"
                        class="weekItem__info-icon"
                      />
                    </div>
                  </a-popover>
                </template>
                <template v-else>
                  <div
                    :key="index2"
                    class="booking__weekItem"
                    :class="{
                      'calendar__style-booking': item2.reserveStatus === '0',
                      'calendar__style-myBooked': (userCaseId&&item2.reserveUid === userCaseId.toString()) || (selectBooking.sessionId === item2.sessionId),
                      'calendar__style-beBooked': item2.reserveStatus === '2' || item2.reserveStatus === '3'
                    }"
                    @click="() => handleSelectBooking(item2)"
                  >
                    <span class="weekItem__info">{{ getTime(item2.sessionStartDate) }} ~ {{ getTime(item2.sessionEndDate) }}</span>
                    <a-icon
                      type="close"
                      class="weekItem__info-icon"
                    />
                  </div>
                </template>
              </template>
            </div>
          </div>
          <!-- 有搜尋事件，且無資料 -->
          <div v-if="!isDataShow && isSearch">
            <p class="emptyData">
              查無資料
            </p>
          </div>
        </div>
      </div>
      <!-- 有搜尋事件，且有資料 -->
      <template v-if="isSearch && isDataShow">
        <div class="notice__wrap">
          <span class="line__text">＊每人每月僅供一次預約諮詢</span>
          <span class="line__text">＊取消預約、預約過期才可進行下次預約</span>
        </div>
        <div class="page__footer__control d-flex justify-content-center">
          <button
            class="form__btn btn__radius--primary"
            :disabled="!selectBooking.actDate"
            @click="handleNextStep"
          >
            下一步
          </button>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import ProgressbarStep from '@compononts/layout/ProgressbarStep.vue';
import moment from 'moment';
import DateTimeFormmat from '@/plugins/dateTimeFormmat/dateTimeFormmat';
import { Modal } from 'ant-design-vue';
import InfoModal from '@/plugins/notification/infoModal';
import { PhyConsultActPeriodQueryOutDto } from '@fubonlife/oss-api-axios-sdk';

@Component({
	components: { ProgressbarStep },
})
export default class DoctorConsultReservationStep1 extends Vue {
  @Action('setLoading') setLoading;

  isSearch = false;

  isReserve = 'N';

  userCaseId = null // 個案的員工ID

  searchForm = {
  	site: undefined,
  	date: undefined,
  };

  weeksEnum = [
  	{
  		key: '1',
  		val: 'monday',
  		ch: '星期一',
  	},
  	{
  		key: '2',
  		val: 'tuesday',
  		ch: '星期二',
  	},
  	{
  		key: '3',
  		val: 'wednesday',
  		ch: '星期三',
  	},
  	{
  		key: '4',
  		val: 'thursday',
  		ch: '星期四',
  	},
  	{
  		key: '5',
  		val: 'friday',
  		ch: '星期五',
  	},
  	{
  		key: '6',
  		val: 'saturday',
  		ch: '星期六',
  	},
  	{
  		key: '7',
  		val: 'sunday',
  		ch: '星期日',
  	},
  ];

  showWeeksData = [
  	{
  		key: 'monday',
  		date: '',
  		timesArr: [],
  	},
  	{
  		key: 'tuesday',
  		date: '',
  		timesArr: [],
  	},
  	{
  		key: 'wednesday',
  		date: '',
  		timesArr: [],
  	},
  	{
  		key: 'thursday',
  		date: '',
  		timesArr: [],
  	},
  	{
  		key: 'friday',
  		date: '',
  		timesArr: [],
  	},
  	// {
  	//   key: 'saturday',
  	//   date: '',
  	//   timesArr: [],
  	// },
  	// {
  	//   key: 'sunday',
  	//   date: '',
  	//   timesArr: [],
  	// },
  ];

  selectBooking: PhyConsultActPeriodQueryOutDto = {
  	actId: '',
  	actLocation: '',
  	actDate: '',
  	timeInterval: '',
  	nurseName: '',
  	physicianName: '',
  	actTime: '',
  	sessionStartDate: '',
  	sessionEndDate: '',
  	reserveUid: '',
  	reserveStatus: '',
  };

  // 選擇大樓 下拉
  siteOptions = [];

  caseInfo = null; // 從其他入口來的caseId、srcFrom資訊

  // 選擇日期 disabled
  disabledDate(current) {
  	// 以當天為基準，禁用過去的時間
  	const date = new Date();
  	// disabled 過去時間 以及 六、日
  	// return current && (current <= moment().subtract(1, 'day') || moment(current).weekday() >= 5);
  	return current && moment(current).weekday() >= 5;
  }

  // 星期轉數字
  weekGetNum(str) {
  	return Number(this.weeksEnum.find((i) => i.val === str).key);
  }

  // 星期轉中文
  weekGetCh(str) {
  	return this.weeksEnum.find((i) => i.val === str).ch;
  }

  get getNowDate() {
  	return moment().format('YYYY/MM/DD');
  }

  get isCalendarShow() {
  	return this.showWeeksData.some((i) => i.date.length > 0);
  }

  get isDataShow() {
  	return this.showWeeksData.some((i) => i.timesArr.length > 0);
  }

  getTime(date) {
  	return DateTimeFormmat.formatStringHourAndMinute(date);
  }

  getWeeksData(searchDate) {
  	const selectDate = moment(searchDate); // 選擇的日期

  	// 產生一組 weeks(星期一～星期五)
  	this.showWeeksData.map((searchItem) => {
  		// weeks 轉換數字
  		const weekToNum = this.weekGetNum(searchItem.key);
  		// 塞date進showWeeksData
  		searchItem.date = selectDate.weekday(weekToNum - 1).format('YYYY/MM/DD');
  	});
  }

  // API: 取得職場大樓
  async getWorkBuilding() {
  	this.setLoading(true);
  	await this.$PCREmpPhysicianConsultControllerApi.getWorkBuildingInfoUsingPOST()
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				this.siteOptions = getData.map((i) => ({
  					value: i.wbInfoId,
  					label: `${i.buildingName}${i.address}`,
  				}));
  			} else {
  				// 查找失敗訊息
  			}
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // API: 查詢 醫師諮詢時段
  getPhyConsultActSession() {
  	const postForm = {
  		wbInfoId: this.searchForm.site,
  		strDate: DateTimeFormmat.formatStringDateDault(this.showWeeksData.find((i) => i.key === 'monday').date),
  		endDate: DateTimeFormmat.formatStringDateDault(this.showWeeksData.find((i) => i.key === 'friday').date),
  	};
  	this.setLoading(true);
  	this.$PCREmpPhysicianConsultControllerApi.getPhyConsultSessionAndActUsingPOST(postForm)
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				this.showWeeksData.map((i) => {
  					i.timesArr = getData.filter((j) => moment(i.date).isSame(j.actDate));
  				});
  			} else {
  				// 查找失敗訊息
  			}
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  			this.isSearch = true;
  		});
  }

  // API: 查詢 是否已有預約
  async getIsReserve() {
  	this.setLoading(true);
  	// TODO: TEST: 抓取使用者ID，目前使用測試input
  	// const userId = 1;
  	let userId;
  	// this.caseInfo && this.caseInfo.caseEmpId ? userId = await this.getEmpUid(this.caseInfo.caseEmpId) : userId = this.$user.getMe().userId;
  	if (this.caseInfo && this.caseInfo.caseEmpId) {
  		await this.getEmpUid(this.caseInfo.caseEmpId);
  		userId = this.userCaseId;
  		console.log('從個案來');
  	} else {
  		console.log('員工自行預約');
  		userId = this.$user.getMe().userId;
  	}
  	this.$PCREmpPhysicianConsultControllerApi.getIsReserveOrNotUsingPOST(userId)
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				this.isReserve = getData.isReserve;
  			}
  			// 查找失敗訊息
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  async getEmpUid(empInfo) {
  	await this.$PCRRpnSendRemindAndModifyReservationApi.queryAccountInfoUsingPOST(empInfo)
  		.then((resp) => {
  			if (resp.data.status === 200) {
  	      this.userCaseId = resp.data.data[0].uid;
  			} else {
  				// notification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
  			}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Event
   */
  handleSearch() {
  	// 使用者無選擇日期時，自動已當天換算當週時間
  	this.getWeeksData(this.searchForm.date || new Date());
  	this.getPhyConsultActSession();
  }

  prevWeek() {
  	this.getWeeksData(moment(this.showWeeksData.find((i) => i.key === 'monday').date).subtract(1, 'w').format());
  	this.getPhyConsultActSession();
  }

  nextWeek() {
  	this.getWeeksData(moment(this.showWeeksData.find((i) => i.key === 'monday').date).add(1, 'w').format());
  	this.getPhyConsultActSession();
  }

  // 選取預約時間
  handleSelectBooking(bookingData) {
  	// 阻擋已有預約者
  	if (this.isReserve == 'N') {
  		if (bookingData.reserveStatus === '0') {
  			if (bookingData.sessionId === this.selectBooking.sessionId) {
  				this.selectBooking = {};
  			} else {
  				this.selectBooking = bookingData;
  			}
  		}
  	} else {
  		InfoModal.alertSuccess({
  			width: '437px',
  			title: this.userCaseId ? '該個案已有預約' : '您已經有預約時間嚕！',
  			confirm: false,
  			content: this.userCaseId ? '該個案已有預約' : '您目前已有諮詢預約，如需更換預約日期，請先取消原本的預約。預約規則如下：',
  			customContent: () =>
  			this.$createElement('ul', {
  					attrs: {
  						class: 'listStyle--star',
  					},
  				}, [
  					this.$createElement('li', {}, '每人每月僅供一次預約諮詢'),
  					this.$createElement('li', {}, '取消預約、預約過期才可進行下次預約'),
  				]),
  		});
  	}
  }

  // 下一步
  async handleNextStep() {
  	// 阻擋已有預約者
  	if (this.isReserve == 'N') {
  		let nextRouter;
  		switch (this.$route.name) {
  		case 'CaseMaintainReservationStep1':
  			nextRouter = 'CaseMaintainReservationStep2';
  			break;

  		case 'MotherPlanDoctorReservationStep1':
  			nextRouter = 'MotherPlanDoctorReservationStep2';
  			break;

  		default:
  			nextRouter = 'DoctorConsultReservationStep2';
  			break;
  		}
  		const encryptCaseInfo = await this.$encryptionDecryption.encrypt(JSON.stringify(this.caseInfo));
  		this.$global.changeRouterAndaddParam({
  			toRouter: nextRouter,
  			query: {
  				selectBooking: this.selectBooking,
  				caseInfo: encryptCaseInfo,
  			},
  		});
  	}
  }

  /**
   * Hook
   */
  async created() {
  	this.$emit('changeParent', { step: 1, pageTitle: '選擇預約時間' });
  	// 取得職場大樓下拉
  	await this.getWorkBuilding();
  	// 預設
  	this.searchForm.site = 1;
  	this.searchForm.date = new Date();

  	// 取得從其他入口來的caseId、srcFrom資訊, 拿取sessionStorage:caseInfo
  	console.log(this.$route.name);
  	if (this.$route.name === 'DoctorConsultReservationStep1') {
  		sessionStorage.removeItem('caseInfo');
  		console.log(this.$global.getQuery());
  		this.caseInfo = this.$global.getQuery();
  	} else if (this.$route.name === 'MotherPlanDoctorReservationStep1') {
  		// [員工]母性功能&代辦導頁至此頁
  		this.caseInfo = this.$global.getQuery();
  	} else if (this.$route.name === 'RelevantSurveyReservationStep1') {
  		// [員工]人因表單導頁至此頁
  		this.caseInfo = this.$global.getQuery();
  	} else {
  		// [護理師] 個案維護導頁至此
  		const caseInfo = sessionStorage.getItem('caseInfo');
  		if (caseInfo) {
  			this.caseInfo = JSON.parse(await this.$encryptionDecryption.decrypt(caseInfo));
  		}
  	}

  	console.log(this.caseInfo);

  	// 判斷使用者是否已有預約，
  	// 因取消預約非同一條流程， 故在載入時判斷 而非預約時判斷
  	await this.getIsReserve();
  }

  mounted() {
  	// TEST:
  	// this.handleSearch();
  }
}
</script>

<style lang="scss" scoped>
  .footer__control {
    .form__btn {
      width: 150px;
      margin-top: 5px;
      @include rwd-lg {
        width: 200px;
        margin-top: 15px;
      }
    }
  }
  .mark-required {
    color: $ERROR-COLOR;
    vertical-align: top;
    display: inline-block;
    margin-left: 5px;
  }
  .form__wrap {
    width: 100%;
    margin: 0 auto;
    @include rwd-lg {
      max-width: 720px;
    }
  }
  .a-form-label {
    font-size: 14px;
    line-height: 1;
    display: block;
    margin-bottom: 10px;
    label {
      font-size: 14px;
      font-weight: 600;
      @include rwd-lg {
        font-size: 16px;
      }
    }
  }
  .text-green {
    color: $TEXT-GREEN;
  }

  .search__card {
    padding: 30px 30px 20px;
    border-radius: 0;
    @include rwd-lg {
      padding: 30px;
      border-radius: 10px;
    }
  }
  .emptyData {
    text-align: center;
    margin-top: 30px;
    font-size: 18px;
    color: $COLOR-GRAY10;
    letter-spacing: 1px;
  }

// 行事曆
  // 共用樣式
  .calendar__style-booking {
    border: 1px solid $COLOR-MAIN1 !important;
    background: $COLOR-WHITE !important;
    color: $COLOR-MAIN1 !important;
  }
  .calendar__style-myBooked {
    border: 1px solid $COLOR-MAIN1 !important;
    background: $COLOR-MAIN1 !important;
    color: $COLOR-WHITE !important;
  }
  .calendar__style-bookedUp {
    border: 1px solid $COLOR-GRAY4 !important;
    background: $COLOR-GRAY4 !important;
    color: $COLOR-WHITE !important;
  }
  .calendar__style-bookedUp

  .calendar__card {
    padding: 20px 30px;
    border-radius: 0;
    @include rwd-lg {
      padding: 20px 74px;
      border-radius: 10px;
    }
    @include rwd-xl {
      padding: 35px 92px 40px;
    }
  }
  .header__caption-item {
    display: flex;
    align-items: center;
    + .header__caption-item {
      margin-left: 20px;
    }
    &:last-child {
      display: none;
      @include rwd-lg {
        display: flex;
      }
    }
  }
  .caption__icon {
    display: block;
    border-radius: 6px;
    width: 14px;
    height: 14px;
    @include rwd-lg {
      width: 20px;
      height: 20px;
    }
  }
  .caption__txt {
    display: block;
    margin-left: 10px;
    font-size: 12px;
    @include rwd-lg {
      font-size: 14px;
    }
  }
  .header__control {
    color: $COLOR-BLACK;
    background: $COLOR-MAIN10;
    margin-top: 20px;
    padding: 8px;
    @include rwd-lg {
      background: initial;
      margin-top: 0;
      padding: 0;
    }
    .currentWeek {
      font-weight: 600;
    }
    .control__item {
      margin: 0 20px;
      padding: 0;
      &:not(.control__item--disabled) {
        cursor: pointer;
      }
    }
    .control__icon {
      margin: 0 10px;
      ::v-deep {
        svg {
          font-size: 24px;
          @include rwd-lg {
            font-size: 30px;
          }
        }
      }
    }
    .control__item--disabled {
      .control__icon {
        color: $COLOR-GRAY2;
      }
    }
  }
  .button-formatter {
    border: none;
    background: none;
    display: inline-flex;
    align-items: center;
  }

  .calendar__header__divider {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .calendar__container {
    color: $COLOR-BLACK;
  }

  // booking-header
  .booking__header {
    font-size: 16px;
  }
  .booking__weekItem {
    flex: 1;
    text-align: center;
  }
  .weekItem__date {
    display: block;
  }
  .weekItem__day {
    display: block;
    font-size: 20px;
    font-weight: 600;
  }

  // booking-content
  .booking__content {
    margin-top: 20px;
    .booking__weekRow {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      margin: 0 -7px;
      &:not(:last-child) {
        border-bottom: 1px solid $COLOR-GRAY12;
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      &.booking__weekRow__RWD_emptyNone {
        margin-top: 0;
        padding: 0;
        border-bottom: none;
      }
      &.booking__weekRow__RWD_emptyNone {
        display: none;
      }
      @include rwd-lg {
        flex-direction: column;
        background: initial;
        margin: 0;
        &:not(:last-child) {
          margin-top: 0;
          padding: 0;
          border-bottom: none;
        }
        &.booking__weekRow__RWD_emptyNone {
          display: flex;
        }
      }
      .booking__rwd__header {
        display: block;
        width: 100%;
        margin: 0 7px 5px;
        .booking__rwd__day {
          margin-left: 5px;
        }
        @include rwd-lg {
          display: none;
        }
      }
    }
    .booking__weekItem {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 40px;
      background: $COLOR-GRAY4;
      border-radius: 10px;
      margin: 5px 7px;
      padding: 5px;
      width: calc(50% - 14px);
      flex: none;
      &:not(.calendar__style-booking, .calendar__style-myBooked) {
        display: none;
      }
      @include rwd-lg {
        margin: 5px 8px;
        width: auto;
        flex: 1;
        &:not(.calendar__style-booking, .calendar__style-myBooked) {
          display: flex;
        }
      }
      @include rwd-xl {
        margin: 5px 6.5px;
      }
      &.calendar__style-booking,
      &.calendar__style-myBooked {
        cursor: pointer;
      }
      .weekItem__info {
        + .weekItem__info-icon {
          display: none;
          color: #FFF;
          ::v-deep {
            svg {
              font-size: 25px;
            }
          }
        }
      }
      &.calendar__style-beBooked {
        &:not(.calendar__style-myBooked) {
          .weekItem__info {
            opacity: 0.5;
            display: block;
            + .weekItem__info-icon {
              display: none;
            }
          }
        }
      }
    }
  }

  .notice__wrap {
    margin-top: 20px;
    color: $COLOR-MAIN1;
    padding: 0 30px;
    @include rwd-lg {
      font-size: 16px;
      padding: 0;
    }
    .line__text {
      display: block;
      font-size: 14px;
      + .line__text {
        margin-top: 8px;
      }
      @include rwd-lg {
        font-size: 16px;
      }
    }
  }

  .page__footer__control {
    margin-top: 10px;
    margin-bottom: 30px;
    .form__btn {
      width: 200px;
    }
  }
</style>
