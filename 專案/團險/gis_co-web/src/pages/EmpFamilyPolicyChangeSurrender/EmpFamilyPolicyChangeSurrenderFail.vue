<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultFail>
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
        <hr>
        <div class="content__title">
          檢核訊息
        </div>
        <div class="content__msg">
          <div
            v-for="(error, index) in errorMsg"
            :key="index"
          >
            {{ error }}
          </div>
        </div>
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
    </ResultFail>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultFail from '@/components/shared/layout/ResultFail.vue';

@Component({ components: { Breadcrumb, ResultFail } })
export default class Success extends Vue {
  @Prop()
  breadcrumb: {}

  surrenderName = [];

  empName = '';

  errorMsg = '';

  fromWhere = 0; // 異動編輯為1

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.surrenderName = query.surrenderName;
  	this.empName = query.empName;
  	this.errorMsg = query.message;
  	this.fromWhere = query.fromWhere;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
</style>
