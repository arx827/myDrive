<template>
  <div class="content row">
    <div class="col-4">
      <div class="notfound__title mt-4">
        404
      </div>
      <div class="notfound__text">
        抱歉，您訪問的頁面不存在
      </div>
      <a-button
        class="btn--backhome mt-2"
        @click="goIndex"
      >
        回首頁
      </a-button>
    </div>
    <div class="content__img col-8">
      <img src="@assets/images/icon_404.svg">
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({ })
export default class NotFound extends Vue {
	goIndex() {
		this.$router.push({ name: 'Index' });
	}
}
</script>

<style lang="scss" scoped>
  .content{
    width: 60%;
    height: 30%;
    padding-top: 30vh;
    margin: 0 auto;
  }
  .content__img{
    z-index: -1;
    height: 100%;
    width: 80%;
    position: absolute;
    right: 0;
  }
  .notfound__title{
    font-size: 56px;
  }
  .notfound__text{
    color:#00000073
  }
</style>
