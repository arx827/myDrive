<template>
  <div class="container">
    <div class="result__wrap">
      <div class="result__header">
        <h1 class="result__title">
          {{ pageTitle }}
        </h1>
      </div>
      <div class="result__body">
        <div :class="resultType === 'success' ? 'success__title':'error__title'">
          {{ resultTitle }}
        </div>
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
import Breadcrumb from '@/components/shared/layout/Breadcrumb.vue';

@Component({ components: { Breadcrumb } })
export default class Success extends Vue {
  @Prop()
  breadcrumb: {}

  @Prop()
  resultTitle: string

  @Prop()
  pageTitle: string

  @Prop()
  resultType: 'success' | 'error'
}
</script>

<style lang="scss" scoped>
.result__other {
  width: 536px;
  margin: 25px auto 80px auto;
}
.success__title {
  margin-bottom: 20px;
  color: #23C4A8;
  font-size: 24px;
  font-weight: bold;
}
.error__title {
  margin-bottom: 20px;
  color: #E06262;
  font-size: 24px;
  font-weight: bold;
}
.result__wrap {
  padding: 20px 0;
}
.result__title {
  color: #000000;
  font-weight: 600;
  font-size: 30px;
}
.result__body {
  background-color: #fff;
  padding: 25px 10%;
  border-radius: 10px;
  width: 100%;
  margin: 20px auto 0 auto;
  box-shadow: 0px 3px 0px #C9C9C9;
  border: 1px solid #CED4D9;
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
.result__footer {
  margin-top: 70px;
  margin-bottom: 50px;
}
</style>
