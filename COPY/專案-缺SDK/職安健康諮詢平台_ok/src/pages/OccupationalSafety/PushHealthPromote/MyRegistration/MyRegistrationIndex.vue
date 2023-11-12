<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="page__title">
        我的報名
        <!-- <span class="title__info d-none d-md-inline-block">
          保留所有報名紀錄
        </span> -->
      </div>
      <div class="d-none d-md-inline-block">
        共<span class="event__countData">{{ pagination.total }}</span>項
      </div>
    </div>
    <EventCard
      v-if="eventInfoList"
      :act-detail-page="'MyRegistrationDetails'"
      :event-info-list="eventInfoList"
      :current-page="currentPage"
      :card-grid="{md: 8,
                   sm: 24,}"
      @refreshCard="getDatas"
    />
    <!-- 展開更多button -->
    <div class="btn__wrap d-flex justify-content-center">
      <button
        v-show="eventInfoList.length < pagination.total"
        class="btn__radius--primary--outline"
        @click="changeExpandFlag"
      >
        <a-icon type="down" />
        展開更多
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { HealthActModel, HealthActDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import InfoModal from '@/plugins/notification/infoModal';
import InfoNotification from '@/plugins/notification/infoNotification';
import EventCard from '@/components/shared/card/EventCard.vue';

@Component({ components: { EventCard } })
export default class MyRegistrationIndex extends Vue {
  @Action('setLoading') setLoading;
  /**
   * data
   */

  currentPage: string = 'myRegistration'

  // 假活動資料
  eventInfoList: HealthActDto[] = [];

  expandFlag: boolean = false

	pagination = {
		current: 1,
		pageSize: 6,
		total: 0,
	}

	/**
   * methods
   */

	// 展開更多
	changeExpandFlag() {
		this.pagination.current++;
		this.getDatas();
	}

	getDatas() {
  	this.setLoading(true);
		const query: HealthActModel = {
			startDate: '',
			endDate: '',
		};
		this.$PHPEmpHealthActSignupApi.querySingupInfoPageUsingPOST({ pageNo: this.pagination.current - 1, pageSize: this.pagination.pageSize })
			.then((resp: any) => {
				console.log(resp);
				if (resp.data.status === 200) {
					resp.data.data.content.forEach((element) => {
						element.date = `${moment(element.actDate).format('YYYY/MM/DD')} ${element.actStartTime}~${element.actEndTime}`;
						this.eventInfoList.push(element);
					});
					this.pagination.total = parseInt(resp.data.data.totalElements);
				} else {
					InfoNotification.error({ content: this.$global.getApiErrorMsg(resp.data.apiError).join('') });
				}
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
	}

	created() {
		this.getDatas();
	}
}

</script>

<style lang="scss" scoped>
.event__title {
  font-size: 20px;
  color: $COLOR-GRAY11;
  font-weight: bold;
}
.title__info {
  text-align: left;
  color: $COLOR-MAIN21;
  font-size: 12px;
  font-weight: 400;
}
.event__countData {
  margin: 0 5px;
}
::v-deep {
	.ant-radio-group {
		.ant-radio-wrapper {
			display: block;
			+ .ant-radio-wrapper {
				margin-top: 10px;
			}
		}
	}
	.ant-radio-checked {
		.ant-radio-inner {
			border-color: $COLOR-MAIN15;
			&::after {
				background-color: $COLOR-MAIN15;
			}
		}
	}
	.ant-radio-wrapper:hover .ant-radio,
	.ant-radio:hover .ant-radio-inner,
	.ant-radio-input:focus + .ant-radio-inner {
		border-color: $COLOR-MAIN15;
	}
}
.btn__wrap {
  margin: 50px 0;
  button {
    width: 200px;
    max-width: 100%;
  }
}
</style>
