<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${ type }成功`:`${ type }失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          親愛的同仁您好，
          <br>
          {{ successStr }}
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
export default class UserMaintainResult extends Vue {
  result: 'success' | 'fail' = null;

  msg = null;

  type = '覆核';

  subType = '同意';

  // 取得 Query 並帶入資料
  setParam() {
  	const $query = this.$global.getQuery();
  	if ($query) {
  		this.result = $query.result;
  		this.msg = $query.msg;
  	}
  }

  changeStr() {
  	switch (this.$route.params.type) {
  	case 'pass':
  		this.type = '覆核';
  		this.subType = '覆核同意';
  		break;
  	case 'reject':
  		this.type = '退回';
  		this.subType = '覆核退回';
  		break;
  	case 'edit':
  		this.type = '編輯';
  		this.subType = '編輯';
  		break;
  	}
  }

  get successStr() {
  	return (this.$route.params.type === 'edit') ? `您已成功${this.type}使用者，並已發送通知給相關人員執行覆核作業，謝謝。` : `您欲${this.subType}的項目已處理成功，謝謝。`;
  }

  /**
   * Event
   */
  goback() {
  	this.$router.push({ name: 'AccountIndex' });
  }

  /**
   * Hook
   */
  created() {
  	this.setParam();
  	this.changeStr();
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
