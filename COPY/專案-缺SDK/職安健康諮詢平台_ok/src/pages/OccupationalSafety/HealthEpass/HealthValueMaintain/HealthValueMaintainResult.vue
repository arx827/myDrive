<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${paramsType}成功`:`${paramsType}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div>
          親愛的護理同仁您好，
        </div>
        <div v-if="result === 'success'">
          您欲{{ paramsType }}的項目已完成，謝謝！
        </div>
        <div v-else>
          您欲{{ paramsType }}的內容，因{{ msg }}。
          <br>
          如尚需{{ paramsType }}數值，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/HealthCheck/healthValueMaintain/list">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回健檢數值維護</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class HealthValueMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  paramsType = '';

  msg = '';

  setResultParam() {
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.paramsType = $query.type;
  		this.result = $query.result;
  		this.msg = $query.msg;
  	}
  }

  created() {
  	this.setResultParam();
  }
}
</script>

<style>

</style>
