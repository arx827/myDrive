<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '編輯成功':'編輯失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，
          <br>
          您欲編輯的項目已完成，謝謝！
        </div>
        <div v-else>
          {{ errorMsg }}
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/MaternalProtect/eventContentMaintain/index">
          <a
            class="btn__radius--primary me-1"
            href="#"
          >返回活動主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class EventContentMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  errorMsg: string = ''

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  }
}
</script>

<style>

</style>
