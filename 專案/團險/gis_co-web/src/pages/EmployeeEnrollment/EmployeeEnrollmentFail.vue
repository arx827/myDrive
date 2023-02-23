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
        {{ surrenderName }}
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
      <template v-slot:buttons>
        <router-link to="/index">
          <a
            class="btn__radius--primary--outline me-1"
            href="#"
          >返回首頁</a>
        </router-link>
        <a
          class="btn__radius--primary--outline ms-1 me-1"
          href="#"
          @click="goToFamilyEnroll"
        >繼續眷屬加保</a>
        <router-link to="/employeeEnrollment/employeeEnrollmentApplication">
          <a
            class="btn__radius--primary ms-1"
            href="#"
          >繼續員工加保</a>
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
export default class EmployeeEnrollmentFail extends Vue {
  @Prop()
  breadcrumb: {}

  surrenderName = [];

  empName = '';

  errorMsg = '';

  query = null;

  async created() {
  	if (this.$global.getParam() === null) {
  		this.$router.push({ path: '/' }).catch((err) => { err; });
  		return;
  	}
  	const encryptQuery = await this.$encryptionDecryption.decrypt(this.$global.getQuery());
  	this.query = JSON.parse(encryptQuery);
  	console.log('query', this.query);
  	this.surrenderName = this.query.insName;
  	this.empName = this.query.empName;
  	this.errorMsg = this.query.message;
  	this.$global.clearParam();
  	setTimeout(() => {
  		window.parseWord();
  	}, 100);
  }

  updated() {
  	window.parseWord();
  }

  // 前往眷屬加保頁面
  async goToFamilyEnroll() {
  		const query = await this.$encryptionDecryption.encrypt(JSON.stringify({
  			EmployeeEnrollmentModel: null,
  			employeeId: this.query.employeeId,
  		}));
  	this.$global.changeRouterAndaddParam({
  		toRouter: 'CO_EEnrollmentApplication',
  		query,
  	});
  }
}
</script>

<style lang="scss" scoped>
</style>
