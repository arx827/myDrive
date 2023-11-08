<template>
  <div v-if="breadcrumb && breadcrumb.length > 0" class="ifap__breadcrumb container">
    <div class="breadcrumb__title">
      {{ breadcrumb[0] }}
    </div>
    <template v-if="breadcrumb.length > 1">
      <div
        v-for="item in breadcrumb.slice(1, 2)"
        :key="item"
        class="breadcrumb__item"
      >
        <!-- slice取breadcrumb陣列[1]不含[2]-->
        / {{ item }}
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
    this.breadcrumb = val.params.type && val.meta.breadcrumb[$type]
        ? val.meta.breadcrumb[$type]
        : val.meta.breadcrumb;
  }
}
</script>

<style lang="scss" scoped>
.ifap__breadcrumb {
  padding: 8px 0px;
  margin: 0px;
  display: flex;
  .breadcrumb__title {
    font-size: 14px;
    font-weight: bold;
    color: gray;
    margin-right: 3px;
  }
  .breadcrumb__item {
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: unnamed-color-595959;
  }
}
</style>
