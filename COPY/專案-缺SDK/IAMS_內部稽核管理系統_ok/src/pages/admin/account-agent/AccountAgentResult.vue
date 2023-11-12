<template>
  <div class="container">
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <template v-if="result === 'success'">
          <div>
            親愛的同仁您好，
            <br>
            {{ successStr }}
          </div>
        </template>

        <template v-else>
          <div>
            親愛的同仁您好，
            <br>
            您欲{{ type }}的代理事項，因{{ msg }}因素無法進行。
            <br>
            如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
          </div>
        </template>
      </template>
      <template v-slot:buttons>
        <div class="btn__wrap">
          <button
            class="btn__radius--primary me-1"
            href="#"
            @click="goback"
          >
            返回主頁
          </button>
        </div>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@/components/admin/Result.vue';

@Component({ components: { Result } })
export default class AccountAgentResult extends Vue {
	result: 'success' | 'fail' = null;

	// 錯誤訊息
	msg = null;

	// 取得 Query 並帶入資料
	setParam() {
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.result = $query.result;
			this.msg = $query.msg;
  	}
	}

	get type() {
		return this.$route.params.type === 'edit' ? '編輯' : '建立';
	}

	get successStr() {
		return this.$route.params.type === 'edit' ? '您欲編輯的代理事項已完成，謝謝。' : '您欲建立的代理事項已成功，並已發送通知給指定代理人，謝謝。';
	}

	/**
   * Event
   */
	goback() {
		this.$router.push({ name: 'AccountAgentIndex' });
	}

	/**
   * Hook
   */
	created() {
		this.setParam();
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
