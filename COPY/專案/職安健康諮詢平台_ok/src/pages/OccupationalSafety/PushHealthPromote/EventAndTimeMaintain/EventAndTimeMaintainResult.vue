<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '編輯成功':'編輯失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div>
          <div class="page__card__info">
            <!-- 成功訊息 -->
            <template v-if="result === 'success'">
              <p>親愛的護理人員您好，您欲編輯的報名人員資訊已完成，謝謝。</p>
            </template>

            <!-- 失敗訊息 -->
            <template v-else>
              <p>親愛的護理人員您好，</p>
              <p>您欲編輯的報名人員資訊，因{{ errorMsg }}。</p>
              <p>如尚需編輯此資訊，請您再次嘗試，或與相關服務人員聯繫，謝謝您！</p>
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
export default class EventAndTimeMaintainResult extends Vue {
  /**
   * data
   */
  errorMsg = null;

  result: 'success' | 'fail' = null;

  publicMail = null

  setResultParam() {
  	const {
  		result, errorMsg,
  	} = this.$global.getQuery();
  	this.result = result;
  	this.errorMsg = errorMsg;
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
  async created() {
  	this.setResultParam();
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

  .registerName {
    color: $COLOR-MAIN1;
  }

  .notice {
    color: $COLOR-GRAY1;
  }

</style>
