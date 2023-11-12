<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '填寫成功':'填寫失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <p>親愛的同仁您好，</p>
        <!-- 成功訊息 -->
        <div v-if="result === 'success'">
          <p>您已成功送出問卷，謝謝填答！如有任何相關疑問，請洽護理師。</p>
        </div>
        <!-- 失敗訊息 -->
        <div
          v-else
        >
          <p>您欲填寫的問卷，因{{ errorMsg }}因素無法進行。</p>
          <p>如尚需填寫，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/ErgonomicHazard/RelevantSurvey/index">
          <a
            class="btn__radius--primary px-5"
            href="#"
          >返回主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class RelevantSurveyResult extends Vue {
  result: 'success' | 'fail' = null;

  // 錯誤訊息
  errorMsg: string = ''

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  }
}
</script>
