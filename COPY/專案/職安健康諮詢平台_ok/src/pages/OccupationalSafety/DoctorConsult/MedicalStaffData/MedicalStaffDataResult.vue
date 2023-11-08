<template>
  <div>
    <Result
      :page-title="'執行結果'"
      :result-title="result === 'success' ? `${type}成功`:`${type}失敗`"
      :result-type="result"
    >
      <template v-slot:body>
        <div v-if="result === 'success'">
          <p>親愛的護理同仁您好，</p>
          <p>您已完成{{ type }}項目，謝謝！</p>
        </div>
        <div v-else>
          <p>親愛的護理同仁您好，</p>
          <p>您欲{{ type }}的項目，因{{ msg }}。</p>
          <p>如尚需{{ type }} 項目，請您再次嘗試。或與相關服務人員聯繫，謝謝您！</p>
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/occupationSafety/PhyConsult/medicalStaffData/index">
          <a
            class="btn__radius--primary"
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
export default class MedicalStaffDataResult extends Vue {
  result: 'success' | 'fail' = null;

  type = '編輯';

  // 錯誤訊息
  msg = '';

  created() {
  	this.type = this.$route.params.type === 'edit' ? '編輯' : '新增';
  	const query = this.$global.getQuery();
  	this.result = query.result;
  	this.msg = query.msg;
  }
}
</script>
