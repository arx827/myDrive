<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '派件成功':'派件失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的護理同仁您好，您欲派件的項目已完成分配，謝謝！
        </div>
        <div v-else>
          親愛的護理同仁您好，
          <br>
          您欲派件的項目，因{{ msg }}因素無法進行。
          <br>
          如尚需執行，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/MaternalProtect/monthMaintain/index">
          <a
            class="btn__radius--primary me-1 btn"
            href="#"
          >返回</a>
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

  // 錯誤訊息
  msg = '';

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	if (this.result === 'fail') {
  		this.msg = query.message.join('、');
  	}
  }
}
</script>

<style lang="scss" scoped>
  .btn{
    width: 200px;
  }
</style>
