<template>
  <div
    v-if="data"
    class="container"
  >
    <div class="page__title">
      活動資訊
    </div>
    <div class="event__wrap">
      <!-- banner -->
      <div class="event__block banner__block">
        <div class="block__content d-flex align-items-center justify-content-center">
          <!-- banner img 擺放位置 -->
          <img
            class="img-fluid"
            :src="data.edmBannerPath"
            alt=""
          >
        </div>
      </div>

      <!-- 活動資訊 -->
      <div class="event__block">
        <div class="row">
          <div class="col-lg-2 col-12">
            <div class="block__title">
              活動資訊
            </div>
          </div>
          <div class="col-lg-10 col-12">
            <div class="info__item__content editor__preview">
              <p>活動名稱：{{ data.actName }}</p>
              <p>活動日期：{{ data.date }}</p>
              <p>活動地點：地點依各場次為主</p>
              <p>活動狀態：{{ data.isExpired === 'Y' ? '已結束':'進行中' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 活動說明 -->
      <div class="event__block">
        <div class="row">
          <div class="col-lg-2 col-12">
            <div class="block__title">
              活動說明
            </div>
          </div>
          <div class="col-lg-10 col-12">
            <div class="block__content editor__preview">
              <div v-html="data.actDesc" />
            </div>
          </div>
        </div>
      </div>

      <!-- 個資聲明 -->
      <div class="event__block">
        <div class="row">
          <div class="col-lg-2 col-12">
            <div class="block__title">
              個資聲明
            </div>
          </div>
          <div class="col-lg-10 col-12">
            <div class="block__content editor__preview">
              <div v-html="data.personalInfoStatement" />
            </div>
          </div>
        </div>
      </div>

      <div class="btn__wrap text-center">
        <div class="row">
          <div
            class="col"
            :class="{'text-end' : showSignUpBtn}"
          >
            <button
              class="btn__radius--primary--outline"
              @click="goMainPage()"
            >
              返回
            </button>
          </div>
          <div
            v-if="showSignUpBtn"
            class="col text-start"
          >
            <button
              class="btn__radius--primary"
              @click="goRegisterPage()"
            >
              我要報名
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import moment from 'moment';

@Component({})
export default class HealthPromoteDescrip extends Vue {
  @Action('setLoading') setLoading;

  data = null

  actId = null

  prevPageInfo = null

  showSignUpBtn = true

  /**
   * Event
   */
  // 回到健康促進服務頁面
  goMainPage() {
  	this.$router.push({ name: 'HealthPromoteIndex' });
  }

  // 前往報名資訊
  goRegisterPage() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'HealthPromoteRegister',
  		query: {
  			actId: this.actId,
  			data: this.data,
  		},
  	});
  }

  // 取得頁面資料
  getDatas() {
  	const query = this.$global.getQuery();
  	this.actId = query.actId;
  	this.prevPageInfo = query.data;
  	this.showSignUpBtn = this.prevPageInfo.isSignUp === 'N' && this.prevPageInfo.isExpired === 'N'; // 沒報名過且活動沒過期 才顯示報名紐
  	console.log(this.prevPageInfo);
  	this.setLoading(true);
  	this.$PHPEmpHealthActApi.getHealthActEUsingPOST(this.actId)
  		.then((resp) => {
  			this.data = resp.data.data;
  			this.data.date = `${moment(this.data.actDate).format('YYYY/MM/DD')} ${this.data.actStartTime}~${this.data.actEndTime}`;
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
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    margin-bottom: 10px;
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
  .block__content {
    flex: 1;
    line-height: 1.8;
  }
  .banner__block {
    margin-bottom: 46px;
    .block__content {
      width: 100%;
      // height: 285px;
      border-radius: 2px;
      background: #E6EFFE;
      overflow: hidden;
    }
  }
  .info__item__content {
    font-size: 16px;
    font-weight: $TEXT-BOLD;
    color: $COLOR-BLACK;
  }
  .info__item__block {
    margin-top: 20px;
  }
</style>
