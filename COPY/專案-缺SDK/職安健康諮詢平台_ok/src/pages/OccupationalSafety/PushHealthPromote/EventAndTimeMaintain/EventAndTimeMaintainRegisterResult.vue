<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '新增報名成功':'新增報名失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div>
          <div class="page__card__info">
            <p>親愛的護理同仁您好，</p>

            <!-- 成功訊息 -->
            <template v-if="result === 'success'">
              <p>您已完成<span class="registerName"> {{ personInfo.info }}{{ personInfo.name }} </span>同仁的活動報名， <span class="notice">再請留意是否需要「發送提醒通知」，謝謝！</span></p>
            </template>

            <!-- 失敗訊息 -->
            <template v-else>
              <p>您欲協助新增的活動報名人員，因{{ errorMsg }}。</p>
              <p>如尚需修改此項預約，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
            </template>
          </div>
        </div>
      </template>
      <template v-slot:buttons>
        <button
          class="form__btn btn__radius--primary"
          @click="goMainPage()"
        >
          返回活動主頁
        </button>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import Result from '@/components/shared/layout/Result.vue';

@Component({
	components: { Result },
})
export default class EventAndTimeMaintainRegisterResult extends Vue {
   @Action('setLoading') setLoading;

  /**
   * data
   */
  errorMsg = null;

  result: 'success' | 'fail' = null;

  personInfo = {}

  setResultParam() {
  	const {
  		result, name, uid, errorMsg,
  	} = this.$global.getQuery();
  	this.result = result;
  	this.errorMsg = errorMsg;

  	Object.assign(this.personInfo, { name, uid });
  }

  /**
   * Event
   */
  // 回到活動與場次維護頁面
  goMainPage() {
  	this.$router.push({ name: 'EventAndTimeMaintainIndex' });
  }

  /**
   * HOOK
   */
  created() {
  	this.setResultParam();
  }
}
</script>

<style lang="scss" scoped>
  .page__card__info {
    margin-top: 20px;
    * {
      font-size: 18px;
      color: $COLOR-BLACK;
      line-height: 2;
      margin-bottom: 0;
    }
  }
  // 超連結樣式
  .text-link {
    color: $COLOR-MAIN15;
    text-decoration: underline;
  }

  .registerName {
    color: $COLOR-MAIN1;
  }

  .notice {
    color: $COLOR-GRAY1;
  }

</style>
