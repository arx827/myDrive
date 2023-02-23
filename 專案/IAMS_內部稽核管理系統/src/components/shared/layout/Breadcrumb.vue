<template>
  <div
    v-if="breadcrumb && breadcrumb.length > 0"
    class="breadcrumb container"
  >
    <img
      class="breadcrumb__img"
      src="@/assets/images/icon-breadcrumb-title.svg"
      alt=""
    >
    <div class="breadcrumb__title">
      {{ breadcrumb[0] }}
    </div>
    <template v-if="breadcrumb.length > 1">
      <div
        v-for="item in (breadcrumb.slice(1))"
        :key="item"
        class="breadcrumb__item"
      >
        <a-icon
          type="right"
          class="breadcrumb__item__img"
        />
        {{ item }}
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({})
export default class Breadcrumb extends Vue {
  breadcrumb: string[] = [];

  @Watch('$route', { immediate: true, deep: true })
  onRouteChanged(val) {
  	const $type = val.params.type;
  	this.breadcrumb = (val.params.type && val.meta.breadcrumb[$type]) ? val.meta.breadcrumb[$type] : val.meta.breadcrumb;
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb{
  padding: 12px 0px;
  display: flex;
  .breadcrumb__img{
    width: 7px;
    margin-right: 6px;
  }
  .breadcrumb__title{
    font-size: 20px;
    font-weight: bold;
    color: $FONT-PRIMARY;
    margin-right: 3px;
  }
  .breadcrumb__item{
    display: flex;
    align-items: center;
    font-weight: bold;
  }
  .breadcrumb__item__img{
      margin:0 6px;
    }
  ::v-deep{
      .anticon svg{
        font-size: 10px;
        font-weight: bold;
      }
    }
}
</style>
