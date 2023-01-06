<template>
  <div>
    <a-row class="spin__wrap" v-if="dataSourceLoading">
      <a-spin
        :spinning="dataSourceLoading"
        tip="資料處理中，請稍候..."
        :delay="200"
        class="spin"
      >
      </a-spin>
    </a-row>
    <section>
      <div class="dataSource-sec">
        <a-row v-for="(data, index) in datas.caseFromDesc" :key="index" type="flex">
          <a-col :span="24" style="white-space: pre-line;">
            <div>{{ data }}</div>
          </a-col>
        </a-row>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { CaseFromDataVO } from "@fubonlife/edd-api-axios-sdk";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class DataSource extends Vue {
  dataSourceLoading: boolean = false;
  
  datas:CaseFromDataVO;

  created(){
    this.dataSourceLoading = true;
    let amlID = sessionStorage["review_assignment_page"];
    this.$reviewApi.getCaseFromInReviewUsingGET(amlID).then((resp)=>{
      const data = resp.data.data;
      this.datas = data;
    })
    .finally(() => {
      this.dataSourceLoading = false;
    })
  }
}
</script>

<style lang="less" scoped>
.dataSource-sec {
  font-size: 16px;
  color: #000;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  border: 1px solid #c7c7c7;
  border-radius: 2px;
  margin-top: 12px;
  margin-bottom: 24px;
  background: #eee;
}
</style>
