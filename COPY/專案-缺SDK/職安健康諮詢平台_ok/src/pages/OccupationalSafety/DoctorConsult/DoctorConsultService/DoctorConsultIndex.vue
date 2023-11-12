<template>
  <div class="container">
    <div class="page__title">
      醫師諮詢服務
    </div>
    <div class="event__wrap">
      <!-- banner -->
      <div class="event__block banner__block">
        <div
          class="block__content"
          :class="{ 'block__minH': !pageInfo.edmBannerPath}"
        >
          <!-- banner img 擺放位置 -->
          <img
            class="img-fluid mx-auto"
            :src="pageInfo.edmBannerPath"
          >
        </div>
      </div>

      <!-- 活動說明 -->
      <div class="event__block d-lg-flex editor__preview align-items-start">
        <div class="block__title">
          活動說明
        </div>
        <div
          class="block__content"
          v-html="pageInfo.description"
        />
      </div>

      <!-- 預約規範 -->
      <div class="event__block d-lg-flex editor__preview align-items-start">
        <div class="block__title">
          預約規範
        </div>
        <div
          class="block__content"
          v-html="pageInfo.appointmentSpec"
        />
      </div>

      <!-- 個資聲明 -->
      <div class="event__block d-lg-flex editor__preview align-items-start">
        <div class="block__title">
          個資聲明
        </div>
        <div
          class="block__content"
          v-html="pageInfo.personalInfoStatement"
        />
      </div>
    </div>
    <div class="btn__wrap text-center">
      <router-link :to="{ name: 'DoctorConsultReservation' }">
        <button class="btn__radius--primary">
          我要預約
        </button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { PhyConsultReserveQueryDto } from '@fubonlife/oss-api-axios-sdk';

@Component({})
export default class DoctorConsultIndex extends Vue {
  @Prop()
  breadcrumb: {};

  @Action('setLoading') setLoading;

  pageInfo: PhyConsultReserveQueryDto = {
  	appointmentSpec: '', // 預約規範
  	configId: 0, // 醫師諮詢入口設定代碼
  	description: '', // 說明文字
  	edmBannerPath: '', // EDM Banner路徑
  	personalInfoStatement: '', // 個資聲明
  }

  // API: 取得活動資訊
  getPhyConsultConfig() {
  	this.setLoading(true);
  	this.$PCRRpnPortalApi.getPhyConsultConfigRpnUsingPOST()
  		.then((resp) => {
  			if (resp.data.status == 200) {
  				const getData = resp.data.data;
  				this.pageInfo = getData;
  			} else {
  				// 查找失敗訊息
  			}
  		})
  		.catch((error) => {
  			// API失敗
  			console.log(error.response);
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  /**
   * Hook
   */
  created() {
  	this.getPhyConsultConfig();
  }
}
</script>

<style lang="scss" scoped>
  .event__wrap {
    .lists__num {
      list-style: inside decimal;
    }
  }

  .banner__block {
    // margin-bottom: 46px;
    .block__content {
      width: 100%;
      border-radius: 2px;
      background: #E6EFFE;
    }
    .block__minH {
      min-height: 98px;
      @include rwd-lg {
        min-height: 228px;
      }
      @include rwd-xl {
        min-height: 285px;
      }
    }
  }

  .event__block {
    margin-bottom: 20px;
  }
  .block__title {
    width: 180px;
    color: $COLOR-BLACK;
    font-weight: $TEXT-BOLD;
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 1.8;
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
    word-break: break-word;
  }

  .btn__wrap {
    margin: 39px 0;
    @include rwd-xl {
      margin: 50px 0;
    }
    button {
      width: 150px;
      max-width: 100%;
      @include rwd-xl {
        width: 200px;
      }
    }
  }
</style>
