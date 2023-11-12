<template>
  <div>
    <Result
      :page-title="'發送提醒通知結果'"
      :result-title="result === 'success' ? '發送成功':'發送失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <p class="font--black">
          親愛的護理人員您好，
        </p>
        <!-- 成功訊息 -->
        <div v-if="result === 'success'">
          <p class="font--black">
            您欲發送的提醒通知已完成，發送名單如下，敬請查閱，謝謝～
          </p>
          <div class="data__wrap">
            <div class="row data__title data__title--border">
              <div class="col-3 p-0">
                預約日期
              </div>
              <div class="col-3 p-0">
                預約時段
              </div>
              <div class="col-4 p-0">
                預約地點
              </div>
              <div class="col-2 p-0">
                預約人姓名
              </div>
            </div>
            <div class="data__content">
              <div
                v-for="(item, index) in bookData"
                :key="index"
                class="row p-0 mb-2"
              >
                <div class="col-3 p-0">
                  {{ item.actDate }}
                </div>
                <div class="col-3 p-0">
                  {{ item.sessionStartDate }}~{{ item.sessionEndDate }}
                </div>
                <div class="col-4 p-0">
                  {{ item.reserveLoction }}
                </div>
                <div class="col-2 p-0">
                  {{ item.reserveName }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 失敗訊息 -->
        <div
          v-else
          class="font--black"
        >
          <p>您欲修改的預約，因{{ msg }}因素無法進行修改。</p>
          <p>如尚需修改此項預約，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/PhyConsult/sendNoticeModifyReserve/result">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >繼續發送提醒通知</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class SendNoticeModifyReserveSendResult extends Vue {
  result: 'success' | 'fail' = null;

  // 預約資訊
  bookData = [];

  // 錯誤訊息
  msg = '';

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	if (this.result === 'success') {
  		this.getData(query);
  	} else {
  	  this.msg = query.message.join('、');
  	}
  }

  getData(query) {
  	this.bookData = query.data;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .data__wrap {
    background-color: #F5F8FC;
    border-radius: 4px 4px 0px 0px;
    overflow: scroll;
  }
  .data__title--border {
    border-bottom: 0.1px solid #00000017;
  }
  .data__title {
    padding: 12px 70px;
    margin: 0;
    font-weight: 600;
    width: 930px;
  }
  .data__content {
    padding: 12px 78px;
    margin: 0;
    width: 930px;
  }
  .font--black {
    color: #000;
  }
</style>
