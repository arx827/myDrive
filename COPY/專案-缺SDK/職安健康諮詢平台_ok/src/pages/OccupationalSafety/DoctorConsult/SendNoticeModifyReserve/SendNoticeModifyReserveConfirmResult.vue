<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? typeName+'預約成功':typeName+'預約失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <!-- 成功訊息 -->
        <div v-if="result === 'success'">
          <div
            v-if="infoData"
            class="reservation__card__wrap row"
          >
            <div class="reservation__card__item col-md">
              <i class="reservation__card__icon card__icon-location" />
              <div class="info__item__title">
                預約地點
              </div>
              <div class="info__item__data">
                {{ infoData.reserveLoction }}
              </div>
            </div>
            <div class="reservation__card__item col-md">
              <i class="reservation__card__icon card__icon-date" />
              <div class="info__item__title">
                預約時間
              </div>
              <div class="info__item__data">
                {{ infoData.actDate }}
              </div>
            </div>
            <div class="reservation__card__item col-md">
              <i class="reservation__card__icon card__icon-time" />
              <div class="info__item__title">
                預約時段
              </div>
              <div class="info__item__data">
                {{ infoData.sessionStartDate }}~{{ infoData.sessionEndDate }}
              </div>
            </div>
            <div class="reservation__card__item col-md">
              <i class="reservation__card__icon card__icon-doctor" />
              <div class="info__item__title">
                值班醫師
              </div>
              <div class="info__item__data">
                {{ infoData.physicianName }}
              </div>
            </div>
          </div>
          <div class="font--black pt-4">
            <p>親愛的護理同仁您好，</p>
            <p>您已完成 <span class="text-green">{{ (infoData.reserveName === '無預約') ? empName : infoData.reserveName }}</span> 同仁的諮詢預約，再請留意是否需要「發送提醒通知」，謝謝！</p>
          </div>
        </div>
        <!-- 失敗訊息 -->
        <div
          v-else
          class="font--black"
        >
          <p>親愛的護理同仁您好，</p>
          <p>您欲{{ typeWord }}的預約，因{{ msg }}因素無法進行{{ typeWord }}。</p>
          <p>如尚需{{ typeWord }}此項預約，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/PhyConsult/sendNoticeModifyReserve/result">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >繼續{{ typeWord }}預約</a>
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
  infoData = {};

  // 錯誤訊息
  msg = '';

  typeName = '新增';

  typeWord = '新增';

  // 員工姓名
  empName = null;

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.setParam(query);
  	if (this.result === 'success') {
  		this.getData(query);
  	} else {
  	  this.msg = query.message.join('、');
  	}
  }

  setParam(query) {
  	if (this.$route.params.type === 'edit') {
  		this.typeName = '編輯';
  		this.typeWord = '修改';
  	} else {
  		this.empName = query.empName;
  	}
  }

  getData(query) {
  	this.infoData = query.data;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  // 預約資訊
  .reservation__card__wrap {
    margin: 25px -4px 0;
  }
  .reservation__card__item {
    border-radius: 4px;
    border: 1px solid $COLOR-MAIN9;
    flex: 1;
    margin: 4px;
    padding: 40px 35px 16px;
    text-align: center;
    color: $COLOR-GRAY1;
  }
  .reservation__card__icon {
    display: block;
    width: 66px;
    height: 66px;
    margin: 0 auto;
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
    margin-top: 20px;
    font-size: 16px;
    font-weight: 600;
  }
  .info__item__data {
    margin-top: 5px;
    font-size: 18px;
  }

  .text-green {
    color: $TEXT-GREEN;
  }
  .font--black {
    color: #000;
  }
</style>
