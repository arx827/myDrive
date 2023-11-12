<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '報名成功':'報名失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div>
          <div class="page__card__info">
            <p>親愛的主管、同仁您好，</p>

            <!-- 成功訊息 -->
            <template v-if="result === 'success'">
              <p>感謝您的填寫，我們已經收到您的報名資訊。請依活動時間及地點前往參加，謝謝您</p>
              <p class="mt-4">
                主辦單位：職安管理部
              </p>
            </template>

            <!-- 失敗訊息 -->
            <template v-else>
              <p>溫馨提醒～ 您欲參加的健康活動，因<span class="fw-bold"> {{ message }} </span>因素無法進行預約。</p>
              <p>如尚需諮詢服務，請您再次預約。或與相關服務人員聯繫，謝謝您！</p>
              <p class="mt-4">
                相關問題也可聯繫健康促進公務信箱 <a
                  class="text-link"
                  :href="`mailto:${publicMail}`"
                >{{ publicMail }}</a> 。
              </p>
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
import Result from '@/components/shared/layout/Result.vue';

@Component({
	components: { Result },
})
export default class HealthPromoteResult extends Vue {
  /**
   * data
   */
  result: 'success' | 'fail' = null;

  message = null;

  publicMail = null;

  /**
   * Event
   */
  // 回到健康促進服務頁面
  goMainPage() {
  	this.$router.push({ name: 'HealthPromoteIndex' });
  }

  /**
   * HOOK
   */
  async created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.message = query.message;
	  this.publicMail = await this.$global.getPublicEmail();
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

</style>
