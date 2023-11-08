<template>
  <div
    class="container pageDoctorConsultReservationStep3"
    :class="{'resultSuccess': resultSuccess}"
  >
    <div class="page__card page__card--shadow">
      <div class="page__card__title">
        {{ pageTitle }}
      </div>
      <div
        v-if="resultSuccess"
        class="reservation__card__wrap d-sm-flex justify-content-center"
      >
        <div class="reservation__card__item d-flex d-sm-block">
          <i class="reservation__card__icon card__icon-location" />
          <div class="reservation__card__info">
            <div class="info__item__title">
              預約地點
            </div>
            <div class="info__item__data">
              {{ reservationInfo.actLocation }}
            </div>
          </div>
        </div>
        <div class="reservation__card__item d-flex d-sm-block">
          <i class="reservation__card__icon card__icon-date" />
          <div class="reservation__card__info">
            <div class="info__item__title">
              預約時間
            </div>
            <div class="info__item__data">
              {{ reservationInfo.actDate }}
            </div>
          </div>
        </div>
        <div class="reservation__card__item d-flex d-sm-block">
          <i class="reservation__card__icon card__icon-time" />
          <div class="reservation__card__info">
            <div class="info__item__title">
              預約時段
            </div>
            <div class="info__item__data">
              {{ reservationInfo.sessionTime }}
            </div>
          </div>
        </div>
        <div class="reservation__card__item d-flex d-sm-block">
          <i class="reservation__card__icon card__icon-doctor" />
          <div class="reservation__card__info">
            <div class="info__item__title">
              值班醫師
            </div>
            <div class="info__item__data">
              {{ `Dr. ${reservationInfo.physicianName}` }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="role === '1'"
        class="page__card__info"
      >
        <p>親愛的主管、同仁您好，</p>

        <!-- 成功訊息 -->
        <template v-if="resultSuccess">
          <p>溫馨提醒～ 您已預約 <span class="text-green">{{ `${reservationInfo.actDate}(${resultDate})` }}</span><span>{{ meridiem }}</span>醫師諮詢，請依預約時間前往<span class="text-green">「{{ reservationInfo.actLocation }}」</span> 報到！</p>
          <p>(其他大樓、外縣市同仁請以電話諮詢)。如有相關資料、文件也請一起攜帶，謝謝您！</p>
        </template>

        <!-- 失敗訊息 -->
        <template v-else>
          <p>溫馨提醒～ 您欲預約 <span class="text-red">{{ `${reservationInfo.actDate}(${resultDate})` }}</span><span>{{ meridiem }}</span>的醫師諮詢服務，因<span>{{ showResultError || '不明' }}</span>因素無法進行預約。</p>
          <p>如尚需諮詢服務，請您再次預約。或與相關服務人員聯繫，謝謝您！</p>
        </template>
        <p class="mt-4">
          相關問題也可聯繫健康促進公務信箱 <a
            class="text-link"
            :href="`mailto:${publicMail}`"
          >{{ publicMail }}</a> 。
        </p>
      </div>
      <div
        v-else
        class="page__card__info"
      >
        <!-- 成功訊息 -->
        <template v-if="resultSuccess">
          <p>溫馨提醒～ 已預約個案 <span class="text-green">{{ `${reservationInfo.actDate}(${resultDate})` }}</span><span>{{ meridiem }}</span>醫師諮詢，請依預約時間前往<span class="text-green">「{{ reservationInfo.actLocation }}」</span> 報到！</p>
          <p>(其他大樓、外縣市同仁請以電話諮詢)。如有相關資料、文件也請一起攜帶，謝謝您！</p>
        </template>

        <!-- 失敗訊息 -->
        <template v-else>
          <p>溫馨提醒～ 您欲預約個案 <span class="text-red">{{ `${reservationInfo.actDate}(${resultDate})` }}</span><span>{{ meridiem }}</span>的醫師諮詢服務，因<span>{{ showResultError || '不明' }}</span>因素無法進行預約。</p>
          <p>如尚需諮詢服務，請您再次預約。或與相關服務人員聯繫，謝謝您！</p>
        </template>
      </div>
    </div>
    <div
      v-if="role === '1'"
      class="page__footer__control btn__wrap d-flex justify-content-center"
    >
      <button
        v-if="backBtn === 'RelevantSurveyIndex'"
        class="form__btn btn__radius--primary"
        @click="handleGoMainPage"
      >
        返回計畫主頁
      </button>
      <button
        v-else
        class="form__btn btn__radius--primary"
        @click="handleGoMainPage"
      >
        返回活動主頁
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ValidationRule } from 'ant-design-vue/types/form-model/form';
import moment from 'moment';
import EnumData from '@/plugins/global/enumData';

@Component({})
export default class DoctorConsultReservationStep2 extends Vue {
  // 返回按鈕設置
  backBtn = null;

  resultSuccess = false;

  reservationInfo = {
  	actLocation: '',
  	actDate: '',
  	sessionTime: '',
  	physicianName: '',
  }

  showData = {
  	cancelDate: '2022-04-22T09:02:47.818Z',
  	cancelReason: 'cancelReason',
  	company: 'company',
  	department: 'department',
  	description: 'description',
  	execCancelUid: 0,
  	execReserveUid: 0,
  	extNo: 'extNo',
  	mobileNo: 'mobileNo',
  	operatorNo: 'operatorNo',
  	reserveInfoId: 0,
  	reserveName: 'reserveName',
  	reserveUid: 0,
  	sessionId: 0,
  	srcFrom: 'srcFrom',
  	status: 'status',
  	title: 'title',
  	unit: 'unit',
  	workArea: 'workArea',
  };

  publicMail = null;

  get resultDate() {
  	return EnumData.getVal('weeksEnum', moment(this.reservationInfo.actDate).format('E'));
  }

  showResultError = '';

  get pageTitle() {
  	return this.resultSuccess ? '預約成功' : '預約失敗';
  }

  get meridiem() {
  	return moment({ hour: Number(this.reservationInfo.sessionTime.split(':')[0]) }).format('a');
  }

  get role() {
  	return this.$user.getSelectedRole();
  }

  /**
   * Event
   */
  handleGoMainPage() {
  	this.$router.push({ name: this.backBtn });
  	sessionStorage.removeItem('doceservation');
  }

  /**
   * Hook
   */
  async created() {
  	this.publicMail = await this.$global.getPublicEmail();
  	if (sessionStorage.getItem('doceservation')) {
  		this.backBtn = sessionStorage.getItem('doceservation');
  	} else {
  		this.backBtn = 'DoctorConsultIndex';
  	}
  	this.$emit('changeParent', { step: 3, pageTitle: '預約結果' });
  	const query = this.$global.getQuery();
  	this.reservationInfo = query.reservationInfo;
  	if (query.response.status == 200) {
  		this.resultSuccess = true;
  		this.showData = query.response.data;
  	} else {
  		this.resultSuccess = false;
  		console.log(this.$global.getApiErrorMsg(query.response.apiError));
  		this.showResultError = this.$global.getApiErrorMsg(query.response.apiError).join('');
  	}
  }

  mounted() {
  	// this.form.date = new Date();
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .page__card {
    padding: 25px 20px;
    @include rwd-sm {
			padding: 20px 74px;
		}
    @include rwd-xl {
			padding: 30px 100px;
		}
  }
  .page__card__title {
    color: $COLOR-MAIN1;
    font-size: 20px;
    font-weight: 600;
    @include rwd-xl {
			font-size: 24px;
		}
  }

  // 預約資訊
  .reservation__card__wrap {
    margin: 25px 0 0;
    @include rwd-sm {
			margin: 25px -5px 0;
		}
    @include rwd-xl {
			margin: 25px -4px 0;
		}
  }
  .reservation__card__item {
    flex: 1;
    padding: 0;
    align-items: center;
    color: $COLOR-GRAY1;
    @include rwd-sm {
			margin: 0 5px;
      border: 1px solid $COLOR-MAIN9;
      border-radius: 4px;
      padding: 40px 12px 16px;
      text-align: center;
		}
    @include rwd-xl {
			margin: 0 4px;
      padding: 40px 35px 16px;
		}
    + .reservation__card__item {
      margin-top: 20px;
      @include rwd-sm {
        margin-top: 0;
      }
    }
  }
  .reservation__card__icon {
    display: block;
    width: 44px;
    height: 44px;
    margin: 0 auto;
    @include rwd-sm {
      width: 66px;
      height: 66px;
		}
  }
  .reservation__card__info {
    flex: 1;
    margin-left: 15px;
    text-align: left;
    @include rwd-sm {
      margin-left: 0;
      text-align: center;
		}
  }
  .card__icon-location {
    background: url('~@images/image_location.svg') no-repeat;
    background-size: 100%;
  }
  .card__icon-date {
    background: url('~@images/image_date.svg') no-repeat;
    background-size: 100%;
  }
  .card__icon-time {
    background: url('~@images/image_time.svg') no-repeat;
    background-size: 100%;
  }
  .card__icon-doctor {
    background: url('~@images/image_doctor.svg') no-repeat;
    background-size: 100%;
  }

  .info__item__title {
    font-size: 14px;
    font-weight: 600;
    @include rwd-sm {
      margin-top: 20px;
		}
    @include rwd-xl {
      font-size: 16px;
		}
  }
  .info__item__data {
    margin-top: 5px;
    font-size: 14px;
    @include rwd-xl {
      font-size: 18px;
		}
  }

  .page__card__info {
    color: $COLOR-BLACK;
    margin-top: 23px;
    font-size: 16px;
    line-height: 1.5;
    @include rwd-sm {
      margin-top: 20px;
		}
    @include rwd-xl {
      margin-top: 30px;
      font-size: 18px;
		}
    p {
      margin-bottom: 0;
    }
  }

  .text-green {
    color: $TEXT-GREEN;
  }
  .text-red {
    color: $COLOR-MAIN16;
  }
  .text-link {
    color: $COLOR-MAIN15;
    text-decoration: underline;
  }

  .btn__wrap {
    margin: 20px 0 0;

    @include rwd-sm {
			margin: 40px 0 10px;
		}
    @include rwd-xl {
			margin: 50px 0 20px;
		}
    button {
      width: 150px;
      max-width: 100%;
      font-size: 14px;
      @include rwd-sm {
        width: 200px;
      }
      @include rwd-xl {
        font-size: 16px;
      }
    }
  }

  // 預約失敗 樣式
  .pageDoctorConsultReservationStep3 {
    &:not(.resultSuccess) {
      .page__card__title {
        color: $COLOR-MAIN16;
      }
    }
  }
</style>
