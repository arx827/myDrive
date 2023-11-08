<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        健康促進活動
      </div>
      <div>
        <button
          class="btn__radius--primary--outline--small"
          @click="openAdvanceModal"
        >
          進階查詢
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-center align-items-center">
      <a-radio-group
        v-model="tabSelect"
        class="p-0 flex-grow-1 d-inline-flex justify-content-center"
        :default-value="cardTypeOption[0].value"
        button-style="solid"
      >
        <a-radio-button
          v-for="(item,index) in cardTypeOption"
          :key="index"
          :value="item.value"
          class="text-center"
          style="width:140px;"
        >
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
      <div class="d-none d-md-inline-block">
        共<span class="event__countData">{{ pagination.total }}</span>項
      </div>
    </div>
    <EventCard
      v-if="eventInfoList"
      :event-info-list="eventInfoList"
      :current-page="currentPage"
      :card-grid="{md: 8,
                   sm: 24,}"
      :act-detail-page="'HealthPromoteDescrip'"
      @refreshCard="getDatas"
    />

    <div class="btn__wrap d-flex justify-content-center">
      <button
        v-if="pagination.total > eventInfoList.length && eventInfoList.length!==0 && tabSelect === 'all'"
        class="btn__radius--blue"
        @click="showMore()"
      >
        <a-icon type="down" />
        展開更多
      </button>
    </div>

    <!-- 進階查詢 -->
    <AdvancedSearchModal
      :modal-advance-show="modalAdvanceShow"
      @closeAdvanceModal="closeAdvanceModal"
    />
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import AdvancedSearchModal from '@/pages/OccupationalSafety/PushHealthPromote/HealthPromote/AdvancedSearchModal.vue';
import EventCard from '@/components/shared/card/EventCard.vue';
import { HealthActModel, HealthActDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';

@Component({
	components: { AdvancedSearchModal, EventCard },
})
export default class HealthPromoteIndex extends Vue {
  @Action('setLoading') setLoading;
  /**
   * data
   */

	modalAdvanceShow = false

	currentPage: string = 'healthPromote'

  // 展開更多按鈕
  expandFlag: boolean = false;

  // 活動資料
  eventInfoList: HealthActDto[] = [];

	// 原始活動資料
	originEventInfoList: HealthActDto[] = [];

  // 活動要顯示的範圍
  eventType = 'all'

  // radio 的 button選項
	cardTypeOption = [
		{ label: '全部活動', value: 'all' },
		{ label: '進行中的活動', value: 'processing' },
		{ label: '已結束的活動', value: 'finished' },
	]

	tabSelect = '';

	pagination = {
		current: 0,
		pageSize: 10,
		total: 25,
	}

	@Watch('tabSelect')
	onTabChange(val) {
		console.log(val);
		if (val === 'finished') {
			this.eventInfoList = this.originEventInfoList.filter((e) => e.actStatus === 'N');
		} else if (val === 'processing') {
			this.eventInfoList = this.originEventInfoList.filter((e) => e.actStatus === 'Y');
		} else {
			this.eventInfoList = this.originEventInfoList;
		}
	}

	/**
   * Event
   */
	// 開啟進搜尋彈窗
	openAdvanceModal() {
		this.modalAdvanceShow = true;
	}

	// 關閉進搜尋彈窗
	closeAdvanceModal() {
		this.modalAdvanceShow = false;
	}

	// 點擊按鈕，『展開更多』
	showMore() {
  	// this.expandFlag = true;
		this.pagination.current++;
		this.getDatas();
	}

	// 取得資料
	async getDatas() {
		this.setLoading(true);
		const query: HealthActModel = {
			startDate: moment().startOf('day').format('YYYY-MM-DD'),
			endDate: moment().add(30, 'days').format('YYYY-MM-DD'),
		};
		await this.$PHPEmpHealthActApi.queryHealthActEUsingPOST(this.pagination.current, this.pagination.pageSize, query)
			.then((resp: any) => {
				this.pagination.total = parseInt(resp.data.data.totalElements);
				// this.eventInfoList = resp.data.data.content;
				resp.data.data.content.forEach((element) => {
					element.date = `${moment(element.actDate).format('YYYY/MM/DD')} ${element.actStartTime}~${element.actEndTime}`;
					this.eventInfoList.push(element);
				});
				// this.eventInfoList = this.eventInfoList.concat(resp.data.data.content);
				const arr = JSON.stringify(this.eventInfoList);
				this.originEventInfoList = JSON.parse(arr);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	async created() {
		await this.getDatas();
		this.tabSelect = 'processing';
	}
}
</script>

<style lang="scss" scoped>
.event__countData {
  margin: 0 5px;
}
.title__info {
  font-size: 12px;
  text-align: left;
  color: #FF3636;
}
.btn__wrap {
  margin: 50px 0;
  button {
    width: 200px;
    max-width: 100%;
  }
}
// 展開更多 btn
.btn__radius--blue {
  transition: all .2s ease-in-out;
  background-color: $COLOR-MAIN10;
  border-radius: 50vh;
  color: $COLOR-MAIN1;
  text-align: center;
  border: 1px $COLOR-MAIN10 solid;
  outline: 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  padding: 8px 25px;
}
</style>
