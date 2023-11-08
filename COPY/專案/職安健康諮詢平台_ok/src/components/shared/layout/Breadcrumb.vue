<template>
  <div
    v-if="breadcrumbList"
    class="breadcrumb"
  >
    <div class="container">
      <ol>
        <li
          v-for="(b, index) in breadcrumbList"
          :key="index"
          :class="{'breadcrumb--active': index === breadcrumbList.length-1}"
        >
          {{ b }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import {
	Vue, Component, Prop, Watch,
} from 'vue-property-decorator';

@Component({})
export default class Breadcrumb extends Vue {
  @Prop()
  breadcrumb: {list: []; nowActive: number}

  breadcrumbList: string[] = [];

  /**
   * 監聽
   */
  @Watch('$route', { immediate: true, deep: true })
  watchbreadcrumb(newVal) {
  	// 依 type 參數動態判斷麵包屑
  	const $type = newVal.params.type;
  	this.breadcrumbList = ($type) ? this.$route.meta.breadcrumb[$type] : this.$route.meta.breadcrumb;
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  background: $COLOR-MAIN10;
  padding: 13px 0;
  color: #000000;
  font-size: 12px;
  margin-bottom: 0;
  min-height: 42px;
  align-items: center;
  ol {
    display: flex;
    align-items: center;
    line-height: 1;
    li {
      display: inline-flex;
      font-size: 12px;
      &.breadcrumb--active {
        font-weight: bold;
      }
      &::after {
        content: '/';
        display: inline-block;
        margin: 0 3px 0 5px;
        padding: 0 5px;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
  .breadcrumb__home-icon {
    margin-top: -1px;
  }
}
</style>
