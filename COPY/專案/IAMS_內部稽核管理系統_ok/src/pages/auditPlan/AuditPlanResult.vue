<template>
  <div class="container">
    <div class="result__row row">
      <div class="col-6">
        <img
          class="result__img"
          src="@/assets/images/icon_successfully.svg"
          alt=""
        >
      </div>
      <div class="result__content col-6">
        <p class="result__title">
          恭喜結案成功!
        </p>
        <p class="result__text">
          確認年度稽核已結案
        </p>
        <button
          class="btn--backhome"
          @click="backHome"
        >
          回首頁
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class AuditPlanResult extends Vue {
	backHome() {
		this.$router.push('/index');
	}
}
</script>

<style lang="scss" scoped>
.result__row{
  padding-top: 20vh;
}
.result__img{
  padding-top: 42px;
  float: right;
  width: 460px;
  height: 354px;
}
.result__content{
  padding-left: 82px;
  p{
    margin:0 ;
  }
  .result__title{
    font-size: 56px;
    font-weight: bold;
  }
  .result__text{
    font-size: 20px;
    color: #00000073;
    margin-bottom: 30px;
  }
}
</style>
