<template>
  <div class="container pageEventAndTimeMaintainEventAddAndEdit">
    <h2
      v-if="!pageTitle"
      class="page-title"
    >
      {{ paramsType }}活動與場次
    </h2>
    <h2
      v-else
      class="page-title"
    >
      {{ pageTitle }}
    </h2>
    <div class="progressbar__wrap">
      <ProgressbarStep
        :step-arr="progressbarArr"
        :now="nowStep"
      />
    </div>
    <router-view @changeParent="changeParent" />

    <!-- 待辦 -->
    <!-- <TodoButton /> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import TodoButton from '@compononts/to-do/TodoButton.vue';
import ProgressbarStep from '@compononts/layout/ProgressbarStep.vue';
import moment from 'moment';
import { QuestionnaireModel } from '@fubonlife/oss-api-axios-sdk';

// 活動資訊
export interface ActInfoModel {
  actName?: string; // 活動名稱
  actDate?: Date; // 活動日期
  actStartTime?: Date; // 活動開始時間
  actEndTime?: Date; // 活動結束時間
  signupDate?: Array<Date>; // 可報名日期
  remindDate?: Date; // 發送通知提醒時間
  sendSatisfyQuestDate?: Date; // 滿意度問卷發送時間
  activitiesList?: Array<SessionInfoModel>; // 活動場次
}

// 場次資訊
export interface SessionInfoModel {
  sessionName?: string; // 場次名稱
  wbInfoId?: number; // 場次大樓
  location?: string; // 場次地點
  type?: number; // 場次類型
  minCount?: number; // 最低人數限制
  maxCount?: number; // 最高人數限制
}

export interface ActAndSessionModel {
  fileName?: string; // 圖片檔名
  filePath?: string; // 圖片路徑
  actId?: number; // 健康促進活動代碼
  actSummary?: string; // 活動摘要
  actDesc?: string; // 活動說明
  personalInfoStatement?: string; // 個資聲明
  actStatus?: number; // 活動狀態
  actName?: string; // 活動名稱
  actDate?: Date; // 活動日期
  actStartTime?: string; // 活動開始時間
  actEndTime?: string; // 活動結束時間
  signupDate?: Array<Date>; // 可報名日期
  remindDate?: Date; // 發送通知提醒時間
  sendSatisfyQuestDate?: Date; // 滿意度問卷發送時間
  activitiesList?: Array<SessionInfoModel>; // 活動場次
  questionnairesList?: Array<QuestionnaireModel>; // 問卷資訊
}

@Component({
	components: { TodoButton, ProgressbarStep },
})
export default class EventAndTimeMaintainEventAddAndEdit extends Vue {
	/**
   * data
   */
	pageTitle: string = ''

	// 步驟條資訊
  progressbarArr: Array<any> = ['活動頁設定', '活動場次設定', '報名表設定', '執行結果'];

  nowStep: number = 1;

  paramsType: string = '' // 新增or編輯

  /**
   * Func
   */
  // 判斷title是新增還是編輯
  setResultParam() {
  	const $type = this.$router.currentRoute.params.type;
  	this.paramsType = this.$enum.paramsTypeEnum.filter((i) => (i.key == $type))[0].val;
  }

  // 步驟條控制
  changeParent(emit) {
  	const { step, pageTitle } = emit;
  	this.nowStep = step;
  	this.pageTitle = pageTitle;
  }
  /**
   * Event
   */

  /**
   * Hook
   */
  created() {
  	this.setResultParam();
  }
}
</script>
<style lang="scss" scoped>
.pageEventAndTimeMaintainEventAddAndEdit {
	padding-bottom: 30px;
}
.progressbar__wrap {
	margin-top: 20px;
	margin-bottom: 30px;
}
.page-title {
	font-size: 30px;
	font-weight: $TEXT-BOLD;
	margin-top: 20px;
	margin-bottom: 0;
}
.progressbar {
	width: 100%;
  max-width: 1000px;
}
</style>
