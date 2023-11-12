<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <Result
      :page-title="'執行結果'"
      :result-title="'新增報名成功'"
      :result-type="'success'"
    >
      <template v-slot:body>
        <div>
          親愛的護理同仁您好， 您欲協助新增的活動報名人員，因OOXXOOXX因素無法進行新增。 如尚需修改此項預約，請您再次嘗試。或與相關服務人員聯繫，謝謝您！
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/index">
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
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import Result from '@/components/shared/layout/Result.vue';

@Component({ components: { Breadcrumb, Result } })
export default class SuccessSample extends Vue {
  @Prop()
  breadcrumb: {}

  created() {
  	//
  }
}
</script>

<style>

</style>
