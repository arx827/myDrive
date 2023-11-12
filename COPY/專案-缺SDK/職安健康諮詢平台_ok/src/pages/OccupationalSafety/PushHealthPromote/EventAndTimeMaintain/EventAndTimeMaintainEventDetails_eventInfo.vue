<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="page__title">
        活動與場次維護：活動頁
      </div>
      <div class="pt-4">
        <button
          class="btn__radius--primary--outline--small"
          :disabled="actStatus == '進行中' || actStatus == '已結束'"
          @click="goEdit"
        >
          編輯
        </button>
      </div>
    </div>
    <div class="page__card form__card">
      <!-- banner -->
      <div
        v-if="dataGroup.picture"
        class="event__block"
      >
        <div class="event__title">
          活動EDM Banner
        </div>
        <div class="block__content">
          <img
            class="img-fluid mt-3"
            :src="dataGroup.picture"
          >
        </div>
        <!-- banner img 外開連結 -->
        <div
          v-if="dataGroup.picture"
          class="link__block"
        >
          <a-icon
            type="paper-clip"
            class="icon__style"
          />
          <a
            :title="dataGroup.fileName"
            :href="dataGroup.picture"
            :download="dataGroup.fileName"
            class="link__style"
          >
            {{ dataGroup.fileName }}
          </a>
        </div>
      </div>

      <!-- 活動摘要 -->
      <div
        v-if="dataGroup.actSummary"
        class="event__block"
      >
        <div class="event__title">
          活動摘要
        </div>
        <div class="info__item__content editor__preview">
          <div v-html="dataGroup.actSummary" />
        </div>
      </div>

      <!-- 活動說明 -->
      <div
        v-if="dataGroup.actDesc"
        class="event__block"
      >
        <div class="event__title">
          活動說明
        </div>
        <div class="info__item__content editor__preview">
          <div v-html="dataGroup.actDesc" />
        </div>
      </div>

      <!-- 個資聲明 -->
      <div
        v-if="dataGroup.personalInfoStatement"
        class="event__block"
      >
        <div class="event__title">
          個資聲明
        </div>
        <div class="block__content editor__preview">
          <div v-html="dataGroup.personalInfoStatement" />
        </div>
      </div>
    </div>
    <div class="btn__wrap text-center">
      <button
        class="btn__radius--primary--outline"
        @click="handlePrevStep()"
      >
        返回
      </button>
      <button
        class="btn__radius--primary"
        @click="goNextPage()"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component({})
export default class EventAndTimeMaintainEventDetails_eventInfo extends Vue {
  @Action('setLoading') setLoading;

  /**
   * data
   */
  actId = null;

  actStatus = '';

  dataGroup = {
  	picture: null, // banner圖網址
  	fileName: null,
  	actSummary: null,
  	actDesc: null,
  	personalInfoStatement: null,
  };

  /**
   * func
   */
  // API: 查詢單一健康促進活動API
  getActInfo() {
  	this.setLoading(true);
  	this.$PHPRpnEventSessionMaintainApi.getOneHealthActRpnUsingPOST(this.actId)
  		.then((resp) => {
  			// TEST:
  			// console.log(resp);
  			if (resp.data.status == 200) {
  				const {
  					actId, picture, edmBannerFileName, actDesc, actSummary, personalInfoStatement,
  				} = resp.data.data;
  				this.actId = actId;
  				Object.assign(this.dataGroup, {
  					picture,
  					fileName: edmBannerFileName,
  					actDesc,
  					actSummary,
  					personalInfoStatement,
  				});
  				console.log(this.dataGroup);
  			} else {
  				this.$infoNotification.error({
  					content: '無法完成查詢項目，請再次嘗試。',
  				});
  				this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  			}
  		})
  		.catch((error) => {
  			console.log('error actStatus = ', error);
  			this.$infoNotification.error({
  				content: '無法完成查詢項目，請再次嘗試。',
  			});
  			this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  		})
  		.finally(() => {
  			this.setLoading(false);
  		});
  }

  setResultParam() {
  	const query = this.$global.getQuery();
  	this.actId = query?.actId;
  	this.actStatus = query?.actStatus;
  	this.getActInfo();
  }

  /**
   * Hook
   */
  created() {
  	this.setResultParam();
  }
  /**
   * Event
   */

  goEdit() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventAddAndEditStep1',
  		params: {
  			type: 'edit',
  		},
  		query: { actId: this.actId },
  	});
  }

  // 點擊按鈕，『上一步』
  handlePrevStep() {
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainIndex',
  	});
  }

  goNextPage() {
  	// sessionStorage.setItem('form_step1', JSON.stringify(this.dataGroup));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'EventAndTimeMaintainEventDetails_eventTime',
  		query: {
  			actId: this.actId,
  			actStatus: this.actStatus,
  		},
  	});
  }
}
</script>

<style lang="scss" scoped>
  .lists__num {
    list-style: inside decimal;
    width: 100%;
  }
  .form__card {
    background: $COLOR-MAIN10;
    padding: 30px 92px;
  }
  .event__block {
    margin-bottom: 20px;
  }
  .event__title {
    font-size: 16px;
    font-weight: 600;
    color: $COLOR-MAIN1;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .block__title {
    width: 180px;
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

  .btn__wrap {
    margin: 50px 0;
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
    .btn__view {
      width: 100px;
      margin: 0;
    }
  }
  .img__content {
    width: 904px;
    height: 236px;
  }

  .link__block {
    margin-bottom: 30px;
  }

  .icon__style {
    font-size: 11px !important;
    color: #8C8C8C;
  }

  .link__style {
    color: #1797FB;
    font-size: 14px;
  }

  .info__item__content {
    font-size: 16px;
    line-height: 29px;
    color: $COLOR-BLACK;
    ::v-deep {
      p {
        margin-bottom: 0;
      }
    }
  }
  .info__item__block {
    margin-top: 20px;
  }
</style>
