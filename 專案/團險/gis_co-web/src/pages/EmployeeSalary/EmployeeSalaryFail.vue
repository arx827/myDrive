<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultFail>
      <template v-slot:body>
        <div
          class="content__title"
        >
          員工姓名
        </div>
        <div>{{ empName }}</div>
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
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultFail from '@/components/shared/layout/ResultFail.vue';

@Component({ components: { Breadcrumb, ResultFail } })
export default class EmployeeSalaryFail extends Vue {
  @Prop()
  breadcrumb: {}

	empName = '';

  errorMsg = '';

  created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const query = this.$global.getQuery();
  	this.empName = query.empName;
  	this.errorMsg = query.message;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.content__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}
hr {
	margin: 15px 0;
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
