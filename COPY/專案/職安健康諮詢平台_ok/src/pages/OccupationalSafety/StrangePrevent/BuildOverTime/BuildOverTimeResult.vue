<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '檢核上傳成功':'檢核上傳失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，
          <br>
          您欲上傳的資料檔案已建立，共計{{ count }}筆資料，謝謝！
        </div>
        <div v-else>
          親愛的護理同仁您好，
          <br>
          您欲上傳的檔案，因{{ apiError }}。
          <br>
          如尚需上傳檔案，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link :to="'/occupationSafety/AbnormalLoad/buildOverTime/index'">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回維護主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class BuildOverTimeResult extends Vue {
  result: 'success' | 'fail' = null;

  count = null;

  apiError = null;

  setResultParam() {
  	const query = this.$global.getQuery();
  	const { result, count, apiError } = query;
  	this.result = result;
  	this.count = count;
  	this.apiError = apiError && this.$global.getApiErrorMsg(apiError).join('');
  }

  created() {
  	this.setResultParam();
  }
}
</script>

<style>

</style>
