<template>
  <div class="homePageBg">
    <div class="homePageTitleWrap">
      <p class="homePageTitle">
        {{ title_en }}
      </p>
      <p class="homePageTitle">
        {{ title_tw }}
      </p>
      <p class="homePageSubTitle">
        你工作的好幫手！
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: { },
})
export default class Index extends Vue {
  title_en = "IFAP";

  title_tw = "資訊輔助平台";
}
</script>

<style lang="scss" scoped>
.homePageBg {
  background-image: url('~@imgs/image_bg_2x.png');
  background-size: 653px;
  background-position: right;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.homePageTitleWrap {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.homePageTitle {
  font-size: 42px;
  font-weight: bolder;
  margin-bottom: 0;
  line-height: 1.3;
}
.homePageSubTitle {
  font-size: 20px;
  font-weight: bolder;
  margin-bottom: 0;
}
</style>
