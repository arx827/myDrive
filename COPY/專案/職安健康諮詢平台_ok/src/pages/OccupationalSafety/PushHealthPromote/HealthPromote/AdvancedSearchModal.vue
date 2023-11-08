<template>
  <div>
    <a-modal
      v-model="modalVisible"
      class="common__modal advance__modal"
      :mask-closable="false"
      :after-close="onClose"
      :width="'90%'"
      on-ok="handleOk"
      :footer="null"
    >
      <template slot="title">
        <div class="page__title m-0">
          進階查詢 (可擇一查詢)
        </div>
      </template>
      <template slot="closeIcon">
        <a-icon type="close" />
      </template>
      <div class="searchModal__wrap">
        <div class="searchModal-header__wrap">
          <a-form-model
            class="form__wrap"
            :model="form"
            layout="vertical"
          >
            <a-row
              :gutter="[15, 0]"
            >
              <a-col
                :md="12"
                :sm="24"
              >
                <a-form-model-item
                  class="formItem-row"
                  label="活動區間"
                  prop=""
                >
                  <date-picker
                    v-model="form.date"
                    class="d-none d-md-block"
                    style="width: 100%"
                    type="date"
                    :range-separator="'~'"
                    :range="true"
                  />
                  <div class="row d-flex d-md-none">
                    <div class="col-6 position-relative">
                      <date-picker
                        v-model="form.startDate"
                        style="width: 100%"
                        type="date"
                        :disabled-date="disabledStartDate"
                        @openChange="handleStartOpenChange"
                      />
                      <span style="position: absolute; right: -4px;">~</span>
                    </div>
                    <div class="col-6">
                      <date-picker
                        v-model="form.endDate"
                        style="width: 100%"
                        type="date"
                        :disabled-date="disabledEndDate"
                        @openChange="handleEndOpenChange"
                      />
                    </div>
                  </div>
                </a-form-model-item>
              </a-col>
              <a-col
                :md="12"
                :sm="24"
              >
                <a-form-model-item
                  class="formItem-row"
                  label="活動名稱"
                  prop=""
                >
                  <a-input
                    v-model="form.name"
                    type="text"
                    placeholder="e.g.健康講座123-地震保命三步驟"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>

        <div class="btn__wrap text-center">
          <div class="row">
            <div class="col-6 text-end">
              <button
                class="btn__radius--primary--outline--small"
                @click="handleCancel"
              >
                取消
              </button>
            </div>
            <div class="col-6 text-start">
              <button
                class="btn__radius--primary--bg--small"
                @click="handleSearch"
              >
                查詢
              </button>
            </div>
          </div>
        </div>

        <a-divider dashed />

        <!-- 查詢結果 -->
        <EventCard
          v-if="eventInfoList"
          :event-info-list="eventInfoList"
          :card-grid="{md: 12, sm: 24}"
          :current-page="currentPage"
          :act-detail-page="'HealthPromoteDescrip'"
          @refreshCard="getDatas"
        />
        <div
          v-if="pagination.total > eventInfoList.length && eventInfoList.length!==0"
          class="d-flex justify-content-end"
        >
          <a-pagination
            size="small"
            :total="pagination.total"
            :page-size-options="pagination.pageSizeOptions"
            show-size-changer
            show-quick-jumper
            @change="onPageChange"
            @showSizeChange="onShowSizeChange"
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { HealthActModel, HealthActDto } from '@fubonlife/oss-api-axios-sdk';
import moment from 'moment';
import EventCard from '@/components/shared/card/EventCard.vue';
import InfoModal from '@/plugins/notification/infoModal';

@Component({ components: { EventCard } })
export default class AdvancedSearchModal extends Vue {
  @Action('setLoading') setLoading;

  @Prop()
  modalAdvanceShow: boolean

  modalVisible = false

  /**
   * data
   */
  currentPage: string = 'healthPromote'

  form: {[key: string]: string} = {
  	date: null,
  	startDate: null,
  	endDate: null,
  	name: '',
  }

  endOpen: boolean = false;

  // 活動資料
  eventInfoList: HealthActDto[] = [];

	// 原始活動資料
	originEventInfoList: HealthActDto[] = [];

  pagination = {
  	current: 1,
  	pageSize: 10,
  	total: 25,
  	pageSizeOptions: ['5', '10', '25'],
  }

  @Watch('modalAdvanceShow')
  onChange(val) {
  	this.modalVisible = val;
  }

  /**
   * func
   */
  // 選擇日期 disabled
  disabledDate(current) {
  	// 以當天為基準，禁用過去的時間
  	const date = new Date();
  	// disabled 過去時間 以及 六、日
  	return current && current < moment().startOf('day');
  }

  disabledStartDate(startValue) {
  	const endValue = this.form.endDate;
  	if (!startValue || !endValue) {
  		return false;
  	}
  	return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate(endValue) {
  	const startValue = this.form.startDate;
  	if (!endValue || !startValue) {
  		return false;
  	}
  	return startValue.valueOf() >= endValue.valueOf();
  }

  handleStartOpenChange(open) {
  	if (!open) {
  		this.endOpen = true;
  	}
  }

  handleEndOpenChange(open) {
  	this.endOpen = open;
  }

  /**
   * Event
   */

  // 點擊按鈕，『取消』
  handleCancel() {
  	//
  	this.onClose();
  }

  // 點擊按鈕，『查詢』
  handleSearch() {
  	this.getDatas();
  }

  getDatas() {
  	this.setLoading(true);
  	console.log(this.form.date);
  	const date = this.form.date ? this.form.date : [this.form.startDate, this.form.endDate];
  	console.log(date);
  	const query: HealthActModel = {
  		startDate: date[0] ? moment(date[0]).format('YYYY-MM-DD') : '',
  		endDate: date[1] ? moment(date[1]).format('YYYY-MM-DD') : '',
  		actName: this.form.name,
  	};
  	console.log(query);
  	this.$PHPEmpHealthActApi.queryHealthActEUsingPOST(this.pagination.current - 1, this.pagination.pageSize, query)
  		.then((resp: any) => {
  			this.pagination.total = parseInt(resp.data.data.totalElements);
  			const arr = resp.data.data.content;
  		  arr.forEach((element) => {
  				element.date = `${moment(element.actDate).format('YYYY/MM/DD')} ${element.actStartTime}~${element.actEndTime}`;
  			});
  			this.eventInfoList = arr;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  onPageChange(current) {
  	this.pagination.current = current;
  	this.getDatas();
  }

  onShowSizeChange(current, pageSize) {
  	this.pagination.current = current;
  	this.pagination.pageSize = pageSize;
  	this.getDatas();
  }

  onClose() {
  	this.$emit('closeAdvanceModal');
  }
}
</script>
<style lang="scss" scoped>
.searchModal__wrap {
  padding: 30px 10%;
  .searchModal-tableList__wrap {
    margin-top: 20px;
  }
  @include media-breakpoint-down('sm') {
    padding: 30px 0;
  }
}
.mark-required {
  color: $ERROR-COLOR;
  vertical-align: top;
  display: inline-block;
  margin-left: 5px;
}
.form__wrap {
  margin: 0 auto;
}
.btn__wrap {
  margin: 50px 0;
  button {
    width: 200px;
    max-width: 100%;
  }
}
</style>
