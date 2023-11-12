<template>
  <div class="container pageDoctorConsultReservation">
    <h2 class="page__title">
      預約諮詢：{{ pageTitle }}
    </h2>
    <div class="progressbar__wrap">
      <ProgressbarStep
        :step-arr="progressbarArr"
        :now="nowStep"
      />
    </div>
    <router-view @changeParent="changeParent" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ProgressbarStep from '@compononts/layout/ProgressbarStep.vue';
import moment from 'moment';

@Component({
	components: { ProgressbarStep },
})
export default class DoctorConsultReservation extends Vue {
	// 時間format格式
	// formatter = this.$twDateFormatter;

  progressbarArr = ['預約時間', '基本資料填寫', '預約結果'];

  nowStep = 1;

  pageTitle = '選擇預約時間'

  // 時間級距
  timeBracket = 15;

  form = {
  	site: 'site1',
  	date: null,
  }

  // 選擇大樓 下拉
  siteOption = [
  	{
  		value: 'site1',
  		label: '富邦松山大樓',
  	},
  	{
  		value: 'site2',
  		label: '富邦松山大樓',
  	},
  	{
  		value: 'site3',
  		label: '敦南大樓',
  	},
  	{
  		value: 'site4',
  		label: '高雄大樓',
  	},
  ];

  disabledDate(current) {
  	// 以當天為基準，禁用過去的時間
  	const date = new Date();
  	return current && current < moment().subtract(1, 'day');
  }

  changeParent(emit) {
  	const { step, pageTitle } = emit;
  	this.nowStep = step;
  	this.pageTitle = pageTitle;
  }

  /**
   * Event
   */
  handleNextStep() {
  	this.$router.push({ name: 'DoctorConsultReservationStep2' });
  }

  /**
   * Hook
   */
  mounted() {
  	this.form.date = new Date();
  }
}
</script>

<style lang="scss" scoped>
  .pageDoctorConsultReservation {
    padding-right: 0;
    padding-left: 0;
    padding-bottom: 30px;
    @include rwd-lg {
      padding-right: 30px;
      padding-left: 30px;
    }
  }
  .page__title {
    padding-right: 30px;
    padding-left: 30px;
    @include rwd-lg {
      padding-right: 0;
      padding-left: 0;
    }
  }
  .progressbar__wrap {
    margin-top: 20px;
    padding-right: 30px;
    padding-left: 30px;
    @include rwd-sm {
      padding-right: 0;
      padding-left: 0;
    }
  }
</style>
