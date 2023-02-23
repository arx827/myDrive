<template>
  <div class="container">
    <div class="result__wrap">
      <div class="result__header text-center">
        <img
          class="d-inline-block"
          src="@/assets/image_fail.svg"
          alt=""
        >
        <p class="result__title">
          受理失敗
        </p>
      </div>
      <div class="result__body">
        <slot name="body" />
      </div>
      <div class="result__footer text-center">
        <slot name="buttons" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { CaseCredentials, ImgCreation } from '@fubonlife/co-giiss-api-axios-sdk';

@Component({})
export default class Fail extends Vue {
}
</script>

<style lang="scss" scoped>
.result__wrap {
  padding: 40px 0;
}
.result__title {
  color: #ED7D7D;
  font-weight: 600;
  font-size: 18px;
  margin: 10px 0;
}
.result__body {
  background-color: #FFF4F4;
  padding: 25px 38px;
  border-radius: 4px;
  width: 536px;
  margin: 0 auto 80px auto;
}
.content__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
}
.upload__count {
  font-size: 24px;
  font-weight: 600;
}
hr {
  border: 0;
  border-bottom: 1px #CECECE dashed;
  outline: 0;
}
</style>
