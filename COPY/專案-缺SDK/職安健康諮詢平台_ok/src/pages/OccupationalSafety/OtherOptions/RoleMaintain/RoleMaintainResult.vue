<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${paramTypeCh}成功`:`${paramTypeCh}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的同仁您好，
          <br>
          {{ paramTypeCh === ('新增'||'編輯' )
            ? `您已完成${paramTypeCh}使用者，並已發送通知給相關人員執行覆核作業，謝謝。`
            : `您欲${paramTypeCh}的項目已處理成功，謝謝。` }}
        </div>
        <div v-else>
          親愛的同仁您好，
          <br>
          您欲{{ paramTypeCh }}的項目，因{{ msg }}。
          <br>
          如尚需執行，請您再次嘗試，或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <div class="btn__wrap text-center">
          <button
            class="btn__radius--primary mb-2"
            @click="back"
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
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class CaseMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  paramTypeCh = '';

  msg = '';

  back() {
  	this.$router.push({ path: '/occupationSafety/Other/roleMaintain/index' });
  }

  setResultParam() {
  	switch (this.$route.params.type) {
  	case 'back':
  		this.paramTypeCh = '退回';
  		break;
  	case 'check':
  		this.paramTypeCh = '覆核';
  		break;
  	case 'add':
  		this.paramTypeCh = '新增';
  		break;
  	case 'edit':
  		this.paramTypeCh = '編輯';
  		break;
  	default:
  		break;
  	}
  	const $query = this.$global.getQuery();
  	this.result = $query.result;
  	this.msg = $query.msg;
  }

  created() {
  	this.setResultParam();
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
