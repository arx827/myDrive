<template>
  <div class="container">
    <div class="page__title">
      報名資料
    </div>
    <div class="page__card page__card--shadow p-0">
      <div class="page__card__headerTitle">
        活動資訊
      </div>
      <div class="active__info__wrap">
        <div class="active__info__inner">
          <a-row type="flex">
            <a-col
              :lg="24"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動名稱
              </div>
              <div class="info__item__content">
                {{ actInfo.actName }}
              </div>
            </a-col>
            <a-col
              :lg="10"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動日期
              </div>
              <div class="info__item__content">
                {{ actInfo.date }}
              </div>
            </a-col>
            <a-col
              :lg="5"
              :md="12"
              :sm="24"
              :xs="24"
              class="mb-3"
            >
              <div class="info__item__title">
                活動狀態
              </div>
              <div class="info__item__content">
                {{ actInfo.isExpired === 'Y' ? '已結束':'進行中' }}
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <br>
    <div
      v-if="signupInfo"
      class="event__wrap bg__light"
    >
      <div class="active__info__inner">
        <div class="event__block">
          <div class="block__title">
            報名資料填寫
          </div>
          <div class="block__content" />
        </div>
        <div class="row">
          <div class="col-12">
            <div class="infoBox-item">
              <div class="infoBox__title">
                欲報名場次
              </div>
              <h2 v-if="sessionInfo">
                【{{ sessionInfo.buildingName }}_{{ sessionInfo.sessionName }}】{{ sessionInfo.location }}
              </h2>
            </div>
          </div>
          <div class="col-6">
            <div class="infoBox-item">
              <div class="infoBox__title">
                報名人姓名
              </div>
              <h2>{{ signupInfo.name }}</h2>
            </div>
          </div>
          <div class="col-6">
            <div class="infoBox-item">
              <div class="infoBox__title">
                部門/單位
              </div>
              <h2>{{ signupInfo.department }}</h2>
            </div>
          </div>
          <div class="col-6">
            <div class="infoBox-item">
              <div class="infoBox__title">
                聯絡電話
              </div>
              <h2>{{ signupInfo.telNo }}</h2>
            </div>
          </div>
          <div class="col-6">
            <div class="infoBox-item">
              <div class="infoBox__title">
                聯絡信箱
              </div>
              <h2>{{ signupInfo.email }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="goMainPage"
      >
        返回我的報名
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({})
export default class DoctorConsultIndex extends Vue {
  @Action('setLoading') setLoading;

  signupInfo = null

  actInfo = null

  actId = null

  singupInfoId = null

  // TEST: 活動資料
	eventInfoGroup = []

  sessions = []

  sessionInfo = null;

  // 回到我的報名頁面
  goMainPage() {
  	this.$router.push({ name: 'MyRegistrationIndex' });
  }

  // 取得報名資訊
  async getRegisterData() {
  	await this.$PHPEmpHealthActSignupApi.bringSingleInfoUsingPOST({ actId: this.actId, singupInfoId: this.singupInfoId })
  		.then((resp) => {
  			// this.sessionRadios = resp.data.data;
  			console.log(resp);
  			this.signupInfo = resp.data.data;
  			// this.form.name = resp.data.data.name;
  			// this.form.department = resp.data.data.department;
  			// this.form.unit = resp.data.data.unit;
  			// this.form.telNo = resp.data.data.telNo;
  			// this.form.email = resp.data.data.email;
  			// this.form.session = resp.data.data.sessionId;
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取得場次
  async getSession() {
  	// const id = 4;
  	const id = this.actId;
  	await this.$PHPEmpHealthActApi.queryHealthActSessionEUsingPOST(id)
  		.then((resp) => {
  			this.sessions = resp.data.data;
  			console.log(this.sessions);
  		})
  		.catch((error) => {
  			console.log('error status = ', error);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  // 取得報名場次
  getSignupSession() {
  	console.log(this.signupInfo);
  	return this.sessions.find((e) => e.sessionId === this.signupInfo.sessionId);
  }

  async created() {
  	const query = this.$global.getQuery();
  	this.actId = query.actId;
  	this.singupInfoId = query.singupInfoId;
  	this.actInfo = query.data;
  	await this.getRegisterData();
  	await this.getSession();
  	this.sessionInfo = this.getSignupSession();
  	console.log(this.sessionInfo);
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
  .info__item__title {
    font-size: 16px;
    font-weight: 600;
    color: $COLOR-BLACK;
  }
  .info__item__content {
    font-size: 18px;
    color: $COLOR-GRAY1;
  }
// 活動資訊
  .active__info__wrap {
    padding: 30px;
  }
  .active__info__inner {
    max-width: 800px;
    margin: auto;
  }
  .form__card {
    background: $COLOR-MAIN10;
    padding: 30px 92px;
  }
  .form__card__title {
    font-size: 30px;
    font-weight: 600;
    color: $COLOR-MAIN1;
  }
  .form__label__bg {
    background: $COLOR-WHITE;
    line-height: 60px;
    margin: 10px 0px;
    padding-left: 15px;
  }
  .active__info__item__space {
    margin-bottom: 20px;
  }

  .event__wrap {
    padding: 30px;
    // line-height: 28px;
    border-radius: 10px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    color: $COLOR-BLACK;
    margin-bottom: 5px;
    font-size: 20px;
    font-weight: $TEXT-BOLD;
  }
  .infoBox__title {
    color: $COLOR-BLACK;
    margin-bottom: 5px;
    font-weight: $TEXT-BOLD;
  }
  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
  .infoBox-item {
     font-size: 16px;
     margin-bottom: 20px;
    .box-label {
      font-weight: 600;
      color: $COLOR-BLACK;
    }
    h2 {
      color: $COLOR-GRAY1;
    }
  }
  .eventInfo{
    border: $COLOR-GRAY2 solid 1px;
    border-radius: 10px;
  }
  .eventTitle {
    background-color: $COLOR-MAIN1;
    color:$COLOR-WHITE;
    text-align:center;
    padding: 10px;
    font-weight: 600;
    font-size: 20px;
    border-radius: 10px 10px 0 0;
  }
</style>
