<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? typeName+'成功':typeName+'失敗'"
      :result-type="result"
    >
      <template v-slot:body>
        <!-- 成功訊息 -->
        <div v-if="result === 'success'">
          <div class="font--black">
            <p>親愛的護理同仁您好，</p>
            <p>您欲{{ typeName }}的項目已完成，謝謝！</p>
          </div>
        </div>
        <!-- 失敗訊息 -->
        <div
          v-else
          class="font--black"
        >
          <p>親愛的護理同仁您好，</p>
          <p>您欲{{ typeName }}的內容，因{{ msg }}因素無法進行。</p>
          <p>如尚需{{ typeName }}檔案，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/Other/healthEduMaintain/index">
          <a
            class="btn__radius--primary px-5"
            href="#"
          >返回衛教主頁</a>
        </router-link>
      </template>
    </Result>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Result } })
export default class SendNoticeModifyReserveSendResult extends Vue {
  result: 'success' | 'fail' = null;

  typeName = '新增';

  // 錯誤訊息
  msg = null;

  created() {
  	this.result = this.$global.getQuery().result;
  	this.msg = this.$global.getQuery().errorMsg;
  	this.setParam();
  }

  setParam() {
  	if (this.$route.params.type === 'editHE' || this.$route.params.type === 'editDoc' || this.$route.params.type === 'editForm') {
  		this.typeName = '編輯';
  	}
  }
}
</script>

<style lang="scss" scoped>
  .font--black {
    color: #000;
  }
</style>
