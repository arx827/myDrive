<template>
  <div>
    <Breadcrumb :breadcrumb="breadcrumb" />
    <ResultFail>
      <template v-slot:body>
        <p
          class="info__txt fw-bold content__title"
        >
          共計資料筆數
        </p>
        <div class=".upload__count">
          {{ data.count }}
        </div>
        <hr class="hr__line">
        <div class="content__title">
          檢核訊息
        </div>
        <div class="content__msg">
          {{ data.returnMessage }}
        </div>
      </template>
      <template v-slot:buttons>
        <router-link to="/index">
          <a
            class="btn__radius--primary--outline me-1"
            href="#"
          >返回首頁</a>
        </router-link>
        <router-link to="/empFamilyPolicyChangeWithoutSalary">
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
import { UpdateSalaryDto } from '@fubonlife/co-giiss-api-axios-sdk';
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';
import ResultFail from '@/components/shared/layout/ResultFail.vue';

@Component({
	components: {
		Breadcrumb,
		ResultFail,
	},
})
export default class EmpFamilyPolicyChangeWithoutSalaryFail extends Vue {
  @Prop()
  breadcrumb: {};

  data: UpdateSalaryDto = {} ;

  count: number = 0;

  created() {
  	const props = JSON.parse(sessionStorage.param);
  	this.data = props.EmpFamilyPolicyChangeWithoutSalaryFail.query.data;
  }

  updated() {
  	window.parseWord();
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: bold;
  color: $COLOR-MAIN5;
  padding: 57px 0px 20px 0px;
}
.hr__line{
  margin: 15px 0;
}
</style>
