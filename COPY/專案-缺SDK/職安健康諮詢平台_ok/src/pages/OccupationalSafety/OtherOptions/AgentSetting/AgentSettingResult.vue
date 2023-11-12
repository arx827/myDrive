<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success' && type==='建立'">
          親愛的同仁您好，
          <br>
          您欲建立的代理事項已成功，並已發送通知給指定代理人，謝謝。
        </div>
        <div v-if="result === 'fail' && type==='建立'">
          親愛的同仁您好，
          <br>
          您欲建立的代理事項，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>

        <div v-if="result === 'success' && type==='編輯'">
          親愛的同仁您好，
          <br>
          您欲編輯的代理事項已完成，謝謝。
        </div>
        <div v-if="result === 'fail' && type==='編輯'">
          親愛的同仁您好，
          <br>
          您欲編輯的代理事項，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <div class="btn__wrap">
          <router-link to="/occupationSafety/Other/agentSetting/index">
            <button
              class="btn__radius--primary me-1"
              href="#"
            >
              返回主頁
            </button>
          </router-link>
        </div>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class CaseMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  type = '建立';

  // 錯誤訊息
  msg = null;

  created() {
  	if (this.$route.params.type === 'add') {
  		this.type = '建立';
  	} else if (this.$route.params.type === 'edit') {
  		this.type = '編輯';
  	}
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.result = $query.result;
  		this.msg = $query.msg;
  	}

  	console.log(this.type, this.result);
  }
}
</script>

<style lang="scss" scoped>
  .btn__wrap {
    button {
      width: 200px;
      max-width: 100%;
      margin: 0 5px;
    }
  }
</style>
