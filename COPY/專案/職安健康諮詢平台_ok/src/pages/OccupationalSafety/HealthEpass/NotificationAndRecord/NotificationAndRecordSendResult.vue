<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '發送成功':'發送失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好， 您欲發送衛教/醫師諮詢的項目已完成，謝謝！
        </div>
        <div v-else>
          {{ errorMsg }}
        </div>
      </template>
      <template v-slot:buttons>
        <div class="btn__wrap">
          <button
            class="btn__radius--primary--outline me-1"
            @click="backSearch"
          >
            回到搜尋頁
          </button>
          <button
            class="btn__radius--primary me-1"
            @click="back"
          >
            繼續發送
          </button>
        </div>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class NotificationAndRecordSendResult extends Vue {
  result: 'success' | 'fail' = null;

  errorMsg: string = ''

  back() {
  	// 繼續發送
  	history.go(-1);
  }

  backSearch() {
  	this.$router.push({ name: 'NotificationAndRecordQuery' });
  }

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  }
}
</script>

<style>

</style>
