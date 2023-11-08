<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的同仁您好，
          <br>
          您欲{{ type }}的項目已處理成功，謝謝。
        </div>
        <div v-else>
          親愛的同仁您好，
          <br>
          您欲{{ type }}項目，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/Other/userMaintain/index">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Result from '@shared/layout/Result.vue';

@Component({ components: { Result } })
export default class UserMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  msg = null;

  type = '覆核';

  // 取得 Query 並帶入資料
  setParam() {
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.result = $query.result;
  		this.result = $query.result;
  		this.msg = $query.msg;
  	}
  }

  /**
   * Event
   */
  goback() {
  	this.$router.push({ name: 'UserMaintainIndex' });
  }

  /**
   * Hook
   */
  created() {
  	this.setParam();
  }
}
</script>
