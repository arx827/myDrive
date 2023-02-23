<template>
  <div class="container">
    <div class="result__wrap">
      <div class="result__header text-center">
        <img
          class="d-inline-block"
          src="@/assets/image_success.svg"
          alt=""
        >
        <p class="result__title">
          受理成功
        </p>
      </div>
      <div class="result__body">
        <slot name="body" />
      </div>
      <div
        v-if="files && files.length > 0"
        class="result__other"
      >
        <div class="other__title">
          附件下載
        </div>
        <div
          class="row"
        >
          <div
            v-for="(pdf, index) in files"
            :key="index"
            class="col-4"
            @click="clickFile(pdf)"
          >
            <div
              class="pdf__block text-center"
            >
              <div class="pdf__inner">
                <img
                  class="d-inline-block"
                  src="@/assets/image_PDF.svg"
                  alt=""
                >
                <div class="pdf__name">
                  {{ pdf.name }}
                </div>
                <div class="pdf__size">
                  {{ pdf.size }}
                </div>
              </div>
            </div>
          </div>
        </div>
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
  files?: [
    {name: string; size: string; id: string }
  ]

  clickFile(pdf) {
  	this.$emit('clickFile', pdf);
  }
}
</script>

<style lang="scss" scoped>
.pdf__block {
  cursor: pointer;
  border-radius: 4px;
  border: 3px transparent solid;
  display: block;
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  &:hover {
    border: 3px #A6D5FA solid;
    .pdf__inner {
      border: 1px transparent solid;
    }
  }
  .pdf__inner {
    border-radius: 4px;
    padding: 15px 0;
    border: 1px #D9D9D9 solid;
  }
  .pdf__name {
    color: #000000;
    margin-top: 10px;
    font-size: 14px;
  }
  .pdf__size {
    color: #dddddd;
  }
}
.result__other {
  width: 536px;
  margin: 25px auto 80px auto;
}
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
  margin-top: 80px;
}
</style>
