<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success' && type === '覆核'">
          親愛的同仁您好，
          <br>
          您欲覆核同意的項目已處理成功，謝謝。
        </div>
        <div v-if="result === 'success' && type === '退回'">
          親愛的同仁您好，
          <br>
          您欲覆核退回的項目已處理成功，謝謝。
        </div>
        <div v-if="result === 'fail' && type === '覆核'">
          親愛的同仁您好，
          <br>
          您欲處理的待覆核項目，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
        <div v-if="result === 'fail' && type === '退回'">
          親愛的同仁您好，
          <br>
          您欲退回的項目，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <div class="btn__wrap">
          <router-link to="/occupationSafety/Other/loginCheckWork/index">
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class DocTalkFormResult extends Vue {
  result: 'success' | 'fail' = null;

  type = '退回';

  msg = '';

  created() {
  	if (this.$route.params.type === 'check') {
  		this.type = '覆核';
  		this.result = this.$global.getQuery().result;
  		this.msg = this.$global.getQuery().errorMsg;
  	} else if (this.$route.params.type === 'back') {
  		this.type = '退回';
  		this.result = this.$global.getQuery().result;
  		this.msg = this.$global.getQuery().errorMsg;
  	}
  }
}
</script>

<style lang="scss" scoped>
  .btn__wrap {
    margin-bottom: 40px;
    button {
      width: 200px;
      max-width: 100%;
    }
  }
</style>
