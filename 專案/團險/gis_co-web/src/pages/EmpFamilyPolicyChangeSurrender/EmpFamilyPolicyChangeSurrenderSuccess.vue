<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultSuccess>
      <template v-slot:body>
        <p
          class="info__txt primary__txt fw-bold"
        >
          員工：{{ empName }}
        </p>
        <div class="fw-bold">
          被保險人姓名
        </div>
        <div
          v-for="(n, index) in surrenderName"
          :key="index"
        >
          {{ n }}
        </div>
        <!-- <hr> -->
        <!-- <div class="content__title">
            檢核訊息
          </div>
          <div class="content__msg">
            請確認上傳之資料，並修正錯誤之資料，再重新上傳。
          </div> -->
      </template>
      <template
        v-if="!fromWhere"
        v-slot:buttons
      >
        <router-link to="/index">
          <a
            class="btn__radius--primary--outline me-1"
            href="#"
          >返回首頁</a>
        </router-link>
        <router-link to="/empFamilyPolicyChange">
          <a
            class="btn__radius--primary ms-1"
            href="#"
          >繼續變更</a>
        </router-link>
      </template>
    </ResultSuccess>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultSuccess from '@/components/shared/layout/ResultSuccess.vue';

@Component({ components: { Breadcrumb, ResultSuccess } })
export default class Success extends Vue {
  @Prop()
  breadcrumb: {}

  surrenderName = [];

  empName = '';

  fromWhere = 0; // 異動編輯為1

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.surrenderName = query.surrenderName;
  	this.empName = query.empName;
  	this.fromWhere = query.fromWhere;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.other__title {
  font-size: 14px;
  margin-bottom: 13px;
}
.result__wrap {
  padding: 40px 0;
}
.result__title {
  color: #000000;
  font-weight: 600;
  font-size: 18px;
  margin: 10px 0;
}
.result__body {
  background-color: #F2F8FF;
  padding: 25px 38px;
  border-radius: 4px;
  width: 536px;
  margin: auto;
}
.content__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}
.result__footer {
  margin-top: 80px;
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
