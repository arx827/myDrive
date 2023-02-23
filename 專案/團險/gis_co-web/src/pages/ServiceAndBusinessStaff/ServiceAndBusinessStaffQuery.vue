<template>
  <div class="outside">
    <Breadcrumb :breadcrumb="breadcrumb" />
    <div class="container">
      <div class="query__wrap-result">
        <h2 class="query__title">
          <span>服務及業務人員查詢</span>
        </h2>
      </div>
      <div class="landing bg--light">
        <div>
          <img
            src="@/assets/image_lotPeople.svg"
            alt=""
          >
        </div>
        <div class="landing__text">
          <span>需要幫忙嗎？ 讓我們來幫你！</span>
        </div>
      </div>
      <div class="content">
        <div class="row">
          <div
            v-for="(item,index) in cardData"
            :key="index"
            class="col-lg-4 col-md-6 col"
          >
            <div class="card">
              <div class="card__content">
                <p class="content__name">
                  {{ item.name }}
                </p>
                <span class="content__service">
                  {{ item.serviceTeam }}
                </span>
                <div class="content__contact">
                  <img
                    class="content__contact-img"
                    src="@/assets/image_phone.svg"
                    alt=""
                  >
                  <p
                    class="content__contact-text"
                  >
                    {{ item.tel }}
                  </p>
                </div>
                <div class="content__contact">
                  <img
                    class="content__contact-img"
                    src="@/assets/image_email.svg"
                    alt=""
                  >
                  <p class="content__contact-text">
                    {{ item.email }}
                  </p>
                </div>
              </div>
              <div class="card__bottom" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop,
} from 'vue-property-decorator';
import { Action } from 'vuex-class';
import {
	PolicyModel,
} from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import notificationModal from '@/plugins/info/infoModal';

@Component({ components: { Breadcrumb } })
export default class ServiceAndBusinessStaffQuery extends Vue {
  @Prop()
  breadcrumb: {}

  @Action('setLoading') setLoading;

	h = this.$createElement;

  //  當前登入者資料PolicyModel
  policyModel: PolicyModel;

  cardData = [];

  created() {
  	this.policyModel = this.$userInfo.getPolicyModel();
  	this.getData();
  }

  getData() {
  	this.setLoading(true);
  	this.$serviceAndBusinessStaff.listUsingPOST(this.policyModel)
  		.then((resp) => {
  			console.log(resp);
  			if (resp.data.status === 200) {
  				this.cardData = resp.data.data;
  			} else {
  				notificationModal.alertForListError({
  					contentList: this.$global.getApiErrorMsg(resp.data.apiError),
  				});
  			}
  		})
  		.catch((err) => {
  			console.log(err);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.outside{
  min-height: calc(100vh - 156px);
  background-color: $COLOR-MAIN4;
}
.landing{
  height: 177px;
  border-top-left-radius: 70px;
  border-top-right-radius: 70px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.landing__text{
  font-size: 18px;
  height: 35px;
  background-color: #E2ABAB;
  width: 100%;
  color: aliceblue;
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 0px 0px 4px 4px;
}
.content{
  padding-bottom: 68px;
}
.card{
  padding-bottom: 0;
  margin-top: 16px;
}
.card__content{
  padding-left: 16px;
}
.content__name{
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px
}
.content__service{
  color: #fff;
  background-color: #595959;
  padding: 3px 5px;
  border-radius: 10px;
  font-size: 12px;
}
.content__contact{
  display: flex;
  margin-top: 10px;
  align-items: center;
}
.content__contact-text{
  margin: 0;
  margin-left: 12px;
}
.card__bottom{
  background-color:$COLOR-MAIN2;
  height: 10px;
  margin-top: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
