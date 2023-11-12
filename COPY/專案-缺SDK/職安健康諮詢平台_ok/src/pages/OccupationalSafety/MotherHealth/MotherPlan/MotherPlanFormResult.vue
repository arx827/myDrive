<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? '填表完成':'填表失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的媽咪您好，
          <br>
          您欲填寫的「懷孕期間健康情形自我評估表」已完成填寫並送出，謝謝！
        </div>
        <div v-else>
          親愛的媽咪您好，
          <br>
          您欲填寫的「懷孕期間健康情形自我評估表」，因 {{ errorMsg }} 因素無法進行。 如尚需填寫，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/MaternalProtect/motherPlan/index">
          <a
            class="btn__radius--primary me-1 btn"
            href="#"
          >返回計畫主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class MotherPlanFormResult extends Vue {
  result: 'success' | 'fail' = null;

  errorMsg: string = ''

  created() {
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.errorMsg = query.errorMsg;
  }
}
</script>

<style lang="scss" scoped>
  .btn{
    width: 200px;
  }
</style>
